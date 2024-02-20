import React from 'react'

import { MovieCalendar } from 'features/offerv2/components/MovieCalendar/MovieCalendar'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { Spacer } from 'ui/theme'

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

const dummySessions: EventCardProps[] = [
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '8h',
    subtitleLeft: 'VO, 3D',
    subtitleRight: '5,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '9h30',
    subtitleLeft: 'VF, ICE, 3D',
    subtitleRight: '7,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '10h55',
    subtitleLeft: 'Complet',
    subtitleRight: '12,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '11h35',
    subtitleLeft: 'VO, 3D',
    subtitleRight: '11,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '13h12',
    subtitleLeft: 'Crédit insuffisant',
    // subtitleRight: '13,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '14h25',
    subtitleLeft: 'VO, 3D',
    subtitleRight: '7,50€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '19h15',
    subtitleLeft: 'VF, ICE, 3D',
    subtitleRight: '9,50€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '22h05',
    subtitleLeft: 'VO',
    subtitleRight: '11,50€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '23h05',
    subtitleLeft: 'VO',
    subtitleRight: '11,50€',
  },
]

export const CheatCodeMovieCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(dummyDates[0])

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <MovieCalendar dates={dummyDates} selectedDate={selectedDate} onTabChange={setSelectedDate} />
      <Spacer.Column numberOfSpaces={6} />
      <EventCardList data={dummySessions} />
    </React.Fragment>
  )
}
