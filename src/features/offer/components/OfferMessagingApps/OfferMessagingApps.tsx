import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { useShareOffer } from 'features/share/helpers/useShareOffer'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  isEvent: boolean
  offerId: number
}

export const OfferMessagingApps = ({ isEvent, offerId }: MessagingAppsProps) => {
  const title = isEvent ? 'Vas-y en bande organisée\u00a0!' : 'Partage ce bon plan\u00a0!'

  const { share, shareContent } = useShareOffer(offerId, 'social_media')

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Offer', id: offerId, from: 'offer', social })
    },
    [offerId]
  )

  if (!shareContent?.url) return null

  return (
    <MessagingApps
      title={title}
      shareContent={shareContent}
      messagingAppAnalytics={messagingAppAnalytics}
      share={share}
    />
  )
}
