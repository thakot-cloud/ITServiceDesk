'use strict';

const fs = require('node:fs');
const path = require('node:path');

const sourcePath = path.resolve(__dirname, '..', 'UI_Client.html');
const outputPath = path.resolve(process.argv[2] || '/tmp/cm-form-69-v1168.html');
const source = fs.readFileSync(sourcePath, 'utf8');

function extract(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Cannot extract ${startMarker}`);
  return source.slice(start, end);
}

const dateHelper = extract('function service70DateOnly(', '\nfunction service70Html(');
const renderer = extract('function service70Html(', '\nasync function service70PrintHtml(');
const build = new Function(`
  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const SERVICE_REPORT_DEFAULT_LOGO =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLx8QAAAABJRU5ErkJggg==';
  const SERVICE_REPORT_DEFAULTS = {
    report_provider: 'Open Technology Public Company Limited',
    report_provider_address: '123 ถนนทดสอบ กรุงเทพมหานคร โทร. 02-000-0000',
    report_title: 'ใบแจ้งซ่อม / ใบงานบริการ',
    report_project_description: 'โครงการ IT Service Desk',
  };
  ${dateHelper}
  ${renderer}
  return service70Html;
`)();

const longOrganization =
  'กองนโยบายและยุทธศาสตร์การคุ้มครองผู้บริโภคและการพัฒนาระบบบริการสารสนเทศส่วนกลาง';
const html = build({
  ticket: {
    id: 'INC-2027-11-11-0002',
    org: longOrganization,
    suborg: 'กลุ่มพัฒนาระบบสารสนเทศและบริหารจัดการโครงสร้างพื้นฐานดิจิทัล',
    reporter: 'ผู้ใช้งานทดสอบชื่อยาว',
    phone: '1234 ต่อ 5678',
    floor: '15',
    reported_at: '2026-11-11T09:30:00+07:00',
    asset_no: '7440-001-03-0250/63',
    serial: '9RRTG53-TEST-LONG',
    brand: 'DELL',
    model: 'OptiPlex 3070',
    device: 'Computer PC',
    description: 'เปิดเครื่องไม่ติดและมีเสียงแจ้งเตือนจากเมนบอร์ด ต้องตรวจสอบชุดจ่ายไฟและหน่วยความจำ',
    resolution: 'ทำความสะอาดหน้าสัมผัสหน่วยความจำ ทดสอบชุดจ่ายไฟ และติดตั้งอุปกรณ์กลับเข้าระบบ',
    technician: 'เจ้าหน้าที่ทดสอบ',
    confirmed_by: 'ผู้ใช้งานทดสอบชื่อยาว',
    note: 'ทดสอบการจัดหน้า A4 และข้อความยาว',
  },
  detail: {
    outcome: 'COMPLETED',
    outcome_date: '2026-11-11',
    sent_name: 'Computer PC',
    sent_model: 'OptiPlex 3070',
    sent_serial: '9RRTG53-TEST-LONG',
    replacement_name: 'Computer PC',
    replacement_model: 'OptiPlex 7090',
    replacement_serial: 'REPLACEMENT-001',
  },
  template: {},
});

for (const required of [
  '@page{size:A4 portrait;margin:10mm}',
  'grid-template-columns:1.71fr 1.05fr .31fr .95fr',
  'INC-2027-11-11-0002',
  longOrganization,
  '<span class="lbl">โทร.</span>',
]) {
  if (!html.includes(required)) throw new Error(`Missing expected output: ${required}`);
}

fs.writeFileSync(outputPath, html);
console.log(outputPath);
