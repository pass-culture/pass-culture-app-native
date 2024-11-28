import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { VenueCalendar } from 'features/offer/components/MoviesScreeningCalendar/VenueCalendar'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LENGTH_M, RATIO_HOME_IMAGE, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venueOffers: VenueOffers
}

const keyExtractor = (item: Offer) => item.objectID

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)

  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const nonScreeningOffers = venueOffers.hits.filter(
    (offer) => offer.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
  )

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
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
        price={getDisplayPrice(item.offer.prices, currency, euroToPacificFrancRate)}
        venueId={item.venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
        variant={isNewOfferTileDisplayed ? 'new' : 'default'}
      />
    )
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <MovieCalendarProvider nbOfDays={15}>
        <VenueCalendar venueOffers={venueOffers} offerIds={offerIds} />
      </MovieCalendarProvider>
      {nonScreeningOffers.length > 0 ? (
        <SectionWithDivider visible margin={false} gap={6}>
          <PassPlaylist
            testID="offersModuleList"
            title="Les autres offres"
            TitleComponent={PlaylistTitleText}
            data={nonScreeningOffers}
            itemHeight={LENGTH_M}
            itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </SectionWithDivider>
      ) : null}
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))``
