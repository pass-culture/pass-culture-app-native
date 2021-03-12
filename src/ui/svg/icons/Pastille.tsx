import * as React from 'react'
import Svg, { G, Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { IconInterface } from './types'

export const Pastille: React.FunctionComponent<IconInterface> = ({ size = 21, color, testID }) => (
  <Svg width={size} height={21 / 1.4} viewBox="0 0 21 15" testID={testID}>
    <Defs>
      <LinearGradient id="pastille" x1="-41.961%" x2="126.229%" y1="-1.762%" y2="116.717%">
        <Stop offset="0%" stopColor="#EB0055" />
        <Stop offset="100%" stopColor="#320096" />
      </LinearGradient>
    </Defs>
    <G fill="none" fill-rule="evenodd">
      <G fill={color || 'url(#pastille)'} transform="translate(-391 -426)">
        <G>
          <G transform="translate(131 405) translate(238 10)">
            <Rect width="20.167" height="14.667" x="22" y="11" rx="7.333" />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
