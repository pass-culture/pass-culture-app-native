import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeaderWrapper'
import { ArtistInfos } from 'features/artist/components/ArtistInfos/ArtistInfos'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'

export const Artist: FunctionComponent = () => {
  const { goBack } = useGoBack('Offer')
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const enableArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const { params } = useRoute<UseRouteType<'Artist'>>()

  const { data: artist } = useArtistQuery(params.id)

  // TODO(PC-35430): replace null by PageNotFound when wipArtistPage FF deleted
  if (!artist || !enableArtistPage) return null

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
        <ContentContainer
          scrollEventThrottle={16}
          bounces={false}
          onScroll={onScroll}
          contentContainerStyle={{ paddingTop: headerHeight }}>
          <ViewGap gap={8}>
            <ArtistInfos artistId={params.id} />
            <ArtistTopOffers artistId={params.id} />
            <ArtistPlaylist artistId={params.id} />
          </ViewGap>
        </ContentContainer>
      </ArtistHeaderWrapper>
    </Page>
  )
}

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})
