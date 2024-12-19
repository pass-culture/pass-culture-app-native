import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'
import { Platform } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { ArtistHeader } from 'features/artist/components/ArtistHeader/ArtistHeader'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { Artist } from 'features/artist/pages/Artist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { useArtistResults } from 'features/offer/helpers/useArtistResults/useArtistResults'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Subcategory } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

type Props = {
  offer: OfferResponseV2
  artist: Artist
  subcategory: Subcategory
}

export const ArtistBody: FunctionComponent<Props> = ({ offer, artist, subcategory }) => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { goBack } = useGoBack('Offer', { id: params.fromOfferId })
  const { appBarHeight } = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const { artistPlaylist, artistTopOffers } = useArtistResults({
    artists,
    searchGroupName: subcategory.searchGroupName,
  })

  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { name, bio } = artist

  const avatarImage = useMemo(() => {
    const topOfferThumb = artistTopOffers[0]?.offer.thumbUrl ?? ''
    if (!topOfferThumb) {
      return undefined
    }
    return (
      <StyledImage
        url={topOfferThumb}
        accessibilityRole={AccessibilityRole.IMAGE}
        accessibilityLabel="artist avatar"
      />
    )
  }, [artistTopOffers])

  return (
    <Container>
      <ArtistWebMetaHeader artist={name} />
      {/* On web header is called before Body for accessibility navigate order */}
      {isWeb ? (
        <ContentHeader
          headerTitle={name}
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
          <ViewGap gap={6}>
            <ArtistHeader name={name} avatarImage={avatarImage} />
            {bio ? (
              <Description gap={1}>
                <Typo.ButtonText>Quelques infos à son sujet</Typo.ButtonText>
                <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                  {highlightLinks(bio)}
                </CollapsibleText>
              </Description>
            ) : null}
          </ViewGap>
          <ArtistTopOffers artistName={name} items={artistTopOffers} />
          <ArtistPlaylist offer={offer} artistName={name} items={artistPlaylist} />
        </ViewGap>
      </ContentContainer>

      {/* On native header is called after Body to implement the BlurView for iOS */}
      {isWeb ? null : (
        <ContentHeader
          headerTitle={name}
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

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
