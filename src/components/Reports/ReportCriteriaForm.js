// src/components/Reports/ReportCriteriaForm.js

import React from 'react';
import DateRangePicker from '@components/Reports/DateRangePicker';
import MonthRangePicker from '@components/Reports/MonthRangePicker';
import '@components/Reports/ReportCriteriaForm.css';

/**
 * Report Criteria Form Component
 * 
 * Handles user input for report criteria/filters
 * Works with centralized data from userSampleData and siteSampleData
 * Criteria is used to filter report data before rendering
 */
const ReportCriteriaForm = ({ report, criteria, errors, onChange }) => {
  if (!report.criteriaFields || report.criteriaFields.length === 0) {
    return (
      <div className="no-criteria" role="status">
        <p>This report uses default criteria</p>
      </div>
    );
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'dateRange':
        return (
          <DateRangePicker
            key={field.name}
            field={field}
            value={criteria[field.name] || field.defaultValue}
            error={errors[field.name]}
            onChange={(value) => onChange(field.name, value)}
          />
        );

      case 'monthRange':
        return (
          <MonthRangePicker
            key={field.name}
            field={field}
            value={criteria[field.name] || field.defaultValue}
            error={errors[field.name]}
            onChange={(value) => onChange(field.name, value)}
          />
        );

      case 'dropdown':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={`field-${field.name}`} className="form-label">
              {field.label}
              {field.required && <span className="required-mark" aria-label="required">*</span>}
            </label>
            <select
              id={`field-${field.name}`}
              className={`form-select ${errors[field.name] ? 'form-select-error' : ''}`}
              value={criteria[field.name] || field.defaultValue || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              aria-required={field.required}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors[field.name] && (
              <span id={`${field.name}-error`} className="form-error" role="alert">
                {errors[field.name]}
              </span>
            )}
          </div>
        );

      case 'multiSelect':
        return (
          <fieldset key={field.name} className="form-field">
            <legend className="form-label">
              {field.label}
              {field.required && <span className="required-mark" aria-label="required">*</span>}
            </legend>
            <div 
              className="multi-select-wrapper"
              role="group"
              aria-labelledby={`${field.name}-legend`}
            >
              {field.options.map(option => {
                const selectedValues = criteria[field.name] || field.defaultValue || [];
                const isSelected = selectedValues.includes(option);
                const optionId = `${field.name}-${option.replace(/\s+/g, '-')}`;
                return (
                  <label key={option} htmlFor={optionId} className="checkbox-label">
                    <input
                      id={optionId}
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option]
                          : selectedValues.filter(v => v !== option);
                        onChange(field.name, newValues);
                      }}
                      aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            {errors[field.name] && (
              <span id={`${field.name}-error`} className="form-error" role="alert">
                {errors[field.name]}
              </span>
            )}
          </fieldset>
        );

      default:
        return null;
    }
  };

  return (
    <form className="report-criteria-form">
      {report.criteriaFields.map(field => renderField(field))}
    </form>
  );
};

export default ReportCriteriaForm;