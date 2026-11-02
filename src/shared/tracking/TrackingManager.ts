/**
 * 🏗️ TrackingManager - Centralized Service with Buffers
 *
 * This manager replaces the Zustand singleton with an isolated buffer system
 * per page, eliminating race conditions and capturedState complexity.
 */

import { AppLifecycleManager } from './AppLifecycleManager'
import { TrackingLogger } from './TrackingLogger'

type PlaylistTrackingInfo = {
  moduleId: string
  itemType: 'offer' | 'venue' | 'artist' | 'unknown'
  callId: string
  index: number
  viewedAt: Date
  items: { key: string; index: number | null }[]
  extra?: Record<string, string | undefined>
  searchId?: string
  pageLocation?: string
  entryId?: string
}

export type PageTrackingInfo = {
  pageLocation: string
  pageId: string
  playlists: PlaylistTrackingInfo[]
}

export interface TrackingData {
  moduleId: string
  itemType: 'offer' | 'venue' | 'artist' | 'unknown'
  callId?: string
  index?: number
  items: { key: string; index: number | null }[]
  extra?: Record<string, string | undefined>
  searchId?: string
  entryId?: string
}

interface PageTrackingConfig {
  pageLocation: string
  pageId: string
}

/**
 * Isolated buffer for a specific page
 * Replaces the fragile singleton with independent buffers
 */
class TrackingBuffer {
  private readonly data = new Map<string, PlaylistTrackingInfo>()
  private readonly config: PageTrackingConfig

  constructor(config: PageTrackingConfig) {
    this.config = config
  }

  /**
   * Add or update module data
   */
  addModuleData(trackingData: TrackingData) {
    const {
      moduleId,
      itemType,
      callId = '',
      index = -1,
      items,
      extra,
      searchId,
      entryId,
    } = trackingData

    const existing = this.data.get(moduleId)
    const playlistInfo: PlaylistTrackingInfo = {
      moduleId,
      itemType,
      callId: callId || existing?.callId || '',
      index: index === -1 ? existing?.index || -1 : index,
      viewedAt: new Date(),
      items: this.mergeItems(existing?.items || [], items),
      extra: { ...existing?.extra, ...extra },
      ...(searchId ? { searchId } : {}),
      ...(entryId ? { entryId } : {}),
      pageLocation: this.config.pageLocation,
    }

    this.data.set(moduleId, playlistInfo)

    TrackingLogger.debug('BUFFER_MODULE_UPDATED', {
      pageId: this.config.pageId,
      moduleId,
      itemsCount: playlistInfo.items.length,
      bufferSize: this.data.size,
    })
  }

  /**
   * Merge items avoiding duplicates by key
   */
  private mergeItems(
    existing: { key: string; index: number | null }[],
    newItems: { key: string; index: number | null }[]
  ): { key: string; index: number | null }[] {
    const allItems = [...existing, ...newItems]
    const uniqueItems = allItems.reduce(
      (acc, item) => {
        acc[item.key] = item // Le dernier index gagne en cas de doublon
        return acc
      },
      {} as Record<string, { key: string; index: number | null }>
    )

    return Object.values(uniqueItems)
  }

  /**
   * Get all buffer data
   */
  getData(): PageTrackingInfo {
    return {
      pageId: this.config.pageId,
      pageLocation: this.config.pageLocation,
      playlists: Array.from(this.data.values()),
    }
  }

  /**
   * Check if buffer contains data
   */
  hasData(): boolean {
    return this.data.size > 0
  }

  /**
   * Vide le buffer
   */
  clear() {
    const previousSize = this.data.size
    this.data.clear()

    TrackingLogger.debug('BUFFER_CLEARED', {
      pageId: this.config.pageId,
      previousModulesCount: previousSize,
    })
  }

  /**
   * Stats pour debugging
   */
  getStats() {
    const playlists = Array.from(this.data.values())
    return {
      modulesCount: this.data.size,
      totalItems: playlists.reduce((sum, p) => sum + p.items.length, 0),
      modules: playlists.map((p) => ({
        moduleId: p.moduleId,
        itemType: p.itemType,
        itemsCount: p.items.length,
      })),
    }
  }
}

/**
 * Manager central pour tous les buffers de tracking
 */
class TrackingManagerService {
  private static instance: TrackingManagerService
  private readonly pageBuffers = new Map<string, TrackingBuffer>()
  private isInitialized = false
  // Prevents duplicate sends when multiple web lifecycle events fire in cascade
  private readonly sendingBuffers = new Set<string>()

  static getInstance(): TrackingManagerService {
    if (!TrackingManagerService.instance) {
      TrackingManagerService.instance = new TrackingManagerService()
    }
    return TrackingManagerService.instance
  }

  /**
   * Initialize the manager and integration with AppLifecycleManager
   */
  initialize() {
    if (this.isInitialized) return

    // Ensure AppLifecycleManager is initialized
    AppLifecycleManager.initialize()

    this.isInitialized = true

    TrackingLogger.info('TRACKING_MANAGER_INITIALIZED', {
      timestamp: Date.now().toString(),
    })
  }

  /**
   * Register a new page with its isolated buffer
   */
  registerPage(pageId: string, config: PageTrackingConfig) {
    // Clean up old buffer if existing
    if (this.pageBuffers.has(pageId)) {
      TrackingLogger.debug('PAGE_BUFFER_REPLACED', {
        pageId,
        oldConfig: this.pageBuffers.get(pageId)?.getData(),
      })
    }

    const buffer = new TrackingBuffer(config)
    this.pageBuffers.set(pageId, buffer)

    // Enregistrer dans AppLifecycleManager
    AppLifecycleManager.registerPage(pageId, (_pageId, event) => {
      this.handleAppEvent(pageId, event)
    })

    TrackingLogger.info('PAGE_BUFFER_REGISTERED', {
      pageId,
      pageLocation: config.pageLocation,
      totalBuffers: this.pageBuffers.size,
    })
  }

  /**
   * Deactivate and clean up a page's buffer
   */
  unregisterPage(pageId: string) {
    const buffer = this.pageBuffers.get(pageId)
    if (!buffer) {
      TrackingLogger.debug('PAGE_BUFFER_NOT_FOUND', { pageId })
      return
    }

    // No need to send data here - Focus Lost already handles it
    // This prevents duplicate analytics sends
    TrackingLogger.debug('UNREGISTER_NO_SEND', {
      pageId,
      hasData: buffer.hasData(),
      message: 'Focus Lost already handled analytics - no duplicate send',
    })

    // Clean up
    this.pageBuffers.delete(pageId)
    AppLifecycleManager.unregisterPage(pageId)

    TrackingLogger.info('PAGE_BUFFER_UNREGISTERED', {
      pageId,
      remainingBuffers: this.pageBuffers.size,
    })
  }

  /**
   * Add tracking data for a page
   */
  addTrackingData(pageId: string, data: TrackingData) {
    const buffer = this.pageBuffers.get(pageId)
    if (!buffer) {
      TrackingLogger.error('BUFFER_NOT_FOUND', {
        pageId,
        moduleId: data.moduleId,
        availableBuffers: Array.from(this.pageBuffers.keys()),
      })
      return
    }

    buffer.addModuleData(data)

    TrackingLogger.debug('TRACKING_DATA_ADDED', {
      pageId,
      moduleId: data.moduleId,
      itemsCount: data.items.length,
      bufferStats: buffer.getStats(),
    })
  }

  /**
   * Send buffer data if needed (for focus lost events)
   * Doesn't clear/unregister the page like unregisterPage does
   * Public method to be called from usePageTracking
   */
  sendBufferIfNeeded(pageId: string) {
    const buffer = this.pageBuffers.get(pageId)
    if (!buffer?.hasData()) {
      TrackingLogger.debug('NO_DATA_TO_SEND_ON_FOCUS_LOST', { pageId })
      return
    }

    TrackingLogger.info('🔄 SENDING_ON_FOCUS_LOST', {
      pageId,
      stats: buffer.getStats(),
      reason: 'page_focus_lost',
    })

    this.sendAndClearBuffer(pageId)
  }

  /**
   * AppLifecycle events handler
   */
  private handleAppEvent(pageId: string, event: 'background' | 'foreground') {
    TrackingLogger.info('APP_EVENT_RECEIVED', {
      pageId,
      event,
      timestamp: Date.now().toString(),
    })

    if (event === 'background') {
      this.sendAndClearBuffer(pageId)
    }
    // Note: 'foreground' could be used for future logic
  }

  /**
   * Send data and clear buffer
   * Protected against duplicate sends from multiple web lifecycle events
   */
  private async sendAndClearBuffer(pageId: string) {
    // Prevent duplicate sends when multiple events fire in cascade
    // (visibilitychange + pagehide + beforeunload, or React Native Web's AppState)
    if (this.sendingBuffers.has(pageId)) {
      TrackingLogger.debug('SEND_ALREADY_IN_PROGRESS', { pageId })
      return
    }

    const buffer = this.pageBuffers.get(pageId)
    if (!buffer?.hasData()) {
      TrackingLogger.debug('NO_DATA_TO_SEND', { pageId })
      return
    }

    // Mark as sending to prevent concurrent sends
    this.sendingBuffers.add(pageId)

    // Visible log to confirm this method is called
    TrackingLogger.info('SEND_BUFFER_TRIGGERED', {
      pageId,
      timestamp: new Date().toISOString(),
      message: 'sendAndClearBuffer method called - analytics will be sent',
    })

    const data = buffer.getData()
    const stats = buffer.getStats()

    TrackingLogger.info('SENDING_ANALYTICS', {
      pageId,
      pageLocation: data.pageLocation,
      ...stats,
    })

    try {
      // 🎯 Log détaillé de TOUTES les données avant envoi analytics
      TrackingLogger.info('PRE_ANALYTICS_SEND_DETAIL', {
        pageId,
        pageLocation: data.pageLocation,
        totalPlaylists: data.playlists.length,
        totalItems: data.playlists.reduce((sum, p) => sum + p.items.length, 0),
        analyticsData: {
          pageId: data.pageId,
          pageLocation: data.pageLocation,
          playlists: data.playlists.map((playlist) => ({
            moduleId: playlist.moduleId,
            itemType: playlist.itemType,
            callId: playlist.callId,
            index: playlist.index,
            itemsCount: playlist.items.length,
            items: playlist.items.map((item) => `${item.index ?? 'null'}:${item.key}`).join(','),
            extra: playlist.extra,
            viewedAt: playlist.viewedAt.toISOString(),
            searchId: playlist.searchId,
            entryId: playlist.entryId,
          })),
        },
      })

      await TrackingLogger.timeAsync(
        'ANALYTICS_SEND',
        async () => {
          // Import de la fonction existante
          const { logViewItem } = await import('shared/analytics/logViewItem')
          await logViewItem(data)
        },
        {
          pageId,
          modulesCount: stats.modulesCount,
        }
      )

      TrackingLogger.info('ANALYTICS_SUCCESS', {
        pageId,
        pageLocation: data.pageLocation,
        sentData: {
          totalPlaylists: data.playlists.length,
          totalItems: data.playlists.reduce((sum, p) => sum + p.items.length, 0),
          modulesSummary: data.playlists.map((p) => ({
            moduleId: p.moduleId,
            itemType: p.itemType,
            itemsCount: p.items.length,
            hasCallId: Boolean(p.callId),
            hasSearchId: Boolean(p.searchId),
          })),
        },
        ...stats,
        duration: 'measured_above',
      })

      buffer.clear()
    } catch (error) {
      TrackingLogger.error('ANALYTICS_FAILED', {
        pageId,
        error: error instanceof Error ? error.message : String(error),
        willRetry: false, // Pour l'instant, pas de retry
        dataSize: JSON.stringify(data).length,
      })
    } finally {
      // Always remove from sending set, even on error
      this.sendingBuffers.delete(pageId)
    }
  }

  /**
   * API pour debugging
   */
  getDebugInfo() {
    const buffers = Array.from(this.pageBuffers.entries()).map(([pageId, buffer]) => ({
      pageId,
      config: buffer.getData(),
      stats: buffer.getStats(),
    }))

    return {
      isInitialized: this.isInitialized,
      buffersCount: this.pageBuffers.size,
      buffers,
    }
  }

  /**
   * Force l'envoi pour une page (pour tests)
   */
  __forceSend(pageId: string) {
    if (!__DEV__) return
    this.sendAndClearBuffer(pageId)
  }

  /**
   * Reset pour tests
   */
  __resetForTesting() {
    if (!__DEV__) return

    this.pageBuffers.clear()
    this.sendingBuffers.clear()
    this.isInitialized = false

    TrackingLogger.debug('TRACKING_MANAGER_RESET', {
      resetComplete: true,
    })
  }
}

// Export singleton
export const TrackingManager = TrackingManagerService.getInstance()

// Global debug interface
declare global {
  interface Window {
    __TRACKING_MANAGER_DEBUG__?: {
      getInfo: () => unknown
      forceSend: (pageId: string) => void
      reset: () => void
    }
  }
}

if (__DEV__ && globalThis.window !== undefined) {
  globalThis.window.__TRACKING_MANAGER_DEBUG__ = {
    getInfo: () => TrackingManager.getDebugInfo(),
    forceSend: (pageId: string) => TrackingManager.__forceSend(pageId),
    reset: () => TrackingManager.__resetForTesting(),
  }
}
