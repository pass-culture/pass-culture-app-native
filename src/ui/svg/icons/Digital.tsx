import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Digital: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.PRIMARY,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G>
        <G>
          <Path d="M0 0L16 0 16 16 0 16z" transform="translate(-127 -412) translate(127 412)" />
          <Path
            fill={color}
            d="M2.667 4.667c0-.367.3-.667.666-.667H14c.367 0 .667-.3.667-.667 0-.366-.3-.666-.667-.666H2.667c-.734 0-1.334.6-1.334 1.333v7.333H1c-.553 0-1 .447-1 1 0 .554.447 1 1 1h8.333v-2H2.667V4.667zm12.666.666h-4c-.366 0-.666.3-.666.667v6.667c0 .366.3.666.666.666h4c.367 0 .667-.3.667-.666V6c0-.367-.3-.667-.667-.667zm-.666 6H12V6.667h2.667v4.666z"
          />
        </G>
      </G>
    </G>
  </Svg>
)
