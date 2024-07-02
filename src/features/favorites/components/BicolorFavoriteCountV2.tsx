import React from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFavoritesCount } from 'features/favorites/api'
import { useScaleAnimation } from 'features/favorites/helpers/useScaleFavoritesAnimation'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { handleTooManyCount } from 'shared/handleTooManyCount/handleTooManyCount'
import { BicolorFavoriteV2 } from 'ui/svg/icons/BicolorFavoriteV2'
import { Pastille } from 'ui/svg/icons/Pastille'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const BicolorFavoriteCountV2: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  color2,
  testID,
}) => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()
  const { data: favoritesCount } = useFavoritesCount()
  const scale = useScaleAnimation(favoritesCount)

  if (!netInfo.isConnected || !isLoggedIn || favoritesCount === undefined) {
    return <BicolorFavoriteV2 size={size} color={color} color2={color2} testID={testID} />
  }

  const height = 0.55 * Number(size)
  const { accessibilityLabel, fullCountLabel } = handleTooManyCount(favoritesCount)

  return (
    <Container testID="bicolor-favorite-count-v2">
      <BicolorFavoriteV2 size={size} color={color} color2={color2} />
      <StyledAnimatedView style={{ transform: [{ scale }] }}>
        <Pastille color={color} width={size} height={height} />
        <PastilleContent
          width={size}
          height={height}
          accessibilityLabel={accessibilityLabel}
          accessibilityLiveRegion="polite">
          <TextContainer height={height}>
            <Counter>{fullCountLabel}</Counter>
          </TextContainer>
        </PastilleContent>
      </StyledAnimatedView>
    </Container>
  )
}

const Container = styled.View({ position: 'relative' })

const StyledAnimatedView = styled(Animated.View)({
  position: 'absolute',
  right: -getSpacing(3.5),
  top: -getSpacing(1),
})

const PastilleContent = styled.View<{ height: number; width: number }>(
  ({ theme, height, width }) => ({
    position: 'absolute',
    top: Platform.OS === 'web' ? -getSpacing(0.25) : getSpacing(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    width,
    zIndex: theme.zIndex.favoritePastilleContent,
  })
)

const TextContainer = styled.Text<{ height: number }>(({ height }) => ({
  height: height + getSpacing(1),
  textAlign: 'center',
}))

const Counter = styled(Typo.Hint)(({ theme }) => ({
  color: theme.colors.white,
}))
