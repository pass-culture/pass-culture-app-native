import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { analytics } from 'libs/analytics'
import { useTrackDuration } from 'shared/hook/useTrackDuration'

export const useTrackMapSeenDuration = () => {
  const trackMapSeenDuration = useTrackDuration(analytics.logVenueMapSeenDuration)
  useFocusEffect(useCallback(() => trackMapSeenDuration(), [trackMapSeenDuration]))
}
