import {
  CategoryEntry,
  buildRadioOptions,
  checkHasChildrenCategories,
  getLabelForValue,
  getSortedCategoriesEntries,
  getValueForLabel,
  itemHasChildren,
  toRadioButtonGroupOptions,
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

describe('itemHasChildren', () => {
  it('should return false when item is undefined', () => {
    expect(itemHasChildren(undefined)).toBe(false)
  })

  it('should return false when item has no children property', () => {
    expect(itemHasChildren({ label: 'Category' })).toBe(false)
  })

  it('should return false when item has empty children object', () => {
    expect(itemHasChildren({ label: 'Category', children: {} })).toBe(false)
  })

  it('should return true when item has non-empty children', () => {
    expect(itemHasChildren({ label: 'Category', children: { sub: { label: 'Sub' } } })).toBe(true)
  })
})

describe('checkHasChildrenCategories', () => {
  it('should return false when entries array is empty', () => {
    const entries: ReturnType<typeof getSortedCategoriesEntries> = []

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(false)
  })

  it('should return false when no entries have children', () => {
    const entries: CategoryEntry[] = [
      ['cat_a', { label: 'A' }],
      ['cat_b', { label: 'B', children: {} }],
    ]

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(false)
  })

  it('should return true when at least one entry has children', () => {
    const entries: CategoryEntry[] = [
      ['cat_a', { label: 'A' }],
      ['cat_b', { label: 'B', children: { sub: { label: 'Sub' } } }],
    ]

    const result = checkHasChildrenCategories(entries)

    expect(result).toBe(true)
  })
})

describe('buildRadioOptions', () => {
  it('should return only all option when entries is empty', () => {
    const result = buildRadioOptions([], 'Toutes les catégories', 'ALL')

    expect(result).toEqual([
      { key: 'Toutes les catégories', label: 'Toutes les catégories', value: 'ALL' },
    ])
  })

  it('should return all option followed by entries options', () => {
    const entries: CategoryEntry[] = [
      ['cat_a', { label: 'Category A' }],
      ['cat_b', { label: 'Category B' }],
    ]

    const result = buildRadioOptions(entries, 'Tout', 'NONE')

    expect(result).toEqual([
      { key: 'Tout', label: 'Tout', value: 'NONE' },
      { key: 'cat_a', label: 'Category A', value: 'cat_a' },
      { key: 'cat_b', label: 'Category B', value: 'cat_b' },
    ])
  })
})

describe('toRadioButtonGroupOptions', () => {
  it('should convert RadioOption array to RadioButtonGroupOption array', () => {
    const options = [
      { key: 'ALL', label: 'All', value: 'ALL' },
      { key: 'cat_a', label: 'Category A', value: 'cat_a' },
    ]

    const result = toRadioButtonGroupOptions(options)

    expect(result).toEqual([
      { key: 'ALL', label: 'All' },
      { key: 'cat_a', label: 'Category A' },
    ])
  })
})

describe('getLabelForValue', () => {
  const options = [
    { key: 'ALL', label: 'Toutes', value: null },
    { key: 'cat_a', label: 'Category A', value: 'cat_a' },
    { key: 'cat_b', label: 'Category B', value: 'cat_b' },
  ]

  it('should return label for matching value', () => {
    const result = getLabelForValue(options, 'cat_a')

    expect(result).toBe('Category A')
  })

  it('should return label for null value', () => {
    const result = getLabelForValue(options, null)

    expect(result).toBe('Toutes')
  })

  it('should return empty string for non-existing value', () => {
    const result = getLabelForValue(options, 'unknown')

    expect(result).toBe('')
  })
})

describe('getValueForLabel', () => {
  const options = [
    { key: 'ALL', label: 'Toutes', value: null },
    { key: 'cat_a', label: 'Category A', value: 'cat_a' },
    { key: 'cat_b', label: 'Category B', value: 'cat_b' },
  ]

  it('should return value for matching label', () => {
    const result = getValueForLabel(options, 'Category A')

    expect(result).toBe('cat_a')
  })

  it('should return null value for matching label', () => {
    const result = getValueForLabel(options, 'Toutes')

    expect(result).toBeNull()
  })

  it('should return undefined for non-existing label', () => {
    const result = getValueForLabel(options, 'Unknown')

    expect(result).toBeUndefined()
  })
})
