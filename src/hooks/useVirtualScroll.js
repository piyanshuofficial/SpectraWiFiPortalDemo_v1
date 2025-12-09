// src/hooks/useVirtualScroll.js
// Virtual scrolling hook for large lists

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Virtual scrolling configuration
 */
const DEFAULT_CONFIG = {
  itemHeight: 60,        // Default item height in pixels
  overscan: 5,           // Number of items to render outside visible area
  threshold: 100         // Threshold for switching to virtual scrolling
};

/**
 * Hook for virtual scrolling
 * Only activates virtual scrolling when item count exceeds threshold
 *
 * @param {Array} items - Array of items to virtualize
 * @param {Object} options - Configuration options
 * @returns {Object} - Virtual scroll state and handlers
 */
export const useVirtualScroll = (items = [], options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  const containerRef = useRef(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Determine if virtual scrolling should be active
  const isVirtualized = items.length > config.threshold;

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (!isVirtualized) return 'auto';
    return items.length * config.itemHeight;
  }, [items.length, config.itemHeight, isVirtualized]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!isVirtualized || containerHeight === 0) {
      return { start: 0, end: items.length };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / config.itemHeight) - config.overscan);
    const visibleCount = Math.ceil(containerHeight / config.itemHeight);
    const endIndex = Math.min(items.length, startIndex + visibleCount + (config.overscan * 2));

    return { start: startIndex, end: endIndex };
  }, [scrollTop, containerHeight, items.length, config.itemHeight, config.overscan, isVirtualized]);

  // Get visible items
  const visibleItems = useMemo(() => {
    if (!isVirtualized) return items;
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange, isVirtualized]);

  // Calculate offset for positioning
  const offsetY = useMemo(() => {
    if (!isVirtualized) return 0;
    return visibleRange.start * config.itemHeight;
  }, [visibleRange.start, config.itemHeight, isVirtualized]);

  // Handle scroll event
  const handleScroll = useCallback((event) => {
    if (isVirtualized) {
      setScrollTop(event.target.scrollTop);
    }
  }, [isVirtualized]);

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Scroll to specific index
  const scrollToIndex = useCallback((index) => {
    const container = containerRef.current;
    if (!container || !isVirtualized) return;

    const targetScrollTop = index * config.itemHeight;
    container.scrollTop = targetScrollTop;
  }, [config.itemHeight, isVirtualized]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  return {
    // Refs
    containerRef,

    // State
    isVirtualized,
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY,

    // Handlers
    handleScroll,
    scrollToIndex,
    scrollToTop,

    // Utilities
    getItemStyle: (index) => ({
      position: isVirtualized ? 'absolute' : 'relative',
      top: isVirtualized ? (visibleRange.start + index) * config.itemHeight : 'auto',
      height: config.itemHeight,
      width: '100%'
    }),

    // Container style
    containerStyle: {
      position: 'relative',
      overflow: 'auto',
      height: '100%'
    },

    // Inner container style (for total height)
    innerStyle: {
      position: 'relative',
      height: isVirtualized ? totalHeight : 'auto',
      width: '100%'
    },

    // Item wrapper style
    itemWrapperStyle: {
      position: isVirtualized ? 'absolute' : 'relative',
      top: isVirtualized ? offsetY : 0,
      left: 0,
      right: 0
    }
  };
};

/**
 * Simple hook for infinite scroll / load more
 */
export const useInfiniteScroll = (loadMore, hasMore, threshold = 200) => {
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  const triggerRef = useCallback((node) => {
    if (loadingRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadingRef.current = true;
          Promise.resolve(loadMore()).finally(() => {
            loadingRef.current = false;
          });
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, [loadMore, hasMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return triggerRef;
};

export default useVirtualScroll;
