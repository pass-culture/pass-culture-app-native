import { t } from '@lingui/macro'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { GeneratedDeeplink } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Share as DefaultShare } from 'ui/svg/icons/Share'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  deeplink: GeneratedDeeplink
  before?: JSX.Element | JSX.Element[]
}

export const DeeplinkItem = ({ deeplink, before }: Props) => {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const copyToClipboard = useCallback(
    (url: string) => {
      try {
        globalThis.navigator.clipboard.writeText(url)
        showSuccessSnackBar({
          message: `${url} à été copié dans ton press-papier\u00a0!`,
          timeout: SNACK_BAR_TIME_OUT,
        })
      } catch (error) {
        if (error instanceof Error)
          showErrorSnackBar({
            message: `${url} n'a pas été copié dans ton press-papier: ${error.message}`,
            timeout: SNACK_BAR_TIME_OUT,
          })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deeplink]
  )

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
          <TouchableLink
            externalNav={{ url: deeplink.universalLink, params: { shouldLogEvent: false } }}>
            <Typo.Caption>{deeplink.universalLink}</Typo.Caption>
          </TouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <TouchableOpacity
            style={iconContainerStyle}
            onPress={() => copyToClipboard(deeplink.universalLink)}
            accessibilityLabel={t`Copier`}
            accessible
            testID="copy-universalLink">
            <Share />
          </TouchableOpacity>
        </Spacer.Flex>
      </Container>
      <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
      <Container>
        <Spacer.Flex flex={0.85}>
          <TouchableLink
            externalNav={{ url: deeplink.firebaseLink, params: { shouldLogEvent: false } }}>
            <Typo.Caption>{deeplink.firebaseLink}</Typo.Caption>
          </TouchableLink>
        </Spacer.Flex>

        <Spacer.Flex flex={0.15}>
          <TouchableOpacity
            style={iconContainerStyle}
            onPress={() => copyToClipboard(deeplink.firebaseLink)}
            accessibilityLabel={t`Copier dans le press-papier`}
            accessible
            testID="copy-firebaselink">
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
