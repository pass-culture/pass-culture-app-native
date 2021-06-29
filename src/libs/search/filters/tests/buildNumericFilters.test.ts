/* eslint-disable local-rules/independant-mocks */
import mockdate from 'mockdate'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'
import { computeTimeRangeFromHoursToSeconds, TIMESTAMP } from 'libs/search/datetime/time'
import { AppSearchFields } from 'libs/search/filters/constants'

import { buildNumericFilters } from '../buildNumericFilters'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timestamp = TIMESTAMP as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeTimeRange = computeTimeRangeFromHoursToSeconds as any

const selectedDate = new Date('2021-07-05T00:00:00Z')
const now = new Date('2021-07-01T00:00:00Z')

jest.mock('libs/search/datetime/time')

describe('buildNumericFilters', () => {
  beforeEach(() => {
    mockdate.set(now)
    jest.clearAllMocks()
  })

  describe('offer price', () => {
    it('should not filter when no price range is specified and offer is not free', () => {
      const params = { offerIsFree: false, priceRange: null } as SearchParameters
      expect(buildNumericFilters(params as SearchParameters)).toEqual([
        { [AppSearchFields.prices]: { to: 30000 } },
      ])
    })

    it('should filter prices when offer is free even when priceRange is provided', () => {
      const params = { offerIsFree: true, priceRange: [0, 300] } as SearchParameters
      expect(buildNumericFilters(params as SearchParameters)).toEqual([
        { [AppSearchFields.prices]: { to: 1 } },
      ])
    })

    it('should filter prices when price range is provided and offer is not free', () => {
      const params = { offerIsFree: false, priceRange: [20, 50] } as SearchParameters
      expect(buildNumericFilters(params as SearchParameters)).toEqual([
        { [AppSearchFields.prices]: { from: 2000, to: 5000 } },
      ])
    })

    it('should filter prices with max price when price range is provided and offer is not free', () => {
      const params = { offerIsFree: false, priceRange: [20, 500] } as SearchParameters
      expect(buildNumericFilters(params as SearchParameters)).toEqual([
        { [AppSearchFields.prices]: { from: 2000, to: 30000 } },
      ])
    })
  })

  describe('offer is new', () => {
    it('should fetch with no numericFilters when offerIsNew is false', () => {
      const filters = buildNumericFilters({ offerIsNew: false } as SearchParameters)
      expect(filters).toStrictEqual([{ [AppSearchFields.prices]: { to: 30000 } }])
    })

    it('should fetch with numericFilters when offerIsNew is true', () => {
      timestamp.getFromDate.mockReturnValueOnce(1588762412).mockReturnValueOnce(1589453612)

      const filters = buildNumericFilters({ offerIsNew: true } as SearchParameters)
      expect(timestamp.getFromDate).toHaveBeenLastCalledWith(now)
      expect(filters).toStrictEqual([
        { [AppSearchFields.prices]: { to: 30000 } },
        { [AppSearchFields.stocks_date_created]: { from: 1588762412, to: 1589453612 } },
      ])
    })
  })

  describe('date', () => {
    describe('by date only', () => {
      it('should fetch with date filter when date and today option are provided', () => {
        timestamp.getFromDate.mockReturnValue(123456789)
        timestamp.getLastOfDate.mockReturnValue(987654321)

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.TODAY,
            selectedDate,
          },
        } as SearchParameters)

        expect(TIMESTAMP.getFromDate).toHaveBeenCalledWith(selectedDate)
        expect(TIMESTAMP.getLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
        ])
      })

      it('should fetch with date filter when date and currentWeek option are provided', () => {
        timestamp.getFromDate.mockReturnValue(123456789)
        timestamp.WEEK.getLastFromDate.mockReturnValue(987654321)

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
            selectedDate,
          },
        } as SearchParameters)

        expect(timestamp.getFromDate).toHaveBeenCalledWith(selectedDate)
        expect(timestamp.WEEK.getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
        ])
      })

      it('should fetch with date filter when date and currentWeekEnd option are provided', () => {
        timestamp.WEEK_END.getFirstFromDate.mockReturnValue(123456789)
        timestamp.WEEK.getLastFromDate.mockReturnValue(987654321)

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
        } as SearchParameters)

        expect(timestamp.WEEK_END.getFirstFromDate).toHaveBeenCalledWith(selectedDate)
        expect(timestamp.WEEK.getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
        ])
      })

      it('should fetch with date filter when date and picked option are provided', () => {
        timestamp.getFirstOfDate.mockReturnValue(123456789)
        timestamp.getLastOfDate.mockReturnValue(987654321)

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.USER_PICK,
            selectedDate,
          },
        } as SearchParameters)

        expect(timestamp.getFirstOfDate).toHaveBeenCalledWith(selectedDate)
        expect(timestamp.getLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
        ])
      })
    })

    describe('by time only', () => {
      it('should fetch with time filter when timeRange is provided', () => {
        const timeRange = [18, 22]
        computeTimeRange.mockReturnValue([64800, 79200])

        const filters = buildNumericFilters({ timeRange } as SearchParameters)

        expect(computeTimeRange).toHaveBeenCalledWith(timeRange)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.times]: { from: 64800, to: 79200 } },
        ])
      })
    })

    describe('by date and time', () => {
      it('should fetch with date filter when timeRange, date and today option are provided', () => {
        const timeRange = [18, 22]
        computeTimeRange.mockReturnValue([64800, 79200])
        timestamp.getAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.TODAY,
            selectedDate,
          },
          timeRange,
        } as SearchParameters)

        expect(timestamp.getAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123, to: 124 } },
        ])
      })

      it('should fetch with date filter when timeRange, date and currentWeek option are provided', () => {
        const timeRange = [18, 22]
        computeTimeRange.mockReturnValue([64800, 79200])
        timestamp.WEEK.getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
          [327, 328],
        ])

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
            selectedDate,
          },
          timeRange,
        } as SearchParameters)

        expect(timestamp.WEEK.getAllFromTimeRangeAndDate).toHaveBeenCalledWith(
          selectedDate,
          timeRange
        )
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123, to: 124 } },
          { [AppSearchFields.dates]: { from: 225, to: 226 } },
          { [AppSearchFields.dates]: { from: 327, to: 328 } },
        ])
      })

      it('should fetch with date filter when timeRange, date and currentWeekEnd option are provided', () => {
        const timeRange = [18, 22]
        computeTimeRange.mockReturnValue([64800, 79200])
        timestamp.WEEK_END.getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
        ])

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
          timeRange,
        } as SearchParameters)

        expect(timestamp.WEEK_END.getAllFromTimeRangeAndDate).toHaveBeenCalledWith(
          selectedDate,
          timeRange
        )
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123, to: 124 } },
          { [AppSearchFields.dates]: { from: 225, to: 226 } },
        ])
      })

      it('should fetch with date filter when timeRange, date and picked option are provided', () => {
        const timeRange = [18, 22]
        computeTimeRange.mockReturnValue([64800, 79200])
        timestamp.getAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        const filters = buildNumericFilters({
          date: {
            option: DATE_FILTER_OPTIONS.USER_PICK,
            selectedDate,
          },
          timeRange,
        } as SearchParameters)

        expect(timestamp.getAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(filters).toStrictEqual([
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.dates]: { from: 123, to: 124 } },
        ])
      })
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should fetch from the beginning datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1)
      timestamp.getFromDate.mockReturnValueOnce(1596240000)

      const filters = buildNumericFilters({ beginningDatetime } as SearchParameters)

      expect(timestamp.getFromDate).toHaveBeenCalledWith(beginningDatetime)
      expect(filters).toStrictEqual([
        { [AppSearchFields.prices]: { to: 30000 } },
        { [AppSearchFields.dates]: { from: 1596240000 } },
      ])
    })

    it('should fetch until the ending datetime', () => {
      const endingDatetime = new Date(2020, 8, 1)
      timestamp.getFromDate.mockReturnValueOnce(1596240000)

      const filters = buildNumericFilters({ endingDatetime } as SearchParameters)

      expect(timestamp.getFromDate).toHaveBeenCalledWith(endingDatetime)
      expect(filters).toStrictEqual([
        { [AppSearchFields.prices]: { to: 30000 } },
        { [AppSearchFields.dates]: { to: 1596240000 } },
      ])
    })

    it('should fetch from the beginning datetime to the ending datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1)
      const endingDatetime = new Date(2020, 8, 2)
      timestamp.getFromDate.mockReturnValueOnce(1596240000).mockReturnValueOnce(1596326400)

      const filters = buildNumericFilters({ beginningDatetime, endingDatetime } as SearchParameters)

      expect(timestamp.getFromDate).toHaveBeenCalledTimes(2)
      expect(filters).toStrictEqual([
        { [AppSearchFields.prices]: { to: 30000 } },
        { [AppSearchFields.dates]: { from: 1596240000, to: 1596326400 } },
      ])
    })
  })
})
