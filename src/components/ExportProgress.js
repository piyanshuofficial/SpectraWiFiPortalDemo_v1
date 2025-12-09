// src/components/ExportProgress.js
// Export Progress Indicator for large datasets

import React from 'react';
import PropTypes from 'prop-types';
import { FaFileExport, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import './ExportProgress.css';

const ExportProgress = ({
  isExporting,
  progress,
  totalItems,
  processedItems,
  fileName,
  exportType,
  onCancel,
  error
}) => {
  if (!isExporting && !error) return null;

  const percentage = progress || (totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0);
  const isComplete = percentage >= 100 && !error;

  return (
    <div className="export-progress-overlay">
      <div className="export-progress-modal">
        <div className="export-progress-header">
          <FaFileExport className="export-icon" />
          <h3>
            {error ? 'Export Failed' : isComplete ? 'Export Complete' : `Exporting ${exportType || 'Data'}`}
          </h3>
        </div>

        <div className="export-progress-content">
          {error ? (
            <div className="export-error">
              <FaTimes className="error-icon" />
              <p>{error}</p>
            </div>
          ) : isComplete ? (
            <div className="export-success">
              <FaCheck className="success-icon" />
              <p>Successfully exported {totalItems.toLocaleString()} items</p>
              {fileName && <p className="file-name">{fileName}</p>}
            </div>
          ) : (
            <>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="progress-details">
                <span className="progress-percentage">{percentage}%</span>
                <span className="progress-items">
                  {processedItems.toLocaleString()} / {totalItems.toLocaleString()} items
                </span>
              </div>

              <div className="progress-status">
                <FaSpinner className="spinner" />
                <span>Processing...</span>
              </div>
            </>
          )}
        </div>

        <div className="export-progress-actions">
          {!isComplete && !error && onCancel && (
            <button
              className="cancel-button"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          )}
          {(isComplete || error) && (
            <button
              className="close-button"
              onClick={onCancel}
              type="button"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ExportProgress.propTypes = {
  isExporting: PropTypes.bool,
  progress: PropTypes.number,
  totalItems: PropTypes.number,
  processedItems: PropTypes.number,
  fileName: PropTypes.string,
  exportType: PropTypes.string,
  onCancel: PropTypes.func,
  error: PropTypes.string
};

ExportProgress.defaultProps = {
  isExporting: false,
  progress: 0,
  totalItems: 0,
  processedItems: 0,
  fileName: '',
  exportType: 'Data',
  onCancel: null,
  error: null
};

export default ExportProgress;
