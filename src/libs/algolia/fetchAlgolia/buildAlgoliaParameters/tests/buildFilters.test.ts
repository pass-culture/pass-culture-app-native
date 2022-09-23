import { buildFilters } from '../buildFilters'

describe('buildFilters', () => {
  describe('without filter', () => {
    it('should return an object if no parameters are passed', () => {
      expect(buildFilters({})).toEqual({})
    })
  })

  describe('with filter', () => {
    describe('excludedObjectIds', () => {
      it('should return filters that excludes objectID when excludedObjectIds is not empty', () => {
        expect(
          buildFilters({ excludedObjectIds: ['你好', 'привет', 'xαίρετε', 'สวัสดี'] })
        ).toEqual({
          filters:
            'NOT objectID:你好 AND NOT objectID:привет AND NOT objectID:xαίρετε AND NOT objectID:สวัสดี',
        })
      })

      it('should return filters that excludes objectID when excludedObjectIds is empty', () => {
        expect(buildFilters({ excludedObjectIds: [] })).toEqual({})
      })
    })
  })
})
