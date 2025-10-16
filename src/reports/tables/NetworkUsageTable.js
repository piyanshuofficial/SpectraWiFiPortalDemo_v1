// src/reports/tables/NetworkUsageTable.js

import React from "react";

const NetworkUsageTable = ({ data }) => {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Network Usage (GB)</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ day, usageGB }, i) => (
          <tr key={i}>
            <td>{day}</td>
            <td>{usageGB}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NetworkUsageTable;
