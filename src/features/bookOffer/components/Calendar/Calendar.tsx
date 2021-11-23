import React from 'react'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { DateData, Theme } from 'react-native-calendars/src/types'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { OfferStatus } from 'features/bookOffer/services/utils'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { monthNames, monthNamesShort, dayNames, dayNamesShort } from './Calendar.utils'
import { DayComponent, useSelectDay } from './DayComponent'
import { MonthHeader } from './MonthHeader'
import { defaultMarking, Marking, useMarkedDates, MarkedDates } from './useMarkedDates'

LocaleConfig.locales['fr'] = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

const renderArrow = (direction: string) => {
  if (direction === 'left') return <ArrowPrevious />
  if (direction === 'right') return <ArrowNext />
  return <React.Fragment />
}

const calendarHeaderStyle = {
  'stylesheet.calendar.header': {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      alignItems: 'center',
    },
  },
} as Theme

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
  offerId: number | undefined
}

export const getMinAvailableDate = (markedDates: MarkedDates): string | undefined => {
  const availableDates = Object.entries(markedDates)
    .filter(([, marking]) => marking.status === OfferStatus.BOOKABLE)
    .map(([date, _]) => date)

  if (availableDates.length === 0) return undefined
  if (availableDates.length === 1) return availableDates[0]

  return availableDates.sort(
    (dateA, dateB) => new Date(dateA).valueOf() - new Date(dateB).valueOf()
  )[0]
}

// Hack to remove unnecessary calendar horizontal margins
const RNCalendarTheme = { marginHorizontal: getSpacing(-2) }

export const Calendar: React.FC<Props> = ({ stocks, userRemainingCredit, offerId }) => {
  const markedDates = useMarkedDates(stocks, userRemainingCredit || 0)
  const minDate = getMinAvailableDate(markedDates) || new Date()
  const selectDay = useSelectDay()

  return (
    <RNCalendar
      style={RNCalendarTheme}
      current={(minDate as unknown) as LocaleConfig}
      firstDay={1}
      enableSwipeMonths={true}
      renderHeader={(date) => <MonthHeader date={(date as unknown) as Date} />}
      hideExtraDays={true}
      renderArrow={renderArrow}
      theme={calendarHeaderStyle}
      markedDates={markedDates}
      dayComponent={({ date, marking = defaultMarking }: { date: DateData; marking: unknown }) => {
        // problem in the definition of marking in the library:
        // see https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
        const { price, status, selected } = (marking as unknown) as Marking

        if (selected && offerId) {
          analytics.logBookingOfferConfirmDates(offerId)
        }

        const onPress = selectDay({ date, selected, status })

        return (
          <Container onPress={onPress} disabled={!onPress}>
            <DayComponent status={status} selected={selected} date={date} />
            {typeof price === 'number' ? (
              <Typo.Caption
                color={status === OfferStatus.BOOKABLE ? ColorsEnum.PRIMARY : ColorsEnum.GREY_DARK}>
                {formatToFrenchDecimal(price).replace(' ', '')}
              </Typo.Caption>
            ) : (
              <Spacer.Column numberOfSpaces={getSpacing(1)} />
            )}
          </Container>
        )
      }}
    />
  )
}

// Only works for iOS but still useful
const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
  hitSlop,
}))({
  alignItems: 'center',
  width: getSpacing(9.25), // Max width limite for small devices
})
