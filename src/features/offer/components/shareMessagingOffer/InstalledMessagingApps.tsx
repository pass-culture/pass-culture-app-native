import React, { useState, useEffect } from 'react'
import { Social } from 'react-native-share'

import { MessagingAppButton } from 'features/offer/components/shareMessagingOffer/MessagingAppButton'
import { getInstalledApps } from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { Network } from 'ui/components/ShareMessagingApp'

export const InstalledMessagingApps = ({ offerId }: { offerId: number }) => {
  const [installedApps, setInstalledApps] = useState<Network[]>([])
  const { data: offer } = useOffer({ offerId })

  const shareMessage = formatShareOfferMessage({
    offerName: offer?.name ?? '',
    venueName: offer ? getOfferLocationName(offer.venue, offer.isDigital) : '',
  })
  const shareUrl = getOfferUrl(offerId)

  useEffect(() => {
    getInstalledApps()
      .then(setInstalledApps)
      .catch((e) => eventMonitoring.captureException(`Installed apps: ${e}`))
  }, [])

  const messagingAppAnalytics = (social: Social) => {
    analytics.logShare({ type: 'Offer', id: offerId, from: 'offer', social: social })
  }

  return (
    <React.Fragment>
      {installedApps.map((network) => (
        <MessagingAppButton
          key={network}
          network={network}
          shareMessage={shareMessage}
          shareUrl={shareUrl}
          onPressAnalytics={messagingAppAnalytics}
        />
      ))}
    </React.Fragment>
  )
}
