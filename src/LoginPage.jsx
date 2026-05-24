// src/LoginPage.jsx — Restored Light UI
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Leaf, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, seedFirebase, resetUserPassword, subscribeToAppConfig } from './api';
import { useToast } from './Toast';
import { useEffect } from 'react';

// Local copy of branding helper — หลีกเลี่ยง circular import กับ App.jsx
const DEFAULT_BRANDING_LP = {
  brandName: 'Green Rayong',
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
        <div className="login-logo">
          <div className="login-logo-icon"><Leaf size={28} /></div>
          <div>
            <div className="login-logo-title">{branding.brandName}</div>
            <div className="login-logo-sub">{branding.brandTagline}</div>
          </div>
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
              const guess = username.includes('@') ? username : (username ? `${username}@eco.com` : '');
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
