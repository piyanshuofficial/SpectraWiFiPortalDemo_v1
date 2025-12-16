// src/components/PolicySelectionTable/PolicySelectionTable.js

import React, { useState, useMemo, useCallback } from 'react';
import {
  FaSearch,
  FaFilter,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import './PolicySelectionTable.css';

/**
 * PolicySelectionTable Component
 * A table component for selecting policies with search, filters, pagination,
 * and per-policy license limit configuration.
 *
 * @param {Array} policies - Array of policy objects from master list
 * @param {Array} selectedPolicies - Array of selected policy objects with licenseLimit
 * @param {Function} onSelectionChange - Callback when selection changes
 * @param {string} segment - Current segment type for filtering
 * @param {boolean} disabled - Whether the table is disabled
 */
const PolicySelectionTable = ({
  policies = [],
  selectedPolicies = [],
  onSelectionChange,
  segment = '',
  disabled = false
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [speedFilter, setSpeedFilter] = useState('all');
  const [dataFilter, setDataFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const rowsPerPage = 10;

  // Get unique filter options from policies
  const filterOptions = useMemo(() => {
    const speeds = new Set();
    const dataVolumes = new Set();
    const devices = new Set();

    policies.forEach(policy => {
      speeds.add(policy.speed);
      dataVolumes.add(policy.data);
      devices.add(policy.devices);
    });

    return {
      speeds: ['all', ...Array.from(speeds).sort((a, b) => {
        const numA = parseInt(a) || 999;
        const numB = parseInt(b) || 999;
        return numA - numB;
      })],
      dataVolumes: ['all', ...Array.from(dataVolumes).sort((a, b) => {
        if (a === 'Unlimited') return 1;
        if (b === 'Unlimited') return -1;
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
      })],
      devices: ['all', ...Array.from(devices).sort()]
    };
  }, [policies]);

  // Filter policies
  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      // Segment filter (always apply if segment provided)
      if (segment && policy.segment !== segment) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          policy.policyId.toLowerCase().includes(query) ||
          policy.speed.toLowerCase().includes(query) ||
          policy.data.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Speed filter
      if (speedFilter !== 'all' && policy.speed !== speedFilter) return false;

      // Data filter
      if (dataFilter !== 'all' && policy.data !== dataFilter) return false;

      // Device filter
      if (deviceFilter !== 'all' && policy.devices !== deviceFilter) return false;

      return true;
    });
  }, [policies, segment, searchQuery, speedFilter, dataFilter, deviceFilter]);

  // Paginate
  const paginatedPolicies = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPolicies.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPolicies, currentPage]);

  const totalPages = Math.ceil(filteredPolicies.length / rowsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, speedFilter, dataFilter, deviceFilter, segment]);

  // Check if a policy is selected
  const isSelected = useCallback((policyId) => {
    return selectedPolicies.some(p => p.policyId === policyId);
  }, [selectedPolicies]);

  // Get license limit for a policy
  const getLicenseLimit = useCallback((policyId) => {
    const policy = selectedPolicies.find(p => p.policyId === policyId);
    return policy?.licenseLimit || 0;
  }, [selectedPolicies]);

  // Handle checkbox toggle
  const handleToggle = useCallback((policy) => {
    if (disabled) return;

    const currentIndex = selectedPolicies.findIndex(p => p.policyId === policy.policyId);
    let newSelection;

    if (currentIndex === -1) {
      // Add policy with default license limit
      newSelection = [
        ...selectedPolicies,
        { policyId: policy.policyId, licenseLimit: 10, ...policy }
      ];
    } else {
      // Remove policy
      newSelection = selectedPolicies.filter(p => p.policyId !== policy.policyId);
    }

    onSelectionChange?.(newSelection);
  }, [disabled, selectedPolicies, onSelectionChange]);

  // Handle license limit change
  const handleLicenseLimitChange = useCallback((policyId, value) => {
    if (disabled) return;

    const numValue = parseInt(value, 10) || 0;
    const newSelection = selectedPolicies.map(p =>
      p.policyId === policyId ? { ...p, licenseLimit: Math.max(0, numValue) } : p
    );

    onSelectionChange?.(newSelection);
  }, [disabled, selectedPolicies, onSelectionChange]);

  // Select all visible
  const handleSelectAllVisible = useCallback(() => {
    if (disabled) return;

    const visiblePolicyIds = paginatedPolicies.map(p => p.policyId);
    const existingOtherPolicies = selectedPolicies.filter(
      p => !visiblePolicyIds.includes(p.policyId)
    );

    const allVisible = paginatedPolicies.every(p => isSelected(p.policyId));

    if (allVisible) {
      // Deselect all visible
      onSelectionChange?.(existingOtherPolicies);
    } else {
      // Select all visible
      const newPolicies = paginatedPolicies
        .filter(p => !isSelected(p.policyId))
        .map(p => ({ policyId: p.policyId, licenseLimit: 10, ...p }));

      onSelectionChange?.([...selectedPolicies, ...newPolicies]);
    }
  }, [disabled, paginatedPolicies, selectedPolicies, isSelected, onSelectionChange]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSpeedFilter('all');
    setDataFilter('all');
    setDeviceFilter('all');
  }, []);

  const hasActiveFilters = searchQuery || speedFilter !== 'all' || dataFilter !== 'all' || deviceFilter !== 'all';
  const allVisibleSelected = paginatedPolicies.length > 0 && paginatedPolicies.every(p => isSelected(p.policyId));
  const someVisibleSelected = paginatedPolicies.some(p => isSelected(p.policyId));

  return (
    <div className={`policy-selection-table ${disabled ? 'disabled' : ''}`}>
      {/* Header */}
      <div className="pst-header">
        <div className="pst-search-row">
          <div className="pst-search-wrapper">
            <FaSearch className="pst-search-icon" />
            <input
              type="text"
              placeholder="Search policies by ID, speed, or data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pst-search-input"
              disabled={disabled}
            />
            {searchQuery && (
              <button
                className="pst-clear-search"
                onClick={() => setSearchQuery('')}
                disabled={disabled}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            className={`pst-filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            disabled={disabled}
          >
            <FaFilter />
            Filters
            {hasActiveFilters && <span className="filter-badge">{
              [speedFilter !== 'all', dataFilter !== 'all', deviceFilter !== 'all'].filter(Boolean).length
            }</span>}
          </button>
        </div>

        {showFilters && (
          <div className="pst-filters-row">
            <div className="pst-filter-group">
              <label>Speed</label>
              <select
                value={speedFilter}
                onChange={(e) => setSpeedFilter(e.target.value)}
                disabled={disabled}
              >
                {filterOptions.speeds.map(speed => (
                  <option key={speed} value={speed}>
                    {speed === 'all' ? 'All Speeds' : speed}
                  </option>
                ))}
              </select>
            </div>
            <div className="pst-filter-group">
              <label>Data</label>
              <select
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                disabled={disabled}
              >
                {filterOptions.dataVolumes.map(data => (
                  <option key={data} value={data}>
                    {data === 'all' ? 'All Data' : data}
                  </option>
                ))}
              </select>
            </div>
            <div className="pst-filter-group">
              <label>Devices</label>
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                disabled={disabled}
              >
                {filterOptions.devices.map(device => (
                  <option key={device} value={device}>
                    {device === 'all' ? 'All Devices' : `${device} Device${device !== '1' ? 's' : ''}`}
                  </option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button className="pst-clear-filters" onClick={clearFilters} disabled={disabled}>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      <div className="pst-selection-summary">
        <span className="pst-count">
          {filteredPolicies.length} policies found
          {selectedPolicies.length > 0 && (
            <> &bull; <strong>{selectedPolicies.length} selected</strong></>
          )}
        </span>
        {selectedPolicies.length > 0 && (
          <span className="pst-total-licenses">
            Total Licenses: <strong>
              {selectedPolicies.reduce((sum, p) => sum + (p.licenseLimit || 0), 0)}
            </strong>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="pst-table-wrapper">
        <table className="pst-table">
          <thead>
            <tr>
              <th className="pst-checkbox-col">
                <label className="pst-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={el => {
                      if (el) {
                        el.indeterminate = someVisibleSelected && !allVisibleSelected;
                      }
                    }}
                    onChange={handleSelectAllVisible}
                    disabled={disabled || paginatedPolicies.length === 0}
                  />
                  <span className="pst-checkbox-custom">
                    {allVisibleSelected && <FaCheck />}
                  </span>
                </label>
              </th>
              <th>Policy ID</th>
              <th>Speed</th>
              <th>Data</th>
              <th>Devices</th>
              <th className="pst-license-col">License Limit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPolicies.length === 0 ? (
              <tr>
                <td colSpan="6" className="pst-empty">
                  {hasActiveFilters
                    ? 'No policies match your filters'
                    : 'No policies available'}
                </td>
              </tr>
            ) : (
              paginatedPolicies.map(policy => {
                const selected = isSelected(policy.policyId);
                return (
                  <tr key={policy.policyId} className={selected ? 'selected' : ''}>
                    <td className="pst-checkbox-col">
                      <label className="pst-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleToggle(policy)}
                          disabled={disabled}
                        />
                        <span className="pst-checkbox-custom">
                          {selected && <FaCheck />}
                        </span>
                      </label>
                    </td>
                    <td className="pst-policy-id">{policy.policyId}</td>
                    <td>{policy.speed}</td>
                    <td>{policy.data}</td>
                    <td>{policy.devices}</td>
                    <td className="pst-license-col">
                      <input
                        type="number"
                        min="0"
                        value={selected ? getLicenseLimit(policy.policyId) : ''}
                        onChange={(e) => handleLicenseLimitChange(policy.policyId, e.target.value)}
                        placeholder="-"
                        disabled={disabled || !selected}
                        className="pst-license-input"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pst-pagination">
          <button
            className="pst-page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || disabled}
          >
            <FaChevronLeft />
          </button>
          <span className="pst-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pst-page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || disabled}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PolicySelectionTable;
