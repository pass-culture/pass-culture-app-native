import * as React from 'react'
import { G, Path, Defs, RadialGradient, Stop, Circle, ClipPath } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

const InstagramRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: grandientId1, fill: gradientFill1 } = svgIdentifier()
  const { id: grandientId2, fill: gradientFill2 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <G clipPath={gradientFill1}>
        <Circle cx={24} cy={24} r={24} fill={gradientFill} />
        <Circle cx={24} cy={24} r={24} fill={gradientFill2} />
        <Path
          d="M24 31c-3.859 0-7-3.14-7-7s3.141-7 7-7c3.86 0 7 3.14 7 7s-3.14 7-7 7Zm0-12c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5ZM32.4 17a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z"
          fill="#fff"
        />
        <Path
          d="M30.462 38H17.538C13.383 38 10 34.618 10 30.462V17.538C10 13.383 13.383 10 17.538 10h12.924C34.617 10 38 13.382 38 17.538v12.924C38 34.617 34.617 38 30.462 38ZM17.538 12.154a5.39 5.39 0 0 0-5.384 5.384v12.924a5.39 5.39 0 0 0 5.384 5.384h12.924a5.39 5.39 0 0 0 5.384-5.384V17.538a5.39 5.39 0 0 0-5.384-5.384H17.538Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <RadialGradient
          id={gradientId}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 -47.5715 44.2453 0 12.75 51.697)">
          <Stop stopColor="#FD5" />
          <Stop offset={0.1} stopColor="#FD5" />
          <Stop offset={0.5} stopColor="#FF543E" />
          <Stop offset={1} stopColor="#C837AB" />
        </RadialGradient>
        <RadialGradient
          id={grandientId2}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(78.681 -6.13 -3.176) scale(21.2647 87.6539)">
          <Stop stopColor="#3771C8" />
          <Stop offset={0.128} stopColor="#3771C8" />
          <Stop offset={1} stopColor="#60F" stopOpacity={0} />
        </RadialGradient>
        <ClipPath id={grandientId1}>
          <Path fill="#fff" d="M0 0h48v48H0z" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const InstagramRound = styled(InstagramRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
