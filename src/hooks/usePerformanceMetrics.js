import { useState, useEffect, useCallback } from "react";

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    loadTimes: [],
    errors: 0,
  });

  // Track API calls
  const trackApiCall = useCallback((url, duration, success = true) => {
    setMetrics((prev) => ({
      ...prev,
      apiCalls: prev.apiCalls + 1,
      loadTimes: [...prev.loadTimes, duration].slice(-10), // Keep last 10
      errors: success ? prev.errors : prev.errors + 1,
    }));
  }, []);

  // Track cache hits/misses
  const trackCacheHit = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      cacheHits: prev.cacheHits + 1,
    }));
  }, []);

  const trackCacheMiss = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      cacheMisses: prev.cacheMisses + 1,
    }));
  }, []);

  // Calculate cache hit rate
  const cacheHitRate =
    metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) || 0;

  // Calculate average load time
  const averageLoadTime =
    metrics.loadTimes.length > 0
      ? metrics.loadTimes.reduce((a, b) => a + b, 0) / metrics.loadTimes.length
      : 0;

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      loadTimes: [],
      errors: 0,
    });
  }, []);

  // Export metrics for debugging
  const exportMetrics = useCallback(() => {
    return {
      ...metrics,
      cacheHitRate: cacheHitRate.toFixed(2),
      averageLoadTime: averageLoadTime.toFixed(2),
      timestamp: new Date().toISOString(),
    };
  }, [metrics, cacheHitRate, averageLoadTime]);

  // Log metrics to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(() => {
        console.log("Performance Metrics:", exportMetrics());
      }, 30000); // Log every 30 seconds

      return () => clearInterval(interval);
    }
  }, [exportMetrics]);

  return {
    metrics,
    trackApiCall,
    trackCacheHit,
    trackCacheMiss,
    cacheHitRate,
    averageLoadTime,
    resetMetrics,
    exportMetrics,
  };
};
