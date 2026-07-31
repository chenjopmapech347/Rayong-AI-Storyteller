// src/LoginPage.jsx — Restored Light UI
const logoDataUrl = "data:image/webp;base64,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";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Leaf, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, seedFirebase, resetUserPassword, subscribeToAppConfig } from './api';
import { EMAIL_DOMAIN } from './constants/config';
import { useToast } from './Toast';
import { useEffect } from 'react';

// Local copy of branding helper — หลีกเลี่ยง circular import กับ App.jsx
const DEFAULT_BRANDING_LP = {
  brandName: 'ขั้นตอน/กระบวนการสร้างนวัตกรรม',
  brandTagline: '4-Identities AI Storytellers',
  logoEmoji: '🌿'
};
const getBrandingLP = (cfg) => ({ ...DEFAULT_BRANDING_LP, ...(cfg?.branding || {}) });

const DEMO_HINTS = [
  { username: 'admin',   password: 'admin123',   label: 'Admin', color: '#7F77DD', bg: '#EEEDFE' },
  { username: 'teacher', password: 'teacher123', label: 'Teacher', color: '#1D9E75', bg: '#E1F5EE' },
  { username: 'student', password: 'student123', label: 'Student', color: '#378ADD', bg: '#E6F1FB' },
  { username: 'sage',    password: 'sage123',    label: 'Sage', color: '#D97706', bg: '#FEF3C7' },
];

export default function LoginPage({ onLogin }) {
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [setupMsg, setSetupMsg] = useState(null);
  const [appCfg,   setAppCfg]   = useState({});
  useEffect(() => {
    const unsub = subscribeToAppConfig((cfg) => setAppCfg(cfg || {}));
    return () => unsub && unsub();
  }, []);
  const branding = getBrandingLP(appCfg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSetupMsg(null);
    setLoading(true);
    try {
      const user = await login(username, password);
      toast.success(`ยินดีต้อนรับ ${user.name || username}!`);
      onLogin(user);
    } catch (err) {
      const msg = err.message || 'Username หรือ Password ไม่ถูกต้อง';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const runSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await seedFirebase();
      if (res.ok) {
        const msg = 'ตั้งค่าระบบสำเร็จ! คุณสามารถเข้าใช้งานได้ทันที';
        setSetupMsg({ type: 'success', text: msg });
        toast.success(msg);
      } else {
        setError(res.error);
        toast.error(res.error);
      }
    } catch (err) {
      const msg = 'Setup ล้มเหลว: ' + err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-logo" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <img
            src={logoDataUrl}
            alt={branding.brandName}
            style={{ width: '240px', height: 'auto', objectFit: 'contain', marginBottom: '0.5rem' }}
          />
        </div>

        <h2 style={{ marginBottom: '0.5rem' }}>เข้าสู่ระบบ</h2>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          พลิกโลกการท่องเที่ยวสีเขียวด้วยพลัง AI
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="ldt-stat-lbl" style={{ marginBottom: '0.4rem', display: 'block' }}>Username</label>
            <input
              className="login-input"
              type="text"
              placeholder="admin, teacher, student"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label className="ldt-stat-lbl" style={{ marginBottom: '0.4rem', display: 'block' }}>Password</label>
            <input
              className="login-input"
              type={showPw ? 'text' : 'password'}
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--color-orange)', fontSize: '0.75rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          
          {setupMsg && (
            <div style={{ color: 'var(--color-primary)', fontSize: '0.75rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <CheckCircle2 size={14} /> {setupMsg.text}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : <><LogIn size={18} /> เข้าสู่ระบบ</>}
          </button>
        </form>

        {/* Forgot password link */}
        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={async () => {
              const guess = username.includes('@') ? username : (username ? `${username}${EMAIL_DOMAIN}` : '');
              const email = window.prompt('กรอก email ที่จะส่งลิงก์รีเซ็ตรหัสผ่าน:', guess);
              if (!email || !email.trim()) return;
              try {
                await resetUserPassword(email.trim());
                toast.success(`ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email.trim()} แล้ว · ตรวจ inbox/spam`);
              } catch (err) {
                toast.error('ส่งลิงก์ไม่สำเร็จ: ' + err.message);
              }
            }}
            style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {DEMO_HINTS.map(h => (
            <button 
              key={h.username}
              onClick={() => { setUsername(h.username); setPassword(h.password); }}
              style={{ 
                background: h.bg, color: h.color, border: 'none', 
                padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {h.label}
            </button>
          ))}
        </div>

        <button 
          onClick={runSetup}
          style={{ 
            marginTop: '1.5rem', width: '100%', background: 'none', border: '1px dashed var(--color-border)',
            padding: '0.6rem', borderRadius: '12px', color: 'var(--color-text-tertiary)', fontSize: '0.75rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <Rocket size={14} /> Setup Firebase
        </button>
      </motion.div>
    </div>
  );
}
