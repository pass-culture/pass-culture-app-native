import { t } from '@lingui/macro'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { GeneratedDeeplink } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { openUrl } from 'features/navigation/helpers'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Share as DefaultShare } from 'ui/svg/icons/Share'
import { getSpacing, getSpacingString, Spacer } from 'ui/theme'
import { A } from 'ui/web/link/A'

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
          message: `${url} à été copié dans ton press-papier !`,
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
          <A href={deeplink.universalLink}>
            <TouchableOpacity
              onPress={() => openUrl(deeplink.universalLink, { shouldLogEvent: false })}>
              <Title>{deeplink.universalLink}</Title>
            </TouchableOpacity>
          </A>
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
          <A href={deeplink.firebaseLink}>
            <TouchableOpacity
              onPress={() => openUrl(deeplink.firebaseLink, { shouldLogEvent: false })}>
              <Title>{deeplink.firebaseLink}</Title>
            </TouchableOpacity>
          </A>
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

const Title = styled.Text(({ theme }) => ({
  fontFamily: theme.fontFamily.regular,
  fontSize: getSpacing(3),
  lineHeight: getSpacingString(4.5),
  color: theme.colors.black,
  flexDirection: 'row',
}))

const Container = styled.View({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
})

const Share = styled(DefaultShare).attrs(({ theme }) => ({ size: theme.icons.sizes.small }))``
