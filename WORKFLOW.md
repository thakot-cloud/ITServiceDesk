# Workflow ของ IT Service Desk

## 1. Ticket lifecycle

```mermaid
flowchart LR
  A[แจ้งเรื่อง] --> B[รับแจ้ง]
  B --> C[มอบหมาย]
  C --> D[กำลังดำเนินการ]
  D --> E[รอยืนยันผล]
  E --> F[ปิดงาน]
```

ทุก transition ตรวจ session, permission และสถานะปัจจุบันฝั่ง server แล้วบันทึก `INCIDENT`, `INCIDENT_META` และ `INCIDENT_EVENTS` ตามหน้าที่ ก่อนรอยืนยันผล/ปิดงานต้องมีรายละเอียดการแก้ไข

```mermaid
sequenceDiagram
  actor U as ผู้แจ้ง
  participant W as Web App
  participant S as Apps Script
  participant DB as Google Sheets
  participant D as Google Drive
  U->>W: กรอกรายละเอียด/แนบไฟล์
  W->>S: createTicket(token, data)
  S->>S: validate + authorize + lock
  S->>DB: สร้าง INCIDENT/META/EVENT
  opt มีไฟล์แนบ
    S->>D: บันทึกไฟล์
    S->>DB: บันทึก INCIDENT_FILES
  end
  S-->>W: ticket ID และผลสำเร็จ
```

## 2. ครุภัณฑ์และการสำรวจ

```mermaid
flowchart TD
  A[ค้นหาด้วย Asset/Serial/รหัส] --> B{พบรายการ?}
  B -- ไม่พบ --> C[ตรวจ master ประเภท/ยี่ห้อ/รุ่น]
  C --> D[สร้างอุปกรณ์ใหม่ตามสิทธิ์]
  B -- พบ --> E[เปิดรายละเอียด]
  D --> E
  E --> F[แก้ข้อมูลทั่วไป]
  E --> G[แก้คุณลักษณะ]
  E --> H[บันทึกการสำรวจ]
  E --> I[ดูประวัติแจ้งซ่อม]
  F --> J[Validate + save + audit]
  G --> J
  H --> J
```

ข้อมูลทั่วไป คุณลักษณะ การสำรวจ และประวัติแจ้งซ่อมแยกแท็บ/ขอบเขตการบันทึก เพื่อลดการเขียนทับข้อมูลที่ไม่ได้แก้

## 3. LINE Inbox

```mermaid
flowchart LR
  A[LINE Gateway] -->|signed envelope| B[doPost / ingress]
  B --> C{ตรวจ protocol, size, timestamp, HMAC}
  C -- ไม่ผ่าน --> D[Reject + log]
  C -- ผ่าน --> E[LINE_INBOX: PENDING_REVIEW]
  E --> F[เจ้าหน้าที่ Claim]
  F --> G[แก้/ตรวจข้อมูล Review]
  G --> H{ตัดสินใจ}
  H -- Reject --> I[REJECTED + เหตุผล]
  H -- Approve --> J[สร้าง INCIDENT]
  J --> K[CREATED + ticket_id]
  J -- ล้มเหลว --> L[FAILED + audit]
```

## 4. Permission flow

```mermaid
flowchart TD
  A[Request พร้อม session token] --> B[Hash token และอ่าน APP_SESSIONS]
  B --> C{active และไม่หมดอายุ?}
  C -- ไม่ --> D[ปฏิเสธ]
  C -- ใช่ --> E[อ่าน APP_USERS / Role]
  E --> F[ตรวจ module + action + scope]
  F -- ไม่ผ่าน --> D
  F -- ผ่าน --> G[Validate input]
  G --> H[Lock/Mutation]
  H --> I[Audit log]
  I --> J[Response แบบ public-safe]
```

UI ใช้ permission เพื่อซ่อน/แสดง controls แต่ server permission เป็นแหล่งตัดสินสิทธิ์จริง

## 5. Development และ Release

```mermaid
flowchart LR
  A[ยืนยัน Local/Git/Script/DB/Deployment] --> B[สำรอง source]
  B --> C[clasp pull]
  C --> D[Commit checkpoint]
  D --> E[แก้ source + patch version]
  E --> F[Syntax/security/secret checks]
  F --> G[Commit แบบ atomic]
  G --> H[Fetch และ push GitHub main]
  H --> I{ได้รับอนุมัติ deploy?}
  I -- ยัง --> J[หยุดที่ source พร้อมรายงาน]
  I -- ได้รับ --> K[clasp push]
  K --> L[สร้าง Apps Script version]
  L --> M[อัปเดต deployment ID เดิม]
  M --> N[HTTP + functional + log verification]
  N --> O[บันทึก release/rollback point]
```

กฎสำคัญ:

- `clasp pull` สำรอง source ก่อนเสมอ
- GitHub และ Apps Script เป็นคนละขั้นตอน; push GitHub ไม่ได้เปลี่ยน Production Web App
- ห้ามสร้าง deployment ใหม่เมื่อเป้าหมายคือรักษา `/exec` URL เดิม
- หาก validation ไม่ผ่าน ห้าม push/deploy
- Rollback source ด้วย commit ใหม่ และ rollback runtime ด้วย version ที่ deployment ID เดิม
