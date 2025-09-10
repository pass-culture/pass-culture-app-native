/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../utils/logger'

import { MetricsCollector } from './MetricsCollector'
import { NetworkStorage } from './NetworkStorage'
import { StorageManager } from './StorageManager'

interface ExportMetadata {
  sessionId: string
  startTime: string
  endTime: string
  duration: number
  device: any
  app: any
  config: any
}

interface ExportSummary {
  network: {
    totalRequests: number
    p50ResponseTime?: number
    p90ResponseTime?: number
    p95ResponseTime?: number
    slowestEndpoints: Array<{ url: string; avgTime: number }>
  }
  render: {
    totalRenders: number
    topComponents: Array<{ name: string; renderCount: number }>
    averageRenderTime?: number
  }
  lists: {
    totalLists: number
    avgScrollFPS?: number
    avgDrawTime?: number
    avgBlankTime?: number
  }
}

interface ExportData {
  network: any[]
  renders: any[]
  lists: any[]
}

interface SamplingInfo {
  applied: boolean
  originalSize: number
  sampledSize: number
  strategy: string
}

interface ExportResult {
  metadata: ExportMetadata
  summary: ExportSummary
  data: ExportData
  sampling: SamplingInfo
}

export class LocalExporter {
  private static instance: LocalExporter
  private readonly MAX_FILE_SIZE_MB = 50
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024

  static getInstance(): LocalExporter {
    if (!LocalExporter.instance) {
      LocalExporter.instance = new LocalExporter()
    }
    return LocalExporter.instance
  }

  async exportSession(sessionId: string): Promise<ExportResult | null> {
    try {
      logger.debug(`🔄 Starting export for session ${sessionId}`)

      const storageManager = StorageManager.getInstance()
      const sessionData = await storageManager.getSession(sessionId)

      if (!sessionData) {
        logger.error(`❌ Session ${sessionId} not found`)
        return null
      }

      // Get network data from NetworkStorage
      const networkStorage = NetworkStorage.getInstance()
      const originalNetworkSessionId = networkStorage.getCurrentSessionId()
      logger.debug(`🔍 NetworkStorage original session: ${originalNetworkSessionId}`)
      logger.debug(`🔍 Export session: ${sessionId}`)

      await networkStorage.setSessionId(sessionId) // Ensure we're using the right session
      await networkStorage.flush() // Ensure all in-memory data is persisted
      const networkRequests = await networkStorage.getCurrentSessionRequests()

      // Also try to get requests from the original session if different
      let allNetworkRequests = networkRequests
      if (originalNetworkSessionId !== sessionId) {
        logger.debug(`🔄 Also checking original session ${originalNetworkSessionId}`)
        await networkStorage.setSessionId(originalNetworkSessionId)
        const originalRequests = await networkStorage.getCurrentSessionRequests()
        logger.debug(`📊 Original session has ${originalRequests.length} requests`)

        // Merge both sets of requests
        allNetworkRequests = [...networkRequests, ...originalRequests]

        // Reset to export session
        await networkStorage.setSessionId(sessionId)
      }

      // Get current render data from MetricsCollector (not stored data)
      const metricsCollector = MetricsCollector.getInstance()
      let currentRenderEvents: any[] = []
      try {
        const currentMetrics = await metricsCollector.getCurrentMetrics()
        currentRenderEvents = currentMetrics.renderEvents || []
        logger.debug(`📊 Found ${currentRenderEvents.length} current render events`)
      } catch (error) {
        logger.debug('Failed to get current render events:', error)
      }

      // Merge network data with session data
      const enhancedSessionData = {
        ...sessionData,
        metrics: {
          ...sessionData.metrics,
          networkRequests: allNetworkRequests || [],
          renderEvents: currentRenderEvents || sessionData.metrics?.renderEvents || [],
        },
      }

      logger.debug(
        `📊 Found ${allNetworkRequests.length} network requests for session ${sessionId}`
      )

      // Build export structure
      const exportResult: ExportResult = {
        metadata: this.buildMetadata(enhancedSessionData),
        summary: this.buildSummary(enhancedSessionData),
        data: this.extractData(enhancedSessionData),
        sampling: {
          applied: false,
          originalSize: 0,
          sampledSize: 0,
          strategy: 'none',
        },
      }

      // Check size and apply sampling if needed
      const exportSizeBytes = this.calculateSize(exportResult)
      exportResult.sampling.originalSize = exportSizeBytes

      if (exportSizeBytes > this.MAX_FILE_SIZE_BYTES) {
        logger.debug(
          `📏 Export size ${Math.round(exportSizeBytes / (1024 * 1024))}MB exceeds limit, applying sampling`
        )
        this.applySampling(exportResult)
        exportResult.sampling.sampledSize = this.calculateSize(exportResult)
      } else {
        exportResult.sampling.sampledSize = exportSizeBytes
      }

      logger.debug(`✅ Export completed for session ${sessionId}`)
      return exportResult
    } catch (error) {
      logger.error('❌ Export failed:', error)
      return null
    }
  }

  private buildMetadata(sessionData: any): ExportMetadata {
    return {
      sessionId: sessionData.sessionId,
      startTime: new Date(sessionData.startTime).toISOString(),
      endTime: sessionData.endTime
        ? new Date(sessionData.endTime).toISOString()
        : new Date().toISOString(),
      duration: sessionData.endTime
        ? sessionData.endTime - sessionData.startTime
        : Date.now() - sessionData.startTime,
      device: sessionData.deviceInfo || {},
      app: {
        version: sessionData.appVersion || 'unknown',
        buildNumber: sessionData.buildNumber || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      },
      config: {
        maxStorageMB: 100,
        retentionDays: 7,
        enableNetworkMonitoring: true,
        enableRenderTracking: true,
        enableListPerformance: true,
      },
    }
  }

  private buildSummary(sessionData: any): ExportSummary {
    const metrics = sessionData.metrics || {}
    const networkRequests = metrics.networkRequests || []
    const renderEvents = metrics.renderEvents || []
    const listPerformance = metrics.listPerformance || []

    // Network summary
    const networkSummary = this.calculateNetworkSummary(networkRequests)

    // Render summary
    const renderSummary = this.calculateRenderSummary(renderEvents)

    // List summary
    const listSummary = this.calculateListSummary(listPerformance)

    return {
      network: networkSummary,
      render: renderSummary,
      lists: listSummary,
    }
  }

  private calculateNetworkSummary(requests: any[]): ExportSummary['network'] {
    if (requests.length === 0) {
      return { totalRequests: 0, slowestEndpoints: [] }
    }

    const responseTimes = requests
      .filter((req) => req.duration && req.duration > 0)
      .map((req) => req.duration)
      .sort((a, b) => a - b)

    const p50 = this.calculatePercentile(responseTimes, 50)
    const p90 = this.calculatePercentile(responseTimes, 90)
    const p95 = this.calculatePercentile(responseTimes, 95)

    // Calculate slowest endpoints
    const endpointStats = new Map<string, { total: number; count: number }>()
    requests.forEach((req) => {
      if (req.url && req.duration) {
        const key = this.normalizeUrl(req.url)
        const current = endpointStats.get(key) || { total: 0, count: 0 }
        endpointStats.set(key, { total: current.total + req.duration, count: current.count + 1 })
      }
    })

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([url, stats]) => ({ url, avgTime: stats.total / stats.count }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5)

    return {
      totalRequests: requests.length,
      p50ResponseTime: p50,
      p90ResponseTime: p90,
      p95ResponseTime: p95,
      slowestEndpoints,
    }
  }

  private calculateRenderSummary(renders: any[]): ExportSummary['render'] {
    if (renders.length === 0) {
      return { totalRenders: 0, topComponents: [] }
    }

    const componentStats = new Map<string, number>()
    let totalRenderTime = 0
    let renderTimeCount = 0

    renders.forEach((render) => {
      if (render.componentName) {
        componentStats.set(
          render.componentName,
          (componentStats.get(render.componentName) || 0) + 1
        )
      }
      if (render.actualDuration) {
        totalRenderTime += render.actualDuration
        renderTimeCount++
      }
    })

    const topComponents = Array.from(componentStats.entries())
      .map(([name, renderCount]) => ({ name, renderCount }))
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, 10)

    return {
      totalRenders: renders.length,
      topComponents,
      averageRenderTime: renderTimeCount > 0 ? totalRenderTime / renderTimeCount : undefined,
    }
  }

  private calculateListSummary(lists: any[]): ExportSummary['lists'] {
    if (lists.length === 0) {
      return { totalLists: 0 }
    }

    const validLists = lists.filter(
      (list) =>
        typeof list.scrollFPS === 'number' ||
        typeof list.drawTime === 'number' ||
        typeof list.blankAreaTime === 'number'
    )

    if (validLists.length === 0) {
      return { totalLists: lists.length }
    }

    const avgScrollFPS = this.calculateAverage(validLists, 'scrollFPS')
    const avgDrawTime = this.calculateAverage(validLists, 'drawTime')
    const avgBlankTime = this.calculateAverage(validLists, 'blankAreaTime')

    return {
      totalLists: lists.length,
      avgScrollFPS,
      avgDrawTime,
      avgBlankTime,
    }
  }

  private extractData(sessionData: any): ExportData {
    const metrics = sessionData.metrics || {}

    // Clean up network data for better readability
    const networkRequests = (metrics.networkRequests || []).map((req: any) => ({
      ...req,
      url: req.sanitizedUrl || req.url, // Rename sanitizedUrl to url for clarity
      sanitizedUrl: undefined, // Remove the old field
    }))

    // Aggregate list data to reduce noise (keep only significant changes)
    const listData = this.aggregateListData(metrics.listPerformance || [])

    return {
      network: networkRequests,
      renders: metrics.renderEvents || [],
      lists: listData,
    }
  }

  private aggregateListData(listData: any[]): any[] {
    if (listData.length === 0) return []

    // Group by listId
    const groupedLists = new Map<string, any[]>()
    listData.forEach((entry) => {
      const listId = entry.listId
      if (!groupedLists.has(listId)) {
        groupedLists.set(listId, [])
      }
      groupedLists.get(listId)?.push(entry)
    })

    const aggregatedResults: any[] = []

    // For each list, keep only significant entries
    for (const [_listId, entries] of groupedLists) {
      if (entries.length <= 5) {
        // Keep all if few entries
        aggregatedResults.push(...entries)
        continue
      }

      // Keep first, last, and entries with significant changes
      const significant = [entries[0]] // Always keep first

      for (let i = 1; i < entries.length - 1; i++) {
        const current = entries[i]
        const previous = entries[i - 1]

        // Keep if significant change in scroll position, memory, or FPS
        const scrollChange = Math.abs(
          (current.scrollMetrics?.scrollTop || 0) - (previous.scrollMetrics?.scrollTop || 0)
        )
        const memoryChange = Math.abs(
          (current.memoryUsage?.listMemoryMB || 0) - (previous.memoryUsage?.listMemoryMB || 0)
        )
        const fpsChange = Math.abs(
          (current.metrics?.scrollFPS || 0) - (previous.metrics?.scrollFPS || 0)
        )

        if (scrollChange > 100 || memoryChange > 10 || fpsChange > 5) {
          significant.push(current)
        }
      }

      // Always keep last
      if (entries.length > 1) {
        significant.push(entries[entries.length - 1])
      }

      // Add summary info
      const summary = {
        ...entries[0],
        _aggregated: true,
        _originalEntries: entries.length,
        _keptEntries: significant.length,
        _timeRange: {
          start: entries[0].timestamp,
          end: entries[entries.length - 1].timestamp,
          duration: entries[entries.length - 1].timestamp - entries[0].timestamp,
        },
      }

      aggregatedResults.push(summary, ...significant.slice(1))
    }

    return aggregatedResults
  }

  private calculateSize(data: any): number {
    try {
      const jsonString = JSON.stringify(data)
      return jsonString.length * 2 // Estimate UTF-16 encoding
    } catch (error) {
      logger.debug('Failed to calculate export size:', error)
      return 0
    }
  }

  private applySampling(exportResult: ExportResult): void {
    const originalNetworkCount = exportResult.data.network.length
    const originalRenderCount = exportResult.data.renders.length
    const originalListCount = exportResult.data.lists.length

    // Apply intelligent sampling - keep recent data and outliers
    exportResult.data.network = this.sampleNetworkData(exportResult.data.network)
    exportResult.data.renders = this.sampleRenderData(exportResult.data.renders)
    exportResult.data.lists = this.sampleListData(exportResult.data.lists)

    exportResult.sampling = {
      applied: true,
      originalSize: exportResult.sampling.originalSize,
      sampledSize: 0, // Will be recalculated
      strategy: `Intelligent sampling: network ${originalNetworkCount}→${exportResult.data.network.length}, renders ${originalRenderCount}→${exportResult.data.renders.length}, lists ${originalListCount}→${exportResult.data.lists.length}`,
    }

    logger.debug(`📊 Applied sampling: ${exportResult.sampling.strategy}`)
  }

  private sampleNetworkData(data: any[]): any[] {
    if (data.length <= 1000) return data

    // Sort by timestamp (most recent first)
    const sorted = [...data].sort((a, b) => (b.startTime || 0) - (a.startTime || 0))

    // Keep first 500 (most recent)
    const recent = sorted.slice(0, 500)

    // Keep slowest 200 from remaining
    const remaining = sorted.slice(500)
    const slowest = remaining
      .filter((req) => req.duration)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 200)

    // Keep failed requests (300 max)
    const failed = remaining.filter((req) => req.status >= 400).slice(0, 300)

    return [...recent, ...slowest, ...failed]
  }

  private sampleRenderData(data: any[]): any[] {
    if (data.length <= 2000) return data

    // Sort by timestamp (most recent first)
    const sorted = [...data].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    // Keep first 1000 (most recent)
    const recent = sorted.slice(0, 1000)

    // Keep slowest renders (500 max)
    const remaining = sorted.slice(1000)
    const slowest = remaining
      .filter((render) => render.actualDuration)
      .sort((a, b) => b.actualDuration - a.actualDuration)
      .slice(0, 500)

    return [...recent, ...slowest]
  }

  private sampleListData(data: any[]): any[] {
    if (data.length <= 500) return data

    // Keep most recent 300
    const sorted = [...data].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    const recent = sorted.slice(0, 300)

    // Keep worst performing 200
    const remaining = sorted.slice(300)
    const worstPerforming = remaining
      .filter((list) => list.scrollFPS || list.drawTime)
      .sort((a, b) => {
        const scoreA = (a.scrollFPS || 0) - (a.drawTime || 0)
        const scoreB = (b.scrollFPS || 0) - (b.drawTime || 0)
        return scoreA - scoreB // Lower is worse
      })
      .slice(0, 200)

    return [...recent, ...worstPerforming]
  }

  // Helper methods
  private calculatePercentile(sortedArray: number[], percentile: number): number | undefined {
    if (sortedArray.length === 0) return undefined

    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))]
  }

  private normalizeUrl(url: string | undefined): string {
    if (!url) return 'unknown-url'
    try {
      // Remove query parameters and keep only path
      const urlObj = new URL(url)
      return `${urlObj.origin}${urlObj.pathname}`
    } catch {
      // Fallback for invalid URLs
      return url.split('?')[0] || 'unknown-url'
    }
  }

  private calculateAverage(data: any[], field: string): number | undefined {
    const values = data
      .map((item) => item[field])
      .filter((val) => typeof val === 'number' && !isNaN(val))

    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : undefined
  }
}
