import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const computeBicolorSelectorHeight = (width: number) => Math.ceil((3 / 44) * width)

export const BicolorSelector: React.FC<
  Omit<BicolorIconInterface, 'size'> & { width: number; height?: number }
> = ({ width, height, color, color2, testID }) => {
  return (
    <Svg
      width={width}
      height={height ?? computeBicolorSelectorHeight(width)}
      viewBox="0 0 44 3"
      testID={testID}>
      <Defs>
        <LinearGradient id="prefix__a" x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <Path
        d="M310 0h44v1a2 2 0 01-2 2h-40a2 2 0 01-2-2V0z"
        transform="translate(-310)"
        fill="url(#prefix__a)"
        fillRule="nonzero"
      />
    </Svg>
  )
}

const MemoBicolorSelector = React.memo(BicolorSelector)
export default MemoBicolorSelector
