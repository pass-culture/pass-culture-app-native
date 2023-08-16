import * as React from 'react'
import { ClipPath, Defs, G, LinearGradient, Rect, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Circles: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
  height,
  accessibilityLabel,
  testID,
  style,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier('clipPath')
  const { id: gradient1Id, fill: gradient1Fill } = svgIdentifier('gradient1')
  const { id: gradient2Id, fill: gradient2Fill } = svgIdentifier('gradient2')
  const { id: gradient3Id, fill: gradient3Fill } = svgIdentifier('gradient3')

  const width = typeof height === 'string' ? height : ((height as number) * 160) / 96
  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox="0 0 160 96"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}>
      <G clipPath={clipPath}>
        <Rect
          opacity="0.2"
          x="140.513"
          y="38.3853"
          width="45.1137"
          height="45.1137"
          rx="22.5569"
          transform="rotate(-162.142 140.513 38.3853)"
          fill={gradient1Fill}
        />
        <Rect
          opacity="0.2"
          x="155.374"
          y="56.0105"
          width="23.0024"
          height="23.0024"
          rx="11.5012"
          transform="rotate(-139.963 155.374 56.0105)"
          fill={gradient2Fill}
        />
        <Rect
          opacity="0.2"
          x="122.898"
          y="73.0261"
          width="16.7303"
          height="16.7303"
          rx="8.36517"
          transform="rotate(-116.569 122.898 73.0261)"
          fill={gradient3Fill}
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Rect width="160" height="96" fill="white" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1="163.07"
          y1="38.3853"
          x2="163.07"
          y2="83.499"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset="0.728846" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1="166.875"
          y1="56.0105"
          x2="166.875"
          y2="79.0129"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1="131.263"
          y1="73.0261"
          x2="131.263"
          y2="89.7565"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
