import * as React from 'react'
import { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Pills: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
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
          width={30.743}
          height={60.84}
          x={107.536}
          y={33.098}
          fill={gradient1Fill}
          opacity={0.2}
          rx={15.372}
          transform="rotate(-108.07 107.536 33.098)"
        />
        <Rect
          width={11.989}
          height={28.518}
          x={114.494}
          y={57.184}
          fill={gradient2Fill}
          opacity={0.2}
          rx={5.994}
          transform="rotate(-128.687 114.494 57.184)"
        />
        <Rect
          width={14.414}
          height={41.773}
          x={160.878}
          y={66.114}
          fill={gradient3Fill}
          opacity={0.2}
          rx={7.207}
          transform="rotate(-164.328 160.878 66.114)"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h160v96H0z" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1={122.908}
          x2={122.908}
          y1={33.098}
          y2={93.938}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1={120.488}
          x2={120.488}
          y1={57.184}
          y2={85.702}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1={168.086}
          x2={168.086}
          y1={66.114}
          y2={107.887}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
