// src/pages/Support/Support.js
// Support Page with Spectra Genie Integration for Customer Portal

import React, { useMemo } from 'react';
import {
  FaRobot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaTicketAlt,
  FaInfoCircle,
  FaHeadset,
  FaExternalLinkAlt,
  FaBook,
  FaComments,
  FaMagic,
  FaLaptop,
  FaUsers,
  FaWifi,
  FaChartBar,
  FaUserShield,
  FaArrowRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useAccessLevelView } from '@context/AccessLevelViewContext';
import './Support.css';

// Base support info - shared across all segments
const BASE_SUPPORT_INFO = {
  phone: '1800 121 5678',
  email: 'msoc@spectra.co',
  whatsapp: '+91 1800 121 5678',
  portalUrl: 'https://support.spectra.co'
};

// Segment-specific support hours configuration
const SEGMENT_SUPPORT_HOURS = {
  Enterprise: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  },
  Hotel: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  },
  CoLiving: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  },
  PG: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  },
  CoWorking: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  },
  Misc: {
    phone: '24/7 Available',
    email: 'Response within 4 hours',
    whatsapp: '9 AM - 9 PM (Mon-Sat)'
  }
};

// Quick help topics - linked to Knowledge Center articles
const helpTopics = [
  {
    icon: FaLaptop,
    title: 'Device Management',
    description: 'Add, remove, or troubleshoot device connections',
    articleId: 'registering-devices',
    category: 'Device Management'
  },
  {
    icon: FaUsers,
    title: 'User Management',
    description: 'Create users, manage roles and permissions',
    articleId: 'adding-new-users',
    category: 'User Management'
  },
  {
    icon: FaWifi,
    title: 'Network Issues',
    description: 'WiFi connectivity and speed troubleshooting',
    articleId: 'wifi-connectivity-troubleshooting',
    category: 'Troubleshooting'
  },
  {
    icon: FaChartBar,
    title: 'Reports & Analytics',
    description: 'Generate and export usage reports',
    articleId: 'reports-overview',
    category: 'Reports & Analytics'
  },
  {
    icon: FaUserShield,
    title: 'Account & Security',
    description: 'Password reset and account settings',
    articleId: 'password-reset',
    category: 'Account & Security'
  },
  {
    icon: FaBook,
    title: 'Browse All Topics',
    description: 'FAQs, guides, and documentation',
    articleId: null, // Links to Knowledge Center home
    category: null
  }
];

const Support = () => {
  const { currentUser } = useAuth();
  const { currentSite } = useAccessLevelView();
  const navigate = useNavigate();

  // Get segment from currentUser
  const userSegment = currentUser?.segment || 'Enterprise';

  // Memoize support info to avoid unnecessary recalculations
  const supportInfo = useMemo(() => ({
    ...BASE_SUPPORT_INFO,
    hours: SEGMENT_SUPPORT_HOURS[userSegment] || SEGMENT_SUPPORT_HOURS.Enterprise
  }), [userSegment]);

  // Open Spectra Genie chatbot
  const openSpectraGenie = () => {
    // Dispatch event to open the chatbot
    window.dispatchEvent(new CustomEvent('openSpectraGenie'));
  };

  // Navigate to knowledge center article
  const handleHelpTopic = (topic) => {
    if (topic.articleId) {
      // Navigate to specific article in Knowledge Center
      navigate(`/knowledge?article=${topic.articleId}`);
    } else {
      // Navigate to Knowledge Center home
      navigate('/knowledge');
    }
  };

  return (
    <div className="support-page">
      {/* Page Header */}
      <div className="support-page-header">
        <div className="support-title-section">
          <h1>
            <FaHeadset className="page-title-icon" />
            Help & Support
          </h1>
          <p>Get help with your network management and services</p>
        </div>
      </div>

      <div className="support-content">
        {/* Main Support Section */}
        <div className="support-main">
          {/* Spectra Genie Card - Primary CTA */}
          <div className="spectra-genie-card">
            <div className="genie-header">
              <div className="genie-avatar">
                <FaRobot />
              </div>
              <div className="genie-info">
                <h2>Spectra Genie</h2>
                <p>Your AI-powered support assistant</p>
              </div>
              <div className="genie-status">
                <span className="status-indicator"></span>
                Online
              </div>
            </div>
            <div className="genie-body">
              <p>
                Get instant answers to your questions about device management,
                user accounts, network issues, and more. Spectra Genie is available
                24/7 to help you.
              </p>
              <div className="genie-features">
                <span><FaMagic /> Instant Responses</span>
                <span><FaComments /> Natural Language</span>
                <span><FaClock /> 24/7 Available</span>
              </div>
            </div>
            <button className="genie-launch-btn" onClick={() => openSpectraGenie()}>
              <FaRobot />
              Chat with Spectra Genie
            </button>
          </div>

          {/* Quick Help Topics */}
          <div className="help-topics-section">
            <h3>Quick Help Topics</h3>
            <p className="section-subtitle">Click on a topic to view guides and documentation in the Knowledge Center</p>
            <div className="help-topics-grid">
              {helpTopics.map((topic, index) => (
                <button
                  key={index}
                  className="help-topic-card"
                  onClick={() => handleHelpTopic(topic)}
                >
                  <div className="topic-icon">
                    <topic.icon />
                  </div>
                  <div className="topic-content">
                    <h4>{topic.title}</h4>
                    <p>{topic.description}</p>
                  </div>
                  <div className="topic-arrow">
                    <FaArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="contact-sidebar">
          <h3>Contact Support</h3>

          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon phone">
                <FaPhone />
              </div>
              <div className="contact-info">
                <span className="contact-label">24/7 Helpline</span>
                <a href={`tel:${supportInfo.phone.replace(/\s/g, '')}`} className="contact-value">
                  {supportInfo.phone}
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon email">
                <FaEnvelope />
              </div>
              <div className="contact-info">
                <span className="contact-label">Email Support</span>
                <a href={`mailto:${supportInfo.email}`} className="contact-value">
                  {supportInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon whatsapp">
                <FaWhatsapp />
              </div>
              <div className="contact-info">
                <span className="contact-label">WhatsApp</span>
                <span className="contact-value">{supportInfo.whatsapp}</span>
              </div>
            </div>
          </div>

          <div className="support-hours">
            <div className="hours-header">
              <FaClock />
              <span>Support Hours</span>
            </div>
            <div className="hours-content">
              <p><strong>Phone:</strong> {supportInfo.hours.phone}</p>
              <p><strong>Email:</strong> {supportInfo.hours.email}</p>
              <p><strong>WhatsApp:</strong> {supportInfo.hours.whatsapp}</p>
            </div>
          </div>

          <div className="ticket-info">
            <div className="info-header">
              <FaTicketAlt />
              <span>Raise Support Ticket</span>
            </div>
            <div className="ticket-content">
              <p>For complex issues, email us with:</p>
              <ul>
                <li>Company: <strong>{currentUser?.companyName || 'Your Company'}</strong></li>
                <li>Site: <strong>{currentSite?.name || currentUser?.siteName || 'All Sites'}</strong></li>
                <li>Description of the issue</li>
                <li>Screenshots (if applicable)</li>
              </ul>
              <a
                href={`mailto:${supportInfo.email}?subject=Support Request - ${currentUser?.companyName || 'Company'}&body=Company: ${currentUser?.companyName || ''}%0ASite: ${currentSite?.name || currentUser?.siteName || ''}%0A%0ADescription:%0A`}
                className="btn btn-outline-primary"
              >
                <FaEnvelope />
                Send Email
              </a>
            </div>
          </div>

          {/* Knowledge Center Link */}
          <div className="knowledge-link-card">
            <div className="info-header">
              <FaBook />
              <span>Knowledge Center</span>
            </div>
            <p>Browse FAQs, guides, and documentation</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/knowledge')}
            >
              <FaBook />
              Visit Knowledge Center
              <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
            </button>
          </div>

          <div className="ai-disclaimer">
            <FaInfoCircle />
            <p>
              Spectra Genie is an AI assistant for common queries. For critical network issues
              or account changes, please contact our support team directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
