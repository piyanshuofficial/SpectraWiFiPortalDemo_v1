// src/reports/tables/PolicyMonthlyAvgUsersTable.js

import React from 'react';
import ReportTable from '../../components/common/ReportTable';

const PolicyMonthlyAvgUsersTable = ({ data }) => {
  const columns = ["Month", "Policy", "Avg Active Users"];
  const rows = data.map(d => [d.month, d.policy, d.avgActiveUsers]);

  return <ReportTable columns={columns} data={rows} />;
};

export default PolicyMonthlyAvgUsersTable;
