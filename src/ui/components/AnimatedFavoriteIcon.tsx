import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import add_favorite from 'ui/animations/add_favorite.json'
import remove_favorite from 'ui/animations/remove_favorite.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'

const LOTTIE_SIZE_RATIO = 1.6
const ANIMATION_END_FRAMES = {
  add: 60,
  remove: 70,
} as const
const ANIMATION_SPEED = 2

const addFavoriteSource =
  Platform.OS === 'web' ? { ...add_favorite, fr: add_favorite.fr * ANIMATION_SPEED } : add_favorite

const removeFavoriteSource =
  Platform.OS === 'web'
    ? { ...remove_favorite, fr: remove_favorite.fr * ANIMATION_SPEED }
    : remove_favorite

export type FavoriteAnimationAction = 'add' | 'remove' | null

type AnimatedFavoriteIconProps = {
  isFavorited: boolean
  isPurple: boolean
  isRemoveSource: boolean
  animatingAction: FavoriteAnimationAction
  onAnimationFinish: () => void
}

export const AnimatedFavoriteIcon: React.FC<AnimatedFavoriteIconProps> = ({
  isFavorited,
  isPurple,
  isRemoveSource,
  animatingAction,
  onAnimationFinish,
}) => {
  const { designSystem } = useTheme()
  const lottieRef = useRef<LottieView>(null)

  useEffect(
    function syncLottieAnimation() {
      if (animatingAction) {
        const frameId = requestAnimationFrame(() => {
          lottieRef.current?.play(0, ANIMATION_END_FRAMES[animatingAction])
        })
        return () => cancelAnimationFrame(frameId)
      }

      lottieRef.current?.reset()

      return undefined
    },
    [animatingAction, isFavorited]
  )

  const iconSize = designSystem.size.icon.button
  const lottieSize = Math.round(iconSize * LOTTIE_SIZE_RATIO)

  return (
    <LottieIconContainer size={iconSize}>
      <ThemedStyledLottieView
        ref={lottieRef}
        width={lottieSize}
        height={lottieSize}
        resizeMode="contain"
        source={isRemoveSource ? removeFavoriteSource : addFavoriteSource}
        autoPlay={false}
        loop={false}
        usePartialPlayback={false}
        selectThemeColor={(theme) =>
          isPurple
            ? theme.designSystem.color.icon.brandPrimary
            : theme.designSystem.color.icon.default
        }
        onAnimationFinish={onAnimationFinish}
        speed={ANIMATION_SPEED}
      />
    </LottieIconContainer>
  )
}

const LottieIconContainer = styled.View<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
}))
