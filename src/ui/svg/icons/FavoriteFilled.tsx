import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export function FavoriteFilled({
  size = 32,
  color = ColorsEnum.PRIMARY,
  testID,
}: IconInterface): JSX.Element {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 40 40">
      <Path
        d="M24.125 27.223c-1.2.805-2.457 1.55-3.807 2.06-.111.043-.231.052-.346.029l-.086-.024-.047-.017c-5-1.909-8.985-5.875-10.928-10.881-.243-.665-.37-1.37-.37-2.093 0-3.363 2.728-6.089 6.091-6.089 2.355 0 4.397 1.336 5.41 3.29l.055.11.054-.109c.985-1.9 2.94-3.214 5.21-3.287l.2-.004c3.364 0 6.091 2.726 6.091 6.09 0 .721-.126 1.427-.373 2.103-.793 2.042-1.934 3.93-3.368 5.58-.742.734-1.317 1.275-1.723 1.623-.435.372-1.123.912-2.063 1.619z"
        fill={color}
        transform="translate(-313 -16) translate(313 16)"
      />
    </Svg>
  )
}
