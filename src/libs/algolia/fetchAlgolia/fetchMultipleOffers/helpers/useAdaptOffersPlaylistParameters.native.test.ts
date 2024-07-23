import { OffersModuleParameters } from 'features/home/types'
import * as parseSearchParametersAPI from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistParameters'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

const mockMaxPrice = 172
jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => mockMaxPrice),
}))

const mockPosition = undefined
jest.mock('libs/location', () => ({
  useLocation: jest.fn(() => ({ geolocPosition: mockPosition })),
}))

jest.mock('libs/subcategories/useSubcategories')

describe('useAdaptOffersPlaylistParameters', () => {
  const {
    result: { current: subcategoryLabelMapping },
  } = renderHook(useSubcategoryLabelMapping)
  const {
    result: { current: genreTypeMapping },
  } = renderHook(useGenreTypeMapping)

  const adaptOffersPlaylistParametersSpy = jest.spyOn(
    parseSearchParametersAPI,
    'adaptOffersPlaylistParameters'
  )

  it('should set price max parameter when not provided', () => {
    const parameters = {} as OffersModuleParameters
    const { result } = renderHook(useAdaptOffersPlaylistParameters)

    result.current(parameters)

    expect(adaptOffersPlaylistParametersSpy).toHaveBeenCalledWith(
      { priceMax: mockMaxPrice },
      subcategoryLabelMapping,
      genreTypeMapping
    )
  })

  it('should use price max parameter when provided', () => {
    const priceMax = 12
    const parameters = {} as OffersModuleParameters
    const { result } = renderHook(useAdaptOffersPlaylistParameters)

    result.current({ ...parameters, priceMax })

    expect(adaptOffersPlaylistParametersSpy).toHaveBeenCalledWith(
      { priceMax },
      subcategoryLabelMapping,
      genreTypeMapping
    )
  })
})
