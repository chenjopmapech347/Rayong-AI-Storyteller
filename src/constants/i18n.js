// src/constants/i18n.js
// Bilingual UI dictionary (Thai default · English for international Pitching).
// Add a key + Thai value first; then mirror in `en` (or fall back to TH key).
// Look-up via makeT(lang) → returns t(key) helper that resolves through TH → EN → key.

export const I18N = {
  th: {
    // ── Menu labels ──
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
    // ── Header / Generic ──
    'Logout'              : 'ออกจากระบบ',
    'Language'            : 'ภาษา',
    'Switch to English'   : 'เปลี่ยนเป็นอังกฤษ',
    'Switch to Thai'      : 'เปลี่ยนเป็นไทย',
    // ── Evaluator roles ──
    'eval_self'           : 'ประเมินตนเอง',
    'eval_peer'           : 'เพื่อนประเมิน',
    'eval_teacher'        : 'ครูประเมิน',
    'eval_sage'           : 'ปราชญ์ประเมิน',
    'eval_ai'             : 'AI ประเมิน',
    // ── Rubric levels ──
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
    // ── Section headers ──
    'header_admin'        : 'ผู้ดูแล',
    'header_assessor'     : 'ผู้ประเมิน',
    'header_report_center': 'ศูนย์รายงาน (R1-R6)',
    // ── Help / Manual ──
    'Help'                : 'คู่มือ',
    'help_print'          : '🖨️ พิมพ์ / Save PDF',
  },
  en: {
    // ── Menu labels (passthrough mostly — original was EN) ──
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
    // ── Header / Generic ──
    'Logout'              : 'Logout',
    'Language'            : 'Language',
    'Switch to English'   : 'Switch to English',
    'Switch to Thai'      : 'Switch to Thai',
    // ── Evaluator roles ──
    'eval_self'           : 'Self-Evaluation',
    'eval_peer'           : 'Peer Evaluation',
    'eval_teacher'        : 'Teacher Evaluation',
    'eval_sage'           : 'Sage Evaluation',
    'eval_ai'             : 'AI Evaluation',
    // ── Rubric levels ──
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
    // ── Section headers ──
    'header_admin'        : 'Admin',
    'header_assessor'     : 'Assessor',
    'header_report_center': 'Report Center (R1-R6)',
    // ── Help / Manual ──
    'Help'                : 'Manual',
    'help_print'          : '🖨️ Print / Save PDF',
  },
};

// Look up TH first, fall back to EN, then return the raw key (safe default).
export const makeT = (lang) => (k) => I18N[lang]?.[k] ?? I18N.th[k] ?? k;
