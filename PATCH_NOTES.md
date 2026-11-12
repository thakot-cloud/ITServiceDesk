# ITSD Patch versions

ใช้ลำดับเวอร์ชันตามที่ผู้ใช้กำหนด: V1.0.99 → V1.1.01 → V1.1.02 → … → V1.1.10 → …
เลข Patch หลังจุดสุดท้ายใช้สองหลัก เช่น 01, 02, 10

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
