import { FetchAlgoliaParameters, FiltersArray } from 'libs/algolia'
import { TIMESTAMP, computeTimeRangeFromHoursToSeconds } from 'libs/algolia/datetime/time'
import { FACETS_ENUM, DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
import { Range, NoNullProperties } from 'libs/typesUtils/typeHelpers'

export const buildNumericFilters = ({
  date,
  beginningDatetime,
  endingDatetime,
  offerIsFree,
  offerIsNew,
  priceRange,
  timeRange,
}: Pick<
  FetchAlgoliaParameters,
  | 'beginningDatetime'
  | 'endingDatetime'
  | 'date'
  | 'offerIsFree'
  | 'offerIsNew'
  | 'priceRange'
  | 'timeRange'
>): null | {
  numericFilters: FiltersArray
} => {
  const priceRangePredicate = buildOfferPriceRangePredicate({ offerIsFree, priceRange })
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
}: Pick<FetchAlgoliaParameters, 'offerIsFree' | 'priceRange'>): FiltersArray[0] | undefined => {
  if (offerIsFree) return [`${FACETS_ENUM.OFFER_PRICE} = 0`]
  if (priceRange) return [`${FACETS_ENUM.OFFER_PRICE}: ${priceRange.join(' TO ')}`]
  return undefined
}

const buildDatePredicate = ({
  date,
  timeRange,
}: Pick<FetchAlgoliaParameters, 'date' | 'timeRange'>): FiltersArray[0] | undefined => {
  if (date && timeRange) return buildDateAndTimePredicate({ date, timeRange })
  if (date) return buildDateOnlyPredicate(date)
  if (timeRange) return buildTimeOnlyPredicate(timeRange)
  return undefined
}

const buildHomepageDatePredicate = ({
  beginningDatetime,
  endingDatetime,
}: Pick<FetchAlgoliaParameters, 'beginningDatetime' | 'endingDatetime'>):
  | undefined
  | FiltersArray[0] => {
  if (!(beginningDatetime || endingDatetime)) return undefined

  if (beginningDatetime && !endingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(beginningDatetime)
    return [`${FACETS_ENUM.OFFER_DATE} >= ${beginningTimestamp}`]
  }

  if (!beginningDatetime && endingDatetime) {
    const endingTimestamp = TIMESTAMP.getFromDate(endingDatetime)
    return [`${FACETS_ENUM.OFFER_DATE} <= ${endingTimestamp}`]
  }

  if (beginningDatetime && endingDatetime) {
    const beginningTimestamp = TIMESTAMP.getFromDate(beginningDatetime)
    const endingTimestamp = TIMESTAMP.getFromDate(endingDatetime)
    return [getDatePredicate(beginningTimestamp, endingTimestamp)]
  }

  return undefined
}

const buildTimeOnlyPredicate = (timeRange: Range<number>): FiltersArray[0] => {
  const timeRangeInSeconds = computeTimeRangeFromHoursToSeconds(timeRange)
  return [`${FACETS_ENUM.OFFER_TIME}: ${timeRangeInSeconds.join(' TO ')}`]
}

const buildDateAndTimePredicate = ({
  date,
  timeRange,
}: NoNullProperties<
  Required<Pick<FetchAlgoliaParameters, 'date' | 'timeRange'>>
>): FiltersArray[0] => {
  let dateFilter
  switch (date.option) {
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      dateFilter = TIMESTAMP.WEEK.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      dateFilter = TIMESTAMP.WEEK_END.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)
      break
    default:
      dateFilter = [TIMESTAMP.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)]
  }

  return dateFilter.map((timestampsRangeForADay) => getDatePredicate(...timestampsRangeForADay))
}

const buildDateOnlyPredicate = (
  date: Exclude<FetchAlgoliaParameters['date'], null | undefined>
): FiltersArray[0] => {
  let beginningDate, endingDate
  switch (date.option) {
    case DATE_FILTER_OPTIONS.TODAY:
      beginningDate = TIMESTAMP.getFromDate(date.selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      beginningDate = TIMESTAMP.getFromDate(date.selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      beginningDate = TIMESTAMP.WEEK_END.getFirstFromDate(date.selectedDate)
      endingDate = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.USER_PICK:
      beginningDate = TIMESTAMP.getFirstOfDate(date.selectedDate)
      endingDate = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
  }
  return [getDatePredicate(beginningDate, endingDate)]
}

const buildNewestOffersPredicate = (
  offerIsNew: FetchAlgoliaParameters['offerIsNew']
): FiltersArray[0] | undefined => {
  if (!offerIsNew) return undefined

  const now = new Date()
  const fifteenDaysBeforeNow = new Date().setDate(now.getDate() - 15)
  const beginningDate = TIMESTAMP.getFromDate(new Date(fifteenDaysBeforeNow))
  const endingDate = TIMESTAMP.getFromDate(now)

  return [`${FACETS_ENUM.OFFER_STOCKS_DATE_CREATED}: ${beginningDate} TO ${endingDate}`]
}

const getDatePredicate = (lowerDate: number, higherDate: number): string =>
  `${FACETS_ENUM.OFFER_DATE}: ${lowerDate} TO ${higherDate}`
