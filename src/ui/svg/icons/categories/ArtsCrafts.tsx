import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleRectangleIcon } from '../types'

export const ArtsCrafts: React.FunctionComponent<AccessibleRectangleIcon> = ({
  accessibilityLabel,
  testID,
  width = 156,
  height = 92,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: clipPathId, fill: clipPath } = svgIdentifier()

  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPath}>
        <G>
          <Path
            d="M35.3787 70.906C35.58 73.4985 33.1801 75.7238 30.0187 75.8701C26.8574 76.0163 24.133 74.0288 23.9317 71.4363C23.7303 68.8438 26.1303 66.6185 29.2916 66.4722C32.4476 66.3274 35.1759 68.3082 35.3787 70.906Z"
            fill="#AD87FF"
          />
        </G>
        <Path
          d="M22.969 18.9856C1.93155 24.5004 -11.5904 42.4391 -7.23519 59.053C-2.87996 75.6668 17.7034 84.6649 38.7408 79.1501C39.2256 79.023 39.7037 78.892 40.179 78.7505C43.0442 77.9092 44.8077 74.8411 44.2284 71.6539C44.1904 71.4439 44.1577 71.2325 44.1251 71.0211C43.1212 64.0421 46.7117 57.2802 52.7436 54.836C55.8413 53.5783 59.0653 53.5623 61.9964 54.5142C65.3747 55.6083 68.8033 53.3108 69.4078 49.6441C69.9831 46.1486 69.8637 42.587 68.945 39.0827C64.5898 22.4689 44.0065 13.4707 22.969 18.9856ZM36.0287 69.043C36.23 71.6355 33.8301 73.8609 30.6687 74.0071C27.5074 74.1534 24.783 72.1659 24.5817 69.5734C24.3803 66.9809 26.7803 64.7555 29.9416 64.6093C33.103 64.463 35.8259 66.4453 36.0287 69.043Z"
          fill={gradientFill}
        />
        <Path
          d="M54.4713 30.5655C54.546 31.8714 53.3074 33.64 51.4701 33.755C49.6328 33.8701 48.8055 32.7558 48.7308 31.45C48.6561 30.1441 47.7926 28.0015 49.6299 27.8865C51.4605 27.7676 54.3966 29.2597 54.4713 30.5655Z"
          fill="#D0BCFD"
        />
        <Path
          d="M18.9758 32.9434C20.4518 34.9253 20.9679 38.7834 16.4513 39.0593C13.2904 39.2505 11.3353 42.5212 9.8592 40.5392C8.38315 38.5572 9.00265 34.4917 11.5514 32.6166C14.1001 30.7415 17.4997 30.9614 18.9758 32.9434Z"
          fill="#D0BCFD"
        />
        <Path
          d="M29.7627 24.7688C30.9909 23.3075 33.3533 23.6753 34.8239 25.5064C36.3364 27.3885 38.3517 27.1705 37.1235 28.6318C35.8953 30.093 32.713 31.8748 30.8458 30.3338C28.98 28.7981 28.536 26.2354 29.7627 24.7688Z"
          fill="#D0BCFD"
        />
        <Path
          d="M5.01877 55.7602C6.44699 58.0593 10.2665 60.6902 7.47606 62.4031C4.68559 64.116 0.167219 62.5587 -1.261 60.2596C-2.68922 57.9605 -2.60933 52.7054 0.181135 50.9925C2.9716 49.2796 3.59055 53.4611 5.01877 55.7602Z"
          fill="#D0BCFD"
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={-21.499}
          y1={116.5}
          x2={49.1465}
          y2={35.6906}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.158429} stopColor="#EAE3FF" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
