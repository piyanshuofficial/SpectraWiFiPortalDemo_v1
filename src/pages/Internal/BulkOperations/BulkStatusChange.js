// src/pages/Internal/BulkOperations/BulkStatusChange.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FaTimes,
  FaUserCheck,
  FaUserSlash,
  FaBan,
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
  const [inputMode, setInputMode] = useState('list'); // 'list' or 'csv'
  const [csvData, setCsvData] = useState([]);
  const [csvError, setCsvError] = useState('');
  const fileInputRef = useRef(null);
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
    if (!userSampleData || !Array.isArray(userSampleData)) {
      return [];
    }
    return userSampleData.filter((user) => {
      if (config.filterStatus.length === 0) return true;
      const userStatus = user.status?.toLowerCase();
      return config.filterStatus.includes(userStatus);
    });
  }, [config.filterStatus]);

  // Filter users based on search
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
          const userId = values[userIdIndex];
          if (userId) {
            parsedUsers.push({
              userId,
              reason: values[headers.indexOf('reason')] || ''
            });
          }
        }

        if (parsedUsers.length === 0) {
          setCsvError('No valid user IDs found in CSV');
          return;
        }

        setCsvData(parsedUsers);
        setSelectedUsers(parsedUsers.map(u => u.userId));
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
    const csvContent = 'userId,reason\nUSER001,Example reason\nUSER002,Another reason';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_${statusType}_template.csv`;
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
                    <div className="empty-list">
                      No eligible users found for this operation
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const id = user.userId || user.id;
                      const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                      const isSelected = selectedUsers.includes(id);
                      const statusLower = user.status?.toLowerCase();
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
                          <Badge
                            variant={
                              statusLower === 'active'
                                ? 'success'
                                : statusLower === 'suspended'
                                ? 'warning'
                                : 'secondary'
                            }
                            size="small"
                          >
                            {user.status}
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
                    id="csv-file-input"
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
                          <span className="csv-user-id">{user.userId}</span>
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
