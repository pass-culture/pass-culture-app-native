import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const BooksMediaPressSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      <G clipPath="url(#clip0_1909_586)">
        <G filter="url(#filter0_d_1909_586)">
          <Path
            d="M42.0404 90.3991L-0.465391 81.6231L-3.57964 77.3808L8.91945 24.0393C9.19246 22.7169 10.6004 21.8868 12.0654 22.1892L54.3221 30.9138C55.7871 31.2163 56.7511 32.5362 56.4781 33.8585L45.1864 88.5491C44.9123 89.8765 43.5054 90.7016 42.0404 90.3991Z"
            fill="url(#paint0_linear_1909_586)"
          />
        </G>
        <Path
          d="M40.2446 88.7072L-0.173235 80.3623L-1.39528 78.6313L11.7156 22.7797L53.526 31.3753L54.7481 33.1063L43.6981 86.626C43.3878 88.1037 41.8442 89.0375 40.2446 88.7072Z"
          fill="#FF98BD"
        />
        <G filter="url(#filter1_d_1909_586)">
          <Path
            d="M39.355 87.0493L-1.98968 78.5131C-3.35006 78.2322 -4.21605 76.8905 -3.93261 75.5176L7.22259 21.4882C7.50603 20.1154 8.83759 19.2274 10.193 19.5072L51.5377 28.0435C52.8981 28.3243 53.7641 29.6661 53.4806 31.0389L42.3265 85.0633C42.047 86.4422 40.7154 87.3302 39.355 87.0493Z"
            fill="url(#paint1_linear_1909_586)"
          />
        </G>
        <Path
          opacity={0.6}
          d="M2.16026 77.8907L1.99084 77.8557C1.64202 77.7837 1.4268 77.3918 1.5113 76.9825L13.1777 20.4769C13.2622 20.0677 13.6151 19.793 13.9639 19.865L14.1333 19.9C14.4821 19.972 14.6974 20.364 14.6129 20.7733L2.94522 77.2846C2.86193 77.6881 2.50908 77.9627 2.16026 77.8907Z"
          fill="#FF98BD"
        />
        <Path
          d="M40.2429 43.1131L20.2059 38.9762C19.9069 38.9145 19.7138 38.6167 19.7763 38.3139L20.2849 35.8509C20.3474 35.5481 20.6426 35.3512 20.9416 35.4129L40.9836 39.5509C41.2826 39.6126 41.4757 39.9104 41.4132 40.2132L40.9057 42.6711C40.8421 42.979 40.5469 43.1759 40.2429 43.1131Z"
          fill="#FF98BD"
        />
        <Path
          d="M30.2149 47.6211L18.7737 45.2588C18.5445 45.2115 18.3986 44.9867 18.4466 44.7545L19.0082 42.0341C19.0562 41.802 19.2791 41.6533 19.5083 41.7006L30.9495 44.0628C31.1787 44.1102 31.3245 44.335 31.2766 44.5671L30.7149 47.2875C30.6681 47.5147 30.4441 47.6684 30.2149 47.6211Z"
          fill="#FF98BD"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1909_586"
          x1={19.434}
          y1={63.3603}
          x2={59.7232}
          y2={26.91}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD7E9" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1909_586"
          x1={-18.9995}
          y1={76.1733}
          x2={51.4691}
          y2={36.5058}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD7E9" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1909_586">
          <Rect width={268.5} height={112} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const BooksMediaPress = styled(BooksMediaPressSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
