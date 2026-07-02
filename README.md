# 🌿 R-Eco Pilot — ระบบจัดการเรียนรู้แบบโครงงาน

แพลตฟอร์มสนับสนุนการสอนแบบโครงงาน (Project-Based Learning) สำหรับวิชา Design Thinking + STEAM4Innovator และหลักสูตรสิ่งแวดล้อมอื่น ๆ รองรับผู้ใช้ 4 บทบาท: **Student · Teacher · Sage · Admin**

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 (Rolldown) |
| Styling | CSS Variables + Framer Motion |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Auth (custom password flow) |
| Hosting | Firebase Hosting |
| Icons | Lucide React |

---

## 🚀 Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173

# 3. Build for production
npx vite build --outDir dist_new

# 4. Deploy to Firebase
cp dist_new/assets/index-*.js dist/assets/
cp dist_new/index.html dist/index.html
firebase deploy --only hosting
```

> **หมายเหตุ:** `dist/` อาจมีปัญหาสิทธิ์ใน sandbox ให้ build ไป folder ใหม่ (`distN`) แล้ว `cp` ทับ

---

## 🔑 Account Roles

| Role | สิทธิ์ |
|---|---|
| **student** | ทำ Worksheet · ส่ง Gateway · ประเมินตนเอง/เพื่อน |
| **teacher** | ตรวจ Worksheet · ให้คะแนน Scoring Matrix · จัดการทีม |
| **sage** | ดู Worksheet ทุกทีม · ให้ feedback |
| **admin** | จัดการ Users/Teams/Courses · ตั้งค่าระบบทั้งหมด |

---

## 📁 Project Structure

```
src/
├── App.jsx              # Main app (all tabs, state, logic)
├── Modal.jsx            # Central modal component (reusable)
├── LoginPage.jsx        # Login screen
├── api.js               # Firestore CRUD functions
├── courseSeeds.js       # Course definitions + Rubric + Mission config
├── constants/
│   ├── i18n.js          # Thai/English translations
│   ├── branding.js      # Color themes
│   └── ethics.js        # Ethics categories
└── components/
    ├── StatBox.jsx
    ├── RadarChart.jsx
    └── GenericForm.jsx
```

---

## 🗄️ Firestore Collections

| Collection | ใช้สำหรับ |
|---|---|
| `users` | ข้อมูลผู้ใช้ (name, username, password, role, team_id) |
| `teams` | ข้อมูลทีม (name, photo, leader_id, teacher_id, courseIds) |
| `courses` | Course config ที่ Admin override จาก seed |
| `worksheet_submissions` | การส่งงาน worksheet ของแต่ละทีม |
| `worksheet_scores` | คะแนน worksheet จาก teacher/sage |
| `team_scores` | คะแนนรวมแต่ละ dimension ต่อทีม |
| `good_prompts` | AI prompt ที่บันทึกไว้ |

---

## 🏗️ Key Patterns

### Course-Aware Components
`currentCourse` อ่านจาก Firestore (ถ้ามี) หรือ fallback ไป `courseSeeds.js`
```js
// ดูว่า course ใช้ worksheet หรือไม่
const isWorksheetCourse = currentCourse?.worksheets?.length > 0;

// Rubric จาก course ปัจจุบัน
const rubric = currentCourse?.rubric || [];

// Mission fields จาก course ปัจจุบัน
const missionConfig = currentCourse?.missionConfig;
```

### Central Modal
```jsx
import Modal from './Modal';

<Modal title="หัวข้อ" subtitle="คำอธิบาย" onClose={() => setShow(false)}>
  {/* เนื้อหา */}
</Modal>
```
Props: `title`, `subtitle`, `width`, `maxHeight`, `zIndex`, `noClose`, `onClose`

### Change Own Password
```js
import { changeOwnPassword } from './api';
await changeOwnPassword(userId, currentPassword, newPassword);
```

---

## 📋 Courses

### Design Thinking + STEAM4Innovator (`design-thinking-s4i`)
- 19 Worksheets (WS-A → WS-Note)
- 5 Rubric dimensions × 29 sub-criteria
- Mission Inbox fields: scenario, targetUser, problemStatement, HMW, STEAM focus

### Green Rayong (`green-rayong`) — Legacy
- Gateway-based submission (ไม่ใช้ worksheet)
- 5 Rubric dimensions แบบเดิม

---

## 🔧 Build Notes

```bash
# Build (หลีกเลี่ยง EPERM ด้วยการใช้ folder ใหม่)
npx vite build --outDir dist9

# Copy แล้ว deploy
cp dist9/assets/index-*.js dist/assets/
cp dist9/index.html dist/index.html
firebase deploy --only hosting
```
