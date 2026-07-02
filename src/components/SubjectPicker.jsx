// SubjectPicker.jsx — multi-select subjects with primary subject designation
// Used in: Create course form + Edit course form (Integrated learning / บูรณาการ)
//
// Props:
//   subjects       – array of { id, name, credits, ... }
//   selectedIds    – string[]  currently selected subject IDs
//   primaryId      – string    ID of the primary (วิชาหลัก) subject
//   onToggle(id)   – toggle a subject on/off (auto-fixes primaryId if deselected)
//   onSetPrimary(id) – set a selected subject as the primary
//   label          – optional section heading (defaults to Thai label)

export default function SubjectPicker({ subjects = [], selectedIds = [], primaryId = '', onToggle, onSetPrimary, label }) {
  const heading = label ?? '📖 รายวิชาบูรณาการ (เลือกได้มากกว่า 1 วิชา)';

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
        {heading}
      </div>

      {subjects.length === 0 ? (
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
          ยังไม่มีรายวิชา — ไปเพิ่มที่แท็บ "📖 รายวิชา" ก่อน
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {subjects.map(s => {
            const selected  = selectedIds.includes(s.id);
            const isPrimary = primaryId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onToggle(s.id)}
                style={{
                  padding: '0.3rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer',
                  fontWeight: selected ? 700 : 400,
                  background: isPrimary ? '#dbeafe' : selected ? '#f0fdf4' : '#f8fafc',
                  color:      isPrimary ? '#1d4ed8' : selected ? '#166534' : '#64748b',
                  border: `1.5px solid ${isPrimary ? '#93c5fd' : selected ? '#bbf7d0' : '#e2e8f0'}`,
                }}
              >
                {isPrimary ? '⭐ ' : selected ? '✓ ' : ''}{s.name}
                {s.credits && <span style={{ fontSize: '0.65rem', opacity: 0.7, marginLeft: 3 }}>({s.credits})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* วิชาหลัก selector — shows only when ≥1 subject selected */}
      {selectedIds.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
            ⭐ วิชาหลัก (กดเพื่อเลือก)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedIds.map(sid => {
              const s = subjects.find(x => x.id === sid);
              if (!s) return null;
              const isPrimary = primaryId === sid;
              return (
                <button
                  key={sid}
                  onClick={() => onSetPrimary(sid)}
                  style={{
                    padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer',
                    background: isPrimary ? '#dbeafe' : '#f8fafc',
                    color:      isPrimary ? '#1d4ed8' : '#64748b',
                    border: `1.5px solid ${isPrimary ? '#93c5fd' : '#e2e8f0'}`,
                    fontWeight: isPrimary ? 700 : 400,
                  }}
                >
                  {isPrimary ? '⭐ ' : ''}{s.name}
                </button>
              );
            })}
          </div>
          {/* Summary line */}
          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
            {primaryId
              ? `⭐ วิชาหลัก: ${subjects.find(x => x.id === primaryId)?.name || ''}`
                + (selectedIds.length > 1
                    ? ` · รายวิชาร่วม: ${selectedIds.filter(x => x !== primaryId).map(x => subjects.find(s => s.id === x)?.name).filter(Boolean).join(', ')}`
                    : '')
              : 'กดเลือกวิชาหลักด้านบน'}
          </div>
        </div>
      )}
    </div>
  );
}
