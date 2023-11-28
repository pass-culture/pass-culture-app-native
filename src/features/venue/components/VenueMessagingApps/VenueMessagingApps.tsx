import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { analytics } from 'libs/analytics'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { VenueResponse } from 'api/gen'

type MessagingAppsProps = {
  venue: VenueResponse
}

export const VenueMessagingApps = ({ venue }: MessagingAppsProps) => {
  const { share, shareContent } = getShareVenue({ venue, utmMedium: 'social_media' })

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Venue', venueId: venue.id, from: 'venue', social })
    },
    [venue.id]
  )

  if (!shareContent?.url) return null

  return (
    <MessagingApps
      shareContent={shareContent}
      share={share}
      messagingAppAnalytics={messagingAppAnalytics}
    />
  )
}
