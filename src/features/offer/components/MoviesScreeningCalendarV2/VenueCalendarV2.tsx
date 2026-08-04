import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { DayMovieScreenings } from 'api/gen'
import {
  useDisplayCalendar,
  useMovieCalendar,
} from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTileV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieOfferTileV2'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'

type Props = {
  calendar: DayMovieScreenings[]
  venueId: number
}

export const VenueCalendarV2: FunctionComponent<Props> = ({ calendar, venueId }) => {
  const { selectedDate, disableDates } = useMovieCalendar()
  const shouldDisplayCalendar = calendar.some((dayMovieScreenings) =>
    dayMovieScreenings.screenings.some(
      (movieScreenings) => movieScreenings.dayScreenings.length > 0
    )
  )
  disableDates(
    calendar
      .filter((dayMovieScreenings) =>
        dayMovieScreenings.screenings.every(
          (movieScreenings) => movieScreenings.dayScreenings.length === 0
        )
      )
      .map((dayMovieScreenings) => new Date(dayMovieScreenings.date))
  )
  const selectedDateMovies = calendar.find(
    (dayMovieScreenings) =>
      dayMovieScreenings.date === formatDateToISOStringWithoutTime(selectedDate)
  )
  const dayScreenings = selectedDateMovies?.screenings

  useDisplayCalendar(shouldDisplayCalendar)

  const getIsLast = (index: number) => {
    const length = selectedDateMovies?.screenings.length ?? 0
    return index === length - 1
  }

  return (
    <Container>
      {dayScreenings?.map((movieScreenings, index) => (
        <MovieOfferTileV2
          movieScreenings={movieScreenings}
          venueId={venueId}
          key={movieScreenings.offerId}
          isLast={getIsLast(index)}
        />
      ))}
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingTop: theme.designSystem.size.spacing.l,
}))
