import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Television: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
    <G transform="translate(-14 -32)" fill={color} fillRule="evenodd">
      <Path d="M49.029 42.25a2.826 2.826 0 012.72 2.72v17.728a2.831 2.831 0 01-2.575 2.9L49 65.61l-11.25-.001v2.21l1.57.001a.75.75 0 01.102 1.493l-.102.007h-7.89a.75.75 0 01-.102-1.493l.102-.007 4.82-.001v-2.21h-9.28a2.825 2.825 0 01-2.72-2.72V45.162a2.831 2.831 0 012.575-2.9L27 42.25h22.029zM44.89 67.82a.75.75 0 01.102 1.493l-.102.007h-1.85a.75.75 0 01-.102-1.493l.102-.007h1.85zM27.029 43.75A1.33 1.33 0 0025.753 45l-.003.14v17.602a1.33 1.33 0 001.12 1.356l.13.012h21.971a1.33 1.33 0 001.276-1.25l.003-.14V45.118a1.33 1.33 0 00-1.12-1.356L49 43.75H27.029zM35.75 50c.13 0 .258.035.37.1l5.51 3.24a.78.78 0 010 1.32l-5.51 3.24a.739.739 0 01-.37.1.76.76 0 01-.75-.76v-6.48a.76.76 0 01.75-.76z" />
    </G>
  </Svg>
)
