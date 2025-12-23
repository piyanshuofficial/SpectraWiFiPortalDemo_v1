# SpectraOne Portal - Wi-Fi Management Platform

A comprehensive, segment-aware Wi-Fi and network management platform built with React. This portal provides enterprise-grade network management, device assignment, analytics, user policies, and reporting tailored to different business segments.

**Version:** 4.0
**Last Updated:** December 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Business Segments](#business-segments)
3. [Portal Architecture](#portal-architecture)
4. [Key Features](#key-features)
5. [User Roles & Access Control](#user-roles--access-control)
6. [Technologies Used](#technologies-used)
7. [Project Structure](#project-structure)
8. [Getting Started](#getting-started)
9. [Development Guidelines](#development-guidelines)
10. [Design System](#design-system)
11. [Documentation](#documentation)
12. [Browser Support](#browser-support)
13. [Build & Deployment](#build--deployment)

---

## Overview

SpectraOne is a dual-portal platform for managing Spectra's Managed Wi-Fi services:

- **Customer Portal** (`customer.spectraone.com`): Self-service Wi-Fi network management for enterprise customers
- **Internal Portal** (`internal.spectraone.com`): Platform operations and support for Spectra staff

The platform supports multi-tenant architecture with segment-specific experiences, role-based access control, and hierarchical access levels (Company > City > Cluster > Site).

---

## Business Segments

The platform supports 7 business segments with tailored experiences:

| Segment | Description | Key Features |
|---------|-------------|--------------|
| **Enterprise** | Corporate environments | Department policies, compliance reporting, bulk user management |
| **Office** | Office/workspace deployments | Team-based management, meeting room access |
| **Co-Living** | Residential co-living spaces | Resident onboarding, tiered internet plans, occupancy management |
| **Co-Working** | Shared workspace facilities | Member management, day passes, flexible bandwidth plans |
| **Hotel** | Hospitality properties | Guest WiFi access, PMS integration, automatic check-out |
| **PG (Paying Guest)** | Paying guest accommodations | Tenant management, cost-effective plans, fair bandwidth distribution |
| **Miscellaneous** | General deployments | Standard WiFi management for other use cases |

### Segment-Aware Features
- Automatic content adaptation based on current business segment
- Tailored terminology (Users/Residents/Guests/Members/Tenants)
- Segment-specific workflows, policies, and constraints
- Seamless segment switching with instant UI updates

---

## Portal Architecture

### Customer Portal Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Main analytics dashboard with metrics overview |
| `/users` | User Management | User provisioning, status management, bulk operations |
| `/devices` | Device Management | Device registration, MAC validation, vendor lookup |
| `/guests` | Guest Management | Guest access, voucher generation, QR codes |
| `/reports` | Reports | Report generation with export (CSV, PDF, Excel) |
| `/knowledge` | Knowledge Center | Segment-aware documentation, videos, FAQs |
| `/logs` | Activity Logs | User activity tracking and audit trails |
| `/support` | Help & Support | Support chatbot, ticket creation, contact info |

### Internal Portal Routes

| Route | Page | Description |
|-------|------|-------------|
| `/internal/dashboard` | Internal Dashboard | Platform-wide monitoring and metrics |
| `/internal/sites` | Site Management | Site configuration, network settings |
| `/internal/provisioning` | Provisioning Queue | Site provisioning workflow |
| `/internal/customers` | Customer Management | Customer accounts, site assignments |
| `/internal/guests` | Guest Access | Cross-customer guest management |
| `/internal/reports` | Internal Reports | Platform analytics and business reports |
| `/internal/support` | Support Queue | Ticket management, SLA tracking |
| `/internal/alerts` | Alerts | System alerts, segment-aware notifications |
| `/internal/bulk-operations` | Bulk Operations | Bulk user/device operations, scheduled tasks |
| `/internal/logs` | Audit Logs | Comprehensive audit trail |
| `/internal/config` | System Configuration | Platform settings, policies, domains |
| `/internal/knowledge` | Internal KB | Internal documentation and procedures |

---

## Key Features

### Dashboard & Analytics
- Real-time metrics visualization with Chart.js
- Company-level and site-level dashboards
- License utilization tracking (bar and ring visualizations)
- Export dashboard data (CSV, PDF)
- Access level-aware data aggregation

### User Management
- Full user lifecycle management (CRUD operations)
- Status management: Active, Suspended, Blocked, Expired
- Bulk user operations via CSV import/export
- User details modal with comprehensive information
- Segment-specific user policies and licensing
- Scheduled user actions (status changes, policy updates)

### Device Management
- MAC address validation with OUI vendor lookup
- Segment-specific device type restrictions
- Device limits per user based on policy
- Bulk device registration and operations
- Device connection history tracking

### Guest Management
- Guest voucher generation with QR codes
- Configurable access duration and bandwidth
- Guest check-in/check-out workflows
- Guest activity logging
- Hotel/PG/Co-Living specific guest workflows

### Reports & Export
- 20+ report types with sample data preview
- Multiple export formats: CSV, Excel (.xlsx), PDF
- Report criteria filtering (date range, status, segment)
- Background export for large datasets
- Automated filename conventions

### Knowledge Center
- Segment-specific articles (10-24 per segment)
- Video tutorials (6 per segment)
- FAQ sections with search
- Quick start guides
- Image lightbox for screenshots

### Spectra Genie (AI Assistant)
- Context-aware support chatbot
- Segment-specific knowledge base
- Quick action suggestions
- Escalation to human support

### Bulk Operations (Internal Portal)
- Bulk User Registration
- Bulk Device Registration
- Bulk Status Change
- Bulk Policy Change
- Bulk Device Rename
- Bulk Resend Password
- Scheduled Tasks Panel

### Site Provisioning
- Multi-step provisioning wizard
- Draft save/resume functionality
- SSID configuration
- Policy assignment
- Network settings

---

## User Roles & Access Control

### Customer Portal Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Super Admin** | Company-level administrator | Full access to all sites, policy management, user delegation |
| **Admin** | Site-level administrator | Site management, user provisioning, device registration |
| **Manager** | Operations manager | User management, reporting, guest access |
| **Network Admin** | Network administrator | Device management, policy configuration, troubleshooting |
| **User** | Standard user | Self-service device registration, profile management |

### Internal Portal Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Super Admin** | Platform administrator | Full platform access, bulk operations, system config |
| **Operations** | Operations team | Site management, customer management, alerts |
| **Deployment Engineer** | Field engineer | Site provisioning, network configuration |
| **Support** | Support engineer | Ticket management, customer assistance |
| **Sales** | Account manager | Customer reports, usage analytics |
| **Viewer** | Read-only access | Dashboard viewing, report access |

### Access Level Hierarchy

```
Company Level (All sites across company)
    └── City Level (All sites in a city)
        └── Cluster Level (Group of related sites)
            └── Site Level (Individual location)
```

---

## Technologies Used

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 18.x |
| **Language** | JavaScript (ES6+) | - |
| **Routing** | React Router | 6.x |
| **State Management** | React Context + Hooks | - |
| **Charts** | Chart.js + react-chartjs-2 | 4.x |
| **Icons** | React Icons | 4.x |
| **Notifications** | React Toastify | - |
| **Styling** | CSS Modules + CSS Variables | - |
| **Build Tool** | Create React App / Webpack | 5.x |
| **Package Manager** | npm | 9.x |

### Key Libraries
- `date-fns` - Date manipulation
- `jspdf` + `jspdf-autotable` - PDF generation
- `xlsx` - Excel export
- `file-saver` - File downloads
- `prop-types` - Runtime type checking

---

## Project Structure

```
portal-frontend/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       └── videos/
│           ├── enterprise/          # 6 videos per segment
│           ├── office/
│           ├── coLiving/
│           ├── coWorking/
│           ├── hotel/
│           ├── pg/
│           └── miscellaneous/
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Generic components
│   │   │   ├── ChartContainer.js
│   │   │   ├── UserLicenseBar.js
│   │   │   ├── UserLicenseRing.js
│   │   │   └── ReportTable.js
│   │   ├── Loading/                 # Loading states
│   │   │   ├── LoadingOverlay.js
│   │   │   ├── Spinner.js
│   │   │   ├── SkeletonLoader.js
│   │   │   └── PageLoadingSkeleton.js
│   │   ├── Reports/                 # Report components
│   │   │   ├── DateRangePicker.js
│   │   │   ├── MonthRangePicker.js
│   │   │   ├── ReportCriteriaForm.js
│   │   │   ├── ReportCriteriaModal.js
│   │   │   ├── GenericReportRenderer.js
│   │   │   └── CriteriaDisplay.js
│   │   ├── RecentActivities/
│   │   ├── SupportChatbot/          # Spectra Genie
│   │   ├── SitesOverview/
│   │   ├── ScheduleModal/
│   │   ├── BulkOperationCard/
│   │   ├── UserActionScheduleButton/
│   │   ├── SearchableSelect/
│   │   ├── SSIDConfigSection/
│   │   ├── TopupConfigSection/
│   │   ├── PolicySelectionTable/
│   │   ├── SiteProvisioningModal/
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── FooterBar.js
│   │   ├── AppLayout.js
│   │   ├── Modal.js
│   │   ├── Card.js
│   │   ├── Button.js
│   │   ├── Badge.js
│   │   ├── Pagination.js
│   │   ├── SegmentSelector.js
│   │   ├── RoleAccessSelector.js
│   │   ├── ConfirmationModal.js
│   │   ├── DeviceFormModal.js
│   │   ├── PolicyModal.js
│   │   ├── BulkImportModal.js
│   │   ├── CustomerViewModal.js
│   │   ├── CustomerViewBanner.js
│   │   ├── KnowledgeArticleModal.js
│   │   ├── ImageLightbox.js
│   │   ├── VideoPlayer.js
│   │   ├── ExportProgress.js
│   │   ├── ErrorBoundary.js
│   │   └── RouteLoader.js
│   ├── pages/                       # Page components
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── ForgotDetails.js
│   │   ├── Dashboard.js
│   │   ├── UserManagement/
│   │   │   ├── UserList.js
│   │   │   ├── UserFormModal.js
│   │   │   ├── UserDetailsModal.js
│   │   │   └── UserToolbar.js
│   │   ├── DeviceManagement/
│   │   │   ├── DeviceList.js
│   │   │   └── DeviceToolbar.js
│   │   ├── GuestManagement/
│   │   │   ├── GuestManagement.js
│   │   │   └── index.js
│   │   ├── Reports/
│   │   │   └── ReportDashboard.js
│   │   ├── KnowledgeCenter/
│   │   │   └── KnowledgeHome.js
│   │   ├── ActivityLogs/
│   │   │   └── ActivityLogs.js
│   │   ├── Support/
│   │   │   └── Support.js
│   │   └── Internal/                # Internal Portal pages
│   │       ├── InternalDashboard.js
│   │       ├── SiteManagement.js
│   │       ├── CustomerManagement.js
│   │       ├── InternalGuestManagement.js
│   │       ├── InternalReports.js
│   │       ├── InternalSupport.js
│   │       ├── InternalAlerts.js
│   │       ├── AuditLogs.js
│   │       ├── SystemConfiguration.js
│   │       ├── InternalKnowledgeCenter.js
│   │       ├── SiteProvisioningQueue.js
│   │       ├── RolesRightsManagement.js
│   │       └── BulkOperations/
│   │           ├── BulkOperations.js
│   │           ├── BulkUserRegistration.js
│   │           ├── BulkDeviceRegistration.js
│   │           ├── BulkStatusChange.js
│   │           ├── BulkPolicyChange.js
│   │           ├── BulkDeviceRename.js
│   │           ├── BulkResendPassword.js
│   │           ├── ScheduledTasksPanel.js
│   │           └── index.js
│   ├── config/                      # Configuration files
│   │   ├── routes.js                # Route definitions
│   │   ├── chartConfig.js           # Chart.js configurations
│   │   ├── siteConfig.js            # Site configurations
│   │   ├── policyConfig.js          # Policy definitions
│   │   ├── reportDefinitions.js     # Report type definitions
│   │   ├── masterReportConfig.js    # Master report configurations
│   │   ├── segmentFieldConfig.js    # Segment-specific fields
│   │   ├── segmentDeviceConfig.js   # Device constraints by segment
│   │   ├── segmentPermissionsConfig.js
│   │   └── bulkOperationsConfig.js
│   ├── constants/                   # Application constants
│   │   ├── appConstants.js          # App-wide constants
│   │   ├── colorConstants.js        # Color definitions
│   │   ├── remScale.js              # Typography scale
│   │   ├── shortcutColors.js        # Quick action colors
│   │   ├── activityTypes.js         # Activity log types
│   │   ├── knowledgeArticles.js     # KB articles by segment
│   │   ├── internalKnowledgeData.js # Internal KB content
│   │   ├── chatbotKnowledge.js      # Spectra Genie knowledge
│   │   ├── userSampleData.js        # Sample user data
│   │   ├── guestSampleData.js       # Sample guest data
│   │   ├── reportSampleData.js      # Sample report data
│   │   ├── enhancedSampleReports.js # Enhanced report samples
│   │   ├── companySampleData.js     # Company data
│   │   ├── segmentCompanyData.js    # Segment-specific companies
│   │   ├── internalPortalData.js    # Internal portal data
│   │   └── siteProvisioningConfig.js
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.js           # Authentication state
│   │   ├── UserContext.js           # User data
│   │   ├── SegmentContext.js        # Current segment
│   │   ├── ThemeContext.js          # Theme preferences
│   │   ├── LoadingContext.js        # Global loading state
│   │   ├── AccessLevelViewContext.js # Access level state
│   │   ├── CustomerViewContext.js   # Customer view mode
│   │   └── ScheduledTasksContext.js # Scheduled tasks
│   ├── hooks/                       # Custom React hooks
│   │   ├── usePermissions.js        # Permission checks
│   │   ├── useSiteConfig.js         # Site configuration
│   │   ├── useFilter.js             # Filter state management
│   │   ├── useSort.js               # Sort state management
│   │   ├── useTableState.js         # Table pagination/state
│   │   ├── useDebounce.js           # Debounced values
│   │   ├── useVirtualScroll.js      # Virtual scrolling
│   │   ├── useBulkOperations.js     # Bulk operations state
│   │   ├── useScheduledTasks.js     # Scheduled tasks
│   │   ├── useReadOnlyMode.js       # Viewer mode detection
│   │   ├── useVideoDurations.js     # Video metadata
│   │   ├── useRecentActivities.js   # Activity log hook
│   │   ├── useSegmentActivities.js  # Segment activities
│   │   ├── useSegmentCompanyData.js # Company data by segment
│   │   ├── useSiteProvisioningDraft.js # Draft persistence
│   │   └── index.js                 # Hook exports
│   ├── utils/                       # Utility functions
│   │   ├── accessLevels.js          # Permission definitions
│   │   ├── exportUtils.js           # CSV/Excel export
│   │   ├── exportReportPDF.js       # PDF generation
│   │   ├── exportConstants.js       # Export configurations
│   │   ├── generateChartImage.js    # Chart to image
│   │   ├── notifications.js         # Toast notifications
│   │   ├── validationUtils.js       # Form validation
│   │   ├── licenseUtils.js          # License calculations
│   │   ├── reportDataGenerator.js   # Report data generation
│   │   ├── commonChartOptions.js    # Shared chart options
│   │   └── columns.js               # Table column definitions
│   ├── assets/                      # Static assets
│   │   ├── images/
│   │   └── Document/                # Documentation
│   │       ├── SpectraOne Portal - Functional Requirements Document v4.md
│   │       └── SpectraOne Portal - User Role Definitions v4.md
│   ├── styles/                      # Global styles
│   │   └── toastify-overrides.css
│   ├── App.js                       # Main application component
│   ├── App.css                      # Global application styles
│   ├── index.js                     # Application entry point
│   └── CLAUDE.md                    # AI assistant context
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 14+ and npm 9+
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd portal-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run development server at localhost:3000 |
| `npm test` | Launch test runner in watch mode |
| `npm run build` | Create optimized production build |
| `npm run eject` | Eject from Create React App (irreversible) |

---

## Development Guidelines

### Adding Segment-Specific Content

```javascript
import { useSegment } from '../context/SegmentContext';
import { SEGMENTS } from '../constants/segments';

const MyComponent = () => {
  const { currentSegment } = useSegment();

  const segmentData = useMemo(() => ({
    [SEGMENTS.ENTERPRISE]: { ... },
    [SEGMENTS.CO_LIVING]: { ... },
    [SEGMENTS.HOTEL]: { ... },
    [SEGMENTS.CO_WORKING]: { ... },
    [SEGMENTS.PG]: { ... },
    [SEGMENTS.OFFICE]: { ... },
    [SEGMENTS.MISCELLANEOUS]: { ... }
  }), []);

  const data = segmentData[currentSegment] || segmentData[SEGMENTS.MISCELLANEOUS];

  return <div>{/* Use segment-specific data */}</div>;
};
```

### Permission Checks

```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const {
    canEditUsers,
    canManageDevices,
    canAccessInternalPortal,
    isReadOnly
  } = usePermissions();

  if (!canEditUsers) {
    return <AccessDenied />;
  }

  return <div>{/* Protected content */}</div>;
};
```

### Adding Knowledge Center Videos

1. Create video content (MP4 format, H.264/AAC codec)
2. Export at 720p or 1080p (16:9 aspect ratio)
3. Name according to uniform topics:
   - `getting-started.mp4`
   - `user-management.mp4`
   - `device-registration.mp4`
   - `policy-setup.mp4`
   - `reports.mp4`
   - `troubleshooting.mp4`
4. Place in: `public/assets/videos/{segment}/`

### Coding Standards

- Use arrow functions and functional components
- Implement prop-types for type checking
- Centralize constants and configurations
- Use CSS variables for theming
- Follow responsive design patterns
- Implement lazy loading for routes
- Use custom hooks for reusable logic
- Keep components modular and composable

### Toast Notifications

```javascript
import { showSuccess, showError, showWarning, showInfo } from '../utils/notifications';

// Success (auto-dismiss: 2.5s)
showSuccess('User created successfully');

// Error (auto-dismiss: 4s)
showError('Failed to save changes');

// Warning (auto-dismiss: 3.5s)
showWarning('Session expiring soon');

// Info (auto-dismiss: 3s)
showInfo('New features available');
```

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Blue** | `#004AAD` | Primary actions, links, focus states |
| **Primary Hover** | `#003A8C` | Button hover states |
| **Primary Light** | `#E6EEF8` | Backgrounds, highlights |
| **Success** | `#059669` | Success states, positive actions |
| **Warning** | `#F59E0B` | Warnings, caution states |
| **Error** | `#DC2626` | Errors, destructive actions |
| **Info** | `#3B82F6` | Informational messages |

### Typography

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 28px | 700 | Page titles |
| H2 | 24px | 600 | Section headers |
| H3 | 20px | 600 | Subsection headers |
| Body | 14px | 400 | Body text |
| Small | 12px | 400 | Captions, labels |

**Font Family:** Helvetica Neue, Arial, sans-serif

### Spacing Scale

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 4px | Tight spacing |
| `--spacing-sm` | 8px | Compact elements |
| `--spacing-md` | 16px | Standard spacing |
| `--spacing-lg` | 24px | Section spacing |
| `--spacing-xl` | 32px | Large gaps |

### Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `xs` | < 480px | Mobile phones |
| `sm` | 480-639px | Large phones |
| `md` | 640-767px | Tablets portrait |
| `lg` | 768-1023px | Tablets landscape |
| `xl` | 1024-1279px | Small desktops |
| `2xl` | >= 1280px | Large desktops |

---

## Documentation

| Document | Description |
|----------|-------------|
| `CLAUDE.md` | AI assistant project context |
| `src/assets/Document/SpectraOne Portal - Functional Requirements Document v4.md` | Complete FRD |
| `src/assets/Document/SpectraOne Portal - User Role Definitions v4.md` | Role definitions |
| `public/assets/videos/README.md` | Video tutorial guide |

---

## Browser Support

| Browser | Minimum Version | Support Level |
|---------|-----------------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Opera | 76+ | Full |
| Samsung Internet | 14+ | Basic |
| Internet Explorer | - | Not Supported |

---

## Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized build in `build/` folder:
- Minified JavaScript bundles
- Optimized CSS
- Hashed filenames for cache busting
- Code splitting by route

### Serving Production Build

```bash
npm install -g serve
serve -s build
```

### Performance Targets

| Metric | Target |
|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s |
| **FID** (First Input Delay) | < 100ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 |
| **Initial JS Bundle** | < 150KB gzipped |
| **Initial CSS** | < 50KB gzipped |

---

## Known Issues & TODOs

- [ ] Backend API integration (currently using sample data)
- [ ] Real-time MAC validation service
- [ ] Replace video placeholders with actual recordings
- [ ] Add real screenshots to KB articles
- [ ] Implement streaming for large report exports
- [ ] Complete TypeScript migration (partial)
- [ ] Add unit test coverage (target: 80%)
- [ ] Implement E2E tests for critical flows

---

## Support

For questions or issues:
1. Check documentation in `src/assets/Document/`
2. Review inline component comments
3. Check segment configurations in `src/config/`
4. Refer to `CLAUDE.md` for project context

---

## License

Proprietary - Spectra Technologies

---

**SpectraOne Portal** - Enterprise Wi-Fi Management Made Simple
