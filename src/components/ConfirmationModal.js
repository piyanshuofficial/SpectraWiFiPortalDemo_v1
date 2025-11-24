// src/components/ConfirmationModal.js

import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import './ConfirmationModal.css';

/**
 * Reusable confirmation modal component
 *
 * @param {boolean} open - Whether the modal is open
 * @param {function} onClose - Callback when modal is closed/cancelled
 * @param {function} onConfirm - Callback when action is confirmed
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Button variant for confirm button (default: "danger")
 * @param {boolean} loading - Whether confirm button is in loading state
 */
const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false
}) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  const modal = (
    <div
      className="confirmation-modal-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <h2 id="confirmation-modal-title" className="confirmation-modal-title">
            {title}
          </h2>
        </div>

        <div className="confirmation-modal-body">
          <p className="confirmation-modal-message">{message}</p>
        </div>

        <div className="confirmation-modal-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            aria-label={cancelText}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            aria-label={confirmText}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default ConfirmationModal;
