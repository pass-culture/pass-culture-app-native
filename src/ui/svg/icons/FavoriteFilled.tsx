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
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
      <Path
        d="M28.95 33.667c-1.441.967-2.948 1.86-4.569 2.473a.75.75 0 01-.415.034l-.102-.029-.057-.02c-6-2.29-10.782-7.05-13.113-13.057a7.308 7.308 0 0113.357-5.87l.065.132.066-.131a7.308 7.308 0 016.25-3.945l.242-.004a7.308 7.308 0 016.86 9.831 22.79 22.79 0 01-4.04 6.697c-.891.88-1.58 1.53-2.069 1.947-.522.446-1.347 1.094-2.475 1.942z"
        fill={color}
        fillRule="evenodd"
        strokeWidth="1"
        stroke="none"
        transform="translate(-313 -16) translate(313 16)"
      />
    </Svg>
  )
}
