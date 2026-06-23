// src/components/GenericForm.jsx
// Schema-driven form renderer (v2.0 Phase 4) — pure / memo'd.
// Used by:
//   - Admin Course Editor → live preview of a worksheet schema
//   - Student Worksheets tab → actual data entry (Phase 7)
//
// Supported field types (8 working + 7 deferred placeholders):
//   ✓ text · textarea · number · date · select · radio · checkbox · list
//   ⏳ image · drawing · table · matrix-2x2 · categorize · signature · audio
//      (these render a "เร็ว ๆ นี้" notice; coming in later phases)
//
// Schema shape: { fields: [{ id, type, label, ...typeOpts }], instructionTH?: string }

import { memo } from 'react';

// Dropdown options for the schema editor (admin-facing).
// eslint-disable-next-line react-refresh/only-export-components
export const FIELD_TYPES = [
  { id: 'text',     label: 'Text (บรรทัดเดียว)' },
  { id: 'textarea', label: 'Textarea (หลายบรรทัด)' },
  { id: 'number',   label: 'Number' },
  { id: 'date',     label: 'Date' },
  { id: 'select',   label: 'Select (dropdown)' },
  { id: 'radio',    label: 'Radio (เลือก 1)' },
  { id: 'checkbox', label: 'Checkbox (boolean)' },
  { id: 'list',     label: 'List (repeating group)' },
  { id: 'image',    label: 'Image (เร็ว ๆ นี้)' },
  { id: 'drawing',  label: 'Drawing (เร็ว ๆ นี้)' },
  { id: 'table',    label: 'Table (เร็ว ๆ นี้)' },
];

// Renders a single field; recursive for `list` type via itemSchema.
const FieldRenderer = memo(function FieldRenderer({ field, value, onChange, disabled }) {
  const common = {
    style: { width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.875rem', fontFamily: 'inherit' },
    disabled
  };
  switch (field.type) {
    case 'text':
      return <input type="text" {...common} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} maxLength={field.maxLength} />;
    case 'textarea':
      return <textarea {...common} rows={field.rows || 4} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />;
    case 'number':
      return <input type="number" {...common} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))} min={field.min} max={field.max} step={field.step || 1} />;
    case 'date':
      return <input type="date" {...common} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'select':
      return (
        <select {...common} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">-- เลือก --</option>
          {(field.options || []).map(opt => {
            const v = typeof opt === 'string' ? opt : opt.value || opt.label;
            const l = typeof opt === 'string' ? opt : opt.label || opt.value;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      );
    case 'radio':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(field.options || []).map(opt => {
            const v = typeof opt === 'string' ? opt : opt.value || opt.label;
            const l = typeof opt === 'string' ? opt : opt.label || opt.value;
            return (
              <label key={v} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="radio" name={field.id} checked={value === v} onChange={() => onChange(v)} disabled={disabled} /> {l}
              </label>
            );
          })}
        </div>
      );
    case 'checkbox':
      return (
        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} disabled={disabled} /> {field.checkboxLabel || 'ใช่'}
        </label>
      );
    case 'list': {
      const items = Array.isArray(value) ? value : [];
      const itemSchema = field.itemSchema || [{ id: 'text', type: 'text', label: 'รายการ' }];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: 8, background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>#{idx + 1}</span>
                <button type="button" onClick={() => { const next = [...items]; next.splice(idx, 1); onChange(next); }} disabled={disabled} style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', borderRadius: 4, cursor: 'pointer' }}>🗑</button>
              </div>
              {itemSchema.map(sub => (
                <div key={sub.id} style={{ marginTop: 4 }}>
                  <label style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>{sub.label || sub.id}</label>
                  <FieldRenderer field={sub} value={item?.[sub.id]} onChange={(v) => { const next = [...items]; next[idx] = { ...item, [sub.id]: v }; onChange(next); }} disabled={disabled} />
                </div>
              ))}
            </div>
          ))}
          <button type="button" onClick={() => onChange([...items, {}])} disabled={disabled || (field.maxItems && items.length >= field.maxItems)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', border: '1px dashed #0ea5e9', background: '#f0f9ff', color: '#0369a1', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' }}>+ เพิ่มรายการ</button>
          {field.minItems && items.length < field.minItems && <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>⚠ ต้องมีอย่างน้อย {field.minItems} รายการ</span>}
        </div>
      );
    }
    case 'image':
    case 'drawing':
    case 'table':
    case 'matrix-2x2':
    case 'categorize':
    case 'signature':
    case 'audio':
      return <div style={{ padding: '0.5rem', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 6, fontSize: '0.75rem', color: '#854d0e' }}>⏳ Field type <strong>{field.type}</strong> — รองรับใน Phase ถัดไป</div>;
    default:
      return <input type="text" {...common} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={`[${field.type} unknown]`} />;
  }
});

// Top-level form: takes a worksheet schema + value + onChange and renders all fields.
const GenericForm = memo(function GenericForm({ schema, value, onChange, disabled, showInstruction = true }) {
  if (!schema) return <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>ยังไม่มี schema</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showInstruction && schema.instructionTH && (
        <div style={{ padding: '0.6rem', background: '#eff6ff', borderRadius: 6, fontSize: '0.8rem', color: '#1e40af', borderLeft: '3px solid #0ea5e9' }}>
          💡 {schema.instructionTH}
        </div>
      )}
      {(schema.fields || []).map(field => (
        <div key={field.id}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
            {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
          </label>
          {field.description && <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: 4 }}>{field.description}</p>}
          <FieldRenderer field={field} value={(value || {})[field.id]} onChange={(v) => onChange({ ...(value || {}), [field.id]: v })} disabled={disabled} />
        </div>
      ))}
    </div>
  );
});

export default GenericForm;
