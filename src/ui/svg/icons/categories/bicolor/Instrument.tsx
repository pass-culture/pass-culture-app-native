import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Instrument({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="6.583%" x2="93.417%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M19.603 9.016c4.612.452 8.117 4.315 8.149 8.905l-.002 2.6c0 .648.492 1.18 1.122 1.244l.128.007h6c1.463 0 2.658 1.142 2.745 2.582l.005.168v11.24c0 1.462-1.142 2.658-2.582 2.745l-.168.005H13c-1.463 0-2.658-1.142-2.745-2.583l-.005-.167v-13.91c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v6.159h24.5v-3.49c0-.646-.492-1.179-1.122-1.243L35 23.272h-6c-1.463 0-2.658-1.142-2.745-2.583l-.005-.167v-2.356c.086-3.936-2.875-7.273-6.764-7.655-2.026-.119-4.01.61-5.477 2.012-1.467 1.402-2.285 3.35-2.26 5.38.006.413-.325.754-.74.759-.414.005-.754-.326-.759-.74-.031-2.446.955-4.794 2.723-6.484 1.768-1.69 4.16-2.568 6.63-2.422zM14.25 29.51h-2.5l.001 6.25c0 .648.492 1.18 1.122 1.244l.128.007h22c.647 0 1.18-.492 1.244-1.122l.006-.128V29.51h-4.5v5.25c0 .415-.336.75-.75.75-.38 0-.693-.281-.743-.647l-.007-.102V29.51h-2.5v5.25c0 .415-.336.75-.75.75-.38 0-.693-.281-.743-.647l-.007-.102V29.51h-2.5v5.25c0 .415-.336.75-.75.75-.38 0-.693-.281-.743-.647l-.007-.102V29.51h-2.5v5.25c0 .415-.336.75-.75.75-.38 0-.693-.281-.743-.647l-.007-.102V29.51h-2.5v5.25c0 .415-.336.75-.75.75-.38 0-.693-.281-.743-.647l-.007-.102V29.51zM25 23.011c.414 0 .75.337.75.75 0 .38-.282.694-.648.744l-.102.007H14c-.414 0-.75-.336-.75-.75 0-.38.282-.694.648-.743l.102-.007h11z" />
        </G>
      </G>
    </Svg>
  )
}
