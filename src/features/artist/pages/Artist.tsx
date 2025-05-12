import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { ArtistType } from 'features/artist/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useArtistResultsQuery } from 'features/offer/queries/useArtistResultsQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const Artist: FunctionComponent = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })

  const artist = useMemo(() => {
    return [...artistPlaylist, ...artistTopOffers][0]?.artists?.find(
      (artist) => artist.id === params.id
    )
  }, [artistPlaylist, artistTopOffers, params.id])

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!artist || !enableArtistPage) return null

  const artistInfo: ArtistType = {
    id: params.id,
    name: artist.name,
    image: artist.image,
    bio: undefined,
  }

  return (
    <ArtistBody
      artist={artistInfo}
      artistPlaylist={artistPlaylist}
      artistTopOffers={artistTopOffers}
    />
  )
}
