import { renderHook } from '@testing-library/react-hooks'

import { categoryIdMappingSnap } from 'libs/subcategories/__fixtures__/categoryIdMappingSnap'
import { subcategoriesMappingSnap } from 'libs/subcategories/__fixtures__/subcategoriesMappingSnap'
import { useCategoryIdMapping, useSubcategoriesMapping } from 'libs/subcategories/mappings'
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
