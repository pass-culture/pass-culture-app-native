import { FlashListRef } from '@shopify/flash-list'
import { useCallback, useEffect, useRef, useMemo } from 'react'
import { FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

import { useDebugPerformance } from '../context/DebugPerformanceProvider'
import { ListMonitorOptions, ListRef, listMonitor } from '../services/ListMonitor'
import { safeExecute } from '../utils/errorHandler'
import { logger } from '../utils/logger'

export interface UseListPerformanceOptions extends ListMonitorOptions {
  /** Enable automatic scroll tracking */
  autoScrollTracking?: boolean
  /** Component identification information */
  componentInfo?: {
    componentName?: string
    screenName?: string
    listDescription?: string
    parentComponent?: string
    listPosition?: 'primary' | 'secondary' | 'nested'
  }
}

export interface UseListPerformanceReturn {
  /** Start monitoring list performance */
  startMonitoring: () => string | null | undefined
  /** Stop monitoring list performance */
  stopMonitoring: () => void
  /** Manually capture current metrics */
  captureMetrics: () => void
  /** Get monitoring status */
  getStatus: () => { listId: string | null; isMonitoring: boolean }
  /** onScroll handler for FlatList/FlashList */
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  /** Run FlashList benchmark */
  runBenchmark: () => Promise<unknown | null>
  /** Get render profiler callback for list items */
  getRenderProfilerCallback: () =>
    | ((
        id: string,
        phase: 'mount' | 'update' | 'unmount',
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number
      ) => void)
    | null
  /** Get recent render events */
  getRecentRenderEvents: (limit?: number) => unknown[]
  /** Current list ID being monitored */
  listId: string | null
  /** Whether monitoring is active */
  isMonitoring: boolean
}

export const useListPerformance = <T>(
  listRef: React.RefObject<FlashListRef<T>> | React.RefObject<FlatList<T>>,
  listType: 'FlashList' | 'FlatList',
  options: UseListPerformanceOptions = {}
): UseListPerformanceReturn => {
  const { isRecording, currentSession } = useDebugPerformance()
  const sessionId = currentSession?.sessionId
  const listIdRef = useRef<string | null>(null)
  const monitoringRef = useRef(false)
  const lastScrollTime = useRef(0)
  const scrollFrameCount = useRef(0)

  // Memoize list reference object
  const listRefObject: ListRef = useMemo(() => {
    if (listType === 'FlashList') {
      return {
        flashListRef: listRef as React.RefObject<FlashListRef<T>>,
        listType: 'FlashList',
      }
    } else {
      return {
        flatListRef: listRef as React.RefObject<FlatList<T>>,
        listType: 'FlatList',
      }
    }
  }, [listRef, listType])

  // FlashList reference
  const flashListRef =
    listType === 'FlashList' ? (listRef as React.RefObject<FlashListRef<T>>) : null

  const startMonitoring = useCallback((): string | null | undefined => {
    return safeExecute(
      () => {
        logger.verbose(
          '🚀 [LIST PERFORMANCE] Starting monitoring - isRecording:',
          isRecording,
          'sessionId:',
          sessionId
        )

        if (!isRecording || !sessionId) {
          logger.debug('Cannot start list monitoring: Debug performance session not active')
          return null
        }

        if (monitoringRef.current) {
          logger.debug('List monitoring already active')
          return listIdRef.current
        }

        const listId = listMonitor.startMonitoring(listRefObject, sessionId, options)
        listIdRef.current = listId
        monitoringRef.current = true

        logger.verbose('✅ [LIST PERFORMANCE] Monitoring STARTED with ID:', listId)
        logger.verbose('📋 [LIST PERFORMANCE] Options:', {
          autoScrollTracking: options.autoScrollTracking,
          enableMemoryTracking: options.enableMemoryTracking,
          componentInfo: options.componentInfo,
        })
        return listId
      },
      'useListPerformance.startMonitoring',
      null
    )
  }, [isRecording, sessionId, listRefObject, options])

  const stopMonitoring = useCallback((): void => {
    safeExecute(() => {
      if (listIdRef.current) {
        listMonitor.stopMonitoring(listIdRef.current)
        logger.verbose('🛑 [LIST PERFORMANCE] Monitoring STOPPED for ID:', listIdRef.current)
      }
      listIdRef.current = null
      monitoringRef.current = false
    }, 'useListPerformance.stopMonitoring')
  }, [])

  const captureMetrics = useCallback((): void => {
    safeExecute(() => {
      if (listIdRef.current) {
        logger.verbose('📊 [LIST PERFORMANCE] Capturing metrics for:', listIdRef.current)
        listMonitor.captureMetrics(listIdRef.current)
        logger.verbose('✅ [LIST PERFORMANCE] Metrics captured successfully')
      } else {
        logger.debug('⚠️ [LIST PERFORMANCE] Cannot capture metrics: no active list')
      }
    }, 'useListPerformance.captureMetrics')
  }, [])

  const getStatus = useCallback(() => {
    return {
      listId: listIdRef.current,
      isMonitoring: monitoringRef.current,
    }
  }, [])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!monitoringRef.current || !listIdRef.current || !options.autoScrollTracking) {
        return
      }

      safeExecute(() => {
        const { contentOffset } = event.nativeEvent
        const scrollTop = contentOffset.y
        const now = Date.now()

        // Calculate velocity
        let velocity = 0
        if (lastScrollTime.current > 0) {
          const timeDiff = now - lastScrollTime.current
          const distanceDiff = Math.abs(
            scrollTop -
              (event.nativeEvent as unknown as { previousScrollTop: number }).previousScrollTop || 0
          )
          velocity = timeDiff > 0 ? distanceDiff / timeDiff : 0
        }

        lastScrollTime.current = now
        scrollFrameCount.current++

        // Update scroll state in the monitor
        const monitor = listMonitor.activeMonitors?.get(listIdRef.current ?? '')
        if (monitor) {
          monitor.updateScrollState(scrollTop, velocity)

          // Log scroll events every 20 frames to avoid spam
          if (scrollFrameCount.current % 20 === 0) {
            logger.verbose('📜 [LIST PERFORMANCE] Scroll event:', {
              scrollTop: Math.round(scrollTop),
              velocity: Math.round(velocity * 100) / 100,
              frameCount: scrollFrameCount.current,
            })
          }
        }
      }, 'useListPerformance.onScroll')
    },
    [options.autoScrollTracking]
  )

  const runBenchmark = useCallback(async (): Promise<unknown | null> => {
    return safeExecute(
      () => {
        if (listType !== 'FlashList' || !flashListRef?.current) {
          logger.debug('Benchmarking only available for FlashList')
          return Promise.resolve(null)
        }

        // Simple benchmark simulation - in a real implementation this would use FlashList's benchmark APIs
        logger.verbose('📊 Manual benchmark requested')
        return Promise.resolve({
          interrupted: false,
          suggestions: ['Manual benchmark requested'],
          formattedString: 'Manual benchmark triggered - capturing current performance metrics',
        })
      },
      'useListPerformance.runBenchmark',
      Promise.resolve(null)
    ) as Promise<unknown | null>
  }, [listType, flashListRef])

  const getRenderProfilerCallback = useCallback(() => {
    if (!listIdRef.current) {
      return null
    }
    return listMonitor.getRenderProfilerCallback(listIdRef.current)
  }, [])

  const getRecentRenderEvents = useCallback((limit = 50) => {
    if (!listIdRef.current) {
      return []
    }
    return listMonitor.getRecentRenderEvents(listIdRef.current, limit)
  }, [])

  // Auto-start monitoring when recording begins
  useEffect(() => {
    if (isRecording && sessionId && !monitoringRef.current) {
      startMonitoring()
    } else if (!isRecording && monitoringRef.current) {
      stopMonitoring()
    }
  }, [isRecording, sessionId, startMonitoring, stopMonitoring])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringRef.current) {
        stopMonitoring()
      }
    }
  }, [stopMonitoring])

  return {
    startMonitoring,
    stopMonitoring,
    captureMetrics,
    getStatus,
    onScroll,
    runBenchmark,
    getRenderProfilerCallback,
    getRecentRenderEvents,
    listId: listIdRef.current,
    isMonitoring: monitoringRef.current,
  }
}

/**
 * Convenience hook specifically for FlashList components
 */
export const useFlashListPerformance = <T>(
  listRef: React.RefObject<FlashListRef<T>>,
  options: UseListPerformanceOptions = {}
) => {
  return useListPerformance(listRef, 'FlashList', options)
}

/**
 * Convenience hook specifically for FlatList components
 */
export const useFlatListPerformance = <T>(
  listRef: React.RefObject<FlatList<T>>,
  options: UseListPerformanceOptions = {}
) => {
  return useListPerformance(listRef, 'FlatList', options)
}
