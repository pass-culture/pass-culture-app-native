import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const PlainArrowPrevious: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 19 18" testID={testID} aria-hidden>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.5 17.75a8.75 8.75 0 100-17.5 8.75 8.75 0 000 17.5zM9.31 5.418a.688.688 0 010 .973L7.381 8.318h6.014a.688.688 0 010 1.376H7.394L9.31 11.61a.688.688 0 01-.973.973L5.241 9.486a.688.688 0 010-.972l3.095-3.096a.688.688 0 01.973 0z"
      fill={color}
    />
  </Svg>
)
