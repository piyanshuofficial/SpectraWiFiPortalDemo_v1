// src/reports/SiteMonthlyActiveUsers.js

import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import siteMonthlyActiveUsersSample from "../data/siteMonthlyActiveUsersSample";
import SiteActiveUsersComboChart from "./charts/SiteActiveUsersComboChart";
import ReportTable from "../components/common/ReportTable";
import ChartContainer from "../components/common/ChartContainer";

const SiteMonthlyActiveUsers = forwardRef((props, ref) => {
  const [reportData] = useState(siteMonthlyActiveUsersSample);
  const chartWrapperRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => {
      if (chartWrapperRef.current) {
        return chartWrapperRef.current.querySelector("canvas");
      }
      return null;
    },
  }));

  // Prepare table columns and rows in required format
  const columns = [
    "Month",
    "Avg. Active Users",
    "New Users",
    "Churned Users",
    "Activations",
    "Deactivations",
    "Change vs Prev.",
  ];

  const rows = reportData.map((r) => [
    r.month,
    r.avgActiveUsers,
    r.newUsers,
    r.churnedUsers,
    r.activations,
    r.deactivations,
    r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`,
  ]);

  return (
    <div>
      <div ref={chartWrapperRef}>
        <ChartContainer>
          <SiteActiveUsersComboChart data={reportData} />
        </ChartContainer>
      </div>
      <ReportTable columns={columns} data={rows} />
    </div>
  );
});

export default SiteMonthlyActiveUsers;