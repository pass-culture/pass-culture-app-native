import React, { useState, useEffect } from 'react'
import { Social } from 'react-native-share'

import { getInstalledApps } from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { MessagingAppButton } from 'features/share/components/MessagingApps/MessagingAppButton'
import { eventMonitoring } from 'libs/monitoring'
import { Network } from 'ui/components/ShareMessagingApp'

type Props = {
  shareMessage: string
  shareUrl: string
  messagingAppAnalytics: (social: Social) => void
}

export const InstalledMessagingApps = ({
  shareMessage,
  shareUrl,
  messagingAppAnalytics,
}: Props) => {
  const [installedApps, setInstalledApps] = useState<Network[]>([])

  useEffect(() => {
    getInstalledApps()
      .then(setInstalledApps)
      .catch((e) => eventMonitoring.captureException(`Installed apps: ${e}`))
  }, [])

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
