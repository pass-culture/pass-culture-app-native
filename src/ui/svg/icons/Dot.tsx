import React from 'react'
import { Circle, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = Omit<AccessibleIcon, 'color'> & {
  borderColor?: ColorsType
  fillColor?: ColorsType
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
  borderColor: borderColor ?? theme.designSystem.color.icon.default,
  fillColor: fillColor ?? theme.designSystem.color.icon.default,
  size: size ?? 8,
}))``
