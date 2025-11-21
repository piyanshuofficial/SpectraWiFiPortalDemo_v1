// src/pages/KnowledgeCenter/KnowledgeHome.js

import React, { useEffect, useRef, useState } from 'react';
import { FaBookOpen, FaVideo, FaQuestionCircle } from 'react-icons/fa';
import SkeletonLoader from '../../components/Loading/SkeletonLoader';
import KnowledgeArticleModal from '../../components/KnowledgeArticleModal';
import { getArticle } from '../../constants/knowledgeArticles';
import { ANIMATION } from '../../constants/appConstants';
import './KnowledgeHome.css';

const KnowledgeHome = () => {
  const [supportHighlight, setSupportHighlight] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const helpSectionRef = useRef(null);

  const handleArticleClick = (articleId) => {
    const article = getArticle(articleId);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  useEffect(() => {
    const loadContent = () => {
      setInitialLoad(false);
    };

    const timer = setTimeout(loadContent, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'highlight-support') {
        setSupportHighlight(true);
        setTimeout(() => {
          if (helpSectionRef.current) {
            helpSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, ANIMATION.SCROLL_DELAY);
      }
    };
    window.addEventListener('triggerSupportHighlight', handler);

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

  const handleHighlightRemove = () => {
    setSupportHighlight(false);
  };

  if (initialLoad) {
    return (
      <main className="knowledge-center-main">
        <SkeletonLoader variant="rect" height={40} width="40%" style={{ marginBottom: '30px' }} />

        <SkeletonLoader variant="rect" height={50} style={{ marginBottom: '30px' }} />

        <div className="knowledge-feature-cards">
          {[...Array(3)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>

        <div className="knowledge-blocks-row">
          {[...Array(2)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>

        <div className="knowledge-blocks-row">
          {[...Array(2)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>

        <div className="knowledge-blocks-row">
          {[...Array(2)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>

        <SkeletonLoader variant="card" style={{ marginTop: '30px' }} />
      </main>
    );
  }

  return (
    <main className="knowledge-center-main">
      <h1 className="knowledge-center-title">Knowledge Center</h1>

      <div className="knowledge-search-row">
        <input
          type="text"
          className="knowledge-search-input"
          placeholder="Search for user management, network setup, reports, troubleshooting..."
          aria-label="Search Knowledge Center"
        />
        <button className="knowledge-search-btn">Search</button>
      </div>

      <div className="knowledge-feature-cards">
        <div className="knowledge-feature-card">
          <FaBookOpen className="feature-icon" />
          <div className="feature-title">Getting Started</div>
          <div className="feature-desc">Quick start guides for portal setup, user onboarding, and initial configuration of your WiFi management system</div>
        </div>
        <div className="knowledge-feature-card">
          <FaVideo className="feature-icon" />
          <div className="feature-title">Video Tutorials</div>
          <div className="feature-desc">Watch step-by-step video walkthroughs for managing users, devices, generating reports, and monitoring network performance</div>
        </div>
        <div className="knowledge-feature-card">
          <FaQuestionCircle className="feature-icon" />
          <div className="feature-title">FAQ</div>
          <div className="feature-desc">Answers to frequently asked questions about license management, user policies, device registration, and report generation</div>
        </div>
      </div>

      <div className="knowledge-blocks-row">
        <div className="knowledge-block">
          <div className="block-title">User Management</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('adding-new-users')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('adding-new-users')}
          >
            <b>Adding New Users</b><br />
            Learn how to create user accounts, assign appropriate policies, and manage user credentials effectively
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-policies-licenses')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-policies-licenses')}
          >
            <b>User Policies & Licenses</b><br />
            Configure speed limits, data volumes, device limits, and data cycle types for users and monitor license utilization
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('bulk-user-operations')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('bulk-user-operations')}
          >
            <b>Bulk User Operations</b><br />
            Import multiple users from CSV files, perform batch updates, and export user data for reporting and compliance
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-status-management')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-status-management')}
          >
            <b>User Status Management</b><br />
            Activate, suspend, or block users, manage user credentials, and handle password resets for your organization
          </div>
        </div>
        <div className="knowledge-block">
          <div className="block-title">Device Management</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('device-registration')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('device-registration')}
          >
            <b>Device Registration</b><br />
            Register new devices with MAC address binding, assign devices to users, and configure human vs non-human device types
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('device-registration')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('device-registration')}
          >
            <b>Device Assignment & Tracking</b><br />
            Assign registered devices to users, track device connection history, and monitor data usage per device
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('troubleshooting-connection')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('troubleshooting-connection')}
          >
            <b>Device Connectivity Issues</b><br />
            Troubleshoot device connection problems, authentication failures, and MAC address binding errors
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('segment-configuration')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('segment-configuration')}
          >
            <b>Device Type Configuration</b><br />
            Configure device limits per user and set device type restrictions to optimize network performance and security
          </div>
        </div>
      </div>

      <div className="knowledge-blocks-row">
        <div className="knowledge-block">
          <div className="block-title">Reports & Analytics</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('dashboard-overview')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('dashboard-overview')}
          >
            <b>Dashboard Overview</b><br />
            Understand key metrics: active users, license usage, data consumption, alerts, and network analytics at a glance
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('generating-reports')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('generating-reports')}
          >
            <b>Generating Reports</b><br />
            Create billing reports, usage summaries, network analytics, and SLA compliance reports with customizable date ranges
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('generating-reports')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('generating-reports')}
          >
            <b>Report Criteria & Filters</b><br />
            Apply date ranges, month ranges, policy filters, and status filters to generate targeted reports for your needs
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('generating-reports')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('generating-reports')}
          >
            <b>Export & Data Analysis</b><br />
            Export reports in CSV and PDF formats, analyze usage trends, and share insights with stakeholders
          </div>
        </div>
        <div className="knowledge-block">
          <div className="block-title">Network Configuration</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('policy-setup')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('policy-setup')}
          >
            <b>Policy Setup</b><br />
            Create and manage user policies with speed limits (10-50 Mbps), data volume caps, device limits, and data cycle configurations
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('segment-configuration')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('segment-configuration')}
          >
            <b>Advanced Network Configuration</b><br />
            Configure device restrictions, license capacity, access controls, and performance optimization settings
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('dashboard-overview')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('dashboard-overview')}
          >
            <b>Network Analytics</b><br />
            Monitor bandwidth utilization, track network usage patterns, analyze data consumption trends, and view network health metrics
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-policies-licenses')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-policies-licenses')}
          >
            <b>License Management</b><br />
            Monitor license utilization, manage license allocation capacity, and configure alerts for license thresholds
          </div>
        </div>
      </div>

      <div className="knowledge-blocks-row">
        <div className="knowledge-block">
          <div className="block-title">Troubleshooting</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('troubleshooting-connection')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('troubleshooting-connection')}
          >
            <b>User Connection Issues</b><br />
            Resolve common login problems, authentication failures, password reset issues, and user account access errors
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('device-registration')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('device-registration')}
          >
            <b>Device Registration Problems</b><br />
            Troubleshoot MAC address binding errors, device visibility issues, and device registration constraints
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('generating-reports')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('generating-reports')}
          >
            <b>Report Generation Errors</b><br />
            Fix issues with report criteria validation, data export failures, and PDF generation problems
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-policies-licenses')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-policies-licenses')}
          >
            <b>License & Access Issues</b><br />
            Address license exhaustion warnings, permission-related errors, and role-based access control problems
          </div>
        </div>
        <div className="knowledge-block">
          <div className="block-title">Best Practices</div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-policies-licenses')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-policies-licenses')}
          >
            <b>License Management</b><br />
            Optimize license allocation, monitor usage trends, plan capacity upgrades, and avoid service disruptions
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('user-status-management')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('user-status-management')}
          >
            <b>User Account Lifecycle</b><br />
            Best practices for managing user accounts, handling suspensions and blocks, and maintaining account security
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('bulk-user-operations')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('bulk-user-operations')}
          >
            <b>Data Management</b><br />
            Regular data exports, backup strategies, compliance reporting, and CSV import/export best practices
          </div>
          <div
            className="block-entry clickable"
            onClick={() => handleArticleClick('policy-setup')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleArticleClick('policy-setup')}
          >
            <b>Policy Optimization</b><br />
            Design effective policies, balance user load with tiered service levels, and optimize network performance
          </div>
        </div>
      </div>

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
        <div className="help-desc">Can't find what you're looking for? Our support team is ready to assist with portal navigation, technical issues, and configuration guidance.</div>
        <div className="help-buttons">
          <button className="help-btn email">Email Support</button>
          <button className="help-btn call">Call Support</button>
          <button className="help-btn chat">Live Chat</button>
        </div>
      </div>

      {selectedArticle && (
        <KnowledgeArticleModal
          article={selectedArticle}
          onClose={handleCloseArticle}
        />
      )}
    </main>
  );
};

export default KnowledgeHome;