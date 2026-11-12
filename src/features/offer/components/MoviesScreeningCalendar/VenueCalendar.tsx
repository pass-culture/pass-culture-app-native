import React, { FunctionComponent, useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getVenueMovieOffers } from 'features/offer/components/MoviesScreeningCalendar/helpers/getVenueMovieOffers'
import {
  useDisplayCalendar,
  useDisplaySpecialEventBanner,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { getHasSpecialEventScreenings } from 'features/offer/components/OfferCine/getHasSpecialEventScreening'
import { useOffersStocksQuery } from 'features/offer/queries/useOffersStocksQuery'
import { VenueOffers } from 'features/venue/types'

type Props = {
  venueOffers: VenueOffers
  offerIds: number[]
}

export const VenueCalendar: FunctionComponent<Props> = ({ venueOffers, offerIds }) => {
  const { data: offersWithStocks } = useOffersStocksQuery({ offerIds })

  const { dates, selectedDate } = useMovieCalendar()
  const shouldDisplaySpecialEventBanner = getHasSpecialEventScreenings(
    offersWithStocks?.offers,
    dates
  )

  const { venueMovieOffers, hasStocksOnlyAfter15Days } = getVenueMovieOffers(
    selectedDate,
    offersWithStocks
  )

  useDisplayCalendar(!hasStocksOnlyAfter15Days)
  useDisplaySpecialEventBanner(shouldDisplaySpecialEventBanner)

  const getIsLast = useCallback(
    (index: number) => {
      const length = venueMovieOffers?.length ?? 0
      return index === length - 1
    },
    [venueMovieOffers?.length]
  )

  return (
    <Container>
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
  paddingTop: theme.designSystem.size.spacing.l,
}))
