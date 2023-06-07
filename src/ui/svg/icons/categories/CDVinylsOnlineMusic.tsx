import * as React from 'react'
import { Path, G, Defs, Stop, ClipPath, Rect, RadialGradient } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const CDVinylsOnlineMusicSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 269 112"
      accessibilityLabel={accessibilityLabel}
      fill="none"
      testID={testID}>
      <G clipPath="url(#clip0_1909_644)">
        <G filter="url(#filter0_d_1909_644)">
          <Path
            d="M22.5 55C22.5 51.6863 25.1863 49 28.5 49C31.8137 49 34.5 51.6863 34.5 55C34.5 58.3137 31.8137 61 28.5 61C25.1863 61 22.5 58.3137 22.5 55Z"
            fill="#20C5E9"
          />
        </G>
        <G filter="url(#filter1_d_1909_644)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.5 18C11.17 18 -4.5 33.67 -4.5 53C-4.5 72.33 11.17 88 30.5 88C49.83 88 65.5 72.33 65.5 53C65.5 33.67 49.83 18 30.5 18ZM29.5 47C26.1863 47 23.5 49.6863 23.5 53C23.5 56.3137 26.1863 59 29.5 59C32.8137 59 35.5 56.3137 35.5 53C35.5 49.6863 32.8137 47 29.5 47Z"
            fill="url(#paint0_angular_1909_644)"
          />
        </G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.7952 60.1241C30.6241 61.6437 34.9599 59.7716 36.4794 55.9427C37.9989 52.1138 36.1268 47.7781 32.2979 46.2585C28.4691 44.739 24.1333 46.6111 22.6138 50.44C21.0942 54.2688 22.9663 58.6046 26.7952 60.1241ZM18.2352 48.7023C15.7559 54.9494 18.8104 62.0235 25.0575 64.5027C31.3046 66.982 38.3788 63.9275 40.858 57.6804C43.3372 51.4333 40.2828 44.3591 34.0356 41.8799C27.7885 39.4007 20.7144 42.4551 18.2352 48.7023Z"
          fill="#A1EFFF"
        />
      </G>
      <Defs>
        <RadialGradient
          id="paint0_angular_1909_644"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(30.5 53) rotate(9.02761) scale(35.439)">
          <Stop offset={0.479167} stopColor="#D6F8FF" />
          <Stop offset={0.859375} stopColor="white" />
        </RadialGradient>
        <ClipPath id="clip0_1909_644">
          <Rect width={268.5} height={112} fill="white" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const CDVinylsOnlineMusic = styled(CDVinylsOnlineMusicSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
