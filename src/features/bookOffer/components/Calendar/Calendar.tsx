import { format } from 'date-fns'
import React from 'react'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useSelectDay, DayComponent } from 'features/bookOffer/components/Calendar/DayComponent'
import { MonthHeader } from 'features/bookOffer/components/Calendar/MonthHeader'
import {
  defaultMarking,
  Marking,
  useMarkedDates,
  MarkedDates,
} from 'features/bookOffer/components/Calendar/useMarkedDates'
import { OfferStatus } from 'features/bookOffer/helpers/utils'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { formatToFrenchDecimal } from 'libs/parsers'
import { dayNames, dayNamesShort } from 'shared/date/days'
import { monthNames, monthNamesShort } from 'shared/date/months'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'

LocaleConfig.locales['fr'] = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

const renderArrow = (direction: string) => {
  if (direction === 'left') return <ArrowPrevious {...accessibilityAndTestId('Mois précédent')} />
  if (direction === 'right') return <ArrowNext {...accessibilityAndTestId('Mois suivant')} />
  return null
}

const calendarHeaderStyle = {
  textSectionTitleColor: '#696A6F',
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
  enablePricesByCategories?: boolean
  hasSeveralPrices?: boolean
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

export const getDayDescription = (price: number, hasSeveralPrices?: boolean) => {
  let dayDescription = hasSeveralPrices ? 'dès ' : ''
  dayDescription += formatToFrenchDecimal(price).replace(' ', '')

  return dayDescription
}

const RNCalendarTheme = {
  // Prevent calendar height from changing when switching month
  minHeight: 415,
  // Hack to remove unnecessary calendar horizontal margins
  marginHorizontal: getSpacing(-2),
}

export const Calendar: React.FC<Props> = ({
  stocks,
  userRemainingCredit,
  offerId,
  enablePricesByCategories,
  hasSeveralPrices,
}) => {
  const markedDates = useMarkedDates(stocks, userRemainingCredit ?? 0)
  const minDate = getMinAvailableDate(markedDates) ?? format(new Date(), 'yyyy-dd-MM')
  const selectDay = useSelectDay()

  const DayComponentWrapper: React.ComponentProps<typeof RNCalendar>['dayComponent'] = ({
    date,
    marking = defaultMarking,
  }) => {
    // problem in the definition of marking in the library:
    // see https://www.uglydirtylittlestrawberry.co.uk/posts/wix-react-native-calendar-challenges/
    const { price, status, selected } = marking as Marking

    // This case is normally not possible. We add a Sentry log to ensure this
    if (!date) {
      eventMonitoring.captureException('Calendar displayed without selectable day', {
        extra: { offerId, stocks, markedDates, minDate, selectDay, date, marking },
      })
      return null
    }

    if (selected && offerId) {
      analytics.logBookingOfferConfirmDates(offerId)
    }

    const onPress = selectDay({ date, selected, status, enablePricesByCategories })

    return (
      <Container onPress={onPress} disabled={!onPress}>
        <DayComponent
          status={status}
          selected={selected}
          date={date}
          enablePricesByCategories={enablePricesByCategories}
        />
        {typeof price === 'number' ? (
          <Caption status={status}>{getDayDescription(price, hasSeveralPrices)}</Caption>
        ) : (
          <Spacer.Column numberOfSpaces={getSpacing(1)} />
        )}
      </Container>
    )
  }
  return (
    <RNCalendar
      style={RNCalendarTheme}
      current={minDate}
      firstDay={1}
      enableSwipeMonths
      renderHeader={(date) => <MonthHeader date={date as unknown as Date} />}
      hideExtraDays
      renderArrow={renderArrow}
      theme={calendarHeaderStyle}
      markedDates={markedDates}
      dayComponent={DayComponentWrapper}
    />
  )
}

// Only works for iOS but still useful
const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const Caption = styled(Typo.Caption)<{ status: OfferStatus }>(({ status, theme }) => ({
  color: status === OfferStatus.BOOKABLE ? theme.colors.primary : theme.colors.greyDark,
  textAlign: 'center',
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
