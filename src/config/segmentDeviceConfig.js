// src/config/segmentDeviceConfig.js

// Available user device subtypes
const USER_DEVICE_SUBTYPES = [
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop" }
];

// Available smart/digital device subtypes by segment
const SMART_DIGITAL_SUBTYPES = {
  // Full list of all possible smart/digital device types
  all: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "sensor", label: "Sensor" },
    { value: "printer", label: "Printer" },
    { value: "iot", label: "IoT Device" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "gaming", label: "Gaming Console" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" },
    { value: "pos", label: "POS Terminal" },
    { value: "display", label: "Digital Display" },
    { value: "kiosk", label: "Kiosk" }
  ],
  // Enterprise: All device types available
  enterprise: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "sensor", label: "Sensor" },
    { value: "printer", label: "Printer" },
    { value: "iot", label: "IoT Device" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" },
    { value: "pos", label: "POS Terminal" },
    { value: "display", label: "Digital Display" },
    { value: "kiosk", label: "Kiosk" }
  ],
  // Office: Similar to enterprise
  office: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "printer", label: "Printer" },
    { value: "iot", label: "IoT Device" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" },
    { value: "display", label: "Digital Display" }
  ],
  // Co-Living: Security and building management focused
  coLiving: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "sensor", label: "Sensor" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" }
  ],
  // Co-Working: Office devices plus meeting room equipment
  coWorking: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "printer", label: "Printer" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "access_control", label: "Access Control" },
    { value: "display", label: "Digital Display" }
  ],
  // Hotel: Hospitality focused devices
  hotel: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" },
    { value: "pos", label: "POS Terminal" },
    { value: "display", label: "Digital Display" },
    { value: "kiosk", label: "Kiosk" }
  ],
  // PG: Basic security devices
  pg: [
    { value: "camera", label: "Camera" },
    { value: "cctv", label: "CCTV" },
    { value: "dvr", label: "DVR" },
    { value: "biometric", label: "Biometric" },
    { value: "access_control", label: "Access Control" },
    { value: "intercom", label: "Intercom" }
  ],
  // Miscellaneous: Minimal digital device support
  miscellaneous: []
};

const SEGMENT_DEVICE_AVAILABILITY = {
  enterprise: {
    allowUserDevices: true,
    allowDigitalDevices: true,
    allowDeviceEdit: true,  // Enable device name, type, MAC editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: true,
    // Available device subtypes
    userDeviceSubtypes: USER_DEVICE_SUBTYPES,
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.enterprise
  },
  office: {
    allowUserDevices: true,
    allowDigitalDevices: true,
    allowDeviceEdit: true,  // Enable device name, type, MAC editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: false,  // Mobile number non-editable for Office
    // Available device subtypes
    userDeviceSubtypes: USER_DEVICE_SUBTYPES,
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.office
  },
  coLiving: {
    allowUserDevices: false,
    allowDigitalDevices: true,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: true,
    // Available device subtypes
    userDeviceSubtypes: [],
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.coLiving
  },
  coWorking: {
    allowUserDevices: false,
    allowDigitalDevices: true,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: true,
    // Available device subtypes
    userDeviceSubtypes: [],
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.coWorking
  },
  hotel: {
    allowUserDevices: true,
    allowDigitalDevices: true,
    allowDeviceEdit: false,  // Disable device editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: true,
    // Available device subtypes
    userDeviceSubtypes: USER_DEVICE_SUBTYPES,
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.hotel
  },
  pg: {
    allowUserDevices: false,
    allowDigitalDevices: true,
    allowDeviceEdit: false,  // Disable device editing
    allowDeviceDelete: false,  // Disable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: false,  // Mobile number non-editable for PG
    // Available device subtypes
    userDeviceSubtypes: [],
    smartDigitalSubtypes: SMART_DIGITAL_SUBTYPES.pg
  },
  miscellaneous: {
    allowUserDevices: true,
    allowDigitalDevices: false,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true,  // Enable device deletion
    // User field editability
    allowEmailEdit: true,
    allowMobileEdit: true,
    // Available device subtypes
    userDeviceSubtypes: USER_DEVICE_SUBTYPES,
    smartDigitalSubtypes: []
  }
};

// Export helper to get all smart/digital subtypes
export const getAllSmartDigitalSubtypes = () => SMART_DIGITAL_SUBTYPES.all;
export const getUserDeviceSubtypes = () => USER_DEVICE_SUBTYPES;

export default SEGMENT_DEVICE_AVAILABILITY;
