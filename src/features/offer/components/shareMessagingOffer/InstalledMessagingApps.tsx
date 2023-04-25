import React, { useState, useEffect } from 'react'

import { MessagingAppButton } from 'features/offer/components/shareMessagingOffer/MessagingAppButton'
import { getInstalledApps } from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { useShareOfferMessage } from 'features/share/helpers/useShareOfferMessage'
import { eventMonitoring } from 'libs/monitoring'
import { Network } from 'ui/components/ShareMessagingApp'

export const InstalledMessagingApps = ({ offerId }: { offerId: number }) => {
  const [installedApps, setInstalledApps] = useState<Network[]>([])
  const shareMessage = useShareOfferMessage(offerId)
  const shareUrl = getOfferUrl(offerId)

  useEffect(() => {
    getInstalledApps()
      .then(setInstalledApps)
      .catch((e) => eventMonitoring.captureException(`Installed apps: ${e}`))
  }, [])

  if (!shareMessage) return null

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
