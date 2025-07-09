import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const CheckmarkSvg = ({
  size,
  color,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      viewBox="0 0 10 9"
      accessibilityLabel={accessibilityLabel}>
      <Path
        d="M3.75017 8.50001C3.54017 8.50001 3.34017 8.41251 3.20017 8.26001L0.200167 5.01001C-0.0798334 4.70501 -0.0623335 4.23001 0.242667 3.95001C0.547667 3.67001 1.02267 3.68751 1.30267 3.99251L3.71517 6.60751L8.67017 0.52751C8.93267 0.20751 9.40267 0.15751 9.72517 0.42001C10.0452 0.68251 10.0952 1.15501 9.83267 1.47501L4.33267 8.22501C4.19517 8.39251 3.99267 8.49501 3.77517 8.50001C3.76767 8.50001 3.76017 8.50001 3.75267 8.50001H3.75017Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const Checkmark = styled(CheckmarkSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.extraSmall,
}))``
