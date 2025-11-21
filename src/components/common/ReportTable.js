// src/components/common/ReportTable.js

import React, { useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import Spinner from "@components/Loading/Spinner";
import { PAGINATION } from "../../constants/appConstants";
import "./ReportTable.css";

const ReportTable = ({ 
  columns, 
  data, 
  loading = false, 
  error = null, 
  onRetry,
  columnAlignment = {},
  showPagination = true,
  rowsPerPageOptions = PAGINATION.ROWS_PER_PAGE_OPTIONS,
  defaultRowsPerPage = PAGINATION.DEFAULT_ROWS_PER_PAGE,
  totalRecords = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Calculate total records - use prop if provided, otherwise use data length
  const calculatedTotalRecords = totalRecords !== null ? totalRecords : (data ? data.length : 0);
  
  // Calculate total pages
  const totalPages = Math.ceil(calculatedTotalRecords / rowsPerPage);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    if (!data || !showPagination) return data;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, rowsPerPage, showPagination]);

  const startRecord = calculatedTotalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * rowsPerPage, calculatedTotalRecords);

  // Reset to page 1 when rowsPerPage changes
  const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }, []);

  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);

  // Get column alignment (default to left for text, right for numbers)
  const getColumnAlignment = useCallback((colIndex, cellValue) => {
    // Check if alignment is explicitly set
    if (columnAlignment[colIndex]) {
      return columnAlignment[colIndex];
    }
    
    // Auto-detect: if cell looks like a number, align right
    if (cellValue !== null && cellValue !== undefined) {
      const stringValue = String(cellValue).trim();
      // Check if it's a number (including formatted numbers like "1,234" or percentages)
      if (/^[+-]?\d+([.,]\d+)*%?$/.test(stringValue.replace(/,/g, ''))) {
        return 'right';
      }
    }
    
    return 'left';
  }, [columnAlignment]);

  // Generate page buttons with ellipsis for large page counts
  const generatePageButtons = useCallback(() => {
    const buttons = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            aria-label={`${currentPage === i ? 'Current page, ' : ''}Page ${i}`}
            aria-current={currentPage === i ? 'page' : undefined}
            type="button"
          >
            {i}
          </button>
        );
      }
    } else {
      // Show pages with ellipsis
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // First page button
      if (startPage > 1) {
        buttons.push(
          <button
            key="first"
            onClick={() => setCurrentPage(1)}
            className="pagination-btn"
            aria-label="Go to page 1"
            type="button"
          >
            1
          </button>
        );
        if (startPage > 2) {
          buttons.push(
            <span key="ellipsis-start" className="pagination-ellipsis" aria-hidden="true">
              ...
            </span>
          );
        }
      }
      
      // Page number buttons
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            aria-label={`${currentPage === i ? 'Current page, ' : ''}Page ${i}`}
            aria-current={currentPage === i ? 'page' : undefined}
            type="button"
          >
            {i}
          </button>
        );
      }
      
      // Last page button
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(
            <span key="ellipsis-end" className="pagination-ellipsis" aria-hidden="true">
              ...
            </span>
          );
        }
        buttons.push(
          <button
            key="last"
            onClick={() => setCurrentPage(totalPages)}
            className="pagination-btn"
            aria-label={`Go to page ${totalPages}`}
            type="button"
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return buttons;
  }, [totalPages, currentPage]);

  // Loading state
  if (loading) {
    return (
      <div className="report-table-container">
        <div
          className="report-table-state"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="report-table-loading">
            <Spinner size="lg" color="primary" />
            <p>Loading report data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="report-table-container">
        <div 
          className="report-table-state report-table-error"
          role="alert"
          aria-live="assertive"
        >
          <div className="error-icon" aria-hidden="true">⚠</div>
          <h3>Failed to Load Report Data</h3>
          <p>{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="btn btn-primary"
              type="button"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="report-table-container">
        <div 
          className="report-table-state report-table-empty"
          role="status"
          aria-live="polite"
        >
          <div className="empty-icon" aria-hidden="true">📊</div>
          <h3>No Report Data Available</h3>
          <p>There are no records to display for the selected filters.</p>
        </div>
      </div>
    );
  }

  // Data state - render table
  const displayData = showPagination ? paginatedData : data;

  return (
    <div className="report-table-container">
      <div className="report-table-wrapper" role="region" aria-label="Report data table" tabIndex={0}>
        <table 
          className="report-table"
          role="table"
          aria-label="Report data"
          aria-rowcount={calculatedTotalRecords + 1}
        >
          <thead>
            <tr role="row">
              {columns.map((col, idx) => {
                // Get alignment for header based on first data row
                const firstRowValue = data[0] && data[0][idx];
                const alignment = getColumnAlignment(idx, firstRowValue);
                
                return (
                  <th 
                    key={idx}
                    role="columnheader"
                    scope="col"
                    aria-colindex={idx + 1}
                    style={{ textAlign: alignment }}
                  >
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, rowIdx) => (
              <tr 
                key={rowIdx}
                role="row"
                aria-rowindex={rowIdx + 2}
              >
                {row.map((cell, cellIdx) => {
                  const alignment = getColumnAlignment(cellIdx, cell);
                  
                  return (
                    <td 
                      key={cellIdx}
                      role="cell"
                      aria-colindex={cellIdx + 1}
                      style={{ textAlign: alignment }}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls - Always show when showPagination is true */}
      {showPagination && calculatedTotalRecords > 0 && (
        <nav 
          className="report-table-pagination-nav" 
          role="navigation" 
          aria-label="Report table pagination"
        >
          <div className="report-pagination-summary" role="status" aria-live="polite">
            <span className="pagination-info-text">
              Showing {startRecord}-{endRecord} of {calculatedTotalRecords} record{calculatedTotalRecords !== 1 ? 's' : ''}
            </span>
            {totalPages > 1 && (
              <span className="pagination-page-info">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>
          
          <div className="report-pagination-controls">
            <div className="pagination-rows-selector">
              <label htmlFor="report-rows-per-page" className="pagination-label">
                Rows per page:
              </label>
              <select
                id="report-rows-per-page"
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="pagination-select"
                aria-label="Select rows per page"
              >
                {rowsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="pagination-buttons-group" role="group" aria-label="Pagination buttons">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || totalPages <= 1}
                className="pagination-nav-btn"
                aria-label="Go to first page"
                type="button"
              >
                <FaAngleDoubleLeft aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || totalPages <= 1}
                className="pagination-nav-btn"
                aria-label="Go to previous page"
                type="button"
              >
                <FaAngleLeft aria-hidden="true" />
              </button>
              
              <div className="pagination-page-buttons">
                {totalPages > 0 && generatePageButtons()}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages <= 1}
                className="pagination-nav-btn"
                aria-label="Go to next page"
                type="button"
              >
                <FaAngleRight aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages <= 1}
                className="pagination-nav-btn"
                aria-label="Go to last page"
                type="button"
              >
                <FaAngleDoubleRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

ReportTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  columnAlignment: PropTypes.object,
  showPagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  defaultRowsPerPage: PropTypes.number,
  totalRecords: PropTypes.number,
};

export default ReportTable;