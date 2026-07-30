// src/constants/courses.js
// Course-related core constants and helpers — the foundation of the multi-course
// system added in v2.0. Adding a NEW course = add an entry to BUILTIN_COURSES
// OR seed via Admin → Courses → Import (preferred for non-default courses).

// ─────────────────────────────────────────────────────────────────────
// Evaluation Dimensions + Roles
// ─────────────────────────────────────────────────────────────────────

// The five evaluation dimensions used in BOTH the Pitching Evaluator and the
// EVAL-MATRIX. Keep in sync so scores entered in one place show up in the other.
// NOTE (v2.0): kept as global for backwards compatibility with all current
// hardcoded usages. New course-aware code reads from currentCourse.rubric.
export const SCORE_DIMENSIONS = ['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'];

// All evaluator roles we display in the matrix legend / cell badges.
export const EVALUATOR_ROLES = ['self', 'peer', 'teacher', 'sage', 'ai'];

// Thai labels for rubric levels 1-4. Levels beyond 4 fall back to "ระดับที่ N".
export const RUBRIC_LEVEL_LABELS = ['ปรับปรุง', 'พอใช้', 'ดี', 'ดีเยี่ยม'];

// ─────────────────────────────────────────────────────────────────────
// LEGACY_GREEN_RAYONG_COURSE — the default course
// ─────────────────────────────────────────────────────────────────────
// All current Green Rayong behavior captured as a Course config.
// Future courses (Design Thinking + STEAM4Innovator, etc.) follow the same shape.
// Stored in Firestore at /courses/green-rayong; merged with this constant as fallback.
export const LEGACY_GREEN_RAYONG_COURSE = {
  schemaVersion: 1,
  id: 'green-rayong',
  name: 'ขั้นตอน/กระบวนการสร้างนวัตกรรม',
  nameTH: 'ขั้นตอน/กระบวนการสร้างนวัตกรรม',
  methodology: ['4-Identities'],
  isDefault: true,
  branding: {
    brandName: 'ขั้นตอน/กระบวนการสร้างนวัตกรรม',
    brandTagline: '4-Identities AI Storytellers',
    logoEmoji: '🌿',
    primaryColor: '#16a34a',
    secondaryColor: '#0ea5e9',
  },
  identities: [
    { id: 'garden', label: 'สวน', emoji: '🌳', color: '#16a34a' },
    { id: 'forest', label: 'ป่า', emoji: '🌲', color: '#15803d' },
    { id: 'farm',   label: 'นา', emoji: '🌾', color: '#ca8a04' },
    { id: 'sea',    label: 'เล', emoji: '🌊', color: '#0ea5e9' },
  ],
  // Generic "stages" replaces the old phases/stages split (decision #5)
  stages: [
    { id: 'team-setup',     order: 1, label: 'ตั้งทีม',          emoji: '👥' },
    { id: 'mission-inbox',  order: 2, label: 'รับโจทย์',         emoji: '📥' },
    { id: 'collector',      order: 3, label: 'On-site Collector', emoji: '📸' },
    { id: 'gateway',        order: 4, label: 'Submission Gateway',emoji: '📤' },
    { id: 'evaluation',     order: 5, label: 'Evaluation',        emoji: '⭐' },
    { id: 'pitching',       order: 6, label: 'Pitching',          emoji: '🎤' },
    { id: 'portfolio',      order: 7, label: 'Portfolio (R6)',    emoji: '🏆' },
  ],
  rubric: SCORE_DIMENSIONS.map((dim, i) => ({
    dimensionId : dim.toLowerCase().replace(/\s+/g, '-'),
    label       : dim,
    weight      : [20, 20, 20, 20, 20][i],
    description : '',
  })),
  evaluatorWeights: { self: 10, peer: 15, teacher: 35, sage: 25, ai: 15 },

  // 7 worksheets matching the legacy Submission Gateway phases.
  // Field IDs (wisdom, environment, allIdeas, prototype, videoUrl, bmcCost, aiLogs)
  // are kept identical to legacy field names so api.js logic
  // (runEthicsAudit, aiAuditTeam) continues to pick up these fields.
  worksheets: [
    {
      id: 'wisdom', icon: '🧓', stageId: 'gateway', order: 1,
      labelTH: 'ภูมิปัญญาท้องถิ่น (Local Wisdom)', label: 'Local Wisdom',
      instructionTH: 'บันทึกภูมิปัญญาที่ได้จากปราชญ์ + อ้างอิงแหล่งที่มา · เป็นหัวใจของกระบวนการสร้างนวัตกรรม',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม', required: true },
        { id: 'date', type: 'date', label: 'วันที่บันทึก', required: true },
        { id: 'traditionalWisdom', type: 'textarea', rows: 6, label: 'ภูมิปัญญาที่ได้จากปราชญ์', placeholder: 'อธิบายภูมิปัญญา · ผู้ให้สัมภาษณ์ · ลงพื้นที่เมื่อไหร่' },
        { id: 'wisdom',            type: 'textarea', rows: 4, label: 'การประยุกต์ใช้ในยุคปัจจุบัน' },
        { id: 'sageQuote',         type: 'textarea', rows: 2, label: 'คำพูดเด็ดของปราชญ์ (Quote)' },
        { id: 'sageName',          type: 'text', label: 'ชื่อปราชญ์ (สำหรับ Citation)' },
        { id: 'sageConsent',       type: 'checkbox', label: 'ได้รับอนุญาตจากปราชญ์', checkboxLabel: '✅ ปราชญ์อนุญาตให้บันทึก + เผยแพร่' }
      ]
    },
    {
      id: 'environment', icon: '🌿', stageId: 'gateway', order: 2,
      labelTH: 'ผลกระทบสิ่งแวดล้อม', label: 'Environment Impact',
      instructionTH: 'อธิบายปัญหา/โอกาสด้านสิ่งแวดล้อมในพื้นที่ + กลุ่มที่ได้รับผลกระทบ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม', required: true },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'environment',    type: 'textarea', rows: 5, label: 'สถานการณ์สิ่งแวดล้อมในพื้นที่' },
        { id: 'affectedGroup',  type: 'textarea', rows: 4, label: 'กลุ่มที่ได้รับผลกระทบ (Stakeholders)' },
        { id: 'identity',       type: 'select', label: 'Identity ของพื้นที่', options: ['สวน 🌳', 'ป่า 🌲', 'นา 🌾', 'เล 🌊'] }
      ]
    },
    {
      id: 'brainstorm', icon: '💡', stageId: 'gateway', order: 3,
      labelTH: 'ระดมไอเดีย (Brainstorm)', label: 'Brainstorm',
      instructionTH: 'ระดมไอเดียหลากหลาย → เลือก 1 ไอเดียทำต่อ',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'allIdeas',     type: 'textarea', rows: 8, label: 'ไอเดียทั้งหมด (≥ 5 ข้อ)' },
        { id: 'selectedIdea', type: 'textarea', rows: 4, label: '✅ ไอเดียที่เลือกทำต่อ' },
        { id: 'whySelected',  type: 'textarea', rows: 3, label: 'ทำไมเลือกไอเดียนี้?' }
      ]
    },
    {
      id: 'prototype', icon: '🛠️', stageId: 'gateway', order: 4,
      labelTH: 'ต้นแบบ (Prototype)', label: 'Prototype',
      instructionTH: 'ออกแบบ product/service + ทดสอบกับกลุ่มเป้าหมาย',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'prototype',        type: 'textarea', rows: 6, label: 'อธิบาย Prototype (วิธีการ/ผลิตภัณฑ์/บริการ)' },
        { id: 'prototypeImage',   type: 'image', label: 'ภาพ Prototype' },
        { id: 'testWithWho',      type: 'text', label: 'ทดสอบกับใคร (กลุ่มเป้าหมาย)' },
        { id: 'testCount',        type: 'number', label: 'จำนวนคนที่ทดสอบ' },
        { id: 'testResult',       type: 'textarea', rows: 4, label: 'ผลทดสอบ + Feedback' }
      ]
    },
    {
      id: 'video', icon: '🎬', stageId: 'pitching', order: 5,
      labelTH: 'วิดีโอ Pitching', label: 'Pitching Video',
      instructionTH: 'ลิงก์วิดีโอ Pitching ≤ 5 นาที (YouTube/TikTok/Drive) + subtitle TH+EN',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'videoUrl',      type: 'text', label: 'URL วิดีโอ Pitching', placeholder: 'https://youtu.be/...' },
        { id: 'videoSubtitle', type: 'textarea', rows: 5, label: 'Script/Subtitle 2 ภาษา (TH+EN)' },
        { id: 'videoLength',   type: 'number', label: 'ความยาว (นาที)' }
      ]
    },
    {
      id: 'bmc', icon: '💰', stageId: 'gateway', order: 6,
      labelTH: 'แผนธุรกิจ (BMC)', label: 'Business Model Canvas',
      instructionTH: 'BMC 9 ช่อง — ลูกค้า/รายรับ/ต้นทุน/ช่องทาง',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'bmcCustomer', type: 'textarea', rows: 3, label: 'Customer Segments — ลูกค้าคือใคร?' },
        { id: 'bmcChannel',  type: 'textarea', rows: 3, label: 'Channels — ช่องทางขาย' },
        { id: 'bmcCost',     type: 'number',   label: 'ต้นทุนต่อหน่วย (บาท)' },
        { id: 'bmcPrice',    type: 'number',   label: 'ราคาขาย (บาท)' },
        { id: 'bmcRevenue',  type: 'textarea', rows: 3, label: 'Revenue Streams — รายรับมาจากไหน?' },
        { id: 'bmcResources',type: 'textarea', rows: 3, label: 'Key Resources — ทรัพยากรหลัก' }
      ]
    },
    {
      id: 'aiLogs', icon: '🤖', stageId: 'gateway', order: 7,
      labelTH: 'บันทึกการใช้ AI (Audit Log)', label: 'AI Audit Log',
      instructionTH: 'บันทึกทุก prompt ที่ใช้กับ AI + cross-check ความถูกต้อง — เพื่อความโปร่งใส',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม' },
        { id: 'date', type: 'date', label: 'วันที่' },
        { id: 'aiLogs', type: 'textarea', rows: 12, label: 'AI Prompts ที่ใช้ (1 prompt ต่อบรรทัด)',
          placeholder: '1. Act as a marine biologist. Given...\n2. You are a UX copywriter...\n3. ...' },
        { id: 'factChecks', type: 'textarea', rows: 6, label: 'ตรวจสอบความถูกต้อง (Hallucination check) — กับใคร?' }
      ]
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────
// Course registry + helpers
// ─────────────────────────────────────────────────────────────────────

// All available courses live in Firestore; this constant is the offline fallback
// so the app works even if /courses/* is empty (first-time setup).
export const BUILTIN_COURSES = {
  'green-rayong': LEGACY_GREEN_RAYONG_COURSE,
};

// Merge a Firestore course doc with built-in fallback (Firestore wins per-field).
// Used by App.jsx when computing `currentCourse` from coursesAll subscription.
export const mergeCourse = (firestoreDoc, courseId = 'green-rayong') => {
  const fallback = BUILTIN_COURSES[courseId] || LEGACY_GREEN_RAYONG_COURSE;
  if (!firestoreDoc) return fallback;
  return {
    ...fallback,
    ...firestoreDoc,
    branding   : { ...fallback.branding,   ...(firestoreDoc.branding   || {}) },
    identities : firestoreDoc.identities?.length ? firestoreDoc.identities : fallback.identities,
    stages     : firestoreDoc.stages?.length     ? firestoreDoc.stages     : fallback.stages,
    rubric     : firestoreDoc.rubric?.length     ? firestoreDoc.rubric     : fallback.rubric,
    worksheets : firestoreDoc.worksheets?.length ? firestoreDoc.worksheets : fallback.worksheets,
    evaluatorWeights: { ...fallback.evaluatorWeights, ...(firestoreDoc.evaluatorWeights || {}) },
  };
};

// Extract a team's effective courses (decision #2: team can join multiple courses).
// Reads both team.courseIds (v2 canonical) and team.courseId / team.course_id (v1 compat).
export const getTeamCourseIds = (team) => {
  if (!team) return ['green-rayong'];
  if (Array.isArray(team.courseIds) && team.courseIds.length) return team.courseIds;
  if (team.courseId)  return [team.courseId];
  if (team.course_id) return [team.course_id];
  return ['green-rayong'];
};
