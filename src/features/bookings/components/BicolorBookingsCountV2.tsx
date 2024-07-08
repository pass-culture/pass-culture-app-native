import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useScaleAnimation } from 'features/favorites/helpers/useScaleFavoritesAnimation'
import { createLabels } from 'shared/handleTooManyCount/countUtils'
import { BicolorBookingsV2 } from 'ui/svg/icons/BicolorBookingsV2'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const BicolorBookingsCountV2: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  color2,
  testID,
}) => {
  //TODO(PC-29452): Update when got back info
  let bookingsCount: number
  // eslint-disable-next-line prefer-const
  bookingsCount = 1

  const scale = useScaleAnimation(bookingsCount)

  if (bookingsCount === 0) {
    return <BicolorBookingsV2 size={size} color={color} color2={color2} testID={testID} />
  }

  const { fullCountLabel, accessibilityLabel } = createLabels(bookingsCount, 'réservations')

  return (
    <Container>
      <BicolorBookingsV2 size={size} color={color} color2={color2} />
      <StyledAnimatedView style={{ transform: [{ scale }] }}>
        <PastilleContainer accessibilityLabel={accessibilityLabel}>
          <Counter>{fullCountLabel}</Counter>
        </PastilleContainer>
      </StyledAnimatedView>
    </Container>
  )
}

const Container = styled.View({ position: 'relative' })

const StyledAnimatedView = styled(Animated.View)({
  position: 'absolute',
  right: getSpacing(2),
  top: 0,
})

const PastilleContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.colors.primary,
  borderRadius: getSpacing(3.25),
  paddingHorizontal: getSpacing(1),
}))

const Counter = styled(Typo.Hint)(({ theme }) => ({
  color: theme.colors.white,
}))
