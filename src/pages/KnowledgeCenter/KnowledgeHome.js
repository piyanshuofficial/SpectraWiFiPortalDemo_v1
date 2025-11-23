// src/pages/KnowledgeCenter/KnowledgeHome.js

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaBookOpen, FaVideo, FaQuestionCircle, FaArrowLeft, FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';
import SkeletonLoader from '../../components/Loading/SkeletonLoader';
import KnowledgeArticleModal from '../../components/KnowledgeArticleModal';
import VideoPlayer from '../../components/VideoPlayer';
import { getArticle } from '../../constants/knowledgeArticles';
import { ANIMATION } from '../../constants/appConstants';
import './KnowledgeHome.css';

// Section views
const SECTION_VIEWS = {
  HOME: 'home',
  GETTING_STARTED: 'getting-started',
  VIDEO_TUTORIALS: 'video-tutorials',
  FAQ: 'faq'
};

const KnowledgeHome = () => {
  const [supportHighlight, setSupportHighlight] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentView, setCurrentView] = useState(SECTION_VIEWS.HOME);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState(new Set());
  const [selectedVideo, setSelectedVideo] = useState(null);
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

  // Handler functions for navigation
  const handleSectionClick = (section) => {
    setCurrentView(section);
    setSearchTerm(''); // Clear search when switching sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView(SECTION_VIEWS.HOME);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    // When search is triggered, stay on current view or navigate to most relevant section
    // If on home page and there's a search term, we'll show filtered results on home page
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Search results will be shown automatically via filtered content
    }
  };

  const toggleFAQ = (faqId) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  // Getting Started Articles - All existing articles organized by category
  // Only includes articles that exist in knowledgeArticles.js constants
  const gettingStartedArticles = useMemo(() => [
    // User Management
    {
      id: 'adding-new-users',
      category: 'User Management',
      title: 'Adding New Users',
      description: 'Learn how to create user accounts, assign appropriate policies, and manage user credentials effectively'
    },
    {
      id: 'user-policies-licenses',
      category: 'User Management',
      title: 'User Policies & Licenses',
      description: 'Configure speed limits, data volumes, device limits, and data cycle types for users and monitor license utilization'
    },
    {
      id: 'bulk-user-operations',
      category: 'User Management',
      title: 'Bulk User Operations',
      description: 'Import multiple users from CSV files, perform batch updates, and export user data for reporting and compliance'
    },
    {
      id: 'user-status-management',
      category: 'User Management',
      title: 'User Status Management',
      description: 'Activate, suspend, or block users, manage user credentials, and handle password resets for your organization'
    },
    // Device Management
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Device Registration',
      description: 'Register new devices with MAC address binding, assign devices to users, and configure human vs non-human device types'
    },
    {
      id: 'device-registration', // Reuse existing article
      category: 'Device Management',
      title: 'Device Assignment & Tracking',
      description: 'Assign registered devices to users, track device connection history, and monitor data usage per device'
    },
    {
      id: 'troubleshooting-connection', // Reuse existing article
      category: 'Device Management',
      title: 'Device Connectivity Issues',
      description: 'Troubleshoot device connection problems, authentication failures, and MAC address binding errors'
    },
    {
      id: 'segment-configuration', // Reuse existing article
      category: 'Device Management',
      title: 'Device Type Configuration',
      description: 'Configure device limits per user and set device type restrictions to optimize network performance and security'
    },
    // Reports & Analytics
    {
      id: 'dashboard-overview',
      category: 'Reports & Analytics',
      title: 'Dashboard Overview',
      description: 'Understand key metrics: active users, license usage, data consumption, alerts, and network analytics at a glance'
    },
    {
      id: 'generating-reports',
      category: 'Reports & Analytics',
      title: 'Generating Reports',
      description: 'Create billing reports, usage summaries, network analytics, and SLA compliance reports with customizable date ranges'
    },
    {
      id: 'generating-reports', // Reuse existing article
      category: 'Reports & Analytics',
      title: 'Report Criteria & Filters',
      description: 'Apply date ranges, month ranges, policy filters, and status filters to generate targeted reports for your needs'
    },
    {
      id: 'generating-reports', // Reuse existing article
      category: 'Reports & Analytics',
      title: 'Export & Data Analysis',
      description: 'Export reports in CSV and PDF formats, analyze usage trends, and share insights with stakeholders'
    },
    // Network Configuration
    {
      id: 'policy-setup',
      category: 'Network Configuration',
      title: 'Policy Setup',
      description: 'Create and manage user policies with speed limits (10-50 Mbps), data volume caps, device limits, and data cycle configurations'
    },
    {
      id: 'segment-configuration',
      category: 'Network Configuration',
      title: 'Advanced Network Configuration',
      description: 'Configure device restrictions, license capacity, access controls, and performance optimization settings'
    },
    {
      id: 'dashboard-overview', // Reuse existing article
      category: 'Network Configuration',
      title: 'Network Analytics',
      description: 'Monitor bandwidth utilization, track network usage patterns, analyze data consumption trends, and view network health metrics'
    },
    {
      id: 'user-policies-licenses', // Reuse existing article
      category: 'Network Configuration',
      title: 'License Management',
      description: 'Monitor license utilization, manage license allocation capacity, and configure alerts for license thresholds'
    },
    // Troubleshooting
    {
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'User Connection Issues',
      description: 'Resolve common login problems, authentication failures, password reset issues, and user account access errors'
    },
    {
      id: 'device-registration', // Reuse existing article
      category: 'Troubleshooting',
      title: 'Device Registration Problems',
      description: 'Troubleshoot MAC address binding errors, device visibility issues, and device registration constraints'
    },
    {
      id: 'generating-reports', // Reuse existing article
      category: 'Troubleshooting',
      title: 'Report Generation Errors',
      description: 'Fix issues with report criteria validation, data export failures, and PDF generation problems'
    },
    {
      id: 'user-policies-licenses', // Reuse existing article
      category: 'Troubleshooting',
      title: 'License & Access Issues',
      description: 'Address license exhaustion warnings, permission-related errors, and role-based access control problems'
    },
    // Best Practices
    {
      id: 'user-policies-licenses', // Reuse existing article
      category: 'Best Practices',
      title: 'License Management Best Practices',
      description: 'Optimize license allocation, monitor usage trends, plan capacity upgrades, and avoid service disruptions'
    },
    {
      id: 'user-status-management', // Reuse existing article
      category: 'Best Practices',
      title: 'User Account Lifecycle',
      description: 'Best practices for managing user accounts, handling suspensions and blocks, and maintaining account security'
    },
    {
      id: 'bulk-user-operations', // Reuse existing article
      category: 'Best Practices',
      title: 'Data Management',
      description: 'Regular data exports, backup strategies, compliance reporting, and CSV import/export best practices'
    },
    {
      id: 'policy-setup', // Reuse existing article
      category: 'Best Practices',
      title: 'Policy Optimization',
      description: 'Design effective policies, balance user load with tiered service levels, and optimize network performance'
    }
  ], []);

  // FAQ Data - Organized by category (memoized to prevent recreation on every render)
  const faqData = useMemo(() => [
    {
      id: 'faq-1',
      category: 'License Management',
      question: 'How do I check my current license usage?',
      answer: 'You can view your license usage on the Dashboard or in the User Management page. The license ring display shows current usage out of total licenses. Navigate to Dashboard > Overview to see real-time license metrics.'
    },
    {
      id: 'faq-2',
      category: 'License Management',
      question: 'What happens when I reach my license limit?',
      answer: 'When you reach your license limit, you will not be able to add new users until licenses become available. You can either upgrade your license capacity or remove inactive users to free up licenses.'
    },
    {
      id: 'faq-3',
      category: 'User Policies',
      question: 'How do I create a new user policy?',
      answer: 'Navigate to Configuration > Policy Setup, click "Create New Policy", enter a policy name, configure speed limits (10-50 Mbps), data volume caps, device limits per user, and data cycle type (Daily/Weekly/Monthly). Save the policy to make it available for user assignment.'
    },
    {
      id: 'faq-4',
      category: 'User Policies',
      question: 'Can I assign different policies to different users?',
      answer: 'Yes, you can assign different policies to each user based on their needs. When creating or editing a user, select the appropriate policy from the dropdown menu. This allows you to provide tiered service levels.'
    },
    {
      id: 'faq-5',
      category: 'Device Registration',
      question: 'How do I register a new device?',
      answer: 'Go to Device Management, click "Register Device", enter the MAC address, select device type (Human/Non-Human), choose owner from the user list, optionally enter a device name, and click "Register". The device will be bound to the user account.'
    },
    {
      id: 'faq-6',
      category: 'Device Registration',
      question: 'What is the difference between Human and Non-Human devices?',
      answer: 'Human devices are user-operated devices like smartphones, laptops, and tablets. Non-Human devices are IoT devices, smart TVs, printers, and other automated devices. Some segments restrict certain device types for security and performance reasons.'
    },
    {
      id: 'faq-7',
      category: 'Reports',
      question: 'How do I generate a custom report?',
      answer: 'Navigate to Reports, select a report category, click on the specific report you need, configure criteria (date range, filters), preview the data, and use "Export CSV" or "Export PDF" buttons to download the report in your preferred format.'
    },
    {
      id: 'faq-8',
      category: 'Reports',
      question: 'Can I schedule automated reports?',
      answer: 'Automated report scheduling is a planned feature. Currently, you can manually generate and export reports as needed. Contact support for bulk reporting requirements or custom report automation.'
    },
    {
      id: 'faq-9',
      category: 'Troubleshooting',
      question: 'User cannot connect to WiFi. What should I check?',
      answer: 'Verify: 1) User status is Active (not Blocked/Suspended), 2) Device is registered with correct MAC address, 3) User has not exceeded device limit, 4) License is available, 5) Policy allows connectivity, 6) Check Recent Activities for any errors.'
    },
    {
      id: 'faq-10',
      category: 'Troubleshooting',
      question: 'Device registration fails with MAC address error?',
      answer: 'Ensure MAC address format is correct (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX). Check that the MAC address is not already registered. Verify device type is allowed for the user\'s segment. Some segments restrict non-human devices.'
    }
  ], []);

  // Video Tutorial Data (memoized to prevent recreation on every render)
  // Note: Video files should be placed in src/assets/videos/ folder
  // If video file doesn't exist, a placeholder message will be shown
  const videoData = useMemo(() => [
    {
      id: 'video-1',
      title: 'Getting Started with WiFi Portal',
      description: 'Learn the basics of navigating the portal, understanding the dashboard, and managing users.',
      duration: '8:45',
      category: 'Getting Started',
      videoFile: 'getting-started.mp4'
    },
    {
      id: 'video-2',
      title: 'Adding and Managing Users',
      description: 'Step-by-step guide on creating user accounts, assigning policies, and managing user credentials.',
      duration: '12:30',
      category: 'User Management',
      videoFile: 'user-management.mp4'
    },
    {
      id: 'video-3',
      title: 'Device Registration Process',
      description: 'Complete walkthrough of registering devices, MAC address binding, and device assignment.',
      duration: '10:15',
      category: 'Device Management',
      videoFile: 'device-registration.mp4'
    },
    {
      id: 'video-4',
      title: 'Creating and Managing Policies',
      description: 'Learn how to create policies, set speed limits, data caps, and device limits.',
      duration: '15:20',
      category: 'Configuration',
      videoFile: 'policy-setup.mp4'
    },
    {
      id: 'video-5',
      title: 'Generating Reports and Analytics',
      description: 'Discover how to generate reports, apply filters, and export data for analysis.',
      duration: '11:50',
      category: 'Reports',
      videoFile: 'reports.mp4'
    },
    {
      id: 'video-6',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions for common connectivity problems, device registration errors, and user access issues.',
      duration: '9:30',
      category: 'Troubleshooting',
      videoFile: 'troubleshooting.mp4'
    }
  ], []);

  // Random selection logic - generates different content on each visit/refresh
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Preview content for home page (randomized on each render)
  const previewGettingStarted = useMemo(() => getRandomItems(gettingStartedArticles, 3), [gettingStartedArticles]);
  const previewVideos = useMemo(() => getRandomItems(videoData, 3), [videoData]);
  const previewFAQs = useMemo(() => getRandomItems(faqData, 3), [faqData]);

  // Filter content based on search term
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return gettingStartedArticles;
    const term = searchTerm.toLowerCase();
    return gettingStartedArticles.filter(article =>
      article.title.toLowerCase().includes(term) ||
      article.description.toLowerCase().includes(term) ||
      article.category.toLowerCase().includes(term)
    );
  }, [searchTerm, gettingStartedArticles]);

  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqData;
    const term = searchTerm.toLowerCase();
    return faqData.filter(faq =>
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term) ||
      faq.category.toLowerCase().includes(term)
    );
  }, [searchTerm, faqData]); // faqData is now stable (memoized with empty deps)

  const filteredVideos = useMemo(() => {
    if (!searchTerm) return videoData;
    const term = searchTerm.toLowerCase();
    return videoData.filter(video =>
      video.title.toLowerCase().includes(term) ||
      video.description.toLowerCase().includes(term) ||
      video.category.toLowerCase().includes(term)
    );
  }, [searchTerm, videoData]); // videoData is now stable (memoized with empty deps)

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="knowledge-search-btn" onClick={handleSearch}>Search</button>
      </div>

      {/* Back button - shown when in a section view */}
      {currentView !== SECTION_VIEWS.HOME && (
        <button className="knowledge-back-btn" onClick={handleBackToHome}>
          <FaArrowLeft /> Back to Knowledge Center
        </button>
      )}

      {/* Home View - Feature Cards */}
      {currentView === SECTION_VIEWS.HOME && (
        <div className="knowledge-feature-cards">
          <div
            className="knowledge-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.GETTING_STARTED)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSectionClick(SECTION_VIEWS.GETTING_STARTED)}
          >
            <FaBookOpen className="feature-icon" />
            <div className="feature-title">Getting Started</div>
            <div className="feature-desc">Quick start guides for portal setup, user onboarding, and initial configuration of your WiFi management system</div>
          </div>
          <div
            className="knowledge-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.VIDEO_TUTORIALS)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSectionClick(SECTION_VIEWS.VIDEO_TUTORIALS)}
          >
            <FaVideo className="feature-icon" />
            <div className="feature-title">Video Tutorials</div>
            <div className="feature-desc">Watch step-by-step video walkthroughs for managing users, devices, generating reports, and monitoring network performance</div>
          </div>
          <div
            className="knowledge-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.FAQ)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSectionClick(SECTION_VIEWS.FAQ)}
          >
            <FaQuestionCircle className="feature-icon" />
            <div className="feature-title">FAQ</div>
            <div className="feature-desc">Answers to frequently asked questions about license management, user policies, device registration, and report generation</div>
          </div>
        </div>
      )}

      {/* Home View - Preview Sections with Random Content or Search Results */}
      {currentView === SECTION_VIEWS.HOME && (
        <>
          {/* Show search results summary if searching */}
          {searchTerm && (
            <div className="search-results-summary">
              <p className="search-results-text">
                Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}, {' '}
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}, and {' '}
                {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Getting Started Preview */}
          {(searchTerm ? filteredArticles.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Getting Started
                  {searchTerm && ` (${filteredArticles.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.GETTING_STARTED)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-cards-grid">
                {(searchTerm ? filteredArticles.slice(0, 6) : previewGettingStarted).map((article, idx) => (
                  <div
                    key={`${article.id}-${idx}`}
                    className="preview-card clickable"
                    onClick={() => handleArticleClick(article.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleArticleClick(article.id)}
                  >
                    <span className="preview-card-category">{article.category}</span>
                    <h3 className="preview-card-title">{article.title}</h3>
                    <p className="preview-card-description">{article.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Tutorials Preview */}
          {(searchTerm ? filteredVideos.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Video Tutorials
                  {searchTerm && ` (${filteredVideos.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.VIDEO_TUTORIALS)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-cards-grid">
                {(searchTerm ? filteredVideos.slice(0, 6) : previewVideos).map((video, idx) => (
                  <div
                    key={`${video.id}-${idx}`}
                    className="preview-card video-preview clickable"
                    onClick={() => handleVideoClick(video)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleVideoClick(video)}
                  >
                    <div className="preview-video-thumbnail">
                      <div className="preview-video-icon"><FaPlay /></div>
                      <span className="preview-video-duration">{video.duration}</span>
                    </div>
                    <span className="preview-card-category">{video.category}</span>
                    <h3 className="preview-card-title">{video.title}</h3>
                    <p className="preview-card-description">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Preview */}
          {(searchTerm ? filteredFAQs.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Frequently Asked Questions
                  {searchTerm && ` (${filteredFAQs.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.FAQ)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-faq-list">
                {(searchTerm ? filteredFAQs.slice(0, 6) : previewFAQs).map((faq, idx) => (
                  <div
                    key={`${faq.id}-${idx}`}
                    className="preview-faq-item clickable"
                    onClick={() => {
                      setCurrentView(SECTION_VIEWS.FAQ);
                      setExpandedFAQs(new Set([faq.id]));
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentView(SECTION_VIEWS.FAQ);
                        setExpandedFAQs(new Set([faq.id]));
                      }
                    }}
                  >
                    <span className="preview-faq-category">{faq.category}</span>
                    <h3 className="preview-faq-question">{faq.question}</h3>
                    <p className="preview-faq-answer-snippet">{faq.answer.substring(0, 120)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchTerm && filteredArticles.length === 0 && filteredVideos.length === 0 && filteredFAQs.length === 0 && (
            <div className="no-search-results">
              <h3>No results found for "{searchTerm}"</h3>
              <p>Try different keywords or browse our categories above.</p>
            </div>
          )}
        </>
      )}

      {/* Getting Started Section View - Full Articles List */}
      {currentView === SECTION_VIEWS.GETTING_STARTED && (
        <>
          <h2 className="section-view-title">Getting Started - Quick Start Guide</h2>

          {/* Show search results count if searching */}
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}

          {/* Organize articles by category */}
          {filteredArticles.length > 0 ? (
            ['User Management', 'Device Management', 'Reports & Analytics', 'Network Configuration', 'Troubleshooting', 'Best Practices'].map(category => {
              const categoryArticles = filteredArticles.filter(article => article.category === category);
              if (categoryArticles.length === 0) return null;

              return (
                <div key={category} className="knowledge-block" style={{ marginBottom: '1.5rem' }}>
                  <div className="block-title">{category}</div>
                  {categoryArticles.map((article, idx) => (
                    <div
                      key={`${article.id}-${idx}`}
                      className="block-entry clickable"
                      onClick={() => handleArticleClick(article.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleArticleClick(article.id)}
                    >
                      <b>{article.title}</b><br />
                      {article.description}
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="no-search-results">
              <h3>No articles found</h3>
              <p>Try different keywords or clear your search.</p>
            </div>
          )}
        </>
      )}

      {/* Remove old home view article blocks - now replaced by preview sections above */}
      {false && (
        <>
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
        </>
      )}

      {/* Video Tutorials Section View */}
      {currentView === SECTION_VIEWS.VIDEO_TUTORIALS && (
        <>
          <h2 className="section-view-title">Video Tutorials</h2>
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="video-tutorials-grid">
            {filteredVideos.map(video => (
              <div key={video.id} className="video-tutorial-card" onClick={() => handleVideoClick(video)} role="button" tabIndex={0}>
                <div className="video-thumbnail">
                  <div className="video-placeholder-icon">
                    <FaPlay />
                  </div>
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-content">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-category">{video.category}</p>
                  <p className="video-description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FAQ Section View */}
      {currentView === SECTION_VIEWS.FAQ && (
        <>
          <h2 className="section-view-title">Frequently Asked Questions</h2>
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="faq-container">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className={`faq-item ${expandedFAQs.has(faq.id) ? 'expanded' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && toggleFAQ(faq.id)}
                >
                  <span className="faq-category-badge">{faq.category}</span>
                  <h3>{faq.question}</h3>
                  {expandedFAQs.has(faq.id) ? <FaChevronUp className="faq-icon" /> : <FaChevronDown className="faq-icon" />}
                </div>
                {expandedFAQs.has(faq.id) && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video Modal with Custom Player */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <VideoPlayer
              src={`${process.env.PUBLIC_URL}/assets/videos/${selectedVideo.videoFile}`}
              title={selectedVideo.title}
              onClose={handleCloseVideo}
            />
            <div className="video-modal-info">
              <p><strong>Category:</strong> {selectedVideo.category}</p>
              <p><strong>Duration:</strong> {selectedVideo.duration}</p>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

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