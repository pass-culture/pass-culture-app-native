import React, { FunctionComponent, useMemo, useRef } from 'react'
import { View, FlatList } from 'react-native'
import styled from 'styled-components/native'

import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { getDates } from 'shared/date/getDates'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  offerIds: number[]
}
export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ offerIds }) => {
  const { data: offersWithStocks } = useOffersStocks({ offerIds })
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
      <FlatList
        data={offersWithStocks?.offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Typo.Body>{JSON.stringify(item)}</Typo.Body>}
      />
    </MovieCalendarContainer>
  )
}

const MovieCalendarContainer = styled(View)({})
