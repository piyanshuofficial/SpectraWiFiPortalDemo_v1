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
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOtpSent(true);
      setIsLoading(false);
    } else {
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
                    <label>Enter Login ID</label>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="form-field">
                    <label>Enter Password</label>
                    <div className="password-wrapper">
                      <input
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
                    <label>{otpSent ? "Enter OTP" : "Enter Mobile Number"}</label>
                    {!otpSent ? (
                      <input
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
