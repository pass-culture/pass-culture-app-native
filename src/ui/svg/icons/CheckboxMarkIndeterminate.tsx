import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIcon } from 'ui/svg/icons/types'

const CheckboxMarkIndeterminateSvg: React.FunctionComponent<AccessibleRectangleIcon> = ({
  width,
  height,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={width}
    height={height}
    viewBox="0 0 10 2"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M0 1C0 0.447715 0.447715 0 1 0H9C9.55229 0 10 0.447715 10 1C10 1.55228 9.55229 2 9 2H1C0.447715 2 0 1.55228 0 1Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const CheckboxMarkIndeterminate = styled(CheckboxMarkIndeterminateSvg).attrs(
  ({ color, width, height, theme }) => ({
    color: color ?? theme.designSystem.color.icon.inverted,
    width: width ?? theme.checkbox.size,
    height: height ?? theme.checkbox.size,
  })
)``
