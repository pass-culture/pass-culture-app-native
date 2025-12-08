/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, forwardRef, useImperativeHandle } from 'react'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { usePartialLottieAnimation } from 'shared/animations/useLottieAnimation'
import { patchLottieForTheme } from 'ui/animations/patchLottieForTheme'
import { AnimationObject } from 'ui/animations/type'

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
  selectThemeColor?: (theme: DefaultTheme) => string
}

export const ThemedStyledLottieView = forwardRef<LottieView | null, ThemedStyledLottieViewProps>(
  ({ width, height, source, autoPlay = false, loop = true, resizeMode, selectThemeColor }, ref) => {
    const theme = useTheme()

    const animationData = useMemo(() => {
      if (typeof source !== 'object' || source === null || !('layers' in source)) {
        return source
      }

      const fillColorFromTheme = selectThemeColor
        ? selectThemeColor(theme)
        : theme.designSystem.color.background.brandPrimary

      return patchLottieForTheme(source, {
        fill: fillColorFromTheme,
      })
    }, [theme, selectThemeColor, source])

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
