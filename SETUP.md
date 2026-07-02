# 📖 คู่มือการใช้งาน R-Eco Pilot

ระบบจัดการเรียนรู้แบบโครงงาน สำหรับวิชา Design Thinking + STEAM4Innovator

---

## 👤 บทบาทผู้ใช้และสิทธิ์การเข้าถึง

| บทบาท | Tab ที่เข้าได้ | สิทธิ์พิเศษ |
|---|---|---|
| **Student** | Dashboard · Worksheets · รับโจทย์ · Evaluation Hub | ส่ง worksheet · ประเมินตนเอง/เพื่อน |
| **Teacher** | Dashboard · Worksheets · Scoring Matrix · AI Prompt | ให้คะแนน worksheet · จัดการทีม |
| **Sage** | Dashboard · Worksheets (ทุกทีม) · Scoring Matrix | ดูและให้ feedback ทุกทีม |
| **Admin** | ทุก Tab + Admin Panel | จัดการ Users · Teams · Courses · Branding |

---

## 🔐 การเข้าสู่ระบบ

1. เปิดหน้าเว็บ → คลิก **เข้าสู่ระบบ**
2. ใส่ **Username** และ **Password**
3. คลิก **Login**

### เปลี่ยนรหัสผ่านตัวเอง
หลัง login แล้ว คลิกปุ่ม **🔒 รหัสผ่าน** ในแถบด้านบน
- ใส่รหัสผ่านเดิม
- ใส่รหัสผ่านใหม่ (ต้องมีอย่างน้อย 4 ตัวอักษร)
- ยืนยันรหัสผ่านใหม่อีกครั้ง
- คลิก **บันทึก**

> หากต้องการ reset รหัสผ่านของนักเรียน ให้ Admin แก้ผ่านหน้า User Management

---

## 📚 สำหรับนักเรียน (Student)

### 1. แท็บ Dashboard
ดูสถิติรวมของโครงงาน: จำนวนทีม, งานที่ส่งแล้ว, งานที่รอ, AI Prompts

### 2. แท็บ Worksheets — ทำใบงาน
1. เลือก **ใบงาน** จากรายการทางซ้าย
2. กรอกข้อมูลในฟอร์ม
3. คลิก **บันทึกแบบร่าง** เพื่อเซฟชั่วคราว
4. เมื่อพร้อม → คลิก **ยืนยันการส่งงาน** (ส่งได้ครั้งเดียว ไม่สามารถแก้ไขได้)
5. ดูคะแนนที่ครูให้ที่ส่วน **คะแนนจากครู/Sage** ด้านล่างฟอร์ม

**แถบด้านซ้ายแสดง:**
- 🟡 ยังไม่ได้ทำ
- 🔵 บันทึกแบบร่าง
- 🟢 ส่งแล้ว (ล็อก)

### 3. แท็บ รับโจทย์ (Mission Inbox)
กำหนดโจทย์นวัตกรรมของทีม:
1. เลือก **พื้นที่/Scenario** ที่จะทำโครงงาน
2. ระบุ **กลุ่มเป้าหมาย** (Target User)
3. อธิบาย **ปัญหาที่ต้องการแก้**
4. เขียน **HMW Statement** (How Might We...)
5. เลือก **สาขา STEAM** ที่จะนำมาใช้
6. คลิก **ส่งโจทย์** → รอครูอนุมัติ

**สถานะโจทย์:**
- ⏳ **Pending** — รอครูพิจารณา
- ✅ **Approved** — ครูอนุมัติแล้ว
- ❌ **Rejected** — ครูส่งกลับให้แก้ไข (ดู feedback แล้วแก้ใหม่)

### 4. แท็บ Evaluation Hub — ประเมิน

#### Self Assessment (ประเมินตนเอง)
1. คลิก **ทำแบบประเมินตนเอง**
2. เลือกระดับคะแนน 1–5 ในแต่ละมิติตาม Rubric ของวิชา
   - **5 — ดีเยี่ยม**
   - **4 — ดีมาก**
   - **3 — ปานกลาง**
   - **2 — พอใช้**
   - **1 — ต้องปรับปรุง**
3. คลิก **ส่งแบบประเมินตนเอง** (ต้องตอบครบทุกมิติ)

#### Peer Assessment (ประเมินเพื่อนร่วมทีม)
1. คลิก **ทำแบบประเมินเพื่อน**
2. เลือกระดับคะแนนให้สมาชิกแต่ละคนในทีม
3. การประเมินเป็น **Anonymous** — เพื่อนไม่รู้ว่าใครให้คะแนน

---

## 🏫 สำหรับครู (Teacher)

### แท็บ Worksheets — ตรวจงาน
1. เลือก **ทีม** จาก dropdown ด้านบน
2. เลือก **ใบงาน** ที่ต้องการตรวจ
3. ดูงานที่นักเรียนส่ง (แสดงสีเขียวเมื่อส่งแล้ว)
4. **ให้คะแนน:** เลื่อนลงไปที่ส่วน "ให้คะแนน" → ใส่คะแนน → คลิก **บันทึกคะแนน**

### แท็บ Scoring Matrix — ประเมินรายมิติ
ให้คะแนนทีมตาม Rubric ของวิชา:
1. เลือก **ทีม**
2. คลิกมิติที่ต้องการดูรายละเอียด (ขยาย/ย่อ)
3. เลือกระดับ **L1–L5** สำหรับแต่ละมิติ
4. คลิก **บันทึกคะแนน**

### จัดการทีม
คลิกที่ **การ์ดทีม** ใน Team Management เพื่อเปิด modal แก้ไข:
- เพิ่ม/ลบสมาชิก
- เปลี่ยนหัวหน้าทีม / ครูประจำทีม
- อัปเดตรูปโปรไฟล์ทีม

---

## 🧙 สำหรับ Sage

- เข้าดู Worksheet ของ **ทุกทีม** ได้ผ่าน dropdown
- ให้ feedback และคะแนน Scoring Matrix ได้เช่นเดียวกับครู
- ไม่มีสิทธิ์แก้ไข User/Team/Course

---

## ⚙️ สำหรับ Admin

### User Management
- เพิ่ม/แก้ไข/ลบ User
- กำหนด Role: student / teacher / sage / admin
- Reset รหัสผ่านให้ผู้ใช้ (แก้ password ใน form)
- กำหนดทีมให้นักเรียน

### Team Management
- สร้าง/แก้ไข/ลบทีม
- กำหนดวิชา (courseIds) ที่ทีมนั้นลงทะเบียน
- คลิกที่การ์ดทีมเพื่อแก้ไขสมาชิก

### Course Management
- ดูรายชื่อวิชาที่มีในระบบ
- **Override** — บันทึก config ของวิชาลง Firestore (ใช้หลังแก้ใน courseSeeds.js)
- กำหนด Rubric, Mission Config, Worksheets ของแต่ละวิชา

### System Settings
- เปลี่ยนชื่อระบบ / ชื่อสถาบัน
- เปลี่ยนธีมสี (Color Branding)
- เลือกภาษา TH/EN

---

## 🎨 Rubric และ Scoring

### วิชา Design Thinking + STEAM4Innovator
Rubric 5 มิติ รวม 29 เกณฑ์ย่อย:

| มิติ | น้ำหนัก | เกณฑ์ย่อย |
|---|---|---|
| D1: กระบวนการ Design Thinking | 25% | 6 เกณฑ์ |
| D2: คุณภาพนวัตกรรม | 25% | 6 เกณฑ์ |
| D3: ผลกระทบต่อชุมชน | 20% | 6 เกณฑ์ |
| D4: การบูรณาการ STEAM | 15% | 6 เกณฑ์ |
| D5: การนำเสนอและสะท้อนคิด | 15% | 5 เกณฑ์ |

ระดับคะแนน: **L1** (ต้องปรับปรุง) → **L5** (ดีเยี่ยม)

---

## 🛠️ Developer — Build & Deploy

```bash
# Dev server
npm run dev

# Build (ใช้ folder ใหม่เพื่อหลีกเลี่ยง EPERM)
npx vite build --outDir dist_new

# Deploy
cp dist_new/assets/index-*.js dist/assets/
cp dist_new/index.html dist/index.html
firebase deploy --only hosting
```

### เพิ่มหลักสูตรใหม่
1. แก้ไข `src/courseSeeds.js` — เพิ่ม object ใน `COURSE_SEEDS`
2. กำหนด: `id`, `name`, `worksheets[]`, `rubric[]`, `missionConfig`
3. Admin → Courses → Override เพื่อ sync ลง Firestore

### เพิ่ม Modal ใหม่
```jsx
import Modal from './Modal';

{showSomething && (
  <Modal
    title="หัวข้อ Modal"
    subtitle="คำอธิบาย (ถ้ามี)"
    onClose={() => setShowSomething(false)}
    noClose={isSaving}  // ล็อกตอนกำลังบันทึก
  >
    {/* เนื้อหา */}
  </Modal>
)}
```

---

## ❓ FAQ

**Q: นักเรียนลืมรหัสผ่าน?**
A: Admin → User Management → แก้ไข user → ใส่ password ใหม่

**Q: เพิ่มนักเรียนเข้าทีมยังไง?**
A: คลิกการ์ดทีม → เช็คชื่อนักเรียน → บันทึก (หรือ Admin → Users → กำหนด teamId)

**Q: ใบงานส่งแล้วแก้ได้ไหม?**
A: ไม่ได้ — ใบงานที่ Submit แล้วจะล็อก ต้องให้ Admin ลบ submission ใน Firestore แล้วให้ส่งใหม่

**Q: จะเพิ่มใบงานใหม่ในวิชาได้ยังไง?**
A: แก้ `src/courseSeeds.js` → array `worksheets` → เพิ่ม object worksheet → Admin Override Course

**Q: Rubric ที่เห็นใน Scoring Matrix ไม่ตรงกับวิชา?**
A: Admin → Courses → คลิก Override เพื่อ sync rubric ใหม่จาก courseSeeds ลง Firestore
