// src/config/chartConfig.js

/**
 * Centralized Chart.js Configuration
 * 
 * This file handles all Chart.js component registration and provides
 * default configurations for consistent chart behavior across the application.
 * 
 * Import this file once at application startup to ensure all Chart.js
 * components are registered globally.
 */

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// ============================================
// GLOBAL CHART.JS REGISTRATION
// ============================================

/**
 * Register all Chart.js components globally
 * This ensures all chart types (line, bar, pie, etc.) work throughout the app
 */
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ============================================
// DEFAULT CHART CONFIGURATIONS
// ============================================

/**
 * Default chart options for consistent appearance
 */
export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
};

/**
 * Default tooltip configuration
 */
export const DEFAULT_TOOLTIP_CONFIG = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  titleColor: '#fff',
  bodyColor: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1,
  padding: 12,
  displayColors: true,
  boxPadding: 6
};

/**
 * Default legend configuration
 */
export const DEFAULT_LEGEND_CONFIG = {
  display: true,
  position: 'top',
  align: 'center',
  labels: {
    usePointStyle: true,
    padding: 15,
    font: {
      family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      size: 12
    }
  }
};

/**
 * Color palette for consistent chart colors
 */
export const CHART_COLOR_PALETTE = {
  primary: '#004aad',
  secondary: '#3f51b5',
  tertiary: '#7986cb',
  quaternary: '#c5cae9',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3',
  dataset1: 'rgba(33, 80, 162, 0.6)',
  dataset2: 'rgba(49, 120, 115, 0.6)',
  dataset3: 'rgba(217, 83, 79, 0.6)',
  dataset4: 'rgba(150, 150, 150, 0.6)'
};

/**
 * Common border colors with transparency
 */
export const CHART_BORDER_COLORS = {
  primary: '#004aad',
  secondary: '#3f51b5',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3'
};

/**
 * Common background colors with transparency
 */
export const CHART_BACKGROUND_COLORS = {
  primary: 'rgba(0, 74, 173, 0.2)',
  secondary: 'rgba(63, 81, 181, 0.2)',
  success: 'rgba(76, 175, 80, 0.2)',
  warning: 'rgba(255, 152, 0, 0.2)',
  danger: 'rgba(244, 67, 54, 0.2)',
  info: 'rgba(33, 150, 243, 0.2)'
};

// ============================================
// CHART TYPE SPECIFIC DEFAULTS
// ============================================

/**
 * Default configuration for line charts
 */
export const LINE_CHART_DEFAULTS = {
  tension: 0.4,
  borderWidth: 2,
  pointRadius: 4,
  pointHoverRadius: 6,
  fill: true
};

/**
 * Default configuration for bar charts
 */
export const BAR_CHART_DEFAULTS = {
  borderWidth: 1,
  borderRadius: 4,
  maxBarThickness: 50
};

/**
 * Default configuration for pie/doughnut charts
 */
export const PIE_CHART_DEFAULTS = {
  borderWidth: 2,
  borderColor: '#fff',
  hoverBorderWidth: 3
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get chart type specific defaults
 * @param {string} type - Chart type ('line', 'bar', 'pie', etc.)
 * @returns {object} Default configuration for the chart type
 */
export function getChartTypeDefaults(type) {
  switch (type) {
    case 'line':
      return LINE_CHART_DEFAULTS;
    case 'bar':
      return BAR_CHART_DEFAULTS;
    case 'pie':
    case 'doughnut':
      return PIE_CHART_DEFAULTS;
    default:
      return {};
  }
}

/**
 * Merge custom options with defaults
 * @param {object} customOptions - Custom chart options
 * @param {string} chartType - Chart type
 * @returns {object} Merged configuration
 */
export function mergeChartOptions(customOptions = {}, chartType = 'line') {
  const typeDefaults = getChartTypeDefaults(chartType);
  
  return {
    ...DEFAULT_CHART_OPTIONS,
    ...customOptions,
    plugins: {
      tooltip: {
        ...DEFAULT_TOOLTIP_CONFIG,
        ...customOptions?.plugins?.tooltip
      },
      legend: {
        ...DEFAULT_LEGEND_CONFIG,
        ...customOptions?.plugins?.legend
      },
      ...customOptions?.plugins
    },
    elements: {
      [chartType === 'line' ? 'line' : 'bar']: {
        ...typeDefaults,
        ...customOptions?.elements?.[chartType === 'line' ? 'line' : 'bar']
      }
    }
  };
}

/**
 * Get a color from the palette by name
 * @param {string} colorName - Color name from palette
 * @param {boolean} withTransparency - Whether to return background or border color
 * @returns {string} Color value
 */
export function getChartColor(colorName, withTransparency = false) {
  if (withTransparency) {
    return CHART_BACKGROUND_COLORS[colorName] || CHART_BACKGROUND_COLORS.primary;
  }
  return CHART_BORDER_COLORS[colorName] || CHART_BORDER_COLORS.primary;
}

/**
 * Generate an array of colors for datasets
 * @param {number} count - Number of colors needed
 * @returns {array} Array of colors
 */
export function generateColorArray(count) {
  const colors = [
    CHART_COLOR_PALETTE.primary,
    CHART_COLOR_PALETTE.secondary,
    CHART_COLOR_PALETTE.tertiary,
    CHART_COLOR_PALETTE.quaternary,
    CHART_COLOR_PALETTE.success,
    CHART_COLOR_PALETTE.warning,
    CHART_COLOR_PALETTE.danger,
    CHART_COLOR_PALETTE.info
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
}

// ============================================
// EXPORT CHART.JS INSTANCE
// ============================================

/**
 * Export the configured Chart.js instance
 * This ensures components always use the registered version
 */
export { Chart };

export default Chart;