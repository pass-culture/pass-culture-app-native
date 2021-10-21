import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

// This icon should be replaced by the updated version of Error
export function WarningDeprecated({ size, testID, color = ColorsEnum.ERROR }: IconInterface) {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 24 24">
      <Path
        d="M12 4.5a7.5 7.5 0 015.95 12.066.38.38 0 11-.604-.465 6.737 6.737 0 10-2.724 2.106.382.382 0 01.297.703A7.5 7.5 0 1112 4.5zm.118 3.779c.254 0 .463.143.496.33l.004.05v4.527c0 .21-.223.381-.5.381-.253 0-.462-.143-.495-.33l-.005-.051V8.66c0-.21.224-.381.5-.381zm.39 6.995a.508.508 0 10-1.015-.003.508.508 0 001.015.003"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
