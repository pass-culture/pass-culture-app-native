import React from 'react'
import { View } from 'react-native'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { getStocksByDate, OfferStatus, getDateStatusAndPrice } from '../../services/utils'

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

const renderDay = (status: OfferStatus, selected: boolean, day: number) => {
  if (status === OfferStatus.BOOKABLE) return <Day color={ColorsEnum.PRIMARY}>{day}</Day>
  if (selected)
    return (
      <SelectedDay>
        <SelectedDayNumber color={ColorsEnum.WHITE}>{day}</SelectedDayNumber>
      </SelectedDay>
    )
  if (status === OfferStatus.NOT_BOOKABLE)
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

interface Props {
  stocks: OfferStockResponse[]
}

export const Calendar: React.FC<Props> = ({ stocks }) => {
  const stocksDate = getStocksByDate(stocks)
  return (
    <RNCalendar
      firstDay={1}
      enableSwipeMonths={true}
      renderHeader={(date) => <MonthHeader date={date} />}
      hideExtraDays={true}
      renderArrow={renderArrow}
      dayComponent={({ date }) => {
        const dateStatusAndPrice = getDateStatusAndPrice(new Date(date.timestamp), stocksDate)
        // TODO: PC-6698 change hard coded for real data
        const selected = date.day === 11 && date.month === 2
        return (
          <StyledView>
            {renderDay(dateStatusAndPrice.status, selected, date.day)}
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

const StyledView = styled(View)({ alignItems: 'center' })
