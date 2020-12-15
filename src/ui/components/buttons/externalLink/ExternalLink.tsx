import React from 'react'
import { Text } from 'react-native'

import { openExternalUrl } from 'features/navigation/helpers'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

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
      <Text>
        <ExternalSite inText color={color} testID="externalSiteIcon" size={getSpacing(6)} />
        {firstWord}
      </Text>
      {remainingWords}
    </Typo.ButtonText>
  )
}
