// src/LoginPage.jsx — Restored Light UI
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Leaf, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, seedFirebase } from './api';

const DEMO_HINTS = [
  { username: 'admin',   password: 'admin123',   label: 'Admin', color: '#7F77DD', bg: '#EEEDFE' },
  { username: 'teacher', password: 'teacher123', label: 'Teacher', color: '#1D9E75', bg: '#E1F5EE' },
  { username: 'student', password: 'student123', label: 'Student', color: '#378ADD', bg: '#E6F1FB' },
  { username: 'sage',    password: 'sage123',    label: 'Sage', color: '#D97706', bg: '#FEF3C7' },
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [setupMsg, setSetupMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSetupMsg(null);
    setLoading(true);
    try {
      const user = await login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Username หรือ Password ไม่ถูกต้อง');
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
        setSetupMsg({ type: 'success', text: 'ตั้งค่าระบบสำเร็จ! คุณสามารถเข้าใช้งานได้ทันที' });
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Setup ล้มเหลว: ' + err.message);
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
            <div className="login-logo-title">Green Rayong</div>
            <div className="login-logo-sub">4-Identities AI Storytellers</div>
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

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
