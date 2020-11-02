import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { ExclusivityPane } from './moduleTypes'

export const ExclusivityModule = ({ alt, image, offerId }: ExclusivityPane) => (
  <Row>
    {/** Explicitly defining Margin component for easier use for other components, with gutters */}
    <Margin />
    <ImageContainer>
      <TouchableHighlight
        onPress={() => console.log(`Opening offer ${offerId}...`)} // eslint-disable-line no-console
      >
        <Image
          source={{ uri: image }}
          accessible={!!alt}
          accessibilityLabel={alt}
          testID="imageExclu"
        />
      </TouchableHighlight>
    </ImageContainer>
    <Margin />
  </Row>
)

// TODO(agarcia): place these constants in a file for style
const MARGIN_DP = 24
const BORDER_RADIUS = 8

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel((imageWidth * 292) / 333)

const Row = styled.View({
  flexDirection: 'row',
})

const ImageContainer = styled.View({
  flex: 1,
})

const Margin = styled.View({
  width: PixelRatio.roundToNearestPixel(MARGIN_DP),
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BORDER_RADIUS,
})

const Image = styled.Image({
  height: imageHeight,
  borderRadius: BORDER_RADIUS,
})
