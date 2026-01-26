import { OfferStockResponse } from 'api/gen'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { DAYS, FullWeekDay, SHORT_DAYS, ShortWeekDay } from 'shared/date/days'
import {
  CAPITALIZED_MONTHS,
  CAPITALIZED_SHORT_MONTHS,
  CapitalizedMonth,
  CapitalizedShortMonth,
} from 'shared/date/months'

export const handleMovieCalendarScroll = (
  currentIndex: number,
  flatListWidth: number,
  itemWidth: number,
  movieCalendarPadding: number
) => {
  //const MOVIE_CALENDAR_PADDING = theme.designSystem.size.spacing.xl
  const shift = flatListWidth / 2 - movieCalendarPadding
  const centerOfSelectedElement = currentIndex * itemWidth + itemWidth / 2

  if (centerOfSelectedElement - shift < 0 || currentIndex === 0) {
    return { offset: 0 }
  }
  return { offset: centerOfSelectedElement - shift }
}

export type DayMapping = {
  shortWeekDay: ShortWeekDay
  fullWeekDay: FullWeekDay
  dayDate: number
  shortMonth: CapitalizedShortMonth
  fullMonth: CapitalizedMonth
  timestamp: number
}

export const getCalendarDateInfo = (date: Date): DayMapping => {
  const dayIndex = date.getDay()
  const monthIndex = date.getMonth()
  const dayDate = date.getDate()
  const timestamp = date.getTime()

  return {
    shortWeekDay: SHORT_DAYS[dayIndex],
    fullWeekDay: DAYS[dayIndex],
    dayDate,
    shortMonth: CAPITALIZED_SHORT_MONTHS[monthIndex],
    fullMonth: CAPITALIZED_MONTHS[monthIndex],
    timestamp,
  }
}

export const getCalendarLabels = (dateInfo: DayMapping, isDesktop: boolean) => {
  return {
    accessibilityLabel: `${dateInfo.fullWeekDay} ${dateInfo.dayDate} ${dateInfo.fullMonth}`,
    weekDay: isDesktop ? dateInfo.fullWeekDay : dateInfo.shortWeekDay,
    month: isDesktop ? dateInfo.fullMonth : dateInfo.shortMonth,
  }
}

type GetScreeningStatusProps = {
  stock: OfferStockResponse
  isExternalBookingsDisabled?: boolean
  hasBookedScreening?: boolean
  isSameVenue?: boolean
  userData?: MovieScreeningUserData
}

type ScreeningStatus = {
  isDisabled: boolean
  subtitleLeft: EventCardSubtitleEnum | string
}

export const getScreeningStatus = ({
  stock,
  isExternalBookingsDisabled,
  hasBookedScreening,
  isSameVenue,
  userData,
}: GetScreeningStatusProps): ScreeningStatus => {
  const { isSoldOut: isScreeningSoldOut } = stock
  const {
    hasNotCompletedSubscriptionYet,
    isUserEligible = true,
    hasEnoughCredit,
    isUserCreditExpired,
    hasBookedOffer,
    isUserLoggedIn,
  } = userData ?? {}

  let isDisabled: boolean
  let subtitleLeft: EventCardSubtitleEnum | string

  switch (true) {
    case isExternalBookingsDisabled:
      subtitleLeft = EventCardSubtitleEnum.UNAVAILABLE
      isDisabled = true
      break
    case isScreeningSoldOut && (!isUserLoggedIn || hasEnoughCredit):
      subtitleLeft = EventCardSubtitleEnum.FULLY_BOOKED
      isDisabled = true
      break
    case hasBookedScreening:
      subtitleLeft = EventCardSubtitleEnum.ALREADY_BOOKED
      isDisabled = true
      break
    case isUserCreditExpired || (isSameVenue && hasBookedOffer) || !isUserEligible:
      subtitleLeft = stock.features.join(', ')
      isDisabled = true
      break
    case isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet:
      subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
      isDisabled = true
      break
    default:
      subtitleLeft = stock.features.join(', ')
      isDisabled = false
  }

  return { subtitleLeft, isDisabled }
}

export const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split('h').map(Number)
  if (hours === undefined || minutes === undefined) return 0
  return hours * 60 + minutes
}
