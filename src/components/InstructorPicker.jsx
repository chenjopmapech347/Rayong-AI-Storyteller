// InstructorPicker.jsx — multi-select teachers/sages for a course
// Used in: Create course form + Edit course form
//
// Props:
//   pool          – array of { id, name, role } (teachers, sages, facilitators)
//   selectedIds   – string[]  currently selected user IDs
//   onToggle(id)  – toggle a user on/off

export default function InstructorPicker({ pool = [], selectedIds = [], onToggle }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
        👩‍🏫 ผู้ดูแลหลักสูตร ({selectedIds.length} คน)
      </div>

      {pool.length === 0 ? (
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
          ยังไม่มี Teacher / Sage ในระบบ
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {pool.map(u => {
            const selected = selectedIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => onToggle(u.id)}
                style={{
                  padding: '0.3rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', cursor: 'pointer',
                  fontWeight: selected ? 700 : 400,
                  background: selected ? '#dbeafe' : '#f8fafc',
                  color:      selected ? '#1d4ed8' : '#64748b',
                  border: `1.5px solid ${selected ? '#93c5fd' : '#e2e8f0'}`,
                  transition: 'all 0.15s',
                }}
              >
                {selected ? '✓ ' : ''}{u.name}
                <span style={{ fontSize: '0.65rem', opacity: 0.7, marginLeft: 4 }}>({u.role})</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div style={{ fontSize: '0.68rem', color: '#1d4ed8', marginTop: 5 }}>
          ✅ {pool.filter(u => selectedIds.includes(u.id)).map(u => u.name).join(', ')}
        </div>
      )}
    </div>
  );
}
