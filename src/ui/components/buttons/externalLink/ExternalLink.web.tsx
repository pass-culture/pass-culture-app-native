import React from 'react'
import styled from 'styled-components/native'

import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite as DefaultExternalSite } from 'ui/svg/icons/ExternalSite'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  url: string
  primary?: boolean
  text?: string
  testID?: string
}

export const ExternalLink: React.FC<Props> = ({ url, text, primary, testID }) => {
  const [firstWord, remainingWords] = extractExternalLinkParts(text || url)

  return (
    <StyledTouchableOpacity externalNav={{ url }} testID={testID}>
      <ButtonText primary={primary}>
        <Spacer.Row numberOfSpaces={1} />
        <Text>
          <ExternalSite primary={primary} testID="externalSiteIcon" />
          {firstWord}
        </Text>
        {remainingWords}
      </ButtonText>
    </StyledTouchableOpacity>
  )
}

const Text = styled.Text({
  whiteSpace: 'nowrap',
})

const StyledTouchableOpacity = styled(TouchableLink)({
  display: 'inline',
})

const ButtonText = styled(Typo.ButtonText)<{ primary?: boolean }>(({ primary, theme }) => ({
  color: primary ? theme.colors.primary : undefined,
}))

const ExternalSite = styled(DefaultExternalSite).attrs<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary ? theme.colors.primary : undefined,
    size: theme.icons.sizes.extraSmall,
  })
)<{ primary?: boolean }>``
