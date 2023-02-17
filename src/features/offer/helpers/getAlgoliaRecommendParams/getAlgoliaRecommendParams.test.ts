import { SearchGroupNameEnumv2 } from 'api/gen'
import { getAlgoliaRecommendParams } from 'features/offer/helpers/getAlgoliaRecommendParams/getAlgoliaRecommendParams'

const position = {
  latitude: 20,
  longitude: 2,
}
const categories = [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]

describe('getAlgoliaRecommendParams', () => {
  describe('queryParameters', () => {
    it('should return empty object when position and category not passed in parameters', () => {
      const { queryParameters } = getAlgoliaRecommendParams()
      expect(queryParameters).toEqual({})
    })

    it('should return position information when position passed in parameters and category not passed', () => {
      const { queryParameters } = getAlgoliaRecommendParams(position)
      expect(queryParameters).toEqual({
        aroundLatLng: `${position?.latitude}, ${position?.longitude}`,
        aroundRadius: 100000,
      })
    })

    it('should return category information when category passed in parameters and position not passed', () => {
      const { queryParameters } = getAlgoliaRecommendParams(undefined, categories)
      expect(queryParameters).toEqual({
        facetFilters: [['offer.searchGroupNamev2:FILMS_SERIES_CINEMA']],
      })
    })

    it('should return position and category information when position and category passed in parameters', () => {
      const { queryParameters } = getAlgoliaRecommendParams(position, categories)
      expect(queryParameters).toEqual({
        aroundLatLng: `${position?.latitude}, ${position?.longitude}`,
        aroundRadius: 100000,
        facetFilters: [['offer.searchGroupNamev2:FILMS_SERIES_CINEMA']],
      })
    })
  })

  describe('fallbackParameters', () => {
    it('should return empty object when position and category not passed in parameters', () => {
      const { fallbackParameters } = getAlgoliaRecommendParams()
      expect(fallbackParameters).toEqual({})
    })

    it('should return empty object when position passed in parameters and category not passed', () => {
      const { fallbackParameters } = getAlgoliaRecommendParams(position)
      expect(fallbackParameters).toEqual({})
    })

    it('should return category information when category passed in parameters and position not passed', () => {
      const { fallbackParameters } = getAlgoliaRecommendParams(undefined, categories)
      expect(fallbackParameters).toEqual({
        facetFilters: [['offer.searchGroupNamev2:FILMS_SERIES_CINEMA']],
      })
    })

    it('should return category information when position and category passed in parameters', () => {
      const { fallbackParameters } = getAlgoliaRecommendParams(position, categories)
      expect(fallbackParameters).toEqual({
        facetFilters: [['offer.searchGroupNamev2:FILMS_SERIES_CINEMA']],
      })
    })
  })
})
