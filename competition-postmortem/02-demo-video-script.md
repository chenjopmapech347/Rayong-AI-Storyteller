# Demo Video Script — R-Eco-Pilot

> Script สำหรับอัด screen recording + voiceover เพื่ออัป YouTube
> ความยาวเป้าหมาย: **3:00 นาที** (สำหรับใส่ใน QR ของ Pitch deck) หรือ **5:00 นาที** (full demo)

---

## 0. เตรียมก่อนอัด

### Equipment checklist

| รายการ | คำแนะนำ |
|---|---|
| 🎙️ Microphone | USB mic ($15-30) ดีกว่า built-in laptop 10 เท่า — แนะนำ: Fifine K669 / Maono AU-A04 |
| 🎬 Screen recorder | **OBS Studio** (ฟรี, ดีสุด) หรือ **Loom** (ง่ายแต่จำกัด 5 นาที free) |
| ✂️ Video editor | **CapCut** (ฟรี, มี auto-caption ภาษาไทย) หรือ **DaVinci Resolve** (ฟรี, pro) |
| 🌐 Browser | Chrome zoom = **125%** (text ใหญ่อ่านง่ายในวิดีโอ) |
| 💡 Lighting | ไม่จำเป็น (face cam optional) |

### Browser setup ก่อนอัด

```
1. เปิด Chrome → Incognito mode (ไม่มี extension รบกวน)
2. เปิด https://ai-storyteller-9dc3a.web.app
3. Zoom 125% (Ctrl + +) หรือ 150% ถ้าจอใหญ่
4. ปิด notification ทั้งหมด (Do Not Disturb)
5. เตรียม 3 tabs:
   - Tab 1: Public Overview (logged out)
   - Tab 2: Student login พร้อม
   - Tab 3: Teacher/Admin login พร้อม
6. Test: เปิด Admin → Branding → กดสลับ preset ให้ลื่น (เพราะคือ "Wow moment")
```

### OBS Studio config

```
Scene: "Browser Capture"
  - Source 1: Display Capture (full screen) หรือ Window Capture (Chrome เท่านั้น)
  - Source 2: Audio Input (mic)
  - (Optional) Source 3: Webcam corner (overlay 240×135 มุมขวาล่าง)

Output settings:
  - Resolution: 1920×1080
  - FPS: 30
  - Format: MP4
  - Bitrate: 8000 kbps (HD)
```

---

## 1. Script เต็ม — Version 3 นาที (สำหรับ Pitch QR code)

### Cold open · 0:00 - 0:15

**[Visual]** เปิด Public Overview · กล้องโฟกัสที่ logo + ชื่อ
**[Voiceover]**
> "สวัสดีครับ ผม [ชื่อ] จากทีม R-Eco-Pilot Green Rayong
>
> สามนาทีต่อจากนี้ ผมจะแสดงให้คุณเห็นระบบที่ทำให้นักเรียนอาชีวะ
> เป็น AI Storyteller บอกเล่าภูมิปัญญาท้องถิ่นได้อย่างมีจริยธรรม"

---

### Section 1 · Public View · 0:15 - 0:45 (30 วิ)

**[Visual]**
- Scroll ลงให้เห็น Skill Matrix (5 ด้าน × ทีม)
- โฟกัสที่ team rows + heatmap colors
- กดสลับ Thai TH ↔ English EN

**[Voiceover]**
> "หน้านี้ใครก็เข้าได้ — เห็นคะแนนของทุกทีมแบบ real-time
>
> 5 ด้านที่เราประเมิน: AI Prompting · Local Wisdom · Creativity · Business Plan · Storytelling
>
> และระบบรองรับสองภาษา — *[คลิกสลับ EN]* — เพื่อให้ judges จากต่างประเทศก็เข้าใจได้"

**📌 Cue:** สลับภาษาให้ลื่น 1 ครั้ง · แล้วสลับกลับเป็นไทย

---

### Section 2 · Student journey · 0:45 - 1:30 (45 วิ)

**[Visual]**
- Login เป็น `student` / `student123`
- โชว์ Mission Inbox → On-site Collector → Submission Gateway
- เน้น Cascade dropdowns (สวน → ป่าชายเลน → กกหญ้า)

**[Voiceover]**
> "นี่คือมุมของนักเรียน — เริ่มที่ Mission Inbox รับโจทย์จากครู
>
> เลือก 1 ใน 4 Identity: สวน · ป่า · นา · เล
>
> *[คลิก On-site Collector]* — ลงพื้นที่จริง สัมภาษณ์ปราชญ์ บันทึกข้อมูล
>
> *[คลิก Submission Gateway]* — ส่งงาน 7 ขั้นตอน
>
> และทุกครั้งที่ใช้ AI เพื่อช่วยงาน — ต้องบันทึก Prompt ใน AI Audit Log
> เพื่อความโปร่งใส — และป้องกัน AI Hallucination"

---

### Section 3 · Teacher + 5×5 Matrix · 1:30 - 2:15 (45 วิ)

**[Visual]**
- Logout → Login เป็น `teacher` / `teacher123`
- เปิด Pitching Evaluator → เลือกทีม → โชว์ Radar Chart + 5×5 Matrix
- ชี้ไปที่ row averages + column averages + overall star score

**[Voiceover]**
> "ฝั่งครู — นี่คือหัวใจของระบบ
>
> *[ชี้ Radar Chart]* — Skill radar 5 ด้าน
>
> *[ชี้ Matrix]* — แต่เราไม่ได้ให้ครูคนเดียวประเมิน
> เรามี **5 ผู้ประเมิน** = ตนเอง · เพื่อน · ครู · ปราชญ์ชาวบ้าน · และ AI
>
> ได้คะแนน 25 ช่อง — ลด bias · เพิ่มความยุติธรรม
>
> และนี่คือคะแนนรวม *[ชี้ ⭐ overall]* — ระบบคำนวณอัตโนมัติ"

**📌 Cue:** ชี้ด้วย cursor ไม่ใช่นิ้ว (ในวิดีโอ cursor cleaner)

---

### Section 4 · Admin + White-label · 2:15 - 2:45 (30 วิ) ⭐ **WOW MOMENT**

**[Visual]**
- เปลี่ยนเป็น Admin login
- เปิด Branding sub-tab
- กด preset "Green Doi Saket" → header เปลี่ยนสีเขียวเป็นเขียวเข้ม + emoji 🌲 + region "ดอยสะเก็ด"
- กด "Green Phuket" → สีฟ้าทะเล + emoji 🏝️
- กด "Green Ayutthaya" → สีน้ำตาล + emoji 🛕
- กลับ "Green Rayong" → default

**[Voiceover]**
> "และนี่คือสิ่งที่ทำให้เราต่างจากระบบทั่วไป
>
> **White-label พร้อมขยาย** — โรงเรียนในจังหวัดอื่นเอาไปใช้ได้ทันที
>
> *[กด Doi Saket]* เชียงใหม่ใช้ได้
> *[กด Phuket]*    ภูเก็ตใช้ได้
> *[กด Ayutthaya]* อยุธยาใช้ได้
>
> ในคลิกเดียว — เปลี่ยนสี · เปลี่ยนชื่อ · เปลี่ยน Identity ของท้องถิ่น
> ไม่ต้องเขียนโค้ดเพิ่มเลย"

**📌 Cue:** กด preset ให้เร็วและลื่น (ฝึกล่วงหน้า ~10 รอบ)

---

### Section 5 · Impact + CTA · 2:45 - 3:00 (15 วิ)

**[Visual]**
- กลับ Public Overview พร้อม Skill Matrix
- Overlay text: "Open at https://ai-storyteller-9dc3a.web.app"
- Logo + brand name

**[Voiceover]**
> "นี่คือ R-Eco-Pilot
> **3 ทีมทดลองในระยอง · ขยายสู่ทั้งประเทศได้ใน 1 คลิก**
>
> ลองเล่นได้ที่ ai-storyteller-9dc3a.web.app
> ขอบคุณครับ"

**[End screen]** 3 วินาที · logo + URL + QR code (ถ้ามี)

---

## 2. Script เต็ม — Version 5 นาที (Full demo)

ขยายจาก 3 นาทีโดยเพิ่ม:

| เพิ่มหลัง section | เนื้อหา | เวลา |
|---|---|---|
| Section 2 | **AI Audit Log** — โชว์ Run AI Audit → แสดง strengths/concerns/recommendations | +45 วิ |
| Section 3 | **Reports R1-R6** — เปิด R1 Score Summary table + R6 Portfolio cards | +45 วิ |
| Section 4 | **Ethics Audit** — Admin → Moderation → Run Ethics Audit → แสดง flags | +30 วิ |

---

## 3. Shot list (เรียงตามลำดับอัด)

### Take 1: Voiceover only (อัดเสียงก่อน)

```bash
# วิธีที่แนะนำ: อัดเสียงแยก แล้ว sync ใน editor
1. เปิด Audacity (ฟรี)
2. อัด script ทีละ section (5 ไฟล์ .wav)
3. ฟัง → ลบ filler words ("เอ่อ", "อืม", "นะครับ")
4. Export 16-bit WAV
```

### Take 2: Screen recording (no audio, only browser actions)

```bash
1. OBS Start Recording
2. ทำตาม script ทีละ section · กดให้ลื่น
3. ระหว่าง section หยุดสัก 2-3 วินาที (เผื่อตัดต่อ)
4. Stop Recording → ได้ไฟล์ .mp4 หนึ่งไฟล์
```

### Take 3: Edit ใน CapCut

```bash
1. Import วิดีโอ screen + เสียง voiceover
2. Mute วิดีโอ → ใช้เสียงจาก voiceover เท่านั้น
3. Sync เสียงกับ visual
4. เพิ่ม:
   - Background music (vol 10%) — ใช้ YouTube Audio Library
   - Text overlay สำหรับชื่อ section
   - Auto-caption ภาษาไทย (CapCut มี built-in!)
5. Export 1080p · 30fps · MP4
```

---

## 4. YouTube upload checklist

### Metadata

| Field | ค่าที่แนะนำ |
|---|---|
| **Title** | `R-Eco-Pilot: Green Rayong 4-Identities AI Storyteller (Demo 3 min)` |
| **Description** | (ใส่ link ด้านล่าง) |
| **Tags** | `AI Storyteller, Rayong, ESG, Education, IoT, Local Wisdom, ปวส., วิทยาลัยเทคนิค` |
| **Thumbnail** | สี gradient เขียว-ฟ้า + ชื่อโปรเจกต์ตัวใหญ่ + emoji 🌿 |
| **Privacy** | Unlisted (ถ้าเฉพาะ judges) หรือ Public (ถ้าโปรโมท) |
| **End screen** | Link to website + Subscribe |

### Description template

```
🌿 R-Eco-Pilot — Green Rayong 4-Identities AI Storytellers
ระบบบ่มเพาะ AI Storyteller สำหรับนักเรียนอาชีวะ — บอกเล่าภูมิปัญญาท้องถิ่นอย่างมีจริยธรรม

🌐 ลองเล่นเลย: https://ai-storyteller-9dc3a.web.app
💻 Source code: https://github.com/chenjopmapech347/Rayong-AI-Storyteller
📚 คู่มือ: เข้าเว็บแล้วกดเมนู "Help / คู่มือ"

🎯 Features หลัก:
✅ 5×5 Evaluation Matrix (Self/Peer/Teacher/Sage/AI)
✅ AI Audit Logbook (Anti-Hallucination)
✅ Cultural Ethics Audit (6 categories, 17 rules)
✅ White-label Branding (4 presets: Rayong / Doi Saket / Phuket / Ayutthaya)
✅ Reports R1-R6 (Score / Idea / Finance / Activity / Individual / Portfolio)
✅ Thai/English bilingual

⏱️ Timestamps:
0:00 Intro
0:15 Public View
0:45 Student Journey
1:30 5×5 Matrix
2:15 White-label Demo
2:45 Impact

#AIStoryteller #GreenRayong #ESG #VocationalEducation #ปวส
```

---

## 5. Common mistakes (ที่ต้องหลีกเลี่ยง)

| ❌ Mistake | ✅ Fix |
|---|---|
| พูดเร็วเกินไปเพราะกลัวเวลาหมด | ฝึกพูดที่ 130-150 wpm · จับเวลาแต่ละ section |
| Cursor จิ๋วและขยับเร็ว | OBS เปิด "Highlight cursor" · เคลื่อนช้า |
| Background ติด noise | อัดในห้องปิด · ใช้ Audacity Noise Reduction |
| Demo error สด ๆ | บันทึกอย่างน้อย 2 takes · เก็บที่ดีที่สุด |
| Subtitle ผิด | ใช้ CapCut auto-caption ภาษาไทย แล้วตรวจซ้ำคำเฉพาะ (e.g. "ปราชญ์", "ภูมิปัญญา") |
| File ใหญ่เกินไป | Compress ใน HandBrake → CRF 23, ~50 MB ต่อ 5 นาที |

---

## 6. กำหนดการแนะนำ

```
Day 1 — ตอนเช้า (1 ชม):  Browser setup + ซ้อม screen actions
Day 1 — ตอนบ่าย (2 ชม):  อัด voiceover (5 section) ใน Audacity
Day 2 — ตอนเช้า (2 ชม):  อัด screen recording ใน OBS (≥ 3 takes)
Day 2 — ตอนบ่าย (3 ชม):  Edit ใน CapCut + captions
Day 3 — ตอนเช้า (1 ชม):  Review + export
Day 3 — ตอนบ่าย (30 นาที): Upload YouTube + metadata
```

**รวม: 9.5 ชั่วโมง** (กระจาย 3 วัน) — ทำคนเดียวได้

---

## 7. After upload

- [ ] นำ URL ใส่ใน QR code → พิมพ์ใน Pitch deck slide สุดท้าย
- [ ] Share ลิงก์ใน LINE กลุ่มทีม
- [ ] Pin link ใน GitHub README
- [ ] Embed ใน Help tab ของเว็บ (อาจทำเป็น `<iframe>` ใน Manual)

---

> **เป้าหมาย:** ครั้งหน้าถ้า demo time ไม่พอ → judges ดูใน QR ได้ → "Wow moment" ไม่หาย

**ผู้จัดทำ:** ครู + R-Eco-Pilot Team · 2026
