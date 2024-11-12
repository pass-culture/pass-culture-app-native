import React, { FunctionComponent } from 'react'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage, { OnLoadEvent } from 'react-native-fast-image'
import styled from 'styled-components/native'

import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'

type Props = {
  imageUrl: string
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}

export const OfferBodyImage: FunctionComponent<Props> = ({ imageUrl, isInCarousel, onLoad }) => {
  const { imageStyle, imageStyleWithoutBorderRadius } = useOfferImageContainerDimensions()

  return (
    <StyledFastImage
      style={isInCarousel ? imageStyleWithoutBorderRadius : imageStyle}
      url={imageUrl}
      resizeMode={FastImage.resizeMode?.cover}
      testID="offerBodyImage"
      onLoad={onLoad}
    />
  )
}

const StyledFastImage = styled(ResizedFastImage)({
  backgroundColor: 'transparent',
  position: 'absolute',
  zIndex: 1,
})
