import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ArrowPrevious: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.7148 44.2655C34.1101 43.8767 34.115 43.2413 33.7259 42.8464L16.3735 25.3339C15.9373 24.8913 15.9439 24.1692 16.3689 23.7433L16.3703 23.7419L33.7479 6.26479C34.1388 5.87163 34.1368 5.23624 33.7433 4.8456C33.3499 4.45496 32.714 4.45701 32.3231 4.85017L14.9468 22.326C13.7355 23.5403 13.7416 25.5235 14.9423 26.7421L32.2947 44.2545C32.6838 44.6494 33.3196 44.6544 33.7148 44.2655Z"
    />
  </Svg>
)
