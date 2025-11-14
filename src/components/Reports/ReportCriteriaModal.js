// src/components/Reports/ReportCriteriaModal.js
import React, { useState, useEffect, useRef } from 'react';
import DateRangePicker from '@components/Reports/DateRangePicker';
import '@components/Reports/ReportCriteriaModal.css';

const ReportCriteriaModal = ({ open, report, onClose, onGenerate }) => {
  const [criteria, setCriteria] = useState({
    startDate: '',
    endDate: '',
  });
  const modalRef = useRef();

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    setCriteria({
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: lastMonthEnd.toISOString().split('T')[0],
    });
  }, []);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

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
    <div 
      className="criteria-modal-overlay" 
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div 
        ref={modalRef}
        className="criteria-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="criteria-modal-title"
        aria-describedby="criteria-modal-subtitle"
        tabIndex={-1}
      >
        <div className="criteria-modal-header">
          <h2 id="criteria-modal-title" className="criteria-modal-title">
            {report.name}
          </h2>
          <p id="criteria-modal-subtitle" className="criteria-modal-subtitle">
            Select criteria to generate report
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="criteria-modal-body">
            <fieldset className="criteria-form-section">
              <legend className="criteria-section-label">
                Date Range <span className="required-asterisk" aria-label="required">*</span>
              </legend>
              <DateRangePicker
                startDate={criteria.startDate}
                endDate={criteria.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                quickSelects={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}
              />
            </fieldset>
          </div>

          <div className="criteria-modal-footer">
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onClose}
              aria-label="Cancel and close dialog"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!isValid}
              aria-label={isValid ? "Generate report with selected criteria" : "Please select valid date range"}
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