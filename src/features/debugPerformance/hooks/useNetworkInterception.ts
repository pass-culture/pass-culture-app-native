import { useEffect, useRef, useCallback, useState } from 'react'

import { NetworkInterceptor } from '../services/NetworkInterceptor'
import { NetworkStorage } from '../services/NetworkStorage'
import type { NetworkRequest } from '../types'
import { logger } from '../utils/logger'
import { StreamingMetrics } from '../utils/metrics'

export interface NetworkInterceptionConfig {
  enabled: boolean
  autoStart?: boolean
  categories?: Array<'api' | 'asset' | 'third-party' | 'analytics' | 'cdn'>
  trackSlowRequests?: boolean
  slowRequestThreshold?: number
}

export interface NetworkMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  requestsPerSecond: number
  slowRequests: number
  errorsByCategory: Record<string, number>
  recentRequests: NetworkRequest[]
}

const DEFAULT_CONFIG: NetworkInterceptionConfig = {
  enabled: true,
  autoStart: true,
  categories: ['api', 'asset', 'third-party', 'analytics', 'cdn'],
  trackSlowRequests: true,
  slowRequestThreshold: 1000,
}

export function useNetworkInterception(config: Partial<NetworkInterceptionConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const interceptorRef = useRef<NetworkInterceptor | null>(null)
  const storageRef = useRef<NetworkStorage | null>(null)
  const streamingMetricsRef = useRef<StreamingMetrics | null>(null)
  const requestTimestampsRef = useRef<number[]>([])

  const [isActive, setIsActive] = useState(false)
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    requestsPerSecond: 0,
    slowRequests: 0,
    errorsByCategory: {},
    recentRequests: [],
  })

  // Initialize services
  useEffect(() => {
    if (!finalConfig.enabled) return

    try {
      interceptorRef.current = NetworkInterceptor.getInstance()
      storageRef.current = NetworkStorage.getInstance()
      streamingMetricsRef.current = new StreamingMetrics(1000)
    } catch (error) {
      logger.debug('Failed to initialize network interception:', error)
    }
  }, [finalConfig.enabled])

  // Handle network request
  const handleNetworkRequest = useCallback(
    (request: Partial<NetworkRequest>) => {
      // Filter by categories if specified
      if (finalConfig.categories && request.category) {
        if (!finalConfig.categories.includes(request.category.category)) {
          return
        }
      }

      // Track request timestamp for RPS calculation
      requestTimestampsRef.current.push(Date.now())

      // Keep only last 100 timestamps for RPS calculation
      if (requestTimestampsRef.current.length > 100) {
        requestTimestampsRef.current = requestTimestampsRef.current.slice(-100)
      }
    },
    [finalConfig.categories]
  )

  // Handle network response/error
  const handleNetworkResponse = useCallback(
    (request: NetworkRequest) => {
      if (!streamingMetricsRef.current || !storageRef.current) return

      try {
        // Filter by categories
        if (finalConfig.categories && request.category) {
          if (!finalConfig.categories.includes(request.category.category)) {
            return
          }
        }

        // Store the request
        storageRef.current.storeNetworkRequest(request)

        // Update streaming metrics
        streamingMetricsRef.current.addValue(request.timing.duration)

        // Update metrics state
        const currentStats = streamingMetricsRef.current.getMetrics()
        const isSlowRequest =
          finalConfig.trackSlowRequests &&
          request.timing.duration > (finalConfig.slowRequestThreshold || 1000)

        // Calculate requests per second
        const now = Date.now()
        const recentTimestamps = requestTimestampsRef.current.filter((ts) => now - ts < 1000)
        const requestsPerSecond = recentTimestamps.length

        // Calculate error counts by category
        const errorsByCategory: Record<string, number> = {}
        if (!request.status.success && request.category) {
          const category = request.category.category
          errorsByCategory[category] = (errorsByCategory[category] || 0) + 1
        }

        setMetrics((prevMetrics) => ({
          totalRequests: currentStats.count,
          successfulRequests: prevMetrics.successfulRequests + (request.status.success ? 1 : 0),
          failedRequests: prevMetrics.failedRequests + (request.status.success ? 0 : 1),
          averageResponseTime: currentStats.avg,
          requestsPerSecond,
          slowRequests: prevMetrics.slowRequests + (isSlowRequest ? 1 : 0),
          errorsByCategory: {
            ...prevMetrics.errorsByCategory,
            ...errorsByCategory,
          },
          recentRequests: [request, ...prevMetrics.recentRequests.slice(0, 19)], // Keep last 20
        }))
      } catch (error) {
        logger.debug('Failed to handle network response:', error)
      }
    },
    [finalConfig.categories, finalConfig.trackSlowRequests, finalConfig.slowRequestThreshold]
  )

  // Handle network errors
  const handleNetworkError = useCallback(
    (request: NetworkRequest) => {
      // Same as response handler but for errors
      handleNetworkResponse(request)
    },
    [handleNetworkResponse]
  )

  // Start network interception
  const startInterception = useCallback(() => {
    if (!interceptorRef.current || isActive) return

    try {
      interceptorRef.current.start({
        onRequest: handleNetworkRequest,
        onResponse: handleNetworkResponse,
        onError: handleNetworkError,
      })

      setIsActive(true)
    } catch (error) {
      logger.debug('Failed to start network interception:', error)
    }
  }, [isActive, handleNetworkRequest, handleNetworkResponse, handleNetworkError])

  // Stop network interception
  const stopInterception = useCallback(() => {
    if (!interceptorRef.current || !isActive) return

    try {
      interceptorRef.current.stop()
      setIsActive(false)
    } catch (error) {
      logger.debug('Failed to stop network interception:', error)
    }
  }, [isActive])

  // Reset metrics
  const resetMetrics = useCallback(() => {
    if (streamingMetricsRef.current) {
      streamingMetricsRef.current.reset()
    }
    requestTimestampsRef.current = []
    setMetrics({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      requestsPerSecond: 0,
      slowRequests: 0,
      errorsByCategory: {},
      recentRequests: [],
    })
  }, [])

  // Get detailed statistics
  const getDetailedStats = useCallback(async () => {
    if (!streamingMetricsRef.current || !storageRef.current) {
      return null
    }

    try {
      const stats = streamingMetricsRef.current.getMetrics()
      const storageStats = await storageRef.current.getStorageStats()
      const slowRequests = await storageRef.current.getSlowRequests(
        finalConfig.slowRequestThreshold
      )
      const failedRequests = await storageRef.current.getFailedRequests()

      return {
        timing: stats,
        storage: storageStats,
        slowRequests: slowRequests.length,
        failedRequests: failedRequests.length,
        requestsByCategory: storageStats.requestsByCategory,
      }
    } catch (error) {
      logger.debug('Failed to get detailed stats:', error)
      return null
    }
  }, [finalConfig.slowRequestThreshold])

  // Get requests by category
  const getRequestsByCategory = useCallback(async (category: string) => {
    if (!storageRef.current) return []

    try {
      return await storageRef.current.getRequestsByCategory(category)
    } catch (error) {
      logger.debug('Failed to get requests by category:', error)
      return []
    }
  }, [])

  // Auto-start if configured
  useEffect(() => {
    if (finalConfig.autoStart && finalConfig.enabled && !isActive) {
      startInterception()
    }

    return () => {
      // Cleanup on unmount
      if (isActive) {
        stopInterception()
      }
    }
  }, [finalConfig.autoStart, finalConfig.enabled, isActive, startInterception, stopInterception])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (interceptorRef.current && isActive) {
        try {
          interceptorRef.current.stop()
        } catch (error) {
          logger.debug('Failed to cleanup network interception:', error)
        }
      }
    }
  }, [isActive])

  return {
    // State
    isActive,
    metrics,
    isSupported: !!interceptorRef.current,

    // Actions
    start: startInterception,
    stop: stopInterception,
    reset: resetMetrics,

    // Data access
    getDetailedStats,
    getRequestsByCategory,

    // Configuration
    config: finalConfig,
  }
}
