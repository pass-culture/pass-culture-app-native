import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ErrorFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M8 14.667C4.3181 14.667 1.33301 11.6819 1.33301 8C1.33301 4.31811 4.3181 1.33301 8 1.33301C11.6819 1.33301 14.667 4.31811 14.667 8C14.667 11.6819 11.6819 14.667 8 14.667ZM7.90039 9.33301C8.32359 9.33278 8.66693 8.95106 8.66699 8.58301L8.66699 4.63868C8.66699 4.2706 8.32363 3.83328 7.90039 3.83301C7.47697 3.83301 7.13379 4.27049 7.13379 4.63868L7.13379 8.58301C7.13385 8.95117 7.47701 9.33301 7.90039 9.33301ZM7.90039 11.833C8.32347 11.833 8.6668 11.4904 8.66699 11.0674C8.66699 10.6442 8.32359 10.3008 7.90039 10.3008C7.47717 10.3008 7.13379 10.6442 7.13379 11.0674C7.13398 11.4904 7.47729 11.833 7.90039 11.833Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const ErrorFilled = styled(ErrorFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
