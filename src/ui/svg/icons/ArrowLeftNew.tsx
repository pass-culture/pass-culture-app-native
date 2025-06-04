import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ArrowLeftNewSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  style,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    style={style}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M4.07,24.64c-.04.09-.05.19-.06.28,0,.03-.02.05-.02.08,0,0,0,0,0,0,0,.13.03.25.07.37.02.05.06.09.08.13.04.06.06.12.11.17l15,16c.38.4,1.01.42,1.41.05.4-.38.42-1.01.05-1.41l-13.42-14.32h35.69c.55,0,1-.45,1-1s-.45-1-1-1H7.22l13.53-15.34c.37-.41.33-1.05-.09-1.41-.19-.17-.43-.25-.66-.25-.28,0-.55.11-.75.34L4.25,24.34s-.06.1-.09.15c-.03.05-.07.09-.09.15Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const ArrowLeftNew = styled(ArrowLeftNewSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
