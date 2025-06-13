import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleBicolorIcon } from './types'

const NotMemoizedBookings: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        d="M21.4537 3.53427C20.8018 3.18565 20.1553 3 18.3722 3H9.5V3.9L8.5 3.9V3H6.62777C4.84473 3 4.19816 3.18565 3.54631 3.53427C2.89446 3.88288 2.38288 4.39446 2.03427 5.04631C1.68565 5.69816 1.5 6.34473 1.5 8.12777V8.5C1.5 8.77614 1.72554 8.99563 1.99791 9.04113C3.41779 9.2783 4.5 10.5128 4.5 12C4.5 13.4872 3.41779 14.7217 1.99791 14.9589C1.72554 15.0044 1.5 15.2239 1.5 15.5V15.8722C1.5 17.6553 1.68565 18.3018 2.03427 18.9537C2.38288 19.6055 2.89446 20.1171 3.54631 20.4657C4.19816 20.8143 4.84473 21 6.62777 21H8.5V20.1H9.5V21H18.3722C20.1553 21 20.8018 20.8143 21.4537 20.4657C22.1055 20.1171 22.6171 19.6055 22.9657 18.9537C23.3143 18.3018 23.5 17.6553 23.5 15.8722V15.5C23.5 15.2239 23.2745 15.0044 23.0021 14.9589C21.5822 14.7217 20.5 13.4872 20.5 12C20.5 10.5128 21.5822 9.2783 23.0021 9.04113C23.2745 8.99563 23.5 8.77614 23.5 8.5V8.12777C23.5 6.34473 23.3143 5.69816 22.9657 5.04631C22.6171 4.39446 22.1055 3.88288 21.4537 3.53427ZM8.5 5.7V7.5H9.5V5.7H8.5ZM8.5 9.3V11.1H9.5V9.3H8.5ZM8.5 12.9V14.7H9.5L9.5 12.9H8.5ZM8.5 16.5V18.3H9.5V16.5H8.5Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const Bookings = React.memo(
  styled(NotMemoizedBookings).attrs(({ color, size, thin, theme }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
