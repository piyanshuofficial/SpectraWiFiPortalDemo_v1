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
  generateRogueAPList
};
