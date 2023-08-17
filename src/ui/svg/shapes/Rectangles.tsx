import * as React from 'react'
import { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Rectangles: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
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
          width={12.806}
          height={36.084}
          x={122.452}
          y={23.875}
          fill={gradient1Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(159.851 122.452 23.875)"
        />
        <Rect
          width={53.852}
          height={26.316}
          x={170.073}
          y={69.804}
          fill={gradient2Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(-166.47 170.073 69.804)"
        />
        <Rect
          width={40.637}
          height={20.323}
          x={131}
          y={14.871}
          fill={gradient3Fill}
          opacity={0.2}
          rx={2}
          transform="rotate(-37.736 131 14.87)"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h160v96H0z" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1={128.855}
          x2={128.855}
          y1={23.875}
          y2={59.959}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1={227.039}
          x2={172.266}
          y1={76.31}
          y2={89.174}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1={130.14}
          x2={167.693}
          y1={24.058}
          y2={37.499}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
