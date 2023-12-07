import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { OfferResponse } from 'api/gen'
import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { getShareOffer } from 'features/share/helpers/getShareOfferBest'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  offer: OfferResponse
}

export const OfferMessagingApps = ({ offer }: MessagingAppsProps) => {
  const { share, shareContent } = getShareOffer({ offer, utmMedium: 'social_media' })

  const messagingAppAnalytics = useCallback(
    (social: Social | 'Other') => {
      analytics.logShare({ type: 'Offer', offerId: offer.id, from: 'offer', social })
    },
    [offer.id]
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
