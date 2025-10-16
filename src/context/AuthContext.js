// src/context/AuthContext.js

import React, { createContext, useContext, useState } from "react";
import { AccessLevels, Roles } from "../utils/accessLevels";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to Site-level Admin user for demo
  const [currentUser, setCurrentUser] = useState({
    role: Roles.ADMIN,
    accessLevel: AccessLevels.SITE,
    username: "adminUser",
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
