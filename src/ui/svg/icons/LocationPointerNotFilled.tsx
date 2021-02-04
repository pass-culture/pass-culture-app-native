import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const LocationPointerNotFilled: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
    <G fill="none" fill-rule="evenodd">
      <G fill={color}>
        <G>
          <Path
            d="M15.733 6.001l.218.009.236.004c1.077.042 2.13.33 3.09.85l.237.135c2.788 1.79 3.899 5.297 2.633 8.38l-4.793 9.99c-.207.385-.613.631-1.06.631-.484 0-.92-.288-1.084-.68l-5.27-9.653c-1.884-4.242.82-9.245 5.358-9.657.217-.013.436-.013.653 0zm-.19 1.134l-.16.006c-3.719.337-5.976 4.515-4.42 8.026l5.275 9.662c.01.022.032.037.056.037.025 0 .047-.015.067-.061l4.742-9.884c1.046-2.548.118-5.476-2.19-6.958-.907-.536-1.941-.82-2.996-.82l-.033-.001c-.173-.01-.346-.01-.5-.001zm.124 2.198c.331 0 .6.269.6.6 0 .332-.269.6-.6.6-.994 0-1.8.806-1.8 1.8s.806 1.8 1.8 1.8c.952 0 1.732-.74 1.796-1.676l.004-.124c0-.331.268-.6.6-.6.331 0 .6.269.6.6 0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3z"
            transform="translate(-24 -388) translate(24 388)"
          />
        </G>
      </G>
    </G>
  </Svg>
)
