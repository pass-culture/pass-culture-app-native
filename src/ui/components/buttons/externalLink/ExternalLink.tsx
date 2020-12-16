import React from 'react'
import { Text } from 'react-native'

import { openExternalUrl } from 'features/navigation/helpers'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface Props {
  url: string
  text?: string
  color?: ColorsEnum
  testID?: string
}

export const ExternalLink: React.FC<Props> = ({ url, text, color, testID }) => {
  text = text || url

  const [firstWord, remainingWords] = extractExternalLinkParts(text)

  return (
    <Typo.ButtonText color={color} onPress={() => openExternalUrl(url)} testID={testID}>
      <Spacer.Row numberOfSpaces={1} />
      <Text>
        <ExternalLinkSite color={color} testID="externalSiteIcon" />
        {firstWord}
      </Text>
      {remainingWords}
    </Typo.ButtonText>
  )
}
