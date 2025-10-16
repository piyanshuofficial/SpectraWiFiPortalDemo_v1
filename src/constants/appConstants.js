// src/constants/appConstants.js

/**
 * Application-wide constants
 * Central location for all magic numbers and configuration values
 */

// ============================================
// PAGINATION CONSTANTS
// ============================================
export const PAGINATION = {
  DEFAULT_ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 20, 50],
  DEVICE_LIST_DEFAULT: 6,
  MAX_ITEMS_PER_PAGE: 100,
};

// ============================================
// DATE/TIME CONSTANTS
// ============================================
export const DATE_TIME = {
  DEFAULT_DAYS_BACK: 7,
  DASHBOARD_DATE_RANGE_DAYS: 7,
  DEFAULT_CHECK_IN_TIME: "11:00",
  DEFAULT_CHECK_OUT_TIME: "14:00",
  TIMESTAMP_DEBOUNCE_MS: 300,
};

// ============================================
// TYPOGRAPHY CONSTANTS
// ============================================
export const TYPOGRAPHY = {
  BASE_FONT_SIZE: "13px",
  BASE_FONT_SIZE_REM: "0.8125rem",
  
  // Font sizes in rem
  FONT_SIZE_XS: "0.72rem",
  FONT_SIZE_SM: "0.75rem",
  FONT_SIZE_BASE: "0.8rem",
  FONT_SIZE_MD: "0.85rem",
  FONT_SIZE_LG: "0.9rem",
  FONT_SIZE_XL: "0.95rem",
  FONT_SIZE_2XL: "1rem",
  FONT_SIZE_3XL: "1.1rem",
  FONT_SIZE_4XL: "1.2rem",
  
  // Line heights
  LINE_HEIGHT_TIGHT: 1.2,
  LINE_HEIGHT_BASE: 1.3,
  LINE_HEIGHT_RELAXED: 1.4,
  LINE_HEIGHT_LOOSE: 1.6,
  
  // Font weights
  FONT_WEIGHT_NORMAL: 400,
  FONT_WEIGHT_MEDIUM: 500,
  FONT_WEIGHT_SEMIBOLD: 600,
  FONT_WEIGHT_BOLD: 700,
};

// ============================================
// SPACING CONSTANTS (in pixels for consistency)
// ============================================
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
  
  // Specific use cases
  CARD_PADDING: "16px 20px",
  MODAL_PADDING: "20px 24px",
  SECTION_MARGIN: 24,
  ELEMENT_GAP: 12,
};

// ============================================
// LAYOUT CONSTANTS
// ============================================
export const LAYOUT = {
  SIDEBAR_WIDTH: 100,
  HEADER_HEIGHT: 60,
  FOOTER_HEIGHT: 50,
  MOBILE_HEADER_HEIGHT: 54,
  
  // Breakpoints
  BREAKPOINT_SM: 600,
  BREAKPOINT_MD: 768,
  BREAKPOINT_LG: 900,
  BREAKPOINT_XL: 1200,
  BREAKPOINT_XXL: 1400,
  
  // Grid
  DEVICE_CARD_COLUMNS: 3,
  DEVICE_CARD_COLUMNS_MD: 2,
  DEVICE_CARD_COLUMNS_SM: 1,
};

// ============================================
// ANIMATION/TIMING CONSTANTS
// ============================================
export const ANIMATION = {
  TRANSITION_FAST: "0.15s",
  TRANSITION_BASE: "0.2s",
  TRANSITION_SLOW: "0.3s",
  
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 150,
  TOOLTIP_DELAY: 500,
  TOAST_DURATION: 2000,
  MODAL_ANIMATION_DURATION: 200,
  
  // Specific timeouts
  HIGHLIGHT_DURATION: 350,
  AUTO_FOCUS_DELAY: 80,
  SCROLL_DELAY: 60,
  SEARCH_DEBOUNCE: 300,
};

// ============================================
// DATA LIMITS & THRESHOLDS
// ============================================
export const DATA_LIMITS = {
  MAX_USER_ID_LENGTH: 32,
  MAX_DEVICE_NAME_LENGTH: 40,
  MAC_ADDRESS_LENGTH: 17,
  MIN_PASSWORD_LENGTH: 6,
  PASSWORD_DIGITS: 6,
  
  MAX_SEARCH_RESULTS: 100,
  MAX_NOTIFICATION_COUNT: 99,
  
  MIN_MOBILE_LENGTH: 10,
  MAX_FILE_SIZE_MB: 10,
};

// ============================================
// LICENSE THRESHOLDS
// ============================================
export const LICENSE_THRESHOLDS = {
  WARNING_PERCENT: 0.75,  // 75% usage - show warning
  CRITICAL_PERCENT: 0.9,  // 90% usage - show critical
  
  // Colors based on usage
  COLOR_NORMAL: "#32ad4e",
  COLOR_WARNING: "#ffc735",
  COLOR_CRITICAL: "#e14b4b",
};

// ============================================
// CHART CONSTANTS
// ============================================
export const CHART = {
  // Font sizes for display
  DISPLAY_BASE_FONT: 14,
  DISPLAY_TITLE_FONT: 18,
  DISPLAY_TICK_FONT: 12,
  
  // Font sizes for export
  EXPORT_BASE_FONT: 20,
  EXPORT_TITLE_FONT: 28,
  EXPORT_TICK_FONT: 18,
  
  // Canvas sizes for export
  EXPORT_LINE_WIDTH: 900,
  EXPORT_LINE_HEIGHT: 450,
  EXPORT_BAR_WIDTH: 900,
  EXPORT_BAR_HEIGHT: 450,
  EXPORT_PIE_SIZE: 450,
  
  // Chart dimensions
  DEFAULT_HEIGHT: 200,
  SPARKLINE_WIDTH: 60,
  SPARKLINE_HEIGHT: 16,
};

// ============================================
// FORM VALIDATION CONSTANTS
// ============================================
export const VALIDATION = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MAC_ADDRESS_REGEX: /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i,
  MOBILE_REGEX: /^[0-9]{7,15}$/,
  
  MAC_ADDRESS_FORMAT: "AA:BB:CC:DD:EE:FF",
  MOBILE_PREFIX_DEFAULT: "91-",
};

// ============================================
// COMPONENT SIZE CONSTANTS
// ============================================
export const COMPONENT_SIZES = {
  // Buttons
  BUTTON_MIN_HEIGHT: 36,
  BUTTON_PADDING: "8px 16px",
  BUTTON_COMPACT_PADDING: "6px 12px",
  
  // Input fields
  INPUT_PADDING: "6px 10px",
  INPUT_HEIGHT: 36,
  
  // Cards
  CARD_MIN_HEIGHT: 90,
  CARD_BORDER_RADIUS: 8,
  
  // Modals
  MODAL_MAX_WIDTH: 520,
  MODAL_MAX_HEIGHT_VH: 85,
  MODAL_BORDER_RADIUS: 12,
  
  // License visualizations
  LICENSE_RING_SIZE: 160,
  LICENSE_RING_WIDTH: 16,
  LICENSE_RING_SIZE_COMPACT: 140,
  LICENSE_RING_WIDTH_COMPACT: 14,
  LICENSE_BAR_WIDTH: 280,
  LICENSE_BAR_HEIGHT: 26,
  
  // Tables
  TABLE_ROW_HEIGHT: 44,
  TABLE_HEADER_HEIGHT: 40,
  
  // Pagination
  PAGINATION_BUTTON_SIZE: 30,
  PAGINATION_BUTTON_HEIGHT: 26,
};

// ============================================
// Z-INDEX SCALE
// ============================================
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

// ============================================
// NOTIFICATION CONSTANTS
// ============================================
export const NOTIFICATIONS = {
  MAX_DISPLAY: 3,
  POSITION: "top-right",
  AUTO_CLOSE: 2000,
  AUTO_CLOSE_ERROR: 3000,
  AUTO_CLOSE_SUCCESS: 2000,
};

// ============================================
// DEVICE CONSTANTS
// ============================================
export const DEVICE = {
  USER_ID_PREFIX_LENGTH: 3,
  USER_ID_NUMBER_LENGTH: 3,
  SEARCH_RESULTS_MAX_HEIGHT: 140,
  CARD_MIN_HEIGHT: 85,
};

// ============================================
// REPORT CONSTANTS
// ============================================
export const REPORTS = {
  SHORTCUT_COLORS: ["#3f80ff", "#fec54f", "#4cb270", "#f96332", "#bd3e3e"],
  MAX_SHORTCUTS: 5,
  TABLE_MAX_HEIGHT: 400,
};

// ============================================
// ACTIVITY LOG CONSTANTS
// ============================================
export const ACTIVITY = {
  MAX_RECENT_ITEMS: 4,
  CARD_MAX_HEIGHT: 200,
};

// ============================================
// SEARCH CONSTANTS
// ============================================
export const SEARCH = {
  MIN_SEARCH_LENGTH: 1,
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 100,
  DROPDOWN_MAX_HEIGHT: 140,
};

// ============================================
// STATUS CONSTANTS
// ============================================
export const STATUS = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  FAILED: "Failed",
};

// ============================================
// USER CATEGORY CONSTANTS
// ============================================
export const USER_CATEGORIES = {
  EMPLOYEE: "employee",
  MEMBER: "member",
  RESIDENT: "resident",
  GUEST: "guest",
  USER: "user",
};

// ============================================
// EXPORT CONSTANTS
// ============================================
export const EXPORT = {
  CSV_ENCODING: "utf-8",
  PDF_PAGE_SIZE: "a4",
  PDF_ORIENTATION: "portrait",
  IMAGE_FORMAT: "png",
  IMAGE_QUALITY: 0.95,
};

// ============================================
// GRID CONSTANTS
// ============================================
export const GRID = {
  DASHBOARD_CARDS_COLUMNS: 4,
  QUICK_ACTIONS_COLUMNS: 5,
  QUICK_ACTIONS_COLUMNS_MD: 3,
  QUICK_ACTIONS_COLUMNS_SM: 2,
  QUICK_ACTIONS_COLUMNS_XS: 1,
};

// ============================================
// ACCESSIBILITY CONSTANTS
// ============================================
export const A11Y = {
  FOCUS_OUTLINE_WIDTH: 2,
  FOCUS_OUTLINE_OFFSET: 2,
  MIN_TOUCH_TARGET: 44, // pixels
  MIN_CONTRAST_RATIO: 4.5,
};

export default {
  PAGINATION,
  DATE_TIME,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
  ANIMATION,
  DATA_LIMITS,
  LICENSE_THRESHOLDS,
  CHART,
  VALIDATION,
  COMPONENT_SIZES,
  Z_INDEX,
  NOTIFICATIONS,
  DEVICE,
  REPORTS,
  ACTIVITY,
  SEARCH,
  STATUS,
  USER_CATEGORIES,
  EXPORT,
  GRID,
  A11Y,
};