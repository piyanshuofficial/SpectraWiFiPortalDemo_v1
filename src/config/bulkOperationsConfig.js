// src/config/bulkOperationsConfig.js

/**
 * Segment-specific bulk operations configuration
 *
 * This configuration controls which bulk operations are available for each segment.
 * To enable/disable bulk operations for a segment, simply change the boolean values.
 */

const BULK_OPERATIONS_CONFIG = {
  // Enterprise segment
  enterprise: {
    bulkAddUsers: true,
    bulkAddUserDevices: true,
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 1000,          // Maximum users per bulk upload
    maxBulkDevices: 2000,        // Maximum devices per bulk upload
    allowExcelPaste: true,        // Allow direct paste from Excel
    requireApproval: false        // Whether bulk operations need approval
  },

  // Office segment
  office: {
    bulkAddUsers: true,
    bulkAddUserDevices: true,
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 800,           // Maximum users per bulk upload
    maxBulkDevices: 1500,        // Maximum devices per bulk upload
    allowExcelPaste: true,        // Allow direct paste from Excel
    requireApproval: false        // Whether bulk operations need approval
  },

  // Co-Living segment
  coLiving: {
    bulkAddUsers: true,
    bulkAddUserDevices: false,   // User devices not available in co-living
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 500,
    maxBulkDevices: 1000,
    allowExcelPaste: true,
    requireApproval: false
  },

  // Hotel segment
  hotel: {
    bulkAddUsers: true,
    bulkAddUserDevices: true,
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 2000,           // Hotels may have many guests
    maxBulkDevices: 3000,
    allowExcelPaste: true,
    requireApproval: false
  },

  // Coworking segment
  coWorking: {
    bulkAddUsers: true,
    bulkAddUserDevices: false,   // User devices not available in coworking
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 800,
    maxBulkDevices: 1500,
    allowExcelPaste: true,
    requireApproval: false
  },

  // PG (Paying Guest) segment
  pg: {
    bulkAddUsers: true,
    bulkAddUserDevices: false,   // User devices not available in PG
    bulkAddSmartDigitalDevices: true,
    maxBulkUsers: 300,
    maxBulkDevices: 600,
    allowExcelPaste: true,
    requireApproval: false
  },

  // Miscellaneous segment
  miscellaneous: {
    bulkAddUsers: true,
    bulkAddUserDevices: true,
    bulkAddSmartDigitalDevices: false,   // Smart/Digital devices not available in miscellaneous
    maxBulkUsers: 500,
    maxBulkDevices: 1000,
    allowExcelPaste: true,
    requireApproval: false
  }
};

/**
 * CSV Template headers for different bulk operations
 */
export const CSV_TEMPLATES = {
  users: {
    headers: [
      'username',
      'email',
      'fullName',
      'phone',
      'policy',
      'status',
      'segment',
      'department',
      'notes'
    ],
    requiredFields: ['username', 'email', 'fullName', 'policy'],
    sampleData: [
      {
        username: 'john.doe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        phone: '+1234567890',
        policy: 'Standard Access',
        status: 'active',
        segment: 'Enterprise',
        department: 'IT',
        notes: 'New employee'
      },
      {
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        phone: '+1234567891',
        policy: 'Premium Access',
        status: 'active',
        segment: 'Enterprise',
        department: 'Marketing',
        notes: 'Department head'
      }
    ]
  },

  userDevices: {
    headers: [
      'assignedUserId',
      'fullName',
      'email',
      'phone',
      'deviceType',
      'priority',
      'notes'
    ],
    requiredFields: ['assignedUserId', 'fullName', 'deviceType'],
    sampleData: [
      {
        assignedUserId: 'john.doe',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        deviceType: 'laptop',
        priority: 'high',
        notes: 'Company issued laptop'
      },
      {
        assignedUserId: 'jane.smith',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        deviceType: 'mobile',
        priority: 'medium',
        notes: 'Personal device'
      }
    ]
  },

  smartDigitalDevices: {
    headers: [
      'deviceName',
      'macAddress',
      'deviceType',
      'manufacturer',
      'location',
      'assignedTo',
      'status',
      'notes'
    ],
    requiredFields: ['deviceName', 'macAddress', 'deviceType'],
    sampleData: [
      {
        deviceName: 'IoT-Sensor-001',
        macAddress: '00:1A:2B:3C:4D:5E',
        deviceType: 'iot',
        manufacturer: 'SensorTech',
        location: 'Floor 1, Zone A',
        assignedTo: 'facilities',
        status: 'active',
        notes: 'Temperature sensor'
      },
      {
        deviceName: 'Printer-HP-202',
        macAddress: '00:1A:2B:3C:4D:5F',
        deviceType: 'printer',
        manufacturer: 'HP',
        location: 'Floor 2, Office 204',
        assignedTo: 'IT',
        status: 'active',
        notes: 'Network printer'
      }
    ]
  },

  // Internal Portal - Bulk Status Change
  bulkStatusChange: {
    headers: ['userId', 'action', 'reason'],
    requiredFields: ['userId', 'action'],
    sampleData: [
      {
        userId: 'USER001',
        action: 'activate',
        reason: 'Account verified'
      },
      {
        userId: 'USER002',
        action: 'suspend',
        reason: 'Pending verification'
      }
    ]
  },

  // Internal Portal - Bulk Policy Change
  bulkPolicyChange: {
    headers: ['userId', 'newPolicyId', 'reason'],
    requiredFields: ['userId', 'newPolicyId'],
    sampleData: [
      {
        userId: 'USER001',
        newPolicyId: 'POLICY_PREMIUM',
        reason: 'Upgrade requested'
      },
      {
        userId: 'USER002',
        newPolicyId: 'POLICY_BASIC',
        reason: 'Downgrade'
      }
    ]
  },

  // Internal Portal - Bulk Device Rename
  bulkDeviceRename: {
    headers: ['deviceId', 'newName'],
    requiredFields: ['deviceId', 'newName'],
    sampleData: [
      {
        deviceId: 'DEV001',
        newName: 'Floor1-TempSensor-A'
      },
      {
        deviceId: 'DEV002',
        newName: 'Office2-Printer-Main'
      }
    ]
  },

  // Internal Portal - Bulk User Registration
  bulkUserRegistration: {
    headers: ['userId', 'name', 'email', 'mobile', 'policyId', 'maxDevices'],
    requiredFields: ['userId', 'name', 'email'],
    sampleData: [
      {
        userId: 'USER001',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        policyId: 'POLICY_BASIC',
        maxDevices: '3'
      },
      {
        userId: 'USER002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '9876543211',
        policyId: 'POLICY_PREMIUM',
        maxDevices: '5'
      }
    ]
  },

  // Internal Portal - Bulk Device Registration
  bulkDeviceRegistration: {
    headers: ['userId', 'deviceName', 'macAddress', 'category', 'description'],
    requiredFields: ['userId', 'deviceName', 'macAddress'],
    sampleData: [
      {
        userId: 'USER001',
        deviceName: 'Johns-Laptop',
        macAddress: 'AA:BB:CC:DD:EE:01',
        category: 'Human',
        description: 'Work laptop'
      },
      {
        userId: 'USER002',
        deviceName: 'Smart-TV',
        macAddress: 'AA:BB:CC:DD:EE:02',
        category: 'Other',
        description: 'Living room TV'
      }
    ]
  }
};

/**
 * Validation rules for bulk operations
 */
export const VALIDATION_RULES = {
  users: {
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9._-]+$/,
      errorMessage: 'Username must be 3-50 characters and contain only letters, numbers, dots, underscores, and hyphens'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Invalid email format'
    },
    phone: {
      pattern: /^\+?[1-9]\d{1,14}$/,
      errorMessage: 'Invalid phone number format (use E.164 format)'
    },
    policy: {
      enum: ['Standard Access', 'Premium Access', 'Basic Access', 'Guest Access'],
      errorMessage: 'Invalid policy. Must be one of: Standard Access, Premium Access, Basic Access, Guest Access'
    },
    status: {
      enum: ['active', 'inactive', 'suspended'],
      errorMessage: 'Invalid status. Must be: active, inactive, or suspended'
    }
  },

  userDevices: {
    deviceType: {
      enum: ['laptop', 'mobile', 'tablet'],
      errorMessage: 'Invalid device type. Must be: laptop, mobile, or tablet'
    },
    priority: {
      enum: ['high', 'medium', 'low'],
      errorMessage: 'Invalid priority. Must be: high, medium, or low'
    }
  },

  smartDigitalDevices: {
    macAddress: {
      pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      errorMessage: 'Invalid MAC address format (use format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)'
    },
    deviceType: {
      enum: ['iot', 'printer', 'camera', 'sensor', 'access-point', 'other'],
      errorMessage: 'Invalid device type. Must be: iot, printer, camera, sensor, access-point, or other'
    },
    status: {
      enum: ['active', 'inactive', 'maintenance'],
      errorMessage: 'Invalid status. Must be: active, inactive, or maintenance'
    }
  },

  // Internal Portal - Bulk Status Change validation
  bulkStatusChange: {
    userId: {
      minLength: 1,
      errorMessage: 'User ID is required'
    },
    action: {
      enum: ['activate', 'suspend', 'block'],
      errorMessage: 'Invalid action. Must be: activate, suspend, or block'
    }
  },

  // Internal Portal - Bulk Policy Change validation
  bulkPolicyChange: {
    userId: {
      minLength: 1,
      errorMessage: 'User ID is required'
    },
    newPolicyId: {
      minLength: 1,
      errorMessage: 'New policy ID is required'
    }
  },

  // Internal Portal - Bulk Device Rename validation
  bulkDeviceRename: {
    deviceId: {
      minLength: 1,
      errorMessage: 'Device ID is required'
    },
    newName: {
      minLength: 1,
      maxLength: 100,
      errorMessage: 'Device name must be 1-100 characters'
    }
  },

  // Internal Portal - Bulk User Registration validation
  bulkUserRegistration: {
    userId: {
      minLength: 1,
      maxLength: 50,
      errorMessage: 'User ID must be 1-50 characters'
    },
    name: {
      minLength: 1,
      maxLength: 100,
      errorMessage: 'Name must be 1-100 characters'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Invalid email format'
    },
    mobile: {
      pattern: /^\d{10}$/,
      errorMessage: 'Invalid mobile number (10 digits required)'
    }
  },

  // Internal Portal - Bulk Device Registration validation
  bulkDeviceRegistration: {
    macAddress: {
      pattern: /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/,
      errorMessage: 'Invalid MAC address format (use format: AA:BB:CC:DD:EE:FF)'
    },
    category: {
      enum: ['Human', 'Other'],
      errorMessage: 'Invalid category. Must be: Human or Other'
    }
  }
};

/**
 * Helper function to get bulk operations config for a segment
 */
export const getBulkOperationsConfig = (segment) => {
  return BULK_OPERATIONS_CONFIG[segment] || BULK_OPERATIONS_CONFIG.enterprise;
};

/**
 * Helper function to check if a specific bulk operation is enabled for a segment
 */
export const isBulkOperationEnabled = (segment, operation) => {
  const config = getBulkOperationsConfig(segment);
  return config[operation] === true;
};

export default BULK_OPERATIONS_CONFIG;
