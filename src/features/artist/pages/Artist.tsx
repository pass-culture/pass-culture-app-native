import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ViewToken } from 'react-native'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { LoadingPage } from 'ui/pages/LoadingPage'

const ArtistContent: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const pageTracking = usePageTracking({
    pageName: 'Artist',
    pageLocation: 'artist',
    pageId: params.id,
  })

  const { artistPlaylist, artistTopOffers } = useArtistResultsQuery({
    artistId: params.id,
  })
  const { data: artist, isError, error } = useArtistQuery(params.id)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  // Handler for modules with the new system
  const handleViewableItemsChanged = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      artistId: string,
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        artistId,
        playlistIndex,
        entryId: params.id,
      })
    },
    [pageTracking, params.id]
  )

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
      onViewableItemsChanged={handleViewableItemsChanged}
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
