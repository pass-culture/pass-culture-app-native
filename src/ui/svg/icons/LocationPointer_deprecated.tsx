import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const LocationPointerDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.PRIMARY,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <Path d="M7.812 3l.164.005.118.002c.538.021 1.064.165 1.544.425l.12.068c1.393.894 1.949 2.648 1.315 4.19l-2.396 4.994c-.104.193-.307.316-.53.316-.242 0-.46-.144-.542-.34L4.97 7.833c-.942-2.12.41-4.622 2.679-4.828.109-.007.218-.007.327 0zM8 4.667c-.92 0-1.667.746-1.667 1.666C6.333 7.253 7.08 8 8 8s1.667-.746 1.667-1.667c0-.92-.747-1.666-1.667-1.666z" />
        </G>
      </G>
    </G>
  </Svg>
)
