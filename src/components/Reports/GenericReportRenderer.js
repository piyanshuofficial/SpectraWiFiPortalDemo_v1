// src/components/Reports/GenericReportRenderer.js

import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Bar, Line, Pie } from "react-chartjs-2";
import ChartContainer from "@components/common/ChartContainer";
import ReportTable from "@components/common/ReportTable";
import Spinner from "@components/Loading/Spinner";
import { getReportDefinition } from "@config/reportDefinitions";

/**
 * Generic Report Renderer
 * 
 * Renders any report using configuration from reportDefinitions.js
 * Falls back to custom component if defined
 * Data is now sourced from centralized userSampleData or siteSampleData
 */
const GenericReportRenderer = ({ reportId, data }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const definition = getReportDefinition(reportId);
  
  useEffect(() => {
    // Simulate data processing/loading
    setLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      if (!data || data.length === 0) {
        setError('No data available for this report');
        setProcessedData(null);
      } else {
        setProcessedData(data);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [data, reportId]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // ========================================
    // TODO: Backend Integration - Retry Data Fetch
    // ========================================
    // In real implementation, this would refetch data from backend
    // 
    // const refetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/reports/${reportId}/data`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ filters: currentFilters })
    //     });
    //     const result = await response.json();
    //     if (result.success) {
    //       setProcessedData(result.data.rows);
    //       setError(null);
    //     }
    //   } catch (err) {
    //     setError('Failed to load report data. Please try again.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // refetchData();
    // ========================================
    
    setTimeout(() => {
      if (data && data.length > 0) {
        setProcessedData(data);
        setError(null);
      }
      setLoading(false);
    }, 500);
  };

  if (!definition) {
    return (
      <div className="report-placeholder" role="alert">
        <p>Report configuration not found for: {reportId}</p>
      </div>
    );
  }

  if (definition.component) {
    const CustomComponent = definition.component;
    return <CustomComponent data={processedData} loading={loading} error={error} />;
  }

  // ========================================
  // TODO: Backend Integration - Fetch Report Data with Filters
  // ========================================
  // Currently receives data as prop from parent component (ReportDashboard)
  // For production, implement server-side filtering and aggregation
  // 
  // This component should trigger data fetch when:
  // 1. Report first loads
  // 2. Criteria/filters change
  // 3. User requests data refresh
  // 
  // Implementation approach:
  // useEffect(() => {
  //   const fetchReportData = async () => {
  //     try {
  //       setLoading(true);
  //       
  //       const response = await fetch('/api/reports/data', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           reportId: reportId,
  //           filters: criteriaFilters, // dateRange, policies, etc.
  //           aggregation: definition.aggregation,
  //           groupBy: definition.groupBy,
  //           orderBy: definition.orderBy
  //         })
  //       });
  //       
  //       const result = await response.json();
  //       
  //       if (result.success) {
  //         setReportData(result.data.rows);
  //         setMetadata(result.data.metadata);
  //       }
  //     } catch (error) {
  //       console.error('Report data fetch error:', error);
  //       setError('Failed to load report data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchReportData();
  // }, [reportId, criteriaFilters]);
  // 
  // Backend Processing:
  // 1. Validate report access permissions
  // 2. Parse and validate filter criteria
  // 3. Build optimized database query with:
  //    - WHERE clauses for filters
  //    - GROUP BY for aggregations
  //    - ORDER BY for sorting
  //    - LIMIT/OFFSET for pagination
  // 4. Execute query against appropriate data source:
  //    - User/session data from UMP database
  //    - Usage data from AAA accounting records
  //    - Network data from monitoring system
  // 5. Post-process results:
  //    - Format dates/times
  //    - Calculate derived metrics
  //    - Apply business logic transformations
  // 6. Return structured response
  // 
  // Response format:
  // {
  //   success: true,
  //   data: {
  //     rows: [...],
  //     metadata: {
  //       totalRows: number,
  //       generatedAt: ISO8601,
  //       filters: {...},
  //       aggregations: {...}
  //     }
  //   }
  // }
  // 
  // Caching Strategy:
  // - Cache report results for 5 minutes (Redis)
  // - Invalidate cache on data updates
  // - Use cache key: `report:${reportId}:${hash(filters)}`
  // ========================================

  const { chart, table } = definition;

  const getChartComponent = (type) => {
    switch (type) {
      case "bar": return Bar;
      case "line": return Line;
      case "pie": return Pie;
      default: return Bar;
    }
  };

  // Prepare table data with proper column alignment detection
  const getColumnAlignment = () => {
    if (!processedData || processedData.length === 0 || !table) return {};
    
    const alignment = {};
    const firstRow = table.getRows(processedData)[0] || [];
    
    firstRow.forEach((value, index) => {
      // First column (usually ID/Date/Month) - center aligned
      if (index === 0) {
        alignment[index] = 'center';
      }
      // Numeric columns - center aligned
      else if (typeof value === 'number' || !isNaN(parseFloat(String(value).replace(/,/g, '')))) {
        alignment[index] = 'center';
      }
      // Default - center aligned
      else {
        alignment[index] = 'center';
      }
    });
    
    return alignment;
  };

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Chart Section */}
      {chart && !loading && !error && processedData && processedData.length > 0 && (
        <ChartContainer height={400} minHeight={400}>
          {(() => {
            const ChartComponent = getChartComponent(chart.type);
            const chartData = chart.getData(processedData);
            const chartOptions = {
              ...chart.getOptions(""),
              responsive: true,
              maintainAspectRatio: false,
            };
            
            return <ChartComponent data={chartData} options={chartOptions} />;
          })()}
        </ChartContainer>
      )}

      {/* Table Section */}
      {table && (
        <div style={{ marginTop: chart ? '2rem' : '0' }}>
          <ReportTable 
            columns={table.columns} 
            data={processedData ? table.getRows(processedData) : []}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            columnAlignment={getColumnAlignment()}
            showPagination={true}
            defaultRowsPerPage={20}
            rowsPerPageOptions={[10, 20, 50, 100]}
            totalRecords={processedData ? processedData.length : 0}
          />
        </div>
      )}

      {/* Fallback for no chart and no table */}
      {!chart && !table && !loading && (
        <div className="report-placeholder" role="status">
          <p>No visualization configured for this report</p>
        </div>
      )}

      {/* Loading state for reports without table (chart only) */}
      {chart && !table && loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
          role="status"
          aria-live="polite"
        >
          <Spinner size="lg" color="primary" />
          <p style={{ margin: 0 }}>Loading report data...</p>
        </div>
      )}

      {/* Error state for reports without table (chart only) */}
      {chart && !table && error && (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#d32f2f'
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>
            Failed to Load Report
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#666' }}>
            {error}
          </p>
          <button 
            onClick={handleRetry}
            className="btn btn-primary"
            type="button"
            style={{
              padding: '8px 16px',
              background: '#204094',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

GenericReportRenderer.propTypes = {
  reportId: PropTypes.string.isRequired,
  data: PropTypes.array,
};

GenericReportRenderer.defaultProps = {
  data: null,
};

export default GenericReportRenderer;