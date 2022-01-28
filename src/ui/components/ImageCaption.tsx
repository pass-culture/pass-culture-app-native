import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP, getSpacing } from 'ui/theme'

interface ImageCaptionProps {
  categoryLabel: string | null
  distance?: string
  height: number
  width: number
}

export const ImageCaption = ({ categoryLabel, height, width, distance }: ImageCaptionProps) => {
  return (
    <Row height={height} width={width}>
      <TextWrapper>
        <CategoryLabel numberOfLines={1} testID="categoryImageCaption">
          {categoryLabel}
        </CategoryLabel>
      </TextWrapper>
      {!!distance && (
        <React.Fragment>
          <Separator />
          <TextWrapper>
            <Distance testID="distanceImageCaption">{distance}</Distance>
          </TextWrapper>
        </React.Fragment>
      )}
    </Row>
  )
}

const CategoryLabel = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const Distance = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const textLineHeight = PixelRatio.roundToNearestPixel(GUTTER_DP)

const Row = styled.View<{ height: number; width: number }>(({ theme, height, width }) => ({
  flexDirection: 'row',
  backgroundColor: theme.colors.black,
  height,
  width,
  borderBottomLeftRadius: theme.borderRadius.radius,
  borderBottomRightRadius: theme.borderRadius.radius,
  alignItems: 'center',
}))

const Separator = styled.View(({ theme }) => ({
  height: textLineHeight,
  backgroundColor: theme.colors.white,
  width: 1,
}))

const TextWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  // So all categories are entirely visibles on homepage offer tiles
  paddingHorizontal: getSpacing(0.5),
  flex: 1,
})
