// src/config/segmentDeviceConfig.js

const SEGMENT_DEVICE_AVAILABILITY = {
  enterprise: { allowHuman: true, allowNonHuman: true },
  coLiving: { allowHuman: false, allowNonHuman: true },
  coWorking: { allowHuman: true, allowNonHuman: false },
  hotel: { allowHuman: false, allowNonHuman: false },
  pg: { allowHuman: true, allowNonHuman: false },
  miscellaneous: { allowHuman: false, allowNonHuman: false }
};

export default SEGMENT_DEVICE_AVAILABILITY;
