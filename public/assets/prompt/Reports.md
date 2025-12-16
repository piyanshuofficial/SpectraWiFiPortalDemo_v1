# Reporting Features

- Dynamic Charting: Enable users to customize charts and graphs to highlight specific data points of interest.
- Data Annotations: Allow adding notes and annotations directly to reports for easier collaboration and analysis.
- Scheduled Reports: Automate report generation and delivery via email to stakeholders
- Filter:
  - Filter reports by time period, and other criteria as suitable
  - Ability to filter reports by time range, site, user, device, application, etc.
  - devices: Identify multiple device users (e.g., "1 Device," "2-5 Devices," "6+ Devices," or custom ranges).
- Search:
  - Global Search: Search across all relevant reports or within a specific report based on current view.
  - Keyword Search
    - Partial or full keyword search
    - Utilize keywords to find specific data points, users, or trends within the reports
  - Field-specific Search: Allow searching within specific fields, like User Name, Site name, or date ranges, for more granular exploration.
  - Advanced Search: Implement filters based on custom date ranges or custom ranges for other parameters.
  - Combined Search: Allow searching across multiple fields simultaneously (e.g., User Name and User Policy) using logical operators (AND, OR).
- Sort:
  - Flexible Options: Allow sorting data by various fields, including dates, numbers, and text values (ascending or descending order).
  - Default Sorting: Pre-defined default sorting order for optimal data analysis based on typical use cases. Portal users may be able to customize the sorting as needed.
  - Multi-level Sorting: Depending on the report complexity, multi-level sorting to be available to organize data by multiple criteria (For e.g. Sorting by 'Date' and then by 'User Name' within that date).
- Interactive Data Visualization:
  - Utilize graphs, charts, and dashboards to represent data in a clear and engaging way.
- Each report will be assigned a specific access level based on the sensitivity of the information it contains and the level of detail required for effective decision-making.
  - A standard nomenclature to be followed for the filenames of reports when downloaded in various formats such CSV, PDF and Excel.
- The various categories and types of reports shall be as follows:

## Billing Reports

## Usage Reports

## Wi-Fi Network Reports

## End-User Reports

## Internet Reports

## SLA Reports

## Authentication Reports

## Upsell Reports

# Report Details

## Billing Reports

### Monthly Average Active Users (Site)

- **Description:** Shows the average number of active users on the Wi-Fi network **for all user policies** for each month within a specified date range. Valuable for billing reconciliation for clients with **per user billing model**.
- **Data:** Date (month & year), count of average active users, count of new users, count of churned users (optional), change from previous month (optional), count of user activation and count of user deactivation
- **Visualization:** Column chart and table showing monthly average active users over time.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date
- **Default:**
  - Default date range/time period should be 'Last 12 calendar months'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months (to allow for year-over-year comparisons)
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Linked Reports:**
  - Daily Average Active Users Report (Site): Drill down

### Daily Average Active Users (Site)

- **Description:** Shows the day-wise average number of active users on the Wi-Fi network **for all user policies** for a particular month. Valuable for billing reconciliation for clients with per user billing.
- **Data:** Date (date & month), Count of average active users, count of new users, count of churned users (optional), change from previous day (optional), count of user activation and count of user deactivation
- **Visualization:** Line chart and table showing trends in daily average active users over time.
- **Filters:** Date range (Month selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date
- **Default:**
  - Default date range/time period should be 'Previous calendar month'
  - Default sort parameter should be Date
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months (to allow for year-over-year comparisons)
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:**
  - Monthly Average Active Users Report (Site): Drill up

### Policy-wise Monthly Average Active Users (Site)

- **Description:** Shows the average number of active users on the Wi-Fi network **for each of the active user policies** for each month within a specified date range. Valuable for billing reconciliation for clients with per user billing model.
- **Data:** Date (month & year), Policy Name (description), Count of average active users
- **Visualization:** Column chart and table showing policy-wise monthly average active users over time.
- **Filters:** Date range (From Month/Year & To Month/Year selection), Policy Name(Description)
- **Search Parameter:** Date, Policy Name
- **Sort Parameter:** Date, Policy Name
- **Default:**
  - Default date range/time period should be 'Last 12 calendar months' with all policies
  - Default sort parameter should be Date | Policy Name
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months (to allow for year-over-year comparisons)
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:** None

### Average Active Users Summary (Company)

- **Description:** Shows the average number of active users on the Wi-Fi network **for all the sites at corresponding access level of Company** for a particular month within a specified date range. Valuable for billing reconciliation for clients with per user billing model.
- **Data:** Date (month & year), Company, Site Name, Count of average active users, change from previous month (optional), count of user activation and count of user deactivation.
- **Visualization:** Table showing average active users summary for a particular month.
- **Filters:** Date range (From Month/Year & To Month/Year selection), Site
- **Search Parameter:** Date, Site Name
- **Sort Parameter:** Date, Site Name
- **Default:**
  - Default date range/time period should be 'Last calendar month'
  - Default sort parameter should be Date | Site Name
- **Maximum Data per Query:** 13 months
- **Maximum Data Available:** 13 months (to allow for year-over-year comparisons)
- **Report Level:** Company
- **User Access Level:** Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:**
  - Monthly Average Active Users Report (Site): Drill down

## Usage Reports

### Monthly Data Usage Summary Report (Site)

- Description: Shows the total data usage (in GB) and average data usage per active user on the Wi-Fi network at a specific site for a particular month within a specified date range. Valuable for capacity planning, identifying high-usage users, and monitoring network performance.
- **Data:** Date (month & year), Site Name, Total Data Usage (GB), Average data usage per active user (GB), Count of active users, Change from previous month.
- **Visualization:** Line chart showing total data usage trend and bar chart for average data usage per active user, or a combined table presenting both metrics.
- **Filters:** Date range (From Month/Year & To Month/Year selection)
- **Search Parameter:** Date
- **Sort Parameter:** Date, Total Data Usage, Average data usage per active user, Count of active users
- **Default:**
  - Default date range/time period should be "Last 6 months"
  - Default sort parameter should be Date
- **Maximum Data per Query:** 12 months
- **Maximum Data Available:** 24 months (for long-term trend analysis)
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:**
  - User Data Consumption Report (User): Drill down to individual user details

### Monthly Data Usage Summary Report (Company)

- Description: Shows the total data usage (in GB) and average data usage per active user on the Wi-Fi network across all sites within the company for a particular month within a specified date range. Valuable for capacity planning, identifying high-usage users, and monitoring network performance.
- **Data:** Date (month & year), Company Name, Site Name, City Name, Total Data Usage (GB), Average data usage per active user (GB), Count of active users, Change from previous month.
- **Visualization:** Table showing monthly data usage summary for a particular month for all sites within the city
- **Filters:** Date range (Month/Year selection)
- **Search Parameter:**, Site Name
- **Sort Parameter:** City Name, Site Name, Total Data Usage, Average data usage per active user, Count of active users
- **Default:**
  - Default date range/time period should be "Previous month"
  - Default sort parameter should be City Name | Site Name
- **Maximum Data per Query:** 1 month
- **Maximum Data Available:** 24 months (for long-term trend analysis)
- **Report Level:** Company
- **User Access Level:** Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution

## Wi-Fi Network Reports

### Access Point List

### Access Point MAC List

### Client List

### User Access Point Analytics

### Rogue AP List

### Alarm List

### Event List

### Individual Access Point Uptime Report

### Network Uptime Report

### Access Point Traffic Distribution

### Wireless Client Signal Strength Report

### Wi-Fi Channel Utilization Report

## User Reports

### User Registration Report (Site)

### Registered User Report (Site)

- Description: Shows all the registered users at the site i.e. all the registered users irrespective of current user status.
- **Data:** User ID, User Name, Mobile Number, Email, Policy Name, Linked Device Count, Status, Registration Date, Last Online Date, User Category
- **Visualization:** Table showing details of all registered site users
- **Filters:** Linked Device Count, Policy Name, Registration Date, Last Online Date, User Category, Status
- **Search Parameter:** User ID, User Name, Mobile Number, Email, Policy Name
- **Sort Parameter:** User ID, User Name, Status, Policy Name, Linked Device Count, Status, Registration Date, Last Online Date, User Category
- **Default:**
  - Default sort parameter should be Registration Date | User ID | Policy Name
- **Maximum Data per Query:** Not Applicable
- **Maximum Data Available:** Not Applicable
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:** None

### Active Users (Site)

- Description: Shows all the Active users at the site i.e. users with the current status as 'Active'.
- **Data:** User ID, User Name, Mobile Number, Email, Policy Name, Linked Device Count, Status, Registration Date, Activation Date, Last Online Date, User Category
- **Visualization:** Table showing details of all active site users
- **Filters:** Linked Device Count, Policy Name, Registration Date, Activation Date, Last Online Date, User Category
- **Search Parameter:** User ID, User Name, Mobile Number, Email, Policy Name
- **Sort Parameter:** User ID, User Name, Status, Policy Name, Linked Device Count, Registration Date, Activation Date, Last Online Date, User Category
- **Default:**
  - Default sort parameter should be Activation Date | User ID | Policy Name
- **Maximum Data per Query:** Not Applicable
- **Maximum Data Available:** Not Applicable
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution

### Suspended Users (Site)

- Description: Shows all the suspended users at the site i.e. users with the current status as 'Suspended'.
- **Data:** User ID, User Name, Mobile Number, Email, Policy Name, Linked Device Count, Status, Registration Date, Suspension Date, Last Online Date, User Category
- **Visualization:** Table showing details of all suspended site users
- **Filters:** Linked Device Count, Policy Name, Registration Date, Deactivation Date, Last Online Date, User Category
- **Search Parameter:** User ID, User Name, Mobile Number, Email, Policy Name
- **Sort Parameter:** User ID, User Name, Status, Policy Name, Linked Device Count, Registration Date, suspended Date, Last Online Date, User Category
- **Default:**
  - Default sort parameter should be Suspension Date | User ID | Policy Name
- **Maximum Data per Query:** Not Applicable
- **Maximum Data Available:** Not Applicable
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution

### Blocked Users (Site)

- Description: Shows all the Blocked users at the site i.e. users with the current status as 'Blocked'.
- **Data:** User ID, User Name, Mobile Number, Email, Policy Name, Linked Device Count, Status, Registration Date, Blocking Date, Last Online Date, User Category
- **Visualization:** Table showing details of all blocked site users
- **Filters:** Linked Device Count, Policy Name, Registration Date, Blocking Date, Last Online Date, User Category
- **Search Parameter:** User ID, User Name, Mobile Number, Email, Policy Name
- **Sort Parameter:** User ID, User Name, Status, Policy Name, Linked Device Count, Registration Date, Blocking Date, Last Online Date, User Category
- **Default:**
  - Default sort parameter should be Blocking Date | User ID | Policy Name
- **Maximum Data per Query:** Not Applicable
- **Maximum Data Available:** Not Applicable
- **Report Level:** Site
- **User Access Level:** Site, Company
- **Solution Applicability:**
  - Managed Wi-Fi Solution
  - Managed Wi-Fi Infrastructure Solution
- **Linked Reports:** None

## Internet Reports

## SLA Reports

## Authentication Reports

## Upsell Reports