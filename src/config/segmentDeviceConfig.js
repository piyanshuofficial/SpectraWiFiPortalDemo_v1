// src/config/segmentDeviceConfig.js

const SEGMENT_DEVICE_AVAILABILITY = {
  enterprise: { allowHuman: true, allowNonHuman: true },
  coLiving: { allowHuman: false, allowNonHuman: true },
  coWorking: { allowHuman: false, allowNonHuman: true },
  hotel: { allowHuman: true, allowNonHuman: true },
  pg: { allowHuman: false, allowNonHuman: true },
  miscellaneous: { allowHuman: true, allowNonHuman: false }
};

export default SEGMENT_DEVICE_AVAILABILITY;
