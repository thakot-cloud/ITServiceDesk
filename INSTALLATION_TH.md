# คู่มือการติดตั้ง พัฒนา และเผยแพร่ IT Service Desk

เอกสารนี้เป็น runbook สำหรับผู้ดูแลระบบและผู้พัฒนา Production ใช้กับโครงการที่ยืนยันในตารางด้านล่างเท่านั้น

## 1. ข้อมูลอ้างอิงของโครงการ

| รายการ | ค่าที่ต้องตรง |
|---|---|
| ชื่อโครงการ | `IT Service Desk : ระบบแจ้งซ่อม บริหารจัดการงานครุภัณฑ์` |
| Local path | `/Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026` |
| Drive folder | `13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe` |
| Spreadsheet ID | `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` |
| Apps Script ID | `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7` |
| Deployment ID | `AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps` |
| GitHub | `https://github.com/thakot-cloud/ITServiceDesk` |

ลิงก์: [Drive](https://drive.google.com/drive/folders/13LSPwXw4tEkw-F4wGJO9Q2qbn9RZx5Oe) · [Database](https://docs.google.com/spreadsheets/d/1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c/edit?gid=999901#gid=999901) · [Source editor](https://script.google.com/home/projects/1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7/edit) · [Production Web App](https://script.google.com/macros/s/AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps/exec)

## 2. สิ่งที่ต้องมีและสิทธิ์

- macOS/Linux shell, Git, Node.js LTS และ `@google/clasp`
- สิทธิ์ Editor ของ Apps Script, Spreadsheet และ Drive folder
- สิทธิ์ push repository `thakot-cloud/ITServiceDesk`
- สิทธิ์จัดการ deployment เมื่อจะ release
- บัญชี ADMIN ของระบบสำหรับทดสอบส่วนผู้ดูแล

ติดตั้ง clasp และเข้าสู่ระบบ:

```bash
npm install -g @google/clasp
clasp login
```

## 3. Clone หรือเชื่อม Local checkout

สำหรับเครื่องใหม่:

```bash
git clone https://github.com/thakot-cloud/ITServiceDesk.git /Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026
cd /Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026
```

สร้าง `.clasp.json` แบบ local-only:

```json
{
  "scriptId": "1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7"
}
```

ไฟล์ `.clasp.json`, `.claspignore`, backup และ report เฉพาะเครื่องถูกกันออกจาก Git แล้ว

## 4. ตรวจ identity ก่อนแตะ source

```bash
pwd
git status --short --branch
git remote -v
cat .clasp.json
clasp list-deployments
```

เงื่อนไขผ่าน:

1. `pwd` ตรง Local path ในข้อ 1
2. Git remote ชี้ `https://github.com/thakot-cloud/ITServiceDesk.git`
3. Script ID ตรง Apps Script ID ที่ยืนยัน
4. รายการ deployment มี Production Deployment ID เดิม
5. worktree ไม่มีไฟล์ที่ไม่ทราบที่มา; ถ้ามีให้ตรวจและเก็บงานก่อน

## 5. สำรองก่อน `clasp pull`

`clasp pull` สามารถเขียนทับไฟล์ local ได้ ต้องคัดลอกไฟล์ Apps Script ทั้งหมดไปโฟลเดอร์ timestamp ภายใต้ `.pull-backups/` และบันทึก checksum ก่อนทุกครั้ง

ไฟล์หลักที่ต้องสำรอง:

```text
Api.js
Entrypoints.js
Index.html
Server.js
UI_Client.html
UI_Styles.html
UI_Templates.html
appsscript.json
```

จากนั้นจึงรัน:

```bash
clasp pull
git diff --check
git diff --stat
```

สำคัญ: `clasp pull` ดึงเฉพาะ source/manifest ไม่ได้ดึง Script Properties, deployment configuration, ข้อมูล Sheets หรือไฟล์ใน Drive จึงยังสรุป runtime parity จาก source อย่างเดียวไม่ได้

## 6. Script Properties

ตั้งค่าที่ Apps Script → Project Settings → Script Properties ค่าอย่างน้อย:

| Property | ค่า/ความหมาย |
|---|---|
| `SPREADSHEET_ID` | ต้องเป็น `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c` |
| `ITSD_TIMEZONE` | `Asia/Bangkok` |
| `ITSD_PROJECT_ID` | รหัสโครงการที่องค์กรกำหนด |
| `ITSD_ENVIRONMENT` | `PRODUCTION` |
| `ITSD_LINE_GATEWAY_HMAC_KEY` | Secret สำหรับ LINE Gateway เมื่อเปิดใช้ |
| `ITSD_BRIDGE_KEY` | Legacy bridge secret เฉพาะกรณีที่ยังใช้งาน |

ห้ามคัดลอกค่า secret ลง source, เอกสาร, issue, log หรือ GitHub และห้ามบันทึกค่าจริงในภาพหน้าจอ

## 7. โครงสร้างข้อมูลและการเริ่มระบบ

โครงสร้างหลักอธิบายที่ [DATA_DIAGRAM.md](DATA_DIAGRAM.md) ก่อนใช้คำสั่ง setup หรือ migration กับ Production ต้อง:

1. ทำสำเนา Spreadsheet และตรวจว่าเปิดสำเนาได้
2. บันทึก source commit, Apps Script version และ deployment
3. ตรวจ header ของ sheet หลัก ไม่เปลี่ยนชื่อคอลัมน์โดยพลการ
4. ทดลองบนสำเนาก่อน
5. ใช้ ADMIN token กับ maintenance endpoint

ห้ามเรียก installer ซ้ำหรือ bulk import ใส่ Production เพื่อทดลอง ระบบจำกัด import สูงสุด 500 แถวต่อคำขอ แต่ผู้ดูแลยังต้องตรวจ preview และผลกระทบต่อ reference

## 8. มาตรฐานการพัฒนา

1. Pull และสร้าง commit checkpoint ของ source ฝั่ง Apps Script ก่อนเริ่มแก้
2. เพิ่มเลข patch version และ change history ในไฟล์ release ที่เกี่ยวข้อง
3. รักษา backward compatibility ของ public function ใน `Api.js`
4. Validate input และตรวจ permission ฝั่ง server ทุก mutation; ห้ามพึ่ง UI guard อย่างเดียว
5. ใช้ `LockService` กับงานที่อาจเขียนชนกัน และ batch read/write Google Sheets เมื่อทำได้
6. ห้าม hard-code credential หรือข้อมูลส่วนบุคคล
7. ไม่ลบ/renumber/merge ticket, asset หรือ history ที่มี reference โดยไม่มีอนุมัติและ mapping report
8. แก้เฉพาะขอบเขตงานและแยก commit source กับเอกสาร

## 9. Validation ก่อน commit

```bash
git diff --check
node --check Server.js
node --check Api.js
node --check Entrypoints.js
```

ตรวจ JavaScript ภายใน `UI_Client.html` โดยแยกเนื้อหาระหว่าง `<script>` และ `</script>` ไปยังไฟล์ชั่วคราว แล้วรัน `node --check` ตรวจต่อ:

- ไม่มี Script/Spreadsheet ID ชุดอื่นปะปน
- ไม่มี secret/token/password/private key
- `appsscript.json` เป็น V8, timezone `Asia/Bangkok`
- ฟังก์ชัน mutation และ maintenance ตรวจ permission ฝั่ง server
- UI ที่แก้รองรับ desktop/mobile และ light/dark ตามขอบเขตงาน

## 10. Commit และ Push GitHub

```bash
git fetch origin main
git status --short --branch
git add <เฉพาะไฟล์ที่ตรวจแล้ว>
git commit -m "fix: align confirmed IT Service Desk production binding"
git push origin main
```

หาก remote มี commit ใหม่ ให้รวมประวัติอย่างปลอดภัยและตรวจ conflict ห้าม `git push --force` ไป `main` และห้าม commit `.clasp.json`, backup หรือ secret

## 11. Push และ Deploy Apps Script

ขั้นตอนนี้ทำเมื่อได้รับอนุมัติ deploy แยกต่างหากเท่านั้น:

```bash
clasp list-deployments
clasp push --force
clasp version "Vx.y.z - short release description"
clasp deploy --deploymentId AKfycbxPnpvvQqmD5FrkHhLIqEdGsX-mCpV5R57G5SrTVPNQ87zxViX_4ObmRvsL0fayTps -d "Vx.y.z - short release description"
clasp list-versions
clasp list-deployments
```

ต้องใช้ deployment ID เดิมเสมอเพื่อคง Production URL ห้าม `clasp deploy` โดยไม่ระบุ `--deploymentId` เพราะจะสร้าง deployment ใหม่

## 12. ตรวจหลัง Deploy

1. Production `/exec` ตอบ HTTP 200 และเปิดหน้า Login ได้
2. เวอร์ชันบน UI/Bootstrap ตรง release
3. Login/logout และ session expiration ทำงาน
4. เปิด ticket, เปลี่ยนสถานะ, ประวัติ และไฟล์แนบทำงาน
5. ค้นหา/แก้ไขครุภัณฑ์ และหน้าสำรวจโหลดได้
6. Dashboard/report ตรงข้อมูลทดสอบและ permission
7. ADMIN settings, audit log และ backup ใช้ token/permission ถูกต้อง
8. ถ้าใช้ LINE ให้ตรวจ signature, inbox review และการสร้าง ticket
9. ตรวจ Apps Script Executions ว่าไม่มี error ใหม่

## 13. Rollback

- Source: revert ด้วย commit ใหม่ ห้าม reset/force-push ประวัติ `main`
- Runtime: เลือก Apps Script version ที่ผ่านการตรวจ แล้วอัปเดต deployment ID เดิมกลับไป version นั้น
- Data: กู้จาก backup หลังอนุมัติเท่านั้น ทดสอบกับสำเนาก่อน และรักษา ID/reference เดิม
- บันทึกเหตุผล ผู้อนุมัติ เวลา commit/version/deployment และผลตรวจหลัง rollback

## 14. Troubleshooting

| อาการ | วิธีตรวจ |
|---|---|
| `The caller does not have permission` | `clasp login` ใหม่ด้วยบัญชีที่มีสิทธิ์ Apps Script |
| `Requested entity was not found` | ตรวจ Script ID และสิทธิ์บัญชี ไม่เปลี่ยน `.clasp.json` แบบเดาสุ่ม |
| `ENOTFOUND` | ตรวจ DNS/network; ไม่ได้แปลว่า binding ผิดเสมอ |
| Web App ยังเป็นรุ่นเก่า | ตรวจ version + deployment ID และรอ propagation ก่อนทดสอบซ้ำ |
| เปิดได้แต่ข้อมูลผิดไฟล์ | ตรวจ Script Property `SPREADSHEET_ID` และ project identity ทันที หยุด mutation จนกว่าจะยืนยัน |
| GitHub 401/403 | ตรวจบัญชี/credential ของ Git และสิทธิ์ repository; ห้ามแก้ด้วย force push |

## 15. Release checklist

- [ ] ยืนยัน Local, Git remote, Script ID, Spreadsheet ID, Deployment ID
- [ ] สำรอง source และข้อมูลก่อน pull/migration
- [ ] Pull แล้วตรวจ diff
- [ ] เพิ่ม patch version และ change history
- [ ] Syntax/security/secret checks ผ่าน
- [ ] คู่มือและ diagram อัปเดตตรง source
- [ ] Commits แยกชัดเจนและ push GitHub สำเร็จ
- [ ] ได้รับอนุมัติ Apps Script push/deploy
- [ ] ใช้ deployment ID เดิมและตรวจ Production `/exec`
- [ ] บันทึกผลทดสอบและ rollback point
