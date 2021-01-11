import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export function MagnifyingGlass({ size = 32, color = ColorsEnum.BLACK, testID }: IconInterface) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 32 32" testID={testID}>
      <Path d="M19.557 18.857l.056.049 5.907 5.907c.195.195.195.512 0 .707-.177.178-.455.194-.651.048l-.056-.048-5.907-5.907c-.196-.196-.196-.512 0-.707.177-.178.455-.194.65-.049zM13.445 7.333c3.376 0 6.113 2.737 6.113 6.112 0 3.376-2.737 6.113-6.113 6.113-3.375 0-6.112-2.737-6.112-6.113 0-3.375 2.737-6.112 6.112-6.112zm0 1c-2.823 0-5.112 2.29-5.112 5.112 0 2.824 2.29 5.113 5.112 5.113 2.823 0 5.113-2.29 5.113-5.113 0-2.823-2.29-5.112-5.113-5.112zm-1.25 1.945c.138.24.056.545-.183.683-.88.51-1.434 1.449-1.434 2.484 0 .276-.224.5-.5.5s-.5-.224-.5-.5c0-1.396.747-2.663 1.933-3.35.24-.137.545-.056.683.183z" />
    </Svg>
  )
}
