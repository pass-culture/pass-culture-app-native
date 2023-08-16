import React, { FunctionComponent } from 'react'

import { Color } from 'features/home/types'
import { AccessibleRectangleIconInterface } from 'ui/svg/icons/types'
import { Circles } from 'ui/svg/shapes/Circles'
import { Ellipses } from 'ui/svg/shapes/Ellipses'
import { Pills } from 'ui/svg/shapes/Pills'
import { Rectangles } from 'ui/svg/shapes/Rectangles'
import { Squares } from 'ui/svg/shapes/Squares'
import { Triangles } from 'ui/svg/shapes/Triangles'

const colorToShapeMapping: Record<Color, FunctionComponent<AccessibleRectangleIconInterface>> = {
  [Color.Gold]: Pills,
  [Color.Aquamarine]: Squares,
  [Color.SkyBlue]: Rectangles,
  [Color.DeepPink]: Circles,
  [Color.Coral]: Ellipses,
  [Color.Lilac]: Triangles,
}

interface Props extends Omit<AccessibleRectangleIconInterface, 'color'> {
  color: Color
}

export const Shape = ({ color, ...props }: Props) => {
  const ShapeIcon = colorToShapeMapping[color]
  return <ShapeIcon {...props} />
}
