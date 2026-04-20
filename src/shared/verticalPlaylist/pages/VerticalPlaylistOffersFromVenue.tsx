import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'

import { useOffersFromVenuePlaylistData } from '../helpers/useOffersFromVenuePlaylistData'

import { VerticalPlaylistOffersPage } from './VerticalPlaylistOffersPage'

export const VerticalPlaylistOffersFromVenue = () => {
  const { params } = useRoute<UseRouteType<'VerticalPlaylistOffersFromVenue'>>()
  const data = useOffersFromVenuePlaylistData({
    venueId: params.venueId,
    playlistTitle: params.playlistTitle,
  })

  return (
    <VerticalPlaylistOffersPage
      title={data.title}
      items={data.items}
      searchId={data.searchId}
      searchQuery={data.searchQuery}
      analyticsFrom="verticalplaylistoffersfromvenue"
    />
  )
}
