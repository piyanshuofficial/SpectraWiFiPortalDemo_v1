// src/components/UserActionScheduleButton/UserActionScheduleButton.js

import React, { useState } from 'react';
import { FaClock, FaChevronDown } from 'react-icons/fa';
import Button from '../Button';
import ScheduleModal from '../ScheduleModal/ScheduleModal';
import {
  useScheduledTasks,
  ScheduledTaskTypes,
} from '../../hooks/useScheduledTasks';
import { usePermissions } from '../../hooks/usePermissions';
import './UserActionScheduleButton.css';

/**
 * UserActionScheduleButton - Wraps action buttons with optional scheduling
 *
 * For internal portal users with canScheduleUserActions permission,
 * shows a dropdown with "Execute Now" and "Schedule" options.
 *
 * @param {Object} props
 * @param {string} props.actionType - Type of action: 'activate', 'suspend', 'block', 'resendPassword', 'policyChange'
 * @param {Object} props.user - The user object the action will be performed on
 * @param {function} props.onExecute - Function to execute immediately
 * @param {string} props.buttonText - Text for the button
 * @param {string} props.variant - Button variant: 'primary', 'success', 'warning', 'danger'
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.title - Button title/tooltip
 * @param {Object} props.scheduleParams - Additional parameters for scheduled task
 */
const UserActionScheduleButton = ({
  actionType,
  user,
  onExecute,
  buttonText,
  variant = 'primary',
  disabled = false,
  title = '',
  scheduleParams = {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { canScheduleUserActions } = usePermissions();
  const { addScheduledTask } = useScheduledTasks();

  // Map action types to scheduled task types
  const getTaskType = () => {
    switch (actionType) {
      case 'activate':
        return ScheduledTaskTypes.SINGLE_ACTIVATION;
      case 'suspend':
        return ScheduledTaskTypes.SINGLE_SUSPENSION;
      case 'block':
        return ScheduledTaskTypes.SINGLE_BLOCKING;
      case 'resendPassword':
        return ScheduledTaskTypes.SINGLE_RESEND_PASSWORD;
      case 'policyChange':
        return ScheduledTaskTypes.SINGLE_POLICY_CHANGE;
      default:
        return ScheduledTaskTypes.SINGLE_ACTIVATION;
    }
  };

  // Get human-readable action name
  const getActionLabel = () => {
    switch (actionType) {
      case 'activate':
        return 'User Activation';
      case 'suspend':
        return 'User Suspension';
      case 'block':
        return 'User Blocking';
      case 'resendPassword':
        return 'Resend Password';
      case 'policyChange':
        return 'Policy Change';
      default:
        return 'User Action';
    }
  };

  const handleExecuteNow = () => {
    setShowDropdown(false);
    if (onExecute) {
      onExecute();
    }
  };

  const handleScheduleClick = () => {
    setShowDropdown(false);
    setScheduleModalOpen(true);
  };

  const handleScheduleConfirm = (scheduledDateTime) => {
    addScheduledTask({
      type: getTaskType(),
      targetType: 'user',
      targetIds: [user.id],
      targetCount: 1,
      scheduledFor: scheduledDateTime.toISOString(),
      parameters: {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        ...scheduleParams,
      },
    });
    setScheduleModalOpen(false);
  };

  // If user doesn't have scheduling permission, render simple button
  if (!canScheduleUserActions) {
    return (
      <Button
        variant={variant}
        onClick={onExecute}
        disabled={disabled}
        title={title}
      >
        {buttonText}
      </Button>
    );
  }

  // Render button with scheduling dropdown
  return (
    <>
      <div className="user-action-schedule-wrapper">
        <Button
          variant={variant}
          onClick={handleExecuteNow}
          disabled={disabled}
          title={title}
          className="user-action-main-btn"
        >
          {buttonText}
        </Button>
        <Button
          variant={variant}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled}
          className="user-action-dropdown-btn"
          aria-label="Schedule action"
        >
          <FaChevronDown />
        </Button>

        {showDropdown && (
          <>
            <div
              className="user-action-dropdown-backdrop"
              onClick={() => setShowDropdown(false)}
            />
            <div className="user-action-dropdown">
              <button
                className="user-action-dropdown-item"
                onClick={handleExecuteNow}
              >
                Execute Now
              </button>
              <button
                className="user-action-dropdown-item"
                onClick={handleScheduleClick}
              >
                <FaClock /> Schedule for Later
              </button>
            </div>
          </>
        )}
      </div>

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleScheduleConfirm}
        operationType={getActionLabel()}
        targetSummary={`${user.firstName} ${user.lastName} (${user.id})`}
        title={`Schedule ${getActionLabel()}`}
      />
    </>
  );
};

export default UserActionScheduleButton;
