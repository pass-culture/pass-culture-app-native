import { t } from '@lingui/macro'
import React, { useEffect, useRef } from 'react'
import { Animated, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useFavoritesCount } from 'features/favorites/pages/useFavorites'
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
  const { colors, showTabBar } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const { data: favoritesCount } = useFavoritesCount()
  const scale = useScaleFavoritesAnimation(favoritesCount)

  if (!isLoggedIn || typeof favoritesCount === 'undefined') {
    return <BicolorFavorite size={size} color={color} color2={color2} thin={thin} testID={testID} />
  }
  const pastilleDimensions = {
    width: typeof size === 'number' ? size * 0.8 : 21,
    height: typeof size === 'number' ? size * 0.5 : 15,
  }
  const hasTooMany = favoritesCount >= COUNT_MAX
  const count = hasTooMany ? COUNT_MAX - 1 : favoritesCount || '0'
  const plusSign = hasTooMany ? t`+` : ''
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
        <Pastille color={thin ? colors.greyDark : undefined} {...pastilleDimensions} />
        <PastilleContent {...pastilleDimensions} showTabBar={showTabBar}>
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
  right: Platform.select<string | number>({ web: '-45%', default: -getSpacing(4) }),
  top: '10%',
  height: props.height,
  width: props.width,
}))

const PastilleContent = styled.View<{ height: number; width: number; showTabBar: boolean }>(
  (props) => ({
    position: 'absolute',
    bottom: Platform.select<string | undefined>({
      web: props.showTabBar ? '5%' : '20%',
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
  fontSize: 8,
  height: Platform.select<number>({ web: height, default: height + getSpacing(1) }),
  color: theme.colors.white,
}))

const Count = styled(Typo.Caption)<{ height: number }>(({ height, theme }) => ({
  fontSize: 9,
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
