import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './Home';
import Symptoms from './Symptoms';
import Medications from './Medications';
import Report from './Report';
import styles from './Dashboard.module.css';

const NAV = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/symptoms', label: 'Symptoms', icon: '🌡️' },
  { path: '/medications', label: 'Medications', icon: '💊' },
  { path: '/report', label: 'Report', icon: '📋' },
];

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  const username = user.email.split('@')[0];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span>💊</span>
            <span className={styles.logoText}>MedAlly</span>
          </div>
          <nav className={styles.nav}>
            {NAV.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{username[0].toUpperCase()}</div>
            <div>
              <div className={styles.userName}>{username}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <main className={styles.main}>
        {/* Mobile top bar */}
        <div className={styles.mobileBar}>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(v => !v)}>☰</button>
          <span className={styles.mobileTitle}>💊 MedAlly</span>
          <div style={{ width: 40 }} />
        </div>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/symptoms" element={<Symptoms user={user} />} />
            <Route path="/medications" element={<Medications user={user} />} />
            <Route path="/report" element={<Report user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
