import React, { useEffect } from 'react'
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { Ellipse } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

type Props = {
  color: string
  compact?: boolean
  shadowColor: string
  size: number
}

type AnimatedShapeProps = {
  color: string
  delay: number
  progress: SharedValue<number>
}

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse)

const VIEWBOX_SIZE = 500
const COMPACT_VIEWBOX = '70 105 360 270'
const ANIMATION_DURATION = 1000
const DOT_POSITIONS = [130, 250, 370]
const DOT_DELAYS = [0, 0.23, 0.37]
const PHASE_INPUT = [0, 0.04, 0.2, 0.34, 0.42, 0.48, 0.64, 0.88, 1]

export const DotsLoader = ({ color, compact = false, shadowColor, size }: Props) => {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.linear }),
      -1
    )

    return () => cancelAnimation(progress)
  }, [progress])

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox={compact ? COMPACT_VIEWBOX : `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
      {DOT_POSITIONS.map((position, index) => (
        <AnimatedShadow
          key={`shadow-${position}`}
          color={shadowColor}
          cx={position}
          delay={DOT_DELAYS[index] ?? 0}
          progress={progress}
        />
      ))}
      {DOT_POSITIONS.map((position, index) => (
        <AnimatedDot
          key={`dot-${position}`}
          color={color}
          cx={position}
          delay={DOT_DELAYS[index] ?? 0}
          progress={progress}
        />
      ))}
    </AccessibleSvg>
  )
}

const AnimatedDot = ({ color, cx, delay, progress }: AnimatedShapeProps & { cx: number }) => {
  const animatedProps = useAnimatedProps(() => {
    const phase = (progress.value - delay + 1) % 1

    return {
      cy: interpolate(
        phase,
        PHASE_INPUT,
        [152, 152, 172, 274, 334, 312, 225, 152, 152],
        Extrapolation.CLAMP
      ),
      rx: interpolate(
        phase,
        PHASE_INPUT,
        [34, 34, 31, 29, 42, 34, 32, 34, 34],
        Extrapolation.CLAMP
      ),
      ry: interpolate(
        phase,
        PHASE_INPUT,
        [34, 34, 38, 45, 22, 40, 37, 34, 34],
        Extrapolation.CLAMP
      ),
    }
  })

  return <AnimatedEllipse animatedProps={animatedProps} cx={cx} fill={color} />
}

const AnimatedShadow = ({ color, cx, delay, progress }: AnimatedShapeProps & { cx: number }) => {
  const animatedProps = useAnimatedProps(() => {
    const phase = (progress.value - delay + 1) % 1

    return {
      opacity: interpolate(
        phase,
        PHASE_INPUT,
        [0.08, 0.08, 0.1, 0.16, 0.2, 0.18, 0.12, 0.08, 0.08],
        Extrapolation.CLAMP
      ),
      rx: interpolate(
        phase,
        PHASE_INPUT,
        [18, 18, 20, 27, 34, 31, 23, 18, 18],
        Extrapolation.CLAMP
      ),
      ry: interpolate(phase, PHASE_INPUT, [4, 4, 5, 7, 8, 7, 5, 4, 4], Extrapolation.CLAMP),
    }
  })

  return <AnimatedEllipse animatedProps={animatedProps} cx={cx} cy={356} fill={color} />
}
