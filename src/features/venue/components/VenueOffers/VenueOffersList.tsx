import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { VenueOffersProps } from 'features/venue/components/VenueOffers/VenueOffers'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'
import { AvatarsList } from 'ui/components/Avatar/AvatarList'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { LENGTH_M, RATIO_HOME_IMAGE, Spacer, TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const keyExtractor = (item: Offer) => item.objectID

const OFFERS_PLAYLIST_SIMILAR_SPACING = Platform.OS === 'android' ? getSpacing(8) : getSpacing(14)

type VenueOffersListProps = VenueOffersProps & {
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
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
}) => {
  const { user } = useAuthContext()
  const artistsPlaylistEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_ARTISTS_PLAYLIST)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)

  const { hits = [], nbHits = 0 } = venueOffers ?? {}
  const { artists = [] } = venueArtists ?? {}
  const shouldDisplayArtistsPlaylist = artistsPlaylistEnabled && artists.length > 0

  const shouldDisplayGtlPlaylist =
    [VenueTypeCodeKey.DISTRIBUTION_STORE, VenueTypeCodeKey.BOOKSTORE].includes(
      venue?.venueTypeCode as VenueTypeCode
    ) && !!playlists?.length

  const showSeeMore = nbHits > hits.length && !shouldDisplayGtlPlaylist
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venue.id) : undefined

  const renderFooter: RenderFooterItem = ({ width, height }: { width: number; height: number }) => (
    <SeeMore
      width={width}
      height={height}
      navigateTo={showSeeMore ? searchNavConfig : undefined}
      onPress={() => analytics.logVenueSeeMoreClicked(venue.id)}
    />
  )
  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates && getTimeStampInMillis(item.offer.dates)
    return (
      <OfferTile
        analyticsFrom="venue"
        offerLocation={item._geoloc}
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={mapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatDates(timestampsInMillis)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayedPrice(
          item.offer.prices,
          currency,
          euroToPacificFrancRate,
          item.offer.isDuo && user?.isBeneficiary
        )}
        venueId={venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
      />
    )
  }

  const handleArtistsPlaylistPress = (artistName: string) => {
    analytics.logConsultArtist({ artistName, from: 'venue', venueId: venue.id })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Toutes les offres"
        TitleComponent={PlaylistTitleText}
        data={hits}
        itemHeight={LENGTH_M}
        itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      {shouldDisplayArtistsPlaylist ? (
        <ArtistsPlaylistContainer gap={2}>
          <ArtistsPlaylistTitleText>Les artistes disponibles dans ce lieu</ArtistsPlaylistTitleText>
          <AvatarsList data={artists} onItemPress={handleArtistsPlaylistPress} />
        </ArtistsPlaylistContainer>
      ) : null}
      {shouldDisplayGtlPlaylist ? (
        <React.Fragment>
          {playlists?.map((playlist) => (
            <GtlPlaylist
              key={playlist.entryId}
              venue={venue}
              playlist={playlist}
              analyticsFrom="venue"
              route="Venue"
            />
          ))}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))``

const ArtistsPlaylistContainer = styled(ViewGap)({
  paddingBottom: OFFERS_PLAYLIST_SIMILAR_SPACING,
})

const ArtistsPlaylistTitleText = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))({
  marginHorizontal: getSpacing(6),
})
