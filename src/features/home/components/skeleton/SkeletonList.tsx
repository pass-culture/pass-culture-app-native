import React from 'react'
import { PixelRatio, View } from 'react-native'
import styled from 'styled-components/native'

import { SkeletonTile } from 'features/home/components/skeleton/SkeletonTile'
import { Spacer, getSpacing } from 'ui/theme'
import { MARGIN_DP } from 'ui/theme/grid'

interface DimensionProps {
  height: number
  width: number
}

export const SkeletonList: React.FC<DimensionProps> = ({ width, height }) => (
  <Row>
    {new Array(5).fill(null).map((_, index) => (
      <React.Fragment key={`placeholder-${index}`}>
        <View>
          <SkeletonTile width={width} height={height + rowHeight} />
          <Spacer.Column numberOfSpaces={3} />
          <SkeletonTile width={0.5 * width} height={captionHeight} />
          <Spacer.Column numberOfSpaces={1} />
          <SkeletonTile width={0.8 * width} height={captionHeight} />
          <Spacer.Column numberOfSpaces={1} />
          <SkeletonTile width={0.3 * width} height={captionHeight} />
        </View>
        <Spacer.Row numberOfSpaces={4} />
      </React.Fragment>
    ))}
  </Row>
)

const rowHeight = PixelRatio.roundToNearestPixel(MARGIN_DP)
const captionHeight = getSpacing(3)
const Row = styled.View({ flexDirection: 'row' })
