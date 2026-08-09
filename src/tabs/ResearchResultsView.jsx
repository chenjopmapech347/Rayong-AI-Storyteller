/**
 * ResearchResultsView.jsx
 * Admin — ภาพรวมโครงการนวัตกรรมทั้งหมด
 *
 * Props:
 *   user   – ผู้ใช้ที่ล็อกอินอยู่
 *   db     – Firestore instance
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import {
  BarChart3, CheckCircle2, AlertCircle, XCircle, Clock,
  RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';

const COLLECTION = 'innovation_surveys';

const STATUS_META = {
  pending: { label: 'รอประเมิน',    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: <Clock size={14} /> },
  pass:    { label: 'ผ่าน',         color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle2 size={14} /> },
  improve: { label: 'ต้องปรับปรุง', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: <AlertCircle size={14} /> },
  fail:    { label: 'ไม่ผ่าน',      color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <XCircle size={14} /> },
};

const FIELD_LABELS = {
  projectName: 'ชื่อโครงการ',
  problem:     'ปัญหาที่ต้องการแก้ไข',
  solution:    'แนวทางแก้ปัญหา',
  envImpact:   'ผลกระทบต่อสิ่งแวดล้อม',
  feasibility: 'ความเป็นไปได้',
};

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      flex: 1, minWidth: 110,
      background: 'var(--color-bg-primary)',
      border: `1px solid var(--color-border)`,
      borderRadius: 10, padding: '0.875rem 1rem',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontWeight: 700, fontSize: '0.75rem' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.1 }}>
        {value}
      </div>
    </div>
  );
}

export default function ResearchResultsView({ user, db }) {
  const [surveys,   setSurveys]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState(null);
  const [filter,    setFilter]    = useState('all');  // all | pending | pass | improve | fail

  const load = () => {
    if (!db) return;
    setLoading(true);
    getDocs(collection(db, COLLECTION)).then(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.submittedAt?.toMillis?.() ?? 0) - (a.submittedAt?.toMillis?.() ?? 0));
      setSurveys(docs);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [db]);

  // ── สถิติ ──────────────────────────────────────────────────────────────────
  const counts = {
    total:   surveys.length,
    pending: surveys.filter(s => s.status === 'pending' || !s.status).length,
    pass:    surveys.filter(s => s.status === 'pass').length,
    improve: surveys.filter(s => s.status === 'improve').length,
    fail:    surveys.filter(s => s.status === 'fail').length,
  };

  const displayed = filter === 'all'
    ? surveys
    : surveys.filter(s => (s.status || 'pending') === filter);

  return (
    <motion.div
      key="research-results"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="lane"
    >
      <div className="lane-header" style={{ background: 'linear-gradient(90deg, #1d4ed8, #7c3aed)' }}>
        <BarChart3 size={18} style={{ display: 'inline', marginRight: 6 }} />
        ภาพรวมงานวิจัยนวัตกรรม
      </div>

      <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <StatCard label="ทั้งหมด"         value={counts.total}   color="var(--color-primary)"  icon={<BarChart3 size={14} />} />
          <StatCard label="รอประเมิน"        value={counts.pending} color="#f59e0b" icon={<Clock size={14} />} />
          <StatCard label="ผ่าน"             value={counts.pass}    color="#16a34a" icon={<CheckCircle2 size={14} />} />
          <StatCard label="ต้องปรับปรุง"     value={counts.improve} color="#ea580c" icon={<AlertCircle size={14} />} />
          <StatCard label="ไม่ผ่าน"          value={counts.fail}    color="#dc2626" icon={<XCircle size={14} />} />
        </div>

        {/* ── Filter + Refresh ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'pending', 'pass', 'improve', 'fail'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.8rem',
                border: `1.5px solid ${filter === f ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: filter === f ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                color: filter === f ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                fontWeight: filter === f ? 700 : 400, cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'ทั้งหมด' : STATUS_META[f]?.label}
            </button>
          ))}
          <button
            onClick={load}
            title="รีเฟรชข้อมูล"
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
              padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.8rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)', cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> รีเฟรช
          </button>
        </div>

        {/* ── รายการ ── */}
        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>กำลังโหลด…</p>
        ) : displayed.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            ไม่มีโครงการในหมวดนี้
          </p>
        ) : (
          displayed.map(survey => {
            const isOpen = expanded === survey.id;
            const sm = STATUS_META[survey.status ?? 'pending'] ?? STATUS_META.pending;

            return (
              <div key={survey.id} style={{
                border: '1px solid var(--color-border)', borderRadius: 10,
                overflow: 'hidden', background: 'var(--color-bg-primary)',
              }}>
                {/* Summary row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : survey.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', cursor: 'pointer',
                    background: isOpen ? 'var(--color-bg-secondary)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      🔬 {survey.projectName || '(ไม่ระบุชื่อ)'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {survey.userName || survey.userEmail}
                      &nbsp;·&nbsp;
                      <span style={{ color: sm.color, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        {sm.icon} {sm.label}
                      </span>
                      {survey.evalBy && (
                        <span style={{ color: 'var(--color-text-tertiary)' }}> · ประเมินโดย {survey.evalBy}</span>
                      )}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {/* Detail */}
                {isOpen && (
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {Object.entries(FIELD_LABELS).map(([key, label]) =>
                      survey[key] ? (
                        <div key={key}>
                          <div className="ldt-stat-lbl">{label}</div>
                          <p style={{ margin: '3px 0 0', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            {survey[key]}
                          </p>
                        </div>
                      ) : null
                    )}

                    {survey.evalComment && (
                      <div style={{
                        padding: '0.625rem 0.875rem',
                        background: sm.bg, border: `1px solid ${sm.border}`,
                        borderRadius: 7, fontSize: '0.8125rem',
                      }}>
                        <strong style={{ color: sm.color }}>ความคิดเห็นผู้ประเมิน:</strong>{' '}
                        <span style={{ color: 'var(--color-text-primary)' }}>{survey.evalComment}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

      </div>
    </motion.div>
  );
}
