// src/components/BulkOperationCard/BulkOperationCard.js

import React from 'react';
import { FaClock, FaLock } from 'react-icons/fa';
import Button from '../Button';
import Badge from '../Badge';
import './BulkOperationCard.css';

/**
 * BulkOperationCard - Card component for displaying bulk operation options
 *
 * @param {Object} props
 * @param {React.ElementType} props.icon - Icon component to display
 * @param {string} props.title - Title of the operation
 * @param {string} props.description - Description of what the operation does
 * @param {function} props.onClick - Function to call when action button is clicked
 * @param {string} props.buttonText - Text for the action button
 * @param {string} props.variant - Color variant: 'primary', 'success', 'warning', 'danger'
 * @param {boolean} props.supportsSchedule - Whether this operation supports scheduling
 * @param {function} props.onScheduleClick - Function to call when schedule is clicked
 * @param {boolean} props.disabled - Whether the card actions are disabled
 * @param {string} props.roleRequired - Role badge to display (e.g., "Super Admin Only")
 * @param {boolean} props.isLoading - Loading state for the action button
 */
const BulkOperationCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  buttonText = 'Start',
  variant = 'primary',
  supportsSchedule = false,
  onScheduleClick,
  disabled = false,
  roleRequired = null,
  isLoading = false,
}) => {
  const getVariantClass = () => {
    const variants = {
      primary: 'bulk-op-card--primary',
      success: 'bulk-op-card--success',
      warning: 'bulk-op-card--warning',
      danger: 'bulk-op-card--danger',
      info: 'bulk-op-card--info',
    };
    return variants[variant] || variants.primary;
  };

  const getButtonVariant = () => {
    const buttonVariants = {
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'secondary',
    };
    return buttonVariants[variant] || 'primary';
  };

  return (
    <div className={`bulk-op-card ${getVariantClass()} ${disabled ? 'bulk-op-card--disabled' : ''}`}>
      {/* Icon Header */}
      <div className="bulk-op-card-icon-wrapper">
        {Icon && <Icon className="bulk-op-card-icon" />}
      </div>

      {/* Content */}
      <div className="bulk-op-card-content">
        <h3 className="bulk-op-card-title">{title}</h3>
        <p className="bulk-op-card-description">{description}</p>

        {/* Role Badge */}
        {roleRequired && (
          <div className="bulk-op-card-role">
            <Badge variant="info" size="small">
              <FaLock style={{ marginRight: '0.25rem', fontSize: '0.65rem' }} />
              {roleRequired}
            </Badge>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bulk-op-card-actions">
        <Button
          variant={getButtonVariant()}
          onClick={onClick}
          disabled={disabled || isLoading}
          loading={isLoading}
          className="bulk-op-card-btn"
        >
          {buttonText}
        </Button>

        {supportsSchedule && (
          <Button
            variant="secondary"
            onClick={onScheduleClick}
            disabled={disabled || isLoading}
            className="bulk-op-card-schedule-btn"
            title="Schedule for later"
          >
            <FaClock />
            <span>Schedule</span>
          </Button>
        )}
      </div>

      {/* Disabled Overlay */}
      {disabled && (
        <div className="bulk-op-card-disabled-overlay">
          <FaLock className="bulk-op-card-lock-icon" />
          <span>Access Restricted</span>
        </div>
      )}
    </div>
  );
};

export default BulkOperationCard;
