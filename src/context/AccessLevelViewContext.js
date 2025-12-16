// src/context/AccessLevelViewContext.js

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { AccessLevels, UserTypes } from "../utils/accessLevels";

const AccessLevelViewContext = createContext();

// Storage key for persisting view state
const VIEW_STATE_STORAGE_KEY = "spectra_view_state";

/**
 * Get initial view state from localStorage or defaults
 */
const getInitialViewState = () => {
  try {
    const stored = localStorage.getItem(VIEW_STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to parse stored view state:", e);
  }

  return {
    viewLevel: "company", // 'company' or 'site'
    selectedSiteId: null,
    selectedSiteName: null,
  };
};

/**
 * AccessLevelViewProvider
 * Manages the current view context for company-level users
 * Allows switching between aggregated company view and drilled-down site view
 */
export const AccessLevelViewProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [viewState, setViewState] = useState(getInitialViewState);

  /**
   * Persist view state to localStorage
   */
  const persistViewState = useCallback((newState) => {
    try {
      localStorage.setItem(VIEW_STATE_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Failed to persist view state:", e);
    }
  }, []);

  /**
   * Check if user is an internal Spectra staff member
   * Internal users should not be affected by company/site access level logic
   */
  const isInternalUser = useMemo(() => {
    return currentUser?.userType === UserTypes.INTERNAL;
  }, [currentUser]);

  /**
   * Check if user is at company access level
   * Only applicable for customer users, not internal users
   */
  const isCompanyUser = useMemo(() => {
    if (isInternalUser) return false;
    return currentUser?.accessLevel === AccessLevels.COMPANY;
  }, [currentUser, isInternalUser]);

  /**
   * Check if user is at site access level
   * Only applicable for customer users, not internal users
   */
  const isSiteUser = useMemo(() => {
    if (isInternalUser) return false;
    return currentUser?.accessLevel === AccessLevels.SITE;
  }, [currentUser, isInternalUser]);

  /**
   * Check if currently viewing company-level (aggregated) data
   * Internal users never see company view - they have their own internal dashboard
   */
  const isCompanyView = useMemo(() => {
    // Internal users don't have company/site view distinction
    if (isInternalUser) return false;
    // Site users always see site view
    if (isSiteUser) return false;
    // Company users can switch between company and site view
    return viewState.viewLevel === "company";
  }, [isInternalUser, isSiteUser, viewState.viewLevel]);

  /**
   * Check if currently viewing site-level data
   * Internal users never see site view - they have their own internal dashboard
   */
  const isSiteView = useMemo(() => {
    // Internal users don't have company/site view distinction
    if (isInternalUser) return false;
    // Site users always see site view
    if (isSiteUser) return true;
    // Company users can switch between company and site view
    return viewState.viewLevel === "site" && viewState.selectedSiteId !== null;
  }, [isInternalUser, isSiteUser, viewState.viewLevel, viewState.selectedSiteId]);

  /**
   * Get current site ID
   * For site users: their assigned site
   * For company users in site view: the selected site
   */
  const currentSiteId = useMemo(() => {
    if (isSiteUser) {
      return currentUser?.siteId || null;
    }
    return viewState.selectedSiteId;
  }, [isSiteUser, currentUser, viewState.selectedSiteId]);

  /**
   * Get current site name
   */
  const currentSiteName = useMemo(() => {
    if (isSiteUser) {
      return currentUser?.siteName || null;
    }
    return viewState.selectedSiteName;
  }, [isSiteUser, currentUser, viewState.selectedSiteName]);

  /**
   * Drill down to a specific site
   * Only available for company-level customer users (not internal users)
   */
  const drillDownToSite = useCallback(
    (siteId, siteName) => {
      if (isInternalUser) {
        console.warn("Drill down not available for internal users");
        return;
      }
      if (!isCompanyUser) {
        console.warn("Drill down only available for company-level users");
        return;
      }

      const newState = {
        viewLevel: "site",
        selectedSiteId: siteId,
        selectedSiteName: siteName,
      };
      setViewState(newState);
      persistViewState(newState);
    },
    [isInternalUser, isCompanyUser, persistViewState]
  );

  /**
   * Return to company view
   * Only available for company-level customer users who have drilled down
   */
  const returnToCompanyView = useCallback(() => {
    if (isInternalUser) {
      console.warn("Return to company view not available for internal users");
      return;
    }
    if (!isCompanyUser) {
      console.warn("Return to company view only available for company-level users");
      return;
    }

    const newState = {
      viewLevel: "company",
      selectedSiteId: null,
      selectedSiteName: null,
    };
    setViewState(newState);
    persistViewState(newState);
  }, [isInternalUser, isCompanyUser, persistViewState]);

  /**
   * Reset view state (used on logout or user change)
   */
  const resetViewState = useCallback(() => {
    const defaultState = {
      viewLevel: "company",
      selectedSiteId: null,
      selectedSiteName: null,
    };
    setViewState(defaultState);
    persistViewState(defaultState);
  }, [persistViewState]);

  /**
   * Check if editing is allowed in current view
   * Company view is read-only
   * Site view allows editing based on user role permissions
   */
  const canEditInCurrentView = useMemo(() => {
    // In company view, editing is disabled (read-only mode)
    if (isCompanyView) return false;
    // In site view, allow editing (actual permission check done elsewhere)
    return true;
  }, [isCompanyView]);

  const contextValue = useMemo(
    () => ({
      // View state
      viewState,
      isInternalUser,
      isCompanyUser,
      isSiteUser,
      isCompanyView,
      isSiteView,
      currentSiteId,
      currentSiteName,
      canEditInCurrentView,

      // Actions
      drillDownToSite,
      returnToCompanyView,
      resetViewState,
    }),
    [
      viewState,
      isInternalUser,
      isCompanyUser,
      isSiteUser,
      isCompanyView,
      isSiteView,
      currentSiteId,
      currentSiteName,
      canEditInCurrentView,
      drillDownToSite,
      returnToCompanyView,
      resetViewState,
    ]
  );

  return (
    <AccessLevelViewContext.Provider value={contextValue}>
      {children}
    </AccessLevelViewContext.Provider>
  );
};

export const useAccessLevelView = () => {
  const context = useContext(AccessLevelViewContext);
  if (!context) {
    throw new Error(
      "useAccessLevelView must be used within an AccessLevelViewProvider"
    );
  }
  return context;
};
