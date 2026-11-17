# ITSD Patch versions

ใช้ลำดับเวอร์ชันตามที่ผู้ใช้กำหนด: V1.0.99 → V1.1.01 → V1.1.02 → … → V1.1.10 → …
เลข Patch หลังจุดสุดท้ายใช้สองหลัก เช่น 01, 02, 10

## V1.2.09 — 2026-11-17
- **ระบบเข้าสู่ระบบด้วย LINE (LINE Login OAuth 2.0 Integration)**:
  - เชื่อมต่อ LINE Developers Channel ID `2012663665` สำหรับการเข้าสู่ระบบผ่าน LINE
  - ฟังก์ชัน `getLineLoginUrl` สร้าง URL ขอสิทธิ์พร้อม Scopes `profile`, `openid`, `email`
  - ฝั่ง Server (`doGet`) รองรับ Callback จาก LINE OAuth 2.0 แลกรับ Token และดึงโปรไฟล์ / อีเมลอัตโนมัติ
  - ระบบตรวจสอบและจับคู่บัญชีอัตโนมัติ (Auto-Match User):
    1. จับคู่กับบัญชีเดิมผ่าน `line_user_id` ที่ผูกไว้ในระบบ (`APP_SETTINGS`)
    2. จับคู่อัตโนมัติด้วยอีเมลที่ได้รับจาก LINE กับอีเมลใน `APP_USER_PROFILE` หรือ Username ใน `APP_USERS`
    3. บันทึกการผูกบัญชี (`LINE_BIND_{lineUserId}`) อัตโนมัติสำหรับการเข้าสู่ระบบครั้งถัดไปแบบรวดเร็ว
  - รองรับทั้งแบบหน้าต่าง Popup (`window.opener` + `postMessage`) และ Full-page Redirect บนมือถือ / แท็บเล็ต
  - บันทึก Audit Log `LOGIN_SUCCESS_LINE` ทุกครั้งที่มีการยืนยันตัวตนสำเร็จ

## V1.2.08 — 2026-11-17
- **ระบบจัดการวันหยุดและปฏิทินแผน PM**:
  - เพิ่มฟังก์ชันดึงวันหยุดราชการไทยอัตโนมัติในเมนูตั้งค่าระบบ > จัดการวันหยุด เลือกล่วงหน้าได้ 3–5 ปี (พ.ศ. 2569, 2570, 2571, 2572, 2573)
  - เพิ่มปุ่ม "ดึงวันหยุดตามปีที่เลือก" และปุ่ม "ดึงวันหยุดทุกปี (2569 - 2572)" สำหรับดึงข้อมูลอัตโนมัติในคลิกเดียว
  - ตรวจสอบและซิงค์วันหยุดราชการไทยปี 2569 เข้าสู่ชีต `APP_HOLIDAYS` โดยอัตโนมัติ ทำให้ปฏิทินแผน PM แสดงไฮไลต์วันหยุดราชการ (สีแดงอ่อน) พร้อมชื่อวันหยุดบนช่องวันที่ทันที
- **ตารางผู้ใช้ (User Management)**:
  - ปรับสีพื้นหลังบทบาท "ฝ่ายสนับสนุน IT" (ITSUPPORT) ให้เป็นแถบสีม่วง (`role-itsupport`) เข้าชุดกับ "เจ้าหน้าที่ IT" (TECHNICIAN) ทั้งใน Light Mode และ Dark Mode เพื่อจัดกลุ่มบทบาทได้อย่างถูกต้องชัดเจน

## V1.2.07 — 2026-11-17
- **แม่แบบสติ๊กเกอร์ (Sticker Template) และการพิมพ์เป็นชุด (Batch Print)**:
  - เพิ่มแท็บ "แม่แบบสติ๊กเกอร์" ในเมนูตั้งค่าระบบ สำหรับกำหนดค่าโลโก้และข้อความบนสติ๊กเกอร์
  - ปรับปรุงการพิมพ์สติ๊กเกอร์เป็นชุดจากทะเบียนครุภัณฑ์ (Batch Print) ให้รองรับการเลือกพิมพ์ครุภัณฑ์ทั้งหมดในฐานข้อมูลโดยไม่จำกัด 300 รายการ
  - เพิ่มปุ่ม "เลือก 5 แผ่น (50 รายการ)" และแสดงจำนวนรายการทั้งหมด
  - เปลี่ยนข้อความหลักบนสติ๊กเกอร์เป็น "ซีเรียลนัมเบอร์" และตั้งค่าเริ่มต้น Prefix เป็นค่าว่าง
  - ปรับปรุงสีตารางใน Light Mode ให้เป็นสีสว่าง อ่านตัวหนังสือได้ชัดเจน และใช้โลโก้มาตรฐานริบบิ้นวงกลม

## V1.1.88 — 2026-11-13
- เพิ่มฟังก์ชันอัปโหลดรูปโปรไฟล์ผู้ใช้งานในหน้าต่าง "ข้อมูลบัญชีผู้ใช้":
  - รองรับการเลือกรูปภาพจากเครื่องคอมพิวเตอร์ / โทรศัพท์มือถือ
  - รองรับการเปิดกล้องถ่ายภาพสด (Webcam บนคอมพิวเตอร์ และกล้องหน้าบนมือถือ)
  - รูปภาพจะถูกบันทึกและอัปโหลดไปยัง Google Drive โฟลเดอร์ `Pictures` (ID: `18znTfPsF8Y91nj-8bpoYy5rRl1pWZIh-`) โดยอัตโนมัติ
  - รองรับการลบรูปโปรไฟล์และคืนค่า Avatar เริ่มต้น
  - อัปเดตรูปโปรไฟล์บนแถบ Topbar และ Sidebar แบบเรียลไทม์

## V1.1.87 — 2026-11-13
- ปรับกรอบปุ่มโปรไฟล์ผู้ดูแลระบบด้านล่าง Sidebar (`.sidebar .profile`) ให้เป็นทรงแคปซูลโค้งมน (`border-radius: 999px`) เข้าคู่กับปุ่มเมนูใน Sidebar (เช่น ปุ่มตั้งค่าระบบ) พร้อมเอฟเฟกต์ hover สอดคล้องกับโทนสีของ Theme และปรับเป็นวงกลมสมบูรณ์ในโหมดพับเมนู (`.sidebar.is-collapsed .profile`)

## V1.1.86 — 2026-11-13
- ปรับคอลัมน์และข้อมูลรายการรายงานประจำเดือน (CM) ทั้งตารางบนหน้าจอ และไฟล์ส่งออก (PDF, CSV, XLS) ให้แสดงครบ 16 คอลัมน์เรียงตามลำดับ: เลขที่แจ้งปัญหา, วันที่และเวลาที่แจ้ง, ผู้แจ้งปัญหา, ประเภทอุปกรณ์, ยี่ห้ออุปกรณ์, รุ่นอุปกรณ์, หมายเลขซีเรียล, เลขครุภัณฑ์, หน่วยงานหลัก, หน่วยงานย่อย, ประเภทปัญหา, รายละเอียดคำขอ / อาการเสีย, วันที่และเวลาเข้าแก้ไข, รายละเอียดการดำเนินงาน / วิธีแก้ไข, วันที่และเวลาแก้ไขเสร็จ, สถานะการแจ้งซ่อม
- ปรับแถบหัวคอลัมน์ของตารางและไฟล์รายงาน (PDF, XLS) ให้มีพื้นหลังสีฟ้าอ่อน (`#d0e8ff`) และตัวอักษรหนาตามที่กำหนด

## V1.1.85 — 2026-11-13
- แผงรายละเอียดการแจ้งซ่อม (#ticketSideBody):
  - จัดปุ่มดำเนินการให้อยู่ในแถวเดียวกัน เรียงลำดับตามที่กำหนด: **1. อัปเดตสถานะ** → **2. ข้อมูลใบงาน** → **3. พิมพ์ใบงาน (PDF)**
  - ปรับแถบแสดงเอกสารแนบ (`.ticket-side-attach-row`) ให้แสดงหัวข้อ `เอกสารแนบ (N) :` และรายการไฟล์แนบหรือข้อความสถานะในบรรทัดเดียวกัน เพื่อให้หน้าต่างข้อมูลกระชับและไม่เปลืองพื้นที่ในแนวตั้ง

## V1.1.84 — 2026-11-12
- ลบเส้นสีส้ม `rgba(250, 119, 55, 0.35)` ใต้โลโก้ Sidebar เมื่อพับเมนู (`.sidebar.is-collapsed .brand`) ออก และเปลี่ยนเป็นเส้นแบ่งตาม Theme (`var(--dark-border-subtle)`) ให้สอดคล้องกับโหมดปกติและแถบ `.topbar`
- ขยับแผงโปรไฟล์ผู้ดูแลระบบด้านล่างของ Sidebar (`.sidebar .sidebar-bottom` และ `.sidebar .profile`) ขึ้นด้านบนด้วย `margin-bottom: 64px` เพื่อไม่ให้ทับซ้อนกับปุ่มย่อ/ขยาย Sidebar (`.sidebar-collapse`) ทั้งในโหมดเปิดและโหมดพับเมนู

## V1.1.83 — 2026-11-12
- ปรับช่องค้นหาส่วนหัว (`.top-search input`, `.top-search button`, `.search-shortcut`) และป้ายสถานะ **ระบบพร้อมใช้งาน** (`#uxSystemStatus.ux-system-pill`) ให้เป็นทรงแคปซูลโค้งมน (`border-radius: 999px`) เข้ากับ Theme
- ปรับปุ่มเมนูใน Sidebar (`.sidebar nav` และ `.sidebar nav button`) ให้เป็นปุ่มทรงแคปซูลโค้งมน (`border-radius: 999px`) พร้อมระยะขอบ `padding: 6px 10px` และ `box-sizing: border-box` เพื่อให้ปุ่มพอดีอยู่ภายในกรอบ Sidebar ไม่ล้นขอบด้านขวา ทั้งในโหมดปกติและโหมดพับ (`.sidebar.is-collapsed`)

## V1.1.82 — 2026-11-12
- ปรับสีฟอนต์และพื้นหลังปุ่มเลือกช่วงวัน (`.dash-range-buttons button` และ `.dash-range-buttons button.active`) ให้ใช้ Token ตาม Theme (`var(--theme-surface)`, `var(--theme-text)`, `var(--dark-surface-strong)`, `var(--theme-strong-border)`, `var(--theme-strong-text)`) แทนตัวอักษรสีขาว `#ffffff` บนพื้นสว่าง ทำให้อ่านชัดเจนทั้งใน Light Mode และ Dark Mode

## V1.1.81 — 2026-11-12
- หน้าจอเข้าสู่ระบบ (`.login48-card`):
  - ปรับความโค้งมนของช่องกรอก **Username** และ **Password** (`.login48-card .login48-input input`) เป็น `border-radius: 11px` ให้โค้งมนแนวเดียวกันกับปุ่ม **เข้าสู่ระบบ** (`.login48-submit`)
  - ล็อกตำแหน่งปุ่มสลับแสดงรหัสผ่าน (`.login48-password-toggle`: `visibility` / `visibility_off`) ให้อยู่กึ่งกลางในกรอบ Password เดิมตลอด (`top: 50%; transform: translateY(-50%)`) ไม่ขยับออกนอกกรอบ และให้สว่างขึ้นตาม Theme (`var(--theme-accent)` + `filter: brightness(1.18)`) เมื่อชี้หรือกดสลับโหมด

## V1.1.80 — 2026-11-12
- **Backend GAS & Data Loading (`Server.js`)**:
  - เพิ่มชั้น Cache ข้ามคำขอด้วย `CacheService.getScriptCache()` แบบบีบอัด Gzip + แบ่ง Chunk (`sheetCacheGetJson_`, `sheetCachePutJson_`, `sheetCacheInvalidate_`) สำหรับชีตอ่านบ่อย (`INVENTORY`, `INCIDENT`, `INCIDENT_META`, `MST_ORG_UNITS`, `APP_SETTINGS`, `APP_ROLES`, `APP_ROLE_PERMISSIONS`, `APP_ROLE_ACTION_PERMISSIONS`, `MST_LOOKUP`, `MST_DEVICE_MODELS`) พร้อม Cache คอลัมน์วันที่ดิบของ `INCIDENT` ใน `rawColumnByRow_`
  - คงการอ่านตรงสำหรับ `APP_SESSIONS`, `APP_USERS`, `APP_AUDIT_LOGS`, `LINE_INBOX` เพื่อความปลอดภัยแบบ Real-time และล้าง Cache ทันทีผ่าน `resetRows_` ทุกจุดที่เขียนข้อมูล (รวมถึง `ocpbImport_` และ `commitSheetChanges_`)
  - เพิ่ม Rate Limiting ผ่าน `CacheService` ใน `itsdImpl_login_` เพื่อป้องกันการเดารหัสผ่านซ้ำๆ
- **Frontend Caching, Speed & Smoothness (`Index.html`, `UI_Styles.html`, `UI_Client.html`)**:
  - เพิ่ม **In-Flight RPC Deduplication** ใน `call()` สำหรับคำสั่งอ่านข้อมูล เพื่อไม่ให้ยิงซ้ำเมื่อคลิกสลับหน้าเร็วๆ และล้าง SWR Cache อัตโนมัติหลังบันทึกข้อมูล
  - เพิ่ม **Stale-While-Revalidate (SWR) `sessionStorage` Bootstrap Cache** ใน `refresh()` ให้เปิดหน้าจอได้ทันทีและอัปเดตข้อมูลพื้นหลังแบบไม่บล็อกผู้ใช้
  - เพิ่ม **Debounce (`140ms`)** ให้ช่องค้นหา/กรองข้อมูลที่ใช้ `oninput` (`debounceCall_`) ลดการ Re-render ระหว่างพิมพ์
  - เพิ่ม `dns-prefetch` ใน `Index.html`, `touch-action: manipulation`, `contain: layout style` และ `@media (prefers-reduced-motion: reduce)` ใน `UI_Styles.html`

## V1.1.79 — 2026-11-12
- ปรับปรุงพื้นหลัง Card ที่ไม่เปลี่ยนสีตาม Dark Theme (`.admin36-role-summary.tone-*` ในหน้ากำหนดสิทธิ์ และ `.admin36-user-kpi.tone-*` ในหน้าจัดการผู้ใช้) ให้ใช้ `var(--theme-panel)`, ขอบ `var(--theme-border)` และไอคอนโทนโปร่งแสงเข้ากับพื้นมืดใน Dark Mode
- ปรับขนาดปุ่มจัดการสิทธิ์ในตาราง Matrix (`.admin36-permission-matrix .admin36-perm-cell`) จาก `34×34px` เป็น **`24×24px`** เท่ากับขนาดวงกลมไอคอน `.admin36-perm-state` (`padding: 0; border: 0;`) โดยยังคงขนาดไอคอนเท่าเดิม และปรับไอคอนล็อก `.none` ใน Dark Mode ให้ใช้สีตาม Theme
- เปลี่ยนแถบสีส้มเวลากดเลือกบทบาท (`.admin36-role-list-item.active`) จาก `#fa7737` เป็นสีเส้นขอบสว่างตาม Theme (`var(--theme-strong-border)` / `var(--dark-surface-strong)`) ทั้ง Dark Mode และ Light Mode

## V1.1.78 — 2026-11-12
- หน้าจอกำหนดสิทธิ์ (`section.admin36-permissions`):
  - ปรับความกว้างคอลัมน์ซ้ายของแผง **รายการบทบาท (Role)** (`.admin36-perm-shell`) บนหน้าจอเดสก์ท็อป (`> 1280px`) เป็น `calc((100% - 40px) / 5)` พร้อม `gap: 10px` ให้แนวขอบซ้าย-ขวาตรงกับการ์ด **`ADMIN`** ด้านบนอย่างลงตัว
  - เปลี่ยนแถวบทบาท (`.admin36-role-list-item`) เป็น Grid 4 คอลัมน์ใน Flow เดียวกัน (`36px minmax(0, 1fr) auto auto`) และนำปุ่มเมนู `.admin36-role-more` (`more_vert`) ออกจาก `position: absolute` มาเป็นคอลัมน์ท้ายสุดขนาด `28×28px` ทำให้ปุ่มจำนวนคน (`N คน`) และปุ่ม `...` ไม่ซ้อนทับกันในทุกความกว้างหน้าจอ

## V1.1.77 — 2026-11-12
- เปลี่ยนไอคอนปุ่มดูขั้นตอนหลังส่งคำขอ (`.itsd65-help-trigger`) จาก `notifications` เป็น **`info`**
- ปรับทรงปุ่ม `.itsd65-help-trigger` (`36×36px`) และปุ่มปิดหน้าต่างขั้นตอน `.itsd65-help-close` (`32×32px` พร้อมไอคอน `close`) ให้เป็น**ปุ่มวงกลม (`border-radius: 50%`)** ทั้งหมดทั้งใน Light Mode และ Dark Mode

## V1.1.76 — 2026-11-12
- จัดแนวคอลัมน์ **`โทร.`** ในฟอร์มใบงานบริการ (`CM-Form_69`) ให้เริ่มต้นตรงแนวเดียวกับ **`หมายเลขเครื่อง`** และ **`รุ่น`** โดยปรับ `.r4` ให้แบ่งครึ่งซ้าย-ขวา `1fr 1fr` เท่ากับ `.r2` และจัด `โทร.` + `ชั้น` + `วันที่` ใน `.r4-right`

## V1.1.75 — 2026-11-12
- ปรับปรุงฟอร์มใบงานบริการ (`CM-Form_69` / `service70Html`):
  - คำนวณความยาวชื่อหน่วยงานจาก `MST_ORG_UNITS`: หน่วยงานหลัก (`สำนัก/กอง`) ยาวสุด **46 ตัวอักษร** (35 ฐานอักษร) และหน่วยงานย่อย (`กลุ่ม/ศูนย์`) ยาวสุด **42 ตัวอักษร** (33 ฐานอักษร) ปรับสัดส่วนคอลัมน์ `.org-row` เป็น `1.07fr 1fr` พร้อมใช้ขนาดตัวอักษรปกติมาตรฐาน `10.5pt` เท่ากันทั้งใบงาน (ยกเลิกการบีบฟอนต์เหลือ `6.3pt–9.4pt`)
  - ปรับหัวข้อ **`ปัญหา`**, **`วิธีการแก้ไข`**, **`สถานะของงาน`**, และ **`หมายเหตุ`** เป็นตัวหนา (`font-weight: 700`) เพื่อความชัดเจน
  - กำหนดเส้นประหัวข้อ **`ปัญหา`** เป็น **3 บรรทัด** (`lines3` / `22.8mm`) และหัวข้อ **`หมายเหตุ`** เป็น **2 บรรทัด** (`lines2` / `15.2mm`) พร้อมเปลี่ยนช่องกรอก `#service70Note` ใน Modal แก้ไขใบงานเป็น `<textarea rows="2">`

## V1.1.74 — 2026-11-12
- ปรับช่อง **`เบอร์โทร`** (`#fPhone`) ในฟอร์มแจ้งซ่อมใหม่ ให้เป็นช่องทางเลือก **ไม่บังคับกรอก** (นำเครื่องหมาย `*`, `required` และ `minlength="8"` ออก และจำกัดความยาวที่ `maxlength="40"` ให้สอดคล้องกับฝั่ง Server และหน้าตรวจสอบ LINE Inbox รวมถึงปรับโฟกัสการ Pre-fill ให้ตรวจฟิลด์จำเป็นก่อน)

## V1.1.73 — 2026-11-12
- ปรับพื้นหลังปุ่มเมนู Sidebar ที่ถูกเลือก (`.sidebar nav button.active`) ปุ่มหลัก (`.primary`, `.login48-submit`, `.itsd65-action.primary`) และแท็บ/ตัวเลขขั้นตอนที่เคยใช้สีม่วง-น้ำเงินทึบ `#4d49fc` ให้เป็นโทนสีจางนุ่มพร้อมเส้นขอบชัดและสีตัวอักษรความต่างสูง (`--theme-strong-text`) เพื่อให้อ่านข้อความและไอคอนได้ชัดเจนทั้งใน **Light Mode** และ **Dark Mode**
- ย้ายตำแหน่งปุ่มสลับโหมด **Light / Dark Mode** (`#themeToggle`) ใน [Index.html](file:///Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026/Index.html) และ `UI_Client.html` ไปวางต่อท้ายปุ่มแจ้งเตือน (`.ux-notification-wrap`) ก่อนเส้นคั่น `.top-divider` ทันที
- ปรับพื้นหลังรายการแจ้งเตือน (`.ux-notification-menu`, `.ux-notification-head`, `.ux-notification-list button`, `.ux-notification-empty`) และ `.toast` ให้ใช้สีพื้นหลัง `var(--theme-panel)` ชุดเดียวกันทั้งหมดทั้งหัวข้อและรายการด้านใน พร้อมสีข้อความ `var(--theme-heading)` / `var(--theme-text)` / `var(--theme-muted)` ที่อ่านชัดทั้ง Light Mode และ Dark Mode

## V1.1.72 — 2026-11-12
- แก้ไขช่องกรอก `ชื่อผู้ใช้` และ `รหัสผ่าน` หน้า Login (`.login48-card .login48-input input`) ไม่ให้เปลี่ยนพื้นหลังเป็นสีขาว (`#fff`) ขณะพิมพ์/โฟกัส จนกลืนกับตัวอักษรสีสว่างในโหมด Dark โดยบังคับใช้ `var(--theme-input)` คู่กับ `var(--theme-text)` และครอบคลุมถึง `:-webkit-autofill`
- ตัดเอฟเฟกต์เงาฟุ้ง (`box-shadow` glow halo) ออกจากการโฟกัสช่องกรอกหน้า Login และปุ่มแสดงรหัสผ่าน (`.login48-password-toggle`) ให้เหลือเพียงเส้นขอบคมชัดสี `var(--theme-accent)` ตามธีมที่เลือก

## V1.1.71 — 2026-11-12
- แก้ไขแผง **`ตรวจสอบ ข้อความแจ้งซ่อม ผ่าน LINE`** (`#itsd65LineInbox`, `#itsd65LineSettings`, `.itsd65-help-popover`, `.line78-dialog`) และ **`Import Wizard`** (`.ocpb-import-*`) ให้ใช้ชุดออกแบบใหม่ครบ 100% โดยย้ายกฎ override ที่เคยถูก `line-inbox.css` / `import-dialog.css` เขียนทับให้มาอยู่ท้าย cascade ด้วย Semantic Variables
- นำปุ่มสลับ **`Light Mode / Dark Mode`** (`#themeToggle`, `setTheme()`, `toggleTheme()`, `ocpb_mode`) กลับมาบน Topbar โดยมี **`# Dark` (`data-theme="dark"`)** เป็นค่าเริ่มต้น และเพิ่มชุดตัวแปร `html[data-theme='light']` ตามมาตรฐาน WCAG 2.2 AA (โดยยังคงตัด `palette-01..12` ออกตามเดิม)

## V1.1.70 — 2026-11-12
- ปรับระบบสีและตัวอักษรทั้ง Web App เป็นชุดออกแบบ **`# Dark`** (`design-system-dark`) แบบ Single Theme (`#000000` Base, `#04060f` Raised, `#080d1d` Elevated, `#02040a` Input, `#4d49fc` CTA/Active, `#00d4ff` Cyan Border & Aura Glow `shadow.1/2`, `#ef4444` Danger/Validation, `oklab(0.804241 -0.112554 -0.0928449 / 0.5)` Focus Ring, และ `150ms` Motion พร้อมรองรับ `prefers-reduced-motion`)
- เปลี่ยนชุดฟอนต์หลักเป็น `JetBrains Mono` คู่กับ `Noto Sans Thai` (`tabular-nums`) และกำหนดคู่สีตามมาตรฐาน **WCAG 2.2 AA** (`#e2e8f0` เนื้อหาหลัก, `#94a3b8` ข้อความรอง, `#64748b` ไอคอน/ข้อมูลรอง)
- ตัดฟังก์ชันสลับธีมเดิมทั้งหมดออก (`#themeToggle`, `setTheme()`, `toggleTheme()`, `ocpb_mode`/`ocpb_theme` localStorage listener, `palette-01..12`, `.ui-theme-dark`, และ Clay & Sea / Orange Energy overrides) ลดขนาด `UI_Styles.html` จาก `338,129` bytes เหลือ `301,969` bytes (ลดลง **36,160 bytes** หรือ ~10.7%) และแก้ไข CSS rule ที่ยังไม่ปิดปีกกาจากเวอร์ชันก่อนหน้า
- ปรับสีกราฟ SVG และ `DASHBOARD_STATUS_COLORS` (`#00d4ff`, `#4d49fc`, `#22c55e`, `#f59e0b`, `#ef4444`, `#a855f7`, `#94a3b8`) โดยยังคงรูปแบบฟอร์มพิมพ์ `CM-Form_69` และ `@media print` พื้นขาวหมึกดำตามเดิม

## V1.1.69 — 2026-11-12
- เพิ่มแท็บ `License` ต่อจาก `คุณลักษณะ` ในหน้ารายละเอียดอุปกรณ์ โดยอ่านข้อมูลต้นฉบับจากแท็บ `Full_Data` ของไฟล์ `License` (รองรับ fallback ชื่อแท็บ `SOFTWARE_LICENSES`) และจับคู่กับ `INVENTORY` ด้วย Serial Number แบบ normalized exact match เท่านั้น
- ผสานสถานะ `สถานะ License`, `สถานะ Activation`, และหมายเหตุ QC จากแท็บ `SOFTWARE_LICENSES` ใน `ITServiceDesk — DBS` พร้อมโหมดแสดงผล `masked_only` (ปิดปุ่มเปิดดูค่าจริง) สำหรับกรณี Serial ในต้นทางยังไม่ตรงหรือเข้าถึงไฟล์ต้นทางไม่ได้
- เพิ่มการส่ง/แก้ไข `หมายเลขสินทรัพย์` (`asset_code`) ใน Inventory และการล้าง cache แท็บ `License` อัตโนมัติหลังบันทึกข้อมูลอุปกรณ์
- แท็บและ API จำกัดเฉพาะบทบาท `ADMIN` และ `MANAGER`; ค่า License/บัญชี/รหัสผ่านแสดงแบบปกปิดเป็นค่าเริ่มต้น การเปิดดูค่าจริงต้องมี `license.reveal_secret` ยืนยันรหัสผ่านปัจจุบัน แสดง 60 วินาที และบันทึก Audit Log แบบไม่เก็บค่าลับ
- ผลตรวจข้อมูลหลัง Step 1: จับคู่ใน `ITServiceDesk — DBS` (`SOFTWARE_LICENSES`) ครบ **95 เครื่อง (285 แถว)** แล้ว; ฝั่งไฟล์ต้นทาง `License/Full_Data` จับคู่อัตโนมัติได้ทันที **87 เครื่อง** ส่วนอีก **8 เครื่อง** แสดงผลแบบ `masked_only` จนกว่าเจ้าของไฟล์ `License` จะแก้ Serial Number ที่ OCR เพี้ยนในต้นทาง
- สถานะ: **Production Deployed** — Push ขึ้น Apps Script (`1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7`) เป็น **Version 120** และอัปเดต Production Deployment (`AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps @120`) เรียบร้อยแล้ว (`/exec` ตอบ HTTP 200 พร้อม `version: "V1.1.69"`); ยังคงแนะนำให้เจ้าของไฟล์ `License` ปิด Public sharing และเปลี่ยน credential ที่เคยเปิดเผยต่อไป

## V1.1.01 — 2026-10-29
- ปรับไอคอนและพื้นที่กด แถบค้นหา ฟอร์ม เมนู กราฟ และการเลื่อนบน Mobile
- รองรับ viewport 393×852, 375×812, 360×800 และ 360×640 CSS px
- สถานะ: Local Patch; ยังไม่ได้ push หรือ deploy
- รายงาน: .patch-reports/mobile-V1.1.01-20261029/README.md

## V1.1.02 - 2026-10-29
- Fix survey report mobile date controls: match other filter fields at 44 CSS pixels, constrain width and normalize native date appearance.
- Keep native date picker and existing filter behavior.
- Deployed as Apps Script version 49 at the existing web-app URL after three verification passes.

### Included in V1.1.02: brand/model master data
- Added MST_DEVICE_MODELS and migrated 107 unique complete legacy type/brand/model combinations; 13 incomplete legacy rows remain untouched in INVENTORY.
- Master Data > Device Models supports search/filter, add/edit, deactivate and reactivate.
- Equipment model options depend on both type and brand. Historical inactive selections remain readable and unchanged.
- Role permissions, duplicate validation, audit logging, schema validation and referenced-name protection run on the server.
- Live database tab verified. Eight app files pushed, read back and deployed as version 49; production smoke checks passed.

### Final pre-deployment fix
- Ignore and reuse checkbox-only empty model rows; 29 server regression cases and 158 browser checks passed.
- Production V1.1.02: 107 catalogue records, no empty catalogue rows, mobile date controls 44px.

## V1.1.03 - 2026-10-29
- Fixed empty Brand tab: APP_LOOKUPS had no BRAND records although inventory contained 26 distinct brands.
- On Master Data access by a user with CREATE permission, register missing inventory brands under the script lock. Deduplicate normalized names, keep inactive records inactive, preserve inventory, and audit additions.
- Deployed as Apps Script version 50 at the existing URL after three verification passes.

## V1.1.04 - 2026-10-29
- Move survey inspector filter after the end date, as the final filter before action buttons.
- Chrome/WebKit checks passed; pushed and deployed as Apps Script version 51 at the existing URL.

## V1.1.05 - 2026-10-29
- Constrain service report date fields to their grid cells and align all filter controls/buttons at 44px.
- Pair dates in a responsive filter grid; preserve native date picking and filter behavior.
- Verified 48 Chrome/WebKit cases; deployed as Apps Script version 52 at the existing URL.

## V1.1.06 - 2026-10-29
- Compact service report desktop filters and actions into one row with 40px controls; retain mobile 44px layout.
- Narrow desktop content can scroll the filter row horizontally instead of wrapping; contain the status chart legend in its panel.
- 52 Chrome/WebKit layout checks passed; deployed as Apps Script version 53 at the existing URL.

## V1.1.07 - 2026-10-29
- Survey report filters reordered: dates, type, brand, main unit, sub-unit, status, surveyor. Added backend brand/sub-unit filtering and updated export labels/summary.
- Inventory filters reordered with dependent sub-units; PC-style asset number and UPS digit entry auto-format, preserve leading zeroes and support normalized partial searches and clipboard/editing.
- Debugged in two passes: 73 logic cases and 120 Chrome/WebKit browser cases passed.
- Pushed eight files, matched deployed source hashes, deployed Apps Script version 54 at the existing URL and confirmed production V1.1.07.

## V1.1.08 - 2026-10-29
- Fix overlapping survey/inventory filter captions and controls: place labels above fields with consistent spacing.
- Verified twice, including 104 Chrome/WebKit responsive cases; pushed 8 files and updated existing deployment to Apps Script version 55.
- Immutable deployed source matches local SHA256 for all 8 files.

## V1.1.09 - 2026-10-29
- Desktop survey: halve inspector width and divide recovered width equally between device type and brand.
- Two verification rounds; 104 Chrome/WebKit responsive cases passed, redistribution measured.
- Pushed and deployed existing URL as version 56; 8 source hashes and public V1.1.09 footer verified.

## V1.1.12 - 2026-10-30
- Complete user-role summary including Manager, separate Technician/IT Support/User and roles supplied by server or existing accounts.
- Verified two rounds; pushed 8 files and deployed existing URL version 59. Immutable source hashes match Local.

## V1.1.13 - 2026-10-30
- User groups reuse permission role cards: same code/order/colors/icons/descriptions and separate Technician/IT Support counts.
- Click a group to toggle the user role filter; preserve total and active counts as text.
- Two verification rounds passed; deployed existing URL as version60, 8 source hashes match local.

## V1.1.14 - 2026-10-30
- Survey chart legend replaces Other with Total Equipment, using summary.total from the scoped equipment KPI. Donut segments/percent calculation unchanged.
- Syntax and exact-diff/total/zero checks passed; deployed existing URL version61; all 8 immutable source files match local.

## V1.1.15 - 2026-10-30
- Audit history desktop filter toolbar fits one row with proportional search, compact date/select fields and 40px controls.
- Two verification rounds passed; deployed version62 at existing URL; immutable 8 source files match Local.

## V1.1.16 - 2026-10-30
- Center all four survey KPI glyphs inside their colored containers; separate icon font span from grid container.
- Two checks passed (syntax and browser center geometry); deployed version63 at existing URL, 8 source files match Local.

## V1.1.17 - 2026-10-30
- Keep permission matrix buttons circular (44x44) and state glyphs centered (24x24) on Mobile/Desktop.
- Two rounds passed including Chrome/WebKit geometry for all three states and editable/disabled styles in light/dark.
- Deployed existing URL version64; source8/8 matches Local.

## V1.1.18 - 2026-10-30
- Add ADMIN-only เปลี่ยนรหัสผ่าน NIST tab after แม่แบบใบงาน: configurable one-time campaign, Thai start time, notification and explicit new-round action. Default campaign disabled, starts 1 Nov 2026 00:00 Asia/Bangkok when enabled.
- Enforce password change server-side before normal bootstrap/API access; after success revoke all sessions and record completion for the current campaign. Administrative temporary passwords also require change. No periodic expiry; new passwords15..128 and cannot match current/common weak entries.
- Save policy requires ADMIN + SETTINGS/MANAGE + current-password reauthentication and revision validation. Audit changes without recording credentials.
- Two rounds passed: 58 backend checks, actual refresh gate, Chrome/WebKit responsive and form-flow tests. Deployed version65 at existing URL; 8 source files match local and live public footer V1.1.18 verified. Campaign not enabled by deployment.

## V1.1.20 - 2026-11-02
- Restore separate survey KPI icon wrappers after V1.1.19 source regression; center all four glyphs in fixed square color blocks with scoped flex layout.
- Show compact 32px color blocks with 20px glyphs on mobile; retain 44px/24px on larger screens and prevent flex shrink.
- Validation: JavaScript syntax and manifest parsing; actual survey renderer geometry in Chrome/WebKit across mobile and desktop sizes and light/dark themes.

## V1.1.21 - 2026-11-02
- LINE review uses asset numbers as visible input and search key, including partial numbers, Thai digits and separator-free input. Persist existing internal asset IDs for API compatibility.
- Exact unique number may resolve automatically; duplicate numbers require selecting the machine using model, serial and owner. Show selected details below the picker, including on mobile. No-asset/software mode retained.
- Two rounds passed: syntax/manifest and 12 Chrome/WebKit mobile/desktop interaction scenarios.

## V1.1.22 - 2026-11-02
- User rows now sort ADMIN, MANAGER, TECHNICIAN, ITSUPPORT, USER, followed by custom roles; ties use Thai display-name order, username and ID. The role filter follows the same role sequence.
- Add ADMIN-only จัดการวันหยุด settings tab before แม่แบบใบงาน with date ranges, holiday/special holiday/announcement types, active toggle, create/edit/soft delete. Entries use APP_HOLIDAYS, initialized only on the first save; no official holiday dates are assumed or seeded. SETTINGS VIEW/MANAGE and ADMIN required server-side; revisions, schema/date validation and audit protect writes.
- PM month API returns active overlapping entries. Calendar cells show light red for government/special holidays (takes precedence over weekends), gray for Saturdays/Sundays, and text for ordinary announcements. Existing PM cards and drag/drop remain available.
- Two checks: syntax/manifest/backend assertions and Chrome/WebKit responsive interaction tests.

## V1.1.23 - 2026-11-02
- Replace LINE review asset dropdown/datalist with a four-column clickable table: asset number, brand, model, owner. Search remains based on the asset number; stored selections retain the internal ID for API compatibility.
- Multiple matches require explicit row selection; highlight selected row and support radio keyboard navigation. Mobile table scrolls horizontally within its container with an explanatory hint. Existing no-asset/software mode and org autofill preserved.
- Two verification rounds: syntax/manifest and 12 Chrome/WebKit interaction scenarios across iOS/Android/desktop viewport sizes, light/dark, duplicate/partial/invalid searches, payload stability, escaping and no-asset mode.

## V1.1.24 - 2026-11-02
- Profile logout button has a visible 2px red border with scoped light/dark hover and keyboard-focus treatment; logout behavior unchanged.
- Restore native brand-reference tab title BRANDING to Branding (sheetId 2118943160), matching brandingBrandCatalog_ reference. All native cells/format/validation preserved and verified; code catalogue reader tested against freshly read live Branding and MST_DEVICE_MODELS data.
- Tracking table hides the ticket-number column and displays report date, asset number, brand, model, equipment, status, queue and details. Brand/model are included in the permission-filtered ticket payload from the INCIDENT snapshot; missing historical values show a dash. Ticket IDs remain internal for search and detail actions.
- Validation: syntax/manifest, backend catalogue/payload assertions and Chrome/WebKit desktop/mobile interaction checks.

## V1.1.25 - 2026-11-02
- Add read-only รายละเอียดคำขอ / อาการเสีย above the status-update fields, separate from the repair resolution. Preserve original line breaks, escape HTML and wrap/scroll long text on mobile. Missing descriptions show an explicit fallback.
- Original description is not added to the status-save payload; permissions, status requirements, attachments, and the service-report wrapper remain unchanged.
- Two rounds passed: syntax/manifest and unchanged server behavior; 12 Chrome/WebKit desktop/mobile scenarios covering description/escaping/newlines/long/empty content, assignment/resolution validations, stable save payload, permission gate and service-print integration.

## V1.1.26 - 2026-11-03
- Normalize branding image uploads to PNG after browser decoding; fixes WebP images saved with a JPG extension. Recheck square/minimum dimensions, bound output to 1024px, and retain server validation.
- Actual customer-service.jpg regression and seven format/size/error cases pass in Chrome and WebKit (16 total).

## V1.1.27 - 2026-11-03
- Compact ticket detail drawer: reduce row/header/section spacing, widen desktop drawer to 520px, retain full text and multiline notes.
- Chrome/WebKit desktop/mobile light/dark checks passed (12 cases); screenshot fixture fits in one window without hiding fields.

## V1.1.28 - 2026-11-03
- Use account_circle as the default system branding icon in login, sidebar, login progress, settings preview and reset behavior.

## V1.1.29 - 2026-11-03
- Balance ticket drawer spacing: desktop 14px body text, comfortable row gaps and 500px width. Drawer height follows content with a viewport cap and scrolling for long records; mobile keeps compact full-height behavior.

## V1.1.30 - 2026-11-03
- Compact Desktop status dialog with reduced row spacing, paired resolution/notes and smaller attachment selector. Standard Desktop fixture fits without dialog scrolling; original request text remains complete.
- Chrome/WebKit light/dark at four Desktop sizes and one mobile size passed (20 cases), including assignment/resolution requirements.

## V1.1.31 - 2026-11-03
- Status dialog footer places attachments left and actions right on Desktop; compact Mobile form with 44px action targets.
- Apply six-color reference palette to overview cards and shared icon backgrounds in light/dark; update five overview labels while preserving metric calculations. COLOR_TEMPLATE.md records reusable colors.
- Status layout: 28 Chrome/WebKit responsive/theme cases passed. Palette: 12 responsive/theme cases passed.

## V1.1.32 - 2026-11-03
- Remove six-color overrides from Google Fonts glyphs and shared icon containers; glyph backgrounds are transparent. Retain overview card colors and readable KPI icons in light/dark.

## V1.1.68 - 2026-11-11
- Complete the Clay & Sea interface consolidation, remove the twelve-palette switcher and retain only Light/Dark mode while preserving the confirmed production project, spreadsheet, Apps Script project and existing Web App deployment URL.
- Keep inventory editing separated into General, Specifications, Survey and Repair History sections. General and Specifications save independently without overwriting the other section.
- Generate new inventory IDs sequentially from the highest numeric ID in `INVENTORY`, ignore legacy UUID-style IDs and preserve the active prefix/number width. New records display the generated ID after the server save succeeds.
- Finalize CM-Form_69 for A4 portrait with 10 mm print margins, adaptive long organization/JOB NO content, compact organization/telephone rows and separate Save and Print PDF actions.
- Retain LINE inbox prefill, shared inventory picker/device patch behavior, configurable branding/logo and the existing authorization, import-limit and confirmed-database safeguards.
- Add a deterministic unit test for sequential inventory IDs, including mixed UUID data, width growth and empty-sheet cases. Tests and local pull backups are excluded from `clasp push`.
- Source boundary: this checkout is the deployable root Apps Script bundle configured by `.clasp.json`; no duplicate `src/` tree is introduced.
- Validation: server/client syntax, manifest parsing, four inventory-ID unit cases and Chrome headless CM-Form_69 rendering passed; the generated PDF is one A4 page (595 x 842 preview) with 10 mm side margins and complete long JOB NO./organization values.
- Released as Apps Script version 119 by updating the existing production deployment; HTTP returned 200 and a read-back comparison matched all 8 deployable files.

## V1.1.67 — 2026-11-11
- **CM Service Report A4 Row Alignment ([`service70Html`](file:///Users/chaloem/Antigravity/ITSD/src/UI_Client.html))**:
  - ขยับตำแหน่งช่อง **`โทร.`** ไปทางด้านขวาอีกประมาณ 6 ตัวอักษร (`1.45fr 1.31fr` → `1.71fr 1.05fr`) เพิ่มพื้นที่ช่อง `ชื่อผู้ใช้งาน` และจัดสมดุลความกว้างกับช่อง `โทร.`

## V1.1.66 — 2026-11-11
- **CM Service Report Modal & Print Form Polish ([`service70Edit`](file:///Users/chaloem/Antigravity/ITSD/src/UI_Client.html) & [`service70Html`](file:///Users/chaloem/Antigravity/ITSD/src/UI_Client.html))**:
  - **ปุ่มการทำงานหน้าต่าง `สร้าง / แก้ไขข้อมูลใบงาน (CM)`**: ตัดปุ่ม `บันทึก & พิมพ์ใบงาน (PDF)` ออก และจัดเรียงลำดับปุ่มใหม่เป็น **`บันทึก`** (ปุ่มหลัก) ตามด้วย **`พิมพ์ใบงาน (PDF)`**
  - **แบบฟอร์มใบงาน A4**: เปลี่ยนข้อความ `โทรศัพท์ภายใน` เป็น **`โทร.`** และปรับความกว้างคอลัมน์ **`ชั้น`** ให้แคบลง 50% (`0.62fr` → `0.31fr`) เพื่อนำพื้นที่ส่วนที่ลดลงไปเพิ่มให้ช่อง **`โทร.`** (`1fr` → `1.31fr`)

## V1.1.65 — 2026-11-11
- **CM Service Report A4 Layout Refinement ([`service70Html`](file:///Users/chaloem/Antigravity/ITSD/src/UI_Client.html))**:
  - **ขอบกระดาษซ้าย-ขวาข้างละ 1 ซม. (`@page{margin:10mm}`, `.sheet{max-width:190mm}`)**: ขยายพื้นที่เนื้อหาบนกระดาษ A4 จาก 182mm เป็น 190mm พร้อมซิงค์ `@media screen` และ `@media print` ให้ตรงกันทั้งหน้าตัวอย่างและ PDF จริง
  - **แสดงเลข `JOB NO.` ครบถ้วนไม่โดนตัดขอบ**: ปรับ `.head-top` และ `.job-no` (`flex: 0 0 auto`, `white-space: nowrap`, `overflow-wrap: normal`, auto-sizing ตามความยาวรหัส) ให้รหัสใบงานยาวอย่าง `INC-2027-11-11-0002` แสดงครบทุกหลักในบรรทัดเดียว
  - **แสดงชื่อ `สำนัก/กอง` และ `กลุ่ม/ศูนย์` ได้ครบสมบูรณ์ในบรรทัดเดียว**: เพิ่ม `orgField()` คำนวณขนาดตัวอักษรอัตโนมัติตามความยาวอักขระฐานภาษาไทย (`baseLen`) บนแถว `.org-row` ทำให้ชื่อหน่วยงานยาว เช่น `กองนโยบายและยุทธศาสตร์การคุ้มครองผู้บริโภค` และ `ส่วนความร่วมมือกับต่างประเทศ (ส่วนต่างประเทศฯ)` แสดงครบไม่ตกบรรทัด

## V1.1.64 — 2026-11-11
- **Inventory Search & Editable Equipment Details (หน้าอัปเดตสถานะ + หน้าสร้าง/แก้ไขข้อมูลใบงาน CM)**:
  - **เพิ่ม Shared Inventory Picker (`uiAttachInventoryPicker`)**: ค้นหาอุปกรณ์จาก `INVENTORY` ด้วย **เลขครุภัณฑ์ หรือ หมายเลขซีเรียล** (พร้อมยี่ห้อ รุ่น ผู้รับผิดชอบ ชั้น) เพื่อป้องกันความผิดพลาดจากการพิมพ์เองด้วยมือ
  - **หน้า `อัปเดตสถานะ` (`statusForm`)**: เพิ่มส่วน **ข้อมูลอุปกรณ์ / ครุภัณฑ์** สำหรับเจ้าหน้าที่ ค้นหา/ดึงข้อมูลจาก Inventory หรือเพิ่ม/แก้ไข `เลขครุภัณฑ์`, `ยี่ห้อ`, `รุ่น`, `หมายเลขซีเรียล` (และผูก `asset_id`) ได้โดยตรงผ่าน [`ticketApplyDevicePatch_`](file:///Users/chaloem/Antigravity/ITSD/src/Server.js) ใน `itsdImpl_changeStatus_`
  - **หน้า `สร้าง / แก้ไขข้อมูลใบงาน (CM)` (`service70Edit`)**:
    - เพิ่มช่องค้นหาครุภัณฑ์ / ซีเรียลจาก Inventory เพื่อดึง/แก้ไข **ข้อมูลครุภัณฑ์ของงานนี้** พร้อมอัปเดต Summary และบันทึกลง `INCIDENT` + `INCIDENT_META`
    - เพิ่มช่องค้นหาครุภัณฑ์ / ซีเรียลจาก Inventory ทั้งในส่วน **อุปกรณ์ส่งซ่อม** (พร้อมปุ่ม 1-คลิก **ใช้เครื่องเดียวกับงานนี้**) และ **อุปกรณ์ทดแทน** เพื่อเติมชื่อ รุ่น และหมายเลขอุปกรณ์อัตโนมัติ
    - แก้ไขเลย์เอาต์ฟอร์ม `service70Edit` ให้ใช้ `form-grid asset-grid-2 / asset-grid-3 / asset-grid-4` เรียงคอลัมน์แนวนอนสวยงามพอดีหน้า

## V1.1.63 — 2026-11-11
- **LINE Inbox → New Ticket Prefill Workflow (ลดความซ้ำซ้อนและไม่ข้ามขั้นตอน)**:
  - **ส่งข้อมูลจาก LINE เข้าสู่หน้า `แจ้งซ่อมใหม่` โดยตรงเมื่อกด `อนุมัติแจ้งซ่อม`**: ปรับ [`line78Decision`](file:///Users/chaloem/Antigravity/ITSD/src/UI_Client.html) และเพิ่ม `line78PrefillTicketForm` ให้ส่งข้อมูลที่ตรวจสอบ/แก้ไขจาก LINE (`ผู้แจ้งปัญหา`, `เบอร์โทร`, `หน่วยงานหลัก`, `หน่วยงานย่อย`, `เลขครุภัณฑ์` หรือ `ไม่มีเลขครุภัณฑ์ + ประเภทอุปกรณ์/ระบบ`, `ประเภทปัญหาการแจ้งซ่อม`, `ระดับความเร่งด่วน`, `รายละเอียดปัญหา`) เข้าสู่ฟอร์ม `#ticketForm` ด้านซ้ายทันที พร้อมโฟกัสช่องที่ยังขาดเพื่อให้ตรวจสอบ ระบุข้อมูล/แนบไฟล์ให้ครบตามขั้นตอนแล้วกด `บันทึกคำขอ`
  - **เชื่อมโยง `line_inbox_id` ฝั่ง Server Atomically ใน [`itsdImpl_createTicket_`](file:///Users/chaloem/Antigravity/ITSD/src/Server.js)**: เมื่อบันทึกคำขอจาก LINE สำเร็จ ระบบสร้าง Ticket ใน `INCIDENT` ด้วยช่องทาง `LINE` และอัปเดตสถานะใน `LINE_INBOX` เป็น `CREATED` พร้อม `ticket_id` และ Audit Log ภายใน Lock เดียวกันโดยอัตโนมัติ
  - **ลดการสลับหน้าซ้ำซ้อนไปยังหน้า `ติดตามงาน`**: หลังกด `อนุมัติแจ้งซ่อม` และหลังกด `บันทึกคำขอ` ของรายการจาก LINE ระบบจะคงอยู่หน้า `แจ้งซ่อมใหม่`, รีเฟรชคิวข้อความ LINE ทันทีเพื่อให้ทำรายการถัดไปได้ต่อเนื่อง พร้อมปุ่มทางลัดเปิดดูที่ `ติดตามงาน` เมื่อต้องการ

## V1.1.62 — 2026-11-11
- **CM-Form_69 Service Report Template & Technician Post-Fix Integration**:
  - **จัดหน้าแม่แบบใบงานบริการ A4 เหมือนไฟล์ `CM-Form_69.pdf` 100%**: ใช้โลโก้ **Open Technology** ที่อัปโหลดเข้าระบบเป็นค่าเริ่มต้น (`APP_SETTINGS.report_logo_file_id` + fallback Base64), หัวกระดาษข้อความสีน้ำเงิน (`#1f4e8c`), กล่องกรอบ `SERVICE REPORT` และ `JOB NO.`, ชื่อฟอร์ม + ชื่อโครงการกึ่งกลาง, ช่องเส้นประข้อมูลหน่วยงาน/ผู้ใช้งาน/โทรศัพท์ภายใน/ชั้น/วันที่/ครุภัณฑ์/หมายเลขเครื่อง/ยี่ห้อ/รุ่น, Checkbox `ประเภทอุปกรณ์` 5 รายการ (`Computer PC`, `Notebook`, `UPS`, `Printer`, `Scanner` รองรับทั้งชื่อไทย/อังกฤษ), พื้นที่เส้นประ `ปัญหา` (3 บรรทัด) และ `วิธีการแก้ไข` (4 บรรทัด), ตาราง `สถานะของงาน` 2 แถว (`เสร็จสิ้นเรียบร้อย`, `ส่งซ่อม`, `สำรองอุปกรณ์`, `วันที่`, และ `เปลี่ยนอุปกรณ์` ใต้ `เสร็จสิ้นเรียบร้อย`), บรรทัดเดี่ยว `อุปกรณ์ส่งซ่อม` / `อุปกรณ์ทดแทน` และ `หมายเหตุ` พร้อมช่องลงนาม `ผู้ปฏิบัติงาน` / `ผู้ใช้งาน` แบบสมมาตรใน 1 หน้า A4
  - **เชื่อมข้อมูลอัตโนมัติ + หน้าต่างสร้างใบงานสำหรับเจ้าหน้าที่หลังแก้ไขเสร็จ**: เมื่อเจ้าหน้าที่เปลี่ยนสถานะงานเป็น `รอยืนยันผล` ระบบเปิดหน้าต่าง `สร้าง / แก้ไขข้อมูลใบงาน (CM)` ให้อัตโนมัติ แสดงข้อมูลที่ดึงจากรายการแจ้งซ่อม/ครุภัณฑ์ (รวม `ชั้น`, `S/N`, `ครุภัณฑ์`, `ปัญหา`, `วิธีแก้ไข`) พร้อมให้ระบุสถานะงาน วันที่ อุปกรณ์ส่งซ่อม/ทดแทน `หมายเหตุ` (`INCIDENT.หมายเหตุ`) และปุ่ม `บันทึก & พิมพ์ใบงาน (PDF)` ทันที
  - **อัปเกรดหน้า Settings → แม่แบบใบงาน (`#itsdSettingsReport`)**: เพิ่มการอัปโหลด/คืนค่าโลโก้หัวใบงาน (`uploadServiceReportLogo` / `clearServiceReportLogo`), ปุ่มเติมค่ามาตรฐาน CM, ปุ่มพิมพ์ตัวอย่าง และ Live A4 Preview แบบเรียลไทม์

## V1.1.61 — 2026-11-11
- **Cardless Equipment Form Group Headings**: นำกรอบ Card และสีพื้นหลังย่อยออกจากกลุ่มฟิลด์ในหน้าต่าง `แก้ไขข้อมูลทั่วไป`, `แก้ไขคุณลักษณะ` และ `เพิ่มอุปกรณ์` (`.asset-compact-section`) โดยใช้หัวข้อขนาดใหญ่ตัวหนา (`15.5px` Desktop / `16px` Mobile) และระยะห่างกลุ่มที่เรียบง่ายสะอาดตาแทน

## V1.1.60 — 2026-11-11
- **Single-Screen Compact Equipment Edit Dialog**:
  - **จัดระเบียบหน้าต่าง `แก้ไขข้อมูลทั่วไป` และ `เพิ่มอุปกรณ์` ให้พอดีหน้าเดียวโดยไม่ต้องเลื่อน Scroll บน Desktop**: ปรับ `.modal-box:has(.asset-compact-form)` กว้าง `980px`, จัดกลุ่ม **ข้อมูลอุปกรณ์** เป็น Grid 4 คอลัมน์ (2 แถวโดยช่อง **เลขครุภัณฑ์** กว้าง 2 ช่อง), จัดกลุ่ม **ผู้รับผิดชอบและหน่วยงาน** และ **สถานที่ติดตั้ง** อย่างละ 1 แถว (3 คอลัมน์), ลดระยะห่าง (`padding`, `gap`, `margin`, input height `32px`) และ Refactor ด้วย Shared Helpers (`assetSectionHtml_`, `assetGeneralSectionsHtml_`, `assetSpecsSectionHtml_`, `bindAssetEditorDirty_`) ใน `src/UI_Client.html` + `src/UI_Styles.html` (วัดผลใน Chrome Headless ได้ความสูง Modal `475px`, `needsScroll: false`)

## V1.1.59 — 2026-11-11
- **Project Header Rewrite & Unified Project Infrastructure Alignment**:
  - **Rewrite Header ทุกไฟล์ Source Code (`src/*.js`, `src/*.html`)**: ปรับชื่อโครงการใน Header เป็น **`ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)`** พร้อมปรับค่า Default Branding ใน `Server.js`, `UI_Client.html` และ `Index.html` ให้ตรงกัน
  - **ADMIN Customizable Project Name**: ยืนยันการทำงานของเมนู **ตั้งค่าระบบ** (`saveAdminSettings`) ให้ `ADMIN` สามารถเปลี่ยน `ชื่อโครงการ / ชื่อระบบ`, `ชื่อย่อ` และ `คำอธิบาย` ได้เองตลอดเวลา พร้อมอัปเดตค่าใน `DBS_ITSD` (`APP_SETTINGS`) ทันที
  - **Google Drive & `DBS_ITSD` Folder Sync**: สร้างโฟลเดอร์ `System Assets` (`1Y3V-YsmPBZyRDHPEZoJW3Y-jn32Vq_et`) ภายใต้โฟลเดอร์ `ITSD` (`1fy0Th9kkrcSdfJciTn_C15OMWHkSvOtk`) และอัปเดต `APP_SETTINGS` ใน `DBS_ITSD` (`1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs`) ให้ชี้ไปยังโฟลเดอร์ `Backup Files`, `Documents`, `Pictures` และ `System Assets` ที่ใช้งานได้จริงครบทุกตัว
  - **Full GitHub Documentation Suite**: จัดทำและอัปเดต [`README.md`](./README.md), [`MANUAL_USER.md`](./MANUAL_USER.md), [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) และ [`DATA_DIAGRAM_AND_WORKFLOW.md`](./DATA_DIAGRAM_AND_WORKFLOW.md) (ER Diagram 26 ตาราง + Workflows หลักทั้งระบบ)

## V1.1.54 — 2026-11-11
- **Modular Equipment Tabs & Independent Section Saving (ปรับหน้าต่าง/แถบรายละเอียดอุปกรณ์แยกแท็บและแยกบันทึกตามแท็บ)**:
  - **จัดเรียงลำดับแท็บใหม่ตามที่ระบุ**:
    1. **ข้อมูลทั่วไป (General Information)**: แสดงข้อมูลพื้นฐานอุปกรณ์ ผู้รับผิดชอบ หน่วยงาน และสถานที่ติดตั้ง พร้อมปุ่ม `แก้ไขข้อมูลทั่วไป`
    2. **คุณลักษณะ (Technical Specifications)**: แสดงข้อมูลสเปกทางเทคนิค (OS, CPU, Speed, RAM, Harddisk, IP Address) พร้อมปุ่ม `แก้ไขคุณลักษณะ`
    3. **การสำรวจ (Inspection / Survey)**: แสดงผลการตรวจเช็กและสถานะตรวจสอบครุภัณฑ์ พร้อมปุ่ม `แก้ไขข้อมูลการสำรวจ`
    4. **ประวัติแจ้งซ่อม (Ticket History)**: แสดงรายการประวัติการแจ้งซ่อมของอุปกรณ์ชิ้นนี้
  - **แยกการทำงานและบันทึกแยกส่วนอย่างเป็นอิสระ (Decoupled Modular Saving)**:
    - **แท็บข้อมูลทั่วไป**: หน้าต่าง Modal แก้ไขเฉพาะข้อมูลอุปกรณ์ ข้อมูลหน่วยงาน และสถานที่ติดตั้ง โดยคงค่าคุณลักษณะเดิมไว้ไม่ให้สูญหาย
    - **แท็บคุณลักษณะ**: หน้าต่าง Modal แก้ไขเฉพาะคุณลักษณะทางเทคนิคทั้ง 6 ฟิลด์ และบันทึกผ่าน API `specs_only` โดยไม่รบกวนข้อมูลทั่วไป
    - **แท็บการสำรวจ**: หน้าต่าง Modal แก้ไขเฉพาะข้อมูลการสำรวจและบันทึกผ่าน API `survey_only` อย่างอิสระ
    - **การแจ้งเตือนและการตอบสนอง**: ปรับ Toast Notification และการแสดงผลให้ระบุการบันทึกแต่ละส่วนอย่างชัดเจน เช่น `บันทึกข้อมูลทั่วไปสำเร็จ`, `บันทึกคุณลักษณะสำเร็จ`, `บันทึกข้อมูลการสำรวจแล้ว`

## V1.1.53 — 2026-11-11
- **Clay and Sea Complete Theme Overhaul (นำกลุ่มชุดสี Clay and Sea ออกแบบใช้งานทั้งระบบ)**:
  - **ชุดสีหลัก 5 สี (Clay and Sea 5-Color Harmony)**:
    1. **Terracotta Clay (`#C7522A`)**: สีดินเผา ใช้เป็น Primary Accent สำหรับปุ่มดำเนินการหลัก (CTA), Active states, Brand typography, และไฮไลต์สำคัญ
    2. **Warm Sand Clay (`#E5C185`)**: สีดินทรายอบอุ่น ใช้สำหรับสถานะรอดำเนินการ (Pending/In Progress), เส้นขอบรอง และแถบเน้นข้อความ
    3. **Vanilla Buttercream (`#FBF2C4`)**: สีครีมนุ่มละมุน ใช้สำหรับพื้นผิว Tooltips, การ์ดข้อมูลพิเศษใน Light Mode, และป้ายเตือนแบบ Soft Warmth
    4. **Sage Seafoam (`#74A892`)**: สีเขียวเสจผิวน้ำทะเล ใช้สำหรับสถานะสำเร็จ (Resolved/Complete/Success), ตัวชี้วัดระบบ และสถิติที่เสร็จสมบูรณ์
    5. **Deep Sea Teal (`#008585`)**: สีเขียวอมฟ้าห้วงทะเลลึก ใช้สำหรับโครงสร้างหลักของหน้าต่าง, หัวตาราง (Table Header), เส้นแบ่งหัวเว็บ และ Badge สถิติ
  - **พื้นหลังและมิติ (Backgrounds & Surfaces)**:
    - **Dark Mode / Sidebar**: ใช้สีน้ำเงินทะเลลึก Abyssal Ocean (`#061D22`) และ Deep Sea Navy (`#0B2B30`) ไล่เฉดสีอย่างกลมกลืน
    - **Light Mode**: ใช้พื้นหลังโทนทรายนวลตา Warm Sand Mist (`#FAF7EE`) ลดอาการเมื่อยล้าสายตาและให้ความรู้สึกอบอุ่นระดับพรีเมียม
    - **Continuous Header Line**: เส้นแบ่งหัว Webapp เชื่อมต่อเรียบเนียนระดับ $y = 68\text{px}$ ด้วยสีประกาย Deep Sea Teal (`rgba(0, 133, 133, 0.3)`)
  - **การคงสภาพความปลอดภัย**:
    - ปุ่มออกจากระบบและออกจากหน้าจอ (Sign out / Logout / Exit) ยังคงใช้ **สีแดงบริสุทธิ์ (`#EF4444` / `#DC2626`)** อย่างเคร่งครัดตามมาตรฐานความปลอดภัย

## V1.1.52 — 2026-11-10
- **Equipment Registry & Modal Close Button Overhaul (ปุ่มปิดหน้าต่าง/ลิ้นชัก ทะเบียนอุปกรณ์)**:
  - **สถานะปกติ (Normal)**: ปรับพื้นหลังวงกลมเป็น **สีน้ำเงิน สว่าง (`#2563eb`)** พร้อมไอคอนกากบาทสีขาวบริสุทธิ์ (`#ffffff`) กึ่งกลางวงกลม 100% สอดคล้องกับโทนสีปุ่มการทำงานของระบบ
  - **เมื่อนำเมาส์มาชี้ (Hover / Focus)**:
    - **ใน Dark Mode**: เปลี่ยนเป็น **สีขาวสว่าง (`#ffffff`)** พร้อมแสงเรืองรอบปุ่ม (`box-shadow: 0 0 20px rgba(255, 255, 255, 0.9)`) และไอคอนกากบาทสีน้ำเงินเข้ม คอนทราสต์ชัดเจนมองเห็นง่าย
    - **ใน Light Mode**: เปลี่ยนเป็น **สีสว่างตาม Theme Color** (ไล่เฉดสีส้มเหลืองสดใส `linear-gradient(135deg, #ffc92e, #fa7737)`) ตามชุดสี Style 5 Orange Energy
  - **คงสีแดงสำหรับปุ่มออกจากหน้าจอ (Sign out / Logout / Exit Buttons)**:
    - ปุ่มออกจากระบบและปุ่มออกจากหน้าจอ (`.danger`, `button.danger`, `.ux124-logout`, `.sidebar-signout`, `admin39LogoutAll`) ยังคงใช้ **สีแดงเด่นชัด (`#ef4444` / `#fee2e2` / `#dc2626`)** ตลอดเวลา ไม่ถูกทับด้วยสีน้ำเงิน

## V1.1.51 — 2026-11-09
- **Continuous Straight Header Alignment with System Logo (เส้นแบ่งหัว Webapp เป็นแนวเส้นตรงเดียวกันกับ icon ระบบ Sidebar)**:
  - Synchronized the Webapp header (`.topbar`) and sidebar brand header (`.brand`) to share the exact same standardized height (`--topbar-height: 68px`).
  - Unified the dividing bottom border (`border-bottom: 1px solid rgba(250, 119, 55, 0.35) !important; box-sizing: border-box !important; margin: 0 !important;`) across both `.brand` and `.topbar`, creating an unbroken, perfectly continuous horizontal straight line at $y = 68\text{px}$ from the left edge of the sidebar across to the right edge of the topbar.
  - Aligned the bottom dividing line cleanly right beneath the system logo icon (`.brand .logo`), matching the yellow line reference geometry.
  - Ensured both expanded and collapsed sidebar states (`.sidebar.is-collapsed .brand`) maintain the exact same height and border alignment without any stepping or vertical offset.
  - Cleaned up legacy conflicting styles (`82px`, `80px`) across the CSS cascade to guarantee a single consistent source of truth.

## V1.1.50 — 2026-11-09
- **Bright Luminous Selection for All Status & Action Icons (พื้นหลังสว่างรอยืนยันคลิกเลือก)**:
  - Applied crisp, high-contrast bright circular background highlights when hovering or focusing across:
    - Close cross buttons (`.ux-drawer-close`, `.modal-head button`, `.ocpb-import-close`, `.admin36-detail-head button`).
    - Light / Dark Mode toggles (`#themeToggle`, `.mode-toggle`).
    - Notifications bell toggle (`#uxNotificationButton`, `.top-icon-button`).
    - Theme Palette cycle button (`#paletteToggle`, `.palette-toggle`).
    - Sidebar collapse & mobile menu toggles (`.sidebar-collapse`, `.mobile-menu`).
    - Password visibility toggle (`.login48-password-toggle`).
  - **Dark Mode**: When hovered or focused, the button illuminates with a bright white circular background (`#ffffff`), glowing halo (`box-shadow: 0 0 18px rgba(255, 255, 255, 0.65)`), and vivid Energy Orange icon (`#fa7737`), giving unmistakable visual confirmation.
  - **Light Mode**: Highlights with a clean white circle, prominent orange outline (`0 0 0 2px #fa7737`), and deep shadow.
  - Active pressed state: subtle scale (0.94) and warm peach tint.

## V1.1.49 — 2026-11-09
- **Precision Centering of Close & Icon Buttons (กากบาทอยู่กึ่งกลางสมบูรณ์ 100%)**:
  - Eliminated the 4px horizontal offset caused by legacy `button .material-symbols-rounded { margin-right: 4px; }` across all icon buttons.
  - Implemented geometric grid-centered layout (`display: inline-grid !important; place-items: center !important;`) for both `.ux-drawer-close` and all circular icon buttons.
  - Explicitly reset icon child dimensions and margins (`width: 20px; height: 20px; margin: 0 !important; font-size: 20px; line-height: 20px;`) ensuring mathematical subpixel centering across Retina and standard displays.
- **Theme Color Integration (พื้นหลังและสีปุ่มอ้างอิงตาม Color Theme ที่เลือก)**:
  - Button hover and active states now dynamically reference the active theme's accent color (`color-mix(in srgb, var(--theme-accent) 14%, transparent)` in light mode, `color-mix(in srgb, var(--theme-accent) 22%, transparent)` in dark mode).
  - On hover, the close icon turns into the active theme accent color (`var(--theme-accent, #fa7737)` in Orange Energy Style 5), replacing generic grey with vibrant theme-conscious styling.
  - Active/pressed state applies deeper theme tint (`color-mix(in srgb, var(--theme-accent) 26%, transparent)`) with 0.92 scale.
- **Side Drawer Header & Active Tab Theme Alignment**:
  - Aligned drawer header items to `align-items: center` for clean vertical centering between title metadata and the close button.
  - Replaced legacy blue underline (`#075de6`) on `.ui-side-tabs button.active` with `var(--theme-accent, #fa7737)` in Light Mode, perfectly matching the Orange Energy theme.
- Deployed to Google Apps Script as Version `@9`.

## V1.1.48 — 2026-11-09
- **Fixed Duplicate Close Buttons on Inventory Registry**: Resolved the issue where the equipment registry drawer (`inventorySide`) rendered two close buttons simultaneously by removing the duplicate `<button class="ghost">` and standardizing on the unified `.ux-drawer-close`.
- **Universal Circular Icon Button Interaction System**:
  - Implemented the user's reference design (Images 1, 2, 3):
    - **Normal State**: Only the icon is shown with transparent background, no borders, perfectly centered.
    - **Hover State**: Displays a dark circular hover selection ring (`border-radius: 50%`, `rgba(15, 23, 42, 0.08)` in light mode, `rgba(255, 255, 255, 0.14)` in dark mode).
    - **Active State**: Smooth scale down to 92% with deeper contrast tint.
  - Applied this interaction pattern universally across:
    - All modal, panel, and drawer close buttons (`.modal-head button`, `.ux-drawer-close`, `.ocpb-import-close`, `.admin36-detail-head button`).
    - Expand / Collapse / Menu toggles (`.sidebar-collapse`, `.mobile-menu`).
    - More options actions (`.admin36-role-more`, `.top-icon-button`, `#themeToggle`, `.palette-toggle`, `.mode-toggle`).
    - Password visibility toggle (`.login48-password-toggle`).
- Deployed to Google Apps Script as Version `@8`.

## V1.1.47 — 2026-11-09
- **Password Eye Icon Toggle**: Configured `visibility_off` as the default icon for password input when masked. Clicking changes to `visibility` (open eye) and reveals password in plaintext; clicking again reverts to `visibility_off` and masks password.
- **Top Line Continuous Alignment (ตรงตำแหน่งเส้นเหลือง)**: Perfectly aligned the bottom border of `.brand` and `.topbar` at identical heights (`var(--topbar-height)`) with matching `rgba(250, 119, 55, 0.3)` border separators across the entire screen width, eliminating vertical offsets between the sidebar header and topbar.
- **Sidebar Theme 5 (Orange Energy)**: Replaced legacy royal blue with Style 5 Orange Energy palette:
  - Sidebar Brand Logo: `linear-gradient(135deg, #FA7737, #FFC92E)` with white icon.
  - Active Menu Buttons: `linear-gradient(90deg, #FA7737, #EA580C)` with Golden Amber `#FFC92E` left border accent.
  - Menu Hover States: warm orange glow `rgba(250, 119, 55, 0.14)` with `#FFC92E` text.
  - Section Headers: Warm Peach `#FD9E76`.
- **Role Cards & Permission Matrix Overhaul**:
  - Role Summary Cards (Admin: `#FA7737`, Manager: `#55E07E`, Technician: `#FFC92E`, ITSupport: `#FD9E76`, User: `#7E879B`).
  - Active Role Card: styled with Style 5 Orange gradient and elevated border glow.
  - Role List Active Item: replaced legacy dark blue with `linear-gradient(135deg, rgba(250, 119, 55, 0.28), rgba(234, 88, 12, 0.18))` and `#FA7737` badge.
  - Permission Matrix Table: replaced bright blue checkmarks with Orange Energy gradient badges (`linear-gradient(135deg, #FA7737, #EA580C)`).
  - Topbar Search Button: styled with Orange Energy `#FA7737` gradient and white typography.
- Deployed to Google Apps Script as Version `@7`.

## V1.1.46 — 2026-11-09
- Applied Pro Style 5: "Orange Energy" (Active • Friendly • Exciting) color palette across the entire ITSD Web App.
- Core brand palette: Primary Energy Orange (#FA7737), Golden Amber (#FFC92E), Warm Coral Peach (#FD9E76), Deep Midnight Navy (#051344), and Fresh Mint (#55E07E).
- Modernized Dashboard KPI cards with 16px border-radius, soft elevation hover, and Deep Midnight Navy contrast typography.
- Professional Midnight Navy (#051344) Enterprise sidebar navigation with glowing Energy Orange active pills and amber hover states.
- Enhanced CTA buttons with orange gradient (linear-gradient(135deg, #FA7737, #F97316)) and warm drop shadows.
- Updated COLOR_TEMPLATE.md, deployed as Apps Script Version @6, and committed to GitHub repository.

## V1.1.45 — 2026-11-09
- Verified and reconciled exact source code against the live uploaded Server bundle (Server.zip).
- Database readiness check: confirmed all 26 standard production sheets are active in DBS_ITSD (1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs).
- Security & RBAC: verified APP_ROLES, APP_ROLE_PERMISSIONS, and APP_ROLE_ACTION_PERMISSIONS.
- User authentication initialized: ADMIN, CHALOEM, MANAGER, TECHNICIAN, and ITSUPPORT set with verified SHA-256 salted credentials.
- Login screen specifications: User icon [person] for Username, Key icon [key] for Password, bidirectional eye state toggle, Patch Update badge ITSD V1.1.45, and developer credit Create by : LongZe Design.
- Deployed as Apps Script Version @4 and synced to GitHub repository.
