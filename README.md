# IT Service Desk : ระบบแจ้งซ่อม บริหารจัดการงานครุภัณฑ์

Google Apps Script Web App สำหรับรับแจ้งและติดตามงานบริการไอที จัดการครุภัณฑ์ สำรวจอุปกรณ์ วางแผนบำรุงรักษา จัดการสิทธิ์ ออกรายงาน สำรองข้อมูล และรับรายการจาก LINE Gateway โดยใช้ Google Sheets เป็นฐานข้อมูลหลัก

## Production ที่ยืนยันแล้ว

| รายการ | ค่า |
|---|---|
| Local checkout | `/Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026` |
| Google Drive folder | [เปิดโฟลเดอร์โครงการ](https://drive.google.com/drive/folders/13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe) |
| Database / INVENTORY | [เปิด Google Sheets](https://docs.google.com/spreadsheets/d/1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c/edit?gid=1859184703#gid=1859184703) |
| Software License Database | [เปิด SOFTWARE_LICENSES](https://docs.google.com/spreadsheets/d/1ZiBugthGA-lD8KTAqntK6ckboTLlqoU61X-FpBdEIL4/edit?gid=1597152238#gid=1597152238) |
| Apps Script source | [เปิด Apps Script editor](https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit) |
| Production Web App | [เปิด Web App](https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec) |
| GitHub | [thakot-cloud/ITServiceDesk](https://github.com/thakot-cloud/ITServiceDesk) |

ก่อน `clasp pull`, `clasp push` หรือ deploy ต้องตรวจว่า `.clasp.json` ใช้ Script ID ข้างต้น และ `SPREADSHEET_ID` ใน Script Properties ใช้ Database ID ข้างต้นเสมอ

## ความสามารถหลัก

- Ticket workflow: แจ้งเรื่อง → รับแจ้ง → มอบหมาย → กำลังดำเนินการ → รอยืนยันผล → ปิดงาน
- ประวัติสถานะ ผู้รับผิดชอบ ไฟล์แนบ และรายงานผลการให้บริการ
- ทะเบียนครุภัณฑ์ คุณลักษณะทางเทคนิค สถานที่ การสำรวจ และประวัติแจ้งซ่อม
- License สำหรับติดตั้งใหม่: แสดงเฉพาะ `ADMIN`/`MANAGER`, จับคู่ Serial แบบตรงกัน เปิดดูค่าจริงหลังยืนยันรหัสผ่าน และบันทึก Audit Log
- Dashboard รายงานบริการ รายงานสำรวจ และ export ตามสิทธิ์
- ผู้ใช้ Role สิทธิ์ระดับ module/action และ audit log
- LINE Inbox พร้อมขั้นตอนตรวจสอบก่อนสร้าง ticket
- แผน PM ปฏิทิน และวันหยุด
- สำรองฐานข้อมูลและการตั้งค่า branding/โฟลเดอร์ระบบ

## โครงสร้าง source

| ไฟล์ | หน้าที่ |
|---|---|
| `Server.js` | business logic, repository, validation, security และ service ฝั่ง Apps Script |
| `Api.js` | public compatibility facade ที่ browser/maintenance เรียกใช้ |
| `Entrypoints.js` | `doGet`/`doPost` และ entry points |
| `Index.html` | Web App shell |
| `UI_Client.html` | browser controllers และ client-side behavior |
| `UI_Styles.html` | styles และ design tokens |
| `UI_Templates.html` | reusable templates |
| `appsscript.json` | runtime, scopes และ Web App configuration |

ไฟล์ที่ pull มาชุดนี้เป็น generated Apps Script bundle และไม่มี module/build tree ต้นทางอยู่ใน repository นี้ จึงต้องแก้ bundle อย่างระมัดระวังและตรวจ syntax ทุกครั้ง

## เอกสาร

- [คู่มือการติดตั้งและเผยแพร่](INSTALLATION_TH.md)
- [คู่มือการใช้งาน](USER_GUIDE_TH.md)
- [Data Diagram และ Data Dictionary](DATA_DIAGRAM.md)
- [Workflow ของระบบและ Release](WORKFLOW.md)
- [แม่แบบสี Clay and Sea](COLOR_TEMPLATE.md)

## ตรวจ source แบบรวดเร็ว

```bash
cd /Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026
git status --short --branch
git diff --check
node --check Server.js
node --check Api.js
node --check Entrypoints.js
clasp list-deployments
```

JavaScript ภายใน `UI_Client.html` ต้องแยกส่วน `<script>` ไปตรวจด้วย `node --check` ก่อน release

## หลักความปลอดภัย

- ห้าม commit password, session token, HMAC key, LINE secret หรือ Script Properties
- ฐาน `SOFTWARE_LICENSES` ต้องปิด Public sharing ให้ Script owner/deployer เข้าถึงได้เท่านั้น และกำหนด `SOFTWARE_LICENSE_SPREADSHEET_ID` ใน Script Properties
- ห้ามแก้/ลบ/เปลี่ยนเลข ticket และข้อมูลประวัติ production โดยไม่มีแผนสำรองและอนุมัติ
- ใช้สิทธิ์เท่าที่จำเป็น; maintenance entry point ต้องใช้ ADMIN token
- จำกัด import ต่อคำขอ และตรวจ header/data validation ก่อนเขียนข้อมูล
- คง deployment ID เดิมเมื่อ release เพื่อรักษา Production `/exec` URL

ดูขั้นตอนสำรอง ตรวจสอบ push และ rollback แบบเต็มใน [INSTALLATION_TH.md](INSTALLATION_TH.md)
