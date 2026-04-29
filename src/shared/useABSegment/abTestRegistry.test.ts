import { AB_TESTS_REGISTRY, getABTestById } from 'shared/useABSegment/abTestRegistry'

describe('abTestRegistry', () => {
  it('should have unique ids', () => {
    const ids = AB_TESTS_REGISTRY.map((test) => test.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have at least two segments per test', () => {
    AB_TESTS_REGISTRY.forEach((test) => {
      expect(test.segments.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('getABTestById should return the test when id exists', () => {
    const first = AB_TESTS_REGISTRY[0]
    if (!first) return

    expect(getABTestById(first.id)).toEqual(first)
  })

  it('getABTestById should return undefined for unknown id', () => {
    expect(getABTestById('unknown-id')).toBeUndefined()
  })
})
