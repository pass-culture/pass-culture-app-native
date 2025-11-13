import {
  categoryIdMappingSnap,
  subcategoriesMappingSnap,
  useCategoryHomeLabelMappingSnap,
  useGenreTypeMappingFixture,
  useSearchGroupLabelMappingSnap,
  useSubcategoryOfferLabelMappingSnap,
} from 'libs/subcategories/fixtures/mappings'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useGenreTypeMapping,
  useSearchGroupLabelMapping,
  useSubcategoriesMapping,
  useSubcategoryOfferLabelMapping,
} from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')

const mockUseSubcategories = jest.requireMock<{
  useSubcategoriesQuery: jest.Mock
}>('queries/subcategories/useSubcategoriesQuery').useSubcategoriesQuery

describe('useCategoryIdMapping', () => {
  it('should match category id mapping', () => {
    const { result } = renderHook(useCategoryIdMapping)

    expect(result.current).toEqual(categoryIdMappingSnap)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useCategoryIdMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no subcategories', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { subcategories: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useCategoryIdMapping)

    expect(result.current).toEqual({})
  })
})

describe('useSubcategoriesMapping', () => {
  it('should match subcategories mapping', () => {
    const { result } = renderHook(useSubcategoriesMapping)

    expect(result.current).toEqual(subcategoriesMappingSnap)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useSubcategoriesMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no subcategories', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { subcategories: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useSubcategoriesMapping)

    expect(result.current).toEqual({})
  })
})

describe('useSubcategoryOfferLabelMapping', () => {
  it('should match sub category label mapping', () => {
    const { result } = renderHook(useSubcategoryOfferLabelMapping)

    expect(result.current).toEqual(useSubcategoryOfferLabelMappingSnap)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useSubcategoryOfferLabelMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no subcategories', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { subcategories: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useSubcategoryOfferLabelMapping)

    expect(result.current).toEqual({})
  })
})

describe('useSearchGroupLabelMapping', () => {
  it('should match search group label mapping', () => {
    const { result } = renderHook(useSearchGroupLabelMapping)

    expect(result.current).toEqual(useSearchGroupLabelMappingSnap)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useSearchGroupLabelMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no searchGroups', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { searchGroups: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useSearchGroupLabelMapping)

    expect(result.current).toEqual({})
  })
})

describe('useCategoryHomeLabelMapping', () => {
  it('should match category Home label mapping', () => {
    const { result } = renderHook(useCategoryHomeLabelMapping)

    expect(result.current).toEqual(useCategoryHomeLabelMappingSnap)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useCategoryHomeLabelMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no subcategories', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { subcategories: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useCategoryHomeLabelMapping)

    expect(result.current).toEqual({})
  })
})

describe('useGenreTypeMapping', () => {
  it('should match category Home label mapping', () => {
    const { result } = renderHook(useGenreTypeMapping)

    expect(result.current).toEqual(useGenreTypeMappingFixture)
  })

  it('should return empty object if no data', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    const { result } = renderHook(useGenreTypeMapping)

    expect(result.current).toEqual({})
  })

  it('should return empty object if no genreTypes', () => {
    mockUseSubcategories.mockReturnValueOnce({
      data: { genreTypes: undefined },
      isLoading: false,
    })

    const { result } = renderHook(useGenreTypeMapping)

    expect(result.current).toEqual({})
  })
})
