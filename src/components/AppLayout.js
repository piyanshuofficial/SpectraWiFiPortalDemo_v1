/**
 * ============================================================================
 * AppLayout Component
 * ============================================================================
 *
 * @file src/components/AppLayout.js
 * @description Main layout wrapper component that provides the consistent
 *              structure for all authenticated pages in both Customer Portal
 *              and Internal Portal. Combines Sidebar, Header, main content
 *              area, and Footer into a cohesive layout.
 *
 * @structure
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Skip Link (hidden, keyboard accessible)                        │
 * ├──────────┬──────────────────────────────────────────────────────┤
 * │          │  Header (Logo, User Menu, Theme Toggle)             │
 * │          ├──────────────────────────────────────────────────────┤
 * │ Sidebar  │                                                      │
 * │ (Nav)    │           Main Content Area                         │
 * │          │           (Page-specific content)                   │
 * │          │                                                      │
 * │          ├──────────────────────────────────────────────────────┤
 * │          │  Footer (Copyright, Version)                        │
 * └──────────┴──────────────────────────────────────────────────────┘
 * ```
 *
 * @usage
 * ```jsx
 * // In App.js or route configuration
 * <AppLayout>
 *   <Dashboard />
 * </AppLayout>
 * ```
 *
 * @accessibility
 * - Skip link allows keyboard users to bypass navigation
 * - Main content area has proper ARIA role and label
 * - Semantic HTML structure (main, nav, header, footer)
 *
 * @responsive
 * - Sidebar collapses on mobile devices
 * - Main content adjusts width based on sidebar state
 * - Footer sticks to bottom of viewport
 *
 * @dependencies
 * - Sidebar.js   : Navigation menu component
 * - Header.js    : Top header with user info and controls
 * - FooterBar.js : Bottom footer with copyright
 * - AppLayout.css: Layout grid and responsive styles
 *
 * @stateManagement
 * - Sidebar collapsed state is managed by Sidebar component
 * - Theme state is managed by ThemeContext (via Header)
 * - User state is managed by AuthContext (via Header)
 *
 * ============================================================================
 */

import React from "react";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import FooterBar from "@components/FooterBar";
import "@components/AppLayout.css";

/**
 * AppLayout - Main page layout wrapper with navigation and structure
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render in main area
 * @returns {JSX.Element} Complete page layout with sidebar, header, content, footer
 */
const AppLayout = ({ children }) => {
  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main id="main-content" className="main-content" role="main" aria-label="Main content">
          {children}
        </main>
        <FooterBar />
      </div>
    </>
  );
};

export default AppLayout;