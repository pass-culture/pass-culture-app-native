import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const ArtistWebview = () => {
  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'ArtistWebview'>>()
  const { data: artist, isError, error, isLoading } = useArtistQuery(params.id)

  const headerHeight = useGetHeaderHeight()

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  if (isLoading || !artist?.descriptionSource || !enableArtistPage) return <PageNotFound />

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={`${artist.name} sur Wikipédia`} />
      <Placeholder height={headerHeight} />
      <WebView source={{ uri: artist.descriptionSource }} testID="artist-webview" />
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
