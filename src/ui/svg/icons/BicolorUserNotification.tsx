import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BicolorUserNotificationSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId1, fill: gradientFill1 } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()
  const { id: gradientId3, fill: gradientFill3 } = svgIdentifier()
  const { id: gradientId4, fill: gradientFill4 } = svgIdentifier()
  const { id: gradientId5, fill: gradientFill5 } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient
          id={gradientId1}
          x1="64.1602"
          y1="19.25"
          x2="90.2046"
          y2="73.2729"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1="41.3662"
          y1="81.76"
          x2="56.8234"
          y2="142.635"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
        <LinearGradient
          id={gradientId3}
          x1="117.774"
          y1="69.4137"
          x2="124.058"
          y2="87.4671"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
        <LinearGradient
          id={gradientId4}
          x1="108.012"
          y1="77.6669"
          x2="125.983"
          y2="129.244"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
        <LinearGradient
          id={gradientId5}
          x1="118.35"
          y1="118.16"
          x2="123.042"
          y2="134.05"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        d="M85.2202 75.75C73.6102 75.75 64.1602 66.3 64.1602 54.69V40.31C64.1602 28.7 73.6102 19.25 85.2202 19.25C96.8302 19.25 106.28 28.7 106.28 40.31V54.69C106.28 66.3 96.8302 75.75 85.2202 75.75ZM85.2202 24.25C76.3602 24.25 69.1602 31.46 69.1602 40.31V54.69C69.1602 63.55 76.3702 70.75 85.2202 70.75C94.0702 70.75 101.28 63.54 101.28 54.69V40.31C101.28 31.45 94.0702 24.25 85.2202 24.25Z"
        fill={gradientFill1}
      />
      <Path
        d="M85.2203 136.75C66.3403 136.75 49.2703 128.89 41.7403 116.73C41.3703 116.13 41.2703 115.4 41.4603 114.73C47.0103 95.32 65.0003 81.76 85.2103 81.76C92.5003 81.76 99.7603 83.53 106.19 86.87C107.41 87.51 107.89 89.02 107.25 90.24C106.61 91.46 105.1 91.94 103.88 91.3C98.0803 88.28 91.8003 86.75 85.2103 86.75C67.5903 86.75 51.8703 98.32 46.5903 115.02C53.5203 125.22 68.5203 131.75 85.2103 131.75C89.2503 131.75 93.2603 131.36 97.1103 130.6C103.94 129.25 110.23 126.72 115.3 123.29C116.44 122.52 118 122.81 118.77 123.96C119.54 125.11 119.25 126.66 118.1 127.43C112.48 131.24 105.56 134.03 98.0803 135.51C93.9103 136.33 89.5803 136.75 85.2103 136.75H85.2203Z"
        fill={gradientFill2}
      />
      <Path
        d="M119.331 86.5899L117.921 79.1899C117.071 74.7299 120.011 70.4099 124.471 69.5599C128.931 68.7099 133.251 71.6499 134.101 76.1099L135.511 83.5099L131.941 82.8799C130.311 82.5899 128.651 82.5999 127.021 82.9099C125.381 83.2199 123.841 83.8199 122.431 84.6899L119.341 86.5899H119.331ZM126.011 74.4099C125.811 74.4099 125.611 74.4299 125.401 74.4699C123.651 74.7999 122.501 76.4999 122.831 78.2499L122.951 78.8699C123.961 78.4899 125.001 78.1899 126.071 77.9899C127.141 77.7899 128.221 77.6799 129.301 77.6599L129.181 77.0399C128.891 75.4899 127.531 74.4099 126.011 74.4099Z"
        fill={gradientFill3}
      />
      <Path
        d="M115.3 126.75C111.87 126.75 108.81 124.31 108.14 120.82C107.41 116.97 109.86 113.24 113.63 112.36L111.24 99.8099C110.28 94.7499 111.4 89.6599 114.39 85.4699C117.38 81.2799 121.85 78.5699 126.96 77.8499C136.82 76.4499 146.06 83.2199 147.98 93.2799L150.29 105.38C152.1 105.11 153.92 105.53 155.45 106.56C157.06 107.65 158.15 109.31 158.51 111.22C159.26 115.17 156.66 118.99 152.71 119.75L116.67 126.62C116.21 126.71 115.75 126.75 115.3 126.75ZM129.54 82.6599C128.92 82.6599 128.29 82.6999 127.66 82.7899C123.91 83.3199 120.64 85.2999 118.45 88.3699C116.26 91.4399 115.44 95.1699 116.14 98.8699L118.59 111.72C119.07 114.26 117.4 116.72 114.86 117.2C113.62 117.44 112.8 118.64 113.04 119.88C113.28 121.12 114.47 121.94 115.72 121.7L151.76 114.83C153 114.59 153.82 113.39 153.58 112.15C153.47 111.55 153.12 111.03 152.62 110.69C152.12 110.35 151.51 110.22 150.9 110.33C148.36 110.81 145.9 109.14 145.42 106.6L143.06 94.1999C141.77 87.4199 136.02 82.6499 129.53 82.6499L129.54 82.6599Z"
        fill={gradientFill4}
      />
      <Path
        d="M127.24 132.82C125.47 132.82 123.74 132.29 122.24 131.27C120.27 129.93 118.94 127.9 118.49 125.56C118.34 124.78 118.31 123.95 118.4 123.03L118.58 121.16L134.33 118.16L135.18 119.83C135.6 120.65 135.88 121.43 136.03 122.22C136.48 124.56 135.99 126.94 134.64 128.91C133.3 130.88 131.27 132.21 128.93 132.66C128.37 132.77 127.8 132.82 127.24 132.82ZM123.59 125.3C123.87 126.04 124.38 126.68 125.05 127.14C125.92 127.73 126.97 127.95 127.99 127.75C129.02 127.55 129.91 126.97 130.5 126.1C130.96 125.43 131.19 124.65 131.18 123.85L123.58 125.3H123.59Z"
        fill={gradientFill5}
      />
    </AccessibleSvg>
  )
}

export const BicolorUserNotification = styled(BicolorUserNotificationSvg).attrs(
  ({ size, theme }) => ({
    size: size ?? theme.illustrations.sizes.medium,
  })
)``
