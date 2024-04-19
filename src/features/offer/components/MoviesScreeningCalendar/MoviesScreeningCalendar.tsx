import React, { FunctionComponent, useMemo, useRef } from 'react'
import { View, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { getDates } from 'shared/date/getDates'
import { Spacer } from 'ui/theme'

export const MoviesScreeningCalendar: FunctionComponent = () => {
  const flatListRef = useRef<FlatList | null>(null)
  const calendarDates = useMemo(() => getDates(new Date(), 15), [])
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
