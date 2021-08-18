import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export function Favorite({ size = 32, color = ColorsEnum.BLACK, testID }: IconInterface) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 48 48" testID={testID}>
      <Path d="M30.557 13.532a7.307 7.307 0 016.86 9.83 22.788 22.788 0 01-4.041 6.696.75.75 0 01-1.133-.984 21.271 21.271 0 003.77-6.241 5.807 5.807 0 00-5.456-7.801 5.806 5.806 0 00-5.808 5.806c0 1-1.5 1-1.5 0a5.807 5.807 0 10-11.268 1.981 21.323 21.323 0 0011.84 12.026l.175.067.302-.118c1.12-.461 2.2-1.02 3.227-1.668l.51-.331a.75.75 0 11.835 1.245 22.648 22.648 0 01-4.605 2.38.75.75 0 01-.415.033l-.103-.028-.057-.021c-6-2.29-10.78-7.05-13.111-13.055a7.307 7.307 0 0113.355-5.868l.066.13.065-.13a7.307 7.307 0 016.25-3.945l.242-.004z" />
    </Svg>
  )
}
