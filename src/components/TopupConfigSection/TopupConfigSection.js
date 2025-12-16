// src/components/TopupConfigSection/TopupConfigSection.js

import React, { useCallback, useMemo } from 'react';
import { FaRocket, FaDatabase, FaMobileAlt, FaExchangeAlt, FaToggleOn, FaToggleOff, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { TOPUP_POLICIES, GST_RATE, calculatePriceWithGST } from '../../constants/siteProvisioningConfig';
import './TopupConfigSection.css';

/**
 * TopupConfigSection Component
 * Configures top-ups for WiFi Self Care Portal (SCP).
 * Supports multiple pack selection per topup type with individual pricing.
 *
 * @param {Object} topups - Top-up configuration object
 * @param {Function} onTopupsChange - Callback when top-ups change
 * @param {boolean} disabled - Whether the section is disabled
 */
const TopupConfigSection = ({
  topups = {},
  onTopupsChange,
  disabled = false
}) => {
  const topupTypes = useMemo(() => [
    {
      key: 'speed',
      label: 'Speed Top-up',
      description: 'Allow users to temporarily boost their connection speed',
      icon: FaRocket,
      policies: TOPUP_POLICIES.speed
    },
    {
      key: 'data',
      label: 'Data Top-up',
      description: 'Allow users to purchase additional data packs',
      icon: FaDatabase,
      policies: TOPUP_POLICIES.data
    },
    {
      key: 'device',
      label: 'Device Top-up',
      description: 'Allow users to add extra devices to their account',
      icon: FaMobileAlt,
      policies: TOPUP_POLICIES.device
    },
    {
      key: 'policy',
      label: 'Policy/Plan Top-up',
      description: 'Allow users to upgrade their plan or purchase plan passes',
      icon: FaExchangeAlt,
      policies: TOPUP_POLICIES.policy
    }
  ], []);

  // Get current topup config with default values
  const getTopupConfig = useCallback((key) => {
    return topups[key] || { enabled: false, packs: [] };
  }, [topups]);

  // Handle toggle change for topup type
  const handleToggle = useCallback((topupKey) => {
    if (disabled) return;

    const currentTopup = getTopupConfig(topupKey);
    const newEnabled = !currentTopup.enabled;

    onTopupsChange?.({
      ...topups,
      [topupKey]: {
        enabled: newEnabled,
        packs: newEnabled ? currentTopup.packs : [] // Keep packs if re-enabling
      }
    });
  }, [disabled, topups, onTopupsChange, getTopupConfig]);

  // Check if a pack is selected
  const isPackSelected = useCallback((topupKey, policyId) => {
    const config = getTopupConfig(topupKey);
    return config.packs?.some(p => p.policyId === policyId) || false;
  }, [getTopupConfig]);

  // Get pack price from selection
  const getPackPrice = useCallback((topupKey, policyId) => {
    const config = getTopupConfig(topupKey);
    const pack = config.packs?.find(p => p.policyId === policyId);
    return pack?.sellingPrice || 0;
  }, [getTopupConfig]);

  // Handle pack selection toggle
  const handlePackToggle = useCallback((topupKey, policyId) => {
    if (disabled) return;

    const currentTopup = getTopupConfig(topupKey);
    const currentPacks = currentTopup.packs || [];
    const isSelected = currentPacks.some(p => p.policyId === policyId);

    let newPacks;
    if (isSelected) {
      // Remove pack
      newPacks = currentPacks.filter(p => p.policyId !== policyId);
    } else {
      // Add pack with zero price (admin must set)
      newPacks = [...currentPacks, { policyId, sellingPrice: 0, priceWithTax: 0 }];
    }

    onTopupsChange?.({
      ...topups,
      [topupKey]: {
        ...currentTopup,
        packs: newPacks
      }
    });
  }, [disabled, topups, onTopupsChange, getTopupConfig]);

  // Handle price change for a pack
  const handlePriceChange = useCallback((topupKey, policyId, value) => {
    if (disabled) return;

    const numValue = parseFloat(value) || 0;
    const priceWithTax = calculatePriceWithGST(numValue);

    const currentTopup = getTopupConfig(topupKey);
    const newPacks = currentTopup.packs.map(pack =>
      pack.policyId === policyId
        ? { ...pack, sellingPrice: numValue, priceWithTax }
        : pack
    );

    onTopupsChange?.({
      ...topups,
      [topupKey]: {
        ...currentTopup,
        packs: newPacks
      }
    });
  }, [disabled, topups, onTopupsChange, getTopupConfig]);

  // Select all packs for a topup type
  const handleSelectAll = useCallback((topupKey, policies) => {
    if (disabled) return;

    const currentTopup = getTopupConfig(topupKey);
    const allSelected = policies.every(p => isPackSelected(topupKey, p.id));

    let newPacks;
    if (allSelected) {
      // Deselect all
      newPacks = [];
    } else {
      // Select all - keep existing prices for already selected packs
      newPacks = policies.map(policy => {
        const existingPack = currentTopup.packs?.find(p => p.policyId === policy.id);
        return existingPack || { policyId: policy.id, sellingPrice: 0, priceWithTax: 0 };
      });
    }

    onTopupsChange?.({
      ...topups,
      [topupKey]: {
        ...currentTopup,
        packs: newPacks
      }
    });
  }, [disabled, topups, onTopupsChange, getTopupConfig, isPackSelected]);

  return (
    <div className={`topup-config-section ${disabled ? 'disabled' : ''}`}>
      <div className="topup-section-header">
        <h4>WiFi Self-Care Portal Top-ups</h4>
        <p className="topup-section-description">
          Configure top-up options that users can purchase through the self-care portal.
          Select multiple packs per category and set individual prices. 18% GST will be calculated automatically.
        </p>
      </div>

      <div className="topup-types-container">
        {topupTypes.map(({ key, label, description, icon: Icon, policies }) => {
          const config = getTopupConfig(key);
          const selectedCount = config.packs?.length || 0;
          const allSelected = policies.length > 0 && policies.every(p => isPackSelected(key, p.id));
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div key={key} className={`topup-type-card ${config.enabled ? 'enabled' : ''}`}>
              <div className="topup-type-header">
                <div className="topup-type-title">
                  <Icon className="topup-type-icon" />
                  <div className="topup-type-info">
                    <span className="topup-type-name">{label}</span>
                    <span className="topup-type-description">{description}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`topup-type-toggle ${config.enabled ? 'active' : ''}`}
                  onClick={() => handleToggle(key)}
                  disabled={disabled}
                  aria-label={`${config.enabled ? 'Disable' : 'Enable'} ${label}`}
                >
                  {config.enabled ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>

              {config.enabled && (
                <div className="topup-packs-section">
                  <div className="topup-packs-header">
                    <label className="topup-select-all">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={() => handleSelectAll(key, policies)}
                        disabled={disabled}
                      />
                      <span className="checkbox-custom">
                        {allSelected && <FaCheck />}
                      </span>
                      <span>Select All ({selectedCount}/{policies.length})</span>
                    </label>
                  </div>

                  <div className="topup-packs-list">
                    {policies.map(policy => {
                      const isSelected = isPackSelected(key, policy.id);
                      const price = getPackPrice(key, policy.id);
                      const priceWithTax = calculatePriceWithGST(price);

                      return (
                        <div
                          key={policy.id}
                          className={`topup-pack-item ${isSelected ? 'selected' : ''}`}
                        >
                          <label className="topup-pack-checkbox">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handlePackToggle(key, policy.id)}
                              disabled={disabled}
                            />
                            <span className="checkbox-custom">
                              {isSelected && <FaCheck />}
                            </span>
                          </label>

                          <div className="topup-pack-info">
                            <span className="topup-pack-name">{policy.name}</span>
                            <span className="topup-pack-value">{policy.value}</span>
                          </div>

                          {isSelected && (
                            <div className="topup-pack-pricing">
                              <div className="price-input-group">
                                <span className="currency">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={price}
                                  onChange={(e) => handlePriceChange(key, policy.id, e.target.value)}
                                  disabled={disabled}
                                  placeholder="0.00"
                                  className="pack-price-input"
                                />
                              </div>
                              <div className="price-with-tax">
                                <span className="tax-label">With GST:</span>
                                <span className="tax-value">₹{priceWithTax.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedCount === 0 && (
                    <div className="topup-empty-message">
                      <FaInfoCircle />
                      <span>Select at least one pack to enable this top-up type for users</span>
                    </div>
                  )}
                </div>
              )}

              {!config.enabled && (
                <div className="topup-disabled-message">
                  <span>Enable to configure available packs</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="topup-info-note">
        <FaInfoCircle />
        <div>
          <strong>Note:</strong> Selected top-up packs will be available on the WiFi Self-Care Portal
          for users to purchase. Prices must be set for each pack. All prices will be displayed with 18% GST included.
        </div>
      </div>
    </div>
  );
};

export default TopupConfigSection;
