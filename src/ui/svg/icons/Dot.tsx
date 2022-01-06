import * as React from 'react'
import Svg, { Circle, G } from 'react-native-svg'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

type Props = Omit<IconInterface, 'color'> & {
  'aria-label'?: string
  borderColor?: ColorsEnum
  fillColor?: ColorsEnum
}

export const Dot: React.FC<Props> = ({
  'aria-label': ariaLabel,
  size = 8,
  borderColor = ColorsEnum.BLACK,
  fillColor = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg
    aria-label={ariaLabel}
    width={size}
    height={size}
    viewBox="0 0 9 9"
    testID={testID}
    // @ts-expect-error : borderColor and fillColor are on <Svg/> only for test purposes
    borderColor={borderColor}
    fillColor={fillColor}>
    <G fill={fillColor} stroke={borderColor} strokeWidth="1">
      <Circle cx="4.5" cy="4.5" r="4" />
    </G>
  </Svg>
)
