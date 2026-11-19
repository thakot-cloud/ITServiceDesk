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

## 4. มาตรฐานประสิทธิภาพระดับองค์กรสำหรับ Web Application (Enterprise Performance Optimization Guidelines)

### 4.1 ฝั่ง Backend (Google Apps Script / Server.js / Code.gs)

#### 1. ห้ามเรียก Google Spreadsheet API ภายใน Loop โดยเด็ดขาด (Zero API Calls in Loops)
- **ข้อห้าม**: ห้ามใช้ `getValue()`, `setValue()`, `getRange()`, หรือ `appendRow()` ภายในลูป (`for`, `forEach`, `while`)
- **ผลกระทบ**: แต่ละรอบของ Spreadsheet API มี Network Latency 50–200 ms หากวน 50–100 รอบ จะทำให้คำขอกินเวลา 5–15 วินาที เสี่ยงติด Timeout 6 นาทีทันที
- **แนวทางปฏิบัติ**:
  1. ดึงข้อมูลทั้งตารางเข้าหน่วยความจำด้วย `getDataRange().getValues()` เพียงครั้งเดียว
  2. จัดการค้นหา ปรับแต่ง และรวมข้อมูลใน JavaScript Array
  3. บันทึกผลลัพธ์กลับด้วย `setValues()` เพียงรอบเดียว หรือแยก Batch แถวใหม่ด้วย `getRange(lastRow + 1, 1, newRows.length, colCount).setValues(newRows)`

#### 2. สถาปัตยกรรมแคชหลายระดับ (Multi-Layer ScriptCache & Compression)
- **ปัญหา**: การเปิด Google Spreadsheet ข้าม Request ทุกครั้งเป็นคอขวดที่ใหญ่ที่สุดใน GAS
- **แนวทางปฏิบัติ**:
  1. นำ `CacheService.getScriptCache()` มาใช้เก็บข้อมูลที่มีการอ่านบ่อยและไม่เปลี่ยนแปลงบ่อย (TTL 600 วินาที):
     - `APP_LOOKUPS`: รายการ Dropdown (ประเภทอุปกรณ์, ยี่ห้อ, ปัญหา)
     - `APP_SETTINGS`: การตั้งค่าระบบ โลโก้ และพารามิเตอร์ระบบ
     - `APP_USER_PROFILE`: ข้อมูลรูปโปรไฟล์และอีเมลผู้ใช้
     - `MST_ORG_UNITS`: โครงสร้างหน่วยงาน
     - `MST_DEVICE_MODELS`: ทะเบียนรุ่นอุปกรณ์
     - `TICKET_SERVICE_REPORT`: แม่แบบใบรายงานบริการ
  2. **Gzip Chunking**: หากข้อมูลมีขนาดใหญ่เกินขีดจำกัด 100 KB ของ CacheService ให้บีบอัดด้วย `Utilities.gzip()` แปลงเป็น Base64 และแบ่งเก็บเป็น Chunks (`_c0`, `_c1`, ...)
  3. **Instant Cache Invalidation**: เมื่อมีการ `CREATE`, `UPDATE` หรือ `DELETE` ต้องเรียก `sheetCacheInvalidate_(sheetName)` ทันทีเพื่อให้ Request ถัดไปเห็นข้อมูลล่าสุด

#### 3. การลดขนาด JSON Payload (Minimize Payload Size)
- **ปัญหา**: `google.script.run` ต้องแปลง JavaScript Object เป็น JSON String ผ่าน Network หากมีข้อมูล 2,000 แถว แถวละ 25 ฟิลด์ จะเกิด Overhead ในการ Serialize/Deserialize มหาศาล
- **แนวทางปฏิบัติ**:
  1. **Strip Empty Strings**: กำหนดค่าที่เป็นสตริงว่างให้เป็น `undefined` (เช่น `phone: x['เบอร์โทร'] || undefined`) ซึ่ง `JSON.stringify` จะข้ามคีย์ที่เป็น `undefined` โดยอัตโนมัติ ช่วยลดขนาด Network Payload ได้มากกว่า 50%
  2. **Field Selection**: เลือกเฉพาะฟิลด์ที่จำเป็นต่อการแสดงผลในหน้าแรก ไม่ส่งฟิลด์ละเอียดสำหรับ Modal ลงมาในรายการตาราง
  3. **Workflow Status Memoization**: ใน `ticketPayload_` ให้ทำ In-Memory Memoization สำหรับ `statusTargetsFor_` เพื่อคำนวณสิทธิ์การเปลี่ยนสถานะของแต่ละสถานะเพียงครั้งเดียว ไม่ต้องคำนวณซ้ำทุกแถวของตั๋วแจ้งซ่อม

#### 4. โครงสร้างข้อมูล $O(1)$ Hash Map แทน $O(N \times M)$ Nested Loops
- **ปัญหา**: การใช้ `.find()` หรือ `.filter()` ซ้อนในลูป ส่งผลให้ความซับซ้อนของขั้นตอนวิธีกลายเป็น $O(N \times M)$ หรือ $O(N^2)$
- **แนวทางปฏิบัติ**:
  1. จัดทำ Index ล่วงหน้าด้วย `Map` หรือ `Set` สำหรับข้อมูลความสัมพันธ์ เช่น `roleCode + ':' + moduleCode`
  2. ดึงข้อมูลผ่าน `map.get(key)` ด้วยประสิทธิภาพ $O(1)$

---

### 4.2 ฝั่ง Frontend (HTML / JavaScript / UI_Client.html)

#### 1. Non-blocking UI & Asynchronous Data Fetching
- **Shell-First Rendering**: แสดงผลโครงสร้างหลักของหน้าเว็บ (Topbar, Sidebar, Breadcrumb) ทันทีตั้งแต่โหลดหน้า โดยไม่ต้องรอข้อมูลจากเซิร์ฟเวอร์
- **Skeleton Loaders**: แสดง Animation Placeholder (`renderSkeletonLoader_()`) ทันทีระหว่างรอ `getBootstrap` หรือคำขอทางไกล เพื่อให้ผู้ใช้รับรู้ว่าระบบกำลังทำงาน ไม่เกิดอาการหน้าขาวค้าง
- **SWR (Stale-While-Revalidate)**:
  1. ดึงข้อมูลล่าสุดจาก `sessionStorage` มาเรนเดอร์หน้าจอทันทีใน 0 วินาที
  2. ยิงคำขอเบื้องหลังเพื่อตรวจสอบข้อมูลใหม่
  3. หากพบความเปลี่ยนแปลง จึงอัปเดตหน้าจอและเขียนทับแคช

#### 2. Client-Side RPC Inflight Deduplication
- ป้องกันปัญหาผู้ใช้คลิกแท็บหรือกดปุ่มซ้ำรัวๆ ด้วย Inflight Promise Cache (`INFLIGHT_RPC_`):
  ```javascript
  if (isRead && INFLIGHT_RPC_[rpcKey]) return INFLIGHT_RPC_[rpcKey];
  ```
- เพิ่มรายชื่อฟังก์ชันอ่านข้อมูลทั้งหมดลงใน `READ_ONLY_RPCS_` เพื่อป้องกันการส่งคำขอคู่ขนานซ้ำซ้อน

#### 3. ป้องกัน Layout Thrashing และเรนเดอร์แบบ Batch DOM
- **ห้าม**: ห้ามทำการสร้าง Element แล้วสั่ง `appendChild()` ทีละแถวในลูป เพราะบราวเซอร์จะต้อง Reflow/Repaint ใหม่ทุกครั้ง
- **แนวทางปฏิบัติ**:
  1. สะสมโครงสร้าง HTML เป็นสตริงก้อนเดียว หรือใช้ `DocumentFragment`
  2. ทำการ Assign ลง DOM เพียงครั้งเดียวผ่าน `container.innerHTML = htmlString`
  3. ใช้ Client-side Pagination (แบ่งหน้าละ 10, 25, 50 รายการ) แทนการวาด DOM พร้อมกันหลักพันรายการ
  4. ใช้ Debounce Function (`debounceCall_`) สำหรับ Input Search เพื่อหน่วงเวลา 150–300 ms ก่อนเริ่มค้นหา

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
