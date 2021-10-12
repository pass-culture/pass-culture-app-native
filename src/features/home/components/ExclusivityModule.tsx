import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio, useWindowDimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { computeDistanceInKilometers, useUserIsInsideOfferArroundRadius } from 'libs/parsers'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const ExclusivityModule = ({ alt, image, offerId, display }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const id = dehumanizeId(offerId)
  const { data: exclusivityOffer } = useOffer({ offerId: id as number })
  const { position: userPosition } = useGeolocation()
  const windowWidth = useWindowDimensions().width
  const imageWidth = windowWidth - 2 * MARGIN_DP
  const imageHeight = PixelRatio.roundToNearestPixel(imageWidth * RATIO_EXCLU)
  const imageStyle = {
    height: imageHeight,
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    maxHeight: LENGTH_XL,
  }

  // Récupérer la localisation de l'offre exclusive par rapport à l'utilisateur
  const offerPosition = exclusivityOffer && {
    lat: exclusivityOffer.venue.coordinates.latitude,
    lng: exclusivityOffer.venue.coordinates.longitude,
  }

  // Récupérer la distance entre l'offre et l'utilisateur en km (number)
  const distanceBetweenOfferAndUser = computeDistanceInKilometers(userPosition, offerPosition)

  // Pour savoir si l'utilisateur est dans le perimètre de l'offre exclusive
  const isUserInsideOfferAroundRadius = useUserIsInsideOfferArroundRadius(
    display.aroundRadius,
    distanceBetweenOfferAndUser
  )

  const handlePressExclu = useCallback(() => {
    if (typeof id === 'number') {
      navigate('Offer', { id, from: 'home' })
      analytics.logClickExclusivityBlock(id)
    }
  }, [offerId])

  const source = useMemo(() => ({ uri: image }), [image])

  if (!isUserInsideOfferAroundRadius) return <React.Fragment />
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
