// src/pages/Internal/BulkOperations/BulkResendPassword.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTimes,
  FaKey,
  FaSearch,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import Button from '@components/Button';
import Badge from '@components/Badge';
import ScheduleModal from '@components/ScheduleModal/ScheduleModal';
import { useScheduledTasks, ScheduledTaskTypes } from '@hooks/useScheduledTasks';
import { sampleUsers as userSampleData } from '@constants/userSampleData';
import './BulkOperationModals.css';

/**
 * BulkResendPassword - Modal for bulk resending password emails
 */
const BulkResendPassword = ({ isOpen, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { addScheduledTask } = useScheduledTasks();

  // Filter users with email
  const eligibleUsers = useMemo(() => {
    return userSampleData.filter((user) => user.email);
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
    if (selectedUsers.length === 0) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Resending password to users:', selectedUsers);
      onClose();
    } catch (err) {
      console.error('Operation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSchedule = (scheduledDateTime) => {
    addScheduledTask({
      type: ScheduledTaskTypes.BULK_RESEND_PASSWORD,
      targetType: 'users',
      targetIds: selectedUsers,
      targetCount: selectedUsers.length,
      scheduledFor: scheduledDateTime.toISOString(),
      parameters: {},
    });
    setScheduleModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bulk-modal-overlay" onClick={onClose}>
        <div
          className="bulk-modal-content bulk-modal-content--wide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bulk-modal-header bulk-modal-header--primary">
            <h2 className="bulk-modal-title">
              <FaKey /> Bulk Resend Password
            </h2>
            <button className="bulk-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="bulk-modal-body">
            {/* Info Banner */}
            <div className="bulk-info-banner">
              <FaKey />
              <span>
                Selected users will receive a password reset email. This action
                cannot be undone.
              </span>
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
                <div className="empty-list">No users found</div>
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
                      <span className="user-email">{user.email}</span>
                    </div>
                    <Badge
                      variant={user.status === 'active' ? 'success' : 'secondary'}
                      size="small"
                    >
                      {user.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bulk-modal-footer">
            <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => setScheduleModalOpen(true)}
              disabled={selectedUsers.length === 0 || isProcessing}
            >
              <FaClock /> Schedule
            </Button>
            <Button
              variant="primary"
              onClick={handleExecuteNow}
              disabled={selectedUsers.length === 0 || isProcessing}
              loading={isProcessing}
            >
              <FaCheckCircle /> Send Now
            </Button>
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleSchedule}
        operationType="Bulk Resend Password"
        targetSummary={`${selectedUsers.length} users selected`}
        title="Schedule Bulk Resend Password"
      />
    </>
  );
};

export default BulkResendPassword;
