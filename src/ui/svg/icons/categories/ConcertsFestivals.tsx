import * as React from 'react'
import {
  Path,
  G,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
} from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const ConcertsFestivalsSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      <G clipPath="url(#clip0_1876_239)">
        <G filter="url(#filter0_d_1876_239)">
          <Path
            d="M45.3645 49.6918C53.2152 49.6918 59.5795 43.2335 59.5795 35.2668C59.5795 27.3001 53.2152 20.8418 45.3645 20.8418C37.5137 20.8418 31.1494 27.3001 31.1494 35.2668C31.1494 43.2335 37.5137 49.6918 45.3645 49.6918Z"
            fill="url(#paint0_radial_1876_239)"
          />
        </G>
        <G filter="url(#filter1_d_1876_239)">
          <Path
            d="M40.6505 49.5341L30.99 39.7539L-7.07227 81.7191L-0.629998 88.2392L40.6505 49.5341Z"
            fill="url(#paint1_linear_1876_239)"
          />
        </G>
        <Path
          d="M0.263672 73.6387L2.38312 71.3418L9.60241 78.6075L3.37213 84.4242L0.263672 73.6387Z"
          fill="#D1D1D1"
          fillOpacity={0.2}
        />
        <G filter="url(#filter2_d_1876_239)">
          <Path
            d="M30.1319 58.4598L21.8593 50.1339C21.0923 49.3608 19.8372 49.3927 19.1081 50.2042L2.29676 68.9453C1.61847 69.7057 1.64383 70.8687 2.36649 71.5907L8.8958 78.1594C9.61212 78.8814 10.7658 78.907 11.5202 78.2233L13.162 76.7217C14.3221 75.661 16.1858 76.3894 16.3316 77.9613L17.8023 99.6688C17.9037 100.723 18.8292 101.496 19.8752 101.394L24.2936 100.966C25.3395 100.864 26.1066 99.9308 26.0051 98.8765L23.6787 68.1339C23.6216 67.5332 23.8498 66.939 24.2936 66.53L30.0685 61.2393C30.8736 60.5045 30.9053 59.2393 30.1319 58.4598Z"
            fill="url(#paint2_linear_1876_239)"
          />
        </G>
        <Path
          d="M54.6047 47.2007C54.0474 47.7662 53.149 47.7662 52.5918 47.2007L33.5664 27.8885C33.0091 27.3231 33.0091 26.4114 33.5664 25.846C34.1236 25.2805 35.022 25.2805 35.5792 25.846L54.6047 45.1524C55.1619 45.7236 55.1619 46.6353 54.6047 47.2007Z"
          fill="#FBDBAC"
        />
        <Path
          d="M41.4468 49.5858L41.0374 50.0012C40.5939 50.4513 39.8775 50.4513 39.434 50.0012L30.4899 40.925C30.0463 40.475 30.0463 39.748 30.4899 39.2979L30.8993 38.8825C31.3428 38.4324 32.0592 38.4324 32.5027 38.8825L41.4468 47.9587C41.8903 48.4087 41.8903 49.1357 41.4468 49.5858Z"
          fill="#FBDBAC"
        />
        <G filter="url(#filter3_d_1876_239)">
          <Path
            d="M0.0690427 87.5316L-0.607594 88.2182C-0.977186 88.5932 -1.57422 88.5932 -1.94381 88.2182L-7.17495 82.9098C-7.54455 82.5348 -7.54455 81.9289 -7.17495 81.5539L-6.49832 80.8672C-6.12873 80.4922 -5.53169 80.4922 -5.1621 80.8672L0.0690427 86.1756C0.438634 86.5507 0.438634 87.1565 0.0690427 87.5316Z"
            fill="url(#paint3_linear_1876_239)"
          />
        </G>
        <Path
          d="M19.5024 69.6482C19.5024 70.785 18.5809 71.7065 17.4441 71.7065C16.3073 71.7065 15.3857 70.785 15.3857 69.6482C15.3857 68.5114 16.3073 67.5898 17.4441 67.5898C18.5809 67.5898 19.5024 68.5114 19.5024 69.6482Z"
          fill="#FBDBAC"
        />
      </G>
      <Defs>
        <RadialGradient
          id="paint0_radial_1876_239"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(53 25.0005) rotate(126.314) scale(51.5024 42.8594)">
          <Stop offset={0.319611} stopColor="white" />
          <Stop offset={0.829082} stopColor="#FFF5D8" />
        </RadialGradient>
        <LinearGradient
          id="paint1_linear_1876_239"
          x1={33}
          y1={103.5}
          x2={26.6513}
          y2={27.8207}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.181735} stopColor="#FFF5D8" />
          <Stop offset={0.773951} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_1876_239"
          x1={9.5}
          y1={93.001}
          x2={18.4909}
          y2={34.4607}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE5BE" />
          <Stop offset={0.578125} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_1876_239"
          x1={-5.61528}
          y1={86.4402}
          x2={-0.469206}
          y2={85.0951}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF5D8" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1876_239">
          <Rect width={268.5} height={112} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const ConcertsFestivals = styled(ConcertsFestivalsSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
