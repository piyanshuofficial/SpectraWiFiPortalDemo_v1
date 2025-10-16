// src/reports/tables/AlertsSummaryTable.js

import React from "react";

const AlertsSummaryTable = ({ data }) => {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>Alert Type</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ alertType, count }, i) => (
          <tr key={i}>
            <td>{alertType}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AlertsSummaryTable;
