# Data Diagram และ Data Dictionary

ระบบใช้ Google Sheets เป็นฐานข้อมูลแบบตาราง ความสัมพันธ์ด้านล่างเป็น **logical relationship** ที่ source ดูแล ไม่ใช่ foreign key ที่ Google Sheets บังคับโดยอัตโนมัติ ผู้ดูแลจึงต้องรักษา ID และ reference เดิม

## ภาพรวมความสัมพันธ์หลัก

```mermaid
erDiagram
  APP_USERS ||--o| APP_USER_PROFILE : has
  APP_USERS ||--o{ APP_SESSIONS : opens
  APP_ROLES ||--o{ APP_USERS : assigns
  APP_ROLES ||--o{ APP_ROLE_PERMISSIONS : grants
  APP_ROLES ||--o{ APP_ROLE_ACTION_PERMISSIONS : grants
  APP_USERS ||--o{ APP_AUDIT_LOG : performs
  MST_ORG_UNITS ||--o{ APP_USER_PROFILE : organizes
  MST_ORG_UNITS ||--o{ INVENTORY : owns
  MST_ORG_UNITS ||--o{ INCIDENT : reports
  MST_DEVICE_MODELS ||--o{ INVENTORY : classifies
  INVENTORY ||--o{ INCIDENT_META : asset_ref
  INCIDENT ||--|| INCIDENT_META : extends
  INCIDENT ||--o{ INCIDENT_EVENTS : history
  INCIDENT ||--o{ INCIDENT_FILES : attaches
  INCIDENT ||--o| TICKET_SERVICE_REPORT : reports
  LINE_INBOX ||--o| LINE_INBOX_REVIEWS : reviews
  LINE_INBOX o|--o| INCIDENT : creates
  PM_PLANNINGS ||--o{ PM_PLANNING_ITEMS : contains
  PM_PLANS ||--o{ PM_PLAN_HISTORY : audits
  MST_ORG_UNITS ||--o{ PM_PLANS : schedules
```

## กลุ่มตาราง

### Ticket และไฟล์

| Sheet | Key / reference | หน้าที่ |
|---|---|---|
| `INCIDENT` | `เลขที่แจ้งปัญหา` | ข้อมูลคำขอ ผู้แจ้ง อุปกรณ์ หน่วยงาน สถานะ ผู้ดำเนินการและผลแก้ไข |
| `INCIDENT_META` | `ticket_id` → `INCIDENT` | asset, assignee, confirmation, close/reopen metadata |
| `INCIDENT_EVENTS` | `event_id`, `ticket_id` | timeline การเปลี่ยนสถานะและหมายเหตุ |
| `INCIDENT_FILES` | `file_id`, `ticket_id` | metadata ของไฟล์ใน Google Drive |
| `TICKET_SERVICE_REPORT` | `ticket_id` | ผลงานบริการ อุปกรณ์ส่งซ่อม/ทดแทน และ revision |

### ครุภัณฑ์และข้อมูลหลัก

| Sheet | Key / reference | หน้าที่ |
|---|---|---|
| `INVENTORY` | `รหัสอุปกรณ์` | ข้อมูลทั่วไป เทคนิค สถานที่ สถานะ และผลสำรวจ |
| `MST_DEVICE_MODELS` | `model_id` | master ประเภทอุปกรณ์ ยี่ห้อ และรุ่น |
| `MST_ORG_UNITS` | `org_unit_id` | โครงสร้างหน่วยงาน ชื่อย่อ ระดับ และสถานที่ |
| `APP_LOOKUPS` | `lookup_id`, `lookup_type` | รายการเลือก เช่น ประเภทปัญหา/สถานะ/ช่องทาง |

### ผู้ใช้ สิทธิ์ และระบบ

| Sheet | Key / reference | หน้าที่ |
|---|---|---|
| `APP_USERS` | `user_id`, `username` | บัญชี hash/salt, role, lock และสถานะใช้งาน |
| `APP_USER_PROFILE` | `profile_id`, `user_id` | โปรไฟล์ หน่วยงาน ติดต่อ และรูป |
| `APP_SESSIONS` | `token_hash`, `user_id` | session expiry/revocation; ไม่เก็บ raw token |
| `APP_ROLES` | `role_id`, `role_code` | นิยาม Role |
| `APP_ROLE_PERMISSIONS` | `permission_id`, `role_code` | สิทธิ์ระดับ module/CRUD/export/manage |
| `APP_ROLE_ACTION_PERMISSIONS` | `permission_id`, `role_key`, `action_key` | สิทธิ์ action แบบละเอียดและ scope |
| `APP_SETTINGS` | `key` | branding, folder ID, policy และ binding marker |
| `APP_AUDIT_LOG` | `audit_id` | ผู้ทำ action, entity, result, detail และ session reference |

### LINE และ PM

| Sheet | Key / reference | หน้าที่ |
|---|---|---|
| `LINE_INBOX` | `inbox_id`, `event_id` | envelope ที่รับจาก Gateway และสถานะ review/create |
| `LINE_INBOX_REVIEWS` | `inbox_id` | ข้อมูลที่ผู้ตรวจแก้ก่อนสร้าง ticket พร้อม revision |
| `PM_PLANNINGS` | `planning_id` | กลุ่มแผนและช่วงเวลา |
| `PM_PLANNING_ITEMS` | `plan_id`, `planning_id` | งานในกลุ่มแผน ผู้รับผิดชอบ priority/progress |
| `PM_PLANS` | `plan_id` | งาน PM ตามวัน หน่วยงาน พื้นที่ เวลา และสถานะ |
| `PM_PLAN_HISTORY` | `log_id`, `plan_id` | before/after JSON และผู้ดำเนินการ |
| `APP_HOLIDAYS` | `id` | วันหยุด/กิจกรรม ช่วงวันที่ revision และ soft delete |

## Referential integrity ที่ต้องรักษา

1. `ticket_id` ใน meta/event/file/report ต้องอ้างถึง ticket เดิม
2. `drive_file_id` ต้องไม่ถูกลบจาก Drive ขณะยังมี `INCIDENT_FILES` อ้างถึง
3. `user_id`, `role_code`, `org_unit_id`, `model_id` ต้องใช้ค่าจาก master ที่เกี่ยวข้อง
4. การ deactivate ปลอดภัยกว่าการลบ master ที่มีการอ้างอิง
5. Bulk import ต้องตรวจ header, preview, validation และจำนวนไม่เกิน 500 แถวต่อคำขอ
6. ห้าม renumber, fuzzy merge หรือ auto-map ข้อมูลที่มี history โดยไม่มี mapping report และการอนุมัติ

## การสำรอง

สำรองทั้ง Spreadsheet และไฟล์ Drive ที่เกี่ยวข้อง บันทึก source commit, Apps Script version, deployment ID, เวลา และผู้ดำเนินการ การสำรอง source ด้วย `clasp pull` ไม่ใช่การสำรองข้อมูล Sheets หรือ Script Properties
