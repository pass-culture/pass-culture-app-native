import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const BookFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M19.4951 22.5352C19.4951 22.6398 19.4749 22.6947 19.46 22.7197C19.445 22.7447 19.4303 22.7653 19.4004 22.7803C19.3254 22.8253 19.1747 22.8604 18.9297 22.8604H3.85547C3.38561 22.8604 3.00023 22.5252 3 22.1104C3 21.6954 3.38547 21.3604 3.85547 21.3604H19.4951V22.5352ZM6 20.5H3.75C3.48001 20.5 3.22499 20.5599 3 20.6699V3C3 1.895 3.895 1 5 1H6V20.5ZM19.5 1C20.325 1 21 1.675 21 2.5V18.5C21 19.435 20.36 20.2047 19.5 20.4297V20.5H7.0957V1H19.5ZM11 9.5C10.7251 9.50012 10.5 9.72507 10.5 10C10.5 10.2749 10.7251 10.4999 11 10.5H15C15.275 10.5 15.5 10.275 15.5 10C15.5 9.725 15.275 9.5 15 9.5H11ZM11 7C10.7251 7.00012 10.5 7.22507 10.5 7.5C10.5 7.77493 10.7251 7.99988 11 8H17C17.275 8 17.5 7.775 17.5 7.5C17.5 7.225 17.275 7 17 7H11Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const BookFilled = styled(BookFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
