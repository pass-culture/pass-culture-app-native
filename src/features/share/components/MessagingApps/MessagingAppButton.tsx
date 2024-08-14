import React from 'react'
import { Social } from 'react-native-share'

import { MessagingAppContainer } from 'features/share/components/MessagingApps/MessagingAppContainer'
import { eventMonitoring } from 'libs/monitoring'
import { mapNetworkToSocial } from 'libs/share/mapNetworkToSocial'
import { share } from 'libs/share/share'
import { Network, ShareContent } from 'libs/share/types'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
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
  const shareUrlWithUtmSource = `${shareContent.url}&utm_source=${network}`
  const onPress = async () => {
    try {
      onPressAnalytics(mapNetworkToSocial[network].social)
      await share({ content: { ...shareContent, url: shareUrlWithUtmSource }, mode: network })
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      eventMonitoring.captureException(`MessagingApp click: ${errorMessage}`)
    }
  }

  return (
    <MessagingAppContainer>
      <ShareMessagingApp network={network} onPress={onPress} />
    </MessagingAppContainer>
  )
}
