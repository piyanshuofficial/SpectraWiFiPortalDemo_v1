// src/components/common/ChartContainer.js

import React from "react";
import { chartContainerStyle } from "../../styles/reportStyles";

const ChartContainer = ({ children, minHeight = 200 }) => (
  <div style={{
    ...chartContainerStyle,
    minHeight: minHeight
  }}>
    {children}
  </div>
);

export default ChartContainer;
