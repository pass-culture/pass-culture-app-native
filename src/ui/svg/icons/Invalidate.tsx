import * as React from 'react'
import Svg, { Circle, G, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Invalidate = ({ color = ColorsEnum.GREY_DARK, size = 32, testID }: IconInterface) => {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 38 38">
      <G>
        <Circle r={10} cx={19} cy={19} fill={ColorsEnum.WHITE} />
        <Path
          d="M19 7.125c6.558 0 11.875 5.317 11.875 11.875S25.558 30.875 19 30.875 7.125 25.558 7.125 19 12.442 7.125 19 7.125zm5.023 6a.99.99 0 00-1.398.06L19 17.14l-3.625-3.954a.99.99 0 00-1.528 1.254l.07.084 3.74 4.081-3.74 4.081-.07.084a.99.99 0 001.528 1.254L19 20.068l3.625 3.955a.989.989 0 001.528-1.254l-.07-.084-3.741-4.081 3.742-4.081.068-.084a.987.987 0 00-.13-1.314z"
          fill={color}
          fillRule="nonzero"
        />
      </G>
    </Svg>
  )
}
