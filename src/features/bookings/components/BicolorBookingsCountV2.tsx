import React from 'react'
import { Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { useScaleAnimation } from 'features/favorites/helpers/useScaleFavoritesAnimation'
import { handleTooManyCount } from 'shared/handleTooManyCount/handleTooManyCount'
import { BicolorBookingsV2 } from 'ui/svg/icons/BicolorBookingsV2'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const BicolorBookingsCountV2: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  color2,
  testID,
}) => {
  const theme = useTheme()

  //TODO(PC-29452): Update when got back info
  let bookingsCount: number
  // eslint-disable-next-line prefer-const
  bookingsCount = 1

  const scale = useScaleAnimation(bookingsCount)

  if (bookingsCount === 0) {
    return <BicolorBookingsV2 size={size} color={color} color2={color2} testID={testID} />
  }

  const fullCountLabel = handleTooManyCount(bookingsCount)

  return (
    <Container>
      <BicolorBookingsV2 size={size} color={color} color2={color2} />
      <StyledAnimatedView style={{ transform: [{ scale }] }}>
        <PastilleContainer accessibilityLabel={fullCountLabel}>
          <StyledLinearGradient colors={[theme.colors.primary, theme.colors.secondary]}>
            <Counter>{fullCountLabel}</Counter>
          </StyledLinearGradient>
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

const StyledLinearGradient = styled(LinearGradient).attrs(({ colors }) => ({
  colors,
  start: { x: 1, y: 0 },
  end: { x: 0, y: 1 },
}))({
  width: '100%',
  height: '100%',
  borderRadius: getSpacing(3.25),
  paddingHorizontal: getSpacing(1),
})

const PastilleContainer = styled.View({
  position: 'absolute',
})

const Counter = styled(Typo.Hint)(({ theme }) => ({
  color: theme.colors.white,
}))
