import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const KeySvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={color}
      d="M13.6 34C8.29807 34 4 29.5228 4 24C4 18.4772 8.29807 14 13.6 14C17.7799 14 21.3359 16.7827 22.6537 20.6667L35.9833 20.6667L36 20.6666L36.0166 20.6667L40.6667 20.6667C42.5076 20.6667 44 22.1591 44 24C44 25.841 42.5076 27.3333 40.6667 27.3333H39.2V30.8C39.2 32.5673 37.7673 34 36 34C34.2327 34 32.8 32.5673 32.8 30.8V27.3333H22.6537C21.3359 31.2173 17.7799 34 13.6 34ZM13.5999 29C10.949 29 8.79994 26.7614 8.79994 24C8.79994 21.2386 10.949 19 13.5999 19C16.2509 19 18.3999 21.2386 18.3999 24C18.3999 26.7614 16.2509 29 13.5999 29Z"
    />
  </Svg>
)

export const Key = styled(KeySvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
