/**
 * 🏗️ AppLifecycleManager - Singleton Lifecycle
 *
 * This manager centralizes AppState event handling to prevent
 * multiple listeners that cause analytics duplicates.
 *
 * OBJECTIVE: One single AppState listener for the entire application
 */

import { AppState, AppStateStatus } from 'react-native'

import { TrackingLogger } from './TrackingLogger'

type AppEventType = 'background' | 'foreground'
type AppEventHandler = (pageId: string, event: AppEventType) => void

interface PageListener {
  pageId: string
  handler: AppEventHandler
  isFocused: boolean
}

class AppLifecycleManagerService {
  private static instance: AppLifecycleManagerService
  private isInitialized = false
  private currentAppState: AppStateStatus = AppState.currentState
  private activePageId: string | null = null
  private pageListeners = new Map<string, PageListener>()

  static getInstance(): AppLifecycleManagerService {
    if (!AppLifecycleManagerService.instance) {
      AppLifecycleManagerService.instance = new AppLifecycleManagerService()
    }
    return AppLifecycleManagerService.instance
  }

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Initialize the global AppState listener
   * ⚠️ Must be called only once at app startup
   */
  initialize() {
    if (this.isInitialized) {
      TrackingLogger.debug('APP_LIFECYCLE_ALREADY_INITIALIZED', {
        activePageId: this.activePageId,
        listenersCount: this.pageListeners.size,
      })
      return
    }

    TrackingLogger.info('APP_LIFECYCLE_INIT', {
      initialAppState: this.currentAppState,
      timestamp: Date.now().toString(),
    })

    AppState.addEventListener('change', this.handleAppStateChange.bind(this))
    this.isInitialized = true

    TrackingLogger.info('APP_LIFECYCLE_READY', {
      listenersRegistered: true,
      singletonInitialized: true,
    })
  }

  /**
   * Register a page to receive lifecycle events
   */
  registerPage(pageId: string, handler: AppEventHandler) {
    if (this.pageListeners.has(pageId)) {
      TrackingLogger.debug('PAGE_ALREADY_REGISTERED', {
        pageId,
        replacingExisting: true,
      })
    }

    this.pageListeners.set(pageId, {
      pageId,
      handler,
      isFocused: false,
    })

    TrackingLogger.info('PAGE_REGISTERED', {
      pageId,
      totalPages: this.pageListeners.size,
      activePageId: this.activePageId,
    })
  }

  /**
   * Unregister une page (cleanup)
   */
  unregisterPage(pageId: string) {
    const existed = this.pageListeners.delete(pageId)

    if (this.activePageId === pageId) {
      this.activePageId = null
      TrackingLogger.info('ACTIVE_PAGE_UNREGISTERED', {
        pageId,
        newActivePageId: null,
      })
    }

    TrackingLogger.info('PAGE_UNREGISTERED', {
      pageId,
      existed,
      remainingPages: this.pageListeners.size,
    })
  }

  /**
   * Set which page is currently active/focused
   * ⭐ CRITICAL: Only this page will receive AppState events
   */
  setActivePage(pageId: string) {
    const previousActivePageId = this.activePageId
    this.activePageId = pageId

    // Marquer la page comme focused
    const pageListener = this.pageListeners.get(pageId)
    if (pageListener) {
      pageListener.isFocused = true
    }

    // Marquer les autres pages comme unfocused
    for (const [id, listener] of this.pageListeners) {
      if (id !== pageId) {
        listener.isFocused = false
      }
    }

    TrackingLogger.info('ACTIVE_PAGE_CHANGED', {
      previousPageId: previousActivePageId,
      newPageId: pageId,
      totalRegisteredPages: this.pageListeners.size,
      focusedPages: Array.from(this.pageListeners.values())
        .filter((l) => l.isFocused)
        .map((l) => l.pageId),
    })
  }

  /**
   * Handler central des changements AppState
   * 🎯 UN SEUL HANDLER pour toute l'app
   */
  private handleAppStateChange(nextAppState: AppStateStatus) {
    const previousState = this.currentAppState
    this.currentAppState = nextAppState

    const event = this.determineEvent(previousState, nextAppState)
    if (!event) return

    TrackingLogger.info('APP_STATE_CHANGED', {
      previousState,
      nextState: nextAppState,
      event,
      activePageId: this.activePageId,
      registeredPages: Array.from(this.pageListeners.keys()),
    })

    // 🎯 ONLY the active page receives the event
    this.notifyActivePageOnly(event)
  }

  /**
   * Determine event type based on state change
   */
  private determineEvent(previous: AppStateStatus, next: AppStateStatus): AppEventType | null {
    const wasActive = previous === 'active'
    const isNowInactive = next === 'inactive' || next === 'background'
    const wasInactive = previous === 'inactive' || previous === 'background'
    const isNowActive = next === 'active'

    if (wasActive && isNowInactive) {
      return 'background'
    }
    if (wasInactive && isNowActive) {
      return 'foreground'
    }
    return null
  }

  /**
   * Notifie SEULEMENT la page active
   * 🎯 Solves the multiple listeners problem
   */
  private notifyActivePageOnly(event: AppEventType) {
    if (!this.activePageId) {
      TrackingLogger.debug('NO_ACTIVE_PAGE', {
        event,
        registeredPages: Array.from(this.pageListeners.keys()),
      })
      return
    }

    const activeListener = this.pageListeners.get(this.activePageId)
    if (!activeListener) {
      TrackingLogger.error('ACTIVE_PAGE_NOT_FOUND', {
        activePageId: this.activePageId,
        event,
        availablePages: Array.from(this.pageListeners.keys()),
      })
      return
    }

    TrackingLogger.info('NOTIFYING_ACTIVE_PAGE', {
      activePageId: this.activePageId,
      event,
      otherPagesIgnored: this.pageListeners.size - 1,
    })

    try {
      const pageId = this.activePageId
      if (!pageId) return

      TrackingLogger.time(
        `HANDLE_${event.toUpperCase()}`,
        () => {
          activeListener.handler(pageId, event)
        },
        {
          pageId,
          event,
        }
      )
    } catch (error) {
      TrackingLogger.error('PAGE_HANDLER_ERROR', {
        activePageId: this.activePageId,
        event,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * API pour debugging et inspection
   */
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      currentAppState: this.currentAppState,
      activePageId: this.activePageId,
      registeredPages: Array.from(this.pageListeners.keys()),
      focusedPages: Array.from(this.pageListeners.values())
        .filter((l) => l.isFocused)
        .map((l) => l.pageId),
    }
  }

  /**
   * Pour les tests: reset complet du manager
   */
  __resetForTesting() {
    if (!__DEV__) return

    this.pageListeners.clear()
    this.activePageId = null
    this.isInitialized = false
    this.currentAppState = AppState.currentState

    TrackingLogger.debug('MANAGER_RESET_FOR_TESTING', {
      resetComplete: true,
    })
  }
}

// Export singleton instance
export const AppLifecycleManager = AppLifecycleManagerService.getInstance()

// Global debug interface
declare global {
  interface Window {
    __APP_LIFECYCLE_DEBUG__?: {
      getInfo: () => unknown
      reset: () => void
      setActivePage: (pageId: string) => void
    }
  }
}

if (__DEV__ && typeof window !== 'undefined') {
  window.__APP_LIFECYCLE_DEBUG__ = {
    getInfo: () => AppLifecycleManager.getDebugInfo(),
    reset: () => AppLifecycleManager.__resetForTesting(),
    setActivePage: (pageId: string) => AppLifecycleManager.setActivePage(pageId),
  }
}
