import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Invalidate: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 45.5C35.598 45.5 45 36.098 45 24.5C45 12.902 35.598 3.5 24 3.5C12.402 3.5 3 12.902 3 24.5C3 36.098 12.402 45.5 24 45.5ZM15.5872 16.0844C16.369 15.3041 17.6353 15.3054 18.4156 16.0872L23.9882 21.6706L29.5524 16.1192C30.3343 15.339 31.6007 15.3405 32.3808 16.1224C33.161 16.9044 33.1595 18.1707 32.3776 18.9509L26.8214 24.4943L32.4095 30.0462C33.1931 30.8247 33.1972 32.0911 32.4187 32.8746C31.6402 33.6582 30.3739 33.6623 29.5903 32.8838L23.9999 27.3296L18.4578 32.9094C17.6794 33.6931 16.4131 33.6974 15.6294 32.919C14.8457 32.1406 14.8414 30.8743 15.6198 30.0906L21.1667 24.506L15.5844 18.9128C14.8041 18.131 14.8054 16.8647 15.5872 16.0844Z"
    />
  </Svg>
)
