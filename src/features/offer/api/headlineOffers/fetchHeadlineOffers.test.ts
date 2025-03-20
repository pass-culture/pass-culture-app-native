import algoliasearch from 'algoliasearch'

import { fetchHeadlineOffersCount } from 'features/offer/api/headlineOffers/fetchHeadlineOffersCount'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { waitFor } from 'tests/utils'

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

describe('fetchHeadlineOffers', () => {
  it('should fetch headline offer when there an offer', () => {
    fetchHeadlineOffersCount(offerResponseSnap)

    expect(search).toHaveBeenCalledWith('', {
      attributesToHighlight: [],
      attributesToRetrieve: [],
      distinct: false,
      facetFilters: [['offer.isEducational:false'], ['offer.isHeadline:true']],
      hitsPerPage: 100,
      numericFilters: [['offer.prices: 0 TO 300']],
      page: 0,
    })
  })

  it('should not fetch headline offer when there is not an offer', () => {
    fetchHeadlineOffersCount(undefined)

    expect(search).not.toHaveBeenCalled()
  })

  it('should catch an error', async () => {
    const error = new Error('Async error')
    search.mockRejectedValueOnce(error)
    fetchHeadlineOffersCount(offerResponseSnap)

    await waitFor(async () => {
      expect(captureAlgoliaError).toHaveBeenCalledWith(error)
    })
  })
})
