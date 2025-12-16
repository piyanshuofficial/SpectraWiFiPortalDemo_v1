// src/utils/exportUtils.js

import Papa from 'papaparse';
import { formatAuthConfigForExport } from '@constants/siteProvisioningConfig';

/**
 * Unified CSV export function for table or chart data
 * Works with centralized data from userSampleData and siteSampleData
 * @param {object} data - Data to export (headers/rows or labels/datasets)
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const exportChartDataToCSV = async (data, filename = 'chart-data.csv') => {
  // ========================================
  // TODO: Backend Integration - Large Dataset Export
  // ========================================
  // Current Implementation: Client-side CSV generation
  // Works well for small datasets (<1000 rows)
  // 
  // For large datasets (>1000 rows), implement server-side export:
  // 
  // const exportLargeDataset = async (exportConfig) => {
  //   try {
  //     const response = await fetch('/api/export/generate', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         dataType: exportConfig.type, // 'users', 'devices', 'reports'
  //         format: 'csv',
  //         filters: exportConfig.filters,
  //         columns: exportConfig.columns,
  //         sortBy: exportConfig.sortBy,
  //         sortOrder: exportConfig.sortOrder,
  //         siteId: exportConfig.siteId
  //       })
  //     });
  //     
  //     if (response.ok) {
  //       const result = await response.json();
  //       // Backend returns download URL
  //       window.open(result.data.downloadUrl, '_blank');
  //       // File expires after 1 hour
  //     } else {
  //       throw new Error('Export generation failed');
  //     }
  //   } catch (error) {
  //     console.error('Export error:', error);
  //     throw error;
  //   }
  // };
  // 
  // Backend Processing:
  // 1. Validate export request and permissions
  // 2. Query database with filters and pagination
  // 3. Stream data to CSV file (avoid memory issues)
  // 4. Store file in temporary storage (S3/local)
  // 5. Generate signed URL with expiration
  // 6. Schedule cleanup job (delete after 1 hour)
  // 7. Create audit log entry
  // 
  // Response Format:
  // {
  //   success: true,
  //   data: {
  //     downloadUrl: string,
  //     expiresAt: ISO8601,
  //     fileSize: string,
  //     recordCount: number
  //   }
  // }
  // 
  // Benefits:
  // - Handle millions of records
  // - Reduced client memory usage
  // - Faster processing
  // - Progress tracking for large exports
  // - Background processing for huge datasets
  // ========================================

  return new Promise((resolve, reject) => {
    try {
      let csv = '';

      if (data.headers && data.rows) {
        csv = Papa.unparse({
          fields: data.headers,
          data: data.rows,
        });
      } else if (data.labels && data.datasets) {
        const csvData = data.labels.map((label, i) => {
          const row = [label];
          data.datasets.forEach(dataset => row.push(dataset.data[i]));
          return row;
        });
        csv = Papa.unparse({
          fields: ['Label', ...data.datasets.map(ds => ds.label)],
          data: csvData,
        });
      } else {
        reject(new Error('Invalid data format for CSV export'));
        return;
      }

      // ========================================
      // TODO: Backend Integration - Export Audit Logging
      // ========================================
      // Log export action for compliance and security
      // 
      // After successful export, send audit log:
      // fetch('/api/audit/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     action: 'csv_export',
      //     filename: filename,
      //     recordCount: data.rows ? data.rows.length : data.labels.length,
      //     dataType: data.type || 'unknown',
      //     userId: currentUser.id,
      //     timestamp: new Date().toISOString(),
      //     ipAddress: userIpAddress
      //   })
      // }).catch(err => console.error('Audit log failed:', err));
      // 
      // Backend should:
      // 1. Create audit trail entry
      // 2. Track export frequency per user
      // 3. Alert on suspicious patterns (mass exports)
      // 4. Maintain compliance report
      // 5. Check for data exfiltration attempts
      // ========================================

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export site data to CSV with authentication configuration support
 * Exports site information including auth config in both IDs and labels format
 * @param {Array} sites - Array of site objects to export
 * @param {string} filename - Output filename
 * @param {Object} options - Export options
 * @param {boolean} options.includeAuthConfig - Whether to include auth config (default: true)
 * @param {string} options.authConfigFormat - 'both', 'ids', or 'labels' (default: 'both')
 * @returns {Promise<void>}
 */
export const exportSiteDataToCSV = async (sites, filename = 'sites-export.csv', options = {}) => {
  const { includeAuthConfig = true, authConfigFormat = 'both' } = options;

  return new Promise((resolve, reject) => {
    try {
      // Define base headers
      const baseHeaders = [
        'Site ID',
        'Site Name',
        'Customer',
        'Segment',
        'Status',
        'City',
        'State',
        'Address',
        'Licensed Users',
        'Bandwidth (Mbps)',
        'Total APs',
        'Live APs',
        'Total Switches',
        'Live Switches',
        'Uptime %',
        'Contact Name',
        'Contact Email',
        'Contact Phone',
        'Created Date',
        'Last Updated'
      ];

      // Add auth config headers if enabled
      let authConfigHeaders = [];
      if (includeAuthConfig) {
        // We'll dynamically add auth config columns based on the data
        authConfigHeaders = ['Authentication Methods Summary'];
      }

      const headers = [...baseHeaders, ...authConfigHeaders];

      // Transform site data to rows
      const rows = sites.map(site => {
        const baseRow = [
          site.id || '',
          site.name || '',
          site.customer || '',
          site.type || site.segment || '',
          site.status || '',
          site.city || site.location?.city || '',
          site.state || site.location?.state || '',
          site.address || site.location?.address || '',
          site.licensedUsers || site.billingData?.licensedUsers || '',
          site.bandwidth || site.billingData?.bandwidthMbps || '',
          site.totalAps || site.infrastructure?.aps?.total || '',
          site.liveAps || site.infrastructure?.aps?.live || '',
          site.totalSwitches || site.infrastructure?.switches?.total || '',
          site.liveSwitches || site.infrastructure?.switches?.live || '',
          site.uptime || '',
          site.contactName || site.contact?.name || '',
          site.contactEmail || site.contact?.email || '',
          site.contactPhone || site.contact?.phone || '',
          site.createdAt ? new Date(site.createdAt).toLocaleDateString() : '',
          site.lastUpdated ? new Date(site.lastUpdated).toLocaleDateString() : ''
        ];

        // Add auth config data if enabled
        if (includeAuthConfig && site.authenticationConfig) {
          const segmentType = (site.type || site.segment || 'miscellaneous').toLowerCase().replace('-', '');
          const authExport = formatAuthConfigForExport(site.authenticationConfig, segmentType, authConfigFormat);

          // Format auth config as a summary string
          const authSummary = Object.entries(authExport)
            .map(([category, methods]) => `${category}: ${methods || 'None'}`)
            .join(' | ');

          baseRow.push(authSummary);
        } else if (includeAuthConfig) {
          baseRow.push('Not Configured');
        }

        return baseRow;
      });

      const csv = Papa.unparse({
        fields: headers,
        data: rows,
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export site data with detailed auth config (separate columns per category)
 * Creates a more detailed export with each auth category as a separate column
 * @param {Array} sites - Array of site objects to export
 * @param {string} filename - Output filename
 * @param {string} authConfigFormat - 'both', 'ids', or 'labels' (default: 'both')
 * @returns {Promise<void>}
 */
export const exportSiteDataWithDetailedAuthConfig = async (sites, filename = 'sites-detailed-export.csv', authConfigFormat = 'both') => {
  return new Promise((resolve, reject) => {
    try {
      // Collect all unique auth categories across all sites
      const allAuthCategories = new Set();
      sites.forEach(site => {
        if (site.authenticationConfig) {
          Object.keys(site.authenticationConfig).forEach(cat => allAuthCategories.add(cat));
        }
      });

      // Define category labels mapping (simplified)
      const categoryLabels = {
        users: 'Auth: Users',
        guests: 'Auth: Guests',
        devices: 'Auth: Devices',
        residents: 'Auth: Residents',
        members: 'Auth: Members',
        staff: 'Auth: Staff',
        roomGuests: 'Auth: Room Guests',
        conferenceRooms: 'Auth: Conference Rooms'
      };

      // Base headers
      const baseHeaders = [
        'Site ID',
        'Site Name',
        'Customer',
        'Segment',
        'Status',
        'City',
        'State',
        'Licensed Users',
        'Bandwidth (Mbps)',
        'Uptime %'
      ];

      // Add auth category headers
      const authHeaders = Array.from(allAuthCategories).map(cat => categoryLabels[cat] || `Auth: ${cat}`);

      const headers = [...baseHeaders, ...authHeaders];

      // Transform site data to rows
      const rows = sites.map(site => {
        const segmentType = (site.type || site.segment || 'miscellaneous').toLowerCase().replace('-', '');
        const authExport = site.authenticationConfig
          ? formatAuthConfigForExport(site.authenticationConfig, segmentType, authConfigFormat)
          : {};

        const baseRow = [
          site.id || '',
          site.name || '',
          site.customer || '',
          site.type || site.segment || '',
          site.status || '',
          site.city || site.location?.city || '',
          site.state || site.location?.state || '',
          site.licensedUsers || site.billingData?.licensedUsers || '',
          site.bandwidth || site.billingData?.bandwidthMbps || '',
          site.uptime || ''
        ];

        // Add auth config for each category
        Array.from(allAuthCategories).forEach(cat => {
          const methods = site.authenticationConfig?.[cat];
          if (methods && methods.length > 0) {
            if (authConfigFormat === 'ids') {
              baseRow.push(methods.join(', '));
            } else if (authConfigFormat === 'labels') {
              // Get labels from the export format
              const catLabel = categoryLabels[cat] || cat;
              baseRow.push(authExport[catLabel] || methods.join(', '));
            } else {
              // 'both' - include both label and ID
              const catLabel = categoryLabels[cat] || cat;
              baseRow.push(authExport[catLabel] || methods.join(', '));
            }
          } else {
            baseRow.push('');
          }
        });

        return baseRow;
      });

      const csv = Papa.unparse({
        fields: headers,
        data: rows,
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};