import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'

import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { analytics } from 'libs/analytics'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { gtlPlaylists } = useGTLPlaylists({ venue, queryKey: 'VENUE_GTL_PLAYLISTS' })
  const { data: venueOffers } = useVenueOffers(venue)

  useEffect(() => {
    if ((params.from === 'deeplink' || params.from === 'venueMap') && venue?.id) {
      analytics.logConsultVenue({ venueId: venue.id, from: params.from })
    }
  }, [params.from, venue?.id])

  if (!venue) return null

  return <VenueContent venue={venue} gtlPlaylists={gtlPlaylists} venueOffers={venueOffers} />
}
