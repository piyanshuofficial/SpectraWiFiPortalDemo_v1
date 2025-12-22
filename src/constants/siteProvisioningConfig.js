// src/constants/siteProvisioningConfig.js

/**
 * Site Provisioning Configuration
 * Contains all constants, default values, validation rules, and master data
 * for the site provisioning workflow.
 */

// ============================================
// INDIAN STATES LIST
// ============================================
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu and Kashmir", "Ladakh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
];

// ============================================
// REGIONS
// ============================================
export const REGIONS = ["North", "South", "East", "West", "Central"];

// ============================================
// SOLUTION TYPES
// ============================================
export const SOLUTION_TYPES = [
  {
    value: "managed_wifi",
    label: "Managed WiFi",
    description: "Full service including internet provisioning and management by Spectra",
    internetManaged: true,
    topupsEnabled: true
  },
  {
    value: "managed_wifi_infra",
    label: "Managed WiFi Infra",
    description: "WiFi infrastructure only - Internet not provisioned or managed by Spectra",
    internetManaged: false,
    topupsEnabled: false
  }
];

// ============================================
// SITE TYPES / SEGMENTS
// ============================================
export const SITE_TYPES = [
  { value: "enterprise", label: "Enterprise" },
  { value: "office", label: "Office" },
  { value: "hotel", label: "Hotel" },
  { value: "coLiving", label: "Co-Living" },
  { value: "coWorking", label: "Co-Working" },
  { value: "pg", label: "PG (Paying Guest)" },
  { value: "miscellaneous", label: "Miscellaneous" }
];

// ============================================
// PRODUCT NAMES
// ============================================
export const PRODUCT_NAMES = [
  { value: "profi_pg", label: "ProFi for PG", segments: ["pg"] },
  { value: "profi_hotels", label: "ProFi for Hotels", segments: ["hotel"] },
  { value: "profi_office", label: "ProFi for Office", segments: ["office"] },
  { value: "profi_soho", label: "ProFi for SoHo", segments: ["office"] },
  { value: "profi_business", label: "ProFi Business", segments: ["enterprise", "office", "coWorking", "miscellaneous"] },
  { value: "business_wifi", label: "Business Wi-Fi", segments: ["enterprise", "office", "coWorking", "miscellaneous"] },
  { value: "profi_shared_living", label: "ProFi for Shared Living", segments: ["coLiving"], defaultSegment: "coLiving" }
];

/**
 * Get products available for a specific segment
 * @param {string} segment - The segment type (e.g., 'pg', 'hotel', 'office', etc.)
 * @returns {Array} - Array of products available for the segment
 */
export const getProductsBySegment = (segment) => {
  if (!segment) return PRODUCT_NAMES;
  return PRODUCT_NAMES.filter(product =>
    product.segments.includes(segment.toLowerCase())
  );
};

// ============================================
// BANDWIDTH TYPES
// ============================================
export const BANDWIDTH_TYPES = [
  { value: "fixed", label: "Fixed Bandwidth" },
  { value: "userLevel", label: "User Level Bandwidth" }
];

// ============================================
// TRAFFIC FLOW TYPES
// ============================================
export const TRAFFIC_FLOW_TYPES = [
  { value: "fortinet_lb", label: "Fortinet Load Balancer" },
  { value: "tunnel", label: "Tunnel Solution" },
  { value: "tunnel_lb", label: "Tunnel + Load Balancer" }
];

// ============================================
// WIRELESS CONTROLLER VERSIONS
// ============================================
export const WIRELESS_CONTROLLER_VERSIONS = [
  { value: "v8.0", label: "Version 8.0" },
  { value: "v8.5", label: "Version 8.5" },
  { value: "v9.0", label: "Version 9.0" },
  { value: "v9.5", label: "Version 9.5" },
  { value: "v10.0", label: "Version 10.0" },
  { value: "v10.5", label: "Version 10.5 (Latest)" }
];

// ============================================
// AAA CONTROLLERS
// ============================================
export const AAA_CONTROLLERS = [
  { value: "freeradius", label: "FreeRADIUS" },
  { value: "cisco_ise", label: "Cisco ISE" },
  { value: "aruba_clearpass", label: "Aruba ClearPass" },
  { value: "microsoft_nps", label: "Microsoft NPS" },
  { value: "spectra_aaa", label: "Spectra AAA Server" }
];

// ============================================
// ACCESS POINT VENDORS
// ============================================
export const AP_VENDORS = [
  { value: "cisco", label: "Cisco" },
  { value: "aruba", label: "Aruba (HPE)" },
  { value: "ruckus", label: "Ruckus (CommScope)" },
  { value: "ubiquiti", label: "Ubiquiti" },
  { value: "cambium", label: "Cambium Networks" },
  { value: "tp_link", label: "TP-Link Omada" },
  { value: "meraki", label: "Cisco Meraki" },
  { value: "fortinet", label: "Fortinet" },
  { value: "huawei", label: "Huawei" },
  { value: "other", label: "Other" }
];

// ============================================
// ACCESS POINT MODELS (by vendor)
// ============================================
export const AP_MODELS = {
  cisco: [
    { value: "aironet_1850", label: "Aironet 1850 Series" },
    { value: "aironet_2800", label: "Aironet 2800 Series" },
    { value: "aironet_3800", label: "Aironet 3800 Series" },
    { value: "catalyst_9100", label: "Catalyst 9100 Series" },
    { value: "catalyst_9120", label: "Catalyst 9120 Series" },
    { value: "catalyst_9130", label: "Catalyst 9130 Series" }
  ],
  aruba: [
    { value: "ap_305", label: "AP-305" },
    { value: "ap_315", label: "AP-315" },
    { value: "ap_325", label: "AP-325" },
    { value: "ap_515", label: "AP-515" },
    { value: "ap_535", label: "AP-535" },
    { value: "ap_555", label: "AP-555" },
    { value: "ap_635", label: "AP-635" }
  ],
  ruckus: [
    { value: "r510", label: "R510" },
    { value: "r610", label: "R610" },
    { value: "r720", label: "R720" },
    { value: "r750", label: "R750" },
    { value: "r850", label: "R850" },
    { value: "t750", label: "T750 (Outdoor)" }
  ],
  ubiquiti: [
    { value: "uap_ac_lite", label: "UniFi AP AC Lite" },
    { value: "uap_ac_pro", label: "UniFi AP AC Pro" },
    { value: "uap_ac_hd", label: "UniFi AP AC HD" },
    { value: "u6_lite", label: "UniFi 6 Lite" },
    { value: "u6_pro", label: "UniFi 6 Pro" },
    { value: "u6_enterprise", label: "UniFi 6 Enterprise" }
  ],
  meraki: [
    { value: "mr33", label: "MR33" },
    { value: "mr36", label: "MR36" },
    { value: "mr46", label: "MR46" },
    { value: "mr56", label: "MR56" },
    { value: "mr57", label: "MR57" }
  ],
  cambium: [
    { value: "e410", label: "E410" },
    { value: "e425", label: "E425" },
    { value: "e430", label: "E430" },
    { value: "e505", label: "E505 (Outdoor)" },
    { value: "e600", label: "E600" }
  ],
  tp_link: [
    { value: "eap225", label: "EAP225" },
    { value: "eap245", label: "EAP245" },
    { value: "eap620", label: "EAP620 HD" },
    { value: "eap660", label: "EAP660 HD" },
    { value: "eap670", label: "EAP670" }
  ],
  fortinet: [
    { value: "fap_231f", label: "FortiAP 231F" },
    { value: "fap_234f", label: "FortiAP 234F" },
    { value: "fap_431f", label: "FortiAP 431F" },
    { value: "fap_433f", label: "FortiAP 433F" }
  ],
  huawei: [
    { value: "ap4050de", label: "AP4050DE" },
    { value: "ap4051d", label: "AP4051D" },
    { value: "ap6050dn", label: "AP6050DN" },
    { value: "ap7050de", label: "AP7050DE" }
  ],
  other: [
    { value: "custom", label: "Custom/Other" }
  ]
};

// ============================================
// POE SWITCH VENDORS
// ============================================
export const POE_SWITCH_VENDORS = [
  { value: "cisco", label: "Cisco" },
  { value: "aruba", label: "Aruba (HPE)" },
  { value: "juniper", label: "Juniper" },
  { value: "netgear", label: "Netgear" },
  { value: "ubiquiti", label: "Ubiquiti" },
  { value: "tp_link", label: "TP-Link" },
  { value: "dell", label: "Dell" },
  { value: "d_link", label: "D-Link" },
  { value: "other", label: "Other" }
];

// ============================================
// INFRASTRUCTURE EQUIPMENT TYPES
// ============================================
export const INFRASTRUCTURE_TYPES = [
  { value: "access_point", label: "Access Point (AP)", icon: "wifi" },
  { value: "poe_switch", label: "PoE Switch", icon: "network" },
  { value: "router", label: "Router", icon: "router" },
  { value: "firewall", label: "Firewall", icon: "shield" },
  { value: "controller", label: "Wireless Controller", icon: "server" },
  { value: "ups", label: "UPS", icon: "battery" }
];

// ============================================
// SSID CATEGORIES
// ============================================
export const SSID_CATEGORIES = [
  { value: "users", label: "Users" },
  { value: "guest", label: "Guest" },
  { value: "smart_device", label: "Smart/Digital Device" }
];

// ============================================
// DEFAULT DEVICE LIMITS PER SEGMENT
// ============================================
export const DEFAULT_DEVICE_LIMITS = {
  enterprise: 10,
  office: 10,
  hotel: 10,
  coLiving: 10,
  coWorking: 10,
  pg: 10,
  miscellaneous: 10
};

// ============================================
// SEGMENT-SPECIFIC REPORT LISTS
// ============================================
export const SEGMENT_REPORTS = {
  enterprise: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage Report", selected: true },
    { id: "speed-tier-report", label: "Speed Tier Report", selected: true },
    { id: "bandwidth-utilization", label: "Bandwidth Utilization", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true },
    { id: "sla-compliance", label: "SLA Compliance", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: false },
    { id: "failed-authentication", label: "Failed Authentication", selected: false },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  office: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "bandwidth-utilization", label: "Bandwidth Utilization", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: false }
  ],
  hotel: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "network-usage-report", label: "Network Usage Report", selected: true },
    { id: "bandwidth-utilization", label: "Bandwidth Utilization", selected: true },
    { id: "addon-usage-report", label: "Add-on Usage Report", selected: true },
    { id: "topup-history", label: "Top-up History", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true }
  ],
  coLiving: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "network-usage-report", label: "Network Usage Report", selected: true },
    { id: "addon-usage-report", label: "Add-on Usage Report", selected: true },
    { id: "topup-history", label: "Top-up History", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true }
  ],
  coWorking: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "network-usage-report", label: "Network Usage Report", selected: true },
    { id: "addon-usage-report", label: "Add-on Usage Report", selected: true },
    { id: "topup-history", label: "Top-up History", selected: true },
    { id: "bandwidth-utilization", label: "Bandwidth Utilization", selected: true }
  ],
  pg: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage Report", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true }
  ],
  miscellaneous: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "bandwidth-utilization", label: "Bandwidth Utilization", selected: true },
    { id: "internet-uptime", label: "Internet Uptime", selected: true }
  ]
};

// ============================================
// REPORTS FOR MANAGED WIFI INFRA
// Data usage reports included (data from Alepo AAA)
// Internet uptime/bandwidth reports excluded (internet not managed by Spectra)
// Top-up reports excluded (topups not available for Managed WiFi Infra)
// ============================================
export const MANAGED_WIFI_INFRA_REPORTS = {
  enterprise: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "failed-authentication", label: "Failed Authentication", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true },
    { id: "ap-health-status", label: "AP Health Status", selected: true },
    { id: "wireless-coverage", label: "Wireless Coverage Analysis", selected: false }
  ],
  office: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  hotel: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  coLiving: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  coWorking: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "policy-wise-monthly-average-active-users", label: "Policy-wise Active Users", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  pg: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ],
  miscellaneous: [
    { id: "site-monthly-active-users", label: "Monthly Active Users", selected: true },
    { id: "daily-average-active-users", label: "Daily Average Active Users", selected: true },
    { id: "monthly-data-usage-summary", label: "Monthly Data Usage Summary", selected: true },
    { id: "network-usage-report", label: "Network Usage (GB)", selected: true },
    { id: "authentication-logs", label: "Authentication Logs", selected: true },
    { id: "access-point-list", label: "Access Point List", selected: true },
    { id: "client-list", label: "Client List", selected: true }
  ]
};

// ============================================
// MASTER POLICY LIST (Sample - 50+ policies)
// ============================================
export const MASTER_POLICY_LIST = [
  // Enterprise Policies
  { policyId: "ENT_WIFI_10Mbps_50GB_1Devices", speed: "10 Mbps", data: "50 GB", devices: "1", segment: "enterprise" },
  { policyId: "ENT_WIFI_25Mbps_100GB_2Devices", speed: "25 Mbps", data: "100 GB", devices: "2", segment: "enterprise" },
  { policyId: "ENT_WIFI_50Mbps_150GB_3Devices", speed: "50 Mbps", data: "150 GB", devices: "3", segment: "enterprise" },
  { policyId: "ENT_WIFI_75Mbps_200GB_4Devices", speed: "75 Mbps", data: "200 GB", devices: "4", segment: "enterprise" },
  { policyId: "ENT_WIFI_100Mbps_Unlimited_5Devices", speed: "100 Mbps", data: "Unlimited", devices: "5", segment: "enterprise" },
  { policyId: "ENT_WIFI_150Mbps_Unlimited_5Devices", speed: "150 Mbps", data: "Unlimited", devices: "5", segment: "enterprise" },
  { policyId: "ENT_WIFI_200Mbps_Unlimited_5Devices", speed: "200 Mbps", data: "Unlimited", devices: "5", segment: "enterprise" },

  // Office Policies
  { policyId: "OFF_WIFI_10Mbps_50GB_1Devices", speed: "10 Mbps", data: "50 GB", devices: "1", segment: "office" },
  { policyId: "OFF_WIFI_25Mbps_100GB_2Devices", speed: "25 Mbps", data: "100 GB", devices: "2", segment: "office" },
  { policyId: "OFF_WIFI_50Mbps_150GB_3Devices", speed: "50 Mbps", data: "150 GB", devices: "3", segment: "office" },
  { policyId: "OFF_WIFI_75Mbps_200GB_4Devices", speed: "75 Mbps", data: "200 GB", devices: "4", segment: "office" },
  { policyId: "OFF_WIFI_100Mbps_Unlimited_5Devices", speed: "100 Mbps", data: "Unlimited", devices: "5", segment: "office" },

  // Hotel Policies (Daily)
  { policyId: "HTL_WIFI_10Mbps_2GB_1Devices", speed: "10 Mbps", data: "2 GB", devices: "1", segment: "hotel" },
  { policyId: "HTL_WIFI_20Mbps_5GB_2Devices", speed: "20 Mbps", data: "5 GB", devices: "2", segment: "hotel" },
  { policyId: "HTL_WIFI_30Mbps_10GB_2Devices", speed: "30 Mbps", data: "10 GB", devices: "2", segment: "hotel" },
  { policyId: "HTL_WIFI_50Mbps_Unlimited_3Devices", speed: "50 Mbps", data: "Unlimited", devices: "3", segment: "hotel" },
  { policyId: "HTL_WIFI_75Mbps_Unlimited_4Devices", speed: "75 Mbps", data: "Unlimited", devices: "4", segment: "hotel" },

  // Co-Living Policies
  { policyId: "COL_WIFI_10Mbps_50GB_1Devices", speed: "10 Mbps", data: "50 GB", devices: "1", segment: "coLiving" },
  { policyId: "COL_WIFI_20Mbps_100GB_2Devices", speed: "20 Mbps", data: "100 GB", devices: "2", segment: "coLiving" },
  { policyId: "COL_WIFI_30Mbps_150GB_3Devices", speed: "30 Mbps", data: "150 GB", devices: "3", segment: "coLiving" },
  { policyId: "COL_WIFI_50Mbps_200GB_4Devices", speed: "50 Mbps", data: "200 GB", devices: "4", segment: "coLiving" },
  { policyId: "COL_WIFI_75Mbps_Unlimited_5Devices", speed: "75 Mbps", data: "Unlimited", devices: "5", segment: "coLiving" },
  { policyId: "COL_WIFI_100Mbps_Unlimited_5Devices", speed: "100 Mbps", data: "Unlimited", devices: "5", segment: "coLiving" },

  // Co-Working Policies (Daily)
  { policyId: "COW_WIFI_15Mbps_5GB_1Devices", speed: "15 Mbps", data: "5 GB", devices: "1", segment: "coWorking" },
  { policyId: "COW_WIFI_25Mbps_10GB_2Devices", speed: "25 Mbps", data: "10 GB", devices: "2", segment: "coWorking" },
  { policyId: "COW_WIFI_50Mbps_20GB_3Devices", speed: "50 Mbps", data: "20 GB", devices: "3", segment: "coWorking" },
  { policyId: "COW_WIFI_75Mbps_Unlimited_4Devices", speed: "75 Mbps", data: "Unlimited", devices: "4", segment: "coWorking" },
  { policyId: "COW_WIFI_100Mbps_Unlimited_5Devices", speed: "100 Mbps", data: "Unlimited", devices: "5", segment: "coWorking" },

  // PG Policies
  { policyId: "PG_WIFI_10Mbps_30GB_1Devices", speed: "10 Mbps", data: "30 GB", devices: "1", segment: "pg" },
  { policyId: "PG_WIFI_15Mbps_50GB_2Devices", speed: "15 Mbps", data: "50 GB", devices: "2", segment: "pg" },
  { policyId: "PG_WIFI_25Mbps_100GB_2Devices", speed: "25 Mbps", data: "100 GB", devices: "2", segment: "pg" },
  { policyId: "PG_WIFI_50Mbps_150GB_3Devices", speed: "50 Mbps", data: "150 GB", devices: "3", segment: "pg" },
  { policyId: "PG_WIFI_75Mbps_Unlimited_4Devices", speed: "75 Mbps", data: "Unlimited", devices: "4", segment: "pg" },

  // Miscellaneous Policies
  { policyId: "MIS_WIFI_10Mbps_25GB_1Devices", speed: "10 Mbps", data: "25 GB", devices: "1", segment: "miscellaneous" },
  { policyId: "MIS_WIFI_25Mbps_50GB_2Devices", speed: "25 Mbps", data: "50 GB", devices: "2", segment: "miscellaneous" },
  { policyId: "MIS_WIFI_50Mbps_100GB_3Devices", speed: "50 Mbps", data: "100 GB", devices: "3", segment: "miscellaneous" },
  { policyId: "MIS_WIFI_75Mbps_Unlimited_4Devices", speed: "75 Mbps", data: "Unlimited", devices: "4", segment: "miscellaneous" },
  { policyId: "MIS_WIFI_100Mbps_Unlimited_5Devices", speed: "100 Mbps", data: "Unlimited", devices: "5", segment: "miscellaneous" }
];

// ============================================
// TOP-UP POLICIES
// ============================================
export const TOPUP_POLICIES = {
  speed: [
    { id: "TOPUP_SPEED_10Mbps", name: "Speed Boost +10 Mbps", value: "10 Mbps" },
    { id: "TOPUP_SPEED_25Mbps", name: "Speed Boost +25 Mbps", value: "25 Mbps" },
    { id: "TOPUP_SPEED_50Mbps", name: "Speed Boost +50 Mbps", value: "50 Mbps" },
    { id: "TOPUP_SPEED_100Mbps", name: "Speed Boost +100 Mbps", value: "100 Mbps" }
  ],
  data: [
    { id: "TOPUP_DATA_1GB", name: "Data Pack 1 GB", value: "1 GB" },
    { id: "TOPUP_DATA_5GB", name: "Data Pack 5 GB", value: "5 GB" },
    { id: "TOPUP_DATA_10GB", name: "Data Pack 10 GB", value: "10 GB" },
    { id: "TOPUP_DATA_25GB", name: "Data Pack 25 GB", value: "25 GB" },
    { id: "TOPUP_DATA_50GB", name: "Data Pack 50 GB", value: "50 GB" },
    { id: "TOPUP_DATA_100GB", name: "Data Pack 100 GB", value: "100 GB" }
  ],
  device: [
    { id: "TOPUP_DEVICE_1", name: "Extra Device +1", value: "1 Device" },
    { id: "TOPUP_DEVICE_2", name: "Extra Devices +2", value: "2 Devices" },
    { id: "TOPUP_DEVICE_3", name: "Extra Devices +3", value: "3 Devices" }
  ],
  policy: [
    { id: "TOPUP_PLAN_BASIC_PREMIUM", name: "Upgrade to Premium", value: "Premium Plan" },
    { id: "TOPUP_PLAN_STANDARD_ENTERPRISE", name: "Upgrade to Enterprise", value: "Enterprise Plan" },
    { id: "TOPUP_PLAN_UNLIMITED_DAY", name: "Unlimited Day Pass", value: "Unlimited (24hr)" },
    { id: "TOPUP_PLAN_UNLIMITED_WEEK", name: "Unlimited Week Pass", value: "Unlimited (7 days)" }
  ]
};

// ============================================
// GST RATE
// ============================================
export const GST_RATE = 0.18; // 18%

// ============================================
// AUTHENTICATION METHODS - MASTER LIST
// Each method can have requiresConfig: true and configFields for additional setup
// ============================================
export const AUTH_METHODS = {
  username_password: {
    id: 'username_password',
    label: 'Username-Password',
    description: 'Standard credentials login',
    requiresConfig: true,
    configFields: [
      { id: 'minPasswordLength', label: 'Minimum Password Length', type: 'number', default: 8, min: 6, max: 32 },
      { id: 'requireSpecialChars', label: 'Require Special Characters', type: 'checkbox', default: true },
      { id: 'passwordExpiry', label: 'Password Expiry (days)', type: 'number', default: 90, min: 0, max: 365, hint: '0 = never expires' },
      { id: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', default: 5, min: 3, max: 10 }
    ]
  },
  employee_id_password: {
    id: 'employee_id_password',
    label: 'Employee ID-Password',
    description: 'Employee ID with password authentication',
    requiresConfig: true,
    configFields: [
      { id: 'idPattern', label: 'Employee ID Pattern', type: 'text', default: '', placeholder: 'e.g., EMP-[0-9]{6}' },
      { id: 'minPasswordLength', label: 'Minimum Password Length', type: 'number', default: 8, min: 6, max: 32 },
      { id: 'syncWithHRMS', label: 'Sync with HRMS', type: 'checkbox', default: false }
    ]
  },
  member_id_password: {
    id: 'member_id_password',
    label: 'Member ID-Password',
    description: 'Member ID with password authentication',
    requiresConfig: true,
    configFields: [
      { id: 'idPattern', label: 'Member ID Pattern', type: 'text', default: '', placeholder: 'e.g., MEM-[0-9]{6}' },
      { id: 'minPasswordLength', label: 'Minimum Password Length', type: 'number', default: 8, min: 6, max: 32 }
    ]
  },
  lastname_roomnumber: {
    id: 'lastname_roomnumber',
    label: 'Last Name-Room Number',
    description: 'Hotel-specific authentication (last name + room number)',
    requiresConfig: true,
    configFields: [
      { id: 'pmsIntegration', label: 'PMS Integration', type: 'select', options: ['None', 'Opera', 'Protel', 'Fidelio', 'Custom API'], default: 'None' },
      { id: 'pmsApiUrl', label: 'PMS API URL', type: 'text', default: '', showIf: 'pmsIntegration:Custom API' },
      { id: 'caseSensitive', label: 'Case Sensitive Last Name', type: 'checkbox', default: false },
      { id: 'autoLogoutOnCheckout', label: 'Auto Logout on Checkout', type: 'checkbox', default: true }
    ]
  },
  otp_rmn: {
    id: 'otp_rmn',
    label: 'OTP on Registered Mobile',
    description: 'OTP sent to pre-registered mobile number',
    requiresConfig: true,
    configFields: [
      { id: 'otpLength', label: 'OTP Length', type: 'select', options: ['4', '6'], default: '6' },
      { id: 'otpExpiry', label: 'OTP Validity (seconds)', type: 'number', default: 300, min: 60, max: 600 },
      { id: 'maxAttempts', label: 'Max OTP Attempts', type: 'number', default: 3, min: 1, max: 5 },
      { id: 'smsGateway', label: 'SMS Gateway', type: 'select', options: ['Default', 'MSG91', 'Twilio', 'Custom'], default: 'Default' },
      { id: 'resendCooldown', label: 'Resend Cooldown (seconds)', type: 'number', default: 30, min: 15, max: 120 }
    ]
  },
  otp_mn: {
    id: 'otp_mn',
    label: 'OTP on Mobile Number',
    description: 'OTP sent to any provided mobile number',
    requiresConfig: true,
    configFields: [
      { id: 'otpLength', label: 'OTP Length', type: 'select', options: ['4', '6'], default: '6' },
      { id: 'otpExpiry', label: 'OTP Validity (seconds)', type: 'number', default: 300, min: 60, max: 600 },
      { id: 'maxAttempts', label: 'Max OTP Attempts', type: 'number', default: 3, min: 1, max: 5 },
      { id: 'smsGateway', label: 'SMS Gateway', type: 'select', options: ['Default', 'MSG91', 'Twilio', 'Custom'], default: 'Default' },
      { id: 'allowInternational', label: 'Allow International Numbers', type: 'checkbox', default: false },
      { id: 'sessionDuration', label: 'Session Duration (hours)', type: 'number', default: 24, min: 1, max: 720 }
    ]
  },
  adfs_sso: {
    id: 'adfs_sso',
    label: 'ADFS SSO',
    description: 'Active Directory Federation Services single sign-on',
    requiresConfig: true,
    configFields: [
      { id: 'adfsServerUrl', label: 'ADFS Server URL', type: 'text', required: true, placeholder: 'https://adfs.company.com' },
      { id: 'relyingPartyId', label: 'Relying Party Identifier', type: 'text', required: true },
      { id: 'certificateThumbprint', label: 'Certificate Thumbprint', type: 'text', required: true },
      { id: 'claimMapping', label: 'User Claim Attribute', type: 'text', default: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' },
      { id: 'allowedGroups', label: 'Allowed AD Groups (comma-separated)', type: 'text', default: '' }
    ]
  },
  digital_certificate: {
    id: 'digital_certificate',
    label: 'Digital Certificate',
    description: 'Certificate-based authentication (802.1X EAP-TLS)',
    requiresConfig: true,
    configFields: [
      { id: 'radiusServer', label: 'RADIUS Server IP', type: 'text', required: true, placeholder: '192.168.1.100' },
      { id: 'radiusPort', label: 'RADIUS Port', type: 'number', default: 1812, min: 1, max: 65535 },
      { id: 'radiusSecret', label: 'RADIUS Shared Secret', type: 'password', required: true },
      { id: 'caChain', label: 'CA Certificate Chain', type: 'file', accept: '.pem,.crt,.cer' },
      { id: 'crlCheck', label: 'Check Certificate Revocation', type: 'checkbox', default: true }
    ]
  },
  wpa2_psk: {
    id: 'wpa2_psk',
    label: 'WPA2-PSK',
    description: 'Pre-shared key (can be combined with other methods)',
    requiresConfig: true,
    configFields: [
      { id: 'pskRotation', label: 'PSK Rotation Period', type: 'select', options: ['Never', 'Weekly', 'Monthly', 'Quarterly'], default: 'Never' },
      { id: 'minPskLength', label: 'Minimum PSK Length', type: 'number', default: 8, min: 8, max: 63 },
      { id: 'notifyOnChange', label: 'Notify Users on PSK Change', type: 'checkbox', default: true }
    ]
  },
  mac_auth: {
    id: 'mac_auth',
    label: 'MAC Authorization',
    description: 'Device MAC address whitelist authentication',
    requiresConfig: true,
    configFields: [
      { id: 'autoApprove', label: 'Auto-approve New Devices', type: 'checkbox', default: false },
      { id: 'requireApproval', label: 'Require Admin Approval', type: 'checkbox', default: true },
      { id: 'maxDevicesPerUser', label: 'Max Devices per User', type: 'number', default: 3, min: 1, max: 10 },
      { id: 'macFormat', label: 'MAC Address Format', type: 'select', options: ['XX:XX:XX:XX:XX:XX', 'XX-XX-XX-XX-XX-XX', 'XXXXXXXXXXXX'], default: 'XX:XX:XX:XX:XX:XX' }
    ]
  },
  event_code: {
    id: 'event_code',
    label: 'Event Code',
    description: 'Shared code for events/conferences',
    requiresConfig: true,
    configFields: [
      { id: 'codeLength', label: 'Code Length', type: 'number', default: 6, min: 4, max: 12 },
      { id: 'codeType', label: 'Code Type', type: 'select', options: ['Alphanumeric', 'Numeric Only', 'Custom'], default: 'Alphanumeric' },
      { id: 'validityPeriod', label: 'Default Validity (hours)', type: 'number', default: 8, min: 1, max: 72 },
      { id: 'maxUsersPerCode', label: 'Max Users per Code', type: 'number', default: 100, min: 1, max: 1000 }
    ]
  },
  coupon_voucher: {
    id: 'coupon_voucher',
    label: 'Coupon/Voucher',
    description: 'Pre-generated access vouchers',
    requiresConfig: true,
    configFields: [
      { id: 'voucherFormat', label: 'Voucher Format', type: 'select', options: ['8-char Alphanumeric', '12-char Alphanumeric', '16-char Alphanumeric', 'Custom'], default: '8-char Alphanumeric' },
      { id: 'validityType', label: 'Validity Type', type: 'select', options: ['Fixed Duration', 'Fixed End Date', 'First Use + Duration'], default: 'Fixed Duration' },
      { id: 'defaultValidity', label: 'Default Validity (hours)', type: 'number', default: 24, min: 1, max: 720 },
      { id: 'singleUse', label: 'Single Use Only', type: 'checkbox', default: true },
      { id: 'printTemplate', label: 'Print Template', type: 'select', options: ['Standard', 'Compact', 'QR Code', 'Custom'], default: 'Standard' }
    ]
  },
  passkey_login: {
    id: 'passkey_login',
    label: 'Passkey through Login Page',
    description: 'Passkey entry via captive portal',
    requiresConfig: true,
    configFields: [
      { id: 'passkeyLength', label: 'Passkey Length', type: 'number', default: 8, min: 4, max: 16 },
      { id: 'rotationPeriod', label: 'Rotation Period', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Manual'], default: 'Weekly' },
      { id: 'displayOnPortal', label: 'Display on Captive Portal', type: 'checkbox', default: false },
      { id: 'requireAcceptTerms', label: 'Require Terms Acceptance', type: 'checkbox', default: true }
    ]
  },
  otp_auth_key: {
    id: 'otp_auth_key',
    label: 'OTP + Auth Key',
    description: 'Combination of OTP and authorization key',
    requiresConfig: true,
    configFields: [
      { id: 'otpLength', label: 'OTP Length', type: 'select', options: ['4', '6'], default: '6' },
      { id: 'authKeyLength', label: 'Auth Key Length', type: 'number', default: 8, min: 4, max: 16 },
      { id: 'otpExpiry', label: 'OTP Validity (seconds)', type: 'number', default: 300, min: 60, max: 600 },
      { id: 'keyRotation', label: 'Key Rotation', type: 'select', options: ['Never', 'Daily', 'Weekly'], default: 'Never' }
    ]
  },
  sponsored_employee: {
    id: 'sponsored_employee',
    label: 'Sponsored Access (Employee)',
    description: 'Employee sponsors a visitor for access',
    requiresConfig: true,
    configFields: [
      { id: 'maxGuestsPerSponsor', label: 'Max Guests per Sponsor', type: 'number', default: 5, min: 1, max: 20 },
      { id: 'maxGuestDuration', label: 'Max Guest Duration (hours)', type: 'number', default: 8, min: 1, max: 24 },
      { id: 'requireApproval', label: 'Require Manager Approval', type: 'checkbox', default: false },
      { id: 'notifySponsor', label: 'Notify Sponsor on Guest Activity', type: 'checkbox', default: true },
      { id: 'collectVisitorDetails', label: 'Collect Visitor Details', type: 'checkbox', default: true }
    ]
  },
  sponsored_authority: {
    id: 'sponsored_authority',
    label: 'Sponsored Access (Fixed Authority)',
    description: 'Designated approver sponsors visitors for access',
    requiresConfig: true,
    configFields: [
      { id: 'approverEmails', label: 'Approver Email(s)', type: 'text', required: true, placeholder: 'approver1@company.com, approver2@company.com' },
      { id: 'maxGuestsPerApprover', label: 'Max Guests per Approver', type: 'number', default: 20, min: 1, max: 100 },
      { id: 'approvalExpiry', label: 'Approval Request Expiry (hours)', type: 'number', default: 24, min: 1, max: 72 },
      { id: 'autoApproveKnownVisitors', label: 'Auto-approve Known Visitors', type: 'checkbox', default: false }
    ]
  },
  voucher_auto_account: {
    id: 'voucher_auto_account',
    label: 'Voucher-based Auto Account',
    description: 'Voucher automatically creates user account',
    requiresConfig: true,
    configFields: [
      { id: 'accountPrefix', label: 'Account Username Prefix', type: 'text', default: 'GUEST_', placeholder: 'e.g., GUEST_' },
      { id: 'voucherValidity', label: 'Voucher Validity (days)', type: 'number', default: 30, min: 1, max: 365 },
      { id: 'accountValidity', label: 'Account Validity (days)', type: 'number', default: 30, min: 1, max: 365 },
      { id: 'autoDeleteExpired', label: 'Auto-delete Expired Accounts', type: 'checkbox', default: true }
    ]
  }
};

/**
 * Get configuration fields for a specific auth method
 * @param {string} methodId - Auth method ID
 * @returns {Array|null} - Array of config fields or null if no config required
 */
export const getAuthMethodConfigFields = (methodId) => {
  const method = AUTH_METHODS[methodId];
  if (!method || !method.requiresConfig) return null;
  return method.configFields || [];
};

/**
 * Get default configuration values for a specific auth method
 * @param {string} methodId - Auth method ID
 * @returns {Object} - Default config values
 */
export const getAuthMethodDefaultConfig = (methodId) => {
  const fields = getAuthMethodConfigFields(methodId);
  if (!fields) return {};

  const defaults = {};
  fields.forEach(field => {
    defaults[field.id] = field.default !== undefined ? field.default : '';
  });
  return defaults;
};

// ============================================
// SEGMENT-WISE AUTHENTICATION CONFIGURATION
// Defines user categories and available auth methods per segment
// ============================================
export const SEGMENT_AUTH_CONFIG = {
  enterprise: {
    label: 'Enterprise',
    primaryCategory: 'users', // Primary user type that requires at least one auth method
    categories: {
      users: {
        id: 'users',
        label: 'Users (Employees)',
        description: 'Regular employees and staff members',
        isPrimary: true,
        availableMethods: ['username_password', 'employee_id_password', 'adfs_sso', 'digital_certificate', 'wpa2_psk', 'otp_rmn', 'mac_auth'],
        defaultMethods: ['username_password', 'wpa2_psk']
      },
      conferenceRooms: {
        id: 'conferenceRooms',
        label: 'Training/Conference Rooms',
        description: 'Meeting and training room WiFi access',
        isPrimary: false,
        availableMethods: ['event_code', 'otp_mn', 'passkey_login', 'coupon_voucher', 'wpa2_psk', 'otp_auth_key'],
        defaultMethods: ['event_code', 'wpa2_psk']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'External visitors and guests',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_mn', 'otp_rmn', 'wpa2_psk', 'otp_auth_key', 'sponsored_employee', 'sponsored_authority', 'coupon_voucher', 'event_code', 'passkey_login'],
        defaultMethods: ['otp_mn', 'sponsored_employee']
      }
    }
  },
  office: {
    label: 'Office',
    primaryCategory: 'users',
    categories: {
      users: {
        id: 'users',
        label: 'Users',
        description: 'Office staff and employees',
        isPrimary: true,
        availableMethods: ['username_password', 'otp_rmn', 'wpa2_psk'],
        defaultMethods: ['username_password']
      },
      conferenceRooms: {
        id: 'conferenceRooms',
        label: 'Training/Conference Rooms',
        description: 'Meeting and training room WiFi access',
        isPrimary: false,
        availableMethods: ['event_code', 'otp_mn', 'passkey_login', 'coupon_voucher', 'wpa2_psk', 'otp_auth_key'],
        defaultMethods: ['event_code', 'wpa2_psk']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'External visitors',
        isPrimary: false,
        availableMethods: ['otp_mn', 'wpa2_psk'],
        defaultMethods: ['otp_mn']
      }
    }
  },
  hotel: {
    label: 'Hotel',
    primaryCategory: 'roomGuests',
    categories: {
      roomGuests: {
        id: 'roomGuests',
        label: 'Room Guests',
        description: 'Staying guests with room bookings',
        isPrimary: true,
        availableMethods: ['lastname_roomnumber', 'username_password', 'coupon_voucher', 'wpa2_psk'],
        defaultMethods: ['lastname_roomnumber', 'wpa2_psk']
      },
      staff: {
        id: 'staff',
        label: 'Staff/Back-office',
        description: 'Hotel staff and back-office users',
        isPrimary: false,
        availableMethods: ['username_password', 'wpa2_psk', 'otp_rmn', 'adfs_sso', 'digital_certificate'],
        defaultMethods: ['username_password', 'wpa2_psk']
      },
      devices: {
        id: 'devices',
        label: 'Devices (TV/Media & IoT)',
        description: 'Smart TVs, media devices, and IoT devices',
        isPrimary: false,
        availableMethods: ['mac_auth', 'wpa2_psk'],
        defaultMethods: ['mac_auth', 'wpa2_psk']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'Non-staying visitors, restaurant, event, and conference users',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_mn', 'event_code', 'coupon_voucher', 'otp_auth_key', 'wpa2_psk'],
        defaultMethods: ['otp_mn', 'event_code']
      }
    }
  },
  coLiving: {
    label: 'Co-Living',
    primaryCategory: 'residents',
    categories: {
      residents: {
        id: 'residents',
        label: 'Residents',
        description: 'Co-living residents',
        isPrimary: true,
        availableMethods: ['username_password', 'member_id_password', 'voucher_auto_account', 'wpa2_psk'],
        defaultMethods: ['username_password', 'wpa2_psk']
      },
      staff: {
        id: 'staff',
        label: 'Staff',
        description: 'Property staff',
        isPrimary: false,
        availableMethods: ['username_password', 'wpa2_psk'],
        defaultMethods: ['username_password']
      },
      devices: {
        id: 'devices',
        label: 'Devices (TV/Media & Smart)',
        description: 'Smart TVs, media devices, and smart devices',
        isPrimary: false,
        availableMethods: ['mac_auth', 'wpa2_psk'],
        defaultMethods: ['mac_auth', 'wpa2_psk']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'Visitor guests',
        isPrimary: false,
        availableMethods: ['otp_mn', 'wpa2_psk'],
        defaultMethods: ['otp_mn']
      }
    }
  },
  pg: {
    label: 'PG (Paying Guest)',
    primaryCategory: 'residents',
    categories: {
      residents: {
        id: 'residents',
        label: 'Residents',
        description: 'PG residents',
        isPrimary: true,
        availableMethods: ['username_password', 'otp_rmn', 'wpa2_psk'],
        defaultMethods: ['username_password', 'otp_rmn']
      },
      staff: {
        id: 'staff',
        label: 'Staff',
        description: 'PG staff',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_rmn', 'wpa2_psk'],
        defaultMethods: ['username_password']
      },
      devices: {
        id: 'devices',
        label: 'Devices',
        description: 'Digital and smart devices',
        isPrimary: false,
        availableMethods: ['mac_auth', 'wpa2_psk'],
        defaultMethods: ['mac_auth']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors (Short-term)',
        description: 'Short-term visitors',
        isPrimary: false,
        availableMethods: ['otp_mn', 'otp_auth_key', 'wpa2_psk'],
        defaultMethods: ['otp_mn']
      }
    }
  },
  coWorking: {
    label: 'Co-Working',
    primaryCategory: 'members',
    categories: {
      members: {
        id: 'members',
        label: 'Members/Co-workers',
        description: 'Co-working members',
        isPrimary: true,
        availableMethods: ['username_password', 'otp_rmn', 'wpa2_psk'],
        defaultMethods: ['username_password', 'otp_rmn']
      },
      staff: {
        id: 'staff',
        label: 'Staff',
        description: 'Co-working space staff',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_rmn', 'wpa2_psk'],
        defaultMethods: ['username_password']
      },
      devices: {
        id: 'devices',
        label: 'Smart Devices',
        description: 'Smart devices and IoT',
        isPrimary: false,
        availableMethods: ['mac_auth', 'wpa2_psk'],
        defaultMethods: ['mac_auth']
      },
      conferenceRooms: {
        id: 'conferenceRooms',
        label: 'Conference Rooms',
        description: 'Meeting room WiFi access',
        isPrimary: false,
        availableMethods: ['event_code', 'otp_mn', 'otp_auth_key', 'coupon_voucher', 'wpa2_psk'],
        defaultMethods: ['event_code', 'wpa2_psk']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'External visitors',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_mn', 'wpa2_psk', 'sponsored_employee', 'sponsored_authority', 'coupon_voucher'],
        defaultMethods: ['otp_mn', 'sponsored_employee']
      }
    }
  },
  miscellaneous: {
    label: 'Miscellaneous',
    primaryCategory: 'users',
    categories: {
      users: {
        id: 'users',
        label: 'Users',
        description: 'General users (Education, Hostels, Hospital, Retail, Events, Others)',
        isPrimary: true,
        availableMethods: ['username_password', 'adfs_sso', 'wpa2_psk', 'otp_mn', 'otp_rmn', 'digital_certificate'],
        defaultMethods: ['username_password', 'wpa2_psk']
      },
      devices: {
        id: 'devices',
        label: 'Devices',
        description: 'Digital and smart devices',
        isPrimary: false,
        availableMethods: ['mac_auth', 'wpa2_psk'],
        defaultMethods: ['mac_auth']
      },
      guests: {
        id: 'guests',
        label: 'Guests/Visitors',
        description: 'External visitors and guests',
        isPrimary: false,
        availableMethods: ['username_password', 'otp_mn', 'wpa2_psk', 'sponsored_employee', 'sponsored_authority', 'coupon_voucher', 'otp_auth_key', 'event_code'],
        defaultMethods: ['otp_mn', 'wpa2_psk']
      }
    }
  }
};

/**
 * Get authentication categories for a segment
 * @param {string} segment - Segment type
 * @returns {Object} - Categories with their auth method configurations
 */
export const getAuthCategoriesForSegment = (segment) => {
  return SEGMENT_AUTH_CONFIG[segment]?.categories || SEGMENT_AUTH_CONFIG.miscellaneous.categories;
};

/**
 * Get default authentication configuration for a segment
 * Returns an object with category IDs as keys and arrays of default method IDs as values
 * @param {string} segment - Segment type
 * @returns {Object} - Default auth config { categoryId: [methodId, ...] }
 */
export const getDefaultAuthConfig = (segment) => {
  const categories = getAuthCategoriesForSegment(segment);
  const config = {};

  Object.keys(categories).forEach(categoryId => {
    config[categoryId] = [...categories[categoryId].defaultMethods];
  });

  return config;
};

/**
 * Validate authentication configuration for a segment
 * Only requires at least one method for the primary user category
 * Also validates that only one method can be marked as default per category
 * @param {Object} authConfig - Authentication configuration object
 * @param {string} segment - Segment type
 * @param {Object} options - Validation options
 * @param {boolean} options.requirePrimaryOnly - Only require methods for primary category (default: true)
 * @returns {{ isValid: boolean, errors: Array, warnings: Array }} - Validation result
 */
export const validateAuthConfig = (authConfig, segment, options = {}) => {
  const { requirePrimaryOnly = true } = options;
  const segmentConfig = SEGMENT_AUTH_CONFIG[segment] || SEGMENT_AUTH_CONFIG.miscellaneous;
  const categories = segmentConfig.categories;
  const errors = [];
  const warnings = [];

  Object.keys(categories).forEach(categoryId => {
    const category = categories[categoryId];
    const categoryConfig = authConfig[categoryId];

    // Handle both array format and object format with methods/defaultMethod
    const selectedMethods = Array.isArray(categoryConfig)
      ? categoryConfig
      : (categoryConfig?.methods || []);
    const defaultMethod = !Array.isArray(categoryConfig) ? categoryConfig?.defaultMethod : null;

    // Check if at least one method is selected for primary category
    if (category.isPrimary || !requirePrimaryOnly) {
      if (selectedMethods.length === 0) {
        if (category.isPrimary) {
          errors.push({
            categoryId,
            categoryLabel: category.label,
            type: 'required',
            message: `At least one authentication method is required for ${category.label} (primary user type)`
          });
        } else {
          // Non-primary categories: just a warning, not an error
          warnings.push({
            categoryId,
            categoryLabel: category.label,
            type: 'recommended',
            message: `Consider configuring authentication methods for ${category.label}`
          });
        }
      }
    }

    // Validate default method - only one can be default
    if (defaultMethod) {
      // Check default method is in selectedMethods
      if (!selectedMethods.includes(defaultMethod)) {
        errors.push({
          categoryId,
          categoryLabel: category.label,
          type: 'invalid_default',
          message: `Default method "${getAuthMethodLabel(defaultMethod)}" must be one of the selected methods for ${category.label}`
        });
      }
    }

    // Check if more than one method is marked as default (for object format with defaultMethods array)
    if (!Array.isArray(categoryConfig) && Array.isArray(categoryConfig?.defaultMethods) && categoryConfig.defaultMethods.length > 1) {
      errors.push({
        categoryId,
        categoryLabel: category.label,
        type: 'multiple_defaults',
        message: `Only one authentication method can be set as default for ${category.label}`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Get the primary category for a segment
 * @param {string} segment - Segment type
 * @returns {string} - Primary category ID
 */
export const getPrimaryCategoryForSegment = (segment) => {
  return SEGMENT_AUTH_CONFIG[segment]?.primaryCategory || SEGMENT_AUTH_CONFIG.miscellaneous.primaryCategory;
};

/**
 * Get authentication method label by ID
 * @param {string} methodId - Method ID
 * @returns {string} - Method label or ID if not found
 */
export const getAuthMethodLabel = (methodId) => {
  return AUTH_METHODS[methodId]?.label || methodId;
};

/**
 * Get authentication method description by ID
 * @param {string} methodId - Method ID
 * @returns {string} - Method description or empty string if not found
 */
export const getAuthMethodDescription = (methodId) => {
  return AUTH_METHODS[methodId]?.description || '';
};

/**
 * Format authentication configuration for display
 * Converts method IDs to readable labels
 * @param {Object} authConfig - Authentication configuration { categoryId: [methodId, ...] }
 * @param {string} segment - Segment type
 * @returns {Array} - Formatted array of { category, categoryLabel, methods: [{ id, label, description }] }
 */
export const formatAuthConfigForDisplay = (authConfig, segment) => {
  const categories = getAuthCategoriesForSegment(segment);
  const result = [];

  Object.keys(categories).forEach(categoryId => {
    const category = categories[categoryId];
    const selectedMethods = authConfig?.[categoryId] || [];

    result.push({
      categoryId,
      categoryLabel: category.label,
      categoryDescription: category.description,
      methods: selectedMethods.map(methodId => ({
        id: methodId,
        label: getAuthMethodLabel(methodId),
        description: getAuthMethodDescription(methodId)
      })),
      defaultMethods: category.defaultMethods
    });
  });

  return result;
};

/**
 * Format authentication configuration for export (CSV/PDF)
 * Returns both method IDs and human-readable labels
 * @param {Object} authConfig - Authentication configuration { categoryId: [methodId, ...] }
 * @param {string} segment - Segment type
 * @param {string} format - 'ids', 'labels', or 'both'
 * @returns {Object} - Formatted object for export { categoryLabel: string }
 */
export const formatAuthConfigForExport = (authConfig, segment, format = 'both') => {
  const categories = getAuthCategoriesForSegment(segment);
  const result = {};

  Object.keys(categories).forEach(categoryId => {
    const category = categories[categoryId];
    const selectedMethods = authConfig?.[categoryId] || [];

    if (format === 'ids') {
      result[category.label] = selectedMethods.join(', ');
    } else if (format === 'labels') {
      result[category.label] = selectedMethods.map(id => getAuthMethodLabel(id)).join(', ');
    } else {
      // 'both' format: "Label (id), Label (id)"
      result[category.label] = selectedMethods
        .map(id => `${getAuthMethodLabel(id)} (${id})`)
        .join(', ');
    }
  });

  return result;
};

/**
 * Get summary of authentication configuration
 * Useful for compact display in tables/cards
 * @param {Object} authConfig - Authentication configuration
 * @param {string} segment - Segment type
 * @returns {{ totalMethods: number, categoriesConfigured: number, summary: string }}
 */
export const getAuthConfigSummary = (authConfig, segment) => {
  const categories = getAuthCategoriesForSegment(segment);
  let totalMethods = 0;
  let categoriesConfigured = 0;
  const summaryParts = [];

  Object.keys(categories).forEach(categoryId => {
    const selectedMethods = authConfig?.[categoryId] || [];
    if (selectedMethods.length > 0) {
      categoriesConfigured++;
      totalMethods += selectedMethods.length;
      summaryParts.push(`${categories[categoryId].label}: ${selectedMethods.length}`);
    }
  });

  return {
    totalMethods,
    categoriesConfigured,
    totalCategories: Object.keys(categories).length,
    summary: summaryParts.join(' | ') || 'Not configured'
  };
};

// ============================================
// VALIDATION RULES
// ============================================
export const VALIDATION_RULES = {
  siteName: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-\_\.\,]+$/,
    message: "Site name must be 3-100 characters, alphanumeric with spaces, hyphens, underscores"
  },
  companyName: {
    minLength: 2,
    maxLength: 150,
    pattern: /^[a-zA-Z0-9\s\-\_\.\,\&\(\)]+$/,
    message: "Company name must be 2-150 characters"
  },
  accountPrefix: {
    minLength: 4,
    maxLength: 6,
    pattern: /^[A-Z0-9]+$/,
    message: "Account prefix must be 4-6 uppercase alphanumeric characters"
  },
  contactName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\.\-]+$/,
    message: "Name must be 2-100 characters, letters only"
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address"
  },
  phone: {
    pattern: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
    message: "Please enter a valid Indian mobile number"
  },
  ipAddress: {
    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "Please enter a valid IP address (e.g., 192.168.1.1)"
  },
  ssidName: {
    minLength: 1,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9\s\-\_]+$/,
    message: "SSID name must be 1-32 characters, alphanumeric with spaces, hyphens, underscores"
  },
  ssidPassword: {
    minLength: 8,
    maxLength: 63,
    pattern: /^[\x20-\x7E]+$/, // Printable ASCII characters
    message: "SSID password must be 8-63 printable characters"
  },
  city: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-\.]+$/,
    message: "City must be 2-50 characters"
  },
  bandwidth: {
    min: 1,
    max: 10000,
    message: "Bandwidth must be between 1 and 10000 Mbps"
  },
  licenseCount: {
    min: 1,
    max: 100000,
    message: "License count must be between 1 and 100,000"
  },
  deviceLimit: {
    min: 1,
    max: 100,
    message: "Device limit must be between 1 and 100"
  },
  controllerId: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\-\_]+$/,
    message: "Controller ID must be alphanumeric with hyphens/underscores"
  },
  serviceId: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\-\_]+$/,
    message: "Service ID must be alphanumeric with hyphens/underscores"
  },
  apCount: {
    min: 0,
    max: 1000,
    message: "AP count must be between 0 and 1000"
  },
  switchCount: {
    min: 0,
    max: 500,
    message: "Switch count must be between 0 and 500"
  },
  portCount: {
    min: 0,
    max: 10000,
    message: "Port count must be between 0 and 10,000"
  }
};

// ============================================
// INITIAL FORM STATE
// ============================================
export const INITIAL_FORM_STATE = {
  // Step 1 - Basic Site Information
  domainId: '',
  siteId: '',
  companyId: '',
  companyName: '',
  siteName: '',
  solutionType: 'managed_wifi', // Default to Managed WiFi
  productName: '',
  contractName: '',
  siteType: '',
  city: '',
  state: '',
  address: '',
  region: '',
  accountPrefix: '',

  // Step 2 - Contact & Notifications
  primaryContactName: '',
  primaryContactEmail: '',
  primaryContactPhone: '',
  emailAlertEnabled: true,
  emailCc: [],
  smsCc: [],

  // Step 3 - Bandwidth & License Configuration
  bandwidthType: 'fixed',
  fixedBandwidth: '',
  selectedPolicies: [],
  overallLicenseCount: 0,
  registeredDeviceLimit: 10,
  displayDeviceCount: true,

  // Step 4 - Network Infrastructure
  wirelessControllerId: '',
  wirelessControllerVersion: '',
  aaaController: '',
  accessControllerId: '',
  serviceId: '',
  nasIpPrimary: '',
  nasIpSecondary: '',
  nasIpTertiary: '',
  nasIpQuaternary: '',
  trafficFlowType: '',
  trafficFlowIp: '',

  // Infrastructure Equipment
  infrastructure: {
    // Access Points
    apVendor: '',
    apModel: '',
    deployedApCount: 0,     // Total APs deployed at site
    liveApCount: 0,         // Currently online APs (updated in real-time from monitoring)
    indoorApCount: 0,       // Indoor APs
    outdoorApCount: 0,      // Outdoor APs

    // PoE Switches
    poeSwitchVendor: '',
    poeSwitchCount: 0,      // Total PoE switches
    livePoeSwitchCount: 0,  // Currently online PoE switches
    totalPoePorts: 0,       // Total PoE ports available
    usedPoePorts: 0,        // PoE ports in use

    // Other Infrastructure
    nasCount: 0,        // Network Attached Storage devices
    firewallCount: 0,
    upsCount: 0,

    // Notes
    infrastructureNotes: ''
  },

  // Step 5 - Firewall & API Integration
  firewallConfig: {
    enabled: false,
    organizationId: '',
    applianceId: ''
  },
  apiIntegration: {
    enabled: false,
    sitePropertyId: '',
    companyPropertyId: ''
  },

  // Step 6 - SSID & Features Configuration
  ssidConfigs: [
    { id: 1, category: '', ssidName: '', ssidPassword: '' }
  ],
  interSiteRoaming: false,
  bulkUserRegistration: false,
  bulkDeviceRegistration: false,
  guestAccessEnabled: false,  // Enable/disable guest WiFi access management for this site
  reportingEnabled: true,
  selectedReports: [],

  // Step 7 - Top-ups (only for userLevel)
  // Each topup type can have multiple packs selected with individual prices
  topups: {
    speed: { enabled: false, packs: [] },   // packs: [{ policyId, sellingPrice, priceWithTax }]
    data: { enabled: false, packs: [] },
    device: { enabled: false, packs: [] },
    policy: { enabled: false, packs: [] }
  },

  // Step 8 - Authentication Configuration
  // Structure: { categoryId: [methodId, methodId, ...] }
  // Example: { users: ['username_password', 'wpa2_psk'], guests: ['otp_mn'] }
  authenticationConfig: {}
};

// ============================================
// STEP CONFIGURATION
// ============================================
export const PROVISIONING_STEPS = [
  { id: 1, title: "Site Details", description: "Basic site information" },
  { id: 2, title: "Contact & Notifications", description: "Contact details and alerts" },
  { id: 3, title: "Bandwidth & Licenses", description: "Bandwidth type and license configuration" },
  { id: 4, title: "Network Infrastructure", description: "Controllers and NAS configuration" },
  { id: 5, title: "Firewall & API", description: "Optional integrations" },
  { id: 6, title: "SSID & Features", description: "WiFi networks and feature toggles" },
  { id: 7, title: "Top-ups", description: "Self-care portal top-ups" },
  { id: 8, title: "Authentication", description: "User authentication methods" }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate Site ID from company and site name
 */
export const generateSiteId = (companyName, siteName, siteType) => {
  const prefix = siteType ? siteType.substring(0, 3).toUpperCase() : 'SIT';
  const companyPart = companyName ? companyName.substring(0, 3).toUpperCase() : 'XXX';
  const timestamp = Date.now().toString().slice(-6);
  return `SITE-${companyPart}-${prefix}-${timestamp}`;
};

/**
 * Generate Account Prefix from company/site name
 */
export const generateAccountPrefix = (companyName, siteName) => {
  const base = (companyName || siteName || 'SITE').replace(/[^a-zA-Z0-9]/g, '');
  return base.substring(0, 4).toUpperCase();
};

/**
 * Calculate price with GST
 */
export const calculatePriceWithGST = (basePrice) => {
  return Math.round(basePrice * (1 + GST_RATE) * 100) / 100;
};

/**
 * Get policies for a specific segment
 */
export const getPoliciesForSegment = (segment) => {
  return MASTER_POLICY_LIST.filter(policy => policy.segment === segment);
};

/**
 * Get default reports for a segment
 */
export const getDefaultReportsForSegment = (segment) => {
  return SEGMENT_REPORTS[segment] || SEGMENT_REPORTS.miscellaneous;
};

/**
 * Get reports for a segment based on solution type
 * @param {string} segment - Site segment (enterprise, hotel, etc.)
 * @param {string} solutionType - Solution type (managed_wifi, managed_wifi_infra)
 * @returns {Array} - Array of reports appropriate for the segment and solution type
 */
export const getReportsForSolutionType = (segment, solutionType) => {
  if (solutionType === 'managed_wifi_infra') {
    return MANAGED_WIFI_INFRA_REPORTS[segment] || MANAGED_WIFI_INFRA_REPORTS.miscellaneous;
  }
  return SEGMENT_REPORTS[segment] || SEGMENT_REPORTS.miscellaneous;
};

/**
 * Get solution type configuration
 * @param {string} solutionType - Solution type value
 * @returns {Object|null} - Solution type config or null
 */
export const getSolutionTypeConfig = (solutionType) => {
  return SOLUTION_TYPES.find(st => st.value === solutionType) || null;
};

/**
 * Check if internet is managed for a solution type
 * @param {string} solutionType - Solution type value
 * @returns {boolean} - Whether internet is managed
 */
export const isInternetManaged = (solutionType) => {
  const config = getSolutionTypeConfig(solutionType);
  return config ? config.internetManaged : true;
};

/**
 * Check if topups are enabled for a solution type
 * @param {string} solutionType - Solution type value
 * @returns {boolean} - Whether topups are enabled
 */
export const areTopupsEnabled = (solutionType) => {
  const config = getSolutionTypeConfig(solutionType);
  return config ? config.topupsEnabled : true;
};

/**
 * Validate IP address
 */
export const isValidIP = (ip) => {
  if (!ip) return true; // Empty is valid for optional fields
  return VALIDATION_RULES.ipAddress.pattern.test(ip);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION_RULES.email.pattern.test(email);
};

/**
 * Validate phone
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION_RULES.phone.pattern.test(phone);
};

/**
 * Validate SSID name
 */
export const isValidSSIDName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= VALIDATION_RULES.ssidName.minLength &&
         trimmed.length <= VALIDATION_RULES.ssidName.maxLength &&
         VALIDATION_RULES.ssidName.pattern.test(trimmed);
};

/**
 * Validate SSID password
 */
export const isValidSSIDPassword = (password) => {
  if (!password) return false;
  return password.length >= VALIDATION_RULES.ssidPassword.minLength &&
         password.length <= VALIDATION_RULES.ssidPassword.maxLength &&
         VALIDATION_RULES.ssidPassword.pattern.test(password);
};

/**
 * Validate city name
 */
export const isValidCity = (city) => {
  if (!city) return false;
  const trimmed = city.trim();
  return trimmed.length >= VALIDATION_RULES.city.minLength &&
         trimmed.length <= VALIDATION_RULES.city.maxLength &&
         VALIDATION_RULES.city.pattern.test(trimmed);
};

/**
 * Validate bandwidth value
 */
export const isValidBandwidth = (bandwidth) => {
  const num = parseInt(bandwidth, 10);
  return !isNaN(num) &&
         num >= VALIDATION_RULES.bandwidth.min &&
         num <= VALIDATION_RULES.bandwidth.max;
};

/**
 * Validate license count
 */
export const isValidLicenseCount = (count) => {
  const num = parseInt(count, 10);
  return !isNaN(num) &&
         num >= VALIDATION_RULES.licenseCount.min &&
         num <= VALIDATION_RULES.licenseCount.max;
};

/**
 * Validate device limit
 */
export const isValidDeviceLimit = (limit) => {
  const num = parseInt(limit, 10);
  return !isNaN(num) &&
         num >= VALIDATION_RULES.deviceLimit.min &&
         num <= VALIDATION_RULES.deviceLimit.max;
};

/**
 * Validate AP count
 */
export const isValidApCount = (count) => {
  const num = parseInt(count, 10);
  if (isNaN(num)) return true; // Empty/undefined is valid
  return num >= VALIDATION_RULES.apCount.min &&
         num <= VALIDATION_RULES.apCount.max;
};

/**
 * Validate switch count
 */
export const isValidSwitchCount = (count) => {
  const num = parseInt(count, 10);
  if (isNaN(num)) return true;
  return num >= VALIDATION_RULES.switchCount.min &&
         num <= VALIDATION_RULES.switchCount.max;
};

/**
 * Validate port count
 */
export const isValidPortCount = (count) => {
  const num = parseInt(count, 10);
  if (isNaN(num)) return true;
  return num >= VALIDATION_RULES.portCount.min &&
         num <= VALIDATION_RULES.portCount.max;
};

/**
 * Validate contact name
 */
export const isValidContactName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= VALIDATION_RULES.contactName.minLength &&
         trimmed.length <= VALIDATION_RULES.contactName.maxLength &&
         VALIDATION_RULES.contactName.pattern.test(trimmed);
};

/**
 * Validate multiple emails (comma-separated)
 */
export const isValidEmailList = (emailList) => {
  if (!emailList || emailList.length === 0) return true; // Empty is valid
  return emailList.every(email => {
    const trimmed = email.trim();
    return trimmed === '' || isValidEmail(trimmed);
  });
};

/**
 * Validate multiple phones (comma-separated)
 */
export const isValidPhoneList = (phoneList) => {
  if (!phoneList || phoneList.length === 0) return true;
  return phoneList.every(phone => {
    const trimmed = phone.trim();
    return trimmed === '' || isValidPhone(trimmed);
  });
};

/**
 * Comprehensive field validator
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @returns {{ isValid: boolean, message: string }} - Validation result
 */
export const validateField = (fieldName, value) => {
  const result = { isValid: true, message: '' };

  switch (fieldName) {
    case 'siteName':
      if (!value?.trim()) {
        result.isValid = false;
        result.message = 'Site name is required';
      } else if (value.length < VALIDATION_RULES.siteName.minLength) {
        result.isValid = false;
        result.message = `Site name must be at least ${VALIDATION_RULES.siteName.minLength} characters`;
      } else if (value.length > VALIDATION_RULES.siteName.maxLength) {
        result.isValid = false;
        result.message = `Site name cannot exceed ${VALIDATION_RULES.siteName.maxLength} characters`;
      } else if (!VALIDATION_RULES.siteName.pattern.test(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.siteName.message;
      }
      break;

    case 'primaryContactEmail':
    case 'email':
      if (!value?.trim()) {
        result.isValid = false;
        result.message = 'Email is required';
      } else if (!isValidEmail(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.email.message;
      }
      break;

    case 'primaryContactPhone':
    case 'phone':
      if (!value?.trim()) {
        result.isValid = false;
        result.message = 'Phone number is required';
      } else if (!isValidPhone(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.phone.message;
      }
      break;

    case 'primaryContactName':
      if (!value?.trim()) {
        result.isValid = false;
        result.message = 'Contact name is required';
      } else if (!isValidContactName(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.contactName.message;
      }
      break;

    case 'city':
      if (!value?.trim()) {
        result.isValid = false;
        result.message = 'City is required';
      } else if (!isValidCity(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.city.message;
      }
      break;

    case 'fixedBandwidth':
      if (value && !isValidBandwidth(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.bandwidth.message;
      }
      break;

    case 'overallLicenseCount':
      if (!isValidLicenseCount(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.licenseCount.message;
      }
      break;

    case 'registeredDeviceLimit':
      if (!isValidDeviceLimit(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.deviceLimit.message;
      }
      break;

    case 'nasIpPrimary':
    case 'nasIpSecondary':
    case 'nasIpTertiary':
    case 'nasIpQuaternary':
    case 'trafficFlowIp':
      if (value && !isValidIP(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.ipAddress.message;
      }
      break;

    case 'deployedApCount':
    case 'liveApCount':
    case 'indoorApCount':
    case 'outdoorApCount':
      if (value && !isValidApCount(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.apCount.message;
      }
      break;

    case 'poeSwitchCount':
    case 'livePoeSwitchCount':
      if (value && !isValidSwitchCount(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.switchCount.message;
      }
      break;

    case 'totalPoePorts':
    case 'usedPoePorts':
      if (value && !isValidPortCount(value)) {
        result.isValid = false;
        result.message = VALIDATION_RULES.portCount.message;
      }
      break;

    default:
      break;
  }

  return result;
};

/**
 * Get draft storage key
 */
export const getDraftStorageKey = (userId) => {
  return `siteProvisioning_draft_${userId || 'anonymous'}`;
};

// ============================================
// SITE STATUS WORKFLOW
// ============================================

/**
 * Site Status Values
 * Defines the lifecycle of a site from order to activation
 */
export const SITE_STATUS = {
  CONFIGURATION_PENDING: 'configuration_pending',
  UNDER_CONFIGURATION: 'under_configuration',
  UNDER_TESTING: 'under_testing',
  RFS_PENDING: 'rfs_pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended', // Temporary - WiFi access stopped
  BLOCKED: 'blocked' // Permanent - Site terminated
};

export const SITE_STATUS_LABELS = {
  [SITE_STATUS.CONFIGURATION_PENDING]: 'Configuration Pending',
  [SITE_STATUS.UNDER_CONFIGURATION]: 'Under Configuration',
  [SITE_STATUS.UNDER_TESTING]: 'Under Testing',
  [SITE_STATUS.RFS_PENDING]: 'RFS Pending',
  [SITE_STATUS.ACTIVE]: 'Active',
  [SITE_STATUS.SUSPENDED]: 'Suspended',
  [SITE_STATUS.BLOCKED]: 'Blocked'
};

export const SITE_STATUS_COLORS = {
  [SITE_STATUS.CONFIGURATION_PENDING]: '#f59e0b', // Amber
  [SITE_STATUS.UNDER_CONFIGURATION]: '#3b82f6', // Blue
  [SITE_STATUS.UNDER_TESTING]: '#8b5cf6', // Purple
  [SITE_STATUS.RFS_PENDING]: '#06b6d4', // Cyan
  [SITE_STATUS.ACTIVE]: '#10b981', // Green
  [SITE_STATUS.SUSPENDED]: '#ef4444', // Red
  [SITE_STATUS.BLOCKED]: '#6b7280' // Gray
};

/**
 * Status Workflow Transitions
 * Defines which status can transition to which other status
 */
export const SITE_STATUS_TRANSITIONS = {
  [SITE_STATUS.CONFIGURATION_PENDING]: [SITE_STATUS.UNDER_CONFIGURATION],
  [SITE_STATUS.UNDER_CONFIGURATION]: [SITE_STATUS.UNDER_TESTING, SITE_STATUS.CONFIGURATION_PENDING],
  [SITE_STATUS.UNDER_TESTING]: [SITE_STATUS.RFS_PENDING, SITE_STATUS.UNDER_CONFIGURATION],
  [SITE_STATUS.RFS_PENDING]: [SITE_STATUS.ACTIVE, SITE_STATUS.UNDER_TESTING],
  [SITE_STATUS.ACTIVE]: [SITE_STATUS.SUSPENDED, SITE_STATUS.BLOCKED],
  [SITE_STATUS.SUSPENDED]: [SITE_STATUS.ACTIVE, SITE_STATUS.BLOCKED],
  [SITE_STATUS.BLOCKED]: [] // Terminal state - no transitions allowed
};

/**
 * User roles allowed to perform status transitions
 * Role names match InternalRoles from accessLevels.js (snake_case format)
 */
export const STATUS_TRANSITION_ROLES = {
  [SITE_STATUS.CONFIGURATION_PENDING]: ['deployment_engineer', 'operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.UNDER_CONFIGURATION]: ['deployment_engineer', 'operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.UNDER_TESTING]: ['deployment_engineer', 'operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.RFS_PENDING]: ['deployment_engineer', 'operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.ACTIVE]: ['deployment_engineer', 'operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.SUSPENDED]: ['operations_manager', 'super_admin', 'demo_account'],
  [SITE_STATUS.BLOCKED]: ['super_admin', 'demo_account']
};

// ============================================
// TESTING CHECKLIST ITEMS
// ============================================
export const SITE_TESTING_CHECKLIST = [
  {
    id: 'wifi_connectivity',
    label: 'WiFi Connectivity Test',
    description: 'Verify users can connect to WiFi network',
    required: true
  },
  {
    id: 'internet_access',
    label: 'Internet Access Test',
    description: 'Verify internet connectivity after authentication',
    required: true
  },
  {
    id: 'authentication_test',
    label: 'User Authentication Test',
    description: 'Verify users can authenticate with credentials',
    required: true
  },
  {
    id: 'bandwidth_test',
    label: 'Bandwidth Speed Test',
    description: 'Verify bandwidth matches configured policy',
    required: true
  },
  {
    id: 'device_limit_test',
    label: 'Device Limit Test',
    description: 'Verify device limit enforcement',
    required: false
  },
  {
    id: 'portal_access_test',
    label: 'Self-Care Portal Access',
    description: 'Verify user can access self-care portal',
    required: true
  },
  {
    id: 'ap_coverage_test',
    label: 'AP Coverage Verification',
    description: 'Verify access point coverage across premises',
    required: true
  },
  {
    id: 'guest_network_test',
    label: 'Guest Network Test',
    description: 'Verify guest WiFi network functionality (if configured)',
    required: false
  },
  {
    id: 'billing_integration_test',
    label: 'Billing Integration Test',
    description: 'Verify usage data flows to billing system',
    required: true
  },
  {
    id: 'security_test',
    label: 'Security Configuration Test',
    description: 'Verify firewall and security policies',
    required: true
  }
];

// ============================================
// AUTO-EMAIL TEMPLATES (Placeholder for IT Team)
// ============================================

/**
 * IT TEAM INTEGRATION POINT: Welcome Email Template
 *
 * This function should be implemented by IT team to send actual emails.
 * Currently returns template data for reference.
 *
 * Integration Steps:
 * 1. Connect to email service (SendGrid/SES/SMTP)
 * 2. Use HTML template from marketing/design team
 * 3. Replace placeholders with actual data
 * 4. Send email to customer
 * 5. Log email delivery status
 *
 * @param {Object} siteData - Site configuration data
 * @param {Object} customerData - Customer details
 * @returns {Object} - Email template data (placeholder)
 */
export const getWelcomeEmailTemplate = (siteData, customerData) => {
  // TODO: IT Team - Implement actual email sending
  // This is a placeholder that returns template structure

  return {
    to: customerData.primaryEmail,
    cc: customerData.secondaryEmail || null,
    subject: `Welcome to Spectra WiFi - ${siteData.siteName} is Now Active`,
    templateId: 'WELCOME_EMAIL_TEMPLATE_001', // Use email service template ID
    dynamicData: {
      customerName: customerData.companyName,
      siteName: siteData.siteName,
      siteId: siteData.siteId,
      productName: siteData.productName,
      activationDate: siteData.activationDate,
      activationTime: siteData.activationTime,
      portalUrl: 'https://selfcare.spectra.co', // TODO: Configure actual URL
      supportEmail: 'wifi-support@spectra.co',
      supportPhone: '1800-XXX-XXXX',
      // WiFi Network Details
      ssidList: siteData.ssidConfiguration || [],
      // Portal Login Details
      adminPortalUrl: 'https://portal.spectra.co',
      adminUsername: customerData.primaryEmail,
      // Note: Password should be sent separately or via secure link
    },

    /*
     * HTML Template Placeholder - IT Team to design
     *
     * <html>
     *   <body>
     *     <h1>Welcome to Spectra WiFi!</h1>
     *     <p>Dear {{customerName}},</p>
     *     <p>Your WiFi site <strong>{{siteName}}</strong> is now active.</p>
     *     <h2>Site Details</h2>
     *     <ul>
     *       <li>Site ID: {{siteId}}</li>
     *       <li>Product: {{productName}}</li>
     *       <li>Activation Date: {{activationDate}}</li>
     *     </ul>
     *     <h2>WiFi Network(s)</h2>
     *     {{#each ssidList}}
     *       <li>{{ssidName}} - {{category}}</li>
     *     {{/each}}
     *     <h2>Self-Care Portal</h2>
     *     <p>Access your portal at: {{portalUrl}}</p>
     *     <h2>Need Help?</h2>
     *     <p>Email: {{supportEmail}}</p>
     *     <p>Phone: {{supportPhone}}</p>
     *   </body>
     * </html>
     */
  };
};

/**
 * IT TEAM INTEGRATION POINT: SSID Credentials Email Template
 *
 * @param {Object} siteData - Site configuration data
 * @param {Object} customerData - Customer details
 * @returns {Object} - Email template data (placeholder)
 */
export const getSSIDCredentialsEmailTemplate = (siteData, customerData) => {
  // TODO: IT Team - Implement actual email sending
  // This should be sent separately from welcome email for security

  return {
    to: customerData.primaryEmail,
    subject: `WiFi Credentials - ${siteData.siteName}`,
    templateId: 'SSID_CREDENTIALS_TEMPLATE_001',
    dynamicData: {
      customerName: customerData.companyName,
      siteName: siteData.siteName,
      ssidCredentials: (siteData.ssidConfiguration || []).map(ssid => ({
        ssidName: ssid.ssidName,
        securityType: ssid.securityType,
        password: '********', // Never expose actual password in logs/templates
        // IT Team: Fetch actual credentials from secure vault
      })),
    },

    /*
     * SECURITY NOTE:
     * - SSID passwords should be encrypted at rest and in transit
     * - Consider sending credentials via secure portal link instead of email
     * - Implement password masking in all logs
     * - Add option for customer to change WiFi password after first login
     */
  };
};

// ============================================
// SITE ACTIONS
// ============================================

/**
 * IT TEAM INTEGRATION POINT: Suspend Site
 *
 * When a site is suspended:
 * 1. Disable all user authentications on AAA server
 * 2. Update site status in all systems
 * 3. Send notification to customer
 * 4. Keep configuration intact for reactivation
 *
 * @param {string} siteId - Site ID to suspend
 * @param {string} reason - Suspension reason
 * @param {string} suspendedBy - User who suspended
 * @returns {Object} - Suspension action data (placeholder)
 */
export const suspendSiteAction = (siteId, reason, suspendedBy) => {
  // TODO: IT Team - Implement actual suspension logic

  return {
    action: 'SUSPEND_SITE',
    siteId,
    reason,
    suspendedBy,
    timestamp: new Date().toISOString(),

    /* Integration Points for IT Team:
     *
     * 1. AAA Server:
     *    - POST /api/aaa/sites/{siteId}/suspend
     *    - This should disable all authentications for the site
     *
     * 2. Wireless Controller:
     *    - Optionally disable SSID broadcasts
     *    - Or configure to reject all authentications
     *
     * 3. Billing System:
     *    - PUT /api/billing/sites/{siteId}/status
     *    - Update status to suspended, pause billing if applicable
     *
     * 4. Notification:
     *    - Send email to customer about suspension
     *    - Include reason and contact info for resolution
     */
  };
};

/**
 * IT TEAM INTEGRATION POINT: Block Site (Permanent)
 *
 * When a site is blocked permanently:
 * 1. Terminate all user accounts
 * 2. Archive configuration
 * 3. Release IP addresses and resources
 * 4. Send final notification to customer
 * 5. Generate final invoice if required
 *
 * @param {string} siteId - Site ID to block
 * @param {string} reason - Block reason
 * @param {string} blockedBy - User who blocked
 * @returns {Object} - Block action data (placeholder)
 */
export const blockSiteAction = (siteId, reason, blockedBy) => {
  // TODO: IT Team - Implement actual blocking logic

  return {
    action: 'BLOCK_SITE',
    siteId,
    reason,
    blockedBy,
    timestamp: new Date().toISOString(),
    isPermanent: true,

    /* Integration Points for IT Team:
     *
     * 1. AAA Server:
     *    - DELETE /api/aaa/sites/{siteId} or
     *    - POST /api/aaa/sites/{siteId}/terminate
     *
     * 2. Wireless Controller:
     *    - Remove SSID configurations
     *    - Archive controller settings
     *
     * 3. IP Management:
     *    - Release all allocated IPs
     *    - Update IP inventory
     *
     * 4. Billing System:
     *    - Generate final invoice
     *    - Mark account as terminated
     *
     * 5. Data Archival:
     *    - Archive all site data per retention policy
     *    - Generate site closure report
     */
  };
};

/**
 * IT TEAM INTEGRATION POINT: Reactivate Suspended Site
 *
 * @param {string} siteId - Site ID to reactivate
 * @param {string} reactivatedBy - User who reactivated
 * @returns {Object} - Reactivation action data (placeholder)
 */
export const reactivateSiteAction = (siteId, reactivatedBy) => {
  // TODO: IT Team - Implement actual reactivation logic

  return {
    action: 'REACTIVATE_SITE',
    siteId,
    reactivatedBy,
    timestamp: new Date().toISOString(),

    /* Integration Points for IT Team:
     *
     * 1. AAA Server:
     *    - POST /api/aaa/sites/{siteId}/reactivate
     *    - Re-enable all user authentications
     *
     * 2. Billing System:
     *    - Resume billing from reactivation date
     *
     * 3. Notification:
     *    - Send reactivation confirmation to customer
     */
  };
};

// ============================================
// QUEUE PRIORITY LEVELS
// ============================================
export const QUEUE_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const QUEUE_PRIORITY_LABELS = {
  [QUEUE_PRIORITY.HIGH]: 'High Priority',
  [QUEUE_PRIORITY.MEDIUM]: 'Medium Priority',
  [QUEUE_PRIORITY.LOW]: 'Low Priority'
};

export const QUEUE_PRIORITY_COLORS = {
  [QUEUE_PRIORITY.HIGH]: '#ef4444',
  [QUEUE_PRIORITY.MEDIUM]: '#f59e0b',
  [QUEUE_PRIORITY.LOW]: '#10b981'
};

/**
 * Check if a status transition is allowed
 * @param {string} currentStatus - Current site status
 * @param {string} newStatus - Target status
 * @param {string} userRole - User's role
 * @returns {boolean} - Whether transition is allowed
 */
export const canTransitionStatus = (currentStatus, newStatus, userRole) => {
  const allowedTransitions = SITE_STATUS_TRANSITIONS[currentStatus] || [];
  const allowedRoles = STATUS_TRANSITION_ROLES[newStatus] || [];

  return allowedTransitions.includes(newStatus) && allowedRoles.includes(userRole);
};

/**
 * Get next available statuses for a site
 * @param {string} currentStatus - Current site status
 * @param {string} userRole - User's role
 * @returns {Array} - Array of allowed next statuses
 */
export const getNextStatuses = (currentStatus, userRole) => {
  const allowedTransitions = SITE_STATUS_TRANSITIONS[currentStatus] || [];

  return allowedTransitions.filter(status => {
    const allowedRoles = STATUS_TRANSITION_ROLES[status] || [];
    return allowedRoles.includes(userRole);
  });
};

export default {
  INDIAN_STATES,
  REGIONS,
  SOLUTION_TYPES,
  SITE_TYPES,
  PRODUCT_NAMES,
  BANDWIDTH_TYPES,
  TRAFFIC_FLOW_TYPES,
  WIRELESS_CONTROLLER_VERSIONS,
  AAA_CONTROLLERS,
  SSID_CATEGORIES,
  DEFAULT_DEVICE_LIMITS,
  SEGMENT_REPORTS,
  MANAGED_WIFI_INFRA_REPORTS,
  MASTER_POLICY_LIST,
  TOPUP_POLICIES,
  GST_RATE,
  // Authentication Configuration
  AUTH_METHODS,
  SEGMENT_AUTH_CONFIG,
  getAuthCategoriesForSegment,
  getDefaultAuthConfig,
  validateAuthConfig,
  getAuthMethodLabel,
  getAuthMethodDescription,
  formatAuthConfigForDisplay,
  formatAuthConfigForExport,
  getAuthConfigSummary,
  VALIDATION_RULES,
  INITIAL_FORM_STATE,
  PROVISIONING_STEPS,
  generateSiteId,
  generateAccountPrefix,
  calculatePriceWithGST,
  getPoliciesForSegment,
  getDefaultReportsForSegment,
  getReportsForSolutionType,
  getSolutionTypeConfig,
  isInternetManaged,
  areTopupsEnabled,
  isValidIP,
  isValidEmail,
  isValidPhone,
  getDraftStorageKey,
  // Site Status Workflow
  SITE_STATUS,
  SITE_STATUS_LABELS,
  SITE_STATUS_COLORS,
  SITE_STATUS_TRANSITIONS,
  STATUS_TRANSITION_ROLES,
  SITE_TESTING_CHECKLIST,
  QUEUE_PRIORITY,
  QUEUE_PRIORITY_LABELS,
  QUEUE_PRIORITY_COLORS,
  canTransitionStatus,
  getNextStatuses,
  // Email Templates (IT Integration Points)
  getWelcomeEmailTemplate,
  getSSIDCredentialsEmailTemplate,
  // Site Actions (IT Integration Points)
  suspendSiteAction,
  blockSiteAction,
  reactivateSiteAction
};
