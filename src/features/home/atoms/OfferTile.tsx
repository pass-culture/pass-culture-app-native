import React from 'react'
import { Text, View, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { AlgoliaHit } from 'libs/algolia'
import { ColorsEnum, Typo } from 'ui/theme'

const formatPrice = (price?: number): string => {
  return price ? `${price} €`.replace('.', ',') : 'Gratuit'
}

export const OfferTile = ({ tile: { offer } }: { tile: AlgoliaHit }) => (
  <Container>
    <TouchableHighlight
      onPress={() => console.log(`Opening offer ${offer.id}...`)} // eslint-disable-line no-console
    >
      <View>
        <Image source={{ uri: offer.thumbUrl }} testID="offerTileImage" />
        <Row>
          <TextWrapper>
            <Typo.Caption color={ColorsEnum.WHITE}>{offer.category}</Typo.Caption>
          </TextWrapper>
          <Separator />
          <TextWrapper>
            <Typo.Caption color={ColorsEnum.WHITE}>
              <Text>{'1,2km'}</Text>
            </Typo.Caption>
          </TextWrapper>
        </Row>
      </View>
    </TouchableHighlight>

    <CaptionContainer>
      <Typo.Caption numberOfLines={1}>{offer.name}</Typo.Caption>
      <Typo.Caption color={ColorsEnum.GREY_DARK}>
        <Text>{'Dès le 12 mars 2020'}</Text>
      </Typo.Caption>
      <Typo.Caption color={ColorsEnum.GREY_DARK}>{formatPrice(offer.priceMin)}</Typo.Caption>
    </CaptionContainer>
  </Container>
)

const BORDER_RADIUS = 8
const MARGIN_DP = 24
const GUTTER_DP = 16

const imageHeight = 240 // this works for small tuiles. We have to consider large tuiles (displayParameters)
const imageWidth = PixelRatio.roundToNearestPixel((imageHeight * 146) / 220)
const rowHeight = PixelRatio.roundToNearestPixel(MARGIN_DP)
const textLineHeight = PixelRatio.roundToNearestPixel(GUTTER_DP)

const Container = styled.View({
  flex: 1,
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BORDER_RADIUS,
  height: imageHeight + rowHeight,
  flex: 1,
})

const CaptionContainer = styled.View({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
})

const Image = styled.Image({
  height: imageHeight,
  width: imageWidth,
  borderTopLeftRadius: BORDER_RADIUS,
  borderTopRightRadius: BORDER_RADIUS,
})

const Row = styled.View({
  flexDirection: 'row',
  backgroundColor: ColorsEnum.BLACK,
  height: rowHeight,
  width: '100%',
  borderBottomLeftRadius: BORDER_RADIUS,
  borderBottomRightRadius: BORDER_RADIUS,
  alignItems: 'center',
})

const Separator = styled.View({
  height: textLineHeight,
  backgroundColor: ColorsEnum.WHITE,
  width: 1,
})

const TextWrapper = styled.View({
  alignItems: 'center',
  width: '50%',
})
