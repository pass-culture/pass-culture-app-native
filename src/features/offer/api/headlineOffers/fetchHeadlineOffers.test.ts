import { fetchHeadlineOffersCount } from 'features/offer/api/headlineOffers/fetchHeadlineOffersCount'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { waitFor } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearchForHits = client.searchForHits as jest.Mock
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

describe('fetchHeadlineOffers', () => {
  beforeEach(() => {
    mockSearchForHits.mockResolvedValue({ results: [{ nbHits: 0 }] })
  })

  it('should fetch headline offer when there an offer', async () => {
    await fetchHeadlineOffersCount(offerResponseSnap)

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          query: '',
          attributesToHighlight: [],
          attributesToRetrieve: [],
          distinct: false,
          hitsPerPage: 100,
          page: 0,
        }),
      ],
    })
  })

  it('should not fetch headline offer when there is not an offer', async () => {
    await fetchHeadlineOffersCount(undefined)

    expect(mockSearchForHits).not.toHaveBeenCalled()
  })

  it('should catch an error', async () => {
    const error = new Error('Async error')
    mockSearchForHits.mockRejectedValueOnce(error)
    await fetchHeadlineOffersCount(offerResponseSnap)

    await waitFor(async () => {
      expect(captureAlgoliaError).toHaveBeenCalledWith(error)
    })
  })
})
