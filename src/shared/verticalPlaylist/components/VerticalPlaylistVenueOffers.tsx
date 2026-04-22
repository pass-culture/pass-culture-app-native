import React from 'react'

import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'
import { useGetOffersVenueFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetOffersVenueFromPlaylist'

type Props = { module: { venueId: number; playlistTitle: string } }

export const VerticalPlaylistVenueOffers = ({ module }: Props) => {
  const data = useGetOffersVenueFromPlaylist(module)

  return (
    <VerticalPlaylistOffersView
      title={data.title}
      items={data.items}
      searchId={data.searchId}
      searchQuery={data.searchQuery}
      analyticsFrom="verticalplaylistoffers"
    />
  )
}
