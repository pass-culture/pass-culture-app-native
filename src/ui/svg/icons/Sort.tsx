import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

function SortSvg({ size, color, testID }: IconInterface) {
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

export const Sort = styled(SortSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
