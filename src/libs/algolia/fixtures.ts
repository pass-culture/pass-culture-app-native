import { SearchQueryParameters } from 'libs/algolia/types'

export const SearchQueryParametersFixture: SearchQueryParameters = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 20,
  locationFilter: {
    aroundLatLng: `$48.8566, 2.3522`,
    aroundRadius: 10000,
  },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
  priceRange: null,
  query: '',
  tags: [],
  timeRange: null,
  page: 0,
}
