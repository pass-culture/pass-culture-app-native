import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { VerticalPlaylistError } from 'shared/verticalPlaylist/components/VerticalPlaylistError'
import { VerticalPlaylistOffersModule } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersModule'
import { VerticalPlaylistSimilarsOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistSimilarsOffers'
import { VerticalPlaylistThematicSearchOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistThematicSearchOffers'
import { VerticalPlaylistVenueOffers } from 'shared/verticalPlaylist/components/VerticalPlaylistVenueOffers'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

export const VerticalPlaylistOffers = () => {
  const { params } = useRoute<UseRouteType<'VerticalPlaylistOffers'>>()

  switch (params.type) {
    case VerticalPlaylist.ModuleOffers:
      return <VerticalPlaylistOffersModule module={params.module} />

    case VerticalPlaylist.SimilarOffers:
      return <VerticalPlaylistSimilarsOffers module={params.module} />

    case VerticalPlaylist.ThematicSearchOffers:
      return <VerticalPlaylistThematicSearchOffers module={params.module} />

    case VerticalPlaylist.VenueOffers:
      return <VerticalPlaylistVenueOffers module={params.module} />

    default:
      return <VerticalPlaylistError />
  }
}
