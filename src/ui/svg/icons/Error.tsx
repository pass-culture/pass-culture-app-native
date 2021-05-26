import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Error: React.FunctionComponent<IconInterface> = ({
  size = 85,
  color = ColorsEnum.WHITE,
  testID,
}) => (
  <Svg
    width={Math.round(1.55 * (size as number))}
    height={size}
    viewBox="0 0 74 74"
    testID={testID}>
    <G fill="none" fill-rule="evenodd">
      <G fill={color}>
        <Path
          d="M37 .125C57.366.125 73.875 16.633 73.875 37c0 8.23-2.707 16.055-7.618 22.447-.631.821-1.808.976-2.63.345-.82-.631-.975-1.808-.344-2.63C67.695 51.42 70.125 44.397 70.125 37c0-18.296-14.83-33.125-33.125-33.125C18.703 3.875 3.875 18.703 3.875 37c0 18.294 14.83 33.125 33.125 33.125 4.487 0 8.85-.893 12.892-2.604.953-.404 2.054.042 2.457.996.404.953-.042 2.054-.996 2.457-4.502 1.906-9.361 2.901-14.353 2.901C16.634 73.875.125 57.365.125 37 .125 16.632 16.632.125 37 .125zm-.001 18.578c.95 0 1.734.705 1.858 1.62l.017.255v22.253c0 1.035-.84 1.874-1.875 1.874-.95 0-1.734-.705-1.858-1.62l-.017-.255V20.579c0-1.036.84-1.875 1.875-1.875zm2.5 34.392c0-1.383-1.117-2.5-2.5-2.5s-2.5 1.117-2.5 2.5c0 1.38 1.117 2.5 2.5 2.5s2.5-1.12 2.5-2.5"
          transform="translate(-151 -158) translate(151 158)"
        />
      </G>
    </G>
  </Svg>
)
