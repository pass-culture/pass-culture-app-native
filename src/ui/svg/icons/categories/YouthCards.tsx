import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const YouthCardsSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      <G clipPath="url(#clip0_1909_726)">
        <G filter="url(#filter0_d_1909_726)">
          <Path
            d="M55.5526 55.1367L0.279428 82.1703C-2.06551 83.3196 -4.89865 82.3398 -6.03667 79.9772L-20.8416 49.3808C-21.9841 47.0253 -21.0074 44.178 -18.6555 43.0332L36.6132 16.0068C38.9582 14.8574 41.7913 15.8372 42.9293 18.1999L57.733 48.7904C58.8755 51.146 57.8976 53.9874 55.5526 55.1367Z"
            fill="url(#paint0_linear_1909_726)"
          />
        </G>
        <Path
          d="M-19.2288 52.6948L44.5291 21.5285L46.1036 24.7833L-17.6543 55.9495L-19.2288 52.6948Z"
          fill="#D0BCFD"
        />
        <G filter="url(#filter1_d_1909_726)">
          <Path
            d="M64.4327 74.885L4.42794 88.0903C1.87774 88.6515 -0.64162 87.0283 -1.20191 84.4629L-8.46539 51.2057C-9.02568 48.6403 -7.41395 46.1079 -4.86374 45.5467L55.141 32.3414C57.6912 31.7802 60.2105 33.4035 60.7708 35.9689L68.0356 69.2318C68.5946 71.7914 66.9829 74.3238 64.4327 74.885Z"
            fill="url(#paint1_linear_1909_726)"
          />
        </G>
        <Path
          d="M61.5624 39.5952L-7.67383 54.832L-6.90058 58.3725L62.3356 43.1356L61.5624 39.5952Z"
          fill="#D0BCFD"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1909_726"
          x1={68.5}
          y1={-8}
          x2={10.1431}
          y2={49.1461}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#EAE3FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1909_726"
          x1={-20.5}
          y1={96.999}
          x2={69.3529}
          y2={37.6507}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#EAE3FF" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1909_726">
          <Rect width={268.5} height={112} fill="white" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const YouthCards = styled(YouthCardsSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
