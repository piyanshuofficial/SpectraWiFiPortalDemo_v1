// src/pages/Auth/Login.js

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { FaEye, FaEyeSlash, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import RoleAccessSelector from "@components/RoleAccessSelector";
import bannerImage from "@assets/images/banner-element.png";
import "./Login.css";

/**
 * Get time-based greeting
 * Morning: 5 AM - 12 PM
 * Afternoon: 12 PM - 5 PM
 * Evening: 5 PM - 9 PM
 * Night: 9 PM - 5 AM
 */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning!";
  if (hour >= 12 && hour < 17) return "Good Afternoon!";
  if (hour >= 17 && hour < 21) return "Good Evening!";
  return "Good Night!";
};

/**
 * Login Page Component
 * Matches the SpectraOne portal design exactly
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [activeTab, setActiveTab] = useState("loginId");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const greeting = useMemo(() => getGreeting(), []);

  const handleLoginIdSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    /* ========================================================================
     * BACKEND INTEGRATION: User Authentication (Login ID + Password)
     * ========================================================================
     * API Endpoint: POST /api/v1/auth/login
     *
     * Request Payload:
     * {
     *   "loginId": "string",        // User's login ID or email
     *   "password": "string",       // User's password (should be sent over HTTPS)
     *   "rememberMe": boolean       // Extend session duration if true
     * }
     *
     * Expected Response (Success - 200):
     * {
     *   "success": true,
     *   "data": {
     *     "accessToken": "JWT_TOKEN",
     *     "refreshToken": "REFRESH_TOKEN",
     *     "expiresIn": 3600,        // Token expiry in seconds
     *     "user": {
     *       "id": "user_id",
     *       "name": "User Full Name",
     *       "email": "user@example.com",
     *       "role": "admin|manager|user",
     *       "userType": "CUSTOMER|INTERNAL",
     *       "segment": "Enterprise|Hotel|CoLiving|CoWorking|PG|Misc",
     *       "companyId": "company_id",
     *       "companyName": "Company Name",
     *       "siteId": "site_id",      // null for company-level users
     *       "siteName": "Site Name",
     *       "permissions": ["canEditUsers", "canManageDevices", ...]
     *     }
     *   }
     * }
     *
     * Expected Response (Error - 401):
     * {
     *   "success": false,
     *   "error": {
     *     "code": "INVALID_CREDENTIALS|ACCOUNT_LOCKED|ACCOUNT_SUSPENDED",
     *     "message": "Invalid login credentials"
     *   }
     * }
     *
     * Sample Integration Code:
     * ------------------------
     * try {
     *   const response = await fetch('/api/v1/auth/login', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({ loginId, password, rememberMe })
     *   });
     *   const data = await response.json();
     *
     *   if (data.success) {
     *     // Store tokens securely
     *     localStorage.setItem('accessToken', data.data.accessToken);
     *     if (rememberMe) {
     *       localStorage.setItem('refreshToken', data.data.refreshToken);
     *     } else {
     *       sessionStorage.setItem('refreshToken', data.data.refreshToken);
     *     }
     *
     *     // Update auth context with user data
     *     login(data.data.user, data.data.accessToken);
     *
     *     // Redirect based on user type
     *     if (data.data.user.userType === 'INTERNAL') {
     *       navigate('/internal/dashboard');
     *     } else {
     *       navigate('/dashboard');
     *     }
     *   } else {
     *     setError(data.error.message);
     *   }
     * } catch (error) {
     *   setError('Network error. Please try again.');
     *   console.error('Login error:', error);
     * }
     * ======================================================================== */

    // TODO: Remove mock login and implement actual API call above
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(loginId, password, rememberMe);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError("Invalid login credentials. Please try again.");
    }

    setIsLoading(false);
  };

  const handleMobileOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpSent) {
      /* ======================================================================
       * BACKEND INTEGRATION: Send OTP to Mobile Number
       * ======================================================================
       * API Endpoint: POST /api/v1/auth/send-otp
       *
       * Request Payload:
       * {
       *   "mobileNumber": "string",   // 10-digit mobile number
       *   "countryCode": "+91"        // Country code (default: India)
       * }
       *
       * Expected Response (Success - 200):
       * {
       *   "success": true,
       *   "data": {
       *     "otpId": "unique_otp_session_id",  // Use this to verify OTP
       *     "expiresIn": 300,                  // OTP validity in seconds (5 mins)
       *     "maskedMobile": "91****5678"       // For display purposes
       *   }
       * }
       *
       * Expected Response (Error - 400/429):
       * {
       *   "success": false,
       *   "error": {
       *     "code": "INVALID_MOBILE|RATE_LIMITED|USER_NOT_FOUND",
       *     "message": "Error message"
       *   }
       * }
       *
       * Sample Integration Code:
       * ------------------------
       * try {
       *   const response = await fetch('/api/v1/auth/send-otp', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ mobileNumber, countryCode: '+91' })
       *   });
       *   const data = await response.json();
       *
       *   if (data.success) {
       *     setOtpSessionId(data.data.otpId);  // Store for verification
       *     setOtpSent(true);
       *   } else {
       *     setError(data.error.message);
       *   }
       * } catch (error) {
       *   setError('Failed to send OTP. Please try again.');
       * }
       * ==================================================================== */

      // TODO: Remove mock and implement actual OTP send API call
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOtpSent(true);
      setIsLoading(false);
    } else {
      /* ======================================================================
       * BACKEND INTEGRATION: Verify OTP and Login
       * ======================================================================
       * API Endpoint: POST /api/v1/auth/verify-otp
       *
       * Request Payload:
       * {
       *   "otpId": "string",          // OTP session ID from send-otp response
       *   "otp": "string",            // 6-digit OTP entered by user
       *   "mobileNumber": "string"    // Mobile number for verification
       * }
       *
       * Expected Response (Success - 200):
       * {
       *   "success": true,
       *   "data": {
       *     "accessToken": "JWT_TOKEN",
       *     "refreshToken": "REFRESH_TOKEN",
       *     "expiresIn": 3600,
       *     "user": {
       *       "id": "user_id",
       *       "name": "User Full Name",
       *       "email": "user@example.com",
       *       "role": "admin|manager|user",
       *       "userType": "CUSTOMER|INTERNAL",
       *       "segment": "Enterprise|Hotel|CoLiving|CoWorking|PG|Misc",
       *       "companyId": "company_id",
       *       "companyName": "Company Name",
       *       "siteId": "site_id",
       *       "siteName": "Site Name",
       *       "permissions": [...]
       *     }
       *   }
       * }
       *
       * Expected Response (Error - 400/401):
       * {
       *   "success": false,
       *   "error": {
       *     "code": "INVALID_OTP|OTP_EXPIRED|MAX_ATTEMPTS_EXCEEDED",
       *     "message": "Error message",
       *     "attemptsRemaining": 2    // Optional: remaining attempts
       *   }
       * }
       *
       * Sample Integration Code:
       * ------------------------
       * try {
       *   const response = await fetch('/api/v1/auth/verify-otp', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ otpId: otpSessionId, otp, mobileNumber })
       *   });
       *   const data = await response.json();
       *
       *   if (data.success) {
       *     localStorage.setItem('accessToken', data.data.accessToken);
       *     sessionStorage.setItem('refreshToken', data.data.refreshToken);
       *     login(data.data.user, data.data.accessToken);
       *     navigate('/dashboard');
       *   } else {
       *     setError(data.error.message);
       *   }
       * } catch (error) {
       *   setError('Verification failed. Please try again.');
       * }
       * ==================================================================== */

      // TODO: Remove mock and implement actual OTP verification API call
      if (otp.length === 6) {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate("/dashboard");
        setIsLoading(false);
      } else {
        setError("Please enter a valid 6-digit OTP");
      }
    }
  };

  return (
    <div className="login-page">
      {/* Dev Toolbar */}
      <RoleAccessSelector />

      {/* Yellow Header Bar */}
      <div className="login-header-bar" />

      {/* Banner Image - Right Side */}
      <div className="login-banner">
        <img src={bannerImage} alt="" />
      </div>

      {/* Main Content */}
      <div className="login-main">
        {/* Spectra Logo */}
        <div className="login-logo">
          <span className="spectra-text">SPECTRA</span>
        </div>

        {/* Centered Content */}
        <div className="login-center">
          {/* Greeting */}
          <h1 className="login-greeting">{greeting}</h1>
          <p className="login-subtitle">Please share your login details</p>

          {/* Login Form */}
          <div className="login-form-container">
            {/* Tabs */}
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab ${activeTab === "loginId" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("loginId");
                  setError("");
                }}
              >
                Login ID
              </button>
              <button
                type="button"
                className={`login-tab ${activeTab === "mobileOtp" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("mobileOtp");
                  setError("");
                  setOtpSent(false);
                }}
              >
                Mobile OTP
              </button>
            </div>

            {/* Form Content */}
            <div className="login-form-content">
              {activeTab === "loginId" ? (
                <form onSubmit={handleLoginIdSubmit}>
                  <div className="form-field">
                    <label htmlFor="login-id-input">Enter Login ID</label>
                    <input
                      id="login-id-input"
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="password-input">Enter Password</label>
                    <div className="password-wrapper">
                      <input
                        id="password-input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>

                  <div className="remember-row">
                    <label className="remember-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {error && <div className="login-error">{error}</div>}

                  <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMobileOtpSubmit}>
                  <div className="form-field">
                    <label htmlFor={otpSent ? "otp-input" : "mobile-input"}>
                      {otpSent ? "Enter OTP" : "Enter Mobile Number"}
                    </label>
                    {!otpSent ? (
                      <input
                        id="mobile-input"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        required
                        autoComplete="tel"
                      />
                    ) : (
                      <input
                        id="otp-input"
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        required
                        autoComplete="one-time-code"
                      />
                    )}
                  </div>

                  {otpSent && (
                    <div className="otp-info">
                      OTP sent to {mobileNumber.slice(0, 2)}****{mobileNumber.slice(-2)}
                      <button
                        type="button"
                        className="change-number-btn"
                        onClick={() => setOtpSent(false)}
                      >
                        Change Number
                      </button>
                    </div>
                  )}

                  {error && <div className="login-error">{error}</div>}

                  <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading
                      ? otpSent
                        ? "Verifying..."
                        : "Sending OTP..."
                      : otpSent
                      ? "Verify OTP"
                      : "Send OTP"}
                  </button>
                </form>
              )}

              <Link to="/forgot-details" className="forgot-link">
                Forgot details ?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
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

export default Login;
