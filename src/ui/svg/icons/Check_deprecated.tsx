import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const CheckDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <G>
            <Path
              d="M15.532 5.545c.16-.166.423-.172.59-.013.153.147.17.383.046.55l-.034.04-7.982 8.333c-.151.158-.396.17-.562.036l-.04-.036L3.866 10.6c-.16-.167-.154-.43.013-.59.153-.146.39-.152.55-.022l.039.036 3.384 3.539 7.68-8.019z"
              transform="translate(-23 -14) translate(-5) translate(28 14)"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
