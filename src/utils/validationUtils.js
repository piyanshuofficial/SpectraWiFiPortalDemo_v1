// src/utils/validationUtils.js

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
  const mobileRegex = /^[0-9]{7,15}$/;
  return mobileRegex.test(value.trim());
};

// Email Validation using standard regex
export const isEmailValid = (value) => {
  if (!value) return false;
  // Basic RFC5322 email regex simplified
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value.trim());
};

// Password, if needed, be validated elsewhere for complexity rules

// Export for possible future validations (guestId, etc.)
