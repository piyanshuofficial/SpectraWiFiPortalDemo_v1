// src/i18n/index.js
/**
 * Internationalization (i18n) Configuration
 *
 * MULTI-LANGUAGE SUPPORT DISABLED
 * Currently only English is enabled. Other languages are commented out for future use.
 *
 * Supported Languages (when re-enabled):
 * - English (en) - Default
 * - Hindi (hi) - हिन्दी
 * - Telugu (te) - తెలుగు
 * - Kannada (kn) - ಕನ್ನಡ
 *
 * Features:
 * - Language persistence in localStorage
 * - Pluralization support (e.g., "{{count}} users")
 * - Interpolation (e.g., "Welcome, {{name}}")
 * - Fallback to English for missing translations
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// MULTI-LANGUAGE DISABLED: Language detector not needed when only English is used
// import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../locales/en/translation.json';
// MULTI-LANGUAGE DISABLED: Other language imports commented out for future use
// import hiTranslation from '../locales/hi/translation.json';
// import knTranslation from '../locales/kn/translation.json';
// import teTranslation from '../locales/te/translation.json';

const resources = {
  en: { translation: enTranslation },
  // MULTI-LANGUAGE DISABLED: Other languages commented out for future use
  // hi: { translation: hiTranslation },
  // kn: { translation: knTranslation },
  // te: { translation: teTranslation }
};

// Language display names (in native script)
// MULTI-LANGUAGE DISABLED: Only English enabled, others commented out for future use
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  // { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  // { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr' },
  // { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr' }
];

// MULTI-LANGUAGE DISABLED: Flag to indicate if multi-language is enabled
export const MULTI_LANGUAGE_ENABLED = false;

// localStorage key for language preference
const LANGUAGE_STORAGE_KEY = 'portal-language-preference';

/**
 * Get saved language from localStorage
 */
export const getSavedLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
};

/**
 * Save language preference to localStorage
 */
export const saveLanguage = (langCode) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
  } catch (e) {
    console.warn('Could not save language preference:', e);
  }
};

/**
 * Change the current language
 */
export const changeLanguage = async (langCode) => {
  saveLanguage(langCode);
  await i18n.changeLanguage(langCode);
  // Update document direction if needed (all current languages are LTR)
  const lang = LANGUAGES.find(l => l.code === langCode);
  if (lang) {
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = langCode;
  }
};

/**
 * Get current language info
 */
export const getCurrentLanguage = () => {
  const code = i18n.language || 'en';
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
};

i18n
  // MULTI-LANGUAGE DISABLED: Language detector removed - using English only
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // MULTI-LANGUAGE DISABLED: Force English language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development' && false, // Set to true for debugging

    // MULTI-LANGUAGE DISABLED: Language detection disabled
    // detection: {
    //   order: ['localStorage', 'navigator', 'htmlTag'],
    //   lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    //   caches: ['localStorage']
    // },

    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value, format, lng) => {
        // Custom formatting for numbers
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        // Custom formatting for percentages
        if (format === 'percent') {
          return new Intl.NumberFormat(lng, { style: 'percent' }).format(value / 100);
        }
        return value;
      }
    },

    // Pluralization configuration
    pluralSeparator: '_',
    contextSeparator: '_',

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'b']
    },

    // Return key if translation not found (helps identify missing translations)
    returnEmptyString: false,
    returnNull: false
  });

// Initialize document language attribute
const initLang = getSavedLanguage();
document.documentElement.lang = initLang;

export default i18n;
