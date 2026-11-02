import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useGetArtistEditorialConfigQuery } from 'features/artist/queries/useGetArtistEditorialConfigQuery'
import { useGetArtistPlaylistConfigQuery } from 'features/artist/queries/useGetArtistPlaylistConfigQuery'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { useArtistSuspenseQuery } from 'queries/artist/useArtistQuery'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { LoadingPage } from 'ui/pages/LoadingPage'

const ArtistContent: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artistPlaylistModule } = useGetArtistPlaylistConfigQuery((modules) =>
    modules.find((module) => module.artistId === params.id)
  )
  const { data: artistEditorialModule } = useGetArtistEditorialConfigQuery((modules) =>
    modules.find((module) => module.artistId === params.id)
  )

  const { data: artist, isError, error } = useArtistSuspenseQuery(params.id)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  if (!artist) return <PageNotFound />

  const handleOnExpandBioPress = () => {
    void analytics.logClickExpandArtistBio({
      artistId: artist.id,
      artistName: artist.name,
      from: 'artist',
    })
  }

  return (
    <ArtistBody
      artist={artist}
      artistPlaylist={artistPlaylist}
      artistTopOffers={artistTopOffers}
      artistPlaylistModule={artistPlaylistModule}
      artistEditorialModule={artistEditorialModule}
      onExpandBioPress={handleOnExpandBioPress}
    />
  )
}

export const Artist: FunctionComponent = () => {
  return (
    <ErrorBoundary fallback={<PageNotFound />}>
      <Suspense fallback={<LoadingPage />}>
        <ArtistContent />
      </Suspense>
    </ErrorBoundary>
  )
}
