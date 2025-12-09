// src/api/tokenService.js
// JWT Token Management Service

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

class TokenService {
  constructor() {
    this.refreshPromise = null;
  }

  // Get the access token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Get the refresh token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Set tokens after login
  setTokens(accessToken, refreshToken, expiresIn) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }

  // Clear all tokens (logout)
  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  // Check if token is expired
  isTokenExpired() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    // Add 60 second buffer before actual expiry
    return Date.now() > (parseInt(expiry, 10) - 60000);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired();
  }

  // Decode JWT token (without verification - for client-side use only)
  decodeToken(token = null) {
    const tokenToDecode = token || this.getToken();
    if (!tokenToDecode) return null;

    try {
      const base64Url = tokenToDecode.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get user info from token
  getUserFromToken() {
    const decoded = this.decodeToken();
    if (!decoded) return null;

    return {
      id: decoded.sub || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      accessLevel: decoded.accessLevel,
      permissions: decoded.permissions || []
    };
  }

  // Refresh the access token
  async refreshAccessToken(refreshFunction) {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = refreshFunction(refreshToken)
      .then(response => {
        this.setTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );
        return response.accessToken;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  // Get authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;
