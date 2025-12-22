// src/pages/Auth/ForgotDetails.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import bannerImage from "@assets/images/banner-element.png";
import "./ForgotDetails.css";

/**
 * Forgot Details Page Component
 * Matches the SpectraOne portal design
 */
const ForgotDetails = () => {
  // Form state
  const [activeTab, setActiveTab] = useState("serviceId");
  const [serviceId, setServiceId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    /* ========================================================================
     * BACKEND INTEGRATION: Password/Account Recovery Request
     * ========================================================================
     * API Endpoint: POST /api/v1/auth/forgot-password
     *
     * Request Payload:
     * {
     *   "type": "serviceId" | "username",  // Recovery method chosen
     *   "value": "string"                   // Service ID or Username
     * }
     *
     * Expected Response (Success - 200):
     * {
     *   "success": true,
     *   "data": {
     *     "message": "Recovery instructions sent",
     *     "maskedEmail": "u***@example.com",    // Optional: show where email sent
     *     "maskedMobile": "91****5678"          // Optional: show where SMS sent
     *   }
     * }
     *
     * Expected Response (Error - 400/404):
     * {
     *   "success": false,
     *   "error": {
     *     "code": "INVALID_INPUT|USER_NOT_FOUND|RATE_LIMITED",
     *     "message": "Error message"
     *   }
     * }
     *
     * Security Notes:
     * - Always return success even if user not found (prevent enumeration)
     * - Rate limit requests per IP (e.g., 3 per hour)
     * - Log all recovery attempts for security audit
     *
     * Sample Integration Code:
     * ------------------------
     * try {
     *   const response = await fetch('/api/v1/auth/forgot-password', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *       type: activeTab,
     *       value: activeTab === 'serviceId' ? serviceId : username
     *     })
     *   });
     *   const data = await response.json();
     *
     *   if (data.success) {
     *     setSuccess(true);
     *     // Optionally show masked contact info where recovery sent
     *   } else {
     *     setError(data.error.message);
     *   }
     * } catch (error) {
     *   setError('Failed to process request. Please try again.');
     * }
     * ======================================================================== */

    // TODO: Remove mock and implement actual password recovery API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const value = activeTab === "serviceId" ? serviceId : username;

    if (value.trim().length < 3) {
      setError("Please enter a valid " + (activeTab === "serviceId" ? "Service ID" : "Username"));
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSuccess(false);
    setError("");
    setServiceId("");
    setUsername("");
  };

  return (
    <div className="forgot-page">
      {/* Yellow Header Bar */}
      <div className="forgot-header-bar" />

      {/* Banner Image - Right Side */}
      <div className="forgot-banner">
        <img src={bannerImage} alt="" />
      </div>

      {/* Main Content */}
      <div className="forgot-main">
        {/* Spectra Logo */}
        <div className="forgot-logo">
          <span className="spectra-text">SPECTRA</span>
        </div>

        {/* Centered Content */}
        <div className="forgot-center">
          {/* Heading */}
          <h1 className="forgot-heading">Forgot Your Details?</h1>
          <p className="forgot-subtitle">We will get back to your account</p>

          {/* Form Container */}
          <div className="forgot-form-container">
            {success ? (
              <div className="forgot-success">
                <div className="success-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#47a8c5" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                </div>
                <h3>Request Submitted</h3>
                <p>
                  We have received your request. If your{" "}
                  {activeTab === "serviceId" ? "Service ID" : "Username"} is valid,
                  you will receive recovery instructions via email/SMS.
                </p>
                <button type="button" className="forgot-btn" onClick={handleReset}>
                  Submit Another Request
                </button>
                <Link to="/login" className="back-link">
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="forgot-tabs">
                  <button
                    type="button"
                    className={`forgot-tab ${activeTab === "serviceId" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("serviceId");
                      setError("");
                    }}
                  >
                    Service ID
                  </button>
                  <button
                    type="button"
                    className={`forgot-tab ${activeTab === "username" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("username");
                      setError("");
                    }}
                  >
                    Username
                  </button>
                </div>

                {/* Form Content */}
                <div className="forgot-form-content">
                  <form onSubmit={handleSubmit}>
                    {activeTab === "serviceId" ? (
                      <div className="form-field">
                        <label htmlFor="service-id-input">Service ID</label>
                        <input
                          id="service-id-input"
                          type="text"
                          value={serviceId}
                          onChange={(e) => setServiceId(e.target.value)}
                          required
                          autoComplete="off"
                        />
                      </div>
                    ) : (
                      <div className="form-field">
                        <label htmlFor="username-input">Username</label>
                        <input
                          id="username-input"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          autoComplete="username"
                        />
                      </div>
                    )}

                    {error && <div className="forgot-error">{error}</div>}

                    <button type="submit" className="forgot-btn" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send"}
                    </button>
                  </form>

                  <Link to="/login" className="back-link">
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="forgot-footer">
        <p>Copyright © {new Date().getFullYear()}. All Rights Reserved</p>
        <p>spectra.co</p>
        <div className="social-links">
          <a href="https://www.facebook.com/OnSpectra" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/on.spectra/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/company/onspectra/mycompany/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://x.com/OnSpectra" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ForgotDetails;
