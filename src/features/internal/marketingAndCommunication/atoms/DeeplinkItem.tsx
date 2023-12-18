import React from 'react'
import styled from 'styled-components/native'

import { GeneratedDeeplink } from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Share as DefaultShare } from 'ui/svg/icons/BicolorShare'
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
            <Typo.Caption>{deeplink.universalLink}</Typo.Caption>
          </ExternalTouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <TouchableOpacity
            style={iconContainerStyle}
            onPress={copyToClipboardUniversalLink}
            accessibilityLabel="Copier">
            <Share />
          </TouchableOpacity>
        </Spacer.Flex>
      </Container>
      <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
      <Container>
        <Spacer.Flex flex={0.85}>
          <ExternalTouchableLink
            externalNav={{ url: deeplink.firebaseLink, params: { shouldLogEvent: false } }}>
            <Typo.Caption>{deeplink.firebaseLink}</Typo.Caption>
          </ExternalTouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <TouchableOpacity
            style={iconContainerStyle}
            onPress={copyToClipboardFirebaseLink}
            accessibilityLabel="Copier dans le presse-papier">
            <Share />
          </TouchableOpacity>
        </Spacer.Flex>
      </Container>
    </React.Fragment>
  )
}

DeeplinkItem.defaultProps = {
  size: getSpacing(3.75),
  iconSize: 32,
}

const iconContainerStyle = { margin: 'auto' }

const Container = styled.View({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
})

const Share = styled(DefaultShare).attrs(({ theme }) => ({ size: theme.icons.sizes.small }))``
