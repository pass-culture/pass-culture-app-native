import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { LocaleConfig, Calendar as RNCalendar } from 'react-native-calendars'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { DateData, Theme } from 'react-native-calendars/src/types'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { DayComponent, useSelectDay } from 'features/bookOffer/components/Calendar/DayComponent'
import { MonthHeader } from 'features/bookOffer/components/Calendar/MonthHeader'
import {
  MarkedDates,
  Marking,
  defaultMarking,
  useMarkedDates,
} from 'features/bookOffer/components/Calendar/useMarkedDates'
import { OfferStatus } from 'features/bookOffer/helpers/utils'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { DAYS, dayNamesShort } from 'shared/date/days'
import { CAPITALIZED_MONTHS, CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Spacer, Typo, getSpacing } from 'ui/theme'

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
  // UX decision: align with disabled background token for the muted state
  textDisabledColor: theme.designSystem.color.background.disabled,
  calendarBackground: theme.designSystem.color.background.default,
  dayTextColor: theme.designSystem.color.text.default,
  todayTextColor: theme.designSystem.color.text.default,
  monthTextColor: theme.designSystem.color.text.default,
  textSectionTitleColor: theme.designSystem.color.text.subtle,
  backgroundColor: theme.designSystem.color.background.default,
  textDayFontFamily: theme.designSystem.typography.body.fontFamily,
  textMonthFontFamily: theme.designSystem.typography.body.fontFamily,
  textDayHeaderFontFamily: theme.designSystem.typography.body.fontFamily,
  textDayFontWeight: 500,
  textMonthFontWeight: 500,
  textDayHeaderFontWeight: 500,
  todayButtonFontWeight: 600,
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

type CalendarDayProps = {
  date?: string & DateData
  marking?: MarkingProps
  selectDay: ReturnType<typeof useSelectDay>
  currency: Currency
  euroToPacificFrancRate: number
  offerId: number | undefined
  hasSeveralPrices?: boolean
  stocks: OfferStockResponse[]
  markedDates: MarkedDates
  minDate: string
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  marking = defaultMarking,
  selectDay,
  currency,
  euroToPacificFrancRate,
  offerId,
  hasSeveralPrices,
  stocks,
  markedDates,
  minDate,
}) => {
  const { price, status, selected } = marking as Marking
  const { designSystem } = useTheme()
  if (!date) {
    eventMonitoring.captureException('Calendar displayed without selectable day', {
      extra: { offerId, stocks, markedDates, minDate, selectDay, date, marking },
    })
    return null
  }

  if (selected && offerId) {
    void analytics.logBookingOfferConfirmDates(offerId)
  }

  const onPress = selectDay({ date, selected, status })

  const isAccessible = typeof price === 'number'

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    date.dateString,
    isAccessible
      ? getDayDescription(price, currency, euroToPacificFrancRate, hasSeveralPrices)
      : 'Indisponible',
    selected ? 'Sélectionné' : undefined
  )

  return (
    <Container
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={AccessibilityRole.BUTTON}
      accessibilityLabel={computedAccessibilityLabel}
      accessible={isAccessible}
      importantForAccessibility={isAccessible ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!isAccessible}>
      <DayComponent status={status} selected={selected} date={date} />
      {typeof price === 'number' ? (
        <Caption status={status}>
          {getDayDescription(price, currency, euroToPacificFrancRate, hasSeveralPrices)}
        </Caption>
      ) : (
        <Spacer.Column numberOfSpaces={designSystem.size.spacing.xs} />
      )}
    </Container>
  )
}

export const Calendar: React.FC<Props> = ({
  stocks,
  userRemainingCredit,
  offerId,
  hasSeveralPrices,
}) => {
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const markedDates = useMarkedDates(stocks, userRemainingCredit ?? 0)
  const minDate = getMinAvailableDate(markedDates) ?? format(new Date(), 'yyyy-dd-MM')
  const selectDay = useSelectDay()
  const theme = useTheme()

  const renderDay = useCallback<
    NonNullable<React.ComponentProps<typeof RNCalendar>['dayComponent']>
  >(
    (props) => (
      <CalendarDay
        {...props}
        selectDay={selectDay}
        currency={currency}
        euroToPacificFrancRate={euroToPacificFrancRate}
        offerId={offerId}
        hasSeveralPrices={hasSeveralPrices}
        stocks={stocks}
        markedDates={markedDates}
        minDate={minDate}
      />
    ),
    [
      selectDay,
      currency,
      euroToPacificFrancRate,
      offerId,
      hasSeveralPrices,
      stocks,
      markedDates,
      minDate,
    ]
  )
  const RNCalendarTheme = {
    // Prevent calendar height from changing when switching month
    minHeight: 415,
    // Hack to remove unnecessary calendar horizontal margins
    marginHorizontal: -theme.designSystem.size.spacing.m,
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
      dayComponent={renderDay}
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
  width:
    theme.appContentWidth < theme.breakpoints.xs
      ? theme.designSystem.size.spacing.xxxl
      : getSpacing(11),
}))

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
