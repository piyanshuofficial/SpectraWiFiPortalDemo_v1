// src/components/SiteProvisioningModal/SiteProvisioningModal.js

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaCheck,
  FaChevronRight,
  FaChevronLeft,
  FaSave,
  FaTrash,
  FaBuilding,
  FaUser,
  FaNetworkWired,
  FaShieldAlt,
  FaWifi,
  FaShoppingCart,
  FaCog,
  FaExclamationTriangle,
  FaClock,
  FaInfoCircle,
  FaBan,
  FaKey
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import useSiteProvisioningDraft from '../../hooks/useSiteProvisioningDraft';
import PolicySelectionTable from '../PolicySelectionTable/PolicySelectionTable';
import SSIDConfigSection from '../SSIDConfigSection/SSIDConfigSection';
import TopupConfigSection from '../TopupConfigSection/TopupConfigSection';
import {
  INDIAN_STATES,
  REGIONS,
  SOLUTION_TYPES,
  SITE_TYPES,
  PRODUCT_NAMES,
  BANDWIDTH_TYPES,
  TRAFFIC_FLOW_TYPES,
  WIRELESS_CONTROLLER_VERSIONS,
  AAA_CONTROLLERS,
  DEFAULT_DEVICE_LIMITS,
  PROVISIONING_STEPS,
  MASTER_POLICY_LIST,
  VALIDATION_RULES,
  AUTH_METHODS,
  getAuthCategoriesForSegment,
  getDefaultAuthConfig,
  validateAuthConfig,
  generateSiteId,
  generateAccountPrefix,
  getReportsForSolutionType,
  getPoliciesForSegment,
  isInternetManaged,
  areTopupsEnabled,
  isValidIP,
  isValidEmail,
  isValidPhone,
  isValidSSIDName,
  isValidSSIDPassword,
  isValidCity,
  isValidBandwidth,
  isValidLicenseCount,
  isValidDeviceLimit,
  isValidApCount,
  isValidSwitchCount,
  isValidPortCount,
  isValidContactName,
  isValidEmailList,
  isValidPhoneList
} from '../../constants/siteProvisioningConfig';
import './SiteProvisioningModal.css';

/**
 * SiteProvisioningModal Component
 * A comprehensive 7-step wizard for site provisioning with draft support.
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Callback when modal closes
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Array} customers - List of customers for selection
 */
const SiteProvisioningModal = ({
  isOpen,
  onClose,
  onSubmit,
  customers = []
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'anonymous';
  const isSuperAdmin = currentUser?.role === 'superAdmin' || currentUser?.role === 'admin';

  const {
    formData,
    currentStep,
    hasDraft,
    isDirty,
    updateFormData,
    updateField,
    updateNestedField,
    goToStep,
    nextStep,
    prevStep,
    isStepVisited,
    canNavigateToStep,
    restoreDraft,
    clearDraft,
    getLastSavedFormatted,
    saveDraft
  } = useSiteProvisioningDraft(userId);

  const [errors, setErrors] = useState({});
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Refs to track previous values for auto-generation (prevents infinite loops)
  const prevAutoGenRef = useRef({
    companyName: '',
    siteName: '',
    siteType: ''
  });

  // Check for draft on mount
  useEffect(() => {
    if (isOpen && hasDraft) {
      setShowDraftModal(true);
    }
  }, [isOpen, hasDraft]);

  // Get available policies for selected segment
  const availablePolicies = useMemo(() => {
    if (!formData.siteType) return MASTER_POLICY_LIST;
    return getPoliciesForSegment(formData.siteType);
  }, [formData.siteType]);

  // Auto-generate Site ID when company, site name, or siteType change
  // Uses ref comparison to prevent infinite loops
  useEffect(() => {
    const { companyName, siteName, siteType } = formData;
    const prev = prevAutoGenRef.current;

    // Only run if the trigger fields actually changed
    if (
      companyName && siteName && siteType &&
      (prev.companyName !== companyName || prev.siteName !== siteName || prev.siteType !== siteType)
    ) {
      const newSiteId = generateSiteId(companyName, siteName, siteType);
      updateField('siteId', newSiteId);
      updateField('domainId', newSiteId);

      // Update ref
      prevAutoGenRef.current = { companyName, siteName, siteType };
    }
  }, [formData.companyName, formData.siteName, formData.siteType, updateField]);

  // Auto-generate account prefix (only once when first available)
  useEffect(() => {
    if ((formData.companyName || formData.siteName) && !formData.accountPrefix) {
      const prefix = generateAccountPrefix(formData.companyName, formData.siteName);
      updateField('accountPrefix', prefix);
    }
  }, [formData.companyName, formData.siteName, formData.accountPrefix, updateField]);

  // Auto-set default reports when segment or solution type changes
  const prevReportConfig = useRef({ siteType: '', solutionType: '' });
  useEffect(() => {
    if (formData.siteType &&
        (formData.siteType !== prevReportConfig.current.siteType ||
         formData.solutionType !== prevReportConfig.current.solutionType)) {
      prevReportConfig.current = { siteType: formData.siteType, solutionType: formData.solutionType };
      // Always update reports when solution type changes
      const defaultReports = getReportsForSolutionType(formData.siteType, formData.solutionType);
      const selectedIds = defaultReports.filter(r => r.selected).map(r => r.id);
      updateField('selectedReports', selectedIds);
    }
  }, [formData.siteType, formData.solutionType, updateField]);

  // Auto-set device limit when segment changes
  const prevSiteTypeForDevices = useRef('');
  useEffect(() => {
    if (formData.siteType && formData.siteType !== prevSiteTypeForDevices.current) {
      prevSiteTypeForDevices.current = formData.siteType;
      const defaultLimit = DEFAULT_DEVICE_LIMITS[formData.siteType] || 10;
      if (formData.registeredDeviceLimit === 10) {
        updateField('registeredDeviceLimit', defaultLimit);
      }
    }
  }, [formData.siteType, formData.registeredDeviceLimit, updateField]);

  // Auto-set default authentication config when segment changes
  const prevSiteTypeForAuth = useRef('');
  useEffect(() => {
    if (formData.siteType && formData.siteType !== prevSiteTypeForAuth.current) {
      prevSiteTypeForAuth.current = formData.siteType;
      // Only set defaults if authenticationConfig is empty
      const currentConfig = formData.authenticationConfig || {};
      if (Object.keys(currentConfig).length === 0) {
        const defaultAuthConfig = getDefaultAuthConfig(formData.siteType);
        updateField('authenticationConfig', defaultAuthConfig);
      }
    }
  }, [formData.siteType, formData.authenticationConfig, updateField]);

  // Validate current step
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Site Information
        if (!formData.companyId && !formData.companyName) {
          newErrors.companyId = 'Please select a company';
        }
        if (!formData.siteName?.trim()) {
          newErrors.siteName = 'Site name is required';
        } else if (formData.siteName.length < VALIDATION_RULES.siteName.minLength) {
          newErrors.siteName = `Site name must be at least ${VALIDATION_RULES.siteName.minLength} characters`;
        } else if (formData.siteName.length > VALIDATION_RULES.siteName.maxLength) {
          newErrors.siteName = `Site name cannot exceed ${VALIDATION_RULES.siteName.maxLength} characters`;
        } else if (!VALIDATION_RULES.siteName.pattern.test(formData.siteName)) {
          newErrors.siteName = VALIDATION_RULES.siteName.message;
        }
        if (!formData.siteType) {
          newErrors.siteType = 'Please select a site type';
        }
        if (!formData.city?.trim()) {
          newErrors.city = 'City is required';
        } else if (!isValidCity(formData.city)) {
          newErrors.city = VALIDATION_RULES.city.message;
        }
        if (!formData.state) {
          newErrors.state = 'Please select a state';
        }
        if (!formData.region) {
          newErrors.region = 'Please select a region';
        }
        if (formData.accountPrefix) {
          if (formData.accountPrefix.length < VALIDATION_RULES.accountPrefix.minLength ||
              formData.accountPrefix.length > VALIDATION_RULES.accountPrefix.maxLength) {
            newErrors.accountPrefix = `Account prefix must be ${VALIDATION_RULES.accountPrefix.minLength}-${VALIDATION_RULES.accountPrefix.maxLength} characters`;
          } else if (!VALIDATION_RULES.accountPrefix.pattern.test(formData.accountPrefix)) {
            newErrors.accountPrefix = VALIDATION_RULES.accountPrefix.message;
          }
        }
        break;

      case 2: // Contact & Notifications
        if (!formData.primaryContactName?.trim()) {
          newErrors.primaryContactName = 'Contact name is required';
        } else if (!isValidContactName(formData.primaryContactName)) {
          newErrors.primaryContactName = VALIDATION_RULES.contactName.message;
        }
        if (!formData.primaryContactEmail?.trim()) {
          newErrors.primaryContactEmail = 'Contact email is required';
        } else if (!isValidEmail(formData.primaryContactEmail)) {
          newErrors.primaryContactEmail = VALIDATION_RULES.email.message;
        }
        if (!formData.primaryContactPhone?.trim()) {
          newErrors.primaryContactPhone = 'Contact phone is required';
        } else if (!isValidPhone(formData.primaryContactPhone)) {
          newErrors.primaryContactPhone = VALIDATION_RULES.phone.message;
        }
        // Validate CC email list
        if (formData.emailCc && formData.emailCc.length > 0) {
          if (!isValidEmailList(formData.emailCc)) {
            newErrors.emailCc = 'One or more CC email addresses are invalid';
          }
        }
        // Validate SMS CC list
        if (formData.smsCc && formData.smsCc.length > 0) {
          if (!isValidPhoneList(formData.smsCc)) {
            newErrors.smsCc = 'One or more CC phone numbers are invalid';
          }
        }
        break;

      case 3: // Bandwidth & Licenses
        if (!formData.bandwidthType) {
          newErrors.bandwidthType = 'Please select bandwidth type';
        }
        if (formData.bandwidthType === 'fixed') {
          if (!formData.fixedBandwidth) {
            newErrors.fixedBandwidth = 'Please enter bandwidth value';
          } else if (!isValidBandwidth(formData.fixedBandwidth)) {
            newErrors.fixedBandwidth = VALIDATION_RULES.bandwidth.message;
          }
        }
        if (formData.bandwidthType === 'userLevel' && formData.selectedPolicies.length === 0) {
          newErrors.selectedPolicies = 'Please select at least one policy';
        }
        if (!formData.overallLicenseCount || formData.overallLicenseCount <= 0) {
          newErrors.overallLicenseCount = 'Overall license count must be greater than 0';
        } else if (!isValidLicenseCount(formData.overallLicenseCount)) {
          newErrors.overallLicenseCount = VALIDATION_RULES.licenseCount.message;
        }
        // Validate device limit
        if (formData.registeredDeviceLimit && !isValidDeviceLimit(formData.registeredDeviceLimit)) {
          newErrors.registeredDeviceLimit = VALIDATION_RULES.deviceLimit.message;
        }
        break;

      case 4: // Network Infrastructure
        // NAS IP is required only for Managed WiFi (internet managed by Spectra)
        const internetManaged = isInternetManaged(formData.solutionType);
        if (internetManaged) {
          if (!formData.nasIpPrimary?.trim()) {
            newErrors.nasIpPrimary = 'Primary NAS IP is required';
          } else if (!isValidIP(formData.nasIpPrimary)) {
            newErrors.nasIpPrimary = VALIDATION_RULES.ipAddress.message;
          }
        } else {
          // For Managed WiFi Infra, NAS IP is optional but validate if provided
          if (formData.nasIpPrimary && !isValidIP(formData.nasIpPrimary)) {
            newErrors.nasIpPrimary = VALIDATION_RULES.ipAddress.message;
          }
        }
        if (formData.nasIpSecondary && !isValidIP(formData.nasIpSecondary)) {
          newErrors.nasIpSecondary = VALIDATION_RULES.ipAddress.message;
        }
        if (formData.nasIpTertiary && !isValidIP(formData.nasIpTertiary)) {
          newErrors.nasIpTertiary = VALIDATION_RULES.ipAddress.message;
        }
        if (formData.nasIpQuaternary && !isValidIP(formData.nasIpQuaternary)) {
          newErrors.nasIpQuaternary = VALIDATION_RULES.ipAddress.message;
        }
        if (formData.trafficFlowIp && !isValidIP(formData.trafficFlowIp)) {
          newErrors.trafficFlowIp = VALIDATION_RULES.ipAddress.message;
        }

        // Validate Infrastructure Equipment
        const infra = formData.infrastructure || {};

        // Access Point validations
        if (infra.deployedApCount !== undefined && infra.deployedApCount !== '' && !isValidApCount(infra.deployedApCount)) {
          newErrors.deployedApCount = VALIDATION_RULES.apCount.message;
        }
        if (infra.liveApCount !== undefined && infra.liveApCount !== '' && !isValidApCount(infra.liveApCount)) {
          newErrors.liveApCount = VALIDATION_RULES.apCount.message;
        }
        if (infra.indoorApCount !== undefined && infra.indoorApCount !== '' && !isValidApCount(infra.indoorApCount)) {
          newErrors.indoorApCount = VALIDATION_RULES.apCount.message;
        }
        if (infra.outdoorApCount !== undefined && infra.outdoorApCount !== '' && !isValidApCount(infra.outdoorApCount)) {
          newErrors.outdoorApCount = VALIDATION_RULES.apCount.message;
        }

        // Validate that indoor + outdoor doesn't exceed deployed
        const totalIndoorOutdoor = (parseInt(infra.indoorApCount) || 0) + (parseInt(infra.outdoorApCount) || 0);
        const deployedAps = parseInt(infra.deployedApCount) || 0;
        if (totalIndoorOutdoor > 0 && deployedAps > 0 && totalIndoorOutdoor > deployedAps) {
          newErrors.indoorApCount = 'Indoor + Outdoor APs cannot exceed deployed AP count';
        }

        // Validate live AP count doesn't exceed deployed
        const liveAps = parseInt(infra.liveApCount) || 0;
        if (liveAps > 0 && deployedAps > 0 && liveAps > deployedAps) {
          newErrors.liveApCount = 'Live AP count cannot exceed deployed AP count';
        }

        // PoE Switch validations
        if (infra.poeSwitchCount !== undefined && infra.poeSwitchCount !== '' && !isValidSwitchCount(infra.poeSwitchCount)) {
          newErrors.poeSwitchCount = VALIDATION_RULES.switchCount.message;
        }
        if (infra.livePoeSwitchCount !== undefined && infra.livePoeSwitchCount !== '' && !isValidSwitchCount(infra.livePoeSwitchCount)) {
          newErrors.livePoeSwitchCount = VALIDATION_RULES.switchCount.message;
        }

        // Validate live switch count doesn't exceed total
        const totalSwitches = parseInt(infra.poeSwitchCount) || 0;
        const liveSwitches = parseInt(infra.livePoeSwitchCount) || 0;
        if (liveSwitches > 0 && totalSwitches > 0 && liveSwitches > totalSwitches) {
          newErrors.livePoeSwitchCount = 'Live switch count cannot exceed total switch count';
        }

        // Port count validations
        if (infra.totalPoePorts !== undefined && infra.totalPoePorts !== '' && !isValidPortCount(infra.totalPoePorts)) {
          newErrors.totalPoePorts = VALIDATION_RULES.portCount.message;
        }
        if (infra.usedPoePorts !== undefined && infra.usedPoePorts !== '' && !isValidPortCount(infra.usedPoePorts)) {
          newErrors.usedPoePorts = VALIDATION_RULES.portCount.message;
        }

        // Validate used ports doesn't exceed total
        const totalPorts = parseInt(infra.totalPoePorts) || 0;
        const usedPorts = parseInt(infra.usedPoePorts) || 0;
        if (usedPorts > 0 && totalPorts > 0 && usedPorts > totalPorts) {
          newErrors.usedPoePorts = 'Used ports cannot exceed total ports';
        }
        break;

      case 5: // Firewall & API - Optional, no required fields
        // Validate firewall config if enabled
        if (formData.firewallConfig?.enabled) {
          if (formData.firewallConfig.organizationId &&
              !VALIDATION_RULES.serviceId.pattern.test(formData.firewallConfig.organizationId)) {
            newErrors.firewallOrganizationId = 'Invalid organization ID format';
          }
          if (formData.firewallConfig.applianceId &&
              !VALIDATION_RULES.serviceId.pattern.test(formData.firewallConfig.applianceId)) {
            newErrors.firewallApplianceId = 'Invalid appliance ID format';
          }
        }
        break;

      case 6: // SSID & Features
        if (!formData.ssidConfigs || formData.ssidConfigs.length === 0) {
          newErrors.ssidConfigs = 'At least one SSID is required';
        } else {
          formData.ssidConfigs.forEach(ssid => {
            if (!ssid.category) {
              newErrors[`ssid_${ssid.id}_category`] = 'Category is required';
            }
            if (!ssid.ssidName?.trim()) {
              newErrors[`ssid_${ssid.id}_ssidName`] = 'SSID name is required';
            } else if (!isValidSSIDName(ssid.ssidName)) {
              newErrors[`ssid_${ssid.id}_ssidName`] = VALIDATION_RULES.ssidName.message;
            }
            if (!ssid.ssidPassword?.trim()) {
              newErrors[`ssid_${ssid.id}_ssidPassword`] = 'SSID password is required';
            } else if (!isValidSSIDPassword(ssid.ssidPassword)) {
              newErrors[`ssid_${ssid.id}_ssidPassword`] = VALIDATION_RULES.ssidPassword.message;
            }
          });
        }
        break;

      case 7: // Top-ups - Validation for enabled top-ups
        if (formData.bandwidthType === 'userLevel' && areTopupsEnabled(formData.solutionType)) {
          Object.entries(formData.topups || {}).forEach(([key, config]) => {
            if (config.enabled) {
              // For new pack-based structure
              if (config.packs && config.packs.length === 0) {
                newErrors[`topup_${key}_packs`] = 'Please select at least one pack for enabled top-up';
              }
              // For legacy structure
              if (config.policyId === undefined && (!config.packs || config.packs.length === 0)) {
                newErrors[`topup_${key}_policyId`] = 'Please select a top-up policy';
              }
            }
          });
        }
        break;

      case 8: // Authentication Configuration
        if (formData.siteType) {
          const authValidation = validateAuthConfig(formData.authenticationConfig || {}, formData.siteType);
          if (!authValidation.isValid) {
            authValidation.errors.forEach(err => {
              newErrors[`auth_${err.categoryId}`] = err.message;
            });
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        nextStep();
      }
    }
  }, [currentStep, validateStep, nextStep]);

  // Handle step click
  const handleStepClick = useCallback((step) => {
    if (canNavigateToStep(step)) {
      if (step < currentStep || validateStep(currentStep)) {
        goToStep(step);
      }
    }
  }, [canNavigateToStep, currentStep, validateStep, goToStep]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate all steps
    let allValid = true;
    for (let step = 1; step <= 8; step++) {
      if (!validateStep(step)) {
        allValid = false;
        goToStep(step);
        break;
      }
    }

    if (!allValid) return;

    setSubmitting(true);
    try {
      await onSubmit?.(formData);
      clearDraft();
      onClose?.();
    } catch (error) {
      console.error('Site provisioning failed:', error);
    } finally {
      setSubmitting(false);
    }
  }, [validateStep, goToStep, formData, onSubmit, clearDraft, onClose]);

  // Handle draft restore
  const handleRestoreDraft = useCallback(() => {
    restoreDraft();
    setShowDraftModal(false);
  }, [restoreDraft]);

  // Handle start fresh
  const handleStartFresh = useCallback(() => {
    clearDraft();
    setShowDraftModal(false);
  }, [clearDraft]);

  // Handle close
  const handleClose = useCallback(() => {
    if (isDirty) {
      saveDraft();
    }
    onClose?.();
  }, [isDirty, saveDraft, onClose]);

  // Step icons
  const stepIcons = {
    1: FaBuilding,
    2: FaUser,
    3: FaCog,
    4: FaNetworkWired,
    5: FaShieldAlt,
    6: FaWifi,
    7: FaShoppingCart,
    8: FaKey
  };

  if (!isOpen) return null;

  // Use createPortal to render modal at document body level
  // This ensures proper z-index stacking context (fixes sidebar overlap issue)
  return createPortal(
    <div className="site-provision-modal-overlay">
      {/* Draft Recovery Modal */}
      {showDraftModal && (
        <div className="draft-recovery-modal">
          <div className="draft-recovery-content">
            <FaClock className="draft-icon" />
            <h3>Resume Previous Session?</h3>
            <p>
              You have an unsaved draft from your previous session.
              {getLastSavedFormatted() && (
                <span className="draft-time"> Last saved: {getLastSavedFormatted()}</span>
              )}
            </p>
            <div className="draft-recovery-actions">
              <button className="btn-secondary" onClick={handleStartFresh}>
                <FaTrash /> Start Fresh
              </button>
              <button className="btn-primary" onClick={handleRestoreDraft}>
                <FaSave /> Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="site-provision-modal">
        {/* Header */}
        <div className="spm-header">
          <h2>Site Provisioning</h2>
          <button className="spm-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="spm-steps">
          {PROVISIONING_STEPS.map((step) => {
            const StepIcon = stepIcons[step.id];
            const isActive = currentStep === step.id;
            const isCompleted = isStepVisited(step.id) && step.id < currentStep;
            const isClickable = canNavigateToStep(step.id);

            return (
              <div
                key={step.id}
                className={`spm-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="spm-step-icon">
                  {isCompleted ? <FaCheck /> : <StepIcon />}
                </div>
                <div className="spm-step-info">
                  <span className="spm-step-title">{step.title}</span>
                  <span className="spm-step-desc">{step.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="spm-content">
          {/* Step 1: Basic Site Information */}
          {currentStep === 1 && (
            <div className="spm-step-content">
              <h3>Basic Site Information</h3>

              <div className="spm-form-grid">
                <div className={`spm-form-group ${errors.companyId ? 'has-error' : ''}`}>
                  <label>Company <span className="required">*</span></label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => {
                      const selected = customers.find(c => c.id === e.target.value);
                      updateFormData({
                        companyId: e.target.value,
                        companyName: selected?.name || e.target.value
                      });
                    }}
                  >
                    <option value="">Select company</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  {errors.companyId && <span className="error-text">{errors.companyId}</span>}
                </div>

                <div className={`spm-form-group ${errors.siteName ? 'has-error' : ''}`}>
                  <label>Site Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    placeholder="Enter site name"
                  />
                  {errors.siteName && <span className="error-text">{errors.siteName}</span>}
                </div>

                <div className="spm-form-group">
                  <label>Site ID</label>
                  <input
                    type="text"
                    value={formData.siteId}
                    readOnly
                    className="readonly-input"
                  />
                  <span className="field-hint">Auto-generated</span>
                </div>

                <div className={`spm-form-group ${errors.solutionType ? 'has-error' : ''}`}>
                  <label>Solution Type <span className="required">*</span></label>
                  <select
                    value={formData.solutionType}
                    onChange={(e) => updateField('solutionType', e.target.value)}
                  >
                    {SOLUTION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formData.solutionType && (
                    <span className="field-hint">
                      {SOLUTION_TYPES.find(t => t.value === formData.solutionType)?.description}
                    </span>
                  )}
                  {errors.solutionType && <span className="error-text">{errors.solutionType}</span>}
                </div>

                <div className="spm-form-group">
                  <label>Product Name</label>
                  <select
                    value={formData.productName}
                    onChange={(e) => updateField('productName', e.target.value)}
                  >
                    <option value="">Select product</option>
                    {PRODUCT_NAMES.map(product => (
                      <option key={product.value} value={product.value}>
                        {product.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="spm-form-group">
                  <label>Contract Name</label>
                  <input
                    type="text"
                    value={formData.contractName}
                    onChange={(e) => updateField('contractName', e.target.value)}
                    placeholder="Contract name (flows to billing)"
                  />
                </div>

                <div className={`spm-form-group ${errors.siteType ? 'has-error' : ''}`}>
                  <label>Site Type / Segment <span className="required">*</span></label>
                  <select
                    value={formData.siteType}
                    onChange={(e) => updateField('siteType', e.target.value)}
                  >
                    <option value="">Select site type</option>
                    {SITE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.siteType && <span className="error-text">{errors.siteType}</span>}
                </div>

                <div className={`spm-form-group ${errors.city ? 'has-error' : ''}`}>
                  <label>City <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Enter city"
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className={`spm-form-group ${errors.state ? 'has-error' : ''}`}>
                  <label>State <span className="required">*</span></label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>

                <div className={`spm-form-group ${errors.region ? 'has-error' : ''}`}>
                  <label>Region <span className="required">*</span></label>
                  <select
                    value={formData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                  >
                    <option value="">Select region</option>
                    {REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <span className="error-text">{errors.region}</span>}
                </div>

                <div className="spm-form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>

                <div className={`spm-form-group ${errors.accountPrefix ? 'has-error' : ''}`}>
                  <label>Account Prefix</label>
                  <input
                    type="text"
                    value={formData.accountPrefix}
                    onChange={(e) => updateField('accountPrefix', e.target.value.toUpperCase())}
                    placeholder="4-6 character prefix"
                    maxLength={6}
                  />
                  <span className="field-hint">Auto-generated, 4-6 uppercase characters</span>
                  {errors.accountPrefix && <span className="error-text">{errors.accountPrefix}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Notifications */}
          {currentStep === 2 && (
            <div className="spm-step-content">
              <h3>Contact & Notifications</h3>

              <div className="spm-form-grid">
                <div className={`spm-form-group ${errors.primaryContactName ? 'has-error' : ''}`}>
                  <label>Primary Contact Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.primaryContactName}
                    onChange={(e) => updateField('primaryContactName', e.target.value)}
                    placeholder="Enter contact name"
                  />
                  {errors.primaryContactName && <span className="error-text">{errors.primaryContactName}</span>}
                </div>

                <div className={`spm-form-group ${errors.primaryContactEmail ? 'has-error' : ''}`}>
                  <label>Primary Contact Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => updateField('primaryContactEmail', e.target.value)}
                    placeholder="email@example.com"
                  />
                  {errors.primaryContactEmail && <span className="error-text">{errors.primaryContactEmail}</span>}
                </div>

                <div className={`spm-form-group ${errors.primaryContactPhone ? 'has-error' : ''}`}>
                  <label>Primary Contact Phone <span className="required">*</span></label>
                  <input
                    type="tel"
                    value={formData.primaryContactPhone}
                    onChange={(e) => updateField('primaryContactPhone', e.target.value)}
                    placeholder="+91-9876543210"
                  />
                  {errors.primaryContactPhone && <span className="error-text">{errors.primaryContactPhone}</span>}
                </div>

                <div className="spm-form-group">
                  <label>Email Alerts</label>
                  <div className="toggle-wrapper">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.emailAlertEnabled}
                        onChange={(e) => updateField('emailAlertEnabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">{formData.emailAlertEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>

                <div className={`spm-form-group full-width ${errors.emailCc ? 'has-error' : ''}`}>
                  <label>Email CC (Optional)</label>
                  <input
                    type="text"
                    value={formData.emailCc.join(', ')}
                    onChange={(e) => updateField('emailCc', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Enter comma-separated email addresses"
                  />
                  {errors.emailCc ? (
                    <span className="error-text">{errors.emailCc}</span>
                  ) : (
                    <span className="field-hint">Additional email addresses for notifications</span>
                  )}
                </div>

                <div className={`spm-form-group full-width ${errors.smsCc ? 'has-error' : ''}`}>
                  <label>SMS CC (Optional)</label>
                  <input
                    type="text"
                    value={formData.smsCc.join(', ')}
                    onChange={(e) => updateField('smsCc', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Enter comma-separated mobile numbers"
                  />
                  {errors.smsCc ? (
                    <span className="error-text">{errors.smsCc}</span>
                  ) : (
                    <span className="field-hint">Additional mobile numbers for SMS notifications</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bandwidth & License Configuration */}
          {currentStep === 3 && (
            <div className="spm-step-content">
              <h3>Bandwidth & License Configuration</h3>

              <div className="spm-form-section">
                <h4>Bandwidth Type</h4>
                <div className={`spm-radio-group ${errors.bandwidthType ? 'has-error' : ''}`}>
                  {BANDWIDTH_TYPES.map(type => (
                    <label key={type.value} className="spm-radio-item">
                      <input
                        type="radio"
                        name="bandwidthType"
                        value={type.value}
                        checked={formData.bandwidthType === type.value}
                        onChange={(e) => updateField('bandwidthType', e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-label">{type.label}</span>
                    </label>
                  ))}
                </div>
                {errors.bandwidthType && <span className="error-text">{errors.bandwidthType}</span>}
              </div>

              {formData.bandwidthType === 'fixed' && (
                <div className={`spm-form-group ${errors.fixedBandwidth ? 'has-error' : ''}`}>
                  <label>Fixed Bandwidth (Mbps) <span className="required">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={formData.fixedBandwidth}
                    onChange={(e) => updateField('fixedBandwidth', e.target.value)}
                    placeholder="Enter bandwidth in Mbps"
                  />
                  {errors.fixedBandwidth && <span className="error-text">{errors.fixedBandwidth}</span>}
                </div>
              )}

              {formData.bandwidthType === 'userLevel' && (
                <div className="spm-form-section">
                  <h4>User Policies</h4>
                  <p className="section-description">
                    Select the policies available for users at this site. Configure license limits per policy.
                  </p>
                  {errors.selectedPolicies && (
                    <div className="error-banner">
                      <FaExclamationTriangle /> {errors.selectedPolicies}
                    </div>
                  )}
                  <PolicySelectionTable
                    policies={availablePolicies}
                    selectedPolicies={formData.selectedPolicies}
                    onSelectionChange={(policies) => updateField('selectedPolicies', policies)}
                    segment={formData.siteType}
                  />
                </div>
              )}

              <div className="spm-form-grid">
                <div className={`spm-form-group ${errors.overallLicenseCount ? 'has-error' : ''}`}>
                  <label>Overall License Count <span className="required">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={formData.overallLicenseCount}
                    onChange={(e) => updateField('overallLicenseCount', parseInt(e.target.value) || 0)}
                    placeholder="Total licenses for this site"
                  />
                  {errors.overallLicenseCount && <span className="error-text">{errors.overallLicenseCount}</span>}
                </div>

                <div className="spm-form-group">
                  <label>
                    Registered Device Limit
                    {!isSuperAdmin && <span className="admin-only-badge">Super Admin Only</span>}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.registeredDeviceLimit}
                    onChange={(e) => updateField('registeredDeviceLimit', parseInt(e.target.value) || 10)}
                    disabled={!isSuperAdmin}
                    className={!isSuperAdmin ? 'disabled-input' : ''}
                  />
                  <span className="field-hint">Default: 10 per segment</span>
                </div>

                <div className="spm-form-group">
                  <label>Display Device Count</label>
                  <div className="toggle-wrapper">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.displayDeviceCount}
                        onChange={(e) => updateField('displayDeviceCount', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">{formData.displayDeviceCount ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Network Infrastructure */}
          {currentStep === 4 && (
            <div className="spm-step-content">
              <h3>Network Infrastructure</h3>

              {!isInternetManaged(formData.solutionType) && (
                <div className="info-message">
                  <FaExclamationTriangle />
                  <div>
                    <strong>Managed WiFi Infra Mode</strong>
                    <p>Internet is not managed by Spectra for this site. Network IP fields are optional. You may provide IP addresses for monitoring purposes if available.</p>
                  </div>
                </div>
              )}

              <div className="spm-form-grid">
                <div className="spm-form-group">
                  <label>Wireless Controller ID</label>
                  <input
                    type="text"
                    value={formData.wirelessControllerId}
                    onChange={(e) => updateField('wirelessControllerId', e.target.value)}
                    placeholder="Enter controller ID"
                  />
                </div>

                <div className="spm-form-group">
                  <label>Wireless Controller Version</label>
                  <select
                    value={formData.wirelessControllerVersion}
                    onChange={(e) => updateField('wirelessControllerVersion', e.target.value)}
                  >
                    <option value="">Select version</option>
                    {WIRELESS_CONTROLLER_VERSIONS.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div className="spm-form-group">
                  <label>AAA Controller</label>
                  <select
                    value={formData.aaaController}
                    onChange={(e) => updateField('aaaController', e.target.value)}
                  >
                    <option value="">Select AAA controller</option>
                    {AAA_CONTROLLERS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="spm-form-group">
                  <label>Access Controller ID</label>
                  <input
                    type="text"
                    value={formData.accessControllerId}
                    onChange={(e) => updateField('accessControllerId', e.target.value)}
                    placeholder="Enter access controller ID"
                  />
                </div>

                <div className="spm-form-group">
                  <label>Service ID</label>
                  <input
                    type="text"
                    value={formData.serviceId}
                    onChange={(e) => updateField('serviceId', e.target.value)}
                    placeholder="Enter service ID"
                  />
                </div>
              </div>

              <h4>NAS IP Configuration</h4>
              <div className="spm-form-grid">
                <div className={`spm-form-group ${errors.nasIpPrimary ? 'has-error' : ''}`}>
                  <label>
                    NAS IP: Primary
                    {isInternetManaged(formData.solutionType) ? (
                      <span className="required">*</span>
                    ) : (
                      <span className="optional-badge"> (Optional - for monitoring)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.nasIpPrimary}
                    onChange={(e) => updateField('nasIpPrimary', e.target.value)}
                    placeholder={isInternetManaged(formData.solutionType) ? "192.168.1.1" : "Optional - Enter if available"}
                  />
                  {errors.nasIpPrimary && <span className="error-text">{errors.nasIpPrimary}</span>}
                </div>

                <div className={`spm-form-group ${errors.nasIpSecondary ? 'has-error' : ''}`}>
                  <label>NAS IP: Secondary</label>
                  <input
                    type="text"
                    value={formData.nasIpSecondary}
                    onChange={(e) => updateField('nasIpSecondary', e.target.value)}
                    placeholder="Optional"
                  />
                  {errors.nasIpSecondary && <span className="error-text">{errors.nasIpSecondary}</span>}
                </div>

                <div className={`spm-form-group ${errors.nasIpTertiary ? 'has-error' : ''}`}>
                  <label>NAS IP: Tertiary</label>
                  <input
                    type="text"
                    value={formData.nasIpTertiary}
                    onChange={(e) => updateField('nasIpTertiary', e.target.value)}
                    placeholder="Optional"
                  />
                  {errors.nasIpTertiary && <span className="error-text">{errors.nasIpTertiary}</span>}
                </div>

                <div className={`spm-form-group ${errors.nasIpQuaternary ? 'has-error' : ''}`}>
                  <label>NAS IP: Quaternary</label>
                  <input
                    type="text"
                    value={formData.nasIpQuaternary}
                    onChange={(e) => updateField('nasIpQuaternary', e.target.value)}
                    placeholder="Optional"
                  />
                  {errors.nasIpQuaternary && <span className="error-text">{errors.nasIpQuaternary}</span>}
                </div>
              </div>

              <h4>Traffic Flow Configuration</h4>
              <div className="spm-form-grid">
                <div className="spm-form-group">
                  <label>Bandwidth Traffic Flow Type</label>
                  <select
                    value={formData.trafficFlowType}
                    onChange={(e) => updateField('trafficFlowType', e.target.value)}
                  >
                    <option value="">Select traffic flow type</option>
                    {TRAFFIC_FLOW_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className={`spm-form-group ${errors.trafficFlowIp ? 'has-error' : ''}`}>
                  <label>Traffic Flow / Solution IP</label>
                  <input
                    type="text"
                    value={formData.trafficFlowIp}
                    onChange={(e) => updateField('trafficFlowIp', e.target.value)}
                    placeholder="IP address"
                  />
                  {errors.trafficFlowIp && <span className="error-text">{errors.trafficFlowIp}</span>}
                </div>
              </div>

              <h4>Infrastructure Equipment</h4>
              <div className="spm-form-section infrastructure-section">
                <h5>Access Points</h5>
                <div className="spm-form-grid">
                  <div className="spm-form-group">
                    <label>AP Vendor</label>
                    <select
                      value={formData.infrastructure?.apVendor || ''}
                      onChange={(e) => updateNestedField('infrastructure', 'apVendor', e.target.value)}
                    >
                      <option value="">Select AP vendor</option>
                      <option value="cisco">Cisco</option>
                      <option value="aruba">Aruba (HPE)</option>
                      <option value="ruckus">Ruckus (CommScope)</option>
                      <option value="ubiquiti">Ubiquiti</option>
                      <option value="cambium">Cambium Networks</option>
                      <option value="tp_link">TP-Link Omada</option>
                      <option value="meraki">Cisco Meraki</option>
                      <option value="fortinet">Fortinet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="spm-form-group">
                    <label>AP Model</label>
                    <input
                      type="text"
                      value={formData.infrastructure?.apModel || ''}
                      onChange={(e) => updateNestedField('infrastructure', 'apModel', e.target.value)}
                      placeholder="Enter AP model"
                    />
                  </div>

                  <div className={`spm-form-group ${errors.deployedApCount ? 'has-error' : ''}`}>
                    <label>Deployed AP Count</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.infrastructure?.deployedApCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'deployedApCount', parseInt(e.target.value) || 0)}
                      placeholder="Total APs to deploy"
                    />
                    {errors.deployedApCount ? (
                      <span className="error-text">{errors.deployedApCount}</span>
                    ) : (
                      <span className="field-hint">Total number of access points at site (max 1000)</span>
                    )}
                  </div>

                  <div className={`spm-form-group ${errors.liveApCount ? 'has-error' : ''}`}>
                    <label>Live AP Count</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.infrastructure?.liveApCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'liveApCount', parseInt(e.target.value) || 0)}
                      placeholder="Currently online APs"
                    />
                    {errors.liveApCount && <span className="error-text">{errors.liveApCount}</span>}
                  </div>

                  <div className={`spm-form-group ${errors.indoorApCount ? 'has-error' : ''}`}>
                    <label>Indoor APs</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.infrastructure?.indoorApCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'indoorApCount', parseInt(e.target.value) || 0)}
                    />
                    {errors.indoorApCount && <span className="error-text">{errors.indoorApCount}</span>}
                  </div>

                  <div className={`spm-form-group ${errors.outdoorApCount ? 'has-error' : ''}`}>
                    <label>Outdoor APs</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.infrastructure?.outdoorApCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'outdoorApCount', parseInt(e.target.value) || 0)}
                    />
                    {errors.outdoorApCount && <span className="error-text">{errors.outdoorApCount}</span>}
                  </div>
                </div>
              </div>

              <div className="spm-form-section infrastructure-section">
                <h5>PoE Switches</h5>
                <div className="spm-form-grid">
                  <div className="spm-form-group">
                    <label>PoE Switch Vendor</label>
                    <select
                      value={formData.infrastructure?.poeSwitchVendor || ''}
                      onChange={(e) => updateNestedField('infrastructure', 'poeSwitchVendor', e.target.value)}
                    >
                      <option value="">Select vendor</option>
                      <option value="cisco">Cisco</option>
                      <option value="aruba">Aruba (HPE)</option>
                      <option value="juniper">Juniper</option>
                      <option value="netgear">Netgear</option>
                      <option value="ubiquiti">Ubiquiti</option>
                      <option value="tp_link">TP-Link</option>
                      <option value="dell">Dell</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={`spm-form-group ${errors.poeSwitchCount ? 'has-error' : ''}`}>
                    <label>PoE Switch Count</label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={formData.infrastructure?.poeSwitchCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'poeSwitchCount', parseInt(e.target.value) || 0)}
                    />
                    {errors.poeSwitchCount && <span className="error-text">{errors.poeSwitchCount}</span>}
                  </div>

                  <div className={`spm-form-group ${errors.livePoeSwitchCount ? 'has-error' : ''}`}>
                    <label>Live PoE Switches</label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={formData.infrastructure?.livePoeSwitchCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'livePoeSwitchCount', parseInt(e.target.value) || 0)}
                    />
                    {errors.livePoeSwitchCount && <span className="error-text">{errors.livePoeSwitchCount}</span>}
                  </div>

                  <div className={`spm-form-group ${errors.totalPoePorts ? 'has-error' : ''}`}>
                    <label>Total PoE Ports</label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={formData.infrastructure?.totalPoePorts || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'totalPoePorts', parseInt(e.target.value) || 0)}
                    />
                    {errors.totalPoePorts && <span className="error-text">{errors.totalPoePorts}</span>}
                  </div>

                  <div className={`spm-form-group ${errors.usedPoePorts ? 'has-error' : ''}`}>
                    <label>Used PoE Ports</label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={formData.infrastructure?.usedPoePorts || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'usedPoePorts', parseInt(e.target.value) || 0)}
                    />
                    {errors.usedPoePorts && <span className="error-text">{errors.usedPoePorts}</span>}
                  </div>
                </div>
              </div>

              <div className="spm-form-section infrastructure-section">
                <h5>Other Equipment</h5>
                <div className="spm-form-grid">
                  <div className="spm-form-group">
                    <label>NAS Count</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.infrastructure?.nasCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'nasCount', parseInt(e.target.value) || 0)}
                    />
                    <span className="field-hint">Network Attached Storage devices</span>
                  </div>

                  <div className="spm-form-group">
                    <label>Firewall Count</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.infrastructure?.firewallCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'firewallCount', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="spm-form-group">
                    <label>UPS Count</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.infrastructure?.upsCount || 0}
                      onChange={(e) => updateNestedField('infrastructure', 'upsCount', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="spm-form-group full-width">
                    <label>Infrastructure Notes</label>
                    <textarea
                      value={formData.infrastructure?.infrastructureNotes || ''}
                      onChange={(e) => updateNestedField('infrastructure', 'infrastructureNotes', e.target.value)}
                      placeholder="Additional notes about infrastructure equipment..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Firewall & API Integration */}
          {currentStep === 5 && (
            <div className="spm-step-content">
              <h3>Firewall & API Integration</h3>

              <div className="spm-collapsible-section">
                <div className="collapsible-header">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.firewallConfig.enabled}
                      onChange={(e) => updateNestedField('firewallConfig', 'enabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <h4>Firewall Configuration (Optional)</h4>
                </div>

                {formData.firewallConfig.enabled && (
                  <div className="collapsible-content">
                    <div className="spm-form-grid">
                      <div className={`spm-form-group ${errors.firewallOrganizationId ? 'has-error' : ''}`}>
                        <label>Organization ID</label>
                        <input
                          type="text"
                          value={formData.firewallConfig.organizationId}
                          onChange={(e) => updateNestedField('firewallConfig', 'organizationId', e.target.value)}
                          placeholder="Enter organization ID"
                        />
                      </div>
                      <div className="spm-form-group">
                        <label>Appliance ID</label>
                        <input
                          type="text"
                          value={formData.firewallConfig.applianceId}
                          onChange={(e) => updateNestedField('firewallConfig', 'applianceId', e.target.value)}
                          placeholder="Enter appliance ID"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="spm-collapsible-section">
                <div className="collapsible-header">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.apiIntegration.enabled}
                      onChange={(e) => updateNestedField('apiIntegration', 'enabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <h4>API Integration (Optional)</h4>
                </div>

                {formData.apiIntegration.enabled && (
                  <div className="collapsible-content">
                    <div className="spm-form-grid">
                      <div className="spm-form-group">
                        <label>Site Property ID</label>
                        <input
                          type="text"
                          value={formData.apiIntegration.sitePropertyId}
                          onChange={(e) => updateNestedField('apiIntegration', 'sitePropertyId', e.target.value)}
                          placeholder="Enter site property ID"
                        />
                      </div>
                      <div className="spm-form-group">
                        <label>Company Property ID</label>
                        <input
                          type="text"
                          value={formData.apiIntegration.companyPropertyId}
                          onChange={(e) => updateNestedField('apiIntegration', 'companyPropertyId', e.target.value)}
                          placeholder="Enter company property ID"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: SSID & Features Configuration */}
          {currentStep === 6 && (
            <div className="spm-step-content">
              <h3>SSID & Features Configuration</h3>

              <SSIDConfigSection
                ssidConfigs={formData.ssidConfigs}
                onConfigsChange={(configs) => updateField('ssidConfigs', configs)}
                errors={errors}
              />

              <div className="spm-form-section" style={{ marginTop: '24px' }}>
                <h4>Feature Toggles</h4>
                <div className="spm-toggles-grid">
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.interSiteRoaming}
                        onChange={(e) => updateField('interSiteRoaming', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-info">
                      <span className="toggle-title">Inter-site Roaming</span>
                      <span className="toggle-desc">Allow users to roam between sites</span>
                    </div>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.bulkUserRegistration}
                        onChange={(e) => updateField('bulkUserRegistration', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-info">
                      <span className="toggle-title">Bulk User Registration</span>
                      <span className="toggle-desc">Enable bulk user import</span>
                    </div>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.bulkDeviceRegistration}
                        onChange={(e) => updateField('bulkDeviceRegistration', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-info">
                      <span className="toggle-title">Bulk Device Registration</span>
                      <span className="toggle-desc">Enable bulk device import</span>
                    </div>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.guestAccessEnabled}
                        onChange={(e) => updateField('guestAccessEnabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-info">
                      <span className="toggle-title">Guest WiFi Access</span>
                      <span className="toggle-desc">Enable guest access management for this site</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="spm-form-section" style={{ marginTop: '24px' }}>
                <div className="section-header-with-toggle">
                  <h4>Reporting</h4>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.reportingEnabled}
                      onChange={(e) => updateField('reportingEnabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {formData.reportingEnabled && (
                  <>
                    {!isInternetManaged(formData.solutionType) && (
                      <div className="info-message info-small" style={{ marginBottom: '12px' }}>
                        <FaInfoCircle />
                        <span>Showing WiFi infrastructure reports only. Internet-related reports are not available for Managed WiFi Infra sites.</span>
                      </div>
                    )}
                    <div className="reports-checkbox-grid">
                      {getReportsForSolutionType(formData.siteType || 'enterprise', formData.solutionType).map(report => (
                        <label key={report.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.selectedReports.includes(report.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateField('selectedReports', [...formData.selectedReports, report.id]);
                              } else {
                                updateField('selectedReports', formData.selectedReports.filter(id => id !== report.id));
                              }
                            }}
                          />
                          <span className="checkbox-custom"></span>
                          <span>{report.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 7: Top-ups */}
          {currentStep === 7 && (
            <div className="spm-step-content">
              <h3>Top-ups & Self-Care Portal</h3>

              {!areTopupsEnabled(formData.solutionType) ? (
                <div className="info-message warning">
                  <FaBan />
                  <div>
                    <strong>Top-ups Not Available for Managed WiFi Infra</strong>
                    <p>
                      Top-ups cannot be sold to Managed WiFi Infra customers because internet is not
                      provisioned or managed by Spectra. Speed, data, and plan top-ups require
                      Spectra-managed internet connectivity.
                    </p>
                    <p style={{ marginTop: '8px', fontSize: '0.9em', opacity: 0.8 }}>
                      To enable top-ups, change the Solution Type to "Managed WiFi" in Step 1.
                    </p>
                  </div>
                </div>
              ) : formData.bandwidthType === 'userLevel' ? (
                <TopupConfigSection
                  topups={formData.topups}
                  onTopupsChange={(topups) => updateField('topups', topups)}
                />
              ) : (
                <div className="info-message">
                  <FaExclamationTriangle />
                  <div>
                    <strong>Top-ups Not Available</strong>
                    <p>Top-up configuration is only available for User Level bandwidth sites.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 8: Authentication Configuration */}
          {currentStep === 8 && (
            <div className="spm-step-content">
              <h3>Authentication Configuration</h3>
              <p className="section-description">
                Configure authentication methods for each user category. At least one method must be selected per category.
                WPA2-PSK can be combined with other authentication methods.
              </p>

              {!formData.siteType ? (
                <div className="info-message warning">
                  <FaExclamationTriangle />
                  <div>
                    <strong>Site Type Required</strong>
                    <p>Please select a site type/segment in Step 1 to configure authentication methods.</p>
                  </div>
                </div>
              ) : (
                <div className="auth-config-container">
                  {Object.entries(getAuthCategoriesForSegment(formData.siteType)).map(([categoryId, category]) => {
                    const selectedMethods = formData.authenticationConfig?.[categoryId] || [];
                    const hasError = errors[`auth_${categoryId}`];

                    return (
                      <div key={categoryId} className={`auth-category-card ${hasError ? 'has-error' : ''}`}>
                        <div className="auth-category-header">
                          <h4>{category.label}</h4>
                          <span className="auth-category-desc">{category.description}</span>
                        </div>

                        {hasError && (
                          <div className="auth-error-message">
                            <FaExclamationTriangle /> {errors[`auth_${categoryId}`]}
                          </div>
                        )}

                        <div className="auth-methods-grid">
                          {category.availableMethods.map(methodId => {
                            const method = AUTH_METHODS[methodId];
                            if (!method) return null;

                            const isSelected = selectedMethods.includes(methodId);
                            const isDefault = category.defaultMethods.includes(methodId);

                            return (
                              <label
                                key={methodId}
                                className={`auth-method-item ${isSelected ? 'selected' : ''} ${isDefault ? 'is-default' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentMethods = formData.authenticationConfig?.[categoryId] || [];
                                    let newMethods;
                                    if (e.target.checked) {
                                      newMethods = [...currentMethods, methodId];
                                    } else {
                                      newMethods = currentMethods.filter(m => m !== methodId);
                                    }
                                    updateField('authenticationConfig', {
                                      ...formData.authenticationConfig,
                                      [categoryId]: newMethods
                                    });
                                  }}
                                />
                                <span className="auth-checkbox-custom"></span>
                                <div className="auth-method-info">
                                  <span className="auth-method-label">{method.label}</span>
                                  <span className="auth-method-desc">{method.description}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>

                        <div className="auth-category-footer">
                          <span className="selected-count">
                            {selectedMethods.length} method{selectedMethods.length !== 1 ? 's' : ''} selected
                          </span>
                          <button
                            type="button"
                            className="btn-link"
                            onClick={() => {
                              updateField('authenticationConfig', {
                                ...formData.authenticationConfig,
                                [categoryId]: [...category.defaultMethods]
                              });
                            }}
                          >
                            Reset to defaults
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="spm-footer">
          <div className="spm-footer-left">
            {isDirty && (
              <span className="draft-indicator">
                <FaSave /> Draft saved
              </span>
            )}
          </div>
          <div className="spm-footer-right">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={prevStep}
                disabled={submitting}
              >
                <FaChevronLeft /> Previous
              </button>
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                disabled={submitting}
              >
                Next <FaChevronRight />
              </button>
            ) : (
              <button
                type="button"
                className="btn-success"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Provisioning...' : 'Provision Site'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SiteProvisioningModal;
