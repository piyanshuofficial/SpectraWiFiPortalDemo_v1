// src/components/common/ChartContainer.js

import React from "react";
import PropTypes from 'prop-types';
import { chartContainerStyle } from "../../styles/reportStyles";

const ChartContainer = ({ children, minHeight = 400, height = 400 }) => (
  <div style={{
    ...chartContainerStyle,
    minHeight: minHeight,
    height: height,
    position: 'relative',
    width: '100%'
  }}>
    {children}
  </div>
);

ChartContainer.propTypes = {
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.number,
  height: PropTypes.number,
};

ChartContainer.defaultProps = {
  minHeight: 400,
  height: 400,
};

export default ChartContainer;