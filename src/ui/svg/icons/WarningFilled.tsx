import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const NotMemoizedWarningFilled: React.FC<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
  ...props
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...props}>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.7075 17.7444L17.7775 10.9344L13.8475 4.12441C13.0275 2.69941 10.9725 2.69941 10.1475 4.12441L6.21749 10.9344L2.28749 17.7444C1.46749 19.1694 2.49249 20.9444 4.13749 20.9444H19.8625C21.5075 20.9444 22.5325 19.1644 21.7125 17.7444H21.7075ZM13.0725 17.5994C13.0725 18.1544 12.6225 18.6044 12.0675 18.6044H11.9325C11.3775 18.6044 10.9275 18.1544 10.9275 17.5994V17.4644C10.9275 16.9094 11.3775 16.4594 11.9325 16.4594H12.0675C12.6225 16.4594 13.0725 16.9094 13.0725 17.4644V17.5994ZM13.0725 14.0994C13.0725 14.6544 12.6225 15.1044 12.0675 15.1044H11.9325C11.3775 15.1044 10.9275 14.6544 10.9275 14.0994V8.40941C10.9275 7.85441 11.3775 7.40441 11.9325 7.40441H12.0675C12.6225 7.40441 13.0725 7.85441 13.0725 8.40941V14.0994Z"
      />
    </AccessibleSvg>
  )
}

export const WarningFilled = styled(NotMemoizedWarningFilled).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
