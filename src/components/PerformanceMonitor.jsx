import React, { useState, useEffect } from "react";
import { Activity, Zap, Clock, Database } from "lucide-react";

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
    apiCalls: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    // Measure memory usage
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = Math.round(
          performance.memory.usedJSHeapSize / 1024 / 1024
        );
        setMetrics((prev) => ({ ...prev, memory }));
      }
    };

    // Measure page load time
    const measureLoadTime = () => {
      const loadTime = Math.round(
        performance.timing.loadEventEnd - performance.timing.navigationStart
      );
      setMetrics((prev) => ({ ...prev, loadTime }));
    };

    // Start measurements
    measureFPS();
    measureMemory();
    measureLoadTime();

    const interval = setInterval(measureMemory, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg z-50 font-mono text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={16} />
        <span className="font-bold">Performance Monitor</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Zap size={12} />
          <span>FPS: {metrics.fps}</span>
        </div>

        <div className="flex items-center gap-2">
          <Database size={12} />
          <span>Memory: {metrics.memory}MB</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>Load: {metrics.loadTime}ms</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity size={12} />
          <span>API Calls: {metrics.apiCalls}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
