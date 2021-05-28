import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { ArrowNextDouble } from 'ui/svg/icons/ArrowNextDouble'
import { RATIO_ALGOLIA, MARGIN_DP, ColorsEnum, getSpacing } from 'ui/theme'
import { BorderRadiusEnum, getAlgoliaDimensions } from 'ui/theme/grid'

interface CoverProps {
  layout: Layout
  uri: string
}

export const Cover = ({ layout, uri }: CoverProps) => {
  const { height } = getAlgoliaDimensions(layout)
  const imageHeight = MARGIN_DP + height
  const imageWidth = PixelRatio.roundToNearestPixel(imageHeight * RATIO_ALGOLIA)

  return (
    <Container imageHeight={imageHeight} imageWidth={imageWidth}>
      <Image source={{ uri }} testID="coverImage" />
      <ArrowsContainer>
        <ArrowMarginContainer>
          <ArrowNextDouble color={ColorsEnum.WHITE} size={56} />
        </ArrowMarginContainer>
      </ArrowsContainer>
    </Container>
  )
}

const Container = styled.View<{ imageWidth: number; imageHeight: number }>(
  ({ imageWidth, imageHeight }) => ({
    height: imageHeight,
    width: imageWidth,
    alignItems: 'flex-end',
    justifyContent: 'center',
  })
)

const Image = styled.Image({
  height: '100%',
  width: '100%',
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
})

const ArrowsContainer = styled.View({
  position: 'absolute',
  zIndex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const ArrowMarginContainer = styled.View({
  marginRight: getSpacing(-6),
  marginTop: getSpacing(7),
})
