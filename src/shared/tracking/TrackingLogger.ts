/**
 * 🏗️ Advanced Logging System for Tracking
 *
 * This service centralizes all tracking system logs to facilitate
 * debugging and migration validation.
 */

interface LogContext {
  pageId?: string
  moduleId?: string
  event?: string
  timestamp?: string
  [key: string]: unknown
}

type LogLevel = 'INFO' | 'DEBUG' | 'ERROR' | 'PERF'

interface LogEntry {
  level: LogLevel
  category: string
  context: LogContext
  timestamp: string
}

class TrackingLoggerService {
  private static instance: TrackingLoggerService
  private isEnabled = false
  private logs: LogEntry[] = []
  private readonly MAX_LOGS = 1000

  static getInstance(): TrackingLoggerService {
    if (!TrackingLoggerService.instance) {
      TrackingLoggerService.instance = new TrackingLoggerService()
    }
    return TrackingLoggerService.instance
  }

  configure(enabled: boolean) {
    this.isEnabled = enabled
    this.log('INFO', 'LOGGER_CONFIG', { enabled })
  }

  info(category: string, context: LogContext = {}) {
    this.log('INFO', category, context)
  }

  debug(category: string, context: LogContext = {}) {
    this.log('DEBUG', category, context)
  }

  error(category: string, context: LogContext = {}) {
    this.log('ERROR', category, context)
  }

  perf(category: string, duration: number, context: LogContext = {}) {
    this.log('PERF', category, { ...context, duration: `${duration.toFixed(1)}ms` })
  }

  private log(level: LogLevel, category: string, context: LogContext) {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const entry: LogEntry = {
      level,
      category,
      context: { ...context, timestamp },
      timestamp,
    }

    // Store for inspection
    this.logs.push(entry)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS + 100) // Keep some buffer
    }

    // Console output with colors (only in DEV)
    if (__DEV__) {
      const emoji = this.getEmoji(level)
      const color = this.getConsoleMethod(level)

      color(`${emoji} [TRACKING:${category}]`, {
        timestamp,
        ...context,
      })
    }
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case 'INFO':
        return '🔵'
      case 'DEBUG':
        return '🟡'
      case 'ERROR':
        return '🔴'
      case 'PERF':
        return '⚡'
      default:
        return '🔵'
    }
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case 'ERROR':
        // eslint-disable-next-line no-console
        return console.error
      case 'DEBUG':
        // eslint-disable-next-line no-console
        return console.log
      case 'INFO':
        // eslint-disable-next-line no-console
        return console.log
      case 'PERF':
        // eslint-disable-next-line no-console
        return console.log
      default:
        // eslint-disable-next-line no-console
        return console.log
    }
  }

  // Runtime inspection API
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter((log) => log.category === category)
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  clearLogs() {
    this.logs = []
    this.info('LOGS_CLEARED', { previousCount: this.logs.length })
  }

  // Helper pour mesurer les performances
  time<T>(category: string, fn: () => T, context: LogContext = {}): T {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    this.perf(category, duration, context)
    return result
  }

  async timeAsync<T>(category: string, fn: () => Promise<T>, context: LogContext = {}): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    this.perf(category, duration, context)
    return result
  }
}

// Export singleton instance
export const TrackingLogger = TrackingLoggerService.getInstance()

// Global debug interface for development
declare global {
  interface Window {
    __TRACKING_DEBUG__?: {
      enable: () => void
      disable: () => void
      getLogs: () => LogEntry[]
      getByCategory: (category: string) => LogEntry[]
      getByLevel: (level: LogLevel) => LogEntry[]
      clearLogs: () => void
      showStats: () => void
    }
  }
}

// Setup global debug interface in development
if (__DEV__ && globalThis.window !== undefined) {
  globalThis.window.__TRACKING_DEBUG__ = {
    enable: () => TrackingLogger.configure(true),
    disable: () => TrackingLogger.configure(false),
    getLogs: () => TrackingLogger.getLogs(),
    getByCategory: (category) => TrackingLogger.getLogsByCategory(category),
    getByLevel: (level) => TrackingLogger.getLogsByLevel(level),
    clearLogs: () => TrackingLogger.clearLogs(),
    showStats: () => {
      const logs = TrackingLogger.getLogs()
      const stats = logs.reduce(
        (acc, log) => {
          acc[log.level] = (acc[log.level] || 0) + 1
          return acc
        },
        {} as Record<LogLevel, number>
      )
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.table(stats)
        // eslint-disable-next-line no-console
        console.log(`Total logs: ${logs.length}`)
      }
    },
  }
}
