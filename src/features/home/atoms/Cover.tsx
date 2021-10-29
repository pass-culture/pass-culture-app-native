import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { ArrowNextDouble } from 'ui/svg/icons/ArrowNextDouble'
import { LENGTH_M, LENGTH_L, RATIO_HOME_IMAGE, MARGIN_DP, ColorsEnum, getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { ZIndex } from 'ui/theme/layers'

interface CoverProps {
  layout: Layout
  uri: string
}

export const Cover = ({ layout, uri }: CoverProps) => {
  const imageHeight = MARGIN_DP + (layout === 'two-items' ? LENGTH_M : LENGTH_L)
  const imageWidth = PixelRatio.roundToNearestPixel(imageHeight * RATIO_HOME_IMAGE)

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
  zIndex: ZIndex.HOME_OFFER_COVER_ICONS,
  flexDirection: 'row',
  alignItems: 'center',
})

const ArrowMarginContainer = styled.View({
  marginRight: getSpacing(-6),
  marginTop: getSpacing(7),
})
