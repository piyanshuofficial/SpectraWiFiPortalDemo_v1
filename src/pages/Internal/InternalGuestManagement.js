// src/pages/Internal/InternalGuestManagement.js

import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaUserFriends,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaChartBar,
  FaChartLine,
  FaWifi,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaCopy,
  FaHistory,
  FaPlus,
  FaPrint,
  FaQrcode,
  FaCog,
  FaFileExport,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import {
  guestUsers,
  guestStatistics,
  guestVouchers,
  guestAccessLogs,
} from '@constants/guestSampleData';
import { GUEST_STATUS, GUEST_ACCESS_TYPES, SEGMENT_LABELS, PAGINATION } from '@constants/appConstants';
import { showSuccess, showError, showInfo } from '@utils/notifications';
import { exportChartDataToCSV } from '@utils/exportUtils';
import Button from '@components/Button';
import Pagination from '@components/Pagination';
import './InternalGuestManagement.css';

const InternalGuestManagement = () => {
  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [expandedSite, setExpandedSite] = useState(null);

  // Site breakdown search and filter state
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const [siteSegmentFilter, setSiteSegmentFilter] = useState('all');

  // Pagination state for guests
  const [guestCurrentPage, setGuestCurrentPage] = useState(1);
  const [guestRowsPerPage, setGuestRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  // Pagination state for vouchers
  const [voucherCurrentPage, setVoucherCurrentPage] = useState(1);
  const [voucherRowsPerPage, setVoucherRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  // Selection state
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);

  // QR Print Modal state
  const [showQRPrintModal, setShowQRPrintModal] = useState(false);
  const [qrPrintData, setQrPrintData] = useState([]);
  const [qrPrintMode, setQrPrintMode] = useState('single'); // 'single' or 'bulk'

  // QR Customization options
  const [qrOptions, setQrOptions] = useState({
    size: 200,
    includeText: true,
    includeType: true,
    includeSite: true,
    includeValidity: true,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    errorCorrectionLevel: 'M',
  });

  // Add Guest Modal state
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestForm, setGuestForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    segment: 'enterprise',
    siteId: '',
    guestType: '',
    accessType: 'password',
    duration: '24h',
    hostName: '',
    companyName: '',
    purposeOfVisit: '',
  });

  // Site options based on segment
  const getSiteOptions = (segment) => {
    const siteMap = {
      enterprise: [
        { id: 'ent_site_1', name: 'TechCorp HQ - Mumbai' },
        { id: 'ent_site_2', name: 'TechCorp Campus - Bangalore' },
      ],
      hotel: [
        { id: 'hotel_site_1', name: 'Grand Hotel - Delhi' },
        { id: 'hotel_site_2', name: 'Seaside Resort - Goa' },
      ],
      coLiving: [
        { id: 'col_site_1', name: 'Urban Living - Pune' },
        { id: 'col_site_2', name: 'CoLive Spaces - Hyderabad' },
      ],
      pg: [
        { id: 'pg_site_1', name: 'Student PG - Chennai' },
        { id: 'pg_site_2', name: 'Premium PG - Bangalore' },
      ],
      coWorking: [
        { id: 'cow_site_1', name: 'WorkHub - Mumbai' },
        { id: 'cow_site_2', name: 'FlexSpace - Noida' },
      ],
    };
    return siteMap[segment] || [];
  };

  // Duration options
  const durationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '8h', label: '8 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '48h', label: '48 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  // Aggregate statistics across all sites
  const aggregateStats = useMemo(() => {
    const stats = {
      totalActiveGuests: 0,
      totalCheckedInToday: 0,
      totalPending: 0,
      totalDataUsedToday: 0,
      totalVouchersAvailable: 0,
      totalGuestsThisMonth: 0,
      bySite: {},
      bySegment: {},
    };

    Object.entries(guestStatistics).forEach(([siteId, siteStats]) => {
      stats.totalActiveGuests += siteStats.today?.activeGuests || 0;
      stats.totalCheckedInToday += siteStats.today?.checkedIn || 0;
      stats.totalPending += siteStats.today?.pending || 0;
      stats.totalGuestsThisMonth += siteStats.thisMonth?.totalGuests || 0;
      stats.totalVouchersAvailable += (siteStats.thisMonth?.vouchersGenerated || 0) - (siteStats.thisMonth?.vouchersRedeemed || 0);

      // Parse data used
      const dataUsed = siteStats.today?.dataUsed || '0 GB';
      const dataValue = parseFloat(dataUsed.replace(/[^\d.]/g, '')) || 0;
      if (dataUsed.includes('TB')) {
        stats.totalDataUsedToday += dataValue * 1024;
      } else {
        stats.totalDataUsedToday += dataValue;
      }

      stats.bySite[siteId] = siteStats;

      // Aggregate by segment
      const segment = siteStats.segment;
      if (!stats.bySegment[segment]) {
        stats.bySegment[segment] = {
          activeGuests: 0,
          totalGuests: 0,
          dataUsed: 0,
          sites: 0,
        };
      }
      stats.bySegment[segment].activeGuests += siteStats.today?.activeGuests || 0;
      stats.bySegment[segment].totalGuests += siteStats.thisMonth?.totalGuests || 0;
      stats.bySegment[segment].dataUsed += dataValue;
      stats.bySegment[segment].sites += 1;
    });

    return stats;
  }, []);

  // Filter sites for "Guest Access by Site" section
  const filteredSites = useMemo(() => {
    return Object.entries(guestStatistics).filter(([siteId, stats]) => {
      // Search filter - matches company/customer name or site name
      const matchesSearch = siteSearchQuery === '' ||
        stats.siteName?.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
        stats.customerName?.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
        stats.companyName?.toLowerCase().includes(siteSearchQuery.toLowerCase());

      // Segment filter
      const matchesSegment = siteSegmentFilter === 'all' || stats.segment === siteSegmentFilter;

      return matchesSearch && matchesSegment;
    });
  }, [siteSearchQuery, siteSegmentFilter]);

  // Export comprehensive report
  const handleExportReport = () => {
    // Create comprehensive report data
    const reportSections = [];

    // Section 1: Overview Summary
    reportSections.push(['GUEST ACCESS REPORT']);
    reportSections.push([`Generated: ${new Date().toLocaleString()}`]);
    reportSections.push([]);
    reportSections.push(['=== OVERVIEW SUMMARY ===']);
    reportSections.push(['Metric', 'Value']);
    reportSections.push(['Total Active Guests', aggregateStats.totalActiveGuests]);
    reportSections.push(['Checked In Today', aggregateStats.totalCheckedInToday]);
    reportSections.push(['Pending Check-in', aggregateStats.totalPending]);
    reportSections.push(['Data Used Today', aggregateStats.totalDataUsedToday >= 1024
      ? `${(aggregateStats.totalDataUsedToday / 1024).toFixed(1)} TB`
      : `${aggregateStats.totalDataUsedToday.toFixed(1)} GB`
    ]);
    reportSections.push(['Available Vouchers', aggregateStats.totalVouchersAvailable]);
    reportSections.push(['Guests This Month', aggregateStats.totalGuestsThisMonth]);
    reportSections.push([]);

    // Section 2: Segment Breakdown
    reportSections.push(['=== BY SEGMENT ===']);
    reportSections.push(['Segment', 'Active Guests', 'Total This Month', 'Data Used (GB)', 'Sites']);
    Object.entries(aggregateStats.bySegment).forEach(([segment, data]) => {
      reportSections.push([
        SEGMENT_LABELS[segment] || segment,
        data.activeGuests,
        data.totalGuests,
        data.dataUsed.toFixed(1),
        data.sites
      ]);
    });
    reportSections.push([]);

    // Section 3: Site-wise Breakdown
    reportSections.push(['=== BY SITE ===']);
    reportSections.push(['Site Name', 'Segment', 'Active Guests', 'Checked In Today', 'Checked Out Today', 'Pending', 'Data Used Today', 'Total This Month', 'Vouchers Redeemed']);
    Object.entries(guestStatistics).forEach(([siteId, stats]) => {
      reportSections.push([
        stats.siteName,
        SEGMENT_LABELS[stats.segment] || stats.segment,
        stats.today?.activeGuests || 0,
        stats.today?.checkedIn || 0,
        stats.today?.checkedOut || 0,
        stats.today?.pending || 0,
        stats.today?.dataUsed || '0 GB',
        stats.thisMonth?.totalGuests || 0,
        stats.thisMonth?.vouchersRedeemed || 0
      ]);
    });

    // Convert to CSV format
    const csvContent = reportSections.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    link.setAttribute('download', `Guest_Access_Report_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccess('Guest Access Report exported successfully');
  };

  // Get unique company names for filter dropdown
  const companyOptions = useMemo(() => {
    const companies = [...new Set(guestUsers.map(g => g.companyName).filter(Boolean))];
    return companies.sort();
  }, []);

  // Filter guests
  const filteredGuests = useMemo(() => {
    let guests = [...guestUsers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      guests = guests.filter(g =>
        g.firstName?.toLowerCase().includes(query) ||
        g.lastName?.toLowerCase().includes(query) ||
        g.mobile?.includes(query) ||
        g.siteName?.toLowerCase().includes(query) ||
        g.companyName?.toLowerCase().includes(query)
      );
    }

    if (segmentFilter !== 'all') {
      guests = guests.filter(g => g.segment === segmentFilter);
    }

    if (statusFilter !== 'all') {
      guests = guests.filter(g => g.guestStatus === statusFilter);
    }

    if (companyFilter !== 'all') {
      guests = guests.filter(g => g.companyName === companyFilter);
    }

    return guests;
  }, [searchQuery, segmentFilter, statusFilter, companyFilter]);

  // Paginated guests
  const paginatedGuests = useMemo(() => {
    const startIndex = (guestCurrentPage - 1) * guestRowsPerPage;
    return filteredGuests.slice(startIndex, startIndex + guestRowsPerPage);
  }, [filteredGuests, guestCurrentPage, guestRowsPerPage]);

  const guestTotalPages = Math.ceil(filteredGuests.length / guestRowsPerPage);

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    let vouchers = [...guestVouchers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      vouchers = vouchers.filter(v =>
        v.code?.toLowerCase().includes(query) ||
        v.siteName?.toLowerCase().includes(query)
      );
    }

    if (segmentFilter !== 'all') {
      vouchers = vouchers.filter(v => v.segment === segmentFilter);
    }

    return vouchers;
  }, [searchQuery, segmentFilter]);

  // Paginated vouchers
  const paginatedVouchers = useMemo(() => {
    const startIndex = (voucherCurrentPage - 1) * voucherRowsPerPage;
    return filteredVouchers.slice(startIndex, startIndex + voucherRowsPerPage);
  }, [filteredVouchers, voucherCurrentPage, voucherRowsPerPage]);

  const voucherTotalPages = Math.ceil(filteredVouchers.length / voucherRowsPerPage);

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
  const getGuestTypeLabel = (segment, typeId) => {
    const types = GUEST_ACCESS_TYPES[segment] || [];
    const type = types.find(t => t.id === typeId);
    return type?.label || typeId;
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

  // Handle copy voucher code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showSuccess(`Code "${code}" copied to clipboard`);
  };

  // Selection handlers for guests
  const handleGuestSelect = (guestId) => {
    setSelectedGuests(prev => {
      if (prev.includes(guestId)) {
        return prev.filter(id => id !== guestId);
      }
      return [...prev, guestId];
    });
  };

  const handleSelectAllGuests = () => {
    if (selectedGuests.length === paginatedGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(paginatedGuests.map(g => g.id));
    }
  };

  // Selection handlers for vouchers
  const handleVoucherSelect = (voucherId) => {
    setSelectedVouchers(prev => {
      if (prev.includes(voucherId)) {
        return prev.filter(id => id !== voucherId);
      }
      return [...prev, voucherId];
    });
  };

  const handleSelectAllVouchers = () => {
    if (selectedVouchers.length === paginatedVouchers.length) {
      setSelectedVouchers([]);
    } else {
      setSelectedVouchers(paginatedVouchers.map(v => v.id));
    }
  };

  // Print single QR code
  const handlePrintSingleQR = (item, type = 'voucher') => {
    const qrData = type === 'voucher' ? {
      code: item.code,
      type: getGuestTypeLabel(item.segment, item.guestType),
      site: item.siteName,
      validity: `${item.validityHours}h`,
      segment: SEGMENT_LABELS[item.segment] || item.segment,
    } : {
      code: item.password,
      type: getGuestTypeLabel(item.segment, item.guestType),
      site: item.siteName,
      validity: formatDateTime(item.validUntil),
      segment: SEGMENT_LABELS[item.segment] || item.segment,
      guestName: `${item.firstName} ${item.lastName}`,
    };

    setQrPrintData([qrData]);
    setQrPrintMode('single');
    setShowQRPrintModal(true);
  };

  // Print multiple QR codes
  const handlePrintBulkQR = () => {
    let dataTorint = [];

    if (activeTab === 'vouchers') {
      const vouchersToPrint = selectedVouchers.length > 0
        ? filteredVouchers.filter(v => selectedVouchers.includes(v.id))
        : filteredVouchers.filter(v => v.status === 'active');

      if (vouchersToPrint.length === 0) {
        showError('No active vouchers available to print');
        return;
      }

      dataTorint = vouchersToPrint.map(v => ({
        code: v.code,
        type: getGuestTypeLabel(v.segment, v.guestType),
        site: v.siteName,
        validity: `${v.validityHours}h`,
        segment: SEGMENT_LABELS[v.segment] || v.segment,
      }));
    } else if (activeTab === 'guests') {
      const guestsToPrint = selectedGuests.length > 0
        ? filteredGuests.filter(g => selectedGuests.includes(g.id))
        : filteredGuests.filter(g => g.guestStatus === GUEST_STATUS.ACTIVE || g.guestStatus === GUEST_STATUS.CHECKED_IN);

      if (guestsToPrint.length === 0) {
        showError('No active guests available to print');
        return;
      }

      dataTorint = guestsToPrint.map(g => ({
        code: g.password,
        type: getGuestTypeLabel(g.segment, g.guestType),
        site: g.siteName,
        validity: formatDateTime(g.validUntil),
        segment: SEGMENT_LABELS[g.segment] || g.segment,
        guestName: `${g.firstName} ${g.lastName}`,
      }));
    }

    setQrPrintData(dataTorint);
    setQrPrintMode('bulk');
    setShowQRPrintModal(true);
  };

  // Execute print
  const handleExecutePrint = () => {
    const printWindow = window.open('', '_blank');
    const qrCardsHtml = qrPrintData.map(item => `
      <div class="qr-card">
        <div class="qr-code-container">
          <img src="${generateQRDataURL(item.code)}" alt="QR Code" />
        </div>
        <div class="qr-info">
          <div class="qr-code-text">${item.code}</div>
          ${qrOptions.includeType ? `<div class="qr-type">${item.type}</div>` : ''}
          ${qrOptions.includeSite ? `<div class="qr-site">${item.site}</div>` : ''}
          ${qrOptions.includeValidity ? `<div class="qr-validity">Valid: ${item.validity}</div>` : ''}
          ${item.guestName ? `<div class="qr-guest">${item.guestName}</div>` : ''}
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Codes - Guest Access</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: #fff;
          }
          .print-header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #004aad;
          }
          .print-header h1 {
            color: #153874;
            font-size: 24px;
            margin-bottom: 4px;
          }
          .print-header p {
            color: #666;
            font-size: 12px;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(${qrPrintMode === 'single' ? '1' : '3'}, 1fr);
            gap: 20px;
            ${qrPrintMode === 'single' ? 'max-width: 300px; margin: 0 auto;' : ''}
          }
          .qr-card {
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            background: #fff;
            page-break-inside: avoid;
          }
          .qr-code-container {
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
          }
          .qr-code-container img {
            width: ${qrOptions.size}px;
            height: ${qrOptions.size}px;
          }
          .qr-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .qr-code-text {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            background: #f5f5f5;
            padding: 6px 12px;
            border-radius: 4px;
          }
          .qr-type {
            font-size: 12px;
            color: #004aad;
            font-weight: 600;
          }
          .qr-site {
            font-size: 11px;
            color: #666;
          }
          .qr-validity {
            font-size: 11px;
            color: #888;
          }
          .qr-guest {
            font-size: 12px;
            color: #333;
            font-weight: 500;
          }
          @media print {
            body { padding: 10px; }
            .qr-card { break-inside: avoid; }
            .print-header { margin-bottom: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Guest WiFi Access Codes</h1>
          <p>Generated: ${new Date().toLocaleDateString()} | Total: ${qrPrintData.length} code(s)</p>
        </div>
        <div class="qr-grid">
          ${qrCardsHtml}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setShowQRPrintModal(false);
    showSuccess(`Print initiated for ${qrPrintData.length} QR code(s)`);
  };

  // Generate QR code data URL using canvas
  const generateQRDataURL = (text) => {
    // Create a temporary canvas to render QR code
    const canvas = document.createElement('canvas');
    const size = qrOptions.size;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Use a simple QR-like pattern (actual QR will be rendered by component)
    // For print, we'll use the QRCodeSVG rendered to string
    const svgElement = document.querySelector(`[data-qr-value="${text}"]`);
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      return 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    // Fallback - just return the text encoded
    return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle">${text}</text></svg>`)}`;
  };

  // Export guests
  const handleExportGuests = () => {
    if (filteredGuests.length === 0) {
      showError('No guests to export');
      return;
    }

    const headers = ['Name', 'Company', 'Mobile', 'Segment', 'Site', 'Type', 'Access Code', 'Valid Until', 'Status', 'Data Used'];
    const rows = filteredGuests.map(g => [
      `${g.firstName} ${g.lastName}`,
      g.companyName || '-',
      g.mobile,
      SEGMENT_LABELS[g.segment] || g.segment,
      g.siteName,
      getGuestTypeLabel(g.segment, g.guestType),
      g.password,
      formatDateTime(g.validUntil),
      getStatusDisplay(g.guestStatus),
      g.usageTotalData
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    exportChartDataToCSV({ headers, rows }, `Guests_Export_${timestamp}.csv`);
    showSuccess(`Exported ${filteredGuests.length} guest(s) to CSV`);
  };

  // Export vouchers
  const handleExportVouchers = () => {
    if (filteredVouchers.length === 0) {
      showError('No vouchers to export');
      return;
    }

    const headers = ['Code', 'Segment', 'Site', 'Type', 'Validity', 'Status', 'Created', 'Redeemed By'];
    const rows = filteredVouchers.map(v => [
      v.code,
      SEGMENT_LABELS[v.segment] || v.segment,
      v.siteName,
      getGuestTypeLabel(v.segment, v.guestType),
      `${v.validityHours}h`,
      v.status,
      formatDateTime(v.createdAt),
      v.redeemedBy || '-'
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    exportChartDataToCSV({ headers, rows }, `Vouchers_Export_${timestamp}.csv`);
    showSuccess(`Exported ${filteredVouchers.length} voucher(s) to CSV`);
  };

  // Handle guest form change
  const handleGuestFormChange = (field, value) => {
    setGuestForm(prev => {
      const updated = { ...prev, [field]: value };
      // Reset site when segment changes
      if (field === 'segment') {
        updated.siteId = '';
        updated.guestType = '';
      }
      return updated;
    });
  };

  // Reset guest form
  const resetGuestForm = () => {
    setGuestForm({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      segment: 'enterprise',
      siteId: '',
      guestType: '',
      accessType: 'password',
      duration: '24h',
      hostName: '',
      companyName: '',
      purposeOfVisit: '',
    });
  };

  // Handle add guest submission
  const handleAddGuest = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!guestForm.firstName || !guestForm.lastName || !guestForm.mobile) {
      showError('Please fill in all required fields');
      return;
    }

    if (!guestForm.siteId) {
      showError('Please select a site');
      return;
    }

    if (!guestForm.guestType) {
      showError('Please select a guest type');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(`Guest ${guestForm.firstName} ${guestForm.lastName} added successfully!`);
      setShowAddGuestModal(false);
      resetGuestForm();
    } catch (error) {
      showError('Failed to add guest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get guest type options for selected segment
  const getGuestTypeOptions = (segment) => {
    return GUEST_ACCESS_TYPES[segment] || [];
  };

  // Render overview tab
  const renderOverviewTab = () => (
    <div className="overview-section">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon active">
            <FaUserFriends />
          </div>
          <div className="card-content">
            <span className="card-value">{aggregateStats.totalActiveGuests}</span>
            <span className="card-label">Active Guests</span>
            <span className="card-sublabel">Across all sites</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon checkin">
            <FaSignInAlt />
          </div>
          <div className="card-content">
            <span className="card-value">{aggregateStats.totalCheckedInToday}</span>
            <span className="card-label">Checked In Today</span>
            <span className="card-sublabel">All segments</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon pending">
            <FaClock />
          </div>
          <div className="card-content">
            <span className="card-value">{aggregateStats.totalPending}</span>
            <span className="card-label">Pending Check-in</span>
            <span className="card-sublabel">Awaiting arrival</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon data">
            <FaWifi />
          </div>
          <div className="card-content">
            <span className="card-value">
              {aggregateStats.totalDataUsedToday >= 1024
                ? `${(aggregateStats.totalDataUsedToday / 1024).toFixed(1)} TB`
                : `${aggregateStats.totalDataUsedToday.toFixed(1)} GB`
              }
            </span>
            <span className="card-label">Data Used Today</span>
            <span className="card-sublabel">Guest traffic</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon voucher">
            <FaTicketAlt />
          </div>
          <div className="card-content">
            <span className="card-value">{aggregateStats.totalVouchersAvailable}</span>
            <span className="card-label">Available Vouchers</span>
            <span className="card-sublabel">Ready to use</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon month">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <span className="card-value">{aggregateStats.totalGuestsThisMonth.toLocaleString()}</span>
            <span className="card-label">This Month</span>
            <span className="card-sublabel">Total guests</span>
          </div>
        </div>
      </div>

      {/* Segment Breakdown */}
      <div className="segment-breakdown">
        <h3><FaChartBar /> Guest Access by Segment</h3>
        <div className="segment-cards">
          {Object.entries(aggregateStats.bySegment).map(([segment, data]) => (
            <div key={segment} className="segment-card">
              <div className="segment-header">
                <span className={`segment-badge ${segment}`}>{SEGMENT_LABELS[segment] || segment}</span>
                <span className="site-count">{data.sites} sites</span>
              </div>
              <div className="segment-stats">
                <div className="segment-stat">
                  <span className="stat-value">{data.activeGuests}</span>
                  <span className="stat-label">Active Now</span>
                </div>
                <div className="segment-stat">
                  <span className="stat-value">{data.totalGuests.toLocaleString()}</span>
                  <span className="stat-label">This Month</span>
                </div>
                <div className="segment-stat">
                  <span className="stat-value">{data.dataUsed.toFixed(1)} GB</span>
                  <span className="stat-label">Data Today</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Site-wise Breakdown */}
      <div className="site-breakdown">
        <div className="site-breakdown-header">
          <h3><FaMapMarkerAlt /> Guest Access by Site</h3>
          <div className="site-breakdown-filters">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by company or site..."
                value={siteSearchQuery}
                onChange={(e) => setSiteSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-select-wrapper">
              <select
                value={siteSegmentFilter}
                onChange={(e) => setSiteSegmentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Segments</option>
                <option value="enterprise">Enterprise</option>
                <option value="hotel">Hotel</option>
                <option value="coLiving">Co-Living</option>
                <option value="pg">PG</option>
                <option value="coWorking">Co-Working</option>
              </select>
            </div>
          </div>
        </div>
        <div className="site-results-info">
          <span>{filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} found</span>
          {(siteSearchQuery || siteSegmentFilter !== 'all') && (
            <button
              className="btn-text-link"
              onClick={() => {
                setSiteSearchQuery('');
                setSiteSegmentFilter('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="site-list">
          {filteredSites.length === 0 ? (
            <div className="empty-sites-message">
              <FaMapMarkerAlt />
              <p>No sites found matching your criteria</p>
            </div>
          ) : filteredSites.map(([siteId, stats]) => (
            <div key={siteId} className="site-item">
              <div
                className="site-header"
                onClick={() => setExpandedSite(expandedSite === siteId ? null : siteId)}
              >
                <div className="site-info">
                  <span className={`segment-badge ${stats.segment}`}>{SEGMENT_LABELS[stats.segment]}</span>
                  <div className="site-name-wrapper">
                    <span className="site-name">{stats.siteName}</span>
                    {stats.customerName && (
                      <span className="site-company-name">{stats.customerName}</span>
                    )}
                  </div>
                </div>
                <div className="site-quick-stats">
                  <span className="quick-stat">
                    <FaUserFriends /> {stats.today?.activeGuests || 0} active
                  </span>
                  <span className="quick-stat">
                    <FaSignInAlt /> {stats.today?.checkedIn || 0} today
                  </span>
                  {expandedSite === siteId ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>

              {expandedSite === siteId && (
                <div className="site-details">
                  <div className="detail-grid">
                    <div className="detail-card">
                      <h4>Today</h4>
                      <div className="detail-stats">
                        <div className="detail-stat">
                          <span className="value">{stats.today?.totalGuests || 0}</span>
                          <span className="label">Total</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.today?.checkedIn || 0}</span>
                          <span className="label">Checked In</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.today?.checkedOut || 0}</span>
                          <span className="label">Checked Out</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.today?.dataUsed || '0 GB'}</span>
                          <span className="label">Data Used</span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-card">
                      <h4>This Month</h4>
                      <div className="detail-stats">
                        <div className="detail-stat">
                          <span className="value">{(stats.thisMonth?.totalGuests || 0).toLocaleString()}</span>
                          <span className="label">Total</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.thisMonth?.avgDuration || '-'}</span>
                          <span className="label">Avg Duration</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.thisMonth?.vouchersRedeemed || 0}</span>
                          <span className="label">Vouchers Used</span>
                        </div>
                        <div className="detail-stat">
                          <span className="value">{stats.thisMonth?.dataUsed || '0 GB'}</span>
                          <span className="label">Data Used</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {stats.byType && Object.keys(stats.byType).length > 0 && (
                    <div className="type-breakdown">
                      <h4>By Guest Type</h4>
                      <div className="type-bars">
                        {Object.entries(stats.byType).map(([type, count]) => (
                          <div key={type} className="type-bar-item">
                            <span className="type-name">{getGuestTypeLabel(stats.segment, type)}</span>
                            <div className="type-bar-container">
                              <div
                                className="type-bar"
                                style={{ width: `${(count / stats.thisMonth.totalGuests) * 100}%` }}
                              />
                            </div>
                            <span className="type-count">{count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render guests tab
  const renderGuestsTab = () => (
    <div className="guests-section">
      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="toolbar-left">
          <Button variant="primary" onClick={() => setShowAddGuestModal(true)}>
            <FaPlus style={{ marginRight: 6 }} /> Add Guest
          </Button>
          <Button variant="secondary" onClick={handlePrintBulkQR}>
            <FaPrint style={{ marginRight: 6 }} /> Print QR Codes
            {selectedGuests.length > 0 && <span className="btn-badge">{selectedGuests.length}</span>}
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
              placeholder="Search guests, company, sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-select-wrapper">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="hotel">Hotel</option>
              <option value="coLiving">Co-Living</option>
              <option value="pg">PG</option>
              <option value="coWorking">Co-Working</option>
            </select>
          </div>
          <div className="filter-select-wrapper">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Companies</option>
              {companyOptions.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <div className="filter-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value={GUEST_STATUS.ACTIVE}>Active</option>
              <option value={GUEST_STATUS.CHECKED_IN}>Checked In</option>
              <option value={GUEST_STATUS.PENDING}>Pending</option>
              <option value={GUEST_STATUS.CHECKED_OUT}>Checked Out</option>
              <option value={GUEST_STATUS.EXPIRED}>Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span className="results-count">
          {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''} found
          {selectedGuests.length > 0 && ` (${selectedGuests.length} selected)`}
        </span>
      </div>

      {/* Table */}
      <div className="guest-table-outer">
        <table className="guest-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedGuests.length === paginatedGuests.length && paginatedGuests.length > 0}
                  onChange={handleSelectAllGuests}
                  title="Select all"
                />
              </th>
              <th>Guest</th>
              <th>Company</th>
              <th>Segment</th>
              <th>Site</th>
              <th>Type</th>
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
                  <td className="company-cell">{guest.companyName || '-'}</td>
                  <td>
                    <span className={`segment-badge ${guest.segment}`}>
                      {SEGMENT_LABELS[guest.segment] || guest.segment}
                    </span>
                  </td>
                  <td className="site-cell">{guest.siteName}</td>
                  <td>
                    <span className="type-badge">{getGuestTypeLabel(guest.segment, guest.guestType)}</span>
                  </td>
                  <td>
                    <div className="access-code">
                      <code>{guest.password}</code>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleCopyCode(guest.password)}
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
                        title="Print QR Code"
                        onClick={() => handlePrintSingleQR(guest, 'guest')}
                      >
                        <FaQrcode />
                      </button>
                      <button className="btn-icon-sm" title="View details">
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="empty-state">
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
        <div className="pagination-container">
          <Pagination
            currentPage={guestCurrentPage}
            totalPages={guestTotalPages}
            totalItems={filteredGuests.length}
            rowsPerPage={guestRowsPerPage}
            onPageChange={setGuestCurrentPage}
            onRowsPerPageChange={(newValue) => {
              setGuestRowsPerPage(newValue);
              setGuestCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );

  // Render vouchers tab
  const renderVouchersTab = () => (
    <div className="vouchers-section">
      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="toolbar-left">
          <Button variant="primary" onClick={() => showInfo('Generate Vouchers - Feature coming soon')}>
            <FaPlus style={{ marginRight: 6 }} /> Generate Vouchers
          </Button>
          <Button variant="secondary" onClick={handlePrintBulkQR}>
            <FaPrint style={{ marginRight: 6 }} /> Print QR Codes
            {selectedVouchers.length > 0 && <span className="btn-badge">{selectedVouchers.length}</span>}
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
              placeholder="Search vouchers, sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-select-wrapper">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="hotel">Hotel</option>
              <option value="coLiving">Co-Living</option>
              <option value="pg">PG</option>
              <option value="coWorking">Co-Working</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span className="results-count">
          {filteredVouchers.length} voucher{filteredVouchers.length !== 1 ? 's' : ''} found
          {selectedVouchers.length > 0 && ` (${selectedVouchers.length} selected)`}
        </span>
      </div>

      {/* Table */}
      <div className="guest-table-outer">
        <table className="guest-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedVouchers.length === paginatedVouchers.length && paginatedVouchers.length > 0}
                  onChange={handleSelectAllVouchers}
                  title="Select all"
                />
              </th>
              <th>Code</th>
              <th>Segment</th>
              <th>Site</th>
              <th>Type</th>
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
                    <div className="access-code">
                      <code className="voucher-code">{voucher.code}</code>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleCopyCode(voucher.code)}
                        title="Copy code"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`segment-badge ${voucher.segment}`}>
                      {SEGMENT_LABELS[voucher.segment] || voucher.segment}
                    </span>
                  </td>
                  <td className="site-cell">{voucher.siteName}</td>
                  <td>
                    <span className="type-badge">{getGuestTypeLabel(voucher.segment, voucher.guestType)}</span>
                  </td>
                  <td>{voucher.validityHours}h</td>
                  <td>
                    <span className={`status-badge ${voucher.status === 'active' ? 'status-active' : voucher.status === 'redeemed' ? 'status-checkout' : 'status-expired'}`}>
                      {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDateTime(voucher.createdAt)}</td>
                  <td>{voucher.redeemedBy || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon-sm"
                        title="Print QR Code"
                        onClick={() => handlePrintSingleQR(voucher, 'voucher')}
                      >
                        <FaQrcode />
                      </button>
                      <button className="btn-icon-sm" title="View details">
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="empty-state">
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
        <div className="pagination-container">
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
    </div>
  );

  // Render activity tab
  const renderActivityTab = () => (
    <div className="activity-section">
      <div className="activity-list">
        {guestAccessLogs.map((log) => (
          <div key={log.id} className="activity-item">
            <div className={`activity-icon ${log.action}`}>
              {log.action === 'check_in' && <FaSignInAlt />}
              {log.action === 'check_out' && <FaSignOutAlt />}
              {log.action === 'access_extended' && <FaClock />}
              {log.action === 'voucher_generated' && <FaTicketAlt />}
              {log.action === 'session_started' && <FaWifi />}
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-action">
                  {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="activity-time">{formatDateTime(log.timestamp)}</span>
              </div>
              <div className="activity-meta">
                <span className={`segment-badge ${log.segment}`}>{SEGMENT_LABELS[log.segment]}</span>
                <span className="activity-site">{log.siteName}</span>
              </div>
              {log.guestName && <span className="activity-guest">{log.guestName}</span>}
              <span className="activity-details">{log.details}</span>
              <span className="activity-by">By: {log.performedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="internal-guest-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaUserFriends className="page-title-icon" /> Guest Access Management
            </h1>
            <p className="page-subtitle">Monitor and manage guest access across all sites and segments</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={handleExportReport}>
              <FaDownload /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="page-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'guests' ? 'active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          <FaUserFriends /> All Guests
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
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'guests' && renderGuestsTab()}
        {activeTab === 'vouchers' && renderVouchersTab()}
        {activeTab === 'activity' && renderActivityTab()}
      </div>

      {/* QR Print Modal */}
      {showQRPrintModal && (
        <div className="modal-overlay" onClick={() => setShowQRPrintModal(false)}>
          <div className="qr-print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPrint /> Print QR Code{qrPrintData.length > 1 ? 's' : ''}</h2>
              <button className="close-btn" onClick={() => setShowQRPrintModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-body">
              {/* QR Customization Options */}
              <div className="qr-options-panel">
                <h4><FaCog /> Customization Options</h4>
                <div className="qr-options-grid">
                  <div className="option-group">
                    <label>QR Size</label>
                    <select
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions({ ...qrOptions, size: parseInt(e.target.value) })}
                    >
                      <option value={120}>Small (120px)</option>
                      <option value={160}>Medium (160px)</option>
                      <option value={200}>Large (200px)</option>
                      <option value={250}>Extra Large (250px)</option>
                    </select>
                  </div>
                  <div className="option-group">
                    <label>Error Correction</label>
                    <select
                      value={qrOptions.errorCorrectionLevel}
                      onChange={(e) => setQrOptions({ ...qrOptions, errorCorrectionLevel: e.target.value })}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                  <div className="option-group checkbox-options">
                    <label>
                      <input
                        type="checkbox"
                        checked={qrOptions.includeText}
                        onChange={(e) => setQrOptions({ ...qrOptions, includeText: e.target.checked })}
                      />
                      Show access code
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={qrOptions.includeType}
                        onChange={(e) => setQrOptions({ ...qrOptions, includeType: e.target.checked })}
                      />
                      Show guest type
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={qrOptions.includeSite}
                        onChange={(e) => setQrOptions({ ...qrOptions, includeSite: e.target.checked })}
                      />
                      Show site name
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={qrOptions.includeValidity}
                        onChange={(e) => setQrOptions({ ...qrOptions, includeValidity: e.target.checked })}
                      />
                      Show validity
                    </label>
                  </div>
                </div>
              </div>

              {/* QR Preview */}
              <div className="qr-preview-section">
                <h4>Preview ({qrPrintData.length} QR Code{qrPrintData.length > 1 ? 's' : ''})</h4>
                <div className={`qr-preview-grid ${qrPrintMode === 'single' ? 'single' : 'bulk'}`}>
                  {qrPrintData.slice(0, qrPrintMode === 'single' ? 1 : 6).map((item, index) => (
                    <div key={index} className="qr-preview-card">
                      <div className="qr-code-wrapper">
                        <QRCodeSVG
                          value={item.code}
                          size={qrOptions.size}
                          level={qrOptions.errorCorrectionLevel}
                          bgColor={qrOptions.backgroundColor}
                          fgColor={qrOptions.foregroundColor}
                          data-qr-value={item.code}
                        />
                      </div>
                      <div className="qr-card-info">
                        {qrOptions.includeText && (
                          <div className="qr-code-text">{item.code}</div>
                        )}
                        {qrOptions.includeType && (
                          <div className="qr-type-text">{item.type}</div>
                        )}
                        {qrOptions.includeSite && (
                          <div className="qr-site-text">{item.site}</div>
                        )}
                        {qrOptions.includeValidity && (
                          <div className="qr-validity-text">Valid: {item.validity}</div>
                        )}
                        {item.guestName && (
                          <div className="qr-guest-text">{item.guestName}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {qrPrintMode === 'bulk' && qrPrintData.length > 6 && (
                    <div className="qr-more-indicator">
                      +{qrPrintData.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowQRPrintModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleExecutePrint}>
                <FaPrint style={{ marginRight: 6 }} /> Print {qrPrintData.length} QR Code{qrPrintData.length > 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="modal-overlay" onClick={() => setShowAddGuestModal(false)}>
          <div className="add-guest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPlus /> Add New Guest</h2>
              <button className="close-btn" onClick={() => setShowAddGuestModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <form onSubmit={handleAddGuest}>
              <div className="modal-body">
                {/* Personal Information */}
                <div className="form-section">
                  <h4>Personal Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={guestForm.firstName}
                        onChange={(e) => handleGuestFormChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={guestForm.lastName}
                        onChange={(e) => handleGuestFormChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Mobile Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        value={guestForm.mobile}
                        onChange={(e) => handleGuestFormChange('mobile', e.target.value)}
                        placeholder="Enter mobile number"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={guestForm.email}
                        onChange={(e) => handleGuestFormChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Access Configuration */}
                <div className="form-section">
                  <h4>Access Configuration</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Segment <span className="required">*</span></label>
                      <select
                        value={guestForm.segment}
                        onChange={(e) => handleGuestFormChange('segment', e.target.value)}
                        required
                      >
                        <option value="enterprise">Enterprise</option>
                        <option value="hotel">Hotel</option>
                        <option value="coLiving">Co-Living</option>
                        <option value="pg">PG</option>
                        <option value="coWorking">Co-Working</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Site <span className="required">*</span></label>
                      <select
                        value={guestForm.siteId}
                        onChange={(e) => handleGuestFormChange('siteId', e.target.value)}
                        required
                      >
                        <option value="">Select site</option>
                        {getSiteOptions(guestForm.segment).map(site => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Guest Type <span className="required">*</span></label>
                      <select
                        value={guestForm.guestType}
                        onChange={(e) => handleGuestFormChange('guestType', e.target.value)}
                        required
                      >
                        <option value="">Select guest type</option>
                        {getGuestTypeOptions(guestForm.segment).map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Access Duration</label>
                      <select
                        value={guestForm.duration}
                        onChange={(e) => handleGuestFormChange('duration', e.target.value)}
                      >
                        {durationOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Access Type</label>
                      <select
                        value={guestForm.accessType}
                        onChange={(e) => handleGuestFormChange('accessType', e.target.value)}
                      >
                        <option value="password">Password</option>
                        <option value="voucher">Voucher</option>
                        <option value="otp">OTP</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="form-section">
                  <h4>Additional Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Host Name</label>
                      <input
                        type="text"
                        value={guestForm.hostName}
                        onChange={(e) => handleGuestFormChange('hostName', e.target.value)}
                        placeholder="Name of host/contact person"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        value={guestForm.companyName}
                        onChange={(e) => handleGuestFormChange('companyName', e.target.value)}
                        placeholder="Guest's company"
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Purpose of Visit</label>
                    <textarea
                      value={guestForm.purposeOfVisit}
                      onChange={(e) => handleGuestFormChange('purposeOfVisit', e.target.value)}
                      placeholder="Brief description of visit purpose"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddGuestModal(false);
                    resetGuestForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Guest'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalGuestManagement;
