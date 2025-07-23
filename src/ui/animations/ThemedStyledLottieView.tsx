/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'

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

interface AnimationObject {
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

  const animationData = useMemo(() => {
    if (typeof source !== 'object' || source === null || !('layers' in source)) {
      return source
    }

    const newAnimation = JSON.parse(JSON.stringify(source))
    const themedColor = hexToLottieRgb(designSystem.color.background.brandPrimary)

    const shapesToColor = ['Fill 1', 'Stroke 1']

    newAnimation.layers.forEach((layer: any) => {
      shapesToColor.forEach((shapeName) => {
        findAndSetColorInItems(layer.shapes, shapeName, themedColor)
      })
    })

    return newAnimation
  }, [designSystem.color.background.brandPrimary, source])

  return <StyledLottieView width={width} height={height} source={animationData} autoPlay loop />
}

const StyledLottieView = styled(LottieView)<{
  width: number
  height: number
}>(({ width, height }) => ({
  width: width,
  height: height,
}))
