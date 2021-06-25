import { FilterArray, RangeFilter } from '@elastic/app-search-javascript'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'
import { computeTimeRangeFromHoursToSeconds, TIMESTAMP } from 'libs/search/datetime/time'
import { NoNullProperties, Range } from 'libs/typesUtils/typeHelpers'

import { AppSearchFields } from './constants'

export const buildNumericFilters = (params: SearchParameters): FilterArray<AppSearchFields> => {
  return [
    ...buildOfferPriceRangePredicate(params),
    ...buildDatePredicate(params),
    ...buildHomepageDatePredicate(params),
    ...buildNewestOffersPredicate(params),
  ]
}

const buildOfferPriceRangePredicate = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { offerIsFree, priceRange } = params
  if (offerIsFree) return [{ [AppSearchFields.prices]: ['0'] }]
  if (!priceRange) return []

  const [from = 0, to = 300] = priceRange
  return [{ [AppSearchFields.prices]: { from, to } }]
}

const buildDatePredicate = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { date, timeRange } = params
  if (date && timeRange) return buildDateAndTimePredicate({ date, timeRange })
  if (date) return buildDateOnlyPredicate(date)
  if (timeRange) return buildTimeOnlyPredicate(timeRange)
  return []
}

const buildHomepageDatePredicate = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { beginningDatetime, endingDatetime } = params
  if (!beginningDatetime && !endingDatetime) return []

  const filter: RangeFilter = {}
  if (beginningDatetime) filter['from'] = TIMESTAMP.getFromDate(beginningDatetime)
  if (endingDatetime) filter['to'] = TIMESTAMP.getFromDate(endingDatetime)

  return [{ [AppSearchFields.dates]: filter }]
}

const buildTimeOnlyPredicate = (timeRange: Range<number>): FilterArray<AppSearchFields> => {
  const [from, to] = computeTimeRangeFromHoursToSeconds(timeRange)
  return [{ [AppSearchFields.times]: { from, to } }]
}

const buildDateAndTimePredicate = ({
  date,
  timeRange,
}: NoNullProperties<Required<Pick<SearchParameters, 'date' | 'timeRange'>>>): FilterArray<
  AppSearchFields
> => {
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

  return dateFilter.map(([from, to]) => ({ [AppSearchFields.dates]: { from, to } }))
}

const buildDateOnlyPredicate = (
  date: Exclude<SearchParameters['date'], null | undefined>
): FilterArray<AppSearchFields> => {
  let from, to
  switch (date.option) {
    case DATE_FILTER_OPTIONS.TODAY:
      from = TIMESTAMP.getFromDate(date.selectedDate)
      to = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      from = TIMESTAMP.getFromDate(date.selectedDate)
      to = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      from = TIMESTAMP.WEEK_END.getFirstFromDate(date.selectedDate)
      to = TIMESTAMP.WEEK.getLastFromDate(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.USER_PICK:
      from = TIMESTAMP.getFirstOfDate(date.selectedDate)
      to = TIMESTAMP.getLastOfDate(date.selectedDate)
      break
  }

  return [{ [AppSearchFields.dates]: { from, to } }]
}

const buildNewestOffersPredicate = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { offerIsNew } = params
  if (!offerIsNew) return []

  const now = new Date()
  const fifteenDaysAgo = new Date().setDate(now.getDate() - 15)
  const from = TIMESTAMP.getFromDate(new Date(fifteenDaysAgo))
  const to = TIMESTAMP.getFromDate(now)

  return [{ [AppSearchFields.stocks_date_created]: { from, to } }]
}
