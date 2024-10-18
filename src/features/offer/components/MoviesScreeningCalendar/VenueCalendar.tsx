import React, { FunctionComponent, useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useMoviesScreeningsList } from 'features/offer/components/MoviesScreeningCalendar/hook/useMoviesScreeningsList'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
  offerIds: number[]
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
