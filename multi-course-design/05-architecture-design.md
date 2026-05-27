# R-Eco-Pilot v2.0 — Multi-Course Architecture Design (DDD)

> **Design Doc** สำหรับ refactor R-Eco-Pilot จาก single-course เป็น generic **"Innovation Learning Platform"**
> ที่รองรับหลายกรอบแนวคิด (frameworks) — Green Rayong 4-Identities, Design Thinking + STEAM4Innovator, และอื่น ๆ ในอนาคต

---

## 1. Background & Motivation

### Current state (v1.0)

R-Eco-Pilot ถูกออกแบบครั้งแรกสำหรับหลักสูตรเดียว — **Green Rayong 4-Identities AI Storytellers**:
- Identity tactile hard-coded: สวน / ป่า / นา / เล
- Submission Gateway: 7 ขั้น ตายตัว
- Rubric: 5 dimensions ตายตัว
- AI Audit: prompt template ผูกกับ Local Wisdom

**ปัญหา:**
- ครูสอนหลายวิชา → ต้อง deploy หลายเว็บ
- เนื้อหา (knowledge sheets + worksheets) มีอยู่แล้วใน .pptx แต่ระบบไม่รับ
- Methodology อื่น (Design Thinking, STEAM4Innovator, Lean Startup) ใช้ R-Eco-Pilot ไม่ได้

### Target state (v2.0)

> **"Course = config"** — เนื้อหา/แบบฟอร์ม/rubric เปลี่ยนตาม course ที่ admin เลือกหรือ create

นักศึกษาเลือกพื้นที่/หัวข้อเอง → ระบบนำพา workflow ตาม methodology ที่ครูตั้งไว้ → ส่งผลงาน → ประเมิน

---

## 2. Frameworks ที่ต้องรองรับ (Initial scope)

| Framework | Stages | Worksheets | Use case |
|---|---|---|---|
| **Green Rayong 4-Identities** (v1) | 4 phases | 7 Gateway steps | AI Storytelling + Local Wisdom |
| **Design Thinking + STEAM4Innovator** (v2 new) | 5 stages × 4 S4I phases | 14 worksheets (A-N) | Innovation projects (any topic) |
| **(Future) Lean Startup** | 3 phases (Build-Measure-Learn) | Customer Discovery, MVP, Pivot | Startup pitching |
| **(Future) Project-Based Learning** | 5 stages (Plan-Do-Study-Act-Reflect) | Custom per project | ทั่วไป |

> หลักการ: framework ใหม่ = แค่เพิ่ม config ใน Firestore ไม่ต้องแก้ code

---

## 3. Data Model

### 3.1 Current schema (v1)

```
users/{userId}
teams/{teamId}              // ทุกทีมอยู่ใน single course
submissions/{submissionId}  // step ฟิกซ์: team-setup | mission-inbox | collector | gateway
team_scores/{scoreId}       // dimension ฟิกซ์ 5 ตัว
moderation_flags/{flagId}
ai_audits/{auditId}
phases/{phaseId}            // ✅ มี CRUD แล้ว (ดีอยู่)
app_config/main             // singleton
```

### 3.2 New schema (v2) — Backwards compatible

```
courses/{courseId}                    ← NEW: course definition
  ├─ name, methodology, description
  ├─ frameworks: ["DesignThinking", "STEAM4Innovator"]
  ├─ identities: [{ id, name, emoji, color }, ...]
  ├─ stages: [{ id, label, order, parent }, ...]   // เช่น Empathize, Define, Ideate, Prototype, Test
  ├─ worksheets: [{ id, label, stageId, schema }, ...]  ← C → see 06-worksheets-schema.json
  ├─ rubric: [{ dimension, weight, description }, ...]
  ├─ evaluatorWeights: { self: 10, peer: 15, teacher: 35, sage: 25, ai: 15 }
  ├─ branding: { name, logo, primaryColor, secondaryColor }
  └─ defaultPhases: [...]

teams/{teamId}
  ├─ courseId: "design-thinking-s4i"  ← NEW
  ├─ identityId: "stage-empathize"    ← refer to courses.identities (varies per course)
  ├─ scenario: { area: "คลองแถวบ้าน", problem: "ขยะลอยน้ำ" }  ← NEW: free-form context
  └─ ... (existing fields)

submissions/{submissionId}
  ├─ teamId
  ├─ courseId                          ← NEW
  ├─ worksheetId: "C-waste-map"        ← NEW (was: step hardcoded)
  ├─ data: { ... }                     ← JSON ตาม schema ของ worksheet
  └─ ... (existing fields)

team_scores/{scoreId}
  ├─ courseId                          ← NEW
  ├─ dimensionId                       ← refer to courses.rubric (was: hardcoded)
  └─ ... (existing fields)
```

### 3.3 Migration plan

| Phase | Action |
|---|---|
| **M1 — Add courses collection** | สร้าง `courses/green-rayong` ที่มี config เดิมทั้งหมด (legacy course) |
| **M2 — Add courseId to existing docs** | ทุก team/submission/score → `courseId = "green-rayong"` (default) |
| **M3 — Refactor UI** | Components อ่าน config จาก course (ถ้าไม่มี → fallback ไป hardcoded) |
| **M4 — Add new course** | สร้าง `courses/design-thinking-s4i` พร้อม worksheets schema |
| **M5 — Course picker** | UI ใหม่: admin/teacher เลือก course ตอนสร้างทีม |

> Migration ทำแบบ **non-breaking** — v1 ใช้งานต่อได้, v2 features เปิดทีละ team

---

## 4. UI Changes

### 4.1 Admin Panel — Sub-tab ใหม่: "Courses"

```
Admin Panel
├─ Management (existing)
├─ Session
├─ Moderation
├─ Branding         ← ย้ายเข้าใน Course config
├─ Settings
├─ Reports
└─ Courses          ← NEW
   ├─ List courses (Green Rayong, Design Thinking + S4I, ...)
   ├─ Create new course
   └─ Edit course (worksheets editor, rubric editor, identity editor)
```

### 4.2 Course Selector — ที่ Login/Team Setup

```
Login → Select Course → Team Setup → Worksheets ตาม course
                    ↓
               (ถ้ามี course เดียว skip step นี้)
```

### 4.3 Submission Gateway → "Worksheet Browser"

แทนที่ 7-step linear flow ด้วย **stage-based browser**:

```
Stage 1: Empathize       [✅ A · B · C · D · E ]
Stage 2: Define          [✅ F ]
Stage 3: Ideate          [⏳ G · G1 · G2 · G3 · H · I ]
Stage 4: Prototype       [⬜ J ]
Stage 5: Test            [⬜ K ]
Plan & Reflect           [⬜ L · M · N ]
```

แต่ละ worksheet → กดเข้า → render form ตาม schema → save to Firestore

### 4.4 Rubric & Reports

- Reports R1-R6 ใช้ rubric ของ course ที่เลือก (column ใน table ไม่ตายตัว)
- Pitching Evaluator 5×5 Matrix → "N×M Matrix" (N evaluators × M dimensions ตาม course)

---

## 5. Worksheet Schema (Generic Form Builder)

Worksheet เก็บใน Firestore ที่ `courses/{courseId}/worksheets/{worksheetId}`

```json
{
  "id": "C-waste-map",
  "label": "Waste Situation Map",
  "labelTH": "แผนที่ขยะในชุมชน",
  "stageId": "stage-empathize",
  "icon": "🗺️",
  "instruction": "เดินสำรวจพื้นที่ + วาดแผนที่ว่าขยะเดินทางไปไหนบ้าง",
  "fields": [
    { "id": "team", "type": "text", "label": "ชื่อทีม", "required": true },
    { "id": "location", "type": "text", "label": "สถานที่" },
    { "id": "date", "type": "date", "label": "วันที่" },
    { "id": "map_image", "type": "image", "label": "ภาพแผนที่ที่วาด", "maxSize": 5 },
    { "id": "waste_types", "type": "textarea", "label": "ประเภทขยะที่พบ", "rows": 5 },
    {
      "id": "people_involved",
      "type": "list",
      "label": "ผู้คนที่เกี่ยวข้อง",
      "itemSchema": [
        { "id": "role", "type": "select", "options": ["คนทิ้ง", "คนเก็บ", "คนจัดการ"] },
        { "id": "note", "type": "text" }
      ]
    },
    { "id": "insight", "type": "textarea", "label": "ปัญหาหรือเรื่องน่าสนใจที่พบ" }
  ],
  "aiAuditEnabled": true,
  "ethicsAuditEnabled": true
}
```

**Field types ที่รองรับ:**
- `text`, `textarea`, `number`, `date`, `select`, `multiselect`, `radio`, `checkbox`
- `image` (upload to Firebase Storage)
- `drawing` (canvas-based, save as PNG)
- `list` (repeating group of fields)
- `table` (rows × columns input)
- `signature` (digital sign by sage/teacher)
- `audio` (record interview)
- `markdown` (instructional text — read-only display)

> Schema ตัวเต็มของ 14 worksheets ดูใน `06-worksheets-schema.json`

---

## 6. Backwards Compatibility

### Strategy: "Course-aware code, course-less data falls back to default"

```js
// API helpers
function getCourse(courseId) {
  return courseId
    ? coursesCache[courseId]
    : LEGACY_GREEN_RAYONG_COURSE;  // hardcoded fallback
}

// In components
const course = useCourse(team?.courseId);
const dimensions = course.rubric.map(r => r.dimension);
// ↑ ถ้า team ไม่มี courseId → ใช้ Green Rayong rubric เดิม
```

**ผลลัพธ์:** ทีมเดิม (v1) ใช้งานได้ปกติ ไม่ต้อง migrate

---

## 7. API/Function Changes (api.js)

### Functions to add

```js
// Course CRUD
export async function createCourse(data);
export async function updateCourse(id, patch);
export async function deleteCourse(id);
export function subscribeToCourses(callback);
export async function cloneCourse(sourceId, newId);  // เผื่ออยาก copy แก้

// Worksheet CRUD (per course)
export async function saveWorksheetSchema(courseId, worksheetId, schema);
export function subscribeToWorksheets(courseId, callback);

// Submission (generic per worksheet)
export async function saveWorksheetData(teamId, worksheetId, data);
export function subscribeToTeamWorksheets(teamId, callback);

// Course-aware helpers
export async function getCourseConfig(courseId);
export function getEffectiveRubric(team, course);
export function getEffectiveIdentities(team, course);
```

### Functions to refactor

```js
saveSubmission()      → ต้องรับ courseId + worksheetId แทน step
saveTeamScores()      → ต้องรับ dimensionId (string) แทน enum
runEthicsAudit()      → scan ทุก fields ของทุก worksheet
runAiAuditOnTeam()    → aggregate ข้อมูลจาก worksheets แทน step ฟิกซ์
```

---

## 8. Frontend Component Changes (App.jsx)

### New components needed

```jsx
<CourseSelector />              // Dropdown ตอน Team Setup
<WorksheetBrowser />            // แทน Submission Gateway แบบ 7 steps
<GenericForm schema={...} />    // Renderer ของ schema → React form
<DimensionEditor />             // ตอน admin แก้ rubric
<IdentityEditor />              // ตอน admin แก้ identity ของ course
```

### Existing components to modify

```jsx
<PitchingEvaluator />     → ใช้ course.rubric แทน hardcoded SCORE_DIMENSIONS
<EvalMatrix />            → ใช้ course.evaluatorWeights
<ReportR1-R6 />           → table columns dynamic
<AiAuditLogbook />        → payload จาก course-aware aggregation
```

---

## 9. Implementation Phases (Recommended)

| Phase | Scope | Estimate |
|---|---|---|
| **P1 — Foundation** | สร้าง `courses` collection + `LEGACY_GREEN_RAYONG_COURSE` constant + Course context provider | 1 วัน |
| **P2 — Course Admin UI** | Admin → Courses sub-tab (List + Create + Edit + Delete) | 1 วัน |
| **P3 — Worksheet Schema editor** | UI สำหรับแก้ schema ของแต่ละ worksheet (drag-drop fields) | 2 วัน |
| **P4 — Generic Form renderer** | `<GenericForm schema={...} value={...} onChange={...} />` รองรับทุก field type | 2 วัน |
| **P5 — Migrate Green Rayong** | แปลง 7 Gateway steps เดิม เป็น worksheets ใน `courses/green-rayong` | 1 วัน |
| **P6 — Seed Design Thinking + S4I course** | สร้าง 14 worksheets (A-N) จาก 06-worksheets-schema.json | 1 วัน |
| **P7 — Course-aware Rubric/Matrix** | Refactor Pitching Evaluator + Reports ให้อ่าน rubric จาก course | 2 วัน |
| **P8 — Migration testing + bugfix** | Test ทุกหลักสูตรกับทุก role | 2 วัน |

**Total: ~12 วัน** (full-time) หรือ ~24 วัน (part-time)

---

## 10. Risks & Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Migration ทำ legacy data หาย | 🔴 สูง (เคยเกิดแล้ว!) | Backup ก่อน + ใช้ feature flag + dry-run |
| Schema เปลี่ยน → break Firestore queries | 🟠 ปานกลาง | เพิ่ม fields แบบ optional · ไม่ลบของเก่า |
| Worksheet schema ซับซ้อน → form renderer มี bug | 🟠 ปานกลาง | เริ่มจาก field types พื้นฐานก่อน · ทยอยเพิ่ม |
| ครูสร้าง course ซับซ้อน → load ช้า | 🟡 ต่ำ | Cache + pagination + virtualize long lists |
| 2 courses ใช้ teamId เดียวกัน | 🟠 ปานกลาง | Add unique constraint `(courseId, teamName)` |

---

## 11. Non-goals (v2.0 ไม่ทำ)

- ❌ Multi-tenant (แต่ละโรงเรียนแยก subdomain) — ดูใน 04-feature-roadmap.md P2 #12
- ❌ Marketplace ของ courses (share ระหว่างโรงเรียน) — v3.0
- ❌ Course inheritance (สืบทอด config) — v3.0
- ❌ Internationalization beyond TH/EN (Lao, Burmese, etc.)
- ❌ Mobile native app (PWA เพียงพอ)

---

## 12. Open Questions (ขอครูช่วยตัดสิน)

1. **Course selection UX** — admin set "default course" หรือให้ student เลือกตอนเข้า?
2. **Cross-course teams** — ทีมเดียว join หลาย course ได้ไหม? (ผมแนะนำ: ไม่ได้ → keep simple)
3. **Worksheet versioning** — ถ้า admin แก้ schema กลางเทอม จะ migrate ข้อมูลเก่ายังไง?
4. **Sage assignment** — ปราชญ์คนเดียวประเมินได้หลาย course ไหม? (ผมแนะนำ: ได้ แต่ filter ตาม course ตอนแสดง)
5. **Phase numbering** — Design Thinking 5 stages vs Green Rayong 4 phases → unify เป็น "stages" generic ดีไหม?

---

## 13. Success Criteria

✅ Admin สามารถสร้าง course ใหม่ได้โดยไม่ต้องเขียน code
✅ ทีมเดิม (Green Rayong) ใช้งานได้ไม่มี breaking change
✅ Design Thinking + S4I course มี 14 worksheets ใช้งานได้จริง
✅ Pitching Evaluator + Reports render ตาม rubric ของ course
✅ Build size เพิ่มไม่เกิน 30 KB (เพราะ schema-driven แทน hardcoded)
✅ Migration script ทำงานบน production data จริงโดยไม่ลบของเดิม

---

## 14. References

- `06-worksheets-schema.json` — JSON schema เต็มของ 14 worksheets (A-N) จาก STEAM4Innovator
- `04-feature-roadmap.md` — Multi-tenant SaaS roadmap (ขั้นถัดจาก multi-course)
- 22-slide pptx ต้นฉบับ — สนามการเรียนรู้นวัตกรรมกำจัดขยะในชุมชน

**ผู้จัดทำ:** ครู + R-Eco-Pilot Team · 2026
**Status:** Design phase · รอ approval ก่อน implementation
