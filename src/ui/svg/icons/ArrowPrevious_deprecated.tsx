import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ArrowPreviousDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <G>
            <Path
              d="M8.94 19.466c-.301.277-.778.266-1.065-.025-.287-.29-.276-.75.026-1.027l5.314-4.878c1.746-1.603 4.49-1.603 6.237 0l5.314 4.878c.302.277.313.737.026 1.027-.287.29-.764.302-1.065.025l-5.315-4.878c-1.164-1.069-2.993-1.069-4.158 0L8.94 19.466z"
              transform="translate(-21 -173) translate(0 152) matrix(-1 0 0 1 53 21) rotate(90 16.333 16)"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
