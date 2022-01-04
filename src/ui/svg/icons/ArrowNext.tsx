import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ArrowNext: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} aria-hidden>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.865 4.84239C14.4698 5.23124 14.4648 5.86662 14.854 6.26155L32.2064 23.774C32.6425 24.2166 32.636 24.9387 32.2109 25.3646L32.2096 25.366L14.832 42.8431C14.441 43.2363 14.4431 43.8717 14.8365 44.2623C15.23 44.6529 15.8658 44.6509 16.2567 44.2577L33.633 26.782C34.8444 25.5676 34.8382 23.5844 33.6376 22.3658L16.2852 4.85341C15.896 4.45848 15.2602 4.45355 14.865 4.84239Z"
    />
  </Svg>
)
