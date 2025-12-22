/**
 * ============================================================================
 * Authentication Context
 * ============================================================================
 *
 * @file src/context/AuthContext.js
 * @description Central authentication state management for the entire portal.
 *              Handles login/logout, session persistence, and permission checking
 *              for both Customer Portal and Internal Portal users.
 *
 * @architecture
 * ```
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         AuthContext Provider                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │  State:                                                                 │
 * │  ├── isAuthenticated    : Boolean - Is user logged in?                 │
 * │  ├── currentUser        : Object - User profile with role/permissions  │
 * │  └── userPermissions    : Object - Computed permission flags           │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │  Actions:                                                               │
 * │  ├── login()            : Authenticate with username/password          │
 * │  ├── logout()           : End session, clear storage                   │
 * │  ├── updateRole()       : Change role (dev/testing)                    │
 * │  └── hasPermission()    : Check specific permission                    │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @userTypes
 * Two distinct user types with different permission systems:
 *
 * 1. CUSTOMER Users (Customer Portal):
 *    - Access Levels: COMPANY or SITE
 *    - Roles: ADMIN, MANAGER, NETWORK_ADMIN, USER, VIEWER
 *    - Can manage their own users, devices, and view reports
 *
 * 2. INTERNAL Users (Internal Portal):
 *    - Roles: SUPER_ADMIN, OPERATIONS, SUPPORT, SALES, VIEWER
 *    - Can manage sites, customers, provisioning queue
 *    - Can impersonate customers for support
 *
 * @sessionPersistence
 * - Uses localStorage with key "spectra_auth_state"
 * - Remember Me: Persists full session across browser restarts
 * - No Remember: Session cleared on browser close
 *
 * @permissionFlow
 * ```
 * User logs in → Role determined → Permissions computed from matrix
 *                                          ↓
 *                              userPermissions object created
 *                                          ↓
 *                              hasPermission('canEditUsers') → true/false
 * ```
 *
 * @usage
 * ```jsx
 * // In a component
 * import { useAuth } from '@context/AuthContext';
 *
 * const MyComponent = () => {
 *   const { currentUser, hasPermission, logout } = useAuth();
 *
 *   if (!hasPermission('canEditUsers')) {
 *     return <AccessDenied />;
 *   }
 *
 *   return <UserEditForm />;
 * };
 * ```
 *
 * @securityNotes
 * - Demo mode uses hardcoded credentials (DemoCredentials)
 * - Production: Replace with JWT/OAuth backend integration
 * - Tokens should be stored in httpOnly cookies, not localStorage
 * - See API_INTEGRATION_GUIDE.js for backend implementation details
 *
 * @dependencies
 * - accessLevels.js : Role/permission definitions and matrices
 * - localStorage    : Session persistence
 *
 * @relatedFiles
 * - Login.js             : Login form component
 * - usePermissions.js    : Hook wrapper for permission checks
 * - ProtectedRoute.js    : Route guard component
 * - accessLevels.js      : Permission matrices
 *
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  AccessLevels,
  Roles,
  UserTypes,
  InternalRoles,
  DemoCredentials,
  Permissions,
  InternalPermissions,
} from "../utils/accessLevels";

const AuthContext = createContext();

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = "spectra_auth_state";

/**
 * Get initial auth state from localStorage or defaults
 */
const getInitialAuthState = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored state has required fields
      if (parsed.isAuthenticated && parsed.currentUser) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse stored auth state:", e);
  }

  // Default: Not authenticated (will show login page)
  return {
    isAuthenticated: false,
    currentUser: null,
  };
};

export const AuthProvider = ({ children }) => {
  // Initialize state from storage or defaults
  const [authState, setAuthState] = useState(getInitialAuthState);

  // Extract values for easier access
  const { isAuthenticated, currentUser } = authState;

  /**
   * Persist auth state to localStorage
   */
  const persistAuthState = useCallback((newState) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Failed to persist auth state:", e);
    }
  }, []);

  /**
   * Login with credentials
   * In a real app, this would call an API
   *
   * ========================================================================
   * BACKEND INTEGRATION: Authentication Service
   * ========================================================================
   * This login function should be replaced with actual API calls.
   * See Login.js for detailed API documentation.
   *
   * Required Backend Endpoints:
   * ---------------------------
   * 1. POST /api/v1/auth/login
   *    - Validates credentials against user database
   *    - Returns JWT access token and refresh token
   *    - Includes user profile with permissions
   *
   * 2. POST /api/v1/auth/refresh
   *    - Exchanges refresh token for new access token
   *    - Called when access token expires
   *
   * 3. POST /api/v1/auth/logout
   *    - Invalidates refresh token
   *    - Clears server-side session (if applicable)
   *
   * 4. GET /api/v1/auth/me
   *    - Returns current user profile
   *    - Used to restore session on page refresh
   *
   * Token Storage Strategy:
   * -----------------------
   * - Access Token: Store in memory (state) or sessionStorage
   * - Refresh Token: Store in httpOnly cookie (preferred) or localStorage
   * - Never store tokens in plain localStorage for security
   *
   * Session Restoration:
   * --------------------
   * On app load, check for valid refresh token and call /auth/me
   * to restore user session without requiring re-login.
   *
   * Sample Implementation:
   * ----------------------
   * const login = async (username, password, rememberMe) => {
   *   try {
   *     const response = await fetch('/api/v1/auth/login', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ loginId: username, password, rememberMe })
   *     });
   *     const data = await response.json();
   *
   *     if (data.success) {
   *       // Store tokens
   *       setAccessToken(data.data.accessToken);
   *       if (rememberMe) {
   *         localStorage.setItem('refreshToken', data.data.refreshToken);
   *       }
   *
   *       // Set user state
   *       const newState = {
   *         isAuthenticated: true,
   *         currentUser: data.data.user
   *       };
   *       setAuthState(newState);
   *
   *       return { success: true, user: data.data.user };
   *     }
   *     return { success: false, error: data.error.message };
   *   } catch (error) {
   *     return { success: false, error: 'Network error' };
   *   }
   * };
   * ======================================================================== */
  const login = useCallback(
    (username, password, rememberMe = false) => {
      // TODO: Replace demo credentials with actual API call
      // Find matching demo credential
      const allCredentials = [
        ...DemoCredentials.internal.map((c) => ({
          ...c,
          userType: UserTypes.INTERNAL,
        })),
        ...DemoCredentials.customer.map((c) => ({
          ...c,
          userType: UserTypes.CUSTOMER,
        })),
      ];

      const matchedCredential = allCredentials.find(
        (cred) => cred.username === username && cred.password === password
      );

      if (matchedCredential) {
        const newUser = {
          id: matchedCredential.id,
          username: matchedCredential.username,
          displayName: matchedCredential.displayName,
          role: matchedCredential.role,
          userType: matchedCredential.userType,
          accessLevel: matchedCredential.accessLevel || null,
          // Company-level fields
          companyId: matchedCredential.companyId || null,
          companyName: matchedCredential.companyName || null,
          // Site-level fields
          siteId: matchedCredential.siteId || null,
          siteName: matchedCredential.siteName || null,
        };

        const newState = {
          isAuthenticated: true,
          currentUser: newUser,
        };

        setAuthState(newState);

        if (rememberMe) {
          persistAuthState(newState);
        } else {
          // Clear any stored state if not remembering
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }

        return { success: true, user: newUser };
      }

      return { success: false, error: "Invalid credentials" };
    },
    [persistAuthState]
  );

  /**
   * Quick login with a specific demo credential
   * For dev toolbar / testing purposes
   */
  const loginWithDemoCredential = useCallback(
    (credentialId) => {
      const allCredentials = [
        ...DemoCredentials.internal.map((c) => ({
          ...c,
          userType: UserTypes.INTERNAL,
        })),
        ...DemoCredentials.customer.map((c) => ({
          ...c,
          userType: UserTypes.CUSTOMER,
        })),
      ];

      const cred = allCredentials.find((c) => c.id === credentialId);

      if (cred) {
        const newUser = {
          id: cred.id,
          username: cred.username,
          displayName: cred.displayName,
          role: cred.role,
          userType: cred.userType,
          accessLevel: cred.accessLevel || null,
          // Company-level fields
          companyId: cred.companyId || null,
          companyName: cred.companyName || null,
          // Site-level fields
          siteId: cred.siteId || null,
          siteName: cred.siteName || null,
        };

        const newState = {
          isAuthenticated: true,
          currentUser: newUser,
        };

        setAuthState(newState);
        persistAuthState(newState);

        return { success: true, user: newUser };
      }

      return { success: false, error: "Credential not found" };
    },
    [persistAuthState]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    const newState = {
      isAuthenticated: false,
      currentUser: null,
    };
    setAuthState(newState);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  /**
   * Update user role (for testing purposes)
   */
  const updateRole = useCallback(
    (newRole) => {
      if (!currentUser) return;

      const validRoles =
        currentUser.userType === UserTypes.INTERNAL
          ? Object.values(InternalRoles)
          : Object.values(Roles);

      if (validRoles.includes(newRole)) {
        const newState = {
          ...authState,
          currentUser: {
            ...currentUser,
            role: newRole,
          },
        };
        setAuthState(newState);
        persistAuthState(newState);
      } else {
        console.error("Invalid role:", newRole);
      }
    },
    [authState, currentUser, persistAuthState]
  );

  /**
   * Update access level (for customer users only)
   */
  const updateAccessLevel = useCallback(
    (newAccessLevel) => {
      if (!currentUser || currentUser.userType !== UserTypes.CUSTOMER) return;

      if (Object.values(AccessLevels).includes(newAccessLevel)) {
        const newState = {
          ...authState,
          currentUser: {
            ...currentUser,
            accessLevel: newAccessLevel,
          },
        };
        setAuthState(newState);
        persistAuthState(newState);
      } else {
        console.error("Invalid access level:", newAccessLevel);
      }
    },
    [authState, currentUser, persistAuthState]
  );

  /**
   * Reset to maximum rights (for testing)
   */
  const resetToMaximumRights = useCallback(() => {
    const newState = {
      isAuthenticated: true,
      currentUser: {
        id: "test_max",
        username: "test@spectra.co",
        displayName: "Test Admin",
        role: Roles.ADMIN,
        userType: UserTypes.CUSTOMER,
        accessLevel: AccessLevels.COMPANY,
        companyId: "COMP_001",
        companyName: "Sample Technologies Pvt Ltd",
        siteId: null,
        siteName: null,
      },
    };
    setAuthState(newState);
    persistAuthState(newState);
  }, [persistAuthState]);

  /**
   * Get permissions for current user
   */
  const userPermissions = useMemo(() => {
    if (!currentUser) return {};

    if (currentUser.userType === UserTypes.INTERNAL) {
      return InternalPermissions[currentUser.role] || {};
    } else {
      return Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
    }
  }, [currentUser]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission) => {
      return userPermissions[permission] === true;
    },
    [userPermissions]
  );

  /**
   * Check if current user is internal staff
   */
  const isInternalUser = useMemo(() => {
    return currentUser?.userType === UserTypes.INTERNAL;
  }, [currentUser]);

  /**
   * Check if current user is a customer
   */
  const isCustomerUser = useMemo(() => {
    return currentUser?.userType === UserTypes.CUSTOMER;
  }, [currentUser]);

  const contextValue = useMemo(
    () => ({
      // Auth state
      isAuthenticated,
      currentUser,

      // Auth actions
      login,
      loginWithDemoCredential,
      logout,

      // Role/access management (for testing)
      updateRole,
      updateAccessLevel,
      resetToMaximumRights,
      setCurrentUser: (user) => {
        const newState = { ...authState, currentUser: user };
        setAuthState(newState);
        persistAuthState(newState);
      },

      // Permissions
      userPermissions,
      hasPermission,

      // User type helpers
      isInternalUser,
      isCustomerUser,

      // Demo credentials reference
      demoCredentials: DemoCredentials,
    }),
    [
      isAuthenticated,
      currentUser,
      login,
      loginWithDemoCredential,
      logout,
      updateRole,
      updateAccessLevel,
      resetToMaximumRights,
      userPermissions,
      hasPermission,
      isInternalUser,
      isCustomerUser,
      authState,
      persistAuthState,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
