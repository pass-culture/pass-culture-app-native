import { LocationType } from 'features/search/enums'
import { SearchQueryParameters } from 'libs/algolia/types'

export const SearchQueryParametersFixture: SearchQueryParameters = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 20,
  locationFilter: { locationType: LocationType.EVERYWHERE },
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
