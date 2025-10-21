// src/utils/generateChartImage.js

/**
 * Generate base64 image from Chart.js chart data
 * Used for PDF export functionality
 * 
 * Chart.js components are registered globally in src/config/chartConfig.js
 * 
 * CHANGELOG:
 * - Replaced fixed 1000ms timeout with event-based rendering detection
 * - Added proper error handling and cleanup
 * - Implements progressive timeout fallback for safety
 * - Uses Chart.js animation complete callback
 */

import { Chart } from '../config/chartConfig';

/**
 * Wait for chart to complete rendering using animation callbacks
 * @param {Chart} chart - Chart.js instance
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds
 * @returns {Promise<void>}
 */
function waitForChartRender(chart, maxWaitTime = 3000) {
  return new Promise((resolve, reject) => {
    let isResolved = false;
    let timeoutId = null;

    // Safety timeout - fallback if animation callback never fires
    timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn('Chart rendering fallback: timeout reached, proceeding with current state');
        resolve();
      }
    }, maxWaitTime);

    // Primary method: Use Chart.js animation complete callback
    if (chart.options.animation === false) {
      // If animations are disabled, chart is immediately ready
      clearTimeout(timeoutId);
      isResolved = true;
      resolve();
    } else {
      // Wait for animation to complete
      const originalOnComplete = chart.options.animation?.onComplete;
      
      chart.options.animation = {
        ...chart.options.animation,
        onComplete: function(animation) {
          // Call original callback if it existed
          if (originalOnComplete && typeof originalOnComplete === 'function') {
            originalOnComplete.call(this, animation);
          }
          
          // Resolve our promise
          if (!isResolved) {
            clearTimeout(timeoutId);
            isResolved = true;
            resolve();
          }
        }
      };

      // Force chart update to trigger animation
      chart.update('none'); // 'none' mode = immediate update
    }
  });
}

/**
 * Generate a chart image for PDF export with event-based rendering
 * @param {object} data - Chart.js data object
 * @param {object} options - Chart.js options object
 * @param {number} width - Canvas width in pixels (default: 900)
 * @param {number} height - Canvas height in pixels (default: 450)
 * @returns {Promise<string>} Base64 encoded image
 */
export async function generateChartImage(data, options, width = 900, height = 450) {
  return new Promise(async (resolve, reject) => {

    //  Detect mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    //  Reduce dimensions for mobile to prevent memory issues
    const mobileWidth = isMobile ? Math.min(width, 600) : width;
    const mobileHeight = isMobile ? Math.min(height, 400) : height;
    
    const canvas = document.createElement("canvas");
    canvas.width = mobileWidth;
    canvas.height = mobileHeight;
    
    // Temporarily add to DOM (required for proper rendering)
    canvas.style.position = 'absolute';
    canvas.style.left = '-9999px';
    canvas.style.top = '-9999px';
    document.body.appendChild(canvas);

    let chart = null;

    try {
      // Ensure animations are enabled but fast for export
      const exportOptions = {
        ...options,
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // Instant rendering for export
          ...(options.animation || {})
        },
        // Reduce complexity for mobile
        devicePixelRatio: isMobile ? 1 : 2,
      };

      // Create chart instance
      chart = new Chart(canvas, {
        type: options.type || "line",
        data,
        options: exportOptions,
      });

       // Wait for chart to complete rendering
      await waitForChartRender(chart, isMobile ? 5000 : 3000); // Longer timeout for mobile

      // Small additional delay to ensure DOM paint is complete
      await new Promise(resolveDelay => setTimeout(resolveDelay, isMobile ? 200 : 100)); // Longer delay for mobile


      // Generate image with lower quality for mobile
      const imageQuality = isMobile ? 0.8 : 1.0; // Reduced quality for mobile
      const base64Image = canvas.toDataURL("image/png", imageQuality);

      // Validate image generation
      if (!base64Image || base64Image === 'data:,') {
        throw new Error('Failed to generate chart image: empty data URL');
      }

      resolve(base64Image);

    } catch (error) {
      console.error('Chart image generation error:', error);
      reject(new Error(`Failed to generate chart image: ${error.message}`));
    } finally {
      // Cleanup: destroy chart and remove canvas
      try {
        if (chart) {
          chart.destroy();
        }
      } catch (destroyError) {
        console.warn('Chart destroy error:', destroyError);
      }

      try {
        if (canvas.parentNode) {
          document.body.removeChild(canvas);
        }
      } catch (removeError) {
        console.warn('Canvas removal error:', removeError);
      }
    }
  });
}

/**
 * Generate multiple chart images concurrently
 * Useful for batch PDF generation
 * @param {Array<object>} charts - Array of {data, options, width, height}
 * @returns {Promise<Array<string>>} Array of base64 images
 */
export async function generateChartImages(charts) {
  try {
    const imagePromises = charts.map(({ data, options, width, height }) =>
      generateChartImage(data, options, width, height)
    );
    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Batch chart generation error:', error);
    throw error;
  }
}

/**
 * Generate chart image with retry logic
 * @param {object} data - Chart.js data object
 * @param {object} options - Chart.js options object
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} maxRetries - Maximum retry attempts (default: 2)
 * @returns {Promise<string>} Base64 encoded image
 */
export async function generateChartImageWithRetry(
  data, 
  options, 
  width = 900, 
  height = 450, 
  maxRetries = 2
) {
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Chart generation retry attempt ${attempt}/${maxRetries}`);
      }
      return await generateChartImage(data, options, width, height);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)));
      }
    }
  }
  
  throw new Error(
    `Failed to generate chart after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

export default generateChartImage;