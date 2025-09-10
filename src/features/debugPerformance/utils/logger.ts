/**
 * Logging utility for debug performance
 * Controls debug output via environment variables
 */

// Check for debug logging environment variable
const isDebugLoggingEnabled = (): boolean => {
  return (
    __DEV__ &&
    (process.env.DEBUG_PERFORMANCE_LOGS === 'true' || process.env.DEBUG_PERFORMANCE_LOGS === '1')
  )
}

// Check for verbose console output
const isVerboseConsoleEnabled = (): boolean => {
  return (
    __DEV__ &&
    (process.env.DEBUG_PERFORMANCE_VERBOSE === 'true' ||
      process.env.DEBUG_PERFORMANCE_VERBOSE === '1')
  )
}

// Safe console wrapper to avoid ESLint warnings
// eslint-disable-next-line no-console
const safeLog = console.log
// eslint-disable-next-line no-console
const safeError = console.error
// eslint-disable-next-line no-console
const safeGroup = console.group
// eslint-disable-next-line no-console
const safeGroupEnd = console.groupEnd

export const logger = {
  // Always show these - essential user messages
  info: (message: string, ...args: unknown[]) => {
    safeLog(message, ...args)
  },

  // Always show errors
  error: (message: string, ...args: unknown[]) => {
    safeError(message, ...args)
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
}
