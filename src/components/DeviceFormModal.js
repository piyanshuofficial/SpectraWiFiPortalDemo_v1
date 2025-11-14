// src/components/DeviceFormModal.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Modal from '@components/Modal';
import Button from '@components/Button';
import '@components/DeviceFormModal.css';
import SEGMENT_DEVICE_AVAILABILITY from '@config/segmentDeviceConfig';
import { DATA_LIMITS, ANIMATION, DEVICE } from '@constants/appConstants';
import { VALIDATION } from '@constants/appConstants';

const HUMAN_DEVICE_CATEGORIES = [
  'Mobile',
  'Laptop',
  'Tablet',
  'iPad',
  'Smart Speaker'
];

const NONHUMAN_DEVICE_CATEGORIES = [
  'Security Camera',
  'IP Camera',
  'Video Recording Server',
  'DVR/NVR',
  'Access Control System',
  'Biometric',
  'Intrusion Detection Sensor',
  'Smoke Detector',
  'Carbon Monoxide Detector',
  'Smart Thermostat',
  'Smart Lighting System',
  'Smart Lock',
  'HVAC Controller',
  'Building Automation System',
  'Smart TV',
  'Streaming Device',
  'Gaming Console',
  'Smart Speaker',
  'Digital Signage Display',
  'Printer',
  'Scanner',
  'Projector',
  'Point-of-Sale (POS) System',
  'Alarm System',
  'Smart Plug',
  'Smart Appliance',
  'Digital Assistant',
  'Miscellaneous'
];

const DEVICE_TYPE_PREFIX = {
  'Mobile': 'MOB',
  'Laptop': 'LAP',
  'Tablet': 'TAB',
  'iPad': 'IPAD',
  'Smart Speaker': 'SSPK',
  'Security Camera': 'CAM',
  'IP Camera': 'IPC',
  'Video Recording Server': 'VRS',
  'DVR/NVR': 'DVR',
  'Access Control System': 'ACS',
  'Biometric': 'BIO',
  'Intrusion Detection Sensor': 'IDS',
  'Smoke Detector': 'SD',
  'Carbon Monoxide Detector': 'CMD',
  'Smart Thermostat': 'THM',
  'Smart Lighting System': 'SLS',
  'Smart Lock': 'SLOCK',
  'HVAC Controller': 'HVAC',
  'Building Automation System': 'BAS',
  'Smart TV': 'TV',
  'Streaming Device': 'STR',
  'Gaming Console': 'GCON',
  'Digital Signage Display': 'DSD',
  'Printer': 'PRN',
  'Scanner': 'SCN',
  'Projector': 'PROJ',
  'Point-of-Sale (POS) System': 'POS',
  'Alarm System': 'ALRM',
  'Smart Plug': 'SPLG',
  'Smart Appliance': 'SAPL',
  'Digital Assistant': 'DASST',
  'Miscellaneous': 'MISC'
};

const SEGMENT_ALLOW_MANUAL_OVERRIDE = {
  enterprise: true,
  coWorking: true,
  coLiving: false
};

function generateNextDeviceUserId(category, existingIds = []) {
  const prefix = DEVICE_TYPE_PREFIX[category] || 'DEV';
  let maxNum = 0;
  existingIds.forEach(id => {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  });
  const nextNum = String(maxNum + 1).padStart(DEVICE.USER_ID_NUMBER_LENGTH, '0');
  return `${prefix}-${nextNum}`;
}

function DeviceFormModal({
  open,
  onClose,
  onSubmit,
  device,
  users = [],
  devices = [],
  segment = 'enterprise',
  siteUserList = [],
  submitting = false
}) {
  const [mode, setMode] = useState('bindUser');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deviceCategory, setDeviceCategory] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [userId, setUserId] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  // Memoize existingDeviceUserIds to prevent unnecessary recalculations
  const existingDeviceUserIds = useMemo(() => 
    devices.map(dev => dev.userId).filter(Boolean),
    [devices]
  );

  const { allowHuman = true, allowNonHuman = true } = SEGMENT_DEVICE_AVAILABILITY[segment] || {};

  useEffect(() => {
    if (open) {
      if (allowHuman && !allowNonHuman) setMode('bindUser');
      else if (!allowHuman && allowNonHuman) setMode('deviceUser');
      else setMode('bindUser');
      setSearchTerm('');
      setSelectedUser(null);
      setDeviceCategory('');
      setDeviceName('');
      setUserId('');
      setMacAddress('');
      setErrors({});
      setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), ANIMATION.AUTO_FOCUS_DELAY);
    }
  }, [open, allowHuman, allowNonHuman]);

  useEffect(() => {
    if (mode === 'deviceUser' && deviceCategory) {
      const genId = generateNextDeviceUserId(deviceCategory, existingDeviceUserIds);
      setUserId(genId);
      setDeviceName(`${deviceCategory} ${genId}`);
    }
  }, [mode, deviceCategory, existingDeviceUserIds]);

  const filteredUsers = siteUserList.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function validate() {
    const errs = {};
    if (mode === 'bindUser') {
      if (!selectedUser) errs.selectedUser = 'Select a user to bind the device';
    }
    if (!deviceCategory) errs.deviceCategory = 'Device category is required';
    if (!deviceName.trim()) errs.deviceName = 'Device name is required';
    if (!macAddress.trim()) errs.macAddress = 'MAC Address is required';
    else if (!/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(macAddress))
      errs.macAddress = 'MAC must be in format AA:BB:CC:DD:EE:FF';
    if (mode === 'deviceUser') {
      if (!userId.trim()) errs.userId = 'Auto-generated User ID required';
      if (existingDeviceUserIds.includes(userId.trim()) && (!device || device.userId !== userId.trim())) {
        errs.userId = 'Suggested User ID already in use, try a new category or edit.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    
    let deviceData = {};
    if (mode === 'bindUser') {
      deviceData = {
        mode,
        userId: selectedUser.id,
        deviceCategory,
        deviceName: deviceName.trim(),
        macAddress: macAddress.trim().toUpperCase()
      };
    } else {
      deviceData = {
        mode,
        userId: userId.trim(),
        deviceCategory,
        deviceName: deviceName.trim(),
        macAddress: macAddress.trim().toUpperCase()
      };
    }
    await onSubmit(deviceData);
  }

  const allowOverride = SEGMENT_ALLOW_MANUAL_OVERRIDE[segment] ?? true;
  const categoryOptions = mode === 'bindUser' ? HUMAN_DEVICE_CATEGORIES : NONHUMAN_DEVICE_CATEGORIES;

  if (!open || (!allowHuman && !allowNonHuman)) return null;

  return (
    <Modal onClose={onClose}>
      <div 
        className="device-form-modal"
        role="dialog"
        aria-labelledby="device-form-heading"
        aria-modal="true"
      >
        <h2 
          id="device-form-heading" 
          className="device-form-header"
        >
          Register New Device
        </h2>
        <div className="device-form-scrollable-content">
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="sr-only">Device registration form</legend>
              
              <div className="device-form-row mapping-type-row">
                <span id="mapping-type-label" className="form-label">
                  Mapping Type
                </span>
                <div 
                  className="mapping-type-options"
                  role="radiogroup"
                  aria-labelledby="mapping-type-label"
                >
                  {allowHuman && (
                    <label>
                      <input
                        type="radio"
                        name="mappingType"
                        checked={mode === 'bindUser'}
                        onChange={() => setMode('bindUser')}
                        aria-label="Bind device to human user"
                      />
                      <span>Bind to Human User</span>
                    </label>
                  )}
                  {allowNonHuman && (
                    <label>
                      <input
                        type="radio"
                        name="mappingType"
                        checked={mode === 'deviceUser'}
                        onChange={() => setMode('deviceUser')}
                        aria-label="Register device as device user"
                      />
                      <span>Register as Device User</span>
                    </label>
                  )}
                </div>
              </div>

              {mode === 'bindUser' && allowHuman && (
                <div className="device-form-row">
                  <label htmlFor="userSearch">
                    Assign To User<span className="required-asterisk">*</span>
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      ref={firstInputRef}
                      id="userSearch"
                      placeholder="Search user by name, email or ID..."
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setSelectedUser(null);
                      }}
                      autoComplete="off"
                      className={errors.selectedUser ? 'error' : ''}
                      aria-invalid={!!errors.selectedUser}
                      aria-describedby={errors.selectedUser ? "selectedUser-error" : undefined}
                      aria-autocomplete="list"
                      aria-controls="user-search-results"
                      aria-expanded={searchTerm.trim().length > 0 && filteredUsers.length > 0}
                      style={{ width: '100%' }}
                    />

                    {searchTerm.trim().length > 0 && filteredUsers.length > 0 && (
                      <div 
                        id="user-search-results"
                        className="search-results-list-wrapper"
                        role="listbox"
                        aria-label="User search results"
                      >
                        {filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className={`search-user-row${selectedUser?.id === user.id ? ' selected' : ''}`}
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchTerm(`${user.name} (${user.id})`);
                            }}
                            tabIndex={0}
                            role="option"
                            aria-selected={selectedUser?.id === user.id}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedUser(user);
                                setSearchTerm(`${user.name} (${user.id})`);
                              }
                            }}
                          >
                            <span className="search-user-name">{user.name}</span>
                            <span className="search-user-id">({user.id})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.selectedUser && (
                    <div className="error-message" id="selectedUser-error" role="alert">
                      {errors.selectedUser}
                    </div>
                  )}
                </div>
              )}

              <div className="device-form-row">
                <label htmlFor="devcat">
                  Device Category<span className="required-asterisk">*</span>
                </label>
                <select
                  id="devcat"
                  value={deviceCategory}
                  onChange={e => setDeviceCategory(e.target.value)}
                  required
                  className={errors.deviceCategory ? 'error' : ''}
                  aria-invalid={!!errors.deviceCategory}
                  aria-describedby={errors.deviceCategory ? "devcat-error" : undefined}
                >
                  <option value="">Choose category...</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.deviceCategory && (
                  <div className="error-message" id="devcat-error" role="alert">
                    {errors.deviceCategory}
                  </div>
                )}
              </div>

              {mode === 'deviceUser' && allowNonHuman && (
                <div className="device-form-row">
                  <label htmlFor="userid">
                    Device User ID<span className="required-asterisk">*</span>
                    {allowOverride && (
                      <span style={{ fontSize: '0.79em', color: '#8aa' }}> (auto-suggested, can edit)</span>
                    )}
                  </label>
                  <input
                    id="userid"
                    value={userId}
                    onChange={e => allowOverride && setUserId(e.target.value)}
                    maxLength={DATA_LIMITS.MAX_USER_ID_LENGTH}
                    className={errors.userId ? 'error' : ''}
                    disabled={!allowOverride}
                    required
                    aria-invalid={!!errors.userId}
                    aria-describedby={errors.userId ? "userid-error" : undefined}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {errors.userId && (
                    <div className="error-message" id="userid-error" role="alert">
                      {errors.userId}
                    </div>
                  )}
                </div>
              )}

              <div className="device-form-row">
                <label htmlFor="devicename">
                  Device Name<span className="required-asterisk">*</span>
                  {mode === 'deviceUser' && allowOverride && (
                    <span style={{ fontSize: '0.79em', color: '#8aa' }}> (auto-suggested, can edit)</span>
                  )}
                </label>
                <input
                  id="devicename"
                  value={deviceName}
                  onChange={e => setDeviceName(e.target.value)}
                  maxLength={DATA_LIMITS.MAX_DEVICE_NAME_LENGTH}
                  className={errors.deviceName ? 'error' : ''}
                  required
                  aria-invalid={!!errors.deviceName}
                  aria-describedby={errors.deviceName ? "devicename-error" : undefined}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.deviceName && (
                  <div className="error-message" id="devicename-error" role="alert">
                    {errors.deviceName}
                  </div>
                )}
              </div>

              <div className="device-form-row">
                <label htmlFor="mac">
                  MAC Address<span className="required-asterisk">*</span>
                </label>
                <input
                  id="mac"
                  value={macAddress}
                  onChange={e => {
                    let val = e.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase().slice(0,12);
                    let pretty = val.match(/.{1,2}/g)?.join(':') || '';
                    setMacAddress(pretty);
                  }}
                  maxLength={DATA_LIMITS.MAC_ADDRESS_LENGTH}
                  placeholder={VALIDATION.MAC_ADDRESS_FORMAT}
                  className={errors.macAddress ? 'error' : ''}
                  autoComplete="off"
                  spellCheck={false}
                  required
                  aria-invalid={!!errors.macAddress}
                  aria-describedby={errors.macAddress ? "mac-error" : undefined}
                />
                {errors.macAddress && (
                  <div className="error-message" id="mac-error" role="alert">
                    {errors.macAddress}
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </div>
        <div className="device-form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            aria-label="Cancel device registration"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            onClick={handleSubmit} 
            aria-label={device ? "Update device information" : "Register new device"}
            loading={submitting}
          >
            {device ? "Update Device" : "Register Device"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeviceFormModal;