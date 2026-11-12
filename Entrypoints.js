/**
 * Project: IT Service Desk : ระบบแจ้งซ่อม บริหารจัดการงานครุภัณฑ์
 * File: Entrypoints.js
 * Version: V1.1.74
 * Stage: production
 * Purpose: Web application and LINE HTTP entrypoints
 * Notes:
 * - No secrets in source code
 * - Preserve existing data and backward compatibility
 * - Project name is customizable via Admin -> System Settings (APP_SETTINGS)
 * Modified: 2026-11-12
 * Change History:
 * - V1.1.69: Align entrypoint metadata with the secured License integration release.
 * - V1.1.68: Align release metadata with the verified production project.
 * - V1.1.59: Rewrite project header to ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที) and unify project/Drive/DB bindings.
 * - V1.0.79: Purchase fiscal-year dropdown 2560-2580; retain all verified V1.0.78 fixes.
 * - V1.0.78: LINE review editor, assetless tickets, themed messages and Thai PM period controls.
 * - V1.0.77: Inventory dropdowns and automatic asset-number formats.
 * - V1.0.76: Modular production structure with compatible public APIs.
 */
function doGet() { return itsdImpl_doGet_.apply(this, arguments); }
function doPost(e) { return itsdImpl_doPost_.apply(this, arguments); }
