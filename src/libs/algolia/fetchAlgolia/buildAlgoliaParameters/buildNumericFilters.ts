import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { clampPrice, MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { NUMERIC_FILTERS_ENUM } from 'libs/algolia/enums'
import { SearchParametersQuery } from 'libs/algolia/types'
import { TIMESTAMP, computeTimeRangeFromHoursToSeconds } from 'libs/search/datetime/time'
import { Range, NoNullProperties } from 'libs/typesUtils/typeHelpers'

import { FiltersArray } from '../../types'

export const buildNumericFilters = ({
  date,
  beginningDatetime,
  endingDatetime,
  offerIsFree,
  offerIsNew,
  priceRange,
  timeRange,
  minPrice,
  maxPrice,
  maxPossiblePrice,
}: Pick<
  SearchParametersQuery,
  | 'beginningDatetime'
  | 'endingDatetime'
  | 'date'
  | 'offerIsFree'
  | 'offerIsNew'
  | 'priceRange'
  | 'timeRange'
  | 'minPrice'
  | 'maxPrice'
  | 'maxPossiblePrice'
>): null | {
  numericFilters: FiltersArray
} => {
  const priceRangePredicate = buildOfferPriceRangePredicate({
    offerIsFree,
    priceRange,
    minPrice,
    maxPrice,
    maxPossiblePrice,
  })
  const datePredicate = buildDatePredicate({ date, timeRange })
  const newestOffersPredicate = buildNewestOffersPredicate(offerIsNew)
  const homepageDatePredicate = buildHomepageDatePredicate({ beginningDatetime, endingDatetime })
  const numericFilters: FiltersArray = []

  if (priceRangePredicate) numericFilters.push(priceRangePredicate)
  if (datePredicate) numericFilters.push(datePredicate)
  if (newestOffersPredicate) numericFilters.push(newestOffersPredicate)
  if (homepageDatePredicate) numericFilters.push(homepageDatePredicate)

  return numericFilters.length > 0 ? { numericFilters } : null
}

const buildOfferPriceRangePredicate = ({
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

const buildDatePredicate = ({
  date,
  timeRange,
}: Pick<SearchParametersQuery, 'date' | 'timeRange'>): FiltersArray[0] | undefined => {
  if (date && timeRange) return buildDateAndTimePredicate({ date, timeRange })
  if (date) return buildDateOnlyPredicate(date)
  if (timeRange) return buildTimeOnlyPredicate(timeRange)
  return undefined
}

const buildHomepageDatePredicate = ({
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

const buildTimeOnlyPredicate = (timeRange: Range<number>): FiltersArray[0] => {
  const timeRangeInSeconds = computeTimeRangeFromHoursToSeconds(timeRange)
  return [`${NUMERIC_FILTERS_ENUM.OFFER_TIMES}: ${timeRangeInSeconds.join(' TO ')}`]
}

const buildDateAndTimePredicate = ({
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

const buildDateOnlyPredicate = (
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

const buildNewestOffersPredicate = (
  offerIsNew: SearchParametersQuery['offerIsNew']
): FiltersArray[0] | undefined => {
  if (!offerIsNew) return undefined

  const now = new Date()
  const fifteenDaysBeforeNow = new Date().setDate(now.getDate() - 15)
  const beginningDate = TIMESTAMP.getFromDate(new Date(fifteenDaysBeforeNow))
  const endingDate = TIMESTAMP.getFromDate(now)

  return [`${NUMERIC_FILTERS_ENUM.OFFER_STOCKS_DATE_CREATED}: ${beginningDate} TO ${endingDate}`]
}

const getDatePredicate = (lowerDate: number, higherDate: number): string =>
  `${NUMERIC_FILTERS_ENUM.OFFER_DATES}: ${lowerDate} TO ${higherDate}`
