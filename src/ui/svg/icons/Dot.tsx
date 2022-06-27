import * as React from 'react'
import { Circle, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = Omit<AccessibleIcon, 'color'> & {
  borderColor?: ColorsEnum
  fillColor?: ColorsEnum
}

const DotSvg: React.FC<Props> = ({ size, borderColor, fillColor, accessibilityLabel, testID }) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 9 9"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    // @ts-expect-error : borderColor and fillColor are on <AccessibleSvg/> only for test purposes
    borderColor={borderColor}
    fillColor={fillColor}>
    <G fill={fillColor} stroke={borderColor} strokeWidth="1">
      <Circle cx="4.5" cy="4.5" r="4" />
    </G>
  </AccessibleSvg>
)

export const Dot = styled(DotSvg).attrs(({ borderColor, fillColor, size, theme }) => ({
  borderColor: borderColor ?? theme.colors.black,
  fillColor: fillColor ?? theme.colors.black,
  size: size ?? 8,
}))``
