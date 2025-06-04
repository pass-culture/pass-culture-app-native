import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ThumbUpFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M9.4 19.5H7.6C5.61177 19.5 4 21.1118 4 23.1V40.07C4 42.0582 5.61177 43.67 7.6 43.67H9.4C11.3882 43.67 13 42.0582 13 40.07V23.1C13 21.1118 11.3882 19.5 9.4 19.5Z"
      fill={color}
    />
    <Path
      d="M42.5979 20.9487C41.448 19.5786 39.7781 18.7886 37.9983 18.7886H30.0089C30.9888 17.0885 32.1887 14.0583 32.2387 9.48802C32.2687 6.72786 30.2189 4.24772 27.4791 4.01771C24.4193 3.76769 21.8395 6.19783 21.8395 9.22801C21.8395 13.7383 20.0997 17.9585 16.9299 21.1487L16.6399 21.4387C16.23 21.8587 16 22.4188 16 23.0088V39.9698C16 40.6498 16.41 41.2598 17.0399 41.5099C18.7098 42.1899 20.4896 42.7699 20.7896 42.8599V42.8399C23.0894 43.59 25.4692 44 27.8991 44H35.6184C38.5082 44 40.988 41.9299 41.508 39.0597L43.8978 25.869C44.2278 24.1089 43.7478 22.3088 42.6179 20.9387L42.5979 20.9487Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const ThumbUpFilled = styled(ThumbUpFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
