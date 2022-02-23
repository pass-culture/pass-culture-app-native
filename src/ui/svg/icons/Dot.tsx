import * as React from 'react'
import Svg, { Circle, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = Omit<IconInterface, 'color'> & {
  'aria-label'?: string
  borderColor?: ColorsEnum
  fillColor?: ColorsEnum
}

const DotSvg: React.FC<Props> = ({
  'aria-label': ariaLabel,
  size,
  borderColor,
  fillColor,
  testID,
}) => (
  <Svg
    aria-label={ariaLabel}
    width={size}
    height={size}
    viewBox="0 0 9 9"
    testID={testID}
    accessibilityRole="image"
    // @ts-expect-error : borderColor and fillColor are on <Svg/> only for test purposes
    borderColor={borderColor}
    fillColor={fillColor}>
    <G fill={fillColor} stroke={borderColor} strokeWidth="1">
      <Circle cx="4.5" cy="4.5" r="4" />
    </G>
  </Svg>
)

export const Dot = styled(DotSvg).attrs(({ borderColor, fillColor, size, theme }) => ({
  borderColor: borderColor ?? theme.colors.black,
  fillColor: fillColor ?? theme.colors.black,
  size: size ?? 8,
}))``
