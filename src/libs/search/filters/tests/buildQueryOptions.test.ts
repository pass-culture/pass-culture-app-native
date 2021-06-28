/* eslint-disable local-rules/independant-mocks */
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'
import { computeTimeRangeFromHoursToSeconds, TIMESTAMP } from 'libs/search/datetime/time'
import { AppSearchFields } from 'libs/search/filters/constants'

import { buildQueryOptions } from '../index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timestamp = TIMESTAMP as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeTimeRange = computeTimeRangeFromHoursToSeconds as any

jest.mock('libs/search/datetime/time')

const baseParams: Partial<SearchParameters> = {
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
}

describe('buildQueryOptions', () => {
  describe('multiple parameters', () => {
    it('should fetch with price and date numericFilters', () => {
      timestamp.getFirstOfDate.mockReturnValue(123456789)
      timestamp.getLastOfDate.mockReturnValue(987654321)
      const selectedDate = new Date(2020, 3, 19, 11)

      const filters = buildQueryOptions({
        ...baseParams,
        offerIsFree: true,
        date: {
          option: DATE_FILTER_OPTIONS.USER_PICK,
          selectedDate,
        },
      } as SearchParameters)

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
        ],
      })
    })

    it('should fetch with price and time numericFilters', () => {
      computeTimeRange.mockReturnValue([123456789, 987654321])
      const timeRange = [10, 17]

      const filters = buildQueryOptions({
        ...baseParams,
        offerIsFree: true,
        timeRange,
      } as SearchParameters)

      expect(computeTimeRange).toHaveBeenCalledWith(timeRange)
      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.times]: { from: 123456789, to: 987654321 } },
        ],
      })
    })

    it('should fetch with price, date and time numericFilters', () => {
      const timeRange = [18, 22]
      const selectedDate = new Date(2020, 3, 19, 11)
      timestamp.WEEK_END.getAllFromTimeRangeAndDate.mockReturnValue([
        [123456789, 987654321],
        [123, 1234],
      ])

      const filters = buildQueryOptions({
        ...baseParams,
        offerIsFree: true,
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

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.dates]: { from: 123456789, to: 987654321 } },
          { [AppSearchFields.dates]: { from: 123, to: 1234 } },
        ],
      })
    })

    it('should fetch with all given search parameters', () => {
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }
      const offerCategories = ['LECON', 'VISITE']
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }
      const page = 2

      const filters = buildQueryOptions(
        {
          aroundRadius: 123,
          offerTypes,
          offerCategories,
          geolocation,
        } as SearchParameters,
        page
      )

      expect(filters.page).toStrictEqual({
        current: 2,
        size: 20,
      })

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_digital]: 'true' },
          { [AppSearchFields.category]: ['LECON', 'VISITE'] },
          { [AppSearchFields.geoloc]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })

    it('should fetch event offers for categories pratique & spectacle around me', () => {
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }
      const offerCategories = ['PRATIQUE', 'SPECTACLE']
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      const filters = buildQueryOptions({
        aroundRadius: 123,
        offerTypes,
        offerCategories,
        geolocation,
        offerIsDuo: false,
      } as SearchParameters)

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_event]: 'true' },
          { [AppSearchFields.category]: ['PRATIQUE', 'SPECTACLE'] },
          { [AppSearchFields.geoloc]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })

    it('should fetch duo & free event offers for categories pratique & spectacle around me', () => {
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }
      const offerCategories = ['PRATIQUE', 'SPECTACLE']
      const priceRange = [5, 40]
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      const filters = buildQueryOptions({
        aroundRadius: 123,
        offerTypes,
        offerCategories,
        geolocation,
        offerIsDuo: true,
        priceRange,
      } as SearchParameters)

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_event]: 'true' },
          { [AppSearchFields.category]: ['PRATIQUE', 'SPECTACLE'] },
          { [AppSearchFields.is_duo]: 'true' },
          { [AppSearchFields.prices]: { from: 500, to: 4000 } },
          { [AppSearchFields.geoloc]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })
  })

  describe('hitsPerPage', () => {
    it('should fetch with no hitsPerPage parameter when not provided', () => {
      const filters = buildQueryOptions({ ...baseParams, hitsPerPage: null } as SearchParameters)
      expect(filters.page).toStrictEqual({
        current: 1,
        size: 20,
      })
    })

    it('should fetch with hitsPerPage when provided', () => {
      const filters = buildQueryOptions({ ...baseParams, hitsPerPage: 5 } as SearchParameters)
      expect(filters.page).toStrictEqual({
        current: 1,
        size: 5,
      })
    })
  })
})
