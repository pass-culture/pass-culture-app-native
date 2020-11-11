import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const BicolorBookings: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  testID,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" testID={testID}>
      <Defs>
        <LinearGradient id="prefix__a" x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
        <LinearGradient id="prefix__b" x1="-537.105%" x2="515.395%" y1="50%" y2="50%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G fillRule="nonzero" strokeWidth={0.5}>
          <Path
            fill="url(#prefix__a)"
            stroke="url(#prefix__a)"
            d="M24.97 0c1.773 0 3.222 1.37 3.317 3.097l.005.18v2.77a2.024 2.024 0 01-1.58 1.888A3.173 3.173 0 0024.303 11c0 1.444.992 2.705 2.389 3.06a2.035 2.035 0 011.587 1.756l.013.164v2.743c0 1.75-1.39 3.179-3.14 3.272L24.97 22h-3.085a.707.707 0 01-.712-.702c0-.356.268-.65.615-.696l.097-.006h3.085c1 0 1.82-.764 1.893-1.733l.005-.14v-2.715a.619.619 0 00-.414-.555l-.095-.028c-2.048-.52-3.48-2.34-3.48-4.425s1.432-3.906 3.5-4.43a.625.625 0 00.479-.467l.01-.083V3.277c0-.987-.774-1.796-1.757-1.868l-.141-.005H3.614c-1.001 0-1.82.764-1.893 1.733l-.006.14v2.772c.01.222.153.412.373.497l.099.03C4.234 7.093 5.666 8.914 5.666 11c0 2.085-1.432 3.906-3.504 4.43a.57.57 0 00-.436.425l-.01.088v2.8c.01.98.782 1.777 1.757 1.848l.14.005h14.475c.393 0 .712.314.712.702 0 .355-.268.65-.615.696l-.097.006H3.614C1.854 22 .41 20.65.298 18.93l-.006-.179v-2.828a1.964 1.964 0 011.54-1.858A3.172 3.172 0 004.242 11a3.166 3.166 0 00-2.384-3.059A1.978 1.978 0 01.306 6.246l-.014-.16v-2.81c0-1.749 1.39-3.178 3.14-3.271L3.613 0H24.97z"
            transform="translate(7.708 11)"
          />
          <Path
            fill="#8C0077"
            stroke="url(#prefix__b)"
            d="M17.792 5c.253 0 .462.248.495.57l.005.09v9.68c0 .365-.224.66-.5.66-.253 0-.463-.248-.496-.57l-.004-.09V5.66c0-.365.224-.66.5-.66z"
            transform="translate(7.708 11)"
          />
        </G>
        <Path d="M0 0h44v44H0z" />
      </G>
    </Svg>
  )
}
