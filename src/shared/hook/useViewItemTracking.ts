import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef } from 'react'

import { analytics } from 'libs/analytics/provider'
import { useAppStateChange } from 'libs/appState'
import { logPlaylistDebug, logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
import {
  resetPageTrackingInfo,
  useOfferPlaylistTrackingStore,
} from 'store/tracking/playlistTrackingStore'

export function useViewItemTracking(name: string, pageLocation?: string) {
  const isGoingToBackground = useRef(false)
  const capturedState = useRef<ReturnType<typeof useOfferPlaylistTrackingStore.getState>>()

  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  // Handle app going to background
  useAppStateChange(undefined, () => {
    isGoingToBackground.current = true

    // Use captured state instead of reading from store (same logic as useFocusEffect)
    const stateToUse = capturedState.current

    // Only send stats if we have captured state for this page
    if (stateToUse && pageLocation && stateToUse.pageLocation === pageLocation) {
      if (stateToUse.pageId && stateToUse.playlists) {
        logPlaylistDebug(stateToUse.pageLocation, 'App state changed - sending playlist stats', {
          pageId: stateToUse.pageId,
          pageLocation: stateToUse.pageLocation,
          playlistsCount: stateToUse.playlists.length,
          playlists: stateToUse.playlists.map((p) => ({
            moduleId: p.moduleId,
            itemType: p.itemType,
            itemsCount: p.items.length,
            index: p.index,
          })),
        })
        logViewItem(stateToUse)
      }
    } else {
      logPlaylistDebug(pageLocation || 'unknown', 'App state changed - no valid captured state', {
        hasCapturedState: !!capturedState.current,
        capturedPageLocation: capturedState.current?.pageLocation,
        expectedPageLocation: pageLocation,
      })
    }
  })

  useFocusEffect(
    useCallback(() => {
      // Reset flag when screen gains focus
      isGoingToBackground.current = false

      // Capture initial state when page gains focus - but only if it's for this page
      const initialState = useOfferPlaylistTrackingStore.getState()

      // If the store has data from a different page, reset it first
      if (pageLocation && initialState.pageLocation && initialState.pageLocation !== pageLocation) {
        logPlaylistDebug(name, 'Page gained focus - resetting store for new page', {
          oldPageLocation: initialState.pageLocation,
          newPageLocation: pageLocation,
        })
        resetPageTrackingInfo()
        capturedState.current = undefined
      } else if (
        !pageLocation ||
        !initialState.pageLocation ||
        initialState.pageLocation === pageLocation
      ) {
        capturedState.current = initialState
        logPlaylistDebug(name, 'Page gained focus - captured initial state', {
          pageId: initialState?.pageId,
          pageLocation: initialState?.pageLocation,
          expectedPageLocation: pageLocation,
        })
      } else {
        capturedState.current = undefined
        logPlaylistDebug(name, 'Page gained focus - ignoring irrelevant initial state', {
          statePageLocation: initialState?.pageLocation,
          expectedPageLocation: pageLocation,
        })
      }

      // Subscribe to store updates to keep captured state up to date
      // But only if the state change is for this specific page
      const unsubscribe = useOfferPlaylistTrackingStore.subscribe((state) => {
        // Only update if state is for this page (or if no pageLocation specified for backward compatibility)
        if (!pageLocation || state.pageLocation === pageLocation) {
          capturedState.current = state
          logPlaylistDebug(name, 'Updating captured state for current page', {
            pageId: state.pageId,
            pageLocation: state.pageLocation,
            playlistsCount: state.playlists?.length || 0,
          })
        } else {
          logPlaylistDebug(name, 'Ignoring state update for different page', {
            statePageLocation: state.pageLocation,
            currentPageLocation: pageLocation,
          })
        }
      })

      return () => {
        // Unsubscribe from store updates
        unsubscribe()

        // Use captured state instead of reading from store
        // This prevents using wrong pageLocation when navigating between pages
        const stateToUse = capturedState.current || useOfferPlaylistTrackingStore.getState()

        // Only send stats if not going to background and we have captured state
        if (!isGoingToBackground.current && capturedState.current) {
          if (stateToUse?.pageId && stateToUse?.pageLocation && stateToUse?.playlists) {
            logPlaylistDebug(
              name,
              'Focus lost - sending final playlist stats with captured state',
              {
                pageId: stateToUse.pageId,
                pageLocation: stateToUse.pageLocation,
                playlistsCount: stateToUse.playlists.length,
                playlists: stateToUse.playlists.map((p) => ({
                  moduleId: p.moduleId,
                  itemType: p.itemType,
                  itemsCount: p.items.length,
                  index: p.index,
                  viewedAt: p.viewedAt,
                })),
              }
            )
          }

          logViewItem(stateToUse)
        } else if (!isGoingToBackground.current) {
          logPlaylistDebug(name, 'Focus lost - no captured state to send')
        }

        logPlaylistDebug(name, 'Resetting page tracking info')
        resetPageTrackingInfo()

        // Clear captured state
        capturedState.current = undefined
      }
    }, [name, pageLocation])
  )
}
