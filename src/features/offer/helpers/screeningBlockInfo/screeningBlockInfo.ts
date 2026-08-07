import { Bookability, Screening } from 'api/gen'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'

export const getEventCardLeftSubtitle = (screening: Screening) => {
  switch (screening.bookability) {
    case Bookability.STOCK_BOOKING_IS_DISABLED:
      return EventCardSubtitleEnum.UNAVAILABLE
    case Bookability.STOCK_IS_SOLD_OUT:
      return EventCardSubtitleEnum.FULLY_BOOKED
    case Bookability.USER_HAS_ALREADY_BOOKED_OFFER:
      return EventCardSubtitleEnum.ALREADY_BOOKED
    case Bookability.USER_HAS_INSUFFICIENT_CREDIT:
      return EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
    case Bookability.USER_CANNOT_BOOK:
      return EventCardSubtitleEnum.UNAVAILABLE
    case Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER:
    case Bookability.FINISH_SUBSCRIPTION_REQUIRED:
    case Bookability.USER_APPLICATION_STILL_PROCESSING:
    case Bookability.USER_HAS_APPLICATION_ERROR:
    case Bookability.AUTHENTICATION_REQUIRED:
    case Bookability.BOOKABLE:
      return screening.features.join(', ')
  }
}

export const getEventCardRightSubtitle = (
  screening: Screening,
  currency,
  euroToPacificFrancRate
) => {
  switch (screening.bookability) {
    case Bookability.AUTHENTICATION_REQUIRED:
    case Bookability.BOOKABLE:
    case Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER:
      return formatCurrencyFromCents(screening.price * 100, currency, euroToPacificFrancRate)
    default:
      return ''
  }
}

export const getEventCardIsEnabled = (screening: Screening) => {
  switch (screening.bookability) {
    case Bookability.BOOKABLE:
    case Bookability.AUTHENTICATION_REQUIRED:
    case Bookability.FINISH_SUBSCRIPTION_REQUIRED:
    case Bookability.USER_APPLICATION_STILL_PROCESSING:
    case Bookability.USER_HAS_APPLICATION_ERROR:
      return true
    default:
      return false
  }
}
