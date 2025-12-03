// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage, { OnLoadEvent } from '@d11/react-native-fast-image'
import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components/native'

import { OfferImageContainerDimensions } from 'features/offer/types'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'

type Props = {
  imageUrl: string
  imageDimensions: OfferImageContainerDimensions
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}

export const OfferBodyImage: FunctionComponent<Props> = ({
  imageUrl,
  imageDimensions,
  isInCarousel,
  onLoad,
}) => {
  const imageStyle = useMemo(
    () =>
      isInCarousel
        ? { ...imageDimensions.imageStyle, borderRadius: 0 }
        : imageDimensions.imageStyle,
    [isInCarousel, imageDimensions]
  )

  return (
    <StyledFastImage
      style={imageStyle}
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
