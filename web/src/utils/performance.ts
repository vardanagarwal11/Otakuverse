interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export const trackPerformanceMetric = (metric: PerformanceMetric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metric:', metric);
  }
};

export const measureExecutionTime = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    trackPerformanceMetric({
      name,
      value: duration,
      tags: { type: 'execution_time' },
    });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    trackPerformanceMetric({
      name: `${name}_error`,
      value: duration,
      tags: { type: 'execution_time', error: error instanceof Error ? error.message : 'Unknown error' },
    });
    throw error;
  }
};

export const trackComponentRender = (componentName: string, renderTime: number) => {
  trackPerformanceMetric({
    name: 'component_render',
    value: renderTime,
    tags: { component: componentName },
  });
};

export const trackApiPerformance = (endpoint: string, duration: number, status: number) => {
  trackPerformanceMetric({
    name: 'api_request',
    value: duration,
    tags: { endpoint, status: status.toString() },
  });
};

export const trackImageLoad = (imageUrl: string, loadTime: number) => {
  trackPerformanceMetric({
    name: 'image_load',
    value: loadTime,
    tags: { url: imageUrl },
  });
};

export const trackRouteChange = (from: string, to: string, duration: number) => {
  trackPerformanceMetric({
    name: 'route_change',
    value: duration,
    tags: { from, to },
  });
};

export const trackMemoryUsage = () => {
  const performance = window.performance as ExtendedPerformance;
  if (performance.memory) {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    trackPerformanceMetric({
      name: 'memory_usage',
      value: usedJSHeapSize,
      tags: {
        total: totalJSHeapSize.toString(),
        limit: jsHeapSizeLimit.toString(),
      },
    });
  }
};

export const trackLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          trackPerformanceMetric({
            name: 'long_task',
            value: entry.duration,
            tags: { name: entry.name },
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }
};

export const initializePerformanceMonitoring = () => {
  setInterval(trackMemoryUsage, 60000);
  trackLongTasks();
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    trackPerformanceMetric({
      name: 'page_load',
      value: loadTime,
      tags: { type: 'initial_load' },
    });
  }
}; 