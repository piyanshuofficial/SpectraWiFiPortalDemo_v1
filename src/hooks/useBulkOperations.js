// src/hooks/useBulkOperations.js

import { useMemo } from 'react';
import { useSegment } from '../context/SegmentContext';
import { getBulkOperationsConfig, isBulkOperationEnabled } from '../config/bulkOperationsConfig';

/**
 * Custom hook to access bulk operations configuration for the current segment
 *
 * Returns segment-specific bulk operations settings and helper functions
 *
 * @returns {Object} Bulk operations configuration and utilities
 */
export const useBulkOperations = () => {
  const { currentSegment } = useSegment();

  const bulkConfig = useMemo(() => {
    return getBulkOperationsConfig(currentSegment);
  }, [currentSegment]);

  const canBulkAddUsers = useMemo(() => {
    return isBulkOperationEnabled(currentSegment, 'bulkAddUsers');
  }, [currentSegment]);

  const canBulkAddHumanDevices = useMemo(() => {
    return isBulkOperationEnabled(currentSegment, 'bulkAddHumanDevices');
  }, [currentSegment]);

  const canBulkAddOtherDevices = useMemo(() => {
    return isBulkOperationEnabled(currentSegment, 'bulkAddOtherDevices');
  }, [currentSegment]);

  const allowExcelPaste = useMemo(() => {
    return bulkConfig.allowExcelPaste === true;
  }, [bulkConfig]);

  return {
    // Configuration
    bulkConfig,
    currentSegment,

    // Feature flags
    canBulkAddUsers,
    canBulkAddHumanDevices,
    canBulkAddOtherDevices,
    allowExcelPaste,

    // Limits
    maxBulkUsers: bulkConfig.maxBulkUsers,
    maxBulkDevices: bulkConfig.maxBulkDevices,
    requireApproval: bulkConfig.requireApproval,

    // Helper functions
    isBulkOperationEnabled: (operation) => isBulkOperationEnabled(currentSegment, operation)
  };
};

export default useBulkOperations;
