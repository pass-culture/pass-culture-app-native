import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useScaleAnimation } from 'features/favorites/hooks/useScaleFavoritesAnimation'
import { createLabels } from 'shared/handleTooManyCount/countUtils'
import { Bookings } from 'ui/svg/icons/Bookings'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const BookingsCountV2: React.FC<AccessibleIcon> = ({ size, color, testID, badgeValue }) => {
  const scale = useScaleAnimation(badgeValue)

  if (!badgeValue || badgeValue === 0) {
    return <Bookings size={size} color={color} testID={testID} />
  }

  const { fullCountLabel, accessibilityLabel } = createLabels(badgeValue, 'réservations')

  return (
    <Container>
      <Bookings size={size} color={color} />
      <StyledAnimatedView style={{ transform: [{ scale }] }}>
        <PastilleContainer accessibilityLabel={accessibilityLabel}>
          <Counter>{fullCountLabel}</Counter>
        </PastilleContainer>
      </StyledAnimatedView>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const StyledAnimatedView = styled(Animated.View)({
  position: 'absolute',
  right: getSpacing(2),
  top: 0,
})

const PastilleContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: getSpacing(3.25),
  paddingHorizontal: getSpacing(1),
}))

const Counter = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
