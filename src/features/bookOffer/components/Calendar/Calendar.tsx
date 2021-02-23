import React from 'react'
import { View } from 'react-native'
import { CalendarList, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

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
        <Typo.ButtonText color={ColorsEnum.WHITE}>{day}</Typo.ButtonText>
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

export const Calendar: React.FC = () => (
  <React.Fragment>
    {/* TODO: PC-6693 remove this line */}
    <Spacer.TopScreen />
    <CalendarList
      hideDayNames={true}
      firstDay={1}
      dayComponent={({ date }) => {
        const bookable = date.day === 21 || date.day === 3
        // TODO: PC-6695 change hard coded for real data
        const displayPrice = date.day === 20 || date.day === 21 || date.day === 2 || date.day === 3
        // TODO: PC-6716 change hard coded for real data
        const notBookable = date.day === 20 || date.day === 2
        // TODO: PC-6698 change hard coded for real data
        const selected = date.day === 10 && date.month === 2
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
  </React.Fragment>
)

const Day = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const SelectedDay = styled(View)({
  backgroundColor: ColorsEnum.PRIMARY,
  borderRadius: 16,
  width: getSpacing(6),
  height: getSpacing(6),
  alignItems: 'center',
  justifyContent: 'center',
})
