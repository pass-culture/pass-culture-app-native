import React, { FC } from 'react'
import styled from 'styled-components/native'

import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Share as DefaultShare } from 'ui/svg/icons/Share'
import { Typo } from 'ui/theme'

interface Props {
  universalLink: string
  before?: React.JSX.Element | React.JSX.Element[]
}

export const DeeplinkItem: FC<Props> = ({ universalLink, before }) => {
  const copyToClipboardUniversalLink = () => copyToClipboard({ textToCopy: universalLink })

  return (
    <React.Fragment>
      {before ? <Container>{before}</Container> : null}
      <Container>
        <LinkWrapper>
          <ExternalTouchableLink
            externalNav={{ url: universalLink, params: { shouldLogEvent: false } }}>
            <Typo.BodyAccentXs>{universalLink}</Typo.BodyAccentXs>
          </ExternalTouchableLink>
        </LinkWrapper>

        <IconWrapper>
          <StyledTouchableOpacity
            onPress={copyToClipboardUniversalLink}
            accessibilityLabel="Copier">
            <Share />
          </StyledTouchableOpacity>
        </IconWrapper>
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

const LinkWrapper = styled.View({ flex: 0.85 })
const IconWrapper = styled.View({ flex: 0.15 })

const Share = styled(DefaultShare).attrs(({ theme }) => ({ size: theme.icons.sizes.small }))``
