import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { findArtistById } from 'features/artist/helpers/findArtistById'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useArtistResults } from 'features/offer/helpers/useArtistResults/useArtistResults'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export type Artist = {
  id: string
  name: string
  bio?: string
  image?: string
}

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResults({
    artistId: params.id,
  })

  const artist = useMemo(() => {
    return findArtistById(artistPlaylist, params.id) || findArtistById(artistTopOffers, params.id)
  }, [artistPlaylist, artistTopOffers, params.id])

  if (!artist) return <PageNotFound />

  const artistInfo: Artist = {
    id: params.id,
    name: artist.name,
    image: artist.image,
    bio: undefined,
  }

  return enableArtistPage ? (
    <ArtistBody
      artist={artistInfo}
      artistPlaylist={artistPlaylist}
      artistTopOffers={artistTopOffers}
    />
  ) : (
    <PageNotFound />
  )
}
