import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { logClickExclusivityBlock } from 'libs/analytics'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const ExclusivityModule = ({ alt, image, offerId }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <TouchableHighlight
          onPress={() => {
            navigate('Offer', { offerId })
            logClickExclusivityBlock(offerId)
          }}>
          <Image
            source={{ uri: image }}
            accessible={!!alt}
            accessibilityLabel={alt}
            testID="imageExclu"
          />
        </TouchableHighlight>
      </ImageContainer>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel(imageWidth * RATIO_EXCLU)

const Row = styled.View({
  flexDirection: 'row',
})

const ImageContainer = styled.View({
  flex: 1,
  maxHeight: LENGTH_XL,
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
})

const Image = styled.Image({
  height: imageHeight,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
})
