import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

export const MediaPress: React.FunctionComponent<AccessibleIcon> = ({
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
      <G clipPath="url(#clip0_1981_1391)">
        <G filter="url(#filter0_d_1981_1391)">
          <Path
            d="M50.28 78.528L14.0057 86.7652C11.3629 87.3653 8.66992 85.4189 7.98795 82.4157L-2.68294 35.424L-1.27685 28.2474L35.905 18.9162C36.3435 18.8167 36.7948 19.1429 36.908 19.6411L41.0224 37.7602L46.2045 36.5834C47.0854 36.3834 47.9831 37.0322 48.2104 38.0333L56.1308 72.9124C56.642 75.1637 55.4501 77.354 53.469 77.8038L50.28 78.528Z"
            fill="url(#paint0_linear_1981_1391)"
          />
        </G>
        <G filter="url(#filter1_d_1981_1391)">
          <Path
            d="M53.9918 77.9397C52.1066 78.3678 50.181 76.9799 49.6958 74.8433L41.2646 37.7148L46.4902 36.5282C47.3786 36.3265 48.2833 36.9786 48.5119 37.9854L56.5293 73.2916C57.0144 75.4282 55.8771 77.5116 53.9918 77.9397Z"
            fill="url(#paint1_linear_1981_1391)"
          />
        </G>
        <Rect
          x={2.05078}
          y={43.0254}
          width={28.1666}
          height={3.50372}
          rx={1}
          transform="rotate(-12.7938 2.05078 43.0254)"
          fill="#FF98BD"
        />
        <Rect
          x={3.63086}
          y={49.9805}
          width={20.5394}
          height={3.50372}
          rx={1}
          transform="rotate(-12.7938 3.63086 49.9805)"
          fill="#FF98BD"
        />
        <Rect
          x={5.29395}
          y={57.3066}
          width={25.7065}
          height={3.50372}
          rx={1}
          transform="rotate(-12.7938 5.29395 57.3066)"
          fill="#FF98BD"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1981_1391"
          x1={9.31638}
          y1={88.1111}
          x2={36.6119}
          y2={38.0608}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD7E9" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1981_1391"
          x1={51.7556}
          y1={40.054}
          x2={36.0318}
          y2={50.4784}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#FFD7E9" />
        </LinearGradient>
        <ClipPath id="clip0_1981_1391">
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
