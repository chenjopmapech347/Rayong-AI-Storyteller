/**
 * ResearchEvalView.jsx
 * Teacher / Mentor ดูรายการโครงการที่นักศึกษาส่ง และประเมินผล
 *
 * Props:
 *   user   – ผู้ใช้ที่ล็อกอินอยู่
 *   db     – Firestore instance
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection, getDocs, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import {
  ClipboardCheck, CheckCircle2, AlertCircle, XCircle,
  Clock, ChevronDown, ChevronUp, Save,
} from 'lucide-react';

const COLLECTION = 'innovation_surveys';

const FIELD_LABELS = {
  projectName: 'ชื่อโครงการ',
  problem:     'ปัญหาที่ต้องการแก้ไข',
  solution:    'แนวทางแก้ปัญหา',
  envImpact:   'ผลกระทบต่อสิ่งแวดล้อม',
  feasibility: 'ความเป็นไปได้ในการนำไปใช้จริง',
};

const STATUS_OPTIONS = [
  { value: 'pass',    label: 'ผ่าน',          color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle2 size={14} /> },
  { value: 'improve', label: 'ต้องปรับปรุง',  color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: <AlertCircle size={14} /> },
  { value: 'fail',    label: 'ไม่ผ่าน',       color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <XCircle size={14} /> },
];

const STATUS_META = {
  pending: { label: 'รอประเมิน',   color: '#f59e0b' },
  pass:    { label: 'ผ่าน',        color: '#16a34a' },
  improve: { label: 'ต้องปรับปรุง',color: '#ea580c' },
  fail:    { label: 'ไม่ผ่าน',    color: '#dc2626' },
};

export default function ResearchEvalView({ user, db }) {
  const [surveys,   setSurveys]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState(null);   // userId ที่กำลัง expand
  const [evalForm,  setEvalForm]  = useState({});     // { [userId]: { status, comment } }
  const [saving,    setSaving]    = useState(null);   // userId ที่กำลัง save
  const [savedMsg,  setSavedMsg]  = useState({});     // { [userId]: 'ok' | 'err' }

  // ── โหลดรายการทั้งหมด ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!db) return;
    setLoading(true);
    getDocs(collection(db, COLLECTION)).then(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // เรียงตาม submittedAt ใหม่ → เก่า
      docs.sort((a, b) => {
        const ta = a.submittedAt?.toMillis?.() ?? 0;
        const tb = b.submittedAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setSurveys(docs);
      // Pre-fill evalForm with existing evaluations
      const initForm = {};
      docs.forEach(d => {
        initForm[d.id] = { status: d.status || 'pending', comment: d.evalComment || '' };
      });
      setEvalForm(initForm);
    }).finally(() => setLoading(false));
  }, [db]);

  // ── บันทึกผลประเมิน ───────────────────────────────────────────────────────
  async function handleSaveEval(userId) {
    const form = evalForm[userId] || {};
    if (!form.status || form.status === 'pending') return;
    setSaving(userId);
    try {
      await updateDoc(doc(collection(db, COLLECTION), userId), {
        status:      form.status,
        evalComment: form.comment || '',
        evalBy:      user.email || user.name || '',
        evalAt:      serverTimestamp(),
      });
      setSurveys(prev => prev.map(s => s.id === userId
        ? { ...s, status: form.status, evalComment: form.comment || '', evalBy: user.email }
        : s
      ));
      setSavedMsg(p => ({ ...p, [userId]: 'ok' }));
      setTimeout(() => setSavedMsg(p => ({ ...p, [userId]: null })), 3000);
    } catch (err) {
      setSavedMsg(p => ({ ...p, [userId]: 'err' }));
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <motion.div key="research-eval-loading"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="lane">
        <div className="lane-header" style={{ background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)' }}>
          <ClipboardCheck size={18} style={{ display: 'inline', marginRight: 6 }} />
          ประเมินโครงการนวัตกรรม
        </div>
        <div className="lane-content" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          กำลังโหลด…
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="research-eval"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="lane"
    >
      <div className="lane-header" style={{ background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)' }}>
        <ClipboardCheck size={18} style={{ display: 'inline', marginRight: 6 }} />
        ประเมินโครงการนวัตกรรม — {surveys.length} โครงการ
      </div>

      <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {surveys.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            ยังไม่มีโครงการที่นักศึกษาส่ง
          </p>
        )}

        {surveys.map(survey => {
          const isOpen    = expanded === survey.id;
          const form      = evalForm[survey.id] || { status: survey.status || 'pending', comment: '' };
          const statusMeta = STATUS_META[survey.status] ?? STATUS_META.pending;
          const msgState  = savedMsg[survey.id];

          return (
            <div key={survey.id} style={{
              border: '1px solid var(--color-border)',
              borderRadius: 10, overflow: 'hidden',
              background: 'var(--color-bg-primary)',
            }}>
              {/* ── Row summary (click to expand) ── */}
              <div
                onClick={() => setExpanded(isOpen ? null : survey.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', cursor: 'pointer',
                  background: isOpen ? 'var(--color-bg-secondary)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    🔬 {survey.projectName || '(ไม่ระบุชื่อโครงการ)'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {survey.userName || survey.userEmail} &nbsp;·&nbsp;
                    <span style={{ color: statusMeta.color, fontWeight: 600 }}>
                      {statusMeta.label}
                    </span>
                    {survey.status === 'pending' && (
                      <Clock size={12} style={{ display: 'inline', marginLeft: 4, color: '#f59e0b' }} />
                    )}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {/* ── Detail + eval form ── */}
              {isOpen && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* ข้อมูลโครงการ */}
                  {Object.entries(FIELD_LABELS).map(([key, label]) => (
                    survey[key] ? (
                      <div key={key}>
                        <div className="ldt-stat-lbl">{label}</div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                          {survey[key]}
                        </p>
                      </div>
                    ) : null
                  ))}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.25rem 0' }} />

                  {/* ── การประเมิน ── */}
                  <div>
                    <div className="ldt-stat-lbl" style={{ marginBottom: 8 }}>ผลการประเมิน</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setEvalForm(p => ({ ...p, [survey.id]: { ...p[survey.id], status: opt.value } }))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '0.4rem 0.9rem', borderRadius: 20,
                            border: `2px solid ${form.status === opt.value ? opt.color : 'transparent'}`,
                            background: form.status === opt.value ? opt.bg : 'var(--color-bg-secondary)',
                            color: form.status === opt.value ? opt.color : 'var(--color-text-secondary)',
                            fontWeight: form.status === opt.value ? 700 : 400,
                            cursor: 'pointer', fontSize: '0.8125rem', transition: 'all 0.15s',
                          }}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="ldt-stat-lbl">ความคิดเห็น / ข้อเสนอแนะ</label>
                    <textarea
                      className="login-input"
                      rows={3}
                      placeholder="ใส่ความเห็นสำหรับนักศึกษา…"
                      value={form.comment || ''}
                      onChange={e => setEvalForm(p => ({ ...p, [survey.id]: { ...p[survey.id], comment: e.target.value } }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {msgState && (
                    <div style={{
                      fontSize: '0.8rem', padding: '0.5rem 0.75rem', borderRadius: 6, fontWeight: 600,
                      background: msgState === 'ok' ? '#f0fdf4' : '#fef2f2',
                      color:      msgState === 'ok' ? '#16a34a' : '#dc2626',
                      border:     `1px solid ${msgState === 'ok' ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      {msgState === 'ok' ? '✅ บันทึกผลการประเมินแล้ว' : '❌ เกิดข้อผิดพลาด กรุณาลองใหม่'}
                    </div>
                  )}

                  <button
                    className="login-btn"
                    onClick={() => handleSaveEval(survey.id)}
                    disabled={saving === survey.id || form.status === 'pending'}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: form.status === 'pending' ? 0.5 : 1,
                    }}
                  >
                    <Save size={15} />
                    {saving === survey.id ? 'กำลังบันทึก…' : 'บันทึกผลประเมิน'}
                  </button>

                </div>
              )}
            </div>
          );
        })}

      </div>
    </motion.div>
  );
}
