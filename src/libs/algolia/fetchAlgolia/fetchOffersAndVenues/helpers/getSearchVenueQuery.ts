import { SearchQueryParameters } from 'libs/algolia/types'

export function getSearchVenueQuery(parameters: SearchQueryParameters) {
  if (parameters.offerNativeCategories && parameters.offerNativeCategories.length > 0)
    return String(parameters.offerNativeCategories[0])
  if (parameters.offerCategories && parameters.offerCategories.length > 0)
    return String(parameters.offerCategories[0])
  return ''
}
