import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { IdeaIcon } from 'features/home/assets/IdeaIcon'
import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { BusinessPane } from 'features/home/contentful'
import { Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const BusinessModule = ({ firstLine, secondLine, image, url }: BusinessPane) => {
  return (
    <Row>
      {/** Explicitly defining Margin component for easier use for other components, with gutters */}
      <Margin />
      <TouchableHighlight
        onPress={() => console.log(`Opening ${url}`)} // eslint-disable-line no-console
      >
        <ImageContainer>
          <ImageBackground source={{ uri: image }} testID="imageBusiness">
            <Container>
              <IconContainer>
                <IdeaIcon />
              </IconContainer>
              <TextContainer>
                <Typo.ButtonText color={ColorsEnum.WHITE}>{firstLine}</Typo.ButtonText>
                <Typo.Body numberOfLines={2} color={ColorsEnum.WHITE}>
                  {secondLine}
                </Typo.Body>
              </TextContainer>
              <NextArrowIcon />
            </Container>
          </ImageBackground>
        </ImageContainer>
      </TouchableHighlight>
      <Margin />
    </Row>
  )
}

// TODO(agarcia): place these constants in a file for style
const MARGIN_DP = 24
const BORDER_RADIUS = 8

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel((imageWidth * 116) / 332)

const Row = styled.View({
  flexDirection: 'row',
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
  justifyContent: 'center',
})

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(2),
})

const TextContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  padding: getSpacing(1),
})

const IconContainer = styled.View({
  width: 56,
  height: 56,
})
