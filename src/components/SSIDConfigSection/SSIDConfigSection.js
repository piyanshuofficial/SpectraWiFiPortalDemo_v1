// src/components/SSIDConfigSection/SSIDConfigSection.js

import React, { useCallback } from 'react';
import { FaPlus, FaTrash, FaWifi, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SSID_CATEGORIES } from '../../constants/siteProvisioningConfig';
import './SSIDConfigSection.css';

/**
 * SSIDConfigSection Component
 * Manages dynamic SSID configurations with add/remove functionality.
 * Supports min 1, max 20 SSID entries.
 *
 * @param {Array} ssidConfigs - Array of SSID configuration objects
 * @param {Function} onConfigsChange - Callback when configs change
 * @param {Object} errors - Validation errors object
 * @param {boolean} disabled - Whether the section is disabled
 */
const SSIDConfigSection = ({
  ssidConfigs = [],
  onConfigsChange,
  errors = {},
  disabled = false
}) => {
  const [showPasswords, setShowPasswords] = React.useState({});

  const MAX_SSIDS = 20;
  const MIN_SSIDS = 1;

  // Toggle password visibility for a specific SSID
  const togglePasswordVisibility = useCallback((id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  // Add new SSID entry
  const handleAddSSID = useCallback(() => {
    if (disabled || ssidConfigs.length >= MAX_SSIDS) return;

    const newId = Date.now();
    const newConfig = {
      id: newId,
      category: '',
      ssidName: '',
      ssidPassword: ''
    };

    onConfigsChange?.([...ssidConfigs, newConfig]);
  }, [disabled, ssidConfigs, onConfigsChange]);

  // Remove SSID entry
  const handleRemoveSSID = useCallback((id) => {
    if (disabled || ssidConfigs.length <= MIN_SSIDS) return;

    onConfigsChange?.(ssidConfigs.filter(config => config.id !== id));
  }, [disabled, ssidConfigs, onConfigsChange]);

  // Update a specific SSID field
  const handleFieldChange = useCallback((id, field, value) => {
    if (disabled) return;

    onConfigsChange?.(
      ssidConfigs.map(config =>
        config.id === id ? { ...config, [field]: value } : config
      )
    );
  }, [disabled, ssidConfigs, onConfigsChange]);

  // Get error for a specific SSID field
  const getError = (id, field) => {
    return errors[`ssid_${id}_${field}`] || null;
  };

  return (
    <div className={`ssid-config-section ${disabled ? 'disabled' : ''}`}>
      <div className="ssid-section-header">
        <div className="ssid-section-title">
          <FaWifi className="ssid-icon" />
          <h4>SSID Configuration</h4>
        </div>
        <div className="ssid-count">
          {ssidConfigs.length} / {MAX_SSIDS} SSIDs configured
        </div>
      </div>

      <p className="ssid-section-description">
        Configure at least one SSID for Users, Guest, or Smart/Digital Device categories.
        You can add up to {MAX_SSIDS} SSIDs.
      </p>

      <div className="ssid-entries">
        {ssidConfigs.map((config, index) => (
          <div key={config.id} className="ssid-entry">
            <div className="ssid-entry-header">
              <span className="ssid-entry-number">SSID #{index + 1}</span>
              {ssidConfigs.length > MIN_SSIDS && (
                <button
                  type="button"
                  className="ssid-remove-btn"
                  onClick={() => handleRemoveSSID(config.id)}
                  disabled={disabled}
                  title="Remove SSID"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            <div className="ssid-entry-fields">
              <div className={`ssid-field ${getError(config.id, 'category') ? 'has-error' : ''}`}>
                <label>
                  Category <span className="required">*</span>
                </label>
                <select
                  value={config.category}
                  onChange={(e) => handleFieldChange(config.id, 'category', e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Select category</option>
                  {SSID_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {getError(config.id, 'category') && (
                  <span className="error-text">{getError(config.id, 'category')}</span>
                )}
              </div>

              <div className={`ssid-field ${getError(config.id, 'ssidName') ? 'has-error' : ''}`}>
                <label>
                  SSID Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={config.ssidName}
                  onChange={(e) => handleFieldChange(config.id, 'ssidName', e.target.value)}
                  placeholder="e.g., Spectra-Guest"
                  disabled={disabled}
                  maxLength={32}
                />
                {getError(config.id, 'ssidName') && (
                  <span className="error-text">{getError(config.id, 'ssidName')}</span>
                )}
              </div>

              <div className={`ssid-field ssid-password-field ${getError(config.id, 'ssidPassword') ? 'has-error' : ''}`}>
                <label>
                  SSID Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords[config.id] ? 'text' : 'password'}
                    value={config.ssidPassword}
                    onChange={(e) => handleFieldChange(config.id, 'ssidPassword', e.target.value)}
                    placeholder="Min 8 characters"
                    disabled={disabled}
                    maxLength={63}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility(config.id)}
                    disabled={disabled}
                    title={showPasswords[config.id] ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords[config.id] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {getError(config.id, 'ssidPassword') && (
                  <span className="error-text">{getError(config.id, 'ssidPassword')}</span>
                )}
                <span className="field-hint">8-63 characters</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ssidConfigs.length < MAX_SSIDS && (
        <button
          type="button"
          className="ssid-add-btn"
          onClick={handleAddSSID}
          disabled={disabled}
        >
          <FaPlus />
          Add Another SSID
        </button>
      )}

      {errors.ssidConfigs && (
        <div className="ssid-global-error">
          {errors.ssidConfigs}
        </div>
      )}
    </div>
  );
};

export default SSIDConfigSection;
