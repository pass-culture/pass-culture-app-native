import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ScreenPlaySvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5.01C2 3.392 3.207 2 4.795 2h10.71a.5.5 0 0 1 0 1H4.795C3.843 3 3 3.858 3 5.01v9.98C3 16.142 3.843 17 4.795 17h14.41c.948 0 1.795-.858 1.795-2.01V5.01C21 3.858 20.157 3 19.205 3h-.395a.5.5 0 0 1 0-1h.395C20.793 2 22 3.392 22 5.01v9.98c0 1.618-1.213 3.01-2.795 3.01H12.5v3h3.75a.5.5 0 1 1 0 1h-5.5a.5.5 0 1 1 0-1h.75v-3H4.795C3.207 18 2 16.608 2 14.99V5.01ZM7.5 21a.5.5 0 1 0 0 1h1a.5.5 0 0 0 0-1h-1Zm7.004-11.777-3.243-1.63A.869.869 0 0 0 10 8.37v3.265a.869.869 0 0 0 1.26.776l3.244-1.63.005-.002c.623-.323.639-1.233-.006-1.556Zm-.676.78L11 8.582v2.841l2.828-1.42Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const ScreenPlay = styled(ScreenPlaySvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
