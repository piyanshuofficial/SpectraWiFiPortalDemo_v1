// src/constants/knowledgeArticles.js
// Comprehensive Knowledge Center articles for Customer Portal
// Updated to reflect current portal implementation including roles, permissions, and all features

export const knowledgeArticles = {
  // ============================================
  // USER MANAGEMENT ARTICLES
  // ============================================

  "adding-new-users": {
    title: "Adding New Users",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Learn how to create new user accounts in the portal with proper policy assignments and access configurations. This guide covers the complete user creation workflow for Administrators and Managers."
      },
      {
        type: "section",
        title: "Who Can Add Users",
        items: [
          {
            name: "Administrator",
            description: "Full access to create users at site level or across all sites (company level). Can assign any policy and set all user parameters."
          },
          {
            name: "Manager",
            description: "Can create users within their assigned scope. May have restrictions on certain policy types based on organizational settings."
          },
          {
            name: "User Role",
            description: "Standard users cannot create new user accounts. This requires Manager or Administrator privileges."
          }
        ]
      },
      {
        type: "steps",
        title: "Step-by-Step Guide",
        steps: [
          {
            number: 1,
            title: "Navigate to User Management",
            description: "Click on 'User Management' in the left sidebar navigation menu to access the User Management page. You'll see the user list with search, filter, and action options.",
            screenshot: "[Screenshot: Sidebar with Users menu highlighted]"
          },
          {
            number: 2,
            title: "Click Add User Button",
            description: "Click the 'Add User' button (blue button with + icon) in the toolbar at the top of the user list. This opens the Add User modal dialog.",
            screenshot: "[Screenshot: Add User button highlighted in toolbar]"
          },
          {
            number: 3,
            title: "Fill User Details",
            description: "In the Add User modal, enter the following required information:\n• User ID (unique identifier - cannot be changed after creation)\n• First Name and Last Name\n• Mobile Number (10 digits, used for credential delivery)\n• Email Address (used for notifications and password reset)\n• Location/Department (for organizational tracking)",
            screenshot: "[Screenshot: Add User form with fields highlighted]"
          },
          {
            number: 4,
            title: "Assign User Policy",
            description: "Select an appropriate policy that defines the user's network access parameters:\n• Speed Limit: 10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps, or Unlimited\n• Data Volume: 10 GB, 20 GB, 50 GB, 100 GB, or Unlimited\n• Device Limit: 1-5 simultaneous devices\n• Data Cycle Type: Daily (resets at midnight) or Monthly (resets on 1st)",
            screenshot: "[Screenshot: Policy selection dropdown with options]"
          },
          {
            number: 5,
            title: "Set Check-In/Check-Out Dates (Conditional)",
            description: "For temporary users or hospitality segments:\n• Check-In Date: When user access begins (can be future date)\n• Check-Out Date: When user access automatically expires\n• These dates control automatic account lifecycle management\n• Leave blank for permanent users",
            screenshot: "[Screenshot: Date picker fields for check-in/out]"
          },
          {
            number: 6,
            title: "Review License Availability",
            description: "Before submitting, check the license indicator:\n• Green: Sufficient licenses available\n• Yellow: Near capacity (71-85% used)\n• Red: At or near limit (86-100%)\nThe system will prevent user creation if no licenses are available.",
            screenshot: "[Screenshot: License availability indicator]"
          },
          {
            number: 7,
            title: "Submit and Confirm",
            description: "Click 'Submit' to create the user. The system will:\n• Validate all fields for correctness\n• Check license availability\n• Provision the account in the network\n• Generate initial credentials\n• Display a success notification with user details",
            screenshot: "[Screenshot: Success notification with credentials]"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Check license availability before adding users - the license ring shows current usage vs. total capacity",
          "User IDs cannot be changed after creation, so establish a naming convention (e.g., employee ID, email prefix)",
          "Mobile numbers and emails are used for credential delivery - verify accuracy before submitting",
          "Users are automatically set to 'Active' status upon creation and can authenticate immediately",
          "For bulk user creation (10+ users), use the CSV Import feature instead for efficiency",
          "Set appropriate check-out dates for temporary access to automatically free up licenses"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "License limit reached - cannot create user",
            solution: "Free up licenses by blocking unused users, removing expired accounts, or request additional licenses from your Spectra account manager. Use the Reports > License Usage report to identify inactive users."
          },
          {
            issue: "Duplicate User ID error",
            solution: "User IDs must be unique across the entire portal (all sites). Choose a different ID or check if the user already exists using the search function."
          },
          {
            issue: "Invalid mobile number format",
            solution: "Ensure the mobile number is exactly 10 digits without country code, spaces, dashes, or special characters. Example: 9876543210"
          },
          {
            issue: "Email validation failed",
            solution: "Verify the email address follows standard format (user@domain.com). Check for typos, extra spaces, or invalid characters."
          },
          {
            issue: "Policy not available for selection",
            solution: "Some policies may be restricted based on your role or site configuration. Contact your Administrator if you need access to additional policies."
          }
        ]
      }
    ]
  },

  "user-policies-licenses": {
    title: "User Policies & License Management",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Understand how to configure user policies, manage bandwidth limits, device allowances, and monitor license utilization across your organization. Effective policy and license management ensures optimal network performance and cost efficiency."
      },
      {
        type: "section",
        title: "Policy Components Explained",
        items: [
          {
            name: "Speed Limit (Bandwidth)",
            description: "Controls maximum download/upload bandwidth per user. Available tiers:\n• 10 Mbps - Basic tier for light browsing and email\n• 20 Mbps - Standard tier for general productivity\n• 30 Mbps - Enhanced tier for video calls and streaming\n• 50 Mbps - Premium tier for power users and media work\n• Unlimited - No bandwidth cap (use with caution)\n\nSpeed limits help balance network load and provide tiered service levels.",
            screenshot: "[Screenshot: Speed limit dropdown options in policy form]"
          },
          {
            name: "Data Volume (Data Cap)",
            description: "Total data transfer allowed per cycle before throttling or blocking. Options:\n• 10 GB - Light usage tier\n• 20 GB - Moderate usage tier\n• 50 GB - Standard professional tier\n• 100 GB - Heavy usage tier\n• Unlimited - No data cap\n\nWhen data cap is reached, users may be throttled to lower speeds or blocked based on policy configuration.",
            screenshot: "[Screenshot: Data volume selection options]"
          },
          {
            name: "Device Limit",
            description: "Maximum number of devices a user can connect simultaneously. Ranges from 1 to 5 devices:\n• 1 device - Restrictive, single device access\n• 2 devices - Phone + laptop typical setup\n• 3 devices - Standard professional allowance\n• 5 devices - Power user with multiple devices\n\nExceeding device limit blocks new connections until existing devices disconnect.",
            screenshot: "[Screenshot: Device limit selector showing 1-5 options]"
          },
          {
            name: "Data Cycle Type",
            description: "Defines when data allowances reset:\n• Daily Cycle - Resets every 24 hours at midnight local time. Ideal for guest/temporary users, hotels, and high-turnover environments.\n• Monthly Cycle - Resets on the 1st of each month. Suitable for permanent employees and long-term residents.\n\nChoose based on user type and expected usage patterns.",
            screenshot: "[Screenshot: Data cycle type options - Daily/Monthly]"
          }
        ]
      },
      {
        type: "section",
        title: "License Management",
        items: [
          {
            name: "Understanding License Types",
            description: "Your organization's license pool determines how many concurrent users can be active:\n• Premium Licenses - High-speed access, unlimited/high data caps, priority support\n• Standard Licenses - Moderate speed and data for regular users\n• Basic Licenses - Economical tier with essential connectivity\n• Guest Licenses - Temporary access with limited duration and data\n\nEach active user consumes one license from your pool.",
            screenshot: "[Screenshot: License type distribution chart on dashboard]"
          },
          {
            name: "License Capacity Monitoring",
            description: "Monitor license utilization to ensure availability:\n• Total Capacity - Maximum users allowed under your contract\n• Active Users - Currently provisioned and active accounts\n• Available - Remaining licenses for new users\n• Utilization % - Current usage as percentage of total\n\nSet alerts at 80% utilization to plan capacity increases proactively.",
            screenshot: "[Screenshot: License capacity indicator showing utilization]"
          },
          {
            name: "License Ring Indicator",
            description: "The license ring provides visual status on the User Management page:\n• Green (0-70%) - Healthy capacity, room for growth\n• Yellow (71-85%) - Approaching capacity, plan ahead\n• Red (86-100%) - Near or at limit, immediate action needed\n\nClick the ring to see detailed breakdown by license type.",
            screenshot: "[Screenshot: License ring with color-coded status]"
          },
          {
            name: "Freeing Up Licenses",
            description: "When approaching capacity limits:\n• Block inactive users who haven't connected in 30+ days\n• Remove expired temporary/guest accounts\n• Review and clean up duplicate accounts\n• Check for users with past check-out dates\n• Contact Spectra to upgrade license capacity"
          }
        ]
      },
      {
        type: "steps",
        title: "How to Assign and Change Policies",
        steps: [
          {
            number: 1,
            title: "Open User Form",
            description: "Navigate to User Management, find the user, and click 'Edit' from the actions menu (three-dot icon), or click 'Add User' for new accounts.",
            screenshot: "[Screenshot: User edit action menu]"
          },
          {
            number: 2,
            title: "Locate Policy Settings",
            description: "In the user form, scroll to the Policy Configuration section with dropdowns for speed, data, devices, and cycle.",
            screenshot: "[Screenshot: Policy section in user form]"
          },
          {
            number: 3,
            title: "Select Policy Parameters",
            description: "Choose appropriate values for each parameter based on user needs and organizational policy. Consider the user's role, typical usage, and any restrictions.",
            screenshot: "[Screenshot: Policy dropdowns with selections]"
          },
          {
            number: 4,
            title: "Review Impact",
            description: "The form shows a policy summary with monthly estimated usage. Verify the configuration matches requirements before saving.",
            screenshot: "[Screenshot: Policy summary preview]"
          },
          {
            number: 5,
            title: "Save Changes",
            description: "Click 'Save' or 'Submit' to apply the policy. Changes take effect within 2-5 minutes as they propagate to network infrastructure.",
            screenshot: "[Screenshot: Save confirmation]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Match policies to actual user needs - don't over-provision bandwidth that won't be used",
          "Monitor license usage weekly and set up alerts at 80% capacity",
          "Use daily cycles for temporary/guest users to limit exposure and free licenses faster",
          "Implement tiered policies (Basic/Standard/Premium) to offer differentiated service levels",
          "Review usage reports monthly to identify users who may need policy adjustments",
          "Document your policy tiers and assignment criteria for consistent management",
          "Consider seasonal patterns - hotels may need more licenses during peak seasons"
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
        text: "Learn how to manage user account statuses, handle account lifecycle, and perform common account management tasks like status changes, password resets, and credential updates. Effective status management ensures security and license optimization."
      },
      {
        type: "section",
        title: "User Status Types",
        items: [
          {
            name: "Active Status",
            description: "User can authenticate and access network resources according to their assigned policy.\n• Network access: Enabled\n• Data usage: Tracked against policy limits\n• License consumption: Yes (counts against capacity)\n• Automatic state: Default for new users\n\nActive users appear with a green status badge in the user list.",
            screenshot: "[Screenshot: User row with green Active status badge]"
          },
          {
            name: "Suspended Status",
            description: "Temporary suspension - user cannot access network but account remains intact.\n• Network access: Blocked\n• Account data: Preserved (can be reactivated)\n• License consumption: Yes (still counts)\n• Use cases: Payment issues, temporary holds, policy violations under review\n\nSuspended users appear with a yellow/orange status badge.",
            screenshot: "[Screenshot: User row with yellow Suspended status badge]"
          },
          {
            name: "Blocked Status",
            description: "Permanent block - user cannot access network and license is freed.\n• Network access: Permanently blocked\n• Account data: Preserved for records\n• License consumption: No (freed for reuse)\n• Use cases: Terminated employees, policy violations, account closure\n\nBlocked users appear with a red status badge.",
            screenshot: "[Screenshot: User row with red Blocked status badge]"
          },
          {
            name: "Expired Status",
            description: "Automatically set when check-out date passes.\n• Network access: Automatically disabled\n• License consumption: No (freed automatically)\n• Trigger: System checks check-out dates daily at midnight\n• Use cases: Temporary users, hotel guests, contractors\n\nExpired users appear with a gray status badge.",
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
            title: "Locate the User",
            description: "Navigate to User Management page. Use the search bar to find users by name, User ID, email, or mobile number. Apply status filters if needed.",
            screenshot: "[Screenshot: User search bar with filters]"
          },
          {
            number: 2,
            title: "Open Actions Menu",
            description: "Click the three-dot menu icon (⋮) in the user's row to open the actions dropdown menu.",
            screenshot: "[Screenshot: User row with actions menu highlighted]"
          },
          {
            number: 3,
            title: "Select Status Action",
            description: "Choose from available actions based on current status:\n• Suspend User - Temporarily block access (Active → Suspended)\n• Block User - Permanently block access (Any → Blocked)\n• Activate User - Restore access (Suspended/Blocked → Active)\n• Reset Password - Generate new credentials\n• Edit Details - Modify user information",
            screenshot: "[Screenshot: Actions dropdown menu with options]"
          },
          {
            number: 4,
            title: "Confirm the Action",
            description: "A confirmation dialog appears explaining the impact:\n• Suspend: User loses network access immediately\n• Block: User loses access, license is freed\n• Activate: User regains access, consumes license\n\nClick 'Confirm' to proceed or 'Cancel' to abort.",
            screenshot: "[Screenshot: Confirmation dialog for status change]"
          },
          {
            number: 5,
            title: "Verify Status Update",
            description: "The status badge updates immediately in the UI. Network changes propagate within 2-5 minutes. Success toast notification confirms the action.",
            screenshot: "[Screenshot: Updated status badge and success toast]"
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
            description: "Click 'Reset Password' from the actions dropdown menu. This opens the password reset dialog.",
            screenshot: "[Screenshot: Reset Password option highlighted]"
          },
          {
            number: 3,
            title: "Choose Delivery Method",
            description: "Select how to deliver the new password:\n• Email - Sends to user's registered email address\n• SMS - Sends to registered mobile number\n• Display on Screen - Shows password for admin to communicate manually\n\nEmail is recommended for security and audit trail.",
            screenshot: "[Screenshot: Password reset method selection dialog]"
          },
          {
            number: 4,
            title: "Confirm Reset",
            description: "Click 'Reset Password' to generate and send new credentials. The system:\n• Generates a secure temporary password\n• Sends via selected method\n• Logs the reset action for audit\n• Optionally forces password change on next login",
            screenshot: "[Screenshot: Password reset confirmation]"
          },
          {
            number: 5,
            title: "Verify Delivery",
            description: "Confirm with the user that they received the new credentials. If not received within 5 minutes, check spam folder or try alternate delivery method.",
            screenshot: "[Screenshot: Password reset success message]"
          }
        ]
      },
      {
        type: "section",
        title: "Bulk Status Operations",
        items: [
          {
            name: "Bulk Selection",
            description: "Use checkboxes in the user list to select multiple users. The header checkbox selects all visible users. Bulk actions appear in the toolbar when users are selected.",
            screenshot: "[Screenshot: Multiple users selected with bulk action toolbar]"
          },
          {
            name: "Bulk Suspend",
            description: "Suspend multiple users simultaneously. Useful for temporary access groups, seasonal operations, or organizational changes. All selected users lose access immediately.",
            screenshot: "[Screenshot: Bulk suspend confirmation]"
          },
          {
            name: "Bulk Block",
            description: "Block multiple users at once. Use for mass terminations, expired groups, or cleanup operations. Frees all associated licenses for reuse.",
            screenshot: "[Screenshot: Bulk block action]"
          },
          {
            name: "Bulk Activate",
            description: "Reactivate multiple suspended/blocked users. Verify license availability first - bulk activation fails if insufficient licenses are available.",
            screenshot: "[Screenshot: Bulk activate with license check]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Use Suspend for temporary holds (vacation, investigation); use Block for permanent termination",
          "Document the reason for status changes in the user notes for audit trail compliance",
          "Notify users before suspending or blocking accounts when possible",
          "Check for active sessions before blocking critical accounts to avoid data loss",
          "Regularly review expired users to ensure licenses are freed properly",
          "Use bulk operations for seasonal operations (hotel check-outs, contract endings)",
          "Set up automated reports to identify users inactive for 30+ days for cleanup"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Cannot activate user - license limit reached",
            solution: "Free up licenses by blocking inactive users or users with expired check-out dates. Use Reports > License Usage to identify candidates. Alternatively, request license capacity upgrade from Spectra."
          },
          {
            issue: "User still has network access after suspension",
            solution: "Allow 2-5 minutes for status change to propagate to network infrastructure. If issue persists, check if user has multiple accounts or is connecting through a different authentication method."
          },
          {
            issue: "Password reset email not received",
            solution: "Verify email address is correct in user profile. Check user's spam/junk folder. Try SMS method instead. If using corporate email, check if external emails are blocked."
          },
          {
            issue: "Cannot change status - insufficient permissions",
            solution: "Status changes require Manager or Administrator role. Standard Users cannot modify other accounts. Contact your Administrator for assistance."
          }
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
        text: "Learn how to perform bulk operations to efficiently manage large numbers of users through CSV import, batch updates, and data exports. Bulk operations save significant time when onboarding groups, making mass changes, or generating reports."
      },
      {
        type: "section",
        title: "Bulk Operation Capabilities",
        items: [
          {
            name: "CSV Import",
            description: "Import multiple users at once using a CSV file. Supports up to 2000 users per import depending on segment. Validates all data before import and provides detailed error reporting.",
            screenshot: "[Screenshot: CSV Import button in toolbar]"
          },
          {
            name: "Excel Paste",
            description: "Copy data directly from Excel spreadsheet and paste into the import modal. Faster for one-time imports when you already have data in spreadsheet format.",
            screenshot: "[Screenshot: Paste from Excel tab]"
          },
          {
            name: "Bulk Export",
            description: "Export user data to CSV or Excel for reporting, backup, or external processing. Supports filtering and column selection for customized exports.",
            screenshot: "[Screenshot: Export options dropdown]"
          },
          {
            name: "Bulk Status Changes",
            description: "Change status (Suspend, Block, Activate) for multiple selected users simultaneously. Efficient for seasonal operations or mass updates.",
            screenshot: "[Screenshot: Bulk action toolbar]"
          }
        ]
      },
      {
        type: "steps",
        title: "CSV Import Process",
        steps: [
          {
            number: 1,
            title: "Download CSV Template",
            description: "Navigate to User Management and click 'Download Template' in the Import section. The template includes:\n• All required columns with correct headers\n• Sample data rows showing expected format\n• Instructions for each field\n\nAlways use the latest template to ensure format compatibility.",
            screenshot: "[Screenshot: Download Template button in toolbar]"
          },
          {
            number: 2,
            title: "Prepare User Data",
            description: "Fill the CSV template with user information:\n• username (required): Unique identifier, 3-50 characters\n• email (required): Valid email address for notifications\n• fullName (required): User's display name\n• phone: Mobile number in 10-digit format\n• policy (required): Must match existing policy name exactly\n• status: active, inactive, or suspended\n• department: Organizational unit\n• checkInDate/checkOutDate: For temporary users (YYYY-MM-DD format)\n\nSave as CSV (UTF-8 encoding recommended).",
            screenshot: "[Screenshot: Sample CSV file with data in Excel]"
          },
          {
            number: 3,
            title: "Upload CSV File",
            description: "Click 'Bulk Import' or 'Import Users' button in the toolbar. In the modal:\n• Click 'Select CSV File' or drag-drop your file\n• File size limit: 5MB\n• Maximum rows depend on segment (300-2000)\n\nThe system loads and previews the file.",
            screenshot: "[Screenshot: Import dialog with file selector]"
          },
          {
            number: 4,
            title: "Validate Data",
            description: "Click 'Validate File' to check your data. The system validates:\n• Required fields present and non-empty\n• Username format (alphanumeric, dots, underscores, hyphens)\n• Email format validity\n• Policy names match available policies\n• Phone number format (10 digits)\n• Date formats correct\n• No duplicate usernames within file or existing users\n\nValidation results show valid count and error count.",
            screenshot: "[Screenshot: Validation results showing success/error counts]"
          },
          {
            number: 5,
            title: "Review and Fix Errors",
            description: "If validation finds errors, review the detailed error list:\n• Row number with the error\n• Field that failed validation\n• Specific error message\n• Suggested fix\n\nFix errors in your CSV file and re-upload. You cannot import until all errors are resolved.",
            screenshot: "[Screenshot: Error details panel with specific row errors]"
          },
          {
            number: 6,
            title: "Confirm Import",
            description: "Once validation passes (0 errors), review the summary:\n• Total users to import\n• License availability check\n• Estimated processing time\n\nClick 'Import X Users' to create all accounts. A progress bar shows import status.",
            screenshot: "[Screenshot: Import confirmation with user count]"
          },
          {
            number: 7,
            title: "Verify Import Results",
            description: "After import completes:\n• Success notification shows imported count\n• Users appear in the user list immediately\n• Credentials are generated and ready for delivery\n• Import log available for download\n\nVerify a sample of imported users to confirm data accuracy.",
            screenshot: "[Screenshot: Import success notification]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Import Limits",
        items: [
          {
            name: "Enterprise",
            description: "Maximum 1000 users per bulk import. Suitable for corporate environments with structured employee data."
          },
          {
            name: "Hotel",
            description: "Maximum 2000 users per bulk import. Higher limit to accommodate high guest turnover and seasonal peaks."
          },
          {
            name: "Co-Living",
            description: "Maximum 500 users per bulk import. Appropriate for residential community sizes."
          },
          {
            name: "CoWorking",
            description: "Maximum 800 users per bulk import. Supports flexible workspace member management."
          },
          {
            name: "PG (Paying Guest)",
            description: "Maximum 300 users per bulk import. Sized for typical PG accommodation capacity."
          },
          {
            name: "Miscellaneous",
            description: "Maximum 500 users per bulk import. General-purpose limit for other segments."
          }
        ]
      },
      {
        type: "section",
        title: "Bulk Export Options",
        items: [
          {
            name: "Export Current View",
            description: "Export users visible in the current filtered view. Respects search terms, status filters, and policy filters. Quick way to export a specific subset.",
            screenshot: "[Screenshot: Export CSV button with filter applied]"
          },
          {
            name: "Export All Users",
            description: "Export complete user database including all statuses. Useful for backup, audit, or comprehensive reporting. May take longer for large user bases.",
            screenshot: "[Screenshot: Export All option in dropdown]"
          },
          {
            name: "Custom Column Selection",
            description: "Choose specific columns to include:\n• Basic Info: User ID, Name, Email, Phone\n• Policy Details: Speed, Data, Devices, Cycle\n• Status Info: Status, Check-in, Check-out\n• Usage Stats: Data used, Last login, Device count\n• Metadata: Created date, Modified date, Created by",
            screenshot: "[Screenshot: Column selection dialog for export]"
          },
          {
            name: "Export Formats",
            description: "Available export formats:\n• CSV - Universal format, works with any spreadsheet\n• Excel (.xlsx) - Native Excel format with formatting\n• PDF - Formatted report for printing/sharing",
            screenshot: "[Screenshot: Format selection options]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Always download the latest CSV template to ensure correct column format and order",
          "Check available licenses before importing large user batches - import fails if insufficient",
          "Test with a small CSV file (5-10 users) before importing hundreds to verify format",
          "Use unique User IDs following a consistent naming convention across your organization",
          "Validate email addresses and mobile numbers before import - these are used for credential delivery",
          "Keep a backup copy of your CSV file before uploading in case you need to modify and retry",
          "Policy names in CSV must exactly match existing policy names (case-sensitive)",
          "For temporary users, always include check-in and check-out dates to enable automatic lifecycle management",
          "Schedule large imports during off-peak hours to minimize performance impact"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Import Issues",
        items: [
          {
            issue: "Duplicate User ID errors during import",
            solution: "Check your CSV for duplicate User IDs within the file. Also verify that these User IDs don't already exist in the system by searching in the user list. User IDs must be globally unique."
          },
          {
            issue: "Invalid mobile number format",
            solution: "Ensure all mobile numbers are exactly 10 digits without spaces, dashes, country codes, or special characters. Correct format: 9876543210"
          },
          {
            issue: "Policy not found errors",
            solution: "Verify that the policy names in your CSV exactly match existing policy names in the system. Policy matching is case-sensitive. Check available policies in the Add User form dropdown."
          },
          {
            issue: "License limit exceeded warning",
            solution: "Check current license utilization before import. Free up licenses by blocking inactive users or upgrade your license capacity. Import will fail if importing more users than available licenses."
          },
          {
            issue: "File encoding errors or garbled characters",
            solution: "Save your CSV file with UTF-8 encoding. In Excel: Save As > CSV UTF-8. Special characters in names may cause issues with other encodings."
          },
          {
            issue: "Date format errors",
            solution: "Use YYYY-MM-DD format for all dates (e.g., 2025-01-15). Other formats like DD/MM/YYYY or MM/DD/YYYY will cause validation errors."
          }
        ]
      }
    ]
  },

  "bulk-user-import": {
    title: "Bulk User Import Guide",
    category: "User Management",
    content: [
      {
        type: "intro",
        text: "Detailed guide for importing multiple users at once using CSV files or direct Excel paste. This feature significantly reduces time when onboarding large groups of users such as new employee batches, hotel guest lists, or co-living residents."
      },
      {
        type: "steps",
        title: "Using CSV File Upload",
        steps: [
          {
            number: 1,
            title: "Click Bulk Import Button",
            description: "Navigate to User Management and click the 'Bulk Import' button in the toolbar (green button with upload icon). This opens the bulk import modal with tabbed options.",
            screenshot: "[Screenshot: Bulk Import button highlighted in toolbar]"
          },
          {
            number: 2,
            title: "Download Template",
            description: "In the bulk import modal, click 'Download Template' to get a CSV file with:\n• Correct column headers in required order\n• Sample data rows demonstrating format\n• All required and optional fields documented\n\nUsing the template ensures compatibility with the import system.",
            screenshot: "[Screenshot: Download Template button in modal]"
          },
          {
            number: 3,
            title: "Fill CSV File",
            description: "Open the template in Excel or any spreadsheet software and fill in user data:\n• username (required): Unique user identifier, 3-50 characters, alphanumeric with dots/underscores/hyphens\n• email (required): Valid email address for notifications and password reset\n• fullName (required): User's full display name\n• phone: Contact number, 10 digits\n• policy (required): One of 'Standard Access', 'Premium Access', 'Basic Access', or 'Guest Access'\n• status: 'active', 'inactive', or 'suspended' (defaults to active)\n• segment: Business segment classification\n• department: User's department or unit\n• notes: Additional information or comments",
            screenshot: "[Screenshot: CSV file open in Excel with sample data]"
          },
          {
            number: 4,
            title: "Upload File",
            description: "Click 'Select CSV File' in the modal and choose your completed CSV file. Alternatively, drag and drop the file into the upload area. The system loads the file and shows filename confirmation.",
            screenshot: "[Screenshot: File selected, showing filename]"
          },
          {
            number: 5,
            title: "Validate Data",
            description: "Click 'Validate File' to check your data. The system performs comprehensive validation:\n• Verifies all required fields are present and non-empty\n• Checks username format (3-50 chars, allowed characters only)\n• Validates email addresses against standard format\n• Confirms policy names match available policies exactly\n• Verifies phone number format (10 digits if provided)\n• Checks for duplicate usernames within file and against existing users\n• Validates date formats if check-in/check-out provided",
            screenshot: "[Screenshot: Validation results showing valid and error counts]"
          },
          {
            number: 6,
            title: "Review Errors (if any)",
            description: "If validation finds errors, review the detailed error list showing:\n• Row number with the error (helps locate in spreadsheet)\n• Specific field(s) that failed validation\n• Clear error message explaining the issue\n• Suggestion for fixing the error\n\nFix errors in your CSV file, save, and re-upload. Repeat until validation passes.",
            screenshot: "[Screenshot: Error details panel with specific row errors]"
          },
          {
            number: 7,
            title: "Import Users",
            description: "Once validation passes (0 errors), click 'Import X Users' to add them to the system. A progress indicator shows import status. Upon completion:\n• Success notification confirms imported count\n• Users are immediately available in the system\n• Credentials are auto-generated\n• Import log is available for download",
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
            description: "Create or open an Excel spreadsheet with user data. Ensure:\n• First row contains headers matching the template format\n• Data is in contiguous rows without gaps\n• No merged cells or special formatting",
            screenshot: "[Screenshot: Excel spreadsheet with headers and data]"
          },
          {
            number: 2,
            title: "Copy Data",
            description: "Select all data including headers (Ctrl+A or click and drag), then copy (Ctrl+C or Cmd+C on Mac).",
            screenshot: "[Screenshot: Selected data in Excel ready to copy]"
          },
          {
            number: 3,
            title: "Open Bulk Import Modal",
            description: "Click 'Bulk Import' button in User Management toolbar to open the import modal.",
            screenshot: "[Screenshot: Bulk Import button highlighted]"
          },
          {
            number: 4,
            title: "Switch to Paste Tab",
            description: "Click the 'Paste from Excel' tab in the modal. This shows a large text area for pasting data.",
            screenshot: "[Screenshot: Paste from Excel tab selected]"
          },
          {
            number: 5,
            title: "Paste Data",
            description: "Click inside the text area and paste your data (Ctrl+V or Cmd+V). The pasted content appears as tab-separated values.",
            screenshot: "[Screenshot: Pasted data visible in textarea]"
          },
          {
            number: 6,
            title: "Validate and Import",
            description: "Click 'Validate Data' to check the pasted content. Same validation rules apply as CSV upload. If valid, click 'Import X Users' to create the accounts.",
            screenshot: "[Screenshot: Validation success and import button]"
          }
        ]
      },
      {
        type: "section",
        title: "Required vs Optional Fields",
        items: [
          {
            name: "Required Fields",
            description: "These fields must be provided for every user:\n• username - Unique identifier\n• email - Valid email address\n• fullName - Display name\n• policy - Must match an existing policy"
          },
          {
            name: "Optional Fields",
            description: "These fields enhance user records but aren't required:\n• phone - Mobile number for SMS notifications\n• status - Defaults to 'active' if not provided\n• department - Organizational grouping\n• segment - Business segment\n• checkInDate / checkOutDate - For temporary access\n• notes - Additional information"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Keep your CSV file under the segment's maximum user limit to avoid rejection",
          "Test with a small batch first (5-10 users) to verify format before large imports",
          "Use the downloaded template to ensure correct column order - don't rearrange columns",
          "Usernames must be unique across the entire system, not just within your import file",
          "Policy names are case-sensitive - 'Premium Access' differs from 'premium access'",
          "Phone numbers should be 10 digits only: 9876543210 (no country code, spaces, or dashes)",
          "Excel paste method is faster for one-time imports when you already have spreadsheet data",
          "Save your original CSV file - you'll need it if you need to fix errors and re-import",
          "Schedule large imports during low-usage hours to minimize system impact"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Username validation error",
            solution: "Usernames must be 3-50 characters, containing only letters, numbers, dots (.), underscores (_), and hyphens (-). No spaces or special characters allowed."
          },
          {
            issue: "Invalid email format",
            solution: "Ensure emails follow standard format: user@domain.com. Check for typos, extra spaces, or missing @ symbol."
          },
          {
            issue: "Policy not found",
            solution: "Policy must exactly match one of: 'Standard Access', 'Premium Access', 'Basic Access', or 'Guest Access'. Names are case-sensitive."
          },
          {
            issue: "Exceeds maximum limit",
            solution: "Split your import into smaller batches within your segment's limit. Enterprise: 1000, Hotel: 2000, Co-Living: 500, CoWorking: 800, PG: 300."
          },
          {
            issue: "Duplicate username",
            solution: "Check for duplicate usernames within your CSV file and against existing users in the system. Each username must be globally unique."
          },
          {
            issue: "Pasted data not recognized",
            solution: "Ensure you're copying from Excel with headers in the first row. Data should be tab-separated when pasted. Try copying fewer columns if issues persist."
          }
        ]
      }
    ]
  },

  // ============================================
  // DEVICE MANAGEMENT ARTICLES
  // ============================================

  "device-registration": {
    title: "Device Registration",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Register devices with MAC address binding to ensure secure network access, proper user tracking, and policy enforcement. This guide covers both user devices (laptops, phones, tablets) and digital/IoT devices (printers, cameras, sensors)."
      },
      {
        type: "section",
        title: "Device Types",
        items: [
          {
            name: "User Devices",
            description: "Personal computing devices owned or used by network users:\n• Laptop - Corporate or personal laptops\n• Mobile - Smartphones and mobile phones\n• Tablet - iPads, Android tablets, and similar devices\n\nUser devices are typically bound to a specific user account and count against their device limit.",
            screenshot: "[Screenshot: User device types in dropdown]"
          },
          {
            name: "Digital/IoT Devices",
            description: "Infrastructure and smart devices without direct user interaction:\n• Printer - Network printers and multifunction devices\n• Camera - IP cameras and security surveillance\n• Smart TV - Connected displays and digital signage\n• IoT Sensor - Environmental sensors, controllers\n• Gaming Console - PlayStation, Xbox, etc.\n• Access Point - WiFi infrastructure devices\n\nDigital devices are registered as standalone device users with their own credentials.",
            screenshot: "[Screenshot: Digital device types in dropdown]"
          }
        ]
      },
      {
        type: "steps",
        title: "Registering a User Device",
        steps: [
          {
            number: 1,
            title: "Navigate to Device Management",
            description: "Click 'Device Management' in the sidebar to access the Device Management page. You'll see the device list with filters and action buttons.",
            screenshot: "[Screenshot: Device Management page overview]"
          },
          {
            number: 2,
            title: "Click Register Device",
            description: "Click the 'Register Device' button (blue button with + icon) in the toolbar. This opens the device registration modal.",
            screenshot: "[Screenshot: Register Device button highlighted]"
          },
          {
            number: 3,
            title: "Enter MAC Address",
            description: "Input the device MAC address in one of these formats:\n• Colon-separated: AA:BB:CC:DD:EE:FF\n• Hyphen-separated: AA-BB-CC-DD-EE-FF\n• No separator: AABBCCDDEEFF\n\nThe system validates format and checks for duplicates. MAC addresses must be unique across the entire network.",
            screenshot: "[Screenshot: MAC address field with validation]"
          },
          {
            number: 4,
            title: "Choose Device Type",
            description: "Select the device category from the dropdown:\n• User Devices: Laptop, Mobile, Tablet\n• Digital Devices: IoT, Printer, Camera, Smart TV, Gaming Console\n\nDevice type affects policy options and reporting categorization.",
            screenshot: "[Screenshot: Device type dropdown with categories]"
          },
          {
            number: 5,
            title: "Select Registration Mode",
            description: "Choose how to register the device:\n• Bind to Existing User: Links device to an existing user account. Device counts against user's device limit and shares their policy.\n• Create as Device User: Creates a standalone device account with its own credentials and policy. Use for IoT/digital devices that don't belong to a specific person.",
            screenshot: "[Screenshot: Registration mode options]"
          },
          {
            number: 6,
            title: "Select User (if binding)",
            description: "If binding to existing user, search and select the user:\n• Search by name, User ID, email, or mobile\n• Verify user's current device count vs. limit\n• User must have available device slots\n\nIf user is at device limit, you must remove a device first or increase their limit.",
            screenshot: "[Screenshot: User search and selection]"
          },
          {
            number: 7,
            title: "Provide Device Name",
            description: "Enter a friendly name for identification:\n• Good examples: 'John's MacBook Pro', 'Reception Printer', 'Lobby Camera 1'\n• Use descriptive names that help identify device location or purpose\n• Names can be changed later if needed",
            screenshot: "[Screenshot: Device name field]"
          },
          {
            number: 8,
            title: "Set Priority (Optional)",
            description: "Assign network priority for QoS:\n• High - Priority bandwidth during congestion\n• Medium - Standard priority (default)\n• Low - Best-effort, deprioritized\n\nUse high priority for critical business devices.",
            screenshot: "[Screenshot: Priority selection dropdown]"
          },
          {
            number: 9,
            title: "Submit Registration",
            description: "Click 'Register' to complete registration. The system:\n• Validates MAC address uniqueness\n• Creates device record\n• Binds to user or creates device user\n• Enables network access immediately\n• Shows success notification with device details",
            screenshot: "[Screenshot: Registration success notification]"
          }
        ]
      },
      {
        type: "section",
        title: "Device Status Indicators",
        items: [
          {
            name: "Online (Green)",
            description: "Device is currently connected to the network and actively communicating. Last seen within the last 5 minutes."
          },
          {
            name: "Offline (Gray)",
            description: "Device is registered but not currently connected. May be powered off, out of range, or disconnected."
          },
          {
            name: "Blocked (Red)",
            description: "Device has been manually blocked by an administrator. Cannot connect until unblocked."
          },
          {
            name: "Inactive (Yellow)",
            description: "Device hasn't been seen for extended period (30+ days). May indicate abandoned or replaced device."
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "MAC addresses must be unique across the entire network - verify before registering",
          "Device count is limited by user's policy (typically 1-5 devices) - check limit before adding",
          "Digital/IoT devices should be registered as device users for separate policy and tracking",
          "Device names can be changed later, but MAC addresses cannot - verify accuracy",
          "Use consistent naming conventions across your organization for easier management",
          "For corporate devices, include asset tag or serial number in the device name",
          "Register critical infrastructure devices (APs, printers) with high priority",
          "Regularly audit device list to remove obsolete registrations"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "MAC address already registered",
            solution: "Each MAC address can only be registered once. Search for the existing registration to see which user owns it. If duplicate device needs registration, remove the existing registration first."
          },
          {
            issue: "User device limit exceeded",
            solution: "User has reached maximum devices allowed by their policy. Either remove an existing device from the user's account or contact administrator to increase their device limit policy."
          },
          {
            issue: "Invalid MAC address format",
            solution: "MAC address must be 12 hexadecimal characters (0-9, A-F). Accepted formats: AA:BB:CC:DD:EE:FF, AA-BB-CC-DD-EE-FF, or AABBCCDDEEFF. Remove any extra spaces or invalid characters."
          },
          {
            issue: "Device registered but cannot connect",
            solution: "Allow 2-5 minutes for registration to propagate. Verify SSID credentials are correct. Check that device WiFi is enabled and in range. Ensure user account is Active if device is user-bound."
          },
          {
            issue: "Cannot find user to bind device",
            solution: "Ensure user account exists and is Active. Search by different criteria (name, email, User ID). If user doesn't exist, create the user account first before registering their device."
          }
        ]
      }
    ]
  },

  "bulk-device-import-user": {
    title: "Bulk Import User Devices",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Import multiple user devices (laptops, mobile phones, tablets) at once for quick device provisioning across your organization. This feature is available in Enterprise, Hotel, and Miscellaneous segments."
      },
      {
        type: "section",
        title: "Feature Availability",
        items: [
          {
            name: "Enterprise Segment",
            description: "Available - Maximum 2000 devices per import. Ideal for corporate laptop and phone fleet registration."
          },
          {
            name: "Hotel Segment",
            description: "Available - Maximum 3000 devices per import. Supports high-volume guest device registration."
          },
          {
            name: "Miscellaneous Segment",
            description: "Available - Maximum 1000 devices per import. General-purpose device import."
          },
          {
            name: "Co-Living, CoWorking, PG",
            description: "Not Available - User device bulk import is not supported in these segments. Register devices individually."
          }
        ]
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
            title: "Click Bulk Import User Devices",
            description: "In the toolbar, click the 'Bulk Import' dropdown and select 'User Devices' (green button with upload icon). Note: This option only appears in supported segments.",
            screenshot: "[Screenshot: Bulk Import User Devices button highlighted]"
          },
          {
            number: 3,
            title: "Download Template",
            description: "Click 'Download Template' to get the user device CSV format with:\n• Required column headers\n• Sample data rows\n• Field format instructions",
            screenshot: "[Screenshot: Template download button in modal]"
          },
          {
            number: 4,
            title: "Fill Device Data",
            description: "Complete the CSV with device information:\n• assignedUserId (required): User ID who owns the device - must exist in system\n• fullName (required): Owner's full name for reference\n• email: Owner's email address\n• phone: Owner's phone number\n• deviceType (required): 'laptop', 'mobile', or 'tablet' (lowercase)\n• priority: 'high', 'medium', or 'low' (defaults to medium)\n• notes: Device description, asset tag, or other notes",
            screenshot: "[Screenshot: User device CSV template with data]"
          },
          {
            number: 5,
            title: "Upload and Validate",
            description: "Upload your CSV file, then click 'Validate File' to check for errors. The system validates:\n• Device type is one of: laptop, mobile, tablet\n• Priority is one of: high, medium, low\n• Required fields are present\n• User IDs exist in the system\n• Users have available device slots",
            screenshot: "[Screenshot: Validation results for user devices]"
          },
          {
            number: 6,
            title: "Import Devices",
            description: "After successful validation, click 'Import X Devices'. MAC addresses and IP addresses are auto-generated for user devices since they'll be assigned when the actual device connects.",
            screenshot: "[Screenshot: Success notification for device import]"
          }
        ]
      },
      {
        type: "section",
        title: "Device Types Supported",
        items: [
          {
            name: "Laptop",
            description: "Corporate or personal laptops assigned to users. Typically given high or medium priority for business-critical work. Common brands: Dell, HP, Lenovo, MacBook, etc.",
            screenshot: "[Screenshot: Laptop icon in device list]"
          },
          {
            name: "Mobile",
            description: "Mobile phones used for work or personal use. Can have medium or high priority depending on user role. Includes smartphones from all manufacturers.",
            screenshot: "[Screenshot: Mobile icon in device list]"
          },
          {
            name: "Tablet",
            description: "Tablets and iPads used for mobile productivity. Often medium priority unless designated as primary work device. Includes iPad, Android tablets, Surface devices.",
            screenshot: "[Screenshot: Tablet icon in device list]"
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "High priority devices get bandwidth preference during network congestion",
          "MAC addresses are auto-generated as placeholders - actual MAC is captured when device connects",
          "Assign devices only to existing user IDs - verify users exist before importing",
          "Use descriptive notes to identify company-owned vs personal devices",
          "Batch similar device types together for easier management and reporting",
          "Check user device limits before bulk import - users at their limit will cause import failures",
          "Export existing devices first to avoid duplicate registrations"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "User ID not found",
            solution: "Ensure the assignedUserId matches an existing user in the system exactly. User IDs are case-sensitive. Import users first if they don't exist, then import their devices."
          },
          {
            issue: "Invalid device type",
            solution: "Device type must be exactly one of: 'laptop', 'mobile', or 'tablet' (all lowercase). Check for typos or extra spaces."
          },
          {
            issue: "User device limit exceeded",
            solution: "User already has maximum devices allowed. Remove existing devices or increase user's device limit policy before importing additional devices."
          },
          {
            issue: "Feature not available",
            solution: "User device bulk imports are only available in Enterprise, Hotel, and Miscellaneous segments. Other segments must register devices individually."
          },
          {
            issue: "Import partially successful",
            solution: "Some devices may fail while others succeed. Review the import log for specific failures. Common causes: individual user limits exceeded, duplicate entries."
          }
        ]
      }
    ]
  },

  "bulk-device-import-other": {
    title: "Bulk Import IoT & Infrastructure Devices",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Import IoT devices, printers, cameras, sensors, and other network infrastructure devices in bulk for efficient infrastructure management. This feature is available in all segments except Miscellaneous."
      },
      {
        type: "section",
        title: "Supported Device Types",
        items: [
          {
            name: "IoT Devices",
            description: "Smart sensors, controllers, and connected devices. Examples: temperature sensors, humidity monitors, smart locks, HVAC controllers, environmental monitors, smart plugs.",
            screenshot: "[Screenshot: IoT device in device list]"
          },
          {
            name: "Printers",
            description: "Network printers and multi-function devices. Track usage, manage print queues, and ensure connectivity for all network-attached printers.",
            screenshot: "[Screenshot: Printer device in device list]"
          },
          {
            name: "Cameras",
            description: "IP cameras and security surveillance devices. Monitor connectivity, bandwidth usage, and ensure critical security infrastructure is online.",
            screenshot: "[Screenshot: Camera device in device list]"
          },
          {
            name: "Sensors",
            description: "Environmental, motion, occupancy, and specialized sensors. Often low bandwidth but require reliable connectivity for monitoring systems.",
            screenshot: "[Screenshot: Sensor device in device list]"
          },
          {
            name: "Access Points",
            description: "WiFi access points and network infrastructure. Critical devices that should be marked high priority and monitored closely.",
            screenshot: "[Screenshot: Access point device in device list]"
          },
          {
            name: "Other",
            description: "Any other network devices not covered by above categories. Use descriptive names and notes for identification. Includes: smart displays, digital signage, POS terminals, etc.",
            screenshot: "[Screenshot: Other device in device list]"
          }
        ]
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
            description: "Click the 'Bulk Import' dropdown and select 'Other Devices' or 'IoT Devices' (green button). Available in Enterprise, Hotel, Co-Living, CoWorking, and PG segments.",
            screenshot: "[Screenshot: Bulk Import Other button highlighted]"
          },
          {
            number: 3,
            title: "Download Template",
            description: "Click 'Download Template' to get the IoT/other devices CSV format with all required fields and format specifications.",
            screenshot: "[Screenshot: Download template button]"
          },
          {
            number: 4,
            title: "Fill Device Information",
            description: "Complete the CSV with device details:\n• deviceName (required): Descriptive name (e.g., 'Lobby Printer 1', 'Floor 3 Camera')\n• macAddress (required): MAC address in XX:XX:XX:XX:XX:XX format\n• deviceType (required): iot, printer, camera, sensor, access-point, or other\n• manufacturer: Device manufacturer/brand (HP, Cisco, Axis, etc.)\n• location: Physical location (Building A Floor 2, Room 105, etc.)\n• assignedTo: Department or person responsible\n• status: active, inactive, or maintenance\n• notes: Additional information, serial number, etc.",
            screenshot: "[Screenshot: Other devices CSV template with IoT data]"
          },
          {
            number: 5,
            title: "Validate Data",
            description: "Upload and click 'Validate File'. The system checks:\n• MAC address format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX\n• MAC address uniqueness: No duplicates within file or existing devices\n• Device type is from allowed list\n• Status is active/inactive/maintenance\n• Required fields are present and non-empty",
            screenshot: "[Screenshot: Validation results for other devices]"
          },
          {
            number: 6,
            title: "Import Devices",
            description: "After validation passes, click 'Import X Devices' to add them to your network. Devices are assigned IP addresses and registered for network access immediately.",
            screenshot: "[Screenshot: Success notification for other devices import]"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Import Limits",
        items: [
          {
            name: "Enterprise",
            description: "Maximum 2000 devices per import. Suitable for large corporate infrastructure."
          },
          {
            name: "Hotel",
            description: "Maximum 3000 devices per import. Supports extensive hospitality infrastructure."
          },
          {
            name: "Co-Living",
            description: "Maximum 1000 devices per import. Appropriate for residential IoT deployments."
          },
          {
            name: "CoWorking",
            description: "Maximum 1500 devices per import. Handles shared workspace infrastructure."
          },
          {
            name: "PG (Paying Guest)",
            description: "Maximum 600 devices per import. Sized for typical PG infrastructure."
          },
          {
            name: "Miscellaneous",
            description: "Not Available - Other/IoT device bulk import not supported. Register devices individually."
          }
        ]
      },
      {
        type: "tips",
        title: "Pro Tips",
        items: [
          "Use manufacturer's MAC address label for accuracy - found on device sticker or configuration page",
          "Group devices by location for easier management and troubleshooting",
          "Set critical infrastructure (cameras, APs) to 'active' status immediately",
          "Use 'maintenance' status for devices being configured or serviced",
          "Include location details for quick physical identification during troubleshooting",
          "Use consistent naming conventions: Location-DeviceType-Number (e.g., 'Lobby-Printer-01')",
          "Access points and security cameras should be marked as high priority",
          "Include serial numbers or asset tags in notes field for inventory management"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Invalid MAC address format",
            solution: "MAC address must be in format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX. Use uppercase letters A-F for hexadecimal digits. Example: 00:1A:2B:3C:4D:5E"
          },
          {
            issue: "Duplicate MAC address",
            solution: "Each MAC address must be unique across the entire network. Check for duplicates within your CSV and against existing registered devices. Search existing devices by MAC before importing."
          },
          {
            issue: "Invalid device type",
            solution: "Device type must be exactly one of: iot, printer, camera, sensor, access-point, or other (all lowercase). Check for typos or extra spaces."
          },
          {
            issue: "Exceeds segment limit",
            solution: "Split your import into multiple smaller batches within your segment's maximum limit. Import critical devices first, then add remaining devices in subsequent batches."
          },
          {
            issue: "Feature not available",
            solution: "IoT/other device bulk import is not supported in the Miscellaneous segment. Register devices individually through the Device Management interface."
          }
        ]
      }
    ]
  },

  // ============================================
  // GUEST MANAGEMENT ARTICLES
  // ============================================

  "guest-management-overview": {
    title: "Guest Management Overview",
    category: "Guest Management",
    content: [
      {
        type: "intro",
        text: "The Guest Management module enables you to create, manage, and track temporary network access for visitors, contractors, and short-term users. This feature is particularly valuable for Hotels, Co-Living spaces, and Enterprise environments with frequent visitors."
      },
      {
        type: "section",
        title: "Guest Management Permissions",
        items: [
          {
            name: "View Guest Management (canViewGuestManagement)",
            description: "Allows viewing the Guest Management page and seeing all guest accounts. Available to: Administrator, Manager, User roles. Required to access the guest list and view guest details."
          },
          {
            name: "Manage Guests (canManageGuests)",
            description: "Allows creating, editing, and deleting guest accounts. Available to: Administrator, Manager roles. User role can view but not create/modify guests."
          },
          {
            name: "Extend Guest Stay (canExtendGuestStay)",
            description: "Allows extending check-out dates for existing guests. Available to: Administrator, Manager roles. Useful for guests who need to extend their visit."
          }
        ]
      },
      {
        type: "section",
        title: "Guest Account Features",
        items: [
          {
            name: "Automatic Expiration",
            description: "Guest accounts automatically expire on their check-out date. The system:\n• Blocks network access at midnight on check-out date\n• Frees up the license for reuse\n• Marks account as Expired\n• Preserves account data for records and reporting"
          },
          {
            name: "Credential Delivery",
            description: "Guest credentials can be delivered via:\n• Email - Sends login details to guest's email address\n• SMS - Sends credentials to guest's mobile number\n• Print - Generates a printable credential slip\n• Display - Shows credentials on screen for verbal communication"
          },
          {
            name: "Usage Tracking",
            description: "Track guest network usage:\n• Data consumption per guest\n• Session history and duration\n• Connected devices\n• Access times and patterns"
          },
          {
            name: "Stay Extension",
            description: "Extend guest access when visits are prolonged:\n• Modify check-out date to a future date\n• Automatic reactivation if already expired\n• Maintains usage history and device registrations"
          }
        ]
      },
      {
        type: "steps",
        title: "Creating a Guest Account",
        steps: [
          {
            number: 1,
            title: "Navigate to Guest Management",
            description: "Click 'Guest Management' in the sidebar. If you don't see this option, your site may not have guest access enabled or you may not have the required permission.",
            screenshot: "[Screenshot: Guest Management in sidebar]"
          },
          {
            number: 2,
            title: "Click Add Guest",
            description: "Click the 'Add Guest' button in the toolbar. This opens the guest creation form.",
            screenshot: "[Screenshot: Add Guest button]"
          },
          {
            number: 3,
            title: "Enter Guest Details",
            description: "Fill in guest information:\n• Guest Name (required)\n• Email Address (for credential delivery)\n• Mobile Number (for SMS credentials)\n• Company/Organization (optional)\n• Purpose of Visit (optional)",
            screenshot: "[Screenshot: Guest details form]"
          },
          {
            number: 4,
            title: "Set Access Period",
            description: "Define when guest access is valid:\n• Check-In Date: When access begins (today or future)\n• Check-Out Date: When access automatically expires\n• For same-day access, set both dates to today",
            screenshot: "[Screenshot: Date selection for guest]"
          },
          {
            number: 5,
            title: "Select Guest Policy",
            description: "Choose the access policy for the guest:\n• Guest Basic - Limited speed and data\n• Guest Standard - Moderate access levels\n• Guest Premium - Full-speed access\n\nPolicies determine bandwidth, data limits, and device allowance.",
            screenshot: "[Screenshot: Guest policy selection]"
          },
          {
            number: 6,
            title: "Generate Credentials",
            description: "Click 'Create Guest' to generate the account. The system:\n• Creates a unique guest User ID\n• Generates secure password\n• Sets up automatic expiration\n• Displays credentials for delivery",
            screenshot: "[Screenshot: Generated credentials display]"
          },
          {
            number: 7,
            title: "Deliver Credentials",
            description: "Choose how to share credentials with the guest:\n• Click 'Send Email' to email credentials\n• Click 'Send SMS' to text credentials\n• Click 'Print' for a physical credential slip\n• Note them down if delivering verbally",
            screenshot: "[Screenshot: Credential delivery options]"
          }
        ]
      },
      {
        type: "steps",
        title: "Extending Guest Stay",
        steps: [
          {
            number: 1,
            title: "Find the Guest",
            description: "In Guest Management, locate the guest account using search or filters. You can search by name, email, or guest ID.",
            screenshot: "[Screenshot: Guest search]"
          },
          {
            number: 2,
            title: "Open Guest Actions",
            description: "Click the actions menu (three dots) on the guest row and select 'Extend Stay' or 'Edit'.",
            screenshot: "[Screenshot: Extend Stay option]"
          },
          {
            number: 3,
            title: "Set New Check-Out Date",
            description: "Select the new check-out date. Must be after the current date. If guest is already expired, extending will reactivate their account.",
            screenshot: "[Screenshot: Date picker for extension]"
          },
          {
            number: 4,
            title: "Confirm Extension",
            description: "Review the new access period and click 'Confirm'. The guest's access is immediately extended without requiring new credentials.",
            screenshot: "[Screenshot: Extension confirmation]"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Set realistic check-out dates - expired accounts free up licenses automatically",
          "Use guest-specific policies with appropriate data limits to prevent abuse",
          "Enable email or SMS delivery for self-service credential retrieval",
          "For recurring visitors, consider creating a regular user account instead",
          "Review expired guests regularly and clean up old accounts",
          "Use company/organization field to track visitor sources",
          "For events, create guest accounts in advance and have credentials ready"
        ]
      }
    ]
  },

  // ============================================
  // REPORTS & ANALYTICS ARTICLES
  // ============================================

  "dashboard-overview": {
    title: "Dashboard Overview",
    category: "Reports & Analytics",
    content: [
      {
        type: "intro",
        text: "The dashboard provides real-time insights into your network operations, user activity, license utilization, and system health. It's your central hub for monitoring key metrics and identifying trends across your network infrastructure."
      },
      {
        type: "section",
        title: "Overview Cards",
        items: [
          {
            name: "Active Users",
            description: "Shows current number of active users in your network with trend comparison:\n• Current count vs. previous period\n• Green arrow: Growth compared to last period\n• Red arrow: Decline compared to last period\n• Percentage change displayed\n\nClick the card to navigate to User Management for details.",
            screenshot: "[Screenshot: Active Users card with trend arrow]"
          },
          {
            name: "License Usage",
            description: "Displays license utilization as percentage and visual progress bar:\n• Used licenses / Total capacity\n• Color-coded: Green (<70%), Yellow (70-85%), Red (>85%)\n• Click for detailed license breakdown by type\n\nMonitor this to avoid hitting capacity limits during user creation.",
            screenshot: "[Screenshot: License Usage card with progress bar]"
          },
          {
            name: "Data Usage",
            description: "Total network data consumption this week:\n• Measured in GB or TB depending on scale\n• Trend comparison with previous week\n• Breakdown by user segment available on click\n\nHelps track network utilization and plan capacity.",
            screenshot: "[Screenshot: Data Usage card showing consumption]"
          },
          {
            name: "Connected Devices",
            description: "Current count of devices actively connected:\n• Total registered vs. currently online\n• Device type breakdown on hover\n• Quick link to Device Management\n\nHigh device counts may indicate network congestion.",
            screenshot: "[Screenshot: Connected Devices card]"
          },
          {
            name: "System Alerts",
            description: "Count of current alerts requiring attention:\n• Color-coded by severity (Critical, Warning, Info)\n• Badge shows critical alert count\n• Click to view alert details and take action\n\nAddress critical alerts promptly to maintain service quality.",
            screenshot: "[Screenshot: Alerts card with severity indicator]"
          }
        ]
      },
      {
        type: "section",
        title: "Network Analytics Charts",
        items: [
          {
            name: "Network Usage Trend (Line Chart)",
            description: "Daily network usage over the past 90 days:\n• X-axis: Date\n• Y-axis: Data in GB\n• Hover for exact values per day\n• Identify patterns and peak usage periods\n• Export to CSV or PDF for reporting\n\nUse this to track trends and plan capacity upgrades.",
            screenshot: "[Screenshot: Network Usage line chart with 90-day trend]"
          },
          {
            name: "License Distribution (Bar Chart)",
            description: "Distribution of license types across active users:\n• Premium, Standard, Basic, Guest licenses\n• Visual comparison of allocation vs. usage\n• Helps optimize license purchasing decisions\n\nClick segments for detailed user lists by license type.",
            screenshot: "[Screenshot: License distribution bar chart]"
          },
          {
            name: "User Activity (Area Chart)",
            description: "User activity patterns over time:\n• Concurrent user counts throughout the day\n• Peak hours identification\n• Day-over-day comparison\n\nUseful for capacity planning and identifying usage patterns.",
            screenshot: "[Screenshot: User activity area chart]"
          },
          {
            name: "Alerts by Severity (Pie Chart)",
            description: "Breakdown of alerts by severity level:\n• Critical (Red) - Immediate action required\n• Warning (Orange) - Attention needed soon\n• Info (Green) - Informational notices\n\nClick segments for filtered alert list.",
            screenshot: "[Screenshot: Alerts pie chart with severity breakdown]"
          }
        ]
      },
      {
        type: "section",
        title: "Quick Actions",
        items: [
          {
            name: "Add User",
            description: "One-click access to create a new user account. Launches the Add User modal directly from the dashboard."
          },
          {
            name: "View All Users",
            description: "Navigate to the complete User Management page to browse, search, and manage all user accounts."
          },
          {
            name: "Generate Report",
            description: "Quick link to the Reports dashboard where you can generate various usage, billing, and compliance reports."
          },
          {
            name: "Get Support",
            description: "Access the Help & Support page to chat with Spectra Genie AI assistant or contact support directly."
          }
        ]
      },
      {
        type: "section",
        title: "Site Selector (Company Level)",
        items: [
          {
            name: "Multi-Site View",
            description: "If you have Company Level access (manage multiple sites), the dashboard includes:\n• Site selector dropdown in header\n• Aggregated metrics across all sites\n• Ability to drill down into specific site\n• Comparison view between sites"
          },
          {
            name: "Site-Specific Metrics",
            description: "Select a specific site to view:\n• Site-specific user and device counts\n• Local license utilization\n• Site-level alerts and issues\n• Network metrics for that location"
          }
        ]
      },
      {
        type: "tips",
        title: "Dashboard Tips",
        items: [
          "Check the dashboard daily to stay informed about network health",
          "Set up email alerts for critical metrics so you don't miss issues",
          "Use the 90-day trend chart to identify seasonal patterns",
          "Monitor license usage weekly to plan capacity ahead of limits",
          "Export charts to include in management reports",
          "Click any card or chart for detailed drill-down information"
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
        text: "Generate comprehensive reports for billing reconciliation, compliance auditing, usage analytics, SLA monitoring, and operational insights. The Reports module provides a wide range of pre-built reports with customizable filters and export options."
      },
      {
        type: "section",
        title: "Report Categories",
        items: [
          {
            name: "Billing Reports",
            description: "Financial and billing-related reports:\n• Daily Billing Summary - Daily revenue and charges\n• Monthly Invoice Report - Monthly billing breakdown\n• Payment Status Report - Outstanding and collected payments\n• Usage-Based Billing - Charges based on actual consumption\n\nUsed for financial reconciliation and accounting.",
            screenshot: "[Screenshot: Billing Reports category]"
          },
          {
            name: "End-User Reports",
            description: "User activity and management reports:\n• User Session History - Login/logout times, session duration\n• User Data Consumption - Data usage per user\n• Active/Inactive Users - User status analysis\n• New User Registrations - User growth tracking\n• User Policy Distribution - Policy assignment analysis\n\nUseful for user behavior analysis and support.",
            screenshot: "[Screenshot: End-User Reports category]"
          },
          {
            name: "Wi-Fi Network Reports",
            description: "Network performance and utilization reports:\n• Network Usage Report - Bandwidth consumption trends\n• Device Connection Report - Device connectivity metrics\n• AP Utilization Report - Access point performance\n• Peak Usage Analysis - High-traffic period identification\n\nEssential for capacity planning and optimization.",
            screenshot: "[Screenshot: Wi-Fi Network Reports category]"
          },
          {
            name: "SLA Reports",
            description: "Service level and compliance reports:\n• Uptime/Availability Report - Service availability metrics\n• Response Time Report - Authentication response analysis\n• SLA Compliance Summary - Overall SLA adherence\n• Incident Report - Service disruption documentation\n\nRequired for contract compliance and customer reporting.",
            screenshot: "[Screenshot: SLA Reports category]"
          },
          {
            name: "License Reports",
            description: "License utilization and capacity reports:\n• License Usage Report - Current utilization metrics\n• License Trend Analysis - Usage patterns over time\n• Capacity Planning Report - Future needs projection\n• License Type Distribution - Breakdown by license tier",
            screenshot: "[Screenshot: License Reports category]"
          }
        ]
      },
      {
        type: "steps",
        title: "Report Generation Workflow",
        steps: [
          {
            number: 1,
            title: "Access Reports Page",
            description: "Click 'Reports' in the sidebar navigation. You'll see the Reports dashboard with categorized report cards.",
            screenshot: "[Screenshot: Reports navigation and dashboard]"
          },
          {
            number: 2,
            title: "Browse Report Categories",
            description: "Explore available categories:\n• Billing Reports - Revenue and financial data\n• End-User Reports - User activity and behavior\n• Wi-Fi Network Reports - Network performance\n• SLA Reports - Compliance and service levels\n\nEach category contains multiple specific reports.",
            screenshot: "[Screenshot: Report category cards]"
          },
          {
            number: 3,
            title: "Select Report Type",
            description: "Click on a specific report card. The card shows:\n• Report name and description\n• Estimated generation time\n• Available export formats (CSV, PDF)\n• Required filters and parameters\n\nClick 'Generate' or the card itself to proceed.",
            screenshot: "[Screenshot: Report card with details]"
          },
          {
            number: 4,
            title: "Configure Report Criteria",
            description: "Set filters based on report type:\n• Date Range: Start and end dates for the report period\n• Site Filter: Specific site or all sites (company level)\n• Policy Filter: Include specific user policies only\n• User Filter: Individual user or user group\n• Status Filter: Active, Suspended, Blocked, or all statuses\n• Additional criteria vary by report type",
            screenshot: "[Screenshot: Report criteria form with filters]"
          },
          {
            number: 5,
            title: "Preview Report",
            description: "Click 'Generate Report' to preview data:\n• Data displayed in interactive table format\n• Charts and visualizations where applicable\n• Summary statistics at top\n• Sortable columns for analysis\n• Pagination for large datasets",
            screenshot: "[Screenshot: Report preview with table and chart]"
          },
          {
            number: 6,
            title: "Export Report",
            description: "Choose export format:\n• CSV - Universal format for Excel and data analysis tools\n• PDF - Formatted document for presentations and sharing\n• Excel (.xlsx) - Native Excel with formatting preserved\n\nClick the export button to download the file.",
            screenshot: "[Screenshot: Export format buttons]"
          }
        ]
      },
      {
        type: "section",
        title: "Popular Reports Explained",
        items: [
          {
            name: "Daily Billing Summary",
            description: "Daily breakdown of billing data:\n• Total revenue for the day\n• User charges by policy type\n• New user fees\n• Overage charges\n• Refunds or adjustments\n\nUse for daily reconciliation with finance systems.",
            screenshot: "[Screenshot: Daily billing summary report]"
          },
          {
            name: "User Session History",
            description: "Detailed user session tracking:\n• Login and logout timestamps\n• Session duration\n• Data consumed per session\n• Device used\n• IP address assigned\n\nUseful for troubleshooting and usage auditing.",
            screenshot: "[Screenshot: Session history report]"
          },
          {
            name: "Network Usage Report",
            description: "Network consumption analysis:\n• Daily/weekly/monthly usage trends\n• Peak vs. off-peak consumption\n• Usage by user segment\n• Top consumers identification\n\nEssential for capacity planning and cost optimization.",
            screenshot: "[Screenshot: Network usage trend report]"
          },
          {
            name: "License Usage Report",
            description: "License utilization metrics:\n• Total licenses vs. used\n• Usage percentage over time\n• License type breakdown\n• Projected capacity needs\n\nHelps plan license purchases and identify waste.",
            screenshot: "[Screenshot: License usage report]"
          },
          {
            name: "SLA Compliance Report",
            description: "Service level tracking:\n• Uptime percentage\n• Authentication response times\n• Support ticket response times\n• SLA breach incidents\n• Compliance score\n\nRequired for customer SLA reporting and internal quality monitoring.",
            screenshot: "[Screenshot: SLA compliance dashboard]"
          }
        ]
      },
      {
        type: "tips",
        title: "Report Best Practices",
        items: [
          "Use date ranges wisely - very large date ranges may take longer to generate and produce large files",
          "Apply status and policy filters to focus on specific user groups for targeted analysis",
          "Export to CSV for further analysis in Excel, Python, or BI tools",
          "Schedule recurring reports (if available) for regular compliance requirements",
          "Save frequently used filter combinations for quick access",
          "For presentations, use PDF export which includes formatted charts and branding",
          "Check report generation time estimates before running - some reports may take several minutes"
        ]
      }
    ]
  },

  // ============================================
  // TROUBLESHOOTING ARTICLES
  // ============================================

  "troubleshooting-connection": {
    title: "User Connection Issues",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Quick troubleshooting guide for resolving common user connection and authentication problems. Follow these systematic steps to diagnose and resolve issues efficiently."
      },
      {
        type: "section",
        title: "Common Issues & Solutions",
        items: [
          {
            name: "User Cannot Login",
            solution: "Check the following in order:\n1. User status is 'Active' (not Suspended or Blocked)\n2. Check-in date has passed and check-out date not reached\n3. Credentials match exactly (passwords are case-sensitive)\n4. User's license is active and not exceeded\n5. Device is registered if MAC binding is enabled\n\nMost login issues are resolved by verifying status and credentials."
          },
          {
            name: "Authentication Failed Error",
            solution: "Verify these common causes:\n1. User exists in the system - search by User ID\n2. Password has not been reset without user's knowledge\n3. Account is not locked after failed attempts\n4. Network connectivity between device and authentication server\n5. Time sync issues between systems (RADIUS authentication)\n\nReset password if user confirms credentials are correct but still fails."
          },
          {
            name: "User Blocked Unexpectedly",
            solution: "Investigate these possibilities:\n1. Data quota exceeded - check usage against policy limit\n2. Check-out date reached - review account dates\n3. Manual blocking by another admin - check audit logs\n4. Auto-block rules triggered - review policy rules\n5. Payment issues - check billing status if applicable\n\nReview user's Activity Logs for specific block reason."
          },
          {
            name: "Slow Connection Speed",
            solution: "Investigate speed issues:\n1. Check user's assigned policy speed limit - may be intentionally throttled\n2. Multiple devices sharing bandwidth - user's 5 devices sharing 10 Mbps each\n3. Network congestion on local AP - check AP utilization\n4. Distance from access point - signal strength affects speed\n5. Device limitations - old devices may not support higher speeds\n6. Data cap reached - user may be throttled post-limit"
          },
          {
            name: "Device Not Connecting",
            solution: "Troubleshoot device issues:\n1. MAC address correctly registered - verify exact format\n2. User device limit not exceeded - check current device count\n3. Device type allowed by policy - some policies restrict device types\n4. No duplicate MAC entries - MAC must be unique\n5. Device WiFi enabled and in range\n6. Correct SSID selected"
          },
          {
            name: "Intermittent Disconnections",
            solution: "For random disconnections, check:\n1. Signal strength - user may be at edge of coverage\n2. Session timeout settings - may be too short\n3. Device roaming between APs - roaming configuration\n4. DHCP lease expiry - lease time settings\n5. Device power saving mode - may disconnect to save battery"
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
            description: "Navigate to User Management > Find user by ID or name > Verify status badge is green 'Active'. If Suspended/Blocked, activate the user. If Expired, check dates.",
            screenshot: "[Screenshot: User status badge in user list]"
          },
          {
            number: 2,
            title: "Review User Policy",
            description: "Click on user > View Details > Check policy settings:\n• Speed limit appropriate for user's needs\n• Data volume not exceeded\n• Device limit not reached\n• Data cycle (daily/monthly) reset timing",
            screenshot: "[Screenshot: User policy details panel]"
          },
          {
            number: 3,
            title: "Verify Device Registration",
            description: "Go to Device Management > Search by MAC address > Confirm:\n• Device is registered and shows correct user\n• Device status is Active (not blocked)\n• User's device count within limit",
            screenshot: "[Screenshot: Device list with MAC search]"
          },
          {
            number: 4,
            title: "Check License Availability",
            description: "Review license indicator on User Management page:\n• Green = licenses available\n• Red = at capacity, may prevent authentication\n• Free licenses by blocking inactive users if needed",
            screenshot: "[Screenshot: License ring indicator]"
          },
          {
            number: 5,
            title: "Review Activity Logs",
            description: "Check Activity Logs for the user to see recent events:\n• Failed authentication attempts with error codes\n• Status changes (blocked/suspended events)\n• Policy changes that may have affected access",
            screenshot: "[Screenshot: Activity logs for user]"
          },
          {
            number: 6,
            title: "Reset Credentials",
            description: "If password issues suspected:\n1. Open user actions menu\n2. Select 'Reset Password'\n3. Choose delivery method (email/SMS/display)\n4. Have user try new credentials",
            screenshot: "[Screenshot: Reset password dialog]"
          }
        ]
      },
      {
        type: "tips",
        title: "Prevention Tips",
        items: [
          "Monitor license usage proactively - set alerts at 80% capacity",
          "Set up automated reports to identify users approaching data limits",
          "Regularly review and clean up inactive user accounts to free licenses",
          "Document credential policies and communicate clearly to users",
          "Train reception/help desk staff on basic troubleshooting steps",
          "Use check-in/check-out dates for temporary users to avoid manual cleanup",
          "Enable self-service password reset for users when possible"
        ]
      }
    ]
  },

  "wifi-connectivity-troubleshooting": {
    title: "WiFi Connectivity Troubleshooting",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Comprehensive guide for diagnosing and resolving WiFi connectivity issues including signal problems, slow speeds, disconnections, and authentication failures."
      },
      {
        type: "section",
        title: "Connectivity Issue Types",
        items: [
          {
            name: "Cannot See WiFi Network",
            description: "If user cannot see the SSID:\n• Verify they are within coverage area\n• SSID may be hidden - provide exact network name\n• 5GHz networks may not be visible on older devices\n• Network may be temporarily down - check system alerts",
            solution: "Have user manually add network with exact SSID name if hidden. Verify AP is online in dashboard."
          },
          {
            name: "Connected but No Internet",
            description: "Device shows connected but cannot access internet:\n• Authentication may have failed silently\n• IP address not obtained (DHCP issue)\n• DNS resolution failing\n• Captive portal not completed",
            solution: "Have user 'forget' network and reconnect. Check if captive portal page appears. Verify DHCP pool has available addresses."
          },
          {
            name: "Frequent Disconnections",
            description: "User keeps getting disconnected:\n• Weak signal at their location\n• Interference from other networks\n• Roaming issues between APs\n• Session timeout too short\n• Device power saving mode",
            solution: "Check signal strength at user location. Review session timeout settings. Disable aggressive power saving on device."
          },
          {
            name: "Slow Speeds Despite Good Signal",
            description: "Strong signal but poor performance:\n• User's policy speed limit\n• Too many users on same AP\n• Background traffic consuming bandwidth\n• Channel congestion\n• Old device with limited capabilities",
            solution: "Check user's policy speed limit. Review AP client count. Consider moving user to less congested AP."
          }
        ]
      },
      {
        type: "steps",
        title: "Troubleshooting Workflow",
        steps: [
          {
            number: 1,
            title: "Gather Information",
            description: "Ask user for:\n• User ID or account identifier\n• Device type (laptop, phone, tablet)\n• Location (building, floor, room)\n• Error message (if any)\n• When problem started\n• What were they trying to do",
            screenshot: "[Screenshot: Support intake form]"
          },
          {
            number: 2,
            title: "Check User Account",
            description: "In User Management, verify:\n• Account status is Active\n• Check-in/check-out dates are valid\n• Policy limits not exceeded\n• Device is registered if required",
            screenshot: "[Screenshot: User account verification]"
          },
          {
            number: 3,
            title: "Check Device Status",
            description: "In Device Management:\n• Search for device by MAC address\n• Verify device is registered to user\n• Check device status (Active/Blocked)\n• Check online/offline indicator",
            screenshot: "[Screenshot: Device status check]"
          },
          {
            number: 4,
            title: "Review System Alerts",
            description: "Check dashboard alerts for:\n• Network outages in user's area\n• AP failures or performance issues\n• System-wide problems\n• Recent changes that may affect connectivity",
            screenshot: "[Screenshot: System alerts dashboard]"
          },
          {
            number: 5,
            title: "Test Connectivity",
            description: "Have user attempt:\n1. Forget the network on device\n2. Reconnect to WiFi\n3. Complete captive portal if presented\n4. Try accessing a simple website\n5. Run speed test if connected",
            screenshot: "[Screenshot: Connectivity test steps]"
          },
          {
            number: 6,
            title: "Escalate if Needed",
            description: "If basic troubleshooting fails:\n• Document all steps taken\n• Note specific error messages\n• Record timestamps of failures\n• Contact technical support with details",
            screenshot: "[Screenshot: Escalation form]"
          }
        ]
      },
      {
        type: "section",
        title: "Device-Specific Guidance",
        items: [
          {
            name: "Windows Laptop",
            description: "Common Windows issues:\n• Run 'Network troubleshooter' from Settings\n• Disable and re-enable WiFi adapter\n• Update network drivers\n• Check 'Metered connection' setting is off\n• Clear DNS cache: ipconfig /flushdns"
          },
          {
            name: "MacBook",
            description: "Common Mac issues:\n• Renew DHCP lease in Network preferences\n• Delete network and re-add\n• Reset SMC if persistent issues\n• Check system Firewall settings\n• Update macOS for latest fixes"
          },
          {
            name: "iPhone/iPad",
            description: "Common iOS issues:\n• Toggle WiFi off and on\n• Reset Network Settings (Settings > General > Reset)\n• Disable Private WiFi Address for this network\n• Forget network and reconnect\n• Ensure iOS is updated"
          },
          {
            name: "Android Phone/Tablet",
            description: "Common Android issues:\n• Toggle Airplane mode on/off\n• Forget network and reconnect\n• Check MAC randomization setting\n• Clear WiFi cache in app settings\n• Update device software"
          }
        ]
      },
      {
        type: "tips",
        title: "Quick Fixes",
        items: [
          "80% of connectivity issues are resolved by 'forget network and reconnect'",
          "Password resets solve most 'invalid credentials' errors",
          "Device reboot fixes many unexplained connectivity issues",
          "Verify user is entering correct SSID name (case-sensitive)",
          "Check if problem affects single user or multiple users (isolates device vs. network)",
          "Time-based issues often relate to session timeout or check-out dates"
        ]
      }
    ]
  },

  // ============================================
  // NETWORK CONFIGURATION ARTICLES
  // ============================================

  "policy-setup": {
    title: "Understanding User Policies",
    category: "Network Configuration",
    content: [
      {
        type: "intro",
        text: "User policies define the network access parameters for users including speed limits, data volumes, device allowances, and data cycle configurations. Understanding policies helps you assign appropriate access levels and optimize network resources."
      },
      {
        type: "section",
        title: "Policy Parameters Explained",
        items: [
          {
            name: "Speed Limit (Bandwidth)",
            description: "Maximum download/upload speed allocated to users on this policy:\n• 10 Mbps - Basic tier: Email, light browsing\n• 20 Mbps - Standard tier: General productivity, web apps\n• 30 Mbps - Enhanced tier: Video calls, moderate streaming\n• 50 Mbps - Premium tier: Heavy usage, media work\n• Unlimited - No bandwidth cap (use sparingly)\n\nSpeed limits ensure fair bandwidth distribution across users."
          },
          {
            name: "Data Volume (Data Cap)",
            description: "Total data transfer allowed per cycle:\n• 10 GB - Light users, email only\n• 20 GB - Moderate users, general work\n• 50 GB - Standard users, includes streaming\n• 100 GB - Heavy users, media-intensive work\n• Unlimited - No data restrictions\n\nWhen exhausted, users may be throttled or blocked based on policy configuration."
          },
          {
            name: "Device Limit",
            description: "Maximum concurrent devices per user:\n• 1 device - Restrictive, single point of access\n• 2 devices - Typical: phone + laptop\n• 3 devices - Standard: phone + laptop + tablet\n• 5 devices - Power users with multiple devices\n\nExceeding limit blocks new connections until existing devices disconnect."
          },
          {
            name: "Data Cycle Type",
            description: "When data allowances reset:\n• Daily - Resets at midnight each day. Best for guests, temporary users, high-turnover environments (hotels)\n• Monthly - Resets on 1st of each month. Best for permanent employees, long-term residents\n\nDaily cycles provide natural limits for temporary access; monthly suits regular users."
          }
        ]
      },
      {
        type: "section",
        title: "Policy Tiers by Segment",
        items: [
          {
            name: "Enterprise Policies",
            description: "Typical corporate environment policies:\n• Executive: 50 Mbps, Unlimited data, 5 devices\n• Professional: 30 Mbps, 100 GB, 3 devices\n• Standard: 20 Mbps, 50 GB, 2 devices\n• Contractor: 10 Mbps, 20 GB, 1 device, daily cycle"
          },
          {
            name: "Hotel Policies",
            description: "Hospitality-focused policies:\n• Premium Guest: 50 Mbps, Unlimited, 5 devices\n• Standard Guest: 20 Mbps, 10 GB/day, 3 devices\n• Basic Guest: 10 Mbps, 5 GB/day, 2 devices\n• Staff: 30 Mbps, 50 GB/month, 2 devices"
          },
          {
            name: "Co-Living Policies",
            description: "Residential community policies:\n• Premium Resident: 50 Mbps, Unlimited, 5 devices\n• Standard Resident: 30 Mbps, 100 GB, 3 devices\n• Basic Resident: 20 Mbps, 50 GB, 2 devices"
          },
          {
            name: "CoWorking Policies",
            description: "Flexible workspace policies:\n• Enterprise Member: 50 Mbps, Unlimited, 5 devices\n• Professional Member: 30 Mbps, 100 GB, 3 devices\n• Hot Desk: 20 Mbps, 20 GB/day, 2 devices\n• Day Pass: 10 Mbps, 5 GB/day, 1 device"
          }
        ]
      },
      {
        type: "steps",
        title: "Assigning Policies to Users",
        steps: [
          {
            number: 1,
            title: "Determine User Requirements",
            description: "Assess user's needs:\n• What's their role/position?\n• What applications do they use?\n• How many devices do they need?\n• How long will they have access?",
            screenshot: "[Screenshot: User requirement assessment]"
          },
          {
            number: 2,
            title: "Select Appropriate Policy",
            description: "Match requirements to policy tier:\n• Temporary/Guest → Basic tier with daily cycle\n• Standard employee → Standard tier with monthly cycle\n• Executive/Power user → Premium tier",
            screenshot: "[Screenshot: Policy selection guide]"
          },
          {
            number: 3,
            title: "Apply During User Creation",
            description: "When adding user, select policy from dropdown. All policy parameters are automatically applied to the user.",
            screenshot: "[Screenshot: Policy dropdown in Add User]"
          },
          {
            number: 4,
            title: "Modify Existing User Policy",
            description: "To change policy: User Management > Find user > Edit > Change policy dropdown > Save. Changes take effect within 5 minutes.",
            screenshot: "[Screenshot: Edit user policy]"
          }
        ]
      },
      {
        type: "tips",
        title: "Policy Best Practices",
        items: [
          "Create tiered policies (Basic/Standard/Premium) for clear service differentiation",
          "Use descriptive names indicating purpose and speed (e.g., 'Guest_Basic_10Mbps')",
          "Set realistic data volumes based on actual usage analysis",
          "Use daily cycles for temporary users to limit exposure and abuse",
          "Don't over-provision - match policy to actual user needs",
          "Review policy assignments quarterly and adjust based on usage data",
          "Document which roles/user types should receive which policy tier"
        ]
      }
    ]
  },

  "segment-configuration": {
    title: "Network & Segment Configuration",
    category: "Network Configuration",
    content: [
      {
        type: "intro",
        text: "Learn about segment-specific configurations, device restrictions, license management, and network settings that vary based on your organization's segment type (Enterprise, Hotel, Co-Living, CoWorking, PG, or Miscellaneous)."
      },
      {
        type: "section",
        title: "Segment Types Overview",
        items: [
          {
            name: "Enterprise",
            description: "Corporate office environments:\n• Full user and device management\n• Bulk import for users and devices\n• Permanent and contractor user types\n• Corporate policy tiers\n• Integration with HR systems possible"
          },
          {
            name: "Hotel",
            description: "Hospitality properties:\n• Guest management with check-in/check-out\n• PMS integration capability\n• High-volume bulk import (2000+ guests)\n• Daily data cycles typical\n• Automatic guest expiration"
          },
          {
            name: "Co-Living",
            description: "Residential communities:\n• Resident management with lease dates\n• Building/unit organization\n• Moderate bulk import limits\n• Monthly cycles typical\n• Long-term user focus"
          },
          {
            name: "CoWorking",
            description: "Flexible workspaces:\n• Member management\n• Multiple membership tiers\n• Day pass and hot desk support\n• Mix of daily and monthly users\n• Business-focused policies"
          },
          {
            name: "PG (Paying Guest)",
            description: "Paying guest accommodations:\n• Tenant management\n• Smaller scale operations\n• Limited bulk import (300 users)\n• Monthly cycles typical\n• Basic device management"
          },
          {
            name: "Miscellaneous",
            description: "Other use cases:\n• Flexible configuration\n• General-purpose features\n• Limited IoT device bulk import\n• Standard policy options"
          }
        ]
      },
      {
        type: "section",
        title: "Segment Feature Matrix",
        items: [
          {
            name: "User Bulk Import Limits",
            description: "• Enterprise: 1000 users per import\n• Hotel: 2000 users per import\n• Co-Living: 500 users per import\n• CoWorking: 800 users per import\n• PG: 300 users per import\n• Miscellaneous: 500 users per import"
          },
          {
            name: "User Device Bulk Import",
            description: "• Enterprise: Available (2000 devices)\n• Hotel: Available (3000 devices)\n• Miscellaneous: Available (1000 devices)\n• Co-Living: Not available\n• CoWorking: Not available\n• PG: Not available"
          },
          {
            name: "IoT/Other Device Import",
            description: "• Enterprise: Available (2000 devices)\n• Hotel: Available (3000 devices)\n• Co-Living: Available (1000 devices)\n• CoWorking: Available (1500 devices)\n• PG: Available (600 devices)\n• Miscellaneous: Not available"
          },
          {
            name: "Guest Management",
            description: "• Hotel: Full guest management with PMS integration\n• Enterprise: Guest access for visitors\n• CoWorking: Day pass users\n• Others: Basic temporary user support"
          }
        ]
      },
      {
        type: "section",
        title: "License Capacity Management",
        items: [
          {
            name: "Understanding License Capacity",
            description: "Your license capacity determines maximum concurrent users:\n• Each active user consumes one license\n• Blocked users free their license\n• Expired users automatically free licenses\n• Monitor utilization to avoid hitting limits"
          },
          {
            name: "License Monitoring",
            description: "Monitor license usage through:\n• Dashboard license ring indicator\n• License Usage Report in Reports\n• Alert notifications at 80%, 90%, 95%\n• Capacity planning recommendations"
          },
          {
            name: "Increasing Capacity",
            description: "When approaching limits:\n• Clean up inactive/expired users\n• Request capacity upgrade from Spectra\n• Review utilization trends for planning\n• Consider seasonal capacity needs"
          }
        ]
      },
      {
        type: "section",
        title: "Access Level Configuration",
        items: [
          {
            name: "Site Level Access",
            description: "Users with Site Level access manage a single location:\n• View/manage users at their assigned site only\n• Site-specific reporting and analytics\n• Cannot see other sites in the organization\n• Ideal for location managers and local admins"
          },
          {
            name: "Company Level Access",
            description: "Users with Company Level access manage multiple sites:\n• Aggregated view across all sites\n• Site selector to drill down into specific locations\n• Cross-site reporting and comparison\n• Ideal for regional managers and corporate admins"
          }
        ]
      },
      {
        type: "tips",
        title: "Configuration Tips",
        items: [
          "Configure segment-appropriate policies before onboarding users",
          "Set license capacity alerts at 80% to plan proactively",
          "Use daily cycles for temporary/guest users, monthly for permanent",
          "Enable automatic expiration for temporary user accounts",
          "Review segment limits before planning bulk imports",
          "Consider seasonal patterns when planning capacity"
        ]
      }
    ]
  },

  // ============================================
  // ACCOUNT & SECURITY ARTICLES
  // ============================================

  "password-reset": {
    title: "Password Reset & Account Recovery",
    category: "Account & Security",
    content: [
      {
        type: "intro",
        text: "Guide for network users to reset their WiFi access password, and for administrators to help users recover their account credentials. Password reset is a common support task and is designed to be simple and secure."
      },
      {
        type: "section",
        title: "For Network Users (Self-Service)",
        items: [
          {
            name: "Via Captive Portal",
            description: "If your network has a captive portal with self-service:\n1. Connect to the WiFi network\n2. Open your browser - captive portal appears\n3. Click 'Forgot Password' link\n4. Enter your User ID or email address\n5. Receive password reset link via email/SMS\n6. Click link and create new password\n7. Login with new credentials"
          },
          {
            name: "Via Email Request",
            description: "If self-service isn't available:\n1. Contact your network administrator\n2. Provide your User ID and verification info\n3. Administrator will reset and send new credentials\n4. Check email or SMS for new password\n5. Login and consider changing password"
          }
        ]
      },
      {
        type: "steps",
        title: "For Administrators (Resetting User Passwords)",
        steps: [
          {
            number: 1,
            title: "Verify User Identity",
            description: "Before resetting, verify the requestor's identity:\n• Confirm User ID matches their records\n• Verify email or phone matches account\n• For phone requests, ask security questions\n• For in-person, verify ID if possible",
            screenshot: "[Screenshot: User verification]"
          },
          {
            number: 2,
            title: "Locate User Account",
            description: "Navigate to User Management and search for the user:\n• Search by User ID, name, email, or mobile\n• Verify you found the correct account\n• Note current account status",
            screenshot: "[Screenshot: User search results]"
          },
          {
            number: 3,
            title: "Open Actions Menu",
            description: "Click the three-dot menu icon on the user row to open the actions dropdown.",
            screenshot: "[Screenshot: Actions menu]"
          },
          {
            number: 4,
            title: "Select Reset Password",
            description: "Click 'Reset Password' from the dropdown menu. This opens the password reset modal.",
            screenshot: "[Screenshot: Reset Password option]"
          },
          {
            number: 5,
            title: "Choose Delivery Method",
            description: "Select how to deliver the new password:\n• Email: Sends to registered email (recommended)\n• SMS: Sends to registered mobile number\n• Display: Shows on screen for verbal delivery\n\nEmail provides best audit trail.",
            screenshot: "[Screenshot: Delivery method selection]"
          },
          {
            number: 6,
            title: "Generate and Send",
            description: "Click 'Reset' to:\n• Generate a secure random password\n• Send via selected method\n• Log the reset action for audit\n• Display confirmation",
            screenshot: "[Screenshot: Reset confirmation]"
          },
          {
            number: 7,
            title: "Confirm with User",
            description: "Follow up with user:\n• Confirm they received the new password\n• Advise them to change it if self-service available\n• Note any delivery issues for future reference",
            screenshot: "[Screenshot: User confirmation]"
          }
        ]
      },
      {
        type: "section",
        title: "Password Security Guidelines",
        items: [
          {
            name: "Generated Passwords",
            description: "System-generated passwords are:\n• 12+ characters long\n• Mix of uppercase, lowercase, numbers, symbols\n• Randomly generated (not predictable)\n• Unique for each reset"
          },
          {
            name: "User Responsibilities",
            description: "Users should:\n• Keep passwords confidential\n• Not share with others\n• Use different passwords for different services\n• Report suspected compromise immediately"
          },
          {
            name: "Administrator Guidelines",
            description: "Administrators should:\n• Always verify identity before reset\n• Use email delivery when possible for audit\n• Not use 'Display' option in public settings\n• Log unusual reset requests"
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Always verify user identity before performing password reset",
          "Prefer email delivery for audit trail and security",
          "If using 'Display' option, ensure privacy",
          "Document multiple reset requests for same user - may indicate issue",
          "Encourage users to use unique, memorable passwords",
          "Check if user's email/phone is correct before sending"
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Password reset email not received",
            solution: "Check spam/junk folder. Verify email address is correct in user profile. Try SMS delivery instead. If corporate email, check if external emails are blocked by IT policy."
          },
          {
            issue: "SMS not received",
            solution: "Verify mobile number is correct (10 digits, no country code). Check if phone has signal. Try email delivery instead. SMS may be delayed during high traffic."
          },
          {
            issue: "New password doesn't work",
            solution: "Ensure user is copying password exactly (no extra spaces). Passwords are case-sensitive. Try the reset again - previous password may not have been generated properly."
          },
          {
            issue: "Account locked after failed attempts",
            solution: "Wait for lockout period to expire (typically 15-30 minutes), or administrator can manually unlock the account. Then perform password reset."
          }
        ]
      }
    ]
  },

  "roles-permissions": {
    title: "Understanding Roles & Permissions",
    category: "Account & Security",
    content: [
      {
        type: "intro",
        text: "The portal uses a role-based access control (RBAC) system to manage what users can see and do. Understanding roles and permissions helps administrators assign appropriate access levels and helps users understand their capabilities."
      },
      {
        type: "section",
        title: "Customer Portal Roles",
        items: [
          {
            name: "Administrator",
            description: "Full access to all portal features:\n• Create, edit, delete users and devices\n• Access all reports and analytics\n• Manage guest accounts (create, edit, extend)\n• View activity logs\n• Configure settings (where applicable)\n• Manage notifications\n• Access Knowledge Center and Support\n\nIdeal for: IT administrators, facility managers, network managers"
          },
          {
            name: "Manager",
            description: "Broad access with some limitations:\n• Create, edit users and devices\n• View reports and analytics\n• Manage guest accounts (create, edit, extend)\n• View activity logs\n• Cannot manage system notifications\n\nIdeal for: Department managers, team leads, operations staff"
          },
          {
            name: "User",
            description: "Limited read access:\n• View users and devices (read-only)\n• View reports (read-only)\n• View guest accounts (cannot modify)\n• View support tickets\n• Access Knowledge Center\n• Cannot create or modify users/devices/guests\n\nIdeal for: Help desk staff, reception, read-only monitoring"
          },
          {
            name: "Demo",
            description: "Demonstration account with simulated full access:\n• Same permissions as Administrator\n• Used for training and demonstrations\n• Actions may be logged differently\n• May have watermarks or demo indicators"
          }
        ]
      },
      {
        type: "section",
        title: "Permission Categories",
        items: [
          {
            name: "User Management Permissions",
            description: "• canViewUsers - View user list and details\n• canEditUsers - Create, edit, delete users\n• canViewLogs - Access activity logs"
          },
          {
            name: "Device Management Permissions",
            description: "• canManageDevices - Register, edit, remove devices"
          },
          {
            name: "Guest Management Permissions",
            description: "• canViewGuestManagement - View guest accounts\n• canManageGuests - Create, edit, delete guests\n• canExtendGuestStay - Extend guest check-out dates"
          },
          {
            name: "Reporting Permissions",
            description: "• canViewReports - Access reports and analytics\n• canExportReports - Export data to CSV/PDF"
          },
          {
            name: "Support Permissions",
            description: "• canViewSupportTickets - View support tickets\n• canCreateSupportTickets - Create new support tickets"
          },
          {
            name: "System Permissions",
            description: "• canManageNotifications - Configure notification settings"
          }
        ]
      },
      {
        type: "section",
        title: "Access Levels",
        items: [
          {
            name: "Site Level Access",
            description: "Access limited to a single site/location:\n• Can only view/manage users at assigned site\n• Reports show only site-specific data\n• Cannot see other sites in organization\n• Appropriate for location managers"
          },
          {
            name: "Company Level Access",
            description: "Access across multiple sites:\n• View aggregated data across all sites\n• Site selector to drill into specific locations\n• Cross-site reporting and comparison\n• Appropriate for corporate/regional managers"
          }
        ]
      },
      {
        type: "section",
        title: "Role Assignment Best Practices",
        items: [
          {
            name: "Principle of Least Privilege",
            description: "Assign the minimum role needed for the job:\n• Help desk viewing issues? → User role\n• Managing daily users? → Manager role\n• Full system administration? → Administrator role"
          },
          {
            name: "Role Documentation",
            description: "Document who has what role:\n• Maintain a list of Administrators\n• Review role assignments quarterly\n• Remove access when employees leave or change roles"
          },
          {
            name: "Audit Trail",
            description: "All actions are logged with role information:\n• Activity logs show who did what\n• Use for troubleshooting and compliance\n• Review logs for suspicious activity"
          }
        ]
      },
      {
        type: "tips",
        title: "Tips",
        items: [
          "Start users with lower role and upgrade if needed",
          "Use Manager role for day-to-day operations staff",
          "Reserve Administrator for IT and security personnel",
          "Review role assignments when employees change positions",
          "Use activity logs to audit actions by role",
          "Train users on their role's capabilities and limitations"
        ]
      }
    ]
  },

  // ============================================
  // KNOWLEDGE CENTER & SUPPORT ARTICLES
  // ============================================

  "reports-overview": {
    title: "Reports Overview",
    category: "Reports & Analytics",
    content: [
      {
        type: "intro",
        text: "The Reports module provides comprehensive reporting capabilities for network usage, user activity, billing, compliance, and operational metrics. This overview helps you navigate the available reports and understand when to use each type."
      },
      {
        type: "section",
        title: "Report Categories",
        items: [
          {
            name: "Billing Reports",
            description: "Financial and billing-focused reports for revenue tracking and reconciliation. Includes daily summaries, monthly invoices, payment status, and usage-based billing calculations."
          },
          {
            name: "User Reports",
            description: "User activity and management reports covering session history, data consumption, user growth, status changes, and policy distribution analysis."
          },
          {
            name: "Network Reports",
            description: "Network performance and utilization reports including bandwidth consumption, device connectivity, access point utilization, and peak usage analysis."
          },
          {
            name: "SLA Reports",
            description: "Service level agreement compliance reports tracking uptime, response times, incident reports, and overall SLA adherence metrics."
          },
          {
            name: "License Reports",
            description: "License utilization reports showing current usage, historical trends, capacity planning projections, and license type distribution."
          }
        ]
      },
      {
        type: "section",
        title: "Common Report Use Cases",
        items: [
          {
            name: "Monthly Executive Summary",
            description: "For management reporting:\n• Network Usage Report (monthly trend)\n• License Usage Report (utilization)\n• SLA Compliance Summary\n• User Growth Report"
          },
          {
            name: "Daily Operations",
            description: "For daily monitoring:\n• Daily Billing Summary\n• Active User Report\n• Alert Summary Report\n• Connection Failures Report"
          },
          {
            name: "Troubleshooting",
            description: "For issue investigation:\n• User Session History (specific user)\n• Device Connection Report\n• Authentication Failure Report\n• Error Log Report"
          },
          {
            name: "Capacity Planning",
            description: "For growth planning:\n• License Trend Analysis\n• Network Utilization Forecast\n• User Growth Projection\n• Peak Usage Analysis"
          }
        ]
      },
      {
        type: "tips",
        title: "Report Tips",
        items: [
          "Start with appropriate date range - longer ranges take more time",
          "Use filters to focus on specific user segments or policies",
          "Export to CSV for further analysis in Excel or BI tools",
          "Schedule recurring reports for regular compliance needs",
          "Use PDF export for formatted presentations and sharing"
        ]
      }
    ]
  },

  "registering-devices": {
    title: "Device Registration Guide",
    category: "Device Management",
    content: [
      {
        type: "intro",
        text: "Complete guide to registering devices on your network, including user devices (laptops, phones, tablets) and infrastructure devices (printers, cameras, IoT sensors). Proper device registration ensures secure network access and accurate tracking."
      },
      {
        type: "section",
        title: "When to Register Devices",
        items: [
          {
            name: "User Devices",
            description: "Register user devices when:\n• New employee receives company laptop\n• User wants to connect personal device\n• Contractor needs temporary device access\n• Executive needs multiple device access"
          },
          {
            name: "Infrastructure Devices",
            description: "Register infrastructure devices when:\n• Installing new network printers\n• Deploying IP cameras\n• Adding IoT sensors\n• Configuring digital signage"
          }
        ]
      },
      {
        type: "steps",
        title: "Registration Steps",
        steps: [
          {
            number: 1,
            title: "Gather Device Information",
            description: "Before registering, collect:\n• MAC address (from device settings or label)\n• Device type (laptop, phone, printer, etc.)\n• Owner information (for user devices)\n• Location (for infrastructure devices)"
          },
          {
            number: 2,
            title: "Navigate to Device Management",
            description: "Click 'Device Management' or 'Devices' in the sidebar navigation."
          },
          {
            number: 3,
            title: "Click Register Device",
            description: "Click the 'Register Device' or '+ Add Device' button in the toolbar."
          },
          {
            number: 4,
            title: "Enter MAC Address",
            description: "Input the device MAC address. Supported formats:\n• AA:BB:CC:DD:EE:FF\n• AA-BB-CC-DD-EE-FF\n• AABBCCDDEEFF"
          },
          {
            number: 5,
            title: "Select Device Type and Mode",
            description: "Choose device type and registration mode:\n• User devices: Bind to existing user account\n• Infrastructure: Create as device user with own credentials"
          },
          {
            number: 6,
            title: "Complete and Submit",
            description: "Add device name, priority, and other details. Click 'Register' to complete."
          }
        ]
      },
      {
        type: "tips",
        title: "Registration Tips",
        items: [
          "Double-check MAC address before submitting - it cannot be changed after registration",
          "Use descriptive device names (include location or user name)",
          "Set appropriate priority for critical devices",
          "Register infrastructure devices as device users with their own credentials"
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

export const getAllCategories = () => {
  const categories = new Set();
  Object.values(knowledgeArticles).forEach(article => {
    if (article.category) {
      categories.add(article.category);
    }
  });
  return Array.from(categories);
};

export default knowledgeArticles;
