import React from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
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
    <StyledTouchableLink
      externalNav={{ url }}
      primary={primary}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <ButtonText primary={primary}>
        <Text>
          <ExternalSite primary={primary} testID="externalSiteIcon" />
          {firstWord}
        </Text>
        {remainingWords}
      </ButtonText>
    </StyledTouchableLink>
  )
}

const Text = webStyled.span(({ theme }) => ({
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  marginLeft: getSpacing(1),
  ...theme.designSystem.typography.button,
}))

const StyledTouchableLink = styled(ExternalTouchableLink).attrs<{
  primary?: boolean
}>(({ theme, primary }) => ({
  hoverUnderlineColor: primary ? theme.designSystem.color.text.brandPrimary : undefined,
}))({
  display: 'inline',
})

const ButtonText = styled(Typo.Button)<{ primary?: boolean }>(({ primary, theme }) => ({
  color: primary ? theme.designSystem.color.text.brandPrimary : undefined,
}))

const ExternalSite = styled(DefaultExternalSite).attrs<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary ? theme.designSystem.color.icon.brandPrimary : undefined,
    size: theme.icons.sizes.extraSmall,
  })
)<{ primary?: boolean }>``
