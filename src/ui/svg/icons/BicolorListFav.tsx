import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const NotMemoizedBicolorListFav: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id, fill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={id} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M.837 17.948h3.695a.837.837 0 0 0 0-1.674H.837V3.105c0-.933.756-1.69 1.69-1.69h30.947c.933 0 1.69.757 1.69 1.69v27.79a1.69 1.69 0 0 1-1.69 1.69H2.526a1.69 1.69 0 0 1-1.69-1.69V17.948Zm6.947-1.674a.837.837 0 1 0 0 1.674h9.269v11.478a.837.837 0 0 0 1.673 0V4.574a.837.837 0 0 0-1.673 0v11.7H7.784Z"
        stroke={fill}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </AccessibleSvg>
  )
}

export const BicolorListFav = React.memo(
  styled(NotMemoizedBicolorListFav).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)

export const Clock = React.memo(
  styled(NotMemoizedBicolorListFav).attrs(({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    color2: color ?? theme.colors.black,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
