import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Livres({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="16.819%" x2="83.181%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M32.75 10c1.465 0 2.659 1.16 2.745 2.613l.005.17.124 19.846c.008 1.243-.81 2.298-1.938 2.648l-.108.03.02.1.007.101v1.693c0 1.039-1.522 1.739-2.654 1.795l-.145.004H14.75c-1.496 0-2.675-1.172-2.722-2.498l-.001-.095-.02-.1-.007-.102V12.787c0-1.48 1.14-2.694 2.582-2.782L14.75 10h18zM18.176 35.422l-3.32.006c-.702 0-1.313.464-1.33.967-.015.51.456 1.035 1.094 1.099l.13.006h16.056c.191 0 .61-.101.945-.246.127-.055.234-.112.31-.164l.043-.033.001-1.549.002-.051.005-.057-13.93.022h-.006zM17.429 11.5H14.75c-.644 0-1.18.504-1.244 1.155l-.006.132v21.452l.087-.04c.341-.153.716-.246 1.102-.267l.166-.004 2.574-.004V11.5zm15.321 0H18.929v22.422l13.944-.022c.65-.001 1.185-.499 1.245-1.133l.006-.128L34 12.787c0-.669-.495-1.215-1.123-1.28l-.127-.007zm-2.285 9.941c.414 0 .75.336.75.75 0 .38-.282.694-.648.743l-.102.007h-8c-.414 0-.75-.335-.75-.75 0-.38.282-.693.648-.743l.102-.007h8zm0-3.94c.414 0 .75.335.75.75 0 .38-.282.693-.648.743l-.102.006h-8c-.414 0-.75-.335-.75-.75 0-.38.282-.693.648-.743l.102-.007h8z" />
        </G>
      </G>
    </Svg>
  )
}
