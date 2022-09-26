import { format } from 'date-fns'
import React from 'react'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { DateData, Theme } from 'react-native-calendars/src/types'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { OfferStatus } from 'features/bookOffer/services/utils'
import { analytics } from 'libs/firebase/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  if (direction === 'left') return <ArrowPrevious accessibilityLabel="Mois précédent" />
  if (direction === 'right') return <ArrowNext accessibilityLabel="Mois suivant" />
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
    week: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 7,
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

  return [...availableDates].sort(
    (dateA, dateB) => new Date(dateA).valueOf() - new Date(dateB).valueOf()
  )[0]
}

const RNCalendarTheme = {
  // Prevent calendar height from changing when switching month
  minHeight: 415,
  // Hack to remove unnecessary calendar horizontal margins
  marginHorizontal: getSpacing(-2),
}

export const Calendar: React.FC<Props> = ({ stocks, userRemainingCredit, offerId }) => {
  const markedDates = useMarkedDates(stocks, userRemainingCredit || 0)
  const minDate = getMinAvailableDate(markedDates) || format(new Date(), 'yyyy-dd-MM')
  const selectDay = useSelectDay()

  return (
    <RNCalendar
      style={RNCalendarTheme}
      current={minDate}
      firstDay={1}
      enableSwipeMonths={true}
      renderHeader={(date) => <MonthHeader date={date as unknown as Date} />}
      hideExtraDays={true}
      renderArrow={renderArrow}
      theme={calendarHeaderStyle}
      markedDates={markedDates}
      dayComponent={
        (({ date, marking = defaultMarking }: { date: DateData; marking: unknown }) => {
          // problem in the definition of marking in the library:
          // see https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
          const { price, status, selected } = marking as Marking

          if (selected && offerId) {
            analytics.logBookingOfferConfirmDates(offerId)
          }

          const onPress = selectDay({ date, selected, status })

          return (
            <Container onPress={onPress} disabled={!onPress}>
              <DayComponent status={status} selected={selected} date={date} />
              {typeof price === 'number' ? (
                <Caption status={status}>{formatToFrenchDecimal(price).replace(' ', '')}</Caption>
              ) : (
                <Spacer.Column numberOfSpaces={getSpacing(1)} />
              )}
            </Container>
          )
        }) as React.ComponentType
      }
    />
  )
}

// Only works for iOS but still useful
const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const Caption = styled(Typo.Caption)<{ status: OfferStatus }>(({ status, theme }) => ({
  color: status === OfferStatus.BOOKABLE ? theme.colors.primary : theme.colors.greyDark,
}))

const Container = styled(TouchableOpacity).attrs({
  hitSlop,
})({
  alignItems: 'center',
  width: getSpacing(9.25), // Max width limite for small devices
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
