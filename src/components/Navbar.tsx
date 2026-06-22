import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music2, TicketCheck } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Music2 size={28} />
          <span>HAHAHIHIFEST</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Konser
          </Link>
          <Link to="/check-ticket" className="nav-link" onClick={() => setMenuOpen(false)}>
            <TicketCheck size={18} />
            Cek Tiket
          </Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
