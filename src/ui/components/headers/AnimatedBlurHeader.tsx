import React, { useState } from 'react'
import { Animated, Platform, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { BlurView } from 'ui/components/BlurView'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  height: number
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
  style?: Animated.WithAnimatedObject<ViewStyle>
}

type AnimatedBlurHeaderFullProps = {
  headerTitle: string
  headerTransition: Animated.AnimatedInterpolation
  onBackPress: () => void
  titleTestID?: string
  RightButton?: React.ReactNode
}

export const AnimatedBlurHeaderTitle = ({
  headerTitle,
  headerTransition,
  onBackPress,
  titleTestID,
  RightButton,
}: AnimatedBlurHeaderFullProps) => {
  const theme = useTheme()
  const headerHeight = useGetHeaderHeight()
  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  return (
    <HeaderContainer style={containerStyle} height={headerHeight}>
      <Spacer.TopScreen />
      <AnimatedBlurHeader height={headerHeight} style={blurContainerNative} />
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
        <Spacer.Row numberOfSpaces={10} />
        <Spacer.Flex />
        <Title
          testID={titleTestID}
          style={{ opacity: headerTransition }}
          accessibilityHidden={ariaHiddenTitle}>
          <Body>{headerTitle}</Body>
        </Title>
        <Spacer.Flex />
        {RightButton ? (
          <React.Fragment>{RightButton}</React.Fragment>
        ) : (
          <Spacer.Row numberOfSpaces={25} />
        )}
      </Row>
      <Spacer.Column numberOfSpaces={2} />
    </HeaderContainer>
  )
}

export const AnimatedBlurHeader = ({
  height,
  blurAmount = 8,
  blurType = 'light',
  style,
}: Props) => {
  // There is an issue with the blur on Android: we chose not to render it and use a white background
  // https://github.com/Kureev/react-native-blur/issues/511
  if (Platform.OS === 'android') return null

  return (
    <BlurNativeContainer height={height} style={style}>
      <Blurred blurType={blurType} blurAmount={blurAmount} />
    </BlurNativeContainer>
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
