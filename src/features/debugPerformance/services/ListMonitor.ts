/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlashListRef } from '@shopify/flash-list'
import { FlatList } from 'react-native'

import { ListPerformance, RenderEvent } from '../types'
import { safeExecute, safeExecuteAsync } from '../utils/errorHandler'
import { logger } from '../utils/logger'
import { memoryMonitor } from '../utils/memoryMonitor'
import { now } from '../utils/performanceTiming'

import { RenderTracker } from './RenderTracker'
import { StorageManager } from './StorageManager'

export interface ListMonitorOptions {
  samplingInterval?: number // ms between samples
  enableMemoryTracking?: boolean
  enableScrollTracking?: boolean
  customListId?: string
  componentInfo?: {
    componentName?: string
    screenName?: string
    listDescription?: string
    parentComponent?: string
    listPosition?: 'primary' | 'secondary' | 'nested'
  }
}

export interface ListRef {
  flashListRef?: React.RefObject<FlashListRef<any>>
  flatListRef?: React.RefObject<FlatList<any>>
  listType: 'FlashList' | 'FlatList'
}

interface ListMetrics {
  blankAreaTime: number
  drawTime: number
  scrollFPS: number
  itemCount: number
  visibleItemCount: number
  averageItemHeight: number
}

interface ScrollState {
  isScrolling: boolean
  velocity: number
  scrollTop: number
  direction: 'up' | 'down' | 'idle'
  lastFrameTime: number
  frameCount: number
}

interface MemorySnapshot {
  timestamp: number
  listMemoryMB: number
  itemCacheSize: number
}

interface FlashListPerformanceData {
  jsFPS?: {
    minFPS: number
    maxFPS: number
    averageFPS: number
  }
  blankAreaTime: number
  drawTime: number
  visibleIndices?: { startIndex: number; endIndex: number }
}

export class ListMonitor {
  private static instance: ListMonitor
  private storageManager = StorageManager.getInstance()
  public activeMonitors = new Map<string, ListMonitorInstance>()
  private nextListId = 1

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): ListMonitor {
    if (!ListMonitor.instance) {
      ListMonitor.instance = new ListMonitor()
    }
    return ListMonitor.instance
  }

  /**
   * Start monitoring a list component
   */
  startMonitoring(listRef: ListRef, sessionId: string, options: ListMonitorOptions = {}): string {
    return safeExecute(
      () => {
        const listId = options.customListId || `list_${this.nextListId++}`

        if (this.activeMonitors.has(listId)) {
          this.stopMonitoring(listId)
        }

        const monitor = new ListMonitorInstance(
          listId,
          sessionId,
          listRef,
          options,
          this.storageManager
        )

        this.activeMonitors.set(listId, monitor)
        monitor.start()

        return listId
      },
      'ListMonitor.startMonitoring',
      `error_list_${this.nextListId++}`
    ) as string
  }

  /**
   * Stop monitoring a specific list
   */
  stopMonitoring(listId: string): void {
    safeExecute(() => {
      const monitor = this.activeMonitors.get(listId)
      if (monitor) {
        monitor.stop()
        this.activeMonitors.delete(listId)
      }
    }, 'ListMonitor.stopMonitoring')
  }

  /**
   * Stop all active monitors
   */
  stopAllMonitoring(): void {
    safeExecute(() => {
      for (const [listId] of this.activeMonitors) {
        this.stopMonitoring(listId)
      }
    }, 'ListMonitor.stopAllMonitoring')
  }

  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): Array<{ listId: string; sessionId: string; listType: string }> {
    return safeExecute(
      () => {
        return Array.from(this.activeMonitors.entries()).map(([listId, monitor]) => ({
          listId,
          sessionId: monitor.getSessionId(),
          listType: monitor.getListType(),
        }))
      },
      'ListMonitor.getMonitoringStatus',
      []
    ) as Array<{ listId: string; sessionId: string; listType: string }>
  }

  /**
   * Force capture metrics for a specific list
   */
  captureMetrics(listId: string): void {
    safeExecute(() => {
      const monitor = this.activeMonitors.get(listId)
      if (monitor) {
        monitor.captureMetrics()
      }
    }, 'ListMonitor.captureMetrics')
  }

  /**
   * Get render profiler callback for a specific list
   */
  getRenderProfilerCallback(
    listId: string
  ):
    | ((
        id: string,
        phase: 'mount' | 'update' | 'unmount',
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number
      ) => void)
    | null {
    return (
      safeExecute(
        () => {
          const monitor = this.activeMonitors.get(listId)
          if (monitor) {
            return monitor.getRenderProfilerCallback()
          }
          return null
        },
        'ListMonitor.getRenderProfilerCallback',
        null
      ) ?? null
    )
  }

  /**
   * Get recent render events for a specific list
   */
  getRecentRenderEvents(listId: string, limit = 50): RenderEvent[] {
    return safeExecute(
      () => {
        const monitor = this.activeMonitors.get(listId)
        if (monitor) {
          return monitor.getRecentRenderEvents(limit)
        }
        return []
      },
      'ListMonitor.getRecentRenderEvents',
      []
    ) as RenderEvent[]
  }
}

class ListMonitorInstance {
  private intervalId?: NodeJS.Timeout
  private scrollState: ScrollState = {
    isScrolling: false,
    velocity: 0,
    scrollTop: 0,
    direction: 'idle',
    lastFrameTime: 0,
    frameCount: 0,
  }
  private lastMemorySnapshot?: MemorySnapshot
  private fpsMonitor: {
    startTime: number
    frameCount: number
    lastFrameTime: number
    minFPS: number
    maxFPS: number
    isTracking: boolean
  } = {
    startTime: 0,
    frameCount: 0,
    lastFrameTime: 0,
    minFPS: 60,
    maxFPS: 0,
    isTracking: false,
  }
  private flashListPerformanceData?: FlashListPerformanceData
  private performanceStartTime = 0
  private renderTracker: RenderTracker
  private renderEvents: RenderEvent[] = []

  constructor(
    private listId: string,
    private sessionId: string,
    private listRef: ListRef,
    private options: ListMonitorOptions,
    private storageManager: StorageManager
  ) {
    this.renderTracker = RenderTracker.getInstance()
  }

  start(): void {
    safeExecute(() => {
      this.setupPerformanceTracking()
      this.setupScrollTracking()
      this.setupMemoryTracking().catch((error) =>
        logger.debug('Failed to setup memory tracking:', error)
      )

      // Start periodic metrics capture
      const interval = this.options.samplingInterval || 1000
      this.intervalId = setInterval(() => {
        this.captureMetrics()
      }, interval)
    }, 'ListMonitorInstance.start')
  }

  stop(): void {
    safeExecute(() => {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = undefined
      }

      // Stop FPS monitoring and capture final data
      const jsFPSResult = this.stopFPSMonitoring()
      if (this.flashListPerformanceData && jsFPSResult) {
        this.flashListPerformanceData.jsFPS = jsFPSResult
      }
    }, 'ListMonitorInstance.stop')
  }

  getSessionId(): string {
    return this.sessionId
  }

  getListType(): string {
    return this.listRef.listType
  }

  captureMetrics(): void {
    safeExecuteAsync(async () => {
      const metrics = await this.collectMetrics()
      if (metrics) {
        await this.storeMetrics(metrics)

        if (__DEV__) {
          logger.verbose(`[ListMonitor] ${this.listId}:`, {
            listType: this.listRef.listType,
            blankAreaTime: metrics.metrics.blankAreaTime,
            drawTime: metrics.metrics.drawTime,
            scrollFPS: metrics.metrics.scrollFPS,
            memoryUsage: `${metrics.memoryUsage.listMemoryMB}MB`,
          })
        }
      }
    }, 'ListMonitorInstance.captureMetrics')
  }

  private setupPerformanceTracking(): void {
    safeExecute(() => {
      if (this.listRef.listType === 'FlashList' && this.listRef.flashListRef?.current) {
        // Start FPS monitoring for FlashList
        this.startFPSMonitoring()
        this.performanceStartTime = Date.now()

        // Initialize FlashList performance data structure
        this.flashListPerformanceData = {
          blankAreaTime: 0,
          drawTime: 0,
        }
      } else if (this.listRef.listType === 'FlatList') {
        // For FlatList, we can still monitor FPS
        this.startFPSMonitoring()
        this.performanceStartTime = Date.now()
      }
    }, 'ListMonitorInstance.setupPerformanceTracking')
  }

  private setupScrollTracking(): void {
    if (!this.options.enableScrollTracking) return

    // Scroll tracking will be handled through onScroll callbacks
    // This will be integrated via the useListPerformance hook
  }

  private async setupMemoryTracking(): Promise<void> {
    if (!this.options.enableMemoryTracking) return

    // Initialize memory tracking
    this.lastMemorySnapshot = {
      timestamp: Date.now(),
      listMemoryMB: await this.getMemoryUsage(),
      itemCacheSize: this.getItemCacheSize(),
    }
  }

  private async collectMetrics(): Promise<ListPerformance | null | undefined> {
    return safeExecuteAsync(
      async () => {
        const now = Date.now()
        const metrics = this.getListMetrics()
        const memoryUsageMB = await this.getMemoryUsage()
        const memoryUsage = {
          listMemoryMB: memoryUsageMB,
          itemCacheSize: this.getItemCacheSize(),
        }

        const listPerformance: ListPerformance = {
          listId: this.listId,
          sessionId: this.sessionId,
          timestamp: now,
          listType: this.listRef.listType as 'FlashList' | 'FlatList' | 'VirtualizedList',
          componentInfo: {
            listId: this.listId,
            componentName: this.options.componentInfo?.componentName,
            screenName: this.options.componentInfo?.screenName,
            listDescription: this.options.componentInfo?.listDescription,
            parentComponent: this.options.componentInfo?.parentComponent,
            listPosition: this.options.componentInfo?.listPosition,
          },
          metrics,
          scrollMetrics: {
            scrollTop: this.scrollState.scrollTop,
            scrollDirection: this.scrollState.direction,
            velocity: this.scrollState.velocity,
          },
          memoryUsage,
          performance: {
            isScrolling: this.scrollState.isScrolling,
            hasBlanks: metrics.blankAreaTime > 0,
            droppedFrames: this.calculateDroppedFrames(),
          },
        }

        return listPerformance
      },
      'ListMonitorInstance.collectMetrics',
      null
    )
  }

  private getListMetrics(): ListMetrics {
    return safeExecute(
      () => {
        if (this.listRef.listType === 'FlashList' && this.listRef.flashListRef?.current) {
          return this.getFlashListMetrics()
        } else if (this.listRef.listType === 'FlatList' && this.listRef.flatListRef?.current) {
          return this.getFlatListMetrics()
        }

        // Fallback metrics
        return {
          blankAreaTime: 0,
          drawTime: 16.67, // Assume 60fps
          scrollFPS: this.calculateScrollFPS(),
          itemCount: 0,
          visibleItemCount: 0,
          averageItemHeight: 0,
        }
      },
      'ListMonitorInstance.getListMetrics',
      {
        blankAreaTime: 0,
        drawTime: 16.67,
        scrollFPS: 0,
        itemCount: 0,
        visibleItemCount: 0,
        averageItemHeight: 0,
      }
    ) as ListMetrics
  }

  private getFlashListMetrics(): ListMetrics {
    const flashListRef = this.listRef.flashListRef?.current
    if (!flashListRef) {
      return this.getFallbackMetrics()
    }

    try {
      // Get current FPS data
      const currentFPS = this.getCurrentFPSData()

      // Get visible indices for item counting
      const visibleIndices = flashListRef.computeVisibleIndices()
      const visibleItemCount = Math.max(0, visibleIndices.endIndex - visibleIndices.startIndex + 1)

      // Update FlashList performance data
      if (this.flashListPerformanceData) {
        this.flashListPerformanceData.jsFPS = currentFPS ?? undefined
        this.flashListPerformanceData.visibleIndices = visibleIndices
      }

      return {
        blankAreaTime: this.flashListPerformanceData?.blankAreaTime || 0,
        drawTime:
          this.flashListPerformanceData?.drawTime ||
          ((currentFPS?.averageFPS ?? 0) > 0 ? 1000 / (currentFPS?.averageFPS ?? 1) : 16.67),
        scrollFPS: currentFPS?.averageFPS || this.calculateScrollFPS(),
        itemCount: this.getFlashListItemCount(flashListRef),
        visibleItemCount,
        averageItemHeight: this.getFlashListAverageItemHeight(flashListRef, visibleIndices),
      }
    } catch (error) {
      logger.debug('[ListMonitor] Failed to get FlashList metrics:', error)
      return this.getFallbackMetrics()
    }
  }

  private getFlatListMetrics(): ListMetrics {
    const flatListRef = this.listRef.flatListRef?.current
    if (!flatListRef) {
      return this.getFallbackMetrics()
    }

    try {
      // Get current FPS data for FlatList
      const currentFPS = this.getCurrentFPSData()

      return {
        blankAreaTime: 0, // Not easily measurable for FlatList without custom implementation
        drawTime: (currentFPS?.averageFPS ?? 0) > 0 ? 1000 / (currentFPS?.averageFPS ?? 1) : 16.67,
        scrollFPS: currentFPS?.averageFPS || this.calculateScrollFPS(),
        itemCount: this.getFlatListItemCount(flatListRef),
        visibleItemCount: this.estimateFlatListVisibleItems(flatListRef),
        averageItemHeight: this.estimateFlatListItemHeight(flatListRef),
      }
    } catch (error) {
      logger.debug('[ListMonitor] Failed to get FlatList metrics:', error)
      return this.getFallbackMetrics()
    }
  }

  private getFlatListItemCount(flatListRef: FlatList<any>): number {
    try {
      // Access FlatList props through the ref
      return (flatListRef as any)?.props?.data?.length || 0
    } catch (error) {
      return 0
    }
  }

  private estimateFlatListVisibleItems(flatListRef: FlatList<any>): number {
    try {
      // Estimate visible items based on container size and estimated item height
      const containerHeight = 600 // Default assumption, should be measured
      const estimatedItemHeight = this.estimateFlatListItemHeight(flatListRef)

      if (estimatedItemHeight > 0) {
        return Math.ceil(containerHeight / estimatedItemHeight)
      }

      return 5 // Default estimate
    } catch (error) {
      return 0
    }
  }

  private estimateFlatListItemHeight(flatListRef: FlatList<any>): number {
    try {
      // Try to get getItemLayout if provided
      const itemLayout = (flatListRef as any)?.props?.getItemLayout
      if (itemLayout) {
        const layout = itemLayout(null, 0)
        return layout?.height || 0
      }

      // Fallback to estimation
      return 60 // Default item height assumption
    } catch (error) {
      return 60
    }
  }

  private getFallbackMetrics(): ListMetrics {
    return {
      blankAreaTime: 0,
      drawTime: 16.67, // Assume 60fps
      scrollFPS: this.calculateScrollFPS(),
      itemCount: 0,
      visibleItemCount: 0,
      averageItemHeight: 0,
    }
  }

  private measureBlankAreaTime(): number {
    try {
      // For accurate blank area time measurement, we would need to run a benchmark
      // This is a simplified implementation that estimates based on scroll performance
      const currentJSFPS = this.flashListPerformanceData?.jsFPS
      if (currentJSFPS && currentJSFPS.minFPS < 50) {
        // If FPS drops significantly, estimate blank area time
        const fpsDropRatio = Math.max(0, (60 - currentJSFPS.minFPS) / 60)
        return fpsDropRatio * 100 // Return milliseconds of blank time
      }
      return 0
    } catch (error) {
      return 0
    }
  }

  private measureDrawTime(): number {
    try {
      // Measure time based on current FPS performance
      const currentJSFPS = this.flashListPerformanceData?.jsFPS
      if (currentJSFPS && currentJSFPS.averageFPS > 0) {
        return 1000 / currentJSFPS.averageFPS // Convert FPS to frame time in ms
      }

      // Fallback: measure current frame time
      const start = now()
      // Simulate a small rendering operation
      const end = now()
      return Math.max(end - start, 16.67) // Minimum 60fps frame time
    } catch (error) {
      return 16.67 // Default to 60fps
    }
  }

  /**
   * Start FPS monitoring
   */
  private startFPSMonitoring(): void {
    this.fpsMonitor.isTracking = true
    this.fpsMonitor.startTime = now()
    this.fpsMonitor.frameCount = 0
    this.fpsMonitor.lastFrameTime = now()
    this.fpsMonitor.minFPS = 60
    this.fpsMonitor.maxFPS = 0
  }

  /**
   * Stop FPS monitoring and get results
   */
  private stopFPSMonitoring(): { minFPS: number; maxFPS: number; averageFPS: number } | null {
    if (!this.fpsMonitor.isTracking) {
      return null
    }

    this.fpsMonitor.isTracking = false
    const duration = now() - this.fpsMonitor.startTime
    const averageFPS = duration > 0 ? (this.fpsMonitor.frameCount / duration) * 1000 : 0

    return {
      minFPS: this.fpsMonitor.minFPS,
      maxFPS: this.fpsMonitor.maxFPS,
      averageFPS: Math.round(averageFPS * 100) / 100,
    }
  }

  /**
   * Update FPS tracking with frame info
   */
  private updateFPSTracking(): void {
    if (!this.fpsMonitor.isTracking) {
      return
    }

    const currentTime = now()
    this.fpsMonitor.frameCount++

    if (this.fpsMonitor.lastFrameTime > 0) {
      const frameDuration = currentTime - this.fpsMonitor.lastFrameTime
      const currentFPS = frameDuration > 0 ? 1000 / frameDuration : 60

      this.fpsMonitor.minFPS = Math.min(this.fpsMonitor.minFPS, currentFPS)
      this.fpsMonitor.maxFPS = Math.max(this.fpsMonitor.maxFPS, currentFPS)
    }

    this.fpsMonitor.lastFrameTime = currentTime
  }

  /**
   * Get current FPS data without stopping monitoring
   */
  private getCurrentFPSData(): { minFPS: number; maxFPS: number; averageFPS: number } | null {
    if (!this.fpsMonitor.isTracking || this.fpsMonitor.frameCount === 0) {
      return null
    }

    const duration = now() - this.fpsMonitor.startTime
    const averageFPS = duration > 0 ? (this.fpsMonitor.frameCount / duration) * 1000 : 0

    return {
      minFPS: this.fpsMonitor.minFPS,
      maxFPS: this.fpsMonitor.maxFPS,
      averageFPS: Math.round(averageFPS * 100) / 100,
    }
  }

  private calculateScrollFPS(): number {
    if (this.scrollState.frameCount === 0 || this.scrollState.lastFrameTime === 0) {
      return 0
    }

    const timeDiff = Date.now() - this.scrollState.lastFrameTime
    if (timeDiff === 0) return 60 // Default to 60fps

    return Math.min(60, Math.round(1000 / timeDiff))
  }

  private calculateDroppedFrames(): number {
    // Calculate based on target 60fps vs actual scroll FPS
    const targetFPS = 60
    const actualFPS = this.scrollState.frameCount > 0 ? this.calculateScrollFPS() : targetFPS
    const droppedFrames = Math.max(0, targetFPS - actualFPS)
    return Math.round(droppedFrames)
  }

  private getFlashListItemCount(flashListRef: FlashListRef<any>): number {
    try {
      // Try to get item count from props if available
      return flashListRef.props.data?.length || 0
    } catch (error) {
      return 0
    }
  }

  private getFlashListAverageItemHeight(
    flashListRef: FlashListRef<any>,
    visibleIndices: { startIndex: number; endIndex: number }
  ): number {
    try {
      if (visibleIndices.startIndex === visibleIndices.endIndex) return 0

      let totalHeight = 0
      let itemCount = 0

      // Sample a few items to calculate average height
      for (
        let i = visibleIndices.startIndex;
        i <= Math.min(visibleIndices.endIndex, visibleIndices.startIndex + 5);
        i++
      ) {
        const layout = flashListRef.getLayout(i)
        if (layout) {
          totalHeight += layout.height
          itemCount++
        }
      }

      return itemCount > 0 ? totalHeight / itemCount : 0
    } catch (error) {
      return 0
    }
  }

  private getItemCount(): number {
    // This would need to be provided by the list component
    return 0
  }

  private getVisibleItemCount(): number {
    // This would need to be calculated based on viewport
    return 0
  }

  private getAverageItemHeight(): number {
    // This would need to be calculated from rendered items
    return 0
  }

  private async getMemoryUsage(): Promise<number> {
    try {
      const memoryInfo = await memoryMonitor.getCurrentMemoryInfo()
      return memoryInfo ? memoryInfo.usedMemoryMB : 0
    } catch (error) {
      return 0
    }
  }

  private getItemCacheSize(): number {
    try {
      if (this.listRef.listType === 'FlashList' && this.listRef.flashListRef?.current) {
        const visibleIndices = this.listRef.flashListRef.current.computeVisibleIndices()
        // Estimate cache size based on visible items (FlashList typically caches more than visible)
        const visibleItemCount = visibleIndices.endIndex - visibleIndices.startIndex + 1
        return Math.max(visibleItemCount * 2, 10) // Assume 2x visible items are cached
      }
      return 0
    } catch (error) {
      return 0
    }
  }

  private async storeMetrics(metrics: ListPerformance): Promise<void> {
    // Store in the circular buffer system
    const sessionData = await this.storageManager.getSession(this.sessionId)
    if (!sessionData) {
      logger.debug('[ListMonitor] No session found for metrics storage')
      return
    }

    if (!sessionData.metrics) {
      sessionData.metrics = { networkRequests: [], renderEvents: [], listPerformance: [] }
    }

    if (!sessionData.metrics.listPerformance) {
      sessionData.metrics.listPerformance = []
    }

    sessionData.metrics.listPerformance.push(metrics)
    await this.storageManager.storeSession(this.sessionId, sessionData)
  }

  /**
   * Update scroll state from external scroll events
   */
  updateScrollState(scrollTop: number, velocity: number): void {
    safeExecute(() => {
      const now = Date.now()
      const previousScrollTop = this.scrollState.scrollTop

      this.scrollState.scrollTop = scrollTop
      this.scrollState.velocity = velocity
      this.scrollState.isScrolling = Math.abs(velocity) > 0.1

      // Determine scroll direction
      if (scrollTop > previousScrollTop) {
        this.scrollState.direction = 'down'
      } else if (scrollTop < previousScrollTop) {
        this.scrollState.direction = 'up'
      } else {
        this.scrollState.direction = 'idle'
      }

      // Update frame tracking for FPS calculation
      if (this.scrollState.isScrolling) {
        this.scrollState.frameCount++
        this.scrollState.lastFrameTime = now
        this.updateFPSTracking() // Update our FPS monitor
      }
    }, 'ListMonitorInstance.updateScrollState')
  }

  /**
   * Track render event for list items
   */
  async trackRenderEvent(
    componentName: string,
    phase: 'mount' | 'update' | 'unmount',
    actualDuration: number,
    baseDuration: number,
    triggerReason?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
  ): Promise<void> {
    await safeExecuteAsync(async () => {
      const memoryUsage = await this.getMemoryUsage()
      const renderEvent: RenderEvent = {
        eventId: `${this.listId}_${componentName}_${Date.now()}`,
        sessionId: this.sessionId,
        componentName: `${this.listId}.${componentName}`, // Namespace with list ID
        renderCount: 1, // This would be incremented if we track multiple renders of the same component
        timestamp: Date.now(),
        phase,
        actualDuration,
        baseDuration,
        triggerReason,
        childrenCount: 0, // Would need to be calculated from profiler data
        memoryUsage,
      }

      this.renderEvents.push(renderEvent)

      // Limit stored render events to prevent memory issues
      if (this.renderEvents.length > 1000) {
        this.renderEvents = this.renderEvents.slice(-500)
      }

      if (__DEV__) {
        logger.verbose(
          `[ListMonitor] Render event: ${componentName} (${phase}) - ${actualDuration.toFixed(2)}ms`
        )
      }
    }, 'ListMonitorInstance.trackRenderEvent')
  }

  /**
   * Get render profiler callback for list items
   */
  getRenderProfilerCallback(): (
    id: string,
    phase: 'mount' | 'update' | 'unmount',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void {
    return (id, phase, actualDuration, baseDuration, _startTime, _commitTime) => {
      safeExecute(() => {
        // Determine trigger reason from timing patterns
        let triggerReason: 'props' | 'state' | 'context' | 'hooks' | 'parent' | undefined

        if (this.scrollState.isScrolling) {
          triggerReason = 'parent' // Likely triggered by parent scroll
        } else if (actualDuration > baseDuration * 1.5) {
          triggerReason = 'props' // Significant difference suggests props change
        }

        // Track render event asynchronously to not block render
        this.trackRenderEvent(id, phase, actualDuration, baseDuration, triggerReason).catch(
          (error) => {
            logger.debug('[ListMonitor] Failed to track render event:', error)
          }
        )
      }, 'ListMonitorInstance.getRenderProfilerCallback')
    }
  }

  /**
   * Get recent render events for this list
   */
  getRecentRenderEvents(limit = 50): RenderEvent[] {
    return this.renderEvents.slice(-limit)
  }
}

// Export singleton instance
export const listMonitor = ListMonitor.getInstance()
