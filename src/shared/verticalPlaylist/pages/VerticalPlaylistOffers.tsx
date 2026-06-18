import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { VerticalPlaylistError } from 'shared/verticalPlaylist/components/VerticalPlaylistError'
import { VerticalPlaylistOffersModule } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersModule'
import { VerticalPlaylistSearchOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistSearchOffers'
import { VerticalPlaylistSimilarsOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistSimilarsOffers'
import { VerticalPlaylistVenueOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistVenueOffers'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

export const VerticalPlaylistOffers = () => {
  const { params } = useRoute<UseRouteType<'VerticalPlaylistOffers'>>()

  if (!params.module) return <VerticalPlaylistError />

  switch (params.type) {
    case VerticalPlaylist.ModuleOffers:
    case VerticalPlaylist.ModuleArtistPlaylist:
      return <VerticalPlaylistOffersModule module={params.module} />

    case VerticalPlaylist.SimilarOffers:
      return <VerticalPlaylistSimilarsOffers module={params.module} />

    case VerticalPlaylist.ThematicSearchOffers:
    case VerticalPlaylist.GtlPlaylistOffers:
    case VerticalPlaylist.ArtistOffers:
      return <VerticalPlaylistSearchOffers module={params.module} />

    case VerticalPlaylist.VenueOffers:
      return <VerticalPlaylistVenueOffers module={params.module} />

    default:
      return <VerticalPlaylistError />
  }
}
