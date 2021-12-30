import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ArrowNextDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 52 53" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <G>
            <Path
              d="M14.528 31.633c-.49.45-1.265.431-1.732-.041-.466-.472-.447-1.22.042-1.669l8.636-7.928c2.838-2.605 7.297-2.605 10.135 0l8.636 7.928c.49.45.509 1.197.042 1.669-.466.472-1.241.49-1.731.04l-8.636-7.927c-1.892-1.737-4.865-1.737-6.757 0l-8.635 7.928z"
              transform="translate(-250 -1064) translate(250 1065) rotate(90 26.542 26)"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
