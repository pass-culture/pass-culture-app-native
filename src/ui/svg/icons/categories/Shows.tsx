import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

export const Shows: React.FunctionComponent<AccessibleIcon> = ({ accessibilityLabel, testID }) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId1, fill: gradientFill1 } = svgIdentifier()
  const { id: clipPathId, fill: clipPath } = svgIdentifier()

  return (
    <AccessibleSvg
      width={156}
      height={92}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPath}>
        <G>
          <Path
            d="M38.7056 42.9072C36.1494 44.2477 33.0009 43.2777 31.6698 40.7395C30.3387 38.2013 31.331 35.0598 33.8871 33.7192L29.4702 25.297C28.8057 24.0298 27.2285 23.5439 25.9524 24.2132L-15.6865 46.05C-16.9627 46.7192 -17.4597 48.2929 -16.7952 49.5601L-12.3783 57.9824C-9.82209 56.6418 -6.67358 57.6118 -5.34248 60.15C-4.01139 62.6882 -5.00364 65.8297 -7.5598 67.1703L-3.14289 75.5925C-2.47835 76.8597 -0.901158 77.3456 0.374996 76.6764L42.0139 54.8395C43.29 54.1703 43.7871 52.5966 43.1225 51.3294L38.7056 42.9072Z"
            fill={gradientFill}
          />
        </G>
        <Rect
          x={18.001}
          y={37.1699}
          width={19.0204}
          height={2.61208}
          rx={1.30604}
          transform="rotate(62.326 18.001 37.1699)"
          fill="#FFB496"
        />
        <G>
          <Path
            d="M52.8945 59.2922C49.5547 60.2643 46.0622 58.3467 45.09 55.0069C44.1178 51.6671 46.0355 48.1746 49.3753 47.2024L46.1493 36.1201C45.664 34.4527 43.9145 33.4921 42.2471 33.9775L-12.1569 49.8139C-13.8243 50.2992 -14.7849 52.0487 -14.2995 53.7161L-11.0736 64.7984C-7.7338 63.8262 -4.24129 65.7439 -3.26911 69.0837C-2.29693 72.4235 -4.2146 75.916 -7.55439 76.8882L-4.32846 87.9705C-3.8431 89.6379 -2.0936 90.5985 -0.426217 90.1131L53.9778 74.2767C55.6451 73.7913 56.6058 72.0418 56.1204 70.3745L52.8945 59.2922Z"
            fill={gradientFill1}
          />
        </G>
        <Rect
          x={26.5752}
          y={48.377}
          width={23.0845}
          height={3.14789}
          rx={1.57395}
          transform="rotate(73.7703 26.5752 48.377)"
          fill="#FFB496"
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={-10.2549}
          y1={49.1003}
          x2={47.7489}
          y2={11.888}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.262858} stopColor="#FFDECC" />
          <Stop offset={0.9209} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id={gradientId1}
          x1={-20}
          y1={70.5}
          x2={35.5}
          y2={38}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDECC" />
          <Stop offset={0.9209} stopColor="white" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
