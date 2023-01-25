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
    instagram: false,
    snapchat: false,
    tiktok: false,
    whatsapp: false,
  })

  useEffect(() => {
    const getApps = async () => {
      const network = {
        instagram: await Linking.canOpenURL('instagram://'),
        snapchat: await Linking.canOpenURL('snapchat://'),
        tiktok: await Linking.canOpenURL('tiktok://'),
        whatsapp: await Linking.canOpenURL('whatsapp://send/'),
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
        <ShareMessagingApp network={Network.instagram} visible={hasNetwork.instagram} />
        <ShareMessagingApp network={Network.snapchat} visible={hasNetwork.snapchat} />
        <ShareMessagingApp network={Network.tiktok} visible={hasNetwork.tiktok} />
        <ShareMessagingApp network={Network.whatsapp} visible={hasNetwork.whatsapp} />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  padding: getSpacing(2),
  flexDirection: 'row',
})
