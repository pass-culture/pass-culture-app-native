import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Cinema({
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
          <Path d="M33.548 11.353c1.467-.393 2.975.478 3.368 1.945l.518 1.932c.393 1.467-.478 2.975-1.945 3.368L18.124 23.25l17.549.001c1.536-.096 2.869 1.021 3.06 2.575l.017.174-.002 10.05c-.104 1.536-1.386 2.712-2.863 2.706l-.165-.006H31.5c-.414 0-.75-.336-.75-.75 0-.38.282-.693.648-.743l.102-.007 4.267.001c.724.046 1.354-.467 1.468-1.126L37.25 36l.002-9.95c-.05-.723-.64-1.28-1.39-1.302l-.142.002-21.487-.001c-.724-.046-1.354.467-1.468 1.126L12.75 26l-.002 9.95c.05.723.64 1.28 1.39 1.302l.142-.002H27.5c.414 0 .75.336.75.75 0 .38-.282.693-.648.743l-.102.007-13.173-.001c-1.536.096-2.869-1.021-3.06-2.575L11.25 36l.002-10.05c.052-.763.394-1.437.906-1.922-.617-.35-1.099-.938-1.297-1.678l-.518-1.932c-.393-1.467.478-2.975 1.945-3.368zm-14.732 5.5l-6.14 1.646c-.667.178-1.062.864-.884 1.53l.518 1.933c.179.666.864 1.062 1.53.883l1.551-.416 3.425-5.576zm6.339-1.698l-4.402 1.179-3.425 5.576 3.878-1.04 3.949-5.715zm5.669-1.52L27 14.663c-.003.082-.023.165-.061.244l-.049.083-3.696 5.349 3.807-1.02c.006-.077.026-.152.06-.224l.05-.083 3.713-5.375zm4.643.051c-.179-.667-.864-1.063-1.53-.884l-1.127.302-3.951 5.716 6.242-1.671c.625-.168 1.012-.78.91-1.406l-.026-.125z" />
        </G>
      </G>
    </Svg>
  )
}
