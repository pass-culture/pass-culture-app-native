import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Validate: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 45.5C35.598 45.5 45 36.098 45 24.5C45 12.902 35.598 3.5 24 3.5C12.402 3.5 3 12.902 3 24.5C3 36.098 12.402 45.5 24 45.5ZM34.5064 19.5406C35.1603 18.8496 35.1651 17.7239 34.5173 17.0265C33.8694 16.329 32.8141 16.3239 32.1603 17.0149L21.1214 28.6818L15.8395 23.1019C15.1855 22.411 14.1302 22.4165 13.4825 23.1141C12.8348 23.8117 12.8399 24.9373 13.4939 25.6282L19.2034 31.6598C20.2638 32.7801 21.9792 32.7801 23.0396 31.6598L23.0399 31.6596L34.5064 19.5406Z"
    />
  </Svg>
)
