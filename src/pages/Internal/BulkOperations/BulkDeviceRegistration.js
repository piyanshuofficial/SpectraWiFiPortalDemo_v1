// src/pages/Internal/BulkOperations/BulkDeviceRegistration.js

import React, { useState, useRef, useEffect } from 'react';
import {
  FaTimes,
  FaWifi,
  FaUpload,
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt,
} from 'react-icons/fa';
import Button from '@components/Button';
import './BulkOperationModals.css';

/**
 * BulkDeviceRegistration - Modal for bulk device registration via CSV
 */
const BulkDeviceRegistration = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setParsedData([]);
      setValidationResults(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDownloadTemplate = () => {
    const headers = ['userId', 'deviceName', 'macAddress', 'category', 'description'];
    const sampleData = [
      ['USER001', 'Johns-Laptop', 'AA:BB:CC:DD:EE:01', 'Human', 'Work laptop'],
      ['USER002', 'Smart-TV', 'AA:BB:CC:DD:EE:02', 'Other', 'Living room TV'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bulk_device_registration_template.csv';
    link.click();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          setError('CSV must have at least a header and one data row');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim());
        const requiredHeaders = ['userId', 'deviceName', 'macAddress'];
        const missing = requiredHeaders.filter((h) => !headers.includes(h));

        if (missing.length > 0) {
          setError(`Missing required columns: ${missing.join(', ')}`);
          return;
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map((v) => v.trim());
          const row = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
          });
          data.push(row);
        }

        setParsedData(data);
        validateData(data);
      } catch (err) {
        setError('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  const validateData = (data) => {
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    const results = data.map((row, idx) => {
      const errors = [];
      if (!row.userId) errors.push('userId is required');
      if (!row.deviceName) errors.push('deviceName is required');
      if (!row.macAddress) errors.push('macAddress is required');
      if (row.macAddress && !macRegex.test(row.macAddress)) {
        errors.push('Invalid MAC address format (use AA:BB:CC:DD:EE:FF)');
      }
      if (row.category && !['Human', 'Other'].includes(row.category)) {
        errors.push('Category must be Human or Other');
      }
      return {
        row: idx + 1,
        data: row,
        valid: errors.length === 0,
        errors,
      };
    });
    setValidationResults(results);
  };

  const handleImport = async () => {
    if (!validationResults || validationResults.some((r) => !r.valid)) {
      setError('Please fix validation errors before importing');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Importing devices:', parsedData);
      onClose();
    } catch (err) {
      setError('Import failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = validationResults?.filter((r) => r.valid).length || 0;
  const errorCount = validationResults?.filter((r) => !r.valid).length || 0;

  if (!isOpen) return null;

  return (
    <div className="bulk-modal-overlay" onClick={onClose}>
      <div className="bulk-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="bulk-modal-header bulk-modal-header--primary">
          <h2 className="bulk-modal-title">
            <FaWifi /> Bulk Device Registration
          </h2>
          <button className="bulk-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="bulk-modal-body">
          <div className="bulk-instructions">
            <h3>Instructions</h3>
            <ul>
              <li>Download the CSV template below</li>
              <li>Fill in device details (userId, deviceName, macAddress are required)</li>
              <li>Category should be "Human" or "Other"</li>
              <li>Upload the completed CSV file</li>
              <li>Review validation results and fix any errors</li>
            </ul>
          </div>

          <div className="bulk-template-section">
            <Button variant="secondary" onClick={handleDownloadTemplate}>
              <FaDownload /> Download CSV Template
            </Button>
          </div>

          <div className="bulk-upload-section">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div
              className="bulk-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload className="upload-icon" />
              <p>{file ? file.name : 'Click to upload CSV file'}</p>
            </div>
          </div>

          {error && (
            <div className="bulk-error">
              <FaExclamationCircle /> {error}
            </div>
          )}

          {validationResults && (
            <div className="bulk-validation-results">
              <div className="validation-summary">
                <span className="valid-count">
                  <FaCheckCircle /> {validCount} Valid
                </span>
                {errorCount > 0 && (
                  <span className="error-count">
                    <FaExclamationCircle /> {errorCount} Errors
                  </span>
                )}
              </div>

              {errorCount > 0 && (
                <div className="validation-errors">
                  {validationResults
                    .filter((r) => !r.valid)
                    .slice(0, 5)
                    .map((r) => (
                      <div key={r.row} className="error-item">
                        <strong>Row {r.row}:</strong> {r.errors.join(', ')}
                      </div>
                    ))}
                  {errorCount > 5 && (
                    <p className="more-errors">
                      And {errorCount - 5} more errors...
                    </p>
                  )}
                </div>
              )}

              {validCount > 0 && errorCount === 0 && (
                <div className="validation-success">
                  <FaFileAlt /> Ready to import {validCount} devices
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bulk-modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!validationResults || errorCount > 0 || isProcessing}
            loading={isProcessing}
          >
            Import {validCount} Devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeviceRegistration;
