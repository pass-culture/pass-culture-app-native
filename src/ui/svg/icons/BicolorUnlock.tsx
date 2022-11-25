import * as React from 'react'
import { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIconInterface } from './types'

const NotMemoizedBicolorUnlock: React.FC<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="16.056%" x2="83.944%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 4C17.3723 4 12 9.37228 12 16V18H26.55C27.1023 18 27.55 18.4477 27.55 19C27.55 19.5523 27.1023 20 26.55 20H10C8.89228 20 8 20.8923 8 22V42C8 43.1077 8.89228 44 10 44H38C39.1077 44 40 43.1077 40 42V22C40 20.8923 39.1077 20 38 20H33.81C33.2577 20 32.81 19.5523 32.81 19C32.81 18.4477 33.2577 18 33.81 18H38C40.2123 18 42 19.7877 42 22V42C42 44.2123 40.2123 46 38 46H10C7.78772 46 6 44.2123 6 42V22C6 19.7877 7.78772 18 10 18V16C10 8.26772 16.2677 2 24 2C29.1591 2 33.6716 4.79071 36.0939 8.94641C36.3721 9.42355 36.2107 10.0358 35.7336 10.3139C35.2565 10.5921 34.6442 10.4307 34.3661 9.95359C32.2884 6.38929 28.4209 4 24 4ZM22 30C22 28.8954 22.8954 28 24 28C25.1046 28 26 28.8954 26 30C26 31.1046 25.1046 32 24 32C22.8954 32 22 31.1046 22 30ZM28 30C28 31.8638 26.7252 33.4299 25 33.874V37C25 37.5523 24.5523 38 24 38C23.4477 38 23 37.5523 23 37V33.874C21.2748 33.4299 20 31.8638 20 30C20 27.7909 21.7909 26 24 26C26.2091 26 28 27.7909 28 30ZM45.1252 12.637C45.6586 12.494 46.207 12.8106 46.3499 13.3441C46.4928 13.8775 46.1763 14.4259 45.6428 14.5688L40.8617 15.8499C40.3282 15.9928 39.7799 15.6763 39.637 15.1428C39.494 14.6093 39.8106 14.061 40.3441 13.918L45.1252 12.637ZM39.3218 10.1029L40.5718 7.93782C40.8479 7.45953 41.4595 7.29565 41.9378 7.5718C42.4161 7.84794 42.58 8.45953 42.3038 8.93782L41.0538 11.1029C40.7777 11.5812 40.1661 11.7451 39.6878 11.4689C39.2095 11.1928 39.0457 10.5812 39.3218 10.1029Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorUnlock = React.memo(
  styled(NotMemoizedBicolorUnlock).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
