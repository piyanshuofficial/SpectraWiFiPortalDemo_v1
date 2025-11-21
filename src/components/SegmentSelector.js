// src/components/SegmentSelector.js

import React from 'react';
import PropTypes from 'prop-types';
import { useSegment, SEGMENTS, SEGMENT_LABELS } from '@context/SegmentContext';
import './SegmentSelector.css';

/**
 * SegmentSelector Component
 *
 * Testing component for switching between different business segments.
 * This component will be removed in production as each login will have
 * a specific segment value.
 */
const SegmentSelector = ({ showLabel = true }) => {
  const { currentSegment, updateSegment } = useSegment();

  const handleSegmentChange = (e) => {
    updateSegment(e.target.value);
  };

  return (
    <div className="segment-selector-container">
      {showLabel && (
        <label htmlFor="segment-selector" className="segment-label">
          Segment:
        </label>
      )}
      <select
        id="segment-selector"
        value={currentSegment}
        onChange={handleSegmentChange}
        className="segment-dropdown"
        aria-label="Select business segment"
      >
        {Object.entries(SEGMENTS).map(([key, value]) => (
          <option key={value} value={value}>
            {SEGMENT_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
};

SegmentSelector.propTypes = {
  showLabel: PropTypes.bool,
};

export default SegmentSelector;
