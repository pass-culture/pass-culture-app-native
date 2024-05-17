import { SearchQueryParameters } from 'libs/algolia/types'

export function getSearchVenueQuery(parameters: SearchQueryParameters) {
  if (parameters.offerNativeCategories && parameters.offerNativeCategories.length > 0) {
    return parameters.query === ''
      ? String(parameters.offerNativeCategories[0])
      : `${String(parameters.offerNativeCategories[0])} ${parameters.query}`
  }
  if (parameters.offerCategories && parameters.offerCategories.length > 0) {
    return parameters.query === ''
      ? String(parameters.offerCategories[0])
      : `${String(parameters.offerCategories[0])} ${parameters.query}`
  }
  return parameters.query
}
