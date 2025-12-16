# SpectraOne Portal - Functional Requirements Document (FRD)

**Document Version:** 2.0
**Document Type:** Functional Requirements Document
**Platform:** SpectraOne Managed Wi-Fi Portal
**Scope:** Customer Portal & Internal Spectra User Portal
**Last Updated:** December 2024
**Document Status:** Final

---

## Document Revision History

| Version | Date | Author | Description of Changes |
|---------|------|--------|------------------------|
| 1.0 | November 2024 | Spectra Team | Initial FRD creation |
| 2.0 | December 2024 | Spectra Team | Comprehensive expansion with detailed specifications, best practices, and implementation guidelines |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Target Users](#2-target-users)
3. [User Interface and User Experience (UI/UX) Requirements](#3-user-interface-and-user-experience-uiux-requirements)
4. [Design System Specifications](#4-design-system-specifications)
5. [Best Practices and Component Standards](#5-best-practices-and-component-standards)
6. [Front-End Technical Requirements](#6-front-end-technical-requirements)
7. [Key User Flows](#7-key-user-flows)
8. [Customer Portal - Dashboard](#8-customer-portal---dashboard)
9. [Customer Portal - User Management](#9-customer-portal---user-management)
10. [Customer Portal - Device Management](#10-customer-portal---device-management)
11. [Customer Portal - Reports](#11-customer-portal---reports)
12. [Customer Portal - Knowledge Center](#12-customer-portal---knowledge-center)
13. [Customer Portal - Activity Logs](#13-customer-portal---activity-logs)
14. [Internal Portal - Overview](#14-internal-portal---overview)
15. [Internal Portal - Dashboard](#15-internal-portal---dashboard)
16. [Internal Portal - Customer Management](#16-internal-portal---customer-management)
17. [Internal Portal - Site Management](#17-internal-portal---site-management)
18. [Internal Portal - Audit Logs](#18-internal-portal---audit-logs)
19. [Internal Portal - System Configuration](#19-internal-portal---system-configuration)
20. [Internal Portal - Reports](#20-internal-portal---reports)
21. [Internal Portal - Support Queue](#21-internal-portal---support-queue)
22. [Internal Portal - Knowledge Center](#22-internal-portal---knowledge-center)
23. [Internal Portal - Bulk Operations](#23-internal-portal---bulk-operations)
24. [Access Levels, User Roles and Permissions](#24-access-levels-user-roles-and-permissions)
25. [Alerts & Notifications](#25-alerts--notifications)
26. [Security Requirements](#26-security-requirements)
27. [Data Validation Standards](#27-data-validation-standards)
28. [Error Handling Guidelines](#28-error-handling-guidelines)
29. [Internationalization (i18n)](#29-internationalization-i18n)
30. [API Integration Requirements](#30-api-integration-requirements)
31. [Testing Requirements](#31-testing-requirements)
32. [Future Considerations](#32-future-considerations)
33. [Glossary](#33-glossary)
34. [Appendices](#34-appendices)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this Functional Requirements Document (FRD) is to comprehensively capture all functional requirements, user interface specifications, interaction patterns, and technical standards for Spectra's customer portal called **SpectraOne**. This document serves as the authoritative reference for the development team, quality assurance, product management, and stakeholders involved in the platform's development and maintenance.

This FRD covers the Managed Wi-Fi product suite and all associated products including:
- Managed Wi-Fi Infrastructure
- Network Access Management
- User and Device Provisioning
- Analytics and Reporting
- Support and Ticketing Systems

### 1.2 Scope

This document defines the functional requirements for both portal components of the SpectraOne platform:

**Customer Portal Scope:**
- Dashboard and analytics visualization
- User management and lifecycle operations
- Device registration and management
- Report generation and export
- Knowledge center and self-service resources
- Activity logging and audit trails

**Internal Portal Scope:**
- Platform-wide monitoring and dashboards
- Customer account management
- Site provisioning and configuration
- Support ticket management
- Bulk operations and batch processing
- System configuration and policy management
- Internal knowledge resources

### 1.3 Document Audience

This document is intended for:

| Audience | Purpose |
|----------|---------|
| **Development Team** | Implementation reference for all features and UI components |
| **QA Engineers** | Test case development and acceptance criteria verification |
| **UI/UX Designers** | Design system compliance and interaction pattern validation |
| **Product Managers** | Feature scope definition and prioritization |
| **Project Managers** | Timeline planning and milestone tracking |
| **Technical Writers** | User documentation and help content creation |
| **Stakeholders** | Business requirement validation and sign-off |

### 1.4 Business Objectives

The SpectraOne Portal aims to achieve the following business objectives:

#### 1.4.1 Customer Empowerment
- Enable self-service management of Wi-Fi networks without requiring technical expertise
- Reduce dependency on Spectra support for routine operations
- Provide real-time visibility into network performance and usage
- Streamline user and device provisioning processes

#### 1.4.2 Operational Efficiency
- Automate routine administrative tasks
- Reduce manual intervention in site management
- Enable bulk operations for large-scale deployments
- Provide comprehensive audit trails for compliance

#### 1.4.3 Business Intelligence
- Deliver actionable insights through analytics dashboards
- Enable data-driven decision making for capacity planning
- Support billing and reconciliation processes
- Track license utilization and optimize resource allocation

#### 1.4.4 Scalability
- Support multi-tenant architecture for diverse customer segments
- Handle growth from hundreds to thousands of sites
- Maintain performance across increasing user and device counts
- Enable regional expansion with localization support

### 1.5 Portal Components Overview

The SpectraOne platform consists of two distinct portal interfaces:

| Portal | Purpose | Primary Users | Access Method |
|--------|---------|---------------|---------------|
| **Customer Portal** | Wi-Fi network management for Spectra's enterprise customers | Client IT administrators, Network managers, Site administrators | customer.spectraone.com |
| **Internal Portal** | Platform management and operations for Spectra staff | Spectra internal teams (Support, Deployment, Operations, Management) | internal.spectraone.com |

### 1.6 Key Terminology and Definitions

| Term | Definition |
|------|------------|
| **Site** | A physical location where Spectra Managed Wi-Fi is deployed (e.g., office building, hotel property, co-living facility) |
| **Customer** | An organization that has contracted with Spectra for Managed Wi-Fi services; may have multiple sites |
| **User** | An end-user who connects to the Wi-Fi network; managed through the portal |
| **Device** | A hardware device (laptop, phone, IoT device) that connects to the network |
| **Policy** | A configuration template defining bandwidth limits, data quotas, and device allowances |
| **Segment** | A customer category (Enterprise, Co-Living, Co-Working, Hotel, PG, Miscellaneous) with specific business rules |
| **License** | An entitlement allowing a certain number of active users on a site |
| **Access Level** | The hierarchical scope of a user's permissions (Site, Cluster, City, Company) |
| **RADIUS** | Remote Authentication Dial-In User Service; protocol for network access authentication |
| **OUI** | Organizationally Unique Identifier; first 24 bits of a MAC address identifying the manufacturer |

### 1.7 Document Conventions

This document uses the following conventions:

- **SHALL/MUST:** Indicates a mandatory requirement
- **SHOULD:** Indicates a recommended requirement
- **MAY:** Indicates an optional requirement
- **[Bracketed Text]:** Placeholder for dynamic content
- `Code formatting`: Technical values, field names, API endpoints
- *Italic text*: Emphasis or references to other sections

### 1.8 References

| Document | Description |
|----------|-------------|
| SpectraOne API Specification | Technical API documentation |
| SpectraOne Brand Guidelines | Visual identity and branding standards |
| WCAG 2.1 Guidelines | Web Content Accessibility Guidelines |
| OWASP Top 10 | Security vulnerability reference |
| React Best Practices | Development framework guidelines |

### 1.9 Assumptions and Dependencies

#### 1.9.1 Assumptions
- Users have access to modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Network connectivity is available for portal access
- Backend APIs are available and responsive within SLA thresholds
- Users have basic computer literacy appropriate to their role

#### 1.9.2 Dependencies
- Backend API services must be deployed and operational
- Authentication service (OAuth 2.0 / JWT) must be available
- Database infrastructure must support required query loads
- CDN must be configured for static asset delivery
- RADIUS servers must be operational for network authentication

---

## 2. Target Users

### 2.1 Customer Portal Users

The Customer Portal serves client administrators responsible for managing Wi-Fi networks within their organizations. These users have varying technical expertise and access requirements based on their organizational role and scope of responsibility.

#### 2.1.1 Super Admins (Company Level)

**User Profile:**
- **Title:** IT Director, Network Manager, Chief Technology Officer
- **Technical Expertise:** High
- **Frequency of Use:** Daily to weekly
- **Primary Device:** Desktop/Laptop
- **Session Duration:** 15-60 minutes

**Responsibilities:**
- Strategic oversight of network infrastructure across all company sites
- Policy definition and enforcement at organizational level
- User management delegation and permission assignment
- Compliance monitoring and audit review
- Budget and license utilization tracking
- Vendor relationship management with Spectra

**Key Requirements:**

| Requirement Category | Specific Needs |
|---------------------|----------------|
| **Monitoring** | Real-time visibility into all sites' health and performance |
| **Analytics** | Cross-site comparison dashboards, trend analysis, capacity forecasting |
| **User Management** | Ability to create, modify, and deactivate users across all sites |
| **Policy Management** | Define and apply bandwidth/data policies organization-wide |
| **Reporting** | Executive summaries, billing reports, compliance documentation |
| **Delegation** | Assign site-level administrators with appropriate permissions |

**User Journey:**
1. Login to portal → View company-wide dashboard
2. Review alert notifications and site health status
3. Drill down into specific sites showing anomalies
4. Generate monthly usage reports for billing reconciliation
5. Review and approve policy change requests from site admins
6. Export compliance reports for audit purposes

**Pain Points to Address:**
- Difficulty aggregating data across multiple sites manually
- Time-consuming report generation processes
- Lack of visibility into real-time network issues
- Inconsistent policy application across sites

#### 2.1.2 Site Admins (Site Level)

**User Profile:**
- **Title:** Site IT Administrator, Facility Manager, Property Manager
- **Technical Expertise:** Medium to High
- **Frequency of Use:** Daily
- **Primary Device:** Desktop/Laptop, occasionally Tablet
- **Session Duration:** 10-30 minutes

**Responsibilities:**
- Day-to-day management of Wi-Fi network at assigned site(s)
- User provisioning and deprovisioning
- Device registration and troubleshooting
- First-level support for connectivity issues
- Local policy customization within company guidelines
- Coordination with Spectra support for escalations

**Key Requirements:**

| Requirement Category | Specific Needs |
|---------------------|----------------|
| **User Operations** | Quick user registration, status changes, password resets |
| **Device Management** | Register new devices, troubleshoot connectivity, block suspicious devices |
| **Monitoring** | Site-specific dashboards, real-time user counts, bandwidth utilization |
| **Troubleshooting** | Activity logs, device connection history, authentication failures |
| **Reporting** | Site-specific usage reports, user activity summaries |
| **Support** | Easy escalation path to Spectra support |

**User Journey:**
1. Login to portal → View site dashboard
2. Check current online users and bandwidth utilization
3. Process pending user registration requests
4. Register new devices for approved users
5. Investigate reported connectivity issues using activity logs
6. Generate weekly usage report for management

**Pain Points to Address:**
- Slow user provisioning process
- Difficulty identifying root cause of connectivity issues
- Manual tracking of device registrations
- Limited visibility into user activity patterns

#### 2.1.3 Cluster/City Admins (Multi-Site Level)

**User Profile:**
- **Title:** Regional IT Manager, Area Facility Manager
- **Technical Expertise:** Medium to High
- **Frequency of Use:** Several times per week
- **Primary Device:** Desktop/Laptop
- **Session Duration:** 20-45 minutes

**Responsibilities:**
- Oversight of multiple related sites within a cluster or city
- Cross-site resource allocation and load balancing
- Regional reporting and performance benchmarking
- Coordination between site admins
- Regional policy standardization

**Key Requirements:**

| Requirement Category | Specific Needs |
|---------------------|----------------|
| **Multi-Site View** | Aggregated dashboard for all sites in cluster/city |
| **Comparison** | Side-by-side performance metrics across sites |
| **Resource Planning** | License utilization across sites, capacity planning |
| **Standardization** | Apply consistent configurations across sites |
| **Reporting** | Regional summaries, comparative analysis |

#### 2.1.4 Read-Only Users (Viewers)

**User Profile:**
- **Title:** Finance Manager, Operations Coordinator, Auditor
- **Technical Expertise:** Low to Medium
- **Frequency of Use:** Weekly to monthly
- **Primary Device:** Desktop/Laptop
- **Session Duration:** 5-15 minutes

**Responsibilities:**
- Review reports and dashboards for business purposes
- Monitor metrics relevant to their function (billing, compliance)
- No administrative actions required

**Key Requirements:**
- Access to dashboards and reports only
- Export capabilities for data analysis
- Clear, non-technical presentation of data
- No access to configuration or management functions

### 2.2 Internal Portal Users

The Internal Portal serves Spectra staff members who manage the platform, support customers, and ensure service delivery excellence.

#### 2.2.1 Super Admin (Platform Administrator)

**User Profile:**
- **Title:** Platform Administrator, System Administrator
- **Technical Expertise:** Very High
- **Frequency of Use:** Daily
- **Primary Device:** Desktop with multiple monitors
- **Session Duration:** Extended (1-4 hours)

**Responsibilities:**
- Full platform management and configuration
- Customer and site provisioning
- System-wide policy management
- Bulk operations execution
- Platform health monitoring
- Security and compliance oversight

**Permissions:**
- `canAccessInternalPortal` - Base internal access
- `canManageCustomers` - Customer CRUD operations
- `canManageAllCustomers` - Delete customers
- `canProvisionSites` - Site creation and configuration
- `canManagePolicies` - Policy CRUD operations
- `canManageDomains` - Domain configuration
- `canAccessSystemConfig` - System settings
- `canAccessBulkOperations` - Bulk features

**Key Workflows:**
1. **New Customer Onboarding:** Create customer account → Provision initial site → Configure policies → Create admin users
2. **Bulk User Migration:** Upload CSV → Validate data → Execute bulk import → Generate results report
3. **Policy Updates:** Define new policy → Apply to segments → Monitor impact → Adjust as needed

#### 2.2.2 Deployment Engineer

**User Profile:**
- **Title:** Network Deployment Engineer, Field Engineer
- **Technical Expertise:** Very High (Network/Infrastructure)
- **Frequency of Use:** Daily during deployments
- **Primary Device:** Laptop (often on-site)
- **Session Duration:** Variable (30 minutes to several hours)

**Responsibilities:**
- Site provisioning and initial configuration
- Network equipment setup and validation
- RADIUS and authentication configuration
- Connectivity testing and validation
- Documentation of deployment details
- Handoff to operations team

**Permissions:**
- `canAccessInternalPortal`
- `canProvisionSites`
- `canAccessSystemConfig` (limited scope)

**Key Workflows:**
1. **Site Provisioning:** Create site record → Configure network parameters → Set up RADIUS → Test connectivity → Document configuration
2. **Site Validation:** Run connectivity tests → Verify bandwidth → Confirm authentication → Generate deployment report

#### 2.2.3 Support Engineer

**User Profile:**
- **Title:** Technical Support Engineer, Customer Support Specialist
- **Technical Expertise:** Medium to High
- **Frequency of Use:** Daily (continuous during shift)
- **Primary Device:** Desktop with dual monitors
- **Session Duration:** Throughout work shift

**Responsibilities:**
- Respond to customer support tickets
- Troubleshoot connectivity and performance issues
- Guide customers through portal operations
- Escalate complex issues to appropriate teams
- Document resolutions in knowledge base
- Meet SLA response and resolution targets

**Permissions:**
- `canAccessInternalPortal`
- `canViewCustomerDetails`
- `canViewSiteDetails`
- `canManageTickets`

**Key Workflows:**
1. **Ticket Resolution:** Review ticket → Access customer/site details → Diagnose issue → Provide solution → Update ticket → Close with documentation
2. **Escalation:** Identify complex issue → Document findings → Assign to specialist team → Track resolution

#### 2.2.4 Network Operations Center (NOC)

**User Profile:**
- **Title:** NOC Engineer, Operations Analyst
- **Technical Expertise:** High
- **Frequency of Use:** Continuous monitoring
- **Primary Device:** Desktop with multiple monitors, monitoring dashboards
- **Session Duration:** Throughout shift

**Responsibilities:**
- 24/7 platform monitoring
- Proactive issue identification
- Alert response and initial triage
- Performance threshold monitoring
- Incident escalation
- Status communication

**Permissions:**
- `canAccessInternalPortal`
- `canViewAllSites`
- `canViewAlerts`
- `canAcknowledgeAlerts`

**Key Workflows:**
1. **Alert Response:** Receive alert → Assess severity → Initial diagnosis → Escalate or resolve → Document action
2. **Proactive Monitoring:** Review dashboard → Identify trends → Flag potential issues → Create preventive tickets

#### 2.2.5 Account Manager

**User Profile:**
- **Title:** Account Manager, Customer Success Manager
- **Technical Expertise:** Low to Medium
- **Frequency of Use:** Weekly
- **Primary Device:** Laptop
- **Session Duration:** 15-30 minutes

**Responsibilities:**
- Customer relationship management
- Usage and growth tracking
- Upsell opportunity identification
- Contract renewal coordination
- Customer satisfaction monitoring
- Executive reporting

**Permissions:**
- `canAccessInternalPortal`
- `canViewCustomerDetails`
- `canViewReports`
- `canExportData`

**Key Workflows:**
1. **Account Review:** Review customer metrics → Analyze usage trends → Identify growth opportunities → Prepare for customer meeting
2. **Reporting:** Generate customer reports → Compile executive summaries → Share with stakeholders

### 2.3 User Persona Summary Matrix

| Persona | Portal | Technical Level | Primary Tasks | Access Scope |
|---------|--------|-----------------|---------------|--------------|
| Company Super Admin | Customer | High | Strategy, oversight, reporting | All sites |
| Site Admin | Customer | Medium-High | Daily operations, user management | Assigned sites |
| Cluster Admin | Customer | Medium-High | Regional coordination | Multiple sites |
| Viewer | Customer | Low | Report viewing | Read-only |
| Platform Admin | Internal | Very High | Full platform management | Everything |
| Deployment Engineer | Internal | Very High | Site setup, configuration | Sites, config |
| Support Engineer | Internal | Medium-High | Ticket resolution | Customers, sites |
| NOC Engineer | Internal | High | Monitoring, alerts | Dashboard, alerts |
| Account Manager | Internal | Low-Medium | Customer success | Reports, customers |

---

## 3. User Interface and User Experience (UI/UX) Requirements

### 3.1 General UI/UX Principles

The SpectraOne Portal shall adhere to the following fundamental UI/UX principles to ensure a consistent, intuitive, and efficient user experience:

#### 3.1.1 Consistency

| Aspect | Requirement |
|--------|-------------|
| **Visual Consistency** | All pages shall use the same color palette, typography, spacing, and component styles |
| **Functional Consistency** | Similar actions shall behave identically across all pages (e.g., delete always requires confirmation) |
| **Internal Consistency** | Navigation patterns, button placements, and interaction models shall be uniform throughout the portal |
| **External Consistency** | The portal shall follow common web conventions users expect from modern applications |

#### 3.1.2 Clarity

| Aspect | Requirement |
|--------|-------------|
| **Visual Hierarchy** | Important elements shall be visually prominent; primary actions shall be clearly distinguished from secondary actions |
| **Labeling** | All interactive elements shall have clear, descriptive labels |
| **Feedback** | Users shall receive immediate visual feedback for all actions |
| **Error Messages** | Error messages shall be specific, actionable, and non-technical |

#### 3.1.3 Efficiency

| Aspect | Requirement |
|--------|-------------|
| **Minimal Clicks** | Common tasks shall be achievable in 3 clicks or fewer from the dashboard |
| **Keyboard Support** | Power users shall be able to navigate and perform actions using keyboard shortcuts |
| **Bulk Operations** | Repetitive tasks shall support batch processing |
| **Smart Defaults** | Forms shall pre-populate with sensible default values where applicable |

#### 3.1.4 Forgiveness

| Aspect | Requirement |
|--------|-------------|
| **Undo Support** | Reversible actions shall provide undo capability |
| **Confirmation Dialogs** | Destructive actions shall require explicit confirmation |
| **Data Preservation** | Form data shall be preserved during navigation or accidental page refresh |
| **Recovery Paths** | Clear paths shall exist to recover from errors or unintended states |

### 3.2 Layout Architecture

#### 3.2.1 Overall Page Structure

The portal shall use a fixed-sidebar layout with the following structure:

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER (60px)                         │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│            │                                                    │
│  SIDEBAR   │              MAIN CONTENT AREA                     │
│  (240px/   │                                                    │
│   64px)    │                                                    │
│            │                                                    │
│            │                                                    │
│            │                                                    │
│            │                                                    │
├────────────┴────────────────────────────────────────────────────┤
│                           FOOTER (48px)                         │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 Header Specifications

**Dimensions:**
- Height: 60px (desktop), 56px (mobile)
- Position: Fixed at top of viewport
- Z-index: 1000 (above all content except modals)

**Contents and Layout:**

| Element | Position | Desktop Width | Mobile Behavior |
|---------|----------|---------------|-----------------|
| Logo/Brand | Left | 180px | Compressed to icon |
| Sidebar Toggle | Left (after logo) | 40px | Visible |
| Global Search | Center | Flexible (min 300px) | Icon only, expandable |
| Notifications | Right | 40px | Visible |
| Theme Toggle | Right | 40px | Visible |
| User Profile | Right | 200px | Avatar only |

**Logo Specifications:**
- Full logo displayed when sidebar is expanded
- Icon-only logo when sidebar is collapsed
- Click action: Navigate to dashboard
- Alt text: "SpectraOne Portal"

**Global Search Specifications:**
- Placeholder text: "Search users, devices, sites... (Ctrl+K)"
- Debounce: 300ms
- Minimum characters: 2
- Results dropdown: Max 10 items grouped by type
- Keyboard shortcut: Ctrl+K (Windows/Linux), Cmd+K (Mac)

**Notifications Specifications:**
- Bell icon with unread count badge
- Badge color: Red for unread
- Maximum badge display: "99+"
- Click action: Open notifications dropdown
- Dropdown height: Max 400px with scroll
- Mark all as read option

**User Profile Specifications:**
- Display: Avatar + Name (desktop), Avatar only (mobile)
- Dropdown menu items:
  - Profile Settings
  - Preferences
  - Help & Support
  - Keyboard Shortcuts
  - Separator
  - Sign Out

#### 3.2.3 Sidebar Navigation Specifications

**Dimensions:**
- Expanded width: 240px
- Collapsed width: 64px
- Position: Fixed left side
- Z-index: 900

**States:**

| State | Width | Icon | Label | Tooltip |
|-------|-------|------|-------|---------|
| Expanded | 240px | Visible | Visible | Hidden |
| Collapsed | 64px | Visible | Hidden | On hover |

**Behavior:**
- Toggle via header button or keyboard shortcut (Ctrl+B)
- Smooth transition: 300ms ease-in-out
- Hover expansion: When collapsed, expand on hover after 200ms delay
- Persistence: Remember state in localStorage
- Mobile: Overlay drawer with backdrop

**Navigation Item Structure:**
```
┌─────────────────────────────────┐
│ [Icon]  Label Text         [>] │  ← Parent item with children
├─────────────────────────────────┤
│    [Icon]  Child Item 1        │  ← Child item (indented)
│    [Icon]  Child Item 2        │
└─────────────────────────────────┘
```

**Visual States:**
| State | Background | Text Color | Icon Color | Border |
|-------|------------|------------|------------|--------|
| Default | Transparent | #64748B | #64748B | None |
| Hover | #F1F5F9 | #1E293B | #1E293B | None |
| Active | #E0E7FF | #004AAD | #004AAD | Left 3px #004AAD |
| Disabled | Transparent | #CBD5E1 | #CBD5E1 | None |

**Customer Portal Navigation:**
```
├── Dashboard
├── User Management
│   ├── User List
│   └── Bulk Import
├── Device Management
│   ├── User Devices
│   └── Smart Devices
├── Reports
│   ├── Billing Reports
│   ├── Usage Reports
│   └── All Reports
├── Knowledge Center
│   ├── Getting Started
│   ├── Video Tutorials
│   └── FAQ
└── Activity Logs
```

**Internal Portal Navigation:**
```
├── Dashboard
├── Customers
│   ├── Customer List
│   └── Add Customer
├── Sites
│   ├── Site List
│   ├── Provision Site
│   └── Site Health
├── Support Queue
│   ├── Open Tickets
│   ├── My Tickets
│   └── All Tickets
├── Reports
├── Knowledge Center
├── Audit Logs
├── Configuration
│   ├── Policies
│   ├── Domains
│   └── Advanced
└── Bulk Operations
```

#### 3.2.4 Main Content Area Specifications

**Layout:**
- Width: 100% of available space (viewport - sidebar)
- Padding: 24px (desktop), 16px (tablet), 12px (mobile)
- Max content width: 1440px (centered when viewport is wider)
- Background: #F8FAFC (light mode), #0F172A (dark mode)

**Content Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  Page Header                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Page Title                    [Action Buttons]      │   │
│  │ Breadcrumb / Description                            │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Page Content                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Cards / Tables / Forms / Charts                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Page Header Requirements:**
- Height: 80px (including padding)
- Title: H1 style (28px, bold)
- Breadcrumb: Below title (12px, muted color)
- Action buttons: Right-aligned
- Sticky: Optional per page (recommended for long pages)

#### 3.2.5 Footer Specifications

**Dimensions:**
- Height: 48px
- Position: After content (scrolls with page) or fixed bottom for short pages

**Contents:**
- Left: Copyright notice ("© 2024 Spectra. All rights reserved.")
- Center: Version information ("v2.1.0")
- Right: Quick links (Privacy Policy, Terms of Service, Support)

### 3.3 Responsive Design Requirements

#### 3.3.1 Breakpoint Definitions

| Breakpoint Name | Width Range | Target Devices | CSS Variable |
|-----------------|-------------|----------------|--------------|
| **xs (Extra Small)** | 0 - 479px | Small phones | `--breakpoint-xs` |
| **sm (Small)** | 480px - 639px | Large phones | `--breakpoint-sm` |
| **md (Medium)** | 640px - 767px | Small tablets | `--breakpoint-md` |
| **lg (Large)** | 768px - 1023px | Tablets, small laptops | `--breakpoint-lg` |
| **xl (Extra Large)** | 1024px - 1279px | Laptops, desktops | `--breakpoint-xl` |
| **2xl (2X Large)** | 1280px+ | Large desktops | `--breakpoint-2xl` |

#### 3.3.2 Responsive Layout Behaviors

**Sidebar Behavior:**

| Breakpoint | Sidebar State | Toggle Behavior |
|------------|---------------|-----------------|
| xs, sm | Hidden (overlay drawer) | Hamburger menu opens drawer |
| md | Hidden (overlay drawer) | Hamburger menu opens drawer |
| lg | Collapsed by default | Toggle to expand |
| xl, 2xl | Expanded by default | Toggle to collapse |

**Grid System:**

| Breakpoint | Grid Columns | Gutter Width | Container Padding |
|------------|--------------|--------------|-------------------|
| xs | 4 | 16px | 12px |
| sm | 4 | 16px | 16px |
| md | 8 | 20px | 20px |
| lg | 12 | 24px | 24px |
| xl | 12 | 24px | 32px |
| 2xl | 12 | 32px | 40px |

**Component Adaptations:**

| Component | xs-sm | md-lg | xl-2xl |
|-----------|-------|-------|--------|
| **Metric Cards** | 1 column, stacked | 2 columns | 4 columns |
| **Data Tables** | Card view | Horizontal scroll | Full table |
| **Charts** | Full width, simplified | Full width | Side-by-side possible |
| **Forms** | Single column | Single column | Two columns for long forms |
| **Modals** | Full screen | 80% width | Fixed width (400-800px) |
| **Action Buttons** | Stacked or icon-only | Inline | Inline with labels |

#### 3.3.3 Touch Optimization (Mobile/Tablet)

| Requirement | Specification |
|-------------|---------------|
| **Minimum Touch Target** | 44px × 44px |
| **Touch Target Spacing** | Minimum 8px between targets |
| **Swipe Gestures** | Sidebar drawer, card carousels, delete actions |
| **Pull to Refresh** | Supported on list pages |
| **Long Press** | Context menu on table rows |
| **Pinch Zoom** | Disabled on UI, enabled on charts/images |

#### 3.3.4 Mobile-Specific UI Patterns

**Bottom Navigation Bar (Mobile Only):**
- Height: 56px
- Position: Fixed bottom
- Items: 4-5 primary navigation items
- Active indicator: Filled icon + label

**Floating Action Button (FAB):**
- Size: 56px diameter
- Position: Bottom-right, 16px from edges
- Primary action per page (e.g., Add User, Create Report)
- Elevation: 6dp shadow
- Hidden when keyboard is open

**Mobile Table as Cards:**
```
┌─────────────────────────────────────┐
│ User ID: USR-001              [•••] │
│ ─────────────────────────────────── │
│ Name: John Doe                      │
│ Email: john.doe@company.com         │
│ Status: [Active]                    │
│ Last Login: 2 hours ago             │
└─────────────────────────────────────┘
```

### 3.4 Accessibility Requirements

#### 3.4.1 WCAG 2.1 Compliance

The portal shall meet WCAG 2.1 Level AA compliance:

| Principle | Requirement | Implementation |
|-----------|-------------|----------------|
| **Perceivable** | Text alternatives for non-text content | Alt text on images, ARIA labels on icons |
| **Perceivable** | Color contrast minimum 4.5:1 | Verified color palette |
| **Operable** | Keyboard accessible | Tab navigation, focus management |
| **Operable** | No seizure-inducing content | No flashing content >3 times/second |
| **Understandable** | Readable content | Clear language, consistent navigation |
| **Robust** | Compatible with assistive tech | Semantic HTML, ARIA attributes |

#### 3.4.2 Keyboard Navigation

| Action | Keyboard Shortcut |
|--------|-------------------|
| Navigate forward | Tab |
| Navigate backward | Shift + Tab |
| Activate button/link | Enter or Space |
| Close modal/dropdown | Escape |
| Navigate within menu | Arrow keys |
| Select in dropdown | Enter |
| Toggle checkbox | Space |
| Global search | Ctrl/Cmd + K |
| Toggle sidebar | Ctrl/Cmd + B |
| Save form | Ctrl/Cmd + S |

#### 3.4.3 Focus Management

| Requirement | Specification |
|-------------|---------------|
| **Visible Focus** | 2px outline in primary color on all focusable elements |
| **Focus Order** | Logical tab order following visual layout |
| **Focus Trap** | Modals trap focus within until closed |
| **Focus Restoration** | Return focus to trigger element when modal closes |
| **Skip Links** | "Skip to main content" link as first focusable element |

#### 3.4.4 Screen Reader Support

| Element | ARIA Implementation |
|---------|---------------------|
| **Navigation** | `role="navigation"`, `aria-label="Main navigation"` |
| **Main Content** | `role="main"`, `aria-label="Page content"` |
| **Buttons** | `aria-label` for icon-only buttons |
| **Status Badges** | `role="status"`, descriptive `aria-label` |
| **Forms** | `aria-required`, `aria-invalid`, `aria-describedby` |
| **Tables** | `role="table"`, `aria-sort` on sortable columns |
| **Alerts** | `role="alert"`, `aria-live="polite"` |
| **Loading States** | `aria-busy="true"`, `aria-live="polite"` |

#### 3.4.5 Color and Contrast

| Usage | Foreground | Background | Contrast Ratio |
|-------|------------|------------|----------------|
| Body text | #1E293B | #FFFFFF | 12.6:1 ✓ |
| Muted text | #64748B | #FFFFFF | 4.7:1 ✓ |
| Primary button | #FFFFFF | #004AAD | 8.1:1 ✓ |
| Error text | #DC2626 | #FFFFFF | 4.5:1 ✓ |
| Success text | #059669 | #FFFFFF | 4.5:1 ✓ |
| Link text | #004AAD | #FFFFFF | 8.1:1 ✓ |

---

## 4. Design System Specifications

### 4.1 Color System

#### 4.1.1 Brand Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Primary Blue** | #004AAD | rgb(0, 74, 173) | Primary actions, links, active states, brand elements |
| **Primary Blue Hover** | #003A8C | rgb(0, 58, 140) | Hover state for primary elements |
| **Primary Blue Light** | #E6EEF8 | rgb(230, 238, 248) | Primary backgrounds, selected states |
| **Secondary Blue** | #0066CC | rgb(0, 102, 204) | Secondary actions, informational elements |
| **Dark Navy** | #153874 | rgb(21, 56, 116) | Headers, emphasis text, dark accents |

#### 4.1.2 Neutral Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Gray 900** | #0F172A | Headings, primary text (dark mode bg) |
| **Gray 800** | #1E293B | Body text, strong emphasis |
| **Gray 700** | #334155 | Secondary text |
| **Gray 600** | #475569 | Muted text, icons |
| **Gray 500** | #64748B | Placeholder text, disabled text |
| **Gray 400** | #94A3B8 | Borders, dividers |
| **Gray 300** | #CBD5E1 | Light borders |
| **Gray 200** | #E2E8F0 | Subtle backgrounds |
| **Gray 100** | #F1F5F9 | Hover backgrounds |
| **Gray 50** | #F8FAFC | Page backgrounds |
| **White** | #FFFFFF | Card backgrounds, input backgrounds |

#### 4.1.3 Semantic Colors

| Purpose | Color Name | Hex Code | Usage Examples |
|---------|------------|----------|----------------|
| **Success** | Green 600 | #059669 | Success messages, active status, positive metrics |
| **Success Light** | Green 50 | #ECFDF5 | Success backgrounds |
| **Success Dark** | Green 700 | #047857 | Success text on light backgrounds |
| **Warning** | Amber 500 | #F59E0B | Warning messages, suspended status |
| **Warning Light** | Amber 50 | #FFFBEB | Warning backgrounds |
| **Warning Dark** | Amber 600 | #D97706 | Warning text |
| **Error** | Red 600 | #DC2626 | Error messages, blocked status, critical alerts |
| **Error Light** | Red 50 | #FEF2F2 | Error backgrounds |
| **Error Dark** | Red 700 | #B91C1C | Error text |
| **Info** | Blue 500 | #3B82F6 | Informational messages, tips |
| **Info Light** | Blue 50 | #EFF6FF | Info backgrounds |

#### 4.1.4 Status Badge Colors

| Status | Background | Text | Border |
|--------|------------|------|--------|
| **Active / Online** | #ECFDF5 | #059669 | #059669 |
| **Suspended / Degraded** | #FFFBEB | #D97706 | #D97706 |
| **Blocked / Offline** | #FEF2F2 | #DC2626 | #DC2626 |
| **Pending** | #F1F5F9 | #64748B | #94A3B8 |
| **Maintenance** | #F5F3FF | #7C3AED | #7C3AED |
| **Draft** | #F8FAFC | #475569 | #CBD5E1 |

#### 4.1.5 Dark Mode Color Mapping

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page Background | #F8FAFC | #0F172A |
| Card Background | #FFFFFF | #1E293B |
| Primary Text | #1E293B | #F1F5F9 |
| Secondary Text | #64748B | #94A3B8 |
| Border | #E2E8F0 | #334155 |
| Input Background | #FFFFFF | #0F172A |
| Hover Background | #F1F5F9 | #334155 |

### 4.2 Typography System

#### 4.2.1 Font Family

```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace;
```

#### 4.2.2 Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| **Display** | 36px | 44px | 700 | Hero sections, major announcements |
| **H1** | 28px | 36px | 700 | Page titles |
| **H2** | 24px | 32px | 600 | Section titles |
| **H3** | 20px | 28px | 600 | Card titles, subsections |
| **H4** | 18px | 24px | 600 | Widget titles |
| **H5** | 16px | 24px | 600 | List headers |
| **Body Large** | 16px | 24px | 400 | Prominent body text |
| **Body** | 14px | 20px | 400 | Default body text |
| **Body Small** | 13px | 18px | 400 | Secondary information |
| **Caption** | 12px | 16px | 400 | Labels, timestamps |
| **Overline** | 11px | 16px | 600 | Category labels, badges |

#### 4.2.3 Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Emphasized text, form labels |
| Semi-Bold | 600 | Headings, button text, nav items |
| Bold | 700 | Page titles, strong emphasis |

### 4.3 Spacing System

#### 4.3.1 Base Unit

The spacing system is based on a 4px base unit:

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| **0** | 0px | `--space-0` | Reset spacing |
| **1** | 4px | `--space-1` | Tight inline spacing |
| **2** | 8px | `--space-2` | Icon gaps, badge padding |
| **3** | 12px | `--space-3` | Small component padding |
| **4** | 16px | `--space-4` | Standard padding, card padding |
| **5** | 20px | `--space-5` | Medium spacing |
| **6** | 24px | `--space-6` | Section spacing |
| **8** | 32px | `--space-8` | Large spacing |
| **10** | 40px | `--space-10` | Extra large spacing |
| **12** | 48px | `--space-12` | Major section gaps |
| **16** | 64px | `--space-16` | Page section separation |

#### 4.3.2 Component Spacing Guidelines

| Context | Spacing Token | Value |
|---------|---------------|-------|
| **Button padding (horizontal)** | space-4 | 16px |
| **Button padding (vertical)** | space-2 | 8px |
| **Card padding** | space-4 to space-6 | 16-24px |
| **Card margin (gap)** | space-4 to space-6 | 16-24px |
| **Form field gap** | space-4 | 16px |
| **Form section gap** | space-6 | 24px |
| **Table cell padding** | space-3 | 12px |
| **Modal padding** | space-6 | 24px |
| **Page padding** | space-6 (desktop) | 24px |
| **Page padding** | space-4 (mobile) | 16px |

### 4.4 Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| **none** | 0px | Sharp corners when needed |
| **sm** | 4px | Badges, small elements |
| **md** | 6px | Buttons, inputs |
| **lg** | 8px | Cards, dropdowns |
| **xl** | 12px | Modals, large cards |
| **2xl** | 16px | Feature cards |
| **full** | 9999px | Circular elements, pills |

### 4.5 Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| **xs** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| **sm** | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards at rest |
| **md** | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Elevated cards, dropdowns |
| **lg** | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, popovers |
| **xl** | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Large modals |

### 4.6 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| **base** | 0 | Default stacking |
| **dropdown** | 100 | Dropdown menus |
| **sticky** | 200 | Sticky headers |
| **fixed** | 300 | Fixed elements |
| **drawer** | 400 | Side drawers |
| **modal-backdrop** | 500 | Modal overlays |
| **modal** | 600 | Modal dialogs |
| **popover** | 700 | Popovers, tooltips |
| **toast** | 800 | Toast notifications |
| **tooltip** | 900 | Tooltips (highest) |

### 4.7 Animation and Transition Standards

#### 4.7.1 Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **instant** | 0ms | Immediate feedback |
| **fast** | 100ms | Micro-interactions |
| **normal** | 200ms | Standard transitions |
| **slow** | 300ms | Complex animations |
| **slower** | 500ms | Page transitions |

#### 4.7.2 Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| **ease-in** | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| **ease-out** | cubic-bezier(0, 0, 0.2, 1) | Enter animations |
| **ease-in-out** | cubic-bezier(0.4, 0, 0.2, 1) | Default transitions |
| **spring** | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Playful interactions |

#### 4.7.3 Standard Transitions

```css
/* Button hover */
transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;

/* Card hover */
transition: transform 200ms ease-out, box-shadow 200ms ease-out;

/* Sidebar toggle */
transition: width 300ms ease-in-out;

/* Modal enter */
animation: fadeIn 200ms ease-out, slideUp 200ms ease-out;

/* Toast enter */
animation: slideInRight 300ms ease-out;
```

### 4.8 Icon System

#### 4.8.1 Icon Library

The portal shall use **React Icons** with the following icon sets:
- Primary: Heroicons (hi)
- Secondary: Feather Icons (fi)
- Status: Custom SVG icons

#### 4.8.2 Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| **xs** | 12px | Inline indicators |
| **sm** | 16px | Button icons, badges |
| **md** | 20px | Default icon size |
| **lg** | 24px | Navigation icons |
| **xl** | 32px | Feature icons |
| **2xl** | 48px | Empty states, illustrations |

#### 4.8.3 Icon Colors

Icons shall inherit the text color of their context unless explicitly styled:
- Default: currentColor (inherits)
- Interactive: Primary blue on hover
- Status: Semantic colors matching status badges

---

## 5. Best Practices and Component Standards

This section defines the implementation standards and best practices for common UI components and patterns used throughout the SpectraOne Portal. Adherence to these standards ensures consistency, accessibility, and optimal user experience.

### 5.1 Responsiveness Best Practices

#### 5.1.1 Mobile-First Approach

**Principle:** Design and develop for mobile devices first, then progressively enhance for larger screens.

**Implementation Guidelines:**

| Guideline | Description | Example |
|-----------|-------------|---------|
| **Base Styles** | Write CSS for mobile as the default | `.card { padding: 16px; }` |
| **Progressive Enhancement** | Add complexity for larger screens | `@media (min-width: 768px) { .card { padding: 24px; } }` |
| **Content Priority** | Most important content visible without scrolling on mobile | Primary metrics above the fold |
| **Touch-First** | Design interactions for touch before mouse | Larger tap targets, swipe gestures |

#### 5.1.2 Fluid Typography

**Implementation:**
```css
/* Fluid font size: scales between 14px at 320px viewport to 16px at 1280px viewport */
font-size: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);

/* Fluid heading: scales between 24px at 320px to 36px at 1280px */
font-size: clamp(1.5rem, 1.2rem + 1vw, 2.25rem);
```

#### 5.1.3 Responsive Images

| Technique | Usage | Implementation |
|-----------|-------|----------------|
| **srcset** | Serve appropriate resolution | `<img srcset="img-320.jpg 320w, img-640.jpg 640w">` |
| **Lazy Loading** | Defer off-screen images | `loading="lazy"` |
| **Aspect Ratio** | Prevent layout shift | `aspect-ratio: 16 / 9;` |
| **Object Fit** | Control image scaling | `object-fit: cover;` |

#### 5.1.4 Responsive Tables

**Strategy Matrix:**

| Viewport | Strategy | Description |
|----------|----------|-------------|
| **xs-sm (< 640px)** | Card Transformation | Table rows become stacked cards |
| **md (640-767px)** | Horizontal Scroll | Scrollable table with sticky first column |
| **lg+ (768px+)** | Full Table | Standard table display |

**Card Transformation Pattern:**
```html
<!-- Mobile: Card view -->
<div class="table-card">
  <div class="table-card-header">
    <span class="user-name">John Doe</span>
    <span class="status-badge active">Active</span>
  </div>
  <div class="table-card-body">
    <div class="field">
      <span class="label">Email</span>
      <span class="value">john@example.com</span>
    </div>
    <div class="field">
      <span class="label">Last Login</span>
      <span class="value">2 hours ago</span>
    </div>
  </div>
  <div class="table-card-actions">
    <button>Edit</button>
    <button>Delete</button>
  </div>
</div>
```

#### 5.1.5 Responsive Grid Patterns

**Dashboard Cards Grid:**
```css
.metrics-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 640px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
  }
}
```

### 5.2 Modal Component Standards

#### 5.2.1 Modal Types and Sizes

| Type | Width | Use Case |
|------|-------|----------|
| **Alert** | 400px | Simple confirmations, alerts |
| **Small** | 480px | Simple forms, confirmations with inputs |
| **Medium** | 600px | Standard forms, detail views |
| **Large** | 800px | Complex forms, tables within modals |
| **Extra Large** | 1000px | Reports, bulk operations preview |
| **Full Screen** | 100vw - 32px | Mobile views, complex workflows |

#### 5.2.2 Modal Structure

```
┌────────────────────────────────────────────────────────────┐
│  Modal Header                                          [X] │
│  ───────────────────────────────────────────────────────── │
│                                                            │
│  Modal Body                                                │
│  (Scrollable if content exceeds max height)                │
│                                                            │
│                                                            │
│  ───────────────────────────────────────────────────────── │
│  Modal Footer                          [Cancel] [Primary]  │
└────────────────────────────────────────────────────────────┘
```

#### 5.2.3 Modal Behavior Requirements

| Behavior | Specification |
|----------|---------------|
| **Opening Animation** | Fade backdrop (200ms) + Scale modal (200ms ease-out) |
| **Closing Animation** | Scale down modal (150ms) + Fade backdrop (150ms) |
| **Backdrop Click** | Close modal (configurable per modal) |
| **Escape Key** | Close modal (always enabled) |
| **Focus Trap** | Tab cycles only within modal |
| **Initial Focus** | First focusable element or close button |
| **Return Focus** | Return to trigger element on close |
| **Scroll Lock** | Prevent body scroll when open |
| **Nested Modals** | Maximum 2 levels, second modal smaller |

#### 5.2.4 Modal Header Standards

| Element | Specification |
|---------|---------------|
| **Title** | H3 style (20px, semi-bold), max 1 line |
| **Subtitle** | Optional, 14px muted text |
| **Close Button** | 32px × 32px, top-right corner |
| **Icon** | Optional 24px icon before title |
| **Padding** | 24px horizontal, 20px vertical |
| **Border** | 1px bottom border (gray-200) |

#### 5.2.5 Modal Body Standards

| Element | Specification |
|---------|---------------|
| **Padding** | 24px all sides |
| **Max Height** | 70vh (scrollable beyond) |
| **Scroll** | Internal scroll with fade indicators |
| **Loading State** | Centered spinner, min height 200px |
| **Empty State** | Centered illustration + message |

#### 5.2.6 Modal Footer Standards

| Element | Specification |
|---------|---------------|
| **Padding** | 16px horizontal, 16px vertical |
| **Border** | 1px top border (gray-200) |
| **Button Alignment** | Right-aligned |
| **Button Order** | Secondary (Cancel) → Primary (Submit) |
| **Button Spacing** | 12px gap |
| **Sticky** | Always visible at bottom |

#### 5.2.7 Confirmation Modal Pattern

**Use for:** Delete operations, status changes, irreversible actions

```
┌──────────────────────────────────────────────┐
│  ⚠️ Confirm Deletion                      [X] │
│  ──────────────────────────────────────────── │
│                                              │
│  Are you sure you want to delete this user?  │
│                                              │
│  User: John Doe (john@example.com)           │
│                                              │
│  This action cannot be undone.               │
│                                              │
│  ──────────────────────────────────────────── │
│                    [Cancel] [Delete User]    │
└──────────────────────────────────────────────┘
```

**Requirements:**
- Warning icon for destructive actions
- Clear description of what will happen
- Show entity being affected
- Consequence warning for irreversible actions
- Cancel button always available
- Destructive action button in red

### 5.3 Pagination Standards

#### 5.3.1 Pagination Types

| Type | Use Case | Description |
|------|----------|-------------|
| **Numbered Pagination** | Tables, lists | Traditional page numbers |
| **Load More** | Cards, feeds | Button to load additional items |
| **Infinite Scroll** | Timelines, logs | Auto-load on scroll |
| **Cursor-Based** | Real-time data | For frequently changing datasets |

#### 5.3.2 Numbered Pagination Component

**Visual Structure:**
```
[First] [<] [1] [2] [3] [4] [5] [...] [42] [>] [Last]

Showing 1-10 of 420 entries    |    Rows per page: [10 ▼]
```

**Specifications:**

| Element | Specification |
|---------|---------------|
| **Page Button Size** | 36px × 36px |
| **Active Page** | Primary blue background, white text |
| **Hover State** | Light gray background |
| **Disabled State** | Gray text, no hover effect |
| **Ellipsis** | Shows when > 7 pages |
| **First/Last Buttons** | Optional, shown when > 10 pages |
| **Prev/Next Buttons** | Always shown, disabled when unavailable |

**Page Display Logic:**
- Always show first and last page
- Show current page ± 2 pages
- Use ellipsis (...) for gaps
- Examples:
  - Page 1 of 42: `[1] [2] [3] [...] [42]`
  - Page 5 of 42: `[1] [...] [3] [4] [5] [6] [7] [...] [42]`
  - Page 41 of 42: `[1] [...] [40] [41] [42]`

#### 5.3.3 Page Size Options

| Context | Default | Options |
|---------|---------|---------|
| **User List** | 10 | 10, 25, 50, 100 |
| **Device List** | 10 | 10, 25, 50, 100 |
| **Activity Logs** | 20 | 20, 50, 100, 200 |
| **Audit Logs** | 25 | 25, 50, 100, 200 |
| **Reports** | 10 | 10, 25, 50 |

#### 5.3.4 URL State Persistence

Pagination state shall be reflected in the URL for bookmarking and sharing:

```
/users?page=3&pageSize=25&sort=name&order=asc
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `page` | Current page number (1-indexed) | 1 |
| `pageSize` | Items per page | 10 |
| `sort` | Sort column | varies |
| `order` | Sort direction (asc/desc) | desc |

#### 5.3.5 Mobile Pagination

**Simplified Pattern:**
```
[< Previous]          Page 3 of 42          [Next >]
```

**Load More Pattern:**
```
┌─────────────────────────────────────┐
│            Card 1                   │
├─────────────────────────────────────┤
│            Card 2                   │
├─────────────────────────────────────┤
│            Card 3                   │
├─────────────────────────────────────┤
│       [Load More (37 more)]         │
└─────────────────────────────────────┘
```

#### 5.3.6 Pagination Loading States

| State | Behavior |
|-------|----------|
| **Initial Load** | Full skeleton loader for table |
| **Page Change** | Keep current data, show spinner overlay |
| **Page Size Change** | Return to page 1, full reload |
| **Error** | Show error message with retry button |

### 5.4 Report Download Standards

#### 5.4.1 Supported Export Formats

| Format | Extension | Use Case | Max Records |
|--------|-----------|----------|-------------|
| **CSV** | .csv | Data analysis, spreadsheet import | 100,000 |
| **Excel** | .xlsx | Formatted spreadsheets | 50,000 |
| **PDF** | .pdf | Formal reports, printing | 10,000 |
| **JSON** | .json | API integration, data transfer | 100,000 |

#### 5.4.2 Export Button Placement

| Context | Position | Button Style |
|---------|----------|--------------|
| **Table View** | Above table, right-aligned | Secondary button with icon |
| **Report Viewer** | Header area, right side | Primary button group |
| **Dashboard Widget** | Widget header, icon button | Icon-only button |

**Export Button Group Pattern:**
```
[📊 Export ▼]
  ├── Export as CSV
  ├── Export as Excel
  └── Export as PDF
```

#### 5.4.3 Export Workflow

1. **Trigger:** User clicks export button/option
2. **Validation:** Check if data exists, check record count
3. **Confirmation:** For large exports (> 10,000 records), show confirmation dialog
4. **Processing:**
   - Show progress indicator
   - For large exports, process in background
   - Allow user to continue working
5. **Completion:**
   - Automatic download trigger
   - Success toast notification
   - For background exports, notification with download link
6. **Error Handling:**
   - Clear error message
   - Retry option
   - Support contact for persistent failures

#### 5.4.4 Export Progress Indicator

**For immediate exports (< 5 seconds):**
```
┌────────────────────────────────────┐
│  Generating Export...              │
│  ████████████░░░░░░░░ 60%         │
│                                    │
│  [Cancel]                          │
└────────────────────────────────────┘
```

**For background exports:**
```
Toast: "Export started. We'll notify you when it's ready."

Later:
Toast: "Your export is ready. [Download]"
```

#### 5.4.5 Filename Conventions

**Pattern:** `{ReportName}_{Context}_{Date}_{Time}.{ext}`

| Component | Format | Example |
|-----------|--------|---------|
| ReportName | PascalCase | UserList, ActiveUsers |
| Context | Site/Company name (optional) | SiteA, AcmeCorp |
| Date | YYYYMMDD | 20241215 |
| Time | HHmmss | 143052 |
| Extension | lowercase | csv, xlsx, pdf |

**Example:** `UserList_SiteA_20241215_143052.csv`

#### 5.4.6 Export Contents

| Requirement | Specification |
|-------------|---------------|
| **Applied Filters** | Export includes metadata about active filters |
| **Column Selection** | User can select which columns to include |
| **Sort Order** | Exported data respects current sort |
| **Date Format** | ISO 8601 (YYYY-MM-DD) in data, localized in PDF |
| **Number Format** | No thousands separator in CSV, localized in PDF |
| **Encoding** | UTF-8 with BOM for Excel compatibility |

### 5.5 Sorting Standards

#### 5.5.1 Sort Indicator Design

**Visual States:**
| State | Icon | Appearance |
|-------|------|------------|
| **Unsorted** | ↕ (subtle) | Gray, low opacity |
| **Ascending** | ↑ | Primary blue |
| **Descending** | ↓ | Primary blue |

**Click Behavior Cycle:**
```
Unsorted → Ascending → Descending → Unsorted
```

#### 5.5.2 Sortable Column Header

```
┌─────────────────────────────────────────┐
│  Name ↑    │  Email    │  Status   │  Actions  │
│  (sorted)  │ (sortable)│ (sortable)│ (not sortable)│
└─────────────────────────────────────────┘
```

**Header Interactions:**
| Action | Result |
|--------|--------|
| Click header | Toggle sort direction |
| Hover | Show pointer cursor, highlight |
| Shift + Click | (Future) Add secondary sort |

#### 5.5.3 Sort Persistence

| Context | Persistence Method |
|---------|-------------------|
| **Session** | Maintained during browser session |
| **URL** | Reflected in query parameters |
| **Default** | Applied when no user preference |

#### 5.5.4 Default Sort Orders

| Page | Default Column | Default Direction |
|------|----------------|-------------------|
| User List | Registration Date | Descending |
| Device List | Last Connected | Descending |
| Activity Logs | Timestamp | Descending |
| Reports | Last Run | Descending |
| Sites | Customer Name | Ascending |
| Customers | Company Name | Ascending |

#### 5.5.5 Sort Data Types

| Data Type | Sort Logic |
|-----------|------------|
| **Text** | Alphabetical (locale-aware) |
| **Numbers** | Numeric comparison |
| **Dates** | Chronological |
| **Status** | Predefined order (Active → Suspended → Blocked) |
| **Mixed** | Nulls last, then by type |

### 5.6 Search Standards

#### 5.6.1 Search Input Design

```
┌──────────────────────────────────────────────────┐
│ 🔍  Search users by name, email, ID...       [X] │
└──────────────────────────────────────────────────┘
```

**Specifications:**
| Element | Specification |
|---------|---------------|
| **Icon** | Search icon (magnifying glass) left-aligned |
| **Placeholder** | Context-specific hint |
| **Clear Button** | X icon, appears when text entered |
| **Width** | Min 200px, max 400px (desktop) |
| **Height** | 40px standard, 36px compact |

#### 5.6.2 Search Behavior

| Behavior | Specification |
|----------|---------------|
| **Debounce** | 300ms delay before search execution |
| **Minimum Characters** | 2 characters to trigger search |
| **Case Sensitivity** | Case-insensitive matching |
| **Partial Match** | Matches substrings (contains) |
| **Clear Action** | X button or Escape key |
| **Submit** | Enter key triggers immediate search |

#### 5.6.3 Search Results Highlighting

```
Search: "john"

Results:
┌─────────────────────────────────────────┐
│ **John** Smith - john.smith@company.com │
│ Mary **John**son - mary@company.com     │
│ Sarah **John**ston - sarah@company.com  │
└─────────────────────────────────────────┘
```

**Highlight Style:**
- Background: Yellow (#FEF9C3)
- Text: Normal weight (not bold)
- Border-radius: 2px

#### 5.6.4 Search Scope by Page

| Page | Searchable Fields |
|------|-------------------|
| **User List** | User ID, First Name, Last Name, Email, Mobile |
| **Device List** | Device Name, MAC Address, Owner Name |
| **Activity Logs** | Log ID, Target, Performer, Description |
| **Sites** | Site Name, Customer Name, City |
| **Customers** | Company Name, Contact Name, Email |
| **Reports** | Report Name, Description |
| **Knowledge Center** | Article Title, Content (full-text) |

#### 5.6.5 No Results State

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           🔍                                        │
│                                                     │
│     No results found for "xyz123"                  │
│                                                     │
│     Try different keywords or check spelling       │
│                                                     │
│     [Clear Search]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 5.6.6 Global Search (Header)

**Keyboard Shortcut:** Ctrl+K (Windows/Linux), Cmd+K (Mac)

**Results Dropdown:**
```
┌─────────────────────────────────────────────────────┐
│ 🔍 john                                         [X] │
├─────────────────────────────────────────────────────┤
│ USERS                                               │
│   👤 John Smith - Active                           │
│   👤 John Doe - Suspended                          │
├─────────────────────────────────────────────────────┤
│ DEVICES                                             │
│   💻 John's Laptop - Online                        │
├─────────────────────────────────────────────────────┤
│ Press Enter to search all • Esc to close           │
└─────────────────────────────────────────────────────┘
```

### 5.7 Filter Standards

#### 5.7.1 Filter Types

| Type | UI Component | Use Case |
|------|--------------|----------|
| **Single Select** | Dropdown | Mutually exclusive options (Status) |
| **Multi-Select** | Checkbox dropdown | Multiple options (Categories) |
| **Date Range** | Date picker pair | Time-based filtering |
| **Date Preset** | Button group | Quick date ranges |
| **Toggle** | Switch | Boolean filters |
| **Range Slider** | Dual slider | Numeric ranges |

#### 5.7.2 Filter Panel Layout

**Desktop (Inline):**
```
┌─────────────────────────────────────────────────────────────────────┐
│ Status: [All ▼]  Segment: [Select... ▼]  Date: [Last 7 days ▼]  [Clear All] │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile (Collapsible):**
```
┌─────────────────────────────────────┐
│ [🔽 Filters (3 active)]             │
├─────────────────────────────────────┤
│ Status                              │
│ [All] [Active] [Suspended] [Blocked]│
│                                     │
│ Segment                             │
│ [Select segments...           ▼]    │
│                                     │
│ Date Range                          │
│ [Last 7 days                  ▼]    │
│                                     │
│ [Clear All]        [Apply Filters]  │
└─────────────────────────────────────┘
```

#### 5.7.3 Filter Dropdown Design

**Single Select:**
```
┌─────────────────────────┐
│ Status              [▼] │
├─────────────────────────┤
│ ○ All                   │
│ ● Active                │ ← Selected (filled radio)
│ ○ Suspended             │
│ ○ Blocked               │
└─────────────────────────┘
```

**Multi-Select:**
```
┌─────────────────────────┐
│ Segments            [▼] │
├─────────────────────────┤
│ 🔍 Search...            │
├─────────────────────────┤
│ ☑ Enterprise            │
│ ☑ Co-Living             │
│ ☐ Co-Working            │
│ ☐ Hotel                 │
│ ☐ PG                    │
├─────────────────────────┤
│ [Clear] 2 selected      │
└─────────────────────────┘
```

#### 5.7.4 Date Range Presets

| Preset | Description |
|--------|-------------|
| Today | Current day (00:00 - 23:59) |
| Yesterday | Previous day |
| Last 7 days | Past 7 days including today |
| Last 14 days | Past 14 days including today |
| Last 30 days | Past 30 days including today |
| This month | First day of month to today |
| Last month | Previous calendar month |
| Custom | User-selected date range |

#### 5.7.5 Active Filter Indicators

**Filter Chip Pattern:**
```
Active filters: [Status: Active ×] [Segment: Enterprise, Co-Living ×] [Clear all]
```

**Badge Count on Mobile:**
```
[🔽 Filters (3)]
```

#### 5.7.6 Filter Persistence

| Context | Behavior |
|---------|----------|
| **Page Navigation** | Clear filters on navigate away |
| **Page Refresh** | Restore from URL parameters |
| **Browser Back** | Restore previous filter state |
| **Saved Views** | (Future) User-defined filter presets |

### 5.8 Scrolling Optimization

#### 5.8.1 Scroll Performance

| Technique | Implementation |
|-----------|----------------|
| **Smooth Scrolling** | `scroll-behavior: smooth` on html |
| **Scroll Snap** | `scroll-snap-type: y mandatory` for carousels |
| **Passive Listeners** | `{ passive: true }` for scroll handlers |
| **Debounced Handlers** | 100ms debounce for scroll-triggered updates |
| **Virtual Scrolling** | For lists > 100 items |

#### 5.8.2 Scroll-to-Top Button

**Specifications:**
| Property | Value |
|----------|-------|
| **Appearance Trigger** | After scrolling 200px down |
| **Position** | Fixed, bottom-right (80px from bottom, 24px from right) |
| **Size** | 40px × 40px |
| **Icon** | Arrow up |
| **Animation** | Fade in (200ms) |
| **Mobile Position** | Above FAB if present |

#### 5.8.3 Sticky Elements

| Element | Sticky Position | Z-Index |
|---------|-----------------|---------|
| **Header** | Top: 0 | 1000 |
| **Table Header** | Top: 60px (below header) | 100 |
| **Filter Bar** | Top: 60px | 100 |
| **Modal Footer** | Bottom: 0 (within modal) | 1 |

#### 5.8.4 Infinite Scroll Implementation

**Trigger:** When scroll position reaches 200px from bottom

**Loading State:**
```
┌─────────────────────────────────────┐
│            Item 1                   │
│            Item 2                   │
│            Item 3                   │
│            ...                      │
│            Item n                   │
├─────────────────────────────────────┤
│         ⟳ Loading more...           │
└─────────────────────────────────────┘
```

**End of List:**
```
┌─────────────────────────────────────┐
│            Item n-1                 │
│            Item n                   │
├─────────────────────────────────────┤
│     ── You've reached the end ──   │
└─────────────────────────────────────┘
```

### 5.9 Card Layout Standards

#### 5.9.1 Card Anatomy

```
┌─────────────────────────────────────────────────┐
│  Card Header                              [•••] │  ← Header with actions
│  ─────────────────────────────────────────────  │  ← Optional divider
│                                                 │
│  Card Body                                      │  ← Main content
│                                                 │
│  ─────────────────────────────────────────────  │  ← Optional divider
│  Card Footer                      [Secondary]   │  ← Footer with actions
└─────────────────────────────────────────────────┘
```

#### 5.9.2 Card Variants

| Variant | Use Case | Visual Treatment |
|---------|----------|------------------|
| **Default** | Standard content containers | White bg, subtle shadow |
| **Elevated** | Featured content | Larger shadow |
| **Outlined** | List items, selectable cards | Border, no shadow |
| **Interactive** | Clickable cards | Hover lift effect |
| **Status** | Status indicators | Colored left border |
| **Metric** | Dashboard KPIs | Centered, large numbers |

#### 5.9.3 Card Spacing

| Element | Padding/Margin |
|---------|----------------|
| **Card Padding** | 16px (mobile), 24px (desktop) |
| **Card Gap (Grid)** | 16px (mobile), 24px (desktop) |
| **Header Padding** | 16px 24px |
| **Body Padding** | 24px |
| **Footer Padding** | 16px 24px |

#### 5.9.4 Metric Card Pattern

```
┌───────────────────────────────────┐
│  👥  Active Users                 │
│                                   │
│        1,234                      │  ← Large number (28px)
│                                   │
│  ↑ 12% vs last month             │  ← Trend indicator
└───────────────────────────────────┘
```

**Specifications:**
| Element | Style |
|---------|-------|
| Icon | 24px, top-left or centered |
| Label | 14px, muted color |
| Value | 28-36px, bold |
| Trend | 12px, green (up) or red (down) |
| Min Height | 120px |

#### 5.9.5 List Card Pattern (for tables on mobile)

```
┌───────────────────────────────────────────────┐
│  John Doe                          [Active]   │  ← Primary info + status
│  john.doe@company.com                         │  ← Secondary info
│  ───────────────────────────────────────────  │
│  Policy: 50 Mbps | 100 GB | Monthly           │  ← Details
│  Last Login: 2 hours ago                      │
│  ───────────────────────────────────────────  │
│  [Edit]                           [More ▼]    │  ← Actions
└───────────────────────────────────────────────┘
```

#### 5.9.6 Card Grid Responsiveness

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| xs (< 480px) | 1 | 12px |
| sm (480-639px) | 1 | 16px |
| md (640-767px) | 2 | 16px |
| lg (768-1023px) | 2-3 | 20px |
| xl (1024-1279px) | 3-4 | 24px |
| 2xl (1280px+) | 4 | 24px |

### 5.10 Form Validation Standards

#### 5.10.1 Validation Timing

| Validation Type | Trigger | Description |
|-----------------|---------|-------------|
| **Presence** | On blur | Required field check |
| **Format** | On blur | Email, phone, MAC format |
| **Length** | On input | Min/max character limits |
| **Pattern** | On blur | Regex patterns |
| **Async** | On blur (debounced) | Uniqueness, API validation |
| **Cross-field** | On submit | Password confirmation, date ranges |
| **Form-level** | On submit | Overall form validity |

#### 5.10.2 Validation Message Display

```
Label *
┌─────────────────────────────────────┐
│ invalid@email                       │  ← Error state (red border)
└─────────────────────────────────────┘
⚠️ Please enter a valid email address    ← Error message below

Label
┌─────────────────────────────────────┐
│ valid@email.com                     │  ← Success state (optional green)
└─────────────────────────────────────┘
✓ Email is available                     ← Success message (optional)
```

#### 5.10.3 Field State Styles

| State | Border | Background | Icon |
|-------|--------|------------|------|
| **Default** | Gray-300 | White | None |
| **Focus** | Primary Blue | White | None |
| **Valid** | Green-500 (optional) | White | ✓ (optional) |
| **Error** | Red-500 | Red-50 | ⚠️ |
| **Disabled** | Gray-200 | Gray-50 | None |

#### 5.10.4 Standard Validation Rules

| Field Type | Validation Rules |
|------------|------------------|
| **Email** | Required format, max 254 chars |
| **Phone** | 10 digits (India), formatted display |
| **MAC Address** | XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX |
| **User ID** | Alphanumeric, 3-50 chars, unique |
| **Password** | Min 8 chars, 1 upper, 1 lower, 1 number |
| **Name** | 1-100 chars, letters/spaces/hyphens |
| **Date** | Valid date, logical ranges |

#### 5.10.5 Error Message Guidelines

| Guideline | Good Example | Bad Example |
|-----------|--------------|-------------|
| **Be specific** | "Email must be in format name@domain.com" | "Invalid input" |
| **Be helpful** | "Password needs at least 8 characters" | "Password too short" |
| **Be polite** | "Please enter your email address" | "Email required!" |
| **Avoid blame** | "This email is already registered" | "You already have an account" |
| **Suggest action** | "Try a different username" | "Username taken" |

#### 5.10.6 Form Submission Validation

**On Submit:**
1. Validate all fields
2. If errors exist:
   - Prevent submission
   - Show all error messages
   - Scroll to first error field
   - Focus first error field
   - Show error toast: "Please fix the errors below"
3. If valid:
   - Disable submit button
   - Show loading state
   - Submit form

**After Submission:**
- Success: Show success toast, close modal or redirect
- Server Error: Show error toast, re-enable form
- Validation Error: Map server errors to fields, show messages

#### 5.10.7 Real-Time Validation Indicators

**Character Counter:**
```
Description
┌─────────────────────────────────────┐
│ This is a description text...       │
└─────────────────────────────────────┘
                              45 / 200   ← Counter (turns red near limit)
```

**Password Strength:**
```
Password *
┌─────────────────────────────────────┐
│ ••••••••••                          │
└─────────────────────────────────────┘
Strength: [████████░░] Strong           ← Strength indicator

Requirements:
✓ At least 8 characters
✓ One uppercase letter
✓ One lowercase letter
✗ One number                            ← Unchecked requirement
```

### 5.11 Data Loading States

#### 5.11.1 Skeleton Loaders

**Table Skeleton:**
```
┌─────────────────────────────────────────────────────────┐
│  ████████  │  ████████████  │  ██████  │  ████  │      │
├─────────────────────────────────────────────────────────┤
│  ░░░░░░░░  │  ░░░░░░░░░░░░  │  ░░░░░░  │  ░░░░  │  ░░  │
│  ░░░░░░░░  │  ░░░░░░░░░░░░  │  ░░░░░░  │  ░░░░  │  ░░  │
│  ░░░░░░░░  │  ░░░░░░░░░░░░  │  ░░░░░░  │  ░░░░  │  ░░  │
└─────────────────────────────────────────────────────────┘
```

**Card Skeleton:**
```
┌─────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░                   │  ← Title placeholder
│                                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░        │  ← Content placeholder
│  ░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  ░░░░░░░░░░░░░░░░░                │
│                                     │
│  ░░░░░░░░░░  ░░░░░░░░░░            │  ← Meta placeholder
└─────────────────────────────────────┘
```

**Animation:** Shimmer effect (left to right gradient animation)

#### 5.11.2 Loading Spinners

| Context | Size | Position |
|---------|------|----------|
| **Button** | 16px | Replace button text |
| **Card** | 32px | Center of card |
| **Page** | 48px | Center of content area |
| **Modal** | 32px | Center of modal body |
| **Inline** | 16px | Next to loading text |

#### 5.11.3 Progress Indicators

**Determinate Progress:**
```
Uploading users... 45%
[████████████████░░░░░░░░░░░░░░░░░] 45/100 users
```

**Indeterminate Progress:**
```
Processing...
[████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] ← Animated loop
```

#### 5.11.4 Loading State Guidelines

| Scenario | UI Treatment |
|----------|--------------|
| **< 300ms** | No indicator (avoid flicker) |
| **300ms - 1s** | Spinner only |
| **1s - 3s** | Spinner with message |
| **> 3s** | Progress indicator if determinate |
| **Background** | Toast notification when complete |

### 5.12 Empty States

#### 5.12.1 Empty State Components

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    [Illustration]                   │
│                                                     │
│              No users found                         │  ← Title
│                                                     │
│     There are no users registered at this site.    │  ← Description
│     Add your first user to get started.            │
│                                                     │
│                  [+ Add User]                       │  ← Action button
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 5.12.2 Empty State Types

| Type | Title | Description | Action |
|------|-------|-------------|--------|
| **No Data** | "No [items] yet" | Explanation + encouragement | Primary action |
| **No Results** | "No results found" | Search/filter adjustment tips | Clear filters |
| **Error** | "Unable to load [items]" | Brief error explanation | Retry |
| **Permission** | "Access restricted" | Permission explanation | Request access |
| **Coming Soon** | "Coming soon" | Feature preview | None or notify me |

#### 5.12.3 Empty State Illustrations

Each empty state shall have a relevant illustration:
- **No Users:** Person outline with plus
- **No Devices:** Device outline
- **No Search Results:** Magnifying glass with X
- **No Reports:** Chart outline
- **Error:** Warning triangle
- **No Notifications:** Bell with Z's

---

## 6. Front-End Technical Requirements

### 6.1 Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 18.x |
| **Language** | JavaScript (ES6+) | - |
| **State Management** | React Context + Hooks | - |
| **Routing** | React Router | 6.x |
| **HTTP Client** | Axios | 1.x |
| **Charts** | Chart.js + react-chartjs-2 | 4.x |
| **Icons** | React Icons | 4.x |
| **Date Handling** | date-fns | 2.x |
| **Form Handling** | React Hook Form | 7.x |
| **Styling** | CSS Modules + CSS Variables | - |
| **Build Tool** | Create React App / Vite | - |
| **Package Manager** | npm | 9.x |

### 6.2 Browser Support

| Browser | Minimum Version | Support Level |
|---------|-----------------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Opera | 76+ | Full |
| Samsung Internet | 14+ | Basic |
| IE | - | Not Supported |

### 6.3 Performance Requirements

#### 6.3.1 Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FCP** | < 1.8s | First Contentful Paint |
| **TTI** | < 3.5s | Time to Interactive |
| **TBT** | < 200ms | Total Blocking Time |

#### 6.3.2 Bundle Size Limits

| Bundle | Max Size (gzipped) |
|--------|-------------------|
| **Initial JS** | 150 KB |
| **Initial CSS** | 50 KB |
| **Per-route chunk** | 50 KB |
| **Total (all routes)** | 500 KB |
| **Images (above fold)** | 200 KB |

#### 6.3.3 Performance Optimization Techniques

| Technique | Implementation |
|-----------|----------------|
| **Code Splitting** | React.lazy() for route-based splitting |
| **Tree Shaking** | ES6 imports, avoid barrel files |
| **Image Optimization** | WebP format, lazy loading, srcset |
| **Caching** | Service Worker, HTTP cache headers |
| **Compression** | Gzip/Brotli on server |
| **CDN** | Static assets via CDN |
| **Preloading** | Critical resources preloaded |
| **Debouncing** | Search, resize, scroll handlers |

### 6.4 Code Organization

#### 6.4.1 Folder Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Card, Modal)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── charts/         # Chart components
├── config/             # Configuration files
├── constants/          # Application constants
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components (routes)
├── services/           # API service functions
├── utils/              # Utility functions
├── styles/             # Global styles, variables
└── locales/            # i18n translation files
```

#### 6.4.2 Component Structure

```
components/
├── Button/
│   ├── Button.js       # Component logic
│   ├── Button.css      # Component styles
│   ├── Button.test.js  # Unit tests
│   └── index.js        # Export
```

#### 6.4.3 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `UserListTable.js` |
| **Hooks** | camelCase with 'use' prefix | `usePermissions.js` |
| **Utilities** | camelCase | `formatDate.js` |
| **Constants** | SCREAMING_SNAKE_CASE | `API_ENDPOINTS` |
| **CSS Classes** | kebab-case | `.user-card-header` |
| **CSS Variables** | kebab-case with prefix | `--color-primary` |
| **Event Handlers** | camelCase with 'handle' prefix | `handleSubmit` |

### 6.5 State Management

#### 6.5.1 State Categories

| Category | Management | Scope |
|----------|------------|-------|
| **UI State** | useState, useReducer | Component/Local |
| **Server State** | Custom hooks with caching | Application |
| **URL State** | React Router | Global |
| **Form State** | React Hook Form | Component |
| **Auth State** | Context API | Global |
| **Theme State** | Context API | Global |

#### 6.5.2 Context Providers

| Context | Purpose | Data |
|---------|---------|------|
| **AuthContext** | User authentication | user, token, permissions |
| **ThemeContext** | Theme preferences | theme, toggleTheme |
| **AccessLevelContext** | Current access scope | level, site, company |
| **NotificationContext** | Toast notifications | addToast, removeToast |
| **SidebarContext** | Sidebar state | isOpen, toggle |

### 6.6 API Integration Patterns

#### 6.6.1 API Service Structure

```javascript
// services/userService.js
import api from './api';

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  bulkImport: (file) => api.post('/users/bulk-import', file),
};
```

#### 6.6.2 Error Handling

| Error Type | HTTP Code | UI Response |
|------------|-----------|-------------|
| **Validation** | 400 | Show field-level errors |
| **Unauthorized** | 401 | Redirect to login |
| **Forbidden** | 403 | Show permission error |
| **Not Found** | 404 | Show not found page |
| **Conflict** | 409 | Show conflict message |
| **Rate Limited** | 429 | Show retry message with delay |
| **Server Error** | 500 | Show generic error, log details |
| **Network Error** | - | Show offline message |

#### 6.6.3 Request/Response Interceptors

**Request Interceptor:**
- Add Authorization header
- Add Content-Type header
- Add request timestamp
- Log request in development

**Response Interceptor:**
- Handle token refresh
- Normalize error format
- Log response in development
- Track response time

### 6.7 Security Implementation

#### 6.7.1 Authentication

| Requirement | Implementation |
|-------------|----------------|
| **Token Storage** | HttpOnly cookies (preferred) or secure localStorage |
| **Token Refresh** | Automatic refresh before expiry |
| **Session Timeout** | 30 minutes of inactivity |
| **Logout** | Clear all tokens, redirect to login |

#### 6.7.2 Authorization

| Requirement | Implementation |
|-------------|----------------|
| **Route Protection** | PrivateRoute component checks permissions |
| **Component Protection** | usePermission hook for conditional rendering |
| **API Protection** | Backend validates all requests |

#### 6.7.3 Input Sanitization

| Input Type | Sanitization |
|------------|--------------|
| **Text** | Strip HTML tags, escape special characters |
| **HTML** | DOMPurify for rich text |
| **URLs** | Validate protocol, domain whitelist |
| **File Uploads** | Type validation, size limits |

---

## 7. Key User Flows

### 7.1 Authentication Flows

#### 7.1.1 Login Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                              LOGIN FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [User visits portal] ──► [Login Page displayed]                   │
│                                     │                               │
│                                     ▼                               │
│                          [Enter credentials]                        │
│                          (Email + Password)                         │
│                                     │                               │
│                                     ▼                               │
│                          [Click "Sign In"]                          │
│                                     │                               │
│                    ┌────────────────┼────────────────┐              │
│                    ▼                ▼                ▼              │
│               [Invalid]      [2FA Required]     [Success]           │
│                    │                │                │              │
│                    ▼                ▼                ▼              │
│            [Show error]    [Show OTP input]   [Redirect to         │
│            [Clear pwd]     [Verify OTP]       Dashboard]           │
│                    │                │                               │
│                    ▼                ▼                               │
│              [Retry]         [On success ──► Dashboard]             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Flow Steps:**

| Step | Action | System Response | Error Handling |
|------|--------|-----------------|----------------|
| 1 | User navigates to portal URL | Display login page | - |
| 2 | User enters email address | Validate email format on blur | Show format error |
| 3 | User enters password | Mask password characters | - |
| 4 | User clicks "Sign In" | Validate credentials with API | Show invalid credentials error |
| 5 | (If 2FA enabled) | Display OTP input | - |
| 6 | User enters OTP | Validate OTP | Show invalid OTP error |
| 7 | Authentication successful | Set auth token, redirect to dashboard | - |

**Login Page Requirements:**

| Element | Specification |
|---------|---------------|
| **Email Field** | Required, email format validation |
| **Password Field** | Required, show/hide toggle |
| **Remember Me** | Optional checkbox, extends session |
| **Sign In Button** | Primary button, disabled until valid |
| **Forgot Password** | Link below form |
| **Loading State** | Spinner on button during API call |
| **Error Display** | Inline error above form |

#### 7.1.2 Forgot Password Flow

```
[Forgot Password Link] ──► [Enter Email] ──► [Submit]
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
           [Email not found]          [Email sent]              [Rate limited]
           [Show error]               [Show success]            [Show wait time]
                                            │
                                            ▼
                                    [User clicks email link]
                                            │
                                            ▼
                                    [Reset Password Page]
                                    [Enter new password]
                                    [Confirm password]
                                            │
                                            ▼
                                    [Password Updated]
                                    [Redirect to Login]
```

#### 7.1.3 Session Management

| Scenario | Behavior |
|----------|----------|
| **Session Timeout** | Warning modal at 5 min before expiry, auto-logout at expiry |
| **Concurrent Sessions** | Allow multiple sessions, show active sessions in profile |
| **Force Logout** | Admin can terminate user sessions |
| **Token Refresh** | Automatic refresh 5 min before expiry |

### 7.2 Customer Portal User Flows

#### 7.2.1 Dashboard Overview Flow

```
[Login Success] ──► [Fetch Dashboard Data] ──► [Display Dashboard]
                           │
                           ├── Metrics API
                           ├── Charts API
                           ├── Recent Activity API
                           └── Alerts API
```

**Dashboard Loading Sequence:**
1. Show skeleton loaders immediately
2. Fetch all dashboard APIs in parallel
3. Render components as data arrives
4. Show error state for failed components

#### 7.2.2 User Registration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER REGISTRATION FLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Click "Add User"] ──► [Check License Availability]               │
│                                     │                               │
│              ┌──────────────────────┼──────────────────────┐        │
│              ▼                      ▼                      ▼        │
│      [No License]           [License OK]           [License Low]   │
│      [Show error]           [Open Form]            [Show warning]  │
│      [Offer upgrade]              │                [Open Form]     │
│                                   │                      │         │
│                                   ▼                      │         │
│                          [Display Form]◄─────────────────┘         │
│                          (Segment-specific)                        │
│                                   │                                 │
│                                   ▼                                 │
│                          [Fill Required Fields]                     │
│                          [Select Policy]                           │
│                                   │                                 │
│                                   ▼                                 │
│                          [Click "Register"]                         │
│                                   │                                 │
│                    ┌──────────────┼──────────────┐                  │
│                    ▼              ▼              ▼                  │
│             [Validation      [API Error]   [Success]               │
│              Error]                │              │                 │
│                    │              ▼              ▼                  │
│                    ▼       [Show error]   [Close Modal]            │
│             [Highlight      [Enable form] [Show success toast]     │
│              fields]                      [Refresh user list]      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Form Validation Sequence:**
1. On blur: Validate individual field
2. On change: Clear field error
3. On submit: Validate all fields
4. If errors: Scroll to first error, focus field
5. If valid: Submit to API

**Segment-Specific Form Logic:**

| Segment | Conditional Fields | Special Behavior |
|---------|-------------------|------------------|
| **Enterprise** | Department, Job Title | User ID required |
| **Co-Living** | Check-in/out dates (if Short Term) | Auto-deactivate on check-out |
| **Co-Working** | Move-in/out dates (if Temporary) | Company field |
| **Hotel** | Check-in/out required, Room required | Auto-generate User ID |
| **PG** | Minimal fields | Mobile as primary identifier |

#### 7.2.3 User Status Change Flow

```
[Select User] ──► [Click "Change Status"] ──► [Select New Status]
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    ▼                                 ▼                                 ▼
             [Activate]                        [Suspend]                          [Block]
             (from Suspended)                  (from Active)                      (from any)
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
         [Confirm Dialog]                  [Confirm Dialog]                  [Warning Dialog]
         "Activate user?"                  "Suspend user?"                   "Block user?"
         [Optional reason]                 [Optional reason]                 [Required reason]
                    │                                 │                      "Irreversible!"
                    ▼                                 ▼                                 │
             [Call API]                        [Call API]                              ▼
                    │                                 │                      [Type "BLOCK"]
                    ▼                                 ▼                      [to confirm]
         [Success Toast]                   [Success Toast]                             │
         [Update UI]                       [Update UI]                                 ▼
                                                                              [Call API]
                                                                                       │
                                                                                       ▼
                                                                              [Success Toast]
                                                                              [Update UI]
```

#### 7.2.4 Device Registration Flow

```
[Click "Add Device"] ──► [Select Device Category]
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            [User Device]   [Smart Device]   [Digital Device]
                    │               │               │
                    ▼               ▼               ▼
            [Select Owner]  [No Owner]      [No Owner]
            [Required]      [Optional]      [Optional]
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                          [Enter Device Name]
                          [Enter MAC Address]
                                    │
                                    ▼
                          [Validate MAC Format]
                          [Check for duplicates]
                          [Lookup vendor (OUI)]
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            [Invalid MAC]   [Duplicate]     [Valid]
            [Show error]    [Show error]    [Show vendor]
                                    │               │
                                    │               ▼
                                    │      [Select Device Type]
                                    │      (Mobile, Laptop, etc.)
                                    │               │
                                    │               ▼
                                    │      [Submit Registration]
                                    │               │
                                    │               ▼
                                    │      [Success Toast]
                                    │      [Refresh device list]
                                    ▼
                          [Clear form]
                          [Retry]
```

#### 7.2.5 Report Generation Flow

```
[Navigate to Reports] ──► [Select Report Category] ──► [Select Report]
                                                              │
                                                              ▼
                                                    [Open Criteria Modal]
                                                    [Select Date Range]
                                                    [Apply Filters]
                                                              │
                                                              ▼
                                                    [Click "Generate"]
                                                              │
                                                              ▼
                                                    [Show Loading State]
                                                    [Fetch Report Data]
                                                              │
                                    ┌─────────────────────────┼─────────────────────────┐
                                    ▼                         ▼                         ▼
                            [No Data]                 [Data Found]               [Error]
                            [Empty State]             [Display Report]           [Error State]
                                                              │                  [Retry Button]
                                                              ▼
                                                    [View in Table/Chart]
                                                    [Export Options]
                                                              │
                                    ┌─────────────────────────┼─────────────────────────┐
                                    ▼                         ▼                         ▼
                              [Export CSV]              [Export PDF]            [Schedule Report]
                                    │                         │                  (Future)
                                    ▼                         ▼
                          [Generate File]           [Generate File]
                          [Download]                [Download]
```

### 7.3 Internal Portal User Flows

#### 7.3.1 Site Provisioning Wizard Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SITE PROVISIONING WIZARD                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Customer Selection                                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ ○ Select Existing Customer  ● Create New Customer         │    │
│  │   [Search customers...]      [Customer Name]               │    │
│  │                              [Industry]                    │    │
│  │                              [Contact Info]                │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 2: Site Information                                           │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Site Name*: [________________________]                     │    │
│  │ Segment*:   [Enterprise ▼]                                 │    │
│  │ Address*:   [________________________]                     │    │
│  │ City*:      [____________]  State*: [__________]           │    │
│  │ Region*:    [North ▼]                                      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 3: Contact Details                                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Primary Contact Name*:  [_____________________]            │    │
│  │ Email*:                 [_____________________]            │    │
│  │ Phone*:                 [_____________________]            │    │
│  │ Secondary Contact:      [_____________________]            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 4: Capacity Planning                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Max Users*:        [500]    License Tier: [Standard ▼]     │    │
│  │ Max Devices*:      [1500]                                  │    │
│  │ Bandwidth Limit*:  [1000] Mbps                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 5: Network Configuration                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Config Template*:  [Standard Enterprise ▼]                 │    │
│  │ RADIUS Server:     [radius1.spectra.co]                    │    │
│  │ Captive Portal:    [portal.spectra.co]                     │    │
│  │ Custom Domain:     [wifi.clientname.com]                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 6: Deployment Details                                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Planned Go-Live*:  [📅 2024-01-15]                         │    │
│  │ Deployment Notes:  [________________________]              │    │
│  │                    [________________________]              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Step 7: Review & Confirm                                           │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Customer:    Acme Corporation                              │    │
│  │ Site:        Acme HQ - Mumbai                              │    │
│  │ Segment:     Enterprise                                    │    │
│  │ Capacity:    500 users, 1500 devices, 1000 Mbps            │    │
│  │ Go-Live:     January 15, 2024                              │    │
│  │                                                            │    │
│  │ [ ] I confirm all details are correct                      │    │
│  │                                                            │    │
│  │             [Back]  [Save as Draft]  [Provision Site]      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Wizard Navigation Rules:**
- Back button always available (except Step 1)
- Next button validates current step before proceeding
- Progress indicator shows current step and completion status
- Save as Draft available from any step
- Jump to step only allowed for completed steps

#### 7.3.2 Support Ticket Resolution Flow

```
[Open Ticket] ──► [View Ticket Details]
                        │
                        ├── Customer Info
                        ├── Site Info
                        ├── Issue Description
                        ├── Conversation History
                        └── Attachments
                        │
                        ▼
              [Assess Priority & Category]
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   [Self-Resolve]  [Need Info]   [Escalate]
         │              │              │
         ▼              ▼              ▼
   [Add Response]  [Request Info] [Assign to Team]
   [Provide        [Set status    [Add notes]
    Solution]       Pending]      [Set priority]
         │              │              │
         ▼              │              ▼
   [Confirm with       │         [Track Escalation]
    Customer]          │              │
         │              │              │
         ▼              ▼              │
   [Customer      [Info Received]     │
    Confirms]     [Resume Work]       │
         │              │              │
         ▼              ▼              ▼
   [Close Ticket] ◄────┴──────────────┘
   [Set Resolution]
   [Update KB if new issue]
```

#### 7.3.3 Bulk Operation Flow

```
[Select Bulk Operation] ──► [Download Template] ──► [Fill Data Offline]
                                                           │
                                                           ▼
                                                  [Upload CSV File]
                                                           │
                                                           ▼
                                                  [Validation Phase]
                                                  [Parse file]
                                                  [Validate each row]
                                                           │
                                    ┌──────────────────────┼──────────────────────┐
                                    ▼                      ▼                      ▼
                            [All Valid]            [Some Errors]          [All Errors]
                                    │                      │                      │
                                    ▼                      ▼                      ▼
                            [Show Preview]         [Show Preview]         [Show Error Report]
                            [Row count]            [Valid rows]           [Download errors]
                                    │              [Error rows marked]    [Fix & retry]
                                    │                      │
                                    ▼                      ▼
                            [Confirm]              [Choose Action]
                                    │                      │
                                    │         ┌────────────┼────────────┐
                                    │         ▼            ▼            ▼
                                    │   [Process All]  [Valid Only]  [Cancel]
                                    │         │            │            │
                                    └─────────┼────────────┘            │
                                              ▼                         ▼
                                        [Execute]                  [Return]
                                        [Show Progress]
                                        [% complete]
                                              │
                                              ▼
                                        [Results Summary]
                                        [Success count]
                                        [Failure count]
                                        [Download report]
```

---

## 8. Customer Portal - Dashboard

### 8.1 Dashboard Overview

The Dashboard serves as the primary landing page for customer portal users, providing an at-a-glance view of network status, key metrics, and quick access to common actions.

### 8.2 Site-Level Dashboard

#### 8.2.1 Metric Cards Section

**Layout:** 4-column grid (desktop), 2-column (tablet), 1-column (mobile)

**Card 1: Active Users**
| Element | Specification |
|---------|---------------|
| **Icon** | Users icon (👥) |
| **Title** | "Active Users" |
| **Value** | Current active user count |
| **Format** | Number with thousand separator |
| **Trend** | % change vs previous period |
| **Trend Color** | Green if positive, Red if negative |
| **Click Action** | Navigate to User List |

**Card 2: License Usage**
| Element | Specification |
|---------|---------------|
| **Icon** | License icon (📋) |
| **Title** | "License Usage" |
| **Value** | "{used} / {total}" |
| **Visual** | Progress bar below value |
| **Bar Color** | Green (<70%), Amber (70-90%), Red (>90%) |
| **Click Action** | Navigate to License Details modal |

**Card 3: Data Usage**
| Element | Specification |
|---------|---------------|
| **Icon** | Data icon (📊) |
| **Title** | "Data Usage" |
| **Value** | Total consumption |
| **Format** | Auto-scale (GB/TB) |
| **Period** | Current billing period |
| **Trend** | % change vs previous period |
| **Click Action** | Navigate to Usage Report |

**Card 4: Network Uptime**
| Element | Specification |
|---------|---------------|
| **Icon** | Uptime icon (⬆️) |
| **Title** | "Network Uptime" |
| **Value** | Percentage (e.g., "99.9%") |
| **Visual** | Color-coded value |
| **Color** | Green (>99%), Amber (95-99%), Red (<95%) |
| **Period** | Last 30 days |
| **Click Action** | Navigate to Uptime Report |

#### 8.2.2 Charts Section

**Chart 1: Network Usage Trend**
| Specification | Value |
|---------------|-------|
| **Type** | Line Chart |
| **Data** | Daily data consumption |
| **Period** | Last 7 days (default) |
| **Period Options** | 7 days, 14 days, 30 days |
| **X-Axis** | Date |
| **Y-Axis** | Data volume (GB) |
| **Interactions** | Hover tooltips, period selector |

**Chart 2: Users by Policy**
| Specification | Value |
|---------------|-------|
| **Type** | Horizontal Bar Chart |
| **Data** | User count per policy |
| **Sorting** | Descending by count |
| **Colors** | Gradient from primary blue |
| **Interactions** | Hover tooltips, click to filter user list |

**Chart 3: Peak Usage Hours**
| Specification | Value |
|---------------|-------|
| **Type** | Bar Chart |
| **Data** | Average usage by hour |
| **X-Axis** | Hour (0-23) |
| **Y-Axis** | Average concurrent users |
| **Highlight** | Peak hour highlighted |

#### 8.2.3 Recent Activity Section

**Component Type:** Horizontal carousel

**Card Contents:**
| Element | Specification |
|---------|---------------|
| **Icon** | Activity type icon |
| **Title** | Action description |
| **Timestamp** | Relative time ("2 hours ago") |
| **Details** | Additional context (user name, device) |
| **Click Action** | Navigate to Activity Logs with filter |

**Carousel Behavior:**
- Show 3 cards at a time (desktop)
- Auto-scroll every 5 seconds
- Pause on hover
- Navigation arrows on sides
- Dots indicator below

#### 8.2.4 Quick Actions Section

**Layout:** Icon grid with 4-5 items per row

| Action | Icon | Permission | Navigation |
|--------|------|------------|------------|
| Add User | ➕👤 | canEditUsers | User Form Modal |
| View Users | 👥 | canEditUsers | User List |
| Add Device | ➕💻 | canManageDevices | Device Form Modal |
| View Reports | 📊 | canViewReports | Reports Page |
| Activity Logs | 📜 | canViewLogs | Activity Logs |
| Knowledge Center | 📚 | None | Knowledge Center |

### 8.3 Company-Level Dashboard

#### 8.3.1 Additional Metric Cards

**Card: Total Sites**
| Element | Specification |
|---------|---------------|
| **Value** | Total site count |
| **Sub-value** | "{active} active" |
| **Click Action** | Show sites breakdown modal |

**Card: Total Users (Company)**
| Element | Specification |
|---------|---------------|
| **Value** | Sum of all site users |
| **Trend** | Month-over-month growth |
| **Click Action** | Navigate to company user view |

**Card: Total Devices (Company)**
| Element | Specification |
|---------|---------------|
| **Value** | Sum of all site devices |
| **Sub-value** | "{online} online now" |
| **Click Action** | Navigate to company device view |

#### 8.3.2 Sites Overview Grid

**Layout:** Responsive card grid

**Site Card Contents:**
```
┌────────────────────────────────────────┐
│  🏢 Site Name                    [●]   │  ← Status indicator
│  ───────────────────────────────────── │
│  👥 245 users    💻 512 devices        │
│  📊 85% capacity 📶 Online             │
│  ───────────────────────────────────── │
│  [View Details]                        │
└────────────────────────────────────────┘
```

**Status Indicators:**
| Status | Color | Condition |
|--------|-------|-----------|
| Online | Green | All systems normal |
| Degraded | Amber | Performance issues |
| Offline | Red | Site unreachable |
| Maintenance | Purple | Scheduled maintenance |

#### 8.3.3 Company Analytics Charts

**Chart: Users by Site**
| Specification | Value |
|---------------|-------|
| **Type** | Horizontal Bar Chart |
| **Data** | Active users per site |
| **Sorting** | Descending |
| **Click Action** | Drill down to site |

**Chart: Bandwidth by Site**
| Specification | Value |
|---------------|-------|
| **Type** | Horizontal Bar Chart |
| **Data** | Bandwidth utilization per site |
| **Color Coding** | Based on utilization % |

### 8.4 Dashboard Refresh and Real-Time Updates

| Behavior | Specification |
|----------|---------------|
| **Auto-Refresh** | Every 5 minutes |
| **Manual Refresh** | Refresh button in header |
| **Real-Time** | WebSocket for critical alerts (future) |
| **Loading** | Skeleton loaders during refresh |
| **Stale Indicator** | Show "Last updated: X min ago" |

---

## 9. Customer Portal - User Management

### 9.1 User Data Model

#### 9.1.1 Core User Fields

| Field | Type | Required | Editable | Description |
|-------|------|----------|----------|-------------|
| `userId` | String | Yes | No (after create) | Unique identifier |
| `firstName` | String | Yes | Yes | User's first name |
| `lastName` | String | Yes | Yes | User's last name |
| `email` | String | Conditional | Yes | Email address |
| `mobile` | String | Yes | Yes | Mobile number |
| `status` | Enum | Yes | Yes | active, suspended, blocked |
| `policyId` | String | Yes | Yes | Assigned policy reference |
| `siteId` | String | Yes | No | Site assignment |
| `segment` | String | Yes | No | Segment type |
| `registeredAt` | DateTime | Auto | No | Registration timestamp |
| `lastOnline` | DateTime | Auto | No | Last activity timestamp |
| `createdBy` | String | Auto | No | Admin who created |
| `modifiedAt` | DateTime | Auto | No | Last modification timestamp |

#### 9.1.2 Segment-Specific Fields

**Enterprise Segment:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `department` | String | No | Department name |
| `jobTitle` | String | No | Job title/designation |
| `employeeId` | String | No | Internal employee ID |

**Co-Living Segment:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `residentType` | Enum | Yes | long_term, short_term |
| `roomNumber` | String | No | Room/unit number |
| `checkInDate` | Date | Conditional | Required for short_term |
| `checkInTime` | Time | Conditional | Required for short_term |
| `checkOutDate` | Date | Conditional | Required for short_term |
| `checkOutTime` | Time | Conditional | Default 2:00 PM |
| `organization` | String | No | Company/organization |

**Co-Working Segment:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `memberType` | Enum | Yes | permanent, temporary |
| `membershipId` | String | No | Membership ID |
| `company` | String | No | Company name |
| `deskNumber` | String | No | Assigned desk |
| `moveInDate` | Date | Conditional | For temporary members |
| `moveOutDate` | Date | Conditional | For temporary members |

**Hotel Segment:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomNumber` | String | Yes | Hotel room number |
| `checkInDate` | Date | Yes | Check-in date |
| `checkInTime` | Time | Yes | Check-in time |
| `checkOutDate` | Date | Yes | Check-out date |
| `checkOutTime` | Time | Yes | Default 12:00 PM |
| `guestId` | String | No | PMS guest ID |
| `reservationId` | String | No | Reservation reference |

**PG Segment:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomNumber` | String | No | Room number |
| `bedNumber` | String | No | Bed assignment |

### 9.2 User List View

#### 9.2.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  User Management                                          [+ Add User]  │
│  Manage users and their Wi-Fi access                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ License: ████████████░░░ 245/300 (82%)                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search users...    Status: [All ▼]    Site: [All Sites ▼]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ User ID ↑ │ Name     │ Email        │ Mobile    │ Status │ ... │   │
│  ├───────────┼──────────┼──────────────┼───────────┼────────┼─────┤   │
│  │ USR-001   │ John Doe │ john@co.com  │ 98765...  │ Active │ ... │   │
│  │ USR-002   │ Jane Doe │ jane@co.com  │ 98765...  │ Susp.  │ ... │   │
│  │ ...       │ ...      │ ...          │ ...       │ ...    │ ... │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [< Prev] [1] [2] [3] ... [10] [Next >]    Showing 1-10 of 245         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 9.2.2 Table Column Specifications

| Column | Width | Sortable | Mobile Priority |
|--------|-------|----------|-----------------|
| Checkbox | 40px | No | Hidden |
| User ID | 120px | Yes | High |
| Name | 180px | Yes | High |
| Email | 200px | Yes | Medium |
| Mobile | 130px | Yes | Low |
| Policy | 180px | No | Hidden |
| Devices | 80px | Yes | Low |
| Status | 100px | Yes | High |
| Registration | 120px | Yes | Hidden |
| Last Online | 140px | Yes | Hidden |
| Site (Company view) | 150px | Yes | Medium |
| Actions | 80px | No | High |

#### 9.2.3 Row Actions Menu

| Action | Icon | Permission | Condition |
|--------|------|------------|-----------|
| View Details | 👁️ | canEditUsers | Always |
| Edit | ✏️ | canEditUsers | Not blocked |
| Activate | ▶️ | canEditUsers | Status = suspended |
| Suspend | ⏸️ | canEditUsers | Status = active |
| Block | 🚫 | canEditUsers | Status ≠ blocked |
| Reset Password | 🔑 | canEditUsers | Always |
| View Devices | 💻 | canManageDevices | Always |
| Export | 📥 | canViewReports | Always |

#### 9.2.4 Bulk Actions

**Available when rows selected:**
- Export Selected (CSV)
- Suspend Selected
- Activate Selected
- Change Policy (all selected)

### 9.3 User Registration Modal

#### 9.3.1 Modal Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Add New User                                                   [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Basic Information                                                  │
│  ─────────────────                                                  │
│                                                                     │
│  User ID *                          Policy *                        │
│  ┌──────────────────────────┐       ┌──────────────────────────┐   │
│  │ USR-                     │       │ Select policy...       ▼ │   │
│  └──────────────────────────┘       └──────────────────────────┘   │
│                                                                     │
│  First Name *                       Last Name *                     │
│  ┌──────────────────────────┐       ┌──────────────────────────┐   │
│  │                          │       │                          │   │
│  └──────────────────────────┘       └──────────────────────────┘   │
│                                                                     │
│  Email *                            Mobile *                        │
│  ┌──────────────────────────┐       ┌──────────────────────────┐   │
│  │                          │       │ +91                      │   │
│  └──────────────────────────┘       └──────────────────────────┘   │
│                                                                     │
│  [Segment-specific fields appear here based on segment type]        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                           [Cancel]  [Register User] │
└─────────────────────────────────────────────────────────────────────┘
```

#### 9.3.2 Policy Selection Component

```
┌─────────────────────────────────────────────────────────────────────┐
│  Policy *                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Standard - 50 Mbps                                        ▼ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Selected Policy Details:                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📶 Speed:     50 Mbps (Download) / 25 Mbps (Upload)        │   │
│  │  📊 Data:      100 GB per month                             │   │
│  │  💻 Devices:   3 devices allowed                            │   │
│  │  🔄 Cycle:     Monthly (resets on 1st)                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

#### 9.3.3 Conditional Field Display Logic

| Condition | Fields Shown/Hidden |
|-----------|---------------------|
| Segment = Co-Living + Type = Short Term | Show check-in/check-out fields |
| Segment = Co-Living + Type = Long Term | Hide check-in/check-out fields |
| Segment = Co-Working + Type = Temporary | Show move-in/move-out fields |
| Segment = Hotel | All date fields required, auto-generate User ID |
| Segment = Enterprise | Show department, job title fields |
| Segment = PG | Minimal fields, mobile is primary |

### 9.4 User Detail View Modal

#### 9.4.1 Layout Sections

**Header Section:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  👤 John Doe                                      [Active] ●        │
│  USR-001 • john.doe@company.com • +91 98765 43210                   │
├─────────────────────────────────────────────────────────────────────┤
```

**Information Tabs:**
- Overview (default)
- Devices
- Activity
- Usage Stats

**Overview Tab:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Policy Details                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  Policy Name:     Standard - 50 Mbps                                │
│  Speed:           50 Mbps / 25 Mbps                                 │
│  Data Allowance:  100 GB / month                                    │
│  Data Used:       45.2 GB (45%)   ████████████░░░░░░░░░░           │
│  Device Limit:    3 devices                                         │
│  Cycle Resets:    January 1, 2024                                   │
│                                                                     │
│  Account Information                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  Registered:      December 5, 2023 at 10:30 AM                      │
│  Registered By:   Admin User                                        │
│  Last Login:      2 hours ago                                       │
│  Last Modified:   December 10, 2023 at 3:45 PM                      │
│                                                                     │
│  [Segment-specific information]                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Devices Tab:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Registered Devices (2 of 3)                        [+ Add Device]  │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  📱 iPhone 14 Pro                                         [Online]  │
│     MAC: AA:BB:CC:DD:EE:01 • Apple Inc.                            │
│     Last Connected: 5 minutes ago                                   │
│                                                                     │
│  💻 MacBook Pro                                          [Offline]  │
│     MAC: AA:BB:CC:DD:EE:02 • Apple Inc.                            │
│     Last Connected: 2 days ago                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.5 User Status Management

#### 9.5.1 Status Transition Rules

```
                    ┌──────────────┐
                    │   Active     │
                    └──────────────┘
                      ↑         ↓
              [Activate]     [Suspend]
                      ↑         ↓
                    ┌──────────────┐
                    │  Suspended   │
                    └──────────────┘
                            ↓
                        [Block]
                            ↓
                    ┌──────────────┐
                    │   Blocked    │ ← Irreversible
                    └──────────────┘
```

#### 9.5.2 Suspend User Dialog

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚠️ Suspend User                                                [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Are you sure you want to suspend John Doe?                        │
│                                                                     │
│  This will:                                                         │
│  • Temporarily restrict Wi-Fi access                                │
│  • Disconnect all active sessions                                   │
│  • Keep all user data and devices intact                           │
│                                                                     │
│  Reason (optional)                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Non-payment of dues                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  You can reactivate this user at any time.                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                      [Cancel]  [Suspend User]       │
└─────────────────────────────────────────────────────────────────────┘
```

#### 9.5.3 Block User Dialog

```
┌─────────────────────────────────────────────────────────────────────┐
│  🚫 Block User                                                  [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ⚠️ WARNING: This action cannot be undone!                          │
│                                                                     │
│  You are about to permanently block John Doe.                      │
│                                                                     │
│  This will:                                                         │
│  • Permanently restrict Wi-Fi access                                │
│  • Disconnect all active sessions                                   │
│  • Keep user record for audit purposes                             │
│  • Cannot be reversed                                               │
│                                                                     │
│  Reason (required) *                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Policy violation - unauthorized device sharing              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Type "BLOCK" to confirm:                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                      [Cancel]  [Block User]         │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.6 Bulk Import

#### 9.6.1 Import Wizard Steps

**Step 1: Download Template**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Bulk User Import - Step 1 of 4                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Download the CSV template and fill in user details.                │
│                                                                     │
│  📥 [Download Template]                                             │
│                                                                     │
│  Template Columns:                                                  │
│  • user_id (required) - Unique identifier                          │
│  • first_name (required) - User's first name                       │
│  • last_name (required) - User's last name                         │
│  • email (required) - Email address                                │
│  • mobile (required) - 10-digit mobile number                      │
│  • policy_id (required) - Policy code from list below              │
│                                                                     │
│  Available Policies:                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ POL-001: Standard 50 Mbps                                   │   │
│  │ POL-002: Premium 100 Mbps                                   │   │
│  │ POL-003: Basic 25 Mbps                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                              [Cancel]  [Next →]     │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 2: Upload File**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Bulk User Import - Step 2 of 4                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │              📁 Drag & drop your CSV file here              │   │
│  │                                                             │   │
│  │                   or click to browse                        │   │
│  │                                                             │   │
│  │              Supported format: .csv (max 5MB)               │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                        [← Back]  [Cancel]  [Next →] │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 3: Validation Results**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Bulk User Import - Step 3 of 4                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Validation Results:                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✅ Valid Records:     47                                    │   │
│  │ ❌ Invalid Records:   3                                     │   │
│  │ 📊 Total Records:     50                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Errors Found:                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Row │ Field    │ Error                                      │   │
│  ├─────┼──────────┼────────────────────────────────────────────┤   │
│  │ 12  │ email    │ Invalid email format                       │   │
│  │ 23  │ user_id  │ Duplicate - user already exists            │   │
│  │ 45  │ policy   │ Invalid policy code "POL-999"              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Download Error Report]                                            │
│                                                                     │
│  Choose import option:                                              │
│  ○ Import valid records only (47 users)                            │
│  ○ Cancel and fix all errors                                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                             [← Back]  [Cancel]  [Import 47 Users]   │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 4: Import Progress & Results**
```
┌─────────────────────────────────────────────────────────────────────┐
│  Bulk User Import - Complete                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                          ✅ Import Complete!                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Successfully imported:  47 users                            │   │
│  │ Skipped (errors):       3 users                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Download Import Report]                                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                              [Close]  [View Users]  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Customer Portal - Device Management

### 10.1 Device Data Model

#### 10.1.1 Core Device Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `deviceId` | String | Auto | System-generated ID |
| `deviceName` | String | Yes | User-friendly name |
| `macAddress` | String | Yes | MAC address (validated) |
| `category` | Enum | Yes | user_device, smart_device, digital_device |
| `type` | Enum | Yes | Specific device type |
| `ownerId` | String | Conditional | User reference (user devices) |
| `vendor` | String | Auto | Derived from OUI lookup |
| `status` | Enum | Auto | online, offline, blocked |
| `ipAddress` | String | Auto | Current IP assignment |
| `lastConnected` | DateTime | Auto | Last connection timestamp |
| `dataUsage` | Number | Auto | Cumulative data usage |
| `siteId` | String | Yes | Site assignment |
| `registeredAt` | DateTime | Auto | Registration timestamp |
| `registeredBy` | String | Auto | Admin who registered |

#### 10.1.2 Device Type Hierarchy

```
Devices
├── User Devices
│   ├── Mobile (smartphone)
│   ├── Laptop (notebook)
│   ├── Tablet (iPad, etc.)
│   ├── Smart Speaker (Alexa, etc.)
│   └── Miscellaneous
│
├── Smart Devices
│   ├── Camera (IP cameras)
│   ├── CCTV (surveillance)
│   ├── DVR/NVR
│   ├── Sensor (IoT sensors)
│   ├── Smart TV
│   └── Smart Speaker
│
└── Digital Devices
    ├── Biometric (attendance)
    ├── Access Control
    ├── Intercom
    ├── POS Terminal
    ├── Display/Signage
    ├── Kiosk
    └── Printer
```

### 10.2 Device List View

#### 10.2.1 View Toggle

**Grid View (Default):**
```
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ 📱 iPhone 14 Pro   │ │ 💻 MacBook Pro     │ │ 📹 Camera-01       │
│ ────────────────── │ │ ────────────────── │ │ ────────────────── │
│ AA:BB:CC:DD:EE:01  │ │ AA:BB:CC:DD:EE:02  │ │ AA:BB:CC:DD:EE:03  │
│ Owner: John Doe    │ │ Owner: Jane Doe    │ │ Digital Device     │
│ ● Online           │ │ ○ Offline          │ │ ● Online           │
│ ────────────────── │ │ ────────────────── │ │ ────────────────── │
│ [Edit] [•••]       │ │ [Edit] [•••]       │ │ [Edit] [•••]       │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

**List View:**
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Name          │ MAC Address       │ Type    │ Owner    │ Status  │ Actions │
├───────────────┼───────────────────┼─────────┼──────────┼─────────┼─────────┤
│ iPhone 14 Pro │ AA:BB:CC:DD:EE:01 │ Mobile  │ John Doe │ Online  │ [•••]   │
│ MacBook Pro   │ AA:BB:CC:DD:EE:02 │ Laptop  │ Jane Doe │ Offline │ [•••]   │
│ Camera-01     │ AA:BB:CC:DD:EE:03 │ Camera  │ -        │ Online  │ [•••]   │
└───────────────────────────────────────────────────────────────────────────┘
```

#### 10.2.2 Filter Tabs

```
┌────────────────────────────────────────────────────────────────────────┐
│ [All (156)] [User Devices (98)] [Smart Devices (34)] [Digital (24)]   │
└────────────────────────────────────────────────────────────────────────┘
```

#### 10.2.3 Statistics Cards

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📊 Total        │ │ 🟢 Online       │ │ ⚪ Offline      │ │ 📶 Access Points│
│    156          │ │    89           │ │    64           │ │    12           │
│ All devices     │ │ Connected now   │ │ Not connected   │ │ Network APs     │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 10.3 Device Registration Modal

#### 10.3.1 Registration Form

```
┌─────────────────────────────────────────────────────────────────────┐
│  Register New Device                                            [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Device Category *                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ○ User Device    ○ Smart Device    ○ Digital Device         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Device Name *                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ John's iPhone                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  MAC Address *                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ AA:BB:CC:DD:EE:FF                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ✓ Valid MAC address • Vendor: Apple Inc.                          │
│                                                                     │
│  Device Type *                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Mobile                                                    ▼ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Owner (User) *                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search users...                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  Selected: John Doe (john.doe@company.com)                         │
│  Devices: 2 of 3 allowed                                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                      [Cancel]  [Register Device]    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 10.3.2 MAC Address Validation

**Validation Steps:**
1. Format validation (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)
2. Convert to standard format (uppercase, colon-separated)
3. OUI lookup (first 3 octets → vendor name)
4. Duplicate check within site
5. Display vendor information

**Validation States:**
| State | Display |
|-------|---------|
| Empty | No indicator |
| Invalid Format | "Invalid MAC address format" (red) |
| Duplicate | "Device already registered" (red) |
| Valid | "✓ Vendor: {Vendor Name}" (green) |
| Unknown Vendor | "✓ Valid MAC address • Unknown vendor" (green) |

### 10.4 Device Actions

#### 10.4.1 Action Menu

| Action | Icon | Description | Confirmation |
|--------|------|-------------|--------------|
| Edit | ✏️ | Edit device name | No |
| View Details | 👁️ | View full device info | No |
| Disconnect | ⚡ | Force disconnect | Yes (if online) |
| Block | 🚫 | Block device | Yes |
| Unblock | ✓ | Remove block | Yes |
| Delete | 🗑️ | Remove device | Yes |
| Change Owner | 👤 | Reassign to user | No |

#### 10.4.2 Device Detail Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│  📱 iPhone 14 Pro                                    [Online] ●  [X]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Device Information                                                 │
│  ─────────────────────────────────────────────────────────────────  │
│  MAC Address:      AA:BB:CC:DD:EE:01                               │
│  Vendor:           Apple Inc.                                       │
│  Type:             Mobile                                           │
│  Category:         User Device                                      │
│                                                                     │
│  Owner Information                                                  │
│  ─────────────────────────────────────────────────────────────────  │
│  Owner:            John Doe                                         │
│  Email:            john.doe@company.com                            │
│  User Status:      Active                                           │
│                                                                     │
│  Connection Details                                                 │
│  ─────────────────────────────────────────────────────────────────  │
│  Current IP:       192.168.1.105                                   │
│  Connected To:     AP-Floor2-East                                  │
│  Signal Strength:  -45 dBm (Excellent)                             │
│  Session Duration: 2h 34m                                          │
│                                                                     │
│  Usage Statistics                                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  Data Today:       1.2 GB                                          │
│  Data This Month:  15.8 GB                                         │
│  First Connected:  December 5, 2023                                │
│  Last Connected:   Currently connected                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [Disconnect]  [Block Device]                            [Close]    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. Customer Portal - Reports

### 11.1 Report Architecture

#### 11.1.1 Report Categories

| Category | Icon | Description | Report Count |
|----------|------|-------------|--------------|
| **Billing** | 💰 | Financial and billing reports | 4 |
| **Usage** | 📊 | Data consumption analytics | 5 |
| **Wi-Fi Network** | 📶 | Network infrastructure reports | 4 |
| **User** | 👥 | User activity and status | 4 |
| **Authentication** | 🔐 | Login and auth analytics | 3 |
| **Upsell** | 💳 | Top-up and revenue reports | 2 |

#### 11.1.2 Report Definitions

**Billing Reports:**

| Report Name | Description | Output | Schedule |
|-------------|-------------|--------|----------|
| Active Users Summary | Current active users with policy details | Table | Daily |
| Policy-wise User Count | User distribution by policy | Table + Chart | Weekly |
| License Utilization | License usage over time | Chart | Monthly |
| Billing Data Export | Raw data for billing systems | CSV | Monthly |

**Usage Reports:**

| Report Name | Description | Output | Schedule |
|-------------|-------------|--------|----------|
| Daily Data Consumption | Day-wise data usage | Table + Chart | Daily |
| User Data Usage | Per-user consumption | Table | On-demand |
| Peak Usage Analysis | Usage by time of day | Chart | Weekly |
| Top Consumers | Highest data users | Table | Weekly |
| Usage Trend Analysis | Month-over-month trends | Chart | Monthly |

**Wi-Fi Network Reports:**

| Report Name | Description | Output | Schedule |
|-------------|-------------|--------|----------|
| Access Point List | All APs with status | Table | On-demand |
| Client List | Connected devices | Table | On-demand |
| Network Uptime | Availability metrics | Table + Chart | Daily |
| AP Utilization | Load per access point | Table + Chart | Weekly |

### 11.2 Reports Dashboard

#### 11.2.1 Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Reports                                                                │
│  Generate and export reports for your network                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🔍 Search reports...                                                   │
│                                                                         │
│  ★ Pinned Reports                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ 📊 Daily Usage   │ │ 👥 Active Users  │ │ 📶 Network Uptime│        │
│  │ Usage            │ │ Billing          │ │ Wi-Fi Network    │        │
│  │ [Run Report]     │ │ [Run Report]     │ │ [Run Report]     │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                         │
│  Categories                                                             │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ [All] [Billing] [Usage] [Wi-Fi Network] [User] [Auth] [Upsell] │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Billing Reports                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Active Users Summary           Policy-wise User Count            │  │
│  │ Current active users with...   User distribution by policy...    │  │
│  │ [★] [Run]                      [☆] [Run]                         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ License Utilization            Billing Data Export               │  │
│  │ License usage over time...     Raw data for billing systems...   │  │
│  │ [☆] [Run]                      [☆] [Run]                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Report Execution

#### 11.3.1 Report Criteria Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│  Daily Data Consumption Report                                  [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Date Range *                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [Last 7 days ▼]                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  Or select custom range:                                            │
│  From: [📅 Dec 1, 2023]  To: [📅 Dec 7, 2023]                      │
│                                                                     │
│  Filters (Optional)                                                 │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Policy                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ All Policies                                              ▼ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  User Status                                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ All Statuses                                              ▼ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Output Format                                                      │
│  ○ View in Portal    ● Export as CSV    ○ Export as PDF            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Generate Report]      │
└─────────────────────────────────────────────────────────────────────┘
```

#### 11.3.2 Report Viewer

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Daily Data Consumption - Dec 1-7, 2023                     [X]         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Summary                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Total Consumption: 1.2 TB  │  Avg Daily: 171 GB  │  Users: 245 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Chart View] [Table View]                                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │    200 GB │      ╭─╮                                            │   │
│  │           │   ╭──╯ ╰──╮     ╭─╮                                 │   │
│  │    150 GB │╭──╯       ╰─────╯ ╰──╮                              │   │
│  │           │                      ╰──╮                           │   │
│  │    100 GB │                         ╰──                         │   │
│  │           ├─────┬─────┬─────┬─────┬─────┬─────┬─────            │   │
│  │           Dec 1 Dec 2 Dec 3 Dec 4 Dec 5 Dec 6 Dec 7             │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Date       │ Users  │ Devices │ Data Usage │ Peak Hour          │   │
│  ├────────────┼────────┼─────────┼────────────┼────────────────────┤   │
│  │ Dec 1      │ 232    │ 456     │ 185.2 GB   │ 14:00 - 15:00     │   │
│  │ Dec 2      │ 241    │ 478     │ 192.4 GB   │ 11:00 - 12:00     │   │
│  │ ...        │ ...    │ ...     │ ...        │ ...               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [📥 Export CSV]  [📄 Export PDF]  [📊 Export Chart]       [Close]     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Customer Portal - Knowledge Center

### 12.1 Knowledge Center Structure

#### 12.1.1 Content Hierarchy

```
Knowledge Center
├── Home (Overview)
│   ├── Featured Articles
│   ├── Popular Topics
│   └── Quick Links
│
├── Getting Started
│   ├── Portal Overview
│   ├── First Login Guide
│   ├── Dashboard Walkthrough
│   └── User Registration Guide
│
├── User Management
│   ├── Adding Users
│   ├── Managing User Status
│   ├── Bulk Import
│   └── Policy Assignment
│
├── Device Management
│   ├── Registering Devices
│   ├── MAC Address Guide
│   ├── Device Types
│   └── Troubleshooting
│
├── Reports & Analytics
│   ├── Report Types
│   ├── Generating Reports
│   ├── Exporting Data
│   └── Understanding Metrics
│
├── Video Tutorials
│   ├── Quick Start (5 min)
│   ├── User Management (10 min)
│   ├── Device Registration (8 min)
│   └── Reports & Export (12 min)
│
└── FAQ
    ├── Account & Login
    ├── Users & Devices
    ├── Network & Connectivity
    └── Billing & Reports
```

### 12.2 Knowledge Center Home

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Knowledge Center                                                       │
│  Find answers and learn how to use SpectraOne                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Search knowledge base...                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Quick Links                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 🚀           │ │ 👥           │ │ 💻           │ │ 📊           │   │
│  │ Getting      │ │ User         │ │ Device       │ │ Reports      │   │
│  │ Started      │ │ Management   │ │ Management   │ │              │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                         │
│  Featured Articles                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📄 How to Register Your First User                              │   │
│  │    Learn the step-by-step process for user registration         │   │
│  │    5 min read • User Management                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ 📄 Understanding Your Dashboard Metrics                         │   │
│  │    A guide to interpreting your network analytics               │   │
│  │    8 min read • Getting Started                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Video Tutorials                                                        │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ ▶️ Quick Start   │ │ ▶️ User Guide    │ │ ▶️ Device Setup  │        │
│  │ 5:30             │ │ 10:15            │ │ 8:45             │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                         │
│  Popular FAQ                                                            │
│  • How do I reset a user's password?                                   │
│  • What does "Suspended" status mean?                                  │
│  • How many devices can a user register?                               │
│  • How do I export my user list?                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 12.3 Article View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Knowledge Center                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  How to Register Your First User                                        │
│  ─────────────────────────────────────────────────────────────────────  │
│  📁 User Management  •  5 min read  •  Updated Dec 10, 2023            │
│                                                                         │
│  This guide walks you through the process of registering a new user    │
│  in the SpectraOne portal.                                             │
│                                                                         │
│  Prerequisites                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  Before you begin, ensure you have:                                    │
│  • canEditUsers permission                                             │
│  • Available user licenses                                             │
│  • User's contact information ready                                    │
│                                                                         │
│  Step 1: Navigate to User Management                                   │
│  ─────────────────────────────────────────────────────────────────────  │
│  1. Click on "User Management" in the sidebar                          │
│  2. Click the "+ Add User" button in the top right                     │
│                                                                         │
│  [Screenshot: Add User Button Location]                                │
│                                                                         │
│  Step 2: Fill in User Details                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  ...                                                                   │
│                                                                         │
│  Related Articles                                                       │
│  • Managing User Status                                                │
│  • Bulk User Import                                                    │
│  • Understanding User Policies                                         │
│                                                                         │
│  Was this article helpful?  [👍 Yes]  [👎 No]                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 12.4 FAQ Accordion

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Frequently Asked Questions                                             │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Filter: [All ▼]  🔍 Search FAQ...                                     │
│                                                                         │
│  Account & Login                                                        │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ▼ How do I reset my password?                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ To reset your password:                                         │   │
│  │ 1. Click "Forgot Password" on the login page                   │   │
│  │ 2. Enter your registered email address                         │   │
│  │ 3. Check your email for the reset link                         │   │
│  │ 4. Click the link and enter your new password                  │   │
│  │                                                                 │   │
│  │ Note: The reset link expires in 24 hours.                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ▶ How do I change my email address?                                   │
│                                                                         │
│  ▶ Why can't I log in to my account?                                   │
│                                                                         │
│  Users & Devices                                                        │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ▶ How many devices can a user register?                               │
│                                                                         │
│  ▶ What does "Blocked" status mean?                                    │
│                                                                         │
│  ▶ Can I transfer a device to another user?                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Customer Portal - Activity Logs

### 13.1 Activity Log Data Model

#### 13.1.1 Log Entry Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `logId` | String | Unique log identifier | LOG-USR-20231210-0001 |
| `timestamp` | DateTime | When action occurred | 2023-12-10T14:30:00Z |
| `action` | Enum | Type of action | CREATE, UPDATE, DELETE |
| `category` | Enum | Action category | user, device, policy, system |
| `entity` | String | Affected entity type | User, Device, Policy |
| `entityId` | String | Entity identifier | USR-001 |
| `target` | String | Human-readable target | "John Doe" |
| `performedBy` | String | Admin who performed | "admin@company.com" |
| `performerName` | String | Admin display name | "Admin User" |
| `description` | String | Detailed description | "Changed status from Active to Suspended" |
| `changes` | Object | Before/after values | { status: { old: "active", new: "suspended" } } |
| `ipAddress` | String | Source IP | 192.168.1.100 |
| `userAgent` | String | Browser/device info | Chrome/Windows |
| `siteId` | String | Site context | SITE-001 |
| `siteName` | String | Site display name | "Main Office" |

#### 13.1.2 Action Categories

| Category | Icon | Actions Logged |
|----------|------|----------------|
| **user** | 👤 | CREATE, UPDATE, DELETE, STATUS_CHANGE, POLICY_CHANGE |
| **device** | 💻 | CREATE, UPDATE, DELETE, BLOCK, UNBLOCK, DISCONNECT |
| **policy** | 📋 | CREATE, UPDATE, DELETE, ASSIGN, UNASSIGN |
| **system** | ⚙️ | LOGIN, LOGOUT, SETTINGS_CHANGE, EXPORT |

### 13.2 Activity Logs Page

#### 13.2.1 Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Activity Logs                                           [📥 Export]    │
│  Track all administrative actions in your network                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search logs...   Category: [All ▼]   Action: [All ▼]         │   │
│  │                     Date: [Last 7 days ▼]   Site: [All Sites ▼] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Active Filters: [Category: User ×] [Action: CREATE ×]  [Clear All]    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Timestamp ↓        │ Action │ Category │ Target      │ By      │   │
│  ├────────────────────┼────────┼──────────┼─────────────┼─────────┤   │
│  │ Dec 10, 14:30      │ CREATE │ user     │ John Doe    │ Admin   │   │
│  │ ▼ View Details                                                  │   │
│  ├────────────────────┼────────┼──────────┼─────────────┼─────────┤   │
│  │ Dec 10, 14:25      │ UPDATE │ user     │ Jane Doe    │ Admin   │   │
│  ├────────────────────┼────────┼──────────┼─────────────┼─────────┤   │
│  │ Dec 10, 14:20      │ DELETE │ device   │ iPhone      │ Admin   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [< Prev] [1] [2] [3] ... [15] [Next >]    Showing 1-20 of 291         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 13.2.2 Expanded Log Detail

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Dec 10, 2023 at 14:30:45                                   LOG-USR-001 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Action: User Status Changed                                            │
│  Category: User Management                                              │
│                                                                         │
│  Target User: John Doe (USR-001)                                       │
│  Performed By: Admin User (admin@company.com)                          │
│                                                                         │
│  Changes:                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Field      │ Old Value     │ New Value                          │   │
│  ├────────────┼───────────────┼────────────────────────────────────┤   │
│  │ status     │ Active        │ Suspended                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Reason: Non-payment of dues                                           │
│                                                                         │
│  Technical Details:                                                     │
│  • IP Address: 192.168.1.100                                          │
│  • User Agent: Chrome 120.0 / Windows 10                              │
│  • Site: Main Office (SITE-001)                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Internal Portal - Overview

### 14.1 Purpose and Scope

The Internal Spectra User Portal provides Spectra staff with comprehensive tools to manage the SpectraOne platform, support customers, provision sites, and ensure service delivery excellence.

### 14.2 Access Requirements

| Requirement | Specification |
|-------------|---------------|
| **Base Permission** | `canAccessInternalPortal` required for all pages |
| **Authentication** | Spectra SSO (Single Sign-On) |
| **Session Timeout** | 8 hours (configurable) |
| **IP Restrictions** | Optional VPN/office network restriction |
| **Audit Logging** | All actions logged with user attribution |

### 14.3 Navigation Structure

```
Internal Portal
├── Dashboard (/internal/dashboard)
│   └── Executive overview and platform health
│
├── Customers (/internal/customers)
│   ├── Customer List
│   ├── Add Customer
│   └── Customer Detail (/:customerId)
│
├── Sites (/internal/sites)
│   ├── Site List
│   ├── Provision Site (Wizard)
│   ├── Site Detail (/:siteId)
│   └── Site Health Monitor
│
├── Support Queue (/internal/support)
│   ├── Open Tickets
│   ├── My Tickets
│   ├── All Tickets
│   └── Ticket Detail (/:ticketId)
│
├── Reports (/internal/reports)
│   ├── Platform Analytics
│   ├── Customer Reports
│   └── Operational Reports
│
├── Knowledge Center (/internal/knowledge)
│   ├── Articles
│   ├── Videos
│   └── FAQs
│
├── Audit Logs (/internal/logs)
│   └── Platform-wide activity logs
│
├── Configuration (/internal/config)
│   ├── Bandwidth Policies
│   ├── Domain Management
│   └── Advanced Settings
│
└── Bulk Operations (/internal/bulk)
    ├── User Operations
    ├── Device Operations
    └── Scheduled Tasks
```

### 14.4 Role-Based Navigation

| Role | Visible Navigation Items |
|------|-------------------------|
| **Super Admin** | All navigation items |
| **Deployment Engineer** | Dashboard, Sites, Configuration, Knowledge Center |
| **Support Engineer** | Dashboard, Customers, Sites (read), Support Queue, Knowledge Center |
| **NOC Engineer** | Dashboard, Sites, Support Queue (create only), Audit Logs |
| **Account Manager** | Dashboard, Customers, Reports |

---

## 15. Internal Portal - Dashboard

### 15.1 Dashboard Overview

The Internal Dashboard provides a comprehensive view of platform health, customer metrics, and operational status for Spectra staff.

### 15.2 Metrics Overview Section

#### 15.2.1 Primary Metric Cards

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🏢 Customers    │ │ 📍 Sites        │ │ 👥 Users        │ │ 💻 Devices      │
│    152          │ │    487          │ │    45,234       │ │    98,456       │
│ 148 active      │ │ 479 online      │ │ 43,102 active   │ │ 67,234 online   │
│ ↑ 3% this month │ │ ↓ 2 offline     │ │ ↑ 5% growth     │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

#### 15.2.2 Secondary Metric Cards

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📋 Licenses     │ │ 📊 Bandwidth    │ │ 🎫 Open Tickets │
│ 78% utilized    │ │ 2.4 TB / 5 TB   │ │ 23 open         │
│ 45,234 / 58,000 │ │ 48% capacity    │ │ 5 critical      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 15.3 Site Health Overview

#### 15.3.1 Status Distribution

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Site Health Overview                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ ● 479   │ │ ● 5     │ │ ● 2     │ │ ● 1     │                       │
│  │ Online  │ │Degraded │ │ Offline │ │ Maint.  │                       │
│  │ 98.4%   │ │ 1.0%    │ │ 0.4%    │ │ 0.2%    │                       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                       │
│                                                                         │
│  Platform Uptime: ████████████████████████████░ 99.87% (30 days)       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.4 Active Alerts Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Active Alerts                                        [View All Alerts] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 🔴 CRITICAL  Hotel Grand - Mumbai    Site offline for 15 minutes  │ │
│  │              Dec 10, 14:30            [Acknowledge] [View Site]   │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ 🟡 WARNING   CoWork Hub - Delhi      Bandwidth at 92% capacity    │ │
│  │              Dec 10, 14:25            [Acknowledge] [View Site]   │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ 🟡 WARNING   Enterprise Park - BLR   3 APs showing degraded       │ │
│  │              Dec 10, 14:20            [Acknowledge] [View Site]   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.5 Sites Needing Attention

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Sites Needing Attention                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Site          │ Customer    │ Status    │ Issue        │ Action │   │
│  ├───────────────┼─────────────┼───────────┼──────────────┼────────┤   │
│  │ Hotel Grand   │ Grand Hotels│ 🔴 Offline│ No response  │ [View] │   │
│  │ CoWork Hub    │ WorkSpaces  │ 🟡 Warning│ High BW      │ [View] │   │
│  │ Sunrise Apt   │ Sunrise Grp │ 🟡 Warning│ License 95%  │ [View] │   │
│  │ Tech Park     │ TechCorp    │ 🔴 Critical│ 5 alerts    │ [View] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.6 Support Tickets Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Support Tickets                                     [View All Tickets] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐  Priority Distribution:                          │
│  │ Open Tickets: 23 │  ┌─────────────────────────────────────────────┐ │
│  │ My Tickets:    5 │  │ 🔴 Critical: 3  │  SLA at risk: 2           │ │
│  │ Unassigned:    8 │  │ 🟠 High:     7  │  Avg response: 2.3 hrs    │ │
│  └──────────────────┘  │ 🟡 Medium:  10  │  Avg resolution: 18 hrs   │ │
│                        │ 🟢 Low:      3  │                           │ │
│                        └─────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.7 Regional Distribution

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Regional Distribution                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Region      │ Sites │ Users   │ Devices │ BW Usage                     │
│  ───────────────────────────────────────────────────────────────────    │
│  North       │  145  │ 12,450  │  28,230 │ ████████████░░ 72%           │
│  South       │  167  │ 15,234  │  34,567 │ █████████████░ 81%           │
│  East        │   89  │  8,234  │  17,456 │ ██████████░░░░ 65%           │
│  West        │   86  │  9,316  │  18,203 │ ███████████░░░ 69%           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.8 Segment Breakdown

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Segment Distribution                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│         ┌──────────────────────────┐                                   │
│         │     Enterprise (35%)     │  ██████████████                   │
│         │     Co-Living (28%)      │  ███████████                      │
│         │     Hotel (18%)          │  ███████                          │
│         │     Co-Working (12%)     │  █████                            │
│         │     PG (5%)              │  ██                               │
│         │     Misc (2%)            │  █                                │
│         └──────────────────────────┘                                   │
│                                                                         │
│  Sites: Enterprise: 170 | Co-Living: 136 | Hotel: 88 | ...             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.9 Recent Platform Activity

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Recent Activity                                          [View Logs]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  14:35  John (Deployment) provisioned new site "Sunrise Apartments"    │
│  14:32  Sarah (Support) resolved ticket #TKT-2345                      │
│  14:28  System generated alert for Hotel Grand - Mumbai                │
│  14:25  Mike (NOC) acknowledged alert for CoWork Hub                   │
│  14:20  Admin updated bandwidth policy "Premium-100"                   │
│  14:15  Sarah (Support) escalated ticket #TKT-2341 to Level 2         │
│  14:10  John (Deployment) updated site config for Tech Park            │
│  14:05  System: Scheduled maintenance completed for Region-North       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 16. Internal Portal - Customer Management

### 16.1 Customer Data Model

#### 16.1.1 Customer Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerId` | String | Auto | System-generated ID |
| `companyName` | String | Yes | Legal company name |
| `displayName` | String | No | Short display name |
| `industry` | Enum | Yes | Industry category |
| `segment` | Enum | Yes | Primary segment |
| `status` | Enum | Yes | active, inactive, suspended |
| `contractStartDate` | Date | Yes | Contract start |
| `contractEndDate` | Date | No | Contract end (if term) |
| `licenseTier` | Enum | Yes | License tier |
| `totalLicenses` | Number | Yes | Total user licenses |
| `accountManager` | String | No | Assigned AM |
| `supportTier` | Enum | Yes | Support level |
| `billingContact` | Object | Yes | Billing contact info |
| `technicalContact` | Object | Yes | Technical contact info |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `createdBy` | String | Auto | Creator reference |

#### 16.1.2 Contact Object Structure

```javascript
{
  name: String,
  email: String,
  phone: String,
  designation: String,
  isPrimary: Boolean
}
```

### 16.2 Customer List View

#### 16.2.1 View Modes

**Grid View:**
```
┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐
│  🏢 Acme Corporation              [●]  │ │  🏢 TechCorp Industries           [●]  │
│  ───────────────────────────────────── │ │  ───────────────────────────────────── │
│  Industry: Technology                  │ │  Industry: Manufacturing               │
│  Segment: Enterprise                   │ │  Segment: Enterprise                   │
│  ───────────────────────────────────── │ │  ───────────────────────────────────── │
│  📍 12 sites    👥 2,345 users        │ │  📍 8 sites     👥 1,567 users         │
│  📋 License: ████████░░ 78%           │ │  📋 License: ██████░░░░ 62%           │
│  ───────────────────────────────────── │ │  ───────────────────────────────────── │
│  Contact: john@acme.com               │ │  Contact: admin@techcorp.com          │
│  Account Manager: Sarah Johnson        │ │  Account Manager: Mike Chen           │
│  ───────────────────────────────────── │ │  ───────────────────────────────────── │
│  [View Details] [View Sites] [•••]    │ │  [View Details] [View Sites] [•••]    │
└────────────────────────────────────────┘ └────────────────────────────────────────┘
```

**List View:**
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Company      │ Industry   │ Sites │ Users  │ License │ Status │ AM        │ Actions │
├──────────────┼────────────┼───────┼────────┼─────────┼────────┼───────────┼─────────┤
│ Acme Corp    │ Technology │  12   │ 2,345  │ 78%     │ Active │ S. Johnson│ [•••]   │
│ TechCorp Ind │ Manufact.  │   8   │ 1,567  │ 62%     │ Active │ M. Chen   │ [•••]   │
│ Grand Hotels │ Hospitality│  25   │ 5,234  │ 91%     │ Active │ S. Johnson│ [•••]   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 16.3 Customer Actions

| Action | Permission | Description |
|--------|------------|-------------|
| View Details | canAccessInternalPortal | View customer profile |
| View Sites | canAccessInternalPortal | List customer's sites |
| View Analytics | canAccessInternalPortal | Customer analytics |
| Edit Customer | canManageCustomers | Modify customer data |
| Configure | canManageCustomers | Customer settings |
| Add Site | canProvisionSites | Add new site |
| Suspend | canManageCustomers | Suspend customer |
| Delete | canManageAllCustomers | Delete customer |

### 16.4 Customer Detail Page

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Customers                                                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  🏢 Acme Corporation                                               [Active] ●      │
│  Customer since January 2022                                                        │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ [Overview] [Sites (12)] [Users] [Devices] [Reports] [Configuration] [Logs] │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Overview Tab:                                                                      │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│                                                                                     │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ 📍 Sites: 12        │ │ 👥 Users: 2,345     │ │ 💻 Devices: 5,678   │           │
│  │ 12 active           │ │ 2,102 active        │ │ 3,456 online        │           │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘           │
│                                                                                     │
│  Company Information                    Contract Details                            │
│  ─────────────────────────             ─────────────────────                       │
│  Industry:    Technology               Contract Start: Jan 15, 2022                │
│  Segment:     Enterprise               Contract End:   Jan 14, 2025                │
│  Support:     Premium                  License Tier:   Enterprise                  │
│  Account Mgr: Sarah Johnson            Total Licenses: 3,000                       │
│                                                                                     │
│  Contacts                                                                           │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  Technical Contact              Billing Contact                                     │
│  John Smith                     Finance Team                                        │
│  john.smith@acme.com           billing@acme.com                                    │
│  +91 98765 43210               +91 98765 43211                                     │
│                                                                                     │
│  Sites Overview                                                                     │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  [Site cards or mini-table showing customer's sites]                               │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Internal Portal - Site Management

### 17.1 Site Data Model

#### 17.1.1 Site Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | String | Auto | System-generated ID |
| `customerId` | String | Yes | Customer reference |
| `siteName` | String | Yes | Site display name |
| `siteCode` | String | Auto | Short code (e.g., ACM-MUM-01) |
| `segment` | Enum | Yes | Site segment type |
| `status` | Enum | Yes | online, degraded, offline, maintenance |
| `address` | Object | Yes | Full address details |
| `city` | String | Yes | City name |
| `state` | String | Yes | State/Province |
| `region` | Enum | Yes | North, South, East, West |
| `primaryContact` | Object | Yes | Site contact details |
| `maxUsers` | Number | Yes | User capacity |
| `maxDevices` | Number | Yes | Device capacity |
| `bandwidthLimit` | Number | Yes | Bandwidth in Mbps |
| `configTemplate` | String | Yes | Configuration template |
| `radiusServer` | String | No | RADIUS server address |
| `goLiveDate` | Date | No | Deployment date |
| `createdAt` | DateTime | Auto | Creation timestamp |

### 17.2 Site List View

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Site Management                                              [+ Provision Site]    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search...  Customer: [All ▼]  Status: [All ▼]  Region: [All ▼]  Type: [▼]│   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Summary: 487 sites | 479 online | 5 degraded | 2 offline | 1 maintenance          │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Site Name     │ Customer    │ Type      │ Users  │ Status  │ Uptime │Actions│   │
│  ├───────────────┼─────────────┼───────────┼────────┼─────────┼────────┼───────┤   │
│  │ Acme HQ       │ Acme Corp   │ Enterprise│ 456/500│ ● Online│ 99.9%  │ [•••] │   │
│  │ Hotel Grand   │ Grand Hotels│ Hotel     │ 234/300│ ● Online│ 99.8%  │ [•••] │   │
│  │ CoWork Hub    │ WorkSpaces  │ Co-Working│ 189/200│ ◐ Degrad│ 98.5%  │ [•••] │   │
│  │ Sunrise Apt   │ Sunrise Grp │ Co-Living │ 567/600│ ● Online│ 99.9%  │ [•••] │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  [< Prev] [1] [2] [3] ... [20] [Next >]    Showing 1-25 of 487                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 17.3 Site Provisioning Wizard

The site provisioning wizard guides deployment engineers through the complete site setup process.

#### 17.3.1 Wizard Steps Overview

| Step | Name | Fields | Validation |
|------|------|--------|------------|
| 1 | Customer Selection | Existing customer OR new customer form | Customer must exist or be created |
| 2 | Site Information | Name, segment, address, region | All required fields |
| 3 | Contact Details | Primary contact, secondary contact | Valid email/phone |
| 4 | Capacity Planning | Users, devices, bandwidth, license tier | Within customer's available licenses |
| 5 | Network Configuration | Template, RADIUS, captive portal, domain | Valid configurations |
| 6 | Deployment Details | Go-live date, deployment notes | Valid date |
| 7 | Review & Confirm | Summary of all steps | Confirmation checkbox |

#### 17.3.2 Step Navigation

```
Step Indicator:
┌───────────────────────────────────────────────────────────────────────────────┐
│  [1 ✓] ─── [2 ✓] ─── [3 •] ─── [4 ○] ─── [5 ○] ─── [6 ○] ─── [7 ○]           │
│ Customer   Site     Contact   Capacity  Network  Deployment  Review           │
└───────────────────────────────────────────────────────────────────────────────┘

Legend: ✓ Completed  • Current  ○ Pending
```

### 17.4 Site Detail Page

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Sites                                                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  📍 Acme HQ - Mumbai                                             [Online] ●        │
│  Acme Corporation | Enterprise                                                      │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ [Overview] [Users] [Devices] [Network] [Configuration] [Alerts] [Logs]      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Health Status                                                                      │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Uptime: 99.9%   │  Response: 45ms  │  Packet Loss: 0.01%  │  Alerts: 0     │   │
│  │ ████████████░   │  ████████████    │  █████████████████   │  🟢 All clear   │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Metrics                                                                            │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ 👥 Users        │ │ 💻 Devices      │ │ 📊 Bandwidth    │ │ 📶 Access Points│   │
│  │ 456 / 500       │ │ 892 / 1500      │ │ 450 / 1000 Mbps │ │ 24 online       │   │
│  │ 91% capacity    │ │ 59% capacity    │ │ 45% utilized    │ │ 0 offline       │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                                     │
│  Site Information                          Network Configuration                    │
│  ─────────────────────────                 ───────────────────────                  │
│  Address: 123 Business Park,              RADIUS: radius1.spectra.co               │
│           Andheri East                    Captive Portal: portal.acme.com          │
│           Mumbai, MH 400093               Config Template: Enterprise-Standard     │
│  Region:  West                            Go-Live: January 15, 2022                 │
│                                                                                     │
│  Contact: John Smith | john@acme.com | +91 98765 43210                             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 17.5 Site Health Indicators

| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| **Uptime** | ≥ 99.9% | 99.5-99.9% | 99-99.5% | < 99% |
| **Response Time** | < 50ms | 50-100ms | 100-200ms | > 200ms |
| **Packet Loss** | < 0.1% | 0.1-0.5% | 0.5-1% | > 1% |
| **User Capacity** | < 80% | 80-90% | 90-95% | > 95% |
| **Bandwidth** | < 70% | 70-85% | 85-95% | > 95% |

---

## 18. Internal Portal - Audit Logs

### 18.1 Audit Log Scope

Internal audit logs capture all platform-wide administrative actions performed by Spectra staff.

### 18.2 Log Entry Schema

| Field | Type | Description |
|-------|------|-------------|
| `logId` | String | Unique identifier |
| `timestamp` | DateTime | Action timestamp |
| `userType` | Enum | internal, customer, system |
| `userId` | String | User reference |
| `userName` | String | User display name |
| `userRole` | String | User's role at time of action |
| `action` | String | Action identifier |
| `category` | Enum | Log category |
| `resource` | String | Affected resource type |
| `resourceId` | String | Resource identifier |
| `description` | String | Human-readable description |
| `changes` | Object | Before/after values |
| `ipAddress` | String | Source IP |
| `userAgent` | String | Browser/client info |
| `severity` | Enum | info, warning, critical |
| `status` | Enum | success, failed |

### 18.3 Audit Log Categories

| Category | Actions Logged |
|----------|----------------|
| **Configuration** | Policy changes, domain updates, system settings |
| **User Management** | Customer user operations by staff |
| **Customer Management** | Customer CRUD operations |
| **Site Management** | Site provisioning, configuration, status changes |
| **Support** | Ticket operations, escalations |
| **Security** | Login attempts, permission changes |
| **Bulk Operations** | Batch operation executions |
| **System** | Automated actions, scheduled tasks |

### 18.4 Audit Logs Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Audit Logs                                                     [📥 Export]         │
│  Platform-wide activity tracking                                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search...  Category: [All ▼]  User: [All ▼]  Severity: [All ▼]          │   │
│  │               Date: [Last 7 days ▼]  Status: [All ▼]                        │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Timestamp       │ User       │ Role        │ Action         │ Status │ ▼   │   │
│  ├─────────────────┼────────────┼─────────────┼────────────────┼────────┼─────┤   │
│  │ Dec 10, 14:35   │ J. Smith   │ Deployment  │ Site Provision │ ✓ OK   │     │   │
│  │ ▼ Details                                                                   │   │
│  │ ┌─────────────────────────────────────────────────────────────────────────┐│   │
│  │ │ Action: site_provisioned                                                ││   │
│  │ │ Resource: Site / SITE-487                                               ││   │
│  │ │ Description: Provisioned new site "Sunrise Apartments" for Sunrise Group││   │
│  │ │ IP: 192.168.1.100 | Chrome/Windows                                      ││   │
│  │ └─────────────────────────────────────────────────────────────────────────┘│   │
│  ├─────────────────┼────────────┼─────────────┼────────────────┼────────┼─────┤   │
│  │ Dec 10, 14:32   │ S. Wilson  │ Support     │ Ticket Resolved│ ✓ OK   │     │   │
│  ├─────────────────┼────────────┼─────────────┼────────────────┼────────┼─────┤   │
│  │ Dec 10, 14:30   │ System     │ Automated   │ Alert Generated│ ✓ OK   │     │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Internal Portal - System Configuration

### 19.1 Configuration Sections

#### 19.1.1 Bandwidth Policies

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Bandwidth Policies                                             [+ Create Policy]   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Policy Name   │ Segment    │ Down   │ Up    │ FUP    │ Devices │ Status  │   │
│  ├───────────────┼────────────┼────────┼───────┼────────┼─────────┼─────────┤   │
│  │ Basic-25      │ All        │ 25 Mbps│ 10 Mbps│ 50 GB  │ 2      │ Active  │   │
│  │ Standard-50   │ All        │ 50 Mbps│ 25 Mbps│ 100 GB │ 3      │ Active  │   │
│  │ Premium-100   │ Enterprise │100 Mbps│ 50 Mbps│ 500 GB │ 5      │ Active  │   │
│  │ Hotel-Guest   │ Hotel      │ 25 Mbps│ 10 Mbps│ 10 GB  │ 2      │ Active  │   │
│  │ Unlimited     │ Enterprise │ ∞      │ ∞      │ ∞      │ 10     │ Active  │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### 19.1.2 Policy Editor Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Edit Policy: Standard-50                                               [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Basic Information                                                          │
│  ─────────────────                                                          │
│  Policy Name *:        [Standard-50                    ]                    │
│  Description:          [Standard plan for most users   ]                    │
│  Applicable Segments:  [☑ All Segments              ▼]                     │
│                                                                             │
│  Speed Settings                                                             │
│  ─────────────────                                                          │
│  Download Speed *:     [50    ] Mbps                                        │
│  Upload Speed *:       [25    ] Mbps                                        │
│  Burst Enabled:        [☐]                                                 │
│                                                                             │
│  Data Limits                                                                │
│  ─────────────────                                                          │
│  Fair Usage Limit *:   [100   ] GB  ○ Per Month  ○ Per Day                 │
│  Post-FUP Speed:       [10    ] Mbps (or Unlimited ☐)                      │
│                                                                             │
│  Device Limits                                                              │
│  ─────────────────                                                          │
│  Max Devices *:        [3     ] (or Unlimited ☐)                           │
│                                                                             │
│  Status:               ● Active  ○ Inactive                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ Warning: Changes will affect 12,456 users across 87 sites              │
│                                                                             │
│                                              [Cancel]  [Save Changes]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 19.1.3 Domain Configuration

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Domain Configuration                                             [+ Add Domain]    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Domain Name          │ Type         │ SSL Cert   │ Expires    │ Status    │   │
│  ├──────────────────────┼──────────────┼────────────┼────────────┼───────────┤   │
│  │ portal.spectra.co    │ Captive      │ ✓ Valid    │ Mar 2025   │ Active    │   │
│  │ api.spectra.co       │ API          │ ✓ Valid    │ Mar 2025   │ Active    │   │
│  │ admin.spectra.co     │ Admin        │ ✓ Valid    │ Mar 2025   │ Active    │   │
│  │ wifi.acmecorp.com    │ Custom       │ ✓ Valid    │ Jan 2025   │ Active    │   │
│  │ guest.grandhotel.com │ Custom       │ ⚠️ Expiring │ Dec 2024   │ Active    │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 20. Internal Portal - Reports

### 20.1 Report Categories

| Category | Reports | Purpose |
|----------|---------|---------|
| **Platform Analytics** | Growth trends, platform metrics | Executive dashboards |
| **Customer Reports** | Customer health, license usage | Account management |
| **Site Performance** | Uptime, bandwidth, capacity | Operations |
| **Network & Bandwidth** | Traffic analysis, peak usage | Capacity planning |
| **Security & Compliance** | Auth failures, policy violations | Security |
| **Support & Tickets** | SLA compliance, resolution times | Support management |

### 20.2 Platform Analytics Reports

| Report | Description | Visualization |
|--------|-------------|---------------|
| Customer Growth | New customers over time | Line chart |
| Site Growth | New sites over time | Line chart |
| User Growth | Active users over time | Line chart + table |
| Revenue Analytics | License revenue by tier | Bar chart |
| Segment Distribution | Sites/users by segment | Pie chart |
| Regional Performance | Metrics by region | Heat map |

### 20.3 Report Scheduling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Schedule Report: Platform Growth Report                                [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Schedule Settings                                                          │
│  ─────────────────                                                          │
│  Frequency:     ○ Daily  ● Weekly  ○ Monthly                               │
│  Day:           [Monday                        ▼]                           │
│  Time:          [09:00 AM                      ▼]                           │
│                                                                             │
│  Report Settings                                                            │
│  ─────────────────                                                          │
│  Date Range:    [Last 7 days                   ▼]                           │
│  Format:        ● PDF  ○ CSV  ○ Excel                                      │
│                                                                             │
│  Recipients                                                                 │
│  ─────────────────                                                          │
│  [sarah.johnson@spectra.co                                             ×]  │
│  [mike.chen@spectra.co                                                 ×]  │
│  [+ Add recipient]                                                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                              [Cancel]  [Schedule Report]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 21. Internal Portal - Support Queue

### 21.1 Ticket Data Model

| Field | Type | Description |
|-------|------|-------------|
| `ticketId` | String | Auto-generated (TKT-YYYYMM-NNNN) |
| `customerId` | String | Customer reference |
| `siteId` | String | Site reference (optional) |
| `subject` | String | Ticket subject |
| `description` | String | Initial description |
| `priority` | Enum | critical, high, medium, low |
| `status` | Enum | open, in_progress, pending, resolved, closed |
| `category` | Enum | connectivity, performance, access, billing, other |
| `assignedTo` | String | Assigned staff member |
| `assignedTeam` | String | Assigned team |
| `slaDeadline` | DateTime | SLA target time |
| `createdAt` | DateTime | Creation timestamp |
| `createdBy` | String | Creator (customer or staff) |
| `resolvedAt` | DateTime | Resolution timestamp |
| `resolution` | String | Resolution notes |

### 21.2 Support Queue Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Support Queue                                                    [+ Create Ticket] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │ [Open (23)] [In Progress (12)] [Pending (5)] [My Tickets (5)] [All (156)]    │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search...  Priority: [All ▼]  Category: [All ▼]  Assigned: [All ▼]       │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 🔴 TKT-202412-0045                                         SLA: 2h remaining│   │
│  │ Site offline - Hotel Grand Mumbai                                           │   │
│  │ Grand Hotels | Dec 10, 14:30 | Assigned: John Smith                         │   │
│  │ Priority: Critical | Category: Connectivity                                 │   │
│  ├─────────────────────────────────────────────────────────────────────────────┤   │
│  │ 🟠 TKT-202412-0044                                        SLA: 6h remaining │   │
│  │ Slow internet speeds reported                                               │   │
│  │ Acme Corporation | Dec 10, 13:45 | Assigned: Sarah Wilson                   │   │
│  │ Priority: High | Category: Performance                                      │   │
│  ├─────────────────────────────────────────────────────────────────────────────┤   │
│  │ 🟡 TKT-202412-0043                                       SLA: 24h remaining │   │
│  │ Request for additional user licenses                                        │   │
│  │ TechCorp | Dec 10, 11:30 | Unassigned                                       │   │
│  │ Priority: Medium | Category: Billing                                        │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 21.3 Ticket Detail View

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Queue                                                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  TKT-202412-0045                                                  [🔴 Critical]    │
│  Site offline - Hotel Grand Mumbai                                                  │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  Customer: Grand Hotels    Site: Hotel Grand - Mumbai    Created: Dec 10, 14:30    │
│  Assigned: John Smith      Team: NOC                     SLA: 2 hours remaining    │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Status: [In Progress ▼]  Priority: [Critical ▼]  Assign: [John Smith ▼]    │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Description                                                                        │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  The entire site has been offline since 14:15. Guests are unable to connect to    │
│  Wi-Fi. Front desk reports approximately 200 guests affected.                      │
│                                                                                     │
│  Conversation                                                                       │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ 14:35 | John Smith (NOC)                                                    │   │
│  │ Investigating the issue. Running diagnostics on site equipment.             │   │
│  ├─────────────────────────────────────────────────────────────────────────────┤   │
│  │ 14:30 | System                                                              │   │
│  │ Ticket created and assigned to NOC team based on critical priority.         │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  Add Response                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                             │   │
│  │                                                                             │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│  [📎 Attach]  [🔒 Internal Note]                            [Send Response]        │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  [Escalate]  [Add to KB]  [Merge]                     [Resolve]  [Close Ticket]    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 21.4 SLA Configuration

| Priority | Response Time | Resolution Time |
|----------|---------------|-----------------|
| Critical | 30 minutes | 4 hours |
| High | 2 hours | 8 hours |
| Medium | 4 hours | 24 hours |
| Low | 8 hours | 48 hours |

---

## 22. Internal Portal - Knowledge Center

### 22.1 Internal Knowledge Base Structure

```
Internal Knowledge Center
├── Site Configuration
│   ├── Site Provisioning Guide
│   ├── Network Configuration Templates
│   ├── RADIUS Setup Procedures
│   └── Captive Portal Customization
│
├── Operations
│   ├── Daily Monitoring Checklist
│   ├── Alert Response Procedures
│   ├── Maintenance Window Protocols
│   └── Escalation Matrix
│
├── Troubleshooting
│   ├── Common Connectivity Issues
│   ├── AP Troubleshooting Guide
│   ├── Authentication Failures
│   └── Bandwidth Issues
│
├── Configuration
│   ├── Policy Configuration Guide
│   ├── Domain Setup Procedures
│   ├── SSL Certificate Management
│   └── Bulk Operations Guide
│
├── Training Videos
│   ├── Site Provisioning Walkthrough
│   ├── Support Ticket Handling
│   ├── Configuration Best Practices
│   └── Customer Communication
│
└── FAQs
    ├── Common Support Questions
    ├── Technical FAQs
    └── Process FAQs
```

---

## 23. Internal Portal - Bulk Operations

### 23.1 Available Operations

| Category | Operation | Description |
|----------|-----------|-------------|
| **User Operations** | Bulk Registration | Import users via CSV |
| | Bulk Activation | Activate multiple users |
| | Bulk Suspension | Suspend multiple users |
| | Bulk Blocking | Block multiple users |
| | Bulk Policy Change | Update user policies |
| | Bulk Password Reset | Reset multiple passwords |
| **Device Operations** | Bulk Registration | Import devices via CSV |
| | Bulk Rename | Rename devices by pattern |
| | Bulk Delete | Remove multiple devices |
| **Site Operations** | Bulk Config Update | Update site configurations |

### 23.2 Bulk Operations Interface

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Bulk Operations                                                                    │
│  Execute batch operations across the platform                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  Select Operation Category                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │ [User Operations] [Device Operations] [Site Operations] [Scheduled Tasks]     │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  User Operations                                                                    │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│                                                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ 📥 Bulk Registration │ │ ▶️ Bulk Activation   │ │ ⏸️ Bulk Suspension   │        │
│  │ Import users from    │ │ Activate multiple    │ │ Suspend multiple     │        │
│  │ CSV file             │ │ suspended users      │ │ active users         │        │
│  │ [Start]              │ │ [Start]              │ │ [Start]              │        │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘        │
│                                                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ 🚫 Bulk Blocking     │ │ 📋 Bulk Policy Change│ │ 🔑 Bulk Password     │        │
│  │ Block multiple       │ │ Update policies for  │ │ Reset passwords for  │        │
│  │ users permanently    │ │ multiple users       │ │ multiple users       │        │
│  │ [Start]              │ │ [Start]              │ │ [Start]              │        │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘        │
│                                                                                     │
│  Recent Operations                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │ Operation        │ Target    │ Records │ Status    │ By       │ Date       │   │
│  ├──────────────────┼───────────┼─────────┼───────────┼──────────┼────────────┤   │
│  │ Bulk Registration│ Acme Corp │ 150     │ ✓ Complete│ J. Smith │ Dec 10     │   │
│  │ Bulk Suspension  │ Hotel Grp │ 45      │ ✓ Complete│ S. Wilson│ Dec 9      │   │
│  │ Bulk Policy      │ TechCorp  │ 234     │ ⟳ Running │ M. Chen  │ Dec 9      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 24. Access Levels, User Roles and Permissions

### 24.1 Customer Portal Access Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ACCESS LEVEL HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            ┌─────────────┐                                  │
│                            │   Company   │                                  │
│                            │   (View All)│                                  │
│                            └──────┬──────┘                                  │
│                                   │                                         │
│                    ┌──────────────┼──────────────┐                         │
│                    │              │              │                          │
│              ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐                     │
│              │   City    │ │   City    │ │   City    │                     │
│              │  Mumbai   │ │   Delhi   │ │ Bangalore │                     │
│              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                     │
│                    │             │             │                            │
│           ┌────────┼────────┐    │      ┌──────┼──────┐                    │
│           │        │        │    │      │      │      │                    │
│      ┌────┴───┐┌───┴───┐┌───┴───┐│  ┌───┴──┐┌──┴──┐┌──┴───┐               │
│      │Cluster ││Cluster││ Site  ││  │ Site ││Site ││Cluster│               │
│      │  A     ││  B    ││   C   ││  │  D   ││  E  ││  F    │               │
│      └────┬───┘└───┬───┘└───────┘│  └──────┘└─────┘└───┬───┘               │
│           │        │             │                     │                    │
│      ┌────┼────┐   │             │               ┌─────┼─────┐             │
│      │    │    │   │             │               │     │     │             │
│    Site  Site Site Site        Site           Site  Site  Site             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 24.2 Access Level Definitions

| Level | Scope | View Access | Edit Access |
|-------|-------|-------------|-------------|
| **Site** | Single site | Site data only | Full edit within site |
| **Cluster** | Multiple related sites | All cluster sites | Full edit in any cluster site |
| **City** | All sites in a city | All city sites | Full edit in any city site |
| **Company** | All company sites | All sites (read-only default) | Must drill down to site for edit |

### 24.3 Customer Portal Permissions Matrix

| Permission | Description | Super Admin | Site Admin | Viewer |
|------------|-------------|:-----------:|:----------:|:------:|
| `canViewDashboard` | View dashboard | ✓ | ✓ | ✓ |
| `canViewReports` | Access reports | ✓ | ✓ | ✓ |
| `canExportData` | Export to CSV/PDF | ✓ | ✓ | ✓ |
| `canEditUsers` | Create/edit/delete users | ✓ | ✓ | ✗ |
| `canManageDevices` | Create/edit/delete devices | ✓ | ✓ | ✗ |
| `canViewLogs` | View activity logs | ✓ | ✓ | ✗ |
| `canBulkImport` | Bulk import users/devices | ✓ | ✗ | ✗ |
| `canManageAdmins` | Create/edit other admins | ✓ | ✗ | ✗ |

### 24.4 Internal Portal Permissions Matrix

| Permission | Super Admin | Deployment | Support | NOC | Account Mgr |
|------------|:-----------:|:----------:|:-------:|:---:|:-----------:|
| `canAccessInternalPortal` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `canViewCustomers` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `canManageCustomers` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `canManageAllCustomers` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `canViewSites` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `canProvisionSites` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `canManageTickets` | ✓ | ✗ | ✓ | ✓ | ✗ |
| `canAccessSystemConfig` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `canManagePolicies` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `canManageDomains` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `canAccessBulkOperations` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `canViewAuditLogs` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `canViewReports` | ✓ | ✓ | ✓ | ✓ | ✓ |

### 24.5 Segment-Based Capabilities

| Capability | Enterprise | Co-Living | Co-Working | Hotel | PG | Misc |
|------------|:----------:|:---------:|:----------:|:-----:|:--:|:----:|
| `allowUserDevices` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `allowDigitalDevices` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| `allowSmartDevices` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `allowDeviceEdit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `allowDeviceDelete` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| `allowBulkImport` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `requireCheckInOut` | ✗ | Partial | Partial | ✓ | ✗ | ✗ |

---

## 25. Alerts & Notifications

### 25.1 Toast Notification System

#### 25.1.1 Toast Types

| Type | Icon | Color | Duration | Sound | Use Cases |
|------|------|-------|----------|-------|-----------|
| **Success** | ✓ | Green | 3s | None | Action completed, save successful |
| **Error** | ✗ | Red | 5s | Optional | Action failed, validation error |
| **Warning** | ⚠ | Amber | 4s | None | Attention needed, potential issue |
| **Info** | ℹ | Blue | 3s | None | General information, tips |

#### 25.1.2 Toast Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ✓  User registered successfully                         [×] │
│    John Doe has been added to the system                    │
│                                              [View User]    │
└─────────────────────────────────────────────────────────────┘
```

| Element | Description |
|---------|-------------|
| **Icon** | Status indicator (✓, ✗, ⚠, ℹ) |
| **Title** | Primary message (required) |
| **Description** | Additional details (optional) |
| **Close Button** | Manual dismiss |
| **Action Button** | Optional action link |

#### 25.1.3 Toast Behavior

| Behavior | Specification |
|----------|---------------|
| **Position** | Top-right (desktop), Top-center (mobile) |
| **Animation** | Slide in from right |
| **Stacking** | Max 3 visible, queue others |
| **Auto-dismiss** | Based on type duration |
| **Hover** | Pause auto-dismiss on hover |
| **Swipe** | Swipe right to dismiss (mobile) |

### 25.2 In-App Notifications

#### 25.2.1 Notification Types (Customer Portal)

| Category | Notifications |
|----------|---------------|
| **User** | User registered, status changed, license warning |
| **Device** | Device registered, blocked, disconnected |
| **System** | Maintenance scheduled, policy updated |
| **Alert** | High bandwidth usage, license threshold |

#### 25.2.2 Notification Types (Internal Portal)

| Category | Notifications |
|----------|---------------|
| **Alert** | Site offline, degraded, critical threshold |
| **Ticket** | New ticket, assigned, escalated, SLA warning |
| **System** | Deployment complete, config change, maintenance |
| **Customer** | New customer, license expiring, contract renewal |

#### 25.2.3 Notification Center

```
┌─────────────────────────────────────────────────────────────┐
│  Notifications                              [Mark All Read] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Today                                                      │
│  ───────────────────────────────────────────────────────── │
│  ● 🔴 Site Alert - Hotel Grand offline        2 min ago    │
│     Site has been offline for 15 minutes                   │
│  ───────────────────────────────────────────────────────── │
│  ● 🎫 New ticket assigned to you              15 min ago   │
│     TKT-2345: Slow internet speeds reported                │
│  ───────────────────────────────────────────────────────── │
│  ○ ✅ Site provisioning complete              1 hour ago   │
│     Sunrise Apartments is now live                         │
│                                                             │
│  Yesterday                                                  │
│  ───────────────────────────────────────────────────────── │
│  ○ 📋 License renewal reminder               Yesterday     │
│     Acme Corp license expires in 30 days                   │
│                                                             │
│  [View All Notifications]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Legend: ● Unread  ○ Read
```

### 25.3 System Alerts (Internal)

| Severity | Color | Sound | Examples |
|----------|-------|-------|----------|
| **Critical** | Red | Yes | Site offline, multiple AP failures |
| **Warning** | Amber | Optional | High bandwidth, license threshold |
| **Info** | Blue | No | Maintenance completed, config updated |

---

## 26. Security Requirements

### 26.1 Authentication Security

| Requirement | Specification |
|-------------|---------------|
| **Password Policy** | Min 8 chars, 1 upper, 1 lower, 1 number, 1 special |
| **Password Expiry** | 90 days (configurable) |
| **Account Lockout** | 5 failed attempts, 30-minute lockout |
| **Session Timeout** | 30 minutes inactivity (customer), 8 hours (internal) |
| **Token Expiry** | Access token: 15 min, Refresh token: 7 days |
| **2FA Support** | TOTP (Google Authenticator compatible) |

### 26.2 Authorization Security

| Requirement | Implementation |
|-------------|----------------|
| **RBAC** | Role-based access control with permission matrix |
| **Route Protection** | Server-side and client-side route guards |
| **API Authorization** | JWT validation on all API requests |
| **Resource Ownership** | Users can only access their assigned resources |
| **Audit Trail** | All permission changes logged |

### 26.3 Data Security

| Requirement | Implementation |
|-------------|----------------|
| **Encryption in Transit** | TLS 1.3 for all communications |
| **Encryption at Rest** | AES-256 for sensitive data |
| **Input Sanitization** | All user inputs sanitized server-side |
| **XSS Prevention** | Content Security Policy, output encoding |
| **CSRF Protection** | CSRF tokens on all state-changing requests |
| **SQL Injection** | Parameterized queries, ORM usage |

### 26.4 Session Security

| Requirement | Implementation |
|-------------|----------------|
| **Secure Cookies** | HttpOnly, Secure, SameSite=Strict |
| **Session Binding** | Bind to IP and user agent |
| **Concurrent Sessions** | Configurable limit per user |
| **Session Termination** | Logout invalidates all tokens |
| **Idle Detection** | Warning at 5 min before timeout |

---

## 27. Data Validation Standards

### 27.1 Field Validation Rules

| Field Type | Validation Rules | Error Message |
|------------|------------------|---------------|
| **Email** | RFC 5322 format, max 254 chars | "Please enter a valid email address" |
| **Phone** | 10 digits (India), E.164 format | "Please enter a valid 10-digit phone number" |
| **MAC Address** | XX:XX:XX:XX:XX:XX format | "Please enter a valid MAC address" |
| **User ID** | Alphanumeric + hyphen/underscore, 3-50 chars | "User ID must be 3-50 alphanumeric characters" |
| **Name** | Letters, spaces, hyphens, 1-100 chars | "Name can only contain letters, spaces, and hyphens" |
| **Password** | Min 8 chars, complexity requirements | "Password must be at least 8 characters with upper, lower, number, and special character" |
| **URL** | Valid URL format, HTTPS preferred | "Please enter a valid URL" |
| **Date** | Valid date, logical range | "Please enter a valid date" |
| **Number** | Numeric, within specified range | "Please enter a number between {min} and {max}" |

### 27.2 Validation Timing

| Validation Type | Trigger | Feedback |
|-----------------|---------|----------|
| **Required Field** | On blur | Immediate error display |
| **Format** | On blur | Immediate error display |
| **Length** | On input | Character counter |
| **Async (Uniqueness)** | On blur (debounced 500ms) | Loading indicator, then result |
| **Cross-field** | On submit | All related errors shown |
| **Form-level** | On submit | Scroll to first error |

### 27.3 Server-Side Validation

All client-side validations shall be duplicated server-side with consistent error responses:

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Please enter a valid email address"
    },
    {
      "field": "userId",
      "code": "DUPLICATE",
      "message": "This User ID is already in use"
    }
  ]
}
```

---

## 28. Error Handling Guidelines

### 28.1 Error Categories

| Category | HTTP Codes | User Message | Technical Action |
|----------|------------|--------------|------------------|
| **Validation** | 400 | Field-specific messages | Highlight fields |
| **Authentication** | 401 | "Please sign in to continue" | Redirect to login |
| **Authorization** | 403 | "You don't have permission" | Show limited view |
| **Not Found** | 404 | "Resource not found" | Show 404 page |
| **Conflict** | 409 | Specific conflict message | Enable resolution |
| **Rate Limit** | 429 | "Too many requests" | Show countdown |
| **Server Error** | 500 | "Something went wrong" | Log error, retry option |
| **Network** | N/A | "Connection lost" | Retry with backoff |

### 28.2 Error Display Patterns

#### 28.2.1 Inline Field Error
```
Email *
┌─────────────────────────────────────┐
│ invalid-email                       │  ← Red border
└─────────────────────────────────────┘
⚠️ Please enter a valid email address   ← Red text below
```

#### 28.2.2 Form-Level Error
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Please fix the following errors:                         │
│   • Email address is required                               │
│   • Phone number format is invalid                          │
└─────────────────────────────────────────────────────────────┘
```

#### 28.2.3 Page-Level Error
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      ⚠️                                     │
│                                                             │
│           Something went wrong                              │
│                                                             │
│   We couldn't load this page. Please try again.            │
│                                                             │
│              [Retry]  [Go to Dashboard]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 28.3 Error Recovery

| Scenario | Recovery Action |
|----------|-----------------|
| Network failure | Automatic retry with exponential backoff |
| Session expired | Redirect to login, preserve intended destination |
| Validation error | Clear error on field correction |
| Server error | Retry button, contact support link |
| Rate limited | Display countdown, enable action after cooldown |

---

## 29. Internationalization (i18n)

### 29.1 Supported Languages

| Language | Code | Status | Coverage |
|----------|------|--------|----------|
| English | en | Primary | 100% |
| Hindi | hi | Supported | 100% |
| Kannada | kn | Supported | 100% |
| Telugu | te | Supported | 100% |

### 29.2 Translation Structure

```
locales/
├── en/
│   └── translation.json
├── hi/
│   └── translation.json
├── kn/
│   └── translation.json
└── te/
    └── translation.json
```

### 29.3 Translation Key Conventions

| Category | Prefix | Example |
|----------|--------|---------|
| **Common** | common. | common.save, common.cancel |
| **Navigation** | nav. | nav.dashboard, nav.users |
| **Forms** | form. | form.email, form.required |
| **Errors** | error. | error.invalidEmail |
| **Success** | success. | success.userCreated |
| **Validation** | validation. | validation.minLength |
| **Page Titles** | page. | page.userManagement |

### 29.4 Date and Number Formatting

| Locale | Date Format | Number Format | Currency |
|--------|-------------|---------------|----------|
| en-IN | DD MMM YYYY | 1,23,456.78 | ₹ |
| hi-IN | DD MMM YYYY | 1,23,456.78 | ₹ |
| kn-IN | DD MMM YYYY | 1,23,456.78 | ₹ |
| te-IN | DD MMM YYYY | 1,23,456.78 | ₹ |

### 29.5 RTL Support

Currently not required. Future consideration for Arabic/Urdu support.

---

## 30. API Integration Requirements

### 30.1 API Standards

| Standard | Specification |
|----------|---------------|
| **Protocol** | REST over HTTPS |
| **Data Format** | JSON |
| **Authentication** | Bearer token (JWT) |
| **Versioning** | URL path (/api/v1/) |
| **Rate Limiting** | 100 requests/minute per user |
| **Pagination** | Cursor-based or offset-based |

### 30.2 Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>
X-Client-Version: 2.1.0
```

### 30.3 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalPages": 5,
      "totalItems": 48
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 30.4 Customer Portal API Endpoints

```
Authentication:
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

Users:
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
PATCH  /api/v1/users/:id/status
POST   /api/v1/users/bulk-import
GET    /api/v1/users/export

Devices:
GET    /api/v1/devices
GET    /api/v1/devices/:id
POST   /api/v1/devices
PUT    /api/v1/devices/:id
DELETE /api/v1/devices/:id
POST   /api/v1/devices/:id/disconnect
POST   /api/v1/devices/bulk-import
GET    /api/v1/devices/validate-mac/:mac

Policies:
GET    /api/v1/policies
GET    /api/v1/policies/:id

Reports:
GET    /api/v1/reports
POST   /api/v1/reports/:id/execute
GET    /api/v1/reports/:id/export

Dashboard:
GET    /api/v1/dashboard/metrics
GET    /api/v1/dashboard/charts
GET    /api/v1/dashboard/activity

Licenses:
GET    /api/v1/licenses/current
GET    /api/v1/licenses/usage

Activity Logs:
GET    /api/v1/logs
GET    /api/v1/logs/export
```

### 30.5 Internal Portal API Endpoints

```
Customers:
GET    /api/v1/internal/customers
GET    /api/v1/internal/customers/:id
POST   /api/v1/internal/customers
PUT    /api/v1/internal/customers/:id
DELETE /api/v1/internal/customers/:id

Sites:
GET    /api/v1/internal/sites
GET    /api/v1/internal/sites/:id
POST   /api/v1/internal/sites
PUT    /api/v1/internal/sites/:id
DELETE /api/v1/internal/sites/:id
GET    /api/v1/internal/sites/:id/health
GET    /api/v1/internal/sites/:id/alerts

Tickets:
GET    /api/v1/internal/tickets
GET    /api/v1/internal/tickets/:id
POST   /api/v1/internal/tickets
PATCH  /api/v1/internal/tickets/:id/status
POST   /api/v1/internal/tickets/:id/reply
PATCH  /api/v1/internal/tickets/:id/assign

Configuration:
GET    /api/v1/internal/policies
POST   /api/v1/internal/policies
PUT    /api/v1/internal/policies/:id
DELETE /api/v1/internal/policies/:id
GET    /api/v1/internal/domains
POST   /api/v1/internal/domains
PUT    /api/v1/internal/domains/:id

Bulk Operations:
POST   /api/v1/internal/bulk/users/:operation
POST   /api/v1/internal/bulk/devices/:operation
GET    /api/v1/internal/bulk/tasks
GET    /api/v1/internal/bulk/tasks/:id
DELETE /api/v1/internal/bulk/tasks/:id

Audit Logs:
GET    /api/v1/internal/audit-logs
GET    /api/v1/internal/audit-logs/export
```

---

## 31. Testing Requirements

### 31.1 Testing Strategy

| Test Type | Coverage Target | Tools |
|-----------|-----------------|-------|
| **Unit Tests** | 80% code coverage | Jest, React Testing Library |
| **Integration Tests** | Critical user flows | Cypress |
| **E2E Tests** | Happy path scenarios | Cypress |
| **Visual Regression** | UI components | Chromatic/Percy |
| **Performance** | Core Web Vitals | Lighthouse |
| **Accessibility** | WCAG 2.1 AA | axe-core |

### 31.2 Test Scenarios

#### 31.2.1 Authentication Tests
- [ ] Successful login with valid credentials
- [ ] Failed login with invalid credentials
- [ ] Account lockout after failed attempts
- [ ] Password reset flow
- [ ] Session timeout handling
- [ ] 2FA verification (if enabled)

#### 31.2.2 User Management Tests
- [ ] Create user with all required fields
- [ ] Create user with segment-specific fields
- [ ] Edit user details
- [ ] Change user status (activate, suspend, block)
- [ ] Bulk import users
- [ ] Search and filter users
- [ ] Export user list

#### 31.2.3 Device Management Tests
- [ ] Register user device
- [ ] Register smart/digital device
- [ ] MAC address validation
- [ ] Duplicate MAC detection
- [ ] Device status changes
- [ ] Bulk device operations

### 31.3 Browser Testing Matrix

| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest 2 | High |
| Firefox | Latest 2 | High |
| Safari | Latest 2 | High |
| Edge | Latest 2 | High |
| Mobile Chrome | Latest | Medium |
| Mobile Safari | Latest | Medium |

---

## 32. Future Considerations

### 32.1 Planned Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| **Real-time Updates** | WebSocket for live dashboard updates | High |
| **Mobile Apps** | Native iOS/Android applications | High |
| **Advanced Analytics** | ML-based insights and predictions | Medium |
| **SSO Integration** | SAML/OIDC enterprise SSO | Medium |
| **Workflow Automation** | Rules-based automation engine | Medium |
| **API Marketplace** | Third-party integrations | Low |

### 32.2 Scalability Considerations

| Area | Current | Future |
|------|---------|--------|
| **Users** | 100,000 | 1,000,000 |
| **Sites** | 1,000 | 10,000 |
| **Concurrent Users** | 10,000 | 100,000 |
| **Data Retention** | 90 days | 365 days |

---

## 33. Glossary

| Term | Definition |
|------|------------|
| **AP** | Access Point - Wi-Fi radio device |
| **CRUD** | Create, Read, Update, Delete operations |
| **FUP** | Fair Usage Policy - data limit before speed reduction |
| **JWT** | JSON Web Token - authentication token format |
| **KPI** | Key Performance Indicator |
| **OUI** | Organizationally Unique Identifier - MAC vendor prefix |
| **RADIUS** | Remote Authentication Dial-In User Service |
| **RBAC** | Role-Based Access Control |
| **SLA** | Service Level Agreement |
| **SSO** | Single Sign-On |
| **WCAG** | Web Content Accessibility Guidelines |

---

## 34. Appendices

### Appendix A: Sample API Responses

### Appendix B: Database Schema Reference

### Appendix C: Configuration Templates

### Appendix D: Error Code Reference

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | November 2024 | Spectra Team | Initial FRD |
| 2.0 | December 2024 | Spectra Team | Comprehensive expansion with detailed specifications |

---

*This Functional Requirements Document defines the complete requirements for the SpectraOne Customer Portal and Internal Spectra User Portal. All development, testing, and deployment activities shall adhere to the specifications defined herein.*

**Document Classification:** Internal Use Only
**Review Cycle:** Quarterly
**Next Review Date:** March 2025