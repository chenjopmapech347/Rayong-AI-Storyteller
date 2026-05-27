# After-Action Review (AAR) — Green Rayong R-Eco-Pilot

> เอกสารวิเคราะห์การแข่งขัน Pitching ที่ผ่านมา · เก็บบทเรียนเพื่อใช้ในรอบต่อไป

---

## 1. สรุปผลและบริบท

| รายการ | รายละเอียด |
|---|---|
| โปรเจกต์ | R-Eco-Pilot · Green Rayong 4-Identities AI Storytellers |
| ผลการแข่งขัน | **รางวัลชมเชย** |
| เวลานำเสนอ | 7 นาที |
| เวลา Q&A | 6 นาที |
| เวลา Feedback | 5 นาที |
| รวมเวลาบนเวที | 18 นาที |

**สถานะของระบบในวันนำเสนอ:** Production app live ที่ `ai-storyteller-9dc3a.web.app` — ทำงานครบทุก feature

---

## 2. สิ่งที่ไปได้ดี (Wins to keep)

- ✅ **ระบบทำงานได้จริง** — ไม่มี crash, ไม่ใช่ slide-only demo
- ✅ **มีผลงานต้นแบบครบ** — ทีมทดสอบ, AI Audit Log, Pitching scores
- ✅ **ผ่านเข้ารอบและคัดเลือก** จนได้รางวัลชมเชย (จากผู้สมัครจำนวนมาก)
- ✅ **ทีมมีความรู้ลึก** — สมาชิกอธิบายเทคนิคได้ละเอียด (ทั้งจุดดีและจุดอ่อน)

> รางวัลชมเชย = อยู่ใน top tier แล้ว ไม่ใช่ผู้แพ้

---

## 3. สิ่งที่พลาด (Critical issue)

### 🔴 Root cause — สมาชิกคนเดียวพูดยาวเกินไป จนไม่ได้โชว์เว็บให้กรรมการดู

**ผลกระทบ:**
- Judges ไม่เห็นว่าระบบทำงานได้จริง → ตัดสินจากคำพูดอย่างเดียว
- ไม่ได้แสดง **differentiator หลัก** ของทีม: White-label / AI Audit / 5×5 Matrix / Branding presets
- เสียโอกาส "Wow moment" — judges ที่เห็น live demo มักจำชัดและให้คะแนนสูงกว่า

### Timing analysis (7 นาที presentation)

**เกิดอะไรขึ้นจริง (ประมาณการ):**
```
0:00 - 7:00   ████████████████████████████████  สมาชิก A พูดอย่างเดียว
0:00 - 7:00   ----------------------------------  ไม่มี live demo
```

**สิ่งที่ควรเกิดขึ้น:**
```
0:00 - 1:00   Hook + Problem statement                  ←  1 min
1:00 - 2:30   Solution overview (slides)                ←  1.5 min
2:30 - 5:30   🔴 LIVE DEMO บนเว็บจริง                    ←  3 min ⭐ สำคัญสุด
5:30 - 6:30   Impact + Business model                   ←  1 min
6:30 - 7:00   CTA + Team intro                          ←  0.5 min
```

---

## 4. Why did it happen? (5 Whys)

1. **ทำไมโชว์เว็บไม่ได้?** → เวลาเดินไปจนหมด (สมาชิกพูดยาวเกิน 7 นาที)
2. **ทำไมสมาชิกพูดยาว?** → ไม่มี time-budget ต่อ section + ไม่มี handoff signal ระหว่างสมาชิก
3. **ทำไมไม่มี time-budget?** → ทีมซ้อมแบบ "พูดทั้งหมด" ไม่ใช่ "ซ้อมตามเวลาจริงพร้อม timer"
4. **ทำไมไม่ซ้อมพร้อม timer?** → คิดว่ารู้เนื้อหาแล้ว → underestimate ผลของ adrenaline (พูดช้าลง 20-30% บนเวที)
5. **ทำไม underestimate?** → ขาด **stress rehearsal** (ซ้อมหน้าคนอื่นจริง)

> **บทเรียนหลัก:** การรู้เนื้อหา ≠ การส่งมอบในเวลา · "Pitch deck พร้อม" ≠ "ทีมพร้อม"

---

## 5. Action items สำหรับครั้งต่อไป (Top 10)

### A. การซ้อม (Rehearsal discipline)

| # | Action | ผู้รับผิดชอบ | กรอบเวลา |
|---|---|---|---|
| 1 | **Time-budget ทุก section** — เขียนวินาทีที่ slide เปลี่ยน | Team Lead | ก่อน present 2 สัปดาห์ |
| 2 | **ซ้อมกับ timer + บันทึกวิดีโอ** ≥ 5 รอบ | ทุกคน | สัปดาห์สุดท้าย |
| 3 | **ซ้อมกับ "Cold audience"** (ครู/เพื่อนต่างห้อง) ≥ 2 รอบ | ทีม | 3 วันก่อน |
| 4 | **Backup speaker** — สมาชิกทุกคนพูดได้ทุก section (ฉุกเฉิน) | ทุกคน | ก่อนซ้อม |

### B. โครงสร้าง Presentation

| # | Action | หมายเหตุ |
|---|---|---|
| 5 | **Live demo ต้องอยู่ใน 7 นาที** — slot ที่ 3:00 - 5:30 (สูงสุด 3 นาที) | บังคับใน timeline |
| 6 | **Demo plan B (vidoe screen recording)** — สำรอง 30 วินาทีไว้ ถ้า network ช้า | upload YouTube/private |
| 7 | **3 ประโยคแรก = Hook** — ปัญหา + ผลกระทบ + ผู้เกี่ยวข้อง | จำได้ขึ้นใจ |

### C. การส่งมอบ (Delivery)

| # | Action | เทคนิค |
|---|---|---|
| 8 | **Handoff signal** — สมาชิกคนถัดไปยืน ใกล้กล่าวว่า "ตอนนี้ขอ X อธิบาย..." | ฝึกกัน |
| 9 | **Pacer/timekeeper ในทีม** — สมาชิกคนหนึ่งดูเวลา + ส่งสัญญาณ (e.g. ชู 2 นิ้ว = 2 นาที) | ตั้งกฎ |
| 10 | **ลดสไลด์ลง 30%** — สไลด์น้อย → พูดน้อย → มีเวลาเหลือ demo | Cut ruthlessly |

---

## 6. Demo Script ที่ควรเตรียมไว้ (3 นาที)

### Cold-start demo (ถ้า judges ยังไม่เคยเห็นเว็บ)

```
[0:00] เปิด ai-storyteller-9dc3a.web.app — แสดง Public Overview
       "นี่คือเว็บที่ใช้งานจริง ทุก device เห็นพร้อมกัน — ดูคะแนนของ 3 ทีมที่กำลังแข่งใน demo"

[0:30] Login เป็น Student → คลิก Mission Inbox
       "นักเรียนรับโจทย์ที่นี่ — เลือก 1 ใน 4 Identity: สวน ป่า นา เล"

[1:00] เปลี่ยน tab เป็น Submission Gateway
       "7 ขั้นตอนการส่งงาน — ทุกข้อมูลผ่าน AI Audit ก่อน submit"

[1:30] Logout → Login เป็น Teacher → เปิด Pitching Evaluator
       "ครูประเมิน 5 ด้าน — แต่ระบบไม่ใช่แค่ครูประเมิน..."

[2:00] โชว์ 5×5 Matrix
       "นี่คือ matrix 25 ช่อง = 5 ด้าน × 5 ผู้ประเมิน (ตนเอง/เพื่อน/ครู/ปราชญ์/AI)
        ⭐ คะแนนรวมเฉลี่ย 360 องศา — ลด bias จากผู้ประเมินคนเดียว"

[2:30] เปิด Admin → Branding → กด preset "Doi Saket"
       "และระบบ white-label พร้อม — โรงเรียนอื่นในจังหวัดอื่นเอาไปใช้ได้ทันที
        เปลี่ยนสี/ชื่อ/region ในคลิกเดียว — ขยาย Soft Power ระยอง สู่ทั้งประเทศได้"

[3:00] กลับมาที่ slide → ปิดด้วย Impact statement
```

> **กฎ:** Demo ต้องมี 1 "Wow moment" — แนะนำให้ใช้ Branding switch (เพราะ visual และเห็นผล real-time)

---

## 7. แผนการพัฒนาทีม (เตรียมรอบหน้า)

### Phase 1: Pre-rehearsal (4 สัปดาห์ก่อน)
- เลือก final pitch script (1 สไตล์ — ห้ามเปลี่ยน)
- ตั้ง roles ใน demo: Speaker × 3 + Demo driver × 1 + Timekeeper × 1
- เตรียม Plan B video (2-3 นาที) สำรอง

### Phase 2: Stress test (2 สัปดาห์ก่อน)
- ซ้อมกับ Internet ที่จำลองช้า (Chrome DevTools → throttle)
- ซ้อมกับ noise/interruption (เลียนแบบเวที)
- ขอ feedback จากครูคนอื่น 2-3 ท่าน

### Phase 3: Polish (สัปดาห์สุดท้าย)
- บันทึกวิดีโอตัวเอง → ดูซ้ำ → ลด filler words
- ทดสอบ presentation ใน ตำแหน่งจริง (ถ้าได้)
- พักนอน ≥ 7 ชม. คืนก่อนแข่ง

---

## 8. สรุปประโยคเดียว

> "เรามีของจริง · เราพลาดที่ไม่ได้โชว์ของจริง · รอบต่อไป — เริ่มที่ demo, ปิดที่ impact"

---

**เอกสารนี้สร้างเมื่อ:** 2026 · หลังการแข่งขัน Green Rayong Pitching
**ผู้จัดทำ:** ครู + R-Eco-Pilot Team
**ใช้คู่กับ:** 02-demo-video-script.md · 03-lesson-plan.docx · 04-feature-roadmap.md
