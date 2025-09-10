import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'

import { analytics } from 'libs/analytics/provider'
import { logPlaylistDebug, logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
import {
  resetPageTrackingInfo,
  useOfferPlaylistTrackingStore,
} from 'store/tracking/playlistTrackingStore'

export function useViewItemTracking(name: string) {
  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  useFocusEffect(
    useCallback(() => {
      return () => {
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

        logPlaylistDebug(name, 'Resetting page tracking info')
        resetPageTrackingInfo()
      }
    }, [name])
  )
}
