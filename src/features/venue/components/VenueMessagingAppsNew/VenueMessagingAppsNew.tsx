import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingAppsNew/MessagingAppsNew'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { useVenue } from 'features/venue/api/useVenue'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  venueId: number
}

export const VenueMessagingApps = ({ venueId }: MessagingAppsProps) => {
  const { data: venue } = useVenue(venueId)
  const { share, shareContent } = getShareVenue({ venue: venue, utmMedium: 'social_media' })

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Venue', venueId, from: 'venue', social })
    },
    [venueId]
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
