/**
 * Build-time configuration for debug performance features
 * Used to conditionally exclude debug code from production builds
 */

// Metro bundler configuration (React Native)
export const isDebugPerformanceEnabled = () => {
  // Only enable in development or when explicitly enabled
  return __DEV__ || process.env.ENABLE_DEBUG_PERFORMANCE === 'true'
}

// Web bundler configuration (Vite)
export const isWebDebugEnabled = () => {
  // Check if we're in a web environment with Vite
  try {
    // Use dynamic check for import.meta to avoid Jest errors
    const hasImportMeta =
      typeof globalThis !== 'undefined' && 'importMeta' in globalThis && globalThis.importMeta?.env

    if (hasImportMeta) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const env = (globalThis as any).importMeta.env
      return env.DEV || env.VITE_ENABLE_DEBUG_PERFORMANCE === 'true'
    }

    // Fallback for web environment detection
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      return true
    }
  } catch {
    // Ignore errors and fall back
  }
  return false
}

// Universal check that works for both platforms
export const shouldEnableDebugPerformance = () => {
  if (typeof window !== 'undefined') {
    // Web environment
    return isWebDebugEnabled()
  }
  // React Native environment
  return isDebugPerformanceEnabled()
}

// Conditional import helper for tree shaking
export const conditionalImport = <T>(module: () => T): T | null => {
  return shouldEnableDebugPerformance() ? module() : null
}
