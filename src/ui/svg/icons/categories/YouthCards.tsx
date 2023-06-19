import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

export const YouthCards: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={156}
      height={92}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath="url(#clip0_1981_1383)">
        <G filter="url(#filter0_d_1981_1383)">
          <Path
            d="M55.0526 55.1367L-0.220572 82.1703C-2.56551 83.3196 -5.39865 82.3398 -6.53667 79.9772L-21.3416 49.3808C-22.4841 47.0253 -21.5074 44.178 -19.1555 43.0332L36.1132 16.0068C38.4582 14.8574 41.2913 15.8372 42.4293 18.1999L57.233 48.7904C58.3755 51.146 57.3976 53.9874 55.0526 55.1367Z"
            fill="url(#paint0_linear_1981_1383)"
          />
        </G>
        <Path
          d="M-19.7288 52.6948L44.0291 21.5285L45.6036 24.7833L-18.1543 55.9495L-19.7288 52.6948Z"
          fill="#D0BCFD"
        />
        <G filter="url(#filter1_d_1981_1383)">
          <Path
            d="M63.9327 74.885L3.92794 88.0903C1.37774 88.6515 -1.14162 87.0283 -1.70191 84.4629L-8.96539 51.2057C-9.52568 48.6403 -7.91395 46.1079 -5.36374 45.5467L54.641 32.3414C57.1912 31.7802 59.7105 33.4035 60.2708 35.9689L67.5356 69.2318C68.0946 71.7914 66.4829 74.3238 63.9327 74.885Z"
            fill="url(#paint1_linear_1981_1383)"
          />
        </G>
        <Path
          d="M61.0624 39.5952L-8.17383 54.832L-7.40058 58.3725L61.8356 43.1356L61.0624 39.5952Z"
          fill="#D0BCFD"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1981_1383"
          x1={68}
          y1={-8}
          x2={9.64305}
          y2={49.1461}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#EAE3FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1981_1383"
          x1={-21}
          y1={96.999}
          x2={68.8529}
          y2={37.6507}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#EAE3FF" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1981_1383">
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
