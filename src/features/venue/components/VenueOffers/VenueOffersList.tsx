import { useIsFocused, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import {
  getDisplayedClubAdviceType,
  renderInteractionTag,
} from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { VenueOffersProps } from 'features/venue/components/VenueOffers/VenueOffers'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { asArtistId, asOfferId, asVenueId } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatPlaylistDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import { formatPrice, getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, LENGTH_M, RATIO_HOME_IMAGE, Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const keyExtractor = (item: Offer) => item.objectID

type VenueOffersListProps = VenueOffersProps & {
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  onPressAdviceCardSeeMore: (offerId: number) => void
  onPressAllAdvicesButton: () => void
  onFeedbackLog: (type: ReactionTypeEnum) => void
}

const playlistTitle = 'Les artistes disponibles dans ce lieu'

export const VenueOffersList: FunctionComponent<VenueOffersListProps> = ({
  venue,
  venueArtists,
  venueOffers,
  playlists,
  mapping,
  labelMapping,
  currency,
  euroToPacificFrancRate,
}) => {
  const theme = useTheme()
  const { user } = useAuthContext()
  const enableSceneClubTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SCENE_CLUB)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavigationConfig = useNavigateToSearchWithVenueOffers(venue)
  const isFocused = useIsFocused()

  const { hits = [] } = venueOffers ?? {}
  const { artists = [] } = venueArtists ?? {}
  const shouldDisplayArtistsPlaylist = artists.length > 0

  const onBeforeNavigate = () => analytics.logVenueSeeMoreClicked(venue.id)

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates && getTimeStampInMillis(item.offer.dates)
    const interactionTagParams = {
      theme,
      likesCount: item.offer.likes,
      clubAdvicesCount: item.offer.chroniclesCount,
      isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
      subcategoryId: item.offer.subcategoryId,
      enableSceneClubTag,
    }
    const tag = renderInteractionTag(interactionTagParams)
    const clubAdviceType = getDisplayedClubAdviceType(interactionTagParams)

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
            isDuo: !!(item.offer.isDuo && isCurrentBeneficiary(user)),
          })
        )}
        venueId={venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
        interactionTag={tag}
        clubAdviceType={clubAdviceType}
      />
    )
  }

  const handleArtistsPlaylistPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  const onSeeAllBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: playlistTitle, from: 'venue' })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistArtists' as const,
    params: {
      title: playlistTitle,
      subtitle: undefined,
      venueId: venue.id,
      originDetails: 'venue',
    },
  }

  return (
    <Container>
      <ObservedPlaylist
        onItemViewed={({ index, item }) => {
          if (!isFocused) return
          void analytics.logViewItem({
            origin: 'venue',
            playlistIndex: 0,
            index,
            type: 'offer',
            id: asOfferId(item.objectID),
            playlistId: 'venueOffersList',
            originId: asVenueId(venue.id.toString()),
          })
        }}>
        {({ listRef, handleViewableItemsChanged }) => (
          <PassPlaylist
            testID="offersModuleList"
            title="Toutes les offres"
            data={hits}
            itemHeight={LENGTH_M}
            itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
            seeAllButton={{
              navigateToSearchPlaylist: searchNavigationConfig,
              onBeforeNavigate,
            }}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            FlatListComponent={FlatList}
            playlistRef={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
        )}
      </ObservedPlaylist>

      {shouldDisplayArtistsPlaylist ? (
        <ArtistsPlaylistContainer gap={2}>
          <SeeAllButtonContainer gap={3}>
            <TitleContainer>
              <Typo.Title3 {...setTextSemantic('h2')}>{playlistTitle}</Typo.Title3>
            </TitleContainer>
            {artists.length > 1 ? (
              <View>
                <SeeAllButton
                  playlistTitle={playlistTitle}
                  data={{
                    onBeforeNavigate: onSeeAllBeforeNavigate,
                    navigateToVerticalPlaylist,
                    hideSearchSeeAll: true,
                  }}
                />
              </View>
            ) : null}
          </SeeAllButtonContainer>
          <ObservedPlaylist
            onItemViewed={({ index, item }) => {
              if (!isFocused) return
              void analytics.logViewItem({
                origin: 'venue',
                playlistIndex: 1,
                index,
                type: 'artist',
                id: asArtistId(item.id),
                playlistId: 'venueArtistsCarousel',
                originId: asVenueId(venue.id.toString()),
              })
            }}>
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
        ? playlists.map((playlist, index) => {
            // Calculate playlist index: 0 = offers list, 1 = artists (if present), 2+ = GTL playlists
            const playlistIndex = (shouldDisplayArtistsPlaylist ? 2 : 1) + index
            return (
              <ObservedPlaylist
                key={playlist.entryId}
                onItemViewed={({ index: itemIndex, item }) => {
                  if (!isFocused) return
                  void analytics.logViewItem({
                    origin: 'venue',
                    playlistIndex,
                    index: itemIndex,
                    type: 'offer',
                    id: asOfferId(item.objectID),
                    playlistId: 'venueOffersList',
                    originId: asVenueId(venue.id.toString()),
                  })
                }}>
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
            )
          })
        : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const ArtistsPlaylistContainer = styled(ViewGap)(({ theme }) => ({
  paddingBottom: Platform.OS === 'android' ? theme.designSystem.size.spacing.xxl : getSpacing(14),
}))

const TitleContainer = styled.View({
  flex: 1,
})

const SeeAllButtonContainer = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}))
