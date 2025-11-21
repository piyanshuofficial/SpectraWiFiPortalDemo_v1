// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@components/Header.css';
import { NOTIFICATIONS } from '@constants/appConstants';
import { showInfo } from '@utils/notifications';
import RoleAccessSelector from '@components/RoleAccessSelector';
import { useSiteConfig } from '@hooks/useSiteConfig';

const Header = () => {
  const { siteName } = useSiteConfig();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { text: "User Amit logged in", time: "10:25 AM" },
    { text: "User Rohit was blocked", time: "Yesterday" },
    { text: "Network health check passed", time: "2 days ago" }
  ];

  const handleChangePassword = () => {
    showInfo("Change Password - backend integration pending.");
  };

  const handleLogout = () => {
    showInfo("Logout - backend integration pending.");
  };

  const handleBackToSpectraOne = () => {
    showInfo("Back To SpectraOne - backend integration pending.");
  };

  return (
    <>
      <header className="header-bar" style={{ marginTop: 0 }}>
        <div className="header-main-row">
          <div className="header-left">
            <span
              className="header-back-to-spectra"
              tabIndex={0}
              role="button"
              onClick={handleBackToSpectraOne}
              onKeyPress={e => e.key === "Enter" && handleBackToSpectraOne()}
              style={{ cursor: "pointer" }}
              aria-label="Navigate back to Site Dashboard"
            >
              Back To Site Dashboard
            </span>
          </div>
          <div className="header-center">
            <span className="header-site">{siteName}</span>
          </div>
          <div className="header-actions">
            <div
              className="notification-icon"
              ref={notifRef}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              role="button"
              title="Notifications"
              aria-label={`Notifications. ${notifications.length} unread`}
              onClick={() => setNotifOpen(!notifOpen)}
              onKeyPress={e => e.key === 'Enter' && setNotifOpen(!notifOpen)}
            >
              <FaBell aria-hidden="true" />
              <span className="notification-badge" aria-label={`${notifications.length} unread notifications`}>
                {notifications.length}
              </span>
              {notifOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <span className="notif-title">Recent Notifications</span>
                    <span className="notif-count-badge" aria-hidden="true">
                      {String(notifications.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="notification-panel-content">
                    {notifications.length ? (
                      <ul className="notification-list" role="menu" aria-label="Notifications list">
                        {notifications.map((note, idx) => (
                          <li key={idx} role="menuitem">
                            <span>{note.text}</span>{' '}
                            <span style={{ fontStyle: "italic", color: "#888", marginLeft: 8 }}>{note.time}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="notification-empty">No New Notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span
              className="header-avatar-icon"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              title="User account"
              aria-label="User account menu"
              ref={profileRef}
              onClick={() => setProfileOpen(v => !v)}
              onKeyPress={e => e.key === 'Enter' && setProfileOpen(v => !v)}
              style={{ position: "relative" }}
            >
              <FaUserCircle aria-hidden="true" />
              {profileOpen && (
                <div className="profile-menu-dropdown">
                  <div
                    className="profile-menu-option"
                    tabIndex={0}
                    role="menuitem"
                    onClick={handleChangePassword}
                    onKeyPress={e => e.key === 'Enter' && handleChangePassword()}
                  >
                    Change Password
                  </div>
                  <div
                    className="profile-menu-option"
                    tabIndex={0}
                    role="menuitem"
                    onClick={handleLogout}
                    onKeyPress={e => e.key === 'Enter' && handleLogout()}
                  >
                    Logout
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Testing Component - Role and Access Level Selector */}
      <RoleAccessSelector />

      <ToastContainer
        position={NOTIFICATIONS.POSITION}
        autoClose={NOTIFICATIONS.AUTO_CLOSE}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Header;