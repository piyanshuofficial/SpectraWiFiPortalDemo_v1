// src/constants/internalKnowledgeData.js
// Knowledge Center content for internal Spectra staff

export const internalKnowledgeArticles = {
  "site-provisioning": {
    title: "Site Provisioning Guide",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Complete guide to provisioning new customer sites from initial setup to go-live. Follow these steps to ensure consistent and successful deployments."
      },
      {
        type: "steps",
        title: "Provisioning Workflow",
        steps: [
          {
            number: 1,
            title: "Create Customer Record",
            description: "Navigate to Customer Management > Add Customer. Enter company details, contract information, billing contacts, and primary technical contact."
          },
          {
            number: 2,
            title: "Create Site Entry",
            description: "Go to Site Management > Add Site. Link to customer, enter site address, timezone, and expected capacity (users/devices)."
          },
          {
            number: 3,
            title: "Configure Network Parameters",
            description: "Set up RADIUS server details, DHCP ranges, VLAN configurations, and subnet allocations based on site size."
          },
          {
            number: 4,
            title: "Create Default Policies",
            description: "Create initial user policies based on customer segment. Include basic, standard, and premium tiers with appropriate speed/data limits."
          },
          {
            number: 5,
            title: "Configure Domain & SSL",
            description: "Set up customer domain (e.g., wifi.customername.com), provision SSL certificate, configure DNS records."
          },
          {
            number: 6,
            title: "Test Connectivity",
            description: "Perform end-to-end testing: user registration, authentication, device binding, speed tests, and failover scenarios."
          },
          {
            number: 7,
            title: "Customer Handoff",
            description: "Create admin credentials, schedule training call, share documentation, and confirm go-live date."
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Always use the provisioning checklist to ensure no steps are missed",
          "Document any custom configurations in the site notes",
          "Verify network infrastructure compatibility before provisioning",
          "Set up monitoring alerts before go-live",
          "Create test user accounts for validation"
        ]
      }
    ]
  },

  "radius-configuration": {
    title: "RADIUS Server Configuration",
    category: "Site Configuration",
    content: [
      {
        type: "intro",
        text: "Configure RADIUS authentication for customer sites. This guide covers primary and backup RADIUS server setup, shared secrets, and attribute configurations."
      },
      {
        type: "section",
        title: "RADIUS Parameters",
        items: [
          {
            name: "Primary RADIUS Server",
            description: "Main authentication server. Configure IP, port (1812 for auth, 1813 for accounting), and shared secret."
          },
          {
            name: "Secondary RADIUS Server",
            description: "Failover server for high availability. Should be in different availability zone or data center."
          },
          {
            name: "Shared Secret",
            description: "Minimum 16 characters, alphanumeric with special characters. Store securely and rotate quarterly."
          },
          {
            name: "Timeout Settings",
            description: "Response timeout: 5 seconds. Retry count: 3. Failover threshold: 5 consecutive failures."
          }
        ]
      },
      {
        type: "steps",
        title: "Configuration Steps",
        steps: [
          {
            number: 1,
            title: "Access System Configuration",
            description: "Navigate to Internal Portal > Configuration > RADIUS Settings."
          },
          {
            number: 2,
            title: "Add RADIUS Server",
            description: "Click Add Server, enter IP address, authentication port (1812), accounting port (1813)."
          },
          {
            number: 3,
            title: "Configure Shared Secret",
            description: "Generate or enter shared secret. Copy for NAS/AP configuration."
          },
          {
            number: 4,
            title: "Set Attributes",
            description: "Configure vendor-specific attributes (VSAs) for bandwidth limits, session timeouts, VLAN assignments."
          },
          {
            number: 5,
            title: "Test Authentication",
            description: "Use radtest utility to verify authentication is working correctly."
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Authentication timeout",
            solution: "Verify firewall allows UDP 1812/1813. Check RADIUS server is running. Verify shared secret matches on both ends."
          },
          {
            issue: "Access-Reject for valid users",
            solution: "Check user exists in database, verify password hash algorithm matches, check user status is Active."
          },
          {
            issue: "Accounting packets not received",
            solution: "Verify accounting port (1813) is open, check NAS configuration sends accounting, verify server processes accounting."
          }
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
        text: "Configure bandwidth management policies, QoS settings, and fair usage policies to optimize network performance across customer sites."
      },
      {
        type: "section",
        title: "Bandwidth Parameters",
        items: [
          {
            name: "Per-User Bandwidth",
            description: "Set download/upload limits per user based on their policy tier. Typical ranges: 10-100 Mbps download, 5-50 Mbps upload."
          },
          {
            name: "Site-Wide Bandwidth",
            description: "Total bandwidth available at site. Ensure sum of active user limits doesn't exceed this for proper QoS."
          },
          {
            name: "Burst Allowance",
            description: "Temporary bandwidth boost above limit. Typical: 1.5x limit for 60 seconds. Improves perceived performance."
          },
          {
            name: "Fair Usage Threshold",
            description: "Data volume cap before throttling. Daily or monthly cycles. Common: 5GB daily, 100GB monthly."
          }
        ]
      },
      {
        type: "steps",
        title: "Configuring QoS",
        steps: [
          {
            number: 1,
            title: "Assess Site Capacity",
            description: "Determine total available bandwidth from ISP/backhaul. Plan for 80% peak utilization."
          },
          {
            number: 2,
            title: "Define Policy Tiers",
            description: "Create bandwidth tiers: Basic (10Mbps), Standard (25Mbps), Premium (50Mbps), VIP (100Mbps)."
          },
          {
            number: 3,
            title: "Configure Traffic Shaping",
            description: "Set up token bucket or hierarchical fair queuing (HFQ) for traffic prioritization."
          },
          {
            number: 4,
            title: "Set Priority Classes",
            description: "Define traffic classes: Real-time (VoIP), Interactive (web), Bulk (downloads), Background (updates)."
          },
          {
            number: 5,
            title: "Monitor and Adjust",
            description: "Use analytics to monitor utilization patterns. Adjust policies based on usage data."
          }
        ]
      },
      {
        type: "tips",
        title: "Optimization Tips",
        items: [
          "Reserve 20% bandwidth headroom for burst traffic",
          "Implement time-based policies for off-peak improvements",
          "Use application-aware QoS for video conferencing priority",
          "Monitor per-user consumption to identify bandwidth hogs",
          "Consider implementing fair queuing during peak hours"
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
        text: "Standard process for onboarding new customers from contract signing to production deployment. Follow this checklist for consistent customer experiences."
      },
      {
        type: "steps",
        title: "Onboarding Checklist",
        steps: [
          {
            number: 1,
            title: "Contract & Documentation",
            description: "Verify signed contract, SLA terms, billing setup, and technical requirements document."
          },
          {
            number: 2,
            title: "Kickoff Meeting",
            description: "Schedule kickoff with customer stakeholders. Review timeline, responsibilities, and success criteria."
          },
          {
            number: 3,
            title: "Technical Discovery",
            description: "Document network topology, existing infrastructure, integration requirements, and security policies."
          },
          {
            number: 4,
            title: "Environment Setup",
            description: "Provision customer instance, configure domain, set up admin accounts, and create initial policies."
          },
          {
            number: 5,
            title: "Integration & Testing",
            description: "Integrate with customer systems (PMS, AD, SSO). Conduct UAT with customer team."
          },
          {
            number: 6,
            title: "Training Delivery",
            description: "Conduct admin training sessions. Provide documentation and quick reference guides."
          },
          {
            number: 7,
            title: "Go-Live Support",
            description: "Provide dedicated support during go-live week. Monitor for issues, quick resolution."
          },
          {
            number: 8,
            title: "Handoff to BAU",
            description: "Transfer to regular support queue. Schedule 30-day check-in call."
          }
        ]
      },
      {
        type: "tips",
        title: "Success Factors",
        items: [
          "Set clear expectations on timeline from day one",
          "Assign dedicated deployment engineer for duration",
          "Document all customer-specific requirements",
          "Over-communicate during critical milestones",
          "Prepare rollback plan before go-live"
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
        text: "Diagnose and resolve authentication failures reported by customers. Follow this systematic approach to identify and fix issues quickly."
      },
      {
        type: "section",
        title: "Common Authentication Errors",
        items: [
          {
            name: "ERR_AUTH_TIMEOUT",
            solution: "Check RADIUS server connectivity. Verify firewall rules. Test with radtest. Check server logs for errors."
          },
          {
            name: "ERR_USER_NOT_FOUND",
            solution: "Verify username spelling. Check user exists in portal. Verify user is not deleted/archived."
          },
          {
            name: "ERR_INVALID_PASSWORD",
            solution: "Reset user password. Check for copy-paste issues (trailing spaces). Verify password hash algorithm."
          },
          {
            name: "ERR_ACCOUNT_DISABLED",
            solution: "Check user status in portal. Verify check-in/check-out dates. Check for auto-suspension triggers."
          },
          {
            name: "ERR_LICENSE_EXCEEDED",
            solution: "Check license utilization. Free up licenses by blocking inactive users. Upgrade license capacity."
          },
          {
            name: "ERR_DEVICE_LIMIT",
            solution: "User has reached device limit. Help user remove old devices or increase limit in policy."
          },
          {
            name: "ERR_MAC_NOT_REGISTERED",
            solution: "Device MAC not in system. Help user register device or enable auto-registration."
          }
        ]
      },
      {
        type: "steps",
        title: "Diagnostic Steps",
        steps: [
          {
            number: 1,
            title: "Gather Information",
            description: "Get username, MAC address, error message, time of failure, and affected site from customer."
          },
          {
            number: 2,
            title: "Check User Status",
            description: "Verify user exists, is Active, within check-in dates, and has available license."
          },
          {
            number: 3,
            title: "Verify Device Registration",
            description: "Check if device MAC is registered and under user's device limit."
          },
          {
            number: 4,
            title: "Check RADIUS Logs",
            description: "Review RADIUS server logs for reject reason. Look for attribute issues or backend errors."
          },
          {
            number: 5,
            title: "Test Authentication",
            description: "Use radtest to simulate auth from backend. Isolates client vs server issues."
          },
          {
            number: 6,
            title: "Check Site Health",
            description: "Verify site is online, RADIUS connectivity is healthy, and no ongoing outages."
          }
        ]
      },
      {
        type: "tips",
        title: "Quick Fixes",
        items: [
          "Password reset resolves 40% of auth issues",
          "Check time sync - RADIUS auth can fail if clocks are off",
          "Verify shared secret hasn't been changed recently",
          "Look for network issues between NAS and RADIUS",
          "Check for duplicate MAC registrations across users"
        ]
      }
    ]
  },

  "connectivity-issues": {
    title: "Network Connectivity Issues",
    category: "Troubleshooting",
    content: [
      {
        type: "intro",
        text: "Troubleshoot network connectivity problems including slow speeds, intermittent connections, and complete outages at customer sites."
      },
      {
        type: "section",
        title: "Issue Categories",
        items: [
          {
            name: "Complete Outage",
            description: "No users can connect. Check: ISP status, core router, RADIUS server, and site controller health."
          },
          {
            name: "Partial Outage",
            description: "Some users/areas affected. Check: AP status, switch port, VLAN config, and DHCP pool exhaustion."
          },
          {
            name: "Slow Speeds",
            description: "Users connected but slow. Check: bandwidth utilization, QoS settings, interference, and backhaul capacity."
          },
          {
            name: "Intermittent Drops",
            description: "Random disconnections. Check: signal strength, interference, roaming config, and session timeouts."
          }
        ]
      },
      {
        type: "steps",
        title: "Troubleshooting Workflow",
        steps: [
          {
            number: 1,
            title: "Identify Scope",
            description: "Determine if issue affects all users, specific areas, or specific user groups."
          },
          {
            number: 2,
            title: "Check Site Dashboard",
            description: "Review site health indicators, active alerts, and recent changes in internal portal."
          },
          {
            number: 3,
            title: "Verify Infrastructure",
            description: "Check AP status, switch uplinks, router connectivity, and ISP status."
          },
          {
            number: 4,
            title: "Review Logs",
            description: "Check system logs for errors, RADIUS logs for auth issues, and AP logs for client events."
          },
          {
            number: 5,
            title: "Test End-to-End",
            description: "Perform connectivity test from affected area: associate, authenticate, get IP, access internet."
          },
          {
            number: 6,
            title: "Isolate Layer",
            description: "Determine if issue is Layer 1 (physical), Layer 2 (switch/VLAN), Layer 3 (routing/DHCP), or Layer 7 (auth)."
          }
        ]
      },
      {
        type: "tips",
        title: "Diagnostic Tools",
        items: [
          "Use ping/traceroute to test path connectivity",
          "Check AP association logs for client behavior",
          "Monitor bandwidth utilization graphs",
          "Use spectrum analyzer for interference detection",
          "Review DHCP lease logs for IP exhaustion"
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
        text: "When to escalate issues and how to properly document and route them for efficient resolution."
      },
      {
        type: "section",
        title: "Escalation Levels",
        items: [
          {
            name: "Level 1 - Support Engineer",
            description: "First contact. Handle common issues, password resets, basic troubleshooting. SLA: 15 min response."
          },
          {
            name: "Level 2 - Deployment Engineer",
            description: "Complex technical issues, configuration changes, integration problems. SLA: 30 min response."
          },
          {
            name: "Level 3 - Platform Team",
            description: "System-wide issues, infrastructure problems, code fixes required. SLA: 1 hour response."
          },
          {
            name: "Level 4 - Management",
            description: "Critical outages affecting multiple customers, SLA breaches, executive escalations. SLA: immediate."
          }
        ]
      },
      {
        type: "steps",
        title: "Escalation Process",
        steps: [
          {
            number: 1,
            title: "Document Issue",
            description: "Create detailed ticket with: customer, site, issue description, impact, troubleshooting done."
          },
          {
            number: 2,
            title: "Assess Severity",
            description: "P1: Complete outage. P2: Major degradation. P3: Partial impact. P4: Minor/cosmetic."
          },
          {
            number: 3,
            title: "Notify Customer",
            description: "Inform customer of escalation, expected response time, and provide ticket reference."
          },
          {
            number: 4,
            title: "Escalate to Right Level",
            description: "Route to appropriate team based on issue type and severity. Include all diagnostic data."
          },
          {
            number: 5,
            title: "Track Progress",
            description: "Monitor escalated ticket. Provide updates to customer at least hourly for P1/P2."
          },
          {
            number: 6,
            title: "Close Loop",
            description: "Once resolved, confirm with customer, document resolution, update knowledge base if needed."
          }
        ]
      },
      {
        type: "tips",
        title: "Escalation Guidelines",
        items: [
          "Always exhaust L1 troubleshooting before escalating",
          "Include complete diagnostic information in escalation",
          "Set accurate severity - don't over or under escalate",
          "Keep customer informed of progress",
          "Document lessons learned for future reference"
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
        text: "Manage customer license allocations, handle license upgrades, and monitor utilization across all sites."
      },
      {
        type: "section",
        title: "License Operations",
        items: [
          {
            name: "View License Usage",
            description: "Dashboard > Customer view shows license utilization per customer. Drill down for site-level details."
          },
          {
            name: "Increase Capacity",
            description: "Configuration > Domains > Select customer > Edit License Capacity. Requires approval for >20% increase."
          },
          {
            name: "Transfer Licenses",
            description: "Move licenses between sites for same customer. Useful for seasonal capacity shifts."
          },
          {
            name: "License Alerts",
            description: "System alerts at 80%, 90%, 95% utilization. Critical alert at 100%."
          }
        ]
      },
      {
        type: "steps",
        title: "Processing License Requests",
        steps: [
          {
            number: 1,
            title: "Verify Request",
            description: "Confirm license increase request from authorized customer contact. Check contract terms."
          },
          {
            number: 2,
            title: "Check Current Usage",
            description: "Review current utilization pattern. Determine if temporary spike or sustained growth."
          },
          {
            number: 3,
            title: "Calculate Billing Impact",
            description: "Compute additional charges based on contract rate. Get finance approval if needed."
          },
          {
            number: 4,
            title: "Apply Change",
            description: "Update license capacity in system. Change takes effect immediately."
          },
          {
            number: 5,
            title: "Notify Customer",
            description: "Confirm change to customer with new capacity and any billing implications."
          }
        ]
      },
      {
        type: "tips",
        title: "Best Practices",
        items: [
          "Monitor utilization trends to proactively reach out before limits",
          "Review license usage monthly for all customers",
          "Document all license changes in customer notes",
          "Verify contract allows requested increase before processing",
          "Consider seasonal patterns when planning capacity"
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
        text: "Guide for integrating customer systems with our platform using REST APIs. Covers authentication, common endpoints, and best practices."
      },
      {
        type: "section",
        title: "API Fundamentals",
        items: [
          {
            name: "Authentication",
            description: "APIs use OAuth 2.0 with client credentials grant. Tokens expire in 1 hour. Refresh tokens valid for 7 days."
          },
          {
            name: "Base URL",
            description: "Production: api.spectraone.com/v1. Staging: staging-api.spectraone.com/v1"
          },
          {
            name: "Rate Limits",
            description: "100 requests/minute per API key. Batch operations count as single request. 429 response on limit."
          },
          {
            name: "Response Format",
            description: "JSON format. Standard envelope: { success: boolean, data: {}, error: {} }"
          }
        ]
      },
      {
        type: "section",
        title: "Common Endpoints",
        items: [
          {
            name: "User Management",
            description: "POST /users (create), GET /users/{id} (read), PUT /users/{id} (update), DELETE /users/{id} (delete)"
          },
          {
            name: "Device Management",
            description: "POST /devices (register), GET /devices/mac/{mac} (lookup), DELETE /devices/{id} (remove)"
          },
          {
            name: "Session Management",
            description: "GET /sessions/active (list), POST /sessions/{id}/disconnect (terminate)"
          },
          {
            name: "Reports",
            description: "GET /reports/usage (usage data), GET /reports/billing (billing data)"
          }
        ]
      },
      {
        type: "tips",
        title: "Integration Best Practices",
        items: [
          "Implement exponential backoff for rate limit handling",
          "Cache tokens and refresh before expiry",
          "Use webhooks for real-time events instead of polling",
          "Log all API calls for troubleshooting",
          "Test integrations in staging before production"
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
        text: "Configure Property Management System integration for hotels to enable automatic guest WiFi provisioning based on check-in/check-out."
      },
      {
        type: "section",
        title: "Supported PMS Systems",
        items: [
          {
            name: "Opera PMS",
            description: "Oracle's property management. Supports HTNG interface. Real-time check-in/out events."
          },
          {
            name: "Protel",
            description: "German hotel management. REST API integration. Batch sync every 5 minutes."
          },
          {
            name: "Clock PMS",
            description: "Cloud-based PMS. Webhook-based integration. Real-time events supported."
          },
          {
            name: "Custom Integration",
            description: "Generic REST/SOAP interface for other PMS systems. Requires development work."
          }
        ]
      },
      {
        type: "steps",
        title: "Integration Setup",
        steps: [
          {
            number: 1,
            title: "Obtain PMS Credentials",
            description: "Get API credentials from hotel's PMS admin. Document endpoint URLs, authentication method."
          },
          {
            number: 2,
            title: "Configure Integration",
            description: "Go to Site Configuration > Integrations > PMS. Select PMS type, enter credentials."
          },
          {
            number: 3,
            title: "Map Fields",
            description: "Map PMS fields to WiFi portal: guest name, room number, check-in date, check-out date."
          },
          {
            number: 4,
            title: "Set Up Events",
            description: "Configure event handlers: check-in (create user), check-out (expire user), room change (update)."
          },
          {
            number: 5,
            title: "Test Integration",
            description: "Create test reservation in PMS, verify user created in WiFi portal with correct details."
          },
          {
            number: 6,
            title: "Monitor Sync",
            description: "Check integration logs for sync errors. Set up alerts for failed syncs."
          }
        ]
      },
      {
        type: "troubleshooting",
        title: "Common Issues",
        items: [
          {
            issue: "Users not created on check-in",
            solution: "Verify PMS event is firing. Check API credentials. Review sync logs for errors."
          },
          {
            issue: "Duplicate users created",
            solution: "Check mapping for unique identifier. Ensure reservation ID is included in sync."
          },
          {
            issue: "Users not expired on check-out",
            solution: "Verify check-out event handler. Check for timezone mismatches. Review user lifecycle settings."
          }
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
        text: "Monitor service level agreements, track compliance metrics, and generate SLA reports for customers."
      },
      {
        type: "section",
        title: "SLA Metrics",
        items: [
          {
            name: "Availability",
            description: "Target: 99.9%. Calculated as: (Total time - Downtime) / Total time. Excludes planned maintenance."
          },
          {
            name: "Authentication Response",
            description: "Target: <500ms for 95% of requests. Measured from auth request to accept/reject response."
          },
          {
            name: "Support Response",
            description: "P1: 15 min. P2: 30 min. P3: 4 hours. P4: 24 hours. Measured from ticket creation."
          },
          {
            name: "Resolution Time",
            description: "P1: 2 hours. P2: 4 hours. P3: 24 hours. P4: 72 hours. Clock starts at ticket creation."
          }
        ]
      },
      {
        type: "steps",
        title: "Generating SLA Reports",
        steps: [
          {
            number: 1,
            title: "Access Reports",
            description: "Navigate to Internal Portal > Reports > SLA Reports."
          },
          {
            number: 2,
            title: "Select Customer/Site",
            description: "Choose customer and optionally specific site for report scope."
          },
          {
            number: 3,
            title: "Set Date Range",
            description: "Typically monthly. Select reporting period."
          },
          {
            number: 4,
            title: "Generate Report",
            description: "Click generate. Report shows: availability %, auth response times, support metrics."
          },
          {
            number: 5,
            title: "Review & Export",
            description: "Review metrics. Export PDF for customer sharing. Archive for records."
          }
        ]
      },
      {
        type: "tips",
        title: "SLA Management Tips",
        items: [
          "Proactively share SLA reports with customers monthly",
          "Investigate any metric below target before customer asks",
          "Document all incidents that impact SLA",
          "Scheduled maintenance should be coordinated with customer",
          "Keep detailed incident logs for SLA dispute resolution"
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
        text: "Procedures for identifying, responding to, and resolving security incidents at customer sites."
      },
      {
        type: "section",
        title: "Incident Types",
        items: [
          {
            name: "Unauthorized Access",
            description: "Unknown users/devices on network. Check for rogue APs, unauthorized credentials, MAC spoofing."
          },
          {
            name: "Credential Compromise",
            description: "Suspected stolen credentials. Immediate password reset, session termination, access log review."
          },
          {
            name: "Network Abuse",
            description: "Excessive bandwidth, illegal content, malware activity. Identify user, block access, investigate."
          },
          {
            name: "Data Breach",
            description: "Unauthorized data access/exfiltration. Engage security team immediately, preserve logs, notify management."
          }
        ]
      },
      {
        type: "steps",
        title: "Incident Response Steps",
        steps: [
          {
            number: 1,
            title: "Identify & Contain",
            description: "Verify incident is real. Isolate affected systems/users. Prevent further damage."
          },
          {
            number: 2,
            title: "Escalate Appropriately",
            description: "Notify security team and management for P1/P2 security incidents. Engage legal if needed."
          },
          {
            number: 3,
            title: "Investigate",
            description: "Review logs, identify attack vector, determine scope of impact, identify affected users."
          },
          {
            number: 4,
            title: "Remediate",
            description: "Fix vulnerability, reset credentials, restore from backup if needed, patch systems."
          },
          {
            number: 5,
            title: "Document",
            description: "Create detailed incident report. Include timeline, impact, actions taken, lessons learned."
          },
          {
            number: 6,
            title: "Post-Incident Review",
            description: "Conduct review meeting. Identify improvements. Update procedures if needed."
          }
        ]
      },
      {
        type: "tips",
        title: "Security Best Practices",
        items: [
          "Preserve all logs during incidents - don't clear them",
          "Don't discuss incidents on unsecure channels",
          "Document everything with timestamps",
          "Coordinate with customer's security team when applicable",
          "Regular security audits prevent many incidents"
        ]
      }
    ]
  }
};

// Video tutorials for internal staff
export const internalVideoTutorials = [
  {
    id: "vid-1",
    title: "Site Provisioning Walkthrough",
    description: "Complete video guide to provisioning a new customer site from start to finish.",
    duration: "15:30",
    category: "Site Configuration",
    videoFile: "internal/site-provisioning.mp4"
  },
  {
    id: "vid-2",
    title: "RADIUS Configuration Deep Dive",
    description: "Advanced RADIUS server configuration including failover, attributes, and troubleshooting.",
    duration: "22:45",
    category: "Site Configuration",
    videoFile: "internal/radius-config.mp4"
  },
  {
    id: "vid-3",
    title: "Authentication Troubleshooting",
    description: "Step-by-step guide to diagnosing and resolving user authentication failures.",
    duration: "18:20",
    category: "Troubleshooting",
    videoFile: "internal/auth-troubleshooting.mp4"
  },
  {
    id: "vid-4",
    title: "Network Diagnostics Tools",
    description: "Using diagnostic tools for network connectivity issues: ping, traceroute, packet capture.",
    duration: "14:15",
    category: "Troubleshooting",
    videoFile: "internal/network-diagnostics.mp4"
  },
  {
    id: "vid-5",
    title: "PMS Integration Setup",
    description: "Configuring Property Management System integration for hotel customers.",
    duration: "20:00",
    category: "Site Configuration",
    videoFile: "internal/pms-integration.mp4"
  },
  {
    id: "vid-6",
    title: "Customer Onboarding Process",
    description: "End-to-end customer onboarding from contract to go-live.",
    duration: "25:10",
    category: "Operations",
    videoFile: "internal/customer-onboarding.mp4"
  },
  {
    id: "vid-7",
    title: "Bandwidth Management & QoS",
    description: "Configuring bandwidth policies and Quality of Service settings.",
    duration: "16:45",
    category: "Site Configuration",
    videoFile: "internal/bandwidth-qos.mp4"
  },
  {
    id: "vid-8",
    title: "License Management",
    description: "Managing customer license allocations and handling upgrade requests.",
    duration: "12:30",
    category: "Operations",
    videoFile: "internal/license-management.mp4"
  },
  {
    id: "vid-9",
    title: "Escalation Procedures",
    description: "When and how to escalate issues for efficient resolution.",
    duration: "10:20",
    category: "Operations",
    videoFile: "internal/escalation.mp4"
  },
  {
    id: "vid-10",
    title: "Security Incident Response",
    description: "Handling security incidents: detection, containment, and remediation.",
    duration: "19:50",
    category: "Troubleshooting",
    videoFile: "internal/security-response.mp4"
  },
  {
    id: "vid-11",
    title: "API Integration Basics",
    description: "REST API overview for customer system integrations.",
    duration: "17:00",
    category: "Site Configuration",
    videoFile: "internal/api-basics.mp4"
  },
  {
    id: "vid-12",
    title: "Internal Portal Navigation",
    description: "Tour of the internal portal features and common workflows.",
    duration: "11:40",
    category: "Getting Started",
    videoFile: "internal/portal-tour.mp4"
  }
];

// FAQ data for internal staff
export const internalFAQs = [
  // Site Configuration
  {
    id: "faq-1",
    category: "Site Configuration",
    question: "How do I provision a new site for an existing customer?",
    answer: "Go to Site Management > Add Site. Select the customer from the dropdown, enter site details (address, timezone, capacity), configure network parameters, and save. Then set up RADIUS, create policies, and run connectivity tests before handoff."
  },
  {
    id: "faq-2",
    category: "Site Configuration",
    question: "What's the standard RADIUS timeout configuration?",
    answer: "Standard config: Response timeout 5 seconds, retry count 3, failover threshold 5 consecutive failures. For high-latency sites (international), increase timeout to 10 seconds."
  },
  {
    id: "faq-3",
    category: "Site Configuration",
    question: "How do I set up a custom domain for a customer?",
    answer: "Go to Configuration > Domains > Add Domain. Enter the domain (e.g., wifi.customer.com), configure DNS CNAME to point to our servers, provision SSL certificate via Let's Encrypt, and test HTTPS access."
  },
  {
    id: "faq-4",
    category: "Site Configuration",
    question: "What bandwidth tiers should I create for a typical hotel?",
    answer: "Standard hotel tiers: Free/Basic (5-10 Mbps, limited data), Standard (25 Mbps, high data), Premium (50 Mbps, unlimited). Create separate staff tier with higher speeds and no captive portal."
  },

  // Troubleshooting
  {
    id: "faq-5",
    category: "Troubleshooting",
    question: "User gets 'Access Denied' but account looks fine. What to check?",
    answer: "Check: 1) User status is Active, 2) Check-in date has passed and check-out not reached, 3) Device is registered and within limit, 4) License is available, 5) No IP/MAC conflicts, 6) RADIUS logs for specific error code."
  },
  {
    id: "faq-6",
    category: "Troubleshooting",
    question: "How do I diagnose slow WiFi speeds?",
    answer: "Check: 1) User's policy speed limit, 2) Bandwidth utilization at site, 3) Number of devices sharing bandwidth, 4) AP association (check signal strength, channel utilization), 5) Backhaul capacity, 6) QoS configuration."
  },
  {
    id: "faq-7",
    category: "Troubleshooting",
    question: "Customer reports intermittent disconnections. Where to start?",
    answer: "Check: 1) Session timeout settings, 2) Roaming configuration between APs, 3) DHCP lease times, 4) RADIUS keepalive settings, 5) AP logs for client disassociations, 6) Interference from neighboring networks."
  },
  {
    id: "faq-8",
    category: "Troubleshooting",
    question: "RADIUS authentication suddenly failing for all users at a site?",
    answer: "Check: 1) Site controller connectivity, 2) RADIUS server health, 3) Shared secret hasn't changed, 4) Firewall rules (UDP 1812/1813), 5) SSL certificate validity, 6) Time sync between servers."
  },

  // Operations
  {
    id: "faq-9",
    category: "Operations",
    question: "Customer wants to increase license capacity. What's the process?",
    answer: "1) Verify request from authorized contact, 2) Check contract terms, 3) Calculate billing impact, 4) Get approval if >20% increase, 5) Update in Configuration > Domains, 6) Confirm with customer and document."
  },
  {
    id: "faq-10",
    category: "Operations",
    question: "When should I escalate an issue to L2/L3?",
    answer: "Escalate when: 1) Standard troubleshooting doesn't resolve, 2) Configuration changes needed, 3) Infrastructure issues suspected, 4) Customer explicitly requests, 5) SLA breach risk. Always document troubleshooting done before escalating."
  },
  {
    id: "faq-11",
    category: "Operations",
    question: "How do I schedule maintenance for a customer site?",
    answer: "1) Coordinate with customer at least 48 hours in advance, 2) Create maintenance window in system, 3) Send notification email to customer contacts, 4) Perform maintenance during low-usage period, 5) Verify functionality after, 6) Close maintenance window and notify customer."
  },
  {
    id: "faq-12",
    category: "Operations",
    question: "Customer disputing SLA compliance. How to handle?",
    answer: "1) Pull detailed SLA report for disputed period, 2) Review incident logs for any outages, 3) Verify calculations exclude planned maintenance, 4) Document any customer-caused issues, 5) Escalate to account manager if customer remains unsatisfied."
  },

  // Security
  {
    id: "faq-13",
    category: "Security",
    question: "Suspected unauthorized access at customer site. What to do?",
    answer: "1) Verify with customer, 2) Check for unknown devices/users, 3) Look for rogue APs, 4) Review auth logs for anomalies, 5) If confirmed, contain by blocking suspicious accounts/MACs, 6) Escalate to security team for investigation."
  },
  {
    id: "faq-14",
    category: "Security",
    question: "Customer reports potential credential compromise?",
    answer: "Immediate actions: 1) Reset affected user passwords, 2) Terminate active sessions, 3) Review access logs for unusual activity, 4) Check for unauthorized device registrations, 5) Enable additional auth requirements if available, 6) Document and report incident."
  },

  // Integration
  {
    id: "faq-15",
    category: "Integration",
    question: "PMS integration not syncing guest check-ins?",
    answer: "Check: 1) API credentials are valid, 2) Event handlers are configured correctly, 3) Field mappings match PMS format, 4) Network connectivity to PMS server, 5) Integration logs for specific errors, 6) Test with manual reservation in PMS."
  },
  {
    id: "faq-16",
    category: "Integration",
    question: "Customer needs API access for custom integration?",
    answer: "1) Verify use case and scope, 2) Create API credentials in Configuration > API Keys, 3) Set appropriate rate limits, 4) Provide API documentation, 5) Help with staging environment setup, 6) Monitor initial integration for issues."
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

export default {
  articles: internalKnowledgeArticles,
  videos: internalVideoTutorials,
  faqs: internalFAQs
};
