// src/config/policyConfig.js

/**
 * Policy Configuration System
 *
 * This module defines the allowed speed, data volume, and device count options
 * based on data cycle type (Daily/Monthly). Policy IDs follow a strict naming
 * format that combines segment, connection type, speed, data volume, and device count.
 *
 * Policy ID Format:
 * {SEGMENT}_WIFI_{SPEED}_{DATA}_{DEVICES}Devices
 *
 * Example: ENT_WIFI_50Mbps_Unlimited_3Devices
 *
 * The policy ID is NEVER exposed to frontend users. Users only see and select:
 * - Speed (e.g., "Upto 50 Mbps")
 * - Data Volume (e.g., "Unlimited")
 * - Device Limit (e.g., "3")
 */

// ============================================
// SPEED OPTIONS
// ============================================

export const SPEED_OPTIONS_MONTHLY = [
  "Upto 5 Mbps",
  "Upto 10 Mbps",
  "Upto 15 Mbps",
  "Upto 20 Mbps",
  "Upto 25 Mbps",
  "Upto 30 Mbps",
  "Upto 40 Mbps",
  "Upto 50 Mbps",
  "Upto 75 Mbps",
  "Upto 100 Mbps",
  "Upto 125 Mbps",
  "Upto 150 Mbps",
  "Upto 200 Mbps",
  "Unlimited"
];

export const SPEED_OPTIONS_DAILY = [
  "Upto 5 Mbps",
  "Upto 10 Mbps",
  "Upto 15 Mbps",
  "Upto 20 Mbps",
  "Upto 25 Mbps",
  "Upto 30 Mbps",
  "Upto 40 Mbps",
  "Upto 50 Mbps",
  "Upto 75 Mbps",
  "Unlimited"
];

// ============================================
// DATA VOLUME OPTIONS
// ============================================

export const DATA_OPTIONS_MONTHLY = [
  "10 GB",
  "25 GB",
  "50 GB",
  "75 GB",
  "100 GB",
  "105 GB",
  "125 GB",
  "150 GB",
  "200 GB",
  "250 GB",
  "300 GB",
  "400 GB",
  "500 GB",
  "750 GB",
  "1 TB",
  "Unlimited"
];

export const DATA_OPTIONS_DAILY = [
  "0.5 GB",
  "1 GB",
  "2 GB",
  "3 GB",
  "4 GB",
  "5 GB",
  "10 GB",
  "Unlimited"
];

// ============================================
// DEVICE COUNT OPTIONS
// ============================================

export const DEVICE_COUNT_OPTIONS = ["1", "2", "3", "4", "5"];

// ============================================
// SEGMENT PREFIXES
// ============================================

export const SEGMENT_PREFIXES = {
  enterprise: "ENT",
  office: "OFF",
  coLiving: "COL",
  coWorking: "COW",
  hotel: "HTL",
  pg: "PG",
  miscellaneous: "MIS"
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get speed options based on data cycle type
 * @param {string} dataCycleType - "Daily" or "Monthly"
 * @returns {Array<string>} Array of speed options
 */
export const getSpeedOptions = (dataCycleType) => {
  return dataCycleType === "Daily" ? SPEED_OPTIONS_DAILY : SPEED_OPTIONS_MONTHLY;
};

/**
 * Get data volume options based on data cycle type
 * @param {string} dataCycleType - "Daily" or "Monthly"
 * @returns {Array<string>} Array of data volume options
 */
export const getDataOptions = (dataCycleType) => {
  return dataCycleType === "Daily" ? DATA_OPTIONS_DAILY : DATA_OPTIONS_MONTHLY;
};

/**
 * Get device count options (same for all cycle types)
 * @returns {Array<string>} Array of device count options
 */
export const getDeviceOptions = () => {
  return DEVICE_COUNT_OPTIONS;
};

/**
 * Convert user-friendly values to policy ID format components
 * @param {string} speed - e.g., "Upto 50 Mbps" or "Unlimited"
 * @param {string} dataVolume - e.g., "100 GB" or "Unlimited"
 * @param {string} deviceCount - e.g., "3"
 * @returns {Object} - {speedPart, dataPart, devicePart}
 */
export const convertToPolicyComponents = (speed, dataVolume, deviceCount) => {
  // Convert speed: "Upto 50 Mbps" -> "50Mbps", "Unlimited" -> "Unlimited"
  let speedPart;
  if (speed === "Unlimited") {
    speedPart = "Unlimited";
  } else {
    const match = speed.match(/(\d+)\s*Mbps/);
    speedPart = match ? `${match[1]}Mbps` : "UnknownSpeed";
  }

  // Convert data: "100 GB" -> "100GB", "1 TB" -> "1TB", "Unlimited" -> "Unlimited"
  let dataPart;
  if (dataVolume === "Unlimited") {
    dataPart = "Unlimited";
  } else {
    // Remove spaces: "100 GB" -> "100GB"
    dataPart = dataVolume.replace(/\s+/g, "");
  }

  // Device count: "3" -> "3Devices"
  const devicePart = `${deviceCount}Devices`;

  return { speedPart, dataPart, devicePart };
};

/**
 * Generate policy ID from user-friendly values
 * @param {string} segment - e.g., "enterprise", "coLiving"
 * @param {string} speed - e.g., "Upto 50 Mbps"
 * @param {string} dataVolume - e.g., "100 GB"
 * @param {string} deviceCount - e.g., "3"
 * @param {string} dataCycleType - "Daily" or "Monthly" (optional, for validation)
 * @returns {string} - Policy ID e.g., "ENT_WIFI_50Mbps_100GB_3Devices"
 */
export const generatePolicyId = (segment, speed, dataVolume, deviceCount, dataCycleType = "") => {
  const segmentPrefix = SEGMENT_PREFIXES[segment] || "UNK";
  const { speedPart, dataPart, devicePart } = convertToPolicyComponents(speed, dataVolume, deviceCount);

  // Optional: Add cycle type suffix for Daily policies
  // const cycleSuffix = dataCycleType === "Daily" ? "_Daily" : "";
  // return `${segmentPrefix}_WIFI_${speedPart}_${dataPart}_${devicePart}${cycleSuffix}`;

  return `${segmentPrefix}_WIFI_${speedPart}_${dataPart}_${devicePart}`;
};

/**
 * Parse policy ID to extract user-friendly values
 * @param {string} policyId - e.g., "ENT_WIFI_50Mbps_100GB_3Devices"
 * @returns {Object} - {speed, dataVolume, deviceLimit} in user-friendly format
 */
export const parsePolicyId = (policyId) => {
  if (!policyId) {
    return { speed: "", dataVolume: "", deviceLimit: "" };
  }

  // Pattern: SEGMENT_WIFI_SPEED_DATA_DEVICES
  const parts = policyId.split("_");

  if (parts.length < 5) {
    console.warn(`Invalid policy ID format: ${policyId}`);
    return { speed: "", dataVolume: "", deviceLimit: "" };
  }

  // Extract speed (index 2): "50Mbps" -> "Upto 50 Mbps"
  const speedPart = parts[2];
  let speed;
  if (speedPart === "Unlimited") {
    speed = "Unlimited";
  } else {
    const match = speedPart.match(/(\d+)Mbps/);
    speed = match ? `Upto ${match[1]} Mbps` : speedPart;
  }

  // Extract data (index 3): "100GB" -> "100 GB", "1TB" -> "1 TB"
  const dataPart = parts[3];
  let dataVolume;
  if (dataPart === "Unlimited") {
    dataVolume = "Unlimited";
  } else {
    // Insert space before unit: "100GB" -> "100 GB"
    dataVolume = dataPart.replace(/(\d+(?:\.\d+)?)(GB|TB)/, "$1 $2");
  }

  // Extract device count (index 4): "3Devices" -> "3"
  const devicePart = parts[4];
  const deviceMatch = devicePart.match(/(\d+)Devices?/);
  const deviceLimit = deviceMatch ? deviceMatch[1] : "";

  return { speed, dataVolume, deviceLimit };
};

/**
 * Get available speed/data/device combinations from site policies
 * This filters the global options to show only what's available for the site
 * @param {Array<Object>} sitePolicies - Array of policy objects with policyId
 * @param {string} dataCycleType - "Daily" or "Monthly"
 * @returns {Object} - {speeds: [], dataVolumes: [], deviceCounts: []}
 */
export const getAvailableOptionsFromPolicies = (sitePolicies, dataCycleType) => {
  if (!sitePolicies || sitePolicies.length === 0) {
    // Fallback to all options if no policies defined
    return {
      speeds: getSpeedOptions(dataCycleType),
      dataVolumes: getDataOptions(dataCycleType),
      deviceCounts: getDeviceOptions()
    };
  }

  const speeds = new Set();
  const dataVolumes = new Set();
  const deviceCounts = new Set();

  sitePolicies.forEach(policy => {
    const parsed = parsePolicyId(policy.policyId);
    if (parsed.speed) speeds.add(parsed.speed);
    if (parsed.dataVolume) dataVolumes.add(parsed.dataVolume);
    if (parsed.deviceLimit) deviceCounts.add(parsed.deviceLimit);
  });

  // Convert Sets to Arrays and sort
  const speedOptions = getSpeedOptions(dataCycleType);
  const dataOptions = getDataOptions(dataCycleType);
  const deviceOptions = getDeviceOptions();

  return {
    speeds: speedOptions.filter(s => speeds.has(s)),
    dataVolumes: dataOptions.filter(d => dataVolumes.has(d)),
    deviceCounts: deviceOptions.filter(dc => deviceCounts.has(dc))
  };
};

/**
 * Validate if a policy combination exists in site policies
 * @param {Array<Object>} sitePolicies - Array of policy objects
 * @param {string} speed - User-friendly speed
 * @param {string} dataVolume - User-friendly data volume
 * @param {string} deviceCount - Device count string
 * @param {string} segment - Segment name
 * @returns {string|null} - Policy ID if found, null otherwise
 */
export const findPolicyId = (sitePolicies, speed, dataVolume, deviceCount, segment) => {
  const expectedPolicyId = generatePolicyId(segment, speed, dataVolume, deviceCount);
  const policy = sitePolicies.find(p => p.policyId === expectedPolicyId);
  return policy ? policy.policyId : null;
};

/**
 * Get speed options filtered by maximum bandwidth limit (for fixed bandwidth sites)
 * @param {string} dataCycleType - "Daily" or "Monthly"
 * @param {number} maxBandwidth - Maximum allowed bandwidth in Mbps
 * @returns {Array<string>} Array of speed options <= maxBandwidth
 */
export const getSpeedOptionsWithMaxBandwidth = (dataCycleType, maxBandwidth) => {
  const allSpeeds = getSpeedOptions(dataCycleType);

  return allSpeeds.filter(speed => {
    if (speed === "Unlimited") return true; // Unlimited is always allowed
    const match = speed.match(/(\d+)\s*Mbps/);
    if (match) {
      const speedValue = parseInt(match[1], 10);
      return speedValue <= maxBandwidth;
    }
    return true;
  });
};

/**
 * Get valid combinations for selected values
 * When user selects speed, this returns valid data/device combinations
 * @param {Array<Object>} sitePolicies - Array of policy objects
 * @param {Object} selectedValues - {speed, dataVolume, deviceCount}
 * @param {string} dataCycleType - "Daily" or "Monthly"
 * @returns {Object} - {speeds: [], dataVolumes: [], deviceCounts: []}
 */
export const getValidCombinations = (sitePolicies, selectedValues, dataCycleType) => {
  if (!sitePolicies || sitePolicies.length === 0) {
    return getAvailableOptionsFromPolicies([], dataCycleType);
  }

  const { speed, dataVolume, deviceCount } = selectedValues;

  const speeds = new Set();
  const dataVolumes = new Set();
  const deviceCounts = new Set();

  sitePolicies.forEach(policy => {
    const parsed = parsePolicyId(policy.policyId);

    // If speed is selected, only show data/device options that work with that speed
    if (speed && parsed.speed === speed) {
      dataVolumes.add(parsed.dataVolume);
      deviceCounts.add(parsed.deviceLimit);
    }

    // If data is selected, only show speed/device options that work with that data
    if (dataVolume && parsed.dataVolume === dataVolume) {
      speeds.add(parsed.speed);
      deviceCounts.add(parsed.deviceLimit);
    }

    // If device count is selected, only show speed/data options that work with that count
    if (deviceCount && parsed.deviceLimit === deviceCount) {
      speeds.add(parsed.speed);
      dataVolumes.add(parsed.dataVolume);
    }

    // If nothing selected, show all
    if (!speed && !dataVolume && !deviceCount) {
      speeds.add(parsed.speed);
      dataVolumes.add(parsed.dataVolume);
      deviceCounts.add(parsed.deviceLimit);
    }
  });

  const speedOptions = getSpeedOptions(dataCycleType);
  const dataOptions = getDataOptions(dataCycleType);
  const deviceOptions = getDeviceOptions();

  return {
    speeds: speedOptions.filter(s => speeds.has(s)),
    dataVolumes: dataOptions.filter(d => dataVolumes.has(d)),
    deviceCounts: deviceOptions.filter(dc => deviceCounts.has(dc))
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  SPEED_OPTIONS_MONTHLY,
  SPEED_OPTIONS_DAILY,
  DATA_OPTIONS_MONTHLY,
  DATA_OPTIONS_DAILY,
  DEVICE_COUNT_OPTIONS,
  SEGMENT_PREFIXES,
  getSpeedOptions,
  getDataOptions,
  getDeviceOptions,
  getSpeedOptionsWithMaxBandwidth,
  generatePolicyId,
  parsePolicyId,
  getAvailableOptionsFromPolicies,
  findPolicyId,
  getValidCombinations
};
