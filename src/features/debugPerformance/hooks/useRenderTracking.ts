import { useCallback, useEffect, useRef } from 'react'

import { useDebugPerformance } from '../context/DebugPerformanceProvider'
import { RenderTracker, TreeNode } from '../services/RenderTracker'
import { logger } from '../utils/logger'

interface UseRenderTrackingReturn {
  startTracking: () => boolean
  stopTracking: () => boolean
  isTracking: boolean
  getComponentStats: () => Array<{
    componentName: string
    renderCount: number
    avgRenderTime: number
    lastTrigger?: string
  }>
  getComponentTree: () => Map<string, TreeNode>
  filterComponents: (options: {
    namePattern?: RegExp
    minRenderCount?: number
    triggerType?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
  }) => string[]
  clearTracking: () => void
}

export const useRenderTracking = (): UseRenderTrackingReturn => {
  const { isRecording } = useDebugPerformance()
  const renderTracker = useRef(RenderTracker.getInstance())

  const startTracking = useCallback((): boolean => {
    logger.verbose('🎬 useRenderTracking.startTracking - isRecording:', isRecording)
    if (!isRecording) {
      logger.debug('Cannot start render tracking: Debug performance session not active')
      return false
    }
    const result = renderTracker.current.startTracking()
    logger.verbose('🎬 startTracking result:', result)
    return result
  }, [isRecording])

  const stopTracking = useCallback((): boolean => {
    return renderTracker.current.stopTracking()
  }, [])

  const getComponentStats = useCallback(() => {
    return renderTracker.current.getComponentStats()
  }, [])

  const getComponentTree = useCallback(() => {
    return renderTracker.current.getComponentTree()
  }, [])

  const filterComponents = useCallback(
    (options: {
      namePattern?: RegExp
      minRenderCount?: number
      triggerType?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
    }) => {
      return renderTracker.current.filterComponents(options)
    },
    []
  )

  const clearTracking = useCallback(() => {
    renderTracker.current.clearTracking()
  }, [])

  useEffect(() => {
    return () => {
      if (renderTracker.current.isCurrentlyTracking()) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        renderTracker.current.stopTracking()
      }
    }
  }, [])

  return {
    startTracking,
    stopTracking,
    isTracking: renderTracker.current.isCurrentlyTracking(),
    getComponentStats,
    getComponentTree,
    filterComponents,
    clearTracking,
  }
}
