import React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ListSvg = ({ size, color, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G fill={color}>
        <Path d="M13.3333 4H3C2.44667 4 2 3.55333 2 3C2 2.44667 2.44667 2 3 2H13.3333C13.8867 2 14.3333 2.44667 14.3333 3C14.3333 3.55333 13.8867 4 13.3333 4Z" />
        <Path d="M13.3333 14H3C2.44667 14 2 13.5533 2 13C2 12.4467 2.44667 12 3 12H13.3333C13.8867 12 14.3333 12.4467 14.3333 13C14.3333 13.5533 13.8867 14 13.3333 14Z" />
        <Path d="M13.3333 9H3C2.44667 9 2 8.55333 2 8C2 7.44667 2.44667 7 3 7H13.3333C13.8867 7 14.3333 7.44667 14.3333 8C14.3333 8.55333 13.8867 9 13.3333 9Z" />
      </G>
    </AccessibleSvg>
  )
}

export const List = styled(ListSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
