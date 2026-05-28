// src/components/StatBox.jsx
// Tiny stat card used in the dashboard header strip.
// Pure / memo'd · no app state dependencies.

import { memo } from 'react';

const StatBox = memo(({ icon: Icon, value, label, colorClass }) => (
  <div className="ldt-stat">
    <div className={`ldt-logo-icon ${colorClass}`} style={{ width: '32px', height: '32px' }}>
      <Icon size={18} />
    </div>
    <div>
      <div className="ldt-stat-num">{value}</div>
      <div className="ldt-stat-lbl">{label}</div>
    </div>
  </div>
));

export default StatBox;
