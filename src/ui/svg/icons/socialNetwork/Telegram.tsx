import React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { IconInterface } from '../types'

const TelegramSvg: React.FunctionComponent<IconInterface> = ({ size, testID }) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
      <Path
        d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
        fill={gradientFill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8509 23.7402C17.8451 20.7027 22.5012 18.6844 24.8393 17.7052C31.4937 14.9276 32.8926 14.448 33.7918 14.428C33.9916 14.428 34.4313 14.4679 34.731 14.7077C34.9708 14.9076 35.0308 15.1674 35.0707 15.3672C35.1107 15.567 35.1507 15.9867 35.1107 16.3064C34.751 20.1032 33.1923 29.3156 32.393 33.552C32.0533 35.3505 31.3938 35.95 30.7543 36.01C29.3555 36.1299 28.2964 35.0908 26.9575 34.2115C24.8393 32.8326 23.6603 31.9734 21.602 30.6145C19.224 29.0558 20.7627 28.1965 22.1215 26.7977C22.4812 26.438 28.6161 20.8426 28.736 20.343C28.756 20.2831 28.756 20.0433 28.6161 19.9234C28.4762 19.8035 28.2764 19.8435 28.1165 19.8834C27.8967 19.9234 24.5395 22.1615 18.005 26.5779C17.0458 27.2373 16.1865 27.557 15.4071 27.5371C14.5478 27.5171 12.9092 27.0574 11.6702 26.6578C10.1715 26.1782 8.9725 25.9184 9.07241 25.0791C9.13236 24.6395 9.73186 24.1998 10.8509 23.7402Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="23.98"
          y1="0"
          x2="23.98"
          y2="47.6203"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2AABEE" />
          <Stop offset="1" stopColor="#229ED9" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export const Telegram = styled(TelegramSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.icons.sizes.standard,
}))``
