import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Platform, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection'
import { VenueOffersProps } from 'features/venue/components/VenueOffers/VenueOffers'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatPlaylistDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import { formatPrice, getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, LENGTH_M, RATIO_HOME_IMAGE, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const keyExtractor = (item: Offer) => item.objectID

type VenueOffersListProps = VenueOffersProps & {
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
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
  onViewableItemsChanged,
  advicesCardData,
  nbAdvices,
  enableNewTagProAdvices,
  onShowWritersModal,
}) => {
  const theme = useTheme()
  const { user } = useAuthContext()
  const artistsPlaylistEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_ARTISTS_PLAYLIST)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavigationConfig = useNavigateToSearchWithVenueOffers(venue)
  const { navigate } = useNavigation<UseNavigationType>()
  const isFocused = useIsFocused()

  const { hits = [] } = venueOffers ?? {}
  const { artists = [] } = venueArtists ?? {}
  const shouldDisplayArtistsPlaylist = artistsPlaylistEnabled && artists.length > 0
  const shouldDisplayAdvicesSection = advicesCardData && advicesCardData.length > 0 && nbAdvices > 0

  const onBeforeNavigate = () => analytics.logVenueSeeMoreClicked(venue.id)

  const onPressAdviceCardSeeMore = (offerId: number) => {
    void analytics.logConsultAdvice({
      from: 'venue',
      offerId: offerId.toString(),
      venueId: venue.id.toString(),
      originDetails: 'Les avis des pros',
      adviceType: 'pro',
    })
    navigate('ProAdvicesVenue', { venueId: venue.id, offerId })
  }

  const onPressAllAdvicesButton = () => {
    void analytics.logConsultAdvice({
      from: 'venue',
      venueId: venue.id.toString(),
      originDetails: 'Lire les x avis',
      adviceType: 'pro',
    })
  }

  const onFeedbackLog = (type: ReactionTypeEnum) => {
    const feedbackResponse = type === ReactionTypeEnum.LIKE ? 'Oui' : 'Non'
    void analytics.logFeatureFeedbackClicked({
      featureName: 'pro_advices',
      feedbackResponse,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates && getTimeStampInMillis(item.offer.dates)
    const tag = renderInteractionTag({
      theme,
      likesCount: item.offer.likes,
      clubAdvicesCount: item.offer.chroniclesCount,
      isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
      subcategoryId: item.offer.subcategoryId,
      proAdvicesCount: shouldDisplayAdvicesSection ? item.offer.proAdvicesCount : undefined,
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
    void analytics.logConsultArtist({
      artistId,
      artistName,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  const handleAllOffersViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      if (!isFocused) return
      onViewableItemsChanged(items, 'venue_offers_list', 'offer', 0)
    },
    [isFocused, onViewableItemsChanged]
  )

  const handleArtistsViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      if (!isFocused) return
      onViewableItemsChanged(items, 'venue_artists_carousel', 'artist', 1)
    },
    [isFocused, onViewableItemsChanged]
  )

  const handleGtlViewableItemsChanged = useCallback(
    (playlistTitle: string, playlistIndex: number) =>
      (items: Pick<ViewToken, 'key' | 'index'>[]) => {
        if (!isFocused) return
        onViewableItemsChanged(items, playlistTitle, 'offer', playlistIndex)
      },
    [isFocused, onViewableItemsChanged]
  )

  const onSeeAllBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: playlistTitle, from: 'venue' })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistArtists' as const,
    params: { title: playlistTitle, subtitle: undefined, venueId: venue.id },
  }

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
      {shouldDisplayAdvicesSection ? (
        <VenueAdvicesSection
          advicesCardData={advicesCardData}
          nbAdvices={nbAdvices}
          venue={venue}
          onPressAdviceCardSeeMore={onPressAdviceCardSeeMore}
          enableNewTagProAdvices={enableNewTagProAdvices}
          onShowWritersModal={onShowWritersModal}
          onPressAllAdvicesButton={onPressAllAdvicesButton}
          onFeedbackLog={onFeedbackLog}
        />
      ) : null}

      {shouldDisplayArtistsPlaylist ? (
        <ArtistsPlaylistContainer gap={2}>
          <SeeAllButtonContainer gap={3}>
            <TitleContainer>
              <Typo.Title3 {...getHeadingAttrs(2)}>{playlistTitle}</Typo.Title3>
            </TitleContainer>
            <SeeAllButton
              playlistTitle={playlistTitle}
              data={{
                onBeforeNavigate: onSeeAllBeforeNavigate,
                navigateToVerticalPlaylist,
                hideSearchSeeAll: true,
              }}
            />
          </SeeAllButtonContainer>
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
        ? playlists.map((playlist, index) => {
            // Calculate playlist index: 0 = offers list, 1 = artists (if present), 2+ = GTL playlists
            const playlistIndex = (shouldDisplayArtistsPlaylist ? 2 : 1) + index
            return (
              <ObservedPlaylist
                key={playlist.entryId}
                onViewableItemsChanged={handleGtlViewableItemsChanged(
                  playlist.title,
                  playlistIndex
                )}>
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
