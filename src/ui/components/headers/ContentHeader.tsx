import React, { useState } from 'react'
import { Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { BlurView } from 'ui/components/BlurView'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { Spacer, Typo } from 'ui/theme'

type AnimatedBlurHeaderFullProps = {
  headerTitle?: string
  headerTransition: Animated.AnimatedInterpolation<string | number>
  onBackPress: () => void
  titleTestID?: string
  RightElement?: React.ReactNode
  LeftElement?: React.ReactNode
}

export const ContentHeader = ({
  headerTitle,
  headerTransition,
  onBackPress,
  titleTestID,
  RightElement,
  LeftElement,
}: AnimatedBlurHeaderFullProps) => {
  const theme = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top
  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  return (
    <HeaderContainer style={containerStyle} height={headerHeight}>
      <Spacer.TopScreen />
      {
        // There is an issue with the blur on Android: we chose not to render it and use a white background
        // https://github.com/Kureev/react-native-blur/issues/511
        Platform.OS !== 'android' && (
          <BlurNativeContainer height={headerHeight} style={blurContainerNative}>
            <Blurred blurType="light" blurAmount={8} />
          </BlurNativeContainer>
        )
      }
      <Spacer.Column numberOfSpaces={2} />
      <Row>
        <Spacer.Row numberOfSpaces={6} />
        <RoundedButton
          animationState={animationState}
          iconName="back"
          onPress={onBackPress}
          accessibilityLabel="Revenir en arrière"
          finalColor={theme.colors.black}
          initialColor={theme.colors.black}
        />
        {LeftElement ? <React.Fragment>{LeftElement}</React.Fragment> : null}
        <Spacer.Flex />
        <Title
          testID={titleTestID}
          style={{ opacity: headerTransition }}
          accessibilityHidden={ariaHiddenTitle}>
          <Body>{headerTitle}</Body>
        </Title>
        <Spacer.Flex />
        {RightElement ? (
          <React.Fragment>
            {RightElement}
            <Spacer.Row numberOfSpaces={6} />
          </React.Fragment>
        ) : (
          <Spacer.Row numberOfSpaces={16} />
        )}
      </Row>
      <Spacer.Column numberOfSpaces={2} />
    </HeaderContainer>
  )
}

const Blurred = styled(BlurView)({
  flex: 1,
})

const BlurNativeContainer = styled(Animated.View)<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  overflow: 'hidden',
}))

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

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
