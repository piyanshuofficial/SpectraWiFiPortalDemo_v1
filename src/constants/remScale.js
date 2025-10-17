// src/constants/remScale.js

/**
 * REM Scale System
 * Base: 1rem = 16px (browser default)
 * All sizes defined in rem for consistent scaling
 */

// ============================================
// BASE CONFIGURATION
// ============================================
export const BASE_FONT_SIZE = 16; // Browser default (px)
export const BASE_REM = 1; // 1rem = 16px

// ============================================
// FONT SIZE SCALE
// ============================================
export const FONT_SIZE = {
  // Extra Small
  XXS: '0.625rem',    // 10px
  XS: '0.6875rem',    // 11px
  
  // Small
  SM: '0.75rem',      // 12px
  SM_PLUS: '0.8125rem', // 13px (current base)
  
  // Base
  BASE: '0.875rem',   // 14px
  MD: '0.9375rem',    // 15px
  
  // Medium-Large
  LG: '1rem',         // 16px
  XL: '1.0625rem',    // 17px
  
  // Large
  '2XL': '1.125rem',  // 18px
  '3XL': '1.25rem',   // 20px
  '4XL': '1.375rem',  // 22px
  '5XL': '1.5rem',    // 24px
  
  // Extra Large
  '6XL': '1.75rem',   // 28px
  '7XL': '2rem',      // 32px
  '8XL': '2.25rem',   // 36px
  '9XL': '2.5rem',    // 40px
};

// ============================================
// SPACING SCALE (rem)
// ============================================
export const SPACING = {
  XXS: '0.125rem',    // 2px
  XS: '0.25rem',      // 4px
  SM: '0.5rem',       // 8px
  MD: '0.75rem',      // 12px
  LG: '1rem',         // 16px
  XL: '1.25rem',      // 20px
  '2XL': '1.5rem',    // 24px
  '3XL': '2rem',      // 32px
  '4XL': '2.5rem',    // 40px
  '5XL': '3rem',      // 48px
  '6XL': '4rem',      // 64px
};

// ============================================
// COMPONENT SIZES (rem)
// ============================================
export const COMPONENT_SIZE = {
  // Buttons
  BUTTON_HEIGHT_SM: '2rem',        // 32px
  BUTTON_HEIGHT_MD: '2.25rem',     // 36px
  BUTTON_HEIGHT_LG: '2.5rem',      // 40px
  BUTTON_PADDING_SM: '0.375rem 0.75rem',    // 6px 12px
  BUTTON_PADDING_MD: '0.5rem 1rem',         // 8px 16px
  BUTTON_PADDING_LG: '0.625rem 1.25rem',    // 10px 20px
  
  // Inputs
  INPUT_HEIGHT: '2.25rem',         // 36px
  INPUT_PADDING: '0.375rem 0.625rem', // 6px 10px
  
  // Cards
  CARD_PADDING_SM: '0.875rem 1rem',    // 14px 16px
  CARD_PADDING_MD: '1rem 1.25rem',     // 16px 20px
  CARD_PADDING_LG: '1.25rem 1.5rem',   // 20px 24px
  CARD_MIN_HEIGHT: '5.625rem',         // 90px
  
  // Tables
  TABLE_ROW_HEIGHT: '2.75rem',     // 44px
  TABLE_CELL_PADDING: '0.5rem 0.625rem', // 8px 10px
  TABLE_HEADER_HEIGHT: '2.5rem',   // 40px
  
  // Modals
  MODAL_PADDING: '1.25rem 1.5rem', // 20px 24px
  MODAL_MAX_WIDTH: '32.5rem',      // 520px
  
  // Sidebar & Header
  SIDEBAR_WIDTH: '6.25rem',        // 100px
  HEADER_HEIGHT: '3.75rem',        // 60px
  FOOTER_HEIGHT: '3.125rem',       // 50px
  
  // Badges & Pills
  BADGE_PADDING: '0.125rem 0.5rem',    // 2px 8px
  PILL_PADDING: '0.25rem 0.75rem',     // 4px 12px
  
  // Icons
  ICON_SM: '0.875rem',             // 14px
  ICON_MD: '1rem',                 // 16px
  ICON_LG: '1.25rem',              // 20px
  ICON_XL: '1.5rem',               // 24px
  ICON_2XL: '2rem',                // 32px
};

// ============================================
// BORDER RADIUS SCALE (rem)
// ============================================
export const RADIUS = {
  NONE: '0',
  XS: '0.1875rem',    // 3px
  SM: '0.25rem',      // 4px
  BASE: '0.375rem',   // 6px
  MD: '0.5rem',       // 8px
  LG: '0.625rem',     // 10px
  XL: '0.75rem',      // 12px
  '2XL': '1rem',      // 16px
  FULL: '9999rem',    // Fully rounded
};

// ============================================
// LINE HEIGHT SCALE
// ============================================
export const LINE_HEIGHT = {
  NONE: '1',
  TIGHT: '1.2',
  SNUG: '1.3',
  NORMAL: '1.4',
  RELAXED: '1.5',
  LOOSE: '1.6',
};

// ============================================
// FONT WEIGHT SCALE
// ============================================
export const FONT_WEIGHT = {
  THIN: '100',
  EXTRALIGHT: '200',
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
  BLACK: '900',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert px to rem
 * @param {number} px - Pixel value
 * @param {number} base - Base font size (default 16px)
 * @returns {string} rem value
 */
export const pxToRem = (px, base = BASE_FONT_SIZE) => {
  return `${px / base}rem`;
};

/**
 * Convert rem to px
 * @param {number} rem - Rem value
 * @param {number} base - Base font size (default 16px)
 * @returns {number} Pixel value
 */
export const remToPx = (rem, base = BASE_FONT_SIZE) => {
  return rem * base;
};

/**
 * Create spacing scale array
 * @param {number} multiplier - Scale multiplier
 * @returns {string} rem value
 */
export const spacing = (multiplier) => {
  return `${multiplier * 0.25}rem`; // 0.25rem = 4px base unit
};

// Export default scale object
export default {
  FONT_SIZE,
  SPACING,
  COMPONENT_SIZE,
  RADIUS,
  LINE_HEIGHT,
  FONT_WEIGHT,
  pxToRem,
  remToPx,
  spacing,
};