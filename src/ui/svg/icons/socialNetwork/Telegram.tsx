import React from 'react'
import { ClipPath, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

const TelegramSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
}) => {
  const { id: clipPathId, fill: clipPathFill } = svgIdentifier()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPathFill}>
        <Path
          d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
          fill={gradientFill}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.917 23.064c7.515-3.283 12.517-5.464 15.03-6.522 7.15-3.002 8.652-3.52 9.618-3.542.215 0 .687.043 1.01.302.257.216.321.497.364.713.043.216.086.67.043 1.015-.386 4.103-2.06 14.059-2.92 18.637-.365 1.943-1.073 2.591-1.76 2.656-1.503.13-2.641-.993-4.08-1.944-2.276-1.49-3.542-2.418-5.754-3.887-2.555-1.684-.901-2.613.558-4.124.387-.39 6.978-6.436 7.107-6.976.022-.064.022-.324-.129-.453-.15-.13-.365-.087-.536-.043-.237.043-3.844 2.461-10.864 7.234-1.031.713-1.954 1.058-2.792 1.037-.923-.022-2.683-.519-4.015-.95-1.61-.519-2.898-.8-2.79-1.707.064-.475.708-.95 1.91-1.447Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={23.98}
          y1={0}
          x2={23.98}
          y2={47.62}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2AABEE" />
          <Stop offset={1} stopColor="#229ED9" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h48v48H0z" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const Telegram = styled(TelegramSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.icons.sizes.standard,
}))``
