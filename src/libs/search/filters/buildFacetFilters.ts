import { FilterArray } from '@elastic/app-search-javascript'

import { LocationType } from 'features/search/enums'
import { PartialSearchState } from 'features/search/types'

import { AppSearchFields, FALSE, TRUE } from './constants'

export const buildFacetFilters = (
  searchState: PartialSearchState
): FilterArray<AppSearchFields> => {
  const { offerCategories, offerIsDuo, tags, offerTypes, locationFilter } = searchState

  const facetFilters: FilterArray<AppSearchFields> = buildOfferTypesFilter(offerTypes)
  if (offerCategories?.length)
    facetFilters.push({ [AppSearchFields.search_group_name]: offerCategories })
  if (offerIsDuo) facetFilters.push({ [AppSearchFields.is_duo]: TRUE })
  if (tags?.length) facetFilters.push({ [AppSearchFields.tags]: tags })

  if (locationFilter.locationType === LocationType.VENUE && locationFilter.venue.venueId)
    facetFilters.push({ [AppSearchFields.venue_id]: locationFilter.venue.venueId })

  facetFilters.push({ [AppSearchFields.is_educational]: FALSE })

  return facetFilters
}

const DIGITAL = { [AppSearchFields.is_digital]: TRUE }
const NOT_DIGITAL = { [AppSearchFields.is_digital]: FALSE }
const EVENT = { [AppSearchFields.is_event]: TRUE }
const THING = { [AppSearchFields.is_thing]: TRUE }

const buildOfferTypesFilter = ({
  isDigital,
  isEvent,
  isThing,
}: PartialSearchState['offerTypes']): FilterArray<AppSearchFields> => {
  if (isDigital) {
    if (!isEvent && !isThing) return [DIGITAL]
    if (!isEvent && isThing) return [THING]
    if (isEvent && !isThing) return [{ any: [DIGITAL, EVENT] }]
  } else {
    if (!isEvent && isThing) return [NOT_DIGITAL, THING]
    if (isEvent && !isThing) return [EVENT]
    if (isEvent && isThing) return [NOT_DIGITAL]
  }

  return []
}
