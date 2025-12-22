/**
 * ============================================================================
 * User Form Modal Component
 * ============================================================================
 *
 * @file src/pages/UserManagement/UserFormModal.js
 * @description Modal form for creating new users or editing existing users.
 *              Handles segment-specific fields, policy selection, license
 *              validation, and date-based deactivation scheduling.
 *
 * @modes
 * - ADD Mode: Creating a new user (user prop is null)
 * - EDIT Mode: Modifying existing user (user prop contains user data)
 *
 * @formFields
 * Common fields (all segments):
 * - User ID (required, read-only in edit mode)
 * - First Name, Last Name (required)
 * - Mobile (required, format: 91-XXXXXXXXXX)
 * - Email (required for some segments)
 * - Speed, Data Volume, Device Limit (policy selection)
 * - Data Cycle Type (Daily/Monthly)
 *
 * Segment-specific fields:
 * - Co-Living: Resident Type, Check-in/Check-out dates
 * - Co-Working: Member Type, Move-in/Move-out dates
 * - Hotel: Check-in/Check-out dates and times
 * - Enterprise: Department, Employee ID
 * - PG: Room Number, Floor
 *
 * @policySelection
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    Policy Selection Logic                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Fixed Bandwidth Sites:                                                   │
 * │   Speed options limited by site's maxBandwidth                          │
 * │   All data/device options available                                     │
 * │                                                                          │
 * │ User Level Sites:                                                        │
 * │   Options cascaded based on available policy combinations               │
 * │   Speed→Data→Device filtering ensures valid combinations only           │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @licenseValidation
 * Before submission, checks:
 * 1. Overall site license availability
 * 2. Per-policy license limits (for user-level sites)
 * 3. Shows error if no licenses available
 *
 * @autoDeactivation
 * For segments with check-out/move-out dates:
 * - System schedules automatic user deactivation
 * - Deactivation occurs at specified time on check-out date
 * - Backend should create scheduled job when user saved
 *
 * @segmentBehaviors
 * | Segment     | Cycle Type          | Date Fields Required          |
 * |-------------|---------------------|-------------------------------|
 * | Enterprise  | Daily/Monthly       | None                          |
 * | Hotel       | Daily (default)     | Check-in/out (unless Monthly) |
 * | Co-Living   | Based on resident   | Short-term: Check-in/out      |
 * | Co-Working  | Based on member     | Temporary: Move-in/out        |
 * | PG          | Monthly only        | None                          |
 * | Misc        | Site-configured     | None                          |
 *
 * @validation
 * - Required field validation
 * - Email format validation
 * - Date range validation (end >= start)
 * - Time validation for same-day check-in/out
 * - License availability check
 *
 * @submitFlow
 * ```
 * User clicks Submit
 *       │
 *       ▼
 * Validate all fields
 *       │
 *       ▼ (if valid)
 * Check license availability
 *       │
 *       ▼ (if available)
 * Generate policy ID
 *       │
 *       ▼
 * For EDIT: Show confirmation modal
 * For ADD: Submit directly
 *       │
 *       ▼
 * Call onSubmit with user data
 * ```
 *
 * @editRestrictions
 * When editing (user prop exists):
 * - User ID: Read-only
 * - Email: Read-only for some segments
 * - Mobile: Read-only for some segments
 * - Cycle Type: Read-only (cannot change billing cycle)
 *
 * @dependencies
 * - Modal: Base modal component
 * - policyConfig: Policy options and validation
 * - segmentFieldConfig: Segment-specific form fields
 * - siteConfig: Site settings including bandwidth limits
 * - licenseUtils: License availability checking
 * - validationUtils: Field validation functions
 *
 * @relatedFiles
 * - UserList.js: Parent page that renders this modal
 * - policyConfig.js: Policy options and combinations
 * - segmentFieldConfig.js: Segment-specific fields
 * - licenseUtils.js: License checking utilities
 *
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import ConfirmationModal from "../../components/ConfirmationModal";
import { segmentFieldConfig } from "../../config/segmentFieldConfig";
import siteConfig from "../../config/siteConfig";
import SEGMENT_DEVICE_AVAILABILITY from "../../config/segmentDeviceConfig";
import policyConfig from "../../config/policyConfig";
import { isEmailValid, isRequired } from "../../utils/validationUtils";
import notifications from "../../utils/notifications";
import { checkLicenseAvailability, getLicenseSummary } from "../../utils/licenseUtils";
import "./UserFormModal.css";
import UserLicenseBar from '../../components/common/UserLicenseBar';
import { DATE_TIME, DATA_LIMITS, ANIMATION } from '../../constants/appConstants';

const EMAIL_REQUIRED_SEGMENTS = {
  coWorking: true,
  coLiving: false,
  hotel: false,
  enterprise: true,
  pg: false,
  miscellaneous: false,
};

const USER_CATEGORY_SEGMENT = {
  coWorking: "member",
  coLiving: "resident",
  hotel: "guest",
  enterprise: "employee",
  pg: "resident",
  miscellaneous: "user",
};

const MAX_LICENSES = siteConfig.licenses.maxLicenses;
const USED_LICENSES = siteConfig.licenses.usedLicenses;

function randomPassword() {
  const min = Math.pow(10, DATA_LIMITS.PASSWORD_DIGITS - 1);
  const max = Math.pow(10, DATA_LIMITS.PASSWORD_DIGITS) - 1;
  return Math.floor(min + Math.random() * (max - min)).toString();
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULTS = {
  checkInDate: getTodayISO(),
  checkOutDate: getTodayISO(),
  moveInDate: getTodayISO(),
  moveOutDate: getTodayISO(),
  checkInTime: DATE_TIME.DEFAULT_CHECK_IN_TIME,
  checkOutTime: DATE_TIME.DEFAULT_CHECK_OUT_TIME,
};

const UserFormModal = ({
  user,
  onSubmit,
  onClose,
  segment,
  submitting = false
}) => {
  // Get site configuration for current segment
  const siteSettings = useMemo(() => {
    return siteConfig.segmentSites[segment] || {};
  }, [segment]);

  // Determine if site uses fixed bandwidth or user level policies
  const isFixedBandwidthSite = siteSettings.bandwidthType === "fixed";
  const maxBandwidth = siteSettings.maxBandwidth || 200;

  // Segment-specific cycle types
  const allowedCycleTypes = useMemo(() => {
    // Use dataCycleType from site config if available
    if (siteSettings.dataCycleType) {
      return [siteSettings.dataCycleType];
    }
    if (segment === "pg") {
      return ["Monthly"]; // PG only allows monthly
    } else if (segment === "miscellaneous") {
      return ["Monthly"]; // Default for demo portal
    }
    return ["Daily", "Monthly"]; // Default for other segments
  }, [segment, siteSettings]);

  // Get user policies for current segment (for userLevel sites)
  const userPolicies = useMemo(() => {
    return siteSettings.userPolicies || [];
  }, [siteSettings]);

  // Get initial allowed options based on site type and data cycle
  const allowedSpeeds = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: filter by maxBandwidth
      return policyConfig.getSpeedOptionsWithMaxBandwidth(allowedCycleTypes[0], maxBandwidth);
    }
    // User level: get from userPolicies
    if (!userPolicies.length) return policyConfig.getSpeedOptions(allowedCycleTypes[0]);
    const available = policyConfig.getAvailableOptionsFromPolicies(userPolicies, allowedCycleTypes[0]);
    return available.speeds.length > 0 ? available.speeds : policyConfig.getSpeedOptions(allowedCycleTypes[0]);
  }, [isFixedBandwidthSite, maxBandwidth, userPolicies, allowedCycleTypes]);

  const allowedVolumes = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: all data options available
      return policyConfig.getDataOptions(allowedCycleTypes[0]);
    }
    // User level: get from userPolicies
    if (!userPolicies.length) return policyConfig.getDataOptions(allowedCycleTypes[0]);
    const available = policyConfig.getAvailableOptionsFromPolicies(userPolicies, allowedCycleTypes[0]);
    return available.dataVolumes.length > 0 ? available.dataVolumes : policyConfig.getDataOptions(allowedCycleTypes[0]);
  }, [isFixedBandwidthSite, userPolicies, allowedCycleTypes]);

  const allowedDeviceCounts = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: all device options available
      return policyConfig.getDeviceOptions();
    }
    // User level: get from userPolicies
    if (!userPolicies.length) return policyConfig.getDeviceOptions();
    const available = policyConfig.getAvailableOptionsFromPolicies(userPolicies, allowedCycleTypes[0]);
    return available.deviceCounts.length > 0 ? available.deviceCounts : policyConfig.getDeviceOptions();
  }, [isFixedBandwidthSite, userPolicies, allowedCycleTypes]);

  // Determine if cycle type should be non-editable
  const isCycleTypeStatic = useMemo(() => {
    // Co-Living: Auto-selected based on resident type (non-editable)
    if (segment === "coLiving") return true;
    // Coworking: Auto-selected based on member type (non-editable)
    if (segment === "coWorking") return true;
    // PG: Only monthly available (non-editable)
    if (segment === "pg") return true;
    // Miscellaneous: Configured during site provisioning (non-editable)
    if (segment === "miscellaneous") return true;
    // Hotels: Editable when creating, static when editing
    if (segment === "hotel" && user) return true;
    return false;
  }, [segment, user]);

  const initialResidentType = useMemo(() => segment === "coLiving" ? "Long-Term" : "", [segment]);
  const initialMemberType = useMemo(() => segment === "coWorking" ? "Permanent" : "", [segment]);

  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    mobile: "91-",
    email: "",
    dataCycleType: allowedCycleTypes[0],
    speed: allowedSpeeds[0],
    dataVolume: allowedVolumes[0],
    deviceLimit: allowedDeviceCounts[0],
    residentType: user?.residentType || initialResidentType,
    memberType: user?.memberType || initialMemberType,
    checkInDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInDate : "",
    checkOutDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutDate : "",
    checkInTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInTime : "",
    checkOutTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutTime : "",
    moveInDate: segment === "coWorking" ? DEFAULTS.moveInDate : "",
    moveOutDate: segment === "coWorking" ? DEFAULTS.moveOutDate : "",
    ...user,
  });

  const [errors, setErrors] = useState({});
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const firstInputRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const licensesFull = USED_LICENSES >= MAX_LICENSES;

  // Dynamic filtering based on current selections and data cycle type
  const filteredSpeedOptions = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: filter by maxBandwidth only
      return policyConfig.getSpeedOptionsWithMaxBandwidth(form.dataCycleType, maxBandwidth);
    }
    // User level: cascading filter based on current selections
    if (!userPolicies.length) return policyConfig.getSpeedOptions(form.dataCycleType);
    const valid = policyConfig.getValidCombinations(
      userPolicies,
      { speed: null, dataVolume: form.dataVolume, deviceCount: form.deviceLimit },
      form.dataCycleType
    );
    return valid.speeds.length > 0 ? valid.speeds : policyConfig.getSpeedOptions(form.dataCycleType);
  }, [isFixedBandwidthSite, maxBandwidth, userPolicies, form.dataCycleType, form.dataVolume, form.deviceLimit]);

  const filteredDataOptions = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: all data options available
      return policyConfig.getDataOptions(form.dataCycleType);
    }
    // User level: cascading filter based on current selections
    if (!userPolicies.length) return policyConfig.getDataOptions(form.dataCycleType);
    const valid = policyConfig.getValidCombinations(
      userPolicies,
      { speed: form.speed, dataVolume: null, deviceCount: form.deviceLimit },
      form.dataCycleType
    );
    return valid.dataVolumes.length > 0 ? valid.dataVolumes : policyConfig.getDataOptions(form.dataCycleType);
  }, [isFixedBandwidthSite, userPolicies, form.dataCycleType, form.speed, form.deviceLimit]);

  const filteredDeviceOptions = useMemo(() => {
    if (isFixedBandwidthSite) {
      // Fixed bandwidth: all device options available
      return policyConfig.getDeviceOptions();
    }
    // User level: cascading filter based on current selections
    if (!userPolicies.length) return policyConfig.getDeviceOptions();
    const valid = policyConfig.getValidCombinations(
      userPolicies,
      { speed: form.speed, dataVolume: form.dataVolume, deviceCount: null },
      form.dataCycleType
    );
    return valid.deviceCounts.length > 0 ? valid.deviceCounts : policyConfig.getDeviceOptions();
  }, [isFixedBandwidthSite, userPolicies, form.dataCycleType, form.speed, form.dataVolume]);

  useEffect(() => {
    let mounted = true;

    if (user) {
      setForm({
        id: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobile: user.mobile || "91-",
        email: user.email || "",
        dataCycleType: user.dataCycleType || allowedCycleTypes[0],
        speed: user.speed || allowedSpeeds[0],
        dataVolume: user.dataVolume || allowedVolumes[0],
        deviceLimit: user.deviceLimit || allowedDeviceCounts[0],
        residentType: user?.residentType || initialResidentType,
        memberType: user?.memberType || initialMemberType,
        checkInDate: user.checkInDate || ((segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInDate : ""),
        checkOutDate: user.checkOutDate || ((segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutDate : ""),
        checkInTime: user.checkInTime || ((segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInTime : ""),
        checkOutTime: user.checkOutTime || ((segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutTime : ""),
        moveInDate: user.moveInDate || (segment === "coWorking" ? DEFAULTS.moveInDate : ""),
        moveOutDate: user.moveOutDate || (segment === "coWorking" ? DEFAULTS.moveOutDate : ""),
        ...user,
      });
    } else {
      setForm(prev => ({
        ...prev,
        residentType: initialResidentType,
        memberType: initialMemberType,
        checkInDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInDate : "",
        checkOutDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutDate : "",
        checkInTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInTime : "",
        checkOutTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutTime : "",
        moveInDate: segment === "coWorking" ? DEFAULTS.moveInDate : "",
        moveOutDate: segment === "coWorking" ? DEFAULTS.moveOutDate : "",
      }));
    }
    setErrors({});
    
    focusTimeoutRef.current = setTimeout(() => {
      if (mounted && firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, ANIMATION.AUTO_FOCUS_DELAY);

    return () => {
      mounted = false;
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };
  }, [user, segment, allowedCycleTypes, allowedSpeeds, allowedVolumes, allowedDeviceCounts, initialResidentType, initialMemberType]);

  // Auto-select dataCycleType based on resident/member type for Co-Living and Coworking
  useEffect(() => {
    if (segment === "coLiving") {
      // Co-Living: Long-Term → Monthly, Short-Term → Daily
      if (form.residentType === "Long-Term" && form.dataCycleType !== "Monthly") {
        setForm(prev => ({ ...prev, dataCycleType: "Monthly" }));
      } else if (form.residentType === "Short-Term" && form.dataCycleType !== "Daily") {
        setForm(prev => ({ ...prev, dataCycleType: "Daily" }));
      }
    } else if (segment === "coWorking") {
      // Coworking: Permanent → Monthly, Temporary → Daily
      if (form.memberType === "Permanent" && form.dataCycleType !== "Monthly") {
        setForm(prev => ({ ...prev, dataCycleType: "Monthly" }));
      } else if (form.memberType === "Temporary" && form.dataCycleType !== "Daily") {
        setForm(prev => ({ ...prev, dataCycleType: "Daily" }));
      }
    }
  }, [segment, form.residentType, form.memberType, form.dataCycleType]);

  function minCheckOutDate() {
    return form.checkInDate || DEFAULTS.checkInDate;
  }

  function minMoveOutDate() {
    return form.moveInDate || DEFAULTS.moveInDate;
  }

  function minCheckOutTime() {
    if (form.checkInDate === form.checkOutDate && form.checkInTime) return form.checkInTime;
    return "";
  }

  const isCoLivingLongTerm = segment === "coLiving" && form.residentType === "Long-Term";
  const isCoLivingShortTerm = segment === "coLiving" && form.residentType === "Short-Term";
  const isCoWorkingPermanent = segment === "coWorking" && form.memberType === "Permanent";
  const isCoWorkingTemporary = segment === "coWorking" && form.memberType === "Temporary";
  const isHotelMonthly = segment === "hotel" && form.dataCycleType === "Monthly";
  const isEmailRequired = EMAIL_REQUIRED_SEGMENTS[segment] ?? false;

  // Field editability based on segment configuration
  const segmentConfig = SEGMENT_DEVICE_AVAILABILITY[segment] || {};
  const allowEmailEdit = segmentConfig.allowEmailEdit ?? true;
  const allowMobileEdit = segmentConfig.allowMobileEdit ?? true;
  // In edit mode, check if field is editable for this segment
  const isEmailEditable = !user || allowEmailEdit;
  const isMobileEditable = !user || allowMobileEdit;

  const validate = () => {
    const newErrors = {};
    if (!isRequired(form.id)) newErrors.id = "User ID is required.";
    if (!isRequired(form.firstName)) newErrors.firstName = "First name is required.";
    if (!isRequired(form.lastName)) newErrors.lastName = "Last name is required.";
    if (!isRequired(form.mobile) || form.mobile.length < 10) newErrors.mobile = "Mobile number is required and seems invalid.";
    if (isEmailRequired && !form.email) newErrors.email = "Email is required for this segment.";
    if (form.email && !isEmailValid(form.email)) newErrors.email = "Email is invalid.";
    if (!isRequired(form.speed)) newErrors.speed = "Speed is required.";
    if (!isRequired(form.dataVolume)) newErrors.dataVolume = "Data Volume is required.";
    if (!isRequired(form.deviceLimit)) newErrors.deviceLimit = "Device Limit is required.";

    if (segment === "coLiving" && form.residentType === "Short-Term") {
      if (!isRequired(form.checkInDate)) newErrors.checkInDate = "Check-In Date required for short-term resident.";
      if (!isRequired(form.checkInTime)) newErrors.checkInTime = "Check-In Time required for short-term resident.";
      if (!isRequired(form.checkOutDate)) newErrors.checkOutDate = "Check-Out Date required for short-term resident.";
      if (!isRequired(form.checkOutTime)) newErrors.checkOutTime = "Check-Out Time required for short-term resident.";
      if (form.checkOutDate < form.checkInDate) newErrors.checkOutDate = "Check-Out date cannot be before Check-In date.";
      if (form.checkOutDate === form.checkInDate && form.checkOutTime < form.checkInTime) newErrors.checkOutTime = "Check-Out time cannot be before Check-In time for same date.";
    }

    if (segment === "coWorking" && form.memberType === "Temporary") {
      if (!isRequired(form.moveInDate)) newErrors.moveInDate = "Move-In Date required for temporary member.";
      if (!isRequired(form.moveOutDate)) newErrors.moveOutDate = "Move-Out Date required for temporary member.";
      if (form.moveOutDate < form.moveInDate) newErrors.moveOutDate = "Move-Out date cannot be before Move-In date.";
    }

    if (segment === "coLiving" && form.checkOutDate && form.checkInDate) {
      if (form.checkOutDate < form.checkInDate) newErrors.checkOutDate = "Check-Out date cannot be before Check-In date.";
      if (form.checkOutDate === form.checkInDate && form.checkOutTime < form.checkInTime) newErrors.checkOutTime = "Check-Out time cannot be before Check-In time for same date.";
    }

    if (segment === "hotel" && form.checkOutDate && form.checkInDate) {
      if (form.checkOutDate < form.checkInDate) newErrors.checkOutDate = "Check-Out date cannot be before Check-In date.";
      if (form.checkOutDate === form.checkInDate && form.checkOutTime < form.checkInTime) newErrors.checkOutTime = "Check-Out time cannot be before Check-In time for same date.";
    }

    (segmentFieldConfig[segment] || []).forEach(field => {
      if (field.required && !form[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: null,
    }));

    // ========================================
    // TODO: Backend Integration - Real-time Field Validation
    // ========================================
    // Placeholder for backend validation as user types
    // Example: Check if User ID already exists in database
    // Example: Validate mobile number format against AAA system
    // Example: Verify email uniqueness across all sites
    // Implementation needed: Debounced API call to validate field
    // ========================================
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) {
      notifications.validationError();
      return;
    }

    const userCategory = USER_CATEGORY_SEGMENT[segment] || "user";

    // Generate policy ID from speed, data, and device selections
    // Include dataCycleType suffix for proper policy matching
    const policyId = `${policyConfig.generatePolicyId(
      segment,
      form.speed,
      form.dataVolume,
      form.deviceLimit,
      form.dataCycleType
    )}_${form.dataCycleType}`;

    // Check license availability (both overall and per-policy for userLevel sites)
    const licenseCheck = checkLicenseAvailability(
      segment,
      policyId,
      user?.id || null,
      user?.policyId || null
    );

    if (!licenseCheck.available) {
      notifications.showError(licenseCheck.error);
      return;
    }

    const newUser = {
      ...form,
      policyId, // Include generated policy ID
      status: "Active",
      userCategory,
      password: randomPassword(),
    };

    // ========================================
    // TODO: Backend Integration - User Creation/Update
    // ========================================
    // Before calling onSubmit, integrate with backend API
    //
    // For NEW USER:
    // 1. POST request to /api/users/create
    // 2. Payload should include: user data, segment, siteId, policy details
    // 3. Backend should:
    //    - Create user in UMP (User Management Portal)
    //    - Provision in AAA (Alepo) with generated password
    //    - Update license count in database
    //    - Create audit log entry
    //    - Send welcome SMS/email with credentials
    // 4. Response should include: userId, accountId, can_id, provision status
    //
    // For UPDATE USER:
    // 1. PUT request to /api/users/{userId}/update
    // 2. Backend should:
    //    - Update user details in UMP
    //    - Sync changes to AAA system
    //    - Update policy if changed (call Alepo API)
    //    - Create audit log entry for changes
    //    - Send notification if critical fields changed
    // 3. Handle special cases:
    //    - Check-in/Check-out date changes (schedule auto-deactivation)
    //    - Policy changes (update AAA immediately)
    //    - Segment-specific field updates
    //
    // Error Handling:
    // - Network failures: Retry logic with exponential backoff
    // - Validation errors from backend: Display to user
    // - AAA provisioning failures: Rollback UMP changes
    // - License conflicts: Check availability before submit
    // ========================================

    // If updating existing user, show confirmation modal
    if (user) {
      setPendingUserData(newUser);
      setShowUpdateConfirmation(true);
      return;
    }

    // For new users, submit directly
    await onSubmit(newUser);
  };

  const handleConfirmUpdate = async () => {
    if (pendingUserData) {
      await onSubmit(pendingUserData);
      setShowUpdateConfirmation(false);
      setPendingUserData(null);
    }
  };

  const handleCancelUpdate = () => {
    setShowUpdateConfirmation(false);
    setPendingUserData(null);
  };

  return (
    <Modal onClose={onClose} aria-labelledby="user-form-title" aria-modal="true" role="dialog">
      <form className="user-form-modal" onSubmit={handleSubmit} noValidate>
        <h2 id="user-form-title" className="user-form-header">
          {user ? "Edit User" : "Add New User"}
        </h2>
        
        <div className="user-form-license-container">
          <UserLicenseBar current={USED_LICENSES} total={MAX_LICENSES} width={280} height={24} />
          {/* ========================================
              TODO: Backend Integration - Real-time License Count
              ========================================
              Replace static USED_LICENSES with live data from backend
              Implementation: WebSocket connection or polling /api/licenses/current
              Update every 5-10 seconds or on user events
              ======================================== */}
        </div>

        <div className="user-form-scrollable-content">
          <div className="user-form-row">
            <label htmlFor="id">User ID <span className="required-asterisk">*</span></label>
            <input 
              ref={firstInputRef} 
              id="id" 
              name="id" 
              value={form.id} 
              onChange={handleChange} 
              disabled={!!user || submitting} 
              className={errors.id ? 'error' : ''}
              aria-invalid={!!errors.id} 
              aria-describedby="id-error" 
              required 
            />
            {errors.id && <div className="error-message" id="id-error" role="alert">{errors.id}</div>}
            {/* ========================================
                TODO: Backend Integration - User ID Uniqueness Check
                ========================================
                Implement real-time validation API call
                Endpoint: GET /api/users/check-id?userId={value}&siteId={siteId}
                Show inline error if ID already exists
                ======================================== */}
          </div>

          <div className="user-form-row">
            <label htmlFor="firstName">First Name <span className="required-asterisk">*</span></label>
            <input 
              id="firstName" 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange} 
              className={errors.firstName ? 'error' : ''}
              aria-invalid={!!errors.firstName} 
              aria-describedby="firstName-error" 
              required 
              disabled={submitting}
            />
            {errors.firstName && <div className="error-message" id="firstName-error" role="alert">{errors.firstName}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="lastName">Last Name <span className="required-asterisk">*</span></label>
            <input 
              id="lastName" 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange} 
              className={errors.lastName ? 'error' : ''}
              aria-invalid={!!errors.lastName} 
              aria-describedby="lastName-error" 
              required 
              disabled={submitting}
            />
            {errors.lastName && <div className="error-message" id="lastName-error" role="alert">{errors.lastName}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="mobile">
              Mobile <span className="required-asterisk">*</span>
              {user && !allowMobileEdit && <span style={{ fontSize: '0.85em', color: '#666' }}> (Read-only)</span>}
            </label>
            <input
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className={errors.mobile ? 'error' : ''}
              aria-invalid={!!errors.mobile}
              aria-describedby="mobile-error"
              required
              disabled={submitting || !isMobileEditable}
            />
            {errors.mobile && <div className="error-message" id="mobile-error" role="alert">{errors.mobile}</div>}
            {/* ========================================
                TODO: Backend Integration - Mobile Number Validation
                ========================================
                Implement real-time mobile validation
                Endpoint: POST /api/users/validate-mobile
                Check for: format, uniqueness, carrier verification
                ======================================== */}
          </div>

          <div className="user-form-row">
            <label htmlFor="email">
              Email{isEmailRequired && <span className="required-asterisk">*</span>}
              {user && !allowEmailEdit && <span style={{ fontSize: '0.85em', color: '#666' }}> (Read-only)</span>}
            </label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              required={isEmailRequired}
              disabled={submitting || !isEmailEditable}
            />
            {errors.email && <div className="error-message" id="email-error" role="alert">{errors.email}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="dataCycleType">Data Cycle Type</label>
            <select 
              id="dataCycleType" 
              name="dataCycleType" 
              value={form.dataCycleType} 
              onChange={handleChange} 
              disabled={isCycleTypeStatic || submitting}
            >
              {allowedCycleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {/* ========================================
                TODO: Backend Integration - Policy Configuration Sync
                ========================================
                Fetch allowed cycle types from backend based on:
                - Site configuration
                - Segment rules
                - Commercial agreements
                Endpoint: GET /api/sites/{siteId}/policy-options
                ======================================== */}
          </div>

          <div className="user-form-row">
            <label htmlFor="speed">Speed <span className="required-asterisk">*</span></label>
            <select
              id="speed"
              name="speed"
              value={form.speed}
              onChange={handleChange}
              className={errors.speed ? 'error' : ''}
              required
              aria-invalid={!!errors.speed}
              aria-describedby="speed-error"
              disabled={submitting}
            >
              {filteredSpeedOptions.map(speed => (
                <option key={speed} value={speed}>{speed}</option>
              ))}
            </select>
            {errors.speed && <div className="error-message" id="speed-error" role="alert">{errors.speed}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="dataVolume">Data Volume <span className="required-asterisk">*</span></label>
            <select
              id="dataVolume"
              name="dataVolume"
              value={form.dataVolume}
              onChange={handleChange}
              className={errors.dataVolume ? 'error' : ''}
              required
              aria-invalid={!!errors.dataVolume}
              aria-describedby="dataVolume-error"
              disabled={submitting}
            >
              {filteredDataOptions.map(volume => (
                <option key={volume} value={volume}>{volume}</option>
              ))}
            </select>
            {errors.dataVolume && <div className="error-message" id="dataVolume-error" role="alert">{errors.dataVolume}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="deviceLimit">Device Limit <span className="required-asterisk">*</span></label>
            <select
              id="deviceLimit"
              name="deviceLimit"
              value={form.deviceLimit}
              onChange={handleChange}
              className={errors.deviceLimit ? 'error' : ''}
              required 
              aria-invalid={!!errors.deviceLimit} 
              aria-describedby="deviceLimit-error"
              disabled={submitting}
            >
              {filteredDeviceOptions.map(count => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
            {errors.deviceLimit && <div className="error-message" id="deviceLimit-error" role="alert">{errors.deviceLimit}</div>}
          </div>

          {(segmentFieldConfig[segment] || []).map(field => (
            <div className="user-form-row" key={field.name}>
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required-asterisk">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className={errors[field.name] ? 'error' : ''}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={`${field.name}-error`}
                  disabled={submitting}
                >
                  <option value="">Select</option>
                  {field.options && field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className={errors[field.name] ? 'error' : ''}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={`${field.name}-error`}
                  disabled={submitting}
                />
              )}
              {errors[field.name] && <div className="error-message" id={`${field.name}-error`} role="alert">{errors[field.name]}</div>}
            </div>
          ))}

          {segment === "coLiving" && (
            <>
              <div className="user-form-row">
                <label htmlFor="residentType">
                  Resident Type <span className="required-asterisk">*</span>
                </label>
                <select
                  id="residentType"
                  name="residentType"
                  value={form.residentType}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="Long-Term">Long-Term</option>
                  <option value="Short-Term">Short-Term</option>
                </select>
              </div>

              <div className="user-form-row">
                <label htmlFor="checkInDate">
                  Check-In Date{isCoLivingShortTerm && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  value={form.checkInDate}
                  onChange={handleChange}
                  className={errors.checkInDate ? 'error' : ''}
                  required={isCoLivingShortTerm}
                  disabled={isCoLivingLongTerm || submitting}
                />
                {errors.checkInDate && <div className="error-message" id="checkInDate-error" role="alert">{errors.checkInDate}</div>}
                {/* ========================================
                    TODO: Backend Integration - Auto-deactivation Scheduling
                    ========================================
                    When check-out date is set, schedule auto-deactivation job
                    Endpoint: POST /api/users/{userId}/schedule-deactivation
                    Payload: { checkOutDate, checkOutTime, userId, siteId }
                    Backend should create cron job or scheduled task
                    ======================================== */}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutDate">
                  Check-Out Date{isCoLivingShortTerm && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  className={errors.checkOutDate ? 'error' : ''}
                  min={minCheckOutDate()}
                  required={isCoLivingShortTerm}
                  disabled={isCoLivingLongTerm || submitting}
                />
                {errors.checkOutDate && <div className="error-message" id="checkOutDate-error" role="alert">{errors.checkOutDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkInTime">
                  Check-In Time{isCoLivingShortTerm && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="checkInTime"
                  name="checkInTime"
                  type="time"
                  value={form.checkInTime}
                  onChange={handleChange}
                  className={errors.checkInTime ? 'error' : ''}
                  required={isCoLivingShortTerm}
                  disabled={isCoLivingLongTerm || submitting}
                />
                {errors.checkInTime && <div className="error-message" id="checkInTime-error" role="alert">{errors.checkInTime}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutTime">
                  Check-Out Time{isCoLivingShortTerm && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="checkOutTime"
                  name="checkOutTime"
                  type="time"
                  value={form.checkOutTime}
                  onChange={handleChange}
                  className={errors.checkOutTime ? 'error' : ''}
                  min={minCheckOutTime()}
                  required={isCoLivingShortTerm}
                  disabled={isCoLivingLongTerm || submitting}
                />
                {errors.checkOutTime && <div className="error-message" id="checkOutTime-error" role="alert">{errors.checkOutTime}</div>}
              </div>
            </>
          )}

          {segment === "coWorking" && (
            <>
              <div className="user-form-row">
                <label htmlFor="memberType">
                  Member Type <span className="required-asterisk">*</span>
                </label>
                <select
                  id="memberType"
                  name="memberType"
                  value={form.memberType}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div className="user-form-row">
                <label htmlFor="moveInDate">
                  Move-In Date{isCoWorkingTemporary && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="moveInDate"
                  name="moveInDate"
                  type="date"
                  value={form.moveInDate}
                  onChange={handleChange}
                  className={errors.moveInDate ? 'error' : ''}
                  required={isCoWorkingTemporary}
                  disabled={isCoWorkingPermanent || submitting}
                />
                {errors.moveInDate && <div className="error-message" id="moveInDate-error" role="alert">{errors.moveInDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="moveOutDate">
                  Move-Out Date{isCoWorkingTemporary && <span className="required-asterisk">*</span>}
                </label>
                <input
                  id="moveOutDate"
                  name="moveOutDate"
                  type="date"
                  value={form.moveOutDate}
                  onChange={handleChange}
                  className={errors.moveOutDate ? 'error' : ''}
                  min={minMoveOutDate()}
                  required={isCoWorkingTemporary}
                  disabled={isCoWorkingPermanent || submitting}
                />
                {errors.moveOutDate && <div className="error-message" id="moveOutDate-error" role="alert">{errors.moveOutDate}</div>}
              </div>
            </>
          )}

          {segment === "hotel" && (
            <>
              <div className="user-form-row">
                <label htmlFor="checkInDate">
                  Check-In Date {!isHotelMonthly && <span className="required-asterisk">*</span>}
                  {isHotelMonthly && <span style={{ fontSize: '0.85em', color: '#666' }}> (Not required for Monthly)</span>}
                </label>
                <input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  value={form.checkInDate}
                  onChange={handleChange}
                  className={errors.checkInDate ? 'error' : ''}
                  required={!isHotelMonthly}
                  disabled={isHotelMonthly || submitting}
                />
                {errors.checkInDate && <div className="error-message" id="checkInDate-error" role="alert">{errors.checkInDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutDate">
                  Check-Out Date {!isHotelMonthly && <span className="required-asterisk">*</span>}
                  {isHotelMonthly && <span style={{ fontSize: '0.85em', color: '#666' }}> (Not required for Monthly)</span>}
                </label>
                <input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  className={errors.checkOutDate ? 'error' : ''}
                  min={minCheckOutDate()}
                  required={!isHotelMonthly}
                  disabled={isHotelMonthly || submitting}
                />
                {errors.checkOutDate && <div className="error-message" id="checkOutDate-error" role="alert">{errors.checkOutDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkInTime">
                  Check-In Time {!isHotelMonthly && <span className="required-asterisk">*</span>}
                  {isHotelMonthly && <span style={{ fontSize: '0.85em', color: '#666' }}> (Not required for Monthly)</span>}
                </label>
                <input
                  id="checkInTime"
                  name="checkInTime"
                  type="time"
                  value={form.checkInTime}
                  onChange={handleChange}
                  className={errors.checkInTime ? 'error' : ''}
                  required={!isHotelMonthly}
                  disabled={isHotelMonthly || submitting}
                />
                {errors.checkInTime && <div className="error-message" id="checkInTime-error" role="alert">{errors.checkInTime}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutTime">
                  Check-Out Time {!isHotelMonthly && <span className="required-asterisk">*</span>}
                  {isHotelMonthly && <span style={{ fontSize: '0.85em', color: '#666' }}> (Not required for Monthly)</span>}
                </label>
                <input
                  id="checkOutTime"
                  name="checkOutTime"
                  type="time"
                  value={form.checkOutTime}
                  onChange={handleChange}
                  className={errors.checkOutTime ? 'error' : ''}
                  min={minCheckOutTime()}
                  required={!isHotelMonthly}
                  disabled={isHotelMonthly || submitting}
                />
                {errors.checkOutTime && <div className="error-message" id="checkOutTime-error" role="alert">{errors.checkOutTime}</div>}
              </div>
            </>
          )}
        </div>

        <div className="user-form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            aria-label="Submit user form" 
            disabled={licensesFull && !user}
            loading={submitting}
            title={licensesFull && !user ? "All licenses are currently in use" : (user ? "Update user" : "Add new user")}
          >
            {user ? "Update" : "Add"}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            aria-label="Cancel user form"
            disabled={submitting}
            title="Cancel and close"
          >
            Cancel
          </Button>
        </div>
      </form>

      <ConfirmationModal
        open={showUpdateConfirmation}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        title="Update User"
        message={
          pendingUserData
            ? `Are you sure you want to update user "${pendingUserData.firstName} ${pendingUserData.lastName}" (${pendingUserData.id})? This will modify their account details and may affect their network access.`
            : ''
        }
        confirmText="Update"
        cancelText="Cancel"
        variant="primary"
        loading={submitting}
      />
    </Modal>
  );
};

export default UserFormModal;