import * as React from 'react'
import { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Squares: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
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
          width={24.732}
          height={24.732}
          x={112.177}
          y={27.877}
          fill={gradient1Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(-120.596 112.177 27.877)"
        />
        <Rect
          width={18.958}
          height={18.958}
          x={103.07}
          y={57.074}
          fill={gradient2Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(-137.917 103.07 57.074)"
        />
        <Rect
          width={38.72}
          height={38.72}
          x={128.086}
          y={65.739}
          fill={gradient3Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(-100.991 128.086 65.74)"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h160v96H0z" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1={124.543}
          x2={124.543}
          y1={27.877}
          y2={52.609}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0} stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1={112.55}
          x2={112.55}
          y1={57.074}
          y2={76.032}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0} stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1={147.447}
          x2={147.447}
          y1={65.739}
          y2={104.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0} stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
