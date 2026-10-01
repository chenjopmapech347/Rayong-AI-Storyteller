// TeamModal.jsx — modal for viewing / editing a team's members, teacher, and courses
// Used in: App.jsx (Teams tab and teacher-dashboard team cards)
//
// Props:
//   team            – team document being edited (the "teamModal" value)
//   teamStudents    – all student users
//   users           – all users (used to build teacher list; falls back to teamTeachers)
//   coursesAll      – all course objects
//   user            – current logged-in user
//   onClose()       – called to close the modal
//   onSaveSuccess(updatedTeams, allStudents) – called after a successful save

import { useState } from 'react';
import Modal from '../Modal';
import {
  adminUpdateTeam,
  adminUpdateUser,
  getTeams,
  getUsers,
} from '../api';

export default function TeamModal({
  team,
  teamStudents = [],
  users = [],
  coursesAll = [],
  user,
  onClose,
  onSaveSuccess,
}) {
  // ─── initialise edit state from the team prop ────────────────────────
  const [edit, setEdit] = useState({
    photo:        team.photo        || '',
    leaderId:     team.leader_id    || '',
    teacherId:    team.teacher_id   || '',
    memberSearch: '',
    memberIds:    teamStudents
      .filter(s => String(s.team_id || s.teamId) === String(team.id))
      .map(s => s.id),
    courseIds: Array.isArray(team.courseIds)
      ? team.courseIds
      : team.courseId ? [team.courseId] : ['green-rayong'],
  });
  const [saving, setSaving] = useState(false);

  // ─── canEdit rules ────────────────────────────────────────────────────
  const isAssignedTeacher =
    (user?.role === 'teacher' || user?.role === 'facilitator') &&
    (String(team.teacher_id) === String(user?.id) ||
      (() => {
        const teamCourseIds = Array.isArray(team.courseIds)
          ? team.courseIds
          : team.courseId ? [team.courseId] : ['green-rayong'];
        return coursesAll.some(
          c => teamCourseIds.includes(c.id) &&
               Array.isArray(c.instructorIds) &&
               c.instructorIds.includes(user?.id)
        );
      })());

  const canEdit =
    user?.role === 'admin' ||
    isAssignedTeacher ||
    String(team.id) === String(user?.team_id || user?.teamId);

  const originalMemberIds = teamStudents
    .filter(s => String(s.team_id || s.teamId) === String(team.id))
    .map(s => s.id);

  // teacher list: prefer full users[] (admin has it), else fall back
  const teacherList =
    (users || []).filter(u => u && (u.role === 'teacher' || u.role === 'facilitator')).length > 0
      ? (users || []).filter(u => u && (u.role === 'teacher' || u.role === 'facilitator'))
      : [];

  const filteredStudents = teamStudents.filter(s => {
    const q = (edit.memberSearch || '').toLowerCase();
    return (
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.username || '').toLowerCase().includes(q) ||
      (s.nickname || '').toLowerCase().includes(q)
    );
  });

  const selectedMemberObjs = edit.memberIds
    .map(id => teamStudents.find(s => s.id === id))
    .filter(Boolean);

  // ─── save handler ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateTeam(team.id, {
        photo:      edit.photo,
        leader_id:  edit.leaderId,
        teacher_id: edit.teacherId,
        courseIds:  edit.courseIds || [],
      });

      if (canEdit) {
        const added   = edit.memberIds.filter(id => !originalMemberIds.includes(id));
        const removed = originalMemberIds.filter(id => !edit.memberIds.includes(id));
        for (const uid of added)   await adminUpdateUser(uid, { team_id: team.id });
        for (const uid of removed) await adminUpdateUser(uid, { team_id: null });
      }

      const [updatedTeams, allUsers] = await Promise.all([getTeams(), getUsers()]);
      onSaveSuccess?.(updatedTeams, allUsers.filter(u => u.role === 'student'));
      onClose();
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── render ───────────────────────────────────────────────────────────
  return (
    <Modal
      onClose={onClose}
      width="min(92vw, 540px)"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {edit.photo && (
            <img
              src={edit.photo}
              alt=""
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{team.name}</div>
            <div style={{ fontSize: '0.7rem', color: canEdit ? '#16a34a' : '#94a3b8' }}>
              {canEdit ? '✏️ แก้ไขได้' : '👁 ดูอย่างเดียว'}
            </div>
          </div>
        </div>
      }
    >
      <hr style={{ margin: 0, borderColor: '#f1f5f9' }} />

      {/* Photo */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
          📸 รูปภาพทีม (URL)
        </label>
        {canEdit ? (
          <input
            className="login-input"
            value={edit.photo}
            onChange={e => setEdit(p => ({ ...p, photo: e.target.value }))}
            placeholder="https://..."
            style={{ fontSize: '0.8125rem' }}
          />
        ) : (
          <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{edit.photo || '—'}</div>
        )}
      </div>

      {/* Teacher */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
          👨‍🏫 ครูพี่เลี้ยงทีม
        </label>
        {canEdit ? (
          <select
            className="login-input"
            value={edit.teacherId}
            onChange={e => setEdit(p => ({ ...p, teacherId: e.target.value }))}
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="">— ยังไม่กำหนด —</option>
            {teacherList.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        ) : (
          <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
            {teacherList.find(u => u.id === edit.teacherId)?.name || '—'}
          </div>
        )}
      </div>

      {/* Members */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            👥 สมาชิกทีม ({edit.memberIds.length} คน)
          </label>
          {canEdit && <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>เลือก / ยกเลิกเลือก</span>}
        </div>
        {canEdit && (
          <input
            className="login-input"
            value={edit.memberSearch}
            onChange={e => setEdit(p => ({ ...p, memberSearch: e.target.value }))}
            placeholder="🔍 ค้นหาชื่อ..."
            style={{ marginBottom: '0.4rem', fontSize: '0.8125rem' }}
          />
        )}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', background: '#fafafa' }}>
          {canEdit ? (
            filteredStudents.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>ไม่พบนักเรียน</div>
            ) : (
              filteredStudents.map(s => {
                const checked = edit.memberIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '0.4rem 0.75rem', cursor: 'pointer',
                      background: checked ? '#eff6ff' : 'transparent',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={ev => setEdit(p => ({
                        ...p,
                        memberIds: ev.target.checked
                          ? [...p.memberIds, s.id]
                          : p.memberIds.filter(id => id !== s.id),
                        leaderId: !ev.target.checked && p.leaderId === s.id ? '' : p.leaderId,
                      }))}
                      style={{ width: 15, height: 15, accentColor: 'var(--color-primary)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: checked ? 600 : 400 }}>{s.name}</span>
                    {s.nickname && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({s.nickname})</span>}
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{s.username}</span>
                  </label>
                );
              })
            )
          ) : (
            selectedMemberObjs.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>ยังไม่มีสมาชิก</div>
            ) : (
              selectedMemberObjs.map(s => (
                <div
                  key={s.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.4rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}
                >
                  <span style={{ fontSize: '0.875rem' }}>{s.name}{s.nickname ? ` (${s.nickname})` : ''}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{s.username}</span>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Leader */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
          👑 หัวหน้าทีม
        </label>
        {canEdit ? (
          <select
            className="login-input"
            value={edit.leaderId}
            onChange={e => setEdit(p => ({ ...p, leaderId: e.target.value }))}
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="">— ยังไม่กำหนด —</option>
            {(edit.memberIds.length > 0 ? selectedMemberObjs : teamStudents).map(s => (
              <option key={s.id} value={s.id}>{s.name}{s.nickname ? ` (${s.nickname})` : ''}</option>
            ))}
          </select>
        ) : (
          <div style={{
            fontSize: '0.8125rem',
            color: edit.leaderId ? '#d97706' : '#94a3b8',
            fontWeight: edit.leaderId ? 600 : 400,
          }}>
            {selectedMemberObjs.find(s => s.id === edit.leaderId)?.name || '—'}
          </div>
        )}
      </div>

      {/* Courses — admin only */}
      {user?.role === 'admin' && (
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
            📚 หลักสูตรที่ทีมนี้ลงทะเบียน
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {coursesAll.map(c => {
              const checked = (edit.courseIds || []).includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => setEdit(p => ({
                    ...p,
                    courseIds: checked
                      ? (p.courseIds || []).filter(id => id !== c.id)
                      : [...(p.courseIds || []), c.id],
                  }))}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', cursor: 'pointer',
                    background: checked ? 'var(--color-primary)' : '#f1f5f9',
                    color: checked ? '#fff' : '#475569',
                    border: `1px solid ${checked ? 'var(--color-primary)' : '#e2e8f0'}`,
                    fontWeight: checked ? 600 : 400,
                  }}
                >
                  {checked ? '✓ ' : ''}{c.name || c.id}
                </button>
              );
            })}
          </div>
          {(edit.courseIds || []).length === 0 && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.3rem' }}>⚠️ ต้องเลือกอย่างน้อย 1 หลักสูตร</div>
          )}
        </div>
      )}

      {/* Footer */}
      {canEdit ? (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem 1.1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="login-btn"
            style={{ padding: '0.45rem 1.25rem', width: 'auto', fontSize: '0.875rem', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '0.25rem' }}>
          เฉพาะสมาชิกทีมหรืออาจารย์เท่านั้นที่แก้ไขได้
        </div>
      )}
    </Modal>
  );
}
