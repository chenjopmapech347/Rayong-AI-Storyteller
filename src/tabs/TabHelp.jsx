// TabHelp.jsx — ในแอป R-Eco-Pilot
import logoDataUrl from '../assets/logoData3.js';
// คู่มือการใช้งาน / User Manual (printable)
//
// Props:
//   appConfig  – { primaryColor, secondaryColor, logoEmoji, brandName, brandTagline }
//   t          – translation function from makeT(lang)
//   APP_URL    – app URL string (imported from constants/config)

import { motion } from 'framer-motion';
import { BookOpen, Printer } from 'lucide-react';
import { APP_URL } from '../constants/config';

export default function TabHelp({ appConfig, t }) {
  return (
    <motion.div key="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane manual-print">
      {/* ── Header ── */}
      <div className="lane-header bg-primary-light" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><BookOpen size={16} /> คู่มือการใช้งาน R-Eco-Pilot · User Manual</span>
        <button
          onClick={() => window.print()}
          className="no-print"
          style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Printer size={14} /> {t('help_print')}
        </button>
      </div>

      <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Cover Card ── */}
        <div className="card" style={{ background: `linear-gradient(135deg, ${appConfig.primaryColor}22 0%, ${appConfig.secondaryColor}22 100%)`, border: `2px solid ${appConfig.primaryColor}`, textAlign: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <img src={logoDataUrl} alt="logo" style={{ width: 160, height: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 style={{ color: appConfig.primaryColor, margin: '0.5rem 0' }}>{appConfig.brandName}</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>{appConfig.brandTagline}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
            คู่มือการใช้งานสำหรับ <strong>นักเรียน · ครู · ปราชญ์ชาวบ้าน · ผู้ดูแลระบบ</strong>
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <strong style={{ color: appConfig.primaryColor }}>v2.0</strong> · Multi-Course Innovation Platform
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: '#94a3b8' }}>
            ✨ ใหม่ใน v2.0: หลายหลักสูตรในเว็บเดียว · Worksheets schema editor · Pitching Timer · QR codes · Top-up users
          </p>
        </div>

        {/* ── Table of Contents ── */}
        <div className="card">
          <h4>📚 สารบัญ (Table of Contents)</h4>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
            <li><a href="#quick-start"  style={{ color: '#0369a1' }}>🚀 เริ่มต้นใช้งาน (Quick Start)</a></li>
            <li><a href="#multi-course" style={{ color: '#0369a1' }}>📚 Multi-Course System ⭐ ใหม่</a></li>
            <li><a href="#student"      style={{ color: '#0369a1' }}>👨‍🎓 สำหรับนักเรียน (Student)</a></li>
            <li><a href="#teacher"      style={{ color: '#0369a1' }}>👩‍🏫 สำหรับครู (Teacher / Facilitator)</a></li>
            <li><a href="#sage"         style={{ color: '#0369a1' }}>🧓 สำหรับปราชญ์ (Sage / Local Expert)</a></li>
            <li><a href="#admin"        style={{ color: '#0369a1' }}>⚙️ สำหรับผู้ดูแลระบบ (Admin)</a></li>
            <li><a href="#pitching"     style={{ color: '#0369a1' }}>🎤 เตรียม Pitching + ⏱️ Timer</a></li>
            <li><a href="#trouble"      style={{ color: '#0369a1' }}>🔧 แก้ปัญหา (Troubleshooting)</a></li>
            <li><a href="#faq"          style={{ color: '#0369a1' }}>❓ คำถามที่พบบ่อย (FAQ)</a></li>
          </ol>
        </div>

        {/* ── 1. Quick Start ── */}
        <div id="quick-start" className="card">
          <h3 style={{ color: appConfig.primaryColor, borderBottom: `3px solid ${appConfig.primaryColor}`, paddingBottom: 6 }}>
            🚀 1. เริ่มต้นใช้งาน (Quick Start)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { n: 1, icon: '🌐', title: 'เปิดเว็บ',         desc: `เข้า ${APP_URL.replace('https://', '')}` },
              { n: 2, icon: '🔐', title: 'เข้าสู่ระบบ',       desc: 'ใช้ username + password ที่ครูสร้างให้' },
              { n: 3, icon: '📚', title: 'เลือกหลักสูตร',     desc: 'ดร็อปดาวน์ใน header (ถ้ามี ≥ 2 หลักสูตร)' },
              { n: 4, icon: '🎯', title: 'ดู Mission',        desc: 'รับโจทย์จาก Mission Inbox' },
              { n: 5, icon: '📸', title: 'ลงพื้นที่',         desc: 'เก็บข้อมูล + สัมภาษณ์ปราชญ์' },
              { n: 6, icon: '🤖', title: 'ใช้ AI',            desc: 'Prompt + บันทึก Audit Log' },
              { n: 7, icon: '📝', title: 'กรอก Worksheets',   desc: 'ส่งงานตามหลักสูตร (Submission Gateway)' },
              { n: 8, icon: '🎤', title: 'Pitching',          desc: 'นำเสนอ + รับคะแนน N×M Matrix' },
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
            💡 <strong>Tips:</strong>
            <ul style={{ marginTop: 4, paddingLeft: '1.2rem', marginBottom: 0 }}>
              <li>ภาษา: กดปุ่ม <strong>Thai TH | English EN</strong> ที่ header</li>
              <li>หลักสูตร: ดร็อปดาวน์ <strong>📚</strong> มุมขวาบน (เห็นเมื่อมี ≥ 2 หลักสูตร)</li>
              <li>Pitching Timer: กดปุ่ม <strong>⏱️ Timer</strong> ที่ header — full-screen countdown</li>
            </ul>
          </div>
        </div>

        {/* ── 2. Multi-Course System (NEW v2.0) ── */}
        <div id="multi-course" className="card">
          <h3 style={{ color: '#7c3aed', borderBottom: '3px solid #7c3aed', paddingBottom: 6 }}>
            📚 2. Multi-Course System ⭐ ใหม่ v2.0
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
            R-Eco-Pilot ตอนนี้เป็น <strong>Innovation Learning Platform</strong> รองรับหลายกรอบแนวคิด
          </p>
          <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>🎓 หลักสูตรที่มาพร้อมระบบ</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8, marginTop: 8 }}>
            <div style={{ padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6 }}>
              <div style={{ fontSize: '1.3rem' }}>🌿 ขั้นตอน/กระบวนการสร้างนวัตกรรม (default)</div>
              <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: 4 }}>4-Identities (สวน/ป่า/นา/เล) · AI Storytelling · 7 worksheets</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: 6 }}>
              <div style={{ fontSize: '1.3rem' }}>💡 Design Thinking + STEAM4Innovator</div>
              <div style={{ fontSize: '0.75rem', color: '#0e7490', marginTop: 4 }}>5 stages × 7 scenarios · 19 worksheets · ใช้กับชุมชนใดก็ได้</div>
            </div>
          </div>
          <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>🛠️ ครูสร้างหลักสูตรใหม่ได้เอง</h4>
          <ol style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
            <li>Admin → <strong>จัดการหลักสูตร</strong></li>
            <li>กด <strong>"+ สร้างหลักสูตรใหม่"</strong> หรือ <strong>📦 Import seed template</strong></li>
            <li>กด <strong>📝 Worksheets</strong> บนการ์ดหลักสูตร → ใช้ Schema Editor สร้าง worksheets</li>
            <li>เพิ่ม fields ทีละตัว (text · textarea · select · radio · list)</li>
            <li>กด <strong>👁 Preview</strong> ดูตัวอย่างที่นักเรียนจะเห็น</li>
            <li>กด <strong>💾 บันทึก</strong> · นักเรียนใช้งานได้ทันที</li>
          </ol>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: 6, marginTop: '0.75rem', fontSize: '0.8rem' }}>
            🌟 <strong>White-label พร้อมขยาย:</strong> แต่ละหลักสูตรมี Branding ของตัวเอง (สี · logo · ชื่อ) — สามารถนำไปใช้กับโรงเรียนอื่นในจังหวัดต่าง ๆ ได้ทันที
          </div>
        </div>

        {/* ── 3. Student ── */}
        <div id="student" className="card">
          <h3 style={{ color: '#0ea5e9', borderBottom: '3px solid #0ea5e9', paddingBottom: 6 }}>
            👨‍🎓 3. สำหรับนักเรียน (Student)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
            คุณคือ <strong>AI Storyteller</strong> — นำเสนอภูมิปัญญาท้องถิ่นผ่านการเล่าเรื่องด้วย AI อย่างมีจริยธรรม
          </p>
          <h4 style={{ marginTop: '1rem', color: '#0369a1' }}>📋 เมนูที่คุณใช้</h4>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
            <li><strong>จัดการทีม (Explorer UI)</strong> — ตั้งทีม, เลือก mascot, ดูสถานะ 4 ขั้นตอน</li>
            <li><strong>รับโจทย์ (Mission Inbox)</strong> — รับ mission ที่ครูมอบหมาย เลือก identity 1 ใน 4</li>
            <li><strong>เก็บข้อมูล (On-site Collector)</strong> — บันทึกการสัมภาษณ์ปราชญ์ + ภาพ + GPS</li>
            <li><strong>ส่งงาน (Submission Gateway)</strong> — 7 ขั้น: wisdom → environment → brainstorm → prototype → video → BMC → AI logs</li>
            <li><strong>📝 Worksheets ⭐ ใหม่</strong> — ใบงานตามหลักสูตรที่เลือก · ฟอร์มออกแบบโดยครู · กรอกแล้ว save → ดู ✓ done badge</li>
            <li><strong>ศูนย์ประเมิน (Evaluation Hub)</strong> — Self-assessment (5 ด้าน) + Peer evaluation</li>
            <li><strong>รายงาน R6</strong> — ดู portfolio ของทีม + QR code แชร์ได้</li>
          </ul>
          <h4 style={{ marginTop: '1rem', color: '#0369a1' }}>🎯 4 Identities ของกระบวนการสร้างนวัตกรรม</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginTop: '0.5rem' }}>
            {[
              { emoji: '🌳', name: 'สวน', color: '#16a34a' },
              { emoji: '🌲', name: 'ป่า',  color: '#15803d' },
              { emoji: '🌾', name: 'นา',  color: '#ca8a04' },
              { emoji: '🌊', name: 'เล',  color: '#0ea5e9' },
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

        {/* ── 4. Teacher ── */}
        <div id="teacher" className="card">
          <h3 style={{ color: '#16a34a', borderBottom: '3px solid #16a34a', paddingBottom: 6 }}>
            👩‍🏫 4. สำหรับครู (Teacher / Facilitator)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
            คุณคือ <strong>AI Literacy Coach</strong> — สร้างโจทย์, ติดตามทีม, ประเมิน Pitching, และส่งเสริมจริยธรรม AI
          </p>
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
                ['Storytelling',  '2 ภาษา · Soft Power ระยอง · Engagement'],
              ].map(([dim, crit]) => (
                <tr key={dim} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem', fontWeight: 600 }}>{dim}</td>
                  <td style={{ padding: '0.4rem' }}>{crit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>
            5 ระดับ: ปรับปรุง · พอใช้ · ปานกลาง · ดี · ดีเยี่ยม (TPQI L4 = Impact Creator)
          </p>
        </div>

        {/* ── 5. Sage ── */}
        <div id="sage" className="card">
          <h3 style={{ color: '#ca8a04', borderBottom: '3px solid #ca8a04', paddingBottom: 6 }}>
            🧓 5. สำหรับปราชญ์ (Sage / Local Expert)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
            คุณคือ <strong>ภูมิปัญญาที่มีชีวิต</strong> — ผู้ส่งต่อความรู้และให้คะแนนความถูกต้องของเรื่องราว
          </p>
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

        {/* ── 6. Admin ── */}
        <div id="admin" className="card">
          <h3 style={{ color: '#7c3aed', borderBottom: '3px solid #7c3aed', paddingBottom: 6 }}>
            ⚙️ 6. สำหรับผู้ดูแลระบบ (Admin)
          </h3>
          <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>📋 Sub-tabs ใน Admin Panel (7 sub-tabs)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginTop: 8 }}>
            {[
              { name: 'Management',  emoji: '👥', desc: 'CRUD users + teams · Import CSV · Reset password' },
              { name: 'Session',     emoji: '📅', desc: 'Phase manager · Open/Close submission · Deadline' },
              { name: 'Moderation',  emoji: '🛡️', desc: 'Cultural Ethics Audit · 6 หมวด 17 rules' },
              { name: 'Courses ⭐',   emoji: '📚', desc: 'Multi-course CRUD · Schema Editor · Import seed templates' },
              { name: 'Branding',    emoji: '🎨', desc: 'White-label · 4 presets · Custom brand' },
              { name: 'Settings',    emoji: '⚙️', desc: 'Claude API · Looker · Backup · Reset & Top-up users' },
              { name: 'Reports',     emoji: '📊', desc: 'R1-R6 reports cross-team · course-aware rubric' },
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
            <li>Settings → <strong>Seed Firebase Data</strong> (สร้างข้อมูลเริ่มต้น)</li>
            <li>Settings → <strong>👥 Top-up Users (10/45/9) ⭐</strong> เพิ่ม users ครบรอบหนึ่งคลาส</li>
            <li>Courses → กด <strong>📦 Import Design Thinking + STEAM4Innovator</strong> (optional · ทำให้มี 2 หลักสูตร)</li>
            <li>Branding → เลือก preset หรือ custom brand (ชื่อ, สี, logo)</li>
            <li>Session → เพิ่ม/แก้ phases ตามแผนการเรียน + ตั้ง deadline</li>
            <li>Settings → ตั้ง Claude API key (optional · Demo Mode ทำงานได้)</li>
            <li>Settings → วาง Looker Studio Embed URL (optional)</li>
          </ol>
          <h4 style={{ marginTop: '1rem', color: '#5b21b6' }}>⭐ Features ใหม่ v2.0 ใน Admin</h4>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
            <li><strong>Courses sub-tab</strong> — สร้าง/แก้/clone/delete หลักสูตร · Schema Editor สำหรับ worksheets · Import seed templates</li>
            <li><strong>Top-up Demo Users</strong> — Settings → ปุ่มเขียว · เพิ่ม users จนครบ 10 ครู / 45 นักเรียน / 9 ปราชญ์ (ไม่ลบของเดิม)</li>
            <li><strong>Course-aware Reports R1</strong> — แต่ละทีมใช้ rubric ของหลักสูตรตัวเอง · มีคอลัมน์ "หลักสูตร"</li>
          </ul>
        </div>

        {/* ── 7. Pitching Prep ── */}
        <div id="pitching" className="card">
          <h3 style={{ color: '#dc2626', borderBottom: '3px solid #dc2626', paddingBottom: 6 }}>
            🎤 7. เตรียม Pitching + ⏱️ Timer
          </h3>
          <h4 style={{ marginTop: '1rem', color: '#991b1b' }}>📝 Checklist ก่อน Pitching</h4>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
            <li>✅ <strong>ผลงานครบทุก worksheet</strong> ใน Worksheets tab (ขั้นตอน/กระบวนการสร้างนวัตกรรม = 7 · Design Thinking = 19)</li>
            <li>✅ <strong>AI Audit Log ครบ</strong> ทุก prompt ที่ใช้ (เปิด AI Audit Logbook ดู score)</li>
            <li>✅ <strong>Self + Peer Evaluation</strong> เสร็จก่อนวัน Pitching</li>
            <li>✅ <strong>BMC สมบูรณ์</strong> — cost, price, customer, channel</li>
            <li>✅ <strong>วิดีโอ Pitching ≤ 5 นาที</strong> — link ใน worksheet "Pitching Video"</li>
            <li>✅ <strong>ภาษา TH + EN</strong> — Sub-title หรือ Dual-language slide</li>
          </ul>
          <h4 style={{ marginTop: '1rem', color: '#991b1b' }}>⏱️ Pitching Timer ⭐ ใหม่</h4>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
            กดปุ่ม <strong>⏱️ Timer</strong> ที่ <strong>header</strong> ของเว็บ — เปิด full-screen countdown สำหรับซ้อม Pitching
          </p>
          <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: 6, fontSize: '0.8rem', marginTop: '0.5rem' }}>
            <strong>5 sections ใน Pitching 7 นาที (จากบทเรียน competition จริง):</strong>
            <ol style={{ marginTop: 4, paddingLeft: '1.2rem' }}>
              <li>🔴 Hook + Problem (60 วิ)</li>
              <li>🟠 Solution Overview (90 วิ)</li>
              <li>🟢 <strong>⭐ LIVE DEMO (180 วิ)</strong> ← Wow moment!</li>
              <li>🔵 Impact + Business (60 วิ)</li>
              <li>🟣 CTA + Team (30 วิ)</li>
            </ol>
            <p style={{ marginTop: 6, fontStyle: 'italic', color: '#7f1d1d' }}>Preset: 5 / 7 / 10 นาที · Section highlight อัตโนมัติ · pulse alarm ≤ 30 วิ</p>
          </div>
          <h4 style={{ marginTop: '1rem', color: '#991b1b' }}>📊 คะแนนรวม 100% (Course-aware)</h4>
          <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: 6, fontSize: '0.85rem' }}>
            Self 10% · Peer 15% · Teacher 35% · Sage 25% · AI 15% = <strong>100%</strong><br />
            × dimensions ของ <strong>rubric หลักสูตรของทีม</strong> (ไม่ใช่ hardcode อีกแล้ว!)<br />
            <strong>เป้าหมาย:</strong> ≥ 4.0/5.0 ในทุกด้าน = TPQI Level 4 (Impact Creator)
          </div>
        </div>

        {/* ── 8. Troubleshooting ── */}
        <div id="trouble" className="card">
          <h3 style={{ color: '#0891b2', borderBottom: '3px solid #0891b2', paddingBottom: 6 }}>
            🔧 8. แก้ปัญหา (Troubleshooting)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: 8 }}>
            <thead>
              <tr style={{ background: '#f0f9ff' }}>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>ปัญหา</th>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>วิธีแก้</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Login ไม่ได้',          'ติดต่อ admin · ใช้รหัส default: student123/teacher123 ถ้าใช้ Demo Mode'],
                ['ข้อมูลไม่อัพเดต',       'รีโหลดหน้า (F5) · Firestore ใช้ real-time แต่บางครั้งต้อง refresh'],
                ['AI Audit ไม่ทำงาน',     'ตั้ง Claude API Key ใน Admin → Settings · หรือใช้ Demo Mode (mock heuristic)'],
                ['คะแนนไม่ปรากฏใน Matrix', 'ต้องมี evaluator ครบทุก role: self + peer + teacher + sage + ai'],
                ['Looker Dashboard ว่าง',  'Admin → Settings → วาง embed URL จาก Looker Studio Share → Embed'],
                ['ภาษาไม่เปลี่ยน',        'กดปุ่ม Thai TH / English EN ใน header · บางหน้ายังไม่ i18n เต็ม'],
              ].map(([prob, sol]) => (
                <tr key={prob} style={{ borderTop: '1px solid #bae6fd' }}>
                  <td style={{ padding: '0.4rem', fontWeight: 600 }}>{prob}</td>
                  <td style={{ padding: '0.4rem' }}>{sol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 9. FAQ ── */}
        <div id="faq" className="card">
          <h3 style={{ color: '#65a30d', borderBottom: '3px solid #65a30d', paddingBottom: 6 }}>
            ❓ 9. คำถามที่พบบ่อย (FAQ)
          </h3>
          {[
            ['Demo Mode คืออะไร?',                              'ระบบมี Mock AI Audit ที่ทำงานจาก heuristic locally โดยไม่ต้องมี Claude API Key — เหมาะสำหรับ demo presentation'],
            ['ข้อมูลเก็บที่ไหน?',                               'Firebase Firestore (cloud database) · sync real-time ทุก device'],
            ['ใช้ฟรีไหม?',                                      'ใช้ฟรี (Firebase Spark plan) · ถ้าเปิด Claude API จะมีค่าใช้จ่ายตามจำนวน tokens'],
            ['สร้างหลักสูตรใหม่ได้ไหม?',                        'ได้ครับ! Admin → จัดการหลักสูตร → "+ สร้างหลักสูตรใหม่" หรือ "📦 Import Design Thinking + STEAM4Innovator" · แล้วใช้ Schema Editor สร้าง worksheets'],
            ['ทีมเดียวเข้าหลายหลักสูตรได้ไหม?',                 'ได้ครับ · team.courseIds เป็น array · นักเรียนสลับ course ผ่าน dropdown ที่ header'],
            ['เพิ่มครู/นักเรียน/ปราชญ์ทีเดียวเยอะ ๆ ได้ไหม?', 'ได้ครับ · Admin → Settings → กดปุ่มสีเขียว "👥 Top-up Users (10/45/9)" · ระบบจะเพิ่มจนครบเป้าหมายโดยไม่ลบของเดิม'],
            ['Pitching Timer ใช้ยังไง?',                        'กดปุ่ม ⏱️ Timer ที่ header → full-screen countdown · เลือก 5/7/10 นาที · มี section highlight + pulse alarm ≤ 30 วิ'],
            ['QR code ใน R6 Portfolio?',                        'แต่ละ team card มี QR ที่ link ไป public portfolio (ผ่าน api.qrserver.com) · กรรมการ scan จากมือถือดูผลงานได้ทันที'],
            ['Branding เปลี่ยนยังไง?',                         'Admin → Branding → เลือก preset (Rayong/Doi Saket/Phuket/Ayutthaya) หรือ custom brand'],
            ['Backup ข้อมูลยังไง?',                            'Admin → Settings → Download Backup JSON · ดาวน์โหลดทุกอย่างเป็นไฟล์ .json'],
            ['ลบทีม/นักเรียนได้ไหม?',                          'Admin → Management → กดไอคอน 🗑 ข้างชื่อทีม/user (ระวัง — undo ไม่ได้)'],
            ['Source code ที่ไหน?',                            'GitHub: chenjopmapech347/Rayong-AI-Storyteller (public) · clone แล้วใช้ npm install + npm run dev'],
          ].map(([q, a]) => (
            <details key={q} style={{ marginTop: 8, padding: 8, background: '#f7fee7', borderRadius: 6 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>{q}</summary>
              <p style={{ marginTop: 6, fontSize: '0.85rem', color: '#475569' }}>{a}</p>
            </details>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="card no-print" style={{ background: '#f8fafc', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          <p>💡 <strong>กดปุ่ม "{t('help_print')}"</strong> ด้านบนเพื่อพิมพ์หรือ save เป็น PDF</p>
          <p style={{ marginTop: 6 }}>
            🔗 GitHub: <a href="https://github.com/chenjopmapech347/Rayong-AI-Storyteller" target="_blank" rel="noreferrer">chenjopmapech347/Rayong-AI-Storyteller</a>
          </p>
        </div>

      </div>
    </motion.div>
  );
}
