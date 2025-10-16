// src/reports/tables/MonthlyDataUsageTable.js

import React from 'react';
import ReportTable from '../../components/common/ReportTable';

const MonthlyDataUsageTable = ({ data }) => {
  const columns = ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"];
  const rows = data.map(d => [d.month, d.totalUsageGB, d.peakUsageGB, d.avgUsageGB]);

  return <ReportTable columns={columns} data={rows} />;
};

export default MonthlyDataUsageTable;
