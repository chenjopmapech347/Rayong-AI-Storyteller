// src/components/RadarChart.jsx
// Custom SVG radar chart — renders a 5-axis competency chart for team scoring.
// Pure / memo'd · no app state dependencies.
//
// Props:
//   data:   number[]  — score per axis (0-5 scale)
//   labels: string[]  — label per axis (must be same length as data)

import { memo } from 'react';

const RadarChart = memo(({ data, labels }) => {
  const size = 200;
  const center = size / 2;
  const radius = center - 40;
  const angleStep = (Math.PI * 2) / labels.length;

  const points = data.map((val, i) => {
    const r = (val / 5) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size}>
        {/* Grid Lines (concentric pentagons) */}
        {gridLevels.map((lvl, idx) => (
          <polygon
            key={idx}
            points={labels.map((_, i) => {
              const r = lvl * radius;
              const angle = i * angleStep - Math.PI / 2;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines + labels */}
        {labels.map((lbl, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const lx = center + (radius + 20) * Math.cos(angle);
          const ly = center + (radius + 15) * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={lx} y={ly} fontSize="10" textAnchor="middle" fill="#64748b" dominantBaseline="middle">{lbl}</text>
            </g>
          );
        })}
        {/* Data shape */}
        <polygon points={points} fill="rgba(29, 158, 117, 0.3)" stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
    </div>
  );
});

export default RadarChart;
