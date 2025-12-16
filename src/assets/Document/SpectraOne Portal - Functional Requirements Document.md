# SpectraOne Portal - Functional Requirements Document (FRD)

**Document Version:** 1.0
**Document Type:** Functional Requirements Document
**Platform:** SpectraOne Managed Wi-Fi Portal
**Scope:** Customer Portal & Internal Spectra User Portal

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Target Users](#2-target-users)
3. [User Interface and User Experience (UI/UX) Requirements](#3-user-interface-and-user-experience-uiux-requirements)
4. [Front-End Technical Requirements](#4-front-end-technical-requirements)
5. [Key User Flows](#5-key-user-flows)
6. [Customer Portal - Dashboard](#6-customer-portal---dashboard)
7. [Customer Portal - User Management](#7-customer-portal---user-management)
8. [Customer Portal - Device Management](#8-customer-portal---device-management)
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

### 1.1 Purpose

The purpose of this document is to capture the functional requirements for Spectra's customer portal called **SpectraOne**, related to the product Managed Wi-Fi and all associated products (such as Managed Wi-Fi Infrastructure).

### 1.2 Scope

This portal shall empower:
- **Client administrators** to manage users, devices, access comprehensive reports, and gain valuable insights into their Wi-Fi network
- **Internal Spectra staff** to manage customers, sites, configurations, support tickets, and platform operations

### 1.3 Portal Components

The platform shall consist of two distinct portals:

| Portal | Purpose | Users |
|--------|---------|-------|
| **Customer Portal** | Wi-Fi network management for Spectra's customers | Client administrators |
| **Internal Spectra User Portal** | Platform management for Spectra staff | Spectra internal team |

---

## 2. Target Users

### 2.1 Customer Portal Users

The Customer Portal shall cater to client administrators with varying access levels:

#### 2.1.1 Super Admins (Company Level)

- **Description:** IT or network administrators responsible for managing Wi-Fi networks across all client sites
- **Access Level:** Full access to all reports, user & policy configurations and settings for the entire company
- **Primary Requirements:**
  - Monitor overall network health and performance across all sites
  - Analyze data usage trends across regions, sites, and users
  - Identify and address network issues proactively
  - Manage user access and policies
  - Generate reports for billing and other operational processes

#### 2.1.2 Site Admins (Site Level)

- **Description:** IT or network administrators responsible for managing Wi-Fi networks at specific sites
- **Access Level:** Access to reports, configurations, and users specific to their assigned sites
- **Primary Requirements:**
  - Monitor site-level network performance and user activity
  - Identify and troubleshoot issues at individual sites
  - Manage user access and policies for their sites
  - Generate reports for site-specific analysis

### 2.2 Internal Portal Users

| Role | Description | Access |
|------|-------------|--------|
| **Super Admin** | Full platform management | All features including bulk operations |
| **Deployment Engineer** | Site provisioning and configuration | Sites, Configuration |
| **Support Engineer** | Ticket management and troubleshooting | Support, Knowledge Center |
| **Network Operations** | Site monitoring and maintenance | Dashboard, Sites, Alerts |
| **Account Manager** | Customer relationship management | Customers, Reports |

---

## 3. User Interface and User Experience (UI/UX) Requirements

### 3.1 General UI/UX Requirements

| Requirement | Description |
|-------------|-------------|
| **Modern Interface** | Clean, professional design with consistent visual language |
| **Intuitive Navigation** | Clear navigation paths with minimal clicks to reach features |
| **Visual Hierarchy** | Clear distinction between primary and secondary actions |
| **Consistent Components** | Uniform styling for buttons, forms, tables, and modals |
| **Feedback Mechanisms** | Immediate visual feedback for all user actions |
| **Error Handling** | Clear, actionable error messages with guidance |

### 3.2 Layout Requirements

#### 3.2.1 Header

- **Position:** Fixed at top of viewport
- **Height:** 60px (desktop), 56px (mobile)
- **Contents:**
  - Logo/Brand (left-aligned)
  - Search functionality (center, collapsible on mobile)
  - Notifications icon with badge count
  - User profile dropdown (right-aligned)
  - Theme toggle (light/dark mode)

#### 3.2.2 Sidebar Navigation

- **Position:** Fixed left sidebar (desktop), Overlay drawer (mobile)
- **Width:** 240px expanded, 64px collapsed (desktop)
- **Behavior:**
  - Collapsible with toggle button
  - Hover expansion when collapsed
  - Active state highlighting for current page
  - Nested menu support with expand/collapse
  - Smooth transition animations (300ms)

#### 3.2.3 Main Content Area

- **Layout:** Fluid width, responsive padding
- **Padding:** 24px (desktop), 16px (tablet), 12px (mobile)
- **Max Width:** 1440px for optimal readability
- **Scrolling:** Vertical scroll only, smooth scroll behavior

#### 3.2.4 Footer

- **Position:** Fixed at bottom or after content (depending on page)
- **Height:** 48px
- **Contents:** Copyright, version info, quick links

### 3.3 Color Scheme Requirements

#### 3.3.1 Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Blue | #004AAD | Primary actions, links, active states |
| Secondary Blue | #0066CC | Secondary elements, hover states |
| Dark Navy | #153874 | Headers, text emphasis |

#### 3.3.2 Semantic Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Success Green | #10B981 | Success states, active status |
| Warning Amber | #F59E0B | Warning states, suspended status |
| Error Red | #EF4444 | Error states, blocked status, critical alerts |
| Info Blue | #3B82F6 | Informational messages |

#### 3.3.3 Status Badge Colors

| Status | Background | Text |
|--------|------------|------|
| Active / Online | Green (#10B981) | White |
| Suspended / Degraded | Amber (#F59E0B) | White |
| Blocked / Offline | Red (#EF4444) | White |
| Maintenance | Purple (#8B5CF6) | White |

### 3.4 Typography Requirements

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (Page Title) | System Font | 28px | 700 (Bold) |
| H2 (Section Title) | System Font | 22px | 600 (Semi-bold) |
| H3 (Card Title) | System Font | 18px | 600 (Semi-bold) |
| Body Text | System Font | 14px | 400 (Regular) |
| Small Text | System Font | 12px | 400 (Regular) |
| Button Text | System Font | 14px | 600 (Semi-bold) |
| Table Header | System Font | 12px | 700 (Bold) |
| Table Cell | System Font | 14px | 400 (Regular) |

### 3.5 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline spacing, icon gaps |
| sm | 8px | Tight spacing, badge padding |
| md | 16px | Standard spacing, card padding |
| lg | 24px | Section spacing |
| xl | 32px | Page section gaps |
| 2xl | 48px | Major section separation |

### 3.6 Dark Mode Requirements

- **Toggle:** User-controlled toggle in header
- **Persistence:** Store preference in localStorage
- **Transition:** Smooth 200ms transition between modes
- **Coverage:** All UI elements must support both themes
- **Contrast:** Maintain WCAG AA contrast ratios in both modes

### 3.7 Accessibility Requirements

| Requirement | Standard |
|-------------|----------|
| Color Contrast | WCAG 2.1 Level AA (4.5:1 minimum) |
| Keyboard Navigation | Full keyboard accessibility |
| Focus Indicators | Visible focus states on all interactive elements |
| Screen Reader | ARIA labels on all non-text elements |
| Touch Targets | Minimum 44x44px touch targets on mobile |

---

## 4. Front-End Technical Requirements

### 4.1 Responsive Design Requirements

#### 4.1.1 Breakpoints

| Breakpoint | Width | Target Device |
|------------|-------|---------------|
| Mobile | < 600px | Smartphones |
| Tablet | 600px - 900px | Tablets, small laptops |
| Desktop | 900px - 1200px | Laptops, monitors |
| Large Desktop | > 1200px | Large monitors |

#### 4.1.2 Responsive Behaviors

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Overlay drawer | Overlay drawer | Fixed sidebar |
| Data Tables | Card view or horizontal scroll | Horizontal scroll | Full table |
| Grid Cards | 1 column | 2 columns | 3-4 columns |
| Modal Width | 95% viewport | 80% viewport | 600px max |
| Charts | Simplified/stacked | Side-by-side | Side-by-side |
| Search Bar | Icon + expandable | Partial width | Full width |

#### 4.1.3 Mobile-Specific Requirements

- Touch-friendly controls (minimum 44px tap targets)
- Swipe gestures for navigation drawers
- Pull-to-refresh on list pages
- Bottom navigation bar for primary actions
- Collapsible filters panel
- Floating action button for primary actions

### 4.2 Pagination Requirements

#### 4.2.1 Standard Pagination

| Requirement | Specification |
|-------------|---------------|
| Default Page Size | 10 rows |
| Page Size Options | 10, 25, 50, 100 |
| Navigation | First, Previous, Page Numbers, Next, Last |
| Display Format | "Showing X-Y of Z entries" |
| URL State | Page number in URL query parameter |
| Loading State | Show skeleton loader during page change |

#### 4.2.2 Pagination UI

```
[First] [<] [1] [2] [3] ... [10] [>] [Last]  |  Rows per page: [10 ▼]  |  Showing 1-10 of 156
```

#### 4.2.3 Mobile Pagination

- Simplified: Previous/Next buttons only
- Infinite scroll option for list views
- "Load More" button as alternative

### 4.3 Sorting Requirements

#### 4.3.1 Table Sorting

| Requirement | Specification |
|-------------|---------------|
| Sort Indicator | Arrow icon (↑ ascending, ↓ descending) |
| Default Sort | By date/time column, descending |
| Multi-Column | Not required (single column sort) |
| Click Behavior | Cycle: None → Ascending → Descending → None |
| Persistence | Maintain sort on filter/search changes |
| URL State | Sort column and direction in URL |

#### 4.3.2 Sortable Columns by Page

| Page | Sortable Columns |
|------|------------------|
| User List | All columns except Actions |
| Device List | All columns except Actions |
| Activity Logs | Timestamp, Action, Entity, Target, Performed By |
| Reports | Report Name, Category, Last Run |

### 4.4 Filtering Requirements

#### 4.4.1 Filter Types

| Filter Type | UI Component | Behavior |
|-------------|--------------|----------|
| Single Select | Dropdown | One option at a time |
| Multi-Select | Checkbox dropdown | Multiple selections |
| Date Range | Date picker | Start and end dates |
| Search | Text input | Real-time filtering |
| Toggle | Switch | Boolean on/off |

#### 4.4.2 Filter Panel Behavior

- **Desktop:** Inline filter bar above data table
- **Mobile:** Collapsible filter panel with toggle button
- **Apply:** Immediate (no submit button) or explicit Apply button for complex filters
- **Clear:** "Clear All Filters" button when any filter active
- **Badge:** Show active filter count on mobile toggle

#### 4.4.3 Standard Filters by Page

| Page | Available Filters |
|------|-------------------|
| User List | Status, Segment, Site (company view), Search |
| Device List | Type, Sub-type, Status, Site (company view), Search |
| Activity Logs | Category, Action, Date Range, Search |
| Sites (Internal) | Status, Region, Type, Customer, Search |
| Customers (Internal) | Status, Industry, Search |

#### 4.4.4 Filter Persistence

- Maintain filters during session
- Clear on page navigation away
- Option to save filter presets (future)

### 4.5 Search Requirements

#### 4.5.1 Search Behavior

| Requirement | Specification |
|-------------|---------------|
| Debounce | 300ms delay before search execution |
| Minimum Characters | 2 characters to trigger search |
| Case Sensitivity | Case-insensitive |
| Highlighting | Highlight matched text in results |
| Clear Button | "X" icon to clear search input |
| Placeholder | Context-specific hint text |

#### 4.5.2 Searchable Fields by Page

| Page | Searchable Fields |
|------|-------------------|
| User List | User ID, Name, Email, Mobile |
| Device List | Device Name, MAC Address, Owner Name |
| Activity Logs | Target, Performer, Details, Log ID |
| Sites | Site Name, Customer Name, City |
| Customers | Company Name, Contact Email, Industry |

#### 4.5.3 Global Search (Header)

- Search across current section
- Dropdown suggestions as you type
- Recent searches history (last 5)
- Keyboard shortcut: Ctrl/Cmd + K

### 4.6 Scrolling & Performance Requirements

#### 4.6.1 Scroll Optimization

| Requirement | Specification |
|-------------|---------------|
| Smooth Scroll | CSS `scroll-behavior: smooth` |
| Scroll to Top | Button appears after scrolling 200px |
| Sticky Headers | Table headers stick on scroll |
| Virtual Scrolling | For lists > 100 items |
| Lazy Loading | Images and heavy content |

#### 4.6.2 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Bundle Size (Initial) | < 500KB gzipped |

#### 4.6.3 Loading States

| State | UI Treatment |
|-------|--------------|
| Page Load | Full-page skeleton |
| Data Fetch | Table/card skeleton |
| Action Processing | Button spinner + disabled state |
| Background Refresh | Subtle indicator (not blocking) |
| Error State | Error message with retry button |

### 4.7 Data Table Requirements

#### 4.7.1 Table Features

| Feature | Requirement |
|---------|-------------|
| Column Resize | Optional drag-to-resize |
| Column Reorder | Not required |
| Column Visibility | Toggle columns via dropdown |
| Row Selection | Checkbox for bulk actions |
| Row Actions | Dropdown menu or icon buttons |
| Row Hover | Highlight row on hover |
| Row Click | Navigate to detail view (optional) |
| Empty State | Illustrated empty state with message |

#### 4.7.2 Table Responsive Behavior

- **Desktop:** Full table with all columns
- **Tablet:** Horizontal scroll with priority columns visible
- **Mobile:** Card view transformation or horizontal scroll

#### 4.7.3 Column Priority (Mobile)

| Priority | Columns Shown |
|----------|---------------|
| High | ID, Name, Status |
| Medium | Key metrics (1-2 columns) |
| Low | Hidden, accessible via expand |

### 4.8 Form Requirements

#### 4.8.1 Form Validation

| Validation | Timing |
|------------|--------|
| Required Fields | On blur and on submit |
| Format Validation | On blur (email, phone, MAC) |
| Async Validation | On blur with debounce (uniqueness checks) |
| Form-Level | On submit |

#### 4.8.2 Validation Messages

- Display below the field
- Red color (#EF4444) for errors
- Clear message when corrected
- Scroll to first error on submit

#### 4.8.3 Form Field States

| State | Visual Treatment |
|-------|------------------|
| Default | Standard border |
| Focus | Primary color border + shadow |
| Valid | Green border (optional) |
| Error | Red border + error message |
| Disabled | Grayed out, not editable |
| Read-only | No border, text display |

### 4.9 Modal & Dialog Requirements

#### 4.9.1 Modal Sizes

| Size | Width | Use Case |
|------|-------|----------|
| Small | 400px | Confirmations, alerts |
| Medium | 600px | Forms, details |
| Large | 800px | Complex forms, tables |
| Full | 95% viewport | Report views, bulk operations |

#### 4.9.2 Modal Behavior

- **Backdrop:** Semi-transparent overlay (rgba(0,0,0,0.5))
- **Close:** X button, backdrop click, Escape key
- **Animation:** Fade in/out (200ms)
- **Scroll:** Modal body scrolls, header/footer fixed
- **Focus Trap:** Tab cycling within modal
- **Stack:** Support nested modals (max 2 levels)

### 4.10 Toast Notification Requirements

#### 4.10.1 Toast Types

| Type | Color | Icon | Duration |
|------|-------|------|----------|
| Success | Green | Checkmark | 3 seconds |
| Error | Red | X icon | 5 seconds (or manual dismiss) |
| Warning | Amber | Warning icon | 4 seconds |
| Info | Blue | Info icon | 3 seconds |

#### 4.10.2 Toast Behavior

- **Position:** Top-right (desktop), Top-center (mobile)
- **Stack:** Maximum 3 visible, queue others
- **Animation:** Slide in from right, fade out
- **Dismiss:** Click X or swipe (mobile)
- **Action:** Optional action button in toast

### 4.11 Chart & Visualization Requirements

#### 4.11.1 Chart Types Required

| Chart Type | Use Case |
|------------|----------|
| Line Chart | Trends over time (usage, growth) |
| Bar Chart | Comparisons (users by tier, devices by site) |
| Donut/Pie | Distribution (status breakdown) |
| Progress Ring | Utilization (license usage) |
| Stacked Bar | Composition over time |

#### 4.11.2 Chart Interactions

- **Hover:** Tooltip with exact values
- **Legend:** Clickable to toggle series
- **Responsive:** Resize with container
- **Export:** Download as PNG/SVG
- **Animation:** Smooth transitions on data change

### 4.12 Export Requirements

#### 4.12.1 Export Formats

| Format | Use Case | Contents |
|--------|----------|----------|
| CSV | Data export for analysis | Raw data, all columns |
| PDF | Reports, formal documents | Formatted with branding |
| Excel | Data export (future) | Raw data with formatting |

#### 4.12.2 Export Behavior

- Show loading indicator during generation
- Download automatically when ready
- Filename format: `{PageName}_{Date}_{Time}.{ext}`
- Include applied filters in export metadata

---

## 5. Key User Flows

### 5.1 Customer Portal User Flows

1. **Dashboard Overview:** View key metrics, charts, and recent activities
2. **User Registration:** Create new user with segment-specific fields
3. **User Status Change:** Suspend, activate, or block a user
4. **Device Registration:** Register user device or smart/digital device
5. **Report Generation:** Select report, apply criteria, view/export
6. **Activity Review:** Search and filter activity logs

### 5.2 Internal Portal User Flows

1. **Platform Monitoring:** Review dashboard metrics and alerts
2. **Site Provisioning:** Multi-step wizard to provision new site
3. **Customer Onboarding:** Create customer account and initial site
4. **Ticket Resolution:** Review, respond, and close support tickets
5. **Bulk Operations:** Upload CSV, validate, execute batch action

---

## 6. Customer Portal - Dashboard

### 6.1 Functional Requirements

The Dashboard shall provide a centralized overview of network status, usage metrics, and quick access to key functions.

### 6.2 Site-Level Dashboard Requirements

#### 6.2.1 Summary Metric Cards

The dashboard shall display summary cards with the following metrics:

| Card | Data | Visual Element |
|------|------|----------------|
| Active Users | Count with trend indicator (+/-) | Number with arrow icon |
| License Usage | Percentage of allocated licenses | Progress bar |
| Data Usage | Total data in TB/GB | Number with unit |
| Network Uptime | Availability percentage | Number with status color |

**Card UI Requirements:**
- Card height: 120px minimum
- Icon on left or top
- Large number display (24px font)
- Trend indicator below (up arrow green, down arrow red)
- Responsive: 2x2 grid on tablet, stack on mobile

#### 6.2.2 Charts Section

| Chart | Type | Data |
|-------|------|------|
| Network Usage | Line Chart | Daily/weekly data usage over time |
| Users by Speed Tier | Bar Chart | Distribution across speed policies |
| Peak Usage Hours | Bar Chart | Usage by time of day |

**Chart UI Requirements:**
- Chart container height: 300px
- Responsive resize on window change
- Legend below chart on mobile
- Tooltips on hover with exact values
- Grid lines: light gray, horizontal only

#### 6.2.3 Recent Activity Carousel

- Display last 24 hours of activities
- Carousel with 3 items visible (desktop)
- Auto-scroll every 5 seconds (pausable)
- Manual navigation arrows
- Activity card: Icon, title, timestamp, optional amount

#### 6.2.4 Quick Actions

Permission-based action buttons:

| Action | Permission Required | Icon |
|--------|---------------------|------|
| Add User | canEditUsers | Plus icon |
| View Users | canEditUsers | Users icon |
| View Reports | canViewReports | Chart icon |
| Knowledge Center | None | Book icon |
| Activity Logs | canViewLogs | History icon |

**Quick Actions UI:**
- Grid layout: 4-5 items per row (desktop)
- Card style with icon above text
- Hover effect: lift shadow
- Disabled state for lacking permissions

### 6.3 Company-Level Dashboard Requirements

When viewing at company level, additional sections shall display:

#### 6.3.1 Company-Wide Metrics

Additional cards:
- Total Sites (with active count)
- Total Users (aggregate)
- Total Devices (aggregate)
- Active Alerts (count)

#### 6.3.2 Sites Overview Component

- Grid of site cards showing status
- Status indicators: Online (green), Degraded (amber), Offline (red)
- Click to drill-down to site
- Search and filter capabilities

#### 6.3.3 Company Analytics

- Users by Site (horizontal bar chart)
- Devices by Site (horizontal bar chart)
- Bandwidth by Site (horizontal bar chart)

### 6.4 Segment-Specific Requirements

Dashboard metrics shall reflect segment-specific data patterns and terminology appropriate to each segment (Enterprise, Co-Living, Co-Working, Hotel, PG, Miscellaneous).

---

## 7. Customer Portal - User Management

### 7.1 User Status Model

Users shall have one of the following statuses:

| Status | Definition | Visual | Transitions To |
|--------|------------|--------|----------------|
| **Active** | User can connect to Wi-Fi | Green badge | Suspended, Blocked |
| **Suspended** | Temporarily restricted (reversible) | Amber badge | Active, Blocked |
| **Blocked** | Permanently restricted (irreversible) | Red badge | None |

### 7.2 User Registration Requirements

#### 7.2.1 General Requirements

- Registration subject to Active User License availability
- Default status: Active
- Required permission: `canEditUsers`
- Available at: Site, Cluster, City, Company access levels

#### 7.2.2 Registration Form UI

- Multi-section form with clear groupings
- Required fields marked with asterisk (*)
- Real-time validation on blur
- Policy selection with details preview
- Cancel and Submit buttons

#### 7.2.3 Segment-Specific Fields

##### Enterprise (Offices)

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| User ID | Text | Yes | Text input with uniqueness validation |
| First Name | Text | Yes | Text input |
| Last Name | Text | Yes | Text input |
| Email | Email | Yes | Email input with format validation |
| Mobile | Phone | Yes | Phone input with country code |
| User Policy | Select | Yes | Dropdown with policy details |
| Department | Text | No | Text input |
| Job Title | Text | No | Text input |

##### Co-Living (Short-stay & Long-stay)

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| User ID | Text | Yes | Text input |
| First Name | Text | Yes | Text input |
| Last Name | Text | Yes | Text input |
| Mobile | Phone | Yes | Phone input |
| Resident Type | Select | Yes | Radio buttons (Long Term / Short Term) |
| User Policy | Select | Yes | Dropdown |
| Email | Email | No | Email input |
| Check-in Date | Date | Conditional* | Date picker |
| Check-in Time | Time | Conditional* | Time picker |
| Check-out Date | Date | Conditional* | Date picker with warning |
| Check-out Time | Time | Conditional* | Time picker, default 2:00 PM |
| Room Number | Text | No | Text input |
| Organization | Text | No | Text input |

*Required when Resident Type = Short Term

**Conditional Display:** Check-in/Check-out fields shall only appear when "Short Term" is selected.

##### Co-Working

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| Member ID | Text | Yes | Text input |
| First Name | Text | Yes | Text input |
| Last Name | Text | Yes | Text input |
| Mobile | Phone | Yes | Phone input |
| Email | Email | Yes | Email input |
| Member Type | Select | Yes | Radio buttons (Permanent / Temporary) |
| User Policy | Select | Yes | Dropdown |
| Move-in Date | Date | Conditional* | Date picker |
| Move-out Date | Date | Conditional* | Date picker with warning |
| Company | Text | No | Text input |
| Desk Number | Text | No | Text input |

*Required when Member Type = Temporary

##### Hotel

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| User ID | System | Auto | Read-only display |
| First Name | Text | Yes | Text input |
| Last Name | Text | Yes | Text input |
| Room Number | Text | Yes | Text input |
| Check-in Date | Date | Yes | Date picker, default today |
| Check-in Time | Time | Yes | Time picker, default now |
| Check-out Date | Date | Yes | Date picker with auto-deactivation warning |
| Check-out Time | Time | Yes | Time picker, default 2:00 PM |
| User Policy | Select | Yes | Dropdown |
| Mobile | Phone | No | Phone input |
| Email | Email | No | Email input |
| Guest ID | Text | No | Text input |

##### PG

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| User ID | System | Auto | Read-only display |
| Mobile | Phone | Yes | Phone input |
| User Policy | Select | Yes | Dropdown |
| First Name | Text | No | Text input |
| Last Name | Text | No | Text input |
| Email | Email | No | Email input |
| Room Number | Text | No | Text input |

##### Miscellaneous

| Field | Type | Required | UI Component |
|-------|------|----------|--------------|
| User ID | Text | Yes | Text input |
| First Name | Text | Yes | Text input |
| Last Name | Text | Yes | Text input |
| Mobile | Phone | Yes | Phone input |
| User Policy | Select | Yes | Dropdown |
| Email | Email | No | Email input |

### 7.3 User List Requirements

#### 7.3.1 List Columns

| Column | Sortable | Width |
|--------|----------|-------|
| User ID | Yes | 120px |
| First Name | Yes | 120px |
| Last Name | Yes | 120px |
| Mobile | Yes | 130px |
| Email | Yes | 200px |
| Policy | No | 180px |
| Devices | Yes | 80px |
| Status | Yes | 100px |
| Registration | Yes | 120px |
| Last Online | Yes | 140px |
| Site* | Yes | 150px |
| Actions | No | 80px |

*Site column only shown in Company View

#### 7.3.2 Policy Display

Policy column shall show formatted policy:
```
50 Mbps | 100 GB | 3 Devices | Monthly
```

#### 7.3.3 Search and Filter Requirements

**Search:**
- Searchable: User ID, First Name, Last Name, Email, Mobile
- Debounce: 300ms
- Minimum: 2 characters

**Filters:**
| Filter | Type | Options |
|--------|------|---------|
| Status | Single Select | All, Active, Suspended, Blocked |
| Segment | Multi-Select | All segments (company view) |
| Site | Single Select | All sites (company view) |

#### 7.3.4 Pagination

- Default: 10 rows per page
- Options: 10, 25, 50, 100
- URL state persistence

#### 7.3.5 Bulk Actions

- Select multiple users via checkboxes
- Bulk export to CSV
- Bulk status change (if permitted)

### 7.4 User Detail View Requirements

#### 7.4.1 Modal Layout

- **Header:** User name, status badge, close button
- **Body Sections:**
  - Basic Information (ID, name, contact)
  - Policy Details (speed, data, devices, cycle)
  - Account Information (registration date, last login)
  - Devices (list of registered devices)
- **Footer:** Edit button, Close button

### 7.5 User Status Change Requirements

#### 7.5.1 Suspend User

- **Trigger:** Action menu or Edit modal
- **Confirmation:** Modal with reason input (optional)
- **Effect:** Status → Suspended, cannot connect
- **Reversible:** Yes

#### 7.5.2 Activate User

- **Trigger:** Action menu (only for Suspended users)
- **Confirmation:** Simple confirmation modal
- **Effect:** Status → Active, can connect
- **Audit:** Log activation with timestamp

#### 7.5.3 Block User

- **Trigger:** Action menu
- **Confirmation:** Enhanced warning modal
  - Warning icon
  - "This action is irreversible" message
  - Reason input (required)
  - Confirm button with danger styling
- **Effect:** Status → Blocked, permanent restriction
- **Reversible:** No

### 7.6 User Policy Requirements

#### 7.6.1 Policy Components

| Component | Monthly Options | Daily Options |
|-----------|-----------------|---------------|
| Speed | 5, 10, 25, 50, 75, 100, 150, 200 Mbps, Unlimited | Same |
| Data Volume | 10, 25, 50, 100, 200, 500 GB, 1 TB, Unlimited | 0.5, 1, 2, 3, 5, 10, 25, 50, 100 GB, Unlimited |
| Device Limit | 1, 2, 3, 4, 5, Unlimited | Same |
| Cycle Type | Monthly, Daily | N/A |

### 7.7 License Management Display

#### 7.7.1 License Ring Component

- **Type:** Circular progress indicator
- **Position:** Above user table
- **Display:**
  - Center: "X / Y" (active / total)
  - Ring: Filled portion shows usage
  - Color: Green (<70%), Amber (70-90%), Red (>90%)
- **Size:** 80px diameter

### 7.8 Bulk Import Requirements

#### 7.8.1 Import Process

1. Click "Bulk Import" button
2. Download CSV template
3. Upload filled CSV file
4. Validation preview with error highlighting
5. Confirm import
6. Progress indicator
7. Results summary (success/failure counts)

#### 7.8.2 CSV Template Fields

```csv
user_id,first_name,last_name,email,mobile,policy_id
```

#### 7.8.3 Validation

- Required field check
- Format validation (email, phone)
- Uniqueness check (user_id)
- Policy existence check
- License availability check

---

## 8. Customer Portal - Device Management

### 8.1 Device Types

#### 8.1.1 User Devices

| Type | Icon | Description |
|------|------|-------------|
| Mobile | Phone icon | Smartphones |
| Laptop | Laptop icon | Notebooks, laptops |
| Tablet | Tablet icon | Tablets, iPads |
| Smart Speaker | Speaker icon | Voice assistants |
| Miscellaneous | Question icon | Other devices |

#### 8.1.2 Smart/Digital Devices

Availability by segment:

| Device | Enterprise | Co-Living | Co-Working | Hotel | PG |
|--------|------------|-----------|------------|-------|-----|
| Camera | ✓ | ✓ | ✓ | ✓ | ✓ |
| CCTV | ✓ | ✓ | ✓ | ✓ | ✓ |
| DVR | ✓ | ✓ | ✓ | ✓ | ✓ |
| Biometric | ✓ | ✓ | ✓ | ✓ | ✗ |
| Sensor | ✓ | ✓ | ✗ | ✓ | ✗ |
| Printer | ✓ | ✗ | ✓ | ✗ | ✗ |
| IoT | ✓ | ✗ | ✗ | ✗ | ✗ |
| Smart TV | ✓ | ✓ | ✓ | ✓ | ✓ |
| Access Control | ✓ | ✓ | ✓ | ✓ | ✓ |
| Intercom | ✓ | ✓ | ✗ | ✗ | ✗ |
| POS | ✓ | ✗ | ✗ | ✗ | ✗ |
| Display | ✓ | ✗ | ✓ | ✗ | ✗ |
| Kiosk | ✓ | ✗ | ✗ | ✗ | ✗ |

### 8.2 Device Registration Requirements

#### 8.2.1 Registration Form

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Device Name | Text | Yes | Max 50 characters |
| MAC Address | Text | Yes | Format: XX:XX:XX:XX:XX:XX |
| Device Category | Select | Yes | From available types |
| Owner/User | Search Select | No* | User lookup |

*Required for User Devices, optional for Digital Devices

#### 8.2.2 MAC Address Validation

- Format validation (colon or hyphen separated)
- Vendor lookup (OUI database)
- Duplicate detection within site
- Display vendor name after validation

### 8.3 Device List Requirements

#### 8.3.1 View Toggle

Two view modes shall be available:

**Grid View:**
- Card-based layout
- 3 cards per row (desktop), 2 (tablet), 1 (mobile)
- Card contents: Icon, Name, MAC, Owner, Status, Actions menu

**List View:**
- Table format
- Columns: Name, MAC, Category, Owner, IP, Status, Last Connected, Data Usage, Actions

#### 8.3.2 Filtering Requirements

| Filter | Type | Options |
|--------|------|---------|
| Primary Type | Tabs | All, User Devices, Smart/Digital |
| Sub-Type | Multi-Select | Dynamic based on primary type |
| Status | Single Select | All, Online, Offline, Blocked |
| Site | Single Select | (Company view only) |

#### 8.3.3 Status Indicators

| Status | Badge Color | Icon |
|--------|-------------|------|
| Online | Green | Filled circle |
| Offline | Gray | Empty circle |
| Blocked | Red | X icon |

### 8.4 Device Actions

| Action | Permission | Confirmation |
|--------|------------|--------------|
| Edit Name | allowDeviceEdit | No |
| Disconnect | canManageDevices | Warning if offline |
| Delete | allowDeviceDelete | Yes, with warning |

### 8.5 Device Statistics Cards

| Card | Data | Icon |
|------|------|------|
| Total Devices | Count by segment | Devices icon |
| Online Now | Real-time count | Signal icon |
| Offline | Count | Signal off icon |
| Access Points | AP count | Router icon |

---

## 9. Customer Portal - Reports

### 9.1 Report Categories

| Category | Reports Included |
|----------|------------------|
| Billing | Active users, policy-wise summaries |
| Usage | Data consumption reports |
| Wi-Fi Network | AP list, client list, uptime |
| User | Registration, status reports |
| Authentication | Login activity, auth failures |
| Upsell | Top-up transactions |

### 9.2 Report Dashboard UI Requirements

#### 9.2.1 Layout

- **Header:** "Reports" title, search bar
- **Categories:** Horizontal tabs or sidebar
- **Report Cards:** Grid of report cards per category
- **Pinned Reports:** Top section for favorites (max 6)
- **Recent Reports:** Section showing last 5 accessed

#### 9.2.2 Report Card

- Report name (title)
- Short description
- Category tag
- Pin/unpin icon
- Run button

### 9.3 Report Execution Flow

1. Click report card → Open criteria modal
2. Set criteria (date range, filters)
3. Click "Generate Report"
4. Show loading state
5. Display report in modal/page
6. Export options (CSV, PDF)

### 9.4 Report Viewer Requirements

#### 9.4.1 Table Reports

- Standard data table with sorting
- Column headers from report definition
- Pagination for large datasets
- Export buttons (CSV, PDF)

#### 9.4.2 Chart Reports

- Chart visualization above data table
- Chart type based on report definition
- Interactive tooltips
- Legend with toggle
- Export chart as image

### 9.5 Export Requirements

| Format | Contents | Filename |
|--------|----------|----------|
| CSV | Raw data, headers | {ReportName}_{Date}.csv |
| PDF | Formatted with branding, charts | {ReportName}_{Date}.pdf |

---

## 10. Customer Portal - Knowledge Center

### 10.1 Content Structure

| Section | Content Type |
|---------|--------------|
| Home | Overview, featured content |
| Getting Started | Onboarding guides |
| Video Tutorials | Embedded videos |
| FAQ | Q&A format |

### 10.2 UI Requirements

#### 10.2.1 Home Section

- Hero area with search bar
- Featured articles carousel
- Quick links grid
- Popular FAQs list

#### 10.2.2 Article View

- Full article in modal or dedicated page
- Back navigation
- Related articles sidebar
- Print-friendly option

#### 10.2.3 Video Player

- Embedded video player
- Duration display
- Transcript (optional)
- Related videos

#### 10.2.4 FAQ Section

- Accordion layout
- Expand/collapse all
- Search within FAQs
- Category filtering

### 10.3 Search Requirements

- Full-text search across all content
- Search results grouped by type
- Highlight matching text
- Filter by content type

---

## 11. Customer Portal - Activity Logs

### 11.1 Log Entry Fields

| Field | Description | Display |
|-------|-------------|---------|
| Timestamp | Date and time | DD MMM YYYY, HH:MM |
| Log ID | Unique identifier | LOG-XXX-0001 |
| Action | CREATE, UPDATE, DELETE | Badge with icon |
| Entity | User, Device, Policy | Text |
| Category | user, device, system | Badge |
| Target | Affected entity name | Text |
| Performed By | Administrator name | Text with avatar |
| Details | Description | Text |
| IP Address | Source IP | Text |
| Site* | Site name | Badge (company view) |

### 11.2 Filtering Requirements

| Filter | Type | Options |
|--------|------|---------|
| Search | Text | Target, performer, details |
| Category | Multi-Select | User, Device, System |
| Action | Multi-Select | CREATE, UPDATE, DELETE |
| Date Range | Preset + Custom | Last 24h, 7d, 14d, 30d, Custom |
| Site | Single Select | (Company view only) |

### 11.3 Table Requirements

- Sortable columns: Timestamp, Action, Entity, Target, Performed By
- Default sort: Timestamp descending
- Pagination: 20 rows default
- Row expansion for full details

### 11.4 Export

- CSV export with filters applied
- All visible columns included
- Filename: ActivityLogs_{Date}.csv

---

## 12. Internal Portal - Overview

### 12.1 Purpose

The Internal Spectra User Portal shall provide Spectra staff with tools to manage customers, sites, configurations, support tickets, and platform operations.

### 12.2 Access Requirement

All internal portal pages shall require the `canAccessInternalPortal` permission.

### 12.3 Navigation Structure

| Route | Page | Description |
|-------|------|-------------|
| /internal/dashboard | Dashboard | Executive overview |
| /internal/sites | Site Management | Site provisioning and monitoring |
| /internal/customers | Customer Management | Customer accounts |
| /internal/logs | Audit Logs | Staff activity tracking |
| /internal/config | Configuration | System settings |
| /internal/knowledge | Knowledge Center | Staff documentation |
| /internal/reports | Reports | Internal analytics |
| /internal/support | Support Queue | Ticket management |
| /internal/bulk-operations | Bulk Operations | Batch operations |

---

## 13. Internal Portal - Dashboard

### 13.1 Metrics Cards

| Metric | Data | Trend |
|--------|------|-------|
| Customers | Total (active) | Month-over-month |
| Sites | Total (active) | Month-over-month |
| Users | Total (active) | Month-over-month |
| Devices | Total (online) | N/A |
| License Utilization | Percentage | N/A |
| Bandwidth | Used / Provisioned | N/A |

### 13.2 Dashboard Sections

#### 13.2.1 Site Health Overview

- Status breakdown: Online, Degraded, Offline, Maintenance
- Clickable status filters
- Platform uptime bar

#### 13.2.2 Active Alerts

- Critical, Warning, Info counts
- List of unacknowledged alerts (max 5)
- Link to full alerts

#### 13.2.3 Sites Needing Attention

- Table: Site, Customer, Status, Issue, Action
- Filter: Offline, Degraded, Critical alerts
- Direct navigation to site

#### 13.2.4 Support Tickets

- Open tickets summary
- Priority distribution
- Quick access to queue

#### 13.2.5 Regional Performance

- Breakdown by region
- Sites, users, devices per region
- Bar chart visualization

#### 13.2.6 Segment Breakdown

- Distribution by segment
- Site counts per segment
- Pie/donut chart

#### 13.2.7 Recent Activity

- Timeline of latest 8 activities
- Staff action attribution
- Timestamp display

---

## 14. Internal Portal - Customer Management

### 14.1 Customer Data Fields

| Category | Fields |
|----------|--------|
| Basic | ID, Name, Type, Industry, Segment |
| Status | active, inactive, suspended |
| Contract | Start Date, End Date |
| Account | Manager, Support Tier, License Tier |
| Contact | Name, Email, Phone |
| Metrics | Sites, Users, Devices |
| License | ID, Tier, Usage %, Expiry |

### 14.2 View Modes

#### 14.2.1 Grid View

- Customer cards in responsive grid
- Card contents: Name, industry, status, contact, metrics
- License usage bar
- Action dropdown

#### 14.2.2 List View

- Table format
- Sortable columns
- Row actions

### 14.3 Filtering

| Filter | Type |
|--------|------|
| Search | Name, email, industry |
| Status | All, Active, Inactive, Suspended |
| Industry | Dynamic from data |

### 14.4 Actions

| Action | Permission |
|--------|------------|
| View Details | canAccessInternalPortal |
| View Sites | canAccessInternalPortal |
| Analytics | canAccessInternalPortal |
| Edit | canManageCustomers |
| Configure | canManageCustomers |
| Delete | canManageAllCustomers |

---

## 15. Internal Portal - Site Management

### 15.1 Site Data Fields

| Category | Fields |
|----------|--------|
| Basic | ID, Customer, Name, City, State, Region |
| Type | Hotel, Co-Working, Co-Living, PG, Enterprise, Misc |
| Status | online, degraded, offline, maintenance |
| Capacity | Users (total/active), Devices (total/online) |
| Bandwidth | Usage / Limit (Mbps) |
| Health | Uptime %, Alert counts |

### 15.2 Site Provisioning Wizard

Seven-step wizard:

| Step | Fields |
|------|--------|
| 1. Customer | Select existing or create new |
| 2. Site Info | Name, type, segment, location |
| 3. Contact | Primary contact details |
| 4. Capacity | Users, devices, bandwidth limits |
| 5. Network | Config template, RADIUS, domain |
| 6. Deployment | Date, notes |
| 7. Review | Summary and confirm |

### 15.3 Filtering

| Filter | Type | Options |
|--------|------|---------|
| Search | Text | Site name, customer, city |
| Customer | Select | All customers |
| Status | Select | online, degraded, offline, maintenance |
| Region | Select | North, South, East, West |
| Type | Select | Hotel, Co-Working, etc. |

### 15.4 Health Indicators

| Uptime | Status | Color |
|--------|--------|-------|
| ≥99% | Excellent | Green |
| 95-99% | Good | Blue |
| 90-95% | Fair | Amber |
| <90% | Poor | Red |

---

## 16. Internal Portal - Audit Logs

### 16.1 Log Entry Fields

| Field | Description |
|-------|-------------|
| Timestamp | ISO format date/time |
| User Type | internal, customer, system |
| User | Staff name or system |
| Role | Support Engineer, Deployment, Super Admin, Automated |
| Action | site_provisioned, config_changed, etc. |
| Category | Configuration, User Management, etc. |
| Resource | Resource type and ID |
| Description | Human-readable |
| IP Address | Source IP |
| Severity | info, warning, critical |
| Status | success, failed |

### 16.2 Filtering

| Filter | Type |
|--------|------|
| Search | Description, user, resource |
| Category | Select |
| Severity | Select |
| Role | Select |
| Date Range | Picker |

### 16.3 Export

- CSV and PDF formats
- Filtered export support

---

## 17. Internal Portal - System Configuration

### 17.1 Configuration Sections

#### 17.1.1 Bandwidth Policies

| Field | Type |
|-------|------|
| Policy Name | Text |
| Segment | Select |
| Download Speed | Number (Mbps) |
| Upload Speed | Number (Mbps) |
| Fair Usage Limit | Number or Unlimited |
| Device Limit | Number |
| Status | active/inactive |

#### 17.1.2 Domain Configuration

| Field | Type |
|-------|------|
| Domain Name | Text |
| Domain Type | captive_portal, api, admin |
| SSL Certificate | Status, expiry |
| CNAME Record | Text |

#### 17.1.3 Advanced Settings

- RADIUS Configuration
- DHCP Settings
- VLAN Management
- DNS Configuration
- Failover Settings

### 17.2 Permissions Required

- `canAccessSystemConfig`
- `canManagePolicies`
- `canManageDomains`

---

## 18. Internal Portal - Reports

### 18.1 Report Categories

| Category | Report Count |
|----------|--------------|
| Platform Analytics | 4 |
| Customer Reports | 4 |
| Site Performance | 4 |
| Network & Bandwidth | 3 |
| Security & Compliance | 3 |
| Support & Tickets | 3 |

### 18.2 Report Features

- Date range selection
- Multi-level filtering
- Chart visualizations
- CSV and PDF export
- Report scheduling (email delivery)
- Favorite/pin reports

---

## 19. Internal Portal - Support Queue

### 19.1 Ticket Fields

| Field | Type |
|-------|------|
| Ticket ID | System generated |
| Customer | Reference |
| Site | Reference |
| Subject | Text |
| Priority | critical, high, medium, low |
| Status | open, in_progress, pending_approval, scheduled, completed |
| Category | connectivity, outage, upgrade, maintenance, compliance |
| SLA Deadline | DateTime |
| Assigned To | User reference |

### 19.2 Ticket List UI

- Color-coded priority indicators
- SLA status (on track, at risk, overdue)
- Status badges
- Quick actions

### 19.3 Ticket Actions

| Action | Description |
|--------|-------------|
| View | Open ticket detail |
| Reply | Add response |
| Status Change | Update status |
| Reassign | Assign to team |
| Add Note | Internal note |
| Close | Mark completed |

---

## 20. Internal Portal - Knowledge Center

### 20.1 Content Structure

| Type | Count | Topics |
|------|-------|--------|
| Articles | 12 | Site Config, Operations, Troubleshooting |
| Videos | 12 | Training tutorials |
| FAQs | 16 | Common questions |

### 20.2 Article Categories

- Site Configuration (3)
- Operations (2)
- Troubleshooting (3)
- Configuration (4)

### 20.3 UI Requirements

- Full article display with formatting
- Step-by-step procedure styling
- Code block formatting
- Video embed player
- FAQ accordion layout
- Full-text search

---

## 21. Internal Portal - Bulk Operations

### 21.1 Permission Requirement

`canAccessBulkOperations` (Super Admin only)

### 21.2 User Operations

| Operation | Description |
|-----------|-------------|
| Bulk Registration | CSV upload |
| Bulk Activation | Activate multiple |
| Bulk Suspension | Suspend multiple |
| Bulk Blocking | Block multiple |
| Bulk Policy Change | Update policies |
| Bulk Password Reset | Reset passwords |

### 21.3 Device Operations

| Operation | Description |
|-----------|-------------|
| Bulk Registration | CSV upload |
| Bulk Rename | Pattern-based rename |

### 21.4 Scheduled Tasks

- View scheduled operations
- Status: Pending, Running, Completed, Failed
- Cancel pending tasks
- View execution history

### 21.5 CSV Upload Flow

1. Download template
2. Populate data
3. Upload file
4. Validation preview
5. Review errors/warnings
6. Confirm execution
7. Progress tracking
8. Results report

---

## 22. Access Levels, User Roles and Permissions

### 22.1 Customer Portal Access Levels

| Level | Scope | Edit Access |
|-------|-------|-------------|
| Site | Single site | Full |
| Cluster | Multiple related sites | Full per site |
| City | All sites in city | Full per site |
| Company | All company sites | Read-only, drill-down for edit |

### 22.2 Customer Portal Permissions

| Permission | Grants |
|------------|--------|
| canViewReports | Reports, dashboard |
| canEditUsers | User CRUD |
| canManageDevices | Device CRUD |
| canViewLogs | Activity logs |

### 22.3 Internal Portal Permissions

| Permission | Grants |
|------------|--------|
| canAccessInternalPortal | Base access |
| canManageCustomers | Customer edit |
| canManageAllCustomers | Customer delete |
| canProvisionSites | Site creation |
| canManagePolicies | Policy CRUD |
| canManageDomains | Domain config |
| canAccessSystemConfig | Settings access |
| canAccessBulkOperations | Bulk features |

### 22.4 Segment-Based Capabilities

| Capability | Description |
|------------|-------------|
| allowUserDevices | User device registration |
| allowDigitalDevices | Smart device registration |
| allowDeviceEdit | Device editing |
| allowDeviceDelete | Device deletion |

---

## 23. Alerts & Notifications

### 23.1 Toast Notifications

| Type | Color | Duration | Use Case |
|------|-------|----------|----------|
| Success | Green | 3s | Action completed |
| Error | Red | 5s | Action failed |
| Warning | Amber | 4s | Attention needed |
| Info | Blue | 3s | Information |

### 23.2 System Alerts (Internal)

| Type | Color | Priority |
|------|-------|----------|
| Critical | Red | Immediate |
| Warning | Amber | Soon |
| Info | Blue | Informational |

---

## 24. API Integration Requirements

### 24.1 Customer Portal Endpoints

```
User Management:
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
PUT    /api/users/{id}/status
POST   /api/users/bulk-import
GET    /api/licenses/current

Device Management:
GET    /api/devices
POST   /api/devices
PUT    /api/devices/{id}
DELETE /api/devices/{id}
POST   /api/devices/{id}/disconnect
POST   /api/devices/bulk-import

Reports:
POST   /api/reports/execute
POST   /api/reports/{id}/export

Activity Logs:
GET    /api/audit/logs
POST   /api/audit/logs/export
```

### 24.2 Internal Portal Endpoints

```
Customers:
GET    /api/internal/customers
POST   /api/internal/customers
PUT    /api/internal/customers/{id}
DELETE /api/internal/customers/{id}

Sites:
GET    /api/internal/sites
POST   /api/internal/sites
PUT    /api/internal/sites/{id}
DELETE /api/internal/sites/{id}
GET    /api/internal/sites/{id}/health

Configuration:
GET    /api/internal/policies
POST   /api/internal/policies
PUT    /api/internal/policies/{id}
DELETE /api/internal/policies/{id}
GET    /api/internal/domains
POST   /api/internal/domains

Support:
GET    /api/internal/tickets
PUT    /api/internal/tickets/{id}/status
POST   /api/internal/tickets/{id}/reply

Bulk Operations:
POST   /api/internal/bulk/users/{operation}
POST   /api/internal/bulk/devices/{operation}
GET    /api/internal/bulk/tasks
POST   /api/internal/bulk/tasks/schedule
DELETE /api/internal/bulk/tasks/{id}
```

---

## 25. Future Considerations

### 25.1 Potential Enhancements

1. **Real-time Updates:** WebSocket for live dashboard
2. **Advanced Analytics:** Predictive analysis, ML insights
3. **Mobile Apps:** Native iOS/Android applications
4. **SSO Integration:** Enterprise single sign-on
5. **Workflow Automation:** Rules-based automation
6. **Enhanced Security:** 2FA, biometric authentication

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Spectra Team | Initial FRD |

---

*This Functional Requirements Document defines the requirements for the SpectraOne Customer Portal and Internal Spectra User Portal. Backend integration shall be implemented as per the API specifications defined herein.*
