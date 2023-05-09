import * as React from 'react'
import { Circle, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const ValidateIconSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 20 21"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Circle cx="10" cy="10.071" r="10" fill={color} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3815 6.95729C14.6515 7.24789 14.6495 7.7169 14.377 8.00484L9.59931 13.0544L9.59919 13.0545C9.15737 13.5213 8.4426 13.5213 8.00077 13.0545L5.62179 10.5413C5.34929 10.2535 5.34716 9.78445 5.61705 9.49378C5.88693 9.20311 6.32663 9.20084 6.59913 9.48872L8.79994 11.8137L13.3995 6.95247C13.6719 6.66453 14.1116 6.66668 14.3815 6.95729Z"
        fill={color2}
      />
    </AccessibleSvg>
  )
}

export const ValidateIcon = styled(ValidateIconSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
