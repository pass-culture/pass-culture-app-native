import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const BicolorCircledCheckSvg: React.FC<BicolorIconInterface> = ({
  size,
  color,
  color2,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <Svg width={size} height={height} viewBox="0 0 141 110" fill="none" testID={testID} aria-hidden>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M70.5001 92.4636C49.5848 92.4636 32.6365 75.5153 32.6365 54.5999C32.6365 48.1587 34.2417 42.0861 37.0871 36.7915C37.582 35.8705 37.2366 34.7227 36.3156 34.2277C35.3946 33.7327 34.2468 34.0781 33.7518 34.9991C30.6147 40.8365 28.8501 47.5239 28.8501 54.5999C28.8501 77.6064 47.4936 96.2499 70.5001 96.2499C93.5066 96.2499 112.15 77.6064 112.15 54.5999C112.15 31.5935 93.5066 12.9499 70.5001 12.9499C63.3222 12.95 56.5566 14.7749 50.6451 17.9885C49.7265 18.4879 49.3867 19.6374 49.8861 20.556C50.3854 21.4746 51.5349 21.8145 52.4536 21.3151C57.8255 18.3948 63.9713 16.7363 70.5001 16.7363C91.4154 16.7363 108.364 33.6846 108.364 54.5999C108.364 75.5153 91.4154 92.4636 70.5001 92.4636ZM90.7152 42.2598C91.5059 43.0178 91.5325 44.2732 90.7746 45.064L88.2358 47.7127L88.227 47.7218L66.6366 70.2418L66.6363 70.2421C65.0819 71.8638 62.5203 71.8636 60.9661 70.2418L60.9612 70.2366L50.221 58.9476C49.466 58.154 49.4973 56.8986 50.2909 56.1436C51.0845 55.3886 52.3399 55.4199 53.0949 56.2134L63.8015 67.4672L85.3722 44.9678L85.3807 44.959L87.9109 42.3192C88.6689 41.5285 89.9244 41.5018 90.7152 42.2598Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="28.8501%"
          y1="12.95%"
          x2="60.4027%"
          y2="99.9135%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color2} />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export const BicolorCircledCheck = styled(BicolorCircledCheckSvg).attrs(
  ({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.illustrations.sizes.medium,
  })
)``
