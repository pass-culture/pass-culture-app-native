import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { shouldDisplayExcluOffer } from 'features/home/components/ExclusivityModule.utils'
import { ExclusivityPane } from 'features/home/contentful'
import { useExcluOffer } from 'features/home/pages/useExcluOffer'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer, getSpacing } from 'ui/theme'

export const ExclusivityModule = ({
  alt,
  image,
  id,
  display,
}: Omit<ExclusivityPane, 'moduleId'>) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useExcluOffer(id)
  const { position } = useGeolocation()
  const maxPrice = useMaxPrice()

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    navigate('Offer', { id, from: 'home' })
    analytics.logClickExclusivityBlock(id)
    analytics.logConsultOffer({ offerId: id, from: 'exclusivity' })
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  const shouldModuleBeDisplayed = shouldDisplayExcluOffer(display, offer, position, maxPrice)
  if (!shouldModuleBeDisplayed) return <React.Fragment />
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

const TouchableHighlight = styled.TouchableHighlight(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
}))

const Image = styled(FastImage)(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))
