import React, { FunctionComponent } from 'react'

import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { VenueCalendar } from 'features/offer/components/MoviesScreeningCalendar/VenueCalendar'
import { VenueOffers } from 'features/venue/types'
import { getDates } from 'shared/date/getDates'

type Props = {
  venueOffers: VenueOffers
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))

  const next15Dates = getDates(new Date(), 15)

  return (
    <MovieCalendarProvider initialDates={next15Dates}>
      <VenueCalendar venueOffers={venueOffers} offerIds={offerIds} />
    </MovieCalendarProvider>
  )
}
