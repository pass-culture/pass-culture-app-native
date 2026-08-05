/* eslint-disable local-rules/no-use-of-algolia-multiple-queries */
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearch = client.search as jest.Mock
mockSearch.mockResolvedValue({ results: [] })

describe('multipleQueries', () => {
  it('should call client.search several times if too many queries are provided', async () => {
    const queries = Array(51).fill({ indexName: 'indexName', query: 'query' })

    await multipleQueries(queries)

    expect(mockSearch).toHaveBeenCalledTimes(2)
  })
})
