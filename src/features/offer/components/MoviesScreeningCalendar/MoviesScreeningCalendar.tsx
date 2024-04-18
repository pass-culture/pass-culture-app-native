import React, { FunctionComponent, useMemo, useRef } from 'react'
import { View, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { Spacer } from 'ui/theme'

function generateDates(start: Date, count: number): Date[] {
  const dates: Date[] = [start]
  for (let i = 1; i < count; i++) {
    const newDate = new Date(start)
    newDate.setDate(start.getDate() + i)
    dates.push(newDate)
  }
  return dates
}

export const MoviesScreeningCalendar: FunctionComponent = () => {
  const flatListRef = useRef<FlatList | null>(null)
  const calendarDates = useMemo(() => generateDates(new Date(), 15), [])
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(calendarDates[0])

  return (
    <MovieCalendarContainer>
      <MovieCalendar
        dates={calendarDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        flatListRef={flatListRef}
      />
      <Spacer.Column numberOfSpaces={4} />
    </MovieCalendarContainer>
  )
}

const MovieCalendarContainer = styled(View)({})
