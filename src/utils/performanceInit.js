// Initialize performance metrics globally
export const initializePerformanceMetrics = () => {
  if (typeof window !== "undefined") {
    // Create a simple metrics object
    const metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      loadTimes: [],
      errors: 0,

      trackApiCall: (url, duration, success = true) => {
        metrics.apiCalls++;
        metrics.loadTimes.push(duration);
        if (metrics.loadTimes.length > 10) {
          metrics.loadTimes.shift();
        }
        if (!success) metrics.errors++;
      },

      trackCacheHit: () => {
        metrics.cacheHits++;
      },

      trackCacheMiss: () => {
        metrics.cacheMisses++;
      },

      resetMetrics: () => {
        metrics.apiCalls = 0;
        metrics.cacheHits = 0;
        metrics.cacheMisses = 0;
        metrics.loadTimes = [];
        metrics.errors = 0;
      },

      exportMetrics: () => ({
        apiCalls: metrics.apiCalls,
        cacheHits: metrics.cacheHits,
        cacheMisses: metrics.cacheMisses,
        cacheHitRate:
          metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) || 0,
        averageLoadTime:
          metrics.loadTimes.length > 0
            ? metrics.loadTimes.reduce((a, b) => a + b, 0) /
              metrics.loadTimes.length
            : 0,
        errors: metrics.errors,
        timestamp: new Date().toISOString(),
      }),
    };

    window.performanceMetrics = metrics;

    // Log initialization
    console.log("🚀 Performance metrics initialized");

    // Expose metrics for debugging
    if (process.env.NODE_ENV === "development") {
      window.debugMetrics = () => {
        console.log("📊 Performance Metrics:", metrics.exportMetrics());
      };

      // Auto-log metrics every 30 seconds in development
      setInterval(() => {
        console.log("📊 Performance Metrics:", metrics.exportMetrics());
      }, 30000);
    }
  }
};

// Cleanup function
export const cleanupPerformanceMetrics = () => {
  if (typeof window !== "undefined" && window.performanceMetrics) {
    window.performanceMetrics.resetMetrics();
    delete window.performanceMetrics;
    delete window.debugMetrics;
  }
};
