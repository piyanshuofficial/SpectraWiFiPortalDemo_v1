// src/pages/KnowledgeCenter/KnowledgeHome.js

import React, { useEffect, useRef, useState } from 'react';
import { FaBookOpen, FaVideo, FaQuestionCircle } from 'react-icons/fa';
import './KnowledgeHome.css';

const KnowledgeHome = () => {
  // State and ref for highlight
  const [supportHighlight, setSupportHighlight] = useState(false);
  const helpSectionRef = useRef(null);

  // Allow dashboard to trigger highlight and scroll via hash or custom event
  useEffect(() => {
    // Listen for a custom event to trigger highlight and scroll
    const handler = (e) => {
      if (e.detail === 'highlight-support') {
        setSupportHighlight(true);
        setTimeout(() => {
          if (helpSectionRef.current) {
            helpSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 60);
      }
    };
    window.addEventListener('triggerSupportHighlight', handler);

    // Optional: support old-style hash in URL
    if (window.location.hash === '#support-highlight') {
      setSupportHighlight(true);
      setTimeout(() => {
        if (helpSectionRef.current) {
          helpSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
    }

    return () => window.removeEventListener('triggerSupportHighlight', handler);
  }, []);

  // Remove highlight on click
  const handleHighlightRemove = () => {
    setSupportHighlight(false);
    // Remove any outdated hash
  };

  return (
    <main className="knowledge-center-main">
      <h1 className="knowledge-center-title">Knowledge Center</h1>

      <div className="knowledge-search-row">
        <input
          type="text"
          className="knowledge-search-input"
          placeholder="Search documentation, FAQs, tutorials..."
          aria-label="Search Knowledge Center"
        />
        <button className="knowledge-search-btn">Search</button>
      </div>

      <div className="knowledge-feature-cards">
        <div className="knowledge-feature-card">
          <FaBookOpen className="feature-icon" />
          <div className="feature-title">Getting Started</div>
          <div className="feature-desc">Complete guide to setting up and configuring your WiFi portal</div>
        </div>
        <div className="knowledge-feature-card">
          <FaVideo className="feature-icon" />
          <div className="feature-title">Video Tutorials</div>
          <div className="feature-desc">Step-by-step video guides for common tasks and configurations</div>
        </div>
        <div className="knowledge-feature-card">
          <FaQuestionCircle className="feature-icon" />
          <div className="feature-title">FAQ</div>
          <div className="feature-desc">Frequently asked questions and quick solutions</div>
        </div>
      </div>

      <div className="knowledge-blocks-row">
        <div className="knowledge-block">
          <div className="block-title">User Management</div>
          <div className="block-entry"><b>Creating User Accounts</b><br />Learn how to add new users and assign policies</div>
          <div className="block-entry"><b>Policy Configuration</b><br />Setting up access policies and restrictions</div>
          <div className="block-entry"><b>Bulk User Import</b><br />Import multiple users from CSV files</div>
        </div>
        <div className="knowledge-block">
          <div className="block-title">Network Configuration</div>
          <div className="block-entry"><b>WiFi Network Setup</b><br />Configure SSIDs, security settings, and access points</div>
          <div className="block-entry"><b>Captive Portal</b><br />Customize login pages and authentication methods</div>
          <div className="block-entry"><b>QoS Settings</b><br />Manage bandwidth allocation and traffic priorities</div>
        </div>
      </div>

      <div className="knowledge-blocks-row">
        <div className="knowledge-block">
          <div className="block-title">Reporting & Analytics</div>
          <div className="block-entry"><b>Usage Reports</b><br />Generate and schedule automated usage reports</div>
          <div className="block-entry"><b>Custom Dashboards</b><br />Create personalized analytics dashboards</div>
          <div className="block-entry"><b>Data Export</b><br />Export data in various formats for analysis</div>
        </div>
        <div className="knowledge-block">
          <div className="block-title">Troubleshooting</div>
          <div className="block-entry"><b>Connection Issues</b><br />Resolve common connectivity problems</div>
          <div className="block-entry"><b>Performance Optimization</b><br />Improve network speed and reliability</div>
          <div className="block-entry"><b>Error Codes</b><br />Understanding and resolving system errors</div>
        </div>
      </div>

      {/* Help Section: scroll target and highlight */}
      <div
        ref={helpSectionRef}
        className={`knowledge-help-row${supportHighlight ? ' support-highlight' : ''}`}
        id="knowledge-support-section"
        onClick={supportHighlight ? handleHighlightRemove : undefined}
        tabIndex={supportHighlight ? 0 : -1}
        style={{ outline: supportHighlight ? 'none' : undefined }}
        aria-label="Support knowledge center section"
      >
        <div className="help-title">Need Additional Help?</div>
        <div className="help-desc">Can't find what you're looking for? Our support team is here to help.</div>
        <div className="help-buttons">
          <button className="help-btn email">Email Support</button>
          <button className="help-btn call">Call Support</button>
          <button className="help-btn chat">Live Chat</button>
        </div>
      </div>
    </main>
  );
};

export default KnowledgeHome;
