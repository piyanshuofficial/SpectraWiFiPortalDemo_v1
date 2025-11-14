// src/components/AppLayout.js

import React from "react";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import FooterBar from "@components/FooterBar";
import "@components/AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content" role="main" aria-label="Main content">
          {children}
        </main>
        <FooterBar />
      </div>
    </>
  );
};

export default AppLayout;