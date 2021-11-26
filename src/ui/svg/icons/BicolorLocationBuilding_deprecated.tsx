import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorLocationBuildingDeprecated: React.FunctionComponent<BicolorIconInterface> =
  ({
    size = 32,
    color = ColorsEnum.PRIMARY,
    color2 = ColorsEnum.SECONDARY,
    testID = 'BicolorLocationBuilding',
  }) => {
    const LINEAR_GRADIENT_ID = uuidv1()
    return (
      <Svg width={size} height={size} viewBox="-7 -8 36 36" testID={testID}>
        <Defs>
          <LinearGradient id={LINEAR_GRADIENT_ID} x1="32.324%" x2="67.676%" y1="0%" y2="100%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color2} />
          </LinearGradient>
        </Defs>
        <G fill="none" fillRule="evenodd">
          <G fill={`url(#${LINEAR_GRADIENT_ID})`}>
            <Path d="M5.16 5.432L.51 9.102c-.32.22-.51.572-.51.947v7.54c0 .805.69 1.459 1.54 1.459h2.183c.456 0 .824-.35.824-.782v-3.455c0-.216.186-.392.416-.392h1.954c.229 0 .414.176.414.392v3.455c0 .432.37.782.825.782h2.182c.454 0 .878-.188 1.168-.507.238-.262.373-.599.373-.952v-7.54c0-.375-.19-.727-.51-.947l-.47-.374-4.15-3.274c-.494-.342-1.124-.342-1.59-.022zm.897.863l4.62 3.648c.059.041.076.073.076.106v7.54c0 .095-.036.185-.1.255l-.052.048c-.073.057-.165.09-.263.09l-1.881-.001v-3.17c0-.805-.69-1.458-1.54-1.458H4.963l-.115.004c-.798.055-1.427.685-1.427 1.454v3.17H1.54c-.23 0-.415-.176-.415-.392v-7.54c0-.033.017-.065.044-.083l.03-.023 4.652-3.67c.04-.026.135-.026.205.022z" />
            <Path d="M18.12 0c1 0 1.815.737 1.876 1.665l.004.112v15.627c0 .87-.716 1.584-1.624 1.64l-.114.004h-3.093c-.275 0-.586-.07-.586-.518 0-.297.195-.464.586-.5h3.093c.334 0 .612-.241.65-.553l.004-.073V1.777c0-.392-.312-.713-.71-.754l-.086-.005H9.746c-.409 0-.747.296-.79.676l-.005.083v2.466c0 .281-.243.51-.542.51-.275 0-.501-.192-.537-.441l-.005-.07V1.778c0-.942.776-1.715 1.76-1.773L9.746 0h8.374z" />
            <Path d="M12.533 2.857c.516 0 .934.427.934.953v1.904c0 .526-.418.953-.934.953H11.6c-.515 0-.933-.427-.933-.953V3.81c0-.526.418-.953.933-.953h.933zm0 .953H11.6v1.904h.933V3.81zM16.267 2.857c.515 0 .933.427.933.953v1.904c0 .526-.418.953-.933.953h-.934c-.515 0-.933-.427-.933-.953V3.81c0-.526.418-.953.933-.953h.934zm0 .953h-.934v1.904h.934V3.81zM16.267 7.619c.515 0 .933.426.933.952v1.905c0 .526-.418.953-.933.953h-.934c-.515 0-.933-.427-.933-.953V8.571c0-.526.418-.952.933-.952h.934zm0 .952h-.934v1.905h.934V8.571zM16.267 12.381c.515 0 .933.426.933.952v1.905c0 .526-.418.952-.933.952h-.934c-.515 0-.933-.426-.933-.952v-1.905c0-.526.418-.952.933-.952h.934zm0 .952h-.934v1.905h.934v-1.905z" />
          </G>
        </G>
      </Svg>
    )
  }

export const BicolorLocationBuildingDeprecated = React.memo(
  NotMemoizedBicolorLocationBuildingDeprecated
)
