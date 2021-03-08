import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Calendar as RNCalendar, DateObject, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Action, Step } from 'features/bookOffer/pages/reducer'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import {
  getStocksByDate,
  OfferStatus,
  getDateStatusAndPrice,
  formatToKeyDate,
} from '../../services/utils'

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

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const renderDay = (
  status: OfferStatus,
  selected: boolean,
  date: DateObject,
  debouncedDispatch: React.Dispatch<Action>,
  dispatch: React.Dispatch<Action>
) => {
  const selectDate = () => {
    dispatch({ type: 'SELECT_DATE', payload: new Date(date.timestamp) })
    debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }
  if (selected)
    return (
      <SelectedDay>
        <SelectedDayNumber color={ColorsEnum.WHITE}>{date.day}</SelectedDayNumber>
      </SelectedDay>
    )
  if (status === OfferStatus.BOOKABLE)
    return (
      <DayContainer>
        <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={selectDate} hitSlop={hitSlop}>
          <Day color={ColorsEnum.PRIMARY}>{date.day}</Day>
        </TouchableOpacity>
      </DayContainer>
    )
  if (status === OfferStatus.NOT_BOOKABLE)
    return (
      <DayContainer>
        <DiagonalStripe>
          <Day color={ColorsEnum.GREY_DARK}>{date.day}</Day>
        </DiagonalStripe>
      </DayContainer>
    )
  return (
    <DayContainer>
      <Typo.Body color={ColorsEnum.GREY_DARK}>{date.day}</Typo.Body>
    </DayContainer>
  )
}

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
  const { bookingState, dispatch } = useBooking()
  const stocksDate = getStocksByDate(stocks)
  const debouncedDispatch = useRef(debounce(dispatch, 500)).current

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
            {renderDay(
              dateStatusAndPrice.status,
              // @ts-ignore : problem in the definition of marking in the library : see explanation in https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
              marking.selected || false,
              date,
              debouncedDispatch,
              dispatch
            )}
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

const DayContainer = styled(View)({
  height: getSpacing(6),
  justifyContent: 'center',
})

const StyledView = styled(View)({ alignItems: 'center' })
