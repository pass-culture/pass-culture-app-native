import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { ExternalSiteFilled as DefaultExternalSite } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  url: string
  primary?: boolean
  text?: string
  testID?: string
}

export const ExternalLink: React.FC<Props> = ({ url, text, primary, testID }) => {
  const [firstWord, remainingWords] = extractExternalLinkParts(text || url)

  const accessibilityLabel = `Nouvelle fenêtre\u00a0: ${text || url}`
  return (
    <ButtonText
      primary={primary}
      onPress={() => openUrl(url)}
      {...accessibilityAndTestId(accessibilityLabel, testID)}>
      <Spacer.Row numberOfSpaces={1} />
      <Text>
        <ExternalSite primary={primary} testID="externalSiteIcon" />
        {firstWord}
      </Text>
      {remainingWords}
    </ButtonText>
  )
}

const ButtonText = styled(Typo.ButtonText)<{ primary?: boolean }>(({ primary, theme }) => ({
  color: primary ? theme.colors.primary : undefined,
}))

const ExternalSite = styled(DefaultExternalSite).attrs<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary ? theme.colors.primary : theme.colors.black,
    size: theme.icons.sizes.extraSmall,
  })
)<{ primary?: boolean }>``
