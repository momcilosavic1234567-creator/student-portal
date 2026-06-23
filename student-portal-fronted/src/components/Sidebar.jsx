import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Users, Bot, LogOut, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/profile',     icon: User,            label: 'My Profile'  },
  { to: '/students',    icon: Users,           label: 'Students'    },
  { to: '/ai',          icon: Bot,             label: 'AI Assistant'},
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'SU';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #89b4fa, #cba6f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={18} color="#1e1e2e" strokeWidth={2.5} />
          </div>
          <div>
            <div className="logo-text">StudentHub</div>
            <div className="logo-sub">Academic Portal</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigation</span>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon className="nav-icon" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'student'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--subtext0)' }}>Student</div>
          </div>
        </div>
        <button className="btn btn-danger btn-full btn-sm" onClick={handleLogout} id="logout-btn">
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
