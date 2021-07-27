import { AppSearchFields } from 'libs/search/filters/constants'

import { buildBoosts } from '../buildBoosts'

describe('buildBoosts', () => {
  describe('proximity boost', () => {
    it('should not add a proximity boost if no position', () => {
      expect(buildBoosts(null)).toBeUndefined()
    })

    it("should add a proximity boost centered around the user's position", () => {
      const boosts = buildBoosts({ latitude: 48.8557, longitude: 2.3469 })
      expect(boosts).toStrictEqual({
        [AppSearchFields.venue_position]: {
          type: 'proximity',
          function: 'exponential',
          center: `48.8557,2.3469`,
          factor: 10,
        },
      })
    })
  })
})
