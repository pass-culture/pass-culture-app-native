import React, { useState } from 'react'
import { Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'
import { getSpacing } from 'ui/theme'

export const ScrollToTopButton = ({
  transition,
  onPress,
}: {
  transition: Animated.AnimatedInterpolation
  onPress: () => void
}) => {
  const [disabled, setDisabled] = useState(true)
  transition.addListener((opacity) => {
    setDisabled(opacity.value === 0)
  })
  return (
    <Animated.View style={{ opacity: transition }}>
      <Container
        onPress={onPress}
        disabled={disabled}
        {...accessibilityAndTestId('Revenir en haut', 'ScrollToTop')}>
        <StyledLinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#bf275f', '#5a0d80']}>
          <ScrollToTopIcon />
        </StyledLinearGradient>
      </Container>
    </Animated.View>
  )
}

const Container = styledButton(Touchable)({ overflow: 'hidden' })

const StyledLinearGradient = styled(LinearGradient)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: getSpacing(10),
  width: getSpacing(10),
}))

const ScrollToTopIcon = styled(ScrollToTop).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``
