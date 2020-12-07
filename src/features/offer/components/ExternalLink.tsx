import React from 'react'
import { Linking } from 'react-native'

import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  url: string
}

export const ExternalLink: React.FC<Props> = ({ url }) => (
  <Typo.ButtonText onPress={() => openExternalLink(url)}>
    <React.Fragment>
      <ExternalSite inText testID="externalSiteIcon" size={getSpacing(6)} />
    </React.Fragment>
    {url}
  </Typo.ButtonText>
)

const openExternalLink = (url: string) => {
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url)
  }
}
