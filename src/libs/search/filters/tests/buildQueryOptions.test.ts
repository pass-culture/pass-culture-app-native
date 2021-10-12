import { SearchGroupNameEnum } from 'api/gen'
import { DATE_FILTER_OPTIONS, LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { AppSearchFields, FALSE } from 'libs/search/filters/constants'

import { buildQueryOptions } from '../index'

const HOUR = 60 * 60

const baseParams: Partial<SearchState> = {
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  locationFilter: { locationType: LocationType.EVERYWHERE },
}

const userLocation = {
  latitude: 42,
  longitude: 43,
}

const educationalFilter = {
  [AppSearchFields.is_educational]: FALSE,
}

describe('buildQueryOptions', () => {
  describe('multiple parameters', () => {
    it('should fetch with price and date numericFilters', () => {
      const selectedDate = new Date(2020, 3, 19, 11)
      const from = '2020-04-19T00:00:00.000Z'
      const to = '2020-04-19T23:59:59.000Z'

      const filters = buildQueryOptions(
        {
          ...baseParams,
          offerIsFree: true,
          date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate },
        } as SearchState,
        null,
        false
      )

      expect(filters.filters).toStrictEqual({
        all: [
          educationalFilter,
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.dates]: { from, to } },
        ],
      })
    })

    it('should fetch with price and time numericFilters', () => {
      const timeRange = [10, 17]
      const filters = buildQueryOptions(
        { ...baseParams, offerIsFree: true, timeRange } as SearchState,
        null,
        false
      )

      expect(filters.filters).toStrictEqual({
        all: [
          educationalFilter,
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.times]: { from: 10 * HOUR, to: 17 * HOUR } },
        ],
      })
    })

    it('should fetch with price, date and time numericFilters', () => {
      const selectedDate = new Date(2020, 3, 19, 11)
      const timeRange = [18, 22]
      const sundayFrom = '2020-04-19T18:00:00.000Z'
      const sundayTo = '2020-04-19T22:00:00.000Z'

      const filters = buildQueryOptions(
        {
          ...baseParams,
          offerIsFree: true,
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
          timeRange,
        } as SearchState,
        null,
        false
      )

      expect(filters.filters).toStrictEqual({
        all: [
          educationalFilter,
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.dates]: { from: sundayFrom, to: sundayTo } },
        ],
      })
    })

    it('should fetch with all given search parameters', () => {
      const offerCategories = [SearchGroupNameEnum.COURS, SearchGroupNameEnum.VISITE]
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }
      const page = 2

      const filters = buildQueryOptions(
        {
          offerTypes,
          offerCategories,
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 123 },
        } as SearchState,
        userLocation,
        false,
        page
      )

      expect(filters.page).toStrictEqual({
        current: 2,
        size: 20,
      })

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_digital]: 1 },
          {
            [AppSearchFields.search_group_name]: [
              SearchGroupNameEnum.COURS,
              SearchGroupNameEnum.VISITE,
            ],
          },
          educationalFilter,
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.venue_position]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })

    it('should fetch event offers for categories cours & spectacle around me', () => {
      const offerCategories = [SearchGroupNameEnum.COURS, SearchGroupNameEnum.SPECTACLE]
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      const filters = buildQueryOptions(
        {
          offerTypes,
          offerCategories,
          offerIsDuo: false,
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 123 },
        } as SearchState,
        userLocation,
        false
      )

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_event]: 1 },
          {
            [AppSearchFields.search_group_name]: [
              SearchGroupNameEnum.COURS,
              SearchGroupNameEnum.SPECTACLE,
            ],
          },
          educationalFilter,
          { [AppSearchFields.prices]: { to: 30000 } },
          { [AppSearchFields.venue_position]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })

    it('should fetch duo & free event offers for categories cours & spectacle around me', () => {
      const offerCategories = [SearchGroupNameEnum.COURS, SearchGroupNameEnum.SPECTACLE]
      const priceRange = [5, 40]
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      const filters = buildQueryOptions(
        {
          offerTypes,
          offerCategories,
          offerIsDuo: true,
          priceRange,
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 123 },
        } as SearchState,
        userLocation,
        false
      )

      expect(filters.filters).toStrictEqual({
        all: [
          { [AppSearchFields.is_event]: 1 },
          {
            [AppSearchFields.search_group_name]: [
              SearchGroupNameEnum.COURS,
              SearchGroupNameEnum.SPECTACLE,
            ],
          },
          { [AppSearchFields.is_duo]: 1 },
          educationalFilter,
          { [AppSearchFields.prices]: { from: 500, to: 4000 } },
          { [AppSearchFields.venue_position]: { center: '42, 43', distance: 123, unit: 'km' } },
        ],
      })
    })
  })

  describe('hitsPerPage', () => {
    it('should fetch with no hitsPerPage parameter when not provided', () => {
      const filters = buildQueryOptions(
        { ...baseParams, hitsPerPage: null } as SearchState,
        null,
        false
      )
      expect(filters.page).toStrictEqual({
        current: 1,
        size: 20,
      })
    })

    it('should fetch with hitsPerPage when provided', () => {
      const filters = buildQueryOptions(
        { ...baseParams, hitsPerPage: 5 } as SearchState,
        null,
        false
      )
      expect(filters.page).toStrictEqual({
        current: 1,
        size: 5,
      })
    })
  })

  describe('group', () => {
    it('should always fetch a single offer per group (isbn/visa/...)', () => {
      const filters = buildQueryOptions(baseParams as SearchState, null, false)
      expect(filters.group).toStrictEqual({ field: AppSearchFields.group })
    })
  })

  describe('underage parameters', () => {
    it('should filter out non free digital offers except press category if user is underage', () => {
      const filters = buildQueryOptions(baseParams as SearchState, null, true)

      expect(filters.filters).toStrictEqual({
        all: [educationalFilter, { [AppSearchFields.prices]: { to: 30000 } }],
        any: [
          { is_digital: 0 },
          { [AppSearchFields.prices]: { to: 1 } },
          { [AppSearchFields.search_group_name]: SearchGroupNameEnum.PRESSE },
        ],
      })
    })
  })
})
