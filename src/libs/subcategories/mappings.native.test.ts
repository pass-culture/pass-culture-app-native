import {
  categoryIdMappingSnap,
  subcategoriesMappingSnap,
  useCategoryHomeLabelMappingSnap,
  useGenreTypeMappingFixture,
  useSearchGroupLabelMappingSnap,
} from 'libs/subcategories/fixtures/mappings'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useGenreTypeMapping,
  useSearchGroupLabelMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories/mappings'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockSubcategories = PLACEHOLDER_DATA.subcategories
const mockGenreTypes = PLACEHOLDER_DATA.genreTypes
const mockSearchGroups = PLACEHOLDER_DATA.searchGroups
const mockHomepageLabels = PLACEHOLDER_DATA.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      genreTypes: mockGenreTypes,
      searchGroups: mockSearchGroups,
      homepageLabels: mockHomepageLabels,
    },
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

describe('useGenreTypeMapping', () => {
  it('should match category Home label mapping', () => {
    const { result } = renderHook(useGenreTypeMapping)

    expect(result.current).toEqual(useGenreTypeMappingFixture)
  })
})
