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
    viewBox="0 0 12 12"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7367 2.28718C12.0901 2.66761 12.0874 3.28158 11.7308 3.65852L5.47631 10.2689C4.89792 10.8799 3.96207 10.88 3.38368 10.269L0.269379 6.97902C-0.0873538 6.60216 -0.0901338 5.98819 0.263169 5.60768C0.616473 5.22716 1.19207 5.2242 1.5488 5.60105L4.42987 8.64464L10.451 2.28087C10.8077 1.90393 11.3833 1.90675 11.7367 2.28718Z"
      fill={color}
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
