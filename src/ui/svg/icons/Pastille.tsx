import * as React from 'react'
import { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleRectangleIcon } from './types'

export const Pastille: React.FunctionComponent<AccessibleRectangleIcon> = ({
  height = 15,
  width = 21,
  color,
  accessibilityLabel,
  testID,
  style,
}) => {
  const getRx = () => {
    if (typeof width === 'number') {
      return width === height ? width * 0.5 : width / 3
    }
    return 7
  }

  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const fill = color || gradientFill
  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={style}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="-41.961%" x2="126.229%" y1="-1.762%" y2="116.717%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
      </Defs>
      <Rect fill={fill} fillRule="evenodd" width={width} height={height} x={0} y={0} rx={getRx()} />
    </AccessibleSvg>
  )
}
