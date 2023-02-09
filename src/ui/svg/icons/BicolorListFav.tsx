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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.674 24.98h2.858c.462 0 .836-.387.836-.866 0-.478-.374-.866-.836-.866H7.674V9.615c0-.487.381-.882.852-.882h30.948c.47 0 .852.395.852.882v28.77c0 .487-.381.882-.852.882H8.526c-.47 0-.852-.395-.852-.882V24.98ZM6 9.616C6 8.171 7.131 7 8.526 7h30.948C40.869 7 42 8.17 42 9.615v28.77C42 39.829 40.869 41 39.474 41H8.526C7.131 41 6 39.83 6 38.385V9.615Zm6.947 14.5c0-.479.375-.867.837-.867h9.269V11.136c0-.479.374-.867.837-.867.462 0 .836.388.836.867v25.728c0 .479-.374.867-.836.867-.463 0-.837-.388-.837-.867V24.981h-9.269c-.462 0-.837-.388-.837-.867Z"
        fill={fill}
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
