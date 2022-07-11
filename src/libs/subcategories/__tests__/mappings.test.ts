import {
  categoryIdMappingSnap,
  subcategoriesMappingSnap,
  useCategoryHomeLabelMappingSnap,
  useSearchGroupLabelMappingSnap,
} from 'libs/subcategories/fixtures/mappings'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useSearchGroupLabelMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories/mappings'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: { subcategories: mockSubcategories },
  }),
}))

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
