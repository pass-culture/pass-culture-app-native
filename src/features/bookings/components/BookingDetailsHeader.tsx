import React, { useState } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AnimatedBlurHeader } from 'ui/components/headers/AnimatedBlurHeader'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
}
/**
 * @param props.headerTransition should be between animated between 0 and 1
 */

export const BookingDetailsHeader: React.FC<Props> = (props) => {
  const theme = useTheme()
  const { headerTransition, title } = props
  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top

  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))

  const [accessibilityHiddenTitle, setAccessibilityHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAccessibilityHiddenTitle(opacity.value !== 1))

  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )

  return (
    <React.Fragment>
      <HeaderContainer style={containerStyle}>
        <Spacer.TopScreen />
        <AnimatedBlurHeader height={headerHeight} style={blurContainerNative} />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <IconContainer>
            <RoundedButton
              animationState={animationState}
              iconName="back"
              onPress={goBack}
              accessibilityLabel="Revenir en arrière"
            />
          </IconContainer>
          <Spacer.Flex />
          <Title
            style={{ opacity: headerTransition }}
            accessibilityHidden={accessibilityHiddenTitle}>
            <StyledBody>{title}</StyledBody>
          </Title>
          <Spacer.Flex />
          <IconContainer />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: theme.zIndex.header,
  borderBottomColor: theme.colors.greyLight,
  borderBottomWidth: 1,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const IconContainer = styled.View(({ theme }) => ({
  marginLeft: getSpacing(3),
  minWidth: theme.icons.sizes.standard,
}))

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})({
  textAlign: 'center',
  flex: 5,
  marginHorizontal: getSpacing(3),
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))
