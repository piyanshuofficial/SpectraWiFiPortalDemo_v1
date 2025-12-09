import React from "react";
import { FaCalendarAlt, FaFilter, FaListUl, FaEdit } from "react-icons/fa";
import { MdDateRange, MdLabel } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import "./CriteriaDisplay.css";

const CriteriaDisplay = ({ criteria, criteriaFields, onChangeCriteria }) => {
  if (!criteria || Object.keys(criteria).length === 0) return null;

  const formatValue = (field, value) => {
    if (!value) return "Not set";
    switch (field.type) {
      case "dateRange":
        if (value.start && value.end) {
          const startDate = new Date(value.start);
          const endDate = new Date(value.end);
          return (
            `${startDate.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })} - ` +
            `${endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}`
          );
        }
        return "Invalid range";
      case "monthRange":
        if (value.start && value.end) {
          const [startYear, startMonth] = value.start.split("-");
          const [endYear, endMonth] = value.end.split("-");
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return (
            `${months[parseInt(startMonth, 10) - 1]} ${startYear} - ` +
            `${months[parseInt(endMonth, 10) - 1]} ${endYear}`
          );
        }
        return "Invalid range";
      case "multiSelect":
        return Array.isArray(value) && value.length > 0 ? value.join(", ") : "None selected";
      default:
        return value.toString();
    }
  };

  const getIcon = (fieldType) => {
    switch (fieldType) {
      case "dateRange":
        return <MdDateRange className="criteria-icon" />;
      case "monthRange":
        return <FaCalendarAlt className="criteria-icon" />;
      case "dropdown":
        return <FiChevronDown className="criteria-icon" />;
      case "multiSelect":
        return <FaListUl className="criteria-icon" />;
      case "filter":
        return <FaFilter className="criteria-icon" />;
      default:
        return <MdLabel className="criteria-icon" />;
    }
  };

  return (
    <div className="criteria-display" role="region" aria-label="Applied report criteria">
      <div className="criteria-display-title">
        <div className="criteria-display-header">
          <span>Applied Criterias</span>
          <button
            className="change-criteria-btn"
            onClick={onChangeCriteria}
            aria-label="Change report criteria"
            type="button"
          >
            <FaEdit aria-hidden="true" /> Change Criteria
          </button>
        </div>
      </div>
      <div className="criteria-items">
        {criteriaFields.map((field) => {
          const value = criteria[field.name];
          if (!value) return null;
          return (
            <div key={field.name} className="criteria-item">
              <span className="criteria-icon" aria-hidden="true">{getIcon(field.type)}</span>
              <span className="criteria-label">{field.label}</span>
              <span className="criteria-value">{formatValue(field, value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriteriaDisplay;
