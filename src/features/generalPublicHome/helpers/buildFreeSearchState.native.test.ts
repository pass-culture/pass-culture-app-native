import { SearchGroupNameEnumv2 } from 'api/gen'
import { buildFreeSearchState } from 'features/generalPublicHome/helpers/buildFreeSearchState'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationMode } from 'libs/location/types'

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')

describe('buildFreeSearchState', () => {
  it('should build an initial search state with the query and free offers only', () => {
    expect(buildFreeSearchState({ query: 'concert', dateFilter: null, now: NOW })).toEqual({
      ...initialSearchState,
      query: 'concert',
      maxPrice: 0,
    })
  })

  describe('dates', () => {
    it('should start from now for the "today" preset, search covering the rest of the day', () => {
      const state = buildFreeSearchState({
        query: '',
        dateFilter: { type: 'preset', preset: 'today' },
        now: NOW,
      })

      expect(state.beginningDatetime).toBe('2026-10-14T10:30:00.000Z')
      expect(state.endingDatetime).toBeUndefined()
      expect(state.calendarFilterId).toBe('today')
    })

    it('should range until the end of sunday for the "thisWeek" preset', () => {
      const state = buildFreeSearchState({
        query: '',
        dateFilter: { type: 'preset', preset: 'thisWeek' },
        now: NOW,
      })

      expect(state.beginningDatetime).toBe('2026-10-14T10:30:00.000Z')
      expect(state.endingDatetime).toBe('2026-10-18T23:59:59.999Z')
      expect(state.calendarFilterId).toBe('thisWeek')
    })

    it('should range until the end of the month for the "thisMonth" preset', () => {
      const state = buildFreeSearchState({
        query: '',
        dateFilter: { type: 'preset', preset: 'thisMonth' },
        now: NOW,
      })

      expect(state.endingDatetime).toBe('2026-10-31T23:59:59.999Z')
      expect(state.calendarFilterId).toBe('thisMonth')
    })

    it('should start at midnight of a specific day, search covering that day only', () => {
      const state = buildFreeSearchState({
        query: '',
        dateFilter: { type: 'day', date: '2026-10-20' },
        now: NOW,
      })

      expect(state.beginningDatetime).toBe('2026-10-20T00:00:00.000Z')
      expect(state.endingDatetime).toBeUndefined()
      expect(state.calendarFilterId).toBeUndefined()
    })
  })

  describe('theme', () => {
    it('should filter on the search groups of the theme', () => {
      const state = buildFreeSearchState({
        query: '',
        dateFilter: null,
        now: NOW,
        themeId: 'visits',
      })

      expect(state.offerCategories).toEqual([SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES])
    })
  })

  describe('location', () => {
    it('should keep the given location filter', () => {
      const locationFilter = { locationType: LocationMode.AROUND_ME, aroundRadius: 20 } as const

      const state = buildFreeSearchState({ query: '', dateFilter: null, now: NOW, locationFilter })

      expect(state.locationFilter).toEqual(locationFilter)
    })
  })
})
