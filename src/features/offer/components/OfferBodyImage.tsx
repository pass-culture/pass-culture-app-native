import React, { FunctionComponent } from 'react'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'

type Props = {
  imageUrl: string
}

export const OfferBodyImage: FunctionComponent<Props> = ({ imageUrl }) => {
  const { imageStyle } = useOfferImageContainerDimensions()

  return (
    <StyledFastImage
      style={imageStyle}
      url={imageUrl}
      resizeMode={FastImage.resizeMode?.cover}
      testID="offerBodyImage"
    />
  )
}

const StyledFastImage = styled(ResizedFastImage)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  position: 'absolute',
  zIndex: 1,
}))
