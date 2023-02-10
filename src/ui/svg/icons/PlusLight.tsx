import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const PlusLightSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 21.546A9.544 9.544 0 0 1 2.455 12a9.46 9.46 0 0 1 1.122-4.49.477.477 0 0 0-.841-.451A10.414 10.414 0 0 0 1.5 12c0 5.8 4.7 10.5 10.5 10.5S22.5 17.8 22.5 12 17.8 1.5 12 1.5c-1.81 0-3.515.46-5.005 1.27a.477.477 0 0 0 .456.839A9.544 9.544 0 0 1 21.546 12 9.544 9.544 0 0 1 12 21.546Zm-.135-15.089a.5.5 0 0 1 .5.5l-.006 4.651 4.634.006a.5.5 0 0 1 0 1l-4.631-.006.016 4.647a.5.5 0 0 1-1 .003l-.017-4.646-4.636.018a.5.5 0 1 1-.004-1l4.638-.018.005-4.655a.5.5 0 0 1 .5-.5Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const PlusLight = styled(PlusLightSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
