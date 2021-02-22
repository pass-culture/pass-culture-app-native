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

const renderDay = (state: string, notAvailable: boolean, selected: boolean, day: number) => {
  if (state === 'disabled') return <Typo.Body color={ColorsEnum.GREY_DARK}>{day}</Typo.Body>
  if (selected)
    return (
      <SelectedDay>
        <Typo.ButtonText color={ColorsEnum.WHITE}>{day}</Typo.ButtonText>
      </SelectedDay>
    )
  if (notAvailable)
    return (
      <DiagonalStripe>
        <Day color={ColorsEnum.GREY_DARK}>{day}</Day>
      </DiagonalStripe>
    )
  // TODO: PC-6694 change hard coded for real data
  return <Day color={ColorsEnum.PRIMARY}>{day}</Day>
}

export const Calendar: React.FC = () => (
  <React.Fragment>
    <Spacer.TopScreen />
    <CalendarList
      hideDayNames={true}
      firstDay={1}
      pastScrollRange={0}
      futureScrollRange={50}
      scrollEnabled={true}
      showScrollIndicator={true}
      renderHeader={(date) => <MonthHeader date={date} />}
      dayComponent={({ date, state }) => {
        // TODO: PC-6695 change hard coded for real data
        const displayPrice = date.day === 20 || date.day === 21 || date.day === 2 || date.day === 3
        // TODO: PC-6716 change hard coded for real data
        const notAvailable = date.day === 20 || date.day === 2
        // TODO: PC-6698 change hard coded for real data
        const selected = date.day === 10 && date.month === 2
        return (
          <View>
            {renderDay(state, notAvailable, selected, date.day)}
            {displayPrice ? (
              // eslint-disable-next-line react-native/no-raw-text
              <Typo.Caption color={notAvailable ? ColorsEnum.GREY_DARK : ColorsEnum.PRIMARY}>
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
