// src/App.jsx — Fully Restored ALL Main Headings & Steps (Light UI)
import { useState, useEffect, memo } from 'react';
import {
  Send,
  User,
  Users,
  LogOut,
  Zap,
  Cpu,
  Monitor,
  CheckCircle2,
  Activity,
  Save,
  Award,
  AlertCircle,
  Plus,
  Settings,
  Database,
  LayoutGrid,
  Inbox,
  Camera,
  LayoutDashboard,
  Target,
  Star,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import {
  logout,
  getUsers,
  getRubrics,
  saveSubmission,
  seedFirebase,
  subscribeToStats,
  subscribeToFeed,
  subscribeToTeams,
  getTeamSubmissionData,
  adminUpdateTeam,
  adminDeleteTeam,
  adminCreateTeam,
  adminDeleteUser,
  adminCreateUser,
  adminUpdateUser,
  subscribeToGoodPrompts,
  saveGoodPrompt,
  deleteGoodPrompt,
  saveTeamScores,
  subscribeToTeamScores,
  getMyTeamScores
} from './api';

// The five evaluation dimensions used in BOTH the Pitching Evaluator
// and the EVAL-MATRIX. Keep these in sync so scores entered in one
// place show up in the other.
const SCORE_DIMENSIONS = ['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'];

// All evaluator roles we display in the matrix legend / cell badges.
const EVALUATOR_ROLES = ['self', 'peer', 'teacher', 'sage', 'ai'];

// Thai labels for rubric levels 1-4. Levels beyond 4 fall back to "ระดับที่ N".
const RUBRIC_LEVEL_LABELS = ['ปรับปรุง', 'พอใช้', 'ดี', 'ดีเยี่ยม'];

// ─────────────────────────────────────────────────────────────────────
// I18N — Minimal bilingual dictionary (TH default, EN switcher)
// Keys map to user-facing UI labels. App keeps Thai-first content,
// EN is for international showcase / Pitching judges who prefer English.
// ─────────────────────────────────────────────────────────────────────
const I18N = {
  th: {
    // Menu labels
    'Public View'         : 'มุมมองสาธารณะ',
    'Explorer UI'         : 'จัดการทีม',
    'Team Management'     : 'จัดการทีม',
    'Mission Inbox'       : 'รับโจทย์',
    'On-site Collector'   : 'เก็บข้อมูลภาคสนาม',
    'Submission Gateway'  : 'ส่งงาน',
    'Evaluation Hub'      : 'ศูนย์ประเมิน',
    'AI Audit Logbook'    : 'บันทึก AI',
    'Report (R6)'         : 'รายงาน (R6)',
    'Real-Time Dashboard' : 'แดชบอร์ดเรียลไทม์',
    'Mission Builder'     : 'สร้างโจทย์',
    'Pitching Evaluator'  : 'ประเมิน Pitching',
    'Report (R1-R6)'      : 'รายงาน (R1-R6)',
    'Reports R1-R6'       : 'รายงาน R1-R6',
    'Admin Panel'         : 'แผงผู้ดูแล',
    // Header / Generic
    'Logout'              : 'ออกจากระบบ',
    'Language'            : 'ภาษา',
    'Switch to English'   : 'เปลี่ยนเป็นอังกฤษ',
    'Switch to Thai'      : 'เปลี่ยนเป็นไทย',
    // Evaluator roles
    'eval_self'           : 'ประเมินตนเอง',
    'eval_peer'           : 'เพื่อนประเมิน',
    'eval_teacher'        : 'ครูประเมิน',
    'eval_sage'           : 'ปราชญ์ประเมิน',
    'eval_ai'             : 'AI ประเมิน',
    // Rubric levels
    'level_improve'       : 'ปรับปรุง',
    'level_fair'          : 'พอใช้',
    'level_medium'        : 'ปานกลาง',
    'level_good'          : 'ดี',
    'level_excellent'     : 'ดีเยี่ยม',
  },
  en: {
    // Menu labels (English — passthrough for menu names already in EN)
    'Public View'         : 'Public View',
    'Explorer UI'         : 'Team Management',
    'Team Management'     : 'Team Management',
    'Mission Inbox'       : 'Mission Inbox',
    'On-site Collector'   : 'On-site Collector',
    'Submission Gateway'  : 'Submission Gateway',
    'Evaluation Hub'      : 'Evaluation Hub',
    'AI Audit Logbook'    : 'AI Audit Logbook',
    'Report (R6)'         : 'Report (R6)',
    'Real-Time Dashboard' : 'Real-Time Dashboard',
    'Mission Builder'     : 'Mission Builder',
    'Pitching Evaluator'  : 'Pitching Evaluator',
    'Report (R1-R6)'      : 'Reports (R1-R6)',
    'Reports R1-R6'       : 'Reports R1-R6',
    'Admin Panel'         : 'Admin Panel',
    // Header / Generic
    'Logout'              : 'Logout',
    'Language'            : 'Language',
    'Switch to English'   : 'Switch to English',
    'Switch to Thai'      : 'Switch to Thai',
    // Evaluator roles
    'eval_self'           : 'Self-Evaluation',
    'eval_peer'           : 'Peer Evaluation',
    'eval_teacher'        : 'Teacher Evaluation',
    'eval_sage'           : 'Sage Evaluation',
    'eval_ai'             : 'AI Evaluation',
    // Rubric levels
    'level_improve'       : 'Needs Improvement',
    'level_fair'          : 'Fair',
    'level_medium'        : 'Medium',
    'level_good'          : 'Good',
    'level_excellent'     : 'Excellent',
  },
};
// Look up TH first, fall back to EN, then return the raw key (safe default)
const makeT = (lang) => (k) => I18N[lang]?.[k] ?? I18N.th[k] ?? k;

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
        {/* Grid Lines */}
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
        {/* Axis */}
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
        {/* Data Shape */}
        <polygon points={points} fill="rgba(29, 158, 117, 0.3)" stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
    </div>
  );
});

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('teacher-dashboard');
  const [adminSubTab, setAdminSubTab] = useState('management');
  const [reportType, setReportType] = useState('R1');

  // ─── i18n: Thai default, EN toggle for international showcase ───
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rep_lang') || 'th'; } catch { return 'th'; }
  });
  const t = makeT(lang);
  const toggleLang = () => {
    const next = lang === 'th' ? 'en' : 'th';
    setLang(next);
    try { localStorage.setItem('rep_lang', next); } catch {}
  };
  
  // App Stats
  const [stats, setStats] = useState({ totalTeams: 0, submitted: 0, pending: 0, aiPrompts: 0 });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  // --- Student Form States ---
  const [teamInfo, setTeamInfo] = useState({ name: '', members: '', photo: '' });
  const [missionData, setMissionData] = useState({ module: '', product: '', reason: '' });
  const [collectorData, setCollectorData] = useState({ 
    interview: 'สัมภาษณ์ปราชญ์ชาวบ้าน: ลุงบุญมี เล่าว่าแต่ก่อนพื้นที่นี้เคยเป็นป่าชายเลนที่อุดมสมบูรณ์ ปัจจุบันเริ่มมีปัญหาขยะ...\n(จำลองข้อมูลถูกบันทึกแบบ Offline ไว้ในเครื่องแล้ว)', 
    sagePhoto: '' 
  });
  const [gatewayData, setGatewayData] = useState({
    wisdom: '', environment: '', brainstorm: '', prototype: '', videoUrl: '', bmc: '', aiLogs: ''
  });

  // --- Mock Data for Testing ---
  const [missionStatus] = useState({ status: 'Rejected', feedback: 'ไอเดียผลิตภัณฑ์ยังไม่ชัดเจน ขอให้เน้นเรื่องการใช้วัสดุจากธรรมชาติในท้องถิ่นเพิ่มเติมครับ' });
  const [showEvalForm, setShowEvalForm] = useState(null); // 'self' or 'peer'
  const mockTeammates = [{ id: 'u2', name: 'สมชาย รักดี' }, { id: 'u3', name: 'สมหญิง รักโลก' }];
  const mockReportData = [
    { team: 'Team Alpha', self: 8.5, peer: 12, teacher: 30, sage: 28, ai: 9, total: 87.5 },
    { team: 'Team Beta', self: 9.0, peer: 14, teacher: 32, sage: 25, ai: 8, total: 88.0 },
    { team: 'Team Gamma', self: 7.5, peer: 10, teacher: 28, sage: 20, ai: 7, total: 72.5 },
  ];

  // --- Teacher / Assessor States ---
  const [missionConfig, setMissionConfig] = useState({ name: '', rubric: '', deadline: '' });
  // evalScore is keyed by `${teamId}-${dimension}` so each team keeps its own scores.
  const [evalScore, setEvalScore] = useState({});
  const [evalComment, setEvalComment] = useState('');
  // Aggregated team scores from /api/team-scores — drives the EVAL-MATRIX.
  const [teamScores, setTeamScores] = useState([]);

  // Data
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]); 
  const [goodPrompts, setGoodPrompts] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState(null);
  const [rubrics, setRubrics] = useState([]);
  const [assessorSubTab, setAssessorSubTab] = useState('teams');
  const [appError, setAppError] = useState(null);

  // --- Admin Editing States ---
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'student', teamId: '' });
  const [newTeam, setNewTeam] = useState({ name: '', teacherId: '' });

  useEffect(() => {
    const saved = localStorage.getItem('eco_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      // Pick a default tab that the user's role actually has
      if (u?.role === 'student')      setActiveTab('team-setup');
      else if (u?.role === 'sage')    setActiveTab('pitch-evaluator');
      else if (u?.role === 'admin')   setActiveTab('admin');
      else                            setActiveTab('teacher-dashboard');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setAppError(null);
    
    // 1. Subscribe to Real-Time Stats (Public)
    const unsubStats = subscribeToStats((s) => setStats(s));
    
    // 2. Subscribe to Live Feed (Public)
    const unsubFeed = subscribeToFeed((f) => setFeed(f));
    
    // 3. Subscribe to Teams List (Public)
    const unsubTeams = subscribeToTeams((t) => setTeams(t));

    // 4. Subscribe to Good Prompts (Public)
    const unsubPrompts = subscribeToGoodPrompts((p) => setGoodPrompts(p));

    // 5. Subscribe to aggregated team scores (drives the EVAL-MATRIX)
    const unsubTeamScores = subscribeToTeamScores((s) => setTeamScores(s));

    // 5. Fetch static data (Rubrics are public, Users are admin only)
    const loadStatic = async () => {
      try {
        const r = await getRubrics().catch(() => []);
        setRubrics(r);
        if (user?.role === 'admin') {
          const u = await getUsers().catch(() => []);
          setUsers(u);
        }
      } catch (err) { console.error("Fetch static failed", err); }
    };
    loadStatic();

    return () => {
      unsubStats();
      unsubFeed();
      unsubTeams();
      unsubPrompts();
      unsubTeamScores();
    };
  }, [user?.role]); // Re-run if role changes (e.g. login/logout)

  // Effect to load selected team's data when changed
  useEffect(() => {
    if (selectedTeam) {
      getTeamSubmissionData(selectedTeam.id).then(setSelectedTeamData);
      // Pre-fill the Pitching Evaluator with my previous scores for this team.
      if (user) {
        getMyTeamScores(selectedTeam.id)
          .then(rows => {
            setEvalScore(prev => {
              const next = { ...prev };
              rows.forEach(r => { next[`${selectedTeam.id}-${r.dimension}`] = r.score; });
              return next;
            });
            const lastComment = rows.find(r => r.comment)?.comment || '';
            setEvalComment(lastComment);
          })
          .catch(() => {/* ignore — fresh scoring is fine */});
      }
    } else {
      setSelectedTeamData(null);
      setEvalComment('');
    }
  }, [selectedTeam, user]);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleSave = async (tabName, data) => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
      return;
    }
    try {
      await saveSubmission({
        teamId: user.teamId || user.team_id || 'demo_team',
        step:   tabName,
        content: typeof data === 'string' ? data : JSON.stringify(data)
      });
      alert('บันทึกข้อมูลสำเร็จ');
    } catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>กำลังเข้าสู่ระบบ...</div>;
  if (showLogin && !user) {
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowLogin(false)} className="login-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: '#64748b' }}>ยกเลิก / กลับไปดู Dashboard</button>
        <LoginPage onLogin={(u) => { setUser(u); setShowLogin(false); }} />
      </div>
    );
  }
  // Note: We don't block here anymore to allow public dashboard view

  const safeStats = stats || { totalTeams: 0, submitted: 0, pending: 0, aiPrompts: 0 };

  return (
    <div className="app-layout">
      {appError && (
        <div style={{ background: '#fffbeb', color: '#92400e', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', borderBottom: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 1000, position: 'relative' }}>
          <AlertCircle size={16} /> {appError}
          <button onClick={() => window.location.reload()} style={{ background: '#92400e', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>ลองใหม่</button>
        </div>
      )}

      <header className="live-dashboard-top">
        <div className="ldt-header">
          <div className="ldt-title-wrap">
            <div className="ldt-logo-icon"><Zap size={20} /></div>
            <div>
              <div className="ldt-title">Green Rayong: {!user ? 'Public Dashboard' : (user.role === 'student' ? 'Explorer UI' : 'Assessor UI')}</div>
              <div className="ldt-sub">4-Identities AI Storytellers | {!user ? 'โหมดบุคคลทั่วไป' : `ระบบนิเวศการเรียนรู้ ${user.role === 'student' ? 'นักเรียน' : 'ครู/Facilitator'}`}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             {user ? (
               <>
                 <div className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} /> {user.name} ({user.role})
                 </div>
                 <button onClick={handleLogout} className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', cursor: 'pointer' }}>
                    <LogOut size={14} /> ออก
                 </button>
               </>
             ) : (
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <div className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                   <Activity size={14} className="live-dot" style={{ display: 'inline-block', marginRight: '6px' }} /> LIVE
                 </div>
                 <button onClick={() => setShowLogin(true)} className="card" style={{ padding: '0.4rem 0.8rem', margin: 0, fontSize: '0.75rem', cursor: 'pointer', background: 'var(--color-primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> เข้าสู่ระบบ
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* Global Real-Time Stats Dashboard */}
        <div className="ldt-stats" style={{ marginTop: '0.5rem' }}>
          <StatBox icon={Users} value={safeStats.totalTeams} label="Teams" colorClass="bg-blue-light" />
          <StatBox icon={CheckCircle2} value={safeStats.submitted} label="Submitted" colorClass="bg-primary-light" />
          <StatBox icon={Activity} value={safeStats.pending} label="In Progress" colorClass="bg-amber-light" />
          <StatBox icon={Cpu} value={safeStats.aiPrompts} label="AI Prompts" colorClass="bg-purple-light" />
        </div>

        {/* Global Live Feed Ticker */}
        <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(241, 245, 249, 0.5)', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', borderRight: '1px solid var(--color-border)', paddingRight: '10px' }}>
              <Activity size={12} className="live-dot" /> LIVE FEED
           </div>
           <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
              <motion.div 
                 animate={{ x: [0, -100 * (feed.length || 1)] }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 style={{ display: 'inline-flex', gap: '2rem' }}
              >
                 {feed.length > 0 ? feed.map((f, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                       <strong style={{ color: 'var(--color-text-primary)' }}>{f.team_name || 'Team'}:</strong> {f.action} {f.detail ? `(${f.detail})` : ''}
                    </span>
                 )) : <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>กำลังติดตามความเคลื่อนไหวล่าสุด...</span>}
              </motion.div>
           </div>
        </div>
      </header>

      <nav className="tab-nav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {!user && (
          <div className="tab-item active"><LayoutDashboard size={16} /> {t('Public View')}</div>
        )}
        {user?.role === 'student' && (
          <>
            <div className={`tab-item ${activeTab === 'team-setup' ? 'active' : ''}`} onClick={() => setActiveTab('team-setup')}><Users size={16} /> {t('Explorer UI')}</div>
            <div className={`tab-item ${activeTab === 'mission-inbox' ? 'active' : ''}`} onClick={() => setActiveTab('mission-inbox')}><Inbox size={16} /> {t('Mission Inbox')}</div>
            <div className={`tab-item ${activeTab === 'collector' ? 'active' : ''}`} onClick={() => setActiveTab('collector')}><Camera size={16} /> {t('On-site Collector')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'evaluation-hub' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation-hub')}><Star size={16} /> {t('Evaluation Hub')}</div>
            <div className={`tab-item ${activeTab === 'public-portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('public-portfolio')}><Award size={16} /> {t('Report (R6)')}</div>
          </>
        )}
        {(user?.role === 'teacher' || user?.role === 'facilitator') && (
          <>
            <div className={`tab-item ${activeTab === 'teacher-dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-dashboard')}><Monitor size={16} /> {t('Real-Time Dashboard')}</div>
            <div className={`tab-item ${activeTab === 'mission-builder' ? 'active' : ''}`} onClick={() => setActiveTab('mission-builder')}><Target size={16} /> {t('Mission Builder')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'ai-audit-log' ? 'active' : ''}`} onClick={() => setActiveTab('ai-audit-log')}><ShieldCheck size={16} /> {t('AI Audit Logbook')}</div>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'teacher-reports' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-reports')}><FileSpreadsheet size={16} /> {t('Report (R1-R6)')}</div>
          </>
        )}
        {user?.role === 'sage' && (
          <>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'public-portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('public-portfolio')}><Award size={16} /> {t('Report (R6)')}</div>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <div className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}><Settings size={16} /> {t('Admin Panel')}</div>
            <div className={`tab-item ${activeTab === 'team-setup' ? 'active' : ''}`} onClick={() => setActiveTab('team-setup')}><Users size={16} /> {t('Team Management')}</div>
            <div className={`tab-item ${activeTab === 'teacher-dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-dashboard')}><Monitor size={16} /> {t('Real-Time Dashboard')}</div>
            <div className={`tab-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}><Send size={16} /> {t('Submission Gateway')}</div>
            <div className={`tab-item ${activeTab === 'ai-audit-log' ? 'active' : ''}`} onClick={() => setActiveTab('ai-audit-log')}><ShieldCheck size={16} /> {t('AI Audit Logbook')}</div>
            <div className={`tab-item ${activeTab === 'pitch-evaluator' ? 'active' : ''}`} onClick={() => setActiveTab('pitch-evaluator')}><Star size={16} /> {t('Pitching Evaluator')}</div>
            <div className={`tab-item ${activeTab === 'teacher-reports' ? 'active' : ''}`} onClick={() => setActiveTab('teacher-reports')}><FileSpreadsheet size={16} /> {t('Reports R1-R6')}</div>
          </>
        )}
        {/* ─── Language switcher (TH ↔ EN) — always visible on right side ─── */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem', padding: '0 0.75rem' }}>
          <button
            onClick={toggleLang}
            title={lang === 'th' ? t('Switch to English') : t('Switch to Thai')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              background: '#fff',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            🌐 {lang === 'th' ? 'TH ▾' : 'EN ▾'}
          </button>
        </div>
      </nav>

      <main className="user-area">
        {!user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="lane">
               <div className="lane-header bg-primary-light"><LayoutDashboard size={16} /> ภาพรวมทักษะรายทีม (Public Overview)</div>
               <div className="lane-content">
                  <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                     <h4 style={{ marginBottom: '1rem' }}>Skill Chart (Average)</h4>
                     <RadarChart data={[4, 3, 5, 2, 4]} labels={['AI', 'Wisdom', 'Creative', 'Business', 'Story']} />
                     <p style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#64748b' }}>สรุปขีดความสามารถเฉลี่ยของทุกทีมในขณะนี้</p>
                  </div>
               </div>
            </div>
            <LoginPage onLogin={setUser} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'team-setup' && (
             <motion.div key="ts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light">Explorer UI — จัดการทีมของฉัน</div>
               <div className="lane-content">
                  <div className="grid-2">
                    <input className="login-input" value={teamInfo.name} onChange={e=>setTeamInfo({...teamInfo, name: e.target.value})} placeholder="ชื่อทีม..." />
                    <input className="login-input" value={teamInfo.photo} onChange={e=>setTeamInfo({...teamInfo, photo: e.target.value})} placeholder="Link รูปถ่ายทีม..." />
                  </div>
                  <textarea className="login-input" rows={4} value={teamInfo.members} onChange={e=>setTeamInfo({...teamInfo, members: e.target.value})} placeholder="สมาชิกในทีม..." style={{ marginTop: '1rem' }} />
                  <button onClick={() => handleSave('team-setup', teamInfo)} className="login-btn" style={{ marginTop: '1rem' }}><Save size={18} /> บันทึกข้อมูลทีม</button>
               </div>
             </motion.div>
          )}

          {activeTab === 'mission-inbox' && (
            <motion.div key="mi" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-purple-light">Mission Inbox & Notification — รับโจทย์ภารกิจ</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '0.75rem', background: missionStatus.status === 'Rejected' ? '#fef2f2' : '#eff6ff', border: `1px solid ${missionStatus.status === 'Rejected' ? '#fecaca' : '#bfdbfe'}`, borderRadius: '8px', fontSize: '0.8125rem' }}>
                   <strong>Status: </strong> <span style={{ color: missionStatus.status === 'Rejected' ? '#dc2626' : 'var(--color-primary)', fontWeight: 600 }}>{missionStatus.status}</span>
                   {missionStatus.status === 'Rejected' ? (
                      <p style={{ marginTop: '0.5rem', color: '#991b1b', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>
                         <strong>Teacher's Feedback:</strong> {missionStatus.feedback}
                      </p>
                   ) : (
                      <p style={{ marginTop: '0.25rem', color: '#475569' }}>หากครู "Reject" ไอเดีย จะมีข้อความแจ้งเตือนและข้อเสนอแนะแสดงที่นี่</p>
                   )}
                </div>
                <div className="grid-2">
                  <div>
                    <label className="ldt-stat-lbl">เลือก Module (1-4)</label>
                    <select className="login-input" value={missionData.module} onChange={e=>setMissionData({...missionData, module: e.target.value})}>
                      <option value="">-- โปรดเลือก Module --</option>
                      <option value="1">อัตลักษณ์ที่ 1: วิถีเกษตรและอาหาร</option>
                      <option value="2">อัตลักษณ์ที่ 2: อุตสาหกรรมสร้างสรรค์</option>
                      <option value="3">อัตลักษณ์ที่ 3: ทรัพยากรธรรมชาติ</option>
                      <option value="4">อัตลักษณ์ที่ 4: พลังงานและนวัตกรรม</option>
                    </select>
                  </div>
                  <div>
                    <label className="ldt-stat-lbl">ผลิตภัณฑ์ที่สนใจ</label>
                    <input className="login-input" value={missionData.product} onChange={e=>setMissionData({...missionData, product: e.target.value})} placeholder="ระบุผลิตภัณฑ์..." />
                  </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">เหตุผลในการเลือก (Reasoning)</label>
                  <textarea className="login-input" rows={4} value={missionData.reason} onChange={e=>setMissionData({...missionData, reason: e.target.value})} placeholder="ทำไมถึงเลือกผลิตภัณฑ์นี้..." />
                </div>
                <button onClick={() => handleSave('mission-inbox', missionData)} className="login-btn"><CheckCircle2 size={18} /> รับภารกิจ</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'collector' && (
            <motion.div key="oc" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-amber-light">On-site Collector — เก็บข้อมูลภาคสนาม (Offline Mode)</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#059669', background: '#ecfdf5', padding: '0.5rem', borderRadius: '4px' }}>
                   <Activity size={14} /> <span>Offline Mode Ready: ข้อมูลจะถูกบันทึกใน Local Cache และ Auto-sync เมื่อมีอินเทอร์เน็ต</span>
                </div>
                <div>
                  <label className="ldt-stat-lbl">บันทึกข้อมูลสัมภาษณ์ปราชญ์ชาวบ้าน</label>
                  <textarea className="login-input" rows={6} value={collectorData.interview} onChange={e=>setCollectorData({...collectorData, interview: e.target.value})} placeholder="สรุปใจความสำคัญที่ได้จากการลงพื้นที่..." />
                </div>
                <div>
                  <label className="ldt-stat-lbl">รูปถ่ายคู่กับปราชญ์ (Photo URL)</label>
                  <input className="login-input" value={collectorData.sagePhoto} onChange={e=>setCollectorData({...collectorData, sagePhoto: e.target.value})} placeholder="https://..." />
                </div>
                <button onClick={() => handleSave('collector', collectorData)} className="login-btn" style={{ background: 'var(--color-amber)' }}><Activity size={18} /> Save & Sync Data</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'gateway' && (
            <motion.div key="sg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-primary-light">Submission Gateway — ประตูส่งงานสมบูรณ์</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="grid-2">
                   <div>
                      <label className="ldt-stat-lbl">การสกัดภูมิปัญญาและทำความเข้าใจบริบทพื้นที่</label>
                      <textarea className="login-input" value={gatewayData.wisdom} onChange={e=>setGatewayData({...gatewayData, wisdom: e.target.value})} />
                   </div>
                   <div>
                      <label className="ldt-stat-lbl">การสกัดปัญหาหรือความเสี่ยงต่อสภาพสังคมและสิ่งแวดล้อมที่พบ</label>
                      <textarea className="login-input" value={gatewayData.environment} onChange={e=>setGatewayData({...gatewayData, environment: e.target.value})} />
                   </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">การค้นหาแนวทางการพัฒนาและแก้ปัญหาสู่การสร้างนวัตกรรม</label>
                  <textarea className="login-input" value={gatewayData.brainstorm} onChange={e=>setGatewayData({...gatewayData, brainstorm: e.target.value})} />
                </div>
                <div className="grid-2">
                   <div>
                      <label className="ldt-stat-lbl">การสร้างนวัตกรรมต้นแบบ</label>
                      <input className="login-input" value={gatewayData.prototype} onChange={e=>setGatewayData({...gatewayData, prototype: e.target.value})} />
                   </div>
                   <div>
                      <label className="ldt-stat-lbl">วิดีโอ Green Rayong 4-Identities AI Storytellers: มหัศจรรย์ระยอง 4 มิติ สู่พื้นที่นวัตกรรมท่องเที่ยวโลก</label>
                      <input className="login-input" value={gatewayData.videoUrl} onChange={e=>setGatewayData({...gatewayData, videoUrl: e.target.value})} />
                   </div>
                </div>
                <div>
                  <label className="ldt-stat-lbl">Business Model Canvas</label>
                  <textarea className="login-input" rows={4} value={gatewayData.bmc} onChange={e=>setGatewayData({...gatewayData, bmc: e.target.value})} />
                </div>
                <div>
                  <label className="ldt-stat-lbl">AI Prompt Logs</label>
                  <textarea className="login-input" rows={4} value={gatewayData.aiLogs} onChange={e=>setGatewayData({...gatewayData, aiLogs: e.target.value})} placeholder="วาง Prompt ทั้งหมดที่ใช้..." />
                </div>
                <button onClick={() => handleSave('gateway', gatewayData)} className="login-btn"><Send size={18} /> ยืนยันการส่งงานทั้งหมด</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluation-hub' && (
            <motion.div key="eh" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="lane">
              <div className="lane-header bg-amber-light">Evaluation Hub — ประเมินตนเองและเพื่อน</div>
              <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="grid-2">
                   <div className="card">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Self Assessment</h5>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>ประเมินตนเองตาม Rubric 5 ด้าน (10%)</p>
                      <button onClick={() => setShowEvalForm(showEvalForm === 'self' ? null : 'self')} className="login-btn" style={{ marginTop: '1rem', width: '100%' }}>{showEvalForm === 'self' ? 'ปิดแบบประเมิน' : 'ทำแบบประเมินตนเอง'}</button>
                   </div>
                   <div className="card">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Peer Assessment</h5>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>ประเมินเพื่อนร่วมทีม (Anonymous) (15%)</p>
                      <button onClick={() => setShowEvalForm(showEvalForm === 'peer' ? null : 'peer')} className="login-btn" style={{ marginTop: '1rem', width: '100%', background: 'var(--color-purple)' }}>{showEvalForm === 'peer' ? 'ปิดแบบประเมิน' : 'ทำแบบประเมินเพื่อน'}</button>
                   </div>
                </div>

                {/* Mock Form Display */}
                {showEvalForm === 'self' && (
                   <div className="card" style={{ background: '#f8fafc' }}>
                      <h5 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>แบบฟอร์มประเมินตนเอง (Mock)</h5>
                      {[1,2,3].map(i => (
                         <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>มิติที่ {i}: การมีส่วนร่วมและความรับผิดชอบ</div>
                            <select className="login-input" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                               <option>เลือกระดับคะแนน (1-5)...</option>
                               <option>5 - ดีเยี่ยม</option>
                               <option>4 - ดีมาก</option>
                            </select>
                         </div>
                      ))}
                      <button className="login-btn" style={{ width: 'fit-content' }}>Submit Self-Assessment</button>
                   </div>
                )}

                {showEvalForm === 'peer' && (
                   <div className="card" style={{ background: '#f5f3ff' }}>
                      <h5 style={{ marginBottom: '1rem', color: 'var(--color-purple)' }}>แบบฟอร์มประเมินเพื่อนร่วมทีม (Mock)</h5>
                      {mockTeammates.map(tm => (
                         <div key={tm.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd6fe' }}>
                            <div style={{ fontWeight: 600, color: '#4c1d95' }}>ประเมิน: {tm.name}</div>
                            <select className="login-input" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                               <option>เลือกระดับคะแนน (1-5)...</option>
                               <option>5 - ให้ความร่วมมือดีเยี่ยม</option>
                               <option>4 - ให้ความร่วมมือดี</option>
                            </select>
                         </div>
                      ))}
                      <button className="login-btn" style={{ width: 'fit-content', background: 'var(--color-purple)' }}>Submit Peer-Assessment</button>
                   </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Legacy dynamic-rubric evaluator disabled below */}
          {window.SHOW_LEGACY_EVALUATOR && activeTab === 'pitch-evaluator' && (
            // NOTE: Disabled — duplicate of the Pitching Evaluator below. Kept here only for
            // reference (this version uses dynamic rubrics from the DB). Re-enable by
            // changing `false &&` and removing/disabling the other 'pitch-evaluator' block.
            <motion.div key="pe-rubric" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-primary-light">Evaluation Board (ระบบประเมินผล: {user?.role?.toUpperCase() || ''})</div>
               <div className="lane-content grid-2" style={{ gridTemplateColumns: '250px 1fr', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <h4 style={{ marginBottom: '1rem' }}>เลือกทีมที่ต้องการประเมิน</h4>
                     {(user?.role === 'teacher' ? teams.filter(t => t.teacher_id === user.id) : teams).map(t => (
                        <div key={t.id} onClick={()=>setSelectedTeam(t)} className={`card ${selectedTeam?.id === t.id ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <Users size={16} color="var(--color-primary)" /> {t.name}
                        </div>
                     ))}
                  </div>
                  <div className="card" style={{ background: '#f8fafc', padding: '2rem' }}>
                     {selectedTeam ? (
                        <>
                           <h3 style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>แบบประเมินทีม: {selectedTeam.name}</h3>
                           
                           {/* Media Preview Links */}
                           <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-blue)' }}><LayoutGrid size={24} color="var(--color-blue)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดูรูป Prototype</span></div>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-amber)' }}><Monitor size={24} color="var(--color-amber)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดูวิดีโอ & Storytelling</span></div>
                              <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '1rem', cursor: 'pointer', border: '1px solid var(--color-purple)' }}><FileSpreadsheet size={24} color="var(--color-purple)" /><br/><span style={{ fontSize: '0.8125rem' }}>ดู Business Model</span></div>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                              {Object.entries(
                                 rubrics.reduce((acc, r) => {
                                    const cat = r.category || 'เกณฑ์การประเมิน Pitching';
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(r);
                                    return acc;
                                 }, {})
                              ).map(([category, items]) => (
                                 <div key={category} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{category}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                       {items.map(r => (
                                          <div key={r.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                             <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>{r.name}</div>
                                             <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {[1, 2, 3, 4].map(level => {
                                                   const isSelected = evalScore[`${selectedTeam.id}-${r.id}`] === level;
                                                   return (
                                                      <button 
                                                         key={level} 
                                                         onClick={() => setEvalScore(prev => ({...prev, [`${selectedTeam.id}-${r.id}`]: level}))}
                                                         className="card" 
                                                         style={{ 
                                                            margin: 0, 
                                                            padding: '0.5rem 1rem', 
                                                            fontSize: '0.75rem',
                                                            background: isSelected ? 'var(--color-primary)' : '#fff',
                                                            color: isSelected ? '#fff' : 'inherit',
                                                            border: isSelected ? 'none' : '1px solid var(--color-border)'
                                                         }}
                                                      >
                                                         ระดับ {level}
                                                      </button>
                                                   );
                                                })}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <button className="login-btn" style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>
                              <Save size={18} /> บันทึกผลการประเมิน
                           </button>
                        </>
                     ) : <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}><Target size={48} style={{ marginBottom: '1rem' }} /><p>โปรดเลือกทีมจากเมนูด้านซ้ายเพื่อเริ่มการประเมิน</p></div>}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'teacher-dashboard' && (
            <motion.div key="tdb" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'live-feed', label: 'Live Feed', icon: Activity },
                    { id: 'teams', label: 'Team Management', icon: Users },
                    { id: 'prompts', label: 'Good Prompt Library', icon: Zap },
                    { id: 'rubrics', label: 'การจัดการ Rubric Score', icon: Target },
                    { id: 'eval-matrix', label: 'การประเมินผล Matrix', icon: LayoutGrid }
                  ].map(st => (
                    <button key={st.id} onClick={() => setAssessorSubTab(st.id)} className={`card ${assessorSubTab === st.id ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <st.icon size={14} /> {st.label}
                    </button>
                  ))}
               </div>

               <div className="lane">
                  <div className="lane-header bg-primary-light">Assessor: {assessorSubTab.toUpperCase()}</div>
                  <div className="lane-content">
                     {assessorSubTab === 'live-feed' && (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                           <div>
                              <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <Activity size={18} className="live-dot" /> Live Activity Feed
                              </h4>
                              <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                 {feed.map((f, i) => (
                                    <div key={i} style={{ fontSize: '0.8125rem', borderBottom: '1px solid #f1f5f9', padding: '0.8rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                       <div>
                                          <strong>{f.team_name || 'Team'}:</strong> {f.action}
                                          {f.detail && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{f.detail}</div>}
                                       </div>
                                       <span style={{ fontSize: '0.625rem', opacity: 0.5 }}>{new Date(f.created_at).toLocaleTimeString()}</span>
                                    </div>
                                 ))}
                                 {feed.length === 0 && <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', padding: '2rem' }}>กำลังติดตามความเคลื่อนไหวล่าสุด...</p>}
                              </div>
                           </div>
                           <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                              <h4 style={{ marginBottom: '1.5rem' }}>Performance Overview</h4>
                              <RadarChart data={[3.5, 4.2, 3.8, 2.9, 4.5]} labels={['ความรู้', 'ทักษะ', 'ทัศนคติ/เจตคติ', 'พฤติกรรม', 'การประยุกต์ใช้']} />
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'teams' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>Managed Teams ({teams.filter(t => t.teacher_id === user.id || user.role === 'admin').length})</h4>
                              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>รายการทีมที่คุณได้รับมอบหมายให้ดูแล</p>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {teams.filter(t => t.teacher_id === user.id || user.role === 'admin').map(t => (
                                 <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                    <div>
                                       <div style={{ fontWeight: 600 }}>{t.name}</div>
                                       <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>Progress: Step 3 | Last update: 10m ago</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                       <button onClick={() => { setSelectedTeam(t); setActiveTab('pitch-evaluator'); }} className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: 'none' }}>ตรวจงาน</button>
                                       <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: 'none' }}>แชททีม</button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'prompts' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>Good Prompt Library</h4>
                              <button onClick={() => {
                                 const title = prompt('หัวข้อ Prompt:');
                                 const content = prompt('รายละเอียด Prompt:');
                                 if(title && content) saveGoodPrompt({ title, content, category: 'General' });
                              }} className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content' }}><Plus size={16} /> เพิ่ม Prompt ตัวอย่าง</button>
                           </div>
                           <div className="grid-2">
                              {goodPrompts.map(p => (
                                 <div key={p.id} className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                       <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{p.title}</div>
                                       <button onClick={() => deleteGoodPrompt(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><LogOut size={12} /></button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontStyle: 'italic' }}>
                                       "{p.content}"
                                    </div>
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.625rem', color: '#94a3b8' }}>Category: {p.category || 'General'}</div>
                                 </div>
                              ))}
                              {goodPrompts.length === 0 && <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>ยังไม่มี Prompt ตัวอย่างในขณะนี้</p>}
                           </div>
                        </div>
                     )}

                     {assessorSubTab === 'rubrics' && (
                        <div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                              <h4>การจัดการ Rubric Score</h4>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                 <label className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content', background: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileSpreadsheet size={16} /> อัปโหลด CSV
                                    <input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => {
                                       const file = e.target.files[0];
                                       if (!file) return;
                                       const reader = new FileReader();
                                       reader.onload = (event) => {
                                          const text = event.target.result;
                                          const lines = text.split('\n').filter(l => l.trim() !== '');
                                          const newRubrics = lines.map((line, i) => {
                                             const cols = line.split(',');
                                             return { id: `csv-${Date.now()}-${i}`, name: cols[0] || 'Untitled', levels: cols.slice(1) };
                                          });
                                          setRubrics(prev => [...newRubrics, ...prev]);
                                          alert(`อัปโหลดเกณฑ์ใหม่สำเร็จ ${newRubrics.length} รายการจากไฟล์ ${file.name}`);
                                       };
                                       reader.readAsText(file);
                                       e.target.value = '';
                                    }} />
                                 </label>
                                 <button className="login-btn" style={{ padding: '0.5rem 1rem', width: 'fit-content', background: 'var(--color-purple)' }}><Plus size={16} /> สร้างเกณฑ์ใหม่</button>
                              </div>
                           </div>

                           {Object.entries(
                              rubrics.reduce((acc, r) => {
                                 const cat = r.category || 'เกณฑ์การประเมิน Pitching';
                                 if (!acc[cat]) acc[cat] = [];
                                 acc[cat].push(r);
                                 return acc;
                              }, {})
                           ).map(([category, items]) => (
                              <div key={category} style={{ marginBottom: '2.5rem' }}>
                                 <h5 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-border)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Target size={18} /> {category} <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>{items.length} ข้อ</span>
                                 </h5>
                                 {items.map(r => (
                                    <div key={r.id} className="card" style={{ borderLeft: '4px solid var(--color-purple)', marginBottom: '1rem' }}>
                                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-purple)' }}>{r.name || `Rubric ${r.id}`}</div>
                                          <button className="card" style={{ margin: 0, padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444', border: 'none' }} onClick={() => setRubrics(prev => prev.filter(x => x.id !== r.id))} title="ลบเกณฑ์นี้"><LogOut size={14}/></button>
                                       </div>
                                       {(r.levels && r.levels.length > 0) ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: '0.5rem' }}>
                                             {r.levels.map((levelText, idx) => (
                                                <div key={idx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                                                   <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.4rem' }}>
                                                      {RUBRIC_LEVEL_LABELS[idx]
                                                        ? `${RUBRIC_LEVEL_LABELS[idx]} (${idx + 1})`
                                                        : `ระดับที่ ${idx + 1}`}
                                                   </strong>
                                                   {levelText.trim() || '-'}
                                                </div>
                                             ))}
                                          </div>
                                       ) : (
                                          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{r.description || JSON.stringify(r)}</div>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ))}
                        </div>
                     )}

                     {assessorSubTab === 'eval-matrix' && (() => {
                        // Build a lookup: scoresByTeam[teamId][dimension] = { avg_score, n_evaluators, roles }
                        const scoresByTeam = {};
                        teamScores.forEach(s => {
                           if (!scoresByTeam[s.team_id]) scoresByTeam[s.team_id] = {};
                           scoresByTeam[s.team_id][s.dimension] = s;
                        });
                        const ROLE_META = {
                           self:    { icon: User,    label: 'ประเมินตนเอง' },
                           peer:    { icon: Users,   label: 'เพื่อนประเมิน' },
                           teacher: { icon: Monitor, label: 'ครูประเมิน' },
                           sage:    { icon: Award,   label: 'ปราชญ์ประเมิน' },
                           ai:      { icon: Cpu,     label: 'AI ประเมิน' }
                        };
                        return (
                        <div style={{ marginTop: '1rem' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                              <span><strong style={{ color: 'var(--color-text-primary)' }}>วิธีอ่าน:</strong> เซลล์สีคือคะแนนเฉลี่ยจริง — เครื่องหมาย <span style={{ color: '#94a3b8', fontWeight: 700 }}>—</span> หมายถึงยังไม่มีใครให้คะแนน</span>
                              <span>{teamScores.length === 0 ? 'ยังไม่มีคะแนนในระบบ' : `มีคะแนนในระบบทั้งหมด ${teamScores.length} ด้าน × ทีม`}</span>
                           </div>
                           <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                 <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                                       <th style={{ textAlign: 'left', padding: '1rem', width: '180px' }}>รายชื่อทีม</th>
                                       {SCORE_DIMENSIONS.map(h => (
                                          <th key={h} style={{ padding: '1rem', textAlign: 'center' }}>{h}</th>
                                       ))}
                                       <th style={{ padding: '1rem', background: '#eff6ff', textAlign: 'center' }}>คะแนนรวม</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {teams.length > 0 ? teams.map(t => {
                                       const tScores = scoresByTeam[t.id] || {};
                                       let totalScore = 0;
                                       let scoredDims = 0;
                                       return (
                                          <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                             <td style={{ padding: '1rem', fontWeight: 600, background: '#f8fafc', borderRight: '2px solid #e2e8f0' }}>{t.name}</td>
                                             {SCORE_DIMENSIONS.map(dim => {
                                                const cellData = tScores[dim];
                                                if (!cellData) {
                                                   return (
                                                      <td key={dim} title="ยังไม่มีใครให้คะแนนด้านนี้" style={{ padding: '0.75rem', background: '#fafafa', color: '#cbd5e1', textAlign: 'center', border: '1px dashed #e2e8f0', fontSize: '1.25rem', fontWeight: 600 }}>
                                                         —
                                                      </td>
                                                   );
                                                }
                                                const score = cellData.avg_score;
                                                totalScore += score;
                                                scoredDims++;
                                                const hue = ((score - 1) / 4) * 130;
                                                const bgColor = `hsl(${hue}, 80%, 92%)`;
                                                const textColor = `hsl(${hue}, 90%, 25%)`;
                                                const rolesScored = new Set((cellData.roles || '').split(','));
                                                return (
                                                   <td key={dim} style={{ padding: '0.75rem', background: bgColor, color: textColor, border: '1px solid white' }}>
                                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', maxWidth: '120px', margin: '0 auto' }}>
                                                         {EVALUATOR_ROLES.map(role => {
                                                            const meta = ROLE_META[role];
                                                            const has = rolesScored.has(role);
                                                            return (
                                                               <div
                                                                  key={role}
                                                                  title={has ? `${meta.label}: ให้คะแนนแล้ว` : `${meta.label}: ยังไม่ได้ให้คะแนน`}
                                                                  style={{ width: '20px', height: '20px', borderRadius: '4px', background: has ? '#ffffff' : 'transparent', border: has ? 'none' : '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: has ? 1 : 0.4 }}
                                                               >
                                                                  <meta.icon size={12} color={has ? textColor : '#94a3b8'} />
                                                               </div>
                                                            );
                                                         })}
                                                      </div>
                                                      <div style={{ textAlign: 'center', marginTop: '6px', fontWeight: 700, fontSize: '0.875rem' }}>
                                                         {score.toFixed(1)}
                                                      </div>
                                                      <div style={{ textAlign: 'center', fontSize: '0.625rem', opacity: 0.7 }}>
                                                         จาก {cellData.n_evaluators} คน
                                                      </div>
                                                   </td>
                                                );
                                             })}
                                             {scoredDims === 0 ? (
                                                <td style={{ textAlign: 'center', padding: '1rem', background: '#fafafa', color: '#cbd5e1', fontSize: '1rem', fontWeight: 600, borderLeft: '2px solid white' }}>
                                                   —
                                                </td>
                                             ) : (() => {
                                                const avg = totalScore / scoredDims;
                                                const hue = ((avg - 1) / 4) * 130;
                                                return (
                                                   <td style={{ textAlign: 'center', fontWeight: 700, padding: '1rem', background: `hsl(${hue}, 80%, 85%)`, color: `hsl(${hue}, 90%, 25%)`, fontSize: '1rem', borderLeft: '2px solid white' }}>
                                                      {(avg * 20).toFixed(1)} %
                                                      <div style={{ fontSize: '0.625rem', fontWeight: 400, opacity: 0.7 }}>
                                                         ({scoredDims}/{SCORE_DIMENSIONS.length} ด้าน)
                                                      </div>
                                                   </td>
                                                );
                                             })()}
                                          </tr>
                                       );
                                    }) : (
                                       <tr><td colSpan={SCORE_DIMENSIONS.length + 2} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>ยังไม่มีข้อมูลทีม</td></tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                           
                           <div className="grid-2" style={{ marginTop: '1.5rem' }}>
                              <div className="card">
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LayoutGrid size={16} /> สัญลักษณ์มิติการประเมิน</h5>
                                 <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    {[
                                       { icon: User, label: 'ประเมินตนเอง' },
                                       { icon: Users, label: 'เพื่อนประเมิน' },
                                       { icon: Monitor, label: 'ครูประเมิน' },
                                       { icon: Award, label: 'ปราชญ์ประเมิน' },
                                       { icon: Cpu, label: 'AI ประเมิน' }
                                    ].map(d => (
                                       <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                                          <div style={{ width: '20px', height: '20px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><d.icon size={12} /></div>
                                          {d.label}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div>
                                    <h5>Export & Reports</h5>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>ดาวน์โหลดรายงานสรุปผลรายบุคคลและรายทีม</p>
                                 </div>
                                 <button className="login-btn" style={{ width: 'fit-content', padding: '0.6rem 1.2rem' }}><FileSpreadsheet size={16} /> Download CSV</button>
                              </div>
                           </div>
                        </div>
                        );
                     })()}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                  {['Management', 'Session', 'Moderation', 'Settings', 'Reports'].map(st => (
                    <button key={st} onClick={() => setAdminSubTab(st.toLowerCase())} className={`card ${adminSubTab === st.toLowerCase() ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{st}</button>
                  ))}
               </div>
               
               <div className="lane">
                  <div className="lane-header bg-blue-light">Admin: {adminSubTab.toUpperCase()}</div>
                  <div className="lane-content">
                     {adminSubTab === 'management' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                           <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> User Accounts</h5>
                              </div>
                              
                              <div className="card" style={{ marginBottom: '1rem', background: '#f8fafc' }}>
                                 <h6>{editingUser ? 'Edit User' : 'Add New User'}</h6>
                                 <div className="grid-2" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="ชื่อ-นามสกุล" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} />
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="Username" value={newUser.username} onChange={e=>setNewUser({...newUser, username: e.target.value})} />
                                    {!editingUser && <input className="login-input" type="password" style={{ fontSize: '0.75rem' }} placeholder="Password" value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} />}
                                    <select className="login-input" style={{ fontSize: '0.75rem' }} value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})}>
                                       <option value="student">Student</option>
                                       <option value="teacher">Teacher</option>
                                       <option value="sage">Sage</option>
                                       <option value="admin">Admin</option>
                                    </select>
                                 </div>
                                 <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                       className="login-btn" 
                                       style={{ padding: '0.4rem 1rem', width: 'fit-content', fontSize: '0.75rem' }}
                                       onClick={async () => {
                                          try {
                                             if (editingUser) {
                                                await adminUpdateUser(editingUser.id, newUser);
                                                setEditingUser(null);
                                             } else {
                                                await adminCreateUser(newUser);
                                             }
                                             setNewUser({ name: '', username: '', password: '', role: 'student', teamId: '' });
                                             const u = await getUsers(); setUsers(u);
                                          } catch (err) { alert(err.message); }
                                       }}
                                    >
                                       {editingUser ? 'Update User' : 'Create User'}
                                    </button>
                                    {editingUser && <button className="card" style={{ margin: 0, padding: '0.4rem', fontSize: '0.75rem' }} onClick={() => { setEditingUser(null); setNewUser({ name: '', username: '', password: '', role: 'student', teamId: '' }); }}>Cancel</button>}
                                 </div>
                              </div>

                              <div className="grid-2">
                                 {users.map(u => (
                                    <div key={u.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', alignItems: 'center' }}>
                                       <div>
                                          <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{u.name}</div>
                                          <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>{u.role} | @{u.username}</div>
                                       </div>
                                       <div style={{ display: 'flex', gap: '4px' }}>
                                          <button onClick={() => { setEditingUser(u); setNewUser({ name: u.name, username: u.username, role: u.role, teamId: u.team_id || '' }); }} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Settings size={14} /></button>
                                          <button onClick={async () => { if(confirm('Delete user?')) { await adminDeleteUser(u.id); const updated = await getUsers(); setUsers(updated); } }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><LogOut size={14} /></button>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Team Management</h5>
                              </div>

                              <div className="card" style={{ marginBottom: '1rem', background: '#f0fdf4' }}>
                                 <h6>Add New Team</h6>
                                 <div className="grid-2" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="ชื่อทีม" value={newTeam.name} onChange={e=>setNewTeam({...newTeam, name: e.target.value})} />
                                    <select className="login-input" style={{ fontSize: '0.75rem' }} value={newTeam.teacherId} onChange={e=>setNewTeam({...newTeam, teacherId: e.target.value})}>
                                       <option value="">เลือกครูผู้ดูแล...</option>
                                       {users.filter(u => u.role === 'teacher').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                 </div>
                                 <button 
                                    className="login-btn" 
                                    style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', width: 'fit-content', fontSize: '0.75rem' }}
                                    onClick={async () => {
                                       try {
                                          await adminCreateTeam(newTeam);
                                          setNewTeam({ name: '', teacherId: '' });
                                       } catch (err) { alert(err.message); }
                                    }}
                                 >
                                    Create Team
                                 </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                 {teams.map(t => {
                                    const assignedTeacher = users.find(u => u.id == t.teacher_id);
                                    return (
                                       <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
                                          <div>
                                             <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                                             <div style={{ fontSize: '0.75rem', color: assignedTeacher ? 'var(--color-primary)' : '#94a3b8' }}>
                                                Teacher: {assignedTeacher ? assignedTeacher.name : 'Unassigned'}
                                             </div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                             <select 
                                                className="login-input" 
                                                style={{ padding: '4px 8px', fontSize: '0.75rem', width: '150px' }}
                                                value={t.teacher_id || ''}
                                                onChange={async (e) => {
                                                   try {
                                                      await adminUpdateTeam(t.id, { ...t, teacher_id: e.target.value });
                                                   } catch (err) { alert(err.message); }
                                                }}
                                             >
                                                <option value="">Assign Teacher...</option>
                                                {users.filter(u => u.role === 'teacher' || u.role === 'facilitator').map(u => (
                                                   <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                             </select>
                                             <button onClick={async () => { if(confirm('Delete team?')) await adminDeleteTeam(t.id); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><LogOut size={14} /></button>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'session' && (
                        <div className="grid-2">
                           <div className="card"><h5>Activity Phase Control</h5><hr/><div style={{ marginTop: '1rem' }}>Phase 1: Open <br/>Phase 2: Closed</div></div>
                           <div className="card"><h5>Deadlines</h5><hr/><div style={{ marginTop: '1rem' }}>Final Submission: 30 April</div></div>
                        </div>
                     )}
                     {adminSubTab === 'moderation' && (
                        <div className="grid-2">
                           <div className="card"><h5>Image Verification</h5><p style={{ fontSize: '0.75rem' }}>รอการตรวจสอบ: 5 รูป</p></div>
                           <div className="card"><h5>AI Prompt Audit</h5><p style={{ fontSize: '0.75rem' }}>รอกดอนุมัติ: 12 รายการ</p></div>
                        </div>
                     )}
                     {adminSubTab === 'settings' && (
                        <div className="card">
                           <h5>System Config & Setup</h5>
                           <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 1.5rem', color: '#64748b' }}>
                              API Key: G-Sheets / Looker <br/>
                              Backup Status: Last 1hr ago
                           </p>
                           <hr style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                 <h6 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}><Cpu size={14} color="var(--color-purple)" /> AI Assessment Settings</h6>
                                 <div className="grid-2" style={{ gap: '0.5rem' }}>
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="Claude API Key..." />
                                    <input className="login-input" style={{ fontSize: '0.75rem' }} placeholder="System Prompt (ประเมิน 5 ด้าน)..." />
                                 </div>
                                 <p style={{ fontSize: '0.625rem', color: '#64748b', marginTop: '0.5rem' }}>Token Usage: 15,420 tokens (this month)</p>
                                 <button className="login-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem', width: 'fit-content', background: 'var(--color-purple)' }}>Save AI Config</button>
                              </div>
                              <hr style={{ opacity: 0.1 }} />
                              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>ฐานข้อมูลเริ่มต้น (Initial Setup)</p>
                              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>หากคุณเริ่มโปรเจกต์ใหม่และฐานข้อมูลยังว่างอยู่ สามารถกดปุ่มด้านล่างเพื่อสร้างข้อมูลตัวอย่าง (Teams, Rubrics, Admin Accounts)</p>
                              <button 
                                 onClick={async () => {
                                    if(confirm('คุณต้องการสร้างข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
                                       try {
                                          await seedFirebase();
                                          alert('สร้างข้อมูลเริ่มต้นสำเร็จ! ข้อมูลจะปรากฏขึ้นบน Dashboard ทันที');
                                       } catch (err) { alert('Seeding failed: ' + err.message); }
                                    }
                                 }} 
                                 className="login-btn" 
                                 style={{ background: 'var(--color-purple)', width: 'fit-content', padding: '0.6rem 1.2rem' }}
                              >
                                 <Database size={16} /> Seed Firebase Data
                              </button>
                           </div>
                        </div>
                     )}
                     {adminSubTab === 'reports' && (
                        <div className="card">
                           <h5>R1: Score Summary Report (Mock Data)</h5>
                           <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>ตารางสรุปคะแนนประเมินรวม 5 มิติ ของทุกทีม (Export PDF/CSV ได้)</p>
                           <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                                 <thead>
                                    <tr style={{ background: '#f1f5f9', color: '#334155' }}>
                                       <th style={{ padding: '0.5rem' }}>Team Name</th>
                                       <th style={{ padding: '0.5rem' }}>Self (10%)</th>
                                       <th style={{ padding: '0.5rem' }}>Peer (15%)</th>
                                       <th style={{ padding: '0.5rem' }}>Teacher (35%)</th>
                                       <th style={{ padding: '0.5rem' }}>Sage (30%)</th>
                                       <th style={{ padding: '0.5rem' }}>AI (10%)</th>
                                       <th style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>Total (100)</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {mockReportData.map((row, idx) => (
                                       <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{row.team}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.self}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.peer}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.teacher}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.sage}</td>
                                          <td style={{ padding: '0.5rem' }}>{row.ai}</td>
                                          <td style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{row.total}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                              <button className="login-btn" style={{ background: 'var(--color-blue)', width: 'fit-content', fontSize: '0.75rem' }}>Export PDF</button>
                              <button className="login-btn" style={{ background: 'var(--color-amber)', width: 'fit-content', fontSize: '0.75rem' }}>Export CSV</button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'mission-builder' && (
            <motion.div key="mb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-purple-light">Mission Builder — กำหนดโจทย์กิจกรรม</div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="grid-2">
                     <div>
                        <label className="ldt-stat-lbl">ชื่อโจทย์ภารกิจ</label>
                        <input className="login-input" value={missionConfig.name} onChange={e=>setMissionConfig({...missionConfig, name: e.target.value})} placeholder="เช่น Green Rayong Challenge..." />
                     </div>
                     <div>
                        <label className="ldt-stat-lbl">กำหนด Deadline</label>
                        <input className="login-input" type="date" value={missionConfig.deadline} onChange={e=>setMissionConfig({...missionConfig, deadline: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="ldt-stat-lbl">เกณฑ์การประเมิน (Rubric 5 ด้าน)</label>
                     <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                        {['AI Prompting', 'Local Wisdom', 'Creativity', 'Business Plan', 'Storytelling'].map(r => (
                           <div key={r} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{r}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>{[1,2,3,4,5].map(v => <div key={v} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.2 }}></div>)}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <button onClick={() => handleSave('mission-config', missionConfig)} className="login-btn"><Save size={18} /> บันทึกและเปิดกิจกรรม</button>
               </div>
            </motion.div>
          )}

          {activeTab === 'pitch-evaluator' && (
            <motion.div key="pe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-amber-light">Pitching Evaluator — ระบบให้คะแนน & AI Audit</div>
               <div className="lane-content grid-2" style={{ gridTemplateColumns: '250px 1fr' }}>
                  <div>
                     <h4 style={{ marginBottom: '1rem' }}>รายชื่อทีม ({teams.length})</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                        {teams.map(t => (
                           <div key={t.id} onClick={()=>setSelectedTeam(t)} className={`card ${selectedTeam?.id === t.id ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                             <div style={{ fontWeight: 600 }}>{t.name}</div>
                             <div style={{ fontSize: '0.625rem', opacity: 0.7 }}>ID: {t.id}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     {selectedTeam ? (
                        <>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3>ประเมินทีม: {selectedTeam.name}</h3>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', background: '#ecfdf5', color: '#065f46', border: 'none' }}>Approve</button>
                                <button className="card" style={{ margin: 0, padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#991b1b', border: 'none' }}>Reject</button>
                              </div>
                           </div>

                           {/* --- AI Audit & Project Details --- */}
                           <div className="grid-2" style={{ alignItems: 'start' }}>
                              <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}><Cpu size={16} color="var(--color-purple)" /> AI Audit Logs</h5>
                                 <div style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    {selectedTeamData?.gateway?.aiLogs || 'ยังไม่มีข้อมูล AI Prompt Logs'}
                                 </div>
                              </div>
                              <div className="card" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }}>
                                 <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}><Database size={16} color="var(--color-amber)" /> Project Data</h5>
                                 <div style={{ fontSize: '0.8125rem' }}>
                                    <p><strong>Module:</strong> {selectedTeamData?.['mission-inbox']?.module || '-'}</p>
                                    <p><strong>Product:</strong> {selectedTeamData?.['mission-inbox']?.product || '-'}</p>
                                    <p><strong>Wisdom:</strong> {selectedTeamData?.gateway?.wisdom || '-'}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="grid-2">
                              <div className="card">
                                 <h5 style={{ marginBottom: '0.5rem' }}>Prototype & BMC</h5>
                                 <p style={{ fontSize: '0.75rem' }}>{selectedTeamData?.gateway?.prototype || 'No prototype description'}</p>
                                 <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline' }}>{selectedTeamData?.gateway?.videoUrl || 'No Video Link'}</div>
                              </div>
                              <div className="card">
                                 <h5 style={{ marginBottom: '0.5rem' }}>Local Insights</h5>
                                 <p style={{ fontSize: '0.75rem' }}>{selectedTeamData?.collector?.interview || 'No interview logs'}</p>
                              </div>
                           </div>

                           {/* --- Scoring Section --- */}
                           <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                              <h4 style={{ marginBottom: '1rem' }}>Scoring Matrix</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                 {SCORE_DIMENSIONS.map(r => {
                                    const key = `${selectedTeam.id}-${r}`;
                                    const current = evalScore[key] || 0;
                                    return (
                                       <div key={r}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                             <label className="ldt-stat-lbl">{r}</label>
                                             <span style={{ fontSize: '0.75rem', fontWeight: 600, color: current ? 'var(--color-primary)' : '#94a3b8' }}>
                                                {current ? `${current} / 5` : 'ยังไม่ได้ให้คะแนน'}
                                             </span>
                                          </div>
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                             {[1,2,3,4,5].map(v => (
                                                <button
                                                   key={v}
                                                   onClick={() => setEvalScore(prev => ({ ...prev, [key]: v }))}
                                                   style={{ flex: 1, height: '32px', borderRadius: '6px', border: '1px solid var(--color-border)', background: current >= v ? 'var(--color-primary)' : 'white', color: current >= v ? 'white' : 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                   {v}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    );
                                 })}
                                 <textarea
                                    className="login-input"
                                    rows={3}
                                    placeholder="ข้อเสนอแนะเพิ่มเติมสำหรับทีม..."
                                    style={{ marginTop: '0.5rem' }}
                                    value={evalComment}
                                    onChange={e => setEvalComment(e.target.value)}
                                 />
                                 <button
                                    className="login-btn"
                                    style={{ background: 'var(--color-amber)' }}
                                    onClick={async () => {
                                       if (!user) { alert('กรุณาเข้าสู่ระบบก่อนบันทึกคะแนน'); return; }
                                       const scoresToSave = {};
                                       SCORE_DIMENSIONS.forEach(dim => {
                                          const v = evalScore[`${selectedTeam.id}-${dim}`];
                                          if (typeof v === 'number' && v > 0) scoresToSave[dim] = v;
                                       });
                                       if (Object.keys(scoresToSave).length === 0) {
                                          alert('กรุณาให้คะแนนอย่างน้อย 1 ด้าน');
                                          return;
                                       }
                                       try {
                                          await saveTeamScores(selectedTeam.id, scoresToSave, evalComment);
                                          alert(`บันทึกคะแนนประเมินสำเร็จ (${Object.keys(scoresToSave).length} ด้าน)`);
                                       } catch (err) {
                                          alert('Error: ' + err.message);
                                       }
                                    }}
                                 >
                                    <Star size={18} /> บันทึกคะแนนประเมิน
                                 </button>
                              </div>
                           </div>
                        </>
                     ) : (
                        <div style={{ textAlign: 'center', padding: '8rem 4rem' }}>
                           <Target size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                           <h3 style={{ opacity: 0.3 }}>เลือกทีมเพื่อเริ่มการประเมิน</h3>
                           <p style={{ color: 'var(--color-text-tertiary)' }}>ข้อมูลผลงานและ Prompt Logs จะแสดงที่นี่</p>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}



          {activeTab === 'teacher-reports' && (
            <motion.div key="tr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light">Report Center (R1-R6)</div>
               <div className="lane-content">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                     {[
                       { id: 'R1', label: 'R1 Score Summary', public: false },
                       { id: 'R2', label: 'R2 Idea & AI Prompt', public: false },
                       { id: 'R3', label: 'R3 Finance Integration', public: false },
                       { id: 'R4', label: 'R4 Activity Progress', public: false },
                       { id: 'R5', label: 'R5 Individual Summary', public: false },
                       { id: 'R6', label: 'R6 Portfolio (Public)', public: true }
                     ].map(r => (
                        <button key={r.id} onClick={()=>setReportType(r.id)} className={`card ${reportType === r.id ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.75rem' }}>
                           {r.label}
                        </button>
                     ))}
                  </div>
                  <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', border: '1px dashed #ddd' }}>
                     <div style={{ textAlign: 'center' }}>
                        <FileSpreadsheet size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>กำลังประมวลผลข้อมูล {reportType}...</p>
                        {reportType === 'R6' && <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>[Public Link: https://r-eco-pilot.com/portfolio/team-id]</p>}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'public-portfolio' && (
            <motion.div key="pp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-primary-light">R6 Portfolio (Public Showcase)</div>
               <div className="lane-content">
                  <div className="grid-2">
                     <div className="card">
                        <h5>คลังผลงานรวม (Public)</h5>
                        <p style={{ fontSize: '0.8125rem', marginTop: '1rem' }}>หน้านี้ทุกคนสามารถเข้าถึงได้เพื่อดูผลงานและความสำเร็จของทีมต่างๆ</p>
                        <button className="login-btn" style={{ marginTop: '1.5rem' }}>คัดลอกลิงก์แชร์ผลงาน</button>
                     </div>
                     <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
                        <LayoutGrid size={32} style={{ opacity: 0.2 }} />
                        <p style={{ fontSize: '0.75rem', marginTop: '1rem' }}>เลือกทีมเพื่อดู Portfolio...</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'ai-audit-log' && (
            <motion.div key="aal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lane">
               <div className="lane-header bg-blue-light"><ShieldCheck size={16} /> AI Audit Logbook — บันทึกการใช้ AI อย่างมีจริยธรรม</div>
               <div className="lane-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                     <h5 style={{ color: '#1e40af' }}>🛡️ ทำไมต้องบันทึก AI Usage?</h5>
                     <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: '#1e40af' }}>
                        การใช้ AI อย่างโปร่งใส (Transparency) และมีความรับผิดชอบ (Accountability) เป็นหลัก ESG ที่ Pitching Judges ให้คะแนนสูง — ทีมที่ใช้ AI แล้วบันทึกได้ครบ จะได้คะแนนหมวด "AI Prompting" และ "Fact-Checking" เต็ม
                     </p>
                  </div>

                  <div className="card">
                     <h5>📝 ฟอร์มบันทึกการใช้ AI (Quick Log)</h5>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>AI Tool ที่ใช้</label>
                           <select style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                              <option>ChatGPT</option>
                              <option>Claude</option>
                              <option>Gemini</option>
                              <option>Perplexity</option>
                              <option>อื่น ๆ</option>
                           </select>
                        </div>
                        <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>วัตถุประสงค์</label>
                           <select style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                              <option>หาข้อมูล (Research)</option>
                              <option>เขียนเนื้อหา (Content)</option>
                              <option>แปลภาษา (Translation)</option>
                              <option>สร้างภาพ (Image)</option>
                              <option>วิเคราะห์ (Analysis)</option>
                           </select>
                        </div>
                     </div>
                     <div style={{ marginTop: '0.75rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Prompt ที่ใช้ (สรุปสั้น ๆ)</label>
                        <textarea rows={2} placeholder="เช่น: ขอข้อมูลแหล่งท่องเที่ยวเชิงนิเวศในระยอง พร้อมแหล่งอ้างอิง" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'inherit' }} />
                     </div>
                     <div style={{ marginTop: '0.75rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>✅ Fact-Check แล้ว? (ตรวจ AI Hallucination)</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                           <label style={{ fontSize: '0.8125rem' }}><input type="radio" name="factcheck" /> ตรวจแล้ว มี source</label>
                           <label style={{ fontSize: '0.8125rem' }}><input type="radio" name="factcheck" /> ยังไม่ได้ตรวจ</label>
                           <label style={{ fontSize: '0.8125rem' }}><input type="radio" name="factcheck" /> ตรวจแล้ว AI ผิด — แก้แล้ว</label>
                        </div>
                     </div>
                     <button className="login-btn" style={{ marginTop: '1rem', width: 'auto' }}>+ บันทึก Log</button>
                  </div>

                  <div className="card">
                     <h5>📚 ประวัติการใช้ AI (Audit Trail)</h5>
                     <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        ยังไม่มี log — เริ่มบันทึกจากฟอร์มด้านบนได้เลย
                     </p>
                  </div>
               </div>
            </motion.div>
          )}



          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="lane">
                  <div className="lane-header bg-blue-light"><Users size={18} /> ข้อมูลสมาชิกทีม</div>
                  <div className="lane-content">
                     <div className="grid-2">
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                           <div className="card-number bg-blue-light" style={{ width: '64px', height: '64px', margin: '0 auto 1rem' }}><User size={32} /></div>
                           <h3>สมาชิกคนที่ 1</h3>
                           <p style={{ color: 'var(--color-text-tertiary)' }}>{user?.name}</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: '2rem', borderStyle: 'dashed' }}>
                           <Plus size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                           <p style={{ color: 'var(--color-text-tertiary)' }}>เพิ่มสมาชิกทีม</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
