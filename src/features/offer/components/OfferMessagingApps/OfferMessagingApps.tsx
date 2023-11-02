import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { useShareOffer } from 'features/share/helpers/useShareOffer'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  offerId: number
}

export const OfferMessagingApps = ({ offerId }: MessagingAppsProps) => {
  const { share, shareContent } = useShareOffer(offerId, 'social_media')

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Offer', offerId, from: 'offer', social })
    },
    [offerId]
  )

  if (!shareContent?.url) return null

  return (
    <MessagingApps
      shareContent={shareContent}
      messagingAppAnalytics={messagingAppAnalytics}
      share={share}
    />
  )
}
