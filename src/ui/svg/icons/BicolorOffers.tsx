import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

function BicolorOffersSvg({ size, testID, accessibilityLabel, color, color2 }: AccessibleIcon) {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 40 40">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5206 6.66634C16.5206 5.74875 17.2667 4.99967 18.2053 4.99967H33.315C34.2536 4.99967 34.9997 5.74875 34.9997 6.66634V8.82467C34.9997 9.28491 35.3729 9.65801 35.8333 9.65801C36.2936 9.65801 36.6668 9.28491 36.6668 8.82467V6.66634C36.6668 4.81726 35.1633 3.33301 33.315 3.33301H18.2053C16.357 3.33301 14.8534 4.81726 14.8534 6.66634V33.333C14.8534 35.1821 16.357 36.6663 18.2053 36.6663H33.315C35.1633 36.6663 36.6668 35.1821 36.6668 33.333V14.658C36.6668 14.1978 36.2936 13.8247 35.8333 13.8247C35.3729 13.8247 34.9997 14.1978 34.9997 14.658V33.333C34.9997 34.2506 34.2536 34.9997 33.315 34.9997H18.2053C17.2667 34.9997 16.5206 34.2506 16.5206 33.333V6.66634ZM11.5919 7.04748C12.0373 6.93088 12.3037 6.47543 12.1871 6.03021C12.0705 5.58499 11.6149 5.31859 11.1696 5.43519L5.82285 6.83507C4.03285 7.30182 2.96745 9.13611 3.4494 10.9174L9.89609 34.7836C10.0161 35.2279 10.4737 35.4908 10.9181 35.3708C11.3626 35.2509 11.6256 34.7934 11.5055 34.3491L5.05861 10.482C4.819 9.59686 5.34812 8.68114 6.24384 8.44772L11.5919 7.04748Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="1.3335"
          y1="3.99878"
          x2="8.98786"
          y2="30.0293"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const BicolorOffers = styled(BicolorOffersSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.secondary,
  color2: color2 ?? theme.colors.primary,
  size: size ?? theme.icons.sizes.standard,
}))``
