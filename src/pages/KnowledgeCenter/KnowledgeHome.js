// src/pages/KnowledgeCenter/KnowledgeHome.js

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaBookOpen, FaVideo, FaQuestionCircle, FaArrowLeft, FaChevronDown, FaChevronUp, FaPlay, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SkeletonLoader from '../../components/Loading/SkeletonLoader';
import KnowledgeArticleModal from '../../components/KnowledgeArticleModal';
import VideoPlayer from '../../components/VideoPlayer';
import { getArticle } from '../../constants/knowledgeArticles';
import { ANIMATION } from '../../constants/appConstants';
import { useSegment, SEGMENTS } from '../../context/SegmentContext';
import { useAccessLevelView } from '../../context/AccessLevelViewContext';
import { useVideoDurations } from '../../hooks';
import './KnowledgeHome.css';

// Section views
const SECTION_VIEWS = {
  HOME: 'home',
  GETTING_STARTED: 'getting-started',
  VIDEO_TUTORIALS: 'video-tutorials',
  FAQ: 'faq'
};

const KnowledgeHome = () => {
  const { currentSegment } = useSegment();
  const { isCompanyView } = useAccessLevelView();
  const { t } = useTranslation();
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

        // Auto-remove highlight after 3 seconds
        setTimeout(() => {
          setSupportHighlight(false);
        }, 3000);
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

      // Auto-remove highlight after 3 seconds
      setTimeout(() => {
        setSupportHighlight(false);
      }, 3000);
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

  // Segment-Specific Getting Started Articles
  // Only includes articles that exist in knowledgeArticles.js constants
  const segmentArticles = useMemo(() => ({
    [SEGMENTS.ENTERPRISE]: [
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
      description: 'Register new devices with MAC address binding, assign devices to users, and configure user vs digital device types'
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
      description: 'Design effective policies for enterprise networks, balance user load with tiered service levels, and optimize network performance'
    }
  ],
  [SEGMENTS.CO_LIVING]: [
    {
      id: 'adding-new-users',
      category: 'User Management',
      title: 'Resident Onboarding',
      description: 'Quickly onboard new residents with self-service registration, automated policy assignment, and device registration workflows'
    },
    {
      id: 'user-policies-licenses',
      category: 'User Management',
      title: 'Resident Internet Plans',
      description: 'Configure tiered internet plans for residents with varying speeds, data limits, and device allowances based on room types'
    },
    {
      id: 'bulk-user-operations',
      category: 'User Management',
      title: 'Bulk Resident Management',
      description: 'Import resident data from CSV, manage move-ins and move-outs in bulk, and handle seasonal resident changes efficiently'
    },
    {
      id: 'user-status-management',
      category: 'User Management',
      title: 'Managing Resident Access',
      description: 'Control resident WiFi access during move-in/move-out, suspend access for non-payment, and handle visitor credentials'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Resident Device Registration',
      description: 'Allow residents to self-register mobile phones, laptops, smart TVs, and streaming devices with automated MAC binding'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Common Area Device Setup',
      description: 'Configure shared devices in common areas like smart TVs, printers, and IoT devices with appropriate access controls'
    },
    {
      id: 'dashboard-overview',
      category: 'Reports & Analytics',
      title: 'Occupancy & Usage Dashboard',
      description: 'Monitor resident WiFi usage patterns, peak usage times, bandwidth consumption by floor/building, and occupancy metrics'
    },
    {
      id: 'generating-reports',
      category: 'Reports & Analytics',
      title: 'Resident Usage Reports',
      description: 'Generate reports for billing reconciliation, fair usage policy enforcement, and resident support tickets'
    },
    {
      id: 'policy-setup',
      category: 'Network Configuration',
      title: 'Tiered Internet Plans',
      description: 'Create basic, standard, and premium internet plans with different speeds (10-50 Mbps) and data allowances for residents'
    },
    {
      id: 'segment-configuration',
      category: 'Network Configuration',
      title: 'Building Network Setup',
      description: 'Configure network segmentation by floors/buildings, set bandwidth allocation per unit, and optimize shared bandwidth'
    },
    {
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'Resident Connection Issues',
      description: 'Resolve common resident WiFi problems including weak signal, slow speeds, device limit reached, and authentication failures'
    },
    {
      id: 'user-policies-licenses',
      category: 'Best Practices',
      title: 'Fair Usage Policies',
      description: 'Implement fair usage policies to prevent bandwidth hogging, manage peak hour congestion, and ensure quality for all residents'
    }
  ],
  [SEGMENTS.HOTEL]: [
    {
      id: 'adding-new-users',
      category: 'Guest Management',
      title: 'Guest WiFi Access',
      description: 'Provide seamless WiFi access to hotel guests via room number, voucher codes, or automated check-in integration'
    },
    {
      id: 'user-policies-licenses',
      category: 'Guest Management',
      title: 'Guest Internet Packages',
      description: 'Offer complimentary basic WiFi and premium high-speed upgrades for business travelers and VIP guests'
    },
    {
      id: 'bulk-user-operations',
      category: 'Guest Management',
      title: 'Bulk Guest Credentials',
      description: 'Generate WiFi vouchers in bulk for events, conferences, and group bookings with customizable expiry times'
    },
    {
      id: 'user-status-management',
      category: 'Guest Management',
      title: 'Check-Out WiFi Management',
      description: 'Automatically expire guest WiFi access on check-out, extend access for late check-outs, and handle early arrivals'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Guest Device Registration',
      description: 'Allow guests to register multiple devices easily, support smart room controls, and manage streaming device access'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Hotel IoT Devices',
      description: 'Manage smart room devices, digital signage, POS systems, and hotel management systems on a separate secure network'
    },
    {
      id: 'dashboard-overview',
      category: 'Reports & Analytics',
      title: 'Guest Satisfaction Analytics',
      description: 'Track WiFi usage patterns, connection success rates, bandwidth quality, and guest satisfaction metrics'
    },
    {
      id: 'generating-reports',
      category: 'Reports & Analytics',
      title: 'Hotel WiFi Reports',
      description: 'Generate occupancy-linked WiFi reports, premium upgrade revenue, bandwidth usage by floor, and SLA compliance'
    },
    {
      id: 'policy-setup',
      category: 'Network Configuration',
      title: 'Hotel WiFi Tiers',
      description: 'Configure complimentary basic WiFi and premium high-speed tiers with differentiated speeds and device limits'
    },
    {
      id: 'segment-configuration',
      category: 'Network Configuration',
      title: 'Hotel Network Segmentation',
      description: 'Separate guest WiFi, staff networks, back-office systems, and IoT devices for security and performance'
    },
    {
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'Guest WiFi Support',
      description: 'Quick troubleshooting for guest WiFi issues, voucher problems, device connection failures, and coverage concerns'
    },
    {
      id: 'user-policies-licenses',
      category: 'Best Practices',
      title: 'Hotel WiFi Best Practices',
      description: 'Ensure high availability, fast connection speeds, seamless roaming between floors, and excellent guest experience'
    }
  ],
  [SEGMENTS.CO_WORKING]: [
    {
      id: 'adding-new-users',
      category: 'Member Management',
      title: 'Member Onboarding',
      description: 'Onboard coworking members with flexible plans, day passes, hot desk access, and dedicated desk WiFi credentials'
    },
    {
      id: 'user-policies-licenses',
      category: 'Member Management',
      title: 'Membership Internet Plans',
      description: 'Create membership tiers with varying bandwidth, priority access, dedicated bandwidth for private offices, and day pass limits'
    },
    {
      id: 'bulk-user-operations',
      category: 'Member Management',
      title: 'Bulk Member Management',
      description: 'Import member rosters, manage corporate team accounts, handle membership renewals, and visitor day pass generation'
    },
    {
      id: 'user-status-management',
      category: 'Member Management',
      title: 'Membership Access Control',
      description: 'Manage active memberships, suspend for non-payment, provide guest day passes, and handle membership upgrades/downgrades'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Member Device Registration',
      description: 'Support multiple work devices per member including laptops, phones, tablets, and allow BYOD with secure access'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Coworking Space Devices',
      description: 'Manage shared printers, conference room equipment, digital displays, and access control systems on separate networks'
    },
    {
      id: 'dashboard-overview',
      category: 'Reports & Analytics',
      title: 'Space Utilization Analytics',
      description: 'Track member WiFi usage, peak occupancy times, bandwidth consumption by area, and space utilization patterns'
    },
    {
      id: 'generating-reports',
      category: 'Reports & Analytics',
      title: 'Member Usage Reports',
      description: 'Generate member activity reports, bandwidth usage for billing, network performance metrics, and compliance reports'
    },
    {
      id: 'policy-setup',
      category: 'Network Configuration',
      title: 'Flexible Member Plans',
      description: 'Create day pass, hot desk, dedicated desk, and private office plans with appropriate bandwidth and priority levels'
    },
    {
      id: 'segment-configuration',
      category: 'Network Configuration',
      title: 'Coworking Network Setup',
      description: 'Configure network zones by area, prioritize bandwidth for private offices, ensure quality video conferencing capability'
    },
    {
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'Member Connectivity Issues',
      description: 'Troubleshoot member connection problems, VPN compatibility issues, video call quality, and device authentication'
    },
    {
      id: 'user-policies-licenses',
      category: 'Best Practices',
      title: 'Professional WiFi Standards',
      description: 'Maintain reliable high-speed connectivity, support video conferencing, provide secure networks, and ensure business continuity'
    }
  ],
  [SEGMENTS.PG]: [
    {
      id: 'adding-new-users',
      category: 'Tenant Management',
      title: 'Tenant Registration',
      description: 'Register new PG tenants with room-based access, create tenant credentials, and assign appropriate internet plans'
    },
    {
      id: 'user-policies-licenses',
      category: 'Tenant Management',
      title: 'PG Internet Plans',
      description: 'Configure affordable tenant plans with fair data limits, speed restrictions during peak hours, and shared bandwidth models'
    },
    {
      id: 'bulk-user-operations',
      category: 'Tenant Management',
      title: 'Bulk Tenant Operations',
      description: 'Import tenant lists, manage room changes, handle semester-based renewals, and process batch tenant updates'
    },
    {
      id: 'user-status-management',
      category: 'Tenant Management',
      title: 'Tenant Access Management',
      description: 'Control tenant WiFi access, suspend for rent pending, manage vacating tenants, and handle temporary visitors'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Tenant Device Limits',
      description: 'Enforce device limits per tenant to ensure fair bandwidth distribution and prevent network abuse'
    },
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Common Area WiFi',
      description: 'Set up WiFi for common areas like lounges, kitchens, and study rooms with separate bandwidth allocation'
    },
    {
      id: 'dashboard-overview',
      category: 'Reports & Analytics',
      title: 'PG Usage Monitoring',
      description: 'Monitor bandwidth consumption by floor/room, identify heavy users, track peak usage times, and ensure fair distribution'
    },
    {
      id: 'generating-reports',
      category: 'Reports & Analytics',
      title: 'Tenant Usage Reports',
      description: 'Generate monthly usage reports for tenants, identify bandwidth violations, and create fair usage policy reports'
    },
    {
      id: 'policy-setup',
      category: 'Network Configuration',
      title: 'PG Bandwidth Plans',
      description: 'Create cost-effective plans with moderate speeds, data caps, and time-based restrictions for fair distribution'
    },
    {
      id: 'segment-configuration',
      category: 'Network Configuration',
      title: 'PG Network Configuration',
      description: 'Configure per-room bandwidth limits, floor-wise segmentation, and implement fair usage policies for shared internet'
    },
    {
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'Tenant WiFi Issues',
      description: 'Resolve tenant connectivity problems, handle bandwidth complaints, troubleshoot device registration issues'
    },
    {
      id: 'user-policies-licenses',
      category: 'Best Practices',
      title: 'Fair Internet Distribution',
      description: 'Ensure fair bandwidth distribution among tenants, prevent network abuse, and maintain cost-effective operations'
    }
  ],
  [SEGMENTS.MISCELLANEOUS]: [
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
    {
      id: 'device-registration',
      category: 'Device Management',
      title: 'Device Registration',
      description: 'Register new devices with MAC address binding, assign devices to users, and configure user vs digital device types'
    },
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
      id: 'troubleshooting-connection',
      category: 'Troubleshooting',
      title: 'User Connection Issues',
      description: 'Resolve common login problems, authentication failures, password reset issues, and user account access errors'
    }
  ]
}), []);

  // Company-level specific articles (shown when in company view)
  const companyArticles = useMemo(() => [
    // Multi-Site Management
    {
      id: 'dashboard-overview',
      category: 'Multi-Site Management',
      title: 'Company Dashboard Overview',
      description: 'View aggregated metrics across all sites including total users, devices, license utilization, and network health at a glance'
    },
    {
      id: 'generating-reports',
      category: 'Multi-Site Management',
      title: 'Cross-Site Analytics',
      description: 'Compare performance metrics, user activity, and resource utilization across different sites in your organization'
    },
    {
      id: 'user-policies-licenses',
      category: 'Multi-Site Management',
      title: 'Company-Wide License Management',
      description: 'Monitor license allocation across sites, track company-wide utilization, and plan capacity for multi-site deployments'
    },
    {
      id: 'bulk-user-operations',
      category: 'Multi-Site Management',
      title: 'Site Navigation & Drill-Down',
      description: 'Navigate between company overview and individual sites, drill down to site-specific details for operational tasks'
    },
    // Company Reports
    {
      id: 'generating-reports',
      category: 'Company Reports',
      title: 'Consolidated Company Reports',
      description: 'Generate company-wide reports covering all sites, including billing summaries, compliance reports, and executive dashboards'
    },
    {
      id: 'generating-reports',
      category: 'Company Reports',
      title: 'Cross-Site Usage Comparison',
      description: 'Compare bandwidth usage, user activity, and device counts across multiple sites with visual analytics'
    },
    {
      id: 'dashboard-overview',
      category: 'Company Reports',
      title: 'Company Performance Dashboard',
      description: 'Monitor key performance indicators across your organization with real-time aggregated metrics and trend analysis'
    },
    {
      id: 'generating-reports',
      category: 'Company Reports',
      title: 'Export Company Data',
      description: 'Export consolidated reports in CSV and PDF formats for executive review, compliance, and stakeholder presentations'
    },
    // Administrative Tasks
    {
      id: 'user-status-management',
      category: 'Administrative Tasks',
      title: 'View Users Across Sites',
      description: 'Browse and search users across all company sites with filtering options. Navigate to specific sites for user management actions'
    },
    {
      id: 'device-registration',
      category: 'Administrative Tasks',
      title: 'View Devices Across Sites',
      description: 'Monitor device inventory across all sites, view device status, and navigate to sites for device management tasks'
    },
    {
      id: 'policy-setup',
      category: 'Administrative Tasks',
      title: 'Company Policy Standards',
      description: 'Review policy configurations across sites to ensure consistency and compliance with company standards'
    },
    {
      id: 'segment-configuration',
      category: 'Administrative Tasks',
      title: 'Site Configuration Overview',
      description: 'View and compare network configurations across sites, identify configuration differences, and ensure standardization'
    },
    // Best Practices
    {
      id: 'user-policies-licenses',
      category: 'Best Practices',
      title: 'Multi-Site License Optimization',
      description: 'Best practices for allocating licenses across sites, balancing capacity, and planning for growth'
    },
    {
      id: 'generating-reports',
      category: 'Best Practices',
      title: 'Effective Company Reporting',
      description: 'Tips for generating meaningful company-wide reports, scheduling reviews, and tracking organizational KPIs'
    },
    {
      id: 'dashboard-overview',
      category: 'Best Practices',
      title: 'Company Monitoring Strategy',
      description: 'Establish effective monitoring practices for multi-site operations, set up alerts, and proactive management workflows'
    },
    {
      id: 'troubleshooting-connection',
      category: 'Best Practices',
      title: 'Cross-Site Issue Resolution',
      description: 'Identify and resolve issues affecting multiple sites, coordinate with site administrators, and implement company-wide fixes'
    }
  ], []);

  // Company-level specific FAQs
  const companyFAQs = useMemo(() => [
    {
      id: 'company-faq-1',
      category: 'Company View',
      question: 'What can I see in the Company View?',
      answer: 'Company View provides an aggregated overview of all sites in your organization. You can see total users, devices, license utilization across sites, company-wide reports, and cross-site analytics. Use it for executive oversight and company-level reporting.'
    },
    {
      id: 'company-faq-2',
      category: 'Company View',
      question: 'Why can\'t I add or edit users in Company View?',
      answer: 'Company View is designed for monitoring and reporting across sites. To add, edit, or manage users, you need to navigate to a specific site. Click on any site card from the dashboard or use the site selector to drill down to site-level management.'
    },
    {
      id: 'company-faq-3',
      category: 'Navigation',
      question: 'How do I switch from Company View to Site View?',
      answer: 'Click on any site card on the Dashboard, or use the site selector in the header. When viewing lists (users/devices), click on the site badge to navigate to that specific site. Use the "Back to Company View" button to return.'
    },
    {
      id: 'company-faq-4',
      category: 'Reports',
      question: 'What reports are available at the company level?',
      answer: 'Company-level reports include: Company Overview Dashboard, Cross-Site Usage Comparison, Consolidated Billing Report, Company License Utilization, Company User Distribution, and Company Alerts Summary. These provide aggregated data across all your sites.'
    },
    {
      id: 'company-faq-5',
      category: 'Reports',
      question: 'Can I export company-wide data?',
      answer: 'Yes, all company-level reports can be exported in CSV and PDF formats. The exports include data from all sites with site identifiers, making it easy to analyze multi-site operations in external tools.'
    },
    {
      id: 'company-faq-6',
      category: 'License Management',
      question: 'How do I view license usage across all sites?',
      answer: 'The Dashboard shows aggregated license metrics. For detailed breakdown, go to Reports > Company License Utilization to see per-site license allocation, usage percentages, and capacity planning recommendations.'
    },
    {
      id: 'company-faq-7',
      category: 'Site Management',
      question: 'Can I compare performance between sites?',
      answer: 'Yes, use the Cross-Site Usage Comparison report to compare bandwidth usage, user counts, device counts, and activity levels between sites. The Dashboard also shows site cards with key metrics for quick comparison.'
    },
    {
      id: 'company-faq-8',
      category: 'Access Control',
      question: 'What permissions do Company Admins have vs Site Admins?',
      answer: 'Company Admins can view all sites, generate company-wide reports, and drill down to any site for management. Site Admins only see their assigned site. Company Admins have edit capabilities when drilled down to a site view.'
    }
  ], []);

  // Company-level specific videos
  const companyVideos = useMemo(() => [
    {
      id: 'company-video-1',
      title: 'Company Dashboard Overview',
      description: 'Learn how to use the company dashboard to monitor all sites, view aggregated metrics, and quickly identify issues across your organization.',
      duration: '7:30',
      category: 'Getting Started',
      videoFile: 'company/dashboard-overview.mp4'
    },
    {
      id: 'company-video-2',
      title: 'Navigating Between Sites',
      description: 'Master the site navigation system - learn to drill down from company view to individual sites and back for effective multi-site management.',
      duration: '5:45',
      category: 'Navigation',
      videoFile: 'company/site-navigation.mp4'
    },
    {
      id: 'company-video-3',
      title: 'Company-Wide Reporting',
      description: 'Generate and export consolidated reports covering all sites, understand report categories, and create executive summaries.',
      duration: '12:00',
      category: 'Reports',
      videoFile: 'company/company-reports.mp4'
    },
    {
      id: 'company-video-4',
      title: 'Cross-Site Analytics',
      description: 'Compare site performance, analyze usage patterns across locations, and identify optimization opportunities using cross-site analytics.',
      duration: '10:15',
      category: 'Analytics',
      videoFile: 'company/cross-site-analytics.mp4'
    },
    {
      id: 'company-video-5',
      title: 'Multi-Site License Management',
      description: 'Monitor license utilization across all sites, understand allocation strategies, and plan for capacity expansion.',
      duration: '8:45',
      category: 'License Management',
      videoFile: 'company/license-management.mp4'
    },
    {
      id: 'company-video-6',
      title: 'Company Admin Best Practices',
      description: 'Best practices for managing multiple sites, setting up monitoring workflows, and ensuring consistent operations across your organization.',
      duration: '11:30',
      category: 'Best Practices',
      videoFile: 'company/admin-best-practices.mp4'
    }
  ], []);

  // Get articles for current segment (or company-specific if in company view)
  const gettingStartedArticles = useMemo(() => {
    if (isCompanyView) {
      return companyArticles;
    }
    return segmentArticles[currentSegment] || segmentArticles[SEGMENTS.MISCELLANEOUS];
  }, [currentSegment, segmentArticles, isCompanyView, companyArticles]);

  // Segment-Specific FAQ Data
  const segmentFAQs = useMemo(() => ({
    [SEGMENTS.ENTERPRISE]: [
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
      answer: 'Go to Device Management, click "Register Device", enter the MAC address, select device type (User/Digital), choose owner from the user list, optionally enter a device name, and click "Register". The device will be bound to the user account.'
    },
    {
      id: 'faq-6',
      category: 'Device Registration',
      question: 'What is the difference between User and Digital devices?',
      answer: 'User devices are user-operated devices like mobile phones, laptops, and tablets. Digital devices are IoT devices, smart TVs, printers, and other automated devices. Some segments restrict certain device types for security and performance reasons.'
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
      answer: 'Ensure MAC address format is correct (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX). Check that the MAC address is not already registered. Verify device type is allowed for the user\'s segment. Some segments restrict digital devices.'
    }
  ],
  [SEGMENTS.CO_LIVING]: [
    {
      id: 'faq-1',
      category: 'License Management',
      question: 'How many licenses do I need for my co-living space?',
      answer: 'Typically one license per resident/room. Check the Dashboard to see current license usage. Plan for 10-15% buffer for visitors and temporary residents.'
    },
    {
      id: 'faq-2',
      category: 'Resident Access',
      question: 'How do residents get WiFi access?',
      answer: 'Residents receive WiFi credentials during check-in. They can register their devices via self-service portal or through the property management system integration.'
    },
    {
      id: 'faq-3',
      category: 'Internet Plans',
      question: 'Can I offer different internet speeds for different rooms?',
      answer: 'Yes, create tiered plans (Basic/Standard/Premium) with different speeds and data allowances. Assign plans based on room types or resident preferences during onboarding.'
    },
    {
      id: 'faq-4',
      category: 'Device Management',
      question: 'How many devices can each resident register?',
      answer: 'Default is typically 3-5 devices per resident (smartphone, laptop, tablet, smart TV, etc.). You can adjust device limits per policy in the Network Configuration.'
    },
    {
      id: 'faq-5',
      category: 'Troubleshooting',
      question: 'Resident complains about slow internet. What should I check?',
      answer: 'Verify: 1) Resident is on correct plan, 2) Check for bandwidth-heavy usage by other residents, 3) Device limit not exceeded, 4) No data cap reached, 5) Check WiFi signal strength in their room.'
    }
  ],
  [SEGMENTS.HOTEL]: [
    {
      id: 'faq-1',
      category: 'Guest Access',
      question: 'How do guests get WiFi access?',
      answer: 'Guests can access WiFi via: 1) Room number + last name at check-in, 2) Voucher codes provided at front desk, 3) Automatic PMS integration on check-in, 4) QR codes in rooms.'
    },
    {
      id: 'faq-2',
      category: 'Guest Access',
      question: 'Does guest WiFi expire automatically at checkout?',
      answer: 'Yes, when integrated with PMS, WiFi access automatically expires at checkout time. You can manually extend access for late checkouts or early departures as needed.'
    },
    {
      id: 'faq-3',
      category: 'WiFi Tiers',
      question: 'Should I offer free WiFi or charge for premium speeds?',
      answer: 'Best practice: Offer complimentary basic WiFi (suitable for email/browsing) and premium high-speed WiFi for business travelers and streaming at an upgrade fee.'
    },
    {
      id: 'faq-4',
      category: 'Conference & Events',
      question: 'How do I provide WiFi for conferences and events?',
      answer: 'Use bulk voucher generation to create temporary WiFi codes with custom expiry times. Set appropriate bandwidth limits per user to ensure quality for all attendees.'
    },
    {
      id: 'faq-5',
      category: 'Troubleshooting',
      question: 'Guest cannot connect with voucher code. What should I do?',
      answer: 'Verify: 1) Voucher is not expired, 2) Code entered correctly (case-sensitive), 3) Guest has not exceeded device limit, 4) Generate new voucher if issue persists.'
    }
  ],
  [SEGMENTS.CO_WORKING]: [
    {
      id: 'faq-1',
      category: 'Membership Plans',
      question: 'How do I set up different plans for day pass vs monthly members?',
      answer: 'Create separate policies: Day Pass (limited bandwidth, 8-hour access), Hot Desk (medium bandwidth, office hours), Dedicated Desk (high bandwidth, 24/7), Private Office (priority bandwidth, unlimited devices).'
    },
    {
      id: 'faq-2',
      category: 'Member Access',
      question: 'How do members access WiFi?',
      answer: 'Members receive unique credentials on sign-up. Day pass visitors get temporary codes. Integrate with your coworking management software for automatic access provisioning.'
    },
    {
      id: 'faq-3',
      category: 'Bandwidth Management',
      question: 'How do I prioritize bandwidth for private offices?',
      answer: 'Create premium policies with higher speed limits and priority flags. Assign these to private office members. This ensures they get priority during peak usage times.'
    },
    {
      id: 'faq-4',
      category: 'Video Conferencing',
      question: 'Members complain about poor video call quality. How to fix?',
      answer: 'Ensure: 1) High bandwidth allocation for member plans, 2) QoS settings prioritize video conferencing traffic, 3) Check conference room WiFi coverage, 4) Limit bandwidth-heavy downloads during business hours.'
    },
    {
      id: 'faq-5',
      category: 'Guest Access',
      question: 'How do I provide WiFi to member guests and visitors?',
      answer: 'Members can generate limited day pass codes for their guests, or front desk can issue temporary visitor WiFi with time-based expiry and bandwidth restrictions.'
    }
  ],
  [SEGMENTS.PG]: [
    {
      id: 'faq-1',
      category: 'Tenant Plans',
      question: 'What internet plans work best for PG tenants?',
      answer: 'Create affordable plans with moderate speeds (10-25 Mbps) and fair data caps. Consider time-based restrictions during peak hours to ensure fair distribution among all tenants.'
    },
    {
      id: 'faq-2',
      category: 'Fair Usage',
      question: 'How do I prevent one tenant from consuming all bandwidth?',
      answer: 'Implement: 1) Per-tenant bandwidth limits in policies, 2) Device limits (2-3 devices per tenant), 3) Data caps with cycle resets, 4) Monitor usage reports to identify heavy users.'
    },
    {
      id: 'faq-3',
      category: 'Device Limits',
      question: 'How many devices should I allow per tenant?',
      answer: 'Typically 2-3 devices per tenant (phone + laptop + tablet) to prevent network abuse. You can adjust based on your internet capacity and tenant count.'
    },
    {
      id: 'faq-4',
      category: 'Tenant Issues',
      question: 'Tenant says WiFi is too slow. What should I check?',
      answer: 'Check: 1) Tenant device count within limit, 2) No data cap reached, 3) Other tenants not heavily using bandwidth, 4) WiFi signal strength in tenant room, 5) Peak usage time vs off-peak.'
    },
    {
      id: 'faq-5',
      category: 'Payment Integration',
      question: 'Can I suspend WiFi for rent pending?',
      answer: 'Yes, change tenant status to Suspended in User Management. WiFi access will be blocked until status is changed back to Active after rent payment.'
    }
  ],
  [SEGMENTS.MISCELLANEOUS]: [
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
      answer: 'Go to Device Management, click "Register Device", enter the MAC address, select device type (User/Digital), choose owner from the user list, optionally enter a device name, and click "Register". The device will be bound to the user account.'
    },
    {
      id: 'faq-6',
      category: 'Device Registration',
      question: 'What is the difference between User and Digital devices?',
      answer: 'User devices are user-operated devices like mobile phones, laptops, and tablets. Digital devices are IoT devices, smart TVs, printers, and other automated devices. Some segments restrict certain device types for security and performance reasons.'
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
      answer: 'Ensure MAC address format is correct (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX). Check that the MAC address is not already registered. Verify device type is allowed for the user\'s segment. Some segments restrict digital devices.'
    }
  ]
}), []);

  // Get FAQs for current segment (or company-specific if in company view)
  const faqData = useMemo(() => {
    if (isCompanyView) {
      return companyFAQs;
    }
    return segmentFAQs[currentSegment] || segmentFAQs[SEGMENTS.MISCELLANEOUS];
  }, [currentSegment, segmentFAQs, isCompanyView, companyFAQs]);

  // Segment-Specific Video Tutorial Data
  // Video files should be placed in public/assets/videos/{segment}/ folder
  const segmentVideos = useMemo(() => ({
    [SEGMENTS.ENTERPRISE]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the enterprise portal, understanding the dashboard, and managing corporate users efficiently.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'enterprise/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on creating corporate user accounts, assigning department-based policies, and managing user credentials with AD integration.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'enterprise/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of registering company devices, implementing BYOD policies, and managing device lifecycle with MAC address binding.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'enterprise/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to create department-specific policies, set bandwidth allocation, implement compliance requirements, and configure enterprise-grade access controls.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'enterprise/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate compliance reports, department-wise usage analytics, apply filters for audit trails, and export data for executive review.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'enterprise/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for corporate network connectivity problems, VPN conflicts, enterprise authentication failures, and user access issues.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'enterprise/troubleshooting.mp4'
      }
    ],
    [SEGMENTS.CO_LIVING]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the co-living portal, understanding resident analytics, and setting up self-service WiFi access for residents.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'coLiving/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on resident onboarding, creating resident accounts, handling move-in/move-out processes, and managing visitor credentials.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'coLiving/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of resident device registration, self-service device binding, managing personal devices, and shared common area equipment.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'coLiving/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to create tiered internet plans (basic, standard, premium), set speed limits and data caps per room type, and configure resident-specific policies.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'coLiving/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate resident usage reports, occupancy analytics, billing reconciliation data, and export usage summaries for property management.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'coLiving/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for resident connectivity problems, weak signal issues, fair usage policy enforcement, device limit errors, and bandwidth complaints.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'coLiving/troubleshooting.mp4'
      }
    ],
    [SEGMENTS.HOTEL]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the hotel WiFi portal, setting up guest access systems, PMS integration, and understanding voucher-based authentication.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'hotel/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on managing guest WiFi accounts, generating voucher codes, automatic check-out expiry, and handling conference/event attendees.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'hotel/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of guest device registration, managing multiple devices per room, smart room IoT devices, and hotel infrastructure equipment.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'hotel/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to configure complimentary basic WiFi and premium high-speed tiers, set guest device limits, and create upsell opportunities for business travelers.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'hotel/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate guest satisfaction metrics, occupancy-linked usage reports, premium tier revenue analysis, and export data for management review.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'hotel/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for guest connectivity problems, voucher code errors, device registration failures, coverage issues in guest rooms, and rapid support workflows.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'hotel/troubleshooting.mp4'
      }
    ],
    [SEGMENTS.CO_WORKING]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the coworking space portal, understanding member analytics, setting up day pass systems, and managing flexible membership tiers.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'coWorking/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on creating member accounts, issuing day passes, managing corporate team subscriptions, and handling visitor WiFi access.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'coWorking/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of member device registration, supporting BYOD environments, managing multiple work devices, and configuring shared coworking equipment.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'coWorking/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to create flexible membership plans (day pass, hot desk, dedicated desk, private office), set bandwidth priorities, and ensure quality for video conferencing.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'coWorking/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate space utilization reports, member activity analytics, network performance metrics, and export data for business intelligence.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'coWorking/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for member connectivity problems, video conferencing quality issues, VPN compatibility errors, device authentication failures, and professional support workflows.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'coWorking/troubleshooting.mp4'
      }
    ],
    [SEGMENTS.PG]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the PG portal, setting up cost-effective WiFi management, room-based access control, and implementing fair usage policies.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'pg/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on registering PG tenants, creating room-based credentials, handling tenant move-in/move-out, and rent-linked WiFi suspensions.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'pg/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of tenant device registration, enforcing device limits per room, managing common area WiFi, and preventing network abuse.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'pg/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to create cost-effective internet plans, set fair data caps, configure speed limits, implement time-based restrictions, and ensure equitable bandwidth distribution.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'pg/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate tenant usage reports, monitor per-room bandwidth consumption, identify heavy users, track violations, and export data for tenant billing.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'pg/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for tenant connectivity problems, handling bandwidth complaints, resolving device limit errors, addressing slow speed issues, and maintaining fair usage enforcement.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'pg/troubleshooting.mp4'
      }
    ],
    [SEGMENTS.MISCELLANEOUS]: [
      {
        id: 'video-1',
        title: 'Getting Started with WiFi Portal',
        description: 'Learn the basics of navigating the portal, understanding the dashboard, and managing users.',
        duration: '8:45',
        category: 'Getting Started',
        videoFile: 'miscellaneous/getting-started.mp4'
      },
      {
        id: 'video-2',
        title: 'Adding and Managing Users',
        description: 'Step-by-step guide on creating user accounts, assigning policies, and managing user credentials.',
        duration: '12:30',
        category: 'User Management',
        videoFile: 'miscellaneous/user-management.mp4'
      },
      {
        id: 'video-3',
        title: 'Device Registration Process',
        description: 'Complete walkthrough of registering devices, MAC address binding, and device assignment.',
        duration: '10:15',
        category: 'Device Management',
        videoFile: 'miscellaneous/device-registration.mp4'
      },
      {
        id: 'video-4',
        title: 'Creating and Managing Policies',
        description: 'Learn how to create policies, set speed limits, data caps, and device limits.',
        duration: '15:20',
        category: 'Configuration',
        videoFile: 'miscellaneous/policy-setup.mp4'
      },
      {
        id: 'video-5',
        title: 'Generating Reports and Analytics',
        description: 'Discover how to generate reports, apply filters, and export data for analysis.',
        duration: '11:50',
        category: 'Reports',
        videoFile: 'miscellaneous/reports.mp4'
      },
      {
        id: 'video-6',
        title: 'Troubleshooting Common Issues',
        description: 'Solutions for common connectivity problems, device registration errors, and user access issues.',
        duration: '9:30',
        category: 'Troubleshooting',
        videoFile: 'miscellaneous/troubleshooting.mp4'
      }
    ]
  }), []);

  // Get videos for current segment (or company-specific if in company view)
  const videoData = useMemo(() => {
    if (isCompanyView) {
      return companyVideos;
    }
    return segmentVideos[currentSegment] || segmentVideos[SEGMENTS.MISCELLANEOUS];
  }, [currentSegment, segmentVideos, isCompanyView, companyVideos]);

  // Load actual video durations from video files
  const { durations, loading: durationsLoading } = useVideoDurations(videoData);

  // Merge actual durations with video data
  const videosWithDurations = useMemo(() => {
    if (durationsLoading) return videoData; // Show hardcoded durations while loading

    return videoData.map(video => ({
      ...video,
      duration: durations[video.videoFile] || video.duration
    }));
  }, [videoData, durations, durationsLoading]);

  // Random selection logic - generates different content on each visit/refresh
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Preview content for home page (randomized on each render)
  const previewGettingStarted = useMemo(() => getRandomItems(gettingStartedArticles, 3), [gettingStartedArticles]);
  const previewVideos = useMemo(() => getRandomItems(videosWithDurations, 3), [videosWithDurations]);
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
    if (!searchTerm) return videosWithDurations;
    const term = searchTerm.toLowerCase();
    return videosWithDurations.filter(video =>
      video.title.toLowerCase().includes(term) ||
      video.description.toLowerCase().includes(term) ||
      video.category.toLowerCase().includes(term)
    );
  }, [searchTerm, videosWithDurations]); // videoData is now stable (memoized with empty deps)

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
      <h1 className="knowledge-center-title">{t('knowledge.title')}</h1>

      {/* Company View Info Banner */}
      {isCompanyView && (
        <div className="knowledge-company-banner">
          <FaBuilding className="knowledge-company-banner-icon" />
          <div className="knowledge-company-banner-content">
            <span className="knowledge-company-banner-title">Company View Help</span>
            <span className="knowledge-company-banner-text">
              Viewing help content for multi-site management. Topics cover company-wide reporting, cross-site analytics, and site navigation.
            </span>
          </div>
          <FaInfoCircle className="knowledge-company-banner-info" />
        </div>
      )}

      <div className="knowledge-search-row">
        <input
          type="text"
          className="knowledge-search-input"
          placeholder={t('knowledge.searchPlaceholder')}
          aria-label={t('knowledge.searchAriaLabel')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="knowledge-search-btn" onClick={handleSearch}>{t('knowledge.searchButton')}</button>
      </div>

      {/* Back button - shown when in a section view */}
      {currentView !== SECTION_VIEWS.HOME && (
        <button className="knowledge-back-btn" onClick={handleBackToHome}>
          <FaArrowLeft /> {t('knowledge.backToKnowledge')}
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
            <div className="feature-title">{t('knowledge.gettingStarted')}</div>
            <div className="feature-desc">{t('knowledge.gettingStartedDesc')}</div>
          </div>
          <div
            className="knowledge-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.VIDEO_TUTORIALS)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSectionClick(SECTION_VIEWS.VIDEO_TUTORIALS)}
          >
            <FaVideo className="feature-icon" />
            <div className="feature-title">{t('knowledge.videoTutorials')}</div>
            <div className="feature-desc">{t('knowledge.videoTutorialsDesc')}</div>
          </div>
          <div
            className="knowledge-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.FAQ)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSectionClick(SECTION_VIEWS.FAQ)}
          >
            <FaQuestionCircle className="feature-icon" />
            <div className="feature-title">{t('knowledge.faq')}</div>
            <div className="feature-desc">{t('knowledge.faqDesc')}</div>
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
                {t('knowledge.foundResults', {
                  articles: filteredArticles.length,
                  videos: filteredVideos.length,
                  faqs: filteredFAQs.length,
                  searchTerm
                })}
              </p>
            </div>
          )}

          {/* Getting Started Preview */}
          {(searchTerm ? filteredArticles.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  {t('knowledge.gettingStarted')}
                  {searchTerm && ` (${filteredArticles.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.GETTING_STARTED)}
                >
                  {t('knowledge.viewAll')} →
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
                  {t('knowledge.videoTutorials')}
                  {searchTerm && ` (${filteredVideos.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.VIDEO_TUTORIALS)}
                >
                  {t('knowledge.viewAll')} →
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
                  {t('knowledge.frequentlyAskedQuestions')}
                  {searchTerm && ` (${filteredFAQs.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => setCurrentView(SECTION_VIEWS.FAQ)}
                >
                  {t('knowledge.viewAll')} →
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
              <h3>{t('knowledge.noResultsFound', { searchTerm })}</h3>
              <p>{t('knowledge.tryDifferentKeywords')}</p>
            </div>
          )}
        </>
      )}

      {/* Getting Started Section View - Full Articles List */}
      {currentView === SECTION_VIEWS.GETTING_STARTED && (
        <>
          <h2 className="section-view-title">{t('knowledge.gettingStartedQuickGuide')}</h2>

          {/* Show search results count if searching */}
          {searchTerm && (
            <p className="search-results-text">
              {t('knowledge.foundArticles', { count: filteredArticles.length, searchTerm })}
            </p>
          )}

          {/* Organize articles by category */}
          {filteredArticles.length > 0 ? (
            (isCompanyView
              ? ['Multi-Site Management', 'Company Reports', 'Administrative Tasks', 'Best Practices']
              : ['User Management', 'Device Management', 'Reports & Analytics', 'Network Configuration', 'Troubleshooting', 'Best Practices']
            ).map(category => {
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
              <h3>{t('knowledge.noArticlesFound')}</h3>
              <p>{t('knowledge.tryDifferentOrClear')}</p>
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
            Register new devices with MAC address binding, assign devices to users, and configure user vs digital device types
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
          <h2 className="section-view-title">{t('knowledge.videoTutorials')}</h2>
          {searchTerm && (
            <p className="search-results-text">
              {t('knowledge.foundVideos', { count: filteredVideos.length })}
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
          <h2 className="section-view-title">{t('knowledge.frequentlyAskedQuestions')}</h2>
          {searchTerm && (
            <p className="search-results-text">
              {t('knowledge.foundQuestions', { count: filteredFAQs.length })}
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
              src={`/assets/videos/${selectedVideo.videoFile}`}
              title={selectedVideo.title}
              onClose={handleCloseVideo}
            />
            <div className="video-modal-info">
              <p><strong>{t('knowledge.category')}:</strong> {selectedVideo.category}</p>
              <p><strong>{t('knowledge.duration')}:</strong> {selectedVideo.duration}</p>
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
        aria-label={t('knowledge.supportAriaLabel')}
      >
        <div className="help-title">{t('knowledge.needHelp')}</div>
        <div className="help-desc">{t('knowledge.needHelpDesc')}</div>
        <div className="help-buttons">
          <button className="help-btn email">{t('knowledge.emailSupport')}</button>
          <button className="help-btn call">{t('knowledge.callSupport')}</button>
          <button className="help-btn chat">{t('knowledge.liveChat')}</button>
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