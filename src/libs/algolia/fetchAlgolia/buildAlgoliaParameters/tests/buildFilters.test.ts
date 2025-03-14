import { buildFilters } from '../buildFilters'

describe('buildFilters', () => {
  it('should return base filter when no excludedObjectIds are provided', () => {
    const result = buildFilters({})

    expect(result).toEqual({
      filters: 'NOT _tags:"is_future" ',
    })
  })

  it('should return base filter when excludedObjectIds is an empty array', () => {
    const result = buildFilters({ excludedObjectIds: [] })

    expect(result).toEqual({
      filters: 'NOT _tags:"is_future" ',
    })
  })

  it('should correctly exclude a single objectId', () => {
    const result = buildFilters({ excludedObjectIds: ['123'] })

    expect(result).toEqual({
      filters: 'NOT _tags:"is_future" AND NOT objectID:123',
    })
  })

  it('should correctly exclude multiple objectIds', () => {
    const result = buildFilters({ excludedObjectIds: ['123', '456', '789'] })

    expect(result).toEqual({
      filters:
        'NOT _tags:"is_future" AND NOT objectID:123 AND NOT objectID:456 AND NOT objectID:789',
    })
  })
})
