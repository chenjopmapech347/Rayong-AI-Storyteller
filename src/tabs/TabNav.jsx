// TabNav.jsx — แถบเมนูหลัก (tab navigation bar)
// แสดงเมนูแตกต่างกันตาม user.role
//
// Props:
//   user          – object | null  { role: 'student' | 'teacher' | 'facilitator' | 'sage' | 'admin' }
//   activeTab     – string         tab ที่เลือกอยู่
//   setActiveTab  – (tab: string) => void
//   currentCourse – object | null  { worksheets: [], branding: { logoEmoji }, nameTH, name, id }
//   coursesAll    – Course[]       หลักสูตรทั้งหมด (สำหรับแสดง course switcher)
//   t             – (key: string) => string  translation function

import {
  Send, Users, Monitor, Settings, Inbox, Camera, Target, Star,
  FileSpreadsheet, ShieldCheck, HelpCircle, BookOpen, Award, LayoutDashboard,
  FlaskConical,
} from 'lucide-react';

export default function TabNav({ user, activeTab, setActiveTab, currentCourse, coursesAll, t }) {
  // Helper: CSS class for a tab item
  const tabCls = (tab) => `tab-item${activeTab === tab ? ' active' : ''}`;

  // Worksheets tab — แสดงเฉพาะเมื่อหลักสูตรปัจจุบันมีใบงาน
  const WorksheetsTab = currentCourse?.worksheets?.length > 0 ? (
    <div className={tabCls('worksheets')} onClick={() => setActiveTab('worksheets')}>
      <BookOpen size={16} /> Worksheets ({currentCourse.worksheets.length})
    </div>
  ) : null;

  return (
    <nav className="tab-nav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>

      {/* ─── Course Switcher (always first when ≥ 2 courses + logged in) ─── */}
      {user && coursesAll.length > 1 && (
        <div
          className={tabCls('course-select')}
          onClick={() => setActiveTab('course-select')}
          style={{ fontWeight: 700, borderRight: '2px solid var(--color-border)', marginRight: 4 }}
          title="เปลี่ยนหลักสูตร"
        >
          {currentCourse?.branding?.logoEmoji || '📚'} หลักสูตร: {currentCourse?.nameTH || currentCourse?.name || currentCourse?.id}
        </div>
      )}

      {/* ─── Public (not logged in) ─── */}
      {!user && (
        <>
          <div className={tabCls('public')} onClick={() => setActiveTab('public')}>
            <LayoutDashboard size={16} /> {t('Public View')}
          </div>
          {WorksheetsTab}
          <div className={tabCls('help')} onClick={() => setActiveTab('help')}>
            <HelpCircle size={16} /> {t('Help')}
          </div>
        </>
      )}

      {/* ─── Student ─── */}
      {user?.role === 'student' && (
        <>
          <div className={tabCls('team-setup')} onClick={() => setActiveTab('team-setup')}>
            <Users size={16} /> {t('Explorer')}
          </div>
          <div className={tabCls('mission-inbox')} onClick={() => setActiveTab('mission-inbox')}>
            <Inbox size={16} /> {t('Inbox')}
          </div>
          <div className={tabCls('collector')} onClick={() => setActiveTab('collector')}>
            <Camera size={16} /> {t('Collector')}
          </div>
          {/* Worksheets หรือ Submissions (ขึ้นอยู่กับหลักสูตร) */}
          {currentCourse?.worksheets?.length > 0 ? WorksheetsTab : (
            <div className={tabCls('gateway')} onClick={() => setActiveTab('gateway')}>
              <Send size={16} /> {t('Submissions')}
            </div>
          )}
          <div className={tabCls('evaluation-hub')} onClick={() => setActiveTab('evaluation-hub')}>
            <Star size={16} /> {t('Evaluate')}
          </div>
          <div className={tabCls('public-portfolio')} onClick={() => setActiveTab('public-portfolio')}>
            <Award size={16} /> {t('Report (R6)')}
          </div>
          <div className={tabCls('research-survey')} onClick={() => setActiveTab('research-survey')}>
            <FlaskConical size={16} /> งานวิจัยนวัตกรรม
          </div>
          <div className={tabCls('help')} onClick={() => setActiveTab('help')}>
            <HelpCircle size={16} /> {t('Help')}
          </div>
        </>
      )}

      {/* ─── Teacher / Facilitator ─── */}
      {(user?.role === 'teacher' || user?.role === 'facilitator') && (
        <>
          <div className={tabCls('teacher-dashboard')} onClick={() => setActiveTab('teacher-dashboard')}>
            <Monitor size={16} /> {t('Dashboard')}
          </div>
          <div className={tabCls('mission-builder')} onClick={() => setActiveTab('mission-builder')}>
            <Target size={16} /> {t('Mission Builder')}
          </div>
          <div className={tabCls('gateway')} onClick={() => setActiveTab('gateway')}>
            <Send size={16} /> {t('Submissions')}
          </div>
          <div className={tabCls('ai-audit-log')} onClick={() => setActiveTab('ai-audit-log')}>
            <ShieldCheck size={16} /> {t('AI Audit')}
          </div>
          <div className={tabCls('pitch-evaluator')} onClick={() => setActiveTab('pitch-evaluator')}>
            <Star size={16} /> {t('Pitching')}
          </div>
          <div className={tabCls('teacher-reports')} onClick={() => setActiveTab('teacher-reports')}>
            <FileSpreadsheet size={16} /> {t('Reports')}
          </div>
          <div className={tabCls('research-eval')} onClick={() => setActiveTab('research-eval')}>
            <FlaskConical size={16} /> งานวิจัยนวัตกรรม
          </div>
          {WorksheetsTab}
          <div className={tabCls('help')} onClick={() => setActiveTab('help')}>
            <HelpCircle size={16} /> {t('Help')}
          </div>
        </>
      )}

      {/* ─── Sage ─── */}
      {user?.role === 'sage' && (
        <>
          {WorksheetsTab}
          <div className={tabCls('pitch-evaluator')} onClick={() => setActiveTab('pitch-evaluator')}>
            <Star size={16} /> {t('Pitching')}
          </div>
          <div className={tabCls('public-portfolio')} onClick={() => setActiveTab('public-portfolio')}>
            <Award size={16} /> {t('Report (R6)')}
          </div>
          <div className={tabCls('help')} onClick={() => setActiveTab('help')}>
            <HelpCircle size={16} /> {t('Help')}
          </div>
        </>
      )}

      {/* ─── Admin ─── */}
      {user?.role === 'admin' && (
        <>
          <div className={tabCls('admin')} onClick={() => setActiveTab('admin')}>
            <Settings size={16} /> {t('Admin')}
          </div>
          <div className={tabCls('team-setup')} onClick={() => setActiveTab('team-setup')}>
            <Users size={16} /> {t('Teams')}
          </div>
          <div className={tabCls('teacher-dashboard')} onClick={() => setActiveTab('teacher-dashboard')}>
            <Monitor size={16} /> {t('Dashboard')}
          </div>
          <div className={tabCls('gateway')} onClick={() => setActiveTab('gateway')}>
            <Send size={16} /> {t('Submissions')}
          </div>
          <div className={tabCls('ai-audit-log')} onClick={() => setActiveTab('ai-audit-log')}>
            <ShieldCheck size={16} /> {t('AI Audit')}
          </div>
          <div className={tabCls('pitch-evaluator')} onClick={() => setActiveTab('pitch-evaluator')}>
            <Star size={16} /> {t('Pitching')}
          </div>
          <div className={tabCls('teacher-reports')} onClick={() => setActiveTab('teacher-reports')}>
            <FileSpreadsheet size={16} /> {t('Reports')}
          </div>
          <div className={tabCls('research-results')} onClick={() => setActiveTab('research-results')}>
            <FlaskConical size={16} /> งานวิจัยนวัตกรรม
          </div>
          {WorksheetsTab}
          <div className={tabCls('help')} onClick={() => setActiveTab('help')}>
            <HelpCircle size={16} /> {t('Help')}
          </div>
        </>
      )}

    </nav>
  );
}
