import React, { useState } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'

export const ScrollToTopButton = ({
  transition,
  onPress,
}: {
  transition: Animated.AnimatedInterpolation<string | number>
  onPress: () => void
}) => {
  const [disabled, setDisabled] = useState(true)
  transition.addListener((opacity: { value: number }) => {
    setDisabled(opacity.value === 0)
  })
  return (
    <Animated.View style={{ opacity: transition }}>
      <Container onPress={onPress} disabled={disabled} accessibilityLabel="Revenir en haut">
        <StyledView>
          <ScrollToTopIcon />
        </StyledView>
      </Container>
    </Animated.View>
  )
}

const Container = styledButton(Touchable)({ overflow: 'hidden' })

const StyledView = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: theme.designSystem.size.borderRadius.m,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: theme.designSystem.size.spacing.xxxl,
  width: theme.designSystem.size.spacing.xxxl,
}))

const ScrollToTopIcon = styled(ScrollToTop).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  size: theme.designSystem.size.icon.m,
}))``
