import {
  buildCategoryOptions,
  checkHasChildrenCategories,
  getSortedCategoriesEntries,
} from 'features/search/helpers/categoriesSectionHelpers/categoriesSectionHelpers'

describe('getSortedCategoriesEntries', () => {
  const mockMapping = {
    cat_b: { label: 'Category B', position: 2 },
    cat_a: { label: 'Category A', position: 1 },
    cat_c: { label: 'Category C', position: 3 },
  }

  it('should return empty array when itemsMapping is undefined', () => {
    const result = getSortedCategoriesEntries(undefined, true)

    expect(result).toEqual([])
  })

  it('should return entries without sorting when shouldSortItems is false', () => {
    const result = getSortedCategoriesEntries(mockMapping, false)

    expect(result).toEqual([
      ['cat_b', { label: 'Category B', position: 2 }],
      ['cat_a', { label: 'Category A', position: 1 }],
      ['cat_c', { label: 'Category C', position: 3 }],
    ])
  })

  it('should return sorted entries when shouldSortItems is true', () => {
    const result = getSortedCategoriesEntries(mockMapping, true)

    expect(result).toEqual([
      ['cat_a', { label: 'Category A', position: 1 }],
      ['cat_b', { label: 'Category B', position: 2 }],
      ['cat_c', { label: 'Category C', position: 3 }],
    ])
  })

  it('should sort by label when positions are equal', () => {
    const mappingWithSamePosition = {
      cat_z: { label: 'Zebra', position: 1 },
      cat_a: { label: 'Apple', position: 1 },
    }

    const result = getSortedCategoriesEntries(mappingWithSamePosition, true)

    expect(result).toEqual([
      ['cat_a', { label: 'Apple', position: 1 }],
      ['cat_z', { label: 'Zebra', position: 1 }],
    ])
  })
})

describe('checkHasChildrenCategories', () => {
  it('should return false when entries array is empty', () => {
    const entries: [string, { label: string }][] = []

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(false)
  })

  it('should return false when no entries have children', () => {
    const entries: [string, { label: string; children?: Record<string, unknown> }][] = [
      ['cat_a', { label: 'A' }],
      ['cat_b', { label: 'B', children: {} }],
    ]

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(false)
  })

  it('should return true when at least one entry has children', () => {
    const entries: [string, { label: string; children?: Record<string, unknown> }][] = [
      ['cat_a', { label: 'A' }],
      ['cat_b', { label: 'B', children: { sub: { label: 'Sub' } } }],
    ]

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(true)
  })
})

describe('buildCategoryOptions', () => {
  it('should return only all option when entries is empty', () => {
    const result = buildCategoryOptions([], 'Toutes les catégories', 'ALL')

    expect(result).toEqual([{ key: 'ALL', label: 'Toutes les catégories', value: 'ALL' }])
  })

  it('should return all option followed by entries options', () => {
    const entries: [string, { label: string }][] = [
      ['cat_a', { label: 'Category A' }],
      ['cat_b', { label: 'Category B' }],
    ]

    const result = buildCategoryOptions(entries, 'Tout', 'NONE')

    expect(result).toEqual([
      { key: 'NONE', label: 'Tout', value: 'NONE' },
      { key: 'cat_a', label: 'Category A', value: 'cat_a' },
      { key: 'cat_b', label: 'Category B', value: 'cat_b' },
    ])
  })
})
