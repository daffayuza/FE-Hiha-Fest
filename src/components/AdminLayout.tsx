import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Receipt, LogOut, Music2 } from 'lucide-react';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin token from localStorage
    localStorage.removeItem('admin_token');
    // Navigate to login page
    navigate('/admin/login', { replace: true });
  };

  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Music2 size={24} />
          <span>ADMIN</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <CalendarDays size={20} />
            <span>Manajemen Event</span>
          </NavLink>
          <NavLink to="/admin/transactions" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Receipt size={20} />
            <span>Transaksi</span>
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            className="admin-nav-link logout"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
