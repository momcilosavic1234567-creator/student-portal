import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, TrendingUp, Bot, ArrowRight, Star
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../api';

function getGpaBadgeClass(gpa) {
  if (!gpa) return '';
  if (gpa >= 3.7) return 'excellent';
  if (gpa >= 3.0) return 'good';
  if (gpa >= 2.0) return 'average';
  return 'low';
}

function getGpaLabel(gpa) {
  if (!gpa) return 'Not set';
  if (gpa >= 3.7) return 'Excellent';
  if (gpa >= 3.0) return 'Good Standing';
  if (gpa >= 2.0) return 'Average';
  return 'Needs Improvement';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }
    getMyProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [user]);

  if (!user) {
    return (
      <Layout title="Welcome to StudentHub">
        <div className="welcome-banner" style={{ background: 'var(--gradient-hero)', padding: '40px 30px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: 12 }}>Your Ultimate Academic Companion 🎓</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--subtext1)', maxWidth: 600, lineHeight: 1.6 }}>
              Track your GPA, connect with peers, and get instant answers with our built-in AI assistant. Join StudentHub today to elevate your academic journey.
            </p>
          </div>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
            Get Started
          </Link>
        </div>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Comprehensive Dashboard</div>
                <div className="card-subtitle">Track your progress at a glance</div>
              </div>
            </div>
            <div style={{ marginTop: 16, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <img src="/dashboard_mockup.png" alt="Dashboard Mockup" style={{ width: '100%', display: 'block', height: 'auto' }} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">AI Powered Assistant</div>
                <div className="card-subtitle">Get help instantly</div>
              </div>
            </div>
            <div style={{ marginTop: 16, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <img src="/ai_mockup.png" alt="AI Assistant Mockup" style={{ width: '100%', display: 'block', height: 'auto' }} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const firstName = user?.email?.split('@')[0] || 'student';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const gpaProgress = profile?.gpa ? (profile.gpa / 4.0) * 100 : 0;

  return (
    <Layout title="Dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h2>Welcome back, {displayName}! 👋</h2>
          <p>Here's an overview of your academic profile</p>
        </div>
        <Link to="/ai" className="btn btn-primary">
          <Bot size={16} />
          Ask AI Assistant
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <GraduationCap size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {loadingProfile ? '–' : profile?.year ? `Year ${profile.year}` : 'N/A'}
            </div>
            <div className="stat-label">Academic Year</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon mauve">
            <BookOpen size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ fontSize: '1.1rem' }}>
              {loadingProfile ? '–' : profile?.major || 'Not set'}
            </div>
            <div className="stat-label">Major / Field</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {loadingProfile ? '–' : profile?.gpa?.toFixed(2) || 'N/A'}
            </div>
            <div className="stat-label">Current GPA</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon peach">
            <Star size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ fontSize: '1.05rem' }}>
              {loadingProfile ? '–' : getGpaLabel(profile?.gpa)}
            </div>
            <div className="stat-label">Academic Status</div>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid-2">
        {/* Profile Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Academic Profile</div>
              <div className="card-subtitle">Your current information</div>
            </div>
            <Link to="/profile" className="btn btn-secondary btn-sm">
              <ArrowRight size={14} />
              Edit
            </Link>
          </div>

          {loadingProfile ? (
            <div className="spinner-overlay" style={{ minHeight: 120 }}>
              <div className="spinner" />
            </div>
          ) : profile ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <ProfileRow label="Major"      value={profile.major || '—'}   />
                <ProfileRow label="Year"       value={profile.year ? `Year ${profile.year}` : '—'} />
                <ProfileRow label="GPA"        value={profile.gpa?.toFixed(2) || '—'} highlight />
              </div>

              {profile.gpa && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: 'var(--subtext0)' }}>
                    <span>GPA Progress</span>
                    <span>{profile.gpa?.toFixed(2)} / 4.00</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${gpaProgress}%` }} />
                  </div>
                </div>
              )}

              {profile.bio && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface0)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--subtext1)', lineHeight: 1.6 }}>
                  "{profile.bio}"
                </div>
              )}

              {profile.gpa && (
                <div style={{ marginTop: 14 }}>
                  <span className={`gpa-badge ${getGpaBadgeClass(profile.gpa)}`}>
                    {getGpaLabel(profile.gpa)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p style={{ marginBottom: 12, fontSize: '0.875rem' }}>You haven't set up your student profile yet.</p>
              <Link to="/profile" className="btn btn-primary btn-sm">
                Set up profile
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Quick Actions</div>
              <div className="card-subtitle">What would you like to do?</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <QuickAction
              to="/ai"
              icon={<Bot size={18} />}
              title="Ask AI Assistant"
              desc="Get instant answers to academic questions"
              color="blue"
            />
            <QuickAction
              to="/profile"
              icon={<GraduationCap size={18} />}
              title="Update Profile"
              desc="Edit your major, GPA, and bio"
              color="mauve"
            />
            <QuickAction
              to="/students"
              icon={<BookOpen size={18} />}
              title="Browse Students"
              desc="View fellow students' profiles"
              color="green"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProfileRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--subtext0)' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: highlight ? 'var(--blue)' : 'var(--text)' }}>{value}</span>
    </div>
  );
}

function QuickAction({ to, icon, title, desc, color }) {
  const colorMap = {
    blue:  { bg: 'rgba(137,180,250,0.1)', color: 'var(--blue)'  },
    mauve: { bg: 'rgba(203,166,247,0.1)', color: 'var(--mauve)' },
    green: { bg: 'rgba(166,227,161,0.1)', color: 'var(--green)' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        background: 'rgba(49,50,68,0.3)',
        transition: 'all 0.2s ease', cursor: 'pointer',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface0)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(49,50,68,0.3)'}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: c.bg, color: c.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--subtext0)' }}>{desc}</div>
        </div>
        <ArrowRight size={14} color="var(--overlay0)" />
      </div>
    </Link>
  );
}
