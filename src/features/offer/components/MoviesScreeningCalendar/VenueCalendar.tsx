import React, { FunctionComponent, useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getVenueMovieOffers } from 'features/offer/components/MoviesScreeningCalendar/hook/getVenueMovieOffers'
import {
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { useOffersStocksQuery } from 'features/offer/queries/useOffersStocksQuery'
import { VenueOffers } from 'features/venue/types'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
  offerIds: number[]
}

export const VenueCalendar: FunctionComponent<Props> = ({ venueOffers, offerIds }) => {
  const { data: offersWithStocks } = useOffersStocksQuery({ offerIds })

  const { selectedDate } = useMovieCalendar()

  const { venueMovieOffers, hasStocksOnlyAfter15Days } = getVenueMovieOffers(
    selectedDate,
    offersWithStocks
  )

  useDisplayCalendar(!hasStocksOnlyAfter15Days)

  const getIsLast = useCallback(
    (index: number) => {
      const length = venueMovieOffers?.length ?? 0
      return index === length - 1
    },
    [venueMovieOffers?.length]
  )

  return (
    <Container>
      <Spacer.Column numberOfSpaces={4} />
      {venueMovieOffers?.map((movie, index) => (
        <MovieOfferTile
          key={movie.offer.id}
          movieOffer={movie}
          venueOffers={venueOffers}
          isLast={getIsLast(index)}
          nextScreeningDate={movie.nextDate}
        />
      ))}
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
