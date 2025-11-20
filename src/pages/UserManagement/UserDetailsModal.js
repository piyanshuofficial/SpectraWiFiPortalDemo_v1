// src/pages/UserManagement/UserDetailsModal.js

import React from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import "./UserDetailsModal.css";
import { FaTachometerAlt, FaDatabase, FaTabletAlt } from "react-icons/fa";
import notifications from "../../utils/notifications";

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
  onClose,
  onEdit,
  onSendMessage,
  onSuspend,
  onBlock,
  onActivate,
}) => {
  // ========================================
  // TODO: Backend Integration - Fetch Full User Details on Modal Open
  // ========================================
  // When modal opens, fetch comprehensive user data from backend
  // 
  // Current Limitation:
  // - Modal receives user object from parent component
  // - May contain stale or incomplete data
  // - Real-time session status not available
  // 
  // Required Implementation:
  // useEffect(() => {
  //   const fetchFullUserDetails = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${user.id}/details`);
  //       const result = await response.json();
  //       
  //       if (result.success) {
  //         // Update user data with fresh information
  //         setUserData(result.data.user);
  //         setCurrentSession(result.data.currentSession);
  //         setDevices(result.data.devices);
  //         setUsageStats(result.data.usageStats);
  //         setRecentActivity(result.data.recentActivity);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user details:', error);
  //       // Continue with provided user data
  //     }
  //   };
  //   
  //   fetchFullUserDetails();
  // }, [user.id]);
  // 
  // Backend Endpoint: GET /api/users/{userId}/details
  // 
  // Response Format:
  // {
  //   success: true,
  //   data: {
  //     user: {
  //       ...allUserFields,
  //       // Include fields from userMemories context
  //       can_id: string,
  //       whp_alert: string,
  //       dataCycleResetDate: string,
  //       totalVolumeInMB: number,
  //       totalDataConsumed_nonFupInMB: number,
  //       totalDataConsumed_FupInMB: string,
  //       fupStatus: string
  //     },
  //     currentSession: {
  //       sessionId: string,
  //       startTime: ISO8601,
  //       dataUsed: number,
  //       currentAP: string,
  //       ipAddress: string,
  //       deviceMAC: string
  //     } | null,
  //     devices: [
  //       {
  //         id: string,
  //         name: string,
  //         mac: string,
  //         online: boolean,
  //         lastSeen: ISO8601
  //       }
  //     ],
  //     usageStats: {
  //       currentMonth: {
  //         totalData: string,
  //         sessions: number,
  //         avgSessionDuration: string,
  //         lastOnline: string
  //       },
  //       quotaUsage: {
  //         used: number,
  //         total: number,
  //         percentage: number
  //       }
  //     },
  //     recentActivity: [
  //       {
  //         timestamp: ISO8601,
  //         action: string,
  //         details: string
  //       }
  //     ],
  //     scheduledActions: [
  //       {
  //         type: 'deactivation' | 'policy_change',
  //         scheduledFor: ISO8601,
  //         details: string
  //       }
  //     ]
  //   }
  // }
  // 
  // Additional Considerations:
  // - Show loading state while fetching
  // - Display skeleton loaders for usage stats
  // - Handle offline/unavailable data gracefully
  // - Refresh data if modal stays open (WebSocket or polling)
  // - Cache results briefly to avoid repeated calls
  // ========================================

  const isActive = user.status === "Active";
  const isSuspended = user.status === "Suspended";
  const isBlocked = user.status === "Blocked" || user.status === "Restricted";

  const usageStats = getUsageStats(user);
  const userPolicy = user.policy || user.userPolicy;

  const handleEditClick = () => {
    if (isBlocked) {
      notifications.showError("Cannot edit user with Blocked status");
      return;
    }
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleSendMessage = () => {
    // ========================================
    // TODO: Backend Integration - Resend Password/Credentials
    // ========================================
    // Trigger backend to resend user credentials via SMS/Email
    // 
    // API Endpoint: POST /api/users/{userId}/resend-password
    // 
    // Request Payload:
    // {
    //   userId: user.id,
    //   channels: ['sms', 'email'], // Which channels to send on
    //   reason: 'admin_request',
    //   requestedBy: currentUser.id,
    //   timestamp: new Date().toISOString()
    // }
    // 
    // Backend Processing:
    // 1. Verify user exists and is Active or Suspended (not Blocked)
    // 2. Check if user has valid mobile/email for selected channels
    // 3. Retrieve current password from database (or generate new OTP)
    // 4. Format message template with user credentials:
    //    - User ID
    //    - Password (or OTP)
    //    - Wi-Fi SSID
    //    - Portal URL (if applicable)
    // 5. Queue message to notification service:
    //    - SMS via Twilio/MSG91/other provider
    //    - Email via SMTP/SendGrid/SES
    // 6. Create audit log entry:
    //    - Action: 'password_resent'
    //    - Admin user who initiated
    //    - Channels used
    //    - Delivery status
    // 7. Update user record: last_credential_sent timestamp
    // 
    // Response Format:
    // {
    //   success: true,
    //   data: {
    //     userId: string,
    //     sentVia: ['sms', 'email'],
    //     deliveryStatus: {
    //       sms: 'sent' | 'failed',
    //       email: 'sent' | 'failed'
    //     },
    //     message: 'Credentials sent successfully'
    //   }
    // }
    // 
    // Error Handling:
    // - 400: Invalid user state (Blocked users)
    // - 404: User not found
    // - 422: Missing contact information (no mobile/email)
    // - 429: Rate limit exceeded (too many resends)
    // - 500: Notification service unavailable
    // 
    // UI Implementation:
    // const handleSendMessage = async () => {
    //   try {
    //     setResendingPassword(true);
    //     
    //     const response = await fetch(`/api/users/${user.id}/resend-password`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}`
    //       },
    //       body: JSON.stringify({
    //         channels: ['sms', 'email'],
    //         reason: 'admin_request'
    //       })
    //     });
    //     
    //     const result = await response.json();
    //     
    //     if (result.success) {
    //       notifications.showSuccess(
    //         `Password sent to ${user.firstName} ${user.lastName} via ${result.data.sentVia.join(', ')}`
    //       );
    //     } else {
    //       throw new Error(result.message);
    //     }
    //   } catch (error) {
    //     console.error('Resend password error:', error);
    //     notifications.showError('Failed to send password. Please try again.');
    //   } finally {
    //     setResendingPassword(false);
    //   }
    // };
    // 
    // Additional Features:
    // - Show delivery status in modal (checkmarks for SMS/Email)
    // - Rate limiting: prevent spamming (max 3 resends per hour)
    // - Option to regenerate password before sending
    // - Preview message content before sending
    // - Track resend history in user activity log
    // ========================================
    
    if (onSendMessage) {
      onSendMessage(user);
      notifications.showInfo(`Password resend initiated for ${user.id}`);
    }
  };

  const handleSuspend = () => {
    if (!window.confirm(`Are you sure you want to suspend ${user.firstName} ${user.lastName}?`)) {
      return;
    }
    
    // ========================================
    // TODO: Backend Integration - Suspend User
    // ========================================
    // See UserList.js handleChangeStatus for full implementation details
    // This calls parent's onSuspend which should trigger API call
    // 
    // Quick Reference:
    // - Endpoint: PUT /api/users/{userId}/status
    // - New status: 'Suspended'
    // - AAA: Disable authentication but keep account
    // - Devices: Maintain registrations
    // - License: Keep allocated
    // - Notification: Send suspension notice to user
    // ========================================
    
    if (onSuspend) {
      onSuspend(user);
    }
  };

  const handleBlock = () => {
    if (!window.confirm(`Are you sure you want to block ${user.firstName} ${user.lastName}? This action will immediately disconnect the user from the network.`)) {
      return;
    }
    
    // ========================================
    // TODO: Backend Integration - Block User
    // ========================================
    // See UserList.js handleChangeStatus for full implementation details
    // This calls parent's onBlock which should trigger API call
    // 
    // Quick Reference:
    // - Endpoint: PUT /api/users/{userId}/status
    // - New status: 'Blocked'
    // - AAA: Disable account + force disconnect active sessions
    // - Devices: Clear MAC bindings
    // - License: Free up (decrement count)
    // - Notification: Send blocking notice to user (if policy allows)
    // ========================================
    
    if (onBlock) {
      onBlock(user);
    }
  };

  const handleActivate = () => {
    if (!window.confirm(`Are you sure you want to activate ${user.firstName} ${user.lastName}?`)) {
      return;
    }
    
    // ========================================
    // TODO: Backend Integration - Activate User
    // ========================================
    // See UserList.js handleChangeStatus for full implementation details
    // This calls parent's onActivate which should trigger API call
    // 
    // Quick Reference:
    // - Endpoint: PUT /api/users/{userId}/status
    // - New status: 'Active'
    // - AAA: Enable account authentication
    // - Devices: Restore MAC bindings
    // - License: Allocate (increment count)
    // - Notification: Send activation notice to user
    // ========================================
    
    if (onActivate) {
      onActivate(user);
    }
  };

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
        
        <div className="udm-scrollable-content">
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
                <span className="udm-value">{user.devicesCount ?? "--"}</span>
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
        </div>
        
        <div className="udm-actions-row">
          <Button 
            variant="primary" 
            onClick={handleEditClick}
            disabled={isBlocked}
            title={isBlocked ? "Cannot edit user with Blocked status" : "Edit user details"}
          >
            Edit User
          </Button>
          {onSendMessage && !isBlocked && (
            <Button
              variant="secondary"
              className="resend-password-btn"
              onClick={handleSendMessage}
              title="Resend password credentials to user"
            >
              Resend Password
            </Button>
          )}
          {isActive && (
            <Button
              variant="warning"
              className="suspend-user-btn"
              onClick={handleSuspend}
              title="Temporarily suspend user account"
            >
              Suspend User
            </Button>
          )}
          {isSuspended && (
            <Button 
              variant="success" 
              onClick={handleActivate}
              title="Reactivate user account"
            >
              Activate User
            </Button>
          )}
          {(isActive || isSuspended) && (
            <Button 
              variant="danger" 
              onClick={handleBlock}
              title="Block user permanently"
            >
              Block User
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={onClose}
            title="Close modal"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;