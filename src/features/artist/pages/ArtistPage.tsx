import { useRoute } from '@react-navigation/native'
import React, { Component, FunctionComponent, PropsWithChildren } from 'react'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeaderWrapper'
import { ArtistInfos } from 'features/artist/components/ArtistInfos/ArtistInfos'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { ArtistPlaylistContainer } from 'features/artist/containers/ArtistPlaylistContainer/ArtistPlaylistContainer'
import { ArtistTopOffersContainer } from 'features/artist/containers/ArtistTopOffersContainer/ArtistTopOffersContainer'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { Page } from 'ui/pages/Page'

export const ArtistPage: FunctionComponent = () => {
  const { goBack } = useGoBack('Offer')
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { data: artist, status } = useArtistQuery(params.id)

  if (!enableArtistPage) return <PageNotFound />

  switch (status) {
    case 'idle':
    case 'loading':
      return <LoadingPage />

    case 'success':
      return (
        <Page>
          <ArtistWebMetaHeader artist={artist.name} />
          <ArtistHeaderWrapper
            header={
              <ContentHeader
                headerTitle={artist.name}
                onBackPress={goBack}
                headerTransition={headerTransition}
              />
            }>
            <StyledScrollView
              scrollEventThrottle={16}
              bounces={false}
              onScroll={onScroll}
              contentContainerStyle={{ paddingTop: headerHeight }}>
              <ViewGap gap={8}>
                <ArtistInfos
                  name={artist.name}
                  description={artist.description || undefined}
                  imageURL={artist.image || undefined}
                />
                <ArtistTopOffersContainer artistId={params.id} />
                <ArtistPlaylistContainer artistId={params.id} />
              </ViewGap>
            </StyledScrollView>
          </ArtistHeaderWrapper>
        </Page>
      )

    case 'error':
      return <PageNotFound />
  }
}

const StyledScrollView = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})
