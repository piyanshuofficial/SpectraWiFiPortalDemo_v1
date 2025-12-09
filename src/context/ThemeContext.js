// src/context/ThemeContext.js

import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always use light mode - dark mode toggle has been removed
  const isDarkMode = false;

  // Apply light theme to document on mount
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');

    // Clear any saved dark mode preference
    localStorage.removeItem('portal-theme-preference');
  }, []);

  // These are kept for backwards compatibility but are no-ops
  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
