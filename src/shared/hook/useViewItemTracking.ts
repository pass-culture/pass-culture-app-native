import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'

import { analytics } from 'libs/analytics/provider'
import { useAppStateChange } from 'libs/appState'
import { logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
import {
  resetPageTrackingInfo,
  setPageTrackingInfo,
  useOfferPlaylistTrackingStore,
} from 'store/tracking/playlistTrackingStore'

export function useViewItemTracking(name: string) {
  // 1. Initialization on mount
  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  // 2. Screen focus/blur
  useFocusEffect(
    useCallback(() => {
      if (name) {
        setPageTrackingInfo({
          pageId: '',
          pageLocation: name,
        })
      }

      return () => {
        logViewItem(useOfferPlaylistTrackingStore.getState())
        resetPageTrackingInfo()
      }
    }, [name])
  )

  // 3. Switch to background
  useAppStateChange(undefined, () => logViewItem(useOfferPlaylistTrackingStore.getState()))
}
