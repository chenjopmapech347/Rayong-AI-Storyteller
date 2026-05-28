// src/constants/branding.js
// White-label branding system — admin can swap brand identity per course/school.
// 4 ready-to-use presets cover common Thai regions; admin can also build custom.

export const DEFAULT_BRANDING = {
  brandName     : 'Green Rayong',
  brandTagline  : '4-Identities AI Storytellers',
  logoEmoji     : '🌿',
  region        : 'ระยอง',
  province      : 'ระยอง',
  primaryColor  : '#16a34a',
  secondaryColor: '#0ea5e9',
  pitchName     : 'Green Rayong Challenge',
  schoolName    : '',
  footerText    : 'พัฒนาเพื่อการศึกษา IoT + ภูมิปัญญาท้องถิ่น',
};

export const BRAND_PRESETS = [
  { name: 'Green Rayong (Default)', logoEmoji: '🌿', region: 'ระยอง',     province: 'ระยอง',     primaryColor: '#16a34a', secondaryColor: '#0ea5e9' },
  { name: 'Green Doi Saket',        logoEmoji: '🌲', region: 'ดอยสะเก็ด', province: 'เชียงใหม่', primaryColor: '#059669', secondaryColor: '#dc2626' },
  { name: 'Green Phuket',           logoEmoji: '🏝️', region: 'ภูเก็ต',     province: 'ภูเก็ต',     primaryColor: '#0891b2', secondaryColor: '#f59e0b' },
  { name: 'Green Ayutthaya',        logoEmoji: '🛕', region: 'อยุธยา',     province: 'อยุธยา',     primaryColor: '#a16207', secondaryColor: '#7c2d12' },
];

// Apply brand colors as CSS variables on :root + update document title.
// Called from a useEffect whenever appConfig changes.
export const applyBrandColors = (cfg) => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--brand-primary',   cfg.primaryColor   || DEFAULT_BRANDING.primaryColor);
  document.documentElement.style.setProperty('--brand-secondary', cfg.secondaryColor || DEFAULT_BRANDING.secondaryColor);
  if (cfg.brandName) document.title = `${cfg.brandName} · ${cfg.brandTagline || ''}`.trim();
};
