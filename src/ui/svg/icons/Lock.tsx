import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const LockSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 16.5C12 9.87228 17.3723 4.5 24 4.5C30.6277 4.5 36 9.87228 36 16.5V18.5H12V16.5ZM10 18.5V16.5C10 8.76772 16.2677 2.5 24 2.5C31.7323 2.5 38 8.76772 38 16.5V18.5C40.2123 18.5 42 20.2877 42 22.5V42.5C42 44.7123 40.2123 46.5 38 46.5H33.81C33.2577 46.5 32.81 46.0523 32.81 45.5C32.81 44.9477 33.2577 44.5 33.81 44.5H38C39.1077 44.5 40 43.6077 40 42.5V22.5C40 21.3923 39.1077 20.5 38 20.5H37H10C8.89228 20.5 8 21.3923 8 22.5V42.5C8 43.6077 8.89228 44.5 10 44.5H26.55C27.1023 44.5 27.55 44.9477 27.55 45.5C27.55 46.0523 27.1023 46.5 26.55 46.5H10C7.78772 46.5 6 44.7123 6 42.5V22.5C6 20.2877 7.78772 18.5 10 18.5ZM24 28.5C22.8954 28.5 22 29.3954 22 30.5C22 31.6046 22.8954 32.5 24 32.5C25.1046 32.5 26 31.6046 26 30.5C26 29.3954 25.1046 28.5 24 28.5ZM25 34.374C26.7252 33.9299 28 32.3638 28 30.5C28 28.2909 26.2091 26.5 24 26.5C21.7909 26.5 20 28.2909 20 30.5C20 32.3638 21.2748 33.9299 23 34.374V37.5C23 38.0523 23.4477 38.5 24 38.5C24.5523 38.5 25 38.0523 25 37.5V34.374Z"
    />
  </Svg>
)

export const Lock = styled(LockSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
