import { addDays, addMonths, parse, startOfDay } from 'date-fns'

import { getTheme } from 'features/generalPublicHome/helpers/getTheme'
import { DateFilter, ThemeId } from 'features/generalPublicHome/types'
import { initialSearchState } from 'features/search/context/reducer'
import { getCalendarFormData } from 'features/search/helpers/getCalendarFormData/getCalendarFormData'
import { LocationFilter, SearchState } from 'features/search/types'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'

type Params = {
  query: string
  dateFilter: DateFilter
  now: Date
  themeId?: ThemeId
  locationFilter?: LocationFilter
}

type SearchDateParameters = Pick<
  SearchState,
  'beginningDatetime' | 'endingDatetime' | 'calendarFilterId'
>

// Mirrors what the search CalendarModal stores, so that it displays the selected filter
const getSearchDateParameters = (dateFilter: DateFilter, now: Date): SearchDateParameters => {
  if (!dateFilter) return {}

  if (dateFilter.type === 'day') {
    return { beginningDatetime: parse(dateFilter.date, 'yyyy-MM-dd', now).toISOString() }
  }

  // The search has no "tomorrow" calendar filter: tomorrow goes as a specific day
  if (dateFilter.preset === 'tomorrow') {
    return { beginningDatetime: startOfDay(addDays(now, 1)).toISOString() }
  }

  const { selectedStartDate, selectedEndDate } = getCalendarFormData(
    dateFilter.preset,
    now,
    addMonths(now, 1)
  )
  return {
    beginningDatetime: selectedStartDate?.toISOString(),
    endingDatetime: selectedEndDate?.toISOString(),
    calendarFilterId: dateFilter.preset,
  }
}

export const buildFreeSearchState = ({
  query,
  dateFilter,
  now,
  themeId,
  locationFilter = initialSearchState.locationFilter,
}: Params): SearchState => ({
  ...initialSearchState,
  query,
  locationFilter,
  maxPrice: 0,
  offerCategories: getTheme(themeId)?.categories.map(getCategoriesFacetFilters) ?? [],
  ...getSearchDateParameters(dateFilter, now),
})
