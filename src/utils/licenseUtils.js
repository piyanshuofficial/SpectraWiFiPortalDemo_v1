// src/utils/licenseUtils.js

/**
 * License Management Utilities
 *
 * Handles license validation for both fixed bandwidth and user level sites.
 * - Fixed bandwidth sites: Only check overall site license limit
 * - User level sites: Check both overall limit AND per-policy license limit
 *
 * Digital Device License Rules:
 * - Smart/digital devices can only have max 1 device per user license
 * - Each digital device requires a device user to be created at backend
 * - Digital devices use digitalDevicePolicies (separate from user policies)
 * - If no digital device policy exists, registration is blocked
 */

import siteConfig from '../config/siteConfig';
import { sampleUsers, sampleDevices } from '../constants/userSampleData';

/**
 * Get current license usage for a site
 * @param {string} segment - The segment/site identifier
 * @returns {Object} - { totalUsed, totalLimit, policyUsage: { policyId: { used, limit } } }
 */
export const getLicenseUsage = (segment) => {
  const siteSettings = siteConfig.segmentSites[segment];
  if (!siteSettings) {
    return { totalUsed: 0, totalLimit: 0, policyUsage: {} };
  }

  // Count users in this segment
  const segmentUsers = sampleUsers.filter(user => user.segment === segment);
  const totalUsed = segmentUsers.length;
  const totalLimit = siteSettings.totalLicenseLimit || 0;

  // For userLevel sites, calculate per-policy usage
  const policyUsage = {};

  if (siteSettings.bandwidthType === 'userLevel' && siteSettings.userPolicies) {
    siteSettings.userPolicies.forEach(policy => {
      const usersWithPolicy = segmentUsers.filter(user => user.policyId === policy.policyId);
      policyUsage[policy.policyId] = {
        used: usersWithPolicy.length,
        limit: policy.licenseLimit || 0
      };
    });
  }

  return { totalUsed, totalLimit, policyUsage };
};

/**
 * Check if a license is available for a new user or policy change
 * @param {string} segment - The segment/site identifier
 * @param {string} policyId - The policy ID being assigned
 * @param {string} currentUserId - Current user ID (for edit mode, to exclude from count)
 * @param {string} currentPolicyId - Current policy ID of the user being edited
 * @returns {Object} - { available: boolean, error: string|null }
 */
export const checkLicenseAvailability = (segment, policyId, currentUserId = null, currentPolicyId = null) => {
  const siteSettings = siteConfig.segmentSites[segment];
  if (!siteSettings) {
    return { available: false, error: 'Site configuration not found.' };
  }

  // Get all users except the current user being edited
  const segmentUsers = sampleUsers.filter(user =>
    user.segment === segment && user.id !== currentUserId
  );

  const totalUsed = segmentUsers.length;
  const totalLimit = siteSettings.totalLicenseLimit || 0;

  // Check overall site license limit
  const isNewUser = !currentUserId;
  if (isNewUser && totalUsed >= totalLimit) {
    return {
      available: false,
      error: `Site license limit reached (${totalUsed}/${totalLimit}). Cannot add new users.`
    };
  }

  // For userLevel sites, also check policy-specific license limit
  if (siteSettings.bandwidthType === 'userLevel' && siteSettings.userPolicies) {
    const policyConfig = siteSettings.userPolicies.find(p => p.policyId === policyId);

    if (policyConfig) {
      // Count users with this policy (excluding current user if editing)
      const usersWithPolicy = segmentUsers.filter(user => user.policyId === policyId);
      const policyUsed = usersWithPolicy.length;
      const policyLimit = policyConfig.licenseLimit || 0;

      // For edit mode, only check if changing to a different policy
      const isChangingPolicy = currentPolicyId && currentPolicyId !== policyId;

      if ((isNewUser || isChangingPolicy) && policyUsed >= policyLimit) {
        return {
          available: false,
          error: `License limit for selected policy reached (${policyUsed}/${policyLimit}). Please select a different policy.`
        };
      }
    }
  }

  return { available: true, error: null };
};

/**
 * Get license summary for display
 * @param {string} segment - The segment/site identifier
 * @returns {Object} - { total: { used, limit, percentage }, policies: [] }
 */
export const getLicenseSummary = (segment) => {
  const usage = getLicenseUsage(segment);
  const siteSettings = siteConfig.segmentSites[segment];

  const totalPercentage = usage.totalLimit > 0
    ? Math.round((usage.totalUsed / usage.totalLimit) * 100)
    : 0;

  const policies = [];
  if (siteSettings?.bandwidthType === 'userLevel' && siteSettings.userPolicies) {
    siteSettings.userPolicies.forEach(policy => {
      const policyData = usage.policyUsage[policy.policyId] || { used: 0, limit: 0 };
      const percentage = policyData.limit > 0
        ? Math.round((policyData.used / policyData.limit) * 100)
        : 0;

      policies.push({
        policyId: policy.policyId,
        used: policyData.used,
        limit: policyData.limit,
        percentage,
        available: policyData.limit - policyData.used
      });
    });
  }

  return {
    total: {
      used: usage.totalUsed,
      limit: usage.totalLimit,
      percentage: totalPercentage,
      available: usage.totalLimit - usage.totalUsed
    },
    policies,
    isUserLevelSite: siteSettings?.bandwidthType === 'userLevel'
  };
};

// ============================================
// DIGITAL DEVICE LICENSE FUNCTIONS
// ============================================

/**
 * Check if digital device registration is available for a site
 * @param {string} segment - The segment/site identifier
 * @returns {Object} - { available: boolean, policies: [], error: string|null }
 */
export const getDigitalDevicePolicyAvailability = (segment) => {
  const siteSettings = siteConfig.segmentSites[segment];

  if (!siteSettings) {
    return {
      available: false,
      policies: [],
      error: 'Site configuration not found.'
    };
  }

  // Check if site has digital device policies configured
  const digitalPolicies = siteSettings.digitalDevicePolicies || [];

  if (digitalPolicies.length === 0) {
    return {
      available: false,
      policies: [],
      error: 'Smart/digital device registration is not available for this site. Please contact Spectra support team to request digital device licenses.'
    };
  }

  return {
    available: true,
    policies: digitalPolicies,
    error: null
  };
};

/**
 * Get digital device license usage for a site
 * Smart/digital devices: 1 device = 1 license (max 1 device per license)
 * @param {string} segment - The segment/site identifier
 * @returns {Object} - { policyUsage: { policyId: { used, limit, available } } }
 */
export const getDigitalDeviceLicenseUsage = (segment) => {
  const siteSettings = siteConfig.segmentSites[segment];
  if (!siteSettings) {
    return { policyUsage: {} };
  }

  const digitalPolicies = siteSettings.digitalDevicePolicies || [];
  if (digitalPolicies.length === 0) {
    return { policyUsage: {} };
  }

  // Count digital devices in this segment (type === 'digital')
  const segmentDigitalDevices = sampleDevices.filter(
    device => device.segment === segment && device.type === 'digital'
  );

  const policyUsage = {};

  digitalPolicies.forEach(policy => {
    const devicesWithPolicy = segmentDigitalDevices.filter(
      device => device.policyId === policy.policyId
    );
    const used = devicesWithPolicy.length;
    const limit = policy.licenseLimit || 0;

    policyUsage[policy.policyId] = {
      used,
      limit,
      available: Math.max(0, limit - used)
    };
  });

  return { policyUsage };
};

/**
 * Check if a digital device license is available
 * Rule: 1 license = 1 device (max 1 device per license)
 * @param {string} segment - The segment/site identifier
 * @param {string} policyId - The digital device policy ID
 * @param {string} currentDeviceId - Current device ID (for edit mode)
 * @returns {Object} - { available: boolean, error: string|null, policyInfo: Object }
 */
export const checkDigitalDeviceLicenseAvailability = (segment, policyId, currentDeviceId = null) => {
  // First check if digital device policies are available at all
  const policyAvailability = getDigitalDevicePolicyAvailability(segment);
  if (!policyAvailability.available) {
    return {
      available: false,
      error: policyAvailability.error,
      policyInfo: null
    };
  }

  const siteSettings = siteConfig.segmentSites[segment];
  const policyConfig = siteSettings.digitalDevicePolicies.find(p => p.policyId === policyId);

  if (!policyConfig) {
    return {
      available: false,
      error: 'Selected policy is not valid for this site.',
      policyInfo: null
    };
  }

  // Count digital devices with this policy (excluding current device if editing)
  const segmentDigitalDevices = sampleDevices.filter(
    device => device.segment === segment &&
              device.type === 'digital' &&
              device.policyId === policyId &&
              device.id !== currentDeviceId
  );

  const used = segmentDigitalDevices.length;
  const limit = policyConfig.licenseLimit || 0;

  // Check if license is available
  // For digital devices: 1 license = 1 device
  if (used >= limit) {
    return {
      available: false,
      error: `Digital device license limit reached for this policy (${used}/${limit}). Please contact Spectra support team to request additional licenses.`,
      policyInfo: { used, limit, available: 0 }
    };
  }

  return {
    available: true,
    error: null,
    policyInfo: { used, limit, available: limit - used }
  };
};

/**
 * Get digital device license summary for display
 * @param {string} segment - The segment/site identifier
 * @returns {Object} - { available: boolean, policies: [], error: string|null }
 */
export const getDigitalDeviceLicenseSummary = (segment) => {
  const availability = getDigitalDevicePolicyAvailability(segment);
  if (!availability.available) {
    return availability;
  }

  const usage = getDigitalDeviceLicenseUsage(segment);
  const policies = availability.policies.map(policy => {
    const policyData = usage.policyUsage[policy.policyId] || { used: 0, limit: 0, available: 0 };
    const percentage = policyData.limit > 0
      ? Math.round((policyData.used / policyData.limit) * 100)
      : 0;

    return {
      policyId: policy.policyId,
      used: policyData.used,
      limit: policyData.limit,
      available: policyData.available,
      percentage
    };
  });

  return {
    available: true,
    policies,
    error: null
  };
};

export default {
  getLicenseUsage,
  checkLicenseAvailability,
  getLicenseSummary,
  // Digital device functions
  getDigitalDevicePolicyAvailability,
  getDigitalDeviceLicenseUsage,
  checkDigitalDeviceLicenseAvailability,
  getDigitalDeviceLicenseSummary
};
