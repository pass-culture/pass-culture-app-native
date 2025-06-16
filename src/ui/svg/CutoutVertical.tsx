import * as React from 'react'
import { Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = AccessibleIcon & {
  orientation: 'up' | 'down'
}

export const CutoutVertical: React.FunctionComponent<Props> = ({
  accessibilityLabel,
  testID,
  color,
  orientation,
}) => {
  return (
    <AccessibleSvg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill={color}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={{ transform: [{ rotate: orientation === 'down' ? '180deg' : '0deg' }] }}>
      <Path
        d="M0.5 -7.80451e-07C0.5 1.5102 0.797456 3.00561 1.37539 4.40086C1.95331 5.7961 2.8004 7.06385 3.86827 8.13173C4.93615 9.1996 6.2039 10.0467 7.59914 10.6246C8.99439 11.2025 10.4898 11.5 12 11.5C13.5102 11.5 15.0056 11.2025 16.4009 10.6246C17.7961 10.0467 19.0639 9.1996 20.1317 8.13172C21.1996 7.06385 22.0467 5.7961 22.6246 4.40085C23.2025 3.00561 23.5 1.51019 23.5 -8.62551e-06"
        stroke="#CBCDD2"
      />
    </AccessibleSvg>
  )
}
