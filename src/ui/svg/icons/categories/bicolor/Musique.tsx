import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Musique({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="20.085%" x2="79.915%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M16.68 30.91c2.032 0 3.68 1.648 3.68 3.68s-1.648 3.68-3.68 3.68S13 36.622 13 34.59s1.648-3.68 3.68-3.68zm0 1.5c-1.204 0-2.18.976-2.18 2.18 0 1.204.976 2.18 2.18 2.18 1.204 0 2.18-.976 2.18-2.18 0-1.204-.976-2.18-2.18-2.18zM34.236 9.984c.624.48 1.01 1.2 1.067 1.98l.007.196.001 16.32c.006.086.009.173.009.26 0 2.032-1.648 3.68-3.68 3.68s-3.68-1.648-3.68-3.68 1.648-3.68 3.68-3.68c.812 0 1.562.263 2.17.708V12.161c0-.387-.181-.752-.488-.988-.269-.207-.608-.294-.945-.245l-.144.03-10.988 2.766c-.504.136-.865.568-.918 1.077l-.007.129V28c0 .414-.336.75-.75.75-.38 0-.693-.282-.743-.648L18.82 28V14.93c0-1.184.757-2.227 1.876-2.606l.17-.051L31.86 9.505c.824-.217 1.702-.04 2.377.479zM31.64 26.56c-1.204 0-2.18.976-2.18 2.18 0 1.204.976 2.18 2.18 2.18 1.204 0 2.18-.976 2.18-2.18l-.003.102-.007-.102v-.204c-.102-1.108-1.035-1.976-2.17-1.976z" />
        </G>
      </G>
    </Svg>
  )
}
