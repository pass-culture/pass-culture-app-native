import React from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { ExternalSiteFilled as DefaultExternalSite } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo, getSpacing } from 'ui/theme'

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
      <StyledBody>
        <ExternalSite primary={primary} testID="externalSiteIcon" />
        {firstWord}
      </StyledBody>
      {remainingWords}
    </ButtonText>
  )
}

const ButtonText = styled(Typo.BodyAccent)<{ primary?: boolean }>(({ primary, theme }) => ({
  color: primary ? theme.designSystem.color.text.brandPrimary : undefined,
}))

const ExternalSite = styled(DefaultExternalSite).attrs<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary
      ? theme.designSystem.color.icon.brandPrimary
      : theme.designSystem.color.icon.default,
    size: theme.icons.sizes.extraSmall,
  })
)<{ primary?: boolean }>``

const StyledBody = styled(Typo.Body)({
  marginLeft: getSpacing(1),
})
