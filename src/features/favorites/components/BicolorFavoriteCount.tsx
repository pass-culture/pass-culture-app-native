import React, { useEffect, useRef } from 'react'
import { Animated, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useFavoritesCount } from 'features/favorites/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { plural } from 'libs/plural'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorFavoriteAuthed } from 'ui/svg/icons/BicolorFavoriteAuthed'
import { Pastille } from 'ui/svg/icons/Pastille'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

const COUNT_MAX = 100

export const BicolorFavoriteCount: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  thin = false,
  testID,
}) => {
  const {
    showTabBar,
    tabBar: { showLabels },
  } = useTheme()
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()
  const { data: favoritesCount } = useFavoritesCount()
  const scale = useScaleFavoritesAnimation(favoritesCount)

  if (!netInfo.isConnected || !isLoggedIn || typeof favoritesCount === 'undefined') {
    return (
      <BicolorFavorite
        size={size}
        color={color}
        color2={color2}
        thin={thin}
        accessibilityLabel={showTabBar && !showLabels ? 'Mes favoris' : undefined}
        testID={testID}
      />
    )
  }

  const widthFactor = showTabBar ? 0.95 : 0.8
  const heightFactor = showTabBar ? 0.55 : 0.5
  const pastilleDimensions = {
    width: typeof size === 'number' ? size * widthFactor : 21,
    height: typeof size === 'number' ? size * heightFactor : 15,
  }
  const hasTooMany = favoritesCount >= COUNT_MAX
  const count = hasTooMany ? COUNT_MAX - 1 : favoritesCount || '0'
  const plusSign = hasTooMany ? '+' : ''
  const accessibilityLabel =
    showTabBar && !showLabels
      ? plural(favoritesCount, {
          one: '# favori',
          other: '# favoris',
        })
      : `${favoritesCount}`
  return (
    <Container testID="bicolor-favorite-count">
      <BicolorFavoriteAuthed
        size={size}
        color={color}
        color2={color2}
        thin={thin}
        testID={testID}
      />
      <StyledAnimatedView style={{ transform: [{ scale }] }} {...pastilleDimensions}>
        <StyledPastille thin={thin} {...pastilleDimensions} />
        <PastilleContent
          {...pastilleDimensions}
          showTabBar={showTabBar}
          accessibilityLabel={accessibilityLabel}
          aria-live="polite"
          aria-relevant="text">
          <Count {...pastilleDimensions}>{count}</Count>
          <Plus {...pastilleDimensions}>{plusSign}</Plus>
        </PastilleContent>
      </StyledAnimatedView>
    </Container>
  )
}

const Container = styled.View({ position: 'relative' })

const StyledAnimatedView = styled(Animated.View)<{ height: number; width: number }>((props) => ({
  position: 'absolute',
  right: Platform.select<string | number>({
    web: props.theme.showTabBar ? -getSpacing(4.25) : -getSpacing(2.5),
    default: -getSpacing(4.5),
  }),
  top: '10%',
  height: props.height,
  width: props.width,
}))

const StyledPastille = styled(Pastille).attrs<{ thin?: boolean }>(({ theme, thin }) => ({
  color: thin ? theme.colors.greyDark : undefined,
}))<{ thin?: boolean }>``

const PastilleContent = styled.View<{ height: number; width: number; showTabBar: boolean }>(
  (props) => ({
    position: 'absolute',
    bottom: Platform.select<string | undefined>({
      web: props.showTabBar ? '3%' : '20%',
      default: '-8%',
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: props.theme.zIndex.favoritePastilleContent,
    height: props.height,
    width: props.width,
  })
)

const Plus = styled(Typo.Caption)<{ height: number }>(({ height, theme }) => ({
  fontSize: theme.showTabBar ? theme.tabBar.fontSize : 8,
  height: Platform.select<number>({ web: height, default: height + getSpacing(1) }),
  color: theme.colors.white,
}))

const Count = styled(Typo.Caption)<{ height: number }>(({ height, theme }) => ({
  fontSize: theme.showTabBar ? theme.tabBar.fontSize : 9,
  height: Platform.select<number>({ web: height, default: height + getSpacing(1) }),
  color: theme.colors.white,
}))

const useScaleFavoritesAnimation = (nbFavorites?: number) => {
  const scaleAnimation = useRef(new Animated.Value(1))

  useEffect(() => {
    if (typeof nbFavorites === 'number') {
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimation.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [nbFavorites])

  return scaleAnimation.current
}
