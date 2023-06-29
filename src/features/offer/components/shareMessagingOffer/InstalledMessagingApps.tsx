import React, { useState, useEffect } from 'react'

import { useOffer } from 'features/offer/api/useOffer'
import { MessagingAppButton } from 'features/offer/components/shareMessagingOffer/MessagingAppButton'
import { getInstalledApps } from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { eventMonitoring } from 'libs/monitoring'
import { getOfferLocationName } from 'shared/offer/getOfferLocationName'
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

  if (!offer) return null

  return (
    <React.Fragment>
      {installedApps.map((network) => (
        <MessagingAppButton
          key={network}
          offerId={offerId}
          network={network}
          shareMessage={shareMessage}
          shareUrl={shareUrl}
        />
      ))}
    </React.Fragment>
  )
}
