import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorArrowRight: React.FC<BicolorIconInterface> = (props) => {
  const { size = 28, color, color2, style, testID } = props
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <Svg
      width={size}
      height={size}
      style={style}
      testID={testID}
      viewBox="0 0 22 18"
      fill="none"
      aria-hidden>
      <Path
        d="M11.6134 15.2066C10.96 15.8456 10.96 16.8817 11.6134 17.5207C12.2669 18.1598 13.3264 18.1598 13.9799 17.5207L21.5099 10.1571C22.1634 9.51804 22.1634 8.48196 21.5099 7.84292L13.9799 0.479281C13.3264 -0.159761 12.2669 -0.159761 11.6134 0.479281C10.96 1.11832 10.96 2.15441 11.6134 2.79345L16.2717 7.34876L1.67333 7.34876C0.749177 7.34876 -8.67113e-07 8.08138 -7.88106e-07 8.98512C-7.09099e-07 9.88886 0.749177 10.6215 1.67333 10.6215L16.3021 10.6215L11.6134 15.2066Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="22"
          y1="18"
          x2="16.2592"
          y2="-1.52288"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export const BicolorArrowRight = React.memo(
  styled(NotMemoizedBicolorArrowRight).attrs(({ color, color2, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
  }))``
)
