import { FilterArray, RangeFilter } from '@elastic/app-search-javascript'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { PartialSearchState } from 'features/search/types'
import { TIME } from 'libs/search/filters/timeFilters'
import { NoNullProperties, Range } from 'libs/typesUtils/typeHelpers'

import { AppSearchFields } from './constants'

export const buildNumericFilters = (params: PartialSearchState): FilterArray<AppSearchFields> => {
  return [
    ...buildOfferPriceRangePredicate(params),
    ...buildDatePredicate(params),
    ...buildHomepageDatePredicate(params),
    ...buildNewestOffersPredicate(params),
  ]
}

const MAX_PRICE = 30000

const buildOfferPriceRangePredicate = (
  params: PartialSearchState
): FilterArray<AppSearchFields> => {
  const { offerIsFree, priceRange } = params
  if (offerIsFree) return [{ [AppSearchFields.prices]: { to: 1 } }] // to is exclusive
  if (!priceRange) return [{ [AppSearchFields.prices]: { to: MAX_PRICE } }]

  const from = 100 * priceRange[0] || 0
  const to = Math.min(100 * priceRange[1], MAX_PRICE)

  return [{ [AppSearchFields.prices]: { from, to } }]
}

const buildDatePredicate = (params: PartialSearchState): FilterArray<AppSearchFields> => {
  const { date, timeRange } = params
  if (date && timeRange) return buildDateAndTimePredicate({ date, timeRange })
  if (date) return buildDateOnlyPredicate(date)
  if (timeRange) return buildTimeOnlyPredicate(timeRange)
  return []
}

const buildHomepageDatePredicate = (params: PartialSearchState): FilterArray<AppSearchFields> => {
  const { beginningDatetime, endingDatetime } = params
  if (!beginningDatetime && !endingDatetime) return []

  const filter: RangeFilter = {}
  if (beginningDatetime)
    filter['from'] = TIME.roundToNearestFiveMinutes(beginningDatetime).toISOString()
  if (endingDatetime) filter['to'] = TIME.roundToNearestFiveMinutes(endingDatetime).toISOString()

  return [{ [AppSearchFields.dates]: filter }]
}

const buildTimeOnlyPredicate = (timeRange: Range<number>): FilterArray<AppSearchFields> => {
  const [from, to] = TIME.computeTimeRangeFromHoursToSeconds(timeRange)
  return [{ [AppSearchFields.times]: { from, to } }]
}

// Attention à la timezone. Utiliser le departementCode?
const buildDateAndTimePredicate = ({
  date,
  timeRange,
}: NoNullProperties<Required<Pick<PartialSearchState, 'date' | 'timeRange'>>>): FilterArray<
  AppSearchFields
> => {
  let dateFilter
  switch (date.option) {
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      dateFilter = TIME.WEEK.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      dateFilter = TIME.WEEK_END.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)
      break
    default:
      dateFilter = [TIME.getAllFromTimeRangeAndDate(date.selectedDate, timeRange)]
  }

  return dateFilter.map(([from, to]) => ({
    [AppSearchFields.dates]: {
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    },
  }))
}

const buildDateOnlyPredicate = (
  date: Exclude<PartialSearchState['date'], null | undefined>
): FilterArray<AppSearchFields> => {
  let from, to
  switch (date.option) {
    case DATE_FILTER_OPTIONS.TODAY:
      from = date.selectedDate
      to = TIME.getEndOfDay(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      from = date.selectedDate
      to = TIME.getEndOfWeek(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      from = TIME.getStartOfWeekEnd(date.selectedDate)
      to = TIME.getEndOfWeek(date.selectedDate)
      break
    case DATE_FILTER_OPTIONS.USER_PICK:
      from = TIME.getStartOfDay(date.selectedDate)
      to = TIME.getEndOfDay(date.selectedDate)
      break
  }

  return [
    {
      [AppSearchFields.dates]: {
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
      },
    },
  ]
}

const buildNewestOffersPredicate = (params: PartialSearchState): FilterArray<AppSearchFields> => {
  const { offerIsNew } = params
  if (!offerIsNew) return []

  const now = TIME.roundToNearestFiveMinutes(new Date())
  const to = now.toISOString()

  const fifteenDaysAgo = new Date(now.setDate(now.getDate() - 15))
  const from = fifteenDaysAgo.toISOString()

  return [{ [AppSearchFields.stocks_date_created]: { from, to } }]
}
