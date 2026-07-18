// TabAiAuditLog.jsx — AI Audit Logbook tab
// แสดงผล Audit ที่ผ่านมา, รัน Full Audit, ทดสอบ Prompt คุณภาพ
//
// Props:
//   teams             – Team[]   รายชื่อทีมทั้งหมด
//   aiAudits          – Audit[]  ประวัติ audit จาก Firestore
//   selectedAuditTeam – string   teamId ที่เลือกอยู่
//   setSelectedAuditTeam – (id: string) => void
//   auditingAi        – boolean  กำลัง audit อยู่
//   runAiAuditOnTeam  – () => void  เรียก AI audit
//   lastAuditResult   – object | null  ผล audit ล่าสุด
//   promptToTest      – string   prompt ที่กรอกในช่องทดสอบ
//   setPromptToTest   – (v: string) => void
//   promptTesting     – boolean  กำลังทดสอบ prompt อยู่
//   promptFeedback    – object | string | null  ผล feedback
//   testPromptFeedback – () => void  ส่ง prompt ไปทดสอบ

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function TabAiAuditLog({
  teams = [],
  aiAudits = [],
  selectedAuditTeam,
  setSelectedAuditTeam,
  auditingAi,
  runAiAuditOnTeam,
  lastAuditResult,
  promptToTest,
  setPromptToTest,
  promptTesting,
  promptFeedback,
  testPromptFeedback,
}) {
  return (
    <motion.div key="aal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
      <div className="lane-header bg-blue-light">
        <ShieldCheck size={16} /> AI Audit Logbook — Anti-Hallucination &amp; Prompt Quality
      </div>

      <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* ── Intro ── */}
        <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h5 style={{ color: '#1e40af' }}>🛡️ AI Audit — Heuristic + AI Analysis</h5>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#1e40af' }}>
            ระบบจะวิเคราะห์ Prompt ของทีม (Role / Context / Format) · เช็ค Hallucination (ภูมิปัญญา vs สัมภาษณ์) · ให้คะแนน Tier (L1-L4 → TPQI) · แนะนำการพัฒนา · บันทึกผลลง Firestore (ai_audits)
          </p>
          <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#1e3a8a' }}>
            💡 <strong>Demo Mode:</strong> ถ้ายังไม่ได้ตั้ง Claude API Key ใน Admin → Settings ระบบจะใช้ Mock Audit จาก heuristic locally (ไม่เรียก API)
          </p>
        </div>

        {/* ── Run Audit on Team ── */}
        <div className="card">
          <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔍 Run Full AI Audit</h5>
          <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedAuditTeam}
              onChange={e => setSelectedAuditTeam(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, minWidth: 200 }}
            >
              <option value="">-- เลือกทีม --</option>
              {teams.map(tm => (
                <option key={tm.id} value={tm.id}>{tm.name}</option>
              ))}
            </select>
            <button
              onClick={runAiAuditOnTeam}
              disabled={auditingAi || !selectedAuditTeam}
              className="login-btn"
              style={{ background: '#7c3aed', width: 'auto', padding: '0.5rem 1.5rem' }}
            >
              {auditingAi ? '⏳ กำลัง Audit...' : '🚀 Run AI Audit'}
            </button>
          </div>
        </div>

        {/* ── Latest Audit Result ── */}
        {lastAuditResult && (
          <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <h5 style={{ color: '#166534' }}>✅ ผล Audit ล่าสุด — {lastAuditResult.team_name}</h5>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#166534', fontStyle: 'italic' }}>
              {lastAuditResult.summary}
            </p>
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

        {/* ── Quick Prompt Feedback Tool ── */}
        <div className="card">
          <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⚡ ทดสอบคุณภาพ Prompt</h5>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
            วาง prompt ใด ๆ → AI จะให้ feedback ทันที (ไม่บันทึก)
          </p>
          <textarea
            value={promptToTest}
            onChange={e => setPromptToTest(e.target.value)}
            rows={3}
            placeholder='เช่น: "Act as a marine biologist. Given that we are in Rayong, list 5 species of mangrove crabs..."'
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '0.8rem' }}
          />
          <button
            onClick={testPromptFeedback}
            disabled={promptTesting || !promptToTest.trim()}
            className="login-btn"
            style={{ marginTop: '0.5rem', width: 'auto', background: '#0891b2', padding: '0.4rem 1rem' }}
          >
            {promptTesting ? '⏳ กำลังคิด...' : '💡 Get AI Feedback'}
          </button>
          {promptFeedback && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: promptFeedback.error ? '#fef2f2' : '#f0fdfa',
              borderRadius: 6,
              fontSize: '0.8rem',
              color: promptFeedback.error ? '#991b1b' : '#134e4a',
              whiteSpace: 'pre-wrap',
            }}>
              {promptFeedback.error
                ? `❌ ${promptFeedback.error}`
                : typeof promptFeedback === 'string'
                  ? promptFeedback
                  : JSON.stringify(promptFeedback, null, 2)}
            </div>
          )}
        </div>

        {/* ── Audit History ── */}
        <div className="card">
          <h5>📚 ประวัติ AI Audit ({aiAudits.length})</h5>
          {aiAudits.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontStyle: 'italic' }}>
              ยังไม่มี audit ในระบบ — เลือกทีมแล้วกด "Run AI Audit" ด้านบน
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '0.75rem' }}>
              {aiAudits.slice(0, 20).map(a => {
                const ts = a.audit_at?.seconds ? new Date(a.audit_at.seconds * 1000) : null;
                return (
                  <details key={a.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      👥 {a.team_name || a.team_id}{' '}
                      <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.7rem' }}>
                        · {ts ? ts.toLocaleString('th-TH') : ''}
                      </span>
                    </summary>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                      <p style={{ fontStyle: 'italic' }}>{a.summary}</p>
                      {a.strengths?.length > 0      && <div><strong>💪 จุดแข็ง:</strong> {a.strengths.join(' · ')}</div>}
                      {a.concerns?.length > 0       && <div><strong>⚠️ กังวล:</strong> {a.concerns.join(' · ')}</div>}
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
  );
}
