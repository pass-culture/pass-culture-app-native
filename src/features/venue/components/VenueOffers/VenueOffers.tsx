import { useRoute } from '@react-navigation/native'
import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { getSpacing, LENGTH_M, RATIO_HOME_IMAGE, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  venueOffers?: { hits: Offer[]; nbHits: number }
  playlists?: GTLPlaylistResponse
}

const keyExtractor = (item: Offer) => item.objectID

export function VenueOffers({ venue, venueOffers, playlists }: Readonly<Props>) {
  const { isDesktopViewport } = useTheme()
  const enableNewXpCine = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_VENUE)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)
  const { isLoading: areVenueOffersLoading } = useVenueOffers(venue)
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({ venue })

  const { hits = [], nbHits = 0 } = venueOffers ?? {}

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
    return (
      <VenueOfferTile
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={mapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatDates(timestampsInMillis)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices)}
        venueId={venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
      />
    )
  }

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

  if (areVenueOffersLoading || arePlaylistsLoading)
    return (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={6} />
        <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
      </React.Fragment>
    )

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  const isOfferAMovieScreening = venueOffers.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  if (isOfferAMovieScreening && enableNewXpCine) {
    return (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
        <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
        <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
        <MoviesScreeningCalendar />
      </React.Fragment>
    )
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
      {shouldDisplayGtlPlaylist ? (
        <React.Fragment>
          {playlists.map((playlist) => (
            <GtlPlaylist key={playlist.entryId} venue={venue} playlist={playlist} />
          ))}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const MoviesTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
