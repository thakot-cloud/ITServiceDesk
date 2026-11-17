# 🎨 สเปกแม่แบบชุดสีระบบ ITSD (Style 5 — Orange Energy)

อ้างอิงจากแม่แบบ **10 สไตล์หลัก Color Palette / Color Theme สำหรับ Web App (สไตล์ที่ 5 Orange Energy: กระตุ้น สนุก มีพลัง)**
- **Mood**: `Active • Friendly • Exciting`
- **เหมาะกับ**: Web App, Dashboard, Service Desk, Startup, Event Management

---

## 1. รหัสสีหลักของชุดสีที่ 5 (Orange Energy Color Palette)

| บทบาทสี (Color Role) | ชื่อสี (Token) | Hex Code | คำอธิบายและการใช้งานในระบบ |
| :--- | :--- | :---: | :--- |
| **Primary Brand / Action** | Energy Orange | `#FA7737` | สีปุ่มหลัก (CTA Buttons), สีไฮไลต์เมนูที่เลือก, สีไอคอนสำคัญ, สีแถบความคืบหน้า |
| **Warm Amber / Accent** | Golden Amber | `#FFC92E` | สีการ์ดงานกำลังดำเนินการ, ข้อความสถิติสำคัญ, จุดเด่นแจ้งเตือน |
| **Soft Peach / Coral** | Warm Coral | `#FD9E76` | สีการ์ดรับเรื่องใหม่, แบดจ์สถานะรอง, พื้นผิวที่ต้องการความอบอุ่น |
| **High Contrast Base** | Midnight Navy | `#051344` | สีแถบเมนูข้าง (Sidebar), สีหัวข้อหลัก (Headings), สีตัวหนังสือบนการ์ดสีสว่าง |
| **Pro Analytics Card** | Deep Charcoal Navy | `#0A1C54` | สีการ์ดอัตราการปิดงาน (% Closure Rate) มอบความหรูหรา น่าเชื่อถือ |
| **Harmonious Success** | Fresh Mint Teal | `#55E07E` / `#10B981` | สีการ์ดปิดงานสำเร็จ (Completed / Resolved) กลมกลืนกับโทนส้ม-ทอง |
| **Muted Slate Grey** | Slate Grey | `#7E879B` / `#8E929B` | สีตัวหนังสือรอง (Subtext), เส้นขอบรอง (Borders), Placeholder |
| **Warm Soft Canvas** | Warm Cream Canvas | `#FBF8F5` | สีพื้นหลังระบบทั้งเว็บ สบายตา ไม่สว่างจ้าเกินไป เข้ากับโทนส้ม-น้ำเงิน |
| **Card Surface** | Pure Clean White | `#FFFFFF` | พื้นหลังการ์ดเนื้อหา ขอบมน 14–16px เงาอบอุ่นนุ่มนวล |

---

## 2. การจับคู่สีการ์ดสถิติหน้าแรก (Dashboard KPI Cards)

| การ์ด | หมวดหมู่ | โทนสีพื้นหลัง | โทนสีตัวหนังสือ / ไอคอน | สไตล์ Dark Mode |
| :--- | :--- | :---: | :---: | :---: |
| **Card 1** | เรื่องที่แจ้งทั้งหมด (Total) | `#FA7737` (Energy Orange) | `#051344` (Midnight Navy) | `color-mix(#FA7737 40%, #051344)` ขอบส้มเรืองแสง |
| **Card 2** | รับเรื่องแล้ว (Intake) | `#FD9E76` (Warm Coral) | `#051344` (Midnight Navy) | `color-mix(#FD9E76 40%, #051344)` ขอบพีช |
| **Card 3** | กำลังดำเนินการ (In Progress) | `#FFC92E` (Golden Amber) | `#051344` (Midnight Navy) | `color-mix(#FFC92E 40%, #051344)` ขอบทอง |
| **Card 4** | ปิดงานแล้ว (Closed) | `#55E07E` (Fresh Mint) | `#051344` (Midnight Navy) | `color-mix(#55E07E 40%, #051344)` ขอบเขียวมิ้นต์ |
| **Card 5** | อัตราการปิดงาน (Closure Rate) | `#051344` (Midnight Navy) | ตัวเลข `#FFC92E` / ไอคอน `#FA7737` | `#051344` ขอบส้ม `#FA7737` ตัวเลขทอง |

---

## 3. มาตรฐานการออกแบบส่วนประกอบ (UI Elements Standard)

1. **ปุ่มกดหลัก (Primary CTA Buttons)**:
   - พื้นหลัง: `linear-gradient(135deg, #FA7737 0%, #F97316 100%)`
   - เมื่อชี้เมาส์ (Hover): `linear-gradient(135deg, #EA580C 0%, #FA7737 100%)` ยกตัวขึ้น 1px พร้อมเงา `0 6px 18px rgba(250, 119, 55, 0.45)`
2. **แถบเมนูข้าง (Sidebar Navigation)**:
   - พื้นหลัง Midnight Navy `#051344` สไตล์ Pro Enterprise
   - เมนูที่กำลังใช้งาน (Active): ไฮไลต์ด้วย Energy Orange `#FA7737` ตัวหนังสือสีขาวคมชัด
   - เมนูเมื่อชี้เมาส์ (Hover): สีพื้นหลังโปร่งแสงส้ม `rgba(250, 119, 55, 0.14)` และตัวหนังสือสีทอง `#FFC92E`
3. **ช่องป้อนข้อมูล (Input Fields & Focus)**:
   - เมื่อโฟกัส (Focus Ring): ขอบสีส้มสดใส `#FA7737` ความหนา 2px พร้อมแสงเงา `0 0 0 3px rgba(250, 119, 55, 0.18)`
4. **หน้าจอ Login**:
   - กล่องโลโก้: ไล่เฉดสีส้ม-ทอง `linear-gradient(135deg, #FA7737 0%, #FFC92E 100%)`
   - ไอคอนผู้ใช้ `[User]` และรหัสผ่าน `[Key]` สี Energy Orange `#FA7737`
   - แบดจ์เลขเวอร์ชัน: พื้นหลังสีส้มอ่อน `rgba(250, 119, 55, 0.12)` ตัวหนังสือสีส้มเข้ม `#EA580C`
