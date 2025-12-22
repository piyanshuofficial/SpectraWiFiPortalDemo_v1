// src/constants/chatbotKnowledge.js
// Comprehensive knowledge base for Spectra Genie chatbot
// Supports both internal portal and customer portal with segment/role awareness

/**
 * IMPORTANT: Customer portal responses must NEVER expose:
 * - Segment names or identifiers
 * - Internal terminology about segments
 * - Information about other customers
 * - Internal operational procedures
 */

// ============================================
// CUSTOMER PORTAL KNOWLEDGE BASE
// ============================================
export const customerKnowledge = {
  // ============================================
  // ACCOUNT & LOGIN
  // ============================================
  "password reset": {
    response: "I can help you reset your password! Here's how:\n\n1. Go to the login page and click 'Forgot Password'\n2. Enter your registered email address\n3. Check your inbox (and spam folder) for the reset link\n4. Click the link and create a new secure password\n\nThe reset link is valid for 24 hours. If you don't receive it within 5 minutes, try again or contact your administrator.\n\nNeed help with something else?",
    category: "Account",
    keywords: ["forgot", "password", "reset", "recover", "cant login", "forgotten"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "login issue": {
    response: "Let's troubleshoot your login issue step by step:\n\n1. Double-check your email address for typos\n2. Make sure Caps Lock is turned off\n3. Try clicking 'Show Password' to verify what you're typing\n4. Clear your browser cache: Settings > Privacy > Clear Data\n5. Try using an incognito/private window\n6. Test with a different browser (Chrome, Firefox, Edge)\n\nStill having trouble? Your account might be locked after multiple failed attempts. Contact your administrator to unlock it.\n\nWould you like me to help with password reset instead?",
    category: "Account",
    keywords: ["login", "cant", "unable", "access", "locked", "sign in", "authentication"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "change password": {
    response: "To change your password while logged in:\n\n1. Click your profile icon in the top-right corner\n2. Select 'Account Settings'\n3. Navigate to the 'Security' tab\n4. Click 'Change Password'\n5. Enter your current password for verification\n6. Create your new password and confirm it\n7. Click 'Save Changes'\n\nPassword requirements:\n- Minimum 8 characters\n- At least one uppercase letter (A-Z)\n- At least one lowercase letter (a-z)\n- At least one number (0-9)\n- Special characters recommended (!@#$%)\n\nYour session will remain active after the change.",
    category: "Account",
    keywords: ["change", "update", "new password", "modify", "security"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "account settings": {
    response: "You can manage your account settings by:\n\n1. Clicking your profile icon (top-right corner)\n2. Selecting 'Account Settings'\n\nFrom there, you can:\n- Update your profile information\n- Change your password\n- Manage notification preferences\n- View your activity history\n- Configure two-factor authentication\n\nNeed help with a specific setting?",
    category: "Account",
    keywords: ["settings", "profile", "account", "preferences", "configuration"],
    roles: ["admin", "manager", "user", "demo"],
  },

  // ============================================
  // USER MANAGEMENT
  // ============================================
  "add user": {
    response: "To add a new user to the system:\n\n1. Go to 'User Management' from the sidebar\n2. Click 'Add User' button (blue button with + icon)\n3. Fill in the required information:\n   - User ID (unique identifier - cannot be changed after creation)\n   - Full name\n   - Email address (used for notifications and password reset)\n   - Mobile number (10 digits, for credential delivery)\n   - Department/Location\n4. Assign a user policy that defines:\n   - Speed limit (10-50 Mbps or Unlimited)\n   - Data volume (10GB-100GB or Unlimited)\n   - Device limit (1-5 devices)\n   - Data cycle (Daily or Monthly)\n5. Set check-in/check-out dates for temporary users (optional)\n6. Click 'Submit' to create the user\n\nThe user will receive their credentials via email/SMS.\n\nNote: You need Administrator or Manager role to add users.",
    category: "User",
    keywords: ["add user", "create user", "new user", "invite", "onboard", "register user"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Adding users requires Administrator or Manager privileges. Please contact your administrator if you need to add new users.",
    },
  },
  "edit user": {
    response: "To edit an existing user:\n\n1. Go to 'User Management' from the sidebar\n2. Find the user using search or filters\n3. Click the three-dot menu (⋮) in the user's row\n4. Select 'Edit' from the dropdown\n5. Modify the user information:\n   - Update name, email, phone\n   - Change policy assignment\n   - Modify check-in/check-out dates\n   - Update department/location\n6. Click 'Save' to apply changes\n\nNote: User ID cannot be changed after creation. Changes take effect within 2-5 minutes.",
    category: "User",
    keywords: ["edit user", "modify user", "update user", "change user"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Editing users requires Administrator or Manager privileges. Please contact your administrator for user modifications.",
    },
  },
  "user role": {
    response: "Understanding user roles and permissions in the portal:\n\n**Administrator**\n- Full access to all features\n- Manage users, devices, and settings\n- Access all reports and configurations\n- Assign roles to other users\n\n**Manager**\n- Manage users and devices within scope\n- View and export reports\n- Cannot configure system settings\n- Cannot manage other managers or admins\n\n**User (Standard)**\n- View-only access to dashboards\n- Can view own devices and usage\n- Cannot manage users or devices\n- Can create support tickets\n\n**Viewer**\n- Read-only access to assigned areas\n- Cannot make any changes\n- Limited reporting access\n\nTo change a user's role, go to User Management > Select User > Edit > Change Role.\n\nNote: Only Administrators can assign roles.",
    category: "User",
    keywords: ["role", "permission", "access level", "admin", "manager", "rights", "privileges"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "delete user": {
    response: "To remove a user from the system:\n\n1. Go to 'User Management'\n2. Find and select the user\n3. Click the three-dot menu (⋮) and select 'Delete' or the trash icon\n4. Confirm the deletion\n\n**Before deleting, consider:**\n- All user's devices will be unregistered\n- User's activity logs are preserved for audit\n- This action cannot be undone\n\n**Alternative:** You can 'Block' instead of delete to preserve the account for potential reactivation. Blocked users free up licenses but retain their data.\n\nNote: You cannot delete your own account or accounts with higher privileges.",
    category: "User",
    keywords: ["delete", "remove user", "deactivate", "disable account"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Deleting users requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "block user": {
    response: "To block or suspend a user from WiFi access:\n\n1. Go to 'User Management' from the sidebar\n2. Find the user using search or filters\n3. Click the three-dot menu (⋮) in the user's row\n4. Select 'Block User' or 'Suspend User'\n5. Confirm the action\n\n**What happens when a user is blocked:**\n- All their registered devices are immediately disconnected\n- They cannot log in to the portal\n- Their devices cannot connect to WiFi\n- The license is freed up for reuse\n- Account data is preserved for records\n\n**Suspend vs Block:**\n- Suspend: Temporary hold, keeps license consumed\n- Block: Permanent block, frees license\n\n**To unblock a user:**\n1. Go to User Management\n2. Filter by 'Blocked' status or search for the user\n3. Click on the user and select 'Unblock User' or 'Activate'\n\nNote: You need Admin or Manager privileges to block users.",
    category: "User",
    keywords: ["block user", "suspend user", "ban user", "disable user", "restrict user", "block", "suspend", "ban", "deactivate"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Blocking users requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "bulk import users": {
    response: "To import multiple users at once using CSV:\n\n1. Go to 'User Management' from the sidebar\n2. Click 'Bulk Import' button in the toolbar\n3. Download the CSV template (includes required columns and format)\n4. Fill the template with user data:\n   - username (required): Unique identifier\n   - email (required): Valid email address\n   - fullName (required): User's display name\n   - phone: Mobile number (10 digits)\n   - policy (required): Must match existing policy name\n   - checkInDate/checkOutDate: For temporary users (YYYY-MM-DD)\n5. Upload the completed CSV file\n6. Click 'Validate File' to check for errors\n7. Fix any validation errors and re-upload if needed\n8. Click 'Import X Users' to create all accounts\n\n**Import limits vary based on your service tier.**\n\nNote: Ensure sufficient licenses are available before importing.",
    category: "User",
    keywords: ["bulk import", "csv import", "mass import", "import users", "batch import", "excel import"],
    roles: ["admin", "manager"],
    segmentRestrictions: {
      office: "Bulk user import is not available for your service configuration. Please add users individually.",
      pg: "Bulk user import is not available for your service configuration. Please add users individually.",
    },
    roleMessage: {
      user: "Bulk import requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "user policy": {
    response: "User policies define network access parameters:\n\n**Policy Components:**\n\n**Speed Limit (Bandwidth)**\n- Controls maximum download/upload speed\n- Options: 10 Mbps, 20 Mbps, 30 Mbps, 50 Mbps, Unlimited\n\n**Data Volume (Data Cap)**\n- Total data allowed per cycle\n- Options: 10 GB, 20 GB, 50 GB, 100 GB, Unlimited\n- When exceeded, user may be throttled or blocked\n\n**Device Limit**\n- Maximum simultaneous device connections\n- Options: 1-5 devices per user\n- Exceeding blocks new connections\n\n**Data Cycle Type**\n- Daily: Resets at midnight\n- Monthly: Resets on 1st of month\n\n**To change a user's policy:**\n1. Go to User Management\n2. Find and edit the user\n3. Select new policy values\n4. Save changes (takes effect within 5 minutes)\n\nNote: Only Administrators and Managers can modify policies.",
    category: "User",
    keywords: ["policy", "bandwidth", "speed limit", "data limit", "device limit", "quota", "fair usage"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "license management": {
    response: "License management controls how many users can be active:\n\n**Understanding Licenses:**\n- Total Capacity: Maximum concurrent active users\n- Active Users: Currently provisioned accounts\n- Available: Remaining slots for new users\n\n**License Utilization Indicators:**\n- Green (0-70%): Healthy capacity\n- Yellow (71-85%): Approaching limit, plan ahead\n- Red (86-100%): Near or at limit, immediate action needed\n\n**Freeing Up Licenses:**\n- Block inactive users (not connected in 30+ days)\n- Remove expired temporary accounts\n- Check for users with past check-out dates\n\n**To check license status:**\n- View the license ring on Dashboard\n- Check User Management header stats\n- Run License Usage Report\n\n**Need more licenses?**\nContact your Spectra account manager or support team to discuss capacity upgrades.",
    category: "User",
    keywords: ["license", "capacity", "limit reached", "no more users", "license full", "upgrade license"],
    roles: ["admin", "manager", "user", "demo"],
  },

  // ============================================
  // DEVICE MANAGEMENT
  // ============================================
  "add device": {
    response: "Here's how to register a new device:\n\n1. Navigate to 'Device Management' from the sidebar\n2. Click the 'Register Device' button (top-right)\n3. Enter the device's MAC address (format: XX:XX:XX:XX:XX:XX)\n4. Choose the device type:\n   - User Devices: Laptop, Mobile, Tablet\n   - Digital Devices: Printer, Camera, IoT, Smart TV\n5. Select registration mode:\n   - Bind to Existing User: Links to a user account\n   - Create as Device User: Standalone device account\n6. If binding to user, search and select the user\n7. Provide a friendly device name (e.g., 'John's Laptop')\n8. Set priority (High/Medium/Low) for QoS\n9. Click 'Register' to complete\n\nYour device will appear in the list immediately and can connect to WiFi within 2-3 minutes.\n\n**Finding MAC Address:**\n- Windows: ipconfig /all (look for Physical Address)\n- Mac: System Preferences > Network > WiFi > Advanced\n- iPhone/iPad: Settings > General > About > WiFi Address\n- Android: Settings > About Phone > Status",
    category: "Device",
    keywords: ["add", "register", "new device", "connect", "mac address", "register device"],
    roles: ["admin", "manager"],
    segmentRestrictions: {
      office: "Adding user devices is not available for your service configuration. Please contact your administrator for device registration.",
      hotel: "Adding user devices is not available for your service configuration. Devices are managed through the guest system.",
      pg: "Adding user devices is not available for your service configuration. Please contact your administrator.",
    },
    roleMessage: {
      user: "Device registration requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "device not connecting": {
    response: "Let's get your device connected! Try these steps:\n\n**1. Verify Registration:**\n- Go to Device Management\n- Search for your device's MAC address\n- Ensure it shows as 'Active' (not blocked)\n\n**2. On Your Device:**\n- Turn WiFi off and on\n- Forget the network, then reconnect\n- Make sure you're selecting the correct network name\n\n**3. Check These Common Issues:**\n- Are you within range of an access point?\n- Has the user exceeded their device limit?\n- Is the MAC address entered correctly?\n- Is MAC randomization disabled on your device?\n\n**4. Advanced Troubleshooting:**\n- Restart your device\n- Check for MAC randomization (disable it)\n- Try connecting at a different location\n- Wait 5 minutes for changes to propagate\n\n**Still not working?** The network might be experiencing issues. Contact your network administrator for assistance.",
    category: "Device",
    keywords: ["not connecting", "cant connect", "wifi issue", "connection problem", "offline", "no internet"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "block device": {
    response: "To block a device from the network:\n\n1. Go to 'Device Management'\n2. Find the device using search or filters\n3. Click the three-dot menu (⋮) in the device row\n4. Click 'Block' or 'Block Device'\n5. Confirm the blocking action\n\n**What happens when blocked:**\n- The device is immediately disconnected\n- It cannot reconnect until unblocked\n- The device remains in your list with 'Blocked' status\n- No impact on other devices owned by the same user\n\n**To unblock:** Follow the same steps and click 'Unblock'\n\nNote: You need appropriate permissions (Admin/Manager) to block devices.",
    category: "Device",
    keywords: ["block", "disconnect", "remove", "ban", "restrict", "block device"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Blocking devices requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "device limit": {
    response: "Device limits are set based on user policy:\n\n**Typical Limits:**\n- Basic Policy: 1-2 devices\n- Standard Policy: 2-3 devices\n- Premium Policy: 3-5 devices\n\n**To check your current usage:**\n1. Go to Device Management\n2. Search for the user\n3. View their registered device count\n\n**Reached the limit? Options:**\n- Remove unused devices to free up slots\n- Request a limit increase from your administrator\n- Upgrade user policy for more devices\n\n**To remove a device:**\n1. Go to Device Management\n2. Find the device to remove\n3. Click the delete icon or select 'Remove'\n\nTip: Regularly review and remove devices that are no longer in use!",
    category: "Device",
    keywords: ["limit", "maximum", "how many", "too many devices", "exceeded", "device count"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "mac address": {
    response: "Here's how to find your device's MAC address:\n\n**Windows:**\n1. Press Win + R, type 'cmd', press Enter\n2. Type 'ipconfig /all' and press Enter\n3. Look for 'Physical Address' under your WiFi adapter\n\n**Mac:**\n1. Click Apple menu > System Preferences\n2. Click Network > WiFi > Advanced\n3. MAC address is listed as 'WiFi Address'\n\n**iPhone/iPad:**\n1. Go to Settings > General > About\n2. Look for 'WiFi Address'\n\n**Android:**\n1. Go to Settings > About Phone\n2. Tap 'Status' or 'Hardware Information'\n3. Look for 'WiFi MAC Address'\n\n**Important Notes:**\n- MAC format: AA:BB:CC:DD:EE:FF (12 hex characters)\n- Some devices use MAC randomization - you may need to disable it\n- Each network adapter (WiFi, Ethernet) has a different MAC",
    category: "Device",
    keywords: ["mac address", "find mac", "physical address", "hardware address", "locate mac"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "bulk import devices": {
    response: "To import multiple devices at once:\n\n1. Go to 'Device Management' from the sidebar\n2. Click 'Bulk Import' in the toolbar\n3. Download the appropriate template:\n   - User Devices: For laptops, phones, tablets\n   - Other/IoT Devices: For printers, cameras, sensors\n4. Fill the template with device data:\n   - MAC address (required)\n   - Device type (required)\n   - Device name\n   - Assigned user (for user devices)\n   - Priority (high/medium/low)\n5. Upload the completed CSV file\n6. Click 'Validate' to check for errors\n7. Fix any errors and re-upload if needed\n8. Click 'Import' to register all devices\n\n**Import limits vary based on your service tier.**\n\nNote: MAC addresses must be unique across the network.",
    category: "Device",
    keywords: ["bulk import devices", "import devices", "csv devices", "mass device registration"],
    roles: ["admin", "manager"],
    segmentRestrictions: {
      office: "Bulk device import is not available for your service configuration.",
      pg: "Bulk device import is not available for your service configuration.",
    },
    roleMessage: {
      user: "Bulk import requires Administrator or Manager privileges.",
    },
  },

  // ============================================
  // GUEST MANAGEMENT
  // ============================================
  "add guest": {
    response: "To create a guest account for temporary WiFi access:\n\n1. Go to 'Guest Management' from the sidebar\n2. Click 'Add Guest' button\n3. Enter guest details:\n   - Guest name (required)\n   - Email address (for credential delivery)\n   - Mobile number (for SMS credentials)\n   - Company/Organization (optional)\n   - Purpose of visit (optional)\n4. Set access period:\n   - Check-in date: When access begins\n   - Check-out date: When access automatically expires\n5. Select guest policy (Basic/Standard/Premium)\n6. Click 'Create Guest'\n7. Credentials are generated automatically\n8. Choose how to deliver credentials:\n   - Email: Send to guest's email\n   - SMS: Text to guest's mobile\n   - Print: Generate printable slip\n   - Display: Show on screen\n\n**Guest accounts expire automatically on check-out date.**",
    category: "Guest",
    keywords: ["add guest", "create guest", "visitor", "temporary access", "guest wifi", "guest account"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Creating guest accounts requires Administrator or Manager privileges. Please contact your administrator.",
    },
  },
  "extend guest stay": {
    response: "To extend a guest's WiFi access:\n\n1. Go to 'Guest Management' from the sidebar\n2. Find the guest account using search\n3. Click the three-dot menu (⋮) in the guest row\n4. Select 'Extend Stay' or 'Edit'\n5. Set the new check-out date\n6. Click 'Confirm' or 'Save'\n\n**Important Notes:**\n- New date must be after current date\n- If guest is already expired, extending will reactivate them\n- No new credentials needed - existing login still works\n- Usage history is preserved\n\nNote: Only Administrators and Managers can extend guest stays.",
    category: "Guest",
    keywords: ["extend guest", "extend stay", "prolong visit", "guest extension", "renew guest"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Extending guest stays requires Administrator or Manager privileges.",
    },
  },

  // ============================================
  // REPORTS & ANALYTICS
  // ============================================
  "generate report": {
    response: "Here's how to generate and view reports:\n\n1. Click 'Reports' in the sidebar\n2. Browse report categories:\n   - Billing Reports: Revenue, invoices, payments\n   - End-User Reports: Activity, registrations, usage\n   - Wi-Fi Network Reports: Bandwidth, connections, performance\n   - SLA Reports: Uptime, compliance, incidents\n   - License Reports: Utilization, capacity, trends\n\n3. Click on any report to configure it\n4. Set filters:\n   - Date range (start and end dates)\n   - Status filter (Active/Suspended/Blocked)\n   - Policy filter (specific policies)\n5. Click 'Generate Report' to view data\n6. Use 'Export' to download:\n   - CSV: For Excel and data analysis\n   - PDF: Formatted document for sharing\n   - Excel: Native format with charts\n\nTip: Bookmark frequently used reports for quick access!",
    category: "Reports",
    keywords: ["report", "generate", "analytics", "statistics", "data", "export"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "export data": {
    response: "To export your data from the portal:\n\n**From Reports:**\n1. Open any report\n2. Click 'Export' button (usually top-right)\n3. Choose format: CSV, PDF, or Excel\n4. Download starts automatically\n\n**From User/Device Lists:**\n1. Go to User Management or Device Management\n2. Apply any filters if needed\n3. Click 'Export' in the toolbar\n4. Choose columns to include\n5. Select format and download\n\n**Export Formats:**\n- CSV: Best for data analysis in Excel/Sheets\n- PDF: Professional formatted document\n- Excel (.xlsx): Native Excel with formatting\n\n**Note:** Large exports may take a few moments to generate.\n\nPermission required: canExportData (Admin, Manager roles)",
    category: "Reports",
    keywords: ["export", "download", "csv", "pdf", "excel", "save data"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Data export requires Administrator or Manager privileges.",
    },
  },
  "dashboard": {
    response: "The Dashboard provides a quick overview of your network:\n\n**Overview Cards:**\n- Active Users: Current user count with trend\n- License Usage: Utilization percentage and status\n- Data Usage: Network consumption this period\n- Connected Devices: Online device count\n- System Alerts: Issues requiring attention\n\n**Charts & Analytics:**\n- Network Usage Trend (90-day history)\n- License Distribution by type\n- User Activity patterns\n- Alert breakdown by severity\n\n**Quick Actions:**\n- Add User: Create new user account\n- View All Users: Go to User Management\n- Generate Report: Access reports dashboard\n- Get Support: Contact help desk\n\n**Multi-Site (Company Level):**\nIf you manage multiple locations, use the site selector dropdown to view specific site data or aggregated metrics.\n\nClick any card or chart for detailed drill-down information.",
    category: "Reports",
    keywords: ["dashboard", "overview", "home", "summary", "metrics", "analytics"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "activity logs": {
    response: "Activity Logs track all actions in the portal:\n\n**Accessing Logs:**\n1. Click 'Activity Logs' in the sidebar\n2. View the chronological list of actions\n\n**What's Logged:**\n- User actions: Login, logout, password changes\n- Admin actions: User creation, edits, deletions\n- Device actions: Registration, blocking, removal\n- Status changes: Activations, suspensions, blocks\n- System events: Alerts, configuration changes\n\n**Using Filters:**\n- Date range: Filter by time period\n- Action type: Filter by specific actions\n- User: Filter by who performed the action\n- Target: Filter by affected user/device\n\n**Export Logs:**\nClick 'Export' to download logs as CSV for audit purposes.\n\nNote: Administrators and Managers can view all logs. Users may have limited access.",
    category: "Reports",
    keywords: ["activity logs", "audit trail", "history", "actions", "audit logs"],
    roles: ["admin", "manager"],
    roleMessage: {
      user: "Activity logs access requires Administrator or Manager privileges.",
    },
  },

  // ============================================
  // NETWORK & WIFI
  // ============================================
  "wifi slow": {
    response: "Let's improve your WiFi speed! Try these solutions:\n\n**Quick Fixes:**\n1. Move closer to the access point\n2. Disconnect devices you're not using\n3. Close bandwidth-heavy apps (streaming, downloads)\n4. Restart your device's WiFi\n\n**Check Your Environment:**\n- Walls and obstacles reduce signal strength\n- Microwaves and Bluetooth can cause interference\n- Peak hours have higher network usage\n\n**Your Bandwidth Allocation:**\nBandwidth is determined by your user policy:\n- Speed is shared across your connected devices\n- Fewer active devices = faster speeds per device\n\n**Still slow?**\n- Check if you've hit your data cap (may cause throttling)\n- Try during off-peak hours\n- Contact your network administrator if issue persists\n\nFor speed test: Visit speedtest.net on your browser",
    category: "Network",
    keywords: ["slow", "speed", "laggy", "buffering", "performance", "fast"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "bandwidth": {
    response: "Understanding your bandwidth allocation:\n\n**Bandwidth Limits by Policy:**\nYour administrator assigns policies with different speed tiers:\n- Basic: Lower speed for light browsing\n- Standard: Moderate speed for general use\n- Premium: Higher speed for demanding applications\n- Unlimited: No speed cap (when available)\n\n**How It Works:**\n- Bandwidth is shared among all your connected devices\n- More devices = less speed per device\n- Speed may be reduced after exceeding data cap\n\n**For Reference:**\n- Video calls: 2-4 Mbps recommended\n- HD streaming: 5+ Mbps recommended\n- Basic browsing: 1-2 Mbps sufficient\n- 4K streaming: 25+ Mbps recommended\n\n**Need more bandwidth?**\nContact your administrator about upgrading your policy allocation.",
    category: "Network",
    keywords: ["bandwidth", "speed limit", "mbps", "allocation", "throttle", "speed"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "wifi password": {
    response: "WiFi network access works through device registration, not passwords!\n\n**How Our System Works:**\n1. Your device's MAC address is registered by an admin\n2. The network recognizes your device automatically\n3. No password needed for registered devices\n\n**To Connect:**\n1. Make sure your device is registered in Device Management\n2. Select the company WiFi network\n3. Your device connects automatically\n4. You may need to authenticate via a captive portal\n\n**Not connecting?** Check that:\n- Your device is registered with correct MAC address\n- Your user account is Active\n- You haven't exceeded your device limit\n- MAC randomization is disabled on your device\n\nFor guest access, contact your administrator for temporary credentials.",
    category: "Network",
    keywords: ["wifi password", "network password", "connect wifi", "ssid", "network key"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "network down": {
    response: "If you're experiencing network issues:\n\n**First, Check If It's Widespread:**\n- Ask colleagues if they're also affected\n- Check for any announced maintenance\n\n**Troubleshoot Your Connection:**\n1. Toggle WiFi off and on\n2. Forget network and reconnect\n3. Restart your device\n4. Try a different location/access point\n\n**Check Your Account:**\n- Is your account status Active?\n- Have you exceeded your data limit?\n- Are your devices registered properly?\n\n**If Multiple People Affected:**\n- This is likely a network-wide issue\n- IT team is probably already aware\n- Check internal communications for updates\n\n**To Report an Outage:**\nContact: support@spectra.co\nPhone: 1800-XXX-XXXX\nInclude: Location, time started, affected devices\n\nWe apologize for any inconvenience!",
    category: "Network",
    keywords: ["network down", "outage", "no internet", "disconnected", "not working"],
    roles: ["admin", "manager", "user", "demo"],
  },

  // ============================================
  // SUPPORT & HELP
  // ============================================
  "contact support": {
    response: "We're here to help! Reach us through:\n\n**Email Support:**\nsupport@spectra.co\n(Response within 24 hours)\n\n**Phone Support:**\n1800-XXX-XXXX\nMonday - Saturday: 9:00 AM - 6:00 PM\n\n**Portal Support:**\nGo to Help & Support in sidebar to:\n- Create support tickets\n- View ticket status\n- Access FAQs\n- Chat with Spectra Genie (that's me!)\n\n**Before Contacting:**\n- Note your user ID/email\n- Describe the issue clearly\n- Include any error messages\n- Mention what you've already tried\n\nFor faster resolution, include screenshots if possible!",
    category: "Support",
    keywords: ["contact", "support", "help", "call", "email", "phone", "ticket"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "knowledge center": {
    response: "The Knowledge Center contains helpful guides and documentation:\n\n**Access:**\nClick 'Knowledge Center' in the sidebar\n\n**Content Categories:**\n- User Management: Adding, editing, managing users\n- Device Management: Registration, troubleshooting\n- Reports & Analytics: Generating and exporting reports\n- Network & WiFi: Connection help, speed optimization\n- Account Settings: Profile, security, preferences\n- Troubleshooting: Common issues and solutions\n\n**Features:**\n- Search bar to find specific topics\n- Step-by-step guides with screenshots\n- FAQ sections for quick answers\n- Best practices and tips\n\n**Can't find what you need?**\nVisit Help & Support in the sidebar for live assistance, or ask me! I'm Spectra Genie and I'm here to help.",
    category: "Support",
    keywords: ["knowledge", "documentation", "guide", "help articles", "faq", "how to"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "help": {
    response: "I'm happy to help! Here's what I can assist you with:\n\n**Account & Login:**\n- Password reset and changes\n- Login troubleshooting\n- Account settings\n\n**User Management:**\n- Adding new users\n- Editing user details\n- User policies and permissions\n- Blocking/suspending users\n\n**Device Management:**\n- Registering devices\n- Connection issues\n- MAC address lookup\n- Device limits\n\n**Guest Management:**\n- Creating guest accounts\n- Extending guest stays\n- Guest credentials\n\n**Network & WiFi:**\n- Connection problems\n- Speed issues\n- Bandwidth questions\n\n**Reports:**\n- Generating reports\n- Exporting data\n- Understanding analytics\n\nJust type your question or select from the suggestions below!\n\nFor complex issues, visit Help & Support in the sidebar or browse the Knowledge Center.",
    category: "Support",
    keywords: ["help", "assist", "support", "guide", "how to", "what can you do"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "hello": {
    response: "Hello! Welcome to Spectra Support.\n\nI'm Spectra Genie, your virtual assistant! I'm here to help you with:\n\n- Account and login issues\n- Device registration and management\n- User management\n- WiFi and network questions\n- Reports and analytics\n- Guest management\n\nHow can I assist you today? Just type your question or pick from the quick options below!",
    category: "Support",
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "greetings"],
    roles: ["admin", "manager", "user", "demo"],
  },
  "thank": {
    response: "You're welcome! I'm glad I could help.\n\nIs there anything else you'd like to know? Feel free to ask about:\n- Device management\n- User accounts\n- Network issues\n- Reports and analytics\n\nHave a great day!",
    category: "Support",
    keywords: ["thank", "thanks", "appreciate", "helpful", "great"],
    roles: ["admin", "manager", "user", "demo"],
  },
};

// ============================================
// INTERNAL PORTAL KNOWLEDGE BASE
// ============================================
export const internalKnowledge = {
  // ============================================
  // SITE PROVISIONING
  // ============================================
  "site provisioning": {
    response: "**Site Provisioning Queue System**\n\nThe Site Provisioning Queue is the central hub for managing new site deployments.\n\n**Site Status Workflow:**\n1. Configuration Pending - Initial status from billing system\n2. Under Configuration - Engineer configuring settings\n3. Under Testing - Running test checklist\n4. RFS Pending (Ready for Service) - Awaiting go-live\n5. Active - Live and operational\n6. Suspended - Temporarily disabled\n7. Blocked - Permanently disabled\n\n**Processing Queue Items:**\n1. Access Provisioning Queue from sidebar\n2. Click 'Start Configuration' to claim a site\n3. Review pre-filled data from billing\n4. Complete configuration (RADIUS, policies, branding)\n5. Run testing checklist\n6. Submit for RFS\n7. Confirm activation\n\n**Access Required:** canAccessProvisioningQueue (Deployment Engineer, Operations Manager, Super Admin)",
    category: "Site Management",
    keywords: ["provisioning", "queue", "new site", "deployment", "configuration pending", "rfs"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },
  "site testing": {
    response: "**Site Testing Checklist Guide**\n\nBefore any site goes live, all required tests must pass:\n\n**Required Tests:**\n- WiFi Connectivity Test - Verify SSID broadcasting\n- Internet Access Test - External website access\n- User Authentication Test - Login via captive portal\n- Bandwidth Speed Test - Verify policy speeds\n- Captive Portal Test - Display and flow verification\n\n**Optional Tests:**\n- Device Limit Test - Verify device restrictions\n- VLAN Isolation Test - Inter-VLAN security\n- Failover Test - RADIUS failover\n\n**Testing Workflow:**\n1. Prepare test environment\n2. Execute each test systematically\n3. Document results (Pass/Fail)\n4. Fix any failures\n5. Run end-to-end verification\n\n**Common Failures:**\n- WiFi not visible: Check AP config, VLAN tagging\n- Auth timeout: Check RADIUS connectivity, firewall\n- Wrong speeds: Verify policy, QoS settings",
    category: "Site Management",
    keywords: ["testing", "checklist", "test site", "verification", "go live"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },
  "site configuration": {
    response: "**Complete Site Configuration Guide**\n\n**Configuration Steps:**\n\n1. **Review Requirements**\n- Customer segment type\n- Expected user capacity\n- Special requirements (PMS, AD integration)\n\n2. **Network Parameters**\n- Primary/Secondary RADIUS servers\n- DHCP pool ranges\n- VLAN IDs\n- Subnet allocations\n\n3. **SSID Configuration**\n- SSID name per customer branding\n- Security mode (WPA2-Enterprise or Open+Portal)\n- Band steering preferences\n\n4. **User Policies**\n- Create tier-based policies (Basic, Standard, Premium)\n- Set device limits, session timeouts\n\n5. **Captive Portal**\n- Apply customer branding\n- Configure login methods\n- Set terms & conditions\n\n6. **Integrations**\n- Hotel: PMS integration\n- Enterprise: AD/LDAP\n- All: SMS/email gateways\n\n7. **Admin Accounts**\n- Create customer admin with appropriate role\n- Set temporary password\n\n8. **Monitoring Setup**\n- Configure alerts and notification recipients",
    category: "Site Management",
    keywords: ["configure site", "setup", "radius", "ssid", "network config"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },

  // ============================================
  // CUSTOMER MANAGEMENT
  // ============================================
  "customer impersonation": {
    response: "**Customer Impersonation (View as Customer)**\n\nView the customer portal exactly as a customer sees it.\n\n**Who Can Use:**\n- Super Admin: Full impersonation access\n- Operations Manager: Full access for investigations\n- Support Engineer: Read-only impersonation\n- Deployment Engineer: Full access for sites they deploy\n- Sales Representative: Read-only for demos\n\n**How to Impersonate:**\n1. Go to Customer Management\n2. Search for the customer\n3. Click 'View as Customer' button\n4. Acknowledge impersonation warning\n5. Navigate customer portal\n6. Click 'Exit Customer View' when done\n\n**Important:**\n- All actions are logged with your internal user ID\n- Customer can see impersonated actions in audit log\n- Have documented reason (support ticket, training)\n- Exit as soon as task is complete\n\n**Permission Required:** canImpersonateCustomer",
    category: "Operations",
    keywords: ["impersonate", "view as customer", "customer view", "login as customer"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer", "sales_representative"],
  },
  "customer onboarding": {
    response: "**Customer Onboarding Process**\n\n**Complete Checklist:**\n\n1. **Contract & Documentation**\n- Verify signed contract\n- Confirm SLA terms\n- Create billing account\n- Complete technical requirements document\n\n2. **Kickoff Meeting**\n- Schedule within 5 business days\n- Introductions, timeline, responsibilities\n\n3. **Technical Discovery**\n- Document network topology\n- Existing infrastructure\n- Integration requirements\n\n4. **Project Plan**\n- Create detailed milestones\n- Share with customer\n\n5. **Environment Provisioning**\n- Site appears in queue from billing\n- Configure per requirements\n\n6. **Integration & Testing**\n- Connect to customer systems\n- Complete testing checklist\n- UAT with customer\n\n7. **Training**\n- 2-hour admin training session\n- Provide documentation package\n\n8. **Go-Live**\n- Execute RFS\n- Dedicated support for 48 hours\n\n9. **Handoff**\n- Transfer to regular support\n- Schedule 30-day check-in",
    category: "Operations",
    keywords: ["onboarding", "new customer", "kickoff", "deployment", "go live"],
    roles: ["super_admin", "operations_manager", "deployment_engineer", "sales_representative"],
  },

  // ============================================
  // BULK OPERATIONS
  // ============================================
  "bulk operations": {
    response: "**Bulk Operations Guide**\n\nPerform mass updates across customers and sites.\n\n**Available Operations:**\n- Bulk User Import: Import from CSV\n- Bulk Device Import: Register multiple devices\n- Bulk Status Update: Change status for multiple users/devices\n- Bulk Policy Assignment: Mass policy changes\n- Bulk License Update: Adjust allocations\n- Bulk Export: Multi-customer data export\n\n**Safe Workflow:**\n1. Verify authorization (ticket/approval)\n2. Prepare data file per template\n3. Upload and preview\n4. Review validation warnings\n5. Type confirmation phrase to execute\n6. Review results\n7. Verify sample of affected records\n\n**Safety Tips:**\n- Always preview before executing\n- Start with small test batch\n- Have rollback plan ready\n- Schedule during low-usage periods\n- Notify affected customers if needed\n\n**Permission Required:** canAccessBulkOperations (Super Admin, Operations Manager limited)",
    category: "Operations",
    keywords: ["bulk", "mass update", "batch", "import", "bulk operations"],
    roles: ["super_admin", "operations_manager"],
  },
  "bulk status change": {
    response: "**Bulk Status Change Operations**\n\nChange status for multiple users/devices at once.\n\n**Available Actions:**\n- Bulk Activate: Reactivate suspended/blocked users\n- Bulk Suspend: Temporarily disable users\n- Bulk Block: Permanently disable users\n\n**Process:**\n1. Go to Bulk Operations\n2. Select 'Status Change'\n3. Upload CSV with user IDs or select from list\n4. Choose target status\n5. Review affected count\n6. Execute with confirmation\n\n**Use Cases:**\n- Seasonal operations (hotel check-outs)\n- Contract endings\n- Compliance actions\n- Maintenance windows\n\n**Permissions:**\n- Super Admin: All status changes\n- Operations Manager: Activate, Suspend only",
    category: "Operations",
    keywords: ["bulk status", "mass suspend", "bulk block", "bulk activate"],
    roles: ["super_admin", "operations_manager"],
  },
  "bulk policy change": {
    response: "**Bulk Policy Change Operations**\n\nAssign or change policies for multiple users.\n\n**Process:**\n1. Go to Bulk Operations\n2. Select 'Policy Change'\n3. Choose selection method:\n   - Upload CSV with user IDs\n   - Select by current policy\n   - Select by site/customer\n4. Choose new policy to assign\n5. Preview affected users\n6. Execute with confirmation\n\n**Use Cases:**\n- Policy tier upgrades/downgrades\n- Customer plan migrations\n- Seasonal adjustments\n- Mass corrections\n\n**Important Notes:**\n- Changes propagate within 5 minutes\n- Users may need to reconnect\n- Old policy values not retained\n- Document reason in notes\n\n**Permission:** canBulkChangePolicies (Super Admin, Operations Manager)",
    category: "Operations",
    keywords: ["bulk policy", "mass policy change", "policy assignment"],
    roles: ["super_admin", "operations_manager"],
  },
  "bulk resend password": {
    response: "**Bulk Resend Password Operations**\n\nResend passwords to multiple users at once.\n\n**Process:**\n1. Go to Bulk Operations\n2. Select 'Resend Passwords'\n3. Choose users:\n   - Upload CSV with user IDs\n   - Select by criteria (new users, specific date range)\n4. Select delivery method:\n   - Email (to registered email)\n   - SMS (to registered mobile)\n5. Review recipient list\n6. Execute\n\n**Use Cases:**\n- New user onboarding batches\n- Mass password rotation\n- Welcome email resends\n- Credential recovery campaigns\n\n**Important:**\n- Only sends to users with valid contact info\n- Generates new passwords (old invalidated)\n- Logged for security audit\n\n**Permission:** canBulkResendPasswords (Super Admin, Operations Manager)",
    category: "Operations",
    keywords: ["bulk password", "mass resend", "password reset bulk"],
    roles: ["super_admin", "operations_manager"],
  },

  // ============================================
  // SITE SUSPEND/BLOCK
  // ============================================
  "suspend site": {
    response: "**Site Suspend Procedure**\n\nTemporary suspension - preserves configuration.\n\n**When to Suspend:**\n- Non-payment (billing team request)\n- Customer request (maintenance)\n- Security investigation\n- Temporary service hold\n\n**Process:**\n1. Verify authorization (documented request)\n2. Document reason in site notes\n3. Notify stakeholders\n4. Go to Site Management > Site Details > Actions > Suspend Site\n5. Select reason from dropdown\n6. Confirm suspension\n7. Verify site shows as Suspended\n\n**Effects:**\n- All users immediately lose access\n- Devices disconnect\n- Configuration preserved\n- License metrics updated\n\n**Reactivation:**\nOperations Manager or above can reactivate.\nGo to Site Details > Actions > Reactivate Site.\n\n**Permission Required:** canManageSites",
    category: "Operations",
    keywords: ["suspend", "suspend site", "disable site", "pause site"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },
  "block site": {
    response: "**Site Block Procedure**\n\nPermanent block - requires Super Admin.\n\n**When to Block:**\n- Contract termination\n- Fraud detection\n- Severe policy violations\n- Legal requirements\n\n**Process:**\n1. Obtain Super Admin approval (documented)\n2. Final customer communication\n3. Super Admin executes:\n   Site Management > Site Details > Actions > Block Site\n4. Enter confirmation phrase\n5. Archive site data per retention policy\n6. Update billing system\n7. Remove from monitoring\n8. Document completion\n\n**Effects:**\n- All access permanently terminated\n- Requires Super Admin to unblock\n- Data archived per policy\n- Full audit trail maintained\n\n**Unblocking (Rare):**\nSuper Admin only. Usually requires new contract.\n\n**Permission Required:** Super Admin only",
    category: "Operations",
    keywords: ["block site", "terminate site", "permanent block"],
    roles: ["super_admin"],
  },

  // ============================================
  // INTERNAL ROLES
  // ============================================
  "internal roles": {
    response: "**Internal Portal Roles & Permissions**\n\n**Super Admin**\n- Full system access\n- Manage all customers, sites, internal staff\n- Bulk Operations, System Configuration\n- Reserved for senior technical leadership\n\n**Operations Manager**\n- Day-to-day operations across customers\n- Customer impersonation\n- Site provisioning oversight\n- Limited bulk operations\n\n**Support Engineer (L1)**\n- First-line support\n- Read-only customer impersonation\n- Basic troubleshooting\n- Cannot modify configurations\n\n**Deployment Engineer (L2)**\n- Site Provisioning Queue access\n- Configure new sites\n- Run testing and RFS\n- Technical troubleshooting\n\n**Sales Representative**\n- View customer information\n- Read-only impersonation for demos\n- Cannot modify technical settings\n\n**Demo Account**\n- View-only access to sample data\n- Training and demonstrations\n- No real customer access",
    category: "Operations",
    keywords: ["roles", "permissions", "internal roles", "access levels"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer", "sales_representative", "demo_account"],
  },

  // ============================================
  // TROUBLESHOOTING
  // ============================================
  "authentication troubleshooting": {
    response: "**Authentication Troubleshooting**\n\n**Error Codes:**\n- ERR_AUTH_TIMEOUT: RADIUS not responding\n- ERR_USER_NOT_FOUND: Username not in database\n- ERR_INVALID_PASSWORD: Password mismatch\n- ERR_ACCOUNT_DISABLED: User not Active\n- ERR_LICENSE_EXCEEDED: Site at capacity\n- ERR_DEVICE_LIMIT: User device limit reached\n- ERR_MAC_NOT_REGISTERED: MAC auth required\n\n**Diagnostic Workflow:**\n1. Gather info: Username, MAC, error, time, site\n2. Check user status in portal\n3. Check device registration\n4. Review RADIUS logs\n5. Test with radtest tool\n6. Check site health\n7. Apply fix (reset password, activate user, etc.)\n8. Verify resolution\n\n**Quick Fixes:**\n- Password reset solves 40% of issues\n- Check time sync (RADIUS fails if >5 min diff)\n- 'Forget network' on client fixes caching issues",
    category: "Troubleshooting",
    keywords: ["auth fail", "authentication error", "login fail", "radius error"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer"],
  },
  "connectivity troubleshooting": {
    response: "**Network Connectivity Troubleshooting**\n\n**Issue Categories:**\n- Complete Outage (P1): No users can connect\n- Partial Outage (P2): Some users/areas affected\n- Slow Speeds (P3): Connected but slow\n- Intermittent Drops (P3): Random disconnections\n\n**Layer-by-Layer Diagnosis:**\n\n1. **Layer 1 - Physical**\n- AP power and LED status\n- Cable connections\n- Signal strength\n\n2. **Layer 2 - Data Link**\n- VLAN configuration\n- Switch port assignment\n- MAC address tables\n\n3. **Layer 3 - Network**\n- DHCP working\n- Gateway reachable\n- DNS resolution\n\n4. **Layer 4-7 - Application**\n- Firewall rules\n- NAT configuration\n- Captive portal\n\n**Diagnostic Tools:**\n- ping / traceroute\n- AP CLI access\n- Controller dashboard\n- DHCP logs\n- Packet capture",
    category: "Troubleshooting",
    keywords: ["network down", "connectivity", "outage", "slow network"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer"],
  },
  "escalation": {
    response: "**Escalation Procedures**\n\n**Support Levels:**\n- L1 Support Engineer: Basic troubleshooting\n- L2 Deployment Engineer: Technical issues\n- L3 Ops Manager/Platform: System-wide issues\n- L4 Management: Critical/executive escalation\n\n**Severity Classification:**\n- P1 Critical: Complete outage, no workaround\n- P2 High: Major feature unavailable\n- P3 Medium: Impaired but workaround exists\n- P4 Low: Minor issue, minimal impact\n\n**Escalation Process:**\n1. Complete L1 troubleshooting first\n2. Document thoroughly\n3. Classify severity correctly\n4. Notify customer\n5. Route to correct team\n6. Monitor progress\n7. Confirm resolution\n\n**SLAs:**\n- P1: 15 min response, 1 hr escalation\n- P2: 30 min response, 4 hr resolution\n- P3: 1 hr response, next business day\n- P4: 4 hr response, best effort",
    category: "Troubleshooting",
    keywords: ["escalate", "escalation", "severity", "priority", "support tier"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer"],
  },

  // ============================================
  // SEGMENT INFORMATION (INTERNAL ONLY)
  // ============================================
  "segments": {
    response: "**Segment Types & Configurations**\n\n**Enterprise**\n- AD integration focus\n- High device limits (10+ per user)\n- Role-based policies\n- Bulk operations enabled\n- Strict security policies\n\n**Hotel**\n- PMS integration essential\n- Room-based authentication\n- Check-in/out automation\n- Tiered guest packages (free/paid)\n- Bulk user import enabled\n\n**Co-Living**\n- Long-term resident focus\n- Per-room/bed limits\n- Move-in/out date handling\n- Fair usage enforcement\n- Bulk operations enabled\n\n**Co-Working**\n- Flexible member types\n- Day pass support\n- Meeting room integration\n- Company-within-company isolation\n- Bulk operations enabled\n\n**PG (Paying Guest)**\n- Simple setup\n- Basic policies\n- Warden/manager access\n- Limited bulk operations\n\n**Office**\n- No user device additions\n- Digital devices only\n- No bulk imports\n\n**Miscellaneous**\n- General purpose\n- Full feature set\n- No IoT device bulk import",
    category: "Configuration",
    keywords: ["segment", "enterprise", "hotel", "coliving", "coworking", "pg", "office"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },
  "segment permissions": {
    response: "**Segment-Based Feature Permissions**\n\nFeature availability varies by segment:\n\n**canAddUserDevice:**\n- Enabled: Enterprise, Co-Living, Co-Working, Misc\n- Disabled: Office, Hotel, PG\n\n**canAddDigitalDevice:**\n- Enabled: All segments\n\n**canBulkImportUsers:**\n- Enabled: Enterprise, Co-Living, Co-Working, Hotel, Misc\n- Disabled: Office, PG\n\n**canBulkImportDevices:**\n- Enabled: Enterprise, Co-Living, Co-Working, Hotel, Misc\n- Disabled: Office, PG\n\n**canDisconnectDevice:**\n- Enabled: All segments\n\n**Override:**\nAdmins can override segment defaults during site provisioning if business requirements differ.\n\n**Checking Permissions:**\nUse usePermissions hook to check hasSegmentFeature().",
    category: "Configuration",
    keywords: ["segment permissions", "feature permissions", "segment features"],
    roles: ["super_admin", "operations_manager", "deployment_engineer"],
  },

  // ============================================
  // LICENSING & CAPACITY
  // ============================================
  "license management": {
    response: "**License Management (Internal)**\n\n**License Concepts:**\n- Capacity: Max concurrent authenticated users\n- Utilization: Current authenticated count\n- Peak: Highest utilization in period\n\n**Processing License Increase:**\n1. Receive request (ticket, sales, alert)\n2. Check contract terms\n3. Analyze utilization pattern\n4. Calculate billing impact\n5. Get approval (>20% needs Ops Manager)\n6. Apply change in Site > License Settings\n7. Confirm and document\n\n**Monitoring Alerts:**\n- 80%: Warning level\n- 90%: High utilization\n- 95%: Critical\n- 100%: New auth blocked\n\n**Best Practices:**\n- Proactively reach out at 80%\n- Help clean up inactive users first\n- Document all changes\n- Set up alerts for all customers",
    category: "Operations",
    keywords: ["license", "capacity", "utilization", "license increase"],
    roles: ["super_admin", "operations_manager", "sales_representative"],
  },

  // ============================================
  // SUPPORT & HELP
  // ============================================
  "hello": {
    response: "Hello! Welcome to Internal Spectra Support.\n\nI'm Spectra Genie, your virtual assistant for the Internal Portal!\n\nI can help you with:\n- Site provisioning and configuration\n- Customer management and impersonation\n- Bulk operations\n- Troubleshooting guides\n- Escalation procedures\n- Segment configurations\n- License management\n\nWhat can I assist you with today?",
    category: "Support",
    keywords: ["hello", "hi", "hey", "good morning", "greetings"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer", "sales_representative", "demo_account"],
  },
  "help": {
    response: "**Internal Portal Help**\n\nI can assist with:\n\n**Site Management:**\n- Site provisioning queue\n- Configuration and testing\n- Suspend/block procedures\n\n**Customer Operations:**\n- Customer impersonation\n- Onboarding process\n- License management\n\n**Bulk Operations:**\n- User imports\n- Status changes\n- Policy assignments\n\n**Troubleshooting:**\n- Authentication issues\n- Connectivity problems\n- Escalation procedures\n\n**Configuration:**\n- Segment types\n- Permissions\n- RADIUS settings\n\nJust ask your question and I'll help!",
    category: "Support",
    keywords: ["help", "assist", "support", "guide"],
    roles: ["super_admin", "operations_manager", "support_engineer", "deployment_engineer", "sales_representative", "demo_account"],
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get segment label without exposing segment identifier
 * For customer portal - returns generic description
 */
export const getSegmentSafeLabel = (segment) => {
  // Never expose segment names to customers
  return "your service configuration";
};

/**
 * Check if response should be filtered based on segment
 */
export const getSegmentRestrictedMessage = (knowledge, segment) => {
  if (knowledge.segmentRestrictions && knowledge.segmentRestrictions[segment]) {
    return knowledge.segmentRestrictions[segment];
  }
  return null;
};

/**
 * Check if response should be filtered based on role
 */
export const getRoleRestrictedMessage = (knowledge, role) => {
  if (knowledge.roleMessage && knowledge.roleMessage[role]) {
    return knowledge.roleMessage[role];
  }
  // If role not in allowed roles, return generic restriction message
  if (knowledge.roles && !knowledge.roles.includes(role)) {
    return "This feature requires additional permissions. Please contact your administrator for assistance.";
  }
  return null;
};

/**
 * Check if user has access to this knowledge item
 */
export const hasAccess = (knowledge, role) => {
  if (!knowledge.roles) return true;
  return knowledge.roles.includes(role);
};

export default {
  customerKnowledge,
  internalKnowledge,
  getSegmentSafeLabel,
  getSegmentRestrictedMessage,
  getRoleRestrictedMessage,
  hasAccess,
};
