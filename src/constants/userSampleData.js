// src/constants/userSampleData.js

/**
 * Centralized User Sample Data - API Format Aligned
 *
 * ALIGNMENT STATUS:
 * - Structure aligned with Sample API (wifi portal).docx format
 * - Response wrapper pattern applied where appropriate
 * - Field naming follows API conventions
 *
 * MissingForAPI:
 * - can_id (CAN ID from AAA system) - Backend to provide
 * - whp_alert (WhatsApp alert preference) - Backend to provide
 * - dataCycleResetDate (Next reset date) - Backend to calculate
 * - dataCycle (Current cycle period) - Backend to calculate
 * - totalVolumeInMB (Policy volume in MB) - Backend to provide
 * - totalDataConsumed_nonFupInMB - Backend to calculate from sessions
 * - totalDataConsumed_FupInMB - Backend to calculate if FUP applied
 * - currentSession (Live session data) - Backend to provide from NAS
 * - data_topup, speed_topup, plan_topup, device_topup - Backend to track
 * - scpLink (Self-care portal link) - Backend to generate
 * - fupStatus (Fair Usage Policy status) - Backend to determine
 * - trimScpLink (Base64 encoded link) - Backend to generate
 * - stnUserfind (STN user mapping) - Backend to provide if applicable
 *
 * FrontendOnly:
 * - segment (UI categorization)
 * - siteName, siteId (Frontend display context)
 * - userCategory (Frontend grouping)
 * - usageTotalData, usageSessions, usageAvgSession (Computed from sessions)
 * - lastOnline (Friendly time format)
 * - Segment-specific fields (employeeId, department, residentType, etc.)
 */

import * as reportGen from '../utils/reportDataGenerator';

/**
 * Convert portal user data to API format
 * @param {object} user - Portal user object
 * @returns {object} API-formatted user response
 */
export const convertUserToAPIFormat = (user) => {
  return {
    user_id: user.mobile || user.id,
    account_id: `${user.siteId?.split('-')[0]}-${user.mobile || user.id}`,
    domain_id: user.siteId || "UNKNOWN_SITE",
    site_name: user.siteName || "Unknown Site",
    f_name: user.firstName,
    l_name: user.lastName,
    mobile: user.mobile,
    email: user.email || "",
    device_count: String(user.devicesCount || 0),
    status: user.status,
    pkg_id: user.userPolicy?.policyId || "POLICY_UNKNOWN",
    speedname: user.userPolicy?.speed || "Unknown",
    // Missing from portal - to be provided by backend
    can_id: "", // Backend to provide
    whp_alert: "Y", // Backend to provide
    dataCycleResetDate: "", // Backend to calculate
    dataCycle: "", // Backend to calculate
    totalVolumeInMB: 0, // Backend to provide
    totalDataConsumed_nonFupInMB: 0, // Backend to calculate
    totalDataConsumed_FupInMB: "0", // Backend to calculate
    currentSession: [], // Backend to provide
    data_topup: "", // Backend to track
    speed_topup: "", // Backend to track
    plan_topup: "", // Backend to track
    device_topup: "", // Backend to track
    scpLink: "", // Backend to generate
    fupStatus: "Not Applied" // Backend to determine
  };
};

/**
 * Sample Users - Enhanced with API alignment
 * Retains all portal business data while documenting API gaps
 */
export const sampleUsers = [
  // Enterprise - Mumbai Corporate Office
  {
    id: "USER001",
    firstName: "Amit",
    lastName: "Sharma",
    mobile: "+91-9876543210",
    email: "amit.sharma@mail.com",
    userPolicy: { 
      policyId: "ENT_WIFI_10Mbps_50GB",
      speed: "Upto 10 Mbps", 
      dataVolume: "50 GB", 
      deviceLimit: "3", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-01-15",
    lastOnline: "2 min ago",
    usageTotalData: "15.2 GB",
    usageSessions: 47,
    usageAvgSession: "3h 25m",
    usageLastOnline: "2 min ago",
    location: "Mumbai, Maharashtra",
    segment: "enterprise",
    siteName: "Mumbai Corporate Office",
    siteId: "SITE-MUM-ENT-001",
    employeeId: "E123",
    department: "Finance",
    userCategory: "employee",
    password: "387425",
  },
  {
    id: "USER011",
    firstName: "Ravi",
    lastName: "Kumar",
    mobile: "+91-9876543201",
    email: "ravi.kumar@mail.com",
    userPolicy: { 
      policyId: "ENT_WIFI_25Mbps_100GB",
      speed: "Upto 25 Mbps", 
      dataVolume: "100 GB", 
      deviceLimit: "5", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-04-15",
    lastOnline: "1 hour ago",
    usageTotalData: "46.3 GB",
    usageSessions: 55,
    usageAvgSession: "2h 18m",
    usageLastOnline: "1 hour ago",
    location: "Mumbai, Maharashtra",
    segment: "enterprise",
    siteName: "Mumbai Corporate Office",
    siteId: "SITE-MUM-ENT-001",
    employeeId: "E124",
    department: "Operations",
    userCategory: "employee",
    password: "582641",
  },
  {
    id: "USER012",
    firstName: "Neeta",
    lastName: "Singh",
    mobile: "+91-9876543222",
    email: "neeta.singh@mail.com",
    userPolicy: { 
      policyId: "ENT_WIFI_50Mbps_200GB",
      speed: "Upto 50 Mbps", 
      dataVolume: "200 GB", 
      deviceLimit: "4", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-06-15",
    lastOnline: "30 min ago",
    usageTotalData: "82.4 GB",
    usageSessions: 81,
    usageAvgSession: "4h 09m",
    usageLastOnline: "30 min ago",
    location: "Mumbai, Maharashtra",
    segment: "enterprise",
    siteName: "Mumbai Corporate Office",
    siteId: "SITE-MUM-ENT-001",
    employeeId: "E125",
    department: "Sales",
    userCategory: "employee",
    password: "741258",
  },
  
  // CoLiving - Spectra Urban Living - Bangalore
  {
    id: "USER003",
    firstName: "Rajesh",
    lastName: "Kumar",
    mobile: "+91-9988776655",
    email: "",
    userPolicy: {
      policyId: "COL_WIFI_10Mbps_50GB",
      speed: "Upto 10 Mbps",
      dataVolume: "50 GB",
      deviceLimit: "1",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Suspended",
    registration: "2024-02-20",
    lastOnline: "1 hour ago",
    usageTotalData: "8.7 GB",
    usageSessions: 13,
    usageAvgSession: "2h 00m",
    usageLastOnline: "1 hour ago",
    location: "Bangalore, Karnataka",
    segment: "coLiving",
    siteName: "Spectra Urban Living - Bangalore",
    siteId: "SITE-BLR-COL-002",
    residentType: "Tenant",
    roomNumber: "101A",
    userCategory: "resident",
    password: "529834",
  },
  {
    id: "USER013",
    firstName: "Anita",
    lastName: "Shah",
    mobile: "+91-9988776656",
    email: "",
    userPolicy: { 
      policyId: "COL_WIFI_15Mbps_75GB",
      speed: "Upto 15 Mbps", 
      dataVolume: "75 GB", 
      deviceLimit: "2", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-03-20",
    lastOnline: "20 min ago",
    usageTotalData: "49.2 GB",
    usageSessions: 89,
    usageAvgSession: "2h 44m",
    usageLastOnline: "20 min ago",
    location: "Bangalore, Karnataka",
    segment: "coLiving",
    siteName: "Spectra Urban Living - Bangalore",
    siteId: "SITE-BLR-COL-002",
    residentType: "Owner",
    roomNumber: "202B",
    userCategory: "resident",
    password: "346872",
  },
  {
    id: "USER014",
    firstName: "Vipin",
    lastName: "Nair",
    mobile: "+91-9988776657",
    email: "",
    userPolicy: {
      policyId: "COL_WIFI_20Mbps_90GB",
      speed: "Upto 20 Mbps",
      dataVolume: "90 GB",
      deviceLimit: "3",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-04-22",
    lastOnline: "15 min ago",
    usageTotalData: "61.5 GB",
    usageSessions: 72,
    usageAvgSession: "3h 10m",
    usageLastOnline: "15 min ago",
    location: "Bangalore, Karnataka",
    segment: "coLiving",
    siteName: "Spectra Urban Living - Bangalore",
    siteId: "SITE-BLR-COL-002",
    residentType: "Tenant",
    roomNumber: "303C",
    userCategory: "resident",
    password: "192847",
  },
  
  // CoWorking - Spectra WorkHub - Pune
  {
    id: "USER005",
    firstName: "Sanjay",
    lastName: "Rao",
    mobile: "+91-9012345678",
    email: "",
    userPolicy: {
      policyId: "COW_WIFI_10Mbps_50GB",
      speed: "Upto 10 Mbps",
      dataVolume: "50 GB",
      deviceLimit: "1",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Blocked",
    registration: "2024-03-01",
    lastOnline: "2 days ago",
    usageTotalData: "20.2 GB",
    usageSessions: 15,
    usageAvgSession: "1h 32m",
    usageLastOnline: "2 days ago",
    location: "Pune, Maharashtra",
    segment: "coWorking",
    siteName: "Spectra WorkHub - Pune",
    siteId: "SITE-PUN-COW-003",
    companyName: "Tech Solutions",
    deskNumber: "D12",
    userCategory: "member",
    password: "918352",
  },
  {
    id: "USER015",
    firstName: "Suresh",
    lastName: "Kumar",
    mobile: "+91-9012345679",
    email: "suresh.kumar@mail.com",
    userPolicy: { 
      policyId: "COW_WIFI_15Mbps_75GB",
      speed: "Upto 15 Mbps", 
      dataVolume: "75 GB", 
      deviceLimit: "2", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 1,
    status: "Active",
    registration: "2024-05-01",
    lastOnline: "1 hour ago",
    usageTotalData: "31.6 GB",
    usageSessions: 41,
    usageAvgSession: "2h 05m",
    usageLastOnline: "1 hour ago",
    location: "Pune, Maharashtra",
    segment: "coWorking",
    siteName: "Spectra WorkHub - Pune",
    siteId: "SITE-PUN-COW-003",
    companyName: "StartUp India",
    deskNumber: "A5",
    userCategory: "member",
    password: "658374",
  },
  {
    id: "USER016",
    firstName: "Pooja",
    lastName: "Joshi",
    mobile: "+91-9012345680",
    email: "pooja.joshi@mail.com",
    userPolicy: {
      policyId: "COW_WIFI_20Mbps_100GB",
      speed: "Upto 20 Mbps",
      dataVolume: "100 GB",
      deviceLimit: "3",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-06-20",
    lastOnline: "30 min ago",
    usageTotalData: "90.8 GB",
    usageSessions: 58,
    usageAvgSession: "4h 15m",
    usageLastOnline: "30 min ago",
    location: "Pune, Maharashtra",
    segment: "coWorking",
    siteName: "Spectra WorkHub - Pune",
    siteId: "SITE-PUN-COW-003",
    companyName: "Freelancers Ltd",
    deskNumber: "C12",
    userCategory: "member",
    password: "487392",
  },
  
  // Hotel - Spectra Grand Hotel - Goa
  {
    id: "USER007",
    firstName: "Vikram",
    lastName: "Chatterjee",
    mobile: "+91-9988123456",
    email: "",
    userPolicy: {
      policyId: "HTL_WIFI_10Mbps_50GB_Daily",
      speed: "Upto 10 Mbps",
      dataVolume: "50 GB",
      deviceLimit: "1",
      dataCycleType: "Daily"
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-03-15",
    lastOnline: "12 min ago",
    usageTotalData: "5.8 GB",
    usageSessions: 7,
    usageAvgSession: "0h 41m",
    usageLastOnline: "12 min ago",
    location: "Goa",
    segment: "hotel",
    siteName: "Spectra Grand Hotel - Goa",
    siteId: "SITE-GOA-HTL-004",
    roomNumber: "305",
    floor: "3",
    checkInDate: "2025-09-01",
    checkOutDate: "2025-09-07",
    userCategory: "guest",
    password: "296153",
  },
  {
    id: "USER017",
    firstName: "Ramesh",
    lastName: "Iyer",
    mobile: "+91-9988123457",
    email: "",
    userPolicy: {
      policyId: "HTL_WIFI_15Mbps_70GB_Daily",
      speed: "Upto 15 Mbps",
      dataVolume: "70 GB",
      deviceLimit: "2",
      dataCycleType: "Daily"
    },
    devicesCount: 1,
    status: "Active",
    registration: "2024-04-18",
    lastOnline: "10 min ago",
    usageTotalData: "12.2 GB",
    usageSessions: 18,
    usageAvgSession: "1h 22m",
    usageLastOnline: "10 min ago",
    location: "Goa",
    segment: "hotel",
    siteName: "Spectra Grand Hotel - Goa",
    siteId: "SITE-GOA-HTL-004",
    roomNumber: "312",
    floor: "3",
    checkInDate: "2025-10-01",
    checkOutDate: "2025-10-15",
    userCategory: "guest",
    password: "714589",
  },
  {
    id: "USER018",
    firstName: "Anita",
    lastName: "Kapoor",
    mobile: "+91-9988123458",
    email: "",
    userPolicy: {
      policyId: "HTL_WIFI_20Mbps_100GB_Daily",
      speed: "Upto 20 Mbps",
      dataVolume: "100 GB",
      deviceLimit: "3",
      dataCycleType: "Daily"
    },
    devicesCount: 2,
    status: "Suspended",
    registration: "2024-05-25",
    lastOnline: "1 hour ago",
    usageTotalData: "21.9 GB",
    usageSessions: 33,
    usageAvgSession: "1h 47m",
    usageLastOnline: "1 hour ago",
    location: "Goa",
    segment: "hotel",
    siteName: "Spectra Grand Hotel - Goa",
    siteId: "SITE-GOA-HTL-004",
    roomNumber: "320",
    floor: "3",
    checkInDate: "2025-11-05",
    checkOutDate: "2025-11-10",
    userCategory: "guest",
    password: "829163",
  },
  
  // PG - Spectra PG Residency - Chennai
  {
    id: "USER008",
    firstName: "Divya",
    lastName: "Nair",
    mobile: "+91-9876541230",
    email: "",
    userPolicy: {
      policyId: "PG_WIFI_25Mbps_100GB",
      speed: "Upto 25 Mbps",
      dataVolume: "100 GB",
      deviceLimit: "4",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Suspended",
    registration: "2024-03-12",
    lastOnline: "3 hours ago",
    usageTotalData: "40.4 GB",
    usageSessions: 64,
    usageAvgSession: "2h 41m",
    usageLastOnline: "3 hours ago",
    location: "Chennai, Tamil Nadu",
    segment: "pg",
    siteName: "Spectra PG Residency - Chennai",
    siteId: "SITE-CHN-PGR-005",
    pgType: "Female",
    roomNumber: "B12",
    userCategory: "resident",
    password: "837492",
  },
  {
    id: "USER019",
    firstName: "Sita",
    lastName: "Kumari",
    mobile: "+91-9876541231",
    email: "",
    userPolicy: {
      policyId: "PG_WIFI_15Mbps_75GB",
      speed: "Upto 15 Mbps",
      dataVolume: "75 GB",
      deviceLimit: "2",
      dataCycleType: "Monthly"
    },
    devicesCount: 1,
    status: "Active",
    registration: "2024-06-20",
    lastOnline: "45 min ago",
    usageTotalData: "24.9 GB",
    usageSessions: 32,
    usageAvgSession: "1h 54m",
    usageLastOnline: "45 min ago",
    location: "Chennai, Tamil Nadu",
    segment: "pg",
    siteName: "Spectra PG Residency - Chennai",
    siteId: "SITE-CHN-PGR-005",
    pgType: "Male",
    roomNumber: "B15",
    userCategory: "resident",
    password: "481726",
  },
  {
    id: "USER020",
    firstName: "Kiran",
    lastName: "Sharma",
    mobile: "+91-9876541232",
    email: "",
    userPolicy: { 
      policyId: "PG_WIFI_10Mbps_50GB",
      speed: "Upto 10 Mbps", 
      dataVolume: "50 GB", 
      deviceLimit: "1", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 1,
    status: "Active",
    registration: "2024-06-25",
    lastOnline: "30 min ago",
    usageTotalData: "12.1 GB",
    usageSessions: 24,
    usageAvgSession: "1h 17m",
    usageLastOnline: "30 min ago",
    location: "Chennai, Tamil Nadu",
    segment: "pg",
    siteName: "Spectra PG Residency - Chennai",
    siteId: "SITE-CHN-PGR-005",
    pgType: "Female",
    roomNumber: "B18",
    userCategory: "resident",
    password: "536718",
  },
  
  // Miscellaneous - Spectra Community Hub - Delhi
  {
    id: "USER009",
    firstName: "Rahul",
    lastName: "Desai",
    mobile: "+91-9098765432",
    email: "rahul.desai@mail.com",
    userPolicy: {
      policyId: "MIS_WIFI_50Mbps_100GB",
      speed: "Upto 50 Mbps",
      dataVolume: "100 GB",
      deviceLimit: "6",
      dataCycleType: "Monthly"
    },
    devicesCount: 2,
    status: "Active",
    registration: "2024-03-17",
    lastOnline: "30 sec ago",
    usageTotalData: "77.0 GB",
    usageSessions: 110,
    usageAvgSession: "3h 34m",
    usageLastOnline: "30 sec ago",
    location: "Delhi",
    segment: "miscellaneous",
    siteName: "Spectra Community Hub - Delhi",
    siteId: "SITE-DEL-MIS-006",
    notes: "VIP",
    userCategory: "user",
    password: "194756",
  },
  {
    id: "USER021",
    firstName: "Neelam",
    lastName: "Patel",
    mobile: "+91-9098765433",
    email: "neelam.patel@mail.com",
    userPolicy: { 
      policyId: "MIS_WIFI_20Mbps_80GB",
      speed: "Upto 20 Mbps", 
      dataVolume: "80 GB", 
      deviceLimit: "3", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 3,
    status: "Active",
    registration: "2024-04-20",
    lastOnline: "10 min ago",
    usageTotalData: "35.5 GB",
    usageSessions: 60,
    usageAvgSession: "2h 52m",
    usageLastOnline: "10 min ago",
    location: "Delhi",
    segment: "miscellaneous",
    siteName: "Spectra Community Hub - Delhi",
    siteId: "SITE-DEL-MIS-006",
    notes: "Regular",
    userCategory: "user",
    password: "615283",
  },
  {
    id: "USER022",
    firstName: "Raja",
    lastName: "Singh",
    mobile: "+91-9098765434",
    email: "raja.singh@mail.com",
    userPolicy: { 
      policyId: "MIS_WIFI_10Mbps_10GB",
      speed: "Upto 10 Mbps", 
      dataVolume: "10 GB", 
      deviceLimit: "1", 
      dataCycleType: "Monthly" 
    },
    devicesCount: 1,
    status: "Suspended",
    registration: "2024-05-20",
    lastOnline: "15 min ago",
    usageTotalData: "2.9 GB",
    usageSessions: 11,
    usageAvgSession: "1h 02m",
    usageLastOnline: "15 min ago",
    location: "Delhi",
    segment: "miscellaneous",
    siteName: "Spectra Community Hub - Delhi",
    siteId: "SITE-DEL-MIS-006",
    notes: "Inactive",
    userCategory: "user",
    password: "789145",
  }
];

// ============================================
// DEVICE DATA - API Format Aligned
// ============================================

/**
 * MissingForAPI (Devices):
 * - Real-time online/offline status from network
 * - Current session bandwidth usage
 * - Device vendor/manufacturer from MAC OUI lookup
 * - Signal strength if connected
 * - AP name if connected
 * 
 * FrontendOnly (Devices):
 * - userId grouping
 * - category (display grouping)
 * - blocked flag (portal-specific)
 */

export const sampleDevices = [
  // Amit Sharma's devices (USER001)
  {
    id: "dev001",
    userId: "USER001",
    name: "iPhone 14 Pro",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B7",
    ip: "192.168.1.142",
    additionDate: "2024-08-15",
    lastUsageDate: "2 hours ago",
    dataUsage: "245 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev002",
    userId: "USER001",
    name: "Lenovo ThinkPad",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D1",
    ip: "192.168.1.159",
    additionDate: "2024-09-01",
    lastUsageDate: "10 minutes ago",
    dataUsage: "1.5 GB",
    online: true,
    blocked: false
  },
  
  // Neeta Singh's devices (USER012)
  {
    id: "dev003",
    userId: "USER012",
    name: "MacBook Air",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:C8",
    ip: "192.168.1.156",
    additionDate: "2024-07-22",
    lastUsageDate: "1 hour ago",
    dataUsage: "1.2 GB",
    online: true,
    blocked: false
  },
  {
    id: "dev004",
    userId: "USER012",
    name: "iPhone 12 Mini",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C1",
    ip: "192.168.1.146",
    additionDate: "2024-08-30",
    lastUsageDate: "6 hours ago",
    dataUsage: "234 MB",
    online: false,
    blocked: false
  },
  
  // Rajesh Kumar's devices (USER003)
  {
    id: "dev005",
    userId: "USER003",
    name: "iPhone 13",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B8",
    ip: "192.168.1.143",
    additionDate: "2024-06-10",
    lastUsageDate: "3 hours ago",
    dataUsage: "189 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev006",
    userId: "USER003",
    name: "MacBook Pro 16",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D2",
    ip: "192.168.1.160",
    additionDate: "2024-07-15",
    lastUsageDate: "20 minutes ago",
    dataUsage: "3.2 GB",
    online: true,
    blocked: false
  },
  
  // Vikram Chatterjee's devices (USER007)
  {
    id: "dev007",
    userId: "USER007",
    name: "Dell XPS 15",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:C9",
    ip: "192.168.1.157",
    additionDate: "2024-05-18",
    lastUsageDate: "30 minutes ago",
    dataUsage: "890 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev008",
    userId: "USER007",
    name: "Google Pixel 7",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C2",
    ip: "192.168.1.147",
    additionDate: "2024-09-05",
    lastUsageDate: "4 hours ago",
    dataUsage: "345 MB",
    online: false,
    blocked: false
  },
  
  // Divya Nair's devices (USER008)
  {
    id: "dev009",
    userId: "USER008",
    name: "Samsung Galaxy S22",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B9",
    ip: "192.168.1.144",
    additionDate: "2024-06-28",
    lastUsageDate: "5 hours ago",
    dataUsage: "567 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev010",
    userId: "USER008",
    name: "Asus ROG",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D3",
    ip: "192.168.1.161",
    additionDate: "2024-07-10",
    lastUsageDate: "25 minutes ago",
    dataUsage: "2.8 GB",
    online: true,
    blocked: false
  },
  
  // Sanjay Rao's devices (USER005)
  {
    id: "dev011",
    userId: "USER005",
    name: "HP Pavilion",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D0",
    ip: "192.168.1.158",
    additionDate: "2024-08-20",
    lastUsageDate: "15 minutes ago",
    dataUsage: "2.1 GB",
    online: true,
    blocked: true
  },
  {
    id: "dev012",
    userId: "USER005",
    name: "Samsung Galaxy Tab S8",
    type: "mobile",
    category: "Tablet",
    mac: "00:1B:44:11:3A:E5",
    ip: "192.168.1.170",
    additionDate: "2024-09-03",
    lastUsageDate: "2 hours ago",
    dataUsage: "678 MB",
    online: true,
    blocked: false
  },
  
  // Rahul Desai's devices (USER009)
  {
    id: "dev013",
    userId: "USER009",
    name: "iPad Pro",
    type: "mobile",
    category: "Tablet",
    mac: "00:1B:44:11:3A:C0",
    ip: "192.168.1.145",
    additionDate: "2024-09-12",
    lastUsageDate: "45 minutes ago",
    dataUsage: "432 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev014",
    userId: "USER009",
    name: "Microsoft Surface",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D4",
    ip: "192.168.1.162",
    additionDate: "2024-08-05",
    lastUsageDate: "1 hour ago",
    dataUsage: "1.8 GB",
    online: true,
    blocked: false
  },
  
  // Ravi Kumar's devices (USER011)
  {
    id: "dev015",
    userId: "USER011",
    name: "OnePlus 11",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C3",
    ip: "192.168.1.148",
    additionDate: "2024-07-18",
    lastUsageDate: "3 hours ago",
    dataUsage: "456 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev016",
    userId: "USER011",
    name: "Acer Aspire",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D5",
    ip: "192.168.1.163",
    additionDate: "2024-06-22",
    lastUsageDate: "50 minutes ago",
    dataUsage: "2.3 GB",
    online: true,
    blocked: false
  },
  
  // Anita Shah's devices (USER013)
  {
    id: "dev017",
    userId: "USER013",
    name: "Xiaomi 13 Pro",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C4",
    ip: "192.168.1.149",
    additionDate: "2024-08-08",
    lastUsageDate: "4 hours ago",
    dataUsage: "389 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev018",
    userId: "USER013",
    name: "HP Envy",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D6",
    ip: "192.168.1.164",
    additionDate: "2024-07-25",
    lastUsageDate: "35 minutes ago",
    dataUsage: "1.9 GB",
    online: true,
    blocked: false
  },
  
  // Vipin Nair's devices (USER014)
  {
    id: "dev019",
    userId: "USER014",
    name: "Vivo X90",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C5",
    ip: "192.168.1.150",
    additionDate: "2024-09-01",
    lastUsageDate: "1 hour ago",
    dataUsage: "523 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev020",
    userId: "USER014",
    name: "Lenovo IdeaPad",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D7",
    ip: "192.168.1.165",
    additionDate: "2024-06-30",
    lastUsageDate: "22 minutes ago",
    dataUsage: "2.6 GB",
    online: true,
    blocked: false
  },
  
  // Suresh Kumar's devices (USER015)
  {
    id: "dev021",
    userId: "USER015",
    name: "Realme GT 2",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C6",
    ip: "192.168.1.151",
    additionDate: "2024-07-12",
    lastUsageDate: "5 hours ago",
    dataUsage: "412 MB",
    online: false,
    blocked: false
  },
  
  // Pooja Joshi's devices (USER016)
  {
    id: "dev022",
    userId: "USER016",
    name: "Oppo Find X5",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C7",
    ip: "192.168.1.152",
    additionDate: "2024-08-25",
    lastUsageDate: "2 hours ago",
    dataUsage: "345 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev023",
    userId: "USER016",
    name: "Dell Inspiron",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D8",
    ip: "192.168.1.166",
    additionDate: "2024-07-05",
    lastUsageDate: "40 minutes ago",
    dataUsage: "1.7 GB",
    online: true,
    blocked: false
  },
  
  // Ramesh Iyer's device (USER017)
  {
    id: "dev024",
    userId: "USER017",
    name: "Asus ZenBook",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D9",
    ip: "192.168.1.167",
    additionDate: "2024-06-15",
    lastUsageDate: "3 days ago",
    dataUsage: "850 MB",
    online: false,
    blocked: false
  },
  
  // Anita Kapoor's devices (USER018)
  {
    id: "dev025",
    userId: "USER018",
    name: "Nothing Phone 2",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CA",
    ip: "192.168.1.153",
    additionDate: "2024-09-10",
    lastUsageDate: "30 minutes ago",
    dataUsage: "298 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev026",
    userId: "USER018",
    name: "MSI Prestige",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:DA",
    ip: "192.168.1.168",
    additionDate: "2024-08-12",
    lastUsageDate: "18 minutes ago",
    dataUsage: "3.1 GB",
    online: true,
    blocked: false
  },
  
  // Sita Kumari's device (USER019)
  {
    id: "dev027",
    userId: "USER019",
    name: "Motorola Edge 40",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CB",
    ip: "192.168.1.154",
    additionDate: "2024-07-28",
    lastUsageDate: "6 hours ago",
    dataUsage: "478 MB",
    online: false,
    blocked: false
  },

  // Kiran Sharma's device (USER020)
  {
    id: "dev028",
    userId: "USER020",
    name: "Samsung Galaxy A54",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CC",
    ip: "192.168.1.155",
    additionDate: "2024-08-02",
    lastUsageDate: "2 hours ago",
    dataUsage: "312 MB",
    online: true,
    blocked: false
  },

  // Neelam Patel's devices (USER021)
  {
    id: "dev029",
    userId: "USER021",
    name: "Redmi Note 12",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CD",
    ip: "192.168.1.171",
    additionDate: "2024-07-08",
    lastUsageDate: "45 minutes ago",
    dataUsage: "289 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev030",
    userId: "USER021",
    name: "HP Pavilion 15",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:DB",
    ip: "192.168.1.172",
    additionDate: "2024-06-18",
    lastUsageDate: "1 hour ago",
    dataUsage: "1.4 GB",
    online: true,
    blocked: false
  },
  {
    id: "dev031",
    userId: "USER021",
    name: "iPad Mini",
    type: "mobile",
    category: "Tablet",
    mac: "00:1B:44:11:3A:CE",
    ip: "192.168.1.173",
    additionDate: "2024-08-15",
    lastUsageDate: "3 hours ago",
    dataUsage: "567 MB",
    online: false,
    blocked: false
  },

  // Raja Singh's device (USER022)
  {
    id: "dev032",
    userId: "USER022",
    name: "Poco X5",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CF",
    ip: "192.168.1.174",
    additionDate: "2024-09-01",
    lastUsageDate: "4 hours ago",
    dataUsage: "156 MB",
    online: false,
    blocked: false
  }
];

// ============================================
// USER REPORT DATA - API Format Aligned
// ============================================

/**
 * MissingForAPI (Reports):
 * - Real-time session data aggregation
 * - Historical data beyond portal scope
 * - AAA system correlation data
 * 
 * FrontendOnly (Reports):
 * - segment field for filtering
 * - Friendly date/time formats
 * - Computed averages from sessions
 */

export const userReportData = {
  // 90 days of comprehensive user session data (hundreds of sessions)
  "user-session-history": reportGen.generateUserSessions('2024-01-01', 90),

  // 90 days of user data consumption (thousands of records)
  "user-data-consumption": reportGen.generateUserDataConsumption('2024-01-01', 90),
};

// ============================================
// HELPER FUNCTIONS - Preserved
// ============================================

export const getUserReportData = (reportId) => {
  return userReportData[reportId] || null;
};

export const isUserReport = (reportId) => {
  return reportId in userReportData;
};

export const getUserReportIds = () => {
  return Object.keys(userReportData);
};

export const getUserReportDataByUser = (reportId, userId) => {
  const reportData = userReportData[reportId];
  if (!reportData) return null;
  return reportData.filter(item => item.userId === userId);
};

export const getUserReportDataBySegment = (reportId, segment) => {
  const reportData = userReportData[reportId];
  if (!reportData) return null;
  return reportData.filter(item => item.segment === segment);
};

// ============================================
// DEFAULT EXPORT - Preserved
// ============================================

export default {
  users: sampleUsers,
  devices: sampleDevices,
  reportData: userReportData,
  getUserReportData,
  isUserReport,
  getUserReportIds,
  getUserReportDataByUser,
  getUserReportDataBySegment,
  convertUserToAPIFormat
};