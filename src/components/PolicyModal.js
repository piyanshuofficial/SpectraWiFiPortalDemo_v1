// src/components/PolicyModal.js

import React, { useEffect, useRef } from "react";
import "@components/Modal.css";

const PolicyModal = ({ open, title, children, onClose, bgImage }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // ========================================
  // TODO: Backend Integration - Policy Modal Content Loading
  // ========================================
  // PolicyModal is used to display policy details and documentation
  // Current: Static content passed via children prop
  // 
  // For production, implement dynamic content loading:
  // 
  // useEffect(() => {
  //   if (open && policyId) {
  //     const fetchPolicyDetails = async () => {
  //       try {
  //         const response = await fetch(`/api/policies/${policyId}/details`);
  //         const result = await response.json();
  //         
  //         if (result.success) {
  //           setPolicyData(result.data.policy);
  //           // Policy data includes:
  //           // - Speed limits
  //           // - Data volume allocations
  //           // - Device limits
  //           // - FUP details
  //           // - Terms and conditions
  //           // - Segment-specific restrictions
  //         }
  //       } catch (error) {
  //         console.error('Failed to load policy details:', error);
  //       }
  //     };
  //     
  //     fetchPolicyDetails();
  //   }
  // }, [open, policyId]);
  // 
  // Backend Endpoint: GET /api/policies/{policyId}/details
  // 
  // Response Format:
  // {
  //   success: true,
  //   data: {
  //     policy: {
  //       id: string,
  //       name: string,
  //       description: string,
  //       speed: string,
  //       dataVolume: string,
  //       deviceLimit: number,
  //       dataCycleType: string,
  //       fupEnabled: boolean,
  //       fupThreshold: string,
  //       fupSpeed: string,
  //       allowedSegments: string[],
  //       terms: string,
  //       effectiveDate: ISO8601,
  //       expiryDate: ISO8601 | null
  //     }
  //   }
  // }
  // 
  // Use Cases:
  // - Display policy comparison
  // - Show policy change impact
  // - Help admins choose appropriate policy
  // - Display user's current policy details
  // ========================================

  if (!open) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-container"
        style={{
          background: bgImage
            ? `#181818 url(${bgImage}) no-repeat right top`
            : "#181818",
          backgroundSize: "cover"
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        tabIndex={-1}
      >
        <div className="modal-header" style={{ position: "relative", color: "#fff", padding: "2rem 2rem 1rem 2rem" }}>
          <h2 id="policy-modal-title" style={{ margin: 0 }}>{title}</h2>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label={`Close ${title} dialog`}
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

        <div 
          className="modal-content" 
          role="document"
          style={{
            padding: "2rem",
            background: "#fff",
            color: "#181818",
            borderRadius: "0 0 8px 8px",
            maxHeight: "60vh",
            overflowY: "auto"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;