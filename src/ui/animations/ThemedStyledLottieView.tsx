/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'

// Copied AnimationObject from lottie-react-native as not available on web:
export interface AnimationObject {
  v: string
  fr: number
  ip: number
  op: number
  w: number
  h: number
  nm?: string
  ddd?: number
  assets: any[]
  layers: any[]
  markers?: any[]
}

type ThemedStyledLottieViewProps = {
  width: number
  height: number
  source: string | AnimationObject | { uri: string }
}

export const ThemedStyledLottieView = ({ width, height, source }: ThemedStyledLottieViewProps) => {
  const { designSystem } = useTheme()
  return (
    <StyledLottieView
      width={width}
      height={height}
      source={source}
      autoPlay
      loop
      colorFilters={[
        {
          keypath: '**.Stroke 1',
          color: designSystem.color.background.brandPrimary,
        },
        {
          keypath: '**.Fill 1',
          color: designSystem.color.background.brandPrimary,
        },
      ]}
    />
  )
}

const StyledLottieView = styled(LottieView)<{
  width: number
  height: number
}>(({ width, height }) => ({
  width: width,
  height: height,
}))
