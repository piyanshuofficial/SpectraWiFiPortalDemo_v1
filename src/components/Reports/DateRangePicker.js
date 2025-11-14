// src/components/Reports/DateRangePicker.js
import React from 'react';
import '@components/Reports/DateRangePicker.css';

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  quickSelects = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']
}) => {
  const handleQuickSelect = (option) => {
    const today = new Date();
    let start, end;

    switch(option) {
      case 'Today':
        start = end = today.toISOString().split('T')[0];
        break;
      case 'Last 7 Days':
        start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      case 'Last 30 Days':
        start = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      case 'Last Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      default:
        return;
    }

    onStartDateChange({ target: { value: start } });
    onEndDateChange({ target: { value: end } });
  };

  return (
    <div className="date-range-picker">
      <div className="date-inputs-container">
        <div className="date-input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={onStartDateChange}
            className="date-input"
            aria-label="Select start date"
          />
        </div>

        <div className="date-separator" aria-hidden="true">to</div>

        <div className="date-input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={onEndDateChange}
            className="date-input"
            aria-label="Select end date"
          />
        </div>
      </div>

      {quickSelects && quickSelects.length > 0 && (
        <div className="quick-select-container">
          <span className="quick-select-label" id="quick-select-label">Quick Select:</span>
          <div 
            className="quick-select-buttons"
            role="group"
            aria-labelledby="quick-select-label"
          >
            {quickSelects.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleQuickSelect(option)}
                className="quick-select-btn"
                aria-label={`Select ${option.toLowerCase()}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;