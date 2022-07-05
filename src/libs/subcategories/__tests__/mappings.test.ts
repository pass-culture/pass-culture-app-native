import { renderHook } from '@testing-library/react-hooks'

import {
  categoryIdMappingSnap,
  subcategoriesMappingSnap,
  useSearchGroupLabelMappingSnap,
} from 'libs/subcategories/__fixtures__/mappings'
import {
  useCategoryIdMapping,
  useSearchGroupLabelMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories/mappings'
import { placeholderData } from 'libs/subcategories/placeholderData'

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
