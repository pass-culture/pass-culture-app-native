import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Atelier({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="39.159%" x2="60.841%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M27.315 10.29l.2.046 1.71.46c.728.197 1.343.683 1.702 1.346.326.602.414 1.303.253 1.96l-.056.197-4.589 14.318c.174.212.333.442.479.694.892 1.698.481 3.776-.921 4.976l-.16.13-3.868 3.498c-.271.246-.648.34-1.003.25-.31-.08-.568-.29-.706-.569l-.052-.123-1.929-5.39c-.358-1.346.004-2.782.975-3.813.447-.448.978-.8 1.56-1.038l1.837-8.382c.089-.405.489-.661.893-.573.371.082.618.424.588.793l-.015.1-1.848 8.43 2.688.72 4.279-13.347-4.008-1.07-.39 1.833c-.087.406-.485.664-.89.577-.372-.079-.62-.42-.592-.789l.015-.1.639-2.998c.155-.74.61-1.385 1.254-1.78.587-.36 1.285-.485 1.955-.356zm-6.889 19.024c-.556.591-.792 1.41-.658 2.153l.038.17 1.704 4.756 3.463-3.127c.948-.73 1.267-2.007.807-3.065l-.073-.154-4.619-1.237c-.244.14-.468.31-.662.504zm5.718-17.39c-.204.126-.367.307-.47.52l4.081 1.09c.013-.185-.016-.372-.086-.546l-.061-.132c-.14-.258-.365-.458-.635-.566l-.138-.046-1.711-.46c-.332-.09-.686-.039-.98.14z" />
        </G>
      </G>
    </Svg>
  )
}
