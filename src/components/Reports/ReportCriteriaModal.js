// src/components/Reports/ReportCriteriaModal.js
import React, { useState, useEffect } from 'react';
import DateRangePicker from './DateRangePicker';
import './ReportCriteriaModal.css';

const ReportCriteriaModal = ({ open, report, onClose, onGenerate }) => {
  const [criteria, setCriteria] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    setCriteria({
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: lastMonthEnd.toISOString().split('T')[0],
    });
  }, []);

  const handleStartDateChange = (e) => {
    setCriteria({ ...criteria, startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    setCriteria({ ...criteria, endDate: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (report && criteria.startDate && criteria.endDate) {
      const formattedCriteria = {
        dateRange: {
          start: criteria.startDate,
          end: criteria.endDate
        }
      };
      onGenerate(formattedCriteria);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isValid = criteria.startDate && criteria.endDate && 
                  new Date(criteria.startDate) <= new Date(criteria.endDate);

  if (!open || !report) {
    return null;
  }

  return (
    <div className="criteria-modal-overlay" onClick={handleOverlayClick}>
      <div className="criteria-modal">
        <div className="criteria-modal-header">
          <h2 className="criteria-modal-title">{report.name}</h2>
          <p className="criteria-modal-subtitle">Select criteria to generate report</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="criteria-modal-body">
            <div className="criteria-form-section">
              <label className="criteria-section-label">
                Date Range <span className="required-asterisk">*</span>
              </label>
              <DateRangePicker
                startDate={criteria.startDate}
                endDate={criteria.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                quickSelects={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}
              />
            </div>
          </div>

          <div className="criteria-modal-footer">
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!isValid}
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCriteriaModal;