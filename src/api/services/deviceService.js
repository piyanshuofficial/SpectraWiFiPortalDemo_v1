// src/api/services/deviceService.js
// Device API Service - Handles both mock data and real API calls

import apiClient from '../apiClient';
import { API_ENDPOINTS, API_FEATURES } from '../apiConfig';
import userSampleData from '../../constants/userSampleData';

/**
 * Device Service
 * When API_FEATURES.USE_REAL_DEVICES is true, uses real API
 * Otherwise, returns mock data for development
 */
const deviceService = {
  /**
   * Get all devices with optional filters
   */
  async getDevices(params = {}) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.DEVICES.LIST}?${queryString}`
        : API_ENDPOINTS.DEVICES.LIST;
      return apiClient.get(endpoint);
    }

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        const devices = userSampleData.devices || [];
        const users = userSampleData.users || [];

        // Enrich devices with owner info
        const enrichedDevices = devices.map(device => {
          const owner = users.find(user => user.id === device.userId);
          return {
            ...device,
            owner: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
            ownerSegment: owner?.segment || 'unknown'
          };
        });

        // Apply filters if provided
        let filteredDevices = enrichedDevices;

        if (params.segment) {
          const segmentUsers = users.filter(u => u.segment === params.segment);
          const segmentUserIds = new Set(segmentUsers.map(u => u.id));
          filteredDevices = filteredDevices.filter(d => segmentUserIds.has(d.userId));
        }

        resolve({
          data: {
            devices: filteredDevices,
            totalCount: filteredDevices.length,
            onlineCount: filteredDevices.filter(d => d.online).length,
            offlineCount: filteredDevices.filter(d => !d.online).length
          },
          status: 200
        });
      }, 300);
    });
  },

  /**
   * Get single device by ID
   */
  async getDevice(deviceId) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.get(API_ENDPOINTS.DEVICES.GET(deviceId));
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const device = (userSampleData.devices || []).find(d => d.id === deviceId);
        if (device) {
          resolve({ data: device, status: 200 });
        } else {
          reject({ status: 404, message: 'Device not found' });
        }
      }, 200);
    });
  },

  /**
   * Register new device
   */
  async createDevice(deviceData) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.post(API_ENDPOINTS.DEVICES.CREATE, deviceData);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const newDevice = {
          id: `dev_${Date.now()}`,
          ...deviceData,
          createdAt: new Date().toISOString(),
          online: true,
          blocked: false
        };
        resolve({ data: newDevice, status: 201 });
      }, 500);
    });
  },

  /**
   * Update device
   */
  async updateDevice(deviceId, deviceData) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.put(API_ENDPOINTS.DEVICES.UPDATE(deviceId), deviceData);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { id: deviceId, ...deviceData, updatedAt: new Date().toISOString() },
          status: 200
        });
      }, 500);
    });
  },

  /**
   * Delete device
   */
  async deleteDevice(deviceId) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.delete(API_ENDPOINTS.DEVICES.DELETE(deviceId));
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, deviceId }, status: 200 });
      }, 500);
    });
  },

  /**
   * Disconnect device from network
   */
  async disconnectDevice(deviceId) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.post(API_ENDPOINTS.DEVICES.DISCONNECT(deviceId));
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            deviceId,
            disconnectedAt: new Date().toISOString()
          },
          status: 200
        });
      }, 600);
    });
  },

  /**
   * Get device status updates (delta since last check)
   */
  async getStatusDelta(since) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.get(`${API_ENDPOINTS.DEVICES.STATUS_DELTA}?since=${since}`);
    }

    // Mock: No changes
    return new Promise((resolve) => {
      resolve({
        data: {
          changes: [],
          timestamp: new Date().toISOString()
        },
        status: 200
      });
    });
  },

  /**
   * Bulk import devices
   */
  async bulkImport(devices, type) {
    if (API_FEATURES.USE_REAL_DEVICES) {
      return apiClient.post(API_ENDPOINTS.DEVICES.BULK_IMPORT, { devices, type });
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const importedDevices = devices.map((device, index) => ({
          id: `bulk_${Date.now()}_${index}`,
          ...device,
          createdAt: new Date().toISOString()
        }));
        resolve({
          data: {
            success: true,
            importedCount: importedDevices.length,
            devices: importedDevices
          },
          status: 201
        });
      }, 1000);
    });
  }
};

export default deviceService;
