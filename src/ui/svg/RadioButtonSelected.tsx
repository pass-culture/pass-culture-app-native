import * as React from 'react'
import { Circle } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const RadioButtonSelectedSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      accessibilityLabel={accessibilityLabel ?? `Sélectionné`}
      testID={testID}>
      <Circle cx={8} cy={8} r={4} fill={color} />
      <Circle cx={8} cy={8} r={7.5} stroke={color} />
    </AccessibleSvg>
  )
}

export const RadioButtonSelected = styled(RadioButtonSelectedSvg).attrs(
  ({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    size: size ?? theme.icons.sizes.smaller,
  })
)``
