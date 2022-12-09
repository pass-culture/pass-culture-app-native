import { SearchParametersFields } from 'libs/contentful'
import { useParseSearchParameters } from 'libs/search'
import * as parseSearchParametersAPI from 'libs/search/parseSearchParameters'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

const mockMaxPrice = 172
jest.mock('features/search/helpers/useMaxPrice/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => mockMaxPrice),
}))

const mockPosition = { latitude: 2, longitude: 40 }
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: mockPosition })),
}))

describe('useParseSearchParameters', () => {
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const parseSearchParametersSpy = jest.spyOn(parseSearchParametersAPI, 'parseSearchParameters')

  it('should set price max parameter when not provided', () => {
    const parameters = {} as SearchParametersFields
    const { result } = renderHook(() => useParseSearchParameters())

    result.current(parameters)

    expect(parseSearchParametersSpy).toHaveBeenCalledWith(
      { priceMax: mockMaxPrice, priceMin: 0 },
      mockPosition,
      subcategoryLabelMapping
    )
  })

  it('should use price max parameter when provided', () => {
    const priceMax = 12
    const parameters = {} as SearchParametersFields
    const { result } = renderHook(() => useParseSearchParameters())

    result.current({ ...parameters, priceMax })

    expect(parseSearchParametersSpy).toHaveBeenCalledWith(
      { priceMax, priceMin: 0 },
      mockPosition,
      subcategoryLabelMapping
    )
  })
})
