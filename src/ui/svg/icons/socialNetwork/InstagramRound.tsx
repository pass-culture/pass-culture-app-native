import * as React from 'react'
import { G, Path, Defs, RadialGradient, Stop, Circle, ClipPath, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

const InstagramRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: grandientId2, fill: gradientFill2 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Defs>
        <RadialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(12.7501 51.697) rotate(-90) scale(47.5715 44.2453)">
          <Stop stopColor="#FFDD55" />
          <Stop offset="0.1" stopColor="#FFDD55" />
          <Stop offset="0.5" stopColor="#FF543E" />
          <Stop offset="1" stopColor="#C837AB" />
        </RadialGradient>
        <RadialGradient
          id={grandientId2}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-8.04025 3.45784) rotate(78.6806) scale(21.2647 87.6539)">
          <Stop stopColor="#3771C8" />
          <Stop offset="0.128" stopColor="#3771C8" />
          <Stop offset="1" stopColor="#6600FF" stopOpacity="0" />
        </RadialGradient>
        <ClipPath id="clip0_1591_23183">
          <Rect width="48" height="48" fill="white" />
        </ClipPath>
      </Defs>
      <G clip-path="url(#clip0_1591_23183)">
        <Circle cx="24" cy="24" r="24" fill={gradientFill} />
        <Circle cx="24" cy="24" r="24" fill={gradientFill2} />
        <Path
          d="M24.0003 30.8574C20.22 30.8574 17.1431 27.7815 17.1431 24.0003C17.1431 20.2191 20.22 17.1431 24.0003 17.1431C27.7805 17.1431 30.8574 20.2191 30.8574 24.0003C30.8574 27.7815 27.7805 30.8574 24.0003 30.8574ZM24.0003 19.1023C21.2995 19.1023 19.1023 21.2996 19.1023 24.0003C19.1023 26.701 21.2995 28.8982 24.0003 28.8982C26.701 28.8982 28.8982 26.701 28.8982 24.0003C28.8982 21.2996 26.701 19.1023 24.0003 19.1023Z"
          fill="white"
        />
        <Path
          d="M32.2286 17.143C32.986 17.143 33.6 16.529 33.6 15.7716C33.6 15.0141 32.986 14.4001 32.2286 14.4001C31.4712 14.4001 30.8572 15.0141 30.8572 15.7716C30.8572 16.529 31.4712 17.143 32.2286 17.143Z"
          fill="white"
        />
        <Path
          d="M30.3297 37.7143H17.6703C13.5993 37.7143 10.2857 34.4018 10.2857 30.3297V17.6703C10.2857 13.5982 13.5993 10.2857 17.6703 10.2857H30.3297C34.4007 10.2857 37.7143 13.5982 37.7143 17.6703V30.3297C37.7143 34.4018 34.4007 37.7143 30.3297 37.7143ZM17.6703 12.3956C14.7618 12.3956 12.3956 14.7619 12.3956 17.6703V30.3297C12.3956 33.2382 14.7618 35.6044 17.6703 35.6044H30.3297C33.2381 35.6044 35.6044 33.2382 35.6044 30.3297V17.6703C35.6044 14.7619 33.2381 12.3956 30.3297 12.3956H17.6703Z"
          fill="white"
        />
      </G>
    </AccessibleSvg>
  )
}

export const InstagramRound = styled(InstagramRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
