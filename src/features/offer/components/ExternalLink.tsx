import React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  url: string
}

export const ExternalLink: React.FC<Props> = ({ url }) => (
  <Typo.ButtonText onPress={() => openExternalLink(url)}>
    <IconContainer>
      <ExternalSite testID="externalSiteIcon" size={getSpacing(6)} />
    </IconContainer>
    {url}
  </Typo.ButtonText>
)

const openExternalLink = (url: string) => {
  try {
    Linking.openURL(url)
  } catch (e) {
    /** ignore error */
  }
}

const IconContainer = styled.View({ marginBottom: -getSpacing(1.25) })
