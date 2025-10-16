// src/reports/tables/SiteActiveUsersTable.js

import React from 'react';
import ReportTable from '../../components/common/ReportTable';

const SiteActiveUsersTable = ({ data }) => {
  const columns = [
    "Month",
    "Avg. Active Users",
    "New Users",
    "Churned Users",
    "Activations",
    "Deactivations",
    "Change vs Prev.",
  ];
  
  const rows = data.map((r) => [
    r.month,
    r.avgActiveUsers,
    r.newUsers,
    r.churnedUsers,
    r.activations,
    r.deactivations,
    r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`,
  ]);

  return <ReportTable columns={columns} data={rows} />;
};

export default SiteActiveUsersTable;
