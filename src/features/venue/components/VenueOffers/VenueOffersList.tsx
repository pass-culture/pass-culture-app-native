import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Platform, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { VenueOffersProps } from 'features/venue/components/VenueOffers/VenueOffers'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatPlaylistDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, LENGTH_M, RATIO_HOME_IMAGE, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const keyExtractor = (item: Offer) => item.objectID

const OFFERS_PLAYLIST_SIMILAR_SPACING = Platform.OS === 'android' ? getSpacing(8) : getSpacing(14)

type VenueOffersListProps = VenueOffersProps & {
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown'
  ) => void
}

export const VenueOffersList: FunctionComponent<VenueOffersListProps> = ({
  venue,
  venueArtists,
  venueOffers,
  playlists,
  mapping,
  labelMapping,
  currency,
  euroToPacificFrancRate,
  onViewableItemsChanged,
}) => {
  const theme = useTheme()
  const { user } = useAuthContext()
  const artistsPlaylistEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_ARTISTS_PLAYLIST)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavigationConfig = useNavigateToSearchWithVenueOffers(venue)

  const { hits = [], nbHits = 0 } = venueOffers ?? {}
  const { artists = [] } = venueArtists ?? {}
  const shouldDisplayArtistsPlaylist = artistsPlaylistEnabled && artists.length > 0

  const showSeeMore = nbHits > hits.length && !playlists.length
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venue.id) : undefined

  const renderFooter: RenderFooterItem = ({ width, height }: { width: number; height: number }) => (
    <SeeMore
      width={width}
      height={height}
      navigateTo={showSeeMore ? searchNavigationConfig : undefined}
      onPress={() => analytics.logVenueSeeMoreClicked(venue.id)}
    />
  )
  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates && getTimeStampInMillis(item.offer.dates)
    const tag = renderInteractionTag({
      theme,
      likesCount: item.offer.likes,
      chroniclesCount: item.offer.chroniclesCount,
      headlinesCount: item.offer.headlineCount,
      isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
      subcategoryId: item.offer.subcategoryId,
    })

    return (
      <OfferTile
        analyticsFrom="venue"
        offerLocation={item._geoloc}
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={mapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatPlaylistDates(timestampsInMillis)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayedPrice(
          item.offer.prices,
          currency,
          euroToPacificFrancRate,
          formatPrice({
            isFixed: getIfPricesShouldBeFixed(item.offer.subcategoryId),
            isDuo: !!(item.offer.isDuo && user?.isBeneficiary),
          })
        )}
        venueId={venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
        interactionTag={tag}
      />
    )
  }

  const handleArtistsPlaylistPress = (artistId: string, artistName: string) => {
    analytics.logConsultArtist({
      artistId,
      artistName,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  const handleAllOffersViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      onViewableItemsChanged(items, 'venue_offers_list', 'offer')
    },
    [onViewableItemsChanged]
  )

  const handleArtistsViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      onViewableItemsChanged(items, 'venue_artists_carousel', 'artist')
    },
    [onViewableItemsChanged]
  )

  const handleGtlViewableItemsChanged = useCallback(
    (playlistTitle: string) => (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      onViewableItemsChanged(items, playlistTitle, 'offer')
    },
    [onViewableItemsChanged]
  )

  return (
    <Container>
      <ObservedPlaylist onViewableItemsChanged={handleAllOffersViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <PassPlaylist
            testID="offersModuleList"
            title="Toutes les offres"
            data={hits}
            itemHeight={LENGTH_M}
            itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
            onPressSeeMore={onPressSeeMore}
            renderItem={renderItem}
            titleSeeMoreLink={showSeeMore ? searchNavigationConfig : undefined}
            renderFooter={renderFooter}
            keyExtractor={keyExtractor}
            FlatListComponent={FlatList}
            playlistRef={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
        )}
      </ObservedPlaylist>
      {shouldDisplayArtistsPlaylist ? (
        <ArtistsPlaylistContainer gap={2}>
          <ArtistsPlaylistTitleText>Les artistes disponibles dans ce lieu</ArtistsPlaylistTitleText>
          <ObservedPlaylist onViewableItemsChanged={handleArtistsViewableItemsChanged}>
            {({ listRef, handleViewableItemsChanged }) => (
              <AvatarList
                data={artists}
                onItemPress={handleArtistsPlaylistPress}
                onViewableItemsChanged={handleViewableItemsChanged}
                listRef={listRef}
              />
            )}
          </ObservedPlaylist>
        </ArtistsPlaylistContainer>
      ) : null}
      {playlists.length
        ? playlists.map((playlist) => (
            <ObservedPlaylist
              key={playlist.entryId}
              onViewableItemsChanged={handleGtlViewableItemsChanged(playlist.title)}>
              {({ listRef, handleViewableItemsChanged }) => (
                <GtlPlaylist
                  venue={venue}
                  playlist={playlist}
                  analyticsFrom="venue"
                  route="Venue"
                  onViewableItemsChanged={handleViewableItemsChanged}
                  playlistRef={listRef}
                />
              )}
            </ObservedPlaylist>
          ))
        : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({ marginTop: theme.designSystem.size.spacing.xl }))

const ArtistsPlaylistContainer = styled(ViewGap)({
  paddingBottom: OFFERS_PLAYLIST_SIMILAR_SPACING,
})

const ArtistsPlaylistTitleText = styled(Typo.Title3).attrs(getHeadingAttrs(2))(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
