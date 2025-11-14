// src/components/Pagination.js

import React from "react";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { PAGINATION, COMPONENT_SIZES } from "@constants/appConstants";

const Pagination = ({
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (totalPages === 0) return null;

  const createPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          aria-current={currentPage === i ? "page" : undefined}
          aria-label={`${currentPage === i ? 'Current page, ' : ''}Page ${i}`}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
          type="button"
          style={{
            border: "1px solid #c8d2e8",
            background: currentPage === i ? "#204094" : "#f6f8fb",
            color: currentPage === i ? "#fff" : "#17418f",
            fontSize: "0.8rem",
            borderRadius: "4px",
            width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
            height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
            lineHeight: "1.2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: currentPage === i ? "600" : "normal",
            margin: "0 2px"
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <nav 
      className="pagination-bar" 
      role="navigation" 
      aria-label="Pagination Navigation"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        background: "transparent",
        padding: "6px 0 0 0",
        marginBottom: "8px",
        boxShadow: "none",
        borderRadius: "0",
        width: "100%"
      }}
    >
      <div className="pagination-left" style={{
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        <label htmlFor="rows-per-page-select" className="rows-per-page-label" style={{
          fontWeight: "600",
          color: "#204094",
          fontSize: "0.8rem",
          marginRight: "6px",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        }}>
          Rows per page:
        </label>
        <select
          id="rows-per-page-select"
          className="rows-per-page-select"
          aria-label="Select number of rows per page"
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(Number(e.target.value))}
          style={{
            borderRadius: "4px",
            border: "1px solid #cfd7ea",
            fontSize: "0.8rem",
            padding: "4px 8px",
            background: "#f8faff",
            outlineOffset: "2px",
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            transition: "border-color 0.2s ease",
            marginRight: "4px",
            lineHeight: "1.2"
          }}
        >
          {PAGINATION.ROWS_PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="pagination-right" style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center"
      }}>
        <div 
          className="pagination-buttons" 
          role="group"
          aria-label="Pagination controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Go to first page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === 1 ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === 1 ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleDoubleLeft aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Go to previous page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === 1 ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === 1 ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleLeft aria-hidden="true" />
          </button>
          {createPageButtons()}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Go to next page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === totalPages ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === totalPages ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleRight aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Go to last page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === totalPages ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === totalPages ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleDoubleRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;