import React from 'react'
import styled from 'styled-components/native'

import { GeneratedDeeplink } from 'features/internal/components/DeeplinksGeneratorForm'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Share as DefaultShare } from 'ui/svg/icons/Share'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  deeplink: GeneratedDeeplink
  before?: React.JSX.Element | React.JSX.Element[]
}

export const DeeplinkItem = ({ deeplink, before }: Props) => {
  const copyToClipboardUniversalLink = useCopyToClipboard({ textToCopy: deeplink.universalLink })
  const copyToClipboardFirebaseLink = useCopyToClipboard({ textToCopy: deeplink.firebaseLink })

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
            externalNav={{ url: deeplink.universalLink, params: { shouldLogEvent: false } }}>
            <Typo.BodyAccentXs>{deeplink.universalLink}</Typo.BodyAccentXs>
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
      <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
      <Container>
        <Spacer.Flex flex={0.85}>
          <ExternalTouchableLink
            externalNav={{ url: deeplink.firebaseLink, params: { shouldLogEvent: false } }}>
            <Typo.BodyAccentXs>{deeplink.firebaseLink}</Typo.BodyAccentXs>
          </ExternalTouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <StyledTouchableOpacity
            onPress={copyToClipboardFirebaseLink}
            accessibilityLabel="Copier dans le presse-papier">
            <Share />
          </StyledTouchableOpacity>
        </Spacer.Flex>
      </Container>
    </React.Fragment>
  )
}

DeeplinkItem.defaultProps = {
  size: getSpacing(3.75),
  iconSize: 32,
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
