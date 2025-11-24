// src/config/segmentDeviceConfig.js

const SEGMENT_DEVICE_AVAILABILITY = {
  enterprise: {
    allowHuman: true,
    allowNonHuman: true,
    allowDeviceEdit: true,  // Enable device name, type, MAC editing
    allowDeviceDelete: true  // Enable device deletion
  },
  coLiving: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true  // Enable device deletion
  },
  coWorking: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true  // Enable device deletion
  },
  hotel: {
    allowHuman: true,
    allowNonHuman: true,
    allowDeviceEdit: false,  // Disable device editing
    allowDeviceDelete: true  // Enable device deletion
  },
  pg: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: false,  // Disable device editing
    allowDeviceDelete: false  // Disable device deletion
  },
  miscellaneous: {
    allowHuman: true,
    allowNonHuman: false,
    allowDeviceEdit: true,  // Enable device editing
    allowDeviceDelete: true  // Enable device deletion
  }
};

export default SEGMENT_DEVICE_AVAILABILITY;
