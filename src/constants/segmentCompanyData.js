// src/constants/segmentCompanyData.js

/**
 * Segment-Specific Company Data for Company-Level Dashboard
 * Each segment has different companies, sites, users, and metrics
 */

import { SEGMENTS } from '../context/SegmentContext';

// ============================================
// SEGMENT-SPECIFIC COMPANIES
// ============================================

export const segmentCompanies = {
  [SEGMENTS.ENTERPRISE]: {
    id: "COMP_ENT_001",
    name: "TechCorp Solutions Pvt Ltd",
    industry: "Information Technology",
    registeredAddress: "Tower A, Tech Park, Mumbai, Maharashtra 400001",
    contactEmail: "admin@techcorp.com",
    contactPhone: "+91-22-1234-5678",
    createdAt: "2023-01-15",
    licenseType: "Enterprise",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-01-01",
    totalLicensedBandwidth: "2 Gbps",
  },
  [SEGMENTS.HOTEL]: {
    id: "COMP_HTL_001",
    name: "Grand Hospitality Group",
    industry: "Hospitality",
    registeredAddress: "Hotel District, Goa 403001",
    contactEmail: "admin@grandhospitality.com",
    contactPhone: "+91-832-123-4567",
    createdAt: "2023-03-10",
    licenseType: "Hospitality Premium",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-03-01",
    totalLicensedBandwidth: "1.5 Gbps",
  },
  [SEGMENTS.CO_LIVING]: {
    id: "COMP_COL_001",
    name: "UrbanNest Living Spaces",
    industry: "Real Estate - Co-Living",
    registeredAddress: "HSR Layout, Bangalore, Karnataka 560102",
    contactEmail: "admin@urbannest.com",
    contactPhone: "+91-80-4567-8901",
    createdAt: "2023-02-20",
    licenseType: "Co-Living Standard",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-02-01",
    totalLicensedBandwidth: "1 Gbps",
  },
  [SEGMENTS.PG]: {
    id: "COMP_PG_001",
    name: "ComfortStay PG Network",
    industry: "Accommodation - PG",
    registeredAddress: "Koramangala, Bangalore, Karnataka 560034",
    contactEmail: "admin@comfortstay.com",
    contactPhone: "+91-80-2345-6789",
    createdAt: "2023-04-15",
    licenseType: "PG Basic",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-04-01",
    totalLicensedBandwidth: "800 Mbps",
  },
  [SEGMENTS.CO_WORKING]: {
    id: "COMP_COW_001",
    name: "FlexSpace Co-Working",
    industry: "Real Estate - Co-Working",
    registeredAddress: "Cyber Hub, Gurgaon, Haryana 122002",
    contactEmail: "admin@flexspace.com",
    contactPhone: "+91-124-456-7890",
    createdAt: "2023-05-01",
    licenseType: "Co-Working Premium",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-05-01",
    totalLicensedBandwidth: "1.2 Gbps",
  },
  [SEGMENTS.OFFICE]: {
    id: "COMP_OFF_001",
    name: "Corporate Offices India",
    industry: "Corporate Services",
    registeredAddress: "BKC, Mumbai, Maharashtra 400051",
    contactEmail: "admin@corpoffices.com",
    contactPhone: "+91-22-6789-0123",
    createdAt: "2023-06-10",
    licenseType: "Office Standard",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-06-01",
    totalLicensedBandwidth: "1.5 Gbps",
  },
  [SEGMENTS.MISCELLANEOUS]: {
    id: "COMP_MISC_001",
    name: "MultiVenue Services",
    industry: "Mixed Use",
    registeredAddress: "Connaught Place, Delhi 110001",
    contactEmail: "admin@multivenue.com",
    contactPhone: "+91-11-2345-6789",
    createdAt: "2023-07-01",
    licenseType: "Standard",
    licenseExpiry: "2025-12-31",
    contractStartDate: "2023-07-01",
    totalLicensedBandwidth: "600 Mbps",
  },
};

// ============================================
// SEGMENT-SPECIFIC SITES
// ============================================

export const segmentSites = {
  [SEGMENTS.ENTERPRISE]: [
    {
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      segment: "enterprise",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Tower A, Tech Park, Andheri East, Mumbai",
      status: "active",
      totalUsers: 850,
      activeUsers: 742,
      totalDevices: 1200,
      activeDevices: 1085,
      bandwidth: "500 Mbps",
      bandwidthUsage: 68,
      licenseStatus: "Active",
      contactPerson: "Priya Sharma",
      contactEmail: "priya.sharma@techcorp.com",
      lastActivity: "2 min ago",
      alerts: 2,
      criticalAlerts: 0,
      setupDate: "2023-01-20",
      activationDate: "2023-01-20T10:30:00Z",
    },
    {
      siteId: "SITE-DEL-ENT-002",
      siteName: "Delhi Branch",
      segment: "enterprise",
      city: "Delhi",
      state: "Delhi",
      address: "Plot 45, Sector 18, Noida, Delhi NCR",
      status: "active",
      totalUsers: 650,
      activeUsers: 580,
      totalDevices: 800,
      activeDevices: 720,
      bandwidth: "400 Mbps",
      bandwidthUsage: 72,
      licenseStatus: "Active",
      contactPerson: "Amit Verma",
      contactEmail: "amit.verma@techcorp.com",
      lastActivity: "5 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-03-15",
      activationDate: "2023-03-15T14:00:00Z",
    },
    {
      siteId: "SITE-BLR-ENT-003",
      siteName: "Bangalore Tech Center",
      segment: "enterprise",
      city: "Bangalore",
      state: "Karnataka",
      address: "Tower B, Electronic City, Bangalore",
      status: "active",
      totalUsers: 520,
      activeUsers: 485,
      totalDevices: 750,
      activeDevices: 690,
      bandwidth: "350 Mbps",
      bandwidthUsage: 65,
      licenseStatus: "Active",
      contactPerson: "Sneha Rao",
      contactEmail: "sneha.rao@techcorp.com",
      lastActivity: "10 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-05-10",
      activationDate: "2023-05-10T11:30:00Z",
    },
    {
      siteId: "SITE-HYD-ENT-004",
      siteName: "Hyderabad Office",
      segment: "enterprise",
      city: "Hyderabad",
      state: "Telangana",
      address: "Cyber Towers, HITEC City, Hyderabad",
      status: "active",
      totalUsers: 380,
      activeUsers: 342,
      totalDevices: 520,
      activeDevices: 475,
      bandwidth: "300 Mbps",
      bandwidthUsage: 58,
      licenseStatus: "Active",
      contactPerson: "Kiran Reddy",
      contactEmail: "kiran.reddy@techcorp.com",
      lastActivity: "15 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-07-01",
      activationDate: "2023-07-01T09:00:00Z",
    },
  ],
  [SEGMENTS.HOTEL]: [
    {
      siteId: "SITE-GOA-HTL-001",
      siteName: "Grand Resort Goa",
      segment: "hotel",
      city: "Goa",
      state: "Goa",
      address: "Calangute Beach Road, North Goa",
      status: "active",
      totalUsers: 1200,
      activeUsers: 890,
      totalDevices: 450,
      activeDevices: 420,
      bandwidth: "400 Mbps",
      bandwidthUsage: 78,
      licenseStatus: "Active",
      contactPerson: "Vikram Desai",
      contactEmail: "vikram@grandhospitality.com",
      lastActivity: "1 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-03-15",
      rooms: 250,
      occupancy: 85,
      activationDate: "2023-03-15T10:00:00Z",
    },
    {
      siteId: "SITE-MUM-HTL-002",
      siteName: "Grand Hotel Mumbai",
      segment: "hotel",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Marine Drive, Mumbai",
      status: "active",
      totalUsers: 950,
      activeUsers: 720,
      totalDevices: 380,
      activeDevices: 350,
      bandwidth: "350 Mbps",
      bandwidthUsage: 72,
      licenseStatus: "Active",
      contactPerson: "Meera Nair",
      contactEmail: "meera@grandhospitality.com",
      lastActivity: "3 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-04-20",
      rooms: 200,
      occupancy: 78,
      activationDate: "2023-04-20T12:00:00Z",
    },
    {
      siteId: "SITE-JAI-HTL-003",
      siteName: "Heritage Palace Jaipur",
      segment: "hotel",
      city: "Jaipur",
      state: "Rajasthan",
      address: "Amer Road, Jaipur",
      status: "active",
      totalUsers: 680,
      activeUsers: 520,
      totalDevices: 280,
      activeDevices: 260,
      bandwidth: "300 Mbps",
      bandwidthUsage: 65,
      licenseStatus: "Active",
      contactPerson: "Rajesh Singh",
      contactEmail: "rajesh@grandhospitality.com",
      lastActivity: "8 min ago",
      alerts: 2,
      criticalAlerts: 1,
      setupDate: "2023-06-10",
      rooms: 150,
      occupancy: 72,
      activationDate: "2023-06-10T15:00:00Z",
    },
  ],
  [SEGMENTS.CO_LIVING]: [
    {
      siteId: "SITE-BLR-COL-001",
      siteName: "UrbanNest HSR",
      segment: "coLiving",
      city: "Bangalore",
      state: "Karnataka",
      address: "HSR Layout Sector 2, Bangalore",
      status: "active",
      totalUsers: 320,
      activeUsers: 285,
      totalDevices: 480,
      activeDevices: 445,
      bandwidth: "200 Mbps",
      bandwidthUsage: 82,
      licenseStatus: "Active",
      contactPerson: "Arun Kumar",
      contactEmail: "arun@urbannest.com",
      lastActivity: "2 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-02-25",
      beds: 180,
      occupancy: 92,
      activationDate: "2023-02-25T10:00:00Z",
    },
    {
      siteId: "SITE-BLR-COL-002",
      siteName: "UrbanNest Whitefield",
      segment: "coLiving",
      city: "Bangalore",
      state: "Karnataka",
      address: "ITPL Main Road, Whitefield",
      status: "active",
      totalUsers: 280,
      activeUsers: 248,
      totalDevices: 420,
      activeDevices: 385,
      bandwidth: "180 Mbps",
      bandwidthUsage: 75,
      licenseStatus: "Active",
      contactPerson: "Divya Menon",
      contactEmail: "divya@urbannest.com",
      lastActivity: "5 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-04-10",
      beds: 150,
      occupancy: 88,
      activationDate: "2023-04-10T14:00:00Z",
    },
    {
      siteId: "SITE-MUM-COL-003",
      siteName: "UrbanNest Powai",
      segment: "coLiving",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Hiranandani Gardens, Powai",
      status: "active",
      totalUsers: 250,
      activeUsers: 220,
      totalDevices: 375,
      activeDevices: 340,
      bandwidth: "150 Mbps",
      bandwidthUsage: 78,
      licenseStatus: "Active",
      contactPerson: "Sanjay Patel",
      contactEmail: "sanjay@urbannest.com",
      lastActivity: "10 min ago",
      alerts: 2,
      criticalAlerts: 0,
      setupDate: "2023-06-20",
      beds: 120,
      occupancy: 85,
      activationDate: "2023-06-20T11:00:00Z",
    },
  ],
  [SEGMENTS.PG]: [
    {
      siteId: "SITE-BLR-PG-001",
      siteName: "ComfortStay Koramangala",
      segment: "pg",
      city: "Bangalore",
      state: "Karnataka",
      address: "Koramangala 4th Block, Bangalore",
      status: "active",
      totalUsers: 85,
      activeUsers: 78,
      totalDevices: 95,
      activeDevices: 88,
      bandwidth: "100 Mbps",
      bandwidthUsage: 72,
      licenseStatus: "Active",
      contactPerson: "Ramesh Gupta",
      contactEmail: "ramesh@comfortstay.com",
      lastActivity: "5 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-04-20",
      beds: 50,
      occupancy: 94,
      activationDate: "2023-04-20T09:00:00Z",
    },
    {
      siteId: "SITE-BLR-PG-002",
      siteName: "ComfortStay BTM",
      segment: "pg",
      city: "Bangalore",
      state: "Karnataka",
      address: "BTM Layout 2nd Stage, Bangalore",
      status: "active",
      totalUsers: 72,
      activeUsers: 65,
      totalDevices: 82,
      activeDevices: 75,
      bandwidth: "80 Mbps",
      bandwidthUsage: 68,
      licenseStatus: "Active",
      contactPerson: "Sunita Devi",
      contactEmail: "sunita@comfortstay.com",
      lastActivity: "8 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-05-15",
      beds: 40,
      occupancy: 90,
      activationDate: "2023-05-15T10:00:00Z",
    },
    {
      siteId: "SITE-CHN-PG-003",
      siteName: "ComfortStay OMR",
      segment: "pg",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "OMR Thoraipakkam, Chennai",
      status: "active",
      totalUsers: 68,
      activeUsers: 58,
      totalDevices: 78,
      activeDevices: 70,
      bandwidth: "80 Mbps",
      bandwidthUsage: 65,
      licenseStatus: "Active",
      contactPerson: "Kumar S",
      contactEmail: "kumar@comfortstay.com",
      lastActivity: "12 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-07-10",
      beds: 35,
      occupancy: 86,
      activationDate: "2023-07-10T11:30:00Z",
    },
  ],
  [SEGMENTS.CO_WORKING]: [
    {
      siteId: "SITE-GUR-COW-001",
      siteName: "FlexSpace Cyber Hub",
      segment: "coWorking",
      city: "Gurgaon",
      state: "Haryana",
      address: "Cyber Hub, DLF Phase 3, Gurgaon",
      status: "active",
      totalUsers: 420,
      activeUsers: 380,
      totalDevices: 580,
      activeDevices: 540,
      bandwidth: "300 Mbps",
      bandwidthUsage: 85,
      licenseStatus: "Active",
      contactPerson: "Neha Kapoor",
      contactEmail: "neha@flexspace.com",
      lastActivity: "1 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-05-05",
      desks: 250,
      occupancy: 88,
      activationDate: "2023-05-05T09:00:00Z",
    },
    {
      siteId: "SITE-MUM-COW-002",
      siteName: "FlexSpace BKC",
      segment: "coWorking",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Bandra Kurla Complex, Mumbai",
      status: "active",
      totalUsers: 380,
      activeUsers: 340,
      totalDevices: 520,
      activeDevices: 480,
      bandwidth: "280 Mbps",
      bandwidthUsage: 78,
      licenseStatus: "Active",
      contactPerson: "Ravi Menon",
      contactEmail: "ravi@flexspace.com",
      lastActivity: "4 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-06-15",
      desks: 220,
      occupancy: 82,
      activationDate: "2023-06-15T11:00:00Z",
    },
    {
      siteId: "SITE-BLR-COW-003",
      siteName: "FlexSpace Indiranagar",
      segment: "coWorking",
      city: "Bangalore",
      state: "Karnataka",
      address: "100 Feet Road, Indiranagar",
      status: "active",
      totalUsers: 320,
      activeUsers: 285,
      totalDevices: 440,
      activeDevices: 400,
      bandwidth: "250 Mbps",
      bandwidthUsage: 72,
      licenseStatus: "Active",
      contactPerson: "Priya Sharma",
      contactEmail: "priya@flexspace.com",
      lastActivity: "6 min ago",
      alerts: 2,
      criticalAlerts: 1,
      setupDate: "2023-08-01",
      desks: 180,
      occupancy: 78,
      activationDate: "2023-08-01T10:00:00Z",
    },
  ],
  [SEGMENTS.OFFICE]: [
    {
      siteId: "SITE-MUM-OFF-001",
      siteName: "Corporate Tower Mumbai",
      segment: "office",
      city: "Mumbai",
      state: "Maharashtra",
      address: "One BKC, Bandra Kurla Complex",
      status: "active",
      totalUsers: 480,
      activeUsers: 420,
      totalDevices: 650,
      activeDevices: 590,
      bandwidth: "400 Mbps",
      bandwidthUsage: 70,
      licenseStatus: "Active",
      contactPerson: "Ashok Mehta",
      contactEmail: "ashok@corpoffices.com",
      lastActivity: "2 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-06-15",
      activationDate: "2023-06-15T09:00:00Z",
    },
    {
      siteId: "SITE-DEL-OFF-002",
      siteName: "Corporate Plaza Delhi",
      segment: "office",
      city: "Delhi",
      state: "Delhi",
      address: "Connaught Place, New Delhi",
      status: "active",
      totalUsers: 380,
      activeUsers: 340,
      totalDevices: 520,
      activeDevices: 475,
      bandwidth: "350 Mbps",
      bandwidthUsage: 65,
      licenseStatus: "Active",
      contactPerson: "Suresh Kumar",
      contactEmail: "suresh@corpoffices.com",
      lastActivity: "5 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-07-20",
      activationDate: "2023-07-20T10:00:00Z",
    },
    {
      siteId: "SITE-CHN-OFF-003",
      siteName: "Corporate Hub Chennai",
      segment: "office",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "Tidel Park, Taramani",
      status: "active",
      totalUsers: 290,
      activeUsers: 260,
      totalDevices: 400,
      activeDevices: 365,
      bandwidth: "250 Mbps",
      bandwidthUsage: 62,
      licenseStatus: "Active",
      contactPerson: "Lakshmi Narayanan",
      contactEmail: "lakshmi@corpoffices.com",
      lastActivity: "8 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-09-01",
      activationDate: "2023-09-01T11:00:00Z",
    },
  ],
  [SEGMENTS.MISCELLANEOUS]: [
    {
      siteId: "SITE-DEL-MISC-001",
      siteName: "Community Center Delhi",
      segment: "miscellaneous",
      city: "Delhi",
      state: "Delhi",
      address: "Nehru Place, New Delhi",
      status: "active",
      totalUsers: 150,
      activeUsers: 120,
      totalDevices: 180,
      activeDevices: 155,
      bandwidth: "150 Mbps",
      bandwidthUsage: 55,
      licenseStatus: "Active",
      contactPerson: "Alok Singh",
      contactEmail: "alok@multivenue.com",
      lastActivity: "10 min ago",
      alerts: 0,
      criticalAlerts: 0,
      setupDate: "2023-07-15",
      activationDate: "2023-07-15T09:30:00Z",
    },
    {
      siteId: "SITE-MUM-MISC-002",
      siteName: "Event Space Mumbai",
      segment: "miscellaneous",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Lower Parel, Mumbai",
      status: "active",
      totalUsers: 200,
      activeUsers: 150,
      totalDevices: 220,
      activeDevices: 190,
      bandwidth: "200 Mbps",
      bandwidthUsage: 48,
      licenseStatus: "Active",
      contactPerson: "Rita Sharma",
      contactEmail: "rita@multivenue.com",
      lastActivity: "15 min ago",
      alerts: 1,
      criticalAlerts: 0,
      setupDate: "2023-08-20",
      activationDate: "2023-08-20T14:00:00Z",
    },
  ],
};

// ============================================
// SEGMENT-SPECIFIC USERS
// ============================================

export const segmentUsers = {
  [SEGMENTS.ENTERPRISE]: [
    { id: "USR-ENT-001", name: "Rahul Mehta", email: "rahul@techcorp.com", role: "Admin", status: "active", devices: 3, dataUsed: "45 GB", policy: "Enterprise Unlimited" },
    { id: "USR-ENT-002", name: "Priya Sharma", email: "priya@techcorp.com", role: "Manager", status: "active", devices: 2, dataUsed: "32 GB", policy: "Enterprise Standard" },
    { id: "USR-ENT-003", name: "Amit Verma", email: "amit@techcorp.com", role: "Employee", status: "active", devices: 2, dataUsed: "28 GB", policy: "Enterprise Standard" },
    { id: "USR-ENT-004", name: "Sneha Rao", email: "sneha@techcorp.com", role: "Employee", status: "active", devices: 1, dataUsed: "15 GB", policy: "Enterprise Basic" },
    { id: "USR-ENT-005", name: "Kiran Reddy", email: "kiran@techcorp.com", role: "Employee", status: "inactive", devices: 1, dataUsed: "8 GB", policy: "Enterprise Basic" },
  ],
  [SEGMENTS.HOTEL]: [
    { id: "USR-HTL-001", name: "Guest Room 101", email: "guest101@temp.com", role: "Guest", status: "active", devices: 2, dataUsed: "5 GB", policy: "Hotel Premium WiFi" },
    { id: "USR-HTL-002", name: "Guest Room 102", email: "guest102@temp.com", role: "Guest", status: "active", devices: 1, dataUsed: "3 GB", policy: "Hotel Standard WiFi" },
    { id: "USR-HTL-003", name: "Conference Hall A", email: "conf.a@hotel.com", role: "Event", status: "active", devices: 15, dataUsed: "25 GB", policy: "Hotel Event Package" },
    { id: "USR-HTL-004", name: "Staff - Vikram", email: "vikram@hotel.com", role: "Staff", status: "active", devices: 1, dataUsed: "12 GB", policy: "Hotel Staff" },
    { id: "USR-HTL-005", name: "Guest Room 205", email: "guest205@temp.com", role: "Guest", status: "checked-out", devices: 0, dataUsed: "2 GB", policy: "Hotel Standard WiFi" },
  ],
  [SEGMENTS.CO_LIVING]: [
    { id: "USR-COL-001", name: "Arun Kumar", email: "arun@email.com", role: "Resident", status: "active", devices: 3, dataUsed: "85 GB", policy: "Co-Living Unlimited" },
    { id: "USR-COL-002", name: "Divya Menon", email: "divya@email.com", role: "Resident", status: "active", devices: 2, dataUsed: "62 GB", policy: "Co-Living Standard" },
    { id: "USR-COL-003", name: "Ravi Shankar", email: "ravi@email.com", role: "Resident", status: "active", devices: 2, dataUsed: "48 GB", policy: "Co-Living Standard" },
    { id: "USR-COL-004", name: "Meera Nair", email: "meera@email.com", role: "Resident", status: "active", devices: 1, dataUsed: "35 GB", policy: "Co-Living Basic" },
    { id: "USR-COL-005", name: "Sanjay Patel", email: "sanjay@email.com", role: "Resident", status: "inactive", devices: 0, dataUsed: "12 GB", policy: "Co-Living Basic" },
  ],
  [SEGMENTS.PG]: [
    { id: "USR-PG-001", name: "Ramesh G", email: "ramesh@email.com", role: "Tenant", status: "active", devices: 2, dataUsed: "45 GB", policy: "PG Standard" },
    { id: "USR-PG-002", name: "Sunita D", email: "sunita@email.com", role: "Tenant", status: "active", devices: 1, dataUsed: "32 GB", policy: "PG Standard" },
    { id: "USR-PG-003", name: "Kumar S", email: "kumar@email.com", role: "Tenant", status: "active", devices: 2, dataUsed: "55 GB", policy: "PG Premium" },
    { id: "USR-PG-004", name: "Priya R", email: "priyar@email.com", role: "Tenant", status: "active", devices: 1, dataUsed: "28 GB", policy: "PG Standard" },
    { id: "USR-PG-005", name: "Ankit M", email: "ankit@email.com", role: "Tenant", status: "inactive", devices: 0, dataUsed: "5 GB", policy: "PG Basic" },
  ],
  [SEGMENTS.CO_WORKING]: [
    { id: "USR-COW-001", name: "Startup Alpha", email: "alpha@startup.com", role: "Team", status: "active", devices: 8, dataUsed: "120 GB", policy: "Co-Working Team" },
    { id: "USR-COW-002", name: "Freelancer - Neha", email: "neha@freelance.com", role: "Individual", status: "active", devices: 2, dataUsed: "45 GB", policy: "Co-Working Individual" },
    { id: "USR-COW-003", name: "Consulting Corp", email: "corp@consulting.com", role: "Enterprise", status: "active", devices: 15, dataUsed: "180 GB", policy: "Co-Working Enterprise" },
    { id: "USR-COW-004", name: "Designer - Ravi", email: "ravi@design.com", role: "Individual", status: "active", devices: 1, dataUsed: "65 GB", policy: "Co-Working Individual" },
    { id: "USR-COW-005", name: "Day Pass User", email: "daypass@temp.com", role: "DayPass", status: "expired", devices: 0, dataUsed: "2 GB", policy: "Co-Working Day Pass" },
  ],
  [SEGMENTS.OFFICE]: [
    { id: "USR-OFF-001", name: "Ashok Mehta", email: "ashok@corpoffices.com", role: "Director", status: "active", devices: 3, dataUsed: "55 GB", policy: "Office Executive" },
    { id: "USR-OFF-002", name: "Suresh Kumar", email: "suresh@corpoffices.com", role: "Manager", status: "active", devices: 2, dataUsed: "42 GB", policy: "Office Manager" },
    { id: "USR-OFF-003", name: "Lakshmi N", email: "lakshmi@corpoffices.com", role: "Employee", status: "active", devices: 2, dataUsed: "28 GB", policy: "Office Standard" },
    { id: "USR-OFF-004", name: "Rahul K", email: "rahulk@corpoffices.com", role: "Employee", status: "active", devices: 1, dataUsed: "18 GB", policy: "Office Standard" },
    { id: "USR-OFF-005", name: "Contractor - Anil", email: "anil@contractor.com", role: "Contractor", status: "active", devices: 1, dataUsed: "8 GB", policy: "Office Guest" },
  ],
  [SEGMENTS.MISCELLANEOUS]: [
    { id: "USR-MISC-001", name: "Alok Singh", email: "alok@multivenue.com", role: "Admin", status: "active", devices: 2, dataUsed: "25 GB", policy: "Misc Standard" },
    { id: "USR-MISC-002", name: "Rita Sharma", email: "rita@multivenue.com", role: "Manager", status: "active", devices: 1, dataUsed: "18 GB", policy: "Misc Standard" },
    { id: "USR-MISC-003", name: "Event Guest", email: "guest@event.com", role: "Guest", status: "active", devices: 1, dataUsed: "3 GB", policy: "Misc Guest" },
    { id: "USR-MISC-004", name: "Vendor A", email: "vendor@service.com", role: "Vendor", status: "active", devices: 1, dataUsed: "5 GB", policy: "Misc Vendor" },
  ],
};

// ============================================
// SEGMENT-SPECIFIC POLICIES
// ============================================

export const segmentPolicies = {
  [SEGMENTS.ENTERPRISE]: [
    { id: "POL-ENT-001", name: "ProFi Business - Unlimited", speed: "100 Mbps", dataLimit: "Unlimited", devices: 5, users: 450, product: "profi_business" },
    { id: "POL-ENT-002", name: "ProFi Business - Standard", speed: "50 Mbps", dataLimit: "500 GB", devices: 3, users: 1200, product: "profi_business" },
    { id: "POL-ENT-003", name: "Business Wi-Fi - Basic", speed: "25 Mbps", dataLimit: "200 GB", devices: 2, users: 750, product: "business_wifi" },
  ],
  [SEGMENTS.HOTEL]: [
    { id: "POL-HTL-001", name: "ProFi Hotels - Premium", speed: "50 Mbps", dataLimit: "Unlimited", devices: 5, users: 280, product: "profi_hotels" },
    { id: "POL-HTL-002", name: "ProFi Hotels - Standard", speed: "25 Mbps", dataLimit: "50 GB/day", devices: 3, users: 1800, product: "profi_hotels" },
    { id: "POL-HTL-003", name: "ProFi Hotels - Event", speed: "100 Mbps", dataLimit: "Unlimited", devices: 50, users: 45, product: "profi_hotels" },
    { id: "POL-HTL-004", name: "ProFi Hotels - Staff", speed: "20 Mbps", dataLimit: "100 GB", devices: 2, users: 120, product: "profi_hotels" },
  ],
  [SEGMENTS.CO_LIVING]: [
    { id: "POL-COL-001", name: "ProFi Shared Living - Unlimited", speed: "100 Mbps", dataLimit: "Unlimited", devices: 5, users: 85, product: "profi_shared_living" },
    { id: "POL-COL-002", name: "ProFi Shared Living - Standard", speed: "50 Mbps", dataLimit: "500 GB", devices: 3, users: 420, product: "profi_shared_living" },
    { id: "POL-COL-003", name: "ProFi Shared Living - Basic", speed: "25 Mbps", dataLimit: "200 GB", devices: 2, users: 245, product: "profi_shared_living" },
  ],
  [SEGMENTS.PG]: [
    { id: "POL-PG-001", name: "ProFi PG - Premium", speed: "50 Mbps", dataLimit: "300 GB", devices: 3, users: 35, product: "profi_pg" },
    { id: "POL-PG-002", name: "ProFi PG - Standard", speed: "25 Mbps", dataLimit: "150 GB", devices: 2, users: 145, product: "profi_pg" },
    { id: "POL-PG-003", name: "ProFi PG - Basic", speed: "15 Mbps", dataLimit: "75 GB", devices: 1, users: 45, product: "profi_pg" },
  ],
  [SEGMENTS.CO_WORKING]: [
    { id: "POL-COW-001", name: "ProFi Business - Enterprise", speed: "100 Mbps", dataLimit: "Unlimited", devices: 25, users: 15, product: "profi_business" },
    { id: "POL-COW-002", name: "ProFi Business - Team", speed: "50 Mbps", dataLimit: "500 GB", devices: 10, users: 85, product: "profi_business" },
    { id: "POL-COW-003", name: "Business Wi-Fi - Individual", speed: "25 Mbps", dataLimit: "200 GB", devices: 3, users: 450, product: "business_wifi" },
    { id: "POL-COW-004", name: "Business Wi-Fi - Day Pass", speed: "15 Mbps", dataLimit: "10 GB/day", devices: 2, users: 120, product: "business_wifi" },
  ],
  [SEGMENTS.OFFICE]: [
    { id: "POL-OFF-001", name: "ProFi Office - Executive", speed: "100 Mbps", dataLimit: "Unlimited", devices: 5, users: 45, product: "profi_office" },
    { id: "POL-OFF-002", name: "ProFi Office - Manager", speed: "50 Mbps", dataLimit: "500 GB", devices: 3, users: 180, product: "profi_office" },
    { id: "POL-OFF-003", name: "ProFi SoHo - Standard", speed: "25 Mbps", dataLimit: "200 GB", devices: 2, users: 650, product: "profi_soho" },
    { id: "POL-OFF-004", name: "ProFi SoHo - Guest", speed: "10 Mbps", dataLimit: "20 GB", devices: 1, users: 85, product: "profi_soho" },
  ],
  [SEGMENTS.MISCELLANEOUS]: [
    { id: "POL-MISC-001", name: "Business Wi-Fi - Standard", speed: "25 Mbps", dataLimit: "150 GB", devices: 2, users: 180, product: "business_wifi" },
    { id: "POL-MISC-002", name: "Business Wi-Fi - Guest", speed: "15 Mbps", dataLimit: "10 GB", devices: 1, users: 120, product: "business_wifi" },
    { id: "POL-MISC-003", name: "Business Wi-Fi - Vendor", speed: "20 Mbps", dataLimit: "50 GB", devices: 2, users: 50, product: "business_wifi" },
  ],
};

// ============================================
// SEGMENT-SPECIFIC ACTIVITY LOGS
// ============================================

export const segmentActivityLogs = {
  [SEGMENTS.ENTERPRISE]: [
    { id: "LOG-ENT-001", timestamp: "2024-12-15T10:30:00Z", action: "User Created", site: "Mumbai HQ", user: "Priya Sharma", details: "New employee Rahul added", severity: "info" },
    { id: "LOG-ENT-002", timestamp: "2024-12-15T10:15:00Z", action: "Device Registered", site: "Delhi Branch", user: "Amit Verma", details: "MacBook Pro registered", severity: "info" },
    { id: "LOG-ENT-003", timestamp: "2024-12-15T09:45:00Z", action: "Policy Changed", site: "Bangalore Tech Center", user: "Sneha Rao", details: "Bandwidth limit updated", severity: "warning" },
    { id: "LOG-ENT-004", timestamp: "2024-12-15T09:30:00Z", action: "High Bandwidth Alert", site: "Hyderabad Office", user: "System", details: "90% threshold exceeded", severity: "critical" },
  ],
  [SEGMENTS.HOTEL]: [
    { id: "LOG-HTL-001", timestamp: "2024-12-15T10:30:00Z", action: "Guest Check-in", site: "Grand Resort Goa", user: "System", details: "Room 101 activated", severity: "info" },
    { id: "LOG-HTL-002", timestamp: "2024-12-15T10:15:00Z", action: "Event Started", site: "Grand Hotel Mumbai", user: "Meera Nair", details: "Conference Hall A activated", severity: "info" },
    { id: "LOG-HTL-003", timestamp: "2024-12-15T09:45:00Z", action: "Guest Check-out", site: "Heritage Palace Jaipur", user: "System", details: "Room 205 deactivated", severity: "info" },
    { id: "LOG-HTL-004", timestamp: "2024-12-15T09:30:00Z", action: "WiFi Complaint", site: "Grand Resort Goa", user: "Guest Services", details: "Connectivity issue reported", severity: "warning" },
  ],
  [SEGMENTS.CO_LIVING]: [
    { id: "LOG-COL-001", timestamp: "2024-12-15T10:30:00Z", action: "New Resident", site: "UrbanNest HSR", user: "Arun Kumar", details: "Bed 42 assigned to new resident", severity: "info" },
    { id: "LOG-COL-002", timestamp: "2024-12-15T10:15:00Z", action: "Device Added", site: "UrbanNest Whitefield", user: "Divya Menon", details: "Smart TV registered", severity: "info" },
    { id: "LOG-COL-003", timestamp: "2024-12-15T09:45:00Z", action: "Bandwidth Alert", site: "UrbanNest Powai", user: "System", details: "High usage detected", severity: "warning" },
  ],
  [SEGMENTS.PG]: [
    { id: "LOG-PG-001", timestamp: "2024-12-15T10:30:00Z", action: "Tenant Move-in", site: "ComfortStay Koramangala", user: "Ramesh Gupta", details: "New tenant registered", severity: "info" },
    { id: "LOG-PG-002", timestamp: "2024-12-15T10:15:00Z", action: "Device Limit Warning", site: "ComfortStay BTM", user: "System", details: "Device limit approaching", severity: "warning" },
    { id: "LOG-PG-003", timestamp: "2024-12-15T09:45:00Z", action: "Rent Due Reminder", site: "ComfortStay OMR", user: "System", details: "5 tenants have pending dues", severity: "info" },
  ],
  [SEGMENTS.CO_WORKING]: [
    { id: "LOG-COW-001", timestamp: "2024-12-15T10:30:00Z", action: "New Member", site: "FlexSpace Cyber Hub", user: "Neha Kapoor", details: "Startup Alpha onboarded", severity: "info" },
    { id: "LOG-COW-002", timestamp: "2024-12-15T10:15:00Z", action: "Meeting Room Booked", site: "FlexSpace BKC", user: "Ravi Menon", details: "Room A booked for 2 hours", severity: "info" },
    { id: "LOG-COW-003", timestamp: "2024-12-15T09:45:00Z", action: "High Traffic Alert", site: "FlexSpace Indiranagar", user: "System", details: "Network congestion detected", severity: "warning" },
  ],
  [SEGMENTS.OFFICE]: [
    { id: "LOG-OFF-001", timestamp: "2024-12-15T10:30:00Z", action: "Employee Onboarded", site: "Corporate Tower Mumbai", user: "Ashok Mehta", details: "New hire credentials created", severity: "info" },
    { id: "LOG-OFF-002", timestamp: "2024-12-15T10:15:00Z", action: "VPN Access Granted", site: "Corporate Plaza Delhi", user: "Suresh Kumar", details: "Remote access enabled", severity: "info" },
    { id: "LOG-OFF-003", timestamp: "2024-12-15T09:45:00Z", action: "Security Alert", site: "Corporate Hub Chennai", user: "System", details: "Unusual login pattern detected", severity: "critical" },
  ],
  [SEGMENTS.MISCELLANEOUS]: [
    { id: "LOG-MISC-001", timestamp: "2024-12-15T10:30:00Z", action: "Event Setup", site: "Community Center Delhi", user: "Alok Singh", details: "WiFi configured for event", severity: "info" },
    { id: "LOG-MISC-002", timestamp: "2024-12-15T10:15:00Z", action: "Vendor Access", site: "Event Space Mumbai", user: "Rita Sharma", details: "Temporary access granted", severity: "info" },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get company data for a specific segment
 */
export const getCompanyBySegment = (segment) => {
  return segmentCompanies[segment] || segmentCompanies[SEGMENTS.ENTERPRISE];
};

/**
 * Get sites for a specific segment
 */
export const getSitesBySegment = (segment) => {
  return segmentSites[segment] || segmentSites[SEGMENTS.ENTERPRISE];
};

/**
 * Check if a site is visible to customers
 * Only sites with status 'active' should be visible on customer portal
 * Sites in configuration_pending, under_configuration, under_testing, rfs_pending are NOT visible
 * @param {Object} site - Site object
 * @returns {boolean} - True if site should be visible to customers
 */
export const isSiteVisibleToCustomer = (site) => {
  return site.status?.toLowerCase() === 'active';
};

/**
 * Get active sites visible to customers for a specific segment
 * Only sites with status 'active' should be visible on customer portal
 * Sites in configuration_pending, under_testing, rfs_pending are not visible to customers
 * @param {string} segment - The segment key
 * @returns {Array} - Array of sites visible to customers
 */
export const getActiveSitesBySegment = (segment) => {
  const sites = getSitesBySegment(segment);
  return sites.filter((site) => isSiteVisibleToCustomer(site));
};

/**
 * Get users for a specific segment
 */
export const getUsersBySegment = (segment) => {
  return segmentUsers[segment] || segmentUsers[SEGMENTS.ENTERPRISE];
};

/**
 * Get policies for a specific segment
 */
export const getPoliciesBySegment = (segment) => {
  return segmentPolicies[segment] || segmentPolicies[SEGMENTS.ENTERPRISE];
};

/**
 * Get activity logs for a specific segment
 */
export const getActivityLogsBySegment = (segment) => {
  return segmentActivityLogs[segment] || segmentActivityLogs[SEGMENTS.ENTERPRISE];
};

/**
 * Get aggregated statistics for a segment
 */
export const getSegmentStats = (segment) => {
  const sites = getSitesBySegment(segment);
  const users = getUsersBySegment(segment);
  const policies = getPoliciesBySegment(segment);

  const totalUsers = sites.reduce((sum, site) => sum + site.totalUsers, 0);
  const activeUsers = sites.reduce((sum, site) => sum + site.activeUsers, 0);
  const totalDevices = sites.reduce((sum, site) => sum + site.totalDevices, 0);
  const activeDevices = sites.reduce((sum, site) => sum + site.activeDevices, 0);
  const totalAlerts = sites.reduce((sum, site) => sum + site.alerts, 0);
  const criticalAlerts = sites.reduce((sum, site) => sum + site.criticalAlerts, 0);
  const avgBandwidthUsage = sites.length > 0
    ? Math.round(sites.reduce((sum, site) => sum + site.bandwidthUsage, 0) / sites.length)
    : 0;

  return {
    totalSites: sites.length,
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    userActivityRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
    totalDevices,
    activeDevices,
    inactiveDevices: totalDevices - activeDevices,
    deviceActivityRate: totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0,
    totalAlerts,
    criticalAlerts,
    avgBandwidthUsage,
    sitesWithAlerts: sites.filter((site) => site.alerts > 0).length,
    sitesWithCriticalAlerts: sites.filter((site) => site.criticalAlerts > 0).length,
    totalPolicies: policies.length,
  };
};

/**
 * Get chart data for a segment
 */
export const getSegmentChartData = (segment) => {
  const sites = getSitesBySegment(segment);

  return {
    usersBySite: sites.map((site) => ({
      name: site.siteName,
      value: site.totalUsers,
      active: site.activeUsers,
    })),
    devicesBySite: sites.map((site) => ({
      name: site.siteName,
      value: site.totalDevices,
      active: site.activeDevices,
    })),
    bandwidthBySite: sites.map((site) => ({
      name: site.siteName,
      usage: site.bandwidthUsage,
      bandwidth: site.bandwidth,
    })),
    alertsBySite: sites.map((site) => ({
      name: site.siteName,
      alerts: site.alerts,
      critical: site.criticalAlerts,
    })),
  };
};

export default {
  segmentCompanies,
  segmentSites,
  segmentUsers,
  segmentPolicies,
  segmentActivityLogs,
  getCompanyBySegment,
  getSitesBySegment,
  getActiveSitesBySegment,
  isSiteVisibleToCustomer,
  getUsersBySegment,
  getPoliciesBySegment,
  getActivityLogsBySegment,
  getSegmentStats,
  getSegmentChartData,
};
