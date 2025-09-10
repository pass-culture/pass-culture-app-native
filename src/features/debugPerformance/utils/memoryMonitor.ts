import { Platform, NativeModules } from 'react-native'

import { logger } from '../utils/logger'

import { safeExecute, safeExecuteAsync } from './errorHandler'

export interface MemoryInfo {
  totalMemoryMB: number
  usedMemoryMB: number
  availableMemoryMB: number
  timestamp: number
}

export interface JSMemoryInfo {
  usedJSHeapSizeMB: number
  totalJSHeapSizeMB: number
  jsHeapSizeLimitMB: number
  timestamp: number
}

class MemoryMonitor {
  private static instance: MemoryMonitor
  private lastMemorySnapshot?: MemoryInfo
  private jsMemorySnapshots: JSMemoryInfo[] = []
  private maxSnapshots = 100

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor()
    }
    return MemoryMonitor.instance
  }

  /**
   * Get current memory usage information
   */
  async getCurrentMemoryInfo(): Promise<MemoryInfo | null> {
    return safeExecute(
      async () => {
        const memoryInfo: MemoryInfo = {
          totalMemoryMB: 0,
          usedMemoryMB: 0,
          availableMemoryMB: 0,
          timestamp: Date.now(),
        }

        // Try platform-specific memory APIs
        if (Platform.OS === 'ios') {
          memoryInfo.usedMemoryMB = await this.getIOSMemoryUsage()
        } else if (Platform.OS === 'android') {
          memoryInfo.usedMemoryMB = await this.getAndroidMemoryUsage()
        }

        // Fallback to performance.memory if available (web/development)
        if (memoryInfo.usedMemoryMB === 0) {
          const jsMemoryInfo = this.getJSMemoryUsage()
          if (jsMemoryInfo) {
            memoryInfo.usedMemoryMB = jsMemoryInfo.usedJSHeapSizeMB
            memoryInfo.totalMemoryMB = jsMemoryInfo.totalJSHeapSizeMB
            memoryInfo.availableMemoryMB =
              jsMemoryInfo.totalJSHeapSizeMB - jsMemoryInfo.usedJSHeapSizeMB
          }
        }

        this.lastMemorySnapshot = memoryInfo
        return memoryInfo
      },
      'MemoryMonitor.getCurrentMemoryInfo',
      null
    ) as Promise<MemoryInfo | null>
  }

  /**
   * Get JS heap memory usage if available
   */
  getJSMemoryUsage(): JSMemoryInfo | null {
    return safeExecute(
      () => {
        if (typeof performance !== 'undefined' && 'memory' in performance) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const memory = (performance as any).memory
          const jsMemoryInfo: JSMemoryInfo = {
            usedJSHeapSizeMB: Math.round((memory.usedJSHeapSize / (1024 * 1024)) * 100) / 100,
            totalJSHeapSizeMB: Math.round((memory.totalJSHeapSize / (1024 * 1024)) * 100) / 100,
            jsHeapSizeLimitMB: Math.round((memory.jsHeapSizeLimit / (1024 * 1024)) * 100) / 100,
            timestamp: Date.now(),
          }

          // Store snapshot
          this.jsMemorySnapshots.push(jsMemoryInfo)
          if (this.jsMemorySnapshots.length > this.maxSnapshots) {
            this.jsMemorySnapshots = this.jsMemorySnapshots.slice(-this.maxSnapshots / 2)
          }

          return jsMemoryInfo
        }
        return null
      },
      'MemoryMonitor.getJSMemoryUsage',
      null
    ) as JSMemoryInfo | null
  }

  /**
   * Get iOS-specific memory usage
   */
  private async getIOSMemoryUsage(): Promise<number> {
    return safeExecuteAsync(
      async () => {
        // For iOS, we would need a native module to get accurate memory info
        // This is a placeholder implementation
        if (__DEV__ && NativeModules.MemoryInfo) {
          try {
            const memoryInfo = await NativeModules.MemoryInfo.getCurrentMemoryUsage()
            return Math.round((memoryInfo.physicalMemoryUsage / (1024 * 1024)) * 100) / 100
          } catch (error) {
            logger.debug('[MemoryMonitor] Failed to get iOS memory info:', error)
          }
        }

        // Fallback estimation based on JS memory if native module not available
        const jsMemory = this.getJSMemoryUsage()
        return jsMemory ? jsMemory.usedJSHeapSizeMB * 1.5 : 0 // Rough estimate
      },
      'MemoryMonitor.getIOSMemoryUsage',
      0
    ) as Promise<number>
  }

  /**
   * Get Android-specific memory usage
   */
  private async getAndroidMemoryUsage(): Promise<number> {
    return safeExecuteAsync(
      async () => {
        // For Android, we would need a native module or bridge to get accurate memory info
        // This is a placeholder implementation
        if (__DEV__ && NativeModules.MemoryInfo) {
          try {
            const memoryInfo = await NativeModules.MemoryInfo.getCurrentMemoryUsage()
            return Math.round((memoryInfo.usedMemory / (1024 * 1024)) * 100) / 100
          } catch (error) {
            logger.debug('[MemoryMonitor] Failed to get Android memory info:', error)
          }
        }

        // Fallback estimation based on JS memory if native module not available
        const jsMemory = this.getJSMemoryUsage()
        return jsMemory ? jsMemory.usedJSHeapSizeMB * 1.3 : 0 // Rough estimate
      },
      'MemoryMonitor.getAndroidMemoryUsage',
      0
    ) as Promise<number>
  }

  /**
   * Calculate memory usage difference since last snapshot
   */
  getMemoryUsageDelta(): number {
    return safeExecute(
      () => {
        if (!this.lastMemorySnapshot) {
          return 0
        }

        const current = this.getCurrentMemoryInfo()
        return current
          ? current.then((info) =>
              info ? info.usedMemoryMB - (this.lastMemorySnapshot?.usedMemoryMB ?? 0) : 0
            )
          : 0
      },
      'MemoryMonitor.getMemoryUsageDelta',
      0
    ) as number
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    current: number
    peak: number
    average: number
    samples: number
  } {
    return safeExecute(
      () => {
        if (this.jsMemorySnapshots.length === 0) {
          return { current: 0, peak: 0, average: 0, samples: 0 }
        }

        const memoryValues = this.jsMemorySnapshots.map((s) => s.usedJSHeapSizeMB)
        const current = memoryValues[memoryValues.length - 1] || 0
        const peak = Math.max(...memoryValues)
        const average = memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length

        return {
          current: Math.round(current * 100) / 100,
          peak: Math.round(peak * 100) / 100,
          average: Math.round(average * 100) / 100,
          samples: this.jsMemorySnapshots.length,
        }
      },
      'MemoryMonitor.getMemoryStats',
      { current: 0, peak: 0, average: 0, samples: 0 }
    ) as { current: number; peak: number; average: number; samples: number }
  }

  /**
   * Monitor memory usage during a specific operation
   */
  async monitorOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{
    result: T
    memoryDelta: number
    peakMemoryDuring: number
  }> {
    const startMemory = await this.getCurrentMemoryInfo()
    const startPeak = this.getMemoryStats().peak

    const result = await operation()

    const endMemory = await this.getCurrentMemoryInfo()
    const endPeak = this.getMemoryStats().peak

    const memoryDelta =
      startMemory && endMemory ? endMemory.usedMemoryMB - startMemory.usedMemoryMB : 0

    const peakMemoryDuring = endPeak - startPeak

    if (__DEV__) {
      logger.verbose(
        `[MemoryMonitor] ${operationName}: ${memoryDelta.toFixed(2)}MB delta, ${peakMemoryDuring.toFixed(2)}MB peak during operation`
      )
    }

    return {
      result,
      memoryDelta,
      peakMemoryDuring,
    }
  }

  /**
   * Clear memory snapshots
   */
  clearSnapshots(): void {
    safeExecute(() => {
      this.jsMemorySnapshots = []
      this.lastMemorySnapshot = undefined
    }, 'MemoryMonitor.clearSnapshots')
  }

  /**
   * Start continuous memory monitoring
   */
  startContinuousMonitoring(intervalMs = 5000): NodeJS.Timeout {
    const intervalId = setInterval(() => {
      safeExecute(() => {
        this.getCurrentMemoryInfo()
        this.getJSMemoryUsage()
      }, 'MemoryMonitor.continuousMonitoring')
    }, intervalMs)

    return intervalId
  }

  /**
   * Stop continuous memory monitoring
   */
  stopContinuousMonitoring(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId)
  }
}

// Export singleton instance
export const memoryMonitor = MemoryMonitor.getInstance()

// Export convenient functions
export const getCurrentMemoryInfo = () => memoryMonitor.getCurrentMemoryInfo()
export const getJSMemoryUsage = () => memoryMonitor.getJSMemoryUsage()
export const getMemoryStats = () => memoryMonitor.getMemoryStats()
export const monitorOperation = memoryMonitor.monitorOperation.bind(memoryMonitor)
export const clearMemorySnapshots = () => memoryMonitor.clearSnapshots()
