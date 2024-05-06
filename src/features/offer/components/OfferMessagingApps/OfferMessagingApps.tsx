import React, { useCallback } from 'react'
import { Social } from 'react-native-share'

import { OfferResponseV2 } from 'api/gen'
import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { analytics } from 'libs/analytics'

type MessagingAppsProps = {
  offer: OfferResponseV2
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
