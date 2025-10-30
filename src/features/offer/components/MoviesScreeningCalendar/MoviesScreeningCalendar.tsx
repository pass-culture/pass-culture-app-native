import React, { FunctionComponent } from 'react'

import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { VenueCalendar } from 'features/offer/components/MoviesScreeningCalendar/VenueCalendar'
import { VenueOffers } from 'features/venue/types'
import { getDates } from 'shared/date/getDates'

type Props = {
  venueMovieOffers: VenueOffers
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueMovieOffers }) => {
  const offerIds = venueMovieOffers.hits.map((offer) => Number(offer.objectID))

  const next15Dates = getDates(new Date(), 15)

  return (
    <MovieCalendarProvider initialDates={next15Dates}>
      <VenueCalendar venueOffers={venueMovieOffers} offerIds={offerIds} />
    </MovieCalendarProvider>
  )
}
