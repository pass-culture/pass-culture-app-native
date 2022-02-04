import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const ArrowPreviousSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} aria-hidden>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.6748 44.2116C32.07 43.8227 32.075 43.1873 31.6858 42.7924L14.3334 25.28C13.8973 24.8373 13.9038 24.1152 14.3289 23.6893L14.3302 23.688L31.7078 6.21083C32.0988 5.81768 32.0967 5.18229 31.7033 4.79165C31.3098 4.40101 30.674 4.40305 30.2831 4.79621L12.9068 22.272C11.6954 23.4863 11.7016 25.4695 12.9022 26.6881L30.2546 44.2005C30.6438 44.5955 31.2796 44.6004 31.6748 44.2116Z"
    />
  </Svg>
)

export const ArrowPrevious = styled(ArrowPreviousSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
