// src/utils/reportDataGenerator.js

/**
 * Report Data Generator Utility
 * Generates comprehensive sample data for reports
 */

/**
 * Generate date range array
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {number} days - Number of days to generate
 * @returns {Array<string>} Array of date strings
 */
export const generateDateRange = (startDate, days) => {
  const dates = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
};

/**
 * Generate month range array
 * @param {string} startMonth - Start month in YYYY-MM format
 * @param {number} months - Number of months to generate
 * @returns {Array<string>} Array of month strings
 */
export const generateMonthRange = (startMonth, months) => {
  const monthsArray = [];
  const [year, month] = startMonth.split('-').map(Number);

  for (let i = 0; i < months; i++) {
    const currentMonth = month + i;
    const currentYear = year + Math.floor((currentMonth - 1) / 12);
    const adjustedMonth = ((currentMonth - 1) % 12) + 1;
    const monthStr = `${currentYear}-${String(adjustedMonth).padStart(2, '0')}`;
    monthsArray.push(monthStr);
  }

  return monthsArray;
};

/**
 * Random number generator with variance
 */
export const randomInRange = (min, max, variance = 0) => {
  const base = min + Math.random() * (max - min);
  if (variance === 0) return Math.round(base);
  const adjustment = (Math.random() - 0.5) * variance;
  return Math.round(base + adjustment);
};

/**
 * Random float with precision
 */
export const randomFloat = (min, max, precision = 1) => {
  const value = min + Math.random() * (max - min);
  return parseFloat(value.toFixed(precision));
};

/**
 * Trending number generator (increases or decreases over time)
 */
export const trendingValue = (baseValue, index, trendFactor = 1.05, variance = 0.1) => {
  const trend = baseValue * Math.pow(trendFactor, index);
  const noise = (Math.random() - 0.5) * variance * trend;
  return Math.round(trend + noise);
};

/**
 * Generate daily average active users data
 */
export const generateDailyActiveUsers = (startDate = '2024-01-01', days = 90) => {
  const dates = generateDateRange(startDate, days);
  return dates.map((date, index) => ({
    date,
    avgActiveUsers: trendingValue(120, index, 1.003, 0.15)
  }));
};

/**
 * Generate site monthly active users data
 */
export const generateMonthlyActiveUsers = (startMonth = '2024-01', months = 12) => {
  const monthsArray = generateMonthRange(startMonth, months);
  let prevAvg = 100;

  return monthsArray.map((month, index) => {
    const avgActiveUsers = trendingValue(100, index, 1.08, 0.1);
    const newUsers = randomInRange(15, 35);
    const churnedUsers = randomInRange(5, 20);
    const activations = randomInRange(20, 40);
    const deactivations = randomInRange(8, 25);
    const changeFromPrevMonth = index === 0 ? 0 : avgActiveUsers - prevAvg;

    prevAvg = avgActiveUsers;

    return {
      month,
      avgActiveUsers,
      newUsers,
      churnedUsers,
      activations,
      deactivations,
      changeFromPrevMonth: Math.round(changeFromPrevMonth)
    };
  });
};

/**
 * Generate policy-wise monthly active users
 */
export const generatePolicyWiseUsers = (startMonth = '2024-01', months = 12) => {
  const monthsArray = generateMonthRange(startMonth, months);
  const policies = ['Standard', 'Premium', 'Basic', 'Guest'];
  const data = [];

  monthsArray.forEach((month, monthIndex) => {
    policies.forEach((policy, policyIndex) => {
      const baseValue = (policyIndex + 1) * 25;
      const avgActiveUsers = trendingValue(baseValue, monthIndex, 1.05, 0.12);
      data.push({
        month,
        policy,
        avgActiveUsers
      });
    });
  });

  return data;
};

/**
 * Generate monthly data usage summary
 */
export const generateMonthlyDataUsage = (startMonth = '2024-01', months = 12) => {
  const monthsArray = generateMonthRange(startMonth, months);

  return monthsArray.map((month, index) => {
    const totalUsageGB = trendingValue(450, index, 1.12, 0.15);
    const peakUsageGB = Math.round(totalUsageGB * randomFloat(1.3, 1.5, 2));
    const avgUsageGB = Math.round(totalUsageGB * randomFloat(0.75, 0.95, 2));

    return {
      month,
      totalUsageGB,
      peakUsageGB,
      avgUsageGB
    };
  });
};

/**
 * Generate network usage report (daily)
 */
export const generateNetworkUsage = (startDate = '2024-01-01', days = 90) => {
  const dates = generateDateRange(startDate, days);

  return dates.map((day, index) => {
    const dayOfWeek = new Date(day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseUsage = isWeekend ? 80 : 150;

    return {
      day,
      usageGB: trendingValue(baseUsage, index, 1.002, 0.2)
    };
  });
};

/**
 * Generate user session history
 */
export const generateUserSessions = (startDate = '2024-01-01', days = 90) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const data = [];

  dates.forEach(date => {
    // Random number of sessions per day (5-15)
    const sessionsToday = randomInRange(5, 15);

    for (let i = 0; i < sessionsToday; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const startHour = randomInRange(6, 22);
      const duration = randomInRange(30, 480); // 30 min to 8 hours in minutes
      const sessionStart = `${date} ${String(startHour).padStart(2, '0')}:${String(randomInRange(0, 59)).padStart(2, '0')}`;
      const endDate = new Date(`${date}T${String(startHour).padStart(2, '0')}:00:00`);
      endDate.setMinutes(endDate.getMinutes() + duration);
      const sessionEnd = endDate.toISOString().replace('T', ' ').split('.')[0];
      const dataUsed = randomFloat(50, 3000, 2); // MB

      data.push({
        userId,
        sessionStart,
        sessionEnd,
        dataUsed: `${dataUsed} MB`,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`
      });
    }
  });

  return data;
};

/**
 * Generate user data consumption
 */
export const generateUserDataConsumption = (startDate = '2024-01-01', days = 90) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const data = [];

  userIds.forEach(userId => {
    dates.forEach(date => {
      // Not every user uses data every day
      if (Math.random() > 0.3) {
        const sessions = randomInRange(1, 8);
        const dataUsedMB = randomInRange(100, 4000);

        data.push({
          userId,
          date,
          dataUsedMB,
          sessions
        });
      }
    });
  });

  return data;
};

/**
 * Generate bandwidth utilization data
 */
export const generateBandwidthUtilization = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const data = [];

  dates.forEach(date => {
    // Generate 24 hourly data points per day
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:00`;
      const isPeakHour = hour >= 9 && hour <= 17;
      const uploadMbps = randomFloat(isPeakHour ? 50 : 20, isPeakHour ? 150 : 80, 2);
      const downloadMbps = randomFloat(isPeakHour ? 200 : 100, isPeakHour ? 800 : 400, 2);
      const utilization = randomFloat(isPeakHour ? 60 : 30, isPeakHour ? 95 : 60, 2);

      data.push({
        timestamp,
        uploadMbps,
        downloadMbps,
        utilization: `${utilization}%`
      });
    }
  });

  return data;
};

/**
 * Generate internet uptime report
 */
export const generateInternetUptime = (startDate = '2024-01-01', days = 90) => {
  const dates = generateDateRange(startDate, days);

  return dates.map(date => {
    const hasOutage = Math.random() > 0.85; // 15% chance of outage
    const outages = hasOutage ? randomInRange(1, 3) : 0;
    const totalDowntime = hasOutage ? randomInRange(5, 120) : 0;
    const uptimePercent = hasOutage
      ? randomFloat(98.5, 99.8, 2)
      : randomFloat(99.9, 100, 2);

    return {
      date,
      uptimePercent,
      outages,
      totalDowntime: `${totalDowntime} min`
    };
  });
};

/**
 * Generate SLA compliance report
 */
export const generateSLACompliance = (startMonth = '2024-01', months = 12) => {
  const monthsArray = generateMonthRange(startMonth, months);
  const metrics = [
    { metric: 'Network Uptime', target: 99.5 },
    { metric: 'Response Time', target: 100 },
    { metric: 'Bandwidth Availability', target: 95 },
    { metric: 'Support Resolution', target: 90 },
    { metric: 'Security Compliance', target: 98 },
    { metric: 'Data Backup Success', target: 99 }
  ];

  const data = [];

  monthsArray.forEach(month => {
    metrics.forEach(({ metric, target }) => {
      const variance = randomFloat(-5, 5, 1);
      const actual = target + variance;
      const compliance = actual >= target ? 'Above Target' : 'Below Target';

      data.push({
        month,
        metric,
        target,
        actual: parseFloat(actual.toFixed(1)),
        compliance
      });
    });
  });

  return data;
};

/**
 * Generate alerts summary
 */
export const generateAlertsSummary = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const alertTypes = ['Critical', 'Warning', 'Info'];
  const data = [];

  dates.forEach(date => {
    alertTypes.forEach(alertType => {
      const baseCount = alertType === 'Info' ? 50 : alertType === 'Warning' ? 20 : 5;
      const count = randomInRange(Math.max(0, baseCount - 10), baseCount + 10);

      if (count > 0) {
        data.push({
          date,
          alertType,
          count
        });
      }
    });
  });

  return data;
};

/**
 * Generate authentication logs
 */
export const generateAuthenticationLogs = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const methods = ['Password', 'OTP', 'SSO'];
  const results = ['Success', 'Failed'];
  const data = [];

  dates.forEach(date => {
    // Generate 20-50 login attempts per day
    const attempts = randomInRange(20, 50);

    for (let i = 0; i < attempts; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const hour = randomInRange(6, 22);
      const minute = randomInRange(0, 59);
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const method = methods[Math.floor(Math.random() * methods.length)];
      // 90% success rate
      const result = Math.random() > 0.1 ? 'Success' : 'Failed';
      const ipAddress = `192.168.1.${randomInRange(100, 254)}`;

      data.push({
        timestamp,
        userId,
        method,
        result,
        ipAddress
      });
    }
  });

  return data;
};

/**
 * Generate failed authentication report
 */
export const generateFailedAuthentication = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const reasons = ['Invalid Password', 'Account Locked', 'Invalid Username', 'Expired Credentials'];
  const data = [];

  dates.forEach(date => {
    // Generate 1-5 failed attempts per day
    const failures = randomInRange(1, 5);

    for (let i = 0; i < failures; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const hour = randomInRange(6, 22);
      const minute = randomInRange(0, 59);
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const attemptCount = randomInRange(1, 5);
      const ipAddress = `192.168.1.${randomInRange(100, 254)}`;
      const reason = reasons[Math.floor(Math.random() * reasons.length)];

      data.push({
        timestamp,
        userId,
        attemptCount,
        ipAddress,
        reason
      });
    }
  });

  return data;
};

/**
 * Generate add-on usage report
 */
export const generateAddonUsage = (startMonth = '2024-01', months = 12) => {
  const monthsArray = generateMonthRange(startMonth, months);
  const addons = [
    'Premium Bandwidth',
    'Extended Data Pack',
    'Priority Support',
    'Advanced Security',
    'Cloud Storage',
    'Static IP Address'
  ];

  const data = [];

  monthsArray.forEach(month => {
    addons.forEach(addonName => {
      const users = randomInRange(15, 60);
      const revenuePerUser = randomInRange(50, 200);
      const revenue = users * revenuePerUser;

      data.push({
        month,
        addonName,
        users,
        revenue,
        purchaseDate: month
      });
    });
  });

  return data;
};

/**
 * Topup types with their typical amounts
 */
const TOPUP_TYPES = [
  { type: 'speed', label: 'Speed Boost', amounts: [99, 149, 199, 299] },
  { type: 'data', label: 'Data Pack', amounts: [49, 99, 149, 199, 299] },
  { type: 'device', label: 'Extra Device', amounts: [79, 129, 179] },
  { type: 'plan', label: 'Plan Upgrade', amounts: [199, 299, 399, 499, 599] }
];

/**
 * Generate top-up history with topup type
 * @param {string} startDate - Start date
 * @param {number} days - Number of days
 * @param {string|null} filterType - Optional filter by topup type (speed, data, device, plan)
 */
export const generateTopupHistory = (startDate = '2024-01-01', days = 90, filterType = null) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const data = [];

  dates.forEach(date => {
    // Random chance of top-up on any given day
    if (Math.random() > 0.7) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];

      // Select a random topup type or use filtered type
      let topupTypeInfo;
      if (filterType) {
        topupTypeInfo = TOPUP_TYPES.find(t => t.type === filterType);
      } else {
        topupTypeInfo = TOPUP_TYPES[Math.floor(Math.random() * TOPUP_TYPES.length)];
      }

      const topupAmount = topupTypeInfo.amounts[Math.floor(Math.random() * topupTypeInfo.amounts.length)];
      const remaining = Math.round(topupAmount * randomFloat(0.3, 0.9, 2));

      data.push({
        userId,
        topupType: topupTypeInfo.type,
        topupTypeLabel: topupTypeInfo.label,
        topupAmount,
        purchaseDate: date,
        remaining
      });
    }
  });

  return data;
};

/**
 * Generate event list
 */
export const generateEventList = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const userIds = Array.from({ length: 30 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const eventTypes = [
    'User Login',
    'User Logout',
    'Device Connected',
    'Device Disconnected',
    'Policy Changed',
    'Password Reset',
    'Data Limit Reached',
    'Top-up Purchase'
  ];
  const devices = [
    'iPhone 13',
    'Samsung Galaxy S21',
    'MacBook Pro',
    'Dell Laptop',
    'iPad Air',
    'OnePlus 9'
  ];

  const data = [];

  dates.forEach(date => {
    // Generate 30-80 events per day
    const eventsPerDay = randomInRange(30, 80);

    for (let i = 0; i < eventsPerDay; i++) {
      const hour = randomInRange(0, 23);
      const minute = randomInRange(0, 59);
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const user = userIds[Math.floor(Math.random() * userIds.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const details = `${eventType} for ${user} on ${device}`;

      data.push({
        timestamp,
        eventType,
        user,
        device,
        details
      });
    }
  });

  return data;
};

/**
 * Generate alarm list
 */
export const generateAlarmList = (startDate = '2024-01-01', days = 30) => {
  const dates = generateDateRange(startDate, days);
  const severities = ['Critical', 'Warning', 'Info'];
  const messages = [
    'High bandwidth utilization detected',
    'Access point offline',
    'Network latency increased',
    'Authentication server slow',
    'Disk space low',
    'Certificate expiring soon',
    'Unusual login pattern detected',
    'Device limit exceeded'
  ];
  const devices = [
    'AP-01-Floor1',
    'AP-02-Floor2',
    'AP-03-Floor3',
    'Core-Switch-01',
    'Router-Main',
    'Firewall-01',
    'Server-Auth',
    'Server-DB'
  ];
  const statuses = ['Open', 'Acknowledged', 'Resolved'];

  const data = [];

  dates.forEach(date => {
    // Generate 5-20 alarms per day
    const alarmsPerDay = randomInRange(5, 20);

    for (let i = 0; i < alarmsPerDay; i++) {
      const hour = randomInRange(0, 23);
      const minute = randomInRange(0, 59);
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const affectedDevice = devices[Math.floor(Math.random() * devices.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      data.push({
        timestamp,
        severity,
        message,
        affectedDevice,
        status
      });
    }
  });

  return data;
};

/**
 * Generate access point list
 */
export const generateAccessPointList = () => {
  const locations = [
    'Floor 1 - Lobby',
    'Floor 1 - Conference Room A',
    'Floor 2 - Open Office',
    'Floor 2 - Meeting Room B',
    'Floor 3 - Development Area',
    'Floor 3 - Cafeteria',
    'Floor 4 - Executive Office',
    'Floor 4 - Training Room',
    'Basement - Server Room',
    'Rooftop - Outdoor Area'
  ];

  return locations.map((location, index) => {
    const apNumber = String(index + 1).padStart(2, '0');
    const status = Math.random() > 0.1 ? 'Online' : 'Offline';
    const connectedUsers = status === 'Online' ? randomInRange(5, 50) : 0;
    const mac = `00:1A:2B:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}`;

    return {
      apName: `AP-${apNumber}`,
      mac,
      location,
      status,
      connectedUsers
    };
  });
};

/**
 * Generate client list
 */
export const generateClientList = () => {
  const userIds = Array.from({ length: 50 }, (_, i) => `USER${String(i + 1).padStart(3, '0')}`);
  const apNames = Array.from({ length: 10 }, (_, i) => `AP-${String(i + 1).padStart(2, '0')}`);
  const data = [];

  // Generate 30-80 currently connected clients
  const connectedCount = randomInRange(30, 80);

  for (let i = 0; i < connectedCount; i++) {
    const clientMac = `A4:B1:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}`;
    const userName = userIds[Math.floor(Math.random() * userIds.length)];
    const apName = apNames[Math.floor(Math.random() * apNames.length)];
    const signalStrength = randomInRange(-70, -30);
    const connectedTime = randomInRange(5, 480); // minutes

    data.push({
      clientMac,
      userName,
      apName,
      signalStrength: `${signalStrength} dBm`,
      connectedTime: `${Math.floor(connectedTime / 60)}h ${connectedTime % 60}m`
    });
  }

  return data;
};

/**
 * Generate user AP analytics
 */
export const generateUserAPAnalytics = (startDate = '2024-01-01', days = 30) => {
  const apNames = Array.from({ length: 10 }, (_, i) => `AP-${String(i + 1).padStart(2, '0')}`);
  const data = [];

  apNames.forEach(apName => {
    const uniqueUsers = randomInRange(20, 100);
    const totalSessions = randomInRange(uniqueUsers * 10, uniqueUsers * 50);
    const avgSessionTime = randomInRange(30, 300); // minutes

    data.push({
      apName,
      uniqueUsers,
      totalSessions,
      avgSessionTime: `${Math.floor(avgSessionTime / 60)}h ${avgSessionTime % 60}m`
    });
  });

  return data;
};

/**
 * Generate rogue AP list
 */
export const generateRogueAPList = () => {
  const rogueCount = randomInRange(0, 5);
  const data = [];

  for (let i = 0; i < rogueCount; i++) {
    const mac = `XX:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}:${randomInRange(10, 99)}`;
    const ssid = ['FreeWiFi', 'GuestNetwork', 'UnknownAP', 'TestAP'][Math.floor(Math.random() * 4)];
    const detectedTime = `2024-${String(randomInRange(1, 12)).padStart(2, '0')}-${String(randomInRange(1, 28)).padStart(2, '0')} ${String(randomInRange(0, 23)).padStart(2, '0')}:${String(randomInRange(0, 59)).padStart(2, '0')}`;
    const signalStrength = randomInRange(-80, -50);
    const threat = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];

    data.push({
      mac,
      ssid,
      detectedTime,
      signalStrength: `${signalStrength} dBm`,
      threat
    });
  }

  return data;
};

// ============================================
// GUEST ACCESS REPORT GENERATORS
// ============================================

/**
 * Generate guest access summary data
 */
export const generateGuestAccessSummary = (startDate = '2025-01-01', days = 31) => {
  const dates = generateDateRange(startDate, days);

  return dates.map(date => {
    const totalGuests = randomInRange(15, 45);
    const activeGuests = randomInRange(Math.floor(totalGuests * 0.4), Math.floor(totalGuests * 0.7));
    const checkedIn = randomInRange(5, 20);
    const checkedOut = randomInRange(3, 15);
    const dataUsed = randomFloat(5, 50, 2);

    return {
      date,
      totalGuests,
      activeGuests,
      checkedIn,
      checkedOut,
      dataUsed: `${dataUsed} GB`
    };
  });
};

/**
 * Generate guest activity log data
 */
export const generateGuestActivityLog = (startDate = '2025-01-01', days = 7) => {
  const dates = generateDateRange(startDate, days);
  const guestNames = [
    'John Smith', 'Maria Garcia', 'Raj Patel', 'Li Wei', 'Emma Johnson',
    'Ahmed Khan', 'Sofia Rodriguez', 'James Wilson', 'Priya Sharma', 'Michael Brown'
  ];
  const actions = ['Check-in', 'Check-out', 'WiFi Connected', 'WiFi Disconnected', 'Access Extended', 'Voucher Redeemed'];
  const performers = ['Reception', 'Security', 'System', 'Admin', 'Self-service'];
  const data = [];

  dates.forEach(date => {
    const activitiesPerDay = randomInRange(10, 30);

    for (let i = 0; i < activitiesPerDay; i++) {
      const hour = randomInRange(6, 22);
      const minute = randomInRange(0, 59);
      const timestamp = `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const performedBy = performers[Math.floor(Math.random() * performers.length)];
      const details = `${action} for ${guestName}`;

      data.push({
        timestamp,
        guestName,
        action,
        performedBy,
        details
      });
    }
  });

  return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Generate guest voucher report data
 */
export const generateGuestVoucherReport = (startDate = '2025-01-01', days = 31) => {
  const dates = generateDateRange(startDate, days);
  const guestTypes = ['Visitor', 'Contractor', 'Conference', 'VIP', 'Vendor'];
  const creators = ['Reception', 'Admin', 'HR', 'IT Support', 'Security'];
  const statuses = ['Active', 'Redeemed', 'Expired'];
  const data = [];

  dates.forEach(date => {
    const vouchersPerDay = randomInRange(3, 12);

    for (let i = 0; i < vouchersPerDay; i++) {
      const voucherCode = `V${date.replace(/-/g, '')}${String(i + 1).padStart(3, '0')}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const guestType = guestTypes[Math.floor(Math.random() * guestTypes.length)];
      const createdBy = creators[Math.floor(Math.random() * creators.length)];
      const redeemedBy = status === 'Redeemed' ? `Guest-${randomInRange(100, 999)}` : '-';
      const validityHours = [4, 8, 12, 24, 48][Math.floor(Math.random() * 5)];

      data.push({
        voucherCode,
        status,
        guestType,
        createdBy,
        redeemedBy,
        validityHours,
        createdDate: date
      });
    }
  });

  return data;
};

/**
 * Generate guest type breakdown data
 */
export const generateGuestTypeBreakdown = (startMonth = '2025-01', months = 1) => {
  const guestTypes = [
    { type: 'Visitor', baseCount: 150 },
    { type: 'Contractor', baseCount: 80 },
    { type: 'Conference', baseCount: 120 },
    { type: 'VIP', baseCount: 25 },
    { type: 'Vendor', baseCount: 45 }
  ];

  const monthsArray = generateMonthRange(startMonth, months);
  const data = [];

  monthsArray.forEach(month => {
    let totalGuests = 0;
    const monthData = guestTypes.map(({ type, baseCount }) => {
      const count = trendingValue(baseCount, 0, 1, 0.2);
      totalGuests += count;
      return { type, count };
    });

    monthData.forEach(item => {
      const percentage = ((item.count / totalGuests) * 100).toFixed(1);
      const avgDuration = randomFloat(1.5, 8, 1);
      const dataUsed = randomFloat(0.5, 5, 2);

      data.push({
        month,
        guestType: item.type,
        count: item.count,
        percentage: `${percentage}%`,
        avgDuration: `${avgDuration} hrs`,
        dataUsed: `${dataUsed} GB`
      });
    });
  });

  return data;
};

/**
 * Generate guest data usage report
 */
export const generateGuestDataUsage = (startDate = '2025-01-01', days = 31) => {
  const dates = generateDateRange(startDate, days);
  const guestTypes = ['Visitor', 'Contractor', 'Conference', 'VIP', 'Vendor'];
  const data = [];
  let guestIdCounter = 1;

  dates.forEach(date => {
    const guestsPerDay = randomInRange(5, 20);

    for (let i = 0; i < guestsPerDay; i++) {
      const guestId = `G${String(guestIdCounter++).padStart(4, '0')}`;
      const guestName = `Guest-${guestId}`;
      const guestType = guestTypes[Math.floor(Math.random() * guestTypes.length)];
      const dataUsed = randomFloat(0.1, 8, 2);
      const sessions = randomInRange(1, 10);
      const avgSession = randomInRange(15, 180);

      data.push({
        guestId,
        guestName,
        guestType,
        date,
        dataUsed: `${dataUsed} GB`,
        sessions,
        avgSession: `${Math.floor(avgSession / 60)}h ${avgSession % 60}m`
      });
    }
  });

  return data;
};

// ============================================
// COMPANY-LEVEL REPORT GENERATORS
// ============================================

/**
 * Generate company overview dashboard data
 */
export const generateCompanyOverviewDashboard = () => {
  const sites = [
    { name: 'Mumbai Corporate Office', id: 'SITE-MUM-ENT-001' },
    { name: 'Hyderabad Tech Park', id: 'SITE-HYD-OFF-007' },
    { name: 'Urban Living - Bangalore', id: 'SITE-BLR-COL-002' },
    { name: 'WorkHub - Pune', id: 'SITE-PUN-COW-003' },
    { name: 'Grand Resort Goa', id: 'SITE-GOA-HTL-001' },
    { name: 'PG Residency - Chennai', id: 'SITE-CHN-PGR-005' },
    { name: 'Community Hub - Delhi', id: 'SITE-DEL-MIS-006' }
  ];

  let totalUsers = 0;
  let totalDevices = 0;
  let totalBandwidth = 0;

  const siteData = sites.map(site => {
    const users = randomInRange(100, 500);
    const devices = randomInRange(users * 2, users * 4);
    const bandwidth = randomFloat(50, 500, 1);

    totalUsers += users;
    totalDevices += devices;
    totalBandwidth += bandwidth;

    return {
      siteName: site.name,
      siteId: site.id,
      users,
      devices,
      bandwidth: `${bandwidth} GB`
    };
  });

  return {
    summary: {
      totalSites: sites.length,
      totalUsers,
      totalDevices,
      totalBandwidth: `${totalBandwidth.toFixed(1)} GB`
    },
    sites: siteData
  };
};

/**
 * Generate cross-site usage comparison data
 */
export const generateCrossSiteUsageComparison = (startMonth = '2024-01', months = 6) => {
  const sites = [
    'Mumbai Corporate Office',
    'Hyderabad Tech Park',
    'Urban Living - Bangalore',
    'WorkHub - Pune',
    'Grand Resort Goa',
    'PG Residency - Chennai',
    'Community Hub - Delhi'
  ];
  const monthsArray = generateMonthRange(startMonth, months);
  const data = [];

  monthsArray.forEach(month => {
    sites.forEach(siteName => {
      const totalUsers = randomInRange(100, 500);
      const avgBandwidth = randomFloat(20, 150, 1);
      const dataUsage = randomFloat(100, 800, 1);

      data.push({
        month,
        siteName,
        totalUsers,
        avgBandwidth: `${avgBandwidth} Mbps`,
        dataUsage: `${dataUsage} GB`
      });
    });
  });

  return data;
};

/**
 * Generate consolidated billing report data
 */
export const generateConsolidatedBillingReport = (startMonth = '2024-01', months = 6) => {
  const sites = [
    { name: 'Mumbai Corporate Office', baseUsers: 350 },
    { name: 'Hyderabad Tech Park', baseUsers: 180 },
    { name: 'Urban Living - Bangalore', baseUsers: 280 },
    { name: 'WorkHub - Pune', baseUsers: 220 },
    { name: 'Grand Resort Goa', baseUsers: 380 },
    { name: 'PG Residency - Chennai', baseUsers: 140 },
    { name: 'Community Hub - Delhi', baseUsers: 190 }
  ];
  const monthsArray = generateMonthRange(startMonth, months);
  const data = [];

  monthsArray.forEach((month, monthIndex) => {
    sites.forEach(site => {
      const activeUsers = trendingValue(site.baseUsers, monthIndex, 1.02, 0.1);
      const ratePerUser = randomFloat(150, 350, 0);
      const billedAmount = activeUsers * ratePerUser;
      const dueDate = `${month}-28`;

      data.push({
        month,
        siteName: site.name,
        activeUsers,
        billedAmount: `₹${billedAmount.toLocaleString()}`,
        dueDate
      });
    });
  });

  return data;
};

/**
 * Generate company license utilization data
 */
export const generateCompanyLicenseUtilization = () => {
  const sites = [
    { name: 'Mumbai Corporate Office', allocated: 500 },
    { name: 'Hyderabad Tech Park', allocated: 200 },
    { name: 'Urban Living - Bangalore', allocated: 300 },
    { name: 'WorkHub - Pune', allocated: 250 },
    { name: 'Grand Resort Goa', allocated: 400 },
    { name: 'PG Residency - Chennai', allocated: 150 },
    { name: 'Community Hub - Delhi', allocated: 200 }
  ];

  return sites.map(site => {
    const utilizationRate = randomFloat(60, 95, 1);
    const usedLicenses = Math.round((site.allocated * utilizationRate) / 100);

    return {
      siteName: site.name,
      allocatedLicenses: site.allocated,
      usedLicenses,
      availableLicenses: site.allocated - usedLicenses,
      utilizationRate: `${utilizationRate}%`
    };
  });
};

/**
 * Generate company user distribution data
 */
export const generateCompanyUserDistribution = (startMonth = '2024-01', months = 6) => {
  const sites = [
    'Mumbai Corporate Office',
    'Hyderabad Tech Park',
    'Urban Living - Bangalore',
    'WorkHub - Pune',
    'Grand Resort Goa',
    'PG Residency - Chennai',
    'Community Hub - Delhi'
  ];
  const monthsArray = generateMonthRange(startMonth, months);
  const data = [];

  monthsArray.forEach((month, monthIndex) => {
    sites.forEach(siteName => {
      const baseActive = randomInRange(150, 400);
      const activeUsers = trendingValue(baseActive, monthIndex, 1.03, 0.1);
      const suspendedUsers = randomInRange(5, 25);
      const newUsers = randomInRange(10, 50);

      data.push({
        month,
        siteName,
        activeUsers,
        suspendedUsers,
        newUsers
      });
    });
  });

  return data;
};

/**
 * Generate company alerts summary data
 */
export const generateCompanyAlertsSummary = (startDate = '2024-07-01', days = 31) => {
  const sites = [
    'Mumbai Corporate Office',
    'Hyderabad Tech Park',
    'Urban Living - Bangalore',
    'WorkHub - Pune',
    'Grand Resort Goa',
    'PG Residency - Chennai',
    'Community Hub - Delhi'
  ];
  const dates = generateDateRange(startDate, days);
  const data = [];

  dates.forEach(date => {
    sites.forEach(siteName => {
      const criticalAlerts = randomInRange(0, 5);
      const warningAlerts = randomInRange(2, 15);
      const resolvedAlerts = randomInRange(criticalAlerts + warningAlerts - 5, criticalAlerts + warningAlerts + 10);

      data.push({
        date,
        siteName,
        criticalAlerts,
        warningAlerts,
        resolvedAlerts: Math.max(0, resolvedAlerts)
      });
    });
  });

  return data;
};

/**
 * Generate company-wide guest overview data
 */
export const generateCompanyGuestOverview = (startDate = '2025-01-01', days = 31) => {
  const sites = [
    { name: 'Mumbai Corporate Office', guestEnabled: true },
    { name: 'Hyderabad Tech Park', guestEnabled: true },
    { name: 'Urban Living - Bangalore', guestEnabled: true },
    { name: 'WorkHub - Pune', guestEnabled: true },
    { name: 'Grand Resort Goa', guestEnabled: true },
    { name: 'PG Residency - Chennai', guestEnabled: false },
    { name: 'Community Hub - Delhi', guestEnabled: true }
  ];
  const dates = generateDateRange(startDate, days);
  const data = [];

  dates.forEach(date => {
    sites.filter(s => s.guestEnabled).forEach(site => {
      const totalGuests = randomInRange(10, 80);
      const activeGuests = randomInRange(Math.floor(totalGuests * 0.3), Math.floor(totalGuests * 0.6));
      const checkedInToday = randomInRange(5, 25);
      const dataUsed = randomFloat(2, 30, 2);

      data.push({
        date,
        siteName: site.name,
        totalGuests,
        activeGuests,
        checkedInToday,
        dataUsed: `${dataUsed} GB`
      });
    });
  });

  return data;
};

/**
 * Generate guest traffic by site comparison data
 */
export const generateCompanyGuestComparison = (startMonth = '2025-01', months = 1) => {
  const sites = [
    { name: 'Mumbai Corporate Office', guestEnabled: true },
    { name: 'Hyderabad Tech Park', guestEnabled: true },
    { name: 'Urban Living - Bangalore', guestEnabled: true },
    { name: 'WorkHub - Pune', guestEnabled: true },
    { name: 'Grand Resort Goa', guestEnabled: true },
    { name: 'Community Hub - Delhi', guestEnabled: true }
  ];
  const guestTypes = ['Visitor', 'Contractor', 'Conference', 'VIP', 'Vendor'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const monthsArray = generateMonthRange(startMonth, months);
  const data = [];

  monthsArray.forEach(month => {
    sites.forEach(site => {
      const guestsThisMonth = randomInRange(80, 350);
      const avgDuration = randomFloat(1.5, 6, 1);
      const peakDay = weekDays[Math.floor(Math.random() * weekDays.length)];
      const topGuestType = guestTypes[Math.floor(Math.random() * guestTypes.length)];

      data.push({
        month,
        siteName: site.name,
        guestsThisMonth,
        avgDuration: `${avgDuration} hrs`,
        peakDay,
        topGuestType
      });
    });
  });

  return data;
};

export default {
  generateDateRange,
  generateMonthRange,
  randomInRange,
  randomFloat,
  trendingValue,
  generateDailyActiveUsers,
  generateMonthlyActiveUsers,
  generatePolicyWiseUsers,
  generateMonthlyDataUsage,
  generateNetworkUsage,
  generateUserSessions,
  generateUserDataConsumption,
  generateBandwidthUtilization,
  generateInternetUptime,
  generateSLACompliance,
  generateAlertsSummary,
  generateAuthenticationLogs,
  generateFailedAuthentication,
  generateAddonUsage,
  generateTopupHistory,
  generateEventList,
  generateAlarmList,
  generateAccessPointList,
  generateClientList,
  generateUserAPAnalytics,
  generateRogueAPList,
  // Guest report generators
  generateGuestAccessSummary,
  generateGuestActivityLog,
  generateGuestVoucherReport,
  generateGuestTypeBreakdown,
  generateGuestDataUsage,
  // Company-level report generators
  generateCompanyOverviewDashboard,
  generateCrossSiteUsageComparison,
  generateConsolidatedBillingReport,
  generateCompanyLicenseUtilization,
  generateCompanyUserDistribution,
  generateCompanyAlertsSummary,
  generateCompanyGuestOverview,
  generateCompanyGuestComparison
};
