import { addDays } from 'date-fns'
import React, { FunctionComponent, useState } from 'react'

import { MovieCalendarProviderV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieCalendarContextV2'
import { VenueCalendarV2 } from 'features/offer/components/MoviesScreeningCalendarV2/VenueCalendarV2'
import { useVenueMoviesCalendarQuery } from 'features/offer/queries/useVenueMoviesCalendarQuery'

type Props = {
  venueId: number
}

export const MoviesScreeningCalendarV2: FunctionComponent<Props> = ({ venueId }) => {
  const [calendarStartDatetime] = useState<Date>(new Date())
  const calendarEndDatetime = addDays(calendarStartDatetime, 15)
  const { data: moviesCalendar, isLoading } = useVenueMoviesCalendarQuery({
    venueId,
    from: calendarStartDatetime,
    to: calendarEndDatetime,
  })
  const { calendar } = moviesCalendar || { calendar: [] }
  const dates = calendar?.map((dayMovieScreenings) => dayMovieScreenings.date)

  return !!dates && !isLoading ? (
    <MovieCalendarProviderV2 initialDates={dates}>
      <VenueCalendarV2 calendar={calendar} venueId={venueId} />
    </MovieCalendarProviderV2>
  ) : null
}
