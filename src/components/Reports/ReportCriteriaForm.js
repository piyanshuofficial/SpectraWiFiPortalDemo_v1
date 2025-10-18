// src/components/Reports/ReportCriteriaForm.js

import React from 'react';
import DateRangePicker from './DateRangePicker';
import MonthRangePicker from './MonthRangePicker';
import './ReportCriteriaForm.css';

const ReportCriteriaForm = ({ report, criteria, errors, onChange }) => {
  if (!report.criteriaFields || report.criteriaFields.length === 0) {
    return (
      <div className="no-criteria">
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
            <label className="form-label">
              {field.label}
              {field.required && <span className="required-mark">*</span>}
            </label>
            <select
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
          <div key={field.name} className="form-field">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required-mark">*</span>}
            </label>
            <div className="multi-select-wrapper">
              {field.options.map(option => {
                const selectedValues = criteria[field.name] || field.defaultValue || [];
                const isSelected = selectedValues.includes(option);
                return (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option]
                          : selectedValues.filter(v => v !== option);
                        onChange(field.name, newValues);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            {errors[field.name] && (
              <span className="form-error" role="alert">{errors[field.name]}</span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="report-criteria-form">
      {report.criteriaFields.map(field => renderField(field))}
    </div>
  );
};

export default ReportCriteriaForm;