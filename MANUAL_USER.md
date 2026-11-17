# 📖 คู่มือการใช้งานระบบฉบับสมบูรณ์ (User Manual)
### ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)
**Enterprise Edition — Version ITSD V1.1.59 (Theme: Clay and Sea)**  
**Create by : LongZe Design**

---

## 📑 สารบัญ
1. [ภาพรวมและลิงก์เข้าใช้งานระบบ (Overview)](#1-ภาพรวมและลิงก์เข้าใช้งานระบบ-overview)
2. [การเข้าสู่ระบบและความปลอดภัยบัญชี (Authentication & Accounts)](#2-การเข้าสู่ระบบและความปลอดภัยบัญชี-authentication--accounts)
3. [คู่มือสำหรับผู้ใช้งานทั่วไป (General User)](#3-คู่มือสำหรับผู้ใช้งานทั่วไป-general-user)
4. [คู่มือสำหรับช่างเทคนิคและเจ้าหน้าที่ IT (Technician & Support)](#4-คู่มือสำหรับช่างเทคนิคและเจ้าหน้าที่-it-technician--support)
5. [คู่มือสำหรับผู้บริหารและผู้ดูแลระบบ (Manager & Administrator)](#5-คู่มือสำหรับผู้บริหารและผู้ดูแลระบบ-manager--administrator)
   - [5.1 การบริหารจัดการบัญชีผู้ใช้งานและสิทธิ์ (Users & RBAC Permissions)](#51-การบริหารจัดการบัญชีผู้ใช้งานและสิทธิ์-users--rbac-permissions)
   - [5.2 ทะเบียนครุภัณฑ์และการแก้ไขแยก 4 แท็บอิสระ (Modular Equipment Management)](#52-ทะเบียนครุภัณฑ์และการแก้ไขแยก-4-แท็บอิสระ-modular-equipment-management)
   - [5.3 ระบบแผนบำรุงรักษาเชิงป้องกัน (Preventive Maintenance - PM)](#53-ระบบแผนบำรุงรักษาเชิงป้องกัน-preventive-maintenance---pm)
   - [5.4 ระบบจัดการข้อความแจ้งซ่อมจาก LINE (LINE Inbox Review)](#54-ระบบจัดการข้อความแจ้งซ่อมจาก-line-line-inbox-review)
   - [5.5 แดชบอร์ดสถิติ KPI และการส่งออกรายงาน (Dashboard & Exports)](#55-แดชบอร์ดสถิติ-kpi-และการส่งออกรายงาน-dashboard--exports)
   - [5.6 การตั้งค่าระบบ แก้ไขชื่อโครงการ Branding และ Google Drive โดย ADMIN](#56-การตั้งค่าระบบ-แก้ไขชื่อโครงการ-branding-และ-google-drive-โดย-admin)
6. [สรุปตารางฐานข้อมูล Google Sheets (`ITServiceDesk — DBS` — 26 ตาราง)](#6-สรุปตารางฐานข้อมูล-google-sheets-itservicedesk--dbs--26-ตาราง)
7. [คำถามที่พบบ่อย (FAQ)](#7-คำถามที่พบบ่อย-faq)

---

## 1. ภาพรวมและลิงก์เข้าใช้งานระบบ (Overview)

ระบบ **IT Service Desk : ระบบแจ้งซ่อม บริหารจัดการงานครุภัณฑ์** พัฒนาบน Google Workspace แบบ **100% Serverless**:

### 🔗 ลิงก์ทรัพยากรโครงการหลัก (Official Production Links)
| องค์ประกอบ | ชื่อที่ถูกต้อง (Resource Name) | รหัสอ้างอิง (ID) | ลิงก์เข้าถึงทางการ |
| :--- | :--- | :--- | :--- |
| **GitHub Repository** | `ITServiceDesk` | `thakot-cloud/ITServiceDesk` | https://github.com/thakot-cloud/ITServiceDesk |
| **Google Drive Root** | `005_ITServiceDesk` | `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe` | https://drive.google.com/drive/folders/13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe |
| **Google Sheets Database** | `ITServiceDesk — DBS` | `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` | https://docs.google.com/spreadsheets/d/1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c/edit?usp=drivesdk |
| **Apps Script Project (Edit)** | `ITServiceDesk` | `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7` | https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit |
| **Web App Production (Exec)** | `ITServiceDesk Web App` | `AKfycbxPnpvv...` (`ITSD V1.2.08`) | https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec |

- **Frontend**: Web App SPA รองรับทั้ง Desktop, Tablet และ Mobile พร้อมระบบเปลี่ยน Light/Dark Mode และ 12 ชุดสี (ค่าหลักคือ **Clay and Sea**)
- **Backend**: Google Apps Script V8 พร้อมระบบสิทธิ์ RBAC, เข้ารหัสรหัสผ่าน SHA-256 + Salt และ Audit Log ทุกการเปลี่ยนแปลง
- **Database**: Google Sheets `ITServiceDesk — DBS` (`1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c`) จำนวน 26 ตาราง
- **Storage**: Google Drive โฟลเดอร์หลัก `005_ITServiceDesk` (`13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`) แยกเก็บ Backup, Documents, Pictures และ System Assets

**🌐 URL เข้าใช้งานระบบจริง (Web App Production):**  
👉 [https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec](https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec)

---

## 2. การเข้าสู่ระบบและความปลอดภัยบัญชี (Authentication & Accounts)

### 2.1 หน้าจอเข้าสู่ระบบ (Login)
1. กรอก **ชื่อผู้ใช้ (Username)** และ **รหัสผ่าน (Password)**
2. สามารถกดปุ่ม **รูปตา (👁️ `visibility_off` / `visibility`)** ด้านขวาของช่องรหัสผ่านเพื่อสลับดูหรือซ่อนตัวอักษรได้
3. ด้านล่างบัตร Login แสดงเวอร์ชันระบบปัจจุบัน (`ITSD V1.2.08`) และข้อมูลลิขสิทธิ์ระบบ

### 2.2 บัญชีผู้ใช้ในระบบจริง (System Accounts)
| ลำดับ | Username | บทบาท (Role) | ชื่อแสดง | อีเมลที่ผูกกับบัญชี | ขอบเขตสิทธิ์การใช้งาน |
| :---: | :--- | :---: | :--- | :--- | :--- |
| 1 | **`ADMIN`** | `ADMIN` | ผู้ดูแลระบบ | `c.thakot@gmail.com` | เข้าถึงทุกเมนู จัดการผู้ใช้ ตั้งชื่อโครงการ โฟลเดอร์ Drive สิทธิ์ RBAC และ Backup |
| 2 | **`MANAGER`** | `MANAGER` | ผู้จัดการ | `c.thakot@gmail.com` | ดูภาพรวม Dashboard, มอบหมายงาน, ตรวจสอบรายงาน และวิเคราะห์ข้อมูล |
| 3 | **`TECHNICIAN`** | `TECHNICIAN` | เจ้าหน้าที่ IT | `c.thakot@gmail.com` | รับแจ้ง/ดำเนินการซ่อม CM/PM, อัปเดตสถานะ, บันทึกการซ่อม, พิมพ์ Service Report |
| 4 | **`ITSUPPORT`** | `ITSUPPORT` | ทศพล กาญจนพันธ์ | `thodsaphon@opentechnology.co.th` | ฝ่ายสนับสนุน IT รับเรื่อง, แก้ไขข้อมูลครุภัณฑ์, สำรวจและตรวจเช็คอุปกรณ์ |
| 5 | **`USER001`** | `USER` | ชัยวุฒิ ศรีแก้ว | `chaiwut@opentechnology.co.th` | ผู้ใช้งานทั่วไป เปิดใบแจ้งซ่อม ติดตามสถานะงานของตนเอง |
| 6 | **`USER002`** | `USER` | วินยาดา บึงกระเสริม | `winyada.b@opentechnology.co.th` | ผู้ใช้งานทั่วไป เปิดใบแจ้งซ่อม ติดตามสถานะงานของตนเอง |
| 7 | **`USER003`** | `USER` | วีรภัทร ธนันกา | `weerapat@opentechnology.co.th` | ผู้ใช้งานทั่วไป เปิดใบแจ้งซ่อม ติดตามสถานะงานของตนเอง |

> [!NOTE]
> **นโยบายความปลอดภัยและรหัสผ่าน (Security & Password Policy)**:
> - รหัสผ่านในระบบจริงได้รับการปกป้องด้วยการเข้ารหัสแบบทางเดียว (One-Way Hashing: SHA-256 + Salt เฉพาะผู้ใช้) ตามมาตรฐานความปลอดภัย โดยไม่เปิดเผยรหัสผ่านจริงในเอกสารคู่มือ
> - **การรีเซ็ตรหัสผ่าน**: ผู้ดูแลระบบ (`ADMIN`) สามารถรีเซ็ตรหัสผ่านให้แก่ผู้ใช้ได้ทันทีผ่านเมนู **ตั้งค่าระบบ → จัดการผู้ใช้** (กดปุ่มรูปกุญแจ 🔑) หรือผู้ใช้สามารถกด **"ลืมรหัสผ่าน"** ที่หน้าจอเข้าสู่ระบบ เพื่อขอรับรหัส OTP ยืนยันตัวตนผ่านอีเมล
> - **มาตรฐานรหัสผ่าน**: เป็นไปตามเกณฑ์ NIST SP 800-63B (ความยาวขั้นต่ำ 12–15 ตัวอักษร) และระบบจะทำการล็อกบัญชีชั่วคราวอัตโนมัติหากกรอกรหัสผ่านผิดติดต่อกันเกิน 5 ครั้ง

---

## 3. คู่มือสำหรับผู้ใช้งานทั่วไป (General User)

### 3.1 การเปิดใบงานแจ้งซ่อมใหม่ (แจ้งซ่อม)
1. คลิกเมนู **"แจ้งซ่อม"** บนแถบนำทางด้านซ้าย
2. ค้นหาและเลือกอุปกรณ์ด้วย **เลขครุภัณฑ์** หรือ **หมายเลขซีเรียล** (ระบบจะดึงประเภท ยี่ห้อ รุ่น และหน่วยงานมาแสดงอัตโนมัติ) — หากเป็นอุปกรณ์ที่ไม่มีเลขครุภัณฑ์ สามารถแจ้งแบบไม่มีเลขครุภัณฑ์ได้
3. เลือก **ประเภทปัญหา**, **ระดับความเร่งด่วน** (`ปกติ`, `ต่ำ`, `ปานกลาง`, `สูง`, `วิกฤต`) และกรอก **รายละเอียดอาการเสีย**
4. แนบรูปถ่ายความเสียหาย (ระบบอัปโหลดเก็บลงโฟลเดอร์ `Pictures` บน Google Drive ให้อัตโนมัติ)
5. กดส่งคำขอ ระบบจะสร้างเลขที่ใบงานในตาราง `INCIDENT` และตั้งสถานะเป็น **`แจ้งเรื่อง`**

### 3.2 การติดตามสถานะใบงานแจ้งซ่อม 6 ขั้นตอน
ระบบติดตามสถานะการทำงานแบบต่อเนื่อง 6 สถานะ:
1. **`แจ้งเรื่อง`**: ส่งเรื่องแจ้งซ่อมเข้าสู่ระบบแล้ว
2. **`รับแจ้ง`**: เจ้าหน้าที่รับเรื่องตรวจสอบเบื้องต้นแล้ว
3. **`มอบหมาย`**: มอบหมายช่างผู้รับผิดชอบเรียบร้อยแล้ว
4. **`กำลังดำเนินการ`**: ช่างเทคนิคกำลังซ่อมแซมหรือตรวจสอบ
5. **`รอยืนยันผล`**: ดำเนินการซ่อมเสร็จสิ้น รอผู้แจ้งหรือผู้ดูแลตรวจสอบส่งมอบงาน
6. **`ปิดงาน`**: ตรวจรับและปิดใบงานสมบูรณ์

---

## 4. คู่มือสำหรับช่างเทคนิคและเจ้าหน้าที่ IT (Technician & Support)

### 4.1 การรับงานและอัปเดตสถานะ
1. เข้าเมนู **"รายการแจ้งซ่อม"** ค้นหาหรือกรองตามสถานะ/ความเร่งด่วน
2. คลิกเปิดใบงานในหน้าต่างรายละเอียดด้านข้าง (Drawer)
3. กดปุ่มดำเนินการตามขั้นตอน (`รับแจ้ง` ➔ `มอบหมาย` ➔ `กำลังดำเนินการ` ➔ `รอยืนยันผล` ➔ `ปิดงาน`) พร้อมระบุ **รายละเอียดการดำเนินงาน / วิธีแก้ไข** และแนบหลักฐานรูปภาพหรือไฟล์

### 4.2 การออกใบงานบริการ (Work Order PDF Service Report)
1. สำหรับใบงานที่อยู่ในสถานะ **`รอยืนยันผล`** หรือ **`ปิดงาน`** จะมีปุ่ม **"ข้อมูลใบงาน"** และ **"พิมพ์ใบงาน (PDF)"**
2. กรอกข้อมูลอุปกรณ์ส่งซ่อม / อุปกรณ์ทดแทน และผลลัพธ์งาน (`COMPLETED`, `SENT_FOR_REPAIR`, `LOAN_DEVICE`, `REPLACED`)
3. สั่งพิมพ์เอกสาร Service Report เพื่อใช้ลงนามและแนบกลับเป็นหลักฐานในใบงาน

---

## 5. คู่มือสำหรับผู้บริหารและผู้ดูแลระบบ (Manager & Administrator)

### 5.1 การบริหารจัดการบัญชีผู้ใช้งานและสิทธิ์ (Users & RBAC Permissions)
- **จัดการผู้ใช้งาน**: เพิ่มบัญชีผู้ใช้ใหม่, แก้ไขข้อมูลส่วนตัว/หน่วยงาน, เปิด-ปิดสถานะการใช้งาน และรีเซ็ตรหัสผ่าน
- **กำหนดสิทธิ์การใช้งาน (Permission Matrix)**:
  - กำหนดสิทธิ์ระดับโมดูล (`VIEW`, `CREATE`, `EDIT`, `DELETE`, `EXPORT`, `MANAGE`) ในตาราง `APP_ROLE_PERMISSIONS`
  - กำหนดสิทธิ์ระดับการกระทำ (`Action Matrix`) ในตาราง `APP_ROLE_ACTION_PERMISSIONS`

### 5.2 ทะเบียนครุภัณฑ์และการแก้ไขแยก 4 แท็บอิสระ (Modular Equipment Management)
ในเมนู **"ทะเบียนอุปกรณ์"** เมื่อคลิกเลือกรายการ ระบบจะเปิดลิ้นชักรายละเอียดด้านขวา (Drawer) แยกเป็น **4 แท็บเรียงตามลำดับ** โดยแต่ละแท็บแก้ไขและบันทึกแยกอิสระต่อกัน:

1. **แท็บ `ข้อมูลทั่วไป`**: แสดงรหัสอุปกรณ์, ประเภท, ยี่ห้อ/รุ่น, ซีเรียล, เลขครุภัณฑ์, สถานะ, ผู้รับผิดชอบ, หน่วยงานหลัก/ย่อย, อาคาร, ชั้น, สถานที่ติดตั้ง, ปีงบประมาณ และอุปกรณ์ร่วมเลขครุภัณฑ์
   - กดปุ่ม **`แก้ไขข้อมูลทั่วไป`** ➔ บันทึกเฉพาะข้อมูลทั่วไป (`details_only: true`) **โดยไม่ทำให้สเปกทางเทคนิคสูญหาย**
2. **แท็บ `คุณลักษณะ`**: แสดง `Operating System`, `CPU Brand`, `CPU Speed`, `RAM`, `Harddisk`, `IP Address`
   - กดปุ่ม **`แก้ไขคุณลักษณะ`** ➔ บันทึกเฉพาะสเปกทางเทคนิค (`specs_only: true` ➔ `saveInventorySpecs_`) **ไม่กระทบข้อมูลทั่วไป**
3. **แท็บ `การสำรวจ`**: แสดงวันที่สำรวจ, ผู้ตรวจสอบ และสถานะตรวจสอบ (`สำรวจเรียบร้อย` / `ยังไม่สำรวจ`)
   - กดปุ่ม **`แก้ไขข้อมูลการสำรวจ`** ➔ บันทึกผลการสำรวจแยกส่วน (`survey_only: true`)
4. **แท็บ `ประวัติแจ้งซ่อม`**: แสดงประวัติ Ticket ทั้งหมดของอุปกรณ์ชิ้นนี้ (คลิกเพื่อกระโดดไปยังใบงานได้ทันที)

### 5.3 ระบบแผนบำรุงรักษาเชิงป้องกัน (Preventive Maintenance - PM)
- สร้างแผนแม่บทการตรวจเช็กประจำปีงบประมาณ (ตาราง `PM_PLANNINGS`)
- กำหนดอุปกรณ์/พื้นที่เป้าหมาย (`PM_PLANNING_ITEMS`) และตารางเข้าตรวจตามปฏิทิน (`PM_PLANS`)
- บันทึกผลและประวัติการบำรุงรักษา (`PM_PLAN_HISTORY`) พร้อมส่งออกรายงานสรุปผลเป็น HTML/PDF

### 5.4 ระบบจัดการข้อความแจ้งซ่อมจาก LINE (LINE Inbox Review)
- ข้อความจากกลุ่ม LINE ที่อนุญาตจะเข้ามาในตาราง `LINE_INBOX`
- เจ้าหน้าที่ตรวจรับในเมนู **"LINE Inbox Review"** เพื่อเลือก **สร้างใบงานใหม่**, **ผูกกับใบงานเดิม** หรือ **ปฏิเสธข้อความที่ไม่เกี่ยวข้อง**

### 5.5 แดชบอร์ดสถิติ KPI และการส่งออกรายงาน (Dashboard & Exports)
- **หน้าภาพรวม & ติดตามงาน**: แสดงการ์ดสรุป KPI, สถานะใบงาน, รายการเกินกำหนด (Overdue) และกราฟสถิติ
- **รายงานการสำรวจ & ทะเบียนอุปกรณ์**: ส่งออกข้อมูลเป็น CSV (UTF-8 BOM รองรับภาษาไทยใน Excel) และ HTML/Print Report (A3 Landscape)

### 5.6 การตั้งค่าระบบ แก้ไขชื่อโครงการ Branding และ Google Drive โดย ADMIN
ผู้ดูแลระบบ (`ADMIN`) สามารถเปลี่ยนชื่อโครงการและตั้งค่าการเชื่อมต่อได้เองผ่านหน้าเว็บ:
1. เข้าเมนู **"ตั้งค่าระบบ"** (แท็บ **ตั้งค่าทั่วไป**)
2. ในกล่อง **การตั้งค่าทั่วไป**:
   - แก้ไขช่อง **ชื่อโครงการ / ชื่อระบบ (ADMIN แก้ไขได้)** ตามที่ต้องการ (สูงสุด 120 ตัวอักษร เช่น `ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)`)
   - ตรวจสอบ Folder ID ทั้ง 4 โฟลเดอร์ (`Pictures`, `Documents`, `Backup Files`, `System Assets`) ที่อยู่ภายใต้โฟลเดอร์แม่ `005_ITServiceDesk` (`13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`)
3. ในกล่อง **Branding / ไอคอนระบบ**:
   - แก้ไข **ชื่อย่อ** (แสดงที่ Sidebar Header, Breadcrumb และ Title เบราว์เซอร์)
   - แก้ไข **คำอธิบาย** (แสดงใต้ชื่อระบบในหน้า Login และ Sidebar)
   - อัปโหลด **ไอคอนระบบ** (PNG/JPG อัตราส่วน 1:1 ขั้นต่ำ 250×250 px แนะนำ 512×512 px)
4. คลิกปุ่ม **บันทึกการตั้งค่า** หรือ **บันทึก Branding** ระบบจะอัปเดตลง `APP_SETTINGS` และเปลี่ยนการแสดงผลทั้งระบบให้ทันที
5. ในกล่อง **สำรองข้อมูล**: สามารถกด **"สำรองข้อมูลตอนนี้"** เพื่อสำเนาฐานข้อมูล `ITServiceDesk — DBS` เก็บเข้าโฟลเดอร์ `Backup Files` บน Google Drive ได้ตลอดเวลา

---

## 6. สรุปตารางฐานข้อมูล Google Sheets (`ITServiceDesk — DBS` — 26 ตาราง)

ฐานข้อมูลหลัก ID: `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` ([ดูความสัมพันธ์เชิงลึกใน `DATA_DIAGRAM_AND_WORKFLOW.md`](./DATA_DIAGRAM_AND_WORKFLOW.md))
- **ผู้ใช้และความปลอดภัย (7 ชีต)**: `APP_USERS`, `APP_USER_PROFILE`, `APP_ROLES`, `APP_ROLE_PERMISSIONS`, `APP_ROLE_ACTION_PERMISSIONS`, `APP_SESSIONS`, `APP_AUDIT_LOG`
- **ตั้งค่าและข้อมูลหลัก (8 ชีต)**: `APP_SETTINGS`, `APP_LOOKUPS`, `Branding`, `MST_ORG_UNITS`, `MST_DEVICE_MODELS`, `SOFTWARE_LICENSES`, `INVENTORY`, `INVENTORY_SORTED`
- **งานแจ้งซ่อม (5 ชีต)**: `INCIDENT`, `INCIDENT_META`, `INCIDENT_EVENTS`, `INCIDENT_FILES`, `TICKET_SERVICE_REPORT`
- **แผนบำรุงรักษา PM (4 ชีต)**: `PM_PLANNINGS`, `PM_PLANNING_ITEMS`, `PM_PLANS`, `PM_PLAN_HISTORY`
- **LINE Integration (2 ชีต)**: `LINE_INBOX`, `LINE_INBOX_REVIEWS`

---

## 7. คำถามที่พบบ่อย (FAQ)

- **Q1: เปลี่ยนชื่อโครงการต้องแก้โค้ดไหม?**  
  ไม่ต้องครับ บัญชีสิทธิ์ `ADMIN` สามารถเข้าไปเปลี่ยนในเมนู **ตั้งค่าระบบ ➔ ชื่อโครงการ / ชื่อระบบ** และ **ชื่อย่อ / คำอธิบาย** แล้วกดบันทึกได้ทันที
- **Q2: แก้ไขข้อมูลทั่วไปของอุปกรณ์แล้ว ข้อมูล CPU/RAM จะหายไหม?**  
  ไม่หายครับ ตั้งแต่เวอร์ชัน V1.1.54+ เป็นต้นไป ระบบแยกบันทึกแต่ละแท็บเป็นอิสระ (`details_only`, `specs_only`, `survey_only`)
- **Q3: ภาพถ่ายและไฟล์แนบเก็บไว้ที่ไหน?**  
  จัดเก็บบน Google Drive ภายใต้โฟลเดอร์ `Pictures` (`10b1umrMgj70LRKdw8bFcZzdEZ3r_96mV`) และ `Documents` (`15w-DCPUL09HetfwsVzaWo6-5lxUH3xqZ`) ภายในโฟลเดอร์ `005_ITServiceDesk` (`13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe`)

---
<div align="center">
  <sub>IT Service Desk : ระบบแจ้งซ่อม บริหารจัดการงานครุภัณฑ์ — Version ITSD V1.2.08 | Thakot Cloud © 2026</sub>
</div>
