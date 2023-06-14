import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { Animated, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AnimatedBlurHeader } from 'ui/components/headers/AnimatedBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  title?: string
  headerTransition: Animated.AnimatedInterpolation
}

export const useGetThematicHeaderHeight = () => {
  const theme = useTheme()
  const { top } = useCustomSafeInsets()

  return theme.appBarHeight + top
}

export const ThematicHomeHeader: FunctionComponent<Props> = ({ title, headerTransition }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])
  const headerHeight = useGetThematicHeaderHeight()

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  const theme = useTheme()
  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )

  return (
    <React.Fragment>
      <HeaderContainer style={containerStyle} height={headerHeight}>
        <Spacer.TopScreen />
        {
          // There is an issue with the blur on Android: we chose not to render it and use a white background
          Platform.OS !== 'android' && (
            <AnimatedBlurHeader height={headerHeight} style={blurContainerNative} />
          )
        }
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Spacer.Row numberOfSpaces={6} />
          <RoundedButton
            animationState={animationState}
            iconName="back"
            onPress={onGoBack}
            accessibilityLabel="Revenir en arrière"
            finalColor={theme.colors.black}
          />
          <Spacer.Row testID="leftShareIconPlaceholder" numberOfSpaces={13} />
          <Spacer.Flex />
          <Title
            testID="offerHeaderName"
            style={{ opacity: headerTransition }}
            accessibilityHidden={ariaHiddenTitle}>
            <Body>{title}</Body>
          </Title>
          <Spacer.Flex />
          <Spacer.Row testID="rightSpacer" numberOfSpaces={25} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled(Animated.View)<{ height: number }>(({ theme, height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  zIndex: theme.zIndex.header,
  borderBottomColor: theme.colors.greyLight,
  borderBottomWidth: 1,
}))

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  flexShrink: 1,
  textAlign: 'center',
  color: theme.colors.white,
  ...(Platform.OS === 'web' ? { whiteSpace: 'pre-wrap' } : {}),
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))
