// src/pages/Internal/BulkOperations/BulkOperations.js

import React, { useState } from 'react';
import {
  FaTasks,
  FaUsers,
  FaWifi,
  FaClock,
  FaUserPlus,
  FaUserCheck,
  FaUserSlash,
  FaBan,
  FaExchangeAlt,
  FaKey,
  FaEdit,
  FaFileUpload,
} from 'react-icons/fa';
import BulkOperationCard from '@components/BulkOperationCard/BulkOperationCard';
import ScheduledTasksPanel from './ScheduledTasksPanel';
import ScheduleModal from '@components/ScheduleModal/ScheduleModal';
import BulkUserRegistration from './BulkUserRegistration';
import BulkDeviceRegistration from './BulkDeviceRegistration';
import BulkStatusChange from './BulkStatusChange';
import BulkPolicyChange from './BulkPolicyChange';
import BulkDeviceRename from './BulkDeviceRename';
import BulkResendPassword from './BulkResendPassword';
import { usePermissions } from '@hooks/usePermissions';
import './BulkOperations.css';

/**
 * Bulk Operations Page
 * Super Admin only - provides bulk user/device management capabilities
 */
const BulkOperations = () => {
  const [activeTab, setActiveTab] = useState('users');
  const permissions = usePermissions();

  // Modal states
  const [bulkUserRegModalOpen, setBulkUserRegModalOpen] = useState(false);
  const [bulkDeviceRegModalOpen, setBulkDeviceRegModalOpen] = useState(false);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [bulkStatusType, setBulkStatusType] = useState('activate'); // 'activate' | 'suspend' | 'block'
  const [bulkPolicyModalOpen, setBulkPolicyModalOpen] = useState(false);
  const [bulkDeviceRenameModalOpen, setBulkDeviceRenameModalOpen] = useState(false);
  const [bulkResendPasswordModalOpen, setBulkResendPasswordModalOpen] = useState(false);

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleContext, setScheduleContext] = useState(null);

  // Handle schedule click for bulk operations
  const handleScheduleClick = (operationType, operationLabel) => {
    setScheduleContext({
      type: operationType,
      label: operationLabel,
      targetSummary: 'Configure in operation modal',
    });
    setScheduleModalOpen(true);
  };

  // Handle schedule confirm
  const handleScheduleConfirm = (scheduledDateTime) => {
    console.log('Scheduled for:', scheduledDateTime, 'Context:', scheduleContext);
    // This would integrate with the actual bulk operation flow
    setScheduleModalOpen(false);
    setScheduleContext(null);
  };

  // Handle bulk status change
  const openBulkStatusModal = (type) => {
    setBulkStatusType(type);
    setBulkStatusModalOpen(true);
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'devices', label: 'Devices', icon: FaWifi },
    { id: 'scheduled', label: 'Scheduled Tasks', icon: FaClock },
  ];

  // User operations configuration
  const userOperations = [
    {
      id: 'bulk-user-registration',
      icon: FaUserPlus,
      title: 'Bulk User Registration',
      description: 'Register multiple users at once using CSV upload.',
      buttonText: 'Upload CSV',
      variant: 'primary',
      onClick: () => setBulkUserRegModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRegisterUsers',
    },
    {
      id: 'bulk-activation',
      icon: FaUserCheck,
      title: 'Bulk User Activation',
      description: 'Activate multiple user accounts simultaneously.',
      buttonText: 'Select Users',
      variant: 'success',
      onClick: () => openBulkStatusModal('activate'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_activation', 'Bulk User Activation'),
      permission: 'canBulkActivateUsers',
    },
    {
      id: 'bulk-suspension',
      icon: FaUserSlash,
      title: 'Bulk User Suspension',
      description: 'Suspend multiple user accounts at once.',
      buttonText: 'Select Users',
      variant: 'warning',
      onClick: () => openBulkStatusModal('suspend'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_suspension', 'Bulk User Suspension'),
      permission: 'canBulkSuspendUsers',
    },
    {
      id: 'bulk-blocking',
      icon: FaBan,
      title: 'Bulk User Blocking',
      description: 'Block multiple user accounts permanently.',
      buttonText: 'Select Users',
      variant: 'danger',
      onClick: () => openBulkStatusModal('block'),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_blocking', 'Bulk User Blocking'),
      permission: 'canBulkBlockUsers',
    },
    {
      id: 'bulk-policy-change',
      icon: FaExchangeAlt,
      title: 'Bulk Policy Change',
      description: 'Change policies for multiple users at once.',
      buttonText: 'Select Users',
      variant: 'info',
      onClick: () => setBulkPolicyModalOpen(true),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_policy_change', 'Bulk Policy Change'),
      permission: 'canBulkChangePolicies',
    },
    {
      id: 'bulk-resend-password',
      icon: FaKey,
      title: 'Bulk Resend Password',
      description: 'Resend password emails to multiple users.',
      buttonText: 'Select Users',
      variant: 'primary',
      onClick: () => setBulkResendPasswordModalOpen(true),
      supportsSchedule: true,
      onScheduleClick: () => handleScheduleClick('bulk_resend_password', 'Bulk Resend Password'),
      permission: 'canBulkResendPasswords',
    },
  ];

  // Device operations configuration
  const deviceOperations = [
    {
      id: 'bulk-device-registration',
      icon: FaFileUpload,
      title: 'Bulk Device Registration',
      description: 'Register multiple devices using CSV upload.',
      buttonText: 'Upload CSV',
      variant: 'primary',
      onClick: () => setBulkDeviceRegModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRegisterDevices',
    },
    {
      id: 'bulk-device-rename',
      icon: FaEdit,
      title: 'Bulk Device Rename',
      description: 'Rename multiple devices using naming patterns.',
      buttonText: 'Select Devices',
      variant: 'info',
      onClick: () => setBulkDeviceRenameModalOpen(true),
      supportsSchedule: false,
      permission: 'canBulkRenameDevices',
    },
  ];

  const renderOperationCards = (operations) => {
    return operations.map((op) => {
      const hasPermission = permissions[op.permission] === true;
      return (
        <BulkOperationCard
          key={op.id}
          icon={op.icon}
          title={op.title}
          description={op.description}
          buttonText={op.buttonText}
          variant={op.variant}
          onClick={op.onClick}
          supportsSchedule={op.supportsSchedule}
          onScheduleClick={op.onScheduleClick}
          disabled={!hasPermission}
          roleRequired={!hasPermission ? 'Super Admin Only' : null}
        />
      );
    });
  };

  return (
    <div className="bulk-operations-page">
      {/* Page Header */}
      <div className="bulk-ops-header">
        <div className="bulk-ops-header-content">
          <div className="bulk-ops-title-section">
            <FaTasks className="bulk-ops-icon" />
            <div>
              <h1 className="bulk-ops-title">Bulk Operations</h1>
              <p className="bulk-ops-subtitle">
                Perform batch actions on users and devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bulk-ops-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bulk-ops-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="bulk-ops-tab-icon" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bulk-ops-content">
        {activeTab === 'users' && (
          <div className="bulk-ops-section">
            <h2 className="bulk-ops-section-title">User Operations</h2>
            <p className="bulk-ops-section-desc">
              Manage multiple users at once with bulk operations
            </p>
            <div className="bulk-ops-grid">
              {renderOperationCards(userOperations)}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="bulk-ops-section">
            <h2 className="bulk-ops-section-title">Device Operations</h2>
            <p className="bulk-ops-section-desc">
              Manage multiple devices at once with bulk operations
            </p>
            <div className="bulk-ops-grid">
              {renderOperationCards(deviceOperations)}
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <ScheduledTasksPanel />
        )}
      </div>

      {/* Modals */}
      <BulkUserRegistration
        isOpen={bulkUserRegModalOpen}
        onClose={() => setBulkUserRegModalOpen(false)}
      />

      <BulkDeviceRegistration
        isOpen={bulkDeviceRegModalOpen}
        onClose={() => setBulkDeviceRegModalOpen(false)}
      />

      <BulkStatusChange
        isOpen={bulkStatusModalOpen}
        onClose={() => setBulkStatusModalOpen(false)}
        statusType={bulkStatusType}
      />

      <BulkPolicyChange
        isOpen={bulkPolicyModalOpen}
        onClose={() => setBulkPolicyModalOpen(false)}
      />

      <BulkDeviceRename
        isOpen={bulkDeviceRenameModalOpen}
        onClose={() => setBulkDeviceRenameModalOpen(false)}
      />

      <BulkResendPassword
        isOpen={bulkResendPasswordModalOpen}
        onClose={() => setBulkResendPasswordModalOpen(false)}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setScheduleContext(null);
        }}
        onSchedule={handleScheduleConfirm}
        operationType={scheduleContext?.label || 'Operation'}
        targetSummary={scheduleContext?.targetSummary || ''}
        title="Schedule Bulk Operation"
      />
    </div>
  );
};

export default BulkOperations;
