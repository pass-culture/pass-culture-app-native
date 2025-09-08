import React, { useState } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'
import { getSpacing } from 'ui/theme'

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
  backgroundColor: theme.designSystem.color.background.brandSecondary,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: getSpacing(10),
  width: getSpacing(10),
}))

const ScrollToTopIcon = styled(ScrollToTop).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.small,
}))``
