// src/context/UserContext.js

import React, { createContext, useContext, useState } from 'react';

export const Segments = {
  ENTERPRISE_OFFICES: "Enterprise Offices",
  CO_LIVING: "Co-Living",
  CO_WORKING: "Co-Working",
  HOTEL: "Hotel",
  PG: "PG",
  MISC: "Miscellaneous",
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userContext, setUserContext] = useState({
    userId: "USR1001",
    segment: Segments.ENTERPRISE_OFFICES,
    siteId: "SITE123",
  });

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);