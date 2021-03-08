import React from 'react'
import { View } from 'react-native'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import {
  getStocksByDate,
  OfferStatus,
  getDateStatusAndPrice,
  formatToKeyDate,
} from '../../services/utils'

import { monthNames, monthNamesShort, dayNames, dayNamesShort } from './Calendar.utils'
import { DayComponent } from './DayComponent'
import { MonthHeader } from './MonthHeader'

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

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
}

export const Calendar: React.FC<Props> = ({ stocks, userRemainingCredit }) => {
  const { bookingState } = useBooking()
  const stocksDate = getStocksByDate(stocks)

  const markedDates: { [keyDate: string]: { selected: boolean } } = {}
  if (bookingState.date) {
    const keyDate = formatToKeyDate(bookingState.date)
    markedDates[keyDate] = { selected: true }
  }

  return (
    <RNCalendar
      firstDay={1}
      enableSwipeMonths={true}
      renderHeader={(date) => <MonthHeader date={date} />}
      hideExtraDays={true}
      renderArrow={renderArrow}
      markedDates={markedDates}
      dayComponent={({ date, marking }) => {
        const dateStatusAndPrice = getDateStatusAndPrice(
          new Date(date.timestamp),
          stocksDate,
          userRemainingCredit
        )

        return (
          <StyledView>
            <DayComponent
              status={dateStatusAndPrice.status}
              // @ts-ignore : problem in the definition of marking in the library: see explanation in https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
              selected={marking.selected || false}
              date={date}
            />
            {dateStatusAndPrice.price ? (
              <Typo.Caption
                color={
                  dateStatusAndPrice.status === OfferStatus.NOT_BOOKABLE
                    ? ColorsEnum.GREY_DARK
                    : ColorsEnum.PRIMARY
                }>
                {dateStatusAndPrice.price}
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
