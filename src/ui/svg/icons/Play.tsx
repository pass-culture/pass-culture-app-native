import * as React from 'react'
import { Circle, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const PlaySvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel ?? `Jouer`}
      testID={testID}>
      <Circle r={10} cx={24} cy={24} fill="white" />
      <Path
        fill={color}
        d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-1.89-12.073 9.394-6.263a2 2 0 0 0 0-3.328l-9.395-6.263C20.78 15.187 19 16.14 19 17.737v12.526c0 1.597 1.78 2.55 3.11 1.664Z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const Play = styled(PlaySvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
