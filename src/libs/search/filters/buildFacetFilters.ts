import { FilterArray } from '@elastic/app-search-javascript'

import { SearchParameters } from 'features/search/types'

import { AppSearchFields, FALSE, TRUE } from './constants'

export const buildFacetFilters = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { offerCategories, offerIsDuo, tags, offerTypes } = params

  const facetFilters: FilterArray<AppSearchFields> = buildOfferTypesFilter(offerTypes)
  if (offerCategories?.length) facetFilters.push({ [AppSearchFields.category]: offerCategories })
  if (offerIsDuo) facetFilters.push({ [AppSearchFields.is_duo]: TRUE })
  if (tags?.length) facetFilters.push({ [AppSearchFields.tags]: tags })

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
}: SearchParameters['offerTypes']): FilterArray<AppSearchFields> => {
  if (isDigital) {
    if (!isEvent && !isThing) return [DIGITAL]
    if (!isEvent && isThing) return [THING]
    if (isEvent && !isThing) return [DIGITAL, EVENT]
  } else {
    if (!isEvent && isThing) return [NOT_DIGITAL, THING]
    if (isEvent && !isThing) return [EVENT]
    if (isEvent && isThing) return [NOT_DIGITAL]
  }

  return []
}
