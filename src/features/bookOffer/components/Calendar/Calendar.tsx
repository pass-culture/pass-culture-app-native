import { format } from 'date-fns'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

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
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { DAYS, dayNamesShort } from 'shared/date/days'
import { CAPITALIZED_MONTHS, CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'

LocaleConfig.locales['fr'] = {
  monthNames: [...CAPITALIZED_MONTHS],
  monthNamesShort: [...CAPITALIZED_SHORT_MONTHS],
  dayNames: [...DAYS],
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

const renderArrow = (direction: string) => {
  if (direction === 'left') return <ArrowPrevious {...accessibilityAndTestId('Mois précédent')} />
  if (direction === 'right') return <ArrowNext {...accessibilityAndTestId('Mois suivant')} />
  return null
}

type CustomTheme = Theme & {
  'stylesheet.calendar.header': {
    header: StyleProp<ViewStyle>
    week: StyleProp<ViewStyle>
  }
}

const calendarHeaderStyle = (theme: DefaultTheme): CustomTheme => ({
  textSectionTitleColor: theme.colors.greyDark,
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
})

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
  offerId: number | undefined
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

export const getDayDescription = (
  price: number,
  currency: Currency,
  euroToPacificFrancRate: number,
  hasSeveralPrices?: boolean
) => {
  let dayDescription = hasSeveralPrices ? 'dès ' : ''
  dayDescription += formatCurrencyFromCents(price, currency, euroToPacificFrancRate).replace(
    /\u00A0/g,
    ''
  )

  return dayDescription
}

const RNCalendarTheme = {
  // Prevent calendar height from changing when switching month
  minHeight: 415,
  // Hack to remove unnecessary calendar horizontal margins
  marginHorizontal: getSpacing(-2.5),
}

export const Calendar: React.FC<Props> = ({
  stocks,
  userRemainingCredit,
  offerId,
  hasSeveralPrices,
}) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const markedDates = useMarkedDates(stocks, userRemainingCredit ?? 0)
  const minDate = getMinAvailableDate(markedDates) ?? format(new Date(), 'yyyy-dd-MM')
  const selectDay = useSelectDay()
  const theme = useTheme()

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

    const onPress = selectDay({ date, selected, status })

    return (
      <Container onPress={onPress} disabled={!onPress}>
        <DayComponent status={status} selected={selected} date={date} />
        {typeof price === 'number' ? (
          <Caption status={status}>
            {getDayDescription(price, currency, euroToPacificFrancRate, hasSeveralPrices)}
          </Caption>
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
      theme={calendarHeaderStyle(theme)}
      markedDates={markedDates}
      dayComponent={DayComponentWrapper}
    />
  )
}

// Only works for iOS but still useful
const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

const Caption = styled(Typo.BodyAccentXs)<{ status: OfferStatus }>(({ status, theme }) => ({
  color:
    status === OfferStatus.BOOKABLE
      ? theme.designSystem.color.text.brandPrimary
      : theme.designSystem.color.text.subtle,
  textAlign: 'center',
}))

const Container = styled(TouchableOpacity).attrs({ hitSlop })(({ theme }) => ({
  alignItems: 'center',
  width: theme.appContentWidth < theme.breakpoints.xs ? getSpacing(9.5) : getSpacing(11),
}))

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
