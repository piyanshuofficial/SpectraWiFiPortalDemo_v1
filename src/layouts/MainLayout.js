// src/layouts/MainLayout.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Roles } from "../utils/accessLevels";

const MainLayout = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth();

  const onRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  return (
    <div className="main-layout-wrapper" role="main" aria-label="Application main layout">
      <Header />
      <Sidebar />
      <div className="main-content-wrapper">
        <div className="role-selector-bar">
          <label htmlFor="role-select" style={{ marginRight: 8 }}>
            Select Role:
          </label>
          <select
            id="role-select"
            aria-label="Select current user role"
            value={currentUser.role}
            onChange={onRoleChange}
          >
            {Object.values(Roles).map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
