import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const ExclusivityModule = ({ alt, image, id }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOffer({ offerId: id })

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    navigate('Offer', { id, from: 'home' })
    analytics.logClickExclusivityBlock(id)
    analytics.logConsultOffer({ offerId: id, from: 'exclusivity' })
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  if (!offer) return null
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <TouchableHighlight onPress={handlePressExclu} testID="imageExclu">
          <Image source={source} accessible={!!alt} accessibilityLabel={alt} />
        </TouchableHighlight>
      </ImageContainer>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

const ImageContainer = styled.View({
  flex: 1,
  maxHeight: LENGTH_XL,
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
})

const Image = styled(FastImage)(({ theme }) => ({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))
