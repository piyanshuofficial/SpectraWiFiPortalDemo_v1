// src/components/AppLayout.js

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import FooterBar from "./FooterBar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content" role="main">{children}</main>
        <FooterBar />
      </div>
    </>
  );
};

export default AppLayout;
