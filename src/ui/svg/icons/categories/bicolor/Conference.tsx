import * as React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export function Conference({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2,
  testID,
}: BicolorIconInterface): JSX.Element {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1="38.129%" x2="61.871%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" opacity=".9">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`}>
          <Path d="M29.013 12.16c.286.299.275.774-.025 1.06-.3.285-.774.274-1.06-.026-1.381-1.448-3.443-2.026-5.376-1.507-1.667.448-3.009 1.65-3.648 3.22l7.93 2.125c.401.108.638.519.531.919-.098.367-.452.597-.818.55l-.1-.02-7.913-2.12c-.179 1.592.35 3.19 1.456 4.362l5.717 1.53c1.776-.544 3.17-1.96 3.67-3.776.238-.858.256-1.762.053-2.63-.094-.403.157-.806.56-.9.403-.095.807.156.901.559.26 1.111.237 2.27-.067 3.37-.676 2.451-2.63 4.332-5.087 4.923l-3.307 9.572c-.405 1.174-1.596 1.865-2.789 1.666l-.844 3.277c-.103.4-.512.642-.913.54-.368-.096-.601-.447-.558-.814l.018-.1.9-3.496c-.705-.58-1.07-1.516-.88-2.456l1.868-9.907-.143-.136c-1.746-1.712-2.472-4.223-1.894-6.613.6-2.479 2.505-4.432 4.968-5.093 2.463-.662 5.09.075 6.85 1.92zm-8.326 10.3l-1.851 9.815c-.106.528.21 1.05.704 1.196l.239.062c.518.142 1.057-.143 1.233-.651l3.267-9.46-3.592-.962zm1.268 2.462c.366.098.597.452.55.818l-.02.1-.46 1.72c-.107.4-.518.638-.918.531-.367-.098-.597-.451-.55-.818l.02-.1.46-1.72c.106-.4.517-.638.918-.53z" />
        </G>
      </G>
    </Svg>
  )
}
