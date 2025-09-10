import { logger } from '../utils/logger'
import type { NetworkRequest, RenderEvent, ListPerformance, PerformanceSession } from '../types'
import { NetworkInterceptor } from './NetworkInterceptor'
import { NetworkStorage } from './NetworkStorage' 
import { RenderTracker } from './RenderTracker'
import { ListMonitor } from './ListMonitor'

/**
 * Service central pour collecter les métriques de tous les monitors
 * et les synchroniser avec la session active
 */
export class MetricsCollector {
  private static instance: MetricsCollector | null = null
  private currentSession: PerformanceSession | null = null
  private isActive = false
  
  // Services references
  private networkInterceptor: NetworkInterceptor
  private networkStorage: NetworkStorage  
  private renderTracker: RenderTracker
  private listMonitor: ListMonitor

  private constructor() {
    this.networkInterceptor = NetworkInterceptor.getInstance()
    this.networkStorage = NetworkStorage.getInstance()
    this.renderTracker = RenderTracker.getInstance()
    this.listMonitor = ListMonitor.getInstance()
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector()
    }
    return MetricsCollector.instance
  }

  /**
   * Démarre la collecte de métriques pour une session
   */
  async startCollection(session: PerformanceSession): Promise<boolean> {
    try {
      this.currentSession = session
      this.isActive = true
      
      logger.info('🚀 MetricsCollector: Starting metrics collection for session:', session.sessionId)
      
      // Check platform and environment
      logger.info(`Platform: ${typeof window !== 'undefined' ? 'Web' : 'React Native'}`)
      logger.info(`Environment: DEV=${__DEV__}, NODE_ENV=${process.env.NODE_ENV}`)
      
      // Start network interception with callback
      logger.debug('Starting network interception...')
      const networkStarted = this.networkInterceptor.start({
        onRequest: (request) => this.handleNetworkRequest(request),
        onResponse: (request) => this.handleNetworkResponse(request),
        onError: (request) => this.handleNetworkError(request)
      })
      
      // Start render tracking  
      logger.debug('Starting render tracking...')
      const renderStarted = this.renderTracker.startTracking()
      
      logger.info(`Network interception: ${networkStarted ? '✅' : '❌'}`)
      logger.info(`Render tracking: ${renderStarted ? '✅' : '❌'}`)
      
      const success = networkStarted && renderStarted
      logger.info(`🎯 MetricsCollector startup: ${success ? '✅ SUCCESS' : '❌ FAILED'}`)
      
      return success
    } catch (error) {
      logger.error('❌ Failed to start metrics collection:', error)
      return false
    }
  }

  /**
   * Arrête la collecte de métriques
   */
  async stopCollection(): Promise<boolean> {
    try {
      if (!this.isActive) {
        return true
      }

      logger.debug('⏹️ MetricsCollector: Stopping metrics collection')
      
      // Stop all services
      this.networkInterceptor.stop()
      this.renderTracker.stopTracking()
      
      this.isActive = false
      this.currentSession = null
      
      return true
    } catch (error) {
      logger.error('❌ Failed to stop metrics collection:', error)
      return false
    }
  }

  /**
   * Récupère les métriques actuelles de tous les services
   */
  async getCurrentMetrics(): Promise<{
    networkRequests: NetworkRequest[]
    renderEvents: RenderEvent[]
    listPerformance: ListPerformance[]
  }> {
    logger.debug('🔍 MetricsCollector: Getting current metrics...')
    try {
      // Get network requests from storage
      const networkRequests = await this.networkStorage.getCurrentSessionRequests()
      logger.debug(`🌐 Found ${networkRequests.length} network requests`)
      
      // Get render events from tracker
      const renderStats = this.renderTracker.getComponentStats()
      logger.debug(`🎨 Found ${renderStats.length} render stats`)
      const renderEvents: RenderEvent[] = renderStats.map((stat, index) => ({
        eventId: `render_${Date.now()}_${index}`,
        sessionId: this.currentSession?.sessionId || 'unknown',
        componentName: stat.componentName,
        renderCount: stat.renderCount,
        timestamp: Date.now(),
        phase: 'update' as const,
        actualDuration: stat.avgRenderTime || 0,
        baseDuration: stat.avgRenderTime || 0,
        triggerReason: (stat.lastTrigger as any) || 'unknown',
        childrenCount: 0,
        memoryUsage: this.getCurrentMemoryUsage()
      }))
      
      // Get list performance data
      const monitoringStatus = this.listMonitor.getMonitoringStatus()
      logger.debug(`📋 Found ${monitoringStatus.length} monitored lists`)
      const listPerformance: ListPerformance[] = monitoringStatus.map(status => ({
        listId: status.listId,
        sessionId: status.sessionId,
        timestamp: Date.now(),
        listType: status.listType as 'FlashList' | 'FlatList' | 'VirtualizedList',
        componentInfo: {
          listId: status.listId,
          componentName: undefined,
          screenName: undefined,
          listDescription: undefined,
          parentComponent: undefined,
          listPosition: undefined,
        },
        metrics: {
          blankAreaTime: 0,
          drawTime: 0,
          scrollFPS: 0,
          itemCount: 0,
          visibleItemCount: 0,
          averageItemHeight: 0,
          scrollEvents: 0,
          renderTime: 0,
          itemsRendered: 0,
          blankArea: 0,
          fps: 0
        }
      }))
      
      logger.verbose(`📊 Current metrics - Network: ${networkRequests.length}, Renders: ${renderEvents.length}, Lists: ${listPerformance.length}`)
      
      return {
        networkRequests,
        renderEvents, 
        listPerformance
      }
    } catch (error) {
      logger.error('❌ Failed to get current metrics:', error)
      return {
        networkRequests: [],
        renderEvents: [],
        listPerformance: []
      }
    }
  }

  /**
   * Met à jour la session avec les métriques actuelles
   */
  async updateSessionMetrics(): Promise<PerformanceSession | null> {
    if (!this.currentSession || !this.isActive) {
      return null
    }

    try {
      const metrics = await this.getCurrentMetrics()
      
      const updatedSession: PerformanceSession = {
        ...this.currentSession,
        metrics,
        totalMemoryUsageMB: this.getCurrentMemoryUsage()
      }

      this.currentSession = updatedSession
      return updatedSession
    } catch (error) {
      logger.error('❌ Failed to update session metrics:', error)
      return this.currentSession
    }
  }

  /**
   * Gestionnaires d'événements réseau
   */
  private handleNetworkRequest(request: Partial<NetworkRequest>): void {
    logger.verbose('🌐 Network request started:', request.method, request.url)
  }

  private handleNetworkResponse(request: NetworkRequest): void {
    logger.verbose('🌐 Network response:', request.method, request.url, request.status?.code)
    
    // Store in network storage
    this.networkStorage.storeNetworkRequest(request)
  }

  private handleNetworkError(request: NetworkRequest): void {
    logger.verbose('🌐 Network error:', request.method, request.url, request.error)
    
    // Store in network storage
    this.networkStorage.storeNetworkRequest(request)
  }

  /**
   * Utilitaires
   */
  private getCurrentMemoryUsage(): number {
    try {
      if (typeof performance !== 'undefined' && (performance as any).memory) {
        const memInfo = (performance as any).memory
        return memInfo.usedJSHeapSize / (1024 * 1024) // Convert to MB
      }
      return 0
    } catch {
      return 0
    }
  }

  /**
   * Vérifie si la collecte est active
   */
  isCollecting(): boolean {
    return this.isActive && this.currentSession !== null
  }

  /**
   * Récupère la session courante
   */
  getCurrentSession(): PerformanceSession | null {
    return this.currentSession
  }
}