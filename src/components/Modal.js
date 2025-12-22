/**
 * ============================================================================
 * Modal Component
 * ============================================================================
 *
 * @file src/components/Modal.js
 * @description Base modal/dialog component that provides the foundation for
 *              all popup dialogs in the portal. Handles backdrop, focus
 *              management, and keyboard interactions (Escape to close).
 *
 * @usage
 * ```jsx
 * // Basic modal with custom content
 * {showModal && (
 *   <Modal onClose={() => setShowModal(false)}>
 *     <div className="modal-header">
 *       <h2>Modal Title</h2>
 *       <button onClick={onClose}>&times;</button>
 *     </div>
 *     <div className="modal-body">
 *       Modal content here...
 *     </div>
 *     <div className="modal-footer">
 *       <Button onClick={onClose}>Cancel</Button>
 *       <Button variant="primary">Confirm</Button>
 *     </div>
 *   </Modal>
 * )}
 * ```
 *
 * @features
 * - Semi-transparent backdrop overlay
 * - Click outside to close (backdrop click)
 * - Escape key to close
 * - Focus trap - modal receives focus on open
 * - Prevents scroll propagation to body
 * - Accessible dialog role and aria attributes
 *
 * @behavior
 * - Clicking backdrop (outside modal) triggers onClose
 * - Clicking inside modal content does NOT close (stopPropagation)
 * - ESC key press triggers onClose
 * - Modal receives focus automatically on mount
 *
 * @dependencies
 * - Modal.css : Styles for backdrop, container, animations
 *
 * @extendedBy
 * - ConfirmationModal : Yes/No confirmation dialogs
 * - UserFormModal     : User creation/edit form
 * - DeviceFormModal   : Device registration form
 * - BulkImportModal   : CSV import dialog
 *
 * @accessibility
 * - role="dialog" for screen readers
 * - aria-modal="true" indicates modal nature
 * - tabIndex={-1} allows programmatic focus
 *
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '@components/Modal.css';

/**
 * Modal - Base dialog component for popup interactions
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Modal content (header, body, footer)
 * @param {Function} props.onClose - Callback when modal should close
 * @returns {JSX.Element} Rendered modal with backdrop
 */
const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Focus trap: focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Handle Escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  /** Content to be rendered inside the modal */
  children: PropTypes.node.isRequired,
  /** Function called when modal should close (backdrop click or Escape key) */
  onClose: PropTypes.func.isRequired,
};

export default Modal;