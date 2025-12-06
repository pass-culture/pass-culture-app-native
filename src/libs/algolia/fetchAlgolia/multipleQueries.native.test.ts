/* eslint-disable local-rules/no-use-of-algolia-multiple-queries */
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'

jest.spyOn(client, 'search')

describe('multipleQueries', () => {
  it('should call client.search several times if too many queries are provided', () => {
    const queries = Array(51).fill({ indexName: 'indexName', query: 'query' })

    multipleQueries(queries)

    expect(client.search).toHaveBeenCalledTimes(2)
  })
})
