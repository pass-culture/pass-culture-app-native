import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
function SmartphoneSvg({ size, color, testID, opacity }: IconInterface): JSX.Element {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 32 33" fill={color} aria-hidden>
      <Path
        opacity={opacity}
        d="M10 3.542a1.33 1.33 0 0 0-1.333 1.333v2.833a.667.667 0 0 1-1.334 0V4.875A2.664 2.664 0 0 1 10 2.208h12a2.664 2.664 0 0 1 2.667 2.667v24A2.664 2.664 0 0 1 22 31.542H10a2.664 2.664 0 0 1-2.667-2.667V11.542a.667.667 0 1 1 1.334 0v15.333h8a.667.667 0 0 1 0 1.333h-8v.667A1.33 1.33 0 0 0 10 30.208h12a1.33 1.33 0 0 0 1.333-1.333v-.667h-2.666a.667.667 0 1 1 0-1.333h2.666v-22A1.33 1.33 0 0 0 22 3.542h-5.333v1.333h2.666a.667.667 0 0 1 0 1.333h-6.666a.667.667 0 1 1 0-1.333h2.666V3.542H10Z"
        fill={color}
      />
    </Svg>
  )
}

export const Smartphone = styled(SmartphoneSvg).attrs(({ color, size, opacity, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
  opacity: opacity ?? 1,
}))``
