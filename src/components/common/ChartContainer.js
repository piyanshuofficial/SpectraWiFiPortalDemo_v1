// src/components/common/ChartContainer.js

import React from "react";
import { chartContainerStyle } from "../../styles/reportStyles";

const ChartContainer = ({ children }) => (
  <div style={chartContainerStyle}>
    {children}
  </div>
);

export default ChartContainer;
