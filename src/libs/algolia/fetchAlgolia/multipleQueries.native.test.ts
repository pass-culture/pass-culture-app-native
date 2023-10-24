/* eslint-disable local-rules/no-use-of-algolia-multiple-queries */
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'

jest.spyOn(client, 'multipleQueries')

describe('multipleQueries', () => {
  it('should call client.multipleQueries several times if too many queries are provided', () => {
    const queries = Array(51).fill({ indexName: 'indexName', query: 'query', params: {} })

    multipleQueries(queries)

    expect(client.multipleQueries).toHaveBeenCalledTimes(2)
  })
})
