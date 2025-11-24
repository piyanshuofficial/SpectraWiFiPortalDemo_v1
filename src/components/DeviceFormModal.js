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
      // If editing an existing device, populate the form
      if (device) {
        // Determine mode based on device data
        const isDeviceUser = device.deviceType === 'other' || !device.owner || device.owner === 'System' || device.owner === 'Unassigned';
        setMode(isDeviceUser ? 'deviceUser' : 'bindUser');

        // Set device category
        setDeviceCategory(device.category || '');

        // Set device name
        setDeviceName(device.name || '');

        // Set MAC address
        setMacAddress(device.mac || '');

        // Set user ID for device user mode
        if (isDeviceUser) {
          setUserId(device.userId || '');
        } else {
          // Find and set the selected user for bind user mode
          const user = siteUserList.find(u => u.id === device.userId);
          if (user) {
            setSelectedUser(user);
            setSearchTerm(`${user.firstName} ${user.lastName} (${user.id})`);
          }
        }

        setErrors({});
      } else {
        // Creating new device - reset form
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
      }
      setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), ANIMATION.AUTO_FOCUS_DELAY);
    }
  }, [open, allowHuman, allowNonHuman, device, siteUserList]);

  useEffect(() => {
    if (mode === 'deviceUser' && deviceCategory) {
      const genId = generateNextDeviceUserId(deviceCategory, existingDeviceUserIds);
      setUserId(genId);
      setDeviceName(`${deviceCategory} ${genId}`);
    }
  }, [mode, deviceCategory, existingDeviceUserIds]);

  const filteredUsers = siteUserList.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.id?.toLowerCase().includes(searchLower)
    );
  });

  function validate() {
    const errs = {};
    if (mode === 'bindUser') {
      if (!selectedUser) {
        errs.selectedUser = 'Select a user to bind the device';
      } else if (!device) {
        // Only check device limit when registering a NEW device (not when editing)
        // Count how many devices this user already has
        const userDeviceCount = devices.filter(d => d.userId === selectedUser.id).length;

        // Get user's device limit from their policy
        const userDeviceLimit = parseInt(selectedUser.deviceLimit) || 0;

        // Check if user has reached their device limit
        if (userDeviceCount >= userDeviceLimit) {
          errs.selectedUser = `User ${selectedUser.firstName} ${selectedUser.lastName} has reached their device limit (${userDeviceLimit} ${userDeviceLimit === 1 ? 'device' : 'devices'}). They currently have ${userDeviceCount} ${userDeviceCount === 1 ? 'device' : 'devices'} registered.`;
        }
      }
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

    // If editing existing device, include device ID
    if (device) {
      deviceData.id = device.id;
      deviceData.isEdit = true;
    }

    // ========================================
    // TODO: Backend Integration - Device Registration/Update
    // ========================================
    // This is where device data needs to be persisted to backend
    // 
    // API Endpoint:
    // - Create: POST /api/devices/register
    // - Update: PUT /api/devices/{deviceId}/update
    // 
    // Request Payload:
    // {
    //   mode: 'bindUser' | 'deviceUser',
    //   userId: string, // Human user ID or device user ID
    //   deviceCategory: string,
    //   deviceName: string,
    //   macAddress: string (uppercase, format: AA:BB:CC:DD:EE:FF),
    //   siteId: string,
    //   segment: string,
    //   registeredBy: currentUserId,
    //   timestamp: ISO8601
    // }
    // 
    // Backend Processing:
    // 
    // 1. MAC Address Validation:
    //    - Check uniqueness across site (or cluster if roaming enabled)
    //    - Query: SELECT * FROM devices WHERE mac_address = ? AND site_id = ?
    //    - If exists and not same device being edited: Return 409 Conflict
    //    - Validate MAC format and check against random MAC patterns
    //    - Query OUI database to get vendor/manufacturer info
    // 
    // 2. Device User Creation (if mode === 'deviceUser'):
    //    - Create a "Device User" account in UMP
    //    - Do NOT provision in AAA (device users don't authenticate)
    //    - Generate device credentials for MAC binding
    //    - Set user_category = 'device'
    //    - Assign to appropriate device policy
    // 
    // 3. MAC Binding in Network:
    //    - If mode === 'bindUser':
    //      * Add MAC to existing user's allowed devices list in AAA
    //      * Check against user's device limit policy
    //      * Update NAS (Network Access Server) with MAC whitelist
    //      * Configure firewall rules for MAC-based access
    //    - If mode === 'deviceUser':
    //      * Create new account-MAC binding in AAA
    //      * Set device-specific network policies
    //      * Configure VLAN assignment for device category
    //      * Set bandwidth limits based on device type
    // 
    // 4. Database Operations:
    //    - Insert/Update devices table:
    //      * device_id (UUID)
    //      * user_id (human or device user)
    //      * mac_address
    //      * device_name
    //      * device_category
    //      * vendor (from OUI lookup)
    //      * registered_at
    //      * registered_by
    //      * site_id
    //      * status ('active')
    //    - Update user's device count if binding to human user
    // 
    // 5. Network Controller Updates:
    //    - Send MAC update to wireless controller
    //    - Endpoint: POST /controller/api/add-client-mac
    //    - Clear any existing authentication cache for this MAC
    //    - Trigger RADIUS attribute update
    // 
    // 6. Audit Trail:
    //    - Create detailed audit log:
    //      * action: 'device_registered' | 'device_updated'
    //      * device_mac: string
    //      * device_name: string
    //      * bound_to_user: userId
    //      * mode: 'bindUser' | 'deviceUser'
    //      * admin_user: currentUserId
    //      * timestamp
    //      * ip_address
    // 
    // 7. Validation Checks:
    //    - Verify user exists and is Active
    //    - Check user hasn't exceeded device limit
    //    - Confirm site has device registration capability enabled
    //    - Validate segment allows selected device category
    // 
    // Response Format:
    // {
    //   success: true,
    //   data: {
    //     deviceId: string,
    //     macAddress: string,
    //     bindingStatus: 'success' | 'pending',
    //     userId: string,
    //     vendor: string, // from OUI lookup
    //     message: 'Device registered successfully'
    //   }
    // }
    // 
    // Error Handling:
    // - 400: Validation error (invalid MAC format, missing fields)
    // - 409: MAC address already registered
    // - 422: User device limit exceeded
    // - 500: Network controller communication failure
    // - 503: AAA system unavailable
    // 
    // Implementation Example:
    // try {
    //   const apiEndpoint = device 
    //     ? `/api/devices/${device.id}/update` 
    //     : '/api/devices/register';
    //   const method = device ? 'PUT' : 'POST';
    //   
    //   const response = await fetch(apiEndpoint, {
    //     method,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${authToken}`
    //     },
    //     body: JSON.stringify({
    //       ...deviceData,
    //       siteId: currentSiteId,
    //       segment: segment,
    //       registeredBy: currentUser.id
    //     })
    //   });
    //   
    //   const result = await response.json();
    //   
    //   if (!response.ok) {
    //     if (response.status === 409) {
    //       setErrors({ macAddress: 'MAC address already registered' });
    //       return;
    //     }
    //     throw new Error(result.message);
    //   }
    //   
    //   // Success - pass enriched data to parent
    //   await onSubmit({
    //     ...deviceData,
    //     deviceId: result.data.deviceId,
    //     vendor: result.data.vendor
    //   });
    //   
    // } catch (error) {
    //   console.error('Device registration error:', error);
    //   notifications.operationFailed('register device');
    // }
    // 
    // Real-time Updates:
    // - After successful registration, broadcast via WebSocket:
    //   { type: 'DEVICE_REGISTERED', deviceId, mac, userId, siteId }
    // - Update device count in monitoring dashboard
    // - Refresh network topology visualization if displayed
    // 
    // Monitoring Integration:
    // - Start tracking device in monitoring system
    // - POST /api/monitoring/add-device
    // - Track: connection status, bandwidth usage, location (AP)
    // ========================================
    
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
          {device ? 'Edit Device' : 'Register New Device'}
        </h2>
        <div className="device-form-scrollable-content">
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              {!device && <legend className="sr-only">Device registration form</legend>}
              
              <div className="device-form-row mapping-type-row">
                <span id="mapping-type-label" className="form-label">
                  Mapping Type {device && <span style={{ fontSize: '0.85em', color: '#666' }}>(Non-editable)</span>}
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
                        disabled={!!device}
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
                        disabled={!!device}
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
                    {device ? 'Owner' : 'Assign To User'}<span className="required-asterisk">*</span>
                    {device && <span style={{ fontSize: '0.85em', color: '#666' }}> (Non-editable)</span>}
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
                        
                        // ========================================
                        // TODO: Backend Integration - Real-time User Search
                        // ========================================
                        // Implement server-side user search with debouncing
                        // 
                        // For large user lists (>1000), client-side filtering is insufficient
                        // Implement debounced API call for search:
                        // 
                        // useEffect(() => {
                        //   const searchTimer = setTimeout(async () => {
                        //     if (searchTerm.length >= 3) {
                        //       const response = await fetch(
                        //         `/api/users/search?q=${encodeURIComponent(searchTerm)}&siteId=${siteId}&segment=${segment}&limit=50`
                        //       );
                        //       const result = await response.json();
                        //       setFilteredUsers(result.data.users);
                        //     }
                        //   }, 300); // Debounce 300ms
                        //   
                        //   return () => clearTimeout(searchTimer);
                        // }, [searchTerm]);
                        // 
                        // Backend should implement:
                        // - Full-text search across name, email, userId
                        // - Filter by Active status only (no devices for Blocked users)
                        // - Return device count with each user
                        // - Highlight if user at device limit
                        // - Order by relevance/match score
                        // ========================================
                      }}
                      autoComplete="off"
                      className={errors.selectedUser ? 'error' : ''}
                      aria-invalid={!!errors.selectedUser}
                      aria-describedby={errors.selectedUser ? "selectedUser-error" : undefined}
                      aria-autocomplete="list"
                      aria-controls="user-search-results"
                      aria-expanded={searchTerm.trim().length > 0 && filteredUsers.length > 0}
                      disabled={!!device}
                      style={{ width: '100%' }}
                    />

                    {searchTerm.trim().length > 0 && filteredUsers.length > 0 && (
                      <div 
                        id="user-search-results"
                        className="search-results-list-wrapper"
                        role="listbox"
                        aria-label="User search results"
                      >
                        {filteredUsers.map(user => {
                          const userDeviceCount = devices.filter(d => d.userId === user.id).length;
                          const userDeviceLimit = parseInt(user.deviceLimit) || 0;
                          const isAtLimit = userDeviceCount >= userDeviceLimit;

                          return (
                            <div
                              key={user.id}
                              className={`search-user-row${selectedUser?.id === user.id ? ' selected' : ''}${isAtLimit ? ' at-limit' : ''}`}
                              onClick={() => {
                                setSelectedUser(user);
                                setSearchTerm(`${user.firstName} ${user.lastName} (${user.id})`);
                              }}
                              tabIndex={0}
                              role="option"
                              aria-selected={selectedUser?.id === user.id}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedUser(user);
                                  setSearchTerm(`${user.firstName} ${user.lastName} (${user.id})`);
                                }
                              }}
                              title={isAtLimit ? `Device limit reached (${userDeviceCount}/${userDeviceLimit})` : `Devices: ${userDeviceCount}/${userDeviceLimit}`}
                            >
                              <div style={{ flex: 1 }}>
                                <span className="search-user-name">{user.firstName} {user.lastName}</span>
                                <span className="search-user-id">({user.id})</span>
                              </div>
                              <span className={`device-count-badge${isAtLimit ? ' at-limit' : ''}`}>
                                {userDeviceCount}/{userDeviceLimit} devices
                              </span>
                            </div>
                          );
                        })}
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
                    
                    // ========================================
                    // TODO: Backend Integration - Real-time MAC Validation
                    // ========================================
                    // Implement real-time MAC address validation as user types
                    // 
                    // Debounced API call to check MAC uniqueness:
                    // 
                    // useEffect(() => {
                    //   const validateTimer = setTimeout(async () => {
                    //     if (macAddress.length === 17) { // Full MAC entered
                    //       try {
                    //         const response = await fetch(
                    //           `/api/devices/validate-mac?mac=${macAddress}&siteId=${siteId}`
                    //         );
                    //         const result = await response.json();
                    //         
                    //         if (!result.data.isAvailable) {
                    //           setErrors(prev => ({
                    //             ...prev,
                    //             macAddress: `MAC already registered to ${result.data.existingDevice.name}`
                    //           }));
                    //         } else {
                    //           // Clear error if MAC is available
                    //           setErrors(prev => {
                    //             const { macAddress, ...rest } = prev;
                    //             return rest;
                    //           });
                    //           
                    //           // Optionally fetch vendor info from OUI database
                    //           if (result.data.vendor) {
                    //             // Display vendor info to user
                    //             // e.g., "Apple, Inc." for Apple devices
                    //           }
                    //         }
                    //       } catch (error) {
                    //         console.error('MAC validation error:', error);
                    //       }
                    //     }
                    //   }, 500); // Debounce 500ms
                    //   
                    //   return () => clearTimeout(validateTimer);
                    // }, [macAddress]);
                    // 
                    // Backend validation should check:
                    // 1. MAC uniqueness in site (or cluster if roaming enabled)
                    // 2. Detect random MAC patterns (iOS Privacy, Android MAC randomization)
                    // 3. Lookup OUI to get device manufacturer
                    // 4. Check against MAC blacklist (if any)
                    // 
                    // Response format:
                    // {
                    //   success: true,
                    //   data: {
                    //     isAvailable: boolean,
                    //     vendor: string, // e.g., "Apple, Inc."
                    //     isRandomMAC: boolean,
                    //     existingDevice: { name, userId } // if not available
                    //   }
                    // }
                    // ========================================
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