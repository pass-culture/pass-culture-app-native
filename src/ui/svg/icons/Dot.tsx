import * as React from 'react'
import Svg, { Circle, G } from 'react-native-svg'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export const Dot: React.FunctionComponent<IconInterface> = ({
  size = 8,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 8 8" testID={testID} fill={color}>
    <G fill="none" fill-rule="evenodd">
      <G fill={color}>
        <G transform="translate(-210 -422) rotate(-180 109 216)">
          <Circle cx="4" cy="6" r="4" />
        </G>
      </G>
    </G>
  </Svg>
)
