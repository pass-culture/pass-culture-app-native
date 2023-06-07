import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const ShowsSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      <G clipPath="url(#clip0_1909_696)">
        <G filter="url(#filter0_d_1909_696)">
          <Path
            d="M39.2056 42.9072C36.6494 44.2477 33.5009 43.2777 32.1698 40.7395C30.8387 38.2013 31.831 35.0598 34.3871 33.7192L29.9702 25.297C29.3057 24.0298 27.7285 23.5439 26.4524 24.2132L-15.1865 46.05C-16.4627 46.7192 -16.9597 48.2929 -16.2952 49.5601L-11.8783 57.9824C-9.32209 56.6418 -6.17358 57.6118 -4.84248 60.15C-3.51139 62.6882 -4.50364 65.8297 -7.0598 67.1703L-2.64289 75.5925C-1.97835 76.8597 -0.401158 77.3456 0.874996 76.6764L42.5139 54.8395C43.79 54.1703 44.2871 52.5966 43.6225 51.3294L39.2056 42.9072Z"
            fill="url(#paint0_linear_1909_696)"
          />
        </G>
        <Rect
          x={18.501}
          y={37.1699}
          width={19.0204}
          height={2.61208}
          rx={1.30604}
          transform="rotate(62.326 18.501 37.1699)"
          fill="#FFB496"
        />
        <G filter="url(#filter1_d_1909_696)">
          <Path
            d="M53.3945 59.2922C50.0547 60.2643 46.5622 58.3467 45.59 55.0069C44.6178 51.6671 46.5355 48.1746 49.8753 47.2024L46.6493 36.1201C46.164 34.4527 44.4145 33.4921 42.7471 33.9775L-11.6569 49.8139C-13.3243 50.2992 -14.2849 52.0487 -13.7995 53.7161L-10.5736 64.7984C-7.2338 63.8262 -3.74129 65.7439 -2.76911 69.0837C-1.79693 72.4235 -3.7146 75.916 -7.05439 76.8882L-3.82846 87.9705C-3.3431 89.6379 -1.5936 90.5985 0.0737828 90.1131L54.4778 74.2767C56.1451 73.7913 57.1058 72.0418 56.6204 70.3745L53.3945 59.2922Z"
            fill="url(#paint1_linear_1909_696)"
          />
        </G>
        <Rect
          x={27.0752}
          y={48.377}
          width={23.0845}
          height={3.14789}
          rx={1.57395}
          transform="rotate(73.7703 27.0752 48.377)"
          fill="#FFB496"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1909_696"
          x1={-9.75488}
          y1={49.1003}
          x2={48.2489}
          y2={11.888}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.262858} stopColor="#FFDECC" />
          <Stop offset={0.9209} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1909_696"
          x1={-19.5}
          y1={70.5}
          x2={36}
          y2={38}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDECC" />
          <Stop offset={0.9209} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1909_696">
          <Rect width={268.5} height={112} fill="white" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const Shows = styled(ShowsSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
