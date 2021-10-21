import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'
import { accessibilityAndTestId } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'
import { ColorsEnum, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_S } from 'ui/theme/grid'

export interface VenueTileProps {
  venue: VenueHit
  userPosition: GeoCoordinates | null
}

export const mergeVenueData = (venueHit: VenueHit) => (
  prevData: VenueResponse | undefined
): VenueResponse => ({ ...venueHit, isVirtual: false, ...(prevData || {}) })

const imageHeight = LENGTH_S
const imageWidth = imageHeight * 2.25 * RATIO_HOME_IMAGE
// TODO (Lucasbeneston) : Remove when we get image from venue
const uri =
  'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA'

export const VenueTile = ({ venue, userPosition }: VenueTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({ venueId: venue.id, from: 'home' })
    navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <Container>
      <TouchableHighlight
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        onPress={handlePressVenue}
        {...accessibilityAndTestId('venueTile')}>
        <ImageTile imageWidth={imageWidth} imageHeight={imageHeight} uri={uri} />
      </TouchableHighlight>
      <VenueCaption
        imageWidth={imageWidth}
        name={venue.name}
        venueType={venue.venueTypeCode || null}
        distance={formatDistance({ lat: venue.latitude, lng: venue.longitude }, userPosition)}
      />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number; imageWidth: number }>(
  ({ imageHeight, imageWidth }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
    backgroundColor: ColorsEnum.GREY_DISABLED,
  })
)
