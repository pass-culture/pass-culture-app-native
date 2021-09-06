import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ArrowDown: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill={color} testID={testID}>
    <Path d="M44.2516 14.379C43.8628 13.9838 43.2274 13.9789 42.8324 14.368L25.32 31.7204C24.8774 32.1565 24.1552 32.15 23.7294 31.7249L23.728 31.7236L6.25087 14.346C5.85772 13.9551 5.22232 13.9571 4.83168 14.3505C4.44105 14.744 4.44309 15.3798 4.83625 15.7708L22.312 33.147C23.5264 34.3584 25.5096 34.3523 26.7282 33.1516L44.2406 15.7992C44.6355 15.4101 44.6404 14.7742 44.2516 14.379Z" />
  </Svg>
)
