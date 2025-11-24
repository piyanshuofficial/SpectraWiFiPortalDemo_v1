// src/config/siteConfig.js
const siteConfig = {
  // Default site (can be overridden based on segment)
  siteName: "Mumbai Corporate Office",
  siteId: "SITE-MUM-ENT-001",
  company: "Spectra Technologies",
  segment: "Enterprise",
  accessLevel: "Site",
  
  // Segment-specific site configurations
  segmentSites: {
    enterprise: {
      siteName: "Mumbai Corporate Office",
      siteId: "SITE-MUM-ENT-001",
      location: "Mumbai, Maharashtra",
      address: "Spectra Business Park, Andheri East, Mumbai - 400069"
    },
    coLiving: {
      siteName: "Spectra Urban Living - Bangalore",
      siteId: "SITE-BLR-COL-002",
      location: "Bangalore, Karnataka",
      address: "Koramangala, Bangalore - 560034"
    },
    coWorking: {
      siteName: "Spectra WorkHub - Pune",
      siteId: "SITE-PUN-COW-003",
      location: "Pune, Maharashtra",
      address: "Hinjewadi IT Park, Pune - 411057"
    },
    hotel: {
      siteName: "Spectra Grand Hotel - Goa",
      siteId: "SITE-GOA-HTL-004",
      location: "Goa",
      address: "Calangute Beach Road, Goa - 403516"
    },
    pg: {
      siteName: "Spectra PG Residency - Chennai",
      siteId: "SITE-CHN-PGR-005",
      location: "Chennai, Tamil Nadu",
      address: "Adyar, Chennai - 600020"
    },
    miscellaneous: {
      siteName: "Spectra Community Hub - Delhi",
      siteId: "SITE-DEL-MIS-006",
      location: "Delhi",
      address: "Connaught Place, New Delhi - 110001",
      // Data cycle type configuration (set during site provisioning)
      // ========================================
      // TODO: Backend Integration - Site Provisioning Configuration
      // ========================================
      // This should be configured during site setup by IT team
      // Backend endpoint: POST /api/sites/{siteId}/configure
      // Payload: { dataCycleType: 'Daily' | 'Monthly' }
      // Store in site_config table and fetch during site load
      // ========================================
      dataCycleType: "Monthly" // Default for demo portal, can be 'Daily' or 'Monthly'
    }
  },
  
  licenses: {
    maxLicenses: 250,
    usedLicenses: 142,
    availableLicenses: 108,
    licenseType: "Active User Licenses",
    lowThreshold: 75,
    criticalThreshold: 90
  },
  
  dashboard: {
    activeUsers: 850,
    totalDevices: 3892,
    avgDataUsage: "152 GB",
    networkUptime: "99.8%",
    quickActions: [
      {
        id: "add-user",
        label: "Add User",
        icon: "UserPlus",
        path: "/users",
        color: "#0066cc",
        permission: "user.create"
      },
      {
        id: "view-reports",
        label: "View Reports",
        icon: "BarChart2",
        path: "/reports",
        color: "#00a86b",
        permission: "reports.view"
      },
      {
        id: "manage-devices",
        label: "Manage Devices",
        icon: "Smartphone",
        path: "/devices",
        color: "#ff6b35",
        permission: "devices.manage"
      },
      {
        id: "view-alerts",
        label: "View Alerts",
        icon: "Bell",
        path: "/alerts",
        color: "#e63946",
        permission: "alerts.view"
      }
    ],
    recentActivities: [
      {
        id: 1,
        text: "New user 'john.doe' registered",
        time: "2 mins ago"
      },
      {
        id: 2,
        text: "Device 'iPhone 13' connected",
        time: "5 mins ago"
      },
      {
        id: 3,
        text: "Monthly report generated",
        time: "15 mins ago"
      },
      {
        id: 4,
        text: "User 'jane.smith' password reset",
        time: "1 hour ago"
      },
      {
        id: 5,
        text: "Network maintenance completed",
        time: "2 hours ago"
      }
    ]
  },
  
  devices: {
    totalDevices: 3892,
    onlineDevices: 2145,
    offlineDevices: 1724,
    blockedDevices: 23,
    accessPoints: 48,
    mobileDevices: 2234,
    laptopDevices: 1658,
    categories: {
      smartphones: 1687,
      tablets: 547,
      laptops: 1658,
      iot: 0
    }
  },
  
  users: {
    totalUsers: 850,
    activeUsers: 785,
    inactiveUsers: 45,
    restrictedUsers: 20,
    defaultPolicy: "Standard Access",
    maxDevicesPerUser: 5
  },
  
  network: {
    ssids: ["Spectra-Guest", "Spectra-Staff", "Spectra-Admin"],
    bandwidth: {
      total: "1 Gbps",
      used: "654 Mbps",
      available: "346 Mbps"
    },
    uptime: "99.8%",
    activeConnections: 2145,
    avgSpeed: {
      download: "85 Mbps",
      upload: "42 Mbps"
    }
  },

  policies: [
    {
      id: "standard",
      name: "Standard Access",
      speed: "50 Mbps",
      dataLimit: "Unlimited",
      maxDevices: 3,
      duration: "Unlimited"
    },
    {
      id: "premium",
      name: "Premium Access",
      speed: "100 Mbps",
      dataLimit: "Unlimited",
      maxDevices: 5,
      duration: "Unlimited"
    },
    {
      id: "basic",
      name: "Basic Access",
      speed: "25 Mbps",
      dataLimit: "50 GB/month",
      maxDevices: 2,
      duration: "30 days"
    },
    {
      id: "guest",
      name: "Guest Access",
      speed: "10 Mbps",
      dataLimit: "5 GB/day",
      maxDevices: 1,
      duration: "24 hours"
    }
  ],

  permissions: {
    "user.create": ["admin", "userManager"],
    "user.edit": ["admin", "userManager"],
    "user.delete": ["admin"],
    "user.view": ["admin", "userManager", "viewer"],
    "devices.manage": ["admin", "networkAdmin"],
    "devices.view": ["admin", "networkAdmin", "viewer"],
    "reports.view": ["admin", "userManager", "networkAdmin", "viewer"],
    "reports.export": ["admin", "userManager", "networkAdmin"],
    "alerts.view": ["admin", "networkAdmin"],
    "alerts.manage": ["admin", "networkAdmin"],
    "settings.manage": ["admin"]
  },

  userRoles: [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access"
    },
    {
      id: "userManager",
      name: "User Manager",
      description: "Manage users and view reports"
    },
    {
      id: "networkAdmin",
      name: "Network Administrator",
      description: "Manage devices and network settings"
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to data"
    }
  ],

  support: {
    email: "support@spectra.co",
    phone: "+1800 121 5678",
    helpdesk: "https://www.spectra.co",
    documentation: "https://www.spectra.co"
  }
};

export default siteConfig;