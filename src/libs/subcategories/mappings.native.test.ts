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

jest.mock('libs/subcategories/useSubcategories')

describe('useCategoryIdMapping', () => {
  it('should match category id mapping', () => {
    const { result } = renderHook(useCategoryIdMapping)

    expect(result.current).toEqual(categoryIdMappingSnap)
  })
})

describe('useSubcategoriesMapping', () => {
  it('should match subcategories mapping', () => {
    const { result } = renderHook(useSubcategoriesMapping)

    expect(result.current).toEqual(subcategoriesMappingSnap)
  })
})

describe('useSubcategoryOfferLabelMapping', () => {
  it('should match sub category label mapping', () => {
    const { result } = renderHook(useSubcategoryOfferLabelMapping)

    expect(result.current).toEqual(useSubcategoryOfferLabelMappingSnap)
  })
})

describe('useSearchGroupLabelMapping', () => {
  it('should match search group label mapping', () => {
    const { result } = renderHook(useSearchGroupLabelMapping)

    expect(result.current).toEqual(useSearchGroupLabelMappingSnap)
  })
})

describe('useCategoryHomeLabelMapping', () => {
  it('should match category Home label mapping', () => {
    const { result } = renderHook(useCategoryHomeLabelMapping)

    expect(result.current).toEqual(useCategoryHomeLabelMappingSnap)
  })
})

describe('useGenreTypeMapping', () => {
  it('should match category Home label mapping', () => {
    const { result } = renderHook(useGenreTypeMapping)

    expect(result.current).toEqual(useGenreTypeMappingFixture)
  })
})
