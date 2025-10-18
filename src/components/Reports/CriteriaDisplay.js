// src/components/Reports/CriteriaDisplay.js
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './CriteriaDisplay.css';

const CriteriaDisplay = ({ criteria, criteriaFields, onChangeCriteria }) => {
  if (!criteria || Object.keys(criteria).length === 0) {
    return null;
  }

  const formatValue = (field, value) => {
    if (!value) return 'Not set';

    switch (field.type) {
      case 'dateRange':
        if (value.start && value.end) {
          const startDate = new Date(value.start);
          const endDate = new Date(value.end);
          return `${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
        }
        return 'Invalid range';

      case 'monthRange':
        if (value.start && value.end) {
          const [startYear, startMonth] = value.start.split('-');
          const [endYear, endMonth] = value.end.split('-');
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${months[parseInt(startMonth) - 1]} ${startYear} - ${months[parseInt(endMonth) - 1]} ${endYear}`;
        }
        return 'Invalid range';

      case 'multiSelect':
        return Array.isArray(value) && value.length > 0 ? value.join(', ') : 'None selected';

      default:
        return value.toString();
    }
  };

  const getIcon = (fieldType) => {
    switch (fieldType) {
      case 'dateRange':
      case 'monthRange':
        return '📅';
      case 'dropdown':
        return '📊';
      case 'multiSelect':
        return '🏷️';
      default:
        return '📌';
    }
  };

  return (
    <div className="criteria-display">
      <div className="criteria-display-title">
        <div className="criteria-display-header">
          <span>Applied Criteria</span>
        </div>
        {onChangeCriteria && (
          <button 
            className="change-criteria-btn"
            onClick={onChangeCriteria}
            title="Change report criteria"
            aria-label="Change report criteria"
          >
            <FaEdit />
            Change Criteria
          </button>
        )}
      </div>
      <div className="criteria-items">
        {criteriaFields.map(field => {
          const value = criteria[field.name];
          if (!value) return null;

          return (
            <div key={field.name} className="criteria-item">
              <span className="criteria-icon">{getIcon(field.type)}</span>
              <span className="criteria-label">{field.label}:</span>
              <span className="criteria-value">{formatValue(field, value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriteriaDisplay;