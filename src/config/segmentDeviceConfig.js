// src/config/segmentDeviceConfig.js

const SEGMENT_DEVICE_AVAILABILITY = {
  enterprise: {
    allowHuman: true,
    allowNonHuman: true,
    allowDeviceEdit: true  // Enable device name, type, MAC editing
  },
  coLiving: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: true  // Enable device editing
  },
  coWorking: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: true  // Enable device editing
  },
  hotel: {
    allowHuman: true,
    allowNonHuman: true,
    allowDeviceEdit: false  // Disable device editing
  },
  pg: {
    allowHuman: false,
    allowNonHuman: true,
    allowDeviceEdit: false  // Disable device editing
  },
  miscellaneous: {
    allowHuman: true,
    allowNonHuman: false,
    allowDeviceEdit: true  // Enable device editing
  }
};

export default SEGMENT_DEVICE_AVAILABILITY;
