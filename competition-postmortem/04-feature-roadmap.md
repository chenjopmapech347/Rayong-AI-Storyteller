# Feature Roadmap — R-Eco-Pilot v2.0

> สิ่งที่ควรทำเพิ่มก่อน competition ครั้งหน้า · เรียงตาม impact + effort

---

## หลักการ prioritization

| Priority | Impact | Effort | When |
|---|---|---|---|
| **P0** | สูง | ต่ำ-กลาง | ทันทีหลัง postmortem (4-6 สัปดาห์) |
| **P1** | สูง | สูง | กลางเทอม (ใช้ในห้องเรียนก่อน) |
| **P2** | กลาง | กลาง | ก่อน competition รอบหน้า |
| **P3** | กลาง-ต่ำ | สูง | Nice to have |

---

## 🔴 P0 — Quick wins ที่ Judges เห็นทันที

### 1. Live IoT integration (ESP32 → Firebase Realtime DB)

**ทำไม:** บทเรียนใหญ่ของ Pitching คือ "ระบบดี แต่ judges ไม่เห็นว่าเชื่อมต่อ Hardware จริง" — ถ้าโชว์ sensor จริง ๆ ที่ส่งข้อมูลขึ้น dashboard live = **Wow moment**

**Scope:**
- ESP32 + DHT22 (อุณหภูมิ-ความชื้น) + Soil moisture
- Code Arduino IDE ส่งข้อมูลทุก 15 วินาที ขึ้น Firebase Realtime DB (path: `/iot/{teamId}`)
- Dashboard tab ใหม่: **"Live IoT Sensors"** แสดง real-time chart (Chart.js)
- เชื่อมกับ team (แสดง sensor data ในหน้า Pitching Evaluator)

**Effort:** ~3 วันทำงาน (1 วัน hardware + 1 วัน firmware + 1 วัน frontend)

**Demo value:** ⭐⭐⭐⭐⭐ — Judges เห็นทันทีว่าเป็น "IoT + AI" จริง ไม่ใช่แค่เว็บ

---

### 2. QR code generator สำหรับแต่ละทีม

**ทำไม:** Judges ที่ผ่านบูธควร scan QR แล้วดู Portfolio ของทีมได้ทันที (มือถือเดียว) — แทนที่จะต้องบอก URL ยาว ๆ

**Scope:**
- Library `qrcode.react` (ฟรี, light)
- ใน R6 Portfolio: แต่ละ team card มี QR ที่ link ไป public portfolio
- Print-friendly version สำหรับใช้ในบูธ

**Effort:** ~4 ชั่วโมง

**Demo value:** ⭐⭐⭐⭐ — เพิ่ม professionalism

---

### 3. Real-time WebSocket notifications

**ทำไม:** ถ้าครูประเมินทีม นักเรียนเห็นทันทีในมือถือ → "Live Feedback"

**Scope:**
- Subscribe team scores + flags ใน student dashboard
- Toast notification เมื่อมีคะแนนใหม่
- Sound effect เบา ๆ (optional)

**Effort:** ~1 วัน (ใช้ Firestore subscribe ที่มีอยู่แล้ว)

**Demo value:** ⭐⭐⭐ — Engagement สูง

---

### 4. Pitching timer with stage cues

**ทำไม:** เพื่อแก้ปัญหาที่เพิ่งผ่าน (พูดยาวเกิน) — built-in timer ที่เตือนสมาชิกในทีม

**Scope:**
- Timer tab ใหม่ใน Help section
- ตั้ง: 7 min total · แบ่ง 5 sections (1 min Intro + 1.5 min Solution + 3 min Demo + 1 min Impact + 30s CTA)
- เสียง bell + visual flash เมื่อใกล้หมดเวลาแต่ละ section
- Full-screen mode สำหรับซ้อมบนเวที

**Effort:** ~1 วัน

**Demo value:** ⭐⭐ (ภายใน) แต่ value สูงต่อทีม

---

## 🟠 P1 — High impact, ต้องเตรียมก่อน competition

### 5. Mobile-first responsive redesign

**ทำไม:** Judges ส่วนใหญ่ใช้มือถือ — ปัจจุบัน Pitching Evaluator + Reports ยังไม่ optimize มือถือ

**Scope:**
- Tailwind breakpoints: `sm` / `md` / `lg`
- 5×5 Matrix: collapse เป็น cards บน mobile
- Reports: vertical scroll cards แทน wide tables
- Branding preset: bottom sheet (เหมือน iOS)

**Effort:** ~5 วัน

**Demo value:** ⭐⭐⭐⭐ — Judges สามารถ scan QR จากมือถือดูได้ทันที

---

### 6. AI Chat assistant (Claude in-app)

**ทำไม:** "Talk to your project" — judges ถาม chat bot ว่าทีมนี้ใช้ AI อย่างไร → AI ดึงข้อมูลจาก team's submissions + audit logs ตอบกลับ

**Scope:**
- Floating chat button มุมขวาล่าง
- Backend: Cloudflare Worker proxy → Claude API
- Context: team's gateway data + audit logs + scores
- ตัวอย่าง prompt: "Tell me about Team Cafe Chai Le's AI ethics"

**Effort:** ~7 วัน

**Demo value:** ⭐⭐⭐⭐⭐ — เด็ดมาก สำหรับ Pitch (judges interact กับโปรเจกต์โดยตรง)

---

### 7. Export to PowerPoint (Pitch deck generator)

**ทำไม:** ทีมสามารถส่งออก slide pitch deck อัตโนมัติจากข้อมูลใน Submission Gateway

**Scope:**
- Library: `pptxgenjs`
- Template: 10 slides
  - Cover · Problem · Solution · 4 Identities · Tech stack · BMC · SROI · Demo URL · Team · Thank you
- Auto-fill ข้อมูลจาก team's submissions
- 1-click download .pptx

**Effort:** ~3 วัน

**Demo value:** ⭐⭐⭐ — ช่วยทีมเตรียม Pitch ได้เร็วขึ้น 10 เท่า

---

### 8. Public showcase page (SEO-optimized)

**ทำไม:** ตอนนี้ portfolio R6 อยู่หลัง login — ถ้าทำ public page ไม่ต้อง login จะแชร์ได้ง่าย + SEO ติด Google

**Scope:**
- Route `/showcase/{teamId}` (Firebase Hosting rewrite)
- SSG (Static Site Generation) ผ่าน Cloud Function
- Open Graph tags + Twitter Card สำหรับ social sharing
- Search-friendly Thai/English content

**Effort:** ~4 วัน

**Demo value:** ⭐⭐⭐⭐ — Long-tail benefit (judges ค้นเจอใน Google ภายหลัง)

---

## 🟡 P2 — Differentiation features

### 9. Voice-to-text สำหรับ Interview recording

**ทำไม:** นักเรียนสัมภาษณ์ปราชญ์ → กดอัดเสียง → AI transcribe เป็นไทย → ลด workload

**Scope:**
- Web Speech API (built-in browser, free)
- หรือ Whisper API (paid แต่แม่นยำกว่า)
- Save transcript ใน Collector submission
- Speaker diarization (ถ้าทำได้)

**Effort:** ~3 วัน

**Demo value:** ⭐⭐⭐ — สนับสนุน workflow จริง

---

### 10. Map view สำหรับ field locations

**ทำไม:** แสดงตำแหน่งที่ทีมไปสัมภาษณ์บนแผนที่ระยอง — visualize impact ใน scale ของพื้นที่

**Scope:**
- Leaflet.js + OpenStreetMap (ฟรี)
- ดึง lat/lng จาก Collector submission
- Markers จัดกลุ่มตาม Identity (สวน/ป่า/นา/เล)
- Click marker → ดู interview snippet

**Effort:** ~3 วัน

**Demo value:** ⭐⭐⭐⭐ — Geographic visualization สวย judges ติดใจ

---

### 11. Gamification — Badges + Levels

**ทำไม:** สร้าง engagement กับนักเรียน · ครูเห็นว่าใครทำมาก

**Scope:**
- Badges อัตโนมัติ:
  - 🌱 Seed: ส่ง mission แรก
  - 🌿 Sprout: ใช้ AI Audit Log ครั้งแรก
  - 🌳 Grown: ครบ 7 ขั้นใน Gateway
  - ⭐ Star: คะแนนรวม ≥ 4.0
  - 🏆 Champion: คะแนน TPQI L4
- แสดงใน Team Setup tab
- Leaderboard (optional)

**Effort:** ~3 วัน

**Demo value:** ⭐⭐⭐ — Student-facing benefit

---

### 12. Multi-tenant SaaS (สำหรับขายต่อยอด)

**ทำไม:** ระบบพร้อม white-label แล้ว — ขั้นต่อไปคือ multi-tenant ให้แต่ละโรงเรียนมี subdomain ของตัวเอง

**Scope:**
- Tenant separation ใน Firestore (`/tenants/{tenantId}/teams/...`)
- Subdomain routing: `rayong.r-eco.app`, `phuket.r-eco.app`
- Per-tenant admin
- Billing model (free tier + paid tier)

**Effort:** ~14 วัน (project ระดับ business)

**Demo value:** ⭐⭐⭐⭐⭐ — เปลี่ยนจาก "school project" เป็น "EdTech startup"

---

## 🟢 P3 — Nice to have

### 13. AR view (Sage hologram)

ใช้ WebXR เปิดกล้องโทรศัพท์ → แสดง 3D model ของปราชญ์ + เล่นเสียงสัมภาษณ์ — Soft Power สูง แต่ scope กว้างมาก

### 14. Blockchain certificate

NFT ของ portfolio (เก็บไว้ใน IPFS) — ใช้เป็น "ใบรับรอง impact creator" ที่ verify ได้ — Buzzword สูง แต่ practical value ต่ำกว่า

### 15. AI Image generation สำหรับ portfolio

ใช้ Stable Diffusion (local) หรือ DALL-E สร้างภาพประกอบจาก wisdom text — ระวัง Cultural Appropriation

---

## 🗓️ Suggested timeline

```
Month 1 (Quick wins):
  Week 1-2: #1 Live IoT integration
  Week 3:   #2 QR codes + #4 Pitching timer
  Week 4:   #3 Real-time notifications

Month 2 (Differentiation):
  Week 5-7: #6 AI Chat assistant (signature feature!)
  Week 8:   #7 PowerPoint export

Month 3 (Polish):
  Week 9-10: #5 Mobile responsive
  Week 11:   #8 Public showcase + SEO
  Week 12:   Testing + bug fixes + ซ้อม pitching

Competition rehearsal — 2 สัปดาห์สุดท้าย:
  - Stress test (cold audience)
  - Video script recording
  - Backup plans
```

---

## 💡 Strategic recommendations

### For next competition

| ทำ | ทำไม |
|---|---|
| 🎯 เน้นเรื่อง **"AI + Hardware"** ในการ pitch | ทำให้แตกต่างจากทีมที่ใช้แต่ web/app |
| 🎯 มี **QR code → video demo** ใน slide | กันโดน timer หมด demo ไม่ทัน |
| 🎯 **Live IoT data** ที่อัปเดตจริงตอนแข่ง | "Wow moment" ที่ judges จดจำ |
| 🎯 มี **AI Chat assistant** ให้ judges ลอง | Interactive = high engagement |
| 🎯 เตรียม **Plan B (offline mode)** | Network ที่งานมักไม่เสถียร |

### For business/scale

| ทำ | ทำไม |
|---|---|
| 🚀 ติดต่อ **กรมส่งเสริมวัฒนธรรม** ให้ใช้กับโรงเรียนทั่วประเทศ | White-label พร้อมแล้ว |
| 🚀 เข้า **UNESCO Learning City** program | Soft Power story strong |
| 🚀 **ยื่น TPQI** AI Literacy curriculum | มาตรฐานเอาไปใช้ได้จริง |
| 🚀 ทำ **Open source contribution model** | ครูจังหวัดอื่น contribute presets |

---

## 📊 Effort vs Impact matrix

```
HIGH IMPACT
  ↑
  │   #1 IoT live       #6 AI Chat
  │   #4 Timer          #5 Mobile
  │                     #12 Multi-tenant
  │   #2 QR
  │   #3 Notif         #8 Showcase
  │                     #10 Map
  │
  │   #11 Badges       #7 PPT export
  │
  │   #9 Voice
  │   #13 AR · #14 NFT · #15 AI Image
  │
  └─────────────────────────────→
                              HIGH EFFORT
```

**แนะนำ:** เริ่มจาก top-left (high impact, low effort) ก่อน — #1, #2, #4 และค่อยขยับขวา

---

> **เป้าหมายรอบหน้า:** ไม่ใช่แค่ "ได้รางวัล" แต่คือ **"R-Eco-Pilot ขายต่อยอดได้จริงหลังจบ competition"**

**ผู้จัดทำ:** ครู + R-Eco-Pilot Team · 2026
