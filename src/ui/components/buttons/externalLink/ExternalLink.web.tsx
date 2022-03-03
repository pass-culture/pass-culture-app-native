import React from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ExternalSite as DefaultExternalSite } from 'ui/svg/icons/ExternalSite'
import { Spacer, Typo } from 'ui/theme'
import { A } from 'ui/web/link/A'

interface Props {
  url: string
  primary?: boolean
  text?: string
  testID?: string
}

export const ExternalLink: React.FC<Props> = ({ url, text, primary, testID }) => {
  const [firstWord, remainingWords] = extractExternalLinkParts(text || url)

  return (
    <A href={url}>
      <StyledTouchableOpacity onPress={() => openUrl(url)} testID={testID}>
        <ButtonText primary={primary}>
          <Spacer.Row numberOfSpaces={1} />
          <Text>
            <ExternalSite primary={primary} testID="externalSiteIcon" />
            {firstWord}
          </Text>
          {remainingWords}
        </ButtonText>
      </StyledTouchableOpacity>
    </A>
  )
}

const Text = styled.Text({
  whiteSpace: 'nowrap',
})

const StyledTouchableOpacity = styled(TouchableOpacity)({
  display: 'inline',
})

const ButtonText = styled(Typo.ButtonText)<{ primary?: boolean }>(({ primary, theme }) => ({
  color: primary ? theme.colors.primary : theme.colors.black,
}))

const ExternalSite = styled(DefaultExternalSite).attrs<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary ? theme.colors.primary : undefined,
    size: theme.icons.sizes.extraSmall,
  })
)<{ primary?: boolean }>``
