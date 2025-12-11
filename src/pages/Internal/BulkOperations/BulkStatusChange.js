// src/pages/Internal/BulkOperations/BulkStatusChange.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTimes,
  FaUserCheck,
  FaUserSlash,
  FaBan,
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
 * BulkStatusChange - Modal for bulk user status changes (activate/suspend/block)
 */
const BulkStatusChange = ({ isOpen, onClose, statusType = 'activate' }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { addScheduledTask } = useScheduledTasks();

  const config = useMemo(() => {
    switch (statusType) {
      case 'activate':
        return {
          title: 'Bulk User Activation',
          icon: FaUserCheck,
          variant: 'success',
          buttonText: 'Activate',
          taskType: ScheduledTaskTypes.BULK_ACTIVATION,
          filterStatus: ['suspended', 'pending'],
        };
      case 'suspend':
        return {
          title: 'Bulk User Suspension',
          icon: FaUserSlash,
          variant: 'warning',
          buttonText: 'Suspend',
          taskType: ScheduledTaskTypes.BULK_SUSPENSION,
          filterStatus: ['active'],
        };
      case 'block':
        return {
          title: 'Bulk User Blocking',
          icon: FaBan,
          variant: 'danger',
          buttonText: 'Block',
          taskType: ScheduledTaskTypes.BULK_BLOCKING,
          filterStatus: ['active', 'suspended'],
        };
      default:
        return {
          title: 'Bulk Status Change',
          icon: FaUserCheck,
          variant: 'primary',
          buttonText: 'Change',
          taskType: ScheduledTaskTypes.BULK_ACTIVATION,
          filterStatus: [],
        };
    }
  }, [statusType]);

  // Filter users that can have their status changed
  const eligibleUsers = useMemo(() => {
    return userSampleData.filter((user) =>
      config.filterStatus.length === 0 ||
      config.filterStatus.includes(user.status?.toLowerCase())
    );
  }, [config.filterStatus]);

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
    if (selectedUsers.length === 0) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`${statusType} users:`, selectedUsers, 'Reason:', reason);
      onClose();
    } catch (err) {
      console.error('Operation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSchedule = (scheduledDateTime) => {
    addScheduledTask({
      type: config.taskType,
      targetType: 'users',
      targetIds: selectedUsers,
      targetCount: selectedUsers.length,
      scheduledFor: scheduledDateTime.toISOString(),
      parameters: { reason },
    });
    setScheduleModalOpen(false);
    onClose();
  };

  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <>
      <div className="bulk-modal-overlay" onClick={onClose}>
        <div
          className="bulk-modal-content bulk-modal-content--wide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`bulk-modal-header bulk-modal-header--${config.variant}`}>
            <h2 className="bulk-modal-title">
              <IconComponent /> {config.title}
            </h2>
            <button className="bulk-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="bulk-modal-body">
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
                <div className="empty-list">
                  No eligible users found for this operation
                </div>
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
                    <Badge
                      variant={
                        user.status === 'active'
                          ? 'success'
                          : user.status === 'suspended'
                          ? 'warning'
                          : 'secondary'
                      }
                      size="small"
                    >
                      {user.status}
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
                placeholder={`Enter reason for ${statusType}...`}
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
              disabled={selectedUsers.length === 0 || isProcessing}
            >
              <FaClock /> Schedule
            </Button>
            <Button
              variant={config.variant}
              onClick={handleExecuteNow}
              disabled={selectedUsers.length === 0 || isProcessing}
              loading={isProcessing}
            >
              <FaCheckCircle /> {config.buttonText} Now
            </Button>
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleSchedule}
        operationType={config.title}
        targetSummary={`${selectedUsers.length} users selected`}
        title={`Schedule ${config.title}`}
      />
    </>
  );
};

export default BulkStatusChange;
