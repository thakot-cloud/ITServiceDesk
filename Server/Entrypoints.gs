/**
 * ==============================================================================
 * Project       : IT Service Desk (ITSD Enterprise Edition)
 * Script ID     : 1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7
 * Repository    : https://github.com/thakot-cloud/ITServiceDesk
 * File          : Entrypoints.gs
 * Module/Layer  : Controller / HTTP Entrypoints & OAuth Callback Handler
 * Description   : จุดเริ่มต้นการประมวลผล Web Application (doGet) และจัดการ LINE Login OAuth 2.0 Callback Flow
 * Version       : 1.2.12
 * Author        : ITSD Engineering Team / LongZe Design
 * Created Date  : 2026-10-26
 * Last Modified : 2026-11-19
 * License       : Proprietary / Enterprise Internal Use
 * Copyright (c) : 2026 IT Service Desk. All rights reserved.
 * ------------------------------------------------------------------------------
 * Revision History:
 * - V1.2.12 (2026-11-19) : Standardized source code header to Corporate Enterprise Standard
 * - V1.2.09: Support LINE Login OAuth callback handling in doGet(e).
 * - V1.2.08: Version bump for Thai holidays and ITSUPPORT role badge.
 * - V1.2.06: Version bump for step numbers bright green styling.
 * - V1.2.05: Inline title and description on single line for แจ้งซ่อมใหม่ (แจ้งซ่อมใหม่ : กรอกข้อมูลเพื่อแจ้งปัญหาให้ทีมงานตรวจสอบและแก้ไข).
 * - V1.2.04: Version bump for Google Sites iframe embedding support.
 * - V1.2.03: Style Choose File button with blue pill capsule and align desktop file upload with action buttons.
 * - V1.2.02: Version bump for compact ticket detail fields and file upload zone.
 * - V1.2.01: Version bump for LINE inbox UI improvements.
 * - V1.2.00: Version bump for forgot password email verification.
 * - V1.1.99: Version bump for circular social login buttons.
 * - V1.1.69: Align entrypoint metadata with the secured License integration release.
 * - V1.1.68: Align release metadata with the verified production project.
 * - V1.1.59: Rewrite project header to ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที) and unify project/Drive/DB bindings.
 * - V1.0.79: Purchase fiscal-year dropdown 2560-2580; retain all verified V1.0.78 fixes.
 * - V1.0.78: LINE review editor, assetless tickets, themed messages and Thai PM period controls.
 * - V1.0.77: Inventory dropdowns and automatic asset-number formats.
 * - V1.0.76: Modular production structure with compatible public APIs.
 * - /
 * ==============================================================================
 */
function doGet(e) { return itsdImpl_doGet_.apply(this, arguments); }
function doPost(e) { return itsdImpl_doPost_.apply(this, arguments); }
