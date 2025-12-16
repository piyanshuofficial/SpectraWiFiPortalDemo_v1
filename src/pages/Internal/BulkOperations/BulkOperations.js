// src/pages/Internal/BulkOperations/BulkOperations.js

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FaTasks,
  FaUsers,
  FaWifi,
  FaClock,
  FaUserPlus,
  FaUserCheck,
  FaUserSlash,
  FaBan,
  FaExchangeAlt,
  FaKey,
  FaEdit,
  FaFileUpload,
  FaBuilding,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaSearch,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';
import BulkOperationCard from '@components/BulkOperationCard/BulkOperationCard';
import ScheduledTasksPanel from './ScheduledTasksPanel';
import ScheduleModal from '@components/ScheduleModal/ScheduleModal';
import BulkUserRegistration from './BulkUserRegistration';
import BulkDeviceRegistration from './BulkDeviceRegistration';
import BulkStatusChange from './BulkStatusChange';
import BulkPolicyChange from './BulkPolicyChange';
import BulkDeviceRename from './BulkDeviceRename';
import BulkResendPassword from './BulkResendPassword';
import { usePermissions } from '@hooks/usePermissions';
import { customers, sites } from '@constants/internalPortalData';
import './BulkOperations.css';

/**
 * SearchableSelect Component
 * A searchable dropdown with filtering capability for large datasets
 */
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  icon: Icon,
  label,
  disabled = false,
  renderOption,
  getOptionLabel,
  getOptionValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(option => {
      const label = getOptionLabel(option).toLowerCase();
      return label.includes(query);
    });
  }, [options, searchQuery, getOptionLabel]);

  // Get selected option
  const selectedOption = options.find(opt => getOptionValue(opt) === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="searchable-select" ref={containerRef}>
      <label className="searchable-select-label">
        {Icon && <Icon />} {label}
      </label>
      <div
        className={`searchable-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`searchable-select-value ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <div className="searchable-select-icons">
          {selectedOption && !disabled && (
            <button
              className="searchable-select-clear"
              onClick={handleClear}
              type="button"
              aria-label="Clear selection"
            >
              <FaTimes />
            </button>
          )}
          <FaChevronDown className={`searchable-select-arrow ${isOpen ? 'open' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="searchable-select-dropdown">
          <div className="searchable-select-search">
            <FaSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="searchable-select-options">
            {filteredOptions.length === 0 ? (
              <div className="searchable-select-no-results">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={getOptionValue(option)}
                  className={`searchable-select-option ${getOptionValue(option) === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {renderOption ? renderOption(option) : getOptionLabel(option)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Bulk Operations Page
 * Super Admin only - provides bulk user/device management capabilities
 */
const BulkOperations = () => {
  const [activeTab, setActiveTab] = useState('users');
  const permissions = usePermissions();

  // Company and Site selection state
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState('');

  // Get filtered sites based on selected company
  const filteredSites = useMemo(() => {
    if (!selectedCompanyId) return [];
    return sites.filter(site => site.customerId === selectedCompanyId);
  }, [selectedCompanyId]);

  // Get selected company and site names for display
  const selectedCompany = customers.find(c => c.id === selectedCompanyId);
  const selectedSite = sites.find(s => s.id === selectedSiteId);

  // Check if selection is valid for operations - BOTH company AND site required
  const hasValidSelection = selectedCompanyId !== '' && selectedSiteId !== '';

  // Handle company change
  const handleCompanyChange = (companyId) => {
    setSelectedCompanyId(companyId);
    setSelectedSiteId(''); // Reset site when company changes
  };

  // Modal states
  const [bulkUserRegModalOpen, setBulkUserRegModalOpen] = useState(false);
  const [bulkDeviceRegModalOpen, setBulkDeviceRegModalOpen] = useState(false);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [bulkStatusType, setBulkStatusType] = useState('activate'); // 'activate' | 'suspend' | 'block'
  const [bulkPolicyModalOpen, setBulkPolicyModalOpen] = useState(false);
  const [bulkDeviceRenameModalOpen, setBulkDeviceRenameModalOpen] = useState(false);
  const [bulkResendPasswordModalOpen, setBulkResendPasswordModalOpen] = useState(false);

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleContext, setScheduleContext] = useState(null);

  // Handle schedule click for bulk operations
  const handleScheduleClick = (operationType, operationLabel) => {
    setScheduleContext({
      type: operationType,
      label: operationLabel,
      targetSummary: 'Configure in operation modal',
    });
    setScheduleModalOpen(true);
  };

  // Handle schedule confirm
  const handleScheduleConfirm = (scheduledDateTime) => {
    console.log('Scheduled for:', scheduledDateTime, 'Context:', scheduleContext);
    // This would integrate with the actual bulk operation flow
    setScheduleModalOpen(false);
    setScheduleContext(null);
  };

  // Handle bulk status change
  const openBulkStatusModal = (type) => {
    setBulkStatusType(type);
    setBulkStatusModalOpen(true);
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'devices', label: 'Devices', icon: FaWifi },
    { id: 'scheduled', label: 'Scheduled Tasks', icon: FaClock },
  ];

  // User operations configuration
  const userOperations = [
    {
      id: 'bulk-user-registration',
      icon: FaUserPlus,
      title: 'Bulk User Registration',
      description: 'Register multiple users at once using CSV upload.',
      buttonText: 'Upload CSV',
      variant: 'primary',
      onClick: () => setBulkUserRegModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRegisterUsers',
    },
    {
      id: 'bulk-activation',
      icon: FaUserCheck,
      title: 'Bulk User Activation',
      description: 'Activate multiple user accounts simultaneously.',
      buttonText: 'Select Users',
      variant: 'success',
      onClick: () => openBulkStatusModal('activate'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_activation', 'Bulk User Activation'),
      permission: 'canBulkActivateUsers',
    },
    {
      id: 'bulk-suspension',
      icon: FaUserSlash,
      title: 'Bulk User Suspension',
      description: 'Suspend multiple user accounts at once.',
      buttonText: 'Select Users',
      variant: 'warning',
      onClick: () => openBulkStatusModal('suspend'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_suspension', 'Bulk User Suspension'),
      permission: 'canBulkSuspendUsers',
    },
    {
      id: 'bulk-blocking',
      icon: FaBan,
      title: 'Bulk User Blocking',
      description: 'Block multiple user accounts permanently.',
      buttonText: 'Select Users',
      variant: 'danger',
      onClick: () => openBulkStatusModal('block'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_blocking', 'Bulk User Blocking'),
      permission: 'canBulkBlockUsers',
    },
    {
      id: 'bulk-policy-change',
      icon: FaExchangeAlt,
      title: 'Bulk Policy Change',
      description: 'Change policies for multiple users at once.',
      buttonText: 'Select Users',
      variant: 'info',
      onClick: () => setBulkPolicyModalOpen(true),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_policy_change', 'Bulk Policy Change'),
      permission: 'canBulkChangePolicies',
    },
    {
      id: 'bulk-resend-password',
      icon: FaKey,
      title: 'Bulk Resend Password',
      description: 'Resend password emails to multiple users.',
      buttonText: 'Select Users',
      variant: 'primary',
      onClick: () => setBulkResendPasswordModalOpen(true),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_resend_password', 'Bulk Resend Password'),
      permission: 'canBulkResendPasswords',
    },
  ];

  // Device operations configuration
  const deviceOperations = [
    {
      id: 'bulk-device-registration',
      icon: FaFileUpload,
      title: 'Bulk Device Registration',
      description: 'Register multiple devices using CSV upload.',
      buttonText: 'Upload CSV',
      variant: 'primary',
      onClick: () => setBulkDeviceRegModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRegisterDevices',
    },
    {
      id: 'bulk-device-rename',
      icon: FaEdit,
      title: 'Bulk Device Rename',
      description: 'Rename multiple devices using naming patterns.',
      buttonText: 'Select Devices',
      variant: 'info',
      onClick: () => setBulkDeviceRenameModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRenameDevices',
    },
  ];

  const renderOperationCards = (operations) => {
    return operations.map((op) => {
      const hasPermission = permissions[op.permission] === true;
      const isDisabled = !hasPermission || !hasValidSelection;
      const disabledReason = !hasPermission
        ? 'Super Admin Only'
        : !selectedCompanyId
        ? 'Select a company first'
        : !selectedSiteId
        ? 'Select a site first'
        : null;
      return (
        <BulkOperationCard
          key={op.id}
          icon={op.icon}
          title={op.title}
          description={op.description}
          buttonText={op.buttonText}
          variant={op.variant}
          onClick={op.onClick}
          supportsSchedule={op.supportsSchedule}
          onScheduleClick={op.onScheduleClick}
          disabled={isDisabled}
          roleRequired={disabledReason}
        />
      );
    });
  };

  return (
    <div className="bulk-operations-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaTasks className="page-title-icon" /> Bulk Operations
            </h1>
            <p className="page-subtitle">Perform batch actions on users and devices</p>
          </div>
        </div>
      </div>

      {/* Company/Site Selection */}
      <div className="bulk-ops-selection-bar">
        <div className="bulk-ops-selection-info">
          <FaInfoCircle className="selection-info-icon" />
          <span>Select a company and site to perform bulk operations on its users and devices</span>
        </div>
        <div className="bulk-ops-selection-controls">
          <SearchableSelect
            options={customers}
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            placeholder="Select a company..."
            searchPlaceholder="Search companies..."
            icon={FaBuilding}
            label="Company"
            getOptionLabel={(c) => `${c.name} (${c.type})`}
            getOptionValue={(c) => c.id}
            renderOption={(c) => (
              <div className="company-option">
                <span className="company-option-name">{c.name}</span>
                <span className="company-option-meta">
                  <span className="company-type-badge">{c.type}</span>
                  <span className="company-stats">{c.totalSites} sites • {c.totalUsers?.toLocaleString()} users</span>
                </span>
              </div>
            )}
          />
          <SearchableSelect
            options={filteredSites}
            value={selectedSiteId}
            onChange={setSelectedSiteId}
            placeholder={selectedCompanyId ? "Select a site..." : "Select company first"}
            searchPlaceholder="Search sites..."
            icon={FaMapMarkerAlt}
            label="Site (Required)"
            disabled={!selectedCompanyId}
            getOptionLabel={(s) => `${s.name} (${s.location})`}
            getOptionValue={(s) => s.id}
            renderOption={(s) => (
              <div className="site-option">
                <span className="site-option-name">{s.name}</span>
                <span className="site-option-meta">
                  <span className="site-location">{s.location}</span>
                  <span className="site-stats">{s.totalUsers?.toLocaleString() || 0} users • {s.totalDevices?.toLocaleString() || 0} devices</span>
                </span>
              </div>
            )}
          />
        </div>
        {hasValidSelection && (
          <div className="bulk-ops-selection-summary">
            <span className="selection-badge company">
              <FaBuilding /> {selectedCompany?.name}
            </span>
            <span className="selection-badge site">
              <FaMapMarkerAlt /> {selectedSite?.name}
            </span>
            <span className="selection-stats">
              {`${selectedSite?.totalUsers?.toLocaleString() || 0} users, ${selectedSite?.totalDevices?.toLocaleString() || 0} devices at this site`}
            </span>
          </div>
        )}
        {!hasValidSelection && (
          <div className="bulk-ops-selection-warning">
            <FaInfoCircle />
            <span>
              {!selectedCompanyId
                ? 'Please select a company to continue'
                : 'Please select a site to enable bulk operations'}
            </span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bulk-ops-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bulk-ops-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="bulk-ops-tab-icon" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bulk-ops-content">
        {activeTab === 'users' && (
          <div className="bulk-ops-section">
            <h2 className="bulk-ops-section-title">User Operations</h2>
            <p className="bulk-ops-section-desc">
              Manage multiple users at once with bulk operations
            </p>
            <div className="bulk-ops-grid">
              {renderOperationCards(userOperations)}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="bulk-ops-section">
            <h2 className="bulk-ops-section-title">Device Operations</h2>
            <p className="bulk-ops-section-desc">
              Manage multiple devices at once with bulk operations
            </p>
            <div className="bulk-ops-grid">
              {renderOperationCards(deviceOperations)}
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <ScheduledTasksPanel />
        )}
      </div>

      {/* Modals */}
      <BulkUserRegistration
        isOpen={bulkUserRegModalOpen}
        onClose={() => setBulkUserRegModalOpen(false)}
      />

      <BulkDeviceRegistration
        isOpen={bulkDeviceRegModalOpen}
        onClose={() => setBulkDeviceRegModalOpen(false)}
      />

      <BulkStatusChange
        isOpen={bulkStatusModalOpen}
        onClose={() => setBulkStatusModalOpen(false)}
        statusType={bulkStatusType}
      />

      <BulkPolicyChange
        isOpen={bulkPolicyModalOpen}
        onClose={() => setBulkPolicyModalOpen(false)}
      />

      <BulkDeviceRename
        isOpen={bulkDeviceRenameModalOpen}
        onClose={() => setBulkDeviceRenameModalOpen(false)}
      />

      <BulkResendPassword
        isOpen={bulkResendPasswordModalOpen}
        onClose={() => setBulkResendPasswordModalOpen(false)}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setScheduleContext(null);
        }}
        onSchedule={handleScheduleConfirm}
        operationType={scheduleContext?.label || 'Operation'}
        targetSummary={scheduleContext?.targetSummary || ''}
        title="Schedule Bulk Operation"
      />
    </div>
  );
};

export default BulkOperations;
