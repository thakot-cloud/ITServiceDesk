# 🗂️ Data Diagram & System Workflows
### ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)
**Version: ITSD V1.1.88 | Create by : LongZe Design**

เอกสารนี้อธิบายโครงสร้างความสัมพันธ์ของฐานข้อมูล (**Entity Relationship Diagram — 26 ตารางใน `DBS_ITSD`**), โครงสร้างการจัดเก็บไฟล์บน **Google Drive**, สถาปัตยกรรมระบบ (**System Architecture**) และผังกระบวนการทำงานหลัก (**Workflows**) ทั้งหมดของระบบ **ITSD : ITServiceDesk**

---

## 📌 ข้อมูลอ้างอิงโครงสร้างโปรเจกต์ (Unified Project Links)

| องค์ประกอบ | รหัสอ้างอิง (ID) | ลิงก์เข้าถึง |
| :--- | :--- | :--- |
| **GitHub Repository** | `thakot-cloud/ITServiceDesk` | https://github.com/thakot-cloud/ITServiceDesk |
| **Upstream Repository** | `longzedesign-dotcom/ITServiceDesk` | https://github.com/longzedesign-dotcom/ITServiceDesk |
| **Google Drive Root (`ITSD`)** | `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe` | https://drive.google.com/drive/folders/13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe |
| **Google Sheets (`ITServiceDesk — DBS`)** | `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` | https://docs.google.com/spreadsheets/d/1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c/edit |
| **Apps Script Editor** | `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7` | https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit |
| **Web App Production URL** | `AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps` (`@144` / V1.1.88) | https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec |

---

## 1. สถาปัตยกรรมระบบและการเชื่อมต่อ (System Architecture & Drive Mapping)

```mermaid
flowchart TB
    subgraph Clients["ผู้ใช้งานและช่องทางภายนอก"]
        U["ผู้ใช้งาน / ช่างเทคนิค / ผู้ดูแลระบบ (Web Browser / Mobile)"]
        L["LINE Official Account (LINE Group / Webhook)"]
    end

    subgraph GAS["Google Apps Script Project (1drKyOp...)"]
        EP["Entrypoints.js (doGet / doPost)"]
        API["Api.js (Public RPC Facade)"]
        CORE["Server.js (Core Business & Security Engine V1.1.88)"]
        UI["Index.html + UI_Client.html + UI_Styles.html + UI_Templates.html"]
    end

    subgraph Storage["Google Workspace Data & Storage"]
        CACHE["CacheService (Session / Icon Cache)"]
        LOCK["LockService (Concurrency Control)"]
        SHEET["Google Sheets: ITServiceDesk — DBS (26 Sheets)"]
        subgraph DRIVE["Google Drive Root: ITSD (13LSPwX...)"]
            D_BAK["Backup Files"]
            D_DOC["Documents"]
            D_PIC["Pictures"]
            D_SYS["System Assets"]
        end
    end

    U -->|"HTTPS GET"| EP
    EP --> UI
    UI -->|"google.script.run"| API
    API --> CORE
    L -->|"Signed POST Webhook"| EP
    CORE <--> CACHE
    CORE <--> LOCK
    CORE <-->|"SpreadsheetApp.openById"| SHEET
    CORE -->|"Database Backup"| D_BAK
    CORE -->|"PDF / เอกสารใบงาน"| D_DOC
    CORE -->|"รูปถ่ายความเสียหาย / ซ่อม"| D_PIC
    CORE -->|"ไอคอนระบบ (System Icon)"| D_SYS
```

---

## 2. Data Diagram — โครงสร้างความสัมพันธ์ฐานข้อมูล (ER Diagram — 26 ตาราง)

### 2.1 กลุ่มผู้ใช้งาน สิทธิ์ การตั้งค่า และความปลอดภัย (Identity, RBAC, Settings & Audit)

```mermaid
erDiagram
    APP_USERS ||--o| APP_USER_PROFILE : "has_profile (user_id)"
    APP_USERS ||--o{ APP_SESSIONS : "creates (user_id)"
    APP_USERS ||--o{ APP_AUDIT_LOG : "performs (actor_user_id)"
    APP_ROLES ||--o{ APP_USERS : "assigned_to (role_code)"
    APP_ROLES ||--o{ APP_ROLE_PERMISSIONS : "defines_module (role_code)"
    APP_ROLES ||--o{ APP_ROLE_ACTION_PERMISSIONS : "defines_action (role_key)"
    MST_ORG_UNITS ||--o{ APP_USER_PROFILE : "belongs_to (org_unit_id)"

    APP_USERS {
        string user_id PK
        string username
        string display_name
        string role FK
        string password_salt
        string password_hash
        boolean active
        number failed_count
        datetime locked_until
        datetime created_at
    }
    APP_USER_PROFILE {
        string profile_id PK
        string user_id FK
        string email
        string telephone
        string position
        string department_id
        string org_unit_id FK
        string picture_file_id
        string picture_url
    }
    APP_ROLES {
        string role_id PK
        string role_code
        string role_name
        string description
        boolean active
        number sort_order
    }
    APP_ROLE_PERMISSIONS {
        string permission_id PK
        string role_code FK
        string module_code
        boolean can_view
        boolean can_create
        boolean can_edit
        boolean can_delete
        boolean can_export
        boolean can_manage
    }
    APP_ROLE_ACTION_PERMISSIONS {
        string permission_id PK
        string role_key FK
        string module_key
        string action_key
        boolean is_allowed
        string scope_rule
    }
    APP_SESSIONS {
        string token_hash PK
        string user_id FK
        datetime expires_at
        boolean revoked
    }
    APP_AUDIT_LOG {
        string audit_id PK
        datetime event_at
        string actor_user_id FK
        string actor_username
        string action
        string module_code
        string entity_type
        string entity_id
        string result
        string detail
    }
    APP_SETTINGS {
        string key PK
        string value
    }
    APP_LOOKUPS {
        string lookup_id PK
        string type
        string label
        boolean active
        number sort
    }
    Branding {
        number order
        string brand
        string model
        string detail_1
        string detail_2
        string detail_3
    }
```

### 2.2 กลุ่มทะเบียนครุภัณฑ์ ใบงานแจ้งซ่อม แผนบำรุงรักษา PM และ LINE Integration

```mermaid
erDiagram
    MST_ORG_UNITS ||--o{ INVENTORY : "owns (หน่วยงาน)"
    MST_DEVICE_MODELS ||--o{ INVENTORY : "catalogs (ยี่ห้อ/รุ่น)"
    INVENTORY ||--o| INVENTORY_SORTED : "indexed_mirror"
    INVENTORY ||--o{ INCIDENT_META : "repaired_in (asset_id)"
    INVENTORY ||--o{ PM_PLANNING_ITEMS : "scheduled_in"

    INCIDENT ||--|| INCIDENT_META : "extends (ticket_id)"
    INCIDENT ||--o{ INCIDENT_EVENTS : "logs_history (ticket_id)"
    INCIDENT ||--o{ INCIDENT_FILES : "attaches (ticket_id)"
    INCIDENT ||--o| TICKET_SERVICE_REPORT : "generates_report (ticket_id)"
    MST_ORG_UNITS ||--o{ INCIDENT : "department (OrgUnitID)"

    LINE_INBOX ||--o{ LINE_INBOX_REVIEWS : "reviewed_by"
    LINE_INBOX_REVIEWS }o--o| INCIDENT : "converts_to (ticket_id)"

    PM_PLANNINGS ||--o{ PM_PLANNING_ITEMS : "contains"
    PM_PLANNINGS ||--o{ PM_PLANS : "schedules"
    PM_PLANS ||--o{ PM_PLAN_HISTORY : "records_result"

    INVENTORY {
        string asset_id PK "รหัสอุปกรณ์"
        string type "ประเภทอุปกรณ์"
        string brand "ยี่ห้อ"
        string model "รุ่น"
        string serial "หมายเลขซีเรียล"
        string asset_no "เลขครุภัณฑ์"
        string status "สถานะครุภัณฑ์"
        string owner "ชื่อผู้รับผิดชอบ"
        string org "หน่วยงานหลัก"
        string suborg "หน่วยงานย่อย"
        string os_cpu_ram_disk_ip "คุณลักษณะทางเทคนิค"
        date survey_at "วันที่สำรวจ"
        string inspector "ผู้ตรวจสอบ"
        string inspection_status "สถานะตรวจสอบ"
    }
    INCIDENT {
        string ticket_id PK "เลขที่แจ้งปัญหา"
        datetime reported_at "วันที่และเวลาที่แจ้ง"
        string reporter "ผู้แจ้งปัญหา"
        string asset_no "เลขครุภัณฑ์"
        string detail "รายละเอียดคำขอ / อาการเสีย"
        string priority "ระดับความเร่งด่วน"
        string channel "ช่องทางรับแจ้ง"
        string assignee "ผู้ดำเนินการ"
        string status "สถานะการแจ้งซ่อม"
        string org_unit_id FK "OrgUnitID"
    }
    INCIDENT_META {
        string ticket_id PK
        string asset_id FK
        string assigned_to
        string confirmed_by
        datetime closed_at
        number reopen_count
    }
    INCIDENT_EVENTS {
        string event_id PK
        string ticket_id FK
        string from_status
        string to_status
        string actor_id
        datetime event_at
        string note
    }
    INCIDENT_FILES {
        string file_id PK
        string ticket_id FK
        string drive_file_id
        string file_name
        string mime_type
        string kind
    }
    TICKET_SERVICE_REPORT {
        string ticket_id PK
        string outcome
        string sent_device
        string replacement_device
    }
    SOFTWARE_LICENSES {
        string license_id PK
        string software_name
        string license_key
        date expire_date
    }
    LINE_INBOX {
        string message_id PK
        string group_id
        string user_id
        string text
        string status
    }
    LINE_INBOX_REVIEWS {
        string review_id PK
        string message_id FK
        string ticket_id FK
        string decision
    }
    PM_PLANNINGS {
        string planning_id PK
        string fiscal_year
        string title
        string status
    }
    PM_PLANS {
        string plan_id PK
        string planning_id FK
        date scheduled_date
        string state
    }
```

---

## 3. System Workflows — ผังกระบวนการทำงานของระบบ

### 3.1 การยืนยันตัวตนและการตรวจสอบสิทธิ์ (Authentication & RBAC Session Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as ผู้ใช้งาน
    participant Client as Web App SPA (UI_Client.html)
    participant API as Backend Engine (Server.js)
    participant Sheet as DBS_ITSD (APP_USERS / APP_SESSIONS)
    participant Cache as CacheService

    User->>Client: กรอก Username และ Password
    Client->>API: login(username, password)
    API->>Sheet: ค้นหาผู้ใช้และตรวจ active / locked_until
    API->>API: คำนวณ SHA-256 + Salt (12,000 รอบ)
    alt รหัสผ่านผิดเกินเกณฑ์ (5 ครั้ง)
        API->>Sheet: อัปเดต failed_count และ locked_until (15-30 นาที)
        API->>Sheet: บันทึก APP_AUDIT_LOG (LOGIN_FAILED)
        API-->>Client: ส่งข้อความแจ้งเตือนบัญชีถูกล็อกชั่วคราว
    else รหัสผ่านถูกต้อง
        API->>API: สร้าง Session Token & Token Hash
        API->>Sheet: บันทึกลง APP_SESSIONS + APP_AUDIT_LOG (LOGIN_SUCCESS)
        API->>Cache: เก็บข้อมูล Session และสิทธิ์จาก APP_ROLE_PERMISSIONS
        API-->>Client: ส่ง Token + Branding + RBAC Matrix กลับเบราว์เซอร์
        Client->>Client: ซ่อนหน้า Login และเปิดหน้าภาพรวมตามสิทธิ์ Role
    end
```

### 3.2 วงจรสถานะใบงานแจ้งซ่อม 6 ขั้นตอน (6-Stage Ticket Lifecycle Workflow)

```mermaid
stateDiagram-v2
    [*] --> แจ้งเรื่อง: ผู้ใช้เปิดใบงาน / แปลงจาก LINE Inbox
    แจ้งเรื่อง --> รับแจ้ง: เจ้าหน้าที่ IT กดรับแจ้ง (Accept Ticket)
    รับแจ้ง --> มอบหมาย: Admin / Manager มอบหมายผู้รับผิดชอบ (Assign)
    มอบหมาย --> กำลังดำเนินการ: ช่างเทคนิคเริ่มซ่อมแซมและบันทึกผล
    กำลังดำเนินการ --> รอยืนยันผล: ซ่อมเสร็จ + แนบใบงาน/หลักฐาน (Work Order PDF)
    รอยืนยันผล --> ปิดงาน: ผู้แจ้งซ่อม / Admin ยืนยันผลและปิดงานสมบูรณ์
    ปิดงาน --> [*]
```

```mermaid
flowchart LR
    A["1. แจ้งเรื่อง"] -->|"acceptTicket()"| B["2. รับแจ้ง"]
    B -->|"assignTicket / changeStatus()"| C["3. มอบหมาย"]
    C -->|"updateTicketStatus()"| D["4. กำลังดำเนินการ"]
    D -->|"แนบรูป + พิมพ์/อัปโหลดใบงาน Service Report"| E["5. รอยืนยันผล"]
    E -->|"ผู้แจ้ง/Admin ตรวจรับ"| F["6. ปิดงาน"]
```

### 3.3 การจัดการทะเบียนครุภัณฑ์แบบแยกแท็บ 4 ส่วน (Modular 4-Tab Equipment Workflow)

```mermaid
flowchart TD
    Select["เลือกอุปกรณ์จากตาราง INVENTORY"] --> Drawer["เปิดลิ้นชักรายละเอียดอุปกรณ์ (4 แท็บเรียงตามมาตรฐาน)"]
    Drawer --> T1["แท็บ 1: ข้อมูลทั่วไป (General Info)"]
    Drawer --> T2["แท็บ 2: คุณลักษณะ (Technical Specs)"]
    Drawer --> T3["แท็บ 3: การสำรวจ (Survey / Inspection)"]
    Drawer --> T4["แท็บ 4: ประวัติแจ้งซ่อม (Repair History)"]

    T1 -->|"กด 'แก้ไขข้อมูลทั่วไป'"| M1["Modal แก้ไขข้อมูลพื้นฐาน / หน่วยงาน / ที่ตั้ง"]
    M1 -->|"saveInventory (details_only: true)"| S1["อัปเดต INVENTORY โดยคงค่าคุณลักษณะเดิมไว้ครบ"]

    T2 -->|"กด 'แก้ไขคุณลักษณะ'"| M2["Modal แก้ไข OS, CPU Brand, Speed, RAM, Disk, IP"]
    M2 -->|"saveInventory (specs_only: true -> saveInventorySpecs_)"| S2["บันทึกเฉพาะสเปกเทคนิค ไม่กระทบข้อมูลทั่วไป"]

    T3 -->|"กด 'แก้ไขข้อมูลการสำรวจ'"| M3["Modal วันที่สำรวจ / ผู้ตรวจสอบ / สวิตช์สถานะ"]
    M3 -->|"saveInventory (survey_only: true)"| S3["อัปเดตสถานะการสำรวจและรายงานสรุป"]

    T4 -->|"Read-only Timeline"| H1["แสดงลิงก์ไปยัง Ticket ที่เคยซ่อมอุปกรณ์ชิ้นนี้"]
```

### 3.4 กระบวนการรับแจ้งซ่อมผ่าน LINE Messaging API (LINE Inbox Review Workflow)

```mermaid
flowchart LR
    LINE["ผู้ใช้งานส่งข้อความ/รูปในกลุ่ม LINE"] -->|"Webhook POST + HMAC"| EP["Entrypoints.js doPost()"]
    EP -->|"ตรวจ Signature & ALLOWED_GROUP_IDS"| INBOX["บันทึกลงชีต LINE_INBOX"]
    INBOX -->|"เจ้าหน้าที่ตรวจสอบ"| REV["เมนู LINE Inbox Review"]
    REV -->|"อนุมัติ (itsdLineApproveInbox)"| TCK["สร้างใบงานใหม่ใน INCIDENT + บันทึก LINE_INBOX_REVIEWS"]
    REV -->|"จับคู่งานเดิม (itsdLineBridgeConfirmExisting)"| LINK["ผูกกับใบงานที่มีอยู่แล้ว"]
    REV -->|"ปฏิเสธ/ไม่เข้าเกณฑ์ (itsdLineRejectInbox)"| REJ["อัปเดตสถานะปฏิเสธใน LINE_INBOX_REVIEWS"]
```

### 3.5 กระบวนการตั้งค่าชื่อโครงการ Branding และ Google Drive โดย ADMIN

```mermaid
flowchart TD
    Admin["ผู้ดูแลระบบ (ADMIN) เข้าเมนู ตั้งค่าระบบ"] --> Tab["แท็บ ตั้งค่าทั่วไป & Branding / ไอคอนระบบ"]
    Tab --> Edit["แก้ไข ชื่อโครงการ (project_name) / ชื่อย่อ (short_name) / คำอธิบาย / โฟลเดอร์ Drive"]
    Edit --> Save["คลิก บันทึกการตั้งค่า หรือ บันทึก Branding"]
    Save --> Validate["Server.js ตรวจสอบสิทธิ์ ADMIN + admin44ValidateFolderStructure_()"]
    Validate --> Write["บันทึกลงชีต APP_SETTINGS ใน DBS_ITSD + บันทึก APP_AUDIT_LOG"]
    Write --> Apply["Client เรียก applySystemBranding() อัปเดต Header, Sidebar, Login และ Title ทันที"]
```

---
<div align="center">
  <sub>ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที) — Version V1.1.88 | Create by : LongZe Design © 2026</sub>
</div>
