import React, { FunctionComponent, useMemo, useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import {
  getNextMoviesByDate,
  MovieOffer,
} from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
  offerIds: number[]
}

const useMoviesScreeningsList = (offerIds: number[]) => {
  const { selectedDate } = useMovieCalendar()
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const moviesOffers: MovieOffer[] = useMemo(() => {
    const filteredOffersWithStocks = filterOffersStocksByDate(
      offersWithStocks?.offers || [],
      selectedDate
    )
    const nextScreeningOffers = getNextMoviesByDate(offersWithStocks?.offers || [], selectedDate)

    return [...filteredOffersWithStocks, ...nextScreeningOffers]
  }, [offersWithStocks?.offers, selectedDate]).filter(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  return {
    moviesOffers,
  }
}

export const VenueCalendar: FunctionComponent<Props> = ({ venueOffers, offerIds }) => {
  const { moviesOffers } = useMoviesScreeningsList(offerIds)

  const getIsLast = useCallback(
    (index: number) => {
      const length = moviesOffers.length ?? 0
      return index === length - 1
    },
    [moviesOffers.length]
  )

  return (
    <Container>
      <Spacer.Column numberOfSpaces={4} />
      {moviesOffers.map((movie, index) => (
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
