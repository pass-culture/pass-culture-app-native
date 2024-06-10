import React, { FunctionComponent, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'

import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { getDates } from 'shared/date/getDates'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
}

const useMoviesScreeningsList = (offerIds: number[]) => {
  const dates = getDates(new Date(), 15)
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0])
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const filteredOffersWithStocks = useMemo(
    () => filterOffersStocksByDate(offersWithStocks || { offers: [] }, selectedDate),
    [offersWithStocks, selectedDate]
  )

  return { dates, selectedDate, setSelectedDate, offersWithStocks: filteredOffersWithStocks }
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const flatListRef = useRef<FlatList | null>(null)
  const {
    dates: nextFifteenDates,
    selectedDate,
    setSelectedDate,
    offersWithStocks,
  } = useMoviesScreeningsList(offerIds)

  return (
    <React.Fragment>
      <MovieCalendar
        dates={nextFifteenDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        flatListRef={flatListRef}
      />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        data={offersWithStocks?.offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <MovieOfferTile
            offer={item}
            venueOffers={venueOffers}
            date={selectedDate}
            isLast={index === (offersWithStocks?.offers.length ?? 0) - 2}
          />
        )}
      />
    </React.Fragment>
  )
}
