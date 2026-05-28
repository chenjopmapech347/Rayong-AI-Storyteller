// src/constants/ethics.js
// Cultural Ethics Audit metadata — used by the Moderation tab and Reports.
// Mirrors the 6 ethics categories (zt) and rule severities in api.js runEthicsAudit().
// Adding new categories here requires matching rule additions in api.js.

export const ETHICS_CATEGORIES = {
  privacy    : { label: 'ปกป้องข้อมูลส่วนบุคคล', emoji: '🔒', hint: 'เบอร์โทร, อีเมล, ที่อยู่ปราชญ์, Social ID' },
  fabrication: { label: 'แต่งเติมภูมิปัญญา',     emoji: '🤖', hint: 'AI disclaimer ไม่ลบ, AI-typical phrasing' },
  disrespect : { label: 'ไม่ให้เกียรติปราชญ์',   emoji: '🙏', hint: 'แก/มัน/กู/มึง, ลดทอนคุณค่าปราชญ์' },
  cultural   : { label: 'คำหยาบ / Stereotype',    emoji: '⚠️', hint: 'คำหยาบ, stereotype เชื้อชาติ/ภูมิภาค' },
  consent    : { label: 'การขออนุญาต',           emoji: '📋', hint: 'บันทึกสัมภาษณ์ยาวแต่ไม่มี consent statement' },
  ai_misuse  : { label: 'AI Misuse / Deepfake',  emoji: '🚨', hint: 'Deepfake, voice clone, สร้างปราชญ์ปลอม' },
};

export const SEVERITY_META = {
  high  : { label: 'High',   color: '#dc2626', bg: '#fef2f2' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb' },
  low   : { label: 'Low',    color: '#0891b2', bg: '#ecfeff' },
};
