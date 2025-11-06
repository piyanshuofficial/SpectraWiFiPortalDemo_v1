// src/components/Layout/FooterBar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FooterBar.css';

const FooterBar = () => {
  const navigate = useNavigate();

  const handleTermsClick = () => {
    navigate('/terms-conditions');
  };

  const handlePrivacyClick = () => {
    navigate('/privacy-policy');
  };

  return (
    <footer className="footer-bar">
      <div className="footer-copyright">
        Copyrights © 2025 Shyam Spectra Pvt. Ltd.
      </div>
      <div className="footer-links">
        <span className="footer-link" onClick={handleTermsClick}>
          Terms & Conditions
        </span>
        <span className="footer-link-divider"></span>
        <span className="footer-link" onClick={handlePrivacyClick}>
          Privacy Policy
        </span>
      </div>
    </footer>
  );
};

export default FooterBar;