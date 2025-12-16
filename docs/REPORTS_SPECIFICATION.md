# Spectra WiFi Portal - Reports Specification

## 1. Overview

This document details all implemented reports in the Spectra WiFi Portal. Reports are organized by category and provide detailed specifications including data points, filters, visualizations, and access levels.

---

## 2. Report Details

### 2.1. Billing Reports

#### 2.1.1. Monthly Active Users (Site)
- **ID:** `site-monthly-active-users`
- **Description:** Shows the average number of active users on the Wi-Fi network for all user policies for each month within a specified date range. Valuable for billing reconciliation for clients with per user billing model.
- **Data:** Date (month & year), count of average active users, count of new users, count of churned users (optional), change from previous month (optional), count of user activation and count of user deactivation
- **Visualization:** Column chart and table showing monthly average active users over time.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date
- **Default:**
  - Default date range/time period should be 'Last 12 calendar months'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months (to allow for year-over-year comparisons)
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level
- **Linked Reports:**
  - Daily Average Active Users Report (Site): Drill down

---

#### 2.1.2. Daily Average Active Users (Site)
- **ID:** `daily-average-active-users`
- **Description:** Daily breakdown of average active users for detailed billing analysis. Shows the average number of active users per day for granular billing reconciliation.
- **Data:** Date, average active users per day
- **Visualization:** Line chart and table showing daily average active users over time.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level
- **Linked Reports:**
  - Monthly Active Users Report (Site): Roll up

---

#### 2.1.3. Policy-wise Monthly Average Active Users
- **ID:** `policy-wise-monthly-average-active-users`
- **Description:** Monthly active users segmented by policy type. Helps understand user distribution across different service tiers for billing and capacity planning.
- **Data:** Month, policy name, average active users per policy
- **Visualization:** Stacked column chart and table showing monthly active users by policy.
- **Filters:**
  - Date range (From Month/Year & To Month/Year selection)
  - Policy filter (Multi-select dropdown)
- **Search Parameter:** Month, Policy
- **Sort Parameter:** Month, Policy Name
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Month
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** User Level only (requires multiple policies)

---

#### 2.1.4. Average Active Users Summary (Company)
- **ID:** `company-average-active-users`
- **Description:** Company-wide active user overview for enterprise billing. Provides executive-level summary of user metrics across all sites.
- **Data:** Company name, total active users, year-over-year comparison
- **Visualization:** Line chart and table showing company-wide user trends.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** N/A
- **Sort Parameter:** Date
- **Default:**
  - Default date range should be 'Last 12 months'
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.2. Usage Reports

#### 2.2.1. Monthly Data Usage Summary (Site)
- **ID:** `monthly-data-usage-summary`
- **Description:** Total, peak, and average data usage per month at site level. Helps in capacity planning and bandwidth allocation.
- **Data:** Month, total usage (GB), peak usage (GB), average usage (GB)
- **Visualization:** Combo chart (bar + line) and table showing monthly data usage trends.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Month
- **Sort Parameter:** Month, Total Usage
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Month
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.2.2. Monthly Data Usage Summary (Company)
- **ID:** `company-monthly-data-usage`
- **Description:** Company-wide data usage trends and patterns. Executive-level bandwidth consumption overview.
- **Data:** Month, company name, total usage (TB), year-over-year comparison
- **Visualization:** Line chart and table showing company-wide usage trends.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** N/A
- **Sort Parameter:** Month
- **Default:**
  - Default date range should be 'Last 12 months'
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.3. Wi-Fi Network Reports

#### 2.3.1. Network Usage (GB)
- **ID:** `network-usage-report`
- **Description:** Daily network usage tracking for capacity planning. Shows daily bandwidth consumption patterns.
- **Data:** Day, usage (GB)
- **Visualization:** Line chart and table showing daily network usage.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date, Usage
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.2. Access Point List
- **ID:** `access-point-list`
- **Description:** Complete inventory of all access points with status. Infrastructure inventory and monitoring.
- **Data:** AP name, MAC address, location, status (online/offline), connected users count
- **Visualization:** Table only (no chart).
- **Filters:** None (real-time snapshot)
- **Search Parameter:** AP Name, MAC Address, Location
- **Sort Parameter:** AP Name, Status, Connected Users
- **Default:**
  - Default sort parameter should be AP Name
- **Maximum Data per Query:** All APs
- **Maximum Data Available:** Current state
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.3. Access Point MAC List
- **ID:** `access-point-mac-list`
- **Description:** MAC addresses of all registered access points. For network configuration and troubleshooting.
- **Data:** MAC address, AP name, vendor
- **Visualization:** Table only (no chart).
- **Filters:** None
- **Search Parameter:** MAC Address, AP Name, Vendor
- **Sort Parameter:** AP Name, MAC Address
- **Default:**
  - Default sort parameter should be AP Name
- **Maximum Data per Query:** All APs
- **Maximum Data Available:** Current state
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.4. Client List
- **ID:** `client-list`
- **Description:** All currently connected clients with connection details. Real-time view of active connections.
- **Data:** Client MAC, user name, AP name, signal strength, connected time
- **Visualization:** Table only (no chart).
- **Filters:** None (real-time snapshot)
- **Search Parameter:** Client MAC, User Name, AP Name
- **Sort Parameter:** User Name, AP Name, Signal Strength
- **Default:**
  - Default sort parameter should be User Name
- **Maximum Data per Query:** All connected clients
- **Maximum Data Available:** Current state
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.5. User Access Point Analytics
- **ID:** `user-ap-analytics`
- **Description:** User distribution and roaming patterns across access points. Helps identify hotspots and optimize AP placement.
- **Data:** AP name, unique users, total sessions, average session time
- **Visualization:** Bar chart and table showing AP utilization.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** AP Name
- **Sort Parameter:** Unique Users, Total Sessions, AP Name
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Unique Users (descending)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.6. Rogue AP List
- **ID:** `rogue-ap-list`
- **Description:** Detected rogue access points for security monitoring. Identifies unauthorized wireless networks.
- **Data:** MAC address, SSID, detected time, signal strength, threat level
- **Visualization:** Table only (no chart).
- **Filters:** None (real-time snapshot)
- **Search Parameter:** MAC Address, SSID
- **Sort Parameter:** Detected Time, Threat Level
- **Default:**
  - Default sort parameter should be Detected Time (most recent first)
- **Maximum Data per Query:** All detected rogue APs
- **Maximum Data Available:** Current state
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.7. Alarm List
- **ID:** `alarm-list`
- **Description:** System alarms and critical network events. For monitoring and incident response.
- **Data:** Timestamp, severity, message, affected device, status (open/resolved)
- **Visualization:** Table only (no chart).
- **Filters:**
  - Date range (From Date & To Date selection)
  - Severity filter (Critical, Warning, Info, All)
- **Search Parameter:** Message, Affected Device
- **Sort Parameter:** Timestamp, Severity
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default severity should be 'All'
  - Default sort parameter should be Timestamp (most recent first)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.3.8. Event List
- **ID:** `event-list`
- **Description:** Comprehensive log of all network events. Audit trail for network activities.
- **Data:** Timestamp, event type, user, device, details
- **Visualization:** Table only (no chart).
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Event Type, User, Device
- **Sort Parameter:** Timestamp, Event Type
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Timestamp (most recent first)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.4. End-User Reports

#### 2.4.1. Users by Speed Tier
- **ID:** `speed-tier-report`
- **Description:** User distribution across speed tiers for capacity planning. Shows how users are distributed across different bandwidth policies.
- **Data:** Speed tier name, user count
- **Visualization:** Pie/Donut chart and table showing speed tier distribution.
- **Filters:** None (current snapshot)
- **Search Parameter:** Speed Tier
- **Sort Parameter:** User Count, Speed Tier
- **Default:**
  - Default sort parameter should be User Count (descending)
- **Maximum Data per Query:** All tiers
- **Maximum Data Available:** Current state
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** User Level only (requires multiple policies)

---

#### 2.4.2. User Session History
- **ID:** `user-session-history`
- **Description:** Historical session data for individual users. Detailed activity log for troubleshooting and analysis.
- **Data:** User ID, session start, session end, data used, duration
- **Visualization:** Table only (no chart).
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Session Start, Duration, Data Used
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Session Start (most recent first)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.4.3. User Data Consumption
- **ID:** `user-data-consumption`
- **Description:** Individual user data consumption over time. Tracks bandwidth usage patterns per user.
- **Data:** User ID, date, data used (MB), session count
- **Visualization:** Line chart and table showing user consumption trends.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Date, Data Used
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.5. Internet Reports

#### 2.5.1. Bandwidth Utilization
- **ID:** `bandwidth-utilization`
- **Description:** Internet bandwidth usage patterns and peak times. Helps identify bandwidth bottlenecks and plan capacity.
- **Data:** Timestamp, upload (Mbps), download (Mbps), utilization percentage
- **Visualization:** Area chart and table showing bandwidth utilization over time.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Date/Time
- **Sort Parameter:** Timestamp, Utilization
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Timestamp
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** Fixed, User Level
- **Note:** Not applicable for Managed WiFi Infra solution type (internet not managed by Spectra)

---

#### 2.5.2. Internet Uptime Report
- **ID:** `internet-uptime`
- **Description:** Internet connectivity uptime and outage tracking. SLA monitoring and reliability analysis.
- **Data:** Date, uptime percentage, outage count, total downtime (minutes)
- **Visualization:** Line chart and table showing uptime trends.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date, Uptime Percentage
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** Fixed, User Level
- **Note:** Not applicable for Managed WiFi Infra solution type (internet not managed by Spectra)

---

### 2.6. SLA Reports

#### 2.6.1. SLA Compliance Report
- **ID:** `sla-compliance`
- **Description:** Service level agreement compliance metrics. Tracks performance against contractual obligations.
- **Data:** Metric name, target value, actual value, compliance status
- **Visualization:** Gauge charts and table showing SLA compliance.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Metric
- **Sort Parameter:** Compliance Status, Metric
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Compliance Status
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.7. Authentication Reports

#### 2.7.1. Authentication Logs
- **ID:** `authentication-logs`
- **Description:** User authentication attempts and outcomes. Security audit trail for access attempts.
- **Data:** Timestamp, user ID, authentication method, result (success/failure), IP address
- **Visualization:** Table only (no chart).
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID, IP Address
- **Sort Parameter:** Timestamp, Result
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Timestamp (most recent first)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.7.2. Failed Authentication Report
- **ID:** `failed-authentication`
- **Description:** Failed login attempts for security monitoring. Helps identify potential security threats or user issues.
- **Data:** Timestamp, user ID, attempt count, IP address, failure reason
- **Visualization:** Bar chart and table showing failed attempts by user/reason.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID, IP Address, Reason
- **Sort Parameter:** Timestamp, Attempt Count
- **Default:**
  - Default date range should be 'Last 7 days'
  - Default sort parameter should be Timestamp (most recent first)
- **Maximum Data per Query:** 30 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

### 2.8. Upsell Reports

#### 2.8.1. Add-on Usage Report
- **ID:** `addon-usage-report`
- **Description:** User adoption and usage of premium add-ons. Revenue tracking for value-added services.
- **Data:** Add-on name, user count, revenue, purchase date
- **Visualization:** Bar chart and table showing add-on performance.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Add-on Name
- **Sort Parameter:** Revenue, User Count, Add-on Name
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Revenue (descending)
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

#### 2.8.2. Top-up Purchase History (All Types)
- **ID:** `topup-history`
- **Description:** All user top-up purchases and spending patterns across all topup types. Tracks self-service revenue.
- **Data:** User ID, top-up type, top-up type label, top-up amount, purchase date, remaining balance
- **Visualization:** Line chart and table showing top-up trends.
- **Filters:**
  - Date range (From Date & To Date selection)
  - Top-up Type (All Types, Speed Boost, Data Pack, Extra Device, Plan Upgrade)
- **Search Parameter:** User ID, Top-up Type
- **Sort Parameter:** Purchase Date, Amount, Top-up Type
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Purchase Date (most recent first)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

#### 2.8.3. Speed Boost Top-up History
- **ID:** `topup-history-speed`
- **Description:** Speed boost top-up purchases - users who temporarily upgraded their internet speed.
- **Data:** User ID, top-up type, top-up type label, top-up amount, purchase date, remaining balance
- **Visualization:** Line chart and table showing speed boost purchases.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Purchase Date, Amount
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Purchase Date (most recent first)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

#### 2.8.4. Data Pack Top-up History
- **ID:** `topup-history-data`
- **Description:** Data pack top-up purchases - users who purchased additional data.
- **Data:** User ID, top-up type, top-up type label, top-up amount, purchase date, remaining balance
- **Visualization:** Line chart and table showing data pack purchases.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Purchase Date, Amount
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Purchase Date (most recent first)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

#### 2.8.5. Extra Device Top-up History
- **ID:** `topup-history-device`
- **Description:** Extra device top-up purchases - users who added more devices to their account.
- **Data:** User ID, top-up type, top-up type label, top-up amount, purchase date, remaining balance
- **Visualization:** Line chart and table showing extra device purchases.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Purchase Date, Amount
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Purchase Date (most recent first)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

#### 2.8.6. Plan Upgrade Top-up History
- **ID:** `topup-history-plan`
- **Description:** Plan upgrade top-up purchases - users who upgraded to a higher plan.
- **Data:** User ID, top-up type, top-up type label, top-up amount, purchase date, remaining balance
- **Visualization:** Line chart and table showing plan upgrade purchases.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** User ID
- **Sort Parameter:** Purchase Date, Amount
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Purchase Date (most recent first)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi only
- **Bandwidth Types:** User Level only
- **Note:** Not applicable for Managed WiFi Infra solution type (topups disabled)

---

### 2.9. Company-Level Reports

#### 2.9.1. Company Overview Dashboard
- **ID:** `company-overview-dashboard`
- **Description:** Executive summary across all sites with key metrics. High-level view for management reporting.
- **Data:** Total sites, total users, total devices, total bandwidth
- **Visualization:** KPI cards, summary charts, and table.
- **Filters:** None (current snapshot)
- **Search Parameter:** N/A
- **Sort Parameter:** N/A
- **Default:** Current state
- **Maximum Data per Query:** All sites
- **Maximum Data Available:** Current state
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.9.2. Cross-Site Usage Comparison
- **ID:** `cross-site-usage-comparison`
- **Description:** Compare bandwidth and data usage across all sites. Benchmark performance across locations.
- **Data:** Site name, total users, average bandwidth, data usage
- **Visualization:** Bar chart and table comparing sites.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Site Name
- **Sort Parameter:** Data Usage, Total Users, Site Name
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Data Usage (descending)
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.9.3. Consolidated Billing Report
- **ID:** `consolidated-billing-report`
- **Description:** Combined billing summary for all sites. Finance and accounts payable overview.
- **Data:** Site name, active users, billed amount, due date
- **Visualization:** Bar chart and table showing billing by site.
- **Filters:** Date range (From Month/Year & To Month/Year selection - Billing Period)
- **Search Parameter:** Site Name
- **Sort Parameter:** Billed Amount, Site Name, Due Date
- **Default:**
  - Default billing period should be 'Last 6 months'
  - Default sort parameter should be Billed Amount (descending)
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.9.4. License Utilization by Site
- **ID:** `company-license-utilization`
- **Description:** License allocation and utilization across all sites. Optimize license distribution.
- **Data:** Site name, allocated licenses, used licenses, utilization rate (%)
- **Visualization:** Bar chart and table showing license utilization.
- **Filters:** None (current snapshot)
- **Search Parameter:** Site Name
- **Sort Parameter:** Utilization Rate, Site Name
- **Default:**
  - Default sort parameter should be Utilization Rate (descending)
- **Maximum Data per Query:** All sites
- **Maximum Data Available:** Current state
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF, Excel
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.9.5. User Distribution by Site
- **ID:** `company-user-distribution`
- **Description:** Distribution of users across all company sites. Understand user demographics by location.
- **Data:** Site name, active users, suspended users, new users
- **Visualization:** Stacked bar chart and table showing user distribution.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Site Name
- **Sort Parameter:** Active Users, Site Name
- **Default:**
  - Default date range should be 'Last 6 months'
  - Default sort parameter should be Active Users (descending)
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 13 months
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

#### 2.9.6. Company-Wide Alerts Summary
- **ID:** `company-alerts-summary`
- **Description:** Aggregated alerts and incidents across all sites. Enterprise-wide health monitoring.
- **Data:** Site name, critical alerts, warning alerts, resolved alerts
- **Visualization:** Heatmap and table showing alerts by site.
- **Filters:** Date range (From Date & To Date selection)
- **Search Parameter:** Site Name
- **Sort Parameter:** Critical Alerts, Total Alerts, Site Name
- **Default:**
  - Default date range should be 'Last 30 days'
  - Default sort parameter should be Critical Alerts (descending)
- **Maximum Data per Query:** 90 days
- **Maximum Data Available:** 90 days
- **Report Level:** Company
- **User Access Level:** Company
- **Export Formats:** CSV, PDF
- **Solution Types:** Managed WiFi, Managed WiFi Infra
- **Bandwidth Types:** Fixed, User Level

---

## 3. Report Availability by Solution Type

### 3.1. Managed WiFi (Full Service)
All reports listed above are available.

### 3.2. Managed WiFi Infra (Infrastructure Only)
The following reports are **NOT available** for Managed WiFi Infra sites as internet is not managed by Spectra:

| Report | Reason Not Available |
|--------|---------------------|
| Bandwidth Utilization | Internet not managed by Spectra |
| Internet Uptime Report | Internet not managed by Spectra |
| Add-on Usage Report | Topups disabled |
| Top-up Purchase History (All Types) | Topups disabled |
| Speed Boost Top-up History | Topups disabled |
| Data Pack Top-up History | Topups disabled |
| Extra Device Top-up History | Topups disabled |
| Plan Upgrade Top-up History | Topups disabled |

**Available Reports for Managed WiFi Infra:**
- Monthly Active Users
- Daily Average Active Users
- Policy-wise Active Users
- **Monthly Data Usage Summary** (data from Alepo AAA)
- **Network Usage (GB)** (data from Alepo AAA)
- All Authentication Reports
- Access Point List
- Client List
- User Access Point Analytics
- Rogue AP List
- Alarm List
- Event List
- SLA Compliance (for WiFi infrastructure SLAs)

---

## 4. Report Availability by Bandwidth Type

### 4.1. Fixed Bandwidth
Reports available:
- All billing reports (except Policy-wise)
- All usage reports
- All Wi-Fi network reports
- User Session History, User Data Consumption
- Internet reports (Managed WiFi only)
- SLA and Authentication reports
- Company-level reports

### 4.2. User Level Bandwidth
All reports are available.

**Reports ONLY available for User Level Bandwidth:**
- Policy-wise Monthly Average Active Users
- Users by Speed Tier
- All Upsell/Top-up reports (Managed WiFi only)

---

## 5. Master Report Configuration

The portal includes a master report configuration system that allows Spectra internal administrators to control which reports are available based on:

- **Solution Type:** Managed WiFi or Managed WiFi Infra
- **Segment:** Enterprise, Office, Hotel, Co-Living, Co-Working, PG, Miscellaneous
- **Bandwidth Type:** Fixed or User Level
- **Product:** Various Spectra WiFi products
- **Access Level:** Site or Company

### Configuration File Location
`src/config/masterReportConfig.js`

### Key Functions
- `isReportAvailable(reportId, criteria)` - Check if a report is available
- `getAvailableReports(criteria)` - Get all available reports for given criteria
- `getSiteReports(criteria)` - Get site-level reports
- `getCompanyReports(criteria)` - Get company-level reports
- `getDefaultSelectedReports(criteria)` - Get default reports for site provisioning

---

## 6. Report Categories Summary

| Category | Site-Level Reports | Company-Level Reports |
|----------|-------------------|----------------------|
| Billing | 3 | 1 |
| Usage | 1 | 1 |
| Wi-Fi Network | 8 | 0 |
| End-User | 3 | 0 |
| Internet | 2 | 0 |
| SLA | 1 | 0 |
| Authentication | 2 | 0 |
| Upsell | 6 | 0 |
| Company | 0 | 6 |
| **Total** | **26** | **8** |

---

## 7. Export Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| CSV | Comma-separated values | Data analysis in Excel/Sheets |
| PDF | Portable document format | Formal reports, sharing |
| Excel | Microsoft Excel format | Advanced data manipulation |

---

## 8. Access Levels

| Level | Description | Available Reports |
|-------|-------------|-------------------|
| Site | Single site access | All site-level reports |
| Company | All sites under a company | All reports including company-level |

---

## 9. Sample Data

All reports have sample data available for testing and demonstration purposes. Sample data is generated dynamically and supports:

- **Default Periods:** Today, Last 7 Days, Last 30 Days, Last 90 Days, This Month, Last 6 Months, Last 12 Months
- **Custom Periods:** Any user-defined date range within the maximum limits

### Sample Data Location
`src/constants/reportSampleData.js`

### Key Functions
- `getReportSampleData(reportId, periodType, customRange)` - Get sample data for a specific report
- `getMultipleReportsSampleData(reportIds, periodType, customRange)` - Get sample data for multiple reports

---

*Document Version: 2.0*
*Last Updated: December 2024*
