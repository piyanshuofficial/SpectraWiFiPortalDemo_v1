// src/context/AuthContext.js

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
   */
  const login = useCallback(
    (username, password, rememberMe = false) => {
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
