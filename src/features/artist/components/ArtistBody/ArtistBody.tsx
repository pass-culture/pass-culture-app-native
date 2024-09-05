import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const ArtistBody: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { goBack } = useGoBack('Offer', { id: params.fromOfferId })
  const theme = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { data: offer } = useOffer({ offerId: params.fromOfferId })
  const subcategoriesMapping = useSubcategoriesMapping()

  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top

  if (!offer) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const mainArtistName = artists?.split(',')[0] ?? ''

  if (mainArtistName === '') return null

  return (
    <Container>
      <ArtistWebMetaHeader artist={mainArtistName} />
      {/* On web header is called before Body for accessibility navigate order */}
      {isWeb ? (
        <ContentHeader
          headerTitle={mainArtistName}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      ) : null}

      <ContentContainer
        scrollEventThrottle={16}
        bounces={false}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight }}>
        <ViewGap gap={8}>
          <ArtistTitle isWeb={isWeb}>{mainArtistName}</ArtistTitle>
          <ArtistPlaylist offer={offer} subcategory={subcategory} artistName={mainArtistName} />
        </ViewGap>
      </ContentContainer>

      {/* On native header is called after Body to implement the BlurView for iOS */}
      {isWeb ? null : (
        <ContentHeader
          headerTitle={mainArtistName}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      )}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const ArtistTitle = styled(Typo.Title1)<{ isWeb: boolean }>(({ theme, isWeb }) => ({
  marginLeft: isWeb ? theme.contentPage.marginHorizontal : undefined,
  alignSelf: isWeb ? 'start' : 'center',
}))
