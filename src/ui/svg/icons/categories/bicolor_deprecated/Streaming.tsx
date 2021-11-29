import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Streaming({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="0%" x2="100%" y1="13.494%" y2="86.506%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M31.996 35.75H24l-.008-.001h-7.979L16 35.75l-.013-.001h-3.015c-1.5-.056-2.685-1.271-2.723-2.73l.001-17.843c-.051-1.5 1.075-2.77 2.575-2.914L13 12.25h22.028c1.5.057 2.685 1.272 2.723 2.73L37.75 23c0 .414-.336.75-.75.75-.38 0-.693-.282-.743-.648L36.25 23v-5.25h-24.5l-.001 12.5h24.5L36.25 27c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v4l-.001.01v1.814c.052 1.5-1.074 2.77-2.574 2.914L35 35.75h-3.004zm-16.746-4h-3.501v1.126c-.023.686.478 1.27 1.12 1.362l.131.012h2.25v-2.5zm8 0h-6.5v2.5h6.5v-2.5zm8 0h-6.5v2.5h6.5v-2.5zm5 0h-3.5v2.5h2.222c.689-.026 1.236-.572 1.276-1.268l.002-.132v-1.1zM21.75 20c.13 0 .258.035.37.1l5.51 3.24c.227.143.364.392.364.66s-.137.517-.364.66l-5.51 3.24c-.112.065-.24.1-.37.1-.416-.005-.75-.344-.75-.76v-6.48c0-.416.334-.755.75-.76zm-6.5-6.251h-2.222c-.689.027-1.236.573-1.276 1.269l-.001 1.232h3.499v-2.501zm8 0h-6.5v2.501h6.5v-2.501zm1.5 0v2.501h6.5v-2.5l-6.5-.001zM35 13.75h-2.25v2.5h3.5v-1.126c.024-.686-.477-1.27-1.12-1.362L35 13.75z" />
        </G>
      </G>
    </Svg>
  )
}
