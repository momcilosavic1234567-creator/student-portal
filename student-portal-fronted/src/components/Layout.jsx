import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ title, children }) {
  const { user } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'SU';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-right">
            <div className="user-avatar" title={user?.email}>{initials}</div>
          </div>
        </header>
        <main className="page-content animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
