import * as React from 'react'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { svgIdentifier } from 'ui/svg/utils'

import { RectangleIconInterface } from './types'

export const Pastille: React.FunctionComponent<RectangleIconInterface> = ({
  height = 15,
  width = 21,
  color,
  testID,
  style,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const fill = color || gradientFill
  const rx = typeof width === 'number' ? width / 3 : 7
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={style}
      testID={testID}
      aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="-41.961%" x2="126.229%" y1="-1.762%" y2="116.717%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
      </Defs>
      <Rect fill={fill} fillRule="evenodd" width={width} height={height} x={0} y={0} rx={rx} />
    </Svg>
  )
}
