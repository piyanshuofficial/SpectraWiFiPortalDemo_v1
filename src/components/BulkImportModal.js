// src/components/BulkImportModal.js

import React, { useState, useCallback, useRef } from 'react';
import { FiX, FiUpload, FiDownload, FiAlertCircle, FiCheckCircle, FiClipboard, FiAlertTriangle } from 'react-icons/fi';
import { useBulkOperations } from '../hooks/useBulkOperations';
import { usePermissions } from '../hooks/usePermissions';
import { CSV_TEMPLATES, VALIDATION_RULES } from '../config/bulkOperationsConfig';
import './BulkImportModal.css';

/**
 * BulkImportModal Component
 *
 * Provides functionality to bulk import users or devices via CSV file upload or direct paste
 * Respects segment-based permissions from segmentPermissionsConfig
 *
 * @param {string} type - Type of import: 'users', 'humanDevices', or 'otherDevices'
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Function to close modal
 * @param {function} onImport - Callback function when import is successful
 */
const BulkImportModal = ({ type = 'users', isOpen, onClose, onImport }) => {
  const { allowExcelPaste, maxBulkUsers, maxBulkDevices } = useBulkOperations();
  const { canBulkImportUsers, canBulkImportDevices, currentSegment } = usePermissions();

  // Check if bulk import is allowed for current segment based on type
  const isBulkImportAllowed = type === 'users' ? canBulkImportUsers : canBulkImportDevices;

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedData, setPastedData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Get configuration based on type
  const template = CSV_TEMPLATES[type];
  const maxRecords = type === 'users' ? maxBulkUsers : maxBulkDevices;
  const entityName = type === 'users' ? 'User' : 'Device';
  const entityNamePlural = type === 'users' ? 'Users' : 'Devices';

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPastedData('');
      setParsedData([]);
      setValidationResults(null);
      setError(null);
      setActiveTab('upload');
    }
  }, [isOpen]);

  /**
   * Download CSV template
   */
  const handleDownloadTemplate = useCallback(() => {
    const headers = template.headers;
    const sampleRows = template.sampleData;

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `bulk_import_${type}_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [type, template]);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  /**
   * Parse CSV text to array of objects
   */
  const parseCSV = useCallback((csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    // Validate headers
    const missingHeaders = template.requiredFields.filter(field => !headers.includes(field));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines

      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);
    }

    if (data.length === 0) {
      throw new Error('CSV file contains no data rows');
    }

    if (data.length > maxRecords) {
      throw new Error(`Maximum ${maxRecords} records allowed. Your file contains ${data.length} records.`);
    }

    return data;
  }, [template, maxRecords]);

  /**
   * Validate a single record
   */
  const validateRecord = useCallback((record, index) => {
    const errors = [];
    const warnings = [];
    const rules = VALIDATION_RULES[type];

    // Check required fields
    template.requiredFields.forEach(field => {
      if (!record[field] || record[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    // Apply validation rules
    Object.keys(rules).forEach(field => {
      const value = record[field];
      if (!value) return; // Skip validation if field is empty (handled by required check)

      const rule = rules[field];

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.errorMessage);
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(rule.errorMessage);
      }

      // Length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`);
      }
    });

    return {
      rowNumber: index + 1,
      data: record,
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [type, template]);

  /**
   * Validate all parsed data
   */
  const validateData = useCallback((data) => {
    const results = data.map((record, index) => validateRecord(record, index));

    const validCount = results.filter(r => r.isValid).length;
    const errorCount = results.filter(r => !r.isValid).length;

    return {
      total: results.length,
      valid: validCount,
      errors: errorCount,
      results
    };
  }, [validateRecord]);

  /**
   * Process uploaded file
   */
  const handleProcessFile = useCallback(async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      const validation = validateData(data);

      setParsedData(data);
      setValidationResults(validation);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [file, parseCSV, validateData]);

  /**
   * Process pasted data
   */
  const handleProcessPaste = useCallback(() => {
    if (!pastedData.trim()) {
      setError('Please paste data from Excel');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = parseCSV(pastedData);
      const validation = validateData(data);

      setParsedData(data);
      setValidationResults(validation);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [pastedData, parseCSV, validateData]);

  /**
   * Import validated data
   */
  const handleImport = useCallback(() => {
    if (!validationResults || validationResults.errors > 0) {
      setError('Please fix all errors before importing');
      return;
    }

    const validRecords = validationResults.results
      .filter(r => r.isValid)
      .map(r => r.data);

    onImport(validRecords);
    onClose();
  }, [validationResults, onImport, onClose]);

  if (!isOpen) return null;

  // Show a message if bulk import is not allowed for current segment
  if (!isBulkImportAllowed) {
    return (
      <div className="bulk-import-modal-backdrop">
        <div className="bulk-import-modal">
          <div className="bulk-import-header">
            <h2>Bulk Import {entityNamePlural}</h2>
            <button className="close-button" onClick={onClose}>
              <FiX size={24} />
            </button>
          </div>
          <div className="bulk-import-content">
            <div className="bulk-import-not-allowed">
              <FiAlertTriangle className="warning-icon" />
              <h3>Bulk Import Not Available</h3>
              <p>
                Bulk import of {entityNamePlural.toLowerCase()} is not enabled for the <strong>{currentSegment}</strong> segment.
              </p>
              <p className="hint">
                This feature can be enabled by an administrator during site provisioning.
              </p>
            </div>
          </div>
          <div className="bulk-import-footer">
            <button className="btn btn-cancel" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bulk-import-modal-backdrop">
      <div className="bulk-import-modal">
        {/* Header */}
        <div className="bulk-import-header">
          <h2>Bulk Import {entityNamePlural}</h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bulk-import-tabs">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FiUpload /> Upload CSV
          </button>
          {allowExcelPaste && (
            <button
              className={`tab-button ${activeTab === 'paste' ? 'active' : ''}`}
              onClick={() => setActiveTab('paste')}
            >
              <FiClipboard /> Paste from Excel
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bulk-import-content">
          {/* Download Template Section */}
          <div className="template-section">
            <div className="template-info">
              <FiDownload />
              <span>Download the CSV template to see the required format</span>
            </div>
            <button className="btn btn-secondary" onClick={handleDownloadTemplate}>
              <FiDownload /> Download Template
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="upload-section">
              <div className="file-upload-area">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload /> Select CSV File
                </button>
                {file && (
                  <div className="selected-file">
                    <span>Selected: {file.name}</span>
                  </div>
                )}
              </div>
              {file && !validationResults && (
                <button
                  className="btn btn-success"
                  onClick={handleProcessFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Validate File'}
                </button>
              )}
            </div>
          )}

          {/* Paste Tab */}
          {activeTab === 'paste' && allowExcelPaste && (
            <div className="paste-section">
              <p className="paste-instructions">
                Copy data from Excel (including headers) and paste it below:
              </p>
              <textarea
                className="paste-textarea"
                placeholder="Paste your data here..."
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                rows={10}
              />
              {pastedData && !validationResults && (
                <button
                  className="btn btn-success"
                  onClick={handleProcessPaste}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Validate Data'}
                </button>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-box">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Validation Results */}
          {validationResults && (
            <div className="validation-results">
              <div className="validation-summary">
                <div className="summary-item">
                  <span className="label">Total Records:</span>
                  <span className="value">{validationResults.total}</span>
                </div>
                <div className="summary-item success">
                  <FiCheckCircle />
                  <span className="label">Valid:</span>
                  <span className="value">{validationResults.valid}</span>
                </div>
                {validationResults.errors > 0 && (
                  <div className="summary-item error">
                    <FiAlertCircle />
                    <span className="label">Errors:</span>
                    <span className="value">{validationResults.errors}</span>
                  </div>
                )}
              </div>

              {/* Error Details */}
              {validationResults.errors > 0 && (
                <div className="error-details">
                  <h4>Errors Found:</h4>
                  <div className="error-list">
                    {validationResults.results
                      .filter(r => !r.isValid)
                      .map((result, index) => (
                        <div key={index} className="error-item">
                          <strong>Row {result.rowNumber}:</strong>
                          <ul>
                            {result.errors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bulk-import-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          {validationResults && validationResults.errors === 0 && (
            <button className="btn btn-success" onClick={handleImport}>
              Import {validationResults.valid} {entityNamePlural}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
