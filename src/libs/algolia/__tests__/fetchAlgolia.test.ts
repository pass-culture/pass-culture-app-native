import algoliasearch from 'algoliasearch'

import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchParametersQuery } from 'libs/algolia/types'

import { Range } from '../../typesUtils/typeHelpers'
import { fetchAlgolia, attributesToRetrieve, fetchAlgoliaHits } from '../fetchAlgolia'

const mockGetFromDate = jest.fn()
const mockGetLastOfDate = jest.fn()
const mockGetFirstOfDate = jest.fn()
const mockGetAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEKEND_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getLastFromDate = jest.fn()
const mock_WEEKEND_getFirstFromDate = jest.fn()

const mockComputeTimeRangeFromHoursToSeconds = jest.fn()

jest.mock('libs/search/datetime/time', () => ({
  TIMESTAMP: {
    getLastOfDate: (arg: Date) => mockGetLastOfDate(arg),
    getFromDate: (arg: Date) => mockGetFromDate(arg),
    getFirstOfDate: (arg: Date) => mockGetFirstOfDate(arg),
    getAllFromTimeRangeAndDate: (date: Date, timeRange: Range<number>) =>
      mockGetAllFromTimeRangeAndDate(date, timeRange),
    WEEK_END: {
      getFirstFromDate: (arg: Date) => mock_WEEKEND_getFirstFromDate(arg),
      getAllFromTimeRangeAndDate: (date: Date, timeRange: Range<number>) =>
        mock_WEEKEND_getAllFromTimeRangeAndDate(date, timeRange),
    },
    WEEK: {
      getLastFromDate: (arg: Date) => mock_WEEK_getLastFromDate(arg),
      getAllFromTimeRangeAndDate: (date: Date, timeRange: Range<number>) =>
        mock_WEEK_getAllFromTimeRangeAndDate(date, timeRange),
    },
  },
  computeTimeRangeFromHoursToSeconds: (arg: Range<number>) =>
    mockComputeTimeRangeFromHoursToSeconds(arg),
}))

const userLocation = {
  latitude: 42,
  longitude: 43,
}

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock

const baseParams = { locationFilter: { locationType: LocationType.EVERYWHERE } }

describe('fetchAlgolia', () => {
  it('should fetch with provided query and default page number', () => {
    const query = 'searched query'

    fetchAlgolia({ ...baseParams, query } as SearchParametersQuery, null, false)

    expect(search).toHaveBeenCalledWith(query, {
      page: 0,
      attributesToHighlight: [],
      attributesToRetrieve,
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
    })
  })

  it('should fetch with provided query and default page number', () => {
    const query = 'searched query'

    fetchAlgolia({ ...baseParams, query } as SearchParametersQuery, null, false)

    expect(search).toHaveBeenCalledWith(query, {
      page: 0,
      attributesToHighlight: [],
      attributesToRetrieve,
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
    })
  })

  describe('underage', () => {
    it('should fetch with provided query and default underage filter', () => {
      const query = 'searched query'

      fetchAlgolia({ ...baseParams, query } as SearchParametersQuery, null, true)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isForbiddenToUnderage:false']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
        numericFilters: [['offer.prices: 0 TO 300']],
      })
    })
    it('should fetch with facetFilters parameter when one category is provided and when underage', () => {
      const query = 'searched query'
      const offerCategories = ['LECON']

      fetchAlgolia({ ...baseParams, query, offerCategories } as SearchParametersQuery, null, true)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.isForbiddenToUnderage:false'],
          ['offer.searchGroupName:LECON'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('query', () => {
    it('should fetch with provided query', () => {
      const query = 'searched query'

      fetchAlgolia({ ...baseParams, query } as SearchParametersQuery, null, false)

      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch without query parameter when no keyword is provided', () => {
      fetchAlgolia({ ...baseParams, query: '', page: 0 } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })
  })

  describe('geolocation', () => {
    it('should fetch with geolocation coordinates when latitude and longitude are provided', () => {
      const query = 'searched query'

      fetchAlgolia(
        {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null },
          query,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
      })
    })

    it('should not fetch with geolocation coordinates when latitude and longitude are not valid', () => {
      const query = 'searched query'

      fetchAlgolia(
        {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null },
          query,
        } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude and radius are provided and search is around me', () => {
      const query = 'searched query'

      fetchAlgolia(
        {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 15 },
          query,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 15000,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius equals zero', () => {
      const query = 'searched query'

      fetchAlgolia(
        {
          locationFilter: { aroundRadius: 0, locationType: LocationType.AROUND_ME },
          query,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 1,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius is null', () => {
      const query = 'searched query'

      fetchAlgolia(
        {
          locationFilter: { aroundRadius: null, locationType: LocationType.AROUND_ME },
          query,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })
  })

  describe('categories and subcategories', () => {
    it('should fetch with no facetFilters parameter when no category is provided', () => {
      const query = 'searched query'
      const offerCategories: string[] = []

      fetchAlgolia({ ...baseParams, query, offerCategories } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters parameter when one category is provided', () => {
      const query = 'searched query'
      const offerCategories = ['LECON']

      fetchAlgolia({ ...baseParams, query, offerCategories } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.searchGroupName:LECON']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters parameter when multiple categories are provided', () => {
      const query = 'searched query'
      const offerCategories = ['SPECTACLE', 'LIVRE']

      fetchAlgolia({ ...baseParams, query, offerCategories } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupName:SPECTACLE', 'offer.searchGroupName:LIVRE'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters parameter when one subcategory is provided', () => {
      const query = 'searched query'
      const offerSubcategories = ['CINE_PLEIN_AIR']

      fetchAlgolia(
        { ...baseParams, query, offerSubcategories } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.subcategoryId:CINE_PLEIN_AIR']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters parameter when multiple subcategory is provided', () => {
      const query = 'searched query'
      const offerSubcategories = ['CINE_PLEIN_AIR', 'ESCAPE_GAME']

      fetchAlgolia(
        { ...baseParams, query, offerSubcategories } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.subcategoryId:CINE_PLEIN_AIR', 'offer.subcategoryId:ESCAPE_GAME'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('offer types', () => {
    afterEach(() => {
      search.mockClear()
    })

    it('should fetch with no facetFilters when no offer type is provided', () => {
      const query = 'searched query'

      fetchAlgolia({ ...baseParams, query } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is digital', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isDigital:true']],
        page: 0,
        attributesToHighlight: [],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with no facetFilters when offer is not digital', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: false,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is physical only', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: true,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.isDigital:false'],
          ['offer.isThing:true'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is event only', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isEvent:true']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is digital and physical', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: true,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isThing:true']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is digital or an event', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: false,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.isDigital:true', 'offer.isEvent:true'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer is physical or an event', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: true,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isDigital:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with no facetFilters when offer is digital, event and thing', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: true,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with no facetFilters when offer is not digital, not event and not thing', () => {
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: false,
      }

      fetchAlgolia({ ...baseParams, query, offerTypes } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })
  })

  describe('offer duo', () => {
    it('should fetch with no facetFilters when offer duo is false', () => {
      const query = 'searched query'
      const offerIsDuo = false

      fetchAlgolia({ ...baseParams, query, offerIsDuo } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters when offer duo is true', () => {
      const query = 'searched query'
      const offerIsDuo = true

      fetchAlgolia({ ...baseParams, query, offerIsDuo } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isDuo:true']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('offer is new', () => {
    it('should fetch with no numericFilters when offerIsNew is false', () => {
      const query = 'searched query'
      const offerIsNew = false

      fetchAlgolia({ ...baseParams, query, offerIsNew } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with numericFilters when offerIsNew is true', () => {
      mockGetFromDate.mockReturnValueOnce(1588762412).mockReturnValueOnce(1589453612)
      const query = 'searched query'
      const offerIsNew = true

      fetchAlgolia({ ...baseParams, query, offerIsNew } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [
          ['offer.prices: 0 TO 300'],
          ['offer.stocksDateCreated: 1588762412 TO 1589453612'],
        ],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('offer price', () => {
    it('should fetch with no numericFilters when no price range is specified and offer is not free', () => {
      const query = 'searched query'
      const offerIsFree = false

      fetchAlgolia({ ...baseParams, query, offerIsFree } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with numericFilters when offer is free even when priceRange is provided', () => {
      const query = 'searched query'
      const offerIsFree = true
      const priceRange: Range<number> = [0, 300]

      fetchAlgolia(
        { ...baseParams, query, offerIsFree, priceRange } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with numericFilters range when price range is provided and offer is not free', () => {
      const query = 'searched query'
      const offerIsFree = false
      const priceRange: Range<number> = [0, 50]

      fetchAlgolia(
        { ...baseParams, query, offerIsFree, priceRange } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 50']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('date', () => {
    describe('by date only', () => {
      it('should fetch with date filter when date and today option are provided', () => {
        const query = 'search query'
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetLastOfDate.mockReturnValue(987654321)

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate },
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when date and currentWeek option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independant-mocks
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.CURRENT_WEEK, selectedDate },
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when date and currentWeekEnd option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independant-mocks
        mock_WEEKEND_getFirstFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independant-mocks
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END, selectedDate },
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mock_WEEKEND_getFirstFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when date and picked option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetFirstOfDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetLastOfDate.mockReturnValue(987654321)

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate },
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mockGetFirstOfDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })
    })

    describe('by time only', () => {
      it('should fetch with time filter when timeRange is provided', () => {
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independant-mocks
        mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([64800, 79200])

        fetchAlgolia({ ...baseParams, timeRange } as SearchParametersQuery, null, false)

        expect(mockComputeTimeRangeFromHoursToSeconds).toHaveBeenCalledWith(timeRange)
        expect(search).toHaveBeenCalledWith('', {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.times: 64800 TO 79200`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })
    })

    describe('by date and time', () => {
      it('should fetch with date filter when timeRange, date and today option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate },
            timeRange: timeRange as Range<number>,
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeek option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independant-mocks
        mock_WEEK_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
          [327, 328],
        ])

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.CURRENT_WEEK, selectedDate },
            timeRange: timeRange as Range<number>,
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mock_WEEK_getAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [
            ['offer.prices: 0 TO 300'],
            [`offer.dates: 123 TO 124`, `offer.dates: 225 TO 226`, `offer.dates: 327 TO 328`],
          ],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeekEnd option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independant-mocks
        mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
        ])

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END, selectedDate },
            timeRange: timeRange as Range<number>,
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mock_WEEKEND_getAllFromTimeRangeAndDate).toHaveBeenCalledWith(
          selectedDate,
          timeRange
        )
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [
            ['offer.prices: 0 TO 300'],
            [`offer.dates: 123 TO 124`, `offer.dates: 225 TO 226`],
          ],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })

      it('should fetch with date filter when timeRange, date and picked option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independant-mocks
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        fetchAlgolia(
          {
            ...baseParams,
            query,
            date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate },
            timeRange: timeRange as Range<number>,
          } as SearchParametersQuery,
          null,
          false
        )

        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve,
        })
      })
    })
  })

  describe('multiple parameters', () => {
    it('should fetch with price and date numericFilters', () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mockGetFirstOfDate.mockReturnValue(123456789)
      // eslint-disable-next-line local-rules/independant-mocks
      mockGetLastOfDate.mockReturnValue(987654321)
      const query = ''
      const offerIsFree = true
      const selectedDate = new Date(2020, 3, 19, 11)

      fetchAlgolia(
        {
          ...baseParams,
          date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate },
          offerIsFree,
        } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0'], ['offer.dates: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with price and time numericFilters', () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([123456789, 987654321])
      const query = ''
      const offerIsFree = true
      const timeRange = [10, 17]

      fetchAlgolia(
        {
          ...baseParams,
          timeRange: timeRange as Range<number>,
          offerIsFree,
        } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0'], ['offer.times: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with price, date and time numericFilters', () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
        [123456789, 987654321],
        [123, 1234],
      ])
      const query = ''
      const offerIsFree = true
      const selectedDate = new Date(2020, 3, 19, 11)

      fetchAlgolia(
        {
          ...baseParams,
          date: { option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END, selectedDate },
          timeRange: [18, 22],
          offerIsFree,
        } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [
          ['offer.prices = 0'],
          ['offer.dates: 123456789 TO 987654321', 'offer.dates: 123 TO 1234'],
        ],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch with all given search parameters', () => {
      const query = 'searched query'
      const offerCategories = ['LECON', 'VISITE']
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }
      const page = 2

      fetchAlgolia(
        {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null },
          query,
          offerCategories,
          offerTypes,
          page,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        page: page,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupName:LECON', 'offer.searchGroupName:VISITE'],
          ['offer.isDigital:true'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve,
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    })

    it('should fetch duo & free event offers for categories pratique & spectacle around me', () => {
      const query = ''
      const offerCategories = ['PRATIQUE', 'SPECTACLE']
      const offerIsDuo = true
      const priceRange = [5, 40]
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      fetchAlgolia(
        {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null },
          query,
          offerCategories,
          offerIsDuo,
          priceRange: priceRange as Range<number>,
          offerTypes,
        } as SearchParametersQuery,
        userLocation,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupName:PRATIQUE', 'offer.searchGroupName:SPECTACLE'],
          ['offer.isEvent:true'],
          ['offer.isDuo:true'],
        ],
        numericFilters: [['offer.prices: 5 TO 40']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve,
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    })
  })

  describe('tags', () => {
    it('should fetch with no facetFilters parameter when no tags are provided', () => {
      const tags: string[] = []

      fetchAlgolia({ ...baseParams, tags } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with facetFilters parameter when tags are provided', () => {
      const tags = ['Semaine du 14 juillet', 'Offre cinema spéciale pass culture']

      fetchAlgolia({ ...baseParams, tags } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.tags:Semaine du 14 juillet', 'offer.tags:Offre cinema spéciale pass culture'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })

  describe('hitsPerPage', () => {
    it('should fetch with no hitsPerPage parameter when not provided', () => {
      const hitsPerPage = null

      fetchAlgolia({ ...baseParams, hitsPerPage } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })

    it('should fetch with hitsPerPage when provided', () => {
      const hitsPerPage = 5

      fetchAlgolia({ ...baseParams, hitsPerPage } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith('', {
        hitsPerPage,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve,
      })
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should fetch from the beginning datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1)
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      fetchAlgolia(
        { ...baseParams, query, beginningDatetime } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates >= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch until the ending datetime', () => {
      const endingDatetime = new Date(2020, 8, 1)
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      fetchAlgolia({ ...baseParams, query, endingDatetime } as SearchParametersQuery, null, false)

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates <= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })

    it('should fetch from the beginning datetime to the ending datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1)
      const endingDatetime = new Date(2020, 8, 2)

      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000).mockReturnValueOnce(1596326400)

      fetchAlgolia(
        { ...baseParams, query, beginningDatetime, endingDatetime } as SearchParametersQuery,
        null,
        false
      )

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 1596240000 TO 1596326400`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve,
      })
    })
  })
})

describe('fetchAlgoliaHits', () => {
  it('should fetch with default search params', () => {
    const queryIds = ['id1', 'id2']

    fetchAlgoliaHits(queryIds, false)

    expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    expect(search).toHaveBeenCalledWith('', {
      facetFilters: [['offer.isEducational:false'], ['objectID:id1', 'objectID:id2']],
      numericFilters: [['offer.prices: 0 TO 300']],
      attributesToRetrieve,
      attributesToHighlight: [],
      page: 0,
      hitsPerPage: 2,
    })
  })

  it('should fetch with udnerage search params', () => {
    const queryIds = ['id1', 'id2']
    fetchAlgoliaHits(queryIds, true)

    expect(search).toHaveBeenCalledWith('', {
      facetFilters: [
        ['offer.isEducational:false'],
        ['offer.isForbiddenToUnderage:false'],
        ['objectID:id1', 'objectID:id2'],
      ],
      numericFilters: [['offer.prices: 0 TO 300']],
      attributesToRetrieve,
      attributesToHighlight: [],
      page: 0,
      hitsPerPage: 2,
    })
  })
})
