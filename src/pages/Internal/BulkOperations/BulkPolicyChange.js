// src/pages/Internal/BulkOperations/BulkPolicyChange.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTimes,
  FaExchangeAlt,
  FaSearch,
  FaClock,
  FaCheckCircle,
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
  const { addScheduledTask } = useScheduledTasks();

  // Filter active users
  const eligibleUsers = useMemo(() => {
    return userSampleData.filter((user) => user.status === 'active');
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return eligibleUsers;
    const term = searchTerm.toLowerCase();
    return eligibleUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.userId?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    );
  }, [eligibleUsers, searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearchTerm('');
      setNewPolicyId('');
      setReason('');
    }
  }, [isOpen]);

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
      setSelectedUsers(filteredUsers.map((u) => u.userId));
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
                  {selectedUsers.length === filteredUsers.length
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
                filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className={`user-item ${
                      selectedUsers.includes(user.userId) ? 'selected' : ''
                    }`}
                    onClick={() => toggleUser(user.userId)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.userId)}
                      onChange={() => toggleUser(user.userId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-id">{user.userId}</span>
                    </div>
                    <Badge variant="secondary" size="small">
                      {user.policy || 'No Policy'}
                    </Badge>
                  </div>
                ))
              )}
            </div>

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
