import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const ArrowNextDoubleSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 52 53" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <Path
          d="M7.482.418c.322-.336.81-.34 1.134-.027l.078.085 6.927 8.544c2.059 2.54 2.11 6.41.154 9.016l-.154.198-6.927 8.544c-.32.395-.863.421-1.212.058-.322-.336-.367-.886-.12-1.28l.069-.094 6.926-8.544c1.461-1.803 1.507-4.543.137-6.405l-.137-.177-6.926-8.544c-.321-.395-.298-1.01.05-1.374z"
          transform="translate(-186 -338) translate(22 166) translate(0 40) translate(164 132.454)"
        />
        <Path
          d="M.515 4.54c.352-.316.878-.31 1.223-.005l.083.083 5.215 5.912c1.508 1.71 1.556 4.257.146 6.02l-.146.174-5.215 5.912c-.34.385-.924.42-1.306.078-.353-.316-.409-.842-.149-1.224l.072-.092 5.215-5.913c.894-1.014.933-2.519.117-3.575l-.117-.141L.438 5.856c-.34-.385-.305-.974.077-1.316z"
          transform="translate(-186 -338) translate(22 166) translate(0 40) translate(164 132.454)"
        />
      </G>
    </G>
  </Svg>
)

export const ArrowNextDouble = styled(ArrowNextDoubleSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
