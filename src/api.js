// src/api.js — Firebase Serverless Version
import { initializeApp, getApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as fbUpdatePassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  getDocsFromServer,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";

// ─── Starter Good Prompts (22 prompts) ─────────────────
// Thai title + English content. Categories cover the Green Rayong project
// AND the user's teaching subjects (IoT, Database, Computer Hardware).
export const STARTER_PROMPTS = [
  // ── Green Rayong project (10 original) ──
  { title: 'สัมภาษณ์ปราชญ์ชาวบ้าน', category: 'Local Wisdom',
    content: "Act as a respectful field researcher. I am about to interview a local sage from Rayong about [TOPIC]. Generate 10 open-ended interview questions that progress from rapport-building to deeper inquiry. The questions should surface (a) the origin story of the practice, (b) the sage's personal craft and lineage, (c) how the practice has evolved with time, (d) cultural significance to the community, and (e) risks of the knowledge being lost. Use polite Thai-context framing. Output as a numbered list." },
  { title: 'วิเคราะห์ปัญหาสิ่งแวดล้อม', category: 'Environment',
    content: 'You are an environmental analyst working in Rayong province. Given the area [AREA] and the observation [OBSERVATION], produce a structured analysis with: 1) three to five concrete environmental issues, 2) likely root causes for each, 3) affected stakeholders and ecosystems, 4) two evidence-based intervention options per issue (one low-cost, one high-impact), and 5) local cultural or political constraints to consider. State assumptions clearly.' },
  { title: 'ออกแบบนวัตกรรมจากภูมิปัญญา', category: 'Innovation',
    content: 'You are a product designer fusing Thai local wisdom with modern technology. Local wisdom: [WISDOM]. Problem to solve: [PROBLEM]. Target user: [USER]. Propose three distinct prototype concepts. For each, describe: working principle, materials and tools, build steps, estimated cost in THB, and how the local wisdom is genuinely honored (not just decorative). End with a short comparison table and recommend one with reasoning.' },
  { title: 'สร้าง Business Model Canvas', category: 'Business Plan',
    content: 'Act as a business mentor for a student team in Rayong. Their product is [PRODUCT] derived from [LOCAL_INPUT]. Build a complete Business Model Canvas covering all nine blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure. For each block, give two to four bullet points and call out the single riskiest assumption.' },
  { title: 'สคริปต์วิดีโอ Storytelling 3 นาที', category: 'Storytelling',
    content: 'Write a 3-minute (~450 word) narrative video script for the Green Rayong AI Storytellers project about [TOPIC]. Structure: Hook (0:00-0:15) — a striking image or question; Setup (0:15-1:00) — character and conflict; Journey (1:00-2:30) — the discovery and the moment local wisdom meets AI; Resolution + Call-to-Action (2:30-3:00). Include shot directions in [brackets] and on-screen text suggestions. Tone: warm, hopeful, grounded.' },
  { title: 'ปรับปรุง Prompt ให้คมชัด', category: 'AI Prompting',
    content: 'Critique and rewrite the following prompt to be sharper and more reliable: "[ORIGINAL_PROMPT]". Apply the RTCFC pattern — Role, Task, Context, Format, Constraints. Return: 1) the rewritten prompt, 2) a bullet list of every change you made and why, 3) one example of the kind of output the new prompt should produce, and 4) two follow-up prompts a user could chain afterwards.' },
  { title: 'วิเคราะห์ตลาดและคู่แข่ง', category: 'Business Plan',
    content: 'You are a market analyst. For the product [PRODUCT] targeting [SEGMENT] in the Rayong / Eastern Seaboard region, deliver: 1) estimated addressable market size with the assumptions used, 2) three to five direct or adjacent competitors with strengths and weaknesses, 3) a 2x2 positioning map (axes of your choice — justify them), 4) the Unique Selling Proposition our product should claim, and 5) the top three risks with one mitigation each. Be concrete; avoid generic advice.' },
  { title: 'ประเมิน Carbon Footprint', category: 'Environment',
    content: 'Estimate the carbon footprint of the product [PRODUCT] across its lifecycle: raw material sourcing, manufacturing, transport, use, and end-of-life. For each stage state the assumptions, give a kgCO2e estimate with the calculation, and propose one realistic improvement. Conclude with the single largest hotspot and a target percentage reduction. Note any data gaps and what additional information would tighten the estimate.' },
  { title: 'ตั้งชื่อแบรนด์และสโลแกน', category: 'Branding',
    content: 'Generate five brand-name candidates for [PRODUCT_OR_SERVICE] aimed at [TARGET_AUDIENCE]. Each name should evoke the Rayong identity of [IDENTITY: e.g. coastal, agricultural, industrial, creative]. For each candidate provide: the name in Thai and Romanized form, a pronunciation note, a 5-to-7-word slogan in both Thai and English, the emotion it triggers, and one risk (linguistic clash, trademark, etc.). End with your pick and reasoning.' },
  { title: 'เตรียม Pitch Deck 6 สไลด์', category: 'Pitching',
    content: 'Compress the project notes below into a 6-slide pitch deck for a 5-minute student pitch: Slide 1 Problem, Slide 2 Solution and how AI + local wisdom combine, Slide 3 Market and customer evidence, Slide 4 Business model and unit economics, Slide 5 Team, plan, and traction so far, Slide 6 The Ask and call-to-action. For each slide write the headline, three bullets, and one suggested visual. Keep language concrete and metric-driven. Project notes: [NOTES].' },

  // ── IoT / Hardware (4 new) ──
  { title: 'โค้ด Arduino/ESP32 สำหรับ IoT', category: 'IoT',
    content: 'Write production-ready Arduino C++ code for an [ESP32 / ESP8266 / Arduino Uno] that reads from a [SENSOR e.g. DHT22, soil moisture, PM2.5] every [INTERVAL] seconds and publishes the data over [Wi-Fi/MQTT/HTTP] to [ENDPOINT]. Include: pin definitions as constants, setup() with error handling for sensor init and Wi-Fi connect, loop() with retry logic and a deep-sleep option, and inline comments in Thai for students. Add a brief wiring diagram description (which pins go where) and the libraries to install via Library Manager.' },
  { title: 'ออกแบบวงจร / Bill of Materials', category: 'Hardware',
    content: "I'm building [PROJECT_DESCRIPTION] using a microcontroller. Help me design the circuit and produce a complete Bill of Materials with: 1) every component (model number, quantity, unit price in THB, where to buy in Thailand), 2) a wiring table (component pin → MCU pin → reason), 3) power-budget calculation (current draw per component, total mA, recommended battery / PSU), 4) safety notes (resistor values, voltage levels, common shorts to avoid), 5) total estimated cost. Format as markdown tables." },
  { title: 'Debug ฮาร์ดแวร์ / วงจร', category: 'Hardware',
    content: "My hardware project is misbehaving: [SYMPTOM e.g. 'sensor returns 0', 'ESP32 keeps resetting', 'LED is dim']. The setup is: [DESCRIBE CIRCUIT, MCU, POWER]. Walk me through a structured diagnosis: 1) the 5 most likely root causes ranked by probability, 2) for each, a quick test I can do with multimeter / serial monitor / oscilloscope, 3) what reading would confirm or reject the hypothesis, and 4) the fix once confirmed. Use Thai explanations, English component names." },
  { title: 'สอนใช้เซ็นเซอร์ตัวใหม่', category: 'IoT',
    content: 'I am a high-school student new to [SENSOR e.g. MAX30100 heart-rate, BME680 air quality, RFID RC522]. Teach me in Thai: 1) what physical principle the sensor uses, 2) the typical wiring with an Arduino/ESP32, 3) the simplest "hello world" code to read one value, 4) calibration steps and common pitfalls, 5) two project ideas that suit a school competition. End with three Thai keywords I can google to learn more.' },

  // ── Database / SQL (3 new) ──
  { title: 'ออกแบบ Database Schema', category: 'Database',
    content: 'Design a normalized relational database schema for the project: [PROJECT_DESCRIPTION]. Deliver: 1) entity-relationship diagram described in text (entities, attributes with types, primary/foreign keys), 2) CREATE TABLE statements in SQL (specify dialect: [MySQL/PostgreSQL/SQLite]), 3) sample INSERT statements with realistic Thai data (5 rows per table), 4) three example queries the user will likely need (with explanations), 5) suggested indexes and the reasoning. Use snake_case naming and include comments in the SQL.' },
  { title: 'แปลง Requirement → SQL Query', category: 'Database',
    content: "Given this database schema:\n[PASTE_SCHEMA]\n\nWrite a single SQL query (dialect: [MySQL/PostgreSQL]) that answers: [BUSINESS_QUESTION]. Include: 1) the query itself with proper indentation, 2) line-by-line explanation in Thai of what each clause does, 3) a brief note about performance (which indexes help, expected row count), 4) one alternative way to write the same query (e.g. JOIN vs subquery) and which is preferable here." },
  { title: 'Optimize SQL ที่ช้า', category: 'Database',
    content: 'This SQL query is slow:\n[PASTE_QUERY]\nSchema:\n[PASTE_SCHEMA]\nApproximate row counts: [ROW_COUNTS]\n\nDiagnose and rewrite. Provide: 1) why the original is slow (full table scan? cartesian product? unindexed JOIN?), 2) the EXPLAIN plan output you would expect, 3) the optimized query, 4) the indexes I should add (with CREATE INDEX statements), 5) any schema or denormalization changes that would help further. Explain trade-offs in Thai.' },

  // ── Programming / general (3 new) ──
  { title: 'อธิบายโค้ดที่อ่านไม่เข้าใจ', category: 'Code Review',
    content: "I don't understand this code:\n```\n[PASTE_CODE]\n```\nLanguage: [JAVASCRIPT / PYTHON / C / C++ / etc.]\n\nExplain it like I'm a high-school student starting with this language. Walk me through: 1) what the code does at a high level (one sentence in Thai), 2) line-by-line breakdown in Thai with the technical English term in parentheses, 3) any subtle bugs or edge cases, 4) a cleaner / more idiomatic version with comments, 5) one real-world scenario this pattern is used in." },
  { title: 'หา Bug ในโค้ด', category: 'Code Review',
    content: "This code is supposed to [INTENDED_BEHAVIOR] but instead [ACTUAL_BEHAVIOR / ERROR_MESSAGE]:\n```\n[PASTE_CODE]\n```\nAnalyze step-by-step. Provide: 1) the root cause in plain Thai, 2) a fixed version of the code with the change highlighted in a comment, 3) a short explanation of why the original failed (off-by-one, async timing, type coercion, etc.), 4) a unit-test snippet that would have caught this bug, 5) one related anti-pattern to watch for next time." },
  { title: 'สร้าง Test Cases อัตโนมัติ', category: 'Code Review',
    content: "Generate a comprehensive test suite for this function:\n```\n[PASTE_CODE]\n```\nUse the [JEST / VITEST / PYTEST / JUNIT] framework. Cover: 1) happy path with typical inputs, 2) edge cases (empty, null, max/min, boundary values), 3) failure modes (invalid inputs, exceptions), 4) integration touch points if any. For each test case write a clear `describe`/`it` description in English, the assertion, and a one-line Thai comment explaining what bug it would catch." },

  // ── Education / Communication (2 new) ──
  { title: 'แผนการสอนคาบเดียว 50 นาที', category: 'Teaching',
    content: 'Create a 50-minute lesson plan for [GRADE_LEVEL e.g. ม.5] on the topic [TOPIC e.g. "พื้นฐาน IoT และเซ็นเซอร์"]. Use the 5E model (Engage, Explore, Explain, Elaborate, Evaluate). For each phase specify: time allocation, teacher activity, student activity, materials needed, and the indicator (พฤติกรรมที่สังเกตได้) that learning is happening. End with one formative-assessment question and one extension activity for fast finishers. Output in Thai.' },
  { title: 'Caption Social Media สำหรับโพสต์วิดีโอ', category: 'Marketing',
    content: 'Write 3 versions of a social-media caption (Thai) to promote our team\'s 3-minute project video. The video is about [TOPIC] from [TEAM] in Rayong. Each version should: 1) hook with a question or surprising fact in the first sentence, 2) be ≤120 characters before the first hashtag (mobile-friendly), 3) include 5-7 relevant hashtags mixing Thai and English (#GreenRayong, #ภูมิปัญญาท้องถิ่น, #IoTธอ, etc.), 4) end with a clear CTA (watch / comment / share). Label them: "เน้นอารมณ์", "เน้นข้อมูล", "เน้นเรียกร้อง".' }
];

// Updated 2026-05 from "ตารางประเมินทั้ง 2 ฉบับ.docx" — แบบ "พี่ครูอาชีวะ":
//   • Level 4 = The Impact Creator & Leader (Mentor / Global / SET / TPQI / Biennale)
//   • Level 3 = The Standard Achiever (ทำตามคำสั่งครบ)
//   • ระบุ "AI ตรวจ" ใน ข้อ 3 (Grammar/Style) · ข้อ 4 (Hallucination) · ข้อ 7 (สูตรบัญชี)
export const STARTER_RUBRICS = [
  // ══════════════════════════════════════════════════════════════
  // 🎤 แผ่นที่ 0: เกณฑ์การประเมิน Pitching (5 ข้อ × 5 ระดับ)
  // ใช้สำหรับวันนำเสนอจริง — ดีเยี่ยม (5) → ปรับปรุง (1)
  // ══════════════════════════════════════════════════════════════
  { name: '1. การนำเสนอ & โครงสร้าง Pitch Deck (Pitch Structure & Delivery)', max: 5, category: 'เกณฑ์การประเมิน Pitching',
    levels: [
      // idx 0 = 1 คะแนน (ปรับปรุง)
      'สไลด์รก ภาพ-ตัวอักษรปน ไม่มีโครงเรื่อง พูดอ้อมโลก ไม่ตรงประเด็น ผู้ฟังจับใจความไม่ได้ คุมเวลาไม่ได้ พูดเกินหรือพูดไม่หมด',
      // idx 1 = 2 คะแนน (พอใช้)
      'มีโครงเรื่องพื้นฐาน (เปิด-เนื้อหา-ปิด) แต่สไลด์เน้นข้อความล้วน ขาดภาพประกอบ ผู้พูดอ่านจากสคริปต์ ไม่สบตาผู้ฟัง',
      // idx 2 = 3 คะแนน (ปานกลาง)
      'โครงเรื่องครบ (Problem → Solution → Result) สไลด์อ่านง่าย ผู้พูดมั่นใจระดับหนึ่ง แต่ขาดจังหวะ Climax ที่ตรึงความสนใจ',
      // idx 3 = 4 คะแนน (ดี)
      'โครงเรื่องชัดเจน สไลด์ออกแบบสวย (ภาพ + Infographic) ผู้พูดมั่นใจ สบตาผู้ฟัง คุมเวลาตรงเป๊ะ 5 นาที',
      // idx 4 = 5 คะแนน (ดีเยี่ยม)
      'Pitch Deck ระดับ TED Talk — Hook ทรงพลังใน 15 วินาทีแรก, Story Arc ครบ (Setup-Conflict-Resolution), Call-to-Action ชัดเจน, ผู้ฟังตบมือสุดเสียงและจดจำได้นาน'
    ]},
  { name: '2. ความน่าเชื่อถือของข้อมูล & ภูมิปัญญาท้องถิ่น (Data Authenticity & Local Wisdom)', max: 5, category: 'เกณฑ์การประเมิน Pitching',
    levels: [
      'ข้อมูลผิวเผิน อ้างอิงไม่ได้ มีร่องรอย AI Hallucination ปนเปื้อน (เช่น สถานที่ผิด, ชื่อปราชญ์มั่ว) ทำให้ภาพลักษณ์ระยองเสีย',
      'ข้อมูลทั่วไประดับ Wikipedia ขาดการสัมภาษณ์ปราชญ์จริง พึ่งพา AI Output โดยไม่ตรวจสอบ มีจุดผิดเพี้ยนเชิงบริบทบางส่วน',
      'มีการลงพื้นที่จริง อ้างอิงปราชญ์ได้ แต่บางส่วนยังไม่ผ่าน AI Audit Log หรือยังขาดการ Cross-check ข้อมูลกับแหล่งที่สอง',
      'ข้อมูลทุกชิ้นผ่าน AI Audit Log มีการ Cross-check กับปราชญ์ Zero Hallucination พร้อมเอกสารอ้างอิงครบถ้วน',
      'ข้อมูลเชิงลึกระดับวิชาการ ปราชญ์ลงนามรับรองได้ พร้อมใช้เป็น Reference Material สำหรับ UNESCO Learning City หรือยื่นเข้า Biennale ได้ทันที'
    ]},
  { name: '3. โมเดลธุรกิจ & ความยั่งยืน SROI (Business Model & SROI)', max: 5, category: 'เกณฑ์การประเมิน Pitching',
    levels: [
      'ไม่มีโมเดลธุรกิจ คิดแต่ความสวยงาม/ของแจก ขาดมิติเศรษฐกิจ ไม่มีต้นทุน-รายรับ พูดถึง "ขาย" แต่ไม่บอกราคา',
      'มี BMC (Business Model Canvas) พื้นฐาน แต่ตัวเลขไม่สมจริง ขาดต้นทุน-ราคาตลาดที่ชัดเจน Margin ผิดเพี้ยน',
      'BMC ครบ 9 ช่อง คำนวณ ROI ได้ มีต้นทุน-ราคา-กำไรชัดเจน แต่ยังไม่มี SROI หรือผลกระทบสังคม-สิ่งแวดล้อม',
      'โมเดลธุรกิจสมเหตุสมผล มี SROI วัดผลกระทบสังคม-สิ่งแวดล้อมเป็นตัวเลข (เช่น ลดขยะ X กก./เดือน, สร้างรายได้ชุมชน Y บาท)',
      'โมเดลธุรกิจระดับ Startup พร้อม Scale มี SROI > 1.5 (ทุก 1 บาทคืนสังคม 1.5 บาท) พร้อมยื่นของบ SET / Business Pitch ระดับชาติ-สากล'
    ]},
  { name: '4. การใช้ AI อย่างเชี่ยวชาญ & มีจริยธรรม (AI Mastery & Ethics)', max: 5, category: 'เกณฑ์การประเมิน Pitching',
    levels: [
      'ใช้ AI แค่ Generate Text/Image แล้ว Copy-Paste ไม่มี AI Audit Log ไม่ได้แก้ Hallucination ปล่อยข้อมูลผิดเผยแพร่',
      'Prompt พื้นฐาน (สั่งสั้นๆ) มี AI Audit Log บางส่วน ยังพึ่งพา AI Output มากเกินไป ขาดการคิดเชิงวิจารณ์',
      'Prompt เป็นระบบ (Role + Context + Format) มี AI Audit Log ครบทุกชิ้นงาน แก้ Hallucination ได้เองโดยอ้างปราชญ์',
      'ออกแบบ Prompt ซับซ้อน (Chain-of-Thought, Iterative Refinement) Audit Log มีคุณภาพสูง มิติจริยธรรม AI ครบ (Privacy, Consent, Fact-check)',
      'เป็น "AI Mentor" ระดับสอนผู้อื่นได้ — มี Iterative Prompting พร้อม Reflection ลึกซึ้ง พร้อมยื่นเทียบทักษะ TPQI Level 4 ขึ้นไป'
    ]},
  { name: '5. การตอบคำถาม & ปฏิภาณไหวพริบ (Q&A & Wit)', max: 5, category: 'เกณฑ์การประเมิน Pitching',
    levels: [
      'ตอบคำถามไม่ได้ มองหน้ากันในทีม โบ้ยให้กรรมการดูจากสไลด์ หรือเงียบจนต้องเปลี่ยนคำถาม',
      'ตอบได้บางคำถาม แต่ไม่มั่นใจ ขาดข้อมูลสนับสนุน บางครั้งตอบนอกประเด็น สมาชิกทีมไม่ช่วยเสริม',
      'ตอบคำถามได้ครบถ้วน มีข้อมูลรองรับ ทีมแบ่งหน้าที่ตอบ แต่ขาดการต่อยอดเชิงลึกหรือมุมมองที่คาดไม่ถึง',
      'ตอบคำถามได้คม มีไหวพริบ แสดงความเข้าใจระดับลึก ทีมประสานเสียงดี (1 คนตอบหลัก + 1 คนเสริมข้อมูล)',
      'ตอบคำถามยากๆ ได้อย่างมั่นใจ ใช้ข้อมูล + อารมณ์ขัน + Soft Power ของระยอง พลิกจุดอ่อนเป็นจุดแข็ง ทำให้กรรมการประทับใจและจดจำได้'
    ]},

  // ══════════════════════════════════════════════════════════════
  // 🌟 แผ่นที่ 1: แบบประเมินผลการเรียนรู้ Green Rayong 4-Identities AI
  // (สำหรับครู 3 สาขา, ปราชญ์ และ AI ประเมินแบบ 360 องศา)
  // ══════════════════════════════════════════════════════════════
  { name: '1. วิศวกรรมคำสั่งและการตรวจสอบ (Prompt Engineering & AI Audit)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'สั่งการ AI ได้เพียงคำสั่งทั่วไป ไม่มีการบันทึก Audit Log หรือปล่อยผ่านข้อมูลเท็จจาก AI ไปใช้เลย',
      'ใช้ Prompt พื้นฐานได้ แต่ระบบ Audit Log ยังทำไม่สม่ำเสมอ ขาดวิจารณญาณในการจับผิด AI บางจุด',
      'The Standard Achiever — ออกแบบ Prompt ใช้งานได้ตรงโจทย์ มีการบันทึก Audit Log และแก้ข้อมูลเท็จที่ AI สร้างขึ้นได้ด้วยตนเอง แต่ยังอธิบายให้ผู้อื่นเข้าใจกระบวนการได้ยาก',
      'The Impact Creator & Leader — ออกแบบ Prompt ซับซ้อนระดับสูง สามารถเป็น "ผู้ให้คำแนะนำ (Mentor)" อธิบายให้ผู้อื่นเข้าใจได้ ระบุและแก้ไข AI Hallucination เชิงลึกผ่าน Audit Log ได้อย่างสมบูรณ์ ไร้ข้อผิดพลาด 100%'
    ]},
  { name: '2. การประยุกต์ใช้อัตลักษณ์ระยอง (Originality & AI Adaptation)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'ใช้ผลลัพธ์จาก AI วางลงงานโดยตรง ไม่มีการดัดแปลง ชิ้นงานไม่สะท้อนอัตลักษณ์ของจังหวัดระยองอย่างที่ควรเป็น',
      'นำเสนอข้อมูลระยองได้ตามมาตรฐาน แต่พึ่งพาไอเดียแรกของ AI มากเกินไป ชิ้นงานขาดเอกลักษณ์ที่โดดเด่นเฉพาะกลุ่ม',
      'The Standard Achiever — ปรับปรุงข้อมูล AI ได้สอดคล้องกับโจทย์ นำเสนอบริบทระยองได้ถูกต้องเหมาะสม ชิ้นงานน่าสนใจและมีความสมบูรณ์ตามที่สั่ง',
      'The Impact Creator & Leader — AI ดัดแปลงข้อมูลสู่ผลงานสร้างสรรค์ขั้นสูง (Re-contextualization) เกิดเป็นชิ้นงานสไตล์ "Rayong Soft Power" ที่ทรงพลัง พร้อมดึงดูดนักท่องเที่ยวสากลงาน Biennale 2027 ทันที'
    ]},
  { name: '3. การเล่าเรื่องแบบพหุภาษา (Bilingual Storytelling) — 🤖 AI ตรวจไวยากรณ์', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'การถ่ายทอดสองภาษาขาดความแม่นยำ AI แจ้งเตือนข้อผิดพลาดเยอะ ไม่สามารถเรียบเรียงบริบทภาษาอังกฤษให้สื่อถึงคุณค่าถิ่นเกิดได้เลย',
      'มีข้อผิดพลาดทางไวยากรณ์ที่ AI แนะนำให้แก้แต่ผู้เรียนหลุดรอดไปบ้าง รูปแบบภาษายังเป็นการแปลแบบตรงตัว (Word-for-Word) ค่อนข้างมาก',
      'The Standard Achiever — (AI ตรวจสอบไวยากรณ์: ผ่าน) สื่อสารสองภาษาได้ถูกต้อง ไวยากรณ์ครบถ้วน ชัดเจนตรงประเด็น แต่โทนภาษาอาจจะยังเรียบง่าย ขาดการดึงดูดเชิงศิลปะการโน้มน้าวใจ',
      'The Impact Creator & Leader — (AI ตรวจสอบไวยากรณ์: ผ่าน) เล่าเรื่องสองภาษาด้วยสำนวน Luxury / Global Standard ไร้ปัญหา Literal Translation อย่าง "ระยองฮิ" แปลผิด สะกดอารมณ์ผู้รับสารต่างชาติได้อย่างสมบูรณ์แบบ'
    ]},
  { name: '4. ความถูกต้องของข้อมูลและจรรยาบรรณท้องถิ่น (Zero Hallucination & Cultural Integrity) — 🤖 AI สแกน Hallucination', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'ข้อมูลขัดแย้งกับข้อเท็จจริงชุมชนขั้นรุนแรง มีการใช้องค์ประกอบมั่ว (เช่น ต้นเมเปิ้ลในป่าชายเลน) ทำให้ภาพลักษณ์เสีย',
      'มีข้อผิดพลาดในดีเทลลึก ๆ หรือนำเสนอข้อมูลผิวเผิน ขาดการคัดกรองบริบทย่อยของอัตลักษณ์ สวน-ป่า-นา-เล ตามเจตนารมณ์ดั้งเดิม',
      'The Standard Achiever — นำเสนอข้อมูลได้ถูกต้อง สอดคล้องวิถีชุมชน อ้างอิงแหล่งที่มาครบถ้วนตามหลักการสัมภาษณ์ ไม่มีผลกระทบเชิงลบต่อพื้นที่',
      'The Impact Creator & Leader — บูรณาการชุดข้อมูลจริงจากปราชญ์ชาวบ้าน ไม่มีการปรุงแต่งจาก AI โดยเด็ดขาด (Zero Hallucination) อ้างอิงและเชิดชูอัตลักษณ์ได้แม่นยำ สามารถใช้เป็นคู่มือวิชาการได้จริง'
    ]},
  { name: '5. การสื่อสารอย่างสัตย์จริง (Cultural Authenticity & Local Soul)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'เน้นแต่ความสะดวก/สวยงามของการตัดต่อวิดีโอจนกลืนวิถีชีวิตจริง ชิ้นงานเป็นเพียง "ฟอกเขียว" ไร้จิตวิญญาณผู้คน',
      'เสนอข้อมูลทั่วไป ขาดมิติการลงลึกเรื่องการส่งมอบประสบการณ์หรือมนต์เสน่ห์ ดูแข็งกระด้างหรือเป็นลักษณะทำรายงานส่ง',
      'The Standard Achiever — นำเสนองานด้วยท่าทีที่เคารพและสะท้อนวิถีชุมชนเกาะกกได้น่าชม สามารถสร้างภาพจำและความเข้าใจที่ดีแก่นักท่องเที่ยว',
      'The Impact Creator & Leader — นำเสนอคุณค่าอัตลักษณ์อย่างธรรมชาติลึกซึ้ง (Local Soul) เข้าถึงผู้คน ชิ้นงานมีศักยภาพสร้าง Engagement ในระดับสูงบนโซเชียลมีเดียของชุมชนเกาะกก'
    ]},
  { name: '6. การท่องเที่ยวอย่างรับผิดชอบ (Responsible Tourism / ESG)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'ท่องเที่ยวแบบเสพอย่างเดียว (Mass Tourism) มุ่งหน้าไปแค่กำไร หรือส่งเสริมคนมาลงสถานที่มาก ๆ โดยไม่ระวังภัยสิ่งแวดล้อม',
      'มีประเด็นลดผลกระทบแวดล้อมเฉพาะในระดับผิวเผิน (พูดแค่ลอย ๆ) ไม่เกิดเงื่อนไขสร้างการอนุรักษ์ตามที่โมเดลระบุ',
      'The Standard Achiever — แทรกประเด็นท่องเที่ยวรักษ์โลกครบถ้วนตามมาตรฐาน Net-Zero หรือ Zero Waste ให้ข้อมูลข้อควรระวังถูกต้องไม่ส่งเสริมการทำลาย',
      'The Impact Creator & Leader — ชิ้นงานมีการวัดตัวเลขเชิงผลกระทบทางสิ่งแวดล้อม (Impact Metric) หรือนำไปสู่นโยบายลดขยะได้ชัดเจน และสร้าง "Call to Action" ให้นักท่องเที่ยวเปลี่ยนพฤติกรรม 100%'
    ]},
  { name: '7. การเงินและการสร้างมูลค่าเศรษฐกิจ (Financial Sustainability: SET) — 🤖 AI ตรวจสูตรคำนวณ', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'สับสนกลไกผลได้ผลเสียระหว่างเศรษฐกิจและคุณค่าความรับผิดชอบ ชิ้นงานคำนวณมิติบัญชีเบื้องต้นขาดโครงสร้างสมเหตุผล',
      'พอประเมินโครงข่ายรับรายจ่าย แต่มีบางช่วงบางช่อง ข้อมูลคลาดเคลื่อนหรือไม่สะท้อนต้นทุนจริง (Over Expectation) อย่างสิ้นเชิง',
      'The Standard Achiever — สรุปโครงร่างบัญชี รับ-จ่าย ควบคุมค่าเสียโอกาส ทราบรายรับ/ค่าแรงสุทธิ ข้อมูลครอบคลุมตรงตามโมเดลบัญชีผู้เรียนตามกรอบ (SET)',
      'The Impact Creator & Leader — วิเคราะห์โมเดลแบบ SROI ประเมินราคาทุนทางสังคม-สิ่งแวดล้อมได้เป็น "จำนวนเงิน" หรือมูลค่าจริง (Tangible Metric) โมเดลยั่งยืน สามารถต่อยอดขอทุน Business Startup ต่อได้จริง'
    ]},
  { name: '8. มารยาท จรรยา และมนุษยสัมพันธ์ต่อปราชญ์ชาวบ้าน (Social Protocol & Community Trust)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'ปฏิบัติขัดแย้งเชิงจารีตของพื้นเพ ละเลยท่าทีใส่ใจ ใช้แค่หุ่นยนต์จับเทป ไม่สนใจกระบวน Active Learning จนสร้างรอยร้าว',
      'พูดจาประสานงานพอได้ แต่อาจเตรียมคำถามกับปราชญ์มาหลวม ๆ ปฏิสัมพันธ์ดูเหมือนรีบเก็บไปใช้ ทำข้ออึดอัดทางมิตรภาพนิดหน่อย',
      'The Standard Achiever — สุภาพ สัมมาคารวะ ดำเนินบทสนทนาถาม-ตอบ ล้วงเอาภูมิปัญญาสู่การบันทึกโครงเรื่องสื่อครบหลัก ไม่เกิดข้อโต้แย้งระหว่างสัมภาษณ์',
      'The Impact Creator & Leader — สร้าง "Community Trust" ปราชญ์ชื่นชม ให้ความรู้ได้เกินกรอบ รับหน้าที่เป็นสื่อกลางต่อเพื่อนกลุ่มอื่น ๆ ให้เรียนรู้การแสดงกาลเทศะอันนอบน้อม (Empowerer)'
    ]},
  { name: '9. จรรยาบรรณนวัตกรและวิชาชีพ (Professional Integrity: TPQI)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'กุข้อมูล บิดสไลด์ ทำของมาส่งหลังรอบ ไม่ยอมอุทิศตัวตามสายการคัดเลือก ทิ้งภาระชิ้นโตและคุณภาพไม่น่าจดจำของสาขาตน',
      'บางดีเทลงานดัดแต่งแบบตัดความจริง ไม่รักษาเวลาแต่แก้ไขปรับเสร็จ ส่งของข้ามลู่กติกาบางอัน (แต่ความสำเร็จเกิดอยู่)',
      'The Standard Achiever — ยอมรับในความแม่นตรง มุ่งเน้นกระบวนที่ตกลง ทำครบถ้วนจบตรงเส้นตาย ผลสัมฤทธิ์สะท้อนรอยยิ้มภาคภูมิวิทยาลัยตนเอง',
      'The Impact Creator & Leader — งานสมบูรณ์ เป็นมืออาชีพ นำแฟ้มสะสมเข้าเทียบทักษะวิชาชีพสถาบันคุณวุฒิวิชาชีพ (TPQI Level) เพื่อขอการันตีประกอบอาชีพตัวจริงระดับภูมิภาคทันที'
    ]},
  { name: '10. ทัศนคติผู้นำ (Growth Mindset & Team Collaboration)', max: 4, category: 'เกณฑ์การประเมินผลการเรียนรู้',
    levels: [
      'ถือตน หวงเคล็ด หรือเกาะตามพรรคไปส่งตัวตนอย่างเฉยเฉื่อย สารสัมพันธ์แตกขั้ว งานกลุ่มติดแหงก ขาดทิศทางขับกระบวนนวัตกรรม',
      'ช่วยเพื่อนได้ แค่อย่าเกินโซนรับเหมา รับฟังกติกาและแนะมาแต่อยากเลี่ยงบางพอยท์ ขอช่วยเฉพาะจำกัดงานของวิทยาลัยตนแค่นั้น',
      'The Standard Achiever — แบ่งหน้าจัดกระบวนสับเปลี่ยน รับมอบทำด้วยใจ ท้าทายและเติมความมุ่งหน้า ยอมกล้าติชม (Feedback Receiver) จากโค้ชครูได้โดยชิว ๆ',
      'The Impact Creator & Leader — สวมบทบาท Leadership กลืนปมปะทะ นำอุปสรรคมาถกหา Prompt แหลมคม สร้าง Ecosystem ดันศักยภาพลูกทีม แสวงเป้าทับเพื่อนกลุ่มเรียนทุกโซนเป็นผู้เชี่ยวชาญร่วมแบ่งปัน'
    ]},

  // ══════════════════════════════════════════════════════════════
  // 🌟 แผ่นที่ 2: แบบบันทึกการประเมินตนเอง (Student Self-Assessment)
  // (เพื่อกระตุ้นจิตสำนึกให้เด็กเป็น Growth Mindset นวัตกรดิจิทัล)
  // ══════════════════════════════════════════════════════════════
  { name: '1. ทักษะ AI Prompting & Content — ฉันสั่ง AI จนกลายเป็นนวัตกรรมได้', max: 4, category: 'แบบบันทึกการประเมินตนเอง (Student Self-Assessment)',
    levels: [
      'ฉันยังสั่ง AI ไม่เป็น พิมพ์โจทย์ลงไปแล้วได้ผลลัพธ์ไม่ตรงใจ สุดท้ายต้องไปหารูปจากเว็บฟรีมาประกอบเอง',
      'ฉันสั่ง AI แบบกว้าง ๆ ได้ผลลัพธ์ใช้งานพอได้ แต่ชิ้นงานหน้าตาคล้ายของเพื่อนคนอื่น ไม่มีจุดเด่นของตัวเอง',
      'ทำได้ดีตามเป้าหมาย — ฉันออกแบบ Prompt ได้ตรงโจทย์ ได้ภาพและเนื้อหาตามที่ตั้งใจ ครบทั้ง 4 โมดูล สวน-ป่า-นา-เล',
      'มือโปร / ขยายผลได้! — ฉันคิด Prompt ซับซ้อนได้เอง (Iterative Prompt) ปรับแต่งจนได้ชิ้นงานคุณภาพระดับเอเยนซีโฆษณา และสอนเพื่อนตั้ง Prompt ได้ด้วย'
    ]},
  { name: '2. วิจารณญาณ Fact-Checking — ฉันคือนายประตูของปัญญาประดิษฐ์', max: 4, category: 'แบบบันทึกการประเมินตนเอง (Student Self-Assessment)',
    levels: [
      'ฉันก๊อปผลลัพธ์จาก AI มาใช้ทันที โดยไม่ตรวจสอบความถูกต้อง คิดว่า AI ต้องถูกอยู่แล้ว',
      'ฉันแก้คำที่ดูแปลก ๆ บ้าง แต่เชื่อ ChatGPT เป็นส่วนใหญ่ เช็คข้อมูลจากปราชญ์เฉพาะบางจุดเท่านั้น',
      'ทำได้ดีตามเป้าหมาย — ฉันรู้วิธีตรวจสอบข้อมูล มีแหล่งอ้างอิงทุกชิ้น และ recheck กับข้อมูลท้องถิ่นระยองเสมอเมื่อสงสัย',
      'มือโปร / ขยายผลได้! — ฉันจับ AI Hallucination ได้ทันที แก้ด้วยข้อมูลจริงจากปราชญ์ชาวบ้าน และบันทึก AI Audit Log ครบทุกครั้ง'
    ]},
  { name: '3. มนต์สะกดด้วยภาษา (Bilingual) — ฉันดึงนักท่องเที่ยวต่างชาติมาเที่ยวระยองได้', max: 4, category: 'แบบบันทึกการประเมินตนเอง (Student Self-Assessment)',
    levels: [
      'ฉันให้ AI แปลภาษาอังกฤษทั้งหมดโดยไม่ตรวจ ผลออกมาแข็งทื่อ ผู้ชมต่างชาติไม่เข้าใจสาระของโครงการ',
      'วิดีโอภาษาอังกฤษของฉันยังเป็นการแปลตรงตัว (Word-for-Word) มีคำไทยปนบ้าง ขาดความเป็นธรรมชาติ',
      'ทำได้ดีตามเป้าหมาย — ฉันแก้ภาษาอังกฤษให้ถูกหลักไวยากรณ์ โครงประโยคลื่นไหล แนะนำแหล่งท่องเที่ยวระยองได้คล่อง',
      'มือโปร / ขยายผลได้! — ฉันเขียนสคริปต์สองภาษาระดับ Hi-class สะท้อนวิถีระยองได้ลึกซึ้ง พร้อมนำเสนอเวที Biennale และดึงดูดผู้ชมต่างชาติได้จริง'
    ]},
  { name: '4. พิทักษ์ระยองบนคัมภีร์ ESG — โปรเจกต์ฉันช่วยลดโลกร้อนและสร้างรายได้ชุมชน', max: 4, category: 'แบบบันทึกการประเมินตนเอง (Student Self-Assessment)',
    levels: [
      'ฉันมุ่งทำโปรเจกต์ให้เสร็จทันส่ง โดยไม่ได้คำนึงถึงผลกระทบต่อสิ่งแวดล้อมหรือชุมชน',
      'ฉันใส่ประเด็นชุมชนเข้าไปบ้าง แต่หลักยังเน้นผลกำไร ขาดมิติของการสร้างคุณค่าให้พื้นที่',
      'ทำได้ดีตามเป้าหมาย — ฉันออกแบบกิจกรรมท่องเที่ยวรักษ์โลก (Responsible Tourism) ตามมาตรฐาน Net-Zero และมีกลไกอนุรักษ์สิ่งแวดล้อมระยอง',
      'มือโปร / ขยายผลได้! — ฉันคำนวณ ROI พร้อม SROI (ผลกระทบทางสังคม) วัดมูลค่าลดขยะและรายได้ชุมชนเป็นตัวเลขได้ ระดับยื่นของบ SET ได้จริง'
    ]},
  { name: '5. กัลยาณมิตรอัจฉริยะ (Team & Locals) — ฉันคุยกับชุมชนและเข้ากับทีมได้ดี', max: 4, category: 'แบบบันทึกการประเมินตนเอง (Student Self-Assessment)',
    levels: [
      'ฉันยังเขินอายเวลาคุยกับปราชญ์ชาวบ้าน พูดน้อย ไม่กล้าถาม และไม่ค่อยมีส่วนร่วมในทีม',
      'ฉันทำตามที่ทีมแบ่งหน้าที่ให้ ช่วยถาม AI ตามจังหวะ แต่ไม่ได้ขับเคลื่อนหรือเสนอไอเดียใหม่ ๆ',
      'ทำได้ดีตามเป้าหมาย — ฉันร่วมวางแผนกับทีม ช่วยควบคุมไทม์ไลน์ คุยกับปราชญ์ด้วยความสุภาพ และรับฟัง feedback จากครูได้อย่างเปิดใจ',
      'มือโปร / ขยายผลได้! — ฉันเป็นผู้นำทีม (Team Master) ฟังเพื่อนอย่างลึกซึ้ง (Deep Listening) แก้ปัญหาความขัดแย้ง และสร้างความเชื่อใจกับชุมชนได้ดีเยี่ยม'
    ]}
];

// ─────────────────────────────────────────────────────────
// AI Audit Logbook — 6-column hallucination tracking form
// Based on: "กระบวนการนำ AI มาใช้อย่างลึกซึ้งและมีการตรวจสอบจริง"
// Each entry trains Critical Thinking + Corrective Prompting + Ethics Reflection
// ─────────────────────────────────────────────────────────
export const AI_AUDIT_LOG_COLUMNS = [
  { key: 'hallucination',    label: '1. ผลลัพธ์แรกที่ AI มโนขึ้นมา',         sub: 'Initial AI Output / Hallucination',  placeholder: 'AI พิมพ์ว่า "...." ซึ่งเป็นข้อมูลที่ AI สร้างขึ้นเองหรือผิดเพี้ยน', icon: '🤖', color: '#dc2626' },
  { key: 'verification',     label: '2. กระบวนการสอบทานข้อเท็จจริง',         sub: 'On-Site Verification & Source',      placeholder: 'อ้างอิงจากคุณลุง/ป้า ... ลงพื้นที่จริงเมื่อ DD/MM\nข้อเท็จจริง: ...', icon: '🔍', color: '#0891b2' },
  { key: 'risk',             label: '3. วิเคราะห์ความเสียหายหากเผยแพร่',    sub: 'Risk & Impact Analysis',             placeholder: 'Fake Scale: บิดเบือน X%\nความเสียหาย: ทำให้ ... เสียภาพลักษณ์ / กระทบ UNESCO Learning City / Greenwashing', icon: '⚠️', color: '#ea580c' },
  { key: 'correctivePrompt', label: '4. คำสั่งปราบ AI (ชุดคำสั่งแก้งาน)',    sub: 'Corrective Prompting',               placeholder: '"โปรดแก้ไขเนื้อหาทั้งหมด ห้ามพูดถึง... ให้ใส่ข้อเท็จจริงว่า ... และเปลี่ยนรูปภาพเป็น ..."', icon: '⚡', color: '#7c3aed' },
  { key: 'finalOutput',      label: '5. ผลลัพธ์ที่สัตย์จริง',                sub: 'Final Validated Output',             placeholder: '"... ข้อความ/บทพูดที่ถูกต้องผ่าน AI Audit แล้ว ..."', icon: '✅', color: '#16a34a' },
  { key: 'reflection',       label: '6. บทเรียนด้านจริยธรรมสื่อ',            sub: 'AI Ethics Reflection',               placeholder: 'เรียนรู้ว่า: ไม่ควรไว้ใจ Generative AI ในเรื่อง ... ข้อมูลภูมิปัญญาจากปราชญ์ชาวบ้านมีความสำคัญสูงสุดเสมอ', icon: '💭', color: '#0d9488' }
];

export const EXAMPLE_AUDIT_ENTRIES = [
  {
    id: 'example_1',
    isExample: true,
    domain: 'ประวัติศาสตร์/ป่า',
    hallucination: 'AI เขียนว่า "พระเจดีย์กลางน้ำ ระยอง สร้างขึ้นเพื่อความสวยงามดึงดูดนักท่องเที่ยว และมีฝูงนกเพนกวินและต้นเมเปิ้ลให้ชม"',
    verification: 'อ้างอิง: คุณลุงปราโมทย์ (ปราชญ์ป่าชายเลน) / ลงพื้นที่จริงเมื่อ XX/XX/XX\nข้อเท็จจริง: สร้างในสมัยรัชกาลที่ 5 เป็นสัญลักษณ์ว่าถึงระยองแล้ว ไม่มีนกเพนกวิน มีแต่นกกินเปี้ยวและป่าโกงกาง',
    risk: 'Fake Scale: บิดเบือน 100%\nความเสียหาย: ผิดประวัติศาสตร์ขั้นร้ายแรง ทำให้ UNESCO Learning City ขาดความน่าเชื่อถือ และระบบนิเวศป่าชายเลนไทยดูเป็นตัวตลก (Greenwashing)',
    correctivePrompt: '"โปรดแก้ไขเนื้อหาทั้งหมด ห้ามพูดถึงต้นเมเปิ้ลและนกเพนกวิน ให้ใส่ข้อเท็จจริงว่า \'สร้างโดยพระยาศรีสมุทรโภคชัยฯ ปี 2416\' และเปลี่ยนรูปภาพ AI เป็นป่าโกงกางและนกกินเปี้ยวท้องถิ่นเท่านั้น"',
    finalOutput: '"ป่าชายเลนพระเจดีย์กลางน้ำ ระยอง มรดกประวัติศาสตร์ปี 2416 แหล่งอนุบาลนกกินเปี้ยวและระบบนิเวศ Blue Carbon ศูนย์กลางลมหายใจอุตสาหกรรม"',
    reflection: 'ไม่ควรไว้ใจ Generative AI ในเรื่องประวัติศาสตร์และชีววิทยาท้องถิ่น ข้อมูลภูมิปัญญาจากปราชญ์ชาวบ้านมีความสำคัญสูงสุดเสมอ'
  },
  {
    id: 'example_2',
    isExample: true,
    domain: 'ภาษา/Localization',
    hallucination: 'AI แปลแคปชันเชิญชวนเที่ยวชุมชนโดยแปลคำว่า "ระยองฮิ... ยินดีต้อนรับ" ออกมาเป็นภาษาอังกฤษว่า "Rayong Hi... Welcome"',
    verification: 'อ้างอิง: ครูแผนกภาษาต่างประเทศ / คู่มือศัพท์ท้องถิ่นระยอง\nข้อเท็จจริง: คำว่า "ฮิ" เป็นคำสร้อยบอกความน่ารักและเป็นกันเองของชาวระยอง ไม่ใช่การทักทาย (Hi)',
    risk: 'Fake Scale: ผิดเพี้ยนเชิงบริบท\nความเสียหาย: เสน่ห์และเอกลักษณ์ภาษาถิ่นสูญหาย ฝรั่งเข้าใจว่าคนระยองพูดสวัสดีซ้อนกัน สื่อถึงความไม่มืออาชีพด้านการแปลสองภาษา',
    correctivePrompt: '"ทำหน้าที่เป็นผู้เชี่ยวชาญการแปลแบบ Localization ขอให้ใช้คำว่า \'Rayong Hi (ระยองฮิ)\' ไว้เหมือนเดิม แต่ให้วงเล็บด้านหลังสั้น ๆ อธิบายความหมายเชิงวัฒนธรรมว่านี่คือคำสร้อยอันมีเสน่ห์ของชาวระยอง"',
    finalOutput: '"Welcome to Rayong, or as locals proudly end their warm sentences: \'Rayong-Hi\' (A unique charming Thai local suffix)."',
    reflection: 'AI ขาดความละเอียดอ่อนในอารมณ์และสำเนียงถิ่น (Local Charm) หน้าที่ของมนุษย์คือการใส่จิตวิญญาณเพื่อส่งออกระดับ Biennale'
  },
  {
    id: 'example_3',
    isExample: true,
    domain: '🌳 สวน — เกษตร/ผลไม้ระยอง',
    hallucination: 'AI เขียนว่า "ทุเรียนระยองพันธุ์ดีที่สุดคือ หมอนทอง ออกผลตลอดทั้งปี เก็บได้เดือนละครั้ง"',
    verification: 'อ้างอิง: ลุงสมพร (ปราชญ์สวนทุเรียนแกลง 30 ปี) + เว็บไซต์กรมวิชาการเกษตร / ลงพื้นที่ 14 พ.ค. 2569\nข้อเท็จจริง:\n  1. พันธุ์เด่นของระยองคือ "ก้านยาว" และ "ชะนี" ไม่ใช่หมอนทอง (พันธุ์หมอนทองเด่นในจันทบุรี-ตราด)\n  2. ทุเรียนออกผลตามฤดูเดียว — เม.ย. ถึง ก.ค. (ฤดูร้อน-ต้นฝน) เท่านั้น\n  3. การเก็บเกี่ยวขึ้นกับ "วัดน้ำหนัก/หู" ไม่ใช่ "เดือนละครั้ง"',
    risk: 'Fake Scale: บิดเบือน 80%\nความเสียหาย: นักท่องเที่ยวจองทัวร์มาดูทุเรียนเดือน ต.ค. → ผิดหวัง · บั่นทอนชื่อเสียงพันธุ์ "ก้านยาว/ชะนีระยอง" ที่เป็นจุดขาย Soft Power · ทำให้ชาวสวนเสียโอกาสการตลาด',
    correctivePrompt: '"แก้เนื้อหา: (1) ระบุพันธุ์เด่นระยองคือ ก้านยาว + ชะนี (2) ฤดูเก็บเกี่ยว เม.ย.-ก.ค. เท่านั้น (3) ลบข้อความ "ออกผลทั้งปี" ทิ้ง · เพิ่มข้อมูล GI (Geographical Indication) ของทุเรียนแกลง"',
    finalOutput: '"ทุเรียนระยอง — สายพันธุ์ \'ก้านยาว\' รสหวานละมุน และ \'ชะนี\' เนื้อเนียนนุ่ม เป็นเอกลักษณ์ของอำเภอแกลง · ฤดูเก็บเกี่ยว เม.ย. ถึง ก.ค. เท่านั้น · ผ่านการรับรอง GI Thailand"',
    reflection: 'AI ชอบ "ตอบกลางๆ" โดยใช้สิ่งที่คนรู้จัก (หมอนทอง) แทนสิ่งที่เป็นจริงของท้องถิ่น — ต้องตรวจกับปราชญ์ในพื้นที่จริงเสมอ'
  },
  {
    id: 'example_4',
    isExample: true,
    domain: '🌊 เล — วิถีชาวประมง',
    hallucination: 'AI เขียนว่า "ชาวประมงระยองออกเรือหาปลาทุกวันตลอดปี โดยใช้เรือไฟเบอร์กลาสติดเครื่องยนต์ขนาดใหญ่ จับปลาทูน่าและฉลามได้ทุกฤดู"',
    verification: 'อ้างอิง: ลุงเฉลิมชัย (ปราชญ์ชาวประมงพื้นบ้าน 40 ปี) + กรมประมง / ลงพื้นที่ 13 พ.ค. 2569\nข้อเท็จจริง:\n  1. ชาวประมงพื้นบ้านเกาะกกใช้ "เรือหางยาวไม้" ไม่ใช่เรือไฟเบอร์กลาส\n  2. ออกเรือ พ.ค.-ต.ค. (มรสุมตะวันตกเฉียงใต้) งดเรือใหญ่ พ.ย.-ก.พ. (คลื่นสูง 2-3 ม.)\n  3. จับปลาทู ปลาหมึก ปูม้า กุ้ง — ไม่มีฉลาม/ทูน่า (เป็นปลาน้ำลึก-ห่างฝั่ง)',
    risk: 'Fake Scale: บิดเบือน 100% (วิถี + เครื่องมือ + ฤดู + ชนิดสัตว์)\nความเสียหาย:\n  • นักท่องเที่ยวออกเรือเดือน ธ.ค. → คลื่นใหญ่ → อันตรายชีวิต\n  • ภาพลักษณ์ชาวประมงพื้นบ้านดูเหมือน "อุตสาหกรรมประมง" ผิดบริบท\n  • ผิดหวังที่ไม่ได้เห็นฉลาม/ทูน่า → รีวิวลบ',
    correctivePrompt: '"แก้ข้อมูล: (1) เรือคือ "หางยาวไม้พื้นบ้าน" (2) ฤดูคือ พ.ค.-ต.ค. เท่านั้น (3) สัตว์จับได้คือ ปลาทู ปลาหมึก ปูม้า กุ้ง — ลบฉลาม/ทูน่า · เพิ่มภูมิปัญญา "ดูดาวเหนือ" ก่อนออกเรือ"',
    finalOutput: '"ชาวประมงพื้นบ้านเกาะกก — สืบทอดวิถี \'เรือหางยาวไม้\' ออกเรือตามฤดูมรสุมตะวันตกเฉียงใต้ (พ.ค.-ต.ค.) จับปลาทู ปลาหมึก ปูม้า กุ้งเคย ด้วยภูมิปัญญา \'ดูดาวเหนือก่อนออกเรือ\' Soft Power แห่งทะเลตะวันออก"',
    reflection: 'AI ตอบแบบ "Generic Fishing" ไม่แยก Industrial vs Artisanal — เราต้องใส่บริบทท้องถิ่นเชิงลึก ไม่งั้นเสียทั้งความถูกต้องและความปลอดภัย'
  },
  {
    id: 'example_5',
    isExample: true,
    domain: '🌾 นา — เกษตรกรรม/ข้าว',
    hallucination: 'AI เขียนว่า "นาข้าวเกาะกกทำนาปีละ 4 ครั้ง พันธุ์ข้าวหอมมะลิ 105 ใช้ปุ๋ยเคมีและยาฆ่าแมลงตามสูตร CP สมัยใหม่"',
    verification: 'อ้างอิง: ลุงประยูร (ปราชญ์ชาวนาเกาะกก 45 ปี) + วิสาหกิจชุมชนข้าวอินทรีย์ / ลงพื้นที่ 15 พ.ค. 2569\nข้อเท็จจริง:\n  1. ทำนาได้ "2 ครั้ง" (นาปี พ.ค.-พ.ย. + นาปรัง ธ.ค.-เม.ย.) เพราะดินเค็มชายฝั่ง\n  2. พันธุ์เด่นคือ "ปทุมธานี 1" (ทนเค็ม) + "หอมมะลิแดง" — ไม่ใช่หอมมะลิ 105 (ปลูกในอีสาน)\n  3. ใช้ระบบเกษตรอินทรีย์ — ปุ๋ยมูลควาย + น้ำหมักสมุนไพร ไม่ใช้สารเคมี',
    risk: 'Fake Scale: บิดเบือน 100%\nความเสียหาย:\n  • ขาดมุมมอง "เกษตรอินทรีย์" ที่เป็นจุดขาย ESG ของชุมชน\n  • พันธุ์ผิด → ทัวร์เกษตรพลาดดูพันธุ์ท้องถิ่นทนเค็ม\n  • ทำลายภาพลักษณ์ Net-Zero ของวิสาหกิจชุมชน',
    correctivePrompt: '"แก้: (1) นาปีละ 2 ครั้ง (นาปี/นาปรัง) (2) พันธุ์ปทุมธานี 1 + หอมมะลิแดง (3) เน้นเกษตรอินทรีย์ ปุ๋ยมูลควาย น้ำหมักสมุนไพร · เพิ่ม Story ของชุมชนที่ผ่านมาตรฐาน Organic Thailand"',
    finalOutput: '"นาข้าวเกาะกก — มรดกแห่งดินเค็มชายฝั่ง ปลูก \'ปทุมธานี 1\' และ \'หอมมะลิแดง\' ด้วยภูมิปัญญาเกษตรอินทรีย์ ปุ๋ยมูลควาย-น้ำหมักสมุนไพร · ทำนาปีละ 2 ครั้ง (พ.ค.-พ.ย. + ธ.ค.-เม.ย.) · ผ่านมาตรฐาน Organic Thailand"',
    reflection: 'AI ใช้ default knowledge (CP, หอมมะลิ 105) แทนของท้องถิ่น — ต้อง prompt ให้ระบุ "พื้นที่ดินเค็มชายฝั่งตะวันออก" เพื่อให้ AI ตอบตรงบริบท'
  },
  {
    id: 'example_6',
    isExample: true,
    domain: '🍳 อาหาร/ภูมิปัญญา',
    hallucination: 'AI สรุปวิธีทำกะปิเคยเกาะกกว่า "ใช้กุ้งทะเลแบบใดก็ได้ ผสมเกลือเสริมไอโอดีน หมักในขวดแก้ว 7 วันก็เสร็จ"',
    verification: 'อ้างอิง: ป้าสายใจ (ปราชญ์การทำกะปิ 50 ปี) + วิสาหกิจกะปิเคยเกาะกก / ลงพื้นที่ 16 พ.ค. 2569\nข้อเท็จจริง:\n  1. ใช้ "เคย" (กุ้งขนาดเล็กพิเศษ) ไม่ใช่กุ้งทะเลทั่วไป — ตักได้เฉพาะปลายฤดูฝน\n  2. ใช้ "เกลือทะเลธรรมชาติ" จากนาเกลือสมุทรสาคร — ห้ามเกลือไอโอดีน (ทำให้เน่าเสีย)\n  3. หมักในไหดินเผา 3-6 เดือน (ไม่ใช่ 7 วัน) + ตำด้วยกระต่ายไม้ไผ่ทุก 3 วัน',
    risk: 'Fake Scale: บิดเบือน 100%\nความเสียหาย:\n  • ถ้านักเรียนทำตาม → กะปิเน่าเสีย → อาหารเป็นพิษ (อันตรายต่อชีวิต)\n  • ภูมิปัญญาดั้งเดิม 100+ ปี สูญหายเพราะสับสนกับสูตร AI\n  • เสียมาตรฐาน "อาหารชุมชน" ที่ส่งออกระดับ Slow Food International',
    correctivePrompt: '"แก้สูตรให้ถูกต้องเป็นภูมิปัญญาเกาะกก: (1) ใช้ \'เคย\' เฉพาะปลายฤดูฝน (2) เกลือทะเลธรรมชาติเท่านั้น (3) ไหดินเผา หมัก 3-6 เดือน (4) ตำกระต่ายไม้ไผ่ทุก 3 วัน · ใส่คำเตือนเรื่อง Food Safety"',
    finalOutput: '"กะปิเคยเกาะกก — ภูมิปัญญา 100+ ปี · ใช้ \'เคย\' ปลายฤดูฝน + เกลือทะเลธรรมชาติสมุทรสาคร · หมักในไหดินเผา 3-6 เดือน ตำกระต่ายไม้ไผ่ทุก 3 วัน · มาตรฐาน Slow Food Community Cuisine"',
    reflection: 'AI เร่งสรุปและละทิ้งรายละเอียดสำคัญด้านความปลอดภัยอาหาร — สูตรอาหารต้องตรวจกับผู้เชี่ยวชาญจริงเสมอ ไม่ใช่ "เร็วและสะดวก"'
  },
  {
    id: 'example_7',
    isExample: true,
    domain: '⚡ IoT/Technical',
    hallucination: 'AI แนะนำว่า "ใช้ Arduino UNO + เซ็นเซอร์ DHT11 วัดค่าอากาศในป่าชายเลน ส่งข้อมูลผ่าน WiFi ไป Firebase ใช้แบตเตอรี่ AA 4 ก้อนใช้งานได้ 6 เดือน"',
    verification: 'อ้างอิง: อ.ครรชิต (ครูช่างไฟฟ้า) + Datasheet ESP32 / ทดลอง 17 พ.ค. 2569\nข้อเท็จจริง:\n  1. Arduino UNO "ไม่มี WiFi" — ต้องใช้ ESP32 หรือ ESP8266\n  2. DHT11 ความแม่นยำต่ำ (±2°C, ±5%RH) ไม่เหมาะป่าชายเลน — ควรใช้ DHT22 หรือ BME280\n  3. ESP32 + WiFi กิน ~150mA ขณะส่งข้อมูล → AA 4 ก้อนใช้ได้ ~3 วัน ไม่ใช่ 6 เดือน — ต้องใช้ Solar + LiPo',
    risk: 'Fake Scale: บิดเบือนเชิงเทคนิค 100%\nความเสียหาย:\n  • ทีมซื้ออุปกรณ์ผิด → งบประมาณเสีย\n  • Project deploy ในป่าจริง → แบตหมดใน 3 วัน → ข้อมูลขาดหาย\n  • ความน่าเชื่อถือต่อ "ระบบ IoT ของชุมชน" ลดลง',
    correctivePrompt: '"แก้ Hardware spec: (1) ใช้ ESP32 (มี WiFi built-in) (2) DHT22 หรือ BME280 (3) Solar Panel 5W + LiPo 2000mAh + TP4056 charger · คำนวณ power budget ใหม่ตามสมจริง"',
    finalOutput: '"IoT Station ป่าชายเลนเกาะกก: ESP32 + DHT22 + Soil pH sensor · พลังงาน Solar 5W + LiPo 2000mAh · ส่ง Firebase ทุก 15 นาที · ใช้งานต่อเนื่อง 12+ เดือนโดยไม่ต้องเปลี่ยนแบต"',
    reflection: 'AI ตอบ "ทั่วๆ ไป" โดยไม่คำนวณ power budget จริง — Engineering ต้องตรวจสูตรกับ datasheet + ทดลองจริงเสมอ'
  },
  {
    id: 'example_8',
    isExample: true,
    domain: '⚖️ ESG/กฎหมาย',
    hallucination: 'AI แนะนำว่า "ติดป้ายห้ามทิ้งขยะที่ชายหาด ปรับเงิน 100 บาท เป็นเพียงพอแล้ว ตามกฎหมายไทย"',
    verification: 'อ้างอิง: เทศบาลเมืองระยอง + พ.ร.บ.รักษาความสะอาด พ.ศ. 2535 / สอบถาม 18 พ.ค. 2569\nข้อเท็จจริง:\n  1. ค่าปรับทิ้งขยะในที่สาธารณะของไทยจริงคือ "ไม่เกิน 2,000 บาท" ตาม พ.ร.บ.2535\n  2. ในเขตอุทยานทางทะเล ค่าปรับเพิ่มเป็น "5,000-100,000 บาท + จำคุก" ตาม พ.ร.บ.อุทยานแห่งชาติ\n  3. ป้ายต้องระบุ "หน่วยงานบังคับใช้" + "เบอร์แจ้งเหตุ" จึงจะมีผลทางกฎหมาย',
    risk: 'Fake Scale: ข้อมูลกฎหมายผิด 95%\nความเสียหาย:\n  • ป้ายไม่มีผลทางกฎหมาย → คนยังทิ้งขยะ\n  • ถ้านักเรียนใช้ข้อมูลในรายงาน → ครูตรวจ → คะแนนตก\n  • ภาพลักษณ์ชุมชนดูไม่จริงจังกับการอนุรักษ์',
    correctivePrompt: '"ตรวจค่าปรับจริงจาก พ.ร.บ. ปี 2535 + พ.ร.บ.อุทยานฯ · ออกแบบป้ายที่มี: (1) ฐานกฎหมายอ้างอิง (2) ค่าปรับสูงสุด 2,000-100,000 บาท + จำคุก (3) เบอร์ \'สายด่วน 1192\' ของกรมอุทยาน"',
    finalOutput: '"⚠ ห้ามทิ้งขยะในเขตป่าชายเลนเกาะกก · ตาม พ.ร.บ.อุทยานแห่งชาติ + พ.ร.บ.รักษาความสะอาด 2535 · ค่าปรับสูงสุด 100,000 บาท + จำคุก · แจ้งเหตุ สายด่วน 1192 (กรมอุทยาน) หรือ 1567 (มหาดไทย)"',
    reflection: 'AI ตอบ "ฟังดูสมเหตุสมผล" แต่ตัวเลขกฎหมายต้องอ้างอิงพระราชบัญญัติจริง — ห้ามใช้ AI แทนที่การตรวจสอบเอกสารราชการ'
  },
  {
    id: 'example_9',
    isExample: true,
    domain: '🛕 สถาปัตยกรรม/ศาสนา',
    hallucination: 'AI เขียนว่า "วัดบ้านเพ ระยอง สร้างในสมัยรัชกาลที่ 9 เป็นวัดสไตล์เขมร มีพระพุทธรูปทองคำสูง 50 เมตร เป็นที่นิยมในหมู่นักท่องเที่ยวจีน"',
    verification: 'อ้างอิง: พระอธิการสุรินทร์ (เจ้าอาวาส) + หนังสือประวัติวัดเมืองระยอง / ลงพื้นที่ 19 พ.ค. 2569\nข้อเท็จจริง:\n  1. วัดบ้านเพสร้างสมัย "รัชกาลที่ 5" (ปี 2440) ไม่ใช่ ร.9\n  2. สถาปัตยกรรม "ไทยภาคกลางผสมจีนโพ้นทะเล" (เพราะชาวประมงจีนสร้างถวาย) ไม่ใช่เขมร\n  3. มีพระประธาน "หลวงพ่อโต" ปูนปั้น สูง 3 เมตร — ไม่ใช่ทองคำ 50 เมตร',
    risk: 'Fake Scale: บิดเบือน 100% (ทุกข้อผิดหมด)\nความเสียหาย:\n  • ผิดต่อความเชื่อทางศาสนา → ชาวบ้านเสียใจ\n  • นักท่องเที่ยวคาดหวังพระทองคำ → ผิดหวัง → รีวิวลบ\n  • ทำลายประวัติความสัมพันธ์ไทย-จีนโพ้นทะเลของระยอง',
    correctivePrompt: '"แก้ประวัติให้ถูกต้อง: (1) สมัย ร.5 ปี 2440 (2) สถาปัตยกรรมไทยภาคกลางผสมจีนโพ้นทะเล (3) หลวงพ่อโต ปูนปั้น 3 เมตร · เพิ่ม Story ของชาวประมงจีนที่สร้างถวาย"',
    finalOutput: '"วัดบ้านเพ ระยอง — มรดกศตวรรษ! สร้างปี 2440 (ร.5) โดยกลุ่มชาวประมงจีนโพ้นทะเลที่ลี้ภัยมาตั้งรกราก · สถาปัตยกรรมไทยภาคกลางผสมจีน · หลวงพ่อโต ปูนปั้นโบราณ 3 เมตร · สัญลักษณ์มิตรภาพไทย-จีน 130+ ปี"',
    reflection: 'AI ชอบ "เกินจริง" เพื่อให้ดูน่าตื่นเต้น (พระทอง 50 ม.) — ประวัติศาสนาต้องตรวจกับเอกสารวัดและพระอาวุโสเสมอ'
  },
  {
    id: 'example_10',
    isExample: true,
    domain: '🎨 Soft Power/วัฒนธรรม',
    hallucination: 'AI แนะนำว่า "การนำเสนอ Soft Power เกาะกกให้ใช้รูปวง K-Pop ร่วมกับชายหาด + ใช้คำว่า \'Sabai Sabai\' เป็น tagline เพื่อดึงดูดต่างชาติ"',
    verification: 'อ้างอิง: อ.มณีรัตน์ (ครูสอนการตลาดดิจิทัล) + คู่มือ Thailand Brand Identity จาก ททท. / 20 พ.ค. 2569\nข้อเท็จจริง:\n  1. ใช้ภาพ K-Pop = "Cultural Appropriation" (ขโมยวัฒนธรรม) ไม่ใช่ Soft Power ระยอง\n  2. คำว่า "Sabai Sabai" เป็น stereotype จากภาคกลาง — ระยองมี "ฮิ", "ไฮ", "อะอุ๊ย" ที่เด่นกว่า\n  3. ที่ถูกควรใช้ภาพ "ปราชญ์ + ของจริงในพื้นที่" เช่น คุณป้าตำกะปิ คุณลุงทอเสื่อกก',
    risk: 'Fake Scale: เชิงวัฒนธรรม 100%\nความเสียหาย:\n  • ขาดจุดยืน Local Identity → แข่งกับ Soft Power เกาหลีไม่ได้\n  • "Sabai Sabai" = ภาพ stereotype → ลดทอนความเฉพาะตัวของระยอง\n  • พลาดโอกาส UNESCO Learning City + Biennale 2027',
    correctivePrompt: '"ออกแบบ Brand Identity ใหม่: (1) ใช้ \'ระยองฮิ\' เป็น tagline (2) ภาพ Hero: ปราชญ์ชุมชน + ของท้องถิ่นจริง (3) Color: เขียวป่าชายเลน + ฟ้าทะเล + ส้มอาทิตย์อัสดง · ห้ามใช้ภาพ K-Pop หรือคำ Generic Thai"',
    finalOutput: '"Rayong Hi — Soft Power แห่งทะเลตะวันออก · ภาพ Hero: คุณป้าสายใจตำกะปิ + คุณลุงเฉลิมชัยทอเสื่อกก + พระอาทิตย์ตกหาดบ้านเพ · Color Palette: Mangrove Green + Andaman Blue + Sunset Orange · ภูมิใจในตัวตน ไม่ลอกใคร"',
    reflection: 'AI ตอบตามแบบ Mainstream ที่ฮิตในโลก แต่ Soft Power ต้องมาจาก "Authentic Local Identity" — เราต้องกล้าใช้ของจริงในพื้นที่ ไม่ใช่ของยืม'
  }
];

// Idempotent: pushes only rubrics whose name is not already in rubrics collection.
// Returns { inserted, skipped, total }.
export async function importMissingRubrics() {
  const snap = await getDocs(collection(db, 'rubrics'));
  const existing = new Set(snap.docs.map(d => d.data().name));
  let inserted = 0, skipped = 0;
  for (const r of STARTER_RUBRICS) {
    if (existing.has(r.name)) { skipped++; continue; }
    await addDoc(collection(db, 'rubrics'), r);
    inserted++;
  }
  return { inserted, skipped, total: STARTER_RUBRICS.length };
}

// Destructive: deletes ALL existing rubrics then re-inserts the latest STARTER_RUBRICS set.
// Use after updating rubric content in code so Firestore matches the new wording exactly.
// Returns { deleted, inserted, total }.
export async function replaceAllRubrics() {
  const snap = await getDocs(collection(db, 'rubrics'));
  let deleted = 0;
  for (const d of snap.docs) {
    await deleteDoc(doc(db, 'rubrics', d.id));
    deleted++;
  }
  let inserted = 0;
  for (const r of STARTER_RUBRICS) {
    await addDoc(collection(db, 'rubrics'), r);
    inserted++;
  }
  return { deleted, inserted, total: STARTER_RUBRICS.length };
}

// Idempotent: pushes only prompts whose title is not already in good_prompts.
// Returns { inserted, skipped, total }.
export async function importMissingGoodPrompts() {
  const snap = await getDocs(collection(db, "good_prompts"));
  const existing = new Set(snap.docs.map(d => d.data().title));
  let inserted = 0, skipped = 0;
  for (const p of STARTER_PROMPTS) {
    if (existing.has(p.title)) { skipped++; continue; }
    await addDoc(collection(db, "good_prompts"), { ...p, created_at: serverTimestamp() });
    inserted++;
  }
  return { inserted, skipped, total: STARTER_PROMPTS.length };
}

// ─── Auth ────────────────────────────────────────────────
// Heuristic — เดา role + name จาก username (สำหรับ self-heal เคส orphan Auth)
function inferRoleFromUsername(username) {
  const u = (username || '').toLowerCase();
  if (u === 'admin' || u.startsWith('admin'))     return { role: 'admin',   name: 'ผู้ดูแลระบบ' };
  if (u.startsWith('teacher') || u === 'jenchop' || u === 'paweena' || u === 'kulisara' || u === 'anchalee')
                                                  return { role: 'teacher', name: username };
  if (u.startsWith('sage'))                        return { role: 'sage',    name: username };
  if (u.startsWith('student'))                     return { role: 'student', name: username };
  return { role: 'student', name: username };
}

export async function login(username, password) {
  // Note: Firebase uses email. We append a domain if the user only provides a username.
  const email = username.includes('@') ? username : `${username}@eco.com`;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch extra user data from Firestore (role, name, team_id)
  let userDoc = await getDoc(doc(db, "users", user.uid));

  // Self-heal: ถ้า Auth สำเร็จแต่ Firestore doc หาย
  // (มักเกิดเพราะ Auth account เก่ามี UID ไม่ตรงกับ Firestore doc ใหม่หลัง reset)
  // → สร้าง doc ใหม่ให้อัตโนมัติ โดยเดา role จาก username
  if (!userDoc.exists()) {
    console.warn(`[Auth Self-Heal] User ${username} ผ่าน Auth แต่ไม่มี Firestore doc → สร้างใหม่`);
    const inferred = inferRoleFromUsername(username);
    const usernameClean = username.includes('@') ? username.split('@')[0] : username;
    await setDoc(doc(db, "users", user.uid), {
      username: usernameClean,
      name: inferred.name,
      role: inferred.role,
      email,
      team_id: null,
      created_at: serverTimestamp(),
      self_healed: true,  // flag ให้ admin เห็นว่าเป็น orphan ที่ถูกซ่อม
      self_healed_at: serverTimestamp()
    });
    userDoc = await getDoc(doc(db, "users", user.uid));
  }

  const userData = { id: user.uid, ...userDoc.data() };
  localStorage.setItem('eco_user', JSON.stringify(userData));
  return userData;
}

export async function logout() {
  await signOut(auth);
  localStorage.removeItem('eco_user');
}

// Send a Firebase password-reset email.
export async function resetUserPassword(email) {
  if (!email) throw new Error('email is required');
  await sendPasswordResetEmail(auth, email);
  return { ok: true };
}

export const getToken = () => localStorage.getItem('eco_user'); // Dummy for compatibility

// ─── Dashboard ───────────────────────────────────────────
// ─── Real-Time Listeners ──────────────────────────────────
export function subscribeToStats(callback) {
  const teamsRef = collection(db, "teams");

  // Re-aggregate on every teams change. Submissions are queried with the new
  // 'step' field (we used to call it 'type').
  return onSnapshot(teamsRef, async (teamsSnap) => {
    const qSub = query(collection(db, "submissions"), where("step", "==", "gateway"));
    const subSnap = await getDocs(qSub);

    // Count distinct teams that have ANY submission for the prompt-count proxy
    const promptSnap = await getDocs(collection(db, "team_scores"));

    callback({
      totalTeams: teamsSnap.size,
      submitted:  subSnap.size,
      pending:    Math.max(0, teamsSnap.size - subSnap.size),
      aiPrompts:  promptSnap.size || 0
    });
  });
}

export function subscribeToFeed(callback) {
  const q = query(collection(db, "activity_log"), orderBy("created_at", "desc"), limit(15));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ 
      id: d.id, 
      ...d.data(), 
      created_at: d.data().created_at?.toDate() || new Date() 
    }));
    callback(data);
  });
}

export function subscribeToTeams(callback) {
  return onSnapshot(
    collection(db, "teams"),
    (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    },
    (err) => {
      console.error('[subscribeToTeams] listener error:', err.code, err.message);
    }
  );
}

// ── ติดตาม user doc ของตัวเอง (sync team_id / role เมื่อ Admin แก้ไข) ──────
export function subscribeToUserDoc(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

// ─── Teams ───────────────────────────────────────────────
export async function getTeams() {
  // getDocsFromServer บังคับดึงจาก Firestore server ตรง ๆ (ไม่ใช้ cache)
  const snap = await getDocsFromServer(collection(db, "teams"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Fetch all submissions for a team as a single object keyed by step name.
// Content is stored as a JSON string by handleSave; parse if possible so the UI
// can read it as { [step]: parsedObject }.
export async function getTeamSubmissionData(teamId) {
  const q = query(collection(db, "submissions"), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  const data = {};
  snap.forEach(d => {
    const row = d.data();
    try   { data[row.step] = JSON.parse(row.content); }
    catch { data[row.step] = row.content; }
  });
  return data;
}

// ─── Submissions ─────────────────────────────────────────
export async function getSubmissions(teamId) {
  const q = query(collection(db, "submissions"), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Accepts both camelCase (teamId — current handleSave) and snake_case (team_id — older callers).
export async function saveSubmission(body) {
  const teamId  = body.teamId  ?? body.team_id;
  const step    = body.step;
  const content = body.content;
  const fileUrl = body.fileUrl ?? body.file_url ?? null;

  if (!teamId || !step) throw new Error('saveSubmission: teamId and step are required');

  const docId = `${teamId}_${step}`;
  await setDoc(doc(db, "submissions", docId), {
    team_id: teamId,
    step,
    content,
    file_url: fileUrl,
    submitted_at: serverTimestamp()
  });

  // Log activity
  await addDoc(collection(db, "activity_log"), {
    team_id: teamId,
    action: 'submit',
    detail: `Step ${step}`,
    created_at: serverTimestamp()
  });
}

// ─── Rubrics ───────────────────────────────────────
export async function getRubrics() {
  const snap = await getDocs(collection(db, "rubrics"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Real-time subscription — refreshes when admin creates/deletes/edits a rubric.
export function subscribeToRubrics(callback) {
  return onSnapshot(collection(db, "rubrics"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Submission Gateway: Per-Step Drafts ──────────────
// Draft = work-in-progress before student commits the final 'gateway' submission.
// Uses docId `${teamId}_gateway_draft`. Tracks which steps the student explicitly saved
// (out-of-order is allowed — ส่งขั้น 6 ก่อนขั้น 1 ก็ได้).
export async function saveGatewayStepDraft(teamId, gatewayData, stepNum) {
  if (!teamId || !stepNum) throw new Error('saveGatewayStepDraft: teamId and stepNum required');
  const docId = `${teamId}_gateway_draft`;
  const ref = doc(db, 'submissions', docId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : { saved_steps: [] };
  const stepsSet = new Set(existing.saved_steps || []);
  stepsSet.add(Number(stepNum));
  await setDoc(ref, {
    team_id: teamId,
    step: 'gateway_draft',
    content: typeof gatewayData === 'string' ? gatewayData : JSON.stringify(gatewayData),
    saved_steps: Array.from(stepsSet).sort((a, b) => a - b),
    last_updated_step: Number(stepNum),
    file_url: null,
    updated_at: serverTimestamp()
  });
  // Lightweight activity log (granular per-step progress for R4 Activity Report)
  await addDoc(collection(db, 'activity_log'), {
    team_id: teamId,
    action: 'draft',
    detail: `💾 Saved Draft Step ${stepNum}`,
    created_at: serverTimestamp()
  });
}

// Real-time subscription to a team's gateway draft (returns null when no draft exists).
export function subscribeToGatewayDraft(teamId, callback) {
  if (!teamId) { callback(null); return () => {}; }
  const ref = doc(db, 'submissions', `${teamId}_gateway_draft`);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) { callback(null); return; }
    const d = snap.data();
    let parsed;
    try { parsed = typeof d.content === 'string' ? JSON.parse(d.content) : (d.content || {}); }
    catch { parsed = {}; }
    callback({
      data:             parsed,
      savedSteps:       d.saved_steps || [],
      lastUpdatedStep:  d.last_updated_step || null,
      updatedAt:        d.updated_at
    });
  });
}

export async function createRubric(r) {
  return await addDoc(collection(db, "rubrics"), r);
}

export async function deleteRubric(id) {
  await deleteDoc(doc(db, "rubrics", id));
}

// ─── Admin: Users CRUD ──────────────────────────────────
export async function getUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Get-or-create a SECONDARY Firebase app instance just for creating new
// Auth users. Without this, calling createUserWithEmailAndPassword on the
// primary app would sign the new user IN and sign the current admin OUT.
function getSecondaryAuth() {
  const primary = getApp();
  const cfg = primary.options;
  const SECONDARY_NAME = '__eco_pilot_secondary__';
  let secApp;
  try { secApp = getApp(SECONDARY_NAME); }
  catch { secApp = initializeApp(cfg, SECONDARY_NAME); }
  return getAuth(secApp);
}

// Create both the Firebase Auth account AND the Firestore user doc.
// Doc id = the new Auth UID (matches how login() looks up the doc on signIn).
// Accepts: { name, username, password, role, team_id?, teamId?, email? }
export async function adminCreateUser(u) {
  const { username, password, name, role } = u;
  if (!username || !name) throw new Error('username + name ต้องไม่ว่าง');
  const teamId = u.team_id ?? u.teamId ?? null;
  const email = u.email && u.email.includes('@') ? u.email : `${username}@eco.com`;
  const pw    = password || 'changeMe123';

  // 1. Create Auth account on a secondary app (won't kick admin out).
  const secAuth = getSecondaryAuth();
  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(secAuth, email, pw);
    uid = cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      // Auth account exists — try to sign in (on secondary) to get the UID
      try {
        const cred = await signInWithEmailAndPassword(secAuth, email, pw);
        uid = cred.user.uid;
      } catch {
        throw new Error(`อีเมล ${email} มีอยู่แล้วใน Firebase Auth แต่รหัสผ่านไม่ตรง — ลบ user ใน Authentication console ก่อน หรือใช้รหัสเดิม`);
      }
    } else {
      throw new Error(`สร้าง Auth account ไม่สำเร็จ: ${err.message}`, { cause: err });
    }
  }
  // Sign out from secondary app — primary admin session is untouched.
  try { await secAuth.signOut(); } catch { /* ignore */ }

  // 2. Save Firestore user doc keyed by UID (so login can read it on uid lookup).
  await setDoc(doc(db, "users", uid), {
    username,
    name,
    role: role || 'student',
    email,
    team_id: teamId,
    created_at: serverTimestamp()
  });

  return { ok: true, uid, email };
}

export async function adminDeleteUser(id) {
  await deleteDoc(doc(db, "users", id));
}

export async function adminUpdateUser(id, data) {
  await updateDoc(doc(db, "users", id), data);
}

// เปลี่ยนรหัสผ่านของตัวเอง — ตรวจสอบ currentPassword ก่อน แล้วอัปเดต
export async function changeOwnPassword(userId, currentPassword, newPassword) {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) throw new Error('ไม่พบข้อมูลผู้ใช้');
  const stored = snap.data().password;
  if (stored !== currentPassword) throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');
  if (!newPassword || newPassword.length < 4) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร');

  // อัปเดต Firebase Auth ด้วย (re-auth → updatePassword)
  const auth = getAuth();
  const fbUser = auth.currentUser;
  if (fbUser) {
    const email = snap.data().email || `${snap.data().username}@eco.com`;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(fbUser, credential);
    await fbUpdatePassword(fbUser, newPassword);
  }

  // อัปเดต Firestore
  await updateDoc(doc(db, 'users', userId), { password: newPassword });

  // อัปเดต localStorage
  try {
    const cached = JSON.parse(localStorage.getItem('eco_user') || '{}');
    if (cached.id === userId) {
      cached.password = newPassword;
      localStorage.setItem('eco_user', JSON.stringify(cached));
    }
  } catch {}
}

// ─── Admin: Teams CRUD ──────────────────────────────────
// v2.0: teams can join multiple courses via team.courseIds (decision #2).
// Legacy teams (team.courseId or no courseId field) auto-default to ['green-rayong'].
export async function adminCreateTeam(t) {
  // Normalize courseIds: accept either courseIds (array) or courseId (string).
  // Always default to ['green-rayong'] so v1 callers still work.
  let courseIds;
  if (Array.isArray(t.courseIds) && t.courseIds.length) courseIds = t.courseIds;
  else if (t.courseId)  courseIds = [t.courseId];
  else if (t.course_id) courseIds = [t.course_id];
  else                  courseIds = ['green-rayong'];

  return await addDoc(collection(db, "teams"), {
    ...t,
    courseIds,                      // v2 canonical field (array)
    courseId : courseIds[0],        // v1 compat field (first course)
    created_at: serverTimestamp()
  });
}

export async function adminDeleteTeam(id) {
  await deleteDoc(doc(db, "teams", id));
}

export async function adminUpdateTeam(id, data) {
  // Keep courseId in sync if caller updates courseIds, and vice versa
  const patch = { ...data };
  if (Array.isArray(patch.courseIds) && patch.courseIds.length) {
    patch.courseId = patch.courseIds[0];
  } else if (patch.courseId && !patch.courseIds) {
    patch.courseIds = [patch.courseId];
  }
  await updateDoc(doc(db, "teams", id), patch);
}

// v2.0 helper: add a course to a team without removing existing courses
export async function addCourseToTeam(teamId, courseId) {
  const snap = await getDoc(doc(db, "teams", teamId));
  if (!snap.exists()) throw new Error('Team not found');
  const existing = snap.data().courseIds || (snap.data().courseId ? [snap.data().courseId] : []);
  if (existing.includes(courseId)) return { ok: true, skipped: true };
  const next = [...existing, courseId];
  await updateDoc(doc(db, "teams", teamId), { courseIds: next, courseId: next[0] });
  return { ok: true, courseIds: next };
}

export async function removeCourseFromTeam(teamId, courseId) {
  const snap = await getDoc(doc(db, "teams", teamId));
  if (!snap.exists()) throw new Error('Team not found');
  const existing = snap.data().courseIds || (snap.data().courseId ? [snap.data().courseId] : ['green-rayong']);
  const next = existing.filter(c => c !== courseId);
  if (next.length === 0) throw new Error('Team must belong to at least one course');
  await updateDoc(doc(db, "teams", teamId), { courseIds: next, courseId: next[0] });
  return { ok: true, courseIds: next };
}

// ─── Good Prompts ───────────────────────────────────────
export function subscribeToGoodPrompts(callback) {
  return onSnapshot(collection(db, "good_prompts"), (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

export async function saveGoodPrompt(p) {
  if (p.id) {
    return await updateDoc(doc(db, "good_prompts", p.id), p);
  }
  return await addDoc(collection(db, "good_prompts"), {
    ...p,
    created_at: serverTimestamp()
  });
}

export async function deleteGoodPrompt(id) {
  await deleteDoc(doc(db, "good_prompts", id));
}

// ─── Team Approval (Approve / Reject) ──────────────────
// Saves the team's submission_status on the team doc itself.
//   status: 'approved' | 'rejected' | 'pending'
//   reason: required when status === 'rejected'
export async function setTeamApproval(teamId, status, reason = '') {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    throw new Error('status must be approved | rejected | pending');
  }
  await updateDoc(doc(db, 'teams', String(teamId)), {
    submission_status: status,
    rejection_reason:  status === 'rejected' ? (reason || '') : '',
    approval_at:       serverTimestamp(),
    approval_by_id:    me.id   || null,
    approval_by_name:  me.name || null,
    approval_by_role:  me.role || null
  });
  try {
    await addDoc(collection(db, 'activity_log'), {
      team_id: teamId,
      user_id: me.id || null,
      action:  status,
      detail:  status === 'rejected' ? `Rejected: ${reason}` : `Approved by ${me.name || 'unknown'}`,
      created_at: serverTimestamp()
    });
  } catch { /* best-effort */ }
  return { ok: true };
}

// ─── Team Scores ────────────────────────────────────────
// `scores` accepts two shapes (auto-detected):
//   1. Legacy:           { 'AI Prompting': 4, 'Local Wisdom': 3 }
//   2. With per-dim note: { 'AI Prompting': { score: 4, comment: 'great structure' } }
// `overallComment` is used as fallback when a dim has no per-dim comment.
// ─── Helper: sanitize Firestore doc IDs ──────────────────
// Firestore forbids '/' (path separator), '.', '..', or '__*__' patterns in doc IDs.
// Rubric names like "Responsible Tourism / ESG" would break docId construction.
export function safeDocId(s) {
  return String(s || '')
    .replace(/[/\\.#$[\]]/g, '_')  // unsafe Firestore chars
    .replace(/__+/g, '_')             // collapse multiple underscores
    .slice(0, 1500);                  // Firestore max segment length
}

// evaluatorRoleOverride: optional override (e.g., 'self' when student self-assesses).
// If omitted, derives canonical evaluator_role from user.role:
//   student → 'self'   (R5/Matrix expects 'self', not 'student')
//   admin / facilitator → 'teacher'
//   teacher → 'teacher'
//   sage → 'sage'
export async function saveTeamScores(teamId, scores, overallComment, evaluatorRoleOverride) {
  const user = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const evaluatorId = user.id;
  let evaluatorRole = evaluatorRoleOverride || user.role;
  // Canonical role mapping (R5 Individual Summary + Performance Overview Matrix expect these)
  if (evaluatorRole === 'student')                                 evaluatorRole = 'self';
  else if (evaluatorRole === 'admin' || evaluatorRole === 'facilitator') evaluatorRole = 'teacher';
  // 'teacher' and 'sage' stay as-is

  for (const [dim, raw] of Object.entries(scores)) {
    let score, dimComment;
    if (raw && typeof raw === 'object') {
      score = Number(raw.score);
      dimComment = raw.comment ?? overallComment ?? '';
    } else {
      score = Number(raw);
      dimComment = overallComment || '';
    }
    if (!Number.isFinite(score) || score <= 0) continue;
    const docId = `${teamId}_${safeDocId(dim)}_${evaluatorId}`;
    await setDoc(doc(db, "team_scores", docId), {
      team_id: teamId,
      dimension: dim,
      score,
      evaluator_id: evaluatorId,
      evaluator_role: evaluatorRole,
      comment: dimComment,
      scored_at: serverTimestamp()
    });
  }
}

export function subscribeToTeamScores(callback) {
  return onSnapshot(collection(db, "team_scores"), (snap) => {
    const agg = {};
    snap.docs.forEach(d => {
      const row = d.data();
      // Skip legacy aggregated rows (no score field) — prevents NaN propagation in average
      const score = Number(row.score);
      if (!Number.isFinite(score)) return;
      const key = `${row.team_id}-${row.dimension}`;
      if (!agg[key]) {
        agg[key] = { team_id: row.team_id, dimension: row.dimension, sum: 0, count: 0, roles: new Set(), last: row.scored_at?.toDate() };
      }
      agg[key].sum += score;
      agg[key].count += 1;
      agg[key].roles.add(row.evaluator_role);
      const dDate = row.scored_at?.toDate();
      if (dDate && dDate > agg[key].last) agg[key].last = dDate;
    });

    const result = Object.values(agg).map(v => ({
      team_id: v.team_id,
      dimension: v.dimension,
      avg_score: v.count > 0 ? v.sum / v.count : 0,
      n_evaluators: v.count,
      roles: Array.from(v.roles).join(','),
      last_scored_at: v.last
    }));
    callback(result);
  });
}

// ─── Dimension Mapper ──────────────────────────────────
// Rubric names (Thai long form) → SCORE_DIMENSIONS (5 categories)
// Used to bridge self/peer/sage scores (stored with rubric names) → matrix display (uses 5 categories)
export function dimensionToScoreCategory(dim) {
  if (!dim) return null;
  const d = String(dim).toLowerCase();
  // Direct match with SCORE_DIMENSIONS
  if (d === 'ai prompting')  return 'AI Prompting';
  if (d === 'local wisdom')  return 'Local Wisdom';
  if (d === 'creativity')    return 'Creativity';
  if (d === 'business plan') return 'Business Plan';
  if (d === 'storytelling')  return 'Storytelling';
  // Pattern matching for Thai rubric names
  if (d.includes('prompt') || d.includes('วิศวกรรมคำสั่ง') || d.includes('fact-check') || d.includes('วิจารณญาณ') || d.includes('ai audit') || d.includes('hallucination')) return 'AI Prompting';
  if (d.includes('wisdom') || d.includes('ภูมิปัญญา') || d.includes('การรักษาวิถี') || d.includes('อัตลักษณ์') || d.includes('local soul') || d.includes('community trust') || d.includes('cultural authent') || d.includes('จรรยาบรรณท้องถิ่น') || d.includes('สัตย์จริง') || d.includes('มารยาท')) return 'Local Wisdom';
  if (d.includes('creativity') || d.includes('สร้างสรรค์') || d.includes('ไอเดีย') || d.includes('mindset') || d.includes('teamwork') || d.includes('ผู้นำ') || d.includes('collaboration') || d.includes('กัลยาณมิตร') || d.includes('นวัตกร') || d.includes('integrity') || d.includes('tpqi')) return 'Creativity';
  if (d.includes('business') || d.includes('ธุรกิจ') || d.includes('โมเดล') || d.includes('การเงิน') || d.includes('set ') || d.includes('sroi') || d.includes('esg') || d.includes('responsible tourism') || d.includes('การท่องเที่ยว') || d.includes('financial')) return 'Business Plan';
  if (d.includes('storytelling') || d.includes('เล่าเรื่อง') || d.includes('นำเสนอ') || d.includes('ภาษา') || d.includes('สื่อสาร') || d.includes('bilingual') || d.includes('pitch')) return 'Storytelling';
  return null; // unknown — caller can choose to include or skip
}

export async function getMyTeamScores(teamId) {
  const user = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const q = query(collection(db, "team_scores"), where("evaluator_id", "==", user.id), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── File Upload (Firebase Storage) ─────────────────────
// Upload a file to a storage path. Returns { url, path, name, size, type }.
// Path convention: submissions/{teamId}/{step}/{timestamp}_{filename}
export async function uploadFile(folder, file) {
  if (!file) throw new Error('uploadFile: file is required');
  const safeName = file.name.replace(/[^\w.-]/g, '_');
  const path = `${folder}/${Date.now()}_${safeName}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  return { url, path, name: file.name, size: file.size, type: file.type };
}

export async function deleteFile(path) {
  await deleteObject(storageRef(storage, path));
}

export async function listFiles(folder) {
  const ref = storageRef(storage, folder);
  const res = await listAll(ref);
  const items = await Promise.all(res.items.map(async it => ({
    name: it.name, path: it.fullPath, url: await getDownloadURL(it)
  })));
  return items;
}

// Subscribe to RAW team_scores rows (one row per team-dim-evaluator).
// Used by R5 to break down by individual evaluator type.
export function subscribeToTeamScoresRaw(callback) {
  return onSnapshot(collection(db, "team_scores"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Peer Assessment ────────────────────────────────────
// peer_scores doc id = `${evaluatorId}_${targetUserId}_${dimension}` (one row per
// evaluator-target-dimension; upsertable). Anonymous = true means the UI hides
// evaluator_id when listing — we still store it server-side for audit/integrity.
//
// scores arg shape: { [targetUserId]: { [dimension]: number, ... }, ... }
export async function savePeerScores(scores, comment) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  if (!me.id) throw new Error('savePeerScores: ผู้ประเมินไม่ได้เข้าสู่ระบบ');
  let saved = 0;
  for (const [targetUserId, dimScores] of Object.entries(scores)) {
    for (const [dim, score] of Object.entries(dimScores)) {
      const n = Number(score);
      if (!Number.isFinite(n) || n <= 0) continue;
      const docId = `${me.id}_${targetUserId}_${safeDocId(dim)}`;
      await setDoc(doc(db, "peer_scores", docId), {
        evaluator_id: me.id,
        target_user_id: targetUserId,
        dimension: dim,
        score: n,
        comment: comment || '',
        anonymous: true,
        scored_at: serverTimestamp()
      });
      saved++;
    }
  }
  return { ok: true, saved };
}

// Subscribe to ALL peer_scores (used by R5 Individual Summary).
// Anonymizes evaluator_id for non-admin readers.
export function subscribeToPeerScores(callback) {
  return onSnapshot(collection(db, "peer_scores"), (snap) => {
    const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
    const isAdmin = me.role === 'admin';
    const rows = snap.docs.map(d => {
      const data = d.data();
      return isAdmin ? { id: d.id, ...data } : {
        id: d.id,
        target_user_id: data.target_user_id,
        dimension: data.dimension,
        score: data.score,
        scored_at: data.scored_at
        // evaluator_id intentionally hidden for non-admin
      };
    });
    callback(rows);
  });
}

// Returns the set of targetUserIds the current user has already evaluated
// (used to show "✓ ประเมินแล้ว" badges).
export async function getMyPeerSubmittedTargets() {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  if (!me.id) return [];
  const q = query(collection(db, "peer_scores"), where("evaluator_id", "==", me.id));
  const snap = await getDocs(q);
  const set = new Set();
  snap.forEach(d => set.add(d.data().target_user_id));
  return Array.from(set);
}

// ─── All Submissions (for Reports) ──────────────────────
// Subscribe to ALL submissions across all teams (used by R3 Finance, R4 Activity).
export function subscribeToAllSubmissions(callback) {
  return onSnapshot(collection(db, "submissions"), (snap) => {
    const rows = snap.docs.map(d => {
      const data = d.data();
      let parsed = data.content;
      try { parsed = JSON.parse(data.content); } catch { /* keep as-is */ }
      return { id: d.id, team_id: data.team_id, step: data.step, content: parsed, submitted_at: data.submitted_at };
    });
    callback(rows);
  });
}

// ─── App Config (shared settings across all users) ─────
// Stored as a single Firestore doc app_config/main with fields:
//   { lookerUrl, ai_proxy, updated_at }
// All authenticated users can read; admin should be the only one writing
// (enforce later via stricter Firestore rules; current rules allow all auth users).
const APP_CONFIG_DOC = doc(db, 'app_config', 'main');

export function subscribeToAppConfig(callback) {
  return onSnapshot(APP_CONFIG_DOC, (snap) => {
    callback(snap.exists() ? snap.data() : {});
  });
}

export async function setAppConfig(patch) {
  await setDoc(APP_CONFIG_DOC, { ...patch, updated_at: serverTimestamp() }, { merge: true });
}

// ─── Phase State (open/closed per phase) ────────────────
export function subscribeToPhaseState(callback) {
  return onSnapshot(collection(db, "phase_state"), (snap) => {
    const map = {};
    snap.docs.forEach(d => { map[d.id] = d.data(); });
    callback(map);
  });
}

export async function setPhaseState(phaseId, open) {
  await setDoc(doc(db, "phase_state", phaseId), { open: !!open, updated_at: serverTimestamp() });
}

// ─── Phases CRUD (full session management) ───────────────
// Each phase: { id (auto), label, order, open, deadline (ISO date or null), updated_at }
// Sorted by `order` ascending. Use order to control display sequence.
export function subscribeToPhases(callback) {
  return onSnapshot(collection(db, "phases"), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    callback(rows);
  });
}

export async function createPhase(data) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const ref = await addDoc(collection(db, "phases"), {
    label:    data.label || 'Untitled Phase',
    order:    typeof data.order === 'number' ? data.order : 999,
    open:     data.open !== false,
    deadline: data.deadline || null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    created_by: me.id || null
  });
  return { ok: true, id: ref.id };
}

export async function updatePhase(id, patch) {
  await updateDoc(doc(db, "phases", id), {
    ...patch,
    updated_at: serverTimestamp()
  });
}

export async function deletePhase(id) {
  await deleteDoc(doc(db, "phases", id));
}

// One-shot: seed the 5 default phases if collection is empty
export async function seedDefaultPhasesIfEmpty() {
  const snap = await getDocs(collection(db, "phases"));
  if (!snap.empty) return { ok: true, skipped: true };
  const defaults = [
    { label: 'Phase 1 · Team Setup',         order: 1, open: true,  deadline: null },
    { label: 'Phase 2 · Mission Inbox',      order: 2, open: true,  deadline: null },
    { label: 'Phase 3 · On-site Collector',  order: 3, open: true,  deadline: null },
    { label: 'Phase 4 · Submission Gateway', order: 4, open: true,  deadline: null },
    { label: 'Phase 5 · Evaluation',         order: 5, open: false, deadline: null }
  ];
  for (const p of defaults) await createPhase(p);
  return { ok: true, created: defaults.length };
}

// ─── AI Assessment (Claude API) ─────────────────────────
// Calls the Anthropic API to score a team's prompt-quality / wisdom-extraction.
// Stores the API key in localStorage as 'eco_anthropic_key' (set by admin in Settings).
// Note: browser → api.anthropic.com works only if CORS is permitted. If you hit
// a CORS error, route through a small proxy (Cloud Function, Vercel function, etc.)
// and override ECO_AI_PROXY in localStorage.
export async function aiAssessTeam(teamId, payload) {
  const apiKey = localStorage.getItem('eco_anthropic_key');
  // Proxy URL: prefer the shared Firestore-synced value (set by admin), fall
  // back to per-browser localStorage override.
  let proxy = localStorage.getItem('eco_ai_proxy');
  try {
    const cfgSnap = await getDoc(doc(db, 'app_config', 'main'));
    if (cfgSnap.exists() && cfgSnap.data().aiProxyUrl) proxy = cfgSnap.data().aiProxyUrl;
  } catch { /* offline or no config doc — use localStorage value */ }
  // ── DEMO MODE FALLBACK ──
  // ถ้าไม่มี API Key/Proxy → ใช้ heuristic-based mock scores
  const useMockMode = !apiKey && !proxy;

  let parsed;
  if (useMockMode) {
    parsed = buildMockAssessScores(payload);
  } else {
    const systemPrompt = `You are an evaluator for a Thai student STEM project (Green Rayong AI Storytellers). The students used AI prompts during a community-wisdom project. Score the prompt quality on a 1–5 integer scale across these dimensions: AI Prompting, Local Wisdom, Creativity, Business Plan, Storytelling. Reply with ONLY a JSON object: {"AI Prompting": n, "Local Wisdom": n, "Creativity": n, "Business Plan": n, "Storytelling": n, "comment": "Thai-language feedback ≤80 words"}. Do NOT score Attitude.`;

    const userPrompt = `Team: ${payload.teamName || teamId}
IoT Module chosen: ${payload.iotModule || '-'}
Product: ${payload.product || '-'}
Selected idea: ${payload.selectedIdea || '-'}
BMC cost/price: ${payload.cost || '-'} / ${payload.price || '-'}
Target customer: ${payload.customer || '-'}

AI Prompt Logs:
${payload.aiLogs || '(empty)'}

Local wisdom interview snippet:
${(payload.interview || '').slice(0, 500)}`;

    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    };

    const url = proxy || 'https://api.anthropic.com/v1/messages';
    const headers = proxy
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API ${res.status}: ${err.slice(0, 200)}`);
    }
    const data = await res.json();
    // data.content is an array of {type, text}
    const text = (data.content || []).map(c => c.text || '').join('');
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch { /* keep null */ }
    if (!parsed) throw new Error('AI ไม่ได้ตอบเป็น JSON: ' + text.slice(0, 120));
  }

  // Save scores under evaluator_role='ai' using a sentinel evaluator id
  const evaluatorId = 'ai_assessor';
  for (const dim of ['AI Prompting','Local Wisdom','Creativity','Business Plan','Storytelling']) {
    const n = Number(parsed[dim]);
    if (Number.isFinite(n) && n > 0) {
      const docId = `${teamId}_${safeDocId(dim)}_${evaluatorId}`;
      await setDoc(doc(db, "team_scores", docId), {
        team_id: teamId, dimension: dim, score: n,
        evaluator_id: evaluatorId, evaluator_role: 'ai',
        comment: parsed.comment || '', scored_at: serverTimestamp()
      });
    }
  }
  return { ok: true, mock_mode: useMockMode, scores: parsed };
}

// ─── Mock AI Assess (Demo Mode) ──────────────────────
// สร้างคะแนน 5 มิติจาก heuristic — เมื่อยังไม่มี API key/Proxy
function buildMockAssessScores(payload) {
  const aiLogs = payload.aiLogs || '';
  const prompts = aiLogs.split('\n').map(s => s.trim()).filter(Boolean);
  const interview = payload.interview || '';
  const idea = payload.selectedIdea || '';
  const product = payload.product || '';

  const ROLE_HINTS    = /\b(act as|you are|imagine you|in the role of|as a|as an)\b/i;
  const CONTEXT_HINTS = /\b(given|the topic is|context|background|about|for the|target)\b/i;
  const FORMAT_HINTS  = /\b(format|return|respond with|output|list|table|json|step|number)\b/i;
  const roleCt = prompts.filter(p => ROLE_HINTS.test(p)).length;
  const ctxCt  = prompts.filter(p => CONTEXT_HINTS.test(p)).length;
  const fmtCt  = prompts.filter(p => FORMAT_HINTS.test(p)).length;
  const avgLen = prompts.length ? prompts.reduce((a, p) => a + p.length, 0) / prompts.length : 0;

  // 1-5 score generator (clamp)
  const score1to5 = (raw) => Math.max(1, Math.min(5, Math.round(raw)));

  // AI Prompting: prompt count + quality patterns
  const aiPrompt = score1to5(
    1 + Math.min(prompts.length, 8) * 0.25 +
    (roleCt / Math.max(1, prompts.length)) * 1.5 +
    (ctxCt  / Math.max(1, prompts.length)) * 1.0 +
    (fmtCt  / Math.max(1, prompts.length)) * 0.5
  );

  // Local Wisdom: interview depth + content richness
  const localWisdom = score1to5(
    1 + (interview.length / 200) +
    (interview.includes('ปราชญ์') || interview.includes('ลุง') || interview.includes('ป้า') ? 1 : 0) +
    (interview.length > 400 ? 1 : 0)
  );

  // Creativity: idea originality (length + uniqueness markers)
  const creativity = score1to5(
    1 + Math.min(idea.length, 100) / 30 +
    (product.length > 0 ? 1 : 0) +
    (avgLen > 100 ? 1 : 0)
  );

  // Business Plan: based on cost/price/customer data
  const cost = Number(payload.cost) || 0;
  const price = Number(payload.price) || 0;
  const businessPlan = score1to5(
    1 + (cost > 0 ? 1 : 0) +
    (price > 0 ? 1 : 0) +
    (price > cost ? 1 : 0) +
    (payload.customer && payload.customer.length > 10 ? 1 : 0)
  );

  // Storytelling: depth of prompts + audience-aware patterns
  const storytelling = score1to5(
    1 + Math.min(avgLen / 50, 2) +
    (aiLogs.toLowerCase().includes('story') || aiLogs.toLowerCase().includes('narrative') ? 1 : 0) +
    (prompts.length >= 4 ? 1 : 0)
  );

  const avg = (aiPrompt + localWisdom + creativity + businessPlan + storytelling) / 5;
  let tier;
  if (avg >= 4)      tier = 'ทีมระดับดีเยี่ยม (L4)';
  else if (avg >= 3) tier = 'ทีมระดับดี (L3)';
  else if (avg >= 2) tier = 'ทีมระดับกำลังพัฒนา (L2)';
  else               tier = 'ทีมต้องการการสนับสนุน (L1)';

  const comment = `🧪 Demo Mode (Heuristic) — ${tier}: คะแนนเฉลี่ย ${avg.toFixed(1)}/5 · จุดเด่น: ${
    [['AI Prompting', aiPrompt], ['Local Wisdom', localWisdom], ['Creativity', creativity], ['Business Plan', businessPlan], ['Storytelling', storytelling]]
      .sort((a, b) => b[1] - a[1])[0][0]
  } · ควรพัฒนา: ${
    [['AI Prompting', aiPrompt], ['Local Wisdom', localWisdom], ['Creativity', creativity], ['Business Plan', businessPlan], ['Storytelling', storytelling]]
      .sort((a, b) => a[1] - b[1])[0][0]
  }`;

  return {
    'AI Prompting':  aiPrompt,
    'Local Wisdom':  localWisdom,
    'Creativity':    creativity,
    'Business Plan': businessPlan,
    'Storytelling':  storytelling,
    comment
  };
}

// ─── Documents (shared resources — rubrics, references, samples, etc.) ──
// Files live in Firebase Storage at `documents/`; metadata in Firestore
// `documents` collection. Anyone signed-in can read; teacher/admin can upload.
export async function uploadDocument(file, meta = {}) {
  if (!file) throw new Error('file is required');
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const uploaded = await uploadFile('documents', file);
  const ref = await addDoc(collection(db, 'documents'), {
    name:        meta.name || file.name,
    description: meta.description || '',
    category:    meta.category || 'อื่นๆ',
    file_url:    uploaded.url,
    file_path:   uploaded.path,
    file_name:   file.name,
    file_size:   file.size,
    file_type:   file.type || '',
    uploaded_by_id:   me.id   || null,
    uploaded_by_name: me.name || 'Unknown',
    uploaded_by_role: me.role || 'teacher',
    created_at:  serverTimestamp()
  });
  return { ok: true, id: ref.id, ...uploaded };
}

export async function deleteDocument(docId, filePath) {
  if (filePath) { try { await deleteFile(filePath); } catch (e) { console.warn('storage delete:', e); } }
  await deleteDoc(doc(db, 'documents', docId));
}

export function subscribeToDocuments(callback) {
  return onSnapshot(collection(db, 'documents'), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
    callback(rows);
  });
}

// ─── Feedback (advice for team / individual student) ────
// One collection, two target_types.
//   doc id: `${target_type}_${target_id}_${evaluator_id}` → upsertable.
//   target_type: 'team' | 'student'
//   evaluator_role: 'teacher' | 'sage' | 'admin' | 'ai'
//
// Read access: any signed-in user. Write access: same evaluator only (UI gates
// by role; current Firestore rules are permissive).
export async function saveFeedback(targetType, targetId, content, opts = {}) {
  if (!['team', 'student'].includes(targetType)) throw new Error('targetType must be team | student');
  if (!targetId) throw new Error('targetId required');
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const evaluatorId   = opts.evaluatorId   || me.id   || 'unknown';
  const evaluatorName = opts.evaluatorName || me.name || 'Unknown';
  const evaluatorRole = opts.evaluatorRole || me.role || 'teacher';
  const docId = `${targetType}_${targetId}_${evaluatorId}`;
  await setDoc(doc(db, 'feedback', docId), {
    target_type: targetType,
    target_id:   String(targetId),
    evaluator_id:   evaluatorId,
    evaluator_name: evaluatorName,
    evaluator_role: evaluatorRole,
    content: String(content || '').trim(),
    updated_at: serverTimestamp()
  }, { merge: true });
  return { ok: true, id: docId };
}

export async function deleteFeedback(targetType, targetId, evaluatorId) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const eid = evaluatorId || me.id;
  await deleteDoc(doc(db, 'feedback', `${targetType}_${targetId}_${eid}`));
}

// Real-time subscription to ALL feedback (UI filters per target).
export function subscribeToFeedback(callback) {
  return onSnapshot(collection(db, 'feedback'), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Ethics Moderation (cultural respect + local wisdom integrity) ──
// 6 categories focused on the Green Rayong project values:
//   privacy     — ปกป้องข้อมูลส่วนบุคคลของปราชญ์ (เบอร์โทร, ที่อยู่)
//   fabrication — ตรวจการแต่งเติมภูมิปัญญา (AI hallucination, no citation)
//   disrespect  — คำที่ไม่ให้เกียรติปราชญ์ / ลดทอนคุณค่าภูมิปัญญา
//   cultural    — คำหยาบ / stereotype / hate speech
//   consent     — การขออนุญาตจากปราชญ์ก่อนใช้ข้อมูล/ภาพ
//   ai_misuse   — deepfake, voice clone, generate ภูมิปัญญาขึ้นเอง

const ETHICS_PATTERNS = {
  privacy: [
    { re: /\b\d{10,13}\b/, desc: 'อาจมีเบอร์โทร/เลขบัตรประชาชน 10-13 หลัก', severity: 'high' },
    { re: /\b[\w.-]+@[\w.-]+\.\w+\b/, desc: 'มีอีเมล (อาจเป็นข้อมูลส่วนตัว)', severity: 'medium' },
    { re: /(บ้านเลขที่|ม\.\s*\d|หมู่ที่\s*\d|หมู่บ้าน\s*\S+|ซอย\s*\S+|ถนน\s*\S{3,})/, desc: 'อาจมีที่อยู่บ้านของปราชญ์', severity: 'high' },
    { re: /(line\s*id|ไลน์\s*[:：]|facebook\.com\/|@[\w_]{4,})/i, desc: 'มี Social Media ID ส่วนตัว', severity: 'medium' }
  ],
  fabrication: [
    { re: /(as an ai|i cannot|i'm sorry|i don't have access|as a language model)/i, desc: '🤖 copy คำตอบ AI ตรงๆ ไม่ลบ disclaimer', severity: 'high' },
    { re: /(เป็นที่รู้กันว่า|วิจัยพบว่า|จากการศึกษาพบว่า|ในยุคปัจจุบัน|ในยุคที่|เห็นได้ชัดว่า)/, desc: 'ใช้สำนวน AI-typical โดยไม่มี citation', severity: 'medium' },
    { re: /(อันที่จริง|ในความเป็นจริง|สรุปได้ว่า|กล่าวโดยสรุปคือ)/, desc: 'AI summary phrasing — อาจไม่ใช่ของนักเรียนเอง', severity: 'low' }
  ],
  disrespect: [
    { re: /\b(แก|มัน|กู|มึง|เออ\s|ห่ะ\b)\b/, desc: '⚠ คำไม่สุภาพต่อปราชญ์/ผู้สูงอายุ', severity: 'high' },
    { re: /\b(แค่|ก็แค่|ก็เพียง|งั้นๆ|ธรรมดา)[^ก-๙]*(ผู้เฒ่า|ปราชญ์|ลุง|ป้า|ตา|ยาย|ชาวบ้าน)/, desc: 'คำที่ลดทอนคุณค่าปราชญ์', severity: 'medium' },
    { re: /(ล้าสมัย|ตกยุค|เชย|outdated|primitive)[^.]{0,50}(ภูมิปัญญา|วิถี|ประเพณี|พื้นบ้าน)/i, desc: 'ดูถูกภูมิปัญญาท้องถิ่น', severity: 'high' },
    { re: /\b(ไม่มี|ไร้|ขาด)[^.]{0,30}(ประโยชน์|คุณค่า|ความหมาย)[^.]{0,40}(ภูมิปัญญา|ปราชญ์|ท้องถิ่น)/, desc: 'แสดงทัศนคติเชิงลบต่อภูมิปัญญา', severity: 'high' }
  ],
  cultural: [
    { re: /\b(fuck|shit|damn|asshole|bitch)\b/i, desc: 'คำหยาบภาษาอังกฤษ', severity: 'high' },
    { re: /\b(โง่|งี่เง่า|บ้า|ปัญญาอ่อน|ควาย|สัตว์เลี้ยง)\b/, desc: 'คำหยาบ/ดูถูก', severity: 'high' },
    { re: /(ลาว|เขมร|พม่า|มลายู|ใต้|อีสาน|เหนือ)[^.]{0,30}(โง่|ขี้เกียจ|สกปรก|ป่าเถื่อน|เหม็น)/, desc: '🚫 stereotype เชื้อชาติ/ภูมิภาค', severity: 'high' }
  ],
  consent: [
    // For collector.interview (long text) — should mention consent
    { re: null, longTextCheck: true, requireKeyword: /(อนุญาต|ยินยอม|consent|ยินดี|ขออนุญาต|ได้รับ.*?อนุญาต|เซ็นยินยอม)/, minLength: 200,
      desc: 'บันทึกสัมภาษณ์ยาวเกิน 200 ตัวอักษร แต่ไม่พบคำที่บ่งบอกถึงการขออนุญาตจากปราชญ์', severity: 'medium' },
    { re: null, longTextCheck: true, requireKeyword: /(แหล่งข้อมูล|อ้างอิง|ที่มา|source|ผู้ให้สัมภาษณ์|ผู้ให้ข้อมูล)/, minLength: 300,
      desc: 'เนื้อหาภูมิปัญญายาว แต่ไม่มี credit แหล่งที่มา / ชื่อปราชญ์', severity: 'low' }
  ],
  ai_misuse: [
    { re: /(deepfake|voice\s*clone|swap\s*face|imitate\s*voice|เลียนเสียง|swap\s*หน้า|สวมหน้า|generate\s+(voice|face|persona))/i, desc: '🚨 พูดถึงการ deepfake / voice clone ปราชญ์', severity: 'high' },
    { re: /(สร้าง.*ปราชญ์.*ใหม่|generate.*sage|fake.*interview|fabricat|invent.*tradition|make\s*up.*story)/i, desc: '🚨 อาจขอ AI สร้างเนื้อหาปราชญ์/วิถีขึ้นมาเอง', severity: 'high' },
    { re: /(ปลอม|fake|spoof)[^.]{0,30}(ปราชญ์|sage|ภูมิปัญญา|wisdom)/i, desc: 'คำที่บ่งชี้การปลอมแปลงข้อมูลปราชญ์', severity: 'high' }
  ]
};

const CATEGORY_META = {
  privacy:     { label: 'ปกป้องข้อมูลส่วนบุคคล',  emoji: '🔒' },
  fabrication: { label: 'แต่งเติมภูมิปัญญา',        emoji: '🤖' },
  disrespect:  { label: 'ไม่ให้เกียรติปราชญ์',     emoji: '🙏' },
  cultural:    { label: 'คำหยาบ / Stereotype',     emoji: '⚠️' },
  consent:     { label: 'การขออนุญาต',              emoji: '📋' },
  ai_misuse:   { label: 'AI Misuse / Deepfake',     emoji: '🚨' }
};
export { CATEGORY_META };

// Scan one piece of text against all categories. Returns array of matches.
function scanTextForEthics(text, source, sourceId) {
  if (!text || typeof text !== 'string') return [];
  const matches = [];
  for (const [category, patterns] of Object.entries(ETHICS_PATTERNS)) {
    for (const p of patterns) {
      // Long-text consent check
      if (p.longTextCheck) {
        if (text.length >= (p.minLength || 200) && !p.requireKeyword.test(text)) {
          matches.push({
            category, severity: p.severity, desc: p.desc,
            evidence: text.slice(0, 120) + (text.length > 120 ? '…' : ''),
            source, source_id: sourceId
          });
        }
        continue;
      }
      const m = text.match(p.re);
      if (m) {
        // Capture context around match (50 chars before/after)
        const idx = text.indexOf(m[0]);
        const start = Math.max(0, idx - 30);
        const end = Math.min(text.length, idx + m[0].length + 60);
        const evidence = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
        matches.push({
          category, severity: p.severity, desc: p.desc,
          pattern: m[0], evidence, source, source_id: sourceId
        });
      }
    }
  }
  return matches;
}

// Run ethics audit for one team. Persists flags in `moderation_flags` collection.
export async function runEthicsAudit(team, submissions) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const allMatches = [];

  // 1. Scan collector interview
  const col = submissions.find(s => String(s.team_id) === String(team.id) && s.step === 'collector')?.content;
  if (col) {
    allMatches.push(...scanTextForEthics(col.interview || '', 'collector', 'interview'));
  }
  // 2. Scan gateway fields
  const gw = submissions.find(s => String(s.team_id) === String(team.id) && s.step === 'gateway')?.content;
  if (gw && typeof gw === 'object') {
    ['strengths','traditionalWisdom','wisdom','environment','affectedGroup','allIdeas','selectedIdea','prototype','videoSubtitle','aiLogs','bmcCustomer','bmcChannel']
      .forEach(f => { if (gw[f]) allMatches.push(...scanTextForEthics(String(gw[f]), 'gateway', f)); });
    // Per-prompt scan
    if (gw.aiLogs) {
      const prompts = gw.aiLogs.split('\n').filter(Boolean);
      prompts.forEach((p, i) => allMatches.push(...scanTextForEthics(p, 'prompt', `${i+1}`)));
    }
  }
  // 3. Scan mission-inbox
  const mi = submissions.find(s => String(s.team_id) === String(team.id) && s.step === 'mission-inbox')?.content;
  if (mi && typeof mi === 'object') {
    ['iotReason','productReason'].forEach(f => { if (mi[f]) allMatches.push(...scanTextForEthics(String(mi[f]), 'mission', f)); });
  }

  // 4. Write flags to Firestore (one doc per flag, deterministic id so re-running doesn't duplicate)
  let writtenCount = 0;
  for (const m of allMatches) {
    const flagId = `${team.id}_${m.source}_${m.source_id}_${m.category}_${(m.pattern || m.desc).slice(0, 30).replace(/[^\w]/g, '_')}`;
    try {
      await setDoc(doc(db, 'moderation_flags', flagId), {
        team_id:    String(team.id),
        team_name:  team.name || '',
        source:     m.source,
        source_id:  m.source_id,
        category:   m.category,
        severity:   m.severity,
        desc:       m.desc,
        pattern:    m.pattern || null,
        evidence:   m.evidence,
        status:     'pending',
        flagged_at: serverTimestamp(),
        flagged_by_id:   me.id || null,
        flagged_by_name: me.name || 'system'
      }, { merge: true });
      writtenCount++;
    } catch { /* ignore single failure */ }
  }
  return { ok: true, found: allMatches.length, written: writtenCount };
}

// Run audit on all teams at once.
export async function runEthicsAuditAll(teams, submissions) {
  let totalFound = 0;
  for (const t of teams) {
    try { const r = await runEthicsAudit(t, submissions); totalFound += r.found; } catch { /* ignore */ }
  }
  return { ok: true, totalFound, teamsScanned: teams.length };
}

export function subscribeToModerationFlags(callback) {
  return onSnapshot(collection(db, 'moderation_flags'), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => {
      const sevRank = { high: 0, medium: 1, low: 2 };
      const sa = sevRank[a.severity] ?? 9;
      const sb = sevRank[b.severity] ?? 9;
      if (sa !== sb) return sa - sb;
      return (b.flagged_at?.seconds || 0) - (a.flagged_at?.seconds || 0);
    });
    callback(rows);
  });
}

export async function setModerationFlagStatus(flagId, status, note = '') {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  await updateDoc(doc(db, 'moderation_flags', flagId), {
    status,
    review_note:     note || null,
    reviewed_by_id:   me.id   || null,
    reviewed_by_name: me.name || null,
    reviewed_at:     serverTimestamp()
  });
}

export async function deleteModerationFlag(flagId) {
  await deleteDoc(doc(db, 'moderation_flags', flagId));
}

// ─── AI Audit (full integration: heuristics + Claude analysis + history) ──
//
// `aiAuditTeam` runs a comprehensive AI Audit on a team's project work.
// Combines: prompt quality stats, hallucination cross-check, originality score,
// AI-generated strengths/concerns/recommendations, per-prompt feedback.
// Result is saved in `ai_audits` collection for history + sharing.
export async function aiAuditTeam(teamId, payload) {
  const apiKey = localStorage.getItem('eco_anthropic_key');
  let proxy = localStorage.getItem('eco_ai_proxy');
  try {
    const cfgSnap = await getDoc(doc(db, 'app_config', 'main'));
    if (cfgSnap.exists() && cfgSnap.data().aiProxyUrl) proxy = cfgSnap.data().aiProxyUrl;
  } catch { /* ignore */ }
  // ── DEMO MODE FALLBACK ──
  // ถ้าไม่มี API Key/Proxy → ใช้ Mock Audit ที่สร้างจาก heuristic locally (ไม่เรียก network เลย)
  const useMockMode = !apiKey && !proxy;

  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');

  // Heuristic pre-analysis (no AI call)
  const ROLE_HINTS    = /\b(act as|you are|imagine you|in the role of|as a|as an)\b/i;
  const CONTEXT_HINTS = /\b(given|the topic is|context|background|about|for the|target)\b/i;
  const FORMAT_HINTS  = /\b(format|return|respond with|output|list|table|json|step|number)\b/i;
  const prompts = (payload.aiLogs || '').split('\n').map(s => s.trim()).filter(Boolean);
  const promptStats = {
    count: prompts.length,
    avg_length: prompts.length ? Math.round(prompts.reduce((a, p) => a + p.length, 0) / prompts.length) : 0,
    has_role: prompts.filter(p => ROLE_HINTS.test(p)).length,
    has_ctx:  prompts.filter(p => CONTEXT_HINTS.test(p)).length,
    has_fmt:  prompts.filter(p => FORMAT_HINTS.test(p)).length,
  };
  // Hallucination cross-check: tokens from "wisdom" field vs interview transcript
  const tokenize = (s) => (s || '').toLowerCase().split(/[\s,.!?;:()[\]{}<>"'`\n\r\t]+/).filter(t => t.length >= 3);
  const wisdomTokens = new Set(tokenize(payload.wisdom));
  const interviewTokens = new Set(tokenize(payload.interview));
  const overlap = [...wisdomTokens].filter(t => interviewTokens.has(t)).length;
  const overlapPct = wisdomTokens.size > 0 ? (overlap / wisdomTokens.size) * 100 : 0;
  // Originality: prompt count vs total output text ratio
  const outputLen = (payload.wisdom || '').length + (payload.strengths || '').length + (payload.selectedIdea || '').length;
  const promptLen = prompts.reduce((a, p) => a + p.length, 0);
  const originality = promptLen > 0 ? Math.min(100, Math.round((promptLen / Math.max(1, outputLen)) * 100)) : 0;

  const sys = `You are an AI literacy coach evaluating a Thai high-school student team's use of AI in a sustainability project (Green Rayong AI Storytellers). Provide a structured audit in Thai (use English technical terms in parentheses).

Reply with ONLY a JSON object — no preamble, no markdown:
{
  "summary": "2-3 sentences in Thai overall assessment",
  "strengths": ["bullet 1", "bullet 2", ...],
  "concerns": ["bullet 1", "bullet 2", ...],
  "recommendations": ["actionable advice for students 1", ...],
  "teaching_points": ["what teacher should focus on next 1", ...],
  "per_prompt_feedback": [
    { "prompt_idx": 1, "rating": "good|ok|weak", "feedback": "Thai feedback" },
    ...
  ]
}

Limit each bullet to ≤30 Thai words. Provide 3-5 items per array. For per_prompt_feedback, pick the 3 most concerning OR exemplary prompts (by index 1-N).`;

  const userPrompt = `Team: ${payload.teamName || teamId}
IoT module: ${payload.iotModule || '-'}
Product: ${payload.product || '-'}
Selected idea: ${payload.selectedIdea || '-'}
Strengths: ${(payload.strengths || '').slice(0, 300)}
Wisdom field: ${(payload.wisdom || '').slice(0, 400)}
Interview from sage: ${(payload.interview || '').slice(0, 500)}
BMC: cost ${payload.cost || '-'} / price ${payload.price || '-'} / customer ${payload.customer || '-'}

== AI Prompt Logs (${prompts.length} prompts) ==
${prompts.map((p, i) => `${i+1}. ${p}`).join('\n').slice(0, 3000)}

== Heuristic pre-analysis ==
- Prompt count: ${promptStats.count}
- Avg length: ${promptStats.avg_length} chars
- Has Role/persona: ${promptStats.has_role}/${promptStats.count}
- Has Context: ${promptStats.has_ctx}/${promptStats.count}
- Has Format hint: ${promptStats.has_fmt}/${promptStats.count}
- Wisdom-Interview token overlap: ${overlapPct.toFixed(0)}% (low = AI may have generated wisdom without grounding)
- Prompt:Output ratio: ${originality}% (low = student may have copy-pasted long AI output from short prompt)

Audit and report in JSON.`;

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: sys,
    messages: [{ role: 'user', content: userPrompt }]
  };

  // ─── DEMO MODE: Generate Mock Audit from local heuristics (no API call) ───
  let parsed;
  if (useMockMode) {
    parsed = buildMockAuditResult(payload, prompts, promptStats, overlapPct, originality);
  } else {
    const url = proxy || 'https://api.anthropic.com/v1/messages';
    const headers = proxy
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const text = (data.content || []).map(c => c.text || '').join('').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    try { parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null; } catch { /* parse error */ }
    if (!parsed) throw new Error('AI ตอบไม่เป็น JSON: ' + text.slice(0, 150));
  }

  // Save to ai_audits collection (history)
  const auditRef = await addDoc(collection(db, 'ai_audits'), {
    team_id:          String(teamId),
    team_name:        payload.teamName || '',
    audit_at:         serverTimestamp(),
    generated_by_id:   me.id   || null,
    generated_by_name: me.name || 'Unknown',
    mock_mode:         useMockMode,
    // Heuristic facts
    prompt_count:     promptStats.count,
    avg_length:       promptStats.avg_length,
    role_count:       promptStats.has_role,
    ctx_count:        promptStats.has_ctx,
    fmt_count:        promptStats.has_fmt,
    wisdom_overlap_pct: Math.round(overlapPct),
    originality_score:  originality,
    // AI judgment
    summary:               parsed.summary || '',
    strengths:             parsed.strengths || [],
    concerns:              parsed.concerns || [],
    recommendations:       parsed.recommendations || [],
    teaching_points:       parsed.teaching_points || [],
    per_prompt_feedback:   parsed.per_prompt_feedback || []
  });

  return { ok: true, id: auditRef.id, mock_mode: useMockMode, ...parsed, heuristics: { ...promptStats, overlapPct, originality } };
}

// ─── Mock Audit Generator (Demo Mode) ──────────────────
// สร้างผล Audit แบบสมจริงจาก heuristic ที่คำนวณ local อยู่แล้ว
// ใช้ตอนยังไม่ได้ตั้ง API key / Proxy → ระบบจะไม่ error และ Demo ได้ทันที
function buildMockAuditResult(payload, prompts, stats, overlapPct, originality) {
  const teamName = payload.teamName || 'ทีมนี้';
  const promptCount = stats.count || 0;
  const roleRate = promptCount ? Math.round((stats.has_role / promptCount) * 100) : 0;
  const ctxRate  = promptCount ? Math.round((stats.has_ctx  / promptCount) * 100) : 0;
  const fmtRate  = promptCount ? Math.round((stats.has_fmt  / promptCount) * 100) : 0;
  const avgLen   = stats.avg_length || 0;

  // คำนวณ "เกรด" รวมจาก heuristic
  const score = Math.round(
    (Math.min(promptCount, 10) / 10) * 25 +    // ปริมาณ Prompt (max 25)
    (roleRate / 100) * 20 +                     // Role pattern (max 20)
    (ctxRate  / 100) * 15 +                     // Context (max 15)
    (fmtRate  / 100) * 15 +                     // Format (max 15)
    (Math.min(overlapPct, 100) / 100) * 15 +    // Wisdom-Interview overlap (max 15)
    (Math.min(originality, 100) / 100) * 10     // Originality (max 10)
  );

  let tier;
  if (score >= 80)       tier = 'L4 (Impact Creator)';
  else if (score >= 60)  tier = 'L3 (Standard Achiever)';
  else if (score >= 40)  tier = 'L2 (Developing)';
  else                   tier = 'L1 (Needs Support)';

  // Summary
  const summary = `ทีม ${teamName} ใช้ AI ${promptCount} prompts (avg ${avgLen} ตัวอักษร) — คะแนนรวม ${score}/100 = ${tier} · ${roleRate >= 60 ? 'มีการกำหนด Role ชัดเจน (Role-based prompting)' : 'ยังขาด Role-based prompting'} · ${overlapPct >= 30 ? 'ข้อมูลภูมิปัญญาเชื่อมโยงปราชญ์ดี' : 'ข้อมูลภูมิปัญญายังไม่เชื่อมโยงปราชญ์เท่าที่ควร'}`;

  // Strengths (3-5 ข้อ จากค่าที่ดี)
  const strengths = [];
  if (promptCount >= 5)     strengths.push(`ใช้ AI ${promptCount} ครั้ง — แสดงถึงการพึ่งพา AI เป็นเครื่องมือสม่ำเสมอ`);
  if (roleRate >= 60)       strengths.push(`Role-based prompting แข็งแกร่ง (${roleRate}% ของ prompts ใช้ "Act as" หรือ "You are")`);
  if (ctxRate >= 50)        strengths.push(`ใส่ Context ใน prompts (${ctxRate}%) — AI เข้าใจบริบทระยอง`);
  if (fmtRate >= 50)        strengths.push(`กำหนด Format ผลลัพธ์ (${fmtRate}%) — ควบคุม output ของ AI ได้ดี`);
  if (overlapPct >= 40)     strengths.push(`ภูมิปัญญาเชื่อมโยงปราชญ์ ${overlapPct.toFixed(0)}% — มี Cultural Authenticity`);
  if (originality >= 30)    strengths.push(`Prompt:Output ratio ${originality}% — แสดงการคิดเองก่อนถาม AI`);
  if (avgLen >= 100)        strengths.push(`Prompt ยาวเฉลี่ย ${avgLen} ตัวอักษร — เป็น Detailed Prompt`);
  if (strengths.length === 0) strengths.push('ทีมมีความพยายามใช้ AI เป็นเครื่องมือ — เป็นจุดเริ่มต้นที่ดี');

  // Concerns (3-5 ข้อ จากค่าที่ต่ำ)
  const concerns = [];
  if (promptCount < 3)      concerns.push(`ใช้ AI น้อย (${promptCount} prompts) — ควรใช้ AI เป็นเครื่องมือมากกว่านี้`);
  if (roleRate < 40)        concerns.push(`Role-based prompting ต่ำ (${roleRate}%) — prompts ส่วนใหญ่ขาด "Act as a..." persona`);
  if (ctxRate < 40)         concerns.push(`Prompts ขาด Context (${ctxRate}%) — AI อาจตอบนอกบริบทระยอง`);
  if (fmtRate < 30)         concerns.push(`Format constraints ต่ำ (${fmtRate}%) — output ของ AI อาจไม่สม่ำเสมอ`);
  if (overlapPct < 20)      concerns.push(`Wisdom-Interview overlap ต่ำ (${overlapPct.toFixed(0)}%) — เสี่ยง Hallucination`);
  if (originality < 15)     concerns.push(`Prompt:Output ratio ต่ำ (${originality}%) — อาจ Copy-Paste AI output โดยไม่ดัดแปลง`);
  if (avgLen < 30)          concerns.push(`Prompts สั้นเฉลี่ย ${avgLen} ตัวอักษร — เป็น Vague Prompt`);
  if (concerns.length === 0) concerns.push('ไม่พบจุดที่ต้องกังวลรุนแรง — ทีมพื้นฐานดี รักษามาตรฐานนี้ต่อไป');

  // Recommendations
  const recommendations = [];
  if (roleRate < 60) recommendations.push('ลองใส่ "Act as a [role]" หรือ "You are a [expert]" ในทุก prompt');
  if (ctxRate  < 60) recommendations.push('ใส่ Context: "Given that we are in Rayong, Thailand..." หรือ "The audience is..."');
  if (fmtRate  < 50) recommendations.push('กำหนด Format: "Respond in JSON" / "Use bullet points" / "Max 5 sentences"');
  if (overlapPct < 30) recommendations.push('Cross-check ข้อมูล AI กับสัมภาษณ์ปราชญ์ — บันทึกใน AI Audit Log');
  if (originality < 20) recommendations.push('แก้ไข AI output ก่อนนำไปใช้ — อย่า Copy-Paste ตรงๆ');
  if (promptCount < 5) recommendations.push('Iterative Prompting — ถาม AI หลายรอบ ปรับแก้ทีละขั้น');
  if (recommendations.length === 0) recommendations.push('ทดลอง Chain-of-Thought prompting — ขอให้ AI อธิบายเหตุผลก่อนตอบ');
  recommendations.push(`เป้าหมายถัดไป: ขยับจาก ${tier} → ${tier.includes('L1') ? 'L2' : tier.includes('L2') ? 'L3' : tier.includes('L3') ? 'L4 (TPQI)' : 'TPQI Level 5 (Mentor)'}`);

  // Teaching points
  const teaching_points = [
    `ครูเน้นย้ำ: "Role + Context + Format" คือสูตร Prompt Engineering ที่ทำให้ AI ตอบดีขึ้น 3 เท่า`,
    overlapPct < 30
      ? 'ครูควรช่วยทีมตรวจสอบข้อมูลภูมิปัญญากับปราชญ์อีกครั้ง — Anti-Hallucination'
      : 'ครูชมการเชื่อมโยงปราชญ์ — เป็นจุดแข็งที่ควรเล่าใน Pitch',
    originality < 20
      ? 'ครูสอนเทคนิคแก้ไข AI output — เพิ่ม Voice ของนักเรียนเอง'
      : 'ครูชม Iterative Refinement — ทีมแก้ไข AI output ไม่ใช่ Copy-Paste'
  ];

  // Per-prompt feedback (เลือก 3 prompts: ดีสุด + อ่อนสุด + กลาง)
  const ranked = prompts.map((p, i) => {
    let s = 0;
    if (/\b(act as|you are|imagine you|in the role of|as a|as an)\b/i.test(p)) s += 3;
    if (/\b(given|the topic is|context|background|about|for the|target)\b/i.test(p)) s += 2;
    if (/\b(format|return|respond with|output|list|table|json|step|number)\b/i.test(p)) s += 2;
    if (p.length >= 100) s += 1;
    return { i: i + 1, p, s };
  }).sort((a, b) => b.s - a.s);

  const per_prompt_feedback = [];
  if (ranked.length > 0) {
    const best = ranked[0];
    per_prompt_feedback.push({
      prompt_idx: best.i,
      rating: best.s >= 5 ? 'good' : best.s >= 3 ? 'ok' : 'weak',
      feedback: best.s >= 5
        ? `ตัวอย่างที่ดี — มีทั้ง Role + Context + Format (${best.s}/8 คะแนน) สามารถใช้สอนเพื่อนได้`
        : best.s >= 3
        ? `Prompt พื้นฐานดี (${best.s}/8) แต่ขาด Format constraint — ลองเพิ่ม "Respond in JSON" หรือ "Max 100 words"`
        : `Prompt สั้น/กว้างเกินไป (${best.s}/8) — ใส่ Role + Context จะได้ผลลัพธ์ตรงเป้ากว่า`
    });
  }
  if (ranked.length > 2) {
    const mid = ranked[Math.floor(ranked.length / 2)];
    per_prompt_feedback.push({
      prompt_idx: mid.i,
      rating: mid.s >= 3 ? 'ok' : 'weak',
      feedback: `Prompt ${mid.i} ระดับกลาง — มีศักยภาพแต่ยังเพิ่ม Specificity ได้`
    });
  }
  if (ranked.length > 1) {
    const worst = ranked[ranked.length - 1];
    per_prompt_feedback.push({
      prompt_idx: worst.i,
      rating: 'weak',
      feedback: `อ่อนสุด (${worst.s}/8) — ตัวอย่างที่ควรปรับปรุง: ใส่ "Act as [role], given [context], respond in [format]"`
    });
  }

  return { summary, strengths, concerns, recommendations, teaching_points, per_prompt_feedback };
}

export function subscribeToAiAudits(callback) {
  return onSnapshot(collection(db, 'ai_audits'), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => (b.audit_at?.seconds || 0) - (a.audit_at?.seconds || 0));
    callback(rows);
  });
}

// Lightweight: ask AI to give feedback on a SINGLE prompt (in-line action)
export async function aiFeedbackOnPrompt(prompt) {
  const apiKey = localStorage.getItem('eco_anthropic_key');
  let proxy = localStorage.getItem('eco_ai_proxy');
  try {
    const cfgSnap = await getDoc(doc(db, 'app_config', 'main'));
    if (cfgSnap.exists() && cfgSnap.data().aiProxyUrl) proxy = cfgSnap.data().aiProxyUrl;
  } catch { /* ignore */ }
  // Demo Mode Fallback
  if (!apiKey && !proxy) {
    const hasRole = /\b(act as|you are|imagine you|in the role of|as a|as an)\b/i.test(prompt);
    const hasCtx  = /\b(given|the topic is|context|background|about|for the|target)\b/i.test(prompt);
    const hasFmt  = /\b(format|return|respond with|output|list|table|json|step|number)\b/i.test(prompt);
    const len = prompt.length;
    const score = (hasRole ? 1 : 0) + (hasCtx ? 1 : 0) + (hasFmt ? 1 : 0) + (len > 80 ? 1 : 0);

    const strengths = [];
    if (hasRole) strengths.push('มี Role-based pattern ("Act as..." / "You are...")');
    if (hasCtx)  strengths.push('มี Context ระบุบริบทชัดเจน');
    if (hasFmt)  strengths.push('กำหนด Output Format');
    if (len > 80) strengths.push(`Prompt มีรายละเอียดดี (${len} ตัวอักษร)`);
    if (strengths.length === 0) strengths.push('Prompt เริ่มต้นได้ — มีศักยภาพพัฒนาต่อ');

    const fixes = [];
    if (!hasRole) fixes.push('เพิ่ม Role: "Act as a marine biologist" / "You are a Thai bilingual teacher"');
    if (!hasCtx)  fixes.push('เพิ่ม Context: "Given that we are in Rayong, Thailand..."');
    if (!hasFmt)  fixes.push('กำหนด Format: "Respond in JSON" / "Use bullet points" / "Max 5 sentences"');
    if (len < 50) fixes.push('Prompt สั้นเกินไป ลองใส่รายละเอียดเพิ่ม');

    let better;
    if (score >= 3) {
      better = '🌟 Prompt นี้ระดับดี! ลองทำ Iterative — ขอ AI วิจารณ์ผลลัพธ์ของตัวเอง';
    } else {
      better = '💡 ตัวอย่างที่ดีกว่า: "Act as a [role], given [Rayong context], generate [content] in [format]"';
    }

    return `🧪 Demo Mode (Heuristic Analysis)\n\n✨ จุดเด่น:\n${strengths.map(s => `• ${s}`).join('\n')}\n\n⚡ จุดที่ปรับได้:\n${fixes.length ? fixes.map(s => `• ${s}`).join('\n') : '• ไม่พบจุดที่ต้องปรับชัดเจน'}\n\n${better}`;
  }
  const sys = 'คุณคือผู้ช่วยสอน Prompt Engineering. ให้ feedback สั้นๆ ภาษาไทย (≤60 คำ) สำหรับ prompt ที่ส่งมา: ระบุ 1) จุดเด่น 2) จุดที่ปรับได้ 3) ตัวอย่าง prompt ที่ดีกว่า. ตอบเป็นข้อความล้วน ไม่ใช้ markdown';
  const url = proxy || 'https://api.anthropic.com/v1/messages';
  const headers = proxy ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify({
    model: 'claude-sonnet-4-6', max_tokens: 250, system: sys,
    messages: [{ role: 'user', content: `Prompt: "${prompt}"` }]
  })});
  if (!res.ok) throw new Error(`Claude ${res.status}`);
  const data = await res.json();
  return ((data.content || []).map(c => c.text || '').join('') || '').trim();
}

// AI advise: generate advice text (no scoring) for a team or student.
// Stores it as feedback with evaluator_role='ai' so it shows up alongside human notes.
export async function aiAdviseFeedback(targetType, targetId, payload) {
  const apiKey = localStorage.getItem('eco_anthropic_key');
  let proxy = localStorage.getItem('eco_ai_proxy');
  try {
    const cfgSnap = await getDoc(doc(db, 'app_config', 'main'));
    if (cfgSnap.exists() && cfgSnap.data().aiProxyUrl) proxy = cfgSnap.data().aiProxyUrl;
  } catch { /* ignore */ }
  const useMockMode = !apiKey && !proxy;

  let text;
  if (useMockMode) {
    text = buildMockAdvice(targetType, payload, targetId);
  } else {
    const sys = `You are a kind but rigorous Thai-language coach for a high-school STEM/sustainability project (Green Rayong AI Storytellers). Provide actionable advice. Keep it ≤120 words, use 2-4 bullet points, polite Thai with English technical terms in parentheses. End with one specific next step.`;

    const userPrompt = targetType === 'team'
      ? `Team: ${payload.teamName || targetId}
Submission status: ${payload.status || 'pending'}
Avg score by dimension: ${JSON.stringify(payload.dimAvg || {})}
IoT module: ${payload.iotModule || '-'}  Product: ${payload.product || '-'}
BMC: cost ${payload.cost || '-'} / price ${payload.price || '-'}
AI prompt logs (first 500 chars): ${(payload.aiLogs || '').slice(0, 500)}

Please give concrete advice on how this team can improve their final project.`
      : `Student: ${payload.studentName || targetId}
Team: ${payload.teamName || '-'}
Their team's avg scores: ${JSON.stringify(payload.dimAvg || {})}
Self assessment given: ${payload.selfAvg ?? '-'}/5
Peer assessment received: ${payload.peerAvg ?? '-'}/5

Please give concrete personal advice for this student to improve their contribution and learning.`;

    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: sys,
      messages: [{ role: 'user', content: userPrompt }]
    };

    const url = proxy || 'https://api.anthropic.com/v1/messages';
    const headers = proxy
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    text = (data.content || []).map(c => c.text || '').join('').trim();
    if (!text) throw new Error('AI ไม่ได้ให้คำแนะนำ');
  }

  await saveFeedback(targetType, targetId, text, {
    evaluatorId: 'ai_advisor', evaluatorName: 'AI Advisor' + (useMockMode ? ' (Demo)' : ''), evaluatorRole: 'ai'
  });
  return { ok: true, mock_mode: useMockMode, text };
}

// Mock Advice Generator (Demo Mode)
function buildMockAdvice(targetType, payload, targetId) {
  if (targetType === 'team') {
    const dims = payload.dimAvg || {};
    const entries = Object.entries(dims).filter(([, v]) => Number(v) > 0);
    const avg = entries.length ? entries.reduce((a, [, v]) => a + Number(v), 0) / entries.length : 0;
    const sorted = entries.sort((a, b) => a[1] - b[1]);
    const weak = sorted[0] || ['ทั่วไป', 0];
    const strong = sorted[sorted.length - 1] || ['ทั่วไป', 0];
    const cost = Number(payload.cost) || 0;
    const price = Number(payload.price) || 0;
    const margin = price - cost;

    const tier = avg >= 4 ? 'ดีเยี่ยม' : avg >= 3 ? 'ดี' : avg >= 2 ? 'กำลังพัฒนา' : 'ต้องการการสนับสนุน';

    return `🧪 Demo Mode — คำแนะนำสำหรับทีม ${payload.teamName || targetId}

ภาพรวมระดับ "${tier}" (avg ${avg.toFixed(1)}/5)

• **จุดเด่น (${strong[0]} ${Number(strong[1]).toFixed(1)})** — รักษามาตรฐานนี้ + ใช้เป็นจุดขายใน Pitch
• **จุดที่ควรพัฒนา (${weak[0]} ${Number(weak[1]).toFixed(1)})** — เน้นเพิ่ม ${weak[0] === 'AI Prompting' ? 'Role-based prompting + Format constraints' : weak[0] === 'Local Wisdom' ? 'การสัมภาษณ์ปราชญ์เชิงลึก' : weak[0] === 'Business Plan' ? 'BMC + SROI ตรงมาตรฐาน SET' : weak[0] === 'Creativity' ? 'Iterative Refinement ของ AI Output' : 'การเล่าเรื่องสองภาษา + Soft Power ระยอง'}
${margin > 0 ? `• **Margin (${margin} บาท)** — โมเดลธุรกิจน่าสนใจ ลองคำนวณ SROI เพิ่ม` : '• **BMC** — ใส่ต้นทุน-ราคา-Margin ให้ชัดเจน ก่อน Pitch'}

**Next Step:** ฝึก ${weak[0]} ผ่าน Workshop กับครู 30 นาที ก่อน Pitch จริง`;
  }
  // student advice
  const selfAvg = Number(payload.selfAvg) || 0;
  const peerAvg = Number(payload.peerAvg) || 0;
  const gap = selfAvg - peerAvg;

  return `🧪 Demo Mode — คำแนะนำสำหรับ ${payload.studentName || targetId}

ทีม: ${payload.teamName || '-'}

• **Self vs Peer** — ตนเอง ${selfAvg.toFixed(1)} vs เพื่อน ${peerAvg.toFixed(1)} ${gap > 0.5 ? '(ประเมินตนเองสูงกว่าเพื่อน — ลอง Reflection)' : gap < -0.5 ? '(เพื่อนเห็นจุดเด่นมากกว่าที่ตนเองรู้สึก — เพิ่มความมั่นใจ)' : '(สมดุล — รู้จักตนเองดี)'}
• **จุดแข็ง** — Growth Mindset แสดงผ่านการ Iterate งานบ่อยครั้ง
• **จุดพัฒนา** — เพิ่มการสื่อสารในทีม + รับ Feedback อย่างเปิดใจ

**Next Step:** เลือก 1 ทักษะใหม่ที่อยากพัฒนา + ตั้งเป้าหมายภายใน 2 สัปดาห์`;
}

// ─── Reset & Seed Demo Data ─────────────────────────────
// DESTRUCTIVE: clears Firestore docs in core collections and rebuilds from scratch:
// ─── MULTI-COURSE CRUD (v2.0 Phase 1.2) ─────────────────────────────
// Courses live in /courses/{courseId}. Each course is a self-contained config
// (stages, identities, rubric, worksheets, branding). UI fetches active course
// and merges with BUILTIN_COURSES fallback. Designed for backwards compatibility:
// teams without a courseId still work — they default to 'green-rayong'.

// Subscribe to all courses (admin uses this to populate Course list + dropdowns)
export function subscribeToCourses(callback) {
  return onSnapshot(collection(db, 'courses'), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort: isDefault first, then by name
    rows.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return (a.name || a.id).localeCompare(b.name || b.id);
    });
    callback(rows);
  });
}

// Read one course (used for course-aware components on demand)
export async function getCourse(courseId) {
  const snap = await getDoc(doc(db, 'courses', courseId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Create a new course (admin form). `data` should match LEGACY_GREEN_RAYONG_COURSE shape.
export async function createCourse(courseId, data) {
  if (!courseId || !/^[a-z0-9-]{3,40}$/.test(courseId)) {
    throw new Error('Invalid courseId — use lowercase letters, digits, hyphens (3-40 chars)');
  }
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  await setDoc(doc(db, 'courses', courseId), {
    ...data,
    id: courseId,
    schemaVersion: data.schemaVersion || 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    created_by: me.id || null
  }, { merge: false });
  return { ok: true, id: courseId };
}

// Patch course (admin edit). Use this for partial updates so subscribers see real-time changes.
export async function updateCourse(courseId, patch) {
  await updateDoc(doc(db, 'courses', courseId), {
    ...patch,
    updated_at: serverTimestamp()
  });
}

// Delete course (admin only — confirm in UI, this won't delete linked teams/submissions)
export async function deleteCourse(courseId) {
  if (courseId === 'green-rayong') {
    throw new Error('Cannot delete the legacy default course (green-rayong)');
  }
  await deleteDoc(doc(db, 'courses', courseId));
}

// Clone an existing course (useful: "duplicate Green Rayong → tweak for new region")
export async function cloneCourse(sourceCourseId, newCourseId, overrides = {}) {
  const src = await getCourse(sourceCourseId);
  if (!src) throw new Error(`Source course not found: ${sourceCourseId}`);
  // eslint-disable-next-line no-unused-vars
  const { id: _id, created_at: _ca, updated_at: _ua, created_by: _cb, ...rest } = src;
  return createCourse(newCourseId, {
    ...rest,
    ...overrides,
    isDefault: false,  // clones are never default
    name: overrides.name || `${src.name} (Copy)`
  });
}

// Set the default course (admin: pick which course new students/teams go to)
// Only one course can have isDefault=true at a time. Stored in app_config.
export async function setDefaultCourse(courseId) {
  await setDoc(APP_CONFIG_DOC, { default_course_id: courseId, updated_at: serverTimestamp() }, { merge: true });
  // Optimistic update: also flip the isDefault flag on the course docs
  const allCourses = await getDocs(collection(db, 'courses'));
  const batch = [];
  for (const d of allCourses.docs) {
    if (d.id === courseId)         batch.push(updateDoc(d.ref, { isDefault: true }));
    else if (d.data().isDefault)   batch.push(updateDoc(d.ref, { isDefault: false }));
  }
  await Promise.all(batch);
}

// ─── Subjects (รายวิชา) — standalone subject records, referenced by courses ──────
// Firestore collection: `subjects`  key: subject code (e.g. "30204-2003")

export function subscribeToSubjects(callback) {
  return onSnapshot(collection(db, 'subjects'), (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(rows.sort((a, b) => (a.code || a.name || a.id).localeCompare(b.code || b.name || b.id)));
  });
}

export async function createSubject(subjectId, data) {
  if (!subjectId) throw new Error('subjectId is required');
  await setDoc(doc(db, 'subjects', subjectId), {
    ...data,
    created_at: new Date().toISOString(),
  });
}

export async function updateSubject(subjectId, patch) {
  await updateDoc(doc(db, 'subjects', subjectId), { ...patch, updated_at: new Date().toISOString() });
}

export async function deleteSubject(subjectId) {
  await deleteDoc(doc(db, 'subjects', subjectId));
}

// Worksheet versioning helper (decision #3 — auto-migrate matching field IDs)
// Given old worksheet data + new worksheet schema, keep matching fields, leave new fields blank.
export function migrateWorksheetData(oldData, newSchema) {
  if (!oldData || !newSchema?.fields) return oldData || {};
  const newData = {};
  for (const field of newSchema.fields) {
    if (Object.prototype.hasOwnProperty.call(oldData, field.id)) {
      newData[field.id] = oldData[field.id];  // preserve matching field
    }
    // else: leave undefined → form will show as empty input for student to fill
  }
  // Preserve metadata fields (team, date, etc.) even if not in schema
  ['team', 'date', 'submittedAt', 'submittedBy', '_meta'].forEach(k => {
    if (oldData[k] != null) newData[k] = oldData[k];
  });
  return newData;
}

// Seed the legacy Green Rayong course into Firestore (one-time, on first admin visit)
// Called from setupGreenRayongCourse() or auto-run from Admin → Courses if empty.
export async function seedLegacyGreenRayongCourse(courseData) {
  const existing = await getCourse('green-rayong');
  if (existing) return { ok: true, skipped: true, reason: 'Already exists' };
  await createCourse('green-rayong', { ...courseData, isDefault: true });
  return { ok: true, created: true };
}

// ─── Multi-Course Worksheet Submissions (v2.0 Phase 7) ──────────────
// Each submission is keyed by (team, course, worksheet) so a team can
// fill the same worksheet under different courses without conflict.

export async function saveWorksheetSubmission(teamId, courseId, worksheetId, data) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const safeWsId = String(worksheetId).replace(/[^\w-]/g, '_');
  const submissionId = `${String(teamId)}_${courseId}_${safeWsId}`;
  await setDoc(doc(db, 'submissions', submissionId), {
    team_id      : String(teamId),
    course_id    : courseId,
    worksheet_id : worksheetId,
    step         : worksheetId,  // legacy compat field
    content      : data || {},
    submitted_at : serverTimestamp(),
    submitted_by_id   : me.id || null,
    submitted_by_name : me.name || null
  }, { merge: true });
  return { ok: true, id: submissionId };
}

export async function saveWorksheetScore(teamId, courseId, worksheetId, { score, comment }) {
  const me = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const safeWsId = String(worksheetId).replace(/[^\w-]/g, '_');
  const submissionId = `${String(teamId)}_${courseId}_${safeWsId}`;
  await setDoc(doc(db, 'submissions', submissionId), {
    score           : score !== '' && score != null ? Number(score) : null,
    score_comment   : comment || '',
    graded_by_id    : me.id || null,
    graded_by_name  : me.name || null,
    graded_at       : serverTimestamp(),
  }, { merge: true });
  return { ok: true };
}

export function subscribeToWorksheetSubmissions(teamId, courseId, callback) {
  // Narrow the listener to the current course only (single-field index — auto-created by Firestore).
  // Then filter team_id client-side.  This eliminates the "whole submissions collection" listener
  // that was firing on every write from any team and causing the worksheet form to reset while typing.
  if (!teamId || !courseId) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'submissions'), where('course_id', '==', courseId));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(s => String(s.team_id) === String(teamId));
    callback(rows);
  });
}

// ─── END Multi-Course CRUD ──────────────────────────────────────────

// ─── Top-up Demo Users ──────────────────────────────────────────────
// Non-destructive — fills the school roster up to target counts without
// touching existing users. Useful for setting up a classroom-sized demo.
// Default password per role: teacher123 / student123 / sage123.

const _DEMO_NAMES = {
  teacher: [
    'ครูสมชาย ใจดี',  'ครูวันชัย รักการสอน', 'ครูปริญญา ครุฑน้อย',
    'ครูดวงใจ ศิริ',   'ครูอนงค์ ทองดี',      'ครูมานพ พงษ์เกษม',
    'ครูสุริยา สว่าง', 'ครูศิริพร แสงทอง',    'ครูประเสริฐ ดีงาม',
    'ครูพรพรรณ มณีรัตน์', 'ครูธีรพงษ์ ทอแสง', 'ครูนงนุช วงศ์ไพศาล',
    'ครูสมพร แก้วใส',   'ครูวิภา ใจกล้า',    'ครูสุดา ทรงคุณ'
  ],
  sage: [
    'ลุงสมาน ผู้รู้ภูมิปัญญา', 'ป้าใจดี ทอผ้าซิ่น',  'ลุงประสิทธิ์ ปราชญ์ป่า',
    'ป้าสมศรี กะปิเคย',     'ลุงบุญมา หมอชาวบ้าน', 'ป้าวาสนา หมอนวด',
    'ลุงเฉลิม ปราชญ์นา',     'ป้านงเยาว์ ทำขนมไทย',  'ลุงสุรินทร์ ปราชญ์เล',
    'ป้ามาลี หมอสมุนไพร',    'ลุงคำพอง ปราชญ์สวน'
  ],
  student: [
    'นภา สวยงาม',     'อรนุช ใจดี',     'พิมพ์ใจ มาลัย',   'วิชัย เก่งดี',
    'สมศักดิ์ ขยัน',  'ธนากร พงศ์ชัย', 'ปิยะพร ศรีสุข',  'อรอนงค์ จันทร์เพ็ญ',
    'กิตติพงษ์ ภักดี','รัตนา เพชรงาม',  'ภูมิ ขยัน',       'กานดา ทองดี',
    'อรอนงค์ สง่างาม','นภา สวยงาม',     'ธนวัฒน์ มั่นคง', 'ปวีณา รักการ',
    'แก้วใจ ดอกไม้',  'นิภา รักษ์ดี',   'ชาญ ใหญ่ใจ',     'ปวีณ ใจกล้า',
    'พิชา รุ่งเรือง', 'มงคล ทรงชัย',   'อรพินท์ สวยใส',  'สุริยะ แสงทอง',
    'วรพล ดีพร้อม',   'ลลิตา เก็บเกี่ยว','เกวลิน ทองคำ',  'พงศกร สุขใจ',
    'อาทิตย์ ฉายแสง', 'พิชาดา สวยงาม', 'ภัทรพล มั่นใจ',  'จันทิมา ลออ',
    'รัชนี รุ่งทรัพย์','ยุทธพงษ์ พลัง', 'ขวัญใจ เพชรงาม','สิริพร ใสสว่าง',
    'ปรีดา หาญสู้',   'กิตติชัย สู้กับ','ดวงใจ มาดี',     'พิชญา สวยใส',
    'รสริน รักงาน',   'อังคณา สวยงาม','พิรญาณ์ ทองดี',  'ธีระยุทธ พงษ์ใจ',
    'ปวริศา รักการเรียน', 'กมลพร ใจกล้า', 'ธนกร ทอแสง', 'สมจิตร์ ดีงาม',
    'ปิติพล สุขใจดี', 'อรพรรณ พลังใจ', 'พิมลพรรณ รุ่งเรือง'
  ]
};

// Add users to reach target counts. Does NOT remove or modify existing users.
// `targets` defaults to a full classroom: 10 teachers · 45 students · 9 sages.
export async function topUpDemoUsers(targets = { teacher: 10, student: 45, sage: 9 }) {
  const existing = await getUsers().catch(() => []);
  const byRole = {};
  for (const u of (existing || [])) {
    if (!u) continue;
    const r = u.role || 'student';
    byRole[r] = (byRole[r] || 0) + 1;
  }

  const results = {};
  for (const role of ['teacher', 'sage', 'student']) {
    const have = byRole[role] || 0;
    const need = Math.max(0, (targets[role] || 0) - have);
    const password = role === 'teacher' ? 'teacher123' : role === 'sage' ? 'sage123' : 'student123';
    const names = _DEMO_NAMES[role] || [];
    let added = 0, skipped = 0;

    for (let i = 0; i < need; i++) {
      const seq = have + i + 1;
      const username = `${role}${String(seq).padStart(2, '0')}`;
      const name = names[(seq - 1) % names.length] + (seq > names.length ? ` ${seq}` : '');
      try {
        await adminCreateUser({ name, username, password, role });
        added++;
      } catch {
        skipped++;
        // already exists or auth error — continue
      }
    }
    results[role] = { had: have, target: targets[role], added, skipped };
  }
  return { ok: true, results };
}


// ─── Import real students from parsed Excel/CSV data ───────────────────────
// students: [{ name, username, password?, role?, team_id? }]
// Returns { created: [{username,name}], failed: [{username,name,error}] }
export async function importRealStudents(students) {
  const created = [], failed = [];
  for (const s of students) {
    try {
      await adminCreateUser({
        name:     s.name,
        username: s.username,
        password: s.password || 'student123',
        role:     s.role    || 'student',
        team_id:  s.team_id || null,
      });
      created.push({ username: s.username, name: s.name });
    } catch (err) {
      failed.push({ username: s.username, name: s.name, error: err.message });
    }
  }
  return { created, failed };
}


//  • 1 admin · 4 teachers · 2 sages · 12 students · 3 system test accounts · 3 teams
// Old Firebase Auth accounts remain in Auth (must be deleted manually in Console
// if you want clean slate there too — adminCreateUser handles already-exists case).
export async function resetAndSeedDemoData() {
  // Step 1: clear Firestore docs in collections that hold per-user/team data
  const collectionsToClear = [
    'users', 'teams', 'team_scores', 'peer_scores',
    'submissions', 'ai_audits', 'feedback', 'activity_log'
  ];
  for (const col of collectionsToClear) {
    try {
      const snap = await getDocs(collection(db, col));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) { console.warn(`clear ${col}:`, e); }
  }

  // Step 2: create 3 teams (placeholder teacher_id; will set after teachers exist)
  const teamsCfg = [
    { key: 't1', name: 'ทีม ปวีณา',  color: '#1D9E75' },
    { key: 't2', name: 'ทีม กุลิสรา', color: '#378ADD' },
    { key: 't3', name: 'ทีม อัญชลี',  color: '#D85A30' }
  ];
  const teamIds = {};
  for (const t of teamsCfg) {
    const ref = await addDoc(collection(db, 'teams'), {
      name: t.name, color: t.color, photo_url: null, teacher_id: null, created_at: serverTimestamp()
    });
    teamIds[t.key] = ref.id;
  }

  // Step 3: create users (uses adminCreateUser which handles Auth + Firestore + email-already-in-use)
  const accounts = [];

  // -- System / role test accounts
  accounts.push({ name: 'ผู้ดูแลระบบ',     username: 'admin',        password: 'admin123',   role: 'admin'   });
  accounts.push({ name: 'นักเรียน ทดสอบ',  username: 'student_test', password: 'student123', role: 'student', team_id: teamIds.t1 });
  accounts.push({ name: 'ครู ทดสอบ',       username: 'teacher_test', password: 'teacher123', role: 'teacher' });
  accounts.push({ name: 'ปราชญ์ ทดสอบ',    username: 'sage_test',    password: 'sage123',    role: 'sage'    });

  // -- Teachers (4) — เจนจบ ไม่มีทีม (admin teacher) · อีก 3 คนคุมทีมตามชื่อ
  accounts.push({ name: 'เจนจบ',   username: 'jenchop',  password: 'teacher123', role: 'teacher' });
  accounts.push({ name: 'ปวีณา',   username: 'paweena',  password: 'teacher123', role: 'teacher', _teamLead: 't1' });
  accounts.push({ name: 'กุลิสรา', username: 'kulisara', password: 'teacher123', role: 'teacher', _teamLead: 't2' });
  accounts.push({ name: 'อัญชลี',  username: 'anchalee', password: 'teacher123', role: 'teacher', _teamLead: 't3' });

  // -- Sages (2)
  accounts.push({ name: 'ลุงสำราญ',     username: 'sage_samran',     password: 'sage123', role: 'sage' });
  accounts.push({ name: 'ลุงเฉลิมชัย',   username: 'sage_chaloemchai', password: 'sage123', role: 'sage' });

  // -- 12 students with demo Thai names, 4 per team
  const studentNames = [
    'สมชาย ใจดี',         'สมหญิง รักดี',        'นภา สวยงาม',         'ภูมิ ขยัน',
    'กานดา ทองดี',        'ชาญ ใหญ่ใจ',          'แก้วใจ ดอกไม้',      'นิภา รักษ์ดี',
    'อรอนงค์ สง่างาม',    'ธนวัฒน์ มั่นคง',     'กิตติพงษ์ ภักดี',    'รัตนาภรณ์ พิทักษ์'
  ];
  const teamKeys = ['t1','t1','t1','t1', 't2','t2','t2','t2', 't3','t3','t3','t3'];
  studentNames.forEach((name, i) => {
    accounts.push({
      name,
      username: `student${String(i + 1).padStart(2, '0')}`,
      password: 'student123',
      role: 'student',
      team_id: teamIds[teamKeys[i]]
    });
  });

  // Create accounts sequentially (Firebase Auth has rate limits if too parallel)
  const created = [];
  const failures = [];
  const uidByUsername = {};
  for (const acc of accounts) {
    try {
      const res = await adminCreateUser({
        name: acc.name, username: acc.username, password: acc.password,
        role: acc.role, team_id: acc.team_id || null
      });
      uidByUsername[acc.username] = res.uid;
      created.push(acc.username);
    } catch (err) {
      failures.push(`${acc.username}: ${err.message}`);
    }
  }

  // Step 4: assign teacher_id on teams
  for (const acc of accounts.filter(a => a._teamLead)) {
    const uid = uidByUsername[acc.username];
    if (uid && teamIds[acc._teamLead]) {
      try { await updateDoc(doc(db, 'teams', teamIds[acc._teamLead]), { teacher_id: uid }); }
      catch (e) { console.warn('assign teacher:', e); }
    }
  }

  // Step 5: Seed FULL Mock Data for showcase team (ทีม ปวีณา) — for Pitching demo
  // ทีมนี้จะมีข้อมูลครบทุก step + คะแนนเต็ม + AI Audit Log + feedback
  // เพื่อให้กรรมการเห็นภาพ "ผลงานเด็กเก่ง" ที่เด้งขึ้นระบบเรียลไทม์
  let mockDataCount = 0;
  try {
    const showcaseTeamId = teamIds.t1;
    const teacherUid = uidByUsername['paweena'];
    const sageUid = uidByUsername['sage_samran'];

    // ─── Helper: seed individual team_scores + peer_scores สำหรับ R5 Individual Summary ───
    // ใช้ profile object ต่อทีม: { teacher, sage, students[], base{dim→{self,peer,teacher,sage,ai}}, spreads{stUid→±0.x} }
    const SCORE_DIMS_LIST = ['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'];
    const AI_EVAL_SENTINEL = '__ai_auditor__';
    const _clamp15 = (v) => Math.max(1, Math.min(5, v));
    const _r1 = (v) => Math.round(v * 10) / 10;
    const seedTeamIndividualScores = async (teamId, profile) => {
      const { teacher, sage, students, base, spreads, comments = {} } = profile;
      // Team-level rows: teacher / sage / ai per dimension
      for (const dim of SCORE_DIMS_LIST) {
        const b = base[dim];
        if (teacher) {
          await setDoc(doc(db, 'team_scores', `${teamId}_${safeDocId(dim)}_${teacher}`), {
            team_id: teamId, dimension: dim, score: b.teacher,
            evaluator_id: teacher, evaluator_role: 'teacher',
            comment: comments.teacher || '', scored_at: serverTimestamp()
          });
          mockDataCount++;
        }
        if (sage) {
          await setDoc(doc(db, 'team_scores', `${teamId}_${safeDocId(dim)}_${sage}`), {
            team_id: teamId, dimension: dim, score: b.sage,
            evaluator_id: sage, evaluator_role: 'sage',
            comment: comments.sage || '', scored_at: serverTimestamp()
          });
          mockDataCount++;
        }
        await setDoc(doc(db, 'team_scores', `${teamId}_${safeDocId(dim)}_${AI_EVAL_SENTINEL}`), {
          team_id: teamId, dimension: dim, score: b.ai,
          evaluator_id: AI_EVAL_SENTINEL, evaluator_role: 'ai',
          comment: comments.ai || '', scored_at: serverTimestamp()
        });
        mockDataCount++;
      }
      // Per-student: self-score + receive peer-scores from teammates
      for (const stUsername of students) {
        const stUid = uidByUsername[stUsername];
        if (!stUid) continue;
        const spread = spreads[stUsername] || 0;
        for (const dim of SCORE_DIMS_LIST) {
          const b = base[dim];
          // Self-score
          await setDoc(doc(db, 'team_scores', `${teamId}_${safeDocId(dim)}_${stUid}`), {
            team_id: teamId, dimension: dim,
            score: _clamp15(_r1(b.self + spread)),
            evaluator_id: stUid, evaluator_role: 'self',
            comment: '', scored_at: serverTimestamp()
          });
          mockDataCount++;
          // Peer scores: ทุกคนในทีมที่ไม่ใช่ตัวเอง ประเมินคนนี้
          for (const peerUsername of students) {
            if (peerUsername === stUsername) continue;
            const peerUid = uidByUsername[peerUsername];
            if (!peerUid) continue;
            const noise = (Math.random() * 0.4) - 0.2; // ±0.2 jitter
            await setDoc(doc(db, 'peer_scores', `${peerUid}_${stUid}_${safeDocId(dim)}`), {
              evaluator_id: peerUid, target_user_id: stUid, dimension: dim,
              score: _clamp15(_r1(b.peer + spread + noise)),
              comment: '', anonymous: true, scored_at: serverTimestamp()
            });
            mockDataCount++;
          }
        }
      }
    };

    // 5.1 — Rename + brand the showcase team
    await updateDoc(doc(db, 'teams', showcaseTeamId), {
      name: 'ทีม นวัตกรเกาะกก',
      motto: 'AI + ภูมิปัญญา = Soft Power ระยอง',
      color: '#1D9E75',
      submission_status: 'approved',
      approval_by_name: 'อ.ปวีณา',
      social: [
        { platform: 'TikTok',    url: 'https://www.tiktok.com/@rayong-nawatkon-kohkok' },
        { platform: 'Facebook',  url: 'https://www.facebook.com/RayongNawatkonKohKok' },
        { platform: 'YouTube',   url: 'https://youtube.com/@rayong-koh-kok' }
      ]
    });

    // 5.2 — Helper: write submission with predictable doc id (teamId_step)
    const saveSub = async (step, content) => {
      const docId = `${showcaseTeamId}_${step}`;
      await setDoc(doc(db, 'submissions', docId), {
        team_id: showcaseTeamId,
        step,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        file_url: null,
        submitted_at: serverTimestamp()
      });
      mockDataCount++;
    };

    // 5.3 — Mission Inbox (4-Identities: สวน · ป่า · นา · เล)
    await saveSub('mission-inbox', {
      iotModule: 'ESP32 + DHT22 + Soil moisture sensor + GPS + Water pH probe',
      iotReason: 'เลือก ESP32 เพราะมี Wi-Fi/Bluetooth ในตัว ราคาประหยัด (~150 บาท) ใช้พลังงานต่ำ พร้อมต่อ sensor หลายตัวเพื่อครอบคลุมทั้ง 4 อัตลักษณ์ (สวน-ป่า-นา-เล) ติดตั้งกลางแจ้งได้กันน้ำ-กันแดด',
      product: 'นวัตกรรม "Green Rayong 4-IDs" — ระบบบริการท่องเที่ยวเชิงนิเวศ ที่รวม 3 มิติ: (1) นวัตกรรมรักษาสิ่งแวดล้อม (IoT เฝ้าระวังคุณภาพดิน-น้ำ 4 จุด: สวนมะม่วง / ป่าชายเลน / นาข้าว / ชายเล) (2) ผลิตภัณฑ์สร้างรายได้ชุมชน (คอร์ส Workshop กะปิเคย + ทอเสื่อกก + ตำมะม่วงน้ำปลาหวาน + บายศรีข้าวใหม่) (3) ระบบรายได้+อนุรักษ์ (เก็บค่าธรรมเนียมเข้าป่าชายเลน 50 บ./คน คืนชุมชน 70% เป็นกองทุนฟื้นฟูป่า)',
      productReason: 'ตอบโจทย์ ESG ของ IRPC พร้อมกัน 3 มิติ + ดึงนักท่องเที่ยว Biennale 2027 (คาด 500 คน/เดือน) + สร้างรายได้กระจายสู่ 47 ครัวเรือนชุมชนเกาะกก + บันทึกข้อมูล Realtime เพื่อพิสูจน์ Carbon offset ขอทุน Climate Fund ต่อไป'
    });

    // 5.4 — On-site Collector (Interview log)
    await saveSub('collector', {
      siteName: 'ป่าชายเลนพระเจดีย์กลางน้ำ ชุมชนเกาะกก ตำบลเชิงเนิน',
      sageName: 'ลุงสำราญ ทองคำ (ปราชญ์ป่าชายเลน 35 ปี)',
      interview: `วันที่ลงพื้นที่: 12 พ.ค. 2569
สัมภาษณ์ลุงสำราญ (ปราชญ์อายุ 68 ปี ดูแลป่าชายเลน 35 ปี)

Q: ป่าชายเลนเกาะกกมีอะไรพิเศษ?
A: "เกาะกกของเรามีไม้โกงกางใบใหญ่ ไม้ลำพู ไม้แสม รวมกว่า 12 ชนิด เป็นแหล่งอนุบาลปูแสม ปูก้ามดาบ และนกกินเปี้ยวกว่า 30 ชนิด พระเจดีย์กลางน้ำสร้างปี 2416 สมัย ร.5 เป็นสัญลักษณ์ว่าถึงระยองแล้ว"

Q: ปัญหาที่ชุมชนกำลังเผชิญ?
A: "น้ำเสียจากโรงงานปิโตรเคมีบางช่วงมีคราบน้ำมัน ดินเค็มขึ้น ต้องการระบบวัดผลที่บอกชาวบ้านได้ทันที"

Q: ภูมิปัญญาที่อยากให้สืบทอด?
A: "การทำกะปิเคยเกาะกก ที่ใช้เกลือทะเลธรรมชาติ + การทอเสื่อกกแบบโบราณ — ถ้ามีคนมาเห็นด้วยตา จะรู้คุณค่า"`,
      photos: '8 รูป (ป่าชายเลน, นกกินเปี้ยว, เครื่องวัดดิน-น้ำ DIY, คุณลุง, การทำกะปิ, ทอเสื่อกก)'
    });

    // 5.5 — Submission Gateway (BMC + AI Prompt Logs) — 4-ID Tour Package
    await saveSub('gateway', {
      strengths: 'ทีมมีนักเรียน 4 คน แบ่งหน้าที่ตาม 4 อัตลักษณ์: (1) สวน — นักเรียนภาควิชาเกษตร (2) ป่า — นักเรียนช่างไฟฟ้า (ดูแล IoT sensor ในป่าชายเลน) (3) นา — นักเรียนภาษาอังกฤษ (Bilingual storytelling) (4) เล — นักเรียนบัญชี (BMC + SROI ตามมาตรฐาน SET) ทุกคนผ่านการอบรม Prompt Engineering และทำ AI Audit Log จริง',
      environment: 'น้ำเสียจากโรงงานปิโตรเคมีที่บางช่วงปนเปื้อนคราบน้ำมัน + ขยะพลาสติกจากนักท่องเที่ยว + ดินเค็มขึ้นจาก climate change + ผลผลิตมะม่วงลดลง 20% จาก El Niño',
      affectedGroup: 'ชุมชนชาวประมง 47 ครัวเรือน + ชาวสวนมะม่วง 23 ครัวเรือน + ชาวนา 18 ครัวเรือน (รวม ~340 คน) + นักท่องเที่ยวเชิงนิเวศคาด ~500 คน/เดือน + ระบบนิเวศป่าชายเลน 320 ไร่',
      traditionalWisdom: 'การทำกะปิเคยเกาะกก (เกลือทะเลธรรมชาติ ตำกระต่ายไม้ ตากแดด 3 วัน) + การทอเสื่อกก (ตัดกกอ่อน 3 เดือน แช่น้ำ ทอลายปลาตะเพียน) + ตำมะม่วงน้ำปลาหวานสูตรย่าทวด (มะม่วงเขียวเสวยพันธุ์เกาะกก) + บายศรีข้าวใหม่ฤดูเก็บเกี่ยว — ทั้งหมดเป็นภูมิปัญญาอายุ 100+ ปี ที่ลุงสำราญและลุงเฉลิมชัยสอนต่อจากบรรพบุรุษ',
      selectedIdea: '"Green Rayong 4-IDs Tour" — ทัวร์ 1 วัน เดินครบ สวน-ป่า-นา-เล + 4 Workshop ภูมิปัญญา + IoT Live Dashboard บอกคุณภาพสิ่งแวดล้อม + แอป Storytelling 2 ภาษา · ราคา 1,800 บาท/คน · ขั้นต่ำ 8 คน',
      prototype: 'ESP32 × 4 จุด (สวนมะม่วง / ป่าชายเลน / นาข้าว / ชายเล) ส่งข้อมูล DHT22+Soil+pH ทุก 15 นาทีไป Firebase Realtime DB · Web Dashboard แสดงค่าแบบ live · ถ้าผิดปกติแจ้งไลน์กลุ่มชุมชน · QR code ที่หน้างานให้นักท่องเที่ยวสแกนดู realtime',
      videoTitle: 'Green Rayong 4-IDs × Soft Power ระยอง [TH/EN Subtitle]',
      videoUrl: 'https://www.youtube.com/watch?v=demo-rayong-4ids',
      // BMC ใหม่: ทัวร์ 1 วัน 4 อัตลักษณ์ — ต้นทุน/คน 1,200 ราคา 1,800 (margin 600 = 50%)
      // ต้นทุน: ค่าวิทยากร 4 คน × 50 = 200 · ค่าวัสดุ workshop 4 จุด = 300 · อาหารกลางวัน 150
      //         · ค่ายานพาหนะ/น้ำมัน 150 · ค่าธรรมเนียมป่า 50 · ค่าบำรุง IoT/Cloud 50 · ค่าประกัน 100 · ภาษีหัก ณ ที่จ่าย 200
      bmcCost: '1200',
      bmcPrice: '1800',
      bmcCustomer: 'นักท่องเที่ยวเชิงนิเวศ (อายุ 25-55 ปี) + นักเรียน/นักศึกษาทัศนศึกษา + ครอบครัวที่สนใจวัฒนธรรมท้องถิ่น + นักท่องเที่ยวต่างชาติช่วง Biennale 2027',
      bmcChannel: 'TikTok / Facebook / Booking ผ่าน LINE OA + ขายในงาน Biennale 2027 + ตลาดท้องถิ่นทุกวันเสาร์-อาทิตย์ + พันธมิตร Klook/Traveloka',
      aiLogs: `Act as a marine biologist specializing in Thai mangrove ecosystems. Given that we are documenting Koh Kok Mangrove Forest in Rayong Province, generate a 3-minute educational script in both Thai and English that highlights: (1) the 12 mangrove species, (2) the role of fiddler crabs and nipah palm, (3) why this site matters for IRPC's ESG goals. Output format: parallel TH/EN paragraphs with timestamps.

You are a UX copywriter for sustainable tourism. The target audience is international visitors at Thailand Biennale 2027. Write 5 Instagram-style captions (max 150 chars each) that introduce "Phra Chedi Klang Nam" without using the word "exotic" (which feels colonial). Include a respectful CTA. Output in JSON with {th, en, hashtags} per caption.

As a finance educator following SET principles, build a simple SROI calculator for our Koh Kok eco-tourism workshop. Input: cost per workshop (1850 baht), price (3500 baht), participants per month (20), CO2 saved per participant (estimated 4kg). Output: monthly profit, social return ratio, and a justification paragraph for grant applications.

Imagine you are Lung Samran (68y, mangrove guardian for 35 years). Write 7 interview questions a high school team should ask him to capture his wisdom about ka-pi making and reed-mat weaving — without making him feel like a museum exhibit. Make it warm, peer-to-peer.

You are a Thai bilingual translator. The phrase "ระยองฮิ" is a local Rayong suffix (NOT "Hi"). Translate this caption "ระยองฮิ... ยินดีต้อนรับสู่เกาะกก" preserving the local charm. Provide 3 options + explanation of which works best for Western tourists.`
    });

    // 5.6 — AI Audit Log (3 real entries — proves Critical Thinking)
    // ครอบคลุม 4 อัตลักษณ์: สวน (เอนทรี 1) · ป่า (เอนทรี 2) · นา+เล+SROI (เอนทรี 3)
    await saveSub('ai_audit_log', {
      entries: [
        {
          id: 'ent_demo_001',
          authorName: 'ทีม นวัตกรเกาะกก',
          domain: '🌳 สวน — ชุมชนบ้านเกาะกก + สวนมะม่วง',
          hallucination: 'AI เขียนว่า "สวนมะม่วงเกาะกกเก็บผลผลิตได้ตลอดทั้งปี 12 เดือน เพราะอากาศชายฝั่งทำให้มะม่วงออกผลต่อเนื่อง พันธุ์หลักคืออกร่องและน้ำดอกไม้ ส่วนชาวบ้านบ้านเกาะกกอพยพมาจากภาคใต้สมัยรัชกาลที่ 3"',
          verification: 'อ้างอิง: คุณลุงสำราญ (ปราชญ์เกษตรประจำชุมชน 35 ปี) + ป้าสมศรี ประธานวิสาหกิจชุมชนสวนมะม่วงเกาะกก / ลงพื้นที่ 12 พ.ค. 2569\nข้อเท็จจริง:\n  1. มะม่วงเกาะกกออกผลแค่ 2 ฤดู (เม.ย.-มิ.ย. ฤดูใหญ่ · ต.ค.-พ.ย. ฤดูเล็ก) — ไม่ใช่ทั้งปี\n  2. พันธุ์เด่นจริงคือ "เขียวเสวยพันธุ์เกาะกก" (พันธุ์ท้องถิ่น) และ "ฟ้าลั่น" ไม่ใช่อกร่อง/น้ำดอกไม้ที่นิยมในภาคกลาง\n  3. ชาวบ้านเกาะกกเป็นชาวประมง-ชาวสวนตั้งถิ่นฐานสมัย ร.5 (ไม่ใช่ ร.3) มาจากแถบจันทบุรี-ตราด ไม่ใช่ภาคใต้',
          risk: 'Fake Scale: บิดเบือน 80% (3 ใน 4 ข้อผิด)\nความเสียหาย: นักท่องเที่ยวจองทัวร์มาดูมะม่วงเดือน ส.ค. แล้วผิดหวัง (ไม่มีผล) → รีวิวเชิงลบ Google/TripAdvisor · พันธุ์ท้องถิ่น "เขียวเสวยพันธุ์เกาะกก" ที่เป็น Soft Power สูญหาย · ประวัติชุมชนผิดเพี้ยน ทำลายความภาคภูมิใจของคนเกาะกก',
          correctivePrompt: '"แก้เนื้อหาให้ตรงข้อเท็จจริง: (1) ระบุฤดูเก็บมะม่วงเป็น เม.ย.-มิ.ย. (ใหญ่) และ ต.ค.-พ.ย. (เล็ก) (2) ใช้ชื่อพันธุ์ \'เขียวเสวยพันธุ์เกาะกก\' และ \'ฟ้าลั่น\' ที่เป็นเอกลักษณ์ท้องถิ่น ห้ามใส่อกร่อง/น้ำดอกไม้ (3) แก้ประวัติชุมชนเป็นสมัย ร.5 จากแถบจันทบุรี-ตราด · เพิ่ม CTA ให้นักท่องเที่ยวจองล่วงหน้าตามฤดู"',
          finalOutput: '"ชุมชนบ้านเกาะกก ระยอง — ตั้งถิ่นฐานสมัย ร.5 จากบรรพบุรุษชาวประมง-ชาวสวนแถบจันทบุรี-ตราด · สวนมะม่วงเกาะกกขึ้นชื่อพันธุ์ท้องถิ่น \'เขียวเสวยพันธุ์เกาะกก\' หวานละมุนเป็นเอกลักษณ์ + \'ฟ้าลั่น\' กรอบสด ฤดูเก็บใหญ่ เม.ย.-มิ.ย. ฤดูเล็ก ต.ค.-พ.ย. · ขอเชิญจองทัวร์ \'ตำมะม่วงน้ำปลาหวานสูตรย่าทวด\' ล่วงหน้า"',
          reflection: 'AI สรุปแบบ "เหมารวมประเทศไทย" ใส่พันธุ์ที่ดังในภาคกลางลงพื้นที่ภาคตะวันออก — ภูมิปัญญาท้องถิ่นต้องสัมภาษณ์ปราชญ์จริงเท่านั้น และต้องระบุฤดูเก็บผลผลิตให้ชัดเจน เพราะกระทบรายได้ชุมชนโดยตรง',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ent_demo_002',
          authorName: 'ทีม นวัตกรเกาะกก',
          domain: '🌿 ป่า — ป่าชุมชนและป่าชายเลนเกาะกก',
          hallucination: 'AI เขียนว่า "ป่าชายเลนเกาะกกมีฝูงนกเพนกวินและต้นเมเปิ้ลให้ชม · ป่าชุมชนมีลิงอุรังอุตังและสิงโตทะเล · พระเจดีย์กลางน้ำสร้างเพื่อความสวยงามดึงดูดนักท่องเที่ยว"',
          verification: 'อ้างอิง: คุณลุงสำราญ (ปราชญ์ป่าชายเลน 35 ปี) + เอกสารกรมทรัพยากรทางทะเลและชายฝั่ง / ลงพื้นที่ 12 พ.ค. 2569\nข้อเท็จจริง:\n  1. ไม่มีนกเพนกวิน (อยู่ขั้วโลกใต้!) ไม่มีต้นเมเปิ้ล (อยู่อเมริกาเหนือ-ญี่ปุ่น) — ป่าชายเลนเกาะกกมีไม้โกงกางใบใหญ่ ไม้ลำพู ไม้แสม ไม้พังกาหัวสุม รวม 12 ชนิด\n  2. ไม่มีอุรังอุตัง (สุมาตรา/บอร์เนียว) ไม่มีสิงโตทะเล (ออสเตรเลีย/อเมริกา) — ป่าชุมชนเกาะกกมีลิงแสม นาก กระรอกหางม้า งูเหลือม\n  3. พระเจดีย์กลางน้ำสร้างโดย "พระยาศรีสมุทรโภคชัยฯ" ปี 2416 (ร.5) เป็นสัญลักษณ์ว่าถึงระยองแล้ว ไม่ได้สร้างเพื่อท่องเที่ยว',
          risk: 'Fake Scale: บิดเบือน 100%\nความเสียหาย: ผิดประวัติศาสตร์ + ทำลายความน่าเชื่อถือ UNESCO Learning City Rayong 2024 · ภาพลักษณ์ระบบนิเวศไทยดูเป็นตัวตลกระดับโลก (Greenwashing) · ขัดต่อหลัก Responsible Tourism · ขัดต่อจรรยาบรรณการเล่าเรื่องท้องถิ่น',
          correctivePrompt: '"ลบเนื้อหาเรื่องนกเพนกวิน/เมเปิ้ล/อุรังอุตัง/สิงโตทะเลออกทั้งหมด · ใส่ข้อเท็จจริง: ป่าชายเลน 12 ชนิดเช่น โกงกางใบใหญ่/ลำพู/แสม + นกกินเปี้ยว 30 ชนิด + ปูแสม-ปูก้ามดาบ-ปลาตีน · ป่าชุมชน: ลิงแสม นาก งูเหลือม · พระเจดีย์กลางน้ำ สร้าง 2416 โดยพระยาศรีสมุทรโภคชัยฯ เป็นสัญลักษณ์เข้าระยอง"',
          finalOutput: '"ป่าชายเลนพระเจดีย์กลางน้ำ ระยอง 320 ไร่ มรดกประวัติศาสตร์ปี 2416 (สมัย ร.5) — แหล่งอนุบาลปูแสม ปูก้ามดาบ ปลาตีน นกกินเปี้ยวกว่า 30 ชนิด ในระบบนิเวศ Blue Carbon เป็น \'ลมหายใจของอุตสาหกรรมระยอง\' ที่ดูดซับ CO2 ได้ 4 เท่าของป่าบกทั่วไป · ป่าชุมชน 180 ไร่ เป็นที่อยู่อาศัยของลิงแสม นาก งูเหลือม และพืชสมุนไพรท้องถิ่น"',
          reflection: 'AI สับสนพันธุ์สัตว์-พืช ระหว่างประเทศ — ต้องตรวจกับปราชญ์ที่อยู่จริงในพื้นที่ก่อนเผยแพร่ และข้อมูลประวัติศาสตร์ต้องอ้างอิงเอกสารราชการ ไม่ใช่ความเห็น AI ที่อาจแต่งขึ้น',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ent_demo_003',
          authorName: 'ทีม นวัตกรเกาะกก',
          domain: '🌾🌊 นา+เล — นาข้าวเกาะกก + วิถีชีวิตชาวเล + SROI คลาดเคลื่อน 35%',
          hallucination: 'AI เขียนว่า "นาข้าวเกาะกกเก็บเกี่ยวได้ปีละ 4 ครั้ง เพราะระบบชลประทานสมบูรณ์ · ชาวประมงเกาะกกออกเรือทุกวันตลอดปี · กำไรทัวร์เดือนละ 33,000 บาท จาก 20 คน × ส่วนต่าง 1,650 (ไม่หักค่าวิทยากร 5,000 + วัสดุ 4,000 + VAT 7%)"',
          verification: 'อ้างอิง: คุณลุงเฉลิมชัย (ปราชญ์ชาวนา-ประมง 40 ปี) + คุณกานต์ (พี่นักบัญชี SET-listed company) + คู่มือ SROI ของ TSE / ลงพื้นที่ 12 พ.ค. 2569\nข้อเท็จจริง:\n  1. นาข้าวเกาะกกทำนาปีละ "2 ครั้ง" เท่านั้น (นาปี พ.ค.-พ.ย. + นาปรัง ธ.ค.-เม.ย.) เพราะดินเค็มชายฝั่งและน้ำทะเลหนุน — ไม่ใช่ 4 ครั้ง · พันธุ์ข้าวคือ "ปทุมธานี 1" และ "ข้าวหอมมะลิแดง"\n  2. ชาวประมงเกาะกกออกเรือเฉพาะช่วง "มรสุมตะวันตกเฉียงใต้" (พ.ค.-ต.ค.) งดเรือใหญ่ช่วง "มรสุมตะวันออกเฉียงเหนือ" (พ.ย.-ก.พ.) เพราะคลื่นสูง 2-3 เมตร · ภูมิปัญญา "ดูดาวเหนือก่อนออกเรือ" ยังใช้จริง\n  3. กำไรสุทธิจริง = รายได้ 36,000 (20 คน × 1,800) − ต้นทุน 24,000 (20 × 1,200) − ค่าวิทยากรเพิ่ม 5,000 − วัสดุ workshop 4,000 − VAT 7% (2,520) = 480 บาท/เดือน (ไม่ใช่ 33,000!)',
          risk: 'Fake Scale: คลาดเคลื่อน 35% (ตัวเลข) + 50% (วิถี) + 100% (ฤดู)\nความเสียหาย:\n  • ทัวร์จองมาเก็บข้าวเดือน ส.ค. แต่ข้าวยังไม่สุก (เก็บ พ.ย.) → ผิดหวัง\n  • นักท่องเที่ยวออกเรือใหญ่ในมรสุมตะวันออกเฉียงเหนือ → อันตรายชีวิต\n  • ถ้าใช้ตัวเลขนี้ขอทุน SET/Climate Fund → over-promise → เสียความน่าเชื่อถือกับนักลงทุน + อาจโดน TLCA ขึ้นบัญชี greenwashing',
          correctivePrompt: '"แก้ข้อมูลให้ตรง:\n  (1) นาเก็บปีละ 2 ครั้ง (นาปี/นาปรัง) พันธุ์ปทุมธานี1 + หอมมะลิแดง\n  (2) ออกเรือเฉพาะ พ.ค.-ต.ค. + ระบุภูมิปัญญา \'ดูดาวเหนือก่อนออกเรือ\' (Soft Power)\n  (3) คำนวณ Net Profit แบบ SET-compliant: รายได้ 36,000 - ต้นทุนตรง 24,000 - ค่าวิทยากรเพิ่ม 5,000 - วัสดุเพิ่ม 4,000 - VAT 7% (2,520) = ? และคำนวณ Social Return Ratio = (Tangible Profit + Intangible: Carbon offset + Cultural preservation + Community income) / Total Investment เป็นตัวเลขเฉพาะเจาะจง"',
          finalOutput: 'ทัวร์ 4-IDs ระยะ pilot (เดือน 1-3): กำไรสุทธิ 480 บาท/เดือน — เล็กแต่ตรงตามมาตรฐาน SET-listed accounting (หัก VAT + ต้นทุนซ่อน) · SROI = 3.2x เมื่อรวม Intangible Value: Carbon offset 80 kg CO2/เดือน + อนุรักษ์ป่าชายเลน 320 ไร่ + ฟื้นภูมิปัญญา 4 ชุด + รายได้ชุมชน 47 ครัวเรือน · เป้า Scale ที่ 50 คน/เดือน (เดือน 6) → กำไรสุทธิ 12,000 บาท + SROI 4.5x · นาเก็บ พ.ค.-พ.ย./ธ.ค.-เม.ย. · เรือใหญ่ พ.ค.-ต.ค. เท่านั้น',
          reflection: 'AI เก่งคำนวณคณิตศาสตร์เร็ว แต่บัญชีบริษัทต้องคำนึง VAT, ค่าใช้จ่ายซ่อน, depreciation — ต้องตรวจสูตรกับนักบัญชีจริงก่อนเสมอ · และข้อมูลเกษตร-ประมงต้องตรงตามฤดูจริง ไม่ใช่ "ทุกวันทั้งปี" เพราะอาจทำให้นักท่องเที่ยวเสียชีวิตจากมรสุม',
          createdAt: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    });

    // 5.7 — Team Scores (Individual rows for R5) — L4 Showcase (avg 4.0-5.0)
    // student01 ดีสุด · student04 อ่อนสุดในทีม (ห่างกัน ±0.3)
    await seedTeamIndividualScores(showcaseTeamId, {
      teacher: teacherUid,
      sage:    sageUid,
      students: ['student01', 'student02', 'student03', 'student04'],
      base: {
        'AI Prompting':  { self: 4.5, peer: 4.6, teacher: 4.5, sage: 4.3, ai: 4.7 },
        'Local Wisdom':  { self: 4.7, peer: 4.7, teacher: 4.8, sage: 5.0, ai: 4.5 },
        'Creativity':    { self: 4.3, peer: 4.4, teacher: 4.3, sage: 4.0, ai: 4.5 },
        'Business Plan': { self: 4.0, peer: 4.0, teacher: 4.0, sage: 3.5, ai: 4.5 },
        'Storytelling':  { self: 4.6, peer: 4.6, teacher: 4.7, sage: 4.5, ai: 4.6 }
      },
      spreads: { student01: +0.3, student02: +0.1, student03: -0.1, student04: -0.3 },
      comments: {
        teacher: 'ทีมโดดเด่น Growth Mindset · พร้อม TPQI L4',
        sage:    'เด็กเคารพปราชญ์ มาฟังครบทุกคำ',
        ai:      'AI Mastery: Iterative Prompting + Audit Log ครบ Zero Hallucination'
      }
    });

    // 5.8 — Feedback จากครู ปราชญ์ AI
    const feedbacks = [
      { author: 'อ.ปวีณา (ครูผู้ดูแล)', author_role: 'teacher', content: 'ทีมนี้แสดง Growth Mindset แบบครบสูตร! AI Audit Log เขียนละเอียดมาก ทีมพิสูจน์แล้วว่าใช้ AI เป็นเครื่องมือ ไม่ใช่ทาส 👏 พร้อมส่งประกวด TPQI Level 4 ได้เลย' },
      { author: 'ลุงสำราญ (ปราชญ์ป่าชายเลน)', author_role: 'sage', content: 'เด็กกลุ่มนี้สุภาพ ตั้งใจฟัง ไม่รีบ ถามจนผมตอบหมดทุกข้อ ภูมิใจที่ภูมิปัญญากะปิเคยและทอเสื่อกกจะถูกบันทึกไว้แบบ Bilingual ขอให้ทำต่อๆไป' },
      { author: 'AI Auditor (Claude)', author_role: 'ai', content: 'PROMPT ENGINEERING SCORE: 9.2/10 — ทีมใช้ Role-based prompting + Format constraints + Localization context ครบทุก prompt · HALLUCINATION RISK: LOW (ผ่าน On-site verification 3/3 cases) · STRENGTHS: SROI calculation ตรงตามมาตรฐาน SET, Bilingual content respects local nuance. RECOMMENDATION: เหมาะกับการขยายผลสู่ 77 จังหวัด' }
    ];
    for (const fb of feedbacks) {
      await addDoc(collection(db, 'feedback'), {
        target_type: 'team',
        target_id: showcaseTeamId,
        author_name: fb.author,
        author_role: fb.author_role,
        content: fb.content,
        created_at: serverTimestamp()
      });
      mockDataCount++;
    }

    // 5.9 — Activity log entries (4 events) — for LIVE FEED ticker
    const activities = [
      { action: 'submit',  detail: 'ทีม นวัตกรเกาะกก ส่ง Step Mission-Inbox' },
      { action: 'submit',  detail: 'ทีม นวัตกรเกาะกก ส่ง Step Submission Gateway (BMC + AI Logs)' },
      { action: 'score',   detail: 'อ.ปวีณา ประเมินทีม นวัตกรเกาะกก = 4.42/5.00' },
      { action: 'approve', detail: '✓ Approved ทีม นวัตกรเกาะกก โดย อ.ปวีณา' }
    ];
    for (const act of activities) {
      await addDoc(collection(db, 'activity_log'), {
        team_id: showcaseTeamId,
        action: act.action,
        detail: act.detail,
        created_at: serverTimestamp()
      });
      mockDataCount++;
    }

    // ═══════════════════════════════════════════════════════
    // 5.10 — TEAM 2: ทีม กุลิสรา (Standard Achiever · TPQI L3 · คะแนน 3.0-3.8)
    // Profile: ทำตามโจทย์ครบ, Business Plan เด่น, AI Prompt ปานกลาง
    // ═══════════════════════════════════════════════════════
    const team2Id = teamIds.t2;
    await updateDoc(doc(db, 'teams', team2Id), {
      name: 'ทีม สมุนไพรพื้นบ้าน',
      motto: 'ภูมิปัญญาสมุนไพร × ธุรกิจชุมชน',
      color: '#378ADD',
      submission_status: 'approved',
      approval_by_name: 'อ.กุลิสรา',
      social: [
        { platform: 'Facebook', url: 'https://www.facebook.com/RayongHerbal' },
        { platform: 'LINE OA',  url: 'https://line.me/R/ti/p/@rayong-herbal' }
      ]
    });
    const saveSubT2 = async (step, content) => {
      await setDoc(doc(db, 'submissions', `${team2Id}_${step}`), {
        team_id: team2Id, step,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        file_url: null, submitted_at: serverTimestamp()
      });
      mockDataCount++;
    };
    await saveSubT2('mission-inbox', {
      iotModule: 'Arduino UNO + LDR + DHT11',
      iotReason: 'เริ่มต้นด้วย Arduino UNO เพราะใช้ง่าย เหมาะกับนักเรียนมือใหม่ + LDR วัดแสงสำหรับการตากสมุนไพร · DHT11 วัดความชื้นเพื่อป้องกันเชื้อรา',
      product: 'สมุนไพรอบแห้งบรรจุซอง "Rayong Herbal Kit" — ใบเตย กระเจี๊ยบแดง ขิงผง ฟ้าทะลายโจร · จำหน่ายเป็นชุด 4 ซองพร้อม QR code อธิบายสรรพคุณภาษาอังกฤษ',
      productReason: 'สมุนไพรเป็นภูมิปัญญาคู่ระยอง ป่าชุมชนเกาะกกมีสมุนไพร 40+ ชนิด · ทำให้นักท่องเที่ยวเข้าใจคุณค่าผ่านการใช้จริง + ชาวบ้านมีรายได้เสริม'
    });
    await saveSubT2('collector', {
      siteName: 'ป่าชุมชนเกาะกก + บ้านป้าสมศรี',
      sageName: 'ลุงเฉลิมชัย ใจดี (ปราชญ์สมุนไพร 28 ปี)',
      interview: `วันที่ลงพื้นที่: 14 พ.ค. 2569
สัมภาษณ์ลุงเฉลิมชัย (ปราชญ์สมุนไพรชุมชนเกาะกก)

Q: สมุนไพรในป่าชุมชนเกาะกกมีอะไรน่าสนใจ?
A: "มีไม่ต่ำกว่า 40 ชนิด ใบเตยหอม กระเจี๊ยบแดง ขมิ้น ขิง ฟ้าทะลายโจร ที่หายากคือ \\"กำลังเสือโคร่ง\\" ใช้รักษาปวดเมื่อย"

Q: วิธีอบแห้งแบบดั้งเดิม?
A: "ตากแดดเช้า ก่อน 10 โมง พอแดดจัดเก็บเข้าร่ม ทำซ้ำ 3-5 วัน ห้ามใส่ในถุงพลาสติกตอนยังไม่แห้งสนิท เชื้อราจะกิน"`,
      photos: '5 รูป (ป่าชุมชน, ตากสมุนไพร, ลุงเฉลิมชัย, ผลิตภัณฑ์ตัวอย่าง, แพ็คเกจ)'
    });
    await saveSubT2('gateway', {
      strengths: 'ทีมแบ่งงานชัดเจน: 1 คน Hardware, 1 คนสมุนไพร, 1 คนการตลาด, 1 คนภาษา · เด่นด้าน Business Plan (มี break-even analysis)',
      environment: 'การใช้สารเคมีเกษตรในชุมชนทำให้สมุนไพรปนเปื้อน · ขยะถุงพลาสติกจากการบรรจุภัณฑ์',
      traditionalWisdom: 'การปลูกสมุนไพรแบบผสมผสานในป่าชุมชน (Agroforestry) ที่ลุงเฉลิมชัยรักษาสืบทอด + เทคนิคอบแห้งสมุนไพรแบบดั้งเดิม (ตากแดดเช้าเก็บก่อนแดดจัด) ที่ป้าสมศรีสอน + การจัดยาตามหลักธาตุของหมอพื้นบ้านโบราณ',
      selectedIdea: '"Herbal IoT Kit" — ชุดสมุนไพรอบแห้ง 4 ซอง (กระเจี๊ยบ ขิง ขมิ้น ฟ้าทะลายโจร) + IoT Box ติดตามคุณภาพอากาศในห้องตากสมุนไพร · ราคา 250 บาท/ชุด',
      prototype: 'Arduino UNO + DHT11 วัดอุณหภูมิ-ความชื้นในห้องอบ + LDR วัดแสง · ส่งข้อมูลขึ้น ThingSpeak ทุก 15 นาที',
      videoTitle: 'Herbal IoT Story — สมุนไพรพื้นบ้านกับเทคโนโลยี',
      videoUrl: 'https://www.youtube.com/watch?v=demo-rayong-herbal',
      bmcCost: '120',
      bmcPrice: '250',
      bmcCustomer: 'นักท่องเที่ยวสุขภาพ + ผู้สูงอายุ + ครอบครัวที่ใช้สมุนไพร + ร้านสปา',
      bmcChannel: 'Shopee / Lazada / ตลาดนัดสุขภาพ + ส่งร้านสปาในระยอง',
      aiLogs: `Act as a Thai traditional medicine expert. Generate a product description for an herbal tea kit with 4 types (Roselle, Ginger, Turmeric, Andrographis). Format: bilingual TH/EN, max 80 words each.

You are a label designer. Suggest a layout for 4 herbal sachets that emphasizes "Local Rayong" identity. Include warnings for users with hypertension or diabetes.

Given that we use Arduino UNO + DHT11 to monitor herb drying, write firmware code in C++ that uploads to ThingSpeak every 15 minutes. Include error handling for WiFi disconnect.`
    });
    await saveSubT2('ai_audit_log', {
      entries: [
        {
          id: 'ent_t2_001',
          authorName: 'ทีม สมุนไพรพื้นบ้าน',
          domain: '🌿 สมุนไพร — กำลังเสือโคร่ง',
          hallucination: 'AI เขียนว่า "กำลังเสือโคร่ง = สมุนไพรเสริมกำลังทุกประเภท ใช้ได้ทุกคน ทุกวัย ไม่มีผลข้างเคียง"',
          verification: 'อ้างอิง: ลุงเฉลิมชัย (ปราชญ์สมุนไพร) + ตำรายาไทยกระทรวงสาธารณสุข\nข้อเท็จจริง: กำลังเสือโคร่งมีฤทธิ์แรง ห้ามใช้กับผู้มีความดันสูง + ผู้ตั้งครรภ์ + เด็กอายุต่ำกว่า 18',
          risk: 'Fake Scale: บิดเบือนเชิงสาธารณสุข 100%\nความเสียหาย: ถ้าผู้บริโภคใช้ผิดอาจเป็นอันตรายต่อชีวิต · ผิดต่อ พ.ร.บ.ยา 2510',
          correctivePrompt: '"ใส่คำเตือนชัดเจน: ห้ามใช้กับผู้มีความดันสูง ผู้ตั้งครรภ์ และเด็กต่ำกว่า 18 ปี · แนะนำให้ปรึกษาแพทย์แผนไทยก่อนใช้"',
          finalOutput: 'กำลังเสือโคร่ง — สมุนไพรเสริมกำลังโบราณ ⚠️ ห้ามใช้กับผู้มีความดันสูง ผู้ตั้งครรภ์ เด็กต่ำกว่า 18 · ควรปรึกษาแพทย์แผนไทยก่อนใช้',
          reflection: 'AI ตอบ "ปลอดภัยเสมอ" เพื่อให้ดูดี — แต่สมุนไพรบางชนิดอันตราย ต้องใส่คำเตือนตามมาตรฐานสาธารณสุข',
          createdAt: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    });
    // Scores ทีม 2 — Standard Achiever (Individual rows for R5)
    await seedTeamIndividualScores(team2Id, {
      teacher: uidByUsername['kulisara'],
      sage:    uidByUsername['sage_chaloemchai'],
      students: ['student05', 'student06', 'student07', 'student08'],
      base: {
        'AI Prompting':  { self: 3.2, peer: 3.3, teacher: 3.0, sage: 3.0, ai: 3.5 },
        'Local Wisdom':  { self: 3.5, peer: 3.6, teacher: 3.5, sage: 4.0, ai: 3.0 },
        'Creativity':    { self: 3.0, peer: 3.1, teacher: 3.0, sage: 2.8, ai: 3.0 },
        'Business Plan': { self: 3.8, peer: 3.9, teacher: 3.8, sage: 3.5, ai: 4.0 },
        'Storytelling':  { self: 3.3, peer: 3.4, teacher: 3.3, sage: 3.5, ai: 3.0 }
      },
      spreads: { student05: +0.4, student06: +0.1, student07: -0.1, student08: -0.4 },
      comments: { teacher: 'BMC ดีมาก', sage: 'จดบันทึกครบ', ai: 'Prompt 6.8/10' }
    });
    const t2Feedbacks = [
      { author: 'อ.กุลิสรา (ครูผู้ดูแล)', author_role: 'teacher', content: 'Business Plan ดีมาก! ขอให้พัฒนา AI Prompt ซับซ้อนขึ้น' },
      { author: 'ลุงเฉลิมชัย (ปราชญ์สมุนไพร)', author_role: 'sage', content: 'เด็กกลุ่มนี้ตั้งใจฟัง จดบันทึกครบ' }
    ];
    for (const fb of t2Feedbacks) {
      await addDoc(collection(db, 'feedback'), { target_type: 'team', target_id: team2Id, author_name: fb.author, author_role: fb.author_role, content: fb.content, created_at: serverTimestamp() });
      mockDataCount++;
    }
    for (const act of [
      { action: 'submit', detail: 'ทีม สมุนไพรพื้นบ้าน ส่ง Submission Gateway' },
      { action: 'approve', detail: '✓ Approved ทีม สมุนไพรพื้นบ้าน โดย อ.กุลิสรา' }
    ]) {
      await addDoc(collection(db, 'activity_log'), { team_id: team2Id, action: act.action, detail: act.detail, created_at: serverTimestamp() });
      mockDataCount++;
    }

    // ═══════════════════════════════════════════════════════
    // TEAM 3: ทีม คาเฟ่ชายเล (Developing · pending · 2.0-3.0)
    // ═══════════════════════════════════════════════════════
    const team3Id = teamIds.t3;
    await updateDoc(doc(db, 'teams', team3Id), {
      name: 'ทีม คาเฟ่ชายเล',
      motto: 'กาแฟชาวเล × วิวทะเลระยอง',
      color: '#D85A30',
      submission_status: 'pending'
    });
    const saveSubT3 = async (step, content) => {
      await setDoc(doc(db, 'submissions', `${team3Id}_${step}`), {
        team_id: team3Id, step,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        file_url: null, submitted_at: serverTimestamp()
      });
      mockDataCount++;
    };
    await saveSubT3('gateway', {
      strengths: 'ทีมตั้งใจ ลงพื้นที่จริง แต่ AI tools ยังไม่ค่อยถนัด',
      environment: 'ขยะพลาสติกชายหาด · น้ำทะเลปนเปื้อนน้ำมัน',
      affectedGroup: 'นักท่องเที่ยว + ชาวประมงชายฝั่ง',
      traditionalWisdom: 'ยังหาข้อมูลไม่ครบ',
      selectedIdea: 'คาเฟ่ Pop-up ริมหาดบ้านเพ',
      prototype: 'ESP8266 วัดอุณหภูมิ (ยังทำไม่เสร็จ)',
      videoTitle: 'Seaside Cafe Concept (draft)',
      videoUrl: '',
      bmcCost: '40',
      bmcPrice: '65',
      bmcCustomer: 'นักท่องเที่ยวหาดบ้านเพ',
      bmcChannel: 'ร้าน Pop-up หน้าหาด',
      aiLogs: `Help me name a beachside cafe in Rayong.\nTranslate "กาแฟไทย" to English.\nHow to make coffee?`
    });
    // Scores ทีม 3
    await seedTeamIndividualScores(team3Id, {
      teacher: uidByUsername['anchalee'],
      sage:    uidByUsername['sage_samran'],
      students: ['student09', 'student10', 'student11', 'student12'],
      base: {
        'AI Prompting':  { self: 2.5, peer: 2.3, teacher: 2.0, sage: 2.0, ai: 2.0 },
        'Local Wisdom':  { self: 2.8, peer: 2.5, teacher: 2.5, sage: 2.5, ai: 2.0 },
        'Creativity':    { self: 3.0, peer: 2.8, teacher: 2.8, sage: 3.0, ai: 2.5 },
        'Business Plan': { self: 2.5, peer: 2.5, teacher: 2.5, sage: 2.0, ai: 2.5 },
        'Storytelling':  { self: 2.5, peer: 2.5, teacher: 2.5, sage: 2.5, ai: 2.5 }
      },
      spreads: { student09: +0.3, student10: +0.1, student11: -0.1, student12: -0.3 },
      comments: { teacher: 'ยังไม่ Approve ต้องพัฒนา', sage: 'มาเร็วกลับเร็ว', ai: 'Prompt 3.5/10' }
    });
    const t3Feedbacks = [
      { author: 'อ.อัญชลี (ครูผู้ดูแล)', author_role: 'teacher', content: 'ทีมมีไอเดียดี แต่ต้องพัฒนา AI Prompt และสัมภาษณ์ปราชญ์ให้ลึก' }
    ];
    for (const fb of t3Feedbacks) {
      await addDoc(collection(db, 'feedback'), { target_type: 'team', target_id: team3Id, author_name: fb.author, author_role: fb.author_role, content: fb.content, created_at: serverTimestamp() });
      mockDataCount++;
    }
  } catch (e) {
    console.warn('Mock data seed failed:', e);
  }

  return { ok: true, mockDataCount };
}

// Legacy alias — kept for backward compatibility with LoginPage.jsx + Admin Setup button
export async function seedFirebase() {
  return await resetAndSeedDemoData();
}
