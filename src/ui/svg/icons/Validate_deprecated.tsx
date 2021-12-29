import * as React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ValidateDeprecated = ({
  color = ColorsEnum.GREEN_VALID,
  size = 32,
  testID,
}: IconInterface) => {
  const fillColor = color === ColorsEnum.WHITE ? ColorsEnum.PRIMARY : ColorsEnum.WHITE
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 38 38">
      <Circle r={10} cx={19} cy={19} fill={fillColor} />
      <Path
        d="M19 7.125c6.558 0 11.875 5.317 11.875 11.875S25.558 30.875 19 30.875 7.125 25.558 7.125 19 12.442 7.125 19 7.125zm7.005 7.19a.99.99 0 00-1.399.055l-7.315 7.922-3.106-3.36-.078-.075a.99.99 0 00-1.375 1.419l3.833 4.146.082.079a.99.99 0 001.372-.08l8.041-8.708.07-.083a.99.99 0 00-.125-1.315z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
