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
  private readonly pageListeners = new Map<string, PageListener>()
  // Web-specific properties
  private webListenersAttached = false
  private lastVisibilityState: DocumentVisibilityState | null = null
  // Store bound handlers for cleanup
  private boundWebHandlers: {
    visibilityChange: () => void
    pageHide: (event: PageTransitionEvent) => void
    beforeUnload: (event: BeforeUnloadEvent) => void
  } | null = null

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

    // Initialize web-specific listeners for browser tab close/navigation
    this.initializeWebListeners()

    this.isInitialized = true

    TrackingLogger.info('APP_LIFECYCLE_READY', {
      listenersRegistered: true,
      singletonInitialized: true,
    })
  }

  /**
   * Initialize web-specific lifecycle listeners
   * These capture browser events that AppState doesn't handle reliably on web
   */
  private initializeWebListeners() {
    // Only attach web listeners in browser environment
    if (
      typeof globalThis.window === 'undefined' ||
      typeof document === 'undefined' ||
      this.webListenersAttached
    ) {
      return
    }

    // Store bound handlers for later cleanup
    this.boundWebHandlers = {
      visibilityChange: this.handleVisibilityChange.bind(this),
      pageHide: this.handlePageHide.bind(this),
      beforeUnload: this.handleBeforeUnload.bind(this),
    }

    document.addEventListener('visibilitychange', this.boundWebHandlers.visibilityChange)
    globalThis.window.addEventListener('pagehide', this.boundWebHandlers.pageHide)
    globalThis.window.addEventListener('beforeunload', this.boundWebHandlers.beforeUnload)

    this.webListenersAttached = true
    this.lastVisibilityState = document.visibilityState

    TrackingLogger.info('WEB_LIFECYCLE_LISTENERS_ATTACHED', {
      hasVisibilityChange: true,
      hasPageHide: true,
      hasBeforeUnload: true,
    })
  }

  /**
   * Handle visibility change (tab switch, minimize, etc.)
   */
  private handleVisibilityChange() {
    const currentState = document.visibilityState
    const previousState = this.lastVisibilityState
    this.lastVisibilityState = currentState

    TrackingLogger.info('WEB_VISIBILITY_CHANGE', {
      previousState,
      currentState,
      activePageId: this.activePageId,
    })

    if (previousState === 'visible' && currentState === 'hidden') {
      this.triggerWebBackgroundEvent('visibilitychange')
    } else if (previousState === 'hidden' && currentState === 'visible') {
      this.notifyActivePageOnly('foreground')
    }
  }

  /**
   * Handle page hide (navigation, tab close)
   */
  private handlePageHide(event: PageTransitionEvent) {
    TrackingLogger.info('WEB_PAGEHIDE', {
      persisted: event.persisted,
      activePageId: this.activePageId,
    })
    this.triggerWebBackgroundEvent('pagehide')
  }

  /**
   * Handle before unload (tab close, navigation)
   */
  private handleBeforeUnload(_event: BeforeUnloadEvent) {
    TrackingLogger.info('WEB_BEFOREUNLOAD', {
      activePageId: this.activePageId,
    })
    this.triggerWebBackgroundEvent('beforeunload')
  }

  /**
   * Trigger background event from web lifecycle events
   */
  private triggerWebBackgroundEvent(source: 'visibilitychange' | 'pagehide' | 'beforeunload') {
    if (!this.activePageId) {
      TrackingLogger.debug('WEB_BACKGROUND_NO_ACTIVE_PAGE', { source })
      return
    }

    const activeListener = this.pageListeners.get(this.activePageId)
    if (!activeListener) {
      // Use debug level: this can happen normally if page was unregistered before web event fired
      TrackingLogger.debug('WEB_BACKGROUND_LISTENER_NOT_FOUND', {
        source,
        activePageId: this.activePageId,
      })
      return
    }

    TrackingLogger.info('WEB_BACKGROUND_TRIGGERED', {
      source,
      activePageId: this.activePageId,
    })

    try {
      activeListener.handler(this.activePageId, 'background')
    } catch (error) {
      TrackingLogger.error('WEB_BACKGROUND_HANDLER_ERROR', {
        source,
        error: error instanceof Error ? error.message : String(error),
      })
    }
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
      // Web-specific debug info
      webListenersAttached: this.webListenersAttached,
      lastVisibilityState: this.lastVisibilityState,
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

    // Remove web listeners before resetting
    this.removeWebListeners()
    // Reset web-specific properties
    this.webListenersAttached = false
    this.lastVisibilityState = null
    this.boundWebHandlers = null

    TrackingLogger.debug('MANAGER_RESET_FOR_TESTING', {
      resetComplete: true,
    })
  }

  /**
   * Remove web-specific event listeners (for cleanup/testing)
   */
  private removeWebListeners() {
    if (
      typeof globalThis.window === 'undefined' ||
      typeof document === 'undefined' ||
      !this.boundWebHandlers
    ) {
      return
    }

    document.removeEventListener('visibilitychange', this.boundWebHandlers.visibilityChange)
    globalThis.window.removeEventListener('pagehide', this.boundWebHandlers.pageHide)
    globalThis.window.removeEventListener('beforeunload', this.boundWebHandlers.beforeUnload)

    TrackingLogger.debug('WEB_LIFECYCLE_LISTENERS_REMOVED', {
      cleanupComplete: true,
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
      testWebUnload: () => void
      getWebListenerStatus: () => { attached: boolean; lastVisibility: string | null }
    }
  }
}

if (__DEV__ && globalThis.window !== undefined) {
  globalThis.window.__APP_LIFECYCLE_DEBUG__ = {
    getInfo: () => AppLifecycleManager.getDebugInfo(),
    reset: () => AppLifecycleManager.__resetForTesting(),
    setActivePage: (pageId: string) => AppLifecycleManager.setActivePage(pageId),
    testWebUnload: () => {
      // Simulate visibility change to hidden for testing
      // Note: This temporarily overrides visibilityState for the test
      const originalDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState')
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
        configurable: true,
      })
      try {
        const event = new Event('visibilitychange')
        document.dispatchEvent(event)
      } finally {
        // Always restore original descriptor, even if dispatch throws
        if (originalDescriptor) {
          Object.defineProperty(document, 'visibilityState', originalDescriptor)
        }
      }
    },
    getWebListenerStatus: () => {
      const info = AppLifecycleManager.getDebugInfo() as {
        webListenersAttached: boolean
        lastVisibilityState: string | null
      }
      return {
        attached: info.webListenersAttached,
        lastVisibility: info.lastVisibilityState,
      }
    },
  }
}
