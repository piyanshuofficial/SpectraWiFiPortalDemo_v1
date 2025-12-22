/**
 * ============================================================================
 * Customer Portal Dashboard
 * ============================================================================
 *
 * @file src/pages/Dashboard.js
 * @description Main dashboard page for customer portal users. Displays key
 *              metrics, charts, activity feed, and site overview. Content
 *              adapts based on segment and user access level.
 *
 * @dashboardSections
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ DASHBOARD LAYOUT                                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
 * │ │ Active  │ │ License │ │  Data   │ │ Network │ │ Alerts  │  METRIC     │
 * │ │ Users   │ │ Usage   │ │ Usage   │ │ Uptime  │ │         │  CARDS      │
 * │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
 * │                                                                          │
 * │ ┌─────────────────────────────────────────────────────────────────────┐ │
 * │ │ Sites Overview (Company View Only)                                  │ │
 * │ │ Grid of site cards with status, metrics, drill-down                 │ │
 * │ └─────────────────────────────────────────────────────────────────────┘ │
 * │                                                                          │
 * │ ┌────────────────────────────┐ ┌──────────────────────────────────────┐ │
 * │ │ USAGE CHART                │ │ DEVICE DISTRIBUTION                  │ │
 * │ │ Line chart showing         │ │ Pie/Doughnut chart showing           │ │
 * │ │ data usage over time       │ │ device types breakdown               │ │
 * │ └────────────────────────────┘ └──────────────────────────────────────┘ │
 * │                                                                          │
 * │ ┌────────────────────────────┐ ┌──────────────────────────────────────┐ │
 * │ │ USER STATUS                │ │ RECENT ACTIVITY                      │ │
 * │ │ Bar chart showing          │ │ Activity feed showing                │ │
 * │ │ Active/Suspended/Blocked   │ │ recent user and device events        │ │
 * │ └────────────────────────────┘ └──────────────────────────────────────┘ │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @metricCards
 * | Metric        | Icon           | Description                          |
 * |---------------|----------------|--------------------------------------|
 * | Active Users  | FaUsers        | Currently active user count          |
 * | License Usage | FaChartPie     | Used/Total licenses percentage       |
 * | Data Usage    | FaNetworkWired | Total bandwidth consumed             |
 * | Network Uptime| FaCheckCircle  | Network availability percentage      |
 * | Alerts        | FaExclamationTriangle | Active alerts count          |
 * | Guest Status  | FaUserFriends  | Active guests (if guest enabled)     |
 *
 * @segmentVariations
 * Dashboard metrics vary by segment to show realistic data:
 * - Enterprise: Higher user counts, more data usage
 * - Hotel: Focus on guest metrics, daily check-ins
 * - Co-Living: Resident-focused metrics
 * - PG: Smaller scale metrics
 *
 * @companyVsSiteView
 * Company View:
 * - Shows aggregated metrics across all sites
 * - Displays Sites Overview grid with site cards
 * - Charts show company-wide trends
 * - Activity feed shows all sites
 *
 * Site View:
 * - Shows metrics for specific site only
 * - No Sites Overview section
 * - Charts show site-specific data
 * - Activity filtered to current site
 *
 * @exportFeatures
 * - Export charts as PNG images
 * - Export chart data as CSV
 * - Export full dashboard as PDF report
 *
 * @charts
 * | Chart             | Type     | Data Shown                          |
 * |-------------------|----------|-------------------------------------|
 * | Usage Trends      | Line     | Daily/weekly data usage             |
 * | Device Types      | Doughnut | Laptop/Mobile/Tablet distribution   |
 * | User Status       | Bar      | Active/Suspended/Blocked counts     |
 * | Site Performance  | Bar      | Per-site metrics (company view)     |
 *
 * @activityFeed
 * Shows recent events:
 * - User registrations
 * - Status changes
 * - Device connections
 * - Policy updates
 * - System alerts
 *
 * @dataRefresh
 * Current implementation uses static sample data.
 * TODO: Backend integration should:
 * - Fetch metrics on mount
 * - Poll every 30-60 seconds
 * - Or use WebSocket for real-time updates
 *
 * @dependencies
 * - Chart.js (via react-chartjs-2): For chart rendering
 * - useSegmentCompanyData: Segment-specific data
 * - useAccessLevelView: Company/site view detection
 * - useSegmentActivities: Activity feed data
 * - exportUtils: CSV/PDF export functions
 *
 * @relatedFiles
 * - SitesOverview.js: Sites grid component (company view)
 * - Card.js: Metric card component
 * - companySampleData.js: Demo company data
 * - Dashboard.css: Page styles
 * - commonChartOptions.js: Shared chart configurations
 *
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { FaUsers, FaUserFriends, FaChartPie, FaCheckCircle, FaFileCsv, FaFilePdf, FaLifeRing, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaBuilding, FaLaptop, FaExclamationTriangle, FaNetworkWired, FaUserClock } from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";
import { useLoading } from "../context/LoadingContext";
import { useSegment } from "../context/SegmentContext";
import { useSegmentActivities } from "../hooks/useSegmentActivities";
import { getSiteReportData } from "../config/siteConfig";
import { getStandardChartOptions } from "../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../utils/exportConstants";
import { exportChartDataToCSV } from "../utils/exportUtils";
import { exportReportPDF } from "../utils/exportReportPDF";
import { useNavigate } from "react-router-dom";
import { ANIMATION } from '../constants/appConstants';
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import SkeletonLoader from "../components/Loading/SkeletonLoader";
import notifications from "../utils/notifications";
import { useAccessLevelView } from "../context/AccessLevelViewContext";
import { sampleCompany, companySites, getCompanyStats, getSiteChartData, companyActivityLogs } from "../constants/companySampleData";
import { guestStatistics, getGuestsBySegment, getActiveGuests } from "../constants/guestSampleData";
import { useSegmentCompanyData } from "../hooks/useSegmentCompanyData";
import SitesOverview from "../components/SitesOverview";
import "./Dashboard.css";



const Dashboard = () => {
  const { t } = useTranslation();
  const { currentSegment } = useSegment();
  const { isCompanyView, isSiteView, isCompanyUser } = useAccessLevelView();

  // Calculate segment-specific metrics with realistic variation
  const metrics = useMemo(() => {
    // Different segments have different sizes and usage patterns
    const segmentMetrics = {
      enterprise: {
        baseUsers: 850,
        licensePercent: 68,
        dataUsageTB: 2.8,
        uptimePercent: 99.92,
        totalAlerts: 3,
        criticalAlerts: 1,
        activeGuests: 8,
        checkedInToday: 6
      },
      coLiving: {
        baseUsers: 320,
        licensePercent: 45,
        dataUsageTB: 1.5,
        uptimePercent: 99.85,
        totalAlerts: 5,
        criticalAlerts: 2,
        activeGuests: 5,
        checkedInToday: 4
      },
      hotel: {
        baseUsers: 450,
        licensePercent: 52,
        dataUsageTB: 1.8,
        uptimePercent: 99.88,
        totalAlerts: 2,
        criticalAlerts: 0,
        activeGuests: 245,
        checkedInToday: 42
      },
      coWorking: {
        baseUsers: 280,
        licensePercent: 38,
        dataUsageTB: 1.2,
        uptimePercent: 99.78,
        totalAlerts: 4,
        criticalAlerts: 1,
        activeGuests: 14,
        checkedInToday: 12
      },
      pg: {
        baseUsers: 180,
        licensePercent: 25,
        dataUsageTB: 0.6,
        uptimePercent: 99.65,
        totalAlerts: 7,
        criticalAlerts: 3,
        activeGuests: 4,
        checkedInToday: 3
      },
      miscellaneous: {
        baseUsers: 95,
        licensePercent: 15,
        dataUsageTB: 0.3,
        uptimePercent: 99.58,
        totalAlerts: 2,
        criticalAlerts: 0,
        activeGuests: 2,
        checkedInToday: 1
      }
    };

    const segmentConfig = segmentMetrics[currentSegment] || segmentMetrics.enterprise;

    return {
      activeUsers: segmentConfig.baseUsers,
      activeUsersDelta: Math.round(segmentConfig.baseUsers * 0.03), // 3% delta
      licenseUsagePercent: segmentConfig.licensePercent,
      licenseUsageDelta: 2,
      dataUsageTB: segmentConfig.dataUsageTB,
      dataUsageDelta: Math.round(segmentConfig.dataUsageTB * 0.04 * 100) / 100, // 4% delta
      networkUptime: segmentConfig.uptimePercent,
      uptimeDelta: 0.05, // Small positive delta
      totalAlerts: segmentConfig.totalAlerts,
      criticalAlerts: segmentConfig.criticalAlerts,
      activeGuests: segmentConfig.activeGuests,
      checkedInToday: segmentConfig.checkedInToday,
      guestsDelta: Math.round(segmentConfig.checkedInToday * 0.15) // 15% delta for guests
    };
  }, [currentSegment]);

  // Get segment-specific recent activities from shared hook
  const recentActivities = useSegmentActivities();

  const { hasPermission } = usePermissions();
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingChart, setExportingChart] = useState(null);
  const [activityPage, setActivityPage] = useState(0);

  // Activities carousel configuration
  const ACTIVITIES_PER_PAGE = 5;
  const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;

  const darkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.chart.canvas.id === 'chart-network-usage') {
                label += context.parsed.y + ' GB';
              } else if (context.chart.canvas.id === 'chart-speed-tier') {
                label += context.parsed.y + ' users';
              } else if (context.chart.canvas.id === 'chart-peak-usage') {
                label += context.parsed.y;
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: false },
        grid: { color: darkMode ? "#444" : "#e5e5e5" },
        ticks: { color: darkMode ? "#fff" : "#222", font: { size: 12 } }
      },
      y: {
        title: { display: false },
        grid: { color: darkMode ? "#444" : "#e5e5e5" },
        ticks: { color: darkMode ? "#fff" : "#222", font: { size: 12 } },
        beginAtZero: true
      }
    }
  };

  // Separate options for pie/doughnut charts - no scales (gridlines/axes)
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
    // No scales property - pie charts don't have axes
  };

  // Get segment-specific data for dashboard charts
  const networkData = useMemo(() => {
    // Generate segment-specific network usage data with variation per segment
    const baseData = getSiteReportData("network-usage-report") || [];

    // Different segments have different usage patterns
    const segmentMultipliers = {
      enterprise: 2.5,      // Enterprise uses most bandwidth
      coLiving: 1.8,        // Co-living has high usage
      hotel: 1.5,           // Hotels have moderate usage
      coWorking: 1.3,       // Co-working moderate-low
      pg: 0.8,              // PG uses less
      miscellaneous: 0.5    // Miscellaneous lowest
    };

    const multiplier = segmentMultipliers[currentSegment] || 1.0;

    // Scale and add some variation per segment
    return baseData.map((item, index) => {
      // Add segment-specific pattern (some segments peak differently)
      const dayVariation = currentSegment === 'enterprise' ? 1.0 + (Math.sin(index / 5) * 0.2) :
                          currentSegment === 'hotel' ? 1.0 + (Math.cos(index / 4) * 0.25) :
                          1.0;

      return {
        ...item,
        usageGB: Math.round(item.usageGB * multiplier * dayVariation * 10) / 10
      };
    });
  }, [currentSegment]);

  const speedTierData = useMemo(() => {
    // Generate segment-specific user distribution by speed tiers
    const segmentSpeedDistributions = {
      enterprise: [
        { speedTier: "Up to 25 Mbps", userCount: 180 },
        { speedTier: "26-50 Mbps", userCount: 320 },
        { speedTier: "51-100 Mbps", userCount: 250 },
        { speedTier: "Above 100 Mbps", userCount: 100 }
      ],
      coLiving: [
        { speedTier: "Up to 25 Mbps", userCount: 120 },
        { speedTier: "26-50 Mbps", userCount: 140 },
        { speedTier: "51-100 Mbps", userCount: 60 }
      ],
      hotel: [
        { speedTier: "Up to 25 Mbps", userCount: 280 },
        { speedTier: "26-50 Mbps", userCount: 120 },
        { speedTier: "51-100 Mbps", userCount: 50 }
      ],
      coWorking: [
        { speedTier: "Up to 25 Mbps", userCount: 85 },
        { speedTier: "26-50 Mbps", userCount: 130 },
        { speedTier: "51-100 Mbps", userCount: 65 }
      ],
      pg: [
        { speedTier: "Up to 25 Mbps", userCount: 95 },
        { speedTier: "26-50 Mbps", userCount: 75 },
        { speedTier: "51-100 Mbps", userCount: 10 }
      ],
      miscellaneous: [
        { speedTier: "Up to 25 Mbps", userCount: 45 },
        { speedTier: "26-50 Mbps", userCount: 35 },
        { speedTier: "51-100 Mbps", userCount: 15 }
      ]
    };

    return segmentSpeedDistributions[currentSegment] || segmentSpeedDistributions.enterprise;
  }, [currentSegment]);

  const peakUsageData = useMemo(() => {
    // Generate segment-specific peak usage hours data
    // Shows percentage of daily traffic during different time periods
    const segmentPeakUsage = {
      enterprise: [
        { period: "6AM-9AM", usage: 15, label: "Morning" },
        { period: "9AM-12PM", usage: 28, label: "Late Morning" },
        { period: "12PM-3PM", usage: 22, label: "Afternoon" },
        { period: "3PM-6PM", usage: 25, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 8, label: "Evening" },
        { period: "9PM-12AM", usage: 2, label: "Night" }
      ],
      coLiving: [
        { period: "6AM-9AM", usage: 12, label: "Morning" },
        { period: "9AM-12PM", usage: 8, label: "Late Morning" },
        { period: "12PM-3PM", usage: 10, label: "Afternoon" },
        { period: "3PM-6PM", usage: 15, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 32, label: "Evening" },
        { period: "9PM-12AM", usage: 23, label: "Night" }
      ],
      hotel: [
        { period: "6AM-9AM", usage: 18, label: "Morning" },
        { period: "9AM-12PM", usage: 12, label: "Late Morning" },
        { period: "12PM-3PM", usage: 8, label: "Afternoon" },
        { period: "3PM-6PM", usage: 10, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 28, label: "Evening" },
        { period: "9PM-12AM", usage: 24, label: "Night" }
      ],
      coWorking: [
        { period: "6AM-9AM", usage: 10, label: "Morning" },
        { period: "9AM-12PM", usage: 30, label: "Late Morning" },
        { period: "12PM-3PM", usage: 25, label: "Afternoon" },
        { period: "3PM-6PM", usage: 28, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 5, label: "Evening" },
        { period: "9PM-12AM", usage: 2, label: "Night" }
      ],
      pg: [
        { period: "6AM-9AM", usage: 8, label: "Morning" },
        { period: "9AM-12PM", usage: 5, label: "Late Morning" },
        { period: "12PM-3PM", usage: 10, label: "Afternoon" },
        { period: "3PM-6PM", usage: 12, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 35, label: "Evening" },
        { period: "9PM-12AM", usage: 30, label: "Night" }
      ],
      miscellaneous: [
        { period: "6AM-9AM", usage: 14, label: "Morning" },
        { period: "9AM-12PM", usage: 18, label: "Late Morning" },
        { period: "12PM-3PM", usage: 16, label: "Afternoon" },
        { period: "3PM-6PM", usage: 20, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 18, label: "Evening" },
        { period: "9PM-12AM", usage: 14, label: "Night" }
      ]
    };

    return segmentPeakUsage[currentSegment] || segmentPeakUsage.enterprise;
  }, [currentSegment]);

  // ============================================
  // ADDITIONAL CHART DATA FOR RANDOMIZED SELECTION
  // ============================================

  // User Growth Trend - Available for all segments
  const userGrowthData = useMemo(() => {
    const baseGrowth = {
      enterprise: [820, 835, 842, 850, 855, 862, 870, 878, 885, 892, 900, 910],
      coLiving: [280, 290, 295, 302, 308, 312, 318, 322, 328, 335, 340, 348],
      hotel: [380, 395, 410, 420, 435, 445, 455, 468, 480, 492, 505, 520],
      coWorking: [220, 228, 235, 242, 250, 258, 265, 272, 280, 288, 295, 302],
      pg: [150, 158, 165, 172, 178, 185, 192, 198, 205, 212, 218, 225],
      miscellaneous: [75, 78, 82, 85, 88, 92, 95, 98, 102, 105, 108, 112]
    };
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = baseGrowth[currentSegment] || baseGrowth.enterprise;
    return months.map((month, i) => ({ month, users: data[i] }));
  }, [currentSegment]);

  // Bandwidth Consumption Trend - Only for fixed bandwidth sites
  const bandwidthTrendData = useMemo(() => {
    const baseTrend = {
      enterprise: [180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345],
      coLiving: [85, 92, 98, 105, 112, 118, 125, 132, 138, 145, 152, 160],
      hotel: [120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285],
      coWorking: [95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205],
      pg: [45, 52, 58, 65, 72, 78, 85, 92, 98, 105, 112, 120],
      miscellaneous: [25, 28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62]
    };
    const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
    const data = baseTrend[currentSegment] || baseTrend.enterprise;
    return weeks.map((week, i) => ({ week, bandwidth: data[i] }));
  }, [currentSegment]);

  // Guest Check-ins by Hour - Only for Hotel segment
  const guestCheckinData = useMemo(() => {
    return [
      { hour: "6AM", checkins: 5 },
      { hour: "8AM", checkins: 12 },
      { hour: "10AM", checkins: 25 },
      { hour: "12PM", checkins: 45 },
      { hour: "2PM", checkins: 68 },
      { hour: "4PM", checkins: 52 },
      { hour: "6PM", checkins: 35 },
      { hour: "8PM", checkins: 18 },
      { hour: "10PM", checkins: 8 }
    ];
  }, []);

  // Guest Duration of Stay - Only for Hotel segment
  const guestDurationData = useMemo(() => {
    return [
      { duration: "< 1 hour", count: 45 },
      { duration: "1-2 hours", count: 85 },
      { duration: "2-4 hours", count: 120 },
      { duration: "4-8 hours", count: 95 },
      { duration: "8-24 hours", count: 65 },
      { duration: "> 24 hours", count: 35 }
    ];
  }, []);

  // Top-up Purchases - Only for Hotel, CoLiving, PG segments
  const topupPurchasesData = useMemo(() => {
    const baseData = {
      hotel: [
        { package: "1GB - ₹99", count: 245 },
        { package: "3GB - ₹199", count: 180 },
        { package: "5GB - ₹299", count: 120 },
        { package: "10GB - ₹499", count: 65 },
        { package: "Unlimited Day - ₹149", count: 95 }
      ],
      coLiving: [
        { package: "5GB - ₹149", count: 85 },
        { package: "10GB - ₹249", count: 120 },
        { package: "25GB - ₹449", count: 95 },
        { package: "50GB - ₹799", count: 45 },
        { package: "Speed Boost - ₹99", count: 65 }
      ],
      pg: [
        { package: "2GB - ₹79", count: 55 },
        { package: "5GB - ₹149", count: 85 },
        { package: "10GB - ₹249", count: 45 },
        { package: "Night Unlimited - ₹49", count: 120 },
        { package: "Weekend Pack - ₹99", count: 75 }
      ]
    };
    return baseData[currentSegment] || [];
  }, [currentSegment]);

  // Monthly Usage Comparison - Available for all segments
  const monthlyComparisonData = useMemo(() => {
    const baseComparison = {
      enterprise: { lastMonth: 2650, thisMonth: 2800, growth: 5.7 },
      coLiving: { lastMonth: 1420, thisMonth: 1500, growth: 5.6 },
      hotel: { lastMonth: 1680, thisMonth: 1800, growth: 7.1 },
      coWorking: { lastMonth: 1120, thisMonth: 1200, growth: 7.1 },
      pg: { lastMonth: 560, thisMonth: 600, growth: 7.1 },
      miscellaneous: { lastMonth: 280, thisMonth: 300, growth: 7.1 }
    };
    const data = baseComparison[currentSegment] || baseComparison.enterprise;
    return [
      { period: "Last Month", usage: data.lastMonth },
      { period: "This Month", usage: data.thisMonth }
    ];
  }, [currentSegment]);

  // Evening vs Daytime Usage - Only for CoLiving and PG segments
  const eveningDaytimeData = useMemo(() => {
    const baseData = {
      coLiving: [
        { period: "Daytime (6AM-6PM)", usage: 35, color: "#4caf50" },
        { period: "Evening (6PM-12AM)", usage: 55, color: "#ff9800" },
        { period: "Night (12AM-6AM)", usage: 10, color: "#9c27b0" }
      ],
      pg: [
        { period: "Daytime (6AM-6PM)", usage: 25, color: "#4caf50" },
        { period: "Evening (6PM-12AM)", usage: 60, color: "#ff9800" },
        { period: "Night (12AM-6AM)", usage: 15, color: "#9c27b0" }
      ]
    };
    return baseData[currentSegment] || [];
  }, [currentSegment]);

  // Site bandwidth type - for demo purposes, assume fixed bandwidth for enterprise/office
  const isFixedBandwidthSite = useMemo(() => {
    return ['enterprise', 'office', 'coWorking'].includes(currentSegment);
  }, [currentSegment]);

  // ============================================
  // RANDOMIZED CHART SELECTION LOGIC
  // ============================================

  // Define available charts with their conditions
  const availableCharts = useMemo(() => {
    const charts = [
      {
        id: 'speedTier',
        title: t('charts.usersBySpeedTier'),
        available: true, // Available for all segments
        priority: 1
      },
      {
        id: 'dataUsage',
        title: t('charts.networkUsage'),
        available: true, // Available for all segments
        priority: 1
      },
      {
        id: 'peakUsage',
        title: t('charts.peakUsageHours'),
        available: ['coLiving', 'hotel', 'pg', 'coWorking'].includes(currentSegment),
        priority: 2
      },
      {
        id: 'bandwidthTrend',
        title: 'Bandwidth Consumption Trend',
        available: isFixedBandwidthSite,
        priority: 2
      },
      {
        id: 'userGrowth',
        title: 'User Growth Trend',
        available: true, // Available for all segments
        priority: 1
      },
      {
        id: 'guestCheckins',
        title: 'Guest Check-ins by Hour',
        available: currentSegment === 'hotel',
        priority: 3
      },
      {
        id: 'guestDuration',
        title: 'Guest Duration of Stay',
        available: currentSegment === 'hotel',
        priority: 3
      },
      {
        id: 'topupPurchases',
        title: 'Top-up Purchases',
        available: ['hotel', 'coLiving', 'pg'].includes(currentSegment),
        priority: 2
      },
      {
        id: 'monthlyComparison',
        title: 'Monthly Usage Comparison',
        available: true, // Available for all segments
        priority: 1
      },
      {
        id: 'eveningDaytime',
        title: 'Evening vs Daytime Usage',
        available: ['coLiving', 'pg'].includes(currentSegment),
        priority: 3
      }
    ];

    return charts.filter(chart => chart.available);
  }, [currentSegment, isFixedBandwidthSite, t]);

  // Select 3 random charts from available pool - seeded by date for consistency within a day
  const selectedCharts = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Simple seeded random function
    const seededRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const available = [...availableCharts];
    const selected = [];
    let seedOffset = 0;

    // Select 3 charts
    while (selected.length < 3 && available.length > 0) {
      const randomIndex = Math.floor(seededRandom(seed + seedOffset + currentSegment.length) * available.length);
      selected.push(available[randomIndex]);
      available.splice(randomIndex, 1);
      seedOffset++;
    }

    return selected;
  }, [availableCharts, currentSegment]);

  // Helper function to render a chart based on its ID
  const renderChart = (chartConfig) => {
    const { id, title } = chartConfig;

    switch (id) {
      case 'dataUsage':
        return (
          <Card key={id} title={t('charts.networkUsage')}>
            <div id="chart-network-usage" className="chart-container">
              <Line
                data={{
                  labels: networkData.map((n) => n.day),
                  datasets: [{
                    label: t('charts.networkUsage'),
                    data: networkData.map((n) => n.usageGB),
                    borderColor: "#004aad",
                    backgroundColor: "rgba(0,74,173,0.2)",
                    fill: true,
                    tension: 0.4,
                  }],
                }}
                options={chartOptions}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV([t('dashboard.day'), t('charts.networkUsage')], networkData.map((n) => [n.day, n.usageGB]), "network_usage.csv", "network-usage")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "network-usage"} disabled={exportingPDF || (exportingCSV && exportingChart !== "network-usage") || !networkData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF(t('charts.networkUsage'), [t('dashboard.day'), t('charts.networkUsage')], networkData.map((n) => [n.day, n.usageGB]), "line", networkData, "network_usage.pdf", "network_usage", "network-usage")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "network-usage"} disabled={exportingCSV || (exportingPDF && exportingChart !== "network-usage") || !networkData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'speedTier':
        return (
          <Card key={id} title={t('charts.usersBySpeedTier')}>
            <div id="chart-speed-tier" className="chart-container">
              <Bar
                data={{
                  labels: speedTierData.map((d) => d.speedTier),
                  datasets: [{
                    label: t('dashboard.userCount'),
                    data: speedTierData.map((d) => d.userCount),
                    backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
                    borderWidth: 1,
                  }],
                }}
                options={chartOptions}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV([t('dashboard.speedTier'), t('dashboard.userCount')], speedTierData.map((d) => [d.speedTier, d.userCount]), "users_by_speed_tier.csv", "speed-tier")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "speed-tier"} disabled={exportingPDF || (exportingCSV && exportingChart !== "speed-tier") || !speedTierData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF(t('charts.usersBySpeedTier'), [t('dashboard.speedTier'), t('dashboard.userCount')], speedTierData.map((d) => [d.speedTier, d.userCount]), "bar", speedTierData, "users_by_speed_tier.pdf", "users_by_speed_tier", "speed-tier")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "speed-tier"} disabled={exportingCSV || (exportingPDF && exportingChart !== "speed-tier") || !speedTierData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'peakUsage':
        return (
          <Card key={id} title={t('charts.peakUsageHours')}>
            <div id="chart-peak-usage" className="chart-container">
              <Bar
                data={{
                  labels: peakUsageData.map((p) => p.period),
                  datasets: [{
                    label: t('charts.usagePercent'),
                    data: peakUsageData.map((p) => p.usage),
                    backgroundColor: peakUsageData.map((_, i) => {
                      const colors = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#ff5722', '#9c27b0'];
                      return colors[i % colors.length];
                    }),
                    borderRadius: 4,
                  }],
                }}
                options={{
                  ...chartOptions,
                  plugins: { ...chartOptions.plugins, legend: { display: false } },
                  scales: { y: { beginAtZero: true, max: 40, ticks: { callback: (value) => `${value}%` } } }
                }}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV([t('dashboard.timePeriod'), t('charts.usagePercent')], peakUsageData.map((p) => [p.period, `${p.usage}%`]), "peak_usage_hours.csv", "peak-usage")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "peak-usage"} disabled={exportingPDF || (exportingCSV && exportingChart !== "peak-usage") || !peakUsageData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF(t('charts.peakUsageHours'), [t('dashboard.timePeriod'), t('charts.usagePercent')], peakUsageData.map((p) => [p.period, `${p.usage}%`]), "bar", peakUsageData, "peak_usage_hours.pdf", "peak_usage", "peak-usage")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "peak-usage"} disabled={exportingCSV || (exportingPDF && exportingChart !== "peak-usage") || !peakUsageData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'userGrowth':
        return (
          <Card key={id} title="User Growth Trend">
            <div id="chart-user-growth" className="chart-container">
              <Line
                data={{
                  labels: userGrowthData.map((d) => d.month),
                  datasets: [{
                    label: "Users",
                    data: userGrowthData.map((d) => d.users),
                    borderColor: "#4caf50",
                    backgroundColor: "rgba(76,175,80,0.2)",
                    fill: true,
                    tension: 0.4,
                  }],
                }}
                options={chartOptions}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Month", "Users"], userGrowthData.map((d) => [d.month, d.users]), "user_growth.csv", "user-growth")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "user-growth"} disabled={exportingPDF || (exportingCSV && exportingChart !== "user-growth") || !userGrowthData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("User Growth Trend", ["Month", "Users"], userGrowthData.map((d) => [d.month, d.users]), "line", userGrowthData, "user_growth.pdf", "user_growth", "user-growth")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "user-growth"} disabled={exportingCSV || (exportingPDF && exportingChart !== "user-growth") || !userGrowthData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'bandwidthTrend':
        return (
          <Card key={id} title="Bandwidth Consumption Trend">
            <div id="chart-bandwidth-trend" className="chart-container">
              <Line
                data={{
                  labels: bandwidthTrendData.map((d) => d.week),
                  datasets: [{
                    label: "Bandwidth (GB)",
                    data: bandwidthTrendData.map((d) => d.bandwidth),
                    borderColor: "#ff9800",
                    backgroundColor: "rgba(255,152,0,0.2)",
                    fill: true,
                    tension: 0.4,
                  }],
                }}
                options={chartOptions}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Week", "Bandwidth (GB)"], bandwidthTrendData.map((d) => [d.week, d.bandwidth]), "bandwidth_trend.csv", "bandwidth-trend")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "bandwidth-trend"} disabled={exportingPDF || (exportingCSV && exportingChart !== "bandwidth-trend") || !bandwidthTrendData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Bandwidth Consumption Trend", ["Week", "Bandwidth (GB)"], bandwidthTrendData.map((d) => [d.week, d.bandwidth]), "line", bandwidthTrendData, "bandwidth_trend.pdf", "bandwidth_trend", "bandwidth-trend")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "bandwidth-trend"} disabled={exportingCSV || (exportingPDF && exportingChart !== "bandwidth-trend") || !bandwidthTrendData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'guestCheckins':
        return (
          <Card key={id} title="Guest Check-ins by Hour">
            <div id="chart-guest-checkins" className="chart-container">
              <Bar
                data={{
                  labels: guestCheckinData.map((d) => d.hour),
                  datasets: [{
                    label: "Check-ins",
                    data: guestCheckinData.map((d) => d.checkins),
                    backgroundColor: "#3f51b5",
                    borderRadius: 4,
                  }],
                }}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Hour", "Check-ins"], guestCheckinData.map((d) => [d.hour, d.checkins]), "guest_checkins.csv", "guest-checkins")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "guest-checkins"} disabled={exportingPDF || (exportingCSV && exportingChart !== "guest-checkins") || !guestCheckinData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Guest Check-ins by Hour", ["Hour", "Check-ins"], guestCheckinData.map((d) => [d.hour, d.checkins]), "bar", guestCheckinData, "guest_checkins.pdf", "guest_checkins", "guest-checkins")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "guest-checkins"} disabled={exportingCSV || (exportingPDF && exportingChart !== "guest-checkins") || !guestCheckinData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'guestDuration':
        return (
          <Card key={id} title="Guest Duration of Stay">
            <div id="chart-guest-duration" className="chart-container">
              <Bar
                data={{
                  labels: guestDurationData.map((d) => d.duration),
                  datasets: [{
                    label: "Guests",
                    data: guestDurationData.map((d) => d.count),
                    backgroundColor: ["#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#00bcd4"],
                    borderRadius: 4,
                  }],
                }}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Duration", "Guests"], guestDurationData.map((d) => [d.duration, d.count]), "guest_duration.csv", "guest-duration")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "guest-duration"} disabled={exportingPDF || (exportingCSV && exportingChart !== "guest-duration") || !guestDurationData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Guest Duration of Stay", ["Duration", "Guests"], guestDurationData.map((d) => [d.duration, d.count]), "bar", guestDurationData, "guest_duration.pdf", "guest_duration", "guest-duration")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "guest-duration"} disabled={exportingCSV || (exportingPDF && exportingChart !== "guest-duration") || !guestDurationData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'topupPurchases':
        return (
          <Card key={id} title="Top-up Purchases">
            <div id="chart-topup-purchases" className="chart-container">
              <Bar
                data={{
                  labels: topupPurchasesData.map((d) => d.package),
                  datasets: [{
                    label: "Purchases",
                    data: topupPurchasesData.map((d) => d.count),
                    backgroundColor: ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107"],
                    borderRadius: 4,
                  }],
                }}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Package", "Purchases"], topupPurchasesData.map((d) => [d.package, d.count]), "topup_purchases.csv", "topup-purchases")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "topup-purchases"} disabled={exportingPDF || (exportingCSV && exportingChart !== "topup-purchases") || !topupPurchasesData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Top-up Purchases", ["Package", "Purchases"], topupPurchasesData.map((d) => [d.package, d.count]), "bar", topupPurchasesData, "topup_purchases.pdf", "topup_purchases", "topup-purchases")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "topup-purchases"} disabled={exportingCSV || (exportingPDF && exportingChart !== "topup-purchases") || !topupPurchasesData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'monthlyComparison':
        return (
          <Card key={id} title="Monthly Usage Comparison">
            <div id="chart-monthly-comparison" className="chart-container">
              <Bar
                data={{
                  labels: monthlyComparisonData.map((d) => d.period),
                  datasets: [{
                    label: "Usage (GB)",
                    data: monthlyComparisonData.map((d) => d.usage),
                    backgroundColor: ["#9e9e9e", "#004aad"],
                    borderRadius: 4,
                  }],
                }}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Period", "Usage (GB)"], monthlyComparisonData.map((d) => [d.period, d.usage]), "monthly_comparison.csv", "monthly-comparison")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "monthly-comparison"} disabled={exportingPDF || (exportingCSV && exportingChart !== "monthly-comparison") || !monthlyComparisonData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Monthly Usage Comparison", ["Period", "Usage (GB)"], monthlyComparisonData.map((d) => [d.period, d.usage]), "bar", monthlyComparisonData, "monthly_comparison.pdf", "monthly_comparison", "monthly-comparison")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "monthly-comparison"} disabled={exportingCSV || (exportingPDF && exportingChart !== "monthly-comparison") || !monthlyComparisonData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      case 'eveningDaytime':
        return (
          <Card key={id} title="Evening vs Daytime Usage">
            <div id="chart-evening-daytime" className="chart-container">
              <Doughnut
                data={{
                  labels: eveningDaytimeData.map((d) => d.period),
                  datasets: [{
                    data: eveningDaytimeData.map((d) => d.usage),
                    backgroundColor: eveningDaytimeData.map((d) => d.color),
                    borderWidth: 2,
                  }],
                }}
                options={pieChartOptions}
              />
            </div>
            <div className="export-btn-group">
              <Button variant="secondary" onClick={() => handleDashboardExportCSV(["Time Period", "Usage (%)"], eveningDaytimeData.map((d) => [d.period, `${d.usage}%`]), "evening_daytime_usage.csv", "evening-daytime")} aria-label={t('common.exportCsv')} loading={exportingCSV && exportingChart === "evening-daytime"} disabled={exportingPDF || (exportingCSV && exportingChart !== "evening-daytime") || !eveningDaytimeData?.length}>
                <FaFileCsv style={{ marginRight: 6 }} />{t('common.exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleDashboardExportPDF("Evening vs Daytime Usage", ["Time Period", "Usage (%)"], eveningDaytimeData.map((d) => [d.period, `${d.usage}%`]), "pie", eveningDaytimeData, "evening_daytime_usage.pdf", "evening_daytime", "evening-daytime")} aria-label={t('common.exportPdf')} loading={exportingPDF && exportingChart === "evening-daytime"} disabled={exportingCSV || (exportingPDF && exportingChart !== "evening-daytime") || !eveningDaytimeData?.length}>
                <FaFilePdf style={{ marginRight: 6 }} />{t('common.exportPdf')}
              </Button>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const safeNumber = (value, fallback = 0) => typeof value === "number" && !isNaN(value) ? value : fallback;

  // Filter activities to last 24 hours and sort by most recent first
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const filtered = recentActivities.filter(activity => {
      if (!activity.createdAt) return true; // Keep activities without timestamp
      const activityTime = new Date(activity.createdAt);
      return (now - activityTime) <= HOURS_24_IN_MS;
    });

    // Sort by createdAt descending (most recent first)
    return filtered.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA; // Descending order
    });
  }, [recentActivities, HOURS_24_IN_MS]);

  // Calculate total pages for the carousel
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE));

  // Get current page activities (page-level cyclic navigation, not item-level)
  const currentActivities = useMemo(() => {
    if (filteredActivities.length === 0) return [];
    const startIndex = activityPage * ACTIVITIES_PER_PAGE;
    const endIndex = startIndex + ACTIVITIES_PER_PAGE;
    // Slice returns the actual items for this page (may be less than 5 on last page)
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, activityPage, ACTIVITIES_PER_PAGE]);

  // Carousel navigation handlers (cyclic at page level)
  const handlePrevActivities = useCallback(() => {
    setActivityPage(prev => {
      if (totalPages <= 1) return 0;
      return prev === 0 ? totalPages - 1 : prev - 1;
    });
  }, [totalPages]);

  const handleNextActivities = useCallback(() => {
    setActivityPage(prev => {
      if (totalPages <= 1) return 0;
      return (prev + 1) % totalPages;
    });
  }, [totalPages]);

useEffect(() => {
  let mounted = true;
  let timeoutId = null;

  const loadDashboard = async () => {
    /* ========================================================================
     * BACKEND INTEGRATION: Load Dashboard Data
     * ========================================================================
     * API Endpoints (call in parallel):
     *
     * 1. GET /api/v1/dashboard/metrics
     *    Query: ?siteId={siteId}&segment={segment}&companyView={isCompanyView}
     *    Response: {
     *      activeUsers: number,
     *      activeUsersDelta: number,      // Change from previous period
     *      licenseUsagePercent: number,
     *      licenseUsageDelta: number,
     *      dataUsageTB: number,
     *      dataUsageDelta: number,
     *      networkUptime: number,
     *      uptimeDelta: number,
     *      totalAlerts: number,
     *      criticalAlerts: number,
     *      activeGuests: number,
     *      checkedInToday: number
     *    }
     *
     * 2. GET /api/v1/dashboard/charts/network-usage
     *    Query: ?siteId={siteId}&segment={segment}&days=90
     *    Response: {
     *      data: [{ date: "YYYY-MM-DD", usageGB: number }]
     *    }
     *
     * 3. GET /api/v1/dashboard/charts/speed-distribution
     *    Query: ?siteId={siteId}&segment={segment}
     *    Response: {
     *      data: [{ speedTier: string, userCount: number }]
     *    }
     *
     * 4. GET /api/v1/dashboard/charts/peak-usage
     *    Query: ?siteId={siteId}&segment={segment}&period=24h
     *    Response: {
     *      data: [{ period: string, usage: number }]
     *    }
     *
     * 5. GET /api/v1/dashboard/activities
     *    Query: ?siteId={siteId}&segment={segment}&limit=20
     *    Response: {
     *      activities: [{
     *        id: string,
     *        type: string,
     *        user: string,
     *        action: string,
     *        timestamp: ISO8601,
     *        details: object
     *      }]
     *    }
     *
     * 6. GET /api/v1/dashboard/alerts
     *    Query: ?siteId={siteId}&segment={segment}&status=active
     *    Response: {
     *      alerts: [{
     *        id: string,
     *        severity: "critical"|"warning"|"info",
     *        message: string,
     *        timestamp: ISO8601,
     *        acknowledged: boolean
     *      }]
     *    }
     *
     * Backend Processing:
     * - Aggregate data from multiple sources:
     *   - User database for user counts
     *   - AAA system for online users/sessions
     *   - Network monitoring for bandwidth/uptime
     *   - Activity logs for recent actions
     * - Cache dashboard data (5-minute TTL recommended)
     * - Support company-level aggregation (sum across sites)
     *
     * Sample Integration Code:
     * ------------------------
     * const [metricsRes, networkRes, speedRes, peakRes, activitiesRes] = await Promise.all([
     *   fetch(`/api/v1/dashboard/metrics?siteId=${siteId}&segment=${segment}`),
     *   fetch(`/api/v1/dashboard/charts/network-usage?siteId=${siteId}&segment=${segment}&days=90`),
     *   fetch(`/api/v1/dashboard/charts/speed-distribution?siteId=${siteId}&segment=${segment}`),
     *   fetch(`/api/v1/dashboard/charts/peak-usage?siteId=${siteId}&segment=${segment}`),
     *   fetch(`/api/v1/dashboard/activities?siteId=${siteId}&segment=${segment}&limit=20`)
     * ]);
     *
     * const metrics = await metricsRes.json();
     * const networkData = await networkRes.json();
     * // ... update state with fetched data
     *
     * Real-time Updates (Optional):
     * - WebSocket: wss://api/ws/dashboard/{siteId}
     * - Events: USER_CONNECTED, USER_DISCONNECTED, ALERT_NEW, DATA_USAGE_UPDATE
     * ======================================================================== */

    // TODO: Remove mock data and implement actual API calls above
    startLoading('dashboard');
    try {
      timeoutId = setTimeout(() => {
        if (mounted) {
          stopLoading('dashboard');
          setInitialLoad(false);
        }
      }, 600);
    } catch (error) {
      if (mounted) {
        notifications.operationFailed("load dashboard");
        stopLoading('dashboard');
        setInitialLoad(false);
      }
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const renderDashboardForSegment = () => (
    <>
      <Card
        title={t('dashboard.activeUsersCard')}
        icon={<FaUsers />}
        trendData={[
          1100, 1120, 1150, 1170, 1200,
          safeNumber(metrics.activeUsers - 2),
          safeNumber(metrics.activeUsers)
        ]}
        trendIncrease={safeNumber(metrics.activeUsersDelta, 0) >= 0}
      >
        {t('dashboard.activeUsersValue', { count: safeNumber(metrics.activeUsers) })}
      </Card>
      <Card
        title={t('dashboard.guestAccessCard', { defaultValue: 'Active Guests' })}
        icon={<FaUserClock />}
        trendData={[
          Math.max(0, metrics.activeGuests - 5),
          Math.max(0, metrics.activeGuests - 4),
          Math.max(0, metrics.activeGuests - 3),
          Math.max(0, metrics.activeGuests - 2),
          Math.max(0, metrics.activeGuests - 1),
          safeNumber(metrics.activeGuests)
        ]}
        trendIncrease={safeNumber(metrics.guestsDelta, 0) >= 0}
      >
        {t('dashboard.guestAccessValue', { count: safeNumber(metrics.activeGuests), checkedIn: safeNumber(metrics.checkedInToday), defaultValue: `${safeNumber(metrics.activeGuests)} Active (${safeNumber(metrics.checkedInToday)} today)` })}
      </Card>
      <Card
        title={t('dashboard.dataUsageCard')}
        icon={<FaUserFriends />}
        trendData={[
          1.0, 1.05, 1.1, 1.15,
          safeNumber(Math.round((metrics.dataUsageTB - 0.01) * 100) / 100),
          safeNumber(metrics.dataUsageTB)
        ]}
        trendIncrease={safeNumber(metrics.dataUsageDelta, 0) >= 0}
      >
        {t('dashboard.dataUsedValue', { value: safeNumber(metrics.dataUsageTB) })}
      </Card>
      <Card
        title={t('dashboard.networkUptimeCard')}
        icon={<FaCheckCircle />}
        trendData={[
          99.65, 99.72, 99.78, 99.85,
          safeNumber(metrics.networkUptime - 0.05),
          safeNumber(metrics.networkUptime)
        ]}
        trendIncrease={safeNumber(metrics.uptimeDelta, 0) >= 0}
      >
        {t('dashboard.uptimeValue', { percent: safeNumber(metrics.networkUptime) })}
      </Card>
    </>
  );

  const handleDashboardExportCSV = async (headers, rows, filename, chartId) => {
    setExportingCSV(true);
    setExportingChart(chartId);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 500);
      });
      exportChartDataToCSV({ headers, rows }, filename);
      notifications.exportSuccess("CSV");
    } catch (error) {
      notifications.exportFailed("CSV");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
      setExportingChart(null);
    }
  };

  const handleDashboardExportPDF = async (title, headers, rows, chartType, dataRows, filename, reportId, chartId) => {
    setExportingPDF(true);
    setExportingChart(chartId);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });

      // Determine chart configuration based on chartId for proper data mapping
      let chartData;
      let xLabel = "";
      let yLabel = "";

      // Map chartId to proper data structure and labels
      switch (chartId) {
        case "network-usage":
          chartData = {
            labels: dataRows.map((d) => d.day),
            datasets: [{
              label: "Network Usage (GB)",
              data: dataRows.map((d) => d.usageGB),
              borderColor: "#004aad",
              backgroundColor: "rgba(0,74,173,0.2)",
              fill: true,
              tension: 0.4,
            }],
          };
          xLabel = "Day";
          yLabel = "Network Usage (GB)";
          break;

        case "user-growth":
          chartData = {
            labels: dataRows.map((d) => d.month),
            datasets: [{
              label: "Users",
              data: dataRows.map((d) => d.users),
              borderColor: "#4caf50",
              backgroundColor: "rgba(76,175,80,0.2)",
              fill: true,
              tension: 0.4,
            }],
          };
          xLabel = "Month";
          yLabel = "Users";
          break;

        case "bandwidth-trend":
          chartData = {
            labels: dataRows.map((d) => d.week),
            datasets: [{
              label: "Bandwidth (GB)",
              data: dataRows.map((d) => d.bandwidth),
              borderColor: "#ff9800",
              backgroundColor: "rgba(255,152,0,0.2)",
              fill: true,
              tension: 0.4,
            }],
          };
          xLabel = "Week";
          yLabel = "Bandwidth (GB)";
          break;

        case "speed-tier":
          chartData = {
            labels: dataRows.map((d) => d.speedTier),
            datasets: [{
              label: "User Count",
              data: dataRows.map((d) => d.userCount),
              backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
              borderWidth: 1,
            }],
          };
          xLabel = "Speed Tier";
          yLabel = "User Count";
          break;

        case "peak-usage":
          chartData = {
            labels: dataRows.map((d) => d.period),
            datasets: [{
              label: "Usage %",
              data: dataRows.map((d) => d.usage),
              backgroundColor: "#2196f3",
              borderRadius: 4,
            }],
          };
          xLabel = "Time Period";
          yLabel = "Usage %";
          break;

        case "guest-checkins":
          chartData = {
            labels: dataRows.map((d) => d.hour),
            datasets: [{
              label: "Check-ins",
              data: dataRows.map((d) => d.checkins),
              backgroundColor: "#3f51b5",
              borderRadius: 4,
            }],
          };
          xLabel = "Hour";
          yLabel = "Check-ins";
          break;

        case "guest-duration":
          chartData = {
            labels: dataRows.map((d) => d.duration),
            datasets: [{
              label: "Guests",
              data: dataRows.map((d) => d.count),
              backgroundColor: "#9c27b0",
              borderRadius: 4,
            }],
          };
          xLabel = "Duration";
          yLabel = "Guests";
          break;

        case "topup-purchases":
          chartData = {
            labels: dataRows.map((d) => d.package),
            datasets: [{
              label: "Purchases",
              data: dataRows.map((d) => d.count),
              backgroundColor: "#ff5722",
              borderRadius: 4,
            }],
          };
          xLabel = "Package";
          yLabel = "Purchases";
          break;

        case "alert-distribution":
          chartData = {
            labels: dataRows.map((d) => d.alertType),
            datasets: [{
              label: "Alerts",
              data: dataRows.map((d) => d.count),
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            }],
          };
          break;

        case "device-status":
          chartData = {
            labels: dataRows.map((d) => d.status),
            datasets: [{
              label: "Devices",
              data: dataRows.map((d) => d.count),
              backgroundColor: ["#4caf50", "#f44336", "#9e9e9e"],
            }],
          };
          break;

        default:
          // Fallback: try to infer from data structure
          if (dataRows.length > 0) {
            const keys = Object.keys(dataRows[0]);
            const labelKey = keys[0];
            const valueKey = keys[1];
            chartData = {
              labels: dataRows.map((d) => d[labelKey]),
              datasets: [{
                label: title,
                data: dataRows.map((d) => d[valueKey]),
                borderColor: "#004aad",
                backgroundColor: chartType === "line" ? "rgba(0,74,173,0.2)" : "#004aad",
                fill: chartType === "line",
                tension: chartType === "line" ? 0.4 : undefined,
              }],
            };
            xLabel = labelKey;
            yLabel = valueKey;
          }
          break;
      }

      const exportChartOptions = getStandardChartOptions({
        type: chartType,
        title,
        xLabel,
        yLabel,
        darkMode: false,
        forExport: true,
      });

      const { width, height } = EXPORT_CANVAS_SIZES[chartType] || { width: 900, height: 450 };

      await exportReportPDF({
        title,
        headers,
        rows,
        chartData,
        chartOptions: exportChartOptions,
        filename,
        rolePermissions: { canViewReports: hasPermission('canViewReports') },
        exportCanvasWidth: width,
        exportCanvasHeight: height,
        reportId: reportId,
        criteria: null,
        addWatermark: false,
        watermarkText: "CONFIDENTIAL",
        disclaimerText: "This report contains confidential information. Data is subject to change. For internal use only."
      });

      notifications.exportSuccess("PDF");
    } catch (error) {
      notifications.exportFailed("PDF");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingPDF(false);
      setExportingChart(null);
    }
  };

  // Company-level chart export handler for PDF
  const handleCompanyChartExportPDF = async (title, headers, rows, chartType, dataRows, filename, reportId, chartId) => {
    setExportingPDF(true);
    setExportingChart(chartId);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });

      let chartData;
      if (chartType === "bar") {
        // Determine if it's a grouped bar chart or single
        const hasActive = dataRows[0]?.active !== undefined;
        if (hasActive) {
          chartData = {
            labels: dataRows.map((d) => d.name),
            datasets: [
              {
                label: headers[1] || "Total",
                data: dataRows.map((d) => d.value),
                backgroundColor: "#004aad",
              },
              {
                label: headers[2] || "Active",
                data: dataRows.map((d) => d.active),
                backgroundColor: "#4caf50",
              }
            ],
          };
        } else {
          chartData = {
            labels: dataRows.map((d) => d.name),
            datasets: [{
              label: headers[1] || "Usage",
              data: dataRows.map((d) => d.usage || d.value),
              backgroundColor: dataRows.map(d =>
                (d.usage || 0) >= 80 ? '#f44336' : (d.usage || 0) >= 60 ? '#ff9800' : '#4caf50'
              ),
              borderRadius: 4,
            }],
          };
        }
      }

      const exportChartOptions = getStandardChartOptions({
        type: chartType,
        title,
        xLabel: "Site",
        yLabel: headers[1] || "Value",
        darkMode: false,
        forExport: true,
      });

      const { width, height } = EXPORT_CANVAS_SIZES[chartType];

      await exportReportPDF({
        title: `${segmentCompany.name} - ${title}`,
        headers,
        rows,
        chartData,
        chartOptions: exportChartOptions,
        filename,
        rolePermissions: { canViewReports: hasPermission('canViewReports') },
        exportCanvasWidth: width,
        exportCanvasHeight: height,
        reportId: reportId,
        criteria: null,
        addWatermark: false,
        watermarkText: "CONFIDENTIAL",
        disclaimerText: `Company: ${segmentCompany.name} | Generated: ${new Date().toLocaleString()}`
      });

      notifications.exportSuccess("PDF");
    } catch (error) {
      notifications.exportFailed("PDF");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingPDF(false);
      setExportingChart(null);
    }
  };

  // Company-level export all data as CSV
  const handleCompanyExportAllCSV = async () => {
    setExportingCSV(true);
    setExportingChart("company-all");
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 500);
      });

      // Combine all company data into one CSV
      const companyOverviewData = [
        ["Company Overview Report", ""],
        ["Company Name", segmentCompany.name],
        ["Total Sites", companyStats.totalSites],
        ["Total Users", companyStats.totalUsers],
        ["Active Guests", "68"],
        ["Network Uptime", "99.92%"],
        ["Report Generated", new Date().toLocaleString()],
        [""],
        ["Users by Site"],
        ["Site", "Total Users", "Active Users"],
        ...companyChartData.usersBySite.map(s => [s.name, s.value, s.active]),
        [""],
        ["Devices by Site"],
        ["Site", "Total Devices", "Active Devices"],
        ...companyChartData.devicesBySite.map(s => [s.name, s.value, s.active]),
        [""],
        ["Bandwidth Utilization by Site"],
        ["Site", "Bandwidth Usage (%)"],
        ...companyChartData.bandwidthBySite.map(s => [s.name, `${s.usage}%`]),
      ];

      exportChartDataToCSV({
        headers: [],
        rows: companyOverviewData
      }, `${segmentCompany.name.replace(/\s+/g, '_')}_company_analytics.csv`);

      notifications.exportSuccess("CSV");
    } catch (error) {
      notifications.exportFailed("CSV");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
      setExportingChart(null);
    }
  };

  // Company-level export all data as PDF
  const handleCompanyExportAllPDF = async () => {
    setExportingPDF(true);
    setExportingChart("company-all");
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1500);
      });

      // Create comprehensive chart data for PDF
      const chartData = {
        labels: companyChartData.usersBySite.map(s => s.name),
        datasets: [
          {
            label: "Total Users",
            data: companyChartData.usersBySite.map(s => s.value),
            backgroundColor: "#004aad",
          },
          {
            label: "Active Users",
            data: companyChartData.usersBySite.map(s => s.active),
            backgroundColor: "#4caf50",
          }
        ],
      };

      const exportChartOptions = getStandardChartOptions({
        type: "bar",
        title: "Users by Site",
        xLabel: "Site",
        yLabel: "Users",
        darkMode: false,
        forExport: true,
      });

      const { width, height } = EXPORT_CANVAS_SIZES.bar;

      // Comprehensive rows for the PDF table
      const allRows = [
        ["Overview", "", ""],
        ["Total Sites", companyStats.totalSites, ""],
        ["Total Users", companyStats.totalUsers, ""],
        ["Active Guests", "68", ""],
        ["Network Uptime", "99.92%", ""],
        ["", "", ""],
        ["Users by Site", "Total", "Active"],
        ...companyChartData.usersBySite.map(s => [s.name, s.value, s.active]),
        ["", "", ""],
        ["Devices by Site", "Total", "Active"],
        ...companyChartData.devicesBySite.map(s => [s.name, s.value, s.active]),
        ["", "", ""],
        ["Bandwidth by Site", "Usage %", ""],
        ...companyChartData.bandwidthBySite.map(s => [s.name, `${s.usage}%`, ""]),
      ];

      await exportReportPDF({
        title: `${segmentCompany.name} - Company Analytics Report`,
        headers: ["Metric", "Value", "Additional"],
        rows: allRows,
        chartData,
        chartOptions: exportChartOptions,
        filename: `${segmentCompany.name.replace(/\s+/g, '_')}_company_analytics.pdf`,
        rolePermissions: { canViewReports: hasPermission('canViewReports') },
        exportCanvasWidth: width,
        exportCanvasHeight: height,
        reportId: "company_analytics",
        criteria: null,
        addWatermark: false,
        watermarkText: "CONFIDENTIAL",
        disclaimerText: `Company: ${segmentCompany.name} | Report Type: Company Analytics | Generated: ${new Date().toLocaleString()}`
      });

      notifications.exportSuccess("PDF");
    } catch (error) {
      notifications.exportFailed("PDF");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingPDF(false);
      setExportingChart(null);
    }
  };

  const handleSupportQuickAction = () => {
    navigate('/support');
  };

  const handleQuickAction = (path, requiredPermission) => {
    if (requiredPermission && !hasPermission(requiredPermission)) {
      notifications.noPermission(`access ${path.replace('/', '')}`);
      return;
    }
    navigate(path);
  };

  const quickActions = [
    {
      icon: FaUsers,
      labelKey: "dashboard.addUser",
      onClick: () => handleQuickAction('/users?add=1', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaUserClock,
      labelKey: "dashboard.manageGuests",
      label: "Manage Guests",
      onClick: () => handleQuickAction('/guests', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaChartPie,
      labelKey: "nav.reporting",
      onClick: () => handleQuickAction('/reports', 'canViewReports'),
      permission: 'canViewReports',
    },
    {
      icon: FaLifeRing,
      labelKey: "dashboard.support",
      onClick: handleSupportQuickAction,
      permission: 'canViewReports',
    },
    {
      icon: FaExclamationCircle,
      labelKey: "dashboard.logs",
      onClick: () => handleQuickAction('/logs', 'canViewLogs'),
      permission: 'canViewLogs',
    },
  ];

  const accessibleQuickActions = quickActions.filter(action => {
    if (!action.permission) return true;
    return hasPermission(action.permission);
  });

  // Company-level stats and chart data - Now segment-specific
  const segmentData = useSegmentCompanyData();
  const companyStats = useMemo(() => segmentData.stats, [segmentData.stats]);
  const companyChartData = useMemo(() => segmentData.chartData, [segmentData.chartData]);
  const segmentCompany = useMemo(() => segmentData.company, [segmentData.company]);
  const segmentSites = useMemo(() => segmentData.sites, [segmentData.sites]);
  const segmentActivityLogs = useMemo(() => segmentData.activityLogs, [segmentData.activityLogs]);

  // Render Company Dashboard View
  const renderCompanyDashboard = () => (
    <main className="main-content" role="main" aria-label="Company Dashboard">
      {(exportingCSV || exportingPDF) && (
        <LoadingOverlay
          active={true}
          message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
          fullPage={false}
        />
      )}

      <h1 className="dashboard-title">{segmentCompany.name}</h1>

      {/* Company-level info banner */}
      <div className="company-info-banner">
        <FaBuilding className="banner-icon" />
        <div className="banner-content">
          <span className="banner-text">You are viewing company-level data across all sites</span>
          <span className="banner-subtext">Select a site below to view details or make changes</span>
        </div>
      </div>

      <h2 className="dashboard-section-title">Company Overview</h2>
      <section className="dashboard-cards company-overview-cards" aria-label="Company summary cards">
        <Card
          title="Total Sites"
          icon={<FaBuilding />}
          trendData={[4, 5, 5, 6, 6, 6]}
          trendIncrease={true}
        >
          {companyStats.totalSites} Sites
        </Card>
        <Card
          title="Total Users"
          icon={<FaUsers />}
          trendData={[2500, 2600, 2700, 2750, 2800, companyStats.totalUsers]}
          trendIncrease={true}
        >
          {companyStats.totalUsers.toLocaleString()} Users
        </Card>
        <Card
          title="Active Guests"
          icon={<FaUserClock />}
          trendData={[42, 48, 52, 58, 62, 68]}
          trendIncrease={true}
        >
          68 Across All Sites
        </Card>
        <Card
          title="Network Uptime"
          icon={<FaCheckCircle />}
          trendData={[99.65, 99.72, 99.78, 99.85, 99.88, 99.92]}
          trendIncrease={true}
        >
          99.92% This Month
        </Card>
      </section>

      <h2 className="dashboard-section-title">Your Sites</h2>
      <SitesOverview />

      <h2 className="dashboard-section-title">Company Analytics</h2>

      {/* Company-level Export All Button */}
      <div className="company-export-actions">
        <Button
          variant="secondary"
          onClick={() => handleCompanyExportAllCSV()}
          disabled={exportingCSV || exportingPDF || !companyChartData.usersBySite?.length}
          loading={exportingCSV && exportingChart === "company-all"}
        >
          <FaFileCsv style={{ marginRight: 6 }} />
          Export All Data (CSV)
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleCompanyExportAllPDF()}
          disabled={exportingCSV || exportingPDF || !companyChartData.usersBySite?.length}
          loading={exportingPDF && exportingChart === "company-all"}
        >
          <FaFilePdf style={{ marginRight: 6 }} />
          Export All Data (PDF)
        </Button>
      </div>

      <section className="dashboard-charts company-charts" aria-label="Company analytics charts">
        <Card title="Users by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.usersBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Total Users",
                    data: companyChartData.usersBySite.map(s => s.value),
                    backgroundColor: "#004aad",
                  },
                  {
                    label: "Active Users",
                    data: companyChartData.usersBySite.map(s => s.active),
                    backgroundColor: "#4caf50",
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  ["Site", "Total Users", "Active Users"],
                  companyChartData.usersBySite.map(s => [s.name, s.value, s.active]),
                  "company_users_by_site.csv",
                  "company-users"
                )
              }
              aria-label="Export CSV"
              loading={exportingCSV && exportingChart === "company-users"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "company-users") || !companyChartData.usersBySite?.length}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleCompanyChartExportPDF(
                  "Users by Site",
                  ["Site", "Total Users", "Active Users"],
                  companyChartData.usersBySite.map(s => [s.name, s.value, s.active]),
                  "bar",
                  companyChartData.usersBySite,
                  "company_users_by_site.pdf",
                  "company_users_by_site",
                  "company-users"
                )
              }
              aria-label="Export PDF"
              loading={exportingPDF && exportingChart === "company-users"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "company-users") || !companyChartData.usersBySite?.length}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              PDF
            </Button>
          </div>
        </Card>

        <Card title="Devices by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.devicesBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Total Devices",
                    data: companyChartData.devicesBySite.map(s => s.value),
                    backgroundColor: "#3f51b5",
                  },
                  {
                    label: "Active Devices",
                    data: companyChartData.devicesBySite.map(s => s.active),
                    backgroundColor: "#8bc34a",
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  ["Site", "Total Devices", "Active Devices"],
                  companyChartData.devicesBySite.map(s => [s.name, s.value, s.active]),
                  "company_devices_by_site.csv",
                  "company-devices"
                )
              }
              aria-label="Export CSV"
              loading={exportingCSV && exportingChart === "company-devices"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "company-devices") || !companyChartData.devicesBySite?.length}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleCompanyChartExportPDF(
                  "Devices by Site",
                  ["Site", "Total Devices", "Active Devices"],
                  companyChartData.devicesBySite.map(s => [s.name, s.value, s.active]),
                  "bar",
                  companyChartData.devicesBySite,
                  "company_devices_by_site.pdf",
                  "company_devices_by_site",
                  "company-devices"
                )
              }
              aria-label="Export PDF"
              loading={exportingPDF && exportingChart === "company-devices"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "company-devices") || !companyChartData.devicesBySite?.length}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              PDF
            </Button>
          </div>
        </Card>

        <Card title="Bandwidth Utilization by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.bandwidthBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Bandwidth Usage (%)",
                    data: companyChartData.bandwidthBySite.map(s => s.usage),
                    backgroundColor: companyChartData.bandwidthBySite.map(s =>
                      s.usage >= 80 ? '#f44336' : s.usage >= 60 ? '#ff9800' : '#4caf50'
                    ),
                    borderRadius: 4,
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  ["Site", "Bandwidth Usage (%)"],
                  companyChartData.bandwidthBySite.map(s => [s.name, `${s.usage}%`]),
                  "company_bandwidth_by_site.csv",
                  "company-bandwidth"
                )
              }
              aria-label="Export CSV"
              loading={exportingCSV && exportingChart === "company-bandwidth"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "company-bandwidth") || !companyChartData.bandwidthBySite?.length}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleCompanyChartExportPDF(
                  "Bandwidth Utilization by Site",
                  ["Site", "Bandwidth Usage (%)"],
                  companyChartData.bandwidthBySite.map(s => [s.name, `${s.usage}%`]),
                  "bar",
                  companyChartData.bandwidthBySite,
                  "company_bandwidth_by_site.pdf",
                  "company_bandwidth_by_site",
                  "company-bandwidth"
                )
              }
              aria-label="Export PDF"
              loading={exportingPDF && exportingChart === "company-bandwidth"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "company-bandwidth") || !companyChartData.bandwidthBySite?.length}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              PDF
            </Button>
          </div>
        </Card>
      </section>

      <h2 className="dashboard-section-title">Recent Company Activity</h2>
      <Card title="" className="recent-activities-card company-activities" aria-label="Recent company activities">
        <ul className="activity-list company-activity-list">
          {segmentActivityLogs.slice(0, 5).map((log) => (
            <li key={log.id} className={`activity-item severity-${log.severity}`}>
              <span className="activity-site-badge">{log.site}</span>
              <span className="activity-text">{log.action}: {log.details}</span>
              <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );

  if (initialLoad) {
    return (
      <main className="main-content" role="main" aria-label="Dashboard">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <h2 className="dashboard-section-title">{t('dashboard.overview')}</h2>
        <section className="dashboard-cards">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </section>
        
        <h2 className="dashboard-section-title">{t('dashboard.quickActions')}</h2>
        <div className="quick-actions-row">
          {[...Array(5)].map((_, i) => (
            <SkeletonLoader key={i} variant="rect" height={80} />
          ))}
        </div>

        <h2 className="dashboard-section-title">{t('dashboard.networkAnalytics')}</h2>
        <section className="dashboard-charts">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
              <SkeletonLoader variant="rect" height={200} />
            </div>
          ))}
        </section>

        <h2 className="dashboard-section-title">{t('dashboard.recentActivities')}</h2>
        <SkeletonLoader variant="card" />
      </main>
    );
  }

  // Render company dashboard if in company view
  if (isCompanyView) {
    return renderCompanyDashboard();
  }

  // Render site-level dashboard (existing view)
  return (
    <main
      className="main-content"
      role="main"
      aria-label="Dashboard"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {(exportingCSV || exportingPDF) && (
        <LoadingOverlay
          active={true}
          message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
          fullPage={false}
        />
      )}

      <h1 className="dashboard-title">{t('dashboard.title')}</h1>
      <h2 className="dashboard-section-title">{t('dashboard.overview')}</h2>
      <section className="dashboard-cards" aria-label="Dashboard summary cards">
        {renderDashboardForSegment()}
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.quickActions')}</h2>
      <section className="dashboard-quick-actions" aria-label="Quick actions">
        {accessibleQuickActions.length === 0 ? (
          <div className="no-quick-actions">
            <p>{t('dashboard.noQuickActions')}</p>
          </div>
        ) : (
          <div className="quick-actions-row">
            {accessibleQuickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                tabIndex={0}
                role="button"
                aria-label={t(action.labelKey)}
                onClick={action.onClick}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    action.onClick();
                    e.preventDefault();
                  }
                }}
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                <div className="quick-action-content">
                  <action.icon className="quick-action-icon" />
                  <span className="quick-action-label">{t(action.labelKey)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.networkAnalytics')}</h2>
      <section className="dashboard-charts" aria-label="Dashboard charts section">
        {selectedCharts.map(chart => renderChart(chart))}
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.recentActivities')}</h2>
      <Card title="" className="recent-activities-card" aria-label="Recent user activities">
        <div className="activities-carousel">
          <button
            className="carousel-nav carousel-nav-left"
            onClick={handlePrevActivities}
            aria-label={t('common.previous')}
            disabled={totalPages <= 1}
          >
            <FaChevronLeft />
          </button>

          <ul className="activity-list">
            {currentActivities.map((activity, i) => (
              <li key={`${activity.id || i}-${activityPage}`} className="activity-item" tabIndex={0}>
                <span className="activity-text">{activity.text}</span>
                <span className="activity-time">{activity.time}</span>
              </li>
            ))}
            {currentActivities.length === 0 && (
              <li className="activity-item activity-empty">
                <span className="activity-text">{t('activities.noActivities')}</span>
              </li>
            )}
          </ul>

          <button
            className="carousel-nav carousel-nav-right"
            onClick={handleNextActivities}
            aria-label={t('common.next')}
            disabled={totalPages <= 1}
          >
            <FaChevronRight />
          </button>
        </div>

        {totalPages > 1 && (
          <div className="activities-pagination">
            <span className="pagination-info">
              {activityPage + 1} / {totalPages}
            </span>
          </div>
        )}
      </Card>
    </main>
  );
};

export default Dashboard;