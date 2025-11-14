// src/components/ErrorBoundary.js

import React from "react";

/**
 * Centralized Error Boundary component.
 * Handles errors for major pages, dashboards, modals, lists, and reporting UIs.
 * Provides contextual fallback UI and error logging.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // TODO: Integrate error logging/reporting service here for production.
    if (process.env.NODE_ENV !== "production") {
      // Log error for developers in dev mode.
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    const { children } = this.props;
    if (this.state.hasError) {
      // Helpful, contextual fallback UI. Accessible for screen readers.
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f9fafc"
          }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              padding: "3rem 2rem",
              maxWidth: "600px",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }} aria-hidden="true">
              &#9888;
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#d32f2f",
                marginBottom: "1rem"
              }}
              id="error-boundary-title"
            >
              Oops! Something went wrong
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "#555",
                marginBottom: "2rem",
                lineHeight: 1.6
              }}
              id="error-boundary-description"
            >
              We encountered an error while loading this page. This might be due to a network issue or a temporary problem with the application.
            </p>
            <div 
              style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
              role="group"
              aria-labelledby="error-boundary-title"
            >
              <button
                onClick={this.handleReload}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "#004aad",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                aria-label="Reload the page to try again"
                onMouseEnter={e => (e.target.style.backgroundColor = "#003a90")}
                onMouseLeave={e => (e.target.style.backgroundColor = "#004aad")}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#004aad",
                  backgroundColor: "#f0f4ff",
                  border: "1px solid #cfd7ea",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                aria-label="Go to dashboard"
                onMouseEnter={e => (e.target.style.backgroundColor = "#dbe5ff")}
                onMouseLeave={e => (e.target.style.backgroundColor = "#f0f4ff")}
              >
                Go to Dashboard
              </button>
            </div>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details style={{ marginTop: "2rem", textAlign: "left", fontSize: "0.875rem", color: "#666" }}>
                <summary 
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  aria-label="View error details (development mode only)"
                >
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                  fontSize: "0.75rem"
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo ? ("\n" + this.state.errorInfo.componentStack) : null}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;