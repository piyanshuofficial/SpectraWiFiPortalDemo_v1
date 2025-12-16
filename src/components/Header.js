// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBell, FaUserCircle, FaGlobe, FaChevronDown, FaBuilding, FaMapMarkerAlt, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toastify-overrides.css'; // CRITICAL: Must be imported AFTER ReactToastify.css
import '@components/Header.css';
import { NOTIFICATIONS } from '@constants/appConstants';
import { showInfo } from '@utils/notifications';
import RoleAccessSelector from '@components/RoleAccessSelector';
import { useSiteConfig } from '@hooks/useSiteConfig';
import { useSegmentActivities } from '@hooks/useSegmentActivities';
import { useSegmentCompanyData } from '@hooks/useSegmentCompanyData';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, MULTI_LANGUAGE_ENABLED } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useAccessLevelView } from '../context/AccessLevelViewContext';
import { AccessLevels } from '../utils/accessLevels';

const MAX_NOTIFICATIONS = 5;

const Header = () => {
  const location = useLocation();
  const { siteName } = useSiteConfig();
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const {
    isCompanyUser,
    isCompanyView,
    isSiteView,
    currentSiteName,
    returnToCompanyView
  } = useAccessLevelView();

  // Get segment-specific company data for the header
  const { company: segmentCompany } = useSegmentCompanyData();

  // Check if we're in internal portal
  const isInternalPortal = location.pathname.startsWith('/internal');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const langRef = useRef();

  // Get current language
  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  // Determine header display name based on access level and view
  const getHeaderDisplayName = () => {
    // For internal portal, show "Spectra NOC" instead of site name
    if (isInternalPortal) {
      return "Spectra NOC";
    }

    if (currentUser?.accessLevel === AccessLevels.COMPANY) {
      if (isCompanyView) {
        // Use segment-specific company name for company view
        return segmentCompany?.name || currentUser?.companyName || 'Company View';
      } else {
        return currentSiteName || siteName;
      }
    }
    // For site-level users, show segment company name or site name
    return segmentCompany?.name || siteName;
  };

  // Get internal portal role display
  const getInternalRoleDisplay = () => {
    if (!isInternalPortal || !currentUser) return null;
    const roleLabels = {
      admin: "Administrator",
      noc_manager: "NOC Manager",
      noc_operator: "NOC Operator",
      support: "Support Agent",
      field_engineer: "Field Engineer",
      viewer: "Viewer"
    };
    return roleLabels[currentUser.role] || currentUser.role;
  };

  // Get view level indicator
  const getViewIndicator = () => {
    if (!isCompanyUser) return null;
    return isCompanyView ? 'Company' : 'Site';
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangOpen(false);
  };

  // Get segment-specific activities (same as Recent Activities on Dashboard)
  const allActivities = useSegmentActivities();
  const notifications = allActivities.slice(0, MAX_NOTIFICATIONS);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            {/* Hide "Back to Site Dashboard" for internal portal */}
            {!isInternalPortal && (
              <span
                className="header-back-to-spectra"
                tabIndex={0}
                role="button"
                onClick={handleBackToSpectraOne}
                onKeyPress={e => e.key === "Enter" && handleBackToSpectraOne()}
                style={{ cursor: "pointer" }}
                aria-label={t('header.backToSite')}
              >
                {t('header.backToSite')}
              </span>
            )}
          </div>
          <div className="header-center">
            {/* Back to Company View button - shown when drilled down to site (customer portal only) */}
            {!isInternalPortal && isCompanyUser && isSiteView && (
              <button
                className="header-back-to-company"
                onClick={returnToCompanyView}
                title="Back to Company View"
                aria-label="Back to Company View"
              >
                <FaArrowLeft aria-hidden="true" />
                <span>Company View</span>
              </button>
            )}
            <div className="header-site-info">
              {/* Internal Portal branding */}
              {isInternalPortal ? (
                <>
                  <span className="header-view-indicator internal">
                    <FaShieldAlt aria-hidden="true" />
                    <span className="view-level-badge">Internal</span>
                  </span>
                  <span className="header-site">{getHeaderDisplayName()}</span>
                  {getInternalRoleDisplay() && (
                    <span className="header-role-badge">{getInternalRoleDisplay()}</span>
                  )}
                </>
              ) : (
                <>
                  {isCompanyUser && (
                    <span className="header-view-indicator">
                      {isCompanyView ? (
                        <FaBuilding aria-hidden="true" />
                      ) : (
                        <FaMapMarkerAlt aria-hidden="true" />
                      )}
                      <span className="view-level-badge">{getViewIndicator()}</span>
                    </span>
                  )}
                  <span className="header-site">{getHeaderDisplayName()}</span>
                </>
              )}
            </div>
          </div>
          <div className="header-actions">
            {/* Language Selector - MULTI-LANGUAGE DISABLED: Hidden when only English is enabled */}
            {MULTI_LANGUAGE_ENABLED && (
              <div
                className="language-selector"
                ref={langRef}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={langOpen}
                title={t('header.language')}
                aria-label={t('header.language')}
                onClick={() => setLangOpen(!langOpen)}
                onKeyPress={e => e.key === 'Enter' && setLangOpen(!langOpen)}
              >
                <FaGlobe aria-hidden="true" />
                <span className="lang-current">{currentLang.nativeName}</span>
                <FaChevronDown className={`lang-chevron ${langOpen ? 'open' : ''}`} aria-hidden="true" />
                {langOpen && (
                  <div className="language-dropdown">
                    {LANGUAGES.map(lang => (
                      <div
                        key={lang.code}
                        className={`language-option ${lang.code === currentLang.code ? 'active' : ''}`}
                        role="menuitem"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); }}
                        onKeyPress={(e) => { if (e.key === 'Enter') { e.stopPropagation(); changeLanguage(lang.code); } }}
                      >
                        <span className="lang-native">{lang.nativeName}</span>
                        <span className="lang-english">{lang.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                    <span className="notif-title">{t('header.notifications')}</span>
                    <span className="notif-count-badge" aria-hidden="true">
                      {String(notifications.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="notification-panel-content">
                    {notifications.length ? (
                      <ul className="notification-list" role="menu" aria-label={t('header.notifications')}>
                        {notifications.map((note, idx) => (
                          <li key={idx} role="menuitem">
                            <span>{note.text}</span>{' '}
                            <span style={{ fontStyle: "italic", color: "#5a5a5a", marginLeft: 8 }}>{note.time}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="notification-empty">{t('header.noNotifications')}</div>
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
                    {t('header.changePassword')}
                  </div>
                  <div
                    className="profile-menu-option"
                    tabIndex={0}
                    role="menuitem"
                    onClick={handleLogout}
                    onKeyPress={e => e.key === 'Enter' && handleLogout()}
                  >
                    {t('header.logout')}
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