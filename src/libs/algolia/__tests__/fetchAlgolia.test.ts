import algoliasearch from 'algoliasearch'

import { Range } from '../../typesUtils/typeHelpers'
import { DATE_FILTER_OPTIONS } from '../enums/filtersEnums'
import { fetchAlgolia } from '../fetchAlgolia'
import { FetchAlgoliaParameters, LocationType } from '../types'

const mockGetFromDate = jest.fn()
const mockGetLastOfDate = jest.fn()
const mockGetFirstOfDate = jest.fn()
const mockGetAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEKEND_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getLastFromDate = jest.fn()
const mock_WEEKEND_getFirstFromDate = jest.fn()

const mockComputeTimeRangeFromHoursToSeconds = jest.fn()

jest.mock('libs/algolia/datetime/time', () => ({
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

const search = jest.fn()
const mockInitIndex = jest.fn()
mockInitIndex.mockReturnValue({ search })
jest.mock('algoliasearch', () =>
  jest.fn(() => ({
    initIndex: (arg1: string) => mockInitIndex(arg1),
  }))
)

describe('fetchAlgolia', () => {
  it('should fetch with provided query and default page number', () => {
    // given
    const query = 'searched query'

    // when
    fetchAlgolia({
      query: query,
    } as FetchAlgoliaParameters)

    // then
    expect(search).toHaveBeenCalledWith(query, {
      page: 0,
      attributesToHighlight: [],
      attributesToRetrieve: ['*'],
    })
  })

  describe('query', () => {
    it('should fetch with provided query', () => {
      // given
      const query = 'searched query'

      // when
      fetchAlgolia({
        geolocation: null,
        query: query,
      } as FetchAlgoliaParameters)

      // then
      expect(algoliasearch).toHaveBeenCalledWith('algoliaAppId', 'algoliaApiKey')
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaIndexName')
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch without query parameter when no keyword is provided', () => {
      // when
      fetchAlgolia({
        query: '',
        page: 0,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('geolocation', () => {
    it('should fetch with geolocation coordinates when latitude and longitude are provided', () => {
      // given
      const query = 'searched query'
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }

      // when
      fetchAlgolia({
        geolocation,
        query,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should not fetch with geolocation coordinates when latitude and longitude are not valid', () => {
      // given
      const query = 'searched query'
      const geolocation = null

      // when
      fetchAlgolia({
        geolocation: geolocation,
        query: query,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude are provided and search is not around me', () => {
      // given
      const query = 'searched query'
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }

      // when
      fetchAlgolia({
        geolocation: geolocation,
        query: query,
        locationType: LocationType.EVERYWHERE,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude and radius are provided and search is around me', () => {
      // given
      const query = 'searched query'
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }

      // when
      fetchAlgolia({
        aroundRadius: 15,
        geolocation: geolocation,
        query: query,
        locationType: LocationType.AROUND_ME,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 15000,
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius equals zero', () => {
      // given
      const query = 'searched query'
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }

      // when
      fetchAlgolia({
        aroundRadius: 0,
        geolocation: geolocation,
        query: query,
        locationType: LocationType.AROUND_ME,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 1,
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius is null', () => {
      // given
      const query = 'searched query'
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }

      // when
      fetchAlgolia({
        aroundRadius: -1,
        geolocation: geolocation,
        query: query,
        locationType: LocationType.AROUND_ME,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('categories', () => {
    it('should fetch with no facetFilters parameter when no category is provided', () => {
      // given
      const query = 'searched query'
      const offerCategories: string[] = []

      // when
      fetchAlgolia({
        query: query,
        offerCategories: offerCategories,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters parameter when one category is provided', () => {
      // given
      const query = 'searched query'
      const offerCategories = ['LECON']

      // when
      fetchAlgolia({
        query: query,
        offerCategories: offerCategories,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.category:LECON']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters parameter when multiple categories are provided', () => {
      // given
      const query = 'searched query'
      const offerCategories = ['SPECTACLE', 'LIVRE']

      // when
      fetchAlgolia({
        query: query,
        offerCategories: offerCategories,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.category:SPECTACLE', 'offer.category:LIVRE']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('offer types', () => {
    afterEach(() => {
      search.mockClear()
    })
    it('should fetch with no facetFilters when no offer type is provided', () => {
      // given
      const query = 'searched query'

      // when
      fetchAlgolia({
        query: query,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is digital', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isDigital:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with no facetFilters when offer is not digital', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: false,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is physical only', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: true,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isDigital:false'], ['offer.isThing:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is event only', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEvent:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is digital and physical', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: true,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isThing:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is digital or an event', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: false,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isDigital:true', 'offer.isEvent:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer is physical or an event', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: true,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isDigital:false']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with no facetFilters when offer is digital, event and thing', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: true,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with no facetFilters when offer is not digital, not event and not thing', () => {
      // given
      const query = 'searched query'
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: false,
      }

      // when
      fetchAlgolia({
        query: query,
        offerTypes: offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('offer duo', () => {
    it('should fetch with no facetFilters when offer duo is false', () => {
      // given
      const query = 'searched query'

      // when
      fetchAlgolia({
        query: query,
        offerIsDuo: false,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters when offer duo is true', () => {
      // given
      const query = 'searched query'
      const offerIsDuo = true

      // when
      fetchAlgolia({
        query: query,
        offerIsDuo: offerIsDuo,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isDuo:true']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('offer is new', () => {
    it('should fetch with no numericFilters when offerIsNew is false', () => {
      // given
      const query = 'searched query'

      // when
      fetchAlgolia({
        query: query,
        offerIsNew: false,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with numericFilters when offerIsNew is true', () => {
      // given
      mockGetFromDate.mockReturnValueOnce(1588762412).mockReturnValueOnce(1589453612)
      const query = 'searched query'
      const offerIsNew = true

      // when
      fetchAlgolia({
        query: query,
        offerIsNew: offerIsNew,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [['offer.stocksDateCreated: 1588762412 TO 1589453612']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('offer price', () => {
    it('should fetch with no numericFilters when no price range is specified and offer is not free', () => {
      // given
      const query = 'searched query'
      const isFree = false

      // when
      fetchAlgolia({
        query: query,
        offerIsFree: isFree,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with numericFilters when offer is free even when priceRange is provided', () => {
      // given
      const query = 'searched query'
      const offerIsFree = true
      const priceRange: Range<number> = [0, 300]

      // when
      fetchAlgolia({
        query,
        offerIsFree,
        priceRange,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [['offer.prices = 0']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with numericFilters range when price range is provided and offer is not free', () => {
      // given
      const query = 'searched query'
      const offerIsFree = false
      const priceRange: Range<number> = [0, 50]

      // when
      fetchAlgolia({
        query,
        offerIsFree,
        priceRange,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [['offer.prices: 0 TO 50']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('date', () => {
    describe('by date only', () => {
      it('should fetch with date filter when date and today option are provided', () => {
        // Given
        const query = 'search query'
        const selectedDate = new Date(2020, 3, 19, 11)
        mockGetFromDate.mockReturnValue(123456789)
        mockGetLastOfDate.mockReturnValue(987654321)

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.TODAY,
            selectedDate,
          },
        } as FetchAlgoliaParameters)

        // Then
        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when date and currentWeek option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        mockGetFromDate.mockReturnValue(123456789)
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
            selectedDate,
          },
        } as FetchAlgoliaParameters)

        // Then
        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when date and currentWeekEnd option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        mock_WEEKEND_getFirstFromDate.mockReturnValue(123456789)
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
        } as FetchAlgoliaParameters)

        // Then
        expect(mock_WEEKEND_getFirstFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when date and picked option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        mockGetFirstOfDate.mockReturnValue(123456789)
        mockGetLastOfDate.mockReturnValue(987654321)

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.USER_PICK,
            selectedDate,
          },
        } as FetchAlgoliaParameters)

        // Then
        expect(mockGetFirstOfDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })
    })

    describe('by time only', () => {
      it('should fetch with time filter when timeRange is provided', () => {
        // Given
        const timeRange = [18, 22]
        mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([64800, 79200])

        // When
        fetchAlgolia({ timeRange } as FetchAlgoliaParameters)

        // Then
        expect(mockComputeTimeRangeFromHoursToSeconds).toHaveBeenCalledWith(timeRange)
        expect(search).toHaveBeenCalledWith('', {
          numericFilters: [[`offer.times: 64800 TO 79200`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })
    })

    describe('by date and time', () => {
      it('should fetch with date filter when timeRange, date and today option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.TODAY,
            selectedDate,
          },
          timeRange: timeRange as Range<number>,
        } as FetchAlgoliaParameters)

        // Then
        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeek option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        mock_WEEK_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
          [327, 328],
        ])

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
            selectedDate,
          },
          timeRange: timeRange as Range<number>,
        } as FetchAlgoliaParameters)

        // Then
        expect(mock_WEEK_getAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [
            [`offer.dates: 123 TO 124`, `offer.dates: 225 TO 226`, `offer.dates: 327 TO 328`],
          ],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeekEnd option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
        ])

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
          timeRange: timeRange as Range<number>,
        } as FetchAlgoliaParameters)

        // Then
        expect(mock_WEEKEND_getAllFromTimeRangeAndDate).toHaveBeenCalledWith(
          selectedDate,
          timeRange
        )
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123 TO 124`, `offer.dates: 225 TO 226`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })

      it('should fetch with date filter when timeRange, date and picked option are provided', () => {
        // Given
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        // When
        fetchAlgolia({
          query,
          date: {
            option: DATE_FILTER_OPTIONS.USER_PICK,
            selectedDate,
          },
          timeRange: timeRange as Range<number>,
        } as FetchAlgoliaParameters)

        // Then
        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          numericFilters: [[`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: ['*'],
        })
      })
    })
  })

  describe('multiple parameters', () => {
    it('should fetch with price and date numericFilters', () => {
      // Given
      mockGetFirstOfDate.mockReturnValue(123456789)
      mockGetLastOfDate.mockReturnValue(987654321)
      const query = ''
      const isFree = true
      const selectedDate = new Date(2020, 3, 19, 11)

      // When
      fetchAlgolia({
        date: {
          option: DATE_FILTER_OPTIONS.USER_PICK,
          selectedDate,
        },
        offerIsFree: isFree,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [['offer.prices = 0'], ['offer.dates: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with price and time numericFilters', () => {
      // Given
      mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([123456789, 987654321])
      const query = ''
      const isFree = true
      const timeRange = [10, 17]

      // When
      fetchAlgolia({
        timeRange: timeRange as Range<number>,
        offerIsFree: isFree,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [['offer.prices = 0'], ['offer.times: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with price, date and time numericFilters', () => {
      // Given
      mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
        [123456789, 987654321],
        [123, 1234],
      ])
      const query = ''
      const isFree = true
      const selectedDate = new Date(2020, 3, 19, 11)

      // When
      fetchAlgolia({
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
          selectedDate,
        },
        timeRange: [18, 22],
        offerIsFree: isFree,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [
          ['offer.prices = 0'],
          ['offer.dates: 123456789 TO 987654321', 'offer.dates: 123 TO 1234'],
        ],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with all given search parameters', () => {
      // given
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }
      const query = 'searched query'
      const offerCategories = ['LECON', 'VISITE']
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }
      const page = 2

      // when
      fetchAlgolia({
        geolocation: geolocation,
        query: query,
        offerCategories: offerCategories,
        offerTypes: offerTypes,
        page: page,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: page,
        facetFilters: [['offer.category:LECON', 'offer.category:VISITE'], ['offer.isDigital:true']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaIndexName')
    })

    it('should fetch duo & free event offers for categories pratique & spectacle around me', () => {
      // given
      const geolocation = {
        latitude: 42,
        longitude: 43,
      }
      const query = ''
      const offerCategories = ['PRATIQUE', 'SPECTACLE']
      const offerIsDuo = true
      const priceRange = [5, 40]
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      // when
      fetchAlgolia({
        geolocation,
        query,
        offerCategories,
        offerIsDuo,
        priceRange: priceRange as Range<number>,
        offerTypes,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        facetFilters: [
          ['offer.category:PRATIQUE', 'offer.category:SPECTACLE'],
          ['offer.isEvent:true'],
          ['offer.isDuo:true'],
        ],
        numericFilters: [['offer.prices: 5 TO 40']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaIndexName')
    })
  })

  describe('tags', () => {
    it('should fetch with no facetFilters parameter when no tags are provided', () => {
      // given
      const tags: string[] = []

      // when
      fetchAlgolia({
        tags: tags,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with facetFilters parameter when tags are provided', () => {
      // given
      const tags = ['Semaine du 14 juillet', 'Offre cinema spéciale pass culture']

      // when
      fetchAlgolia({
        tags: tags,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        facetFilters: [
          ['offer.tags:Semaine du 14 juillet', 'offer.tags:Offre cinema spéciale pass culture'],
        ],
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('hitsPerPage', () => {
    it('should fetch with no hitsPerPage parameter when not provided', () => {
      // given
      const hitsPerPage = null

      // when
      fetchAlgolia({
        hitsPerPage,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch with hitsPerPage when provided', () => {
      // given
      const hitsPerPage = 5

      // when
      fetchAlgolia({
        hitsPerPage,
      } as FetchAlgoliaParameters)

      // then
      expect(search).toHaveBeenCalledWith('', {
        hitsPerPage,
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should fetch from the beginning datetime', () => {
      // Given
      const beginningDatetime = new Date(2020, 8, 1)
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      // When
      fetchAlgolia({
        query,
        beginningDatetime,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [[`offer.dates >= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch until the ending datetime', () => {
      // Given
      const endingDatetime = new Date(2020, 8, 1)
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      // When
      fetchAlgolia({
        query,
        endingDatetime,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [[`offer.dates <= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })

    it('should fetch from the beginning datetime to the ending datetime', () => {
      // Given
      const beginningDatetime = new Date(2020, 8, 1)
      const endingDatetime = new Date(2020, 8, 2)

      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000).mockReturnValueOnce(1596326400)

      // When
      fetchAlgolia({
        query,
        beginningDatetime,
        endingDatetime,
      } as FetchAlgoliaParameters)

      // Then
      expect(search).toHaveBeenCalledWith(query, {
        numericFilters: [[`offer.dates: 1596240000 TO 1596326400`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: ['*'],
      })
    })
  })
})
