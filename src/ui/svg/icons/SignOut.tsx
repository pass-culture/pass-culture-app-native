import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const SignOut: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
    <G fill="none" fill-rule="evenodd">
      <G fill={color}>
        <Path
          d="M19.87 7.996c3.47 1.372 5.797 4.733 5.797 8.527 0 5.063-4.104 9.167-9.167 9.167s-9.167-4.104-9.167-9.167c0-3.781 2.311-7.132 5.763-8.513.257-.103.548.022.65.278.103.257-.022.548-.278.65-3.076 1.23-5.135 4.216-5.135 7.585 0 4.51 3.656 8.167 8.167 8.167 4.51 0 8.167-3.656 8.167-8.167 0-3.38-2.073-6.374-5.165-7.597-.257-.102-.383-.392-.281-.65.102-.256.392-.382.649-.28zm-3.37-1.33c.253 0 .462.189.495.433l.005.068v7.16c0 .275-.224.5-.5.5-.253 0-.462-.189-.495-.433L16 14.326v-7.16c0-.275.224-.5.5-.5z"
          transform="translate(-25 -1024) translate(25 1024)"
        />
      </G>
    </G>
  </Svg>
)
