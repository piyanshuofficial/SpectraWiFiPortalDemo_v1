// src/pages/Internal/BulkOperations/BulkPolicyChange.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FaTimes,
  FaExchangeAlt,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaUpload,
  FaList,
  FaFileAlt,
  FaDownload,
} from 'react-icons/fa';
import Button from '@components/Button';
import Badge from '@components/Badge';
import ScheduleModal from '@components/ScheduleModal/ScheduleModal';
import { useScheduledTasks, ScheduledTaskTypes } from '@hooks/useScheduledTasks';
import { sampleUsers as userSampleData } from '@constants/userSampleData';
import { SPEED_OPTIONS_MONTHLY, DATA_OPTIONS_MONTHLY, DEVICE_COUNT_OPTIONS } from '@config/policyConfig';
import './BulkOperationModals.css';

// Generate policy options from available configurations
const policyOptions = SPEED_OPTIONS_MONTHLY.slice(0, 6).map((speed, idx) => ({
  value: `POLICY_${idx + 1}`,
  label: `${speed} - ${DATA_OPTIONS_MONTHLY[idx] || 'Unlimited'}`,
  maxDevices: DEVICE_COUNT_OPTIONS?.[idx % 3] || 3,
}));

/**
 * BulkPolicyChange - Modal for bulk policy changes
 */
const BulkPolicyChange = ({ isOpen, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPolicyId, setNewPolicyId] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [inputMode, setInputMode] = useState('list'); // 'list' or 'csv'
  const [csvData, setCsvData] = useState([]);
  const [csvError, setCsvError] = useState('');
  const fileInputRef = useRef(null);
  const { addScheduledTask } = useScheduledTasks();

  // Filter active users - handle different field names in sample data
  const eligibleUsers = useMemo(() => {
    if (!userSampleData || !Array.isArray(userSampleData)) {
      return [];
    }
    return userSampleData.filter((user) => {
      const userStatus = user.status?.toLowerCase();
      return userStatus === 'active';
    });
  }, []);

  // Filter users based on search - handle different field names
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return eligibleUsers;
    const term = searchTerm.toLowerCase();
    return eligibleUsers.filter((user) => {
      const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const userId = user.userId || user.id || '';
      return (
        fullName.toLowerCase().includes(term) ||
        userId.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.mobile?.toLowerCase().includes(term)
      );
    });
  }, [eligibleUsers, searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearchTerm('');
      setNewPolicyId('');
      setReason('');
      setInputMode('list');
      setCsvData([]);
      setCsvError('');
    }
  }, [isOpen]);

  // CSV file handling
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;

        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setCsvError('CSV file must have a header row and at least one data row');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const userIdIndex = headers.findIndex(h =>
          h === 'userid' || h === 'user_id' || h === 'id' || h === 'user id'
        );

        if (userIdIndex === -1) {
          setCsvError('CSV must have a "userId" or "id" column');
          return;
        }

        const parsedUsers = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const oduserId = values[userIdIndex];
          if (oduserId) {
            parsedUsers.push({
              oduserId,
              reason: values[headers.indexOf('reason')] || ''
            });
          }
        }

        if (parsedUsers.length === 0) {
          setCsvError('No valid user IDs found in CSV');
          return;
        }

        setCsvData(parsedUsers);
        setSelectedUsers(parsedUsers.map(u => u.oduserId));
      } catch (err) {
        setCsvError('Failed to parse CSV file');
      }
    };

    reader.onerror = () => {
      setCsvError('Failed to read file');
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = 'userId,reason\nUSER001,Policy upgrade\nUSER002,Annual renewal';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_policy_change_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearCsvData = () => {
    setCsvData([]);
    setSelectedUsers([]);
    setCsvError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !scheduleModalOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, scheduleModalOpen, onClose]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.userId || u.id));
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleExecuteNow = async () => {
    if (selectedUsers.length === 0 || !newPolicyId) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Changing policy for users:', selectedUsers, 'to:', newPolicyId);
      onClose();
    } catch (err) {
      console.error('Operation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSchedule = (scheduledDateTime) => {
    addScheduledTask({
      type: ScheduledTaskTypes.BULK_POLICY_CHANGE,
      targetType: 'users',
      targetIds: selectedUsers,
      targetCount: selectedUsers.length,
      scheduledFor: scheduledDateTime.toISOString(),
      parameters: { newPolicyId, reason },
    });
    setScheduleModalOpen(false);
    onClose();
  };

  const selectedPolicy = policyOptions.find((p) => p.value === newPolicyId);

  if (!isOpen) return null;

  return (
    <>
      <div className="bulk-modal-overlay" onClick={onClose}>
        <div
          className="bulk-modal-content bulk-modal-content--wide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bulk-modal-header bulk-modal-header--info">
            <h2 className="bulk-modal-title">
              <FaExchangeAlt /> Bulk Policy Change
            </h2>
            <button className="bulk-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="bulk-modal-body">
            {/* Policy Selection */}
            <div className="bulk-policy-section">
              <label htmlFor="newPolicy">Select New Policy *</label>
              <select
                id="newPolicy"
                value={newPolicyId}
                onChange={(e) => setNewPolicyId(e.target.value)}
                className="policy-select"
              >
                <option value="">-- Select Policy --</option>
                {policyOptions.map((policy) => (
                  <option key={policy.value} value={policy.value}>
                    {policy.label}
                  </option>
                ))}
              </select>
              {selectedPolicy && (
                <p className="policy-description">
                  {selectedPolicy.description || `Max ${selectedPolicy.maxDevices} devices`}
                </p>
              )}
            </div>

            {/* Input Mode Tabs */}
            <div className="bulk-input-tabs">
              <button
                className={`bulk-tab ${inputMode === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setInputMode('list');
                  clearCsvData();
                }}
              >
                <FaList /> Select from List
              </button>
              <button
                className={`bulk-tab ${inputMode === 'csv' ? 'active' : ''}`}
                onClick={() => {
                  setInputMode('csv');
                  setSelectedUsers([]);
                }}
              >
                <FaUpload /> Upload CSV
              </button>
            </div>

            {inputMode === 'list' ? (
              <>
                {/* Search and Selection */}
                <div className="bulk-search-section">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="selection-info">
                    <span>{selectedUsers.length} selected</span>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={toggleSelectAll}
                    >
                      {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                        ? 'Deselect All'
                        : 'Select All'}
                    </Button>
                  </div>
                </div>

                {/* User List */}
                <div className="bulk-user-list">
                  {filteredUsers.length === 0 ? (
                    <div className="empty-list">No active users found</div>
                  ) : (
                    filteredUsers.map((user) => {
                      const id = user.userId || user.id;
                      const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                      const isSelected = selectedUsers.includes(id);
                      return (
                        <div
                          key={id}
                          className={`user-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleUser(id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleUser(id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="user-info">
                            <span className="user-name">{displayName}</span>
                            <span className="user-id">{id}</span>
                          </div>
                          <Badge variant="secondary" size="small">
                            {user.policy || 'No Policy'}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* CSV Upload Section */
              <div className="bulk-csv-section">
                <div className="csv-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="csv-file-input-policy"
                  />
                  <div className="csv-drop-zone">
                    <FaFileAlt className="csv-icon" />
                    <p>Upload a CSV file with user IDs</p>
                    <div className="csv-buttons">
                      <Button
                        variant="primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FaUpload /> Choose File
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={downloadTemplate}
                      >
                        <FaDownload /> Download Template
                      </Button>
                    </div>
                    <p className="csv-hint">
                      CSV should have columns: userId (required), reason (optional)
                    </p>
                  </div>
                </div>

                {csvError && (
                  <div className="csv-error">
                    {csvError}
                  </div>
                )}

                {csvData.length > 0 && (
                  <div className="csv-preview">
                    <div className="csv-preview-header">
                      <span>{csvData.length} users loaded from CSV</span>
                      <Button variant="secondary" size="small" onClick={clearCsvData}>
                        Clear
                      </Button>
                    </div>
                    <div className="csv-user-list">
                      {csvData.slice(0, 10).map((user, idx) => (
                        <div key={idx} className="csv-user-item">
                          <span className="csv-user-id">{user.oduserId}</span>
                          {user.reason && <span className="csv-user-reason">{user.reason}</span>}
                        </div>
                      ))}
                      {csvData.length > 10 && (
                        <div className="csv-user-more">
                          ... and {csvData.length - 10} more users
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reason Input */}
            <div className="bulk-reason-section">
              <label htmlFor="reason">Reason (Optional)</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for policy change..."
                rows={2}
              />
            </div>
          </div>

          <div className="bulk-modal-footer">
            <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => setScheduleModalOpen(true)}
              disabled={selectedUsers.length === 0 || !newPolicyId || isProcessing}
            >
              <FaClock /> Schedule
            </Button>
            <Button
              variant="primary"
              onClick={handleExecuteNow}
              disabled={selectedUsers.length === 0 || !newPolicyId || isProcessing}
              loading={isProcessing}
            >
              <FaCheckCircle /> Change Policy Now
            </Button>
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleSchedule}
        operationType="Bulk Policy Change"
        targetSummary={`${selectedUsers.length} users to ${selectedPolicy?.label || 'new policy'}`}
        title="Schedule Bulk Policy Change"
      />
    </>
  );
};

export default BulkPolicyChange;
