import { useFocusEffect } from '@react-navigation/native'

import { analytics } from 'libs/analytics'
import { useTrackDuration } from 'shared/hook/useTrackDuration'

export const useTrackMapSeenDuration = () => {
  const trackMapSeenDuration = useTrackDuration(analytics.logVenueMapSeenDuration)
  useFocusEffect(trackMapSeenDuration)
}
