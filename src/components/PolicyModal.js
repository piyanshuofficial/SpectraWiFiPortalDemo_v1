// src/components/PolicyModal.js

import React from "react";
import "./Modal.css";

const PolicyModal = ({ open, title, children, onClose, bgImage }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} tabIndex={-1} aria-modal="true" role="dialog">
      <div
        className="modal-container"
        style={{
          background: bgImage
            ? `#181818 url(${bgImage}) no-repeat right top`
            : "#181818",
          backgroundSize: "cover"
        }}
        onClick={e => e.stopPropagation()}
      >
<div className="modal-header" style={{ position: "relative", color: "#fff", padding: "2rem 2rem 1rem 2rem" }}>
  <h2 style={{ margin: 0 }}>{title}</h2>
  <button
    className="btn-close"
    onClick={onClose}
    aria-label="Close modal"
    style={{
      position: "absolute",
      top: "20px",
      right: "24px",
      fontSize: "2rem",
      color: "#fff",
      background: "none",
      border: "none",
      cursor: "pointer",
      zIndex: 2
    }}
  >
    ×
  </button>
</div>

        <div className="modal-content" style={{
          padding: "2rem",
          background: "#fff",
          color: "#181818",
          borderRadius: "0 0 8px 8px",
          maxHeight: "60vh",
          overflowY: "auto"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
