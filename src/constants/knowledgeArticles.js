// src/constants/knowledgeArticles.js

export const knowledgeArticles = {
  "adding-new-users": {
    title: "Adding New Users",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to create new user accounts in the portal with proper policy assignments and access configurations."
      },
      {
        type: "steps",
        title: "Step-by-Step Guide",
        steps: [
          {
            number: 1,
            title: "Navigate to User Management",
            description: "Click on 'Users' in the left sidebar navigation menu to access the User Management page.",
            screenshot: "[Screenshot: Sidebar with Users menu highlighted]"
          },
          {
            number: 2,
            title: "Click Add User Button",
            description: "Click the 'Add User' button in the toolbar at the top of the user list.",
            screenshot: "[Screenshot: Add User button highlighted]"
          },
          {
            number: 3,
            title: "Fill User Details",
            description: "In the Add User modal, enter the following required information:\n• User ID (unique identifier)\n• First Name\n• Last Name\n• Mobile Number (10 digits)\n• Email Address\n• Location",
            screenshot: "[Screenshot: Add User form with fields highlighted]"
          },
          {
            number: 4,
            title: "Assign User Policy",
            description: "Select an appropriate policy that defines:\n• Speed Limit (10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps)\n• Data Volume (10 GB, 20 GB, 50 GB, 100 GB, Unlimited)\n• Device Limit (1-5 devices)\n• Data Cycle Type (Daily, Monthly)",
            screenshot: "[Screenshot: Policy selection dropdown]"
          },
          {
            number: 5,
            title: "Set Check-In/Check-Out Dates (Optional)",
            description: "If applicable, specify check-in and check-out dates to automatically manage user access periods and account lifecycle.",
            screenshot: "[Screenshot: Date picker fields]"
          },
          {
            number: 6,
            title: "Submit and Confirm",
            description: "Click 'Submit' to create the user. The system will:\n• Validate all fields\n• Check license availability\n• Provision the account\n• Display a success notification",
            screenshot: "[Screenshot: Success notification]"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Check license availability before adding users - the license ring shows current usage",
          "User IDs cannot be changed after creation, so choose carefully",
          "Mobile numbers and emails are used for credential delivery",
          "Users are automatically set to 'Active' status upon creation"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "License limit reached",
            solution: "Free up licenses by blocking unused users or request additional licenses from your administrator"
          },
          {
            issue: "Duplicate User ID error",
            solution: "User IDs must be unique across the entire portal. Choose a different ID"
          },
          {
            issue: "Invalid mobile number",
            solution: "Ensure the mobile number is exactly 10 digits without country code or special characters"
          }
        ]
      }
    ]
  },

  "user-policies-licenses": {
    title: "User Policies & Licenses",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Understand how to configure user policies, manage bandwidth limits, and monitor license utilization across your organization."
      },
      {
        type: "section",
        title: "Policy Components",
        items: [
          {
            name: "Speed Limit",
            description: "Controls maximum bandwidth per user. Options: 10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps. Enterprise users typically get higher speeds.",
            screenshot: "[Screenshot: Speed limit dropdown options in policy form]"
          },
          {
            name: "Data Volume",
            description: "Monthly or daily data cap per user. Options: 10 GB, 20 GB, 50 GB, 100 GB, Unlimited. Guest users often have limited data.",
            screenshot: "[Screenshot: Data volume selection options]"
          },
          {
            name: "Device Limit",
            description: "Maximum number of devices a user can connect simultaneously. Ranges from 1 to 5 devices based on policy configuration.",
            screenshot: "[Screenshot: Device limit selector]"
          },
          {
            name: "Data Cycle Type",
            description: "Defines when data caps reset. Daily cycle resets at midnight, Monthly cycle resets on the 1st of each month.",
            screenshot: "[Screenshot: Data cycle type options - Daily/Monthly]"
          }
        ]
      },
      {
        type: "section",
        title: "License Management",
        items: [
          {
            name: "License Types",
            description: "Available license tiers include:\n• Premium: High-speed access with unlimited or high data caps\n• Standard: Moderate speed and data allocations\n• Basic: Economical tier with essential connectivity\n• Guest: Temporary access with limited duration and data",
            screenshot: "[Screenshot: License type distribution chart]"
          },
          {
            name: "License Capacity",
            description: "Your organization has a defined license pool capacity. Monitor license utilization regularly to ensure availability for new users and avoid hitting capacity limits that could block user creation.",
            screenshot: "[Screenshot: License capacity indicator on dashboard]"
          },
          {
            name: "Monitoring Usage",
            description: "The license ring on the User Management page shows current usage vs. total available licenses. Color codes: Green (0-70%), Yellow (71-85%), Red (86-100%)",
            screenshot: "[Screenshot: License ring with color-coded usage status]"
          }
        ]
      },
      {
        type: "steps",
        title: "How to Assign Policies",
        steps: [
          {
            number: 1,
            title: "Open User Form",
            description: "Click Add User or Edit existing user",
            screenshot: "[Screenshot: User form modal]"
          },
          {
            number: 2,
            title: "Select Policy Settings",
            description: "Choose appropriate speed, data volume, device limit, and cycle type from dropdowns",
            screenshot: "[Screenshot: Policy dropdowns]"
          },
          {
            number: 3,
            title: "Review and Save",
            description: "Verify the policy configuration matches user requirements and save",
            screenshot: "[Screenshot: Policy summary]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Match policies to user needs - don't over-provision",
          "Monitor license usage regularly to avoid hitting limits",
          "Use guest policies for temporary or short-term users",
          "Implement daily cycles for hotels with high turnover"
        ]
      }
    ]
  },

  "device-registration": {
    title: "Device Registration",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Register devices with MAC address binding to ensure secure network access and proper user tracking."
      },
      {
        type: "steps",
        title: "Registration Process",
        steps: [
          {
            number: 1,
            title: "Navigate to Device Management",
            description: "Click 'Devices' in the sidebar to access the Device Management page",
            screenshot: "[Screenshot: Device Management page]"
          },
          {
            number: 2,
            title: "Click Register Device",
            description: "Click the 'Register Device' button in the toolbar",
            screenshot: "[Screenshot: Register Device button]"
          },
          {
            number: 3,
            title: "Enter MAC Address",
            description: "Input the device MAC address in format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX. The system will validate format and check for duplicates.",
            screenshot: "[Screenshot: MAC address field]"
          },
          {
            number: 4,
            title: "Choose Device Type",
            description: "Select device category:\n• Human Devices: Laptop, Mobile, Tablet\n• Non-Human Devices: IoT, Printer, Camera, Smart TV, Gaming Console",
            screenshot: "[Screenshot: Device type dropdown]"
          },
          {
            number: 5,
            title: "Select Registration Mode",
            description: "Choose how to register:\n• Bind to Existing User: Links device to a user account\n• Create as Device User: Creates standalone device account (for IoT devices)",
            screenshot: "[Screenshot: Registration mode selection]"
          },
          {
            number: 6,
            title: "Provide Device Name",
            description: "Enter a friendly name for identification (e.g., 'John's Laptop', 'Conference Room Printer')",
            screenshot: "[Screenshot: Device name field]"
          },
          {
            number: 7,
            title: "Submit Registration",
            description: "Click Submit to register the device. The system will validate and activate it immediately.",
            screenshot: "[Screenshot: Success confirmation]"
          }
        ]
      },
      {
        type: "tips",
        title: "Important Notes",
        items: [
          "MAC addresses must be unique across the entire network",
          "Device count is limited by user's policy (typically 1-5 devices)",
          "Non-human devices should be registered as device users for proper accounting",
          "Device names can be changed later, but MAC addresses cannot"
        ]
      }
    ]
  },

  "dashboard-overview": {
    title: "Dashboard Overview",
    category: "Reports & Analytics",
    content: [
      {
        type: "intro",
        text: "The dashboard provides real-time insights into your network operations, user activity, and system health."
      },
      {
        type: "section",
        title: "Overview Cards",
        items: [
          {
            name: "Active Users",
            description: "Shows current number of active users in your network. Green arrow indicates growth, red arrow indicates decline compared to previous period.",
            screenshot: "[Screenshot: Active Users card showing user count with trend arrow]"
          },
          {
            name: "License Usage",
            description: "Displays percentage of licenses currently in use. Monitor this to avoid hitting capacity limits and ensure availability for new users.",
            screenshot: "[Screenshot: License Usage card showing percentage and progress bar]"
          },
          {
            name: "Data Usage",
            description: "Total data consumed this week across all users, measured in TB (Terabytes). Helps track network utilization trends.",
            screenshot: "[Screenshot: Data Usage card showing TB consumed with trend indicator]"
          },
          {
            name: "Alerts",
            description: "Count of current system alerts. Click to view details. Green badge means no critical alerts.",
            screenshot: "[Screenshot: Alerts card showing alert count with color indicator]"
          }
        ]
      },
      {
        type: "section",
        title: "Network Analytics Charts",
        items: [
          {
            name: "Network Usage (Line Chart)",
            description: "Daily network usage in GB over the last 90 days. Use this to identify trends and plan capacity. Hover over points for exact values. Export to CSV or PDF for reporting.",
            screenshot: "[Screenshot: Network Usage line chart with 90-day trend and export buttons]"
          },
          {
            name: "License Usage by Type (Bar Chart)",
            description: "Shows distribution of license types (Premium, Standard, Basic, Guest) across all active users. Helps optimize license allocation and planning.",
            screenshot: "[Screenshot: License Usage bar chart showing distribution by type]"
          },
          {
            name: "Alerts Summary (Pie Chart)",
            description: "Breakdown of alerts by severity: Critical (red), Warning (orange), Info (green). Click segments for detailed alert list.",
            screenshot: "[Screenshot: Alerts pie chart with severity breakdown]"
          }
        ]
      },
      {
        type: "tips",
        title: "Quick Actions",
        items: [
          "Add User - Quickly create new user accounts",
          "View Users - Jump to user management page",
          "Reports - Access detailed reporting dashboard",
          "Support - Get help from knowledge center"
        ],
        screenshot: "[Screenshot: Dashboard quick action buttons at bottom of page]"
      }
    ]
  },

  "generating-reports": {
    title: "Generating Reports",
    category: "Reports & Analytics",
    content: [
      {
        type: "intro",
        text: "Generate comprehensive reports for billing, compliance, analytics, and SLA monitoring."
      },
      {
        type: "steps",
        title: "Report Generation Workflow",
        steps: [
          {
            number: 1,
            title: "Access Reports Page",
            description: "Click 'Reports' in the sidebar navigation",
            screenshot: "[Screenshot: Reports navigation]"
          },
          {
            number: 2,
            title: "Browse Report Categories",
            description: "Choose from categories:\n• Billing Reports\n• End-User Reports\n• Wi-Fi Network Reports\n• SLA Reports",
            screenshot: "[Screenshot: Report categories]"
          },
          {
            number: 3,
            title: "Select Report Type",
            description: "Click on a specific report card. Each shows description, estimated generation time, and available export formats.",
            screenshot: "[Screenshot: Report card]"
          },
          {
            number: 4,
            title: "Configure Report Criteria",
            description: "Set filters based on report type:\n• Date Range: Start and end dates\n• Month Range: For monthly reports\n• Policy Filter: Specific user policies\n• User Filter: Specific user ID or group\n• Status Filter: Active, Suspended, Blocked users",
            screenshot: "[Screenshot: Criteria form]"
          },
          {
            number: 5,
            title: "Preview Report",
            description: "Click 'Generate Report' to preview data in table format with charts (if applicable)",
            screenshot: "[Screenshot: Report preview]"
          },
          {
            number: 6,
            title: "Export Report",
            description: "Choose export format:\n• CSV: For Excel and data analysis\n• PDF: For presentations and sharing",
            screenshot: "[Screenshot: Export buttons]"
          }
        ]
      },
      {
        type: "section",
        title: "Popular Reports",
        items: [
          {
            name: "Daily Billing Summary",
            description: "Daily revenue, user charges, and policy-wise billing breakdown. Used for daily reconciliation."
          },
          {
            name: "User Session History",
            description: "Track user login/logout times, session duration, and data consumption per session."
          },
          {
            name: "Network Usage Report",
            description: "Monitor daily/monthly network usage trends for capacity planning and infrastructure optimization."
          },
          {
            name: "License Usage Report",
            description: "Analyze license type distribution and utilization rates."
          },
          {
            name: "SLA Compliance Report",
            description: "Track uptime, availability, and service level agreement metrics."
          }
        ]
      },
      {
        type: "tips",
        title: "Report Best Practices",
        items: [
          "Use date ranges wisely - large date ranges may take longer to generate",
          "Apply status and policy filters to focus on specific user groups",
          "Export to CSV for further analysis in Excel or BI tools",
          "Schedule regular report generation for compliance requirements",
          "Save frequently used criteria for quick access"
        ]
      }
    ]
  },

  "troubleshooting-connection": {
    title: "User Connection Issues",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Quick troubleshooting guide for resolving common user connection and authentication problems."
      },
      {
        type: "section",
        title: "Common Issues & Solutions",
        items: [
          {
            name: "User Cannot Login",
            solution: "Check:\n1. User status is 'Active' (not Suspended/Blocked)\n2. Check-in/Check-out dates are valid\n3. Credentials match (case-sensitive)\n4. License limit not exceeded\n5. Device is registered if MAC binding enabled"
          },
          {
            name: "Authentication Failed",
            solution: "Verify:\n1. User exists in the system\n2. Password has not expired\n3. Account is not locked after failed attempts\n4. AAA server is responding\n5. Network connectivity to auth server"
          },
          {
            name: "User Blocked Unexpectedly",
            solution: "Check:\n1. Data quota exceeded\n2. Payment status (if billing enabled)\n3. Manual blocking by admin\n4. Auto-block rules triggered\n5. Check-out date reached"
          },
          {
            name: "Slow Connection Speed",
            solution: "Investigate:\n1. User's assigned policy speed limit\n2. Multiple devices sharing bandwidth\n3. Network congestion on AP\n4. Distance from access point\n5. Device capabilities"
          },
          {
            name: "Device Not Connecting",
            solution: "Troubleshoot:\n1. MAC address correctly registered\n2. User device limit not exceeded\n3. Device type allowed by policy\n4. MAC format valid\n5. No duplicate MAC entries"
          }
        ]
      },
      {
        type: "steps",
        title: "Diagnostic Steps",
        steps: [
          {
            number: 1,
            title: "Check User Status",
            description: "Navigate to User Management > Find user > Verify status is 'Active'",
            screenshot: "[Screenshot: User status badge]"
          },
          {
            number: 2,
            title: "Review User Policy",
            description: "Click on user > View Details > Check policy settings match requirements",
            screenshot: "[Screenshot: User policy details]"
          },
          {
            number: 3,
            title: "Verify Device Registration",
            description: "Go to Device Management > Search MAC > Confirm device is registered and online",
            screenshot: "[Screenshot: Device list]"
          },
          {
            number: 4,
            title: "Check License Availability",
            description: "Review license ring - if at capacity, free up licenses",
            screenshot: "[Screenshot: License ring]"
          },
          {
            number: 5,
            title: "Reset Credentials",
            description: "If password issues suspected, use password reset function",
            screenshot: "[Screenshot: Reset password button]"
          }
        ]
      },
      {
        type: "tips",
        title: "Prevention Tips",
        items: [
          "Monitor license usage proactively",
          "Set up alerts for capacity thresholds",
          "Regularly review and clean up inactive users",
          "Document credential policies clearly",
          "Train users on self-service portal access"
        ]
      }
    ]
  },

  "bulk-user-operations": {
    title: "Bulk User Operations",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to perform bulk operations to efficiently manage large numbers of users through CSV import, batch updates, and data exports."
      },
      {
        type: "steps",
        title: "CSV Import Process",
        steps: [
          {
            number: 1,
            title: "Download CSV Template",
            description: "Navigate to Users page and click 'Download Template' button to get the correct CSV format with all required columns.",
            screenshot: "[Screenshot: Download Template button in toolbar]"
          },
          {
            number: 2,
            title: "Prepare User Data",
            description: "Fill the CSV template with user information:\n• User ID (unique)\n• First Name, Last Name\n• Mobile Number\n• Email Address\n• Policy Name\n• Location\n• Check-In/Check-Out dates (if applicable)",
            screenshot: "[Screenshot: Sample CSV file with data]"
          },
          {
            number: 3,
            title: "Upload CSV File",
            description: "Click 'Import Users' button, select your prepared CSV file, and click Upload. The system will validate the data format.",
            screenshot: "[Screenshot: Import Users dialog with file selector]"
          },
          {
            number: 4,
            title: "Review Validation Results",
            description: "Check the validation report for any errors or warnings. Fix issues in the CSV and re-upload if needed.",
            screenshot: "[Screenshot: Validation results showing success/error counts]"
          },
          {
            number: 5,
            title: "Confirm Import",
            description: "Review the summary of users to be imported and click 'Confirm Import' to create all user accounts in bulk.",
            screenshot: "[Screenshot: Import confirmation dialog with user count]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Always download the latest CSV template to ensure correct column format",
          "Check available licenses before importing large user batches",
          "Use unique User IDs to avoid conflicts with existing accounts",
          "Validate email addresses and mobile numbers before import",
          "Test with a small CSV file (5-10 users) before importing hundreds",
          "Keep a backup copy of your CSV file before uploading"
        ]
      },
      {
        type: "section",
        title: "Bulk Export Options",
        items: [
          {
            name: "Export Current View",
            description: "Export users visible in the current filtered view with applied search and status filters.",
            screenshot: "[Screenshot: Export CSV button in user list toolbar]"
          },
          {
            name: "Export All Users",
            description: "Export complete user database including all statuses and policies for comprehensive reporting.",
            screenshot: "[Screenshot: Export options dropdown with All Users selected]"
          },
          {
            name: "Export with Custom Columns",
            description: "Select specific columns to include in the export (User ID, Name, Policy, Status, Usage Stats, etc.).",
            screenshot: "[Screenshot: Export column selection dialog]"
          },
          {
            name: "Export Date Range",
            description: "Export users created or modified within a specific date range for audit and compliance purposes.",
            screenshot: "[Screenshot: Date range filter in export dialog]"
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Import Issues",
        items: [
          {
            issue: "Duplicate User ID errors during import",
            solution: "Check your CSV for duplicate User IDs within the file. Also verify that these User IDs don't already exist in the system by searching in the user list."
          },
          {
            issue: "Invalid mobile number format",
            solution: "Ensure all mobile numbers are exactly 10 digits without spaces, dashes, or country codes. Format: 9876543210"
          },
          {
            issue: "Policy not found errors",
            solution: "Verify that the policy names in your CSV exactly match existing policy names (case-sensitive). Check available policies in the Policy dropdown."
          },
          {
            issue: "License limit exceeded warning",
            solution: "Check current license utilization before import. Free up licenses by blocking inactive users or upgrade your license capacity."
          }
        ]
      }
    ]
  },

  "user-status-management": {
    title: "User Status Management",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to manage user account statuses, handle account lifecycle, and perform common account management tasks like password resets and credential updates."
      },
      {
        type: "section",
        title: "User Status Types",
        items: [
          {
            name: "Active Status",
            description: "User can authenticate and access network resources according to their policy. Data usage is tracked and licenses are consumed.",
            screenshot: "[Screenshot: User row with green Active status badge]"
          },
          {
            name: "Suspended Status",
            description: "Temporary suspension - user cannot access network but account remains in system. Useful for temporary holds or payment issues. License is still consumed.",
            screenshot: "[Screenshot: User row with yellow Suspended status badge]"
          },
          {
            name: "Blocked Status",
            description: "Permanent block - user cannot access network. Use for policy violations or account termination. License is freed for reuse.",
            screenshot: "[Screenshot: User row with red Blocked status badge]"
          },
          {
            name: "Expired Status",
            description: "Automatically set when check-out date passes. User access is automatically disabled and license is freed for reuse.",
            screenshot: "[Screenshot: User row with gray Expired status badge]"
          }
        ]
      },
      {
        type: "steps",
        title: "Changing User Status",
        steps: [
          {
            number: 1,
            title: "Locate User",
            description: "Navigate to Users page and use search or filters to find the user account you want to modify.",
            screenshot: "[Screenshot: User search bar with filters]"
          },
          {
            number: 2,
            title: "Open User Actions",
            description: "Click the three-dot menu button in the user row to open the actions dropdown menu.",
            screenshot: "[Screenshot: User row with actions menu highlighted]"
          },
          {
            number: 3,
            title: "Select Status Action",
            description: "Choose from available actions:\n• Suspend User\n• Block User\n• Activate User\n• Reset Password\n• Edit Details",
            screenshot: "[Screenshot: Actions dropdown menu]"
          },
          {
            number: 4,
            title: "Confirm Action",
            description: "Review the confirmation dialog explaining the impact of the status change, then click Confirm to proceed.",
            screenshot: "[Screenshot: Confirmation dialog for status change]"
          },
          {
            number: 5,
            title: "Verify Status Update",
            description: "Check that the status badge next to the user's name has updated to reflect the new status (Active/Suspended/Blocked).",
            screenshot: "[Screenshot: User list showing updated status badge]"
          }
        ]
      },
      {
        type: "steps",
        title: "Password Reset Process",
        steps: [
          {
            number: 1,
            title: "Access User Actions",
            description: "Find the user in the user list and click the actions menu (three dots) in their row.",
            screenshot: "[Screenshot: User row with actions menu]"
          },
          {
            number: 2,
            title: "Select Reset Password",
            description: "Click 'Reset Password' from the actions dropdown menu.",
            screenshot: "[Screenshot: Reset Password option highlighted]"
          },
          {
            number: 3,
            title: "Choose Reset Method",
            description: "Select how to send the new password:\n• Email to user's registered email\n• SMS to mobile number\n• Display on screen (for admin to communicate)",
            screenshot: "[Screenshot: Password reset method selection]"
          },
          {
            number: 4,
            title: "Generate New Password",
            description: "System generates a secure temporary password and sends it via selected method. User must change password on first login.",
            screenshot: "[Screenshot: Password reset success message]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Use Suspend for temporary holds; use Block for permanent termination",
          "Document reason for status changes for audit trail and compliance",
          "Inform users before suspending or blocking their accounts",
          "Check for active sessions before blocking critical accounts",
          "Regularly review expired users to free up licenses",
          "Use bulk status updates for seasonal operations (Hotel check-outs, etc.)"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Cannot activate user - license limit reached",
            solution: "Free up licenses by blocking inactive users or users with expired check-out dates. Alternatively, upgrade your license capacity."
          },
          {
            issue: "User still has network access after suspension",
            solution: "Allow 2-5 minutes for status change to propagate to network infrastructure. If issue persists, check if user has multiple accounts or devices."
          },
          {
            issue: "Password reset email not received",
            solution: "Verify email address is correct in user profile. Check user's spam folder. Try SMS method instead or display password on screen to communicate manually."
          }
        ]
      }
    ]
  },

  "policy-setup": {
    title: "Policy Setup & Configuration",
    category: "Network Configuration",
    content: [
      {
        type: "intro",
        text: "Learn how to create and manage user policies that define network access parameters including speed limits, data volumes, device limits, and data cycle configurations for your users."
      },
      {
        type: "steps",
        title: "Creating a New Policy",
        steps: [
          {
            number: 1,
            title: "Navigate to Policies",
            description: "Click on 'Configuration' in the sidebar, then select 'User Policies' to access the policy management page.",
            screenshot: "[Screenshot: Sidebar with Configuration menu expanded]"
          },
          {
            number: 2,
            title: "Click Create Policy",
            description: "Click the 'Create New Policy' button in the toolbar to open the policy configuration dialog.",
            screenshot: "[Screenshot: Create New Policy button highlighted]"
          },
          {
            number: 3,
            title: "Enter Policy Name",
            description: "Provide a descriptive name for the policy (e.g., 'Enterprise_Premium_50Mbps', 'Hotel_Basic_10Mbps').",
            screenshot: "[Screenshot: Policy name input field]"
          },
          {
            number: 4,
            title: "Configure Speed Limit",
            description: "Select download speed limit from available options:\n• 10 Mbps (Basic)\n• 20 Mbps (Standard)\n• 30 Mbps (Premium)\n• 50 Mbps (Ultra)\n• Unlimited (for special cases)",
            screenshot: "[Screenshot: Speed limit dropdown]"
          },
          {
            number: 5,
            title: "Set Data Volume",
            description: "Define data allowance per cycle:\n• 10 GB\n• 20 GB\n• 50 GB\n• 100 GB\n• Unlimited",
            screenshot: "[Screenshot: Data volume selector]"
          },
          {
            number: 6,
            title: "Configure Device Limit",
            description: "Set maximum number of devices per user (1-5 devices). Configure separate limits for human and non-human devices if needed.",
            screenshot: "[Screenshot: Device limit slider]"
          },
          {
            number: 7,
            title: "Select Data Cycle Type",
            description: "Choose how data allowance resets:\n• Daily (resets every 24 hours)\n• Monthly (resets on 1st of each month)\n• Custom (specify cycle length)",
            screenshot: "[Screenshot: Data cycle type options]"
          },
        ]
      },
      {
        type: "section",
        title: "Policy Parameters Explained",
        items: [
          {
            name: "Speed Limit",
            description: "Maximum download/upload speed for users on this policy. Helps balance network load and provide tiered service levels."
          },
          {
            name: "Data Volume",
            description: "Total data transfer allowed per cycle. Once exhausted, user may be throttled or blocked based on policy configuration."
          },
          {
            name: "Device Limit",
            description: "Maximum devices a single user can register. Configure based on use case: power users may need 3-5 devices, while guest users may be limited to 1-2 devices."
          },
          {
            name: "Data Cycle Type",
            description: "Defines when data allowance resets. Daily cycles suit short-term guests, monthly cycles suit long-term residents."
          },
          {
            name: "Priority Level",
            description: "QoS priority for traffic routing. Higher priority policies get bandwidth preference during network congestion."
          }
        ]
      },
      {
        type: "tips",
        title: "Policy Design Best Practices",
        items: [
          "Create tiered policies (Basic, Standard, Premium) to offer service levels",
          "Use descriptive names that indicate user type and speed (e.g., Professional_Premium_50Mbps, Guest_Basic_10Mbps)",
          "Set realistic data volumes based on typical usage patterns for your user base",
          "Consider separate policies for different user types (permanent vs temporary, professional vs guest)",
          "Test new policies with a small user group before wide deployment",
          "Document policy purpose and target user type for future reference",
          "Review and adjust policies quarterly based on usage analytics"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Policy Issues",
        items: [
          {
            issue: "Users exceeding data limits too quickly",
            solution: "Review usage analytics to identify high-consumption patterns. Consider increasing data volume or implementing fair usage policy. Check for unauthorized device sharing."
          },
          {
            issue: "Cannot assign policy to certain users",
            solution: "Verify the policy is active and not deprecated. Check that you have admin permissions to assign policies. Confirm the user account is in good standing."
          },
          {
            issue: "Speed limits not being enforced",
            solution: "Verify policy is properly configured in network infrastructure. Check that user's policy assignment is active. Allow 5-10 minutes for policy changes to propagate."
          }
        ]
      }
    ]
  },

  "segment-configuration": {
    title: "Advanced Network Configuration",
    category: "Network Configuration",
    content: [
      {
        type: "intro",
        text: "Learn how to configure advanced network settings including device type restrictions, license capacity management, and network performance optimization for your organization."
      },
      {
        type: "section",
        title: "Device Configuration",
        items: [
          {
            name: "Device Type Restrictions",
            description: "Configure which device types are allowed in your network. Human devices (laptops, phones, tablets) vs Non-human devices (IoT, printers, smart TVs, cameras). Set separate limits for each type.",
            screenshot: "[Screenshot: Device type restriction checkboxes and limits]"
          },
          {
            name: "Device Registration Settings",
            description: "Control device registration process: automatic approval, manual approval, or restricted registration. Configure MAC address validation and duplicate detection rules.",
            screenshot: "[Screenshot: Device registration approval settings]"
          },
          {
            name: "Device Limits per User",
            description: "Set global device limits or configure per-policy limits. Balance between user convenience (more devices) and network security/capacity (fewer devices).",
            screenshot: "[Screenshot: Global device limit configuration slider]"
          },
          {
            name: "Device Naming Conventions",
            description: "Enforce device naming standards to improve network visibility and management. Examples: 'username-devicetype-number' or 'location-devicetype-id'.",
            screenshot: "[Screenshot: Device naming pattern configuration field]"
          }
        ]
      },
      {
        type: "steps",
        title: "Configuring Network Settings",
        steps: [
          {
            number: 1,
            title: "Access Network Configuration",
            description: "Navigate to Configuration → Network Settings in the sidebar to access advanced configuration options.",
            screenshot: "[Screenshot: Network Settings page]"
          },
          {
            number: 2,
            title: "Configure Device Restrictions",
            description: "Set device type policies:\n• Allow/restrict human devices (laptops, phones, tablets)\n• Allow/restrict non-human devices (IoT, printers, smart TVs)\n• Set maximum devices per user",
            screenshot: "[Screenshot: Device restriction settings]"
          },
          {
            number: 3,
            title: "Set License Capacity",
            description: "Review and configure license pool capacity. Monitor current utilization and plan for growth. Set alert thresholds for capacity warnings.",
            screenshot: "[Screenshot: License capacity configuration]"
          },
          {
            number: 4,
            title: "Configure Access Controls",
            description: "Set network access rules:\n• Guest access duration limits\n• Temporary user auto-expiration\n• Password complexity requirements\n• Multi-device authentication rules",
            screenshot: "[Screenshot: Access control panel]"
          },
          {
            number: 5,
            title: "Performance Optimization",
            description: "Configure QoS (Quality of Service) settings, bandwidth allocation priorities, and network traffic shaping rules to optimize performance.",
            screenshot: "[Screenshot: Performance settings panel]"
          },
          {
            number: 6,
            title: "Save and Apply",
            description: "Review all configuration changes and click 'Save & Apply'. Changes may take 5-10 minutes to propagate across the network infrastructure.",
            screenshot: "[Screenshot: Save confirmation dialog]"
          }
        ]
      },
      {
        type: "tips",
        title: "Configuration Best Practices",
        items: [
          "Align device limits with user type: power users (3-5 devices), guests (1-2 devices)",
          "Use daily data cycles for temporary access, monthly for permanent users",
          "Enable automatic check-out for temporary users to free licenses automatically",
          "Configure appropriate speed tiers based on expected usage patterns",
          "Set license capacity alerts at 80% to avoid hitting limits unexpectedly",
          "Review network utilization monthly and adjust policies accordingly"
        ]
      },
      {
        type: "section",
        title: "Advanced Features",
        items: [
          {
            name: "Automatic User Lifecycle Management",
            description: "Automatically activate users on check-in date and block on check-out date. Frees licenses automatically for reuse. Ideal for temporary access scenarios.",
            screenshot: "[Screenshot: Automatic lifecycle toggle in settings]"
          },
          {
            name: "Device Type Filtering",
            description: "Create rules to allow/restrict device types based on policies. Control IoT device proliferation while ensuring user productivity with personal devices.",
            screenshot: "[Screenshot: Device type filter rules configuration]"
          },
          {
            name: "Policy Templates",
            description: "Pre-configured policy sets (Basic, Standard, Premium, Guest) that can be applied quickly. Customize templates to match your organization's needs.",
            screenshot: "[Screenshot: Policy template selection dropdown]"
          },
          {
            name: "License Capacity Management",
            description: "Monitor license utilization in real-time. Set automated alerts for threshold warnings. Plan capacity upgrades based on usage trends and growth forecasts.",
            screenshot: "[Screenshot: License capacity dashboard with alerts]"
          }
        ]
      }
    ]
  },

  "bulk-user-import": {
    title: "Bulk User Import",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to import multiple users at once using CSV files or direct Excel paste, saving time when onboarding large groups of users."
      },
      {
        type: "steps",
        title: "Using CSV File Upload",
        steps: [
          {
            number: 1,
            title: "Click Bulk Import Button",
            description: "Navigate to User Management and click the 'Bulk Import' button in the toolbar (green button with upload icon).",
            screenshot: "[Screenshot: Bulk Import button highlighted in toolbar]"
          },
          {
            number: 2,
            title: "Download Template",
            description: "In the bulk import modal, click 'Download Template' to get a CSV file with the correct format and sample data.",
            screenshot: "[Screenshot: Download Template button in modal]"
          },
          {
            number: 3,
            title: "Fill CSV File",
            description: "Open the template in Excel or any spreadsheet software and fill in user data:\n• username (required): Unique user identifier\n• email (required): Valid email address\n• fullName (required): User's full name\n• phone: Contact number in E.164 format\n• policy (required): Standard Access, Premium Access, Basic Access, or Guest Access\n• status: active, inactive, or suspended\n• segment: Business segment\n• department: User's department\n• notes: Additional information",
            screenshot: "[Screenshot: CSV file open in Excel with sample data]"
          },
          {
            number: 4,
            title: "Upload File",
            description: "Click 'Select CSV File' in the modal and choose your completed CSV file. The system will load the file for validation.",
            screenshot: "[Screenshot: File selected, showing filename]"
          },
          {
            number: 5,
            title: "Validate Data",
            description: "Click 'Validate File' to check your data. The system will:\n• Verify required fields are present\n• Check username format (3-50 chars, alphanumeric)\n• Validate email addresses\n• Verify policy names match available policies\n• Check phone number format\n• Ensure no duplicate usernames",
            screenshot: "[Screenshot: Validation results showing valid and error counts]"
          },
          {
            number: 6,
            title: "Review Errors (if any)",
            description: "If validation finds errors, review the detailed error list showing:\n• Row number with the error\n• Specific fields that failed validation\n• Clear error messages\n\nFix errors in your CSV file and re-upload.",
            screenshot: "[Screenshot: Error details panel with specific row errors]"
          },
          {
            number: 7,
            title: "Import Users",
            description: "Once validation passes (0 errors), click 'Import X Users' to add them to the system. A success notification will confirm the import.",
            screenshot: "[Screenshot: Success notification showing imported user count]"
          }
        ]
      },
      {
        type: "steps",
        title: "Using Excel Paste Method",
        steps: [
          {
            number: 1,
            title: "Prepare Data in Excel",
            description: "Create or open an Excel spreadsheet with user data. Ensure the first row contains headers matching the template format.",
            screenshot: "[Screenshot: Excel spreadsheet with headers and data]"
          },
          {
            number: 2,
            title: "Copy Data",
            description: "Select all data including headers, then copy (Ctrl+C or Cmd+C).",
            screenshot: "[Screenshot: Selected data in Excel ready to copy]"
          },
          {
            number: 3,
            title: "Open Bulk Import Modal",
            description: "Click 'Bulk Import' button in User Management toolbar.",
            screenshot: "[Screenshot: Bulk Import button highlighted]"
          },
          {
            number: 4,
            title: "Switch to Paste Tab",
            description: "Click the 'Paste from Excel' tab in the modal.",
            screenshot: "[Screenshot: Paste from Excel tab selected]"
          },
          {
            number: 5,
            title: "Paste Data",
            description: "Click in the text area and paste your data (Ctrl+V or Cmd+V).",
            screenshot: "[Screenshot: Pasted data visible in textarea]"
          },
          {
            number: 6,
            title: "Validate and Import",
            description: "Click 'Validate Data', review results, and if valid, click 'Import X Users'.",
            screenshot: "[Screenshot: Validation success and import button]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Limits",
        items: [
          {
            name: "Enterprise",
            description: "Maximum 1000 users per bulk import"
          },
          {
            name: "Hotel",
            description: "Maximum 2000 users per bulk import (high guest turnover)"
          },
          {
            name: "Coworking",
            description: "Maximum 800 users per bulk import"
          },
          {
            name: "Co-Living",
            description: "Maximum 500 users per bulk import"
          },
          {
            name: "PG",
            description: "Maximum 300 users per bulk import"
          },
          {
            name: "Miscellaneous",
            description: "Maximum 500 users per bulk import"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Keep your CSV file under the segment's maximum user limit",
          "Test with a small batch first (5-10 users) to verify format",
          "Use the downloaded template to ensure correct column order",
          "Usernames must be unique across the entire system",
          "Policy names are case-sensitive - match exactly",
          "Phone numbers should be in E.164 format: +1234567890",
          "Excel paste method is faster for one-time imports"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Username validation error",
            solution: "Usernames must be 3-50 characters, containing only letters, numbers, dots, underscores, and hyphens"
          },
          {
            issue: "Invalid email format",
            solution: "Ensure emails follow standard format: user@domain.com"
          },
          {
            issue: "Policy not found",
            solution: "Policy must be exactly: 'Standard Access', 'Premium Access', 'Basic Access', or 'Guest Access'"
          },
          {
            issue: "Exceeds maximum limit",
            solution: "Split your import into smaller batches within your segment's limit"
          },
          {
            issue: "Duplicate username",
            solution: "Check for duplicate usernames in your CSV or against existing users"
          }
        ]
      }
    ]
  },

  "bulk-device-import-human": {
    title: "Bulk Import Human Devices",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Import multiple human devices (laptops, smartphones, tablets) at once for quick device provisioning across your organization."
      },
      {
        type: "steps",
        title: "Bulk Import Process",
        steps: [
          {
            number: 1,
            title: "Navigate to Device Management",
            description: "Click 'Devices' in the sidebar to access the Device Management page.",
            screenshot: "[Screenshot: Devices menu in sidebar]"
          },
          {
            number: 2,
            title: "Click Bulk Import Human",
            description: "In the toolbar, click the 'Bulk Import Human' button (green button with upload icon). Note: This button only appears in Enterprise, Hotel, and Miscellaneous segments.",
            screenshot: "[Screenshot: Bulk Import Human button highlighted]"
          },
          {
            number: 3,
            title: "Download Template",
            description: "Click 'Download Template' to get the human device CSV format with sample data.",
            screenshot: "[Screenshot: Template download button in modal]"
          },
          {
            number: 4,
            title: "Fill Device Data",
            description: "Complete the CSV with device information:\n• assignedUserId (required): User ID who owns the device\n• fullName (required): Owner's full name\n• email: Owner's email address\n• phone: Owner's phone number\n• deviceType (required): laptop, smartphone, or tablet\n• priority: high, medium, or low\n• notes: Device description or notes",
            screenshot: "[Screenshot: Human device CSV template with data]"
          },
          {
            number: 5,
            title: "Upload and Validate",
            description: "Upload your CSV file, then click 'Validate File' to check for errors. The system validates:\n• Device type is laptop/smartphone/tablet\n• Priority is high/medium/low\n• Required fields are present\n• User IDs exist in the system",
            screenshot: "[Screenshot: Validation results for human devices]"
          },
          {
            number: 6,
            title: "Import Devices",
            description: "After successful validation, click 'Import X Devices'. MAC addresses and IP addresses will be auto-generated for human devices.",
            screenshot: "[Screenshot: Success notification for device import]"
          }
        ]
      },
      {
        type: "section",
        title: "Device Types",
        items: [
          {
            name: "Laptop",
            description: "Corporate or personal laptops assigned to users. Typically given high priority for business-critical work.",
            screenshot: "[Screenshot: Laptop icon in device list]"
          },
          {
            name: "Smartphone",
            description: "Mobile phones used for work or personal use. Can have medium or high priority depending on role.",
            screenshot: "[Screenshot: Smartphone icon in device list]"
          },
          {
            name: "Tablet",
            description: "Tablets and iPads used for mobile productivity. Often medium priority unless business-critical.",
            screenshot: "[Screenshot: Tablet icon in device list]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Availability",
        items: [
          {
            name: "Enterprise",
            description: "✅ Available - Maximum 2000 devices per import",
            screenshot: "[Screenshot: Bulk Import Human button in Enterprise segment]"
          },
          {
            name: "Hotel",
            description: "✅ Available - Maximum 3000 devices per import",
            screenshot: "[Screenshot: Bulk Import Human button in Hotel segment]"
          },
          {
            name: "Miscellaneous",
            description: "✅ Available - Maximum 1000 devices per import",
            screenshot: "[Screenshot: Bulk Import Human button in Miscellaneous segment]"
          },
          {
            name: "Co-Living, Coworking, PG",
            description: "❌ Not Available - Human devices not supported in these segments"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "High priority devices get bandwidth preference during congestion",
          "MAC addresses are auto-generated - no need to provide them",
          "Assign devices to existing user IDs only",
          "Use descriptive notes to identify company vs personal devices",
          "Batch similar device types together for easier management"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "User ID not found",
            solution: "Ensure the assignedUserId matches an existing user in the system. Import users first if needed."
          },
          {
            issue: "Invalid device type",
            solution: "Device type must be exactly: 'laptop', 'smartphone', or 'tablet' (lowercase)"
          },
          {
            issue: "Feature not available",
            solution: "Human device imports are only available in Enterprise, Hotel, and Miscellaneous segments"
          }
        ]
      }
    ]
  },

  "bulk-device-import-other": {
    title: "Bulk Import Other Devices",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Import IoT devices, printers, cameras, sensors, and other network devices in bulk for efficient infrastructure management."
      },
      {
        type: "steps",
        title: "Bulk Import Process",
        steps: [
          {
            number: 1,
            title: "Navigate to Device Management",
            description: "Click 'Devices' in the sidebar navigation menu.",
            screenshot: "[Screenshot: Devices menu highlighted in sidebar]"
          },
          {
            number: 2,
            title: "Click Bulk Import Other",
            description: "Click the 'Bulk Import Other' button in the toolbar (green button). Available in all segments except Miscellaneous.",
            screenshot: "[Screenshot: Bulk Import Other button highlighted]"
          },
          {
            number: 3,
            title: "Download Template",
            description: "Click 'Download Template' to get the other devices CSV format.",
            screenshot: "[Screenshot: Download template button]"
          },
          {
            number: 4,
            title: "Fill Device Information",
            description: "Complete the CSV with device details:\n• deviceName (required): Descriptive name for the device\n• macAddress (required): MAC address in XX:XX:XX:XX:XX:XX format\n• deviceType (required): iot, printer, camera, sensor, access-point, or other\n• manufacturer: Device manufacturer/brand\n• location: Physical location of device\n• assignedTo: Department or person responsible\n• status: active, inactive, or maintenance\n• notes: Additional information",
            screenshot: "[Screenshot: Other devices CSV template with IoT data]"
          },
          {
            number: 5,
            title: "Validate Data",
            description: "Upload and click 'Validate File'. The system checks:\n• MAC address format (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)\n• Device type is from allowed list\n• Status is active/inactive/maintenance\n• Required fields are present\n• No duplicate MAC addresses",
            screenshot: "[Screenshot: Validation results for other devices]"
          },
          {
            number: 6,
            title: "Import Devices",
            description: "After validation passes, click 'Import X Devices' to add them to your network. Devices will be assigned IP addresses automatically.",
            screenshot: "[Screenshot: Success notification for other devices import]"
          }
        ]
      },
      {
        type: "section",
        title: "Device Types",
        items: [
          {
            name: "IoT Devices",
            description: "Smart sensors, controllers, and connected devices. Examples: temperature sensors, smart locks, environmental monitors.",
            screenshot: "[Screenshot: IoT device in device list]"
          },
          {
            name: "Printers",
            description: "Network printers and multi-function devices. Track usage and manage printer fleet centrally.",
            screenshot: "[Screenshot: Printer device in device list]"
          },
          {
            name: "Cameras",
            description: "IP cameras and security surveillance devices. Monitor connectivity and bandwidth usage.",
            screenshot: "[Screenshot: Camera device in device list]"
          },
          {
            name: "Sensors",
            description: "Environmental, motion, and specialized sensors. Often low bandwidth but require reliable connectivity.",
            screenshot: "[Screenshot: Sensor device in device list]"
          },
          {
            name: "Access Points",
            description: "WiFi access points and network infrastructure. Critical devices that need priority treatment.",
            screenshot: "[Screenshot: Access point device in device list]"
          },
          {
            name: "Other",
            description: "Any other network devices not covered by above categories. Use descriptive names for identification.",
            screenshot: "[Screenshot: Other device in device list]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Limits",
        items: [
          {
            name: "Enterprise",
            description: "Maximum 2000 devices per import"
          },
          {
            name: "Hotel",
            description: "Maximum 3000 devices per import"
          },
          {
            name: "Coworking",
            description: "Maximum 1500 devices per import"
          },
          {
            name: "Co-Living",
            description: "Maximum 1000 devices per import"
          },
          {
            name: "PG",
            description: "Maximum 600 devices per import"
          },
          {
            name: "Miscellaneous",
            description: "❌ Not Available - Other devices not supported"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Use manufacturer's MAC address labels for accuracy",
          "Group devices by location for easier management",
          "Set critical infrastructure to 'active' status",
          "Use 'maintenance' status for devices being serviced",
          "Include location details for quick physical identification",
          "Use consistent naming conventions (e.g., Floor-Room-DeviceType)",
          "Access points should be marked as high priority in policy"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Invalid MAC address format",
            solution: "MAC address must be in format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX. Use uppercase letters A-F for hex digits."
          },
          {
            issue: "Duplicate MAC address",
            solution: "Each MAC address must be unique. Check for duplicates in your CSV or against existing devices."
          },
          {
            issue: "Invalid device type",
            solution: "Device type must be exactly one of: iot, printer, camera, sensor, access-point, or other (lowercase)"
          },
          {
            issue: "Exceeds segment limit",
            solution: "Split your import into multiple smaller batches within your segment's maximum limit"
          }
        ]
      }
    ]
  }
};

export const getArticle = (articleId) => {
  return knowledgeArticles[articleId] || null;
};

export const getArticlesByCategory = (category) => {
  return Object.entries(knowledgeArticles)
    .filter(([, article]) => article.category === category)
    .map(([id, article]) => ({ id, ...article }));
};

export default knowledgeArticles;
