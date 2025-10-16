// src/pages/UserManagement/UserFormModal.js

import React, { useState, useEffect, useRef } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { segmentFieldConfig } from "../../config/segmentFieldConfig";
import siteConfig from "../../config/siteConfig";
import { isEmailValid, isRequired } from "../../utils/validationUtils";
import { toast } from "react-toastify";
import "./UserFormModal.css";
import UserLicenseBar from '../../components/common/UserLicenseBar';

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
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULTS = {
  checkInDate: getTodayISO(),
  checkOutDate: getTodayISO(),
  moveInDate: getTodayISO(),
  moveOutDate: getTodayISO(),
  checkInTime: "11:00",
  checkOutTime: "14:00",
};

const UserFormModal = ({ user, onSubmit, onClose, segment }) => {
  const allowedCycleTypes = ["Daily", "Monthly"];
  const allowedSpeeds = segment === "enterprise" ? ["10 Mbps", "25 Mbps", "50 Mbps"] : ["5 Mbps", "10 Mbps", "15 Mbps"];
  const allowedVolumes = segment === "enterprise" ? ["50 GB", "100 GB", "200 GB"] : ["10 GB", "25 GB", "50 GB"];
  const allowedDeviceCounts = ["1", "2", "3", "4", "5"];
  const isCycleTypeStatic = user && user.segment === "hotel";
  
  let initialResidentType = "";
  let initialMemberType = "";

  if (segment === "coLiving") {
    initialResidentType = "Long-Term";
  } else if (segment === "coWorking") {
    initialMemberType = "Permanent";
  }

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
  const firstInputRef = useRef(null);
  const licensesFull = USED_LICENSES >= MAX_LICENSES;

  useEffect(() => {
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
        residentType: user?.residentType || initialResidentType,
        memberType: user?.memberType || initialMemberType,
        checkInDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInDate : "",
        checkOutDate: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutDate : "",
        checkInTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkInTime : "",
        checkOutTime: (segment === "coLiving" || segment === "hotel") ? DEFAULTS.checkOutTime : "",
        moveInDate: segment === "coWorking" ? DEFAULTS.moveInDate : "",
        moveOutDate: segment === "coWorking" ? DEFAULTS.moveOutDate : "",
      }));
    }
    setErrors({});
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, [user, segment]);

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
  const isEmailRequired = EMAIL_REQUIRED_SEGMENTS[segment] ?? false;

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
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (licensesFull) {
      toast.error("Cannot add more users: all licenses are used. Please suspend or block an existing user or request additional licenses.");
      return;
    }
    if (validate()) {
      const userCategory = USER_CATEGORY_SEGMENT[segment] || "user";
      const newUser = {
        ...form,
        status: "Active",
        userCategory,
        password: randomPassword(),
      };
      try {
        await onSubmit(newUser);
        toast.success("User saved successfully");
        onClose();
      } catch {
        toast.error("Failed to save user");
      }
    } else {
      toast.error("Please fix errors before submitting");
    }
  };

  return (
    <Modal onClose={onClose} aria-labelledby="user-form-title" aria-modal="true" role="dialog">
      <form className="user-form-modal" onSubmit={handleSubmit} noValidate>
        <h2 id="user-form-title" className="user-form-header">
          {user ? "Edit User" : "Add New User"}
        </h2>
        
        <div className="user-form-license-container">
          <UserLicenseBar current={USED_LICENSES} total={MAX_LICENSES} width={280} height={24} />
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
              disabled={!!user} 
              className={errors.id ? 'error' : ''}
              aria-invalid={!!errors.id} 
              aria-describedby="id-error" 
              required 
            />
            {errors.id && <div className="error-message" id="id-error" role="alert">{errors.id}</div>}
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
            />
            {errors.lastName && <div className="error-message" id="lastName-error" role="alert">{errors.lastName}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="mobile">Mobile <span className="required-asterisk">*</span></label>
            <input 
              id="mobile" 
              name="mobile" 
              value={form.mobile} 
              onChange={handleChange} 
              className={errors.mobile ? 'error' : ''}
              aria-invalid={!!errors.mobile} 
              aria-describedby="mobile-error" 
              required 
            />
            {errors.mobile && <div className="error-message" id="mobile-error" role="alert">{errors.mobile}</div>}
          </div>

          <div className="user-form-row">
            <label htmlFor="email">
              Email{isEmailRequired && <span className="required-asterisk">*</span>}
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
              disabled={isCycleTypeStatic}
            >
              {allowedCycleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
            >
              {allowedSpeeds.map(speed => (
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
            >
              {allowedVolumes.map(volume => (
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
            >
              {allowedDeviceCounts.map(count => (
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
                  disabled={isCoLivingLongTerm}
                />
                {errors.checkInDate && <div className="error-message" id="checkInDate-error" role="alert">{errors.checkInDate}</div>}
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
                  disabled={isCoLivingLongTerm}
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
                  disabled={isCoLivingLongTerm}
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
                  disabled={isCoLivingLongTerm}
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
                  disabled={isCoWorkingPermanent}
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
                  disabled={isCoWorkingPermanent}
                />
                {errors.moveOutDate && <div className="error-message" id="moveOutDate-error" role="alert">{errors.moveOutDate}</div>}
              </div>
            </>
          )}

          {segment === "hotel" && (
            <>
              <div className="user-form-row">
                <label htmlFor="checkInDate">Check-In Date <span className="required-asterisk">*</span></label>
                <input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  value={form.checkInDate}
                  onChange={handleChange}
                  className={errors.checkInDate ? 'error' : ''}
                  required
                />
                {errors.checkInDate && <div className="error-message" id="checkInDate-error" role="alert">{errors.checkInDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutDate">Check-Out Date <span className="required-asterisk">*</span></label>
                <input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  className={errors.checkOutDate ? 'error' : ''}
                  min={minCheckOutDate()}
                  required
                />
                {errors.checkOutDate && <div className="error-message" id="checkOutDate-error" role="alert">{errors.checkOutDate}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkInTime">Check-In Time <span className="required-asterisk">*</span></label>
                <input
                  id="checkInTime"
                  name="checkInTime"
                  type="time"
                  value={form.checkInTime}
                  onChange={handleChange}
                  className={errors.checkInTime ? 'error' : ''}
                  required
                />
                {errors.checkInTime && <div className="error-message" id="checkInTime-error" role="alert">{errors.checkInTime}</div>}
              </div>

              <div className="user-form-row">
                <label htmlFor="checkOutTime">Check-Out Time <span className="required-asterisk">*</span></label>
                <input
                  id="checkOutTime"
                  name="checkOutTime"
                  type="time"
                  value={form.checkOutTime}
                  onChange={handleChange}
                  className={errors.checkOutTime ? 'error' : ''}
                  min={minCheckOutTime()}
                  required
                />
                {errors.checkOutTime && <div className="error-message" id="checkOutTime-error" role="alert">{errors.checkOutTime}</div>}
              </div>
            </>
          )}
        </div>

        <div className="user-form-actions">
          <Button type="submit" variant="primary" aria-label="Submit user form" disabled={licensesFull}>
            {user ? "Update" : "Add"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} aria-label="Cancel user form">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;