import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  alt: string
  image: string
  offerId: string
}

export const ExclusivityModule = (props: Props) => {
  const { alt, image, offerId } = props

  return (
    <Container>
      {/** Explicitly defining Margin component for easier use for other components, with gutters */}
      <Margin />
      <ImageContainer>
        <TouchableHighlight
          onPress={() => console.log(`Opening offer ${offerId}...`)} // eslint-disable-line no-console
        >
          <ExcluImage source={{ uri: image }} accessible={!!alt} accessibilityLabel={alt} />
        </TouchableHighlight>
      </ImageContainer>
      <Margin />
    </Container>
  )
}

// TODO(agarcia): place these constants in a file for style
const MARGIN_DP = 24
const BORDER_RADIUS = 8

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel((imageWidth * 292) / 333)

const Container = styled.View({
  flexDirection: 'row',
})

const ImageContainer = styled.View({
  flex: 1,
})

const Margin = styled.View({
  width: PixelRatio.roundToNearestPixel(MARGIN_DP),
})

const ExcluImage = styled.Image({
  height: imageHeight,
  borderRadius: BORDER_RADIUS,
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BORDER_RADIUS,
})
