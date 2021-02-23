import React from 'react'
import { View } from 'react-native'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { monthNames, monthNamesShort, dayNames, dayNamesShort } from './Calendar.utils'
import { DiagonalStripe } from './DiagonalStripe'
import { MonthHeader } from './MonthHeader'

LocaleConfig.locales['fr'] = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

const renderDay = (bookable: boolean, notBookable: boolean, selected: boolean, day: number) => {
  if (bookable) return <Day color={ColorsEnum.PRIMARY}>{day}</Day>
  if (selected)
    return (
      <SelectedDay>
        <SelectedDayNumber color={ColorsEnum.WHITE}>{day}</SelectedDayNumber>
      </SelectedDay>
    )
  if (notBookable)
    return (
      <DiagonalStripe>
        <Day color={ColorsEnum.GREY_DARK}>{day}</Day>
      </DiagonalStripe>
    )
  return <Typo.Body color={ColorsEnum.GREY_DARK}>{day}</Typo.Body>
}

const renderArrow = (direction: string) => {
  if (direction === 'left') return <ArrowPrevious />
  if (direction === 'right') return <ArrowNext />
  return <React.Fragment />
}

export const Calendar: React.FC = () => (
  <RNCalendar
    firstDay={1}
    enableSwipeMonths={true}
    renderHeader={(date) => <MonthHeader date={date} />}
    hideExtraDays={true}
    renderArrow={renderArrow}
    dayComponent={({ date }) => {
      const bookable = date.day === 21 || date.day === 3
      // TODO: PC-6695 change hard coded for real data
      const displayPrice =
        date.day === 20 ||
        date.day === 21 ||
        date.day === 2 ||
        date.day === 3 ||
        (date.day === 11 && date.month === 2)
      // TODO: PC-6716 change hard coded for real data
      const notBookable = date.day === 20 || date.day === 2
      // TODO: PC-6698 change hard coded for real data
      const selected = date.day === 11 && date.month === 2
      return (
        <View>
          {renderDay(bookable, notBookable, selected, date.day)}
          {displayPrice ? (
            // eslint-disable-next-line react-native/no-raw-text
            <Typo.Caption color={notBookable ? ColorsEnum.GREY_DARK : ColorsEnum.PRIMARY}>
              19,90€
            </Typo.Caption>
          ) : (
            <Spacer.Column numberOfSpaces={getSpacing(1)} />
          )}
        </View>
      )
    }}
  />
)

const Day = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const SelectedDay = styled(View)({
  backgroundColor: ColorsEnum.PRIMARY,
  borderRadius: getSpacing(3),
  width: getSpacing(6),
  height: getSpacing(6),
  alignSelf: 'center',
  justifyContent: 'center',
})

const SelectedDayNumber = styled(Typo.ButtonText)({
  alignSelf: 'center',
})
