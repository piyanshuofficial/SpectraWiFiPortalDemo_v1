// src/pages/Internal/InternalReports.js

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaSearch,
  FaEye,
  FaFileCsv,
  FaFilePdf,
  FaStar,
  FaRegStar,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaWifi,
  FaNetworkWired,
  FaShieldAlt,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaServer,
  FaExclamationTriangle,
  FaTicketAlt,
  FaSpinner,
  FaFileInvoiceDollar,
  FaDatabase,
  FaUserCog,
  FaGlobe,
  FaClipboardCheck,
  FaKey,
  FaShoppingCart,
  FaSitemap,
} from "react-icons/fa";
import {
  customers,
  sites,
  platformMetrics,
} from "@constants/internalPortalData";
import {
  MASTER_REPORT_CONFIG,
  REPORT_CATEGORIES,
  getAllReports as getCustomerReports,
} from "@config/masterReportConfig";
import notifications from "@utils/notifications";
import { exportReportPDF } from "@utils/exportReportPDF";
import { exportChartDataToCSV } from "@utils/exportUtils";
import "./InternalReports.css";

// Map customer portal categories to icons
const customerCategoryIcons = {
  [REPORT_CATEGORIES.BILLING]: FaFileInvoiceDollar,
  [REPORT_CATEGORIES.USAGE]: FaDatabase,
  [REPORT_CATEGORIES.WIFI_NETWORK]: FaWifi,
  [REPORT_CATEGORIES.END_USER]: FaUserCog,
  [REPORT_CATEGORIES.INTERNET]: FaGlobe,
  [REPORT_CATEGORIES.SLA]: FaClipboardCheck,
  [REPORT_CATEGORIES.AUTHENTICATION]: FaKey,
  [REPORT_CATEGORIES.UPSELL]: FaShoppingCart,
  [REPORT_CATEGORIES.COMPANY]: FaSitemap,
};

// Internal-specific report categories
const internalReportCategories = [
  { id: "all", name: "All Reports", icon: FaChartLine },
  // Internal platform categories
  { id: "platform", name: "Platform Analytics", icon: FaServer, section: "internal" },
  { id: "customer", name: "Customer Reports", icon: FaBuilding, section: "internal" },
  { id: "site", name: "Site Performance", icon: FaMapMarkerAlt, section: "internal" },
  { id: "network", name: "Network & Bandwidth", icon: FaNetworkWired, section: "internal" },
  { id: "security", name: "Security & Compliance", icon: FaShieldAlt, section: "internal" },
  { id: "support", name: "Support & Tickets", icon: FaTicketAlt, section: "internal" },
  // Customer portal categories - separate section
  { id: "cp-billing", name: "Billing", icon: FaFileInvoiceDollar, section: "customer-portal", cpCategory: REPORT_CATEGORIES.BILLING },
  { id: "cp-usage", name: "Usage", icon: FaDatabase, section: "customer-portal", cpCategory: REPORT_CATEGORIES.USAGE },
  { id: "cp-wifi", name: "Wi-Fi Network", icon: FaWifi, section: "customer-portal", cpCategory: REPORT_CATEGORIES.WIFI_NETWORK },
  { id: "cp-enduser", name: "End-User", icon: FaUserCog, section: "customer-portal", cpCategory: REPORT_CATEGORIES.END_USER },
  { id: "cp-internet", name: "Internet", icon: FaGlobe, section: "customer-portal", cpCategory: REPORT_CATEGORIES.INTERNET },
  { id: "cp-sla", name: "SLA", icon: FaClipboardCheck, section: "customer-portal", cpCategory: REPORT_CATEGORIES.SLA },
  { id: "cp-auth", name: "Authentication", icon: FaKey, section: "customer-portal", cpCategory: REPORT_CATEGORIES.AUTHENTICATION },
  { id: "cp-upsell", name: "Upsell", icon: FaShoppingCart, section: "customer-portal", cpCategory: REPORT_CATEGORIES.UPSELL },
  { id: "cp-company", name: "Company", icon: FaSitemap, section: "customer-portal", cpCategory: REPORT_CATEGORIES.COMPANY },
];

// Internal reports data
const internalReports = [
  // Platform Analytics
  {
    id: "platform_overview",
    name: "Platform Overview Dashboard",
    description: "High-level metrics across all customers and sites",
    category: "platform",
    icon: FaChartPie,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_growth",
    name: "Customer Growth Analysis",
    description: "Month-over-month customer acquisition and retention metrics",
    category: "platform",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_deployment",
    name: "Site Deployment Tracker",
    description: "Track site provisioning, activation, and deployment timelines",
    category: "platform",
    icon: FaMapMarkerAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "license_utilization",
    name: "License Utilization Report",
    description: "License usage across all customers with capacity planning insights",
    category: "platform",
    icon: FaServer,
    exportFormats: ["csv", "pdf"],
  },
  // Customer Reports
  {
    id: "customer_summary",
    name: "Customer Summary Report",
    description: "Comprehensive overview of all customers with key metrics",
    category: "customer",
    icon: FaBuilding,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_revenue",
    name: "Customer Revenue Analysis",
    description: "Revenue breakdown by customer, segment, and region",
    category: "customer",
    icon: FaChartBar,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_health",
    name: "Customer Health Score",
    description: "Customer health metrics including uptime, usage, and satisfaction",
    category: "customer",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "contract_expiry",
    name: "Contract Expiry Report",
    description: "Upcoming contract renewals and expirations",
    category: "customer",
    icon: FaCalendarAlt,
    exportFormats: ["csv", "pdf"],
  },
  // Site Performance
  {
    id: "site_status",
    name: "Site Status Report",
    description: "Real-time status of all sites with health indicators",
    category: "site",
    icon: FaMapMarkerAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_uptime",
    name: "Site Uptime Analysis",
    description: "Historical uptime data and SLA compliance metrics",
    category: "site",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_capacity",
    name: "Site Capacity Report",
    description: "User and device capacity utilization per site",
    category: "site",
    icon: FaUsers,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "regional_performance",
    name: "Regional Performance",
    description: "Performance breakdown by geographical region",
    category: "site",
    icon: FaChartPie,
    exportFormats: ["csv", "pdf"],
  },
  // Network & Bandwidth
  {
    id: "bandwidth_utilization",
    name: "Bandwidth Utilization Report",
    description: "Network bandwidth usage across all sites",
    category: "network",
    icon: FaNetworkWired,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "device_inventory",
    name: "Device Inventory Report",
    description: "Complete inventory of network devices across all sites",
    category: "network",
    icon: FaWifi,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "traffic_analysis",
    name: "Traffic Analysis Report",
    description: "Network traffic patterns and peak usage analysis",
    category: "network",
    icon: FaChartBar,
    exportFormats: ["csv", "pdf"],
  },
  // Security & Compliance
  {
    id: "security_audit",
    name: "Security Audit Report",
    description: "Security events, vulnerabilities, and compliance status",
    category: "security",
    icon: FaShieldAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "access_logs",
    name: "Access Logs Report",
    description: "User access patterns and authentication logs",
    category: "security",
    icon: FaUsers,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "incident_report",
    name: "Security Incident Report",
    description: "Security incidents and response metrics",
    category: "security",
    icon: FaExclamationTriangle,
    exportFormats: ["csv", "pdf"],
  },
  // Support & Tickets
  {
    id: "ticket_summary",
    name: "Support Ticket Summary",
    description: "Overview of support tickets by status, priority, and category",
    category: "support",
    icon: FaTicketAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "sla_performance",
    name: "SLA Performance Report",
    description: "SLA compliance and response time metrics",
    category: "support",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_satisfaction",
    name: "Customer Satisfaction Report",
    description: "CSAT scores and feedback analysis",
    category: "support",
    icon: FaStar,
    exportFormats: ["csv", "pdf"],
  },
];

// Generate sample report data for all reports
const generateReportData = (reportId) => {
  switch (reportId) {
    // Platform Analytics
    case "platform_overview":
      return [
        { Metric: "Total Customers", Value: platformMetrics.overview.totalCustomers, "Change (%)": "+5.2", Period: "vs Last Month" },
        { Metric: "Total Sites", Value: platformMetrics.overview.totalSites, "Change (%)": "+8.1", Period: "vs Last Month" },
        { Metric: "Active Users", Value: platformMetrics.overview.activeUsers, "Change (%)": "+12.3", Period: "vs Last Month" },
        { Metric: "Total Devices", Value: platformMetrics.overview.totalDevices, "Change (%)": "+15.6", Period: "vs Last Month" },
        { Metric: "Total Licenses", Value: platformMetrics.overview.totalLicenses, "Change (%)": "+6.8", Period: "vs Last Month" },
        { Metric: "Used Bandwidth (Mbps)", Value: platformMetrics.overview.usedBandwidth, "Change (%)": "+22.4", Period: "vs Last Month" },
        { Metric: "Platform Uptime (%)", Value: "99.97", "Change (%)": "+0.02", Period: "vs Last Month" },
        { Metric: "Avg Response Time (ms)", Value: "45", "Change (%)": "-8.2", Period: "vs Last Month" },
      ];

    case "customer_growth":
      return [
        { Month: "Jan 2024", "New Customers": 3, "Churned": 0, "Net Growth": 3, "Total Customers": 12, "MRR (₹)": "24,50,000" },
        { Month: "Dec 2023", "New Customers": 2, "Churned": 1, "Net Growth": 1, "Total Customers": 9, "MRR (₹)": "21,80,000" },
        { Month: "Nov 2023", "New Customers": 4, "Churned": 0, "Net Growth": 4, "Total Customers": 8, "MRR (₹)": "19,20,000" },
        { Month: "Oct 2023", "New Customers": 1, "Churned": 1, "Net Growth": 0, "Total Customers": 4, "MRR (₹)": "12,50,000" },
        { Month: "Sep 2023", "New Customers": 2, "Churned": 0, "Net Growth": 2, "Total Customers": 4, "MRR (₹)": "11,00,000" },
        { Month: "Aug 2023", "New Customers": 2, "Churned": 0, "Net Growth": 2, "Total Customers": 2, "MRR (₹)": "6,50,000" },
      ];

    case "site_deployment":
      return [
        { Site: "The Oberoi, Udaipur", Customer: "Oberoi Hotels", Status: "In Progress", "Start Date": "10 Jan 2024", "Target Date": "25 Jan 2024", "Phase": "Network Setup", "Progress (%)": 65 },
        { Site: "WeWork Whitefield", Customer: "WeWork India", Status: "Pending Approval", "Start Date": "15 Jan 2024", "Target Date": "05 Feb 2024", "Phase": "Site Survey", "Progress (%)": 20 },
        { Site: "Zolo Sunrise, Pune", Customer: "Zolo Stays", Status: "Completed", "Start Date": "01 Dec 2023", "Target Date": "20 Dec 2023", "Phase": "Live", "Progress (%)": 100 },
        { Site: "Stanza Living Rome", Customer: "Stanza Living", Status: "In Progress", "Start Date": "05 Jan 2024", "Target Date": "30 Jan 2024", "Phase": "AP Installation", "Progress (%)": 75 },
        { Site: "The Oberoi, Goa", Customer: "Oberoi Hotels", Status: "Scheduled", "Start Date": "01 Feb 2024", "Target Date": "28 Feb 2024", "Phase": "Planning", "Progress (%)": 10 },
      ];

    case "license_utilization":
      return customers.map(c => ({
        Customer: c.name,
        "License Tier": c.licenseTier || "Standard",
        "Total Licenses": Math.round(c.totalUsers * 1.2),
        "Used Licenses": c.totalUsers,
        "Available": Math.round(c.totalUsers * 0.2),
        "Utilization (%)": Math.round((c.totalUsers / (c.totalUsers * 1.2)) * 100),
        "Expiry Date": c.contractEnd || "2024-12-31",
      }));

    // Customer Reports
    case "customer_summary":
      return customers.map(c => ({
        Customer: c.name,
        Type: c.type,
        Status: c.status,
        Sites: c.totalSites,
        "Active Sites": c.activeSites,
        Users: c.totalUsers,
        Devices: c.totalDevices,
        "Account Manager": c.accountManager,
      }));

    case "customer_revenue":
      return customers.map(c => ({
        Customer: c.name,
        Segment: c.type,
        "Monthly Revenue (₹)": `${(c.totalUsers * 150 + c.totalSites * 5000).toLocaleString()}`,
        "Annual Value (₹)": `${((c.totalUsers * 150 + c.totalSites * 5000) * 12).toLocaleString()}`,
        "Payment Status": "Current",
        "Last Payment": "05 Jan 2024",
        "Outstanding (₹)": "0",
      }));

    case "customer_health":
      return customers.map(c => ({
        Customer: c.name,
        "Health Score": Math.floor(Math.random() * 20) + 80,
        "Uptime (%)": (98 + Math.random() * 2).toFixed(2),
        "Ticket Volume": Math.floor(Math.random() * 10),
        "Response Time (hrs)": (Math.random() * 4 + 1).toFixed(1),
        "User Satisfaction": (4 + Math.random()).toFixed(1),
        "Risk Level": Math.random() > 0.8 ? "Medium" : "Low",
      }));

    case "contract_expiry":
      return [
        { Customer: "Zolo Stays", "Contract End": "2024-07-19", "Days Remaining": 186, "Contract Value (₹)": "18,50,000", "Renewal Status": "Pending Discussion", "Account Manager": "Sneha Reddy" },
        { Customer: "WeWork India", "Contract End": "2024-05-31", "Days Remaining": 137, "Contract Value (₹)": "85,00,000", "Renewal Status": "Renewal Sent", "Account Manager": "Vikram Singh" },
        { Customer: "Nestaway Technologies", "Contract End": "2024-09-30", "Days Remaining": 259, "Contract Value (₹)": "32,00,000", "Renewal Status": "On Track", "Account Manager": "Priya Sharma" },
        { Customer: "Oberoi Hotels", "Contract End": "2025-01-14", "Days Remaining": 365, "Contract Value (₹)": "1,25,00,000", "Renewal Status": "On Track", "Account Manager": "Anita Desai" },
        { Customer: "Stanza Living", "Contract End": "2025-03-31", "Days Remaining": 441, "Contract Value (₹)": "55,00,000", "Renewal Status": "On Track", "Account Manager": "Rahul Mehta" },
      ];

    // Site Performance
    case "site_status":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        City: s.city,
        Region: s.region,
        Status: s.status,
        "Active Users": s.activeUsers,
        "Online Devices": s.onlineDevices,
        "Uptime %": s.uptime,
        Alerts: s.alerts,
      }));

    case "site_uptime":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        "Current Uptime (%)": s.uptime,
        "30-Day Avg (%)": (s.uptime - Math.random() * 2 + 1).toFixed(2),
        "90-Day Avg (%)": (s.uptime - Math.random() * 3 + 1.5).toFixed(2),
        "Downtime (mins)": Math.floor((100 - s.uptime) * 4.32),
        "SLA Target (%)": 99.5,
        "SLA Met": s.uptime >= 99.5 ? "Yes" : "No",
      }));

    case "site_capacity":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        "Max Users": s.totalUsers,
        "Current Users": s.activeUsers,
        "User Utilization (%)": Math.round((s.activeUsers / s.totalUsers) * 100),
        "Max Devices": s.totalDevices,
        "Online Devices": s.onlineDevices,
        "Device Utilization (%)": Math.round((s.onlineDevices / s.totalDevices) * 100),
      }));

    case "regional_performance":
      return platformMetrics.regional.map(r => ({
        Region: r.region,
        Sites: r.sites,
        Users: r.users,
        Devices: r.devices,
        "Avg Uptime (%)": (98.5 + Math.random() * 1.5).toFixed(2),
        "Total Bandwidth (Mbps)": r.users * 2,
        "Alerts": Math.floor(Math.random() * 5),
      }));

    // Network & Bandwidth
    case "bandwidth_utilization":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        "Provisioned (Mbps)": s.bandwidthLimit,
        "Current Usage (Mbps)": s.bandwidthUsage,
        "Peak Usage (Mbps)": Math.round(s.bandwidthUsage * 1.3),
        "Utilization (%)": Math.round((s.bandwidthUsage / s.bandwidthLimit) * 100),
        "Avg Daily (GB)": (s.dailyDataTransfer * 1000).toFixed(0),
        "Status": s.bandwidthUsage / s.bandwidthLimit > 0.9 ? "High" : "Normal",
      }));

    case "device_inventory":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        "Total APs": s.infrastructure?.deployedApCount || 0,
        "Live APs": s.infrastructure?.liveApCount || 0,
        "AP Vendor": s.infrastructure?.apVendor || "N/A",
        "PoE Switches": s.infrastructure?.poeSwitchCount || 0,
        "Total PoE Ports": s.infrastructure?.totalPoePorts || 0,
        "Last Updated": "15 Jan 2024",
      }));

    case "traffic_analysis":
      return [
        { "Time Period": "06:00 - 09:00", "Avg Users": 1250, "Peak Users": 1890, "Bandwidth (Mbps)": 4500, "Top Protocol": "HTTPS", "% of Total": "35%" },
        { "Time Period": "09:00 - 12:00", "Avg Users": 3200, "Peak Users": 4100, "Bandwidth (Mbps)": 8200, "Top Protocol": "HTTPS", "% of Total": "28%" },
        { "Time Period": "12:00 - 15:00", "Avg Users": 2800, "Peak Users": 3500, "Bandwidth (Mbps)": 7100, "Top Protocol": "Video Streaming", "% of Total": "32%" },
        { "Time Period": "15:00 - 18:00", "Avg Users": 3100, "Peak Users": 3900, "Bandwidth (Mbps)": 7800, "Top Protocol": "HTTPS", "% of Total": "30%" },
        { "Time Period": "18:00 - 21:00", "Avg Users": 2400, "Peak Users": 3200, "Bandwidth (Mbps)": 9500, "Top Protocol": "Video Streaming", "% of Total": "45%" },
        { "Time Period": "21:00 - 00:00", "Avg Users": 1800, "Peak Users": 2400, "Bandwidth (Mbps)": 6800, "Top Protocol": "Video Streaming", "% of Total": "52%" },
        { "Time Period": "00:00 - 06:00", "Avg Users": 450, "Peak Users": 800, "Bandwidth (Mbps)": 1200, "Top Protocol": "System Updates", "% of Total": "40%" },
      ];

    // Security & Compliance
    case "security_audit":
      return [
        { Category: "Access Control", "Total Checks": 45, "Passed": 43, "Failed": 2, "Compliance (%)": 95.6, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
        { Category: "Data Encryption", "Total Checks": 28, "Passed": 28, "Failed": 0, "Compliance (%)": 100, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
        { Category: "Network Security", "Total Checks": 52, "Passed": 50, "Failed": 2, "Compliance (%)": 96.2, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
        { Category: "User Authentication", "Total Checks": 35, "Passed": 34, "Failed": 1, "Compliance (%)": 97.1, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
        { Category: "Logging & Monitoring", "Total Checks": 22, "Passed": 22, "Failed": 0, "Compliance (%)": 100, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
        { Category: "Backup & Recovery", "Total Checks": 18, "Passed": 17, "Failed": 1, "Compliance (%)": 94.4, "Last Audit": "12 Jan 2024", "Next Audit": "12 Apr 2024" },
      ];

    case "access_logs":
      return [
        { Date: "15 Jan 2024", "Total Logins": 2845, "Successful": 2798, "Failed": 47, "Unique Users": 1250, "Peak Hour": "09:00-10:00", "Suspicious Activity": 3 },
        { Date: "14 Jan 2024", "Total Logins": 2650, "Successful": 2612, "Failed": 38, "Unique Users": 1180, "Peak Hour": "10:00-11:00", "Suspicious Activity": 1 },
        { Date: "13 Jan 2024", "Total Logins": 1890, "Successful": 1865, "Failed": 25, "Unique Users": 890, "Peak Hour": "11:00-12:00", "Suspicious Activity": 0 },
        { Date: "12 Jan 2024", "Total Logins": 2720, "Successful": 2685, "Failed": 35, "Unique Users": 1220, "Peak Hour": "09:00-10:00", "Suspicious Activity": 2 },
        { Date: "11 Jan 2024", "Total Logins": 2580, "Successful": 2545, "Failed": 35, "Unique Users": 1150, "Peak Hour": "09:00-10:00", "Suspicious Activity": 0 },
      ];

    case "incident_report":
      return [
        { "Incident ID": "SEC-2024-015", Date: "14 Jan 2024", Type: "Brute Force Attempt", Severity: "Medium", Site: "WeWork BKC", Status: "Resolved", "Response Time": "15 mins", "Action Taken": "IP Blocked" },
        { "Incident ID": "SEC-2024-014", Date: "12 Jan 2024", Type: "Unusual Login Pattern", Severity: "Low", Site: "Oberoi Mumbai", Status: "Investigated", "Response Time": "30 mins", "Action Taken": "User Verified" },
        { "Incident ID": "SEC-2024-013", Date: "10 Jan 2024", Type: "Certificate Warning", Severity: "High", Site: "Stanza Bangalore", Status: "Resolved", "Response Time": "2 hrs", "Action Taken": "Cert Renewed" },
        { "Incident ID": "SEC-2024-012", Date: "08 Jan 2024", Type: "DDoS Attempt", Severity: "Critical", Site: "WeWork Galaxy", Status: "Mitigated", "Response Time": "5 mins", "Action Taken": "Traffic Filtered" },
        { "Incident ID": "SEC-2024-011", Date: "05 Jan 2024", Type: "Unauthorized Access", Severity: "High", Site: "Zolo Crown", Status: "Resolved", "Response Time": "20 mins", "Action Taken": "Account Disabled" },
      ];

    // Support & Tickets
    case "ticket_summary":
      return [
        { Priority: "Critical", "Open": 2, "In Progress": 1, "Resolved": 15, "Total": 18, "Avg Resolution (hrs)": 2.5, "SLA Breach": 0 },
        { Priority: "High", "Open": 5, "In Progress": 8, "Resolved": 45, "Total": 58, "Avg Resolution (hrs)": 8.2, "SLA Breach": 2 },
        { Priority: "Medium", "Open": 12, "In Progress": 15, "Resolved": 120, "Total": 147, "Avg Resolution (hrs)": 24.5, "SLA Breach": 5 },
        { Priority: "Low", "Open": 8, "In Progress": 10, "Resolved": 85, "Total": 103, "Avg Resolution (hrs)": 48.0, "SLA Breach": 0 },
      ];

    case "sla_performance":
      return [
        { Customer: "Oberoi Hotels", "SLA Tier": "Premium", "Target Uptime (%)": 99.9, "Actual Uptime (%)": 99.97, "Response SLA (hrs)": 1, "Avg Response (hrs)": 0.5, "Breaches": 0, "Status": "Compliant" },
        { Customer: "WeWork India", "SLA Tier": "Enterprise", "Target Uptime (%)": 99.95, "Actual Uptime (%)": 99.98, "Response SLA (hrs)": 2, "Avg Response (hrs)": 1.2, "Breaches": 0, "Status": "Compliant" },
        { Customer: "Zolo Stays", "SLA Tier": "Standard", "Target Uptime (%)": 99.5, "Actual Uptime (%)": 99.85, "Response SLA (hrs)": 4, "Avg Response (hrs)": 2.8, "Breaches": 1, "Status": "Compliant" },
        { Customer: "Stanza Living", "SLA Tier": "Premium", "Target Uptime (%)": 99.9, "Actual Uptime (%)": 99.88, "Response SLA (hrs)": 1, "Avg Response (hrs)": 0.8, "Breaches": 1, "Status": "At Risk" },
        { Customer: "Nestaway", "SLA Tier": "Standard", "Target Uptime (%)": 99.5, "Actual Uptime (%)": 98.20, "Response SLA (hrs)": 4, "Avg Response (hrs)": 3.5, "Breaches": 3, "Status": "Breach" },
      ];

    case "customer_satisfaction":
      return [
        { Customer: "Oberoi Hotels", "CSAT Score": 4.8, "NPS": 72, "Survey Responses": 45, "Positive (%)": 92, "Neutral (%)": 6, "Negative (%)": 2, "Trend": "Improving" },
        { Customer: "WeWork India", "CSAT Score": 4.6, "NPS": 65, "Survey Responses": 120, "Positive (%)": 88, "Neutral (%)": 8, "Negative (%)": 4, "Trend": "Stable" },
        { Customer: "Zolo Stays", "CSAT Score": 4.2, "NPS": 45, "Survey Responses": 38, "Positive (%)": 78, "Neutral (%)": 15, "Negative (%)": 7, "Trend": "Improving" },
        { Customer: "Stanza Living", "CSAT Score": 4.5, "NPS": 58, "Survey Responses": 65, "Positive (%)": 85, "Neutral (%)": 10, "Negative (%)": 5, "Trend": "Stable" },
        { Customer: "Nestaway", "CSAT Score": 3.8, "NPS": 32, "Survey Responses": 28, "Positive (%)": 68, "Neutral (%)": 18, "Negative (%)": 14, "Trend": "Declining" },
      ];

    default:
      return [];
  }
};

const InternalReports = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedReports, setPinnedReports] = useState([
    "platform_overview",
    "customer_summary",
    "site_status",
  ]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportingReportId, setExportingReportId] = useState(null);

  // Transform customer portal reports to match internal report format
  const customerPortalReports = useMemo(() => {
    return getCustomerReports().map(report => ({
      id: `cp-${report.id}`,
      name: report.name,
      description: report.description,
      category: report.category, // Original category from REPORT_CATEGORIES
      cpCategoryId: `cp-${report.category.toLowerCase().replace(/[^a-z]/g, '')}`, // Mapped category id
      icon: customerCategoryIcons[report.category] || FaChartLine,
      exportFormats: ["csv", "pdf"],
      accessLevel: report.accessLevel,
      isCustomerPortal: true,
      originalReport: report,
    }));
  }, []);

  // Combine all reports
  const allReports = useMemo(() => {
    return [...internalReports, ...customerPortalReports];
  }, [customerPortalReports]);

  // Filter reports based on category and search
  const filteredReports = useMemo(() => {
    let reports = allReports;

    if (activeCategory !== "all") {
      const category = internalReportCategories.find(c => c.id === activeCategory);

      if (category?.section === "customer-portal") {
        // Filter customer portal reports by their category
        reports = reports.filter((r) => r.isCustomerPortal && r.category === category.cpCategory);
      } else if (category?.section === "internal") {
        // Filter internal reports by their category
        reports = reports.filter((r) => !r.isCustomerPortal && r.category === activeCategory);
      }
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      );
    }

    return reports;
  }, [activeCategory, searchTerm, allReports]);

  const pinnedReportObjects = useMemo(() => {
    return pinnedReports
      .map((id) => allReports.find((r) => r.id === id))
      .filter(Boolean);
  }, [pinnedReports, allReports]);

  const togglePin = useCallback((reportId) => {
    setPinnedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      }
      if (prev.length >= 6) {
        notifications.showWarning("Maximum 6 reports can be pinned");
        return prev;
      }
      return [...prev, reportId];
    });
  }, []);

  const isPinned = useCallback(
    (reportId) => pinnedReports.includes(reportId),
    [pinnedReports]
  );

  // Check if a report has data
  const reportHasData = useCallback((reportId) => {
    const data = generateReportData(reportId);
    return data && Array.isArray(data) && data.length > 0;
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  // Helper to get report data as headers and rows for export
  const getReportDataForExport = useCallback((report) => {
    const data = generateReportData(report.id);
    if (data.length === 0) {
      return { headers: [], rows: [] };
    }
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((h) => row[h]));
    return { headers, rows };
  }, []);

  // Generate filename for export
  const generateFilename = useCallback((report, extension) => {
    const date = new Date().toISOString().split("T")[0];
    const cleanName = report.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    return `Internal_${cleanName}_${date}.${extension}`;
  }, []);

  const handleExportCSV = async (report) => {
    setExporting(true);
    setExportingReportId(report.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { headers, rows } = getReportDataForExport(report);

      if (rows.length > 0) {
        await exportChartDataToCSV({ headers, rows }, generateFilename(report, 'csv'));
        notifications.showSuccess("CSV report exported successfully");
      } else {
        notifications.showInfo("No data available for export");
      }
    } catch (error) {
      console.error("CSV export error:", error);
      notifications.showError("Failed to export CSV report");
    } finally {
      setExporting(false);
      setExportingReportId(null);
    }
  };

  const handleExportPDF = async (report) => {
    setExporting(true);
    setExportingReportId(report.id);

    try {
      const { headers, rows } = getReportDataForExport(report);

      if (rows.length === 0) {
        notifications.showInfo("No data available for export");
        setExporting(false);
        setExportingReportId(null);
        return;
      }

      // Internal portal permissions - always allow for internal users
      const internalPermissions = {
        canViewReports: true,
        canExportReports: true,
      };

      await exportReportPDF({
        title: report.name,
        headers,
        rows,
        chartData: null, // No chart for internal reports currently
        chartOptions: null,
        filename: generateFilename(report, 'pdf'),
        rolePermissions: internalPermissions,
        exportCanvasWidth: 900,
        exportCanvasHeight: 450,
        reportId: report.id,
        criteria: null,
        addWatermark: true,
        watermarkText: "INTERNAL USE ONLY",
        disclaimerText: "This report is for internal Spectra use only. Contains confidential platform data. Do not distribute without authorization.",
        includeExecutiveSummary: true
      });

      notifications.showSuccess("PDF report generated successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      notifications.showError("Failed to generate PDF report");
    } finally {
      setExporting(false);
      setExportingReportId(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: allReports.length };
    internalReportCategories.forEach((cat) => {
      if (cat.id !== "all") {
        if (cat.section === "customer-portal") {
          // Count customer portal reports by their original category
          counts[cat.id] = customerPortalReports.filter((r) => r.category === cat.cpCategory).length;
        } else {
          // Count internal reports
          counts[cat.id] = internalReports.filter((r) => r.category === cat.id).length;
        }
      }
    });
    return counts;
  }, [allReports, customerPortalReports]);

  return (
    <div className="internal-reports">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaChartLine className="page-title-icon" />
              Reports & Analytics
            </h1>
            <p className="page-subtitle">
              Comprehensive reporting and analytics for platform management
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={() => navigate("/internal/dashboard")}>
              <FaChartBar /> Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="reports-summary-stats">
        <div className="summary-stat-card">
          <div className="stat-icon customers-icon">
            <FaBuilding />
          </div>
          <div className="stat-content">
            <span className="stat-value">{platformMetrics.overview.totalCustomers}</span>
            <span className="stat-label">Total Customers</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon sites-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="stat-content">
            <span className="stat-value">{platformMetrics.overview.totalSites}</span>
            <span className="stat-label">Total Sites</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon users-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(platformMetrics.overview.totalUsers / 1000).toFixed(1)}K</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon devices-icon">
            <FaWifi />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(platformMetrics.overview.totalDevices / 1000).toFixed(1)}K</span>
            <span className="stat-label">Total Devices</span>
          </div>
        </div>
      </div>

      {/* Pinned Reports */}
      {pinnedReportObjects.length > 0 && (
        <div className="pinned-reports-section">
          <div className="section-header">
            <h2>
              <FaStar className="section-icon" /> Pinned Reports
            </h2>
            <span className="pinned-count">({pinnedReportObjects.length}/6)</span>
          </div>
          <div className="pinned-reports-grid">
            {pinnedReportObjects.map((report) => (
              <button
                key={report.id}
                className="pinned-report-card"
                onClick={() => handleViewReport(report)}
              >
                <div className="pinned-report-icon">
                  <report.icon />
                </div>
                <span className="pinned-report-name">{report.name}</span>
                <button
                  className="unpin-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(report.id);
                  }}
                  title="Unpin report"
                >
                  <FaTimes />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="reports-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs - Grouped by Section */}
      <div className="category-tabs-wrapper">
        {/* All Reports Tab */}
        <div className="category-tabs-section">
          <button
            className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <FaChartLine className="tab-icon" />
            <span className="tab-name">All Reports</span>
            <span className="tab-count">{categoryCounts["all"]}</span>
          </button>
        </div>

        {/* Internal Platform Reports */}
        <div className="category-tabs-section">
          <span className="section-label">Internal Platform</span>
          <div className="category-tabs">
            {internalReportCategories.filter(c => c.section === "internal").map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon className="tab-icon" />
                <span className="tab-name">{cat.name}</span>
                <span className="tab-count">{categoryCounts[cat.id]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Portal Reports */}
        <div className="category-tabs-section">
          <span className="section-label">Customer Portal</span>
          <div className="category-tabs">
            {internalReportCategories.filter(c => c.section === "customer-portal").map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? "active" : ""} customer-portal-tab`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon className="tab-icon" />
                <span className="tab-name">{cat.name}</span>
                <span className="tab-count">{categoryCounts[cat.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <FaChartLine className="no-reports-icon" />
            <p>No reports found</p>
            {searchTerm && (
              <button className="btn btn-secondary" onClick={clearSearch}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className={`report-card ${report.isCustomerPortal ? 'customer-portal-report' : ''}`}>
              <div className="report-card-header">
                <div className="report-icon-wrapper">
                  <report.icon />
                </div>
                <button
                  className={`pin-btn ${isPinned(report.id) ? "pinned" : ""}`}
                  onClick={() => togglePin(report.id)}
                  title={isPinned(report.id) ? "Unpin report" : "Pin report"}
                >
                  {isPinned(report.id) ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              <h3 className="report-card-title">{report.name}</h3>
              <p className="report-card-description">{report.description}</p>
              <div className="report-card-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewReport(report)}
                >
                  <FaEye /> View
                </button>
                {report.exportFormats.includes("csv") && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleExportCSV(report)}
                    disabled={!reportHasData(report.id) || (exporting && exportingReportId === report.id)}
                    title={reportHasData(report.id) ? "Export as CSV" : "No data available"}
                  >
                    {exporting && exportingReportId === report.id ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <FaFileCsv />
                    )}{" "}
                    CSV
                  </button>
                )}
                {report.exportFormats.includes("pdf") && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleExportPDF(report)}
                    disabled={!reportHasData(report.id) || (exporting && exportingReportId === report.id)}
                    title={reportHasData(report.id) ? "Export as PDF" : "No data available"}
                  >
                    {exporting && exportingReportId === report.id ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <FaFilePdf />
                    )}{" "}
                    PDF
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="report-preview-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-preview-header">
              <h2>{selectedReport.name}</h2>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="report-preview-body">
              <p className="report-description">{selectedReport.description}</p>

              {/* Sample data table */}
              {generateReportData(selectedReport.id).length > 0 ? (
                <div className="report-data-table-wrapper">
                  <table className="report-data-table">
                    <thead>
                      <tr>
                        {Object.keys(generateReportData(selectedReport.id)[0]).map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateReportData(selectedReport.id).slice(0, 10).map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((cell, cellIdx) => (
                            <td key={cellIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {generateReportData(selectedReport.id).length > 10 && (
                    <p className="table-note">
                      Showing 10 of {generateReportData(selectedReport.id).length} records
                    </p>
                  )}
                </div>
              ) : (
                <div className="no-preview-data">
                  <FaChartBar className="no-data-icon" />
                  <p>Report preview data coming soon</p>
                </div>
              )}
            </div>
            <div className="report-preview-footer">
              <button className="btn btn-outline" onClick={() => setSelectedReport(null)}>
                Close
              </button>
              <div className="export-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleExportCSV(selectedReport)}
                  disabled={!reportHasData(selectedReport.id) || exporting}
                  title={reportHasData(selectedReport.id) ? "Export as CSV" : "No data available"}
                >
                  {exporting && exportingReportId === selectedReport.id ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <FaFileCsv />
                  )}{" "}
                  Export CSV
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleExportPDF(selectedReport)}
                  disabled={!reportHasData(selectedReport.id) || exporting}
                  title={reportHasData(selectedReport.id) ? "Export as PDF" : "No data available"}
                >
                  {exporting && exportingReportId === selectedReport.id ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <FaFilePdf />
                  )}{" "}
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalReports;
