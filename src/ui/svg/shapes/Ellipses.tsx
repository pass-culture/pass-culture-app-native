import * as React from 'react'
import { ClipPath, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Ellipses: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
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
        <Ellipse
          cx={114.186}
          cy={39.997}
          fill={gradient1Fill}
          opacity={0.2}
          rx={20.577}
          ry={10.01}
          transform="rotate(-11.768 114.186 39.997)"
        />
        <Ellipse
          cx={136.221}
          cy={9}
          fill={gradient2Fill}
          opacity={0.2}
          rx={28.106}
          ry={16.331}
          transform="rotate(-137.668 136.221 9)"
        />
        <Ellipse
          cx={140.266}
          cy={53.8}
          fill={gradient3Fill}
          opacity={0.2}
          rx={9.304}
          ry={5.498}
          transform="rotate(-61.556 140.266 53.8)"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h160v96H0z" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1={108.644}
          x2={133.505}
          y1={46.145}
          y2={24.163}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1={136.221}
          x2={136.221}
          y1={-7.331}
          y2={25.331}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1={140.266}
          x2={140.266}
          y1={48.302}
          y2={59.297}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
