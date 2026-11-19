# Project Standards & Guidelines: IT Service Desk (ITSD Enterprise Edition)

## 1. Corporate Enterprise Standard Header

ทุกไฟล์ต้นฉบับในโปรเจกต์ (ทั้งใน root, `src/` และ `Server/`) ต้องมี Header ตามมาตรฐานระดับองค์กร (Corporate Enterprise Standard) ดังนี้:

### สำหรับไฟล์ JavaScript / Google Apps Script (`.js`, `.gs`)
```javascript
/**
 * ==============================================================================
 * Project       : IT Service Desk (ITSD Enterprise Edition)
 * Script ID     : 1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7
 * Repository    : https://github.com/thakot-cloud/ITServiceDesk
 * File          : <FILENAME>
 * Module/Layer  : <MODULE / LAYER>
 * Description   : <DESCRIPTION>
 * Version       : <VERSION>
 * Author        : ITSD Engineering Team / LongZe Design
 * Created Date  : 2026-10-26
 * Last Modified : <YYYY-MM-DD>
 * License       : Proprietary / Enterprise Internal Use
 * Copyright (c) : 2026 IT Service Desk. All rights reserved.
 * ------------------------------------------------------------------------------
 * Revision History:
 * - V<VERSION> (<YYYY-MM-DD>) : <DESCRIPTION>
 * ==============================================================================
 */
```

### สำหรับไฟล์ HTML (`.html`)
```html
<!--
 * ==============================================================================
 * Project       : IT Service Desk (ITSD Enterprise Edition)
 * Script ID     : 1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7
 * Repository    : https://github.com/thakot-cloud/ITServiceDesk
 * File          : <FILENAME>
 * Module/Layer  : <MODULE / LAYER>
 * Description   : <DESCRIPTION>
 * Version       : <VERSION>
 * Author        : ITSD Engineering Team / LongZe Design
 * Created Date  : 2026-10-26
 * Last Modified : <YYYY-MM-DD>
 * License       : Proprietary / Enterprise Internal Use
 * Copyright (c) : 2026 IT Service Desk. All rights reserved.
 * ------------------------------------------------------------------------------
 * Revision History:
 * - V<VERSION> (<YYYY-MM-DD>) : <DESCRIPTION>
 * ==============================================================================
-->
```

> **ข้อควรระวังสำคัญอย่างยิ่งสำหรับไฟล์ HTML ใน Google Apps Script**:
> ห้ามใส่คำว่า `<script>` หรือ `</script>` ลงในข้อความ Comment หรือ Template String ใดๆ ในไฟล์ HTML เพราะตัวแปลง `HtmlService.createTemplateFromFile()` ของ Apps Script จะเข้าใจผิดว่าเป็นการปิดแท็ก Script จริง และจะตัดคำสั่งทำให้เกิดข้อผิดพลาดรุนแรง `Exception: เนื้อหา HTML มีรูปแบบไม่ถูกต้อง` ทันที

---

## 2. โครงสร้างไฟล์และโมดูล (Module / Layer Mapping)

| ไฟล์ | Module / Layer | คำอธิบาย |
| :--- | :--- | :--- |
| **`Api.js`** (`Server/Api.gs`, `src/Api.js`) | `API / Facade & Public Entrypoint Compatibility Layer` | อินเทอร์เฟซสาธารณะและ Compatibility Facade สำหรับเรียกใช้งานฟังก์ชันของระบบผ่าน WebApp และไคลเอนต์ |
| **`Entrypoints.js`** (`Server/Entrypoints.gs`, `src/Entrypoints.js`) | `Controller / HTTP Entrypoints & OAuth Callback Handler` | จุดเริ่มต้นการประมวลผล Web Application (doGet) และจัดการ LINE Login OAuth 2.0 Callback Flow |
| **`Server.js`** (`Server/Server.gs`, `src/Server.js`) | `Backend / Core Services, Platform Adapters & Data Repository` | การทำงานระบบหลัก สิทธิ์ผู้ใช้ ฐานข้อมูลชีต บันทึกประวัติ และการจัดการตั๋วแจ้งซ่อมและครุภัณฑ์ |
| **`Index.html`** (`Server/Index.html`, `src/Index.html`) | `Frontend / Web Application Shell & Main Layout` | โครงสร้างหน้าเว็บหลักของระบบ (Single Page Application Shell), ฟอร์มเข้าสู่ระบบ และการโหลด Asset |
| **`UI_Client.html`** (`Server/UI_Client.html`, `src/UI_Client.html`) | `Frontend / Client Controller & UI State Management` | ตัวควบคุมฝั่งผู้ใช้งาน (Client Controllers), การเรนเดอร์หน้าจอ, ระบบแคช SWR และการนำเข้า/ส่งออกข้อมูล |
| **`UI_Styles.html`** (`Server/UI_Styles.html`, `src/UI_Styles.html`) | `Frontend / Design Tokens & Unified Stylesheet` | สไตล์ชีตหลักของระบบ Unified Dark/Light Mode, ดีไซน์โทเคน, ฟอร์มสติ๊กเกอร์ และเลย์เอาต์การพิมพ์ |
| **`UI_Templates.html`** (`Server/UI_Templates.html`, `src/UI_Templates.html`) | `Frontend / Reusable UI Templates & Components` | แม่แบบส่วนประกอบ UI สำเร็จรูปสำหรับการแสดงผลข้อมูลในระบบ |

---

## 3. กฎการซิงค์ไฟล์ 3 ตำแหน่ง (Three-Directory Synchronization)

เมื่อมีการแก้ไขไฟล์ใน root directory ต้องซิงค์การเปลี่ยนแปลงไปยังโฟลเดอร์ต่อไปนี้เสมอ:
1. `src/` (โครงสร้างและนามสกุลเหมือน root)
2. `Server/` (ไฟล์ `.js` ใน root จะแปลงเป็นนามสกุล `.gs` ใน `Server/`)

คำสั่งซิงค์มาตรฐาน:
```bash
cp Api.js src/Api.js && cp Api.js Server/Api.gs && \
cp Entrypoints.js src/Entrypoints.js && cp Entrypoints.js Server/Entrypoints.gs && \
cp Server.js src/Server.js && cp Server.js Server/Server.gs && \
cp Index.html src/Index.html && cp Index.html Server/Index.html && \
cp UI_Client.html src/UI_Client.html && cp UI_Client.html Server/UI_Client.html && \
cp UI_Styles.html src/UI_Styles.html && cp UI_Styles.html Server/UI_Styles.html && \
cp UI_Templates.html src/UI_Templates.html && cp UI_Templates.html Server/UI_Templates.html
```

---

## 4. มาตรฐานประสิทธิภาพ Google Apps Script (Performance Best Practices)

1. **ห้ามเรียก Spreadsheet API ใน Loop**:
   - แทนที่ `getValue()`/`setValue()` และ `appendRow()` ในลูปด้วยการสะสมข้อมูลลงใน JavaScript Array แล้วบันทึกแบบ Batch ครั้งเดียวด้วย `setValues()`
2. **ใช้ CacheService อย่างถูกต้อง**:
   - แคชข้อมูล Master Data และ Lookups ใน `SHEET_CACHEABLE_` (`APP_LOOKUPS`, `APP_SETTINGS`, `APP_USER_PROFILE`, `INVENTORY`, `INCIDENT`, `MST_ORG_UNITS`, `MST_DEVICE_MODELS`, `TICKET_SERVICE_REPORT`) โดยบีบอัดด้วย Gzip ก่อนเก็บเข้า `CacheService.getScriptCache()`
3. **ลดขนาด Payload (Minimize Payload Size)**:
   - แปลงฟิลด์สตริงว่าง `""` ให้เป็น `undefined` ใน Object สำหรับรายการจำนวนมาก เช่น `inventory` และ `tickets` เพื่อให้ `JSON.stringify` ข้ามฟิลด์ว่าง ช่วยลดขนาด Network Payload ได้มากกว่า 50%
4. **ใช้ Data Structure $O(1)$ Hash Map**:
   - จัดทำ Index ล่วงหน้าด้วย `Map` แทนการใช้ `for...in...for` หรือการเรียก `.find()` ซ้อนกันภายใน Loop
5. **Frontend Non-blocking & Client Cache**:
   - ใช้ SWR (Stale-While-Revalidate) ร่วมกับ `sessionStorage`
   - ป้องกันการยิงซ้ำด้วย Inflight RPC Cache (`READ_ONLY_RPCS_`)
   - แสดง Skeleton Loader ทันทีระหว่างรอข้อมูล

---

## 5. การ Deploy และ Release Checklist

- **Apps Script Project ID**: `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7`
- **Primary Deployment**: `AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps`
- **Secondary Deployment**: `AKfycbxNWTvHMrREz_cnmre-7GxtHJTg2-xeEw5sOnpbXqDU0o9ul80r9dgztHyO23L-axA`
- **คำสั่ง Deploy**:
  ```bash
  npx clasp push -f
  npx clasp version "<DESCRIPTION>"
  npx clasp deploy -i "AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps" -V <VERSION_NUMBER> -d "<DESCRIPTION>"
  npx clasp deploy -i "AKfycbxNWTvHMrREz_cnmre-7GxtHJTg2-xeEw5sOnpbXqDU0o9ul80r9dgztHyO23L-axA" -V <VERSION_NUMBER> -d "<DESCRIPTION>"
  ```
- **Git Push**:
  ```bash
  git add -A
  git commit -m "<CONVENTIONAL_COMMIT>"
  git push origin main
  ```
