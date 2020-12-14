import React from 'react'
import { Text } from 'react-native'

import { openExternalUrl } from 'features/navigation/helpers'
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

  const firstSpaceOccurrence = text.indexOf(' ')
  const hasOccurrence = firstSpaceOccurrence > 0

  const firstWord = (hasOccurrence ? '\u00a0' : '') + text.substring(0, firstSpaceOccurrence)
  const remainingWords =
    (hasOccurrence ? ' ' : '\u00a0') + text.substring(firstSpaceOccurrence + 1, text.length)

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
