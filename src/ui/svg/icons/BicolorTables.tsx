import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const BicolorTablesSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.916 81.632H48.87a3.208 3.208 0 0 0 0-6.416H37.916v-50.48a3.268 3.268 0 0 1 3.268-3.268h118.632a3.268 3.268 0 0 1 3.268 3.269v106.526a3.269 3.269 0 0 1-3.268 3.269H41.184a3.269 3.269 0 0 1-3.268-3.269V81.632ZM31.5 24.737c0-5.349 4.336-9.684 9.684-9.684h118.632c5.348 0 9.684 4.335 9.684 9.684v106.526c0 5.349-4.336 9.684-9.684 9.684H41.184c-5.348 0-9.684-4.335-9.684-9.684V24.737Zm26.632 53.687a3.208 3.208 0 0 1 3.208-3.208h35.528v-44.85a3.208 3.208 0 1 1 6.416 0v95.268a3.208 3.208 0 1 1-6.416 0V81.632H61.34a3.208 3.208 0 0 1-3.208-3.208Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={31.5}
          y1={15.053}
          x2={75.419}
          y2={149.005}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color2} />
          <Stop offset={1} stopColor={color} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const BicolorTables = styled(BicolorTablesSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? color ?? theme.colors.secondary,
  size: size ?? theme.illustrations.sizes.medium,
}))``
