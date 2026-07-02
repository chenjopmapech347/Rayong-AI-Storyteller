// src/courseSeeds.js
// Pre-defined course templates that admins can one-click import via Course Admin.
// Each course follows the same shape as LEGACY_GREEN_RAYONG_COURSE in App.jsx.
// Adding new courses here is the standard pattern — define the data, the UI auto-discovers.

// ─────────────────────────────────────────────────────────────────────
// Design Thinking + STEAM4Innovator
// Generic innovation course — students pick any area (river, community,
// school, market, factory, farm). Source: 22-slide STEAM4Innovator pptx.
// Extracted to JSON in multi-course-design/06-worksheets-schema.json.
// ─────────────────────────────────────────────────────────────────────
export const DESIGN_THINKING_S4I_COURSE = {
  schemaVersion: 1,
  id: 'design-thinking-s4i',
  name: 'Design Thinking + STEAM4Innovator',
  nameTH: 'Design Thinking + STEAM4Innovator',
  methodology: ['DesignThinking', 'STEAM4Innovator'],
  isDefault: false,
  description: 'Generic innovation learning platform — students choose any community/area, identify problems, and create innovation solutions using combined Design Thinking (5 stages) and STEAM4Innovator (4 phases) methodology',

  branding: {
    brandName: 'Design Thinking + S4I',
    brandTagline: 'Innovate for your community',
    logoEmoji: '💡',
    primaryColor: '#0891b2',
    secondaryColor: '#06b6d4',
  },

  identities: [
    { id: 'scenario-river',     label: 'คลอง / แม่น้ำ',         emoji: '🏞️' },
    { id: 'scenario-community', label: 'ชุมชน / หมู่บ้าน',       emoji: '🏘️' },
    { id: 'scenario-school',    label: 'โรงเรียน / วิทยาลัย',    emoji: '🏫' },
    { id: 'scenario-market',    label: 'ตลาด',                emoji: '🛒' },
    { id: 'scenario-factory',   label: 'โรงงาน',              emoji: '🏭' },
    { id: 'scenario-farm',      label: 'นา / สวน / ฟาร์ม',     emoji: '🌾' },
    { id: 'scenario-custom',    label: 'อื่น ๆ (เลือกเอง)',       emoji: '✨' },
  ],

  // Design Thinking 5 stages + Plan + Reflect (decision #5: unified as generic stages)
  stages: [
    { id: 'stage-empathize',  order: 1, label: 'Empathize · เข้าใจ',    emoji: '❤️' },
    { id: 'stage-define',     order: 2, label: 'Define · กำหนดโจทย์',   emoji: '🎯' },
    { id: 'stage-ideate',     order: 3, label: 'Ideate · ระดมไอเดีย',   emoji: '💡' },
    { id: 'stage-prototype',  order: 4, label: 'Prototype · ต้นแบบ',    emoji: '🛠️' },
    { id: 'stage-test',       order: 5, label: 'Test · ทดสอบ',          emoji: '🧪' },
    { id: 'stage-plan',       order: 6, label: 'Plan · วางแผน',         emoji: '📅' },
    { id: 'stage-reflect',    order: 7, label: 'Reflect · ทบทวน',       emoji: '🪞' },
  ],

  // ─── Rubric: 5 ด้าน × 5-6 เกณฑ์ = 29 เกณฑ์ สอดคล้องกับ 19 Worksheets ───
  // Score scale: 1-5 per dimension (กรรมการให้ 1 คะแนนรวมต่อด้าน โดยอ้างอิง criteria)
  // levels[0-3] = คำอธิบายระดับ 1 (ปรับปรุง) / 2 (พอใช้) / 3 (ดี) / 4 (ดีเยี่ยม) / 5 (โดดเด่น)
  rubric: [
    {
      dimensionId: 'dt-process',
      label: 'กระบวนการ Design Thinking',
      labelEN: 'DT Process',
      weight: 25,
      description: 'ทำครบ 5 ขั้นตอน · มีหลักฐานจากการลงพื้นที่ · iterative',
      levelDescriptors: [
        'ผ่านน้อยกว่า 3 ขั้น หรือขาดหลักฐาน',
        'ผ่าน 3–4 ขั้น มีหลักฐานบางส่วน',
        'ผ่านครบ 5 ขั้น มีหลักฐานที่ชัดเจน',
        'ครบ 5 ขั้น + ทำซ้ำ (iterative) + หลักฐานครบ',
        'สมบูรณ์แบบ + สะท้อนคิดลึก + เชื่อมโยงทุกขั้น',
      ],
      criteria: [
        { id: 'dtc1', wsRef: 'WS-Stages', label: 'เข้าใจและอธิบาย 5 ขั้นตอน DT ได้ถูกต้อง', levels: ['อธิบายไม่ถูก', 'ถูกบางส่วน', 'ถูกต้องครบ', 'ถูกต้อง + ยกตัวอย่างจากงานตนเอง'] },
        { id: 'dtc2', wsRef: 'WS-C, WS-D', label: 'ลงพื้นที่สัมภาษณ์/สังเกตผู้ใช้จริง ≥ 3 คน/แหล่ง', levels: ['ไม่มีข้อมูลจากผู้ใช้', 'มีข้อมูล 1–2 แหล่ง', 'สัมภาษณ์ ≥ 3 คน/แหล่ง', 'หลากหลายวิธี + อ้างอิงครบ'] },
        { id: 'dtc3', wsRef: 'WS-E', label: 'สังเคราะห์ข้อมูล Empathize เป็น Insight ที่ชัดเจน', levels: ['รวบรวมข้อมูลเท่านั้น', 'มี Insight บางส่วน', 'ระบุ Insight ชัดเจน', 'Insight + Empathy Map / Pain-Gain'] },
        { id: 'dtc4', wsRef: 'WS-F', label: 'กำหนด POV / HMW ตรงกลุ่มเป้าหมาย', levels: ['ไม่มี POV', 'POV กว้างเกิน', 'POV ตรงกลุ่มเป้าหมาย', 'POV + HMW หลายข้อ + เชื่อมกับ Empathize'] },
        { id: 'dtc5', wsRef: 'WS-G ~ WS-G3', label: 'ระดมไอเดีย ≥ 10 ข้อ + มีเกณฑ์เลือก Solution', levels: ['< 5 ไอเดีย', '5–9 ไอเดีย', '≥ 10 ไอเดีย + เกณฑ์เลือก', '≥ 10 + Decision Matrix + เหตุผลชัด'] },
        { id: 'dtc6', wsRef: 'WS-K', label: 'ทดสอบต้นแบบและปรับปรุงตามผล (iterative)', levels: ['ไม่มีการทดสอบ', 'ทดสอบ 1 รอบ ไม่ปรับ', 'ทดสอบ + ปรับปรุง 1 รอบ', '≥ 2 รอบ + บันทึก feedback + แสดงพัฒนาการ'] },
      ],
    },
    {
      dimensionId: 'innovation-quality',
      label: 'คุณภาพนวัตกรรม',
      labelEN: 'Innovation Quality',
      weight: 25,
      description: 'ความใหม่ · แก้ปัญหาได้จริง · Prototype ใช้งานได้ · ขยายผลได้',
      levelDescriptors: [
        'ไอเดียเลียนแบบ ต้นแบบยังใช้ไม่ได้',
        'ดัดแปลงเล็กน้อย ต้นแบบร่างแรก',
        'แนวคิดใหม่ในบริบทชุมชน Prototype ทดสอบได้',
        'ใหม่ + ต้นแบบพิสูจน์ได้ + แผนขยายผล',
        'นวัตกรรมแท้ · Prototype สมบูรณ์ · Scalable',
      ],
      criteria: [
        { id: 'iqc1', wsRef: 'WS-A, WS-G3', label: 'ความใหม่ / ความแตกต่างจากที่มีอยู่แล้ว', levels: ['เลียนแบบของเดิม', 'ดัดแปลงเล็กน้อย', 'ใหม่ในบริบทท้องถิ่น', 'ใหม่ + มีหลักฐานความแตกต่าง'] },
        { id: 'iqc2', wsRef: 'WS-I', label: 'ความเป็นไปได้ (ต้นทุน เวลา ทรัพยากร)', levels: ['ไม่ระบุ', 'ระบุบางส่วน', 'ระบุครบ ต้นทุน + เวลา + ทรัพยากร', 'ครบ + วิเคราะห์ความเสี่ยง'] },
        { id: 'iqc3', wsRef: 'WS-J', label: 'Prototype จับต้องได้และทดสอบได้', levels: ['ไม่มี Prototype', 'มีแบบร่าง/แผนผัง', 'Prototype ใช้งานได้เบื้องต้น', 'Prototype ทดสอบกับผู้ใช้จริงได้'] },
        { id: 'iqc4', wsRef: 'WS-K', label: 'ผลการทดสอบชัดเจน + แสดงว่าแก้ปัญหาได้', levels: ['ไม่มีผลทดสอบ', 'มีผลแต่ไม่ชัด', 'ผล + ข้อมูล Feedback จากผู้ใช้', 'ผล + ตัวเลข + วิเคราะห์ต่อยอด'] },
        { id: 'iqc5', wsRef: 'WS-M', label: 'แผนขยายผล / ความยั่งยืน', levels: ['ไม่มีแผน', 'แผนคลุมเครือ', 'แผนขยายผลชัด', 'แผน + Model ยั่งยืน + ตัวชี้วัด'] },
        { id: 'iqc6', wsRef: 'WS-G3, WS-H', label: 'บูรณาการ STEAM เข้ากับ Solution อย่างน้อย 3 สาขา', levels: ['ไม่มีการบูรณาการ', 'บูรณาการ 1–2 สาขา', 'บูรณาการ ≥ 3 สาขาชัดเจน', 'ครบ 5 สาขา + อธิบายบทบาทแต่ละสาขา'] },
      ],
    },
    {
      dimensionId: 'community-impact',
      label: 'ผลกระทบต่อชุมชน',
      labelEN: 'Community Impact',
      weight: 20,
      description: 'Stakeholder ชัด · ปัญหามาจากชุมชนจริง · วัดผลได้ · ยั่งยืน',
      levelDescriptors: [
        'กลุ่มเป้าหมายไม่ชัด ปัญหาคาดเดา',
        'ระบุกลุ่มได้แต่ข้อมูลน้อย',
        'กลุ่มชัด + ข้อมูลจริง + KPI เบื้องต้น',
        'ครบ + ตัวเลขผลกระทบ + แผนติดตาม',
        'Impact ชัดเจน · SROI · Stakeholder Map สมบูรณ์',
      ],
      criteria: [
        { id: 'cic1', wsRef: 'WS-C', label: 'ระบุกลุ่มเป้าหมาย (Persona) ชัดเจน — ใคร เพราะอะไร', levels: ['ไม่ระบุ', 'ระบุกว้างเกิน', 'ระบุตรง who + why', 'Persona + Quote จากสัมภาษณ์จริง'] },
        { id: 'cic2', wsRef: 'WS-D, WS-F', label: 'ปัญหาและความต้องการมาจากชุมชนจริง ไม่ใช่คาดเดา', levels: ['คาดเดาเอง', 'มีข้อมูลบางส่วน', 'ข้อมูลจากการลงพื้นที่', 'หลักฐานชัด + triangulate หลายแหล่ง'] },
        { id: 'cic3', wsRef: 'WS-L', label: 'ระบุจำนวนผู้ได้รับประโยชน์และวิธีวัด', levels: ['ไม่ระบุ', 'ระบุคร่าว ๆ', 'ตัวเลข + เหตุผล', 'ตัวเลข + baseline + วิธีเก็บข้อมูล'] },
        { id: 'cic4', wsRef: 'WS-L', label: 'KPI / ตัวชี้วัดผลกระทบวัดได้จริง', levels: ['ไม่มี KPI', 'KPI คลุมเครือ', 'KPI วัดได้จริง', 'KPI + Baseline + วิธีติดตาม'] },
        { id: 'cic5', wsRef: 'WS-M', label: 'แผนดำเนินงาน งบประมาณ และผู้รับผิดชอบ', levels: ['ไม่มีแผน', 'แผนไม่ครบ', 'แผน + งบ + ผู้รับผิดชอบ', 'แผน + งบ + timeline + ความเสี่ยง'] },
        { id: 'cic6', wsRef: 'WS-N', label: 'สะท้อนผลที่เกิดขึ้นจริงและบทเรียน', levels: ['ไม่มี Reflection', 'ผิวเผิน', 'ระบุสิ่งสำเร็จ + ต้องปรับ', 'Reflection ลึก + เชื่อมกับ DT + ต่อยอดได้'] },
      ],
    },
    {
      dimensionId: 'steam-integration',
      label: 'การบูรณาการ STEAM',
      labelEN: 'STEAM Integration',
      weight: 15,
      description: 'ใช้ S-T-E-A-M ครบ 5 สาขา · AI อย่างมีจริยธรรม · วัดผลได้',
      levelDescriptors: [
        'ใช้ไม่ถึง 2 สาขา หรือผิวเผินมาก',
        'ใช้ 2–3 สาขา อธิบายได้บ้าง',
        'ใช้ ≥ 4 สาขา อธิบายบทบาทได้',
        'ครบ 5 สาขา + เชื่อมโยงกับ Solution ชัด',
        'ครบ 5 สาขา + วัดผลได้ + ใช้ AI อย่างมีจริยธรรม',
      ],
      criteria: [
        { id: 'stc1', wsRef: 'WS-B', label: 'อธิบาย S-T-E-A-M ทั้ง 5 สาขาในบริบทของงานตนเองได้', levels: ['อธิบายไม่ได้', 'อธิบายได้ 2–3 สาขา', 'อธิบายได้ ≥ 4 สาขา', 'ครบ 5 สาขา + ตัวอย่างจากงาน'] },
        { id: 'stc2', wsRef: 'WS-H', label: 'วิทยาศาสตร์ / เทคโนโลยี (S/T) ใน Solution', levels: ['ไม่มี S/T', 'ใช้บางส่วน', 'ใช้ชัด + อธิบายได้', 'ใช้หลายระดับ + วัดผลได้'] },
        { id: 'stc3', wsRef: 'WS-H, WS-J', label: 'วิศวกรรม (E) — ออกแบบ ทดสอบ ปรับปรุงอย่างเป็นระบบ', levels: ['ไม่มีกระบวนการ E', 'มีแต่ไม่เป็นระบบ', 'ออกแบบ + ทดสอบ + ปรับ', 'Process ชัด + บันทึกทุกรอบ'] },
        { id: 'stc4', wsRef: 'WS-H', label: 'ศิลปะ / ออกแบบ (A) ใน Prototype หรือ Presentation', levels: ['ไม่มีองค์ประกอบ A', 'มีบางส่วน', 'ออกแบบ Prototype/UI สวยงาม', 'ออกแบบ + อธิบาย Design Decision'] },
        { id: 'stc5', wsRef: 'WS-H, WS-L', label: 'คณิตศาสตร์ (M) — งบประมาณ การวัด ตัวชี้วัดเป็นตัวเลข', levels: ['ไม่มีตัวเลข', 'ตัวเลขเบื้องต้น', 'งบ + การวัดผล', 'สถิติ + วิเคราะห์ตัวเลขชัด'] },
        { id: 'stc6', wsRef: 'WS-Note', label: 'บันทึกการใช้ AI ครบ และใช้อย่างมีจริยธรรม', levels: ['ไม่บันทึก', 'บันทึกบางส่วน', 'บันทึกครบ + ตรวจสอบ Output', 'บันทึก + วิเคราะห์ + ตระหนักถึงข้อจำกัด AI'] },
      ],
    },
    {
      dimensionId: 'presentation',
      label: 'การนำเสนอและสะท้อนคิด',
      labelEN: 'Presentation & Reflection',
      weight: 15,
      description: 'ชัดเจน · Storytelling · บริหารเวลา · Q&A · Reflection',
      levelDescriptors: [
        'เนื้อหาขาดหลายส่วน Storytelling ไม่ชัด',
        'เนื้อหาพออ่านได้ Storytelling อ่อน',
        'ครบ 4 ส่วน Storytelling ดี Q&A ได้บ้าง',
        'ครบ + compelling + Q&A ดีเยี่ยม + Reflection ลึก',
        'น่าประทับใจ ผู้ฟังเชื่อ + ตอบ Q&A คมชัด',
      ],
      criteria: [
        { id: 'prc1', wsRef: 'Pitching', label: 'เนื้อหาครบ: ปัญหา → Solution → Impact → แผนต่อ', levels: ['ขาดหลายส่วน', 'ครบ 2–3 ส่วน', 'ครบ 4 ส่วน', 'ครบ + ตัวเลข + หลักฐาน'] },
        { id: 'prc2', wsRef: 'Pitching', label: 'Storytelling — เล่าเรื่องด้วยข้อมูลจริงจาก Empathize', levels: ['เล่าไม่เป็นเรื่อง', 'มีโครงเรื่องบ้าง', 'เล่าด้วยข้อมูลจริง', 'Compelling + ผู้ฟังเชื่อและประทับใจ'] },
        { id: 'prc3', wsRef: 'Pitching', label: 'สื่อ / สไลด์ชัดเจน ออกแบบดี (≤ 10 สไลด์)', levels: ['อ่านยาก ごちゃごちゃ', 'อ่านได้แต่ไม่ชัด', 'ชัด + ออกแบบดี', 'Visualize ข้อมูล + Design ดีเยี่ยม'] },
        { id: 'prc4', wsRef: 'Pitching', label: 'บริหารเวลา (≤ 7 นาที) + ตอบ Q&A ได้', levels: ['เกินเวลา / ตอบไม่ได้', 'ใช้เวลาพอดีแต่ Q&A อ่อน', 'เวลาดี + Q&A ได้บ้าง', 'บริหารดีเยี่ยม + Q&A ชัดเจนมีเหตุผล'] },
        { id: 'prc5', wsRef: 'WS-N', label: 'Reflection — สรุปบทเรียน สิ่งสำเร็จ และสิ่งต้องปรับ', levels: ['ไม่มี Reflection', 'ผิวเผิน', 'ระบุสำเร็จ + ต้องปรับชัด', 'Reflection ลึก + เชื่อมกับ DT + ต่อยอดได้'] },
      ],
    },
  ],
  // ─── Total criteria: 6+6+6+6+5 = 29 ข้อ ───────────────────────────────

  // ─── Mission Config: DT+S4I-specific — replaces Green Rayong "Module/Product" ──
  // Rendered in Mission Inbox tab; stored as-is in submissions/{id}/mission-inbox
  missionConfig: {
    title: 'กำหนดโจทย์นวัตกรรม (Mission Setup)',
    subtitle: 'เลือกพื้นที่ กำหนดกลุ่มเป้าหมาย และระบุปัญหาที่ต้องการแก้ด้วย Design Thinking',
    fields: [
      {
        id: 'scenario',
        type: 'select',
        label: 'พื้นที่ / Scenario',
        required: true,
        options: [
          'คลอง / แม่น้ำ 🏞️',
          'ชุมชน / หมู่บ้าน 🏘️',
          'โรงเรียน / วิทยาลัย 🏫',
          'ตลาด / พาณิชย์ 🛒',
          'โรงงาน / อุตสาหกรรม 🏭',
          'นา / สวน / ฟาร์ม 🌾',
          'สถานที่สาธารณะ / สวนสาธารณะ 🌳',
          'อื่น ๆ (กำหนดเอง) ✨',
        ],
        placeholder: '-- เลือกพื้นที่ที่คุณจะทำโครงงาน --',
      },
      {
        id: 'targetUser',
        type: 'text',
        label: 'กลุ่มเป้าหมาย (Target User / Persona)',
        required: true,
        placeholder: 'เช่น เกษตรกรอายุ 40-60 ปี ที่ปลูกข้าวในพื้นที่ลุ่มน้ำ',
      },
      {
        id: 'problemStatement',
        type: 'textarea',
        rows: 4,
        label: 'ปัญหาที่ต้องการแก้ (Problem Statement)',
        required: true,
        placeholder: 'อธิบายปัญหาที่พบในพื้นที่ที่เลือก ปัญหานี้ส่งผลต่อกลุ่มเป้าหมายอย่างไร?',
      },
      {
        id: 'hmw',
        type: 'text',
        label: 'How Might We (HMW) Statement',
        placeholder: 'How might we help [กลุ่มเป้าหมาย] to [แก้ปัญหา] so that [ผลลัพธ์ที่ต้องการ]?',
      },
      {
        id: 'steamFocus',
        type: 'select',
        label: 'สาขา STEAM หลักที่จะใช้ในการแก้ปัญหา',
        options: [
          'S — วิทยาศาสตร์ (Science)',
          'T — เทคโนโลยี (Technology)',
          'E — วิศวกรรม (Engineering)',
          'A — ศิลปะ / ออกแบบ (Arts/Design)',
          'M — คณิตศาสตร์ (Mathematics)',
          'S+T — วิทย์ + เทคโนโลยี',
          'T+E — เทคโน + วิศวกรรม',
          'ผสมหลายสาขา (Multi-STEAM)',
        ],
        placeholder: '-- เลือก STEAM Focus --',
      },
      {
        id: 'reason',
        type: 'textarea',
        rows: 3,
        label: 'เหตุผลในการเลือกปัญหานี้',
        placeholder: 'ทำไมปัญหานี้จึงสำคัญ? คุณเชื่อมโยงกับชุมชนนี้อย่างไร?',
      },
    ],
  },

  evaluatorWeights: { self: 10, peer: 15, teacher: 35, sage: 25, ai: 15 },

  // 19 worksheets covering all 22 source slides (A through N + Note)
  // Fields with unsupported types (drawing, image, table, matrix-2x2, categorize)
  // are kept with their original type — GenericForm shows '⏳ รองรับใน Phase ถัดไป'
  // placeholder until Phase 5+ implements those renderers.
  worksheets: [
    {
      id: 'WS-A', icon: '💭', stageId: 'stage-empathize', order: 1,
      labelTH: 'A · นวัตกรรมคืออะไร?', label: 'Innovation',
      instructionTH: 'ทบทวนความหมาย องค์ประกอบ ประเภท และแนวทางการสร้างนวัตกรรมแบบ STEAM4INNOVATOR',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม', required: true },
        { id: 'date', type: 'date', label: 'วันที่', required: true },
        { id: 'q1_innovation_meaning', type: 'textarea', rows: 4, label: '1. เราเข้าใจว่า "นวัตกรรม" คืออะไร และประกอบด้วยอะไรบ้าง?', placeholder: 'นวัตกรรม = ___ + ___ + ___' },
        { id: 'q2_diff_economy', type: 'textarea', rows: 2, label: '2.1 นวัตกรรมทางเศรษฐกิจ — ความหมาย + ตัวอย่าง' },
        { id: 'q2_diff_social',  type: 'textarea', rows: 2, label: '2.2 นวัตกรรมทางสังคม — ความหมาย + ตัวอย่าง' },
        { id: 'q2_diff_invent',  type: 'textarea', rows: 2, label: '2.3 สิ่งประดิษฐ์ — ความหมาย + ตัวอย่าง' },
        { id: 'q3_types', type: 'list', label: '3. ประเภทของนวัตกรรม (≥ 4 ประเภท)', minItems: 4,
          itemSchema: [
            { id: 'type', type: 'text', label: 'ประเภท' },
            { id: 'example', type: 'text', label: 'ตัวอย่าง' }
          ]
        }
      ]
    },

    {
      id: 'WS-B', icon: '🔬', stageId: 'stage-empathize', order: 2,
      labelTH: 'B · STEAM4Innovator คืออะไร?', label: 'STEAM4Innovator',
      instructionTH: 'ทบทวนองค์ประกอบของ STEAM และลักษณะของนักนวัตกร',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_steam', type: 'textarea', rows: 3, label: '1. STEAM คืออะไร? ประกอบด้วยอะไรบ้าง?' },
        { id: 'q2_s', type: 'text', label: 'S — Science (ตัวอย่างในโปรเจกต์)' },
        { id: 'q2_t', type: 'text', label: 'T — Technology' },
        { id: 'q2_e', type: 'text', label: 'E — Engineering' },
        { id: 'q2_a', type: 'text', label: 'A — Arts' },
        { id: 'q2_m', type: 'text', label: 'M — Mathematics' },
        { id: 'q3_innovator_traits', type: 'list', label: '3. ลักษณะของนักนวัตกร (≥ 3 ข้อ)', minItems: 3,
          itemSchema: [
            { id: 'trait', type: 'text', label: 'ลักษณะ' },
            { id: 'why',   type: 'text', label: 'ทำไมถึงสำคัญ' }
          ]
        }
      ]
    },

    {
      id: 'WS-Stages', icon: '🗺️', stageId: 'stage-empathize', order: 3,
      labelTH: 'STEAM4Innovator 4 ขั้น', label: 'STEAM4Innovator Stages',
      instructionTH: 'อธิบาย 4 ขั้นการสร้างนวัตกรรม + เลือกตัวอย่างกิจกรรมในแต่ละขั้น',
      fields: [
        { id: 'insight_activities',    type: 'textarea', rows: 3, label: 'INSIGHT (ค้นพบปัญหา) — กิจกรรมที่จะทำ' },
        { id: 'wow_idea_activities',   type: 'textarea', rows: 3, label: 'WOW! IDEA (ไอเดีย) — กิจกรรมที่จะทำ' },
        { id: 'business_activities',   type: 'textarea', rows: 3, label: 'BUSINESS MODEL (แผนธุรกิจ) — กิจกรรมที่จะทำ' },
        { id: 'production_activities', type: 'textarea', rows: 3, label: 'PRODUCTION & DIFFUSION (ผลิต/กระจาย) — กิจกรรมที่จะทำ' }
      ]
    },

    {
      id: 'WS-C', icon: '🗺️', stageId: 'stage-empathize', order: 4,
      labelTH: 'C · แผนที่สถานการณ์ในพื้นที่', label: 'Situation Map',
      instructionTH: 'เดินดู สังเกตในพื้นที่หรือชุมชนที่เลือก แล้ววาดแผนที่',
      fields: [
        { id: 'team',     type: 'text', label: 'ชื่อทีม' },
        { id: 'location', type: 'text', label: 'สถานที่ (ลงพื้นที่จริง)' },
        { id: 'date',     type: 'date', label: 'วันที่' },
        { id: 'time',     type: 'text', label: 'เวลา' },
        { id: 'map_image', type: 'image', label: '1. ภาพแผนที่ที่วาด (ถ่ายภาพ/upload)' },
        { id: 'items_observed', type: 'textarea', rows: 5, label: '2. มีอะไรเกี่ยวข้อง? (ประเภท / จำนวน / สัดส่วน)' },
        { id: 'people_involved', type: 'list', label: '3. ผู้คนที่เกี่ยวข้อง', minItems: 1,
          itemSchema: [
            { id: 'role',    type: 'select', label: 'บทบาท', options: ['คนสร้างปัญหา', 'คนจัดการ/แก้', 'คนได้รับผลกระทบ', 'ผู้นำชุมชน', 'เจ้าหน้าที่รัฐ', 'ภาคเอกชน', 'อื่น ๆ'] },
            { id: 'name',    type: 'text', label: 'ชื่อ/อาชีพ' },
            { id: 'details', type: 'textarea', rows: 2, label: 'ทำอะไร / เกี่ยวข้องอย่างไร' }
          ]
        },
        { id: 'summary', type: 'textarea', rows: 5, label: '4. สรุป — พื้นที่ที่สำรวจ + ปัญหา/เรื่องน่าสนใจ' }
      ]
    },

    {
      id: 'WS-D', icon: '💬', stageId: 'stage-empathize', order: 5,
      labelTH: 'D · คุยกับคนในพื้นที่', label: 'Situation Talk',
      instructionTH: 'พูดคุย ถามความคิดเห็นคนในพื้นที่ ≥ 3 คน + สังเกตพฤติกรรม',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'location', type: 'text', label: 'สถานที่' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'interviews', type: 'list', label: 'บันทึกการสัมภาษณ์ (≥ 3 คน)', minItems: 3,
          itemSchema: [
            { id: 'photo', type: 'image', label: 'ภาพ/วาดรูปคนที่คุยด้วย' },
            { id: 'name', type: 'text', label: 'ชื่อ (ถ้าได้รับอนุญาต)' },
            { id: 'age', type: 'number', label: 'อายุ' },
            { id: 'occupation', type: 'text', label: 'อาชีพ' },
            { id: 'stakeholder_type', type: 'select', label: 'กลุ่ม', options: ['คนในชุมชน', 'ผู้นำชุมชน', 'ผู้จัดการ', 'รัฐ', 'เอกชน', 'อื่น ๆ'] },
            { id: 'consent', type: 'checkbox', label: '✅ ได้รับอนุญาตให้บันทึก/เผยแพร่ข้อมูล', checkboxLabel: 'ได้รับอนุญาต' },
            { id: 'behavior', type: 'textarea', rows: 3, label: 'ทำอย่างไรกับปัญหานี้?' },
            { id: 'feelings', type: 'textarea', rows: 3, label: 'รู้สึก/คิดยังไง? ต้องการอะไร?' }
          ]
        }
      ]
    },

    {
      id: 'WS-E', icon: '🛤️', stageId: 'stage-empathize', order: 6,
      labelTH: 'E · สรุปการเดินทาง (Journey)', label: 'Situation Journey',
      instructionTH: 'รวบรวมข้อมูลจาก WS-C + WS-D → วาด Journey ต้นทาง → กลางทาง → ปลายทาง',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'journey_diagram', type: 'drawing', label: '1. วาด Journey: ต้นทาง → กลางทาง → ปลายทาง' },
        { id: 'stakeholder_map', type: 'list', label: '2. ผู้คนเกี่ยวข้องในแต่ละขั้น',
          itemSchema: [
            { id: 'stage', type: 'select', label: 'ขั้น', options: ['ต้นทาง', 'กลางทาง', 'ปลายทาง'] },
            { id: 'actor', type: 'text', label: 'ใคร' },
            { id: 'role',  type: 'text', label: 'บทบาท/หน้าที่' }
          ]
        },
        { id: 'summary_surprise', type: 'textarea', rows: 3, label: '🎯 SURPRISE — เรื่องไหนที่นึกไม่ถึง?' },
        { id: 'summary_gap',      type: 'textarea', rows: 3, label: '🕳️ GAP — ตรงไหนยังไม่มีคนจัดการ?' },
        { id: 'summary_causes',   type: 'textarea', rows: 3, label: '🔍 CAUSES — ต้นตอของปัญหา?' }
      ]
    },

    {
      id: 'WS-F', icon: '🎯', stageId: 'stage-define', order: 7,
      labelTH: 'F · สร้างโจทย์ท้าทาย (How Might We?)', label: 'Problem Statement',
      instructionTH: 'สรุปปัญหา + ความต้องการ → เป็นโจทย์ท้าทายสำหรับ ideate',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'summary',     type: 'textarea', rows: 4, label: '1. สรุปความเข้าใจจาก WS-C/D/E' },
        { id: 'target_user', type: 'text',     label: '2. กลุ่มเป้าหมาย (User) คือ' },
        { id: 'user_need_insights', type: 'list', label: '3. User + Need + Insight (≥ 3)', minItems: 3,
          itemSchema: [
            { id: 'user',    type: 'text', label: 'User' },
            { id: 'need',    type: 'text', label: 'Need (ต้องการ/มีปัญหา)' },
            { id: 'insight', type: 'textarea', rows: 2, label: 'เพราะ... (Insight)' }
          ]
        },
        { id: 'how_might_we', type: 'list', label: '4. ประโยค Challenge (How Might We? ≥ 3)', minItems: 3, maxItems: 5,
          itemSchema: [{ id: 'statement', type: 'text', label: 'เป็นไปได้ไหมที่เราจะ... + เพื่อ...?' }]
        },
        { id: 'selected_challenge', type: 'text',     label: '5. ✅ เลือก 1 ประโยคใช้งานต่อ' },
        { id: 'why_selected',       type: 'textarea', rows: 3, label: 'ทำไมเลือกประโยคนี้?' }
      ]
    },

    {
      id: 'WS-G', icon: '💡', stageId: 'stage-ideate', order: 8,
      labelTH: 'G · ระดมไอเดีย (Crazy Twelve) — มาตรฐาน', label: 'Crazy Twelve',
      instructionTH: 'ระดมความคิด ≥ 12 ไอเดีย ตอบโจทย์ท้าทาย',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'challenge_recap', type: 'text', label: '1. Challenge ของทีม (อ้างจาก WS-F)' },
        { id: 'ideas_12', type: 'list', label: '2. ไอเดีย ≥ 12 ข้อ', minItems: 12,
          itemSchema: [
            { id: 'idea_text', type: 'textarea', rows: 2, label: 'ไอเดีย + keyword' },
            { id: 'idea_image', type: 'image', label: 'ภาพประกอบ (optional)' }
          ]
        }
      ]
    },

    {
      id: 'WS-G1', icon: '💰', stageId: 'stage-ideate', order: 9,
      labelTH: 'G1 · ราคาสูง (ไม่จำกัดงบ)', label: 'Crazy Twelve — High Cost',
      instructionTH: 'ระดมไอเดียโดยไม่จำกัดงบประมาณ — ปลดปล่อยจินตนาการ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'ideas_12_high_cost', type: 'list', label: 'ไอเดีย ≥ 12 ข้อ (ราคาสูง)', minItems: 12,
          itemSchema: [
            { id: 'idea_text', type: 'textarea', rows: 2, label: 'ไอเดีย' },
            { id: 'estimated_cost', type: 'text', label: 'ประมาณการต้นทุน' }
          ]
        }
      ]
    },

    {
      id: 'WS-G2', icon: '🙊', stageId: 'stage-ideate', order: 10,
      labelTH: 'G2 · ไม่ถูกใจครู (กบฏ)', label: 'Crazy Twelve — Rebel',
      instructionTH: 'ระดมไอเดียแบบกบฏ — ไม่ต้องสนใจว่าครู/ผู้ใหญ่จะชอบหรือเปล่า',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'ideas_12_rebel', type: 'list', label: 'ไอเดีย ≥ 12 ข้อ (กบฏ)', minItems: 12,
          itemSchema: [
            { id: 'idea_text', type: 'textarea', rows: 2, label: 'ไอเดีย' },
            { id: 'why_controversial', type: 'text', label: 'ทำไมผู้ใหญ่อาจไม่ชอบ?' }
          ]
        }
      ]
    },

    {
      id: 'WS-G3', icon: '🚀', stageId: 'stage-ideate', order: 11,
      labelTH: 'G3 · Sci-Fi (เทคโนโลยีอนาคต)', label: 'Crazy Twelve — Sci-Fi',
      instructionTH: 'ระดมไอเดียระดับ Sci-Fi — เทคโนโลยีอนาคต ฝันที่สุด',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'ideas_12_scifi', type: 'list', label: 'ไอเดีย ≥ 12 ข้อ (Sci-Fi)', minItems: 12,
          itemSchema: [
            { id: 'idea_text', type: 'textarea', rows: 2, label: 'ไอเดีย' },
            { id: 'tech_needed', type: 'text', label: 'เทคโนโลยีที่ต้องการ' }
          ]
        }
      ]
    },

    {
      id: 'WS-H', icon: '📐', stageId: 'stage-ideate', order: 12,
      labelTH: 'H · ตั้งแกนเลือกไอเดีย (Axis)', label: 'Idea Selection Axis',
      instructionTH: 'วางไอเดียจาก G/G1/G2/G3 ลงในตาราง 2×2 (Value × Feasibility)',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'axes_matrix', type: 'matrix-2x2', label: '1. วางไอเดียลงใน 4 ช่อง' },
        { id: 'tags_new',     type: 'textarea', rows: 2, label: '2a. ไอเดีย "ใหม่ (New)" — list' },
        { id: 'tags_impact',  type: 'textarea', rows: 2, label: '2b. ไอเดีย "Impact" — list' },
        { id: 'tags_clean',   type: 'textarea', rows: 2, label: '2c. ไอเดีย "Sustainability" — list' },
        { id: 'selected_idea', type: 'textarea', rows: 3, label: '3. ✅ เลือก 1 ไอเดียไปทำต้นแบบ' }
      ]
    },

    {
      id: 'WS-I', icon: '✏️', stageId: 'stage-ideate', order: 13,
      labelTH: 'I · ร่างต้นแบบไอเดีย (Sketch)', label: 'Idea Sketch',
      instructionTH: 'ร่าง prototype + ทดสอบเล่น ๆ กับคนใกล้ตัวก่อนทดสอบจริง',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'idea_sketch', type: 'drawing', label: '1. วาด+อธิบายไอเดีย (Sketch/Storyboard)' },
        { id: 'sketch_image', type: 'image', label: 'หรือ upload ภาพ sketch' },
        { id: 'test_with_who', type: 'text', label: '2a. ทดสอบกับใคร?' },
        { id: 'test_count', type: 'number', label: 'จำนวนคนที่ทดสอบ' },
        { id: 'result_feelings',   type: 'textarea', rows: 2, label: '3a. เขาคิด/รู้สึกอย่างไร?' },
        { id: 'result_solves',     type: 'textarea', rows: 2, label: '3b. ตอบโจทย์/แก้ปัญหาไหม?' },
        { id: 'result_strengths',  type: 'textarea', rows: 2, label: '3c. จุดดี — พัฒนาต่อ' },
        { id: 'result_weaknesses', type: 'textarea', rows: 2, label: '3d. จุดอ่อน — ต้องแก้' }
      ]
    },

    {
      id: 'WS-J', icon: '📖', stageId: 'stage-prototype', order: 14,
      labelTH: 'J · เตรียมนำเสนอ (Storytelling)', label: 'Storytelling Canvas',
      instructionTH: 'วางแผนนำเสนออย่างชัดเจน เป็นลำดับ และน่าสนใจ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'product_service', type: 'textarea', rows: 3, label: '1a. PRODUCT/SERVICE/PROCESS' },
        { id: 'goal',            type: 'textarea', rows: 2, label: '1b. GOAL — เป้าหมายการนำเสนอ' },
        { id: 'audience',        type: 'textarea', rows: 3, label: '1c. AUDIENCE — ผู้ฟัง + อยากรู้อะไร' },
        { id: 'intro_script',    type: 'textarea', rows: 2, label: 'INTRO — Script' },
        { id: 'intro_visual',    type: 'textarea', rows: 2, label: 'INTRO — Visual' },
        { id: 'problem_script',  type: 'textarea', rows: 2, label: 'Stage 1 PROBLEM — Script' },
        { id: 'problem_visual',  type: 'textarea', rows: 2, label: 'Stage 1 PROBLEM — Visual' },
        { id: 'solution_script', type: 'textarea', rows: 2, label: 'Stage 2 SOLUTION — Script' },
        { id: 'solution_visual', type: 'textarea', rows: 2, label: 'Stage 2 SOLUTION — Visual' },
        { id: 'prototype_script',type: 'textarea', rows: 2, label: 'Stage 3 PROTOTYPE — Script' },
        { id: 'prototype_visual',type: 'textarea', rows: 2, label: 'Stage 3 PROTOTYPE — Visual' },
        { id: 'business_script', type: 'textarea', rows: 2, label: 'BUSINESS MODEL — Script' },
        { id: 'business_visual', type: 'textarea', rows: 2, label: 'BUSINESS MODEL — Visual' }
      ]
    },

    {
      id: 'WS-K', icon: '🧪', stageId: 'stage-test', order: 15,
      labelTH: 'K · วางแผนทดสอบต้นแบบ', label: 'Testing Plan',
      instructionTH: 'วางแผนทดสอบสมมติฐาน → จุดอ่อน/จุดแข็ง → พัฒนานวัตกรรม',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'innovation_summary', type: 'textarea', rows: 3, label: '1. นวัตกรรมของเราคือ?' },
        { id: 'hypotheses', type: 'list', label: '2. สิ่งที่อยากทดสอบ (3 หัวข้อ × 3 dimensions)', minItems: 3,
          itemSchema: [
            { id: 'dimension', type: 'select', label: 'Dimension', options: ['USER (ลูกค้า)', 'PRODUCTION (ผลิต/เทคโนโลยี)', 'MANAGE (จัดการ/ธุรกิจ)'] },
            { id: 'question',  type: 'text', label: 'อยากรู้/ทดสอบเรื่องอะไร' },
            { id: 'method',    type: 'text', label: 'ทดสอบโดย' },
            { id: 'with_who',  type: 'text', label: 'ทดสอบกับใคร' },
            { id: 'count',     type: 'text', label: 'จำนวน' },
            { id: 'result',    type: 'textarea', rows: 3, label: 'สรุปผล' },
            { id: 'develop',   type: 'textarea', rows: 2, label: 'พัฒนาเรื่อง...' }
          ]
        },
        { id: 'top3_changes', type: 'list', label: '3. สรุป 3 ข้อสำคัญต้องปรับ/เพิ่ม/ตัด', minItems: 3, maxItems: 3,
          itemSchema: [{ id: 'change', type: 'text', label: 'ข้อปรับ' }]
        }
      ]
    },

    {
      id: 'WS-L', icon: '📅', stageId: 'stage-plan', order: 16,
      labelTH: 'L · แผนปฏิบัติงาน (Gantt)', label: 'Gantt Chart',
      instructionTH: 'วางแผนการลงมือทำงาน → เวลา → ทรัพยากร → ผู้รับผิดชอบ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'tasks', type: 'list', label: 'งานที่ต้องทำ (≥ 3)', minItems: 3,
          itemSchema: [
            { id: 'task_name',      type: 'text', label: 'งาน' },
            { id: 'duration_weeks', type: 'number', label: 'เวลา (สัปดาห์)' },
            { id: 'start_week',     type: 'number', label: 'เริ่มสัปดาห์ที่' },
            { id: 'resources',      type: 'text', label: 'ทรัพยากร (เงิน/คน/ของ)' },
            { id: 'responsible',    type: 'text', label: 'รับผิดชอบโดย' }
          ]
        }
      ]
    },

    {
      id: 'WS-M', icon: '📊', stageId: 'stage-plan', order: 17,
      labelTH: 'M · แผนธุรกิจ (BMC)', label: 'Business Model Canvas',
      instructionTH: 'วางแผนธุรกิจรอบด้าน — รายรับ ต้นทุน ลูกค้า',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'value_proposition', type: 'textarea', rows: 4, label: '1. Value Proposition (สินค้า/บริการ + คุณค่า)' },
        { id: 'customers',         type: 'textarea', rows: 3, label: 'Customers (ลูกค้า)' },
        { id: 'channels',          type: 'textarea', rows: 3, label: 'Channels (ช่องทาง)' },
        { id: 'revenue',           type: 'textarea', rows: 3, label: 'Revenue (รายรับ)' },
        { id: 'key_partners',      type: 'textarea', rows: 3, label: 'Key Partners (พันธมิตร)' },
        { id: 'key_resources',     type: 'textarea', rows: 3, label: 'Key Resources (ทรัพยากร)' },
        { id: 'key_activities',    type: 'textarea', rows: 3, label: 'Key Activities (กิจกรรม)' },
        { id: 'cost_structure',    type: 'textarea', rows: 3, label: 'Cost Structure (ค่าใช้จ่าย)' },
        { id: 'customer_relations',type: 'textarea', rows: 3, label: 'Customer Relationships' }
      ]
    },

    {
      id: 'WS-N', icon: '🪞', stageId: 'stage-reflect', order: 18,
      labelTH: 'N · ทบทวนบทเรียน (Reflection)', label: 'Self Reflection',
      instructionTH: 'ทบทวนประสบการณ์ — สิ่งที่ทำ / ที่เรียนรู้ / ที่จะทำต่อ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'mode', type: 'radio', label: 'ทำแบบ', options: ['ทีม (group)', 'รายบุคคล (individual)'] },
        { id: 'individual_name', type: 'text', label: 'ชื่อ (ถ้าทำรายบุคคล)' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'review_innovation_journey', type: 'textarea', rows: 4, label: '1a. ทบทวน — ทำอะไรในการสร้างนวัตกรรม (S4I)?' },
        { id: 'review_domain_knowledge',   type: 'textarea', rows: 4, label: '1b. ทบทวน — เรียนรู้อะไรในเรื่องที่ศึกษา?' },
        { id: 'consider_why',              type: 'textarea', rows: 4, label: '2. คิดพิจารณา — เราทำเพื่ออะไร?' },
        { id: 'lessons_top3', type: 'list', label: '3. สรุปบทเรียน — สิ่งสำคัญ ≥ 3 ข้อ', minItems: 3,
          itemSchema: [{ id: 'lesson', type: 'text', label: 'บทเรียน' }]
        },
        { id: 'next_steps',    type: 'textarea', rows: 4, label: '4. ทำอะไรต่อไป?' },
        { id: 'open_questions',type: 'textarea', rows: 3, label: '5. ข้อสงสัยที่ยังมี' }
      ]
    },

    {
      id: 'WS-Note', icon: '📝', stageId: 'stage-reflect', order: 19,
      labelTH: 'Note · บันทึกเพิ่มเติม', label: 'Free Notes',
      instructionTH: 'บันทึกอิสระ — ใส่ภาพ/ข้อมูลเพิ่มเติมที่อยากเก็บไว้',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'topic', type: 'text', label: 'เรื่อง' },
        { id: 'note', type: 'textarea', rows: 12, label: 'บันทึก' }
      ]
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────
// 31910-2002 ระบบจัดการฐานข้อมูล (Database System)
// หลักสูตร ปวส. 2567 สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล
// ─────────────────────────────────────────────────────────────────────
export const DATABASE_SYSTEM_COURSE = {
  schemaVersion: 1,
  id: '31910-2002',
  name: '31910-2002 ระบบจัดการฐานข้อมูล',
  nameTH: 'ระบบจัดการฐานข้อมูล',
  nameEN: 'Database System',
  methodology: ['Project-Based'],
  isDefault: false,
  // ── ข้อมูลจากหลักสูตร ปวส. 2567 (31910v4-65.pdf) ──────────────────
  curriculum: 'หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567',
  credits: '2-2-3',
  standards: ['รหัส 12305 ระดับ 4', 'รหัส 3012 ระดับ 5'],
  learningOutcomes: 'อธิบาย ออกแบบ จัดการ และพัฒนาระบบฐานข้อมูลสำหรับงานธุรกิจดิจิทัล ด้วยความละเอียดรอบคอบและถูกต้อง',
  objectives: [
    'เข้าใจเกี่ยวกับหลักการของระบบจัดการฐานข้อมูล (DBMS)',
    'มีทักษะในการออกแบบฐานข้อมูลเชิงสัมพันธ์ ER Model และ Normalization',
    'มีความสามารถในการเขียน SQL และพัฒนาระบบฐานข้อมูลสำหรับงานธุรกิจดิจิทัล',
    'มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียด รอบคอบและถูกต้อง',
  ],
  competencies: [
    'ประมวลความรู้เกี่ยวกับหลักการระบบจัดการฐานข้อมูล (DBMS) ตามหลักการ',
    'ออกแบบและพัฒนาฐานข้อมูลเชิงสัมพันธ์สำหรับงานธุรกิจดิจิทัล',
    'ประยุกต์ใช้ SQL และฐานข้อมูลบนคลาวด์ในงานธุรกิจดิจิทัล',
  ],
  description: 'ศึกษาและปฏิบัติเกี่ยวกับหลักการของระบบฐานข้อมูล ER Model Normalization การออกแบบฐานข้อมูลเชิงสัมพันธ์ SQL NoSQL และฐานข้อมูลบนคลาวด์',
  branding: {
    brandName: 'Database System',
    brandTagline: 'ออกแบบฐานข้อมูลอย่างมืออาชีพ',
    logoEmoji: '🗄️',
    primaryColor: '#1d4ed8',
    secondaryColor: '#3b82f6',
  },
  rubric: [
    {
      dimensionId: 'db-concept',
      label: 'ความเข้าใจหลักการฐานข้อมูล',
      labelEN: 'DB Concepts',
      weight: 25,
      description: 'อธิบายหลักการ สถาปัตยกรรม และแบบจำลองข้อมูลได้ถูกต้อง',
      levelDescriptors: [
        'อธิบายหลักการไม่ได้ หรือเข้าใจผิดพื้นฐาน',
        'เข้าใจบางส่วน อธิบายได้ไม่ครบ',
        'อธิบายหลักการครบถ้วน ถูกต้อง',
        'อธิบายได้ดี + ยกตัวอย่างประยุกต์ใช้งานจริง',
        'เข้าใจลึก + เปรียบเทียบ RDBMS/NoSQL/Cloud DB ได้',
      ],
      criteria: [
        { id: 'db-c1', label: 'อธิบายหลักการ DBMS และ 3-tier architecture ได้', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้ครบ', 'ได้ครบ+ยกตัวอย่าง'] },
        { id: 'db-c2', label: 'เข้าใจความแตกต่าง File System กับ DBMS', levels: ['ไม่เข้าใจ', 'เข้าใจบางส่วน', 'เข้าใจดี', 'อธิบาย+เปรียบเทียบได้'] },
      ],
    },
    {
      dimensionId: 'db-design',
      label: 'การออกแบบ ER และ Normalization',
      labelEN: 'DB Design',
      weight: 30,
      description: 'วาด ER Diagram ถูกต้อง และทำ Normalization ถึง 3NF ได้',
      levelDescriptors: [
        'วาด ER ไม่ถูก หรือ Normalization ผิดพลาดมาก',
        'ER ถูกบางส่วน ทำ 1NF ได้',
        'ER ถูกต้องครบ ทำ 2NF-3NF ได้',
        'ER + Normalization ครบ + อธิบายเหตุผลได้',
        'ออกแบบ DB ที่ซับซ้อน + BCNF + มีประสิทธิภาพ',
      ],
      criteria: [
        { id: 'db-d1', label: 'วาด ER Diagram (Entity / Attribute / Relationship) ถูกต้อง', levels: ['ผิดหมด', 'ถูกบางส่วน', 'ถูกต้อง', 'ถูก+ครบ+อธิบายได้'] },
        { id: 'db-d2', label: 'ทำ Normalization 1NF → 2NF → 3NF ได้', levels: ['ไม่ได้', 'ทำ 1NF ได้', 'ทำ 3NF ได้', 'ทำ BCNF ได้+อธิบาย'] },
        { id: 'db-d3', label: 'แปลง ER เป็น Relational Schema ได้ถูกต้อง', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้ถูกต้อง', 'ได้ครบ+กำหนด PK/FK ถูก'] },
      ],
    },
    {
      dimensionId: 'db-sql',
      label: 'ทักษะการใช้ SQL',
      labelEN: 'SQL Skills',
      weight: 30,
      description: 'เขียน SQL คำสั่ง DDL DML และ DQL ได้ถูกต้องและมีประสิทธิภาพ',
      levelDescriptors: [
        'เขียน SQL ไม่ได้ หรือ Syntax ผิดทั้งหมด',
        'เขียน SELECT พื้นฐานได้ มี Error บางส่วน',
        'เขียน DDL/DML/SELECT ได้ถูกต้อง',
        'JOIN หลายตาราง + Subquery + Aggregate ได้',
        'SQL ซับซ้อน + Optimize + Transaction + View/Procedure',
      ],
      criteria: [
        { id: 'db-s1', label: 'สร้างตาราง (CREATE TABLE) + กำหนด Constraint ได้', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้ถูกต้อง', 'ได้+Constraint ครบ'] },
        { id: 'db-s2', label: 'INSERT / UPDATE / DELETE ข้อมูลได้ถูกต้อง', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้', 'ได้+Transaction'] },
        { id: 'db-s3', label: 'SELECT พร้อม JOIN / WHERE / GROUP BY / ORDER BY ได้', levels: ['SELECT ง่ายเท่านั้น', 'JOIN 2 ตาราง', 'JOIN หลายตาราง+Aggregate', 'Subquery+View+Procedure'] },
      ],
    },
    {
      dimensionId: 'db-apply',
      label: 'การประยุกต์ใช้งาน',
      labelEN: 'Applied DB',
      weight: 15,
      description: 'ออกแบบและสร้างฐานข้อมูลสำหรับงานธุรกิจดิจิทัลได้จริง',
      levelDescriptors: [
        'ไม่สามารถประยุกต์ใช้กับงานจริงได้',
        'ประยุกต์ได้เล็กน้อย โดยมีการแนะนำ',
        'สร้างฐานข้อมูลสำหรับโปรเจกต์ได้',
        'DB ใช้งานได้จริง + มี UI เชื่อมต่อ',
        'DB + Application + Deploy บน Cloud ได้',
      ],
      criteria: [
        { id: 'db-a1', label: 'ออกแบบ DB ให้ตรงกับโจทย์ธุรกิจ', levels: ['ไม่ตรง', 'ตรงบางส่วน', 'ตรงดี', 'ตรง+เหมาะสม+ขยายได้'] },
      ],
    },
  ],

  missionConfig: {
    title: 'โปรเจกต์ฐานข้อมูล',
    fields: [
      { id: 'project_topic',    label: 'ชื่อโปรเจกต์ฐานข้อมูล',    placeholder: 'เช่น ระบบจัดการร้านค้า / ระบบลงทะเบียนเรียน' },
      { id: 'business_context', label: 'บริบทธุรกิจ',              placeholder: 'อธิบายระบบที่จะพัฒนา' },
      { id: 'problem_statement',label: 'ปัญหาที่แก้ด้วย DB',        placeholder: 'ปัญหาปัจจุบันที่ระบบ DB จะช่วยแก้ได้' },
      { id: 'db_type',          label: 'ประเภท DB ที่เลือกใช้',     placeholder: 'เช่น MySQL / PostgreSQL / MongoDB' },
    ],
  },

  worksheets: [
    {
      id: 'WS-DB-01', icon: '📚', order: 1,
      labelTH: '1 · หลักการ DBMS', label: 'DB Fundamentals',
      instructionTH: 'ศึกษาหลักการระบบจัดการฐานข้อมูล ขั้นตอนการพัฒนา และสถาปัตยกรรม',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่', required: true },
        { id: 'q1_dbms_meaning', type: 'textarea', rows: 4, label: '1. DBMS คืออะไร? แตกต่างจาก File System อย่างไร?' },
        { id: 'q2_advantages', type: 'list', label: '2. ข้อดีของ DBMS (≥ 4 ข้อ)', minItems: 4,
          itemSchema: [{ id: 'adv', type: 'text', label: 'ข้อดี' }]
        },
        { id: 'q3_architecture', type: 'textarea', rows: 4, label: '3. อธิบาย 3-tier Architecture ของระบบ DBMS' },
        { id: 'q4_dev_steps', type: 'list', label: '4. ขั้นตอนการพัฒนาระบบฐานข้อมูล (เรียงลำดับ)', minItems: 5,
          itemSchema: [
            { id: 'step', type: 'number', label: 'ลำดับ' },
            { id: 'name', type: 'text',   label: 'ขั้นตอน' },
            { id: 'desc', type: 'text',   label: 'รายละเอียด' }
          ]
        },
        { id: 'q5_roles', type: 'textarea', rows: 3, label: '5. บทบาทของ DBA (Database Administrator)' },
      ]
    },

    {
      id: 'WS-DB-02', icon: '🗺️', order: 2,
      labelTH: '2 · แบบจำลองข้อมูล', label: 'Data Models',
      instructionTH: 'เปรียบเทียบแบบจำลองข้อมูลประเภทต่าง ๆ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_models', type: 'list', label: '1. แบบจำลองข้อมูล ≥ 3 แบบ พร้อมตัวอย่าง', minItems: 3,
          itemSchema: [
            { id: 'model_name', type: 'text', label: 'ชื่อแบบจำลอง' },
            { id: 'structure',  type: 'text', label: 'โครงสร้างข้อมูล' },
            { id: 'example',    type: 'text', label: 'ตัวอย่าง DBMS ที่ใช้' }
          ]
        },
        { id: 'q2_relational', type: 'textarea', rows: 4, label: '2. อธิบาย Relational Model — Relation / Tuple / Attribute / Domain' },
        { id: 'q3_integrity', type: 'textarea', rows: 4, label: '3. Entity Integrity vs Referential Integrity คืออะไร? ต่างกันอย่างไร?' },
      ]
    },

    {
      id: 'WS-DB-03', icon: '🔗', order: 3,
      labelTH: '3 · แบบจำลอง ER', label: 'ER Diagram',
      instructionTH: 'วาด ER Diagram จากโจทย์ที่กำหนด',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_components', type: 'list', label: '1. องค์ประกอบของ ER Diagram', minItems: 3,
          itemSchema: [
            { id: 'component', type: 'text', label: 'องค์ประกอบ' },
            { id: 'symbol',    type: 'text', label: 'สัญลักษณ์ (รูปร่าง)' },
            { id: 'desc',      type: 'text', label: 'ความหมาย' }
          ]
        },
        { id: 'q2_cardinality', type: 'textarea', rows: 4, label: '2. อธิบาย Cardinality: 1:1 / 1:N / M:N พร้อมตัวอย่าง' },
        { id: 'q3_er_scenario', type: 'textarea', rows: 4, label: '3. โจทย์: อธิบาย Entity และ Relationship ของระบบที่เลือก' },
        { id: 'q4_er_diagram', type: 'image', label: '4. ภาพ ER Diagram ที่วาด (ถ่ายภาพ/upload)' },
        { id: 'q5_attributes', type: 'list', label: '5. Attribute แต่ละ Entity (Primary Key ระบุด้วย)', minItems: 2,
          itemSchema: [
            { id: 'entity',  type: 'text', label: 'Entity' },
            { id: 'pk',      type: 'text', label: 'Primary Key' },
            { id: 'attrs',   type: 'text', label: 'Attributes อื่น ๆ' }
          ]
        }
      ]
    },

    {
      id: 'WS-DB-04', icon: '📐', order: 4,
      labelTH: '4 · Normalization', label: 'Normalization',
      instructionTH: 'ทำ Normalization ตั้งแต่ Unnormalized ถึง 3NF',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_normal_forms', type: 'list', label: '1. สรุป Normal Forms 1NF / 2NF / 3NF', minItems: 3,
          itemSchema: [
            { id: 'form', type: 'text', label: 'Normal Form' },
            { id: 'rule', type: 'textarea', rows: 2, label: 'กฎ/เงื่อนไข' },
          ]
        },
        { id: 'q2_unnormalized', type: 'textarea', rows: 5, label: '2. ตารางก่อน Normalize (Unnormalized Form) — วางโครงสร้าง' },
        { id: 'q3_1nf', type: 'textarea', rows: 5, label: '3. ผลลัพธ์หลังทำ 1NF' },
        { id: 'q4_2nf', type: 'textarea', rows: 5, label: '4. ผลลัพธ์หลังทำ 2NF' },
        { id: 'q5_3nf', type: 'textarea', rows: 5, label: '5. ผลลัพธ์หลังทำ 3NF' },
        { id: 'q6_fds', type: 'textarea', rows: 4, label: '6. Functional Dependencies ที่ระบุ' },
      ]
    },

    {
      id: 'WS-DB-05', icon: '💻', order: 5,
      labelTH: '5 · SQL — DDL', label: 'SQL DDL',
      instructionTH: 'เขียน SQL คำสั่ง DDL: CREATE TABLE, ALTER, DROP พร้อม Constraint',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_ddl_commands', type: 'textarea', rows: 3, label: '1. คำสั่ง DDL มีอะไรบ้าง?' },
        { id: 'q2_create_table', type: 'textarea', rows: 10, label: '2. เขียน CREATE TABLE จากโปรเจกต์ (≥ 3 ตาราง) พร้อม PK, FK, NOT NULL', placeholder: 'CREATE TABLE ...' },
        { id: 'q3_alter',        type: 'textarea', rows: 5, label: '3. ตัวอย่างคำสั่ง ALTER TABLE (เพิ่ม/แก้ไข column)' },
        { id: 'q4_constraints', type: 'list', label: '4. Constraint ที่ใช้ในตาราง', minItems: 3,
          itemSchema: [
            { id: 'constraint_type', type: 'select', label: 'ประเภท', options: ['PRIMARY KEY','FOREIGN KEY','UNIQUE','NOT NULL','CHECK','DEFAULT'] },
            { id: 'table_name',      type: 'text',   label: 'ตาราง' },
            { id: 'column_name',     type: 'text',   label: 'Column' },
            { id: 'purpose',         type: 'text',   label: 'จุดประสงค์' }
          ]
        }
      ]
    },

    {
      id: 'WS-DB-06', icon: '🔍', order: 6,
      labelTH: '6 · SQL — DML & SELECT', label: 'SQL DML & Query',
      instructionTH: 'เขียน SQL คำสั่ง INSERT UPDATE DELETE และ SELECT พร้อม JOIN',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_insert', type: 'textarea', rows: 6, label: '1. เขียน INSERT INTO ≥ 3 ตาราง ตารางละ ≥ 5 records' },
        { id: 'q2_update', type: 'textarea', rows: 4, label: '2. เขียน UPDATE พร้อม WHERE condition' },
        { id: 'q3_delete', type: 'textarea', rows: 3, label: '3. เขียน DELETE พร้อม WHERE condition' },
        { id: 'q4_select_basic', type: 'textarea', rows: 4, label: '4. SELECT ด้วย WHERE, ORDER BY, GROUP BY' },
        { id: 'q5_join', type: 'textarea', rows: 6, label: '5. SELECT + INNER JOIN / LEFT JOIN ≥ 2 ตาราง' },
        { id: 'q6_aggregate', type: 'textarea', rows: 4, label: '6. ใช้ Aggregate Functions: COUNT / SUM / AVG / MAX / MIN' },
        { id: 'q7_result_screenshot', type: 'image', label: '7. ภาพ Screenshot ผลลัพธ์การ Query' },
      ]
    },

    {
      id: 'WS-DB-07', icon: '☁️', order: 7,
      labelTH: '7 · NoSQL และ Cloud DB', label: 'NoSQL & Cloud DB',
      instructionTH: 'เปรียบเทียบ NoSQL กับ SQL และศึกษา Cloud Database Services',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_nosql_types', type: 'list', label: '1. ประเภท NoSQL Database', minItems: 3,
          itemSchema: [
            { id: 'type',    type: 'text', label: 'ประเภท' },
            { id: 'example', type: 'text', label: 'ตัวอย่าง DBMS' },
            { id: 'usecase', type: 'text', label: 'เหมาะกับงานแบบใด' }
          ]
        },
        { id: 'q2_sql_vs_nosql', type: 'textarea', rows: 5, label: '2. เปรียบเทียบ SQL vs NoSQL — เลือกใช้เมื่อไหร่?' },
        { id: 'q3_cloud_db', type: 'list', label: '3. Cloud Database Services ที่รู้จัก ≥ 3 บริการ', minItems: 3,
          itemSchema: [
            { id: 'service',  type: 'text', label: 'ชื่อบริการ' },
            { id: 'provider', type: 'text', label: 'ผู้ให้บริการ (AWS/GCP/Azure/etc.)' },
            { id: 'db_type',  type: 'text', label: 'ประเภท DB' },
            { id: 'feature',  type: 'text', label: 'จุดเด่น' }
          ]
        },
        { id: 'q4_firebase_exp', type: 'textarea', rows: 4, label: '4. ทดลองใช้ Firestore/Firebase หรือ Cloud DB อื่น — สรุปประสบการณ์' }
      ]
    },

    {
      id: 'WS-DB-08', icon: '🚀', order: 8,
      labelTH: '8 · โปรเจกต์ฐานข้อมูล', label: 'DB Project',
      instructionTH: 'นำเสนอการออกแบบและพัฒนาระบบฐานข้อมูลสำหรับโปรเจกต์',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'project_name', type: 'text', label: 'ชื่อโปรเจกต์' },
        { id: 'business_desc', type: 'textarea', rows: 4, label: '1. อธิบายระบบที่พัฒนา' },
        { id: 'er_final', type: 'image', label: '2. ER Diagram ฉบับสมบูรณ์' },
        { id: 'tables_list', type: 'list', label: '3. ตารางทั้งหมดในฐานข้อมูล', minItems: 3,
          itemSchema: [
            { id: 'table_name', type: 'text', label: 'ชื่อตาราง' },
            { id: 'pk',         type: 'text', label: 'Primary Key' },
            { id: 'records_count', type: 'number', label: 'จำนวน records ที่เตรียม' }
          ]
        },
        { id: 'queries_showcase', type: 'textarea', rows: 8, label: '4. Query ที่ซับซ้อนที่สุด (≥ 3 คำสั่ง) + อธิบายผลลัพธ์' },
        { id: 'reflection', type: 'textarea', rows: 4, label: '5. สิ่งที่เรียนรู้จากการทำโปรเจกต์' },
      ]
    },
  ],

  evaluatorWeights: { self: 10, peer: 10, teacher: 50, sage: 20, ai: 10 },
};

// ─────────────────────────────────────────────────────────────────────
// 31910-2004 หลักการคิดเชิงออกแบบและนวัตกรรมธุรกิจดิจิทัล
// Design Thinking and Business Digital Innovation
// ─────────────────────────────────────────────────────────────────────
export const DESIGN_THINKING_BIZ_COURSE = {
  schemaVersion: 1,
  id: '31910-2004',
  name: '31910-2004 หลักการคิดเชิงออกแบบฯ',
  nameTH: 'หลักการคิดเชิงออกแบบและนวัตกรรมธุรกิจดิจิทัล',
  nameEN: 'Design Thinking and Business Digital Innovation',
  methodology: ['DesignThinking', 'BusinessModel'],
  isDefault: false,
  // ── ข้อมูลจากหลักสูตร ปวส. 2567 (31910v4-67.pdf) ──────────────────
  curriculum: 'หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567',
  credits: '2-2-3',
  standards: ['รหัส 10101 ระดับ 4', 'รหัส 10103 ระดับ 4'],
  learningOutcomes: 'ออกแบบนวัตกรรมธุรกิจดิจิทัลโดยใช้กระบวนการ Design Thinking และ Business Model Canvas ด้วยความคิดสร้างสรรค์และมุ่งเน้นผู้ใช้',
  objectives: [
    'เข้าใจเกี่ยวกับหลักการคิดเชิงออกแบบ (Design Thinking) และนวัตกรรมธุรกิจดิจิทัล',
    'มีทักษะในการทำ Empathize Define Ideate Prototype และ Test',
    'มีความสามารถในการวิเคราะห์และเขียน Business Model Canvas',
    'มีเจตคติและกิจนิสัยที่ดีในการคิดสร้างสรรค์และทำงานเป็นทีม',
  ],
  competencies: [
    'ประมวลความรู้เกี่ยวกับหลักการคิดเชิงออกแบบ (Design Thinking) ตามหลักการ',
    'ออกแบบนวัตกรรมธุรกิจดิจิทัลโดยใช้กระบวนการ Design Thinking 5 ขั้น',
    'ประยุกต์ใช้ Business Model Canvas ในการวางแผนนวัตกรรมธุรกิจดิจิทัล',
  ],
  description: 'ออกแบบนวัตกรรมธุรกิจดิจิทัลตาม Design Thinking 5 ขั้น (Empathize→Define→Ideate→Prototype→Test) และเขียน Business Model Canvas',
  branding: {
    brandName: 'Design Thinking Biz',
    brandTagline: 'นวัตกรรมธุรกิจดิจิทัลที่ใช้ได้จริง',
    logoEmoji: '🎨',
    primaryColor: '#7c3aed',
    secondaryColor: '#a855f7',
  },
  rubric: [
    {
      dimensionId: 'dt-process-biz',
      label: 'กระบวนการ Design Thinking',
      labelEN: 'DT Process',
      weight: 30,
      description: 'ผ่านครบ 5 ขั้น + มีหลักฐาน + iterative',
      levelDescriptors: [
        'ผ่านน้อยกว่า 3 ขั้น หรือขาดหลักฐาน',
        'ผ่าน 3 ขั้น มีหลักฐานบางส่วน',
        'ผ่านครบ 5 ขั้น มีหลักฐาน',
        'ครบ 5 ขั้น + ทำซ้ำ + หลักฐานครบ',
        'สมบูรณ์ + สะท้อนคิดลึก + เชื่อมโยงทุกขั้น',
      ],
      criteria: [
        { id: 'dtb-c1', label: 'ทำ Empathize ด้วยการสัมภาษณ์/สังเกตผู้ใช้จริง ≥ 3 คน', levels: ['ไม่มี', '1-2 คน', '3 คนขึ้นไป', '3+ คน + หลากหลายวิธี'] },
        { id: 'dtb-c2', label: 'กำหนดปัญหา Define ด้วย POV + HMW ชัดเจน', levels: ['ไม่มี POV', 'กว้างเกิน', 'ชัดเจน', 'ชัด + เชื่อมกับ Empathize'] },
        { id: 'dtb-c3', label: 'ระดมไอเดีย Ideate ≥ 10 ข้อ + เลือก Solution', levels: ['< 5 ข้อ', '5-9 ข้อ', '≥ 10 ข้อ', '≥ 10 + Decision Matrix'] },
        { id: 'dtb-c4', label: 'สร้าง Prototype และทดสอบ Test', levels: ['ไม่มี', 'มี Prototype เท่านั้น', 'Test + feedback', 'Test ≥ 2 รอบ + ปรับปรุง'] },
      ],
    },
    {
      dimensionId: 'empathize-insight',
      label: 'ความเข้าใจลูกค้า (Empathize)',
      labelEN: 'Customer Empathy',
      weight: 20,
      description: 'เข้าใจ Pain / Gain ของกลุ่มเป้าหมายอย่างลึกซึ้ง',
      levelDescriptors: [
        'ไม่มีข้อมูลจากลูกค้าจริง',
        'มีข้อมูลผิวเผิน',
        'เข้าใจ Pain / Gain ชัดเจน',
        'มี Empathy Map + Insight ที่ลึก',
        'Insight สะท้อนพฤติกรรมจริง + นำไปกำหนด HMW ได้ดีเลิศ',
      ],
      criteria: [
        { id: 'emp-c1', label: 'ข้อมูลจากการสัมภาษณ์ครบ ≥ 3 คน', levels: ['ไม่มี', '1-2', '3+', '3+ + Empathy Map'] },
        { id: 'emp-c2', label: 'ระบุ Insight / Pain / Gain ชัดเจน', levels: ['ไม่ระบุ', 'กว้างเกิน', 'ชัดเจน', 'ลึก + มีหลักฐาน'] },
      ],
    },
    {
      dimensionId: 'prototype-test',
      label: 'Prototype & Test',
      labelEN: 'Prototype & Test',
      weight: 25,
      description: 'สร้าง prototype ที่ทดสอบได้และปรับปรุงตาม feedback',
      levelDescriptors: [
        'ไม่มี Prototype',
        'มี Prototype แต่ไม่ทดสอบ',
        'ทดสอบ 1 รอบ',
        'ทดสอบ + ปรับปรุง ≥ 2 รอบ',
        'Iterative + บันทึก feedback ทุกรอบ + แสดงพัฒนาการ',
      ],
      criteria: [
        { id: 'pt-c1', label: 'Prototype ตรงกับ HMW และแก้ Pain ได้', levels: ['ไม่ตรง', 'ตรงบางส่วน', 'ตรง', 'ตรงและมีคุณค่าสูง'] },
        { id: 'pt-c2', label: 'บันทึก Test Results และปรับปรุง', levels: ['ไม่มี', 'มีบันทึก', 'บันทึก + ปรับ', 'ปรับ ≥ 2 รอบ + เหตุผล'] },
      ],
    },
    {
      dimensionId: 'business-model',
      label: 'Business Model Canvas',
      labelEN: 'BMC',
      weight: 25,
      description: 'เขียน BMC ครบ 9 ช่อง เชื่อมโยงสอดคล้อง',
      levelDescriptors: [
        'ไม่มี BMC หรือขาดมากกว่า 5 ช่อง',
        'มี BMC แต่ขาด 3-4 ช่อง หรือไม่สอดคล้อง',
        'BMC ครบ 9 ช่อง',
        'BMC ครบ + เชื่อมโยง Value Proposition กับ Revenue',
        'BMC สมบูรณ์ + วิเคราะห์ Break-even + แผน Scale',
      ],
      criteria: [
        { id: 'bmc-c1', label: 'Value Proposition ชัดเจน ตรงกลุ่มลูกค้า', levels: ['ไม่ชัด', 'พอชัด', 'ชัด', 'ชัด + ตรงใจลูกค้า'] },
        { id: 'bmc-c2', label: 'Revenue Stream สมเหตุสมผล', levels: ['ไม่มี', 'คลุมเครือ', 'ชัดเจน', 'หลาย Stream + ยั่งยืน'] },
        { id: 'bmc-c3', label: 'BMC ครบ 9 ช่อง', levels: ['< 5 ช่อง', '5-7 ช่อง', '8-9 ช่อง', 'ครบ + เชื่อมโยง'] },
      ],
    },
  ],

  missionConfig: {
    title: 'โจทย์นวัตกรรมธุรกิจดิจิทัล',
    fields: [
      { id: 'business_idea',    label: 'แนวคิดนวัตกรรมธุรกิจดิจิทัล', placeholder: 'อธิบายไอเดียนวัตกรรมที่จะพัฒนา' },
      { id: 'target_customer',  label: 'กลุ่มลูกค้าเป้าหมาย',          placeholder: 'ใครคือลูกค้าหลัก?' },
      { id: 'problem_to_solve', label: 'ปัญหาที่ต้องการแก้',           placeholder: 'ปัญหาของลูกค้าคืออะไร?' },
      { id: 'digital_element',  label: 'องค์ประกอบดิจิทัลที่ใช้',      placeholder: 'AI / App / Platform / IoT / etc.' },
    ],
  },

  worksheets: [
    {
      id: 'WS-DT-01', icon: '💡', order: 1,
      labelTH: '1 · หลักการ Design Thinking', label: 'DT Overview',
      instructionTH: 'ทบทวนความหมาย ความสำคัญ และ 5 ขั้นตอนของ Design Thinking',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่', required: true },
        { id: 'q1_dt_meaning', type: 'textarea', rows: 4, label: '1. Design Thinking คืออะไร? ทำไมถึงสำคัญในยุคดิจิทัล?' },
        { id: 'q2_5stages', type: 'list', label: '2. 5 ขั้นตอนของ Design Thinking', minItems: 5,
          itemSchema: [
            { id: 'stage', type: 'text', label: 'ขั้นตอน' },
            { id: 'goal',  type: 'text', label: 'เป้าหมาย' },
            { id: 'tools', type: 'text', label: 'เครื่องมือ/วิธีการ' }
          ]
        },
        { id: 'q3_dt_vs_traditional', type: 'textarea', rows: 4, label: '3. Design Thinking แตกต่างจากกระบวนการแก้ปัญหาแบบดั้งเดิมอย่างไร?' },
        { id: 'q4_example_company', type: 'textarea', rows: 4, label: '4. ยกตัวอย่างบริษัทที่ประสบความสำเร็จด้วย Design Thinking + อธิบาย' },
      ]
    },

    {
      id: 'WS-DT-02', icon: '❤️', order: 2,
      labelTH: '2 · Empathize ทำความเข้าใจลูกค้า', label: 'Empathize',
      instructionTH: 'สัมภาษณ์และสังเกตกลุ่มเป้าหมาย ≥ 3 คน แล้วสรุป Pain/Gain',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'target_group', type: 'text', label: 'กลุ่มเป้าหมายที่สัมภาษณ์' },
        { id: 'interviews', type: 'list', label: 'บันทึกการสัมภาษณ์ (≥ 3 คน)', minItems: 3,
          itemSchema: [
            { id: 'interviewee', type: 'text',     label: 'ชื่อ/อาชีพ' },
            { id: 'age',         type: 'text',     label: 'อายุ/ประสบการณ์' },
            { id: 'pain',        type: 'textarea', rows: 2, label: 'Pain (ปัญหา/ความยากลำบาก)' },
            { id: 'gain',        type: 'textarea', rows: 2, label: 'Gain (สิ่งที่ต้องการ/ความฝัน)' },
            { id: 'quote',       type: 'text',     label: 'คำพูดสำคัญ (Quote)' }
          ]
        },
        { id: 'empathy_map', type: 'image', label: 'Empathy Map (ถ่ายภาพหรือ upload)' },
        { id: 'insight_summary', type: 'textarea', rows: 5, label: 'สรุป Insight ที่ค้นพบ' },
      ]
    },

    {
      id: 'WS-DT-03', icon: '🎯', order: 3,
      labelTH: '3 · Define กำหนดปัญหา', label: 'Define',
      instructionTH: 'กำหนดปัญหาที่ชัดเจน ด้วย POV Statement และ HMW Question',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'insights_from_empathize', type: 'textarea', rows: 4, label: '1. Insight จาก Empathize ที่เลือกมาแก้ปัญหา' },
        { id: 'pov_statement', type: 'textarea', rows: 4, label: '2. POV Statement: [ชื่อ User] ต้องการ [need] เพราะ [insight]' },
        { id: 'hmw_questions', type: 'list', label: '3. HMW Questions (How Might We...) ≥ 5 ข้อ', minItems: 5,
          itemSchema: [{ id: 'hmw', type: 'text', label: 'How Might We...' }]
        },
        { id: 'selected_hmw', type: 'textarea', rows: 3, label: '4. HMW ที่เลือกเพื่อนำไป Ideate + เหตุผล' },
      ]
    },

    {
      id: 'WS-DT-04', icon: '🌪️', order: 4,
      labelTH: '4 · Ideate ระดมความคิด', label: 'Ideate',
      instructionTH: 'ระดมไอเดีย ≥ 10 ข้อ ด้วยเทคนิค Brainstorming แล้วเลือก Solution ที่ดีที่สุด',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'brainstorm_method', type: 'select', label: 'เทคนิคที่ใช้', options: ['Brainstorming', 'Crazy Eights', 'SCAMPER', 'Mind Map', 'Worst Possible Idea', 'อื่น ๆ'] },
        { id: 'all_ideas', type: 'list', label: 'ไอเดียทั้งหมด (≥ 10 ข้อ)', minItems: 10,
          itemSchema: [
            { id: 'idea_no', type: 'number', label: 'ลำดับ' },
            { id: 'idea',    type: 'text',   label: 'ไอเดีย' }
          ]
        },
        { id: 'decision_matrix', type: 'textarea', rows: 5, label: 'เกณฑ์การเลือก Solution (Decision Matrix / เหตุผล)' },
        { id: 'selected_solution', type: 'textarea', rows: 5, label: 'Solution ที่เลือก + เหตุผล' },
      ]
    },

    {
      id: 'WS-DT-05', icon: '🛠️', order: 5,
      labelTH: '5 · Prototype สร้างแบบจำลอง', label: 'Prototype',
      instructionTH: 'สร้าง Prototype ที่ทดสอบได้ (Lo-Fi / Hi-Fi / Paper prototype)',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'prototype_type', type: 'select', label: 'ประเภท Prototype', options: ['Paper Prototype', 'Lo-Fi Wireframe', 'Hi-Fi Mockup', 'Physical Model', 'Clickable Prototype', 'MVP'] },
        { id: 'prototype_goal', type: 'textarea', rows: 3, label: '1. เป้าหมายของ Prototype นี้ (ทดสอบอะไร?)' },
        { id: 'prototype_photos', type: 'image', label: '2. ภาพ Prototype (ถ่ายภาพ/upload)' },
        { id: 'prototype_desc', type: 'textarea', rows: 5, label: '3. อธิบาย Prototype — ทำงานอย่างไร? Features หลัก?' },
        { id: 'test_plan', type: 'textarea', rows: 4, label: '4. แผนการทดสอบ — ทดสอบกับใคร? ทดสอบอะไร? วัดผลอย่างไร?' },
      ]
    },

    {
      id: 'WS-DT-06', icon: '🧪', order: 6,
      labelTH: '6 · Test ทดสอบและปรับปรุง', label: 'Test',
      instructionTH: 'ทดสอบ Prototype กับกลุ่มเป้าหมาย ≥ 3 คน รวบรวม Feedback และปรับปรุง',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'test_results', type: 'list', label: 'ผลการทดสอบ (≥ 3 คน)', minItems: 3,
          itemSchema: [
            { id: 'tester',   type: 'text',     label: 'ผู้ทดสอบ' },
            { id: 'likes',    type: 'textarea', rows: 2, label: 'ชอบอะไร?' },
            { id: 'dislikes', type: 'textarea', rows: 2, label: 'ไม่ชอบอะไร / ปัญหา?' },
            { id: 'suggest',  type: 'textarea', rows: 2, label: 'ข้อเสนอแนะ' }
          ]
        },
        { id: 'improvements', type: 'textarea', rows: 5, label: 'สิ่งที่จะปรับปรุงจาก Feedback' },
        { id: 'prototype_v2', type: 'image', label: 'ภาพ Prototype หลังปรับปรุง (ถ้ามี)' },
      ]
    },

    {
      id: 'WS-DT-07', icon: '📊', order: 7,
      labelTH: '7 · Business Model Canvas', label: 'BMC',
      instructionTH: 'เขียน Business Model Canvas ครบ 9 ช่อง สำหรับนวัตกรรมธุรกิจดิจิทัล',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'bmc_image', type: 'image', label: 'ภาพ BMC ที่เขียน (ถ่ายภาพ/upload)' },
        { id: 'value_proposition', type: 'textarea', rows: 4, label: '1. Value Proposition — สินค้า/บริการ + คุณค่าที่มอบให้ลูกค้า' },
        { id: 'customer_segments', type: 'textarea', rows: 3, label: '2. Customer Segments — กลุ่มลูกค้า' },
        { id: 'channels',         type: 'textarea', rows: 3, label: '3. Channels — ช่องทางเข้าถึงลูกค้า' },
        { id: 'customer_relations',type:'textarea', rows: 3, label: '4. Customer Relationships — ความสัมพันธ์กับลูกค้า' },
        { id: 'revenue_streams',  type: 'textarea', rows: 3, label: '5. Revenue Streams — รายได้' },
        { id: 'key_resources',    type: 'textarea', rows: 3, label: '6. Key Resources — ทรัพยากรสำคัญ' },
        { id: 'key_activities',   type: 'textarea', rows: 3, label: '7. Key Activities — กิจกรรมหลัก' },
        { id: 'key_partners',     type: 'textarea', rows: 3, label: '8. Key Partners — พันธมิตร' },
        { id: 'cost_structure',   type: 'textarea', rows: 3, label: '9. Cost Structure — โครงสร้างต้นทุน' },
      ]
    },

    {
      id: 'WS-DT-08', icon: '🎤', order: 8,
      labelTH: '8 · นำเสนอและสะท้อนคิด', label: 'Pitch & Reflect',
      instructionTH: 'เตรียมนำเสนอผลงาน + สะท้อนสิ่งที่เรียนรู้จากกระบวนการ Design Thinking',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'pitch_outline', type: 'list', label: '1. โครงสร้างการนำเสนอ', minItems: 4,
          itemSchema: [
            { id: 'section', type: 'text', label: 'หัวข้อ' },
            { id: 'minutes', type: 'number', label: 'เวลา (นาที)' },
            { id: 'content', type: 'text', label: 'เนื้อหาสำคัญ' }
          ]
        },
        { id: 'team_reflection', type: 'textarea', rows: 5, label: '2. สะท้อนทีม — สิ่งที่ทำดีแล้ว + สิ่งที่จะพัฒนา' },
        { id: 'dt_learning', type: 'textarea', rows: 5, label: '3. เรียนรู้อะไรจาก Design Thinking?' },
        { id: 'next_steps', type: 'textarea', rows: 4, label: '4. หากได้พัฒนาต่อ จะทำอะไร?' },
      ]
    },
  ],

  evaluatorWeights: { self: 10, peer: 10, teacher: 45, sage: 25, ai: 10 },
};

// ─────────────────────────────────────────────────────────────────────
// 31910-2013 การประมวลผลแบบคลาวด์ (Cloud Computing)
// หลักสูตร ปวส. 2567 สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล
// ─────────────────────────────────────────────────────────────────────
export const CLOUD_COMPUTING_COURSE = {
  schemaVersion: 1,
  id: '31910-2013',
  name: '31910-2013 การประมวลผลแบบคลาวด์',
  nameTH: 'การประมวลผลแบบคลาวด์',
  nameEN: 'Cloud Computing',
  methodology: ['Project-Based'],
  isDefault: false,
  // ── ข้อมูลจากหลักสูตร ปวส. 2567 (31910v4-76.pdf) ──────────────────
  curriculum: 'หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2567',
  credits: '2-2-3',
  standards: [],
  learningOutcomes: 'ใช้บริการระบบประมวลผลแบบกลุ่มเมฆ และประยุกต์ใช้โปรแกรมประมวลผลแบบกลุ่มงานด้านธุรกิจดิจิทัลด้วยความละเอียด รอบคอบและถูกต้อง',
  objectives: [
    'เข้าใจเกี่ยวกับหลักการระบบประมวลผลแบบกลุ่มเมฆ (Cloud Computing)',
    'มีทักษะในการใช้บริการระบบประมวลผลแบบกลุ่มเมฆ',
    'มีความสามารถประยุกต์ใช้โปรแกรมประมวลผลแบบกลุ่มงานด้านธุรกิจดิจิทัล',
    'มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความละเอียด รอบคอบและถูกต้อง',
  ],
  competencies: [
    'ประมวลความรู้เกี่ยวกับการระบบประมวลผลแบบกลุ่มเมฆ (Cloud Computing) ตามหลักการ',
    'ใช้บริการระบบประมวลผลแบบกลุ่มเมฆสำหรับงานธุรกิจดิจิทัล',
    'ประยุกต์ใช้โปรแกรมประมวลผลแบบกลุ่มงานด้านธุรกิจดิจิทัล',
  ],
  description: 'ศึกษาและปฏิบัติเกี่ยวกับหลักการระบบประมวลผลแบบกลุ่มเมฆ (Cloud Computing) การใช้บริการระบบประมวลผลแบบกลุ่มเมฆ โมเดลระบบประมวลผลแบบกลุ่มเมฆ ซอฟต์แวร์ (SaaS) แพลตฟอร์ม (PaaS) โครงสร้างพื้นฐาน (IaaS) บริการระบบจัดเก็บข้อมูล บริการร่วมและรวม (Composite Service) การประยุกต์ใช้โปรแกรมประมวลผลแบบกลุ่มงานด้านธุรกิจดิจิทัล',
  branding: {
    brandName: 'Cloud Computing',
    brandTagline: 'คลาวด์เทคโนโลยีสำหรับธุรกิจดิจิทัล',
    logoEmoji: '☁️',
    primaryColor: '#0e7490',
    secondaryColor: '#06b6d4',
  },
  rubric: [
    {
      dimensionId: 'cloud-concept',
      label: 'ความเข้าใจหลักการ Cloud',
      labelEN: 'Cloud Concepts',
      weight: 25,
      description: 'อธิบายหลักการ โมเดล และประเภทบริการ Cloud ได้ถูกต้อง',
      levelDescriptors: [
        'อธิบายหลักการ Cloud ไม่ได้',
        'เข้าใจบางส่วน อธิบายไม่ครบ',
        'อธิบาย SaaS/PaaS/IaaS ได้ถูกต้อง',
        'อธิบาย + เปรียบเทียบ Deployment Models ได้',
        'เข้าใจลึก + วิเคราะห์ Trade-off แต่ละโมเดล',
      ],
      criteria: [
        { id: 'cc-c1', label: 'อธิบาย Cloud Computing และข้อดีเทียบกับ On-premise', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้', 'ได้+ยกตัวอย่าง'] },
        { id: 'cc-c2', label: 'แยกแยะ SaaS / PaaS / IaaS ได้', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้ครบ', 'ได้+ยกตัวอย่างแต่ละแบบ'] },
        { id: 'cc-c3', label: 'อธิบาย Public / Private / Hybrid Cloud', levels: ['ไม่ได้', 'ได้บางส่วน', 'ได้', 'ได้+วิเคราะห์ use case'] },
      ],
    },
    {
      dimensionId: 'cloud-service',
      label: 'การใช้บริการ Cloud',
      labelEN: 'Cloud Service Usage',
      weight: 35,
      description: 'ใช้บริการ Cloud Storage บริการแบบ SaaS และ Platform ได้จริง',
      levelDescriptors: [
        'ใช้บริการ Cloud ไม่ได้',
        'ใช้บริการพื้นฐานบางอย่างได้',
        'ใช้ Storage + SaaS ทั่วไปได้คล่อง',
        'ตั้งค่า PaaS + Deploy Application ได้',
        'ออกแบบ Cloud Architecture + Optimize ค่าใช้จ่ายได้',
      ],
      criteria: [
        { id: 'cc-s1', label: 'ใช้ Cloud Storage (Drive/S3/GCS) ได้', levels: ['ไม่ได้', 'ได้บ้าง', 'ได้คล่อง', 'ตั้งค่า Permission/Share ได้ดี'] },
        { id: 'cc-s2', label: 'ใช้ SaaS (Google Workspace/Office365/etc.) ได้', levels: ['ไม่ได้', 'ได้บ้าง', 'ได้คล่อง', 'ใช้ Collaboration Features ได้'] },
        { id: 'cc-s3', label: 'Deploy แอปพลิเคชันบน Cloud Platform ได้', levels: ['ไม่ได้', 'ทำตาม tutorial ได้', 'Deploy เองได้', 'Deploy + Config + Monitor ได้'] },
      ],
    },
    {
      dimensionId: 'cloud-apply',
      label: 'การประยุกต์ใช้ธุรกิจดิจิทัล',
      labelEN: 'Digital Business Application',
      weight: 25,
      description: 'ประยุกต์ใช้ Cloud สำหรับงานธุรกิจดิจิทัลได้จริง',
      levelDescriptors: [
        'ไม่สามารถเชื่อมโยง Cloud กับงานธุรกิจได้',
        'เชื่อมโยงได้บ้าง โดยมีการแนะนำ',
        'เลือก Cloud Service ที่เหมาะสมกับงานได้',
        'ออกแบบ Cloud Solution สำหรับธุรกิจได้',
        'Cloud Solution ที่ประหยัดต้นทุน + ปลอดภัย + Scale ได้',
      ],
      criteria: [
        { id: 'cc-a1', label: 'เลือก Cloud Service ให้ตรงกับโจทย์ธุรกิจ', levels: ['เลือกไม่เหมาะ', 'เลือกพอใช้', 'เหมาะสม', 'เหมาะ+อธิบายเหตุผล'] },
        { id: 'cc-a2', label: 'ทำโปรเจกต์ Cloud สำเร็จและใช้งานได้จริง', levels: ['ไม่สำเร็จ', 'สำเร็จบางส่วน', 'สำเร็จ', 'สำเร็จ+นำเสนอได้ดี'] },
      ],
    },
    {
      dimensionId: 'cloud-professional',
      label: 'ความรับผิดชอบและรอบคอบ',
      labelEN: 'Professionalism',
      weight: 15,
      description: 'ปฏิบัติงานด้วยความละเอียด รอบคอบ และตรงเวลา',
      levelDescriptors: [
        'ส่งงานไม่ครบ ขาดความรับผิดชอบ',
        'ส่งงานช้า คุณภาพต่ำ',
        'ส่งงานครบตรงเวลา คุณภาพดี',
        'ส่งครบตรงเวลา + ละเอียดรอบคอบ',
        'ดีเลิศ + ช่วยเพื่อน + Proactive',
      ],
      criteria: [
        { id: 'cc-p1', label: 'ส่งงานครบตามกำหนด', levels: ['ไม่ส่ง', 'ส่งช้า', 'ตรงเวลา', 'ก่อนเวลา+คุณภาพสูง'] },
      ],
    },
  ],

  missionConfig: {
    title: 'โปรเจกต์ Cloud Computing',
    fields: [
      { id: 'project_name',    label: 'ชื่อโปรเจกต์',               placeholder: 'เช่น ระบบ e-Commerce บน Cloud' },
      { id: 'cloud_provider',  label: 'Cloud Provider ที่เลือก',     placeholder: 'AWS / GCP / Azure / Firebase / อื่น ๆ' },
      { id: 'services_used',   label: 'บริการ Cloud ที่จะใช้',       placeholder: 'เช่น Cloud Storage, Hosting, Database, Auth' },
      { id: 'business_problem',label: 'โจทย์ธุรกิจที่แก้ด้วย Cloud', placeholder: 'ปัญหาที่ Cloud ช่วยแก้ได้' },
    ],
  },

  worksheets: [
    {
      id: 'WS-CC-01', icon: '☁️', order: 1,
      labelTH: '1 · หลักการ Cloud Computing', label: 'Cloud Fundamentals',
      instructionTH: 'ศึกษาหลักการ ประโยชน์ และโมเดลของ Cloud Computing',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่', required: true },
        { id: 'q1_cloud_meaning', type: 'textarea', rows: 4, label: '1. Cloud Computing คืออะไร? มีลักษณะสำคัญ 5 ประการอะไรบ้าง?' },
        { id: 'q2_benefits', type: 'list', label: '2. ข้อดีของ Cloud เทียบกับ On-premise (≥ 5 ข้อ)', minItems: 5,
          itemSchema: [
            { id: 'benefit',    type: 'text', label: 'ข้อดี' },
            { id: 'comparison', type: 'text', label: 'On-premise เป็นอย่างไร?' }
          ]
        },
        { id: 'q3_deployment_models', type: 'list', label: '3. Cloud Deployment Models', minItems: 3,
          itemSchema: [
            { id: 'model',    type: 'text', label: 'รูปแบบ (Public/Private/Hybrid/Community)' },
            { id: 'desc',     type: 'text', label: 'ลักษณะ' },
            { id: 'usecase',  type: 'text', label: 'เหมาะกับองค์กรแบบใด' }
          ]
        },
        { id: 'q4_examples', type: 'textarea', rows: 4, label: '4. ยกตัวอย่าง Cloud Service ที่ใช้ในชีวิตประจำวัน ≥ 5 ตัวอย่าง' },
      ]
    },

    {
      id: 'WS-CC-02', icon: '🏗️', order: 2,
      labelTH: '2 · โมเดลบริการ SaaS / PaaS / IaaS', label: 'Service Models',
      instructionTH: 'เปรียบเทียบและยกตัวอย่าง Cloud Service Models ทั้ง 3 แบบ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_saas', type: 'textarea', rows: 4, label: '1. SaaS (Software as a Service) — คืออะไร? ตัวอย่าง + ใช้เมื่อไหร่?' },
        { id: 'q2_paas', type: 'textarea', rows: 4, label: '2. PaaS (Platform as a Service) — คืออะไร? ตัวอย่าง + ใช้เมื่อไหร่?' },
        { id: 'q3_iaas', type: 'textarea', rows: 4, label: '3. IaaS (Infrastructure as a Service) — คืออะไร? ตัวอย่าง + ใช้เมื่อไหร่?' },
        { id: 'q4_comparison', type: 'list', label: '4. เปรียบเทียบ SaaS/PaaS/IaaS — ใครรับผิดชอบอะไร?', minItems: 5,
          itemSchema: [
            { id: 'layer',  type: 'text', label: 'Layer (เช่น OS, Runtime, App)' },
            { id: 'saas',   type: 'text', label: 'SaaS (Provider/Customer)' },
            { id: 'paas',   type: 'text', label: 'PaaS' },
            { id: 'iaas',   type: 'text', label: 'IaaS' },
            { id: 'onprem', type: 'text', label: 'On-premise' },
          ]
        },
        { id: 'q5_choose', type: 'textarea', rows: 4, label: '5. โจทย์: บริษัท Startup ที่มีทีม Dev 5 คน ควรเลือก SaaS/PaaS/IaaS แบบใด? เพราะอะไร?' },
      ]
    },

    {
      id: 'WS-CC-03', icon: '💾', order: 3,
      labelTH: '3 · บริการ Cloud Storage', label: 'Cloud Storage',
      instructionTH: 'ทดลองใช้บริการ Cloud Storage และตั้งค่า Permission การแชร์',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_storage_services', type: 'list', label: '1. บริการ Cloud Storage ที่รู้จัก ≥ 4 บริการ', minItems: 4,
          itemSchema: [
            { id: 'service',  type: 'text',   label: 'ชื่อบริการ' },
            { id: 'provider', type: 'text',   label: 'ผู้ให้บริการ' },
            { id: 'free_storage', type: 'text', label: 'ฟรี (GB)' },
            { id: 'feature', type: 'text',    label: 'จุดเด่น' }
          ]
        },
        { id: 'q2_practice', type: 'textarea', rows: 4, label: '2. ทดลองใช้ Google Drive / OneDrive — สรุปสิ่งที่ทดลอง' },
        { id: 'q3_screenshot', type: 'image', label: '3. Screenshot การแชร์ไฟล์ / ตั้งค่า Permission' },
        { id: 'q4_usecase', type: 'textarea', rows: 4, label: '4. ยกตัวอย่าง Use Case Cloud Storage สำหรับธุรกิจดิจิทัล ≥ 3 กรณี' },
      ]
    },

    {
      id: 'WS-CC-04', icon: '🔧', order: 4,
      labelTH: '4 · Composite Service & API', label: 'Composite Services',
      instructionTH: 'ศึกษาการรวมบริการ Cloud หลายอย่างเข้าด้วยกัน (Composite Service)',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'q1_composite', type: 'textarea', rows: 4, label: '1. Composite Service คืออะไร? ทำไมถึงสำคัญ?' },
        { id: 'q2_api_role', type: 'textarea', rows: 4, label: '2. API มีบทบาทอย่างไรใน Cloud Ecosystem?' },
        { id: 'q3_examples', type: 'list', label: '3. ตัวอย่าง Composite Service ≥ 3 กรณี', minItems: 3,
          itemSchema: [
            { id: 'scenario',  type: 'text', label: 'สถานการณ์/ธุรกิจ' },
            { id: 'services',  type: 'text', label: 'Cloud Services ที่รวมกัน' },
            { id: 'benefit',   type: 'text', label: 'ประโยชน์ที่ได้' }
          ]
        },
        { id: 'q4_design', type: 'textarea', rows: 5, label: '4. ออกแบบ Composite Cloud Solution สำหรับร้านค้าออนไลน์ — ใช้ Services อะไรบ้าง?' },
      ]
    },

    {
      id: 'WS-CC-05', icon: '🚀', order: 5,
      labelTH: '5 · ทดลอง Deploy บน Cloud', label: 'Cloud Deploy',
      instructionTH: 'ทดลอง Deploy แอปพลิเคชันบน Cloud Platform เช่น Firebase Hosting หรือ Vercel',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'platform_used', type: 'select', label: 'Platform ที่ใช้', options: ['Firebase Hosting', 'Vercel', 'Netlify', 'GitHub Pages', 'AWS Amplify', 'Google App Engine', 'Heroku', 'อื่น ๆ'] },
        { id: 'q1_steps', type: 'list', label: '1. ขั้นตอนการ Deploy', minItems: 3,
          itemSchema: [
            { id: 'step', type: 'number', label: 'ขั้นตอน' },
            { id: 'desc', type: 'text',   label: 'รายละเอียด' }
          ]
        },
        { id: 'q2_screenshot', type: 'image', label: '2. Screenshot แอปที่ Deploy สำเร็จ' },
        { id: 'q3_url', type: 'text', label: '3. URL ของแอปที่ Deploy (ถ้ามี)' },
        { id: 'q4_problems', type: 'textarea', rows: 4, label: '4. ปัญหาที่พบและวิธีแก้ไข' },
        { id: 'q5_reflection', type: 'textarea', rows: 4, label: '5. สรุปสิ่งที่เรียนรู้' },
      ]
    },

    {
      id: 'WS-CC-06', icon: '💼', order: 6,
      labelTH: '6 · Cloud สำหรับธุรกิจดิจิทัล', label: 'Cloud for Digital Business',
      instructionTH: 'วิเคราะห์และออกแบบ Cloud Solution สำหรับธุรกิจดิจิทัล',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'business_type', type: 'text', label: 'ประเภทธุรกิจที่วิเคราะห์' },
        { id: 'current_problems', type: 'textarea', rows: 4, label: '1. ปัญหาปัจจุบันของธุรกิจที่ Cloud แก้ได้' },
        { id: 'cloud_solution', type: 'list', label: '2. Cloud Solution ที่เสนอ', minItems: 3,
          itemSchema: [
            { id: 'service',  type: 'text', label: 'Cloud Service' },
            { id: 'purpose',  type: 'text', label: 'ใช้เพื่ออะไร' },
            { id: 'benefit',  type: 'text', label: 'ประโยชน์ที่ธุรกิจได้รับ' }
          ]
        },
        { id: 'cost_estimate', type: 'textarea', rows: 4, label: '3. ประมาณค่าใช้จ่าย Cloud ต่อเดือน (เทียบกับ On-premise)' },
        { id: 'architecture_diagram', type: 'image', label: '4. Cloud Architecture Diagram (วาด/upload)' },
      ]
    },

    {
      id: 'WS-CC-07', icon: '🏆', order: 7,
      labelTH: '7 · โปรเจกต์ Cloud Computing', label: 'Cloud Project',
      instructionTH: 'สรุปโปรเจกต์ Cloud Computing — ออกแบบ พัฒนา และนำเสนอ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อกลุ่ม/ชื่อนักศึกษา', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'project_name', type: 'text', label: 'ชื่อโปรเจกต์' },
        { id: 'project_desc', type: 'textarea', rows: 4, label: '1. อธิบายโปรเจกต์ Cloud Computing' },
        { id: 'services_used', type: 'list', label: '2. Cloud Services ที่ใช้', minItems: 2,
          itemSchema: [
            { id: 'service',  type: 'text', label: 'บริการ' },
            { id: 'provider', type: 'text', label: 'ผู้ให้บริการ' },
            { id: 'role',     type: 'text', label: 'บทบาทในโปรเจกต์' }
          ]
        },
        { id: 'demo_screenshot', type: 'image', label: '3. Screenshot การทำงานของระบบ' },
        { id: 'demo_url', type: 'text', label: '4. URL สาธิต (ถ้ามี)' },
        { id: 'cost_analysis', type: 'textarea', rows: 4, label: '5. วิเคราะห์ค่าใช้จ่าย Cloud ที่เกิดขึ้นจริง' },
        { id: 'reflection', type: 'textarea', rows: 5, label: '6. สรุปสิ่งที่เรียนรู้ + ข้อเสนอแนะ' },
      ]
    },
  ],

  evaluatorWeights: { self: 10, peer: 10, teacher: 50, sage: 20, ai: 10 },
};

// Registry — easy to add more seed courses in the future
export const COURSE_SEEDS = {
  'design-thinking-s4i': DESIGN_THINKING_S4I_COURSE,
  '31910-2002':           DATABASE_SYSTEM_COURSE,
  '31910-2004':           DESIGN_THINKING_BIZ_COURSE,
  '31910-2013':           CLOUD_COMPUTING_COURSE,
};
