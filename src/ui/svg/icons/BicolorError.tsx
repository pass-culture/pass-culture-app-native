import * as React from 'react'
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIconInterface } from './types'

const BicolorErrorSvg: React.FC<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200

  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 151 117"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="30.875"
          y1="13.875"
          x2="64.6814"
          y2="107.05">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M75.5 17.9318C53.0907 17.9318 34.9318 36.0907 34.9318 58.5C34.9318 80.9093 53.0907 99.0682 75.5 99.0682C97.9093 99.0682 116.068 80.9093 116.068 58.5C116.068 51.5049 114.291 44.92 111.162 39.1644C110.627 38.1802 110.991 36.9486 111.976 36.4135C112.96 35.8785 114.191 36.2426 114.727 37.2268C118.17 43.5605 120.125 50.8094 120.125 58.5C120.125 83.1498 100.15 103.125 75.5 103.125C50.8502 103.125 30.875 83.1498 30.875 58.5C30.875 33.8502 50.8502 13.875 75.5 13.875C83.0815 13.875 90.2466 15.7657 96.5009 19.1268C97.4877 19.6572 97.8577 20.887 97.3274 21.8738C96.7971 22.8606 95.5672 23.2306 94.5805 22.7003C88.9077 19.6517 82.4013 17.9318 75.5 17.9318ZM72.8437 77.0938C72.8437 75.6267 74.033 74.4375 75.5 74.4375C76.967 74.4375 78.1562 75.6267 78.1562 77.0938C78.1562 78.5608 76.967 79.75 75.5 79.75C74.033 79.75 72.8437 78.5608 72.8437 77.0938ZM77.625 39.2714C77.625 38.155 76.6736 37.25 75.5 37.25C74.3264 37.25 73.375 38.155 73.375 39.2714V64.9786C73.375 66.095 74.3264 67 75.5 67C76.6736 67 77.625 66.095 77.625 64.9786V39.2714Z"
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const BicolorError = styled(BicolorErrorSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? color ?? theme.colors.secondary,
  size: size ?? theme.illustrations.sizes.medium,
}))``
