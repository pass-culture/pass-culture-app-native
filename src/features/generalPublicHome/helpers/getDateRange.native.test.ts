import { getDateRange } from 'features/generalPublicHome/helpers/getDateRange'

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')

describe('getDateRange', () => {
  it('should not restrict dates without filter', () => {
    expect(getDateRange(null, NOW)).toEqual({})
  })

  describe('with a preset', () => {
    it('should range from now to the end of today for "today"', () => {
      expect(getDateRange({ type: 'preset', preset: 'today' }, NOW)).toEqual({
        beginningDatetime: '2026-10-14T10:30:00.000Z',
        endingDatetime: '2026-10-14T23:59:59.999Z',
      })
    })

    it('should cover the whole of tomorrow for "tomorrow"', () => {
      expect(getDateRange({ type: 'preset', preset: 'tomorrow' }, NOW)).toEqual({
        beginningDatetime: '2026-10-15T00:00:00.000Z',
        endingDatetime: '2026-10-15T23:59:59.999Z',
      })
    })

    it('should range from now to the end of sunday for "thisWeek"', () => {
      expect(getDateRange({ type: 'preset', preset: 'thisWeek' }, NOW)).toEqual({
        beginningDatetime: '2026-10-14T10:30:00.000Z',
        endingDatetime: '2026-10-18T23:59:59.999Z',
      })
    })
  })

  describe('with a specific day', () => {
    it('should cover the whole day when it is in the future', () => {
      expect(getDateRange({ type: 'day', date: '2026-10-20' }, NOW)).toEqual({
        beginningDatetime: '2026-10-20T00:00:00.000Z',
        endingDatetime: '2026-10-20T23:59:59.999Z',
      })
    })

    it('should start from now when it is today', () => {
      expect(getDateRange({ type: 'day', date: '2026-10-14' }, NOW)).toEqual({
        beginningDatetime: '2026-10-14T10:30:00.000Z',
        endingDatetime: '2026-10-14T23:59:59.999Z',
      })
    })
  })
})
