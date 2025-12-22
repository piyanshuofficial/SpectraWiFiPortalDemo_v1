// src/components/CustomerViewModal.js

/**
 * CustomerViewModal
 * Modal for selecting customer, site, and role to impersonate
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FiX,
  FiEye,
  FiUsers,
  FiMapPin,
  FiShield,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";
// FaBuilding removed - no longer needed
import {
  useCustomerView,
  IMPERSONATION_ROLES,
  IMPERSONATION_ROLE_LABELS,
  getAllCustomers,
  getSitesForSegment,
} from "../context/CustomerViewContext";
import { SEGMENT_LABELS } from "../context/SegmentContext";
import SearchableSelect from "./SearchableSelect";
import "./CustomerViewModal.css";

const CustomerViewModal = ({ isOpen, onClose, preselectedCustomer, preselectedSite }) => {
  const { enterCustomerView } = useCustomerView();

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedRole, setSelectedRole] = useState(IMPERSONATION_ROLES.ADMIN);
  const [viewCompanyLevel, setViewCompanyLevel] = useState(true);

  // Get all customers
  const customers = useMemo(() => getAllCustomers(), []);

  // Get sites for selected customer's segment
  const availableSites = useMemo(() => {
    if (!selectedCustomer) return [];
    return getSitesForSegment(selectedCustomer.segment);
  }, [selectedCustomer]);

  // Handle preselection
  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
      if (preselectedSite) {
        setSelectedSite(preselectedSite);
        setViewCompanyLevel(false);
      }
    }
  }, [preselectedCustomer, preselectedSite]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!preselectedCustomer) {
        setSelectedCustomer(null);
        setSelectedSite(null);
        setSelectedRole(IMPERSONATION_ROLES.ADMIN);
        setViewCompanyLevel(true);
      }
    }
  }, [isOpen, preselectedCustomer]);

  // Handle customer selection
  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId) || null;
    setSelectedCustomer(customer);
    setSelectedSite(null);
    setViewCompanyLevel(true);
  };

  // Handle site selection
  const handleSiteChange = (siteId) => {
    if (siteId === "company_level" || !siteId) {
      setSelectedSite(null);
      setViewCompanyLevel(true);
    } else {
      const site = availableSites.find((s) => s.siteId === siteId) || null;
      setSelectedSite(site);
      setViewCompanyLevel(false);
    }
  };

  // Prepare customer options for SearchableSelect
  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
      segment: SEGMENT_LABELS[customer.segment] || customer.segment,
      industry: customer.industry,
    }));
  }, [customers]);

  // Prepare site options for SearchableSelect (including company level option)
  const siteOptions = useMemo(() => {
    const options = availableSites.map((site) => ({
      value: site.siteId,
      label: site.siteName,
      city: site.city,
    }));
    return options;
  }, [availableSites]);

  // Custom render for customer options
  const renderCustomerOption = (option) => (
    <div className="option-with-icon">
      <div className="option-content">
        <span className="option-label">{option.label}</span>
        <span className="option-sublabel">{option.industry}</span>
      </div>
      <span className="option-badge">{option.segment}</span>
    </div>
  );

  // Custom render for site options
  const renderSiteOption = (option) => (
    <div className="option-with-icon">
      <div className="option-content">
        <span className="option-label">{option.label}</span>
        {option.city && <span className="option-sublabel">{option.city}</span>}
      </div>
    </div>
  );

  // Handle enter customer view
  const handleEnterView = () => {
    if (!selectedCustomer) return;

    enterCustomerView(
      selectedCustomer,
      viewCompanyLevel ? null : selectedSite,
      selectedRole
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="customer-view-modal-overlay" onClick={onClose}>
      <div
        className="customer-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
              <FiEye />
            </div>
            <div>
              <h2>View as Customer</h2>
              <p>Select a customer account to view their portal experience</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Selection */}
          <div className="form-group">
            <SearchableSelect
              options={customerOptions}
              value={selectedCustomer?.id || ""}
              onChange={handleCustomerChange}
              placeholder="Select a customer..."
              searchPlaceholder="Search customers..."
              icon={FiUsers}
              label="Customer Account"
              renderOption={renderCustomerOption}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              allowClear={false}
            />
          </div>

          {/* Customer Info Preview */}
          {selectedCustomer && (
            <div className="customer-preview">
              <div className="preview-item">
                <span className="preview-label">Segment</span>
                <span className="preview-value segment-badge">
                  {SEGMENT_LABELS[selectedCustomer.segment] || selectedCustomer.segment}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Industry</span>
                <span className="preview-value">{selectedCustomer.industry}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Total Sites</span>
                <span className="preview-value">{availableSites.length}</span>
              </div>
            </div>
          )}

          {/* Site Selection */}
          {selectedCustomer && (
            <div className="form-group">
              <SearchableSelect
                options={siteOptions}
                value={viewCompanyLevel ? "company_level" : selectedSite?.siteId || ""}
                onChange={handleSiteChange}
                placeholder="Select a site..."
                searchPlaceholder="Search sites..."
                icon={FiMapPin}
                label="View Level"
                renderOption={renderSiteOption}
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                allowClear={false}
                emptyOption={{ label: "Company Level (Aggregated View)", value: "company_level" }}
              />
              <span className="form-hint">
                {viewCompanyLevel
                  ? "View aggregated data across all sites"
                  : "View data for a specific site"}
              </span>
            </div>
          )}

          {/* Role Selection */}
          {selectedCustomer && (
            <div className="form-group">
              <label>
                <FiShield className="label-icon" />
                View as Role
              </label>
              <div className="role-options">
                {Object.entries(IMPERSONATION_ROLES).map(([key, value]) => (
                  <label
                    key={key}
                    className={`role-option ${selectedRole === value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={selectedRole === value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <span className="role-name">{IMPERSONATION_ROLE_LABELS[value]}</span>
                    <span className="role-description">
                      {getRoleDescription(value)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="info-banner">
            <FiInfo className="info-icon" />
            <div className="info-content">
              <strong>Read-Only Mode</strong>
              <p>
                While viewing as a customer, all actions will be disabled. You can
                only view the portal interface and data - no changes can be made.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleEnterView}
            disabled={!selectedCustomer}
          >
            <FiEye />
            Enter Customer View
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for role descriptions
const getRoleDescription = (role) => {
  switch (role) {
    case IMPERSONATION_ROLES.ADMIN:
      return "Full access to all features and settings";
    case IMPERSONATION_ROLES.MANAGER:
      return "Manage users, devices, and view reports";
    case IMPERSONATION_ROLES.USER:
      return "Basic access to view and limited actions";
    case IMPERSONATION_ROLES.VIEWER:
      return "Read-only access to dashboard and reports";
    default:
      return "";
  }
};

export default CustomerViewModal;
