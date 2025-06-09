import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleRectangleIcon } from './types'

const CheckboxMarkSvg: React.FunctionComponent<AccessibleRectangleIcon> = ({
  width,
  height,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={width}
    height={height}
    viewBox="0 0 17 11"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={color}
      d="M6 6.728L2.049 2.776c-.47-.468-1.229-.468-1.698 0-.468.47-.468 1.229 0 1.697l4.8 4.8c.47.47 1.229.47 1.698 0l7.224-7.224c.47-.47.47-1.229 0-1.698-.468-.468-1.228-.468-1.697 0L6 6.728z"
    />
  </AccessibleSvg>
)

export const CheckboxMarkChecked = styled(CheckboxMarkSvg).attrs(
  ({ color, width, height, theme }) => ({
    color: color ?? theme.designSystem.color.icon.inverted,
    width: width ?? theme.checkbox.size,
    height: height ?? theme.checkbox.size,
  })
)``
