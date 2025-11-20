// src/utils/exportUtils.js

import Papa from 'papaparse';

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