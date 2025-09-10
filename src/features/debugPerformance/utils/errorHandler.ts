import { logger } from '../utils/logger'
/**
 * Error handling utilities for debug performance operations
 * Ensures that debug operations never crash the main app
 */

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

interface ErrorLog {
  timestamp: number
  error: Error
  context: string
  severity: ErrorSeverity
  handled: boolean
}

class DebugPerformanceErrorHandler {
  private static instance: DebugPerformanceErrorHandler
  private errorLog: ErrorLog[] = []
  private maxLogSize = 100
  private suppressedErrors = new Set<string>()

  static getInstance(): DebugPerformanceErrorHandler {
    if (!DebugPerformanceErrorHandler.instance) {
      DebugPerformanceErrorHandler.instance = new DebugPerformanceErrorHandler()
    }
    return DebugPerformanceErrorHandler.instance
  }

  /**
   * Wrap any debug operation to prevent crashes
   */
  safeExecute<T>(
    operation: () => T,
    context: string,
    fallback?: T,
    severity: ErrorSeverity = 'medium'
  ): T | undefined {
    try {
      return operation()
    } catch (error) {
      this.logError(error as Error, context, severity)
      return fallback
    }
  }

  /**
   * Wrap async debug operations
   */
  async safeExecuteAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T,
    severity: ErrorSeverity = 'medium'
  ): Promise<T | undefined> {
    try {
      return await operation()
    } catch (error) {
      this.logError(error as Error, context, severity)
      return fallback
    }
  }

  /**
   * Log errors without throwing
   */
  private logError(error: Error, context: string, severity: ErrorSeverity): void {
    try {
      const errorKey = `${error.name}:${context}`

      // Suppress repeated errors
      if (this.suppressedErrors.has(errorKey)) {
        return
      }

      const errorLog: ErrorLog = {
        timestamp: Date.now(),
        error,
        context,
        severity,
        handled: true,
      }

      this.errorLog.push(errorLog)

      // Maintain log size limit
      if (this.errorLog.length > this.maxLogSize) {
        this.errorLog = this.errorLog.slice(-this.maxLogSize)
      }

      // Suppress this error for 5 minutes
      this.suppressedErrors.add(errorKey)
      setTimeout(
        () => {
          this.suppressedErrors.delete(errorKey)
        },
        5 * 60 * 1000
      )

      // Only log critical errors to console in production
      if (severity === 'critical' || __DEV__) {
        logger.debug(
          `[DebugPerformance] ${severity.toUpperCase()} error in ${context}:`,
          error.message
        )
      }
    } catch (loggingError) {
      // Even error logging failed - fail silently
      logger.debug('[DebugPerformance] Failed to log error:', loggingError)
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): ErrorLog[] {
    return this.errorLog.slice(-limit).map((log) => ({
      ...log,
      error: {
        name: log.error.name,
        message: log.error.message,
        stack: log.error.stack,
      } as Error,
    }))
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errorLog = []
    this.suppressedErrors.clear()
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number
    errorsBySeverity: Record<ErrorSeverity, number>
    errorsByContext: Record<string, number>
    recentErrorRate: number // errors per minute in last hour
  } {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentErrors = this.errorLog.filter((log) => log.timestamp > oneHourAgo)

    const errorsBySeverity: Record<ErrorSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    const errorsByContext: Record<string, number> = {}

    this.errorLog.forEach((log) => {
      errorsBySeverity[log.severity]++
      errorsByContext[log.context] = (errorsByContext[log.context] || 0) + 1
    })

    return {
      totalErrors: this.errorLog.length,
      errorsBySeverity,
      errorsByContext,
      recentErrorRate: Math.round((recentErrors.length / 60) * 100) / 100,
    }
  }
}

// Singleton instance
const errorHandler = DebugPerformanceErrorHandler.getInstance()

// Export convenient wrapper functions
export const safeExecute = errorHandler.safeExecute.bind(errorHandler)
export const safeExecuteAsync = errorHandler.safeExecuteAsync.bind(errorHandler)
export const getRecentErrors = errorHandler.getRecentErrors.bind(errorHandler)
export const clearErrors = errorHandler.clearErrors.bind(errorHandler)
export const getErrorStats = errorHandler.getErrorStats.bind(errorHandler)

// Export class for testing
export { DebugPerformanceErrorHandler }
