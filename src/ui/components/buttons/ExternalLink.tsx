import React from 'react'

import { openExternalUrl } from 'features/navigation/helpers'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface Props {
  url: string
  text?: string
  color?: ColorsEnum
}

export const ExternalLink: React.FC<Props> = ({ url, text, color }) => (
  <Typo.ButtonText color={color} onPress={() => openExternalUrl(url)}>
    <React.Fragment>
      <ExternalSite inText color={color} testID="externalSiteIcon" size={getSpacing(6)} />
    </React.Fragment>
    {text || url}
  </Typo.ButtonText>
)
