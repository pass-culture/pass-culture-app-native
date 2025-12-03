import { DEFAULT_RADIUS } from 'features/search/constants'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'

import { buildQueryHelper } from './buildQueryHelper'

describe('buildQueryHelper', () => {
  const mockIndexName = 'offers'

  it('should return a basic query when only indexName is provided', () => {
    const result = buildQueryHelper({ indexName: mockIndexName })

    expect(result).toEqual({
      indexName: mockIndexName,
      query: '',
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        hitsPerPage: 50,
      },
    })
  })

  it('should include location parameters when userLocation is provided', () => {
    const userLocation = { latitude: 48.8566, longitude: 2.3522 }
    const result = buildQueryHelper({
      indexName: mockIndexName,
      userLocation,
    })

    expect(result).toHaveProperty('aroundLatLng', '48.8566, 2.3522')
    expect(result).toHaveProperty('aroundRadius', DEFAULT_RADIUS * 1000)
  })

  it('should set aroundRadius to "all" when withRadius is false', () => {
    const userLocation = { latitude: 48.8566, longitude: 2.3522 }
    const result = buildQueryHelper({
      indexName: mockIndexName,
      userLocation,
      withRadius: false,
    })

    expect(result).toHaveProperty('aroundRadius', 'all')
  })

  it('should include numericFilters when provided', () => {
    const numericFilters = 'offer.prices < 50'
    const result = buildQueryHelper({
      indexName: mockIndexName,
      numericFilters,
    })

    expect(result).toHaveProperty('numericFilters', numericFilters)
  })

  it('should set distinct flag when true', () => {
    const result = buildQueryHelper({
      indexName: mockIndexName,
      distinct: true,
    })

    expect(result).toHaveProperty('distinct', true)
  })

  it('should use provided hitsPerPage value', () => {
    const result = buildQueryHelper({
      indexName: mockIndexName,
      hitsPerPage: 25,
    })

    expect(result).toHaveProperty('hitsPerPage', 25)
  })

  it('should combine all parameters when provided', () => {
    const userLocation = { latitude: 48.8566, longitude: 2.3522 }
    const filters = 'offer.subcategoryId:"CONCERT"'
    const numericFilters = 'offer.prices < 50'

    const result = buildQueryHelper({
      indexName: mockIndexName,
      userLocation,
      filters,
      numericFilters,
      hitsPerPage: 30,
      distinct: true,
    })

    expect(result).toEqual({
      indexName: mockIndexName,
      query: '',
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        aroundLatLng: '48.8566, 2.3522',
        aroundRadius: DEFAULT_RADIUS * 1000,
        filters: 'offer.subcategoryId:"CONCERT"',
        numericFilters: 'offer.prices < 50',
        distinct: true,
        hitsPerPage: 30,
      },
    })
  })
})
