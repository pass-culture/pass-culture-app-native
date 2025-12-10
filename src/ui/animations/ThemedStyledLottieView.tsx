/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, forwardRef, useImperativeHandle } from 'react'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { usePartialLottieAnimation } from 'shared/animations/useLottieAnimation'
import { patchLottieForTheme } from 'ui/animations/helpers/patchLottieForTheme'
import { patchNamedShapes } from 'ui/animations/helpers/patchNamedShapes'
import { AnimationObject } from 'ui/animations/type'

export type AnimationSource =
  | string
  | AnimationObject
  | {
      uri: string
    }

export type ThemedStyledLottieViewProps = {
  width?: number | string
  height: number | string
  source: AnimationSource
  autoPlay?: boolean
  loop?: boolean
  resizeMode?: 'center' | 'contain' | 'cover' | undefined
  selectThemeColor?: (theme: DefaultTheme) => string
  coloringMode?: 'global' | 'targeted'
  targetShapeNames?: string[]
  targetLayerNames?: string[]
}

export const ThemedStyledLottieView = forwardRef<LottieView | null, ThemedStyledLottieViewProps>(
  (
    {
      width,
      height,
      source,
      autoPlay = false,
      loop = true,
      resizeMode,
      selectThemeColor,
      coloringMode = 'global',
      targetShapeNames,
      targetLayerNames,
    },
    ref
  ) => {
    const theme = useTheme()

    const animationData = useMemo(() => {
      if (typeof source !== 'object' || source === null || !('layers' in source)) {
        return source
      }

      const fillColorFromTheme =
        selectThemeColor?.(theme) ?? theme.designSystem.color.background.brandPrimary

      if (coloringMode === 'targeted') {
        return patchNamedShapes(source, targetShapeNames ?? ['Fond 1'], fillColorFromTheme, {
          targetLayerNames,
        })
      }

      return patchLottieForTheme(source, { fill: fillColorFromTheme })
    }, [theme, selectThemeColor, source, coloringMode, targetShapeNames, targetLayerNames])

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
        renderMode="SOFTWARE" // without this, animation breaks on iOS
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
