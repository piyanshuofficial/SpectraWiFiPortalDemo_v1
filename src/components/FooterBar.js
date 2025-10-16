//src/components/FooterBar.js


import React from "react";
import "./FooterBar.css";

const FooterBar = () => (
  <footer className="footer-bar" role="contentinfo">
    <div className="footer-left">
      Copyrights © 2025 Shyam Spectra Pvt. Ltd.
    </div>
    <div className="footer-right">
      <a href="/terms" className="footer-link">Terms &amp; Conditions</a>
      <span className="footer-divider">|</span>
      <a href="/privacy" className="footer-link">Privacy Policy</a>
    </div>
  </footer>
);

export default FooterBar;
