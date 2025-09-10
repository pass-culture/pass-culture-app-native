import { logger } from '../utils/logger'
/**
 * Cross-platform performance timing utilities
 * Handles differences between web and React Native mobile platforms
 */

// Check if we're in React Native environment
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

// Check if performance.now() is actually available
const hasPerformanceNow =
  typeof performance !== 'undefined' && typeof performance.now === 'function'

let performanceNow: () => number
let timingMethod = 'unknown'

// Priority order for React Native timing methods:
// 1. react-native-performance (best precision)
// 2. Global performance.now() (if available in RN)
// 3. Date.now() (fallback)

if (isReactNative) {
  let timingResolved = false

  // First try: react-native-performance package (most precise)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { performance: rnPerf } = require('react-native-performance')
    if (rnPerf && typeof rnPerf.now === 'function') {
      performanceNow = () => rnPerf.now()
      timingMethod = 'react-native-performance'
      timingResolved = true
      logger.debug('✅ Using react-native-performance package (high precision)')
    }
  } catch (error) {
    logger.debug(
      '❌ react-native-performance package not available:',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }

  // Second try: Check if global performance is available in React Native
  if (!timingResolved && hasPerformanceNow) {
    try {
      const testTime = performance.now()
      if (typeof testTime === 'number' && testTime > 0) {
        performanceNow = () => performance.now()
        timingMethod = 'global-performance-rn'
        timingResolved = true
        logger.debug('✅ Using global performance.now() in React Native')
      }
    } catch (error) {
      logger.debug(
        '❌ Global performance.now() not working in React Native:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  // Third try: React Native's built-in high-resolution timer
  if (!timingResolved) {
    try {
      // React Native has performance.now() in some versions/platforms
      // Or we can try process.hrtime (Node.js style) if available
      if (typeof process !== 'undefined' && process.hrtime) {
        const startTime = process.hrtime()
        performanceNow = () => {
          const [seconds, nanoseconds] = process.hrtime(startTime)
          return seconds * 1000 + nanoseconds / 1000000
        }
        timingMethod = 'process-hrtime'
        timingResolved = true
        logger.debug('✅ Using process.hrtime() for high precision timing')
      }
    } catch (error) {
      logger.debug(
        '❌ process.hrtime() not available:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  // Fallback: Date.now()
  if (!timingResolved) {
    performanceNow = () => Date.now()
    timingMethod = 'date-now-fallback'
    logger.debug('⚠️ Using Date.now() fallback (lower precision)')
  }
} else if (hasPerformanceNow) {
  // Web environment with performance.now() available
  performanceNow = () => performance.now()
  timingMethod = 'web-performance'
  logger.debug('✅ Using standard web performance.now()')
} else {
  // No performance.now() available, use Date.now()
  performanceNow = () => Date.now()
  timingMethod = 'date-now-web-fallback'
  logger.debug('⚠️ performance.now() not available, using Date.now() fallback')
}

/**
 * Cross-platform high-resolution time measurement
 * Returns time in milliseconds with fractional precision when available
 */
export const now = (): number => {
  try {
    return performanceNow()
  } catch (error) {
    logger.debug('Performance timing error, falling back to Date.now():', error)
    return Date.now()
  }
}

/**
 * Measure execution time of a function
 */
export const measure = <T>(fn: () => T, label?: string): { result: T; duration: number } => {
  const start = now()
  const result = fn()
  const duration = now() - start

  if (label) {
    logger.verbose(`⏱️ ${label} took ${duration.toFixed(2)}ms`)
  }

  return { result, duration }
}

/**
 * Create a timer that can be started and stopped
 */
export class Timer {
  private startTime = 0
  private endTime = 0
  private isRunning = false

  start(): void {
    this.startTime = now()
    this.isRunning = true
  }

  stop(): number {
    if (!this.isRunning) {
      throw new Error('Timer not started')
    }

    this.endTime = now()
    this.isRunning = false
    return this.getDuration()
  }

  getDuration(): number {
    if (this.isRunning) {
      return now() - this.startTime
    }
    return this.endTime - this.startTime
  }

  reset(): void {
    this.startTime = 0
    this.endTime = 0
    this.isRunning = false
  }
}

/**
 * Platform information for debugging
 */
export const getPlatformInfo = () => ({
  isReactNative,
  hasPerformanceAPI: hasPerformanceNow,
  timingMethod,
  timingSource: timingMethod,
  precision: (() => {
    switch (timingMethod) {
      case 'react-native-performance':
      case 'global-performance-rn':
      case 'web-performance':
        return 'sub-millisecond (high precision)'
      case 'process-hrtime':
        return 'nanosecond (ultra high precision)'
      case 'date-now-fallback':
      case 'date-now-web-fallback':
        return 'millisecond (low precision)'
      default:
        return 'unknown'
    }
  })(),
  capabilities: {
    microBenchmarking: [
      'react-native-performance',
      'global-performance-rn',
      'web-performance',
      'process-hrtime',
    ].includes(timingMethod),
    networkTiming: true,
    renderTiming: true,
    memoryTracking: timingMethod !== 'date-now-fallback',
  },
})

/**
 * Test timing precision by measuring short intervals
 */
export const testTimingPrecision = (): {
  method: string
  precision: string
  testResults: {
    shortInterval: number
    mediumInterval: number
    resolution: number
  }
} => {
  const results: number[] = []

  // Test timing resolution
  for (let i = 0; i < 10; i++) {
    const start = now()
    // Very short busy wait
    const target = start + 0.1
    while (now() < target) {
      // Busy wait
    }
    const end = now()
    results.push(end - start)
  }

  const avgShortInterval = results.reduce((a, b) => a + b, 0) / results.length

  // Test medium interval
  const mediumStart = now()
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }, 1) // 1ms timeout
  const mediumEnd = now()
  const mediumInterval = mediumEnd - mediumStart

  // Calculate resolution (smallest measurable difference)
  const resolution = Math.min(...results.filter((r) => r > 0))

  return {
    method: timingMethod,
    precision: getPlatformInfo().precision,
    testResults: {
      shortInterval: Number(avgShortInterval.toFixed(6)),
      mediumInterval: Number(mediumInterval.toFixed(6)),
      resolution: Number(resolution.toFixed(6)),
    },
  }
}
