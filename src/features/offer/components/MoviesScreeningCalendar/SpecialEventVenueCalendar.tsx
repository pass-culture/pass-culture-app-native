import React, { FunctionComponent, useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getSpecialEventVenueMovieOffers } from 'features/offer/components/MoviesScreeningCalendar/helpers/getSpecialEventVenueMovieOffers'
import {
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { SpecialEventMovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/SpecialEventMovieOfferTile'
import { useOffersStocksSpecialEventQuery } from 'features/offer/queries/useOffersStocksSpecialEventQuery'
import { VenueOffers } from 'features/venue/types'

type Props = {
  venueOffers: VenueOffers
  offerIds: number[]
}

export const SpecialEventVenueCalendar: FunctionComponent<Props> = ({ venueOffers, offerIds }) => {
  const { data: offersWithStocks } = useOffersStocksSpecialEventQuery({ offerIds })

  const { selectedDate } = useMovieCalendar()

  const { venueMovieOffers, hasStocksOnlyAfter15Days } = getSpecialEventVenueMovieOffers(
    selectedDate,
    offersWithStocks
  )

  useDisplayCalendar(!hasStocksOnlyAfter15Days)

  const getIsLast = useCallback(
    (index: number) => {
      const length = venueMovieOffers.length
      return index === length - 1
    },
    [venueMovieOffers.length]
  )

  return (
    <Container>
      {venueMovieOffers.map((movie, index) => (
        <SpecialEventMovieOfferTile
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
  paddingTop: theme.designSystem.size.spacing.l,
}))
