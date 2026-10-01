// AdminModerationPanel.jsx — Ethics / Cultural-Respect audit view for admin
// Used in: App.jsx (Admin tab → Moderation sub-tab)
//
// Props:
//   moderationFlags  – array of flag objects from Firestore
//   auditRunning     – bool, true while runEthicsAuditAll is in-flight
//   onRunAudit()     – triggers runEthicsAuditAll
//   onSetStatus(id, status) – calls setModerationFlagStatus in api.js
//   onDelete(id)     – calls deleteModerationFlag in api.js

import { useState } from 'react';
import { ETHICS_CATEGORIES, SEVERITY_META } from '../constants/ethics';

export default function AdminModerationPanel({
  moderationFlags = [],
  auditRunning = false,
  onRunAudit,
  onSetStatus,
  onDelete,
}) {
  const [flagFilterStatus,   setFlagFilterStatus]   = useState('pending');
  const [flagFilterSeverity, setFlagFilterSeverity] = useState('all');
  const [flagFilterCategory, setFlagFilterCategory] = useState('all');

  const filtered = moderationFlags.filter(f =>
    (flagFilterSeverity === 'all' || f.severity === flagFilterSeverity) &&
    (flagFilterStatus   === 'all' || f.status   === flagFilterStatus  ) &&
    (flagFilterCategory === 'all' || f.category === flagFilterCategory)
  );

  const byTeam = filtered.reduce((acc, f) => {
    const k = `${f.team_id}|${f.team_id}`;   // group by ID only
    (acc[k] = acc[k] || { teamId: f.team_id, teamName: f.team_name, flags: [] }).flags.push(f);
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

      {/* Header + stats */}
      <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#92400e' }}>
              🛡️ Cultural Respect &amp; Ethics Audit
            </h5>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#92400e' }}>
              เกณฑ์เน้น: เคารพปราชญ์ · ปกป้องความเป็นส่วนตัว · ความถูกต้องของภูมิปัญญา · จริยธรรม AI
            </p>
          </div>
          <button
            onClick={onRunAudit}
            disabled={auditRunning}
            className="login-btn"
            style={{ background: '#dc2626', width: 'auto', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
          >
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
        <select value={flagFilterStatus} onChange={e => setFlagFilterStatus(e.target.value)} style={{ padding: '0.35rem', borderRadius: 6, border: '1px solid #cbd5e1' }}>
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
          {Object.entries(ETHICS_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.emoji} {v.label}</option>
          ))}
        </select>
      </div>

      {/* Flag list grouped by team */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed', padding: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            {moderationFlags.length === 0
              ? '🎉 ยังไม่มีการรัน Audit — กดปุ่ม "Run Ethics Audit" ด้านบน'
              : 'ไม่มี flag ที่ตรงกับ filter ปัจจุบัน'}
          </p>
        </div>
      ) : (
        Object.values(byTeam).map(({ teamId, teamName, flags }) => (
          <div key={teamId} className="card" style={{ borderLeft: `3px solid ${SEVERITY_META[flags[0].severity]?.color || '#64748b'}` }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
              👥 {teamName || teamId}
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>({flags.length} flag)</span>
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '0.75rem' }}>
              {flags.map(f => {
                const sev = SEVERITY_META[f.severity] || SEVERITY_META.low;
                const cat = ETHICS_CATEGORIES[f.category] || { label: f.category, emoji: '•' };
                return (
                  <div
                    key={f.id}
                    style={{ padding: '0.6rem', background: sev.bg, borderRadius: 6, borderLeft: `4px solid ${sev.color}`, fontSize: '0.8rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '0.1rem 0.4rem', background: sev.color, color: '#fff', borderRadius: 4, fontSize: '0.65rem', fontWeight: 600 }}>{sev.label}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{cat.emoji} {cat.label}</span>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>· {f.source}/{f.source_id}</span>
                        </div>
                        <div style={{ marginTop: '0.35rem', fontWeight: 500 }}>{f.desc}</div>
                        {f.evidence && (
                          <div style={{ marginTop: '0.35rem', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569' }}>
                            {f.evidence}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => onSetStatus(f.id, 'approved').catch(e => alert(e?.message || e))} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #16a34a', background: '#f0fdf4', color: '#16a34a', borderRadius: 4, cursor: 'pointer' }}>✓ Approve</button>
                        <button onClick={() => onSetStatus(f.id, 'fixed').catch(e => alert(e?.message || e))}    style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #0891b2', background: '#ecfeff', color: '#0891b2', borderRadius: 4, cursor: 'pointer' }}>🔧 Fixed</button>
                        <button onClick={() => onSetStatus(f.id, 'rejected').catch(e => alert(e?.message || e))} style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #dc2626', background: '#fef2f2', color: '#dc2626', borderRadius: 4, cursor: 'pointer' }}>✗ Reject</button>
                        <button
                          onClick={() => { if (window.confirm('ลบ flag นี้?')) onDelete(f.id).catch(e => alert(e?.message || e)); }}
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', border: '1px solid #94a3b8', background: '#fff', color: '#64748b', borderRadius: 4, cursor: 'pointer' }}
                        >🗑</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Rules reference */}
      <details className="card" style={{ background: '#f8fafc' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          📖 เกณฑ์ตรวจสอบ — 6 หมวด (กดเพื่อขยาย)
        </summary>
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
}
