import { useEffect } from 'react'

import { analytics } from 'libs/analytics'
import { useTrackDuration } from 'shared/hook/useTrackDuration'

export const useTrackMapSessionDuration = () => {
  const trackMapSessionDuration = useTrackDuration(analytics.logVenueMapSessionDuration)
  // We only want to call it when the component is unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => trackMapSessionDuration(), [])
}
