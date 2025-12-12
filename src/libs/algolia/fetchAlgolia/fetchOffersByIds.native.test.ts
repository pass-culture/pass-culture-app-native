import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { env } from 'libs/environment/env'
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

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearchForHits = client.searchForHits as jest.Mock

describe('fetchOffersByIds', () => {
  beforeEach(() => {
    mockSearchForHits.mockResolvedValue({ results: [{ hits: [], nbHits: 0 }] })
  })

  it('should fetch with default search params', async () => {
    const queryIds = ['id1', 'id2']

    await fetchOffersByIds({ objectIds: queryIds, isUserUnderage: false })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
          query: '',
          facetFilters: [['offer.isEducational:false'], ['objectID:id1', 'objectID:id2']],
          numericFilters: [['offer.prices: 0 TO 300']],
          attributesToRetrieve: offerAttributesToRetrieve,
          attributesToHighlight: [],
          page: 0,
          hitsPerPage: 2,
        }),
      ],
    })
  })

  it('should fetch with underage search params', async () => {
    const queryIds = ['id1', 'id2']
    await fetchOffersByIds({ objectIds: queryIds, isUserUnderage: true })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          query: '',
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
        }),
      ],
    })
  })
})
