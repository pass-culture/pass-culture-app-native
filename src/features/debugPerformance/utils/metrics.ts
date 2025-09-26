/**
 * Statistical metrics calculation utilities for performance analysis
 */

export interface PercentileResult {
  p50: number
  p75: number
  p90: number
  p95: number
  p99: number
}

export interface StatisticalMetrics {
  min: number
  max: number
  avg: number
  median: number
  count: number
  sum: number
  percentiles: PercentileResult
}

export class MetricsCalculator {
  /**
   * Calculate basic statistical metrics from a dataset
   */
  static calculateStats(values: number[]): StatisticalMetrics {
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        count: 0,
        sum: 0,
        percentiles: { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 },
      }
    }

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((acc, val) => acc + val, 0)

    return {
      min: sorted[0] || 0,
      max: sorted[sorted.length - 1] || 0,
      avg: sum / values.length,
      median: this.getMedian(sorted),
      count: values.length,
      sum,
      percentiles: this.calculatePercentiles(sorted),
    }
  }

  /**
   * Calculate percentiles (p50, p75, p90, p95, p99) from sorted array
   */
  static calculatePercentiles(sortedValues: number[]): PercentileResult {
    if (sortedValues.length === 0) {
      return { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 }
    }

    return {
      p50: this.getPercentile(sortedValues, 50),
      p75: this.getPercentile(sortedValues, 75),
      p90: this.getPercentile(sortedValues, 90),
      p95: this.getPercentile(sortedValues, 95),
      p99: this.getPercentile(sortedValues, 99),
    }
  }

  /**
   * Get specific percentile from sorted array
   */
  static getPercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0
    if (sortedValues.length === 1) return sortedValues[0] || 0

    const index = (percentile / 100) * (sortedValues.length - 1)

    if (Math.floor(index) === index) {
      return sortedValues[index] || 0
    }

    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index - lower

    return (sortedValues[lower] || 0) * (1 - weight) + (sortedValues[upper] || 0) * weight
  }

  /**
   * Get median from sorted array
   */
  static getMedian(sortedValues: number[]): number {
    if (sortedValues.length === 0) return 0

    const mid = Math.floor(sortedValues.length / 2)

    if (sortedValues.length % 2 === 0) {
      return ((sortedValues[mid - 1] || 0) + (sortedValues[mid] || 0)) / 2
    }

    return sortedValues[mid] || 0
  }

  /**
   * Calculate moving average for streaming data
   */
  static calculateMovingAverage(values: number[], windowSize: number): number[] {
    if (values.length === 0 || windowSize <= 0) return []

    const result: number[] = []

    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = values.slice(start, i + 1)
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length
      result.push(avg)
    }

    return result
  }

  /**
   * Calculate standard deviation
   */
  static calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map((val) => Math.pow(val - avg, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length

    return Math.sqrt(avgSquaredDiff)
  }
}

/**
 * Streaming metrics calculator for real-time data
 * Efficiently calculates statistics without storing all values
 */
export class StreamingMetrics {
  private count = 0
  private sum = 0
  private sumSquares = 0
  private min = Infinity
  private max = -Infinity
  private recentValues: number[] = []
  private readonly maxRecentValues: number

  constructor(maxRecentValues = 1000) {
    this.maxRecentValues = maxRecentValues
  }

  /**
   * Add a new value to the streaming metrics
   */
  addValue(value: number): void {
    this.count++
    this.sum += value
    this.sumSquares += value * value
    this.min = Math.min(this.min, value)
    this.max = Math.max(this.max, value)

    // Maintain recent values for percentile calculations
    this.recentValues.push(value)
    if (this.recentValues.length > this.maxRecentValues) {
      this.recentValues.shift()
    }
  }

  /**
   * Get current metrics without full dataset
   */
  getMetrics(): StatisticalMetrics {
    if (this.count === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        count: 0,
        sum: 0,
        percentiles: { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 },
      }
    }

    const avg = this.sum / this.count
    const sortedRecent = [...this.recentValues].sort((a, b) => a - b)

    return {
      min: this.min,
      max: this.max,
      avg,
      median: MetricsCalculator.getMedian(sortedRecent),
      count: this.count,
      sum: this.sum,
      percentiles: MetricsCalculator.calculatePercentiles(sortedRecent),
    }
  }

  /**
   * Get standard deviation
   */
  getStandardDeviation(): number {
    if (this.count === 0) return 0

    const avg = this.sum / this.count
    const variance = this.sumSquares / this.count - avg * avg
    return Math.sqrt(Math.max(0, variance))
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.count = 0
    this.sum = 0
    this.sumSquares = 0
    this.min = Infinity
    this.max = -Infinity
    this.recentValues = []
  }

  /**
   * Get current count
   */
  getCount(): number {
    return this.count
  }
}

/**
 * Utility functions for network-specific metrics
 */
export class NetworkMetricsUtils {
  /**
   * Calculate requests per second from timestamps
   */
  static calculateRequestsPerSecond(timestamps: number[], windowMs = 1000): number {
    if (timestamps.length === 0) return 0

    const now = Date.now()
    const windowStart = now - windowMs
    const recentRequests = timestamps.filter((ts) => ts >= windowStart)

    return recentRequests.length / (windowMs / 1000)
  }

  /**
   * Calculate cache hit rate
   */
  static calculateCacheHitRate(totalRequests: number, cacheHits: number): number {
    if (totalRequests === 0) return 0
    return (cacheHits / totalRequests) * 100
  }

  /**
   * Categorize response times into buckets
   */
  static categorizeResponseTimes(responseTimes: number[]): {
    fast: number // < 100ms
    moderate: number // 100-500ms
    slow: number // 500-2000ms
    verySlow: number // > 2000ms
  } {
    const buckets = { fast: 0, moderate: 0, slow: 0, verySlow: 0 }

    responseTimes.forEach((time) => {
      if (time < 100) buckets.fast++
      else if (time < 500) buckets.moderate++
      else if (time < 2000) buckets.slow++
      else buckets.verySlow++
    })

    return buckets
  }

  /**
   * Calculate bandwidth utilization
   */
  static calculateBandwidthMBps(totalBytes: number, durationMs: number): number {
    if (durationMs === 0) return 0
    const durationSeconds = durationMs / 1000
    const megabytes = totalBytes / (1024 * 1024)
    return megabytes / durationSeconds
  }
}
