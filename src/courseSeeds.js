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

// Registry — easy to add more seed courses in the future
export const COURSE_SEEDS = {
  'design-thinking-s4i': DESIGN_THINKING_S4I_COURSE,
  // Future:
  // 'lean-startup':       LEAN_STARTUP_COURSE,
  // 'project-based':      PROJECT_BASED_LEARNING_COURSE,
};
