import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const StrokeSvg: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
  color,
  size = 4,
}) => (
  <AccessibleSvg
    width="100%"
    height={size}
    viewBox="0 0 257 4"
    preserveAspectRatio="xMidYMid meet"
    testID={testID}
    accessibilityLabel={accessibilityLabel}>
    <Path
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      d="M254 2L2 2"
      strokeDasharray="2,16"
    />
  </AccessibleSvg>
)

export const Stroke = styled(StrokeSvg).attrs(({ color, theme }) => ({
  color: color ?? theme.designSystem.color.border.subtle,
}))``
