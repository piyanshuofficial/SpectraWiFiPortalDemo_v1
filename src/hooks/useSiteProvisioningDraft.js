// src/hooks/useSiteProvisioningDraft.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_FORM_STATE, getDraftStorageKey } from '../constants/siteProvisioningConfig';

/**
 * Custom hook for managing site provisioning draft with localStorage persistence.
 * Provides auto-save functionality with debounce and draft recovery.
 *
 * @param {string} userId - User ID for generating unique storage key
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 500ms)
 * @returns {Object} Draft management utilities
 */
const useSiteProvisioningDraft = (userId, debounceMs = 500) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([1]);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const debounceRef = useRef(null);
  const storageKey = getDraftStorageKey(userId);

  // Use refs to store current values for stable callbacks
  const currentStepRef = useRef(currentStep);
  const visitedStepsRef = useRef(visitedSteps);
  const formDataRef = useRef(formData);

  // Keep refs in sync
  currentStepRef.current = currentStep;
  visitedStepsRef.current = visitedSteps;
  formDataRef.current = formData;

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        return {
          formData: parsed.formData || INITIAL_FORM_STATE,
          currentStep: parsed.currentStep || 1,
          visitedSteps: parsed.visitedSteps || [1],
          lastSaved: parsed.lastSaved || null
        };
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  }, [storageKey]);

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback((data, step, visited) => {
    try {
      const draftData = {
        formData: data,
        currentStep: step,
        visitedSteps: visited,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      setLastSaved(draftData.lastSaved);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [storageKey]);

  /**
   * Auto-save with debounce
   */
  const autoSave = useCallback((data, step, visited) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsDirty(true);

    debounceRef.current = setTimeout(() => {
      saveDraft(data, step, visited);
    }, debounceMs);
  }, [saveDraft, debounceMs]);

  /**
   * Update form data with auto-save
   * Uses refs to avoid dependency on changing state values, preventing infinite loops
   */
  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      autoSave(newData, currentStepRef.current, visitedStepsRef.current);
      return newData;
    });
  }, [autoSave]);

  /**
   * Update a specific field
   */
  const updateField = useCallback((fieldName, value) => {
    updateFormData(prev => ({ ...prev, [fieldName]: value }));
  }, [updateFormData]);

  /**
   * Update nested field (e.g., firewallConfig.organizationId)
   */
  const updateNestedField = useCallback((parentField, childField, value) => {
    updateFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  }, [updateFormData]);

  /**
   * Navigate to a specific step
   * Uses refs to avoid dependency on changing state values
   */
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    setVisitedSteps(prev => {
      const newVisited = prev.includes(step) ? prev : [...prev, step];
      autoSave(formDataRef.current, step, newVisited);
      return newVisited;
    });
  }, [autoSave]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    const next = Math.min(currentStep + 1, 8);
    goToStep(next);
  }, [currentStep, goToStep]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    const prev = Math.max(currentStep - 1, 1);
    goToStep(prev);
  }, [currentStep, goToStep]);

  /**
   * Check if a step has been visited
   */
  const isStepVisited = useCallback((step) => {
    return visitedSteps.includes(step);
  }, [visitedSteps]);

  /**
   * Check if user can navigate to a step
   */
  const canNavigateToStep = useCallback((step) => {
    return visitedSteps.includes(step) || step === Math.max(...visitedSteps) + 1;
  }, [visitedSteps]);

  /**
   * Clear draft and reset form
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setFormData(INITIAL_FORM_STATE);
      setCurrentStep(1);
      setVisitedSteps([1]);
      setHasDraft(false);
      setLastSaved(null);
      setIsDirty(false);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [storageKey]);

  /**
   * Restore draft from localStorage
   */
  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft.formData);
      setCurrentStep(draft.currentStep);
      setVisitedSteps(draft.visitedSteps);
      setLastSaved(draft.lastSaved);
      setHasDraft(true);
      return true;
    }
    return false;
  }, [loadDraft]);

  /**
   * Force save current state
   * Uses refs for stability
   */
  const forceSave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    saveDraft(formDataRef.current, currentStepRef.current, visitedStepsRef.current);
  }, [saveDraft]);

  /**
   * Check for existing draft on mount
   */
  useEffect(() => {
    const draft = loadDraft();
    setHasDraft(!!draft);
  }, [loadDraft]);

  /**
   * Cleanup debounce on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Format last saved time
   */
  const getLastSavedFormatted = useCallback(() => {
    if (!lastSaved) return null;
    const date = new Date(lastSaved);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastSaved]);

  return {
    // State
    formData,
    currentStep,
    visitedSteps,
    hasDraft,
    lastSaved,
    isDirty,

    // Form data updates
    updateFormData,
    updateField,
    updateNestedField,
    setFormData,

    // Navigation
    goToStep,
    nextStep,
    prevStep,
    isStepVisited,
    canNavigateToStep,

    // Draft management
    saveDraft: forceSave,
    loadDraft,
    restoreDraft,
    clearDraft,
    getLastSavedFormatted
  };
};

export default useSiteProvisioningDraft;
