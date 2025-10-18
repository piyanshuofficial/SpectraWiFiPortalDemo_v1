// src/components/Reports/ReportCriteriaModal.js
import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import ReportCriteriaForm from './ReportCriteriaForm';
import { toast } from 'react-toastify';
import './ReportCriteriaModal.css';

const ReportCriteriaModal = ({ open, onClose, report, onGenerate }) => {
  const [criteria, setCriteria] = useState({});
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open && report) {
      // Initialize with default criteria
      const defaultCriteria = {};
      if (report.criteriaFields) {
        report.criteriaFields.forEach(field => {
          if (field.defaultValue !== undefined) {
            defaultCriteria[field.name] = field.defaultValue;
          }
        });
      }
      setCriteria(defaultCriteria);
      setErrors({});
    }
  }, [open, report]);

  const validateCriteria = () => {
    const newErrors = {};
    
    if (!report.criteriaFields) return true;

    report.criteriaFields.forEach(field => {
      if (field.required && !criteria[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }

      // Date range validation
      if (field.type === 'dateRange' && criteria[field.name]) {
        const { start, end } = criteria[field.name];
        if (!start || !end) {
          newErrors[field.name] = 'Both start and end dates are required';
        } else if (new Date(end) < new Date(start)) {
          newErrors[field.name] = 'End date must be after start date';
        } else if (field.validation?.maxRange) {
          const daysDiff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
          if (daysDiff > field.validation.maxRange) {
            newErrors[field.name] = `Maximum range is ${field.validation.maxRange} days`;
          }
        }
      }

      // Month range validation
      if (field.type === 'monthRange' && criteria[field.name]) {
        const { start, end } = criteria[field.name];
        if (!start || !end) {
          newErrors[field.name] = 'Both start and end months are required';
        } else if (end < start) {
          newErrors[field.name] = 'End month must be after start month';
        } else if (field.validation?.maxRange) {
          const startDate = new Date(start + '-01');
          const endDate = new Date(end + '-01');
          const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - startDate.getMonth());
          if (monthsDiff > field.validation.maxRange) {
            newErrors[field.name] = `Maximum range is ${field.validation.maxRange} months`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateCriteria()) {
      toast.error('Please fix validation errors');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      onGenerate(criteria);
      toast.success('Report generated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCriteriaChange = (name, value) => {
    setCriteria(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!open || !report) return null;

  return (
    <Modal onClose={onClose}>
      <div className="report-criteria-modal">
        <div className="criteria-modal-header">
          <h2>{report.name}</h2>
          <p className="criteria-modal-subtitle">Select criteria to generate report</p>
        </div>

        <div className="criteria-modal-body">
          <ReportCriteriaForm
            report={report}
            criteria={criteria}
            errors={errors}
            onChange={handleCriteriaChange}
          />
        </div>

        <div className="criteria-modal-footer">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            loading={isGenerating}
            aria-label="Generate report with selected criteria"
          >
            Generate Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportCriteriaModal;