// src/components/Reports/DateRangePicker.js
import React from 'react';
import './DateRangePicker.css';

const DateRangePicker = ({ field, value, error, onChange }) => {
  const { start = '', end = '' } = value || {};

  const handleStartChange = (newStart) => {
    onChange({ start: newStart, end });
  };

  const handleEndChange = (newEnd) => {
    onChange({ start, end: newEnd });
  };

  const applyPreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'Today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'Last 7 Days':
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today.setDate(today.getDate() - 6)).toISOString().split('T')[0];
        break;
      case 'Last 30 Days':
        endDate = new Date().toISOString().split('T')[0];
        startDate = new Date(new Date().setDate(new Date().getDate() - 29)).toISOString().split('T')[0];
        break;
      case 'This Month':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = thisMonthStart.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'Last Month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = lastMonthStart.toISOString().split('T')[0];
        endDate = lastMonthEnd.toISOString().split('T')[0];
        break;
      default:
        return;
    }

    onChange({ start: startDate, end: endDate });
  };

  return (
    <div className="date-range-picker">
      <label className="form-label">
        {field.label}
        {field.required && <span className="required-mark">*</span>}
      </label>

      <div className="date-range-inputs">
        <div className="date-input-group">
          <label className="date-sublabel">Start Date</label>
          <input
            type="date"
            className={`form-input ${error ? 'form-input-error' : ''}`}
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            max={end || undefined}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-label="Start date"
          />
        </div>

        <div className="date-range-separator">to</div>

        <div className="date-input-group">
          <label className="date-sublabel">End Date</label>
          <input
            type="date"
            className={`form-input ${error ? 'form-input-error' : ''}`}
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            min={start || undefined}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-label="End date"
          />
        </div>
      </div>

      <div className="preset-buttons">
        <span className="preset-label">Quick Select:</span>
        {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'].map(preset => (
          <button
            key={preset}
            type="button"
            className="preset-btn"
            onClick={() => applyPreset(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      {error && (
        <span className="form-error" role="alert">{error}</span>
      )}
    </div>
  );
};

export default DateRangePicker;