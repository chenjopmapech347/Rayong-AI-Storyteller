// src/App.jsx — Fully Restored ALL Main Headings & Steps (Light UI)
import { useState, useEffect, memo } from 'react';
import {
  Send,
  User,
  Users,
  LogOut,
  Zap,
  Cpu,
  Monitor,
  CheckCircle2,
  Activity,
  Save,
  Award,
  AlertCircle,
  Plus,
  Settings,
  Database,
  LayoutGrid,
  Inbox,
  Camera,
  LayoutDashboard,
  Target,
  Star,
  FileSpreadsheet,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import { COURSE_SEEDS } from './courseSeeds';
import {
  logout,
  getUsers,
  getRubrics,
  saveSubmission,
  seedFirebase,
  subscribeToStats,
  subscribeToFeed,
  subscribeToTeams,
  getTeamSubmissionData,
  adminUpdateTeam,
  adminDeleteTeam,
  adminCreateTeam,
  adminDeleteUser,
  adminCreateUser,
  adminUpdateUser,
  subscribeToGoodPrompts,
  saveGoodPrompt,
  deleteGoodPrompt,
  saveTeamScores,
  subscribeToTeamScores,
  getMyTeamScores,
  // Ethics / Moderation
  runEthicsAuditAll,
  subscribeToModerationFlags,
  setModerationFlagStatus,
  deleteModerationFlag,
  subscribeToAllSubmissions,
  // Phases + remote config + reset
  subscribeToPhases,
  createPhase,
  updatePhase,
  deletePhase,
  setPhaseState,
  seedDefaultPhasesIfEmpty,
  subscribeToAppConfig as subscribeToRemoteAppConfig,
  setAppConfig          as setRemoteAppConfig,
  resetAndSeedDemoData,
  // AI Audit
  aiAuditTeam,
  subscribeToAiAudits,
  aiFeedbackOnPrompt,
  // Peer evaluation (EVAL-MATRIX)
  subscribeToPeerScores,
  subscribeToTeamScoresRaw,
  // Multi-course (v2.0 Phase 2)
  subscribeToCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  cloneCourse,
  setDefaultCourse,
  seedLegacyGreenRayongCourse,
  // Phase 7: Worksheet submissions
  saveWorksheetSubmission,
  subscribeToWorksheetSubmissions
} from './api';

// Ethics category metadata (Thai labels + emojis) — mirrors api.js zt rules
const ETHICS_CATEGORIES = {
  privacy    : { label: 'ปกป้องข้อมูลส่วนบุคคล', emoji: '🔒', hint: 'เบอร์โทร, อีเมล, ที่อยู่ปราชญ์, Social ID' },
  fabrication: { label: 'แต่งเติมภูมิปัญญา',     emoji: '🤖', hint: 'AI disclaimer ไม่ลบ, AI-typical phrasing' },
  disrespect : { label: 'ไม่ให้เกียรติปราชญ์',   emoji: '🙏', hint: 'แก/มัน/กู/มึง, ลดทอนคุณค่าปราชญ์' },
  cultural   : { label: 'คำหยาบ / Stereotype',    emoji: '⚠️', hint: 'คำหยาบ, stereotype เชื้อชาติ/ภูมิภาค' },
  consent    : { label: 'การขออนุญาต',           emoji: '📋', hint: 'บันทึกสัมภาษณ์ยาวแต่ไม่มี consent statement' },
  ai_misuse  : { label: 'AI Misuse / Deepfake',  emoji: '🚨', hint: 'Deepfake, voice clone, สร้างปราชญ์ปลอม' },
};
const SEVERITY_META = {
  high  : { label: 'High',   color: '#dc2626', bg: '#fef2f2' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb' },
  low   : { label: 'Low',    color: '#0891b2', bg: '#ecfeff' },
};

// The five evaluation dimensions used in BOTH the Pitching Evaluator
// and the EVAL-MATRIX. Keep these in sync so scores entered in one
// place show up in the other.
// NOTE (v2.0): kept as global for backwards compatibility with all current
// hardcoded usages. New course-aware code should read from LEGACY_GREEN_RAYONG_COURSE.rubric.
const SCORE_DIMENSIONS = ['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'];

// ─────────────────────────────────────────────────────────────────────
// MULTI-COURSE FOUNDATION (v2.0) — Phase 1
// ─────────────────────────────────────────────────────────────────────
// All current Green Rayong behavior captured as a Course config.
// Future courses (Design Thinking + STEAM4Innovator, etc.) follow the same shape.
// Stored in Firestore at /courses/{courseId}; merged with this constant as fallback.
const LEGACY_GREEN_RAYONG_COURSE = {
  schemaVersion: 1,
  id: 'green-rayong',
  name: 'Green Rayong 4-Identities AI Storytellers',
  nameTH: 'Green Rayong 4-Identities AI Storytellers',
  methodology: ['4-Identities'],
  isDefault: true,
  // Branding (mirrors DEFAULT_BRANDING; kept here so course can override)
  branding: {
    brandName: 'Green Rayong',
    brandTagline: '4-Identities AI Storytellers',
    logoEmoji: '🌿',
    primaryColor: '#16a34a',
    secondaryColor: '#0ea5e9',
  },
  // 4 identities of Green Rayong
  identities: [
    { id: 'garden', label: 'สวน', emoji: '🌳', color: '#16a34a' },
    { id: 'forest', label: 'ป่า', emoji: '🌲', color: '#15803d' },
    { id: 'farm',   label: 'นา', emoji: '🌾', color: '#ca8a04' },
    { id: 'sea',    label: 'เล', emoji: '🌊', color: '#0ea5e9' },
  ],
  // Generic "stages" replaces the old phases/stages split (decision #5)
  // Order matters; corresponds to the existing 7-step Submission Gateway flow.
  stages: [
    { id: 'team-setup',     order: 1, label: 'ตั้งทีม',          emoji: '👥' },
    { id: 'mission-inbox',  order: 2, label: 'รับโจทย์',         emoji: '📥' },
    { id: 'collector',      order: 3, label: 'On-site Collector', emoji: '📸' },
    { id: 'gateway',        order: 4, label: 'Submission Gateway',emoji: '📤' },
    { id: 'evaluation',     order: 5, label: 'Evaluation',        emoji: '⭐' },
    { id: 'pitching',       order: 6, label: 'Pitching',          emoji: '🎤' },
    { id: 'portfolio',      order: 7, label: 'Portfolio (R6)',    emoji: '🏆' },
  ],
  // 5 dimensions — same as SCORE_DIMENSIONS but as objects so admin can extend
  rubric: SCORE_DIMENSIONS.map((dim, i) => ({
    dimensionId : dim.toLowerCase().replace(/\s+/g, '-'),
    label       : dim,
    weight      : [20, 20, 20, 20, 20][i],
    description : '',
  })),
  // Evaluator weights (5×5 Matrix · sum = 100)
  evaluatorWeights: { self: 10, peer: 15, teacher: 35, sage: 25, ai: 15 },
  // Worksheets: legacy course uses hardcoded forms (no schema-driven yet).
  // New courses will populate this array; renderer will switch on schema presence.
  worksheets: [],
};

// All available courses live in Firestore; this constant is the offline fallback
// so the app works even if /courses/* is empty (first-time setup).
const BUILTIN_COURSES = {
  'green-rayong': LEGACY_GREEN_RAYONG_COURSE,
};

// Helper: merge Firestore course doc with built-in fallback (Firestore wins per-field)
const mergeCourse = (firestoreDoc, courseId = 'green-rayong') => {
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

// Helper: extract a team's effective courses (decision #2: team can join multiple)
// Reads both team.courseIds (v2) and team.courseId (v1 single) and team.course_id (Firestore snake_case)
const getTeamCourseIds = (team) => {
  if (!team) return ['green-rayong'];
  if (Array.isArray(team.courseIds) && team.courseIds.length) return team.courseIds;
  if (team.courseId) return [team.courseId];
  if (team.course_id) return [team.course_id];
  return ['green-rayong'];
};

// ─────────────────────────────────────────────────────────────────────
// GENERIC FORM RENDERER (v2.0 Phase 4)
// Renders a worksheet schema → React form. Used in:
//  - Schema Editor preview (admin sees what students will see)
//  - Future Phase 6: actual student worksheet entry
// Supports 8 field types: text · textarea · number · date · select · radio · checkbox · list
// Defer to Phase 5+: image · drawing · table · matrix-2x2 · categorize · signature · audio
// ─────────────────────────────────────────────────────────────────────
const FIELD_TYPES = [
  { id: 'text',     label: 'Text (บรรทัดเดียว)' },
  { id: 'textarea', label: 'Textarea (หลายบรรทัด)' },
  { id: 'number',   label: 'Number' },
  { id: 'date',     label: 'Date' },
  { id: 'select',   label: 'Select (dropdown)' },
  { id: 'radio',    label: 'Radio (เลือก 1)' },
  { id: 'checkbox', label: 'Checkbox (boolean)' },
  { id: 'list',     label: 'List (repeating group)' },
  { id: 'image',    label: 'Image (เร็ว ๆ นี้)' },
  { id: 'drawing',  label: 'Drawing (เร็ว ๆ นี้)' },
  { id: 'table',    label: 'Table (เร็ว ๆ นี้)' },
];

const FieldRenderer = memo(function FieldRenderer({ field, value, onChange, disabled }) {
  const common = {
    style: { width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.875rem', fontFamily: 'inherit' },
    disabled
  };
  switch (field.type) {
    case 'text':
      return <input type="text" {...common} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} maxLength={field.maxLength} />;
    case 'textarea':
      return <textarea {...common} rows={field.rows || 4} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />;
    case 'number':
      return <input type="number" {...common} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))} min={field.min} max={field.max} step={field.step || 1} />;
    case 'date':
      return <input type="date" {...common} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'select':
      return (
        <select {...common} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">-- เลือก --</option>
          {(field.options || []).map(opt => {
            const v = typeof opt === 'string' ? opt : opt.value || opt.label;
            const l = typeof opt === 'string' ? opt : opt.label || opt.value;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      );
    case 'radio':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(field.options || []).map(opt => {
            const v = typeof opt === 'string' ? opt : opt.value || opt.label;
            const l = typeof opt === 'string' ? opt : opt.label || opt.value;
            return (
              <label key={v} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="radio" name={field.id} checked={value === v} onChange={() => onChange(v)} disabled={disabled} /> {l}
              </label>
            );
          })}
        </div>
      );
    case 'checkbox':
      return (
        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} disabled={disabled} /> {field.checkboxLabel || 'ใช่'}
        </label>
      );
    case 'list': {
      const items = Array.isArray(value) ? value : [];
      const itemSchema = field.itemSchema || [{ id: 'text', type: 'text', label: 'รายการ' }];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: 8, background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>#{idx + 1}</span>
                <button type="button" onClick={() => { const next = [...items]; next.splice(idx, 1); onChange(next); }} disabled={disabled} style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 4, cursor: 'pointer' }}>🗑</button>
              </div>
              {itemSchema.map(sub => (
                <div key={sub.id} style={{ marginTop: 4 }}>
                  <label style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>{sub.label || sub.id}</label>
                  <FieldRenderer field={sub} value={item?.[sub.id]} onChange={(v) => { const next = [...items]; next[idx] = { ...item, [sub.id]: v }; onChange(next); }} disabled={disabled} />
                </div>
              ))}
            </div>
          ))}
          <button type="button" onClick={() => onChange([...items, {}])} disabled={disabled || (field.maxItems && items.length >= field.maxItems)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', border: '1px dashed #0ea5e9', background: '#f0f9ff', color: '#0369a1', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' }}>+ เพิ่มรายการ</button>
          {field.minItems && items.length < field.minItems && <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>⚠ ต้องมีอย่างน้อย {field.minItems} รายการ</span>}
        </div>
      );
    }
    case 'image':
    case 'drawing':
    case 'table':
    case 'matrix-2x2':
    case 'categorize':
    case 'signature':
    case 'audio':
      return <div style={{ padding: '0.5rem', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 6, fontSize: '0.75rem', color: '#854d0e' }}>⏳ Field type <strong>{field.type}</strong> — รองรับใน Phase ถัดไป</div>;
    default:
      return <input type="text" {...common} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={`[${field.type} unknown]`} />;
  }
});

const GenericForm = memo(function GenericForm({ schema, value, onChange, disabled, showInstruction = true }) {
  if (!schema) return <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>ยังไม่มี schema</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showInstruction && schema.instructionTH && (
        <div style={{ padding: '0.6rem', background: '#eff6ff', borderRadius: 6, fontSize: '0.8rem', color: '#1e40af', borderLeft: '3px solid #0ea5e9' }}>
          💡 {schema.instructionTH}
        </div>
      )}
      {(schema.fields || []).map(field => (
        <div key={field.id}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
            {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
          </label>
          {field.description && <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 4 }}>{field.description}</p>}
          <FieldRenderer field={field} value={(value || {})[field.id]} onChange={(v) => onChange({ ...(value || {}), [field.id]: v })} disabled={disabled} />
        </div>
      ))}
    </div>
  );
});

// All evaluator roles we display in the matrix legend / cell badges.
const EVALUATOR_ROLES = ['self', 'peer', 'teacher', 'sage', 'ai'];

// Thai labels for rubric levels 1-4. Levels beyond 4 fall back to "ระดับที่ N".
const RUBRIC_LEVEL_LABELS = ['ปรับปรุง', 'พอใช้', 'ดี', 'ดีเยี่ยม'];

// ─────────────────────────────────────────────────────────────────────
// I18N — Minimal bilingual dictionary (TH default, EN switcher)
// Keys map to user-facing UI labels. App keeps Thai-first content,
// EN is for international showcase / Pitching judges who prefer English.
// ─────────────────────────────────────────────────────────────────────
const I18N = {
  th: {
    // Menu labels
    'Public View'         : 'มุมมองสาธารณะ',
    'Explorer UI'         : 'จัดการทีม',
    'Team Management'     : 'จัดการทีม',
    'Mission Inbox'       : 'รับโจทย์',
    'On-site Collector'   : 'เก็บข้อมูลภาคสนาม',
    'Submission Gateway'  : 'ส่งงาน',
    'Evaluation Hub'      : 'ศูนย์ประเมิน',
    'AI Audit Logbook'    : 'บันทึก AI',
    'Report (R6)'         : 'รายงาน (R6)',
    'Real-Time Dashboard' : 'แดชบอร์ดเรียลไทม์',
    'Mission Builder'     : 'สร้างโจทย์',
    'Pitching Evaluator'  : 'ประเมิน Pitching',
    'Report (R1-R6)'      : 'รายงาน (R1-R6)',
    'Reports R1-R6'       : 'รายงาน R1-R6',
    'Admin Panel'         : 'แผงผู้ดูแล',
    // Header / Generic
    'Logout'              : 'ออกจากระบบ',
    'Language'            : 'ภาษา',
    'Switch to English'   : 'เปลี่ยนเป็นอังกฤษ',
    'Switch to Thai'      : 'เปลี่ยนเป็นไทย',
    // Evaluator roles
    'eval_self'           : 'ประเมินตนเอง',
    'eval_peer'           : 'เพื่อนประเมิน',
    'eval_teacher'        : 'ครูประเมิน',
    'eval_sage'           : 'ปราชญ์ประเมิน',
    'eval_ai'             : 'AI ประเมิน',
    // Rubric levels
    'level_improve'       : 'ปรับปรุง',
    'level_fair'          : 'พอใช้',
    'level_medium'        : 'ปานกลาง',
    'level_good'          : 'ดี',
    'level_excellent'     : 'ดีเยี่ยม',
    // ── Admin sub-tabs ──
    'admin_sub_management': 'จัดการระบบ',
    'admin_sub_session'   : 'เซสชั่น',
    'admin_sub_moderation': 'ตรวจสอบจริยธรรม',
    'admin_sub_courses'   : 'จัดการหลักสูตร',
    'admin_sub_branding'  : 'ปรับแบรนด์',
    'admin_sub_settings'  : 'ตั้งค่า',
    'admin_sub_reports'   : 'รายงาน',
    // ── Real-Time Dashboard sub-tabs ──
    'dash_sub_live_feed'  : 'ฟีดสด',
    'dash_sub_teams'      : 'จัดการทีม',
    'dash_sub_prompts'    : 'คลัง Prompt ดี',
    'dash_sub_rubrics'    : 'การจัดการ Rubric Score',
    'dash_sub_matrix'     : 'การประเมินผล Matrix',
    // ── Teacher Reports sub-tabs (R1-R6) ──
    'report_R1'           : 'R1 สรุปคะแนน',
    'report_R2'           : 'R2 ไอเดียและ AI Prompt',
    'report_R3'           : 'R3 บูรณาการการเงิน',
    'report_R4'           : 'R4 ความคืบหน้ากิจกรรม',
    'report_R5'           : 'R5 สรุปรายบุคคล',
    'report_R6'           : 'R6 พอร์ตโฟลิโอ (สาธารณะ)',
    // ── Headers ──
    'header_admin'        : 'ผู้ดูแล',
    'header_assessor'     : 'ผู้ประเมิน',
    'header_report_center': 'ศูนย์รายงาน (R1-R6)',
    // ── Help / Manual ──
    'Help'                : 'คู่มือ',
    'help_print'          : '🖨️ พิมพ์ / Save PDF',
  },
  en: {
    // Menu labels (English — passthrough for menu names already in EN)
    'Public View'         : 'Public View',
    'Explorer UI'         : 'Team Management',
    'Team Management'     : 'Team Management',
    'Mission Inbox'       : 'Mission Inbox',
    'On-site Collector'   : 'On-site Collector',
    'Submission Gateway'  : 'Submission Gateway',
    'Evaluation Hub'      : 'Evaluation Hub',
    'AI Audit Logbook'    : 'AI Audit Logbook',
    'Report (R6)'         : 'Report (R6)',
    'Real-Time Dashboard' : 'Real-Time Dashboard',
    'Mission Builder'     : 'Mission Builder',
    'Pitching Evaluator'  : 'Pitching Evaluator',
    'Report (R1-R6)'      : 'Reports (R1-R6)',
    'Reports R1-R6'       : 'Reports R1-R6',
    'Admin Panel'         : 'Admin Panel',
    // Header / Generic
    'Logout'              : 'Logout',
    'Language'            : 'Language',
    'Switch to English'   : 'Switch to English',
    'Switch to Thai'      : 'Switch to Thai',
    // Evaluator roles
    'eval_self'           : 'Self-Evaluation',
    'eval_peer'           : 'Peer Evaluation',
    'eval_teacher'        : 'Teacher Evaluation',
    'eval_sage'           : 'Sage Evaluation',
    'eval_ai'             : 'AI Evaluation',
    // Rubric levels
    'level_improve'       : 'Needs Improvement',
    'level_fair'          : 'Fair',
    'level_medium'        : 'Medium',
    'level_good'          : 'Good',
    'level_excellent'     : 'Excellent',
    // ── Admin sub-tabs ──
    'admin_sub_management': 'Management',
    'admin_sub_session'   : 'Session',
    'admin_sub_moderation': 'Moderation',
    'admin_sub_courses'   : 'Courses',
    'admin_sub_branding'  : 'Branding',
    'admin_sub_settings'  : 'Settings',
    'admin_sub_reports'   : 'Reports',
    // ── Real-Time Dashboard sub-tabs ──
    'dash_sub_live_feed'  : 'Live Feed',
    'dash_sub_teams'      : 'Team Management',
    'dash_sub_prompts'    : 'Good Prompt Library',
    'dash_sub_rubrics'    : 'Rubric Score Management',
    'dash_sub_matrix'     : 'Evaluation Matrix',
    // ── Teacher Reports sub-tabs (R1-R6) ──
    'report_R1'           : 'R1 Score Summary',
    'report_R2'           : 'R2 Idea & AI Prompt',
    'report_R3'           : 'R3 Finance Integration',
    'report_R4'           : 'R4 Activity Progress',
    'report_R5'           : 'R5 Individual Summary',
    'report_R6'           : 'R6 Portfolio (Public)',
    // ── Headers ──
    'header_admin'        : 'Admin',
    'header_assessor'     : 'Assessor',
    'header_report_center': 'Report Center (R1-R6)',
    // ── Help / Manual ──
    'Help'                : 'Manual',
    'help_print'          : '🖨️ Print / Save PDF',
  },
};
// Look up TH first, fall back to EN, then return the raw key (safe default)
const makeT = (lang) => (k) => I18N[lang]?.[k] ?? I18N.th[k] ?? k;

// ─────────────────────────────────────────────────────────────────────
// BRANDING — White-label support recovered from production bundle
// Allows admin to rebrand the platform for different schools/provinces.
// ─────────────────────────────────────────────────────────────────────
const DEFAULT_BRANDING = {
  brandName     : 'Green Rayong',
  brandTagline  : '4-Identities AI Storytellers',
  logoEmoji     : '🌿',
  region        : 'ระยอง',
  province      : 'ระยอง',
  primaryColor  : '#16a34a',
  secondaryColor: '#0ea5e9',
  pitchName     : 'Green Rayong Challenge',
  schoolName    : '',
  footerText    : 'พัฒนาเพื่อการศึกษา IoT + ภูมิปัญญาท้องถิ่น',
};

const BRAND_PRESETS = [
  { name: 'Green Rayong (Default)', logoEmoji: '🌿', region: 'ระยอง',     province: 'ระยอง',     primaryColor: '#16a34a', secondaryColor: '#0ea5e9' },
  { name: 'Green Doi Saket',        logoEmoji: '🌲', region: 'ดอยสะเก็ด', province: 'เชียงใหม่', primaryColor: '#059669', secondaryColor: '#dc2626' },
  { name: 'Green Phuket',           logoEmoji: '🏝️', region: 'ภูเก็ต',     province: 'ภูเก็ต',     primaryColor: '#0891b2', secondaryColor: '#f59e0b' },
  { name: 'Green Ayutthaya',        logoEmoji: '🛕', region: 'อยุธยา',     province: 'อยุธยา',     primaryColor: '#a16207', secondaryColor: '#7c2d12' },
];

// Apply brand colors as CSS variables on :root so any component can use them
const applyBrandColors = (cfg) => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--brand-primary',   cfg.primaryColor   || DEFAULT_BRANDING.primaryColor);
  document.documentElement.style.setProperty('--brand-secondary', cfg.secondaryColor || DEFAULT_BRANDING.secondaryColor);
  if (cfg.brandName) document.title = `${cfg.brandName} · ${cfg.brandTagline || ''}`.trim();
};

const StatBox = memo(({ icon: Icon, value, label, colorClass }) => (
  <div className="ldt-stat">
    <div className={`ldt-logo-icon ${colorClass}`} style={{ width: '32px', height: '32px' }}>
      <Icon size={18} />
    </div>
    <div>
      <div className="ldt-stat-num">{value}</div>
      <div className="ldt-stat-lbl">{label}</div>
    </div>
  </div>
));

const RadarChart = memo(({ data, labels }) => {
  const size = 200;
  const center = size / 2;
  const radius = center - 40;
  const angleStep = (Math.PI * 2) / labels.length;

  const points = data.map((val, i) => {
    const r = (val / 5) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size}>
        {/* Grid Lines */}
        {gridLevels.map((lvl, idx) => (
          <polygon
            key={idx}
            points={labels.map((_, i) => {
              const r = lvl * radius;
              const angle = i * angleStep - Math.PI / 2;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {/* Axis */}
        {labels.map((lbl, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const lx = center + (radius + 20) * Math.cos(angle);
          const ly = center + (radius + 15) * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={lx} y={ly} fontSize="10" textAnchor="middle" fill="#64748b" dominantBaseline="middle">{lbl}</text>
            </g>
          );
        })}
        {/* Data Shape */}
        <polygon points={points} fill="rgba(29, 158, 117, 0.3)" stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
    </div>
  );
});

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('teacher-dashboard');
  const [adminSubTab, setAdminSubTab] = useState('management');
  const [reportType, setReportType] = useState('R1');

  // ─── i18n: Thai default, EN toggle for international showcase ───
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rep_lang') || 'th'; } catch { return 'th'; }
  });
  const t = makeT(lang);
  const toggleLang = () => {
    const next = lang === 'th' ? 'en' : 'th';
    setLang(next);
    try { localStorage.setItem('rep_lang', next); } catch {}
  };

  // ─── Cultural Ethics Audit (Moderation) — uses api.js Firestore backend ──
  // Note: `teams` is already declared further below; we add only ethics-specific state here.
  const [moderationFlags, setModerationFlags] = useState([]);
  const [allSubmissionsModeration, setAllSubmissionsModeration] = useState([]);
  const [flagFilterSeverity, setFlagFilterSeverity] = useState('all'); // all|high|medium|low
  const [flagFilterStatus, setFlagFilterStatus] = useState('pending'); // all|pending|approved|fixed|rejected
  const [flagFilterCategory, setFlagFilterCategory] = useState('all'); // all|<cat>
  const [auditRunning, setAuditRunning] = useState(false);
  useEffect(() => {
    const unsubFlags = subscribeToModerationFlags(setModerationFlags);
    const unsubSubs  = subscribeToAllSubmissions(setAllSubmissionsModeration);
    return () => { unsubFlags?.(); unsubSubs?.(); };
  }, []);
  const handleRunAudit = async () => {
    if (auditRunning) return;
    if (!teams?.length) { window.alert('ยังไม่มีทีมในระบบ — กรุณาสร้างทีมก่อน'); return; }
    setAuditRunning(true);
    try {
      const r = await runEthicsAuditAll(teams, allSubmissionsModeration);
      window.alert(`✅ Audit เสร็จสิ้น — สแกน ${r.teamsScanned} ทีม, พบ ${r.totalFound} flags`);
    } catch (e) {
      window.alert('❌ Audit ล้มเหลว: ' + (e?.message || e));
    } finally {
      setAuditRunning(false);
    }
  };

  // ─── Multi-Course management (v2.0 Phase 2) ───
  const [coursesAll, setCoursesAll] = useState([]);
  const [coursesSeeded, setCoursesSeeded] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({
    id: '', name: '', methodology: 'DesignThinking', primaryColor: '#16a34a', secondaryColor: '#0ea5e9', logoEmoji: '🌿'
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editCourseDraft, setEditCourseDraft] = useState(null);
  useEffect(() => {
    const unsub = subscribeToCourses((rows) => {
      setCoursesAll(rows);
      // Auto-seed Green Rayong on first ever admin visit if collection is empty
      if (rows.length === 0 && !coursesSeeded) {
        setCoursesSeeded(true);
        seedLegacyGreenRayongCourse(LEGACY_GREEN_RAYONG_COURSE).catch(() => {});
      }
    });
    return () => unsub?.();
  // eslint-disable-next-line
  }, []);

  // ─── Active Course (v2.0 Phase 7) — drives student worksheet UI + Pitching rubric ───
  const [currentCourseId, setCurrentCourseId] = useState(() => {
    try { return localStorage.getItem('rep_active_course') || 'green-rayong'; } catch { return 'green-rayong'; }
  });
  const [selectedWorksheetId, setSelectedWorksheetId] = useState(null);
  const [worksheetSubmissions, setWorksheetSubmissions] = useState([]);
  const [worksheetFormDraft, setWorksheetFormDraft] = useState({});
  const [worksheetSaving, setWorksheetSaving] = useState(false);
  const switchCourse = (id) => {
    setCurrentCourseId(id);
    try { localStorage.setItem('rep_active_course', id); } catch {}
    setSelectedWorksheetId(null); // close any open worksheet when switching
  };
  // Resolved current course object (Firestore doc merged with built-in fallback)
  const currentCourse = (function getCurrentCourse() {
    if (!coursesAll || coursesAll.length === 0) return LEGACY_GREEN_RAYONG_COURSE;
    const found = coursesAll.find(c => c && c.id === currentCourseId);
    return found ? mergeCourse(found, currentCourseId) : (BUILTIN_COURSES[currentCourseId] || LEGACY_GREEN_RAYONG_COURSE);
  })();
  // Note: auto-pick by team intentionally removed — caused TDZ error
  // (teams is declared further below). User can manually switch via the
  // Course Switcher dropdown in the header. If they want auto-pick later,
  // we can move the teams useState above this block.

  // ─── Worksheet Submissions for active (team, course) (v2.0 Phase 7) ───
  const myTeamIdForWorksheets = user?.team_id || user?.teamId || null;
  useEffect(() => {
    if (!myTeamIdForWorksheets || !currentCourseId) return;
    const unsub = subscribeToWorksheetSubmissions(myTeamIdForWorksheets, currentCourseId, setWorksheetSubmissions);
    return () => unsub?.();
  }, [myTeamIdForWorksheets, currentCourseId]);
  // Load saved draft when selecting a worksheet
  useEffect(() => {
    if (!selectedWorksheetId) { setWorksheetFormDraft({}); return; }
    const existing = worksheetSubmissions.find(s => s.worksheet_id === selectedWorksheetId);
    setWorksheetFormDraft(existing?.content || {});
  }, [selectedWorksheetId, worksheetSubmissions]);
  const saveCurrentWorksheet = async () => {
    if (!myTeamIdForWorksheets || !currentCourseId || !selectedWorksheetId) return;
    setWorksheetSaving(true);
    try {
      await saveWorksheetSubmission(myTeamIdForWorksheets, currentCourseId, selectedWorksheetId, worksheetFormDraft);
      window.alert('✅ บันทึก Worksheet สำเร็จ');
    } catch (e) { window.alert('❌ ' + (e?.message || e)); }
    finally { setWorksheetSaving(false); }
  };

  // Import a pre-defined seed course (e.g. Design Thinking + S4I) — Phase 6
  const handleImportSeedCourse = async (seedId) => {
    const seed = COURSE_SEEDS[seedId];
    if (!seed) { window.alert('Seed not found: ' + seedId); return; }
    // Check if already imported
    if (coursesAll.find(c => c.id === seedId)) {
      if (!window.confirm(`หลักสูตร "${seed.name}" มีอยู่แล้ว — Override ของเดิม?`)) return;
      try {
        await updateCourse(seedId, { ...seed, updated_at: new Date().toISOString() });
        window.alert(`✅ Override สำเร็จ — ${seed.worksheets.length} worksheets`);
      } catch (e) { window.alert('❌ ' + (e?.message || e)); }
    } else {
      try {
        await createCourse(seedId, seed);
        window.alert(`✅ Import สำเร็จ — ${seed.name} (${seed.worksheets.length} worksheets)`);
      } catch (e) { window.alert('❌ ' + (e?.message || e)); }
    }
  };

  const handleCreateCourse = async () => {
    const { id, name } = newCourseForm;
    if (!id || !name) { window.alert('กรุณากรอก Course ID + ชื่อหลักสูตร'); return; }
    if (!/^[a-z0-9-]{3,40}$/.test(id)) { window.alert('Course ID ใช้ a-z, 0-9, ขีดกลาง เท่านั้น (3-40 ตัวอักษร)'); return; }
    try {
      await createCourse(id, {
        name: newCourseForm.name,
        nameTH: newCourseForm.name,
        methodology: [newCourseForm.methodology],
        isDefault: false,
        branding: {
          brandName: newCourseForm.name,
          brandTagline: newCourseForm.methodology + ' Learning',
          logoEmoji: newCourseForm.logoEmoji,
          primaryColor: newCourseForm.primaryColor,
          secondaryColor: newCourseForm.secondaryColor,
        },
        identities: [],
        stages: LEGACY_GREEN_RAYONG_COURSE.stages,
        rubric: LEGACY_GREEN_RAYONG_COURSE.rubric,
        evaluatorWeights: LEGACY_GREEN_RAYONG_COURSE.evaluatorWeights,
        worksheets: [],
      });
      setNewCourseForm({ id: '', name: '', methodology: 'DesignThinking', primaryColor: '#16a34a', secondaryColor: '#0ea5e9', logoEmoji: '🌿' });
      window.alert('✅ สร้างหลักสูตรสำเร็จ');
    } catch (e) {
      window.alert('❌ สร้างไม่สำเร็จ: ' + (e?.message || e));
    }
  };
  const handleCloneCourse = async (sourceId) => {
    const newId = window.prompt('ตั้งชื่อ Course ID ใหม่ (a-z, 0-9, ขีดกลาง):', sourceId + '-copy');
    if (!newId) return;
    try {
      await cloneCourse(sourceId, newId);
      window.alert('✅ Clone สำเร็จ — เปิดแก้ไขใน list ด้านล่าง');
    } catch (e) { window.alert('❌ Clone ล้มเหลว: ' + (e?.message || e)); }
  };
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(`⚠️ ลบหลักสูตร "${courseId}"? ทีมและคะแนนที่ผูกกับหลักสูตรนี้ยังอยู่ในระบบ (ไม่ถูกลบ)`)) return;
    try { await deleteCourse(courseId); }
    catch (e) { window.alert('❌ ลบไม่ได้: ' + (e?.message || e)); }
  };
  const handleSetDefault = async (courseId) => {
    if (!window.confirm(`ตั้ง "${courseId}" เป็นหลักสูตรเริ่มต้น? (ทีมใหม่จะใช้หลักสูตรนี้)`)) return;
    try { await setDefaultCourse(courseId); window.alert('✅ ตั้งเป็นหลักสูตรเริ่มต้นแล้ว'); }
    catch (e) { window.alert('❌ ' + (e?.message || e)); }
  };
  const startEditCourse = (course) => {
    setEditingCourseId(course.id);
    setEditCourseDraft({
      name: course.name || '',
      methodology: Array.isArray(course.methodology) ? course.methodology[0] : (course.methodology || 'DesignThinking'),
      primaryColor: course.branding?.primaryColor || '#16a34a',
      secondaryColor: course.branding?.secondaryColor || '#0ea5e9',
      logoEmoji: course.branding?.logoEmoji || '🌿',
    });
  };
  const saveEditCourse = async () => {
    if (!editingCourseId || !editCourseDraft) return;
    try {
      await updateCourse(editingCourseId, {
        name: editCourseDraft.name,
        methodology: [editCourseDraft.methodology],
        branding: {
          brandName: editCourseDraft.name,
          brandTagline: editCourseDraft.methodology + ' Learning',
          logoEmoji: editCourseDraft.logoEmoji,
          primaryColor: editCourseDraft.primaryColor,
          secondaryColor: editCourseDraft.secondaryColor,
        }
      });
      setEditingCourseId(null);
      setEditCourseDraft(null);
      window.alert('✅ บันทึกการแก้ไขแล้ว');
    } catch (e) { window.alert('❌ ' + (e?.message || e)); }
  };

  // ─── Worksheet Schema Editor (v2.0 Phase 3) ───
  const [editingWorksheetsCourseId, setEditingWorksheetsCourseId] = useState(null);
  const [worksheetsDraft, setWorksheetsDraft] = useState([]);
  const [previewWorksheetIdx, setPreviewWorksheetIdx] = useState(null);
  const [previewFormValue, setPreviewFormValue] = useState({});
  const openWorksheetsEditor = (course) => {
    setEditingWorksheetsCourseId(course.id);
    setWorksheetsDraft(Array.isArray(course.worksheets) ? course.worksheets : []);
    setPreviewWorksheetIdx(null);
  };
  const closeWorksheetsEditor = () => {
    setEditingWorksheetsCourseId(null);
    setWorksheetsDraft([]);
    setPreviewWorksheetIdx(null);
    setPreviewFormValue({});
  };
  const addWorksheet = () => {
    const newIdx = worksheetsDraft.length;
    setWorksheetsDraft([...worksheetsDraft, {
      id: `WS-${newIdx + 1}`,
      label: `Worksheet ${newIdx + 1}`,
      labelTH: `ใบงาน ${newIdx + 1}`,
      icon: '📝',
      stageId: 'stage-empathize',
      order: newIdx + 1,
      instructionTH: '',
      fields: [
        { id: 'team', type: 'text', label: 'ชื่อทีม', required: true },
        { id: 'date', type: 'date', label: 'วันที่', required: true }
      ]
    }]);
  };
  const updateWorksheet = (idx, patch) => {
    const next = [...worksheetsDraft];
    next[idx] = { ...next[idx], ...patch };
    setWorksheetsDraft(next);
  };
  const removeWorksheet = (idx) => {
    if (!window.confirm(`ลบ Worksheet "${worksheetsDraft[idx].labelTH || worksheetsDraft[idx].label}"?`)) return;
    setWorksheetsDraft(worksheetsDraft.filter((_, i) => i !== idx));
    if (previewWorksheetIdx === idx) setPreviewWorksheetIdx(null);
  };
  const moveWorksheet = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= worksheetsDraft.length) return;
    const next = [...worksheetsDraft];
    [next[idx], next[target]] = [next[target], next[idx]];
    setWorksheetsDraft(next.map((w, i) => ({ ...w, order: i + 1 })));
  };
  const addField = (wsIdx) => {
    const ws = worksheetsDraft[wsIdx];
    const nextFieldId = `field_${(ws.fields?.length || 0) + 1}`;
    updateWorksheet(wsIdx, { fields: [...(ws.fields || []), { id: nextFieldId, type: 'text', label: 'Field ใหม่' }] });
  };
  const updateField = (wsIdx, fieldIdx, patch) => {
    const ws = worksheetsDraft[wsIdx];
    const fields = [...(ws.fields || [])];
    fields[fieldIdx] = { ...fields[fieldIdx], ...patch };
    updateWorksheet(wsIdx, { fields });
  };
  const removeField = (wsIdx, fieldIdx) => {
    const ws = worksheetsDraft[wsIdx];
    if (!window.confirm(`ลบ field "${ws.fields[fieldIdx].label}"?`)) return;
    updateWorksheet(wsIdx, { fields: ws.fields.filter((_, i) => i !== fieldIdx) });
  };
  const moveField = (wsIdx, fieldIdx, dir) => {
    const ws = worksheetsDraft[wsIdx];
    const fields = [...(ws.fields || [])];
    const target = fieldIdx + dir;
    if (target < 0 || target >= fields.length) return;
    [fields[fieldIdx], fields[target]] = [fields[target], fields[fieldIdx]];
    updateWorksheet(wsIdx, { fields });
  };
  const saveWorksheetsToFirestore = async () => {
    if (!editingWorksheetsCourseId) return;
    try {
      await updateCourse(editingWorksheetsCourseId, { worksheets: worksheetsDraft });
      window.alert(`✅ บันทึก ${worksheetsDraft.length} worksheets แล้ว`);
      closeWorksheetsEditor();
    } catch (e) { window.alert('❌ ' + (e?.message || e)); }
  };

  // ─── Phase / Session manager (Activity Phases CRUD) ───
  const [phases, setPhases] = useState([]);
  const [newPhaseLabel, setNewPhaseLabel] = useState('');
  const [newPhaseDeadline, setNewPhaseDeadline] = useState('');
  useEffect(() => {
    const unsub = subscribeToPhases(setPhases);
    // Auto-seed default phases if collection is empty (only runs once)
    seedDefaultPhasesIfEmpty().catch(() => {});
    return () => unsub?.();
  }, []);
  const addPhase = async () => {
    if (!newPhaseLabel.trim()) return;
    const nextOrder = (phases[phases.length - 1]?.order || 0) + 1;
    await createPhase({ label: newPhaseLabel.trim(), order: nextOrder, open: true, deadline: newPhaseDeadline || null });
    setNewPhaseLabel('');
    setNewPhaseDeadline('');
  };
  const movePhase = async (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= phases.length) return;
    const a = phases[idx], b = phases[target];
    await updatePhase(a.id, { order: b.order ?? target });
    await updatePhase(b.id, { order: a.order ?? idx });
  };
  const editPhase = async (id, label) => {
    const next = window.prompt('แก้ไขชื่อ Phase:', label);
    if (next == null) return;
    if (next.trim()) await updatePhase(id, { label: next.trim() });
  };
  const removePhase = async (id, label) => {
    if (window.confirm(`ลบ Phase "${label}"?`)) await deletePhase(id);
  };

  // ─── Remote App Config (shared across all devices via Firestore) ───
  // Currently used for: Looker Studio Embed URL, Claude API proxy URL
  const [remoteConfig, setRemoteConfig] = useState({});
  const [lookerUrlDraft, setLookerUrlDraft] = useState('');
  const [claudeKeyDraft, setClaudeKeyDraft] = useState(() => {
    try { return localStorage.getItem('eco_anthropic_key') || ''; } catch { return ''; }
  });
  const [claudeProxyDraft, setClaudeProxyDraft] = useState('');
  useEffect(() => {
    const unsub = subscribeToRemoteAppConfig((cfg) => {
      setRemoteConfig(cfg || {});
      if (cfg?.looker_url) setLookerUrlDraft(cfg.looker_url);
      if (cfg?.claude_proxy) setClaudeProxyDraft(cfg.claude_proxy);
    });
    return () => unsub?.();
  }, []);
  const saveLookerUrl = async () => {
    await setRemoteAppConfig({ looker_url: lookerUrlDraft.trim() });
    window.alert('💾 บันทึก Looker Studio URL แล้ว — ทุก device เห็นทันที');
  };
  const saveClaudeConfig = async () => {
    // API key stored locally per-browser (security); proxy URL shared via Firestore
    try { localStorage.setItem('eco_anthropic_key', claudeKeyDraft.trim()); } catch {}
    await setRemoteAppConfig({ claude_proxy: claudeProxyDraft.trim() });
    window.alert('💾 บันทึก AI Config สำเร็จ');
  };

  // ─── Backup / Export / Reset Demo ───
  const [resetting, setResetting] = useState(false);
  const downloadBackup = async () => {
    try {
      // Combine current local snapshots into one JSON
      const backup = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        teams: teams || [],
        submissions: allSubmissionsModeration || [],
        moderation_flags: moderationFlags || [],
        phases: phases || [],
        config: remoteConfig || {},
        branding: appConfig
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rep-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { window.alert('Backup failed: ' + (e?.message || e)); }
  };
  // ─── Pitching Evaluator EVAL-MATRIX (5×5: evaluators × dimensions) ───
  const [peerScoresAll, setPeerScoresAll] = useState([]);
  const [teamScoresRaw, setTeamScoresRaw] = useState([]);
  useEffect(() => {
    const u1 = subscribeToPeerScores(setPeerScoresAll);
    const u2 = subscribeToTeamScoresRaw(setTeamScoresRaw);
    return () => { u1?.(); u2?.(); };
  }, []);
  // Helper: get all scores for a (team, evaluatorRole, dimension) combination → returns numeric avg or null
  const matrixCell = (teamId, role, dim) => {
    if (teamId == null) return null;
    const tid = String(teamId);
    let vals = [];
    if (role === 'peer') {
      vals = (peerScoresAll || []).filter(p => p && String(p.target_team_id) === tid && p.dimension === dim).map(p => Number(p.score)).filter(v => !isNaN(v));
    } else if (role === 'ai') {
      const audit = (aiAudits || []).find(a => a && String(a.team_id) === tid);
      if (audit?.ai_score && audit.ai_score[dim] != null) return Number(audit.ai_score[dim]);
      return null;
    } else {
      vals = (teamScoresRaw || []).filter(s => s && String(s.team_id) === tid && s.dimension === dim && (s.evaluator_role === role || (role === 'teacher' && (s.evaluator_role === 'facilitator' || s.evaluator_role === 'admin')) || (role === 'self' && s.evaluator_role === 'student'))).map(s => Number(s.score)).filter(v => !isNaN(v));
    }
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  const matrixRowAvg = (teamId, role) => {
    const cells = SCORE_DIMENSIONS.map(d => matrixCell(teamId, role, d)).filter(v => v != null);
    if (!cells.length) return null;
    return cells.reduce((a, b) => a + b, 0) / cells.length;
  };
  const matrixColAvg = (teamId, dim) => {
    const cells = EVALUATOR_ROLES.map(r => matrixCell(teamId, r, dim)).filter(v => v != null);
    if (!cells.length) return null;
    return cells.reduce((a, b) => a + b, 0) / cells.length;
  };
  const matrixOverall = (teamId) => {
    const cells = EVALUATOR_ROLES.flatMap(r => SCORE_DIMENSIONS.map(d => matrixCell(teamId, r, d))).filter(v => v != null);
    if (!cells.length) return null;
    return cells.reduce((a, b) => a + b, 0) / cells.length;
  };
  // Heatmap color based on score 0-5
  const cellColor = (v) => {
    if (v == null) return { bg: 'transparent', fg: '#94a3b8' };
    if (v >= 4.0) return { bg: '#dcfce7', fg: '#166534' }; // green
    if (v >= 3.0) return { bg: '#fef9c3', fg: '#854d0e' }; // yellow
    if (v >= 2.0) return { bg: '#ffedd5', fg: '#9a3412' }; // orange
    return                { bg: '#fee2e2', fg: '#991b1b' }; // red
  };

  // ─── AI Audit Logbook (full integration) ───
  const [aiAudits, setAiAudits] = useState([]);
  const [selectedAuditTeam, setSelectedAuditTeam] = useState('');
  const [auditingAi, setAuditingAi] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState(null);
  const [promptToTest, setPromptToTest] = useState('');
  const [promptTesting, setPromptTesting] = useState(false);
  const [promptFeedback, setPromptFeedback] = useState(null);
  useEffect(() => {
    const unsub = subscribeToAiAudits(setAiAudits);
    return () => unsub?.();
  }, []);
  const runAiAuditOnTeam = async () => {
    if (!selectedAuditTeam) { window.alert('กรุณาเลือกทีมก่อน'); return; }
    setAuditingAi(true);
    setLastAuditResult(null);
    try {
      const team = teams.find(t => String(t.id) === String(selectedAuditTeam));
      // Aggregate team's content from all known submission steps
      const teamSubs = (allSubmissionsModeration || []).filter(s => String(s.team_id) === String(selectedAuditTeam));
      const collector = teamSubs.find(s => s.step === 'collector')?.content || {};
      const gateway   = teamSubs.find(s => s.step === 'gateway')?.content   || {};
      const mission   = teamSubs.find(s => s.step === 'mission-inbox')?.content || {};
      const payload = {
        teamName    : team?.name || selectedAuditTeam,
        iotModule   : mission.iotModule || '',
        product     : mission.product || '',
        selectedIdea: gateway.selectedIdea || '',
        strengths   : gateway.strengths || '',
        wisdom      : gateway.wisdom || gateway.traditionalWisdom || '',
        interview   : collector.interview || '',
        cost        : gateway.bmcCost || '',
        price       : gateway.bmcPrice || '',
        customer    : gateway.bmcCustomer || '',
        aiLogs      : gateway.aiLogs || ''
      };
      const result = await aiAuditTeam(selectedAuditTeam, payload);
      setLastAuditResult({ team_name: payload.teamName, ...result });
      window.alert('✅ AI Audit เสร็จสิ้น');
    } catch (e) {
      window.alert('❌ Audit ล้มเหลว: ' + (e?.message || e));
    } finally {
      setAuditingAi(false);
    }
  };
  const testPromptFeedback = async () => {
    if (!promptToTest.trim()) return;
    setPromptTesting(true);
    setPromptFeedback(null);
    try {
      const fb = await aiFeedbackOnPrompt(promptToTest.trim());
      setPromptFeedback(fb);
    } catch (e) {
      setPromptFeedback({ error: e?.message || String(e) });
    } finally {
      setPromptTesting(false);
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('⚠️ ลบข้อมูลทั้งหมดและสร้าง demo data ใหม่? (ไม่สามารถ undo ได้)')) return;
    setResetting(true);
    try {
      const r = await resetAndSeedDemoData();
      window.alert('✅ Reset & Seed สำเร็จ — รีโหลดหน้าเพื่อเห็นข้อมูลใหม่');
    } catch (e) { window.alert('Reset ล้มเหลว: ' + (e?.message || e)); }
    finally { setResetting(false); }
  };

  // ─── White-label Branding (admin can rebrand for any school/province) ───
  const [appConfig, setAppConfig] = useState(() => {
    try {
      const raw = localStorage.getItem('rep_branding');
      return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : { ...DEFAULT_BRANDING };
    } catch { return { ...DEFAULT_BRANDING }; }
  });
  // Apply colors + document title whenever branding changes
  useEffect(() => { applyBrandColors(appConfig); }, [appConfig]);
  const saveBranding = (next) => {
    setAppConfig(next);
    try { localStorage.setItem('rep_branding', JSON.stringify(next)); } catch {}
  };
  const resetBranding = () => {
    if (!window.confirm('Reset เป็น Brand Default (Green Rayong)?')) return;
    saveBranding({ ...DEFAULT_BRANDING });
  };
  const applyPreset = (p) => {
    saveBranding({
      ...appConfig,
      brandName     : p.name,
      logoEmoji     : p.logoEmoji,
      region        : p.region,
      province      : p.province,
      primaryColor  : p.primaryColor,
      secondaryColor: p.secondaryColor,
      pitchName     : `${p.name} Challenge`,
    });
  };
  
  // App Stats
  const [stats, setStats] = useState({ totalTeams: 0, submitted: 0, pending: 0, aiPrompts: 0 });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  // --- Student Form States ---
  const [teamInfo, setTeamInfo] = useState({ name: '', members: '', photo: '' });
  const [missionData, setMissionData] = useState({ module: '', product: '', reason: '' });
  const [collectorData, setCollectorData] = useState({ 
    interview: 'สัมภาษณ์ปราชญ์ชาวบ้าน: ลุงบุญมี เล่าว่าแต่ก่อนพื้นที่นี้เคยเป็นป่าชายเลนที่อุดมสมบูรณ์ ปัจจุบันเริ่มมีปัญหาขยะ...\n(จำลองข้อมูลถูกบันทึกแบบ Offline ไว้ในเครื่องแล้ว)', 
    sagePhoto: '' 
  });
  const [gatewayData, setGatewayData] = useState({
    wisdom: '', environment: '', brainstorm: '', prototype: '', videoUrl: '', bmc: '', aiLogs: ''
  });

  // --- Mock Data for Testing ---
  const [missionStatus] = useState({ status: 'Rejected', feedback: 'ไอเดียผลิตภัณฑ์ยังไม่ชัดเจน ขอให้เน้นเรื่องการใช้วัสดุจากธรรมชาติในท้องถิ่นเพิ่มเติมครับ' });
  const [showEvalForm, setShowEvalForm] = useState(null); // 'self' or 'peer'
  const mockTeammates = [{ id: 'u2', name: 'สมชาย รักดี' }, { id: 'u3', name: 'สมหญิง รักโลก' }];
  const mockReportData = [
    { team: 'Team Alpha', self: 8.5, peer: 12, teacher: 30, sage: 28, ai: 9, total: 87.5 },
    { team: 'Team Beta', self: 9.0, peer: 14, teacher: 32, sage: 25, ai: 8, total: 88.0 },
    { team: 'Team Gamma', self: 7.5, peer: 10, teacher: 28, sage: 20, ai: 7, total: 72.5 },
  ];

  // --- Teacher / Assessor States ---
  const [missionConfig, setMissionConfig] = useState({ name: '', rubric: '', deadline: '' });
  // evalScore is keyed by `${teamId}-${dimension}` so each team keeps its own scores.
  const [evalScore, setEvalScore] = useState({});
  const [evalComment, setEvalComment] = useState('');
  // Aggregated team scores from /api/team-scores — drives the EVAL-MATRIX.
  const [teamScores, setTeamScores] = useState([]);

  // Data
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]); 
  const [goodPrompts, setGoodPrompts] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState(null);
  const [rubrics, setRubrics] = useState([]);
  const [assessorSubTab, setAssessorSubTab] = useState('teams');
  const [appError, setAppError] = useState(null);

  // --- Admin Editing States ---
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'student', teamId: '' });
  const [newTeam, setNewTeam] = useState({ name: '', teacherId: '' });

  useEffect(() => {
    const saved = localStorage.getItem('eco_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      // Pick a default tab that the user's role actually has
      if (u?.role === 'student')      setActiveTab('team-setup');
      else if (u?.role === 'sage')    setActiveTab('pitch-evaluator');
      else if (u?.role === 'admin')   setActiveTab('admin');
      else                            setActiveTab('teacher-dashboard');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setAppError(null);
    
    // 1. Subscribe to Real-Time Stats (Public)
    const unsubStats = subscribeToStats((s) => setStats(s));
    
    // 2. Subscribe to Live Feed (Public)
    const unsubFeed = subscribeToFeed((f) => setFeed(f));
    
    // 3. Subscribe to Teams List (Public)
    const unsubTeams = subscribeToTeams((t) => setTeams(t));

    // 4. Subscribe to Good Prompts (Public)
    const unsubPrompts = subscribeToGoodPrompts((p) => setGoodPrompts(p));

    // 5. Subscribe to aggregated team scores (drives the EVAL-MATRIX)
    const unsubTeamScores = subscribeToTeamScores((s) => setTeamScores(s));

    // 5. Fetch static data (Rubrics are public, Users are admin only)
    const loadStatic = async () => {
      try {
        const r = await getRubrics().catch(() => []);
        setRubrics(r);
        if (user?.role === 'admin') {
          const u = await getUsers().catch(() => []);
          setUsers(u);
        }
      } catch (err) { console.error("Fetch static failed", err); }
    };
    loadStatic();

    return () => {
      unsubStats();
      unsubFeed();
      unsubTeams();
      unsubPrompts();
      unsubTeamScores();
    };
  }, [user?.role]); // Re-run if role changes (e.g. login/logout)

  // Effect to load selected team's data when changed
  useEffect(() => {
    if (selectedTeam) {
      getTeamSubmissionData(selectedTeam.id).then(setSelectedTeamData);
      // Pre-fill the Pitching Evaluator with my previous scores for this team.
      if (user) {
        getMyTeamScores(selectedTeam.id)
          .then(rows => {
            setEvalScore(prev => {
              const next = { ...prev };
              rows.forEach(r => { next[`${selectedTeam.id}-${r.dimension}`] = r.score; });
              return next;
            });
            const lastComment = rows.find(r => r.comment)?.comment || '';
            setEvalComment(lastComment);
          })
          .catch(() => {/* ignore — fresh scoring is fine */});
      }
    } else {
      setSelectedTeamData(null);
      setEvalComment('');
    }
  }, [selectedTeam, user]);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleSave = async (tabName, data) => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
      return;
    }
    try {
      await saveSubmission({
        teamId: user.teamId || user.team_id || 'demo_team',
        step:   tabName,
        content: typeof data === 'string' ? data : JSON.stringify(data)
      });
      alert('บันทึกข้อมูลสำเร็จ');
    } catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>กำลังเข้าสู่ระบบ...</div>;
  if (showLogin && !user) {
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowLogin(false)} className="login-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: '#64748b' }}>ยกเลิก / กลับไปดู Dashboard</button>
        <LoginPage onLogin={(u) => { setUser(u); setShowLogin(false); }} />
      </div>
    );
  }
  // Note: We don't block here anymore to allow public dashboard view

  const safeStats = stats || { totalTeams: 0, submitted: 0, pending: 0, aiPrompts: 0 };

  return (
    <div className="app-layout">
      {appError && (
        <div style={{ background: '#fffbeb', color: '#92400e', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', borderBottom: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 1000, position: 'relative' }}>
          <AlertCircle size={16} /> {appError}
          <button onClick={() => window.location.reload()} style={{ background: '#92400e', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>ลองใหม่</button>
        </div>
      )}

      <header className="live-dashboard-top">
        <div className="ldt-header">
          <div className="ldt-title-wrap">
            <div className="ldt-logo-icon" style={{ background: appConfig.primaryColor }}>
               <span style={{ fontSize: 18 }}>{appConfig.logoEmoji || '🌿'}</span>
            </div>
            <div>
              <div className="ldt-title" style={{ color: appConfig.primaryColor }}>{appConfig.brandName}: {!user ? (lang === 'th' ? 'มุมมองสาธารณะ' : 'Public Dashboard') : (user.role === 'student' ? (lang === 'th' ? 'จัดการทีม' : 'Explorer UI') : (lang === 'th' ? 'แดชบอร์ดผู้ประเมิน' : 'Assessor UI'))}</div>
              <div className="ldt-sub">{appConfig.brandTagline} | {!user ? (lang === 'th' ? 'โหมดบุคคลทั่วไป' : 'Public Mode') : (lang === 'th' ? `ระบบนิเวศการเรียนรู้ ${user.role === 'student' ? 'นักเรียน' : 'ครู/Facilitator'}` : `Learning Ecosystem · ${user.role === 'student' ? 'Student' : 'Teacher/Facilitator'}`)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             {/* ─── Course Switcher (v2.0 Phase 7) — only when ≥ 2 courses ─── */}
             {user && coursesAll.length > 1 && (
                <div className="card" style={{ padding: '0.3rem 0.5rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }} title="เลือกหลักสูตรที่กำลังใช้งาน">
                   <span style={{ fontSize: '1rem' }}>{currentCourse.branding?.logoEmoji || '📚'}</span>
                   <select value={currentCourseId} onChange={e => switchCourse(e.target.value)} style={{ padding: '0.2rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.75rem', background: '#fff', cursor: 'pointer', maxWidth: 240 }}>
                      {coursesAll.map(c => <option key={c.id} value={c.id}>{c.name || c.id}{c.isDefault ? ' ⭐' : ''}</option>)}
                   </select>
                </div>
             )}
             {/* ─── Inline TH/EN language toggle (always visible) ─── */}
             <div className="card" style={{ padding: '0.3rem 0.5rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button onClick={() => { if (lang !== 'th') toggleLang(); }} title="ภาษาไทย"
                   style={{ background: lang === 'th' ? appConfig.primaryColor : 'transparent', color: lang === 'th' ? '#fff' : '#475569', border: 'none', padding: '0.25rem 0.6rem', borderRadius: 4, cursor: 'pointer', fontWeight: lang === 'th' ? 700 : 500, fontSize: '0.75rem' }}>
                   Thai <strong>TH</strong>
                </button>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <button onClick={() => { if (lang !== 'en') toggleLang(); }} title="English"
                   style={{ background: lang === 'en' ? appConfig.secondaryColor : 'transparent', color: lang === 'en' ? '#fff' : '#475569', border: 'none', padding: '0.25rem 0.6rem', borderRadius: 4, cursor: 'pointer', fontWeight: lang === 'en' ? 700 : 500, fontSize: '0.75rem' }}>
                   English <strong>EN</strong>
                </button>
             </div>
             {user ? (
               <>
                 <div className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} /> {user.name} ({user.role})
                 </div>
                 <button onClick={handleLogout} className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', cursor: 'pointer' }}>
                    <LogOut size={14} /> {t('Logout')}
                 </button>
               </>
             ) : (
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <div className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                   <Activity size={14} className="live-dot" style={{ display: 'inline-block', marginRight: '6px' }} /> LIVE
                 </div>
                 <button onClick={() => setShowLogin(true)} className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', cursor: 'pointer', background: 'var(--color-primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> เข้าสู่ระบบ
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* Global Real-Time Stats Dashboard */}
        <div className="ldt-stats" style={{ marginTop: '0.5rem' }}>
          <StatBox icon={Users} value={safeStats.totalTeams} label="Teams" colorClass="bg-blue-light" />
          <StatBox icon={CheckCircle2} value={safeStats.submitted} label="Submitted" colorClass="bg-primary-light" />
          <StatBox icon={Activity} value={safeStats.pending} label="In Progress" colorClass="bg-amber-light" />
          <StatBox icon={Cpu} value={safeStats.aiPrompts} label="AI Prompts" colorClass="bg-purple-light" />
        </div>

        {/* Global Live Feed Ticker */}
        <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(241, 245, 249, 0.5)', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', borderRight: '1px solid var(--color-border)', paddingRight: '10px' }}>
              <Activity size={12} className="live-dot" /> LIVE FEED
           </div>
           <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
              <motion.div 
                 animate={{ x: [0, -100 * (feed.length || 1)] }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 style={{ display: 'inline-flex', gap: '2rem' }}
              >
                 {feed.length > 0 ? feed.map((f, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                       <strong style={{ color: 'var(--color-text-primary)' }}>{f.team_name || 'Team'}:</strong> {f.action} {f.detail ? `(${f.detail})` : ''}
                    </span>
                 )) : <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>กำลังติดตามความเคลื่อนไหวล่าสุด...</span>}
              </motion.div>
           </div>
        </div>
      </header>

      <nav className="tab-nav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {!user && (
          <>
            <div className={`tab-item ${activeTab !== 'help' ? 'active' : ''}`} onClick={() => setActiveTab('public')}><LayoutDashboard size={16} /> {t('Public View')}</div>
            {currentCourse?.worksheets?.length > 0 && (
              <div className={`tab-item ${activeTab === 'worksheets' ? 'active' : ''}`} onClick={() => setActiveTab('worksheets')}><BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})</div>
            )}
            <div className={`tab-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={16} /> {t('Help')}</div>
          </>
        )}
        {user?.role === 'student' && (
          <>
            <div className={`tab-item ${activeTab === 'team-setup' ? 'active' : ''}`} onClick={() => setActiveTab('team-setup')}><Users size={16} /> {t('Explorer UI')}</div>
            <div className={`tab-item ${activeTab === 'mission-inbox' ? 'active' : ''}`} onClick={() => setActiveTab('mission-inbox')}><Inbox size={16} /> {t('Mission Inbox')}</div>
            <div className={`tab-item ${activeTab === 'collector' ? 'active' : ''}`} onClick={() => setActiveTab('collector')}><Camera size={16} /> {t('On-site Collector')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'evaluation-hub' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation-hub')}><Star size={16} /> {t('Evaluation Hub')}</div>
            <div className={`tab-item ${activeTab === 'public-portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('public-portfolio')}><Award size={16} /> {t('Report (R6)')}</div>
            {currentCourse?.worksheets?.length > 0 && (
              <div className={`tab-item ${activeTab === 'worksheets' ? 'active' : ''}`} onClick={() => setActiveTab('worksheets')}><BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})</div>
            )}
            <div className={`tab-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={16} /> {t('Help')}</div>
          </>
        )}
        {(user?.role === 'teacher' || user?.role === 'facilitator') && (
          <>
            <div className={`tab-item ${activeTab === 'teacher-dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-dashboard')}><Monitor size={16} /> {t('Real-Time Dashboard')}</div>
            <div className={`tab-item ${activeTab === 'mission-builder' ? 'active' : ''}`} onClick={() => setActiveTab('mission-builder')}><Target size={16} /> {t('Mission Builder')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'ai-audit-log' ? 'active' : ''}`} onClick={() => setActiveTab('ai-audit-log')}><ShieldCheck size={16} /> {t('AI Audit Logbook')}</div>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'teacher-reports' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-reports')}><FileSpreadsheet size={16} /> {t('Report (R1-R6)')}</div>
            {currentCourse?.worksheets?.length > 0 && (
              <div className={`tab-item ${activeTab === 'worksheets' ? 'active' : ''}`} onClick={() => setActiveTab('worksheets')}><BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})</div>
            )}
            <div className={`tab-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={16} /> {t('Help')}</div>
          </>
        )}
        {user?.role === 'sage' && (
          <>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'public-portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('public-portfolio')}><Award size={16} /> {t('Report (R6)')}</div>
            {currentCourse?.worksheets?.length > 0 && (
              <div className={`tab-item ${activeTab === 'worksheets' ? 'active' : ''}`} onClick={() => setActiveTab('worksheets')}><BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})</div>
            )}
            <div className={`tab-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={16} /> {t('Help')}</div>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <div className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}><Settings size={16} /> {t('Admin Panel')}</div>
            <div className={`tab-item ${activeTab === 'team-setup' ? 'active' : ''}`} onClick={() => setActiveTab('team-setup')}><Users size={16} /> {t('Team Management')}</div>
            <div className={`tab-item ${activeTab === 'teacher-dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-dashboard')}><Monitor size={16} /> {t('Real-Time Dashboard')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'ai-audit-log' ? 'active' : ''}`} onClick={() => setActiveTab('ai-audit-log')}><ShieldCheck size={16} /> {t('AI Audit Logbook')}</div>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'teacher-reports' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-reports')}><FileSpreadsheet size={16} /> {t('Reports R1-R6')}</div>
            {currentCourse?.worksheets?.length > 0 && (
              <div className={`tab-item ${activeTab === 'worksheets' ? 'active' : ''}`} onClick={() => setActiveTab('worksheets')}><BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})</div>
            )}
            <div className={`tab-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}><HelpCircle size={16} /> {t('Help')}</div>
          </>
        )}
      </nav>

      <main className="user-area">
        {!user && (() => {
            // Compute global averages per dimension across ALL teams (public-safe data)
            const dimAvgs = SCORE_DIMENSIONS.map(d => {
              const teamAvgs = (teams || []).filter(Boolean).map(tm => matrixColAvg(tm.id, d)).filter(v => v != null);
              if (!teamAvgs.length) return 0;
              return teamAvgs.reduce((a,b)=>a+b,0) / teamAvgs.length;
            });
            const hasData = dimAvgs.some(v => v > 0);
            return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="lane">
               <div className="lane-header bg-primary-light"><LayoutDashboard size={16} /> ภาพรวมทักษะรายทีม (Public Overview)</div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Top: Radar (avg) + Stats */}
                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '1rem', alignItems: 'flex-start' }}>
                     <div className="card" style={{ textAlign: 'center' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>📡 Skill Radar — เฉลี่ยทุกทีม</h4>
                        <RadarChart data={hasData ? dimAvgs : [4, 3, 5, 2, 4]} labels={['AI', 'Wisdom', 'Creative', 'Business', 'Story']} />
                        <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#64748b' }}>
                           {hasData ? `จาก ${teams.length} ทีม` : 'ข้อมูลตัวอย่าง (ยังไม่มีคะแนนจริง)'}
                        </p>
                     </div>
                     {/* Public Matrix: Team x Dimension averages */}
                     <div className="card" style={{ overflowX: 'auto' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>🔢 Skill Matrix — รายทีม × 5 ด้าน</h4>
                        {teams.length === 0 ? (
                           <p style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '2rem 0', textAlign: 'center' }}>ยังไม่มีทีมในระบบ</p>
                        ) : (
                           <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 3, fontSize: '0.75rem' }}>
                              <thead>
                                 <tr>
                                    <th style={{ textAlign: 'left', padding: '4px', color: '#475569' }}>ทีม</th>
                                    {SCORE_DIMENSIONS.map(d => (
                                       <th key={d} style={{ padding: '4px', color: '#475569', textAlign: 'center' }}>{d.split(' ')[0]}</th>
                                    ))}
                                    <th style={{ padding: '4px', color: '#475569', textAlign: 'center' }}>⭐ เฉลี่ย</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {(teams || []).filter(Boolean).map(tm => {
                                    const overall = matrixOverall(tm.id);
                                    return (
                                       <tr key={tm.id}>
                                          <td style={{ padding: '4px 6px', fontWeight: 600, whiteSpace: 'nowrap' }}>{tm.name}</td>
                                          {SCORE_DIMENSIONS.map(d => {
                                             const v = matrixColAvg(tm.id, d);
                                             const c = cellColor(v);
                                             return (
                                                <td key={d} style={{ padding: '5px 4px', background: c.bg, color: c.fg, textAlign: 'center', borderRadius: 4, fontWeight: 600 }}>
                                                   {v == null ? '—' : v.toFixed(1)}
                                                </td>
                                             );
                                          })}
                                          <td style={{ padding: '5px 4px', background: cellColor(overall).bg, color: cellColor(overall).fg, textAlign: 'center', borderRadius: 4, fontWeight: 800 }}>
                                             {overall == null ? '—' : overall.toFixed(2)}
                                          </td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        )}
                        <div style={{ marginTop: 6, fontSize: '0.65rem', color: '#94a3b8', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                           <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#dcfce7', borderRadius: 2, marginRight: 3 }} />ดี (≥ 4.0)</span>
                           <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fef9c3', borderRadius: 2, marginRight: 3 }} />ปานกลาง (3.0)</span>
                           <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#ffedd5', borderRadius: 2, marginRight: 3 }} />ต้องพัฒนา (2.0)</span>
                           <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fee2e2', borderRadius: 2, marginRight: 3 }} />ปรับปรุง (&lt; 2)</span>
                        </div>
                     </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#64748b' }}>สรุปขีดความสามารถเฉลี่ยของทุกทีมในขณะนี้ · เข้าสู่ระบบเพื่อดูรายละเอียดและบันทึกคะแนน</p>
               </div>
            </div>
            <LoginPage onLogin={setUser} />
          </div>
            );
        })()}

        <AnimatePresence mode="wait">
          {activeTab === 'team-setup' && (
             <motion.div key="ts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light">Explorer UI — จัดการทีมของฉัน</div>
               <div className="lane-content">
                  <div className="grid-2">
                    <input className="login-input" value={teamInfo.name} onChange={e=>setTeamInfo({...teamInfo, name: e.target.value})} placeholder="ชื่อทีม..." />
                    <input className="login-input" value={teamInfo.photo} onChange={e=>setTeamInfo({...teamInfo, photo: e.target.value})} placeholder="Link รูปถ่ายทีม..." />
                  </div>
                  <textarea className="login-input" rows={4} value={teamInfo.members} onChange={e=>setTeamInfo({...teamInfo, members: e.target.value})} placeholder="สมาชิกในทีม..." style={{ marginTop: '1rem' }} />
                  <button onClick={() => handleSave('team-setup', teamInfo)} className="login-btn" style={{ marginTop: '1rem' }}><Save size={18} /> บันทึกข้อมูลทีม</button>
               </div>
             </motion.div>
          )}

          {activeTab === 'mission-inbox' && (
            <motion.div key="mi" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-purple-light">Mission Inbox & Notification — รับโจทย์ภารกิจ</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '0.75rem', background: missionStatus.status === 'Rejected' ? '#fef2f2' : '#eff6ff', border: `1px solid ${missionStatus.status === 'Rejected' ? '#fecaca' : '#bfdbfe'}`, borderRadius: '8px', fontSize: '0.8125rem' }}>
                   <strong>Status: </strong> <span style={{ color: missionStatus.status === 'Rejected' ? '#dc2626' : 'var(--color-primary)', fontWeight: 600 }}>{missionStatus.status}</span>
                   {missionStatus.status === 'Rejected' ? (
                      <p style={{ marginTop: '0.5rem', color: '#991b1b', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>
                         <strong>Teacher's Feedback:</strong> {missionStatus.feedback}
                      </p>
                   ) : (
                      <p style={{ marginTop: '0.25rem', color: '#475569' }}>หากครู "Reject" ไอเดีย จะมีข้อความแจ้งเตือนและข้อเสนอแนะแสดงที่นี่</p>
                   )}
                </div>
                <div className="grid-2">
                  <div>
                    <label className="ldt-stat-lbl">เลือก Module (1-4)</label>
                    <select className="login-input" value={missionData.module} onChange={e=>setMissionData({...missionData, module: e.target.value})}>
                      <option value="">-- โปรดเลือก Module --</option>
                      <option value="1">อัตลักษณ์ที่ 1: วิถีเกษตรและอาหาร</option>
                      <option value="2">อัตลักษณ์ที่ 2: อุตสาหกรรมสร้างสรรค์</option>
                      <option value="3">อัตลักษณ์ที่ 3: ทรัพยากรธรรมชาติ</option>
                      <option value="4">อัตลักษณ์ที่ 4: พลังงานและนวัตกรรม</option>
                    </select>
                  </div>
                  <div>
                    <label className="ldt-stat-lbl">ผลิตภัณฑ์ที่สนใจ</label>
                    <input className="login-input" value={missionData.product} onChange={e=>setMissionData({...missionData, product: e.target.value})} placeholder="ระบุผลิตภัณฑ์..." />
                  </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">เหตุผลในการเลือก (Reasoning)</label>
                  <textarea className="login-input" rows={4} value={missionData.reason} onChange={e=>setMissionData({...missionData, reason: e.target.value})} placeholder="ทำไมถึงเลือกผลิตภัณฑ์นี้..." />
                </div>
                <button onClick={() => handleSave('mission-inbox', missionData)} className="login-btn"><CheckCircle2 size={18} /> รับภารกิจ</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'collector' && (
            <motion.div key="oc" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-amber-light">On-site Collector — เก็บข้อมูลภาคสนาม (Offline Mode)</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#059669', background: '#ecfdf5', padding: '0.5rem', borderRadius: '4px' }}>
                   <Activity size={14} /> <span>Offline Mode Ready: ข้อมูลจะถูกบันทึกใน Local Cache และ Auto-sync เมื่อมีอินเทอร์เน็ต</span>
                </div>
                <div>
                  <label className="ldt-stat-lbl">บันทึกข้อมูลสัมภาษณ์ปราชญ์ชาวบ้าน</label>
                  <textarea className="login-input" rows={6} value={collectorData.interview} onChange={e=>setCollectorData({...collectorData, interview: e.target.value})} placeholder="สรุปใจความสำคัญที่ได้จากการลงพื้นที่..." />
                </div>
                <div>
                  <label className="ldt-stat-lbl">รูปถ่ายคู่กับปราชญ์ (Photo URL)</label>
                  <input className="login-input" value={collectorData.sagePhoto} onChange={e=>setCollectorData({...collectorData, sagePhoto: e.target.value})} placeholder="https://..." />
                </div>
                <button onClick={() => handleSave('collector', collectorData)} className="login-btn" style={{ background: 'var(--color-amber)' }}><Activity size={18} /> Save & Sync Data</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'gateway' && (
            <motion.div key="sg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-primary-light">Submission Gateway — ประตูส่งงานสมบูรณ์</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="grid-2">
                   <div>
                      <label className="ldt-stat-lbl">การสกัดภูมิปัญญาและทำความเข้าใจบริบทพื้นที่</label>
                      <textarea className="login-input" value={gatewayData.wisdom} onChange={e=>setGatewayData({...gatewayData, wisdom: e.target.value})} />
                   </div>
                   <div>
                      <label className="ldt-stat-lbl">การสกัดปัญหาหรือความเสี่ยงต่อสภาพสังคมและสิ่งแวดล้อมที่พบ</label>
                      <textarea className="login-input" value={gatewayData.environment} onChange={e=>setGatewayData({...gatewayData, environment: e.target.value})} />
                   </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">การค้นหาแนวทางการพัฒนาและแก้ปัญหาสู่การสร้างนวัตกรรม</label>
                  <textarea className="login-input" value={gatewayData.brainstorm} onChange={e=>setGatewayData({...gatewayData, brainstorm: e.target.value})} />
                </div>
                <div className="grid-2">
                   <div>
                      <label className="ldt-stat-lbl">การสร้างนวัตกรรมต้นแบบ</label>
                      <input className="login-input" value={gatewayData.prototype} onChange={e=>setGatewayData({...gatewayData, prototype: e.target.value})} />
                   </div>
                   <div>
                      <label className="ldt-stat-lbl">วิดีโอ Green Rayong 4-Identities AI Storytellers: มหัศจรรย์ระยอง 4 มิติ สู่พื้นที่นวัตกรรมท่องเที่ยวโลก</label>
                      <input className="login-input" value={gatewayData.videoUrl} onChange={e=>setGatewayData({...gatewayData, videoUrl: e.target.value})} />
                   </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">Business Model Canvas</label>
                  <textarea className="login-input" rows={4} value={gatewayData.bmc} onChange={e=>setGatewayData({...gatewayData, bmc: e.target.value})} />
                </div>
                <div>
                  <label className="ldt-stat-lbl">AI Prompt Logs</label>
                  <textarea className="login-input" rows={4} value={gatewayData.aiLogs} onChange={e=>setGatewayData({...gatewayData, aiLogs: e.target.value})} placeholder="วาง Prompt ทั้งหมดที่ใช้..." />
                </div>
                <button onClick={() => handleSave('gateway', gatewayData)} className="login-btn"><Send size={18} /> ยืนยันการส่งงานทั้งหมด</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluation-hub' && (
            <motion.div key="eh" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-amber-light">Evaluation Hub — ประเมินตนเองและเพื่อน</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="grid-2">
                   <div className="card">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Self Assessment</h5>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>ประเมินตนเองตาม Rubric 5 ด้าน (10%)</p>
                      <button onClick={() => setShowEvalForm(showEvalForm === 'self' ? null : 'self')} className="login-btn" style={{ marginTop: '1rem', width: '100%' }}>{showEvalForm === 'self' ? 'ปิดแบบประเมิน' : 'ทำแบบประเมินตนเอง'}</button>
                   </div>
                   <div className="card">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Peer Assessment</h5>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>ประเมินเพื่อนร่วมทีม (Anonymous) (15%)</p>
                      <button onClick={() => setShowEvalForm(showEvalForm === 'peer' ? null : 'peer')} className="login-btn" style={{ marginTop: '1rem', width: '100%', background: 'var(--color-purple)' }}>{showEvalForm === 'peer' ? 'ปิดแบบประเมิน' : 'ทำแบบประเมินเพื่อน'}</button>
                   </div>
                </div>

                {/* Mock Form Display */}
                {showEvalForm === 'self' && (
                   <div className="card" style={{ background: '#f8fafc' }}>
                      <h5 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>แบบฟอร์มประเมินตนเอง (Mock)</h5>
                      {[1,2,3].map(i => (
                         <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>มิติที่ {i}: การมีส่วนร่วมและความรับผิดชอบ</div>
                            <select className="login-input" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                               <option>เลือกระดับคะแนน (1-5)...</option>
                               <option>5 - ดีเยี่ยม</option>
                               <option>4 - ดีมาก</option>
                            </select>
                         </div>
                      ))}
                      <button className="login-btn" style={{ width: 'fit-content' }}>Submit Self-Assessment</button>
                   </div>
                )}

                {showEvalForm === 'peer' && (
                   <div className="card" style={{ background: '#f5f3ff' }}>
                      <h5 style={{ marginBottom: '1rem', color: 'var(--color-purple)' }}>แบบฟอร์มประเมินเพื่อนร่วมทีม (Mock)</h5>
                      {mockTeammates.map(tm => (
                         <div key={tm.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd6fe' }}>
                            <div style={{ fontWeight: 600, color: '#4c1d95' }}>ประเมิน: {tm.name}</div>
                            <select className="login-input" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                               <option>เลือกระดับคะแนน (1-5)...</option>
                               <option>5 - ให้ความร่วมมือดีเยี่ยม</option>
                               <option>4 - ให้ความร่วมมือดี</option>
                            </select>
                         </div>
                      ))}
                      <button className="login-btn" style={{ width: 'fit-content', background: 'var(--color-purple)' }}>Submit Peer-Assessment</button>
                   </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Legacy dynamic-rubric evaluator disabled below */}
          {window.SHOW_LEGACY_EVALUATOR && activeTab === 'pitch-evaluator' && (
            // NOTE: Disabled — duplicate of the Pitching Evaluator below. Kept here only for
            // reference (this version uses dynamic rubrics from the DB). Re-enable by
            // changing `false &&` and removing/disabling the other 'pitch-evaluator' block.
            <motion.div key="pe-rubric" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-primary-light">Evaluation Board (ระบบประเมินผล: {user?.role?.toUpperCase() || ''})</div>
               <div className="lane-content grid-2" style={{ gridTemplateColumns: '250px 1fr', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <h4 style={{ marginBottom: '1rem' }}>เลือกทีมที่ต้องการประเมิน</h4>
                     {(user?.role === 'teacher' ? teams.filter(t => t && t.teacher_id === user?.id) : (teams || [])).filter(Boolean).map(t => (
                        <div key={t.id} onClick={()=>setSelectedTeam(t)} className={`card ${selectedTeam?.id === t.id ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <Users size={16} color="var(--color-primary)" /> {t.name}
                        </div>
                     ))}
                  </div>
                  <div className="card" style={{ background: '#f8fafc', padding: '2rem' }}>
                     {selectedTeam ? (
                        <>
                           <h3 style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>แบบประเมินทีม: {selectedTeam.name}</h3>
                           
                           {/* Media Preview Links */}
                           <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-blue)' }}><LayoutGrid size={24} color="var(--color-blue)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดูรูป Prototype</span></div>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-amber)' }}><Monitor size={24} color="var(--color-amber)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดูวิดีโอ & Storytelling</span></div>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-purple)' }}><FileSpreadsheet size={24} color="var(--color-purple)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดู Business Model</span></div>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                              {Object.entries(
                                 rubrics.reduce((acc, r) => {
                                    const cat = r.category || 'เกณฑ์การประเมิน Pitching';
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(r);
                                    return acc;
                                 }, {})
                              ).map(([category, items]) => (
                                 <div key={category} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{category}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                       {items.map(r => (
                                          <div key={r.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                             <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>{r.name}</div>
                                             <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {[1, 2, 3, 4].map(level => {
                                                   const isSelected = evalScore[`${selectedTeam.id}-${r.id}`] === level;
                                                   return (
                                                      <button 
                                                         key={level} 
                                                         onClick={() => setEvalScore(prev => ({...prev, [`${selectedTeam.id}-${r.id}`]: level}))}
                                                         className="card" 
                                                         style={{ 
                                                            margin: 0, 
                                                            padding: '0.5rem 1rem', 
                                                            fontSize: '0.75rem',
                                                            background: isSelected ? 'var(--color-primary)' : '#fff',
                                                            color: isSelected ? '#fff' : 'inherit',
                                                            border: isSelected ? 'none' : '1px solid var(--color-border)'
                                                         }}
                                                      >
                                                         ระดับ {level}
                                                      </button>
                                                   );
                                                })}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <button className="login-btn" style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>
                              <Save size={18} /> บันทึกผลการประเมิน
                           </button>
                        </>
                     ) : <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}><Target size={48} style={{ marginBottom: '1rem' }} /><p>โปรดเลือกทีมจากเมนูด้านซ้ายเพื่อเริ่มการประเมิน</p></div>}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'teacher-dashboard' && (
            <motion.div key="tdb" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'live-feed',   label: t('dash_sub_live_feed'), icon: Activity },
                    { id: 'teams',       label: t('dash_sub_teams'),     icon: Users },
                    { id: 'prompts',     label: t('dash_sub_prompts'),   icon: Zap },
                    { id: 'rubrics',     label: t('dash_sub_rubrics'),   icon: Target },
                    { id: 'eval-matrix', label: t('dash_sub_matrix'),    icon: LayoutGrid }
                  ].map(st => (
                    <button key={st.id} onClick={() => setAssessorSubTab(st.id)} className={`card ${assessorSubTab === st.id ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <st.icon size={14} /> {st.label}
                    </button>
                  ))}
               </div>

               <div className="lane">
                  <div className="lane-header bg-primary-light">{t('header_assessor')}: {assessorSubTab.toUpperCase()}</div>
                  <div className="lane-content">
                     {assessorSubTab === 'live-feed' && (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                           <div>
                              <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <Activity size={18} className="live-dot" /> Live Activity Feed
                              </h4>
                              <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                 {feed.map((f, i) => (
                                    <div key={i} style={{ fontSize: '0.8125rem', borderBottom: '1px solid #f1f5f9', padding: '0.8rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                       <div>
                                          <strong>{f.team_name || 'Team'}:</strong> {f.action}
                                          {f.detail && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{f.detail}</div>}
                                       </div>
                                       <span style={{ fontSize: '0.625rem', opacity: 0.5 }}>{new Date(f.created_at).toLocaleTimeString()}</span>
                                    </div>
                                 ))}
                                 {feed.length === 0 && <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', padding: '2rem' }}>กำลังติดตามความเคลื่อนไหวล่าสุด...</p>}
                              </div>
                           </div>
                           <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                              <h4 style={{ marginBottom: '1.5rem' }}>Performance Overview</h4>
                              <RadarChart data={[3.5, 4.2, 3.8, 2.9, 4.5]} labels={['ความรู้', 'ทักษะ', 'ทัศนคติ/เจตคติ', 'พฤติกรรม', 'การประยุกต์ใช้']} />
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'teams' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>Managed Teams ({teams.filter(t => t && (t.teacher_id === user?.id || user?.role === 'admin')).length})</h4>
                              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>รายการทีมที่คุณได้รับมอบหมายให้ดูแล</p>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {teams.filter(t => t && (t.teacher_id === user?.id || user?.role === 'admin')).map(t => (
                                 <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                    <div>
                                       <div style={{ fontWeight: 600 }}>{t.name}</div>
                                       <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>Progress: Step 3 | Last update: 10m ago</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                       <button onClick={() => { setSelectedTeam(t); setActiveTab('pitch-evaluator'); }} className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: 'none' }}>ตรวจงาน</button>
                                       <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: 'none' }}>แชททีม</button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'prompts' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>Good Prompt Library</h4>
                              <button onClick={() => {
                                 const title = prompt('หัวข้อ Prompt:');
                                 const content = prompt('รายละเอียด Prompt:');
                                 if(title && content) saveGoodPrompt({ title, content, category: 'General' });
                              }} className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content' }}><Plus size={16} /> เพิ่ม Prompt ตัวอย่าง</button>
                           </div>
                           <div className="grid-2">
                              {goodPrompts.map(p => (
                                 <div key={p.id} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                       <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{p.title}</div>
                                       <button onClick={() => deleteGoodPrompt(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><LogOut size={12} /></button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontStyle: 'italic' }}>
                                       "{p.content}"
                                    </div>
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.625rem', color: '#94a3b8' }}>Category: {p.category || 'General'}</div>
                                 </div>
                              ))}
                              {goodPrompts.length === 0 && <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>ยังไม่มี Prompt ตัวอย่างในขณะนี้</p>}
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'rubrics' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>การจัดการ Rubric Score</h4>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                 <label className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content', background: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileSpreadsheet size={16} /> อัปโหลด CSV
                                    <input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => {
                                       const file = e.target.files[0];
                                       if (!file) return;
                                       const reader = new FileReader();
                                       reader.onload = (event) => {
                                          const text = event.target.result;
                                          const lines = text.split('\n').filter(l => l.trim() !== '');
                                          const newRubrics = lines.map((line, i) => {
                                             const cols = line.split(',');
                                             return { id: `csv-${Date.now()}-${i}`, name: cols[0] || 'Untitled', levels: cols.slice(1) };
                                          });
                                          setRubrics(prev => [...newRubrics, ...prev]);
                                          alert(`อัปโหลดเกณฑ์ใหม่สำเร็จ ${newRubrics.length} รายการจากไฟล์ ${file.name}`);
                                       };
                                       reader.readAsText(file);
                                       e.target.value = '';
                                    }} />
                                 </label>
                                 <button className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content', background: 'var(--color-purple)' }}><Plus size={16} /> สร้างเกณฑ์ใหม่</button>
                              </div>
                           </div>

                           {Object.entries(
                              rubrics.reduce((acc, r) => {
                                 const cat = r.category || 'เกณฑ์การประเมิน Pitching';
                                 if (!acc[cat]) acc[cat] = [];
                                 acc[cat].push(r);
                                 return acc;
                              }, {})
                           ).map(([category, items]) => (
                              <div key={category} style={{ marginBottom: '2.5rem' }}>
                                 <h5 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-border)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Target size={18} /> {category} <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>{items.length} ข้อ</span>
                                 </h5>
                                 {items.map(r => (
                                    <div key={r.id} className="card" style={{ borderLeft: '4px solid var(--color-purple)', marginBottom: '1rem' }}>
                                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-purple)' }}>{r.name || `Rubric ${r.id}`}</div>
                                          <button className="card" style={{ margin: 0, padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444', border: 'none' }} onClick={() => setRubrics(prev => prev.filter(x => x.id !== r.id))} title="ลบเกณฑ์นี้"><LogOut size={14}/></button>
                                       </div>
                                       {(r.levels && r.levels.length > 0) ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: '0.5rem' }}>
                                             {r.levels.map((levelText, idx) => (
                                                <div key={idx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                                                   <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.4rem' }}>
                                                      {RUBRIC_LEVEL_LABELS[idx]
                                                        ? `${RUBRIC_LEVEL_LABELS[idx]} (${idx + 1})`
                                                        : `ระดับที่ ${idx + 1}`}
                                                   </strong>
                                                   {levelText.trim() || '-'}
                                                </div>
                                             ))}
                                          </div>
                                       ) : (
                                          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{r.description || JSON.stringify(r)}</div>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ))}
                        </div>
                     )}

                     {assessorSubTab === 'eval-matrix' && (() => {
                        // Build a lookup: scoresByTeam[teamId][dimension] = { avg_score, n_evaluators, roles }
                        const scoresByTeam = {};
                        teamScores.forEach(s => {
                           if (!scoresByTeam[s.team_id]) scoresByTeam[s.team_id] = {};
                           scoresByTeam[s.team_id][s.dimension] = s;
                        });
                        const ROLE_META = {
                           self:    { icon: User,    label: 'ประเมินตนเอง' },
                           peer:    { icon: Users,   label: 'เพื่อนประเมิน' },
                           teacher: { icon: Monitor, label: 'ครูประเมิน' },
                           sage:    { icon: Award,   label: 'ปราชญ์ประเมิน' },
                           ai:      { icon: Cpu,     label: 'AI ประเมิน' }
                        };
                        return (
                        <div style={{ marginTop: '1rem' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                              <span><strong style={{ color: 'var(--color-text-primary)' }}>วิธีอ่าน:</strong> เซลล์สีคือคะแนนเฉลี่ยจริง — เครื่องหมาย <span style={{ color: '#94a3b8', fontWeight: 700 }}>—</span> หมายถึงยังไม่มีใครให้คะแนน</span>
                              <span>{teamScores.length === 0 ? 'ยังไม่มีคะแนนในระบบ' : `มีคะแนนในระบบทั้งหมด ${teamScores.length} ด้าน × ทีม`}</span>
                           </div>
                           <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                 <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                                       <th style={{ textAlign: 'left', padding: '1rem', width: '180px' }}>รายชื่อทีม</th>
                                       {SCORE_DIMENSIONS.map(h => (
                                          <th key={h} style={{ padding: '1rem', textAlign: 'center' }}>{h}</th>
                                       ))}
                                       <th style={{ padding: '1rem', background: '#eff6ff', textAlign: 'center' }}>คะแนนรวม</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {teams.length > 0 ? teams.map(t => {
                                       const tScores = scoresByTeam[t.id] || {};
                                       let totalScore = 0;
                                       let scoredDims = 0;
                                       return (
                                          <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                             <td style={{ padding: '1rem', fontWeight: 600, background: '#f8fafc', borderRight: '2px solid #e2e8f0' }}>{t.name}</td>
                                             {SCORE_DIMENSIONS.map(dim => {
                                                const cellData = tScores[dim];
                                                if (!cellData) {
                                                   return (
                                                      <td key={dim} title="ยังไม่มีใครให้คะแนนด้านนี้" style={{ padding: '0.75rem', background: '#fafafa', color: '#cbd5e1', textAlign: 'center', border: '1px dashed #e2e8f0', fontSize: '1.25rem', fontWeight: 600 }}>
                                                         —
                                                      </td>
                                                   );
                                                }
                                                const score = cellData.avg_score;
                                                totalScore += score;
                                                scoredDims++;
                                                const hue = ((score - 1) / 4) * 130;
                                                const bgColor = `hsl(${hue}, 80%, 92%)`;
                                                const textColor = `hsl(${hue}, 90%, 25%)`;
                                                const rolesScored = new Set((cellData.roles || '').split(','));
                                                return (
                                                   <td key={dim} style={{ padding: '0.75rem', background: bgColor, color: textColor, border: '1px solid white' }}>
                                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', maxWidth: '120px', margin: '0 auto' }}>
                                                         {EVALUATOR_ROLES.map(role => {
                                                            const meta = ROLE_META[role];
                                                            const has = rolesScored.has(role);
                                                            return (
                                                               <div
                                                                  key={role}
                                                                  title={has ? `${meta.label}: ให้คะแนนแล้ว` : `${meta.label}: ยังไม่ได้ให้คะแนน`}
                                                                  style={{ width: '20px', height: '20px', borderRadius: '4px', background: has ? '#ffffff' : 'transparent', border: has ? 'none' : '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: has ? 1 : 0.4 }}
                                                               >
                                                                  <meta.icon size={12} color={has ? textColor : '#94a3b8'} />
                                                               </div>
                                                            );
                                                         })}
                                                      </div>
                                                      <div style={{ textAlign: 'center', marginTop: '6px', fontWeight: 700, fontSize: '0.875rem' }}>
                                                         {score.toFixed(1)}
                                                      </div>
                                                      <div style={{ textAlign: 'center', fontSize: '0.625rem', opacity: 0.7 }}>
                                                         จาก {cellData.n_evaluators} คน
                                                      </div>
                                                   </td>
                                                );
                                             })}
                                             {scoredDims === 0 ? (
                                                <td style={{ textAlign: 'center', padding: '1rem', background: '#fafafa', color: '#cbd5e1', fontSize: '1rem', fontWeight: 600, borderLeft: '2px solid white' }}>
                                                   —
                                                </td>
                                             ) : (() => {
                                                const avg = totalScore / scoredDims;
                                                const hue = ((avg - 1) / 4) * 130;
                                                return (
                                                   <td style={{ textAlign: 'center', fontWeight: 700, padding: '1rem', background: `hsl(${hue}, 80%, 85%)`, color: `hsl(${hue}, 90%, 25%)`, fontSize: '1rem', borderLeft: '2px solid white' }}>
                                                      {(avg * 20).toFixed(1)} %
                                                      <div style={{ fontSize: '0.625rem', fontWeight: 400, opacity: 0.7 }}>
                                                         ({scoredDims}/{SCORE_DIMENSIONS.length} ด้าน)
                                                      </div>
                                                   </td>
                                                );
                                             })()}
                                          </tr>
                                       );
                                    }) : (
                                       <tr><td colSpan={SCORE_DIMENSIONS.length + 2} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>ยังไม่มีข้อมูลทีม</td></tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                           
                           <div className="grid-2" style={{ marginTop: '1.5rem' }}>
                              <div className="card">
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LayoutGrid size={16} /> สัญลักษณ์มิติการประเมิน</h5>
                                 <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    {[
                                       { icon: User, label: 'ประเมินตนเอง' },
                                       { icon: Users, label: 'เพื่อนประเมิน' },
                                       { icon: Monitor, label: 'ครูประเมิน' },
                                       { icon: Award, label: 'ปราชญ์ประเมิน' },
                                       { icon: Cpu, label: 'AI ประเมิน' }
                                    ].map(d => (
                                       <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                                          <div style={{ width: '20px', height: '20px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><d.icon size={12} /></div>
                                          {d.label}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div>
                                    <h5>Export & Reports</h5>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>ดาวน์โหลดรายงานสรุปผลรายบุคคลและรายทีม</p>
                                 </div>
                                 <button className="login-btn" style={{ width: 'fit-content', padding: '0.6rem 1.2rem' }}><FileSpreadsheet size={16} /> Download CSV</button>
                              </div>
                           </div>
                        </div>
                        );
                     })()}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                  {[
                    { id: 'management', label: t('admin_sub_management') },
                    { id: 'session',    label: t('admin_sub_session')    },
                    { id: 'moderation', label: t('admin_sub_moderation') },
                    { id: 'courses',    label: t('admin_sub_courses')    },
                    { id: 'branding',   label: t('admin_sub_branding')   },
                    { id: 'settings',   label: t('admin_sub_settings')   },
                    { id: 'reports',    label: t('admin_sub_reports')    }
                  ].map(st => (
                    <button key={st.id} onClick={() => setAdminSubTab(st.id)} className={`card ${adminSubTab === st.id ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{st.label}</button>
                  ))}
               </div>

               <div className="lane">
                  <div className="lane-header bg-blue-light">{t('header_admin')}: {t('admin_sub_' + adminSubTab) !== ('admin_sub_' + adminSubTab) ? t('admin_sub_' + adminSubTab) : adminSubTab.toUpperCase()}</div>
                  <div className="lane-content">
                     {adminSubTab === 'management' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                           <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> User Accounts</h5>
                              </div>
                              
                              <div className="card" style={{ marginBottom: '1rem', background: '#f8fafc' }}>
                                 <h6>{editingUser ? 'Edit User' : 'Add New User'}</h6>
                                 <div className="grid-2" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="ชื่อ-นามสกุล" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} />
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="Username" value={newUser.username} onChange={e=>setNewUser({...newUser, username: e.target.value})} />
                                    {!editingUser && <input className="login-input" type="password" style={{ fontSize: '0.75rem' }} placeholder="Password" value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} />}
                                    <select className="login-input" style={{ fontSize: '0.75rem' }} value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})}>
                                       <option value="student">Student</option>
                                       <option value="teacher">Teacher</option>
                                       <option value="sage">Sage</option>
                                       <option value="admin">Admin</option>
                                    </select>
                                 </div>
                                 <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                       className="login-btn" 
                                       style={{ padding: '0.4rem 1rem', width: 'fit-content', fontSize: '0.75rem' }}
                                       onClick={async () => {
                                          try {
                                             if (editingUser) {
                                                await adminUpdateUser(editingUser.id, newUser);
                                                setEditingUser(null);
                                             } else {
                                                await adminCreateUser(newUser);
                                             }
                                             setNewUser({ name: '', username: '', password: '', role: 'student', teamId: '' });
                                             const u = await getUsers(); setUsers(u);
                                          } catch (err) { alert(err.message); }
                                       }}
                                    >
                                       {editingUser ? 'Update User' : 'Create User'}
                                    </button>
                                    {editingUser && <button className="card" style={{ margin: 0, padding: '0.4rem', fontSize: '0.75rem' }} onClick={() => { setEditingUser(null); setNewUser({ name: '', username: '', password: '', role: 'student', teamId: '' }); }}>Cancel</button>}
                                 </div>
                              </div>

                              <div className="grid-2">
                                 {users.map(u => (
                                    <div key={u.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', alignItems: 'center' }}>
                                       <div>
                                          <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{u.name}</div>
                                          <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>{u.role} | @{u.username}</div>
                                       </div>
                                       <div style={{ display: 'flex', gap: '4px' }}>
                                          <button onClick={() => { setEditingUser(u); setNewUser({ name: u.name, username: u.username, role: u.role, teamId: u.team_id || '' }); }} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Settings size={14} /></button>
                                          <button onClick={async () => { if(confirm('Delete user?')) { await adminDeleteUser(u.id); const updated = await getUsers(); setUsers(updated); } }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><LogOut size={14} /></button>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Team Management</h5>
                              </div>

                              <div className="card" style={{ marginBottom: '1rem', background: '#f0fdf4' }}>
                                 <h6>Add New Team</h6>
                                 <div className="grid-2" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="ชื่อทีม" value={newTeam.name} onChange={e=>setNewTeam({...newTeam, name: e.target.value})} />
                                    <select className="login-input" style={{ fontSize: '0.75rem' }} value={newTeam.teacherId} onChange={e=>setNewTeam({...newTeam, teacherId: e.target.value})}>
                                       <option value="">เลือกครูผู้ดูแล...</option>
                                       {(users || []).filter(u => u && u.role === 'teacher').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                 </div>
                                 <button 
                                    className="login-btn" 
                                    style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', width: 'fit-content', fontSize: '0.75rem' }}
                                    onClick={async () => {
                                       try {
                                          await adminCreateTeam(newTeam);
                                          setNewTeam({ name: '', teacherId: '' });
                                       } catch (err) { alert(err.message); }
                                    }}
                                 >
                                    Create Team
                                 </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                 {teams.map(t => {
                                    const assignedTeacher = users.find(u => u.id == t.teacher_id);
                                    return (
                                       <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
                                          <div>
                                             <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                                             <div style={{ fontSize: '0.75rem', color: assignedTeacher ? 'var(--color-primary)' : '#94a3b8' }}>
                                                Teacher: {assignedTeacher ? assignedTeacher.name : 'Unassigned'}
                                             </div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                             <select 
                                                className="login-input" 
                                                style={{ padding: '4px 8px', fontSize: '0.75rem', width: '150px' }}
                                                value={t.teacher_id || ''}
                                                onChange={async (e) => {
                                                   try {
                                                      await adminUpdateTeam(t.id, { ...t, teacher_id: e.target.value });
                                                   } catch (err) { alert(err.message); }
                                                }}
                                             >
                                                <option value="">Assign Teacher...</option>
                                                {(users || []).filter(u => u && (u.role === 'teacher' || u.role === 'facilitator')).map(u => (
                                                   <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                             </select>
                                             <button onClick={async () => { if(confirm('Delete team?')) await adminDeleteTeam(t.id); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><LogOut size={14} /></button>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'session' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                              <h5 style={{ color: '#166534' }}>📅 Activity Phases / Deadlines</h5>
                              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#166534' }}>เพิ่ม / แก้ไข / ลบ phases · เปิด-ปิด submission · กำหนด deadline</p>
                           </div>

                           {/* Add new phase */}
                           <div className="card" style={{ background: '#f0fdf4' }}>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                 <input
                                    type="text"
                                    value={newPhaseLabel}
                                    onChange={e => setNewPhaseLabel(e.target.value)}
                                    placeholder="ชื่อ Phase ใหม่ (เช่น Phase 6 · Public Showcase)"
                                    style={{ flex: 2, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 220 }}
                                  />
                                 <input
                                    type="date"
                                    value={newPhaseDeadline}
                                    onChange={e => setNewPhaseDeadline(e.target.value)}
                                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 140 }}
                                  />
                                 <button onClick={addPhase} className="login-btn" style={{ background: '#16a34a', width: 'auto', padding: '0.5rem 1rem' }}>+ Add Phase</button>
                              </div>
                           </div>

                           {/* Phase list */}
                           {phases.length === 0 ? (
                              <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '2rem' }}>
                                 <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>ยังไม่มี Phase — ระบบจะสร้าง default ให้อัตโนมัติ หรือกดเพิ่มเองด้านบน</p>
                              </div>
                           ) : (
                              phases.map((p, idx) => (
                                 <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.6rem 1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                       <button onClick={() => movePhase(idx, -1)} disabled={idx === 0}                style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#cbd5e1' : '#475569', fontSize: '0.8rem', padding: 0 }}>▲</button>
                                       <button onClick={() => movePhase(idx, 1)}  disabled={idx === phases.length - 1} style={{ border: 'none', background: 'transparent', cursor: idx === phases.length - 1 ? 'default' : 'pointer', color: idx === phases.length - 1 ? '#cbd5e1' : '#475569', fontSize: '0.8rem', padding: 0 }}>▼</button>
                                    </div>
                                    <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{p.order ?? idx + 1}</div>
                                    <div style={{ flex: 1, fontWeight: 500 }}>
                                       {p.label}
                                       {p.deadline && <span style={{ marginLeft: 8, fontSize: '0.7rem', color: '#dc2626' }}>⏰ {p.deadline}</span>}
                                    </div>
                                    <button onClick={() => setPhaseState(p.id, !p.open)} style={{ padding: '0.3rem 0.7rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, border: '1px solid', cursor: 'pointer', background: p.open ? '#dcfce7' : '#fee2e2', color: p.open ? '#166534' : '#991b1b', borderColor: p.open ? '#86efac' : '#fecaca' }}>
                                       {p.open ? 'Open' : 'Closed'}
                                    </button>
                                    <button onClick={() => editPhase(p.id, p.label)}   style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #fde68a', background: '#fffbeb', color: '#92400e', borderRadius: 4, cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => removePhase(p.id, p.label)} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 4, cursor: 'pointer' }}>🗑</button>
                                 </div>
                              ))
                           )}
                        </div>
                     )}
                     {adminSubTab === 'moderation' && (() => {
                        const filtered = moderationFlags.filter(f =>
                          (flagFilterSeverity === 'all' || f.severity === flagFilterSeverity) &&
                          (flagFilterStatus   === 'all' || f.status   === flagFilterStatus  ) &&
                          (flagFilterCategory === 'all' || f.category === flagFilterCategory)
                        );
                        const byTeam = filtered.reduce((acc, f) => {
                          const k = `${f.team_name || f.team_id}|${f.team_id}`;
                          (acc[k] = acc[k] || []).push(f);
                          return acc;
                        }, {});
                        const counts = {
                          total  : moderationFlags.length,
                          high   : moderationFlags.filter(f => f.severity === 'high').length,
                          medium : moderationFlags.filter(f => f.severity === 'medium').length,
                          low    : moderationFlags.filter(f => f.severity === 'low').length,
                          pending: moderationFlags.filter(f => f.status === 'pending').length,
                        };
                        return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {/* Header */}
                          <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                   <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#92400e' }}>🛡️ Cultural Respect &amp; Ethics Audit</h5>
                                   <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#92400e' }}>เกณฑ์เน้น: เคารพปราชญ์ · ปกป้องความเป็นส่วนตัว · ความถูกต้องของภูมิปัญญา · จริยธรรม AI</p>
                                </div>
                                <button onClick={handleRunAudit} disabled={auditRunning} className="login-btn" style={{ background: '#dc2626', width: 'auto', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                                   {auditRunning ? '⏳ กำลัง Audit...' : '🔍 Run Ethics Audit on All Teams'}
                                </button>
                             </div>
                             <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.2rem 0.6rem', background: '#fff', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>ทั้งหมด {counts.total}</span>
                                <span style={{ padding: '0.2rem 0.6rem', background: SEVERITY_META.high.color,   color: '#fff', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>High {counts.high}</span>
                                <span style={{ padding: '0.2rem 0.6rem', background: SEVERITY_META.medium.color, color: '#fff', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>Medium {counts.medium}</span>
                                <span style={{ padding: '0.2rem 0.6rem', background: SEVERITY_META.low.color,    color: '#fff', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>Low {counts.low}</span>
                                <span style={{ padding: '0.2rem 0.6rem', background: '#64748b', color: '#fff', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>⏳ รอตรวจ {counts.pending}</span>
                             </div>
                          </div>

                          {/* Filters */}
                          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem' }}>
                             <strong style={{ marginRight: 4 }}>กรอง:</strong>
                             <select value={flagFilterStatus}   onChange={e => setFlagFilterStatus(e.target.value)} style={{ padding: '0.35rem', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                                <option value="pending">รอตรวจ</option>
                                <option value="all">ทุกสถานะ</option>
                                <option value="approved">Approved</option>
                                <option value="fixed">Fixed</option>
                                <option value="rejected">Rejected</option>
                             </select>
                             <select value={flagFilterSeverity} onChange={e => setFlagFilterSeverity(e.target.value)} style={{ padding: '0.35rem', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                                <option value="all">ทุกความรุนแรง</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                             </select>
                             <select value={flagFilterCategory} onChange={e => setFlagFilterCategory(e.target.value)} style={{ padding: '0.35rem', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                                <option value="all">ทุกหมวด</option>
                                {Object.entries(ETHICS_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                             </select>
                          </div>

                          {/* Flag list grouped by team */}
                          {filtered.length === 0 ? (
                             <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed', padding: '2rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                   {moderationFlags.length === 0 ? '🎉 ยังไม่มีการรัน Audit — กดปุ่ม "Run Ethics Audit" ด้านบน' : 'ไม่มี flag ที่ตรงกับ filter ปัจจุบัน'}
                                </p>
                             </div>
                          ) : (
                             Object.entries(byTeam).map(([key, flags]) => {
                                const teamName = key.split('|')[0];
                                return (
                                  <div key={key} className="card" style={{ borderLeft: `3px solid ${SEVERITY_META[flags[0].severity]?.color || '#64748b'}` }}>
                                     <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                                        👥 {teamName} <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>({flags.length} flag)</span>
                                     </h5>
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '0.75rem' }}>
                                        {flags.map(f => {
                                           const sev = SEVERITY_META[f.severity] || SEVERITY_META.low;
                                           const cat = ETHICS_CATEGORIES[f.category] || { label: f.category, emoji: '•' };
                                           return (
                                              <div key={f.id} style={{ padding: '0.6rem', background: sev.bg, borderRadius: 6, borderLeft: `4px solid ${sev.color}`, fontSize: '0.8rem' }}>
                                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                                                    <div style={{ flex: 1, minWidth: 200 }}>
                                                       <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                                          <span style={{ padding: '0.1rem 0.4rem', background: sev.color, color: '#fff', borderRadius: 4, fontSize: '0.65rem', fontWeight: 600 }}>{sev.label}</span>
                                                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{cat.emoji} {cat.label}</span>
                                                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>· {f.source}/{f.source_id}</span>
                                                       </div>
                                                       <div style={{ marginTop: '0.35rem', fontWeight: 500 }}>{f.desc}</div>
                                                       {f.evidence && <div style={{ marginTop: '0.35rem', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569' }}>{f.evidence}</div>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                       <button onClick={() => setModerationFlagStatus(f.id, 'approved').catch(e => alert(e?.message || e))} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #16a34a', background: '#f0fdf4', color: '#16a34a', borderRadius: 4, cursor: 'pointer' }}>✓ Approve</button>
                                                       <button onClick={() => setModerationFlagStatus(f.id, 'fixed').catch(e => alert(e?.message || e))}    style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #0891b2', background: '#ecfeff', color: '#0891b2', borderRadius: 4, cursor: 'pointer' }}>🔧 Fixed</button>
                                                       <button onClick={() => setModerationFlagStatus(f.id, 'rejected').catch(e => alert(e?.message || e))} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #dc2626', background: '#fef2f2', color: '#dc2626', borderRadius: 4, cursor: 'pointer' }}>✗ Reject</button>
                                                       <button onClick={() => { if (window.confirm('ลบ flag นี้?')) deleteModerationFlag(f.id).catch(e => alert(e?.message || e)); }} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #94a3b8', background: '#fff', color: '#64748b', borderRadius: 4, cursor: 'pointer' }}>🗑</button>
                                                    </div>
                                                 </div>
                                              </div>
                                           );
                                        })}
                                     </div>
                                  </div>
                                );
                             })
                          )}

                          {/* Rules reference */}
                          <details className="card" style={{ background: '#f8fafc' }}>
                             <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>📖 เกณฑ์ตรวจสอบ — 6 หมวด (กดเพื่อขยาย)</summary>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginTop: '0.75rem' }}>
                                {Object.entries(ETHICS_CATEGORIES).map(([k, v]) => (
                                   <div key={k} style={{ padding: '0.5rem', background: '#fff', borderRadius: 6, fontSize: '0.75rem' }}>
                                      <strong>{v.emoji} {v.label}</strong>
                                      <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: 4 }}>{v.hint}</div>
                                   </div>
                                ))}
                             </div>
                          </details>
                        </div>
                        );
                     })()}
                     {adminSubTab === 'courses' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           {/* Header */}
                           <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e40af' }}>📚 จัดการหลักสูตร (Multi-Course)</h5>
                              <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#1e40af' }}>
                                 ระบบรองรับหลายหลักสูตรในเว็บเดียว — แต่ละหลักสูตรมี <strong>stages, identities, rubric, worksheets</strong> ของตัวเอง · ทีมสามารถเข้าหลายหลักสูตรพร้อมกันได้
                              </p>
                              <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: '#1e3a8a' }}>
                                 💡 หลักสูตรเริ่มต้น <strong>Green Rayong</strong> สร้างอัตโนมัติเมื่อเปิด tab นี้ครั้งแรก
                              </p>
                           </div>

                           {/* ─── Import seed courses (pre-defined templates) ─── */}
                           <div className="card" style={{ background: '#fdf4ff', border: '1px solid #f5d0fe' }}>
                              <h5 style={{ color: '#86198f' }}>📦 Import หลักสูตรสำเร็จรูป (Seed Templates)</h5>
                              <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: '#86198f' }}>
                                 หลักสูตรที่ทีม R-Eco-Pilot เตรียมไว้ให้ใช้ทันที — กดปุ่มเดียวนำเข้า worksheets + rubric ครบ
                              </p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8, marginTop: '0.75rem' }}>
                                 {Object.entries(COURSE_SEEDS).map(([seedId, seed]) => {
                                    const alreadyImported = coursesAll.find(c => c.id === seedId);
                                    return (
                                       <div key={seedId} style={{ padding: '0.75rem', background: '#fff', border: '1px solid ' + (seed.branding?.primaryColor || '#cbd5e1'), borderRadius: 8 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                             <span style={{ fontSize: '1.5rem' }}>{seed.branding?.logoEmoji || '📚'}</span>
                                             <strong style={{ color: seed.branding?.primaryColor, fontSize: '0.85rem' }}>{seed.name}</strong>
                                          </div>
                                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 6 }}>
                                             {Array.isArray(seed.methodology) ? seed.methodology.join(' + ') : seed.methodology} · {seed.worksheets?.length || 0} worksheets · {seed.stages?.length || 0} stages
                                          </div>
                                          <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 8, lineHeight: 1.4 }}>{seed.description?.slice(0, 140) + (seed.description?.length > 140 ? '...' : '')}</p>
                                          <button onClick={() => handleImportSeedCourse(seedId)} className="login-btn" style={{ background: alreadyImported ? '#f59e0b' : '#a855f7', width: '100%', padding: '0.4rem', fontSize: '0.75rem' }}>
                                             {alreadyImported ? '🔄 Re-import (Override)' : '📥 Import เข้าระบบ'}
                                          </button>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>

                           {/* Create new course */}
                           <div className="card">
                              <h5>➕ สร้างหลักสูตรใหม่</h5>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 8, marginTop: '0.75rem' }}>
                                 <input type="text" value={newCourseForm.id} onChange={e => setNewCourseForm({ ...newCourseForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="course-id (a-z, 0-9, ขีดกลาง)" style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace', fontSize: '0.8rem' }} />
                                 <input type="text" value={newCourseForm.name} onChange={e => setNewCourseForm({ ...newCourseForm, name: e.target.value })} placeholder="ชื่อหลักสูตร (เช่น Design Thinking + STEAM4Innovator)" style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 <select value={newCourseForm.methodology} onChange={e => setNewCourseForm({ ...newCourseForm, methodology: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6 }}>
                                    <option value="DesignThinking">Design Thinking</option>
                                    <option value="STEAM4Innovator">STEAM4Innovator</option>
                                    <option value="LeanStartup">Lean Startup</option>
                                    <option value="PBL">Project-Based Learning</option>
                                    <option value="4-Identities">4-Identities (Green Rayong-style)</option>
                                    <option value="Custom">Custom</option>
                                 </select>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 8, marginTop: '0.5rem', alignItems: 'center' }}>
                                 <input type="text" value={newCourseForm.logoEmoji} onChange={e => setNewCourseForm({ ...newCourseForm, logoEmoji: e.target.value })} maxLength={4} placeholder="🌿" style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, textAlign: 'center', fontSize: '1.3rem' }} />
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input type="color" value={newCourseForm.primaryColor} onChange={e => setNewCourseForm({ ...newCourseForm, primaryColor: e.target.value })} style={{ width: 40, height: 36, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Primary</span>
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input type="color" value={newCourseForm.secondaryColor} onChange={e => setNewCourseForm({ ...newCourseForm, secondaryColor: e.target.value })} style={{ width: 40, height: 36, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Secondary</span>
                                 </div>
                                 <button onClick={handleCreateCourse} className="login-btn" style={{ background: '#16a34a', padding: '0.5rem 1.2rem' }}>+ สร้าง</button>
                              </div>
                           </div>

                           {/* Course list */}
                           {coursesAll.length === 0 ? (
                              <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '2rem' }}>
                                 <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>⏳ กำลังสร้างหลักสูตรเริ่มต้น Green Rayong...</p>
                              </div>
                           ) : (
                              coursesAll.map(c => {
                                 const isEditing = editingCourseId === c.id;
                                 const isLegacy  = c.id === 'green-rayong';
                                 return (
                                    <div key={c.id} className="card" style={{ borderLeft: `4px solid ${c.branding?.primaryColor || '#cbd5e1'}` }}>
                                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                          <div style={{ flex: 1 }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{c.branding?.logoEmoji || '📚'}</span>
                                                <h5 style={{ margin: 0, color: c.branding?.primaryColor }}>{c.name || c.id}</h5>
                                                {c.isDefault && <span style={{ background: '#16a34a', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 12, fontSize: '0.65rem', fontWeight: 700 }}>⭐ DEFAULT</span>}
                                                {isLegacy && <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.15rem 0.5rem', borderRadius: 12, fontSize: '0.65rem' }}>Legacy</span>}
                                             </div>
                                             <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, fontFamily: 'monospace' }}>
                                                ID: {c.id} · Methodology: {(Array.isArray(c.methodology) ? c.methodology.join(', ') : c.methodology) || '—'} · Stages: {c.stages?.length || 0} · Worksheets: {c.worksheets?.length || 0} · Identities: {c.identities?.length || 0}
                                             </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                             {!c.isDefault && <button onClick={() => handleSetDefault(c.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px solid #16a34a', background: '#f0fdf4', color: '#16a34a', borderRadius: 4, cursor: 'pointer' }} title="ตั้งเป็นหลักสูตรเริ่มต้น">⭐ Set Default</button>}
                                             <button onClick={() => openWorksheetsEditor(c)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px solid #c4b5fd', background: '#faf5ff', color: '#5b21b6', borderRadius: 4, cursor: 'pointer' }} title="แก้ไข Worksheets ของหลักสูตร">📝 Worksheets ({c.worksheets?.length || 0})</button>
                                             <button onClick={() => startEditCourse(c)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px solid #fde68a', background: '#fffbeb', color: '#92400e', borderRadius: 4, cursor: 'pointer' }}>✏️ ข้อมูลพื้นฐาน</button>
                                             <button onClick={() => handleCloneCourse(c.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', borderRadius: 4, cursor: 'pointer' }}>📋 Clone</button>
                                             {!isLegacy && <button onClick={() => handleDeleteCourse(c.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 4, cursor: 'pointer' }}>🗑 ลบ</button>}
                                          </div>
                                       </div>
                                       {isEditing && editCourseDraft && (
                                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                                             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                                                <input type="text" value={editCourseDraft.name} onChange={e => setEditCourseDraft({ ...editCourseDraft, name: e.target.value })} placeholder="ชื่อหลักสูตร" style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                                <select value={editCourseDraft.methodology} onChange={e => setEditCourseDraft({ ...editCourseDraft, methodology: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6 }}>
                                                   <option value="DesignThinking">Design Thinking</option>
                                                   <option value="STEAM4Innovator">STEAM4Innovator</option>
                                                   <option value="LeanStartup">Lean Startup</option>
                                                   <option value="PBL">Project-Based Learning</option>
                                                   <option value="4-Identities">4-Identities</option>
                                                   <option value="Custom">Custom</option>
                                                </select>
                                             </div>
                                             <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 8, marginTop: 6, alignItems: 'center' }}>
                                                <input type="text" value={editCourseDraft.logoEmoji} onChange={e => setEditCourseDraft({ ...editCourseDraft, logoEmoji: e.target.value })} maxLength={4} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: 6, textAlign: 'center', fontSize: '1.3rem' }} />
                                                <input type="color" value={editCourseDraft.primaryColor} onChange={e => setEditCourseDraft({ ...editCourseDraft, primaryColor: e.target.value })} style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                                <input type="color" value={editCourseDraft.secondaryColor} onChange={e => setEditCourseDraft({ ...editCourseDraft, secondaryColor: e.target.value })} style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                             </div>
                                             <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                                <button onClick={saveEditCourse} className="login-btn" style={{ flex: 1, background: '#16a34a', padding: '0.45rem' }}>💾 บันทึก</button>
                                                <button onClick={() => { setEditingCourseId(null); setEditCourseDraft(null); }} className="login-btn" style={{ flex: 1, background: '#64748b', padding: '0.45rem' }}>ยกเลิก</button>
                                             </div>
                                             <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 6, fontStyle: 'italic' }}>
                                                💡 กดปุ่ม <strong>📝 Worksheets</strong> ในการ์ดด้านบนเพื่อเข้าสู่ Schema Editor
                                             </p>
                                          </div>
                                       )}
                                       {editingWorksheetsCourseId === c.id && (
                                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#faf5ff', borderRadius: 6, border: '2px solid #c4b5fd' }}>
                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <h5 style={{ color: '#5b21b6', margin: 0 }}>📝 Worksheet Schema Editor ({worksheetsDraft.length} worksheets)</h5>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                   <button onClick={saveWorksheetsToFirestore} className="login-btn" style={{ background: '#16a34a', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>💾 บันทึกทั้งหมด</button>
                                                   <button onClick={closeWorksheetsEditor} className="login-btn" style={{ background: '#64748b', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>ปิด</button>
                                                </div>
                                             </div>
                                             <p style={{ fontSize: '0.7rem', color: '#5b21b6', marginBottom: 8 }}>📌 การเปลี่ยนแปลงจะถูก stage ไว้ — กด "💾 บันทึกทั้งหมด" เพื่อ commit ขึ้น Firestore</p>

                                             {worksheetsDraft.length === 0 && (
                                                <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>ยังไม่มี Worksheet — กด "+ เพิ่ม Worksheet" ด้านล่าง</div>
                                             )}

                                             {worksheetsDraft.map((ws, wsIdx) => (
                                                <div key={wsIdx} style={{ background: '#fff', padding: '0.6rem', borderRadius: 6, border: '1px solid #ddd6fe', marginBottom: 8 }}>
                                                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                         <button onClick={() => moveWorksheet(wsIdx, -1)} disabled={wsIdx === 0} style={{ border: 'none', background: 'transparent', cursor: wsIdx === 0 ? 'default' : 'pointer', color: wsIdx === 0 ? '#cbd5e1' : '#5b21b6', fontSize: '0.7rem', padding: 0 }}>▲</button>
                                                         <button onClick={() => moveWorksheet(wsIdx, 1)}  disabled={wsIdx === worksheetsDraft.length - 1} style={{ border: 'none', background: 'transparent', cursor: wsIdx === worksheetsDraft.length - 1 ? 'default' : 'pointer', color: wsIdx === worksheetsDraft.length - 1 ? '#cbd5e1' : '#5b21b6', fontSize: '0.7rem', padding: 0 }}>▼</button>
                                                      </div>
                                                      <input type="text" value={ws.icon || ''} onChange={e => updateWorksheet(wsIdx, { icon: e.target.value })} maxLength={4} placeholder="📝" style={{ width: 40, padding: '0.35rem', border: '1px solid #cbd5e1', borderRadius: 4, textAlign: 'center', fontSize: '1.1rem' }} />
                                                      <input type="text" value={ws.id || ''} onChange={e => updateWorksheet(wsIdx, { id: e.target.value })} placeholder="WS-id" style={{ width: 100, padding: '0.35rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.75rem' }} />
                                                      <input type="text" value={ws.labelTH || ''} onChange={e => updateWorksheet(wsIdx, { labelTH: e.target.value, label: e.target.value })} placeholder="ชื่อ Worksheet" style={{ flex: 1, padding: '0.35rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.85rem' }} />
                                                      <button onClick={() => setPreviewWorksheetIdx(previewWorksheetIdx === wsIdx ? null : wsIdx)} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', borderRadius: 4, cursor: 'pointer' }}>{previewWorksheetIdx === wsIdx ? '✕ ปิด Preview' : '👁 Preview'}</button>
                                                      <button onClick={() => removeWorksheet(wsIdx)} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 4, cursor: 'pointer' }}>🗑</button>
                                                   </div>
                                                   <textarea value={ws.instructionTH || ''} onChange={e => updateWorksheet(wsIdx, { instructionTH: e.target.value })} placeholder="คำอธิบาย/วัตถุประสงค์ของ worksheet นี้ (แสดงให้นักเรียนเห็น)" rows={2} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.8rem', fontFamily: 'inherit', marginBottom: 6 }} />

                                                   {/* Fields editor */}
                                                   <div style={{ marginTop: 4, padding: '0.4rem', background: '#f8fafc', borderRadius: 4 }}>
                                                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>📋 Fields ({ws.fields?.length || 0})</div>
                                                      {(ws.fields || []).map((f, fIdx) => (
                                                         <div key={fIdx} style={{ display: 'grid', gridTemplateColumns: 'auto 100px 1fr 130px auto auto', gap: 4, alignItems: 'center', padding: '0.3rem 0.4rem', background: '#fff', borderRadius: 4, marginBottom: 4, border: '1px solid #e2e8f0' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                               <button onClick={() => moveField(wsIdx, fIdx, -1)} disabled={fIdx === 0} style={{ border: 'none', background: 'transparent', cursor: fIdx === 0 ? 'default' : 'pointer', color: fIdx === 0 ? '#cbd5e1' : '#475569', fontSize: '0.65rem', padding: 0 }}>▲</button>
                                                               <button onClick={() => moveField(wsIdx, fIdx, 1)}  disabled={fIdx === (ws.fields.length - 1)} style={{ border: 'none', background: 'transparent', cursor: fIdx === ws.fields.length - 1 ? 'default' : 'pointer', color: fIdx === ws.fields.length - 1 ? '#cbd5e1' : '#475569', fontSize: '0.65rem', padding: 0 }}>▼</button>
                                                            </div>
                                                            <input type="text" value={f.id} onChange={e => updateField(wsIdx, fIdx, { id: e.target.value })} placeholder="field_id" style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: 3, fontFamily: 'monospace', fontSize: '0.7rem' }} />
                                                            <input type="text" value={f.label || ''} onChange={e => updateField(wsIdx, fIdx, { label: e.target.value })} placeholder="Label" style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: 3, fontSize: '0.75rem' }} />
                                                            <select value={f.type} onChange={e => updateField(wsIdx, fIdx, { type: e.target.value })} style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: 3, fontSize: '0.7rem' }}>
                                                               {FIELD_TYPES.map(ft => <option key={ft.id} value={ft.id}>{ft.label}</option>)}
                                                            </select>
                                                            <label style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                               <input type="checkbox" checked={!!f.required} onChange={e => updateField(wsIdx, fIdx, { required: e.target.checked })} /> req
                                                            </label>
                                                            <button onClick={() => removeField(wsIdx, fIdx)} style={{ padding: '0.2rem 0.35rem', fontSize: '0.65rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 3, cursor: 'pointer' }}>🗑</button>

                                                            {(f.type === 'select' || f.type === 'radio') && (
                                                               <input type="text" value={(f.options || []).join(', ')} onChange={e => updateField(wsIdx, fIdx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="ตัวเลือก (คั่นด้วย comma)" style={{ gridColumn: '2 / -1', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: 3, fontSize: '0.7rem', marginTop: 2 }} />
                                                            )}
                                                            {f.type === 'textarea' && (
                                                               <div style={{ gridColumn: '2 / -1', display: 'flex', gap: 4, marginTop: 2 }}>
                                                                  <label style={{ fontSize: '0.65rem' }}>Rows: <input type="number" min={1} max={20} value={f.rows || 3} onChange={e => updateField(wsIdx, fIdx, { rows: Number(e.target.value) })} style={{ width: 50, padding: '0.15rem', border: '1px solid #cbd5e1', borderRadius: 3 }} /></label>
                                                                  <input type="text" value={f.placeholder || ''} onChange={e => updateField(wsIdx, fIdx, { placeholder: e.target.value })} placeholder="placeholder" style={{ flex: 1, padding: '0.2rem', border: '1px solid #cbd5e1', borderRadius: 3, fontSize: '0.7rem' }} />
                                                               </div>
                                                            )}
                                                         </div>
                                                      ))}
                                                      <button onClick={() => addField(wsIdx)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', border: '1px dashed #5b21b6', background: 'transparent', color: '#5b21b6', borderRadius: 4, cursor: 'pointer' }}>+ เพิ่ม Field</button>
                                                   </div>

                                                   {/* Live preview */}
                                                   {previewWorksheetIdx === wsIdx && (
                                                      <div style={{ marginTop: 8, padding: 12, background: '#ffffff', border: '2px dashed #0ea5e9', borderRadius: 6 }}>
                                                         <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, marginBottom: 8 }}>👁 PREVIEW — นักเรียนจะเห็นแบบนี้</div>
                                                         <GenericForm schema={ws} value={previewFormValue} onChange={setPreviewFormValue} />
                                                         <details style={{ marginTop: 8, fontSize: '0.7rem' }}>
                                                            <summary style={{ cursor: 'pointer', color: '#64748b' }}>🔍 ดู Data ที่จะ save (JSON)</summary>
                                                            <pre style={{ background: '#f8fafc', padding: 8, borderRadius: 4, marginTop: 4, fontSize: '0.7rem', overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(previewFormValue, null, 2)}</pre>
                                                         </details>
                                                      </div>
                                                   )}
                                                </div>
                                             ))}

                                             <button onClick={addWorksheet} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: '2px dashed #5b21b6', background: 'transparent', color: '#5b21b6', borderRadius: 6, cursor: 'pointer', width: '100%', marginTop: 8, fontWeight: 600 }}>+ เพิ่ม Worksheet</button>
                                          </div>
                                       )}
                                    </div>
                                 );
                              })
                           )}

                           {/* Hint card */}
                           <div className="card" style={{ background: '#fefce8', border: '1px solid #fde68a' }}>
                              <h5 style={{ color: '#854d0e' }}>🔮 จะมีอะไรเพิ่มใน Phase ถัดไป?</h5>
                              <ul style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#92400e', paddingLeft: '1.2rem' }}>
                                 <li><strong>P3:</strong> Worksheet Schema Editor (drag-drop fields) — สร้าง form ตามหลักสูตรของคุณเอง</li>
                                 <li><strong>P4:</strong> Generic Form Renderer — render worksheet schema เป็น form ใช้งานจริง</li>
                                 <li><strong>P5:</strong> Migrate Green Rayong 7 steps → worksheets</li>
                                 <li><strong>P6:</strong> Seed Design Thinking + STEAM4Innovator (19 worksheets จาก JSON schema)</li>
                                 <li><strong>P7:</strong> Course Selector — student เลือกหลักสูตรตอน Login</li>
                              </ul>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'branding' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           {/* Header */}
                           <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>🎨 Branding &amp; White-Label</h5>
                              <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#166534' }}>
                                 ปรับแบรนด์ของระบบให้เหมาะกับจังหวัด/อำเภอของคุณ — เปลี่ยนชื่อ, สี, โลโก้ ได้โดยไม่ต้องแก้โค้ด · บันทึกแล้ว <strong>ทุก device</strong> เห็นการเปลี่ยนแปลงภายใน 1-2 วินาที
                              </p>
                           </div>

                           {/* Live Preview Card */}
                           <div className="card" style={{ borderStyle: 'dashed' }}>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 8 }}>🔍 PREVIEW</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <div style={{ fontSize: '2.5rem' }}>{appConfig.logoEmoji}</div>
                                 <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: appConfig.primaryColor }}>{appConfig.brandName}</div>
                                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{appConfig.brandTagline}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>📍 {appConfig.region}, {appConfig.province}</div>
                                 </div>
                                 <div style={{ display: 'flex', gap: 4 }}>
                                    <div style={{ width: 32, height: 32, background: appConfig.primaryColor,   borderRadius: 6 }} title="Primary" />
                                    <div style={{ width: 32, height: 32, background: appConfig.secondaryColor, borderRadius: 6 }} title="Secondary" />
                                 </div>
                              </div>
                           </div>

                           {/* Quick Presets */}
                           <div className="card">
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>⚡ Quick Presets</h5>
                              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, marginBottom: 12 }}>กดเพื่อใช้ Preset (ยังไม่บันทึก — ต้องกดปุ่ม "💾 บันทึก" ด้านล่าง)</p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                                 {BRAND_PRESETS.map(p => (
                                    <button key={p.name} onClick={() => applyPreset(p)} style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                                       <span style={{ fontSize: '1.5rem' }}>{p.logoEmoji}</span>
                                       <span style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{p.name}</span>
                                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{p.region}, {p.province}</span>
                                       </span>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           {/* Custom Brand Form */}
                           <div className="card">
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>✏️ Custom Brand</h5>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>ชื่อแบรนด์ (BRAND NAME)
                                    <input type="text" value={appConfig.brandName} onChange={e => setAppConfig({ ...appConfig, brandName: e.target.value })} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>TAGLINE
                                    <input type="text" value={appConfig.brandTagline} onChange={e => setAppConfig({ ...appConfig, brandTagline: e.target.value })} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>อำเภอ / พื้นที่ (REGION)
                                    <input type="text" value={appConfig.region} onChange={e => setAppConfig({ ...appConfig, region: e.target.value })} placeholder="เช่น ดอยสะเก็ด" style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>จังหวัด (PROVINCE)
                                    <input type="text" value={appConfig.province} onChange={e => setAppConfig({ ...appConfig, province: e.target.value })} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>LOGO EMOJI 🎨
                                    <input type="text" value={appConfig.logoEmoji} onChange={e => setAppConfig({ ...appConfig, logoEmoji: e.target.value })} maxLength={4} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '1.5rem', textAlign: 'center' }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>ชื่อ PITCHING COMPETITION
                                    <input type="text" value={appConfig.pitchName} onChange={e => setAppConfig({ ...appConfig, pitchName: e.target.value })} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>สี PRIMARY 🟢
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                       <input type="color" value={appConfig.primaryColor} onChange={e => setAppConfig({ ...appConfig, primaryColor: e.target.value })} style={{ width: 50, height: 38, border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer' }} />
                                       <input type="text" value={appConfig.primaryColor} onChange={e => setAppConfig({ ...appConfig, primaryColor: e.target.value })} style={{ flex: 1, padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }} />
                                    </div>
                                 </label>
                                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>สี SECONDARY 🔵
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                       <input type="color" value={appConfig.secondaryColor} onChange={e => setAppConfig({ ...appConfig, secondaryColor: e.target.value })} style={{ width: 50, height: 38, border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer' }} />
                                       <input type="text" value={appConfig.secondaryColor} onChange={e => setAppConfig({ ...appConfig, secondaryColor: e.target.value })} style={{ flex: 1, padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }} />
                                    </div>
                                 </label>
                              </div>
                              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', display: 'block', marginTop: '0.75rem' }}>ชื่อโรงเรียน / สถาบัน (OPTIONAL)
                                 <input type="text" value={appConfig.schoolName} onChange={e => setAppConfig({ ...appConfig, schoolName: e.target.value })} placeholder="เช่น วิทยาลัยการอาชีพดอยสะเก็ด" style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                              </label>
                              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', display: 'block', marginTop: '0.75rem' }}>FOOTER TEXT
                                 <input type="text" value={appConfig.footerText} onChange={e => setAppConfig({ ...appConfig, footerText: e.target.value })} style={{ width: '100%', padding: '0.45rem', marginTop: 4, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                              </label>
                              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                                 <button onClick={() => saveBranding(appConfig)} className="login-btn" style={{ flex: 1, background: appConfig.primaryColor }}>💾 บันทึก Branding</button>
                                 <button onClick={resetBranding} className="login-btn" style={{ flex: 1, background: '#64748b' }}>♻️ Reset เป็น Default</button>
                              </div>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'settings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           {/* System Config */}
                           <div className="card">
                              <h5>System Config & Setup</h5>
                              <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 1.5rem', color: '#64748b' }}>
                                 API Key: G-Sheets / Looker <br/>
                                 Backup Status: Last 1hr ago
                              </p>
                              <hr style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                              <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                 <h6 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}><Cpu size={14} color="var(--color-purple)" /> AI Assessment (Claude API)</h6>
                                 <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>กรอก Claude API Key — เก็บใน localStorage บน browser นี้เท่านั้น</p>
                                 <div className="grid-2" style={{ gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="sk-ant-... (เก็บใน browser นี้เท่านั้น)" value={claudeKeyDraft}   onChange={e => setClaudeKeyDraft(e.target.value)} />
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="Proxy URL (Cloudflare Worker — แชร์ทุกคน)" value={claudeProxyDraft} onChange={e => setClaudeProxyDraft(e.target.value)} />
                                 </div>
                                 <p style={{ fontSize: '0.625rem', color: '#64748b', marginTop: '0.5rem' }}>
                                    * <strong>API Key</strong> เก็บใน localStorage บน browser นี้เท่านั้น — เหมาะตอน dev<br/>
                                    * <strong>Proxy URL</strong> sync ผ่าน Firestore — ตั้งครั้งเดียว ทุก admin/teacher ใช้ได้ (ดูวิธีสร้าง Worker ที่ cloudflare-worker/README.md)
                                 </p>
                                 <button onClick={saveClaudeConfig} className="login-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem', width: 'fit-content', background: 'var(--color-purple)' }}>Save AI Config</button>
                              </div>
                           </div>

                           {/* Looker Studio Embed */}
                           <div className="card">
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>📊 Looker Studio Embed</h5>
                              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>1) สร้าง Report ใน Looker Studio · 2) Share → Embed report → Copy <strong>src URL</strong> · 3) วางที่นี่ · บันทึกครั้งเดียว ทุกคนเห็นในหน้า Real-Time Dashboard</p>
                              <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
                                 <input type="url" value={lookerUrlDraft} onChange={e => setLookerUrlDraft(e.target.value)} placeholder="https://lookerstudio.google.com/embed/reporting/..." style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace', fontSize: '0.75rem' }} />
                                 <button onClick={saveLookerUrl} className="login-btn" style={{ background: '#0ea5e9', width: 'auto', padding: '0.5rem 1rem' }}>Save</button>
                              </div>
                              {lookerUrlDraft && (
                                 <div style={{ marginTop: '1rem', border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden', aspectRatio: '16/9', background: '#f8fafc' }}>
                                    <iframe src={lookerUrlDraft} title="Looker Studio Preview" style={{ width: '100%', height: '100%', border: 0 }} />
                                 </div>
                              )}
                              {!lookerUrlDraft && (
                                 <div style={{ marginTop: '1rem', padding: '1.5rem', border: '1px dashed #cbd5e1', borderRadius: 6, textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                                    ยังไม่ได้ตั้ง URL — วาง embed URL แล้วกด Save เพื่อแสดง preview
                                 </div>
                              )}
                           </div>

                           {/* Backup & Export */}
                           <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#92400e' }}>💾 Backup &amp; Export Database</h5>
                              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#92400e' }}>Export ข้อมูลทั้งหมด (users, teams, submissions, scores, prompts) เป็นไฟล์ JSON</p>
                              <button onClick={downloadBackup} className="login-btn" style={{ background: '#f59e0b', marginTop: '0.75rem', width: 'auto', padding: '0.5rem 1rem' }}>📥 Download Backup JSON</button>
                           </div>

                           {/* Initial Setup */}
                           <div className="card">
                              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>ฐานข้อมูลเริ่มต้น (Initial Setup)</p>
                              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>หากคุณเริ่มโปรเจกต์ใหม่และฐานข้อมูลยังว่างอยู่ สามารถกดปุ่มด้านล่างเพื่อสร้างข้อมูลตัวอย่าง (Teams, Rubrics, Admin Accounts)</p>
                              <button
                                 onClick={async () => {
                                    if (confirm('คุณต้องการสร้างข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
                                       try {
                                          await seedFirebase();
                                          alert('สร้างข้อมูลเริ่มต้นสำเร็จ! ข้อมูลจะปรากฏขึ้นบน Dashboard ทันที');
                                       } catch (err) { alert('Seeding failed: ' + err.message); }
                                    }
                                 }}
                                 className="login-btn"
                                 style={{ background: 'var(--color-purple)', width: 'fit-content', padding: '0.6rem 1.2rem', marginTop: '0.5rem' }}
                              >
                                 <Database size={16} /> Seed Firebase Data
                              </button>
                           </div>

                           {/* Reset & Seed Demo Data */}
                           <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                              <h5 style={{ color: '#991b1b' }}>⚠️ Reset &amp; Seed Demo Data</h5>
                              <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#7f1d1d' }}>
                                 <strong>ระวัง — ลบข้อมูลทั้งหมด!</strong> ใช้สำหรับเริ่มต้น demo set ใหม่:
                              </p>
                              <ul style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#7f1d1d', paddingLeft: '1.2rem' }}>
                                 <li>ล้าง Firestore: users, teams, team_scores, peer_scores, submissions, ai_audits, feedback, activity_log</li>
                                 <li>สร้าง 3 ทีม: ทีม นวัตกรเกาะกก (showcase) / กุลิสรา / อัญชลี</li>
                                 <li>สร้าง 1 admin · 4 ครู · 2 ปราชญ์ · 12 นักเรียน · 3 บัญชี test</li>
                                 <li>รหัสผ่าน default: admin123, teacher123, student123, sage123</li>
                              </ul>
                              <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#7f1d1d', fontStyle: 'italic' }}>หมายเหตุ: Firebase Auth accounts เก่าที่ลบ Firestore doc แล้วยังคงอยู่ใน Authentication console (ลบ manual ที่ Console ถ้าต้องการ clean สมบูรณ์)</p>
                              <button onClick={handleResetSeed} disabled={resetting} className="login-btn" style={{ background: '#dc2626', marginTop: '0.75rem', width: 'auto', padding: '0.5rem 1rem' }}>
                                 {resetting ? '⏳ กำลัง Reset...' : '🔄 Reset & Seed Demo Data'}
                              </button>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'reports' && (
                        <div className="card">
                           <h5>R1: Score Summary Report (Mock Data)</h5>
                           <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>ตารางสรุปคะแนนประเมินรวม 5 มิติ ของทุกทีม (Export PDF/CSV ได้)</p>
                           <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                                 <thead>
                                    <tr style={{ background: '#f1f5f9', color: '#334155' }}>
                                       <th style={{ padding: '0.5rem' }}>Team Name</th>
                                       <th style={{ padding: '0.5rem' }}>Self (10%)</th>
                                       <th style={{ padding: '0.5rem' }}>Peer (15%)</th>
                                       <th style={{ padding: '0.5rem' }}>Teacher (35%)</th>
                                       <th style={{ padding: '0.5rem' }}>Sage (30%)</th>
                                       <th style={{ padding: '0.5rem' }}>AI (10%)</th>
                                       <th style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>Total (100)</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {mockReportData.map((row, idx) => (
                                       <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{row.team}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.self}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.peer}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.teacher}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.sage}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.ai}</td>
                                          <td style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{row.total}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                              <button className="login-btn" style={{ background: 'var(--color-blue)', width: 'fit-content', fontSize: '0.75rem' }}>Export PDF</button>
                              <button className="login-btn" style={{ background: 'var(--color-amber)', width: 'fit-content', fontSize: '0.75rem' }}>Export CSV</button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'mission-builder' && (
            <motion.div key="mb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-purple-light">Mission Builder — กำหนดโจทย์กิจกรรม</div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="grid-2">
                     <div>
                        <label className="ldt-stat-lbl">ชื่อโจทย์ภารกิจ</label>
                        <input className="login-input" value={missionConfig.name} onChange={e=>setMissionConfig({...missionConfig, name: e.target.value})} placeholder="เช่น Green Rayong Challenge..." />
                     </div>
                     <div>
                        <label className="ldt-stat-lbl">กำหนด Deadline</label>
                        <input className="login-input" type="date" value={missionConfig.deadline} onChange={e=>setMissionConfig({...missionConfig, deadline: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="ldt-stat-lbl">เกณฑ์การประเมิน (Rubric 5 ด้าน)</label>
                     <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                        {['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'].map(r => (
                           <div key={r} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{r}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>{[1,2,3,4,5].map(v => <div key={v} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.2 }}></div>)}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <button onClick={() => handleSave('mission-config', missionConfig)} className="login-btn"><Save size={18} /> บันทึกและเปิดกิจกรรม</button>
               </div>
            </motion.div>
          )}

          {activeTab === 'pitch-evaluator' && (
            <motion.div key="pe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-amber-light">Pitching Evaluator — ระบบให้คะแนน & AI Audit</div>
               <div className="lane-content grid-2" style={{ gridTemplateColumns: '250px 1fr' }}>
                  <div>
                     <h4 style={{ marginBottom: '1rem' }}>รายชื่อทีม ({teams.length})</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                        {teams.map(t => (
                           <div key={t.id} onClick={()=>setSelectedTeam(t)} className={`card ${selectedTeam?.id === t.id ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                             <div style={{ fontWeight: 600 }}>{t.name}</div>
                             <div style={{ fontSize: '0.625rem', opacity: 0.7 }}>ID: {t.id}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     {selectedTeam ? (
                        <>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3>ประเมินทีม: {selectedTeam.name}</h3>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', background: '#ecfdf5', color: '#065f46', border: 'none' }}>Approve</button>
                                <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#991b1b', border: 'none' }}>Reject</button>
                              </div>
                           </div>

                           {/* ─── Performance Overview: Radar Chart + 5×5 Matrix ─── */}
                           <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)', border: '1px solid #bbf7d0' }}>
                              <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534' }}>📊 Performance Overview <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#65a30d' }}>(5 ด้าน × 5 ผู้ประเมิน = 25 ช่อง)</span></h5>
                              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.4fr', gap: '1rem', marginTop: '0.75rem', alignItems: 'flex-start' }}>
                                 {/* Radar */}
                                 <div className="card" style={{ background: '#fff', textAlign: 'center' }}>
                                    <h6 style={{ marginBottom: 4, fontSize: '0.75rem', color: '#475569' }}>📡 RADAR CHART · 5 ด้าน</h6>
                                    <RadarChart
                                       data={SCORE_DIMENSIONS.map(d => matrixColAvg(selectedTeam.id, d) || 0)}
                                       labels={SCORE_DIMENSIONS.map(d => d.replace(' ', '\n'))}
                                    />
                                 </div>
                                 {/* 5×5 Matrix */}
                                 <div className="card" style={{ background: '#fff', overflowX: 'auto' }}>
                                    <h6 style={{ marginBottom: 4, fontSize: '0.75rem', color: '#475569' }}>🔢 MATRIX · 5 × 5 (รายผู้ประเมิน)</h6>
                                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4, fontSize: '0.7rem' }}>
                                       <thead>
                                          <tr>
                                             <th style={{ textAlign: 'left', padding: '4px', color: '#475569' }}>ผู้ประเมิน \ ด้าน</th>
                                             {SCORE_DIMENSIONS.map(d => (
                                                <th key={d} style={{ padding: '4px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>{d.split(' ')[0]}</th>
                                             ))}
                                             <th style={{ padding: '4px', color: '#475569', textAlign: 'center' }}>เฉลี่ย</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {EVALUATOR_ROLES.map(role => {
                                             const rowAvg = matrixRowAvg(selectedTeam.id, role);
                                             return (
                                                <tr key={role}>
                                                   <td style={{ padding: '4px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                                                      <span style={{ marginRight: 4 }}>{role === 'self' ? '🟢' : role === 'peer' ? '🟣' : role === 'teacher' ? '🟦' : role === 'sage' ? '🟡' : '🟪'}</span>
                                                      {t('eval_' + role)}
                                                   </td>
                                                   {SCORE_DIMENSIONS.map(d => {
                                                      const v = matrixCell(selectedTeam.id, role, d);
                                                      const c = cellColor(v);
                                                      return (
                                                         <td key={d} style={{ padding: '6px 4px', background: c.bg, color: c.fg, textAlign: 'center', borderRadius: 4, fontWeight: 600 }}>
                                                            {v == null ? '—' : v.toFixed(1)}
                                                         </td>
                                                      );
                                                   })}
                                                   <td style={{ padding: '6px 4px', background: cellColor(rowAvg).bg, color: cellColor(rowAvg).fg, textAlign: 'center', borderRadius: 4, fontWeight: 700 }}>
                                                      {rowAvg == null ? '—' : rowAvg.toFixed(2)}
                                                   </td>
                                                </tr>
                                             );
                                          })}
                                          {/* Column averages row */}
                                          <tr style={{ borderTop: '2px solid #cbd5e1' }}>
                                             <td style={{ padding: '6px 4px', fontWeight: 700, color: '#0f172a' }}>รวมเฉลี่ย</td>
                                             {SCORE_DIMENSIONS.map(d => {
                                                const v = matrixColAvg(selectedTeam.id, d);
                                                const c = cellColor(v);
                                                return (
                                                   <td key={d} style={{ padding: '6px 4px', background: c.bg, color: c.fg, textAlign: 'center', borderRadius: 4, fontWeight: 700, border: '1px solid #cbd5e1' }}>
                                                      {v == null ? '—' : v.toFixed(1)}
                                                   </td>
                                                );
                                             })}
                                             {(() => {
                                                const v = matrixOverall(selectedTeam.id);
                                                const c = cellColor(v);
                                                return (
                                                   <td style={{ padding: '6px 4px', background: c.bg, color: c.fg, textAlign: 'center', borderRadius: 4, fontWeight: 800, border: '2px solid #16a34a' }}>
                                                      ⭐ {v == null ? '—' : v.toFixed(2)}
                                                   </td>
                                                );
                                             })()}
                                          </tr>
                                       </tbody>
                                    </table>
                                    <div style={{ marginTop: 6, fontSize: '0.65rem', color: '#94a3b8', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                       <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#dcfce7', borderRadius: 2, marginRight: 3 }} />ดี (≥ 4.0)</span>
                                       <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fef9c3', borderRadius: 2, marginRight: 3 }} />ปานกลาง (3.0)</span>
                                       <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#ffedd5', borderRadius: 2, marginRight: 3 }} />ต้องพัฒนา (2.0)</span>
                                       <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fee2e2', borderRadius: 2, marginRight: 3 }} />ปรับปรุง (&lt; 2)</span>
                                       <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'transparent', border: '1px solid #cbd5e1', borderRadius: 2, marginRight: 3 }} />ยังไม่ประเมิน</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* --- AI Audit & Project Details --- */}
                           <div className="grid-2" style={{ alignItems: 'start' }}>
                              <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}><Cpu size={16} color="var(--color-purple)" /> AI Audit Logs</h5>
                                 <div style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    {selectedTeamData?.gateway?.aiLogs || 'ยังไม่มีข้อมูล AI Prompt Logs'}
                                 </div>
                              </div>
                              <div className="card" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}><Database size={16} color="var(--color-amber)" /> Project Data</h5>
                                 <div style={{ fontSize: '0.8125rem' }}>
                                    <p><strong>Module:</strong> {selectedTeamData?.['mission-inbox']?.module || '-'}</p>
                                    <p><strong>Product:</strong> {selectedTeamData?.['mission-inbox']?.product || '-'}</p>
                                    <p><strong>Wisdom:</strong> {selectedTeamData?.gateway?.wisdom || '-'}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="grid-2">
                              <div className="card">
                                 <h5 style={{ marginBottom: '0.5rem' }}>Prototype & BMC</h5>
                                 <p style={{ fontSize: '0.75rem' }}>{selectedTeamData?.gateway?.prototype || 'No prototype description'}</p>
                                 <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline' }}>{selectedTeamData?.gateway?.videoUrl || 'No Video Link'}</div>
                              </div>
                              <div className="card">
                                 <h5 style={{ marginBottom: '0.5rem' }}>Local Insights</h5>
                                 <p style={{ fontSize: '0.75rem' }}>{selectedTeamData?.collector?.interview || 'No interview logs'}</p>
                              </div>
                           </div>

                           {/* --- Scoring Section (Phase 8: course-aware rubric) --- */}
                           <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                              <h4 style={{ marginBottom: '0.5rem' }}>Scoring Matrix</h4>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                                 ใช้ rubric ของหลักสูตร <strong style={{ color: currentCourse.branding?.primaryColor }}>{currentCourse.name}</strong> ({(currentCourse.rubric || []).length} ด้าน)
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                 {(currentCourse.rubric || []).map(rDim => {
                                    const r = rDim.label;
                                    const key = `${selectedTeam.id}-${r}`;
                                    const current = evalScore[key] || 0;
                                    return (
                                       <div key={r}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                             <label className="ldt-stat-lbl">{r} {rDim.weight ? <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 400 }}>· {rDim.weight}%</span> : null}</label>
                                             <span style={{ fontSize: '0.75rem', fontWeight: 600, color: current ? 'var(--color-primary)' : '#94a3b8' }}>
                                                {current ? `${current} / 5` : 'ยังไม่ได้ให้คะแนน'}
                                             </span>
                                          </div>
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                             {[1,2,3,4,5].map(v => (
                                                <button
                                                   key={v}
                                                   onClick={() => setEvalScore(prev => ({ ...prev, [key]: v }))}
                                                   style={{ flex: 1, height: '32px', borderRadius: '6px', border: '1px solid var(--color-border)', background: current >= v ? 'var(--color-primary)' : 'white', color: current >= v ? 'white' : 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                   {v}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    );
                                 })}
                                 <textarea
                                    className="login-input"
                                    rows={3}
                                    placeholder="ข้อเสนอแนะเพิ่มเติมสำหรับทีม..."
                                    style={{ marginTop: '0.5rem' }}
                                    value={evalComment}
                                    onChange={e => setEvalComment(e.target.value)}
                                 />
                                 <button
                                    className="login-btn"
                                    style={{ background: 'var(--color-amber)' }}
                                    onClick={async () => {
                                       if (!user) { alert('กรุณาเข้าสู่ระบบก่อนบันทึกคะแนน'); return; }
                                       const scoresToSave = {};
                                       (currentCourse.rubric || []).forEach(rDim => {
                                          const dim = rDim.label;
                                          const v = evalScore[`${selectedTeam.id}-${dim}`];
                                          if (typeof v === 'number' && v > 0) scoresToSave[dim] = v;
                                       });
                                       if (Object.keys(scoresToSave).length === 0) {
                                          alert('กรุณาให้คะแนนอย่างน้อย 1 ด้าน');
                                          return;
                                       }
                                       try {
                                          await saveTeamScores(selectedTeam.id, scoresToSave, evalComment);
                                          alert(`บันทึกคะแนนประเมินสำเร็จ (${Object.keys(scoresToSave).length} ด้าน)`);
                                       } catch (err) {
                                          alert('Error: ' + err.message);
                                       }
                                    }}
                                 >
                                    <Star size={18} /> บันทึกคะแนนประเมิน
                                 </button>
                              </div>
                           </div>
                        </>
                     ) : (
                        <div style={{ textAlign: 'center', padding: '8rem 4rem' }}>
                           <Target size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                           <h3 style={{ opacity: 0.3 }}>เลือกทีมเพื่อเริ่มการประเมิน</h3>
                           <p style={{ color: 'var(--color-text-tertiary)' }}>ข้อมูลผลงานและ Prompt Logs จะแสดงที่นี่</p>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}



          {activeTab === 'teacher-reports' && (
            <motion.div key="tr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light">{t('header_report_center')}</div>
               <div className="lane-content">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                     {[
                       { id: 'R1', label: t('report_R1'), public: false },
                       { id: 'R2', label: t('report_R2'), public: false },
                       { id: 'R3', label: t('report_R3'), public: false },
                       { id: 'R4', label: t('report_R4'), public: false },
                       { id: 'R5', label: t('report_R5'), public: false },
                       { id: 'R6', label: t('report_R6'), public: true  }
                     ].map(r => (
                        <button key={r.id} onClick={()=>setReportType(r.id)} className={`card ${reportType === r.id ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem' }}>
                           {r.label}
                        </button>
                     ))}
                  </div>
                  {/* ───── R1: Score Summary ───── */}
                  {reportType === 'R1' && (() => {
                     const rows = (teams || []).filter(Boolean).map(tm => {
                        const rolesAvg = {};
                        ['self','peer','teacher','sage','ai'].forEach(r => {
                           const vals = SCORE_DIMENSIONS.map(d => matrixCell(tm.id, r, d)).filter(v => v != null);
                           rolesAvg[r] = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length) : null;
                        });
                        const overall = matrixOverall(tm.id);
                        return { team: tm.name, ...rolesAvg, overall };
                     });
                     return (
                        <div className="card" style={{ overflowX: 'auto' }}>
                           <h5>📊 R1 — สรุปคะแนนรวมทุกทีม</h5>
                           <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>เฉลี่ยคะแนน 5 ด้าน × 5 ผู้ประเมิน</p>
                           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                              <thead>
                                 <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>ทีม</th>
                                    {['self','peer','teacher','sage','ai'].map(r => (
                                       <th key={r} style={{ padding: '0.5rem', textAlign: 'center' }}>{t('eval_' + r)}</th>
                                    ))}
                                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>⭐ รวม</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {rows.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>ยังไม่มีทีมในระบบ</td></tr>
                                 ) : rows.map((r, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                                       <td style={{ padding: '0.5rem', fontWeight: 600 }}>{r.team}</td>
                                       {['self','peer','teacher','sage','ai'].map(role => {
                                          const v = r[role];
                                          const c = cellColor(v);
                                          return <td key={role} style={{ padding: '0.5rem', textAlign: 'center', background: c.bg, color: c.fg, fontWeight: 600 }}>{v == null ? '—' : v.toFixed(1)}</td>;
                                       })}
                                       <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 800, background: cellColor(r.overall).bg, color: cellColor(r.overall).fg }}>{r.overall == null ? '—' : r.overall.toFixed(2)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     );
                  })()}

                  {/* ───── R2: Idea & AI Prompt ───── */}
                  {reportType === 'R2' && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(teams || []).filter(Boolean).map(tm => {
                           const gw = (allSubmissionsModeration || []).find(s => String(s.team_id) === String(tm.id) && s.step === 'gateway')?.content || {};
                           const prompts = (gw.aiLogs || '').split('\n').filter(Boolean);
                           return (
                              <div key={tm.id} className="card">
                                 <h5>👥 {tm.name}</h5>
                                 <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>💡 ไอเดียที่เลือก:</strong> {gw.selectedIdea || gw.wisdom || '— ยังไม่มีข้อมูล —'}</p>
                                 <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>📝 AI Prompts ทั้งหมด: <strong>{prompts.length}</strong> รายการ · เฉลี่ยยาว <strong>{prompts.length ? Math.round(prompts.reduce((a,p)=>a+p.length,0)/prompts.length) : 0}</strong> ตัวอักษร</p>
                                 {prompts.length > 0 && (
                                    <details style={{ marginTop: '0.5rem' }}>
                                       <summary style={{ cursor: 'pointer', fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>ดู Prompts ทั้งหมด ▾</summary>
                                       <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.75rem' }}>
                                          {prompts.slice(0, 10).map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
                                       </ol>
                                    </details>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}

                  {/* ───── R3: Finance Integration (BMC) ───── */}
                  {reportType === 'R3' && (
                     <div className="card" style={{ overflowX: 'auto' }}>
                        <h5>💰 R3 — บูรณาการการเงิน (BMC)</h5>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                           <thead>
                              <tr style={{ background: '#f1f5f9' }}>
                                 <th style={{ padding: '0.5rem', textAlign: 'left' }}>ทีม</th>
                                 <th style={{ padding: '0.5rem' }}>กลุ่มลูกค้า (Customer)</th>
                                 <th style={{ padding: '0.5rem' }}>ช่องทาง (Channel)</th>
                                 <th style={{ padding: '0.5rem', textAlign: 'right' }}>ต้นทุน (บาท)</th>
                                 <th style={{ padding: '0.5rem', textAlign: 'right' }}>ราคา (บาท)</th>
                                 <th style={{ padding: '0.5rem', textAlign: 'right' }}>กำไร %</th>
                              </tr>
                           </thead>
                           <tbody>
                              {(teams || []).filter(Boolean).map(tm => {
                                 const gw = (allSubmissionsModeration || []).find(s => String(s.team_id) === String(tm.id) && s.step === 'gateway')?.content || {};
                                 const cost  = parseFloat(gw.bmcCost  || gw.cost  || 0);
                                 const price = parseFloat(gw.bmcPrice || gw.price || 0);
                                 const margin = (cost && price) ? (((price - cost) / price) * 100) : null;
                                 return (
                                    <tr key={tm.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                       <td style={{ padding: '0.5rem', fontWeight: 600 }}>{tm.name}</td>
                                       <td style={{ padding: '0.5rem', fontSize: '0.75rem' }}>{gw.bmcCustomer || '—'}</td>
                                       <td style={{ padding: '0.5rem', fontSize: '0.75rem' }}>{gw.bmcChannel || '—'}</td>
                                       <td style={{ padding: '0.5rem', textAlign: 'right' }}>{cost ? cost.toLocaleString() : '—'}</td>
                                       <td style={{ padding: '0.5rem', textAlign: 'right' }}>{price ? price.toLocaleString() : '—'}</td>
                                       <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, color: margin == null ? '#94a3b8' : margin > 30 ? '#16a34a' : margin > 0 ? '#d97706' : '#dc2626' }}>{margin == null ? '—' : margin.toFixed(1) + '%'}</td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>
                  )}

                  {/* ───── R4: Activity Progress ───── */}
                  {reportType === 'R4' && (() => {
                     const steps = [
                        { id: 'team-setup',    label: 'ตั้งทีม' },
                        { id: 'mission-inbox', label: 'รับโจทย์' },
                        { id: 'collector',     label: 'ลงพื้นที่' },
                        { id: 'gateway',       label: 'ส่งงาน' }
                     ];
                     return (
                        <div className="card" style={{ overflowX: 'auto' }}>
                           <h5>📅 R4 — ความคืบหน้ากิจกรรม (รายทีม)</h5>
                           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                              <thead>
                                 <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>ทีม</th>
                                    {steps.map(s => <th key={s.id} style={{ padding: '0.5rem' }}>{s.label}</th>)}
                                    <th style={{ padding: '0.5rem' }}>ความคืบหน้า</th>
                                    <th style={{ padding: '0.5rem' }}>🚩 Flags</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {(teams || []).filter(Boolean).map(tm => {
                                    const stepsDone = new Set((allSubmissionsModeration || []).filter(s => String(s.team_id) === String(tm.id)).map(s => s.step));
                                    const completed = steps.filter(s => stepsDone.has(s.id)).length;
                                    const pct = (completed / steps.length) * 100;
                                    const teamFlags = moderationFlags.filter(f => String(f.team_id) === String(tm.id) && f.status === 'pending').length;
                                    return (
                                       <tr key={tm.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{tm.name}</td>
                                          {steps.map(s => (
                                             <td key={s.id} style={{ padding: '0.5rem', textAlign: 'center' }}>{stepsDone.has(s.id) ? '✅' : '⬜'}</td>
                                          ))}
                                          <td style={{ padding: '0.5rem' }}>
                                             <div style={{ background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', height: 8 }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#16a34a' : '#0ea5e9' }} />
                                             </div>
                                             <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{completed}/{steps.length}</span>
                                          </td>
                                          <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 700, color: teamFlags > 0 ? '#dc2626' : '#94a3b8' }}>{teamFlags}</td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>
                     );
                  })()}

                  {/* ───── R5: Individual Summary (Peer Scores per member) ───── */}
                  {reportType === 'R5' && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>คะแนน Peer Evaluation รายบุคคล (จาก {peerScoresAll.length} รายการ)</p>
                        {(teams || []).filter(Boolean).map(tm => {
                           const teamPeerScores = peerScoresAll.filter(p => String(p.target_team_id) === String(tm.id));
                           const byTarget = teamPeerScores.reduce((acc, p) => {
                              const k = p.target_user_id || p.target_name || 'unknown';
                              if (!acc[k]) acc[k] = { name: p.target_name || k, scores: [] };
                              acc[k].scores.push(Number(p.score));
                              return acc;
                           }, {});
                           const members = Object.values(byTarget);
                           return (
                              <div key={tm.id} className="card">
                                 <h5>👥 {tm.name}</h5>
                                 {members.length === 0 ? (
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>ยังไม่มี Peer evaluation</p>
                                 ) : (
                                    <table style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                       <thead>
                                          <tr style={{ background: '#f8fafc' }}>
                                             <th style={{ padding: '0.4rem', textAlign: 'left' }}>สมาชิก</th>
                                             <th style={{ padding: '0.4rem', textAlign: 'center' }}>จำนวน peer ที่ประเมิน</th>
                                             <th style={{ padding: '0.4rem', textAlign: 'center' }}>คะแนนเฉลี่ย</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {members.map((m, i) => {
                                             const avg = m.scores.reduce((a,b)=>a+b,0) / m.scores.length;
                                             const c = cellColor(avg);
                                             return (
                                                <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                   <td style={{ padding: '0.4rem' }}>{m.name}</td>
                                                   <td style={{ padding: '0.4rem', textAlign: 'center' }}>{m.scores.length}</td>
                                                   <td style={{ padding: '0.4rem', textAlign: 'center', background: c.bg, color: c.fg, fontWeight: 700 }}>{avg.toFixed(2)}</td>
                                                </tr>
                                             );
                                          })}
                                       </tbody>
                                    </table>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}

                  {/* ───── R6: Portfolio (Public Showcase) ───── */}
                  {reportType === 'R6' && (
                     <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>[Public Link: https://ai-storyteller-9dc3a.web.app/]</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                           {(teams || []).filter(Boolean).map(tm => {
                              const gw = (allSubmissionsModeration || []).find(s => String(s.team_id) === String(tm.id) && s.step === 'gateway')?.content || {};
                              const overall = matrixOverall(tm.id);
                              const c = cellColor(overall);
                              return (
                                 <div key={tm.id} className="card" style={{ borderLeft: `4px solid ${c.fg}`, padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                       <h5 style={{ margin: 0 }}>👥 {tm.name}</h5>
                                       <span style={{ background: c.bg, color: c.fg, padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>⭐ {overall == null ? '—' : overall.toFixed(2)}</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#475569' }}><strong>ไอเดีย:</strong> {gw.selectedIdea || '—'}</p>
                                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#64748b' }}>{(gw.wisdom || gw.traditionalWisdom || '').slice(0, 120)}{(gw.wisdom || '').length > 120 ? '...' : ''}</p>
                                    {gw.videoUrl && <a href={gw.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#0ea5e9', display: 'inline-block', marginTop: '0.5rem' }}>▶ ดูวิดีโอ Pitching</a>}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'public-portfolio' && (
            <motion.div key="pp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-primary-light">R6 Portfolio (Public Showcase)</div>
               <div className="lane-content">
                  <div className="grid-2">
                     <div className="card">
                        <h5>คลังผลงานรวม (Public)</h5>
                        <p style={{ fontSize: '0.8125rem', marginTop: '1rem' }}>หน้านี้ทุกคนสามารถเข้าถึงได้เพื่อดูผลงานและความสำเร็จของทีมต่างๆ</p>
                        <button className="login-btn" style={{ marginTop: '1.5rem' }}>คัดลอกลิงก์แชร์ผลงาน</button>
                     </div>
                     <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
                        <LayoutGrid size={32} style={{ opacity: 0.2 }} />
                        <p style={{ fontSize: '0.75rem', marginTop: '1rem' }}>เลือกทีมเพื่อดู Portfolio...</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'worksheets' && (() => {
            const ws = (currentCourse.worksheets || []).find(w => w.id === selectedWorksheetId);
            const submittedIds = new Set(worksheetSubmissions.map(s => s.worksheet_id));
            return (
            <motion.div key="ws" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header" style={{ background: 'linear-gradient(90deg, ' + (currentCourse.branding?.primaryColor || '#16a34a') + '22 0%, ' + (currentCourse.branding?.secondaryColor || '#0ea5e9') + '22 100%)', color: '#0f172a' }}>
                  <span style={{ fontSize: '1.5rem' }}>{currentCourse.branding?.logoEmoji}</span>
                  <strong>{currentCourse.name}</strong> · Worksheets {worksheetSubmissions.length}/{currentCourse.worksheets?.length || 0} ส่งแล้ว
               </div>
               <div className="lane-content" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Left: stage + worksheet list */}
                  <div style={{ flex: '0 0 320px', maxHeight: '70vh', overflowY: 'auto' }}>
                     {(!currentCourse.worksheets || currentCourse.worksheets.length === 0) ? (
                        <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed', padding: '2rem' }}>
                           <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>หลักสูตรนี้ยังไม่มี worksheets — admin สามารถเพิ่มได้ใน Course Admin → 📝 Worksheets</p>
                        </div>
                     ) : (
                        (currentCourse.stages || []).map(stage => {
                           const wsInStage = (currentCourse.worksheets || []).filter(w => w.stageId === stage.id);
                           if (wsInStage.length === 0) return null;
                           return (
                              <div key={stage.id} className="card" style={{ marginBottom: '0.5rem', padding: '0.5rem' }}>
                                 <div style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.4rem', color: '#475569' }}>
                                    {stage.emoji} {stage.label}
                                 </div>
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {wsInStage.map(w => {
                                       const isSelected = selectedWorksheetId === w.id;
                                       const isDone = submittedIds.has(w.id);
                                       return (
                                          <button key={w.id} onClick={() => setSelectedWorksheetId(w.id)}
                                             style={{
                                                padding: '0.5rem 0.6rem', textAlign: 'left',
                                                border: isSelected ? '2px solid ' + (currentCourse.branding?.primaryColor || '#16a34a') : '1px solid #e2e8f0',
                                                background: isSelected ? '#f0fdf4' : '#fff',
                                                borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem',
                                                display: 'flex', alignItems: 'center', gap: 6
                                             }}>
                                             <span style={{ fontSize: '1.1rem' }}>{w.icon || '📝'}</span>
                                             <span style={{ flex: 1 }}>{w.labelTH || w.label}</span>
                                             {isDone && <span style={{ background: '#16a34a', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: 8, fontSize: '0.65rem', fontWeight: 700 }}>✓</span>}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>
                  {/* Right: selected worksheet form */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                     {!myTeamIdForWorksheets ? (
                        <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '3rem' }}>
                           <p style={{ color: '#94a3b8' }}>คุณยังไม่ได้สังกัดทีม — กรุณาให้ครูเพิ่มคุณเข้าทีมก่อน</p>
                        </div>
                     ) : !ws ? (
                        <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '3rem' }}>
                           <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                           <h3 style={{ opacity: 0.5 }}>เลือก Worksheet จากรายการด้านซ้าย</h3>
                           <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>หลักสูตร <strong>{currentCourse.name}</strong> มี <strong>{currentCourse.worksheets?.length || 0} worksheets</strong> ใน <strong>{currentCourse.stages?.length || 0} stages</strong></p>
                        </div>
                     ) : (
                        <div className="card">
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 8 }}>
                              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                                 <span style={{ fontSize: '1.8rem' }}>{ws.icon}</span>
                                 {ws.labelTH || ws.label}
                              </h3>
                              <div style={{ display: 'flex', gap: 6 }}>
                                 <button onClick={saveCurrentWorksheet} disabled={worksheetSaving} className="login-btn" style={{ background: '#16a34a', padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                                    {worksheetSaving ? '⏳ กำลังบันทึก...' : '💾 บันทึก Worksheet'}
                                 </button>
                                 <button onClick={() => setSelectedWorksheetId(null)} className="login-btn" style={{ background: '#64748b', padding: '0.45rem 1rem', fontSize: '0.85rem' }}>ปิด</button>
                              </div>
                           </div>
                           {submittedIds.has(ws.id) && (
                              <div style={{ padding: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, marginBottom: '0.75rem', fontSize: '0.75rem', color: '#166534' }}>
                                 ✅ ส่งแล้ว · แก้ไขเพิ่มเติมแล้วกด "บันทึก" อีกครั้งจะ overwrite ของเดิม
                              </div>
                           )}
                           <GenericForm schema={ws} value={worksheetFormDraft} onChange={setWorksheetFormDraft} />
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
            );
          })()}

          {activeTab === 'help' && (
            <motion.div key="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane manual-print">
               <div className="lane-header bg-primary-light" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><BookOpen size={16} /> คู่มือการใช้งาน R-Eco-Pilot · User Manual</span>
                  <button onClick={() => window.print()} className="no-print" style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                     <Printer size={14} /> {t('help_print')}
                  </button>
               </div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 1000, margin: '0 auto' }}>
                  {/* ── Cover ── */}
                  <div className="card" style={{ background: 'linear-gradient(135deg, ' + appConfig.primaryColor + '22 0%, ' + appConfig.secondaryColor + '22 100%)', border: '2px solid ' + appConfig.primaryColor, textAlign: 'center', padding: '2rem' }}>
                     <div style={{ fontSize: '3rem', marginBottom: 4 }}>{appConfig.logoEmoji} 📖</div>
                     <h2 style={{ color: appConfig.primaryColor, margin: '0.5rem 0' }}>{appConfig.brandName}</h2>
                     <p style={{ color: '#475569', fontSize: '0.9rem' }}>{appConfig.brandTagline}</p>
                     <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>คู่มือการใช้งานสำหรับ <strong>นักเรียน · ครู · ปราชญ์ชาวบ้าน · ผู้ดูแลระบบ</strong></p>
                     <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>v1.0 · 4-Identities AI Storytellers</p>
                  </div>

                  {/* ── TOC ── */}
                  <div className="card">
                     <h4>📚 สารบัญ (Table of Contents)</h4>
                     <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
                        <li><a href="#quick-start"  style={{ color: '#0369a1' }}>🚀 เริ่มต้นใช้งาน (Quick Start)</a></li>
                        <li><a href="#student"     style={{ color: '#0369a1' }}>👨‍🎓 สำหรับนักเรียน (Student)</a></li>
                        <li><a href="#teacher"     style={{ color: '#0369a1' }}>👩‍🏫 สำหรับครู (Teacher / Facilitator)</a></li>
                        <li><a href="#sage"        style={{ color: '#0369a1' }}>🧓 สำหรับปราชญ์ (Sage / Local Expert)</a></li>
                        <li><a href="#admin"       style={{ color: '#0369a1' }}>⚙️ สำหรับผู้ดูแลระบบ (Admin)</a></li>
                        <li><a href="#pitching"    style={{ color: '#0369a1' }}>🎤 เตรียม Pitching Presentation</a></li>
                        <li><a href="#trouble"     style={{ color: '#0369a1' }}>🔧 แก้ปัญหา (Troubleshooting)</a></li>
                        <li><a href="#faq"         style={{ color: '#0369a1' }}>❓ คำถามที่พบบ่อย (FAQ)</a></li>
                     </ol>
                  </div>

                  {/* ── 1. Quick Start ── */}
                  <div id="quick-start" className="card">
                     <h3 style={{ color: appConfig.primaryColor, borderBottom: `3px solid ${appConfig.primaryColor}`, paddingBottom: 6 }}>🚀 1. เริ่มต้นใช้งาน (Quick Start)</h3>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                        {[
                           { n: 1, icon: '🌐', title: 'เปิดเว็บ', desc: 'เข้า ai-storyteller-9dc3a.web.app' },
                           { n: 2, icon: '🔐', title: 'เข้าสู่ระบบ', desc: 'ใช้ username + password ที่ครูสร้างให้' },
                           { n: 3, icon: '🎯', title: 'ดู Mission', desc: 'รับโจทย์จาก Mission Inbox' },
                           { n: 4, icon: '📸', title: 'ลงพื้นที่', desc: 'เก็บข้อมูล + สัมภาษณ์ปราชญ์' },
                           { n: 5, icon: '🤖', title: 'ใช้ AI', desc: 'Prompt + บันทึก Audit Log' },
                           { n: 6, icon: '📤', title: 'ส่งงาน', desc: 'Submit ผ่าน Gateway 7 ขั้นตอน' },
                           { n: 7, icon: '🎤', title: 'Pitching', desc: 'นำเสนอ + รับคะแนน 5×5 Matrix' }
                        ].map(s => (
                           <div key={s.n} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
                              <div style={{ background: appConfig.primaryColor, color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: 6 }}>{s.n}</div>
                              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: 4 }}>{s.title}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>{s.desc}</div>
                           </div>
                        ))}
                     </div>
                     <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: 6, marginTop: '0.75rem', fontSize: '0.8rem' }}>
                        💡 <strong>Tip:</strong> ระบบรองรับ Thai/English — กดปุ่ม <strong>Thai TH | English EN</strong> ที่ header
                     </div>
                  </div>

                  {/* ── 2. Student ── */}
                  <div id="student" className="card">
                     <h3 style={{ color: '#0ea5e9', borderBottom: '3px solid #0ea5e9', paddingBottom: 6 }}>👨‍🎓 2. สำหรับนักเรียน (Student)</h3>
                     <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>คุณคือ <strong>AI Storyteller</strong> — นำเสนอภูมิปัญญาท้องถิ่นผ่านการเล่าเรื่องด้วย AI อย่างมีจริยธรรม</p>

                     <h4 style={{ marginTop: '1rem', color: '#0369a1' }}>📋 เมนูที่คุณใช้</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li><strong>จัดการทีม (Explorer UI)</strong> — ตั้งทีม, เลือก mascot, ดูสถานะ 4 ขั้นตอน</li>
                        <li><strong>รับโจทย์ (Mission Inbox)</strong> — รับ mission ที่ครูมอบหมาย เลือก identity 1 ใน 4</li>
                        <li><strong>เก็บข้อมูล (On-site Collector)</strong> — บันทึกการสัมภาษณ์ปราชญ์ + ภาพ + GPS</li>
                        <li><strong>ส่งงาน (Submission Gateway)</strong> — 7 ขั้น: wisdom → environment → brainstorm → prototype → video → BMC → AI logs</li>
                        <li><strong>ศูนย์ประเมิน (Evaluation Hub)</strong> — Self-assessment (5 ด้าน) + Peer evaluation</li>
                        <li><strong>รายงาน R6</strong> — ดู portfolio ของทีม</li>
                     </ul>

                     <h4 style={{ marginTop: '1rem', color: '#0369a1' }}>🎯 4 Identities ของ Green Rayong</h4>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginTop: '0.5rem' }}>
                        {[
                           { emoji: '🌳', name: 'สวน', color: '#16a34a' },
                           { emoji: '🌲', name: 'ป่า',  color: '#15803d' },
                           { emoji: '🌾', name: 'นา',  color: '#ca8a04' },
                           { emoji: '🌊', name: 'เล',  color: '#0ea5e9' }
                        ].map(id => (
                           <div key={id.name} style={{ padding: '0.6rem', background: id.color + '15', border: '1px solid ' + id.color, borderRadius: 6, textAlign: 'center' }}>
                              <div style={{ fontSize: '1.8rem' }}>{id.emoji}</div>
                              <div style={{ fontWeight: 700, color: id.color }}>{id.name}</div>
                           </div>
                        ))}
                     </div>

                     <h4 style={{ marginTop: '1rem', color: '#0369a1' }}>✅ Best Practices</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li><strong>เคารพปราชญ์เสมอ</strong> — ขออนุญาตก่อนสัมภาษณ์ ใส่ชื่อใน citation</li>
                        <li><strong>Cross-check ทุก AI output</strong> — AI hallucination เกิดได้ บันทึกใน AI Audit Log</li>
                        <li><strong>Prompt = Role + Context + Format</strong> — สูตร 3 ส่วนทำให้ AI ตอบดีขึ้น 3 เท่า</li>
                        <li><strong>อย่า Copy-Paste</strong> AI output — แก้ไข+ใส่ voice ของคุณเอง</li>
                     </ul>
                  </div>

                  {/* ── 3. Teacher ── */}
                  <div id="teacher" className="card">
                     <h3 style={{ color: '#16a34a', borderBottom: '3px solid #16a34a', paddingBottom: 6 }}>👩‍🏫 3. สำหรับครู (Teacher / Facilitator)</h3>
                     <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>คุณคือ <strong>AI Literacy Coach</strong> — สร้างโจทย์, ติดตามทีม, ประเมิน Pitching, และส่งเสริมจริยธรรม AI</p>

                     <h4 style={{ marginTop: '1rem', color: '#166534' }}>📋 เมนูที่คุณใช้</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li><strong>แดชบอร์ดเรียลไทม์</strong> — ดู Live Feed, จัดการทีม, Good Prompt Library, Rubric, EVAL-MATRIX</li>
                        <li><strong>สร้างโจทย์ (Mission Builder)</strong> — Cascade dropdown: Identity → Area → Sub-area</li>
                        <li><strong>ส่งงาน (Submission Gateway)</strong> — ดู submissions ของทุกทีม</li>
                        <li><strong>บันทึก AI</strong> — Run AI Audit per team (heuristic + Claude) + Quick Prompt feedback</li>
                        <li><strong>ประเมิน Pitching</strong> — ให้คะแนน 5 ด้าน + Radar + 5×5 Matrix</li>
                        <li><strong>รายงาน R1-R6</strong> — สรุปคะแนน, ไอเดีย, การเงิน, ความคืบหน้า, รายบุคคล, portfolio</li>
                     </ul>

                     <h4 style={{ marginTop: '1rem', color: '#166534' }}>📊 Rubric 5 ด้าน × 5 ระดับ</h4>
                     <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: 8 }}>
                        <thead>
                           <tr style={{ background: '#f1f5f9' }}>
                              <th style={{ padding: '0.4rem', textAlign: 'left' }}>ด้าน</th>
                              <th style={{ padding: '0.4rem', textAlign: 'left' }}>เกณฑ์</th>
                           </tr>
                        </thead>
                        <tbody>
                           {[
                              ['AI Prompting',  'Role-based + Context + Format · Audit Log ครบ'],
                              ['Local Wisdom',  'สัมภาษณ์ปราชญ์จริง · Cross-check ไม่มี Hallucination'],
                              ['Creativity',    'ไอเดียใหม่ · ใช้ AI ช่วย Iterate ไม่ใช่ Copy'],
                              ['Business Plan', 'BMC ครบ · Cost/Price/Customer · SROI'],
                              ['Storytelling',  '2 ภาษา · Soft Power ระยอง · Engagement']
                           ].map(([dim, crit]) => (
                              <tr key={dim} style={{ borderTop: '1px solid #e2e8f0' }}>
                                 <td style={{ padding: '0.4rem', fontWeight: 600 }}>{dim}</td>
                                 <td style={{ padding: '0.4rem' }}>{crit}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>5 ระดับ: ปรับปรุง · พอใช้ · ปานกลาง · ดี · ดีเยี่ยม (TPQI L4 = Impact Creator)</p>
                  </div>

                  {/* ── 4. Sage ── */}
                  <div id="sage" className="card">
                     <h3 style={{ color: '#ca8a04', borderBottom: '3px solid #ca8a04', paddingBottom: 6 }}>🧓 4. สำหรับปราชญ์ (Sage / Local Expert)</h3>
                     <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>คุณคือ <strong>ภูมิปัญญาที่มีชีวิต</strong> — ผู้ส่งต่อความรู้และให้คะแนนความถูกต้องของเรื่องราว</p>

                     <h4 style={{ marginTop: '1rem', color: '#854d0e' }}>📋 เมนูที่คุณใช้</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li><strong>ประเมิน Pitching</strong> — ดูผลงานของแต่ละทีม + ให้คะแนน 5 ด้าน (focus: Local Wisdom)</li>
                        <li><strong>รายงาน R6 (Portfolio)</strong> — ดูผลงานเด่นและความสำเร็จของทุกทีม</li>
                     </ul>

                     <h4 style={{ marginTop: '1rem', color: '#854d0e' }}>💡 จุดที่ปราชญ์ควรเน้น</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li>ตรวจสอบความถูกต้องของข้อมูลภูมิปัญญา (Anti-Hallucination)</li>
                        <li>ดูว่านักเรียนให้เครดิตปราชญ์ครบหรือไม่</li>
                        <li>ประเมินวิธีนำเสนอ — เคารพวิถีชุมชน ไม่ใช้ภาพล้อเลียน</li>
                     </ul>
                  </div>

                  {/* ── 5. Admin ── */}
                  <div id="admin" className="card">
                     <h3 style={{ color: '#7c3aed', borderBottom: '3px solid #7c3aed', paddingBottom: 6 }}>⚙️ 5. สำหรับผู้ดูแลระบบ (Admin)</h3>

                     <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>📋 Sub-tabs ใน Admin Panel</h4>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginTop: 8 }}>
                        {[
                           { name: 'Management',  emoji: '👥', desc: 'CRUD users + teams · Import CSV · Reset password' },
                           { name: 'Session',     emoji: '📅', desc: 'Phase manager · Open/Close submission · Deadline' },
                           { name: 'Moderation',  emoji: '🛡️', desc: 'Cultural Ethics Audit · 6 หมวด 17 rules · Approve/Reject' },
                           { name: 'Branding',    emoji: '🎨', desc: 'White-label · 4 presets · Custom brand · Reset' },
                           { name: 'Settings',    emoji: '⚙️', desc: 'Claude API key · Looker URL · Backup · Seed Demo' },
                           { name: 'Reports',     emoji: '📊', desc: 'R1-R6 reports cross-team' }
                        ].map(s => (
                           <div key={s.name} style={{ padding: '0.6rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 6 }}>
                              <div style={{ fontSize: '1.3rem' }}>{s.emoji}</div>
                              <div style={{ fontWeight: 700, color: '#5b21b6' }}>{s.name}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.desc}</div>
                           </div>
                        ))}
                     </div>

                     <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>🔧 ขั้นตอนตั้งระบบครั้งแรก</h4>
                     <ol style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
                        <li>Settings → Seed Firebase Data (สร้างข้อมูลเริ่มต้น)</li>
                        <li>Branding → เลือก preset หรือ custom brand (ชื่อ, สี, logo)</li>
                        <li>Session → เพิ่ม/แก้ phases ตามแผนการเรียน + ตั้ง deadline</li>
                        <li>Management → Import users (admin/teacher/student/sage) ผ่าน CSV</li>
                        <li>Settings → ตั้ง Claude API key (optional, เพราะมี Demo Mode)</li>
                        <li>Settings → วาง Looker Studio Embed URL (optional)</li>
                     </ol>
                  </div>

                  {/* ── 6. Pitching Prep ── */}
                  <div id="pitching" className="card">
                     <h3 style={{ color: '#dc2626', borderBottom: '3px solid #dc2626', paddingBottom: 6 }}>🎤 6. เตรียม Pitching Presentation</h3>

                     <h4 style={{ marginTop: '1rem', color: '#991b1b' }}>📝 Checklist ก่อน Pitching</h4>
                     <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
                        <li>✅ <strong>ผลงานครบ 7 ขั้น</strong> ใน Submission Gateway</li>
                        <li>✅ <strong>AI Audit Log ครบ</strong> ทุก prompt ที่ใช้ (เปิด AI Audit Logbook ดู score)</li>
                        <li>✅ <strong>Self + Peer Evaluation</strong> เสร็จก่อนวัน Pitching</li>
                        <li>✅ <strong>BMC สมบูรณ์</strong> — cost, price, customer, channel</li>
                        <li>✅ <strong>วิดีโอ Pitching ≤ 5 นาที</strong> — link ใน Submission Gateway</li>
                        <li>✅ <strong>ภาษา TH + EN</strong> — Sub-title หรือ Dual-language slide</li>
                     </ul>

                     <h4 style={{ marginTop: '1rem', color: '#991b1b' }}>📊 คะแนนรวม 100% มาจากไหน</h4>
                     <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: 6, fontSize: '0.85rem' }}>
                        Self 10% · Peer 15% · Teacher 35% · Sage 25% · AI 15% = <strong>100%</strong><br/>
                        × 5 ด้าน (AI Prompting · Local Wisdom · Creativity · Business · Storytelling)<br/>
                        <strong>เป้าหมาย:</strong> ≥ 4.0/5.0 ในทุกด้าน = TPQI Level 4 (Impact Creator)
                     </div>
                  </div>

                  {/* ── 7. Troubleshooting ── */}
                  <div id="trouble" className="card">
                     <h3 style={{ color: '#0891b2', borderBottom: '3px solid #0891b2', paddingBottom: 6 }}>🔧 7. แก้ปัญหา (Troubleshooting)</h3>
                     <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: 8 }}>
                        <thead>
                           <tr style={{ background: '#f0f9ff' }}>
                              <th style={{ padding: '0.4rem', textAlign: 'left' }}>ปัญหา</th>
                              <th style={{ padding: '0.4rem', textAlign: 'left' }}>วิธีแก้</th>
                           </tr>
                        </thead>
                        <tbody>
                           {[
                              ['Login ไม่ได้', 'ติดต่อ admin · ใช้รหัส default: student123/teacher123 ถ้าใช้ Demo Mode'],
                              ['ข้อมูลไม่อัพเดต', 'รีโหลดหน้า (F5) · Firestore ใช้ real-time แต่บางครั้งต้อง refresh'],
                              ['AI Audit ไม่ทำงาน', 'ตั้ง Claude API Key ใน Admin → Settings · หรือใช้ Demo Mode (mock heuristic)'],
                              ['คะแนนไม่ปรากฏใน Matrix', 'ต้องมี evaluator ครบทุก role: self + peer + teacher + sage + ai'],
                              ['Looker Dashboard ว่าง', 'Admin → Settings → วาง embed URL จาก Looker Studio Share → Embed'],
                              ['ภาษาไม่เปลี่ยน', 'กดปุ่ม Thai TH / English EN ใน header · บางหน้ายังไม่ i18n เต็ม']
                           ].map(([p, s]) => (
                              <tr key={p} style={{ borderTop: '1px solid #bae6fd' }}>
                                 <td style={{ padding: '0.4rem', fontWeight: 600 }}>{p}</td>
                                 <td style={{ padding: '0.4rem' }}>{s}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* ── 8. FAQ ── */}
                  <div id="faq" className="card">
                     <h3 style={{ color: '#65a30d', borderBottom: '3px solid #65a30d', paddingBottom: 6 }}>❓ 8. คำถามที่พบบ่อย (FAQ)</h3>
                     {[
                        ['Demo Mode คืออะไร?', 'ระบบมี Mock AI Audit ที่ทำงานจาก heuristic locally โดยไม่ต้องมี Claude API Key — เหมาะสำหรับ demo presentation'],
                        ['ข้อมูลเก็บที่ไหน?',     'Firebase Firestore (cloud database) · sync real-time ทุก device'],
                        ['ใช้ฟรีไหม?',          'ใช้ฟรี (Firebase Spark plan) · ถ้าเปิด Claude API จะมีค่าใช้จ่ายตามจำนวน tokens'],
                        ['Branding เปลี่ยนยังไง?', 'Admin → Branding → เลือก preset (Rayong/Doi Saket/Phuket/Ayutthaya) หรือ custom brand'],
                        ['Backup ข้อมูลยังไง?',  'Admin → Settings → Download Backup JSON · ดาวน์โหลดทุกอย่างเป็นไฟล์ .json'],
                        ['ลบทีม/นักเรียนได้ไหม?', 'Admin → Management → กดไอคอน 🗑 ข้างชื่อทีม/user (ระวัง — undo ไม่ได้)']
                     ].map(([q, a]) => (
                        <details key={q} style={{ marginTop: 8, padding: 8, background: '#f7fee7', borderRadius: 6 }}>
                           <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>{q}</summary>
                           <p style={{ marginTop: 6, fontSize: '0.85rem', color: '#475569' }}>{a}</p>
                        </details>
                     ))}
                  </div>

                  <div className="card no-print" style={{ background: '#f8fafc', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                     <p>💡 <strong>กดปุ่ม "{t('help_print')}"</strong> ด้านบนเพื่อพิมพ์หรือ save เป็น PDF</p>
                     <p style={{ marginTop: 6 }}>🔗 GitHub: <a href="https://github.com/chenjopmapech347/Rayong-AI-Storyteller" target="_blank" rel="noreferrer">chenjopmapech347/Rayong-AI-Storyteller</a></p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'ai-audit-log' && (
            <motion.div key="aal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light"><ShieldCheck size={16} /> AI Audit Logbook — Anti-Hallucination &amp; Prompt Quality</div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Intro */}
                  <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                     <h5 style={{ color: '#1e40af' }}>🛡️ AI Audit — Heuristic + AI Analysis</h5>
                     <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#1e40af' }}>
                        ระบบจะวิเคราะห์ Prompt ของทีม (Role / Context / Format) · เช็ค Hallucination (ภูมิปัญญา vs สัมภาษณ์) · ให้คะแนน Tier (L1-L4 → TPQI) · แนะนำการพัฒนา · บันทึกผลลง Firestore (ai_audits)
                     </p>
                     <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#1e3a8a' }}>
                        💡 <strong>Demo Mode:</strong> ถ้ายังไม่ได้ตั้ง Claude API Key ใน Admin → Settings ระบบจะใช้ Mock Audit จาก heuristic locally (ไม่เรียก API)
                     </p>
                  </div>

                  {/* Run Audit on Team */}
                  <div className="card">
                     <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔍 Run Full AI Audit</h5>
                     <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', flexWrap: 'wrap' }}>
                        <select value={selectedAuditTeam} onChange={e => setSelectedAuditTeam(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 200 }}>
                           <option value="">-- เลือกทีม --</option>
                           {(teams || []).map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                        </select>
                        <button onClick={runAiAuditOnTeam} disabled={auditingAi || !selectedAuditTeam} className="login-btn" style={{ background: '#7c3aed', width: 'auto', padding: '0.5rem 1.5rem' }}>
                           {auditingAi ? '⏳ กำลัง Audit...' : '🚀 Run AI Audit'}
                        </button>
                     </div>
                  </div>

                  {/* Latest Audit Result Preview */}
                  {lastAuditResult && (
                    <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                       <h5 style={{ color: '#166534' }}>✅ ผล Audit ล่าสุด — {lastAuditResult.team_name}</h5>
                       <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#166534', fontStyle: 'italic' }}>{lastAuditResult.summary}</p>
                       {lastAuditResult.strengths?.length > 0 && (
                          <div style={{ marginTop: '0.75rem' }}>
                             <strong style={{ fontSize: '0.75rem', color: '#166534' }}>💪 จุดแข็ง:</strong>
                             <ul style={{ fontSize: '0.75rem', marginTop: 4, paddingLeft: '1.2rem', color: '#166534' }}>
                                {lastAuditResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                          </div>
                       )}
                       {lastAuditResult.concerns?.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                             <strong style={{ fontSize: '0.75rem', color: '#991b1b' }}>⚠️ ข้อกังวล:</strong>
                             <ul style={{ fontSize: '0.75rem', marginTop: 4, paddingLeft: '1.2rem', color: '#991b1b' }}>
                                {lastAuditResult.concerns.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                          </div>
                       )}
                       {lastAuditResult.recommendations?.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                             <strong style={{ fontSize: '0.75rem', color: '#0369a1' }}>📝 ข้อเสนอแนะ:</strong>
                             <ul style={{ fontSize: '0.75rem', marginTop: 4, paddingLeft: '1.2rem', color: '#0369a1' }}>
                                {lastAuditResult.recommendations.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                          </div>
                       )}
                       {lastAuditResult.teaching_points?.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                             <strong style={{ fontSize: '0.75rem', color: '#7c2d12' }}>👩‍🏫 ครู:</strong>
                             <ul style={{ fontSize: '0.75rem', marginTop: 4, paddingLeft: '1.2rem', color: '#7c2d12' }}>
                                {lastAuditResult.teaching_points.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                          </div>
                       )}
                    </div>
                  )}

                  {/* Quick Prompt Feedback Tool */}
                  <div className="card">
                     <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⚡ ทดสอบคุณภาพ Prompt</h5>
                     <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>วาง prompt ใด ๆ → AI จะให้ feedback ทันที (ไม่บันทึก)</p>
                     <textarea
                        value={promptToTest}
                        onChange={e => setPromptToTest(e.target.value)}
                        rows={3}
                        placeholder='เช่น: "Act as a marine biologist. Given that we are in Rayong, list 5 species of mangrove crabs..."'
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '0.8rem' }}
                      />
                     <button onClick={testPromptFeedback} disabled={promptTesting || !promptToTest.trim()} className="login-btn" style={{ marginTop: '0.5rem', width: 'auto', background: '#0891b2', padding: '0.4rem 1rem' }}>
                        {promptTesting ? '⏳ กำลังคิด...' : '💡 Get AI Feedback'}
                     </button>
                     {promptFeedback && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: promptFeedback.error ? '#fef2f2' : '#f0fdfa', borderRadius: 6, fontSize: '0.8rem', color: promptFeedback.error ? '#991b1b' : '#134e4a', whiteSpace: 'pre-wrap' }}>
                           {promptFeedback.error ? `❌ ${promptFeedback.error}` : (typeof promptFeedback === 'string' ? promptFeedback : JSON.stringify(promptFeedback, null, 2))}
                        </div>
                     )}
                  </div>

                  {/* Audit History */}
                  <div className="card">
                     <h5>📚 ประวัติ AI Audit ({aiAudits.length})</h5>
                     {aiAudits.length === 0 ? (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontStyle: 'italic' }}>
                           ยังไม่มี audit ในระบบ — เลือกทีมแล้วกด "Run AI Audit" ด้านบน
                        </p>
                     ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '0.75rem' }}>
                           {aiAudits.slice(0, 20).map(a => {
                              const t = a.audit_at?.seconds ? new Date(a.audit_at.seconds * 1000) : null;
                              return (
                                 <details key={a.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                                    <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                       👥 {a.team_name || a.team_id} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.7rem' }}>· {t ? t.toLocaleString('th-TH') : ''}</span>
                                    </summary>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                                       <p style={{ fontStyle: 'italic' }}>{a.summary}</p>
                                       {a.strengths?.length > 0 && <div><strong>💪 จุดแข็ง:</strong> {a.strengths.join(' · ')}</div>}
                                       {a.concerns?.length > 0  && <div><strong>⚠️ กังวล:</strong> {a.concerns.join(' · ')}</div>}
                                       {a.recommendations?.length > 0 && <div><strong>📝 แนะนำ:</strong> {a.recommendations.join(' · ')}</div>}
                                    </div>
                                 </details>
                              );
                           })}
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}



          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="lane">
                  <div className="lane-header bg-blue-light"><Users size={18} /> ข้อมูลสมาชิกทีม</div>
                  <div className="lane-content">
                     <div className="grid-2">
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                           <div className="card-number bg-blue-light" style={{ width: '64px', height: '64px', margin: '0 auto 1rem' }}><User size={32} /></div>
                           <h3>สมาชิกคนที่ 1</h3>
                           <p style={{ color: 'var(--color-text-tertiary)' }}>{user?.name}</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: '2rem', borderStyle: 'dashed' }}>
                           <Plus size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                           <p style={{ color: 'var(--color-text-tertiary)' }}>เพิ่มสมาชิกทีม</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
