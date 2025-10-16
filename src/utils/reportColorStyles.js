// src/utils/reportColorStyles.js

// Brand palette from your guidelines
export const SUPPORTING_COLORS = {
  purple:  "#9465AA",
  indigo:  "#5B879F",
  aqua:    "#4AA7A9",
  mint:    "#42C1B5"
};

// Example mapping: each report or section gets one colorKey
export const REPORT_COLOR_ASSIGNMENTS = {
  network_usage:   "aqua",    // used by all "network usage" reports
  license_usage:   "indigo",  // used by all license usage reports
  alerts_summary:  "purple",  // etc.
  site_activity:   "mint"
  // Add new reports/sections as needed; re-use color keys as needed
};
