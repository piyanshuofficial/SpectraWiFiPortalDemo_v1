// src/constants/knowledgeArticles.js

export const knowledgeArticles = {
  "adding-new-users": {
    title: "Adding New Users",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to create new user accounts in the portal with proper policy assignments and segment configurations."
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
            title: "Select Segment",
            description: "Use the Segment Selector in the header to choose the appropriate segment (Enterprise, Co-Living, Hotel, Co-Working, PG, or Miscellaneous) for the new user.",
            screenshot: "[Screenshot: Segment selector dropdown]"
          },
          {
            number: 3,
            title: "Click Add User Button",
            description: "Click the 'Add User' button in the toolbar at the top of the user list.",
            screenshot: "[Screenshot: Add User button highlighted]"
          },
          {
            number: 4,
            title: "Fill User Details",
            description: "In the Add User modal, enter the following required information:\n• User ID (unique identifier)\n• First Name\n• Last Name\n• Mobile Number (10 digits)\n• Email Address\n• Location",
            screenshot: "[Screenshot: Add User form with fields highlighted]"
          },
          {
            number: 5,
            title: "Assign User Policy",
            description: "Select an appropriate policy that defines:\n• Speed Limit (10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps)\n• Data Volume (10 GB, 20 GB, 50 GB, 100 GB, Unlimited)\n• Device Limit (1-5 devices)\n• Data Cycle Type (Daily, Monthly)",
            screenshot: "[Screenshot: Policy selection dropdown]"
          },
          {
            number: 6,
            title: "Set Check-In/Check-Out Dates",
            description: "For segments like Hotel, Co-Living, or PG, specify check-in and check-out dates to automatically manage user access periods.",
            screenshot: "[Screenshot: Date picker fields]"
          },
          {
            number: 7,
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
            description: "Controls maximum bandwidth per user. Options: 10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps. Enterprise users typically get higher speeds."
          },
          {
            name: "Data Volume",
            description: "Monthly or daily data cap per user. Options: 10 GB, 20 GB, 50 GB, 100 GB, Unlimited. Guest users often have limited data."
          },
          {
            name: "Device Limit",
            description: "Maximum number of devices a user can connect simultaneously. Ranges from 1 to 5 devices based on segment requirements."
          },
          {
            name: "Data Cycle Type",
            description: "Defines when data caps reset. Daily cycle resets at midnight, Monthly cycle resets on the 1st of each month."
          }
        ]
      },
      {
        type: "section",
        title: "License Management",
        items: [
          {
            name: "License Types by Segment",
            description: "Enterprise: Premium, Standard, Basic, Guest\nCo-Living: Standard, Basic, Guest\nHotel: Premium, Standard, Guest (mostly Guest)\nCo-Working: Premium, Standard, Basic\nPG: Standard, Basic, Guest\nMiscellaneous: Basic, Guest"
          },
          {
            name: "License Allocation",
            description: "Each segment has dedicated license pools:\n• Enterprise: 1000 licenses\n• Hotel: 500 licenses\n• Co-Living: 400 licenses\n• Co-Working: 350 licenses\n• PG: 250 licenses\n• Miscellaneous: 150 licenses"
          },
          {
            name: "Monitoring Usage",
            description: "The license ring on the User Management page shows current usage vs. total available for the selected segment. Color codes: Green (0-70%), Yellow (71-85%), Red (86-100%)"
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
            title: "Select Segment",
            description: "Choose the segment where the device will be registered. Note: Some segments have device registration restrictions.",
            screenshot: "[Screenshot: Segment selector]"
          },
          {
            number: 3,
            title: "Click Register Device",
            description: "Click the 'Register Device' button in the toolbar",
            screenshot: "[Screenshot: Register Device button]"
          },
          {
            number: 4,
            title: "Enter MAC Address",
            description: "Input the device MAC address in format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX. The system will validate format and check for duplicates.",
            screenshot: "[Screenshot: MAC address field]"
          },
          {
            number: 5,
            title: "Choose Device Type",
            description: "Select device category:\n• Human Devices: Laptop, Mobile, Tablet\n• Non-Human Devices: IoT, Printer, Camera, Smart TV, Gaming Console",
            screenshot: "[Screenshot: Device type dropdown]"
          },
          {
            number: 6,
            title: "Select Registration Mode",
            description: "Choose how to register:\n• Bind to Existing User: Links device to a user account\n• Create as Device User: Creates standalone device account (for IoT devices)",
            screenshot: "[Screenshot: Registration mode selection]"
          },
          {
            number: 7,
            title: "Provide Device Name",
            description: "Enter a friendly name for identification (e.g., 'John's Laptop', 'Conference Room Printer')",
            screenshot: "[Screenshot: Device name field]"
          },
          {
            number: 8,
            title: "Submit Registration",
            description: "Click Submit to register the device. The system will validate and activate it immediately.",
            screenshot: "[Screenshot: Success confirmation]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Device Availability",
        items: [
          {
            name: "Enterprise",
            description: "✓ Human devices ✓ Non-human devices - Full device support"
          },
          {
            name: "Co-Living",
            description: "✓ Human devices ✓ Non-human devices - Supports both types"
          },
          {
            name: "Hotel",
            description: "✓ Human devices only - Non-human devices not allowed"
          },
          {
            name: "Co-Working",
            description: "✓ Human devices ✓ Non-human devices - Full support"
          },
          {
            name: "PG",
            description: "✓ Human devices only - No non-human devices"
          },
          {
            name: "Miscellaneous",
            description: "✓ Human devices ✓ Non-human devices - Full support"
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
            description: "Shows current number of active users in the selected segment. Green arrow indicates growth, red arrow indicates decline."
          },
          {
            name: "License Usage",
            description: "Displays percentage of licenses used for the selected segment. Monitor this to avoid hitting capacity limits."
          },
          {
            name: "Data Usage",
            description: "Total data consumed this week across all users in the segment, measured in TB (Terabytes)."
          },
          {
            name: "Alerts",
            description: "Count of current system alerts. Click to view details. Green badge means no critical alerts."
          }
        ]
      },
      {
        type: "section",
        title: "Network Analytics Charts",
        items: [
          {
            name: "Network Usage (Line Chart)",
            description: "Daily network usage in GB over the last 90 days. Use this to identify trends and plan capacity. Hover over points for exact values. Export to CSV or PDF for reporting."
          },
          {
            name: "License Usage by Type (Bar Chart)",
            description: "Shows distribution of license types (Premium, Standard, Basic, Guest) in the current segment. Helps optimize license allocation."
          },
          {
            name: "Alerts Summary (Pie Chart)",
            description: "Breakdown of alerts by severity: Critical (red), Warning (orange), Info (green). Click segments for detailed alert list."
          }
        ]
      },
      {
        type: "section",
        title: "Segment Filtering",
        items: [
          {
            name: "How It Works",
            description: "Use the Segment Selector in the header to switch between segments. All dashboard data updates immediately to show segment-specific metrics, charts, and statistics."
          },
          {
            name: "Segment Characteristics",
            description: "Enterprise: Highest usage and capacity\nHotel: Guest-heavy with high turnover\nCo-Living: Residential patterns\nCo-Working: Business hours peaks\nPG: Budget-conscious limits\nMiscellaneous: Mixed use cases"
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
        ]
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
            description: "Set filters based on report type:\n• Date Range: Start and end dates\n• Month Range: For monthly reports\n• Policy Filter: Specific user policies\n• Segment Filter: Target segment\n• User Filter: Specific user ID",
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
            description: "Monitor daily/monthly network usage trends across segments for capacity planning."
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
          "Apply segment filters to focus on specific user groups",
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
            solution: "Troubleshoot:\n1. MAC address correctly registered\n2. Device limit not exceeded\n3. Device category allowed for segment\n4. MAC format valid\n5. No duplicate MAC entries"
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
            description: "Fill the CSV template with user information:\n• User ID (unique)\n• First Name, Last Name\n• Mobile Number\n• Email Address\n• Policy Name\n• Segment Type\n• Location\n• Check-In/Check-Out dates (if applicable)",
            screenshot: "[Screenshot: Sample CSV file with data]"
          },
          {
            number: 3,
            title: "Select Target Segment",
            description: "Use the Segment Selector to choose which segment these users belong to (Enterprise, Co-Living, Hotel, etc.).",
            screenshot: "[Screenshot: Segment selector highlighted]"
          },
          {
            number: 4,
            title: "Upload CSV File",
            description: "Click 'Import Users' button, select your prepared CSV file, and click Upload. The system will validate the data format.",
            screenshot: "[Screenshot: Import Users dialog with file selector]"
          },
          {
            number: 5,
            title: "Review Validation Results",
            description: "Check the validation report for any errors or warnings. Fix issues in the CSV and re-upload if needed.",
            screenshot: "[Screenshot: Validation results showing success/error counts]"
          },
          {
            number: 6,
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
            description: "Export users visible in the current filtered view with applied search and status filters."
          },
          {
            name: "Export All Users",
            description: "Export complete user database for the selected segment including all statuses and policies."
          },
          {
            name: "Export with Custom Columns",
            description: "Select specific columns to include in the export (User ID, Name, Policy, Status, Usage Stats, etc.)."
          },
          {
            name: "Export Date Range",
            description: "Export users created or modified within a specific date range for audit and compliance purposes."
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
            description: "User can authenticate and access network resources according to their policy. Data usage is tracked and licenses are consumed."
          },
          {
            name: "Suspended Status",
            description: "Temporary suspension - user cannot access network but account remains in system. Useful for temporary holds or payment issues. License is still consumed."
          },
          {
            name: "Blocked Status",
            description: "Permanent block - user cannot access network. Use for policy violations or account termination. License is freed for reuse."
          },
          {
            name: "Expired Status",
            description: "Automatically set when check-out date passes (for Hotel, PG, Co-Living segments). User access is automatically disabled."
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
        text: "Learn how to create and manage user policies that define network access parameters including speed limits, data volumes, device limits, and data cycle configurations for different user segments."
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
            description: "Set maximum number of devices per user (1-5 devices). Human and non-human devices may have separate limits based on segment.",
            screenshot: "[Screenshot: Device limit slider]"
          },
          {
            number: 7,
            title: "Select Data Cycle Type",
            description: "Choose how data allowance resets:\n• Daily (resets every 24 hours)\n• Monthly (resets on 1st of each month)\n• Custom (specify cycle length)",
            screenshot: "[Screenshot: Data cycle type options]"
          },
          {
            number: 8,
            title: "Assign to Segments",
            description: "Select which segments can use this policy (Enterprise, Co-Living, Hotel, etc.). Policies can be segment-specific or global.",
            screenshot: "[Screenshot: Segment assignment checkboxes]"
          }
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
            description: "Maximum devices a single user can register. Enterprise typically allows 3-5 devices, while Hotel/PG may limit to 1-2 devices."
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
          "Use descriptive names that indicate segment and speed (e.g., Enterprise_Premium_50Mbps)",
          "Set realistic data volumes based on typical usage patterns",
          "Consider separate policies for different user types within same segment",
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
            solution: "Verify the policy is enabled for the user's segment. Check that policy is not marked as deprecated or inactive. Ensure you have admin permissions to assign policies."
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
    title: "Segment Configuration",
    category: "Network Configuration",
    content: [
      {
        type: "intro",
        text: "Learn how to configure segment-specific settings for Enterprise, Co-Living, Co-Working, Hotel, PG (Paying Guest), and Miscellaneous user types to optimize network management for different business scenarios."
      },
      {
        type: "section",
        title: "Segment Types Overview",
        items: [
          {
            name: "Enterprise",
            description: "For corporate offices and business environments. Typically allows 3-5 devices per user, longer-term access, higher data volumes, and premium speed tiers. Focus on productivity and reliability."
          },
          {
            name: "Co-Living",
            description: "For shared living spaces and residential communities. Medium-term users (months), 2-3 devices per user, moderate data volumes. Balance between residential and managed access."
          },
          {
            name: "Co-Working",
            description: "For shared workspaces and flexible offices. Daily/monthly access patterns, 2-4 devices per user, high-speed requirements for productivity. Professional-grade connectivity."
          },
          {
            name: "Hotel",
            description: "For hospitality and short-term guests. Automatic check-in/check-out based on dates, 1-2 devices per guest, daily data cycles. Focus on ease of access and guest experience."
          },
          {
            name: "PG (Paying Guest)",
            description: "For student housing and budget accommodations. Monthly cycles, 1-2 devices per resident, budget-friendly speed/data tiers. Cost-effective managed access."
          },
          {
            name: "Miscellaneous",
            description: "For special cases, vendors, contractors, and temporary access. Flexible configuration, typically limited devices and data volumes. Short-term access with basic connectivity."
          }
        ]
      },
      {
        type: "steps",
        title: "Configuring Segment Settings",
        steps: [
          {
            number: 1,
            title: "Access Segment Configuration",
            description: "Navigate to Configuration → Segment Settings in the sidebar to view all segment configurations.",
            screenshot: "[Screenshot: Segment Settings page]"
          },
          {
            number: 2,
            title: "Select Segment to Configure",
            description: "Click on the segment card you want to configure (Enterprise, Co-Living, Hotel, etc.) to open detailed settings.",
            screenshot: "[Screenshot: Segment cards layout]"
          },
          {
            number: 3,
            title: "Set Default Device Limits",
            description: "Configure default device limits for this segment:\n• Human devices (laptops, phones)\n• Non-human devices (IoT, smart TVs)\n• Total devices per user",
            screenshot: "[Screenshot: Device limit configuration panel]"
          },
          {
            number: 4,
            title: "Configure Available Policies",
            description: "Select which policies are available for users in this segment. You can enable/disable policies and set default policy.",
            screenshot: "[Screenshot: Policy availability checklist]"
          },
          {
            number: 5,
            title: "Set Date Range Requirements",
            description: "For Hotel, PG, and Co-Living segments, configure whether check-in/check-out dates are required or optional.",
            screenshot: "[Screenshot: Date range configuration toggle]"
          },
          {
            number: 6,
            title: "Configure Billing Options",
            description: "Set billing cycle, payment requirements, and auto-renewal settings specific to this segment type.",
            screenshot: "[Screenshot: Billing configuration panel]"
          }
        ]
      },
      {
        type: "tips",
        title: "Segment Optimization Tips",
        items: [
          "Align device limits with segment use case (Hotel: 1-2, Enterprise: 3-5)",
          "Use daily data cycles for Hotel, monthly for Enterprise and Co-Living",
          "Enable strict check-in/check-out for Hotel segment to auto-manage access",
          "Configure higher speed tiers for Enterprise and Co-Working segments",
          "Set appropriate license allocation per segment based on capacity",
          "Review segment utilization monthly and adjust limits accordingly"
        ]
      },
      {
        type: "section",
        title: "Segment-Specific Features",
        items: [
          {
            name: "Auto Check-In/Out (Hotel)",
            description: "Automatically activate users on check-in date and block on check-out date. Frees licenses automatically for new guests."
          },
          {
            name: "Device Type Restrictions",
            description: "Limit non-human devices (smart TVs, IoT) in Hotel/PG segments while allowing more flexibility in Enterprise segment."
          },
          {
            name: "Policy Templates",
            description: "Pre-configured policy sets optimized for each segment type that can be applied with one click."
          },
          {
            name: "License Pools",
            description: "Allocate dedicated license pools per segment to prevent one segment from consuming all available licenses."
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
