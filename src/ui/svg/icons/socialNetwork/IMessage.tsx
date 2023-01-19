import * as React from 'react'
import { Path, Defs, Rect, LinearGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const IMessageRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Rect width={48} height={48} rx={24} fill={gradientFill} />
      <Path
        d="M24.01 12c-2.893 0-5.568.726-7.8 1.979-.377.212-.749.424-1.099.665-.337.234-.647.489-.956.747-.012.01-.03.01-.042.02C11.58 17.521 10 20.43 10 23.648c0 3.172 1.543 6.033 4.012 8.134.012.086.02.179.02.243a3.373 3.373 0 0 1-3.34 3.391 7.946 7.946 0 0 0 2.973.585c1.804 0 3.429-.651 4.745-1.675 1.791.652 3.688.987 5.6.989 7.731 0 13.99-5.229 13.99-11.668C38 17.208 31.74 12 24.01 12Z"
        fill={gradientFill2}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={24}
          y1={0}
          x2={24}
          y2={48}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#00EA66" />
          <Stop offset={1} stopColor="#00D50F" />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1={23.978}
          y1={35.753}
          x2={23.978}
          y2={22.423}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E5F5D9" />
          <Stop offset={1} stopColor="#fff" />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const IMessageRound = styled(IMessageRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
