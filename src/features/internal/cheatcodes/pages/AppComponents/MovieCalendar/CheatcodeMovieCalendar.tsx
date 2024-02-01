import React from 'react'

import { MovieCalendar } from 'features/offerv2/components/MovieCalendar/MovieCalendar'

const dummyDates: Date[] = [
  new Date(1296518400000), // 1er février 2011 (Mardi)
  new Date(1330627200000), // 1er mars 2012 (Jeudi)
  new Date(1380912000000), // 4 octobre 2013 (Vendredi)
  new Date(1417286400000), // 30 novembre 2014 (Dimanche)
  new Date(1464739200000), // 31 mai 2016 (Mardi)
  new Date(1509532800000), // 1er novembre 2017 (Mercredi)
  new Date(1559376000000), // 1er juin 2019 (Samedi)
  new Date(1606780800000), // 1er décembre 2022 (Jeudi)
  new Date(1654099200000), // 31 mai 2024 (Vendredi)
]

export const CheatCodeMovieCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(dummyDates[0])

  return (
    <MovieCalendar dates={dummyDates} selectedDate={selectedDate} onTabChange={setSelectedDate} />
  )
}
