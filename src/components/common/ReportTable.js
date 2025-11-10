// src/components/common/ReportTable.js

import React from "react";
import PropTypes from 'prop-types';
import "./ReportTable.css";

const ReportTable = ({ columns, data }) => {
  return (
    <div className="report-table-container">
      <table className="report-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ReportTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default ReportTable;