import { SearchGroupNameEnumv2 } from 'api/gen'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { SearchQueryParametersFixture } from 'libs/algolia/fixtures'
import { AlgoliaLocationFilter } from 'libs/algolia/types'

const isUserUnderage = false

describe('buildOfferSearchParameters', () => {
  it('should return expected offer search parameters to build Algolia API call', () => {
    const parameters = {
      ...SearchQueryParametersFixture,
    }

    const result = buildOfferSearchParameters(parameters, isUserUnderage)

    expect(result).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
    })
  })

  it('should return parameters with date filter when date is specified', () => {
    const parameters = {
      ...SearchQueryParametersFixture,
      date: {
        option: DATE_FILTER_OPTIONS.USER_PICK,
        selectedDate: '2023-05-01',
      },
    }

    const result = buildOfferSearchParameters(parameters, isUserUnderage)

    expect(result).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300'], ['offer.dates: 1682899200 TO 1682985599']],
    })
  })

  it('should return parameters with offer category filter when offer category is specified', () => {
    const parameters = {
      ...SearchQueryParametersFixture,
      offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
    }

    const result = buildOfferSearchParameters(parameters, isUserUnderage)

    expect(result).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [
        ['offer.isEducational:false'],
        ['offer.searchGroupNamev2:CD_VINYLE_MUSIQUE_EN_LIGNE'],
      ],
      numericFilters: [['offer.prices: 0 TO 300']],
    })
  })

  it('should return parameters with minimum price filter when minPrice is specified', () => {
    const parameters = {
      ...SearchQueryParametersFixture,
      minPrice: '50',
    }

    const result = buildOfferSearchParameters(parameters, isUserUnderage)

    expect(result).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 50 TO 300']],
    })
  })

  it('should return parameters with geolocation filter when locationFilter is specified', () => {
    const locationFilter: AlgoliaLocationFilter = {
      aroundLatLng: `$48.8566, 2.3522`,
      aroundRadius: 10000,
    }

    const parameters = {
      ...SearchQueryParametersFixture,
      locationFilter,
    }

    const result = buildOfferSearchParameters(parameters, isUserUnderage)

    expect(result).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 10000,
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
    })
  })
})
