import { useRoute } from '@react-navigation/native'
import React, { useMemo, useCallback } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters/useVenueSearchParameters'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { Layout } from 'libs/contentful/types'
import { useLocation } from 'libs/geolocation'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MARGIN_DP, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venueId: number
  layout?: Layout
}

const keyExtractor = (item: Offer) => item.objectID

export const VenueOffers: React.FC<Props> = ({ venueId, layout = 'two-items' }) => {
  const { data: venue } = useVenue(venueId)
  const { data: venueOffers } = useVenueOffers(venueId)
  const { userPosition: position } = useLocation()
  const params = useVenueSearchParameters(venueId)
  const route = useRoute<UseRouteType<'Offer'>>()

  const searchTabNavConfig = useMemo(() => {
    return getTabNavConfig('Search', {
      ...params,
      ...(venue
        ? {
            locationFilter: {
              ...params.locationFilter,
              locationType: LocationType.VENUE,
              venue: {
                ...(params.locationFilter.locationType === LocationType.VENUE
                  ? params.locationFilter.venue
                  : {}),
                label: venue.name,
                info: venue.city ?? '',
                venueId: venue.id,
              },
            },
          }
        : {}),
      previousView: SearchView.Results,
      view: SearchView.Results,
    })
  }, [params, venue])
  const searchNavConfig = {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
  const { hits = [], nbHits = 0 } = venueOffers ?? {}

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
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
          searchId={route.params?.searchId}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position]
  )

  const seeAllOffers = useCallback(() => {
    analytics.logVenueSeeAllOffersClicked(venueId)
  }, [venueId])

  const showSeeMore = nbHits > hits.length
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venueId) : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(layout)

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: { width: number; height: number }) => (
      <SeeMore
        width={width}
        height={height}
        navigateTo={showSeeMore ? searchNavConfig : undefined}
        onPress={onPressSeeMore as () => void}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPressSeeMore]
  )

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <React.Fragment></React.Fragment>
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Offres"
        TitleComponent={PlaylistTitle}
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      <MarginContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Voir toutes les offres"
          onBeforeNavigate={seeAllOffers}
          navigateTo={searchNavConfig}
        />
      </MarginContainer>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const MarginContainer = styled.View({
  marginHorizontal: PixelRatio.roundToNearestPixel(MARGIN_DP),
})
const PlaylistTitle = styled(Typo.Title4).attrs(getHeadingAttrs(2))``
