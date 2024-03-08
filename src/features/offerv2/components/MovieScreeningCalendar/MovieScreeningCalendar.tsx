import React, { FunctionComponent, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'

import { OfferStockResponse } from 'api/gen'
import { MovieCalendar } from 'features/offerv2/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offerv2/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { Spacer } from 'ui/theme'

type Props = {
  stocks: OfferStockResponse[]
  offerId?: number
}
export const MovieScreeningCalendar: FunctionComponent<Props> = ({ stocks, offerId }) => {
  const { movieScreeningDates, selectedDate, setSelectedDate } = useMovieScreeningCalendar(stocks)

  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ x: 0 })
    }
  }, [scrollViewRef, offerId])

  return (
    <React.Fragment>
      <MovieCalendar
        dates={movieScreeningDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        scrollViewRef={scrollViewRef}
      />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}
