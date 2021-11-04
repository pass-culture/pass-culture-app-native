import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'
import { GeoCoordinates, useGeolocation } from 'libs/geolocation'
import { computeDistanceInMeters } from 'libs/parsers'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const shouldDisplayExcluOffer = (
  display: ExclusivityPane['display'],
  offer: OfferResponse,
  userLocation: GeoCoordinates | null
): boolean => {
  // Exclu module is not geolocated
  if (!display || !display.isGeolocated || !display.aroundRadius) return true

  // Exclu module is geolocated but we don't know the user's location
  if (!userLocation) return false

  // Exclu module is geolocated and we know the user's location: compute distance to offer
  const { latitude, longitude } = offer.venue.coordinates
  if (!latitude || !longitude) return false
  const distance = computeDistanceInMeters(
    latitude,
    longitude,
    userLocation.latitude,
    userLocation.longitude
  )

  return distance <= 1000 * display.aroundRadius
}

export const ExclusivityModule = ({ alt, image, id, display }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { position } = useGeolocation()
  const { data: offer } = useOffer({ offerId: id })

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    navigate('Offer', { id, from: 'home' })
    analytics.logClickExclusivityBlock(id)
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  if (!offer) return null
  // TODO(antoinewg) move this logic higher to know the number of modules displayed
  if (!shouldDisplayExcluOffer(display, offer, position)) return null

  return (
    <TouchableHighlight onPress={handlePressExclu} testID="imageExclu">
      <Image source={source} accessible={!!alt} accessibilityLabel={alt} />
    </TouchableHighlight>
  )
}

const Image = styled(FastImage)(({ theme }) => ({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))

const TouchableHighlight = styled.TouchableHighlight({
  flex: 1,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
  marginHorizontal: getSpacing(6),
})
