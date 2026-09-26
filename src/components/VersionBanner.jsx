/**
 * VersionBanner — ตรวจสอบเวอร์ชั่น app กับ server
 *
 * ทำงาน:
 *  1. fetch /version.json (ไฟล์ที่ deploy ล่าสุด) ตอน mount
 *  2. เทียบกับ __BUILD_TIME__ ที่ bake เข้า bundle ตอน build
 *  3. ถ้าไม่ตรง → แสดง banner พร้อมคำแนะนำตาม device
 *
 * ติดตั้ง: วาง <VersionBanner /> ไว้ใกล้ top ของ App return (ก่อน loading check)
 */

import { useEffect, useState } from 'react';

// ─── ค่าที่ bake เข้า bundle ตอน build ──────────────────
/* global __BUILD_TIME__, __APP_VERSION__ */
const BUNDLE_BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null;
const BUNDLE_VERSION    = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';

// ─── Device detection ────────────────────────────────────
function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) {
    if (/Chrome/i.test(ua)) return 'android-chrome';
    return 'android';
  }
  if (/Macintosh/i.test(ua) && 'ontouchend' in document) return 'ios'; // iPad Pro
  if (/Mac/i.test(ua)) {
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'mac-safari';
    return 'mac-chrome';
  }
  if (/Windows/i.test(ua)) return 'windows';
  return 'other';
}

// ─── คำแนะนำต่อ device ───────────────────────────────────
const INSTRUCTIONS = {
  'ios': {
    icon: '📱',
    label: 'iPhone / iPad',
    steps: [
      'กดปุ่ม Refresh (🔄) ค้างไว้ 1–2 วินาที',
      'แล้วเลือก "Reload Without Content Blockers"',
      'หรือไปที่ การตั้งค่า › Safari › ล้างประวัติและข้อมูลเว็บไซต์',
    ],
    shortcut: null,
  },
  'android-chrome': {
    icon: '📱',
    label: 'Android (Chrome)',
    steps: [
      'กดปุ่ม ⋮ มุมขวาบน',
      'เลือก การตั้งค่า › ความเป็นส่วนตัวและความปลอดภัย',
      'แตะ ล้างข้อมูลการท่องเว็บ → เลือก รูปภาพและไฟล์ที่แคชไว้',
      'กด ล้างข้อมูล แล้วโหลดหน้าใหม่',
    ],
    shortcut: null,
  },
  'android': {
    icon: '📱',
    label: 'Android',
    steps: [
      'เปิดเมนูเบราว์เซอร์ → ตั้งค่า → ล้างแคช',
      'แล้วโหลดหน้าเว็บใหม่',
    ],
    shortcut: null,
  },
  'mac-chrome': {
    icon: '💻',
    label: 'Mac (Chrome / Edge)',
    steps: ['กด ⌘ Cmd + Shift + R เพื่อ Hard Refresh'],
    shortcut: '⌘⇧R',
  },
  'mac-safari': {
    icon: '💻',
    label: 'Mac (Safari)',
    steps: [
      'เมนู Develop → Empty Caches (⌥⌘E)',
      'แล้วกด ⌘R เพื่อโหลดใหม่',
      '(เปิด Develop menu: Safari › Preferences › Advanced → ติ๊ก Show Develop menu)',
    ],
    shortcut: '⌥⌘E แล้ว ⌘R',
  },
  'windows': {
    icon: '🖥️',
    label: 'Windows (Chrome / Edge / Firefox)',
    steps: ['กด Ctrl + Shift + R เพื่อ Hard Refresh'],
    shortcut: 'Ctrl+Shift+R',
  },
  'other': {
    icon: '🌐',
    label: 'เบราว์เซอร์ทั่วไป',
    steps: [
      'ลองกด Ctrl+Shift+R หรือ Cmd+Shift+R',
      'หรือล้างแคชในเมนูตั้งค่าของเบราว์เซอร์',
    ],
    shortcut: null,
  },
};

// ─── Format buildTime to readable ────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('th-TH', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

// ─── Main component ───────────────────────────────────────
export default function VersionBanner() {
  const [status, setStatus] = useState('idle'); // idle | checking | outdated | current | error
  const [serverInfo, setServerInfo] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const device = detectDevice();
  const info = INSTRUCTIONS[device] || INSTRUCTIONS['other'];

  useEffect(() => {
    if (!BUNDLE_BUILD_TIME) return; // dev mode — ไม่ต้องเช็ค

    setStatus('checking');
    // cache-bust เพื่อกัน browser cache version.json เอง
    fetch(`/version.json?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        setServerInfo(data);
        if (data.buildTime && data.buildTime !== BUNDLE_BUILD_TIME) {
          setStatus('outdated');
        } else {
          setStatus('current');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  // ตรวจสอบทุก 5 นาทีในขณะที่หน้าเปิดอยู่
  useEffect(() => {
    if (!BUNDLE_BUILD_TIME) return;
    const id = setInterval(() => {
      fetch(`/version.json?t=${Date.now()}`)
        .then(r => r.json())
        .then(data => {
          if (data.buildTime && data.buildTime !== BUNDLE_BUILD_TIME) {
            setStatus('outdated');
            setDismissed(false); // แสดงใหม่ถ้า deploy ใหม่ขณะใช้งาน
          }
        })
        .catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (dismissed || status === 'idle' || status === 'checking' || status === 'error') return null;

  // ─── เวอร์ชั่นปัจจุบัน ────────────────────────────────
  if (status === 'current') {
    return (
      <div style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
        background: '#f0fdf4', border: '1px solid #86efac',
        borderRadius: 10, padding: '0.5rem 0.75rem',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: '0.75rem', color: '#166534', boxShadow: '0 2px 8px #0001',
        animation: 'fadeIn 0.3s',
      }}>
        <span>✅ เวอร์ชั่นล่าสุด</span>
        <span style={{ color: '#4ade80', fontWeight: 600 }}>v{BUNDLE_VERSION}</span>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4, color: '#16a34a', fontSize: '1rem', lineHeight: 1 }}
          title="ปิด"
        >×</button>
      </div>
    );
  }

  // ─── เวอร์ชั่นเก่า ────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#fffbeb', borderTop: '2px solid #f59e0b',
      boxShadow: '0 -4px 20px #0002',
    }}>
      {/* ─── Header bar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.625rem 1rem', cursor: 'pointer',
      }} onClick={() => setExpanded(e => !e)}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400e' }}>
            เวอร์ชั่นไม่เป็นปัจจุบัน — กรุณาอัปเดต
          </div>
          <div style={{ fontSize: '0.7rem', color: '#b45309' }}>
            คุณใช้: <strong>v{BUNDLE_VERSION}</strong> (build {formatDate(BUNDLE_BUILD_TIME)})
            &nbsp;·&nbsp;
            เวอร์ชั่นใหม่: <strong>v{serverInfo?.version}</strong> (build {formatDate(serverInfo?.buildTime)})
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#92400e' }}>{expanded ? '▼ ซ่อน' : '▲ ดูวิธีแก้'}</span>
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: '#92400e', fontSize: '1.25rem', lineHeight: 1, marginLeft: 4 }}
          title="ปิด (จะกลับมาแสดงอีกครั้งเมื่อโหลดหน้าใหม่)"
        >×</button>
      </div>

      {/* ─── Expanded instructions ─── */}
      {expanded && (
        <div style={{
          padding: '0 1rem 0.875rem',
          borderTop: '1px solid #fde68a',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: '1.5rem' }}>{info.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#78350f', marginBottom: 6 }}>
                วิธีแก้ไขสำหรับ {info.label}
                {info.shortcut && (
                  <span style={{
                    marginLeft: 8, background: '#fef3c7', border: '1px solid #f59e0b',
                    borderRadius: 4, padding: '0.1rem 0.4rem',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace',
                  }}>{info.shortcut}</span>
                )}
              </div>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: '#92400e', lineHeight: 1.7 }}>
                {info.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>

            {/* Quick reload button */}
            <button
              onClick={() => window.location.reload(true)}
              style={{
                padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff',
                border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer',
                fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              🔄 โหลดใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
