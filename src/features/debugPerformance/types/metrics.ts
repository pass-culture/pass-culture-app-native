/**
 * Statistical metrics and aggregation types for performance analysis
 */

export interface PerformanceMetrics {
  network: NetworkMetrics
  rendering: RenderMetrics
  list: ListMetrics
  memory: MemoryMetrics
  session: SessionMetrics
}

export interface NetworkMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  responseTimePercentiles: Percentiles
  requestsPerSecond: number
  totalBytesTransferred: number
  cacheHitRate: number
  errorsByType: Record<string, number>
  slowestRequests: Array<{
    url: string
    duration: number
    timestamp: number
  }>
}

export interface RenderMetrics {
  totalRenders: number
  componentsRendered: number
  averageRenderTime: number
  renderTimePercentiles: Percentiles
  slowestRenders: Array<{
    componentName: string
    duration: number
    timestamp: number
  }>
  rendersByPhase: {
    mount: number
    update: number
    unmount: number
  }
  rerendersPerComponent: Record<string, number>
}

export interface ListMetrics {
  totalLists: number
  averageScrollFPS: number
  totalBlankTime: number
  averageBlankTime: number
  blankTimePercentiles: Percentiles
  listsWithBlanks: number
  totalDroppedFrames: number
  averageItemsVisible: number
  memoryEfficiency: number
}

export interface MemoryMetrics {
  peakMemoryUsageMB: number
  averageMemoryUsageMB: number
  memoryGrowthRate: number
  memoryLeaks: Array<{
    component: string
    growthMB: number
    duration: number
  }>
  garbageCollectionEvents: number
}

export interface SessionMetrics {
  duration: number
  activeTime: number
  interactionCount: number
  errorCount: number
  performanceScore: number // 0-100 score based on all metrics
  bottlenecks: Array<{
    type: 'network' | 'render' | 'memory' | 'list'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    timestamp: number
    impact: number
  }>
}

export interface Percentiles {
  p50: number
  p75: number
  p90: number
  p95: number
  p99: number
}

export interface MetricsFilter {
  timeRange?: {
    start: number
    end: number
  }
  component?: string
  requestUrl?: string
  minimumDuration?: number
  errorOnly?: boolean
  performanceThreshold?: {
    renderTime?: number
    responseTime?: number
    memoryUsage?: number
  }
}

export interface AggregationOptions {
  groupBy?: 'component' | 'url' | 'time' | 'error'
  timeInterval?: 'minute' | 'second' | '10s' | '30s'
  includePercentiles?: boolean
  includeBottlenecks?: boolean
  maxResults?: number
}
