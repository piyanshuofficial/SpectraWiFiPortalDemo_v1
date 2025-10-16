// src/reports/tables/LicenseUsageTable.js

import React from "react";

const LicenseUsageTable = ({ data }) => {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>License</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ licenseType, usageCount }, i) => (
          <tr key={i}>
            <td>{licenseType}</td>
            <td>{usageCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LicenseUsageTable;
