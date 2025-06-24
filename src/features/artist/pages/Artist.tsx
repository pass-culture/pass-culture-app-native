import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import {
  useArtistOffersPlaylistQuery,
  useArtistTopOffersPlaylistQuery,
} from 'queries/offer/useOffersByArtistQuery'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { userLocation } = useLocation()
  const transformHits = useTransformOfferHits()

  const { data: artistPlaylist } = useArtistOffersPlaylistQuery({
    artistId: params.id,
    userLocation,
    transformHits,
  })
  const { data: artistTopOffers } = useArtistTopOffersPlaylistQuery({
    artistId: params.id,
    userLocation,
    transformHits,
  })
  const { data: artist } = useArtistQuery(params.id)

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!artist || !enableArtistPage) return null

  return (
    <ArtistBody
      artist={artist}
      artistPlaylist={artistPlaylist ?? []}
      artistTopOffers={artistTopOffers ?? []}
    />
  )
}
