import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Receipt, LogOut, Music2 } from 'lucide-react';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

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
          <NavLink to="/admin/login" className="admin-nav-link logout">
            <LogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
