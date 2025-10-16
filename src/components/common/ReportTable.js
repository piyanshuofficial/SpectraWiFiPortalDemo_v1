// src/components/common/ReportTable.js

import React from "react";
import { tableStyles } from "../../styles/reportStyles";

const ReportTable = ({ columns, data }) => (
  <div style={tableStyles.container}>
    <table style={tableStyles.table}>
      <thead style={tableStyles.thead}>
        <tr>{columns.map((col, i) => <th key={i} style={tableStyles.th}>{col}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} style={tableStyles.stripedRow(idx)}>
            {row.map((cell, cidx) => <td key={cidx} style={tableStyles.td}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportTable;
