/**
 * ============================================================================
 * Customer View Context (Impersonation)
 * ============================================================================
 *
 * @file src/context/CustomerViewContext.js
 * @description Manages the "View as Customer" feature for internal Spectra staff.
 *              Allows support and operations teams to see exactly what a customer
 *              sees in their portal for troubleshooting and support purposes.
 *
 * @feature Customer Impersonation
 * Internal staff can "impersonate" any customer to:
 * - See their dashboard and data as they would see it
 * - Troubleshoot issues reported by customers
 * - Verify permissions and access settings
 * - Train customers on portal usage
 *
 * @security
 * IMPORTANT: Impersonation mode is ALWAYS read-only!
 * - Internal users CANNOT make changes while impersonating
 * - All actions are logged for audit trail
 * - Impersonation session timing is tracked
 *
 * @impersonationLevels
 * ```
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    Impersonation Options                             │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  Customer Selection:                                                 │
 * │  ├── Select any customer from the system                            │
 * │  └── View their segment-specific features                           │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  Site Selection:                                                     │
 * │  ├── Company Level : See aggregated company view                    │
 * │  └── Specific Site : See data for one site only                     │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  Role Selection:                                                     │
 * │  ├── ADMIN   : Full admin view                                      │
 * │  ├── MANAGER : Manager view                                         │
 * │  ├── USER    : Standard user view                                   │
 * │  └── VIEWER  : Read-only viewer                                     │
 * └──────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @workflow
 * ```
 * Internal Staff on Internal Portal
 *              │
 *              ▼
 *   [View as Customer Button]
 *              │
 *              ▼
 *   ┌─────────────────────────┐
 *   │  Select Customer Modal  │
 *   │  ├── Customer           │
 *   │  ├── Site (optional)    │
 *   │  └── Role               │
 *   └─────────────────────────┘
 *              │
 *              ▼
 *   Customer Portal (Read-Only)
 *   Banner shows: "Viewing as [Customer] > [Site] (Role)"
 *              │
 *              ▼
 *   [Exit Button] → Returns to Internal Portal
 * ```
 *
 * @auditLogging
 * All impersonation events are logged:
 * - Entry: Customer ID, Site ID, Role, Timestamp
 * - Exit: Duration, Final timestamp
 * - Site switches within session
 *
 * @architecture
 * ```
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                   CustomerViewContext Provider                       │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  State:                                                              │
 * │  ├── isImpersonating        : Boolean - Active impersonation?       │
 * │  ├── impersonatedCustomer   : { id, name, segment }                 │
 * │  ├── impersonatedSite       : { id, name } or null                  │
 * │  ├── impersonatedRole       : ADMIN | MANAGER | USER | VIEWER       │
 * │  └── impersonationStartTime : ISO timestamp                         │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  Computed:                                                           │
 * │  ├── isReadOnlyMode         : Always true when impersonating        │
 * │  ├── impersonationDuration  : Minutes since start                   │
 * │  └── impersonationDisplayString : "Customer > Site (Role)"          │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │  Actions:                                                            │
 * │  ├── enterCustomerView()    : Start impersonation                   │
 * │  ├── exitCustomerView()     : End impersonation                     │
 * │  ├── switchSite()           : Change site during session            │
 * │  └── switchRole()           : Change role during session            │
 * └──────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @usage
 * ```jsx
 * import { useCustomerView } from '@context/CustomerViewContext';
 *
 * // In CustomerManagement to start impersonation
 * const { enterCustomerView } = useCustomerView();
 * enterCustomerView(customer, site, 'ADMIN');
 *
 * // In Sidebar to show impersonation banner
 * const { isImpersonating, impersonatedCustomer, exitCustomerView } = useCustomerView();
 * if (isImpersonating) {
 *   return <Banner>Viewing as {impersonatedCustomer.name}</Banner>;
 * }
 *
 * // In any edit form to disable changes
 * const { isReadOnlyMode } = useCustomerView();
 * <Button disabled={isReadOnlyMode}>Save</Button>
 * ```
 *
 * @relatedFiles
 * - CustomerManagement.js  : UI to select and enter customer view
 * - CustomerViewModal.js   : Modal for selecting impersonation options
 * - Sidebar.js             : Shows impersonation banner
 * - useReadOnlyMode.js     : Hook that checks impersonation status
 * - Header.js              : Exit impersonation button
 *
 * ============================================================================
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { segmentCompanies, segmentSites } from "../constants/segmentCompanyData";
import { SEGMENTS } from "./SegmentContext";

const CustomerViewContext = createContext();

// Storage key for persisting impersonation state (optional - may not want to persist)
const CUSTOMER_VIEW_STORAGE_KEY = "spectra_customer_view_state";

// Role options for impersonation
export const IMPERSONATION_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
  VIEWER: "VIEWER",
};

export const IMPERSONATION_ROLE_LABELS = {
  [IMPERSONATION_ROLES.ADMIN]: "Site Admin",
  [IMPERSONATION_ROLES.MANAGER]: "Site Manager",
  [IMPERSONATION_ROLES.USER]: "User",
  [IMPERSONATION_ROLES.VIEWER]: "Viewer",
};

// Access levels for impersonation
export const IMPERSONATION_ACCESS_LEVELS = {
  COMPANY: "COMPANY",
  SITE: "SITE",
};

/**
 * Build a flat list of all customers from segmentCompanyData
 */
export const getAllCustomers = () => {
  const customers = [];
  Object.entries(segmentCompanies).forEach(([segment, company]) => {
    customers.push({
      id: company.id,
      name: company.name,
      segment: segment,
      industry: company.industry,
      contactEmail: company.contactEmail,
    });
  });
  return customers;
};

/**
 * Get sites for a specific segment/customer
 */
export const getSitesForSegment = (segment) => {
  return segmentSites[segment] || [];
};

/**
 * Get initial view state (not persisted by default for security)
 */
const getInitialState = () => {
  return {
    isImpersonating: false,
    impersonatedCustomer: null,
    impersonatedSite: null,
    impersonatedRole: IMPERSONATION_ROLES.ADMIN,
    impersonatedAccessLevel: IMPERSONATION_ACCESS_LEVELS.COMPANY,
    impersonationStartTime: null,
  };
};

/**
 * CustomerViewProvider
 * Provides impersonation state and functions for internal staff
 */
export const CustomerViewProvider = ({ children }) => {
  const [state, setState] = useState(getInitialState);

  /**
   * Enter customer view mode
   * @param {Object} customer - Customer object { id, name, segment }
   * @param {Object|null} site - Site object or null for company-level view
   * @param {string} role - Role to impersonate (ADMIN, MANAGER, USER, VIEWER)
   */
  const enterCustomerView = useCallback((customer, site, role) => {
    if (!customer) {
      console.error("Customer is required to enter customer view");
      return;
    }

    const newState = {
      isImpersonating: true,
      impersonatedCustomer: {
        id: customer.id,
        name: customer.name,
        segment: customer.segment,
        industry: customer.industry,
      },
      impersonatedSite: site
        ? {
            id: site.siteId,
            name: site.siteName,
          }
        : null,
      impersonatedRole: role || IMPERSONATION_ROLES.ADMIN,
      impersonatedAccessLevel: site
        ? IMPERSONATION_ACCESS_LEVELS.SITE
        : IMPERSONATION_ACCESS_LEVELS.COMPANY,
      impersonationStartTime: new Date().toISOString(),
    };

    setState(newState);

    // Log impersonation for audit trail
    console.log("[AUDIT] Customer view entered:", {
      customerId: customer.id,
      customerName: customer.name,
      siteId: site?.siteId || "COMPANY_LEVEL",
      role: role,
      timestamp: newState.impersonationStartTime,
    });
  }, []);

  /**
   * Exit customer view mode and return to internal portal
   */
  const exitCustomerView = useCallback(() => {
    const currentState = state;

    // Log exit for audit trail
    if (currentState.isImpersonating) {
      console.log("[AUDIT] Customer view exited:", {
        customerId: currentState.impersonatedCustomer?.id,
        customerName: currentState.impersonatedCustomer?.name,
        duration:
          new Date() - new Date(currentState.impersonationStartTime) + "ms",
        timestamp: new Date().toISOString(),
      });
    }

    setState(getInitialState());
  }, [state]);

  /**
   * Switch to a different site while staying in impersonation mode
   */
  const switchSite = useCallback(
    (site) => {
      if (!state.isImpersonating) {
        console.warn("Cannot switch site when not impersonating");
        return;
      }

      setState((prev) => ({
        ...prev,
        impersonatedSite: site
          ? {
              id: site.siteId,
              name: site.siteName,
            }
          : null,
        impersonatedAccessLevel: site
          ? IMPERSONATION_ACCESS_LEVELS.SITE
          : IMPERSONATION_ACCESS_LEVELS.COMPANY,
      }));

      console.log("[AUDIT] Site switched during impersonation:", {
        customerId: state.impersonatedCustomer?.id,
        newSiteId: site?.siteId || "COMPANY_LEVEL",
        timestamp: new Date().toISOString(),
      });
    },
    [state.isImpersonating, state.impersonatedCustomer]
  );

  /**
   * Switch role while staying in impersonation mode
   */
  const switchRole = useCallback(
    (role) => {
      if (!state.isImpersonating) {
        console.warn("Cannot switch role when not impersonating");
        return;
      }

      setState((prev) => ({
        ...prev,
        impersonatedRole: role,
      }));
    },
    [state.isImpersonating]
  );

  /**
   * Check if an action should be blocked (read-only mode)
   */
  const isReadOnlyMode = useMemo(() => {
    return state.isImpersonating;
  }, [state.isImpersonating]);

  /**
   * Get impersonation duration in minutes
   */
  const impersonationDuration = useMemo(() => {
    if (!state.impersonationStartTime) return 0;
    const start = new Date(state.impersonationStartTime);
    const now = new Date();
    return Math.floor((now - start) / 60000);
  }, [state.impersonationStartTime]);

  /**
   * Get display string for current impersonation
   */
  const impersonationDisplayString = useMemo(() => {
    if (!state.isImpersonating) return "";

    const customerName = state.impersonatedCustomer?.name || "Unknown";
    const siteName = state.impersonatedSite?.name || "Company Level";
    const roleName = IMPERSONATION_ROLE_LABELS[state.impersonatedRole] || state.impersonatedRole;

    return `${customerName} > ${siteName} (${roleName})`;
  }, [state.isImpersonating, state.impersonatedCustomer, state.impersonatedSite, state.impersonatedRole]);

  const contextValue = useMemo(
    () => ({
      // State
      isImpersonating: state.isImpersonating,
      impersonatedCustomer: state.impersonatedCustomer,
      impersonatedSite: state.impersonatedSite,
      impersonatedRole: state.impersonatedRole,
      impersonatedAccessLevel: state.impersonatedAccessLevel,
      impersonationStartTime: state.impersonationStartTime,
      isReadOnlyMode,
      impersonationDuration,
      impersonationDisplayString,

      // Actions
      enterCustomerView,
      exitCustomerView,
      switchSite,
      switchRole,

      // Helpers
      getAllCustomers,
      getSitesForSegment,
    }),
    [
      state,
      isReadOnlyMode,
      impersonationDuration,
      impersonationDisplayString,
      enterCustomerView,
      exitCustomerView,
      switchSite,
      switchRole,
    ]
  );

  return (
    <CustomerViewContext.Provider value={contextValue}>
      {children}
    </CustomerViewContext.Provider>
  );
};

export const useCustomerView = () => {
  const context = useContext(CustomerViewContext);
  if (!context) {
    throw new Error(
      "useCustomerView must be used within a CustomerViewProvider"
    );
  }
  return context;
};
