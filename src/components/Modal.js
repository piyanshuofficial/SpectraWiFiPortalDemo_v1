// src/components/Modal.js

import React, { useEffect, useRef } from 'react';
import '@components/Modal.css';

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

export default Modal;