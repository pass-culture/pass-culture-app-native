import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { HeaderWrapper } from 'ui/components/headers/HeaderWrapper'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { Page } from 'ui/pages/Page'

import { ArtistInfos } from '../components/ArtistInfos/ArtistInfos'
import { ArtistWebMetaHeader } from '../components/ArtistWebMetaHeader'
import { ArtistPlaylistContainer } from '../containers/ArtistPlaylistContainer/ArtistPlaylistContainer'
import { ArtistTopOffersContainer } from '../containers/ArtistTopOffersContainer/ArtistTopOffersContainer'
import { useArtistQuery } from '../queries/useArtistQuery'

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
          <HeaderWrapper
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
          </HeaderWrapper>
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
