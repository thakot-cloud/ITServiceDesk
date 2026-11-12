'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'Server.js'), 'utf8');
const clientSource = fs.readFileSync(path.join(__dirname, '..', 'UI_Client.html'), 'utf8');
const helperNames = [
  'licenseNormalizeSerial_',
  'licenseMaskSecret_',
  'licenseFindMatch_',
  'licenseMaskAccount_',
  'licenseFieldDefinitions_',
  'licensePublicMatch_',
  'dbsLicenseRowsForAsset_',
  'dbsLicenseHasQcWarning_',
  'dbsLicenseByFieldKey_',
  'licenseMergeDbsMetadata_',
];
const helpers = helperNames.map((name) => {
  const match = source.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`));
  assert.ok(match, `Server.js must define ${name}`);
  return match[0];
});

const context = {};
vm.createContext(context);
vm.runInContext(
  `${helpers.join('\n')}\n${helperNames.map((name) => `this.${name} = ${name};`).join('\n')}`,
  context,
);

const permissionHelpers = ['permission_role_', 'permission_defaultAllowed_'].map((name) => {
  const match = source.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`));
  assert.ok(match, `Server.js must define ${name}`);
  return match[0];
});
vm.runInContext(
  `${permissionHelpers.join('\n')}\nthis.permission_defaultAllowed_ = permission_defaultAllowed_;`,
  context,
);

test('normalizes serials for exact canonical matching only', () => {
  assert.equal(context.licenseNormalizeSerial_(' 9rr-tg 53 '), '9RRTG53');
  assert.equal(context.licenseNormalizeSerial_(''), '');
});

test('masks secrets while retaining a short verification suffix', () => {
  const masked = context.licenseMaskSecret_('AAAAA-BBBBB-CCCCC-DDDDD-EEEEE');
  assert.equal(masked.endsWith('EEEEE'), true);
  assert.equal(masked.includes('AAAAA'), false);
  assert.equal(masked.includes('BBBBB'), false);
});

test('matches one license row to one inventory row by normalized serial', () => {
  const inventory = [
    { 'รหัสอุปกรณ์': 'INV-1', 'หมายเลขซีเรียล': '9RRT-G53' },
    { 'รหัสอุปกรณ์': 'INV-2', 'หมายเลขซีเรียล': 'ABC123' },
  ];
  const licenses = [
    { 'Serial Number Notebook': '9rrtg53', 'Product Key Windows': 'SECRET-ONE' },
  ];
  const result = context.licenseFindMatch_(inventory, licenses, 'INV-1');
  assert.equal(result.status, 'matched');
  assert.equal(result.license['Product Key Windows'], 'SECRET-ONE');
});

test('blocks ambiguous inventory serials instead of guessing', () => {
  const inventory = [
    { 'รหัสอุปกรณ์': 'INV-1', 'หมายเลขซีเรียล': 'DUP-001' },
    { 'รหัสอุปกรณ์': 'INV-2', 'หมายเลขซีเรียล': 'dup001' },
  ];
  const licenses = [{ 'Serial Number Notebook': 'DUP001' }];
  assert.equal(context.licenseFindMatch_(inventory, licenses, 'INV-1').status, 'duplicate_inventory_serial');
});

test('does not fuzzy-match a different serial', () => {
  const inventory = [{ 'รหัสอุปกรณ์': 'INV-1', 'หมายเลขซีเรียล': 'ABC123' }];
  const licenses = [{ 'Serial Number Notebook': 'ABC124' }];
  assert.equal(context.licenseFindMatch_(inventory, licenses, 'INV-1').status, 'not_found');
});

test('public summary never contains the raw keys or account password', () => {
  const secretValues = {
    'Product Key Windows': 'WIN-SECRET-12345',
    'Product Key Microsoft Office': 'OFFICE-SECRET-67890',
    'E-mail Account Microsoft': 'admin@example.test',
    Password: 'RAW-PASSWORD-SECRET',
    'Product Key Antivirus': 'ANTIVIRUS-SECRET-54321',
  };
  const summary = context.licensePublicMatch_({
    status: 'matched',
    asset: { 'หมายเลขซีเรียล': 'SERIAL-1' },
    license: secretValues,
  });
  const payload = JSON.stringify(summary);
  Object.values(secretValues).forEach((secret) => assert.equal(payload.includes(secret), false));
  assert.equal(summary.items.length, 5);
});

test('license permissions are limited to ADMIN and MANAGER', () => {
  ['ADMIN', 'MANAGER'].forEach((role) => {
    assert.equal(context.permission_defaultAllowed_(role, 'license.view'), true);
    assert.equal(context.permission_defaultAllowed_(role, 'license.reveal_secret'), true);
  });
  ['TECHNICIAN', 'ITSUPPORT', 'USER'].forEach((role) => {
    assert.equal(context.permission_defaultAllowed_(role, 'license.view'), false);
    assert.equal(context.permission_defaultAllowed_(role, 'license.reveal_secret'), false);
  });
});

test('server and client both enforce the ADMIN/MANAGER role allowlist', () => {
  const match = source.match(
    /function licenseRequireAuthorizedRole_\(actor\) \{[\s\S]*?\n\}/,
  );
  assert.ok(match, 'Server.js must hard-gate the license endpoints by role');
  const roleContext = { roleKey_: (actor) => String(actor.role || '').toUpperCase() };
  vm.createContext(roleContext);
  vm.runInContext(
    `${match[0]}; this.licenseRequireAuthorizedRole_ = licenseRequireAuthorizedRole_;`,
    roleContext,
  );
  assert.equal(roleContext.licenseRequireAuthorizedRole_({ role: 'ADMIN' }), 'ADMIN');
  assert.equal(roleContext.licenseRequireAuthorizedRole_({ role: 'MANAGER' }), 'MANAGER');
  ['TECHNICIAN', 'ITSUPPORT', 'USER'].forEach((role) =>
    assert.throws(() => roleContext.licenseRequireAuthorizedRole_({ role })),
  );
  assert.match(
    clientSource,
    /\['ADMIN', 'MANAGER'\]\.includes\(role\) && hasAction\('license\.view'\)/,
  );
  assert.match(source, /licenseRequireAuthorizedRole_\(actor\);[\s\S]*?license\.view/);
  assert.match(source, /licenseRequireAuthorizedRole_\(actor\);[\s\S]*?license\.reveal_secret/);
});

test('external license sheet defaults to Full_Data with fallback', () => {
  assert.match(source, /SOFTWARE_LICENSE_SHEET_NAME_[\s\S]*?'Full_Data'/);
  assert.match(source, /getSheetByName\('Full_Data'\)/);
  assert.match(clientSource, /assetLicenseInvalidate/);
});

test('enriches matched licenses with DBS status/QC warnings and masks fallback safely', () => {
  const dbsRows = [
    {
      'รหัสอุปกรณ์': 'INV-TOR70-0936',
      'หมายเลขซีเรียล': 'PF5KHQN1',
      'ประเภท License': 'Windows',
      'Product Key_Masked': '*****6JGPT',
      Account_Email_Masked: 'oc***01@outlook.com',
      'สถานะ License': 'รอตรวจสอบ',
      'สถานะ Activation': 'ยังไม่ได้ตรวจสอบ',
      'หมายเหตุ': 'แก้ SN ต้นทางจาก PF5KHON1 เป็น PF5KHQN1 และจับคู่ตรง',
    },
    {
      'รหัสอุปกรณ์': 'INV-TOR70-0936',
      'หมายเลขซีเรียล': 'PF5KHQN1',
      'ประเภท License': 'Antivirus',
      'Product Key_Masked': '*****8AWPT',
      Account_Email_Masked: '',
      'สถานะ License': 'รอตรวจสอบ',
      'สถานะ Activation': 'ยังไม่ได้ตรวจสอบ',
      'หมายเหตุ': 'ค่าต้นทางซ้ำทั้ง 95 เครื่อง; รอยืนยันว่าเป็น Product Key หรือสิทธิ์ร่วม',
    },
  ];
  const matchedRecords = context.dbsLicenseRowsForAsset_(dbsRows, 'INV-TOR70-0936', 'PF5KHQN1');
  assert.equal(matchedRecords.length, 2);

  const enrichedMatched = context.licenseMergeDbsMetadata_(
    {
      status: 'matched',
      message: 'จับคู่ License ด้วยหมายเลขซีเรียลเรียบร้อย',
      serial: 'PF5KHQN1',
      items: [
        { key: 'windows_key', label: 'Windows Product Key', available: true, masked: '•••••6JGPT' },
        { key: 'antivirus_key', label: 'Antivirus Product Key', available: true, masked: '•••••8AWPT' },
      ],
    },
    matchedRecords,
    { รหัสอุปกรณ์: 'INV-TOR70-0936', หมายเลขซีเรียล: 'PF5KHQN1' },
  );
  assert.equal(enrichedMatched.status, 'matched');
  assert.equal(enrichedMatched.reveal_enabled, true);
  assert.equal(enrichedMatched.items[0].has_warning, true);
  assert.equal(enrichedMatched.items[1].has_warning, true);

  const fallbackMasked = context.licenseMergeDbsMetadata_(
    { status: 'not_found', message: 'not found', serial: 'PF5KHQN1', items: [] },
    matchedRecords,
    { รหัสอุปกรณ์: 'INV-TOR70-0936', หมายเลขซีเรียล: 'PF5KHQN1' },
  );
  assert.equal(fallbackMasked.status, 'masked_only');
  assert.equal(fallbackMasked.reveal_enabled, false);
  assert.equal(fallbackMasked.items.every((item) => item.available === false), true);
  assert.equal(fallbackMasked.items.some((item) => item.key === 'microsoft_password'), false);
  assert.equal(fallbackMasked.items[0].masked, '*****6JGPT');
});
