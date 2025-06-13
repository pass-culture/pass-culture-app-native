import * as React from 'react'
import { Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const StrokeVertical: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
  color,
}) => {
  return (
    <AccessibleSvg
      width="120"
      height="4"
      fill={color}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={{ transform: [{ rotate: '90deg' }] }}>
      <Path
        d="M253 2L1.99999 1.99998"
        stroke="#CBCDD2"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="2 16"
      />
    </AccessibleSvg>
  )
}
