import * as React from 'react'
import { ClipPath, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const Triangles: React.FunctionComponent<AccessibleRectangleIconInterface> = ({
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
        <Path
          fill={gradient1Fill}
          d="M116.996-20.73c-.067-1.543 1.566-2.577 2.932-1.856l62.95 33.24c1.359.719 1.434 2.637.136 3.46L123.16 51.992c-1.299.822-3.001-.068-3.068-1.603l-3.096-71.12Z"
          opacity={0.2}
        />
        <Path
          fill={gradient2Fill}
          d="M88.465 29.8c-1.524-.255-2.195-2.068-1.205-3.254l10.258-12.288c.985-1.18 2.878-.853 3.411.588l5.528 14.937c.534 1.442-.69 2.921-2.206 2.667L88.464 29.8Z"
          opacity={0.2}
        />
        <Path
          fill={gradient3Fill}
          d="M154.455 37.862c.678-1.388 2.606-1.516 3.462-.23l12.877 19.361c.851 1.28 0 3.002-1.533 3.103l-23.086 1.53c-1.534.102-2.604-1.492-1.929-2.873l10.209-20.891Z"
          opacity={0.2}
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h160v96H0z" />
        </ClipPath>
        <LinearGradient
          id={gradient1Id}
          x1={105.438}
          x2={151.566}
          y1={38.548}
          y2={25.732}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient2Id}
          x1={85.025}
          x2={103.693}
          y1={29.223}
          y2={22.315}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id={gradient3Id}
          x1={155.986}
          x2={164.08}
          y1={34.728}
          y2={71.86}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}
