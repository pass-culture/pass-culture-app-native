import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { GLOBAL_STALE_TIME } from 'libs/react-query/queryClient'
import { VenueHit } from 'libs/search'
import { ImageTile } from 'ui/components/ImageTile'

export interface VenueTileProps {
  venue: VenueHit
  width: number
  height: number
  userPosition: GeoCoordinates | null
}

const mergeVenueData =
  (venueHit: VenueHit) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    ...venueHit,
    isVirtual: false,
    ...(prevData || {}),
  })

// TODO (Lucasbeneston) : Remove when we get image from venue
const uri =
  'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA'

export const VenueTile = (props: VenueTileProps) => {
  const { venue, width, height, userPosition } = props
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue), {
      // Make sure the data is stale, so that it is considered as a placeholder
      updatedAt: Date.now() - (GLOBAL_STALE_TIME + 1),
    })
    analytics.logConsultVenue({ venueId: venue.id, from: 'home' })
    navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <Container>
      <TouchableHighlight
        height={height}
        width={width}
        onPress={handlePressVenue}
        {...accessibilityAndTestId('venueTile')}>
        <ImageTile width={width} height={height} uri={uri} />
      </TouchableHighlight>
      <VenueCaption
        width={width}
        name={venue.name}
        venueType={venue.venueTypeCode || null}
        distance={formatDistance({ lat: venue.latitude, lng: venue.longitude }, userPosition)}
      />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ height: number; width: number }>(
  ({ height, width, theme }) => ({
    height,
    width,
    borderRadius: theme.borderRadius.radius,
    backgroundColor: theme.uniqueColors.greyDisabled,
  })
)
