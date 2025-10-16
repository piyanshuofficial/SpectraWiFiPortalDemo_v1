// src/pages/UserManagement/UserDetailsModal.js

import React from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import "./UserDetailsModal.css";
import { FaTachometerAlt, FaDatabase, FaTabletAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  resendPassword,
  editUser,
  suspendUser,
  blockUser,
  activateUser,
  closeModal,
} from "../../utils/userActions";

const getUsageStats = (user) => [
  {
    label: "Total Data",
    value: user.usageTotalData,
    color: "#2236ae",
  },
  {
    label: "Sessions",
    value: user.usageSessions,
    color: "#27b006",
  },
  {
    label: "Avg Session",
    value: user.usageAvgSession,
    color: "#f2b40c",
  },
  {
    label: "Last Online",
    value: user.usageLastOnline,
    color: "#7a45ae",
  },
];

const UserDetailsModal = ({
  user,
  onClose = closeModal,
  onEdit = editUser,
  onSendMessage = resendPassword,
  onSuspend = suspendUser,
  onBlock = blockUser,
  onActivate = activateUser,
}) => {
  const isActive = user.status === "Active";
  const isSuspended = user.status === "Suspended";

  const usageStats = getUsageStats(user);
  const userPolicy = user.policy || user.userPolicy;

  const renderPolicyDetails = (policy) => {
    if (!policy || typeof policy === "string") return <span className="udm-value">{policy || "--"}</span>;
    const { speed, dataVolume, deviceLimit } = policy;
    return (
      <div className="policy-detail-stack">
        <div className="policy-row">
          <span className="policy-icon speed"><FaTachometerAlt /></span>
          <span className="policy-pill speed">{speed || "--"}</span>
        </div>
        <div className="policy-row">
          <span className="policy-icon data"><FaDatabase /></span>
          <span className="policy-pill data">{dataVolume || "--"}</span>
        </div>
        <div className="policy-row">
          <span className="policy-icon device"><FaTabletAlt /></span>
          <span className="policy-pill device">
            {deviceLimit
              ? `${deviceLimit} Device${Number(deviceLimit) > 1 ? "s" : ""}`
              : "--"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal onClose={onClose}>
      <div className="udm-modal-root">
        <div className="udm-header-row">
          <div className="udm-heading">User Details</div>
          <button className="udm-close-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="udm-main-grid">
          <div className="udm-section">
            <div className="udm-section-title">Personal Information</div>
            <div className="udm-item">
              <span className="udm-label">Name:</span>
              <span className="udm-value">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="udm-item">
              <span className="udm-label">Email:</span>
              <span className="udm-value">{user.email || "--"}</span>
            </div>
            <div className="udm-item">
              <span className="udm-label">Mobile:</span>
              <span className="udm-value">{user.mobile || "--"}</span>
            </div>
            {user.location && (
              <div className="udm-item">
                <span className="udm-label">Location:</span>
                <span className="udm-value">{user.location}</span>
              </div>
            )}
          </div>
          <div className="udm-section">
            <div className="udm-section-title">Account Details</div>
            <div className="udm-item">
              <span className="udm-label">User ID:</span>
              <span className="udm-value udm-bold">{user.id}</span>
            </div>
            <div className="udm-item">
              <span className="udm-label">Policy:</span>
              {renderPolicyDetails(userPolicy)}
            </div>
            <div className="udm-item">
              <span className="udm-label">Status:</span>
              {user.status ? (
                <Badge variant={user.status.toLowerCase()} size="table">
                  {user.status}
                </Badge>
              ) : (
                <span className="udm-value">--</span>
              )}
            </div>
            <div className="udm-item">
              <span className="udm-label">Devices:</span>
              <span className="udm-value">{user.devices ?? "--"}</span>
            </div>
          </div>
        </div>
        <div className="udm-section-title udm-usage-title">
          Usage Statistics
        </div>
        <div className="udm-stats-bar fit-row">
          {usageStats.map((card) => (
            <div className="udm-stats-card" key={card.label} data-color={card.color}>
              <span className="udm-stats-number" style={{ color: card.color }}>
                {card.value}
              </span>
              <span className="udm-stats-label">{card.label}</span>
            </div>
          ))}
        </div>
        <div className="udm-actions-row">
          <Button variant="primary" onClick={() => onEdit(user)}>
            Edit User
          </Button>
          {onSendMessage && (
            <Button
              variant="secondary"
              className="resend-password-btn"
              onClick={() => onSendMessage(user)}
            >
              Resend Password
            </Button>
          )}
          {isActive && (
            <Button
              variant="warning"
              className="suspend-user-btn"
              onClick={() => onSuspend(user)}
            >
              Suspend User
            </Button>
          )}
          {isSuspended && (
            <Button variant="success" onClick={() => onActivate(user)}>
              Activate User
            </Button>
          )}
          {(isActive || isSuspended) && (
            <Button variant="danger" onClick={() => onBlock(user)}>
              Block User
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;