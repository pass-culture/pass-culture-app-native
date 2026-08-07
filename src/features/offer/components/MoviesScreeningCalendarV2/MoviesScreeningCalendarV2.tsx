import React, { FunctionComponent } from 'react'

import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { VenueCalendarV2 } from 'features/offer/components/MoviesScreeningCalendarV2/VenueCalendarV2'
import { useVenueMoviesCalendarQuery } from 'features/offer/queries/useVenueMoviesCalendarQuery'

type Props = {
  venueId: number
}

export const MoviesScreeningCalendarV2: FunctionComponent<Props> = ({ venueId }) => {
  const { data: moviesCalendar, isLoading } = useVenueMoviesCalendarQuery({ venueId })
  const { calendar } = moviesCalendar || { calendar: [] }
  const dates = calendar?.map((dayMovieScreenings) => new Date(dayMovieScreenings.date))

  return !!dates && !isLoading ? (
    <MovieCalendarProvider initialDates={dates}>
      <VenueCalendarV2 calendar={calendar} venueId={venueId} />
    </MovieCalendarProvider>
  ) : null
}
