import React, { useState } from 'react'
import { Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'
import { Button } from 'ui/designSystem/Button/Button'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AnimatedBlurHeaderFullProps = {
  headerTitle?: string
  headerTransition: Animated.AnimatedInterpolation<string | number>
  customHeaderTitleTransition?: Animated.AnimatedInterpolation<string | number>
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
  customHeaderTitleTransition,
  RightElement,
  LeftElement,
}: AnimatedBlurHeaderFullProps) => {
  const theme = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top
  const { containerStyle, blurContainerNative } = getAnimationState(theme, headerTransition)

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  const marginTopHeader = Platform.OS === 'ios' ? top : top + theme.designSystem.size.spacing.s

  return (
    <HeaderContainer style={containerStyle} height={headerHeight}>
      {
        // There is an issue with the blur on Android: we chose not to render it and use a white background
        // https://github.com/Kureev/react-native-blur/issues/511
        Platform.OS === 'android' ? null : (
          <BlurNativeContainer height={headerHeight} style={blurContainerNative}>
            <BlurryWrapper />
          </BlurNativeContainer>
        )
      }
      <Row
        marginRight={RightElement ? theme.designSystem.size.spacing.xl : getSpacing(16)}
        marginTop={marginTopHeader}>
        <Button
          iconButton
          icon={ArrowPrevious}
          onPress={onBackPress}
          accessibilityLabel="Revenir en arrière"
          variant="secondary"
          color="neutral"
        />
        {LeftElement}
        <TitleContainer>
          <Title
            {...getHeadingAttrs(1)}
            testID={titleTestID}
            style={{
              opacity: customHeaderTitleTransition ?? headerTransition,
            }} // Utilisation de l'interpolation effective
            accessibilityHidden={ariaHiddenTitle}>
            <Body>{headerTitle}</Body>
          </Title>
        </TitleContainer>
        {RightElement}
      </Row>
    </HeaderContainer>
  )
}

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
  borderBottomColor: theme.designSystem.color.border.subtle,
  borderBottomWidth: 1,
}))

const TitleContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
})

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})({
  flexShrink: 1,
  textAlign: 'center',
  ...(Platform.OS === 'web' ? { whiteSpace: 'pre-wrap' } : {}),
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))

const Row = styled.View<{ marginRight: number; marginTop: number }>(
  ({ marginRight, marginTop, theme }) => ({
    ...(Platform.OS === 'web' ? { flex: 1 } : {}),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop,
    marginBottom: theme.designSystem.size.spacing.s,
    marginLeft: theme.designSystem.size.spacing.xl,
    marginRight,
  })
)
