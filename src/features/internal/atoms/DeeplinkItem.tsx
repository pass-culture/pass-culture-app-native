import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Share as DefaultShare } from 'ui/svg/icons/Share'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  universalLink: string
  before?: React.JSX.Element | React.JSX.Element[]
}

export const DeeplinkItem: FC<Props> = ({ universalLink, before }) => {
  const copyToClipboardUniversalLink = useCopyToClipboard({ textToCopy: universalLink })

  return (
    <React.Fragment>
      {before ? (
        <Container>
          {before}
          <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
        </Container>
      ) : null}
      <Container>
        <Spacer.Flex flex={0.85}>
          <ExternalTouchableLink
            externalNav={{ url: universalLink, params: { shouldLogEvent: false } }}>
            <Typo.BodyAccentXs>{universalLink}</Typo.BodyAccentXs>
          </ExternalTouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <StyledTouchableOpacity
            onPress={copyToClipboardUniversalLink}
            accessibilityLabel="Copier">
            <Share />
          </StyledTouchableOpacity>
        </Spacer.Flex>
      </Container>
    </React.Fragment>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  margin: 'auto',
})

const Container = styled.View({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
})

const Share = styled(DefaultShare).attrs(({ theme }) => ({ size: theme.icons.sizes.small }))``
