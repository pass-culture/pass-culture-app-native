import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { VenueCalendar } from 'features/offer/components/MoviesScreeningCalendar/VenueCalendar'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { VenueOffers } from 'features/venue/types'
import { getDates } from 'shared/date/getDates'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
}

const keyExtractor = (item: Offer) => item.objectID

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()

  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const nonScreeningOffers = venueOffers.hits.filter(
    (offer) => offer.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
  )

  const next15Dates = getDates(new Date(), 15)

  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
    return (
      <OfferTileWrapper
        item={item}
        analyticsFrom="venue"
        venueId={item.venue?.id}
        width={width}
        height={height}
        searchId={routeParams?.searchId}
      />
    )
  }

  return (
    <React.Fragment>
      <MovieCalendarProvider initialDates={next15Dates}>
        <VenueCalendar venueOffers={venueOffers} offerIds={offerIds} />
      </MovieCalendarProvider>
      {nonScreeningOffers.length > 0 ? (
        <SectionWithDivider visible margin={false} gap={6}>
          <PassPlaylist
            testID="offersModuleList"
            title="Les autres offres"
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
