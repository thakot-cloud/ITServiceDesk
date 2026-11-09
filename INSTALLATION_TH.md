# คู่มือติดตั้ง IT Service Desk

เอกสารนี้ใช้สำหรับผู้ดูแลระบบหรือผู้พัฒนาที่ต้องการติดตั้ง/อัปเดตระบบ IT Service Desk อย่างปลอดภัย

## 1. องค์ประกอบของระบบ

ระบบประกอบด้วย:

1. Google Apps Script Project สำหรับประมวลผล Server และ Web App
2. Google Spreadsheet สำหรับเก็บข้อมูลระบบ
3. Google Drive Folder สำหรับไฟล์แนบ ไฟล์สำรอง และทรัพยากรของระบบ
4. Web App URL สำหรับผู้ใช้งาน
5. GitHub Repository สำหรับเก็บ source code และประวัติการเปลี่ยนแปลง
6. LINE/Cloudflare Gateway (ถ้าเปิดใช้งานช่องทาง LINE)

โปรเจกต์ปัจจุบัน:

- GitHub: `https://github.com/thakot-cloud/ITServiceDesk`
- Apps Script ID: `1drKyOpXXRBkf9s9uFXZi6h3PoSy1Ud-SfqMkx8xPyDNNl1XWxcGiVUF7`
- Spreadsheet: `1i-yE0Lg2gILkLENEpk8t1Q9OSVlGpOoximunZwbxF4c`
- Web App: ใช้ URL `/exec` เดิมของ deployment production

ห้ามใส่รหัสผ่าน, HMAC key, token หรือค่า Script Properties ที่เป็นความลับลงใน GitHub

## 2. สิทธิ์ที่ต้องมี

บัญชีผู้ติดตั้งต้องมีสิทธิ์:

- แก้ไข Apps Script Project
- แก้ไข Spreadsheet ฐานข้อมูล
- เข้าถึง Google Drive Folder ของโครงการ
- สร้าง/แก้ไข deployment ของ Web App
- Push repository GitHub

Web App ตั้งค่าใน `appsscript.json` เป็น `USER_DEPLOYING` และ `ANYONE_ANONYMOUS` ตามระบบปัจจุบัน ผู้ใช้งานจึงเข้าหน้า Web App ได้โดยไม่ต้องมีสิทธิ์แก้ไข Apps Script แต่การทำงานฝั่ง Google จะใช้สิทธิ์ของผู้ deploy

## 3. เตรียมเครื่องพัฒนา

ติดตั้ง:

- Node.js LTS
- clasp: `npm install -g @google/clasp`
- Git
- VSCode หรือ Antigravity

เข้าสู่ระบบ clasp:

```bash
clasp login
```

ตรวจว่าโฟลเดอร์ local เป็นโปรเจกต์ที่ถูกต้อง:

```bash
cd /Users/chaloem/Apps_Script/ITSD_CLASP_STAGING/SERVER_2026
cat .clasp.json
```

ค่า `scriptId` ต้องตรงกับ Apps Script Project ของโครงการ ห้ามเปลี่ยนไปยังโปรเจกต์อื่นโดยไม่สำรองและตรวจสอบก่อน

## 4. ตรวจ Spreadsheet และ Drive

เปิด Spreadsheet และตรวจ:

1. เป็นไฟล์ของโครงการเดียวกัน
2. ผู้ deploy มีสิทธิ์ Editor
3. ไม่มีการเปลี่ยนชื่อ sheet หลักโดยพลการ
4. ข้อมูลสำคัญและ ticket ID เดิมยังอยู่ครบ

เปิด Drive Folder และตรวจ:

1. ผู้ deploy มีสิทธิ์ Editor
2. โฟลเดอร์ยังอยู่ในบัญชีที่ระบบใช้
3. ไม่มีการลบไฟล์แนบหรือไฟล์ backup เดิม

## 5. ตั้งค่า Script Properties

ไปที่ Apps Script → Project Settings → Script Properties แล้วตั้งค่าอย่างน้อย:

| Property | ความหมาย |
|---|---|
| `SPREADSHEET_ID` | ID ของ Spreadsheet ฐานข้อมูล |
| `ITSD_TIMEZONE` | แนะนำ `Asia/Bangkok` |
| `ITSD_PROJECT_ID` | รหัสโครงการภาษาอังกฤษที่ไม่ซ้ำ |
| `ITSD_ENVIRONMENT` | ใช้ `PRODUCTION` สำหรับ production |
| `ITSD_LINE_GATEWAY_HMAC_KEY` | กุญแจตรวจสอบ Gateway ถ้าใช้ LINE |
| `ITSD_BRIDGE_KEY` | ค่า legacy bridge ถ้ายังจำเป็นต้องใช้ |

ห้าม commit ค่าเหล่านี้ลง GitHub

## 6. ตั้งค่าครั้งแรกของฐานข้อมูล

หลังตรวจ Spreadsheet และ Properties แล้ว ให้เปิด Apps Script Editor และเรียก `setupSystem_()` ตามสิทธิ์ที่เหมาะสม ระบบจะตรวจ/สร้าง sheet และโครงสร้างที่จำเป็น

หลังติดตั้งให้ตรวจ:

- มี sheet ระบบครบ
- มีบัญชีผู้ดูแลระบบ
- Login ได้
- สร้าง ticket ทดสอบได้
- ประวัติ ticket ถูกบันทึก
- ไฟล์แนบถูกเก็บใน Drive ตามโครงสร้าง

อย่าเรียกฟังก์ชันติดตั้งซ้ำบนฐานข้อมูล production โดยไม่สำรองข้อมูลและตรวจผลกระทบก่อน

## 7. ตรวจ source ก่อน push

```bash
git status
git diff --check
```

ตรวจว่าไม่มีไฟล์ต่อไปนี้ถูกเพิ่ม:

- `.clasp.json`
- `.claspignore` ที่มีข้อมูลเฉพาะเครื่อง
- `.pull-backups/`
- `.patch-backups/`
- `.patch-reports/`
- token, password, HMAC key หรือข้อมูลส่วนบุคคล

## 8. อัปโหลด source ไป GitHub

```bash
git add Api.js Entrypoints.js Index.html Server.js UI_Client.html UI_Styles.html UI_Templates.html appsscript.json README.md INSTALLATION_TH.md USER_GUIDE_TH.md .gitignore
git commit -m "Update IT Service Desk source and Thai documentation"
git pull --rebase origin main
git push origin main
```

ถ้า remote มีประวัติที่ local ยังไม่มี ให้ดึงและรวมอย่างระมัดระวัง ห้ามใช้ `git push --force` กับ `main` โดยไม่มีการอนุมัติ

## 9. Push และ Deploy Apps Script

ตรวจ deployment เดิมก่อน:

```bash
clasp list-deployments
```

อัปโหลด source:

```bash
clasp push --force
```

อัปเดต deployment เดิมโดยใช้ deployment ID เดิม:

```bash
clasp deploy --deploymentId <EXISTING_DEPLOYMENT_ID> -d "<VERSION_DESCRIPTION>"
```

ห้ามใช้ `clasp deploy` โดยไม่ระบุ deployment ID หากต้องการคง URL เดิม เพราะจะสร้าง URL ใหม่

## 10. ตรวจหลัง deploy

ตรวจ:

1. `clasp list-deployments` แสดง deployment ID เดิม
2. URL `/exec` เดิมตอบกลับ HTTP 200
3. หน้า Login เปิดได้
4. ผู้ใช้เดิม Login ได้
5. สร้างและค้นหา ticket ทดสอบได้
6. Dashboard และรายงานโหลดได้
7. การอัปโหลดไฟล์ทำงานได้
8. สิทธิ์ผู้ใช้และ Admin ใช้งานตาม role
9. หากใช้ LINE ให้ตรวจ Gateway, HMAC และ inbox

## 11. การ rollback

ก่อน rollback ต้องระบุ version ที่ต้องการย้อนกลับและบันทึกเหตุผล จากนั้นใช้ Apps Script version/deployment เดิมที่ผ่านการตรวจแล้ว ห้ามลบ Spreadsheet หรือ ticket history เพื่อแก้ปัญหา source

## 12. แนวทางสำรองข้อมูล

ก่อน migration หรือการแก้ schema:

1. สำรอง Spreadsheet
2. ตรวจชื่อไฟล์และเวลา backup
3. บันทึก version source และ deployment
4. ทดสอบบนสำเนาก่อน
5. เก็บ ticket ID และประวัติเดิมไว้เสมอ
