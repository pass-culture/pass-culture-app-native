import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { BusinessModuleIcon } from 'features/home/assets/BusinessModuleIcon'
import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { BusinessPane } from 'features/home/contentful'
import { Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const BusinessModule = ({ firstLine, secondLine, image, url }: BusinessPane) => {
  const firstLineWithEndSpace = `${firstLine} `
  return (
    <Row>
      {/** Explicitly defining Margin component for easier use for other components, with gutters */}
      <Margin />
      <TouchableContainer>
        <TouchableHighlight
          onPress={() => console.log(`Opening ${url}`)} // eslint-disable-line no-console
        >
          <ImageContainer>
            <ImageBackground source={{ uri: image }} testID="imageBusiness">
              <Container>
                <BusinessModuleIcon />
                <StyledText numberOfLines={2}>
                  <Typo.ButtonText color={ColorsEnum.WHITE}>
                    {firstLineWithEndSpace}
                  </Typo.ButtonText>
                  <Typo.Body color={ColorsEnum.WHITE}>{secondLine}</Typo.Body>
                </StyledText>
                <NextArrowIcon />
              </Container>
            </ImageBackground>
          </ImageContainer>
        </TouchableHighlight>
      </TouchableContainer>
      <Margin />
    </Row>
  )
}

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
  justifyContent: 'center',
})

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(2),
})

const StyledText = styled.Text({
  flex: 1,
  padding: getSpacing(1),
})
