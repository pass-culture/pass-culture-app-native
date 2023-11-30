import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingAppsNew/MessagingAppsNew'
import { useShareVenue } from 'features/share/helpers/useShareVenue'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  venueId: number
}

export const VenueMessagingApps = ({ venueId }: MessagingAppsProps) => {
  const { share, shareContent } = useShareVenue(venueId, 'social_media')

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
