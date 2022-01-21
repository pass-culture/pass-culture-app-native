import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

import { IconInterface } from './types'

export function Sort({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
}: IconInterface) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 32 32" testID={testID}>
      <G fill="none" fillRule="evenodd">
        <G fill="#FFF">
          <Path
            d="M16 21.333c.368 0 .667.299.667.667 0 .368-.299.667-.667.667H8c-.368 0-.667-.299-.667-.667 0-.368.299-.667.667-.667h8zm4-6c.368 0 .667.299.667.667 0 .368-.299.667-.667.667H8c-.368 0-.667-.299-.667-.667 0-.368.299-.667.667-.667h12zm4-6c.368 0 .667.299.667.667 0 .368-.299.667-.667.667H8c-.368 0-.667-.299-.667-.667 0-.368.299-.667.667-.667h16z"
            transform="translate(-146 -1065) translate(134 1061) translate(12 4)"
          />
        </G>
      </G>
    </Svg>
  )
}
