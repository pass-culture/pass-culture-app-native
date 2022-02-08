import * as React from 'react'
import Svg, { Path, Circle } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'

const PhoneFlipSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <Svg width={size} height={height} viewBox="0 0 200 156" fill="none" testID={testID} aria-hidden>
      <Path
        d="M91 56H33a8 8 0 00-8 8v55a8 8 0 008 8h47.5"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 10"
      />
      <Path
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="6 10"
        d="M46 71L46 126"
      />
      <Path
        d="M60 47.365c3.573-21.2 21.816-18.127 27.732-17.13M86.923 23l5.16 7.251a1 1 0 01-.235 1.395l-7.251 5.16"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M154.531 40.664l-50.387-7.88M157.977 122.175l-66.196-10.353M101.362 50.568l-11.435 73.111a6 6 0 005.001 6.855l38.532 6.026m-30.012-99.33l2.55-16.302a6 6 0 016.855-5l55.327 8.652a6 6 0 015.001 6.856l-16.07 102.75a6.001 6.001 0 01-6.856 5.001l-2.47-.386"
        stroke={color}
        strokeWidth={4.6}
        strokeLinecap="round"
      />
      <Circle
        cx={139.125}
        cy={29.1463}
        r={3}
        transform="rotate(8.89 139.125 29.146)"
        fill={color}
      />
    </Svg>
  )
}

export const PhoneFlip = styled(PhoneFlipSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.illustrations.sizes.medium,
}))``
