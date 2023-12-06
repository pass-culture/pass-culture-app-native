import React from 'react'
import { Social } from 'react-native-share'

import { MessagingAppContainer } from 'features/share/components/MessagingApps/MessagingAppContainer'
import { eventMonitoring } from 'libs/monitoring'
import { mapNetworkToSocial } from 'libs/share/mapNetworkToSocial'
import { share } from 'libs/share/shareBest'
import { Network, ShareContent } from 'libs/share/types'
import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'

type MessagingAppsButtonProps = {
  network: Network
  shareContent: ShareContent
  onPressAnalytics: (social: Social) => void
}

export const MessagingAppButton = ({
  network,
  shareContent,
  onPressAnalytics,
}: MessagingAppsButtonProps) => {
  const onPress = async () => {
    try {
      const contentUrl = new URL(shareContent.url)
      contentUrl.searchParams.set('utm_source', network)

      onPressAnalytics(mapNetworkToSocial[network].social)
      await share({ content: { ...shareContent, url: contentUrl }, mode: network })
    } catch (e) {
      eventMonitoring.captureException(`MessagingApp click: ${e}`)
    }
  }

  return (
    <MessagingAppContainer>
      <ShareMessagingApp network={network} onPress={onPress} />
    </MessagingAppContainer>
  )
}
