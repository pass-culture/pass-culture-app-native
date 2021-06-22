# Migration from algolia to App Search

There are 3 types of search parameters:

1. the parameters in contentful
2. the parameters in the search state (see reducer)
3. the parameters used for the search engine (algolia => App Search)

We need clear interfaces for each one of them, and mapping function:

- from 1. to 2. (when we click on the button See More, we want to prepopulate the search reducer)
- from 1. to 3. (for the home page, to build the queries)
- from 2. to 3. (to query the search engine from the search page)

Note: we want our interfaces to be provider-agnostic. As a result, we will have:

- `SearchParametersFields`, `SearchParameters` and `SearchParametersQuery`.

```typescript
// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algoliaParameters/fields
interface SearchParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  categories?: string[]
  tags?: string[]
  isDigital?: boolean
  isThing?: boolean
  isEvent?: boolean
  beginningDatetime?: string
  endingDatetime?: string
  isFree?: boolean
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  newestOnly?: boolean
  hitsPerPage: number
}

interface SearchParameters {
  aroundRadius: number | null
  beginningDatetime: Date | null
  date: SelectedDate | null
  endingDatetime: Date | null
  hitsPerPage: number | null
  geolocation: AlgoliaGeolocation | null
  offerCategories: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  priceRange: Range<number> | null
  locationType: LocationType
  timeRange: Range<number> | null
  tags: string[]
}

// The actual search state will have some additional values:
interface SearchState extends PartialSearchParameters {
  place: SuggestedPlace | null // used to choose a specific place
  showResults: boolean // used for displaying the results or the landing page
  query: string // query typed by the user
}

// depends on the provider (algolia or app search)
interface SearchParametersQuery {}
```
