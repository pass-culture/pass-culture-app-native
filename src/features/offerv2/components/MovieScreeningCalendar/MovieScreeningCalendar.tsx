import React, { FunctionComponent } from 'react'

import { OfferStockResponse } from 'api/gen'
import { MovieCalendar } from 'features/offerv2/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offerv2/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { Spacer } from 'ui/theme'

type Props = {
  stocks: OfferStockResponse[]
}
export const MovieScreeningCalendar: FunctionComponent<Props> = ({ stocks }) => {
  const { movieScreeningDates, selectedDate, setSelectedDate } = useMovieScreeningCalendar(stocks)

  return (
    <React.Fragment>
      <MovieCalendar
        dates={movieScreeningDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
      />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}
