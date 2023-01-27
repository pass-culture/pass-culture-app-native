import React, { FunctionComponent, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Network, ShareMessagingApp } from 'ui/components/ShareMessagingApp'
import { getSpacing } from 'ui/theme'

interface Props {
  children?: never
}

export const GetDynamicSocials: FunctionComponent<Props> = () => {
  const [hasNetwork, setHasNetwork] = useState({
    [Network.discord]: false,
    // [Network.imessage]: false,
    [Network.instagram]: false,
    [Network.messenger]: false,
    [Network.signal]: false,
    [Network.instagram]: false,
    [Network.skype]: false,
    [Network.snapchat]: false,
    [Network.telegram]: false,
    [Network.tiktok]: false,
    [Network.twitch]: false,
    [Network.twitch]: false,
    [Network.viber]: false,
    [Network.whatsapp]: false,
  })

  useEffect(() => {
    const getApps = async () => {
      const network = {
        [Network.discord]: await Linking.canOpenURL('discord://'),
        // [Network.imessage]: await Linking.canOpenURL('imessage://'), Pas de imessage sur Android... remplacer par SMS ?
        [Network.instagram]: await Linking.canOpenURL('instagram://'),
        [Network.messenger]: await Linking.canOpenURL('fb-messenger://'),
        [Network.signal]: await Linking.canOpenURL('sgnl://'),
        [Network.skype]: await Linking.canOpenURL('skype://'),
        [Network.snapchat]: await Linking.canOpenURL('snapchat://'),
        [Network.telegram]: await Linking.canOpenURL('tg://'),
        [Network.tiktok]: await Linking.canOpenURL('tiktok://'),
        [Network.twitch]: await Linking.canOpenURL('twitch://'),
        [Network.twitter]: await Linking.canOpenURL('twitter://'),
        [Network.viber]: await Linking.canOpenURL('viber://'),
        [Network.whatsapp]: await Linking.canOpenURL('whatsapp://send/'),
      }
      return network
    }

    getApps()
      .then((network) => setHasNetwork(network))
      .catch((error) => {
        throw new Error(error)
      })
  }, [])

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike réseaux sociaux dynamiques" />
      <Container>
        {Object.entries(hasNetwork).map(([network, isInstalled]) => (
          <ShareMessagingApp key={network} network={network as Network} visible={isInstalled} />
        ))}
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  padding: getSpacing(2),
  flexDirection: 'row',
})
