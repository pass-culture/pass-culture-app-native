import React from 'react'
import { Dimensions, PixelRatio, Text } from 'react-native'
import styled from 'styled-components/native'

import { BusinessPane } from 'features/home/contentful'
import { Typo, ColorsEnum } from 'ui/theme'

export const BusinessModule = ({ firstLine, secondLine, image, url }: BusinessPane) => (
  <Row>
    {/** Explicitly defining Margin component for easier use for other components, with gutters */}
    <Margin />
    <TouchableContainer>
      <TouchableHighlight
        onPress={() => console.log(`Opening ${url}`)} // eslint-disable-line no-console
      >
        <ImageContainer>
          <ImageBackground source={{ uri: image }}>
            <TextContainer>
              <Text>
                <Typo.ButtonText color={ColorsEnum.WHITE}>{firstLine}</Typo.ButtonText>
                <Typo.ButtonText color={ColorsEnum.WHITE}> </Typo.ButtonText>
                <Typo.Body color={ColorsEnum.WHITE}>{secondLine}</Typo.Body>
              </Text>
            </TextContainer>
          </ImageBackground>
        </ImageContainer>
      </TouchableHighlight>
    </TouchableContainer>
    <Margin />
  </Row>
)

// TODO(agarcia): place these constants in a file for style
const MARGIN_DP = 24
const BORDER_RADIUS = 8

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel((imageWidth * 116) / 553)

const Row = styled.View({
  flexDirection: 'row',
})

const TouchableContainer = styled.View({
  flex: 1,
})

const Margin = styled.View({
  width: PixelRatio.roundToNearestPixel(MARGIN_DP),
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BORDER_RADIUS,
})

const ImageContainer = styled.View({
  borderRadius: BORDER_RADIUS,
  overflow: 'hidden',
})

const ImageBackground = styled.ImageBackground({
  height: imageHeight,
  width: imageWidth,
})

const TextContainer = styled.View({
  flexDirection: 'row',
})
