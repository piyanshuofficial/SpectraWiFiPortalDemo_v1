// src/reports/tables/DailyAverageActiveUsersTable.js

import React from 'react';
import ReportTable from '../../components/common/ReportTable';

const DailyAverageActiveUsersTable = ({ data }) => {
  const columns = ["Date", "Avg. Active Users"];
  const rows = data.map(d => [d.date, d.avgActiveUsers]);

  return <ReportTable columns={columns} data={rows} />;
};

export default DailyAverageActiveUsersTable;
