import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const StarSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
  color,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 22"
      fill="none"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Path
        d="M12.4302 18.6802L17.5802 21.1052C18.3002 21.4452 19.1052 20.8602 19.0152 20.0702L18.3452 14.4302C18.3102 14.1302 18.4102 13.8302 18.6152 13.6152L22.4552 9.59023C22.9952 9.02023 22.7102 8.08023 21.9452 7.91023L16.1252 6.60523C15.8402 6.54023 15.5952 6.35523 15.4552 6.10023L12.8902 1.33523C12.5102 0.625234 11.4952 0.625234 11.1102 1.33523L8.54523 6.10023C8.40523 6.36023 8.16523 6.54523 7.87523 6.60523L2.05523 7.91023C1.29023 8.08023 1.00523 9.02523 1.54523 9.59023L5.38523 13.6152C5.59523 13.8352 5.69523 14.1302 5.65523 14.4302L4.98523 20.0702C4.89023 20.8552 5.70023 21.4402 6.42023 21.1052L11.5702 18.6802C11.8402 18.5502 12.1602 18.5502 12.4302 18.6802Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
      />
    </AccessibleSvg>
  )
}

export const Star = styled(StarSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.small,
}))``
