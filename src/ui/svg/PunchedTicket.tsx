import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const PunchedTicket: React.FunctionComponent<AccessibleIcon> = ({
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg width="327" height="33" testID={testID} accessibilityLabel={accessibilityLabel}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.499999 33C9.6127 33 17 25.6127 17 16.5C17 7.3873 9.6127 0 0.5 0H326.5C317.387 0 310 7.3873 310 16.5C310 25.6127 317.387 33 326.5 33H0.499999ZM0.499999 33H0V32.9926C0.166062 32.9975 0.332739 33 0.499999 33ZM327 32.9926V33H326.5C326.667 33 326.834 32.9975 327 32.9926ZM327 0.00743111C326.834 0.00248871 326.667 0 326.5 0H327V0.00743111ZM0.5 0C0.33274 0 0.166062 0.00248871 0 0.00743111V0H0.5Z"
    />
    <Path
      d="M290 17H38"
      stroke="#CBCDD2"
      strokeWidth="2"
      strokeLinecap="square"
      strokeDasharray="1 14"
    />
  </AccessibleSvg>
)

export const PunchedTicketSvg = styled(PunchedTicket).attrs(({ color, theme }) => ({
  color: color ?? theme.colors.black,
}))``
