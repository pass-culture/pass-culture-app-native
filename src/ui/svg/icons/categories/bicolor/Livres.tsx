import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const LivresSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      aria-hidden={!accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="16.819%" x2="83.181%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M12 4C9.79228 4 8 5.79228 8 8V39.3371C8.45468 39.121 8.96328 39 9.5 39H14V33C14 32.4477 14.4477 32 15 32C15.5523 32 16 32.4477 16 33V39H38C39.1077 39 40 38.1077 40 37V13C40 12.4477 40.4477 12 41 12C41.5523 12 42 12.4477 42 13V37C42 39.2123 40.2123 41 38 41H9.5C8.67228 41 8 41.6723 8 42.5C8 43.3277 8.67228 44 9.5 44V45C9.5 44 9.50116 44 9.50116 44H36C36.4304 44 36.6955 43.9269 36.8281 43.8403C36.8796 43.8066 36.9107 43.7717 36.9347 43.7239C36.9612 43.6713 37 43.5603 37 43.35C37 42.7977 37.4477 42.35 38 42.35C38.5523 42.35 39 42.7977 39 43.35C39 44.3108 38.6167 45.0607 37.9219 45.5147C37.3045 45.9181 36.5696 46 36 46H9.5C7.92878 46 6.59861 44.9634 6.15636 43.5372C6.05737 43.382 6 43.1977 6 43V8C6 4.68772 8.68772 2 12 2H39C40.6523 2 42 3.34772 42 5V7.66C42 8.21228 41.5523 8.66 41 8.66C40.4477 8.66 40 8.21228 40 7.66V5C40 4.45228 39.5477 4 39 4H16V28C16 28.5523 15.5523 29 15 29C14.4477 29 14 28.5523 14 28V4H12Z"
      />
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M21 15C21 14.4477 21.4477 14 22 14H34C34.5523 14 35 14.4477 35 15C35 15.5523 34.5523 16 34 16H22C21.4477 16 21 15.5523 21 15Z"
      />
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M22 19C21.4477 19 21 19.4477 21 20C21 20.5523 21.4477 21 22 21H30C30.5523 21 31 20.5523 31 20C31 19.4477 30.5523 19 30 19H22Z"
      />
    </AccessibleSvg>
  )
}

export const Livres = styled(LivresSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.primary,
  size: size ?? theme.icons.sizes.standard,
}))``
