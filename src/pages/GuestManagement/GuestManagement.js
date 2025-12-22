// src/pages/GuestManagement/GuestManagement.js

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaUserFriends,
  FaSearch,
  FaPlus,
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaFilter,
  FaDownload,
  FaSync,
  FaEye,
  FaEdit,
  FaTrash,
  FaQrcode,
  FaCopy,
  FaCalendarAlt,
  FaWifi,
  FaChartBar,
  FaHistory,
  FaExclamationTriangle,
  FaPrint,
  FaFileExport,
  FaArrowUp,
  FaArrowDown,
  FaPercentage,
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { useSegment } from '@context/SegmentContext';
import { useAccessLevelView } from '@context/AccessLevelViewContext';
import { useReadOnlyMode } from '@hooks/useReadOnlyMode';
import { useSiteConfig } from '@hooks/useSiteConfig';
import {
  guestUsers,
  guestVouchers,
  guestStatistics,
  guestAccessLogs,
  guestPolicies,
  getGuestsBySegmentAndSite,
  getGuestVouchersBySegmentAndSite,
  getGuestStatsBySite,
  getGuestStatsBySegment,
  getGuestAccessLogsBySegmentAndSite,
  getGuestPoliciesBySegment,
  generateVoucherCode,
  getSitesBySegment,
} from '@constants/guestSampleData';
import {
  GUEST_ACCESS_TYPES,
  GUEST_DURATION_PRESETS,
  GUEST_STATUS,
} from '@constants/appConstants';
import { showSuccess, showError, showInfo } from '@utils/notifications';
import { exportChartDataToCSV } from '@utils/exportUtils';
import Button from '@components/Button';
import Pagination from '@components/Pagination';
import ConfirmationModal from '@components/ConfirmationModal';
import userSampleData from '@constants/userSampleData';
import { PAGINATION } from '@constants/appConstants';
import './GuestManagement.css';

const GuestManagement = () => {
  const { currentSegment: segment } = useSegment();
  const { siteId: configSiteId, effectiveSiteName: configSiteName } = useSiteConfig();

  // Access Level View Context
  const {
    isCompanyView,
    isSiteView,
    isCompanyUser,
    currentSiteId: viewSiteId,
    currentSiteName: viewSiteName,
    canEditInCurrentView,
    drillDownToSite,
    returnToCompanyView,
  } = useAccessLevelView();

  // Read-only mode for customer impersonation
  const { isReadOnly: isCustomerViewReadOnly, blockAction } = useReadOnlyMode();

  // Determine effective site ID and name based on view context
  // Use segment-aware configSiteId for site view to ensure data matches current segment
  // This fixes the issue where site users couldn't see data for segments other than enterprise
  const effectiveSiteId = isCompanyView ? null : configSiteId;
  const effectiveSiteName = isCompanyView ? 'All Sites' : configSiteName;

  // Site filter for company view
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('all');

  // Get available sites for the current segment
  const availableSites = useMemo(() => {
    return getSitesBySegment(segment);
  }, [segment]);

  // State
  const [activeTab, setActiveTab] = useState('guests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [guestTypeFilter, setGuestTypeFilter] = useState('all');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state for guests
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  // Pagination state for vouchers
  const [voucherCurrentPage, setVoucherCurrentPage] = useState(1);
  const [voucherRowsPerPage, setVoucherRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  // Selected vouchers for bulk actions
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [selectAllVouchers, setSelectAllVouchers] = useState(false);

  // QR Print modal state
  const [showQRPrintModal, setShowQRPrintModal] = useState(false);
  const [qrPrintVouchers, setQrPrintVouchers] = useState([]);

  // Revoke access confirmation modal state
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [guestToRevoke, setGuestToRevoke] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Extend access modal state
  const [showExtendAccessModal, setShowExtendAccessModal] = useState(false);
  const [guestToExtend, setGuestToExtend] = useState(null);
  const [extendDuration, setExtendDuration] = useState('24h');
  const [isExtending, setIsExtending] = useState(false);

  // Voucher-specific search and filter state
  const [voucherSearchQuery, setVoucherSearchQuery] = useState('');
  const [voucherStatusFilter, setVoucherStatusFilter] = useState('all');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('all');

  // QR Customization options
  const [qrOptions, setQrOptions] = useState({
    size: 200,
    includeText: true,
    includeType: true,
    includeValidity: true,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
  });

  // Add Guest Form State
  const [guestForm, setGuestForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    guestType: '',
    duration: '24h',
    hostId: '',
    hostOther: '',
    purposeOfVisit: '',
    companyName: '',
  });

  // Get registered users for host selection (filter active users at this site)
  const registeredUsers = useMemo(() => {
    return (userSampleData.users || []).filter(
      user => user.status === 'Active' && user.segment === segment
    );
  }, [segment]);

  // Generate Vouchers Form State
  const [voucherForm, setVoucherForm] = useState({
    quantity: 10,
    guestType: '',
    duration: '24h',
    prefix: 'GV',
  });

  // Get segment-specific data
  const guestTypes = GUEST_ACCESS_TYPES[segment] || GUEST_ACCESS_TYPES.miscellaneous;
  const segmentPolicies = getGuestPoliciesBySegment(segment);

  // Get stats based on view context - company view gets aggregated, site view gets specific
  const siteStats = useMemo(() => {
    const defaultStats = {
      today: { totalGuests: 0, activeGuests: 0, checkedIn: 0, checkedOut: 0, pending: 0, dataUsed: '0 GB' },
      thisWeek: { totalGuests: 0, uniqueVisitors: 0, avgDuration: '0h', peakDay: '-', dataUsed: '0 GB' },
      thisMonth: { totalGuests: 0, uniqueVisitors: 0, avgDuration: '0h', topGuestType: '-', dataUsed: '0 GB', vouchersGenerated: 0, vouchersRedeemed: 0 },
      byType: {},
    };

    if (isCompanyView) {
      // In company view, get aggregated stats for the segment
      return getGuestStatsBySegment(segment) || defaultStats;
    } else {
      // In site view, get stats for the specific site
      return getGuestStatsBySite(effectiveSiteId) || defaultStats;
    }
  }, [isCompanyView, segment, effectiveSiteId]);

  // Filter guests - uses segment and site aware filtering
  const filteredGuests = useMemo(() => {
    // Get guests based on view context
    let guests;
    if (isCompanyView) {
      // In company view, get all guests for the segment
      guests = getGuestsBySegmentAndSite(segment, null);
      // Apply site filter if selected
      if (selectedSiteFilter !== 'all') {
        guests = guests.filter(g => g.siteId === selectedSiteFilter);
      }
    } else {
      // In site view, get guests for the specific site
      guests = getGuestsBySegmentAndSite(segment, effectiveSiteId);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      guests = guests.filter(g =>
        g.firstName?.toLowerCase().includes(query) ||
        g.lastName?.toLowerCase().includes(query) ||
        g.mobile?.includes(query) ||
        g.email?.toLowerCase().includes(query) ||
        g.password?.toLowerCase().includes(query) ||
        g.effectiveSiteName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      guests = guests.filter(g => g.guestStatus === statusFilter);
    }

    if (guestTypeFilter !== 'all') {
      guests = guests.filter(g => g.guestType === guestTypeFilter);
    }

    return guests;
  }, [segment, isCompanyView, effectiveSiteId, selectedSiteFilter, searchQuery, statusFilter, guestTypeFilter]);

  // Paginated guests
  const paginatedGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredGuests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredGuests, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  const totalPages = Math.ceil(filteredGuests.length / rowsPerPage);

  // Filter vouchers - uses voucher-specific filters and segment/site awareness
  const filteredVouchers = useMemo(() => {
    // Get vouchers based on view context
    let vouchers;
    if (isCompanyView) {
      // In company view, get all vouchers for the segment
      vouchers = getGuestVouchersBySegmentAndSite(segment, null);
      // Apply site filter if selected
      if (selectedSiteFilter !== 'all') {
        vouchers = vouchers.filter(v => v.siteId === selectedSiteFilter);
      }
    } else {
      // In site view, get vouchers for the specific site
      vouchers = getGuestVouchersBySegmentAndSite(segment, effectiveSiteId);
    }

    if (voucherSearchQuery) {
      const query = voucherSearchQuery.toLowerCase();
      vouchers = vouchers.filter(v =>
        v.code?.toLowerCase().includes(query) ||
        v.redeemedBy?.toLowerCase().includes(query) ||
        v.effectiveSiteName?.toLowerCase().includes(query)
      );
    }

    if (voucherStatusFilter !== 'all') {
      vouchers = vouchers.filter(v => v.status === voucherStatusFilter);
    }

    if (voucherTypeFilter !== 'all') {
      vouchers = vouchers.filter(v => v.guestType === voucherTypeFilter);
    }

    return vouchers;
  }, [segment, isCompanyView, effectiveSiteId, selectedSiteFilter, voucherSearchQuery, voucherStatusFilter, voucherTypeFilter]);

  // Paginated vouchers
  const paginatedVouchers = useMemo(() => {
    const startIndex = (voucherCurrentPage - 1) * voucherRowsPerPage;
    return filteredVouchers.slice(startIndex, startIndex + voucherRowsPerPage);
  }, [filteredVouchers, voucherCurrentPage, voucherRowsPerPage]);

  const voucherTotalPages = Math.ceil(filteredVouchers.length / voucherRowsPerPage);

  // Access logs - segment and site aware
  const siteLogs = useMemo(() => {
    if (isCompanyView) {
      let logs = getGuestAccessLogsBySegmentAndSite(segment, null);
      if (selectedSiteFilter !== 'all') {
        logs = logs.filter(log => log.siteId === selectedSiteFilter);
      }
      return logs;
    }
    return getGuestAccessLogsBySegmentAndSite(segment, effectiveSiteId);
  }, [segment, isCompanyView, effectiveSiteId, selectedSiteFilter]);

  // Reset pagination when segment or site changes
  useEffect(() => {
    setCurrentPage(1);
    setVoucherCurrentPage(1);
    setSelectedSiteFilter('all');
  }, [segment]);

  useEffect(() => {
    setCurrentPage(1);
    setVoucherCurrentPage(1);
  }, [effectiveSiteId, isCompanyView]);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case GUEST_STATUS.ACTIVE:
      case GUEST_STATUS.CHECKED_IN:
        return 'status-active';
      case GUEST_STATUS.EXPIRED:
      case GUEST_STATUS.REVOKED:
        return 'status-expired';
      case GUEST_STATUS.CHECKED_OUT:
        return 'status-checkout';
      case GUEST_STATUS.PENDING:
        return 'status-pending';
      default:
        return '';
    }
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    switch (status) {
      case GUEST_STATUS.ACTIVE: return 'Active';
      case GUEST_STATUS.CHECKED_IN: return 'Checked In';
      case GUEST_STATUS.CHECKED_OUT: return 'Checked Out';
      case GUEST_STATUS.EXPIRED: return 'Expired';
      case GUEST_STATUS.PENDING: return 'Pending';
      case GUEST_STATUS.REVOKED: return 'Revoked';
      default: return status;
    }
  };

  // Get guest type label
  const getGuestTypeLabel = (typeId) => {
    const type = guestTypes.find(t => t.id === typeId);
    return type?.label || typeId;
  };

  // Action handlers
  const handleViewGuest = (guest) => {
    setSelectedGuest(guest);
    setShowGuestDetailsModal(true);
  };

  const handleCheckIn = (guest) => {
    showSuccess(`${guest.firstName} ${guest.lastName} checked in successfully`);
  };

  const handleCheckOut = (guest) => {
    showSuccess(`${guest.firstName} ${guest.lastName} checked out successfully`);
  };

  const handleExtendAccess = (guest) => {
    setGuestToExtend(guest);
    setExtendDuration('24h');
    setShowExtendAccessModal(true);
  };

  const handleConfirmExtend = async () => {
    if (!guestToExtend) return;

    setIsExtending(true);
    try {
      /* ========================================================================
       * BACKEND INTEGRATION: Extend Guest Access
       * ========================================================================
       * API Endpoint: PATCH /api/v1/guests/{guestId}/extend
       *
       * Request Payload:
       * {
       *   "duration": "string",            // e.g., "24h", "48h", "7d"
       *   "durationHours": number,         // Extension in hours
       *   "reason": "string (optional)"    // Reason for extension
       * }
       *
       * Expected Response (Success - 200):
       * {
       *   "success": true,
       *   "data": {
       *     "guestId": "string",
       *     "previousValidUntil": "ISO8601",
       *     "newValidUntil": "ISO8601",
       *     "extendedBy": number           // Hours extended
       *   }
       * }
       *
       * Backend Processing:
       * 1. Verify guest exists and is active/not expired
       * 2. Calculate new validity period
       * 3. Update guest record in database
       * 4. Update AAA system:
       *    - Extend account validity in RADIUS
       *    - Update session timeout if applicable
       * 5. Send notification to guest (optional):
       *    - SMS/Email with updated validity
       * 6. Create audit log entry
       *
       * Sample Integration Code:
       * ------------------------
       * const response = await fetch(`/api/v1/guests/${guestToExtend.id}/extend`, {
       *   method: 'PATCH',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${authToken}`
       *   },
       *   body: JSON.stringify({
       *     duration: extendDuration,
       *     durationHours: GUEST_DURATION_PRESETS[extendDuration]?.hours || 24
       *   })
       * });
       * ======================================================================== */

      // TODO: Remove mock and implement actual API call above
      await new Promise(resolve => setTimeout(resolve, 800));
      const durationLabel = GUEST_DURATION_PRESETS[extendDuration]?.label || extendDuration;
      showSuccess(`Access extended by ${durationLabel} for ${guestToExtend.firstName} ${guestToExtend.lastName}`);
      setShowExtendAccessModal(false);
      setShowGuestDetailsModal(false);
      setGuestToExtend(null);
    } catch (error) {
      showError('Failed to extend access. Please try again.');
    } finally {
      setIsExtending(false);
    }
  };

  const handleCancelExtend = () => {
    setShowExtendAccessModal(false);
    setGuestToExtend(null);
  };

  const handleRevokeAccess = (guest) => {
    setGuestToRevoke(guest);
    setShowRevokeConfirmation(true);
  };

  const handleConfirmRevoke = async () => {
    if (!guestToRevoke) return;

    setIsRevoking(true);
    try {
      /* ========================================================================
       * BACKEND INTEGRATION: Revoke Guest Access
       * ========================================================================
       * API Endpoint: DELETE /api/v1/guests/{guestId}/access
       *               OR PATCH /api/v1/guests/{guestId}/revoke
       *
       * Request Payload:
       * {
       *   "reason": "string (optional)",   // Reason for revocation
       *   "forceDisconnect": boolean       // Immediately disconnect active sessions
       * }
       *
       * Expected Response (Success - 200):
       * {
       *   "success": true,
       *   "data": {
       *     "guestId": "string",
       *     "previousStatus": "active",
       *     "newStatus": "revoked",
       *     "revokedAt": "ISO8601",
       *     "sessionsTerminated": number   // Number of active sessions disconnected
       *   }
       * }
       *
       * Backend Processing:
       * 1. Verify guest exists
       * 2. Immediately terminate active sessions:
       *    - Call AAA API: POST /aaa/api/disconnect-user
       *    - Clear MAC addresses from whitelist
       * 3. Update guest status in database to 'revoked'
       * 4. Disable/delete account in AAA system:
       *    - RADIUS: Disable or remove user entry
       *    - Clear any cached authentication
       * 5. Create audit log entry with:
       *    - Who revoked (admin ID)
       *    - Reason for revocation
       *    - Timestamp
       * 6. Send notification to guest (optional):
       *    - SMS/Email informing access has been revoked
       *
       * Sample Integration Code:
       * ------------------------
       * const response = await fetch(`/api/v1/guests/${guestToRevoke.id}/revoke`, {
       *   method: 'PATCH',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${authToken}`
       *   },
       *   body: JSON.stringify({
       *     forceDisconnect: true,
       *     reason: 'Admin revocation'
       *   })
       * });
       * ======================================================================== */

      // TODO: Remove mock and implement actual API call above
      await new Promise(resolve => setTimeout(resolve, 800));
      showSuccess(`Access revoked for ${guestToRevoke.firstName} ${guestToRevoke.lastName}`);
      setShowRevokeConfirmation(false);
      setShowGuestDetailsModal(false);
      setGuestToRevoke(null);
    } catch (error) {
      showError('Failed to revoke access. Please try again.');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCancelRevoke = () => {
    setShowRevokeConfirmation(false);
    setGuestToRevoke(null);
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    showSuccess(`Voucher code "${code}" copied to clipboard`);
  };

  const handleGenerateVouchers = () => {
    setVoucherForm({
      quantity: 10,
      guestType: guestTypes[0]?.id || '',
      duration: '24h',
      prefix: 'GV',
    });
    setShowVoucherModal(true);
  };

  // Handle voucher selection
  const handleVoucherSelect = (voucherId) => {
    setSelectedVouchers(prev => {
      if (prev.includes(voucherId)) {
        return prev.filter(id => id !== voucherId);
      }
      return [...prev, voucherId];
    });
  };

  const handleSelectAllVouchers = () => {
    if (selectAllVouchers) {
      setSelectedVouchers([]);
      setSelectAllVouchers(false);
    } else {
      setSelectedVouchers(paginatedVouchers.map(v => v.id));
      setSelectAllVouchers(true);
    }
  };

  // Print QR Codes functionality - requires selection
  const handlePrintQRCodes = () => {
    if (selectedVouchers.length === 0) {
      showInfo('Please select one or more vouchers from the list to print QR codes');
      return;
    }

    const vouchersToPrint = filteredVouchers.filter(v => selectedVouchers.includes(v.id));

    if (vouchersToPrint.length === 0) {
      showError('No vouchers selected to print');
      return;
    }

    setQrPrintVouchers(vouchersToPrint);
    setShowQRPrintModal(true);
  };

  // Print single QR code
  const handlePrintSingleQR = (voucher) => {
    setQrPrintVouchers([voucher]);
    setShowQRPrintModal(true);
  };

  // Generate QR data for a voucher
  const generateQRData = (voucher) => {
    return JSON.stringify({
      type: 'guest_wifi_voucher',
      code: voucher.code,
      site: effectiveSiteName,
      guestType: voucher.guestType,
      validityHours: voucher.validityHours,
    });
  };

  // Execute print with real QR codes
  const handleExecutePrint = () => {
    if (qrPrintVouchers.length === 0) return;

    // Create a temporary container for rendering QR codes
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Render QR codes to get SVG strings
    const qrSvgStrings = qrPrintVouchers.map(voucher => {
      const tempDiv = document.createElement('div');
      container.appendChild(tempDiv);

      // Create a temporary React root to render QRCodeSVG
      const qrData = generateQRData(voucher);
      const svgSize = qrOptions.size || 200;

      // Generate SVG directly using the QR code library pattern
      // We'll use a simpler approach - render actual QR code pattern
      return {
        voucher,
        qrData,
        size: svgSize,
      };
    });

    // Clean up
    document.body.removeChild(container);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voucher QR Codes - ${effectiveSiteName}</title>
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"><\/script>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .qr-card {
            border: 2px solid #004aad;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            page-break-inside: avoid;
            background: white;
          }
          .qr-code-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px auto;
            padding: 10px;
            background: ${qrOptions.backgroundColor};
            border-radius: 8px;
          }
          .qr-code-container canvas {
            display: block;
          }
          .voucher-code {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            margin: 12px 0 8px;
            color: #153874;
            letter-spacing: 2px;
          }
          .voucher-info {
            font-size: 12px;
            color: #666;
            margin: 4px 0;
          }
          .site-name {
            font-size: 11px;
            color: #999;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #ddd;
          }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { margin: 0; color: #153874; font-size: 24px; }
          .header p { color: #666; margin: 5px 0; font-size: 14px; }
          @media print {
            .qr-card { break-inside: avoid; }
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Guest WiFi Voucher Codes</h1>
          <p>${effectiveSiteName} | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="qr-grid">
          ${qrSvgStrings.map(({ voucher, qrData, size }) => `
            <div class="qr-card">
              <div class="qr-code-container">
                <canvas id="qr-${voucher.id}" width="${size}" height="${size}"></canvas>
              </div>
              ${qrOptions.includeText ? `<div class="voucher-code">${voucher.code}</div>` : ''}
              ${qrOptions.includeType ? `<div class="voucher-info">${getGuestTypeLabel(voucher.guestType)}</div>` : ''}
              ${qrOptions.includeValidity ? `<div class="voucher-info">Valid for ${voucher.validityHours} hours</div>` : ''}
              <div class="site-name">${effectiveSiteName}</div>
            </div>
          `).join('')}
        </div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            ${qrSvgStrings.map(({ voucher, qrData, size }) => `
              QRCode.toCanvas(document.getElementById('qr-${voucher.id}'), '${qrData.replace(/'/g, "\\'")}', {
                width: ${size},
                margin: 2,
                color: {
                  dark: '${qrOptions.foregroundColor}',
                  light: '${qrOptions.backgroundColor}'
                }
              });
            `).join('')}
            setTimeout(function() { window.print(); }, 500);
          });
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setShowQRPrintModal(false);
    showSuccess(`Print initiated for ${qrPrintVouchers.length} voucher(s)`);
  };

  // Voucher action handlers
  const handleViewVoucher = (voucher) => {
    showInfo(`Voucher: ${voucher.code}\nType: ${getGuestTypeLabel(voucher.guestType)}\nStatus: ${voucher.status}\nValidity: ${voucher.validityHours} hours\nCreated: ${formatDateTime(voucher.createdAt)}${voucher.redeemedBy ? `\nRedeemed by: ${voucher.redeemedBy}` : ''}`);
  };

  const handleCopyVoucherCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showSuccess(`Voucher code "${code}" copied to clipboard`);
    }).catch(() => {
      showError('Failed to copy voucher code');
    });
  };

  const handleDeactivateVoucher = (voucher) => {
    if (voucher.status !== 'active') {
      showError('Only active vouchers can be deactivated');
      return;
    }
    showSuccess(`Voucher "${voucher.code}" has been deactivated`);
  };

  const handleDeleteVoucher = (voucher) => {
    if (voucher.status === 'redeemed') {
      showError('Cannot delete a redeemed voucher');
      return;
    }
    showSuccess(`Voucher "${voucher.code}" has been deleted`);
  };

  // Export vouchers functionality
  const handleExportVouchers = () => {
    if (filteredVouchers.length === 0) {
      showError('No vouchers to export');
      return;
    }

    const headers = ['Voucher Code', 'Type', 'Policy', 'Validity (Hours)', 'Status', 'Created', 'Redeemed By'];
    const rows = filteredVouchers.map(v => [
      v.code,
      getGuestTypeLabel(v.guestType),
      v.policyId?.split('_').slice(-4, -2).join(' ') || '-',
      v.validityHours,
      v.status,
      formatDateTime(v.createdAt),
      v.redeemedBy || '-'
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `Vouchers_${effectiveSiteName}_${timestamp}.csv`;

    exportChartDataToCSV({ headers, rows }, filename);
    showSuccess(`Exported ${filteredVouchers.length} voucher(s) to CSV`);
  };

  const handleAddGuest = () => {
    setGuestForm({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      guestType: guestTypes[0]?.id || '',
      duration: '24h',
      hostId: '',
      hostOther: '',
      purposeOfVisit: '',
      companyName: '',
    });
    setShowAddGuestModal(true);
  };

  // Get host name from form (either selected user or manual input)
  const getHostName = () => {
    if (guestForm.hostId === 'other') {
      return guestForm.hostOther;
    }
    const selectedHost = registeredUsers.find(u => u.id === guestForm.hostId);
    return selectedHost ? `${selectedHost.firstName} ${selectedHost.lastName}` : '';
  };

  // Handle guest form input change
  const handleGuestFormChange = (e) => {
    const { name, value } = e.target;
    setGuestForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle voucher form input change
  const handleVoucherFormChange = (e) => {
    const { name, value } = e.target;
    setVoucherForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Add Guest form
  const handleSubmitGuest = async (e) => {
    e.preventDefault();

    // Validation
    if (!guestForm.firstName.trim() || !guestForm.lastName.trim()) {
      showError('Please enter guest name');
      return;
    }
    if (!guestForm.mobile.trim()) {
      showError('Please enter mobile number');
      return;
    }
    if (!guestForm.guestType) {
      showError('Please select guest type');
      return;
    }
    // Validate host name when "other" is selected
    if (guestForm.hostId === 'other' && !guestForm.hostOther.trim()) {
      showError('Please enter host name');
      return;
    }

    setIsSubmitting(true);

    try {
      /* ========================================================================
       * BACKEND INTEGRATION: Create Guest Account
       * ========================================================================
       * API Endpoint: POST /api/v1/guests
       *
       * Request Payload:
       * {
       *   "firstName": "string",
       *   "lastName": "string",
       *   "mobile": "string",
       *   "email": "string (optional)",
       *   "guestType": "string",           // e.g., "visitor", "contractor", "conference"
       *   "duration": "string",            // e.g., "24h", "48h", "7d"
       *   "durationHours": number,         // Calculated duration in hours
       *   "hostId": "string",              // Host user ID
       *   "hostName": "string",            // Host name (for 'other' selection)
       *   "purposeOfVisit": "string",
       *   "companyName": "string (optional)",
       *   "siteId": "string",
       *   "segment": "string"
       * }
       *
       * Expected Response (Success - 201):
       * {
       *   "success": true,
       *   "data": {
       *     "guestId": "string",
       *     "accessCode": "string",        // Auto-generated access code/password
       *     "username": "string",          // Auto-generated username (mobile or custom)
       *     "validFrom": "ISO8601",
       *     "validUntil": "ISO8601",
       *     "policyApplied": "string",
       *     "qrCode": "base64 (optional)",
       *     "credentials": {
       *       "ssid": "string",
       *       "username": "string",
       *       "password": "string"
       *     }
       *   }
       * }
       *
       * Backend Processing:
       * 1. Validate guest data and check for duplicates
       * 2. Check guest license availability for segment
       * 3. Generate unique access code/password
       * 4. Create guest record in database
       * 5. Provision in AAA system with time-limited access:
       *    - Set account validity period (validFrom -> validUntil)
       *    - Apply guest policy (bandwidth, data limits)
       * 6. Send credentials via SMS/Email:
       *    - POST /api/notifications/send-credentials
       *    - Include: SSID, username, password, validity
       * 7. Create audit log entry
       * 8. Notify host (optional):
       *    - POST /api/notifications/host-notification
       *
       * Sample Integration Code:
       * ------------------------
       * const response = await fetch('/api/v1/guests', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${authToken}`
       *   },
       *   body: JSON.stringify({
       *     ...guestForm,
       *     durationHours: GUEST_DURATION_PRESETS[guestForm.duration]?.hours || 24,
       *     hostName: getHostName(),
       *     siteId: effectiveSiteId,
       *     segment
       *   })
       * });
       * const result = await response.json();
       * if (result.success) {
       *   showSuccess(`Guest added. Access Code: ${result.data.accessCode}`);
       * }
       * ======================================================================== */

      // TODO: Remove mock and implement actual API call above
      await new Promise(resolve => setTimeout(resolve, 1000));

      const accessCode = generateVoucherCode();
      const durationHours = GUEST_DURATION_PRESETS[guestForm.duration]?.hours || 24;
      const validUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
      const hostName = getHostName();

      showSuccess(`Guest "${guestForm.firstName} ${guestForm.lastName}" added successfully. Access Code: ${accessCode}`);
      setShowAddGuestModal(false);
    } catch (error) {
      showError('Failed to add guest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Generate Vouchers form
  const handleSubmitVouchers = async (e) => {
    e.preventDefault();

    if (voucherForm.quantity < 1 || voucherForm.quantity > 100) {
      showError('Quantity must be between 1 and 100');
      return;
    }
    if (!voucherForm.guestType) {
      showError('Please select guest type');
      return;
    }

    setIsSubmitting(true);

    try {
      /* ========================================================================
       * BACKEND INTEGRATION: Generate Guest Vouchers (Bulk)
       * ========================================================================
       * API Endpoint: POST /api/v1/guests/vouchers/bulk
       *
       * Request Payload:
       * {
       *   "quantity": number,              // 1-100 vouchers
       *   "guestType": "string",           // Type of guest access
       *   "duration": "string",            // e.g., "24h", "48h", "7d"
       *   "prefix": "string",              // Voucher code prefix (e.g., "GV")
       *   "siteId": "string",
       *   "segment": "string",
       *   "policyId": "string (optional)"  // Override default policy
       * }
       *
       * Expected Response (Success - 201):
       * {
       *   "success": true,
       *   "data": {
       *     "batchId": "string",           // Batch identifier for tracking
       *     "vouchers": [
       *       {
       *         "id": "string",
       *         "code": "string",          // e.g., "GV-ABC123"
       *         "guestType": "string",
       *         "validityHours": number,
       *         "status": "active",
       *         "createdAt": "ISO8601",
       *         "expiresAt": "ISO8601"
       *       }
       *     ],
       *     "totalGenerated": number,
       *     "qrCodes": ["base64..."]        // Optional: pre-generated QR codes
       *   }
       * }
       *
       * Backend Processing:
       * 1. Validate quantity limits (max 100 per batch)
       * 2. Check voucher quota/license for segment
       * 3. Generate unique voucher codes:
       *    - Format: {prefix}-{random_alphanumeric}
       *    - Ensure uniqueness across all vouchers
       * 4. Store vouchers in database:
       *    - Status: 'active'
       *    - Link to batch for bulk management
       * 5. Pre-provision in AAA system (optional):
       *    - Create accounts in RADIUS with disabled status
       *    - Enable on first use (voucher redemption)
       * 6. Generate QR codes (optional):
       *    - Include: code, SSID, site info
       * 7. Create audit log entry
       *
       * Sample Integration Code:
       * ------------------------
       * const response = await fetch('/api/v1/guests/vouchers/bulk', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${authToken}`
       *   },
       *   body: JSON.stringify({
       *     ...voucherForm,
       *     siteId: effectiveSiteId,
       *     segment
       *   })
       * });
       * const result = await response.json();
       * if (result.success) {
       *   // Optionally store batch ID for future reference
       *   showSuccess(`Generated ${result.data.totalGenerated} vouchers`);
       * }
       * ======================================================================== */

      // TODO: Remove mock and implement actual API call above
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generatedCodes = [];
      for (let i = 0; i < voucherForm.quantity; i++) {
        generatedCodes.push(generateVoucherCode());
      }

      showSuccess(`Successfully generated ${voucherForm.quantity} voucher(s)`);
      setShowVoucherModal(false);
    } catch (error) {
      showError('Failed to generate vouchers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render stats cards
  const renderStatsCards = () => (
    <div className="guest-stats-grid">
      <div className="guest-stat-card">
        <div className="stat-icon active">
          <FaUserFriends />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.today.activeGuests}</span>
          <span className="stat-label">Active Guests</span>
        </div>
      </div>

      <div className="guest-stat-card">
        <div className="stat-icon checkin">
          <FaSignInAlt />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.today.checkedIn}</span>
          <span className="stat-label">Checked In Today</span>
        </div>
      </div>

      <div className="guest-stat-card">
        <div className="stat-icon checkout">
          <FaSignOutAlt />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.today.checkedOut}</span>
          <span className="stat-label">Checked Out Today</span>
        </div>
      </div>

      <div className="guest-stat-card">
        <div className="stat-icon pending">
          <FaClock />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.today.pending}</span>
          <span className="stat-label">Pending Check-in</span>
        </div>
      </div>

      <div className="guest-stat-card">
        <div className="stat-icon data">
          <FaWifi />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.today.dataUsed}</span>
          <span className="stat-label">Data Used Today</span>
        </div>
      </div>

      <div className="guest-stat-card">
        <div className="stat-icon voucher">
          <FaTicketAlt />
        </div>
        <div className="stat-content">
          <span className="stat-value">{siteStats.thisMonth.vouchersGenerated - siteStats.thisMonth.vouchersRedeemed}</span>
          <span className="stat-label">Available Vouchers</span>
        </div>
      </div>
    </div>
  );

  // Selection state for guests
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectAllGuests, setSelectAllGuests] = useState(false);

  // Handle guest selection
  const handleGuestSelect = (guestId) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      }
      return [...prev, guestId];
    });
  };

  const handleSelectAllGuests = () => {
    if (selectAllGuests) {
      setSelectedGuests([]);
      setSelectAllGuests(false);
    } else {
      setSelectedGuests(paginatedGuests.map(g => g.id));
      setSelectAllGuests(true);
    }
  };

  // Export guests functionality
  const handleExportGuests = () => {
    if (filteredGuests.length === 0) {
      showError('No guests to export');
      return;
    }

    const headers = ['Name', 'Mobile', 'Email', 'Type', 'Host', 'Access Code', 'Valid Until', 'Status', 'Data Used'];
    const rows = filteredGuests.map(g => [
      `${g.firstName} ${g.lastName}`,
      g.mobile,
      g.email || '-',
      getGuestTypeLabel(g.guestType),
      g.hostName || g.hostResidentName || '-',
      g.password,
      formatDateTime(g.validUntil),
      getStatusDisplay(g.guestStatus),
      g.usageTotalData
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `Guests_${effectiveSiteName}_${timestamp}.csv`;

    exportChartDataToCSV({ headers, rows }, filename);
    showSuccess(`Exported ${filteredGuests.length} guest(s) to CSV`);
  };

  // Render guests tab
  const renderGuestsTab = () => (
    <>
      {/* Guest Toolbar - matching voucher toolbar style */}
      <div className="guest-toolbar-container">
        <div className="guest-tab-toolbar">
          <div className="toolbar-left">
            <Button
              variant="primary"
              onClick={handleAddGuest}
              disabled={!canEditInCurrentView || isCustomerViewReadOnly}
              title={isCustomerViewReadOnly ? 'Disabled in customer view mode' : !canEditInCurrentView ? 'Switch to Site View to add guests' : 'Add new guest'}
            >
              <FaPlus style={{ marginRight: 6 }} /> Add Guest
            </Button>
            <Button variant="secondary" onClick={handleExportGuests} disabled={filteredGuests.length === 0}>
              <FaFileExport style={{ marginRight: 6 }} /> Export
            </Button>
          </div>
          <div className="toolbar-right">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={isCompanyView ? "Search all sites..." : "Search guests..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="toolbar-search"
              />
            </div>
            <select
              className="toolbar-select"
              value={guestTypeFilter}
              onChange={(e) => {
                setGuestTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              {guestTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value={GUEST_STATUS.ACTIVE}>Active</option>
              <option value={GUEST_STATUS.CHECKED_IN}>Checked In</option>
              <option value={GUEST_STATUS.CHECKED_OUT}>Checked Out</option>
              <option value={GUEST_STATUS.PENDING}>Pending</option>
              <option value={GUEST_STATUS.EXPIRED}>Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span className="results-count">
          {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''} found
          {isCompanyView && selectedSiteFilter === 'all' && ` across ${availableSites.length} sites`}
          {selectedGuests.length > 0 && ` (${selectedGuests.length} selected)`}
        </span>
      </div>

      {/* Guest Table - matching voucher table styling */}
      <div className="guest-table-outer">
        <table className="guest-list-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectAllGuests}
                  onChange={handleSelectAllGuests}
                  title="Select all"
                />
              </th>
              <th>Guest</th>
              {isCompanyView && <th>Site</th>}
              <th>Type</th>
              <th>Host</th>
              <th>Access Code</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Data Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGuests.length > 0 ? (
              paginatedGuests.map((guest) => (
              <tr key={guest.id} className={selectedGuests.includes(guest.id) ? 'selected' : ''}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedGuests.includes(guest.id)}
                    onChange={() => handleGuestSelect(guest.id)}
                  />
                </td>
                <td>
                  <div className="guest-info">
                    <span className="guest-name">{guest.firstName} {guest.lastName}</span>
                    <span className="guest-contact">{guest.mobile}</span>
                  </div>
                </td>
                {isCompanyView && (
                  <td>
                    <span className="site-name-cell" title={guest.effectiveSiteName}>
                      {guest.effectiveSiteName?.split(' - ')[1] || guest.effectiveSiteName || '-'}
                    </span>
                  </td>
                )}
                <td>
                  <span className="guest-type-badge">{getGuestTypeLabel(guest.guestType)}</span>
                </td>
                <td>
                  <span className="guest-host">{guest.hostName || guest.hostResidentName || '-'}</span>
                </td>
                <td>
                  <div className="access-code">
                    <code>{guest.password}</code>
                    <button
                      className="btn-icon-sm"
                      onClick={() => handleCopyVoucher(guest.password)}
                      title="Copy code"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </td>
                <td>{formatDateTime(guest.validUntil)}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(guest.guestStatus)}`}>
                    {getStatusDisplay(guest.guestStatus)}
                  </span>
                </td>
                <td>{guest.usageTotalData}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon-sm"
                      onClick={() => handleViewGuest(guest)}
                      title="View details"
                    >
                      <FaEye />
                    </button>
                    {canEditInCurrentView && !isCustomerViewReadOnly && guest.guestStatus === GUEST_STATUS.PENDING && (
                      <button
                        className="btn-icon-sm success"
                        onClick={() => handleCheckIn(guest)}
                        title="Check in"
                      >
                        <FaSignInAlt />
                      </button>
                    )}
                    {canEditInCurrentView && !isCustomerViewReadOnly && (guest.guestStatus === GUEST_STATUS.ACTIVE || guest.guestStatus === GUEST_STATUS.CHECKED_IN) && (
                      <>
                        <button
                          className="btn-icon-sm warning"
                          onClick={() => handleCheckOut(guest)}
                          title="Check out"
                        >
                          <FaSignOutAlt />
                        </button>
                        <button
                          className="btn-icon-sm info"
                          onClick={() => handleExtendAccess(guest)}
                          title="Extend access"
                        >
                          <FaClock />
                        </button>
                        <button
                          className="btn-icon-sm danger"
                          onClick={() => handleRevokeAccess(guest)}
                          title="Revoke access"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
              <tr>
                <td colSpan={isCompanyView ? 10 : 9} className="empty-state">
                  <FaUserFriends />
                  <p>No guests found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredGuests.length > 0 && (
        <div className="guest-pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGuests.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(newValue) => {
              setRowsPerPage(newValue);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </>
  );

  // Render vouchers tab
  const renderVouchersTab = () => (
    <>
      {/* Voucher Toolbar - matching guest toolbar style with search and filters */}
      <div className="voucher-toolbar-container">
        <div className="voucher-toolbar">
          <div className="toolbar-left">
            <Button
              variant="primary"
              onClick={handleGenerateVouchers}
              disabled={!canEditInCurrentView || isCustomerViewReadOnly}
              title={isCustomerViewReadOnly ? 'Disabled in customer view mode' : !canEditInCurrentView ? 'Switch to Site View to generate vouchers' : 'Generate new vouchers'}
            >
              <FaPlus style={{ marginRight: 6 }} /> Generate Vouchers
            </Button>
            <Button
              variant={selectedVouchers.length > 0 ? "secondary" : "outline"}
              onClick={handlePrintQRCodes}
              title={selectedVouchers.length === 0 ? "Select vouchers from the list below to print QR codes" : `Print ${selectedVouchers.length} selected voucher(s)`}
            >
              <FaPrint style={{ marginRight: 6 }} />
              {selectedVouchers.length > 0 ? (
                <>Print QR Codes <span className="btn-badge">{selectedVouchers.length}</span></>
              ) : (
                'Print QR Codes'
              )}
            </Button>
            <Button variant="secondary" onClick={handleExportVouchers} disabled={filteredVouchers.length === 0}>
              <FaFileExport style={{ marginRight: 6 }} /> Export
            </Button>
          </div>
          <div className="toolbar-right">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={isCompanyView ? "Search all sites..." : "Search vouchers..."}
                value={voucherSearchQuery}
                onChange={(e) => {
                  setVoucherSearchQuery(e.target.value);
                  setVoucherCurrentPage(1);
                }}
                className="toolbar-search"
              />
            </div>
            <select
              className="toolbar-select"
              value={voucherTypeFilter}
              onChange={(e) => {
                setVoucherTypeFilter(e.target.value);
                setVoucherCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              {guestTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={voucherStatusFilter}
              onChange={(e) => {
                setVoucherStatusFilter(e.target.value);
                setVoucherCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="redeemed">Redeemed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span className="results-count">
          {filteredVouchers.length} voucher{filteredVouchers.length !== 1 ? 's' : ''} found
          {isCompanyView && selectedSiteFilter === 'all' && ` across ${availableSites.length} sites`}
          {selectedVouchers.length > 0 && ` (${selectedVouchers.length} selected)`}
        </span>
      </div>

      {/* Voucher Table - matching user table styling */}
      <div className="voucher-table-outer">
        <table className="voucher-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectAllVouchers}
                  onChange={handleSelectAllVouchers}
                  title="Select all"
                />
              </th>
              <th>Voucher Code</th>
              <th>Type</th>
              <th>Policy</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Created</th>
              <th>Redeemed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVouchers.length > 0 ? (
              paginatedVouchers.map((voucher) => (
                <tr key={voucher.id} className={selectedVouchers.includes(voucher.id) ? 'selected' : ''}>
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedVouchers.includes(voucher.id)}
                      onChange={() => handleVoucherSelect(voucher.id)}
                    />
                  </td>
                  <td>
                    <div className="voucher-code-cell">
                      <code>{voucher.code}</code>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleCopyVoucherCode(voucher.code)}
                        title="Copy code"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="guest-type-badge">{getGuestTypeLabel(voucher.guestType)}</span>
                  </td>
                  <td className="policy-cell">{voucher.policyId?.split('_').slice(-4, -2).join(' ') || '-'}</td>
                  <td className="validity-cell">{voucher.validityHours}h</td>
                  <td>
                    <span className={`status-badge ${voucher.status === 'active' ? 'status-active' : voucher.status === 'redeemed' ? 'status-checkout' : 'status-expired'}`}>
                      {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                    </span>
                  </td>
                  <td className="date-cell">{formatDateTime(voucher.createdAt)}</td>
                  <td>{voucher.redeemedBy || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleViewVoucher(voucher)}
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-icon-sm info"
                        onClick={() => handlePrintSingleQR(voucher)}
                        title="Print QR Code"
                      >
                        <FaQrcode />
                      </button>
                      {voucher.status === 'active' && (
                        <button
                          className="btn-icon-sm warning"
                          onClick={() => handleDeactivateVoucher(voucher)}
                          title="Deactivate Voucher"
                        >
                          <FaTimesCircle />
                        </button>
                      )}
                      {voucher.status !== 'redeemed' && (
                        <button
                          className="btn-icon-sm danger"
                          onClick={() => handleDeleteVoucher(voucher)}
                          title="Delete Voucher"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty-state">
                  <FaTicketAlt />
                  <p>No vouchers found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredVouchers.length > 0 && (
        <div className="voucher-pagination-container">
          <Pagination
            currentPage={voucherCurrentPage}
            totalPages={voucherTotalPages}
            totalItems={filteredVouchers.length}
            rowsPerPage={voucherRowsPerPage}
            onPageChange={setVoucherCurrentPage}
            onRowsPerPageChange={(newValue) => {
              setVoucherRowsPerPage(newValue);
              setVoucherCurrentPage(1);
            }}
          />
        </div>
      )}
    </>
  );

  // Render activity log tab
  const renderActivityTab = () => (
    <div className="activity-log-section">
      {/* Activity Header */}
      <div className="activity-log-header">
        <div className="activity-header-left">
          <h3><FaHistory /> Recent Activity</h3>
          <span className="activity-count">{siteLogs.length} activities</span>
        </div>
        <div className="activity-header-right">
          <Button variant="secondary" size="small" onClick={() => showInfo('Export activity log - coming soon')}>
            <FaDownload style={{ marginRight: 6 }} /> Export Log
          </Button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="activity-timeline-container">
        {siteLogs.length > 0 ? (
          <div className="activity-timeline">
            {siteLogs.map((log, index) => (
              <div key={log.id} className="activity-timeline-item">
                <div className="activity-timeline-line">
                  <div className={`activity-timeline-dot ${log.action}`}>
                    {log.action === 'check_in' && <FaSignInAlt />}
                    {log.action === 'check_out' && <FaSignOutAlt />}
                    {log.action === 'access_extended' && <FaClock />}
                    {log.action === 'voucher_generated' && <FaTicketAlt />}
                    {log.action === 'session_started' && <FaWifi />}
                  </div>
                  {index < siteLogs.length - 1 && <div className="activity-connector" />}
                </div>
                <div className="activity-timeline-content">
                  <div className="activity-card">
                    <div className="activity-card-header">
                      <span className={`activity-action-badge ${log.action}`}>
                        {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="activity-timestamp">{formatDateTime(log.timestamp)}</span>
                    </div>
                    <div className="activity-card-body">
                      {log.guestName && (
                        <div className="activity-guest-info">
                          <FaUserFriends className="guest-icon" />
                          <span className="guest-name">{log.guestName}</span>
                        </div>
                      )}
                      <p className="activity-description">{log.details}</p>
                    </div>
                    <div className="activity-card-footer">
                      <span className="activity-performer">Performed by: <strong>{log.performedBy}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="activity-empty-state">
            <div className="empty-state-icon">
              <FaHistory />
            </div>
            <h4>No Activity Yet</h4>
            <p>Guest check-ins, check-outs, and other activities will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render analytics tab
  const renderAnalyticsTab = () => {
    const redemptionRate = siteStats.thisMonth.vouchersGenerated > 0
      ? Math.round((siteStats.thisMonth.vouchersRedeemed / siteStats.thisMonth.vouchersGenerated) * 100)
      : 0;

    return (
      <div className="analytics-dashboard">
        {/* Analytics Header */}
        <div className="analytics-header">
          <div className="analytics-header-left">
            <h3><FaChartBar /> Guest Analytics</h3>
            <span className="analytics-subtitle">Performance overview for {isCompanyView ? 'All Sites' : effectiveSiteName?.split(' - ').slice(1).join(' - ') || effectiveSiteName}</span>
          </div>
          <div className="analytics-header-right">
            <Button variant="secondary" size="small" onClick={() => showInfo('Export analytics - coming soon')}>
              <FaDownload style={{ marginRight: 6 }} /> Export Report
            </Button>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="analytics-summary-row">
          <div className="summary-stat-card">
            <div className="summary-stat-icon blue">
              <FaUsers />
            </div>
            <div className="summary-stat-content">
              <span className="summary-stat-value">{siteStats.thisMonth.totalGuests}</span>
              <span className="summary-stat-label">Total Guests This Month</span>
            </div>
            <div className="summary-stat-trend up">
              <FaArrowUp /> 12%
            </div>
          </div>
          <div className="summary-stat-card">
            <div className="summary-stat-icon green">
              <FaUserFriends />
            </div>
            <div className="summary-stat-content">
              <span className="summary-stat-value">{siteStats.thisMonth.uniqueVisitors}</span>
              <span className="summary-stat-label">Unique Visitors</span>
            </div>
            <div className="summary-stat-trend up">
              <FaArrowUp /> 8%
            </div>
          </div>
          <div className="summary-stat-card">
            <div className="summary-stat-icon purple">
              <FaClock />
            </div>
            <div className="summary-stat-content">
              <span className="summary-stat-value">{siteStats.thisMonth.avgDuration}</span>
              <span className="summary-stat-label">Avg Session Duration</span>
            </div>
          </div>
          <div className="summary-stat-card">
            <div className="summary-stat-icon orange">
              <FaWifi />
            </div>
            <div className="summary-stat-content">
              <span className="summary-stat-value">{siteStats.thisMonth.dataUsed}</span>
              <span className="summary-stat-label">Total Data Used</span>
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="analytics-main-grid">
          {/* This Week Card */}
          <div className="analytics-panel">
            <div className="panel-header">
              <h4><FaCalendarAlt /> This Week</h4>
            </div>
            <div className="panel-body">
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-value">{siteStats.thisWeek.totalGuests}</span>
                  <span className="metric-label">Total Guests</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{siteStats.thisWeek.uniqueVisitors}</span>
                  <span className="metric-label">Unique Visitors</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{siteStats.thisWeek.avgDuration}</span>
                  <span className="metric-label">Avg Duration</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{siteStats.thisWeek.dataUsed}</span>
                  <span className="metric-label">Data Used</span>
                </div>
              </div>
              <div className="metric-highlight">
                <span className="highlight-label">Peak Day</span>
                <span className="highlight-value">{siteStats.thisWeek.peakDay}</span>
              </div>
            </div>
          </div>

          {/* Voucher Statistics Panel */}
          <div className="analytics-panel">
            <div className="panel-header">
              <h4><FaTicketAlt /> Voucher Statistics</h4>
            </div>
            <div className="panel-body">
              <div className="voucher-stats-grid">
                <div className="voucher-stat-item generated">
                  <span className="voucher-stat-value">{siteStats.thisMonth.vouchersGenerated}</span>
                  <span className="voucher-stat-label">Generated</span>
                </div>
                <div className="voucher-stat-item redeemed">
                  <span className="voucher-stat-value">{siteStats.thisMonth.vouchersRedeemed}</span>
                  <span className="voucher-stat-label">Redeemed</span>
                </div>
                <div className="voucher-stat-item available">
                  <span className="voucher-stat-value">
                    {siteStats.thisMonth.vouchersGenerated - siteStats.thisMonth.vouchersRedeemed}
                  </span>
                  <span className="voucher-stat-label">Available</span>
                </div>
              </div>
              <div className="redemption-rate-bar">
                <div className="rate-header">
                  <span className="rate-label">Redemption Rate</span>
                  <span className="rate-value">{redemptionRate}%</span>
                </div>
                <div className="rate-bar-container">
                  <div className="rate-bar" style={{ width: `${redemptionRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Guests by Type Panel - Full Width */}
          <div className="analytics-panel full-width">
            <div className="panel-header">
              <h4><FaUserFriends /> Guests by Type (This Month)</h4>
              <span className="panel-subtitle">Distribution of guest types</span>
            </div>
            <div className="panel-body">
              <div className="guest-type-breakdown">
                {Object.entries(siteStats.byType || {}).length > 0 ? (
                  Object.entries(siteStats.byType).map(([type, count]) => {
                    const percentage = siteStats.thisMonth.totalGuests > 0
                      ? Math.round((count / siteStats.thisMonth.totalGuests) * 100)
                      : 0;
                    return (
                      <div key={type} className="type-breakdown-item">
                        <div className="type-info">
                          <span className="type-name">{getGuestTypeLabel(type)}</span>
                          <span className="type-stats">{count} guests ({percentage}%)</span>
                        </div>
                        <div className="type-progress-container">
                          <div className="type-progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data-message">
                    <p>No guest type data available for this period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="guest-management-container">
      {/* Page Title - Matching User Management Style */}
      <h1 className="guest-management-title">Guest Management</h1>

      {/* Company View Banner - Shows when viewing aggregated data */}
      {isCompanyView && (
        <div className="company-view-banner">
          <div className="banner-content">
            <FaInfoCircle className="banner-icon" />
            <div className="banner-text">
              <strong>Company View</strong>
              <span className="banner-hint">Viewing guest data across all sites. Select a site to manage guests.</span>
            </div>
          </div>
          <div className="banner-actions">
            <label htmlFor="guest-site-filter">Filter by Site:</label>
            <select
              id="guest-site-filter"
              className="site-selector"
              value={selectedSiteFilter}
              onChange={(e) => {
                setSelectedSiteFilter(e.target.value);
                setCurrentPage(1);
                setVoucherCurrentPage(1);
              }}
            >
              <option value="all">All Sites</option>
              {availableSites.map(site => (
                <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
              ))}
            </select>
            {selectedSiteFilter !== 'all' && (
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  const site = availableSites.find(s => s.siteId === selectedSiteFilter);
                  if (site) {
                    drillDownToSite(site.siteId, site.effectiveSiteName);
                  }
                }}
              >
                <FaMapMarkerAlt style={{ marginRight: 4 }} /> Switch to Site View
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Site View Indicator */}
      {isSiteView && isCompanyUser && (
        <div className="site-view-indicator">
          <div className="indicator-content">
            <FaMapMarkerAlt className="indicator-icon" />
            <span>Viewing: <strong>{effectiveSiteName}</strong></span>
          </div>
          <Button variant="outline" size="small" onClick={returnToCompanyView}>
            <FaBuilding style={{ marginRight: 4 }} /> Return to Company View
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Tabs */}
      <div className="guest-tabs">
        <button
          className={`tab-btn ${activeTab === 'guests' ? 'active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          <FaUserFriends /> Guests
        </button>
        <button
          className={`tab-btn ${activeTab === 'vouchers' ? 'active' : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          <FaTicketAlt /> Vouchers
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <FaHistory /> Activity Log
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FaChartBar /> Analytics
        </button>
      </div>

      
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'guests' && renderGuestsTab()}
        {activeTab === 'vouchers' && renderVouchersTab()}
        {activeTab === 'activity' && renderActivityTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>

      {/* Guest Details Modal */}
      {showGuestDetailsModal && selectedGuest && (
        <div className="modal-overlay" onClick={() => setShowGuestDetailsModal(false)}>
          <div className="modal guest-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Guest Details</h2>
              <button className="close-btn" onClick={() => setShowGuestDetailsModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="guest-details-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{selectedGuest.firstName} {selectedGuest.lastName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mobile</span>
                    <span className="detail-value">{selectedGuest.mobile}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedGuest.email || '-'}</span>
                  </div>
                  {selectedGuest.companyName && (
                    <div className="detail-row">
                      <span className="detail-label">Company</span>
                      <span className="detail-value">{selectedGuest.companyName}</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Access Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Guest Type</span>
                    <span className="detail-value">{getGuestTypeLabel(selectedGuest.guestType)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Access Code</span>
                    <span className="detail-value"><code>{selectedGuest.password}</code></span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${getStatusBadgeClass(selectedGuest.guestStatus)}`}>
                      {getStatusDisplay(selectedGuest.guestStatus)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Valid From</span>
                    <span className="detail-value">{formatDateTime(selectedGuest.validFrom)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Valid Until</span>
                    <span className="detail-value">{formatDateTime(selectedGuest.validUntil)}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Usage Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Data Used</span>
                    <span className="detail-value">{selectedGuest.usageTotalData}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sessions</span>
                    <span className="detail-value">{selectedGuest.usageSessions}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Devices</span>
                    <span className="detail-value">{selectedGuest.devicesCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Policy</span>
                    <span className="detail-value">{selectedGuest.speed} / {selectedGuest.dataVolume}</span>
                  </div>
                </div>

                {(selectedGuest.hostName || selectedGuest.hostResidentName) && (
                  <div className="detail-section">
                    <h3>Host Information</h3>
                    <div className="detail-row">
                      <span className="detail-label">Host Name</span>
                      <span className="detail-value">{selectedGuest.hostName || selectedGuest.hostResidentName}</span>
                    </div>
                    {selectedGuest.hostDepartment && (
                      <div className="detail-row">
                        <span className="detail-label">Department</span>
                        <span className="detail-value">{selectedGuest.hostDepartment}</span>
                      </div>
                    )}
                    {selectedGuest.purposeOfVisit && (
                      <div className="detail-row">
                        <span className="detail-label">Purpose</span>
                        <span className="detail-value">{selectedGuest.purposeOfVisit}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              {selectedGuest.guestStatus === GUEST_STATUS.PENDING && (
                <button className="btn btn-success" onClick={() => handleCheckIn(selectedGuest)}>
                  <FaSignInAlt /> Check In
                </button>
              )}
              {(selectedGuest.guestStatus === GUEST_STATUS.ACTIVE || selectedGuest.guestStatus === GUEST_STATUS.CHECKED_IN) && (
                <>
                  <button className="btn btn-warning" onClick={() => handleExtendAccess(selectedGuest)}>
                    <FaClock /> Extend Access
                  </button>
                  <button className="btn btn-danger" onClick={() => handleRevokeAccess(selectedGuest)}>
                    <FaTimesCircle /> Revoke Access
                  </button>
                </>
              )}
              <button className="btn btn-outline" onClick={() => setShowGuestDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setShowAddGuestModal(false)}>
          <div className="modal add-guest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPlus /> Add New Guest</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddGuestModal(false)}
                disabled={isSubmitting}
              >
                <FaTimesCircle />
              </button>
            </div>
            <form onSubmit={handleSubmitGuest}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={guestForm.firstName}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter first name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={guestForm.lastName}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter last name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={guestForm.mobile}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter mobile number"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={guestForm.email}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter email (optional)"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Guest Type</label>
                    <select
                      name="guestType"
                      value={guestForm.guestType}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select guest type</option>
                      {guestTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Access Duration</label>
                    <select
                      name="duration"
                      value={guestForm.duration}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    >
                      {Object.entries(GUEST_DURATION_PRESETS).map(([key, preset]) => (
                        <option key={key} value={key}>{preset.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Host / Sponsor</label>
                    <select
                      name="hostId"
                      value={guestForm.hostId}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      disabled={isSubmitting}
                    >
                      <option value="">Select host (optional)</option>
                      {registeredUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} - {user.username}
                        </option>
                      ))}
                      <option value="other">Others (Enter manually)</option>
                    </select>
                  </div>
                  {guestForm.hostId === 'other' && (
                    <div className="form-group">
                      <label className="form-label required">Host Name (Manual)</label>
                      <input
                        type="text"
                        name="hostOther"
                        value={guestForm.hostOther}
                        onChange={handleGuestFormChange}
                        className="form-input"
                        placeholder="Enter host/sponsor name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={guestForm.companyName}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter company name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Purpose of Visit</label>
                    <input
                      type="text"
                      name="purposeOfVisit"
                      value={guestForm.purposeOfVisit}
                      onChange={handleGuestFormChange}
                      className="form-input"
                      placeholder="Enter purpose of visit"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <FaPlus style={{ marginRight: 6 }} /> Add Guest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Vouchers Modal */}
      {showVoucherModal && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setShowVoucherModal(false)}>
          <div className="modal generate-voucher-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaTicketAlt /> Generate Vouchers</h2>
              <button
                className="close-btn"
                onClick={() => setShowVoucherModal(false)}
                disabled={isSubmitting}
              >
                <FaTimesCircle />
              </button>
            </div>
            <form onSubmit={handleSubmitVouchers}>
              <div className="modal-body">
                <div className="voucher-info-banner">
                  <FaQrcode className="banner-icon" />
                  <div className="banner-text">
                    <strong>Voucher Codes</strong>
                    <span>Generate unique access codes for guests. Each voucher can be used once.</span>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Number of Vouchers</label>
                    <input
                      type="number"
                      name="quantity"
                      value={voucherForm.quantity}
                      onChange={handleVoucherFormChange}
                      className="form-input"
                      min="1"
                      max="100"
                      required
                      disabled={isSubmitting}
                    />
                    <span className="form-hint">Max 100 vouchers at a time</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Guest Type</label>
                    <select
                      name="guestType"
                      value={voucherForm.guestType}
                      onChange={handleVoucherFormChange}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select guest type</option>
                      {guestTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Validity Duration</label>
                    <select
                      name="duration"
                      value={voucherForm.duration}
                      onChange={handleVoucherFormChange}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    >
                      {Object.entries(GUEST_DURATION_PRESETS).map(([key, preset]) => (
                        <option key={key} value={key}>{preset.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Code Prefix</label>
                    <input
                      type="text"
                      name="prefix"
                      value={voucherForm.prefix}
                      onChange={handleVoucherFormChange}
                      className="form-input"
                      placeholder="e.g., GV, GUEST"
                      maxLength="4"
                      disabled={isSubmitting}
                    />
                    <span className="form-hint">2-4 character prefix for voucher codes</span>
                  </div>
                </div>
                <div className="voucher-preview">
                  <span className="preview-label">Preview:</span>
                  <code className="preview-code">{voucherForm.prefix || 'GV'}-XXXXXXXX</code>
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <FaTicketAlt style={{ marginRight: 6 }} /> Generate {voucherForm.quantity} Voucher{voucherForm.quantity > 1 ? 's' : ''}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print QR Codes Modal - with customization options */}
      {showQRPrintModal && (
        <div className="modal-overlay" onClick={() => setShowQRPrintModal(false)}>
          <div className="modal qr-print-modal-enhanced" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPrint /> Print QR Codes</h2>
              <button className="close-btn" onClick={() => setShowQRPrintModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="qr-modal-layout">
                {/* Options Panel */}
                <div className="qr-options-panel">
                  <h4>Customization Options</h4>
                  <div className="qr-option-group">
                    <label>QR Code Size</label>
                    <select
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, size: Number(e.target.value) }))}
                      className="form-input"
                    >
                      <option value={150}>Small (150px)</option>
                      <option value={200}>Medium (200px)</option>
                      <option value={250}>Large (250px)</option>
                    </select>
                  </div>
                  <div className="qr-option-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={qrOptions.includeText}
                        onChange={(e) => setQrOptions(prev => ({ ...prev, includeText: e.target.checked }))}
                      />
                      Show voucher code
                    </label>
                  </div>
                  <div className="qr-option-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={qrOptions.includeType}
                        onChange={(e) => setQrOptions(prev => ({ ...prev, includeType: e.target.checked }))}
                      />
                      Show guest type
                    </label>
                  </div>
                  <div className="qr-option-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={qrOptions.includeValidity}
                        onChange={(e) => setQrOptions(prev => ({ ...prev, includeValidity: e.target.checked }))}
                      />
                      Show validity period
                    </label>
                  </div>
                  <div className="qr-option-group">
                    <label>Foreground Color</label>
                    <input
                      type="color"
                      value={qrOptions.foregroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      className="color-input"
                    />
                  </div>
                  <div className="qr-option-group">
                    <label>Background Color</label>
                    <input
                      type="color"
                      value={qrOptions.backgroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="color-input"
                    />
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="qr-preview-panel">
                  <h4>Preview ({qrPrintVouchers.length} voucher{qrPrintVouchers.length !== 1 ? 's' : ''})</h4>
                  <div className="qr-preview-scroll">
                    {qrPrintVouchers.slice(0, 4).map((voucher) => (
                      <div key={voucher.id} className="qr-preview-card-enhanced">
                        <div className="qr-code-preview" style={{ backgroundColor: qrOptions.backgroundColor }}>
                          <QRCodeSVG
                            value={generateQRData(voucher)}
                            size={Math.min(qrOptions.size, 120)}
                            bgColor={qrOptions.backgroundColor}
                            fgColor={qrOptions.foregroundColor}
                            level="M"
                          />
                        </div>
                        {qrOptions.includeText && (
                          <code className="qr-voucher-code">{voucher.code}</code>
                        )}
                        {qrOptions.includeType && (
                          <span className="qr-voucher-type">{getGuestTypeLabel(voucher.guestType)}</span>
                        )}
                        {qrOptions.includeValidity && (
                          <span className="qr-voucher-validity">{voucher.validityHours}h validity</span>
                        )}
                      </div>
                    ))}
                    {qrPrintVouchers.length > 4 && (
                      <div className="qr-more-indicator">
                        +{qrPrintVouchers.length - 4} more vouchers
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowQRPrintModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleExecutePrint}>
                <FaPrint style={{ marginRight: 6 }} /> Print {qrPrintVouchers.length} QR Code{qrPrintVouchers.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      <ConfirmationModal
        open={showRevokeConfirmation}
        onClose={handleCancelRevoke}
        onConfirm={handleConfirmRevoke}
        title="Revoke Guest Access"
        message={
          guestToRevoke
            ? `Are you sure you want to revoke access for "${guestToRevoke.firstName} ${guestToRevoke.lastName}"?\n\nThis will:\n• Immediately disconnect the guest from the network\n• Invalidate any active sessions\n• The guest will not be able to reconnect`
            : ''
        }
        confirmText="Revoke Access"
        cancelText="Cancel"
        variant="danger"
        loading={isRevoking}
      />

      {/* Extend Access Modal */}
      {showExtendAccessModal && guestToExtend && (
        <div className="modal-overlay" onClick={handleCancelExtend}>
          <div className="modal extend-access-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaClock style={{ marginRight: 8 }} /> Extend Guest Access</h2>
              <button
                className="modal-close-btn"
                onClick={handleCancelExtend}
                disabled={isExtending}
              >
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              <div className="extend-guest-info">
                <p><strong>Guest:</strong> {guestToExtend.firstName} {guestToExtend.lastName}</p>
                <p><strong>Current Expiry:</strong> {new Date(guestToExtend.validUntil).toLocaleString()}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Extend Duration By</label>
                <div className="duration-grid">
                  {Object.entries(GUEST_DURATION_PRESETS)
                    .filter(([key]) => key !== 'custom')
                    .map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        className={`duration-option ${extendDuration === key ? 'selected' : ''}`}
                        onClick={() => setExtendDuration(key)}
                        disabled={isExtending}
                      >
                        {value.label}
                      </button>
                    ))}
                </div>
              </div>
              <div className="extend-preview">
                <FaInfoCircle style={{ marginRight: 6, color: 'var(--color-accent)' }} />
                <span>
                  New expiry will be: {' '}
                  <strong>
                    {new Date(
                      new Date(guestToExtend.validUntil).getTime() +
                      (GUEST_DURATION_PRESETS[extendDuration]?.hours || 24) * 60 * 60 * 1000
                    ).toLocaleString()}
                  </strong>
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={handleCancelExtend} disabled={isExtending}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmExtend} disabled={isExtending}>
                {isExtending ? (
                  <>Processing...</>
                ) : (
                  <><FaClock style={{ marginRight: 6 }} /> Extend Access</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestManagement;
