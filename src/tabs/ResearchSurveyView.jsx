/**
 * ResearchSurveyView.jsx
 * นักศึกษา/ผู้เข้าร่วมกรอกแบบสอบถามโครงการนวัตกรรม
 *
 * Props:
 *   user   – ผู้ใช้ที่ล็อกอินอยู่ { uid, email, name, role }
 *   db     – Firestore instance
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { FlaskConical, CheckCircle2, Clock, XCircle, AlertCircle, Send } from 'lucide-react';

const COLLECTION = 'innovation_surveys';

const FIELDS = [
  { key: 'projectName',  label: 'ชื่อโครงการนวัตกรรม',          placeholder: 'ระบุชื่อโครงการ...', rows: 1 },
  { key: 'problem',      label: 'ปัญหาที่ต้องการแก้ไข',          placeholder: 'อธิบายปัญหาที่พบ...', rows: 3 },
  { key: 'solution',     label: 'แนวทางแก้ปัญหา (Solution)',     placeholder: 'อธิบายวิธีการแก้ไขปัญหา...', rows: 3 },
  { key: 'envImpact',    label: 'ผลกระทบต่อสิ่งแวดล้อม',        placeholder: 'อธิบายผลกระทบเชิงสิ่งแวดล้อม...', rows: 3 },
  { key: 'feasibility',  label: 'ความเป็นไปได้ในการนำไปใช้จริง', placeholder: 'ประเมินความเป็นไปได้และแผนการดำเนินงาน...', rows: 3 },
];

const STATUS_META = {
  pending: { label: 'รอการประเมิน', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: <Clock size={15} /> },
  pass:    { label: 'ผ่าน',         color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle2 size={15} /> },
  improve: { label: 'ต้องปรับปรุง', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: <AlertCircle size={15} /> },
  fail:    { label: 'ไม่ผ่าน',      color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <XCircle size={15} /> },
};

const EMPTY_FORM = { projectName: '', problem: '', solution: '', envImpact: '', feasibility: '' };

export default function ResearchSurveyView({ user, db }) {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saved,   setSaved]   = useState(null);   // ข้อมูลที่บันทึกแล้ว (จาก Firestore)
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);   // { text, ok }
  const [editing, setEditing] = useState(false);  // กดแก้ไขหลัง submit

  const docId = user?.uid;

  // ── โหลดข้อมูลที่เคยส่งแล้ว ───────────────────────────────────────────────
  useEffect(() => {
    if (!docId || !db) return;
    getDoc(doc(collection(db, COLLECTION), docId)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSaved(data);
        setForm({
          projectName: data.projectName || '',
          problem:     data.problem     || '',
          solution:    data.solution    || '',
          envImpact:   data.envImpact   || '',
          feasibility: data.feasibility || '',
        });
      }
    });
  }, [docId, db]);

  const allFilled = FIELDS.every(f => form[f.key]?.trim());

  // ── บันทึก ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!allFilled) { setMsg({ text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง', ok: false }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...form,
        userId:    user.uid,
        userEmail: user.email || '',
        userName:  user.name  || user.email || '',
        // คงสถานะเดิมไว้ ถ้ามีอยู่แล้ว; ถ้าเป็น submit ใหม่ → pending
        status:    saved?.status ?? 'pending',
        evalComment: saved?.evalComment ?? '',
        evalBy:      saved?.evalBy      ?? '',
        submittedAt: saved?.submittedAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(collection(db, COLLECTION), docId), payload);
      setSaved(payload);
      setEditing(false);
      setMsg({ text: '✅ บันทึกแบบสอบถามเรียบร้อยแล้ว', ok: true });
    } catch (err) {
      setMsg({ text: `เกิดข้อผิดพลาด: ${err.message}`, ok: false });
    } finally {
      setSaving(false);
    }
  }

  // ── ถ้า submit แล้วและไม่ได้กำลัง edit → แสดง readonly view ──────────────
  const isReadOnly = saved && !editing;
  const statusInfo = STATUS_META[saved?.status] ?? STATUS_META.pending;

  return (
    <motion.div
      key="research-survey"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="lane"
    >
      <div className="lane-header" style={{ background: 'linear-gradient(90deg, #16a34a, #0ea5e9)' }}>
        <FlaskConical size={18} style={{ display: 'inline', marginRight: 6 }} />
        งานวิจัยนวัตกรรม — กรอกแบบสอบถามโครงการ
      </div>

      <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── สถานะการประเมิน (ถ้ามี) ── */}
        {saved && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '0.75rem 1rem',
            background: statusInfo.bg,
            border: `1px solid ${statusInfo.border}`,
            borderRadius: 8, fontSize: '0.8125rem',
          }}>
            <span style={{ color: statusInfo.color, marginTop: 1 }}>{statusInfo.icon}</span>
            <div>
              <span style={{ fontWeight: 700, color: statusInfo.color }}>สถานะ: {statusInfo.label}</span>
              {saved.evalComment && (
                <p style={{ margin: '0.3rem 0 0', color: '#475569' }}>
                  <strong>ความคิดเห็นผู้ประเมิน:</strong> {saved.evalComment}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── ฟอร์ม ── */}
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="ldt-stat-lbl">
              {f.label} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            {f.rows === 1 ? (
              <input
                className="login-input"
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                disabled={isReadOnly}
              />
            ) : (
              <textarea
                className="login-input"
                rows={f.rows}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                disabled={isReadOnly}
                style={{ resize: 'vertical' }}
              />
            )}
          </div>
        ))}

        {/* ── ข้อความแจ้งเตือน ── */}
        {msg && (
          <div style={{
            padding: '0.6rem 0.875rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
            background: msg.ok ? '#f0fdf4' : '#fef2f2',
            color:      msg.ok ? '#16a34a' : '#dc2626',
            border:     `1px solid ${msg.ok ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {msg.text}
          </div>
        )}

        {/* ── ปุ่มส่ง / แก้ไข ── */}
        {isReadOnly ? (
          <button
            className="login-btn"
            onClick={() => setEditing(true)}
            style={{ background: '#0ea5e9' }}
          >
            ✏️ แก้ไขข้อมูล
          </button>
        ) : (
          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {saving
              ? 'กำลังบันทึก…'
              : <><Send size={16} /> {saved ? 'อัปเดตแบบสอบถาม' : 'ส่งแบบสอบถาม'}</>
            }
          </button>
        )}

      </div>
    </motion.div>
  );
}
