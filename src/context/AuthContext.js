// src/context/AuthContext.js

import React, { createContext, useContext, useState, useCallback } from "react";
import { AccessLevels, Roles } from "../utils/accessLevels";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to SITE access level (easiest to test) + ADMIN role (highest)
  const [currentUser, setCurrentUser] = useState({
    role: Roles.ADMIN,
    accessLevel: AccessLevels.SITE,
    username: "adminUser",
  });

  // Method to update role (for testing purposes)
  const updateRole = useCallback((newRole) => {
    if (Object.values(Roles).includes(newRole)) {
      setCurrentUser(prev => ({
        ...prev,
        role: newRole,
      }));
    } else {
      console.error('Invalid role:', newRole);
    }
  }, []);

  // Method to update access level (for testing purposes)
  const updateAccessLevel = useCallback((newAccessLevel) => {
    if (Object.values(AccessLevels).includes(newAccessLevel)) {
      setCurrentUser(prev => ({
        ...prev,
        accessLevel: newAccessLevel,
      }));
    } else {
      console.error('Invalid access level:', newAccessLevel);
    }
  }, []);

  // Method to reset to maximum rights
  const resetToMaximumRights = useCallback(() => {
    setCurrentUser({
      role: Roles.ADMIN,
      accessLevel: AccessLevels.GROUP,
      username: "adminUser",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateRole,
        updateAccessLevel,
        resetToMaximumRights
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};