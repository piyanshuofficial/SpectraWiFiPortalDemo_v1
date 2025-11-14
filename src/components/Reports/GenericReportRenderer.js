// src/components/Reports/GenericReportRenderer.js

import React from "react";
import PropTypes from 'prop-types';
import { Bar, Line, Pie } from "react-chartjs-2";
import ChartContainer from "@components/common/ChartContainer";
import ReportTable from "@components/common/ReportTable";
import { getReportDefinition } from "@config/reportDefinitions";

/**
 * Generic Report Renderer
 * 
 * Renders any report using configuration from reportDefinitions.js
 * Falls back to custom component if defined
 * Data is now sourced from centralized userSampleData or siteSampleData
 */
const GenericReportRenderer = ({ reportId, data }) => {
  const definition = getReportDefinition(reportId);
  
  if (!definition) {
    return (
      <div className="report-placeholder" role="alert">
        <p>Report configuration not found for: {reportId}</p>
      </div>
    );
  }

  if (definition.component) {
    const CustomComponent = definition.component;
    return <CustomComponent data={data} />;
  }

  if (!data) {
    return (
      <div className="report-placeholder" role="status">
        <p>No data available for: {reportId}</p>
      </div>
    );
  }

  const { chart, table } = definition;

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

      {table && (
        <ReportTable 
          columns={table.columns} 
          data={table.getRows(data)} 
        />
      )}

      {!chart && !table && (
        <div className="report-placeholder" role="status">
          <p>No visualization configured for this report</p>
        </div>
      )}
    </div>
  );
};

GenericReportRenderer.propTypes = {
  reportId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default GenericReportRenderer;