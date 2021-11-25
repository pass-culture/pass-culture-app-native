import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorLocationPointerDeprecated: React.FunctionComponent<BicolorIconInterface> =
  ({
    size = 32,
    color = ColorsEnum.PRIMARY,
    color2 = ColorsEnum.SECONDARY,
    testID = 'BicolorLocationPointer',
  }) => {
    const LINEAR_GRADIENT_ID = uuidv1()
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
        <Defs>
          <LinearGradient id={LINEAR_GRADIENT_ID} x1="32.324%" x2="67.676%" y1="0%" y2="100%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color2} />
          </LinearGradient>
        </Defs>
        <G fill="none" fillRule="evenodd">
          <G fill={`url(#${LINEAR_GRADIENT_ID})`}>
            <Path d="M27 37.25c.414 0 .75.336.75.75 0 .38-.282.693-.648.743L27 38.75h-6c-.414 0-.75-.336-.75-.75 0-.38.282-.693.648-.743L21 37.25h6zM23.658 9.28l.286.011.31.006c1.415.056 2.8.437 4.06 1.125l.313.178c3.663 2.366 5.124 7.005 3.46 11.083l-6.298 13.21c-.273.51-.807.835-1.394.835-.636 0-1.21-.381-1.424-.9l-6.927-12.765c-2.475-5.61 1.078-12.227 7.042-12.772.286-.017.572-.017.858 0zm-.25 1.5l-.21.007c-4.888.447-7.855 5.972-5.809 10.615l6.932 12.777c.013.03.042.049.074.049.032 0 .061-.02.088-.08l6.233-13.071c1.374-3.37.155-7.242-2.88-9.202-1.19-.71-2.55-1.084-3.937-1.085l-.043-.001c-.227-.014-.455-.014-.658-.002zM24 14.25c.414 0 .75.336.75.75s-.336.75-.75.75c-1.243 0-2.25 1.007-2.25 2.25s1.007 2.25 2.25 2.25c1.19 0 2.166-.925 2.245-2.096L26.25 18c0-.414.336-.75.75-.75s.75.336.75.75c0 2.071-1.679 3.75-3.75 3.75-2.071 0-3.75-1.679-3.75-3.75 0-2.071 1.679-3.75 3.75-3.75z" />
          </G>
        </G>
      </Svg>
    )
  }

export const BicolorLocationPointerDeprecated = React.memo(
  NotMemoizedBicolorLocationPointerDeprecated
)
