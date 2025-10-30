/**
 * 🏗️ Unified usePageTracking Hook
 *
 * This hook replaces both:
 * - Manual GenericHome logic
 * - useViewItemTracking hook for Artist/Venue
 *
 * Unified API for all pages in the tracking system.
 */

import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef } from 'react'
import { ViewToken } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { analytics } from 'libs/analytics/provider'
import { setViewOfferTrackingFn } from 'shared/analytics/logViewItem'

import { AppLifecycleManager } from './AppLifecycleManager'
import { TrackingLogger } from './TrackingLogger'
import { TrackingData, TrackingManager } from './TrackingManager'

interface UsePageTrackingConfig {
  /**
   * Nom de la page pour les logs (ex: "Home", "Artist", "Venue")
   */
  pageName: string
  /**
   * Location de la page (ex: "home", "artist", "venue")
   */
  pageLocation: string
  /**
   * ID unique de la page (optionnel - sera généré si non fourni)
   */
  pageId?: string
}

type ItemType = 'offer' | 'venue' | 'artist' | 'unknown'

interface TrackingHandlers {
  /**
   * Handler pour les changements d'items visibles
   * Remplace handleViewableItemsChanged dans toutes les pages
   */
  trackViewableItems: (params: {
    moduleId: string
    itemType?: ItemType
    viewableItems: Pick<ViewToken, 'key' | 'index'>[]
    callId?: string
    extra?: Record<string, string | undefined>
    artistId?: string
    playlistIndex?: number
    searchId?: string
    entryId?: string
  }) => void

  /**
   * Handler pour forcer l'envoi (pour tests/debugging)
   */
  forceSend: () => void
}

/**
 * Unified hook for tracking all pages
 */
export function usePageTracking(config: UsePageTrackingConfig): TrackingHandlers {
  const pageId = useRef(config.pageId || generatePageId(config.pageLocation)).current
  const isInitialized = useRef(false)

  // Initialize the system on first use
  useEffect(() => {
    if (!isInitialized.current) {
      TrackingLogger.info('PAGE_TRACKING_INIT', {
        pageId,
        pageName: config.pageName,
        pageLocation: config.pageLocation,
      })

      // Ensure managers are initialized
      TrackingManager.initialize()

      // Setup analytics function (as in existing code)
      setViewOfferTrackingFn(analytics.logViewItem)

      isInitialized.current = true
    }
  }, [config.pageName, config.pageLocation, pageId])

  // Enregistrer la page avec son buffer
  useEffect(() => {
    const pageConfig = {
      pageId,
      pageLocation: config.pageLocation,
    }

    TrackingManager.registerPage(pageId, pageConfig)

    TrackingLogger.info('PAGE_REGISTERED', {
      pageId,
      pageName: config.pageName,
      pageLocation: config.pageLocation,
    })

    return () => {
      TrackingLogger.info('🚪 PAGE_UNREGISTERING', {
        pageId,
        pageName: config.pageName,
        message: 'Page cleanup - should trigger analytics send if data exists',
      })

      TrackingManager.unregisterPage(pageId)
    }
  }, [pageId, config.pageLocation, config.pageName])

  // Handle page focus
  useFocusEffect(
    useCallback(() => {
      TrackingLogger.info('PAGE_FOCUS_GAINED', {
        pageId,
        pageName: config.pageName,
        pageLocation: config.pageLocation,
      })

      // Set this page as active for AppLifecycleManager
      AppLifecycleManager.setActivePage(pageId)

      return () => {
        TrackingLogger.info('🔄 PAGE_FOCUS_LOST', {
          pageId,
          pageName: config.pageName,
          message: 'Page lost focus - sending analytics if data exists',
        })

        // 🎯 Send analytics when page loses focus (navigation)
        TrackingManager.sendBufferIfNeeded(pageId)

        // Note: Don't deactivate page here as it could be
        // temporarily unfocused but still in the stack
      }
    }, [pageId, config.pageName, config.pageLocation])
  )

  // Handler pour tracking des items visibles
  const trackViewableItems = useCallback(
    (params: {
      moduleId: string
      itemType?: 'offer' | 'venue' | 'artist' | 'unknown'
      viewableItems: Pick<ViewToken, 'key' | 'index'>[]
      callId?: string
      extra?: Record<string, string | undefined>
      artistId?: string
      playlistIndex?: number
      searchId?: string
      entryId?: string
    }) => {
      const {
        moduleId,
        itemType = 'unknown',
        viewableItems,
        callId = '',
        extra,
        artistId,
        playlistIndex,
        searchId,
        entryId,
      } = params

      if (!moduleId || !viewableItems.length) {
        TrackingLogger.debug('TRACKING_IGNORED', {
          pageId,
          reason: moduleId ? 'no_viewableItems' : 'no_moduleId',
          moduleId,
          itemsCount: viewableItems.length,
        })
        return
      }

      const trackingData: TrackingData = {
        moduleId,
        itemType,
        callId,
        index: playlistIndex ?? -1,
        items: viewableItems.map((item) => ({
          key: item.key,
          index: item.index,
        })),
        extra,
        ...(artistId ? { artistId } : {}),
        ...(searchId ? { searchId } : {}),
        ...(entryId ? { entryId } : {}),
      }

      try {
        TrackingManager.addTrackingData(pageId, trackingData)
      } catch (error) {
        TrackingLogger.error('TRACKING_ERROR', {
          pageId,
          moduleId,
          error: error instanceof Error ? error.message : String(error),
        })
        return // Skip le log de debug si erreur
      }

      TrackingLogger.debug('VIEWABLE_ITEMS_TRACKED', {
        pageId,
        pageName: config.pageName,
        moduleId,
        itemType,
        itemsCount: viewableItems.length,
        callId: callId || 'empty',
        hasExtra: !!extra,
        hasArtistId: !!artistId,
        hasSearchId: !!searchId,
      })
    },
    [pageId, config.pageName]
  )

  // Handler pour forcer l'envoi (debugging)
  const forceSend = useCallback(() => {
    if (__DEV__) {
      TrackingLogger.info('FORCE_SEND_REQUESTED', {
        pageId,
        pageName: config.pageName,
      })

      // Utiliser l'interface debug pour forcer l'envoi
      const debug = (
        globalThis.window as {
          __TRACKING_MANAGER_DEBUG__?: { forceSend: (pageId: string) => void }
        }
      ).__TRACKING_MANAGER_DEBUG__
      if (debug) {
        debug.forceSend(pageId)
      }
    }
  }, [pageId, config.pageName])

  return {
    trackViewableItems,
    forceSend,
  }
}

/**
 * Generate a unique ID for a page
 */
function generatePageId(pageLocation: string): string {
  return `${pageLocation}_${uuidv4()}`
}

/**
 * Helper pour adapter handleViewableItemsChanged existant
 * Facilite la migration des pages existantes
 */
export function createViewableItemsHandler(
  trackViewableItems: TrackingHandlers['trackViewableItems']
) {
  return (params: {
    index?: number
    moduleId: string
    moduleType?: string
    viewableItems: Pick<ViewToken, 'key' | 'index'>[]
    homeEntryId?: string
    callId?: string
    artistId?: string
    searchId?: string
    entryId?: string
  }) => {
    const {
      index,
      moduleId,
      moduleType,
      viewableItems,
      homeEntryId,
      callId,
      artistId,
      searchId,
      entryId,
    } = params

    // Infer itemType from moduleType if possible
    const itemType = inferItemTypeFromModuleType(moduleType)

    // Construire extra object
    const extra: Record<string, string | undefined> = {}
    if (homeEntryId) extra.homeEntryId = homeEntryId

    trackViewableItems({
      moduleId,
      itemType,
      viewableItems,
      callId,
      extra: Object.keys(extra).length > 0 ? extra : undefined,
      artistId,
      playlistIndex: index,
      searchId,
      entryId,
    })
  }
}

/**
 * Helper to infer itemType from moduleType
 */
function inferItemTypeFromModuleType(
  moduleType?: string
): 'offer' | 'venue' | 'artist' | 'unknown' {
  if (!moduleType) return 'unknown'

  if (moduleType.includes('offer') || moduleType.includes('Offer')) return 'offer'
  if (moduleType.includes('venue') || moduleType.includes('Venue')) return 'venue'
  if (moduleType.includes('artist') || moduleType.includes('Artist')) return 'artist'

  return 'unknown'
}
