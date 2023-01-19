import * as React from 'react'
import { Path, ClipPath, G, Defs } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const TwitchRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: clipPathId, fill: clipPathFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <G clipPath={clipPathFill}>
        <Path
          d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
          fill="#9146FF"
        />
        <Path
          d="m35.666 24.392-4.661 4.432h-4.668l-4.084 3.878v-3.878H17V12.216h18.665v12.176ZM15.835 10 10 15.534v19.932h7.002V41l5.834-5.534h4.668L38 25.5V10H15.835Zm16.337 6.267h-2.334v6.642h2.334v-6.642Zm-8.752-.031h2.333v6.642H23.42v-6.642Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h48v48H0z" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const TwitchRound = styled(TwitchRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
