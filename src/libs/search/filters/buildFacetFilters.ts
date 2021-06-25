import { FilterArray } from '@elastic/app-search-javascript'

import { SearchParameters } from 'features/search/types'

import { AppSearchFields } from './constants'

export const buildFacetFilters = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { offerCategories, offerIsDuo, tags, offerTypes } = params

  const facetFilters: FilterArray<AppSearchFields> = buildOfferTypesFilter(offerTypes) // ko: weird logic
  if (offerCategories.length) facetFilters.push({ [AppSearchFields.category]: offerCategories }) // ok
  if (offerIsDuo) facetFilters.push({ [AppSearchFields.is_duo]: 'true' }) // ok
  if (tags.length) facetFilters.push({ [AppSearchFields.tags]: tags })

  return facetFilters
}

const DIGITAL = { [AppSearchFields.is_digital]: 'true' }
const EVENT = { [AppSearchFields.is_event]: 'true' }
const THING = { [AppSearchFields.is_thing]: 'true' }

const buildOfferTypesFilter = ({
  isDigital,
  isEvent,
  isThing,
}: SearchParameters['offerTypes']): FilterArray<AppSearchFields> => {
  // TODO (antoinewg) investigate this weird logic (copied from webapp)
  if (isDigital) {
    if (!isEvent && !isThing) return [DIGITAL]
    if (!isEvent && isThing) return [THING]
    if (isEvent && !isThing) return [DIGITAL, EVENT]
  } else {
    if (!isEvent && isThing) return [DIGITAL, THING]
    if (isEvent && !isThing) return [EVENT]
    if (isEvent && isThing) return [DIGITAL]
  }

  return []
}
