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

  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  // Handle app going to background
  useAppStateChange(undefined, () => {
    isGoingToBackground.current = true
    const state = useOfferPlaylistTrackingStore.getState()

    // Only send stats if this is the current page (check pageLocation matches)
    if (
      state?.pageId &&
      state?.pageLocation &&
      state?.playlists &&
      pageLocation &&
      state.pageLocation === pageLocation
    ) {
      logPlaylistDebug(state.pageLocation, 'App state changed - sending playlist stats', {
        pageId: state.pageId,
        pageLocation: state.pageLocation,
        playlistsCount: state.playlists.length,
        playlists: state.playlists.map((p) => ({
          moduleId: p.moduleId,
          itemType: p.itemType,
          itemsCount: p.items.length,
          index: p.index,
        })),
      })
      logViewItem(state)
    }
  })

  useFocusEffect(
    useCallback(() => {
      // Reset flag when screen gains focus
      isGoingToBackground.current = false

      return () => {
        // Only send stats if not going to background (to avoid duplicate)
        if (!isGoingToBackground.current) {
          const state = useOfferPlaylistTrackingStore.getState()

          if (state?.pageId && state?.pageLocation && state?.playlists) {
            logPlaylistDebug(name, 'Focus lost - sending final playlist stats', {
              pageId: state.pageId,
              pageLocation: state.pageLocation,
              playlistsCount: state.playlists.length,
              playlists: state.playlists.map((p) => ({
                moduleId: p.moduleId,
                itemType: p.itemType,
                itemsCount: p.items.length,
                index: p.index,
                viewedAt: p.viewedAt,
              })),
            })
          }

          logViewItem(state)
        }

        logPlaylistDebug(name, 'Resetting page tracking info')
        resetPageTrackingInfo()
      }
    }, [name])
  )
}
