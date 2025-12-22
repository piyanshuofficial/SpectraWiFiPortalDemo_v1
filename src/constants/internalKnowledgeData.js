// src/constants/internalKnowledgeData.js
// Knowledge Center content for internal Spectra staff
// Covers all internal portal operations, site provisioning, customer management, and support procedures

export const internalKnowledgeArticles = {
  // ============================================
  // SITE PROVISIONING QUEUE SECTION
  // ============================================
  "site-provisioning-queue": {
    title: "Site Provisioning Queue System",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "The Site Provisioning Queue is the central hub for managing new site deployments from Configuration Pending through to Active status. This queue receives sites from the billing system with pre-filled data and tracks them through the complete provisioning workflow."
      },
      {
        type: "section",
        title: "Site Status Workflow",
        items: [
          {
            name: "Configuration Pending",
            description: "Initial status when site is received from billing system. Site data is pre-filled from billing including customer details, service ID, address, and product configuration. Waiting for deployment engineer to start configuration."
          },
          {
            name: "Under Configuration",
            description: "Deployment engineer has claimed the site and is actively configuring network parameters, RADIUS settings, policies, and portal customization. Site is not yet visible to customers."
          },
          {
            name: "Under Testing",
            description: "Configuration complete. Running through the testing checklist to verify WiFi connectivity, user authentication, bandwidth, device limits, and other requirements before going live."
          },
          {
            name: "RFS Pending (Ready for Service)",
            description: "All testing complete and passed. Awaiting final RFS confirmation with activation date/time. Delivery team confirms go-live schedule with customer."
          },
          {
            name: "Active",
            description: "Site is live and operational. Visible to customers in their portal. Users can connect and authenticate. Regular monitoring and support begins."
          },
          {
            name: "Suspended",
            description: "Site temporarily disabled. Users cannot authenticate. Used for non-payment, maintenance, or customer request. Can be reactivated by authorized staff."
          },
          {
            name: "Blocked",
            description: "Site permanently disabled. Requires Super Admin to unblock. Used for contract termination or policy violations. Full audit trail maintained."
          }
        ]
      },
      {
        type: "steps",
        title: "Processing Queue Items",
        steps: [
          {
            number: 1,
            title: "Access Provisioning Queue",
            description: "Navigate to Internal Portal > Provisioning Queue. Queue shows all sites pending deployment sorted by priority and received date."
          },
          {
            number: 2,
            title: "Claim a Site",
            description: "Click 'Start Configuration' on a Configuration Pending item to claim it. Status changes to Under Configuration and assigns you as the deployment engineer."
          },
          {
            number: 3,
            title: "Review Pre-filled Data",
            description: "Billing system provides: Customer name, service ID, site address, contact details, product type, and billing plan. These fields are read-only to maintain billing system integrity."
          },
          {
            number: 4,
            title: "Complete Configuration",
            description: "Configure: RADIUS parameters, SSID settings, user policies, bandwidth tiers, VLAN assignments, and any segment-specific settings (Hotel PMS, Enterprise AD, etc.)."
          },
          {
            number: 5,
            title: "Start Testing Phase",
            description: "Click 'Start Testing' to move to Under Testing status. This unlocks the testing checklist for validation."
          },
          {
            number: 6,
            title: "Complete Testing Checklist",
            description: "Work through all checklist items: WiFi connectivity, authentication, bandwidth tests, device limits, captive portal, and segment-specific tests."
          },
          {
            number: 7,
            title: "Submit for RFS",
            description: "Once all required tests pass, submit for RFS. Select activation date/time (can be in the past for immediate activation or future for scheduled)."
          },
          {
            number: 8,
            title: "Confirm Activation",
            description: "Delivery team confirms with customer and approves RFS. Site becomes Active and visible to customer. Welcome email automatically sent with credentials."
          }
        ]
      },
      {
        type: "tips",
        title: "Queue Management Best Practices",
        items: [
          "Process high-priority sites (Enterprise, Hotel) before standard priority",
          "Don't claim more sites than you can complete in your shift",
          "Add detailed notes for any non-standard configurations",
          "If stuck, escalate to Operations Manager rather than leaving in limbo",
          "Test from customer's perspective - use actual device, not just backend tests",
          "Document any discrepancies between billing data and actual requirements"
        ]
      }
    ]
  },

  "site-testing-checklist": {
    title: "Site Testing Checklist Guide",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Before any site goes live, all required tests must pass. This ensures consistent quality and reduces support issues post-deployment. The checklist is mandatory for all new site provisioning."
      },
      {
        type: "section",
        title: "Required Tests",
        items: [
          {
            name: "WiFi Connectivity Test",
            description: "Verify SSID is broadcasting, device can associate, signal strength is adequate in all coverage areas. Test from multiple locations and devices. Required."
          },
          {
            name: "Internet Access Test",
            description: "Verify authenticated users can access external websites. Test DNS resolution, HTTP/HTTPS access, and common services (Google, Microsoft, etc.). Required."
          },
          {
            name: "User Authentication Test",
            description: "Create test user, verify can login via captive portal, session is established, CoA (Change of Authorization) works. Test password reset flow. Required."
          },
          {
            name: "Bandwidth Speed Test",
            description: "Verify speeds match policy limits. Test download/upload against configured tier. Verify burst allowance works. Test throttling after FUP limit. Required."
          },
          {
            name: "Device Limit Test",
            description: "Register maximum allowed devices for test user. Verify next device is rejected. Test device removal and re-registration. Optional but recommended."
          },
          {
            name: "VLAN Isolation Test",
            description: "Verify users on different VLANs cannot communicate. Test inter-VLAN routing where required. Verify management VLAN is isolated. Optional."
          },
          {
            name: "Captive Portal Test",
            description: "Verify portal displays correctly on all device types. Test login flow, T&C acceptance, and session timeout behavior. Check branding is correct. Required."
          },
          {
            name: "Failover Test",
            description: "Simulate primary RADIUS failure. Verify secondary takes over. Test recovery when primary returns. Verify no session interruption. Optional but recommended for Enterprise."
          }
        ]
      },
      {
        type: "steps",
        title: "Testing Workflow",
        steps: [
          {
            number: 1,
            title: "Prepare Test Environment",
            description: "Create test user with standard policy. Have multiple test devices ready (laptop, phone, tablet). Ensure you have access to site remotely or physically."
          },
          {
            number: 2,
            title: "Execute Each Test",
            description: "Run tests in order. Document results including timestamps, device used, and any observations. Screenshot errors for troubleshooting."
          },
          {
            number: 3,
            title: "Record Results",
            description: "Mark each test as Pass/Fail in the checklist. Add notes for any issues observed even if test passed."
          },
          {
            number: 4,
            title: "Fix Failures",
            description: "For failed tests, diagnose root cause, fix configuration, and re-test. Don't proceed to RFS with failed required tests."
          },
          {
            number: 5,
            title: "Final Verification",
            description: "Run end-to-end test simulating actual user experience. Connect new device, register, authenticate, browse, and disconnect cleanly."
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Test Failures",
        items: [
          {
            issue: "WiFi test fails - no SSID visible",
            solution: "Check AP configuration, verify SSID is enabled, check AP is online in controller, verify correct VLAN tagging on switch port."
          },
          {
            issue: "Authentication test fails - timeout",
            solution: "Check RADIUS connectivity (UDP 1812), verify shared secret matches, confirm firewall allows traffic, check RADIUS server is responding."
          },
          {
            issue: "Bandwidth test shows wrong speeds",
            solution: "Verify user's policy assignment, check QoS configuration, confirm no site-wide throttling, verify backhaul capacity is sufficient."
          },
          {
            issue: "Captive portal doesn't display",
            solution: "Check DNS interception is configured, verify certificate is valid, test redirect URL, check for HSTS conflicts on client device."
          }
        ]
      }
    ]
  },

  "site-provisioning": {
    title: "Complete Site Provisioning Guide",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Complete guide to provisioning new customer sites from initial queue pickup through go-live. This covers the detailed configuration steps for all site components. For queue workflow, see 'Site Provisioning Queue System' article."
      },
      {
        type: "steps",
        title: "Configuration Steps",
        steps: [
          {
            number: 1,
            title: "Review Site Requirements",
            description: "Review billing data for: Customer segment (Enterprise, Hotel, Co-Living, Co-Working, PG, Misc), expected user capacity, number of APs, special requirements (PMS integration, AD integration, custom branding)."
          },
          {
            number: 2,
            title: "Configure Network Parameters",
            description: "Set up: Primary and secondary RADIUS servers, DHCP pool ranges, VLAN IDs for user/management traffic, subnet allocations based on expected capacity (allow 2x growth)."
          },
          {
            number: 3,
            title: "Create SSID Configuration",
            description: "Configure: SSID name per customer branding, security mode (WPA2-Enterprise for managed, Open+Captive Portal for guest), band steering preferences, client isolation settings."
          },
          {
            number: 4,
            title: "Set Up User Policies",
            description: "Create policy tiers based on customer plan: Basic (speed/data limits), Standard, Premium, VIP. Include device limits, session timeouts, and any segment-specific attributes."
          },
          {
            number: 5,
            title: "Configure Captive Portal",
            description: "Apply customer branding (logo, colors), set terms & conditions, configure login methods (username/password, room number, voucher), set session behavior (timeout, remember device)."
          },
          {
            number: 6,
            title: "Set Up Integrations",
            description: "For Hotel: Configure PMS integration for auto check-in/out. For Enterprise: Set up AD/LDAP integration. For all: Configure SMS/email gateways if using OTP authentication."
          },
          {
            number: 7,
            title: "Create Admin Accounts",
            description: "Create customer admin account with appropriate role (Admin gets full access, Manager gets day-to-day operations). Set temporary password and note for handoff."
          },
          {
            number: 8,
            title: "Configure Monitoring",
            description: "Set up alerts for: Authentication failures threshold, bandwidth utilization, AP offline, license capacity. Configure notification recipients."
          }
        ]
      },
      {
        type: "section",
        title: "Segment-Specific Configuration",
        items: [
          {
            name: "Enterprise",
            description: "Focus on AD integration, role-based policies, high device limits (10+ per user), multiple VLANs for departments, strict security policies, detailed audit logging."
          },
          {
            name: "Hotel",
            description: "PMS integration essential, room-based authentication, check-in/check-out automation, tiered packages (free/paid), staff network with separate policies, conference room support."
          },
          {
            name: "Co-Living",
            description: "Long-term resident focus, per-room/per-bed limits, move-in/move-out date handling, shared common area policies, fair usage enforcement, resident vs guest differentiation."
          },
          {
            name: "Co-Working",
            description: "Flexible member types, day pass support, meeting room booking integration, print/scan services network, visitor management, company-within-company isolation."
          },
          {
            name: "PG (Paying Guest)",
            description: "Similar to Co-Living with simpler setup, basic policies, monthly billing alignment, bed-level tracking, warden/manager access levels."
          }
        ]
      },
      {
        type: "tips",
        title: "Provisioning Best Practices",
        items: [
          "Always use the provisioning checklist - don't skip steps",
          "Document any non-standard configurations in site notes",
          "Verify network infrastructure compatibility before configuring",
          "Create test users for validation before creating customer admins",
          "Set up monitoring alerts before go-live",
          "Schedule go-live during low-usage period when possible"
        ]
      }
    ]
  },

  // ============================================
  // CUSTOMER IMPERSONATION & VIEW AS CUSTOMER
  // ============================================
  "customer-impersonation": {
    title: "Customer Impersonation (View as Customer)",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Customer Impersonation allows internal staff to view the customer portal exactly as a specific customer sees it. This is invaluable for troubleshooting customer-reported issues, training, and support. Only authorized staff with 'canImpersonateCustomer' permission can use this feature."
      },
      {
        type: "section",
        title: "Who Can Use Impersonation",
        items: [
          {
            name: "Super Admin",
            description: "Full impersonation access to all customers. Can view and perform all actions the customer admin can perform."
          },
          {
            name: "Operations Manager",
            description: "Full impersonation access. Primary use case is investigating escalated support issues and verifying customer configurations."
          },
          {
            name: "Support Engineer",
            description: "Read-only impersonation. Can view customer data but cannot make changes. Used for first-level troubleshooting."
          },
          {
            name: "Deployment Engineer",
            description: "Full impersonation for sites they are deploying. Used for testing and handoff verification."
          },
          {
            name: "Sales Representative",
            description: "Read-only impersonation for demo purposes. Can show customers their own data during training or upsell conversations."
          }
        ]
      },
      {
        type: "steps",
        title: "How to Impersonate a Customer",
        steps: [
          {
            number: 1,
            title: "Navigate to Customer List",
            description: "Go to Internal Portal > Customers. Search or browse for the customer you need to view as."
          },
          {
            number: 2,
            title: "Click 'View as Customer'",
            description: "In the customer row or detail view, click the 'View as Customer' button. This requires canImpersonateCustomer permission."
          },
          {
            number: 3,
            title: "Confirm Impersonation",
            description: "Acknowledge the impersonation warning. All actions during impersonation are logged with your internal user ID."
          },
          {
            number: 4,
            title: "Navigate Customer Portal",
            description: "The sidebar and content switch to customer portal view. You see exactly what the customer's admin would see. An indicator bar shows you're in impersonation mode."
          },
          {
            number: 5,
            title: "Perform Needed Actions",
            description: "View dashboards, check user lists, verify device configurations, test reports - whatever is needed to assist the customer."
          },
          {
            number: 6,
            title: "Exit Impersonation",
            description: "Click 'Exit Customer View' in the sidebar indicator. You return to the internal portal. All actions remain logged."
          }
        ]
      },
      {
        type: "tips",
        title: "Impersonation Best Practices",
        items: [
          "Always have a documented reason for impersonation (support ticket, training session, etc.)",
          "Don't make unnecessary changes while impersonating - prefer guiding the customer to make changes themselves",
          "Remember the customer can see the audit log - your impersonated actions appear with your name",
          "Use impersonation to understand issues from customer perspective, not as a shortcut",
          "Exit impersonation as soon as your task is complete",
          "If customer reports something looks different than what you see, check their specific role/permissions"
        ]
      },
      {
        type: "section",
        title: "Audit Trail",
        items: [
          {
            name: "Impersonation Start",
            description: "Logged with timestamp, internal user, target customer. Visible in both internal audit logs and customer activity logs."
          },
          {
            name: "Actions During Impersonation",
            description: "All create/update/delete actions logged as 'Internal User (via impersonation)'. Visible to customer admins in their activity logs."
          },
          {
            name: "Impersonation End",
            description: "Exit is logged with duration and summary of actions taken. Useful for compliance and tracking."
          }
        ]
      }
    ]
  },

  // ============================================
  // INTERNAL PORTAL ROLES
  // ============================================
  "internal-roles-permissions": {
    title: "Internal Portal Roles & Permissions",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "The internal portal uses a role-based access control system with six predefined roles. Each role has specific permissions tailored to job responsibilities. Understanding these roles is essential for proper task delegation and security."
      },
      {
        type: "section",
        title: "Internal Portal Roles",
        items: [
          {
            name: "Super Admin",
            description: "Full system access. Can manage all customers, sites, and internal staff. Access to Bulk Operations, System Configuration, and all sensitive operations. Reserved for senior technical leadership."
          },
          {
            name: "Operations Manager",
            description: "Manages day-to-day operations across all customers. Can impersonate customers, manage site provisioning, handle escalations, and access reports. Cannot modify system configuration or internal user accounts."
          },
          {
            name: "Support Engineer (L1)",
            description: "First-line support. Can view customer data (read-only impersonation), access support queue, create/update tickets, and perform basic troubleshooting. Cannot modify site configurations or customer data."
          },
          {
            name: "Deployment Engineer (L2)",
            description: "Technical deployment role. Full access to Site Provisioning Queue, can configure new sites, run testing, and complete RFS. Can impersonate customers they're deploying. Access to technical troubleshooting tools."
          },
          {
            name: "Sales Representative",
            description: "Sales and account management. Can view customer information, access reports for their accounts, and perform read-only impersonation for demos. Cannot modify technical configurations."
          },
          {
            name: "Demo Account",
            description: "Limited demonstration access. View-only access to sanitized demo data. Used for training new staff or showing the portal to prospects. No access to real customer data."
          }
        ]
      },
      {
        type: "section",
        title: "Key Permission Categories",
        items: [
          {
            name: "canAccessInternalPortal",
            description: "Base permission to access internal portal. All internal roles have this."
          },
          {
            name: "canImpersonateCustomer",
            description: "Ability to use View as Customer feature. Super Admin, Ops Manager, Support Engineer (read-only), Deployment Engineer, Sales Rep have this."
          },
          {
            name: "canAccessProvisioningQueue",
            description: "Access to Site Provisioning Queue. Deployment Engineers and above have this."
          },
          {
            name: "canAccessBulkOperations",
            description: "Access to Bulk Operations (mass updates, imports). Super Admin only due to risk level."
          },
          {
            name: "canManageSites",
            description: "Create, edit, suspend, block sites. Deployment Engineers and above."
          },
          {
            name: "canManageCustomers",
            description: "Create and edit customer records. Ops Manager and above."
          },
          {
            name: "canManageInternalUsers",
            description: "Create and manage other internal users. Super Admin only."
          },
          {
            name: "canAccessSystemConfig",
            description: "Access System Configuration settings. Super Admin only."
          }
        ]
      },
      {
        type: "tips",
        title: "Role Assignment Guidelines",
        items: [
          "Follow principle of least privilege - assign minimum role needed for job function",
          "Super Admin should be limited to 2-3 people maximum",
          "New staff should start with Demo Account until training complete",
          "Review role assignments quarterly and remove unnecessary elevated access",
          "Use Audit Logs to monitor for permission abuse",
          "Document business justification when assigning elevated roles"
        ]
      }
    ]
  },

  // ============================================
  // BULK OPERATIONS
  // ============================================
  "bulk-operations-guide": {
    title: "Bulk Operations Guide",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Bulk Operations allows Super Admins to perform mass updates across multiple customers and sites. This powerful feature requires careful use as changes affect many records simultaneously. Always preview and verify before executing."
      },
      {
        type: "section",
        title: "Available Bulk Operations",
        items: [
          {
            name: "Bulk User Import",
            description: "Import users from CSV across multiple sites. Supports creation of hundreds of users in single operation. Validates data before import."
          },
          {
            name: "Bulk Device Import",
            description: "Register multiple devices from CSV. Supports both user devices and IoT devices. Validates MAC addresses and checks for duplicates."
          },
          {
            name: "Bulk Status Update",
            description: "Change status (Active/Suspended/Blocked) for multiple users or devices. Useful for seasonal operations or compliance actions."
          },
          {
            name: "Bulk Policy Assignment",
            description: "Assign or change policies for multiple users. Useful when policy tiers change or customers migrate to new plans."
          },
          {
            name: "Bulk License Update",
            description: "Adjust license allocations across multiple sites. Used for capacity planning and billing reconciliation."
          },
          {
            name: "Bulk Export",
            description: "Export data from multiple customers/sites in single operation. Supports user lists, device lists, usage reports."
          }
        ]
      },
      {
        type: "steps",
        title: "Safe Bulk Operation Workflow",
        steps: [
          {
            number: 1,
            title: "Verify Authorization",
            description: "Confirm you have business approval for the bulk operation. Document ticket number or approval email."
          },
          {
            number: 2,
            title: "Prepare Data File",
            description: "Format CSV according to template. Include only required fields. Validate data before upload."
          },
          {
            number: 3,
            title: "Upload and Preview",
            description: "Upload file and review the preview. System shows what will be created/updated/deleted. Check row count matches expectation."
          },
          {
            number: 4,
            title: "Validate Warnings",
            description: "Review any validation warnings. Fix errors in source file if needed. Re-upload if changes required."
          },
          {
            number: 5,
            title: "Execute with Confirmation",
            description: "Type confirmation phrase to execute. Operation runs in background for large datasets. Progress indicator shows status."
          },
          {
            number: 6,
            title: "Review Results",
            description: "Check completion report. Verify success count matches expected. Investigate any failures."
          },
          {
            number: 7,
            title: "Post-Operation Verification",
            description: "Spot-check affected records. Verify a sample of users/devices reflect expected changes. Document completion."
          }
        ]
      },
      {
        type: "tips",
        title: "Bulk Operation Safety",
        items: [
          "Always preview before executing - never skip this step",
          "Start with a small test batch before full import",
          "Have rollback plan ready for reversible operations",
          "Schedule large operations during low-usage periods",
          "Keep original source files for audit trail",
          "Monitor system performance during execution",
          "Notify affected customers if operation impacts their users"
        ]
      }
    ]
  },

  // ============================================
  // SUSPEND AND BLOCK OPERATIONS
  // ============================================
  "suspend-block-operations": {
    title: "Site Suspend & Block Procedures",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Sites can be suspended (temporary) or blocked (permanent) for various business and technical reasons. These operations affect all users at the site and require proper authorization and documentation."
      },
      {
        type: "section",
        title: "Suspend vs Block",
        items: [
          {
            name: "Suspend",
            description: "Temporary status. All users immediately lose access. Site configuration preserved. Can be reactivated by Operations Manager or above. Used for: Non-payment, customer request, security investigation, maintenance."
          },
          {
            name: "Block",
            description: "Permanent status. All access terminated. Requires Super Admin to unblock. Used for: Contract termination, fraud, severe policy violations. Requires documented approval before execution."
          }
        ]
      },
      {
        type: "steps",
        title: "Suspend Site Procedure",
        steps: [
          {
            number: 1,
            title: "Verify Authorization",
            description: "Confirm suspend request from authorized source: billing team for non-payment, security team for investigation, customer for maintenance."
          },
          {
            number: 2,
            title: "Document Reason",
            description: "Record ticket number, approval email, or other documentation. Add to site notes before suspension."
          },
          {
            number: 3,
            title: "Notify Stakeholders",
            description: "Alert support team that site will be suspended. For customer-initiated, confirm customer understands impact."
          },
          {
            number: 4,
            title: "Execute Suspension",
            description: "Go to Site Management > Site Details > Actions > Suspend Site. Select reason from dropdown. Add notes. Confirm."
          },
          {
            number: 5,
            title: "Verify Suspension",
            description: "Confirm site status shows Suspended. Test that authentication fails for site users. Update ticket with completion."
          }
        ]
      },
      {
        type: "steps",
        title: "Block Site Procedure",
        steps: [
          {
            number: 1,
            title: "Obtain Super Admin Approval",
            description: "Block requires Super Admin authorization. Escalate with full documentation of reason."
          },
          {
            number: 2,
            title: "Final Customer Communication",
            description: "Ensure customer has received final notice. Document communication attempts."
          },
          {
            number: 3,
            title: "Execute Block",
            description: "Super Admin goes to Site Management > Site Details > Actions > Block Site. Requires entering confirmation phrase."
          },
          {
            number: 4,
            title: "Archive Site Data",
            description: "Per retention policy, data may be archived. Confirm with legal if customer requests data export."
          },
          {
            number: 5,
            title: "Update Systems",
            description: "Update billing system, remove from monitoring, update license count. Document completion."
          }
        ]
      },
      {
        type: "section",
        title: "Reactivation Process",
        items: [
          {
            name: "Suspended Site Reactivation",
            description: "Operations Manager or above can reactivate. Go to Site Details > Actions > Reactivate Site. Requires reason (payment received, maintenance complete, investigation cleared). Service restores immediately."
          },
          {
            name: "Blocked Site Reactivation",
            description: "Super Admin only. Rare - usually requires new contract. Must document business justification. May require re-provisioning depending on how long blocked."
          }
        ]
      },
      {
        type: "tips",
        title: "Important Considerations",
        items: [
          "Suspension/block takes effect immediately - all active sessions terminated",
          "IT Integration Point: Triggers webhook to billing system (see code comments for API spec)",
          "Customers can see suspension in their portal (if they can access it via direct URL)",
          "Suspended sites don't count against active license metrics",
          "Always document before and after - audits frequently review these actions"
        ]
      }
    ]
  },

  // ============================================
  // CUSTOMER EMAIL COMMUNICATIONS
  // ============================================
  "customer-email-templates": {
    title: "Customer Email Communications",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Standard email templates are sent automatically at key milestones. Understanding these templates helps support teams answer customer questions and troubleshoot delivery issues."
      },
      {
        type: "section",
        title: "Automated Email Templates",
        items: [
          {
            name: "Welcome Email",
            description: "Sent when site goes Active. Contains: Customer portal URL, admin username, temporary password (if not SSO), quick start guide link, support contact information. Recipient: Primary contact from billing system."
          },
          {
            name: "SSID Credentials Email",
            description: "Sent separately for security. Contains: SSID name(s), network type (Enterprise/Guest), connection instructions per device type. Intentionally separate from portal credentials."
          },
          {
            name: "Password Reset Email",
            description: "Sent when admin requests password reset. Contains secure reset link (expires in 24 hours). Logged for security audit."
          },
          {
            name: "License Warning Email",
            description: "Sent at 80%, 90%, 95% license utilization. Contains current usage, limit, recommendation to contact sales. Can be configured per customer."
          },
          {
            name: "Site Suspension Notice",
            description: "Sent when site suspended. Contains reason (if configured to share), reactivation instructions, support contact. Template varies by suspension reason."
          }
        ]
      },
      {
        type: "section",
        title: "Email Troubleshooting",
        items: [
          {
            name: "Customer didn't receive email",
            description: "Check: Email address in customer record is correct, check spam/junk folders, verify email gateway logs, check for bounce-back notifications, resend from Site Details > Actions > Resend Welcome Email."
          },
          {
            name: "Wrong recipient received email",
            description: "Check billing system data - emails go to primary contact. Update contact in customer record. Audit log shows who received each email."
          },
          {
            name: "Email contains wrong information",
            description: "Information pulled from site configuration at time of sending. If site config was wrong, correct it and resend email manually."
          }
        ]
      },
      {
        type: "tips",
        title: "Email Best Practices",
        items: [
          "IT Integration Point: Email templates are configured in System Config > Email Templates",
          "All emails logged with timestamp, recipient, and delivery status",
          "Resend emails sparingly - multiple resets can confuse customers",
          "For sensitive accounts, consider calling to verify email receipt",
          "Template customization requires Super Admin access"
        ]
      }
    ]
  },

  // ============================================
  // EXISTING ARTICLES - ENHANCED
  // ============================================
  "radius-configuration": {
    title: "RADIUS Server Configuration",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "RADIUS (Remote Authentication Dial-In User Service) is the core authentication protocol for WiFi access. Proper configuration ensures reliable authentication and accounting for all users. This guide covers primary and backup server setup, shared secrets, and vendor-specific attributes."
      },
      {
        type: "section",
        title: "RADIUS Architecture Overview",
        items: [
          {
            name: "Authentication Server",
            description: "Validates user credentials. Port 1812 (UDP). Receives Access-Request, returns Access-Accept or Access-Reject. Must be highly available."
          },
          {
            name: "Accounting Server",
            description: "Tracks session data. Port 1813 (UDP). Receives Accounting-Start, Interim-Update, and Stop messages. Used for billing and reporting."
          },
          {
            name: "Primary Server",
            description: "Main authentication endpoint. All NAS devices point here first. Should be in same region as majority of sites."
          },
          {
            name: "Secondary Server",
            description: "Failover server. Takes over when primary is unreachable. Should be in different availability zone or data center for true HA."
          },
          {
            name: "Shared Secret",
            description: "Pre-shared key between NAS and RADIUS server. Must match exactly on both ends. Minimum 16 characters, mix of letters, numbers, special characters."
          }
        ]
      },
      {
        type: "steps",
        title: "Configuration Steps",
        steps: [
          {
            number: 1,
            title: "Access RADIUS Configuration",
            description: "Navigate to Internal Portal > Configuration > RADIUS Settings. Select the site or use global defaults."
          },
          {
            number: 2,
            title: "Configure Primary Server",
            description: "Enter server IP address, authentication port (default 1812), accounting port (default 1813). Generate or enter shared secret."
          },
          {
            number: 3,
            title: "Configure Secondary Server",
            description: "Add failover server details. Set failover threshold (default: 5 consecutive failures before failover)."
          },
          {
            number: 4,
            title: "Set Timeout Parameters",
            description: "Response timeout: 5 seconds (10 for international sites). Retry count: 3. Dead time: 300 seconds before retrying failed server."
          },
          {
            number: 5,
            title: "Configure Vendor-Specific Attributes",
            description: "Set up VSAs for: bandwidth limits (WISPr-Bandwidth-Max-Down/Up), session timeout, idle timeout, VLAN assignment (Tunnel-Private-Group-ID)."
          },
          {
            number: 6,
            title: "Test Configuration",
            description: "Use built-in radtest tool: Enter test username/password, click Test. Verify Access-Accept received with correct attributes."
          },
          {
            number: 7,
            title: "Deploy to NAS Devices",
            description: "Push configuration to access points/controllers. Verify each NAS can reach RADIUS server. Monitor initial authentications."
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common RADIUS Issues",
        items: [
          {
            issue: "Authentication timeout",
            solution: "Verify firewall allows UDP 1812/1813. Check RADIUS server process is running. Verify IP address is correct. Test network path with ping/traceroute."
          },
          {
            issue: "Access-Reject for valid users",
            solution: "Verify user exists and is Active. Check password hash algorithm matches (PAP/CHAP/MSCHAPv2). Verify user is not over device limit or expired."
          },
          {
            issue: "Accounting packets not received",
            solution: "Check accounting port (1813) is open. Verify NAS is configured to send accounting. Check Interim-Update interval isn't too frequent (minimum 5 minutes recommended)."
          },
          {
            issue: "Shared secret mismatch",
            solution: "Regenerate shared secret and update both RADIUS server and NAS. Watch for trailing spaces or encoding issues. Verify no special characters causing parsing problems."
          },
          {
            issue: "Failover not working",
            solution: "Check secondary server is reachable. Verify failover threshold is set correctly. Check NAS supports RADIUS failover. Test by blocking primary server."
          }
        ]
      },
      {
        type: "tips",
        title: "RADIUS Best Practices",
        items: [
          "Rotate shared secrets quarterly - set calendar reminder",
          "Monitor RADIUS server response times - alert if >100ms average",
          "Use TLS (RadSec) for RADIUS traffic over untrusted networks",
          "Keep RADIUS logs for minimum 90 days for troubleshooting",
          "Test failover monthly to ensure secondary is working",
          "Document all VSA configurations per customer for reference"
        ]
      }
    ]
  },

  "bandwidth-management": {
    title: "Bandwidth Management & QoS",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Bandwidth management ensures fair usage across all users while meeting SLA commitments for different policy tiers. This guide covers per-user limits, QoS configuration, fair usage policies, and traffic shaping techniques."
      },
      {
        type: "section",
        title: "Bandwidth Architecture",
        items: [
          {
            name: "Per-User Bandwidth Limit",
            description: "Maximum download/upload speed for individual user. Enforced via RADIUS attributes or traffic shaper. Typical range: 10-100 Mbps download, 5-50 Mbps upload depending on tier."
          },
          {
            name: "Site-Wide Bandwidth",
            description: "Total backhaul capacity available at site. Sum of concurrent users should not exceed this. Plan for 80% peak utilization with 20% headroom."
          },
          {
            name: "Burst Allowance",
            description: "Short-term speed boost above normal limit. Improves perceived performance for web browsing. Typical: 1.5x limit for 30-60 seconds. Implemented via token bucket."
          },
          {
            name: "Fair Usage Policy (FUP)",
            description: "Data volume cap before throttling. Protects against bandwidth hogs. Can be daily (5GB typical) or monthly (100GB typical). Throttle to 1-5 Mbps after exceeding."
          },
          {
            name: "Traffic Prioritization",
            description: "QoS rules to prioritize important traffic. Real-time (VoIP) > Interactive (web, video calls) > Bulk (streaming) > Background (updates, backups)."
          }
        ]
      },
      {
        type: "steps",
        title: "Configuring Bandwidth Policies",
        steps: [
          {
            number: 1,
            title: "Assess Site Capacity",
            description: "Document total backhaul bandwidth (ISP circuit capacity). Plan for current users plus 50% growth. Calculate concurrent user estimate (typically 30% of total users)."
          },
          {
            number: 2,
            title: "Design Policy Tiers",
            description: "Create tiers based on customer segment. Example for Hotel: Free (5Mbps/2GB daily), Standard (25Mbps/10GB daily), Premium (50Mbps/unlimited). Document for customer approval."
          },
          {
            number: 3,
            title: "Configure in Policy Management",
            description: "Go to Site Configuration > Policies. Create each tier with: download speed, upload speed, burst rate, burst duration, FUP limit, throttle speed."
          },
          {
            number: 4,
            title: "Set RADIUS Attributes",
            description: "Map policies to RADIUS attributes: WISPr-Bandwidth-Max-Down, WISPr-Bandwidth-Max-Up, Session-Timeout, Idle-Timeout. Verify attributes applied on test authentication."
          },
          {
            number: 5,
            title: "Configure Traffic Shaping",
            description: "Enable traffic shaper on site controller. Configure queues: High priority (VoIP, video conference), Medium (web, email), Low (streaming, downloads), Best effort (everything else)."
          },
          {
            number: 6,
            title: "Set Time-Based Policies (Optional)",
            description: "Configure off-peak improvements: e.g., 2x speeds during 2AM-6AM. Useful for maximizing customer satisfaction when bandwidth is available."
          },
          {
            number: 7,
            title: "Monitor and Tune",
            description: "Use Analytics to monitor: bandwidth utilization, per-user consumption, FUP triggers. Adjust policies based on actual usage patterns."
          }
        ]
      },
      {
        type: "section",
        title: "Segment-Specific Recommendations",
        items: [
          {
            name: "Enterprise",
            description: "Higher base speeds (50-100 Mbps), no FUP for employees, strict QoS for conferencing. Consider departmental policies (IT gets more than reception)."
          },
          {
            name: "Hotel",
            description: "Multiple tiers including free. Premium should exceed guest expectations. Conference room may need dedicated high-speed policy. Staff policy separate from guest."
          },
          {
            name: "Co-Living/PG",
            description: "FUP important for shared bandwidth. Monthly limits align with billing. Peak hour management critical (evening usage spikes)."
          },
          {
            name: "Co-Working",
            description: "Business-grade speeds expected. Video conferencing priority essential. Day pass users may get lower tier than members."
          }
        ]
      },
      {
        type: "tips",
        title: "Bandwidth Optimization Tips",
        items: [
          "Monitor top consumers weekly - 10% of users often use 50% of bandwidth",
          "FUP warnings at 80% prevent surprise throttling complaints",
          "Application-aware QoS gives better results than port-based",
          "Test from user perspective - connect device and run speed test",
          "Consider time-of-day policies for cost-effective bandwidth allocation",
          "Document bandwidth calculations for SLA discussions"
        ]
      }
    ]
  },

  "customer-onboarding": {
    title: "Customer Onboarding Process",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Standard process for onboarding new customers from contract signing through production deployment and handoff to BAU support. Following this process ensures consistent customer experiences and successful deployments."
      },
      {
        type: "steps",
        title: "Complete Onboarding Checklist",
        steps: [
          {
            number: 1,
            title: "Contract & Documentation",
            description: "Verify: Signed contract received, SLA terms documented, billing account created, technical requirements document (TRD) completed, primary contacts identified for technical/billing/executive."
          },
          {
            number: 2,
            title: "Kickoff Meeting",
            description: "Schedule kickoff with customer stakeholders within 5 business days of contract. Agenda: Introductions, timeline review, responsibilities matrix, access requirements, success criteria definition."
          },
          {
            number: 3,
            title: "Technical Discovery",
            description: "Document: Network topology, existing infrastructure (APs, switches, controllers), internet connectivity details, integration requirements (PMS, AD, SSO), security policies, coverage requirements."
          },
          {
            number: 4,
            title: "Project Plan Creation",
            description: "Create detailed project plan with milestones: Design complete, Infrastructure ready, Portal configured, Testing complete, Training complete, Go-live. Share with customer for alignment."
          },
          {
            number: 5,
            title: "Infrastructure Validation",
            description: "Verify customer infrastructure meets requirements: AP density for coverage, switch port capacity, VLAN support, firewall rules for RADIUS traffic, bandwidth for expected users."
          },
          {
            number: 6,
            title: "Environment Provisioning",
            description: "Site appears in Provisioning Queue from billing. Deployment engineer picks up and configures: domain, RADIUS, policies, branding, integrations per TRD."
          },
          {
            number: 7,
            title: "Integration & Testing",
            description: "Integrate with customer systems (PMS, AD). Complete testing checklist. UAT with customer team present. Document any deviations from TRD."
          },
          {
            number: 8,
            title: "Training Delivery",
            description: "Conduct admin training (2-hour session covering: user management, device management, reports, troubleshooting basics). Provide documentation package and quick reference card."
          },
          {
            number: 9,
            title: "Go-Live Execution",
            description: "Execute RFS per plan. Send welcome emails. Provide dedicated support for first 48 hours. Monitor for issues proactively."
          },
          {
            number: 10,
            title: "Handoff to BAU",
            description: "Transfer to regular support queue after stabilization period (typically 1 week). Schedule 30-day check-in call. Document any ongoing items in customer notes."
          }
        ]
      },
      {
        type: "section",
        title: "Key Stakeholders",
        items: [
          {
            name: "Sales Representative",
            description: "Owns customer relationship. Introduces technical team. Handles commercial discussions. Escalation point for customer satisfaction issues."
          },
          {
            name: "Deployment Engineer",
            description: "Technical owner during onboarding. Configures site, runs testing, delivers training. Primary technical contact until handoff."
          },
          {
            name: "Operations Manager",
            description: "Oversight and escalation. Ensures resources available. Handles timeline adjustments. Signs off on go-live readiness."
          },
          {
            name: "Customer Admin",
            description: "Customer's primary technical contact. Receives training. Will manage day-to-day operations post go-live."
          }
        ]
      },
      {
        type: "tips",
        title: "Onboarding Success Factors",
        items: [
          "Set realistic timeline from day one - under-promise, over-deliver",
          "Single deployment engineer for continuity (avoid handoffs mid-project)",
          "Document everything - assumptions, decisions, deviations",
          "Over-communicate during critical phases (weekly status at minimum)",
          "Prepare rollback plan before every go-live",
          "30-day check-in catches issues before they become complaints"
        ]
      }
    ]
  },

  "auth-troubleshooting": {
    title: "Authentication Troubleshooting",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Systematic guide for diagnosing and resolving user authentication failures. Authentication issues are the most common support requests - efficient troubleshooting minimizes customer impact and support time."
      },
      {
        type: "section",
        title: "Authentication Error Codes",
        items: [
          {
            name: "ERR_AUTH_TIMEOUT",
            description: "RADIUS server did not respond. Check: Server reachability (ping), firewall rules (UDP 1812), server process running, shared secret matches. Test with radtest."
          },
          {
            name: "ERR_USER_NOT_FOUND",
            description: "Username not in database. Check: Exact spelling (case-sensitive), user exists in portal, not deleted/archived, correct site/domain."
          },
          {
            name: "ERR_INVALID_PASSWORD",
            description: "Password mismatch. Solutions: Reset password, check for copy-paste issues (trailing spaces), verify hash algorithm (PAP vs MSCHAPv2), check keyboard layout."
          },
          {
            name: "ERR_ACCOUNT_DISABLED",
            description: "User status not Active. Check: User status in portal, check-in date passed, check-out date not reached, not suspended by admin."
          },
          {
            name: "ERR_LICENSE_EXCEEDED",
            description: "Site at license capacity. Check license utilization in dashboard. Solutions: Block inactive users, contact sales for upgrade."
          },
          {
            name: "ERR_DEVICE_LIMIT",
            description: "User reached maximum devices. Check device list for user. Solutions: Help user remove old devices, increase limit in policy if appropriate."
          },
          {
            name: "ERR_MAC_NOT_REGISTERED",
            description: "Device MAC not in system (for MAC-auth enabled sites). Check: MAC registration required, help user register device, verify MAC format."
          },
          {
            name: "ERR_POLICY_VIOLATION",
            description: "Policy denies access. Check: Time-based restrictions, location restrictions, device type restrictions. Review policy configuration."
          },
          {
            name: "ERR_SESSION_EXISTS",
            description: "User already has active session. Check for duplicate sessions. Solutions: Disconnect existing session, check for session stuck in database."
          }
        ]
      },
      {
        type: "steps",
        title: "Diagnostic Workflow",
        steps: [
          {
            number: 1,
            title: "Gather Information",
            description: "From customer get: Username, MAC address of device, exact error message, time of failure, site name. Ask if this ever worked or is new setup."
          },
          {
            number: 2,
            title: "Check User Status",
            description: "Use impersonation or internal portal to verify: User exists, status is Active, within valid date range, has available license, policy assigned."
          },
          {
            number: 3,
            title: "Check Device Status",
            description: "Verify: Device is registered (if required), under user's device limit, MAC format is correct (AA:BB:CC:DD:EE:FF), not blacklisted."
          },
          {
            number: 4,
            title: "Review RADIUS Logs",
            description: "Go to Internal Portal > Audit Logs > RADIUS. Filter by username and time. Look for: Reject reason, attribute issues, backend errors."
          },
          {
            number: 5,
            title: "Test Authentication",
            description: "Use radtest tool to simulate authentication. This isolates client issues from server issues. If radtest works, problem is client-side."
          },
          {
            number: 6,
            title: "Check Site Health",
            description: "Verify site is Active (not suspended), RADIUS connectivity healthy, no active alerts, no ongoing maintenance."
          },
          {
            number: 7,
            title: "Attempt Fix",
            description: "Based on findings: Reset password, activate user, register device, clear stuck session, etc. Document action taken."
          },
          {
            number: 8,
            title: "Verify Resolution",
            description: "Have user attempt authentication again. Confirm success. If still failing, escalate with all diagnostic data."
          }
        ]
      },
      {
        type: "tips",
        title: "Quick Resolution Tips",
        items: [
          "Password reset resolves 40% of auth issues - try this first for simple cases",
          "Check time sync - RADIUS auth can fail if server clocks differ by >5 minutes",
          "Duplicate MAC across users causes random failures - check for this",
          "Recent password change may not have propagated - wait 60 seconds and retry",
          "For hotel guests: verify check-in processed in PMS before WiFi auth will work",
          "Ask user to 'forget network' and reconnect - fixes many client-side caching issues"
        ]
      }
    ]
  },

  "connectivity-issues": {
    title: "Network Connectivity Troubleshooting",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Guide for troubleshooting network connectivity problems including slow speeds, intermittent connections, and complete outages. Uses systematic layer-by-layer approach to isolate and resolve issues efficiently."
      },
      {
        type: "section",
        title: "Issue Categories",
        items: [
          {
            name: "Complete Outage",
            description: "No users can connect at all. Priority: P1. Check: ISP connectivity, core router, RADIUS server, site controller. Usually infrastructure-level issue."
          },
          {
            name: "Partial Outage",
            description: "Some users/areas affected. Priority: P2. Check: Specific AP status, switch port, VLAN configuration, DHCP pool exhaustion in affected segment."
          },
          {
            name: "Slow Speeds",
            description: "Users connected but slow. Priority: P3. Check: Bandwidth utilization, QoS settings, interference levels, backhaul capacity, user policy limits."
          },
          {
            name: "Intermittent Drops",
            description: "Random disconnections. Priority: P3. Check: Signal strength, RF interference, roaming configuration, session timeouts, AP firmware issues."
          },
          {
            name: "Authentication Only Issues",
            description: "Can connect to WiFi but auth fails. See Authentication Troubleshooting article. Usually portal/RADIUS issue not network."
          }
        ]
      },
      {
        type: "steps",
        title: "Layer-by-Layer Diagnosis",
        steps: [
          {
            number: 1,
            title: "Layer 1 - Physical",
            description: "Check: AP power and LED status, cable connections, switch port lights, any physical damage. For wireless: signal strength readings from client device."
          },
          {
            number: 2,
            title: "Layer 2 - Data Link",
            description: "Check: VLAN configuration correct, switch port VLAN assignment, AP SSID-to-VLAN mapping, MAC address table on switch, spanning tree issues."
          },
          {
            number: 3,
            title: "Layer 3 - Network",
            description: "Check: DHCP server reachable, IP address assigned correctly, gateway reachable (ping), DNS resolution working, routing tables correct."
          },
          {
            number: 4,
            title: "Layer 4-7 - Transport/Application",
            description: "Check: Firewall rules not blocking traffic, NAT configured correctly, captive portal redirect working, specific application issues."
          },
          {
            number: 5,
            title: "Authentication Layer",
            description: "Check: RADIUS server responding, user credentials valid, session established, CoA processed correctly."
          }
        ]
      },
      {
        type: "section",
        title: "Diagnostic Commands & Tools",
        items: [
          {
            name: "ping / traceroute",
            description: "Test basic connectivity and path. Ping gateway, RADIUS server, external sites. Traceroute shows where packets are dropped."
          },
          {
            name: "AP CLI Access",
            description: "SSH to AP for detailed diagnostics. Check associated clients, signal levels, channel utilization, error counters."
          },
          {
            name: "Controller Dashboard",
            description: "Centralized view of all APs. Shows: online/offline status, client counts, alerts, recent events."
          },
          {
            name: "DHCP Logs",
            description: "Verify IP addresses being assigned. Check for pool exhaustion, lease conflicts, option configuration."
          },
          {
            name: "Packet Capture",
            description: "For complex issues, capture packets at AP or switch. Analyze in Wireshark for protocol-level issues."
          }
        ]
      },
      {
        type: "tips",
        title: "Troubleshooting Best Practices",
        items: [
          "Always start with 'what changed?' - recent config changes often cause issues",
          "Isolate scope first - one user, one area, or entire site?",
          "Check monitoring alerts before deep diving - may already point to cause",
          "Compare to known-good configuration when stuck",
          "Document all findings - even dead ends help next engineer",
          "For intermittent issues, schedule monitoring during problem time window"
        ]
      }
    ]
  },

  "escalation-procedures": {
    title: "Escalation Procedures",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Proper escalation ensures issues reach the right team quickly while maintaining customer communication. This guide defines escalation levels, severity classification, and the process for smooth handoffs."
      },
      {
        type: "section",
        title: "Support Levels",
        items: [
          {
            name: "Level 1 - Support Engineer",
            description: "First contact for all issues. Handles: Password resets, basic troubleshooting, user/device management questions, documentation requests. SLA: 15 min response for P1-P2, 1 hour for P3-P4."
          },
          {
            name: "Level 2 - Deployment Engineer",
            description: "Escalation for technical issues. Handles: Configuration changes, integration issues, complex troubleshooting, performance problems. SLA: 30 min response for P1-P2, 4 hours for P3-P4."
          },
          {
            name: "Level 3 - Operations Manager / Platform Team",
            description: "System-wide issues and code fixes. Handles: Infrastructure problems, platform bugs, security incidents, multi-customer issues. SLA: 1 hour response for P1, 4 hours for P2."
          },
          {
            name: "Level 4 - Management",
            description: "Executive escalation. Handles: Critical outages affecting many customers, SLA breach situations, legal/compliance issues, customer executive complaints. SLA: Immediate for P1."
          }
        ]
      },
      {
        type: "section",
        title: "Severity Classification",
        items: [
          {
            name: "P1 - Critical",
            description: "Complete service outage for entire site or multiple sites. No workaround available. Business-critical impact. Examples: RADIUS server down, all users unable to authenticate."
          },
          {
            name: "P2 - High",
            description: "Major feature unavailable or severe performance degradation. Limited workaround may exist. Significant business impact. Examples: Reports not generating, very slow authentication."
          },
          {
            name: "P3 - Medium",
            description: "Feature impaired but functional workaround exists. Moderate business impact. Examples: Export failing but data viewable, specific report type broken."
          },
          {
            name: "P4 - Low",
            description: "Minor issue with minimal impact. Cosmetic issues, documentation questions, feature requests. Examples: Typo in portal, color preference request."
          }
        ]
      },
      {
        type: "steps",
        title: "Escalation Process",
        steps: [
          {
            number: 1,
            title: "Complete L1 Troubleshooting",
            description: "Before escalating, verify: Standard troubleshooting steps followed, issue reproducible, not a known issue with existing fix, customer impact documented."
          },
          {
            number: 2,
            title: "Document Thoroughly",
            description: "Update ticket with: Detailed issue description, steps to reproduce, troubleshooting already done, impact assessment, customer contact information."
          },
          {
            number: 3,
            title: "Classify Severity",
            description: "Assign P1-P4 based on impact. Don't over-escalate (damages credibility) or under-escalate (delays resolution). When unsure, ask manager."
          },
          {
            number: 4,
            title: "Notify Customer",
            description: "Inform customer: Issue is being escalated, expected response time based on severity, ticket reference number. Set appropriate expectations."
          },
          {
            number: 5,
            title: "Route to Correct Team",
            description: "Assign ticket to appropriate queue. For P1/P2, also send direct notification (Slack/call). Include all diagnostic data in handoff."
          },
          {
            number: 6,
            title: "Monitor Progress",
            description: "Track escalated ticket. Provide updates to customer per SLA (hourly for P1, every 4 hours for P2). Don't let tickets go stale."
          },
          {
            number: 7,
            title: "Confirm Resolution",
            description: "When resolved, verify with customer issue is fixed. Document root cause and solution. Update knowledge base if applicable."
          }
        ]
      },
      {
        type: "tips",
        title: "Escalation Best Practices",
        items: [
          "Better to escalate early than let P1 sit while you troubleshoot",
          "Quality of handoff documentation directly impacts resolution time",
          "Keep customer informed even if just 'still investigating'",
          "For P1: escalate AND start working - don't wait for next level",
          "Post-incident: review if escalation was appropriate - learn from each",
          "Build relationships with L2/L3 teams - makes escalation smoother"
        ]
      }
    ]
  },

  "license-management-internal": {
    title: "License Management (Internal)",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "License capacity determines how many concurrent users a customer site can support. This guide covers monitoring utilization, processing increase requests, and managing license allocation across sites."
      },
      {
        type: "section",
        title: "License Concepts",
        items: [
          {
            name: "License Capacity",
            description: "Maximum concurrent authenticated users allowed. Set per site based on contract. Exceeding capacity results in ERR_LICENSE_EXCEEDED for new authentications."
          },
          {
            name: "Current Utilization",
            description: "Number of currently authenticated users. Shown as count and percentage of capacity. Dashboard shows trend over time."
          },
          {
            name: "Peak Utilization",
            description: "Highest utilization reached in period. Important for capacity planning. If regularly hitting 90%+, customer may need upgrade."
          },
          {
            name: "Licensed vs Active Users",
            description: "Licensed = capacity limit. Active = currently authenticated. Total registered users may exceed license if not all online simultaneously."
          }
        ]
      },
      {
        type: "steps",
        title: "Processing License Increase Request",
        steps: [
          {
            number: 1,
            title: "Receive Request",
            description: "Request typically comes via: Support ticket, sales team, or automatic alert at high utilization. Verify requester is authorized customer contact."
          },
          {
            number: 2,
            title: "Check Contract Terms",
            description: "Review customer contract for: Included license count, overage pricing, upgrade tiers available. Some contracts have built-in expansion clauses."
          },
          {
            number: 3,
            title: "Analyze Utilization Pattern",
            description: "Check: Is this a temporary spike or sustained growth? What's the trend over last 30/60/90 days? Are there inactive users that could be cleaned up?"
          },
          {
            number: 4,
            title: "Calculate Billing Impact",
            description: "Determine: Additional monthly cost, pro-rated amount for current period, whether new tier pricing applies. Get finance approval if significant."
          },
          {
            number: 5,
            title: "Get Approval",
            description: "For >20% increase: Requires Operations Manager approval. For any billable increase: Requires customer acknowledgment of cost impact."
          },
          {
            number: 6,
            title: "Apply Change",
            description: "Go to Internal Portal > Sites > [Site] > License Settings. Update capacity. Change takes effect immediately. No restart required."
          },
          {
            number: 7,
            title: "Confirm and Document",
            description: "Notify customer of new capacity. Update billing system (IT integration point). Document in customer notes with ticket reference."
          }
        ]
      },
      {
        type: "section",
        title: "License Monitoring & Alerts",
        items: [
          {
            name: "80% Utilization Alert",
            description: "Warning level. Customer notified via email. Good time for proactive outreach about upgrade options."
          },
          {
            name: "90% Utilization Alert",
            description: "High utilization. Customer and support notified. Review for temporary spike vs upgrade need."
          },
          {
            name: "95% Utilization Alert",
            description: "Critical level. Immediate attention needed. Some authentications may start failing during peaks."
          },
          {
            name: "100% Utilization",
            description: "At capacity. New users cannot authenticate. Urgent upgrade or user cleanup needed."
          }
        ]
      },
      {
        type: "tips",
        title: "License Management Best Practices",
        items: [
          "Proactively reach out when utilization trends toward 80%",
          "Review license usage in monthly customer reports",
          "Help customers clean up inactive users before upgrading",
          "Seasonal businesses may need temporary capacity increases",
          "Document all license changes with business justification",
          "Set up alerts for all customers approaching capacity"
        ]
      }
    ]
  },

  "api-integration": {
    title: "API Integration Guide",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Our platform offers REST APIs for customer system integration. This guide covers API authentication, common endpoints, rate limits, and integration best practices for deployment engineers setting up customer integrations."
      },
      {
        type: "section",
        title: "API Fundamentals",
        items: [
          {
            name: "Authentication",
            description: "OAuth 2.0 with client credentials grant. Request token from /oauth/token with client_id and client_secret. Access tokens expire in 1 hour. Refresh tokens valid for 7 days."
          },
          {
            name: "Base URLs",
            description: "Production: api.spectraone.com/v1. Staging: staging-api.spectraone.com/v1. Always use HTTPS. API versioning in URL path."
          },
          {
            name: "Rate Limits",
            description: "100 requests/minute per API key. Bulk endpoints count as single request. 429 Too Many Requests returned when exceeded. Implement exponential backoff."
          },
          {
            name: "Response Format",
            description: "JSON format. Standard envelope: { success: boolean, data: {object}, error: {code, message}, meta: {pagination} }. HTTP status codes follow REST conventions."
          }
        ]
      },
      {
        type: "section",
        title: "Common Endpoints",
        items: [
          {
            name: "User Management",
            description: "POST /users (create user), GET /users/{id} (get user), PUT /users/{id} (update), DELETE /users/{id} (soft delete), GET /users?status=active (list with filters)."
          },
          {
            name: "Device Management",
            description: "POST /devices (register device), GET /devices/mac/{mac} (lookup by MAC), DELETE /devices/{id} (remove), GET /users/{id}/devices (user's devices)."
          },
          {
            name: "Session Management",
            description: "GET /sessions/active (list active sessions), POST /sessions/{id}/disconnect (terminate session), GET /sessions/user/{userId} (user's sessions)."
          },
          {
            name: "Usage & Reporting",
            description: "GET /reports/usage?start=X&end=Y (usage data), GET /reports/bandwidth (bandwidth stats), GET /reports/auth-failures (failed authentications)."
          },
          {
            name: "Webhooks",
            description: "POST /webhooks (register webhook), GET /webhooks (list registered), DELETE /webhooks/{id} (remove). Events: user.created, session.start, session.end, license.warning."
          }
        ]
      },
      {
        type: "steps",
        title: "Setting Up Customer API Access",
        steps: [
          {
            number: 1,
            title: "Verify Use Case",
            description: "Understand what customer wants to integrate. Common: PMS sync, corporate directory, billing system, custom portal. Document requirements."
          },
          {
            number: 2,
            title: "Create API Credentials",
            description: "Go to Internal Portal > Configuration > API Keys > Create. Set: Customer, scope (read/write), rate limit, expiry (if applicable)."
          },
          {
            number: 3,
            title: "Configure Scopes",
            description: "Apply principle of least privilege. Only grant access to endpoints customer actually needs. Separate read-only from write access where possible."
          },
          {
            number: 4,
            title: "Provide Documentation",
            description: "Share API documentation link. Include: endpoint reference, authentication guide, code examples in customer's preferred language."
          },
          {
            number: 5,
            title: "Set Up Staging",
            description: "Create staging API key pointing to staging environment. Customer develops and tests against staging before production."
          },
          {
            number: 6,
            title: "Monitor Initial Integration",
            description: "Watch for: Error rates, rate limit hits, unexpected patterns. Proactively reach out if issues detected."
          }
        ]
      },
      {
        type: "tips",
        title: "API Integration Best Practices",
        items: [
          "Always recommend webhooks over polling for real-time needs",
          "Help customers implement proper error handling and retry logic",
          "Set appropriate rate limits - too low frustrates, too high risks abuse",
          "Log all API calls for troubleshooting - keep 30 days minimum",
          "Test integration in staging thoroughly before production go-live",
          "Review API usage monthly for unusual patterns or optimization opportunities"
        ]
      }
    ]
  },

  "pms-integration": {
    title: "PMS Integration (Hotels)",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Property Management System (PMS) integration enables automatic guest WiFi provisioning based on hotel check-in and check-out events. This is essential for hotel deployments to provide seamless guest experience."
      },
      {
        type: "section",
        title: "Supported PMS Systems",
        items: [
          {
            name: "Oracle Opera",
            description: "Industry standard hotel PMS. Integration via HTNG (Hospitality Technology Next Generation) interface. Supports real-time check-in/check-out events. Requires Opera Cloud or on-premise with HTNG module."
          },
          {
            name: "Protel",
            description: "Popular in Europe and Asia. REST API integration. Can be real-time (webhook) or polling-based (every 5 minutes). Supports room move and name change events."
          },
          {
            name: "Clock PMS",
            description: "Cloud-native PMS. Native webhook support. Real-time event delivery. Simple integration setup. Growing market share in boutique hotels."
          },
          {
            name: "Mews",
            description: "Modern cloud PMS. GraphQL and REST APIs. Excellent webhook support. Real-time sync. Popular with modern/tech-forward properties."
          },
          {
            name: "IDS Next",
            description: "Common in India/Asia. REST API available. May require custom integration work. Check specific version for API availability."
          },
          {
            name: "Custom/Other",
            description: "Generic REST/SOAP interface for other PMS systems. Requires development work to build adapter. Document API specifications from hotel."
          }
        ]
      },
      {
        type: "steps",
        title: "PMS Integration Setup",
        steps: [
          {
            number: 1,
            title: "Gather PMS Information",
            description: "Get from hotel: PMS vendor and version, API endpoint URL, authentication credentials (API key, OAuth, or basic auth), contact for PMS vendor support."
          },
          {
            number: 2,
            title: "Configure Integration",
            description: "Go to Site Configuration > Integrations > PMS. Select PMS type from dropdown. Enter endpoint URL and credentials. Set sync mode (real-time webhook or polling)."
          },
          {
            number: 3,
            title: "Map Data Fields",
            description: "Configure field mapping: Guest name → User display name, Room number → Username (or generate), Check-in date → Valid from, Check-out date → Valid until, Reservation ID → External reference."
          },
          {
            number: 4,
            title: "Set Up Event Handlers",
            description: "Configure actions for events: Check-in → Create user with room-based credentials, Check-out → Expire user account, Room change → Update user room assignment, Early departure → Immediate expiry."
          },
          {
            number: 5,
            title: "Configure Policies",
            description: "Map room types or rate codes to policies. Example: Standard rooms → Free WiFi policy, Suites → Premium policy, Loyalty members → Upgraded policy."
          },
          {
            number: 6,
            title: "Test Integration",
            description: "Create test reservation in PMS with future dates. Verify: User created in WiFi portal, correct room assignment, policy applied. Test check-out: verify user expired."
          },
          {
            number: 7,
            title: "Enable and Monitor",
            description: "Enable integration for production. Monitor sync logs for first 24-48 hours. Check for: Sync errors, duplicate users, timing issues."
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common PMS Issues",
        items: [
          {
            issue: "Users not created on check-in",
            solution: "Verify: PMS is sending events (check PMS logs), our endpoint is receiving (check integration logs), field mapping is correct, API credentials valid."
          },
          {
            issue: "Duplicate users created",
            solution: "Check: Reservation ID mapping for uniqueness, check-in event firing multiple times, room change creating new user instead of updating."
          },
          {
            issue: "Users not expired on check-out",
            solution: "Verify: Check-out event handler enabled, timezone configuration correct (common issue!), PMS sending check-out event, our system receiving it."
          },
          {
            issue: "Wrong policy assigned",
            solution: "Review: Room type to policy mapping, rate code configuration, fallback policy settings. Test with specific room types."
          },
          {
            issue: "Integration stopped working",
            solution: "Check: API credentials not expired/rotated, PMS system updated (may change API), network connectivity, SSL certificate validity."
          }
        ]
      },
      {
        type: "tips",
        title: "PMS Best Practices",
        items: [
          "Always have hotel IT and front desk contacts for PMS issues",
          "Test integration during quiet period, not peak check-in time",
          "Document room type to policy mapping in customer notes",
          "Set up alerting for integration failures",
          "Plan for PMS upgrades - API changes may break integration",
          "Consider fallback manual process if integration down during peak"
        ]
      }
    ]
  },

  "sla-monitoring": {
    title: "SLA Monitoring & Reporting",
    category: "Operations",
    content: [
      {
        type: "intro",
        text: "Service Level Agreements define our commitment to customers. Monitoring SLA compliance and producing accurate reports is essential for customer satisfaction and contractual obligations."
      },
      {
        type: "section",
        title: "Standard SLA Metrics",
        items: [
          {
            name: "Service Availability",
            description: "Target: 99.9% (8.76 hours downtime/year). Calculation: (Total time - Unplanned downtime) / Total time. Excludes: Scheduled maintenance with 48hr notice, customer-caused outages."
          },
          {
            name: "Authentication Response Time",
            description: "Target: <500ms for 95th percentile. Measurement: Time from RADIUS Access-Request to Access-Accept/Reject. Monitored at server side."
          },
          {
            name: "Support Response Time",
            description: "P1: 15 minutes, P2: 30 minutes, P3: 4 hours, P4: 24 hours. Clock starts at ticket creation (or customer contact for P1). Response = first meaningful update, not auto-reply."
          },
          {
            name: "Support Resolution Time",
            description: "P1: 2 hours, P2: 4 hours, P3: 24 hours, P4: 72 hours. Resolution = customer confirms issue fixed or workaround accepted."
          },
          {
            name: "Scheduled Maintenance",
            description: "Advance notice: 48 hours minimum (72 hours preferred). Window: Low-usage period as defined in contract. Duration: Stated in maintenance notice."
          }
        ]
      },
      {
        type: "steps",
        title: "Generating SLA Reports",
        steps: [
          {
            number: 1,
            title: "Access SLA Reports",
            description: "Navigate to Internal Portal > Reports > SLA Reports. Select report type: Availability, Support Performance, or Combined."
          },
          {
            number: 2,
            title: "Select Scope",
            description: "Choose: Specific customer, customer group, or all customers. Select specific site or all sites for customer. Choose reporting period (typically monthly)."
          },
          {
            number: 3,
            title: "Generate Report",
            description: "Click Generate. Report calculates: Availability percentage, auth response times (avg, 95th percentile), support metrics by priority, incidents affecting SLA."
          },
          {
            number: 4,
            title: "Review for Accuracy",
            description: "Verify: Maintenance windows excluded correctly, customer-caused incidents not counted against us, any disputes have been resolved, data looks reasonable."
          },
          {
            number: 5,
            title: "Export and Deliver",
            description: "Export as PDF for customer delivery. For key accounts, schedule review call to walk through report. Archive report for records."
          }
        ]
      },
      {
        type: "section",
        title: "SLA Breach Handling",
        items: [
          {
            name: "Detection",
            description: "System alerts when SLA metrics at risk. Dashboard shows real-time compliance status. Escalate immediately when breach imminent."
          },
          {
            name: "Documentation",
            description: "Document: What happened, root cause, impact duration, users affected, remediation steps, prevention measures."
          },
          {
            name: "Customer Communication",
            description: "Proactively notify customer of breach. Don't wait for them to notice. Acknowledge impact, explain cause, describe corrective actions."
          },
          {
            name: "Credits (if applicable)",
            description: "Calculate credit per contract terms. Process through billing. Document in customer account. Most contracts: 10% credit for each 0.1% below SLA."
          }
        ]
      },
      {
        type: "tips",
        title: "SLA Management Best Practices",
        items: [
          "Share SLA reports proactively - don't wait for customers to ask",
          "Investigate any dip in metrics before customer notices",
          "Maintain detailed incident logs for any SLA discussions",
          "Coordinate maintenance windows with customer preferences",
          "Regular SLA reviews identify trends before they become breaches",
          "Build relationship credit with strong performance - helps when issues occur"
        ]
      }
    ]
  },

  "security-incidents": {
    title: "Security Incident Response",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Security incidents require immediate, coordinated response to contain damage, investigate root cause, and prevent recurrence. This guide provides procedures for common security incidents at customer sites."
      },
      {
        type: "section",
        title: "Incident Categories",
        items: [
          {
            name: "Unauthorized Access",
            description: "Unknown users or devices on network. Indicators: Unfamiliar usernames, unexpected MAC addresses, access from unusual locations/times. May indicate credential theft or rogue AP."
          },
          {
            name: "Credential Compromise",
            description: "User credentials stolen or exposed. Indicators: Multiple failed logins then success, simultaneous sessions from different locations, user reports not logging in."
          },
          {
            name: "Network Abuse",
            description: "Malicious use of network. Indicators: Excessive bandwidth consumption, traffic to known bad IPs, malware C2 communications, illegal content hosting."
          },
          {
            name: "Denial of Service",
            description: "Attempt to disrupt service. Indicators: Authentication floods, DHCP exhaustion, wireless deauth attacks. May be intentional attack or misconfigured device."
          },
          {
            name: "Data Breach",
            description: "Unauthorized access to or exfiltration of data. Most serious category. Indicators: Unusual data access patterns, large exports, access to sensitive reports."
          }
        ]
      },
      {
        type: "steps",
        title: "Incident Response Steps",
        steps: [
          {
            number: 1,
            title: "Detect and Verify",
            description: "Confirm incident is real (not false positive). Gather initial evidence: What triggered alert, what systems affected, what data at risk."
          },
          {
            number: 2,
            title: "Contain Immediately",
            description: "Stop the bleeding: Block suspicious accounts, isolate affected systems, terminate malicious sessions. Containment > investigation initially."
          },
          {
            number: 3,
            title: "Escalate Appropriately",
            description: "P1 security incidents: Notify security team, Operations Manager, and potentially management. Data breach: Engage legal immediately."
          },
          {
            number: 4,
            title: "Preserve Evidence",
            description: "Capture logs BEFORE any remediation. Screenshot dashboards. Export relevant audit logs. Don't clear logs - investigators need them."
          },
          {
            number: 5,
            title: "Investigate",
            description: "Determine: Attack vector (how did they get in), scope (what was accessed), timeline (when did it start), attribution (who if determinable)."
          },
          {
            number: 6,
            title: "Remediate",
            description: "Fix vulnerability that allowed incident. Reset all potentially compromised credentials. Patch systems. Implement additional controls."
          },
          {
            number: 7,
            title: "Communicate",
            description: "Internal: Incident report to stakeholders. Customer: Appropriate notification based on impact. Regulatory: If data breach triggers reporting requirements."
          },
          {
            number: 8,
            title: "Post-Incident Review",
            description: "Conduct review: What happened, how detected, response effectiveness, lessons learned, improvements needed. Update procedures as needed."
          }
        ]
      },
      {
        type: "section",
        title: "Quick Response Actions",
        items: [
          {
            name: "Block User Account",
            description: "User Management > Find user > Actions > Block. Terminates all active sessions immediately. Use for: Credential compromise, policy violations."
          },
          {
            name: "Block MAC Address",
            description: "Device Management > Add to blacklist. Prevents device from authenticating on any user. Use for: Rogue devices, malware-infected devices."
          },
          {
            name: "Terminate All Sessions",
            description: "Site Management > Actions > Disconnect All Sessions. Nuclear option - all users must reauthenticate. Use for: Active attack in progress."
          },
          {
            name: "Suspend Site",
            description: "Site Management > Actions > Suspend. Stops all authentication. Use for: Major security incident requiring investigation."
          }
        ]
      },
      {
        type: "tips",
        title: "Security Best Practices",
        items: [
          "Never downplay security concerns - investigate thoroughly",
          "Preserve logs first, investigate second, fix third",
          "Don't discuss incidents on unsecure channels (public Slack, email)",
          "Document everything with timestamps - helps legal and forensics",
          "Coordinate with customer's security team when applicable",
          "Regular security reviews and pen tests prevent incidents"
        ]
      }
    ]
  },

  "internal-portal-navigation": {
    title: "Internal Portal Navigation Guide",
    category: "Getting Started",
    content: [
      {
        type: "intro",
        text: "The Internal Portal provides Spectra staff with tools to manage customers, sites, support, and system configuration. This guide covers navigation, key features, and workflows for new team members."
      },
      {
        type: "section",
        title: "Main Navigation Areas",
        items: [
          {
            name: "Dashboard",
            description: "Overview of platform health, active sites, recent activity, alerts requiring attention. Customizable widgets based on role."
          },
          {
            name: "Sites",
            description: "List and manage all customer sites. View status, configuration, usage metrics. Access site details for deep configuration."
          },
          {
            name: "Provisioning Queue",
            description: "New sites awaiting deployment. Deployment Engineers pick up sites here, configure them, and move through status workflow to Active."
          },
          {
            name: "Customers",
            description: "Customer accounts across all sites. View company details, contacts, contract information. Entry point for 'View as Customer' impersonation."
          },
          {
            name: "Guest Access",
            description: "Manage guest WiFi across all hotels and venues. View guest accounts, vouchers, access logs across customers."
          },
          {
            name: "Reports",
            description: "Cross-customer analytics and reporting. SLA reports, usage trends, billing data, custom report generation."
          },
          {
            name: "Support",
            description: "Support ticket queue. View all tickets, filter by status/priority/customer. Access to support tools and escalation workflows."
          },
          {
            name: "Alerts",
            description: "System alerts and notifications. License warnings, site health issues, integration failures. Configure alert thresholds."
          },
          {
            name: "Bulk Operations",
            description: "Mass operations across multiple customers/sites. Import users, update statuses, export data. Super Admin only."
          },
          {
            name: "Audit Logs",
            description: "Complete audit trail. Who did what, when, where. Filter by user, action type, customer, date range."
          },
          {
            name: "Configuration",
            description: "System settings. RADIUS defaults, email templates, API keys, feature flags. Super Admin only for most settings."
          },
          {
            name: "Knowledge Base",
            description: "This knowledge center. Internal documentation, procedures, troubleshooting guides."
          }
        ]
      },
      {
        type: "section",
        title: "Common Workflows",
        items: [
          {
            name: "Finding a Customer",
            description: "Customers > Search by name/ID > Click to view details. Or use global search (Ctrl+K) for quick lookup across all entities."
          },
          {
            name: "Checking Site Status",
            description: "Sites > Search/filter > View status column. Click site name for full details including health metrics and recent activity."
          },
          {
            name: "Viewing as Customer",
            description: "Customers > Select customer > Click 'View as Customer'. Portal switches to customer view. Click 'Exit' in sidebar to return."
          },
          {
            name: "Handling Support Ticket",
            description: "Support > My Queue or All Tickets > Select ticket > View details > Add update or resolve. Escalate button for handoff."
          }
        ]
      },
      {
        type: "tips",
        title: "Productivity Tips",
        items: [
          "Use keyboard shortcuts: Ctrl+K for global search, Esc to close modals",
          "Bookmark frequently accessed customers/sites",
          "Dashboard widgets can be customized - set up for your workflow",
          "Use filters extensively - most lists have powerful filtering",
          "Audit logs are your friend for understanding 'what changed?'",
          "When stuck, search Knowledge Base before asking colleagues"
        ]
      }
    ]
  }
};

// Video tutorials for internal staff
export const internalVideoTutorials = [
  {
    id: "vid-1",
    title: "Site Provisioning Queue Walkthrough",
    description: "Complete guide to the Site Provisioning Queue: picking up sites, configuring, testing, and RFS confirmation.",
    duration: "18:30",
    category: "Site Configuration",
    videoFile: "internal/site-provisioning-queue.mp4"
  },
  {
    id: "vid-2",
    title: "Customer Impersonation Feature",
    description: "How to use View as Customer safely and effectively for support and troubleshooting.",
    duration: "12:15",
    category: "Operations",
    videoFile: "internal/customer-impersonation.mp4"
  },
  {
    id: "vid-3",
    title: "Site Configuration Deep Dive",
    description: "Detailed walkthrough of site configuration: RADIUS, policies, branding, and segment-specific settings.",
    duration: "25:00",
    category: "Site Configuration",
    videoFile: "internal/site-configuration.mp4"
  },
  {
    id: "vid-4",
    title: "RADIUS Configuration & Troubleshooting",
    description: "Setting up RADIUS servers, shared secrets, VSAs, and diagnosing common authentication issues.",
    duration: "22:45",
    category: "Site Configuration",
    videoFile: "internal/radius-config.mp4"
  },
  {
    id: "vid-5",
    title: "Authentication Troubleshooting",
    description: "Step-by-step guide to diagnosing and resolving user authentication failures using logs and tools.",
    duration: "18:20",
    category: "Troubleshooting",
    videoFile: "internal/auth-troubleshooting.mp4"
  },
  {
    id: "vid-6",
    title: "Network Connectivity Diagnostics",
    description: "Layer-by-layer approach to troubleshooting network issues: outages, slow speeds, and intermittent problems.",
    duration: "16:45",
    category: "Troubleshooting",
    videoFile: "internal/network-diagnostics.mp4"
  },
  {
    id: "vid-7",
    title: "PMS Integration Setup (Hotels)",
    description: "Configuring Property Management System integration for hotel customers: Opera, Protel, Clock, and others.",
    duration: "20:00",
    category: "Site Configuration",
    videoFile: "internal/pms-integration.mp4"
  },
  {
    id: "vid-8",
    title: "Customer Onboarding Process",
    description: "End-to-end customer onboarding from contract signing to go-live and BAU handoff.",
    duration: "25:10",
    category: "Operations",
    videoFile: "internal/customer-onboarding.mp4"
  },
  {
    id: "vid-9",
    title: "Bandwidth Management & QoS",
    description: "Configuring bandwidth policies, traffic shaping, and Quality of Service for optimal user experience.",
    duration: "16:45",
    category: "Site Configuration",
    videoFile: "internal/bandwidth-qos.mp4"
  },
  {
    id: "vid-10",
    title: "License Management",
    description: "Monitoring license utilization, processing upgrade requests, and managing capacity across sites.",
    duration: "12:30",
    category: "Operations",
    videoFile: "internal/license-management.mp4"
  },
  {
    id: "vid-11",
    title: "Escalation & Support Procedures",
    description: "When and how to escalate issues, severity classification, and handoff best practices.",
    duration: "14:20",
    category: "Operations",
    videoFile: "internal/escalation.mp4"
  },
  {
    id: "vid-12",
    title: "Security Incident Response",
    description: "Handling security incidents: detection, containment, investigation, and post-incident procedures.",
    duration: "19:50",
    category: "Troubleshooting",
    videoFile: "internal/security-response.mp4"
  },
  {
    id: "vid-13",
    title: "Bulk Operations Guide",
    description: "Using bulk operations safely: imports, updates, and exports across multiple customers.",
    duration: "15:00",
    category: "Operations",
    videoFile: "internal/bulk-operations.mp4"
  },
  {
    id: "vid-14",
    title: "API Integration Basics",
    description: "Setting up customer API access, common endpoints, and integration troubleshooting.",
    duration: "17:00",
    category: "Site Configuration",
    videoFile: "internal/api-basics.mp4"
  },
  {
    id: "vid-15",
    title: "Internal Portal Navigation",
    description: "Tour of the internal portal: navigation, common workflows, and productivity tips.",
    duration: "11:40",
    category: "Getting Started",
    videoFile: "internal/portal-tour.mp4"
  },
  {
    id: "vid-16",
    title: "SLA Monitoring & Reporting",
    description: "Generating SLA reports, understanding metrics, and handling breach situations.",
    duration: "13:30",
    category: "Operations",
    videoFile: "internal/sla-reporting.mp4"
  }
];

// FAQ data for internal staff
export const internalFAQs = [
  // Site Provisioning Queue
  {
    id: "faq-pq-1",
    category: "Site Configuration",
    question: "What's the difference between site statuses in the Provisioning Queue?",
    answer: "Configuration Pending = new site from billing, waiting to be picked up. Under Configuration = deployment engineer actively configuring. Under Testing = config done, running test checklist. RFS Pending = tests passed, awaiting go-live confirmation. Active = live site visible to customers. Suspended = temporarily disabled. Blocked = permanently disabled (Super Admin to unblock)."
  },
  {
    id: "faq-pq-2",
    category: "Site Configuration",
    question: "Why can't I edit certain fields in the Provisioning Queue?",
    answer: "Fields like customer name, service ID, address, and billing plan come from the billing system and are read-only to maintain data integrity. If these need correction, contact the billing team to update at source, then the queue will reflect changes."
  },
  {
    id: "faq-pq-3",
    category: "Site Configuration",
    question: "Can I set an RFS date in the past?",
    answer: "Yes! When selecting the RFS date/time, you can choose a past date for immediate activation. This is useful when the customer is already ready and there's no need to schedule future activation. The site becomes Active immediately upon confirmation."
  },

  // Customer Impersonation
  {
    id: "faq-imp-1",
    category: "Operations",
    question: "What happens when I impersonate a customer?",
    answer: "You see the customer portal exactly as the customer admin sees it. The sidebar switches to customer navigation. All actions you take are logged with your internal user ID. A banner shows you're in impersonation mode. Click 'Exit Customer View' to return to internal portal."
  },
  {
    id: "faq-imp-2",
    category: "Operations",
    question: "Can customers see that I impersonated their account?",
    answer: "Yes. Actions taken during impersonation appear in the customer's activity log as 'Internal User (via impersonation)'. Your name is visible. This is intentional for transparency and audit compliance."
  },
  {
    id: "faq-imp-3",
    category: "Operations",
    question: "Who can use the impersonation feature?",
    answer: "Super Admin, Operations Manager, Deployment Engineer, and Sales Representative have impersonation access. Support Engineers have read-only impersonation. Demo Accounts cannot impersonate. Check with your manager if you believe you need this access."
  },

  // Site Configuration
  {
    id: "faq-1",
    category: "Site Configuration",
    question: "How do I provision a new site for an existing customer?",
    answer: "New sites come through the Provisioning Queue from the billing system. Go to Provisioning Queue, find the Configuration Pending site, click 'Start Configuration' to claim it. Complete configuration, testing checklist, then submit for RFS. If site isn't in queue, contact billing team to initiate."
  },
  {
    id: "faq-2",
    category: "Site Configuration",
    question: "What's the standard RADIUS timeout configuration?",
    answer: "Standard: Response timeout 5 seconds, retry count 3, failover threshold 5 consecutive failures. For international/high-latency sites: increase timeout to 10 seconds. Always configure both primary and secondary RADIUS for redundancy."
  },
  {
    id: "faq-3",
    category: "Site Configuration",
    question: "How do I set up a custom domain for a customer?",
    answer: "Go to Configuration > Domains > Add Domain. Enter the domain (e.g., wifi.customer.com), configure DNS CNAME to point to our servers, provision SSL certificate (automatic via Let's Encrypt), test HTTPS access. Document in customer notes."
  },
  {
    id: "faq-4",
    category: "Site Configuration",
    question: "What bandwidth tiers should I create for a typical hotel?",
    answer: "Standard hotel tiers: Free/Basic (5-10 Mbps, 2GB daily FUP), Standard (25 Mbps, 10GB daily), Premium (50 Mbps, unlimited). Create separate Staff tier with higher speeds and no captive portal. Map to PMS room types for automatic assignment."
  },
  {
    id: "faq-5",
    category: "Site Configuration",
    question: "How do I handle segment-specific configuration differences?",
    answer: "Each segment has different defaults: Enterprise = AD integration, high device limits, no guest portal. Hotel = PMS integration, room-based auth, tiered packages. Co-Living = long-term validity dates, FUP enforcement. Co-Working = member types, day passes. PG = simple setup, monthly billing alignment. Check segment-specific articles in Knowledge Base."
  },

  // Troubleshooting
  {
    id: "faq-6",
    category: "Troubleshooting",
    question: "User gets 'Access Denied' but account looks fine. What to check?",
    answer: "Systematic check: 1) User status is Active, 2) Current date within check-in/check-out range, 3) Device registered and within limit, 4) License available at site, 5) No IP/MAC conflicts, 6) RADIUS logs for specific error code. Password reset resolves 40% of issues - try first."
  },
  {
    id: "faq-7",
    category: "Troubleshooting",
    question: "How do I diagnose slow WiFi speeds?",
    answer: "Layer by layer: 1) Check user's policy speed limit, 2) Site bandwidth utilization, 3) Number of devices on AP (congestion), 4) Signal strength from client location, 5) Channel interference, 6) Backhaul capacity vs users. Use speed test from user device and compare to policy."
  },
  {
    id: "faq-8",
    category: "Troubleshooting",
    question: "Customer reports intermittent disconnections. Where to start?",
    answer: "Check: 1) Session timeout settings (too short?), 2) Roaming configuration between APs, 3) DHCP lease times, 4) Idle timeout in policy, 5) AP logs for disassociation reasons, 6) RF interference from neighboring networks. Often caused by aggressive power save on client devices."
  },
  {
    id: "faq-9",
    category: "Troubleshooting",
    question: "RADIUS authentication suddenly failing for all users at a site?",
    answer: "Likely infrastructure issue. Check: 1) Site controller online, 2) RADIUS server responding (ping + radtest), 3) Shared secret unchanged, 4) Firewall rules (UDP 1812/1813), 5) SSL certificate validity, 6) Time sync between servers (>5 min drift breaks auth)."
  },
  {
    id: "faq-10",
    category: "Troubleshooting",
    question: "PMS integration stopped syncing guest check-ins?",
    answer: "Check: 1) API credentials not expired/rotated, 2) PMS system not updated (API changes), 3) Network connectivity to PMS server, 4) Integration logs for specific errors, 5) Test with manual reservation. Contact hotel IT for PMS-side investigation."
  },

  // Operations
  {
    id: "faq-11",
    category: "Operations",
    question: "Customer wants to increase license capacity. What's the process?",
    answer: "1) Verify request from authorized contact, 2) Check contract terms for pricing, 3) Review utilization pattern (temporary vs sustained), 4) Calculate billing impact, 5) Get approval if >20% increase, 6) Update in site settings, 7) Confirm to customer, 8) Update billing system."
  },
  {
    id: "faq-12",
    category: "Operations",
    question: "When should I escalate an issue to L2/L3?",
    answer: "Escalate when: Standard troubleshooting exhausted, configuration changes needed beyond L1 scope, infrastructure issues suspected, customer explicitly requests escalation, SLA breach risk. Always document troubleshooting done and include all diagnostic data in handoff."
  },
  {
    id: "faq-13",
    category: "Operations",
    question: "How do I schedule maintenance for a customer site?",
    answer: "1) Coordinate with customer at least 48 hours advance, 2) Create maintenance window in system (Configuration > Maintenance), 3) Send notification email to customer contacts, 4) Perform during agreed low-usage period, 5) Verify functionality post-maintenance, 6) Close window and confirm to customer."
  },
  {
    id: "faq-14",
    category: "Operations",
    question: "Customer disputing SLA compliance. How to handle?",
    answer: "1) Generate detailed SLA report for disputed period, 2) Review incident logs for outages, 3) Verify scheduled maintenance excluded correctly, 4) Check for customer-caused incidents (not counted against us), 5) Document analysis, 6) Escalate to account manager if customer unsatisfied."
  },
  {
    id: "faq-15",
    category: "Operations",
    question: "What's the process to suspend a customer site?",
    answer: "1) Verify authorization (billing for non-payment, security for investigation, customer request), 2) Document reason in site notes, 3) Notify support team, 4) Execute via Site > Actions > Suspend, 5) Verify suspension effective. Reactivation by Operations Manager or above."
  },

  // Security
  {
    id: "faq-16",
    category: "Security",
    question: "Suspected unauthorized access at customer site. What to do?",
    answer: "1) Verify with customer it's not their staff, 2) Check for unknown users/devices, 3) Look for rogue APs, 4) Review auth logs for anomalies, 5) If confirmed: block suspicious accounts/MACs, 6) Escalate to security team for investigation, 7) Preserve all logs before any changes."
  },
  {
    id: "faq-17",
    category: "Security",
    question: "Customer reports potential credential compromise?",
    answer: "Immediate: 1) Reset affected user passwords, 2) Terminate active sessions, 3) Review access logs for unusual activity. Then: 4) Check for unauthorized device registrations, 5) Enable additional auth if available, 6) Document and report incident, 7) Advise customer on password hygiene."
  },
  {
    id: "faq-18",
    category: "Security",
    question: "What constitutes a security incident requiring escalation?",
    answer: "Escalate immediately: 1) Confirmed unauthorized access, 2) Data breach (any customer data exposed), 3) Active attack in progress, 4) Credential compromise affecting multiple users, 5) Malware detected on network, 6) Suspicious access from unusual locations. Don't wait to investigate - escalate and investigate in parallel."
  },

  // Integration
  {
    id: "faq-19",
    category: "Integration",
    question: "Customer needs API access for custom integration. What's the process?",
    answer: "1) Understand use case and scope, 2) Create API credentials in Configuration > API Keys, 3) Set appropriate rate limits and scopes, 4) Provide API documentation link, 5) Help set up staging environment, 6) Monitor initial integration for issues. Document in customer notes."
  },
  {
    id: "faq-20",
    category: "Integration",
    question: "Which PMS systems do we support for hotel integration?",
    answer: "Fully supported: Oracle Opera (HTNG), Protel (REST), Clock PMS (webhook), Mews (GraphQL/REST). Partially supported: IDS Next, various regional systems via custom adapter. For unlisted PMS: Request API documentation from hotel, evaluate effort for custom integration."
  },

  // Bulk Operations
  {
    id: "faq-21",
    category: "Operations",
    question: "Who can access Bulk Operations?",
    answer: "Only Super Admins have access to Bulk Operations due to the risk of mass changes. If you need bulk operations performed, submit request to your manager with: what needs to be done, which customers/sites affected, business justification, and approval documentation."
  },
  {
    id: "faq-22",
    category: "Operations",
    question: "What's the safest way to perform bulk operations?",
    answer: "1) Always preview before executing, 2) Start with small test batch, 3) Verify test results before full run, 4) Schedule during low-usage period, 5) Have rollback plan ready, 6) Keep source files for audit, 7) Monitor system during execution. Never skip the preview step."
  },

  // Internal Roles
  {
    id: "faq-23",
    category: "Operations",
    question: "What's the difference between internal portal roles?",
    answer: "Super Admin: Full access including config and bulk ops. Operations Manager: Day-to-day ops, impersonation, provisioning. Deployment Engineer: Site deployment and technical config. Support Engineer: Read-only impersonation, basic support. Sales Rep: Read-only for demos and customer info. Demo Account: Training/demo only, no real data access."
  }
];

// Helper functions
export const getInternalArticle = (articleId) => {
  return internalKnowledgeArticles[articleId] || null;
};

export const getInternalArticlesByCategory = (category) => {
  return Object.entries(internalKnowledgeArticles)
    .filter(([, article]) => article.category === category)
    .map(([id, article]) => ({ id, ...article }));
};

export const getInternalFAQsByCategory = (category) => {
  return internalFAQs.filter(faq => faq.category === category);
};

export const getInternalVideosByCategory = (category) => {
  return internalVideoTutorials.filter(video => video.category === category);
};

export const searchInternalKnowledge = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = {
    articles: [],
    videos: [],
    faqs: []
  };

  // Search articles
  Object.entries(internalKnowledgeArticles).forEach(([id, article]) => {
    if (
      article.title.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(article.content).toLowerCase().includes(lowerQuery)
    ) {
      results.articles.push({ id, ...article });
    }
  });

  // Search videos
  internalVideoTutorials.forEach(video => {
    if (
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery)
    ) {
      results.videos.push(video);
    }
  });

  // Search FAQs
  internalFAQs.forEach(faq => {
    if (
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    ) {
      results.faqs.push(faq);
    }
  });

  return results;
};

export default {
  articles: internalKnowledgeArticles,
  videos: internalVideoTutorials,
  faqs: internalFAQs
};
