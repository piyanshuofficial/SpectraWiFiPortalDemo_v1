// src/components/common/ReportTable.js

import React, { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import "./ReportTable.css";

const ReportTable = ({ 
  columns, 
  data, 
  loading = false, 
  error = null, 
  onRetry,
  columnAlignment = {},
  showPagination = true,
  rowsPerPageOptions = [10, 20, 50, 100],
  defaultRowsPerPage = 20,
  totalRecords = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Calculate total records - use prop if provided, otherwise use data length
  const calculatedTotalRecords = totalRecords !== null ? totalRecords : (data ? data.length : 0);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    if (!data || !showPagination) return data;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, rowsPerPage, showPagination]);

  const totalPages = Math.ceil(calculatedTotalRecords / rowsPerPage);
  const startRecord = calculatedTotalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * rowsPerPage, calculatedTotalRecords);

  // Reset to page 1 when rowsPerPage changes
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Get column alignment (default to left for text, right for numbers)
  const getColumnAlignment = (colIndex, cellValue) => {
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
  };

  // Generate page buttons
  const generatePageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
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
          aria-label="Go to first page"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
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
        >
          {i}
        </button>
      );
    }
    
    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key="last"
          onClick={() => setCurrentPage(totalPages)}
          className="pagination-btn"
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };

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
            <div className="spinner" aria-hidden="true"></div>
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
      
      {/* Summary and Pagination */}
      <div className="report-table-footer">
        <div 
          className="report-table-summary"
          role="status"
          aria-live="polite"
        >
          {showPagination && calculatedTotalRecords > rowsPerPage ? (
            <>
              Showing {startRecord}-{endRecord} of {calculatedTotalRecords} record{calculatedTotalRecords !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              Showing {calculatedTotalRecords} record{calculatedTotalRecords !== 1 ? 's' : ''}
            </>
          )}
        </div>
        
        {showPagination && totalPages > 1 && (
          <div className="report-table-pagination" role="navigation" aria-label="Report pagination">
            <div className="pagination-controls">
              <label htmlFor="rows-per-page" className="pagination-label">
                Rows per page:
              </label>
              <select
                id="rows-per-page"
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
            
            <div className="pagination-buttons">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="pagination-btn pagination-nav"
                aria-label="Go to first page"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn pagination-nav"
                aria-label="Go to previous page"
              >
                ‹
              </button>
              
              {generatePageButtons()}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn pagination-nav"
                aria-label="Go to next page"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-btn pagination-nav"
                aria-label="Go to last page"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
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