import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../utils/auth';
import {
  DashboardIcon, PatientsIcon, EncounterIcon, PillIcon, AlertIcon,
  ChartIcon, PrinterIcon, LogoutIcon, MenuIcon, CloseIcon, LogoMark,
} from '../Icons';
import './Layout.css';

// The Sidebar links. To add a page: add one line here + one <Route> in App.js
export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/patients', label: 'Patient Records', icon: PatientsIcon },
  { to: '/encounter', label: 'Clinical Encounter', icon: EncounterIcon },
  { to: '/medications', label: 'Medications', icon: PillIcon },
  { to: '/emergency', label: 'Emergency Alert', icon: AlertIcon },
  { to: '/statistics', label: 'Monthly Statistics', icon: ChartIcon },
  { to: '/patient-form', label: 'Patient Form', icon: PrinterIcon },
];

const initials = (name = '') =>
  name.replace(/^(Dr\.|Nurse)\s*/i, '').split(' ').map((w) => w[0]).slice(0, 2).join('');

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const current = navItems.find((item) => location.pathname.startsWith(item.to));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      {/* ---------- Sidebar ---------- */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-logo"><LogoMark size={36} /></span>
          <div>
            <strong>Resort Clinic</strong>
            <small>Clinical Information System</small>
          </div>
          <button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-heading">Menu</span>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''} ${to === '/emergency' ? 'nav-emergency' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{initials(user?.name)}</div>
          <div className="user-info">
            <strong>{user?.name}</strong>
            <small>{user?.role === 'doctor' ? 'Doctor' : 'Nurse'}</small>
          </div>
          <button className="icon-btn" onClick={handleLogout} title="Log out" aria-label="Log out">
            <LogoutIcon size={18} />
          </button>
        </div>
      </aside>

      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* ---------- Main area ---------- */}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <h1 className="topbar-title">{current?.label || 'Resort Clinic'}</h1>
          <div className="topbar-actions">
            <span className="topbar-date">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => navigate('/emergency')}>
              <AlertIcon size={16} />
              <span className="hide-sm">Emergency</span>
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet /> {/* ← the current page is rendered here */}
        </main>
      </div>
    </div>
  );
}

export default Layout;
