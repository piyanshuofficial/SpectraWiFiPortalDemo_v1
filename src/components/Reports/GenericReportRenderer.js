// src/components/Reports/GenericReportRenderer.js

import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import ChartContainer from "../common/ChartContainer";
import ReportTable from "../common/ReportTable";
import { getReportDefinition } from "../../config/reportDefinitions";

/**
 * Generic Report Renderer
 * 
 * Renders any report using configuration from reportDefinitions.js
 * Falls back to custom component if defined
 */
const GenericReportRenderer = ({ reportId, data }) => {
  const definition = getReportDefinition(reportId);
  
  if (!definition) {
    return (
      <div className="report-placeholder">
        <p>Report configuration not found for: {reportId}</p>
      </div>
    );
  }

  // If custom component exists, use it (backward compatibility)
  if (definition.component) {
    const CustomComponent = definition.component;
    return <CustomComponent data={data} />;
  }

  // Otherwise, render generically using chart and table config
  if (!data) {
    return (
      <div className="report-placeholder">
        <p>No data available for: {reportId}</p>
      </div>
    );
  }

  const { chart, table } = definition;

  // Get chart component based on type
  const getChartComponent = (type) => {
    switch (type) {
      case "bar": return Bar;
      case "line": return Line;
      case "pie": return Pie;
      default: return Bar;
    }
  };

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Render Chart */}
      {chart && (
        <ChartContainer height={400} minHeight={400}>
          {(() => {
            const ChartComponent = getChartComponent(chart.type);
            const chartData = chart.getData(data);
            const chartOptions = {
              ...chart.getOptions(""),
              responsive: true,
              maintainAspectRatio: false,
            };
            
            return <ChartComponent data={chartData} options={chartOptions} />;
          })()}
        </ChartContainer>
      )}

      {/* Render Table */}
      {table && (
        <ReportTable 
          columns={table.columns} 
          data={table.getRows(data)} 
        />
      )}

      {/* Fallback if neither chart nor table is configured */}
      {!chart && !table && (
        <div className="report-placeholder">
          <p>No visualization configured for this report</p>
        </div>
      )}
    </div>
  );
};

export default GenericReportRenderer;