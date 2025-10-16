// src/components/Modal.js

import React from 'react';
import './Modal.css';

const Modal = ({ children, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div
      className="modal-container"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  </div>
);

export default Modal;
