import React from 'react'

import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'
import { useGetOffersSimilarsFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetOffersSimilarsFromPlaylist'
import { OffersSimilars } from 'shared/verticalPlaylist/types'

type Props = { module: OffersSimilars }

export const VerticalPlaylistSimilarsOffers = ({ module }: Props) => {
  const playlist = useGetOffersSimilarsFromPlaylist(module)

  return (
    <VerticalPlaylistOffersView
      title={playlist.title}
      items={playlist.items}
      analyticsFrom="verticalplaylistoffers"
    />
  )
}
