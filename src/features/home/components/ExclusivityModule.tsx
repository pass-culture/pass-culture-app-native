import { useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { useCallback } from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const ExclusivityModule = ({ alt, image, offerId }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handlePressExclu = useCallback(() => {
    const id = dehumanizeId(offerId)
    if (typeof id === 'number') {
      navigate('Offer', { id, from: 'home' })
      analytics.logClickExclusivityBlock(id)
    }
  }, [offerId])

  const source = useMemo(() => ({ uri: image }), [image])

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <TouchableHighlight onPress={handlePressExclu}>
          <FastImage
            source={source}
            accessible={!!alt}
            accessibilityLabel={alt}
            testID="imageExclu"
            style={imageStyle}
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

const imageStyle = {
  height: imageHeight,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
}
