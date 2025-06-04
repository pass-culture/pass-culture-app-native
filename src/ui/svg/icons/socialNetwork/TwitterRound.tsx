import React from 'react'
import { Path, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const TwitterRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 56 56">
      <Rect width={56} height={56} rx={28} fill="#161617" />
      <Path
        d="M36.8851 14H41.6379L31.2025 25.8819L43.3943 42H33.8268L26.336 32.2052L17.7604 42H13.0076L24.063 29.2915L12.3877 14H22.1929L28.9604 22.9476L36.8851 14ZM35.2216 39.2103H37.8563L20.8084 16.6863H17.9774L35.2216 39.2103Z"
        fill="white"
      />
    </AccessibleSvg>
  )
}

export const TwitterRound = styled(TwitterRoundSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.icons.sizes.standard,
}))``
