jest.mock('algoliasearch/lite', () => {
  const mockSearch = jest.fn().mockResolvedValue({ results: [] })
  const mockSearchForHits = jest.fn().mockResolvedValue({ results: [] })

  return {
    liteClient: jest.fn(() => ({
      search: mockSearch,
      searchForHits: mockSearchForHits,
    })),
    __mockSearch: mockSearch,
    __mockSearchForHits: mockSearchForHits,
  }
})

import { client } from 'libs/algolia/fetchAlgolia/clients'

const { __mockSearch: mockSearch, __mockSearchForHits: mockSearchForHits } =
  jest.requireMock('algoliasearch/lite')

describe('Algolia client wrapper', () => {
  beforeEach(() => {
    mockSearch.mockClear()
    mockSearchForHits.mockClear()
  })

  describe('search', () => {
    it('should inject analytics: false by default on all requests', async () => {
      await client.search({
        requests: [
          { indexName: 'offers', query: 'test' },
          { indexName: 'venues', query: '' },
        ],
      })

      expect(mockSearch).toHaveBeenCalledWith(
        {
          requests: [
            { analytics: false, indexName: 'offers', query: 'test' },
            { analytics: false, indexName: 'venues', query: '' },
          ],
        },
        undefined
      )
    })

    it('should allow queries to override analytics to true', async () => {
      await client.search({
        requests: [
          { indexName: 'offers', query: 'test', analytics: true },
          { indexName: 'venues', query: '' },
        ],
      })

      expect(mockSearch).toHaveBeenCalledWith(
        {
          requests: [
            { analytics: true, indexName: 'offers', query: 'test' },
            { analytics: false, indexName: 'venues', query: '' },
          ],
        },
        undefined
      )
    })
  })

  describe('searchForHits', () => {
    it('should inject analytics: false by default on all requests', async () => {
      await client.searchForHits({
        requests: [{ indexName: 'offers', query: 'test' }],
      })

      expect(mockSearchForHits).toHaveBeenCalledWith(
        {
          requests: [{ analytics: false, indexName: 'offers', query: 'test' }],
        },
        undefined
      )
    })

    it('should allow queries to override analytics to true', async () => {
      await client.searchForHits({
        requests: [{ indexName: 'offers', query: 'test', analytics: true }],
      })

      expect(mockSearchForHits).toHaveBeenCalledWith(
        {
          requests: [{ analytics: true, indexName: 'offers', query: 'test' }],
        },
        undefined
      )
    })
  })
})
