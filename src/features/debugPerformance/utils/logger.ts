/**
 * Logging utility for debug performance
 * Controls debug output via environment variables
 */

// Check if we're in development mode
const isDev = (): boolean => {
  // Multiple checks for dev mode
  return (
    (typeof __DEV__ !== 'undefined' && __DEV__ === true) ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV !== 'production'
  )
}

// Check for debug logging environment variable
const isDebugLoggingEnabled = (): boolean => {
  return (
    isDev() &&
    (process.env.DEBUG_PERFORMANCE_LOGS === 'true' || process.env.DEBUG_PERFORMANCE_LOGS === '1')
  )
}

// Check for verbose console output
const isVerboseConsoleEnabled = (): boolean => {
  return (
    isDev() &&
    (process.env.VERBOSE_PERFORMANCE_CONSOLE === 'true' ||
      process.env.VERBOSE_PERFORMANCE_CONSOLE === '1' ||
      process.env.DEBUG_PERFORMANCE_VERBOSE === 'true' ||
      process.env.DEBUG_PERFORMANCE_VERBOSE === '1')
  )
}

// Safe console wrapper to avoid ESLint warnings
// eslint-disable-next-line no-console
const safeLog = console.log
// eslint-disable-next-line no-console
const safeError = console.error
// eslint-disable-next-line no-console
const safeWarn = console.warn
// eslint-disable-next-line no-console
const safeGroup = console.group
// eslint-disable-next-line no-console
const safeGroupEnd = console.groupEnd

export const logger = {
  // Always show these - essential user messages
  info: (message: string, ...args: unknown[]) => {
    if (isDev()) {
      safeLog(message, ...args)
    }
  },

  // Always show errors
  error: (message: string, ...args: unknown[]) => {
    if (isDev()) {
      safeError(message, ...args)
    }
  },

  // Always show warnings
  warn: (message: string, ...args: unknown[]) => {
    if (isDev()) {
      safeWarn(message, ...args)
    }
  },

  // Only show when debug logging is enabled
  debug: (message: string, ...args: unknown[]) => {
    if (!isDebugLoggingEnabled()) return
    safeLog(`[DEBUG] ${message}`, ...args)
  },

  // Only show when verbose console is enabled
  verbose: (message: string, ...args: unknown[]) => {
    if (!isVerboseConsoleEnabled()) return
    safeLog(message, ...args)
  },

  // Conditional grouping for verbose output
  group: (label: string, fn: () => void) => {
    if (!isVerboseConsoleEnabled()) return
    safeGroup(label)
    fn()
    safeGroupEnd()
  },

  // Utility to replace console.log statements gradually
  // Use this to replace existing console.log calls
  deprecatedLog: (message: string, ...args: unknown[]) => {
    if (isDebugLoggingEnabled()) {
      safeLog(`[DEPRECATED] ${message}`, ...args)
    }
  },

  // Force log - always shows regardless of environment (for debugging the logger itself)
  forceLog: (message: string, ...args: unknown[]) => {
    safeLog(`[FORCE] ${message}`, ...args)
  },

  // Debug the logger configuration itself
  debugConfig: () => {
    safeLog('[Logger Config Debug]')
    safeLog('__DEV__:', typeof __DEV__ === 'undefined' ? 'undefined' : __DEV__)
    safeLog('NODE_ENV:', process.env.NODE_ENV)
    safeLog('isDev():', isDev())
    safeLog('DEBUG_PERFORMANCE_LOGS:', process.env.DEBUG_PERFORMANCE_LOGS)
    safeLog('VERBOSE_PERFORMANCE_CONSOLE:', process.env.VERBOSE_PERFORMANCE_CONSOLE)
    safeLog('isDebugLoggingEnabled():', isDebugLoggingEnabled())
    safeLog('isVerboseConsoleEnabled():', isVerboseConsoleEnabled())
  },
}
