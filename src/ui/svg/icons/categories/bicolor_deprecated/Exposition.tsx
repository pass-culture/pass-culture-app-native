import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Exposition({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_ID} x1="18.263%" x2="81.737%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_ID})`}>
          <Path d="M23.525 9.42c.246-.201.587-.224.853-.068l.097.067 4 3.27c.32.263.368.735.106 1.056-.239.291-.65.357-.965.17l-.09-.064L24 10.968l-8.9 7.282h17.798l-2.373-1.94c-.291-.238-.357-.65-.17-.964l.064-.09c.239-.292.65-.358.965-.17l.09.063 4 3.27c.52.424.26 1.244-.371 1.325L35 19.75H13c-.67 0-.988-.798-.55-1.26l.075-.07 11-9zM33 20.25c.38 0 .693.282.743.648l.007.102v12c0 .12-.028.233-.078.334 1.194.298 2.078 1.379 2.078 2.666 0 1.519-1.231 2.75-2.75 2.75H15c-1.519 0-2.75-1.231-2.75-2.75 0-1.287.884-2.368 2.079-2.668-.037-.07-.061-.148-.072-.23L14.25 33V21c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v12c0 .088-.015.173-.043.251h4.586c-.017-.047-.03-.098-.036-.15L20.25 33V21c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v12c0 .088-.015.173-.043.251h4.586c-.017-.047-.03-.098-.036-.15L26.25 33V21c0-.414.336-.75.75-.75.38 0 .693.282.743.648l.007.102v12c0 .088-.015.173-.043.251h4.586c-.017-.047-.03-.098-.036-.15L32.25 33V21c0-.414.336-.75.75-.75zm0 14.5H15c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25h18c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25zM24 14c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" />
        </G>
      </G>
    </Svg>
  )
}
