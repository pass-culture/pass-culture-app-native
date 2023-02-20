import algoliasearch from 'algoliasearch'

import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { fetchOfferHits } from 'libs/algolia/fetchAlgolia/fetchOfferHits'
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

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock

describe('fetchOfferHits', () => {
  it('should fetch with default search params', () => {
    const queryIds = ['id1', 'id2']

    fetchOfferHits({ objectIds: queryIds, isUserUnderage: false })

    expect(mockInitIndex).toHaveBeenCalledWith('algoliaOffersIndexName')
    expect(search).toHaveBeenCalledWith('', {
      facetFilters: [['offer.isEducational:false'], ['objectID:id1', 'objectID:id2']],
      numericFilters: [['offer.prices: 0 TO 300']],
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [],
      page: 0,
      hitsPerPage: 2,
    })
  })

  it('should fetch with underage search params', () => {
    const queryIds = ['id1', 'id2']
    fetchOfferHits({ objectIds: queryIds, isUserUnderage: true })

    expect(search).toHaveBeenCalledWith('', {
      facetFilters: [
        ['offer.isEducational:false'],
        ['offer.isForbiddenToUnderage:false'],
        ['objectID:id1', 'objectID:id2'],
      ],
      numericFilters: [['offer.prices: 0 TO 300']],
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [],
      page: 0,
      hitsPerPage: 2,
    })
  })
})
