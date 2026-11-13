# 🛠️ คู่มือการติดตั้งและตั้งค่าระบบฉบับสมบูรณ์ (Installation Guide)
### ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)
**Version: ITSD V1.1.88 | Developer: Create by : LongZe Design**

คู่มือนี้จัดทำขึ้นเพื่อให้ผู้ดูแลระบบ (System Administrator) และนักพัฒนา สามารถติดตั้ง เชื่อมต่อ Google Drive, Google Sheets, Google Apps Script, GitHub และ Deploy ระบบขึ้นใช้งานจริงได้อย่างถูกต้อง 100%

---

## 📋 สารบัญ
1. [โครงสร้างทรัพยากรหลักของโครงการ (Project Bindings)](#1-โครงสร้างทรัพยากรหลักของโครงการ-project-bindings)
2. [โครงสร้างโฟลเดอร์ Google Drive ที่ต้องใช้](#2-โครงสร้างโฟลเดอร์-google-drive-ที่ต้องใช้)
3. [วิธีที่ 1: การติดตั้งและ Deploy ผ่าน Clasp CLI (แนะนำ)](#3-วิธีที่-1-การติดตั้งและ-deploy-ผ่าน-clasp-cli-แนะนำ)
4. [วิธีที่ 2: การติดตั้งผ่าน Google Apps Script Editor บนเบราว์เซอร์](#4-วิธีที่-2-การติดตั้งผ่าน-google-apps-script-editor-บนเบราว์เซอร์)
5. [การตั้งค่า Script Properties และการผูกฐานข้อมูล (Database Binding)](#5-การตั้งค่า-script-properties-และการผูกฐานข้อมูล-database-binding)
6. [การ Deploy เป็น Web App Production](#6-การ-deploy-เป็น-web-app-production)
7. [การตั้งค่าชื่อโครงการ โฟลเดอร์ Drive และ Branding หลังติดตั้ง (Admin Settings)](#7-การตั้งค่าชื่อโครงการ-โฟลเดอร์-drive-และ-branding-หลังติดตั้ง-admin-settings)
8. [การเชื่อมต่อ LINE Official Account Webhook (Optional)](#8-การเชื่อมต่อ-line-official-account-webhook-optional)
9. [การตรวจสอบและแก้ไขปัญหาที่พบบ่อย (Troubleshooting)](#9-การตรวจสอบและแก้ไขปัญหาที่พบบ่อย-troubleshooting)

---

## 1. โครงสร้างทรัพยากรหลักของโครงการ (Project Bindings)

| รายการ | ชื่อทรัพยากร | ID / URL หลักของโครงการ |
| :--- | :--- | :--- |
| **GitHub Repository** | `thakot-cloud/ITServiceDesk` | `https://github.com/thakot-cloud/ITServiceDesk` |
| **Upstream Repository** | `longzedesign-dotcom/ITServiceDesk` | `https://github.com/longzedesign-dotcom/ITServiceDesk` |
| **Local Workspace** | `SERVER_2026` | `/Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026` |
| **Google Drive Root** | `ITSD` | ID: `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`<br>`https://drive.google.com/drive/folders/13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe` |
| **Google Sheets (26 ตาราง)** | `ITServiceDesk — DBS` | ID: `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c`<br>`https://docs.google.com/spreadsheets/d/1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c/edit` |
| **Software License Workbook** | `License / Full_Data` | ID: `1ZiBugthGA-lD8KTAqntK6ckboTLlqoU61X-FpBdEIL4`<br>`https://docs.google.com/spreadsheets/d/1ZiBugthGA-lD8KTAqntK6ckboTLlqoU61X-FpBdEIL4/edit` |
| **Google Apps Script** | `ITSD_CLASP_STAGING` | Script ID: `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7`<br>`https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit` |
| **Web App Production URL** | `ITSD Web App` | `https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec` |
| **Deployment ID (คงที่)** | Production Exec ID | `AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps` |

---

## 2. โครงสร้างโฟลเดอร์ Google Drive ที่ต้องใช้

ระบบต้องการโครงสร้างโฟลเดอร์ย่อย 4 โฟลเดอร์ที่อยู่ **ภายใต้ Google Drive Root Folder (`ITSD` — `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`) โดยตรง** เพื่อให้เมนู **ตั้งค่าระบบ (Settings)** ตรวจสอบผ่าน `admin44ValidateFolderStructure_()` ได้อย่างสมบูรณ์:

| Key ใน `APP_SETTINGS` | ชื่อโฟลเดอร์บน Google Drive | หน้าที่ |
| :--- | :--- | :--- |
| `service_folder_id` | `ITSD` (Root Folder) | โฟลเดอร์แม่หลักของโครงการ (`13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`) |
| `backup_folder_id` | `Backup Files` | เก็บไฟล์สำรองฐานข้อมูล `ITServiceDesk — DBS` |
| `documents_folder_id` | `Documents` | เก็บเอกสารแนบ/PDF ใบงาน |
| `pictures_folder_id` | `Pictures` | เก็บภาพถ่ายอาการเสีย ผลการซ่อม และภาพโปรไฟล์ผู้ใช้ |
| `system_assets_folder_id` | `System Assets` | เก็บไอคอนระบบและไฟล์ Branding |

> [!TIP]
> หากติดตั้งบนสภาพแวดล้อมใหม่ ระบบสามารถกดสร้างหรือเชื่อมโฟลเดอร์ทั้ง 4 ภายใต้ Root Folder และบันทึกค่าลงในชีต `APP_SETTINGS` ได้โดยตรงผ่านหน้าจอตั้งค่าระบบ

---

## 3. วิธีที่ 1: การติดตั้งและ Deploy ผ่าน Clasp CLI (แนะนำ)

### ขั้นตอนที่ 3.1: ตรวจสอบ Workspace และ Local Directory
```bash
cd /Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026
git status --short --branch
```

### ขั้นตอนที่ 3.2: ติดตั้งและเข้าสู่ระบบ Clasp CLI
```bash
npm install -g @google/clasp
clasp -v
clasp login
```

### ขั้นตอนที่ 3.3: ตรวจสอบไฟล์ `.clasp.json`
ตรวจสอบให้แน่ใจว่าไฟล์ `.clasp.json` ที่ Root Directory ชี้ไปยัง `scriptId` ที่ถูกต้อง:
```json
{
  "scriptId": "1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7",
  "rootDir": "",
  "scriptExtensions": [".js", ".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"]
}
```

### ขั้นตอนที่ 3.4: ตรวจสอบ/ดึงโค้ดจาก Server (`clasp pull`) และอัปโหลด (`clasp push`)
- **ดึงข้อมูลจาก Apps Script มาตรวจสอบที่ Local**:
  ```bash
  clasp pull
  ```
- **Push โค้ดขึ้น Google Apps Script**:
  ```bash
  clasp push --force
  ```

### ขั้นตอนที่ 3.5: สร้าง Version และ Deploy อัปเดต Web App
```bash
clasp version "ITSD V1.1.88 - User Profile Photo, Rounded Admin UI, 16-Col CM Report"
clasp deploy -i AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps -V <VERSION_NUMBER> -d "ITSD V1.1.88 Production Release"
```

---

## 4. วิธีที่ 2: การติดตั้งผ่าน Google Apps Script Editor บนเบราว์เซอร์

1. เปิดโครงการ Apps Script:  
   https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit
2. ไปที่ **การตั้งค่าโครงการ (Project Settings)** ⚙️ แล้วเปิดใช้งาน **"แสดงไฟล์ Manifest 'appsscript.json' ในตัวแก้ไข"**
3. อัปเดตไฟล์ในตัวแก้ไขให้ตรงกับไฟล์หลักทั้ง **8 ไฟล์**:
   - `appsscript.json` (Manifest: Timezone `Asia/Bangkok`, `V8`, OAuth Scopes)
   - `Entrypoints.js` (`doGet`, `doPost`)
   - `Api.js` (Public RPC Facade)
   - `Server.js` (Core Runtime Engine)
   - `Index.html` (HTML Shell)
   - `UI_Client.html` (Client Controllers)
   - `UI_Styles.html` (Styles & Theme Palettes)
   - `UI_Templates.html` (HTML Templates)
4. กด **บันทึก (Save)** 💾

---

## 5. การตั้งค่า Script Properties และการผูกฐานข้อมูล (Database Binding)

1. ใน Google Apps Script Editor ไปที่ **Project Settings (⚙️)** ➔ **Script Properties**
2. ตรวจสอบหรือเพิ่ม Property หลักดังนี้:
   - `SPREADSHEET_ID` = `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c`
   - `SOFTWARE_LICENSE_SPREADSHEET_ID` = `1ZiBugthGA-lD8KTAqntK6ckboTLlqoU61X-FpBdEIL4`
   - `ITSD_TIMEZONE` = `Asia/Bangkok`
   *(หากไม่ได้กำหนด `SPREADSHEET_ID` ใน Script Properties โค้ดใน `Server.js` มีค่า Fallback ชี้ไปยัง `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` ให้อัตโนมัติ)*
3. กรณีติดตั้งฐานข้อมูลชุดใหม่ตั้งแต่ต้น สามารถกำหนด Script Properties เพิ่ม (`ITSD_PROJECT_ID`, `ITSD_ENVIRONMENT`, `ITSD_SETUP_PROJECT_NAME`, `ITSD_SETUP_ADMIN_USERNAME`, `ITSD_SETUP_ADMIN_NAME`, `ITSD_SETUP_ADMIN_PASSWORD`) แล้วสั่งรันฟังก์ชัน **`project70Bootstrap_()`** จาก Apps Script Editor และอนุญาตสิทธิ์ (Review Permissions) ให้บัญชีเจ้าของโครงการ

---

## 6. การ Deploy เป็น Web App Production

1. ใน Apps Script Editor มุมบนขวา คลิก **Deploy (ทำให้ใช้งานได้)** ➔ **Manage deployments (จัดการการทำให้ใช้งานได้)**
2. กดแก้ไข (รูปดินสอ) บน Deployment ปัจจุบัน หรือสร้าง **New deployment** ประเภท **Web app**
3. ตั้งค่าสิทธิ์การรัน:
   - **Execute as (เรียกใช้ในฐานะ)**: `Me` (บัญชีเจ้าของสคริปต์และโฟลเดอร์ Drive)
   - **Who has access (ผู้ที่มีสิทธิ์เข้าถึง)**: `Anyone` (ทุกคน)
4. กด **Deploy** และเข้าทดสอบผ่าน URL:  
   👉 `https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec`

---

## 7. การตั้งค่าชื่อโครงการ โฟลเดอร์ Drive และ Branding หลังติดตั้ง (Admin Settings)

ผู้ดูแลระบบ (`ADMIN`) สามารถเปลี่ยนชื่อโครงการและปรับตั้งค่าต่าง ๆ เองได้โดยไม่ต้องแก้ไขโค้ด:
1. เข้าสู่ระบบด้วยบัญชีสิทธิ์ `ADMIN`
2. ไปที่เมนู **ตั้งค่าระบบ (Settings)** ➔ แท็บ **ตั้งค่าทั่วไป**
3. ปรับแก้ค่าที่ต้องการ:
   - **ชื่อโครงการ / ชื่อระบบ** (`project_name`): แสดงในหน้าเข้าสู่ระบบ, รายงาน และชื่อไฟล์ Backup
   - **ชื่อย่อ** (`system_short_name`) และ **คำอธิบาย** (`system_description`): แสดงใน Sidebar, Breadcrumb และ Title ของเบราว์เซอร์
   - **Google Drive Folders**: ระบุ Folder ID ของ `Pictures`, `Documents`, `Backup Files`, `System Assets`
4. กด **บันทึกการตั้งค่า** หรือ **บันทึก Branding** ระบบจะอัปเดตลงชีต `APP_SETTINGS` และเปลี่ยนหน้าจอทันที

---

## 8. การเชื่อมต่อ LINE Official Account Webhook (Optional)

1. นำ URL Web App (`/exec`) หรือ Cloudflare Worker Gateway ไปตั้งค่าใน LINE Developers Console เป็น Webhook URL
2. ในหน้า Web App เมนู **ตั้งค่าระบบ** ➔ แท็บ **การเชื่อมต่อ LINE** ตรวจสอบสถานะการเชื่อมต่อ, `LINE_INBOX_SHEET_ID` และ `ALLOWED_GROUP_IDS`
3. เมื่อมีข้อความส่งเข้ามา ระบบจะบันทึกเข้าสู่ชีต `LINE_INBOX` เพื่อรอเจ้าหน้าที่ตรวจรับในเมนู **LINE Inbox Review**

---

## 9. การตรวจสอบและแก้ไขปัญหาที่พบบ่อย (Troubleshooting)

| อาการที่พบ | สาเหตุที่เป็นไปได้ | วิธีแก้ไข |
| :--- | :--- | :--- |
| **บันทึกการตั้งค่าแล้วแจ้ง "ไม่สามารถเข้าถึง Google Drive ... Folder"** | Folder ID ใน `APP_SETTINGS` ชี้ไปโฟลเดอร์เก่าที่ถูกลบหรือไม่มีสิทธิ์ | ตรวจสอบ ID โฟลเดอร์ใน `APP_SETTINGS` ให้ตรงกับโฟลเดอร์ภายใต้ `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe` และแชร์สิทธิ์ให้บัญชีเจ้าของ Script |
| **เปิด Web App แล้วไม่เห็นเวอร์ชันใหม่** | เบราว์เซอร์แคชหน้าเก่า หรือเปิดลิงก์ Deployment เก่า | กด Hard Refresh (`Cmd+Shift+R` / `Ctrl+F5`) หรือเปิดในหน้าต่าง Incognito |
| **เปิดลิงก์แล้วขึ้นหน้า Error Google "Sorry, unable to open the file at this time"** | ล็อกอิน Google หลายบัญชีพร้อมกันบนเบราว์เซอร์ เช่น บัญชีที่มีสิทธิ์ถูกสลับเป็น `/u/1/` | แนะนำให้เปิดด้วย Profile Google ที่เป็นเจ้าของ หรือเปิดในโหมด **Incognito (ไม่ระบุตัวตน)** |
| **ล็อกอินไม่สำเร็จทั้งที่รหัสถูก** | บัญชีถูกปิด `active=false` หรือติด Lockout ชั่วคราว | ตรวจชีต `APP_USERS` หรือให้ ADMIN รีเซ็ตรหัสผ่านใหม่ (อย่างน้อย 12 ตัวอักษร) |
| **Push GitHub ไม่ผ่านจาก Terminal** | Git Credential ของ macOS Keychain หรือสิทธิ์ Sandbox | ตรวจสอบด้วย `git ls-remote origin HEAD` และยืนยันบัญชี GitHub ใน Keychain |

---
<div align="center">
  <sub>ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที) — Version V1.1.88 | Create by : LongZe Design © 2026</sub>
</div>
