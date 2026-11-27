import React, { useEffect, useId } from 'react'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { ClipPath, Defs, Path, Polygon } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { interpolateKeyframes } from 'shared/animations/interpolateKeyframes'
import {
  ADD_FAVORITE_DURATION,
  HEART_CRACK_POINTS,
  REMOVE_FAVORITE_DURATION,
  addFavoriteKeyframes as add,
  removeFavoriteKeyframes as remove,
} from 'ui/animations/favoriteKeyframes'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { Favorite } from 'ui/svg/icons/Favorite'
import {
  FAVORITE_FILLED_PATH,
  FAVORITE_FILLED_VIEWBOX,
  FavoriteFilled,
} from 'ui/svg/icons/FavoriteFilled'

export type FavoriteAnimationAction = 'add' | 'remove' | null

const ANIMATION_DURATIONS = {
  add: ADD_FAVORITE_DURATION,
  remove: REMOVE_FAVORITE_DURATION,
} as const

type AnimatedFavoriteIconProps = {
  isFavorited: boolean
  isPurple: boolean
  animatingAction: FavoriteAnimationAction
  onAnimationFinish: () => void
}

export const AnimatedFavoriteIcon: React.FC<AnimatedFavoriteIconProps> = ({
  isFavorited,
  isPurple,
  animatingAction,
  onAnimationFinish,
}) => {
  const { designSystem } = useTheme()
  const size = designSystem.size.icon.button
  const color = isPurple ? designSystem.color.icon.brandPrimary : designSystem.color.icon.default
  const elapsedTime = useSharedValue(0)

  useEffect(
    function playFavoriteAnimation() {
      if (!animatingAction) return undefined

      const duration = ANIMATION_DURATIONS[animatingAction]
      elapsedTime.value = 0
      elapsedTime.value = withTiming(duration, { duration, easing: Easing.linear })
      // A JS timer (rather than the withTiming callback) keeps the end of the animation
      // deterministic in tests, where Reanimated is mocked and completes synchronously
      const timeout = setTimeout(onAnimationFinish, duration)

      return () => {
        clearTimeout(timeout)
        cancelAnimation(elapsedTime)
      }
    },
    [animatingAction, elapsedTime, onAnimationFinish]
  )

  const heartStyle = useAnimatedStyle(() => {
    const t = elapsedTime.value
    const isAdding = animatingAction === 'add'
    return {
      transform: [
        { scaleX: isAdding ? interpolateKeyframes(t, add.heartScaleX) : 1 },
        { scaleY: isAdding ? interpolateKeyframes(t, add.heartScaleY) : 1 },
      ],
    }
  }, [animatingAction, elapsedTime])

  const outlineStyle = useAnimatedStyle(() => {
    const t = elapsedTime.value
    if (animatingAction === 'add') {
      return { opacity: interpolateKeyframes(t, add.outlineOpacity), transform: [] }
    }
    if (animatingAction === 'remove') {
      return {
        opacity: 1,
        transform: [
          { scaleX: interpolateKeyframes(t, remove.outlineScaleX) },
          { scaleY: interpolateKeyframes(t, remove.outlineScaleY) },
        ],
      }
    }
    return { opacity: isFavorited ? 0 : 1, transform: [] }
  }, [animatingAction, elapsedTime, isFavorited])

  const filledStyle = useAnimatedStyle(() => {
    const t = elapsedTime.value
    if (animatingAction === 'add') {
      return { opacity: interpolateKeyframes(t, add.filledOpacity), transform: [] }
    }
    if (animatingAction === 'remove') {
      return {
        opacity: interpolateKeyframes(t, remove.filledOpacity),
        transform: [{ scaleY: interpolateKeyframes(t, remove.filledScaleY) }],
      }
    }
    return { opacity: isFavorited ? 1 : 0, transform: [] }
  }, [animatingAction, elapsedTime, isFavorited])

  const leftHalfStyle = useAnimatedStyle(() => {
    const offset =
      animatingAction === 'remove'
        ? interpolateKeyframes(elapsedTime.value, remove.leftHalfTranslateX)
        : 0
    return { transform: [{ translateX: offset * size }] }
  }, [animatingAction, elapsedTime, size])

  const rightHalfStyle = useAnimatedStyle(() => {
    const offset =
      animatingAction === 'remove'
        ? interpolateKeyframes(elapsedTime.value, remove.rightHalfTranslateX)
        : 0
    return { transform: [{ translateX: offset * size }] }
  }, [animatingAction, elapsedTime, size])

  return (
    <Container size={size}>
      <Layer style={heartStyle}>
        <Layer style={outlineStyle}>
          <Favorite size={size} color={color} />
        </Layer>
        <FilledLayer style={filledStyle}>
          {animatingAction === 'remove' ? (
            <React.Fragment>
              <HeartHalf side="left" size={size} color={color} style={leftHalfStyle} />
              <HeartHalf side="right" size={size} color={color} style={rightHalfStyle} />
            </React.Fragment>
          ) : (
            // A single shape otherwise, to avoid an anti-aliasing seam between the halves
            <FavoriteFilled size={size} color={color} />
          )}
        </FilledLayer>
      </Layer>
    </Container>
  )
}

const Container = styled.View<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  overflow: 'visible',
}))

const Layer = styled(Animated.View)({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

const FilledLayer = styled(Layer)({
  transformOrigin: 'bottom',
})

// Each half slightly overlaps the crack, to avoid an anti-aliasing seam while they are joined
const CRACK_OVERLAP = 0.3
const VIEWBOX_WIDTH = 48
const VIEWBOX_HEIGHT = 49

const getHalfClipPolygon = (side: 'left' | 'right') => {
  const outerX = side === 'left' ? 0 : VIEWBOX_WIDTH
  const overlap = side === 'left' ? CRACK_OVERLAP : -CRACK_OVERLAP
  const [firstCrackPoint] = HEART_CRACK_POINTS
  const lastCrackPoint = HEART_CRACK_POINTS.at(-1)
  const points = [
    [outerX, 0],
    [(firstCrackPoint?.[0] ?? VIEWBOX_WIDTH / 2) + overlap, 0],
    ...HEART_CRACK_POINTS.map(([x, y]) => [x + overlap, y]),
    [(lastCrackPoint?.[0] ?? VIEWBOX_WIDTH / 2) + overlap, VIEWBOX_HEIGHT],
    [outerX, VIEWBOX_HEIGHT],
  ]
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

const HALF_CLIP_POLYGONS = {
  left: getHalfClipPolygon('left'),
  right: getHalfClipPolygon('right'),
} as const

type HeartHalfProps = {
  side: 'left' | 'right'
  size: number
  color: string
  style: React.ComponentProps<typeof Animated.View>['style']
}

// The filled heart is drawn twice, each copy clipped along the zigzag crack, so it can break in two
const HeartHalf = ({ side, size, color, style }: HeartHalfProps) => {
  // Sanitized because React ids contain characters that break `url(#id)` references on web
  const clipPathId = `heart-${side}-${useId().replace(/[^\w-]/g, '')}`
  return (
    <Layer style={style}>
      <AccessibleSvg width={size} height={size} viewBox={FAVORITE_FILLED_VIEWBOX}>
        <Defs>
          <ClipPath id={clipPathId}>
            <Polygon points={HALF_CLIP_POLYGONS[side]} />
          </ClipPath>
        </Defs>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          fill={color}
          d={FAVORITE_FILLED_PATH}
          clipPath={`url(#${clipPathId})`}
        />
      </AccessibleSvg>
    </Layer>
  )
}
