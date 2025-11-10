// src/utils/validationUtils.js

import { VALIDATION } from '../constants/appConstants';

// Validate if value is non empty string after trimming
export const isRequired = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true; // number 0 is valid
  return !!value;
};

// Simple mobile number validation: digits only, length between 7-15 (adjust as needed)
export const isMobileValid = (value) => {
  if (!value) return false;
  return VALIDATION.MOBILE_REGEX.test(value.trim());
};

// Email Validation using standard regex
export const isEmailValid = (value) => {
  if (!value) return false;
  return VALIDATION.EMAIL_REGEX.test(value.trim());
};