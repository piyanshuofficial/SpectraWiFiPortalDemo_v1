// src/components/ScheduleModal/ScheduleModal.js

import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import Button from '../Button';
import './ScheduleModal.css';

/**
 * ScheduleModal - Reusable modal for scheduling one-time future execution
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal closes
 * @param {function} props.onSchedule - Function to call with scheduled datetime
 * @param {string} props.operationType - Type of operation being scheduled
 * @param {string} props.targetSummary - Summary of targets (e.g., "25 users selected")
 * @param {Date} props.minDate - Minimum allowed date (default: now)
 * @param {string} props.title - Custom title for the modal
 * @param {boolean} props.isLoading - Loading state for schedule button
 */
const ScheduleModal = ({
  isOpen,
  onClose,
  onSchedule,
  operationType = 'Operation',
  targetSummary = '',
  minDate = null,
  title = 'Schedule Operation',
  isLoading = false,
}) => {
  // Initialize with tomorrow's date at 10:00 AM
  const getDefaultDate = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const [scheduledDate, setScheduledDate] = useState(getDefaultDate());
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setScheduledDate(getDefaultDate());
      setScheduledTime('10:00');
      setErrors({});
    }
  }, [isOpen, getDefaultDate]);

  // Get minimum date string for date input
  const getMinDateString = () => {
    if (minDate) {
      return minDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!scheduledDate) {
      newErrors.date = 'Please select a date';
    }

    if (!scheduledTime) {
      newErrors.time = 'Please select a time';
    }

    // Check if scheduled datetime is in the past
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const now = new Date();
      if (scheduledDateTime <= now) {
        newErrors.datetime = 'Scheduled time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle schedule button click
  const handleSchedule = () => {
    if (!validate()) return;

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    onSchedule(scheduledDateTime);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get formatted datetime preview
  const getDateTimePreview = () => {
    if (!scheduledDate || !scheduledTime) return '';
    try {
      const dt = new Date(`${scheduledDate}T${scheduledTime}`);
      return dt.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  // Generate time options (15-minute intervals)
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const time24 = `${hour}:${minute}`;
      const displayHour = h % 12 || 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const displayTime = `${displayHour}:${minute.padStart(2, '0')} ${ampm}`;
      timeOptions.push({ value: time24, label: displayTime });
    }
  }

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div
        className="schedule-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
      >
        {/* Header */}
        <div className="schedule-modal-header">
          <h2 id="schedule-modal-title" className="schedule-modal-title">
            <FaClock className="schedule-modal-title-icon" />
            {title}
          </h2>
          <button
            className="schedule-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="schedule-modal-body">
          {/* Operation Info */}
          <div className="schedule-operation-info">
            <div className="schedule-operation-row">
              <span className="schedule-operation-label">Operation:</span>
              <span className="schedule-operation-value">{operationType}</span>
            </div>
            {targetSummary && (
              <div className="schedule-operation-row">
                <span className="schedule-operation-label">Target:</span>
                <span className="schedule-operation-value">{targetSummary}</span>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="schedule-form-group">
            <label htmlFor="schedule-date" className="schedule-form-label">
              <FaCalendarAlt className="schedule-form-icon" />
              Schedule Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="schedule-date"
              className={`schedule-form-input ${errors.date ? 'error' : ''}`}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={getMinDateString()}
            />
            {errors.date && <span className="schedule-error">{errors.date}</span>}
          </div>

          {/* Time Picker */}
          <div className="schedule-form-group">
            <label htmlFor="schedule-time" className="schedule-form-label">
              <FaClock className="schedule-form-icon" />
              Schedule Time <span className="required">*</span>
            </label>
            <select
              id="schedule-time"
              className={`schedule-form-input schedule-form-select ${errors.time ? 'error' : ''}`}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.time && <span className="schedule-error">{errors.time}</span>}
          </div>

          {/* Datetime Error */}
          {errors.datetime && (
            <div className="schedule-error-banner">
              <FaInfoCircle />
              {errors.datetime}
            </div>
          )}

          {/* Preview */}
          {scheduledDate && scheduledTime && !errors.datetime && (
            <div className="schedule-preview">
              <span className="schedule-preview-label">Scheduled for:</span>
              <span className="schedule-preview-value">{getDateTimePreview()}</span>
            </div>
          )}

          {/* Timezone Info */}
          <div className="schedule-timezone-info">
            <FaInfoCircle className="schedule-timezone-icon" />
            <span>
              Timezone: IST (UTC+5:30). Action will execute once at the scheduled time.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="schedule-modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSchedule}
            loading={isLoading}
            disabled={isLoading}
          >
            Schedule Action
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
