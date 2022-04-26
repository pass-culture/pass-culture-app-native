import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const TrashSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    fill={color}
    viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M5.5 5.55H18.5C18.775 5.55 19 5.325 19 5.05V4.19C19 3.915 18.775 3.69 18.5 3.69H5.5C5.225 3.69 5 3.915 5 4.19V5.05C5 5.325 5.225 5.55 5.5 5.55Z"
    />
    <Path
      fill={color}
      d="M15.5 5.49921H8.5V3.49974C8.5 2.94988 8.95 2.5 9.5 2.5H14.5C15.05 2.5 15.5 2.94988 15.5 3.49974V5.49921Z"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.63 20.5602L18.44 7.55867C18.47 6.98382 18.015 6.49895 17.44 6.49895H6.56C5.985 6.49895 5.53 6.98382 5.56 7.55867L6.37 20.5602C6.405 21.0901 6.84 21.5 7.37 21.5H16.63C17.16 21.5 17.595 21.0851 17.63 20.5602ZM12.635 8.94331C12.635 8.66724 12.4112 8.44344 12.135 8.44344C11.8589 8.44344 11.635 8.66724 11.635 8.94331V19.4555C11.635 19.7316 11.8589 19.9554 12.135 19.9554C12.4112 19.9554 12.635 19.7316 12.635 19.4555V8.94331ZM8.61127 8.44402C8.8871 8.43091 9.12134 8.64382 9.13446 8.91958L9.63446 19.4318C9.64757 19.7076 9.4346 19.9417 9.15877 19.9549C8.88294 19.968 8.6487 19.7551 8.63558 19.4793L8.13558 8.96706C8.12247 8.69131 8.33544 8.45713 8.61127 8.44402ZM16.1345 8.96706C16.1476 8.69131 15.9346 8.45713 15.6588 8.44402C15.3829 8.43091 15.1487 8.64382 15.1356 8.91958L14.6356 19.4318C14.6225 19.7076 14.8354 19.9417 15.1113 19.9549C15.3871 19.968 15.6213 19.7551 15.6345 19.4793L16.1345 8.96706Z"
    />
  </AccessibleSvg>
)

export const Trash = styled(TrashSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
