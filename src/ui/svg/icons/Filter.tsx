import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

function FilterSvg({ size, color, testID }: IconInterface) {
  return (
    <Svg width={size} height={size} fill={color} viewBox="0 0 32 32" testID={testID} aria-hidden>
      <Path
        d="M18.872 18.133c1.338 0 2.462.935 2.781 2.2h2.81l.109.006c.429.045.761.354.761.728 0 .405-.39.733-.87.733h-2.81c-.319 1.265-1.443 2.2-2.781 2.2s-2.463-.935-2.781-2.2H7.538l-.11-.006c-.429-.045-.761-.353-.761-.727 0-.405.39-.734.87-.734h8.553c.32-1.265 1.444-2.2 2.782-2.2zm0 1.467c-.793 0-1.436.657-1.436 1.467s.643 1.466 1.436 1.466c.793 0 1.436-.656 1.436-1.466 0-.81-.643-1.467-1.436-1.467zM13.128 9.333c1.338 0 2.463.935 2.782 2.2h8.552c.481 0 .871.329.871.734 0 .374-.332.682-.761.727l-.11.006H15.91c-.318 1.265-1.443 2.2-2.78 2.2-1.339 0-2.463-.935-2.782-2.2h-2.81c-.48 0-.87-.328-.87-.733 0-.374.332-.683.761-.728l.11-.006h2.809c.319-1.265 1.443-2.2 2.781-2.2zm0 1.467c-.793 0-1.436.657-1.436 1.467s.643 1.466 1.436 1.466c.793 0 1.436-.656 1.436-1.466 0-.81-.643-1.467-1.436-1.467z"
        transform="translate(-142 -543) translate(130 539) translate(12 4) rotate(90 16 16.667)"
      />
    </Svg>
  )
}

export const Filter = styled(FilterSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
