// src/components/Reports/MonthRangePicker.js
import React from 'react';
import '@components/Reports/MonthRangePicker.css';

const MonthRangePicker = ({ field, value, error, onChange }) => {
  const { start = '', end = '' } = value || {};

  const handleStartChange = (newStart) => {
    onChange({ start: newStart, end });
  };

  const handleEndChange = (newEnd) => {
    onChange({ start, end: newEnd });
  };

  const applyPreset = (preset) => {
    const today = new Date();
    let startMonth, endMonth;

    switch (preset) {
      case 'Last 3 Months':
        endMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 2));
        startMonth = `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'Last 6 Months':
        endMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 5));
        startMonth = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'This Year':
        const currentYear = new Date().getFullYear();
        startMonth = `${currentYear}-01`;
        endMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'Last Year':
        const lastYear = new Date().getFullYear() - 1;
        startMonth = `${lastYear}-01`;
        endMonth = `${lastYear}-12`;
        break;
      default:
        return;
    }

    onChange({ start: startMonth, end: endMonth });
  };

  return (
    <div className="month-range-picker">
      <label className="form-label" id={`${field.name}-label`}>
        {field.label}
        {field.required && <span className="required-mark" aria-label="required">*</span>}
      </label>

      <div className="month-range-inputs">
        <div className="month-input-group">
          <label htmlFor={`${field.name}-start`} className="month-sublabel">Start Month</label>
          <input
            id={`${field.name}-start`}
            type="month"
            className={`form-input ${error ? 'form-input-error' : ''}`}
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            max={end || undefined}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.name}-error` : undefined}
          />
        </div>

        <div className="month-range-separator" aria-hidden="true">to</div>

        <div className="month-input-group">
          <label htmlFor={`${field.name}-end`} className="month-sublabel">End Month</label>
          <input
            id={`${field.name}-end`}
            type="month"
            className={`form-input ${error ? 'form-input-error' : ''}`}
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            min={start || undefined}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.name}-error` : undefined}
          />
        </div>
      </div>

      <div className="preset-buttons">
        <span className="preset-label" id="preset-label">Quick Select:</span>
        <div role="group" aria-labelledby="preset-label">
          {['Last 3 Months', 'Last 6 Months', 'This Year', 'Last Year'].map(preset => (
            <button
              key={preset}
              type="button"
              className="preset-btn"
              onClick={() => applyPreset(preset)}
              aria-label={`Select ${preset.toLowerCase()}`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <span className="form-error" id={`${field.name}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default MonthRangePicker;