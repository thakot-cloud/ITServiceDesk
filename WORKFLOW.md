# แผนผัง Workflow ของ IT Service Desk (`V1.1.69`)

เอกสารนี้รวบรวมแผนผัง Workflow หลักทั้ง 7 กระบวนการในระบบ Web App, LINE Gateway, Software License, แผน PM และการ Release

## 1. Ticket Lifecycle และใบงาน CM-Form_69

```mermaid
flowchart LR
  A["แจ้งเรื่อง"] --> B["รับแจ้ง"]
  B --> C["มอบหมาย"]
  C --> D["กำลังดำเนินการ"]
  D --> E["รอยืนยันผล<br/>(กรอกข้อมูลใบงาน CM-Form_69)"]
  E --> F["พิมพ์ใบงาน A4 & ลงนาม<br/>+ แนบหลักฐาน Service"]
  F --> G["ปิดงาน"]
```

ทุก transition ตรวจ session, permission และสถานะปัจจุบันฝั่ง server แล้วบันทึก `INCIDENT`, `INCIDENT_META` และ `INCIDENT_EVENTS` ตามหน้าที่ เมื่อเข้าสู่ขั้น `รอยืนยันผล` หรือ `ปิดงาน` ระบบจะรองรับการกรอกข้อมูล `TICKET_SERVICE_REPORT` (เสร็จสิ้นเรียบร้อย / ส่งซ่อม / สำรองอุปกรณ์ / เปลี่ยนอุปกรณ์ พร้อมเลือกอุปกรณ์จากทะเบียน Inventory) และพิมพ์ใบงาน A4 (`CM-Form_69`)

```mermaid
sequenceDiagram
  actor U as ผู้แจ้ง / เจ้าหน้าที่
  participant W as Web App (UI_Client)
  participant S as Apps Script (Server.js)
  participant DB as Google Sheets (DBS)
  participant D as Google Drive

  U->>W: กรอกรายละเอียดแจ้งซ่อม / แนบไฟล์
  W->>S: createTicket(token, data)
  S->>S: validate + authorize + LockService
  S->>DB: สร้าง INCIDENT / INCIDENT_META / INCIDENT_EVENTS
  opt มีไฟล์แนบ
    S->>D: บันทึกไฟล์ใน Drive Folder
    S->>DB: บันทึก metadata ลง INCIDENT_FILES
  end
  S-->>W: ส่งกลับ ticket ID

  Note over U,DB: เมื่อดำเนินการแก้ไขเสร็จสิ้น (รอยืนยันผล / ปิดงาน)
  U->>W: กรอกสถานะงาน / อุปกรณ์ส่งซ่อม-ทดแทน
  W->>S: saveServiceReportDetails(token, ticketId, payload)
  S->>DB: อัปเดต TICKET_SERVICE_REPORT (revision check)
  U->>W: พิมพ์ใบงาน CM-Form_69 A4 (PDF) -> ลงนาม & แนบกลับ
```

## 2. ครุภัณฑ์ การสำรวจ และการกำหนดรหัสต่อเนื่อง (`INV-TOR70-xxxx`)

```mermaid
flowchart TD
  A["ค้นหาด้วย Asset No. / Serial / รหัสอุปกรณ์"] --> B{"พบรายการ?"}
  B -- "ไม่พบ" --> C["ตรวจ Master ประเภท / ยี่ห้อ / รุ่น (MST_DEVICE_MODELS)"]
  C --> D["สร้างอุปกรณ์ใหม่ตามสิทธิ์<br/>(สร้างรหัส INV-TOR70-xxxx ภายใต้ LockService)"]
  B -- "พบ" --> E["เปิด Equipment Drawer (5 แท็บ)"]
  D --> E
  E --> F["1. ข้อมูลทั่วไป (+ หมายเลขสินทรัพย์)"]
  E --> G["2. คุณลักษณะทางเทคนิค"]
  E --> H["3. License (ADMIN/MANAGER Only)"]
  E --> I["4. การสำรวจ"]
  E --> J["5. ประวัติแจ้งซ่อม"]
  F --> K["Validate + Lock + Save + Audit Log"]
  G --> K
  I --> K
```

ข้อมูลแต่ละแท็บแยกขอบเขตการบันทึกและล้าง cache ของแท็บ `License` อัตโนมัติเมื่อบันทึกข้อมูลทั่วไปหรือคุณลักษณะ เพื่อลดการเขียนทับข้อมูลที่ไม่ได้แก้

## 3. Software License Lookup & Secret Reveal Workflow (`V1.1.69`)

```mermaid
flowchart TD
  A["ADMIN / MANAGER เปิดแท็บ License ของอุปกรณ์"] --> B["เรียก getAssetLicenses(token, assetId)"]
  B --> C{"ตรวจ Role = ADMIN/MANAGER<br/>และ Action license.view?"}
  C -- "ไม่ผ่าน" --> Z["ปฏิเสธ (403 Forbidden)"]
  C -- "ผ่าน" --> D["อ่านข้อมูลอุปกรณ์จาก INVENTORY<br/>+ สถานะ/QC จาก SOFTWARE_LICENSES (DBS)"]
  D --> E["อ่านไฟล์ License (Full_Data)<br/>จับคู่ด้วย Normalized Exact Serial"]
  E --> F{"ผลการจับคู่ Serial"}
  F -- "พบ 1-to-1 (Matched)" --> G["สถานะ matched<br/>แสดงค่าปกปิด + ป้าย QC + ปุ่มเปิดดูค่าจริง"]
  F -- "ไม่พบ/เข้าถึงไม่ได้ แต่มีใน DBS" --> H["สถานะ masked_only<br/>แสดงค่าปกปิด + ป้าย QC (ปิดปุ่มเปิดดูค่าจริง)"]
  F -- "พบ Serial ซ้ำใน Full_Data" --> I["สถานะ ambiguous<br/>หยุดแสดงคีย์ + แจ้งตรวจซ้ำ"]
  F -- "ไม่พบทั้งสองแหล่ง" --> J["สถานะ unmatched<br/>แนะนำตรวจ Serial Number"]

  G --> K["ผู้ใช้กดปุ่ม 'เปิดดูค่าจริง' + กรอกรหัสผ่านปัจจุบัน"]
  K --> L["เรียก revealAssetLicenseSecret(token, assetId, fieldKey, password)"]
  L --> M{"ตรวจสิทธิ์ license.reveal_secret<br/>+ รหัสผ่านผู้ใช้ตรงกัน?"}
  M -- "ไม่ผ่าน" --> N["แจ้งข้อผิดพลาด + บันทึก Audit Log (DENIED)"]
  M -- "ผ่าน" --> O["แสดงค่าจริงบนหน้าจอ 60 วินาที<br/>+ บันทึก Audit Log (ไม่เก็บค่าลับ)"]
```

## 4. LINE Inbox และ Bridge เข้าสู่ฟอร์มแจ้งซ่อม (`V1.1.63`+)

```mermaid
flowchart LR
  A["LINE Group / OA"] -->|"Webhook"| CW["Cloudflare Worker<br/>(Verify Channel Secret & Allowed Group)"]
  CW -->|"Signed Envelope (HMAC)"| B["doPost / Ingress (Entrypoints.js)"]
  B --> C{"ตรวจ protocol, size, timestamp, HMAC"}
  C -- "ไม่ผ่าน" --> D["Reject + Audit Log"]
  C -- "ผ่าน" --> E["LINE_INBOX: PENDING_REVIEW"]
  E --> F["เจ้าหน้าที่ Claim รายการ"]
  F --> G["ตรวจ/แก้ข้อมูล Review"]
  G --> H{"ตัดสินใจดำเนินการ"}
  H -- "Reject" --> I["REJECTED + เหตุผล"]
  H -- "ส่งต่อฟอร์มแจ้งซ่อม" --> J["เปิด New Ticket พร้อม Pre-fill ข้อมูลจาก LINE"]
  H -- "Approve โดยตรง" --> K["สร้าง INCIDENT + CREATED + ticket_id"]
  K -- "ล้มเหลว" --> L["FAILED / RECONCILIATION_REQUIRED + Audit"]
```

## 5. Authentication, Permission และ Concurrency Flow

```mermaid
flowchart TD
  A["Request พร้อม Session Token"] --> B["Hash Token และอ่าน APP_SESSIONS"]
  B --> C{"Active, ไม่ถูก Revoke และไม่หมดอายุ?"}
  C -- "ไม่ผ่าน" --> D["ปฏิเสธ + บังคับกลับหน้า Login"]
  C -- "ผ่าน" --> E["ตรวจสอบ NIST Force Password Change"]
  E --> F["อ่าน Role (ADMIN / MANAGER / TECHNICIAN / ITSUPPORT / USER)"]
  F --> G["ตรวจ Module (11 Modules) + Action Permission + Org Scope"]
  G -- "ไม่ผ่าน" --> D
  G -- "ผ่าน" --> H["Validate Input & Schema"]
  H --> I["LockService + Revision Check (กันเขียนทับพร้อมกัน)"]
  I --> J["Write Google Sheets / Drive + Audit Log"]
  J --> K["Response แบบ Public-Safe (Mask Secrets)"]
```

> UI ใช้ permission เพื่อซ่อน/แสดงปุ่มและเมนู แต่ **Server Permission ใน `Server.js` เป็นแหล่งตัดสินสิทธิ์จริงเสมอ**

## 6. แผน PM และปฏิทิน (`PM_PLANS` & `PM_PLANNINGS`)

```mermaid
flowchart LR
  A["ผู้ดูแลตั้งค่า APP_HOLIDAYS<br/>(วันหยุดราชการ/กิจกรรม)"] --> B["โหลดปฏิทิน PM / มุมมอง Planning"]
  B --> C["เลือกวัน + หน่วยงาน + พื้นที่ + เวลา + ผู้รับผิดชอบ"]
  C --> D["บันทึก PM_PLANS / PM_PLANNINGS<br/>(Revision Check + LockService)"]
  D --> E["ติดตามสถานะ:<br/>รอดำเนินการ -> กำลังดำเนินการ -> ดำเนินการแล้ว / ยกเลิก"]
  E --> F["บันทึก PM_PLAN_HISTORY (before/after JSON)"]
```

## 7. Development, Clasp Push & Production Release Workflow

```mermaid
flowchart LR
  A["ยืนยัน Local / Git / Script ID / DB / Deployment ID"] --> B["สำรอง source ลง .pull-backups/ + สำรอง DB"]
  B --> C["clasp pull & ตรวจ diff"]
  C --> D["แก้ไข source + อัปเดต patch version"]
  D --> E["ตรวจ node --check + UI script + unit tests + git diff --check"]
  E --> F["git commit (แยก feat/fix กับ docs)"]
  F --> G["git push origin main"]
  G --> H{"ได้รับอนุมัติ Deploy ขึ้น Production?"}
  H -- "ยัง" --> I["หยุดที่ source พร้อมรายงานผล"]
  H -- "ได้รับอนุมัติ" --> J["clasp push --force"]
  J --> K["clasp version (สร้างเลข version ใหม่)"]
  K --> L["clasp deploy --deploymentId AKfycbxPnpvvQqm... -V N"]
  L --> M["ตรวจ HTTP 200 /exec + Smoke Test + Executions Log"]
  M --> N["บันทึก Release & Rollback Point"]
```

กฎสำคัญ:

- `clasp pull` ต้องสำรอง source ก่อนเสมอ
- GitHub และ Apps Script เป็นคนละขั้นตอน; `git push origin main` ไม่ได้เปลี่ยน Production Web App จนกว่าจะ `clasp push` และ `clasp deploy`
- ห้าม `clasp deploy` โดยไม่ระบุ `--deploymentId` เพื่อรักษา `/exec` URL เดิม
- หาก validation หรือ unit test ไม่ผ่าน ห้าม push/deploy
- Rollback source ด้วย commit ใหม่ และ rollback runtime ด้วยการย้าย deployment ID เดิมกลับไปยัง Apps Script version ก่อนหน้า
