import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const BicolorFavorite: React.FC<BicolorIconInterface> = ({
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
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Path
          d="M19.703.558c3.784 0 6.852 3.137 6.852 7.008 0 .83-.142 1.642-.42 2.42a21.964 21.964 0 01-3.789 6.423.693.693 0 01-.992.072.732.732 0 01-.07-1.015 20.503 20.503 0 003.535-5.987c.217-.607.33-1.252.33-1.913 0-3.076-2.438-5.57-5.446-5.57-3.007 0-5.445 2.494-5.445 5.57 0 .959-1.406.959-1.406 0 0-3.077-2.437-5.57-5.444-5.57-3.008 0-5.446 2.494-5.446 5.57 0 .66.112 1.306.325 1.9 1.99 5.245 6.032 9.436 11.101 11.535l.163.065.284-.114a19.616 19.616 0 003.025-1.6l.478-.317a.692.692 0 01.975.196.729.729 0 01-.191.998 21.044 21.044 0 01-4.318 2.282.676.676 0 01-.39.032l-.096-.027-.053-.02C7.639 20.3 3.157 15.735.97 9.974a7.163 7.163 0 01-.415-2.408c0-3.87 3.068-7.008 6.853-7.008 2.648 0 4.946 1.537 6.086 3.787l.06.126.062-.126C14.724 2.16 16.924.646 19.477.562l.226-.004z"
          fill="url(#prefix__a)"
          fillRule="nonzero"
          stroke="url(#prefix__a)"
          strokeWidth={0.5}
          transform="translate(9 10)"
        />
        <Path d="M0 0h44v44H0z" />
      </G>
    </Svg>
  )
}
