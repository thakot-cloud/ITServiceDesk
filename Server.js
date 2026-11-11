/**
 * Project: ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)
 * File: Server.js
 * Version: V1.1.64
 * Stage: production
 * Purpose: Private runtime, feature services and platform adapters
 * Notes:
 * - No secrets in source code
 * - Preserve existing data and backward compatibility
 * - Project name is customizable via Admin -> System Settings (APP_SETTINGS)
 * Modified: 2026-11-11
 * Change History:
 * - V1.1.64: Add shared ticketApplyDevicePatch_ helper so both changeStatus and saveServiceReportDetails can update asset_id, asset_no, brand, model, serial, and device cleanly from Inventory lookups or edits.
 * - V1.1.60: Compact single-screen modal layout for Equipment General Edit & Create dialogs (multi-column groups, tightened spacing, zero vertical scroll on desktop).
 * - V1.1.59: Rewrite project header & branding defaults to ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที); keep ADMIN project-name customization via System Settings.
 * - V1.1.58: Synchronized deployment across both Script IDs, modular equipment drawer & separate saving per tab (ข้อมูลทั่วไป, คุณลักษณะ, การสำรวจ, ประวัติแจ้งซ่อม), database resilience fallback.
 * - V1.1.54: Modular equipment drawer & separate saving per tab - ordered: ข้อมูลทั่วไป, คุณลักษณะ, การสำรวจ, ประวัติแจ้งซ่อม with dedicated independent edit modals and save endpoints (saveInventorySpecs_ & details preservation).
 * - V1.1.53: Complete Clay and Sea theme overhaul across entire ITSD Web App - Terracotta Clay (#C7522A), Warm Sand (#E5C185), Buttercream (#FBF2C4), Sage Seafoam (#74A892), Deep Sea Teal (#008585), and Abyssal Deep Sea (#061D22 / #0B2B30).
 * - V1.1.52: Equipment registry & modal close buttons upgraded to vibrant bright blue circular base with luminous white hover in dark mode and bright theme hover in light mode; sign out / exit screen buttons strictly retain red.
 * - V1.1.51: Continuous horizontal header line alignment - standardized --topbar-height to 68px, synchronized .brand and .topbar border-bottom across sidebar and topbar, matching the system logo horizontal level.
 * - V1.1.50: Bright luminous circular selection hover for all status and action icons (close cross, light/dark mode, notifications, palette) awaiting click confirmation.
 * - V1.1.49: Precision centering of circular icon buttons (removed 4px margin-right offset), themed hover & active states referencing active theme accent (Orange Energy Style 5), and theme-synchronized active tab underline.
 * - V1.1.48: Fixed duplicate close buttons in Inventory registry drawer, unified all modal/panel/drawer close and icon-action buttons to circular centered icons with dark circular hover selection.
 * - V1.1.47: Password eye toggle fix (visibility_off default), top continuous line alignment matching user reference, and Style 5 (Orange Energy) role & status cards overhaul.
 * - V1.1.46: Apply Pro 5 Orange Energy design system across Web App, dashboard cards, sidebar, and buttons.
 * - V1.1.45: Production readiness verification, RBAC check, password sync, and automated deployment.
 * - V1.1.44: Validate and canonicalize inventory brands and models from MST_DEVICE_MODELS.
 * - V1.1.43: Keep save-result messages above dialogs and surface inventory save errors inside the editor.
 * - V1.1.42: Remove the service-report KPI top accent strips and strengthen card borders.
 * - V1.1.41: Apply the requested status-card palette across tracking, reports, survey and admin summaries.
 * - V1.1.40: Swap the closed-ticket and closure-rate dashboard card colors.
 * - V1.1.39: Enlarge dashboard summary typography and apply the five requested KPI background colors.
 * - V1.1.38: Apply a single soft focus border to form fields throughout the Web App.
 * - V1.1.37: Align runtime version with deployment and remove the duplicate Login focus frame.
 * - V1.1.35: Restore neutral theme surfaces by removing the global cyan card override.
 * - V1.1.34: Restore card colors and reduce repeated passes in Sheets, dashboard and survey summaries.
 * - V1.0.97: LINE Inbox source marker is no longer appended to ticket descriptions; legacy markers remain recoverable.
 * - V1.0.96: Client-only Thai labels for inventory statuses; database values remain canonical English codes.
 * - V1.0.79: Inventory survey report with status filters, progress summaries and permission-checked exports.
 * - V1.0.79: Purchase fiscal-year dropdown 2560-2580; retain all verified V1.0.78 fixes.
 * - V1.0.78: LINE review editor, assetless tickets, themed messages and Thai PM period controls.
 * - V1.0.77: Inventory dropdowns and automatic asset-number formats.
 * - V1.0.76: Modular production structure with compatible public APIs.
 */
// apps/webapp/src/server/app/release.js
const APP_VERSION = 'V1.1.64';

// apps/webapp/src/server/platform/environment.js
const DB_ID =
  PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') ||
  '1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs';

// apps/webapp/src/server/platform/environment.js
const TZ = PropertiesService.getScriptProperties().getProperty('ITSD_TIMEZONE') || 'Asia/Bangkok';

// apps/webapp/src/server/platform/sheets/schema.js
const COL = {
  INVENTORY: [
    'รหัสอุปกรณ์',
    'ประเภทอุปกรณ์',
    'ยี่ห้อ',
    'รุ่น',
    'หมายเลขซีเรียล',
    'เลขครุภัณฑ์',
    'หมายเลขสินทรัพย์',
    'ปีงบประมาณที่จัดซื้อ',
    'ชื่อผู้รับผิดชอบ',
    'หน่วยงานหลัก',
    'หน่วยงานย่อย',
    'สถานที่ติดตั้ง',
    'ชั้น',
    'อาคาร',
    'Operating System',
    'CPU Brand',
    'CPU Speed',
    'RAM',
    'Harddisk',
    'IP Address',
    'สถานะครุภัณฑ์',
    'แอนตี้ไวรัส',
    'รูปภาพ1_URL',
    'รูปภาพ2_URL',
    'วันที่สำรวจ',
    'ผู้ตรวจสอบ',
    'สถานะตรวจสอบ',
    'หมายเหตุ',
  ],
  INCIDENT: [
    'เลขที่แจ้งปัญหา',
    'วันที่และเวลาที่แจ้ง',
    'ผู้แจ้งปัญหา',
    'เบอร์โทร',
    'อีเมล',
    'ประเภทอุปกรณ์',
    'ยี่ห้อ',
    'รุ่น',
    'หมายเลขซีเรียล',
    'เลขครุภัณฑ์',
    'รายละเอียดคำขอ / อาการเสีย',
    'หน่วยงานหลัก',
    'หน่วยงานย่อย',
    'ระดับความเร่งด่วน',
    'ช่องทางรับแจ้ง',
    'ผู้รับแจ้ง',
    'วันที่และเวลาเข้าแก้ไข',
    'ประเภทปัญหาการแจ้งซ่อม',
    'รายละเอียดการดำเนินงาน / วิธีแก้ไข',
    'ผู้ดำเนินการ',
    'วันที่และเวลาแก้ไขเสร็จ',
    'สถานะการแจ้งซ่อม',
    'หมายเหตุ',
    'เอกสารแนบ',
    'OrgUnitID',
  ],
  APP_USERS: [
    'user_id',
    'username',
    'display_name',
    'role',
    'password_salt',
    'password_hash',
    'active',
    'failed_count',
    'locked_until',
    'created_at',
  ],
  APP_SESSIONS: ['token_hash', 'user_id', 'expires_at', 'revoked'],
  INCIDENT_META: [
    'ticket_id',
    'asset_id',
    'assigned_to',
    'confirmed_by',
    'confirmed_at',
    'closed_at',
    'reopen_count',
    'cancel_reason',
    'updated_at',
  ],
  INCIDENT_EVENTS: [
    'event_id',
    'ticket_id',
    'from_status',
    'to_status',
    'actor_id',
    'event_at',
    'note',
  ],
  INCIDENT_FILES: [
    'file_id',
    'ticket_id',
    'drive_file_id',
    'file_name',
    'mime_type',
    'uploaded_by',
    'uploaded_at',
    'kind',
  ],
  APP_SETTINGS: ['key', 'value'],
  APP_USER_PROFILE: [
    'profile_id',
    'user_id',
    'email',
    'telephone',
    'position',
    'department_id',
    'org_unit_id',
    'picture_file_id',
    'picture_url',
    'active',
    'updated_at',
    'updated_by',
  ],
  APP_ROLES: [
    'role_id',
    'role_code',
    'role_name',
    'description',
    'active',
    'sort_order',
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
  ],
  APP_ROLE_PERMISSIONS: [
    'permission_id',
    'role_code',
    'module_code',
    'module_name',
    'can_view',
    'can_create',
    'can_edit',
    'can_delete',
    'can_export',
    'can_manage',
    'active',
    'updated_at',
    'updated_by',
  ],
  APP_ROLE_ACTION_PERMISSIONS: [
    'permission_id',
    'role_key',
    'module_key',
    'action_key',
    'action_name',
    'is_allowed',
    'scope_rule',
    'is_system_required',
    'updated_at',
    'updated_by',
    'note',
  ],
  APP_AUDIT_LOG: [
    'audit_id',
    'event_at',
    'actor_user_id',
    'actor_username',
    'action',
    'module_code',
    'entity_type',
    'entity_id',
    'result',
    'detail',
    'client_info',
    'session_ref',
  ],
};

// apps/webapp/src/server/features/tickets/ticket-workflow.js
const STATUS = Object.freeze([
  'แจ้งเรื่อง',
  'รับแจ้ง',
  'มอบหมาย',
  'กำลังดำเนินการ',
  'รอยืนยันผล',
  'ปิดงาน',
]);

// apps/webapp/src/server/features/master-data/lookup-defaults.js
const TYPES = [
  'ปัญหาด้านฮาร์ดแวร์',
  'ปัญหาด้านซอฟต์แวร์',
  'ปัญหาด้านเครือข่าย',
  'ปัญหาด้านบัญชีผู้ใช้และการเข้าถึง',
  'ปัญหาด้านความปลอดภัยและแอนตี้ไวรัส',
  'ปัญหาด้านการบำรุงรักษาและการอัปเดต',
  'คำขอสนับสนุนด้านเทคนิค',
  'อื่นๆ',
];

// apps/webapp/src/server/features/master-data/lookup-defaults.js
const PRIORITIES = Object.freeze([
  'ปกติ (Normal)',
  'ต่ำ (Low)',
  'ปานกลาง (Medium)',
  'สูง (High)',
  'วิกฤต (Critical)',
]);

// apps/webapp/src/server/shared/validation.js
const SECURITY_LIMITS = Object.freeze({
  TOKEN: 512,
  USERNAME: 30,
  PASSWORD: 128,
  DISPLAY_NAME: 120,
  REPORTER: 120,
  PHONE: 40,
  DESCRIPTION: 1000,
  ASSET_ID: 80,
  DEVICE: 120,
  ORG: 180,
  CHANNEL: 60,
  STATUS_NOTE: 2000,
  RESOLUTION: 5000,
  ASSIGNEE: 120,
  FILE_ID: 220,
  FILE_NAME: 120,
  MIME: 160,
  BASE64: 15000000,
  INVENTORY_TEXT: 200,
  SETTING_VALUE: 220,
  REPORT_DATE: 10,
});

// apps/webapp/src/server/features/branding/branding-service.js
const SYSTEM_BRANDING_DEFAULTS = Object.freeze({
  project_name: 'ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)',
  short_name: 'ITSD : ITServiceDesk',
  description: 'ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที',
});

// apps/webapp/src/server/platform/drive/folder-service.js
const DRIVE_FOLDER_SETTINGS = Object.freeze({
  service_folder_id: 'Google Drive Root Folder',
  backup_folder_id: 'Google Drive Backup Files',
  documents_folder_id: 'Google Drive Documents',
  pictures_folder_id: 'Google Drive Pictures',
  system_assets_folder_id: 'Google Drive System Assets',
});

// apps/webapp/src/server/features/tickets/ticket-workflow.js
const TRANSITIONS = Object.freeze({
  แจ้งเรื่อง: Object.freeze(['รับแจ้ง']),
  รับแจ้ง: Object.freeze(['มอบหมาย']),
  มอบหมาย: Object.freeze(['กำลังดำเนินการ']),
  กำลังดำเนินการ: Object.freeze(['รอยืนยันผล']),
  รอยืนยันผล: Object.freeze(['ปิดงาน']),
  ปิดงาน: Object.freeze([]),
});

// apps/webapp/src/server/platform/sheets/sheet-repository.js
const RUNTIME_CACHE_ = { book: null, sheets: {}, headers: {}, rows: {} };

// apps/webapp/src/server/features/tickets/ticket-service.js
const TRACKING_QUEUE_STATUSES = Object.freeze([
  'แจ้งเรื่อง',
  'รับแจ้ง',
  'มอบหมาย',
  'กำลังดำเนินการ',
]);

// apps/webapp/src/server/features/tickets/ticket-service.js
const HEADERS_ = [
  'inbox_id',
  'event_id',
  'received_at',
  'group_id',
  'reporter',
  'department',
  'asset_code',
  'issue_detail',
  'raw_message',
  'parse_status',
  'review_status',
  'ticket_id',
  'message_id',
  'sender_id',
];

// apps/webapp/src/server/features/permissions/module-permissions.js
const ADMIN35_MODULES = Object.freeze([
  { code: 'DASHBOARD', name: 'แดชบอร์ด' },
  { code: 'NEW_TICKET', name: 'แจ้งซ่อมใหม่' },
  { code: 'TICKETS', name: 'รายการแจ้งซ่อม' },
  { code: 'INVENTORY', name: 'อุปกรณ์/ครุภัณฑ์' },
  { code: 'REPORTS', name: 'รายงาน' },
  { code: 'ANNOUNCEMENTS', name: 'ประกาศ' },
  { code: 'SETTINGS', name: 'ตั้งค่าระบบ' },
  { code: 'MASTER_DATA', name: 'จัดการข้อมูลหลัก' },
  { code: 'USER_MANAGEMENT', name: 'จัดการผู้ใช้' },
  { code: 'PERMISSION_MANAGEMENT', name: 'กำหนดสิทธิ์' },
  { code: 'AUDIT_LOG', name: 'ประวัติการใช้งาน' },
]);

// apps/webapp/src/server/features/permissions/module-permissions.js
const ADMIN35_ACTIONS = Object.freeze(['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT', 'MANAGE']);

// apps/webapp/src/server/features/permissions/module-permissions.js
const ADMIN35_ROLE_CODES = Object.freeze(['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT', 'USER']);

// apps/webapp/src/server/features/branding/icon-service.js
const ADMIN35_ICON_MIME = Object.freeze(['image/png', 'image/jpeg']);

// apps/webapp/src/server/features/branding/icon-service.js
const ADMIN35_ICON_SIZE = 512;

// apps/webapp/src/server/features/branding/icon-service.js
const ADMIN39_ICON_MIN_SIZE = 250;

// apps/webapp/src/server/features/users/user-service.js
const ADMIN46_USER_CREATE_COOLDOWN_MS = 5 * 60 * 1000;

// apps/webapp/src/server/features/permissions/module-permissions.js
const ADMIN35_PERMISSION_CACHE_ = { roles: null, modules: null };

// apps/webapp/src/server/features/permissions/action-permissions.js
const PERMISSION_ACTION_HEADERS_ = Object.freeze([
  'permission_id',
  'role_key',
  'module_key',
  'action_key',
  'action_name',
  'is_allowed',
  'scope_rule',
  'is_system_required',
  'updated_at',
  'updated_by',
  'note',
]);

// apps/webapp/src/server/features/permissions/action-permissions.js
var PERMISSION_ACTION_SEEDED_ = false;

// apps/webapp/src/server/features/permissions/action-permissions.js
const PERMISSION_ACTION_INDEX_ = Object.create(null);

// apps/webapp/src/server/features/permissions/action-permissions.js
const PERMISSION_LINE_ACTION_DEFAULTS_ = Object.freeze([
  [
    'PERM-ACT-047',
    'ADMIN',
    'line.inbox',
    'line.inbox.view',
    'LINE Inbox: view',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-048',
    'ADMIN',
    'line.inbox',
    'line.inbox.review',
    'LINE Inbox: review',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-049',
    'ADMIN',
    'line.inbox',
    'line.inbox.reject',
    'LINE Inbox: reject',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-050',
    'ADMIN',
    'line.inbox',
    'line.inbox.approve',
    'LINE Inbox: approve',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-051',
    'MANAGER',
    'line.inbox',
    'line.inbox.view',
    'LINE Inbox: view',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-052',
    'MANAGER',
    'line.inbox',
    'line.inbox.review',
    'LINE Inbox: review',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-053',
    'MANAGER',
    'line.inbox',
    'line.inbox.reject',
    'LINE Inbox: reject',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
  [
    'PERM-ACT-054',
    'MANAGER',
    'line.inbox',
    'line.inbox.approve',
    'LINE Inbox: approve',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'LINE review queue access',
  ],
]);

// apps/webapp/src/server/features/permissions/action-permissions.js
const PERMISSION_ACTION_DEFAULTS_ = Object.freeze([
  [
    'PERM-ACT-001',
    'ADMIN',
    'role',
    'role.manage',
    'จัดการสิทธิ์',
    'TRUE',
    'all',
    'TRUE',
    'ADMIN',
    'System required: ห้ามปิดสิทธิ์ ADMIN ทั้งหมด',
  ],
  [
    'PERM-ACT-002',
    'ADMIN',
    'permission',
    'permission.update',
    'ปรับปรุงสิทธิ์',
    'TRUE',
    'all',
    'TRUE',
    'ADMIN',
    'System required: ใช้สำหรับแก้ Matrix สิทธิ์',
  ],
  [
    'PERM-ACT-003',
    'ADMIN',
    'ticket',
    'ticket.manage_all',
    'จัดการงานทั้งหมด',
    'TRUE',
    'all',
    'TRUE',
    'ADMIN',
    'ADMIN full workflow',
  ],
  [
    'PERM-ACT-004',
    'MANAGER',
    'ticket',
    'ticket.manage_all',
    'จัดการงานทั้งหมด',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Manager can supervise ticket workflow',
  ],
  [
    'PERM-ACT-005',
    'TECHNICIAN',
    'ticket',
    'ticket.view_unassigned',
    'เห็นงานรอรับ',
    'TRUE',
    'unassigned_or_related',
    'FALSE',
    'ADMIN',
    'ให้รับงานได้โดยไม่ต้องให้ ADMIN assign ก่อน',
  ],
  [
    'PERM-ACT-006',
    'TECHNICIAN',
    'ticket',
    'ticket.accept',
    'รับงาน',
    'TRUE',
    'unassigned_or_related',
    'FALSE',
    'ADMIN',
    'รับงานเป็นตนเองเท่านั้น',
  ],
  [
    'PERM-ACT-007',
    'TECHNICIAN',
    'ticket',
    'ticket.update_status',
    'อัปเดตสถานะ',
    'TRUE',
    'related_ticket_only',
    'FALSE',
    'ADMIN',
    'จำกัดเฉพาะงานที่รับผิดชอบ',
  ],
  [
    'PERM-ACT-008',
    'TECHNICIAN',
    'ticket',
    'ticket.update_repair_detail',
    'แก้รายละเอียดซ่อม',
    'TRUE',
    'related_ticket_only',
    'FALSE',
    'ADMIN',
    'ใช้ตอนเปลี่ยนสถานะพร้อมรายละเอียด',
  ],
  [
    'PERM-ACT-009',
    'TECHNICIAN',
    'ticket',
    'ticket.upload_file',
    'แนบไฟล์ Service',
    'TRUE',
    'related_ticket_only',
    'FALSE',
    'ADMIN',
    'หลักฐานการดำเนินงาน',
  ],
  [
    'PERM-ACT-010',
    'TECHNICIAN',
    'ticket',
    'ticket.close',
    'ปิดงาน',
    'TRUE',
    'related_ticket_only',
    'FALSE',
    'ADMIN',
    'ปิดงานที่เกี่ยวข้อง',
  ],
  [
    'PERM-ACT-011',
    'TECHNICIAN',
    'ticket',
    'ticket.assign_to_other',
    'มอบหมายให้ผู้อื่น',
    'FALSE',
    'none',
    'TRUE',
    'ADMIN',
    'TECHNICIAN ไม่ควรส่งงานให้คนอื่นเอง',
  ],
  [
    'PERM-ACT-012',
    'TECHNICIAN',
    'ticket',
    'ticket.delete',
    'ลบงาน',
    'FALSE',
    'none',
    'TRUE',
    'ADMIN',
    'ไม่อนุญาตให้ลบงาน',
  ],
  [
    'PERM-ACT-013',
    'USER',
    'ticket',
    'ticket.create',
    'แจ้งงาน',
    'TRUE',
    'own',
    'FALSE',
    'ADMIN',
    'ผู้ใช้ทั่วไปแจ้งงานได้',
  ],
  [
    'PERM-ACT-014',
    'USER',
    'ticket',
    'ticket.update_status',
    'ยืนยัน/เปิดงานอีกครั้ง',
    'TRUE',
    'own_ticket_only',
    'FALSE',
    'ADMIN',
    'ใช้สำหรับปิดงานหรือเปิดงานอีกครั้งเฉพาะงานตนเอง',
  ],
  [
    'PERM-ACT-015',
    'MANAGER',
    'role',
    'role.manage',
    'จัดการสิทธิ์',
    'FALSE',
    'none',
    'TRUE',
    'ADMIN',
    'จำกัดให้ ADMIN เท่านั้น',
  ],
  [
    'PERM-ACT-016',
    'TECHNICIAN',
    'ticket',
    'ticket.create_for_user',
    'รับแจ้งแทนผู้ใช้',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN รับแจ้งงานแทน USER ได้',
  ],
  [
    'PERM-ACT-017',
    'TECHNICIAN',
    'ticket',
    'ticket.assign_self',
    'มอบหมายให้ตนเอง',
    'TRUE',
    'unassigned_or_related',
    'FALSE',
    'ADMIN',
    'ใช้สำหรับรับงานที่ยังไม่มีผู้รับผิดชอบ',
  ],
  [
    'PERM-ACT-018',
    'TECHNICIAN',
    'ticket',
    'ticket.reopen',
    'เปิดงานอีกครั้ง',
    'TRUE',
    'related_ticket_only',
    'FALSE',
    'ADMIN',
    'เปิดงานอีกครั้งเฉพาะงานที่เกี่ยวข้อง',
  ],
  [
    'PERM-ACT-019',
    'TECHNICIAN',
    'ticket',
    'ticket.cancel',
    'ยกเลิกงาน',
    'TRUE',
    'related_or_unassigned',
    'FALSE',
    'ADMIN',
    'ยกเลิกงานพร้อมเหตุผล',
  ],
  [
    'PERM-ACT-020',
    'TECHNICIAN',
    'inventory',
    'inventory.view',
    'ดูทะเบียนครุภัณฑ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'เปิดเมนูทะเบียนอุปกรณ์',
  ],
  [
    'PERM-ACT-021',
    'TECHNICIAN',
    'inventory',
    'inventory.edit',
    'แก้ไขทะเบียนครุภัณฑ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'แก้ไขข้อมูลหลังตรวจสอบ',
  ],
  [
    'PERM-ACT-022',
    'TECHNICIAN',
    'inventory',
    'inventory.update_after_inspection',
    'อัปเดตหลังตรวจสอบ',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ใช้ร่วมกับ inventory.edit',
  ],
  [
    'PERM-ACT-023',
    'TECHNICIAN',
    'master_data',
    'master_data.import',
    'นำเข้าข้อมูลหลัก',
    'TRUE',
    'validated_import_only',
    'FALSE',
    'ADMIN',
    'อนุญาต Import ไฟล์ข้อมูลหลัก',
  ],
  [
    'PERM-ACT-024',
    'TECHNICIAN',
    'ticket',
    'ticket.manage_workflow',
    'จัดการ Workflow งาน',
    'TRUE',
    'related_or_unassigned',
    'FALSE',
    'ADMIN',
    'สิทธิ์รวมสำหรับสถานะตาม Workflow ที่ได้รับอนุญาต',
  ],
  [
    'PERM-ACT-025',
    'MANAGER',
    'inventory',
    'inventory.edit',
    'แก้ไขทะเบียนครุภัณฑ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'รองรับผู้จัดการตรวจสอบข้อมูล',
  ],
  [
    'PERM-ACT-026',
    'TECHNICIAN',
    'role',
    'role.manage',
    'จัดการสิทธิ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN admin-equivalent permission management',
  ],
  [
    'PERM-ACT-027',
    'TECHNICIAN',
    'permission',
    'permission.update',
    'ปรับปรุงสิทธิ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN can update permission matrix as approved',
  ],
  [
    'PERM-ACT-028',
    'TECHNICIAN',
    'user',
    'user.manage',
    'จัดการผู้ใช้',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN admin-equivalent user management',
  ],
  [
    'PERM-ACT-029',
    'TECHNICIAN',
    'system',
    'system.setting',
    'ตั้งค่าระบบ',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN admin-equivalent system setting',
  ],
  [
    'PERM-ACT-030',
    'TECHNICIAN',
    'ticket',
    'ticket.manage_all',
    'จัดการงานทั้งหมด',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'TECHNICIAN admin-equivalent ticket workflow',
  ],
  [
    'PERM-ACT-031',
    'ADMIN',
    'ticket',
    'ticket.manage_workflow',
    'จัดการ Workflow งาน',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ADMIN workflow control',
  ],
  [
    'PERM-ACT-032',
    'ADMIN',
    'inventory',
    'inventory.edit',
    'แก้ไขทะเบียนครุภัณฑ์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ADMIN inventory edit',
  ],
  [
    'PERM-ACT-033',
    'ADMIN',
    'master_data',
    'master_data.import',
    'นำเข้าข้อมูลหลัก',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ADMIN import master data',
  ],
  [
    'PERM-ACT-034',
    'ADMIN',
    'user',
    'user.manage',
    'จัดการผู้ใช้',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ADMIN user management',
  ],
  [
    'PERM-ACT-035',
    'ADMIN',
    'system',
    'system.setting',
    'ตั้งค่าระบบ',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'ADMIN system setting',
  ],
  [
    'PERM-ACT-036',
    'MANAGER',
    'ticket',
    'ticket.manage_workflow',
    'จัดการ Workflow งาน',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket workflow',
  ],
  [
    'PERM-ACT-037',
    'MANAGER',
    'ticket',
    'ticket.accept',
    'รับงาน',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-038',
    'MANAGER',
    'ticket',
    'ticket.assign_self',
    'มอบหมาย',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-039',
    'MANAGER',
    'ticket',
    'ticket.update_status',
    'ปรับสถานะ',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-040',
    'MANAGER',
    'ticket',
    'ticket.update_repair_detail',
    'รายละเอียดซ่อม',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-041',
    'MANAGER',
    'ticket',
    'ticket.close',
    'ปิดงาน',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-042',
    'MANAGER',
    'ticket',
    'ticket.reopen',
    'เปิดงานอีกครั้ง',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-043',
    'MANAGER',
    'ticket',
    'ticket.cancel',
    'ยกเลิก',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-044',
    'MANAGER',
    'ticket',
    'ticket.upload_file',
    'แนบไฟล์',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-045',
    'MANAGER',
    'ticket',
    'ticket.create',
    'แจ้งงาน',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
  [
    'PERM-ACT-046',
    'MANAGER',
    'ticket',
    'ticket.create_for_user',
    'แจ้งงานแทนผู้ใช้',
    'TRUE',
    'all',
    'FALSE',
    'ADMIN',
    'Preserve MANAGER ticket operation',
  ],
]);

// apps/webapp/src/server/features/master-data/master-data-service.js
const LOOKUP_HEADERS = ['lookup_id', 'lookup_type', 'label', 'active', 'sort_order', 'updated_at'];

// apps/webapp/src/server/features/master-data/master-data-service.js
const DEVICE_DEFAULTS = [
  'Computer PC',
  'Computer Notebook',
  'Printer',
  'Scanner',
  'UPS',
  'Monitor',
  'Software',
  'Network',
  'อื่นๆ',
];

// apps/webapp/src/server/features/imports/import-service.js
const OCPB_IMPORT_VERSION = '1.0.19';

// apps/webapp/src/server/features/imports/import-service.js
const OCPB_IMPORT_CONFIG = Object.freeze({
  MAX_ROWS: 500,
  PREVIEW_ROWS: 20,
  PREVIEW_TTL_SECONDS: 600,
  SPREADSHEET_ID_FALLBACK: '1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs',
  SHEETS: Object.freeze({
    TICKET: 'INCIDENT',
    INVENTORY: 'INVENTORY',
    LOOKUPS: 'APP_LOOKUPS',
    USERS: 'APP_USERS',
    SESSIONS: 'APP_SESSIONS',
    ORG_UNITS: 'MST_ORG_UNITS',
  }),
  HEADERS: Object.freeze({
    TICKET: Object.freeze([
      'เลขที่แจ้งปัญหา',
      'วันที่และเวลาที่แจ้ง',
      'ผู้แจ้งปัญหา',
      'เบอร์โทร',
      'อีเมล',
      'ประเภทอุปกรณ์',
      'ยี่ห้อ',
      'รุ่น',
      'หมายเลขซีเรียล',
      'เลขครุภัณฑ์',
      'รายละเอียดคำขอ / อาการเสีย',
      'หน่วยงานหลัก',
      'หน่วยงานย่อย',
      'ระดับความเร่งด่วน',
      'ช่องทางรับแจ้ง',
      'ผู้รับแจ้ง',
      'วันที่และเวลาเข้าแก้ไข',
      'ประเภทปัญหาการแจ้งซ่อม',
      'รายละเอียดการดำเนินงาน / วิธีแก้ไข',
      'ผู้ดำเนินการ',
      'วันที่และเวลาแก้ไขเสร็จ',
      'สถานะการแจ้งซ่อม',
      'หมายเหตุ',
      'เอกสารแนบ',
      'OrgUnitID',
    ]),
    INVENTORY: Object.freeze([
      'รหัสอุปกรณ์',
      'ประเภทอุปกรณ์',
      'ยี่ห้อ',
      'รุ่น',
      'หมายเลขซีเรียล',
      'เลขครุภัณฑ์',
      'หมายเลขสินทรัพย์',
      'ปีงบประมาณที่จัดซื้อ',
      'ชื่อผู้รับผิดชอบ',
      'หน่วยงานหลัก',
      'หน่วยงานย่อย',
      'สถานที่ติดตั้ง',
      'ชั้น',
      'อาคาร',
      'Operating System',
      'CPU Brand',
      'CPU Speed',
      'RAM',
      'Harddisk',
      'IP Address',
      'สถานะครุภัณฑ์',
      'แอนตี้ไวรัส',
      'รูปภาพ1_URL',
      'รูปภาพ2_URL',
      'วันที่สำรวจ',
      'ผู้ตรวจสอบ',
      'สถานะตรวจสอบ',
      'หมายเหตุ',
    ]),
  }),
  REQUIRED: Object.freeze({
    TICKET: Object.freeze([
      'เลขที่แจ้งปัญหา',
      'วันที่และเวลาที่แจ้ง',
      'ผู้แจ้งปัญหา',
      'รายละเอียดคำขอ / อาการเสีย',
      'สถานะการแจ้งซ่อม',
    ]),
    INVENTORY: Object.freeze(['รหัสอุปกรณ์', 'ประเภทอุปกรณ์']),
  }),
  DATE_FIELDS: Object.freeze({
    TICKET: Object.freeze([
      'วันที่และเวลาที่แจ้ง',
      'วันที่และเวลาเข้าแก้ไข',
      'วันที่และเวลาแก้ไขเสร็จ',
    ]),
    INVENTORY: Object.freeze(['วันที่สำรวจ']),
  }),
});

// apps/webapp/src/server/compatibility/line/candidate-approval.js
const ITSD_LINE_DURABLE_STATES_ = Object.freeze({
  PENDING: 'PENDING',
  CLAIMED: 'CLAIMED',
  RECONCILE: 'RECONCILE_REQUIRED',
  CREATED: 'CREATED',
});

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
const ITSD_LINE_SCHEMA_ = Object.freeze({
  LINE_INBOX:
    'inbox_id,provider,webhook_event_id,message_id,delivery_context,source_group_key,source_group_hash,sender_id_hash,sender_display,received_at,raw_text,parsed_json,reporter,org_text,asset_text,issue_text,phone,parse_status,review_status,reviewed_json,review_revision,reviewer_user_id,review_lock_until,reviewed_at,review_note,approved_at,ticket_creation_status,ticket_id,ticket_created_at,creation_request_id,last_error_code,retention_until,created_at,updated_at'.split(
      ',',
    ),
  LINE_INBOX_AUDIT:
    'audit_id,inbox_id,correlation_id,action,actor_type,actor_user_id,from_status,to_status,changed_fields_json,result,error_code,note,event_at'.split(
      ',',
    ),
  LINE_ALLOWED_GROUPS:
    'group_key,source_type,group_id_hash,hash_version,group_id_secret_ref,display_name,active,last_event_at,disabled_reason,created_at,created_by,updated_at,updated_by'.split(
      ',',
    ),
});

// apps/webapp/src/server/compatibility/line/candidate-ingress.js
const ITSD_LINE_INGRESS_MAX_BYTES_ = 16384;

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
const LINE_LEGACY_HEADERS_ = Object.freeze([
  'inbox_id',
  'event_id',
  'received_at',
  'group_id',
  'reporter',
  'department',
  'asset_code',
  'issue_detail',
  'raw_message',
  'parse_status',
  'review_status',
  'ticket_id',
  'message_id',
  'sender_id',
]);

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
const LINE_LEGACY_STATUSES_ = Object.freeze([
  'PENDING_REVIEW',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'CREATING',
  'CREATED',
  'FAILED',
]);

// apps/webapp/src/server/features/line-inbox/message-receiver.js
const LINE_MESSAGING_PROTOCOL_ = 'ITSD_LINE_V1';

// apps/webapp/src/server/features/line-inbox/message-receiver.js
const LINE_MESSAGING_MAX_BODY_ = 65536;

// apps/webapp/src/server/features/line-inbox/message-receiver.js
const LINE_MESSAGING_CLOCK_WINDOW_ = 5 * 60 * 1000;

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_GROUP_TAB_ = 'PM_PLANNINGS';

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_META_TAB_ = 'PM_PLANNING_ITEMS';

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_GROUP_HEADERS_ = [
  'planning_id',
  'name',
  'start_date',
  'end_date',
  'revision',
  'created_at',
  'created_by',
  'updated_at',
  'updated_by',
];

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_META_HEADERS_ = [
  'plan_id',
  'planning_id',
  'end_date',
  'owner_id',
  'priority',
  'progress',
  'sort_order',
];

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_PRIORITIES_ = ['ต่ำ', 'ปกติ', 'สูง', 'เร่งด่วน'];

// apps/webapp/src/server/features/pm/planning-service.js
const PMP_MAX_TASKS_ = 100;

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_PLAN_TAB_ = 'PM_PLANS';

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_AUDIT_TAB_ = 'PM_PLAN_HISTORY';

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_HEADERS_ = [
  'plan_id',
  'plan_date',
  'org_unit_id',
  'org_name',
  'work_area',
  'description',
  'start_time',
  'end_time',
  'status',
  'updated_at',
  'updated_by',
  'revision',
  'created_at',
  'created_by',
];

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_AUDIT_HEADERS_ = [
  'log_id',
  'plan_id',
  'action',
  'before_json',
  'after_json',
  'actor',
  'logged_at',
];

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_STATES_ = ['รอดำเนินการ', 'กำลังดำเนินการ', 'ดำเนินการแล้ว', 'ยกเลิก'];

// apps/webapp/src/server/features/pm/calendar-service.js
const PM_SOFT_DELETED_ = 'ลบแล้ว';

// apps/webapp/src/server/features/projects/project-binding.js
const PROJECT70_LEGACY_DB_ = '1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c';
const PROJECT70_TARGET_DB_ = '1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs';

// apps/webapp/src/server/features/projects/project-binding.js
const PROJECT70_LEGACY_SCRIPT_ = '1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7';
const PROJECT70_TARGET_SCRIPT_ = '1G24xkTApOioEWGknDyVxqQ-sNzICsG8HQoP-5IkfJK98sfGsir_0QWcg';

// apps/webapp/src/server/features/projects/project-binding.js
const PROJECT70_TIMEZONES_ = ['Asia/Bangkok', 'Asia/Ho_Chi_Minh', 'Asia/Jakarta'];

// apps/webapp/src/server/features/projects/project-installer.js
const PROJECT70_ORG_HEADERS_ = [
  'org_unit_id',
  'first_org_unit_id',
  'second_org_unit_id',
  'org_full_name',
  'short_name',
  'org_level',
  'location',
  'comment',
];

// apps/webapp/src/server/features/service-reports/work-order-service.js
const SERVICE_REPORT_HEADERS_ = [
  'ticket_id',
  'revision',
  'outcome',
  'outcome_date',
  'sent_name',
  'sent_model',
  'sent_serial',
  'replacement_name',
  'replacement_model',
  'replacement_serial',
  'updated_at',
  'updated_by',
];

// apps/webapp/src/server/features/service-reports/work-order-service.js
const SERVICE_REPORT_OUTCOMES_ = ['', 'COMPLETED', 'SENT_FOR_REPAIR', 'LOAN_DEVICE', 'REPLACED'];

// Default Open Technology / OCPB Service Report (CM) header fields matching reference PDF template.
const SERVICE_REPORT_TEMPLATE_DEFAULTS_ = Object.freeze({
  provider: 'บริษัท โอเพ่น เทคโนโลยี จำกัด (มหาชน)',
  address:
    '223/95 ชั้น 20 คันทรี คอมเพล็กซ์ อาคารเอ ถนนสรรพาวุธ เขตบางนา กรุงเทพฯ 10260 โทร. 02-753-4291 โทรสาร. 02-753-4289',
  title: 'ใบแจ้งซ่อมเครื่องคอมพิวเตอร์และอุปกรณ์ต่อพ่วง (CM) สำนักงานคณะกรรมการคุ้มครองผู้บริโภค',
  project:
    'โครงการบำรุงรักษาเครือข่าย เครื่องคอมพิวเตอร์แม่ข่าย เครื่องคอมพิวเตอร์ อุปกรณ์คอมพิวเตอร์ และห้องปฏิบัติการคอมพิวเตอร์',
});

// apps/webapp/src/server/features/tickets/ticket-workflow.js
function normalizePriority_(value) {
  const raw = String(value || '').trim();
  const key = raw.toUpperCase().replace(/\s+/g, '');
  const map = {
    NORMAL: 'ปกติ (Normal)',
    ปกติ: 'ปกติ (Normal)',
    'ปกติ(NORMAL)': 'ปกติ (Normal)',
    LOW: 'ต่ำ (Low)',
    ต่ำ: 'ต่ำ (Low)',
    ไม่ด่วน: 'ต่ำ (Low)',
    'ต่ำ(LOW)': 'ต่ำ (Low)',
    MEDIUM: 'ปานกลาง (Medium)',
    ปานกลาง: 'ปานกลาง (Medium)',
    ด่วน: 'ปานกลาง (Medium)',
    'ปานกลาง(MEDIUM)': 'ปานกลาง (Medium)',
    HIGH: 'สูง (High)',
    สูง: 'สูง (High)',
    ด่วนมาก: 'สูง (High)',
    'สูง(HIGH)': 'สูง (High)',
    CRITICAL: 'วิกฤต (Critical)',
    วิกฤต: 'วิกฤต (Critical)',
    'วิกฤต(CRITICAL)': 'วิกฤต (Critical)',

    P1: 'วิกฤต (Critical)',
    'CRITICAL(P1)': 'วิกฤต (Critical)',
    เร่งด่วน: 'วิกฤต (Critical)',
    URGENT: 'วิกฤต (Critical)',
    P2: 'สูง (High)',
    'HIGH(P2)': 'สูง (High)',
    P3: 'ปานกลาง (Medium)',
    'MEDIUM(P3)': 'ปานกลาง (Medium)',
    P4: 'ต่ำ (Low)',
    'LOW(P4)': 'ต่ำ (Low)',
  };
  return map[key] || '';
}

// apps/webapp/src/server/features/tickets/ticket-workflow.js
function statusTargetsFor_(u, from, ticket, meta) {
  if (!hasPermissionForUser_(u, 'TICKETS', ticketPermission_isRequesterOnly_(u) ? 'VIEW' : 'EDIT')) return [];
  if (typeof ticketPermission_statusTargetsFor_ === 'function')
    return ticketPermission_statusTargetsFor_(u, from, ticket, meta);
  if (u && ['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)))
    return (TRANSITIONS[from] || []).slice();
  return (TRANSITIONS[from] || []).filter((s) => s === 'ปิดงาน');
}

// apps/webapp/src/server/shared/validation.js
function plainObject_(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error((label || 'ข้อมูล') + 'ไม่ถูกต้อง');
  return value;
}

// apps/webapp/src/server/shared/validation.js
function boundedText_(value, label, max, trim) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') throw Error((label || 'ข้อมูล') + 'ไม่ถูกต้อง');
  let text = String(value);
  if (trim) text = text.trim();
  if (text.length > max) throw Error((label || 'ข้อมูล') + 'ยาวเกิน ' + max + ' ตัวอักษร');
  return text;
}

// apps/webapp/src/server/shared/validation.js
function safeCell_(v) {
  const s = String(v == null ? '' : v);
  return /^[\s]*[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// apps/webapp/src/server/features/branding/branding-service.js
function getSystemBranding_(settings) {
  const src = settings && typeof settings === 'object' ? settings : systemSettingsMap_();
  const projectName =
    String(src.project_name || SYSTEM_BRANDING_DEFAULTS.project_name).trim() ||
    SYSTEM_BRANDING_DEFAULTS.project_name;
  const shortName =
    String(src.system_short_name || projectName || SYSTEM_BRANDING_DEFAULTS.short_name).trim() ||
    projectName;
  const description =
    String(src.system_description || SYSTEM_BRANDING_DEFAULTS.description).trim() ||
    SYSTEM_BRANDING_DEFAULTS.description;
  return {
    project_name: projectName,
    short_name: shortName,
    description,
    icon_file_id: String(src.system_icon_file_id || ''),
    icon_filename: String(src.system_icon_filename || ''),
    icon_mime_type: String(src.system_icon_mime_type || ''),
    icon_width: Number(src.system_icon_width || 512),
    icon_height: Number(src.system_icon_height || 512),
    icon_updated_at: String(src.system_icon_updated_at || ''),
    icon_updated_by: String(src.system_icon_updated_by || ''),
  };
}

// apps/webapp/src/server/features/branding/branding-service.js
function itsdImpl_getPublicSystemBranding_() {
  const b = getSystemBranding_();
  return {
    project_name: b.project_name,
    short_name: b.short_name,
    description: b.description,
    version: APP_VERSION,
  };
}

// apps/webapp/src/server/features/branding/branding-service.js
function publicBrandingJson_(branding) {
  const b = branding || getSystemBranding_();
  // Only public fields enter the HTML. Escape script delimiters and Unicode line separators.
  return JSON.stringify({
    project_name: b.project_name,
    short_name: b.short_name,
    description: b.description,
    version: APP_VERSION,
  }).replace(/[<>&\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

// apps/webapp/src/server/features/settings/settings-service.js
function systemSettingsMap_() {
  const sheet = book_().getSheetByName('APP_SETTINGS');
  if (!sheet) return {};
  return Object.fromEntries(rows_('APP_SETTINGS').map((x) => [x.key, x.value]));
}

// apps/webapp/src/server/features/settings/settings-service.js
function itsdImpl_saveSetting_(token, key, value) {
  const actor = require_(token, true);
  if (!permission_hasAction_(actor, 'system.setting')) throw Error('ไม่มีสิทธิ์ตั้งค่าระบบ');
  if (!hasPermissionForUser_(actor, 'SETTINGS', 'EDIT')) throw Error('ไม่มีสิทธิ์แก้ไขการตั้งค่า');
  key = boundedText_(key, 'ชื่อการตั้งค่า', 40, true);
  const allowed = [
    'project_name',
    'service_folder_id',
    'backup_folder_id',
    'documents_folder_id',
    'pictures_folder_id',
    'system_assets_folder_id',
  ];
  if (!allowed.includes(key)) throw Error('ตั้งค่านี้แก้ไขไม่ได้');
  const max = key === 'project_name' ? 120 : SECURITY_LIMITS.SETTING_VALUE,
    text = boundedText_(
      value,
      key === 'project_name' ? 'ชื่อโครงการ' : 'Google Drive Folder ID',
      max,
      true,
    );
  if (key !== 'project_name' && text) {
    try {
      DriveApp.getFolderById(text).getName();
    } catch (_) {
      throw Error('ไม่สามารถเข้าถึง Google Drive Folder ID ที่ระบุได้');
    }
  }
  const row = find_('APP_SETTINGS', 'key', key);
  if (row) update_('APP_SETTINGS', row.__row, { value: text });
  else append_('APP_SETTINGS', { key, value: text });
  return true;
}

// apps/webapp/src/server/platform/drive/folder-service.js
function driveFolderBySetting_(key, label) {
  const row = find_('APP_SETTINGS', 'key', key),
    id = row && String(row.value || '').trim();
  const name = label || DRIVE_FOLDER_SETTINGS[key] || key;
  if (!id) throw Error('กรุณากำหนด ' + name + ' ในเมนู ตั้งค่าระบบ');
  try {
    return DriveApp.getFolderById(id);
  } catch (_) {
    throw Error('ไม่สามารถเข้าถึง ' + name + ' ได้ กรุณาตรวจสอบ Folder ID และสิทธิ์การเข้าถึง');
  }
}

// apps/webapp/src/server/platform/drive/folder-service.js
function serviceUploadFolder_(mime) {
  return String(mime || '').indexOf('image/') === 0
    ? driveFolderBySetting_('pictures_folder_id', 'Google Drive Pictures')
    : driveFolderBySetting_('documents_folder_id', 'Google Drive Documents');
}

// apps/webapp/src/server/features/auth/auth-service.js
function normalizeUsername_(value) {
  return boundedText_(value, 'ชื่อผู้ใช้', SECURITY_LIMITS.USERNAME, true).toUpperCase();
}

// apps/webapp/src/server/features/auth/auth-service.js
function tokenText_(value) {
  if (typeof value !== 'string' || !value || value.length > SECURITY_LIMITS.TOKEN)
    throw Error('เซสชันไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่');
  return value;
}

// apps/webapp/src/server/features/auth/auth-service.js
function usersByUsername_(username) {
  const key = normalizeUsername_(username);
  return rows_('APP_USERS').filter(
    (u) =>
      String(u.username || '')
        .trim()
        .toUpperCase() === key,
  );
}

// apps/webapp/src/server/features/auth/auth-service.js
function revokeUserSessions_(userId) {
  rows_('APP_SESSIONS')
    .filter((s) => s.user_id === userId && s.revoked !== 'TRUE')
    .forEach((s) => update_('APP_SESSIONS', s.__row, { revoked: true }));
}

// apps/webapp/src/server/features/auth/auth-service.js
function require_(token, admin, allowPasswordChange) {
  token = tokenText_(token);
  const session = find_('APP_SESSIONS', 'token_hash', digest_(token));
  if (
    !session ||
    session.revoked === 'TRUE' ||
    Date.parse(session.expires_at.replace(' ', 'T') + '+07:00') < Date.now()
  )
    throw Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  const user = find_('APP_USERS', 'user_id', session.user_id);
  if (!user || user.active !== 'TRUE') throw Error('บัญชีไม่พร้อมใช้งาน');
  if (!allowPasswordChange && nist118Status_(user).required)
    throw Error('PASSWORD_CHANGE_REQUIRED: กรุณาเปลี่ยนรหัสผ่านก่อนใช้งานระบบ');
  if (admin && !['ADMIN', 'TECHNICIAN', 'ITSUPPORT'].includes(String(user.role || '').toUpperCase()))
    throw Error('สิทธิ์ไม่เพียงพอ');
  return user;
}

// apps/webapp/src/server/features/auth/auth-service.js
function roleKey_(u) {
  return String((u && u.role) || 'USER')
    .trim()
    .toUpperCase();
}

// apps/webapp/src/server/features/auth/auth-service.js
function ticketPermission_isRequesterOnly_(u) {
  const role = roleKey_(u);
  if (role === 'USER') return true;
  if (['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT'].includes(role)) return false;
  return !permission_hasAction_(u, 'ticket.manage_all') && !permission_hasAction_(u, 'ticket.manage_workflow');
}

// apps/webapp/src/server/features/auth/auth-service.js
function ticketPermission_isScopedOperator_(u) {
  const role = roleKey_(u);
  return role === 'TECHNICIAN' || role === 'ITSUPPORT' || (!['ADMIN', 'MANAGER', 'USER'].includes(role) && permission_hasAction_(u, 'ticket.manage_workflow'));
}

// apps/webapp/src/server/features/auth/auth-service.js
function identityKeys_(u) {
  return [u && u.user_id, u && u.username, u && u.display_name]
    .map((v) =>
      String(v || '')
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean);
}

// apps/webapp/src/server/features/auth/auth-service.js
function createUser_(username, display, role, password) {
  username = normalizeUsername_(username);
  display = boundedText_(display, 'ชื่อแสดง', SECURITY_LIMITS.DISPLAY_NAME, true);
  password = boundedText_(password, 'รหัสผ่าน', SECURITY_LIMITS.PASSWORD, false);
  if (!/^[A-Z0-9_]{3,30}$/.test(username))
    throw Error('ชื่อผู้ใช้ต้องเป็น A-Z, 0-9 หรือ _ จำนวน 3-30 ตัวอักษร');
  if (usersByUsername_(username).length) throw Error('ชื่อผู้ใช้นี้มีอยู่แล้ว');
  if (!display) throw Error('กรุณาระบุชื่อแสดง');
  if (!['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT', 'USER'].includes(role)) throw Error('สิทธิ์ไม่ถูกต้อง');
  if (password.length < 12) throw Error('รหัสผ่านอย่างน้อย 12 อักขระ');
  const salt = random_(),
    id = 'USR-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  append_('APP_USERS', {
    user_id: id,
    username,
    display_name: display,
    role,
    password_salt: salt,
    password_hash: pwHash_(password, salt),
    active: true,
    failed_count: 0,
    locked_until: '',
    created_at: now_(),
  });
  nist118Temporary_(id);
  return id;
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_login_(username, password) {
  username = normalizeUsername_(username);
  password = boundedText_(password, 'รหัสผ่าน', SECURITY_LIMITS.PASSWORD, false);
  return lock_(() => {
    const matches = usersByUsername_(username),
      u = matches.length === 1 ? matches[0] : null;
    if (!u || u.active !== 'TRUE') throw Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    if (u.locked_until && Date.parse(u.locked_until.replace(' ', 'T') + '+07:00') > Date.now())
      throw Error('บัญชีถูกพักชั่วคราว');
    if (pwHash_(password, u.password_salt) !== u.password_hash) {
      const n = Number(u.failed_count || 0) + 1;
      update_('APP_USERS', u.__row, {
        failed_count: n,
        locked_until:
          n >= 5
            ? Utilities.formatDate(new Date(Date.now() + 15 * 60 * 1000), TZ, 'yyyy-MM-dd HH:mm:ss')
            : '',
      });
      auditAuth_(u, 'LOGIN_FAILED', 'FAILED', 'ยืนยันตัวตนไม่สำเร็จ', '');
      throw Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    update_('APP_USERS', u.__row, { failed_count: 0, locked_until: '' });
    const token = random_(),
      expiry = Utilities.formatDate(new Date(Date.now() + 8 * 3600000), TZ, 'yyyy-MM-dd HH:mm:ss');
    append_('APP_SESSIONS', {
      token_hash: digest_(token),
      user_id: u.user_id,
      expires_at: expiry,
      revoked: false,
    });
    auditAuth_(u, 'LOGIN_SUCCESS', 'SUCCESS', 'เข้าสู่ระบบสำเร็จ', digest_(token).slice(0, 16));
    return { token, user: publicUser_(u) };
  });
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_logout_(token) {
  try {
    token = tokenText_(token);
  } catch (_) {
    return true;
  }
  const hash = digest_(token),
    s = find_('APP_SESSIONS', 'token_hash', hash);
  if (s) {
    const u = find_('APP_USERS', 'user_id', s.user_id);
    update_('APP_SESSIONS', s.__row, { revoked: true });
    if (u) auditAuth_(u, 'LOGOUT', 'SUCCESS', 'ออกจากระบบ', hash.slice(0, 16));
  }
  return true;
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_changePassword_(token, oldPassword, newPassword) {
  const identity = require_(token, false, true);
  oldPassword = boundedText_(oldPassword, 'รหัสผ่านเดิม', SECURITY_LIMITS.PASSWORD, false);
  newPassword = boundedText_(newPassword, 'รหัสผ่านใหม่', SECURITY_LIMITS.PASSWORD, false);
  return lock_(() => {
    resetRows_('APP_USERS');
    resetRows_('APP_SESSIONS');
    const u = require_(token, false, true);
    if (u.locked_until && Date.parse(u.locked_until.replace(' ', 'T') + '+07:00') > Date.now())
      throw Error('บัญชีถูกพักชั่วคราว กรุณาลองใหม่ภายหลัง');
    if (u.user_id !== identity.user_id || pwHash_(oldPassword, u.password_salt) !== u.password_hash) {
      const attempts = Number(u.failed_count || 0) + 1;
      update_('APP_USERS', u.__row, {
        failed_count: attempts,
        locked_until: attempts >= 5 ? Utilities.formatDate(new Date(Date.now() + 15 * 60 * 1000), TZ, 'yyyy-MM-dd HH:mm:ss') : '',
      });
      if (attempts >= 5) revokeUserSessions_(u.user_id);
      throw Error('รหัสผ่านเดิมไม่ถูกต้อง');
    }
    nist118Password_(newPassword, u);
    const salt = random_(), hash = pwHash_(newPassword, salt), policy = nist118Policy_();
    update_('APP_USERS', u.__row, { password_salt: salt, password_hash: hash, failed_count: 0, locked_until: '' });
    revokeUserSessions_(u.user_id);
    PropertiesService.getScriptProperties().setProperty(nist118UserKey_(u), JSON.stringify({
      credential: digest_(hash), changed_at: now_(), temporary: false,
      round: policy.enabled && Date.now() >= Date.parse(policy.starts_at) ? policy.round : '',
    }));
    writeAudit_(
      u,
      'PASSWORD_CHANGE',
      'AUTH',
      'APP_USERS',
      u.user_id,
      'SUCCESS',
      'เปลี่ยนรหัสผ่านของตนเอง',
    );
    return true;
  });
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_saveUser_(token, data) {
  const actor = require_(token, true);
  if (!permission_hasAction_(actor, 'user.manage')) throw Error('ไม่มีสิทธิ์จัดการผู้ใช้');
  if (!hasPermissionForUser_(actor, 'USER_MANAGEMENT', 'EDIT'))
    throw Error('ไม่มีสิทธิ์จัดการผู้ใช้');
  data = plainObject_(data || {}, 'ข้อมูลผู้ใช้');
  const username = normalizeUsername_(data.username),
    display = boundedText_(data.display_name, 'ชื่อแสดง', SECURITY_LIMITS.DISPLAY_NAME, true),
    role = boundedText_(data.role, 'สิทธิ์', 10, true),
    active = data.active !== false,
    password = data.password
      ? boundedText_(data.password, 'รหัสผ่าน', SECURITY_LIMITS.PASSWORD, false)
      : '';
  if (!/^[A-Z0-9_]{3,30}$/.test(username))
    throw Error('ชื่อผู้ใช้ต้องเป็น A-Z, 0-9 หรือ _ จำนวน 3-30 ตัวอักษร');
  if (!display) throw Error('กรุณาระบุชื่อแสดง');
  if (!['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT', 'USER'].includes(role)) throw Error('สิทธิ์ไม่ถูกต้อง');
  if (password && password.length < 12) throw Error('รหัสผ่านอย่างน้อย 12 อักขระ');
  return lock_(() => {
    const matches = usersByUsername_(username);
    if (matches.length > 1) throw Error('พบชื่อผู้ใช้ซ้ำในระบบ กรุณาตรวจสอบข้อมูลผู้ใช้');
    const old = matches[0];
    if (old) {
      if (old.user_id === actor.user_id && !active) throw Error('ปิดใช้งานบัญชีของตนเองไม่ได้');
      if (
        old.role === 'ADMIN' &&
        (!active || role !== 'ADMIN') &&
        rows_('APP_USERS').filter((x) => x.role === 'ADMIN' && x.active === 'TRUE').length <= 1
      )
        throw Error('ต้องมีผู้ดูแลระบบที่ใช้งานได้อย่างน้อยหนึ่งบัญชี');
      const securityChanged =
        String(old.username || '')
          .trim()
          .toUpperCase() !== username ||
        old.role !== role ||
        (old.active === 'TRUE') !== active ||
        Boolean(password);
      update_('APP_USERS', old.__row, { username, display_name: display, role, active });
      if (password) {
        nist118Temporary_(old.user_id);
        const salt = random_();
        update_('APP_USERS', old.__row, {
          password_salt: salt,
          password_hash: pwHash_(password, salt),
        });
      }
      if (securityChanged) revokeUserSessions_(old.user_id);
      return old.user_id;
    }
    return createUser_(username, display, role, password);
  });
}

// apps/webapp/src/server/features/auth/auth-service.js
function nist118Policy_() {
  const raw = PropertiesService.getScriptProperties().getProperty('ITSD_PASSWORD_POLICY');
  if (!raw) return { enabled: false, starts_at: '2026-11-01T00:00:00+07:00', message: 'เพื่อความปลอดภัย กรุณาเปลี่ยนรหัสผ่านใหม่ก่อนใช้งานระบบ', round: '', revision: 0 };
  const p = JSON.parse(raw);
  if (typeof p.enabled !== 'boolean' || !Number.isFinite(Date.parse(p.starts_at))) throw Error('การตั้งค่านโยบายรหัสผ่านไม่ถูกต้อง กรุณาติดต่อ ADMIN');
  return p;
}

// apps/webapp/src/server/features/auth/auth-service.js
function nist118UserKey_(u) { return 'ITSD_PASSWORD_USER_' + digest_(String(u.user_id)); }

// apps/webapp/src/server/features/auth/auth-service.js
function nist118Status_(u, at) {
  const p = nist118Policy_();
  const raw = PropertiesService.getScriptProperties().getProperty(nist118UserKey_(u));
  const record = raw ? JSON.parse(raw) : {};
  const now = at === undefined ? Date.now() : at;
  const temporary = record.temporary === true || (record.credential && record.credential !== digest_(u.password_hash));
  const campaign = p.enabled && now >= Date.parse(p.starts_at) && record.round !== p.round;
  return { required: Boolean(temporary || campaign), message: temporary ? 'บัญชีนี้ใช้รหัสผ่านชั่วคราว กรุณาตั้งรหัสผ่านใหม่ก่อนใช้งานระบบ' : p.message, min_length: 15, max_length: SECURITY_LIMITS.PASSWORD };
}

// apps/webapp/src/server/features/auth/auth-service.js
function nist118Temporary_(userId) {
  PropertiesService.getScriptProperties().setProperty(nist118UserKey_({ user_id: userId }), JSON.stringify({ temporary: true }));
}

// apps/webapp/src/server/features/auth/auth-service.js
function nist118Password_(value, u) {
  const length = Array.from(value).length;
  if (length < 15 || value.length > SECURITY_LIMITS.PASSWORD) throw Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 15 อักขระ และไม่เกิน ' + SECURITY_LIMITS.PASSWORD + ' ตัวอักษร');
  if (pwHash_(value, u.password_salt) === u.password_hash) throw Error('รหัสผ่านใหม่ต้องไม่ซ้ำรหัสผ่านเดิม');
  const key = value.toLowerCase();
  const common = ['passwordpassword', 'password123456789', '123456789012345', '1234567890123456', 'qwertyuiopasdfgh', 'administrator123', 'password12345678', 'letmeinletmein123'];
  if (/^(.)\1+$/u.test(value) || common.includes(key) || key === String(u.username || '').toLowerCase()) throw Error('รหัสผ่านนี้คาดเดาง่าย กรุณาใช้วลีรหัสผ่านที่ยาวและไม่ซ้ำกับระบบอื่น');
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_getPasswordPolicy_(token) {
  const actor = require_(token);
  if (roleKey_(actor) !== 'ADMIN') throw Error('เฉพาะ ADMIN เท่านั้นที่ตั้งค่านโยบายรหัสผ่านได้');
  return nist118Policy_();
}

// apps/webapp/src/server/features/auth/auth-service.js
function itsdImpl_savePasswordPolicy_(token, input) {
  const actor = requirePermission_(token, 'SETTINGS', 'MANAGE');
  if (roleKey_(actor) !== 'ADMIN') throw Error('เฉพาะ ADMIN เท่านั้นที่ตั้งค่านโยบายรหัสผ่านได้');
  input = plainObject_(input, 'นโยบายรหัสผ่าน');
  project70Reauthenticate_(actor, input.current_password);
  return lock_(() => {
    const previous = nist118Policy_();
    if (input.revision !== previous.revision) throw Error('การตั้งค่าถูกเปลี่ยนแล้ว กรุณาโหลดใหม่');
    const local = boundedText_(input.starts_at, 'วันเวลาเริ่ม', 16, true);
    const starts = local + ':00+07:00';
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local) || !Number.isFinite(Date.parse(starts)) || Utilities.formatDate(new Date(starts), 'Asia/Bangkok', "yyyy-MM-dd'T'HH:mm") !== local) throw Error('วันเวลาเริ่มไม่ถูกต้อง');
    if (typeof input.enabled !== 'boolean' || typeof input.new_round !== 'boolean') throw Error('สถานะนโยบายไม่ถูกต้อง');
    const p = { enabled: input.enabled, starts_at: starts, message: boundedText_(input.message, 'ข้อความแจ้งเตือน', 500, true), round: !previous.round || input.new_round ? Utilities.getUuid() : previous.round, revision: previous.revision + 1, updated_at: now_() };
    if (!p.message) throw Error('กรุณาระบุข้อความแจ้งเตือน');
    PropertiesService.getScriptProperties().setProperty('ITSD_PASSWORD_POLICY', JSON.stringify(p));
    writeAudit_(actor, 'PASSWORD_POLICY_SAVE', 'SETTINGS', 'PASSWORD_POLICY', p.round, 'SUCCESS', 'enabled=' + p.enabled + '; starts_at=' + p.starts_at + '; new_round=' + input.new_round);
    return p;
  });
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function safeSheetValue_(value) {
  if (value === undefined || value === null) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') return value;
  if (typeof value !== 'string') return value;
  const text = value.replace(/\u0000/g, '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function resetRows_(name) {
  delete RUNTIME_CACHE_.headers[name];
  delete RUNTIME_CACHE_.rows[name];
  if (name === 'APP_ROLE_ACTION_PERMISSIONS' && typeof permission_resetActionIndex_ === 'function')
    permission_resetActionIndex_();
  if (typeof admin35ResetPermissionCache_ === 'function') admin35ResetPermissionCache_(name);
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function book_() {
  if (!RUNTIME_CACHE_.book) RUNTIME_CACHE_.book = project70OpenBook_();
  return RUNTIME_CACHE_.book;
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function sheet_(name) {
  if (!RUNTIME_CACHE_.sheets[name]) {
    const s = book_().getSheetByName(name);
    if (!s) throw Error('ระบบฐานข้อมูลไม่พร้อมใช้งาน');
    RUNTIME_CACHE_.sheets[name] = s;
  }
  return RUNTIME_CACHE_.sheets[name];
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function header_(name) {
  if (!RUNTIME_CACHE_.headers[name]) {
    const s = sheet_(name);
    RUNTIME_CACHE_.headers[name] = s.getRange(1, 1, 1, s.getLastColumn()).getDisplayValues()[0];
  }
  return RUNTIME_CACHE_.headers[name];
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function rows_(name) {
  if (!RUNTIME_CACHE_.rows[name]) {
    const v = sheet_(name).getDataRange().getDisplayValues();
    if (!v.length) {
      RUNTIME_CACHE_.rows[name] = [];
      return RUNTIME_CACHE_.rows[name];
    }
    const h = v.shift(),
      out = [];
    for (let i = 0; i < v.length; i++) {
      const r = v[i],
        o = { __row: i + 2 };
      let hasValue = false;
      for (let j = 0; j < h.length; j++) {
        const value = r[j] || '';
        o[h[j]] = value;
        if (value !== '') hasValue = true;
      }
      if (hasValue) out.push(o);
    }
    RUNTIME_CACHE_.rows[name] = out;
  }
  return RUNTIME_CACHE_.rows[name];
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function append_(name, o) {
  const s = sheet_(name),
    h = header_(name);
  s.appendRow(h.map((k) => safeSheetValue_(o[k] === undefined ? '' : o[k])));
  resetRows_(name);
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function update_(name, row, patch) {
  const s = sheet_(name),
    h = header_(name),
    entries = Object.keys(patch)
      .map((k) => [h.indexOf(k), safeSheetValue_(patch[k])])
      .filter((x) => x[0] >= 0);
  if (!entries.length) return;
  if (entries.length === 1) {
    s.getRange(row, entries[0][0] + 1).setValue(entries[0][1]);
    resetRows_(name);
    return;
  }
  entries.sort((a, b) => a[0] - b[0]);
  let start = -1,
    group = [];
  const flush = () => {
    if (start < 0) return;
    const current = s.getRange(row, start + 1, 1, group.length).getValues()[0];
    group.forEach((entry, i) => {
      current[i] = entry[1];
    });
    s.getRange(row, start + 1, 1, group.length).setValues([current]);
  };
  entries.forEach((entry) => {
    if (start < 0 || entry[0] !== start + group.length) {
      flush();
      start = entry[0];
      group = [];
    }
    group.push(entry);
  });
  flush();
  resetRows_(name);
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function find_(name, key, value) {
  return rows_(name).find((r) => r[key] === value);
}

// apps/webapp/src/server/platform/sheets/sheet-repository.js
function rawColumnByRow_(sheetName, headerName) {
  const s = sheet_(sheetName),
    h = header_(sheetName),
    col = h.indexOf(headerName);
  const lastRow = s.getLastRow();
  if (col < 0 || lastRow < 2) return {};
  const values = s.getRange(2, col + 1, lastRow - 1, 1).getValues(),
    out = {};
  for (let i = 0; i < values.length; i++) out[i + 2] = values[i][0];
  return out;
}

// apps/webapp/src/server/shared/date-time.js
function now_() {
  return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
}

// apps/webapp/src/server/shared/date-time.js
function canonicalClientDate_(raw, display) {
  if (Object.prototype.toString.call(raw) === '[object Date]' && !isNaN(raw.getTime())) {
    return Utilities.formatDate(raw, TZ, 'yyyy-MM-dd HH:mm:ss');
  }
  const s = String(display || '').trim();
  if (!s) return '';
  let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    let y = Number(m[1]);
    if (y >= 2400) y -= 543;
    return (
      String(y).padStart(4, '0') +
      '-' +
      String(Number(m[2])).padStart(2, '0') +
      '-' +
      String(Number(m[3])).padStart(2, '0') +
      (m[4] ? ' ' + String(Number(m[4])).padStart(2, '0') + ':' + m[5] + ':' + (m[6] || '00') : '')
    );
  }
  m = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    let y = Number(m[3]);
    if (y >= 2400) y -= 543;
    return (
      String(y).padStart(4, '0') +
      '-' +
      String(Number(m[2])).padStart(2, '0') +
      '-' +
      String(Number(m[1])).padStart(2, '0') +
      (m[4] ? ' ' + String(Number(m[4])).padStart(2, '0') + ':' + m[5] + ':' + (m[6] || '00') : '')
    );
  }
  return s;
}

// apps/webapp/src/server/platform/locks/script-lock.js
function lock_(fn) {
  const l = LockService.getScriptLock();
  l.waitLock(20000);
  try {
    return fn();
  } finally {
    l.releaseLock();
  }
}

// apps/webapp/src/server/platform/crypto/password-crypto.js
function digest_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)
    .map((b) => ('0' + (b & 255).toString(16)).slice(-2))
    .join('');
}

// apps/webapp/src/server/platform/crypto/password-crypto.js
function random_() {
  return Utilities.getUuid() + Utilities.getUuid();
}

// apps/webapp/src/server/platform/crypto/password-crypto.js
function pwHash_(password, salt) {
  let value = salt + ':' + password;
  for (let i = 0; i < 12000; i++) value = digest_(value + ':' + salt);
  return value;
}

// apps/webapp/src/server/features/tickets/ticket-policy.js
function ticketAssigneeKeys_(ticket, meta) {
  return [meta && meta.assigned_to, ticket && ticket['ผู้ดำเนินการ']]
    .map((v) =>
      String(v || '')
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean);
}

// apps/webapp/src/server/features/tickets/ticket-policy.js
function isTicketAssignedToUser_(u, ticket, meta) {
  const keys = identityKeys_(u);
  return ticketAssigneeKeys_(ticket, meta).some((v) => keys.includes(v));
}

// apps/webapp/src/server/features/tickets/ticket-policy.js
function isTicketVisibleForUser_(u, ticket, meta) {
  if (typeof ticketPermission_canView_ === 'function')
    return ticketPermission_canView_(u, ticket, meta);
  const role = roleKey_(u),
    reporter = String((ticket && ticket['ผู้แจ้งปัญหา']) || '').trim();
  if (['ADMIN', 'MANAGER'].includes(role)) return true;
  if (reporter && reporter === String((u && u.display_name) || '').trim()) return true;
  if (['TECHNICIAN', 'ITSUPPORT'].includes(role) && isTicketAssignedToUser_(u, ticket, meta)) return true;
  return false;
}

// apps/webapp/src/server/features/tickets/ticket-policy.js
function ownTicket_(u, id) {
  if (!hasPermissionForUser_(u, 'TICKETS', 'VIEW')) throw Error('ไม่มีสิทธิ์เข้ารายการแจ้งซ่อม');
  id = boundedText_(id, 'เลขที่แจ้งปัญหา', 80, true);
  const t = find_('INCIDENT', 'เลขที่แจ้งปัญหา', id);
  if (!t) throw Error('ไม่พบเลขที่แจ้งปัญหา');
  const meta = find_('INCIDENT_META', 'ticket_id', id) || {};
  if (!isTicketVisibleForUser_(u, t, meta)) throw Error('ไม่มีสิทธิ์เข้าถึงงานนี้');
  return t;
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardScopeLabelFor_(u) {
  const role = roleKey_(u);
  if (['ADMIN', 'MANAGER'].includes(role) || permission_hasAction_(u, 'ticket.manage_all'))
    return 'ORGANIZATION_AGGREGATE';
  if (role === 'TECHNICIAN' || role === 'ITSUPPORT') return 'TECHNICIAN_RELATED';
  return 'USER_OWN_TICKETS';
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardDateKeyServer_(raw, display) {
  const canonical = canonicalClientDate_(raw, display);
  const m = String(canonical || '').match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardShiftDateServer_(key, days) {
  const m = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + Number(days || 0)));
  return (
    d.getUTCFullYear() +
    '-' +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getUTCDate()).padStart(2, '0')
  );
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardRangeServer_(range, today) {
  const end = today || Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  if (range === 'month') {
    const start = end.slice(0, 7) + '-01';
    const days = Math.max(
      1,
      Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000) +
        1,
    );
    return { start, end, days, label: 'เดือนนี้' };
  }
  const days = Math.max(1, Number(range) || 30);
  return {
    start: dashboardShiftDateServer_(end, -(days - 1)),
    end,
    days,
    label: days + ' วันล่าสุด',
  };
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardGroupServer_(rows, key, fallback) {
  const counts = {};
  (rows || []).forEach((x) => {
    const name = String(x[key] || fallback || 'อื่นๆ').trim() || fallback || 'อื่นๆ';
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.keys(counts)
    .map((name) => [name, counts[name]])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'th'));
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardStatusGroupsServer_(rows) {
  const order = ['แจ้งเรื่อง', 'รับแจ้ง', 'มอบหมาย', 'กำลังดำเนินการ', 'รอยืนยันผล', 'ปิดงาน'],
    counts = {};
  order.forEach((x) => (counts[x] = 0));
  (rows || []).forEach((x) => {
    const s = x.status || 'แจ้งเรื่อง';
    counts[s] = (counts[s] || 0) + 1;
  });
  return order.filter((x) => counts[x]).map((x) => [x, counts[x]]);
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardSeriesServer_(rows, range) {
  const map = {};
  (rows || []).forEach((x) => {
    map[x.date] = (map[x.date] || 0) + 1;
  });
  const series = [];
  for (let i = 0; i < range.days; i++) {
    const key = dashboardShiftDateServer_(range.start, i);
    series.push({ key, all: map[key] || 0 });
  }
  return series;
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardPercentDeltaServer_(current, previous) {
  current = Number(current || 0);
  previous = Number(previous || 0);
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardSummaryServer_(rows) {
  let open = 0,
    inProgress = 0,
    closed = 0;
  (rows || []).forEach((row) => {
    if (row.status === 'ปิดงาน') closed++;
    else open++;
    if (row.status === 'กำลังดำเนินการ') inProgress++;
  });
  const total = open + closed;
  return {
    total,
    open,
    inProgress,
    closed,
    closeRate: total ? Math.round((closed / total) * 100) : 0,
  };
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardSliceServer_(facts, rangeKey, current7, previous7) {
  const range = dashboardRangeServer_(rangeKey),
    rows = [],
    previous = [];
  const previousRange = {
    start: dashboardShiftDateServer_(range.start, -range.days),
    end: dashboardShiftDateServer_(range.start, -1),
    days: range.days,
  };
  (facts || []).forEach((fact) => {
    if (fact.date >= range.start && fact.date <= range.end) rows.push(fact);
    else if (fact.date >= previousRange.start && fact.date <= previousRange.end) previous.push(fact);
  });
  const now = dashboardSummaryServer_(rows),
    before = dashboardSummaryServer_(previous),
    devices = dashboardGroupServer_(rows, 'device', 'อื่นๆ'),
    problems = dashboardGroupServer_(rows, 'type', 'อื่นๆ'),
    statuses = dashboardStatusGroupsServer_(rows);
  const trend =
    current7 > previous7
      ? 'ช่วง 7 วันล่าสุด การแจ้งเพิ่มขึ้น ' + (current7 - previous7) + ' รายการจากช่วงก่อนหน้า'
      : current7 < previous7
        ? 'ช่วง 7 วันล่าสุด การแจ้งลดลง ' + (previous7 - current7) + ' รายการจากช่วงก่อนหน้า'
        : 'ช่วง 7 วันล่าสุด จำนวนการแจ้งใกล้เคียงช่วงก่อนหน้า';
  const topDevice = devices[0]
    ? 'อุปกรณ์กลุ่ม ' + devices[0][0] + ' มีการแจ้งสูงสุด ' + devices[0][1] + ' รายการ'
    : 'ยังไม่มีข้อมูลประเภทอุปกรณ์';
  const topProblem = problems[0]
    ? 'ปัญหาที่พบบ่อยที่สุดคือ ' + problems[0][0] + ' (' + problems[0][1] + ' รายการ)'
    : 'ยังไม่มีข้อมูลประเภทปัญหา';
  return {
    range,
    total: now.total,
    open: now.open,
    inProgress: now.inProgress,
    closed: now.closed,
    closeRate: now.closeRate,
    delta: {
      total: dashboardPercentDeltaServer_(now.total, before.total),
      open: dashboardPercentDeltaServer_(now.open, before.open),
      inProgress: dashboardPercentDeltaServer_(now.inProgress, before.inProgress),
      closed: dashboardPercentDeltaServer_(now.closed, before.closed),
      closeRate: dashboardPercentDeltaServer_(now.closeRate, before.closeRate),
    },
    series: dashboardSeriesServer_(rows, range),
    devices,
    problems,
    statuses,
    insights: [trend, topDevice, topProblem, 'งานที่ยังไม่ปิดในช่วงที่เลือก ' + now.open + ' รายการ'],
  };
}

// apps/webapp/src/server/features/dashboard/dashboard-analytics.js
function dashboardAnalyticsFor_(incidents, reportedRaw, scope) {
  const facts = [],
    invalid = [];
  (incidents || []).forEach((x) => {
    const date = dashboardDateKeyServer_((reportedRaw || {})[x.__row], x['วันที่และเวลาที่แจ้ง']);
    if (!date) {
      invalid.push(x.__row);
      return;
    }
    facts.push({
      date,
      device: String(x['ประเภทอุปกรณ์'] || 'อื่นๆ').trim() || 'อื่นๆ',
      type: String(x['ประเภทปัญหาการแจ้งซ่อม'] || 'อื่นๆ').trim() || 'อื่นๆ',
      status: String(x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง').trim() || 'แจ้งเรื่อง',
    });
  });
  const r7 = dashboardRangeServer_('7'),
    r14 = { start: dashboardShiftDateServer_(r7.start, -7), end: r7.end };
  const current7 = facts.filter((x) => x.date >= r7.start && x.date <= r7.end).length;
  const previous7 = facts.filter((x) => x.date >= r14.start && x.date < r7.start).length;
  return {
    generated_at: now_(),
    scope: scope || 'ROLE_SCOPED',
    privacy: 'ROLE_SCOPED_NO_UNAUTHORIZED_TICKET_DETAILS',
    invalid_date_count: invalid.length,
    ranges: {
      7: dashboardSliceServer_(facts, '7', current7, previous7),
      15: dashboardSliceServer_(facts, '15', current7, previous7),
      30: dashboardSliceServer_(facts, '30', current7, previous7),
      60: dashboardSliceServer_(facts, '60', current7, previous7),
      90: dashboardSliceServer_(facts, '90', current7, previous7),
      month: dashboardSliceServer_(facts, 'month', current7, previous7),
    },
  };
}

// apps/webapp/src/server/app/bootstrap-service.js
function publicUser_(u) {
  return {
    user_id: u.user_id,
    username: u.username,
    display_name: u.display_name,
    role: u.role,
    active: u.active === 'TRUE',
  };
}

// apps/webapp/src/server/app/bootstrap-service.js
function itsdImpl_getBootstrap_(token) {
  const u = require_(token, false, true);
  const passwordChange = nist118Status_(u);
  if (passwordChange.required) return { user: publicUser_(u), password_change: passwordChange };
  const inv = rows_('INVENTORY'),
    incidents = rows_('INCIDENT'),
    meta = rows_('INCIDENT_META');
  const reportedRaw = rawColumnByRow_('INCIDENT', 'วันที่และเวลาที่แจ้ง'),
    startedRaw = rawColumnByRow_('INCIDENT', 'วันที่และเวลาเข้าแก้ไข');
  const byId = Object.fromEntries(meta.map((x) => [x.ticket_id, x]));
  const org = rows_('MST_ORG_UNITS').map((x) => ({
    id: x.org_unit_id,
    name: x.org_full_name,
    level: x.org_level,
    first: x.first_org_unit_id,
    second: x.second_org_unit_id,
    location: x.location,
  }));
  const settings = Object.fromEntries(rows_('APP_SETTINGS').map((x) => [x.key, x.value])),
    branding = getSystemBranding_(settings);
  const canViewTickets = hasPermissionForUser_(u, 'TICKETS', 'VIEW');
  const visibleIncidents = canViewTickets
    ? incidents.filter((x) => isTicketVisibleForUser_(u, x, byId[x['เลขที่แจ้งปัญหา']] || {}))
    : [];
  const tickets = visibleIncidents.map((x) => ticketPayload_(x, reportedRaw, byId, u));
  const trackingQueue = canViewTickets
    ? trackingQueueFor_(u, incidents, reportedRaw, startedRaw, byId, visibleIncidents)
    : [];
  const dashboardAnalytics = dashboardAnalyticsFor_(
    visibleIncidents,
    reportedRaw,
    dashboardScopeLabelFor_(u),
  );
  return {
    version: APP_VERSION,
    environment: project70Binding_()?.environment || 'PRODUCTION',
    user: publicUser_(u),
    settings,
    branding,
    adminAccess: getAdminAccessForUser_(u),
    actionPermissions: [],
    userActions: actionKeysForRole_(u),
    tickets,
    trackingQueue,
    dashboardAnalytics,
    inventory: inv.map((x) => ({
      id: x['รหัสอุปกรณ์'],
      type: x['ประเภทอุปกรณ์'],
      brand: x['ยี่ห้อ'],
      model: x['รุ่น'],
      serial: x['หมายเลขซีเรียล'],
      asset_no: x['เลขครุภัณฑ์'],
      owner: x['ชื่อผู้รับผิดชอบ'],
      org: x['หน่วยงานหลัก'],
      suborg: x['หน่วยงานย่อย'],
      location: x['สถานที่ติดตั้ง'],
      building: x['อาคาร'],
      floor: x['ชั้น'],
      year: x['ปีงบประมาณที่จัดซื้อ'],
      status: x['สถานะครุภัณฑ์'],
      os: x['Operating System'],
      cpu: x['CPU Brand'],
      speed: x['CPU Speed'],
      ram: x['RAM'],
      disk: x['Harddisk'],
      ip: x['IP Address'],
      survey_at: x['วันที่สำรวจ'],
      inspector: x['ผู้ตรวจสอบ'],
      inspection_status: x['สถานะตรวจสอบ'],
    })),
    org,
    users: hasPermissionForUser_(u, 'USER_MANAGEMENT', 'VIEW')
      ? rows_('APP_USERS').map(publicUser_)
      : [],
    types: lookupLabels_('PROBLEM', TYPES),
    devices: lookupLabels_('DEVICE', DEVICE_DEFAULTS),
    brands: deviceBrandChoices_(),
    deviceModels: deviceModelChoices_(),
    assetStatuses: INVENTORY_STATUSES_,
    statuses: STATUS,
  };
}

// apps/webapp/src/server/entrypoints/webapp.js
function itsdImpl_doGet_() {
  const b = getSystemBranding_(),
    template = HtmlService.createTemplateFromFile('Index');
  template.publicBrandingJson = publicBrandingJson_(b);
  template.appVersion = APP_VERSION;
  return template
    .evaluate()
    .setTitle(b.short_name || b.project_name)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content');
}

// apps/webapp/src/server/entrypoints/webapp.js
function itsdImpl_include_(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

// apps/webapp/src/server/maintenance/system-setup.js
function setupSystem_() {
  return lock_(() => {
    const b = book_();
    ['INVENTORY', 'INCIDENT', 'MST_ORG_UNITS'].forEach((n) => {
      if (!b.getSheetByName(n)) throw Error('ไม่พบแท็บต้นทาง ' + n);
    });
    Object.keys(COL)
      .filter((n) => !['INVENTORY', 'INCIDENT'].includes(n))
      .forEach((n) => {
        let s = b.getSheetByName(n);
        if (!s) {
          s = b.insertSheet(n);
          s.getRange(1, 1, 1, COL[n].length).setValues([COL[n]]);
          s.setFrozenRows(1);
          s.getRange(1, 1, 1, COL[n].length)
            .setBackground('#102b49')
            .setFontColor('#ffffff')
            .setFontWeight('bold');
        }
      });
    if (!find_('APP_SETTINGS', 'key', 'project_name'))
      append_('APP_SETTINGS', {
        key: 'project_name',
        value: SYSTEM_BRANDING_DEFAULTS.project_name,
      });
    [
      'service_folder_id',
      'backup_folder_id',
      'documents_folder_id',
      'pictures_folder_id',
      'system_assets_folder_id',
    ].forEach((key) => {
      if (!find_('APP_SETTINGS', 'key', key)) append_('APP_SETTINGS', { key, value: '' });
    });
    ensureLookups_();
    ensureAdminModuleSchema_();
    if (typeof permission_seedActionPermissions_ === 'function')
      permission_seedActionPermissions_();
    return 'ตรวจสอบโครงสร้างและข้อมูลอ้างอิงสำเร็จ';
  });
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function ticketPayload_(x, reportedRaw, byId, u) {
  const id = x['เลขที่แจ้งปัญหา'],
    meta = (byId || {})[id] || {},
    status = x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง';
  const payload = {
    id,
    reported_at: canonicalClientDate_(reportedRaw[x.__row], x['วันที่และเวลาที่แจ้ง']),
    reporter: x['ผู้แจ้งปัญหา'],
    phone: x['เบอร์โทร'],
    device: x['ประเภทอุปกรณ์'],
    asset_no: x['เลขครุภัณฑ์'],
    serial: x['หมายเลขซีเรียล'] || '',
    brand: x['ยี่ห้อ'] || '',
    model: x['รุ่น'] || '',
    description: x['รายละเอียดคำขอ / อาการเสีย'],
    org: x['หน่วยงานหลัก'],
    suborg: x['หน่วยงานย่อย'],
    priority: x['ระดับความเร่งด่วน'],
    channel: x['ช่องทางรับแจ้ง'],
    started_at: x['วันที่และเวลาเข้าแก้ไข'],
    type: x['ประเภทปัญหาการแจ้งซ่อม'],
    resolution: x['รายละเอียดการดำเนินงาน / วิธีแก้ไข'],
    technician: x['ผู้ดำเนินการ'],
    finished_at: x['วันที่และเวลาแก้ไขเสร็จ'],
    status,
    note: x['หมายเหตุ'],
    attachment: x['เอกสารแนบ'],
    asset_id: meta.asset_id || '',
    assigned_to: meta.assigned_to || '',
  };
  if (u) {
    payload.available_statuses = statusTargetsFor_(u, status, x, meta);
    payload.can_update_status = payload.available_statuses.length > 0;
    payload.can_accept = payload.available_statuses.indexOf('รับแจ้ง') >= 0;
    payload.can_close = payload.available_statuses.indexOf('ปิดงาน') >= 0;
    payload.can_reopen = false;
    payload.can_cancel = false;
  }
  return payload;
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function nextTicket_() {
  const d = new Date(),
    year =
      Number(Utilities.formatDate(d, TZ, 'yyyy')) +
      (Number(Utilities.formatDate(d, TZ, 'MM')) >= 10 ? 1 : 0),
    day = Utilities.formatDate(d, TZ, 'MM-dd'),
    prefix = 'INC-' + year + '-' + day + '-';
  const nums = rows_('INCIDENT')
    .map((r) => r['เลขที่แจ้งปัญหา'])
    .filter((s) => s && s.startsWith(prefix))
    .map((s) => Number(s.slice(prefix.length)) || 0);
  return prefix + ('0000' + (Math.max(0, ...nums) + 1)).slice(-4);
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_createTicket_(token, data) {
  const u = require_(token);
  if (!hasPermissionForUser_(u, 'NEW_TICKET', 'CREATE'))
    throw Error('ไม่มีสิทธิ์สร้างรายการแจ้งซ่อม');
  data = plainObject_(data || {}, 'ข้อมูลคำขอ');
  const lineInboxId = boundedText_(data.line_inbox_id, 'รหัสข้อความ LINE', 80, true);
  if (lineInboxId) {
    if (!/^[0-9a-fA-F-]{36}$/.test(lineInboxId)) throw Error('INVALID_LINE_INBOX_ID');
    lineLegacyRequire_(token, 'approve');
  }
    const reporter = (['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)) || permission_hasAction_(u, 'ticket.create_for_user'))
      ? boundedText_(
          data.reporter || u.display_name,
          'ผู้แจ้งปัญหา',
          SECURITY_LIMITS.REPORTER,
          true,
        )
      : boundedText_(u.display_name, 'ผู้แจ้งปัญหา', SECURITY_LIMITS.REPORTER, true),
    phone = boundedText_(data.phone, 'เบอร์โทร', SECURITY_LIMITS.PHONE, true),
    description = boundedText_(
      data.description,
      'รายละเอียดคำขอ / อาการเสีย',
      SECURITY_LIMITS.DESCRIPTION,
      true,
    ),
    assetId = boundedText_(data.asset_id, 'รหัสอุปกรณ์', SECURITY_LIMITS.ASSET_ID, true),
    device = boundedText_(data.device, 'ประเภทอุปกรณ์', SECURITY_LIMITS.DEVICE, true),
    org = boundedText_(data.org, 'หน่วยงานหลัก', SECURITY_LIMITS.ORG, true),
    suborg = boundedText_(data.suborg, 'หน่วยงานย่อย', SECURITY_LIMITS.ORG, true),
    channel = boundedText_(
      data.channel || 'WebApp',
      'ช่องทางรับแจ้ง',
      SECURITY_LIMITS.CHANNEL,
      true,
    ),
    type = boundedText_(data.type || 'อื่นๆ', 'ประเภทปัญหา', 120, true);
  if (
    !permission_hasAction_(
      u,
      reporter === u.display_name ? 'ticket.create' : 'ticket.create_for_user',
    ) &&
    !(['TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)) && permission_hasAction_(u, 'ticket.create_for_user'))
  )
    throw Error('ไม่มีสิทธิ์สร้างรายการแจ้งซ่อม');
  if (!description || !reporter) throw Error('กรุณาระบุผู้แจ้งและรายละเอียดคำขอ / อาการเสีย');
  if (type && !lookupLabels_('PROBLEM', TYPES).includes(type)) throw Error('ประเภทปัญหาไม่ถูกต้อง');
  const priority = normalizePriority_(data.priority || 'ปกติ (Normal)');
  if (!priority)
    throw Error('ระดับความเร่งด่วนไม่ถูกต้อง กรุณาเลือก Normal, Low, Medium, High หรือ Critical');
  return lock_(() => {
    let lineRow = null;
    if (lineInboxId) {
      lineRow = lineLegacyFind_(lineInboxId);
      if (!lineRow) throw Error('LINE_INBOX_NOT_FOUND');
      if (lineRow.ticket_id || lineRow.review_status === 'CREATED')
        throw Error('LINE_INBOX_ALREADY_CREATED');
      if (lineRow.review_status === 'CREATING') throw Error('LINE_INBOX_RECONCILIATION_REQUIRED');
      if (lineRow.review_status === 'REJECTED') throw Error('LINE_INBOX_REJECTED');
      if (
        !['PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'FAILED'].includes(
          lineRow.review_status || 'PENDING_REVIEW',
        )
      )
        throw Error('LINE_INBOX_NOT_APPROVABLE');
      if (
        data.line_review_revision !== undefined &&
        data.line_review_revision !== null &&
        data.line_review_revision !== ''
      ) {
        const rev = lineLegacyGetReview_(lineInboxId);
        if (Number(data.line_review_revision) !== Number(rev ? rev.revision : 0))
          throw Error('LINE_REVIEW_STALE');
      }
    }
    let asset = null;
    if (assetId) {
      asset = find_('INVENTORY', 'รหัสอุปกรณ์', assetId);
      if (!asset) throw Error('ไม่พบรหัสอุปกรณ์');
    }
    const id = nextTicket_(),
      date = now_(),
      sourceChannel = lineInboxId ? 'LINE' : channel;
    append_('INCIDENT', {
      เลขที่แจ้งปัญหา: id,
      วันที่และเวลาที่แจ้ง: date,
      ผู้แจ้งปัญหา: reporter,
      เบอร์โทร: phone,
      ประเภทอุปกรณ์: asset ? asset['ประเภทอุปกรณ์'] : device,
      ยี่ห้อ: asset ? asset['ยี่ห้อ'] : '',
      รุ่น: asset ? asset['รุ่น'] : '',
      หมายเลขซีเรียล: asset ? asset['หมายเลขซีเรียล'] : '',
      เลขครุภัณฑ์: asset ? asset['เลขครุภัณฑ์'] : '',
      'รายละเอียดคำขอ / อาการเสีย': description,
      หน่วยงานหลัก: asset ? asset['หน่วยงานหลัก'] : org,
      หน่วยงานย่อย: asset ? asset['หน่วยงานย่อย'] : suborg,
      ระดับความเร่งด่วน: priority,
      ช่องทางรับแจ้ง: sourceChannel,
      ผู้รับแจ้ง: '',
      ประเภทปัญหาการแจ้งซ่อม: type,
      สถานะการแจ้งซ่อม: 'แจ้งเรื่อง',
    });
    append_('INCIDENT_META', {
      ticket_id: id,
      asset_id: assetId,
      updated_at: date,
      reopen_count: 0,
    });
    append_('INCIDENT_EVENTS', {
      event_id: Utilities.getUuid(),
      ticket_id: id,
      from_status: '',
      to_status: 'แจ้งเรื่อง',
      actor_id: u.user_id,
      event_at: date,
      note: lineInboxId ? 'สร้างรายการจาก LINE (' + lineInboxId + ')' : 'สร้างรายการ',
    });
    if (lineInboxId && lineRow) {
      lineLegacyUpdate_(lineRow.__row, { review_status: 'CREATED', ticket_id: id });
      lineLegacyAudit_(
        u,
        'LINE_TICKET_CREATED',
        lineInboxId,
        'SUCCESS',
        id + ' (via New Ticket Form)',
      );
    }
    return id;
  });
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function ticketApplyDevicePatch_(raw, patch, metaPatch) {
  if (!raw || typeof raw !== 'object') return false;
  const has = (k) => Object.prototype.hasOwnProperty.call(raw, k);
  if (!['asset_id', 'asset_no', 'brand', 'model', 'serial', 'device'].some(has)) return false;
  let asset = null;
  if (has('asset_id')) {
    const aid = boundedText_(raw.asset_id, 'รหัสอุปกรณ์', SECURITY_LIMITS.ASSET_ID, true);
    if (aid) {
      asset = find_('INVENTORY', 'รหัสอุปกรณ์', aid);
      if (!asset) throw Error('ไม่พบรหัสอุปกรณ์ที่เลือก');
      metaPatch.asset_id = aid;
    } else {
      metaPatch.asset_id = '';
    }
  }
  const readVal = (k, max, invCol, label) => {
    if (has(k)) {
      const explicit = boundedText_(raw[k], label, max, true);
      return explicit || (asset ? String(asset[invCol] || '').trim() : '');
    }
    return asset ? String(asset[invCol] || '').trim() : undefined;
  };
  const assetNo = readVal('asset_no', 120, 'เลขครุภัณฑ์', 'เลขครุภัณฑ์');
  const brand = readVal('brand', 120, 'ยี่ห้อ', 'ยี่ห้อ');
  const model = readVal('model', 120, 'รุ่น', 'รุ่น');
  const serial = readVal('serial', 120, 'หมายเลขซีเรียล', 'หมายเลขซีเรียล');
  const device = readVal('device', SECURITY_LIMITS.DEVICE, 'ประเภทอุปกรณ์', 'ประเภทอุปกรณ์');
  if (assetNo !== undefined) patch['เลขครุภัณฑ์'] = assetNo;
  if (brand !== undefined) patch['ยี่ห้อ'] = brand;
  if (model !== undefined) patch['รุ่น'] = model;
  if (serial !== undefined) patch['หมายเลขซีเรียล'] = serial;
  if (device !== undefined && device !== '') patch['ประเภทอุปกรณ์'] = device;
  return true;
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_changeStatus_(token, id, to, detail) {
  const u = require_(token);
  if (!hasPermissionForUser_(u, 'TICKETS', ticketPermission_isRequesterOnly_(u) ? 'VIEW' : 'EDIT'))
    throw Error('ไม่มีสิทธิ์แก้ไขรายการแจ้งซ่อม');
  id = boundedText_(id, 'เลขที่แจ้งปัญหา', 80, true);
  to = boundedText_(to, 'สถานะ', 40, true);
  const raw = plainObject_(detail || {}, 'รายละเอียดสถานะ'),
    d = {
      assigned_to: boundedText_(raw.assigned_to, 'ผู้ดำเนินการ', SECURITY_LIMITS.ASSIGNEE, true),
      resolution: boundedText_(
        raw.resolution,
        'รายละเอียดการดำเนินงาน',
        SECURITY_LIMITS.RESOLUTION,
        true,
      ),
      note: boundedText_(raw.note, 'หมายเหตุ', SECURITY_LIMITS.STATUS_NOTE, true),
      confirmed_by: boundedText_(raw.confirmed_by, 'ผู้ยืนยัน', SECURITY_LIMITS.DISPLAY_NAME, true),
      service_file_id: boundedText_(raw.service_file_id, 'รหัสไฟล์', SECURITY_LIMITS.FILE_ID, true),
    };
  const canEditDevice =
    !ticketPermission_isRequesterOnly_(u) && !['REQUESTER', 'USER'].includes(roleKey_(u));
  const rawDevicePatch =
    canEditDevice && raw.device_patch !== undefined
      ? plainObject_(raw.device_patch, 'ข้อมูลอุปกรณ์')
      : null;
  if (!STATUS.includes(to)) throw Error('สถานะไม่ถูกต้อง');
  return lock_(() => {
    const ticket = ownTicket_(u, id),
      from = ticket['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง';
    let meta = find_('INCIDENT_META', 'ticket_id', id) || {};
    const permissionPlan =
      typeof ticketPermission_prepareChange_ === 'function'
        ? ticketPermission_prepareChange_(u, ticket, meta, to, d)
        : {};
    if (!statusTargetsFor_(u, from, ticket, meta).includes(to))
      throw Error('เปลี่ยนสถานะจาก ' + from + ' เป็น ' + to + ' ไม่ได้');
    if (to === 'มอบหมาย' && !d.assigned_to && !['TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)))
      throw Error('กรุณาระบุผู้ดำเนินการ');
    if (['รอยืนยันผล', 'ปิดงาน'].includes(to) && !d.resolution)
      throw Error('กรุณาระบุรายละเอียดการดำเนินงาน / วิธีแก้ไข');
    if (d.service_file_id) {
      const file = find_('INCIDENT_FILES', 'drive_file_id', d.service_file_id);
      if (!file || file.ticket_id !== id) throw Error('ไม่พบเอกสารแนบของงานนี้');
    }
    const date = now_(),
      patch = { สถานะการแจ้งซ่อม: to },
      mp = { updated_at: date };
    if (rawDevicePatch) ticketApplyDevicePatch_(rawDevicePatch, patch, mp);
    if (to === 'รับแจ้ง') patch['ผู้รับแจ้ง'] = u.display_name || u.username || u.user_id;
    const working = ['กำลังดำเนินการ', 'รอยืนยันผล', 'ปิดงาน'];
    if (working.includes(to) && !ticket['วันที่และเวลาเข้าแก้ไข'])
      patch['วันที่และเวลาเข้าแก้ไข'] = date;
    if (['รอยืนยันผล', 'ปิดงาน'].includes(to) && !ticket['วันที่และเวลาแก้ไขเสร็จ'])
      patch['วันที่และเวลาแก้ไขเสร็จ'] = date;
    if (d.resolution) patch['รายละเอียดการดำเนินงาน / วิธีแก้ไข'] = d.resolution;
    const assignee =
      (to === 'มอบหมาย' ? d.assigned_to || permissionPlan.assigned_to : '') ||
      ticket['ผู้ดำเนินการ'] ||
      meta.assigned_to ||
      '';
    if (assignee) patch['ผู้ดำเนินการ'] = assignee;
    update_('INCIDENT', ticket.__row, patch);
    meta = find_('INCIDENT_META', 'ticket_id', id);
    if (!meta) {
      append_('INCIDENT_META', { ticket_id: id });
      meta = find_('INCIDENT_META', 'ticket_id', id);
    }
    if (assignee) mp.assigned_to = assignee;
    if (to === 'ปิดงาน') {
      mp.closed_at = date;
      if (d.confirmed_by) Object.assign(mp, { confirmed_by: d.confirmed_by, confirmed_at: date });
    }
    update_('INCIDENT_META', meta.__row, mp);
    append_('INCIDENT_EVENTS', {
      event_id: Utilities.getUuid(),
      ticket_id: id,
      from_status: from,
      to_status: to,
      actor_id: u.user_id,
      event_at: date,
      note: d.note,
    });
    if (typeof permissionAudit_log_ === 'function')
      permissionAudit_log_(
        u,
        'TICKET_STATUS_CHANGE',
        'ticket',
        id,
        'SUCCESS',
        'from=' + from + ';to=' + to + ';action=' + (permissionPlan.action_key || ''),
      );
    return true;
  });
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_getTicketHistory_(token, id) {
  const u = require_(token);
  ownTicket_(u, id);
  return {
    events: rows_('INCIDENT_EVENTS').filter((x) => x.ticket_id === id),
    files: rows_('INCIDENT_FILES')
      .filter((x) => x.ticket_id === id)
      .map((x) => ({ id: x.drive_file_id, name: x.file_name, kind: x.kind, date: x.uploaded_at })),
  };
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_acceptTicket_(token, id, note) {
  require_(token);
  return changeStatus(token, id, 'รับแจ้ง', { note: note || 'รับแจ้ง' });
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_assignTicketToMe_(token, id, note) {
  const u = require_(token);
  return changeStatus(token, id, 'มอบหมาย', {
    assigned_to: u.display_name || u.username || u.user_id,
    note: note || 'มอบหมายให้ตนเอง',
  });
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_updateTicketStatus_(token, id, status, detail) {
  return changeStatus(token, id, status, detail || {});
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_saveTicketStatus_(token, id, status, detail) {
  return changeStatus(token, id, status, detail || {});
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_updateTicketWorkflow_(token, payload) {
  payload = plainObject_(payload || {}, 'ข้อมูล Workflow');
  return changeStatus(
    token,
    payload.id || payload.ticket_id,
    payload.status || payload.to_status,
    payload.detail || payload,
  );
}

// apps/webapp/src/server/features/tickets/ticket-service.js
function itsdImpl_technicianAcceptTicket_(token, id) {
  return acceptTicket(token, id, 'รับแจ้ง');
}

// apps/webapp/src/server/features/tickets/tracking-queue.js
function trackingPriorityRank_(value) {
  const priority = normalizePriority_(value) || 'ปกติ (Normal)';
  return (
    {
      'วิกฤต (Critical)': 0,
      'สูง (High)': 1,
      'ปานกลาง (Medium)': 2,
      'ปกติ (Normal)': 3,
      'ต่ำ (Low)': 4,
    }[priority] ?? 3
  );
}

// apps/webapp/src/server/features/tickets/tracking-queue.js
function trackingTimeMs_(raw, display) {
  if (Object.prototype.toString.call(raw) === '[object Date]' && !isNaN(raw.getTime()))
    return raw.getTime();
  const canonical = canonicalClientDate_(raw, display);
  const m = String(canonical || '').match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Date.UTC(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4] || 0),
    Number(m[5] || 0),
    Number(m[6] || 0),
  );
}

// apps/webapp/src/server/features/tickets/tracking-queue.js
function trackingQueueFor_(u, incidents, reportedRaw, startedRaw, metaById, visibleIncidents) {
  const queue = incidents
    .filter((x) => TRACKING_QUEUE_STATUSES.includes(x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง'))
    .map((x) => ({
      id: x['เลขที่แจ้งปัญหา'],
      status: x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง',
      priority: x['ระดับความเร่งด่วน'],
      reported: trackingTimeMs_(reportedRaw[x.__row], x['วันที่และเวลาที่แจ้ง']),
      started: trackingTimeMs_(startedRaw[x.__row], x['วันที่และเวลาเข้าแก้ไข']),
    }))
    .sort((a, b) => {
      const activeA = a.status === 'กำลังดำเนินการ' ? 0 : 1,
        activeB = b.status === 'กำลังดำเนินการ' ? 0 : 1;
      if (activeA !== activeB) return activeA - activeB;
      if (activeA === 0) {
        const sa = Number.isFinite(a.started) ? a.started : a.reported,
          sb = Number.isFinite(b.started) ? b.started : b.reported;
        if (sa !== sb) return sa - sb;
      }
      const pa = trackingPriorityRank_(a.priority),
        pb = trackingPriorityRank_(b.priority);
      if (pa !== pb) return pa - pb;
      const stage = { กำลังดำเนินการ: 0, มอบหมาย: 1, รับแจ้ง: 2, แจ้งเรื่อง: 3 };
      const ga = stage[a.status] ?? 4,
        gb = stage[b.status] ?? 4;
      if (ga !== gb) return ga - gb;
      if (a.reported !== b.reported) return a.reported - b.reported;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  const positions = Object.fromEntries(queue.map((x, i) => [x.id, i + 1]));
  const visible = (visibleIncidents || incidents.filter((x) =>
    isTicketVisibleForUser_(u, x, (metaById || {})[x['เลขที่แจ้งปัญหา']] || {})))
    .map((x) => {
      const id = x['เลขที่แจ้งปัญหา'],
        status = x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง',
        position = positions[id] || 0;
      return {
        id,
        status,
        position: position || null,
        ahead: position ? position - 1 : null,
        near: Boolean(position && position <= 4),
        queue_state: position
          ? 'queued'
          : status === 'รอยืนยันผล'
            ? 'waiting_confirmation'
            : status === 'ปิดงาน'
              ? 'closed'
              : 'not_queued',
      };
    });
  return {
    updated_at: now_(),
    active_queue_count: queue.length,
    in_progress_count: incidents.filter(
      (x) => (x['สถานะการแจ้งซ่อม'] || 'แจ้งเรื่อง') === 'กำลังดำเนินการ',
    ).length,
    items: visible,
  };
}

// apps/webapp/src/server/features/permissions/user-actions.js
function actionKeysForRole_(roleOrUser) {
  const role = roleKey_(roleOrUser);
  const keys = {};
  permission_actionRows_()
    .filter(
      (r) =>
        String(r.role_key || '')
          .trim()
          .toUpperCase() === role,
    )
    .forEach((r) => {
      keys[String(r.action_key || '').trim()] =
        String(r.is_allowed || '')
          .trim()
          .toUpperCase() === 'TRUE';
    });
  [
    'ticket.create',
    'ticket.create_for_user',
    'ticket.view_unassigned',
    'ticket.assign_self',
    'ticket.accept',
    'ticket.update_status',
    'ticket.update_repair_detail',
    'ticket.upload_file',
    'ticket.close',
    'ticket.reopen',
    'ticket.cancel',
    'ticket.manage_workflow',
    'inventory.view',
    'inventory.edit',
    'inventory.update_after_inspection',
    'master_data.import',
    'ticket.manage_all',
    'role.manage',
    'permission.update',
    'user.manage',
    'system.setting',
  ].forEach((k) => {
    if (keys[k] === undefined) keys[k] = permission_defaultAllowed_(role, k);
  });
  if (role === 'ADMIN') {
    keys['role.manage'] = true;
    keys['permission.update'] = true;
  }
  return keys;
}

// apps/webapp/src/server/features/permissions/user-actions.js
function userCanAction_(u, key) {
  return Boolean(actionKeysForRole_(u)[key]);
}

// apps/webapp/src/server/features/tickets/ticket-attachments.js
function itsdImpl_uploadServiceFile_(token, id, name, mime, base64, kind) {
  const u = require_(token);
  if (!hasPermissionForUser_(u, 'TICKETS', ticketPermission_isRequesterOnly_(u) ? 'VIEW' : 'EDIT'))
    throw Error('ไม่มีสิทธิ์แนบหลักฐานงาน');
  id = boundedText_(id, 'เลขที่แจ้งปัญหา', 80, true);
  const ticket = ownTicket_(u, id),
    meta = find_('INCIDENT_META', 'ticket_id', id) || {};
  if (typeof ticketPermission_canUploadFile_ === 'function')
    ticketPermission_canUploadFile_(u, ticket, meta);
  name = boundedText_(name, 'ชื่อไฟล์', SECURITY_LIMITS.FILE_NAME, true);
  mime = boundedText_(mime, 'ชนิดไฟล์', SECURITY_LIMITS.MIME, true);
  kind = boundedText_(kind || 'Service', 'ประเภทเอกสาร', 40, true);
  base64 = boundedText_(base64, 'ข้อมูลไฟล์', SECURITY_LIMITS.BASE64, false);
  if (!/^[\w.\- ()ก-๙]{1,120}$/.test(name)) throw Error('ชื่อไฟล์ไม่ถูกต้อง');
  if (
    ![
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(mime)
  )
    throw Error('รองรับ PDF, PNG, JPEG, DOC, DOCX');
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > 10 * 1024 * 1024) throw Error('ไฟล์ต้องไม่เกิน 10 MB');
  const folder = serviceUploadFolder_(mime),
    file = folder.createFile(Utilities.newBlob(bytes, mime, name));
  append_('INCIDENT_FILES', {
    file_id: Utilities.getUuid(),
    ticket_id: id,
    drive_file_id: file.getId(),
    file_name: name,
    mime_type: mime,
    uploaded_by: u.user_id,
    uploaded_at: now_(),
    kind,
  });
  return { id: file.getId(), name: file.getName() };
}

// apps/webapp/src/server/features/tickets/ticket-attachments.js
function itsdImpl_getFileData_(token, fileId) {
  const u = require_(token);
  fileId = boundedText_(fileId, 'รหัสไฟล์', SECURITY_LIMITS.FILE_ID, true);
  const f = find_('INCIDENT_FILES', 'drive_file_id', fileId);
  if (!f) throw Error('ไม่พบเอกสาร');
  ownTicket_(u, f.ticket_id);
  const blob = DriveApp.getFileById(fileId).getBlob();
  return { name: f.file_name, mime: f.mime_type, base64: Utilities.base64Encode(blob.getBytes()) };
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function saveInventorySurvey_(token, data) {
  const user = require_(token);
  if (
    !permission_hasAction_(user, 'inventory.update_after_inspection') ||
    !hasPermissionForUser_(user, 'INVENTORY', 'EDIT')
  )
    throw Error('ไม่มีสิทธิ์บันทึกผลการสำรวจอุปกรณ์');
  data = plainObject_(data || {}, 'ข้อมูลการสำรวจอุปกรณ์');
  const id = boundedText_(data.id, 'รหัสอุปกรณ์', 80, true),
    surveyDateInput = boundedText_(data.survey_at, 'วันที่สำรวจ', 10, true),
    inspectorInput = boundedText_(data.inspector, 'ผู้ตรวจสอบ', 160, true),
    inspectionStatus = boundedText_(data.inspection_status, 'สถานะตรวจสอบ', 80, true),
    completedStatus =
      '\u0e2a\u0e33\u0e23\u0e27\u0e08\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22',
    notSurveyedStatus = '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e23\u0e27\u0e08',
    surveyed = inspectionStatus === completedStatus;
  if (!id) throw Error('กรุณาระบุรหัสอุปกรณ์');
  if (!surveyed && inspectionStatus !== notSurveyedStatus)
    throw Error('สถานะตรวจสอบต้องเป็นสำรวจเรียบร้อยหรือยังไม่สำรวจ');
  const surveyDate = surveyed ? surveyDateInput : '',
    inspector = surveyed ? inspectorInput : '';
  if (surveyed) {
    const parsedDate = new Date(surveyDate + 'T00:00:00Z');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(surveyDate) ||
      !Number.isFinite(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== surveyDate
    )
      throw Error('รูปแบบวันที่สำรวจไม่ถูกต้อง');
    if (!inspector) throw Error('กรุณาระบุผู้ตรวจสอบ');
  }
  return lock_(() => {
    const row = find_('INVENTORY', 'รหัสอุปกรณ์', id);
    if (!row) throw Error('ไม่พบอุปกรณ์ที่ต้องการบันทึกผลสำรวจ');
    update_('INVENTORY', row.__row, {
      วันที่สำรวจ: surveyDate,
      ผู้ตรวจสอบ: inspector,
      สถานะตรวจสอบ: inspectionStatus,
    });
    if (typeof permissionAudit_log_ === 'function')
      permissionAudit_log_(
        user,
        'INVENTORY_SURVEY',
        'inventory',
        id,
        'SUCCESS',
        'inventory.update_after_inspection',
      );
    return id;
  });
}

function saveInventorySpecs_(token, data) {
  const user = require_(token);
  if (
    !permission_hasAction_(user, 'inventory.edit') &&
    !permission_hasAction_(user, 'inventory.update_after_inspection')
  )
    throw Error('ไม่มีสิทธิ์แก้ไขคุณลักษณะอุปกรณ์');
  data = plainObject_(data || {}, 'ข้อมูลคุณลักษณะอุปกรณ์');
  const id = boundedText_(data.id, 'รหัสอุปกรณ์', 80, true);
  if (!id) throw Error('กรุณาระบุรหัสอุปกรณ์');
  const get = (key, label, max = SECURITY_LIMITS.INVENTORY_TEXT) =>
    boundedText_(data[key], label, max, true);
  return lock_(() => {
    const row = find_('INVENTORY', 'รหัสอุปกรณ์', id);
    if (!row) throw Error('ไม่พบอุปกรณ์ที่ต้องการแก้ไขคุณลักษณะ');
    if (!hasPermissionForUser_(user, 'INVENTORY', 'EDIT'))
      throw Error('ไม่มีสิทธิ์แก้ไขคุณลักษณะอุปกรณ์');
    update_('INVENTORY', row.__row, {
      'Operating System': get('os', 'Operating System', 160),
      'CPU Brand': get('cpu', 'CPU Brand', 120),
      'CPU Speed': get('speed', 'CPU Speed', 80),
      RAM: get('ram', 'RAM', 80),
      Harddisk: get('disk', 'Harddisk', 120),
      'IP Address': get('ip', 'IP Address', 64),
    });
    if (typeof permissionAudit_log_ === 'function')
      permissionAudit_log_(
        user,
        'INVENTORY_SPECS_UPDATE',
        'inventory',
        id,
        'SUCCESS',
        'inventory.edit',
      );
    return id;
  });
}

// apps/webapp/src/server/features/inventory/inventory-service.js
const INVENTORY_BUILDINGS_ = ['อาคารราชบุรีดิเรกฤทธิ์ (อาคาร A)', 'อาคารรัฐประศาสนภักดี (อาคาร B)'];

// apps/webapp/src/server/features/inventory/inventory-service.js
const INVENTORY_STATUSES_ = ['AVAILABLE', 'IN_USE', 'IN_REPAIR', 'RESERVED', 'LOST', 'DISPOSED'];

// apps/webapp/src/server/features/inventory/inventory-service.js
function inventoryNumericAssetType_(type) {
  return /^(printer|scanner|monitor|ups|computer\s*(?:pc|notebook)|pc|desktop(?:\s*computer)?|computer|notebook|laptop|คอมพิวเตอร์(?:ตั้งโต๊ะ)?|เครื่องคอมพิวเตอร์(?:ตั้งโต๊ะ)?|คอมพิวเตอร์พกพา|เครื่องคอมพิวเตอร์พกพา|โน้ตบุ๊ก|โน๊ตบุ๊ค)$/i.test(String(type || '').trim());
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function inventoryNormalizeAssetNo_(value, ups) {
  return String(value || '').replace(ups ? /^คต\.\s*/ : /$^/, '').replace(/[-/\s]/g, '');
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function inventoryValidateChoices_(patch, old) {
  const unchanged = (key) => old && String(old[key] || '') === String(patch[key] || '');
  if (!lookupLabels_('DEVICE', DEVICE_DEFAULTS).includes(patch['ประเภทอุปกรณ์']) && !unchanged('ประเภทอุปกรณ์'))
    throw Error('กรุณาเลือกประเภทอุปกรณ์จากข้อมูลหลัก');
  if (!patch['สถานะครุภัณฑ์'] || (!INVENTORY_STATUSES_.includes(patch['สถานะครุภัณฑ์']) && !unchanged('สถานะครุภัณฑ์')))
    throw Error('กรุณาเลือกสถานะครุภัณฑ์');
  const units = rows_('MST_ORG_UNITS');
  const main = units.find(x => x.org_level === 'หน่วยงานหลัก' && x.org_full_name === patch['หน่วยงานหลัก']);
  const sameOrg = unchanged('หน่วยงานหลัก') && unchanged('หน่วยงานย่อย');
  if (!sameOrg) {
    if (patch['หน่วยงานหลัก'] && !main) throw Error('หน่วยงานหลักไม่ตรงกับข้อมูลหลัก');
    if (patch['หน่วยงานย่อย'] && (!main || !units.some(x => x.org_level === 'หน่วยงานย่อย' && x.first_org_unit_id === main.first_org_unit_id && x.org_full_name === patch['หน่วยงานย่อย'])))
      throw Error('หน่วยงานย่อยไม่สัมพันธ์กับหน่วยงานหลัก');
  }
  if (inventoryNumericAssetType_(patch['ประเภทอุปกรณ์']) && !(unchanged('ประเภทอุปกรณ์') && unchanged('เลขครุภัณฑ์'))) {
    const ups = /^ups$/i.test(String(patch['ประเภทอุปกรณ์']).trim());
    const number = inventoryNormalizeAssetNo_(patch['เลขครุภัณฑ์'], ups);
    if (!(ups ? /^[0-9]{6}$/ : /^[0-9]{15}$/).test(number))
      throw Error(ups ? 'เลขครุภัณฑ์ UPS ต้องเป็นตัวเลข 6 หลัก เช่น คต.0032/63' : 'เลขครุภัณฑ์ PC / Notebook / Printer / Scanner ต้องเป็นตัวเลข 15 หลัก เช่น 7440-001-03-0250/63');
    patch['เลขครุภัณฑ์'] = ups ? 'คต.' + number.slice(0,4) + '/' + number.slice(4) :
      number.slice(0,4) + '-' + number.slice(4,7) + '-' + number.slice(7,9) + '-' + number.slice(9,13) + '/' + number.slice(13);

  }
  const purchaseYear = String(patch['ปีงบประมาณที่จัดซื้อ'] || '');
  if (purchaseYear && (!/^[0-9]{4}$/.test(purchaseYear) || Number(purchaseYear) < 2560 || Number(purchaseYear) > 2580) && !unchanged('ปีงบประมาณที่จัดซื้อ'))
    throw Error('กรุณาเลือกปีงบประมาณที่จัดซื้อ พ.ศ. 2560–2580 หรือยังไม่ระบุ');
  if (patch['อาคาร'] && !INVENTORY_BUILDINGS_.includes(patch['อาคาร']) && !unchanged('อาคาร'))
    throw Error('กรุณาเลือกอาคารจากรายการ หรือยังไม่ระบุ');
  if (patch['ชั้น'] && !/^[1-9]$/.test(patch['ชั้น']) && !unchanged('ชั้น'))
    throw Error('กรุณาเลือกชั้น 1–9 หรือยังไม่ระบุ');
  const masterBrandKeys = new Set(deviceBrandChoices_().map(brandLookupKey_));
  if (patch['ยี่ห้อ'] && !masterBrandKeys.has(brandLookupKey_(patch['ยี่ห้อ'])) && !unchanged('ยี่ห้อ'))
    throw Error('กรุณาเลือกยี่ห้อจาก MST_DEVICE_MODELS หรือให้ผู้ดูแลเพิ่มยี่ห้อและรุ่นในข้อมูลหลัก');
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function itsdImpl_saveInventory_(token, data) {
  if (data && data.survey_only === true) return saveInventorySurvey_(token, data);
  if (data && data.specs_only === true) return saveInventorySpecs_(token, data);
  const u = require_(token);
  const role = roleKey_(u);
  if (
    !permission_hasAction_(u, 'inventory.edit') &&
    !permission_hasAction_(u, 'inventory.update_after_inspection')
  )
    throw Error('ไม่มีสิทธิ์แก้ไขทะเบียนครุภัณฑ์');
  data = plainObject_(data || {}, 'ข้อมูลครุภัณฑ์');
  const get = (key, label, max = SECURITY_LIMITS.INVENTORY_TEXT) =>
      boundedText_(data[key], label, max, true),
    type = get('type', 'ประเภทอุปกรณ์', 120);
  if (!type) throw Error('กรุณาระบุประเภทอุปกรณ์');
  return lock_(() => {
    const id =
        get('id', 'รหัสอุปกรณ์', 80) || 'INV-' + Utilities.getUuid().slice(0, 8).toUpperCase(),
      old = find_('INVENTORY', 'รหัสอุปกรณ์', id),
      patch = {
        รหัสอุปกรณ์: id,
        ประเภทอุปกรณ์: type,
        ยี่ห้อ: get('brand', 'ยี่ห้อ', 120),
        รุ่น: get('model', 'รุ่น', 120),
        หมายเลขซีเรียล: get('serial', 'หมายเลขซีเรียล', 160),
        เลขครุภัณฑ์: get('asset_no', 'เลขครุภัณฑ์', 160),
        ชื่อผู้รับผิดชอบ: get('owner', 'ผู้รับผิดชอบ', 160),
        หน่วยงานหลัก: get('org', 'หน่วยงานหลัก', 180),
        หน่วยงานย่อย: get('suborg', 'หน่วยงานย่อย', 180),
        สถานที่ติดตั้ง: get('location', 'สถานที่ติดตั้ง', 200),
        ชั้น: get('floor', 'ชั้น', 50),
        อาคาร: get('building', 'อาคาร', 160),
        ปีงบประมาณที่จัดซื้อ: get('year', 'ปีงบประมาณ', 20),
        สถานะครุภัณฑ์: get('status', 'สถานะครุภัณฑ์', 80),
        'Operating System': data.os !== undefined ? get('os', 'Operating System', 160) : (old ? old['Operating System'] || '' : ''),
        'CPU Brand': data.cpu !== undefined ? get('cpu', 'CPU Brand', 120) : (old ? old['CPU Brand'] || '' : ''),
        'CPU Speed': data.speed !== undefined ? get('speed', 'CPU Speed', 80) : (old ? old['CPU Speed'] || '' : ''),
        RAM: data.ram !== undefined ? get('ram', 'RAM', 80) : (old ? old['RAM'] || '' : ''),
        Harddisk: data.disk !== undefined ? get('disk', 'Harddisk', 120) : (old ? old['Harddisk'] || '' : ''),
        'IP Address': data.ip !== undefined ? get('ip', 'IP Address', 64) : (old ? old['IP Address'] || '' : ''),
      };
    if (!hasPermissionForUser_(u, 'INVENTORY', old ? 'EDIT' : 'CREATE'))
      throw Error('ไม่มีสิทธิ์' + (old ? 'แก้ไข' : 'เพิ่ม') + 'ทะเบียนครุภัณฑ์');
    inventoryValidateChoices_(patch, old);
    inventoryValidateModel_(patch, old);
    // Format only this asset-number cell as text before writing, preserving leading zeroes.
    const inventorySheet = sheet_('INVENTORY');
    const assetColumn = header_('INVENTORY').indexOf('เลขครุภัณฑ์') + 1;
    const targetRow = old ? old.__row : inventorySheet.getLastRow() + 1;
    if (assetColumn > 0) {
      if (targetRow > inventorySheet.getMaxRows()) inventorySheet.insertRowsAfter(inventorySheet.getMaxRows(), 1);
      inventorySheet.getRange(targetRow, assetColumn).setNumberFormat('@');
    }
    if (old) update_('INVENTORY', old.__row, patch);
    else append_('INVENTORY', patch);
    if (typeof permissionAudit_log_ === 'function')
      permissionAudit_log_(
        u,
        old ? 'INVENTORY_UPDATE' : 'INVENTORY_CREATE',
        'inventory',
        id,
        'SUCCESS',
        'inventory.edit',
      );
    return id;
  });
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function itsdImpl_saveAsset_(token, data) {
  return saveInventory(token, data);
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function itsdImpl_updateAsset_(token, data) {
  return saveInventory(token, data);
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function itsdImpl_editInventoryItem_(token, data) {
  return saveInventory(token, data);
}

// apps/webapp/src/server/features/inventory/inventory-service.js
function itsdImpl_updateInventory_(token, data) {
  return saveInventory(token, data);
}

// apps/webapp/src/server/features/imports/import-compatibility.js
function importPermissionGuard_(token, moduleKey) {
  const u = require_(token);
  if (
    hasPermissionForUser_(u, 'MASTER_DATA', 'VIEW') &&
    permission_hasAction_(u, 'master_data.import')
  )
    return u;
  throw Error('ไม่มีสิทธิ์นำเข้าข้อมูลหลัก');
}

// apps/webapp/src/server/features/imports/import-compatibility.js
function itsdImpl_canImportMasterData_(token) {
  const u = importPermissionGuard_(token, 'master_data');
  return { allowed: true, user: publicUser_(u) };
}

// apps/webapp/src/server/features/imports/import-compatibility.js
function itsdImpl_saveImportedInventory_(token, rows) {
  const u = importPermissionGuard_(token, 'inventory');
  if (!Array.isArray(rows)) throw Error('ข้อมูลนำเข้าไม่ถูกต้อง');
  const out = [];
  rows.forEach((r) => out.push(saveInventory(token, r)));
  if (typeof permissionAudit_log_ === 'function')
    permissionAudit_log_(
      u,
      'MASTER_IMPORT',
      'master_data',
      'INVENTORY',
      'SUCCESS',
      'rows=' + rows.length,
    );
  return { success: true, count: out.length, ids: out };
}

// apps/webapp/src/server/features/imports/import-compatibility.js
function itsdImpl_importInventoryRows_(token, rows) {
  return saveImportedInventory(token, rows);
}

// apps/webapp/src/server/features/imports/import-compatibility.js
function itsdImpl_importMasterData_(token, moduleKey, rows) {
  moduleKey = boundedText_(moduleKey || 'inventory', 'module', 80, true);
  if (moduleKey !== 'inventory' && moduleKey !== 'INVENTORY')
    throw Error('Patch นี้รองรับการ Import INVENTORY ก่อน');
  return saveImportedInventory(token, rows);
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function surveyReportStatus_(value) {
  const status = String(value || '').trim();
  if (['สำรวจเรียบร้อย', 'ตรวจสอบแล้ว', 'ผ่าน'].includes(status)) return 'DONE';
  if (!status || status === 'ยังไม่สำรวจ') return 'PENDING';
  return 'OTHER';
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function surveyReportDate_(value) {
  if (!value) return '';
  const date = String(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const parsed = new Date(date + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === date ? date : '';
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function surveyReportSummary_(rows) {
  let surveyed = 0,
    pending = 0,
    other = 0;
  rows.forEach((row) => {
    if (row.survey_status === 'DONE') surveyed++;
    else if (row.survey_status === 'PENDING') pending++;
    else if (row.survey_status === 'OTHER') other++;
  });
  const total = rows.length;
  return {
    total, surveyed, pending, other,
    percent: total ? Math.round(surveyed * 1000 / total) / 10 : 0,
  };
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function surveyReportGroups_(rows, key) {
  const groups = new Map();
  rows.forEach(row => { const label = row[key] || 'ยังไม่ระบุ'; if (!groups.has(label)) groups.set(label, []); groups.get(label).push(row); });
  return Array.from(groups, ([name, values]) => ({ name, ...surveyReportSummary_(values) }))
    .sort((a,b) => b.total - a.total || a.name.localeCompare(b.name, 'th'));
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function inventorySurveyReport_(token, request) {
  const actor = require_(token);
  if (!hasPermissionForUser_(actor, 'REPORTS', 'VIEW') || !hasPermissionForUser_(actor, 'INVENTORY', 'VIEW'))
    throw Error('ไม่มีสิทธิ์เข้ารายงานการสำรวจอุปกรณ์');
  request = plainObject_(request || {}, 'คำขอรายงานสำรวจ');
  if (request.export !== undefined && typeof request.export !== 'boolean') throw Error('รูปแบบการส่งออกไม่ถูกต้อง');
  const canExport = hasPermissionForUser_(actor, 'REPORTS', 'EXPORT') && hasPermissionForUser_(actor, 'INVENTORY', 'EXPORT');
  if (request.export === true && !canExport) throw Error('ไม่มีสิทธิ์ส่งออกรายงานการสำรวจอุปกรณ์');
  const input = plainObject_(request.filters || {}, 'ตัวกรองรายงานสำรวจ');
  const get = (key, limit=180) => boundedText_(input[key], key, limit, true);
  const filters = { org:get('org'), suborg:get('suborg'), type:get('type',120), brand:get('brand',120), building:get('building',160), floor:get('floor',50), inspector:get('inspector',160), status:get('status',16) || 'ALL', from:get('from',10), to:get('to',10) };
  if (!['ALL','DONE','PENDING','OTHER'].includes(filters.status)) throw Error('กรุณาเลือกสถานะการสำรวจจากรายการ');
  for (const key of ['from','to']) if (filters[key] && !surveyReportDate_(filters[key])) throw Error('วันที่สำรวจไม่ถูกต้อง');
  if (filters.from && filters.to && filters.from > filters.to) throw Error('ช่วงวันที่สำรวจไม่ถูกต้อง');
  // Unsurveyed equipment has no survey date: date filters are not applicable to this status.
  if (filters.status === 'PENDING') { filters.from = ''; filters.to = ''; }
  const dateByRow = rawColumnByRow_('INVENTORY', 'วันที่สำรวจ');
  const inventory = rows_('INVENTORY').filter(x => String(x['รหัสอุปกรณ์'] || '').trim()).map(x => {
    const status = surveyReportStatus_(x['สถานะตรวจสอบ']);
    return {
      id:x['รหัสอุปกรณ์'], type:x['ประเภทอุปกรณ์'], brand:x['ยี่ห้อ'], model:x['รุ่น'], serial:x['หมายเลขซีเรียล'],
      asset_no:x['เลขครุภัณฑ์'], owner:x['ชื่อผู้รับผิดชอบ'], org:x['หน่วยงานหลัก'], suborg:x['หน่วยงานย่อย'],
      building:x['อาคาร'], floor:String(x['ชั้น'] || ''), location:x['สถานที่ติดตั้ง'], year:String(x['ปีงบประมาณที่จัดซื้อ'] || ''),
      asset_status:x['สถานะครุภัณฑ์'], survey_status:status,
      inspection_status:status === 'DONE' ? 'สำรวจเรียบร้อย' : status === 'PENDING' ? 'ยังไม่สำรวจ' : 'สถานะเดิม: ' + String(x['สถานะตรวจสอบ'] || ''),
      raw_inspection_status:String(x['สถานะตรวจสอบ'] || ''),
      survey_at:surveyReportDate_(canonicalClientDate_(dateByRow[x.__row], x['วันที่สำรวจ'])), inspector:x['ผู้ตรวจสอบ'],
    };
  });
  const matches = (value, wanted) => !wanted || (wanted === '__EMPTY__' ? !String(value || '').trim() : String(value || '').trim() === wanted);
  const scope = inventory.filter(x => matches(x.org,filters.org) && matches(x.suborg,filters.suborg) && matches(x.type,filters.type) && matches(x.brand,filters.brand) && matches(x.building,filters.building) && matches(x.floor,filters.floor) &&
    (!filters.inspector || String(x.inspector || '').toLowerCase().includes(filters.inspector.toLowerCase())) &&
    ((!filters.from && !filters.to) || (x.survey_at && (!filters.from || x.survey_at >= filters.from) && (!filters.to || x.survey_at <= filters.to))));
  const rows = scope.filter(x => filters.status === 'ALL' || x.survey_status === filters.status);
  const unique = key => Array.from(new Set(inventory.map(x => String(x[key] || '').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'th',{numeric:true}));
  return {
    kind:'INVENTORY_SURVEY', generated_at:now_(), filters, summary:{ ...surveyReportSummary_(scope), filtered:rows.length },
    rows, by_org:surveyReportGroups_(scope,'org'), by_type:surveyReportGroups_(scope,'type'), can_export:canExport,
    options:{ org:unique('org'), suborg:unique('suborg'), type:unique('type'), brand:unique('brand'), building:unique('building'), floor:unique('floor'),
      suborgs:Array.from(new Map(inventory.filter(x=>String(x.suborg||'').trim()).map(x=>[JSON.stringify([String(x.org||'').trim(),String(x.suborg||'').trim()]),{org:String(x.org||'').trim(),suborg:String(x.suborg||'').trim()}])).values()) },
  };
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function itsdImpl_getReport_(token, start, end) {
  if (start && typeof start === 'object' && !Array.isArray(start)) {
    if (start.kind === 'INVENTORY_SURVEY_SUMMARY') return createSurveySummary_(token);
    if (start.kind !== 'INVENTORY_SURVEY') throw Error('ประเภทรายงานไม่ถูกต้อง');
    return inventorySurveyReport_(token, start);
  }
  const actor = require_(token);
  if (!hasPermissionForUser_(actor, 'REPORTS', 'VIEW')) throw Error('ไม่มีสิทธิ์เข้ารายงาน');
  start = boundedText_(start, 'วันที่เริ่มต้น', SECURITY_LIMITS.REPORT_DATE, true);
  end = boundedText_(end, 'วันที่สิ้นสุด', SECURITY_LIMITS.REPORT_DATE, true);
  if (start && !/^\d{4}-\d{2}-\d{2}$/.test(start)) throw Error('วันที่เริ่มต้นไม่ถูกต้อง');
  if (end && !/^\d{4}-\d{2}-\d{2}$/.test(end)) throw Error('วันที่สิ้นสุดไม่ถูกต้อง');
  const list = getBootstrap(token).tickets.filter(
    (t) =>
      (!start || t.reported_at.slice(0, 10) >= start) &&
      (!end || t.reported_at.slice(0, 10) <= end),
  );
  return {
    rows: list,
    summary: {
      total: list.length,
      closed: list.filter((x) => x.status === 'ปิดงาน').length,
      pending: list.filter((x) => x.status === 'รอยืนยันผล').length,
      open: list.filter((x) => x.status !== 'ปิดงาน').length,
    },
  };
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function surveySummaryTables_(rows) {
  const scoped = rows.filter(row => {
    const year = Number(String(row.year || '').trim());
    return Number.isInteger(year) && year >= 2563 && year <= 2569;
  });
  const orgs = surveyReportGroups_(scoped, 'org');
  const total = surveyReportSummary_(scoped);
  const organizations = [['หน่วยงานหลัก', 'อุปกรณ์ปี 2563–2569', 'สำรวจแล้ว', 'ยังไม่สำรวจ', 'สถานะอื่น', 'ความคืบหน้า (%)'],
    ...orgs.map(g => [g.name, g.total, g.surveyed, g.pending, g.other, g.percent]),
    ['รวมทั้งหมด', total.total, total.surveyed, total.pending, total.other, total.percent]];
  const groups = new Map();
  scoped.filter(row => row.survey_status === 'DONE' && row.survey_at >= '2026-10-26' && row.survey_at <= '2026-10-30').forEach(row => {
    const name = String(row.inspector || '').trim() || 'ไม่ระบุผู้สำรวจ';
    if (!groups.has(name)) groups.set(name, [0, 0, 0, 0, 0]);
    groups.get(name)[Number(row.survey_at.slice(8, 10)) - 26]++;
  });
  const counts = Array.from(groups, ([name, days]) => [name, ...days, days.reduce((sum, n) => sum + n, 0)])
    .sort((a, b) => b[6] - a[6] || a[0].localeCompare(b[0], 'th'));
  const inspectors = [['ผู้สำรวจ', '26 ต.ค. 2569', '27 ต.ค. 2569', '28 ต.ค. 2569', '29 ต.ค. 2569', '30 ต.ค. 2569', 'รวม'],
    ...counts, ['รวมทั้งหมด', ...Array.from({ length: 6 }, (_, i) => counts.reduce((sum, row) => sum + row[i + 1], 0))]];
  return { organizations, inspectors };
}

// apps/webapp/src/server/features/reports/cm-report-service.js
function createSurveySummary_(token) {
  // Read current inventory and enforce both report and inventory export permissions.
  const result = inventorySurveyReport_(token, { export: true, filters: { status: 'ALL' } });
  const tables = surveySummaryTables_(result.rows);
  const folderId = systemSettingsMap_().documents_folder_id;
  const folder = folderId ? DriveApp.getFolderById(folderId) : null;
  const book = SpreadsheetApp.create('สรุปการสำรวจอุปกรณ์ไอที 26–30 ต.ค. 2569 — ' + now_());
  try {
    book.setSpreadsheetTimeZone('Asia/Bangkok');
    book.setSpreadsheetLocale('th_TH');
    const first = book.getSheets()[0].setName('สรุปตามหน่วยงานหลัก');
    const second = book.insertSheet('สรุปตามผู้สำรวจ');
    const write = (sheet, title, scope, matrix) => {
      const width = matrix[0].length;
      sheet.getRange(1, 1).setValue(title).setFontWeight('bold');
      sheet.getRange(2, 1).setValue(scope);
      sheet.getRange(3, 1).setValue('ข้อมูล ณ ' + result.generated_at + ' (Asia/Bangkok)');
      sheet.getRange(5, 1, matrix.length, width).setValues(matrix.map(row => row.map(safeSheetValue_)));
      sheet.getRange(5, 1, 1, width).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      sheet.getRange(6, 2, matrix.length - 1, width - 1).setNumberFormat('0');
      if (width === 6) sheet.getRange(6, 6, matrix.length - 1, 1).setNumberFormat('0.0');
      sheet.getRange(5 + matrix.length - 1, 1, 1, width).setFontWeight('bold');
      sheet.setFrozenRows(5);
      sheet.setColumnWidth(1, 430);
      sheet.setColumnWidths(2, width - 1, 140);
      sheet.getRange(1, 1, 3, width).setWrap(true);
      sheet.getRange(5, 1, matrix.length, width).setWrap(true);
    };
    write(first, 'รายงานสรุปการสำรวจอุปกรณ์ไอที แยกตามหน่วยงานหลัก', 'อุปกรณ์ปีงบประมาณ พ.ศ. 2563–2569 ทุกวันที่สำรวจ และทุกหน่วยงาน', tables.organizations);
    write(second, 'รายงานสรุปการสำรวจอุปกรณ์ไอที แยกตามผู้สำรวจ', 'เฉพาะอุปกรณ์ปีงบประมาณ 2563–2569 ที่สำรวจเรียบร้อย วันที่ 26–30 ตุลาคม 2569 ทุกหน่วยงาน', tables.inspectors);
    if (folder) DriveApp.getFileById(book.getId()).moveTo(folder);
    SpreadsheetApp.flush();
    return { id: book.getId(), url: book.getUrl(), generated_at: result.generated_at };
  } catch (error) {
    try { DriveApp.getFileById(book.getId()).setTrashed(true); } catch (_) { /* Preserve the original creation error. */ }
    throw error;
  }
}

// apps/webapp/src/server/compatibility/line/parser-compatibility.js
function parseLineReport_(message) {
  return lineMessagingParse_(message);
}

// apps/webapp/src/server/entrypoints/line-webhook.js
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// apps/webapp/src/server/entrypoints/line-webhook.js
function itsdImpl_doPost_(e) {
  return json_(lineMessagingReceive_(e));
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35ResetPermissionCache_(name) {
  if (name === 'APP_ROLES') ADMIN35_PERMISSION_CACHE_.roles = null;
  if (name === 'APP_ROLE_PERMISSIONS') ADMIN35_PERMISSION_CACHE_.modules = null;
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35RoleIndex_() {
  if (ADMIN35_PERMISSION_CACHE_.roles !== null) return ADMIN35_PERMISSION_CACHE_.roles;
  const index = Object.create(null),
    sheet = book_().getSheetByName('APP_ROLES');
  if (sheet) {
    RUNTIME_CACHE_.sheets.APP_ROLES = sheet;
    rows_('APP_ROLES').forEach((row) => {
      // Keep the exact role-code comparison and first row used by the existing find_ lookup.
      const key = row.role_code;
      if (!Object.prototype.hasOwnProperty.call(index, key)) index[key] = row;
    });
  }
  ADMIN35_PERMISSION_CACHE_.roles = index;
  return index;
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35ModulePermissionIndex_() {
  if (ADMIN35_PERMISSION_CACHE_.modules !== null) return ADMIN35_PERMISSION_CACHE_.modules;
  const index = Object.create(null),
    sheet = book_().getSheetByName('APP_ROLE_PERMISSIONS');
  if (sheet) {
    RUNTIME_CACHE_.sheets.APP_ROLE_PERMISSIONS = sheet;
    rows_('APP_ROLE_PERMISSIONS').forEach((row) => {
      if (!admin35Bool_(row.active)) return;
      const key = JSON.stringify([
        String(row.role_code || '').toUpperCase(),
        String(row.module_code || '').toUpperCase(),
      ]);
      if (!Object.prototype.hasOwnProperty.call(index, key)) index[key] = row;
    });
  }
  ADMIN35_PERMISSION_CACHE_.modules = index;
  return index;
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35Bool_(value) {
  return value === true || String(value).toUpperCase() === 'TRUE';
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35RoleCodes_() {
  const sheet = book_().getSheetByName('APP_ROLES');
  if (!sheet) return ADMIN35_ROLE_CODES.slice();
  const rows = rows_('APP_ROLES').filter((x) => admin35Bool_(x.active));
  const codes = rows
    .map((x) =>
      String(x.role_code || '')
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean);
  return codes.length ? codes : ADMIN35_ROLE_CODES.slice();
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35Module_(code) {
  return ADMIN35_MODULES.find(
    (x) =>
      x.code ===
      String(code || '')
        .trim()
        .toUpperCase(),
  );
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35Action_(action) {
  const a = String(action || 'VIEW')
    .trim()
    .toUpperCase();
  return ADMIN35_ACTIONS.includes(a) ? a : 'VIEW';
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35PermissionColumn_(action) {
  return 'can_' + admin35Action_(action).toLowerCase();
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin35RoleActive_(roleCode) {
  if (roleCode === 'ADMIN') return true;
  const row =
    admin35RoleIndex_()[
      String(roleCode || '')
        .trim()
        .toUpperCase()
    ];
  return Boolean(row && admin35Bool_(row.active));
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function admin55DefaultRights_(role, module) {
  role = String(role || 'USER').toUpperCase();
  if (role === 'ADMIN' || role === 'TECHNICIAN' || role === 'ITSUPPORT')
    return { view: true, create: true, edit: true, delete: true, export: true, manage: true };
  if (
    role === 'MANAGER' &&
    ['DASHBOARD', 'NEW_TICKET', 'TICKETS', 'INVENTORY', 'REPORTS', 'ANNOUNCEMENTS'].includes(module)
  )
    return { view: true, create: true, edit: true, delete: true, export: true, manage: true };
  if (role === 'USER' && ['DASHBOARD', 'NEW_TICKET', 'ANNOUNCEMENTS'].includes(module))
    return { view: true, create: true, edit: false, delete: false, export: false, manage: false };
  if (role === 'USER' && module === 'TICKETS')
    return { view: true, create: false, edit: false, delete: false, export: false, manage: false };
  return { view: false, create: false, edit: false, delete: false, export: false, manage: false };
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function requirePermission_(token, moduleCode, action) {
  const user = require_(token, false),
    verb = admin35Action_(action);
  if (!hasPermissionForUser_(user, moduleCode, verb)) throw Error('สิทธิ์ไม่เพียงพอสำหรับเมนูนี้');
  if (verb !== 'VIEW') {
    const keys = { SETTINGS: 'system.setting', USER_MANAGEMENT: 'user.manage' };
    if (keys[moduleCode] && !permission_hasAction_(user, keys[moduleCode]))
      throw Error('ถูกปิดสิทธิ์การกระทำ: ' + keys[moduleCode]);
    if (
      moduleCode === 'PERMISSION_MANAGEMENT' &&
      (!permission_hasAction_(user, 'role.manage') ||
        !permission_hasAction_(user, 'permission.update'))
    )
      throw Error('ถูกปิดสิทธิ์จัดการ Role/Permission');
  }
  return user;
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function itsdImpl_getAdminPermissions_(token) {
  const actor = requirePermission_(token, 'PERMISSION_MANAGEMENT', 'VIEW');
  ensureAdminModuleSchema_();
  const permissionRows = rows_('APP_ROLE_PERMISSIONS'),
    userRows = rows_('APP_USERS');
  const counts = {};
  userRows.forEach((u) => {
    const r = String(u.role || 'USER').toUpperCase();
    counts[r] = (counts[r] || 0) + 1;
  });
  const roleOrder = new Map(ADMIN35_ROLE_CODES.map((code, index) => [code, index]));
  const roles = rows_('APP_ROLES')
    .filter((x) => admin35Bool_(x.active))
    .sort((a, b) => {
      const aCode = String(a.role_code || '').trim().toUpperCase();
      const bCode = String(b.role_code || '').trim().toUpperCase();
      const aRank = roleOrder.has(aCode) ? roleOrder.get(aCode) : Number.MAX_SAFE_INTEGER;
      const bRank = roleOrder.has(bCode) ? roleOrder.get(bCode) : Number.MAX_SAFE_INTEGER;
      return aRank - bRank || Number(a.sort_order || 0) - Number(b.sort_order || 0) || aCode.localeCompare(bCode);
    })
    .map((r) => ({
      code: r.role_code,
      name: r.role_name,
      description: r.description,
      locked: false,
      user_count: counts[String(r.role_code || '').toUpperCase()] || 0,
    }));
  const matrix = {};
  roles.forEach((r) => {
    matrix[r.code] = {};
    ADMIN35_MODULES.forEach((m) => {
      const p = permissionRows.find(
        (x) =>
          String(x.role_code || '').toUpperCase() === r.code &&
          String(x.module_code || '').toUpperCase() === m.code,
      );
      const fallback = admin55DefaultRights_(r.code, m.code);
      matrix[r.code][m.code] = {
        view: p ? admin35Bool_(p.can_view) : fallback.view,
        create: p ? admin35Bool_(p.can_create) : fallback.create,
        edit: p ? admin35Bool_(p.can_edit) : fallback.edit,
        delete: p ? admin35Bool_(p.can_delete) : fallback.delete,
        export: p ? admin35Bool_(p.can_export) : fallback.export,
        manage: p ? admin35Bool_(p.can_manage) : fallback.manage,
      };
    });
  });
  return {
    roles,
    modules: ADMIN35_MODULES.slice(),
    actions: ADMIN35_ACTIONS.slice(),
    matrix,
    can_manage: hasPermissionForUser_(actor, 'PERMISSION_MANAGEMENT', 'MANAGE'),
  };
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function itsdImpl_saveAdminRole_(token, data) {
  const actor = requirePermission_(token, 'PERMISSION_MANAGEMENT', 'MANAGE');
  data = plainObject_(data || {}, 'ข้อมูลบทบาท');
  const original = String(data.original_code || '')
      .trim()
      .toUpperCase(),
    code = boundedText_(data.role_code, 'รหัสบทบาท', 24, true).toUpperCase(),
    name = boundedText_(data.role_name, 'ชื่อบทบาท', 80, true),
    description = boundedText_(data.description, 'คำอธิบายบทบาท', 240, true);
  if (!/^[A-Z][A-Z0-9_]{2,23}$/.test(code))
    throw Error('รหัสบทบาทต้องเป็น A-Z, 0-9 หรือ _ จำนวน 3-24 ตัวอักษร');
  if (!name) throw Error('กรุณาระบุชื่อบทบาท');
  if (original === 'ADMIN' || (code === 'ADMIN' && original !== 'ADMIN'))
    throw Error('ไม่สามารถแก้ไขรหัส ADMIN ได้');
  if (original && original !== code) throw Error('ไม่สามารถเปลี่ยนรหัสบทบาทเดิมได้');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const existing = find_('APP_ROLES', 'role_code', code);
    if (existing) {
      update_('APP_ROLES', existing.__row, {
        role_name: name,
        description,
        active: true,
        updated_at: now_(),
        updated_by: actor.user_id,
      });
    } else {
      const next =
        rows_('APP_ROLES').reduce((m, x) => Math.max(m, Number(x.sort_order || 0)), 0) + 1;
      append_('APP_ROLES', {
        role_id: 'ROLE-' + code,
        role_code: code,
        role_name: name,
        description,
        active: true,
        sort_order: next,
        created_at: now_(),
        created_by: actor.user_id,
        updated_at: now_(),
        updated_by: actor.user_id,
      });
      ADMIN35_MODULES.forEach((m) =>
        append_('APP_ROLE_PERMISSIONS', {
          permission_id: 'PERM-' + code + '-' + m.code,
          role_code: code,
          module_code: m.code,
          module_name: m.name,
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false,
          can_manage: false,
          active: true,
          updated_at: now_(),
          updated_by: actor.user_id,
        }),
      );
    }
    writeAudit_(
      actor,
      existing ? 'EDIT' : 'CREATE',
      'PERMISSION_MANAGEMENT',
      'APP_ROLES',
      code,
      'SUCCESS',
      (existing ? 'แก้ไข' : 'สร้าง') + 'บทบาท ' + code,
    );
    return true;
  });
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function itsdImpl_saveAdminPermissions_(token, roleCode, matrix) {
  const actor = requirePermission_(token, 'PERMISSION_MANAGEMENT', 'MANAGE');
  roleCode = boundedText_(roleCode, 'บทบาท', 20, true).toUpperCase();
  if (!admin35RoleCodes_().includes(roleCode)) throw Error('ไม่พบบทบาทผู้ใช้');
  matrix = plainObject_(matrix || {}, 'Permission Matrix');
  const updates = ADMIN35_MODULES.map((m) => {
    const d = plainObject_(matrix[m.code] || {}, 'สิทธิ์ ' + m.name);
    const patch = {
      role_code: roleCode,
      module_code: m.code,
      module_name: m.name,
      can_view: Boolean(d.view || d.create || d.edit || d.delete || d.export || d.manage),
      can_create: Boolean(d.create),
      can_edit: Boolean(d.edit),
      can_delete: Boolean(d.delete),
      can_export: Boolean(d.export),
      can_manage: Boolean(d.manage),
      active: true,
      updated_at: now_(),
      updated_by: actor.user_id,
    };
    return { module: m, patch };
  });
  // Keep recovery control; validate before writing any row to avoid partial saves.
  const recovery = updates.find((x) => x.module.code === 'PERMISSION_MANAGEMENT');
  if (roleCode === 'ADMIN' && (!recovery.patch.can_view || !recovery.patch.can_manage))
    throw Error('ADMIN ต้องคงสิทธิ์เข้าหน้ากำหนดสิทธิ์และบันทึกสิทธิ์ เพื่อกู้คืนระบบ');
  return lock_(() => {
    ensureAdminModuleSchema_();
    updates.forEach(({ module, patch }) => {
      const old = rows_('APP_ROLE_PERMISSIONS').find(
        (x) =>
          String(x.role_code || '').toUpperCase() === roleCode &&
          String(x.module_code || '').toUpperCase() === module.code,
      );
      if (old) update_('APP_ROLE_PERMISSIONS', old.__row, patch);
      else
        append_(
          'APP_ROLE_PERMISSIONS',
          Object.assign({ permission_id: 'PERM-' + roleCode + '-' + module.code }, patch),
        );
    });
    writeAudit_(
      actor,
      'PERMISSION_CHANGE',
      'PERMISSION_MANAGEMENT',
      'APP_ROLE_PERMISSIONS',
      roleCode,
      'SUCCESS',
      'บันทึกสิทธิ์ครบ ' + updates.length + ' เมนู',
    );
    return true;
  });
}

// apps/webapp/src/server/features/permissions/module-permissions.js
function itsdImpl_saveAdminPermissionChanges_(token, changes) {
  const actor = requirePermission_(token, 'PERMISSION_MANAGEMENT', 'MANAGE');
  changes = plainObject_(changes || {}, 'รายการเปลี่ยนสิทธิ์');
  const roles = Object.keys(changes);
  if (!roles.length) throw Error('ไม่มีรายการสิทธิ์ที่เปลี่ยนแปลง');
  if (roles.length > 60) throw Error('จำนวนบทบาทเกินกำหนด');
  const fields = ['view', 'create', 'edit', 'delete', 'export', 'manage'];
  const approved = admin35RoleCodes_();
  const writes = [];
  roles.forEach((role) => {
    if (!approved.includes(role) || role !== role.toUpperCase())
      throw Error('ไม่พบบทบาทผู้ใช้: ' + role);
    const modules = plainObject_(changes[role], 'ชุดสิทธิ์ ' + role);
    Object.keys(modules).forEach((code) => {
      const module = admin35Module_(code);
      if (!module || module.code !== code) throw Error('เมนูไม่ถูกต้อง: ' + code);
      const entry = plainObject_(modules[code], 'สิทธิ์ ' + code);
      if (
        Object.keys(entry).some((k) => !fields.includes(k)) ||
        fields.some((k) => typeof entry[k] !== 'boolean')
      )
        throw Error('ค่ากำหนดสิทธิ์ไม่ถูกต้อง: ' + role + ' / ' + code);
      if (fields.some((k) => k !== 'view' && entry[k]) && !entry.view)
        throw Error('สิทธิ์จัดการต้องมีสิทธิ์เข้าถึงเมนูด้วย');
      if (role === 'ADMIN' && code === 'PERMISSION_MANAGEMENT' && (!entry.view || !entry.manage))
        throw Error('ADMIN ต้องคงสิทธิ์กำหนดสิทธิ์และสิทธิ์กู้คืนระบบ');
      writes.push({ role, module, entry });
    });
  });
  if (!writes.length) throw Error('ไม่มีรายการสิทธิ์ที่เปลี่ยนแปลง');
  return lock_(() => {
    ensureAdminModuleSchema_();
    writes.forEach(({ role, module, entry }) => {
      const patch = {
        role_code: role,
        module_code: module.code,
        module_name: module.name,
        can_view: entry.view,
        can_create: entry.create,
        can_edit: entry.edit,
        can_delete: entry.delete,
        can_export: entry.export,
        can_manage: entry.manage,
        active: true,
        updated_at: now_(),
        updated_by: actor.user_id,
      };
      const current = rows_('APP_ROLE_PERMISSIONS').find(
        (x) =>
          String(x.role_code || '').toUpperCase() === role &&
          String(x.module_code || '').toUpperCase() === module.code,
      );
      if (current) update_('APP_ROLE_PERMISSIONS', current.__row, patch);
      else
        append_(
          'APP_ROLE_PERMISSIONS',
          Object.assign({ permission_id: 'PERM-' + role + '-' + module.code }, patch),
        );
    });
    // Read-back from the sheet (cache reset by update_/append_) before claiming success.
    writes.forEach(({ role, module, entry }) => {
      const row = rows_('APP_ROLE_PERMISSIONS').find(
        (x) =>
          String(x.role_code || '').toUpperCase() === role &&
          String(x.module_code || '').toUpperCase() === module.code,
      );
      if (!row || fields.some((f) => admin35Bool_(row['can_' + f]) !== entry[f]))
        throw Error('ตรวจสอบข้อมูลสิทธิ์หลังบันทึกไม่สำเร็จ: ' + role + '/' + module.code);
    });
    writeAudit_(
      actor,
      'PERMISSION_CHANGE',
      'PERMISSION_MANAGEMENT',
      'APP_ROLE_PERMISSIONS',
      roles.join(','),
      'SUCCESS',
      'บันทึกสิทธิ์ ' + writes.length + ' ช่อง',
    );
    return { saved: true, role_count: roles.length, module_count: writes.length };
  });
}

// apps/webapp/src/server/features/branding/icon-service.js
function admin35Unsigned_(b) {
  return Number(b) & 255;
}

// apps/webapp/src/server/features/branding/icon-service.js
function admin35ImageDimensions_(bytes, mime) {
  const u = (i) => admin35Unsigned_(bytes[i]);
  if (mime === 'image/png') {
    if (bytes.length < 24 || u(0) !== 0x89 || u(1) !== 0x50 || u(2) !== 0x4e || u(3) !== 0x47)
      throw Error('ไฟล์ PNG ไม่ถูกต้อง');
    const width = ((u(16) << 24) >>> 0) + (u(17) << 16) + (u(18) << 8) + u(19),
      height = ((u(20) << 24) >>> 0) + (u(21) << 16) + (u(22) << 8) + u(23);
    return { width, height };
  }
  if (mime === 'image/jpeg') {
    if (bytes.length < 4 || u(0) !== 0xff || u(1) !== 0xd8) throw Error('ไฟล์ JPG ไม่ถูกต้อง');
    let i = 2;
    const sof = new Set([
      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
    ]);
    while (i < bytes.length - 8) {
      while (i < bytes.length && u(i) !== 0xff) i++;
      while (i < bytes.length && u(i) === 0xff) i++;
      if (i >= bytes.length) break;
      const marker = u(i++);
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker >= 0xd0 && marker <= 0xd7) continue;
      if (i + 1 >= bytes.length) break;
      const len = (u(i) << 8) + u(i + 1);
      if (len < 2 || i + len > bytes.length) break;
      if (sof.has(marker)) {
        return { height: (u(i + 3) << 8) + u(i + 4), width: (u(i + 5) << 8) + u(i + 6) };
      }
      i += len;
    }
    throw Error('ไม่สามารถอ่านขนาดรูป JPG ได้');
  }
  throw Error('รองรับเฉพาะ PNG และ JPG');
}

// apps/webapp/src/server/features/branding/icon-service.js
function admin35AssetsFolder_() {
  return driveFolderBySetting_('system_assets_folder_id', 'Google Drive System Assets');
}

// apps/webapp/src/server/features/branding/icon-service.js
function itsdImpl_uploadSystemIcon_(token, name, mime, base64) {
  const actor = requirePermission_(token, 'SETTINGS', 'EDIT');
  name = boundedText_(name, 'ชื่อไฟล์', 120, true);
  mime = boundedText_(mime, 'ชนิดไฟล์', 80, true);
  base64 = boundedText_(base64, 'ข้อมูลรูปภาพ', SECURITY_LIMITS.BASE64, false);
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (!ADMIN35_ICON_MIME.includes(mime) || !['png', 'jpg'].includes(ext))
    throw Error('รองรับเฉพาะไฟล์ PNG หรือ JPG เท่านั้น');
  const bytes = Utilities.base64Decode(base64);
  if (!bytes.length) throw Error('ไฟล์รูปภาพว่างเปล่า');
  if (bytes.length > 10 * 1024 * 1024) throw Error('ไฟล์รูปภาพมีขนาดใหญ่เกินไป');
  const dim = admin35ImageDimensions_(bytes, mime);
  if (dim.width !== dim.height) throw Error('ไอคอนต้องเป็นรูปสี่เหลี่ยมจัตุรัส (1:1)');
  if (dim.width < ADMIN39_ICON_MIN_SIZE) throw Error('ไอคอนต้องมีขนาดอย่างน้อย 250 x 250 px');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const old = find_('APP_SETTINGS', 'key', 'system_icon_file_id'),
      oldId = (old && old.value) || '';
    const safeName =
      'system-icon-' +
      Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss') +
      (mime === 'image/png' ? '.png' : '.jpg');
    const file = admin35AssetsFolder_().createFile(Utilities.newBlob(bytes, mime, safeName));
    admin35SetSetting_('system_icon_file_id', file.getId());
    admin35SetSetting_('system_icon_filename', name);
    admin35SetSetting_('system_icon_mime_type', mime);
    admin35SetSetting_('system_icon_width', String(dim.width));
    admin35SetSetting_('system_icon_height', String(dim.height));
    admin35SetSetting_('system_icon_updated_at', now_());
    admin35SetSetting_('system_icon_updated_by', actor.username || actor.user_id);
    if (oldId && oldId !== file.getId()) {
      try {
        DriveApp.getFileById(oldId).setTrashed(true);
      } catch (_) {}
    }
    writeAudit_(
      actor,
      'UPLOAD',
      'SETTINGS',
      'SYSTEM_ICON',
      file.getId(),
      'SUCCESS',
      'อัปโหลดไอคอนระบบ ' + name,
    );
    return {
      file_id: file.getId(),
      filename: name,
      mime,
      width: dim.width,
      height: dim.height,
      base64: Utilities.base64Encode(bytes),
    };
  });
}

// apps/webapp/src/server/features/branding/icon-service.js
function itsdImpl_clearSystemIcon_(token) {
  const actor = requirePermission_(token, 'SETTINGS', 'EDIT');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const row = find_('APP_SETTINGS', 'key', 'system_icon_file_id'),
      oldId = (row && row.value) || '';
    [
      'system_icon_file_id',
      'system_icon_filename',
      'system_icon_mime_type',
      'system_icon_updated_at',
      'system_icon_updated_by',
    ].forEach((k) => admin35SetSetting_(k, ''));
    admin35SetSetting_('system_icon_width', String(ADMIN35_ICON_SIZE));
    admin35SetSetting_('system_icon_height', String(ADMIN35_ICON_SIZE));
    if (oldId) {
      try {
        DriveApp.getFileById(oldId).setTrashed(true);
      } catch (_) {}
    }
    writeAudit_(
      actor,
      'DELETE',
      'SETTINGS',
      'SYSTEM_ICON',
      oldId,
      'SUCCESS',
      'คืนค่าไอคอนระบบเป็นค่าเริ่มต้น',
    );
    return true;
  });
}

// apps/webapp/src/server/features/branding/icon-service.js
function admin35ReadSystemIcon_() {
  if (!book_().getSheetByName('APP_SETTINGS')) return null;
  const id = (find_('APP_SETTINGS', 'key', 'system_icon_file_id') || {}).value || '';
  if (!id) return null;
  const cached = CacheService.getScriptCache().get('OCPB_ICON_' + id);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {}
  }
  try {
    const file = DriveApp.getFileById(id),
      blob = file.getBlob(),
      mime = blob.getContentType();
    if (!ADMIN35_ICON_MIME.includes(mime)) return null;
    const result = {
      file_id: id,
      name: file.getName(),
      mime,
      base64: Utilities.base64Encode(blob.getBytes()),
    };
    try {
      CacheService.getScriptCache().put('OCPB_ICON_' + id, JSON.stringify(result), 21600);
    } catch (_) {}
    return result;
  } catch (_) {
    return null;
  }
}

// apps/webapp/src/server/features/branding/icon-service.js
function itsdImpl_getPublicSystemIconData_() {
  return admin35ReadSystemIcon_();
}

// apps/webapp/src/server/features/branding/icon-service.js
function itsdImpl_getSystemIconData_(token) {
  require_(token, false);
  return admin35ReadSystemIcon_();
}

// apps/webapp/src/server/features/users/user-service.js
function hasPermissionForUser_(user, moduleCode, action) {
  if (!user || !admin35RoleActive_(String(user.role || '').toUpperCase())) return false;
  const module = admin35Module_(moduleCode);
  if (!module) return false;
  const role = String(user.role || 'USER').toUpperCase(),
    column = admin35PermissionColumn_(action);
  // Server-side break-glass: a valid ADMIN can always reopen and repair rights.
  if (role === 'ADMIN' && module.code === 'PERMISSION_MANAGEMENT') return true;
  const row = admin35ModulePermissionIndex_()[JSON.stringify([role, module.code])];
  if (row) return admin35Bool_(row[column]);
  return Boolean(admin55DefaultRights_(role, module.code)[admin35Action_(action).toLowerCase()]);
}

// apps/webapp/src/server/features/users/user-service.js
function getAdminAccessForUser_(user) {
  const out = {};
  ADMIN35_MODULES.forEach((m) => {
    out[m.code] = {};
    ADMIN35_ACTIONS.forEach(
      (a) => (out[m.code][a.toLowerCase()] = hasPermissionForUser_(user, m.code, a)),
    );
  });
  return out;
}

// apps/webapp/src/server/features/users/user-service.js
function admin35ProfilesByUser_() {
  return Object.fromEntries(rows_('APP_USER_PROFILE').map((x) => [x.user_id, x]));
}

// apps/webapp/src/server/features/users/user-service.js
function admin36LastLoginByUser_() {
  const out = {};
  if (!book_().getSheetByName('APP_AUDIT_LOG')) return out;
  rows_('APP_AUDIT_LOG').forEach((x) => {
    if (
      String(x.action || '').toUpperCase() !== 'LOGIN_SUCCESS' ||
      String(x.result || 'SUCCESS').toUpperCase() !== 'SUCCESS'
    )
      return;
    const id = String(x.actor_user_id || '').trim(),
      at = String(x.event_at || '').trim();
    if (id && at && (!out[id] || at > out[id])) out[id] = at;
  });
  return out;
}

// apps/webapp/src/server/features/users/user-service.js
function itsdImpl_getAdminUsers_(token) {
  const actor = requirePermission_(token, 'USER_MANAGEMENT', 'VIEW');
  ensureAdminModuleSchema_();
  const profiles = admin35ProfilesByUser_(),
    now = Date.now(),
    lastLogin = admin36LastLoginByUser_(),
    orgRows = rows_('MST_ORG_UNITS'),
    orgById = Object.fromEntries(orgRows.map((x) => [x.org_unit_id, x]));
  const users = rows_('APP_USERS').map((u) => {
    const p = profiles[u.user_id] || {},
      locked = Boolean(
        u.locked_until && Date.parse(String(u.locked_until).replace(' ', 'T') + '+07:00') > now,
      ),
      org = orgById[p.org_unit_id] || {},
      dept = orgById[p.department_id] || {};
    return {
      user_id: u.user_id,
      username: u.username,
      display_name: u.display_name,
      role: String(u.role || 'USER').toUpperCase(),
      active: admin35Bool_(u.active),
      locked,
      locked_until: u.locked_until || '',
      created_at: u.created_at || '',
      last_login: lastLogin[u.user_id] || '',
      email: p.email || '',
      telephone: p.telephone || '',
      position: p.position || '',
      department_id: p.department_id || '',
      department_name: dept.org_full_name || dept.org_name || '',
      org_unit_id: p.org_unit_id || '',
      org_unit_name: org.org_full_name || org.org_name || '',
      picture_url: p.picture_url || '',
    };
  });
  const roles = rows_('APP_ROLES')
    .filter((x) => admin35Bool_(x.active))
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((x) => ({ code: x.role_code, name: x.role_name, description: x.description }));
  const org = orgRows.map((x) => ({
    id: x.org_unit_id,
    name: x.org_full_name,
    level: x.org_level,
    first: x.first_org_unit_id,
  }));
  return {
    users,
    roles,
    org,
    can_edit: hasPermissionForUser_(actor, 'USER_MANAGEMENT', 'EDIT'),
    can_create: hasPermissionForUser_(actor, 'USER_MANAGEMENT', 'CREATE'),
    can_manage: hasPermissionForUser_(actor, 'USER_MANAGEMENT', 'MANAGE'),
    can_export: hasPermissionForUser_(actor, 'USER_MANAGEMENT', 'EXPORT'),
  };
}

// apps/webapp/src/server/features/users/user-service.js
function admin35ResolveDepartment_(orgUnitId) {
  const row = find_('MST_ORG_UNITS', 'org_unit_id', orgUnitId);
  if (!row) return '';
  return row.first_org_unit_id || '';
}

// apps/webapp/src/server/features/users/user-service.js
function admin46LatestUserCreatedAt_() {
  let latest = 0;
  rows_('APP_USERS').forEach((u) => {
    const text = String(u.created_at || '').trim();
    if (!text) return;
    try {
      const ms = Utilities.parseDate(text, TZ, 'yyyy-MM-dd HH:mm:ss').getTime();
      if (ms > latest) latest = ms;
    } catch (_) {}
  });
  return latest;
}

// apps/webapp/src/server/features/users/user-service.js
function admin46AssertUserCreateCooldown_() {
  const latest = admin46LatestUserCreatedAt_();
  if (!latest) return;
  const remaining = ADMIN46_USER_CREATE_COOLDOWN_MS - (Date.now() - latest);
  if (remaining <= 0) return;
  const totalSeconds = Math.max(1, Math.ceil(remaining / 1000)),
    minutes = Math.floor(totalSeconds / 60),
    seconds = totalSeconds % 60;
  throw Error(
    'สามารถสร้างบัญชีใหม่ได้อีกครั้งใน ' +
      minutes +
      ':' +
      String(seconds).padStart(2, '0') +
      ' นาที',
  );
}

// apps/webapp/src/server/features/users/user-service.js
function admin35SaveProfile_(actor, userId, data) {
  const old = find_('APP_USER_PROFILE', 'user_id', userId),
    orgUnitId = boundedText_(data.org_unit_id, 'หน่วยงาน', 80, true),
    patch = {
      email: boundedText_(data.email, 'อีเมล', 160, true),
      telephone: boundedText_(data.telephone, 'เบอร์โทร', 40, true),
      position: boundedText_(data.position, 'ตำแหน่ง', 160, true),
      department_id: admin35ResolveDepartment_(orgUnitId),
      org_unit_id: orgUnitId,
      active: true,
      updated_at: now_(),
      updated_by: actor.user_id,
    };
  if (patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email))
    throw Error('รูปแบบอีเมลไม่ถูกต้อง');
  if (old) update_('APP_USER_PROFILE', old.__row, patch);
  else
    append_(
      'APP_USER_PROFILE',
      Object.assign(
        {
          profile_id: 'PRF-' + Utilities.getUuid().slice(0, 8).toUpperCase(),
          user_id: userId,
          picture_file_id: '',
          picture_url: '',
        },
        patch,
      ),
    );
}

// apps/webapp/src/server/features/users/user-service.js
function itsdImpl_saveAdminUser_(token, data) {
  const actor = requirePermission_(
    token,
    'USER_MANAGEMENT',
    data && data.user_id ? 'EDIT' : 'CREATE',
  );
  data = plainObject_(data || {}, 'ข้อมูลผู้ใช้');
  const username = normalizeUsername_(data.username),
    display = boundedText_(data.display_name, 'ชื่อแสดง', SECURITY_LIMITS.DISPLAY_NAME, true),
    role = boundedText_(data.role, 'สิทธิ์', 20, true).toUpperCase(),
    active = data.active !== false,
    password = data.password
      ? boundedText_(data.password, 'รหัสผ่าน', SECURITY_LIMITS.PASSWORD, false)
      : '';
  if (!/^[A-Z0-9_]{3,30}$/.test(username))
    throw Error('ชื่อผู้ใช้ต้องเป็น A-Z, 0-9 หรือ _ จำนวน 3-30 ตัวอักษร');
  if (!display) throw Error('กรุณาระบุชื่อแสดง');
  if (!admin35RoleCodes_().includes(role)) throw Error('บทบาทผู้ใช้ไม่ถูกต้อง');
  if (password && password.length < 12) throw Error('รหัสผ่านอย่างน้อย 12 อักขระ');
  return lock_(() => {
    ensureAdminModuleSchema_();
    SpreadsheetApp.flush();
    resetRows_('APP_USERS');
    let old = data.user_id
      ? find_('APP_USERS', 'user_id', boundedText_(data.user_id, 'รหัสผู้ใช้', 80, true))
      : null;
    const nameMatches = usersByUsername_(username);
    if (nameMatches.some((x) => !old || x.user_id !== old.user_id))
      throw Error('ชื่อผู้ใช้นี้มีอยู่แล้ว');
    if (old) {
      if (old.user_id === actor.user_id && !active) throw Error('ปิดใช้งานบัญชีของตนเองไม่ได้');
      if (
        old.role === 'ADMIN' &&
        (!active || role !== 'ADMIN') &&
        rows_('APP_USERS').filter((x) => x.role === 'ADMIN' && admin35Bool_(x.active)).length <= 1
      )
        throw Error('ต้องมีผู้ดูแลระบบที่ใช้งานได้อย่างน้อยหนึ่งบัญชี');
      const securityChanged =
        old.role !== role || admin35Bool_(old.active) !== active || Boolean(password);
      update_('APP_USERS', old.__row, { username, display_name: display, role, active });
      if (password) {
        nist118Temporary_(old.user_id);
        const salt = random_();
        update_('APP_USERS', old.__row, {
          password_salt: salt,
          password_hash: pwHash_(password, salt),
          failed_count: 0,
          locked_until: '',
        });
      }
      if (securityChanged) revokeUserSessions_(old.user_id);
      admin35SaveProfile_(actor, old.user_id, data);
      writeAudit_(
        actor,
        'EDIT',
        'USER_MANAGEMENT',
        'APP_USERS',
        old.user_id,
        'SUCCESS',
        'แก้ไขผู้ใช้ ' + username,
      );
      return old.user_id;
    }
    admin46AssertUserCreateCooldown_();
    if (!password) throw Error('กรุณาระบุรหัสผ่านสำหรับผู้ใช้ใหม่');
    const salt = random_(),
      id = 'USR-' + Utilities.getUuid().slice(0, 8).toUpperCase();
    append_('APP_USERS', {
      user_id: id,
      username,
      display_name: display,
      role,
      password_salt: salt,
      password_hash: pwHash_(password, salt),
      active,
      failed_count: 0,
      locked_until: '',
      created_at: now_(),
    });
    nist118Temporary_(id);
    admin35SaveProfile_(actor, id, data);
    writeAudit_(
      actor,
      'CREATE',
      'USER_MANAGEMENT',
      'APP_USERS',
      id,
      'SUCCESS',
      'สร้างผู้ใช้ ' + username,
    );
    return id;
  });
}

// apps/webapp/src/server/features/users/user-service.js
function itsdImpl_resetAdminUserPassword_(token, userId, newPassword) {
  const actor = requirePermission_(token, 'USER_MANAGEMENT', 'MANAGE');
  userId = boundedText_(userId, 'รหัสผู้ใช้', 80, true);
  newPassword = boundedText_(newPassword, 'รหัสผ่านใหม่', SECURITY_LIMITS.PASSWORD, false);
  if (newPassword.length < 12) throw Error('รหัสผ่านใหม่อย่างน้อย 12 อักขระ');
  return lock_(() => {
    const user = find_('APP_USERS', 'user_id', userId);
    if (!user) throw Error('ไม่พบผู้ใช้');
    const salt = random_();
    nist118Temporary_(userId);
    update_('APP_USERS', user.__row, {
      password_salt: salt,
      password_hash: pwHash_(newPassword, salt),
      failed_count: 0,
      locked_until: '',
    });
    revokeUserSessions_(userId);
    writeAudit_(
      actor,
      'PASSWORD_RESET',
      'USER_MANAGEMENT',
      'APP_USERS',
      userId,
      'SUCCESS',
      'รีเซ็ตรหัสผ่านผู้ใช้ ' + user.username,
    );
    return true;
  });
}

// apps/webapp/src/server/features/users/user-service.js
function itsdImpl_setAdminUserActive_(token, userId, active) {
  const actor = requirePermission_(token, 'USER_MANAGEMENT', 'MANAGE');
  userId = boundedText_(userId, 'รหัสผู้ใช้', 80, true);
  active = Boolean(active);
  return lock_(() => {
    const user = find_('APP_USERS', 'user_id', userId);
    if (!user) throw Error('ไม่พบผู้ใช้');
    if (user.user_id === actor.user_id && !active) throw Error('ระงับบัญชีของตนเองไม่ได้');
    if (
      user.role === 'ADMIN' &&
      !active &&
      rows_('APP_USERS').filter((x) => x.role === 'ADMIN' && admin35Bool_(x.active)).length <= 1
    )
      throw Error('ต้องมีผู้ดูแลระบบที่ใช้งานได้อย่างน้อยหนึ่งบัญชี');
    update_('APP_USERS', user.__row, { active });
    revokeUserSessions_(userId);
    writeAudit_(
      actor,
      active ? 'ENABLE' : 'DISABLE',
      'USER_MANAGEMENT',
      'APP_USERS',
      userId,
      'SUCCESS',
      (active ? 'เปิด' : 'ระงับ') + 'การใช้งาน ' + user.username,
    );
    return true;
  });
}

// apps/webapp/src/server/platform/sheets/schema-installer.js
function admin35EnsureSheet_(name, headers) {
  let s = book_().getSheetByName(name);
  if (!s) {
    s = book_().insertSheet(name);
    s.getRange(1, 1, 1, headers.length).setValues([headers]);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, headers.length)
      .setBackground('#102b49')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    resetRows_(name);
  }
  return s;
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function admin35EnsureSetting_(key, value) {
  const row = find_('APP_SETTINGS', 'key', key);
  if (!row) append_('APP_SETTINGS', { key, value: value === undefined ? '' : value });
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function admin39DatabaseSchemaVersion_() {
  const name = String(book_().getName() || '');
  const m = name.match(/v\d+(?:\.\d+){2}/i);
  return m ? m[0] : 'v0.1.0';
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function admin39SystemInfo_() {
  const required = [
    'APP_SETTINGS',
    'MST_ORG_UNITS',
    'APP_LOOKUPS',
    'MST_DEVICE_MODELS',
    'APP_ROLES',
    'APP_ROLE_PERMISSIONS',
    'APP_USERS',
    'APP_USER_PROFILE',
    'INVENTORY',
    'INCIDENT',
    'INCIDENT_META',
    'INCIDENT_EVENTS',
    'INCIDENT_FILES',
    'APP_SESSIONS',
    'APP_AUDIT_LOG',
  ];
  const missing = required.filter((name) => !book_().getSheetByName(name));
  let updated = '';
  try {
    updated = Utilities.formatDate(
      DriveApp.getFileById(book_().getId()).getLastUpdated(),
      TZ,
      'yyyy-MM-dd HH:mm:ss',
    );
  } catch (_) {}
  return {
    version: typeof APP_VERSION !== 'undefined' ? APP_VERSION : '',
    database_schema: admin39DatabaseSchemaVersion_(),
    database_status: missing.length ? 'DEGRADED' : 'ONLINE',
    missing_sheets: missing,
    database_name: book_().getName(),
    last_updated: updated,
    timezone: TZ,
    sheet_count: book_().getSheets().length,
  };
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function itsdImpl_getAdminSettings_(token) {
  const actor = requirePermission_(token, 'SETTINGS', 'VIEW');
  ensureAdminModuleSchema_();
  const settings = Object.fromEntries(rows_('APP_SETTINGS').map((x) => [x.key, x.value])),
    brand = getSystemBranding_(settings);
  return {
    project_name: brand.project_name,
    service_folder_id: settings.service_folder_id || '',
    backup_folder_id: settings.backup_folder_id || '',
    documents_folder_id: settings.documents_folder_id || '',
    pictures_folder_id: settings.pictures_folder_id || '',
    system_assets_folder_id: settings.system_assets_folder_id || '',
    timezone: TZ,
    branding: { short_name: brand.short_name, description: brand.description },
    icon: {
      file_id: brand.icon_file_id,
      filename: brand.icon_filename,
      mime: brand.icon_mime_type,
      width: brand.icon_width,
      height: brand.icon_height,
      updated_at: brand.icon_updated_at,
      updated_by: brand.icon_updated_by,
    },
    system_info: admin39SystemInfo_(),
    session: admin39SessionInfo_(token, actor),
    backup: admin39BackupInfo_(settings),
    can_edit: hasPermissionForUser_(actor, 'SETTINGS', 'EDIT'),
    can_manage: hasPermissionForUser_(actor, 'SETTINGS', 'MANAGE'),
  };
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function admin35SetSetting_(key, value) {
  const row = find_('APP_SETTINGS', 'key', key);
  if (row) update_('APP_SETTINGS', row.__row, { value });
  else append_('APP_SETTINGS', { key, value });
}

// apps/webapp/src/server/features/settings/admin-settings-service.js
function itsdImpl_saveAdminSettings_(token, data) {
  const actor = requirePermission_(token, 'SETTINGS', 'EDIT');
  data = plainObject_(data || {}, 'ข้อมูลตั้งค่าระบบ');
  const projectName = boundedText_(data.project_name, 'ชื่อโครงการ', 120, true),
    shortName = boundedText_(data.system_short_name, 'ชื่อย่อระบบ', 80, true),
    description = boundedText_(data.system_description, 'คำอธิบายระบบ', 240, true);
  if (!projectName) throw Error('กรุณาระบุชื่อโครงการ');
  const folders = admin44ValidateFolderStructure_(data);
  return lock_(() => {
    ensureAdminModuleSchema_();
    admin35SetSetting_('project_name', projectName);
    Object.keys(folders).forEach((key) => admin35SetSetting_(key, folders[key]));
    admin35SetSetting_('system_short_name', shortName || projectName);
    admin35SetSetting_('system_description', description);
    writeAudit_(
      actor,
      'SETTING_CHANGE',
      'SETTINGS',
      'APP_SETTINGS',
      'project_name/drive_folders/branding',
      'SUCCESS',
      'ปรับปรุงการตั้งค่าทั่วไป โครงสร้าง Google Drive และ Branding',
    );
    return true;
  });
}

// apps/webapp/src/server/features/permissions/permission-schema.js
function ensureAdminModuleSchema_() {
  admin35EnsureSheet_('APP_USER_PROFILE', COL.APP_USER_PROFILE);
  admin35EnsureSheet_('APP_ROLES', COL.APP_ROLES);
  admin35EnsureSheet_('APP_ROLE_PERMISSIONS', COL.APP_ROLE_PERMISSIONS);
  admin35EnsureSheet_('APP_AUDIT_LOG', COL.APP_AUDIT_LOG);
  const roleDefs = [
    ['ROLE-ADMIN', 'ADMIN', 'ผู้ดูแลระบบ', 'สิทธิ์ผู้ดูแลระบบเต็มรูปแบบ', 1],
    ['ROLE-MANAGER', 'MANAGER', 'ผู้จัดการ', 'สิทธิ์บริหารจัดการตาม Permission Matrix', 2],
    [
      'ROLE-TECHNICIAN',
      'TECHNICIAN',
      'เจ้าหน้าที่ IT',
      'สิทธิ์เจ้าหน้าที่เทคนิคตาม Permission Matrix',
      3,
    ],
    ['ROLE-ITSUPPORT', 'ITSUPPORT', 'IT Support', 'IT support permissions by Permission Matrix', 4],
    ['ROLE-USER', 'USER', 'ผู้ใช้งานทั่วไป', 'แจ้งซ่อมและติดตามงานของตนเอง', 5],
  ];
  roleDefs.forEach((r) => {
    if (!find_('APP_ROLES', 'role_code', r[1]))
      append_('APP_ROLES', {
        role_id: r[0],
        role_code: r[1],
        role_name: r[2],
        description: r[3],
        active: true,
        sort_order: r[4],
        created_at: now_(),
        created_by: 'SYSTEM',
        updated_at: now_(),
        updated_by: 'SYSTEM',
      });
  });
  ADMIN35_ROLE_CODES.forEach((role) =>
    ADMIN35_MODULES.forEach((module) => {
      const existing = rows_('APP_ROLE_PERMISSIONS').find(
        (x) =>
          String(x.role_code || '').toUpperCase() === role &&
          String(x.module_code || '').toUpperCase() === module.code,
      );
      if (!existing) {
        const d = admin55DefaultRights_(role, module.code);
        append_('APP_ROLE_PERMISSIONS', {
          permission_id: 'PERM-' + role + '-' + module.code,
          role_code: role,
          module_code: module.code,
          module_name: module.name,
          can_view: d.view,
          can_create: d.create,
          can_edit: d.edit,
          can_delete: d.delete,
          can_export: d.export,
          can_manage: d.manage,
          active: true,
          updated_at: now_(),
          updated_by: 'SYSTEM',
        });
      }
    }),
  );
  [
    ['system_icon_file_id', ''],
    ['system_icon_filename', ''],
    ['system_icon_mime_type', ''],
    ['system_icon_width', String(ADMIN35_ICON_SIZE)],
    ['system_icon_height', String(ADMIN35_ICON_SIZE)],
    ['system_icon_updated_at', ''],
    ['system_icon_updated_by', ''],
    ['system_short_name', SYSTEM_BRANDING_DEFAULTS.short_name],
    ['system_description', SYSTEM_BRANDING_DEFAULTS.description],
    ['backup_last_file_id', ''],
    ['backup_last_filename', ''],
    ['backup_last_at', ''],
    ['backup_last_by', ''],
    ['backup_folder_id', ''],
    ['documents_folder_id', ''],
    ['pictures_folder_id', ''],
    ['system_assets_folder_id', ''],
  ].forEach((x) => admin35EnsureSetting_(x[0], x[1]));
  return true;
}

// apps/webapp/src/server/features/audit/audit-service.js
function writeAudit_(actor, action, moduleCode, entityType, entityId, result, detail, sessionRef) {
  try {
    if (!book_().getSheetByName('APP_AUDIT_LOG')) ensureAdminModuleSchema_();
    const user = actor && typeof actor === 'object' ? actor : {};
    append_('APP_AUDIT_LOG', {
      audit_id: Utilities.getUuid(),
      event_at: now_(),
      actor_user_id: user.user_id || '',
      actor_username: user.username || '',
      action: String(action || '').slice(0, 80),
      module_code: String(moduleCode || '').slice(0, 80),
      entity_type: String(entityType || '').slice(0, 80),
      entity_id: String(entityId || '').slice(0, 160),
      result: String(result || 'SUCCESS').slice(0, 30),
      detail: String(detail || '').slice(0, 1000),
      client_info: '',
      session_ref: String(sessionRef || '').slice(0, 160),
    });
  } catch (e) {
    console.warn('[AUDIT_WRITE_FAILED]', e && e.message ? e.message : e);
  }
}

// apps/webapp/src/server/features/audit/audit-service.js
function auditAuth_(user, action, result, detail, sessionRef) {
  writeAudit_(
    user,
    action,
    'AUTH',
    'USER',
    (user && user.user_id) || '',
    result,
    detail,
    sessionRef,
  );
}

// apps/webapp/src/server/features/audit/audit-service.js
function itsdImpl_getAdminAuditLog_(token, filters) {
  const actor = requirePermission_(token, 'AUDIT_LOG', 'VIEW');
  ensureAdminModuleSchema_();
  filters = filters && typeof filters === 'object' ? filters : {};
  const q = String(filters.q || '')
      .trim()
      .toLowerCase(),
    action = String(filters.action || '')
      .trim()
      .toUpperCase(),
    module = String(filters.module || '')
      .trim()
      .toUpperCase(),
    result = String(filters.result || '')
      .trim()
      .toUpperCase(),
    from = String(filters.from || '').trim(),
    to = String(filters.to || '').trim();
  let all = rows_('APP_AUDIT_LOG')
    .slice()
    .reverse()
    .filter(
      (x) =>
        (!from || String(x.event_at || '').slice(0, 10) >= from) &&
        (!to || String(x.event_at || '').slice(0, 10) <= to) &&
        (!action || String(x.action || '').toUpperCase() === action) &&
        (!module || String(x.module_code || '').toUpperCase() === module) &&
        (!result || String(x.result || '').toUpperCase() === result) &&
        (!q ||
          [x.actor_username, x.action, x.module_code, x.entity_type, x.entity_id, x.detail].some(
            (v) =>
              String(v || '')
                .toLowerCase()
                .includes(q),
          )),
    );
  const total = all.length,
    rows = all.slice(0, 500).map((x) => ({
      id: x.audit_id,
      event_at: x.event_at,
      user: x.actor_username || x.actor_user_id || 'SYSTEM',
      action: x.action,
      module: x.module_code,
      entity_type: x.entity_type,
      entity_id: x.entity_id,
      result: x.result,
      detail: x.detail,
    }));
  const today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'),
    todayRows = all.filter((x) => String(x.event_at || '').slice(0, 10) === today);
  return {
    rows,
    total,
    truncated: total > rows.length,
    summary: {
      today: todayRows.length,
      login: todayRows.filter((x) => String(x.action).indexOf('LOGIN') === 0).length,
      changes: todayRows.filter((x) =>
        [
          'CREATE',
          'EDIT',
          'DELETE',
          'SETTING_CHANGE',
          'PERMISSION_CHANGE',
          'UPLOAD',
          'PASSWORD_RESET',
        ].includes(x.action),
      ).length,
      failed: todayRows.filter((x) => String(x.result).toUpperCase() !== 'SUCCESS').length,
    },
    actions: Array.from(
      new Set(
        rows_('APP_AUDIT_LOG')
          .map((x) => x.action)
          .filter(Boolean),
      ),
    ).sort(),
    modules: Array.from(
      new Set(
        rows_('APP_AUDIT_LOG')
          .map((x) => x.module_code)
          .filter(Boolean),
      ),
    ).sort(),
    can_export: hasPermissionForUser_(actor, 'AUDIT_LOG', 'EXPORT'),
  };
}

// apps/webapp/src/server/features/auth/session-service.js
function admin39SessionInfo_(token, actor) {
  const hash = digest_(token),
    current = find_('APP_SESSIONS', 'token_hash', hash),
    now = Date.now();
  const active = rows_('APP_SESSIONS').filter(
    (x) =>
      x.user_id === actor.user_id &&
      x.revoked !== 'TRUE' &&
      x.expires_at &&
      Date.parse(String(x.expires_at).replace(' ', 'T') + '+07:00') > now,
  );
  let lastLogin = '';
  if (book_().getSheetByName('APP_AUDIT_LOG')) {
    rows_('APP_AUDIT_LOG').forEach((x) => {
      if (
        x.actor_user_id === actor.user_id &&
        String(x.action || '').toUpperCase() === 'LOGIN_SUCCESS' &&
        String(x.result || 'SUCCESS').toUpperCase() === 'SUCCESS' &&
        String(x.event_at || '') > lastLogin
      )
        lastLogin = String(x.event_at || '');
    });
  }
  return {
    expires_at: (current && current.expires_at) || '',
    active_sessions: active.length,
    last_login: lastLogin,
  };
}

// apps/webapp/src/server/features/auth/session-service.js
function itsdImpl_logoutAllSessions_(token) {
  const actor = require_(token, false),
    hash = digest_(token);
  return lock_(() => {
    let count = 0;
    rows_('APP_SESSIONS')
      .filter((x) => x.user_id === actor.user_id && x.revoked !== 'TRUE')
      .forEach((x) => {
        update_('APP_SESSIONS', x.__row, { revoked: true });
        count++;
      });
    writeAudit_(
      actor,
      'LOGOUT_ALL',
      'SETTINGS',
      'APP_SESSIONS',
      actor.user_id,
      'SUCCESS',
      'ออกจากระบบทุกอุปกรณ์ จำนวน ' + count + ' session',
      hash.slice(0, 16),
    );
    return { revoked: count };
  });
}

// apps/webapp/src/server/features/backups/backup-service.js
function admin39BackupInfo_(settings) {
  return {
    last_file_id: settings.backup_last_file_id || '',
    last_filename: settings.backup_last_filename || '',
    last_at: settings.backup_last_at || '',
    last_by: settings.backup_last_by || '',
    folder_id: settings.backup_folder_id || '',
    folder_label: 'Google Drive / Backup Files',
  };
}

// apps/webapp/src/server/features/backups/backup-service.js
function admin39BackupFolder_() {
  return driveFolderBySetting_('backup_folder_id', 'Google Drive Backup Files');
}

// apps/webapp/src/server/features/backups/backup-service.js
function itsdImpl_createDatabaseBackup_(token) {
  const actor = requirePermission_(token, 'SETTINGS', 'MANAGE');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const folder = admin39BackupFolder_(),
      stamp = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd_HHmmss'),
      brand = getSystemBranding_(),
      name = brand.project_name + ' — Database Backup ' + stamp,
      copy = DriveApp.getFileById(book_().getId()).makeCopy(name, folder),
      at = now_();
    admin35SetSetting_('backup_last_file_id', copy.getId());
    admin35SetSetting_('backup_last_filename', copy.getName());
    admin35SetSetting_('backup_last_at', at);
    admin35SetSetting_('backup_last_by', actor.username || actor.user_id);
    admin35SetSetting_('backup_folder_id', folder.getId());
    writeAudit_(
      actor,
      'BACKUP',
      'SETTINGS',
      'DATABASE',
      copy.getId(),
      'SUCCESS',
      'สำรองฐานข้อมูล ' + copy.getName(),
    );
    return {
      file_id: copy.getId(),
      filename: copy.getName(),
      at,
      by: actor.username || actor.user_id,
      folder_id: folder.getId(),
    };
  });
}

// apps/webapp/src/server/platform/drive/folder-validation.js
function admin44FolderInput_(value, label) {
  const id = boundedText_(value, label, SECURITY_LIMITS.SETTING_VALUE, true);
  if (!id) throw Error('กรุณาระบุ ' + label);
  try {
    const folder = DriveApp.getFolderById(id);
    folder.getName();
    return { id, folder };
  } catch (_) {
    throw Error('ไม่สามารถเข้าถึง ' + label + ' ได้ กรุณาตรวจสอบ Folder ID และสิทธิ์การเข้าถึง');
  }
}

// apps/webapp/src/server/platform/drive/folder-validation.js
function admin44IsDirectChild_(folder, parentId) {
  const parents = folder.getParents();
  while (parents.hasNext()) {
    if (parents.next().getId() === parentId) return true;
  }
  return false;
}

// apps/webapp/src/server/platform/drive/folder-validation.js
function admin44ValidateFolderStructure_(data) {
  const root = admin44FolderInput_(data.service_folder_id, 'Google Drive Root Folder');
  const children = [
    ['backup_folder_id', 'Google Drive Backup Files'],
    ['documents_folder_id', 'Google Drive Documents'],
    ['pictures_folder_id', 'Google Drive Pictures'],
    ['system_assets_folder_id', 'Google Drive System Assets'],
  ].map((x) => [x[0], x[1], admin44FolderInput_(data[x[0]], x[1])]);
  const ids = new Set([root.id]);
  for (const item of children) {
    if (ids.has(item[2].id)) throw Error('Folder ID ของ ' + item[1] + ' ซ้ำกับโฟลเดอร์อื่น');
    ids.add(item[2].id);
    if (!admin44IsDirectChild_(item[2].folder, root.id))
      throw Error(item[1] + ' ต้องอยู่ภายใต้ Google Drive Root Folder');
  }
  return {
    service_folder_id: root.id,
    backup_folder_id: children[0][2].id,
    documents_folder_id: children[1][2].id,
    pictures_folder_id: children[2][2].id,
    system_assets_folder_id: children[3][2].id,
  };
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_sheetExists_(name) {
  return Boolean(book_().getSheetByName(name));
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_resetActionIndex_() {
  Object.keys(PERMISSION_ACTION_INDEX_).forEach((key) => delete PERMISSION_ACTION_INDEX_[key]);
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_seedActionPermissions_() {
  permission_resetActionIndex_();
  const b = book_();
  let s = b.getSheetByName('APP_ROLE_ACTION_PERMISSIONS');
  if (!s) {
    s = b.insertSheet('APP_ROLE_ACTION_PERMISSIONS');
    s.getRange(1, 1, 1, PERMISSION_ACTION_HEADERS_.length).setValues([PERMISSION_ACTION_HEADERS_]);
    s.setFrozenRows(1);
    s.setFrozenColumns(3);
    s.getRange(1, 1, 1, PERMISSION_ACTION_HEADERS_.length)
      .setBackground('#102b49')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    // Code.js caches sheet objects: add the new sheet before the first rows_ read.
    RUNTIME_CACHE_.sheets['APP_ROLE_ACTION_PERMISSIONS'] = s;
  }
  const heads = s.getRange(1, 1, 1, PERMISSION_ACTION_HEADERS_.length).getDisplayValues()[0];
  if (heads.join('|') !== PERMISSION_ACTION_HEADERS_.join('|'))
    throw Error('APP_ROLE_ACTION_PERMISSIONS: Header mismatch; stop without writing');
  resetRows_('APP_ROLE_ACTION_PERMISSIONS');
  const current = rows_('APP_ROLE_ACTION_PERMISSIONS');
  // Restore only immutable ADMIN recovery keys if legacy UI wrote FALSE earlier.
  current
    .filter(
      (x) =>
        String(x.role_key || '').toUpperCase() === 'ADMIN' &&
        ['role.manage', 'permission.update'].includes(String(x.action_key || '')) &&
        String(x.is_allowed || '').toUpperCase() !== 'TRUE',
    )
    .forEach((x) => {
      update_('APP_ROLE_ACTION_PERMISSIONS', x.__row, {
        is_allowed: 'TRUE',
        updated_at: now_(),
        updated_by: 'SYSTEM_RECOVERY',
      });
    });
  const used = new Set(
    current.map((x) => String(x.role_key || '').toUpperCase() + '|' + String(x.action_key || '')),
  );
  const date = now_();
  PERMISSION_ACTION_DEFAULTS_.concat(PERMISSION_LINE_ACTION_DEFAULTS_).forEach((x) => {
    const key = x[1] + '|' + x[3];
    if (used.has(key)) return;
    append_('APP_ROLE_ACTION_PERMISSIONS', {
      permission_id: x[0],
      role_key: x[1],
      module_key: x[2],
      action_key: x[3],
      action_name: x[4],
      is_allowed: x[5],
      scope_rule: x[6],
      is_system_required: x[7],
      updated_at: date,
      updated_by: x[8],
      note: x[9],
    });
    used.add(key);
  });
  PERMISSION_ACTION_SEEDED_ = true;
  return true;
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_actionRows_() {
  if (!PERMISSION_ACTION_SEEDED_) permission_seedActionPermissions_();
  return rows_('APP_ROLE_ACTION_PERMISSIONS');
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_actionIndex_(roleOrUser) {
  const role = permission_role_(roleOrUser);
  if (PERMISSION_ACTION_INDEX_[role]) return PERMISSION_ACTION_INDEX_[role];
  const index = Object.create(null);
  permission_actionRows_().forEach((row) => {
    if (
      String(row.role_key || '')
        .trim()
        .toUpperCase() !== role
    )
      return;
    const key = String(row.action_key || '').trim();
    if (!key) return;
    index[key] = {
      allowed:
        String(row.is_allowed || '')
          .trim()
          .toUpperCase() === 'TRUE',
      scope: String(row.scope_rule || 'none').trim() || 'none',
    };
  });
  PERMISSION_ACTION_INDEX_[role] = index;
  return index;
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_role_(roleOrUser) {
  return String((roleOrUser && roleOrUser.role) || roleOrUser || 'USER')
    .trim()
    .toUpperCase();
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_defaultAllowed_(role, actionKey) {
  role = permission_role_(role);
  if (role === 'ADMIN') return true;
  if (role === 'MANAGER')
    return [
      'ticket.manage_all',
      'ticket.manage_workflow',
      'ticket.accept',
      'ticket.assign_self',
      'ticket.update_status',
      'ticket.update_repair_detail',
      'ticket.close',
      'ticket.reopen',
      'ticket.cancel',
      'ticket.upload_file',
      'ticket.create',
      'ticket.create_for_user',
      'master_data.import',
      'inventory.edit',
    ].includes(actionKey);
  const tech = [
    'ticket.view_unassigned',
    'ticket.accept',
    'ticket.assign_self',
    'ticket.update_status',
    'ticket.update_repair_detail',
    'ticket.upload_file',
    'ticket.close',
    'ticket.reopen',
    'ticket.cancel',
    'ticket.manage_workflow',
    'ticket.create_for_user',
    'ticket.manage_all',
    'inventory.view',
    'inventory.edit',
    'inventory.update_after_inspection',
    'master_data.import',
    'role.manage',
    'permission.update',
    'user.manage',
    'system.setting',
  ];
  if (role === 'TECHNICIAN' || role === 'ITSUPPORT') return tech.includes(actionKey);
  if (role === 'USER') return ['ticket.create', 'ticket.update_status'].includes(actionKey);
  return false;
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_hasAction_(roleOrUser, actionKey) {
  const role = permission_role_(roleOrUser),
    key = String(actionKey || '').trim();
  // Immutable ADMIN recovery actions cannot be disabled from UI or direct API.
  if (role === 'ADMIN' && ['role.manage', 'permission.update'].includes(key)) return true;
  const entry = permission_actionIndex_(role)[key];
  if (entry) return entry.allowed;
  return permission_defaultAllowed_(role, key);
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_actionScope_(roleOrUser, actionKey) {
  const role = permission_role_(roleOrUser),
    key = String(actionKey || '').trim();
  const entry = permission_actionIndex_(role)[key];
  return entry ? entry.scope : 'default';
}

// apps/webapp/src/server/features/permissions/action-permissions.js
function permission_publicActionMatrix_() {
  permission_seedActionPermissions_();
  return permission_actionRows_().map((x) => ({
    permission_id: x.permission_id,
    role_key: x.role_key,
    module_key: x.module_key,
    action_key: x.action_key,
    action_name: x.action_name,
    is_allowed: String(x.is_allowed || '').toUpperCase() === 'TRUE',
    scope_rule: x.scope_rule,
    is_system_required: String(x.is_system_required || '').toUpperCase() === 'TRUE',
    updated_at: x.updated_at,
    updated_by: x.updated_by,
    note: x.note,
  }));
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_isUnassigned_(ticket, meta) {
  return !String((meta && meta.assigned_to) || (ticket && ticket['ผู้ดำเนินการ']) || '').trim();
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_isReporter_(u, ticket) {
  return (
    String((ticket && ticket['ผู้แจ้งปัญหา']) || '').trim() ===
    String((u && u.display_name) || '').trim()
  );
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_isRelated_(u, ticket, meta) {
  return isTicketAssignedToUser_(u, ticket, meta) || ticketPermission_isReporter_(u, ticket);
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_canView_(u, ticket, meta) {
  const role = roleKey_(u),
    status = String((ticket && ticket['สถานะการแจ้งซ่อม']) || 'แจ้งเรื่อง').trim() || 'แจ้งเรื่อง';
  if (['ADMIN', 'MANAGER'].includes(role) || permission_hasAction_(u, 'ticket.manage_all'))
    return true;
  if (ticketPermission_isRequesterOnly_(u)) return ticketPermission_isReporter_(u, ticket);
  if (ticketPermission_isScopedOperator_(u)) {
    if (ticketPermission_isRelated_(u, ticket, meta)) return true;
    return (
      permission_hasAction_(u, 'ticket.view_unassigned') &&
      ticketPermission_isUnassigned_(ticket, meta) &&
      ['แจ้งเรื่อง', 'รับแจ้ง', 'มอบหมาย'].includes(status)
    );
  }
  return false;
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_transitionMap_() {
  return {
    แจ้งเรื่อง: ['รับแจ้ง'],
    รับแจ้ง: ['มอบหมาย'],
    มอบหมาย: ['กำลังดำเนินการ'],
    กำลังดำเนินการ: ['รอยืนยันผล'],
    รอยืนยันผล: ['ปิดงาน'],
    ปิดงาน: [],
  };
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_actionForTransition_(from, to, hasResolution) {
  if (to === 'รับแจ้ง') return 'ticket.accept';
  if (to === 'มอบหมาย') return 'ticket.assign_self';
  if (to === 'ปิดงาน') return 'ticket.close';
  if (hasResolution) return 'ticket.update_repair_detail';
  return 'ticket.update_status';
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_statusTargetsFor_(u, from, ticket, meta) {
  const role = roleKey_(u),
    map = ticketPermission_transitionMap_(),
    targets = map[from] || [];
  if (ticketPermission_isRequesterOnly_(u))
    return targets.filter(
      (s) => s === 'ปิดงาน' && permission_hasAction_(u, 'ticket.update_status'),
    );
  if (!['TECHNICIAN', 'ITSUPPORT', 'ADMIN', 'MANAGER'].includes(role) && !permission_hasAction_(u, 'ticket.manage_workflow')) return [];
  if (!permission_hasAction_(u, 'ticket.manage_workflow')) return [];
  return targets.filter((to) => {
    const action = ticketPermission_actionForTransition_(from, to, false);
    if (!permission_hasAction_(u, action)) return false;
    if (ticketPermission_isScopedOperator_(u) && from === 'แจ้งเรื่อง' && to === 'รับแจ้ง') {
      return (
        ticketPermission_isRelated_(u, ticket, meta) ||
        (ticketPermission_isUnassigned_(ticket, meta) &&
          permission_hasAction_(u, 'ticket.view_unassigned'))
      );
    }
    return true;
  });
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_prepareChange_(u, ticket, meta, to, d) {
  const role = roleKey_(u),
    from = String((ticket && ticket['สถานะการแจ้งซ่อม']) || 'แจ้งเรื่อง').trim() || 'แจ้งเรื่อง';
  if (!(ticketPermission_transitionMap_()[from] || []).includes(to))
    throw Error('การเปลี่ยนสถานะนี้ไม่ถูกต้องตาม Workflow');
  if (ticketPermission_isRequesterOnly_(u)) {
    if (!ticketPermission_isReporter_(u, ticket))
      throw Error('USER เปลี่ยนสถานะได้เฉพาะงานของตนเอง');
    if (to !== 'ปิดงาน' || !permission_hasAction_(u, 'ticket.update_status'))
      throw Error('USER สามารถยืนยันปิดงานได้เมื่ออยู่สถานะรอยืนยันผลเท่านั้น');
    return { action_key: 'ticket.update_status' };
  }
  const action = ticketPermission_actionForTransition_(from, to, Boolean(d && d.resolution));
  if (!permission_hasAction_(u, 'ticket.manage_workflow') || !permission_hasAction_(u, action))
    throw Error('สิทธิ์ไม่เพียงพอสำหรับการดำเนินการนี้: ' + action);
  if (d && d.resolution && !permission_hasAction_(u, 'ticket.update_repair_detail'))
    throw Error('ไม่มีสิทธิ์บันทึกรายละเอียดการซ่อม');
  if (permission_hasAction_(u, 'ticket.manage_all')) return { action_key: action };
  if (ticketPermission_isScopedOperator_(u)) {
    const unassigned = ticketPermission_isUnassigned_(ticket, meta),
      related = ticketPermission_isRelated_(u, ticket, meta);
    const selfName = String(u.display_name || u.username || u.user_id),
      selfKeys = identityKeys_(u);
    if (from === 'แจ้งเรื่อง' && to === 'รับแจ้ง') {
      if (!related && !(unassigned && permission_hasAction_(u, 'ticket.view_unassigned')))
        throw Error('TECHNICIAN รับเรื่องได้เฉพาะงานที่มองเห็นและยังไม่มีผู้รับผิดชอบ');
      return { action_key: action };
    }
    if (action === 'ticket.assign_self') {
      if (!unassigned && !related) throw Error('งานนี้มีผู้รับผิดชอบแล้ว ไม่สามารถรับงานแทนได้');
      if (d && d.assigned_to && selfKeys.indexOf(String(d.assigned_to).trim().toUpperCase()) < 0)
        throw Error('TECHNICIAN รับงานแทนผู้อื่นไม่ได้');
      return { action_key: action, assigned_to: selfName };
    }
    if (!related) throw Error('TECHNICIAN แก้ไขได้เฉพาะงานที่รับผิดชอบหรือเกี่ยวข้องกับตนเอง');
    if (
      d &&
      d.assigned_to &&
      selfKeys.indexOf(String(d.assigned_to).trim().toUpperCase()) < 0 &&
      !permission_hasAction_(u, 'ticket.assign_to_other')
    )
      throw Error('TECHNICIAN ไม่สามารถมอบหมายงานให้ผู้อื่นได้');
    return {
      action_key: action,
      assigned_to: String(
        (ticket && ticket['ผู้ดำเนินการ']) || (meta && meta.assigned_to) || selfName,
      ),
    };
  }
  return { action_key: action };
}

// apps/webapp/src/server/features/tickets/workflow-permissions.js
function ticketPermission_canUploadFile_(u, ticket, meta) {
  const role = roleKey_(u);
  if (ticketPermission_isRequesterOnly_(u)) return true; // allowed for their own tickets only (ownTicket_ checks visibility)
  if (!permission_hasAction_(u, 'ticket.upload_file')) throw Error('ไม่มีสิทธิ์แนบไฟล์ Service');
  if (
    ticketPermission_isScopedOperator_(u) &&
    !permission_hasAction_(u, 'ticket.manage_all') &&
    !ticketPermission_isRelated_(u, ticket, meta)
  )
    throw Error('แนบไฟล์ได้เฉพาะงานที่เกี่ยวข้องกับตนเอง');
  return true;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function ensureLookups_() {
  const book = book_();
  let sheet = book.getSheetByName('APP_LOOKUPS');
  if (sheet) return sheet;
  sheet = book.insertSheet('APP_LOOKUPS');
  sheet.getRange(1, 1, 1, LOOKUP_HEADERS.length).setValues([LOOKUP_HEADERS]);
  sheet.setFrozenRows(1);
  sheet
    .getRange(1, 1, 1, LOOKUP_HEADERS.length)
    .setBackground('#102b49')
    .setFontColor('#ffffff')
    .setFontWeight('bold');
  const initial = [
    ...DEVICE_DEFAULTS.map((label, i) => ['DEVICE', label, i]),
    ...TYPES.map((label, i) => ['PROBLEM', label, i]),
  ];
  const seen = new Set();
  rows_('MST_ORG_UNITS').forEach((row) => {
    const label = String(row.location || '').trim();
    if (label && !seen.has(label)) {
      seen.add(label);
      initial.push(['LOCATION', label, seen.size]);
    }
  });
  if (initial.length)
    sheet
      .getRange(2, 1, initial.length, LOOKUP_HEADERS.length)
      .setValues(
        initial.map(([type, label, order]) => [
          Utilities.getUuid(),
          type,
          label,
          true,
          order + 1,
          now_(),
        ]),
      );
  return sheet;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function lookupLabels_(type, fallback) {
  if (!book_().getSheetByName('APP_LOOKUPS')) return fallback;
  return rows_('APP_LOOKUPS')
    .filter((x) => x.lookup_type === type && x.active !== 'FALSE')
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((x) => x.label);
}

// apps/webapp/src/server/features/master-data/master-data-service.js
const DEVICE_MODEL_HEADERS_ = ['model_id', 'device_type', 'brand', 'model_name', 'active', 'sort_order', 'updated_at'];

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelKey_(type, brand, model) {
  return JSON.stringify([type, brand, model].map(v => String(v || '').trim().normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ')));
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelLegacy_(inventory) {
  const seen = new Set(), out = [];
  inventory.forEach(row => {
    const type = String(row['ประเภทอุปกรณ์'] || '').trim(), brand = String(row['ยี่ห้อ'] || '').trim(), model = String(row['รุ่น'] || '').trim();
    const key = deviceModelKey_(type, brand, model);
    if (!type || !brand || !model || [type, brand, model].some(v => v.length > 120) || seen.has(key)) return;
    seen.add(key);
    out.push({ id: '', type, brand, model, active: true, sort: out.length + 1 });
  });
  return out;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelCatalog_() {
  const sheet = book_().getSheetByName('MST_DEVICE_MODELS');
  if (!sheet) return null; // Distinguish an absent schema from a deliberately empty catalogue.
  const headers = header_('MST_DEVICE_MODELS');
  if (DEVICE_MODEL_HEADERS_.some((h, i) => headers[i] !== h)) throw Error('โครงสร้าง MST_DEVICE_MODELS ไม่ถูกต้อง กรุณาให้ผู้ดูแลตรวจสอบ');
  // Checkbox validation can materialize FALSE in otherwise empty rows.
  return rows_('MST_DEVICE_MODELS')
    .filter(x => ['model_id', 'device_type', 'brand', 'model_name'].some(k => String(x[k] || '').trim()))
    .map(x => ({
    id: x.model_id, type: x.device_type, brand: x.brand, model: x.model_name,
    active: String(x.active).toUpperCase() === 'TRUE', sort: Number(x.sort_order) || 0,
  })).sort((a, b) => a.sort - b.sort || a.model.localeCompare(b.model, 'th', { numeric: true }));
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function brandingBrandCatalog_() {
  const sheet = book_().getSheetByName('Branding');
  if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return [];
  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values.shift().map(value => String(value || '').trim());
  const brandColumn = headers.findIndex(value => /^(brand|branding|ยี่ห้อ|แบรนด์)$/i.test(value));
  if (brandColumn < 0) return [];
  const catalog = new Map();
  values.forEach(row => {
    const brand = String(row[brandColumn] || '').trim(), key = brandLookupKey_(brand);
    if (!key) return;
    const current = catalog.get(key) || { key, brand, branding_count: 0 };
    current.branding_count++;
    catalog.set(key, current);
  });
  return [...catalog.values()];
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function canonicalBrandLabel_(value, branding) {
  const brand = String(value || '').trim(), key = brandLookupKey_(brand);
  if (!key) return '';
  const reference = (branding || brandingBrandCatalog_()).find(item => item.key === key);
  return reference ? reference.brand : brand;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceBrandCatalog_() {
  const branding = brandingBrandCatalog_(), byKey = new Map();
  branding.forEach(item => byKey.set(item.key, {
    key: item.key,
    brand: item.brand,
    branding_count: item.branding_count,
    model_count: 0,
    active_model_count: 0,
    sources: ['Branding'],
  }));
  const models = deviceModelCatalog_();
  (models === null ? deviceModelLegacy_(rows_('INVENTORY')) : models).forEach(model => {
    const key = brandLookupKey_(model.brand);
    if (!key) return;
    const reference = branding.find(item => item.key === key);
    const current = byKey.get(key) || {
      key,
      brand: reference ? reference.brand : String(model.brand || '').trim(),
      branding_count: reference ? reference.branding_count : 0,
      model_count: 0,
      active_model_count: 0,
      sources: reference ? ['Branding'] : [],
    };
    current.model_count++;
    if (model.active) current.active_model_count++;
    if (!current.sources.includes('MST_DEVICE_MODELS')) current.sources.unshift('MST_DEVICE_MODELS');
    byKey.set(key, current);
  });
  return [...byKey.values()].map(item => ({
    ...item,
    active: item.active_model_count > 0,
    source: item.sources.join(' + '),
  })).sort((a, b) => a.brand.localeCompare(b.brand, 'en', { numeric: true, sensitivity: 'base' }));
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceBrandChoices_() {
  return deviceBrandCatalog_().filter(item => item.active).map(item => item.brand);
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function ensureDeviceModels_() {
  let sheet = book_().getSheetByName('MST_DEVICE_MODELS');
  if (sheet) { deviceModelCatalog_(); return sheet; }
  const legacy = deviceModelLegacy_(rows_('INVENTORY'));
  sheet = book_().insertSheet('MST_DEVICE_MODELS');
  sheet.getRange(1, 1, 1, DEVICE_MODEL_HEADERS_.length).setValues([DEVICE_MODEL_HEADERS_]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, DEVICE_MODEL_HEADERS_.length).setFontWeight('bold');
  if (legacy.length) sheet.getRange(2, 1, legacy.length, DEVICE_MODEL_HEADERS_.length).setValues(legacy.map(x =>
    [Utilities.getUuid(), x.type, x.brand, x.model, true, x.sort, now_()].map(safeSheetValue_)));
  resetRows_('MST_DEVICE_MODELS');
  return sheet;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelChoices_() {
  const catalog = deviceModelCatalog_();
  const branding = brandingBrandCatalog_();
  const source = catalog === null ? deviceModelLegacy_(rows_('INVENTORY')) : catalog;
  // Inactive entries must never reappear through inventory fallback.
  return source.map(item => ({ ...item, brand: canonicalBrandLabel_(item.brand, branding) }));
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelReferenced_(item) {
  const key = deviceModelKey_(item.type, item.brand, item.model);
  return ['INVENTORY', 'INCIDENT'].some(name => rows_(name).some(row =>
    deviceModelKey_(row['ประเภทอุปกรณ์'], row['ยี่ห้อ'], row['รุ่น']) === key));
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function deviceModelParentLabels_(kind) {
  if (kind === 'BRAND') return deviceBrandCatalog_().map(item => item.brand);
  const labels = lookupLabels_(kind, kind === 'DEVICE' ? DEVICE_DEFAULTS : []);
  const column = kind === 'DEVICE' ? 'ประเภทอุปกรณ์' : 'ยี่ห้อ';
  const inactive = new Set((book_().getSheetByName('APP_LOOKUPS') ? rows_('APP_LOOKUPS') : [])
    .filter(x => x.lookup_type === kind && String(x.active).toUpperCase() === 'FALSE').map(x => String(x.label).trim()));
  return [...new Set(labels.concat(rows_('INVENTORY').map(x => String(x[column] || '').trim())).filter(x => x && !inactive.has(x)))];
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_saveDeviceModel_(token, data) {
  data = plainObject_(data || {}, 'ข้อมูลรุ่นอุปกรณ์');
  const id = boundedText_(data.id, 'รหัสรุ่น', 80, true);
  const actor = requirePermission_(token, 'MASTER_DATA', id ? 'EDIT' : 'CREATE');
  const type = boundedText_(data.type, 'ประเภทอุปกรณ์', 120, true),
    brandInput = boundedText_(data.brand, 'ยี่ห้อ', 120, true),
    model = boundedText_(data.model, 'รุ่น', 120, true),
    brand = canonicalBrandLabel_(brandInput);
  if (!type || !brand || !model) throw Error('กรุณาระบุประเภท ยี่ห้อ และรุ่นให้ครบ');
  if (typeof data.active !== 'undefined' && typeof data.active !== 'boolean') throw Error('สถานะไม่ถูกต้อง');
  const active = data.active !== false;
  const sort = Number(data.sort || 0);
  if (!Number.isInteger(sort) || sort < 0 || sort > 1000000) throw Error('ลำดับต้องเป็นจำนวนเต็ม 0–1000000');
  return lock_(() => {
    ensureDeviceModels_();
    const all = deviceModelCatalog_(), old = id ? all.find(x => x.id === id) : null;
    if (id && !old) throw Error('ไม่พบรุ่นอุปกรณ์');
    const identityChanged = !old || deviceModelKey_(old.type, old.brand, old.model) !== deviceModelKey_(type, brand, model);
    if (old && identityChanged && deviceModelReferenced_(old))
      throw Error('รุ่นนี้ถูกใช้งานแล้ว กรุณาเพิ่มรุ่นใหม่และปิดใช้งานรุ่นเดิม');
    if (!old || identityChanged || old.type !== type || old.brand !== brand || active && !old.active) {
      if (!deviceModelParentLabels_('DEVICE').includes(type)) throw Error('กรุณาเลือกประเภทอุปกรณ์ที่ใช้งานอยู่');
      // A brand is introduced by its first model. Branding provides canonical
      // spelling when a matching reference already exists.
    }
    const key = deviceModelKey_(type, brand, model);
    if (all.some(x => x.id !== id && deviceModelKey_(x.type, x.brand, x.model) === key)) throw Error('รุ่นนี้มีอยู่แล้วสำหรับประเภทและยี่ห้อนี้');
    if (old && old.active && !active) requirePermission_(token, 'MASTER_DATA', 'DELETE');
    const modelId = id || Utilities.getUuid();
    const patch = { model_id: modelId, device_type: type, brand, model_name: model, active, sort_order: sort, updated_at: now_() };
    if (old) update_('MST_DEVICE_MODELS', find_('MST_DEVICE_MODELS', 'model_id', id).__row, patch);
    else {
      // Reuse checkbox-only rows instead of appending beyond the prepared sheet.
      const blank = rows_('MST_DEVICE_MODELS').find(x => ['model_id', 'device_type', 'brand', 'model_name'].every(k => !String(x[k] || '').trim()));
      if (blank) update_('MST_DEVICE_MODELS', blank.__row, patch);
      else append_('MST_DEVICE_MODELS', patch);
    }
    writeAudit_(actor, old ? 'EDIT' : 'CREATE', 'MASTER_DATA', 'MST_DEVICE_MODELS', modelId, 'SUCCESS', (old ? 'แก้ไขรุ่น ' : 'เพิ่มรุ่น ') + model);
    return modelId;
  });
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_deactivateDeviceModel_(token, id) {
  const actor = requirePermission_(token, 'MASTER_DATA', 'DELETE');
  id = boundedText_(id, 'รหัสรุ่น', 80, false);
  return lock_(() => {
    ensureDeviceModels_();
    const row = find_('MST_DEVICE_MODELS', 'model_id', id);
    if (!row) throw Error('ไม่พบรุ่นอุปกรณ์');
    update_('MST_DEVICE_MODELS', row.__row, { active: false, updated_at: now_() });
    writeAudit_(actor, 'DELETE', 'MASTER_DATA', 'MST_DEVICE_MODELS', id, 'SUCCESS', 'ปิดใช้งานรุ่น ' + row.model_name);
    return true;
  });
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function inventoryValidateModel_(patch, old) {
  const type = patch['ประเภทอุปกรณ์'], brand = patch['ยี่ห้อ'], model = patch['รุ่น'];
  if (!model) return;
  if (old && ['ประเภทอุปกรณ์', 'ยี่ห้อ', 'รุ่น'].every(k => String(old[k] || '') === String(patch[k] || ''))) return;
  const catalog = deviceModelChoices_();
  const key = deviceModelKey_(type, brand, model);
  const master = catalog.find(x => x.active && deviceModelKey_(x.type, x.brand, x.model) === key);
  if (!master)
    throw Error('กรุณาเลือกรุ่นที่ใช้งานอยู่ให้ตรงกับประเภทและยี่ห้อ หรือให้ผู้ดูแลเพิ่มรุ่นในข้อมูลหลัก');
  patch['ยี่ห้อ'] = master.brand;
  patch['รุ่น'] = master.model;
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function brandLookupKey_(value) {
  return String(value || '').trim().normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ');
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_getMasterData_(token) {
  const user = requirePermission_(token, 'MASTER_DATA', 'VIEW');
  if (!book_().getSheetByName('APP_LOOKUPS')) lock_(ensureLookups_);
  if (!book_().getSheetByName('MST_DEVICE_MODELS')) lock_(ensureDeviceModels_);
  const lookups = book_().getSheetByName('APP_LOOKUPS')
    ? rows_('APP_LOOKUPS').map((x) => ({
        id: x.lookup_id,
        type: x.lookup_type,
        label: x.label,
        active: x.active !== 'FALSE',
        sort: Number(x.sort_order || 0),
      }))
    : [];
  const org = rows_('MST_ORG_UNITS').map((x) => ({
    id: x.org_unit_id,
    first: x.first_org_unit_id,
    second: x.second_org_unit_id,
    name: x.org_full_name,
    short: x.short_name,
    level: x.org_level,
    location: x.location,
    comment: x.comment,
  }));
  const brands = deviceBrandCatalog_();
  return {
    models: deviceModelChoices_(),
    brands,
    modelTypes: deviceModelParentLabels_('DEVICE'),
    modelBrands: brands.map(item => item.brand),
    lookups: lookups.filter((x) => hasPermissionForUser_(user, 'MASTER_DATA', 'EDIT') || x.active),
    org,
    access: {
      create: hasPermissionForUser_(user, 'MASTER_DATA', 'CREATE'),
      edit: hasPermissionForUser_(user, 'MASTER_DATA', 'EDIT'),
      delete: hasPermissionForUser_(user, 'MASTER_DATA', 'DELETE'),
      export: hasPermissionForUser_(user, 'MASTER_DATA', 'EXPORT'),
    },
  };
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_saveLookup_(token, data) {
  data = data || {};
  const actor = requirePermission_(token, 'MASTER_DATA', data.id ? 'EDIT' : 'CREATE');
  if (!['DEVICE', 'BRAND', 'PROBLEM', 'LOCATION'].includes(data.type))
    throw Error('ประเภทข้อมูลอ้างอิงไม่ถูกต้อง');
  const label = String(data.label || '').trim();
  if (!label || label.length > 120) throw Error('กรุณาระบุชื่อ 1-120 ตัวอักษร');
  return lock_(() => {
    ensureLookups_();
    const all = rows_('APP_LOOKUPS'),
      old = all.find((x) => x.lookup_id === data.id);
    if (old && (old.label !== label || old.lookup_type !== data.type) && ['DEVICE', 'BRAND'].includes(old.lookup_type) && deviceModelChoices_().some(x => (old.lookup_type === 'DEVICE' ? x.type : x.brand) === old.label))
      throw Error('รายการนี้มีรุ่นอุปกรณ์อ้างอิง กรุณาเพิ่มรายการใหม่และปิดใช้งานรายการเดิม');
    if (
      all.some(
        (x) =>
          x.lookup_type === data.type &&
          x.label.toLocaleLowerCase() === label.toLocaleLowerCase() &&
          x.lookup_id !== data.id,
      )
    )
      throw Error('รายการนี้มีอยู่แล้ว');
    const patch = {
      lookup_type: data.type,
      label,
      active: data.active !== false,
      sort_order: Number(data.sort) || all.length + 1,
      updated_at: now_(),
    };
    if (old) {
      update_('APP_LOOKUPS', old.__row, patch);
      writeAudit_(
        actor,
        'EDIT',
        'MASTER_DATA',
        'APP_LOOKUPS',
        old.lookup_id,
        'SUCCESS',
        'แก้ไข ' + data.type + ' ' + label,
      );
      return old.lookup_id;
    }
    const id = Utilities.getUuid();
    append_('APP_LOOKUPS', Object.assign({ lookup_id: id }, patch));
    writeAudit_(
      actor,
      'CREATE',
      'MASTER_DATA',
      'APP_LOOKUPS',
      id,
      'SUCCESS',
      'เพิ่ม ' + data.type + ' ' + label,
    );
    return id;
  });
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_deactivateLookup_(token, id) {
  const actor = requirePermission_(token, 'MASTER_DATA', 'DELETE');
  return lock_(() => {
    const item = find_('APP_LOOKUPS', 'lookup_id', id);
    if (!item) throw Error('ไม่พบรายการ');
    update_('APP_LOOKUPS', item.__row, { active: false, updated_at: now_() });
    writeAudit_(
      actor,
      'DELETE',
      'MASTER_DATA',
      'APP_LOOKUPS',
      id,
      'SUCCESS',
      'ปิดใช้งานข้อมูลอ้างอิง ' + item.label,
    );
    return true;
  });
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_saveOrgUnit_(token, data) {
  data = data || {};
  const actor = requirePermission_(token, 'MASTER_DATA', data.id ? 'EDIT' : 'CREATE');
  const name = String(data.name || '').trim(),
    short = String(data.short || '').trim(),
    location = String(data.location || '').trim();
  const level = data.level;
  if (!name || name.length > 160 || !['หน่วยงานหลัก', 'หน่วยงานย่อย'].includes(level))
    throw Error('ชื่อหรือระดับหน่วยงานไม่ถูกต้อง');
  return lock_(() => {
    const all = rows_('MST_ORG_UNITS'),
      old = all.find((x) => x.org_unit_id === data.id);
    let first = '',
      second = '';
    if (level === 'หน่วยงานย่อย') {
      const parent = all.find(
        (x) => x.first_org_unit_id === data.parent && x.org_level === 'หน่วยงานหลัก',
      );
      if (!parent) throw Error('กรุณาเลือกหน่วยงานหลักที่มีอยู่');
      first = parent.first_org_unit_id;
      second = old
        ? old.second_org_unit_id
        : 'PRT' +
          (
            '000' +
            (Math.max(
              0,
              ...all.map((x) => Number((x.second_org_unit_id || '').replace(/^PRT/, '')) || 0),
            ) +
              1)
          ).slice(-3);
    } else if (old && old.org_level === 'หน่วยงานหลัก') {
      first = old.first_org_unit_id;
    } else {
      first =
        'MST' +
        (
          '000' +
          (Math.max(
            0,
            ...all.map((x) => Number((x.first_org_unit_id || '').replace(/^MST/, '')) || 0),
          ) +
            1)
        ).slice(-3);
    }
    if (old && old.org_level !== level)
      throw Error('เปลี่ยนระดับหน่วยงานเดิมไม่ได้ โปรดสร้างรายการใหม่');
    if (old && old.org_full_name !== name) {
      const inInv = rows_('INVENTORY').some(
        (x) => x['หน่วยงานหลัก'] === old.org_full_name || x['หน่วยงานย่อย'] === old.org_full_name,
      );
      const inInc = rows_('INCIDENT').some(
        (x) => x['หน่วยงานหลัก'] === old.org_full_name || x['หน่วยงานย่อย'] === old.org_full_name,
      );
      if (inInv || inInc)
        throw Error(
          'ชื่อหน่วยงานถูกอ้างอิงอยู่ โปรดแก้ชื่อในข้อมูลที่เกี่ยวข้องผ่านขั้นตอนย้ายข้อมูลก่อน',
        );
    }
    if (
      all.some(
        (x) =>
          x.org_full_name === name && x.first_org_unit_id === first && x.org_unit_id !== data.id,
      )
    )
      throw Error('ชื่อหน่วยงานซ้ำในหน่วยงานหลักเดียวกัน');
    const patch = {
      first_org_unit_id: first,
      second_org_unit_id: second,
      org_full_name: name,
      short_name: short,
      org_level: level,
      location,
      comment: String(data.comment || ''),
    };
    if (old) {
      update_('MST_ORG_UNITS', old.__row, patch);
      writeAudit_(
        actor,
        'EDIT',
        'MASTER_DATA',
        'MST_ORG_UNITS',
        old.org_unit_id,
        'SUCCESS',
        'แก้ไขหน่วยงาน ' + name,
      );
      return old.org_unit_id;
    }
    const id =
      'ORG' +
      (
        '000' +
        (Math.max(0, ...all.map((x) => Number((x.org_unit_id || '').replace(/^ORG/, '')) || 0)) + 1)
      ).slice(-3);
    append_('MST_ORG_UNITS', Object.assign({ org_unit_id: id }, patch));
    writeAudit_(
      actor,
      'CREATE',
      'MASTER_DATA',
      'MST_ORG_UNITS',
      id,
      'SUCCESS',
      'เพิ่มหน่วยงาน ' + name,
    );
    return id;
  });
}

// apps/webapp/src/server/features/master-data/master-data-service.js
function itsdImpl_deleteOrgUnit_(token, id) {
  const actor = requirePermission_(token, 'MASTER_DATA', 'DELETE');
  return lock_(() => {
    const all = rows_('MST_ORG_UNITS'),
      row = all.find((x) => x.org_unit_id === id);
    if (!row) throw Error('ไม่พบหน่วยงาน');
    if (
      row.org_level === 'หน่วยงานหลัก' &&
      all.some(
        (x) => x.org_level === 'หน่วยงานย่อย' && x.first_org_unit_id === row.first_org_unit_id,
      )
    )
      throw Error('มีหน่วยงานย่อยอยู่ จึงลบไม่ได้');
    const name = row.org_full_name;
    const inInventory = rows_('INVENTORY').some(
      (x) => x['หน่วยงานหลัก'] === name || x['หน่วยงานย่อย'] === name,
    );
    const inIncident = rows_('INCIDENT').some(
      (x) => x['หน่วยงานหลัก'] === name || x['หน่วยงานย่อย'] === name,
    );
    if (inInventory || inIncident)
      throw Error('หน่วยงานนี้ถูกอ้างอิงใน INVENTORY หรือ INCIDENT จึงลบไม่ได้');
    sheet_('MST_ORG_UNITS').deleteRow(row.__row);
    resetRows_('MST_ORG_UNITS');
    writeAudit_(
      actor,
      'DELETE',
      'MASTER_DATA',
      'MST_ORG_UNITS',
      id,
      'SUCCESS',
      'ลบหน่วยงาน ' + name,
    );
    return true;
  });
}

// apps/webapp/src/server/maintenance/backup-verification.js
function itsdImpl_itsdBackupBeforeV1064_() {
  const source = book_(); // Existing ITSD database accessor; do not guess spreadsheet IDs.
  if (!source || !source.getId) throw new Error('Database accessor book_() unavailable');
  const required = ['PM_PLANS', 'PM_PLAN_HISTORY'];
  const missing = required.filter((name) => !source.getSheetByName(name));
  if (missing.length) throw new Error('Missing sheets: ' + missing.join(', '));
  const before = required.map((name) => {
    const s = source.getSheetByName(name);
    const values = s.getDataRange().getDisplayValues();
    const header = values[0] || [];
    if (!header.length || (!header.includes('plan_id') && name === 'PM_PLANS')) {
      throw new Error('Invalid PM_PLANS header');
    }
    return {
      name,
      rows: Math.max(0, s.getLastRow() - 1),
      columns: s.getLastColumn(),
      header: header.join('|'),
    };
  });
  const stamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Asia/Bangkok',
    'yyyyMMdd_HHmmss',
  );
  const backupName = 'ITSD_DB_BEFORE_V1.0.64_' + stamp;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sourceFile = DriveApp.getFileById(source.getId());
    const folderIterator = sourceFile.getParents();
    const folder = folderIterator.hasNext() ? folderIterator.next() : DriveApp.getRootFolder();
    const copy = sourceFile.makeCopy(backupName, folder);
    const copiedBook = SpreadsheetApp.openById(copy.getId());
    required.forEach((name) => {
      const s = copiedBook.getSheetByName(name);
      const reference = before.find((x) => x.name === name);
      if (
        !s ||
        Math.max(0, s.getLastRow() - 1) !== reference.rows ||
        s.getLastColumn() !== reference.columns
      ) {
        throw new Error(
          'Backup verification failed for ' +
            name +
            '; backup file kept for inspection: ' +
            copy.getId(),
        );
      }
      const header = (s.getDataRange().getDisplayValues()[0] || []).join('|');
      if (header !== reference.header) throw new Error('Backup headers differ: ' + name);
    });
    const result = {
      status: 'BACKUP_OK',
      name: backupName,
      spreadsheetId: copy.getId(),
      url: copy.getUrl(),
      sheets: before,
    };
    console.log(JSON.stringify(result));
    return result;
  } finally {
    lock.releaseLock();
  }
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_ocpbImportGetBootstrap_(authToken) {
  const user = ocpbImportRequireAuthorized_(authToken);
  const context = ocpbImportBuildContext_('TICKET');

  const result = {
    success: true,
    version: OCPB_IMPORT_VERSION,
    user: {
      userId: user.userId,
      displayName: user.displayName,
      role: user.role,
    },
    maxRows: OCPB_IMPORT_CONFIG.MAX_ROWS,
    deviceTypes: context.deviceTypes,
    problemTypes: context.problemTypes,
    statuses: ['แจ้งเรื่อง', 'รับแจ้ง', 'มอบหมาย', 'กำลังดำเนินการ', 'รอยืนยันผล', 'ปิดงาน'],
    priorities: [
      'ปกติ (Normal)',
      'ต่ำ (Low)',
      'ปานกลาง (Medium)',
      'สูง (High)',
      'วิกฤต (Critical)',
    ],
  };

  console.log('ocpbImportGetBootstrap user=%s role=%s', user.userId, user.role);
  return result;
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_ocpbImportPreview_(payload) {
  const request = ocpbImportNormalizeRequest_(payload);
  const user = ocpbImportRequireAuthorized_(request.authToken);
  const validation = ocpbImportValidate_(request.kind, request.headers, request.rows);

  const digest = ocpbImportPayloadDigest_(request.kind, request.headers, request.rows);
  const previewToken = Utilities.getUuid().replace(/-/g, '');
  CacheService.getScriptCache().put(
    'OCPB_IMPORT_PREVIEW_' + previewToken,
    JSON.stringify({
      digest: digest,
      userId: user.userId,
      kind: request.kind,
    }),
    OCPB_IMPORT_CONFIG.PREVIEW_TTL_SECONDS,
  );

  const result = ocpbImportBuildPublicPreviewResponse_(validation);
  result.previewToken = previewToken;
  result.version = OCPB_IMPORT_VERSION;

  console.log(
    'ocpbImportPreview kind=%s user=%s rows=%s ready=%s skipped=%s errors=%s',
    request.kind,
    user.userId,
    request.rows.length,
    validation.summary.ready,
    validation.summary.skipped,
    validation.summary.errors,
  );

  return result;
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportBuildPublicPreviewResponse_(validation) {
  const source = validation || {};
  const summary = source.summary || {};
  const preview = Array.isArray(source.preview) ? source.preview : [];

  return {
    success: source.success !== false,
    kind: String(source.kind || ''),
    headers: Array.isArray(source.headers) ? source.headers.slice() : [],
    summary: {
      total: Number(summary.total || 0),
      ready: Number(summary.ready || 0),
      skipped: Number(summary.skipped || 0),
      errors: Number(summary.errors || 0),
    },
    preview: preview.map(function (item) {
      return {
        row: Number((item && item.row) || 0),
        status: String((item && item.status) || ''),
        key: String((item && item.key) || ''),
        errors: Array.isArray(item && item.errors) ? item.errors.slice() : [],
        duplicateReasons: Array.isArray(item && item.duplicateReasons)
          ? item.duplicateReasons.slice()
          : [],
      };
    }),
  };
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_ocpbImportCommit_(payload) {
  const request = ocpbImportNormalizeRequest_(payload);
  const user = ocpbImportRequireAuthorized_(request.authToken);
  const previewToken = String((payload && payload.previewToken) || '').trim();

  if (!/^[A-Za-z0-9]{20,80}$/.test(previewToken)) {
    throw new Error('Preview Token ไม่ถูกต้อง กรุณาตรวจสอบไฟล์ใหม่อีกครั้ง');
  }

  const cache = CacheService.getScriptCache();
  const cacheKey = 'OCPB_IMPORT_PREVIEW_' + previewToken;
  const cachedText = cache.get(cacheKey);
  if (!cachedText) {
    throw new Error('Preview หมดอายุ กรุณากดตรวจสอบไฟล์ใหม่ก่อน Import');
  }

  let cached;
  try {
    cached = JSON.parse(cachedText);
  } catch (err) {
    throw new Error('Preview Token เสียหาย กรุณาตรวจสอบไฟล์ใหม่');
  }

  const digest = ocpbImportPayloadDigest_(request.kind, request.headers, request.rows);
  if (cached.digest !== digest || cached.userId !== user.userId || cached.kind !== request.kind) {
    throw new Error('ข้อมูลเปลี่ยนหลัง Preview ระบบยกเลิกการ Import เพื่อความปลอดภัย');
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    throw new Error('มีการ Import อื่นกำลังทำงาน กรุณารอสักครู่แล้วลองใหม่');
  }

  try {
    // Revalidate against live data while the lock is held to prevent race duplicates
    // and to re-check current Master / Data Validation values immediately before write.
    const validation = ocpbImportValidate_(request.kind, request.headers, request.rows);
    const ready = validation._readyRows || [];

    if (!ready.length) {
      cache.remove(cacheKey);
      return {
        success: true,
        version: OCPB_IMPORT_VERSION,
        kind: request.kind,
        total: validation.summary.total,
        imported: 0,
        skipped: validation.summary.skipped,
        errors: validation.summary.errors,
        atomic: true,
        message: 'ไม่มีรายการพร้อม Import',
      };
    }

    const ss = ocpbImportGetSpreadsheet_();
    const sheet = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS[request.kind]);
    if (!sheet) {
      throw new Error('ไม่พบ Sheet เป้าหมาย: ' + OCPB_IMPORT_CONFIG.SHEETS[request.kind]);
    }

    const expectedHeaders = OCPB_IMPORT_CONFIG.HEADERS[request.kind];
    ocpbImportAssertLiveHeader_(sheet, expectedHeaders);

    const startRow = sheet.getLastRow() + 1;
    const width = expectedHeaders.length;
    const endRow = startRow + ready.length - 1;
    const insertedRows = ocpbImportEnsureRowCapacity_(sheet, endRow);
    let target = null;

    try {
      target = sheet.getRange(startRow, 1, ready.length, width);

      // Preserve presentation. Formatting failure is non-destructive and may be skipped.
      if (startRow > 2) {
        const formatSource = sheet.getRange(startRow - 1, 1, 1, width);
        try {
          formatSource.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
        } catch (formatErr) {
          console.log('Import format copy skipped: %s', formatErr.message);
        }
      }

      // Data Validation is a safety control. Copy from a known validation template and
      // fail before writing when validation cannot be prepared.
      const templateRow = ocpbImportValidationTemplateRow_(sheet, width, startRow - 1);
      if (templateRow) {
        const validationSource = sheet.getRange(templateRow, 1, 1, width);
        validationSource.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
        ocpbImportAssertReadyAgainstTargetValidation_(target, ready, expectedHeaders);
      }

      target.setValues(ready);
      SpreadsheetApp.flush();
      ocpbImportVerifyCommittedKeys_(request.kind, target, ready, expectedHeaders);
    } catch (writeErr) {
      const rollback = ocpbImportRollbackWrite_(sheet, target, insertedRows);
      cache.remove(cacheKey);
      if (!rollback.success) {
        console.log('CRITICAL import rollback failed: %s', rollback.error || 'unknown');
        throw new Error(
          'Import ล้มเหลวและไม่สามารถย้อนข้อมูลได้ครบ กรุณาหยุดใช้งาน Import และติดต่อผู้ดูแลระบบทันที',
        );
      }
      console.log(
        'Import write failed and rollback completed: %s',
        (writeErr && writeErr.message) || writeErr,
      );
      throw new Error(
        'Import ล้มเหลว ระบบย้อนข้อมูลที่เขียนบางส่วนแล้ว กรุณากดตรวจสอบไฟล์ใหม่ก่อน Import อีกครั้ง',
      );
    }

    try {
      if (typeof clearAssetCache === 'function') clearAssetCache();
    } catch (cacheErr) {
      console.log('clearAssetCache skipped: %s', cacheErr.message);
    }

    cache.remove(cacheKey);

    const result = {
      success: true,
      version: OCPB_IMPORT_VERSION,
      kind: request.kind,
      total: validation.summary.total,
      imported: ready.length,
      skipped: validation.summary.skipped,
      errors: validation.summary.errors,
      atomic: true,
      rollbackProtected: true,
      message: 'Import สำเร็จ',
    };

    console.log(
      'ocpbImportCommit kind=%s user=%s imported=%s skipped=%s errors=%s atomic=true',
      request.kind,
      user.userId,
      result.imported,
      result.skipped,
      result.errors,
    );

    return result;
  } finally {
    lock.releaseLock();
  }
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportAssertReadyAgainstTargetValidation_(target, ready, headers) {
  const validations = target.getDataValidations();
  if (!validations || !validations.length) return;
  for (let row = 0; row < ready.length; row++) {
    const rules = validations[row] || validations[0] || [];
    for (let col = 0; col < headers.length; col++) {
      const rule = rules[col];
      if (!rule || rule.getAllowInvalid()) continue;
      const allowed = ocpbImportAllowedValuesFromRule_(rule);
      if (!allowed || !allowed.length) continue;
      const value = ready[row][col];
      if (value === '' || value === null || value === undefined) continue;
      if (allowed.indexOf(ocpbImportKey_(value)) < 0) {
        throw new Error('ข้อมูลไม่ผ่าน Data Validation: ' + headers[col] + ' = ' + value);
      }
    }
  }
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_verifyOcpbImportV1018_() {
  const ss = ocpbImportGetSpreadsheet_();
  const ticket = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.TICKET);
  const inventory = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.INVENTORY);
  const lookups = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.LOOKUPS);
  const users = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.USERS);
  const sessions = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.SESSIONS);

  if (!ticket || !inventory || !lookups || !users || !sessions) {
    throw new Error('Database ไม่ครบสำหรับ Import V1.0.18');
  }

  ocpbImportAssertLiveHeader_(ticket, OCPB_IMPORT_CONFIG.HEADERS.TICKET);
  ocpbImportAssertLiveHeader_(inventory, OCPB_IMPORT_CONFIG.HEADERS.INVENTORY);

  const result = {
    success: true,
    version: OCPB_IMPORT_VERSION,
    database: ss.getName(),
    ticketColumns: OCPB_IMPORT_CONFIG.HEADERS.TICKET.length,
    inventoryColumns: OCPB_IMPORT_CONFIG.HEADERS.INVENTORY.length,
    maxRows: OCPB_IMPORT_CONFIG.MAX_ROWS,
    schemaChanged: false,
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_verifyOcpbImportV1016_() {
  return verifyOcpbImportV1018();
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_verifyOcpbImportV1015_() {
  return verifyOcpbImportV1018();
}

// apps/webapp/src/server/features/imports/import-service.js
function itsdImpl_verifyOcpbImportV1013_() {
  return verifyOcpbImportV1018();
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportBuildContext_(kind) {
  const ss = ocpbImportGetSpreadsheet_();
  const target = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS[kind]);
  const lookup = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.LOOKUPS);
  if (!target || !lookup) throw new Error('ไม่พบ Sheet ที่ Import ต้องใช้');

  ocpbImportAssertLiveHeader_(target, OCPB_IMPORT_CONFIG.HEADERS[kind]);
  const expectedHeaders = OCPB_IMPORT_CONFIG.HEADERS[kind];
  const strictValidations = ocpbImportBuildStrictValidationContext_(target, expectedHeaders);
  const orgMaster = ocpbImportBuildOrgMaster_(ss);

  const lookupValues = lookup.getDataRange().getDisplayValues();
  const lookupHeaders = lookupValues.length ? lookupValues[0].map(ocpbImportNormalizeHeader_) : [];

  const typeIndex = lookupHeaders.indexOf('lookup_type');
  const labelIndex = lookupHeaders.indexOf('label');
  const activeIndex = lookupHeaders.indexOf('active');

  const deviceTypes = new Set();
  const problemTypes = new Set();

  if (typeIndex >= 0 && labelIndex >= 0) {
    lookupValues.slice(1).forEach(function (row) {
      const active = activeIndex < 0 || ocpbImportTruthy_(row[activeIndex]);
      if (!active) return;
      const type = String(row[typeIndex] || '')
        .trim()
        .toUpperCase();
      const label = String(row[labelIndex] || '').trim();
      if (!label) return;
      if (type === 'DEVICE') deviceTypes.add(ocpbImportKey_(label));
      if (type === 'PROBLEM') problemTypes.add(ocpbImportKey_(label));
    });
  }

  const data = target.getDataRange().getDisplayValues();
  const headers = data.length ? data[0].map(ocpbImportNormalizeHeader_) : [];
  const existing = {
    ticket: new Set(),
    deviceCode: new Set(),
    serial: new Set(),
    assetNo: new Set(),
    assetId: new Set(),
  };

  if (data.length > 1) {
    const idx = {};
    headers.forEach(function (header, i) {
      idx[header] = i;
    });

    data.slice(1).forEach(function (row) {
      function add(set, header) {
        if (!Object.prototype.hasOwnProperty.call(idx, header)) return;
        const key = ocpbImportKey_(row[idx[header]]);
        if (key) set.add(key);
      }

      if (kind === 'TICKET') {
        add(existing.ticket, 'เลขที่แจ้งปัญหา');

        if (Object.prototype.hasOwnProperty.call(idx, 'ประเภทอุปกรณ์')) {
          const value = ocpbImportKey_(row[idx['ประเภทอุปกรณ์']]);
          if (value) deviceTypes.add(value);
        }
        if (Object.prototype.hasOwnProperty.call(idx, 'ประเภทปัญหาการแจ้งซ่อม')) {
          const value = ocpbImportKey_(row[idx['ประเภทปัญหาการแจ้งซ่อม']]);
          if (value) problemTypes.add(value);
        }
      } else {
        add(existing.deviceCode, 'รหัสอุปกรณ์');
        add(existing.serial, 'หมายเลขซีเรียล');
        add(existing.assetNo, 'เลขครุภัณฑ์');
        add(existing.assetId, 'หมายเลขสินทรัพย์');

        if (Object.prototype.hasOwnProperty.call(idx, 'ประเภทอุปกรณ์')) {
          const value = ocpbImportKey_(row[idx['ประเภทอุปกรณ์']]);
          if (value) deviceTypes.add(value);
        }
      }
    });
  }

  return {
    existing: existing,
    deviceTypes: Array.from(deviceTypes),
    problemTypes: Array.from(problemTypes),
    strictValidations: strictValidations,
    orgMaster: orgMaster,
  };
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportValidationTemplateRow_(sheet, width, lastDataRow) {
  const candidates = [];
  if (lastDataRow && lastDataRow >= 2) candidates.push(lastDataRow);
  if (sheet.getMaxRows() >= 2 && candidates.indexOf(2) < 0) candidates.push(2);
  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    const rules = sheet.getRange(row, 1, 1, width).getDataValidations()[0] || [];
    if (
      rules.some(function (rule) {
        return !!rule;
      })
    )
      return row;
  }
  return candidates.length ? candidates[0] : 0;
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportBuildStrictValidationContext_(sheet, headers) {
  const row = ocpbImportValidationTemplateRow_(sheet, headers.length, sheet.getLastRow());
  if (!row) return [];
  const rules = sheet.getRange(row, 1, 1, headers.length).getDataValidations()[0] || [];
  const result = [];
  rules.forEach(function (rule, index) {
    if (!rule || rule.getAllowInvalid()) return;
    const allowed = ocpbImportAllowedValuesFromRule_(rule);
    if (allowed && allowed.length) result.push({ header: headers[index], allowed: allowed });
  });
  return result;
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportBuildOrgMaster_(ss) {
  const sheet = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.ORG_UNITS);
  const master = { available: false, mainByName: {}, childrenByName: {}, byId: {} };
  if (!sheet) return master;
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return master;
  const headers = values[0].map(ocpbImportNormalizeHeader_);
  const idx = {
    id: headers.indexOf('org_unit_id'),
    first: headers.indexOf('first_org_unit_id'),
    second: headers.indexOf('second_org_unit_id'),
    name: headers.indexOf('org_full_name'),
  };
  if (
    Object.keys(idx).some(function (key) {
      return idx[key] < 0;
    })
  )
    return master;
  values.slice(1).forEach(function (row) {
    const id = String(row[idx.id] || '').trim();
    const first = String(row[idx.first] || '').trim();
    const second = String(row[idx.second] || '').trim();
    const name = String(row[idx.name] || '').trim();
    if (!id || !name) return;
    const unit = { id: id, firstId: first, secondId: second, name: name };
    master.byId[ocpbImportKey_(id)] = unit;
    if (!second) master.mainByName[ocpbImportKey_(name)] = unit;
    else {
      const key = ocpbImportKey_(name);
      if (!master.childrenByName[key]) master.childrenByName[key] = [];
      master.childrenByName[key].push(unit);
    }
  });
  master.available = Object.keys(master.byId).length > 0;
  return master;
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportFindDuplicateReasons_(kind, obj, context, fileKeys, reasons) {
  function check(label, value, liveSet, fileSet) {
    const key = ocpbImportKey_(value);
    if (!key) return;
    if (liveSet.has(key)) reasons.push(label + ' ซ้ำกับข้อมูลเดิม');
    if (fileSet.has(key)) reasons.push(label + ' ซ้ำภายในไฟล์');
  }

  if (kind === 'TICKET') {
    check('เลขที่แจ้งปัญหา', obj['เลขที่แจ้งปัญหา'], context.existing.ticket, fileKeys.ticket);
    return;
  }

  check('รหัสอุปกรณ์', obj['รหัสอุปกรณ์'], context.existing.deviceCode, fileKeys.deviceCode);
  check('หมายเลขซีเรียล', obj['หมายเลขซีเรียล'], context.existing.serial, fileKeys.serial);
  check('เลขครุภัณฑ์', obj['เลขครุภัณฑ์'], context.existing.assetNo, fileKeys.assetNo);
  check('หมายเลขสินทรัพย์', obj['หมายเลขสินทรัพย์'], context.existing.assetId, fileKeys.assetId);
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportNewFileKeyState_(kind) {
  return {
    ticket: new Set(),
    deviceCode: new Set(),
    serial: new Set(),
    assetNo: new Set(),
    assetId: new Set(),
  };
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportRememberFileKeys_(kind, obj, state) {
  function add(set, value) {
    const key = ocpbImportKey_(value);
    if (key) set.add(key);
  }

  if (kind === 'TICKET') {
    add(state.ticket, obj['เลขที่แจ้งปัญหา']);
  } else {
    add(state.deviceCode, obj['รหัสอุปกรณ์']);
    add(state.serial, obj['หมายเลขซีเรียล']);
    add(state.assetNo, obj['เลขครุภัณฑ์']);
    add(state.assetId, obj['หมายเลขสินทรัพย์']);
  }
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportSafeCell_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') return value;
  if (typeof value !== 'string') return value;

  const text = value.replace(/\u0000/g, '').trim();
  if (!text) return '';

  // Prevent spreadsheet formula injection from imported text.
  if (/^[=+@]/.test(text) || /^-[^\d]/.test(text)) {
    return "'" + text;
  }
  return text;
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportDisplayKey_(kind, obj) {
  return kind === 'TICKET'
    ? String(obj['เลขที่แจ้งปัญหา'] || '')
    : String(obj['รหัสอุปกรณ์'] || '');
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportObjectIsBlank_(obj) {
  return Object.keys(obj).every(function (key) {
    return !String(obj[key] == null ? '' : obj[key]).trim();
  });
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportCellText_(value) {
  if (value == null) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm');
  }
  return String(value)
    .replace(/\u0000/g, '')
    .trim();
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportKey_(value) {
  return String(value == null ? '' : value)
    .replace(/\u200B/g, '')
    .trim()
    .toUpperCase();
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportTruthy_(value) {
  if (value === true) return true;
  const key = String(value == null ? '' : value)
    .trim()
    .toUpperCase();
  return key === 'TRUE' || key === '1' || key === 'YES' || key === 'ACTIVE';
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportPayloadDigest_(kind, headers, rows) {
  const material = JSON.stringify({
    kind: kind,
    headers: headers,
    rows: rows,
  });

  return ocpbImportSha256Hex_(material);
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportSha256Hex_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text || ''),
    Utilities.Charset.UTF_8,
  );

  return bytes
    .map(function (value) {
      const unsigned = (value + 256) % 256;
      return ('0' + unsigned.toString(16)).slice(-2);
    })
    .join('');
}

// apps/webapp/src/server/features/imports/import-service.js
function ocpbImportRequireAuthorized_(rawToken) {
  const token = String(rawToken || '').trim();
  if (token.length < 20 || token.length > 2048) {
    throw new Error('ไม่พบ Session ที่ถูกต้อง กรุณา Login ใหม่');
  }

  const ss = ocpbImportGetSpreadsheet_();
  const sessions = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.SESSIONS);
  const users = ss.getSheetByName(OCPB_IMPORT_CONFIG.SHEETS.USERS);
  if (!sessions || !users) throw new Error('ไม่พบตาราง Session/User');

  const tokenHash = ocpbImportSha256Hex_(token);
  const sessionData = sessions.getDataRange().getValues();
  if (sessionData.length < 2) throw new Error('Session ไม่ถูกต้องหรือหมดอายุ');

  const sh = sessionData[0].map(ocpbImportNormalizeHeader_);
  const sIndex = {
    token: sh.indexOf('token_hash'),
    user: sh.indexOf('user_id'),
    expires: sh.indexOf('expires_at'),
    revoked: sh.indexOf('revoked'),
  };

  if (
    Object.keys(sIndex).some(function (key) {
      return sIndex[key] < 0;
    })
  ) {
    throw new Error('APP_SESSIONS Header ไม่ถูกต้อง');
  }

  let sessionRow = null;
  for (let i = sessionData.length - 1; i >= 1; i--) {
    const row = sessionData[i];
    if (
      String(row[sIndex.token] || '')
        .trim()
        .toLowerCase() === tokenHash
    ) {
      sessionRow = row;
      break;
    }
  }

  if (!sessionRow) throw new Error('Session ไม่ถูกต้องหรือหมดอายุ');
  if (ocpbImportTruthy_(sessionRow[sIndex.revoked])) {
    throw new Error('Session ถูกยกเลิก กรุณา Login ใหม่');
  }

  const expires = sessionRow[sIndex.expires];
  const expiresText = String(expires || '').trim();
  const expiresIso =
    expiresText && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(expiresText)
      ? expiresText.replace(' ', 'T') + '+07:00'
      : expiresText;
  const expiresAt = expires instanceof Date ? expires : new Date(expiresIso);
  if (
    !(expiresAt instanceof Date) ||
    isNaN(expiresAt.getTime()) ||
    expiresAt.getTime() <= Date.now()
  ) {
    throw new Error('Session หมดอายุ กรุณา Login ใหม่');
  }

  const userId = String(sessionRow[sIndex.user] || '').trim();
  const userData = users.getDataRange().getValues();
  const uh = userData[0].map(ocpbImportNormalizeHeader_);
  const uIndex = {
    user: uh.indexOf('user_id'),
    display: uh.indexOf('display_name'),
    role: uh.indexOf('role'),
    active: uh.indexOf('active'),
  };

  if (
    Object.keys(uIndex).some(function (key) {
      return uIndex[key] < 0;
    })
  ) {
    throw new Error('APP_USERS Header ไม่ถูกต้อง');
  }

  const userRow = userData.slice(1).find(function (row) {
    return String(row[uIndex.user] || '').trim() === userId;
  });

  if (!userRow || !ocpbImportTruthy_(userRow[uIndex.active])) {
    throw new Error('บัญชีผู้ใช้ไม่พร้อมใช้งาน');
  }

  const role = String(userRow[uIndex.role] || '')
    .trim()
    .toUpperCase();
  if (
    !permission_hasAction_({ role: role }, 'master_data.import') ||
    !hasPermissionForUser_({ role: role }, 'MASTER_DATA', 'VIEW')
  ) {
    throw new Error('ไม่มีสิทธิ์ Import ข้อมูลตาม Action Permission');
  }

  return {
    userId: userId,
    displayName: String(userRow[uIndex.display] || '').trim(),
    role: role,
  };
}

// apps/webapp/src/server/platform/sheets/import-repository.js
function ocpbImportEnsureRowCapacity_(sheet, endRow) {
  const maxRows = sheet.getMaxRows();
  if (endRow <= maxRows) return null;
  const count = endRow - maxRows;
  sheet.insertRowsAfter(maxRows, count);
  return { start: maxRows + 1, count: count };
}

// apps/webapp/src/server/platform/sheets/import-repository.js
function ocpbImportRollbackWrite_(sheet, target, insertedRows) {
  try {
    if (target) target.clearContent();
    SpreadsheetApp.flush();
    if (insertedRows && insertedRows.count > 0) {
      sheet.deleteRows(insertedRows.start, insertedRows.count);
    }
    SpreadsheetApp.flush();
    return { success: true };
  } catch (err) {
    return { success: false, error: String((err && err.message) || err || '') };
  }
}

// apps/webapp/src/server/platform/sheets/import-repository.js
function ocpbImportVerifyCommittedKeys_(kind, target, ready, headers) {
  const keyHeader = kind === 'TICKET' ? 'เลขที่แจ้งปัญหา' : 'รหัสอุปกรณ์';
  const keyIndex = headers.indexOf(keyHeader);
  if (keyIndex < 0) throw new Error('ไม่พบคอลัมน์ Key สำหรับตรวจสอบผล Import');
  const actual = target.getDisplayValues();
  if (actual.length !== ready.length)
    throw new Error('จำนวนแถวหลัง Import ไม่ตรงกับข้อมูลที่เตรียมไว้');
  for (let i = 0; i < ready.length; i++) {
    if (ocpbImportKey_(actual[i][keyIndex]) !== ocpbImportKey_(ready[i][keyIndex])) {
      throw new Error('ตรวจสอบผล Import ไม่ผ่านที่แถว ' + (i + 1));
    }
  }
}

// apps/webapp/src/server/platform/sheets/import-repository.js
function ocpbImportAssertLiveHeader_(sheet, expectedHeaders) {
  const actual = sheet
    .getRange(1, 1, 1, expectedHeaders.length)
    .getDisplayValues()[0]
    .map(ocpbImportNormalizeHeader_);

  const wrong = [];
  expectedHeaders.forEach(function (header, i) {
    if (actual[i] !== header) {
      wrong.push(
        'คอลัมน์ ' + (i + 1) + ': คาดว่า "' + header + '" แต่พบ "' + (actual[i] || '') + '"',
      );
    }
  });

  if (wrong.length) {
    throw new Error(
      'Database Header ไม่ตรงกับ Schema ที่ระบบใช้งาน จึงหยุด Import เพื่อป้องกันข้อมูลเสีย\n' +
        wrong.slice(0, 8).join('\n'),
    );
  }
}

// apps/webapp/src/server/platform/sheets/import-repository.js
function ocpbImportGetSpreadsheet_() {
  try {
    if (typeof getSpreadsheet_ === 'function') {
      const existing = getSpreadsheet_();
      if (existing) return existing;
    }
  } catch (err) {
    console.log('Existing getSpreadsheet_ unavailable: %s', err.message);
  }

  const propertyId = String(
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '',
  ).trim();

  const id =
    propertyId ||
    DB_ID ||
    OCPB_IMPORT_CONFIG.SPREADSHEET_ID_FALLBACK ||
    '1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs';
  if (!id) throw new Error('ไม่พบ SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportNormalizeRequest_(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('ไม่พบข้อมูล Import');
  }

  const kind = String(payload.kind || '')
    .trim()
    .toUpperCase();
  if (!Object.prototype.hasOwnProperty.call(OCPB_IMPORT_CONFIG.HEADERS, kind)) {
    throw new Error('ประเภท Import ไม่ถูกต้อง');
  }

  const headers = Array.isArray(payload.headers)
    ? payload.headers.map(ocpbImportNormalizeHeader_)
    : [];

  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (!headers.length) throw new Error('ไฟล์ไม่มี Header');
  if (!rows.length) throw new Error('ไฟล์ไม่มีข้อมูลสำหรับ Import');
  if (rows.length > OCPB_IMPORT_CONFIG.MAX_ROWS) {
    throw new Error('Import ได้สูงสุด ' + OCPB_IMPORT_CONFIG.MAX_ROWS + ' รายการต่อครั้ง');
  }

  return {
    kind: kind,
    headers: headers,
    rows: rows,
    authToken: String(payload.authToken || '').trim(),
  };
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidate_(kind, inputHeaders, inputRows) {
  const targetHeaders = OCPB_IMPORT_CONFIG.HEADERS[kind];
  const required = OCPB_IMPORT_CONFIG.REQUIRED[kind];
  const headerMap = {};
  const duplicateHeaders = [];

  inputHeaders.forEach(function (header, index) {
    if (!header) return;
    if (Object.prototype.hasOwnProperty.call(headerMap, header)) {
      duplicateHeaders.push(header);
    } else {
      headerMap[header] = index;
    }
  });

  if (duplicateHeaders.length) {
    throw new Error('พบ Header ซ้ำ: ' + duplicateHeaders.join(', '));
  }

  const unknownHeaders = Object.keys(headerMap).filter(function (header) {
    return targetHeaders.indexOf(header) < 0;
  });
  if (unknownHeaders.length) {
    throw new Error('พบ Header ที่ระบบไม่รู้จัก: ' + unknownHeaders.join(', '));
  }

  const missingRequired = required.filter(function (header) {
    return !Object.prototype.hasOwnProperty.call(headerMap, header);
  });
  if (missingRequired.length) {
    throw new Error('ขาด Header บังคับ: ' + missingRequired.join(', '));
  }

  const context = ocpbImportBuildContext_(kind);
  const results = [];
  const readyRows = [];
  const fileKeys = ocpbImportNewFileKeyState_(kind);
  const inputIndexByTargetHeader = Object.create(null);
  Object.keys(headerMap).forEach(function (header) {
    inputIndexByTargetHeader[header] = headerMap[header];
  });

  inputRows.forEach(function (sourceRow, zeroIndex) {
    const rowNumber = zeroIndex + 2;
    const source = Array.isArray(sourceRow) ? sourceRow : [];
    const obj = {};

    Object.keys(headerMap).forEach(function (header) {
      obj[header] = ocpbImportCellText_(source[headerMap[header]]);
    });

    if (ocpbImportObjectIsBlank_(obj)) return;

    const errors = [];
    const duplicateReasons = [];

    required.forEach(function (header) {
      if (!String(obj[header] || '').trim()) {
        errors.push('ฟิลด์บังคับว่าง: ' + header);
      }
    });

    ocpbImportValidateLengths_(obj, errors);
    ocpbImportValidateDates_(kind, obj, errors);
    ocpbImportNormalizeAndValidateEnums_(kind, obj, context, errors);
    ocpbImportValidateContact_(kind, obj, errors);
    ocpbImportValidateMasterData_(kind, obj, context, errors);
    ocpbImportValidateLiveRules_(obj, context, errors);
    ocpbImportFindDuplicateReasons_(kind, obj, context, fileKeys, duplicateReasons);

    const targetRow = targetHeaders.map(function (header) {
      let value = inputIndexByTargetHeader[header] === undefined ? '' : obj[header];

      if (OCPB_IMPORT_CONFIG.DATE_FIELDS[kind].indexOf(header) >= 0 && value) {
        const parsed = ocpbImportParseDate_(value);
        value = parsed || value;
      }

      return ocpbImportSafeCell_(value);
    });

    let status = 'READY';
    if (errors.length) {
      status = 'ERROR';
    } else if (duplicateReasons.length) {
      status = 'SKIP_DUPLICATE';
    } else {
      readyRows.push(targetRow);
      ocpbImportRememberFileKeys_(kind, obj, fileKeys);
    }

    results.push({
      row: rowNumber,
      status: status,
      key: ocpbImportDisplayKey_(kind, obj),
      errors: errors,
      duplicateReasons: duplicateReasons,
      values: targetRow,
    });
  });

  const summary = {
    total: results.length,
    ready: results.filter(function (item) {
      return item.status === 'READY';
    }).length,
    skipped: results.filter(function (item) {
      return item.status === 'SKIP_DUPLICATE';
    }).length,
    errors: results.filter(function (item) {
      return item.status === 'ERROR';
    }).length,
  };

  return {
    success: true,
    kind: kind,
    headers: targetHeaders,
    summary: summary,
    preview: results.slice(0, OCPB_IMPORT_CONFIG.PREVIEW_ROWS),
    _readyRows: readyRows,
  };
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportAllowedValuesFromRule_(rule) {
  if (!rule || rule.getAllowInvalid()) return null;
  const type = String(rule.getCriteriaType() || '');
  const values = rule.getCriteriaValues() || [];
  let allowed = [];
  if (type.indexOf('VALUE_IN_LIST') >= 0) {
    allowed = Array.isArray(values[0]) ? values[0] : [];
  } else if (type.indexOf('VALUE_IN_RANGE') >= 0) {
    const range = values[0];
    if (range && typeof range.getDisplayValues === 'function') {
      range.getDisplayValues().forEach(function (row) {
        row.forEach(function (value) {
          if (String(value || '').trim()) allowed.push(value);
        });
      });
    }
  } else {
    return null;
  }
  return allowed.map(ocpbImportKey_).filter(Boolean);
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidateMasterData_(kind, obj, context, errors) {
  const master = context && context.orgMaster;
  if (!master || !master.available) return;
  const main = String(obj['หน่วยงานหลัก'] || '').trim();
  const sub = String(obj['หน่วยงานย่อย'] || '').trim();
  const orgId = kind === 'TICKET' ? String(obj['OrgUnitID'] || '').trim() : '';
  if (!main && !sub && !orgId) return;
  if (kind === 'TICKET' && ocpbImportKey_(main) === ocpbImportKey_('ทุกหน่วยงาน')) {
    if (sub) errors.push('หน่วยงานย่อยต้องว่างเมื่อหน่วยงานหลักเป็น ทุกหน่วยงาน');
    if (orgId) errors.push('OrgUnitID ต้องว่างเมื่อหน่วยงานหลักเป็น ทุกหน่วยงาน');
    return;
  }
  const mainUnit = main ? master.mainByName[ocpbImportKey_(main)] : null;
  if (main && !mainUnit) errors.push('หน่วยงานหลักไม่ตรง MST_ORG_UNITS: ' + main);
  if (sub) {
    if (!mainUnit) {
      if (!main) errors.push('พบหน่วยงานย่อยแต่ไม่ได้ระบุหน่วยงานหลัก: ' + sub);
    } else {
      const children = master.childrenByName[ocpbImportKey_(sub)] || [];
      if (
        !children.some(function (unit) {
          return unit.firstId === mainUnit.firstId;
        })
      ) {
        errors.push('หน่วยงานย่อยไม่สัมพันธ์กับหน่วยงานหลักใน MST_ORG_UNITS: ' + sub);
      }
    }
  }
  if (orgId) {
    const unit = master.byId[ocpbImportKey_(orgId)];
    if (!unit) errors.push('OrgUnitID ไม่พบใน MST_ORG_UNITS: ' + orgId);
    else if (mainUnit && unit.firstId && mainUnit.firstId && unit.firstId !== mainUnit.firstId) {
      errors.push('OrgUnitID ไม่สัมพันธ์กับหน่วยงานหลัก: ' + orgId);
    } else if (sub && ocpbImportKey_(unit.name) !== ocpbImportKey_(sub)) {
      errors.push('OrgUnitID ไม่ตรงกับหน่วยงานย่อย: ' + orgId);
    }
  }
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidateLiveRules_(obj, context, errors) {
  const rules = (context && context.strictValidations) || [];
  rules.forEach(function (rule) {
    const value = String(obj[rule.header] == null ? '' : obj[rule.header]).trim();
    if (!value) return;
    if (rule.allowed.indexOf(ocpbImportKey_(value)) < 0) {
      errors.push('ค่าไม่ผ่าน Data Validation ของระบบ: ' + rule.header + ' = ' + value);
    }
  });
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportNormalizeAndValidateEnums_(kind, obj, context, errors) {
  const device = String(obj['ประเภทอุปกรณ์'] || '').trim();
  if (device && context.deviceTypes.indexOf(ocpbImportKey_(device)) < 0) {
    errors.push('ประเภทอุปกรณ์ไม่อยู่ในรายการระบบ: ' + device);
  }

  if (kind !== 'TICKET') return;

  const status = String(obj['สถานะการแจ้งซ่อม'] || '').trim();
  if (status) {
    const normalizedStatus = ocpbImportNormalizeStatus_(status);
    if (!normalizedStatus) {
      errors.push('สถานะการแจ้งซ่อมไม่ถูกต้อง: ' + status);
    } else {
      obj['สถานะการแจ้งซ่อม'] = normalizedStatus;
    }
  }

  const priority = String(obj['ระดับความเร่งด่วน'] || '').trim();
  if (priority) {
    const normalizedPriority = ocpbImportNormalizePriority_(priority);
    if (!normalizedPriority) {
      errors.push('ระดับความเร่งด่วนไม่ถูกต้อง: ' + priority);
    } else {
      obj['ระดับความเร่งด่วน'] = normalizedPriority;
    }
  }

  const problem = String(obj['ประเภทปัญหาการแจ้งซ่อม'] || '').trim();
  if (problem) {
    const key = ocpbImportKey_(problem);
    const shortKey = ocpbImportKey_(problem.replace(/\s*\([^)]*\)\s*$/, ''));
    const allowed = context.problemTypes.some(function (item) {
      const normalizedItem = ocpbImportKey_(item);
      const itemShort = ocpbImportKey_(String(item).replace(/\s*\([^)]*\)\s*$/, ''));
      return (
        normalizedItem === key ||
        itemShort === shortKey ||
        normalizedItem.indexOf(shortKey) === 0 ||
        key.indexOf(itemShort) === 0
      );
    });

    if (!allowed) {
      errors.push('ประเภทปัญหาไม่อยู่ในรายการระบบ: ' + problem);
    }
  }
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportNormalizeStatus_(value) {
  const key = ocpbImportKey_(value).replace(/\s+/g, '');
  const map = {
    NEW: 'แจ้งเรื่อง',
    CREATED: 'แจ้งเรื่อง',
    แจ้งใหม่: 'แจ้งเรื่อง',
    งานใหม่: 'แจ้งเรื่อง',
    แจ้งเรื่อง: 'แจ้งเรื่อง',

    รอดำเนินการ: 'รับแจ้ง',
    'งานใหม่/รอดำเนินการ': 'รับแจ้ง',
    OPENED: 'รับแจ้ง',
    OPEN: 'รับแจ้ง',
    ACKNOWLEDGED: 'รับแจ้ง',
    รับเรื่องแล้ว: 'รับแจ้ง',
    รับแจ้ง: 'รับแจ้ง',

    ASSIGNED: 'มอบหมาย',
    มอบหมาย: 'มอบหมาย',

    PENDING: 'กำลังดำเนินการ',
    INPROGRESS: 'กำลังดำเนินการ',
    กำลังดำเนินการ: 'กำลังดำเนินการ',
    งานค้าง: 'กำลังดำเนินการ',
    ส่งซ่อม: 'กำลังดำเนินการ',
    WAITPART: 'กำลังดำเนินการ',
    รออะไหล่: 'กำลังดำเนินการ',
    REOPEN: 'กำลังดำเนินการ',
    เปิดงานอีกครั้ง: 'กำลังดำเนินการ',

    WAITCONFIRM: 'รอยืนยันผล',
    RESOLVED: 'รอยืนยันผล',
    รอยืนยันผล: 'รอยืนยันผล',

    CLOSED: 'ปิดงาน',
    CLOSE: 'ปิดงาน',
    ปิดงาน: 'ปิดงาน',
    เสร็จสิ้น: 'ปิดงาน',
    DONE: 'ปิดงาน',
  };

  return map[key] || '';
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportNormalizePriority_(value) {
  const key = ocpbImportKey_(value).replace(/\s+/g, '');
  const map = {
    NORMAL: 'ปกติ (Normal)',
    ปกติ: 'ปกติ (Normal)',
    'ปกติ(NORMAL)': 'ปกติ (Normal)',

    LOW: 'ต่ำ (Low)',
    ต่ำ: 'ต่ำ (Low)',
    ไม่ด่วน: 'ต่ำ (Low)',
    'ต่ำ(LOW)': 'ต่ำ (Low)',

    MEDIUM: 'ปานกลาง (Medium)',
    ปานกลาง: 'ปานกลาง (Medium)',
    ด่วน: 'ปานกลาง (Medium)',
    'ปานกลาง(MEDIUM)': 'ปานกลาง (Medium)',

    HIGH: 'สูง (High)',
    สูง: 'สูง (High)',
    ด่วนมาก: 'สูง (High)',
    'สูง(HIGH)': 'สูง (High)',

    CRITICAL: 'วิกฤต (Critical)',
    วิกฤต: 'วิกฤต (Critical)',
    'วิกฤต(CRITICAL)': 'วิกฤต (Critical)',

    P1: 'วิกฤต (Critical)',
    'CRITICAL(P1)': 'วิกฤต (Critical)',
    เร่งด่วน: 'วิกฤต (Critical)',
    URGENT: 'วิกฤต (Critical)',

    P2: 'สูง (High)',
    'HIGH(P2)': 'สูง (High)',

    P3: 'ปานกลาง (Medium)',
    'MEDIUM(P3)': 'ปานกลาง (Medium)',

    P4: 'ต่ำ (Low)',
    'LOW(P4)': 'ต่ำ (Low)',
  };

  return map[key] || '';
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidateDates_(kind, obj, errors) {
  OCPB_IMPORT_CONFIG.DATE_FIELDS[kind].forEach(function (header) {
    const value = String(obj[header] || '').trim();
    if (!value) return;
    if (!ocpbImportParseDate_(value)) {
      errors.push('รูปแบบวันที่ไม่ถูกต้อง: ' + header + ' = ' + value);
    }
  });
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportParseDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value;
  }

  const text = String(value || '').trim();
  if (!text) return null;

  let m = text.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (m) {
    let year = Number(m[3]);
    if (year > 2400) year -= 543;
    return ocpbImportBuildDate_(
      year,
      Number(m[2]),
      Number(m[1]),
      Number(m[4] || 0),
      Number(m[5] || 0),
      Number(m[6] || 0),
    );
  }

  m = text.match(
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (m) {
    let year = Number(m[1]);
    if (year > 2400) year -= 543;
    return ocpbImportBuildDate_(
      year,
      Number(m[2]),
      Number(m[3]),
      Number(m[4] || 0),
      Number(m[5] || 0),
      Number(m[6] || 0),
    );
  }

  const fallback = new Date(text);
  return isNaN(fallback.getTime()) ? null : fallback;
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportBuildDate_(year, month, day, hour, minute, second) {
  if (
    year < 1900 ||
    year > 2200 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute, second);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidateLengths_(obj, errors) {
  Object.keys(obj).forEach(function (header) {
    const value = String(obj[header] || '');
    const max = /รายละเอียด|หมายเหตุ/.test(header) ? 5000 : 500;
    if (value.length > max) {
      errors.push(header + ' ยาวเกิน ' + max + ' ตัวอักษร');
    }
  });
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportValidateContact_(kind, obj, errors) {
  if (kind !== 'TICKET') return;
  const email = String(obj['อีเมล'] || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
}

// apps/webapp/src/server/features/imports/import-validation.js
function ocpbImportNormalizeHeader_(value) {
  return String(value == null ? '' : value)
    .replace(/^\uFEFF/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdLineDurableSchema_() {
  return {
    LINE_INBOX: [
      'inbox_id',
      'review_status',
      'review_revision',
      'ticket_creation_status',
      'ticket_id',
      'creation_request_id',
      'last_error_code',
      'updated_at',
    ],
    LINE_INBOX_AUDIT: [
      'audit_id',
      'inbox_id',
      'correlation_id',
      'action',
      'actor_type',
      'actor_user_id',
      'from_status',
      'to_status',
      'result',
      'error_code',
      'event_at',
    ],
  };
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdLineDurableSheet_(name) {
  const sheet = book_().getSheetByName(name);
  if (!sheet) throw Error('LINE_SCHEMA_NOT_INSTALLED:' + name);
  const actual = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const indexes = {};
  actual.forEach((x, i) => {
    if (indexes[x] !== undefined) throw Error('DUPLICATE_COLUMN:' + x);
    indexes[x] = i;
  });
  itsdLineDurableSchema_()[name].forEach((x) => {
    if (indexes[x] === undefined) throw Error('MISSING_COLUMN:' + x);
  });
  return { sheet, header: actual, indexes };
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdLineDurableRow_(d, inboxId) {
  if (!/^[a-zA-Z0-9_-]{4,80}$/.test(String(inboxId))) throw Error('INVALID_INBOX_ID');
  const count = d.sheet.getLastRow() - 1;
  if (count < 1) throw Error('INBOX_NOT_FOUND');
  const col = d.indexes.inbox_id;
  if (col === undefined) throw Error('MISSING_COLUMN:inbox_id');
  const matches = d.sheet
    .getRange(2, col + 1, count, 1)
    .createTextFinder(String(inboxId))
    .matchEntireCell(true)
    .findAll();
  if (matches.length !== 1) throw Error(matches.length ? 'DUPLICATE_INBOX_ID' : 'INBOX_NOT_FOUND');
  const row = matches[0].getRow();
  return { row, values: d.sheet.getRange(row, 1, 1, d.header.length).getValues()[0] };
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdLineDurableUpdate_(d, rec, updates) {
  const newValues = rec.values.slice();
  Object.keys(updates).forEach((k) => {
    if (d.indexes[k] === undefined) throw Error('MISSING_COLUMN:' + k);
    newValues[d.indexes[k]] = updates[k];
  });
  d.sheet.getRange(rec.row, 1, 1, d.header.length).setValues([newValues]);
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdLineDurableAudit_(d, inboxId, actor, action, from, to) {
  const id = Utilities.getUuid();
  const fields = {
    audit_id: id,
    inbox_id: inboxId,
    correlation_id: inboxId,
    action: action,
    actor_type: 'STAFF',
    actor_user_id: String(actor.user_id),
    from_status: from,
    to_status: to,
    result: 'SUCCESS',
    error_code: '',
    event_at: new Date(),
  };
  const row = d.header.map((k) => (fields[k] === undefined ? '' : fields[k]));
  d.sheet.getRange(d.sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdImpl_itsdLineClaimForReview_(token, inboxId, expectedRevision) {
  const actor = itsdLineRequire_(token, 'approve');
  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0)
    throw Error('INVALID_REVISION');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw Error('LOCK_TIMEOUT');
  try {
    const d = itsdLineDurableSheet_('LINE_INBOX');
    const audit = itsdLineDurableSheet_('LINE_INBOX_AUDIT');
    const rec = itsdLineDurableRow_(d, inboxId),
      v = rec.values,
      x = d.indexes;
    const status = String(v[x.ticket_creation_status] || '').trim();
    const review = String(v[x.review_status] || '').trim();
    const revision = Number(v[x.review_revision]);
    if (status === 'CLAIMED' || status === 'RECONCILE_REQUIRED')
      throw Error('RECONCILIATION_REQUIRED');
    if (status === 'CREATED') throw Error('ALREADY_CREATED');
    if (status && status !== 'PENDING') throw Error('INVALID_CREATION_STATUS');
    if (review !== 'APPROVED') throw Error('INBOX_NOT_APPROVED');
    if (revision !== expectedRevision) throw Error('REVISION_CONFLICT');
    const key = 'ITSD-LINE-' + inboxId;
    // Fail closed on any prior key; never create a second claim.
    if (String(v[x.creation_request_id] || '').trim())
      throw Error('EXISTING_CREATION_KEY_RECONCILE');
    itsdLineDurableUpdate_(d, rec, {
      ticket_creation_status: 'CLAIMED',
      creation_request_id: key,
      review_revision: revision + 1,
      updated_at: new Date(),
    });
    // If audit fails after state write, claim remains durable for manual reconciliation.
    itsdLineDurableAudit_(audit, inboxId, actor, 'CREATE_CLAIMED', status || 'PENDING', 'CLAIMED');
    console.log('LINE_DURABLE_CLAIMED inbox=' + inboxId + ' actor=' + String(actor.user_id));
    return {
      inboxId,
      creationKey: key,
      status: 'CLAIMED',
      next: 'MANUAL_RECONCILIATION_REQUIRED',
      ticketCreated: false,
    };
  } finally {
    lock.releaseLock();
  }
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdImpl_itsdLineReconcileInspect_(token, inboxId) {
  itsdLineRequire_(token, 'view');
  const d = itsdLineDurableSheet_('LINE_INBOX');
  const rec = itsdLineDurableRow_(d, inboxId);
  const v = rec.values,
    i = d.indexes;
  return {
    inboxId,
    status: String(v[i.ticket_creation_status] || ''),
    creationKey: String(v[i.creation_request_id] || ''),
    ticketId: String(v[i.ticket_id] || ''),
    revision: Number(v[i.review_revision]),
    manualVerificationRequired: true,
  };
}

// apps/webapp/src/server/compatibility/line/candidate-approval.js
function itsdImpl_itsdLineCreateTicketFromClaim_() {
  throw Error('LIVE_TICKET_BRIDGE_DISABLED_UNTIL_IDEMPOTENCY_AND_RECOVERY_VERIFIED');
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineRequire_(token, action) {
  const user = require_(token, false);
  const role = String(user.role || '').toUpperCase();
  if (!['ADMIN', 'MANAGER'].includes(role)) throw Error('LINE Inbox: role denied');
  const key = 'line.inbox.' + action;
  // IMPORTANT: fail closed until action rows explicitly provisioned and approved.
  if (!permission_hasAction_(user, key)) throw Error('LINE Inbox: permission denied: ' + key);
  return user;
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineSheet_(name) {
  const sheet = book_().getSheetByName(name);
  if (!sheet) throw Error('LINE_SCHEMA_NOT_INSTALLED: ' + name);
  const expected = ITSD_LINE_SCHEMA_[name];
  if (!expected) throw Error('Invalid LINE table');
  const actual = sheet.getRange(1, 1, 1, expected.length).getDisplayValues()[0];
  if (actual.join('|') !== expected.join('|') || sheet.getLastColumn() !== expected.length) {
    throw Error('LINE_SCHEMA_HEADER_MISMATCH: ' + name);
  }
  return sheet;
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineRows_(name) {
  const s = itsdLineSheet_(name);
  const header = ITSD_LINE_SCHEMA_[name];
  const lastRow = s.getLastRow();
  if (lastRow < 2) return [];
  const values = s.getRange(2, 1, lastRow - 1, header.length).getDisplayValues(),
    out = [];
  for (let i = 0; i < values.length; i++) {
    const cells = values[i],
      item = { __row: i + 2 };
    for (let j = 0; j < header.length; j++) item[header[j]] = cells[j];
    out.push(item);
  }
  return out;
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineFindRow_(name, key, value) {
  const s = itsdLineSheet_(name),
    header = ITSD_LINE_SCHEMA_[name],
    col = header.indexOf(key),
    lastRow = s.getLastRow();
  if (col < 0) throw Error('Invalid LINE lookup column');
  if (lastRow < 2) return null;
  const matches = s
    .getRange(2, col + 1, lastRow - 1, 1)
    .createTextFinder(String(value))
    .matchEntireCell(true)
    .findAll();
  if (matches.length > 1) throw Error('DUPLICATE_LINE_ROW');
  if (!matches.length) return null;
  const row = matches[0].getRow(),
    cells = s.getRange(row, 1, 1, header.length).getDisplayValues()[0],
    out = { __row: row };
  for (let i = 0; i < header.length; i++) out[header[i]] = cells[i];
  return out;
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineAppend_(name, data) {
  const s = itsdLineSheet_(name);
  s.getRange(s.getLastRow() + 1, 1, 1, ITSD_LINE_SCHEMA_[name].length).setValues([
    ITSD_LINE_SCHEMA_[name].map((key) => (data[key] === undefined ? '' : data[key])),
  ]);
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineUpdate_(name, row, changes) {
  const s = itsdLineSheet_(name),
    h = ITSD_LINE_SCHEMA_[name];
  const current = s.getRange(row, 1, 1, h.length).getValues()[0];
  s.getRange(row, 1, 1, h.length).setValues([
    h.map((key, i) =>
      Object.prototype.hasOwnProperty.call(changes, key) ? changes[key] : current[i],
    ),
  ]);
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdLineAudit_(inbox, action, actor, fromStatus, toStatus, note, changed) {
  itsdLineAppend_('LINE_INBOX_AUDIT', {
    audit_id: Utilities.getUuid(),
    inbox_id: inbox.inbox_id,
    correlation_id: inbox.inbox_id,
    action,
    actor_type: 'STAFF',
    actor_user_id: actor.user_id,
    from_status: fromStatus,
    to_status: toStatus,
    changed_fields_json: JSON.stringify(changed || {}),
    result: 'SUCCESS',
    note: String(note || '').slice(0, 500),
    event_at: now_(),
  });
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdImpl_itsdLineListInbox_(token, status, limit) {
  itsdLineRequire_(token, 'view');
  const allowed = [
    'PENDING',
    'IN_REVIEW',
    'INCOMPLETE',
    'APPROVED',
    'REJECTED',
    'CREATED',
    'FAILED',
  ];
  if (status && !allowed.includes(status)) throw Error('Invalid status');
  const n = Math.min(100, Math.max(1, Number(limit) || 30));
  return itsdLineRows_('LINE_INBOX')
    .filter((r) => !status || r.review_status === status)
    .slice(-n)
    .reverse()
    .map((r) => ({
      inbox_id: r.inbox_id,
      sender_display: r.sender_display,
      received_at: r.received_at,
      reporter: r.reporter,
      org_text: r.org_text,
      asset_text: r.asset_text,
      issue_text: r.issue_text,
      parse_status: r.parse_status,
      review_status: r.review_status,
      review_revision: r.review_revision,
      ticket_id: r.ticket_id,
    }));
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdImpl_itsdLineReviewInbox_(token, inboxId, expectedRevision, reviewed) {
  const actor = itsdLineRequire_(token, 'review');
  if (!/^[0-9a-fA-F-]{36}$/.test(String(inboxId))) throw Error('Invalid inbox ID');
  if (!reviewed || typeof reviewed !== 'object' || Array.isArray(reviewed))
    throw Error('Invalid data');
  const keys = [
    'reporter',
    'org',
    'suborg',
    'phone',
    'asset_id',
    'device',
    'description',
    'type',
    'priority',
  ];
  if (Object.keys(reviewed).some((k) => !keys.includes(k))) throw Error('Unexpected field');
  return lock_(() => {
    const found = itsdLineFindRow_('LINE_INBOX', 'inbox_id', inboxId);
    if (!found) throw Error('Inbox not found');
    if (!['PENDING', 'IN_REVIEW', 'INCOMPLETE'].includes(found.review_status))
      throw Error('Inbox not editable');
    if (Number(found.review_revision || 0) !== Number(expectedRevision))
      throw Error('REVISION_CONFLICT');
    const next = Number(found.review_revision || 0) + 1;
    const revised = {};
    keys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(reviewed, k)) {
        if (typeof reviewed[k] !== 'string' || reviewed[k].length > 2000)
          throw Error('Invalid field: ' + k);
        revised[k] = reviewed[k].trim();
      }
    });
    itsdLineUpdate_('LINE_INBOX', found.__row, {
      reviewed_json: JSON.stringify(revised),
      review_status: 'IN_REVIEW',
      review_revision: next,
      reviewer_user_id: actor.user_id,
      reviewed_at: now_(),
      updated_at: now_(),
    });
    itsdLineAudit_(
      found,
      'REVIEW',
      actor,
      found.review_status,
      'IN_REVIEW',
      '',
      Object.keys(revised).reduce((o, k) => ((o[k] = 'changed'), o), {}),
    );
    return { inbox_id: inboxId, revision: next, status: 'IN_REVIEW' };
  });
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdImpl_itsdLineRejectInbox_(token, inboxId, expectedRevision, reason) {
  const actor = itsdLineRequire_(token, 'reject');
  reason = String(reason || '').trim();
  if (reason.length < 3 || reason.length > 500) throw Error('Reason required (3-500 chars)');
  return lock_(() => {
    const found = itsdLineFindRow_('LINE_INBOX', 'inbox_id', inboxId);
    if (!found) throw Error('Inbox not found');
    if (!['PENDING', 'IN_REVIEW', 'INCOMPLETE'].includes(found.review_status))
      throw Error('Inbox is final');
    if (Number(found.review_revision || 0) !== Number(expectedRevision))
      throw Error('REVISION_CONFLICT');
    itsdLineUpdate_('LINE_INBOX', found.__row, {
      review_status: 'REJECTED',
      review_revision: Number(found.review_revision || 0) + 1,
      reviewer_user_id: actor.user_id,
      reviewed_at: now_(),
      review_note: reason,
      updated_at: now_(),
    });
    itsdLineAudit_(found, 'REJECT', actor, found.review_status, 'REJECTED', reason, {});
    return { inbox_id: inboxId, status: 'REJECTED' };
  });
}

// apps/webapp/src/server/compatibility/line/candidate-review-service.js
function itsdImpl_itsdLineApproveInbox_(token) {
  itsdLineRequire_(token, 'approve');
  throw Error('CANDIDATE_HOLD: ticket idempotency bridge and reconciliation not validated');
}

// apps/webapp/src/server/compatibility/line/candidate-ingress.js
function itsdLineSecureEqual_(a, b) {
  a = String(a || '');
  b = String(b || '');
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

// apps/webapp/src/server/compatibility/line/candidate-ingress.js
function itsdLineIngressAuth_(payload, mac) {
  if (
    typeof payload !== 'string' ||
    payload.length > ITSD_LINE_INGRESS_MAX_BYTES_ ||
    !payload.length
  )
    throw Error('INVALID_ENVELOPE');
  const secret = PropertiesService.getScriptProperties().getProperty('ITSD_LINE_GATEWAY_HMAC_KEY');
  if (!secret || secret.length < 32) throw Error('INGRESS_NOT_CONFIGURED');
  const bytes = Utilities.computeHmacSha256Signature(payload, secret, Utilities.Charset.UTF_8);
  const expected = Utilities.base64Encode(bytes);
  if (!itsdLineSecureEqual_(expected, mac)) throw Error('INGRESS_AUTH_FAILED');
}

// apps/webapp/src/server/compatibility/line/candidate-ingress.js
function itsdLineIngressNormalize_(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw Error('INVALID_EVENT');
  // Gateway must verify x-line-signature on the original raw body BEFORE constructing this event.
  const allowed = [
    'provider',
    'webhook_event_id',
    'message_id',
    'delivery_context',
    'source_group_hash',
    'sender_id_hash',
    'sender_display',
    'received_at',
    'raw_text',
    'parsed',
  ];
  if (Object.keys(event).some((k) => !allowed.includes(k))) throw Error('UNEXPECTED_EVENT_FIELD');
  if (event.provider !== 'LINE' || event.delivery_context !== 'GROUP')
    throw Error('UNSUPPORTED_SOURCE');
  for (const k of ['webhook_event_id', 'message_id', 'source_group_hash']) {
    if (typeof event[k] !== 'string' || !event[k] || event[k].length > 128)
      throw Error('INVALID_' + k.toUpperCase());
  }
  if (!/^[0-9a-f]{64}$/i.test(event.source_group_hash)) throw Error('INVALID_GROUP_HASH');
  if (typeof event.raw_text !== 'string' || event.raw_text.length > 5000)
    throw Error('INVALID_RAW_TEXT');
  if (!event.parsed || typeof event.parsed !== 'object' || Array.isArray(event.parsed))
    throw Error('INVALID_PARSED');
  const parsedAllowed = ['reporter', 'org', 'asset', 'issue', 'phone'];
  if (Object.keys(event.parsed).some((k) => !parsedAllowed.includes(k)))
    throw Error('UNEXPECTED_PARSED_FIELD');
  const p = {};
  for (const k of parsedAllowed) {
    const value = event.parsed[k] || '';
    if (typeof value !== 'string' || value.length > 2000) throw Error('INVALID_FIELD_' + k);
    p[k] = value.trim();
  }
  if (!/^\d{4}-\d\d-\d\dT/.test(String(event.received_at || '')))
    throw Error('INVALID_RECEIVED_AT');
  return { event, p };
}

// apps/webapp/src/server/compatibility/line/candidate-ingress.js
function itsdImpl_itsdLineAcceptGatewayEnvelope_(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope))
    throw Error('INVALID_ENVELOPE');
  itsdLineIngressAuth_(envelope.payload, envelope.mac);
  const { event, p } = itsdLineIngressNormalize_(JSON.parse(envelope.payload));
  return lock_(() => {
    const groups = itsdLineRows_('LINE_ALLOWED_GROUPS');
    const group = groups.find(
      (g) =>
        g.active === 'TRUE' &&
        g.source_type === 'GROUP' &&
        itsdLineSecureEqual_(g.group_id_hash, event.source_group_hash),
    );
    if (!group) throw Error('SOURCE_GROUP_NOT_ALLOWED');
    const rows = itsdLineRows_('LINE_INBOX');
    const seen = rows.find(
      (x) =>
        x.provider === 'LINE' &&
        (x.webhook_event_id === event.webhook_event_id || x.message_id === event.message_id),
    );
    if (seen) return { result: 'DUPLICATE', inbox_id: seen.inbox_id };
    const inboxId = Utilities.getUuid(),
      stamp = now_();
    const required = ['reporter', 'org', 'issue'].every((k) => !!p[k]);
    const parseStatus = required ? 'VALID' : 'INCOMPLETE';
    itsdLineAppend_('LINE_INBOX', {
      inbox_id: inboxId,
      provider: 'LINE',
      webhook_event_id: event.webhook_event_id,
      message_id: event.message_id,
      delivery_context: 'GROUP',
      source_group_key: group.group_key,
      source_group_hash: event.source_group_hash,
      sender_id_hash: String(event.sender_id_hash || ''),
      sender_display: String(event.sender_display || '').slice(0, 150),
      received_at: event.received_at,
      raw_text: event.raw_text,
      parsed_json: JSON.stringify(p),
      reporter: p.reporter,
      org_text: p.org,
      asset_text: p.asset,
      issue_text: p.issue,
      phone: p.phone,
      parse_status: parseStatus,
      review_status: 'PENDING',
      review_revision: 0,
      ticket_creation_status: 'NOT_CREATED',
      created_at: stamp,
      updated_at: stamp,
    });
    // Audit write may fail after Inbox append. Reconciliation is required before enabling production.
    itsdLineAppend_('LINE_INBOX_AUDIT', {
      audit_id: Utilities.getUuid(),
      inbox_id: inboxId,
      correlation_id: event.webhook_event_id,
      action: 'RECEIVE',
      actor_type: 'GATEWAY',
      actor_user_id: '',
      from_status: '',
      to_status: 'PENDING',
      changed_fields_json: '{}',
      result: 'SUCCESS',
      note: 'Authenticated gateway ingress',
      event_at: stamp,
    });
    return { result: 'QUEUED', inbox_id: inboxId, parse_status: parseStatus };
  });
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacySheet_() {
  const sheet = book_().getSheetByName('LINE_INBOX');
  if (!sheet) throw Error('MISSING_LINE_INBOX');
  const header = sheet.getRange(1, 1, 1, LINE_LEGACY_HEADERS_.length).getDisplayValues()[0];
  if (
    sheet.getLastColumn() !== LINE_LEGACY_HEADERS_.length ||
    header.join('|') !== LINE_LEGACY_HEADERS_.join('|')
  ) {
    throw Error('LINE_LEGACY_SCHEMA_MISMATCH');
  }
  return sheet;
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyRequire_(token, action) {
  const user = require_(token, false);
  const role = String(user.role || '').toUpperCase();
  if (!['ADMIN', 'MANAGER'].includes(role)) throw Error('LINE_INBOX_FORBIDDEN');
  const key = 'line.inbox.' + action;
  if (!permission_hasAction_(user, key)) throw Error('LINE_INBOX_PERMISSION_DENIED:' + key);
  return user;
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyRows_() {
  const sheet = lineLegacySheet_(),
    lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, LINE_LEGACY_HEADERS_.length).getDisplayValues();
  return values.map((cells, index) => {
    const row = { __row: index + 2 };
    LINE_LEGACY_HEADERS_.forEach((key, column) => {
      row[key] = cells[column];
    });
    return row;
  });
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyFind_(inboxId) {
  const sheet = lineLegacySheet_(),
    lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const matches = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .createTextFinder(String(inboxId))
    .matchEntireCell(true)
    .findAll();
  if (matches.length > 1) throw Error('DUPLICATE_LINE_INBOX_ID');
  if (!matches.length) return null;
  const rowNumber = matches[0].getRow();
  const cells = sheet.getRange(rowNumber, 1, 1, LINE_LEGACY_HEADERS_.length).getDisplayValues()[0];
  const row = { __row: rowNumber };
  LINE_LEGACY_HEADERS_.forEach((key, column) => {
    row[key] = cells[column];
  });
  return row;
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyUpdate_(rowNumber, changes) {
  const sheet = lineLegacySheet_();
  const current = sheet.getRange(rowNumber, 1, 1, LINE_LEGACY_HEADERS_.length).getValues()[0];
  LINE_LEGACY_HEADERS_.forEach((key, column) => {
    if (Object.prototype.hasOwnProperty.call(changes, key)) current[column] = changes[key];
  });
  sheet.getRange(rowNumber, 1, 1, LINE_LEGACY_HEADERS_.length).setValues([current]);
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyAudit_(actor, action, inboxId, result, detail) {
  if (typeof permissionAudit_log_ === 'function') {
    permissionAudit_log_(actor, action, 'line.inbox', inboxId, result, detail);
  }
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
const LINE_REVIEW_HEADERS_ = ['inbox_id', 'reporter', 'department', 'suborg', 'asset_id', 'no_asset', 'device', 'phone', 'issue_detail', 'problem_type', 'priority', 'revision', 'updated_at', 'updated_by'];

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyReviewSheet_() {
  let sheet = book_().getSheetByName('LINE_INBOX_REVIEWS');
  if (!sheet) {
    sheet = book_().insertSheet('LINE_INBOX_REVIEWS');
    sheet.getRange(1, 1, 1, LINE_REVIEW_HEADERS_.length).setValues([LINE_REVIEW_HEADERS_]);
    sheet.setFrozenRows(1);
  }
  const header = sheet.getRange(1, 1, 1, LINE_REVIEW_HEADERS_.length).getDisplayValues()[0];
  if (header.join('|') !== LINE_REVIEW_HEADERS_.join('|')) throw Error('LINE_REVIEW_SCHEMA_INVALID');
  return sheet;
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyGetReview_(inboxId) {
  if (!book_().getSheetByName('LINE_INBOX_REVIEWS')) return null;
  lineLegacyReviewSheet_();
  const matches = rows_('LINE_INBOX_REVIEWS').filter(x => x.inbox_id === inboxId);
  if (matches.length > 1) throw Error('LINE_REVIEW_DUPLICATE');
  return matches[0] || null;
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyOriginal_(row) {
  return JSON.stringify([row.reporter, row.department, row.asset_code, row.issue_detail, row.parse_status]);
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyEditable_(row) {
  if (!row) throw Error('LINE_INBOX_NOT_FOUND');
  if (row.ticket_id || row.review_status === 'CREATED') throw Error('LINE_INBOX_ALREADY_CREATED');
  if (row.review_status === 'CREATING') throw Error('LINE_INBOX_RECONCILIATION_REQUIRED');
  if (row.review_status === 'REJECTED') throw Error('LINE_INBOX_REJECTED');
  if (!['PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'FAILED'].includes(row.review_status || 'PENDING_REVIEW')) throw Error('LINE_INBOX_NOT_APPROVABLE');
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyReviewTicket_(review) {
  const noAsset = String(review.no_asset).toUpperCase() === 'TRUE';
  const reporter = String(review.reporter || '').trim(), org = String(review.department || '').trim(), suborg = String(review.suborg || '').trim();
  const description = String(review.issue_detail || '').trim();
  if (!reporter || !org || !description) throw Error('LINE_INBOX_INCOMPLETE');
  const units = rows_('MST_ORG_UNITS');
  const main = units.find(x => x.org_level === 'หน่วยงานหลัก' && x.org_full_name === org);
  if (!main) throw Error('LINE_REVIEW_ORG_REQUIRED');
  if (suborg && !units.some(x => x.org_level === 'หน่วยงานย่อย' && x.first_org_unit_id === main.first_org_unit_id && x.org_full_name === suborg)) throw Error('LINE_REVIEW_SUBORG_INVALID');
  if (noAsset && review.asset_id) throw Error('LINE_REVIEW_ASSET_CONFLICT');
  const asset = !noAsset && find_('INVENTORY', 'รหัสอุปกรณ์', review.asset_id);
  if (!noAsset && !asset) throw Error('LINE_ASSET_NOT_FOUND');
  if (asset && (String(asset['หน่วยงานหลัก'] || '') !== org || String(asset['หน่วยงานย่อย'] || '') !== suborg)) throw Error('LINE_REVIEW_ASSET_ORG_MISMATCH');
  const device = String(review.device || '').trim();
  if (noAsset && (!device || !lookupLabels_('DEVICE', DEVICE_DEFAULTS).includes(device))) throw Error('LINE_REVIEW_DEVICE_REQUIRED');
  if (!lookupLabels_('PROBLEM', TYPES).includes(review.problem_type)) throw Error('LINE_REVIEW_PROBLEM_REQUIRED');
  const priority = normalizePriority_(review.priority);
  if (!priority) throw Error('LINE_REVIEW_PRIORITY_INVALID');
  return { reporter, org, suborg, description, asset_id: noAsset ? '' : String(review.asset_id), device: noAsset ? device : '', phone: String(review.phone || ''), type: review.problem_type, priority };
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function itsdImpl_lineLegacyReviewInbox_(token, input) {
  const actor = lineLegacyRequire_(token, 'review');
  input = plainObject_(input || {}, 'ข้อมูลตรวจสอบ LINE');
  const inboxId = boundedText_(input.inbox_id, 'รหัสรายการ LINE', 80, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inboxId)) throw Error('INVALID_LINE_INBOX_ID');
  if (typeof input.no_asset !== 'boolean') throw Error('LINE_REVIEW_MODE_REQUIRED');
  const revision = Number(input.expected_revision);
  if (input.expected_revision === undefined || !Number.isInteger(revision) || revision < 0) throw Error('LINE_REVIEW_STALE');
  return lock_(() => {
    const row = lineLegacyFind_(inboxId);
    lineLegacyEditable_(row);
    const old = lineLegacyGetReview_(inboxId);
    if (Number(old ? old.revision : 0) !== revision || input.expected_original !== lineLegacyOriginal_(row)) throw Error('LINE_REVIEW_STALE');
    const get = (key, max) => boundedText_(input[key], key, max, true);
    const review = {
      inbox_id: inboxId, reporter: get('reporter', SECURITY_LIMITS.REPORTER), department: get('department', SECURITY_LIMITS.ORG),
      suborg: get('suborg', SECURITY_LIMITS.ORG), asset_id: get('asset_id', SECURITY_LIMITS.ASSET_ID),
      no_asset: input.no_asset ? 'TRUE' : 'FALSE', device: get('device', SECURITY_LIMITS.DEVICE), phone: get('phone', SECURITY_LIMITS.PHONE),
      issue_detail: get('issue_detail', SECURITY_LIMITS.DESCRIPTION - 60), problem_type: get('problem_type', 120), priority: get('priority', 80),
      revision: revision + 1, updated_at: now_(), updated_by: actor.user_id,
    };
    lineLegacyReviewTicket_(review);
    lineLegacyReviewSheet_();
    if (old) update_('LINE_INBOX_REVIEWS', old.__row, review);
    else append_('LINE_INBOX_REVIEWS', review);
    lineLegacyAudit_(actor, 'LINE_INBOX_REVIEWED', inboxId, 'SUCCESS', 'revision=' + review.revision + '; no_asset=' + review.no_asset);
    return { inboxId, revision: review.revision, status: 'REVIEWED' };
  });
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyPublicInbox_(row) {
  const review = lineLegacyGetReview_(row.inbox_id);
  const missing = [];
  const reporter = review ? review.reporter : row.reporter;
  const department = review ? review.department : row.department;
  const issue = review ? review.issue_detail : row.issue_detail;
  if (!reporter) missing.push('ผู้แจ้ง');
  if (!department) missing.push('หน่วยงาน');
  if (!issue) missing.push('รายละเอียดปัญหา');
  if (!review && !row.asset_code) missing.push('เลือกอุปกรณ์ หรือระบุว่าไม่มีเลขครุภัณฑ์');
  if (!review && row.parse_status !== 'VALID' && !missing.length) missing.push('ตรวจสอบและบันทึกข้อมูลอีกครั้ง');
  return {
    id: row.inbox_id, status: row.review_status || 'PENDING_REVIEW', text: row.raw_message,
    parse_status: review ? 'VALID' : row.parse_status, reporter, department, issue_detail: issue,
    asset_code: review ? (review.no_asset === 'TRUE' ? '' : String((find_('INVENTORY', 'รหัสอุปกรณ์', review.asset_id) || {})['เลขครุภัณฑ์'] || review.asset_id)) : row.asset_code,
    ticket_id: row.ticket_id, received_at: row.received_at, event_id: row.event_id,
    review, review_revision: Number(review ? review.revision : 0), original_snapshot: lineLegacyOriginal_(row), missing,
  };
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function itsdImpl_lineLegacyListInbox_(token, status, limit) {
  // Compatibility transport: the established RPC remains callable in existing browser sessions.
  if (status && typeof status === 'object' && !Array.isArray(status)) {
    if (status.action !== 'REVIEW') throw Error('INVALID_LINE_INBOX_OPERATION');
    return itsdImpl_lineLegacyReviewInbox_(token, status.input);
  }
  lineLegacyRequire_(token, 'view');
  status = String(status || 'PENDING_REVIEW').toUpperCase();
  if (status !== 'ALL' && !LINE_LEGACY_STATUSES_.includes(status))
    throw Error('INVALID_LINE_INBOX_STATUS');
  const n = Math.min(100, Math.max(1, Number(limit) || 30));
  const items = lineLegacyRows_()
    .filter((row) => status === 'ALL' || (status === 'PENDING_REVIEW' ? ['PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'FAILED'].includes(row.review_status || 'PENDING_REVIEW') : row.review_status === status))
    .slice(-n)
    .reverse()
    .map(lineLegacyPublicInbox_);
  return { items, status, count: items.length, review_protocol: 2 };
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyInventoryMatch_(assetCode) {
  const value = String(assetCode || '').trim();
  if (!value) throw Error('LINE_ASSET_CODE_REQUIRED');
  const columns = COL.INVENTORY;
  const matches = rows_('INVENTORY').filter(
    (row) => String(row[columns[5]] || '').trim() === value,
  );
  if (!matches.length) throw Error('LINE_ASSET_NOT_FOUND:' + value);
  if (matches.length > 1) throw Error('LINE_ASSET_DUPLICATE:' + value);
  return matches[0];
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function lineLegacyTicketMatches_(marker) {
  const descriptionColumn = COL.INCIDENT[10],
    idColumn = COL.INCIDENT[0];
  return rows_('INCIDENT')
    .filter((row) => String(row[descriptionColumn] || '').includes(marker))
    .map((row) => String(row[idColumn] || '').trim())
    .filter(Boolean);
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function itsdImpl_lineLegacyApproveInbox_(token, inboxId, expectedRevision) {
  const actor = lineLegacyRequire_(token, 'approve');
  inboxId = String(inboxId || '').trim();
  if (!/^[0-9a-fA-F-]{36}$/.test(inboxId)) throw Error('INVALID_LINE_INBOX_ID');

  const claim = lock_(() => {
    const row = lineLegacyFind_(inboxId);
    if (!row) throw Error('LINE_INBOX_NOT_FOUND');
    if (row.ticket_id) return { done: true, inboxId, ticketId: row.ticket_id, status: 'CREATED' };
    if (row.review_status === 'CREATING') throw Error('LINE_INBOX_RECONCILIATION_REQUIRED');
    if (row.review_status === 'REJECTED') throw Error('LINE_INBOX_REJECTED');
    if (
      !['PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'FAILED'].includes(
        row.review_status || 'PENDING_REVIEW',
      )
    ) {
      throw Error('LINE_INBOX_NOT_APPROVABLE');
    }
    const review = lineLegacyGetReview_(inboxId);
    if (expectedRevision !== undefined && Number(expectedRevision) !== Number(review ? review.revision : 0)) throw Error('LINE_REVIEW_STALE');
    if (!review && row.parse_status !== 'VALID') throw Error('LINE_INBOX_INCOMPLETE');
    const inventory = review ? null : lineLegacyInventoryMatch_(row.asset_code);
    const ticketData = review ? lineLegacyReviewTicket_(review) : {
      reporter: String(row.reporter || '').trim(), phone: '',
      asset_id: String(inventory[COL.INVENTORY[0]] || '').trim(), device: '',
      org: String(inventory[COL.INVENTORY[9]] || row.department || '').trim(),
      suborg: String(inventory[COL.INVENTORY[10]] || '').trim(), description: String(row.issue_detail || '').trim(),
    };
    const marker = '[LINE-INBOX:' + inboxId + ']';
    const existing = lineLegacyTicketMatches_(marker);
    if (existing.length > 1) throw Error('LINE_INBOX_TICKET_DUPLICATE');
    lineLegacyUpdate_(row.__row, {
      review_status: existing.length ? 'CREATED' : 'CREATING',
      ticket_id: existing[0] || '',
    });
    lineLegacyAudit_(
      actor,
      existing.length ? 'LINE_TICKET_RECOVERED' : 'LINE_APPROVAL_STARTED',
      inboxId,
      'SUCCESS',
      existing[0] || '',
    );
    return {
      done: Boolean(existing.length),
      inboxId,
      ticketId: existing[0] || '',
      row,
      ticketData,
      marker,
    };
  });
  if (claim.done)
    return {
      inboxId: claim.inboxId,
      ticketId: claim.ticketId,
      status: claim.status || 'CREATED',
      recovered: true,
    };

  let ticketId = '';
  try {
    ticketId = createTicket(token, {
      ...claim.ticketData,
      // Keep LINE source linkage in LINE_INBOX.ticket_id/audit records; do not mix
      // the internal source marker into the user-facing ticket description.
      description: claim.ticketData.description,
      channel: 'LINE',
    });
  } catch (error) {
    const recovered = lineLegacyTicketMatches_(claim.marker);
    if (recovered.length === 1) {
      ticketId = recovered[0];
    } else {
      lock_(() => lineLegacyUpdate_(claim.row.__row, { review_status: 'FAILED' }));
      lineLegacyAudit_(
        actor,
        'LINE_APPROVAL_FAILED',
        inboxId,
        'FAILED',
        String((error && error.message) || error).slice(0, 500),
      );
      throw error;
    }
  }
  lock_(() =>
    lineLegacyUpdate_(claim.row.__row, { review_status: 'CREATED', ticket_id: ticketId }),
  );
  lineLegacyAudit_(actor, 'LINE_TICKET_CREATED', inboxId, 'SUCCESS', ticketId);
  return { inboxId, ticketId, status: 'CREATED', recovered: false };
}

// apps/webapp/src/server/features/line-inbox/inbox-review-service.js
function itsdImpl_lineLegacyRejectInbox_(token, inboxId, reason, expectedRevision) {
  const actor = lineLegacyRequire_(token, 'reject');
  reason = String(reason || '').trim();
  if (reason.length < 3 || reason.length > 500) throw Error('LINE_REJECTION_REASON_REQUIRED');
  inboxId = String(inboxId || '').trim();
  return lock_(() => {
    const row = lineLegacyFind_(inboxId);
    lineLegacyEditable_(row);
    const review = lineLegacyGetReview_(inboxId);
    if (expectedRevision !== undefined && Number(expectedRevision) !== Number(review ? review.revision : 0)) throw Error('LINE_REVIEW_STALE');
    lineLegacyUpdate_(row.__row, { review_status: 'REJECTED' });
    lineLegacyAudit_(actor, 'LINE_INBOX_REJECTED', inboxId, 'SUCCESS', reason);
    return { inboxId, status: 'REJECTED' };
  });
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingConfig_() {
  const p = PropertiesService.getScriptProperties();
  return {
    enabled: String(p.getProperty('LINE_MESSAGING_ENABLED') || '').toLowerCase() === 'true',
    disabled: String(p.getProperty('LINE_MESSAGING_ENABLED') || '').toLowerCase() === 'false',
    key: p.getProperty('ITSD_LINE_GATEWAY_HMAC_KEY') || '',
    legacyKey: p.getProperty('ITSD_BRIDGE_KEY') || '',
    databaseMatches:
      !(p.getProperty('LINE_INBOX_SHEET_ID') || '') ||
      p.getProperty('LINE_INBOX_SHEET_ID') === DB_ID,
    groups: String(p.getProperty('ALLOWED_GROUP_IDS') || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  };
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingEqual_(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingObject_(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingAuthenticate_(data, config) {
  // A malformed signed request must never fall back to the legacy authentication path.
  const signed = ['protocol', 'payload', 'mac'].some((key) =>
    Object.prototype.hasOwnProperty.call(data, key),
  );
  if (signed) {
    if (!config.enabled) throw Error('LINE_RECEIVER_DISABLED');
    if (config.key.length < 32) throw Error('LINE_GATEWAY_NOT_CONFIGURED');
    if (
      data.protocol !== LINE_MESSAGING_PROTOCOL_ ||
      typeof data.payload !== 'string' ||
      !data.payload.length ||
      data.payload.length > 48000 ||
      typeof data.mac !== 'string' ||
      !/^[A-Za-z0-9+/]{43}=$/.test(data.mac)
    )
      throw Error('INVALID_ENVELOPE');
    const mac = Utilities.base64Encode(
      Utilities.computeHmacSha256Signature(data.payload, config.key, Utilities.Charset.UTF_8),
    );
    if (!lineMessagingEqual_(mac, data.mac)) throw Error('UNAUTHORIZED');
    const payload = JSON.parse(data.payload);
    if (
      !lineMessagingObject_(payload) ||
      payload.version !== 1 ||
      payload.audience !== DB_ID ||
      !Number.isSafeInteger(payload.issuedAt) ||
      Math.abs(Date.now() - payload.issuedAt) > LINE_MESSAGING_CLOCK_WINDOW_ ||
      !lineMessagingObject_(payload.event)
    )
      throw Error('INVALID_ENVELOPE');
    return { event: payload.event, signed: true };
  }
  // Preserve the previously configured bridge; removing ITSD_BRIDGE_KEY disables it.
  if (config.disabled) throw Error('LINE_RECEIVER_DISABLED');
  if (!config.legacyKey) throw Error('LINE_GATEWAY_NOT_CONFIGURED');
  if (!lineMessagingEqual_(data.bridgeKey, config.legacyKey)) throw Error('UNAUTHORIZED');
  return { event: data, signed: false };
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingNormalize_(event, signed) {
  function text(key, max, required) {
    const value = event[key] === undefined && !required ? '' : event[key];
    if (
      typeof value !== 'string' ||
      value.length > max ||
      (required && !value) ||
      value.indexOf('\0') >= 0
    )
      throw Error('INVALID_EVENT');
    return value;
  }
  const normalized = {
    eventId: text('eventId', 200, true),
    groupId: text('groupId', 128, true),
    messageId: text('messageId', 128, signed),
    senderId: text('senderId', 128, false),
    text: text('text', 10000, true),
    timestamp: event.timestamp === undefined && !signed ? Date.now() : event.timestamp,
  };
  if (
    !/^[A-Za-z0-9_-]+$/.test(normalized.eventId) ||
    (normalized.messageId && !/^[A-Za-z0-9_-]+$/.test(normalized.messageId)) ||
    Array.from(normalized.text).length > 5000 ||
    !Number.isSafeInteger(normalized.timestamp) ||
    normalized.timestamp <= 0 ||
    normalized.timestamp > Date.now() + LINE_MESSAGING_CLOCK_WINDOW_
  )
    throw Error('INVALID_EVENT');
  if (
    signed &&
    (!/^C[0-9a-f]{32}$/i.test(normalized.groupId) ||
      (normalized.senderId && !/^U[0-9a-f]{32}$/i.test(normalized.senderId)))
  )
    throw Error('INVALID_EVENT');
  return normalized;
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingParse_(message) {
  if (typeof message !== 'string') return null;
  const lines = message.replace(/\r\n?/g, '\n').trim().split('\n');
  const command = /^(?:แจ้งเรื่อง|แจ้งซ่อม)\s*[:：]?\s*$/.test(lines[0]);
  const aliases = {
    ผู้แจ้ง: 'reporter',
    ชื่อผู้แจ้ง: 'reporter',
    ชื่อผู้แจ้งปัญหา: 'reporter',
    หน่วยงาน: 'department',
    เลขครุภัณฑ์: 'asset_code',
    เลขครุภัณท์: 'asset_code',
    'ปัญหา/อาการเสีย': 'issue_detail',
    ปัญหา: 'issue_detail',
    ปัญหาการใช้งาน: 'issue_detail',
    อาการเสีย: 'issue_detail',
  };
  const fields = { reporter: '', department: '', asset_code: '', issue_detail: '' };
  const found = {};
  let current = '';
  for (const line of lines.slice(command ? 1 : 0)) {
    const match = line.trim().match(/^([^:：]+)[:：]\s*(.*)$/);
    const key = match && aliases[match[1].replace(/\s/g, '')];
    if (key && Object.prototype.hasOwnProperty.call(fields, key)) {
      fields[key] = match[2].trim();
      found[key] = true;
      current = key;
    } else if (current === 'issue_detail' && line.trim()) {
      fields.issue_detail += (fields.issue_detail ? '\n' : '') + line.trim();
    }
  }
  // Ordinary group conversation is not collected. Label-only reports must identify all three labels.
  if (!command && !(found.reporter && found.department && found.issue_detail)) return null;
  return { ...fields, parse_status: Object.values(fields).every(Boolean) ? 'VALID' : 'INCOMPLETE' };
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingSave_(event, parsed) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = lineLegacySheet_();
    const last = sheet.getLastRow();
    if (last > 1) {
      for (const pair of [
        [2, event.eventId],
        [13, event.messageId],
      ]) {
        if (!pair[1]) continue;
        const existing = sheet
          .getRange(2, pair[0], last - 1, 1)
          .createTextFinder(pair[1])
          .matchEntireCell(true)
          .useRegularExpression(false)
          .findNext();
        if (existing) return { ok: true, duplicate: true };
      }
    }
    const inboxId = Utilities.getUuid();
    sheet.appendRow([
      inboxId,
      safeCell_(event.eventId),
      new Date(event.timestamp),
      safeCell_(event.groupId),
      safeCell_(parsed.reporter),
      safeCell_(parsed.department),
      safeCell_(parsed.asset_code),
      safeCell_(parsed.issue_detail),
      safeCell_(event.text),
      parsed.parse_status,
      'PENDING_REVIEW',
      '',
      safeCell_(event.messageId),
      safeCell_(event.senderId),
    ]);
    SpreadsheetApp.flush();
    return { ok: true, saved: true, inboxId, parse_status: parsed.parse_status };
  } finally {
    lock.releaseLock();
  }
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingReceive_(e) {
  try {
    const contents = e && e.postData && e.postData.contents;
    if (typeof contents !== 'string' || !contents.length) throw Error('EMPTY_BODY');
    if (
      contents.length > LINE_MESSAGING_MAX_BODY_ ||
      Number(e.contentLength || e.postData.length || 0) > LINE_MESSAGING_MAX_BODY_
    )
      throw Error('BODY_TOO_LARGE');
    const data = JSON.parse(contents);
    if (!lineMessagingObject_(data)) throw Error('INVALID_ENVELOPE');
    const config = lineMessagingConfig_();
    const authenticated = lineMessagingAuthenticate_(data, config);
    if (!config.databaseMatches) throw Error('LINE_DATABASE_MISMATCH');
    const event = lineMessagingNormalize_(authenticated.event, authenticated.signed);
    if (!config.groups.includes(event.groupId)) throw Error('SOURCE_GROUP_NOT_ALLOWED');
    const parsed = lineMessagingParse_(event.text);
    if (!parsed) return { ok: true, ignored: true };
    return lineMessagingSave_(event, parsed);
  } catch (error) {
    const known = [
      'EMPTY_BODY',
      'BODY_TOO_LARGE',
      'INVALID_ENVELOPE',
      'UNAUTHORIZED',
      'LINE_RECEIVER_DISABLED',
      'LINE_GATEWAY_NOT_CONFIGURED',
      'LINE_DATABASE_MISMATCH',
      'INVALID_EVENT',
      'SOURCE_GROUP_NOT_ALLOWED',
      'MISSING_LINE_INBOX',
      'LINE_LEGACY_SCHEMA_MISMATCH',
    ];
    const code = known.includes(error.message) ? error.message : 'PROCESSING_FAILED';
    // Never log request bodies, personal data, secrets, or arbitrary exception messages.
    console.error('ITSD_LINE_RECEIVER_ERROR ' + code);
    return { ok: false, error: code };
  }
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function itsdImpl_lineMessagingStatus_(token) {
  const user = require_(token, false);
  if (String(user.role || '').toUpperCase() !== 'ADMIN') throw Error('LINE_SETTINGS_FORBIDDEN');
  return lineMessagingSetupCheck_();
}

// apps/webapp/src/server/features/line-inbox/message-receiver.js
function lineMessagingSetupCheck_() {
  const config = lineMessagingConfig_();
  let schemaReady = false;
  try {
    lineLegacySheet_();
    schemaReady = true;
  } catch (_) {
    /* Report a boolean, never sheet content. */
  }
  const result = {
    enabled: config.enabled,
    signingKeyConfigured: config.key.length >= 32,
    allowedGroupCount: config.groups.filter((x) => /^C[0-9a-f]{32}$/i.test(x)).length,
    databaseMatches: config.databaseMatches,
    schemaReady,
    legacyBridgeConfigured: Boolean(config.legacyKey),
  };
  result.ready =
    result.enabled &&
    result.signingKeyConfigured &&
    result.allowedGroupCount > 0 &&
    result.databaseMatches &&
    result.schemaReady;
  console.log(JSON.stringify(result));
  return result;
}

// apps/webapp/src/server/compatibility/line/approval-hold.js
function itsdImpl_itsdLineTicketBridgeDesignHold_(token, inboxId) {
  itsdLineRequire_(token, 'approve');
  throw Error(
    'APPROVAL_HOLD: createTicket is non-idempotent; implement atomic ticket correlation and recovery first. Inbox=' +
      String(inboxId).slice(0, 36),
  );
}

// apps/webapp/src/server/compatibility/line/ticket-reconciliation.js
function itsdLineTicketEvidence_(ticketId) {
  const id = String(ticketId || '').trim();
  if (!/^INC-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(id)) throw Error('INVALID_TICKET_ID');
  // Existing schema: INCIDENT ticket ID is Thai header, metadata and events use ticket_id.
  const tickets = rows_('INCIDENT').filter((r) => String(r['เลขที่แจ้งปัญหา']) === id);
  const meta = rows_('INCIDENT_META').filter((r) => String(r.ticket_id) === id);
  const events = rows_('INCIDENT_EVENTS').filter((r) => String(r.ticket_id) === id);
  return {
    ticketId: id,
    incidentCount: tickets.length,
    metaCount: meta.length,
    eventCount: events.length,
    complete: tickets.length === 1 && meta.length === 1 && events.length >= 1,
    ambiguous: tickets.length > 1 || meta.length > 1,
  };
}

// apps/webapp/src/server/compatibility/line/ticket-reconciliation.js
function itsdImpl_itsdLineBridgeInspect_(token, inboxId) {
  itsdLineRequire_(token, 'view');
  const d = itsdLineDurableSheet_('LINE_INBOX'),
    rec = itsdLineDurableRow_(d, inboxId),
    x = d.indexes,
    v = rec.values;
  const ticketId = String(v[x.ticket_id] || '').trim();
  const state = String(v[x.ticket_creation_status] || '').trim();
  const key = String(v[x.creation_request_id] || '').trim();
  const evidence = ticketId ? itsdLineTicketEvidence_(ticketId) : null;
  return {
    inboxId,
    state,
    ticketId,
    creationKeyPresent: !!key,
    evidence,
    action: !key
      ? 'STOP_NO_DURABLE_CLAIM'
      : !ticketId
        ? 'STOP_MANUAL_TICKET_LOOKUP'
        : evidence.complete && !evidence.ambiguous
          ? 'ELIGIBLE_FOR_MANUAL_LINK'
          : 'STOP_PARTIAL_OR_AMBIGUOUS',
  };
}

// apps/webapp/src/server/compatibility/line/ticket-reconciliation.js
function itsdImpl_itsdLineBridgeConfirmExisting_(token, inboxId, expectedRevision, ticketId, confirmation) {
  const actor = itsdLineRequire_(token, 'approve');
  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0)
    throw Error('INVALID_REVISION');
  if (confirmation !== 'CONFIRM VERIFIED LINE SOURCE')
    throw Error('EXPLICIT_VERIFICATION_REQUIRED');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw Error('LOCK_TIMEOUT');
  try {
    const d = itsdLineDurableSheet_('LINE_INBOX'),
      audit = itsdLineDurableSheet_('LINE_INBOX_AUDIT');
    const rec = itsdLineDurableRow_(d, inboxId),
      v = rec.values,
      x = d.indexes;
    const state = String(v[x.ticket_creation_status] || '').trim();
    const previousTicket = String(v[x.ticket_id] || '').trim();
    const key = String(v[x.creation_request_id] || '').trim();
    if (Number(v[x.review_revision]) !== expectedRevision) throw Error('REVISION_CONFLICT');
    if (String(v[x.review_status]) !== 'APPROVED') throw Error('INBOX_NOT_APPROVED');
    if (key !== 'ITSD-LINE-' + inboxId) throw Error('INVALID_DURABLE_KEY');
    if (state === 'CREATED') throw Error('ALREADY_LINKED');
    if (!['CLAIMED', 'RECONCILE_REQUIRED'].includes(state)) throw Error('INVALID_CREATION_STATUS');
    if (previousTicket && previousTicket !== ticketId) throw Error('TICKET_CONFLICT');
    const evidence = itsdLineTicketEvidence_(ticketId);
    if (!evidence.complete || evidence.ambiguous) throw Error('PARTIAL_OR_AMBIGUOUS_TICKET');
    const other = rows_('LINE_INBOX').filter(
      (r) => String(r.inbox_id) !== inboxId && String(r.ticket_id) === ticketId,
    );
    if (other.length) throw Error('TICKET_ALREADY_LINKED_TO_ANOTHER_INBOX');
    itsdLineDurableUpdate_(d, rec, {
      ticket_id: ticketId,
      ticket_creation_status: 'CREATED',
      ticket_created_at: new Date(),
      review_revision: expectedRevision + 1,
      updated_at: new Date(),
    });
    // Audit is a separate sheet write; if it fails, state must be reconciled manually.
    itsdLineDurableAudit_(audit, inboxId, actor, 'MANUAL_EXISTING_TICKET_LINK', state, 'CREATED');
    console.log('LINE_MANUAL_LINK_CONFIRMED inbox=' + inboxId + ' ticket=' + ticketId);
    return { inboxId, ticketId, status: 'CREATED', createdNow: false, manualVerified: true };
  } finally {
    lock.releaseLock();
  }
}

// apps/webapp/src/server/compatibility/line/ticket-reconciliation.js
function itsdImpl_itsdLineBridgeCreateNewTicket_() {
  throw Error('LIVE_TICKET_CREATION_DISABLED');
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpSheet_(name, headers, optional) {
  const sheet = book_().getSheetByName(name);
  if (!sheet) {
    if (optional) return null;
    throw Error('กรุณาเปิดใช้งาน Planning ก่อน');
  }
  if (
    JSON.stringify(sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0]) !==
    JSON.stringify(headers)
  )
    throw Error('หัวคอลัมน์ Planning ไม่ถูกต้อง: ' + name);
  return sheet;
}

// apps/webapp/src/server/features/pm/planning-service.js
function itsdImpl_pmSetupPlanning_(token) {
  const actor = pmGuard_(token, false);
  if (roleKey_(actor) !== 'ADMIN') throw Error('เฉพาะ ADMIN สามารถเปิดใช้งาน Planning');
  return lock_(() => {
    pmSheet_(PM_PLAN_TAB_, PM_HEADERS_);
    pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_);
    const book = book_(),
      specs = [
        [PMP_GROUP_TAB_, PMP_GROUP_HEADERS_],
        [PMP_META_TAB_, PMP_META_HEADERS_],
      ];
    specs.forEach(([name, headers]) => pmpSheet_(name, headers, true));
    specs.forEach(([name, headers]) => {
      if (book.getSheetByName(name)) return;
      const sheet = book.insertSheet(name);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet
        .getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#173b63')
        .setFontColor('white');
    });
    return { ok: true };
  });
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpIndex_(items, key) {
  const map = Object.create(null);
  items.forEach((item) => {
    const id = String(item[key]);
    if (map[id]) throw Error('พบรหัสซ้ำในข้อมูล PM: ' + id);
    map[id] = item;
  });
  return map;
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpRead_() {
  const planSheet = pmSheet_(PM_PLAN_TAB_, PM_HEADERS_),
    groupSheet = pmpSheet_(PMP_GROUP_TAB_, PMP_GROUP_HEADERS_, true),
    metaSheet = pmpSheet_(PMP_META_TAB_, PMP_META_HEADERS_, true);
  const plans = pmList_(planSheet, PM_HEADERS_),
    groups = groupSheet ? pmList_(groupSheet, PMP_GROUP_HEADERS_) : [],
    meta = metaSheet ? pmList_(metaSheet, PMP_META_HEADERS_) : [];
  const orgs = pmOrgs_(),
    owners = rows_('APP_USERS')
      .filter((u) => u.user_id)
      .map((u) => ({
        id: String(u.user_id),
        name: String(u.display_name || u.username),
        active: String(u.active).toUpperCase() === 'TRUE',
      }));
  return {
    planSheet,
    groupSheet,
    metaSheet,
    ready: !!groupSheet && !!metaSheet,
    plans,
    groups,
    meta,
    orgs,
    owners,
    planMap: pmpIndex_(plans, 'plan_id'),
    groupMap: pmpIndex_(groups, 'planning_id'),
    metaMap: pmpIndex_(meta, 'plan_id'),
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpEnd_(plan, meta) {
  return meta && meta.end_date ? pmDate_(meta.end_date) : plan.plan_date;
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpDays_(from, to) {
  return Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpShift_(date, days) {
  return new Date(Date.parse(date + 'T00:00:00Z') + days * 86400000).toISOString().slice(0, 10);
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpPublic_(plan, data) {
  const meta = data.metaMap[plan.plan_id] || {},
    group = data.groupMap[meta.planning_id];
  const item = Object.fromEntries(PM_HEADERS_.map((key) => [key, plan[key] || '']));
  const owner = data.owners.find((u) => u.id === meta.owner_id);
  return {
    ...item,
    revision: Number(plan.revision),
    end_date: pmpEnd_(plan, meta),
    planning_id: group ? group.planning_id : '',
    planning_name: group ? group.name : '',
    owner_id: meta.owner_id || '',
    owner_name: owner ? owner.name : '',
    priority: meta.priority || 'ปกติ',
    progress:
      plan.status === 'ดำเนินการแล้ว'
        ? 100
        : plan.status === 'กำลังดำเนินการ'
          ? Number(meta.progress) || 0
          : 0,
    sort_order: Number(meta.sort_order) || 0,
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpQuery_(query) {
  const q = query && typeof query === 'object' ? query : {},
    today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  const from = pmDate_(q.from || today.slice(0, 7) + '-01'),
    to = pmDate_(
      q.to || pmpShift_(pmpShift_(from.slice(0, 7) + '-01', 32).slice(0, 7) + '-01', -1),
    );
  if (to < from || pmpDays_(from, to) > 365)
    throw Error('เลือกช่วงวันที่ไม่เกิน 366 วัน และวันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม');
  const status = pmText_(q.status, 50);
  if (status && !PM_STATES_.includes(status)) throw Error('สถานะไม่ถูกต้อง');
  return {
    from,
    to,
    planning_id: pmText_(q.planning_id, 120),
    org_unit_id: pmText_(q.org_unit_id, 100),
    owner_id: pmText_(q.owner_id, 120),
    status,
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpResult_(data, query, actor) {
  const items = data.plans
    .filter((p) => p.status !== PM_SOFT_DELETED_)
    .map((p) => pmpPublic_(p, data))
    .filter(
      (p) =>
        p.plan_date <= query.to &&
        p.end_date >= query.from &&
        (!query.planning_id || p.planning_id === query.planning_id) &&
        (!query.org_unit_id || p.org_unit_id === query.org_unit_id) &&
        (!query.owner_id || p.owner_id === query.owner_id) &&
        (!query.status || p.status === query.status),
    )
    .sort(
      (a, b) =>
        a.plan_date.localeCompare(b.plan_date) ||
        a.sort_order - b.sort_order ||
        a.plan_id.localeCompare(b.plan_id),
    );
  const today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'),
    active = items.filter((p) => p.status !== 'ยกเลิก'),
    completed = active.filter((p) => p.status === 'ดำเนินการแล้ว').length;
  if (items.length > 2000)
    throw Error('ผลลัพธ์เกิน 2,000 งาน กรุณาจำกัดช่วงวันหรือหน่วยงานก่อนประมวลผล');
  const groups = data.groups.map((g) =>
    Object.fromEntries(PMP_GROUP_HEADERS_.map((k) => [k, k === 'revision' ? Number(g[k]) : g[k]])),
  );
  const summary = {
    total: items.length,
    eligible: active.length,
    completed,
    in_progress: active.filter((p) => p.status === 'กำลังดำเนินการ').length,
    pending: active.filter((p) => p.status === 'รอดำเนินการ').length,
    overdue: active.filter((p) => p.end_date < today && p.status !== 'ดำเนินการแล้ว').length,
    cancelled: items.length - active.length,
    completion: active.length ? Math.round((completed / active.length) * 100) : 0,
  };
  const canManage = ['ADMIN', 'MANAGER'].includes(roleKey_(actor));
  return {
    ready: data.ready,
    items,
    groups,
    orgs: data.orgs,
    owners: data.owners,
    query,
    summary,
    today,
    can_manage: canManage,
    can_export: canManage,
    can_setup: roleKey_(actor) === 'ADMIN',
    signature: digest_(JSON.stringify([query, items, groups])),
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function itsdImpl_pmGetPlanning_(token, query) {
  const actor = pmGuard_(token, false);
  return pmpResult_(pmpRead_(), pmpQuery_(query), actor);
}

// apps/webapp/src/server/features/pm/planning-service.js
function itsdImpl_pmGetPlanningDetail_(token, id) {
  pmGuard_(token, true);
  const data = pmpRead_(),
    group = data.groupMap[String(id)];
  if (!data.ready || !group) throw Error('ไม่พบชุด Planning กรุณาโหลดใหม่');
  return {
    group: Object.fromEntries(
      PMP_GROUP_HEADERS_.map((k) => [k, k === 'revision' ? Number(group[k]) : group[k]]),
    ),
    items: data.plans
      .filter(
        (p) =>
          p.status !== PM_SOFT_DELETED_ &&
          data.metaMap[p.plan_id]?.planning_id === group.planning_id,
      )
      .map((p) => pmpPublic_(p, data))
      .sort((a, b) => a.sort_order - b.sort_order),
    available: data.plans
      .filter(
        (p) =>
          p.status !== PM_SOFT_DELETED_ &&
          !data.metaMap[p.plan_id]?.planning_id &&
          p.plan_date >= group.start_date &&
          pmpEnd_(p, data.metaMap[p.plan_id]) <= group.end_date,
      )
      .slice(0, 2000)
      .map((p) => pmpPublic_(p, data)),
    orgs: data.orgs,
    owners: data.owners,
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function itsdImpl_pmGetPlanningExport_(token, query, signature) {
  const actor = pmGuard_(token, true),
    result = pmpResult_(pmpRead_(), pmpQuery_(query), actor);
  if (!signature || String(signature) !== result.signature)
    throw Error('ข้อมูลหรือตัวกรองเปลี่ยนแล้ว กรุณาประมวลผลก่อนส่งออก');
  const brand = getSystemBranding_();
  return {
    ...result,
    branding: {
      short_name: brand.short_name,
      project_name: brand.project_name,
      description: brand.description,
    },
    exported_at: now_(),
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmPlanningCalendar_(token, month) {
  const actor = pmGuard_(token, false);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(month))) throw Error('เดือนไม่ถูกต้อง');
  const from = pmDate_(month + '-01'),
    to = pmpShift_(pmpShift_(from, 32).slice(0, 7) + '-01', -1),
    data = pmpRead_();
  const result = pmpResult_(
    data,
    { from, to, planning_id: '', org_unit_id: '', owner_id: '', status: '' },
    actor,
  );
  return {
    items: result.items,
    orgs: data.orgs,
    owners: data.owners,
    groups: result.groups,
    ready: data.ready,
    can_export: result.can_export,
    calendar_entries: calendar122Rows_().filter(x => x.active && x.start_date <= to && x.end_date >= from),
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpRevision_(input, old) {
  if (!Number.isInteger(Number(input)) || Number(input) !== Number(old?.revision || 0))
    throw Error('ข้อมูลถูกแก้ไขแล้ว กรุณาโหลดใหม่');
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpTask_(input, old, data, group) {
  const prior = old ? data.metaMap[old.plan_id] || {} : {},
    date = pmDate_(input.plan_date);
  const has = (k) => Object.prototype.hasOwnProperty.call(input, k);
  const end = pmDate_(
    has('end_date')
      ? input.end_date
      : old
        ? pmpShift_(pmpEnd_(old, prior), pmpDays_(old.plan_date, date))
        : date,
  );
  if (end < date || pmpDays_(date, end) > 365)
    throw Error('ช่วงวันของงาน PM ไม่ถูกต้อง หรือเกิน 366 วัน');
  const clean = pmValidate_(input, end, data.orgs),
    planningId = group
      ? group.planning_id
      : has('planning_id')
        ? pmText_(input.planning_id, 120)
        : prior.planning_id || '';
  const selected = group || data.groupMap[planningId];
  if (planningId && !selected) throw Error('ไม่พบชุด Planning ที่เลือก');
  if (selected && (date < selected.start_date || end > selected.end_date))
    throw Error('ช่วงวันของงานต้องอยู่ภายในชุด Planning');
  const ownerId = has('owner_id') ? pmText_(input.owner_id, 120) : prior.owner_id || '';
  if (
    ownerId &&
    !data.owners.some((u) => u.id === ownerId && (u.active || ownerId === prior.owner_id))
  )
    throw Error('ผู้รับผิดชอบไม่พร้อมใช้งาน');
  const priority = has('priority') ? pmText_(input.priority, 30) : prior.priority || 'ปกติ';
  if (!PMP_PRIORITIES_.includes(priority)) throw Error('ความเร่งด่วนไม่ถูกต้อง');
  const progress = has('progress') ? Number(input.progress) : Number(prior.progress) || 0;
  const order = Number(input.sort_order ?? prior.sort_order) || 0;
  if (!Number.isInteger(order) || order < 0 || order > 100000) throw Error('ลำดับงานไม่ถูกต้อง');
  if (
    !Number.isInteger(progress) ||
    progress < 0 ||
    progress > 100 ||
    (clean.status === 'กำลังดำเนินการ' && progress === 100)
  )
    throw Error('ความคืบหน้าต้องเป็น 0–99 ระหว่างดำเนินการ หรือเลือกสถานะดำเนินการแล้ว');
  if (!data.ready && (planningId || ownerId || end !== date || priority !== 'ปกติ' || progress))
    throw Error('กรุณาเปิดใช้งาน Planning ก่อนใช้ข้อมูลเพิ่มเติม');
  return {
    clean,
    meta: {
      __row: prior.__row,
      plan_id: old?.plan_id || 'PM-' + Utilities.getUuid(),
      planning_id: planningId,
      end_date: end,
      owner_id: ownerId,
      priority,
      progress:
        clean.status === 'ดำเนินการแล้ว' ? 100 : clean.status === 'กำลังดำเนินการ' ? progress : 0,
      sort_order: order,
    },
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpRecord_(task, old, actor, at) {
  return {
    ...task.clean,
    __row: old?.__row,
    plan_id: task.meta.plan_id,
    revision: Number(old?.revision || 0) + 1,
    created_at: old?.created_at || at,
    created_by: old?.created_by || actor.user_id,
    updated_at: at,
    updated_by: actor.user_id,
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpCell_(value) {
  const s = String(value ?? '');
  return /^\s*[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpChange_(sheet, headers, records) {
  const count = sheet.getLastRow() - 1,
    width = headers.length,
    range = count ? sheet.getRange(2, 1, count, width) : null;
  const raw = range ? range.getValues() : [],
    display = range ? range.getDisplayValues() : [],
    formulas = range && range.getFormulas ? range.getFormulas() : [];
  const values = raw.map((row, i) => row.map((v, j) => formulas[i]?.[j] || v));
  let next = count,
    first = Infinity,
    last = -1;
  records.forEach((record) => {
    const index = record.__row ? Number(record.__row) - 2 : next++;
    const text = headers.map((h) => String(record[h] ?? ''));
    if (display[index] && text.every((v, i) => v === display[index][i])) return;
    values[index] = text.map(pmpCell_);
    first = Math.min(first, index);
    last = Math.max(last, index);
  });
  if (last < 0) return [];
  return {
    sheet,
    row: first + 2,
    values: Array.from(
      { length: last - first + 1 },
      (_, i) => values[first + i] || Array(width).fill(''),
    ),
    width,
  };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpHistory_(sheet, entries) {
  return { sheet, row: sheet.getLastRow() + 1, values: entries, width: PM_AUDIT_HEADERS_.length };
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpAudit_(id, action, before, after, actor, at) {
  return [
    Utilities.getUuid(),
    id,
    action,
    JSON.stringify(before || {}),
    JSON.stringify(after || {}),
    actor.user_id,
    at,
  ].map(pmpCell_);
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmpCommit_(changes) {
  const attempted = [];
  try {
    changes.flat().forEach((c) => {
      const height = Math.max(c.values.length, c.clearRows || 0);
      if (c.sheet.getMaxRows && c.row + height - 1 > c.sheet.getMaxRows())
        c.sheet.insertRowsAfter(c.sheet.getMaxRows(), c.row + height - 1 - c.sheet.getMaxRows());
      const range = c.sheet.getRange(c.row, 1, height, c.width),
        before = range.getValues(),
        formulas = range.getFormulas ? range.getFormulas() : [];
      const restore = before.map((row, i) => row.map((cell, j) => formulas[i]?.[j] || cell));
      attempted.push({ range, restore });
      const values = Array.from(
        { length: height },
        (_, i) => c.values[i] || Array(c.width).fill(''),
      );
      range.setValues(values);
    });
    SpreadsheetApp.flush();
  } catch (error) {
    let restored = true;
    attempted.reverse().forEach((c) => {
      try {
        c.range.setValues(c.restore);
      } catch (_) {
        restored = false;
      }
    });
    if (!restored)
      throw Error(
        'บันทึกไม่สำเร็จและกู้คืนไม่ครบ กรุณาติดต่อ ADMIN เพื่อตรวจประวัติและสำรองข้อมูล',
      );
    throw Error('บันทึกไม่สำเร็จ คืนข้อมูลเดิมแล้ว: ' + String(error.message || error));
  }
}

// apps/webapp/src/server/features/pm/planning-service.js
function itsdImpl_pmSavePlanning_(token, input) {
  const actor = pmGuard_(token, true);
  if (!input || !Array.isArray(input.tasks) || input.tasks.length > PMP_MAX_TASKS_)
    throw Error('Planning รองรับงานไม่เกิน ' + PMP_MAX_TASKS_ + ' รายการต่อชุด');
  return lock_(() => {
    const data = pmpRead_();
    if (!data.ready) throw Error('กรุณาเปิดใช้งาน Planning ก่อน');
    const id = pmText_(input.planning_id, 120);
    if (!/^PMG-[A-Za-z0-9-]+$/.test(id)) throw Error('รหัส Planning ไม่ถูกต้อง');
    const oldGroup = data.groupMap[id];
    pmpRevision_(input.revision, oldGroup);
    const start = pmDate_(input.start_date),
      end = pmDate_(input.end_date),
      name = pmText_(input.name, 160);
    if (!name || end < start || pmpDays_(start, end) > 365)
      throw Error('ระบุชื่อและช่วง Planning ไม่เกิน 366 วัน');
    if (!oldGroup && !input.tasks.length) throw Error('เพิ่มงานอย่างน้อยหนึ่งรายการ');
    const at = now_(),
      group = {
        __row: oldGroup?.__row,
        planning_id: id,
        name,
        start_date: start,
        end_date: end,
        revision: Number(oldGroup?.revision || 0) + 1,
        created_at: oldGroup?.created_at || at,
        created_by: oldGroup?.created_by || actor.user_id,
        updated_at: at,
        updated_by: actor.user_id,
      };
    const members = data.plans.filter(
        (p) => p.status !== PM_SOFT_DELETED_ && data.metaMap[p.plan_id]?.planning_id === id,
      ),
      seen = new Set(),
      removed = input.removed || [];
    if (!Array.isArray(removed) || removed.length > PMP_MAX_TASKS_)
      throw Error('รายการลบไม่ถูกต้อง');
    const updates = input.tasks.map((task, index) => {
      const planId = String(task.plan_id || ''),
        old = planId ? data.planMap[planId] : null;
      if (
        planId &&
        (!old ||
          old.status === PM_SOFT_DELETED_ ||
          (data.metaMap[planId]?.planning_id && data.metaMap[planId].planning_id !== id))
      )
        throw Error('ไม่พบงานใน Planning หรือข้อมูลถูกเปลี่ยนแล้ว');
      if (planId) {
        if (seen.has(planId)) throw Error('งานซ้ำใน Planning');
        seen.add(planId);
        pmpRevision_(task.revision, old);
      }
      const validated = pmpTask_({ ...task, sort_order: index + 1 }, old, data, group);
      return { old, record: pmpRecord_(validated, old, actor, at), meta: validated.meta };
    });
    const deletions = removed.map((task) => {
      const old = data.planMap[String(task.plan_id)];
      if (
        !old ||
        seen.has(old.plan_id) ||
        old.status === PM_SOFT_DELETED_ ||
        data.metaMap[old.plan_id]?.planning_id !== id
      )
        throw Error('รายการลบซ้ำหรือข้อมูลเปลี่ยนแล้ว');
      seen.add(old.plan_id);
      pmpRevision_(task.revision, old);
      return {
        old,
        record: {
          ...old,
          status: PM_SOFT_DELETED_,
          revision: Number(old.revision) + 1,
          updated_at: at,
          updated_by: actor.user_id,
        },
      };
    });
    if (members.some((p) => !seen.has(p.plan_id)))
      throw Error('สมาชิก Planning เปลี่ยนแล้ว กรุณาโหลดใหม่ก่อนบันทึก');
    const planMap = Object.assign(Object.create(null), data.planMap),
      metaMap = Object.assign(Object.create(null), data.metaMap);
    updates.forEach((u) => {
      planMap[u.record.plan_id] = u.record;
      metaMap[u.record.plan_id] = u.meta;
    });
    deletions.forEach((u) => (planMap[u.record.plan_id] = u.record));
    const groups = oldGroup
      ? data.groups.map((g) => (g.planning_id === id ? group : g))
      : data.groups.concat(group);
    const history = pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_),
      audit = [
        pmpAudit_(
          'PLANNING:' + id,
          oldGroup ? 'PLANNING_UPDATE' : 'PLANNING_CREATE',
          oldGroup,
          group,
          actor,
          at,
        ),
      ];
    updates.forEach((u) =>
      audit.push(
        pmpAudit_(
          u.record.plan_id,
          u.old ? 'UPDATE' : 'CREATE',
          u.old ? { ...u.old, planning: data.metaMap[u.old.plan_id] } : {},
          { ...u.record, planning: u.meta },
          actor,
          at,
        ),
      ),
    );
    deletions.forEach((u) =>
      audit.push(pmpAudit_(u.record.plan_id, 'SOFT_DELETE', u.old, u.record, actor, at)),
    );
    pmpCommit_([
      pmpChange_(data.planSheet, PM_HEADERS_, Object.values(planMap)),
      pmpChange_(data.metaSheet, PMP_META_HEADERS_, Object.values(metaMap)),
      pmpChange_(data.groupSheet, PMP_GROUP_HEADERS_, groups),
      pmpHistory_(history, audit),
    ]);
    return { ok: true, id, revision: group.revision };
  });
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmPlanningSaveSingle_(token, input) {
  const actor = pmGuard_(token, true);
  if (!input || typeof input !== 'object') throw Error('ข้อมูลไม่ถูกต้อง');
  return lock_(() => {
    const data = pmpRead_(),
      old = input.plan_id ? data.planMap[String(input.plan_id)] : null;
    if (input.plan_id && (!old || old.status === PM_SOFT_DELETED_)) throw Error('ไม่พบแผน PM');
    pmpRevision_(input.revision ?? 0, old);
    const task = pmpTask_(input, old, data),
      at = now_(),
      record = pmpRecord_(task, old, actor, at);
    const plans = old
        ? data.plans.map((p) => (p.plan_id === old.plan_id ? record : p))
        : data.plans.concat(record),
      changes = [pmpChange_(data.planSheet, PM_HEADERS_, plans)];
    if (data.ready) {
      const meta = Object.assign(Object.create(null), data.metaMap, {
        [record.plan_id]: task.meta,
      });
      changes.push(pmpChange_(data.metaSheet, PMP_META_HEADERS_, Object.values(meta)));
    }
    changes.push(
      pmpHistory_(pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_), [
        pmpAudit_(
          record.plan_id,
          old ? 'UPDATE' : 'CREATE',
          old ? { ...old, planning: data.metaMap[old.plan_id] } : {},
          { ...record, planning: data.ready ? task.meta : null },
          actor,
          at,
        ),
      ]),
    );
    pmpCommit_(changes);
    return { ok: true, id: record.plan_id, revision: record.revision };
  });
}

// apps/webapp/src/server/features/pm/planning-service.js
function pmPlanningMove_(token, id, date, revision) {
  const actor = pmGuard_(token, true),
    target = pmDate_(date);
  return lock_(() => {
    const data = pmpRead_(),
      old = data.planMap[String(id)];
    if (!old || old.status === PM_SOFT_DELETED_) throw Error('ไม่พบแผน PM');
    pmpRevision_(revision, old);
    const prior = data.metaMap[old.plan_id],
      end = pmpShift_(pmpEnd_(old, prior), pmpDays_(old.plan_date, target));
    const task = pmpTask_({ ...old, plan_date: target, end_date: end }, old, data),
      at = now_(),
      record = pmpRecord_(task, old, actor, at);
    const changes = [
      pmpChange_(
        data.planSheet,
        PM_HEADERS_,
        data.plans.map((p) => (p.plan_id === old.plan_id ? record : p)),
      ),
    ];
    if (data.ready)
      changes.push(
        pmpChange_(
          data.metaSheet,
          PMP_META_HEADERS_,
          Object.values(
            Object.assign(Object.create(null), data.metaMap, { [old.plan_id]: task.meta }),
          ),
        ),
      );
    changes.push(
      pmpHistory_(pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_), [
        pmpAudit_(
          old.plan_id,
          'MOVE',
          { ...old, planning: prior },
          { ...record, planning: task.meta },
          actor,
          at,
        ),
      ]),
    );
    pmpCommit_(changes);
    return { ok: true, id: old.plan_id, revision: record.revision };
  });
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmGuard_(token, write) {
  const u = require_(token, false);
  if (write && !['ADMIN', 'MANAGER'].includes(roleKey_(u))) throw Error('ไม่มีสิทธิ์จัดการแผน PM');
  return u;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmSheet_(name, headers) {
  const s = book_().getSheetByName(name);
  if (!s)
    throw Error(
      'ยังไม่ได้ตั้งค่าชีต ' + name + ' กรุณาให้ผู้ดูแลระบบเรียก pmSetupCandidate() ก่อน',
    );
  const h = s.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  if (JSON.stringify(h) !== JSON.stringify(headers))
    throw Error('Schema แผน PM ไม่ตรงกับ Candidate: ' + name);
  return s;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmList_(s, headers) {
  const last = s.getLastRow();
  if (last < 2) return [];
  const values = s.getRange(2, 1, last - 1, headers.length).getDisplayValues(),
    out = [];
  for (let i = 0; i < values.length; i++) {
    const row = values[i],
      item = { __row: i + 2 };
    for (let j = 0; j < headers.length; j++) item[headers[j]] = row[j];
    if (item[headers[0]]) out.push(item);
  }
  return out;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmDate_(s) {
  const v = String(s || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw Error('วันที่ต้องอยู่ในรูป YYYY-MM-DD');
  const [y, m, d] = v.split('-').map(Number);
  const x = new Date(Date.UTC(y, m - 1, d));
  if (
    x.getUTCFullYear() !== y ||
    x.getUTCMonth() !== m - 1 ||
    x.getUTCDate() !== d ||
    y < 2000 ||
    y > 2100
  )
    throw Error('วันที่ไม่ถูกต้อง');
  return v;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmText_(v, max = 250) {
  const s = String(v ?? '').trim();
  if (s.length > max) throw Error('ข้อความยาวเกิน ' + max + ' ตัวอักษร');
  return s;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmTime_(v) {
  const s = pmText_(v, 5);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) throw Error('เวลาไม่ถูกต้อง');
  return s;
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmOrgs_() {
  return rows_('MST_ORG_UNITS')
    .filter((x) => x.org_unit_id && x.org_full_name)
    .map((x) => ({ id: x.org_unit_id, name: x.org_full_name }));
}

// apps/webapp/src/server/features/pm/calendar-service.js
function itsdImpl_pmSetupCandidate_() {
  const book = book_();
  return lock_(() => {
    [
      [PM_PLAN_TAB_, PM_HEADERS_],
      [PM_AUDIT_TAB_, PM_AUDIT_HEADERS_],
    ].forEach(([name, headers]) => {
      let s = book.getSheetByName(name);
      if (s) {
        pmSheet_(name, headers);
        return;
      }
      s = book.insertSheet(name);
      s.getRange(1, 1, 1, headers.length).setValues([headers]);
      s.setFrozenRows(1);
      s.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#173b63')
        .setFontColor('white');
      console.log('PM_SETUP created ' + name);
    });
    return { ok: true, sheets: [PM_PLAN_TAB_, PM_AUDIT_TAB_] };
  });
}

// apps/webapp/src/server/features/pm/calendar-service.js
const CALENDAR122_TAB_ = 'APP_HOLIDAYS';
const CALENDAR122_HEADERS_ = ['id','kind','title','start_date','end_date','notes','active','deleted','revision','updated_at','updated_by'];

function calendar122Rows_() {
  const sheet = book_().getSheetByName(CALENDAR122_TAB_);
  if (!sheet) return [];
  const headers = sheet.getRange(1, 1, 1, CALENDAR122_HEADERS_.length).getDisplayValues()[0];
  if (JSON.stringify(headers) !== JSON.stringify(CALENDAR122_HEADERS_)) throw Error('โครงสร้าง APP_HOLIDAYS ไม่ถูกต้อง กรุณาติดต่อ ADMIN');
  return pmList_(sheet, CALENDAR122_HEADERS_).filter(x => x.deleted !== 'TRUE').map(x => ({
    id:x.id, kind:x.kind, title:x.title, start_date:x.start_date, end_date:x.end_date,
    notes:x.notes, active:x.active === 'TRUE', revision:Number(x.revision), updated_at:x.updated_at,
  })).sort((a,b) => a.start_date.localeCompare(b.start_date) || a.title.localeCompare(b.title, 'th') || a.id.localeCompare(b.id));
}

function calendar122Guard_(token, write) {
  const actor = requirePermission_(token, 'SETTINGS', write ? 'MANAGE' : 'VIEW');
  if (roleKey_(actor) !== 'ADMIN') throw Error('เฉพาะ ADMIN เท่านั้นที่จัดการวันหยุดได้');
  return actor;
}

function itsdImpl_getCalendarEntries_(token) {
  calendar122Guard_(token, false);
  return { entries:calendar122Rows_() };
}

function calendar122Validate_(input) {
  const d = plainObject_(input, 'วันหยุด / ประกาศ');
  const kind = boundedText_(d.kind, 'ประเภท', 30, true);
  if (!['HOLIDAY','SPECIAL_HOLIDAY','ANNOUNCEMENT'].includes(kind)) throw Error('ประเภทวันหยุด / ประกาศไม่ถูกต้อง');
  const start = pmDate_(d.start_date), end = pmDate_(d.end_date);
  if (end < start || pmpDays_(start, end) > 365) throw Error('ช่วงวันต้องเรียงตามลำดับและไม่เกิน 366 วัน');
  const title = boundedText_(d.title, 'ชื่อวันหยุด / ประกาศ', 160, true).trim();
  if (!title) throw Error('กรุณาระบุชื่อวันหยุด / ประกาศ');
  if (typeof d.active !== 'boolean') throw Error('สถานะเปิดใช้งานไม่ถูกต้อง');
  return {kind, title, start_date:start, end_date:end, notes:boundedText_(d.notes || '', 'รายละเอียด', 2000), active:d.active ? 'TRUE' : 'FALSE'};
}

function itsdImpl_saveCalendarEntry_(token, input) {
  const actor = calendar122Guard_(token, true), clean = calendar122Validate_(input);
  const id = boundedText_(input.id || '', 'รหัสรายการ', 100), revision = input.revision;
  if (!Number.isInteger(revision) || revision < 0) throw Error('Revision ไม่ถูกต้อง');
  return lock_(() => {
    const current = calendar122Rows_(), old = id ? current.find(x => x.id === id) : null;
    if (id && !old) throw Error('ไม่พบรายการ หรือรายการถูกลบแล้ว');
    if (revision !== (old ? old.revision : 0)) throw Error('รายการถูกแก้ไขแล้ว กรุณาโหลดใหม่');
    const sheet = admin35EnsureSheet_(CALENDAR122_TAB_, CALENDAR122_HEADERS_);
    const rows = pmList_(sheet, CALENDAR122_HEADERS_);
    if (!old && rows.length >= 5000) throw Error('รายการวันหยุดเต็ม กรุณาติดต่อ ADMIN');
    const record = Object.assign({}, clean, {id:old ? old.id : Utilities.getUuid(), deleted:'FALSE', revision:revision + 1, updated_at:now_(), updated_by:actor.user_id});
    const row = old ? rows.find(x => x.id === old.id).__row : sheet.getLastRow() + 1;
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), row - sheet.getMaxRows());
    sheet.getRange(row,1,1,CALENDAR122_HEADERS_.length).setValues([CALENDAR122_HEADERS_.map(k => safeSheetValue_(record[k]))]);
    permissionAudit_log_(actor, old ? 'CALENDAR_UPDATE' : 'CALENDAR_CREATE', 'SETTINGS', record.id, 'SUCCESS', JSON.stringify({before:old,after:record}));
    return {ok:true,id:record.id,revision:record.revision};
  });
}

function itsdImpl_deleteCalendarEntry_(token, id, revision) {
  const actor = calendar122Guard_(token, true);
  id = boundedText_(id, 'รหัสรายการ', 100, true);
  if (!Number.isInteger(revision) || revision < 1) throw Error('Revision ไม่ถูกต้อง');
  return lock_(() => {
    const old = calendar122Rows_().find(x => x.id === id);
    if (!old) throw Error('ไม่พบรายการ หรือรายการถูกลบแล้ว');
    if (old.revision !== revision) throw Error('รายการถูกแก้ไขแล้ว กรุณาโหลดใหม่');
    const sheet = book_().getSheetByName(CALENDAR122_TAB_);
    const row = pmList_(sheet, CALENDAR122_HEADERS_).find(x => x.id === id);
    const record = Object.assign({}, row, {active:'FALSE',deleted:'TRUE',revision:revision + 1,updated_at:now_(),updated_by:actor.user_id});
    sheet.getRange(row.__row,1,1,CALENDAR122_HEADERS_.length).setValues([CALENDAR122_HEADERS_.map(k => safeSheetValue_(record[k]))]);
    permissionAudit_log_(actor, 'CALENDAR_DELETE', 'SETTINGS', id, 'SUCCESS', JSON.stringify({before:old,after:record}));
    return {ok:true,id,revision:revision + 1};
  });
}

function itsdImpl_pmGetCalendar_(token, month) {
  return pmPlanningCalendar_(token, month);
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmValidate_(input, endDate, orgs) {
  const date = pmDate_(input.plan_date),
    id = pmText_(input.org_unit_id, 100),
    org = (orgs || pmOrgs_()).find((x) => x.id === id);
  if (!org) throw Error('ไม่พบรหัสหน่วยงานใน MST_ORG_UNITS');
  const description = pmText_(input.description, 2000);
  if (!description) throw Error('กรุณาระบุรายละเอียดแผน');
  const start = pmTime_(input.start_time || '10:00'),
    end = pmTime_(input.end_time || '16:00');
  if ((!endDate || endDate === date) && end <= start)
    throw Error('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม');
  const status = pmText_(input.status || PM_STATES_[0], 50);
  if (!PM_STATES_.includes(status)) throw Error('สถานะไม่ถูกต้อง');
  return {
    plan_date: date,
    org_unit_id: id,
    org_name: org.name,
    work_area: pmText_(input.work_area, 250),
    description,
    start_time: start,
    end_time: end,
    status,
  };
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmWrite_(sheet, row, record) {
  sheet
    .getRange(row, 1, 1, PM_HEADERS_.length)
    .setValues([PM_HEADERS_.map((h) => String(record[h] ?? ''))]);
}

// apps/webapp/src/server/features/pm/calendar-service.js
function pmAudit_(sheet, id, action, before, after, u) {
  const v = [
    Utilities.getUuid(),
    id,
    action,
    JSON.stringify(before || {}),
    JSON.stringify(after || {}),
    u.user_id,
    now_(),
  ];
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, v.length).setValues([v]);
}

// apps/webapp/src/server/features/pm/calendar-service.js
function itsdImpl_pmSavePlan_(token, input) {
  return pmPlanningSaveSingle_(token, input);
}

// apps/webapp/src/server/features/pm/calendar-service.js
function itsdImpl_pmMovePlan_(token, id, date, revision) {
  return pmPlanningMove_(token, id, date, revision);
}

// apps/webapp/src/server/features/pm/calendar-service.js
function itsdImpl_pmDeletePlan_(token, id, revision) {
  const u = pmGuard_(token, true);
  return lock_(() => {
    const s = pmSheet_(PM_PLAN_TAB_, PM_HEADERS_),
      a = pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_);
    const old = pmList_(s, PM_HEADERS_).find((x) => x.plan_id === String(id));
    if (!old) throw Error('ไม่พบแผน PM');
    if (old.status === PM_SOFT_DELETED_) throw Error('แผนนี้ถูกลบแล้ว');
    if (Number(revision) !== Number(old.revision)) throw Error('ข้อมูลถูกแก้ไขแล้ว กรุณาโหลดใหม่');
    const now = {
      ...old,
      status: 'ยกเลิก',
      revision: Number(old.revision) + 1,
      updated_at: now_(),
      updated_by: u.user_id,
    };
    pmWrite_(s, old.__row, now);
    pmAudit_(a, id, 'CANCEL', old, now, u);
    console.log('PM_CANCEL', id);
    return { ok: true };
  });
}

// apps/webapp/src/server/features/pm/calendar-service.js
function itsdImpl_pmSoftDeletePlan_(token, id, revision) {
  const u = pmGuard_(token, true); // Same existing ADMIN/MANAGER permission rule
  const planId = pmText_(id, 120);
  if (!planId) throw Error('ไม่พบรหัสแผน PM');
  return lock_(() => {
    const s = pmSheet_(PM_PLAN_TAB_, PM_HEADERS_);
    const a = pmSheet_(PM_AUDIT_TAB_, PM_AUDIT_HEADERS_);
    const old = pmList_(s, PM_HEADERS_).find((x) => x.plan_id === planId);
    if (!old) throw Error('ไม่พบแผน PM');
    if (old.status === PM_SOFT_DELETED_) throw Error('แผนนี้ถูกลบไปแล้ว');
    if (!Number.isInteger(Number(revision)) || Number(revision) !== Number(old.revision))
      throw Error('ข้อมูลถูกแก้ไขแล้ว กรุณาโหลดใหม่');
    const next = {
      ...old,
      status: PM_SOFT_DELETED_,
      revision: Number(old.revision) + 1,
      updated_at: now_(),
      updated_by: u.user_id,
    };
    // Preserve the before/after record for auditing and recovery.
    pmWrite_(s, old.__row, next);
    pmAudit_(a, planId, 'SOFT_DELETE', old, next, u);
    console.log('PM_SOFT_DELETE', planId, 'actor', u.user_id, 'revision', next.revision);
    return { ok: true, id: planId, revision: next.revision };
  });
}

// apps/webapp/src/server/features/permissions/action-permission-api.js
function itsdImpl_getActionPermissionMatrix_(token) {
  const actor = require_(token, true);
  if (
    !permission_hasAction_(actor, 'role.manage') ||
    !permission_hasAction_(actor, 'permission.update')
  )
    throw Error('ไม่มีสิทธิ์จัดการสิทธิ์');
  return { updated_at: now_(), rows: permission_publicActionMatrix_() };
}

// apps/webapp/src/server/features/permissions/action-permission-api.js
function itsdImpl_updateActionPermission_(token, data) {
  const actor = require_(token, true),
    d = plainObject_(data || {}, 'ข้อมูลสิทธิ์');
  if (
    !permission_hasAction_(actor, 'role.manage') ||
    !permission_hasAction_(actor, 'permission.update')
  )
    throw Error('ไม่มีสิทธิ์จัดการสิทธิ์');
  const permissionId = boundedText_(d.permission_id, 'permission_id', 80, true);
  if (typeof d.is_allowed !== 'boolean') throw Error('is_allowed ต้องเป็น boolean');
  const allowed = d.is_allowed;
  return lock_(() => {
    permission_seedActionPermissions_();
    const row = find_('APP_ROLE_ACTION_PERMISSIONS', 'permission_id', permissionId);
    if (!row) throw Error('ไม่พบ permission_id');
    const role = String(row.role_key || '').toUpperCase(),
      action = String(row.action_key || '');
    if (role === 'ADMIN' && ['role.manage', 'permission.update'].includes(action) && !allowed)
      throw Error('ไม่สามารถปิดสิทธิ์กู้คืนระบบของ ADMIN ได้');
    update_('APP_ROLE_ACTION_PERMISSIONS', row.__row, {
      is_allowed: allowed ? 'TRUE' : 'FALSE',
      updated_at: now_(),
      updated_by: actor.username || actor.user_id,
    });
    permissionAudit_log_(
      actor,
      'PERMISSION_UPDATE',
      'permission',
      permissionId,
      'SUCCESS',
      'set ' + role + ' ' + action + ' = ' + allowed,
    );
    return true;
  });
}

// apps/webapp/src/server/features/audit/permission-audit.js
function permissionAudit_log_(actor, action, moduleCode, entityId, result, detail) {
  try {
    if (typeof writeAudit_ === 'function') {
      writeAudit_(actor, action, moduleCode, moduleCode, entityId, result, detail);
      return true;
    }
    append_('APP_AUDIT_LOG', {
      audit_id: Utilities.getUuid(),
      event_at: now_(),
      actor_user_id: actor && actor.user_id,
      actor_username: actor && actor.username,
      action: action,
      module_code: moduleCode,
      entity_type: moduleCode,
      entity_id: entityId,
      result: result,
      detail: detail,
      client_info: 'V1.0.53',
      session_ref: '',
    });
  } catch (_) {
    /* audit must not block the workflow */
  }
  return true;
}

// apps/webapp/src/server/features/projects/project-binding.js
function project70Binding_() {
  const raw = project70Properties_().getProperty('ITSD_PROJECT_BINDING');
  if (!raw) return null;
  try {
    const b = JSON.parse(raw);
    if (
      !b ||
      b.database_id !== DB_ID ||
      b.script_id !== ScriptApp.getScriptId() ||
      b.environment !== 'PRODUCTION' ||
      !PROJECT70_TIMEZONES_.includes(b.timezone) ||
      b.timezone !== TZ ||
      !/^[A-Za-z][A-Za-z0-9_-]{2,63}$/.test(b.project_id)
    )
      throw Error();
    return b;
  } catch (_) {
    throw Error(
      'PROJECT_BINDING_MISMATCH: ตรวจการผูกโครงการ ฐานข้อมูล และเขตเวลาใน Script Properties',
    );
  }
}

// apps/webapp/src/server/features/projects/project-binding.js
function project70Identity_(book) {
  const s = book.getSheetByName('APP_SETTINGS');
  if (!s) return {};
  const values = s.getDataRange().getDisplayValues();
  if (values[0]?.[0] !== 'key' || values[0]?.[1] !== 'value')
    throw Error('PROJECT_SETTINGS_SCHEMA_INVALID');
  return Object.fromEntries(
    values
      .slice(1)
      .filter((r) => String(r[0]).startsWith('itsd_binding_'))
      .map((r) => [r[0], r[1]]),
  );
}

// apps/webapp/src/server/features/projects/project-binding.js
function project70OpenBook_() {
  if (!PROJECT70_TIMEZONES_.includes(TZ))
    throw Error('PROJECT_TIMEZONE_UNSUPPORTED: รองรับเขตเวลา UTC+7 ตามคู่มือติดตั้ง');
  if (!DB_ID || !/^[A-Za-z0-9_-]{20,150}$/.test(DB_ID))
    throw Error(
      'PROJECT_NOT_CONFIGURED: ติดตั้งโครงการผ่าน project70Bootstrap_ ใน Apps Script editor',
    );
  const binding = project70Binding_();
  const isAuthorizedDb = DB_ID === PROJECT70_LEGACY_DB_ || DB_ID === PROJECT70_TARGET_DB_;
  const isAuthorizedScript =
    ScriptApp.getScriptId() === PROJECT70_LEGACY_SCRIPT_ ||
    ScriptApp.getScriptId() === PROJECT70_TARGET_SCRIPT_;
  if (!binding && (!isAuthorizedDb || !isAuthorizedScript))
    throw Error('PROJECT_NOT_BOUND: กรุณาผูกโครงการก่อนใช้งาน');
  const book = SpreadsheetApp.openById(DB_ID),
    marker = project70Identity_(book);
  if (
    binding &&
    (marker.itsd_binding_project_id !== binding.project_id ||
      marker.itsd_binding_environment !== binding.environment ||
      marker.itsd_binding_script_id !== binding.script_id ||
      marker.itsd_binding_timezone !== binding.timezone)
  )
    throw Error('PROJECT_DATABASE_IDENTITY_MISMATCH');
  if (
    !binding &&
    marker.itsd_binding_script_id &&
    marker.itsd_binding_script_id !== PROJECT70_LEGACY_SCRIPT_ &&
    marker.itsd_binding_script_id !== PROJECT70_TARGET_SCRIPT_
  )
    throw Error('PROJECT_DATABASE_IDENTITY_MISMATCH');
  return book;
}

// apps/webapp/src/server/features/projects/project-binding.js
function itsdImpl_adoptCurrentProjectBinding_(token, input) {
  const actor = project70Admin_(token, 'MANAGE');
  input = plainObject_(input, 'ยืนยันโครงการ');
  project70Reauthenticate_(actor, input.current_password);
  const id = boundedText_(input.project_id, 'Project ID', 64, true);
  if (!/^[A-Za-z][A-Za-z0-9_-]{2,63}$/.test(id))
    throw Error('Project ID ต้องขึ้นต้นด้วยตัวอักษร และมี a-z, 0-9, _ หรือ - รวม 3–64 ตัว');
  return lock_(() => {
    project70CheckRevision_(input.revision);
    const existing = project70Binding_();
    if (existing)
      throw Error(
        'โครงการนี้ผูกฐานข้อมูลแล้ว ติดตั้งโครงการอื่นด้วย Apps Script และฐานข้อมูลแยกกัน',
      );
    const b = book_(),
      backupId = project70Backup_(b),
      binding = {
        project_id: id,
        database_id: DB_ID,
        script_id: ScriptApp.getScriptId(),
        environment: 'PRODUCTION',
        timezone: TZ,
      };
    project70Stamp_(b, binding);
    project70Properties_().setProperties({
      ITSD_PROJECT_BINDING: JSON.stringify(binding),
      ITSD_CONFIG_REVISION: String(input.revision + 1),
      ITSD_BINDING_BACKUP_ID: backupId,
    });
    writeAudit_(
      actor,
      'PROJECT_BIND',
      'SETTINGS',
      'DATABASE',
      DB_ID,
      'SUCCESS',
      'ผูกตัวตนโครงการ Production หลังสำรองฐานข้อมูล',
    );
    return { configuration: project70Configuration_(), backup_id: backupId };
  });
}

// apps/webapp/src/server/features/projects/project-installer.js
function project70Stamp_(book, binding) {
  const sheet = book.getSheetByName('APP_SETTINGS'),
    values = sheet.getDataRange().getDisplayValues();
  const markers = {
    itsd_binding_project_id: binding.project_id,
    itsd_binding_script_id: binding.script_id,
    itsd_binding_environment: binding.environment,
    itsd_binding_timezone: binding.timezone,
  };
  Object.keys(markers).forEach((k) => {
    const index = values.findIndex((r) => r[0] === k);
    if (index > 0) sheet.getRange(index + 1, 2).setValue(markers[k]);
    else sheet.appendRow([k, markers[k]]);
  });
  resetRows_('APP_SETTINGS');
}

// apps/webapp/src/server/features/projects/project-installer.js
function project70Bootstrap_() {
  return lock_(() => {
    const p = project70Properties_();
    if (project70Binding_()) {
      const b = project70OpenBook_();
      return { database_id: b.getId(), already_installed: true };
    }
    const project = String(p.getProperty('ITSD_PROJECT_ID') || ''),
      environment = p.getProperty('ITSD_ENVIRONMENT'),
      timezone = p.getProperty('ITSD_TIMEZONE') || 'Asia/Bangkok';
    if (
      !/^[A-Za-z][A-Za-z0-9_-]{2,63}$/.test(project) ||
      environment !== 'PRODUCTION' ||
      !PROJECT70_TIMEZONES_.includes(timezone)
    )
      throw Error('ตั้ง ITSD_PROJECT_ID, ITSD_ENVIRONMENT และ ITSD_TIMEZONE ตามคู่มือก่อนติดตั้ง');
    if (!DB_ID || DB_ID === PROJECT70_LEGACY_DB_)
      throw Error('ใช้ฐานข้อมูลใหม่ที่แยกจากชุดตรวจสอบเดิม และกำหนด SPREADSHEET_ID ก่อนติดตั้ง');
    const username = normalizeUsername_(p.getProperty('ITSD_SETUP_ADMIN_USERNAME')),
      password = String(p.getProperty('ITSD_SETUP_ADMIN_PASSWORD') || ''),
      displayName = boundedText_(p.getProperty('ITSD_SETUP_ADMIN_NAME'), 'ชื่อ ADMIN', 120, true),
      name = boundedText_(p.getProperty('ITSD_SETUP_PROJECT_NAME'), 'ชื่อโครงการ', 120, true);
    if (
      !/^[A-Z][A-Z0-9_]{2,29}$/.test(username) ||
      password.length < 12 ||
      password.length > 128 ||
      !displayName ||
      !name
    )
      throw Error('กำหนดข้อมูล ADMIN และรหัสผ่าน 12–128 ตัวอักษรสำหรับการติดตั้ง');
    const b = SpreadsheetApp.openById(DB_ID),
      marker = project70Identity_(b);
    const resuming =
      marker.itsd_binding_project_id === project &&
      marker.itsd_binding_script_id === ScriptApp.getScriptId() &&
      marker.itsd_binding_environment === environment &&
      marker.itsd_binding_timezone === timezone;
    if (!resuming && b.getSheets().some((s) => s.getLastRow() > 0))
      throw Error('ติดตั้งใหม่ต้องใช้ Spreadsheet ว่าง ห้ามใช้ฐานข้อมูลที่มีข้อมูลเดิม');
    const binding = {
      project_id: project,
      database_id: DB_ID,
      script_id: ScriptApp.getScriptId(),
      environment,
      timezone,
    };
    const schemas = Object.assign({}, COL, {
      MST_ORG_UNITS: PROJECT70_ORG_HEADERS_,
      APP_LOOKUPS: LOOKUP_HEADERS,
      MST_DEVICE_MODELS: DEVICE_MODEL_HEADERS_,
      LINE_INBOX: LINE_LEGACY_HEADERS_,
      PM_PLANS: PM_HEADERS_,
      PM_PLAN_HISTORY: PM_AUDIT_HEADERS_,
      PM_PLANNINGS: PMP_GROUP_HEADERS_,
      PM_PLANNING_ITEMS: PMP_META_HEADERS_,
      TICKET_SERVICE_REPORT: SERVICE_REPORT_HEADERS_,
    });
    for (const n of Object.keys(schemas)) {
      let s = b.getSheetByName(n);
      if (!s) {
        s = b.insertSheet(n);
        s.getRange(1, 1, 1, schemas[n].length).setValues([schemas[n]]);
        s.setFrozenRows(1);
      } else if (
        s.getLastColumn() !== schemas[n].length ||
        s.getRange(1, 1, 1, schemas[n].length).getDisplayValues()[0].join('|') !==
          schemas[n].join('|')
      )
        throw Error('โครงสร้างไม่ตรง: ' + n);
    }
    project70Stamp_(b, binding);
    RUNTIME_CACHE_.book = b;
    RUNTIME_CACHE_.sheets = {};
    RUNTIME_CACHE_.headers = {};
    RUNTIME_CACHE_.rows = {};
    if (!rows_('APP_USERS').length) {
      const salt = random_();
      append_('APP_USERS', {
        user_id: Utilities.getUuid(),
        username,
        display_name: displayName,
        role: 'ADMIN',
        password_salt: salt,
        password_hash: pwHash_(password, salt),
        active: true,
        failed_count: 0,
        created_at: now_(),
      });
    }
    admin35SetSetting_('project_name', name);
    admin35SetSetting_('system_short_name', name);
    ensureAdminModuleSchema_();
    permission_seedActionPermissions_();
    if (!rows_('APP_LOOKUPS').length) {
      [
        ...DEVICE_DEFAULTS.map((label) => ['DEVICE', label]),
        ...TYPES.map((label) => ['PROBLEM', label]),
      ].forEach(([type, label], i) =>
        append_('APP_LOOKUPS', {
          lookup_id: Utilities.getUuid(),
          lookup_type: type,
          label,
          active: true,
          sort_order: i + 1,
          updated_at: now_(),
        }),
      );
    }
    p.setProperties({
      ITSD_PROJECT_BINDING: JSON.stringify(binding),
      LINE_MESSAGING_ENABLED: 'false',
      LINE_INBOX_SHEET_ID: DB_ID,
      ITSD_CONFIG_REVISION: '1',
    });
    p.deleteProperty('ITSD_SETUP_ADMIN_PASSWORD');
    SpreadsheetApp.flush();
    return {
      database_id: DB_ID,
      project_id: project,
      environment,
      installed: true,
      password_removed: true,
    };
  });
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70Properties_() {
  return PropertiesService.getScriptProperties();
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70Admin_(token, action) {
  const actor = requirePermission_(token, 'SETTINGS', action || 'VIEW');
  if (roleKey_(actor) !== 'ADMIN')
    throw Error('เฉพาะ ADMIN เท่านั้นที่จัดการการเชื่อมต่อโครงการได้');
  return actor;
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70Reauthenticate_(actor, password) {
  password = boundedText_(password, 'รหัสผ่านผู้ดูแล', SECURITY_LIMITS.PASSWORD, false);
  return lock_(() => {
    const p = project70Properties_(),
      key = 'ITSD_SETTINGS_REAUTH_' + digest_(actor.user_id).slice(0, 16);
    let state = { count: 0, until: 0 };
    try {
      state = JSON.parse(p.getProperty(key) || '{"count":0,"until":0}');
    } catch (_) {}
    if (Number(state.until) > Date.now())
      throw Error('ยืนยันรหัสผ่านผิดหลายครั้ง กรุณารอ 15 นาทีแล้วลองใหม่');
    if (Number(state.until) && Number(state.until) <= Date.now()) state = { count: 0, until: 0 };
    if (!password || pwHash_(password, actor.password_salt) !== actor.password_hash) {
      state.count = Number(state.count || 0) + 1;
      state.until = state.count >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
      p.setProperty(key, JSON.stringify(state));
      writeAudit_(
        actor,
        'SETTINGS_REAUTH',
        'SETTINGS',
        'USER',
        actor.user_id,
        'FAILED',
        'ยืนยันรหัสผ่านผู้ดูแลไม่สำเร็จ',
      );
      throw Error('รหัสผ่านผู้ดูแลไม่ถูกต้อง');
    }
    p.deleteProperty(key);
    return true;
  });
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70Revision_() {
  return Number(project70Properties_().getProperty('ITSD_CONFIG_REVISION') || 0);
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70CheckRevision_(revision) {
  if (!Number.isSafeInteger(revision) || revision !== project70Revision_())
    throw Error('การตั้งค่าถูกเปลี่ยนแล้ว กรุณาโหลดใหม่ก่อนบันทึก');
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function project70Configuration_() {
  const p = project70Properties_(),
    settings = systemSettingsMap_(),
    binding = project70Binding_();
  return {
    version: APP_VERSION,
    revision: project70Revision_(),
    project_id: binding?.project_id || '',
    environment: binding?.environment || 'PRODUCTION',
    binding_status: binding ? 'BOUND' : 'LEGACY_UNBOUND',
    database_id: DB_ID,
    database_name: book_().getName(),
    script_id: ScriptApp.getScriptId(),
    timezone: TZ,
    supported_timezones: PROJECT70_TIMEZONES_.slice(),
    deployment_url: p.getProperty('ITSD_DEPLOYMENT_URL') || '',
    gateway_url: p.getProperty('ITSD_GATEWAY_URL') || '',
    worker_name: p.getProperty('ITSD_WORKER_NAME') || '',
    line: {
      enabled: String(p.getProperty('LINE_MESSAGING_ENABLED') || '').toLowerCase() === 'true',
      groups: String(p.getProperty('ALLOWED_GROUP_IDS') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      signing_key_configured:
        String(p.getProperty('ITSD_LINE_GATEWAY_HMAC_KEY') || '').length >= 32,
      database_matches:
        !(p.getProperty('LINE_INBOX_SHEET_ID') || '') ||
        p.getProperty('LINE_INBOX_SHEET_ID') === DB_ID,
      status: lineMessagingSetupCheck_(),
    },
    report: Object.assign(
      Object.fromEntries(
        [
          'report_provider',
          'report_provider_address',
          'report_title',
          'report_project_description',
          'report_logo_file_id',
        ].map((k) => [k, settings[k] || '']),
      ),
      { report_logo_data_url: serviceReportReadLogoDataUrl_(settings) },
    ),
  };
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function itsdImpl_getProjectConfiguration_(token) {
  project70Admin_(token);
  return project70Configuration_();
}

// apps/webapp/src/server/features/projects/project-settings-service.js
function itsdImpl_saveProjectConfiguration_(token, input) {
  const actor = project70Admin_(token, 'EDIT');
  input = plainObject_(input, 'ค่าตั้งค่าโครงการ');
  const props = {
    ITSD_DEPLOYMENT_URL: project70DeploymentUrl_(input.deployment_url),
    ITSD_GATEWAY_URL: project70GatewayUrl_(input.gateway_url),
    ITSD_WORKER_NAME: boundedText_(input.worker_name, 'ชื่อ Worker', 63, true),
  };
  if (props.ITSD_WORKER_NAME && !/^[a-z0-9][a-z0-9-]{0,62}$/.test(props.ITSD_WORKER_NAME))
    throw Error('ชื่อ Worker ใช้ a-z, 0-9 และขีดกลาง');
  const settings = {};
  [
    'report_provider',
    'report_provider_address',
    'report_title',
    'report_project_description',
  ].forEach(
    (k) =>
      (settings[k] = boundedText_(input[k], k, k === 'report_provider_address' ? 500 : 240, true)),
  );
  return lock_(() => {
    project70CheckRevision_(input.revision);
    const p = project70Properties_(),
      oldProps = p.getProperties(),
      oldSettings = systemSettingsMap_();
    try {
      Object.keys(settings).forEach((k) => admin35SetSetting_(k, settings[k]));
      p.setProperties(Object.assign(props, { ITSD_CONFIG_REVISION: String(input.revision + 1) }));
    } catch (_) {
      Object.keys(settings).forEach((k) => admin35SetSetting_(k, oldSettings[k] || ''));
      Object.keys(props)
        .concat('ITSD_CONFIG_REVISION')
        .forEach((k) =>
          oldProps[k] === undefined ? p.deleteProperty(k) : p.setProperty(k, oldProps[k]),
        );
      throw Error('บันทึกไม่สำเร็จ กรุณาโหลดการตั้งค่าใหม่');
    }
    writeAudit_(
      actor,
      'PROJECT_SETTINGS_CHANGE',
      'SETTINGS',
      'APP_SETTINGS',
      'project_connections/report_template',
      'SUCCESS',
      'ปรับการเชื่อมต่อและหัวกระดาษใบงาน',
    );
    return project70Configuration_();
  });
}

// apps/webapp/src/server/features/projects/connection-checks.js
function project70DeploymentUrl_(value) {
  const text = boundedText_(value, 'Apps Script URL', 500, true);
  if (text && !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(text))
    throw Error('Apps Script URL ต้องเป็น https://script.google.com/macros/s/.../exec');
  return text;
}

// apps/webapp/src/server/features/projects/connection-checks.js
function project70GatewayUrl_(value) {
  const text = boundedText_(value, 'Cloudflare Worker URL', 300, true).replace(/\/$/, '');
  if (
    text &&
    !/^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.workers\.dev$/.test(
      text,
    )
  )
    throw Error('ระบุ URL หลัก https://ชื่อ-worker.บัญชี.workers.dev โดยไม่มี path');
  return text;
}

// apps/webapp/src/server/features/projects/connection-checks.js
function itsdImpl_checkProjectGateway_(token) {
  project70Admin_(token);
  const base = project70GatewayUrl_(project70Properties_().getProperty('ITSD_GATEWAY_URL'));
  if (!base) throw Error('กรุณาบันทึก Cloudflare Worker URL ก่อนตรวจสอบ');
  let reachable = false;
  try {
    const response = UrlFetchApp.fetch(base + '/healthz', {
      method: 'get',
      followRedirects: false,
      muteHttpExceptions: true,
      validateHttpsCertificates: true,
    });
    const text = response.getContentText();
    if (response.getResponseCode() === 200 && text.length <= 4096) {
      const data = JSON.parse(text);
      reachable = data.ok === true && data.service === 'itsd-line-gateway';
    }
  } catch (_) {
    /* Never return remote bodies, redirects, or exception text. */
  }
  return {
    reachable,
    checked_at: now_(),
    endpoint: base + '/healthz',
    scope: 'GATEWAY_HEALTH_ONLY',
    message: reachable
      ? 'เข้าถึง Gateway ได้ ยังต้องส่งข้อความจาก LINE เพื่อตรวจสอบการนำเข้าครบทุกขั้นตอน'
      : 'เข้าถึง Gateway ไม่สำเร็จ ตรวจ URL และ Deployment ของ Worker',
  };
}

// apps/webapp/src/server/features/projects/connection-checks.js
function itsdImpl_inspectProjectDatabase_(token, value) {
  project70Admin_(token);
  const id = boundedText_(value, 'Spreadsheet ID', 150, true);
  if (!/^[A-Za-z0-9_-]{20,150}$/.test(id)) throw Error('Spreadsheet ID ไม่ถูกต้อง');
  try {
    const b = SpreadsheetApp.openById(id),
      marker = project70Identity_(b);
    return {
      database_id: id,
      name: b.getName(),
      current: id === DB_ID,
      identity: marker,
      sheets: b
        .getSheets()
        .map((s) => ({ name: s.getName(), rows: s.getLastRow(), columns: s.getLastColumn() })),
      missing: ['INVENTORY', 'INCIDENT', 'MST_ORG_UNITS', 'APP_SETTINGS', 'APP_USERS'].filter(
        (n) => !b.getSheetByName(n),
      ),
      inspection_only: true,
    };
  } catch (_) {
    throw Error('ตรวจฐานข้อมูลไม่ได้ ตรวจ Spreadsheet ID สิทธิ์ และหัวตาราง APP_SETTINGS');
  }
}

// apps/webapp/src/server/features/line-settings/line-settings-service.js
function itsdImpl_saveProjectLineSettings_(token, input) {
  const actor = project70Admin_(token, 'EDIT');
  input = plainObject_(input, 'ตั้งค่า LINE');
  project70Reauthenticate_(actor, input.current_password);
  if (typeof input.enabled !== 'boolean' || typeof input.groups !== 'string')
    throw Error('ค่าตั้งค่า LINE ไม่ถูกต้อง');
  const groups = Array.from(
    new Set(
      boundedText_(input.groups, 'Group IDs', 4000, true)
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((g) => (/^C[0-9a-f]{32}$/i.test(g) ? 'C' + g.slice(1).toLowerCase() : g)),
    ),
  );
  if (groups.length > 50 || groups.some((g) => !/^C[0-9a-f]{32}$/i.test(g)))
    throw Error('Group ID ต้องขึ้นต้น C ตามด้วยตัวเลข/ตัวอักษรฐานสิบหก 32 ตัว');
  const key = boundedText_(input.new_hmac_key, 'กุญแจ HMAC ใหม่', 256, true);
  if (key && !/^[A-Za-z0-9_-]{32,256}$/.test(key))
    throw Error('กุญแจ HMAC ใช้ตัวอักษร/ตัวเลข/_/- อย่างน้อย 32 ตัว แนะนำสุ่ม 64 ตัว');
  return lock_(() => {
    project70CheckRevision_(input.revision);
    const p = project70Properties_();
    if (
      key &&
      input.enabled &&
      String(p.getProperty('LINE_MESSAGING_ENABLED') || '').toLowerCase() === 'true'
    )
      throw Error(
        'ปิดรับข้อมูลและบันทึกก่อนเปลี่ยนกุญแจ จากนั้นตั้งกุญแจให้ตรงกันทั้งสองฝั่งก่อนเปิดรับอีกครั้ง',
      );
    if (input.enabled) {
      if (
        !(key || p.getProperty('ITSD_LINE_GATEWAY_HMAC_KEY') || '').length ||
        String(key || p.getProperty('ITSD_LINE_GATEWAY_HMAC_KEY') || '').length < 32 ||
        !groups.length
      )
        throw Error('ต้องตั้งกุญแจ HMAC และกลุ่มที่อนุญาตก่อนเปิดรับข้อมูล');
      lineLegacySheet_();
    }
    const patch = {
      LINE_MESSAGING_ENABLED: String(input.enabled),
      ALLOWED_GROUP_IDS: groups.join(','),
      LINE_INBOX_SHEET_ID: DB_ID,
      ITSD_CONFIG_REVISION: String(input.revision + 1),
    };
    if (key) patch.ITSD_LINE_GATEWAY_HMAC_KEY = key;
    p.setProperties(patch);
    writeAudit_(
      actor,
      'LINE_SETTINGS_CHANGE',
      'SETTINGS',
      'SCRIPT_PROPERTIES',
      'line_receiver',
      'SUCCESS',
      'ปรับตัวรับ LINE; เปลี่ยนกุญแจ: ' + Boolean(key) + '; จำนวนกลุ่ม: ' + groups.length,
    );
    return project70Configuration_();
  });
}

// apps/webapp/src/server/features/projects/database-setup.js
function itsdImpl_createEmptyProjectDatabase_(token, input) {
  const actor = project70Admin_(token, 'MANAGE');
  input = plainObject_(input, 'ฐานข้อมูลใหม่');
  project70Reauthenticate_(actor, input.current_password);
  const name = boundedText_(input.name, 'ชื่อฐานข้อมูลใหม่', 120, true);
  if (!name) throw Error('กรุณาระบุชื่อฐานข้อมูลใหม่');
  return lock_(() => {
    project70CheckRevision_(input.revision);
    const b = SpreadsheetApp.create(name);
    project70Properties_().setProperty('ITSD_CONFIG_REVISION', String(input.revision + 1));
    writeAudit_(
      actor,
      'CREATE_PROJECT_DATABASE',
      'SETTINGS',
      'DATABASE',
      b.getId(),
      'SUCCESS',
      'สร้างฐานข้อมูลว่างแยกจากโครงการปัจจุบัน',
    );
    return {
      database_id: b.getId(),
      url: b.getUrl(),
      name: b.getName(),
      revision: input.revision + 1,
      current_database_unchanged: true,
    };
  });
}

// apps/webapp/src/server/features/projects/database-setup.js
function project70Backup_(book) {
  const source = DriveApp.getFileById(book.getId()),
    copy = source.makeCopy(
      'ITSD_BEFORE_PROJECT_BINDING_' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd_HHmmss'),
    );
  const backup = SpreadsheetApp.openById(copy.getId());
  for (const s of book.getSheets()) {
    const target = backup.getSheetByName(s.getName());
    if (
      !target ||
      target.getLastRow() !== s.getLastRow() ||
      target.getLastColumn() !== s.getLastColumn() ||
      (s.getLastColumn() &&
        target.getRange(1, 1, 1, s.getLastColumn()).getDisplayValues()[0].join('|') !==
          s.getRange(1, 1, 1, s.getLastColumn()).getDisplayValues()[0].join('|'))
    )
      throw Error('PROJECT_BACKUP_VERIFY_FAILED');
  }
  return copy.getId();
}

// apps/webapp/src/server/features/projects/drive-folder-setup.js
function itsdImpl_createProjectDriveFolders_(token, input) {
  const actor = project70Admin_(token, 'MANAGE');
  input = plainObject_(input, 'โครงสร้างโฟลเดอร์');
  const parent = boundedText_(input.parent_id, 'Parent Folder ID', 150, true);
  if (parent && !/^[A-Za-z0-9_-]{10,150}$/.test(parent)) throw Error('Parent Folder ID ไม่ถูกต้อง');
  return lock_(() => {
    project70CheckRevision_(input.revision);
    const settings = systemSettingsMap_();
    if (Object.keys(DRIVE_FOLDER_SETTINGS).some((k) => settings[k]))
      throw Error('มีโฟลเดอร์ตั้งค่าอยู่แล้ว กรุณาแก้ Folder ID ในหน้าทั่วไปเพื่อรักษาไฟล์เดิม');
    let root;
    try {
      root = (parent ? DriveApp.getFolderById(parent) : DriveApp.getRootFolder()).createFolder(
        getSystemBranding_().project_name + ' ITSD',
      );
    } catch (_) {
      throw Error('สร้างโฟลเดอร์ไม่ได้ ตรวจ Parent Folder ID และสิทธิ์');
    }
    const folders = { service_folder_id: root.getId() };
    for (const [key, name] of [
      ['backup_folder_id', 'Backups'],
      ['documents_folder_id', 'Documents'],
      ['pictures_folder_id', 'Pictures'],
      ['system_assets_folder_id', 'System Assets'],
    ])
      folders[key] = root.createFolder(name).getId();
    Object.keys(folders).forEach((k) => admin35SetSetting_(k, folders[k]));
    project70Properties_().setProperty('ITSD_CONFIG_REVISION', String(input.revision + 1));
    writeAudit_(
      actor,
      'CREATE_PROJECT_FOLDERS',
      'SETTINGS',
      'DRIVE_FOLDER',
      root.getId(),
      'SUCCESS',
      'สร้างโครงสร้างโฟลเดอร์โครงการ',
    );
    return { folders, revision: input.revision + 1 };
  });
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function serviceReportReadLogoDataUrl_(settings) {
  const s = settings || systemSettingsMap_();
  const id = String(s.report_logo_file_id || '').trim();
  if (!id) return '';
  const cacheKey = 'ITSD_REPORT_LOGO_' + id;
  const cached = CacheService.getScriptCache().get(cacheKey);
  if (cached) return cached;
  try {
    const file = DriveApp.getFileById(id),
      blob = file.getBlob(),
      mime = blob.getContentType();
    if (!ADMIN35_ICON_MIME.includes(mime)) return '';
    const dataUrl = 'data:' + mime + ';base64,' + Utilities.base64Encode(blob.getBytes());
    try {
      if (dataUrl.length < 95000) CacheService.getScriptCache().put(cacheKey, dataUrl, 21600);
    } catch (_) {}
    return dataUrl;
  } catch (_) {
    return '';
  }
}

function itsdImpl_uploadServiceReportLogo_(token, name, mime, base64) {
  const actor = project70Admin_(token, 'EDIT');
  name = boundedText_(name, 'ชื่อไฟล์', 120, true);
  mime = boundedText_(mime, 'ชนิดไฟล์', 80, true);
  base64 = boundedText_(base64, 'ข้อมูลรูปภาพ', SECURITY_LIMITS.BASE64, false);
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (!ADMIN35_ICON_MIME.includes(mime) || !['png', 'jpg', 'jpeg'].includes(ext))
    throw Error('รองรับเฉพาะไฟล์ PNG หรือ JPG เท่านั้น');
  const bytes = Utilities.base64Decode(base64);
  if (!bytes.length) throw Error('ไฟล์รูปภาพว่างเปล่า');
  if (bytes.length > 5 * 1024 * 1024) throw Error('ไฟล์โลโก้ต้องมีขนาดไม่เกิน 5 MB');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const old = find_('APP_SETTINGS', 'key', 'report_logo_file_id'),
      oldId = (old && old.value) || '';
    const safeName =
      'service-report-logo-' +
      Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss') +
      (mime === 'image/png' ? '.png' : '.jpg');
    const file = admin35AssetsFolder_().createFile(Utilities.newBlob(bytes, mime, safeName));
    admin35SetSetting_('report_logo_file_id', file.getId());
    if (oldId && oldId !== file.getId()) {
      try {
        CacheService.getScriptCache().remove('ITSD_REPORT_LOGO_' + oldId);
        DriveApp.getFileById(oldId).setTrashed(true);
      } catch (_) {}
    }
    const dataUrl = 'data:' + mime + ';base64,' + Utilities.base64Encode(bytes);
    try {
      if (dataUrl.length < 95000)
        CacheService.getScriptCache().put('ITSD_REPORT_LOGO_' + file.getId(), dataUrl, 21600);
    } catch (_) {}
    writeAudit_(
      actor,
      'UPLOAD',
      'SETTINGS',
      'REPORT_LOGO',
      file.getId(),
      'SUCCESS',
      'อัปโหลดโลโก้หัวใบงาน ' + name,
    );
    return { file_id: file.getId(), data_url: dataUrl, revision: project70Revision_() };
  });
}

function itsdImpl_clearServiceReportLogo_(token) {
  const actor = project70Admin_(token, 'EDIT');
  return lock_(() => {
    ensureAdminModuleSchema_();
    const old = find_('APP_SETTINGS', 'key', 'report_logo_file_id'),
      oldId = (old && old.value) || '';
    admin35SetSetting_('report_logo_file_id', '');
    if (oldId) {
      try {
        CacheService.getScriptCache().remove('ITSD_REPORT_LOGO_' + oldId);
        DriveApp.getFileById(oldId).setTrashed(true);
      } catch (_) {}
    }
    writeAudit_(
      actor,
      'DELETE',
      'SETTINGS',
      'REPORT_LOGO',
      oldId,
      'SUCCESS',
      'คืนค่าโลโก้หัวใบงานเป็นค่าเริ่มต้น',
    );
    return { file_id: '', data_url: '', revision: project70Revision_() };
  });
}

function serviceReportResolveAsset_(t, meta) {
  if (meta && meta.asset_id) {
    const byId = find_('INVENTORY', 'รหัสอุปกรณ์', meta.asset_id);
    if (byId) return byId;
  }
  const serial = String(t['หมายเลขซีเรียล'] || '').trim(),
    assetNo = String(t['เลขครุภัณฑ์'] || '').trim();
  if (!serial && !assetNo) return null;
  const rows = all_('INVENTORY');
  if (serial) {
    const matches = rows.filter((r) => String(r['หมายเลขซีเรียล'] || '').trim() === serial);
    if (matches.length === 1) return matches[0];
  }
  if (assetNo) {
    const matches = rows.filter((r) => String(r['เลขครุภัณฑ์'] || '').trim() === assetNo);
    if (matches.length === 1) return matches[0];
  }
  return null;
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function serviceReportSheet_(create) {
  let s = book_().getSheetByName('TICKET_SERVICE_REPORT');
  if (!s && create) s = admin35EnsureSheet_('TICKET_SERVICE_REPORT', SERVICE_REPORT_HEADERS_);
  if (
    s &&
    s.getRange(1, 1, 1, SERVICE_REPORT_HEADERS_.length).getDisplayValues()[0].join('|') !==
      SERVICE_REPORT_HEADERS_.join('|')
  )
    throw Error('โครงสร้าง TICKET_SERVICE_REPORT ไม่ตรงตามรุ่น กรุณาให้ ADMIN ตรวจสอบ');
  return s;
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function serviceReportRecord_(id) {
  return serviceReportSheet_(false) ? find_('TICKET_SERVICE_REPORT', 'ticket_id', id) || {} : {};
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function serviceReportCanEdit_(u, t, meta) {
  return (
    ['ADMIN', 'MANAGER', 'TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)) &&
    t['สถานะการแจ้งซ่อม'] !== 'ปิดงาน' &&
    hasPermissionForUser_(u, 'TICKETS', 'EDIT') &&
    permission_hasAction_(u, 'ticket.update_repair_detail') &&
    (permission_hasAction_(u, 'ticket.manage_all') ||
    !['TECHNICIAN', 'ITSUPPORT'].includes(roleKey_(u)) ||
      isTicketAssignedToUser_(u, t, meta))
  );
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function itsdImpl_getServiceReport_(token, id) {
  const actor = require_(token),
    t = ownTicket_(actor, id),
    meta = find_('INCIDENT_META', 'ticket_id', id) || {},
    detail = serviceReportRecord_(id);
  if (!['รอยืนยันผล', 'ปิดงาน'].includes(t['สถานะการแจ้งซ่อม']))
    throw Error('พิมพ์ใบงานได้เมื่อรอยืนยันผลหรือปิดงานแล้ว');
  const asset = serviceReportResolveAsset_(t, meta);
  const settings = systemSettingsMap_(),
    brand = getSystemBranding_(settings);
  const fields = {
    id: t['เลขที่แจ้งปัญหา'],
    reported_at: t['วันที่และเวลาที่แจ้ง'],
    reporter: t['ผู้แจ้งปัญหา'],
    phone: t['เบอร์โทร'],
    org: t['หน่วยงานหลัก'] || (asset && asset['หน่วยงานหลัก']) || '',
    suborg: t['หน่วยงานย่อย'] || (asset && asset['หน่วยงานย่อย']) || '',
    asset_id: meta.asset_id || (asset && asset['รหัสอุปกรณ์']) || '',
    floor: (asset && asset['ชั้น']) || '',
    asset_no: t['เลขครุภัณฑ์'] || (asset && asset['เลขครุภัณฑ์']) || '',
    serial: t['หมายเลขซีเรียล'] || (asset && asset['หมายเลขซีเรียล']) || '',
    brand: t['ยี่ห้อ'] || (asset && asset['ยี่ห้อ']) || '',
    model: t['รุ่น'] || (asset && asset['รุ่น']) || '',
    device: t['ประเภทอุปกรณ์'] || (asset && asset['ประเภทอุปกรณ์']) || '',
    description: t['รายละเอียดคำขอ / อาการเสีย'],
    resolution: t['รายละเอียดการดำเนินงาน / วิธีแก้ไข'],
    note: t['หมายเหตุ'],
    technician: t['ผู้ดำเนินการ'],
    finished_at: t['วันที่และเวลาแก้ไขเสร็จ'],
    status: t['สถานะการแจ้งซ่อม'],
    confirmed_by: meta.confirmed_by || '',
    confirmed_at: meta.confirmed_at || '',
    closed_at: meta.closed_at || '',
  };
  const result = {
    version: APP_VERSION,
    ticket: fields,
    detail: Object.fromEntries(SERVICE_REPORT_HEADERS_.map((k) => [k, detail[k] || ''])),
    revision: Number(detail.revision || 0),
    can_edit: serviceReportCanEdit_(actor, t, meta),
    branding: brand,
    template: {
      provider: settings.report_provider || SERVICE_REPORT_TEMPLATE_DEFAULTS_.report_provider,
      address:
        settings.report_provider_address || SERVICE_REPORT_TEMPLATE_DEFAULTS_.report_provider_address,
      title: settings.report_title || SERVICE_REPORT_TEMPLATE_DEFAULTS_.report_title,
      project:
        settings.report_project_description ||
        SERVICE_REPORT_TEMPLATE_DEFAULTS_.report_project_description ||
        brand.project_name,
      logo_file_id: settings.report_logo_file_id || '',
      logo_data_url: serviceReportReadLogoDataUrl_(settings),
    },
    generated_at: now_(),
  };
  return result;
}

// apps/webapp/src/server/features/service-reports/work-order-service.js
function itsdImpl_saveServiceReportDetails_(token, id, input) {
  const actor = require_(token);
  id = boundedText_(id, 'เลขที่แจ้งปัญหา', 80, true);
  input = plainObject_(input, 'ข้อมูลใบงาน');
  const patch = {
    outcome: boundedText_(input.outcome, 'ผลการซ่อม', 40, true),
    outcome_date: boundedText_(input.outcome_date, 'วันที่ผลการซ่อม', 10, true),
  };
  if (!SERVICE_REPORT_OUTCOMES_.includes(patch.outcome)) throw Error('ผลการซ่อมไม่ถูกต้อง');
  const date = patch.outcome_date ? new Date(patch.outcome_date + 'T00:00:00Z') : null;
  if (
    patch.outcome_date &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(patch.outcome_date) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== patch.outcome_date)
  )
    throw Error('วันที่ผลการซ่อมไม่ถูกต้อง');
  [
    'sent_name',
    'sent_model',
    'sent_serial',
    'replacement_name',
    'replacement_model',
    'replacement_serial',
  ].forEach((k) => (patch[k] = boundedText_(input[k], k, 160, true)));
  const hasNote = Object.prototype.hasOwnProperty.call(input, 'note');
  const noteText = hasNote ? boundedText_(input.note, 'หมายเหตุ', 500, true) : '';
  const rawDevicePatch =
    input.device_patch !== undefined ? plainObject_(input.device_patch, 'ข้อมูลอุปกรณ์') : null;
  if (!Number.isSafeInteger(input.revision) || input.revision < 0)
    throw Error('กรุณาโหลดใบงานใหม่ก่อนบันทึก');
  return lock_(() => {
    const ticket = ownTicket_(actor, id),
      meta = find_('INCIDENT_META', 'ticket_id', id) || {};
    if (!serviceReportCanEdit_(actor, ticket, meta))
      throw Error('ไม่มีสิทธิ์แก้ไขใบงานนี้ หรือปิดงานแล้ว');
    const old = serviceReportRecord_(id);
    if (Number(old.revision || 0) !== input.revision)
      throw Error('ใบงานถูกแก้ไขแล้ว กรุณาโหลดใหม่');
    const ticketPatch = {},
      metaPatch = { updated_at: now_() };
    let deviceUpdated = false;
    if (rawDevicePatch) {
      deviceUpdated = ticketApplyDevicePatch_(rawDevicePatch, ticketPatch, metaPatch);
    }
    if (hasNote) ticketPatch['หมายเหตุ'] = noteText;
    serviceReportSheet_(true);
    Object.assign(patch, {
      ticket_id: id,
      revision: input.revision + 1,
      updated_at: now_(),
      updated_by: actor.user_id,
    });
    if (old.__row) update_('TICKET_SERVICE_REPORT', old.__row, patch);
    else append_('TICKET_SERVICE_REPORT', patch);
    if (ticket.__row && Object.keys(ticketPatch).length) {
      update_('INCIDENT', ticket.__row, ticketPatch);
    }
    if (deviceUpdated && Object.prototype.hasOwnProperty.call(metaPatch, 'asset_id')) {
      let targetMeta = meta;
      if (!targetMeta.__row) {
        append_('INCIDENT_META', { ticket_id: id });
        targetMeta = find_('INCIDENT_META', 'ticket_id', id);
      }
      if (targetMeta && targetMeta.__row) update_('INCIDENT_META', targetMeta.__row, metaPatch);
    }
    writeAudit_(
      actor,
      'SERVICE_REPORT_EDIT',
      'TICKETS',
      'INCIDENT',
      id,
      'SUCCESS',
      'บันทึกข้อมูลแบบฟอร์มใบงาน โดยไม่เปลี่ยนสถานะงาน',
    );
    return { revision: patch.revision, note: hasNote ? noteText : ticket['หมายเหตุ'] || '' };
  });
}
