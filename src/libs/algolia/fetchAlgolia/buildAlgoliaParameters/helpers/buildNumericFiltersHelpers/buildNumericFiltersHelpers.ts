import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { clampPrice, MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { NUMERIC_FILTERS_ENUM } from 'libs/algolia/enums'
import {
  TIMESTAMP,
  computeTimeRangeFromHoursToSeconds,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/datetime/time'
import { FiltersArray, SearchParametersQuery } from 'libs/algolia/types'
import { Range, NoNullProperties } from 'libs/typesUtils/typeHelpers'

export const buildOfferLast30DaysBookings = (
  minBookingsThreshold: number | undefined
): FiltersArray[0] | undefined => {
  if (!minBookingsThreshold) return undefined
  return [`${NUMERIC_FILTERS_ENUM.OFFER_LAST_30_DAYS_BOOKINGS} >= ${minBookingsThreshold}`]
}

export const buildOfferPriceRangePredicate = ({
  offerIsFree,
  priceRange,
  minPrice,
  maxPrice,
  maxPossiblePrice,
}: Pick<
  SearchParametersQuery,
  'offerIsFree' | 'priceRange' | 'minPrice' | 'maxPrice' | 'maxPossiblePrice'
>): FiltersArray[0] | undefined => {
  if (offerIsFree) return [`${NUMERIC_FILTERS_ENUM.OFFER_PRICES} = 0`]

  const formatMinPrice = getPriceAsNumber(minPrice) || 0
  const formatMaxPrice =
    getPriceAsNumber(maxPrice) || getPriceAsNumber(maxPossiblePrice) || MAX_PRICE
  const formatPriceRange: Range<number> = priceRange || [formatMinPrice, formatMaxPrice]
  if (formatPriceRange)
    return [`${NUMERIC_FILTERS_ENUM.OFFER_PRICES}: ${clampPrice(formatPriceRange).join(' TO ')}`]

  return [`${NUMERIC_FILTERS_ENUM.OFFER_PRICES}: 0 TO 300`]
}

export const buildDatePredicate = ({
  date,
  timeRange,
}: Pick<SearchParametersQuery, 'date' | 'timeRange'>): FiltersArray[0] | undefined => {
  if (date && timeRange) return buildDateAndTimePredicate({ date, timeRange })
  if (date) return buildDateOnlyPredicate(date)
  if (timeRange) return buildTimeOnlyPredicate(timeRange)
  return undefined
}

export const buildHomepageDatePredicate = ({
  beginningDatetime,
  endingDatetime,
}: Pick<SearchParametersQuery, 'beginningDatetime' | 'endingDatetime'>):
  | undefined
  | FiltersArray[0] => {
  if (!(beginningDatetime || endingDatetime)) return undefined
  const formattedBeginningDatetime = beginningDatetime ? new Date(beginningDatetime) : undefined
  const formattedEndingDatetime = endingDatetime ? new Date(endingDatetime) : undefined

  if (formattedBeginningDatetime && !formattedEndingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(formattedBeginningDatetime)
    return [`${NUMERIC_FILTERS_ENUM.OFFER_DATES} >= ${beginningTimestamp}`]
  }

  if (!formattedBeginningDatetime && formattedEndingDatetime) {
    const endingTimestamp = TIMESTAMP.getFromDate(formattedEndingDatetime)
    return [`${NUMERIC_FILTERS_ENUM.OFFER_DATES} <= ${endingTimestamp}`]
  }

  if (formattedBeginningDatetime && formattedEndingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(formattedBeginningDatetime)
    const endingTimestamp = TIMESTAMP.getFromDate(formattedEndingDatetime)
    return [getDatePredicate(beginningTimestamp, endingTimestamp)]
  }

  return undefined
}

export const buildTimeOnlyPredicate = (timeRange: Range<number>): FiltersArray[0] => {
  const timeRangeInSeconds = computeTimeRangeFromHoursToSeconds(timeRange)
  return [`${NUMERIC_FILTERS_ENUM.OFFER_TIMES}: ${timeRangeInSeconds.join(' TO ')}`]
}

export const buildDateAndTimePredicate = ({
  date,
  timeRange,
}: NoNullProperties<
  Required<Pick<SearchParametersQuery, 'date' | 'timeRange'>>
>): FiltersArray[0] => {
  let dateFilter: Range<number>[]
  // To be sure to have a value in Date format
  const selectedDate = new Date(date.selectedDate)
  switch (date.option) {
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      dateFilter = TIMESTAMP.WEEK.getAllFromTimeRangeAndDate(selectedDate, timeRange)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      dateFilter = TIMESTAMP.WEEK_END.getAllFromTimeRangeAndDate(selectedDate, timeRange)
      break
    default:
      dateFilter = [TIMESTAMP.getAllFromTimeRangeAndDate(selectedDate, timeRange)]
  }

  return dateFilter.map((timestampsRangeForADay) => getDatePredicate(...timestampsRangeForADay))
}

export const buildDateOnlyPredicate = (
  date: Exclude<SearchParametersQuery['date'], null | undefined>
): FiltersArray[0] => {
  let beginningDate, endingDate: number
  // To be sure to have a value in Date format
  const selectedDate = new Date(date.selectedDate)
  switch (date.option) {
    case DATE_FILTER_OPTIONS.TODAY:
      beginningDate = TIMESTAMP.getFromDate(selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      beginningDate = TIMESTAMP.getFromDate(selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      beginningDate = TIMESTAMP.WEEK_END.getFirstFromDate(selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(selectedDate)
      break
    case DATE_FILTER_OPTIONS.USER_PICK:
      beginningDate = TIMESTAMP.getFirstOfDate(selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(selectedDate)
      break
  }
  return [getDatePredicate(beginningDate, endingDate)]
}

export const buildNewestOffersPredicate = (
  offerIsNew: SearchParametersQuery['offerIsNew']
): FiltersArray[0] | undefined => {
  if (!offerIsNew) return undefined

  const now = new Date()
  const fifteenDaysBeforeNow = new Date().setDate(now.getDate() - 15)
  const beginningDate = TIMESTAMP.getFromDate(new Date(fifteenDaysBeforeNow))
  const endingDate = TIMESTAMP.getFromDate(now)

  return [`${NUMERIC_FILTERS_ENUM.OFFER_STOCKS_DATE_CREATED}: ${beginningDate} TO ${endingDate}`]
}

export const getDatePredicate = (lowerDate: number, higherDate: number): string =>
  `${NUMERIC_FILTERS_ENUM.OFFER_DATES}: ${lowerDate} TO ${higherDate}`
