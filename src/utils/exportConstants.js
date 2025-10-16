// src/utils/exportConstants.js
import { CHART } from '../constants/appConstants';

export const EXPORT_CANVAS_SIZES = {
  line: { width: CHART.EXPORT_LINE_WIDTH, height: CHART.EXPORT_LINE_HEIGHT },
  bar: { width: CHART.EXPORT_BAR_WIDTH, height: CHART.EXPORT_BAR_HEIGHT },
  pie: { width: CHART.EXPORT_PIE_SIZE, height: CHART.EXPORT_PIE_SIZE },
};