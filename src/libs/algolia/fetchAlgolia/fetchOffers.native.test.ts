import algoliasearch from 'algoliasearch'

import { GenreType } from 'api/gen'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { MAX_PRICE_IN_CENTS } from 'features/search/helpers/reducer.helpers'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { Range } from 'libs/typesUtils/typeHelpers'

const mockGetFromDate = jest.fn()
const mockGetLastOfDate = jest.fn()
const mockGetFirstOfDate = jest.fn()
const mockGetAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEKEND_getAllFromTimeRangeAndDate = jest.fn()
const mock_WEEK_getLastFromDate = jest.fn()
const mock_WEEKEND_getFirstFromDate = jest.fn()

const mockComputeTimeRangeFromHoursToSeconds = jest.fn()

jest.mock('libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/datetime/time', () => ({
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

const buildLocationParameterParams: BuildLocationParameterParams = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  userLocation: null,
  aroundMeRadius: 'all',
  aroundPlaceRadius: 'all',
}

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock

describe('fetchOffer', () => {
  it('should fetch with provided query and default page number', () => {
    const query = 'searched query'

    fetchOffers({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams,
      isUserUnderage: false,
    })

    expect(search).toHaveBeenCalledWith(query, {
      page: 0,
      attributesToHighlight: [],
      attributesToRetrieve: offerAttributesToRetrieve,
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
      clickAnalytics: true,
    })
  })

  it('should store Algolia query ID after fetching an offer', async () => {
    const spyStoreQueryID = jest.fn()
    const query = 'searched query'
    search.mockResolvedValueOnce({ queryID: 'queryID' })

    await fetchOffers({
      parameters: { query } as SearchQueryParameters,
      buildLocationParameterParams,
      isUserUnderage: false,
      storeQueryID: spyStoreQueryID,
    })

    expect(spyStoreQueryID).toHaveBeenCalledWith('queryID')
  })

  describe('underage', () => {
    it('should fetch with provided query and default underage filter', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: true,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isForbiddenToUnderage:false']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        numericFilters: [['offer.prices: 0 TO 300']],
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one category is provided and when underage', () => {
      const query = 'searched query'
      const offerCategories = ['LECON']

      fetchOffers({
        parameters: { query, offerCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: true,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.isForbiddenToUnderage:false'],
          ['offer.searchGroupNamev2:LECON'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('query', () => {
    it('should fetch with provided query', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch without query parameter when no keyword is provided', () => {
      fetchOffers({
        parameters: { query: '', page: 0 } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('geolocation', () => {
    it('should fetch with geolocation coordinates when latitude and longitude are provided', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: {
          query,
        } as SearchQueryParameters,
        buildLocationParameterParams: {
          selectedLocationMode: LocationMode.AROUND_ME,
          userLocation,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        clickAnalytics: true,
      })
    })

    it('should not fetch with geolocation coordinates when latitude and longitude are not valid', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: {
          selectedLocationMode: LocationMode.AROUND_ME,
          userLocation: null,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        clickAnalytics: true,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude and radius are provided and search is around me', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: {
          selectedLocationMode: LocationMode.AROUND_ME,
          userLocation,
          aroundMeRadius: 15,
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 15000,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude are provided and search is everywhere without radius', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: { ...buildLocationParameterParams, userLocation },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude are provided and search is everywhere', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: {
          ...buildLocationParameterParams,
          userLocation,
          aroundMeRadius: 50000,
          aroundPlaceRadius: 50000,
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius equals zero', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode: LocationMode.AROUND_ME,
          aroundMeRadius: 0,
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 1,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch offers with geolocation coordinates, when latitude, longitude, search is around me, and radius is null', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode: LocationMode.AROUND_ME,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('categories and subcategories', () => {
    it('should fetch with no facetFilters parameter when no category is provided', () => {
      const query = 'searched query'
      const offerCategories: string[] = []

      fetchOffers({
        parameters: { query, offerCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one category is provided', () => {
      const query = 'searched query'
      const offerCategories = ['LECON']

      fetchOffers({
        parameters: { query, offerCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.searchGroupNamev2:LECON']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when multiple categories are provided', () => {
      const query = 'searched query'
      const offerCategories = ['SPECTACLES', 'LIVRES']

      fetchOffers({
        parameters: { query, offerCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupNamev2:SPECTACLES', 'offer.searchGroupNamev2:LIVRES'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one subcategory is provided', () => {
      const query = 'searched query'
      const offerSubcategories = ['CINE_PLEIN_AIR']

      fetchOffers({
        parameters: { query, offerSubcategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.subcategoryId:CINE_PLEIN_AIR']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when multiple subcategory is provided', () => {
      const query = 'searched query'
      const offerSubcategories = ['CINE_PLEIN_AIR', 'ESCAPE_GAME']

      fetchOffers({
        parameters: { query, offerSubcategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.subcategoryId:CINE_PLEIN_AIR', 'offer.subcategoryId:ESCAPE_GAME'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one native category is provided', () => {
      const query = 'searched query'
      const offerNativeCategories = ['LIVRES_PAPIER']

      fetchOffers({
        parameters: { query, offerNativeCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.nativeCategoryId:LIVRES_PAPIER']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when multiple native category is provided', () => {
      const query = 'searched query'
      const offerNativeCategories = ['LIVRES_PAPIER', 'LIVRES_NUMERIQUE_ET_AUDIO']

      fetchOffers({
        parameters: { query, offerNativeCategories } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [
          ['offer.isEducational:false'],
          [
            'offer.nativeCategoryId:LIVRES_PAPIER',
            'offer.nativeCategoryId:LIVRES_NUMERIQUE_ET_AUDIO',
          ],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one movieGenre is provided', () => {
      const query = 'searched query'
      const offerGenreTypes = [{ key: GenreType.MOVIE, value: 'Drame', name: 'DRAMA' }]

      fetchOffers({
        parameters: { query, offerGenreTypes } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.movieGenres:DRAMA']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one bookMacroSection is provided', () => {
      const query = 'searched query'
      const offerGenreTypes = [{ key: GenreType.BOOK, value: 'Droit', name: 'Droit' }]

      fetchOffers({
        parameters: { query, offerGenreTypes } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.bookMacroSection:Droit']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one showType is provided', () => {
      const query = 'searched query'
      const offerGenreTypes = [
        { key: GenreType.SHOW, value: 'Arts de la rue', name: 'Arts de la rue' },
      ]

      fetchOffers({
        parameters: { query, offerGenreTypes } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.showType:Arts de la rue']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when one musicType is provided', () => {
      const query = 'searched query'
      const offerGenreTypes = [{ key: GenreType.MUSIC, value: 'Pop', name: 'Pop' }]

      fetchOffers({
        parameters: { query, offerGenreTypes } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.musicType:Pop']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when unknown genre type is provided', () => {
      const query = 'searched query'
      const offerGenreTypes = [{ key: 'UNKNOWN', value: 'Pop', name: 'Pop' }]

      fetchOffers({
        parameters: { query, offerGenreTypes } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('offer types', () => {
    it('should fetch with no facetFilters when no offer type is provided', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters when offer is digital', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query, isDigital: true } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isDigital:true']],
        page: 0,
        attributesToHighlight: [],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with no facetFilters when offer is not digital', () => {
      const query = 'searched query'
      fetchOffers({
        parameters: { query, isDigital: false } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('offer duo', () => {
    it('should fetch with no facetFilters when offer duo is false', () => {
      const query = 'searched query'
      const offerIsDuo = false

      fetchOffers({
        parameters: { query, offerIsDuo } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters when offer duo is true', () => {
      const query = 'searched query'
      const offerIsDuo = true

      fetchOffers({
        parameters: { query, offerIsDuo } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.isDuo:true']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('offer price', () => {
    it('should fetch with no numericFilters when no price range is specified and offer is not free', () => {
      const query = 'searched query'
      const offerIsFree = false

      fetchOffers({
        parameters: { query, offerIsFree } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with numericFilters when offer is free even when priceRange is provided', () => {
      const query = 'searched query'
      const offerIsFree = true
      const priceRange: Range<number> = [0, 300]

      fetchOffers({
        parameters: { query, offerIsFree, priceRange } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with numericFilters range when price range is provided and offer is not free', () => {
      const query = 'searched query'
      const offerIsFree = false
      const priceRange: Range<number> = [0, 50]

      fetchOffers({
        parameters: { query, offerIsFree, priceRange } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 50']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with minimum price when it is provided', () => {
      const query = 'searched query'
      const minPrice = '5'

      fetchOffers({
        parameters: { query, minPrice } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 5 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with 0 when minimum price is not provided', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with maximum price when it is provided', () => {
      const query = 'searched query'
      const maxPrice = '25'

      fetchOffers({
        parameters: { query, maxPrice } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 25']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it.each([convertCentsToEuros(MAX_PRICE_IN_CENTS)])(
      'should fetch with %s when maximum price is not provided',
      () => {
        const query = 'searched query'

        fetchOffers({
          parameters: { query } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [[`offer.prices: 0 TO ${convertCentsToEuros(MAX_PRICE_IN_CENTS)}`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      }
    )
  })

  describe('date', () => {
    describe('by date only', () => {
      it('should fetch with date filter when date and today option are provided', () => {
        const query = 'search query'
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetLastOfDate.mockReturnValue(987654321)

        fetchOffers({
          parameters: {
            query,
            date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: selectedDate.toISOString() },
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when date and currentWeek option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independent-mocks
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
              selectedDate: selectedDate.toISOString(),
            },
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockGetFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when date and currentWeekEnd option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independent-mocks
        mock_WEEKEND_getFirstFromDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independent-mocks
        mock_WEEK_getLastFromDate.mockReturnValue(987654321)

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
              selectedDate: selectedDate.toISOString(),
            },
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mock_WEEKEND_getFirstFromDate).toHaveBeenCalledWith(selectedDate)
        expect(mock_WEEK_getLastFromDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when date and picked option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetFirstOfDate.mockReturnValue(123456789)
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetLastOfDate.mockReturnValue(987654321)

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.USER_PICK,
              selectedDate: selectedDate.toISOString(),
            },
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockGetFirstOfDate).toHaveBeenCalledWith(selectedDate)
        expect(mockGetLastOfDate).toHaveBeenCalledWith(selectedDate)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123456789 TO 987654321`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })
    })

    describe('by time only', () => {
      it('should fetch with time filter when timeRange is provided', () => {
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independent-mocks
        mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([64800, 79200])

        fetchOffers({
          parameters: { timeRange } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockComputeTimeRangeFromHoursToSeconds).toHaveBeenCalledWith(timeRange)
        expect(search).toHaveBeenCalledWith('', {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.times: 64800 TO 79200`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })
    })

    describe('by date and time', () => {
      it('should fetch with date filter when timeRange, date and today option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        fetchOffers({
          parameters: {
            query,
            date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: selectedDate.toISOString() },
            timeRange: timeRange as Range<number>,
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeek option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independent-mocks
        mock_WEEK_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
          [327, 328],
        ])

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
              selectedDate: selectedDate.toISOString(),
            },
            timeRange: timeRange as Range<number>,
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mock_WEEK_getAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [
            ['offer.prices: 0 TO 300'],
            [`offer.dates: 123 TO 124`, `offer.dates: 225 TO 226`, `offer.dates: 327 TO 328`],
          ],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when timeRange, date and currentWeekEnd option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independent-mocks
        mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
          [123, 124],
          [225, 226],
        ])

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
              selectedDate: selectedDate.toISOString(),
            },
            timeRange: timeRange as Range<number>,
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

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
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })

      it('should fetch with date filter when timeRange, date and picked option are provided', () => {
        const query = ''
        const selectedDate = new Date(2020, 3, 19, 11)
        const timeRange = [18, 22]
        // eslint-disable-next-line local-rules/independent-mocks
        mockGetAllFromTimeRangeAndDate.mockReturnValue([123, 124])

        fetchOffers({
          parameters: {
            query,
            date: {
              option: DATE_FILTER_OPTIONS.USER_PICK,
              selectedDate: selectedDate.toISOString(),
            },
            timeRange: timeRange as Range<number>,
          } as SearchQueryParameters,
          buildLocationParameterParams,
          isUserUnderage: false,
        })

        expect(mockGetAllFromTimeRangeAndDate).toHaveBeenCalledWith(selectedDate, timeRange)
        expect(search).toHaveBeenCalledWith(query, {
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 123 TO 124`]],
          page: 0,
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          clickAnalytics: true,
        })
      })
    })
  })

  describe('multiple parameters', () => {
    it('should fetch with price and date numericFilters', () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockGetFirstOfDate.mockReturnValue(123456789)
      // eslint-disable-next-line local-rules/independent-mocks
      mockGetLastOfDate.mockReturnValue(987654321)
      const query = ''
      const offerIsFree = true
      const selectedDate = new Date(2020, 3, 19, 11).toISOString()

      fetchOffers({
        parameters: {
          date: { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate },
          offerIsFree,
        } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0'], ['offer.dates: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with price and time numericFilters', () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockComputeTimeRangeFromHoursToSeconds.mockReturnValue([123456789, 987654321])
      const query = ''
      const offerIsFree = true
      const timeRange = [10, 17]

      fetchOffers({
        parameters: {
          timeRange: timeRange as Range<number>,
          offerIsFree,
        } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices = 0'], ['offer.times: 123456789 TO 987654321']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with price, date and time numericFilters', () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mock_WEEKEND_getAllFromTimeRangeAndDate.mockReturnValue([
        [123456789, 987654321],
        [123, 1234],
      ])
      const query = ''
      const offerIsFree = true
      const selectedDate = new Date(2020, 3, 19, 11).toISOString()

      fetchOffers({
        parameters: {
          date: {
            option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
            selectedDate,
          },
          timeRange: [18, 22],
          offerIsFree,
        } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [
          ['offer.prices = 0'],
          ['offer.dates: 123456789 TO 987654321', 'offer.dates: 123 TO 1234'],
        ],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with all given search parameters', () => {
      const query = 'searched query'
      const offerCategories = ['LECON', 'MUSEES_VISITES_CULTURELLES']
      const page = 2

      fetchOffers({
        parameters: {
          query,
          offerCategories,
          isDigital: true,
          page,
        } as SearchQueryParameters,
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode: LocationMode.AROUND_ME,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: page,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupNamev2:LECON', 'offer.searchGroupNamev2:MUSEES_VISITES_CULTURELLES'],
          ['offer.isDigital:true'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    })

    it('should fetch duo offers for categories pratique & spectacle around me', () => {
      const query = ''
      const offerCategories = ['ARTS_LOISIRS_CREATIFS', 'SPECTACLES']
      const offerIsDuo = true
      const priceRange = [5, 40]

      fetchOffers({
        parameters: {
          query,
          offerCategories,
          offerIsDuo,
          priceRange: priceRange as Range<number>,
          isDigital: false,
        } as SearchQueryParameters,
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode: LocationMode.AROUND_ME,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.searchGroupNamev2:ARTS_LOISIRS_CREATIFS', 'offer.searchGroupNamev2:SPECTACLES'],
          ['offer.isDuo:true'],
        ],
        numericFilters: [['offer.prices: 5 TO 40']],
        aroundLatLng: '42, 43',
        aroundRadius: 'all',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    })
  })

  describe('tags', () => {
    it('should fetch with no facetFilters parameter when no tags are provided', () => {
      const tags: string[] = []

      fetchOffers({
        parameters: { tags } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with facetFilters parameter when tags are provided', () => {
      const tags = ['Semaine du 14 juillet', 'Offre cinema spéciale pass culture']

      fetchOffers({
        parameters: { tags } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.tags:Semaine du 14 juillet', 'offer.tags:Offre cinema spéciale pass culture'],
        ],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('hitsPerPage', () => {
    it('should fetch with no hitsPerPage parameter when not provided', () => {
      const hitsPerPage = null

      fetchOffers({
        parameters: { hitsPerPage } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith('', {
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch with hitsPerPage when provided', () => {
      const hitsPerPage = 5

      fetchOffers({
        parameters: { hitsPerPage } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith('', {
        hitsPerPage,
        page: 0,
        attributesToHighlight: [],
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('beginningDatetime & endingDatetime', () => {
    it('should fetch from the beginning datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1).toISOString()
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      fetchOffers({
        parameters: { query, beginningDatetime } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates >= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch until the ending datetime', () => {
      const endingDatetime = new Date(2020, 8, 1).toISOString()
      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000)

      fetchOffers({
        parameters: { query, endingDatetime } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates <= 1596240000`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })

    it('should fetch from the beginning datetime to the ending datetime', () => {
      const beginningDatetime = new Date(2020, 8, 1).toISOString()
      const endingDatetime = new Date(2020, 8, 2).toISOString()

      const query = ''
      mockGetFromDate.mockReturnValueOnce(1596240000).mockReturnValueOnce(1596326400)

      fetchOffers({
        parameters: {
          query,
          beginningDatetime,
          endingDatetime,
        } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300'], [`offer.dates: 1596240000 TO 1596326400`]],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })

  describe('Index name param', () => {
    it('should fetch Algolia offers index when param not provided', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    })

    it('should fetch a specific Algolia index when param provided', () => {
      const query = 'searched query'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
        indexSearch: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      })

      expect(mockInitIndex).toHaveBeenCalledWith('algoliaTopOffersIndexName')
    })
  })

  describe('isFromOffer param', () => {
    it('should fetch with typoTolerance and distinct when isFromOffer param is true', () => {
      const query = '9782070584628'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
        isFromOffer: true,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        clickAnalytics: true,
        typoTolerance: false,
        distinct: false,
      })
    })

    it('should not fetch with typoTolerance and distinct when isFromOffer is false', () => {
      const query = '9782070584628'

      fetchOffers({
        parameters: { query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
        isFromOffer: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [['offer.isEducational:false']],
        numericFilters: [['offer.prices: 0 TO 300']],
        clickAnalytics: true,
      })
    })
  })

  describe('allocineId is taken into account', () => {
    it('should fetch with allocineId', () => {
      const allocineId = 12345
      const query = ''

      fetchOffers({
        parameters: { allocineId, query } as SearchQueryParameters,
        buildLocationParameterParams,
        isUserUnderage: false,
      })

      expect(search).toHaveBeenCalledWith(query, {
        facetFilters: [['offer.isEducational:false'], ['offer.allocineId:12345']],
        numericFilters: [['offer.prices: 0 TO 300']],
        page: 0,
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        clickAnalytics: true,
      })
    })
  })
})
