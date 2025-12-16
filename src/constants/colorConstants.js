// src/constants/colorConstants.js

export const PRIMARY_COLORS = {
  MAIN: "#004aad",
  DARK: "#003a90",
  DARKER: "#002d70",
  LIGHT: "#1641a3",
  LIGHTER: "#204094",
  ACCENT: "#68d5ff",
};

export const SUPPORTING_COLORS = {
  PURPLE: "#9465AA",
  INDIGO: "#5B879F",
  AQUA: "#4AA7A9",
  MINT: "#42C1B5",
};

export const REPORT_COLOR_ASSIGNMENTS = {
  network_usage: "AQUA",
  license_usage: "INDIGO",
  alerts_summary: "PURPLE",
  site_monthly_active_users: "MINT",
  site_activity: "MINT",
};

export const SEMANTIC_COLORS = {
  SUCCESS: "#4caf50",
  SUCCESS_DARK: "#388e3c",
  SUCCESS_LIGHT: "#d4edda",
  SUCCESS_TEXT: "#155724",
  
  WARNING: "#ff9800",
  WARNING_DARK: "#f57c00",
  WARNING_LIGHT: "#fff3cd",
  WARNING_TEXT: "#856404",
  WARNING_ALT: "#ffc735",
  WARNING_BUTTON: "#FFA900",
  
  DANGER: "#f44336",
  DANGER_DARK: "#d32f2f",
  DANGER_LIGHT: "#f8d7da",
  DANGER_TEXT: "#721c24",
  DANGER_ALT: "#e81500",
  DANGER_BUTTON: "#f04e3e",
  
  INFO: "#2196f3",
  INFO_DARK: "#1976d2",
  INFO_LIGHT: "#d1ecf1",
  INFO_TEXT: "#0c5460",
};

export const NEUTRAL_COLORS = {
  WHITE: "#ffffff",
  BLACK: "#000000",
  
  GRAY_50: "#f9fafb",
  GRAY_100: "#f3f5f9",
  GRAY_200: "#e5e9f2",
  GRAY_300: "#dde6f3",
  GRAY_400: "#c9d1e8",
  GRAY_500: "#a8b5d0",
  GRAY_600: "#5a5a5a",
  GRAY_700: "#555",
  GRAY_800: "#444",
  GRAY_900: "#222",
  
  BORDER: "#e5e5e5",
  BORDER_LIGHT: "#e1e1e1",
  BORDER_DARK: "#ddd",
  DIVIDER: "#eee",
  
  TEXT_PRIMARY: "#222",
  TEXT_SECONDARY: "#555",
  TEXT_MUTED: "#5a5a5a",
  TEXT_DISABLED: "#999",
};

export const BACKGROUND_COLORS = {
  BODY: "#f1f3f7",
  CARD: "#ffffff",
  MODAL: "#ffffff",
  OVERLAY: "rgba(30, 40, 60, 0.27)",
  HOVER: "rgba(0, 74, 173, 0.03)",
  SELECTED: "#e3f1ff",
  DISABLED: "#f5f5f5",
  SIDEBAR: "#181818",
  HEADER: "#2c2c2c",
  FOOTER: "#e8e8e8",
};

export const BADGE_COLORS = {
  ACTIVE_BG: "#dff0d8",
  ACTIVE_TEXT: "#3c763d",
  
  SUSPENDED_BG: "#fcf8e3",
  SUSPENDED_TEXT: "#8a6d3b",
  
  BLOCKED_BG: "#f2dede",
  BLOCKED_TEXT: "#a94442",
  
  SUCCESS_BG: "#d4edda",
  SUCCESS_TEXT: "#155724",
  
  WARNING_BG: "#fff3cd",
  WARNING_TEXT: "#856404",
  
  DANGER_BG: "#f8d7da",
  DANGER_TEXT: "#721c24",
  
  SECONDARY_BG: "#e2e3e5",
  SECONDARY_TEXT: "#383d41",
};

export const CHART_COLORS = {
  PRIMARY: "#004aad",
  PRIMARY_LIGHT: "rgba(0, 74, 173, 0.2)",
  
  SECONDARY: "#3f51b5",
  TERTIARY: "#7986cb",
  QUATERNARY: "#c5cae9",
  
  SUCCESS: "#4caf50",
  WARNING: "#ff9800",
  DANGER: "#f44336",
  
  DATASET_1: "rgba(33,80,162,0.6)",
  DATASET_2: "rgba(49,120,115,0.6)",
  DATASET_3: "rgba(217,83,79,0.6)",
};

export const POLICY_COLORS = {
  SPEED_BG: "#eef4ff",
  SPEED_TEXT: "#0053ba",
  
  DATA_BG: "#e6fbe7",
  DATA_TEXT: "#229441",
  
  DEVICE_BG: "#f4eefd",
  DEVICE_TEXT: "#8832b1",
};

export const SHADOWS = {
  SM: "0 1px 4px rgba(0, 0, 0, 0.03)",
  BASE: "0 1px 6px rgba(0, 0, 0, 0.06)",
  MD: "0 2px 8px rgba(0, 0, 0, 0.08)",
  LG: "0 4px 16px rgba(0, 0, 0, 0.12)",
  XL: "0 6px 20px rgba(0, 0, 0, 0.18)",
  
  CARD: "0 1px 8px rgba(0, 0, 0, 0.05)",
  MODAL: "0 6px 20px rgba(33, 38, 71, 0.2)",
  BUTTON: "0 2px 6px rgba(33, 38, 71, 0.10)",
  DROPDOWN: "0 8px 32px rgba(0, 0, 0, 0.2)",
};

export const GRADIENTS = {
  HEADER: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
  PRIMARY: "linear-gradient(135deg, #004aad 0%, #003a90 100%)",
};

export const withOpacity = (color, opacity) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getReportBranding = (reportId) => {
  const colorKey = REPORT_COLOR_ASSIGNMENTS[reportId] || "AQUA";
  const color = SUPPORTING_COLORS[colorKey] || SUPPORTING_COLORS.AQUA;
  return { color, colorKey };
};

export const PINNED_REPORT_BRAND_COLORS = [
  "#9465AA",
  "#5B879F",
  "#4AA7A9",
  "#42C1B5",
];

export const getRandomBrandColor = (previousColor = null) => {
  let availableColors = [...PINNED_REPORT_BRAND_COLORS];
  
  if (previousColor) {
    availableColors = availableColors.filter(color => color !== previousColor);
  }
  
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

// ============================================
// DEFAULT EXPORT
// ============================================
const colorConstants = {
  PRIMARY_COLORS,
  SUPPORTING_COLORS,
  REPORT_COLOR_ASSIGNMENTS,
  SEMANTIC_COLORS,
  NEUTRAL_COLORS,
  BACKGROUND_COLORS,
  BADGE_COLORS,
  CHART_COLORS,
  POLICY_COLORS,
  SHADOWS,
  GRADIENTS,
  withOpacity,
  getReportBranding,
  PINNED_REPORT_BRAND_COLORS,
  getRandomBrandColor,
};

export default colorConstants;