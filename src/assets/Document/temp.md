# SpectraOne Portal - Implementation Specification Document

**Document Version:** 1.0
**Document Type:** Implementation Specification
**Platform:** SpectraOne Managed Wi-Fi Portal
**Scope:** Customer Portal & Internal Spectra User Portal


## Table of Contents

1. [Introduction](#1-introduction)
2. [Target Users](#2-target-users)
3. [User Interface and User Experience (UI/UX)](#3-user-interface-and-user-experience-uiux)
4. [Key User Flows](#4-key-user-flows)
5. [Key Features Overview](#5-key-features-overview)
6. [Customer Portal - User Management](#6-customer-portal---user-management)
7. [Customer Portal - Device Management](#7-customer-portal---device-management)
8. [Customer Portal - Dashboard](#8-customer-portal---dashboard)
9. [Customer Portal - Reports](#9-customer-portal---reports)
10. [Customer Portal - Knowledge Center](#10-customer-portal---knowledge-center)
11. [Customer Portal - Activity Logs](#11-customer-portal---activity-logs)
12. [Internal Portal - Overview](#12-internal-portal---overview)
13. [Internal Portal - Dashboard](#13-internal-portal---dashboard)
14. [Internal Portal - Customer Management](#14-internal-portal---customer-management)
15. [Internal Portal - Site Management](#15-internal-portal---site-management)
16. [Internal Portal - Audit Logs](#16-internal-portal---audit-logs)
17. [Internal Portal - System Configuration](#17-internal-portal---system-configuration)
18. [Internal Portal - Reports](#18-internal-portal---reports)
19. [Internal Portal - Support Queue](#19-internal-portal---support-queue)
20. [Internal Portal - Knowledge Center](#20-internal-portal---knowledge-center)
21. [Internal Portal - Bulk Operations](#21-internal-portal---bulk-operations)
22. [Access Levels, User Roles and Permissions](#22-access-levels-user-roles-and-permissions)
23. [Alerts & Notifications](#23-alerts--notifications)
24. [API Integration Requirements](#24-api-integration-requirements)
25. [Future Considerations](#25-future-considerations)

---

## 1. Introduction

The purpose of this document is to capture the implemented functional specifications for Spectra's customer portal called **SpectraOne**, related to the product Managed Wi-Fi and all associated products (such as Managed Wi-Fi Infrastructure).

This portal empowers:
- **Client administrators** to manage users, devices, access comprehensive reports, and gain valuable insights into their Wi-Fi network
- **Internal Spectra staff** to manage customers, sites, configurations, support tickets, and platform operations

The implementation consists of two distinct portals:
1. **Customer Portal** - For Spectra's customers (client administrators) to manage their Wi-Fi network
2. **Internal Spectra User Portal** - For Spectra internal staff to manage the entire platform

---

## 2. Target Users

### 2.1 Customer Portal Users

The Customer Portal caters to client administrators with varying access levels and responsibilities:

#### Super Admins (Company Level)
- **Description:** IT or network administrators responsible for managing Wi-Fi networks across all client sites
- **Access Level:** Full access to all reports, user & policy configurations and settings for the entire company
- **Primary Needs:**
  - Monitor overall network health and performance across all sites
  - Analyze data usage trends across regions, sites, and users
  - Identify and address network issues proactively
  - Manage user access and policies
  - Generate reports for billing and other operational processes

#### Site Admins (Site Level)
- **Description:** IT or network administrators responsible for managing Wi-Fi networks at specific sites
- **Access Level:** Access to reports, configurations, and users specific to their assigned sites
- **Primary Needs:**
  - Monitor site-level network performance and user activity
  - Identify and troubleshoot issues at individual sites
  - Manage user access and policies for their sites
  - Generate reports for site-specific analysis

### 2.2 Internal Portal Users

The Internal Portal caters to Spectra staff members:

#### Super Admin
- Full access to all internal features including bulk operations and system configuration

#### Deployment Engineer
- Site provisioning and configuration management

#### Support Engineer
- Ticket management and troubleshooting

#### Network Operations
- Site monitoring, alerts, and maintenance

#### Account Manager
- Customer management and reporting

---

## 3. User Interface and User Experience (UI/UX)

### 3.1 Implemented UI/UX Features

- **Access Level and Role-Based Interface:** Portal interface and feature availability tailored based on user access level, roles, and permissions
- **Segment-Specific Design:** Customized interfaces for each customer segment (Enterprise, Co-Living, Co-Working, Hotel, PG, Miscellaneous)
- **Company vs Site View Toggle:** Company-level users can view aggregated data or drill-down to specific sites
- **Modern Responsive Design:** Optimal viewing on desktop, tablet, and mobile devices
- **Dark Mode Support:** User preference for light or dark theme
- **Multi-language Support:** Internationalization using react-i18next

### 3.2 Navigation Patterns

- **Sidebar Navigation:** Consistent sidebar with collapsible menu items
- **Breadcrumb Navigation:** Clear navigation path indication
- **Quick Actions:** Context-sensitive quick action buttons on dashboards
- **Search Functionality:** Global search across relevant data

### 3.3 Common UI Components

- **Data Tables:** Sortable, filterable tables with pagination
- **Grid/List View Toggle:** Switch between card-based grid view and detailed list view
- **Modal Dialogs:** For forms, confirmations, and detailed views
- **Status Badges:** Color-coded visual indicators for status (Active, Suspended, Blocked, Online, Offline)
- **Progress Indicators:** License utilization rings, progress bars, and loading states
- **Toast Notifications:** Success, error, and info messages

---

## 4. Key User Flows

### 4.1 Customer Portal User Flows

1. **Dashboard Overview:** Homepage displaying key metrics, charts, and recent activities specific to segment and access level
2. **User Management:** Register, view, edit, and manage end-user status and policies
3. **Device Management:** Register, view, edit, and manage devices with real-time status
4. **Reports:** Generate and export reports with interactive charts
5. **Knowledge Center:** Access FAQs, articles, and video tutorials
6. **Activity Logs:** View comprehensive audit trail of all actions

### 4.2 Internal Portal User Flows

1. **Platform Dashboard:** Executive overview of all customers, sites, and platform health
2. **Customer Onboarding:** Create and configure new customer accounts
3. **Site Provisioning:** Multi-step wizard for provisioning new sites
4. **Support Management:** Handle customer support tickets with SLA tracking
5. **Configuration Management:** Manage bandwidth policies, domains, and system settings
6. **Bulk Operations:** Perform batch operations on users and devices

---

## 5. Key Features Overview

### 5.1 Customer Portal Features

| Feature | Description |
|---------|-------------|
| Dashboard | Segment-specific metrics, charts, and quick actions |
| User Management | Full user lifecycle management with policy assignment |
| Device Management | User and smart/digital device management |
| Reports | 8+ report categories with export capabilities |
| Knowledge Center | Articles, videos, and FAQs |
| Activity Logs | Comprehensive audit trail |

### 5.2 Internal Portal Features

| Feature | Description |
|---------|-------------|
| Internal Dashboard | Platform-wide metrics and alerts |
| Customer Management | Manage all customer accounts |
| Site Management | Provision and monitor sites |
| Audit Logs | Staff action tracking |
| System Configuration | Policies, domains, and settings |
| Internal Reports | 21+ internal reports across 7 categories |
| Support Queue | Ticket management with SLA tracking |
| Internal Knowledge Center | Staff documentation and training |
| Bulk Operations | Batch user and device operations |

---

## 6. Customer Portal - User Management

### 6.1 Overview

User Management enables authorized client administrators to manage end-user accounts including registration, status changes, policy assignment, and device management.

### 6.2 User Status Model

Users have one of the following statuses:

| Status | Definition | Visual Indicator |
|--------|------------|------------------|
| **Active** | User is registered and allowed to connect to the Wi-Fi network | Green badge |
| **Suspended** | User is temporarily restricted from connecting (reversible) | Orange badge |
| **Blocked** | User is permanently restricted from connecting (irreversible) | Red badge |

**Status Transitions:**
- Active → Suspended (reversible)
- Active → Blocked (irreversible)
- Suspended → Active (reversible)
- Suspended → Blocked (irreversible)
- Blocked → No transitions allowed

### 6.3 User Registration

#### 6.3.1 Functionality

User registration is available subject to Active User License availability. If licenses are at maximum, the administrator must:
- Deactivate or block an existing user, or
- Request additional licenses

#### 6.3.2 User Roles Required

- `canEditUsers` permission

#### 6.3.3 Access Levels

Available at Site, Cluster, City, and Company access levels.

#### 6.3.4 Segment-Specific User Information

##### Enterprise (Offices)

| Parameter | Type | Description |
|-----------|------|-------------|
| User ID | Mandatory | Unique identifier at site level |
| First Name | Mandatory | For user identification |
| Last Name | Mandatory | For user identification |
| Email Address | Mandatory | For communication and notifications |
| Mobile Number | Mandatory | For communication and OTP |
| User Policy | Mandatory | Policy selection from pre-configured list |
| Department | Optional | Department affiliation |
| Job Title | Optional | Position designation |

##### Co-Living (Short-stay & Long-stay)

| Parameter | Type | Description |
|-----------|------|-------------|
| User ID | Mandatory | Unique identifier at site level |
| First Name | Mandatory | For user identification |
| Last Name | Mandatory | For user identification |
| Mobile Number | Mandatory | For OTP and communication |
| Resident Type | Mandatory | Long Term (default) or Short Term |
| User Policy | Mandatory | Policy selection from pre-configured list |
| Email Address | Optional | For communication |
| Check-in Date | Conditional | Mandatory for Short Term residents |
| Check-in Time | Conditional | Mandatory for Short Term residents |
| Check-out Date | Conditional | Mandatory for Short Term (auto-deactivates user) |
| Check-out Time | Conditional | Mandatory for Short Term |
| Room Number | Optional | Room assignment |
| Organization | Optional | College/University/Company affiliation |

##### Co-Working

| Parameter | Type | Description |
|-----------|------|-------------|
| Member ID | Mandatory | Unique identifier at site level |
| First Name | Mandatory | For user identification |
| Last Name | Mandatory | For user identification |
| Mobile Number | Mandatory | For communication |
| Email Address | Mandatory | For communication |
| Member Type | Mandatory | Permanent (default) or Temporary |
| User Policy | Mandatory | Policy selection from pre-configured list |
| Move-in Date | Conditional | Mandatory for Temporary members |
| Move-out Date | Conditional | Mandatory for Temporary (auto-deactivates) |
| Company | Optional | Company affiliation |
| Desk Number | Optional | Workspace assignment |

##### Hotel

| Parameter | Type | Description |
|-----------|------|-------------|
| User ID | Mandatory | Auto-generated |
| First Name | Mandatory | Guest identification |
| Last Name | Mandatory | Guest identification |
| Room Number | Mandatory | Room assignment |
| Check-in Date | Mandatory | Pre-populated with current date |
| Check-in Time | Mandatory | Pre-populated with current time |
| Check-out Date | Mandatory | Auto-deactivates user on this date |
| Check-out Time | Mandatory | Default 2:00 PM |
| User Policy | Mandatory | Policy selection |
| Mobile Number | Optional | Contact number |
| Email Address | Optional | Contact email |
| Guest ID | Optional | External reservation ID |

##### PG

| Parameter | Type | Description |
|-----------|------|-------------|
| User ID | Mandatory | Auto-generated |
| Mobile Number | Mandatory | Primary identifier and OTP |
| User Policy | Mandatory | Policy selection |
| First Name | Optional | Resident identification |
| Last Name | Optional | Resident identification |
| Email Address | Optional | Contact email |
| Room Number | Optional | Room assignment |

##### Miscellaneous

| Parameter | Type | Description |
|-----------|------|-------------|
| User ID | Mandatory | Unique identifier |
| First Name | Mandatory | User identification |
| Last Name | Mandatory | User identification |
| Mobile Number | Mandatory | Contact and OTP |
| User Policy | Mandatory | Policy selection |
| Email Address | Optional | Contact email |

### 6.4 View Registered Users

#### 6.4.1 Functionality

Displays a paginated, sortable, and filterable list of all registered users.

#### 6.4.2 User List Columns

| Column | Description |
|--------|-------------|
| User ID | Unique identifier |
| First Name | User's first name |
| Last Name | User's last name |
| Mobile Number | Contact number |
| Email Address | Contact email |
| User Policy | Assigned policy (Speed, Data, Device Limit, Cycle Type) |
| Device Count | Number of registered devices |
| Status | Active/Suspended/Blocked with badge |
| Registration Date | Account creation date |
| Last Online | Most recent connection timestamp |
| Site Name | (Company View only) Site assignment |

#### 6.4.3 Search and Filtering

- **Search:** Full-text search across all fields
- **Status Filter:** All, Active, Suspended, Blocked
- **Segment Filter:** (Company View) Filter by segment
- **Site Filter:** (Company View) Filter by site
- **Advanced Filters:** Segment-specific field filters

#### 6.4.4 Sorting

Multi-column sort capability with ascending/descending indicators.

#### 6.4.5 Column Customization

Users can show/hide columns based on preference.

### 6.5 User Profile Update

#### 6.5.1 Editable Fields

Administrators with `canEditUsers` permission can modify:
- First Name, Last Name
- Email Address
- Mobile Number
- Department, Job Title (segment-specific)
- Room Number (segment-specific)
- Check-in/Check-out dates (segment-specific)

#### 6.5.2 Non-Editable Fields

- User ID
- Registration Date
- Status (separate action required)

### 6.6 User Status Management

#### 6.6.1 Suspend User

- **Action:** Changes status from Active to Suspended
- **Effect:** User cannot connect to Wi-Fi network
- **Reversibility:** Reversible - can be activated again
- **Confirmation:** Required with reason/notes

#### 6.6.2 Activate User

- **Action:** Changes status from Suspended to Active
- **Effect:** User can connect to Wi-Fi network
- **Confirmation:** Required

#### 6.6.3 Block User

- **Action:** Changes status to Blocked (from Active or Suspended)
- **Effect:** User permanently cannot connect
- **Reversibility:** Irreversible - requires new account creation
- **Confirmation:** Enhanced warning dialog required

### 6.7 User Policy Management

#### 6.7.1 Policy Components

| Component | Options |
|-----------|---------|
| **Speed** | 5 Mbps, 10 Mbps, 25 Mbps, 50 Mbps, 75 Mbps, 100 Mbps, 150 Mbps, 200 Mbps, Unlimited |
| **Data Volume (Monthly)** | 10 GB, 25 GB, 50 GB, 100 GB, 200 GB, 500 GB, 1 TB, Unlimited |
| **Data Volume (Daily)** | 0.5 GB, 1 GB, 2 GB, 3 GB, 5 GB, 10 GB, 25 GB, 50 GB, 100 GB, Unlimited |
| **Device Limit** | 1, 2, 3, 4, 5, Unlimited |
| **Data Cycle Type** | Daily, Monthly |

#### 6.7.2 Policy Assignment

Policy is selected during user registration and can be modified via user edit functionality.

### 6.8 License Management

#### 6.8.1 License Ring Visualization

A circular progress indicator displays:
- Current active users
- Total allocated licenses
- Usage percentage
- Visual color coding (green < 70%, yellow 70-90%, red > 90%)

#### 6.8.2 Segment-Specific Limits

Each segment has defined license allocations displayed in the interface.

### 6.9 Bulk User Operations

#### 6.9.1 Bulk Import

- **Format:** CSV file upload
- **Template:** Downloadable CSV template provided
- **Fields:** User ID, First Name, Last Name, Email, Mobile, Policy
- **Validation:** Pre-upload validation with error reporting
- **Results:** Success/failure count with detailed error log

#### 6.9.2 Bulk Export

Export filtered user list to CSV with all visible columns.

### 6.10 Audit Trail

All user management actions are logged including:
- User creation with details
- User profile updates (field changes)
- Status changes with reason
- Policy changes
- Performing administrator and timestamp
- IP address of action source

---

## 7. Customer Portal - Device Management

### 7.1 Overview

Device Management enables administrators to register, configure, monitor, and manage both user devices and smart/digital devices across the network.

### 7.2 Device Types

#### 7.2.1 User Devices

Personal devices registered to end-users:
- Mobile Phone
- Laptop
- Tablet
- iPad
- Smart Speaker
- Miscellaneous

#### 7.2.2 Smart/Digital Devices

Infrastructure and IoT devices (segment-specific availability):

| Device Type | Enterprise | Co-Living | Co-Working | Hotel | PG |
|-------------|------------|-----------|------------|-------|-----|
| Camera | Yes | Yes | Yes | Yes | Yes |
| CCTV | Yes | Yes | Yes | Yes | Yes |
| DVR | Yes | Yes | Yes | Yes | Yes |
| Biometric | Yes | Yes | Yes | Yes | No |
| Sensor | Yes | Yes | No | Yes | No |
| Printer | Yes | No | Yes | No | No |
| IoT Device | Yes | No | No | No | No |
| Smart TV | Yes | Yes | Yes | Yes | Yes |
| Access Control | Yes | Yes | Yes | Yes | Yes |
| Intercom | Yes | Yes | No | No | No |
| POS Terminal | Yes | No | No | No | No |
| Display | Yes | No | Yes | No | No |
| Kiosk | Yes | No | No | No | No |

### 7.3 Device Registration

#### 7.3.1 Required Fields

| Field | Description |
|-------|-------------|
| Device Name | User-friendly device identifier |
| MAC Address | Hardware address (validated format) |
| Device Category | Type selection (Mobile, Laptop, Camera, etc.) |
| Owner/User | User assignment (optional for digital devices) |

#### 7.3.2 Auto-Generated Fields

- Device ID
- Registration Date
- Site Assignment (from context)

#### 7.3.3 MAC Address Validation

- Format validation (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)
- Vendor lookup (OUI database)
- Duplicate detection within site

### 7.4 Device Listing

#### 7.4.1 View Modes

- **Grid View:** Card-based layout with device icons, status, and key metrics
- **List View:** Table format with detailed columns

#### 7.4.2 Displayed Information

| Field | Description |
|-------|-------------|
| Device Name | Assigned name |
| MAC Address | Hardware address |
| Category | Device type |
| Owner | Assigned user (if applicable) |
| IP Address | Current IP assignment |
| Status | Online/Offline/Blocked |
| Last Connected | Most recent activity |
| Data Usage | Current session data consumed |
| Site | (Company View) Site location |

### 7.5 Device Statistics

Summary cards displaying:
- Total Devices (by segment)
- Devices Online Now
- Devices Offline
- Access Points Count

### 7.6 Device Actions

| Action | Description | Permission Required |
|--------|-------------|---------------------|
| Register Device | Add new device | canManageDevices |
| Edit Device | Modify device name/config | allowDeviceEdit (segment-based) |
| Disconnect Device | Terminate active connection | canManageDevices |
| Delete Device | Remove device registration | allowDeviceDelete (segment-based) |

### 7.7 Filtering and Search

- **Search:** Device name, MAC address, owner, category
- **Primary Type Filter:** All, User Devices, Smart/Digital Devices
- **Sub-Type Filter:** Dynamic based on primary type
- **Status Filter:** All, Online, Offline, Blocked
- **Site Filter:** (Company View) Filter by site

### 7.8 Bulk Device Operations

#### 7.8.1 Bulk Import

Separate import capabilities for:
- User Devices (CSV with MAC, name, type, user assignment)
- Smart/Digital Devices (CSV with MAC, name, device type, location)

#### 7.8.2 Bulk Export

Export filtered device list to CSV.

### 7.9 Segment-Specific Device Permissions

| Capability | Enterprise | Co-Living | Co-Working | Hotel | PG | Misc |
|------------|------------|-----------|------------|-------|-----|------|
| User Devices | Yes | Yes | Yes | Yes | Yes | Yes |
| Digital Devices | Yes | Yes | Yes | Yes | Yes | Limited |
| Edit Device | Yes | Yes | Yes | Yes | Yes | Limited |
| Delete Device | Yes | Yes | Yes | Yes | Yes | Limited |

---

## 8. Customer Portal - Dashboard

### 8.1 Overview

The Dashboard provides a centralized overview of network status, usage metrics, and quick access to key functions. It adapts based on segment and access level.

### 8.2 Site-Level Dashboard

#### 8.2.1 Summary Metric Cards

| Metric | Description |
|--------|-------------|
| Active Users | Current active user count with trend indicator |
| License Usage | Percentage of allocated licenses in use |
| Data Usage | Total data consumed (segment-specific units) |
| Network Uptime | Service availability percentage |

#### 8.2.2 Charts and Analytics

1. **Network Usage Chart** (Line Chart)
   - X-axis: Time period (days/weeks)
   - Y-axis: Data usage in GB
   - Segment-specific data patterns

2. **Users by Speed Tier** (Bar Chart)
   - Speed tiers: Up to 25 Mbps, 26-50 Mbps, 51-100 Mbps, Above 100 Mbps
   - User distribution by assigned speed policy

3. **Peak Usage Hours** (Bar Chart)
   - Time periods throughout the day
   - Usage percentage distribution

#### 8.2.3 Recent Activity

Carousel displaying last 24 hours of activities:
- User registrations
- Device connections
- Status changes
- Policy updates

#### 8.2.4 Quick Actions

Permission-based action buttons:
- Add User (requires canEditUsers)
- View Users (requires canEditUsers)
- View Reports (requires canViewReports)
- Access Knowledge Center
- View Activity Logs (requires canViewLogs)

### 8.3 Company-Level Dashboard

When viewing at company level, additional elements are displayed:

#### 8.3.1 Company-Wide Metrics

| Metric | Description |
|--------|-------------|
| Total Sites | Number of sites under company |
| Total Users | Aggregate user count across all sites |
| Total Devices | Aggregate device count across all sites |
| Active Alerts | Number of pending alerts |

#### 8.3.2 Sites Overview Component

- Site cards with status indicators
- Drill-down capability to individual sites
- Quick site health summary

#### 8.3.3 Company Analytics Charts

- Users by Site (Bar Chart)
- Devices by Site (Bar Chart)
- Bandwidth Utilization by Site

#### 8.3.4 Recent Company Activity

Activity timeline with site badges showing cross-site activities.

### 8.4 Segment-Specific Dashboard Behavior

Each segment displays contextually relevant metrics and default values tailored to the business type.

---

## 9. Customer Portal - Reports

### 9.1 Overview

The Reports module provides comprehensive reporting capabilities with category-based organization, customizable criteria, and multiple export formats.

### 9.2 Report Categories

#### 9.2.1 Billing Reports
- Monthly Average Active Users (Site)
- Daily Average Active Users (Site)
- Policy-wise Monthly Average Active Users (Site)
- Average Active Users Summary (Company Level)

#### 9.2.2 Usage Reports
- Monthly Data Usage Summary Report
- Daily Data Usage Report
- User-wise Data Consumption
- Device-wise Data Usage

#### 9.2.3 Wi-Fi Network Reports
- Access Point List
- Client List
- Network Uptime Report
- Access Point Traffic Distribution
- Wi-Fi Channel Utilization Report

#### 9.2.4 User Reports
- User Registration Report
- Registered User Report
- Active Users Report
- Inactive/Suspended Users Report
- Blocked Users Report

#### 9.2.5 Authentication Reports
- Authentication Success/Failure Report
- Login Activity Report

#### 9.2.6 Upsell Reports
- Top-up Transaction Report
- Revenue Analysis Report

### 9.3 Report Features

#### 9.3.1 Report Discovery
- Category-based browsing
- Search by report name/keyword
- Report descriptions

#### 9.3.2 Pinned Reports
- Pin frequently used reports (up to 6)
- Quick access from dashboard
- Color-coded display

#### 9.3.3 Recent Reports
- Track last 5 accessed reports
- Easy re-execution

#### 9.3.4 Report Criteria
- Date range selection
- Custom filters based on report type
- Segment/Site filters (company view)

#### 9.3.5 Export Options
- **CSV Export:** Data-only export with headers
- **PDF Export:** Formatted report with charts and branding

### 9.4 Report Output Types

- **Table Reports:** Tabular data display
- **Chart Reports:** Visual charts with data tables
- **Summary Reports:** High-level aggregated metrics
- **Trend Reports:** Time-series analysis

---

## 10. Customer Portal - Knowledge Center

### 10.1 Overview

The Knowledge Center provides self-service support resources including articles, video tutorials, and FAQs.

### 10.2 Content Sections

#### 10.2.1 Home
- Featured articles
- Quick links to popular content
- Search functionality

#### 10.2.2 Getting Started
- Onboarding guides
- First-time user setup
- Feature walkthroughs

#### 10.2.3 Video Tutorials
- Embedded video player
- Duration display
- Segment-specific content

#### 10.2.4 FAQ Section
- Expandable Q&A format
- Category-based organization
- Search within FAQs

### 10.3 Features

- Full-text search across all content
- Segment-specific content filtering
- Article modal with formatting
- Video playback with controls
- Related content suggestions

---

## 11. Customer Portal - Activity Logs

### 11.1 Overview

Activity Logs provide a comprehensive audit trail of all system actions for compliance, troubleshooting, and monitoring.

### 11.2 Logged Information

| Field | Description |
|-------|-------------|
| Timestamp | Date and time of action |
| Log ID | Unique identifier (LOG-XXX-0001) |
| Action | CREATE, UPDATE, DELETE |
| Entity | User, Device, Policy, Settings |
| Category | user, device, system |
| Target | Name of affected entity |
| Performed By | Administrator who performed action |
| Role | Role of performing user |
| Details | Human-readable description |
| IP Address | Source IP of action |
| Site | (Company View) Site where action occurred |

### 11.3 Filtering Options

- **Search:** By target name, performer, details, log ID
- **Category Filter:** User, Device, System
- **Action Filter:** CREATE, UPDATE, DELETE
- **Date Range:** Last 24 hours, 7 days, 14 days, 30 days
- **Site Filter:** (Company View) Filter by site

### 11.4 Sorting

Sortable by:
- Timestamp (default: newest first)
- Action
- Entity
- Target
- Performed By
- Site (company view)

### 11.5 Export

CSV export with all visible columns and applied filters.

---

## 12. Internal Portal - Overview

### 12.1 Purpose

The Internal Spectra User Portal is a staff-only management system for Spectra team members to manage customers, sites, support tickets, configurations, and platform operations.

### 12.2 Access Requirement

All internal portal pages require the `canAccessInternalPortal` permission.

### 12.3 Internal Portal Modules

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | /internal/dashboard | Executive overview |
| Sites | /internal/sites | Site management and provisioning |
| Customers | /internal/customers | Customer account management |
| Logs | /internal/logs | Staff audit trail |
| Configuration | /internal/config | System configuration |
| Knowledge | /internal/knowledge | Staff documentation |
| Reports | /internal/reports | Internal analytics |
| Support | /internal/support | Ticket management |
| Bulk Operations | /internal/bulk-operations | Batch operations |

---

## 13. Internal Portal - Dashboard

### 13.1 Overview

The Internal Dashboard provides an executive overview of the entire Spectra platform operations.

### 13.2 Key Metrics

| Metric | Description |
|--------|-------------|
| Total Customers | All customer accounts (active and inactive) |
| Total Sites | All provisioned sites |
| Total Users | Aggregate end-users across platform |
| Total Devices | Aggregate devices across platform |
| License Utilization | Overall license usage percentage |
| Bandwidth Usage | Total bandwidth consumed vs provisioned |
| Platform Uptime | Overall platform availability |

### 13.3 Dashboard Sections

#### 13.3.1 Welcome Header
- Personalized greeting
- Quick action buttons (Provision New Site, Support Queue)

#### 13.3.2 Quick Actions Bar
- Navigation shortcuts to all major sections

#### 13.3.3 Site Health Overview
- Status breakdown: Online, Degraded, Offline, Maintenance
- Platform uptime indicator
- Clickable filters for each status

#### 13.3.4 Active Alerts Card
- Critical/Warning/Info counts
- Unacknowledged alerts list
- Link to full alerts page

#### 13.3.5 Sites Needing Attention
- Table of problematic sites
- Status, issue description, and action buttons
- Direct navigation to investigate

#### 13.3.6 Support Tickets Panel
- Open tickets display
- Priority indicators
- Quick access to ticket details

#### 13.3.7 Regional Performance
- Breakdown by region (North, South, East, West)
- Sites, Users, Devices per region

#### 13.3.8 Segment Breakdown
- By segment: Hotel, Co-Working, Co-Living, PG, Enterprise, Miscellaneous
- Site and user distribution

#### 13.3.9 Recent Activity Timeline
- Latest staff activities
- Timestamp and user information

---

## 14. Internal Portal - Customer Management

### 14.1 Overview

Customer Management enables Spectra staff to manage all customer/tenant accounts on the platform.

### 14.2 Customer Data Fields

| Category | Fields |
|----------|--------|
| Basic Info | ID, Name, Type, Industry, Segment |
| Status | active, inactive, suspended |
| Contract | Start Date, End Date |
| Account | Manager, Support Tier, License Tier |
| Contact | Name, Email, Phone |
| Capacity | Total Sites, Active Sites, Total Users, Total Devices |
| License | ID, Tier, Status, Usage %, Expiry Date |

### 14.3 Features

#### 14.3.1 Summary Statistics
- Total Customers count
- Active, Inactive, Suspended breakdown
- Total Sites and Users across filtered customers

#### 14.3.2 Search and Filter
- Full-text search: name, email, industry
- Status filter
- Industry filter
- View toggle: Grid/List

#### 14.3.3 Grid View
Customer cards displaying:
- Status icon and name
- Industry tag
- Contact information
- Metrics: Sites, Users, Devices
- License usage bar
- Action dropdown

#### 14.3.4 List View
Table format with sortable columns and row actions.

### 14.4 Customer Actions

| Action | Permission Required |
|--------|---------------------|
| View Details | canAccessInternalPortal |
| View Sites | canAccessInternalPortal |
| Analytics | canAccessInternalPortal |
| Edit Customer | canManageCustomers |
| Configure | canManageCustomers |
| Delete | canManageAllCustomers |

---

## 15. Internal Portal - Site Management

### 15.1 Overview

Site Management enables Spectra staff to manage individual customer sites, provision new sites, and monitor site health.

### 15.2 Site Data Fields

| Category | Fields |
|----------|--------|
| Basic | ID, Customer ID/Name, Site Name, City, State, Region |
| Type | Hotel, Co-Working, Co-Living, PG, Enterprise, Miscellaneous |
| Status | online, degraded, offline, maintenance |
| Deployment | Date, Last Seen |
| Capacity | Total Users, Active Users, Total Devices, Online Devices |
| Bandwidth | Usage (Mbps), Limit (Mbps) |
| Health | Uptime %, Alerts count, Critical Alerts |
| License | Tier, Expiry date |
| Contact | Primary contact name, email, phone |

### 15.3 Site Provisioning

#### 15.3.1 Multi-Step Provisioning Wizard

The site provisioning process follows a structured wizard:

**Step 1: Customer Selection**
- Select existing customer or create new

**Step 2: Site Information**
- Site name, type, segment
- Location (city, state, region)

**Step 3: Contact Information**
- Primary contact details
- Notification preferences

**Step 4: Capacity Configuration**
- Expected users and devices
- Bandwidth and storage limits
- License tier selection

**Step 5: Network Configuration**
- Configuration template selection
- RADIUS settings
- Domain setup

**Step 6: Deployment**
- Deployment date scheduling
- Notes and special instructions

**Step 7: Review and Confirm**
- Summary of all selections
- Final confirmation

### 15.4 Site Monitoring

#### 15.4.1 Health Indicators

| Uptime | Status | Color |
|--------|--------|-------|
| 99%+ | Excellent | Green |
| 95-99% | Good | Blue |
| 90-95% | Fair | Yellow |
| <90% | Poor | Red |

#### 15.4.2 Alert Display
- Critical, warning, and info alert counts
- Quick access to site alerts

### 15.5 Filtering

- Search: site name, customer name, city
- Customer filter
- Status filter: online, degraded, offline, maintenance
- Region filter: North, South, East, West
- Type filter: Hotel, Co-Working, Co-Living, PG

### 15.6 Site Actions

- View Details
- Edit Site
- Configure
- Delete (with confirmation)
- View Alerts
- View Logs

---

## 16. Internal Portal - Audit Logs

### 16.1 Overview

Audit Logs provide a comprehensive trail of all internal staff actions for compliance and accountability.

### 16.2 Logged Information

| Field | Description |
|-------|-------------|
| Timestamp | Date and time (ISO format) |
| User Type | internal, customer, system |
| User | Staff name or System ID |
| User Role | Support Engineer, Deployment Engineer, Super Admin, Automated |
| Action | site_provisioned, alert_generated, ticket_updated, config_changed, etc. |
| Category | Configuration, User Management, Site Management, etc. |
| Resource | Resource type and ID |
| Description | Human-readable description |
| IP Address | Source IP (null for automated) |
| Severity | info, warning, critical |
| Status | success, failed, triggered |

### 16.3 Filtering Options

- Full-text search
- Action category filter
- Severity level filter
- User role filter
- Date range filter

### 16.4 Export

- CSV export
- PDF export
- Filtered export support

---

## 17. Internal Portal - System Configuration

### 17.1 Overview

System Configuration enables super administrators to manage platform-wide policies, domains, and settings.

### 17.2 Configuration Sections

#### 17.2.1 Bandwidth Policies

| Field | Description |
|-------|-------------|
| Policy Name | Identifier |
| Segment | Target segment |
| Download Speed | Mbps |
| Upload Speed | Mbps |
| Fair Usage Limit | Data cap or unlimited |
| Device Limit | Max devices |
| Status | active/inactive |
| Applied Sites | Count of sites using policy |

#### 17.2.2 Domain Configuration

| Field | Description |
|-------|-------------|
| Domain Name | Domain identifier |
| Domain Type | captive_portal, api, admin |
| Status | active/inactive |
| SSL Certificate | Status and expiry |
| CNAME Record | DNS configuration |
| Associated Customers | Linked customers |

#### 17.2.3 Advanced Settings

- RADIUS Configuration
- DHCP Settings
- VLAN Management
- DNS Configuration
- Failover Settings
- Logging & Monitoring

#### 17.2.4 API Keys Management

- API key listing
- Key secret (masked)
- Permissions
- Usage tracking
- Regenerate/Revoke actions

### 17.3 Permissions Required

- `canAccessSystemConfig`
- `canManagePolicies`
- `canManageDomains`

---

## 18. Internal Portal - Reports

### 18.1 Overview

Internal Reports provide staff-focused analytics and business intelligence with 21+ reports across 7 categories.

### 18.2 Report Categories

#### 18.2.1 Platform Analytics (4 reports)
- Platform Overview Dashboard
- Customer Growth Analysis
- Site Deployment Tracker
- License Utilization Report

#### 18.2.2 Customer Reports (4 reports)
- Customer Summary Report
- Customer Revenue Analysis
- Customer Health Score
- Contract Expiry Report

#### 18.2.3 Site Performance (4 reports)
- Site Status Report
- Site Uptime Analysis
- Site Capacity Report
- Regional Performance

#### 18.2.4 Network & Bandwidth (3 reports)
- Bandwidth Utilization
- Network Quality
- Data Transfer Analytics

#### 18.2.5 Security & Compliance (3 reports)
- Security Audit Report
- Compliance Status Report
- Access Control Report

#### 18.2.6 Support & Tickets (3 reports)
- Support Tickets Summary
- Ticket Performance
- Support Trends

### 18.3 Report Features

- Date range selection
- Multi-level filtering (customer, region, segment, status)
- Chart visualizations
- Export to CSV and PDF
- Favorite/star reports
- Report scheduling (email delivery)

---

## 19. Internal Portal - Support Queue

### 19.1 Overview

The Support Queue enables internal staff to manage customer support tickets with SLA tracking.

### 19.2 Ticket Data Fields

| Field | Description |
|-------|-------------|
| Ticket ID | Unique identifier |
| Customer | Customer name and ID |
| Site | Site name and ID |
| Subject | Ticket subject line |
| Description | Issue description |
| Priority | critical, high, medium, low |
| Status | open, in_progress, pending_approval, scheduled, completed |
| Category | connectivity, outage, upgrade, maintenance, compliance, other |
| Created | Creation timestamp |
| Updated | Last update timestamp |
| Assigned To | Team member or team |
| SLA Deadline | Target resolution time |
| Responses | Response count |

### 19.3 Features

#### 19.3.1 Statistics Panel
- Total tickets count
- Open tickets
- In Progress tickets
- Critical priority count
- Resolved tickets

#### 19.3.2 Search and Filter
- Full-text search
- Priority filter
- Status filter
- Category filter

#### 19.3.3 Ticket Actions
- View full details
- Reply to ticket
- Change status
- Reassign
- Add internal notes
- Close ticket

#### 19.3.4 SLA Tracking
- Deadline display
- Remaining time indicator
- Overdue highlighting

---

## 20. Internal Portal - Knowledge Center

### 20.1 Overview

The Internal Knowledge Center provides documentation and training resources for Spectra staff.

### 20.2 Content Structure

#### 20.2.1 Knowledge Articles (12 articles)

**Site Configuration**
- Site Provisioning Guide (7-step workflow)
- RADIUS Server Configuration
- Bandwidth Management & QoS

**Operations**
- Customer Onboarding Process (8-step checklist)
- Escalation Procedures (L1-L4 levels)

**Troubleshooting**
- Authentication Troubleshooting (7 error codes)
- Connectivity Issues (4 categories)
- Security Incident Response (6-step workflow)

**Configuration**
- API Integration Guide
- PMS Integration (Hotels)
- License Management
- SLA Monitoring & Reporting

#### 20.2.2 Video Tutorials (12 videos)

Covering topics:
- Site Provisioning Walkthrough
- RADIUS Configuration
- Authentication Troubleshooting
- Network Diagnostics
- PMS Integration
- Customer Onboarding
- Bandwidth Management
- License Management
- Escalation Procedures
- Security Incident Response
- API Integration
- Portal Navigation

#### 20.2.3 FAQ Section (16 FAQs)

Organized by category:
- Site Configuration (4 FAQs)
- Troubleshooting (4 FAQs)
- Operations (4 FAQs)
- Security (2 FAQs)
- Integration (2 FAQs)

### 20.3 Features

- Full article display with step-by-step procedures
- Embedded video player
- Expandable FAQ accordions
- Full-text search
- Category filtering

---

## 21. Internal Portal - Bulk Operations

### 21.1 Overview

Bulk Operations enables Super Administrators to perform batch operations on users and devices across the platform.

### 21.2 Permission Required

`canAccessBulkOperations` (Super Admin only)

### 21.3 User Operations (6 operations)

| Operation | Description |
|-----------|-------------|
| Bulk User Registration | CSV upload for mass user creation |
| Bulk User Activation | Activate multiple users |
| Bulk User Suspension | Suspend multiple users |
| Bulk User Blocking | Block multiple users (irreversible) |
| Bulk Policy Change | Change policy for multiple users |
| Bulk Resend Password | Reset passwords for multiple users |

### 21.4 Device Operations (2 operations)

| Operation | Description |
|-----------|-------------|
| Bulk Device Registration | CSV upload for mass device registration |
| Bulk Device Rename | Rename multiple devices with patterns |

### 21.5 Scheduled Tasks

- View all scheduled operations
- Status tracking: Pending, Running, Completed, Failed
- Schedule new operations
- Cancel pending operations
- View execution history
- Error logs for failed operations

### 21.6 CSV Upload Process

1. Download template
2. Populate with data
3. Upload CSV file
4. Validation and preview
5. Confirm execution
6. Progress tracking
7. Results report

---

## 22. Access Levels, User Roles and Permissions

### 22.1 Customer Portal Access Levels

#### 22.1.1 Site Level
- Access to single site data
- Full edit capabilities for assigned site

#### 22.1.2 Cluster Level
- Access to multiple related sites
- View and manage users across cluster

#### 22.1.3 City Level
- Access to all sites in a city
- Regional reporting capabilities

#### 22.1.4 Company Level
- Access to all company sites
- Company-wide reporting
- Read-only by default (drill-down for editing)

### 22.2 Customer Portal Permissions

| Permission | Description |
|------------|-------------|
| canViewReports | Access reports and dashboard |
| canEditUsers | Create, edit, manage users |
| canManageDevices | Register, edit, delete devices |
| canViewLogs | Access activity logs |

### 22.3 Internal Portal Permissions

| Permission | Description |
|------------|-------------|
| canAccessInternalPortal | Base access to internal portal |
| canManageCustomers | Edit and configure customers |
| canManageAllCustomers | Full customer management including delete |
| canProvisionSites | Provision new sites |
| canManagePolicies | Create and edit policies |
| canManageDomains | Domain configuration |
| canAccessSystemConfig | System configuration access |
| canAccessBulkOperations | Access bulk operations (Super Admin) |
| canBulkRegisterUsers | Bulk user registration |
| canBulkActivateUsers | Bulk activation |
| canBulkSuspendUsers | Bulk suspension |
| canBulkBlockUsers | Bulk blocking |
| canBulkChangePolicies | Bulk policy changes |
| canBulkResendPasswords | Bulk password reset |
| canBulkRegisterDevices | Bulk device registration |
| canBulkRenameDevices | Bulk device rename |

### 22.4 Segment-Based Permissions

Each segment may have specific capabilities:

| Capability | Description |
|------------|-------------|
| allowUserDevices | User device registration availability |
| allowDigitalDevices | Smart device registration availability |
| allowDeviceEdit | Device editing capability |
| allowDeviceDelete | Device deletion capability |

---

## 23. Alerts & Notifications

### 23.1 System Alerts (Internal Portal)

#### 23.1.1 Alert Types
- **Critical:** Immediate attention required
- **Warning:** Potential issue identified
- **Info:** Informational notification

#### 23.1.2 Alert Categories
- Connectivity
- Performance
- Maintenance
- Capacity
- License
- Security
- Deployment
- System

#### 23.1.3 Alert Management
- Acknowledge/Unacknowledge
- Assignment to staff
- Alert history tracking

### 23.2 User Notifications (Customer Portal)

- Toast notifications for actions
- Status change confirmations
- Export completion alerts
- Error messages with guidance

---

## 24. API Integration Requirements

### 24.1 Customer Portal API Endpoints

#### 24.1.1 User Management
```
GET    /api/users?siteId={}&segment={}     - Fetch users
POST   /api/users                           - Create user
PUT    /api/users/{userId}                  - Update user
DELETE /api/users/{userId}                  - Delete user (soft delete)
PUT    /api/users/{userId}/status           - Change user status
POST   /api/users/bulk-import               - Bulk user import
GET    /api/licenses/current                - Get license counts
```

#### 24.1.2 Device Management
```
GET    /api/devices?siteId={}&segment={}   - Fetch devices
POST   /api/devices                         - Register device
PUT    /api/devices/{deviceId}              - Update device
DELETE /api/devices/{deviceId}              - Delete device
POST   /api/devices/{deviceId}/disconnect   - Disconnect device
POST   /api/devices/bulk-import             - Bulk device import
```

#### 24.1.3 Reporting
```
POST   /api/reports/execute                 - Execute report
POST   /api/reports/{reportId}/export       - Export report
POST   /api/reports/{reportId}/criteria     - Save report criteria
```

#### 24.1.4 Activity Logs
```
GET    /api/audit/logs?siteId={}&filters={} - Fetch logs
POST   /api/audit/logs/export               - Export logs
```

### 24.2 Internal Portal API Endpoints

#### 24.2.1 Customer Management
```
GET    /api/internal/customers              - Fetch all customers
POST   /api/internal/customers              - Create customer
PUT    /api/internal/customers/{id}         - Update customer
DELETE /api/internal/customers/{id}         - Delete customer
```

#### 24.2.2 Site Management
```
GET    /api/internal/sites                  - Fetch all sites
POST   /api/internal/sites                  - Provision site
PUT    /api/internal/sites/{id}             - Update site
DELETE /api/internal/sites/{id}             - Delete site
GET    /api/internal/sites/{id}/health      - Get site health
```

#### 24.2.3 Configuration
```
GET    /api/internal/policies               - Fetch policies
POST   /api/internal/policies               - Create policy
PUT    /api/internal/policies/{id}          - Update policy
DELETE /api/internal/policies/{id}          - Delete policy
GET    /api/internal/domains                - Fetch domains
POST   /api/internal/domains                - Create domain
```

#### 24.2.4 Support
```
GET    /api/internal/tickets                - Fetch tickets
PUT    /api/internal/tickets/{id}/status    - Update ticket status
POST   /api/internal/tickets/{id}/reply     - Reply to ticket
PUT    /api/internal/tickets/{id}/assign    - Assign ticket
```

#### 24.2.5 Bulk Operations
```
POST   /api/internal/bulk/users/register    - Bulk user registration
POST   /api/internal/bulk/users/activate    - Bulk activation
POST   /api/internal/bulk/users/suspend     - Bulk suspension
POST   /api/internal/bulk/users/block       - Bulk blocking
POST   /api/internal/bulk/users/policy      - Bulk policy change
POST   /api/internal/bulk/users/password    - Bulk password reset
POST   /api/internal/bulk/devices/register  - Bulk device registration
POST   /api/internal/bulk/devices/rename    - Bulk device rename
GET    /api/internal/bulk/tasks             - Get scheduled tasks
POST   /api/internal/bulk/tasks/schedule    - Schedule operation
DELETE /api/internal/bulk/tasks/{id}        - Cancel scheduled task
```

---

## 25. Future Considerations

### 25.1 Potential Enhancements

1. **Real-time Dashboard Updates**
   - WebSocket integration for live metrics
   - Real-time device status changes
   - Live activity feeds

2. **Advanced Analytics**
   - Predictive usage analysis
   - Anomaly detection
   - Machine learning insights

3. **Mobile Application**
   - Native mobile apps for administrators
   - Push notifications
   - Quick actions on-the-go

4. **Integration Expansions**
   - Additional PMS system integrations
   - IPTV system integration
   - Building management system integration

5. **Enhanced Security**
   - Two-factor authentication
   - SSO integration
   - Advanced audit capabilities

6. **Workflow Automation**
   - Automated user provisioning rules
   - Scheduled maintenance windows
   - Auto-scaling policies

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Spectra Team | Initial implementation specification |

---

*This document reflects the implemented functionality of the SpectraOne Customer Portal and Internal Spectra User Portal. For technical implementation details, refer to the source code documentation.*
