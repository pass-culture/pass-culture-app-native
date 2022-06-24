import * as React from 'react'
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIconInterface } from './types'

const BicolorEmailSentSvg: React.FC<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 141 109"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.5002 37.4204C53.2107 34.466 55.2354 32.0199 57.804 31.7617L92.7311 28.2517C93.6167 28.1627 94.2649 27.3776 94.1787 26.4981C94.0925 25.6187 93.3047 24.9779 92.419 25.0669L57.492 28.577C52.9725 29.0312 49.8491 33.2131 50.293 37.7428L50.3544 38.3694L17.4573 41.6755C16.6475 41.7569 16.055 42.4747 16.1337 43.2787C16.2125 44.0828 16.9328 44.6686 17.7426 44.5873L50.6397 41.2812L54.2716 78.3482C54.7154 82.8778 58.5894 86.3565 63.1088 85.9023L117.632 80.4228C122.152 79.9686 125.275 75.7868 124.831 71.2571L120.973 31.8774C120.971 31.8558 120.969 31.8342 120.966 31.8126L120.853 30.6517C120.409 26.122 116.535 22.6433 112.015 23.0975L105.344 23.768C104.459 23.857 103.811 24.642 103.897 25.5215C103.983 26.4009 104.771 27.0417 105.656 26.9527L112.327 26.2823C114.896 26.0241 117.356 28.0195 117.645 30.974L117.688 31.4086L91.8501 56.7586L91.8465 56.7621C89.6873 58.8937 86.3155 59.2325 83.7848 57.5723L59.9595 42.0342C59.2169 41.5499 58.2175 41.7568 57.7271 42.4963C57.2367 43.2358 57.4411 44.2279 58.1837 44.7121L75.3159 55.8852L57.5796 78.6732C57.5344 78.4632 57.5005 78.2472 57.4788 78.0259L53.5002 37.4204ZM59.3449 81.6286L78.0127 57.6439L82.0017 60.2455L82.0036 60.2467C85.8062 62.7401 90.8673 62.2314 94.112 59.0298L94.1136 59.0283L97.5291 55.6772L106.426 63.3559C107.096 63.9345 108.114 63.8619 108.699 63.1937C109.284 62.5255 109.215 61.5147 108.545 60.9361L99.8329 53.4169L118.089 35.5051L121.624 71.5794C121.646 71.8006 121.654 72.0189 121.651 72.2337L113.213 64.9533C112.543 64.3748 111.525 64.4475 110.94 65.1158C110.355 65.7841 110.424 66.7949 111.095 67.3734L120.494 75.4833C119.705 76.4611 118.578 77.1117 117.32 77.2381L62.7968 82.7176C61.5395 82.8439 60.3083 82.4303 59.3449 81.6286Z"
        fill={gradientFill}
      />
      <Path
        d="M25.329 57.7919C24.5192 57.8733 23.9267 58.5911 24.0055 59.3951C24.0842 60.1992 24.8045 60.785 25.6143 60.7037L44.6746 58.7881C45.4843 58.7068 46.0769 57.989 45.9981 57.1849C45.9193 56.3809 45.199 55.795 44.3893 55.8764L25.329 57.7919Z"
        fill={gradientFill}
      />
      <Path
        d="M32.1367 74.3828C31.327 74.4642 30.7344 75.1819 30.8132 75.986C30.892 76.7901 31.6123 77.3759 32.422 77.2945L50.7492 75.4527C51.559 75.3713 52.1516 74.6535 52.0728 73.8495C51.994 73.0454 51.2737 72.4596 50.4639 72.5409L32.1367 74.3828Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="16.1267%"
          x2="23.0576%"
          y1="31.0569%"
          y2="94.2178%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color2} />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
        <LinearGradient
          id={gradientId}
          x1="16.1267%"
          x2="23.0576%"
          y1="31.0569%"
          y2="94.2178%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color2} />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
        <LinearGradient
          id={gradientId}
          x1="16.1267%"
          x2="23.0576%"
          y1="31.0569%"
          y2="94.2178%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color2} />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const BicolorEmailSent = styled(BicolorEmailSentSvg).attrs(
  ({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.illustrations.sizes.medium,
  })
)``
