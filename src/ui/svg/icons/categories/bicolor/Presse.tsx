import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Presse({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="18.271%" x2="81.729%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M28.262 9.25c1.462 0 2.658 1.142 2.745 2.583l.005.167v23.726c0 .83.68 1.537 1.44 1.51 1.108-.038 1.727-.552 1.792-1.354l.006-.144V23.819c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v11.919c0 1.425-.879 2.485-2.27 2.857l-.037.008-.064.045c-.084.048-.177.082-.277.095L33 38.75H15c-1.462 0-2.658-1.142-2.745-2.583L12.25 36V12c0-1.462 1.142-2.658 2.583-2.745L15 9.25h13.262zm0 1.5H15c-.647 0-1.18.492-1.244 1.122L13.75 12v24c0 .647.492 1.18 1.122 1.244l.128.006h14.923l-.026-.045c-.218-.391-.353-.835-.38-1.303l-.005-.176V12c0-.647-.492-1.18-1.122-1.244l-.128-.006zM25.5 25.067c.414 0 .75.336.75.75 0 .38-.282.694-.648.744l-.102.006h-8c-.414 0-.75-.335-.75-.75 0-.38.282-.693.648-.743l.102-.007h8zm0-4.47c.414 0 .75.336.75.75 0 .38-.282.694-.648.744l-.102.007h-8c-.414 0-.75-.336-.75-.75 0-.38.282-.694.648-.743l.102-.007h8zm0-4.47c.414 0 .75.337.75.75 0 .38-.282.694-.648.744l-.102.007h-8c-.414 0-.75-.336-.75-.75 0-.38.282-.694.648-.743l.102-.007h8z" />
        </G>
      </G>
    </Svg>
  )
}
