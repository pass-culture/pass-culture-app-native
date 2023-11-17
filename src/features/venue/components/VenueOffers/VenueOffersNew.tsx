import { useRoute } from '@react-navigation/native'
import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabParamList } from 'features/navigation/TabBar/types'
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
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venueId: number
  layout?: Layout
}

const keyExtractor = (item: Offer) => item.objectID

export function VenueOffersNew({ venueId, layout = 'two-items' }: Readonly<Props>) {
  const { data: venue } = useVenue(venueId)
  const { data: venueOffers } = useVenueOffers(venueId)
  const { userPosition: position } = useLocation()
  const defaultSearchParams = useVenueSearchParameters(venueId)
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()

  const searchTabNavConfig = useMemo(() => {
    const venueSearchParams: TabParamList['Search'] = venue
      ? {
          locationFilter: {
            ...defaultSearchParams.locationFilter,
            locationType: LocationType.VENUE,
            venue: {
              ...(defaultSearchParams.locationFilter.locationType === LocationType.VENUE
                ? defaultSearchParams.locationFilter.venue
                : {}),
              label: venue.name,
              info: venue.city ?? '',
              venueId: venue.id,
            },
          },
        }
      : {}

    return getTabNavConfig('Search', {
      ...defaultSearchParams,
      ...venueSearchParams,
      previousView: SearchView.Results,
      view: SearchView.Results,
    })
  }, [defaultSearchParams, venue])
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
          searchId={routeParams?.searchId}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position]
  )

  const showSeeMore = nbHits > hits.length
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venueId) : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(layout)

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: { width: number; height: number }) => (
      <SeeMore
        width={width}
        height={height}
        navigateTo={showSeeMore ? searchNavConfig : undefined}
        onPress={() => analytics.logVenueSeeMoreClicked(venueId)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPressSeeMore]
  )

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Toutes les offres"
        TitleComponent={PlaylistTitleText}
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(Typo.Title3).attrs(getHeadingAttrs(2))``
