/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, forwardRef, useImperativeHandle } from 'react'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { usePartialLottieAnimation } from 'shared/animations/useLottieAnimation'
import { AnimationObject } from 'ui/animations/type'

const hexToLottieRgb = (hex: string): number[] => {
  if (!hex) return [0, 0, 0, 1]
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result && result[1] && result[2] && result[3]
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        1,
      ]
    : [0, 0, 0, 1]
}

const findAndSetColorInItems = (items: any[], shapeName: string, color: number[]) => {
  if (!items) return
  items.forEach((item) => {
    if (item.nm === shapeName && item.c?.k) {
      item.c.k = color
    }
    // If this is a group, recurse into its items
    if (item.ty === 'gr' && item.it) {
      findAndSetColorInItems(item.it, shapeName, color)
    }
  })
}

export type AnimationSource =
  | string
  | AnimationObject
  | {
      uri: string
    }

type ThemedStyledLottieViewProps = {
  width?: number | string
  height: number | string
  source: AnimationSource
  autoPlay?: boolean
  loop?: boolean
  resizeMode?: 'center' | 'contain' | 'cover' | undefined
  temporarilyDeactivateColors?: boolean
}

export const ThemedStyledLottieView = forwardRef<LottieView | null, ThemedStyledLottieViewProps>(
  (
    {
      width,
      height,
      source,
      autoPlay = false,
      loop = false,
      resizeMode,
      temporarilyDeactivateColors = false, // TODO(PC-37129)
    },
    ref
  ) => {
    const { designSystem } = useTheme()

    const animationData = useMemo(() => {
      if (
        temporarilyDeactivateColors ||
        typeof source !== 'object' ||
        source === null ||
        !('layers' in source)
      ) {
        return source
      }

      const newAnimation = JSON.parse(JSON.stringify(source))
      const themedColor = hexToLottieRgb(designSystem.color.background.brandPrimary)

      const shapesToColor = ['Fill 1', 'Stroke 1', 'Fond 1'] // Gradients aren't supported
      newAnimation.layers.forEach((layer: any) => {
        shapesToColor.forEach((shapeName) => {
          findAndSetColorInItems(layer.shapes, shapeName, themedColor)
        })
      })

      return newAnimation
    }, [designSystem.color.background.brandPrimary, source, temporarilyDeactivateColors])

    const animationRef = usePartialLottieAnimation(animationData)

    useImperativeHandle(ref, () => animationRef.current as LottieView)

    return (
      <StyledLottieView
        ref={animationRef}
        width={width || height}
        height={height}
        source={animationData}
        autoPlay={autoPlay}
        loop={loop}
        resizeMode={resizeMode}
      />
    )
  }
)

ThemedStyledLottieView.displayName = 'ThemedStyledLottieView'

const StyledLottieView = styled(LottieView)<{
  width?: number | string
  height: number | string
}>(({ width, height }) => ({
  width,
  height,
}))
