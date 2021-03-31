import React from 'react'
import { View } from 'react-native'
import { Calendar as RNCalendar, CalendarTheme, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { OfferStatus } from 'features/bookOffer/services/utils'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { monthNames, monthNamesShort, dayNames, dayNamesShort } from './Calendar.utils'
import { DayComponent } from './DayComponent'
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
} as CalendarTheme

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

export const Calendar: React.FC<Props> = ({ stocks, userRemainingCredit, offerId }) => {
  const markedDates = useMarkedDates(stocks, userRemainingCredit || 0)
  const minDate = getMinAvailableDate(markedDates) || new Date()

  return (
    <RNCalendar
      current={minDate}
      firstDay={1}
      enableSwipeMonths={true}
      renderHeader={(date) => <MonthHeader date={date} />}
      hideExtraDays={true}
      renderArrow={renderArrow}
      theme={calendarHeaderStyle}
      markedDates={markedDates}
      dayComponent={({ date, marking = defaultMarking }) => {
        // problem in the definition of marking in the library:
        // see https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
        const { price, status, selected } = (marking as unknown) as Marking

        if (selected && offerId) {
          analytics.logBookingOfferConfirmDates(offerId)
        }
        return (
          <StyledView>
            <DayComponent status={status} selected={selected} date={date} />
            {typeof price === 'number' ? (
              <Typo.Caption
                color={status === OfferStatus.BOOKABLE ? ColorsEnum.PRIMARY : ColorsEnum.GREY_DARK}>
                {formatToFrenchDecimal(price).replace(' ', '')}
              </Typo.Caption>
            ) : (
              <Spacer.Column numberOfSpaces={getSpacing(1)} />
            )}
          </StyledView>
        )
      }}
    />
  )
}

const StyledView = styled(View)({ alignItems: 'center' })
