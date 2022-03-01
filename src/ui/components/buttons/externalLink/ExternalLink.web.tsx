import React from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'
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
      <ButtonText primary={primary} onPress={() => openUrl(url)} testID={testID} accessible={true}>
        <Spacer.Row numberOfSpaces={1} />
        <Text>
          <ExternalSite primary={primary} testID="externalSiteIcon" />
          {firstWord}
        </Text>
        {remainingWords}
      </ButtonText>
    </A>
  )
}

const Text = styled.Text({
  whiteSpace: 'nowrap',
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
