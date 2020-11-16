import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const BicolorSearch: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  thin = false,
  testID,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" testID={testID}>
      <Defs>
        <LinearGradient id="prefix__a" x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Path d="M0 0h44v44H0z" />
        <Path
          d="M17.014 17.014a.902.902 0 011.073-.152l.101.065.1.087 7.698 7.697a.901.901 0 01-1.084 1.418l-.104-.067-.087-.076-7.697-7.697a.902.902 0 010-1.275zM9.5.75a8.75 8.75 0 11-.001 17.501A8.75 8.75 0 019.5.75zm0 1.89a6.86 6.86 0 000 13.72 6.86 6.86 0 000-13.72zM6.77 4.863c.466-.23 1.059-.095 1.337.317.294.435.12.994-.368 1.236-1.24.614-1.998 1.733-1.998 2.947 0 .5-.454.888-.996.888s-.995-.388-.995-.888c0-1.87 1.158-3.577 3.02-4.5z"
          fill="url(#prefix__a)"
          stroke="url(#prefix__a)"
          transform="translate(9 9)"
          strokeWidth={thin ? 0 : 0.5}
        />
      </G>
    </Svg>
  )
}
